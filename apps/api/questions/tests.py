from __future__ import annotations

import json
from pathlib import Path

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.management import call_command
from django.test import TestCase
from rest_framework.test import APIClient

from taxonomy.models import TaxonomyNode
from .grading import grade_response
from .models import Question, QuestionObjective, QuestionReview, QuestionVersion
from .services import import_document


class QuestionBankTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("import_taxonomy")
        User = get_user_model()
        cls.editor = User.objects.create_user(
            email="day13-editor@example.com",
            password="StrongPass123!",
            role="editor",
        )
        cls.learner = User.objects.create_user(
            email="day13-learner@example.com",
            password="StrongPass123!",
            role="learner",
        )
        cls.support = User.objects.create_user(
            email="day13-support@example.com",
            password="StrongPass123!",
            role="support",
        )
        cls.objective = TaxonomyNode.objects.filter(
            kind=TaxonomyNode.Kind.OBJECTIVE,
            status=TaxonomyNode.Status.ACTIVE,
        ).first()
        cls.skill = TaxonomyNode.objects.filter(
            kind=TaxonomyNode.Kind.SKILL,
            status=TaxonomyNode.Status.ACTIVE,
        ).first()

    def setUp(self):
        self.client = APIClient()

    def make_version(
        self,
        *,
        slug="day13-test-question",
        license_type=QuestionVersion.LicenseType.ORIGINAL,
        qtype=QuestionVersion.QuestionType.SHORT_ANSWER,
    ):
        question = Question.objects.create(slug=slug, created_by=self.editor)
        version = QuestionVersion.objects.create(
            question=question,
            version_number=1,
            question_type=qtype,
            title_fa="نمونه",
            title_en="Sample",
            prompt_fa="پاسخ را وارد کنید.",
            prompt_en="Type hello.",
            instructions_fa="پاسخ کوتاه بنویسید.",
            instructions_en="Write a short answer.",
            cefr_level="A1",
            difficulty=1,
            learner_payload={},
            answer_key={"accepted": ["hello"], "strip_punctuation": True},
            explanation_fa="پاسخ پذیرفته‌شده hello است.",
            explanation_en="The accepted answer is hello.",
            source_origin=QuestionVersion.SourceOrigin.ORIGINAL,
            source_title="Endoora Day 13 original test fixture",
            license_type=license_type,
            rights_holder="Endoora",
            author=self.editor,
        )
        QuestionObjective.objects.create(
            version=version,
            objective=self.objective,
            is_primary=True,
        )
        return version

    def test_all_nine_question_types_exist(self):
        self.assertEqual(
            {value for value, _ in QuestionVersion.QuestionType.choices},
            {
                "mcq", "multi_select", "gap", "matching", "ordering",
                "short_answer", "long_writing", "audio", "speaking",
            },
        )

    def test_published_version_content_is_immutable(self):
        version = self.make_version()
        version.publish(self.editor)
        version.prompt_en = "Tampered prompt."
        with self.assertRaises(ValidationError):
            version.save()

    def test_direct_protected_status_transition_is_blocked(self):
        version = self.make_version(slug="day13-controlled-status")
        version.status = QuestionVersion.Status.PUBLISHED
        with self.assertRaises(ValidationError):
            version.save()

    def test_publishing_new_version_retires_previous_current_version(self):
        first = self.make_version(slug="day13-version-switch")
        first.publish(self.editor)

        second = QuestionVersion.objects.create(
            question=first.question,
            version_number=2,
            question_type=QuestionVersion.QuestionType.SHORT_ANSWER,
            title_fa="نسخه دوم",
            title_en="Second version",
            prompt_fa="پاسخ را وارد کنید.",
            prompt_en="Type hello again.",
            instructions_fa="پاسخ کوتاه بنویسید.",
            instructions_en="Write a short answer.",
            cefr_level="A1",
            difficulty=1,
            learner_payload={},
            answer_key={"accepted": ["hello"]},
            explanation_fa="پاسخ hello است.",
            explanation_en="The answer is hello.",
            source_origin=QuestionVersion.SourceOrigin.ORIGINAL,
            source_title="Endoora Day 13 original test fixture",
            license_type=QuestionVersion.LicenseType.ORIGINAL,
            rights_holder="Endoora",
            author=self.editor,
        )
        QuestionObjective.objects.create(
            version=second,
            objective=self.objective,
            is_primary=True,
        )
        second.publish(self.editor)

        first.refresh_from_db()
        first.question.refresh_from_db()
        self.assertEqual(first.status, QuestionVersion.Status.RETIRED)
        self.assertEqual(first.question.current_published_version_id, second.id)

    def test_unlicensed_content_cannot_publish(self):
        version = self.make_version(
            slug="day13-unlicensed",
            license_type=QuestionVersion.LicenseType.UNSPECIFIED,
        )
        with self.assertRaises(ValidationError):
            version.publish(self.editor)

    def test_wrong_taxonomy_kind_cannot_be_linked(self):
        version = self.make_version(slug="day13-wrong-objective")
        link = QuestionObjective(version=version, objective=self.skill)
        with self.assertRaises(ValidationError):
            link.full_clean()

    def test_answer_normalization_is_conservative_and_safe(self):
        version = self.make_version(slug="day13-normalization")
        result = grade_response(version, "  HELLO!!! ")
        self.assertEqual(result, {"status": "scored", "correct": True})
        self.assertFalse(grade_response(version, "goodbye")["correct"])

    def test_pre_submission_payload_never_contains_protected_fields(self):
        version = self.make_version(slug="day13-safe-payload")
        version.publish(self.editor)

        self.client.force_authenticate(self.learner)
        response = self.client.get(f"/api/questions/published/{version.id}/")

        self.assertEqual(response.status_code, 200)

        serialized = json.dumps(response.data)
        for forbidden in (
                "answer_key",
                "accepted_variants",
                "rubric",
                "explanation_fa",
                "explanation_en",
        ):
            self.assertNotIn(forbidden, serialized)

    def test_anonymous_cannot_browse_or_preview_question_bank(self):
        version = self.make_version(slug="day13-no-anonymous-bank")
        version.publish(self.editor)
        list_response = self.client.get("/api/questions/published/")
        detail_response = self.client.get(f"/api/questions/published/{version.id}/")
        self.assertIn(list_response.status_code, {401, 403})
        self.assertIn(detail_response.status_code, {401, 403})

    def test_learner_payload_rejects_embedded_answer_key(self):
        version = self.make_version(slug="day13-embedded-answer")
        version.learner_payload = {"options": [{"id": "a", "is_correct": True}]}
        with self.assertRaises(ValidationError):
            version.full_clean()

        for forbidden_key in ("correct_option", "solution", "explanation", "pairs", "order"):
            version.learner_payload = {"data": {forbidden_key: "leaked_value"}}
            with self.assertRaises(ValidationError):
                version.full_clean()

    def test_submission_reveals_feedback_without_raw_answer_key(self):
        version = self.make_version(slug="day13-submit-feedback")
        version.publish(self.editor)
        self.client.force_authenticate(self.learner)
        response = self.client.post(
            f"/api/questions/published/{version.id}/check/",
            {"response": "hello"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["correct"])
        self.assertIn("explanation", response.data)
        self.assertNotIn("answer_key", response.data)
        self.assertNotIn("accepted_variants", response.data)

    def test_support_cannot_use_editor_api(self):
        version = self.make_version(slug="day13-permission")
        self.client.force_authenticate(self.support)
        denied = self.client.get(f"/api/questions/editor/versions/{version.id}/")
        self.assertEqual(denied.status_code, 403)

        self.client.force_authenticate(self.editor)
        allowed = self.client.get(f"/api/questions/editor/versions/{version.id}/")
        self.assertEqual(allowed.status_code, 200)
        self.assertIn("answer_key", allowed.data)

    def test_retired_version_remains_historical_but_not_public(self):
        version = self.make_version(slug="day13-retire")
        version.publish(self.editor)
        version.retire(self.editor, "Superseded.")

        self.assertTrue(
            QuestionVersion.objects.filter(pk=version.pk).exists()
        )

        self.assertEqual(
            QuestionReview.objects.filter(
                version=version,
                decision="retired",
            ).count(),
            1,
        )

        self.client.force_authenticate(self.learner)

        response = self.client.get(
            f"/api/questions/published/{version.id}/"
        )
        self.assertEqual(response.status_code, 404)

        with self.assertRaises(ValidationError):
            version.delete()

    def test_sample_import_is_draft_only_and_idempotent(self):
        path = (
            Path(settings.REPO_ROOT)
            / "data"
            / "questions"
            / "endoora_day13_samples.v1.json"
        )
        document = json.loads(path.read_text(encoding="utf-8"))
        self.assertEqual(
            import_document(document, author=self.editor),
            {"created": 2, "skipped": 0},
        )
        self.assertEqual(
            import_document(document, author=self.editor),
            {"created": 0, "skipped": 2},
        )
        imported = QuestionVersion.objects.filter(
            question__slug__startswith="day13-sample-"
        )
        self.assertEqual(imported.count(), 2)
        self.assertTrue(
            all(item.status == QuestionVersion.Status.DRAFT for item in imported)
        )

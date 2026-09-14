from decimal import Decimal
from django.core.exceptions import ValidationError
from django.core.management import call_command
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from accounts.models import User
from ielts.models import (
    IELTSTest,
    IELTSTestType,
    IELTSTestStatus,
    IELTSSection,
    IELTSSectionType,
    IELTSPassageTask,
    IELTSQuestionGroup,
    IELTSQuestion,
    IELTSQuestionType,
    IELTSTestSession,
    IELTSAttemptStatus,
    IELTSPracticeMode,
    MANDATORY_IELTS_DISCLAIMER,
)
from ielts.services import (
    submit_test_for_review,
    review_and_approve_test,
    publish_test,
    clone_test_new_version,
    evaluate_ielts_answer,
    normalize_ielts_answer,
)
from ielts.session_services import (
    start_or_resume_session,
    record_answer,
    toggle_flag,
    advance_section,
    submit_session,
    compile_full_diagnostic_report,
)


class IELTSContentModelTests(TestCase):
    def setUp(self):
        self.author = User.objects.create_user(
            email="author@example.com",
            password="StrongPassword123!",
            first_name="Farhad",
            last_name="Author",
            role=User.Role.EDITOR,
            is_staff=True,
        )
        self.reviewer = User.objects.create_user(
            email="reviewer@example.com",
            password="StrongPassword123!",
            first_name="Sahar",
            last_name="Reviewer",
            role=User.Role.ADMINISTRATOR,
            is_staff=True,
        )
        self.learner = User.objects.create_user(
            email="learner@example.com",
            password="StrongPassword123!",
            first_name="Ali",
            last_name="Learner",
            role=User.Role.LEARNER,
        )

        # Create basic draft test
        self.test = IELTSTest.objects.create(
            title_en="Original IELTS Academic Practice Test 1",
            title_fa="آزمون آزمایشی شماره ۱ آیلتس آکادمیک",
            test_type=IELTSTestType.ACADEMIC,
            version=1,
            status=IELTSTestStatus.DRAFT,
            author=self.author,
            copyright_source="100% Original Endoora Academic Material. Audited by Editorial Board.",
            disclaimer_label=MANDATORY_IELTS_DISCLAIMER,
        )

        # Create section
        self.section = IELTSSection.objects.create(
            test=self.test,
            section_type=IELTSSectionType.READING,
            order=1,
            duration_minutes=60,
        )

        # Create passage
        self.passage = IELTSPassageTask.objects.create(
            section=self.section,
            order=1,
            title="Urban Heat Islands",
            content_text="Sample passage text about urban microclimates...",
            word_count=500,
        )

        # Create question group
        self.group = IELTSQuestionGroup.objects.create(
            passage_task=self.passage,
            question_type=IELTSQuestionType.TRUE_FALSE_NOT_GIVEN,
            order=1,
            instructions="Write TRUE, FALSE or NOT GIVEN.",
        )

        # Create question
        self.question = IELTSQuestion.objects.create(
            group=self.group,
            question_number=1,
            prompt_text="Reflective roofs lower surface temperatures.",
            correct_answers=["true", "t"],
            explanation="Confirmed in paragraph 2.",
            max_score=Decimal("1.00"),
        )

        self.valid_checklist = {
            "zero_copyright_infringement": True,
            "cefr_calibrated": True,
            "answer_key_verified": True,
            "audio_script_verified": True,
            "typo_and_formatting_checked": True,
        }

    def test_two_person_review_gate_enforcement(self):
        """Author cannot approve their own test; independent reviewer is required."""
        submit_test_for_review(self.test, self.author)
        self.assertEqual(self.test.status, IELTSTestStatus.IN_REVIEW)

        # Attempt review by author must raise ValidationError
        with self.assertRaises(ValidationError) as ctx:
            review_and_approve_test(
                test=self.test,
                reviewer=self.author,
                checklist=self.valid_checklist,
                notes="Self-approval attempt",
            )
        self.assertIn("Two-Person Review", str(ctx.exception))

        # Review by distinct reviewer succeeds
        approved_test = review_and_approve_test(
            test=self.test,
            reviewer=self.reviewer,
            checklist=self.valid_checklist,
            notes="Passed editorial review.",
        )
        self.assertEqual(approved_test.status, IELTSTestStatus.APPROVED)
        self.assertEqual(approved_test.reviewed_by, self.reviewer)
        self.assertIsNotNone(approved_test.reviewed_at)

    def test_cannot_publish_unreviewed_or_incomplete_test(self):
        """A draft test cannot be published directly without approval."""
        with self.assertRaises(ValidationError):
            publish_test(self.test, self.author)

    def test_publishing_locks_test_and_requires_disclaimer(self):
        """Publishing successfully locks the test and validates disclaimer."""
        submit_test_for_review(self.test, self.author)
        review_and_approve_test(
            test=self.test,
            reviewer=self.reviewer,
            checklist=self.valid_checklist,
            notes="Ready for release.",
        )

        published = publish_test(self.test, self.reviewer)
        self.assertEqual(published.status, IELTSTestStatus.PUBLISHED)
        self.assertTrue(published.is_locked)

    def test_publishing_fails_with_invalid_disclaimer(self):
        """Publishing fails if disclaimer does not contain mandatory official disclaimer text."""
        submit_test_for_review(self.test, self.author)
        review_and_approve_test(
            test=self.test,
            reviewer=self.reviewer,
            checklist=self.valid_checklist,
        )
        self.test.disclaimer_label = "Official British Council Exam"
        self.test.save()

        with self.assertRaises(ValidationError) as ctx:
            publish_test(self.test, self.reviewer)
        self.assertTrue(any("شبیه‌ساز غیررسمی آیلتس" in m for m in ctx.exception.messages))

    def test_clone_creates_new_version_with_isolation(self):
        """Cloning creates version + 1 as editable DRAFT with all sections and questions deep-copied."""
        # Publish first
        submit_test_for_review(self.test, self.author)
        review_and_approve_test(
            test=self.test,
            reviewer=self.reviewer,
            checklist=self.valid_checklist,
        )
        publish_test(self.test, self.reviewer)

        # Clone into version 2
        cloned = clone_test_new_version(self.test, self.author)
        self.assertEqual(cloned.version, 2)
        self.assertEqual(cloned.status, IELTSTestStatus.DRAFT)
        self.assertFalse(cloned.is_locked)
        self.assertIsNone(cloned.reviewed_by)
        self.assertIsNone(cloned.reviewed_at)

        # Verify deep copy of questions
        cloned_questions = IELTSQuestion.objects.filter(
            group__passage_task__section__test=cloned
        )
        self.assertEqual(cloned_questions.count(), 1)
        cloned_q = cloned_questions.first()
        self.assertEqual(cloned_q.question_number, 1)
        self.assertNotEqual(cloned_q.id, self.question.id)

    def test_answer_normalization_and_evaluation(self):
        """Answer normalization handles trailing punctuation, whitespace, and case sensitivity."""
        self.assertEqual(normalize_ielts_answer("  True.  "), "true")
        self.assertEqual(normalize_ielts_answer("WATER   VAPOR!"), "water vapor")

        # Check correct matching
        is_correct, score = evaluate_ielts_answer(self.question, "True")
        self.assertTrue(is_correct)
        self.assertEqual(score, Decimal("1.00"))

        is_correct, score = evaluate_ielts_answer(self.question, "t")
        self.assertTrue(is_correct)

        is_correct, score = evaluate_ielts_answer(self.question, "FALSE")
        self.assertFalse(is_correct)
        self.assertEqual(score, Decimal("0.00"))

    def test_admin_api_workflow(self):
        """Test API endpoints for test lifecycle."""
        client = APIClient()

        # Learner cannot access admin endpoint
        client.force_authenticate(user=self.learner)
        resp = client.get("/api/ielts/tests/")
        self.assertEqual(resp.status_code, 403)

        # Editor can list and view
        client.force_authenticate(user=self.author)
        resp = client.get("/api/ielts/tests/")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(len(resp.data), 1)

        # Submit review via API
        resp = client.post(f"/api/ielts/tests/{self.test.id}/submit-review/")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["status"], "in_review")

        # Author cannot approve via API
        resp = client.post(
            f"/api/ielts/tests/{self.test.id}/approve/",
            data={"checklist": self.valid_checklist, "notes": "Self approval"},
            format="json",
        )
        self.assertEqual(resp.status_code, 400)

        # Independent reviewer approves via API
        client.force_authenticate(user=self.reviewer)
        resp = client.post(
            f"/api/ielts/tests/{self.test.id}/approve/",
            data={"checklist": self.valid_checklist, "notes": "Approved by peer"},
            format="json",
        )
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["status"], "approved")

        # Publish via API
        resp = client.post(f"/api/ielts/tests/{self.test.id}/publish/")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["status"], "published")
        self.assertTrue(resp.data["is_locked"])

        # Public catalog lists published test
        anon_client = APIClient()
        resp = anon_client.get("/api/ielts/public/tests/")
        self.assertEqual(resp.status_code, 200)
        self.assertIn("disclaimer", resp.data)
        self.assertEqual(len(resp.data["results"]), 1)

    def test_seed_ielts_mini_test_command(self):
        """Seed command generates 100% original Academic mini-test with 4 sections, 19 questions, and band descriptors."""
        call_command("seed_ielts_mini_test")

        seeded_test = IELTSTest.objects.filter(title_en__icontains="Diagnostic Simulation 01").first()
        self.assertIsNotNone(seeded_test)
        self.assertEqual(seeded_test.status, IELTSTestStatus.PUBLISHED)
        self.assertTrue(seeded_test.is_locked)
        self.assertNotEqual(seeded_test.author_id, seeded_test.reviewed_by_id)

        # Verify sections
        section_types = list(seeded_test.sections.values_list("section_type", flat=True))
        self.assertIn(IELTSSectionType.LISTENING, section_types)
        self.assertIn(IELTSSectionType.READING, section_types)
        self.assertIn(IELTSSectionType.WRITING, section_types)
        self.assertIn(IELTSSectionType.SPEAKING, section_types)

        # Verify question count
        q_count = IELTSQuestion.objects.filter(group__passage_task__section__test=seeded_test).count()
        self.assertEqual(q_count, 19)

    def test_start_and_resume_learner_session(self):
        """Learner can start and resume a timed practice session on a published test."""
        submit_test_for_review(self.test, self.author)
        review_and_approve_test(self.test, self.reviewer, self.valid_checklist)
        publish_test(self.test, self.reviewer)

        # Start session
        session = start_or_resume_session(self.learner, str(self.test.id))
        self.assertEqual(session.status, IELTSAttemptStatus.IN_PROGRESS)
        self.assertEqual(session.current_section_index, 0)
        self.assertGreater(session.time_remaining_seconds, 0)

        # Resuming returns the same session
        resumed = start_or_resume_session(self.learner, str(self.test.id))
        self.assertEqual(session.id, resumed.id)

    def test_cannot_start_session_on_draft_test(self):
        """Draft unapproved tests cannot be started by learners."""
        with self.assertRaises(ValidationError):
            start_or_resume_session(self.learner, str(self.test.id))

    def test_learner_active_session_security_boundary(self):
        """Active session endpoint must NEVER leak correct_answers or explanation."""
        submit_test_for_review(self.test, self.author)
        review_and_approve_test(self.test, self.reviewer, self.valid_checklist)
        publish_test(self.test, self.reviewer)

        session = start_or_resume_session(self.learner, str(self.test.id))

        client = APIClient()
        client.force_authenticate(user=self.learner)
        resp = client.get(f"/api/ielts/sessions/{session.id}/")
        self.assertEqual(resp.status_code, 200)

        # Traverse questions in payload
        section_data = resp.data["sections"][0]
        q_data = section_data["passages_tasks"][0]["question_groups"][0]["questions"][0]

        self.assertNotIn("correct_answers", q_data)
        self.assertNotIn("explanation", q_data)
        self.assertEqual(q_data["prompt_text"], self.question.prompt_text)

    def test_session_autosave_and_submission_workflow(self):
        """Learner records answers, flags questions, and submits session for diagnostic grading."""
        submit_test_for_review(self.test, self.author)
        review_and_approve_test(self.test, self.reviewer, self.valid_checklist)
        publish_test(self.test, self.reviewer)

        session = start_or_resume_session(self.learner, str(self.test.id))

        client = APIClient()
        client.force_authenticate(user=self.learner)

        # Record answer via API
        resp = client.post(
            f"/api/ielts/sessions/{session.id}/answer/",
            data={"question_id": str(self.question.id), "answer": "TRUE"},
            format="json",
        )
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp.data["success"])

        # Flag question via API
        resp = client.post(
            f"/api/ielts/sessions/{session.id}/flag/",
            data={"question_id": str(self.question.id)},
            format="json",
        )
        self.assertEqual(resp.status_code, 200)
        self.assertIn(str(self.question.id), resp.data["flagged_questions"])

        # Submit session
        resp = client.post(f"/api/ielts/sessions/{session.id}/submit/")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["status"], "submitted")
        self.assertGreaterEqual(resp.data["scaled_band_score"], 1.0)

        # Get full diagnostic report
        resp = client.get(f"/api/ielts/sessions/{session.id}/report/")
        self.assertEqual(resp.status_code, 200)
        self.assertIn("diagnostics", resp.data)
        self.assertIn("section_scores", resp.data)
        self.assertIn("questions", resp.data)

        # In report, correct_answers and explanation ARE now visible
        reported_q = resp.data["questions"][0]
        self.assertEqual(reported_q["candidate_answer"], "TRUE")
        self.assertTrue(reported_q["is_correct"])
        self.assertIn("correct_answers", reported_q)
        self.assertIn("explanation", reported_q)



from datetime import timedelta
from io import StringIO
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.management import call_command
from django.test import TestCase
from django.utils import timezone
from .clinic import build_unit, release_clinic
from .editor import copy_edition, publish
from .metrics import weekly_metrics
from .models import Answer, ClinicRevision, Edition, Journey, SupportTime
from .starter import populate
from ielts.models import PracticeRelease

ROOT = "/ielts/reading/"


class ReadingPathTests(TestCase):
    def setUp(self):
        self.owner = get_user_model().objects.create_superuser(
            "owner@example.org", "example-pass"
        )
        self.learner = get_user_model().objects.create_user(
            "learner@example.org", "example-pass"
        )
        self.edition = Edition.objects.create(title="Starter")
        populate(self.edition)
        publish(self.edition, self.owner)

    def post_step(self, path, wrong=False, extra=None):
        response = self.client.get(ROOT + path)
        self.assertEqual(response.status_code, 200)
        items = response.context["items"]
        payload = {
            q.code: next(k for k in "ABC" if k != q.key) if wrong else q.key
            for q in items
        }
        payload.update({"edition": self.edition.pk, "actor": response.context["actor"]})
        payload.update(extra or {})
        return self.client.post(ROOT + path, payload)

    def test_guest_to_account_and_duplicate_submission(self):
        self.assertEqual(self.post_step("false-not-given/", True).status_code, 302)
        self.assertEqual(self.post_step("false-not-given/", True).status_code, 302)
        self.assertEqual(self.post_step("false-not-given/").status_code, 409)
        self.assertFalse(Journey.objects.exists())
        self.client.force_login(self.learner)
        self.client.get(ROOT)
        self.assertEqual(
            Answer.objects.filter(journey__learner=self.learner).count(), 3
        )
        self.assertEqual(len(self.client.get(ROOT + "notebook/").context["rows"]), 3)
        self.client.force_login(self.owner)
        self.assertFalse(self.client.get(ROOT + "notebook/").context["rows"].exists())

    def test_unseen_retest_due_and_progress(self):
        self.client.force_login(self.learner)
        self.assertEqual(self.client.get(ROOT + "retest/evidence/").status_code, 403)
        self.assertEqual(self.post_step("diagnostic/", True).status_code, 302)
        dash = self.client.get(ROOT).context
        self.assertEqual(dash["next_lesson"]["key"], "evidence")
        self.assertEqual(self.post_step("lesson/evidence/").status_code, 302)
        self.assertEqual(self.client.get(ROOT + "retest/evidence/").status_code, 403)
        Answer.objects.filter(item__stage="lesson").update(
            submitted_at=timezone.now() - timedelta(hours=73)
        )
        self.assertEqual(self.post_step("retest/evidence/").status_code, 302)
        self.assertEqual(self.post_step("retest/evidence/").status_code, 302)
        dash = self.client.get(ROOT).context
        self.assertEqual(dash["total"], 10)
        self.assertEqual(dash["skills"][0]["fresh_correct"], 2)
        SupportTime.objects.create(minutes=8)
        report = weekly_metrics(timezone.localdate())
        self.assertEqual(
            (
                report["diagnostic"],
                report["lesson"],
                report["retest_items"],
                report["support_minutes"],
            ),
            (1, 1, 2, 8),
        )

    def test_revision_publish_compare_and_withdraw(self):
        self.client.force_login(self.owner)
        self.client.get(ROOT)
        draft = copy_edition(self.edition)
        q = draft.items.first()
        q.evidence = "invented quote"
        q.save()
        with self.assertRaises(ValidationError):
            publish(draft, self.owner)
        self.assertContains(
            self.client.get(f"/admin/reading_path/edition/{draft.pk}/preview/"),
            "invented quote",
        )
        q.evidence = q.passage
        q.save()
        publish(draft, self.owner)
        self.assertEqual(self.client.get(ROOT).context["edition"].pk, self.edition.pk)
        Edition.objects.filter(pk=self.edition.pk).update(state="withdrawn")
        self.assertEqual(self.client.get(ROOT).context["edition"].pk, draft.pk)
        self.assertEqual(self.post_step("diagnostic/").status_code, 409)

    def test_owner_form_retry_and_incomplete_input(self):
        self.client.force_login(self.learner)
        self.assertEqual(
            self.post_step("diagnostic/", extra={"actor": "stale"}).status_code, 409
        )
        self.assertEqual(
            self.post_step("diagnostic/", extra={"diagnostic-04": ""}).status_code, 400
        )
        self.assertFalse(Answer.objects.exists())

    def test_listening_and_reading_evidence_versions(self):
        call_command("seed_clinic_evidence", stdout=StringIO())
        for draft in ClinicRevision.objects.all():
            _, unit = build_unit(draft)
            self.assertTrue(
                all(q["evidence"] in draft.material for q in unit["questions"])
            )
            release_clinic(draft, self.owner)
            url = f"/api/ielts/units/{draft.slug}/"
            initial = self.client.get(url).json()
            self.assertNotIn("evidence", initial["unit"]["questions"][0])
            result = self.client.post(
                url,
                {
                    "owner": None,
                    "answers": {q["id"]: q["answer"] for q in unit["questions"]},
                    "action": "finish",
                },
                content_type="application/json",
            ).json()["result"]
            self.assertEqual(result["correct"], 6)
            self.assertEqual(len(result["items"][0]["choice_reasons"]), 3)
            if unit["skill"] == "listening":
                self.assertLess(
                    result["items"][0]["start_ms"], result["items"][0]["end_ms"]
                )
            self.assertTrue(PracticeRelease.objects.get(pk=draft.slug).active)

from io import StringIO
from django.core.management import call_command, CommandError
from django.test import TestCase
from rest_framework.test import APIClient
from accounts.models import User
from ielts.models import PracticeProgress, PracticeIssue
from ielts.practice_content import UNITS, revision


class ReviewedPracticeTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.owner = User.objects.create_superuser("editor@example.org", "unique-owner-pass-123")
        self.member = User.objects.create_user("reader@example.org", "unique-reader-pass-123")
        self.unit = UNITS["rooftop-v1"]
        self.url = "/api/ielts/units/rooftop-v1/"
        self.answers = {q["id"]: q["answer"] for q in self.unit["questions"]}

    def publish(self):
        call_command("review_practice", "publish", "rooftop-v1", reviewer=self.owner.email,
                     digest=revision(self.unit), stdout=StringIO())

    def send(self, action, answers, version=0, owner=None):
        return self.client.post(self.url, {"action": action, "answers": answers, "revision": version,
                                           "owner": str(owner.pk) if owner else None}, format="json")

    def test_publication_withdrawal_and_guest_grade(self):
        self.assertEqual(self.client.get(self.url).status_code, 404)
        with self.assertRaises(CommandError):
            call_command("review_practice", "publish", "rooftop-v1", reviewer=self.owner.email, digest="wrong")
        self.publish()
        public = self.client.get(self.url).data["unit"]
        self.assertNotIn("answer", public["questions"][0])
        self.assertEqual(self.send("finish", {}).status_code, 400)
        self.assertEqual(self.send("save", {}).status_code, 403)
        receipt = self.send("finish", self.answers).data
        self.assertEqual(receipt["result"]["correct"], 6)
        self.assertFalse(receipt["saved"])
        self.assertFalse(PracticeProgress.objects.exists())
        call_command("review_practice", "withdraw", "rooftop-v1", reviewer=self.owner.email, stdout=StringIO())
        self.assertEqual(self.send("finish", self.answers).status_code, 404)

    def test_owner_isolation_conflicts_retries_and_reports(self):
        self.publish()
        self.client.force_authenticate(self.member)
        self.assertEqual(self.send("save", {"r1":"True"}, owner=self.member).data["revision"], 1)
        self.assertEqual(self.send("save", {"r1":"True"}, owner=self.member).data["revision"], 1)
        self.assertEqual(self.send("save", {"r1":"False"}, owner=self.member).status_code, 409)
        self.assertEqual(self.send("save", {"r1":"wrong"}, 1, self.member).status_code, 400)
        answers = {**self.answers, "r1":"False"}
        self.assertEqual(self.send("finish", answers, 1, self.member).data["result"]["correct"], 5)
        self.assertEqual(self.send("finish", answers, 1, self.member).data["revision"], 2)
        self.assertEqual(self.send("save", {}, 2, self.member).status_code, 409)
        for code in [201, 200]:
            response = self.client.post(self.url+"report/", {"question":"r1", "note":"Please clarify."}, format="json")
            self.assertEqual(response.status_code, code)
        self.assertEqual(PracticeIssue.objects.count(), 1)
        self.client.force_authenticate(self.owner)
        self.assertEqual(self.client.get(self.url).data["answers"], {})
        self.assertEqual(self.send("save", {"r1":"True"}, 0, self.member).status_code, 409)

    def test_unique_keys_and_objective_results(self):
        for unit in UNITS.values():
            qs = unit["questions"]
            self.assertEqual(len(qs), len({q["id"] for q in qs}))
            for q in qs:
                self.assertEqual(q["choices"].count(q["answer"]), 1)
                self.assertTrue(q["explanation"])

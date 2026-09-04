import uuid
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from questions.models import Question, QuestionVersion
from taxonomy.models import TaxonomyNode
from .models import PlacementAnswer, PlacementSession

User = get_user_model()


class PlacementSessionEngineTests(APITestCase):
    def setUp(self):
        self.user_a = User.objects.create_user(
            email="learner_a@endoora.ir",
            password="testpassword123",
            role="learner",
        )
        self.user_b = User.objects.create_user(
            email="learner_b@endoora.ir",
            password="testpassword123",
            role="learner",
        )

        from django.core.management import call_command
        call_command("import_taxonomy")
        self.node = TaxonomyNode.objects.filter(kind=TaxonomyNode.Kind.OBJECTIVE).first()
        self.question = Question.objects.create(
            slug="test-placement-question-01",
            created_by=self.user_a,
        )
        self.question_version = QuestionVersion.objects.create(
            question=self.question,
            version_number=1,
            question_type=QuestionVersion.QuestionType.MCQ,
            cefr_level="A1",
            difficulty=1,
            title_fa="سوال تستی",
            title_en="Test Question",
            prompt_fa="صورت سوال",
            prompt_en="Test Prompt",
            status=QuestionVersion.Status.DRAFT,
            learner_payload={"options": [{"id": "a", "text": "Option A"}]},
            answer_key={"correct_option": "a"},
            author=self.user_a,
            reviewer=self.user_a,
            license_type="original",
            rights_holder="Endoora",
        )

    def test_anonymous_access_rejected(self):
        res = self.client.get("/api/placement/sessions/")
        self.assertIn(res.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

        res_q = self.client.get("/api/placement/questions/")
        self.assertIn(res_q.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_start_placement_session(self):
        self.client.force_authenticate(user=self.user_a)
        res = self.client.post("/api/placement/sessions/")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        data = res.json()
        self.assertEqual(data["status"], "active")
        self.assertEqual(data["current_section"], "grammar")
        self.assertTrue(data["is_active"])
        self.assertFalse(data["is_expired"])
        self.assertEqual(data["answers_count"], 0)
        self.assertEqual(len(data["answers"]), 0)

    def test_resume_existing_active_session(self):
        self.client.force_authenticate(user=self.user_a)
        res1 = self.client.post("/api/placement/sessions/")
        self.assertEqual(res1.status_code, status.HTTP_201_CREATED)
        session_id_1 = res1.json()["id"]

        # Re-request start session
        res2 = self.client.post("/api/placement/sessions/")
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        session_id_2 = res2.json()["id"]
        self.assertEqual(session_id_1, session_id_2)

    def test_current_session_endpoint(self):
        self.client.force_authenticate(user=self.user_a)
        res_none = self.client.get("/api/placement/sessions/current/")
        self.assertEqual(res_none.status_code, status.HTTP_404_NOT_FOUND)

        start_res = self.client.post("/api/placement/sessions/")
        session_id = start_res.json()["id"]

        res_curr = self.client.get("/api/placement/sessions/current/")
        self.assertEqual(res_curr.status_code, status.HTTP_200_OK)
        self.assertEqual(res_curr.json()["id"], session_id)

    def test_user_isolation_cannot_access_other_user_session(self):
        self.client.force_authenticate(user=self.user_a)
        start_res = self.client.post("/api/placement/sessions/")
        session_id_a = start_res.json()["id"]

        # Authenticate as User B
        self.client.force_authenticate(user=self.user_b)
        res = self.client.get(f"/api/placement/sessions/{session_id_a}/")
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_isolation_cannot_submit_answer_to_other_user_session(self):
        self.client.force_authenticate(user=self.user_a)
        start_res = self.client.post("/api/placement/sessions/")
        session_id_a = start_res.json()["id"]

        self.client.force_authenticate(user=self.user_b)
        answer_payload = {
            "idempotency_key": str(uuid.uuid4()),
            "question_key": "grammar-a1-001",
            "answer_value": {"selected_option": "goes"},
        }
        res = self.client.post(f"/api/placement/sessions/{session_id_a}/answers/", answer_payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_idempotent_answer_save_with_idempotency_key(self):
        self.client.force_authenticate(user=self.user_a)
        start_res = self.client.post("/api/placement/sessions/")
        session_id = start_res.json()["id"]

        idem_key = str(uuid.uuid4())
        answer_payload = {
            "idempotency_key": idem_key,
            "question_key": "grammar-a1-001",
            "answer_value": {"selected_option": "goes"},
            "question_version_id": str(self.question_version.id),
        }

        # First save
        res1 = self.client.post(f"/api/placement/sessions/{session_id}/answers/", answer_payload, format="json")
        self.assertEqual(res1.status_code, status.HTTP_201_CREATED)
        data1 = res1.json()
        self.assertEqual(data1["question_key"], "grammar-a1-001")
        self.assertEqual(data1["idempotency_key"], idem_key)
        self.assertEqual(data1["question_version_id"], str(self.question_version.id))

        # Re-send exact same payload (network retry)
        res2 = self.client.post(f"/api/placement/sessions/{session_id}/answers/", answer_payload, format="json")
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertEqual(res2.json()["idempotency_key"], idem_key)

        # Verify only 1 row exists in DB
        self.assertEqual(PlacementAnswer.objects.filter(session_id=session_id).count(), 1)

    def test_answer_update_for_same_question(self):
        self.client.force_authenticate(user=self.user_a)
        start_res = self.client.post("/api/placement/sessions/")
        session_id = start_res.json()["id"]

        # Option A
        payload1 = {
            "idempotency_key": str(uuid.uuid4()),
            "question_key": "grammar-a1-001",
            "answer_value": {"selected_option": "go"},
        }
        res1 = self.client.post(f"/api/placement/sessions/{session_id}/answers/", payload1, format="json")
        self.assertEqual(res1.status_code, status.HTTP_201_CREATED)

        # Learner changes mind to Option B
        new_idem = str(uuid.uuid4())
        payload2 = {
            "idempotency_key": new_idem,
            "question_key": "grammar-a1-001",
            "answer_value": {"selected_option": "goes"},
        }
        res2 = self.client.post(f"/api/placement/sessions/{session_id}/answers/", payload2, format="json")
        self.assertEqual(res2.status_code, status.HTTP_200_OK)

        # Total answers count remains 1 and value is updated
        answers = PlacementAnswer.objects.filter(session_id=session_id)
        self.assertEqual(answers.count(), 1)
        self.assertEqual(answers.first().answer_value["selected_option"], "goes")

    def test_expired_session_cannot_save_answer(self):
        self.client.force_authenticate(user=self.user_a)
        start_res = self.client.post("/api/placement/sessions/")
        session_id = start_res.json()["id"]

        # Manually expire the session
        session = PlacementSession.objects.get(pk=session_id)
        session.expires_at = timezone.now() - timedelta(minutes=10)
        session.save()

        answer_payload = {
            "idempotency_key": str(uuid.uuid4()),
            "question_key": "grammar-a1-001",
            "answer_value": {"selected_option": "goes"},
        }
        res = self.client.post(f"/api/placement/sessions/{session_id}/answers/", answer_payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(res.json()["code"], "session_inactive")

        session.refresh_from_db()
        self.assertEqual(session.status, PlacementSession.Status.EXPIRED)

    def test_expired_session_cannot_submit(self):
        self.client.force_authenticate(user=self.user_a)
        start_res = self.client.post("/api/placement/sessions/")
        session_id = start_res.json()["id"]

        session = PlacementSession.objects.get(pk=session_id)
        session.expires_at = timezone.now() - timedelta(minutes=10)
        session.save()

        res = self.client.post(f"/api/placement/sessions/{session_id}/submit/")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(res.json()["code"], "session_expired")

    def test_section_advance(self):
        self.client.force_authenticate(user=self.user_a)
        start_res = self.client.post("/api/placement/sessions/")
        session_id = start_res.json()["id"]

        res = self.client.post(f"/api/placement/sessions/{session_id}/advance/", {"section": "vocabulary"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.json()["current_section"], "vocabulary")

        # Invalid section rejected
        res_bad = self.client.post(f"/api/placement/sessions/{session_id}/advance/", {"section": "invalid_xyz"})
        self.assertEqual(res_bad.status_code, status.HTTP_400_BAD_REQUEST)

    def test_session_submission_and_subsequent_mutation_blocked(self):
        self.client.force_authenticate(user=self.user_a)
        start_res = self.client.post("/api/placement/sessions/")
        session_id = start_res.json()["id"]

        # Add an answer first
        self.client.post(f"/api/placement/sessions/{session_id}/answers/", {
            "idempotency_key": str(uuid.uuid4()),
            "question_key": "grammar-a1-001",
            "answer_value": {"selected_option": "goes"},
        }, format="json")

        # Submit session
        res_submit = self.client.post(f"/api/placement/sessions/{session_id}/submit/")
        self.assertEqual(res_submit.status_code, status.HTTP_200_OK)
        self.assertEqual(res_submit.json()["status"], "submitted")

        # Idempotent re-submit
        res_submit_2 = self.client.post(f"/api/placement/sessions/{session_id}/submit/")
        self.assertEqual(res_submit_2.status_code, status.HTTP_200_OK)

        # Attempt to save new answer after submission is blocked
        res_after = self.client.post(f"/api/placement/sessions/{session_id}/answers/", {
            "idempotency_key": str(uuid.uuid4()),
            "question_key": "vocabulary-a1-001",
            "answer_value": {"selected_option": "library"},
        }, format="json")
        self.assertEqual(res_after.status_code, status.HTTP_400_BAD_REQUEST)

    def test_safe_questions_endpoint_strips_answer_keys(self):
        self.client.force_authenticate(user=self.user_a)
        res = self.client.get("/api/placement/questions/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        items = res.json()
        self.assertGreater(len(items), 0)

        forbidden_keys = {"correct_option", "correct_options", "answer_key", "accepted_variants", "rubric", "solution", "explanation"}
        for item in items:
            for forbidden in forbidden_keys:
                self.assertNotIn(forbidden, item)
            self.assertIn("prompt_en", item)
            self.assertIn("options", item)
            self.assertIn("section", item)

    def test_questions_filtered_by_section_grammar_vocab_reading(self):
        self.client.force_authenticate(user=self.user_a)

        for sec in ("grammar", "vocabulary", "reading"):
            res = self.client.get(f"/api/placement/questions/?section={sec}")
            self.assertEqual(res.status_code, status.HTTP_200_OK)
            items = res.json()
            self.assertGreater(len(items), 0)
            for itm in items:
                self.assertEqual(itm["section"], sec)
                self.assertIn("difficulty", itm)
                self.assertIn("cefr_level", itm)
                # Ensure difficulty is separate from CEFR
                self.assertIn(itm["difficulty"], ("easy", "medium", "hard"))
                self.assertIn(itm["cefr_level"], ("A1", "A2", "B1", "B2"))

    def test_session_summary_endpoint_user_isolation(self):
        self.client.force_authenticate(user=self.user_a)
        res = self.client.post("/api/placement/sessions/")
        session_id = res.json()["id"]

        # User B cannot access User A's session summary
        self.client.force_authenticate(user=self.user_b)
        res_b = self.client.get(f"/api/placement/sessions/{session_id}/summary/")
        self.assertEqual(res_b.status_code, status.HTTP_404_NOT_FOUND)

    def test_session_summary_active_and_submitted_evaluation(self):
        self.client.force_authenticate(user=self.user_a)
        res = self.client.post("/api/placement/sessions/")
        session_id = res.json()["id"]

        # 1. Active summary: shows answered progress without scoring
        res_summary_active = self.client.get(f"/api/placement/sessions/{session_id}/summary/")
        self.assertEqual(res_summary_active.status_code, status.HTTP_200_OK)
        active_data = res_summary_active.json()
        self.assertFalse(active_data["is_submitted"])
        self.assertIsNone(active_data["overall_percentage"])
        self.assertIn("grammar", active_data["sections"])
        self.assertIn("vocabulary", active_data["sections"])
        self.assertIn("reading", active_data["sections"])

        # 2. Answer questions across sections
        self.client.post(f"/api/placement/sessions/{session_id}/answers/", {
            "idempotency_key": str(uuid.uuid4()),
            "question_key": "grammar-a1-001",
            "answer_value": {"selected_option": "goes"},
        }, format="json")

        self.client.post(f"/api/placement/sessions/{session_id}/answers/", {
            "idempotency_key": str(uuid.uuid4()),
            "question_key": "vocabulary-a1-001",
            "answer_value": {"selected_option": "library"},
        }, format="json")

        # 3. Submit session
        res_submit = self.client.post(f"/api/placement/sessions/{session_id}/submit/")
        self.assertEqual(res_submit.status_code, status.HTTP_200_OK)

        # 4. Submitted summary: provides evaluated section breakdown and evidence
        res_summary_sub = self.client.get(f"/api/placement/sessions/{session_id}/summary/")
        self.assertEqual(res_summary_sub.status_code, status.HTTP_200_OK)
        sub_data = res_summary_sub.json()
        self.assertTrue(sub_data["is_submitted"])
        self.assertIsNotNone(sub_data["overall_percentage"])
        self.assertGreater(len(sub_data["evidence"]), 0)

        # No premature CEFR claims
        self.assertIn("مدرک رسمی یا نهایی CEFR محسوب نمی‌شود", sub_data["notice"])

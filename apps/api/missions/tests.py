import uuid
from datetime import timedelta
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from placement.models import PlacementAnswer, PlacementSession
from srs.models import SrsItem
from .models import DailyMission
from .services import build_daily_mission

User = get_user_model()


class DailyMissionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="learner_day20@example.com",
            password="test-password-day20",
        )
        self.other_user = User.objects.create_user(
            email="other_learner@example.com",
            password="test-password-other",
        )

    def test_anonymous_cannot_access(self):
        # GET today
        res = self.client.get("/api/missions/today/")
        self.assertEqual(res.status_code, 401)

        # POST start
        res = self.client.post("/api/missions/today/start/")
        self.assertEqual(res.status_code, 401)

        # POST submit-step
        res = self.client.post("/api/missions/today/submit-step/", {"task_id": "test", "selected_option_id": "a"})
        self.assertEqual(res.status_code, 401)

    def test_unplaced_learner_receives_onboarding_mission(self):
        self.client.force_authenticate(user=self.user)
        res = self.client.get("/api/missions/today/")
        self.assertEqual(res.status_code, 200)

        data = res.data
        self.assertEqual(data["status"], "ready")
        self.assertEqual(data["target_skill"], "diagnostic_readiness")
        self.assertEqual(data["total_tasks"], 3)
        self.assertEqual(data["completed_count"], 0)
        self.assertEqual(data["current_task_index"], 0)

        tasks = data["tasks"]
        self.assertEqual(len(tasks), 3)

        # Pre-submission payload protection: correct_option_id MUST NOT be leaked
        for task in tasks:
            self.assertFalse(task["completed"])
            self.assertNotIn("correct_option_id", task)
            self.assertNotIn("explanation_fa", task)
            self.assertNotIn("explanation_en", task)

    def test_placed_learner_receives_evidence_adaptive_mission(self):
        now = timezone.now()
        # Create a submitted placement session for this user
        session = PlacementSession.objects.create(
            user=self.user,
            status=PlacementSession.Status.SUBMITTED,
            current_section="complete",
            started_at=now,
            expires_at=now + timedelta(days=1),
        )

        answers = {
            # Grammar has 0 correct -> 0% (lowest score)
            "grammar-a1-001": "wrong_ans_1",
            "grammar-a2-001": "wrong_ans_2",
            # Vocabulary has 100%
            "vocab-a1-001": "book",
            "vocab-a2-001": "recipe",
            # Reading has 100%
            "reading-a2-001": "8:30 am",
            # Listening has 100%
            "listening-a1-001": "Platform 3",
            # Speaking
            "speaking-a1-001": {"spoken_text": "Hello my name is Alex and I like reading books"},
            # Writing
            "writing-a1-001": {"written_text": "Hi my friend, I am writing from vacation. The city is amazing."},
        }

        for q_key, ans_val in answers.items():
            PlacementAnswer.objects.create(
                session=session,
                idempotency_key=uuid.uuid4(),
                question_key=q_key,
                answer_value=ans_val if isinstance(ans_val, dict) else {"selected_option": ans_val},
            )

        self.client.force_authenticate(user=self.user)
        res = self.client.get("/api/missions/today/")
        self.assertEqual(res.status_code, 200)

        data = res.data
        self.assertEqual(data["target_skill"], "grammar")
        self.assertIn("دستور زبان", data["title_fa"])
        self.assertEqual(data["total_tasks"], 3)

    def test_start_mission_transitions_status(self):
        self.client.force_authenticate(user=self.user)
        res_get = self.client.get("/api/missions/today/")
        self.assertEqual(res_get.data["status"], "ready")

        res_start = self.client.post("/api/missions/today/start/")
        self.assertEqual(res_start.status_code, 200)
        self.assertEqual(res_start.data["status"], "in_progress")

        # Database state verified
        mission = DailyMission.objects.get(id=res_get.data["id"])
        self.assertEqual(mission.status, DailyMission.Status.IN_PROGRESS)

    def test_step_submission_and_feedback(self):
        self.client.force_authenticate(user=self.user)
        mission = build_daily_mission(self.user)
        tasks = mission.get_tasks()
        first_task = tasks[0]
        first_task_id = first_task["id"]
        correct_opt = first_task["correct_option_id"]

        # Submit answer to step 1
        res = self.client.post("/api/missions/today/submit-step/", {
            "task_id": first_task_id,
            "selected_option_id": correct_opt,
        })
        self.assertEqual(res.status_code, 200)
        feedback = res.data
        self.assertTrue(feedback["is_correct"])
        self.assertEqual(feedback["correct_option_id"], correct_opt)
        self.assertTrue(len(feedback["explanation_fa"]) > 0)
        self.assertEqual(feedback["mission_status"], "in_progress")
        self.assertFalse(feedback["all_completed"])
        self.assertEqual(feedback["next_task_index"], 1)

        # In subsequent GET, task 1 is marked completed and includes explanation,
        # but task 2 and 3 DO NOT leak answers
        res_get = self.client.get("/api/missions/today/")
        updated_tasks = res_get.data["tasks"]
        self.assertTrue(updated_tasks[0]["completed"])
        self.assertEqual(updated_tasks[0]["correct_option_id"], correct_opt)
        self.assertFalse(updated_tasks[1]["completed"])
        self.assertNotIn("correct_option_id", updated_tasks[1])

    def test_mission_completion_and_next_best_action(self):
        self.client.force_authenticate(user=self.user)
        mission = build_daily_mission(self.user)
        tasks = mission.get_tasks()

        # Submit all 3 tasks
        for idx, task in enumerate(tasks):
            res = self.client.post("/api/missions/today/submit-step/", {
                "task_id": task["id"],
                "selected_option_id": task["correct_option_id"],
            })
            self.assertEqual(res.status_code, 200)
            if idx == len(tasks) - 1:
                self.assertTrue(res.data["all_completed"])
                self.assertEqual(res.data["mission_status"], "completed")
                self.assertIsNotNone(res.data["next_best_action"])
                # Since unplaced, next best action should suggest placement
                self.assertEqual(res.data["next_best_action"]["id"], "start_placement")

        # Database state is COMPLETED
        mission.refresh_from_db()
        self.assertEqual(mission.status, DailyMission.Status.COMPLETED)

    def test_user_isolation(self):
        # User A creates a mission
        self.client.force_authenticate(user=self.user)
        res_a = self.client.get("/api/missions/today/")
        mission_a_id = res_a.data["id"]

        # User B accesses today mission
        self.client.force_authenticate(user=self.other_user)
        res_b = self.client.get("/api/missions/today/")
        mission_b_id = res_b.data["id"]

        # Verify missions are completely distinct
        self.assertNotEqual(mission_a_id, mission_b_id)

        # User B cannot submit steps on behalf of User A's mission
        mission_a = DailyMission.objects.get(id=mission_a_id)
        self.assertEqual(len(mission_a.get_completed_task_ids()), 0)

    def test_idempotency_and_refresh_state(self):
        self.client.force_authenticate(user=self.user)
        res_1 = self.client.get("/api/missions/today/")
        res_2 = self.client.get("/api/missions/today/")
        self.assertEqual(res_1.data["id"], res_2.data["id"])
        self.assertEqual(DailyMission.objects.filter(user=self.user).count(), 1)

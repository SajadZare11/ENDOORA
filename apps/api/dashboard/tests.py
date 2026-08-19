from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from .services import LearnerSignals, resolve_next_best_action


User = get_user_model()


class LearnerDashboardTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.learner = User.objects.create_user(
            email="learner@example.com",
            password="StrongTestPassword123!",
            role="learner",
        )
        self.teacher = User.objects.create_user(
            email="teacher@example.com",
            password="StrongTestPassword123!",
            role="teacher",
        )

    def test_anonymous_is_rejected(self):
        response = self.client.get("/api/dashboard/home/")
        self.assertEqual(response.status_code, 401)

    def test_teacher_is_rejected_server_side(self):
        self.client.force_login(self.teacher)
        response = self.client.get("/api/dashboard/home/")
        self.assertEqual(response.status_code, 403)

    def test_first_time_learner_gets_placement_without_fake_scores(self):
        self.client.force_login(self.learner)
        response = self.client.get("/api/dashboard/home/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["dashboard_state"], "first_time")
        self.assertEqual(response.data["primary_action"]["id"], "start_placement")
        self.assertIsNone(response.data["path_progress_percent"])
        self.assertEqual(response.data["skills"], [])
        self.assertFalse(response.data["srs_available"])
        self.assertFalse(response.data["xp_available"])

    def test_dashboard_event_is_bounded(self):
        self.client.force_login(self.learner)
        valid = self.client.post(
            "/api/dashboard/events/",
            {"event_name": "primary_cta_click", "action_id": "start_placement"},
            format="json",
        )
        self.assertEqual(valid.status_code, 204)

        invalid = self.client.post(
            "/api/dashboard/events/",
            {"event_name": "raw_content", "action_id": "start_placement"},
            format="json",
        )
        self.assertEqual(invalid.status_code, 400)


class NextBestActionTests(TestCase):
    def test_priority_resolver(self):
        self.assertEqual(
            resolve_next_best_action(
                LearnerSignals(
                    urgent_assignment=True,
                    mission_status="ready",
                    srs_due_count=5,
                    next_class_available=True,
                )
            )["id"],
            "urgent_assignment",
        )
        self.assertEqual(
            resolve_next_best_action(
                LearnerSignals(
                    mission_status="ready",
                    srs_due_count=5,
                    next_class_available=True,
                )
            )["id"],
            "continue_mission",
        )
        self.assertEqual(
            resolve_next_best_action(
                LearnerSignals(srs_due_count=5, next_class_available=True)
            )["id"],
            "review_vocabulary",
        )
        self.assertEqual(
            resolve_next_best_action(
                LearnerSignals(next_class_available=True)
            )["id"],
            "start_placement",
        )

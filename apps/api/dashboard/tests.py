from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from learner_twin.models import LearnerTwin
from missions.models import DailyMission
from placement.models import PlacementSession
from srs.models import SrsItem

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
        self.assertEqual(response.data["path_steps"][0]["state"], "current")
        self.assertIsNone(response.data["today_mission"])
        self.assertEqual(response.data["skills"], [])
        self.assertFalse(response.data["srs_available"])
        self.assertFalse(response.data["xp_available"])

    def test_aggregated_home_uses_real_mission_srs_and_skill_evidence(self):
        now = timezone.now()
        PlacementSession.objects.create(
            user=self.learner,
            status="submitted",
            current_section="complete",
            expires_at=now + timedelta(days=1),
        )
        mission = DailyMission.objects.create(
            user=self.learner,
            mission_date=timezone.localdate(),
            title_fa="تمرین گفتاری امروز",
            title_en="Today's speaking practice",
            explanation_fa="یک تمرین کوتاه بر پایه شواهد ثبت‌شده.",
            explanation_en="A short exercise based on recorded evidence.",
            evidence_reason={
                "reason_fa": "گفتار نیاز به تمرین دارد.",
                "reason_en": "Speaking needs practice.",
            },
            status=DailyMission.Status.READY,
        )
        SrsItem.objects.create(
            learner=self.learner,
            term="door",
            meaning_fa="در",
            due_at=now - timedelta(minutes=1),
        )
        SrsItem.objects.create(
            learner=self.learner,
            term="path",
            meaning_fa="مسیر",
            due_at=now + timedelta(days=1),
        )
        LearnerTwin.objects.create(
            user=self.learner,
            evidence_count=3,
            summary={
                "skills": {
                    "speaking": {"observations": 2},
                    "unknown_private_field": {"score": 99},
                }
            },
        )

        self.client.force_login(self.learner)
        response = self.client.get("/api/dashboard/home/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["dashboard_state"], "mission_ready")
        self.assertEqual(response.data["primary_action"]["id"], "continue_mission")
        self.assertEqual(response.data["today_mission"]["id"], str(mission.id))
        self.assertEqual(response.data["srs_due_count"], 1)
        self.assertTrue(response.data["srs_available"])
        self.assertEqual(
            response.data["skills"],
            [
                {
                    "id": "speaking",
                    "label_fa": "گفتاری",
                    "label_en": "Speaking",
                    "status_fa": "شواهد یادگیری ثبت شده",
                    "status_en": "Learning evidence recorded",
                }
            ],
        )
        self.assertNotIn("score", response.data["skills"][0])
        self.assertEqual(response.data["path_steps"][0]["state"], "complete")
        self.assertEqual(response.data["path_steps"][1]["state"], "current")

    def test_submitted_placement_without_mission_gets_honest_next_step(self):
        PlacementSession.objects.create(
            user=self.learner,
            status="submitted",
            current_section="complete",
            expires_at=timezone.now() + timedelta(days=1),
        )
        self.client.force_login(self.learner)

        response = self.client.get("/api/dashboard/home/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["dashboard_state"], "returning")
        self.assertEqual(response.data["primary_action"]["id"], "start_learning")
        self.assertIsNone(response.data["path_progress_percent"])

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

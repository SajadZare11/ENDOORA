from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from gamification.models import LearnerLevel, LearnerStreak, XPCategory, XPTransaction
from gamification.services import GamificationService, XPService

User = get_user_model()


class GamificationEngineTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(
            email="learner1@example.com",
            password="testpassword123",
        )
        self.user2 = User.objects.create_user(
            email="learner2@example.com",
            password="testpassword123",
        )

    def test_immutable_ledger_create_and_update_rejection(self):
        """XPTransaction records can be created, but updates or direct deletes are rejected."""
        tx = XPTransaction.objects.create(
            learner=self.user1,
            amount=50,
            category=XPCategory.MISSION,
            reason="Completed Day 20 Mission",
            source_event="test_event_immutability_1",
        )
        self.assertEqual(tx.amount, 50)

        # Attempting to mutate amount or reason on an existing record must raise ValidationError
        tx.amount = 100
        with self.assertRaises(ValidationError):
            tx.save()

        # Attempting to delete must raise ValidationError
        with self.assertRaises(ValidationError):
            tx.delete()

    def test_idempotent_xp_awarding(self):
        """Calling award_xp with identical source_event returns existing record without duplicating XP."""
        event_key = "mission_completion:2026-09-05:step_1"

        tx1 = GamificationService.award_xp(
            learner=self.user1,
            amount=30,
            reason="Step 1 completed",
            source_event=event_key,
            category=XPCategory.MISSION,
        )

        level_record = LearnerLevel.objects.get(learner=self.user1)
        self.assertEqual(level_record.total_xp, 30)

        # Re-trigger with same idempotency key
        tx2 = GamificationService.award_xp(
            learner=self.user1,
            amount=30,
            reason="Step 1 retry",
            source_event=event_key,
            category=XPCategory.MISSION,
        )

        self.assertEqual(tx1.id, tx2.id)
        level_record.refresh_from_db()
        # XP must NOT double to 60
        self.assertEqual(level_record.total_xp, 30)
        self.assertEqual(XPTransaction.objects.filter(learner=self.user1).count(), 1)

    def test_level_progression_calculation(self):
        """Calculates accurate level, bracket thresholds, and educational titles."""
        # Level 1 (0-99 XP)
        l1 = GamificationService.calculate_level_progression(50)
        self.assertEqual(l1["current_level"], 1)
        self.assertEqual(l1["current_threshold"], 0)
        self.assertEqual(l1["next_threshold"], 100)
        self.assertEqual(l1["progress_percent"], 50)
        self.assertEqual(l1["level_title_en"], "Novice Explorer")

        # Level 2 (100-249 XP)
        l2 = GamificationService.calculate_level_progression(100)
        self.assertEqual(l2["current_level"], 2)
        self.assertEqual(l2["progress_percent"], 0)
        self.assertEqual(l2["level_title_en"], "Dedicated Apprentice")

        # Level 3 (250-449 XP)
        l3 = GamificationService.calculate_level_progression(350)
        self.assertEqual(l3["current_level"], 3)
        self.assertEqual(l3["level_title_en"], "Active Practitioner")

        # Level 4 (450-699 XP)
        l4 = GamificationService.calculate_level_progression(450)
        self.assertEqual(l4["current_level"], 4)
        self.assertEqual(l4["level_title_en"], "Consistent Scholar")

    def test_streak_consecutive_days(self):
        """Streak increments across consecutive calendar days."""
        today = timezone.localdate()
        yesterday = today - timedelta(days=1)

        # Day 1 activity
        streak_record = GamificationService.record_activity(self.user1, activity_date=yesterday)
        self.assertEqual(streak_record.current_streak, 1)

        # Day 2 activity
        streak_record = GamificationService.record_activity(self.user1, activity_date=today)
        self.assertEqual(streak_record.current_streak, 2)
        self.assertEqual(streak_record.longest_streak, 2)

    def test_same_day_multiple_activities(self):
        """Multiple learning activities within the same day maintain streak without inflation."""
        today = timezone.localdate()

        streak1 = GamificationService.record_activity(self.user1, activity_date=today)
        self.assertEqual(streak1.current_streak, 1)

        streak2 = GamificationService.record_activity(self.user1, activity_date=today)
        self.assertEqual(streak2.current_streak, 1)

    def test_streak_freeze_protection(self):
        """A single day gap consumes a freeze credit to preserve learner momentum."""
        today = timezone.localdate()
        two_days_ago = today - timedelta(days=2)

        streak_record = LearnerStreak.objects.create(
            learner=self.user1,
            current_streak=5,
            longest_streak=5,
            last_activity_date=two_days_ago,
            freeze_credits=1,
        )

        updated = GamificationService.record_activity(self.user1, activity_date=today)
        # Freeze used: streak preserved and incremented to 6
        self.assertEqual(updated.current_streak, 6)
        self.assertEqual(updated.freeze_credits, 0)
        self.assertEqual(updated.last_activity_date, today)

    def test_streak_reset_after_missed_days_without_freeze(self):
        """When learner misses multiple days without freeze credits, streak resets to 1."""
        today = timezone.localdate()
        three_days_ago = today - timedelta(days=3)

        LearnerStreak.objects.create(
            learner=self.user1,
            current_streak=10,
            longest_streak=10,
            last_activity_date=three_days_ago,
            freeze_credits=0,
        )

        updated = GamificationService.record_activity(self.user1, activity_date=today)
        self.assertEqual(updated.current_streak, 1)
        self.assertEqual(updated.longest_streak, 10)

    def test_api_summary_endpoint(self):
        """GET /api/gamification/summary/ returns learner profile and Rule #7/#8 disclaimers."""
        GamificationService.award_xp(
            learner=self.user1,
            amount=150,
            reason="Placement completed",
            source_event="placement_award_1",
            category=XPCategory.PLACEMENT,
        )

        self.client.force_authenticate(user=self.user1)
        response = self.client.get("/api/gamification/summary/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data
        self.assertEqual(data["total_xp"], 150)
        self.assertEqual(data["current_level"], 2)
        self.assertEqual(data["level_title_en"], "Dedicated Apprentice")
        self.assertIn("rule_7_disclaimer_fa", data)
        self.assertIn("rule_8_disclaimer_fa", data)
        self.assertGreaterEqual(len(data["levels_catalog"]), 10)

    def test_api_guest_summary_endpoint(self):
        """Unauthenticated visitor receives safe zero-state fallback without crashing."""
        response = self.client.get("/api/gamification/summary/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total_xp"], 0)
        self.assertEqual(response.data["current_level"], 1)

    def test_api_award_endpoint(self):
        """Authenticated learner can trigger verified activity award with anti-exploit enforcement."""
        self.client.force_authenticate(user=self.user1)
        payload = {
            "amount": 40,
            "category": "roleplay",
            "reason": "Completed Airport Scenario",
            "source_event": "roleplay:airport:user1:turn8",
        }

        response = self.client.post("/api/gamification/award/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["amount"], 40)

        # Duplicate submission must be idempotent
        response2 = self.client.post("/api/gamification/award/", payload, format="json")
        self.assertEqual(response2.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response2.data["id"], response.data["id"])

    def test_user_isolation(self):
        """Learner 2 cannot access Learner 1's XP ledger records."""
        GamificationService.award_xp(
            learner=self.user1,
            amount=50,
            reason="User 1 Secret Activity",
            source_event="u1_activity_1",
        )

        self.client.force_authenticate(user=self.user2)
        response = self.client.get("/api/gamification/ledger/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Learner 2's ledger must be empty
        self.assertEqual(len(response.data["results"] if "results" in response.data else response.data), 0)

    def test_legacy_xpservice_compatibility(self):
        """Legacy XPService().award(event) successfully delegates and returns status."""
        service = XPService()
        result = service.award({"learner": self.user1, "amount": 20, "reason": "Legacy review"})
        self.assertEqual(result["status"], "success")
        self.assertIn("transaction_id", result)

        invalid_result = service.award("not-a-dict")
        self.assertEqual(invalid_result["status"], "validated event required")

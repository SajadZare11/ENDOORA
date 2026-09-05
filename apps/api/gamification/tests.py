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


class Day29GamificationSocialTests(TestCase):
    """
    Acceptance checks and failure traps validation for Day 29:
    Badges, Challenges, Active-Users Clubs, and Privacy-Safe Leaderboards.
    """

    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(email="learner_alpha@example.com", password="password123")
        self.user2 = User.objects.create_user(email="learner_beta@example.com", password="password123")
        self.user_private = User.objects.create_user(email="learner_private@example.com", password="password123")
        self.user_minor = User.objects.create_user(email="learner_minor@example.com", password="password123")

    def test_private_user_never_appears_on_leaderboards(self):
        """Users who opt out (is_leaderboard_visible=False) NEVER appear on any leaderboard."""
        from gamification.services import LeaderboardService

        # Give XP to both users
        GamificationService.award_xp(self.user1, 200, "Mission 1", "u1:m1")
        GamificationService.award_xp(self.user_private, 300, "Mission 2", "upriv:m2")

        # Set user_private to hidden
        LeaderboardService.update_privacy_settings(self.user_private, is_leaderboard_visible=False)

        # Generate snapshot
        snapshot = LeaderboardService.generate_leaderboard_snapshot(board_type="global")
        entries = snapshot.entries.all()

        # user_private must NOT be in the entries
        learner_ids = [e.learner_id for e in entries]
        self.assertNotIn(self.user_private.id, learner_ids)
        self.assertIn(self.user1.id, learner_ids)

        # In API response, private user receives notice that privacy mode is active
        self.client.force_authenticate(user=self.user_private)
        resp = self.client.get("/api/gamification/leaderboard/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertFalse(resp.data["is_learner_visible"])

    def test_small_city_cohort_suppression_under_10_users(self):
        """If fewer than 10 learners belong to a city cohort, the city board is suppressed to prevent doxxing."""
        from gamification.services import LeaderboardService

        # Register only 3 learners in 'Shiraz'
        for i in range(3):
            u = User.objects.create_user(email=f"shiraz_user_{i}@example.com", password="password123")
            GamificationService.award_xp(u, 150, "Shiraz activity", f"shiraz_act_{i}")
            LeaderboardService.update_privacy_settings(u, city="Shiraz", show_city_rank=True)

        snapshot = LeaderboardService.generate_leaderboard_snapshot(board_type="city", city_name="Shiraz")
        self.assertTrue(snapshot.is_suppressed)
        self.assertIn("حفظ حریم خصوصی", snapshot.suppression_reason)
        self.assertEqual(snapshot.entries.count(), 0)

        # Now simulate reaching the minimum safe cohort size (10 users)
        for i in range(3, 11):
            u = User.objects.create_user(email=f"shiraz_user_{i}@example.com", password="password123")
            GamificationService.award_xp(u, 150, "Shiraz activity", f"shiraz_act_{i}")
            LeaderboardService.update_privacy_settings(u, city="Shiraz", show_city_rank=True)

        snapshot2 = LeaderboardService.generate_leaderboard_snapshot(board_type="city", city_name="Shiraz")
        self.assertFalse(snapshot2.is_suppressed)
        self.assertEqual(snapshot2.entries.count(), 11)

    def test_minor_location_safeguard_and_city_exclusion(self):
        """Under-18 learners strictly have location suppressed and cannot participate in city leaderboards."""
        from gamification.services import LeaderboardService

        # Attempt to set city for a minor
        privacy = LeaderboardService.update_privacy_settings(
            self.user_minor,
            is_minor=True,
            city="Isfahan",
            show_city_rank=True,
        )

        # City must be cleared and show_city_rank must be False
        self.assertEqual(privacy.city, "")
        self.assertFalse(privacy.show_city_rank)
        self.assertTrue(privacy.is_minor)

    def test_xp_reversals_affect_leaderboard_and_level(self):
        """XP reversals reduce total XP and immediately affect snapshot calculation."""
        from gamification.services import LeaderboardService

        # Award 300 XP
        GamificationService.award_xp(self.user1, 300, "Original award", "event_award_300")
        self.assertEqual(LearnerLevel.objects.get(learner=self.user1).total_xp, 300)

        # Create compensatory reversal (-100 XP)
        GamificationService.award_xp(
            self.user1,
            -100,
            "Reversal of duplicate task",
            "event_reversal_100",
            category=XPCategory.SYSTEM_ADJUSTMENT,
        )
        self.assertEqual(LearnerLevel.objects.get(learner=self.user1).total_xp, 200)

        # Snapshot reflects the reversed 200 XP
        snapshot = LeaderboardService.generate_leaderboard_snapshot(board_type="global")
        entry = snapshot.entries.filter(learner=self.user1).first()
        self.assertIsNotNone(entry)
        self.assertEqual(entry.total_xp, 200)

    def test_deterministic_tie_breaking(self):
        """Ties in XP are resolved deterministically by (total_xp DESC, tiebreaker_achieved_at ASC, learner_id ASC)."""
        from gamification.services import LeaderboardService

        # Both user1 and user2 earn exactly 150 XP
        GamificationService.award_xp(self.user1, 150, "User 1 task", "u1:task")
        GamificationService.award_xp(self.user2, 150, "User 2 task", "u2:task")

        snapshot = LeaderboardService.generate_leaderboard_snapshot(board_type="global")
        entries = list(snapshot.entries.all()[:2])

        self.assertEqual(len(entries), 2)
        self.assertEqual(entries[0].total_xp, entries[1].total_xp)
        self.assertEqual(entries[0].rank, 1)
        self.assertEqual(entries[1].rank, 2)
        # Ranks are distinct and sequential
        self.assertNotEqual(entries[0].learner_id, entries[1].learner_id)

    def test_badge_auto_unlock_and_idempotency(self):
        """Badges unlock automatically when threshold criteria are met and are strictly idempotent."""
        from gamification.models import Badge, LearnerBadge
        from gamification.services import BadgeService

        # Seed badges
        BadgeService.seed_default_badges()
        streak_badge = Badge.objects.get(slug="streak-3")

        # Set user streak to 3 days
        GamificationService.award_xp(self.user1, 50, "Day 1", "u1:d1")
        GamificationService.award_xp(self.user1, 50, "Day 2", "u1:d2", category=XPCategory.MISSION)
        # Force streak record to 3
        streak_rec = LearnerStreak.objects.get(learner=self.user1)
        streak_rec.current_streak = 3
        streak_rec.longest_streak = 3
        streak_rec.save()

        # Trigger badge evaluation
        unlocked = BadgeService.evaluate_and_unlock_badges(self.user1, trigger_type="streak_days", value=3)
        self.assertTrue(any(b.slug == "streak-3" for b in unlocked))
        self.assertTrue(LearnerBadge.objects.filter(learner=self.user1, badge=streak_badge).exists())

        # Calling again must not double award
        unlocked_again = BadgeService.evaluate_and_unlock_badges(self.user1, trigger_type="streak_days", value=3)
        self.assertEqual(len(unlocked_again), 0)

    def test_challenge_daily_weekly_schedules_and_progress(self):
        """Daily and weekly challenges track progress in Asia/Tehran local calendar."""
        from gamification.services import ChallengeService

        ChallengeService.seed_default_challenges()
        self.client.force_authenticate(user=self.user1)

        resp = self.client.get("/api/gamification/challenges/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("daily_challenges", resp.data)
        self.assertIn("weekly_challenges", resp.data)
        self.assertEqual(resp.data["timezone"], "Asia/Tehran")

        # Record progress for SRS
        ChallengeService.record_challenge_progress(self.user1, metric_type="srs", count=10)

        # Check completed challenge
        resp2 = self.client.get("/api/gamification/challenges/")
        daily_vocab = [c for c in resp2.data["daily_challenges"] if c["template_slug"] == "daily-vocab-sprint"][0]
        self.assertTrue(daily_vocab["is_completed"])

    def test_seven_day_sprint_enrollment_and_completion(self):
        """Learners can enroll in 7-day sprint and manage progress."""
        from gamification.services import ChallengeService

        self.client.force_authenticate(user=self.user1)

        enroll_resp = self.client.post("/api/gamification/challenges/enroll-sprint/")
        self.assertEqual(enroll_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(enroll_resp.data["status"], "enrolled")
        self.assertEqual(enroll_resp.data["days_completed"], 1)

        # Enrolling again returns active sprint
        enroll_again = self.client.post("/api/gamification/challenges/enroll-sprint/")
        self.assertEqual(enroll_again.status_code, status.HTTP_200_OK)
        self.assertEqual(enroll_again.data["sprint_id"], enroll_resp.data["sprint_id"])

    def test_active_users_club_eligibility_and_membership(self):
        """Clubs require meeting 7-day activity criteria and support joining, leaving, and reporting."""
        from gamification.services import ClubService

        ClubService.seed_default_clubs()
        self.client.force_authenticate(user=self.user1)

        # User has 0 XP: cannot join Apprentice Club (needs 100 XP)
        resp = self.client.post("/api/gamification/clubs/join/", {"club_slug": "apprentice-club"})
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

        # Qualify learner: 2 active days, 150 XP
        tx1 = GamificationService.award_xp(self.user1, 100, "Day 1 activity", "u1:act1")
        # Backdate tx1 by 2 days to have distinct calendar days
        XPTransaction.objects.filter(id=tx1.id).update(created_at=timezone.now() - timedelta(days=2))
        GamificationService.award_xp(self.user1, 50, "Day 2 activity", "u1:act2")

        # Now join should succeed
        resp_join = self.client.post("/api/gamification/clubs/join/", {"club_slug": "apprentice-club"})
        self.assertEqual(resp_join.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_join.data["status"], "joined")

        # Leave club
        resp_leave = self.client.post("/api/gamification/clubs/leave/", {"club_slug": "apprentice-club"})
        self.assertEqual(resp_leave.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_leave.data["status"], "left")

        # Report club
        resp_report = self.client.post("/api/gamification/clubs/report/", {"club_slug": "apprentice-club", "reason": "Testing safety controls"})
        self.assertEqual(resp_report.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_report.data["status"], "reported")

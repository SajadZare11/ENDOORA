from django.test import TestCase

from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import ConsentRecord, User

from .models import (
    DataExportRequest,
    LearnerProfile,
    OnboardingProgress,
    TeacherProfile,
)


class ProfileApiTests(APITestCase):
    def setUp(self):
        self.learner = User.objects.create_user(
            email="learner-day8@example.com",
            password="StrongPass-123!",
            role=User.Role.LEARNER,
        )

        self.teacher = User.objects.create_user(
            email="teacher-day8@example.com",
            password="StrongPass-123!",
            role=User.Role.TEACHER,
        )

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def add_required_consents(self, user):
        ConsentRecord.objects.create(
            user=user,
            consent_type=ConsentRecord.ConsentType.TERMS,
            version="2026-08-day8",
            locale=User.Locale.PERSIAN,
            source="day8_test",
        )

        ConsentRecord.objects.create(
            user=user,
            consent_type=ConsentRecord.ConsentType.PRIVACY,
            version="2026-08-day8",
            locale=User.Locale.PERSIAN,
            source="day8_test",
        )

    def create_complete_learner_profile(self, user=None):
        user = user or self.learner

        return LearnerProfile.objects.create(
            user=user,
            goal=LearnerProfile.Goal.IELTS,
            age_band=LearnerProfile.AgeBand.AGE_18_24,
            current_estimate=LearnerProfile.CurrentEstimate.B1,
            preferred_daily_minutes=30,
            preferred_days=[
                "saturday",
                "monday",
                "wednesday",
            ],
            timezone="Asia/Tehran",
        )

    def create_complete_teacher_profile(self, user=None):
        user = user or self.teacher

        return TeacherProfile.objects.create(
            user=user,
            public_name="Teacher Test",
            bio="English teacher profile for automated tests.",
            experience_years=5,
            specialties=[
                "IELTS",
                "Conversation",
            ],
            city="Tehran",
            languages=[
                "Persian",
                "English",
            ],
            availability_intent=True,
            verification_intent=True,
        )

    def test_learner_profile_can_be_saved_and_retrieved(self):
        self.authenticate(self.learner)

        response = self.client.patch(
            "/api/profiles/learner/",
            {
                "goal": "ielts",
                "age_band": "18_24",
                "current_estimate": "B1",
                "preferred_daily_minutes": 30,
                "preferred_days": [
                    "saturday",
                    "monday",
                    "wednesday",
                ],
                "timezone": "Asia/Tehran",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )
        self.assertEqual(response.data["goal"], "ielts")
        self.assertEqual(
            response.data["timezone"],
            "Asia/Tehran",
        )

        response = self.client.get(
            "/api/profiles/learner/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )
        self.assertEqual(response.data["goal"], "ielts")
        self.assertGreater(
            response.data["completeness_percent"],
            0,
        )

    def test_learner_cannot_access_teacher_profile(self):
        self.authenticate(self.learner)

        response = self.client.get(
            "/api/profiles/teacher/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )
        self.assertEqual(
            response.data["code"],
            "wrong_role",
        )

    def test_teacher_cannot_access_learner_profile(self):
        self.authenticate(self.teacher)

        response = self.client.get(
            "/api/profiles/learner/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )
        self.assertEqual(
            response.data["code"],
            "wrong_role",
        )

    def test_onboarding_draft_is_saved_and_resumable(self):
        self.authenticate(self.learner)

        response = self.client.patch(
            "/api/profiles/onboarding/",
            {
                "current_step": 2,
                "completed_steps": [1],
                "draft_data": {
                    "goal": "ielts",
                    "preferred_daily_minutes": 30,
                },
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        response = self.client.get(
            "/api/profiles/onboarding/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )
        self.assertEqual(response.data["current_step"], 2)
        self.assertEqual(
            response.data["completed_steps"],
            [1],
        )
        self.assertEqual(
            response.data["draft_data"]["goal"],
            "ielts",
        )

    def test_sensitive_values_cannot_be_saved_in_onboarding_draft(self):
        self.authenticate(self.learner)

        response = self.client.patch(
            "/api/profiles/onboarding/",
            {
                "draft_data": {
                    "password": "NeverStoreThis",
                }
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn(
            "draft_data",
            response.data,
        )

    def test_data_export_request_is_idempotent_while_pending(self):
        self.authenticate(self.learner)

        first_response = self.client.post(
            "/api/profiles/data-exports/",
            {},
            format="json",
        )

        self.assertEqual(
            first_response.status_code,
            status.HTTP_201_CREATED,
        )

        second_response = self.client.post(
            "/api/profiles/data-exports/",
            {},
            format="json",
        )

        self.assertEqual(
            second_response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            first_response.data["id"],
            second_response.data["id"],
        )

        self.assertEqual(
            DataExportRequest.objects.filter(
                user=self.learner
            ).count(),
            1,
        )

    def test_one_learner_cannot_read_another_learners_profile(self):
        first_profile = self.create_complete_learner_profile()

        second_learner = User.objects.create_user(
            email="second-learner@example.com",
            password="StrongPass-123!",
            role=User.Role.LEARNER,
        )

        self.authenticate(second_learner)

        response = self.client.get(
            "/api/profiles/learner/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(response.data["goal"], "")

        second_profile = LearnerProfile.objects.get(
            user=second_learner
        )

        self.assertNotEqual(
            first_profile.id,
            second_profile.id,
        )

        first_profile.refresh_from_db()

        self.assertEqual(
            first_profile.goal,
            LearnerProfile.Goal.IELTS,
        )

    def test_onboarding_completion_requires_terms_and_privacy_consent(self):
        self.create_complete_learner_profile()
        self.authenticate(self.learner)

        response = self.client.post(
            "/api/profiles/onboarding/complete/",
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertEqual(
            response.data["code"],
            "required_consents_missing",
        )

    def test_learner_onboarding_can_complete_after_required_data_and_consent(self):
        self.create_complete_learner_profile()
        self.add_required_consents(self.learner)
        self.authenticate(self.learner)

        response = self.client.post(
            "/api/profiles/onboarding/complete/",
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )
        self.assertTrue(response.data["is_completed"])
        self.assertEqual(
            response.data["stage"],
            "completed",
        )

        progress = OnboardingProgress.objects.get(
            user=self.learner
        )

        self.assertEqual(
            progress.stage,
            OnboardingProgress.Stage.COMPLETED,
        )
        self.assertIsNotNone(progress.completed_at)

    def test_teacher_onboarding_does_not_grant_verification_or_paid_capabilities(self):
        self.create_complete_teacher_profile()
        self.add_required_consents(self.teacher)
        self.authenticate(self.teacher)

        response = self.client.post(
            "/api/profiles/onboarding/complete/",
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )
        self.assertTrue(response.data["is_completed"])

        self.teacher.refresh_from_db()

        self.assertFalse(
            self.teacher.is_teacher_verified
        )
        self.assertFalse(
            self.teacher.marketplace_eligible
        )
        self.assertFalse(
            self.teacher.paid_class_eligible
        )

        self.assertFalse(
            self.teacher.capabilities[
                "teacher_verified"
            ]
        )
        self.assertFalse(
            self.teacher.capabilities[
                "marketplace_eligible"
            ]
        )
        self.assertFalse(
            self.teacher.capabilities[
                "paid_class_eligible"
            ]
        )

    def test_account_summary_exposes_account_hub_foundation(self):
        self.authenticate(self.learner)

        response = self.client.get(
            "/api/profiles/account-summary/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            response.data["account"]["role"],
            User.Role.LEARNER,
        )

        self.assertIn(
            "profile_completeness",
            response.data,
        )

        self.assertIn(
            "data_controls",
            response.data,
        )

        self.assertIn(
            "library",
            response.data["account_sections"],
        )

        self.assertIn(
            "usage",
            response.data["account_sections"],
        )

        self.assertIn(
            "plan",
            response.data["account_sections"],
        )

        self.assertIn(
            "billing",
            response.data["account_sections"],
        )

        self.assertIn(
            "sessions",
            response.data["account_sections"],
        )

        self.assertNotIn(
            "password",
            response.data["account"],
        )

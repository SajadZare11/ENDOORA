from __future__ import annotations

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from profiles.models import TeacherProfile

from .dashboard import build_teacher_dashboard


User = get_user_model()


def collect_keys(value) -> set[str]:
    keys: set[str] = set()
    if isinstance(value, dict):
        for key, child in value.items():
            keys.add(str(key))
            keys.update(collect_keys(child))
    elif isinstance(value, list):
        for child in value:
            keys.update(collect_keys(child))
    return keys


class TeacherDashboardTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.learner = User.objects.create_user(
            email="learner-day10@example.com",
            password="StrongPass123!",
            role="learner",
        )
        self.unverified_teacher = User.objects.create_user(
            email="unverified-day10@example.com",
            password="StrongPass123!",
            role="teacher",
            is_teacher_verified=False,
            marketplace_eligible=True,
            paid_class_eligible=True,
        )
        TeacherProfile.objects.create(
            user=self.unverified_teacher,
            public_name="مدرس آزمایشی",
            bio="مدرس زبان انگلیسی",
            experience_years=2,
            specialties=["conversation"],
            city="تهران",
            languages=["fa", "en"],
        )

        self.verified_teacher = User.objects.create_user(
            email="verified-day10@example.com",
            password="StrongPass123!",
            role="teacher",
            is_teacher_verified=True,
            marketplace_eligible=True,
            paid_class_eligible=True,
        )
        TeacherProfile.objects.create(
            user=self.verified_teacher,
            public_name="مدرس تأییدشده",
            bio="Experienced English teacher",
            experience_years=5,
            specialties=["ielts", "writing"],
            city="شیراز",
            languages=["fa", "en"],
        )

    def test_anonymous_user_gets_401(self):
        response = self.client.get("/api/teachers/dashboard/")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data["code"], "authentication_required")

    def test_non_teacher_gets_403(self):
        self.client.force_login(self.learner)
        response = self.client.get("/api/teachers/dashboard/")
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data["code"], "teacher_role_required")

    def test_unverified_teacher_sees_verification_as_primary_action(self):
        self.client.force_login(self.unverified_teacher)
        response = self.client.get("/api/teachers/dashboard/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["verification_status"], "unverified")
        self.assertEqual(response.data["primary_action"]["id"], "verify_profile")
        self.assertFalse(response.data["capabilities"]["teacher_verified"])
        self.assertFalse(response.data["capabilities"]["marketplace_eligible"])
        self.assertFalse(response.data["capabilities"]["paid_class_eligible"])
        fixed_class = next(
            item for item in response.data["quick_links"] if item["id"] == "fixed_class"
        )
        self.assertEqual(fixed_class["status"], "locked")

    def test_verified_teacher_uses_safe_empty_workspace(self):
        self.client.force_login(self.verified_teacher)
        response = self.client.get("/api/teachers/dashboard/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["verification_status"], "verified")
        self.assertEqual(response.data["primary_action"]["id"], "prepare_first_class")
        self.assertTrue(response.data["capabilities"]["teacher_verified"])
        self.assertTrue(response.data["capabilities"]["marketplace_eligible"])
        self.assertTrue(response.data["capabilities"]["paid_class_eligible"])
        self.assertIsNone(response.data["classes"]["count"])
        self.assertIsNone(response.data["earnings"]["amount_toman"])

    def test_dashboard_payload_has_no_sensitive_learner_content_keys(self):
        self.client.force_login(self.verified_teacher)
        response = self.client.get("/api/teachers/dashboard/")
        self.assertEqual(response.status_code, 200)

        forbidden_keys = {
            "raw_writing",
            "writing_text",
            "audio_url",
            "audio_blob",
            "conversation",
            "conversation_history",
            "transcript",
            "answer_text",
            "private_message",
        }
        self.assertTrue(forbidden_keys.isdisjoint(collect_keys(response.data)))

    def test_dashboard_service_uses_one_domain_query(self):
        with self.assertNumQueries(1):
            payload = build_teacher_dashboard(self.verified_teacher)
        self.assertEqual(payload["verification_status"], "verified")

    def test_analytics_event_accepts_only_known_action_identifiers(self):
        self.client.force_login(self.verified_teacher)
        response = self.client.post(
            "/api/teachers/dashboard/events/",
            {
                "event_name": "primary_cta_click",
                "action_id": "prepare_first_class",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 204)

        bad_response = self.client.post(
            "/api/teachers/dashboard/events/",
            {
                "event_name": "primary_cta_click",
                "action_id": "raw-private-data",
            },
            format="json",
        )
        self.assertEqual(bad_response.status_code, 400)


class TeacherPrimaryActionTests(TestCase):
    def test_verification_has_highest_priority(self):
        from .dashboard import TeacherSignals, resolve_teacher_primary_action

        action = resolve_teacher_primary_action(
            TeacherSignals(
                verified=False,
                profile_completeness_percent=100,
                next_session_available=True,
                unanswered_requests=3,
                pending_grading=4,
            )
        )
        self.assertEqual(action["id"], "verify_profile")

    def test_session_precedes_request_and_grading(self):
        from .dashboard import TeacherSignals, resolve_teacher_primary_action

        action = resolve_teacher_primary_action(
            TeacherSignals(
                verified=True,
                profile_completeness_percent=100,
                next_session_available=True,
                unanswered_requests=3,
                pending_grading=4,
            )
        )
        self.assertEqual(action["id"], "teach_next_session")

    def test_request_precedes_grading(self):
        from .dashboard import TeacherSignals, resolve_teacher_primary_action

        action = resolve_teacher_primary_action(
            TeacherSignals(
                verified=True,
                profile_completeness_percent=100,
                unanswered_requests=3,
                pending_grading=4,
            )
        )
        self.assertEqual(action["id"], "answer_request")

    def test_grading_is_selected_when_it_is_the_only_urgent_work(self):
        from .dashboard import TeacherSignals, resolve_teacher_primary_action

        action = resolve_teacher_primary_action(
            TeacherSignals(
                verified=True,
                profile_completeness_percent=100,
                pending_grading=4,
            )
        )
        self.assertEqual(action["id"], "grade_work")

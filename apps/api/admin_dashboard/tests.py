from __future__ import annotations

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from audit.models import AuditEvent
from content.models import ContentCategory, ContentItem, ContentStatus, LicenseType
from core.models.settings import FeatureFlag
from courses.models import Course
from moderation.models import ModerationStatus, Report

User = get_user_model()


class AdminDashboardTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.learner = User.objects.create_user(
            email="learner@endoora.ir",
            password="test-password-123",
            role=User.Role.LEARNER,
        )
        self.editor = User.objects.create_user(
            email="editor@endoora.ir",
            password="test-password-123",
            role=User.Role.EDITOR,
        )
        self.admin = User.objects.create_user(
            email="founder@endoora.ir",
            password="test-password-123",
            role=User.Role.ADMINISTRATOR,
            is_staff=True,
        )

        # Create items in review queue
        self.course_in_review = Course.objects.create(
            slug="test-review-course",
            title_fa="دوره آزمایشی در حال بررسی",
            title_en="Test Review Course",
            status=ContentStatus.IN_REVIEW,
            source_attribution="Endoora Academy",
            author_name="Chief Instructor",
        )
        self.content_in_review = ContentItem.objects.create(
            slug="test-review-item",
            title_fa="محتوای در حال بررسی",
            title_en="Test Review Content",
            status=ContentStatus.IN_REVIEW,
            category=ContentCategory.READING,
            source_attribution="Endoora Academy",
            author_name="Chief Instructor",
            license_type=LicenseType.ORIGINAL_EDITORIAL,
        )

        # Create pending report
        self.report = Report.objects.create(
            target_id="comment-123",
            status=ModerationStatus.PENDING,
        )

    def test_admin_stats_permissions_and_aggregation(self):
        # Guest request is rejected
        resp_guest = self.client.get("/api/admin-ops/stats/")
        self.assertEqual(resp_guest.status_code, status.HTTP_403_FORBIDDEN)

        # Learner is rejected
        self.client.force_authenticate(user=self.learner)
        resp_learner = self.client.get("/api/admin-ops/stats/")
        self.assertEqual(resp_learner.status_code, status.HTTP_403_FORBIDDEN)

        # Administrator receives aggregated telemetry
        self.client.force_authenticate(user=self.admin)
        resp_admin = self.client.get("/api/admin-ops/stats/")
        self.assertEqual(resp_admin.status_code, status.HTTP_200_OK)

        data = resp_admin.data
        self.assertIn("users", data)
        self.assertGreaterEqual(data["users"]["total"], 3)
        self.assertEqual(data["review_queues"]["courses_in_review"], 1)
        self.assertEqual(data["review_queues"]["content_items_in_review"], 1)
        self.assertEqual(data["moderation"]["pending_reports"], 1)
        self.assertIn("treasury", data)
        self.assertEqual(data["system_health"]["status"], "operational")

    def test_feature_flags_list_and_search(self):
        self.client.force_authenticate(user=self.admin)
        resp = self.client.get("/api/admin-ops/flags/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(resp.data["count"], 4)

        # Search filter
        resp_search = self.client.get("/api/admin-ops/flags/?q=speech")
        self.assertEqual(resp_search.status_code, status.HTTP_200_OK)
        keys = [f["key"] for f in resp_search.data["results"]]
        self.assertIn("speech_shadowing_v2", keys)

    def test_feature_flag_toggle_and_audit_trail(self):
        # Learner cannot toggle
        self.client.force_authenticate(user=self.learner)
        resp_denied = self.client.post(
            "/api/admin-ops/flags/ai_tutor_realtime/toggle/",
            {"enabled": False, "reason": "Emergency pause for upstream outage."},
            format="json",
        )
        self.assertEqual(resp_denied.status_code, status.HTTP_403_FORBIDDEN)

        # Admin must provide mandatory reason
        self.client.force_authenticate(user=self.admin)
        resp_no_reason = self.client.post(
            "/api/admin-ops/flags/ai_tutor_realtime/toggle/",
            {"enabled": False},
            format="json",
        )
        self.assertEqual(resp_no_reason.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("reason", resp_no_reason.data)

        # Admin successfully toggles flag
        toggle_payload = {
            "enabled": False,
            "rollout_percentage": 0,
            "kill_switch_behavior": "disable_feature",
            "reason": "Emergency killswitch triggered due to third-party vendor outage.",
        }
        resp_ok = self.client.post(
            "/api/admin-ops/flags/ai_tutor_realtime/toggle/",
            toggle_payload,
            format="json",
        )
        self.assertEqual(resp_ok.status_code, status.HTTP_200_OK)
        self.assertFalse(resp_ok.data["flag"]["enabled"])
        self.assertEqual(resp_ok.data["flag"]["rollout_percentage"], 0)

        # Verify an immutable AuditEvent was created
        audit = AuditEvent.objects.filter(target_pk="ai_tutor_realtime").first()
        self.assertIsNotNone(audit)
        self.assertEqual(audit.actor, self.admin)
        self.assertEqual(audit.action, AuditEvent.Action.UPDATE)
        self.assertEqual(audit.reason, toggle_payload["reason"])
        self.assertTrue(audit.before_summary["enabled"])
        self.assertFalse(audit.after_summary["enabled"])

    def test_audit_logs_list_endpoint(self):
        # Trigger an audit event first
        AuditEvent.objects.create(
            actor=self.admin,
            action=AuditEvent.Action.CREATE,
            target_app="content",
            target_model="ContentItem",
            target_pk="new-item-123",
            reason="Created educational grammar lesson",
        )

        self.client.force_authenticate(user=self.admin)
        resp = self.client.get("/api/admin-ops/audit/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(resp.data["count"], 1)
        self.assertEqual(resp.data["results"][0]["actor_email"], self.admin.email)

        # Filter by target_app
        resp_filtered = self.client.get("/api/admin-ops/audit/?target_app=content")
        self.assertEqual(resp_filtered.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(resp_filtered.data["count"], 1)

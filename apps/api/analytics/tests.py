from __future__ import annotations

import uuid
from datetime import timedelta
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from analytics.models import DailyAnalyticsRollup, FunnelDefinition, ProductAnalyticsEvent
from analytics.services.event_service import (
    BOUNDED_EVENT_CHOICES,
    hash_client_ip,
    ingest_event,
    sanitize_event_properties,
)
from analytics.services.funnel_service import calculate_funnel_metrics
from analytics.services.kpi_service import get_analytics_overview
from analytics.services.retention_service import calculate_retention_cohorts
from data_protection.models import PrivacyConsentPreference

User = get_user_model()


class ProductAnalyticsDay57Tests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            email="analytics_admin@endoora.ir",
            password="SecureAdminPassword123!",
            role="administrator",
            is_staff=True,
        )
        self.learner_user = User.objects.create_user(
            email="analytics_learner@endoora.ir",
            password="SecureLearnerPassword123!",
            role="learner",
            is_staff=False,
        )

    def test_bounded_event_ingestion_success(self):
        event = ingest_event(
            event_name="auth_signup_attempt",
            user=self.learner_user,
            session_id="sess_12345",
            properties={"campaign": "google_ads", "step": 1},
            client_ip="5.200.10.20",
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
            locale="fa",
        )
        self.assertEqual(event.event_name, "auth_signup_attempt")
        self.assertEqual(event.category, ProductAnalyticsEvent.Category.AUTH)
        self.assertEqual(event.user, self.learner_user)
        self.assertEqual(event.user_agent_category, ProductAnalyticsEvent.DeviceCategory.MOBILE)
        self.assertEqual(event.properties["campaign"], "google_ads")
        self.assertNotEqual(event.client_ip_hash, "5.200.10.20")
        self.assertTrue(len(event.client_ip_hash) > 10)

    def test_unknown_event_rejected_by_service(self):
        with self.assertRaises(ValueError):
            ingest_event(event_name="unauthorized_arbitrary_event")

    def test_unknown_event_rejected_by_track_endpoint(self):
        response = self.client.post(
            "/api/analytics/track/",
            {"event_name": "malicious_script_injection_event", "properties": {}},
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("event_name", response.data)

    def test_valid_event_accepted_by_track_endpoint(self):
        response = self.client.post(
            "/api/analytics/track/",
            {
                "event_name": "route_view_landing",
                "session_id": "client_session_abc",
                "properties": {"referrer": "direct"},
                "locale": "fa",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 204)
        self.assertTrue(
            ProductAnalyticsEvent.objects.filter(
                event_name="route_view_landing",
                session_id="client_session_abc",
            ).exists()
        )

    def test_client_ip_hashed_never_raw(self):
        ip = "185.143.232.10"
        hashed = hash_client_ip(ip)
        self.assertNotEqual(hashed, ip)
        self.assertNotIn(ip, hashed)
        self.assertEqual(hash_client_ip(None), "")

    def test_properties_sanitization_removes_sensitive_keys(self):
        dirty = {
            "password": "ClearTextPassword!",
            "token": "bearer_xyz",
            "text": "This is raw learner essay text that must not be in telemetry.",
            "email": "learner@gmail.com",
            "valid_metric": 42,
            "theme_mode": "dark",
        }
        clean = sanitize_event_properties(dirty)
        self.assertNotIn("password", clean)
        self.assertNotIn("token", clean)
        self.assertNotIn("text", clean)
        self.assertNotIn("email", clean)
        self.assertEqual(clean["valid_metric"], 42)
        self.assertEqual(clean["theme_mode"], "dark")

    def test_user_privacy_preference_opt_out_respected(self):
        # Create user with analytics opt-out
        opt_out_user = User.objects.create_user(
            email="optout_user@endoora.ir",
            password="SecurePassword123!",
            role="learner",
        )
        PrivacyConsentPreference.objects.create(
            user=opt_out_user,
            analytics_processing=False,  # Explicitly opted out
        )

        event = ingest_event(
            event_name="mission_started",
            user=opt_out_user,
            session_id="opt_out_session",
            properties={"mission_type": "speaking"},
        )
        # Verify user identity is detached
        self.assertIsNone(event.user)
        self.assertEqual(event.event_name, "mission_started")

    def test_funnel_metrics_calculation(self):
        funnel = FunnelDefinition.objects.create(
            slug="test-conversion-funnel",
            name_fa="فانل آزمایشی",
            name_en="Test Conversion Funnel",
            steps=[
                {"step_index": 1, "name_fa": "مرحله ۱", "name_en": "Step 1", "event_name": "route_view_landing"},
                {"step_index": 2, "name_fa": "مرحله ۲", "name_en": "Step 2", "event_name": "auth_signup_attempt"},
                {"step_index": 3, "name_fa": "مرحله ۳", "name_en": "Step 3", "event_name": "auth_otp_verify"},
            ],
        )

        # 10 actors step 1
        for i in range(10):
            ingest_event("route_view_landing", session_id=f"user_{i}")
        # 6 actors step 2
        for i in range(6):
            ingest_event("auth_signup_attempt", session_id=f"user_{i}")
        # 3 actors step 3
        for i in range(3):
            ingest_event("auth_otp_verify", session_id=f"user_{i}")

        metrics = calculate_funnel_metrics("test-conversion-funnel", days=1)
        self.assertEqual(metrics["total_entries"], 10)
        self.assertEqual(metrics["total_completions"], 3)
        self.assertEqual(metrics["overall_conversion_rate"], 30.0)
        self.assertEqual(len(metrics["steps"]), 3)
        self.assertEqual(metrics["steps"][0]["step_conversion_rate"], 100.0)
        self.assertEqual(metrics["steps"][1]["step_conversion_rate"], 60.0)
        self.assertEqual(metrics["steps"][2]["step_conversion_rate"], 50.0)

    def test_funnel_detail_endpoint_success(self):
        FunnelDefinition.objects.create(
            slug="sample-funnel",
            name_fa="فانل نمونه",
            name_en="Sample Funnel",
            steps=[{"step_index": 1, "name_fa": "یک", "name_en": "One", "event_name": "route_view_landing"}],
        )
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get("/api/analytics/ops/funnels/sample-funnel/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["funnel"]["slug"], "sample-funnel")

    def test_funnel_detail_endpoint_not_found(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get("/api/analytics/ops/funnels/non-existent-slug/")
        self.assertEqual(response.status_code, 404)

    def test_funnels_list_endpoint(self):
        FunnelDefinition.objects.create(
            slug="list-test-funnel",
            name_fa="تست لیست",
            name_en="List Test",
            steps=[{"step_index": 1, "name_fa": "شروع", "name_en": "Start", "event_name": "route_view_landing"}],
        )
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get("/api/analytics/ops/funnels/")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) >= 1)

    def test_analytics_overview_endpoint(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get("/api/analytics/ops/overview/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("kpis", response.data)
        self.assertIn("dau", response.data["kpis"])
        self.assertIn("category_breakdown", response.data)
        self.assertIn("daily_trend", response.data)

    def test_cohorts_endpoint(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get("/api/analytics/ops/cohorts/?weeks=4")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 4)
        self.assertIn("cohort_week", response.data[0])

    def test_events_stream_endpoint_filtering(self):
        ingest_event("mission_started", session_id="stream_sess_1")
        ingest_event("payment_succeeded", session_id="stream_sess_2")

        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get("/api/analytics/ops/events/?category=learning")
        self.assertEqual(response.status_code, 200)
        for ev in response.data:
            self.assertEqual(ev["category"], "learning")

    def test_admin_endpoints_require_admin_permission(self):
        # 1. Unauthenticated gets 401 or 403
        res1 = self.client.get("/api/analytics/ops/overview/")
        self.assertIn(res1.status_code, [401, 403])

        # 2. Learner gets 403
        self.client.force_authenticate(user=self.learner_user)
        res2 = self.client.get("/api/analytics/ops/overview/")
        self.assertEqual(res2.status_code, 403)

    def test_seed_analytics_funnels_command(self):
        call_command("seed_analytics_funnels")
        self.assertEqual(
            FunnelDefinition.objects.filter(
                slug__in=[
                    "onboarding-funnel",
                    "placement-funnel",
                    "teacher-booking-funnel",
                    "learning-retention-loop",
                ]
            ).count(),
            4,
        )

    def test_generate_analytics_rollup_command(self):
        ingest_event("route_view_landing", session_id="rollup_sess")
        call_command("generate_analytics_rollup", days=1)
        self.assertTrue(DailyAnalyticsRollup.objects.exists())

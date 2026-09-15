from __future__ import annotations

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from production_launch.models import (
    GoldenFlowStatus,
    GoldenFlowVerificationLog,
    ProductionLaunchSignoff,
)
from production_launch.services.golden_flow_runner import GoldenFlowVerificationRunner
from production_launch.services.launch_gate_checklist import LaunchGateChecklistEvaluator

User = get_user_model()


class ProductionLaunchBackendTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(
            email="principal_launch_eng@endoora.ir",
            password="StrongProductionPassword123!",
            role="administrator",
            is_staff=True,
        )
        self.learner = User.objects.create_user(
            email="learner_test@endoora.ir",
            password="StrongProductionPassword123!",
            role="learner",
        )

    def test_golden_flow_runner_runs_7_flows(self):
        result = GoldenFlowVerificationRunner.run_rehearsal(operator=self.admin)
        self.assertEqual(result["score"], 100)
        self.assertEqual(result["status"], GoldenFlowStatus.PASS)
        self.assertEqual(result["total_flows"], 7)
        self.assertEqual(result["passed_flows"], 7)
        self.assertEqual(len(result["flows"]), 7)
        self.assertGreater(result["duration_ms"], 0)

        log = GoldenFlowVerificationLog.objects.get(id=result["run_id"])
        self.assertEqual(log.operator, self.admin)
        self.assertEqual(log.score, 100)
        self.assertEqual(log.status, GoldenFlowStatus.PASS)

    def test_golden_flow_flow_ids_and_names(self):
        result = GoldenFlowVerificationRunner.run_rehearsal()
        expected_ids = [
            "flow_01_auth_onboarding",
            "flow_02_placement_diagnostic",
            "flow_03_daily_mission_srs",
            "flow_04_marketplace_escrow",
            "flow_05_teacher_studio_gradebook",
            "flow_06_ielts_simulation",
            "flow_07_operations_resilience",
        ]
        found_ids = [f["flow_id"] for f in result["flows"]]
        self.assertEqual(found_ids, expected_ids)
        for flow in result["flows"]:
            self.assertEqual(flow["status"], "PASS")
            self.assertGreaterEqual(len(flow["steps"]), 4)
            self.assertTrue(len(flow["evidence"]) > 0)

    def test_launch_gate_checklist_evaluator(self):
        scorecard = LaunchGateChecklistEvaluator.evaluate_readiness()
        self.assertEqual(scorecard["score"], 100)
        self.assertEqual(scorecard["status"], "READY_FOR_PRODUCTION")
        self.assertEqual(scorecard["certification"], "LAUNCH-001 Production Certified")
        self.assertEqual(scorecard["total_checks"], 10)
        self.assertEqual(scorecard["passed_count"], 10)
        self.assertEqual(len(scorecard["checks"]), 10)

    def test_launch_gate_checklist_has_release_hash(self):
        scorecard = LaunchGateChecklistEvaluator.evaluate_readiness()
        self.assertIn("confirmation_hash", scorecard)
        self.assertEqual(len(scorecard["confirmation_hash"]), 64)

    def test_checklist_categories_covered(self):
        scorecard = LaunchGateChecklistEvaluator.evaluate_readiness()
        categories = {c["category"] for c in scorecard["checks"]}
        expected = {
            "Architecture & Data",
            "Quality Assurance",
            "Security & Privacy",
            "Infrastructure & HA",
            "AI Subsystem",
            "Observability",
            "Analytics & Telemetry",
            "PWA & Resilience",
            "Incident Response",
            "End-to-End Golden Flows",
        }
        self.assertEqual(categories, expected)

    def test_production_launch_signoff_model(self):
        signoff = ProductionLaunchSignoff.objects.create(
            authorized_by=self.admin,
            engineer_name="سجاد زارع",
            role="معمار ارشد سیستم",
            status=ProductionLaunchSignoff.Status.APPROVED,
            verification_score=100,
            confirmation_hash="a" * 64,
            notes="آماده راه‌اندازی و لانچ نهایی بدون ریسک مسدودکننده.",
        )
        self.assertEqual(signoff.status, ProductionLaunchSignoff.Status.APPROVED)
        self.assertEqual(signoff.verification_score, 100)
        self.assertIn("سجاد زارع", str(signoff))

    def test_launch_status_api_requires_staff(self):
        self.client.force_authenticate(user=self.learner)
        resp = self.client.get("/api/launch/status/")
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.admin)
        resp = self.client.get("/api/launch/status/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["score"], 100)
        self.assertEqual(resp.data["status"], "READY_FOR_PRODUCTION")

    def test_launch_rehearsal_api_requires_staff(self):
        self.client.force_authenticate(user=self.learner)
        resp = self.client.post("/api/launch/rehearsal/", format="json")
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.admin)
        resp = self.client.post("/api/launch/rehearsal/", format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["total_flows"], 7)
        self.assertEqual(resp.data["score"], 100)

    def test_production_signoff_api_post_and_get(self):
        self.client.force_authenticate(user=self.admin)
        payload = {
            "engineer_name": "Sajad Zare",
            "role": "Principal Lead Architect",
            "notes": "All 60 roadmap milestones completed and verified.",
        }
        post_resp = self.client.post("/api/launch/signoff/", payload, format="json")
        self.assertEqual(post_resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(post_resp.data["engineer_name"], "Sajad Zare")
        self.assertEqual(post_resp.data["status"], "APPROVED")
        self.assertEqual(len(post_resp.data["confirmation_hash"]), 64)

        get_resp = self.client.get("/api/launch/signoff/")
        self.assertEqual(get_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(get_resp.data["engineer_name"], "Sajad Zare")

    def test_production_signoff_api_validation_error(self):
        self.client.force_authenticate(user=self.admin)
        resp = self.client.post("/api/launch/signoff/", {}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("engineer_name", resp.data)

    def test_golden_flow_history_api(self):
        GoldenFlowVerificationRunner.run_rehearsal()
        self.client.force_authenticate(user=self.admin)
        resp = self.client.get("/api/launch/history/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(resp.data), 1)

    def test_command_run_golden_flow_rehearsal(self):
        call_command("run_golden_flow_rehearsal")
        self.assertTrue(GoldenFlowVerificationLog.objects.exists())

    def test_command_verify_production_launch_readiness(self):
        call_command("verify_production_launch_readiness")
        scorecard = LaunchGateChecklistEvaluator.evaluate_readiness()
        self.assertEqual(scorecard["score"], 100)

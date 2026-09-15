from __future__ import annotations

import io
import json
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from audit.models import AuditEvent
from ai_gateway.models import AIProviderConfig, AIRequestLog
from ai_gateway.prompt_registry import PROMPT_REGISTRY
from ai_gateway.services_ops import (
    get_ai_operations_overview,
    get_prompt_registry_catalog,
    reset_circuit_breaker,
    test_evaluate_prompt,
    update_provider_budget,
)

User = get_user_model()


class AIGatewayOperationsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            email="ai_admin@endoora.ir",
            password="SecureAdminPassword123!",
            role="administrator",
            is_staff=True,
        )
        self.learner_user = User.objects.create_user(
            email="ai_learner@endoora.ir",
            password="SecureLearnerPassword123!",
            role="learner",
            is_staff=False,
        )

    def test_ai_operations_overview_authorization(self):
        # Unauthenticated request
        res = self.client.get("/api/ai/ops/overview/")
        self.assertIn(res.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

        # Learner forbidden
        self.client.force_authenticate(user=self.learner_user)
        res = self.client.get("/api/ai/ops/overview/")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

        # Admin authorized
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.get("/api/ai/ops/overview/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("sla_metrics", res.data)
        self.assertIn("budget_controls", res.data)
        self.assertIn("circuit_breaker", res.data)

    def test_ai_operations_overview_metrics(self):
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.get("/api/ai/ops/overview/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        sla = res.data["sla_metrics"]
        self.assertEqual(sla["target_sla_pct"], 99.5)
        self.assertEqual(sla["error_budget_allowed_pct"], 0.5)
        self.assertGreaterEqual(sla["error_budget_remaining_pct"], 0.0)

        budget = res.data["budget_controls"]
        self.assertEqual(budget["billing_currency"], "USD")
        self.assertGreater(budget["daily_budget_usd"], 0.0)

        latency = res.data["latency_percentiles_ms"]
        self.assertGreater(latency["p50"], 0)
        self.assertGreater(latency["p95"], latency["p50"])

        tiers = res.data["model_tiers"]
        self.assertEqual(len(tiers), 5)
        self.assertEqual(tiers[0]["tier"], 1)

    def test_prompt_registry_catalog_endpoint(self):
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.get("/api/ai/ops/prompts/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 5)

        features = [p["feature"] for p in res.data]
        self.assertIn("exercise_generation", features)
        self.assertIn("writing_mentor", features)
        self.assertIn("roleplay", features)
        self.assertIn("placement", features)
        self.assertIn("pronunciation", features)

    def test_model_router_status_endpoint(self):
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.get("/api/ai/ops/models/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("model_tiers", res.data)
        self.assertIn("circuit_breaker", res.data)
        self.assertEqual(res.data["circuit_breaker"]["state"], "CLOSED")

    def test_ai_request_log_list_endpoint(self):
        AIRequestLog.objects.create(
            feature="writing_mentor",
            model_name="google/gemma-2-9b-it:free",
            provider="openrouter",
            prompt_tokens=420,
            completion_tokens=210,
            total_cost_usd=0.0,
            response_time_ms=850,
            success=True,
            is_fallback=False,
        )

        self.client.force_authenticate(user=self.admin_user)
        res = self.client.get("/api/ai/ops/logs/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res.data), 1)

        first_log = res.data[0]
        self.assertEqual(first_log["feature"], "writing_mentor")
        self.assertEqual(first_log["total_tokens"], 630)
        self.assertEqual(first_log["response_time_ms"], 850)

    def test_prompt_test_endpoint(self):
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.post("/api/ai/ops/prompts/exercise_gen_v1/test/", data={}, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["status"], "PASS")
        self.assertTrue(res.data["schema_valid"])
        self.assertGreater(res.data["token_estimate"], 0)

    def test_prompt_test_all_registry_prompts(self):
        for pid in PROMPT_REGISTRY:
            res = test_evaluate_prompt(pid)
            self.assertEqual(res["status"], "PASS", f"Prompt {pid} failed evaluation: {res.get('error')}")
            self.assertTrue(res["schema_valid"], f"Prompt {pid} schema invalid")

    def test_circuit_breaker_reset_endpoint(self):
        config, _ = AIProviderConfig.objects.get_or_create(name="openrouter_main")
        config.enabled = False
        config.save()

        self.client.force_authenticate(user=self.admin_user)
        res = self.client.post("/api/ai/ops/circuit-breaker/reset/", data={}, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["status"], "RESET_SUCCESSFUL")
        self.assertEqual(res.data["state"], "CLOSED")

        config.refresh_from_db()
        self.assertTrue(config.enabled)

        audit_event = AuditEvent.objects.filter(
            target_app="ai_gateway",
            target_model="AIProviderConfig",
            target_pk=str(config.id),
            action=AuditEvent.Action.UPDATE,
        ).first()
        self.assertIsNotNone(audit_event)

    def test_budget_update_endpoint(self):
        self.client.force_authenticate(user=self.admin_user)
        payload = {"daily_budget_usd": 12.5}
        res = self.client.post("/api/ai/ops/budget/update/", data=payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["daily_budget_usd"], 12.5)

        config = AIProviderConfig.objects.get(name="openrouter_main")
        self.assertEqual(config.daily_budget_usd, 12.5)

    def test_budget_update_missing_parameter(self):
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.post("/api/ai/ops/budget/update/", data={}, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_management_command_check_ai_budget(self):
        out = io.StringIO()
        call_command("check_ai_budget", "--json", stdout=out)
        data = json.loads(out.getvalue())
        self.assertIn("budget_controls", data)
        self.assertIn("circuit_breaker", data)
        self.assertIn("sla_metrics", data)

    def test_management_command_evaluate_prompts(self):
        out = io.StringIO()
        call_command("evaluate_prompts", "--json", stdout=out)
        data = json.loads(out.getvalue())
        self.assertEqual(len(data), 5)
        for p in data:
            self.assertEqual(p["status"], "PASS")

    def test_error_budget_calculation(self):
        overview = get_ai_operations_overview()
        sla = overview["sla_metrics"]
        self.assertIn("budget_status", sla)
        self.assertIn("error_budget_remaining_pct", sla)
        self.assertLessEqual(sla["error_budget_remaining_pct"], 100.0)

from __future__ import annotations

import io
import uuid
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import RequestFactory, TestCase
from rest_framework.test import APIClient

from observability.middleware import CorrelationTraceMiddleware, STRUCTURED_LOG_BUFFER
from observability.models import DistributedTraceRecord, IncidentAlert, SystemMetricSnapshot
from observability.services import telemetry_service

User = get_user_model()


class ObservabilityTelemetryTests(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            email="admin.obs@endoora.ir",
            password="SecureAdminPassword123!",
            role="administrator",
            is_staff=True,
        )
        self.learner_user = User.objects.create_user(
            email="learner.obs@endoora.ir",
            password="SecureLearnerPassword123!",
            role="learner",
            is_staff=False,
        )

    def test_correlation_trace_middleware(self) -> None:
        factory = RequestFactory()
        request = factory.get("/api/health/")

        def get_response(req):
            from django.http import HttpResponse
            return HttpResponse("OK", status=200)

        middleware = CorrelationTraceMiddleware(get_response)
        response = middleware(request)

        self.assertIn("X-Trace-ID", response)
        self.assertIn("X-Correlation-ID", response)
        self.assertTrue(hasattr(request, "trace_id"))
        self.assertTrue(len(STRUCTURED_LOG_BUFFER) > 0)
        latest_log = STRUCTURED_LOG_BUFFER[0]
        self.assertEqual(latest_log["path"], "/api/health/")
        self.assertEqual(latest_log["status_code"], 200)

    def test_observability_overview_service(self) -> None:
        overview = telemetry_service.get_observability_overview()
        self.assertIn("apm_metrics", overview)
        self.assertIn("database_pool", overview)
        self.assertIn("redis_cache", overview)
        self.assertIn("worker_queues", overview)
        self.assertIn("alerts_summary", overview)
        self.assertGreaterEqual(overview["apm_metrics"]["uptime_percentage"], 99.0)

    def test_distributed_traces_service(self) -> None:
        traces = telemetry_service.get_recent_traces(limit=5)
        self.assertTrue(len(traces) > 0)
        first_trace = traces[0]
        self.assertIn("trace_id", first_trace)
        self.assertIn("spans", first_trace)
        self.assertIn("total_duration_ms", first_trace)

    def test_structured_logs_service(self) -> None:
        logs = telemetry_service.get_structured_logs(limit=10)
        self.assertTrue(len(logs) > 0)
        first_log = logs[0]
        self.assertIn("timestamp", first_log)
        self.assertIn("level", first_log)
        self.assertIn("method", first_log)

    def test_acknowledge_alert(self) -> None:
        alert = IncidentAlert.objects.create(
            title="Test Alert",
            title_fa="هشدار تستی",
            severity=IncidentAlert.Severity.HIGH,
            component=IncidentAlert.Component.DATABASE,
            status=IncidentAlert.Status.ACTIVE,
        )
        res = telemetry_service.acknowledge_alert(str(alert.id), self.admin_user)
        self.assertTrue(res["success"])
        alert.refresh_from_db()
        self.assertEqual(alert.status, IncidentAlert.Status.ACKNOWLEDGED)
        self.assertEqual(alert.acknowledged_by, self.admin_user)

    def test_acknowledge_alert_invalid_id(self) -> None:
        res = telemetry_service.acknowledge_alert(str(uuid.uuid4()), self.admin_user)
        self.assertFalse(res["success"])

    def test_simulate_latency_drill(self) -> None:
        res = telemetry_service.simulate_latency_drill(duration_spike_ms=520.0)
        self.assertTrue(res["success"])
        self.assertEqual(res["simulated_duration_ms"], 520.0)
        self.assertTrue(IncidentAlert.objects.filter(id=res["generated_alert_id"]).exists())

    def test_endpoints_permissions_enforced(self) -> None:
        # Learner gets 403
        self.client.force_authenticate(user=self.learner_user)
        res = self.client.get("/api/observability/overview/")
        self.assertEqual(res.status_code, 403)

        # Admin gets 200
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.get("/api/observability/overview/")
        self.assertEqual(res.status_code, 200)

        # Traces endpoint
        res = self.client.get("/api/observability/traces/")
        self.assertEqual(res.status_code, 200)

        # Logs endpoint
        res = self.client.get("/api/observability/logs/?level=INFO")
        self.assertEqual(res.status_code, 200)

    def test_alert_ack_endpoint(self) -> None:
        alert = IncidentAlert.objects.create(
            title="API High Latency",
            title_fa="تاخیر بالای وب",
            severity=IncidentAlert.Severity.MEDIUM,
            component=IncidentAlert.Component.API,
            status=IncidentAlert.Status.ACTIVE,
        )
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.post(f"/api/observability/alerts/{alert.id}/ack/")
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.data["success"])

    def test_simulate_latency_drill_endpoint(self) -> None:
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.post("/api/observability/drill/latency/", {"duration_ms": 390.0}, format="json")
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.data["success"])

    def test_check_system_health_command(self) -> None:
        out = io.StringIO()
        call_command("check_system_health", stdout=out)
        output = out.getvalue()
        self.assertIn("ENDOORA PRODUCTION OBSERVABILITY", output)
        self.assertIn("System Uptime", output)

    def test_check_system_health_command_json(self) -> None:
        out = io.StringIO()
        call_command("check_system_health", "--json", stdout=out)
        output = out.getvalue()
        self.assertIn('"apm_metrics"', output)
        self.assertIn('"service_name"', output)

    def test_model_str_representations(self) -> None:
        snap = SystemMetricSnapshot.objects.create(
            uptime_percentage=99.9,
            p50_latency_ms=35.0,
            p95_latency_ms=120.0,
            p99_latency_ms=250.0,
            requests_per_second=180.0,
            error_rate_percentage=0.05,
        )
        self.assertIn("SystemMetricSnapshot", str(snap))

        span = DistributedTraceRecord.objects.create(
            trace_id=uuid.uuid4().hex,
            span_id=uuid.uuid4().hex[:12],
            service_name="test-service",
            operation_name="test-op",
            duration_ms=45.2,
            status="OK",
        )
        self.assertIn("TraceSpan<test-service:test-op", str(span))

        alert = IncidentAlert.objects.create(
            title="Redis Memory",
            title_fa="حافظه ردیس",
            severity=IncidentAlert.Severity.LOW,
            component=IncidentAlert.Component.REDIS,
            status=IncidentAlert.Status.ACTIVE,
        )
        self.assertIn("IncidentAlert<LOW:REDIS", str(alert))

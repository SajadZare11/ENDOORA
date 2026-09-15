from __future__ import annotations

import uuid
from datetime import timedelta
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from disaster_recovery.models import DatabaseBackupSnapshot
from incident_response.models import (
    Incident,
    IncidentSeverity,
    IncidentStatus,
    RestoreVerificationLog,
    RestoreVerificationStatus,
    RunbookDefinition,
)
from incident_response.services.restore_service import RestoreVerificationService
from incident_response.services.runbook_service import RunbookService

User = get_user_model()


class IncidentResponseBackendTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(
            email="admin_ops@endoora.ir",
            password="StrongPassword123!",
            role="administrator",
            is_staff=True,
        )
        self.learner = User.objects.create_user(
            email="learner_user@endoora.ir",
            password="StrongPassword123!",
            role="learner",
        )

    def test_verify_backup_restore_synthetic(self):
        log = RestoreVerificationService.verify_backup_restore(dry_run=True)
        self.assertIsNotNone(log.id)
        self.assertEqual(log.status, RestoreVerificationStatus.VERIFIED)
        self.assertTrue(log.checksum_verified)
        self.assertGreater(log.tables_restored_count, 0)
        self.assertGreater(log.records_sampled_count, 0)
        self.assertIn("verified_tables", log.details)

    def test_verify_backup_restore_with_snapshot(self):
        snapshot = DatabaseBackupSnapshot.objects.create(
            storage_location="vault/backups/snapshot_test.dump",
            file_size_bytes=1024 * 1024,
            checksum_sha256="abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
            backup_type="full",
            status="verified",
        )
        log = RestoreVerificationService.verify_backup_restore(snapshot_id=str(snapshot.id), dry_run=False)
        self.assertEqual(log.snapshot, snapshot)
        self.assertEqual(log.checksum, snapshot.checksum_sha256)
        self.assertEqual(log.status, RestoreVerificationStatus.VERIFIED)

    def test_evaluate_launch_gate_readiness(self):
        RunbookService.sync_official_runbooks()
        scorecard = RestoreVerificationService.evaluate_launch_gate_readiness()
        self.assertEqual(scorecard["score"], 100)
        self.assertEqual(scorecard["status"], "READY_FOR_PAID_PRODUCTION")
        self.assertEqual(len(scorecard["pillars"]), 6)
        for pillar in scorecard["pillars"]:
            self.assertEqual(pillar["status"], "PASS")

    def test_runbook_sync_and_count(self):
        count = RunbookService.sync_official_runbooks()
        self.assertEqual(count, 6)
        self.assertEqual(RunbookDefinition.objects.count(), 6)

        expected_slugs = [
            "db-failover-recovery",
            "payment-gateway-outage",
            "ai-quota-exhaustion",
            "auth-credential-stuffing",
            "storage-unavailability",
            "ddos-rate-limiting",
        ]
        for slug in expected_slugs:
            self.assertTrue(RunbookDefinition.objects.filter(slug=slug).exists())

    def test_runbook_execute_dry_run_step(self):
        RunbookService.sync_official_runbooks()
        res = RunbookService.execute_dry_run_step("db-failover-recovery", 1)
        self.assertTrue(res["success"])
        self.assertEqual(res["step_number"], 1)
        self.assertEqual(res["status"], "PASSED (DRY RUN)")
        self.assertIn("دستور با موفقیت", res["output"])

        rb = RunbookDefinition.objects.get(slug="db-failover-recovery")
        self.assertIsNotNone(rb.last_rehearsed_at)

    def test_runbook_execute_invalid_step(self):
        RunbookService.sync_official_runbooks()
        res = RunbookService.execute_dry_run_step("db-failover-recovery", 999)
        self.assertFalse(res["success"])
        self.assertIn("یافت نشد", res.get("error", res.get("detail", "")))

    def test_incident_model_durations(self):
        now = timezone.now()
        detected = now - timedelta(minutes=45)
        mitigated = now - timedelta(minutes=25)
        resolved = now - timedelta(minutes=5)

        incident = Incident.objects.create(
            title="تست اختلال موقت درگاه",
            severity=IncidentSeverity.P2_HIGH,
            status=IncidentStatus.RESOLVED,
            affected_service="Billing",
            summary="گزارش اختلال در تراکنش‌ها",
            detected_at=detected,
            mitigated_at=mitigated,
            resolved_at=resolved,
        )

        self.assertEqual(incident.time_to_mitigate_minutes, 20.0)
        self.assertEqual(incident.time_to_resolve_minutes, 40.0)

    def test_incident_list_create_api_requires_staff(self):
        self.client.force_authenticate(user=self.learner)
        resp = self.client.get("/api/incidents/")
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.admin)
        resp = self.client.get("/api/incidents/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        payload = {
            "title": "افت توان سرویس تبدیل گفتار به متن",
            "severity": "P2_HIGH",
            "status": "investigating",
            "affected_service": "Voice Lab",
            "summary": "نرخ تاخیر به بالای ۳ ثانیه رسیده است",
        }
        create_resp = self.client.post("/api/incidents/", payload, format="json")
        self.assertEqual(create_resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(create_resp.data["title"], payload["title"])
        self.assertEqual(create_resp.data["commander_email"], self.admin.email)

    def test_incident_filter_severity_and_status(self):
        Incident.objects.create(
            title="بحران P1 قطعی دیتابیس",
            severity=IncidentSeverity.P1_CRITICAL,
            status=IncidentStatus.DETECTED,
            affected_service="Database",
            summary="قطعی کلاستر",
        )
        Incident.objects.create(
            title="مشکل P3 کندی گزارش‌گیری",
            severity=IncidentSeverity.P3_MEDIUM,
            status=IncidentStatus.RESOLVED,
            affected_service="Reporting",
            summary="کندی گزارش",
        )

        self.client.force_authenticate(user=self.admin)
        resp = self.client.get("/api/incidents/?severity=P1_CRITICAL")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 1)
        self.assertEqual(resp.data[0]["severity"], "P1_CRITICAL")

        resp_status = self.client.get("/api/incidents/?status=resolved")
        self.assertEqual(resp_status.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp_status.data), 1)
        self.assertEqual(resp_status.data[0]["status"], "resolved")

    def test_incident_detail_patch_and_delete(self):
        incident = Incident.objects.create(
            title="اختلال موقت",
            severity=IncidentSeverity.P3_MEDIUM,
            status=IncidentStatus.DETECTED,
            affected_service="Search",
            summary="خطای بازگشتی در جستجوی پیشرفته",
        )
        self.client.force_authenticate(user=self.admin)

        patch_resp = self.client.patch(
            f"/api/incidents/{incident.id}/",
            {"status": "resolved", "mitigation_steps": "راه‌اندازی مجدد سرویس ایندکس"},
            format="json",
        )
        self.assertEqual(patch_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_resp.data["status"], "resolved")

        del_resp = self.client.delete(f"/api/incidents/{incident.id}/")
        self.assertEqual(del_resp.status_code, status.HTTP_200_OK)
        self.assertFalse(Incident.objects.filter(id=incident.id).exists())

    def test_restore_verification_api(self):
        self.client.force_authenticate(user=self.admin)
        post_resp = self.client.post("/api/incidents/restore-verification/", {"dry_run": True}, format="json")
        self.assertEqual(post_resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(post_resp.data["status"], "verified")

        get_resp = self.client.get("/api/incidents/restore-verification/")
        self.assertEqual(get_resp.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(get_resp.data), 1)

    def test_runbook_list_and_execute_api(self):
        self.client.force_authenticate(user=self.admin)
        get_resp = self.client.get("/api/incidents/runbooks/")
        self.assertEqual(get_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(get_resp.data), 6)

        exec_resp = self.client.post(
            "/api/incidents/runbooks/db-failover-recovery/execute/",
            {"step_number": 1},
            format="json",
        )
        self.assertEqual(exec_resp.status_code, status.HTTP_200_OK)
        self.assertTrue(exec_resp.data["success"])

    def test_launch_gate_readiness_api(self):
        self.client.force_authenticate(user=self.admin)
        resp = self.client.get("/api/incidents/launch-gate/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["score"], 100)
        self.assertEqual(resp.data["status"], "READY_FOR_PAID_PRODUCTION")
        self.assertEqual(len(resp.data["pillars"]), 6)

    def test_management_command_seed_runbooks(self):
        call_command("seed_incident_runbooks")
        self.assertEqual(RunbookDefinition.objects.count(), 6)

    def test_management_command_verify_backup_restore(self):
        call_command("verify_backup_restore", "--dry-run")
        self.assertTrue(RestoreVerificationLog.objects.exists())

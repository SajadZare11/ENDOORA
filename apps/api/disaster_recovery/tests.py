from __future__ import annotations

import io
import json
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from audit.models import AuditEvent
from disaster_recovery.models import DatabaseBackupSnapshot, ReplicationNodeStatus
from disaster_recovery.services.backup_service import (
    create_database_backup,
    get_backup_statistics,
    verify_backup_snapshot,
)
from disaster_recovery.services.ha_telemetry_service import (
    get_failover_drill_checklist,
    get_ha_cluster_telemetry,
)

User = get_user_model()


class DisasterRecoveryUnitTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            email="dr_admin@endoora.ir",
            password="SecureAdminPassword123!",
            role="administrator",
            is_staff=True,
        )
        self.learner_user = User.objects.create_user(
            email="dr_learner@endoora.ir",
            password="SecureLearnerPassword123!",
            role="learner",
            is_staff=False,
        )

    def test_backup_creation_and_integrity(self):
        snapshot = create_database_backup(
            backup_type=DatabaseBackupSnapshot.BackupType.FULL,
            operator=self.admin_user,
            notes="Automated pre-migration snapshot",
        )
        self.assertIsNotNone(snapshot.id)
        self.assertEqual(snapshot.backup_type, DatabaseBackupSnapshot.BackupType.FULL)
        self.assertEqual(snapshot.status, DatabaseBackupSnapshot.Status.COMPLETED)
        self.assertEqual(len(snapshot.checksum_sha256), 64)
        self.assertGreater(snapshot.table_count, 0)
        self.assertGreater(snapshot.file_size_bytes, 0)
        self.assertEqual(snapshot.encryption_algorithm, "AES-256-GCM")

    def test_backup_verification(self):
        snapshot = create_database_backup(operator=self.admin_user)
        self.assertEqual(snapshot.status, DatabaseBackupSnapshot.Status.COMPLETED)
        self.assertIsNone(snapshot.verified_at)

        result = verify_backup_snapshot(snapshot.id, operator=self.admin_user)
        self.assertEqual(result["status"], "verified")
        self.assertEqual(result["integrity_check"], "PASSED")

        snapshot.refresh_from_db()
        self.assertEqual(snapshot.status, DatabaseBackupSnapshot.Status.VERIFIED)
        self.assertIsNotNone(snapshot.verified_at)
        self.assertGreater(snapshot.verification_duration_ms, 0)

    def test_backup_creates_immutable_audit_events(self):
        snapshot = create_database_backup(operator=self.admin_user)
        create_event = AuditEvent.objects.filter(
            target_app="disaster_recovery",
            target_model="DatabaseBackupSnapshot",
            target_pk=str(snapshot.id),
            action=AuditEvent.Action.CREATE,
        ).first()
        self.assertIsNotNone(create_event)
        self.assertEqual(create_event.actor, self.admin_user)

        verify_backup_snapshot(snapshot.id, operator=self.admin_user)
        update_event = AuditEvent.objects.filter(
            target_app="disaster_recovery",
            target_model="DatabaseBackupSnapshot",
            target_pk=str(snapshot.id),
            action=AuditEvent.Action.UPDATE,
        ).first()
        self.assertIsNotNone(update_event)

    def test_backup_differential_and_wal_types(self):
        diff_snapshot = create_database_backup(backup_type=DatabaseBackupSnapshot.BackupType.DIFFERENTIAL)
        self.assertEqual(diff_snapshot.backup_type, "differential")

        wal_snapshot = create_database_backup(backup_type=DatabaseBackupSnapshot.BackupType.WAL_ARCHIVE)
        self.assertEqual(wal_snapshot.backup_type, "wal_archive")

    def test_get_backup_statistics(self):
        create_database_backup()
        s2 = create_database_backup()
        verify_backup_snapshot(s2.id)

        stats = get_backup_statistics()
        self.assertGreaterEqual(stats["total_backups"], 2)
        self.assertGreaterEqual(stats["verified_backups"], 1)
        self.assertEqual(stats["health_percentage"], 100)

    def test_ha_cluster_telemetry(self):
        telemetry = get_ha_cluster_telemetry()
        self.assertIn("cluster_name", telemetry)
        self.assertEqual(telemetry["cluster_health"], "OPTIMAL")
        self.assertEqual(telemetry["topology"]["total_nodes"], 3)
        self.assertEqual(telemetry["topology"]["primary_node"], "pg-primary-01")
        self.assertEqual(telemetry["topology"]["sync_replicas"], 1)
        self.assertEqual(telemetry["topology"]["async_replicas"], 1)

        sla = telemetry["sla_metrics"]
        self.assertEqual(sla["rpo_status"], "COMPLIANT")
        self.assertEqual(sla["rto_status"], "COMPLIANT")
        self.assertLessEqual(sla["rpo_current_exposure_seconds"], 5.0)
        self.assertLessEqual(sla["rto_projected_failover_seconds"], 900)

    def test_failover_drill_checklist(self):
        drill = get_failover_drill_checklist()
        self.assertEqual(drill["total_steps"], 5)
        self.assertIn("PASS", drill["compliance_result"])
        self.assertLess(drill["estimated_total_time_seconds"], 900)

    def test_dr_status_endpoint_authorization(self):
        # Unauthenticated request
        res = self.client.get("/api/dr/status/")
        self.assertIn(res.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

        # Learner forbidden
        self.client.force_authenticate(user=self.learner_user)
        res = self.client.get("/api/dr/status/")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

        # Admin authorized
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.get("/api/dr/status/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["cluster_health"], "OPTIMAL")

    def test_dr_backups_list_endpoint(self):
        create_database_backup()
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.get("/api/dr/backups/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res.data), 1)

    def test_dr_backups_trigger_endpoint(self):
        self.client.force_authenticate(user=self.admin_user)
        payload = {
            "backup_type": "full",
            "verify_immediately": True,
            "notes": "Emergency test backup",
        }
        res = self.client.post("/api/dr/backups/trigger/", data=payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["status"], "verified")
        self.assertIn("verification_details", res.data)

    def test_dr_backups_verify_endpoint(self):
        snapshot = create_database_backup()
        self.client.force_authenticate(user=self.admin_user)

        res = self.client.post(f"/api/dr/backups/{snapshot.id}/verify/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["verification"]["status"], "verified")

        # Non-existent ID returns 404
        import uuid
        res_fake = self.client.post(f"/api/dr/backups/{uuid.uuid4()}/verify/")
        self.assertEqual(res_fake.status_code, status.HTTP_404_NOT_FOUND)

    def test_dr_drill_endpoint(self):
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.get("/api/dr/drill/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data["steps"]), 5)

    def test_management_command_run_database_backup(self):
        out = io.StringIO()
        call_command("run_database_backup", "--type=full", "--verify", stdout=out)
        output = out.getvalue()
        self.assertIn("Initiating full database backup", output)
        self.assertIn("[SUCCESS] Backup created successfully", output)
        self.assertIn("[VERIFIED] Verification completed", output)

    def test_management_command_check_replication_health(self):
        out = io.StringIO()
        call_command("check_replication_health", "--json", stdout=out)
        data = json.loads(out.getvalue())
        self.assertEqual(data["cluster_health"], "OPTIMAL")
        self.assertEqual(len(data["nodes"]), 3)

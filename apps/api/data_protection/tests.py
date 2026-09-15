from __future__ import annotations
import json
from datetime import timedelta
from django.utils import timezone
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.core.management import call_command
from io import StringIO

from accounts.models import User, OneTimeCode, AccountDeletionRequest
from audit.models import AuditEvent
from data_protection.models import PrivacyConsentPreference, DataPurgeLog
from profiles.models import DataExportRequest
from data_protection.services.export_service import compile_full_user_data_export
from data_protection.services.erasure_service import execute_account_erasure
from data_protection.services.retention_service import run_retention_purge


class DataProtectionTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="learner@example.com", password="password123")
        self.admin = User.objects.create_superuser(email="admin@example.com", password="password123")
        self.other_user = User.objects.create_user(email="other@example.com", password="password123")

    def test_privacy_preferences_get_and_update(self):
        self.client.force_authenticate(user=self.user)
        url = reverse("privacy-preferences")
        
        # GET creates default
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data["analytics_processing"])
        
        # PUT updates toggles
        res = self.client.put(url, {"analytics_processing": False, "marketing_communications": True})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertFalse(res.data["analytics_processing"])
        self.assertTrue(res.data["marketing_communications"])
        
    def test_functional_storage_cannot_be_disabled(self):
        self.client.force_authenticate(user=self.user)
        url = reverse("privacy-preferences")
        res = self.client.put(url, {"functional_storage": False})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data["functional_storage"])

    def test_compile_full_user_data_export(self):
        export_data = compile_full_user_data_export(self.user)
        self.assertEqual(export_data["schema_version"], "1.0.0")
        self.assertEqual(export_data["format"], "endoora_user_data_archive")
        self.assertIn("integrity_checksum_sha256", export_data)
        self.assertEqual(export_data["data"]["account"]["email"], "learner@example.com")
        self.assertEqual(export_data["data"]["account"]["id"], str(self.user.id))
        
    def test_export_excludes_passwords_and_otps(self):
        OneTimeCode.objects.create(identifier=self.user.email, purpose="login", requested_by=self.user, expires_at=timezone.now())
        export_data = compile_full_user_data_export(self.user)
        json_str = json.dumps(export_data)
        self.assertNotIn("password", json_str)
        self.assertNotIn(self.user.password, json_str)
        self.assertNotIn("OneTimeCode", json_str)

    def test_data_export_trigger_and_download(self):
        self.client.force_authenticate(user=self.user)
        
        # Trigger
        trigger_url = reverse("privacy-export-trigger")
        res = self.client.post(trigger_url)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        export_id = res.data["export_id"]
        
        # Download
        download_url = reverse("privacy-export-download", kwargs={"export_id": export_id})
        res2 = self.client.get(download_url)
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertEqual(res2["Content-Type"], "application/json")
        self.assertIn("attachment; filename=", res2["Content-Disposition"])
        content = json.loads(res2.content)
        self.assertEqual(content["user_id"], str(self.user.id))
        
    def test_cannot_download_other_user_export(self):
        req = DataExportRequest.objects.create(user=self.user, status=DataExportRequest.Status.COMPLETED)
        self.client.force_authenticate(user=self.other_user)
        url = reverse("privacy-export-download", kwargs={"export_id": str(req.id)})
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_execute_account_erasure_scrambles_pii(self):
        execute_account_erasure(self.user)
        self.user.refresh_from_db()
        self.assertNotEqual(self.user.email, "learner@example.com")
        self.assertTrue(self.user.email.startswith("deleted_"))
        self.assertFalse(self.user.is_active)
        self.assertFalse(self.user.has_usable_password())
        
    def test_execute_account_erasure_records_audit_event(self):
        execute_account_erasure(self.user)
        event = AuditEvent.objects.filter(target_pk=str(self.user.id)).first()
        self.assertIsNotNone(event)
        self.assertEqual(event.action, AuditEvent.Action.DELETE)

    def test_retention_purge_executes_scheduled_deletions(self):
        AccountDeletionRequest.objects.create(
            user=self.user,
            status=AccountDeletionRequest.Status.PENDING,
            scheduled_for=timezone.now() - timedelta(days=1)
        )
        run_retention_purge(dry_run=False)
        self.user.refresh_from_db()
        self.assertFalse(self.user.is_active)
        
    def test_retention_purge_dry_run(self):
        AccountDeletionRequest.objects.create(
            user=self.user,
            status=AccountDeletionRequest.Status.PENDING,
            scheduled_for=timezone.now() - timedelta(days=1)
        )
        run_retention_purge(dry_run=True)
        self.user.refresh_from_db()
        self.assertTrue(self.user.is_active)
        self.assertEqual(self.user.email, "learner@example.com")
        
    def test_admin_telemetry_endpoint_requires_staff(self):
        url = reverse("privacy-ops-telemetry")
        
        self.client.force_authenticate(user=self.user)
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        
        self.client.force_authenticate(user=self.admin)
        res2 = self.client.get(url)
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertIn("deletion_stats", res2.data)

    def test_admin_trigger_purge_endpoint(self):
        url = reverse("privacy-ops-trigger-purge")
        self.client.force_authenticate(user=self.admin)
        res = self.client.post(url, {"dry_run": False}, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["status"], "completed")
        self.assertTrue(DataPurgeLog.objects.exists())
        
    def test_management_command_purge_expired_data(self):
        out = StringIO()
        call_command("purge_expired_data", "--dry-run", stdout=out)
        self.assertIn("Purge completed", out.getvalue())

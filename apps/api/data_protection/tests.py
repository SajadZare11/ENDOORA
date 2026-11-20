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

    def test_data_export_populates_real_user_records_across_domains(self):
        from accounts.models import ConsentRecord
        from marketplace.models import UserWallet, PaymentTransaction, SessionBooking
        from online_exams.models import OnlineExam, ExamSubmission

        # 1. Consent record
        ConsentRecord.objects.create(
            user=self.user,
            consent_type=ConsentRecord.ConsentType.TERMS,
            version="1.0",
        )

        # 2. Financial wallet and transaction
        wallet = UserWallet.objects.create(user=self.user, balance_toman=500000)
        PaymentTransaction.objects.create(
            user=self.user,
            order_type="wallet_topup",
            amount_toman=500000,
            amount_rial=5000000,
            gateway_provider="zarinpal",
            status="completed",
            ref_id="ref_export_test_123",
        )
        start_time = timezone.now() + timedelta(days=2)
        SessionBooking.objects.create(
            learner=self.user,
            teacher=self.admin,
            scheduled_start=start_time,
            scheduled_end=start_time + timedelta(minutes=60),
            duration_minutes=60,
            rate_toman=250000,
            target_skill="speaking",
            status="confirmed",
        )

        # 3. Exam submission
        exam = OnlineExam.objects.create(
            teacher=self.admin,
            title="Export Diagnostic Exam",
            status=OnlineExam.ExamStatus.PUBLISHED,
            duration_minutes=60,
        )
        ExamSubmission.objects.create(
            exam=exam,
            student=self.user,
            status="graded",
            total_score=88,
            percentage=88.0,
        )

        # Other user's records to ensure isolation
        ConsentRecord.objects.create(
            user=self.other_user,
            consent_type=ConsentRecord.ConsentType.MARKETING,
            version="1.0",
        )
        PaymentTransaction.objects.create(
            user=self.other_user,
            order_type="wallet_topup",
            amount_toman=999999,
            amount_rial=9999990,
            ref_id="other_ref_secret",
        )

        # Compile export
        export = compile_full_user_data_export(self.user)
        self.assertEqual(export["user_id"], str(self.user.id))
        self.assertIn("integrity_checksum_sha256", export)

        # Verify populated consent
        consents = export["data"]["consent_records"]
        self.assertEqual(len(consents), 1)
        self.assertEqual(consents[0]["consent_type"], "terms")

        # Verify populated financial
        fin = export["data"]["financial"]
        self.assertIsNotNone(fin["wallet"])
        self.assertEqual(fin["wallet"]["balance_toman"], 500000.0)
        self.assertEqual(len(fin["transactions"]), 1)
        self.assertEqual(fin["transactions"][0]["ref_id"], "ref_export_test_123")
        self.assertEqual(fin["transactions"][0]["amount_toman"], 500000.0)
        self.assertEqual(len(fin["bookings"]), 1)
        self.assertEqual(fin["bookings"][0]["target_skill"], "speaking")
        self.assertEqual(fin["bookings"][0]["rate_toman"], 250000.0)

        # Verify populated exams
        exams = export["data"]["learning"]["online_exam_submissions"]
        self.assertEqual(len(exams), 1)
        self.assertEqual(exams[0]["exam_title"], "Export Diagnostic Exam")
        self.assertEqual(exams[0]["total_score"], 88.0)

        # Verify isolation: other user's records NOT in export
        raw_export_str = json.dumps(export)
        self.assertNotIn("other_ref_secret", raw_export_str)
        self.assertNotIn(str(self.other_user.id), raw_export_str)

    def test_download_expired_export_link_fails_with_410(self):
        req = DataExportRequest.objects.create(
            user=self.user,
            status=DataExportRequest.Status.COMPLETED,
            completed_at=timezone.now() - timedelta(hours=50),
        )
        self.client.force_authenticate(user=self.user)
        url = reverse("privacy-export-download", kwargs={"export_id": str(req.id)})
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_410_GONE)
        self.assertEqual(res.data["code"], "EXPORT_EXPIRED")


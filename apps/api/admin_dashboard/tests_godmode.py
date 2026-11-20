from __future__ import annotations

import json
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from audit.models import AuditEvent
from marketplace.models import UserSubscription, SubscriptionStatus
from .models import AdminSecurityConfig, SiteCmsSnapshot, SiteCmsDraft, SiteMediaAsset

User = get_user_model()


class AdminGodModeTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            email="superadmin@endoora.ir",
            password="adminpassword123",
            role=User.Role.ADMINISTRATOR,
            is_staff=True,
            is_superuser=True,
        )
        self.learner = User.objects.create_user(
            email="learner@endoora.ir",
            password="learnerpassword123",
            role=User.Role.LEARNER,
        )
        self.security_config = AdminSecurityConfig.get_instance()
        # Default pin is 123456
        self.client.force_authenticate(user=self.admin)

    def test_pin_verification_and_change(self):
        # 1. Correct PIN
        res = self.client.post("/api/admin-ops/security/pin/verify/", {"pin": "123456"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data["success"])

        # 2. Incorrect PIN
        res_fail = self.client.post("/api/admin-ops/security/pin/verify/", {"pin": "000000"}, format="json")
        self.assertEqual(res_fail.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(res_fail.data["success"])

        # 3. Change PIN
        res_change = self.client.post(
            "/api/admin-ops/security/pin/change/",
            {"current_pin": "123456", "new_pin": "654321"},
            format="json",
        )
        self.assertEqual(res_change.status_code, status.HTTP_200_OK)
        self.assertTrue(res_change.data["success"])

        # Verify with new PIN
        res_new = self.client.post("/api/admin-ops/security/pin/verify/", {"pin": "654321"}, format="json")
        self.assertEqual(res_new.status_code, status.HTTP_200_OK)

    def test_authoritative_cms_lifecycle(self):
        # 1. Get initial CMS
        res = self.client.get("/api/admin-ops/cms/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data["success"])
        self.assertEqual(res.data["liveVersion"], 1)

        # 2. Save draft
        draft_payload = dict(res.data["live"])
        draft_payload["hero"]["titleFa"] = "تستی برای ذخیره پیش‌نویس"
        res_draft = self.client.post(
            "/api/admin-ops/cms/",
            {"action": "save_draft", "data": draft_payload},
            format="json",
        )
        self.assertEqual(res_draft.status_code, status.HTTP_200_OK)
        self.assertEqual(res_draft.data["draft"]["hero"]["titleFa"], "تستی برای ذخیره پیش‌نویس")

        # 3. Publish draft
        res_pub = self.client.post(
            "/api/admin-ops/cms/",
            {"action": "publish", "summary": "انتشار تست تیتر جدید"},
            format="json",
        )
        self.assertEqual(res_pub.status_code, status.HTTP_200_OK)
        self.assertEqual(res_pub.data["published"]["version"], 2)

        # 4. Check public endpoint
        self.client.force_authenticate(user=None)
        res_public = self.client.get("/api/admin-ops/cms/public/")
        self.assertEqual(res_public.status_code, status.HTTP_200_OK)
        self.assertEqual(res_public.data["content"]["hero"]["titleFa"], "تستی برای ذخیره پیش‌نویس")

        # 5. Rollback to version 1
        self.client.force_authenticate(user=self.admin)
        res_rollback = self.client.post(
            "/api/admin-ops/cms/",
            {"action": "rollback", "version": 1},
            format="json",
        )
        self.assertEqual(res_rollback.status_code, status.HTTP_200_OK)
        self.assertEqual(res_rollback.data["version"], 1)

    def test_media_asset_manager(self):
        # 1. Upload media asset
        test_file = SimpleUploadedFile("banner.png", b"fake-png-content", content_type="image/png")
        res_upload = self.client.post(
            "/api/admin-ops/media/",
            {"title": "بنر کمپین آزمایشی", "file": test_file},
            format="multipart",
        )
        self.assertEqual(res_upload.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res_upload.data["success"])
        asset_id = res_upload.data["asset"]["id"]

        # 2. List media assets
        res_list = self.client.get("/api/admin-ops/media/")
        self.assertEqual(res_list.status_code, status.HTTP_200_OK)
        self.assertTrue(any(a["id"] == asset_id for a in res_list.data["assets"]))

        # 3. Delete media asset
        res_del = self.client.delete(f"/api/admin-ops/media/{asset_id}/")
        self.assertEqual(res_del.status_code, status.HTTP_200_OK)
        self.assertFalse(SiteMediaAsset.objects.filter(id=asset_id).exists())

    def test_user_impersonation_and_subscription_grant(self):
        # 1. Impersonate user without PIN -> 403 Forbidden
        res_no_pin = self.client.post(
            f"/api/admin-ops/users/{self.learner.id}/impersonate/",
            {},
            format="json",
        )
        self.assertEqual(res_no_pin.status_code, status.HTTP_403_FORBIDDEN)

        # 2. Impersonate user with valid PIN -> 200 OK
        res_imp = self.client.post(
            f"/api/admin-ops/users/{self.learner.id}/impersonate/",
            {"pin": "123456"},
            format="json",
        )
        self.assertEqual(res_imp.status_code, status.HTTP_200_OK)
        self.assertTrue(res_imp.data["success"])
        self.assertEqual(self.client.session.get("_original_admin_id"), str(self.admin.id))

        # 3. Exit impersonation -> 200 OK
        res_exit = self.client.post("/api/admin-ops/users/impersonate/exit/")
        self.assertEqual(res_exit.status_code, status.HTTP_200_OK)
        self.assertNotIn("_original_admin_id", self.client.session)

        # 4. Grant Subscription
        res_sub = self.client.post(
            f"/api/admin-ops/users/{self.learner.id}/grant-subscription/",
            {"tier": "pro_vip", "months": 6, "reason": "جایزه رتبه اول مسابقه گرامر"},
            format="json",
        )
        self.assertEqual(res_sub.status_code, status.HTTP_200_OK)
        self.assertTrue(UserSubscription.objects.filter(user=self.learner, tier="pro_vip").exists())

    def test_server_ops_sql_and_tables(self):
        # 1. List tables
        res_tables = self.client.get("/api/admin-ops/server-ops/tables/")
        self.assertEqual(res_tables.status_code, status.HTTP_200_OK)
        self.assertTrue(any(t["id"] == "users" for t in res_tables.data["tables"]))

        # 2. Query users table rows
        res_rows = self.client.get("/api/admin-ops/server-ops/tables/users/rows/")
        self.assertEqual(res_rows.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res_rows.data["rows"]), 2)

        # 3. Execute dry-run SQL
        res_sql = self.client.post(
            "/api/admin-ops/server-ops/sql/",
            {"query": "SELECT email, role FROM accounts_user LIMIT 5;", "is_dry_run": True},
            format="json",
        )
        self.assertEqual(res_sql.status_code, status.HTTP_200_OK)
        self.assertTrue(res_sql.data["success"])
        self.assertIn("email", res_sql.data["columns"])

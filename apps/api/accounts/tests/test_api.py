from django.core.cache import cache
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import ConsentRecord, OneTimeCode, User
from accounts.services import issue_otp


class AccountApiTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(
            email="learner@example.com",
            password="StrongPass-123!",
            phone="09123456789",
        )

    def tearDown(self):
        cache.clear()

    def test_login_and_me(self):
        response = self.client.post(
            "/api/auth/login/",
            {"email": self.user.email, "password": "StrongPass-123!"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["role"], User.Role.LEARNER)

        response = self.client.get("/api/auth/me/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.user.email)

    def test_user_cannot_self_promote_role(self):
        self.client.force_authenticate(self.user)
        response = self.client.patch(
            "/api/auth/me/",
            {"preferred_locale": "en", "role": "administrator"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.role, User.Role.LEARNER)
        self.assertEqual(self.user.preferred_locale, User.Locale.ENGLISH)

    def test_consent_version_is_recorded(self):
        self.client.force_authenticate(self.user)
        response = self.client.post(
            "/api/auth/consents/",
            {
                "consent_type": "privacy",
                "version": "2026-08-18",
                "locale": "fa",
                "accepted": True,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            ConsentRecord.objects.filter(
                user=self.user,
                consent_type="privacy",
                version="2026-08-18",
            ).exists()
        )

    def test_deactivated_user_cannot_login(self):
        self.user.is_active = False
        self.user.save(update_fields=["is_active"])
        response = self.client.post(
            "/api/auth/login/",
            {"email": self.user.email, "password": "StrongPass-123!"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_rate_limit_activates(self):
        for _ in range(10):
            response = self.client.post(
                "/api/auth/login/",
                {"email": "nobody@example.com", "password": "wrong"},
                format="json",
            )
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.client.post(
            "/api/auth/login/",
            {"email": "nobody@example.com", "password": "wrong"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)

    @override_settings(DEBUG=True, ENDOORA_OTP_PROVIDER="mock")
    def test_mock_otp_is_hashed_and_debug_code_only_returns_locally(self):
        record, debug_code = issue_otp(
            self.user.phone,
            OneTimeCode.Purpose.PHONE_VERIFY,
            requested_by=self.user,
        )
        self.assertIsNotNone(debug_code)
        self.assertNotEqual(record.code_hash, debug_code)
        self.assertNotIn(debug_code, record.code_hash)

    def test_deletion_request_foundation(self):
        self.client.force_authenticate(self.user)
        response = self.client.post(
            "/api/auth/deletion-request/",
            {"confirm": "DELETE", "reason_code": "user_requested"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "pending")

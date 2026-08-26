from django.core.cache import cache
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

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

    def test_cookie_login_requires_csrf_and_logout_is_csrf_protected(self):
        csrf_client = APIClient(enforce_csrf_checks=True)

        response = csrf_client.post(
            "/api/auth/login/",
            {"email": self.user.email, "password": "StrongPass-123!"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        csrf_response = csrf_client.get("/api/auth/csrf/")
        token = csrf_response.data["csrf_token"]
        response = csrf_client.post(
            "/api/auth/login/",
            {"email": self.user.email, "password": "StrongPass-123!"},
            format="json",
            HTTP_X_CSRFTOKEN=token,
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = csrf_client.post(
            "/api/auth/logout/",
            {},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        token = csrf_client.get("/api/auth/csrf/").data["csrf_token"]
        response = csrf_client.post(
            "/api/auth/logout/",
            {},
            format="json",
            HTTP_X_CSRFTOKEN=token,
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

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

        response = self.client.post(
            "/api/auth/consents/",
            {
                "consent_type": "terms",
                "version": "2026-08-18",
                "locale": "fa",
                "accepted": False,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

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

        response = self.client.post(
            "/api/auth/deletion-request/cancel/",
            {"confirm": "DELETE"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.client.post(
            "/api/auth/deletion-request/cancel/",
            {"confirm": "KEEP"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "cancelled")

    @override_settings(DEBUG=True, ENDOORA_OTP_PROVIDER="mock")
    def test_unknown_password_reset_request_is_generic_and_creates_no_code(self):
        response = self.client.post(
            "/api/auth/otp/request/",
            {
                "identifier": "unknown@example.com",
                "purpose": OneTimeCode.Purpose.PASSWORD_RESET,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "sent")
        self.assertNotIn("debug_code", response.data)
        self.assertFalse(
            OneTimeCode.objects.filter(
                identifier="unknown@example.com",
                purpose=OneTimeCode.Purpose.PASSWORD_RESET,
            ).exists()
        )

    @override_settings(DEBUG=True, ENDOORA_OTP_PROVIDER="mock")
    def test_email_verification_is_bound_to_authenticated_account(self):
        other = User.objects.create_user(
            email="other@example.com",
            password="StrongPass-456!",
        )
        _record, code = issue_otp(
            self.user.email,
            OneTimeCode.Purpose.EMAIL_VERIFY,
            requested_by=self.user,
        )

        self.client.force_authenticate(other)
        response = self.client.post(
            "/api/auth/otp/verify/",
            {
                "identifier": self.user.email,
                "purpose": OneTimeCode.Purpose.EMAIL_VERIFY,
                "code": code,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.client.force_authenticate(self.user)
        response = self.client.post(
            "/api/auth/otp/verify/",
            {
                "identifier": self.user.email,
                "purpose": OneTimeCode.Purpose.EMAIL_VERIFY,
                "code": code,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertTrue(self.user.email_verified)

    def test_otp_request_rate_limit_activates(self):
        for _ in range(5):
            response = self.client.post(
                "/api/auth/otp/request/",
                {
                    "identifier": self.user.email,
                    "purpose": OneTimeCode.Purpose.PASSWORD_RESET,
                },
                format="json",
            )
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.post(
            "/api/auth/otp/request/",
            {
                "identifier": self.user.email,
                "purpose": OneTimeCode.Purpose.PASSWORD_RESET,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)

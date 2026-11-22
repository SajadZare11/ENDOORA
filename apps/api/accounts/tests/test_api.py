from datetime import timedelta
import concurrent.futures
from unittest import skipUnless
from unittest.mock import MagicMock, patch
from django.core import mail
from django.core.cache import cache
from django.core.exceptions import ImproperlyConfigured, ValidationError
from django.db import connection
from django.test import TransactionTestCase, override_settings
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from accounts.models import ConsentRecord, OneTimeCode, User
from accounts.providers import (
    EmailOtpProvider,
    KavenegarOtpProvider,
    LocalMockOtpProvider,
    OtpDeliveryError,
    get_otp_provider,
)
from accounts.services import issue_otp, verify_otp


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
        self.assertIn("is_staff", response.data)
        self.assertIn("is_superuser", response.data)
        self.assertEqual(response.data["is_staff"], False)
        self.assertEqual(response.data["is_superuser"], False)

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


class DebugLoginRemovalSecurityTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(
            email="victim@example.com",
            password="OriginalPassword-123!",
            role=User.Role.LEARNER,
        )
        self.original_hash = self.user.password

    def tearDown(self):
        cache.clear()

    @override_settings(DEBUG=True)
    def test_incorrect_password_fails_under_debug_true(self):
        response = self.client.post(
            "/api/auth/login/",
            {"email": self.user.email, "password": "WrongPassword-456!"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.user.refresh_from_db()
        self.assertEqual(self.user.password, self.original_hash)
        self.assertTrue(self.user.check_password("OriginalPassword-123!"))
        self.assertFalse(self.user.check_password("WrongPassword-456!"))

    @override_settings(DEBUG=False)
    def test_incorrect_password_fails_under_debug_false(self):
        response = self.client.post(
            "/api/auth/login/",
            {"email": self.user.email, "password": "WrongPassword-456!"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.user.refresh_from_db()
        self.assertEqual(self.user.password, self.original_hash)
        self.assertTrue(self.user.check_password("OriginalPassword-123!"))

    @override_settings(DEBUG=True)
    def test_unknown_user_is_not_auto_created_under_debug_true(self):
        response = self.client.post(
            "/api/auth/login/",
            {"email": "doesnotexist@example.com", "password": "SomePassword-123!"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(User.objects.filter(email="doesnotexist@example.com").exists())

    @override_settings(DEBUG=True)
    def test_valid_login_still_works_and_rotates_session(self):
        session_before = self.client.session.session_key
        response = self.client.post(
            "/api/auth/login/",
            {"email": self.user.email, "password": "OriginalPassword-123!"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        session_after = self.client.session.session_key
        self.assertIsNotNone(session_after)
        self.assertNotEqual(session_before, session_after)


@override_settings(DEBUG=True, ENDOORA_OTP_PROVIDER="mock")
class OtpAttemptPersistenceSecurityTests(TransactionTestCase):
    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(
            email="otp_victim@example.com",
            password="OriginalPassword-123!",
            phone="09121112233",
            role=User.Role.LEARNER,
        )

    def tearDown(self):
        cache.clear()

    def test_wrong_codes_increment_persisted_counter(self):
        record, code = issue_otp(
            self.user.email,
            OneTimeCode.Purpose.EMAIL_VERIFY,
            requested_by=self.user,
        )
        self.assertEqual(record.attempts, 0)

        with self.assertRaises(ValidationError):
            verify_otp(
                self.user.email,
                OneTimeCode.Purpose.EMAIL_VERIFY,
                "000000",
                expected_user=self.user,
            )

        record.refresh_from_db()
        self.assertEqual(record.attempts, 1)

        with self.assertRaises(ValidationError):
            verify_otp(
                self.user.email,
                OneTimeCode.Purpose.EMAIL_VERIFY,
                "111111",
                expected_user=self.user,
            )

        record.refresh_from_db()
        self.assertEqual(record.attempts, 2)

    def test_verification_fails_after_configured_attempt_limit(self):
        record, code = issue_otp(
            self.user.email,
            OneTimeCode.Purpose.EMAIL_VERIFY,
            requested_by=self.user,
        )
        record.max_attempts = 3
        record.save(update_fields=["max_attempts"])

        for _ in range(3):
            with self.assertRaises(ValidationError):
                verify_otp(
                    self.user.email,
                    OneTimeCode.Purpose.EMAIL_VERIFY,
                    "999999",
                    expected_user=self.user,
                )

        record.refresh_from_db()
        self.assertEqual(record.attempts, 3)

        # Further attempt fails
        with self.assertRaises(ValidationError):
            verify_otp(
                self.user.email,
                OneTimeCode.Purpose.EMAIL_VERIFY,
                "999999",
                expected_user=self.user,
            )

    def test_correct_code_cannot_bypass_exhausted_counter(self):
        record, code = issue_otp(
            self.user.email,
            OneTimeCode.Purpose.EMAIL_VERIFY,
            requested_by=self.user,
        )
        record.max_attempts = 2
        record.save(update_fields=["max_attempts"])

        # Exhaust attempts
        for _ in range(2):
            with self.assertRaises(ValidationError):
                verify_otp(
                    self.user.email,
                    OneTimeCode.Purpose.EMAIL_VERIFY,
                    "000000",
                    expected_user=self.user,
                )

        record.refresh_from_db()
        self.assertEqual(record.attempts, 2)
        self.assertIsNone(record.consumed_at)

        # Now attempt with the actual correct code
        with self.assertRaises(ValidationError):
            verify_otp(
                self.user.email,
                OneTimeCode.Purpose.EMAIL_VERIFY,
                code,
                expected_user=self.user,
            )

        record.refresh_from_db()
        self.assertIsNone(record.consumed_at)
        self.user.refresh_from_db()
        self.assertFalse(self.user.email_verified)

    def test_expired_and_consumed_codes_fail(self):
        # Expired code
        record, code = issue_otp(
            self.user.email,
            OneTimeCode.Purpose.EMAIL_VERIFY,
            requested_by=self.user,
        )
        record.expires_at = timezone.now() - timedelta(seconds=10)
        record.save(update_fields=["expires_at"])

        with self.assertRaises(ValidationError):
            verify_otp(
                self.user.email,
                OneTimeCode.Purpose.EMAIL_VERIFY,
                code,
                expected_user=self.user,
            )

        # Consumed code
        fresh_record, fresh_code = issue_otp(
            self.user.email,
            OneTimeCode.Purpose.EMAIL_VERIFY,
            requested_by=self.user,
        )
        verified = verify_otp(
            self.user.email,
            OneTimeCode.Purpose.EMAIL_VERIFY,
            fresh_code,
            expected_user=self.user,
        )
        self.assertIsNotNone(verified.consumed_at)

        # Attempt replay on consumed code fails
        with self.assertRaises(ValidationError):
            verify_otp(
                self.user.email,
                OneTimeCode.Purpose.EMAIL_VERIFY,
                fresh_code,
                expected_user=self.user,
            )

    def test_attempts_against_another_users_code_do_not_grant_access(self):
        other_user = User.objects.create_user(
            email="attacker@example.com",
            password="StrongPass-999!",
            phone="09129998877",
            role=User.Role.LEARNER,
        )
        record, code = issue_otp(
            self.user.email,
            OneTimeCode.Purpose.EMAIL_VERIFY,
            requested_by=self.user,
        )

        with self.assertRaises(ValidationError):
            verify_otp(
                self.user.email,
                OneTimeCode.Purpose.EMAIL_VERIFY,
                code,
                expected_user=other_user,
            )

        other_user.refresh_from_db()
        self.assertFalse(other_user.email_verified)
        self.user.refresh_from_db()
        self.assertFalse(self.user.email_verified)

    @skipUnless(connection.vendor == "postgresql", "Checks PostgreSQL row locks.")
    def test_concurrent_verification_cannot_consume_code_twice(self):
        record, code = issue_otp(
            self.user.email,
            OneTimeCode.Purpose.EMAIL_VERIFY,
            requested_by=self.user,
        )

        successes = []
        failures = []

        def attempt_verify():
            if connection.vendor != "sqlite":
                connection.close()
            try:
                verify_otp(
                    self.user.email,
                    OneTimeCode.Purpose.EMAIL_VERIFY,
                    code,
                    expected_user=self.user,
                )
                successes.append(True)
            except (ValidationError, Exception) as exc:
                failures.append(exc)
            finally:
                if connection.vendor != "sqlite":
                    connection.close()

        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
            f1 = executor.submit(attempt_verify)
            f2 = executor.submit(attempt_verify)
            f1.result()
            f2.result()

        # Exactly one verification can succeed
        self.assertEqual(len(successes), 1)
        self.assertEqual(len(failures), 1)
        record.refresh_from_db()
        self.assertIsNotNone(record.consumed_at)

        # Subsequent attempts definitely fail with ValidationError
        with self.assertRaises(ValidationError):
            verify_otp(
                self.user.email,
                OneTimeCode.Purpose.EMAIL_VERIFY,
                code,
                expected_user=self.user,
            )


class OtpDeliveryProviderSecurityTests(APITestCase):
    def setUp(self):
        cache.clear()
        mail.outbox.clear()
        self.user = User.objects.create_user(
            email="delivery_user@example.com",
            password="StrongPass-123!",
            phone="09123456780",
            role=User.Role.LEARNER,
        )

    def tearDown(self):
        cache.clear()
        mail.outbox.clear()

    def test_kavenegar_provider_initialization_requires_api_key(self):
        with override_settings(ENDOORA_KAVENEGAR_API_KEY="", ENDOORA_SMS_API_KEY=""):
            with self.assertRaises(ImproperlyConfigured):
                KavenegarOtpProvider()

        provider = KavenegarOtpProvider(api_key="valid-dummy-api-key")
        self.assertEqual(provider.name, "kavenegar")

    def test_mock_provider_prohibited_in_production(self):
        with override_settings(
            ENDOORA_OTP_PROVIDER="mock",
            DEBUG=False,
            TESTING=False,
            ENDOORA_ENV="production",
        ):
            with self.assertRaises(ImproperlyConfigured):
                get_otp_provider()

    def test_failed_delivery_rolls_back_newly_issued_code(self):
        initial_codes = OneTimeCode.objects.filter(identifier=self.user.email).count()

        with patch.object(EmailOtpProvider, "send", side_effect=OtpDeliveryError("Simulated provider failure")):
            with override_settings(ENDOORA_OTP_PROVIDER="email"):
                with self.assertRaises(OtpDeliveryError):
                    issue_otp(
                        self.user.email,
                        OneTimeCode.Purpose.EMAIL_VERIFY,
                        requested_by=self.user,
                    )

        # No new code should be saved in the database
        after_codes = OneTimeCode.objects.filter(identifier=self.user.email).count()
        self.assertEqual(initial_codes, after_codes)

    def test_email_identifier_delivers_via_email_mechanism(self):
        import re
        with override_settings(
            ENDOORA_OTP_PROVIDER="email",
            EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
        ):
            record, debug_code = issue_otp(
                self.user.email,
                OneTimeCode.Purpose.EMAIL_VERIFY,
                requested_by=self.user,
            )
            self.assertEqual(len(mail.outbox), 1)
            sent_email = mail.outbox[0]
            self.assertIn(self.user.email, sent_email.to)
            self.assertIn("کد تأیید", sent_email.subject)
            # Verify code delivered in email body
            match = re.search(r"\b\d{6}\b", sent_email.body)
            self.assertIsNotNone(match)
            self.assertTrue(record.verify(match.group(0)))

    def test_phone_identifier_calls_kavenegar_sms_api(self):
        mock_response = MagicMock()
        mock_response.read.return_value = (
            b'{"return": {"status": 200, "message": "OK"}, "entries": [{"messageid": 12345}]}'
        )
        mock_response.__enter__.return_value = mock_response

        with patch("urllib.request.urlopen", return_value=mock_response) as mock_urlopen:
            with override_settings(
                ENDOORA_OTP_PROVIDER="kavenegar",
                ENDOORA_KAVENEGAR_API_KEY="test-kav-key-12345",
            ):
                record, _ = issue_otp(
                    self.user.phone,
                    OneTimeCode.Purpose.PHONE_VERIFY,
                    requested_by=self.user,
                )
                self.assertTrue(mock_urlopen.called)
                req = mock_urlopen.call_args[0][0]
                self.assertIn("api.kavenegar.com", req.full_url)
                self.assertIn("test-kav-key-12345", req.full_url)

    def test_kavenegar_provider_failure_raises_controlled_otp_delivery_error(self):
        import urllib.error
        with patch("urllib.request.urlopen", side_effect=urllib.error.URLError("Connection timed out")):
            provider = KavenegarOtpProvider(api_key="dummy-key")
            with self.assertRaises(OtpDeliveryError):
                provider.send("+989123456789", "123456", OneTimeCode.Purpose.PHONE_VERIFY)

    def test_production_otp_request_endpoint_omits_debug_code_and_handles_provider_errors(self):
        self.client.force_authenticate(self.user)

        # 1. When delivery fails, returns 502 without traceback
        with patch.object(LocalMockOtpProvider, "send", side_effect=OtpDeliveryError("Gateway unreachable")):
            response = self.client.post(
                "/api/auth/otp/request/",
                {"identifier": self.user.email, "purpose": OneTimeCode.Purpose.EMAIL_VERIFY},
                format="json",
            )
            self.assertEqual(response.status_code, status.HTTP_502_BAD_GATEWAY)
            self.assertEqual(response.data["code"], "otp_delivery_failed")

        # 2. In production (DEBUG=False), successful OTP response never contains debug_code
        with override_settings(DEBUG=False):
            response = self.client.post(
                "/api/auth/otp/request/",
                {"identifier": self.user.email, "purpose": OneTimeCode.Purpose.EMAIL_VERIFY},
                format="json",
            )
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertEqual(response.data["status"], "sent")
            self.assertNotIn("debug_code", response.data)




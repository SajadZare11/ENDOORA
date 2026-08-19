from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import ConsentRecord, OneTimeCode, User
from accounts.services import issue_otp


class Day08RegistrationTests(APITestCase):
    def csrf(self):
        response = self.client.get(
            "/api/auth/csrf/"
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )
        return response.data["csrf_token"]

    def test_learner_can_register(self):
        token = self.csrf()

        response = self.client.post(
            "/api/auth/register/",
            {
                "email": "newlearner@example.com",
                "password": "Strong-Day8-Pass-234!",
                "role": "learner",
                "preferred_locale": "fa",
                "accept_terms": True,
                "accept_privacy": True,
            },
            format="json",
            HTTP_X_CSRFTOKEN=token,
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        user = User.objects.get(
            email="newlearner@example.com"
        )

        self.assertEqual(
            user.role,
            User.Role.LEARNER,
        )

        self.assertTrue(
            user.check_password(
                "Strong-Day8-Pass-234!"
            )
        )

        self.assertEqual(
            user.consent_records.count(),
            2,
        )

    def test_registration_cannot_create_admin(self):
        token = self.csrf()

        response = self.client.post(
            "/api/auth/register/",
            {
                "email": "badrole@example.com",
                "password": "Strong-Day8-Pass-234!",
                "role": "administrator",
                "preferred_locale": "fa",
                "accept_terms": True,
                "accept_privacy": True,
            },
            format="json",
            HTTP_X_CSRFTOKEN=token,
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertFalse(
            User.objects.filter(
                email="badrole@example.com"
            ).exists()
        )

    def test_registration_requires_explicit_consents(self):
        token = self.csrf()

        response = self.client.post(
            "/api/auth/register/",
            {
                "email": "nonsense@example.com",
                "password": "Strong-Day8-Pass-234!",
                "role": "learner",
                "preferred_locale": "fa",
                "accept_terms": False,
                "accept_privacy": True,
            },
            format="json",
            HTTP_X_CSRFTOKEN=token,
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertFalse(
            User.objects.filter(
                email="nonsense@example.com"
            ).exists()
        )


@override_settings(
    DEBUG=True,
    ENDOORA_OTP_PROVIDER="mock",
)
class Day08PasswordResetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="reset@example.com",
            password="Old-Password-123!",
            role=User.Role.LEARNER,
        )

    def csrf(self):
        response = self.client.get(
            "/api/auth/csrf/"
        )
        return response.data["csrf_token"]

    def test_password_reset_changes_password(self):
        _record, code = issue_otp(
            self.user.email,
            OneTimeCode.Purpose.PASSWORD_RESET,
        )

        self.assertIsNotNone(code)

        token = self.csrf()

        response = self.client.post(
            "/api/auth/password-reset/confirm/",
            {
                "identifier": self.user.email,
                "code": code,
                "new_password": "New-Password-987!",
            },
            format="json",
            HTTP_X_CSRFTOKEN=token,
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.user.refresh_from_db()

        self.assertTrue(
            self.user.check_password(
                "New-Password-987!"
            )
        )

    def test_password_reset_rejects_bad_code(self):
        token = self.csrf()

        response = self.client.post(
            "/api/auth/password-reset/confirm/",
            {
                "identifier": self.user.email,
                "code": "000000",
                "new_password": "New-Password-987!",
            },
            format="json",
            HTTP_X_CSRFTOKEN=token,
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.user.refresh_from_db()

        self.assertTrue(
            self.user.check_password(
                "Old-Password-123!"
            )
        )

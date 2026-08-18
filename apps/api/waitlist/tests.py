from django.test import TestCase
from rest_framework.test import APIClient

from .models import WaitlistSignup
from .serializers import CONSENT_VERSION


class WaitlistApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/api/waitlist/"

    def test_signup_requires_explicit_consent(self):
        response = self.client.post(
            self.url,
            {"email": "learner@example.com", "consent": False, "locale": "fa", "source": "home"},
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(WaitlistSignup.objects.count(), 0)

    def test_signup_normalizes_email_and_records_consent_version(self):
        response = self.client.post(
            self.url,
            {"email": " Learner@Example.COM ", "consent": True, "locale": "fa", "source": "home", "landing_path": "/"},
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        signup = WaitlistSignup.objects.get()
        self.assertEqual(signup.email, "learner@example.com")
        self.assertEqual(signup.consent_version, CONSENT_VERSION)
        self.assertEqual(response.json(), {"status": "joined"})

    def test_duplicate_signup_is_idempotent(self):
        payload = {"email": "learner@example.com", "consent": True, "locale": "fa", "source": "home"}
        first = self.client.post(self.url, payload, format="json")
        second = self.client.post(self.url, payload, format="json")
        self.assertEqual(first.status_code, 201)
        self.assertEqual(second.status_code, 200)
        self.assertEqual(second.json(), {"status": "already_joined"})
        self.assertEqual(WaitlistSignup.objects.count(), 1)

    def test_invalid_locale_is_rejected(self):
        response = self.client.post(
            self.url,
            {"email": "learner@example.com", "consent": True, "locale": "tr", "source": "home"},
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(WaitlistSignup.objects.count(), 0)

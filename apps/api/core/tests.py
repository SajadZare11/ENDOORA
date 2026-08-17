from __future__ import annotations

import os
from unittest.mock import patch

from django.test import SimpleTestCase
from django.urls import reverse
from rest_framework.test import APIClient

from endoora_api.settings.base import validated_timezone


class HealthEndpointTests(SimpleTestCase):
    def setUp(self) -> None:
        self.client = APIClient()

    def test_liveness_is_public_and_ok(self) -> None:
        response = self.client.get(reverse("liveness"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["service"], "endoora-api")

    @patch("core.views._database_ok", return_value=True)
    @patch("core.views._redis_ok", return_value=True)
    def test_health_is_200_when_dependencies_are_ready(self, _redis, _database) -> None:
        response = self.client.get(reverse("health"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ok")

    @patch("core.views._database_ok", return_value=True)
    @patch("core.views._redis_ok", return_value=False)
    def test_health_is_503_when_dependency_is_down(self, _redis, _database) -> None:
        response = self.client.get(reverse("health"))
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json()["status"], "degraded")


class TimezoneValidationTests(SimpleTestCase):
    def test_default_timezone_is_asia_tehran(self) -> None:
        with patch.dict(os.environ, {}, clear=False):
            os.environ.pop("ENDOORA_TIMEZONE", None)
            self.assertEqual(validated_timezone(), "Asia/Tehran")

    def test_invalid_timezone_is_rejected(self) -> None:
        with patch.dict(os.environ, {"ENDOORA_TIMEZONE": "Not/A_Real_Zone"}):
            with self.assertRaises(RuntimeError):
                validated_timezone()

from __future__ import annotations

import os
from pathlib import Path
from unittest.mock import patch

from django.conf import settings
from django.test import RequestFactory, SimpleTestCase, override_settings
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


class DockerAndStoragePathsConfigurationTests(SimpleTestCase):
    """F10 verification: static and media paths are standardized and non-variable."""

    def test_static_and_media_urls_and_roots_configured(self) -> None:
        self.assertTrue(settings.STATIC_URL.startswith("/"))
        self.assertTrue(settings.MEDIA_URL.startswith("/"))
        self.assertIsNotNone(settings.STATIC_ROOT)
        self.assertIsNotNone(settings.MEDIA_ROOT)

        static_root_str = str(settings.STATIC_ROOT)
        media_root_str = str(settings.MEDIA_ROOT)

        # Disallow home-directory paths (~, /home) that can vary by environment
        self.assertFalse(static_root_str.startswith("~"))
        self.assertFalse("/home/" in static_root_str.replace("\\", "/"))
        self.assertFalse(media_root_str.startswith("~"))
        self.assertFalse("/home/" in media_root_str.replace("\\", "/"))


class TrustedHttpsProxyHandlingTests(SimpleTestCase):
    """F11 verification: trusted reverse proxy headers, HTTPS detection, and no redirect loops."""

    @override_settings(
        SECURE_PROXY_SSL_HEADER=("HTTP_X_FORWARDED_PROTO", "https"),
        USE_X_FORWARDED_HOST=True,
        USE_X_FORWARDED_PORT=True,
        SECURE_SSL_REDIRECT=True,
        ALLOWED_HOSTS=["endoora.ir", "www.endoora.ir", "testserver", "localhost", "127.0.0.1"],
    )
    def test_request_over_trusted_https_proxy_is_recognized_as_secure(self) -> None:
        factory = RequestFactory()
        req = factory.get(
            "/api/liveness/",
            HTTP_X_FORWARDED_PROTO="https",
            HTTP_X_FORWARDED_HOST="endoora.ir",
            HTTP_X_FORWARDED_PORT="443",
        )
        self.assertTrue(req.is_secure())
        self.assertEqual(req.get_host(), "endoora.ir")
        self.assertEqual(req.scheme, "https")

    @override_settings(
        SECURE_PROXY_SSL_HEADER=("HTTP_X_FORWARDED_PROTO", "https"),
        USE_X_FORWARDED_HOST=True,
        USE_X_FORWARDED_PORT=True,
        SECURE_SSL_REDIRECT=True,
        ALLOWED_HOSTS=["endoora.ir", "www.endoora.ir", "testserver", "localhost", "127.0.0.1"],
    )
    def test_https_request_does_not_trigger_ssl_redirect_loop(self) -> None:
        client = APIClient()
        # When request comes via nginx with HTTPS header, it must return 200 (not a 301 loop)
        res = client.get(
            reverse("liveness"),
            HTTP_X_FORWARDED_PROTO="https",
            HTTP_X_FORWARDED_HOST="endoora.ir",
            SERVER_NAME="endoora.ir",
        )
        self.assertEqual(res.status_code, 200)

    @override_settings(
        SECURE_PROXY_SSL_HEADER=("HTTP_X_FORWARDED_PROTO", "https"),
        USE_X_FORWARDED_HOST=True,
        USE_X_FORWARDED_PORT=True,
        SECURE_SSL_REDIRECT=True,
        ALLOWED_HOSTS=["endoora.ir", "www.endoora.ir", "testserver", "localhost", "127.0.0.1"],
    )
    def test_http_request_without_https_header_redirects_to_https(self) -> None:
        client = APIClient()
        res = client.get(
            reverse("liveness"),
            HTTP_X_FORWARDED_PROTO="http",
            HTTP_X_FORWARDED_HOST="endoora.ir",
            SERVER_NAME="endoora.ir",
        )
        # Plain HTTP must redirect to HTTPS
        self.assertEqual(res.status_code, 301)
        self.assertTrue(res["Location"].startswith("https://endoora.ir/"))

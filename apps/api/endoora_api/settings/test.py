import os

from .base import *  # noqa: F403

DEBUG = False
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]

if os.getenv("ENDOORA_TEST_DATABASE", "sqlite") == "sqlite":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": ":memory:",
        }
    }

REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_THROTTLE_CLASSES": [],
    "DEFAULT_THROTTLE_RATES": {
        "waitlist": "20/hour",
        "auth_login": "10/minute",
        "otp_request": "5/minute",
        "otp_verify": "10/minute",
        "role_based": "60/minute",
        "burst_protection": "10/second",
        "sensitive_endpoint": "5/minute",
    },
}

# Disable security middleware in tests to avoid interfering with existing test assertions
MIDDLEWARE = [
    m for m in MIDDLEWARE  # noqa: F405
    if m not in (
        "security.middleware.SecurityHeadersMiddleware",
        "security.middleware.InputSanitizationMiddleware",
    )
]

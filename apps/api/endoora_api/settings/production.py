from .base import *  # noqa: F403

DEBUG = False
ZARINPAL_SANDBOX = False
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "same-origin"
SECURE_CROSS_ORIGIN_OPENER_POLICY = "same-origin"
X_FRAME_OPTIONS = "DENY"
import os
from django.core.exceptions import ImproperlyConfigured

if os.getenv("ENDOORA_OTP_PROVIDER", "kavenegar").strip().lower() == "mock":
    raise ImproperlyConfigured("Mock OTP provider is forbidden in production.")

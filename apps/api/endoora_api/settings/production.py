from .base import *  # noqa: F403
import os
from django.core.exceptions import ImproperlyConfigured

DEBUG = False
ZARINPAL_SANDBOX = False

# Trusted reverse proxy / HTTPS configuration (F11)
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True
USE_X_FORWARDED_PORT = True

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

if os.getenv("ENDOORA_OTP_PROVIDER", "kavenegar").strip().lower() == "mock":
    raise ImproperlyConfigured("Mock OTP provider is forbidden in production.")

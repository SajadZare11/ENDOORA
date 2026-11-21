from .base import *  # noqa: F403

DEBUG = False
SECURE_SSL_REDIRECT = True
# Nginx overwrites this header and the API is internal to the Compose network.
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
ZARINPAL_SANDBOX = env_bool('ZARINPAL_SANDBOX', default=False)
ENDOORA_OTP_PROVIDER = os.getenv('ENDOORA_OTP_PROVIDER', 'kavenegar')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "same-origin"
SECURE_CROSS_ORIGIN_OPENER_POLICY = "same-origin"
X_FRAME_OPTIONS = "DENY"

from django.core.exceptions import ImproperlyConfigured

if SECRET_KEY == "unsafe-local-development-key":
    raise ImproperlyConfigured("Supply ENDOORA_DJANGO_SECRET_KEY in production.")
if ENDOORA_OTP_PROVIDER == "mock":
    raise ImproperlyConfigured("Select a real OTP provider in production.")

ENDOORA_SUBSCRIPTION_SALES_OPEN = env_bool("ENDOORA_SUBSCRIPTION_SALES_OPEN", default=False)

MIDDLEWARE = list(MIDDLEWARE)
MIDDLEWARE.insert(MIDDLEWARE.index("django.middleware.security.SecurityMiddleware") + 1, "whitenoise.middleware.WhiteNoiseMiddleware")

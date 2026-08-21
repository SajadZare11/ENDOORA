from __future__ import annotations

import os
from pathlib import Path
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from dotenv import load_dotenv

API_DIR = Path(__file__).resolve().parents[2]
REPO_ROOT = API_DIR.parents[1]

load_dotenv(REPO_ROOT / ".env")


def env_bool(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def env_list(name: str, default: str = "") -> list[str]:
    return [item.strip() for item in os.getenv(name, default).split(",") if item.strip()]


def validated_timezone() -> str:
    value = os.getenv("ENDOORA_TIMEZONE", "Asia/Tehran")
    try:
        ZoneInfo(value)
    except ZoneInfoNotFoundError as exc:
        raise RuntimeError(f"Invalid ENDOORA_TIMEZONE: {value}") from exc
    return value


SECRET_KEY = os.getenv("ENDOORA_DJANGO_SECRET_KEY", "unsafe-local-development-key")
DEBUG = env_bool("ENDOORA_DEBUG", default=False)

ALLOWED_HOSTS = env_list("ENDOORA_ALLOWED_HOSTS", "localhost,127.0.0.1")
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "missions",
    "srs",
    "ai_gateway",
    "mistake_genome",
    "rest_framework",
    "accounts",
    "placement",
    "learner_twin",
    "assessment",
    "permissions",
    "profiles",
    "dashboard",
    "teachers",
    "core",
    "audit.apps.AuditConfig",
    "taxonomy",
    "questions",
    "waitlist",
]
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "audit.middleware.AuditContextMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "endoora_api.urls"
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]
WSGI_APPLICATION = "endoora_api.wsgi.application"
ASGI_APPLICATION = "endoora_api.asgi.application"
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("ENDOORA_DB_NAME", "endoora"),
        "USER": os.getenv("ENDOORA_DB_USER", "endoora"),
        "PASSWORD": os.getenv("ENDOORA_DB_PASSWORD", "endoora_local_dev"),
        "HOST": os.getenv("ENDOORA_DB_HOST", "127.0.0.1"),
        "PORT": os.getenv("ENDOORA_DB_PORT", "5432"),
        "CONN_MAX_AGE": 60,
    }
}

AUTH_USER_MODEL = "accounts.User"
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True
ENDOORA_DISPLAY_TIMEZONE = validated_timezone()
STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

ENDOORA_ENV = os.getenv("ENDOORA_ENV", "development")
ENDOORA_REDIS_URL = os.getenv("ENDOORA_REDIS_URL", "redis://127.0.0.1:6379/0")
ENDOORA_OTP_PROVIDER = os.getenv("ENDOORA_OTP_PROVIDER", "mock")
ENDOORA_OTP_TTL_SECONDS = int(os.getenv("ENDOORA_OTP_TTL_SECONDS", "300"))
ENDOORA_ACCOUNT_DELETE_DELAY_DAYS = int(
    os.getenv("ENDOORA_ACCOUNT_DELETE_DELAY_DAYS", "7")
)
CORS_ALLOWED_ORIGINS = env_list(
    "ENDOORA_CORS_ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000",
)
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = env_list(
    "ENDOORA_CSRF_TRUSTED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000",
)
CSRF_COOKIE_NAME = "endoora_csrftoken"
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_NAME = "endoora_sessionid"
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_AGE = 60 * 60 * 24 * 14
REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "waitlist": "20/hour",
        "auth_login": "10/minute",
        "otp_request": "5/minute",
        "otp_verify": "10/minute",
    },
}

from .base import *  # noqa: F403

DEBUG = True
ZARINPAL_SANDBOX = env_bool("ZARINPAL_SANDBOX", default=True)

if os.getenv("ENDOORA_USE_POSTGRES", "false").lower() not in {"1", "true", "yes"}:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": API_DIR / "db.sqlite3",
        }
    }

ENDOORA_DEMO_OPERATIONS = True

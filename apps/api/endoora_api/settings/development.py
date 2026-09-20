from .base import *  # noqa: F403

DEBUG = True

if os.getenv("ENDOORA_USE_POSTGRES", "false").lower() not in {"1", "true", "yes"}:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": API_DIR / "db.sqlite3",
        }
    }

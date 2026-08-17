from __future__ import annotations

from django.conf import settings
from django.db import connection
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
import redis


def _database_ok() -> bool:
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            return cursor.fetchone() == (1,)
    except Exception:
        return False


def _redis_ok() -> bool:
    try:
        client = redis.Redis.from_url(
            settings.ENDOORA_REDIS_URL,
            socket_connect_timeout=1,
            socket_timeout=1,
            decode_responses=True,
        )
        return bool(client.ping())
    except Exception:
        return False


@api_view(["GET"])
@permission_classes([AllowAny])
def liveness(_request):
    return Response({"status": "ok", "service": "endoora-api"})


@api_view(["GET"])
@permission_classes([AllowAny])
def health(_request):
    database_ok = _database_ok()
    redis_ok = _redis_ok()
    ready = database_ok and redis_ok
    payload = {
        "status": "ok" if ready else "degraded",
        "service": "endoora-api",
        "environment": settings.ENDOORA_ENV,
        "timezone": settings.ENDOORA_DISPLAY_TIMEZONE,
        "checks": {
            "database": "ok" if database_ok else "error",
            "redis": "ok" if redis_ok else "error",
        },
    }
    return Response(payload, status=200 if ready else 503)

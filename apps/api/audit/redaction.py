from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from django.db import models


_SECRET_PARTS = {
    "password",
    "secret",
    "token",
    "code_hash",
    "otp",
    "credential",
    "api_key",
    "private_key",
    "merchant_id",
    "authorization",
    "cookie",
    "session_key",
}

_PRIVATE_CONTENT_PARTS = {
    "raw_writing",
    "writing_text",
    "audio",
    "transcript",
    "conversation",
    "private_message",
    "message_body",
    "answer_key",
}

_DIRECT_CONTACT_PARTS = {
    "email",
    "phone",
    "mobile",
    "address",
}

_PAYMENT_PARTS = {
    "card",
    "authority",
    "ref_id",
    "bank",
    "iban",
    "sheba",
}


def _field_category(name: str) -> str | None:
    lowered = name.lower()
    if any(part in lowered for part in _SECRET_PARTS):
        return "<redacted-secret>"
    if any(part in lowered for part in _PRIVATE_CONTENT_PARTS):
        return "<redacted-private-content>"
    if any(part in lowered for part in _DIRECT_CONTACT_PARTS):
        return "<redacted-personal>"
    if any(part in lowered for part in _PAYMENT_PARTS):
        return "<redacted-payment>"
    return None


def _json_safe(value):
    if value is None or isinstance(value, (bool, int, float, str)):
        return value
    if isinstance(value, (UUID, Decimal)):
        return str(value)
    if isinstance(value, (date, datetime)):
        return value.isoformat()
    if isinstance(value, (list, tuple, set)):
        return [_json_safe(item) for item in value]
    if isinstance(value, dict):
        return {str(key): _json_safe(item) for key, item in value.items()}
    return str(value)


def safe_model_snapshot(instance: models.Model | None) -> dict:
    if instance is None:
        return {}

    snapshot: dict[str, object] = {}
    for field in instance._meta.concrete_fields:
        field_name = field.name
        redacted = _field_category(field_name)
        if redacted is not None:
            snapshot[field_name] = redacted
            continue

        value = getattr(instance, field.attname, None)
        snapshot[field_name] = _json_safe(value)

    return snapshot

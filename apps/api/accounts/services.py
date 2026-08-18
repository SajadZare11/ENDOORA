from __future__ import annotations

import secrets
from datetime import timedelta

from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from .models import AccountDeletionRequest, OneTimeCode, User
from .phone import normalize_iranian_mobile
from .providers import get_otp_provider


def normalize_identifier(identifier: str) -> str:
    value = identifier.strip()
    if "@" in value:
        return value.lower()
    normalized = normalize_iranian_mobile(value)
    if normalized is None:
        raise ValidationError("A phone number or email address is required.")
    return normalized


@transaction.atomic
def issue_otp(
    identifier: str,
    purpose: str,
    *,
    requested_by: User | None = None,
) -> tuple[OneTimeCode, str | None]:
    normalized = normalize_identifier(identifier)

    if purpose == OneTimeCode.Purpose.PHONE_VERIFY:
        if requested_by is None or requested_by.phone != normalized:
            raise ValidationError(
                "The phone number must match the authenticated account."
            )

    now = timezone.now()
    OneTimeCode.objects.filter(
        identifier=normalized,
        purpose=purpose,
        consumed_at__isnull=True,
    ).update(consumed_at=now)

    raw_code = f"{secrets.randbelow(1_000_000):06d}"
    ttl_seconds = int(getattr(settings, "ENDOORA_OTP_TTL_SECONDS", 300))

    record = OneTimeCode.objects.create(
        identifier=normalized,
        purpose=purpose,
        code_hash=make_password(raw_code),
        requested_by=requested_by,
        expires_at=now + timedelta(seconds=ttl_seconds),
    )

    provider = get_otp_provider()
    provider.send(normalized, raw_code, purpose)

    debug_code = (
        raw_code
        if settings.DEBUG and getattr(settings, "ENDOORA_OTP_PROVIDER", "mock") == "mock"
        else None
    )
    return record, debug_code


@transaction.atomic
def verify_otp(identifier: str, purpose: str, raw_code: str) -> OneTimeCode:
    normalized = normalize_identifier(identifier)

    record = (
        OneTimeCode.objects.select_for_update()
        .filter(
            identifier=normalized,
            purpose=purpose,
            consumed_at__isnull=True,
        )
        .order_by("-created_at")
        .first()
    )
    if record is None or not record.verify(raw_code):
        raise ValidationError("The code is invalid, expired, consumed, or has too many attempts.")

    if purpose == OneTimeCode.Purpose.PHONE_VERIFY and record.requested_by_id:
        user = User.objects.select_for_update().get(pk=record.requested_by_id)
        if user.phone == normalized:
            user.phone_verified_at = timezone.now()
            user.save(update_fields=["phone_verified_at"])

    return record


@transaction.atomic
def deactivate_account(user: User) -> None:
    user.is_active = False
    user.deactivated_at = timezone.now()
    user.save(update_fields=["is_active", "deactivated_at"])


@transaction.atomic
def request_account_deletion(user: User, reason_code: str = "") -> AccountDeletionRequest:
    pending = user.deletion_requests.filter(
        status=AccountDeletionRequest.Status.PENDING
    ).first()
    if pending:
        return pending

    delay_days = int(getattr(settings, "ENDOORA_ACCOUNT_DELETE_DELAY_DAYS", 7))
    return AccountDeletionRequest.objects.create(
        user=user,
        reason_code=reason_code.strip()[:64],
        scheduled_for=timezone.now() + timedelta(days=delay_days),
    )

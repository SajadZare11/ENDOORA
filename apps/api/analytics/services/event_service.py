from __future__ import annotations

import hashlib
import logging
from typing import Any

from django.conf import settings
from django.utils import timezone

from analytics.models import ProductAnalyticsEvent

logger = logging.getLogger("endoora.analytics")

# Master whitelist of allowed event names and their canonical categories
BOUNDED_EVENT_CHOICES: dict[str, str] = {
    # Auth & Identity
    "auth_signup_attempt": ProductAnalyticsEvent.Category.AUTH,
    "auth_signup_success": ProductAnalyticsEvent.Category.AUTH,
    "auth_login_attempt": ProductAnalyticsEvent.Category.AUTH,
    "auth_login_success": ProductAnalyticsEvent.Category.AUTH,
    "auth_otp_request": ProductAnalyticsEvent.Category.AUTH,
    "auth_otp_verify": ProductAnalyticsEvent.Category.AUTH,
    "auth_logout": ProductAnalyticsEvent.Category.AUTH,

    # Onboarding
    "onboarding_started": ProductAnalyticsEvent.Category.ONBOARDING,
    "onboarding_role_selected": ProductAnalyticsEvent.Category.ONBOARDING,
    "onboarding_goals_set": ProductAnalyticsEvent.Category.ONBOARDING,
    "onboarding_completed": ProductAnalyticsEvent.Category.ONBOARDING,

    # Placement & Diagnostic
    "placement_started": ProductAnalyticsEvent.Category.PLACEMENT,
    "placement_section_completed": ProductAnalyticsEvent.Category.PLACEMENT,
    "placement_completed": ProductAnalyticsEvent.Category.PLACEMENT,
    "placement_result_viewed": ProductAnalyticsEvent.Category.PLACEMENT,

    # Daily Learning & Retention
    "mission_started": ProductAnalyticsEvent.Category.LEARNING,
    "mission_step_completed": ProductAnalyticsEvent.Category.LEARNING,
    "mission_completed": ProductAnalyticsEvent.Category.LEARNING,
    "srs_review_started": ProductAnalyticsEvent.Category.LEARNING,
    "srs_review_completed": ProductAnalyticsEvent.Category.LEARNING,
    "speaking_practice_completed": ProductAnalyticsEvent.Category.LEARNING,
    "writing_mentor_submitted": ProductAnalyticsEvent.Category.LEARNING,

    # Teacher & Marketplace
    "teacher_search_performed": ProductAnalyticsEvent.Category.TEACHER,
    "teacher_profile_viewed": ProductAnalyticsEvent.Category.TEACHER,
    "teacher_availability_checked": ProductAnalyticsEvent.Category.TEACHER,
    "teacher_booking_requested": ProductAnalyticsEvent.Category.TEACHER,
    "teacher_session_completed": ProductAnalyticsEvent.Category.TEACHER,

    # Commerce & Checkout
    "checkout_initiated": ProductAnalyticsEvent.Category.COMMERCE,
    "escrow_deposit_created": ProductAnalyticsEvent.Category.COMMERCE,
    "payment_succeeded": ProductAnalyticsEvent.Category.COMMERCE,
    "payment_failed": ProductAnalyticsEvent.Category.COMMERCE,

    # Route & View Navigation
    "route_view_landing": ProductAnalyticsEvent.Category.ROUTE,
    "route_view_dashboard": ProductAnalyticsEvent.Category.ROUTE,
    "route_view_placement": ProductAnalyticsEvent.Category.ROUTE,
    "route_view_courses": ProductAnalyticsEvent.Category.ROUTE,
    "route_view_practice": ProductAnalyticsEvent.Category.ROUTE,
    "route_view_ops_007": ProductAnalyticsEvent.Category.ROUTE,
    "route_view_account": ProductAnalyticsEvent.Category.ROUTE,
}

PROHIBITED_PROPERTY_KEYS: set[str] = {
    "password",
    "pass",
    "token",
    "secret",
    "key",
    "text",
    "essay",
    "transcript",
    "audio",
    "content",
    "email",
    "phone",
    "first_name",
    "last_name",
    "ssn",
    "national_id",
    "card_number",
    "cvv",
}


def hash_client_ip(ip: str | None) -> str:
    """Hashes the client IP using SHA-256 with a salt to ensure GDPR/SEC-002 privacy."""
    if not ip:
        return ""
    salt = getattr(settings, "SECRET_KEY", "endoora_analytics_salt")[:16]
    raw = f"{ip.strip()}:{salt}".encode("utf-8")
    return hashlib.sha256(raw).hexdigest()[:32]


def parse_user_agent_category(ua_string: str | None) -> str:
    """Classifies user agent into DeviceCategory choices."""
    if not ua_string:
        return ProductAnalyticsEvent.DeviceCategory.UNKNOWN
    ua = ua_string.lower()
    if any(b in ua for b in ("bot", "spider", "crawler", "archiver")):
        return ProductAnalyticsEvent.DeviceCategory.BOT
    if any(t in ua for t in ("ipad", "tablet", "kindle")):
        return ProductAnalyticsEvent.DeviceCategory.TABLET
    if any(m in ua for m in ("mobile", "iphone", "android", "phone")):
        return ProductAnalyticsEvent.DeviceCategory.MOBILE
    return ProductAnalyticsEvent.DeviceCategory.DESKTOP


def sanitize_event_properties(properties: dict[str, Any] | None) -> dict[str, Any]:
    """
    Sanitizes analytics event properties:
    - Rejects prohibited keys containing sensitive PII or raw learner content.
    - Limits string lengths to 255 characters.
    - Limits property count to 20 keys.
    """
    if not properties or not isinstance(properties, dict):
        return {}

    sanitized: dict[str, Any] = {}
    for key, value in properties.items():
        if len(sanitized) >= 20:
            break
        k = str(key).lower().strip()
        if k in PROHIBITED_PROPERTY_KEYS:
            continue
        if isinstance(value, (str, int, float, bool)):
            if isinstance(value, str):
                sanitized[k] = value[:255]
            else:
                sanitized[k] = value
        elif isinstance(value, (list, tuple)):
            sanitized[k] = [
                str(v)[:100] for v in value[:10] if isinstance(v, (str, int, float, bool))
            ]
    return sanitized


def ingest_event(
    event_name: str,
    user: Any = None,
    session_id: str = "",
    properties: dict[str, Any] | None = None,
    client_ip: str | None = None,
    user_agent: str | None = None,
    locale: str = "fa",
) -> ProductAnalyticsEvent:
    """
    Ingests and persists a product analytics event according to SEC-002 privacy rules.
    """
    if event_name not in BOUNDED_EVENT_CHOICES:
        raise ValueError(
            f"Event '{event_name}' is not in the bounded product analytics event taxonomy."
        )

    category = BOUNDED_EVENT_CHOICES[event_name]

    # Evaluate SEC-002 GDPR Privacy Consent Preferences
    effective_user = user
    if user and getattr(user, "is_authenticated", False):
        prefs = getattr(user, "privacy_preferences", None)
        if prefs and not getattr(prefs, "analytics_processing", True):
            # User opted out of analytics processing: detach user identity
            effective_user = None

    sanitized_props = sanitize_event_properties(properties)
    ip_hash = hash_client_ip(client_ip)
    device_cat = parse_user_agent_category(user_agent)

    event = ProductAnalyticsEvent.objects.create(
        event_name=event_name,
        category=category,
        user=effective_user if effective_user and getattr(effective_user, "is_authenticated", False) else None,
        session_id=str(session_id)[:64],
        properties=sanitized_props,
        client_ip_hash=ip_hash,
        user_agent_category=device_cat,
        locale=locale[:8] if locale else "fa",
        created_at=timezone.now(),
    )

    logger.info(
        "analytics.event_recorded name=%s category=%s user_id=%s session=%s",
        event_name,
        category,
        getattr(effective_user, "pk", None),
        session_id,
    )
    return event

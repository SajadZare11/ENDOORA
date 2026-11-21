"""Subscription periods for verified purchases. All writes serialize per account."""

from datetime import timedelta
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from .models import (
    PaymentTransaction,
    SubscriptionGrant,
    PaymentOrderType,
    PaymentTransactionStatus,
)


def lock_account(user_id):
    return get_user_model().objects.select_for_update().only("pk").get(pk=user_id)


def recalculate(user_id, sandbox):
    cursor = None
    grants = SubscriptionGrant.objects.filter(
        payment__user_id=user_id, payment__is_sandbox=sandbox
    ).order_by("paid_at", "payment_id")
    for grant in grants:
        start = max(cursor, grant.paid_at) if cursor else grant.paid_at
        end = start + timedelta(days=grant.days)
        if grant.revoked_at:
            end = max(start, min(end, grant.revoked_at))
        if (grant.starts_at, grant.ends_at) != (start, end):
            SubscriptionGrant.objects.filter(pk=grant.pk).update(
                starts_at=start, ends_at=end
            )
        cursor = end


@transaction.atomic
def grant_purchase(payment):
    if payment.order_type != PaymentOrderType.SUBSCRIPTION_PLAN:
        return
    if payment.status != PaymentTransactionStatus.PAID or not payment.verified_at:
        raise ValidationError("Subscription requires a verified payment.")
    lock_account(payment.user_id)
    if SubscriptionGrant.objects.filter(payment=payment).exists():
        return
    days = payment.subscription_days
    if not days:
        raise ValidationError("The purchased duration needs owner review.")
    SubscriptionGrant.objects.create(
        payment=payment,
        paid_at=payment.verified_at,
        days=days,
        starts_at=payment.verified_at,
        ends_at=payment.verified_at + timedelta(days=days),
    )
    recalculate(payment.user_id, payment.is_sandbox)


@transaction.atomic
def record_confirmed_refund(payment_id, reference):
    """Reconcile a full refund already completed by the provider or wallet."""
    reference = reference.strip()
    if not reference or len(reference) > 120:
        raise ValidationError(
            "Enter a confirmed refund reference of up to 120 characters."
        )
    payment = PaymentTransaction.objects.select_for_update().get(pk=payment_id)
    if payment.order_type != PaymentOrderType.SUBSCRIPTION_PLAN:
        raise ValidationError("Select a subscription payment.")
    lock_account(payment.user_id)
    grant = SubscriptionGrant.objects.filter(payment=payment).first()
    if not grant:
        raise ValidationError("Payment has no reconciled grant.")
    if grant.revoked_at:
        if grant.refund_reference == reference:
            return
        raise ValidationError("A different refund was already recorded.")
    if payment.status != PaymentTransactionStatus.PAID:
        raise ValidationError("Only a settled subscription can be refunded.")
    grant.revoked_at = timezone.now()
    grant.refund_reference = reference
    grant.save(update_fields=["revoked_at", "refund_reference"])
    payment.status = PaymentTransactionStatus.REFUNDED
    payment.save(update_fields=["status", "updated_at"])
    recalculate(payment.user_id, payment.is_sandbox)


@transaction.atomic
def reconcile_legacy(payment_id, verified_at, days, receipt):
    """Attach explicitly verified historical evidence to an incomplete paid record."""
    if (
        not timezone.is_aware(verified_at)
        or verified_at > timezone.now()
        or days < 1
        or days > 36500
    ):
        raise ValidationError(
            "Supply an actual verification time with timezone and a positive term."
        )
    payment = PaymentTransaction.objects.select_for_update().get(pk=payment_id)
    if (
        payment.status != "paid"
        or payment.order_type != "subscription_plan"
        or not receipt
        or payment.ref_id != receipt
        or (payment.verified_at and payment.verified_at != verified_at)
    ):
        raise ValidationError(
            "The verified receipt or timestamp does not match this paid subscription."
        )
    lock_account(payment.user_id)
    existing = SubscriptionGrant.objects.filter(payment=payment).first()
    if existing:
        if existing.days != days or existing.paid_at != verified_at:
            raise ValidationError(
                "This transaction already has a different reconciled grant."
            )
        return
    payment.subscription_days = days
    payment.verified_at = verified_at
    payment.save(update_fields=["subscription_days", "verified_at", "updated_at"])
    grant_purchase(payment)

from datetime import timedelta
from unittest.mock import patch
from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from marketplace.models import PaymentTransaction, SubscriptionGrant, UserWallet
from marketplace.services import (
    initiate_checkout,
    verify_checkout_payment,
    get_active_pricing_plans,
)
from marketplace.subscriptions import record_confirmed_refund


@override_settings(ZARINPAL_SANDBOX=False, ENDOORA_SUBSCRIPTION_SALES_OPEN=True)
class SubscriptionTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            "member@example.org", "demo-pass"
        )
        self.plan = next(iter(get_active_pricing_plans()))
        self.wallet = UserWallet.objects.create(
            user=self.user, balance_toman=self.plan.price_toman * 5
        )

    def buy(self, key):
        return initiate_checkout(
            self.user,
            "subscription_plan",
            str(self.plan.pk),
            self.plan.price_toman,
            "wallet",
            idempotency_key=key,
        )

    def test_wallet_expiry_renewal_and_retry(self):
        now = timezone.now()
        with patch("django.utils.timezone.now", return_value=now):
            first = self.buy("first")
            again = self.buy("first")
            self.assertEqual(first["transaction_id"], again["transaction_id"])
            self.assertTrue(self.user.is_premium)
            self.buy("second")
        self.wallet.refresh_from_db()
        self.assertEqual(self.wallet.balance_toman, self.plan.price_toman * 3)
        grants = list(SubscriptionGrant.objects.order_by("starts_at"))
        self.assertEqual(grants[0].ends_at, grants[1].starts_at)
        with patch("django.utils.timezone.now", return_value=grants[1].ends_at):
            self.assertFalse(self.user.is_premium)
        self.client.force_login(self.user)
        res = self.client.get(
            "/api/marketplace/checkout/wallet-receipt/" + first["transaction_id"] + "/"
        )
        self.assertEqual(
            res.json()["result"]["amount_toman"], int(self.plan.price_toman)
        )
        other = get_user_model().objects.create_user("other@example.org", "demo-pass")
        self.client.force_login(other)
        self.assertEqual(
            self.client.get(
                "/api/marketplace/checkout/wallet-receipt/"
                + first["transaction_id"]
                + "/"
            ).status_code,
            404,
        )

    def test_refund_moves_next_paid_term_forward_and_is_idempotent(self):
        start = timezone.now()
        with patch("django.utils.timezone.now", return_value=start):
            a = self.buy("a")
        with patch(
            "django.utils.timezone.now", return_value=start + timedelta(hours=1)
        ):
            self.buy("b")
        when = start + timedelta(days=2)
        with patch("django.utils.timezone.now", return_value=when):
            record_confirmed_refund(a["transaction_id"], "provider-receipt-one")
            record_confirmed_refund(a["transaction_id"], "provider-receipt-one")
            self.assertTrue(self.user.is_premium)
        later = SubscriptionGrant.objects.get(revoked_at=None)
        self.assertEqual(later.starts_at, when)
        self.assertEqual(later.ends_at, when + timedelta(days=self.plan.duration_days))
        with self.assertRaises(ValidationError):
            record_confirmed_refund(a["transaction_id"], "a-different-refund")

    @override_settings(ZARINPAL_SANDBOX=True)
    def test_gateway_snapshot_and_callback_replay(self):
        data = initiate_checkout(
            self.user,
            "subscription_plan",
            str(self.plan.pk),
            self.plan.price_toman,
            "zarinpal",
            idempotency_key="gateway",
        )
        self.assertEqual(
            initiate_checkout(
                self.user,
                "subscription_plan",
                str(self.plan.pk),
                self.plan.price_toman,
                "zarinpal",
                idempotency_key="gateway",
            )["authority"],
            data["authority"],
        )
        duration = self.plan.duration_days
        self.plan.duration_days = 1
        self.plan.save()
        verify_checkout_payment(data["authority"])
        verify_checkout_payment(data["authority"])
        grant = SubscriptionGrant.objects.get()
        self.assertEqual(grant.days, duration)
        with override_settings(ZARINPAL_SANDBOX=False):
            self.assertFalse(self.user.is_premium)
        record_confirmed_refund(grant.payment_id, "already-refunded")
        with self.assertRaises(ValidationError):
            verify_checkout_payment(data["authority"])
        self.assertFalse(self.user.is_premium)

    @override_settings(ENDOORA_SUBSCRIPTION_SALES_OPEN=False)
    def test_sales_switch(self):
        with self.assertRaises(ValidationError):
            self.buy("disabled")
        self.assertFalse(PaymentTransaction.objects.exists())

from concurrent.futures import ThreadPoolExecutor
from threading import Barrier
from unittest import skipUnless
from django.contrib.auth import get_user_model
from django.db import close_old_connections, connection, connections
from django.test import TransactionTestCase, override_settings
from marketplace.models import SubscriptionGrant, UserWallet
from marketplace.services import get_active_pricing_plans, initiate_checkout


@skipUnless(connection.vendor == "postgresql", "Checks PostgreSQL row locks.")
@override_settings(ZARINPAL_SANDBOX=False, ENDOORA_SUBSCRIPTION_SALES_OPEN=True)
class ConcurrentSubscriptionTests(TransactionTestCase):
    def test_same_checkout_key_charges_once(self):
        user = get_user_model().objects.create_user("racer@example.org", "demo-pass")
        plan = next(iter(get_active_pricing_plans()))
        wallet = UserWallet.objects.create(
            user=user, balance_toman=plan.price_toman * 4
        )
        barrier = Barrier(2)

        def buy():
            close_old_connections()
            try:
                account = get_user_model().objects.get(pk=user.pk)
                barrier.wait(timeout=10)
                return initiate_checkout(
                    account,
                    "subscription_plan",
                    str(plan.pk),
                    plan.price_toman,
                    "wallet",
                    idempotency_key="retry",
                )["transaction_id"]
            finally:
                connections.close_all()

        with ThreadPoolExecutor(max_workers=2) as pool:
            ids = [f.result(timeout=20) for f in [pool.submit(buy), pool.submit(buy)]]
        self.assertEqual(ids[0], ids[1])
        self.assertEqual(SubscriptionGrant.objects.count(), 1)
        wallet.refresh_from_db()
        self.assertEqual(wallet.balance_toman, plan.price_toman * 3)

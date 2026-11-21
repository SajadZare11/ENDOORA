from datetime import timedelta
from django.contrib.auth import get_user_model
from django.db import connection
from django.db.migrations.executor import MigrationExecutor
from django.test import TransactionTestCase
from django.utils import timezone


class LegacySubscriptionMigrationTests(TransactionTestCase):
    def test_legacy_settlement_pending_and_unresolved(self):
        old = (
            "marketplace",
            "0010_teacherpayoutrequest_approved_at_and_more",
        )
        new = ("marketplace", "0012_backfill_subscription_periods")
        executor = MigrationExecutor(connection)
        executor.migrate([old])
        try:
            apps = executor.loader.project_state([old]).apps
            plan = apps.get_model("marketplace", "PlatformPricingPlan").objects.create(
                code="historical-demo",
                name_fa="آزمایشی",
                name_en="Legacy",
                duration_days=30,
                price_toman=100,
            )
            user = get_user_model().objects.create_user(
                "legacy@example.org", "demo-pass"
            )
            Payment = apps.get_model("marketplace", "PaymentTransaction")
            now = timezone.now()
            for key, status, verified, with_plan in [
                ("old", "paid", now - timedelta(days=60), True),
                ("early", "paid", now - timedelta(days=55), True),
                ("pending", "pending", None, True),
                ("missing", "paid", now, False),
                ("refunded", "refunded", now, True),
            ]:
                Payment.objects.create(
                    user_id=user.pk,
                    plan=plan if with_plan else None,
                    order_type="subscription_plan",
                    status=status,
                    is_sandbox=False,
                    idempotency_key=key,
                    amount_rial=1000,
                    amount_toman=100,
                    verified_at=verified,
                )
        finally:
            MigrationExecutor(connection).migrate([new])
        from marketplace.models import PaymentTransaction, SubscriptionGrant

        grants = list(SubscriptionGrant.objects.order_by("starts_at"))
        self.assertEqual(len(grants), 2)
        self.assertEqual(grants[0].ends_at, grants[1].starts_at)
        self.assertEqual(grants[1].ends_at, now)
        self.assertEqual(
            PaymentTransaction.objects.get(idempotency_key="pending").subscription_days,
            30,
        )
        self.assertFalse(user.is_premium)

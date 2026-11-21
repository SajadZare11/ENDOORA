from datetime import datetime
from django.core.management.base import BaseCommand, CommandError
from rest_framework.exceptions import ValidationError
from marketplace.models import PaymentTransaction
from marketplace.subscriptions import record_confirmed_refund, reconcile_legacy


class Command(BaseCommand):
    help = "List unsettled legacy entitlement records or record an already-confirmed full refund."

    def add_arguments(self, parser):
        parser.add_argument("action", choices=["unresolved", "refund", "legacy"])
        parser.add_argument("--days", type=int)
        parser.add_argument(
            "--verified-at", help="Actual ISO timestamp with UTC offset"
        )
        parser.add_argument("--payment")
        parser.add_argument("--reference")

    def handle(self, action, payment, reference, days, verified_at, **kwargs):
        if action == "unresolved":
            for pk in PaymentTransaction.objects.filter(
                order_type="subscription_plan",
                status="paid",
                subscription_grant__isnull=True,
            ).values_list("pk", flat=True):
                self.stdout.write(str(pk))
            return
        if not payment or not reference:
            raise CommandError(
                "Supply --payment and --reference from the confirmed refund."
            )
        try:
            if action == "legacy":
                if not days or not verified_at:
                    raise CommandError(
                        "Supply --days and --verified-at from the original receipt."
                    )
                reconcile_legacy(
                    payment, datetime.fromisoformat(verified_at), days, reference
                )
            else:
                record_confirmed_refund(payment, reference)
        except (ValueError, PaymentTransaction.DoesNotExist, ValidationError) as error:
            raise CommandError(str(error)) from error
        self.stdout.write("Entitlement reconciled.")

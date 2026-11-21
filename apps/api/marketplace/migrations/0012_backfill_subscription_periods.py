from datetime import timedelta
from django.db import migrations


def import_receipts(apps, schema_editor):
    Payment = apps.get_model("marketplace", "PaymentTransaction")
    Grant = apps.get_model("marketplace", "SubscriptionGrant")
    db = schema_editor.connection.alias
    payments = Payment.objects.using(db).filter(order_type="subscription_plan", plan__isnull=False).select_related("plan")
    previous_owner, cursor = None, None
    for payment in payments.order_by("user_id", "is_sandbox", "verified_at", "pk").iterator(chunk_size=500):
        days = payment.plan.duration_days
        Payment.objects.using(db).filter(pk=payment.pk).update(subscription_days=days)
        if not days or payment.status != "paid" or not payment.verified_at:
            continue
        owner = (payment.user_id, payment.is_sandbox)
        start = max(cursor, payment.verified_at) if owner == previous_owner else payment.verified_at
        cursor = start + timedelta(days=days)
        Grant.objects.using(db).get_or_create(payment_id=payment.pk, defaults={
            "days": days, "paid_at": payment.verified_at, "starts_at": start, "ends_at": cursor})
        previous_owner = owner


class Migration(migrations.Migration):
    dependencies = [("marketplace", "0011_paymenttransaction_subscription_days_and_more")]
    operations = [migrations.RunPython(import_receipts, migrations.RunPython.noop)]

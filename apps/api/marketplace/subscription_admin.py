from django import forms
from django.contrib import admin, messages
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import path, reverse
from django.utils.html import format_html
from rest_framework.exceptions import ValidationError
from .models import SubscriptionGrant
from .subscriptions import record_confirmed_refund


class RefundForm(forms.Form):
    reference = forms.CharField(
        max_length=120, label="Provider or wallet refund receipt"
    )
    confirmed = forms.BooleanField(
        label="I checked the completed full refund against this exact payment."
    )


@admin.register(SubscriptionGrant)
class GrantAdmin(admin.ModelAdmin):
    list_display = (
        "payment_id",
        "paid_at",
        "days",
        "starts_at",
        "ends_at",
        "revoked_at",
        "reconcile",
    )
    readonly_fields = tuple(field.name for field in SubscriptionGrant._meta.fields)
    search_fields = ("payment__user__email", "payment__ref_id", "refund_reference")

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def get_urls(self):
        return [
            path(
                "<int:pk>/confirmed-refund/",
                self.admin_site.admin_view(self.confirmed_refund),
                name="subscription_refund",
            )
        ] + super().get_urls()

    def reconcile(self, obj):
        if obj.revoked_at:
            return obj.refund_reference
        return format_html(
            '<a href="{}">Record confirmed full refund</a>',
            reverse("admin:subscription_refund", args=[obj.pk]),
        )

    def confirmed_refund(self, request, pk):
        if not self.has_change_permission(request):
            raise PermissionDenied
        grant = get_object_or_404(
            SubscriptionGrant.objects.select_related("payment__user"), pk=pk
        )
        form = RefundForm(request.POST or None)
        if request.method == "POST" and form.is_valid():
            try:
                record_confirmed_refund(
                    grant.payment_id, form.cleaned_data["reference"]
                )
            except ValidationError as error:
                form.add_error(None, str(error.detail))
            else:
                self.log_change(request, grant, "Reconciled confirmed full refund.")
                self.message_user(
                    request, "Subscription periods reconciled.", messages.SUCCESS
                )
                return redirect("admin:marketplace_subscriptiongrant_changelist")
        return render(
            request, "marketplace/confirmed_refund.html", {"form": form, "grant": grant}
        )

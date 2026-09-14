from django.contrib import admin
from ledger.models import (
    CommissionRule,
    PayoutAuditLog,
    TeacherPayableLedgerEntry,
    TeacherTaxIdentity,
)


@admin.register(CommissionRule)
class CommissionRuleAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "product_type",
        "rate_percentage",
        "fixed_fee_toman",
        "effective_from",
        "effective_to",
        "priority",
        "is_active",
    ]
    list_filter = ["product_type", "is_active"]
    search_fields = ["name", "description"]
    ordering = ["-priority", "-effective_from"]


@admin.register(TeacherPayableLedgerEntry)
class TeacherPayableLedgerEntryAdmin(admin.ModelAdmin):
    list_display = [
        "reference_code",
        "teacher",
        "entry_type",
        "amount_toman",
        "gross_amount_toman",
        "commission_amount_toman",
        "net_amount_toman",
        "is_matured",
        "dispute_window_ends_at",
        "created_at",
    ]
    list_filter = ["entry_type", "is_matured"]
    search_fields = ["reference_code", "teacher__email", "description"]
    readonly_fields = [
        "reference_code",
        "teacher",
        "entry_type",
        "amount_toman",
        "booking",
        "payout_request",
        "commission_rule",
        "gross_amount_toman",
        "commission_amount_toman",
        "net_amount_toman",
        "dispute_window_ends_at",
        "is_matured",
        "created_at",
    ]
    ordering = ["-created_at"]


@admin.register(TeacherTaxIdentity)
class TeacherTaxIdentityAdmin(admin.ModelAdmin):
    list_display = [
        "teacher",
        "national_id_masked",
        "tax_file_number",
        "bank_shaba_number",
        "is_tax_exempt",
        "is_verified",
        "verified_at",
    ]
    list_filter = ["is_verified", "is_tax_exempt"]
    search_fields = ["teacher__email", "national_id_masked", "tax_file_number"]


@admin.register(PayoutAuditLog)
class PayoutAuditLogAdmin(admin.ModelAdmin):
    list_display = [
        "payout_request",
        "performed_by",
        "action",
        "bank_transfer_reference",
        "transfer_date",
        "created_at",
    ]
    list_filter = ["action"]
    search_fields = ["bank_transfer_reference", "notes", "performed_by__email"]
    readonly_fields = fields = [
        "payout_request",
        "performed_by",
        "action",
        "bank_transfer_reference",
        "transfer_date",
        "notes",
        "created_at",
    ]
    ordering = ["-created_at"]

from decimal import Decimal
from rest_framework import serializers
from ledger.models import (
    CommissionProductType,
    CommissionRule,
    LedgerEntryType,
    PayoutAuditAction,
    PayoutAuditLog,
    TeacherPayableLedgerEntry,
    TeacherTaxIdentity,
)
from ledger.payouts import mask_national_id, mask_sheba
from marketplace.models import TeacherPayoutRequest


class CommissionRuleSerializer(serializers.ModelSerializer):
    product_type_display = serializers.CharField(source="get_product_type_display", read_only=True)

    class Meta:
        model = CommissionRule
        fields = [
            "id",
            "name",
            "product_type",
            "product_type_display",
            "rate_percentage",
            "fixed_fee_toman",
            "effective_from",
            "effective_to",
            "priority",
            "is_active",
            "description",
            "created_at",
            "updated_at",
        ]


class TeacherPayableLedgerEntrySerializer(serializers.ModelSerializer):
    entry_type_display = serializers.CharField(source="get_entry_type_display", read_only=True)
    status_label = serializers.SerializerMethodField()

    class Meta:
        model = TeacherPayableLedgerEntry
        fields = [
            "id",
            "reference_code",
            "entry_type",
            "entry_type_display",
            "amount_toman",
            "gross_amount_toman",
            "commission_amount_toman",
            "net_amount_toman",
            "dispute_window_ends_at",
            "is_matured",
            "status_label",
            "description",
            "created_at",
        ]
        read_only_fields = fields

    def get_status_label(self, obj) -> str:
        if obj.entry_type == LedgerEntryType.REFUND_REVERSAL:
            return "مسترد شده"
        if obj.entry_type == LedgerEntryType.PAYOUT_REQUESTED:
            return "مسدود تسویه"
        if obj.entry_type == LedgerEntryType.PAYOUT_COMPLETED:
            return "واریز شده"
        if not obj.is_matured:
            return "معلق (دوره بازبینی)"
        return "قطعی و در دسترس"


class TeacherTaxIdentitySerializer(serializers.ModelSerializer):
    bank_shaba_masked = serializers.SerializerMethodField()

    class Meta:
        model = TeacherTaxIdentity
        fields = [
            "id",
            "national_id_masked",
            "tax_file_number",
            "is_tax_exempt",
            "withholding_tax_rate",
            "bank_shaba_number",
            "bank_shaba_masked",
            "bank_name",
            "account_holder_name",
            "is_verified",
            "verified_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "is_verified", "verified_at", "created_at", "updated_at"]

    def get_bank_shaba_masked(self, obj) -> str:
        return mask_sheba(obj.bank_shaba_number)


class PayoutAuditLogSerializer(serializers.ModelSerializer):
    performed_by_name = serializers.SerializerMethodField()
    action_display = serializers.CharField(source="get_action_display", read_only=True)

    class Meta:
        model = PayoutAuditLog
        fields = [
            "id",
            "action",
            "action_display",
            "performed_by_name",
            "bank_transfer_reference",
            "transfer_date",
            "notes",
            "created_at",
        ]
        read_only_fields = fields

    def get_performed_by_name(self, obj) -> str:
        return obj.performed_by.get_full_name() or obj.performed_by.email


class LedgerPayoutRequestSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    bank_shaba_masked = serializers.SerializerMethodField()
    teacher_name = serializers.SerializerMethodField()
    audit_trail = PayoutAuditLogSerializer(source="ledger_audit_logs", many=True, read_only=True)

    class Meta:
        model = TeacherPayoutRequest
        fields = [
            "id",
            "teacher_id",
            "teacher_name",
            "amount_toman",
            "bank_shaba_number",
            "bank_shaba_masked",
            "bank_name",
            "account_holder_name",
            "status",
            "status_display",
            "admin_notes",
            "rejection_reason",
            "processed_at",
            "audit_trail",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "teacher_id",
            "teacher_name",
            "status",
            "status_display",
            "admin_notes",
            "rejection_reason",
            "processed_at",
            "audit_trail",
            "created_at",
            "updated_at",
        ]

    def get_bank_shaba_masked(self, obj) -> str:
        return mask_sheba(obj.bank_shaba_number)

    def get_teacher_name(self, obj) -> str:
        return obj.teacher.get_full_name() or obj.teacher.email


class AdminPayoutActionInputSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=["review", "approve", "dual_signoff", "pay", "reject"])
    bank_transfer_reference = serializers.CharField(required=False, allow_blank=True, default="")
    transfer_date = serializers.DateField(required=False, allow_null=True, default=None)
    notes = serializers.CharField(required=False, allow_blank=True, default="")
    rejection_reason = serializers.CharField(required=False, allow_blank=True, default="")

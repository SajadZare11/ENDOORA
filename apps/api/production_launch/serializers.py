from __future__ import annotations

from rest_framework import serializers
from .models import GoldenFlowVerificationLog, ProductionLaunchSignoff


class GoldenFlowVerificationLogSerializer(serializers.ModelSerializer):
    operator_email = serializers.SerializerMethodField()

    class Meta:
        model = GoldenFlowVerificationLog
        fields = [
            "id",
            "operator",
            "operator_email",
            "total_flows",
            "passed_flows",
            "duration_ms",
            "status",
            "score",
            "flow_results",
            "rehearsed_at",
        ]
        read_only_fields = fields

    def get_operator_email(self, obj: GoldenFlowVerificationLog) -> str | None:
        return obj.operator.email if obj.operator else None


class ProductionLaunchSignoffSerializer(serializers.ModelSerializer):
    authorized_by_email = serializers.SerializerMethodField()

    class Meta:
        model = ProductionLaunchSignoff
        fields = [
            "id",
            "authorized_by",
            "authorized_by_email",
            "engineer_name",
            "role",
            "checklist_version",
            "status",
            "verification_score",
            "confirmation_hash",
            "notes",
            "signed_at",
        ]
        read_only_fields = ["id", "signed_at"]

    def get_authorized_by_email(self, obj: ProductionLaunchSignoff) -> str | None:
        return obj.authorized_by.email if obj.authorized_by else None


class ProductionSignoffCreateSerializer(serializers.Serializer):
    engineer_name = serializers.CharField(max_length=255)
    role = serializers.CharField(max_length=100, default="Principal Launch Architect")
    notes = serializers.CharField(required=False, allow_blank=True, default="")

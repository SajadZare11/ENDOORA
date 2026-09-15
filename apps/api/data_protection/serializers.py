from __future__ import annotations
from rest_framework import serializers
from .models import PrivacyConsentPreference, DataPurgeLog

class PrivacyConsentPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivacyConsentPreference
        fields = (
            "functional_storage",
            "analytics_processing",
            "ai_model_training_telemetry",
            "marketing_communications",
            "locale",
            "policy_version",
            "updated_at",
        )
        read_only_fields = ("functional_storage", "policy_version", "updated_at")


class DataPurgeLogSerializer(serializers.ModelSerializer):
    operator_email = serializers.SerializerMethodField()

    class Meta:
        model = DataPurgeLog
        fields = (
            "id",
            "trigger",
            "operator_email",
            "accounts_erased",
            "audio_files_purged",
            "stale_otps_purged",
            "stale_exports_purged",
            "duration_ms",
            "details",
            "status",
            "executed_at",
        )

    def get_operator_email(self, obj) -> str | None:
        if obj.operator:
            return obj.operator.email
        return None

class PrivacyTelemetrySerializer(serializers.Serializer):
    deletion_stats = serializers.DictField()
    export_stats = serializers.DictField()
    retention_schedules = serializers.ListField()
    recent_purge_logs = DataPurgeLogSerializer(many=True)
    compliance_scorecard = serializers.DictField()

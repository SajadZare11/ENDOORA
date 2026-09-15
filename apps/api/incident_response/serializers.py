from __future__ import annotations

from rest_framework import serializers

from .models import Incident, RestoreVerificationLog, RunbookDefinition


class RestoreVerificationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestoreVerificationLog
        fields = [
            "id",
            "snapshot",
            "backup_file_path",
            "checksum",
            "checksum_verified",
            "tables_restored_count",
            "records_sampled_count",
            "status",
            "duration_ms",
            "details",
            "verified_at",
        ]
        read_only_fields = fields


class IncidentSerializer(serializers.ModelSerializer):
    commander_email = serializers.SerializerMethodField()
    time_to_mitigate_minutes = serializers.ReadOnlyField()
    time_to_resolve_minutes = serializers.ReadOnlyField()

    class Meta:
        model = Incident
        fields = [
            "id",
            "title",
            "severity",
            "status",
            "affected_service",
            "runbook_slug",
            "commander",
            "commander_email",
            "summary",
            "mitigation_steps",
            "root_cause_analysis",
            "action_items",
            "detected_at",
            "mitigated_at",
            "resolved_at",
            "created_at",
            "time_to_mitigate_minutes",
            "time_to_resolve_minutes",
        ]
        read_only_fields = ["id", "created_at"]

    def get_commander_email(self, obj: Incident) -> str | None:
        return obj.commander.email if obj.commander else None


class RunbookDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RunbookDefinition
        fields = [
            "slug",
            "title",
            "title_fa",
            "severity_trigger",
            "target_service",
            "steps_json",
            "automated_verification_available",
            "last_rehearsed_at",
        ]


class RunbookExecuteRequestSerializer(serializers.Serializer):
    step_number = serializers.IntegerField(default=1, min_value=1)

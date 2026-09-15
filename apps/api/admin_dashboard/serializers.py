from __future__ import annotations

from rest_framework import serializers
from audit.models import AuditEvent
from core.models.settings import FeatureFlag


class FeatureFlagAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeatureFlag
        fields = [
            "id",
            "key",
            "enabled",
            "rollout_percentage",
            "environments",
            "owner",
            "rationale",
            "dependencies",
            "kill_switch_behavior",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class FeatureFlagToggleSerializer(serializers.Serializer):
    enabled = serializers.BooleanField(required=False)
    rollout_percentage = serializers.IntegerField(min_value=0, max_value=100, required=False)
    kill_switch_behavior = serializers.ChoiceField(
        choices=FeatureFlag.KillSwitchBehavior.choices,
        required=False,
    )
    reason = serializers.CharField(required=True, min_length=5, help_text="Mandatory audit explanation for flag modification")


class AuditEventAdminSerializer(serializers.ModelSerializer):
    actor_email = serializers.SerializerMethodField()
    actor_role = serializers.SerializerMethodField()

    class Meta:
        model = AuditEvent
        fields = [
            "id",
            "actor_id",
            "actor_email",
            "actor_role",
            "action",
            "target_app",
            "target_model",
            "target_pk",
            "before_summary",
            "after_summary",
            "reason",
            "request_method",
            "request_path",
            "environment",
            "occurred_at",
        ]

    def get_actor_email(self, obj: AuditEvent) -> str:
        if obj.actor:
            return getattr(obj.actor, "email", "system")
        return "system"

    def get_actor_role(self, obj: AuditEvent) -> str:
        if obj.actor:
            return getattr(obj.actor, "role", "staff")
        return "system"

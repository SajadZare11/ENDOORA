from __future__ import annotations

from rest_framework import serializers
from audit.models import AuditEvent
from core.models.settings import FeatureFlag
from .models import AdminSecurityConfig, SiteCmsSnapshot, SiteCmsDraft, SiteMediaAsset


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


class SiteCmsSnapshotAdminSerializer(serializers.ModelSerializer):
    published_by_email = serializers.SerializerMethodField()

    class Meta:
        model = SiteCmsSnapshot
        fields = [
            "id",
            "version",
            "content_json",
            "is_live",
            "summary",
            "published_by_id",
            "published_by_email",
            "created_at",
        ]

    def get_published_by_email(self, obj: SiteCmsSnapshot) -> str:
        if obj.published_by:
            return getattr(obj.published_by, "email", "مدیر سیستم")
        return "مدیر ارشد"


class SiteCmsDraftAdminSerializer(serializers.ModelSerializer):
    updated_by_email = serializers.SerializerMethodField()

    class Meta:
        model = SiteCmsDraft
        fields = [
            "id",
            "content_json",
            "updated_by_id",
            "updated_by_email",
            "updated_at",
        ]

    def get_updated_by_email(self, obj: SiteCmsDraft) -> str:
        if obj.updated_by:
            return getattr(obj.updated_by, "email", "مدیر سیستم")
        return "مدیر ارشد"


class SiteMediaAssetAdminSerializer(serializers.ModelSerializer):
    uploaded_by_email = serializers.SerializerMethodField()

    class Meta:
        model = SiteMediaAsset
        fields = [
            "id",
            "title",
            "file",
            "file_url",
            "file_type",
            "file_size_bytes",
            "uploaded_by_id",
            "uploaded_by_email",
            "created_at",
        ]
        read_only_fields = ["id", "file_url", "file_type", "file_size_bytes", "created_at"]

    def get_uploaded_by_email(self, obj: SiteMediaAsset) -> str:
        if obj.uploaded_by:
            return getattr(obj.uploaded_by, "email", "مدیر سیستم")
        return "مدیر سیستم"


class AdminSecurityPinVerifySerializer(serializers.Serializer):
    pin = serializers.CharField(min_length=6, max_length=12, required=True)


class AdminSecurityPinChangeSerializer(serializers.Serializer):
    current_pin = serializers.CharField(min_length=6, max_length=12, required=True)
    new_pin = serializers.CharField(min_length=6, max_length=12, required=True)


class UserGrantSubscriptionSerializer(serializers.Serializer):
    tier = serializers.ChoiceField(choices=["plus", "pro_vip"], default="pro_vip")
    months = serializers.IntegerField(min_value=1, max_value=36, default=3)
    reason = serializers.CharField(min_length=3, required=True)


class RawSqlExecutionSerializer(serializers.Serializer):
    query = serializers.CharField(min_length=5, required=True)
    is_dry_run = serializers.BooleanField(default=True)
    pin = serializers.CharField(min_length=6, max_length=12, required=False, default="")


class DatabaseRowMutationSerializer(serializers.Serializer):
    table = serializers.CharField(required=True)
    row_id = serializers.CharField(required=True)
    updates = serializers.DictField(required=True)
    reason = serializers.CharField(min_length=3, required=True)
    pin = serializers.CharField(min_length=6, max_length=12, required=False, default="")

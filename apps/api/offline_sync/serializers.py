from __future__ import annotations

from rest_framework import serializers

from .models import DraftType, OfflineDraft, OfflineSyncTelemetry


class OfflineDraftSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfflineDraft
        fields = [
            "id",
            "draft_type",
            "resource_id",
            "title",
            "content_json",
            "client_version",
            "server_version",
            "client_updated_at",
            "server_updated_at",
            "checksum",
            "is_conflict",
            "conflict_backup",
            "is_archived",
        ]
        read_only_fields = [
            "id",
            "server_version",
            "server_updated_at",
            "checksum",
            "is_conflict",
            "conflict_backup",
        ]


class BatchSyncItemSerializer(serializers.Serializer):
    id = serializers.UUIDField(required=False, allow_null=True)
    draft_type = serializers.ChoiceField(
        choices=DraftType.choices, default=DraftType.GENERAL_DRAFT
    )
    resource_id = serializers.CharField(
        required=False, allow_blank=True, default="", max_length=128
    )
    title = serializers.CharField(
        required=False, allow_blank=True, default="پیش‌نویس بدون عنوان", max_length=255
    )
    content_json = serializers.DictField(required=False, default=dict)
    client_version = serializers.IntegerField(default=1, min_value=1)
    client_updated_at = serializers.DateTimeField(required=False, allow_null=True)
    checksum = serializers.CharField(required=False, allow_blank=True, default="")


class BatchSyncRequestSerializer(serializers.Serializer):
    sync_session_id = serializers.CharField(
        required=False, allow_blank=True, max_length=64, default=""
    )
    network_effective_type = serializers.CharField(
        required=False, default="unknown", max_length=16
    )
    is_low_bandwidth = serializers.BooleanField(required=False, default=False)
    payload_bytes = serializers.IntegerField(required=False, default=0, min_value=0)
    drafts = BatchSyncItemSerializer(many=True, required=True)


class ConflictResolutionRequestSerializer(serializers.Serializer):
    resolution = serializers.ChoiceField(
        choices=["keep_server", "keep_client", "custom_merge"]
    )
    chosen_content = serializers.DictField(required=False, default=dict)

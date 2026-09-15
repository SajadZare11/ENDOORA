from __future__ import annotations

from rest_framework import serializers
from disaster_recovery.models import DatabaseBackupSnapshot, ReplicationNodeStatus


class DatabaseBackupSnapshotSerializer(serializers.ModelSerializer):
    backup_type_display = serializers.CharField(source="get_backup_type_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = DatabaseBackupSnapshot
        fields = [
            "id",
            "backup_type",
            "backup_type_display",
            "storage_location",
            "file_size_bytes",
            "checksum_sha256",
            "encryption_algorithm",
            "status",
            "status_display",
            "verified_at",
            "verification_duration_ms",
            "table_count",
            "created_at",
            "metadata",
        ]
        read_only_fields = [
            "id",
            "storage_location",
            "file_size_bytes",
            "checksum_sha256",
            "encryption_algorithm",
            "status",
            "verified_at",
            "verification_duration_ms",
            "table_count",
            "created_at",
        ]


class ReplicationNodeStatusSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source="get_role_display", read_only=True)

    class Meta:
        model = ReplicationNodeStatus
        fields = [
            "id",
            "cluster_name",
            "node_name",
            "role",
            "role_display",
            "is_healthy",
            "replication_lag_bytes",
            "replication_lag_ms",
            "endpoint",
            "last_heartbeat_at",
            "metadata",
        ]


class BackupTriggerSerializer(serializers.Serializer):
    backup_type = serializers.ChoiceField(
        choices=DatabaseBackupSnapshot.BackupType.choices,
        default=DatabaseBackupSnapshot.BackupType.FULL,
    )
    verify_immediately = serializers.BooleanField(default=True)
    notes = serializers.CharField(required=False, allow_blank=True, default="")

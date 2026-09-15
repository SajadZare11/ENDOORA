from __future__ import annotations

import uuid
from django.db import models
from django.utils import timezone


class DatabaseBackupSnapshot(models.Model):
    class BackupType(models.TextChoices):
        FULL = "full", "Full Database Snapshot"
        DIFFERENTIAL = "differential", "Differential"
        WAL_ARCHIVE = "wal_archive", "WAL Archive Segment"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        COMPLETED = "completed", "Completed"
        FAILED = "failed", "Failed"
        VERIFIED = "verified", "Verified"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    backup_type = models.CharField(
        max_length=32,
        choices=BackupType.choices,
        default=BackupType.FULL,
    )
    storage_location = models.CharField(max_length=500, default="vault/backups")
    file_size_bytes = models.BigIntegerField(default=0)
    checksum_sha256 = models.CharField(max_length=64, blank=True, default="")
    encryption_algorithm = models.CharField(max_length=64, default="AES-256-GCM")
    status = models.CharField(
        max_length=32,
        choices=Status.choices,
        default=Status.PENDING,
    )
    verified_at = models.DateTimeField(null=True, blank=True)
    verification_duration_ms = models.PositiveIntegerField(default=0)
    table_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=["status", "-created_at"]),
        ]

    def __str__(self) -> str:
        return f"BackupSnapshot<{self.id}:{self.backup_type}:{self.status}>"


class ReplicationNodeStatus(models.Model):
    class Role(models.TextChoices):
        PRIMARY = "primary", "Primary (R/W)"
        STANDBY_SYNC = "standby_sync", "Standby Replica (Sync)"
        STANDBY_ASYNC = "standby_async", "Standby Replica (Async)"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cluster_name = models.CharField(max_length=100, default="pg16-ha-tehran")
    node_name = models.CharField(max_length=100, unique=True)
    role = models.CharField(
        max_length=32,
        choices=Role.choices,
        default=Role.PRIMARY,
    )
    is_healthy = models.BooleanField(default=True)
    replication_lag_bytes = models.BigIntegerField(default=0)
    replication_lag_ms = models.PositiveIntegerField(default=0)
    endpoint = models.CharField(max_length=255, blank=True, default="")
    last_heartbeat_at = models.DateTimeField(auto_now=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ("role", "node_name")

    def __str__(self) -> str:
        return f"ReplicationNode<{self.cluster_name}:{self.node_name}:{self.role}:{self.is_healthy}>"

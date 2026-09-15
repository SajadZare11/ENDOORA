from __future__ import annotations

import hashlib
import json
import uuid
from typing import Any

from django.conf import settings
from django.db import models
from django.utils import timezone


class DraftType(models.TextChoices):
    WRITING_SUBMISSION = "writing_submission", "Writing Mentor Submission"
    PLACEMENT_CHECKPOINT = "placement_checkpoint", "Placement Test Checkpoint"
    TEACHER_NOTE = "teacher_note", "Teacher Class Note"
    ROLEPLAY_RESPONSE = "roleplay_response", "Roleplay Scenario Response"
    COMMUNITY_DRAFT = "community_draft", "Community Post Draft"
    GENERAL_DRAFT = "general_draft", "General Resumable Draft"


class OfflineDraft(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="offline_drafts",
    )
    draft_type = models.CharField(
        max_length=32,
        choices=DraftType.choices,
        default=DraftType.GENERAL_DRAFT,
        db_index=True,
    )
    resource_id = models.CharField(max_length=128, blank=True, default="", db_index=True)
    title = models.CharField(max_length=255, default="پیش‌نویس بدون عنوان")
    content_json = models.JSONField(default=dict, blank=True)
    client_version = models.PositiveIntegerField(default=1)
    server_version = models.PositiveIntegerField(default=1)
    client_updated_at = models.DateTimeField(default=timezone.now)
    server_updated_at = models.DateTimeField(auto_now=True)
    checksum = models.CharField(max_length=64, blank=True, default="")
    is_conflict = models.BooleanField(default=False)
    conflict_backup = models.JSONField(default=dict, blank=True)
    is_archived = models.BooleanField(default=False, db_index=True)

    class Meta:
        ordering = ("-server_updated_at",)
        indexes = [
            models.Index(fields=["user", "draft_type", "is_archived"]),
            models.Index(fields=["user", "resource_id"]),
        ]

    def __str__(self) -> str:
        return f"OfflineDraft<{self.id} user={self.user_id} type={self.draft_type} v={self.server_version}>"

    @staticmethod
    def compute_content_checksum(data: Any) -> str:
        """Compute deterministic SHA-256 checksum over JSON data."""
        serialized = json.dumps(data, sort_keys=True, ensure_ascii=False)
        return hashlib.sha256(serialized.encode("utf-8")).hexdigest()

    def save(self, *args, **kwargs):
        if not self.checksum and self.content_json:
            self.checksum = self.compute_content_checksum(self.content_json)
        super().save(*args, **kwargs)


class OfflineSyncTelemetry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="offline_sync_telemetry",
    )
    sync_session_id = models.CharField(max_length=64, blank=True, default="", db_index=True)
    drafts_received = models.PositiveIntegerField(default=0)
    drafts_updated = models.PositiveIntegerField(default=0)
    conflicts_detected = models.PositiveIntegerField(default=0)
    payload_bytes = models.PositiveIntegerField(default=0)
    network_effective_type = models.CharField(max_length=16, blank=True, default="unknown")
    is_low_bandwidth = models.BooleanField(default=False)
    client_user_agent = models.CharField(max_length=255, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"OfflineSyncTelemetry<{self.id} drafts={self.drafts_received} conflicts={self.conflicts_detected} at={self.created_at}>"

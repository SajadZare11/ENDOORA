from __future__ import annotations

import uuid
from typing import Optional

from django.conf import settings
from django.db import models
from django.utils import timezone


class RestoreVerificationStatus(models.TextChoices):
    VERIFIED = "verified", "کاملاً تأییدشده"
    PARTIAL = "partial", "تأیید نسبی"
    FAILED = "failed", "ناموفق"


class RestoreVerificationLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    snapshot = models.ForeignKey(
        "disaster_recovery.DatabaseBackupSnapshot",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="restore_verifications",
    )
    backup_file_path = models.CharField(max_length=255)
    checksum = models.CharField(max_length=64)
    checksum_verified = models.BooleanField(default=True)
    tables_restored_count = models.PositiveIntegerField(default=0)
    records_sampled_count = models.PositiveIntegerField(default=0)
    status = models.CharField(
        max_length=16,
        choices=RestoreVerificationStatus.choices,
        default=RestoreVerificationStatus.VERIFIED,
    )
    duration_ms = models.PositiveIntegerField(default=0)
    details = models.JSONField(default=dict, blank=True)
    verified_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-verified_at",)

    def __str__(self) -> str:
        return f"RestoreVerification<{self.id} status={self.status} at={self.verified_at}>"


class IncidentSeverity(models.TextChoices):
    P1_CRITICAL = "P1_CRITICAL", "P1 - بحرانی (قطعی سرویس / خطر داده)"
    P2_HIGH = "P2_HIGH", "P2 - بالا (اختلال در درگاه پرداخت یا هوش مصنوعی)"
    P3_MEDIUM = "P3_MEDIUM", "P3 - متوسط (کندی سیستم یا خطای غیراصلی)"
    P4_LOW = "P4_LOW", "P4 - جزئی (مشکل ظاهری یا گزارش کوچک)"


class IncidentStatus(models.TextChoices):
    DETECTED = "detected", "شناسایی‌شده"
    INVESTIGATING = "investigating", "در حال بررسی"
    MITIGATED = "mitigated", "مهارشده / کاهش اثر"
    RESOLVED = "resolved", "رفع قطعی"
    POST_MORTEM = "post_mortem", "تحلیل پس از بحران"


class Incident(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    severity = models.CharField(
        max_length=16,
        choices=IncidentSeverity.choices,
        default=IncidentSeverity.P3_MEDIUM,
        db_index=True,
    )
    status = models.CharField(
        max_length=16,
        choices=IncidentStatus.choices,
        default=IncidentStatus.DETECTED,
        db_index=True,
    )
    affected_service = models.CharField(max_length=64, db_index=True)
    runbook_slug = models.CharField(max_length=64, blank=True, default="")
    commander = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="commanded_incidents",
    )
    summary = models.TextField()
    mitigation_steps = models.TextField(blank=True, default="")
    root_cause_analysis = models.TextField(blank=True, default="")
    action_items = models.JSONField(default=list, blank=True)
    detected_at = models.DateTimeField(default=timezone.now)
    mitigated_at = models.DateTimeField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-detected_at",)

    def __str__(self) -> str:
        return f"Incident<{self.severity}:{self.title} ({self.status})>"

    @property
    def time_to_mitigate_minutes(self) -> Optional[float]:
        if not self.mitigated_at or not self.detected_at:
            return None
        return round((self.mitigated_at - self.detected_at).total_seconds() / 60.0, 1)

    @property
    def time_to_resolve_minutes(self) -> Optional[float]:
        if not self.resolved_at or not self.detected_at:
            return None
        return round((self.resolved_at - self.detected_at).total_seconds() / 60.0, 1)


class RunbookDefinition(models.Model):
    slug = models.CharField(max_length=64, primary_key=True)
    title = models.CharField(max_length=255)
    title_fa = models.CharField(max_length=255)
    severity_trigger = models.CharField(max_length=16)
    target_service = models.CharField(max_length=64)
    steps_json = models.JSONField(default=list, blank=True)
    automated_verification_available = models.BooleanField(default=True)
    last_rehearsed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ("slug",)

    def __str__(self) -> str:
        return f"Runbook<{self.slug}: {self.title_fa}>"

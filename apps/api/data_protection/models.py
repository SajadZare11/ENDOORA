from __future__ import annotations
import uuid
from django.conf import settings
from django.db import models
from django.utils import timezone

class PrivacyConsentPreference(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="privacy_preferences",
    )
    functional_storage = models.BooleanField(default=True, editable=False)
    analytics_processing = models.BooleanField(default=True)
    ai_model_training_telemetry = models.BooleanField(default=True)
    marketing_communications = models.BooleanField(default=False)
    locale = models.CharField(max_length=2, default="fa")
    policy_version = models.CharField(max_length=32, default="day52-2026-09-15")
    updated_at = models.DateTimeField(auto_now=True)
    client_ip = models.CharField(max_length=45, blank=True, default="")
    user_agent = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        ordering = ("-updated_at",)

    def __str__(self) -> str:
        return f"PrivacyPrefs<{self.user_id}:{self.policy_version}>"

class DataPurgeLog(models.Model):
    class TriggerType(models.TextChoices):
        AUTOMATED_CRON = "automated_cron", "Automated Cron Schedule"
        MANUAL_OPERATOR = "manual_operator", "Manual Operator Trigger"
        USER_REQUESTED = "user_requested", "User Immediate Request"

    class Status(models.TextChoices):
        COMPLETED = "completed", "Completed"
        PARTIAL = "partial", "Partial Execution"
        DRY_RUN = "dry_run", "Dry Run"
        FAILED = "failed", "Failed"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trigger = models.CharField(max_length=32, choices=TriggerType.choices, default=TriggerType.AUTOMATED_CRON)
    operator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="executed_data_purges",
    )
    accounts_erased = models.PositiveIntegerField(default=0)
    audio_files_purged = models.PositiveIntegerField(default=0)
    stale_otps_purged = models.PositiveIntegerField(default=0)
    stale_exports_purged = models.PositiveIntegerField(default=0)
    duration_ms = models.PositiveIntegerField(default=0)
    details = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=24, choices=Status.choices, default=Status.COMPLETED)
    executed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-executed_at",)

    def __str__(self) -> str:
        return f"DataPurgeLog<{self.trigger}:{self.status} at {self.executed_at}>"

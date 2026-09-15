from __future__ import annotations

import uuid
from django.conf import settings
from django.db import models


class GoldenFlowStatus(models.TextChoices):
    PASS = "PASS", "تأیید کامل"
    WARN = "WARN", "هشدار غیربحرانی"
    FAIL = "FAIL", "رد شده"


class GoldenFlowVerificationLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    operator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="golden_flow_rehearsals",
    )
    total_flows = models.PositiveIntegerField(default=7)
    passed_flows = models.PositiveIntegerField(default=7)
    duration_ms = models.PositiveIntegerField(default=0)
    status = models.CharField(
        max_length=16,
        choices=GoldenFlowStatus.choices,
        default=GoldenFlowStatus.PASS,
        db_index=True,
    )
    score = models.PositiveIntegerField(default=100)
    flow_results = models.JSONField(default=list, blank=True)
    rehearsed_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ("-rehearsed_at",)

    def __str__(self) -> str:
        return f"GoldenFlowLog<{self.status} {self.score}% at {self.rehearsed_at}>"


class ProductionLaunchSignoff(models.Model):
    class Status(models.TextChoices):
        APPROVED = "APPROVED", "تأیید نهایی انتشار (Production Approved)"
        CONDITIONAL = "CONDITIONAL", "تأیید مشروط (Conditional Approval)"
        REVOKED = "REVOKED", "لغو مجوز انتشار (Launch Revoked)"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    authorized_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="production_signoffs",
    )
    engineer_name = models.CharField(max_length=255)
    role = models.CharField(max_length=100, default="Principal Launch Architect")
    checklist_version = models.CharField(max_length=64, default="day60-launch-v1.0")
    status = models.CharField(
        max_length=32,
        choices=Status.choices,
        default=Status.APPROVED,
        db_index=True,
    )
    verification_score = models.PositiveIntegerField(default=100)
    confirmation_hash = models.CharField(max_length=64, blank=True, default="")
    notes = models.TextField(blank=True, default="")
    signed_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ("-signed_at",)

    def __str__(self) -> str:
        return f"Signoff<{self.engineer_name}: {self.status} score={self.verification_score}>"

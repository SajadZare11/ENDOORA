from __future__ import annotations

import uuid
from django.conf import settings
from django.db import models


class Notification(models.Model):
    class Category(models.TextChoices):
        LEARNING = "LEARNING", "یادگیری و تمارین"
        ASSIGNMENT = "ASSIGNMENT", "تکالیف و آزمون‌ها"
        SECURITY = "SECURITY", "امنیت و حساب کاربری"
        FINANCIAL = "FINANCIAL", "تراکنش‌های مالی و کیف پول"
        SYSTEM = "SYSTEM", "اطلاعیه‌های سیستم"

    class Channel(models.TextChoices):
        IN_APP = "IN_APP", "درون‌برنامه‌ای"
        SMS = "SMS", "پیامک ایران"
        EMAIL = "EMAIL", "ایمیل"

    class Status(models.TextChoices):
        PENDING = "PENDING", "در انتظار"
        SENT = "SENT", "ارسال شده"
        DELIVERED = "DELIVERED", "تحویل شده"
        READ = "READ", "خوانده شده"
        FAILED = "FAILED", "ناموفق"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    category = models.CharField(
        max_length=24,
        choices=Category.choices,
        default=Category.SYSTEM,
    )
    channel = models.CharField(
        max_length=16,
        choices=Channel.choices,
        default=Channel.IN_APP,
    )
    status = models.CharField(
        max_length=16,
        choices=Status.choices,
        default=Status.DELIVERED,
    )
    action_url = models.CharField(max_length=255, blank=True, default="")
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=["recipient", "status", "-created_at"]),
        ]

    def __str__(self) -> str:
        return f"Notification<{self.recipient_id}: {self.title} [{self.status}]>"


class NotificationPreference(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notification_preferences",
    )
    in_app_enabled = models.BooleanField(default=True)
    sms_enabled = models.BooleanField(default=True)
    email_enabled = models.BooleanField(default=True)
    learning_updates = models.BooleanField(default=True)
    assignment_alerts = models.BooleanField(default=True)
    financial_receipts = models.BooleanField(default=True)
    security_warnings = models.BooleanField(default=True)
    marketing_promotions = models.BooleanField(default=False)
    phone_number_verified = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-updated_at",)

    def __str__(self) -> str:
        return f"NotificationPreference<{self.user_id}>"


class SMSDeliveryLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient_phone = models.CharField(max_length=32)
    template_name = models.CharField(max_length=64, default="general_notice")
    pattern_tokens = models.JSONField(default=dict, blank=True)
    provider = models.CharField(max_length=64, default="Kavenegar")
    provider_message_id = models.CharField(max_length=64, blank=True, default="")
    delivery_status = models.CharField(max_length=24, default="DELIVERED")
    cost_rials = models.IntegerField(default=1200)
    dispatched_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ("-dispatched_at",)

    def __str__(self) -> str:
        return f"SMSDeliveryLog<{self.recipient_phone}: {self.delivery_status} via {self.provider}>"

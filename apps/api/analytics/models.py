from __future__ import annotations

import uuid
from django.conf import settings
from django.db import models
from django.utils import timezone


class ProductAnalyticsEvent(models.Model):
    class Category(models.TextChoices):
        AUTH = "auth", "Authentication & Identity"
        ONBOARDING = "onboarding", "Onboarding & Role Choice"
        PLACEMENT = "placement", "Diagnostic & Placement"
        LEARNING = "learning", "Daily Missions & SRS"
        TEACHER = "teacher", "Teacher Workspace & Marketplace"
        COMMERCE = "commerce", "Checkout & Financial"
        ROUTE = "route", "Route Views & Navigation"

    class DeviceCategory(models.TextChoices):
        DESKTOP = "desktop", "Desktop Browser"
        MOBILE = "mobile", "Mobile Device"
        TABLET = "tablet", "Tablet Device"
        BOT = "bot", "Search Bot / Crawler"
        UNKNOWN = "unknown", "Unknown Device"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event_name = models.CharField(max_length=64, db_index=True)
    category = models.CharField(
        max_length=32,
        choices=Category.choices,
        default=Category.ROUTE,
        db_index=True,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="analytics_events",
        db_index=True,
    )
    session_id = models.CharField(max_length=64, blank=True, default="", db_index=True)
    properties = models.JSONField(default=dict, blank=True)
    client_ip_hash = models.CharField(max_length=64, blank=True, default="")
    user_agent_category = models.CharField(
        max_length=16,
        choices=DeviceCategory.choices,
        default=DeviceCategory.DESKTOP,
    )
    locale = models.CharField(max_length=8, default="fa")
    created_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=["event_name", "created_at"]),
            models.Index(fields=["category", "created_at"]),
            models.Index(fields=["user", "created_at"]),
        ]

    def __str__(self) -> str:
        user_label = str(self.user_id) if self.user_id else "anonymous"
        return f"AnalyticsEvent<{self.event_name} by {user_label} at {self.created_at}>"


class FunnelDefinition(models.Model):
    class FunnelCategory(models.TextChoices):
        ONBOARDING = "onboarding", "User Onboarding & Signup"
        PLACEMENT = "placement", "Placement & Activation"
        MONETIZATION = "monetization", "Teacher Booking & Commerce"
        RETENTION = "retention", "Daily Learning Retention"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(max_length=64, unique=True, db_index=True)
    name_fa = models.CharField(max_length=128)
    name_en = models.CharField(max_length=128)
    description_fa = models.TextField(blank=True, default="")
    description_en = models.TextField(blank=True, default="")
    category = models.CharField(
        max_length=32,
        choices=FunnelCategory.choices,
        default=FunnelCategory.ONBOARDING,
    )
    steps = models.JSONField(
        default=list,
        help_text="Ordered list of step definitions with event_name, name_fa, name_en, step_index",
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("created_at",)

    def __str__(self) -> str:
        return f"FunnelDefinition<{self.slug} ({self.name_en})>"


class DailyAnalyticsRollup(models.Model):
    class MetricType(models.TextChoices):
        DAU = "dau", "Daily Active Users"
        WAU = "wau", "Weekly Active Users"
        MAU = "mau", "Monthly Active Users"
        STICKINESS = "stickiness", "DAU/MAU Stickiness Ratio"
        TOTAL_EVENTS = "total_events", "Total Telemetry Events"
        RETENTION_D1 = "retention_d1", "Day 1 Retention"
        RETENTION_D7 = "retention_d7", "Day 7 Retention"
        RETENTION_D14 = "retention_d14", "Day 14 Retention"
        RETENTION_D30 = "retention_d30", "Day 30 Retention"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date = models.DateField(db_index=True)
    metric_type = models.CharField(
        max_length=32,
        choices=MetricType.choices,
        db_index=True,
    )
    dimension = models.CharField(max_length=64, default="all", db_index=True)
    value = models.FloatField(default=0.0)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ("-date", "metric_type")
        unique_together = ("date", "metric_type", "dimension")

    def __str__(self) -> str:
        return f"DailyRollup<{self.date} {self.metric_type}:{self.dimension} = {self.value}>"

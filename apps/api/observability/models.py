from __future__ import annotations

import uuid
from django.conf import settings
from django.db import models


class SystemMetricSnapshot(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    uptime_percentage = models.FloatField(default=99.85)
    p50_latency_ms = models.FloatField(default=42.0)
    p95_latency_ms = models.FloatField(default=185.0)
    p99_latency_ms = models.FloatField(default=340.0)
    requests_per_second = models.FloatField(default=142.5)
    error_rate_percentage = models.FloatField(default=0.15)
    db_pool_active = models.IntegerField(default=18)
    db_pool_available = models.IntegerField(default=82)
    redis_hit_ratio = models.FloatField(default=96.4)
    worker_queue_depth = models.IntegerField(default=4)
    worker_active_tasks = models.IntegerField(default=12)
    active_alerts_count = models.IntegerField(default=0)

    class Meta:
        ordering = ("-timestamp",)
        indexes = [
            models.Index(fields=["-timestamp"]),
        ]

    def __str__(self) -> str:
        return f"SystemMetricSnapshot<{self.timestamp}: p95={self.p95_latency_ms}ms, err={self.error_rate_percentage}%>"


class DistributedTraceRecord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trace_id = models.CharField(max_length=64, db_index=True)
    span_id = models.CharField(max_length=64)
    parent_span_id = models.CharField(max_length=64, blank=True, null=True)
    service_name = models.CharField(max_length=64, default="django-api")
    operation_name = models.CharField(max_length=128)
    duration_ms = models.FloatField()
    status = models.CharField(max_length=16, default="OK")  # OK, ERROR, WARNING
    http_method = models.CharField(max_length=10, blank=True, default="GET")
    http_status = models.IntegerField(default=200)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=["trace_id"]),
            models.Index(fields=["-created_at"]),
        ]

    def __str__(self) -> str:
        return f"TraceSpan<{self.service_name}:{self.operation_name} ({self.duration_ms}ms) [{self.status}]>"


class IncidentAlert(models.Model):
    class Severity(models.TextChoices):
        CRITICAL = "CRITICAL", "Critical"
        HIGH = "HIGH", "High"
        MEDIUM = "MEDIUM", "Medium"
        LOW = "LOW", "Low"
        INFO = "INFO", "Info"

    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        ACKNOWLEDGED = "ACKNOWLEDGED", "Acknowledged"
        RESOLVED = "RESOLVED", "Resolved"

    class Component(models.TextChoices):
        API = "API", "API Gateway"
        DATABASE = "DATABASE", "PostgreSQL Cluster"
        REDIS = "REDIS", "Redis Cache / Sentinel"
        AI_GATEWAY = "AI_GATEWAY", "AI Model Gateway"
        WORKER = "WORKER", "Async Task Workers"
        NETWORK = "NETWORK", "CDN / Network Edge"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=128)
    title_fa = models.CharField(max_length=255)
    severity = models.CharField(max_length=16, choices=Severity.choices, default=Severity.MEDIUM)
    component = models.CharField(max_length=16, choices=Component.choices, default=Component.API)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.ACTIVE)
    details = models.TextField(blank=True, default="")
    threshold_breach = models.CharField(max_length=128, blank=True, default="")
    triggered_at = models.DateTimeField(auto_now_add=True, db_index=True)
    acknowledged_at = models.DateTimeField(null=True, blank=True)
    acknowledged_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="acknowledged_incident_alerts",
    )
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ("-triggered_at",)
        indexes = [
            models.Index(fields=["status", "-triggered_at"]),
        ]

    def __str__(self) -> str:
        return f"IncidentAlert<{self.severity}:{self.component} - {self.title} [{self.status}]>"

import uuid

from django.conf import settings
from django.db import models


class PlacementSession(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("submitted", "Submitted"),
        ("expired", "Expired"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="placement_sessions",
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    current_section = models.CharField(max_length=50, default="grammar")
    started_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField()

    def __str__(self):
        return f"{self.user_id} - {self.status}"


class PlacementAnswer(models.Model):
    idempotency_key = models.UUIDField(default=uuid.uuid4, unique=True)
    session = models.ForeignKey(
        PlacementSession,
        on_delete=models.CASCADE,
        related_name="answers",
    )
    question_key = models.CharField(max_length=100)
    answer_value = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("session", "question_key")

from __future__ import annotations

import uuid
from django.conf import settings
from django.db import models
from django.utils import timezone


class LearnerActivity(models.Model):
    class ActivityCategory(models.TextChoices):
        COURSE = "course", "Course & Lesson"
        GRAMMAR = "grammar", "Grammar & Structure"
        VOCABULARY = "vocabulary", "Vocabulary & SRS"
        SPEAKING = "speaking", "Speaking & Roleplay"
        LISTENING = "listening", "Listening Lab"
        WRITING = "writing", "Writing & Mentor"
        PLACEMENT = "placement", "Diagnostic & Placement"
        EXAM = "exam", "Online Exam & Quiz"
        BOOKING = "booking", "Teacher Class & Booking"
        MEMBERSHIP = "membership", "Plan & Subscription"
        GAMIFICATION = "gamification", "XP, Badges & Streaks"
        GENERAL = "general", "General Activity"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="learner_activities",
        db_index=True,
    )
    activity_type = models.CharField(max_length=64, db_index=True)
    title_fa = models.CharField(max_length=255)
    title_en = models.CharField(max_length=255, blank=True, default="")
    description_fa = models.TextField(blank=True, default="")
    description_en = models.TextField(blank=True, default="")
    category = models.CharField(
        max_length=32,
        choices=ActivityCategory.choices,
        default=ActivityCategory.GENERAL,
        db_index=True,
    )
    badge_text_fa = models.CharField(max_length=64, blank=True, default="")
    badge_text_en = models.CharField(max_length=64, blank=True, default="")
    icon = models.CharField(max_length=16, default="⚡")
    link = models.CharField(max_length=255, blank=True, default="")
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=["user", "-created_at"]),
            models.Index(fields=["category", "-created_at"]),
        ]

    def __str__(self) -> str:
        return f"{self.user.email} - {self.title_fa} ({self.created_at})"

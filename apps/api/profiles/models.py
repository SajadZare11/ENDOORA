from django.db import models

import uuid

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class LearnerProfile(models.Model):
    class Goal(models.TextChoices):
        GENERAL_ENGLISH = "general_english", "General English"
        CONVERSATION = "conversation", "Conversation"
        IELTS = "ielts", "IELTS"
        ACADEMIC = "academic", "Academic English"
        WORK = "work", "Work and career"
        TRAVEL = "travel", "Travel"
        SCHOOL = "school", "School English"
        OTHER = "other", "Other"

    class AgeBand(models.TextChoices):
        UNDER_13 = "under_13", "Under 13"
        AGE_13_15 = "13_15", "13-15"
        AGE_16_17 = "16_17", "16-17"
        AGE_18_24 = "18_24", "18-24"
        AGE_25_34 = "25_34", "25-34"
        AGE_35_44 = "35_44", "35-44"
        AGE_45_PLUS = "45_plus", "45+"
        PREFER_NOT_TO_SAY = "prefer_not", "Prefer not to say"

    class CurrentEstimate(models.TextChoices):
        UNKNOWN = "unknown", "I don't know"
        A1 = "A1", "A1"
        A2 = "A2", "A2"
        B1 = "B1", "B1"
        B2 = "B2", "B2"
        C1 = "C1", "C1"
        C2 = "C2", "C2"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="learner_profile",
    )

    goal = models.CharField(
        max_length=32,
        choices=Goal.choices,
        blank=True,
    )

    age_band = models.CharField(
        max_length=16,
        choices=AgeBand.choices,
        blank=True,
    )

    current_estimate = models.CharField(
        max_length=16,
        choices=CurrentEstimate.choices,
        default=CurrentEstimate.UNKNOWN,
    )

    preferred_daily_minutes = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        validators=[
            MinValueValidator(5),
            MaxValueValidator(240),
        ],
    )

    preferred_days = models.JSONField(
        default=list,
        blank=True,
    )

    timezone = models.CharField(
        max_length=64,
        default="Asia/Tehran",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-updated_at",)

    def __str__(self) -> str:
        return f"LearnerProfile<{self.user_id}>"

    @property
    def completeness_percent(self) -> int:
        checks = (
            bool(self.goal),
            bool(self.age_band),
            bool(self.current_estimate),
            self.preferred_daily_minutes is not None,
            bool(self.preferred_days),
            bool(self.timezone),
        )

        completed = sum(checks)
        return round((completed / len(checks)) * 100)


class TeacherProfile(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="teacher_profile",
    )

    public_name = models.CharField(
        max_length=120,
        blank=True,
    )

    bio = models.TextField(
        max_length=1500,
        blank=True,
    )

    experience_years = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(70),
        ],
    )

    specialties = models.JSONField(
        default=list,
        blank=True,
    )

    city = models.CharField(
        max_length=120,
        blank=True,
    )

    languages = models.JSONField(
        default=list,
        blank=True,
    )

    availability_intent = models.BooleanField(default=False)
    verification_intent = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("public_name", "user_id")

    def __str__(self) -> str:
        return self.public_name or f"TeacherProfile<{self.user_id}>"

    @property
    def completeness_percent(self) -> int:
        checks = (
            bool(self.public_name),
            bool(self.bio),
            self.experience_years is not None,
            bool(self.specialties),
            bool(self.city),
            bool(self.languages),
        )

        completed = sum(checks)
        return round((completed / len(checks)) * 100)


class OnboardingProgress(models.Model):
    class Role(models.TextChoices):
        LEARNER = "learner", "Learner"
        TEACHER = "teacher", "Teacher"

    class Stage(models.TextChoices):
        ROLE = "role", "Role"
        BASIC_PROFILE = "basic_profile", "Basic profile"
        PREFERENCES = "preferences", "Preferences"
        CONSENT = "consent", "Consent"
        REVIEW = "review", "Review"
        COMPLETED = "completed", "Completed"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="onboarding_progress",
    )

    role = models.CharField(
        max_length=16,
        choices=Role.choices,
    )

    stage = models.CharField(
        max_length=32,
        choices=Stage.choices,
        default=Stage.ROLE,
    )

    current_step = models.PositiveSmallIntegerField(default=1)

    completed_steps = models.JSONField(
        default=list,
        blank=True,
    )

    # Only temporary onboarding fields belong here.
    # Identity documents, passwords, OTPs and secrets must never be stored here.
    draft_data = models.JSONField(
        default=dict,
        blank=True,
    )

    completed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-updated_at",)

    def __str__(self) -> str:
        return f"Onboarding<{self.user_id}:{self.role}:{self.stage}>"

    @property
    def is_completed(self) -> bool:
        return (
            self.stage == self.Stage.COMPLETED
            and self.completed_at is not None
        )


class DataExportRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PROCESSING = "processing", "Processing"
        COMPLETED = "completed", "Completed"
        FAILED = "failed", "Failed"
        CANCELLED = "cancelled", "Cancelled"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="data_export_requests",
    )

    status = models.CharField(
        max_length=16,
        choices=Status.choices,
        default=Status.PENDING,
    )

    requested_at = models.DateTimeField(auto_now_add=True)

    processing_started_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    completed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    failure_code = models.CharField(
        max_length=64,
        blank=True,
    )

    class Meta:
        ordering = ("-requested_at",)
        indexes = [
            models.Index(
                fields=("user", "status", "requested_at"),
                name="profiles_export_lookup_idx",
            ),
        ]

    def __str__(self) -> str:
        return f"DataExport<{self.user_id}:{self.status}>"

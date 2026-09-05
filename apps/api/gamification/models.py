from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models


class XPCategory(models.TextChoices):
    MISSION = "mission", "Daily Mission Step"
    ROLEPLAY = "roleplay", "Roleplay Scenario Completion"
    SRS = "srs", "SRS Vocabulary Review"
    PRONUNCIATION = "pronunciation", "Pronunciation Lab Practice"
    WRITING = "writing", "Writing Mentor Submission"
    PLACEMENT = "placement", "Placement Diagnostic Section"
    STREAK_BONUS = "streak_bonus", "Streak Consistency Reward"
    SYSTEM_ADJUSTMENT = "system_adjustment", "Compensatory Adjustment"


class XPTransaction(models.Model):
    """
    Immutable ledger entry for learner experience points (XP).
    Financial-grade ledger: strictly append-only, with unique idempotency keys
    (source_event) preventing duplicate awards or network replay attacks.
    """

    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="xp_transactions",
    )
    amount = models.IntegerField(help_text="Points awarded (positive) or reversal (negative)")
    category = models.CharField(
        max_length=64,
        choices=XPCategory.choices,
        default=XPCategory.MISSION,
    )
    reason = models.CharField(max_length=255)
    source_event = models.CharField(
        max_length=255,
        unique=True,
        db_index=True,
        help_text="Unique event idempotency key e.g. mission:2026-09-05:step:2:user:1",
    )
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "XP Transaction"
        verbose_name_plural = "XP Transactions"

    def __str__(self):
        sign = "+" if self.amount >= 0 else ""
        return f"{sign}{self.amount} XP [{self.category}] for {self.learner_id} ({self.source_event})"

    def save(self, *args, **kwargs):
        if self.pk:
            raise ValidationError("XP transactions are immutable financial records and cannot be updated.")
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValidationError("XP transactions cannot be deleted; compensatory adjustments must be used.")

    @property
    def learner_id(self) -> int:
        return self.learner_id or self.learner.id


class LearnerStreak(models.Model):
    """
    Tracks daily learning consistency and streak records calculated in Asia/Tehran timezone.
    Includes freeze credit grace periods to support calm learning (Product Constitution Rule #7).
    """

    learner = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="streak_record",
    )
    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)
    last_activity_date = models.DateField(null=True, blank=True)
    freeze_credits = models.PositiveIntegerField(
        default=1,
        help_text="Grace freeze protections available to protect against accidental streak breakage",
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Learner Streak"
        verbose_name_plural = "Learner Streaks"

    def __str__(self):
        return f"Streak: {self.current_streak} days (Longest: {self.longest_streak}) for Learner {self.learner_id}"


class LearnerLevel(models.Model):
    """
    Cached learner progression level and total cumulative XP.
    Complies with Product Constitution Rule #8: levels indicate educational dedication,
    not official accredited CEFR certification.
    """

    learner = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="level_record",
    )
    current_level = models.PositiveIntegerField(default=1)
    total_xp = models.PositiveIntegerField(default=0)
    level_title_fa = models.CharField(max_length=128, default="کاوشگر نوآموز")
    level_title_en = models.CharField(max_length=128, default="Novice Explorer")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Learner Level"
        verbose_name_plural = "Learner Levels"

    def __str__(self):
        return f"Level {self.current_level} ({self.level_title_en}) - {self.total_xp} XP"

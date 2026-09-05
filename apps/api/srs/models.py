from datetime import timedelta
from django.conf import settings
from django.db import models
from django.utils import timezone


class SrsCandidate(models.Model):
    """Extracted candidate vocabulary item pending learner review (save/ignore)."""

    STATUS_CHOICES = [
        ("pending", "pending"),
        ("approved", "approved"),
        ("ignored", "ignored"),
    ]

    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="srs_candidates",
    )
    term = models.CharField(max_length=120)
    lemma = models.CharField(max_length=120)
    part_of_speech = models.CharField(max_length=40, blank=True, default="unknown")
    meaning_fa = models.CharField(max_length=255, blank=True)
    example_sentence = models.TextField(blank=True)
    source_text = models.TextField(blank=True)
    source_type = models.CharField(max_length=50, blank=True, default="activity")
    source_id = models.CharField(max_length=100, blank=True)
    phonetic = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["learner", "status"]),
            models.Index(fields=["learner", "lemma"]),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.term} ({self.status}) for {self.learner_id}"


class SrsItem(models.Model):
    """Vocabulary review item created from real learner activity."""

    STATUS_CHOICES = [
        ("new", "new"),
        ("learning", "learning"),
        ("review", "review"),
        ("mastered", "mastered"),
    ]

    LEECH_LAPSE_THRESHOLD = 4

    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="srs_items",
    )
    term = models.CharField(max_length=120)
    lemma = models.CharField(max_length=120, blank=True)
    part_of_speech = models.CharField(max_length=40, blank=True, default="unknown")
    sense_id = models.CharField(max_length=100, blank=True)
    meaning_fa = models.CharField(max_length=255)
    example_sentence = models.TextField(blank=True)
    collocation_fa = models.CharField(max_length=255, blank=True)
    collocation_en = models.CharField(max_length=255, blank=True)
    phonetic = models.CharField(max_length=100, blank=True)
    audio_url = models.CharField(max_length=255, blank=True)
    source_text = models.TextField(blank=True)
    source_type = models.CharField(max_length=50, blank=True, default="activity")
    objective_id = models.CharField(max_length=120, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new")
    interval_days = models.PositiveIntegerField(default=1)
    repetition = models.PositiveIntegerField(default=0)
    ease_factor = models.FloatField(default=2.5)
    lapse_count = models.PositiveIntegerField(default=0)
    is_leech = models.BooleanField(default=False)
    leech_action = models.CharField(max_length=50, blank=True)
    due_at = models.DateTimeField()
    last_reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["learner", "due_at"]),
            models.Index(fields=["learner", "is_leech"]),
            models.Index(fields=["learner", "status"]),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["learner", "lemma", "part_of_speech"],
                name="unique_learner_lemma_pos",
            )
        ]
        ordering = ["due_at"]

    def __str__(self):
        return f"{self.term} (due {self.due_at})"

    def save(self, *args, **kwargs):
        if not self.lemma and self.term:
            self.lemma = self.term.strip().lower()
        super().save(*args, **kwargs)

    def calculate_next_intervals(self) -> dict:
        """Transparent interval calculations for all four ratings."""
        prev = self.interval_days
        ef = self.ease_factor
        rep = self.repetition

        # Again (Rating 1): Reset to 1 day
        again_interval = 1

        # Hard (Rating 2): 1.2x previous interval, minimum 1
        hard_interval = max(1, round(prev * 1.2))

        # Good (Rating 3): Standard SM-2 progression
        if rep == 0:
            good_interval = 1
        elif rep == 1:
            good_interval = 3
        else:
            good_interval = max(1, round(prev * ef))

        # Easy (Rating 4): Accelerated SM-2
        if rep == 0:
            easy_interval = 2
        elif rep == 1:
            easy_interval = 5
        else:
            easy_interval = max(good_interval + 1, round(prev * ef * 1.3))

        return {
            "again": again_interval,
            "hard": hard_interval,
            "good": good_interval,
            "easy": easy_interval,
        }


class SrsReview(models.Model):
    """Record of a single review attempt for learning analytics and SM-2 calibration."""

    item = models.ForeignKey(SrsItem, on_delete=models.CASCADE, related_name="reviews")
    rating = models.PositiveSmallIntegerField(
        help_text="1=Again, 2=Hard, 3=Good, 4=Easy (or 5 for legacy)"
    )
    previous_interval_days = models.PositiveIntegerField(default=1)
    new_interval_days = models.PositiveIntegerField(default=1)
    previous_ease_factor = models.FloatField(default=2.5)
    new_ease_factor = models.FloatField(default=2.5)
    response_time_ms = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Review {self.item.term}: rating {self.rating} at {self.created_at}"

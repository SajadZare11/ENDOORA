from django.conf import settings
from django.db import models


class SrsItem(models.Model):
    """Vocabulary review item created from real learner activity."""

    STATUS_CHOICES = [
        ("new", "new"),
        ("learning", "learning"),
        ("review", "review"),
        ("mastered", "mastered"),
    ]

    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="srs_items",
    )
    term = models.CharField(max_length=120)
    meaning_fa = models.CharField(max_length=255)
    objective_id = models.CharField(max_length=120, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new")
    interval_days = models.PositiveIntegerField(default=1)
    repetition = models.PositiveIntegerField(default=0)
    ease_factor = models.FloatField(default=2.5)
    due_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [models.Index(fields=["learner", "due_at"])]


class SrsReview(models.Model):
    item = models.ForeignKey(SrsItem, on_delete=models.CASCADE, related_name="reviews")
    rating = models.PositiveSmallIntegerField()
    previous_interval_days = models.PositiveIntegerField(default=1)
    new_interval_days = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

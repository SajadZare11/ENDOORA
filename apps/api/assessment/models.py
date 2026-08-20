from django.db import models


class PlacementSection(models.TextChoices):
    GRAMMAR = "grammar", "Grammar"
    VOCABULARY = "vocabulary", "Vocabulary"
    READING = "reading", "Reading"


class PlacementResponse(models.Model):
    user_id = models.UUIDField()
    section = models.CharField(max_length=32, choices=PlacementSection.choices)
    item_id = models.UUIDField()
    answer = models.JSONField(default=dict)
    is_correct = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["user_id", "section"]),
        ]

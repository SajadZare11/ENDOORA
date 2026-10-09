from django.db import models


class PlacementSection(models.TextChoices):
    GRAMMAR = "grammar", "Grammar"
    VOCABULARY = "vocabulary", "Vocabulary"
    READING = "reading", "Reading"
    LISTENING = "listening", "Listening"
    SPEAKING = "speaking", "Speaking"
    WRITING = "writing", "Writing"


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

from django.db import models


class ListeningAttempt(models.Model):
    user_id = models.UUIDField()
    section = models.CharField(max_length=32, default="listening")
    audio_asset_id = models.UUIDField(null=True, blank=True)
    transcript_version = models.CharField(max_length=64, default="v1")
    response = models.JSONField(default=dict)
    score = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class AITextInteraction(models.Model):
    user_id = models.UUIDField()
    prompt_type = models.CharField(max_length=64)
    learner_input = models.TextField()
    ai_output = models.TextField()
    limitation_notice = models.TextField(default="AI feedback is educational support, not a certified assessment.")
    created_at = models.DateTimeField(auto_now_add=True)

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

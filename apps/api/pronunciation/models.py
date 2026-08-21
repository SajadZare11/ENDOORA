from django.db import models
class PronunciationAttempt(models.Model):
 learner_id=models.IntegerField()
 transcript=models.TextField(blank=True)
 speech_rate=models.FloatField(default=0)
 pauses=models.IntegerField(default=0)
 confidence=models.FloatField(default=0)

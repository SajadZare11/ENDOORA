from django.db import models

class LearnerMistake(models.Model):
    learner_id=models.IntegerField()
    skill=models.CharField(max_length=100)
    category=models.CharField(max_length=100)
    count=models.PositiveIntegerField(default=1)
    last_seen=models.DateTimeField(auto_now=True)

class MistakePattern(models.Model):
    learner_id=models.IntegerField()
    pattern=models.CharField(max_length=255)
    explanation=models.TextField(blank=True)
    confidence=models.FloatField(default=0.0)

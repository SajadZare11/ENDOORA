from django.db import models
class ListeningAttempt(models.Model):
    learner_id=models.IntegerField()
    skill=models.CharField(max_length=100)
    score=models.FloatField(default=0)
    created_at=models.DateTimeField(auto_now_add=True)

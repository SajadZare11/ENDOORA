from django.db import models
class AudioAttempt(models.Model):
    learner_id=models.IntegerField()
    status=models.CharField(max_length=50,default='pending')
    created_at=models.DateTimeField(auto_now_add=True)

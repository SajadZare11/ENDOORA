from django.db import models
class XPTransaction(models.Model):
 learner_id=models.IntegerField()
 amount=models.IntegerField()
 reason=models.CharField(max_length=100)
 source_event=models.CharField(max_length=200,unique=True)
 created_at=models.DateTimeField(auto_now_add=True)

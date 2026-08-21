import uuid
from django.conf import settings
from django.db import models

class DailyMission(models.Model):
    class Status(models.TextChoices):
        READY="ready","Ready"
        IN_PROGRESS="in_progress","In progress"
        COMPLETED="completed","Completed"

    id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="daily_missions")
    mission_date=models.DateField()
    title_fa=models.CharField(max_length=200)
    title_en=models.CharField(max_length=200)
    explanation_fa=models.TextField()
    explanation_en=models.TextField()
    evidence_reason=models.JSONField(default=dict)
    status=models.CharField(max_length=20,choices=Status.choices,default=Status.READY)
    created_at=models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together=("user","mission_date")
        ordering=("-mission_date",)

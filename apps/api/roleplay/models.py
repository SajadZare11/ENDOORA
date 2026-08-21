from django.db import models

class ConversationSession(models.Model):
    learner_id=models.IntegerField()
    title=models.CharField(max_length=200)
    created_at=models.DateTimeField(auto_now_add=True)

class ConversationMessage(models.Model):
    session=models.ForeignKey(ConversationSession,on_delete=models.CASCADE)
    role=models.CharField(max_length=20)
    content=models.TextField()

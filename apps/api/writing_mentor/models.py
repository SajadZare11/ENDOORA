from django.db import models

class WritingSubmission(models.Model):
    learner_id = models.IntegerField()
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class WritingFeedback(models.Model):
    submission = models.ForeignKey(WritingSubmission, on_delete=models.CASCADE)
    strengths = models.TextField(blank=True)
    improvements = models.TextField(blank=True)
    limitations = models.TextField(blank=True)

from django.db import models

class AIProviderConfig(models.Model):
    name = models.CharField(max_length=100, unique=True)
    provider = models.CharField(max_length=50, default="openrouter")
    enabled = models.BooleanField(default=False)

class AIRequestLog(models.Model):
    feature = models.CharField(max_length=100)
    model = models.CharField(max_length=200)
    success = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

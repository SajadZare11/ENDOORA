from django.db import models
class Badge(models.Model):
 name=models.CharField(max_length=100)
class Challenge(models.Model):
 title=models.CharField(max_length=200)

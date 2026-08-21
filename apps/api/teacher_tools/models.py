from django.db import models
class TeacherResource(models.Model):
 title=models.CharField(max_length=200)
 status=models.CharField(max_length=50,default='draft')

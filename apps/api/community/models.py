from django.db import models
class CommunityPost(models.Model):
 author_id=models.IntegerField()
 content=models.TextField()
 status=models.CharField(max_length=50,default='active')
class Report(models.Model):
 post=models.ForeignKey(CommunityPost,on_delete=models.CASCADE)
 reason=models.CharField(max_length=200)

from django.urls import path
from .views import WritingMentorView

urlpatterns=[path('review/', WritingMentorView.as_view())]

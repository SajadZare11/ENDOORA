from django.urls import path
from .views import VoiceView
urlpatterns=[path('status/',VoiceView.as_view())]

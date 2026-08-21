from django.urls import path
from .views import TodayMissionView

urlpatterns=[
    path("today/",TodayMissionView.as_view(),name="today-mission")
]

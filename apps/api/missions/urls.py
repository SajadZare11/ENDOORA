from django.urls import path
from .views import (
    TodayMissionView,
    StartMissionView,
    SubmitMissionStepView,
    ResetMissionView,
)

urlpatterns = [
    path("today/", TodayMissionView.as_view(), name="today-mission"),
    path("today/start/", StartMissionView.as_view(), name="start-mission"),
    path("today/submit-step/", SubmitMissionStepView.as_view(), name="submit-mission-step"),
    path("today/reset/", ResetMissionView.as_view(), name="reset-mission"),
]

from django.urls import path

from .views import (
    DashboardEventView,
    LearnerActivityListView,
    LearnerActivityRecordView,
    LearnerHomeView,
)


app_name = "dashboard"

urlpatterns = [
    path("home/", LearnerHomeView.as_view(), name="learner-home"),
    path("events/", DashboardEventView.as_view(), name="events"),
    path("activities/", LearnerActivityListView.as_view(), name="activities"),
    path("activities/record/", LearnerActivityRecordView.as_view(), name="activities-record"),
]

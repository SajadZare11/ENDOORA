from django.urls import path

from .views import DashboardEventView, LearnerHomeView


app_name = "dashboard"

urlpatterns = [
    path("home/", LearnerHomeView.as_view(), name="learner-home"),
    path("events/", DashboardEventView.as_view(), name="events"),
]

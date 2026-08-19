from django.urls import path

from .views import TeacherDashboardEventView, TeacherDashboardView


app_name = "teachers"

urlpatterns = [
    path("dashboard/", TeacherDashboardView.as_view(), name="dashboard"),
    path("dashboard/events/", TeacherDashboardEventView.as_view(), name="dashboard-events"),
]

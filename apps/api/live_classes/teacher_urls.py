from django.urls import path
from .views import (
    TeacherClaimCohortView,
    TeacherLogSessionView,
    TeacherOpenRequestsView,
)

urlpatterns = [
    path("open-requests/", TeacherOpenRequestsView.as_view(), name="teacher_open_requests"),
    path("claim/", TeacherClaimCohortView.as_view(), name="teacher_claim_cohort"),
    path("sessions/log/", TeacherLogSessionView.as_view(), name="teacher_log_session"),
    path("", TeacherLogSessionView.as_view(), name="teacher_session_log_direct"),
]

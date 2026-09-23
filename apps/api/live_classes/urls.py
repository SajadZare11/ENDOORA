from django.urls import path
from .views import (
    ClassEnrollmentRequestView,
    LearnerClassStatusView,
)

urlpatterns = [
    path("request/", ClassEnrollmentRequestView.as_view(), name="class_request"),
    path("my-status/", LearnerClassStatusView.as_view(), name="learner_class_status"),
    path("", LearnerClassStatusView.as_view(), name="learner_class_status_root"),
]

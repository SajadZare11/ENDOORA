from django.urls import path

from .views import (
    AccountSummaryView,
    DataExportRequestView,
    LearnerProfileView,
    OnboardingCompleteView,
    OnboardingProgressView,
    TeacherProfileView,
)

app_name = "profiles"

urlpatterns = [
    path(
        "learner/",
        LearnerProfileView.as_view(),
        name="learner-profile",
    ),
    path(
        "teacher/",
        TeacherProfileView.as_view(),
        name="teacher-profile",
    ),
    path(
        "onboarding/",
        OnboardingProgressView.as_view(),
        name="onboarding",
    ),
    path(
        "onboarding/complete/",
        OnboardingCompleteView.as_view(),
        name="onboarding-complete",
    ),
    path(
        "data-exports/",
        DataExportRequestView.as_view(),
        name="data-exports",
    ),
    path(
        "account-summary/",
        AccountSummaryView.as_view(),
        name="account-summary",
    ),
]

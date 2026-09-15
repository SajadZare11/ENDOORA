from __future__ import annotations

from django.urls import path

from .views import (
    IncidentDetailView,
    IncidentListCreateView,
    LaunchGateReadinessView,
    RestoreVerificationView,
    RunbookExecuteStepView,
    RunbookListView,
)

urlpatterns = [
    path("", IncidentListCreateView.as_view(), name="incident-list-create"),
    path("restore-verification/", RestoreVerificationView.as_view(), name="incident-restore-verification"),
    path("runbooks/", RunbookListView.as_view(), name="incident-runbooks-list"),
    path("runbooks/<slug:slug>/execute/", RunbookExecuteStepView.as_view(), name="incident-runbook-execute"),
    path("launch-gate/", LaunchGateReadinessView.as_view(), name="incident-launch-gate"),
    path("<uuid:pk>/", IncidentDetailView.as_view(), name="incident-detail"),
]

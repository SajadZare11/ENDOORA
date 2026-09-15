from __future__ import annotations

from django.urls import path
from .views import (
    GoldenFlowHistoryView,
    GoldenFlowRehearsalView,
    LaunchStatusView,
    ProductionSignoffView,
)

urlpatterns = [
    path("status/", LaunchStatusView.as_view(), name="launch-status"),
    path("rehearsal/", GoldenFlowRehearsalView.as_view(), name="launch-rehearsal"),
    path("signoff/", ProductionSignoffView.as_view(), name="launch-signoff"),
    path("history/", GoldenFlowHistoryView.as_view(), name="launch-history"),
]

from __future__ import annotations

from django.urls import path

from .views import (
    BatchSyncView,
    ConflictResolveView,
    DraftDetailView,
    DraftListCreateView,
    OfflineOpsTelemetryView,
)

urlpatterns = [
    path("", DraftListCreateView.as_view(), name="draft-list-create"),
    path("sync/", BatchSyncView.as_view(), name="draft-batch-sync"),
    path("<uuid:pk>/", DraftDetailView.as_view(), name="draft-detail"),
    path("<uuid:pk>/resolve/", ConflictResolveView.as_view(), name="draft-conflict-resolve"),
    path("ops/telemetry/", OfflineOpsTelemetryView.as_view(), name="draft-ops-telemetry"),
]

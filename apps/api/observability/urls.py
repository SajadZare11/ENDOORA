from __future__ import annotations

from django.urls import path
from .views import (
    DistributedTraceListView,
    IncidentAlertAcknowledgeView,
    ObservabilityOverviewView,
    SimulateLatencyDrillView,
    StructuredLogListView,
)

app_name = "observability"

urlpatterns = [
    path("overview/", ObservabilityOverviewView.as_view(), name="observability-overview"),
    path("traces/", DistributedTraceListView.as_view(), name="observability-traces"),
    path("logs/", StructuredLogListView.as_view(), name="observability-logs"),
    path("alerts/<uuid:pk>/ack/", IncidentAlertAcknowledgeView.as_view(), name="observability-alert-ack"),
    path("drill/latency/", SimulateLatencyDrillView.as_view(), name="observability-drill-latency"),
]

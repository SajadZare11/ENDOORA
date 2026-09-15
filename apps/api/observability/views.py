from __future__ import annotations

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from admin_dashboard.permissions import IsAdministratorOrStaff
from .services import telemetry_service


class ObservabilityOverviewView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def get(self, request: Request) -> Response:
        overview = telemetry_service.get_observability_overview()
        return Response(overview)


class DistributedTraceListView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def get(self, request: Request) -> Response:
        limit = int(request.query_params.get("limit", 20))
        traces = telemetry_service.get_recent_traces(limit=limit)
        return Response({"traces": traces, "count": len(traces)})


class StructuredLogListView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def get(self, request: Request) -> Response:
        limit = int(request.query_params.get("limit", 50))
        level = request.query_params.get("level")
        search = request.query_params.get("search")
        logs = telemetry_service.get_structured_logs(limit=limit, level=level, search=search)
        return Response({"logs": logs, "count": len(logs)})


class IncidentAlertAcknowledgeView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def post(self, request: Request, pk: str) -> Response:
        result = telemetry_service.acknowledge_alert(alert_id=pk, user=request.user)
        if not result.get("success"):
            return Response(result, status=status.HTTP_404_NOT_FOUND)
        return Response(result)


class SimulateLatencyDrillView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def post(self, request: Request) -> Response:
        duration = float(request.data.get("duration_ms", 480.0))
        result = telemetry_service.simulate_latency_drill(duration_spike_ms=duration)
        return Response(result)

from __future__ import annotations

import logging
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from admin_dashboard.permissions import IsAdministratorOrStaff
from .models import Incident, RestoreVerificationLog, RunbookDefinition
from .serializers import (
    IncidentSerializer,
    RestoreVerificationLogSerializer,
    RunbookDefinitionSerializer,
    RunbookExecuteRequestSerializer,
)
from .services.restore_service import RestoreVerificationService
from .services.runbook_service import RunbookService

logger = logging.getLogger(__name__)


class IncidentListCreateView(APIView):
    """List operational incidents or report a new incident."""

    permission_classes = [IsAdministratorOrStaff]

    def get(self, request):
        incidents = Incident.objects.all()
        severity = request.query_params.get("severity")
        if severity:
            incidents = incidents.filter(severity=severity)

        status_param = request.query_params.get("status")
        if status_param:
            incidents = incidents.filter(status=status_param)

        serializer = IncidentSerializer(incidents, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = IncidentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        incident = serializer.save(commander=request.user)
        return Response(IncidentSerializer(incident).data, status=status.HTTP_201_CREATED)


class IncidentDetailView(APIView):
    """Retrieve, update status, or resolve an incident."""

    permission_classes = [IsAdministratorOrStaff]

    def _get_incident(self, pk):
        return Incident.objects.filter(id=pk).first()

    def get(self, request, pk):
        incident = self._get_incident(pk)
        if not incident:
            return Response({"detail": "بحران مورد نظر یافت نشد."}, status=status.HTTP_404_NOT_FOUND)
        return Response(IncidentSerializer(incident).data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        incident = self._get_incident(pk)
        if not incident:
            return Response({"detail": "بحران مورد نظر یافت نشد."}, status=status.HTTP_404_NOT_FOUND)

        serializer = IncidentSerializer(incident, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        updated = serializer.save()
        return Response(IncidentSerializer(updated).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        incident = self._get_incident(pk)
        if not incident:
            return Response({"detail": "بحران مورد نظر یافت نشد."}, status=status.HTTP_404_NOT_FOUND)

        incident.delete()
        return Response({"detail": "بحران با موفقیت حذف شد."}, status=status.HTTP_200_OK)


class RestoreVerificationView(APIView):
    """List restore verification logs or trigger on-demand restore verification drill."""

    permission_classes = [IsAdministratorOrStaff]

    def get(self, request):
        logs = RestoreVerificationLog.objects.order_by("-verified_at")[:20]
        serializer = RestoreVerificationLogSerializer(logs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        dry_run = bool(request.data.get("dry_run", False))
        snapshot_id = request.data.get("snapshot_id")
        log = RestoreVerificationService.verify_backup_restore(
            snapshot_id=snapshot_id, dry_run=dry_run
        )
        return Response(
            RestoreVerificationLogSerializer(log).data, status=status.HTTP_201_CREATED
        )


class RunbookListView(APIView):
    """Lists official operational runbooks."""

    permission_classes = [IsAdministratorOrStaff]

    def get(self, request):
        RunbookService.sync_official_runbooks()
        runbooks = RunbookDefinition.objects.all()
        serializer = RunbookDefinitionSerializer(runbooks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RunbookExecuteStepView(APIView):
    """Simulates dry-run execution of a runbook step."""

    permission_classes = [IsAdministratorOrStaff]

    def post(self, request, slug):
        serializer = RunbookExecuteRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        step_num = serializer.validated_data["step_number"]
        result = RunbookService.execute_dry_run_step(slug=slug, step_number=step_num)
        return Response(result, status=status.HTTP_200_OK)


class LaunchGateReadinessView(APIView):
    """Returns the comprehensive Production Launch Gate assessment scorecard."""

    permission_classes = [IsAdministratorOrStaff]

    def get(self, request):
        RunbookService.sync_official_runbooks()
        scorecard = RestoreVerificationService.evaluate_launch_gate_readiness()
        return Response(scorecard, status=status.HTTP_200_OK)

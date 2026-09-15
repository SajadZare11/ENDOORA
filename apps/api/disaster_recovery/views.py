from __future__ import annotations

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from admin_dashboard.permissions import IsAdministratorOrStaff
from disaster_recovery.models import DatabaseBackupSnapshot
from disaster_recovery.serializers import (
    BackupTriggerSerializer,
    DatabaseBackupSnapshotSerializer,
)
from disaster_recovery.services.backup_service import (
    create_database_backup,
    verify_backup_snapshot,
)
from disaster_recovery.services.ha_telemetry_service import (
    get_failover_drill_checklist,
    get_ha_cluster_telemetry,
)


class DisasterRecoveryStatusView(APIView):
    """
    Returns live PostgreSQL 16 streaming replication telemetry, node topology,
    RPO/RTO SLA metrics, and backup summary (OPS-004).
    """

    permission_classes = [IsAdministratorOrStaff]

    def get(self, request) -> Response:
        telemetry = get_ha_cluster_telemetry()
        return Response(telemetry, status=status.HTTP_200_OK)


class DatabaseBackupListView(APIView):
    """
    Returns list of all encrypted database backup snapshots.
    """

    permission_classes = [IsAdministratorOrStaff]

    def get(self, request) -> Response:
        snapshots = DatabaseBackupSnapshot.objects.all()
        serializer = DatabaseBackupSnapshotSerializer(snapshots, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DatabaseBackupTriggerView(APIView):
    """
    Triggers creation of a new encrypted database backup with SHA-256 verification.
    """

    permission_classes = [IsAdministratorOrStaff]

    def post(self, request) -> Response:
        serializer = BackupTriggerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        backup_type = serializer.validated_data.get("backup_type", DatabaseBackupSnapshot.BackupType.FULL)
        verify_immediately = serializer.validated_data.get("verify_immediately", True)
        notes = serializer.validated_data.get("notes", "")

        snapshot = create_database_backup(
            backup_type=backup_type,
            operator=request.user,
            notes=notes,
        )

        verification_result = None
        if verify_immediately:
            verification_result = verify_backup_snapshot(snapshot.id, operator=request.user)
            snapshot.refresh_from_db()

        response_data = DatabaseBackupSnapshotSerializer(snapshot).data
        response_data["verification_details"] = verification_result

        return Response(response_data, status=status.HTTP_201_CREATED)


class DatabaseBackupVerifyView(APIView):
    """
    Performs on-demand cryptographic SHA-256 integrity verification of a backup snapshot.
    """

    permission_classes = [IsAdministratorOrStaff]

    def post(self, request, pk: str) -> Response:
        try:
            snapshot = DatabaseBackupSnapshot.objects.get(id=pk)
        except DatabaseBackupSnapshot.DoesNotExist:
            return Response(
                {"detail": "نسخه پشتیبان مورد نظر یافت نشد.", "code": "BACKUP_NOT_FOUND"},
                status=status.HTTP_404_NOT_FOUND,
            )

        verification_result = verify_backup_snapshot(snapshot.id, operator=request.user)
        snapshot.refresh_from_db()

        return Response(
            {
                "snapshot": DatabaseBackupSnapshotSerializer(snapshot).data,
                "verification": verification_result,
            },
            status=status.HTTP_200_OK,
        )


class DisasterRecoveryFailoverDrillView(APIView):
    """
    Returns automated failover drill runbook, simulated failover latency, and SLA verification.
    """

    permission_classes = [IsAdministratorOrStaff]

    def get(self, request) -> Response:
        drill_data = get_failover_drill_checklist()
        return Response(drill_data, status=status.HTTP_200_OK)

from __future__ import annotations

import logging
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from admin_dashboard.permissions import IsAdministratorOrStaff
from .models import OfflineDraft
from .serializers import (
    BatchSyncRequestSerializer,
    ConflictResolutionRequestSerializer,
    OfflineDraftSerializer,
)
from .services.sync_service import SyncService
from .services.telemetry_service import OfflineTelemetryService

logger = logging.getLogger(__name__)


class DraftListCreateView(APIView):
    """Lists user's active offline drafts or creates a new draft."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        drafts = OfflineDraft.objects.filter(
            user=request.user, is_archived=False
        )
        draft_type = request.query_params.get("draft_type")
        if draft_type:
            drafts = drafts.filter(draft_type=draft_type)

        resource_id = request.query_params.get("resource_id")
        if resource_id:
            drafts = drafts.filter(resource_id=resource_id)

        serializer = OfflineDraftSerializer(drafts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = OfflineDraftSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        title = serializer.validated_data.get("title", "پیش‌نویس بدون عنوان")
        content = SyncService.sanitize_draft_payload(
            serializer.validated_data.get("content_json", {})
        )
        checksum = OfflineDraft.compute_content_checksum(content)

        draft = OfflineDraft.objects.create(
            user=request.user,
            draft_type=serializer.validated_data.get("draft_type"),
            resource_id=serializer.validated_data.get("resource_id", ""),
            title=title,
            content_json=content,
            checksum=checksum,
            client_version=serializer.validated_data.get("client_version", 1),
            server_version=1,
        )
        return Response(OfflineDraftSerializer(draft).data, status=status.HTTP_201_CREATED)


class DraftDetailView(APIView):
    """Retrieve, update, or archive a specific draft."""

    permission_classes = [IsAuthenticated]

    def _get_draft(self, request, pk):
        return OfflineDraft.objects.filter(id=pk, user=request.user, is_archived=False).first()

    def get(self, request, pk):
        draft = self._get_draft(request, pk)
        if not draft:
            return Response({"detail": "پیش‌نویس یافت نشد."}, status=status.HTTP_404_NOT_FOUND)
        return Response(OfflineDraftSerializer(draft).data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        draft = self._get_draft(request, pk)
        if not draft:
            return Response({"detail": "پیش‌نویس یافت نشد."}, status=status.HTTP_404_NOT_FOUND)

        serializer = OfflineDraftSerializer(draft, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if "content_json" in serializer.validated_data:
            cleaned_content = SyncService.sanitize_draft_payload(
                serializer.validated_data["content_json"]
            )
            draft.content_json = cleaned_content
            draft.checksum = OfflineDraft.compute_content_checksum(cleaned_content)

        if "title" in serializer.validated_data:
            draft.title = SyncService.sanitize_draft_payload(serializer.validated_data["title"])

        if "client_version" in serializer.validated_data:
            draft.client_version = serializer.validated_data["client_version"]

        draft.server_version += 1
        draft.is_conflict = False
        draft.conflict_backup = {}
        draft.save()

        return Response(OfflineDraftSerializer(draft).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        draft = self._get_draft(request, pk)
        if not draft:
            return Response({"detail": "پیش‌نویس یافت نشد."}, status=status.HTTP_404_NOT_FOUND)

        draft.is_archived = True
        draft.save(update_fields=["is_archived", "server_updated_at"])
        return Response({"detail": "پیش‌نویس با موفقیت بایگانی شد."}, status=status.HTTP_200_OK)


class BatchSyncView(APIView):
    """Batch processes queued offline drafts with optimistic concurrency."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BatchSyncRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        client_user_agent = request.META.get("HTTP_USER_AGENT", "")
        metadata = {
            "sync_session_id": serializer.validated_data.get("sync_session_id"),
            "network_effective_type": serializer.validated_data.get("network_effective_type"),
            "is_low_bandwidth": serializer.validated_data.get("is_low_bandwidth"),
            "payload_bytes": serializer.validated_data.get("payload_bytes"),
            "client_user_agent": client_user_agent,
        }

        result = SyncService.process_batch_sync(
            user=request.user,
            drafts_payload=serializer.validated_data.get("drafts", []),
            metadata=metadata,
        )

        response_drafts = OfflineDraftSerializer(result["drafts"], many=True).data

        return Response(
            {
                "sync_session_id": result["sync_session_id"],
                "drafts_received": result["drafts_received"],
                "drafts_updated": result["drafts_updated"],
                "conflicts_detected": result["conflicts_detected"],
                "server_timestamp": result["server_timestamp"],
                "drafts": response_drafts,
            },
            status=status.HTTP_200_OK,
        )


class ConflictResolveView(APIView):
    """Resolves a detected concurrency conflict on a draft."""

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        serializer = ConflictResolutionRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            draft = SyncService.resolve_draft_conflict(
                user=request.user,
                draft_id=pk,
                resolution=serializer.validated_data["resolution"],
                chosen_content=serializer.validated_data.get("chosen_content"),
            )
            return Response(OfflineDraftSerializer(draft).data, status=status.HTTP_200_OK)
        except OfflineDraft.DoesNotExist:
            return Response({"detail": "پیش‌نویس یافت نشد."}, status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class OfflineOpsTelemetryView(APIView):
    """Operational resilience and PWA telemetry for administrators and operations."""

    permission_classes = [IsAdministratorOrStaff]

    def get(self, request):
        telemetry = OfflineTelemetryService.get_operations_telemetry()
        return Response(telemetry, status=status.HTTP_200_OK)

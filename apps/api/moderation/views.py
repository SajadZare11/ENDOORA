from __future__ import annotations

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.core.exceptions import PermissionDenied, ValidationError

from .models import Report, ModerationAuditLog, ModerationAction
from .serializers import (
    ReportSerializer,
    ReportCreateSerializer,
    ModerationAuditLogSerializer,
)
from .services import ModerationService


@api_view(['POST'])
@permission_classes([AllowAny])
def submit_report_view(request):
    serializer = ReportCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        report = ModerationService.submit_report(
            reporter=request.user if request.user.is_authenticated else None,
            target_type=serializer.validated_data['target_type'],
            target_id=serializer.validated_data['target_id'],
            reason=serializer.validated_data['reason'],
            description=serializer.validated_data.get('description', ''),
        )
        return Response(ReportSerializer(report).data, status=status.HTTP_201_CREATED)
    except ValidationError as e:
        return Response(e.message_dict if hasattr(e, 'message_dict') else {'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def moderation_queue_view(request):
    filter_status = request.query_params.get('status', 'pending')
    reports = ModerationService.get_moderation_queue(filter_status=filter_status)
    serializer = ReportSerializer(reports, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def resolve_report_view(request, report_id):
    action = request.data.get('action', ModerationAction.NONE)
    notes = request.data.get('notes', '')

    try:
        report = ModerationService.resolve_report(
            report_id=report_id,
            moderator=request.user,
            action=action,
            resolution_notes=notes,
        )
        return Response(ReportSerializer(report).data)
    except PermissionDenied as e:
        return Response({'detail': str(e)}, status=status.HTTP_403_FORBIDDEN)
    except ValidationError as e:
        return Response(e.message_dict if hasattr(e, 'message_dict') else {'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def moderation_audit_logs_view(request):
    logs = ModerationAuditLog.objects.select_related('actor', 'report')[:100]
    serializer = ModerationAuditLogSerializer(logs, many=True)
    return Response(serializer.data)

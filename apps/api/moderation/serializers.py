from __future__ import annotations

from rest_framework import serializers
from .models import Report, ModerationAuditLog, ReportReason, ModerationStatus, ModerationAction


class ReportCreateSerializer(serializers.Serializer):
    target_type = serializers.ChoiceField(choices=['post', 'comment'], default='post')
    target_id = serializers.CharField(max_length=64)
    reason = serializers.ChoiceField(choices=ReportReason.choices)
    description = serializers.CharField(required=False, allow_blank=True, default='')


class ReportSerializer(serializers.ModelSerializer):
    is_sla_breached = serializers.BooleanField(read_only=True)

    class Meta:
        model = Report
        fields = [
            'id',
            'reporter',
            'target_type',
            'target_id',
            'target_author_id',
            'target_content_snapshot',
            'reason',
            'description',
            'sla_hours',
            'sla_deadline',
            'is_sla_breached',
            'status',
            'assigned_to',
            'resolved_by',
            'resolved_at',
            'action_taken',
            'resolution_notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'reporter',
            'target_author_id',
            'target_content_snapshot',
            'sla_hours',
            'sla_deadline',
            'is_sla_breached',
            'status',
            'resolved_by',
            'resolved_at',
            'action_taken',
            'created_at',
            'updated_at',
        ]


class ModerationAuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModerationAuditLog
        fields = ['id', 'report', 'actor', 'action', 'target_type', 'target_id', 'details', 'created_at']
        read_only_fields = fields

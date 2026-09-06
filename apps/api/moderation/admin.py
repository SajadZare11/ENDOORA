from __future__ import annotations

from django.contrib import admin
from .models import Report, ModerationAuditLog


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'reason', 'target_type', 'target_id', 'status', 'sla_deadline', 'action_taken', 'created_at')
    list_filter = ('status', 'reason', 'action_taken')
    search_fields = ('target_id', 'description', 'target_content_snapshot')
    readonly_fields = ('created_at', 'updated_at', 'sla_deadline', 'target_content_snapshot')


@admin.register(ModerationAuditLog)
class ModerationAuditLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'actor', 'action', 'target_type', 'target_id', 'created_at')
    list_filter = ('action', 'target_type')
    readonly_fields = ('created_at',)

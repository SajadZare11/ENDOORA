from __future__ import annotations

from django.urls import path
from .views import (
    submit_report_view,
    moderation_queue_view,
    resolve_report_view,
    moderation_audit_logs_view,
)

app_name = 'moderation'

urlpatterns = [
    path('reports/', submit_report_view, name='submit_report'),
    path('queue/', moderation_queue_view, name='moderation_queue'),
    path('reports/<uuid:report_id>/resolve/', resolve_report_view, name='resolve_report'),
    path('audit-logs/', moderation_audit_logs_view, name='audit_logs'),
]

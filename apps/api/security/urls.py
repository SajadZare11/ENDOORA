from __future__ import annotations
from django.urls import path
from security.views import SecurityAuditView, SecurityHealthCheckView

urlpatterns = [
    path("audit/", SecurityAuditView.as_view(), name="security-audit"),
    path("health/", SecurityHealthCheckView.as_view(), name="security-health"),
]

from __future__ import annotations
from django.urls import path
from security.views import SecurityAuditView, SecurityHealthCheckView, SecurityScannerStatusView, SecurityScannerRunView

urlpatterns = [
    path("audit/", SecurityAuditView.as_view(), name="security-audit"),
    path("health/", SecurityHealthCheckView.as_view(), name="security-health"),
    path('scanner/status/', SecurityScannerStatusView.as_view(), name='security-scanner-status'),
    path('scanner/run/', SecurityScannerRunView.as_view(), name='security-scanner-run'),
]

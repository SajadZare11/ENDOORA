from __future__ import annotations

from django.urls import path
from disaster_recovery.views import (
    DatabaseBackupListView,
    DatabaseBackupTriggerView,
    DatabaseBackupVerifyView,
    DisasterRecoveryFailoverDrillView,
    DisasterRecoveryStatusView,
)

urlpatterns = [
    path("status/", DisasterRecoveryStatusView.as_view(), name="dr-status"),
    path("backups/", DatabaseBackupListView.as_view(), name="dr-backups-list"),
    path("backups/trigger/", DatabaseBackupTriggerView.as_view(), name="dr-backups-trigger"),
    path("backups/<uuid:pk>/verify/", DatabaseBackupVerifyView.as_view(), name="dr-backups-verify"),
    path("drill/", DisasterRecoveryFailoverDrillView.as_view(), name="dr-drill"),
]

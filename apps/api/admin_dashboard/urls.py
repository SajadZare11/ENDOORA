from django.urls import path
from .views import (
    AdminAuditLogsListView,
    AdminDashboardStatsView,
    AdminFeatureFlagsListView,
    AdminFeatureFlagToggleView,
)

urlpatterns = [
    path("stats/", AdminDashboardStatsView.as_view(), name="admin-stats"),
    path("flags/", AdminFeatureFlagsListView.as_view(), name="admin-flags-list"),
    path("flags/<slug:key>/toggle/", AdminFeatureFlagToggleView.as_view(), name="admin-flags-toggle"),
    path("audit/", AdminAuditLogsListView.as_view(), name="admin-audit-logs"),
]

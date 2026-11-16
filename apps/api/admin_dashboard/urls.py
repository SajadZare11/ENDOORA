from django.urls import path
from .views import (
    AdminAuditLogsListView,
    AdminUsersListView,
    AdminUserActionView,
    AdminDashboardStatsView,
    AdminFeatureFlagsListView,
    AdminFeatureFlagToggleView,
)

urlpatterns = [
    path("stats/", AdminDashboardStatsView.as_view(), name="admin-stats"),
    path("flags/", AdminFeatureFlagsListView.as_view(), name="admin-flags-list"),
    path("flags/<slug:key>/toggle/", AdminFeatureFlagToggleView.as_view(), name="admin-flags-toggle"),
    path("audit/", AdminAuditLogsListView.as_view(), name="admin-audit-logs"),
    path("users/", AdminUsersListView.as_view(), name="admin-users-list"),
    path("users/action/", AdminUserActionView.as_view(), name="admin-user-action-general"),
    path("users/<uuid:user_id>/action/", AdminUserActionView.as_view(), name="admin-user-action"),
]

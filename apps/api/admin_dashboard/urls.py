from django.urls import path
from .views import (
    AdminAuditLogsListView,
    AdminUsersListView,
    AdminUserActionView,
    AdminDashboardStatsView,
    AdminFeatureFlagsListView,
    AdminFeatureFlagToggleView,
)
from .views_godmode import (
    AdminPinVerifyView,
    AdminPinChangeView,
    AdminCmsView,
    PublicSiteContentView,
    AdminMediaListView,
    AdminMediaDetailView,
    AdminImpersonateView,
    AdminImpersonateExitView,
    AdminKillSessionsView,
    AdminGrantSubscriptionView,
    AdminServerOpsTablesView,
    AdminServerOpsTableDataView,
    AdminServerOpsTableMutateView,
    AdminServerOpsSqlView,
    AdminServerOpsCacheView,
    AdminServerOpsMaintenanceView,
)

urlpatterns = [
    # Core Admin Dashboard Stats & Flags
    path("stats/", AdminDashboardStatsView.as_view(), name="admin-stats"),
    path("flags/", AdminFeatureFlagsListView.as_view(), name="admin-flags-list"),
    path("flags/<slug:key>/toggle/", AdminFeatureFlagToggleView.as_view(), name="admin-flags-toggle"),
    path("audit/", AdminAuditLogsListView.as_view(), name="admin-audit-logs"),

    # Users Operations & Impersonation
    path("users/", AdminUsersListView.as_view(), name="admin-users-list"),
    path("users/action/", AdminUserActionView.as_view(), name="admin-user-action-general"),
    path("users/<uuid:user_id>/action/", AdminUserActionView.as_view(), name="admin-user-action"),
    path("users/<uuid:user_id>/impersonate/", AdminImpersonateView.as_view(), name="admin-user-impersonate"),
    path("users/impersonate/exit/", AdminImpersonateExitView.as_view(), name="admin-user-impersonate-exit"),
    path("users/<uuid:user_id>/kill-sessions/", AdminKillSessionsView.as_view(), name="admin-user-kill-sessions"),
    path("users/<uuid:user_id>/grant-subscription/", AdminGrantSubscriptionView.as_view(), name="admin-user-grant-subscription"),

    # Admin Security Master PIN
    path("security/pin/verify/", AdminPinVerifyView.as_view(), name="admin-pin-verify"),
    path("security/pin/change/", AdminPinChangeView.as_view(), name="admin-pin-change"),

    # Dynamic CMS & Public Site Delivery
    path("cms/", AdminCmsView.as_view(), name="admin-cms"),
    path("cms/public/", PublicSiteContentView.as_view(), name="admin-cms-public"),

    # Media & Asset Manager
    path("media/", AdminMediaListView.as_view(), name="admin-media-list"),
    path("media/<uuid:asset_id>/", AdminMediaDetailView.as_view(), name="admin-media-detail"),

    # Real Server Operations & God Mode
    path("server-ops/tables/", AdminServerOpsTablesView.as_view(), name="admin-server-tables"),
    path("server-ops/tables/<str:table_name>/rows/", AdminServerOpsTableDataView.as_view(), name="admin-server-table-rows"),
    path("server-ops/tables/<str:table_name>/mutate/", AdminServerOpsTableMutateView.as_view(), name="admin-server-table-mutate"),
    path("server-ops/sql/", AdminServerOpsSqlView.as_view(), name="admin-server-sql"),
    path("server-ops/cache/flush/", AdminServerOpsCacheView.as_view(), name="admin-server-cache-flush"),
    path("server-ops/maintenance/", AdminServerOpsMaintenanceView.as_view(), name="admin-server-maintenance"),
]

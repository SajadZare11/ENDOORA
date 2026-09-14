from django.urls import include, path
from rest_framework.routers import DefaultRouter

from ledger.views import (
    AdminCommissionRuleViewSet,
    AdminPayoutActionView,
    AdminPayoutQueueView,
    AdminReconciliationView,
    TeacherLedgerBalanceView,
    TeacherPayoutListCreateView,
    TeacherStatementView,
    TeacherTaxIdentityView,
)

router = DefaultRouter()
router.register(r"admin/commission-rules", AdminCommissionRuleViewSet, basename="admin-commission-rules")

urlpatterns = [
    path("teacher/balance/", TeacherLedgerBalanceView.as_view(), name="ledger-teacher-balance"),
    path("teacher/statement/", TeacherStatementView.as_view(), name="ledger-teacher-statement"),
    path("teacher/payouts/", TeacherPayoutListCreateView.as_view(), name="ledger-teacher-payouts"),
    path("teacher/tax-identity/", TeacherTaxIdentityView.as_view(), name="ledger-teacher-tax-identity"),
    path("admin/reconciliation/", AdminReconciliationView.as_view(), name="ledger-admin-reconciliation"),
    path("admin/payouts/", AdminPayoutQueueView.as_view(), name="ledger-admin-payouts"),
    path("admin/payouts/<uuid:payout_id>/action/", AdminPayoutActionView.as_view(), name="ledger-admin-payout-action"),
    path("", include(router.urls)),
]

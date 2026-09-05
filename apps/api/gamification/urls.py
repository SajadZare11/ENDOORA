from django.urls import path

from .views import (
    AwardXPView,
    GamificationSummaryView,
    LevelCatalogView,
    XPLedgerListView,
)

app_name = "gamification"

urlpatterns = [
    path("summary/", GamificationSummaryView.as_view(), name="summary"),
    path("ledger/", XPLedgerListView.as_view(), name="ledger"),
    path("award/", AwardXPView.as_view(), name="award"),
    path("levels/", LevelCatalogView.as_view(), name="levels"),
]

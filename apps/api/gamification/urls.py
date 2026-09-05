from django.urls import path

from .views import (
    AwardXPView,
    BadgeEvaluateView,
    BadgesListView,
    ChallengeLeaveView,
    ChallengeReportView,
    ChallengesListView,
    ClubJoinView,
    ClubLeaveView,
    ClubReportView,
    ClubsListView,
    GamificationSummaryView,
    LeaderboardPrivacyView,
    LeaderboardSnapshotTriggerView,
    LeaderboardView,
    LevelCatalogView,
    SevenDaySprintEnrollView,
    XPLedgerListView,
)

app_name = "gamification"

urlpatterns = [
    path("summary/", GamificationSummaryView.as_view(), name="summary"),
    path("ledger/", XPLedgerListView.as_view(), name="ledger"),
    path("award/", AwardXPView.as_view(), name="award"),
    path("levels/", LevelCatalogView.as_view(), name="levels"),
    # Day 29: Badges
    path("badges/", BadgesListView.as_view(), name="badges"),
    path("badges/evaluate/", BadgeEvaluateView.as_view(), name="badges-evaluate"),
    # Day 29: Challenges & 7-Day Sprint
    path("challenges/", ChallengesListView.as_view(), name="challenges"),
    path("challenges/enroll-sprint/", SevenDaySprintEnrollView.as_view(), name="challenges-enroll-sprint"),
    path("challenges/leave/", ChallengeLeaveView.as_view(), name="challenges-leave"),
    path("challenges/report/", ChallengeReportView.as_view(), name="challenges-report"),
    # Day 29: Active-Users Clubs
    path("clubs/", ClubsListView.as_view(), name="clubs"),
    path("clubs/join/", ClubJoinView.as_view(), name="clubs-join"),
    path("clubs/leave/", ClubLeaveView.as_view(), name="clubs-leave"),
    path("clubs/report/", ClubReportView.as_view(), name="clubs-report"),
    # Day 29: Privacy-Safe Leaderboards
    path("leaderboard/", LeaderboardView.as_view(), name="leaderboard"),
    path("leaderboard/privacy/", LeaderboardPrivacyView.as_view(), name="leaderboard-privacy"),
    path("leaderboard/snapshot/", LeaderboardSnapshotTriggerView.as_view(), name="leaderboard-snapshot"),
]

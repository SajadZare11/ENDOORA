from django.urls import path
from .views import (
    CandidateApproveView,
    CandidateIgnoreView,
    CandidateListView,
    ExtractWordsView,
    ReviewSubmitView,
    SrsItemDetailView,
    SrsItemListView,
    SrsStatsView,
    TodayReviewView,
)

urlpatterns = [
    path("today/", TodayReviewView.as_view(), name="srs-today"),
    path("review/", ReviewSubmitView.as_view(), name="srs-review-submit"),
    path("candidates/", CandidateListView.as_view(), name="srs-candidates"),
    path("candidates/<int:pk>/approve/", CandidateApproveView.as_view(), name="srs-candidate-approve"),
    path("candidates/<int:pk>/ignore/", CandidateIgnoreView.as_view(), name="srs-candidate-ignore"),
    path("extract/", ExtractWordsView.as_view(), name="srs-extract"),
    path("items/", SrsItemListView.as_view(), name="srs-items"),
    path("items/<int:pk>/", SrsItemDetailView.as_view(), name="srs-item-detail"),
    path("stats/", SrsStatsView.as_view(), name="srs-stats"),
]

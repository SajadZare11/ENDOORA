from django.urls import path
from .views import (
    AcceptCorrectionView,
    DismissCorrectionView,
    DraftAnalyzeView,
    DraftDetailView,
    DraftListCreateView,
    DraftReviseView,
    PromptListView,
)

urlpatterns = [
    path("prompts/", PromptListView.as_view(), name="writing_prompts"),
    path("drafts/", DraftListCreateView.as_view(), name="writing_drafts_list_create"),
    path("drafts/<int:draft_id>/", DraftDetailView.as_view(), name="writing_draft_detail"),
    path("drafts/<int:draft_id>/analyze/", DraftAnalyzeView.as_view(), name="writing_draft_analyze"),
    path("drafts/<int:draft_id>/revise/", DraftReviseView.as_view(), name="writing_draft_revise"),
    path("drafts/<int:draft_id>/accept-correction/", AcceptCorrectionView.as_view(), name="writing_accept_correction"),
    path("drafts/<int:draft_id>/dismiss-correction/", DismissCorrectionView.as_view(), name="writing_dismiss_correction"),
]

from django.urls import path

from .views import (
    MistakeDisputeView,
    MistakeEvidenceDeleteView,
    MistakeGenomeSummaryView,
    MistakeGenomeView,
    MistakePatternDetailView,
    MistakePatternListView,
    MistakeRecordView,
    MistakeResolveView,
)

urlpatterns = [
    path("summary/", MistakeGenomeSummaryView.as_view(), name="mistake-summary"),
    path("patterns/", MistakePatternListView.as_view(), name="mistake-pattern-list"),
    path("patterns/<int:pk>/", MistakePatternDetailView.as_view(), name="mistake-pattern-detail"),
    path("patterns/<int:pk>/dispute/", MistakeDisputeView.as_view(), name="mistake-dispute"),
    path("patterns/<int:pk>/resolve/", MistakeResolveView.as_view(), name="mistake-resolve"),
    path("record/", MistakeRecordView.as_view(), name="mistake-record"),
    path("evidence/<int:pk>/", MistakeEvidenceDeleteView.as_view(), name="mistake-evidence-delete"),
    path("mine/", MistakeGenomeView.as_view(), name="mistake-mine-alias"),
]

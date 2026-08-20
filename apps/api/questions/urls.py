from django.urls import path

from .views import (
    CheckAnswerView,
    EditorExportView,
    EditorImportView,
    EditorPreviewView,
    EditorPublishView,
    EditorRetireView,
    EditorSubmitForReviewView,
    EditorVersionDetailView,
    EditorVersionListView,
    PublishedQuestionDetailView,
    PublishedQuestionListView,
    QuestionMetaView,
)

app_name = "questions"

urlpatterns = [
    path("meta/", QuestionMetaView.as_view(), name="meta"),
    path("published/", PublishedQuestionListView.as_view(), name="published-list"),
    path("published/<uuid:version_id>/", PublishedQuestionDetailView.as_view(), name="published-detail"),
    path("published/<uuid:version_id>/check/", CheckAnswerView.as_view(), name="check-answer"),
    path("editor/versions/", EditorVersionListView.as_view(), name="editor-list"),
    path("editor/versions/<uuid:version_id>/", EditorVersionDetailView.as_view(), name="editor-detail"),
    path("editor/versions/<uuid:version_id>/preview/", EditorPreviewView.as_view(), name="editor-preview"),
    path("editor/versions/<uuid:version_id>/submit-review/", EditorSubmitForReviewView.as_view(), name="editor-submit-review"),
    path("editor/versions/<uuid:version_id>/publish/", EditorPublishView.as_view(), name="editor-publish"),
    path("editor/versions/<uuid:version_id>/retire/", EditorRetireView.as_view(), name="editor-retire"),
    path("editor/import/", EditorImportView.as_view(), name="editor-import"),
    path("editor/export/", EditorExportView.as_view(), name="editor-export"),
]

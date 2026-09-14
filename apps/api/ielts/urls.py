from django.urls import path
from ielts.views import (
    AdminIELTSTestListCreateView,
    AdminIELTSTestDetailView,
    AdminSubmitReviewView,
    AdminApproveReviewView,
    AdminPublishTestView,
    AdminCloneNewVersionView,
    IELTSBandDescriptorListView,
    PublicIELTSTestListView,
    LearnerStartSessionView,
    LearnerActiveSessionDetailView,
    LearnerRecordAnswerView,
    LearnerToggleFlagView,
    LearnerAdvanceSectionView,
    LearnerSubmitSessionView,
    LearnerSessionReportView,
    LearnerSessionHistoryView,
    IELTSWritingPromptsCatalogView,
    IELTSWritingDraftView,
    IELTSWritingSubmitView,
    IELTSWritingReportView,
    IELTSWritingHistoryView,
    IELTSWritingTeacherReviewRequestView,
)

urlpatterns = [
    # Admin / Editor Studio endpoints
    path("tests/", AdminIELTSTestListCreateView.as_view(), name="admin-ielts-tests-list"),
    path("tests/<uuid:test_id>/", AdminIELTSTestDetailView.as_view(), name="admin-ielts-test-detail"),
    path("tests/<uuid:test_id>/submit-review/", AdminSubmitReviewView.as_view(), name="admin-ielts-submit-review"),
    path("tests/<uuid:test_id>/approve/", AdminApproveReviewView.as_view(), name="admin-ielts-approve-review"),
    path("tests/<uuid:test_id>/publish/", AdminPublishTestView.as_view(), name="admin-ielts-publish-test"),
    path("tests/<uuid:test_id>/clone/", AdminCloneNewVersionView.as_view(), name="admin-ielts-clone-version"),

    # Public Band Descriptors & Catalog
    path("band-descriptors/", IELTSBandDescriptorListView.as_view(), name="ielts-band-descriptors"),
    path("public/tests/", PublicIELTSTestListView.as_view(), name="public-ielts-tests-list"),

    # Learner IELTS Simulator & Timed Session Engine
    path("sessions/start/", LearnerStartSessionView.as_view(), name="learner-ielts-session-start"),
    path("sessions/history/", LearnerSessionHistoryView.as_view(), name="learner-ielts-session-history"),
    path("sessions/<uuid:session_id>/", LearnerActiveSessionDetailView.as_view(), name="learner-ielts-session-detail"),
    path("sessions/<uuid:session_id>/answer/", LearnerRecordAnswerView.as_view(), name="learner-ielts-session-answer"),
    path("sessions/<uuid:session_id>/flag/", LearnerToggleFlagView.as_view(), name="learner-ielts-session-flag"),
    path("sessions/<uuid:session_id>/advance/", LearnerAdvanceSectionView.as_view(), name="learner-ielts-session-advance"),
    path("sessions/<uuid:session_id>/submit/", LearnerSubmitSessionView.as_view(), name="learner-ielts-session-submit"),
    path("sessions/<uuid:session_id>/report/", LearnerSessionReportView.as_view(), name="learner-ielts-session-report"),

    # IELTS Writing Simulation & AI Evaluation Engine (IELTS-003 & IELTS-004)
    path("writing/prompts/", IELTSWritingPromptsCatalogView.as_view(), name="ielts-writing-prompts"),
    path("writing/draft/", IELTSWritingDraftView.as_view(), name="ielts-writing-draft-create"),
    path("writing/draft/<uuid:submission_id>/", IELTSWritingDraftView.as_view(), name="ielts-writing-draft-detail"),
    path("writing/submit/", IELTSWritingSubmitView.as_view(), name="ielts-writing-submit"),
    path("writing/report/<uuid:submission_id>/", IELTSWritingReportView.as_view(), name="ielts-writing-report"),
    path("writing/history/", IELTSWritingHistoryView.as_view(), name="ielts-writing-history"),
    path("writing/<uuid:submission_id>/request-teacher-review/", IELTSWritingTeacherReviewRequestView.as_view(), name="ielts-writing-teacher-review"),
]


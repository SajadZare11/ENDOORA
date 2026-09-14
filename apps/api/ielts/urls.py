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
]

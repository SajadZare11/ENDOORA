from django.urls import path

from .views import (
    TeacherDashboardEventView,
    TeacherDashboardView,
    TeacherClassListCreateView,
    TeacherClassDetailView,
    TeacherLearnerInviteView,
    LearnerConsentAcceptView,
    TeacherLearnerOverviewView,
    TeacherLearnerTerminateView,
    ClassSessionListCreateView,
    ClassSessionCompleteView,
    ClassSessionDetailView,
    TeachingHourLedgerView,
    TeachingHourAdjustView,
    LearnerLinkedTeachersView,
)
from .analytics_views import (
    TeacherAnalyticsOverviewView,
    TeacherClassAnalyticsReportView,
    TeacherClassAnalyticsExportView,
    TeacherLearnerAnalyticsProfileView,
    TeacherAtRiskAlertsListView,
    TeacherAtRiskAlertAcknowledgeView,
    TeacherAtRiskAlertResolveView,
    TeacherInterventionsListView,
    TeacherInterventionDetailView,
)

from .assignment_views import (
    TeacherAssignmentsView,
    TeacherAssignmentDetailView,
    TeacherAssignmentQuestionsView,
    TeacherAssignmentDeliveryView,
    TeacherAssignmentAccommodationsView,
    TeacherAssignmentPublishView,
    TeacherAssignmentSubmissionsView,
    TeacherAttemptGradeView,
    TeacherSubmissionGradingDetailView,
    TeacherSubmissionsQueueView,
    TeacherClassGradebookView,
    TeacherClassGradebookExportView,
    TeacherQuestionBankBrowseView,
    LearnerAssignmentsListView,
    LearnerAssignmentStartView,
    LearnerAttemptAutosaveView,
    LearnerAttemptSubmitView,
    LearnerAttemptDetailView,
    LearnerAcknowledgeFeedbackView,
    SubmissionFeedbackMessagesView,
    LearnerGradebookView,
)
from .teacheros_views import (
    TeacherMaterialListCreateView,
    TeacherMaterialDetailView,
    TeacherMaterialGenerateView,
    TeacherMaterialAssignView,
    ClassOutcomeListCreateView,
    NextLessonRecommendationView,
    StudentDossierView,
    StudentDossierScoreSkillsView,
    StudentDossierLogErrorView,
    StudentDossierErrorStatusView,
    StudentDossierAssessmentView,
    SpacedReviewQueueView,
    SpacedReviewRecordView,
    DifferentiationStudioView,
    TeacherUsageSummaryView,
    TeacherMaterialExportDocxView,
    TeacherMaterialExportPdfView,
    TeacherMaterialAdaptView,
    TeacherMaterialScheduleView,
    TeacherWritingAnalyzeView,
    TeacherWritingApproveFeedbackView,
    TeacherWritingExportDocxView,
    TeacherWritingExportPdfView,
    DifferentiationExportDocxView,
    DifferentiationAssignView,
    SRSGenerateWarmupView,
    SRSPushWarmupView,
    SRSExportWarmupDocxView,
    ClassPacingAuditView,
    ClassPacingAuditExportView,
    ReportCardDataView,
    ReportCardDispatchView,
    ReportCardExportDocxView,
    ReportCardExportPdfView,
    TeacherMaterialBatchView,
    TeacherAccountSummaryView,
    TeacherAccountPreferencesView,
    TeacherAccountUpgradeView,
)

app_name = "teachers"

urlpatterns = [
    # Dashboard (Day 10)
    path("dashboard/", TeacherDashboardView.as_view(), name="dashboard"),
    path("dashboard/events/", TeacherDashboardEventView.as_view(), name="dashboard-events"),

    # Classes & Roster (Day 33)
    path("classes/", TeacherClassListCreateView.as_view(), name="class-list-create"),
    path("classes/<uuid:pk>/", TeacherClassDetailView.as_view(), name="class-detail"),
    path("classes/<uuid:pk>/invite/", TeacherLearnerInviteView.as_view(), name="class-invite-learner"),
    path("classes/<uuid:class_pk>/sessions/", ClassSessionListCreateView.as_view(), name="class-session-list-create"),
    path("classes/<uuid:class_pk>/learners/<uuid:learner_pk>/overview/", TeacherLearnerOverviewView.as_view(), name="class-learner-overview"),
    path("learners/<uuid:learner_pk>/overview/", TeacherLearnerOverviewView.as_view(), name="learner-overview"),

    # Learner Consent & Termination (Day 33)
    path("links/<uuid:pk>/consent/", LearnerConsentAcceptView.as_view(), name="link-consent"),
    path("links/<uuid:pk>/terminate/", TeacherLearnerTerminateView.as_view(), name="link-terminate"),
    path("consent/", LearnerConsentAcceptView.as_view(), name="consent-accept"),

    # Sessions & Completion (Day 33)
    path("classes/<uuid:class_pk>/sessions/<uuid:session_pk>/", ClassSessionDetailView.as_view(), name="class-session-detail"),
    path("sessions/<uuid:pk>/", ClassSessionDetailView.as_view(), name="session-detail"),
    path("sessions/<uuid:pk>/complete/", ClassSessionCompleteView.as_view(), name="session-complete"),

    # Teaching Hours Ledger & Auditing (Day 33)
    path("hours/", TeachingHourLedgerView.as_view(), name="hours-ledger"),
    path("hours/<uuid:pk>/adjust/", TeachingHourAdjustView.as_view(), name="hours-adjust"),

    # Learner's Teachers (Day 33)
    path("my-teachers/", LearnerLinkedTeachersView.as_view(), name="learner-my-teachers"),

    # Assignments Hub & Wizard (Day 34)
    path("assignments/", TeacherAssignmentsView.as_view(), name="assignment-list-create"),
    path("assignments/<uuid:assignment_id>/", TeacherAssignmentDetailView.as_view(), name="assignment-detail"),
    path("assignments/<uuid:assignment_id>/questions/", TeacherAssignmentQuestionsView.as_view(), name="assignment-questions"),
    path("assignments/<uuid:assignment_id>/delivery/", TeacherAssignmentDeliveryView.as_view(), name="assignment-delivery"),
    path("assignments/<uuid:assignment_id>/accommodations/", TeacherAssignmentAccommodationsView.as_view(), name="assignment-accommodations"),
    path("assignments/<uuid:assignment_id>/publish/", TeacherAssignmentPublishView.as_view(), name="assignment-publish"),
    path("assignments/<uuid:assignment_id>/submissions/", TeacherAssignmentSubmissionsView.as_view(), name="assignment-submissions"),
    path("attempts/<uuid:attempt_id>/grade/", TeacherAttemptGradeView.as_view(), name="attempt-grade"),
    path("attempts/<uuid:attempt_id>/grading-detail/", TeacherSubmissionGradingDetailView.as_view(), name="attempt-grading-detail"),
    path("submissions/queue/", TeacherSubmissionsQueueView.as_view(), name="submissions-queue"),
    path("question-bank/browse/", TeacherQuestionBankBrowseView.as_view(), name="question-bank-browse"),

    # Gradebook & Class Reporting (Day 35)
    path("classes/<uuid:class_id>/gradebook/", TeacherClassGradebookView.as_view(), name="class-gradebook"),
    path("classes/<uuid:class_id>/gradebook/export/", TeacherClassGradebookExportView.as_view(), name="class-gradebook-export"),


    # Analytics & Early Warning System (Day 36)
    path("analytics/overview/", TeacherAnalyticsOverviewView.as_view(), name="analytics-overview"),
    path("classes/<uuid:class_id>/analytics/", TeacherClassAnalyticsReportView.as_view(), name="class-analytics-report"),
    path("classes/<uuid:class_id>/analytics/export/", TeacherClassAnalyticsExportView.as_view(), name="class-analytics-export"),
    path("classes/<uuid:class_id>/learners/<uuid:learner_id>/analytics/", TeacherLearnerAnalyticsProfileView.as_view(), name="class-learner-analytics-profile"),
    path("alerts/", TeacherAtRiskAlertsListView.as_view(), name="alerts-list"),
    path("alerts/<uuid:alert_id>/acknowledge/", TeacherAtRiskAlertAcknowledgeView.as_view(), name="alert-acknowledge"),
    path("alerts/<uuid:alert_id>/resolve/", TeacherAtRiskAlertResolveView.as_view(), name="alert-resolve"),
    path("interventions/", TeacherInterventionsListView.as_view(), name="interventions-list-create"),
    path("interventions/<uuid:intervention_id>/", TeacherInterventionDetailView.as_view(), name="intervention-detail"),

    # Learner Assignments & Attempts (Day 34 & 35)
    path("my-assignments/", LearnerAssignmentsListView.as_view(), name="learner-my-assignments"),
    path("assignments/<uuid:assignment_id>/start/", LearnerAssignmentStartView.as_view(), name="learner-assignment-start"),
    path("attempts/<uuid:attempt_id>/autosave/", LearnerAttemptAutosaveView.as_view(), name="learner-attempt-autosave"),
    path("attempts/<uuid:attempt_id>/submit/", LearnerAttemptSubmitView.as_view(), name="learner-attempt-submit"),
    path("attempts/<uuid:attempt_id>/", LearnerAttemptDetailView.as_view(), name="learner-attempt-detail"),

    # Feedback Loop & Learner Gradebook (Day 35)
    path("attempts/<uuid:attempt_id>/acknowledge-feedback/", LearnerAcknowledgeFeedbackView.as_view(), name="attempt-acknowledge-feedback"),
    path("attempts/<uuid:attempt_id>/feedback-messages/", SubmissionFeedbackMessagesView.as_view(), name="attempt-feedback-messages"),
    path("my-grades/", LearnerGradebookView.as_view(), name="learner-my-grades"),

    # TeacherOS: Materials & Generators (Pillar 2 & Library)
    path("materials/", TeacherMaterialListCreateView.as_view(), name="teacheros-materials-list-create"),
    path("materials/batch/", TeacherMaterialBatchView.as_view(), name="teacheros-materials-batch"),
    path("materials/generate/", TeacherMaterialGenerateView.as_view(), name="teacheros-materials-generate"),
    path("materials/<uuid:pk>/", TeacherMaterialDetailView.as_view(), name="teacheros-materials-detail"),
    path("materials/<uuid:pk>/assign/", TeacherMaterialAssignView.as_view(), name="teacheros-materials-assign"),
    path("materials/<uuid:pk>/differentiate/", DifferentiationStudioView.as_view(), name="teacheros-materials-differentiate"),
    path("materials/<uuid:pk>/export/docx/", TeacherMaterialExportDocxView.as_view(), name="teacheros-material-export-docx"),
    path("materials/<uuid:pk>/export/pdf/", TeacherMaterialExportPdfView.as_view(), name="teacheros-material-export-pdf"),
    path("materials/<uuid:pk>/adapt/", TeacherMaterialAdaptView.as_view(), name="teacheros-material-adapt"),
    path("materials/<uuid:pk>/schedule/", TeacherMaterialScheduleView.as_view(), name="teacheros-material-schedule"),
    path("usage/", TeacherUsageSummaryView.as_view(), name="teacheros-usage"),

    # TeacherOS: Account & Subscription Hub (Day 10)
    path("account/summary/", TeacherAccountSummaryView.as_view(), name="teacheros-account-summary"),
    path("account/preferences/", TeacherAccountPreferencesView.as_view(), name="teacheros-account-preferences"),
    path("account/upgrade/", TeacherAccountUpgradeView.as_view(), name="teacheros-account-upgrade"),

    # TeacherOS: Outcome Check-ins & Recommendations (Pillar 1 & 2)
    path("classes/<uuid:class_pk>/outcomes/", ClassOutcomeListCreateView.as_view(), name="teacheros-class-outcomes"),
    path("classes/<uuid:class_pk>/next-lesson-recommendation/", NextLessonRecommendationView.as_view(), name="teacheros-next-lesson-recommendation"),

    # TeacherOS: 11-Section Student Dossier (Pillar 1)
    path("classes/<uuid:class_pk>/learners/<uuid:learner_pk>/dossier/", StudentDossierView.as_view(), name="teacheros-student-dossier"),
    path("classes/<uuid:class_pk>/learners/<uuid:learner_pk>/dossier/score-skills/", StudentDossierScoreSkillsView.as_view(), name="teacheros-student-score-skills"),
    path("classes/<uuid:class_pk>/learners/<uuid:learner_pk>/dossier/log-error/", StudentDossierLogErrorView.as_view(), name="teacheros-student-log-error"),
    path("classes/<uuid:class_pk>/learners/<uuid:learner_pk>/dossier/errors/<str:error_id>/", StudentDossierErrorStatusView.as_view(), name="teacheros-student-error-status"),
    path("classes/<uuid:class_pk>/learners/<uuid:learner_pk>/dossier/assessments/", StudentDossierAssessmentView.as_view(), name="teacheros-student-assessments"),

    # TeacherOS: Spaced Review Queue & SM-2 Review (Pillar 4 Supertool)
    path("classes/<uuid:class_pk>/spaced-reviews/", SpacedReviewQueueView.as_view(), name="teacheros-spaced-reviews"),
    path("classes/<uuid:class_pk>/spaced-reviews/<uuid:pk>/review/", SpacedReviewRecordView.as_view(), name="teacheros-spaced-review-record"),

    # TeacherOS: Writing Assessment & 3-Column Feedback Studio (Day 8)
    path("assessment/analyze/", TeacherWritingAnalyzeView.as_view(), name="teacheros-writing-analyze"),
    path("assessment/approve/", TeacherWritingApproveFeedbackView.as_view(), name="teacheros-writing-approve"),
    path("assessment/export/docx/", TeacherWritingExportDocxView.as_view(), name="teacheros-writing-export-docx"),
    path("assessment/export/pdf/", TeacherWritingExportPdfView.as_view(), name="teacheros-writing-export-pdf"),

    # TeacherOS: Deep Pedagogical Supertools (Day 9)
    path("materials/<uuid:pk>/differentiation/export/docx/", DifferentiationExportDocxView.as_view(), name="teacheros-differentiation-export-docx"),
    path("materials/<uuid:pk>/differentiation/assign/", DifferentiationAssignView.as_view(), name="teacheros-differentiation-assign"),
    path("classes/<uuid:class_pk>/srs/warmup/", SRSGenerateWarmupView.as_view(), name="teacheros-srs-warmup-generate"),
    path("classes/<uuid:class_pk>/srs/warmup/push/", SRSPushWarmupView.as_view(), name="teacheros-srs-warmup-push"),
    path("classes/<uuid:class_pk>/srs/warmup/export/docx/", SRSExportWarmupDocxView.as_view(), name="teacheros-srs-warmup-export-docx"),
    path("classes/<uuid:class_pk>/pacing-audit/", ClassPacingAuditView.as_view(), name="teacheros-class-pacing-audit"),
    path("classes/<uuid:class_pk>/pacing-audit/export/docx/", ClassPacingAuditExportView.as_view(), name="teacheros-class-pacing-audit-export-docx"),
    path("classes/<uuid:class_pk>/learners/<uuid:learner_pk>/report-card/", ReportCardDataView.as_view(), name="teacheros-report-card-data"),
    path("classes/<uuid:class_pk>/learners/<uuid:learner_pk>/report-card/dispatch/", ReportCardDispatchView.as_view(), name="teacheros-report-card-dispatch"),
    path("classes/<uuid:class_pk>/learners/<uuid:learner_pk>/report-card/export/docx/", ReportCardExportDocxView.as_view(), name="teacheros-report-card-export-docx"),
    path("classes/<uuid:class_pk>/learners/<uuid:learner_pk>/report-card/export/pdf/", ReportCardExportPdfView.as_view(), name="teacheros-report-card-export-pdf"),
]



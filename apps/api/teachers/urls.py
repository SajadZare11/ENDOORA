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
]

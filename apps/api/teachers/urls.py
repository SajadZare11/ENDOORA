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
from .assignment_views import (
    TeacherAssignmentsView,
    TeacherAssignmentDetailView,
    TeacherAssignmentQuestionsView,
    TeacherAssignmentDeliveryView,
    TeacherAssignmentAccommodationsView,
    TeacherAssignmentPublishView,
    TeacherAssignmentSubmissionsView,
    TeacherAttemptGradeView,
    TeacherQuestionBankBrowseView,
    LearnerAssignmentsListView,
    LearnerAssignmentStartView,
    LearnerAttemptAutosaveView,
    LearnerAttemptSubmitView,
    LearnerAttemptDetailView,
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
    path("question-bank/browse/", TeacherQuestionBankBrowseView.as_view(), name="question-bank-browse"),

    # Learner Assignments & Attempts (Day 34)
    path("my-assignments/", LearnerAssignmentsListView.as_view(), name="learner-my-assignments"),
    path("assignments/<uuid:assignment_id>/start/", LearnerAssignmentStartView.as_view(), name="learner-assignment-start"),
    path("attempts/<uuid:attempt_id>/autosave/", LearnerAttemptAutosaveView.as_view(), name="learner-attempt-autosave"),
    path("attempts/<uuid:attempt_id>/submit/", LearnerAttemptSubmitView.as_view(), name="learner-attempt-submit"),
    path("attempts/<uuid:attempt_id>/", LearnerAttemptDetailView.as_view(), name="learner-attempt-detail"),
]

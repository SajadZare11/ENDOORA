from django.urls import path

from . import views

urlpatterns = [
    path("sessions/", views.PlacementSessionListCreateView.as_view(), name="placement-sessions"),
    path("sessions/current/", views.PlacementCurrentSessionView.as_view(), name="placement-session-current"),
    path("sessions/<uuid:pk>/", views.PlacementSessionDetailView.as_view(), name="placement-session-detail"),
    path("sessions/<uuid:session_pk>/answers/", views.PlacementAnswerSaveView.as_view(), name="placement-answer-save"),
    path("sessions/<uuid:session_pk>/advance/", views.PlacementSectionAdvanceView.as_view(), name="placement-section-advance"),
    path("sessions/<uuid:session_pk>/submit/", views.PlacementSessionSubmitView.as_view(), name="placement-session-submit"),
    path("sessions/<uuid:session_pk>/summary/", views.PlacementSessionSummaryView.as_view(), name="placement-session-summary"),
    path("questions/", views.PlacementQuestionsView.as_view(), name="placement-questions"),
]

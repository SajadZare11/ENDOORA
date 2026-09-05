from django.urls import path

from .views import (
    AcceptMistakeView,
    SaveSrsWordView,
    ScenarioDetailView,
    ScenarioListView,
    SessionCompleteView,
    SessionDetailView,
    SessionHintView,
    SessionMessageView,
    SessionStartView,
)

app_name = "roleplay"

urlpatterns = [
    path("scenarios/", ScenarioListView.as_view(), name="scenario-list"),
    path("scenarios/<str:scenario_id>/", ScenarioDetailView.as_view(), name="scenario-detail"),
    path("sessions/start/", SessionStartView.as_view(), name="session-start"),
    path("sessions/<int:session_id>/", SessionDetailView.as_view(), name="session-detail"),
    path("sessions/<int:session_id>/message/", SessionMessageView.as_view(), name="session-message"),
    path("sessions/<int:session_id>/hint/", SessionHintView.as_view(), name="session-hint"),
    path("sessions/<int:session_id>/complete/", SessionCompleteView.as_view(), name="session-complete"),
    path("sessions/<int:session_id>/accept-mistake/", AcceptMistakeView.as_view(), name="accept-mistake"),
    path("sessions/<int:session_id>/save-srs-word/", SaveSrsWordView.as_view(), name="save-srs-word"),
]

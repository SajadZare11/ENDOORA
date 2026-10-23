from django.urls import path
from .views import (
    LiveClassQuizAnalyticsView,
    LiveClassQuizLaunchView,
    LiveClassQuizResponseView,
    LiveClassTokenView,
    LiveKitWebhookView,
    SessionAiRecapView,
    SessionAttendanceView,
    SessionWhiteboardExportView,
)

urlpatterns = [
    path("token/", LiveClassTokenView.as_view(), name="live_class_token"),
    path("webhooks/livekit/", LiveKitWebhookView.as_view(), name="livekit_webhook"),
    path("<str:session_id>/attendance/", SessionAttendanceView.as_view(), name="session_attendance"),
    path("quizzes/launch/", LiveClassQuizLaunchView.as_view(), name="quiz_launch"),
    path("quizzes/<uuid:quiz_id>/respond/", LiveClassQuizResponseView.as_view(), name="quiz_respond"),
    path("quizzes/<uuid:quiz_id>/analytics/", LiveClassQuizAnalyticsView.as_view(), name="quiz_analytics"),
    path("quizzes/<uuid:quiz_id>/publish/", LiveClassQuizAnalyticsView.as_view(), name="quiz_publish"),
    path("<str:session_id>/whiteboard-pdf/", SessionWhiteboardExportView.as_view(), name="whiteboard_pdf"),
    path("<str:session_id>/recap/", SessionAiRecapView.as_view(), name="session_recap"),
]

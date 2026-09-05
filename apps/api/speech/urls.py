from django.urls import path
from voice_lab.views import (
    CleanupExpiredAudioView,
    RecordingDetailView,
    RecordingListCreateView,
    RecordingTranscriptView,
    RecordingUploadAudioView,
    TTSView,
    UploadTicketView,
    VoicePreferenceView,
)

app_name = "speech"

urlpatterns = [
    path("upload-ticket/", UploadTicketView.as_view(), name="upload-ticket"),
    path("recordings/", RecordingListCreateView.as_view(), name="recording-list-create"),
    path("recordings/<int:recording_id>/", RecordingDetailView.as_view(), name="recording-detail"),
    path("recordings/<int:recording_id>/upload/", RecordingUploadAudioView.as_view(), name="recording-upload"),
    path("recordings/<int:recording_id>/transcript/", RecordingTranscriptView.as_view(), name="recording-transcript"),
    path("tts/", TTSView.as_view(), name="tts"),
    path("preferences/", VoicePreferenceView.as_view(), name="preferences"),
    path("cleanup/", CleanupExpiredAudioView.as_view(), name="cleanup"),
]

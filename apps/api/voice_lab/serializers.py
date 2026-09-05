from rest_framework import serializers

from .models import VoicePreference, VoiceRecording


class VoiceRecordingSerializer(serializers.ModelSerializer):
    final_transcript = serializers.ReadOnlyField()

    class Meta:
        model = VoiceRecording
        fields = [
            "id",
            "learner",
            "session_id",
            "scenario_id",
            "duration_seconds",
            "file_size_bytes",
            "mime_type",
            "status",
            "stt_transcript",
            "corrected_transcript",
            "final_transcript",
            "retention_policy",
            "expires_at",
            "is_deleted",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "learner",
            "final_transcript",
            "created_at",
            "updated_at",
        ]


class VoicePreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = VoicePreference
        fields = [
            "preferred_accent",
            "playback_speed",
            "default_retention",
            "auto_play_tts",
            "updated_at",
        ]
        read_only_fields = ["updated_at"]

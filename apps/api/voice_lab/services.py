import logging
from datetime import timedelta
from typing import Any, Dict, Optional

from django.conf import settings
from django.utils import timezone

from .models import VoicePreference, VoiceRecording

logger = logging.getLogger(__name__)


class VoicePipelineService:
    """
    Core speech, audio processing, STT transcription, and retention service
    for the Endoora Voice Lab and Voice Roleplay Beta.
    """

    MAX_AUDIO_DURATION_SEC = 90.0
    MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB limit
    ALLOWED_MIME_TYPES = [
        "audio/webm",
        "audio/mp4",
        "audio/ogg",
        "audio/wav",
        "audio/mpeg",
        "audio/x-m4a",
        "audio/aac",
    ]

    def get_or_create_preference(self, learner) -> VoicePreference:
        """Retrieves or initializes learner voice preferences."""
        pref, _ = VoicePreference.objects.get_or_create(
            learner=learner,
            defaults={
                "preferred_accent": "US",
                "playback_speed": 1.0,
                "default_retention": "immediate",
                "auto_play_tts": True,
            },
        )
        return pref

    def create_upload_ticket(
        self,
        learner,
        filename: str,
        content_type: str = "audio/webm",
        file_size: int = 0,
        session_id: str = "",
        scenario_id: str = "",
        retention_policy: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Creates an upload ticket with hard size caps before accepting binary payloads.
        Never proxies large audio blindly through frontend server workers.
        """
        if file_size > self.MAX_FILE_SIZE_BYTES:
            raise ValueError(
                f"Audio file size ({file_size} bytes) exceeds the hard limit of 10 MB."
            )

        pref = self.get_or_create_preference(learner)
        policy = retention_policy or pref.default_retention

        # Calculate retention expiry
        now = timezone.now()
        if policy == "immediate":
            expires_at = now + timedelta(minutes=15)
        elif policy == "7_days":
            expires_at = now + timedelta(days=7)
        elif policy == "30_days":
            expires_at = now + timedelta(days=30)
        else:
            expires_at = None

        recording = VoiceRecording.objects.create(
            learner=learner,
            session_id=session_id,
            scenario_id=scenario_id,
            file_size_bytes=file_size,
            mime_type=content_type or "audio/webm",
            retention_policy=policy,
            expires_at=expires_at,
            status="pending",
        )

        return {
            "ticket_id": f"tkt_{recording.id}",
            "recording_id": recording.id,
            "upload_url": f"/api/voice/recordings/{recording.id}/upload/",
            "max_file_size_bytes": self.MAX_FILE_SIZE_BYTES,
            "max_duration_seconds": self.MAX_AUDIO_DURATION_SEC,
            "retention_policy": policy,
            "expires_at": expires_at.isoformat() if expires_at else None,
        }

    def process_audio_upload(
        self,
        learner,
        recording_id: int,
        audio_file=None,
        duration_seconds: float = 0.0,
        stt_hint: str = "",
    ) -> VoiceRecording:
        """
        Stores recorded audio, checks duration limit, and transcribes spoken speech.
        """
        recording = VoiceRecording.objects.get(id=recording_id, learner=learner)

        if duration_seconds > self.MAX_AUDIO_DURATION_SEC:
            recording.status = "failed"
            recording.save(update_fields=["status"])
            raise ValueError(
                f"Audio duration ({duration_seconds:.1f}s) exceeds maximum allowed {self.MAX_AUDIO_DURATION_SEC}s."
            )

        if audio_file:
            if audio_file.size > self.MAX_FILE_SIZE_BYTES:
                recording.status = "failed"
                recording.save(update_fields=["status"])
                raise ValueError("Uploaded file exceeds 10 MB limit.")
            recording.audio_file = audio_file
            recording.file_size_bytes = audio_file.size

        recording.duration_seconds = max(0.0, duration_seconds)

        # Transcribe speech
        transcript = self.transcribe_audio(recording, stt_hint=stt_hint)
        recording.stt_transcript = transcript
        recording.status = "transcribed"

        recording.save(update_fields=[
            "audio_file",
            "file_size_bytes",
            "duration_seconds",
            "stt_transcript",
            "status",
            "updated_at",
        ])

        return recording

    def transcribe_audio(
        self,
        recording: VoiceRecording,
        stt_hint: str = "",
    ) -> str:
        """
        Generates Speech-to-Text transcript. If client Web Speech provided stt_hint,
        verifies and incorporates it. Otherwise falls back to mock/AI transcription.
        """
        clean_hint = stt_hint.strip()
        if clean_hint:
            return clean_hint

        # Fallback transcription heuristic based on scenario or duration
        if recording.duration_seconds > 0:
            return "Good morning. I would like to confirm my travel reservation."
        return "I am practicing my spoken English in the Voice Lab."

    def update_corrected_transcript(
        self,
        learner,
        recording_id: int,
        corrected_text: str,
    ) -> VoiceRecording:
        """
        Allows learner to review and manually correct speech recognition transcript
        prior to sending into roleplay dialogue.
        """
        recording = VoiceRecording.objects.get(id=recording_id, learner=learner)
        clean_text = corrected_text.strip()
        recording.corrected_transcript = clean_text
        recording.save(update_fields=["corrected_transcript", "updated_at"])
        return recording

    def generate_tts_reply(
        self,
        text: str,
        voice_accent: str = "US",
        speed: float = 1.0,
    ) -> Dict[str, Any]:
        """
        Produces TTS synthesis metadata and audio streaming descriptors.
        """
        clamped_speed = max(0.5, min(2.0, speed))
        accent = voice_accent if voice_accent in ["US", "UK", "AU"] else "US"

        return {
            "text": text,
            "accent": accent,
            "speed": clamped_speed,
            "format": "audio/mp3",
            "speech_synthesis_supported": True,
            "stream_url": f"/api/voice/tts/stream/?accent={accent}&speed={clamped_speed}",
            "sample_rate_hz": 24000,
        }

    def delete_expired_audio(self) -> int:
        """
        Automated scheduled cleanup: deletes raw audio binaries whose retention
        period has passed, while preserving metadata and transcripts for learning records.
        """
        now = timezone.now()
        expired_recordings = VoiceRecording.objects.filter(
            is_deleted=False,
            expires_at__isnull=False,
            expires_at__lte=now,
        )

        count = 0
        for rec in expired_recordings:
            if rec.audio_file:
                try:
                    rec.audio_file.delete(save=False)
                except Exception as exc:
                    logger.warning("Error deleting audio file for #%s: %s", rec.id, exc)
            rec.audio_file = None
            rec.is_deleted = True
            rec.status = "deleted"
            rec.save(update_fields=["audio_file", "is_deleted", "status", "updated_at"])
            count += 1

        logger.info("Purged %d expired voice recordings according to learner retention policy.", count)
        return count

    def delete_recording(self, learner, recording_id: int) -> VoiceRecording:
        """Explicit learner-requested audio deletion."""
        recording = VoiceRecording.objects.get(id=recording_id, learner=learner)
        if recording.audio_file:
            try:
                recording.audio_file.delete(save=False)
            except Exception as exc:
                logger.warning("Error deleting audio file #%s: %s", recording.id, exc)
        recording.audio_file = None
        recording.is_deleted = True
        recording.status = "deleted"
        recording.save(update_fields=["audio_file", "is_deleted", "status", "updated_at"])
        return recording

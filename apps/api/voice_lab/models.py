from django.conf import settings
from django.db import models
from django.utils import timezone


class VoiceRecording(models.Model):
    """
    Stores an audio recording attempt with speech recognition transcript,
    learner manual correction, and privacy-first retention lifecycle.
    """

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("transcribed", "Transcribed"),
        ("failed", "Failed"),
        ("deleted", "Audio Deleted"),
    ]

    RETENTION_CHOICES = [
        ("immediate", "Auto-delete immediately after transcription"),
        ("7_days", "Retain for 7 days"),
        ("30_days", "Retain for 30 days"),
        ("keep", "Retain indefinitely"),
    ]

    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="voice_recordings",
    )
    session_id = models.CharField(max_length=100, blank=True, default="")
    scenario_id = models.CharField(max_length=64, blank=True, default="")
    audio_file = models.FileField(
        upload_to="voice_recordings/%Y/%m/%d/",
        null=True,
        blank=True,
    )
    duration_seconds = models.FloatField(default=0.0)
    file_size_bytes = models.IntegerField(default=0)
    mime_type = models.CharField(max_length=64, default="audio/webm")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    # Speech recognition transcripts
    stt_transcript = models.TextField(blank=True, default="")
    corrected_transcript = models.TextField(blank=True, default="")

    # Privacy & retention management
    retention_policy = models.CharField(
        max_length=20,
        choices=RETENTION_CHOICES,
        default="immediate",
    )
    expires_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Voice Recording"
        verbose_name_plural = "Voice Recordings"

    def __str__(self):
        return f"Recording #{self.id} ({self.learner.email}) - {self.status} [{self.retention_policy}]"

    @property
    def final_transcript(self) -> str:
        """Returns the corrected transcript if available, otherwise the raw STT transcript."""
        return self.corrected_transcript.strip() or self.stt_transcript.strip()


class VoicePreference(models.Model):
    """
    Learner's audio interaction preferences: accent, speed, and privacy retention defaults.
    """

    ACCENT_CHOICES = [
        ("US", "American English"),
        ("UK", "British English"),
        ("AU", "Australian English"),
    ]

    learner = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="voice_preference",
    )
    preferred_accent = models.CharField(max_length=16, choices=ACCENT_CHOICES, default="US")
    playback_speed = models.FloatField(default=1.0)
    default_retention = models.CharField(
        max_length=20,
        choices=VoiceRecording.RETENTION_CHOICES,
        default="immediate",
    )
    auto_play_tts = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"VoicePreference for {self.learner.email} (Accent: {self.preferred_accent}, Speed: {self.playback_speed}x)"


# Backward compatibility alias
AudioAttempt = VoiceRecording

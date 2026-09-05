import io
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command
from django.test import TestCase
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from .models import VoicePreference, VoiceRecording
from .services import VoicePipelineService

User = get_user_model()


class VoicePipelineTests(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            email="learner1@endoora.com",
            password="SecurePassword123!",
        )
        self.user2 = User.objects.create_user(
            email="learner2@endoora.com",
            password="SecurePassword123!",
        )
        self.client1 = APIClient()
        self.client1.force_authenticate(user=self.user1)

        self.client2 = APIClient()
        self.client2.force_authenticate(user=self.user2)

        self.service = VoicePipelineService()

    def test_create_upload_ticket(self):
        """Upload ticket creates pending record with size/duration limits and expiry."""
        resp = self.client1.post(
            "/api/voice/upload-ticket/",
            {
                "filename": "practice_turn1.webm",
                "content_type": "audio/webm",
                "file_size": 250000,
                "session_id": "roleplay_101",
                "scenario_id": "airport",
            },
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertIn("ticket_id", resp.data)
        self.assertIn("recording_id", resp.data)
        self.assertEqual(resp.data["max_file_size_bytes"], 10 * 1024 * 1024)
        self.assertEqual(resp.data["max_duration_seconds"], 90.0)

        recording = VoiceRecording.objects.get(id=resp.data["recording_id"])
        self.assertEqual(recording.status, "pending")
        self.assertEqual(recording.learner, self.user1)

    def test_hard_file_size_limit(self):
        """Rejects audio payloads exceeding 10 MB."""
        oversized = 11 * 1024 * 1024  # 11 MB
        with self.assertRaises(ValueError):
            self.service.create_upload_ticket(
                learner=self.user1,
                filename="huge.wav",
                file_size=oversized,
            )

        resp = self.client1.post(
            "/api/voice/upload-ticket/",
            {"filename": "huge.wav", "file_size": oversized},
        )
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_hard_audio_duration_limit(self):
        """Rejects audio exceeding 90 seconds duration."""
        ticket = self.service.create_upload_ticket(
            learner=self.user1,
            filename="long_audio.webm",
            file_size=100000,
        )
        with self.assertRaises(ValueError):
            self.service.process_audio_upload(
                learner=self.user1,
                recording_id=ticket["recording_id"],
                duration_seconds=95.0,  # exceeds 90s
            )

    def test_process_audio_upload_and_transcription(self):
        """Uploading audio stores binary, calculates STT transcript, and updates status."""
        dummy_audio = SimpleUploadedFile("test.webm", b"RIFF dummy audio webm data", content_type="audio/webm")

        resp = self.client1.post(
            "/api/voice/recordings/",
            {
                "audio_file": dummy_audio,
                "duration_seconds": 12.5,
                "stt_hint": "I have arrived at the airport to attend a conference.",
                "scenario_id": "airport",
            },
            format="multipart",
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["status"], "transcribed")
        self.assertEqual(
            resp.data["stt_transcript"],
            "I have arrived at the airport to attend a conference.",
        )
        self.assertEqual(resp.data["final_transcript"], resp.data["stt_transcript"])

    def test_learner_manual_transcript_correction(self):
        """Learner can review and manually correct speech recognition transcript."""
        ticket = self.service.create_upload_ticket(self.user1, "speech.webm", file_size=1000)
        rec = self.service.process_audio_upload(
            self.user1,
            ticket["recording_id"],
            duration_seconds=5.0,
            stt_hint="I am staying at hot el",
        )

        resp = self.client1.patch(
            f"/api/voice/recordings/{rec.id}/transcript/",
            {"corrected_transcript": "I am staying at the hotel"},
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        rec.refresh_from_db()
        self.assertEqual(rec.corrected_transcript, "I am staying at the hotel")
        self.assertEqual(rec.final_transcript, "I am staying at the hotel")

    def test_tts_synthesis_metadata(self):
        """TTS endpoint returns audio streaming parameters with accent and speed settings."""
        resp = self.client1.post(
            "/api/voice/tts/",
            {
                "text": "Welcome to London. May I see your landing card?",
                "accent": "UK",
                "speed": 0.9,
            },
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["accent"], "UK")
        self.assertEqual(resp.data["speed"], 0.9)
        self.assertIn("stream_url", resp.data)
        self.assertTrue(resp.data["speech_synthesis_supported"])

    def test_learner_voice_preferences(self):
        """Learners can read and update voice accent, speed, and retention policies."""
        # Get defaults
        get_resp = self.client1.get("/api/voice/preferences/")
        self.assertEqual(get_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(get_resp.data["preferred_accent"], "US")
        self.assertEqual(get_resp.data["default_retention"], "immediate")

        # Update
        put_resp = self.client1.put(
            "/api/voice/preferences/",
            {
                "preferred_accent": "UK",
                "playback_speed": 1.2,
                "default_retention": "7_days",
                "auto_play_tts": False,
            },
        )
        self.assertEqual(put_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(put_resp.data["preferred_accent"], "UK")
        self.assertEqual(put_resp.data["default_retention"], "7_days")

    def test_retention_auto_delete_expired_audio(self):
        """Expired audio recordings have their binary files wiped while preserving text transcript."""
        audio_content = SimpleUploadedFile("expire_test.webm", b"dummy audio", content_type="audio/webm")
        ticket = self.service.create_upload_ticket(
            self.user1,
            "expire_test.webm",
            file_size=11,
            retention_policy="immediate",
        )
        rec = self.service.process_audio_upload(
            self.user1,
            ticket["recording_id"],
            audio_file=audio_content,
            duration_seconds=3.0,
            stt_hint="Keep my transcript but delete audio.",
        )

        # Force expiration into past
        rec.expires_at = timezone.now() - timedelta(hours=1)
        rec.save(update_fields=["expires_at"])

        # Run cleanup
        purged = self.service.delete_expired_audio()
        self.assertGreaterEqual(purged, 1)

        rec.refresh_from_db()
        self.assertTrue(rec.is_deleted)
        self.assertEqual(rec.status, "deleted")
        self.assertFalse(bool(rec.audio_file))
        # Crucial requirement: text transcript remains intact for learner learning memory!
        self.assertEqual(rec.stt_transcript, "Keep my transcript but delete audio.")

    def test_cleanup_expired_audio_management_command(self):
        """Management command cleanup_expired_audio executes retention policy cleanup."""
        out = io.StringIO()
        call_command("cleanup_expired_audio", stdout=out)
        self.assertIn("Retention cleanup complete", out.getvalue())

    def test_learner_explicit_delete_recording(self):
        """Learner can immediately delete their recording on request."""
        dummy = SimpleUploadedFile("del.webm", b"delete me", content_type="audio/webm")
        ticket = self.service.create_upload_ticket(self.user1, "del.webm", file_size=9)
        rec = self.service.process_audio_upload(
            self.user1,
            ticket["recording_id"],
            audio_file=dummy,
            duration_seconds=2.0,
        )

        resp = self.client1.delete(f"/api/voice/recordings/{rec.id}/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        rec.refresh_from_db()
        self.assertTrue(rec.is_deleted)
        self.assertEqual(rec.status, "deleted")

    def test_user_recording_isolation(self):
        """Learner 2 cannot access or delete Learner 1's recordings."""
        ticket = self.service.create_upload_ticket(self.user1, "private.webm", file_size=10)
        rec = self.service.process_audio_upload(
            self.user1,
            ticket["recording_id"],
            duration_seconds=4.0,
        )

        # Client 2 attempts GET
        resp_get = self.client2.get(f"/api/voice/recordings/{rec.id}/")
        self.assertEqual(resp_get.status_code, status.HTTP_404_NOT_FOUND)

        # Client 2 attempts PATCH
        resp_patch = self.client2.patch(
            f"/api/voice/recordings/{rec.id}/transcript/",
            {"corrected_transcript": "hacked"},
        )
        self.assertEqual(resp_patch.status_code, status.HTTP_404_NOT_FOUND)

        # Client 2 attempts DELETE
        resp_del = self.client2.delete(f"/api/voice/recordings/{rec.id}/")
        self.assertEqual(resp_del.status_code, status.HTTP_404_NOT_FOUND)

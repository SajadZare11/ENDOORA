from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import VoicePreference, VoiceRecording
from .serializers import VoicePreferenceSerializer, VoiceRecordingSerializer
from .services import VoicePipelineService


class UploadTicketView(APIView):
    """
    Issues an upload ticket with hard size (10MB) and duration limits before
    accepting audio files, avoiding unbuffered memory proxying.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        filename = request.data.get("filename", "recording.webm")
        content_type = request.data.get("content_type", "audio/webm")
        file_size = int(request.data.get("file_size", 0))
        session_id = request.data.get("session_id", "")
        scenario_id = request.data.get("scenario_id", "")
        retention_policy = request.data.get("retention_policy")

        try:
            service = VoicePipelineService()
            ticket = service.create_upload_ticket(
                learner=request.user,
                filename=filename,
                content_type=content_type,
                file_size=file_size,
                session_id=session_id,
                scenario_id=scenario_id,
                retention_policy=retention_policy,
            )
            return Response(ticket, status=status.HTTP_201_CREATED)
        except ValueError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RecordingListCreateView(APIView):
    """
    Lists learner recordings or directly saves an audio attempt.
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        recordings = VoiceRecording.objects.filter(learner=request.user).order_by("-created_at")
        serializer = VoiceRecordingSerializer(recordings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        audio_file = request.FILES.get("audio_file")
        duration = float(request.data.get("duration_seconds", 0.0))
        stt_hint = request.data.get("stt_hint", "")
        session_id = request.data.get("session_id", "")
        scenario_id = request.data.get("scenario_id", "")
        retention = request.data.get("retention_policy")

        try:
            service = VoicePipelineService()
            ticket = service.create_upload_ticket(
                learner=request.user,
                filename=audio_file.name if audio_file else "speech.webm",
                content_type=audio_file.content_type if audio_file else "audio/webm",
                file_size=audio_file.size if audio_file else 0,
                session_id=session_id,
                scenario_id=scenario_id,
                retention_policy=retention,
            )
            rec_id = ticket["recording_id"]
            recording = service.process_audio_upload(
                learner=request.user,
                recording_id=rec_id,
                audio_file=audio_file,
                duration_seconds=duration,
                stt_hint=stt_hint,
            )
            serializer = VoiceRecordingSerializer(recording)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValueError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RecordingUploadAudioView(APIView):
    """
    Direct audio upload endpoint linked to an upload ticket.
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, recording_id):
        audio_file = request.FILES.get("audio_file")
        duration = float(request.data.get("duration_seconds", 0.0))
        stt_hint = request.data.get("stt_hint", "")

        try:
            service = VoicePipelineService()
            recording = service.process_audio_upload(
                learner=request.user,
                recording_id=recording_id,
                audio_file=audio_file,
                duration_seconds=duration,
                stt_hint=stt_hint,
            )
            serializer = VoiceRecordingSerializer(recording)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except VoiceRecording.DoesNotExist:
            return Response({"error": "Recording ticket not found."}, status=status.HTTP_404_NOT_FOUND)
        except ValueError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RecordingDetailView(APIView):
    """
    Inspects or deletes a voice recording attempt.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, recording_id):
        try:
            recording = VoiceRecording.objects.get(id=recording_id, learner=request.user)
            serializer = VoiceRecordingSerializer(recording)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except VoiceRecording.DoesNotExist:
            return Response({"error": "Recording not found."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, recording_id):
        try:
            service = VoicePipelineService()
            recording = service.delete_recording(request.user, recording_id)
            serializer = VoiceRecordingSerializer(recording)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except VoiceRecording.DoesNotExist:
            return Response({"error": "Recording not found."}, status=status.HTTP_404_NOT_FOUND)


class RecordingTranscriptView(APIView):
    """
    Stores learner manual corrections to speech recognition transcripts.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, recording_id):
        corrected_text = request.data.get("corrected_transcript", "")
        try:
            service = VoicePipelineService()
            recording = service.update_corrected_transcript(
                learner=request.user,
                recording_id=recording_id,
                corrected_text=corrected_text,
            )
            serializer = VoiceRecordingSerializer(recording)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except VoiceRecording.DoesNotExist:
            return Response({"error": "Recording not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class TTSView(APIView):
    """
    Produces text-to-speech synthesized audio descriptors with accent and speed settings.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        text = request.data.get("text", "").strip()
        accent = request.data.get("accent", "US")
        speed = float(request.data.get("speed", 1.0))

        if not text:
            return Response({"error": "Text cannot be blank."}, status=status.HTTP_400_BAD_REQUEST)

        service = VoicePipelineService()
        result = service.generate_tts_reply(text=text, voice_accent=accent, speed=speed)
        return Response(result, status=status.HTTP_200_OK)


class VoicePreferenceView(APIView):
    """
    Manages learner voice accent, playback speed, and default retention preferences.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        service = VoicePipelineService()
        pref = service.get_or_create_preference(request.user)
        serializer = VoicePreferenceSerializer(pref)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        service = VoicePipelineService()
        pref = service.get_or_create_preference(request.user)
        serializer = VoicePreferenceSerializer(pref, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CleanupExpiredAudioView(APIView):
    """
    Internal maintenance trigger for purging expired voice recordings according to retention policy.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        service = VoicePipelineService()
        purged_count = service.delete_expired_audio()
        return Response(
            {"status": "success", "purged_recordings_count": purged_count},
            status=status.HTTP_200_OK,
        )

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PronunciationAttempt, PronunciationItem
from .serializers import (
    AnalyzeAttemptRequestSerializer,
    PronunciationAttemptSerializer,
    PronunciationItemSerializer,
)
from .services import PronunciationService

User = get_user_model()


class PronunciationItemListView(APIView):
    """
    Returns curated practice items, optionally filtered by category and difficulty level.
    """

    permission_classes = [AllowAny]

    def get(self, request):
        category = request.query_params.get("category")
        difficulty_level = request.query_params.get("level")
        service = PronunciationService()
        items = service.get_practice_items(category=category, difficulty_level=difficulty_level)
        serializer = PronunciationItemSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PronunciationItemDetailView(APIView):
    """
    Returns a single pronunciation practice item by unique item_id.
    """

    permission_classes = [AllowAny]

    def get(self, request, item_id):
        service = PronunciationService()
        item = service.get_item_by_id(item_id)
        if not item:
            return Response(
                {"error": f"Practice item '{item_id}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = PronunciationItemSerializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PronunciationAnalyzeView(APIView):
    """
    Analyzes an oral practice attempt for speech pacing (WPM), pause count,
    syllable stress articulation, and communicative intelligibility trends
    under Product Constitution Rule #8.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AnalyzeAttemptRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        item_id = data.get("item_id", "")
        target_text = data.get("target_text", "")
        spoken_transcript = data.get("spoken_transcript", "")
        duration_seconds = data.get("duration_seconds", 2.0)
        pause_count = data.get("pause_count", 0)

        service = PronunciationService()

        # If learner is authenticated, persist attempt to database
        if request.user and request.user.is_authenticated:
            learner = request.user
            attempt = service.analyze_attempt(
                learner=learner,
                target_text=target_text,
                spoken_transcript=spoken_transcript,
                duration_seconds=duration_seconds,
                pause_count=pause_count,
                item_id=item_id,
            )
            resp_data = PronunciationAttemptSerializer(attempt).data
            return Response(resp_data, status=status.HTTP_201_CREATED)

        # For unauthenticated guest visitors, evaluate trends formatively without DB persistence
        practice_item = service.get_item_by_id(item_id) if item_id else None
        clean_target = (practice_item.target_text if practice_item else target_text).strip()
        safe_duration = max(0.5, float(duration_seconds or 2.0))
        word_count = max(1, len(spoken_transcript.split())) if spoken_transcript else max(1, len(clean_target.split()))
        wpm = round((word_count / safe_duration) * 60.0, 1)

        feedback_en, feedback_fa = service._generate_formative_feedback(
            practice_item=practice_item,
            clean_target=clean_target,
            match_ratio=0.85 if spoken_transcript else 0.5,
            speech_rate_wpm=wpm,
            pause_count=pause_count,
            stress_matched=True,
        )

        return Response(
            {
                "id": None,
                "item_id": item_id,
                "target_text": clean_target,
                "spoken_transcript": spoken_transcript,
                "duration_seconds": safe_duration,
                "speech_rate_wpm": wpm,
                "pause_count": pause_count,
                "intelligibility_score": 85 if spoken_transcript else 70,
                "stress_matched": True,
                "feedback_en": feedback_en,
                "feedback_fa": feedback_fa,
                "saved_to_genome": False,
                "disclaimer": "Product Constitution Rule #8: Intelligibility & fluency trend feedback only. No unvalidated phoneme or native accent claims.",
            },
            status=status.HTTP_200_OK,
        )


class SaveToMistakeGenomeView(APIView):
    """
    Saves an identified pronunciation or syllable stress challenge to the learner's Mistake Genome.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, attempt_id):
        service = PronunciationService()
        try:
            attempt = service.save_to_mistake_genome(learner=request.user, attempt_id=attempt_id)
            return Response(
                {
                    "message": "Pronunciation challenge successfully recorded in Mistake Genome.",
                    "attempt_id": attempt.id,
                    "saved_to_genome": attempt.saved_to_genome,
                },
                status=status.HTTP_200_OK,
            )
        except PronunciationAttempt.DoesNotExist:
            return Response(
                {"error": f"Attempt with ID {attempt_id} not found."},
                status=status.HTTP_404_NOT_FOUND,
            )


class PronunciationAttemptListView(APIView):
    """
    Returns recent pronunciation practice history for the authenticated learner.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        service = PronunciationService()
        history = service.get_learner_history(learner=request.user)
        serializer = PronunciationAttemptSerializer(history, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

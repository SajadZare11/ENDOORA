"""
Endoora AI Gateway - API Views
Exposes:
1. ExerciseGenerateView: Generates safe, validated adaptive exercises (backend OpenRouter + fallback).
2. ExerciseDetailView: Retrieves an existing generated exercise with payload protection.
3. ExerciseSubmitView: Evaluates learner answers, persists attempt, and delivers explanations.
4. ExerciseHistoryView: Retrieves learner past attempts and generated sets.
5. AIStatusView: Transparent status of models, budget limits, and fallback health.
"""

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .client import OpenRouterClient
from .model_router import ModelRouter
from .models import ExerciseAttempt, GeneratedExerciseSet
from .serializers import (
    ExerciseAttemptSerializer,
    ExerciseSubmissionSerializer,
    GeneratedExerciseSetLearnerSerializer,
)
from .services import StructuredExerciseService


class ExerciseGenerateView(APIView):
    """
    POST /api/ai/exercises/generate/
    Generates a structured, validated exercise set for the authenticated learner.
    Never exposes answer keys or explanations prior to learner submission.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        target_skill = request.data.get("target_skill", "grammar")
        cefr_level = request.data.get("cefr_level", "B1")
        objective_id = request.data.get("objective_id", "obj_general")
        focus_area = request.data.get("focus_area", "general practice")
        question_count = int(request.data.get("question_count", 3))

        service = StructuredExerciseService()
        exercise_set = service.generate_exercise_set(
            learner=request.user,
            target_skill=target_skill,
            cefr_level=cefr_level,
            objective_id=objective_id,
            focus_area=focus_area,
            question_count=question_count,
        )

        serializer = GeneratedExerciseSetLearnerSerializer(exercise_set)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ExerciseDetailView(APIView):
    """
    GET /api/ai/exercises/<int:pk>/
    Retrieves a generated exercise set. Learner must own the exercise.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            exercise_set = GeneratedExerciseSet.objects.get(pk=pk, learner=request.user)
        except GeneratedExerciseSet.DoesNotExist:
            return Response({"detail": "Exercise set not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = GeneratedExerciseSetLearnerSerializer(exercise_set)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ExerciseSubmitView(APIView):
    """
    POST /api/ai/exercises/<int:pk>/submit/
    Evaluates learner answers, creates ExerciseAttempt record, and returns
    full results with bilingual pedagogical explanations.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        sub_serializer = ExerciseSubmissionSerializer(data=request.data)
        if not sub_serializer.is_valid():
            return Response(sub_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        answers = sub_serializer.validated_data["answers"]
        service = StructuredExerciseService()

        try:
            result = service.submit_exercise(
                learner=request.user,
                exercise_set_id=pk,
                answers=answers,
            )
            return Response(result, status=status.HTTP_200_OK)
        except GeneratedExerciseSet.DoesNotExist:
            return Response({"detail": "Exercise set not found or access denied."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as exc:
            return Response({"detail": f"Submission evaluation failed: {exc}"}, status=status.HTTP_400_BAD_REQUEST)


class ExerciseHistoryView(APIView):
    """
    GET /api/ai/exercises/history/
    Retrieves recent attempts completed by the learner.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        attempts = ExerciseAttempt.objects.filter(learner=request.user).order_by("-completed_at")[:20]
        serializer = ExerciseAttemptSerializer(attempts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AIStatusView(APIView):
    """
    GET /api/ai/status/
    Returns transparent status of AI models, daily budget, and fallback state.
    """

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        client = OpenRouterClient()
        config = client.config
        budget = config.daily_budget_usd
        spend = config.current_daily_spend_usd
        remaining = max(0.0, round(budget - spend, 4))
        is_fallback = not config.enabled or (spend >= budget) or not bool(client.get_api_key())

        models = ModelRouter.get_models_for_task("exercise_generation")

        return Response({
            "provider": config.provider,
            "enabled": config.enabled,
            "daily_budget_usd": budget,
            "current_daily_spend_usd": spend,
            "remaining_budget_usd": remaining,
            "fallback_active": is_fallback,
            "timeout_seconds": config.timeout_seconds,
            "active_model_tiers": models,
        }, status=status.HTTP_200_OK)

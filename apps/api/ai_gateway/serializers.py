"""
Endoora AI Gateway - Serializers
Includes:
1. GeneratedExerciseSetLearnerSerializer with pre-submission payload protection
   (strips correct_option_id and explanations so learners cannot cheat via network inspection).
2. ExerciseSubmissionSerializer for validating learner answer payloads.
3. ExerciseAttemptSerializer for recording and inspecting learner submissions.
4. AIStatusSerializer for transparent provider monitoring.
"""

from rest_framework import serializers

from .models import (
    AIProviderConfig,
    AIRequestLog,
    ExerciseAttempt,
    GeneratedExerciseSet,
)


class GeneratedExerciseSetLearnerSerializer(serializers.ModelSerializer):
    """
    Serializes exercise sets for learner practice.
    CRITICAL SECURITY & INTEGRITY RULE:
    Strips `correct_option_id`, `explanation_fa`, and `explanation_en` prior to submission.
    """

    class Meta:
        model = GeneratedExerciseSet
        fields = [
            "id",
            "title_fa",
            "title_en",
            "target_skill",
            "cefr_level",
            "objective_id",
            "questions",
            "is_fallback",
            "model_used",
            "created_at",
        ]
        read_only_fields = fields

    def to_representation(self, instance):
        data = super().to_representation(instance)
        raw_questions = data.get("questions", [])
        sanitized_questions = []

        for q in raw_questions:
            if not isinstance(q, dict):
                continue
            # Remove answer key and explanations to prevent client-side inspection cheating
            sanitized_q = {
                "id": q.get("id"),
                "type": q.get("type", "multiple_choice"),
                "title_fa": q.get("title_fa"),
                "title_en": q.get("title_en"),
                "instruction_fa": q.get("instruction_fa"),
                "instruction_en": q.get("instruction_en"),
                "prompt_en": q.get("prompt_en"),
                "options": q.get("options", []),
                "cefr_level": q.get("cefr_level"),
                "objective_id": q.get("objective_id"),
            }
            sanitized_questions.append(sanitized_q)

        data["questions"] = sanitized_questions
        return data


class ExerciseSubmissionSerializer(serializers.Serializer):
    """Validates submitted learner answer mapping."""

    answers = serializers.DictField(
        child=serializers.CharField(max_length=50, allow_blank=True),
        help_text="Dictionary mapping question_id -> selected_option_id",
    )


class ExerciseAttemptSerializer(serializers.ModelSerializer):
    """Serializes learner attempt records."""

    exercise_title = serializers.CharField(source="exercise_set.title_en", read_only=True)
    cefr_level = serializers.CharField(source="exercise_set.cefr_level", read_only=True)
    target_skill = serializers.CharField(source="exercise_set.target_skill", read_only=True)

    class Meta:
        model = ExerciseAttempt
        fields = [
            "id",
            "exercise_set",
            "exercise_title",
            "cefr_level",
            "target_skill",
            "answers",
            "score_percentage",
            "correct_count",
            "total_count",
            "completed_at",
        ]
        read_only_fields = fields


class AIProviderConfigSerializer(serializers.ModelSerializer):
    """Admin and monitoring serializer for provider configuration."""

    class Meta:
        model = AIProviderConfig
        fields = [
            "name",
            "provider",
            "timeout_seconds",
            "daily_budget_usd",
            "current_daily_spend_usd",
            "enabled",
            "updated_at",
        ]
        read_only_fields = fields


class AIStatusSerializer(serializers.Serializer):
    """Public/Learner transparency status response."""

    provider = serializers.CharField()
    enabled = serializers.BooleanField()
    daily_budget_usd = serializers.FloatField()
    current_daily_spend_usd = serializers.FloatField()
    remaining_budget_usd = serializers.FloatField()
    fallback_active = serializers.BooleanField()
    active_model_tiers = serializers.ListField(child=serializers.CharField())

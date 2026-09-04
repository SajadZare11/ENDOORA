import uuid
from rest_framework import serializers

from .models import PlacementAnswer, PlacementSession


class PlacementAnswerSerializer(serializers.ModelSerializer):
    question_version_id = serializers.UUIDField(source="question_version.id", read_only=True, allow_null=True)

    class Meta:
        model = PlacementAnswer
        fields = [
            "idempotency_key",
            "question_key",
            "question_version_id",
            "answer_value",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class PlacementAnswerCreateSerializer(serializers.Serializer):
    idempotency_key = serializers.UUIDField(default=uuid.uuid4)
    question_key = serializers.CharField(max_length=100)
    question_version_id = serializers.UUIDField(required=False, allow_null=True)
    answer_value = serializers.JSONField()

    def validate_answer_value(self, value):
        if value is None:
            raise serializers.ValidationError("answer_value cannot be null.")
        return value


PlacementAnswerSaveSerializer = PlacementAnswerCreateSerializer


class PlacementSessionSerializer(serializers.ModelSerializer):
    answers = PlacementAnswerSerializer(many=True, read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    answers_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = PlacementSession
        fields = [
            "id",
            "status",
            "current_section",
            "started_at",
            "updated_at",
            "expires_at",
            "is_expired",
            "is_active",
            "answers_count",
            "answers",
        ]
        read_only_fields = [
            "id",
            "started_at",
            "updated_at",
            "expires_at",
            "is_expired",
            "is_active",
            "answers_count",
        ]


class PlacementSectionAdvanceSerializer(serializers.Serializer):
    VALID_SECTIONS = {"grammar", "vocabulary", "reading", "listening", "review"}

    section = serializers.CharField(max_length=50)

    def validate_section(self, value):
        norm = value.strip().lower()
        if norm not in self.VALID_SECTIONS:
            raise serializers.ValidationError(f"Invalid section: {value}. Allowed: {sorted(self.VALID_SECTIONS)}")
        return norm


class PlacementQuestionItemSerializer(serializers.Serializer):
    """
    Strictly learner-safe serializer for placement questions.
    PROTECTED KEYS (answer_key, accepted_variants, rubric, correct_option, solution, explanation)
    are strictly excluded.
    """
    id = serializers.CharField()
    section = serializers.CharField()
    question_type = serializers.CharField(default="single_choice")
    title_fa = serializers.CharField(required=False, default="")
    title_en = serializers.CharField(required=False, default="")
    prompt_fa = serializers.CharField(required=False, default="")
    prompt_en = serializers.CharField()
    instructions_fa = serializers.CharField(required=False, default="")
    instructions_en = serializers.CharField(required=False, default="")
    cefr_level = serializers.CharField(default="A1")
    difficulty = serializers.CharField(default="easy")
    passage = serializers.CharField(required=False, default="")
    options = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    question_version_id = serializers.UUIDField(required=False, allow_null=True)


class PlacementSectionSummaryItemSerializer(serializers.Serializer):
    section = serializers.CharField()
    total = serializers.IntegerField()
    answered = serializers.IntegerField()
    correct = serializers.IntegerField(required=False, default=0)
    score_percentage = serializers.FloatField(required=False, default=0.0)
    objectives_covered = serializers.ListField(child=serializers.CharField(), required=False, default=list)


class PlacementSessionSummarySerializer(serializers.Serializer):
    session_id = serializers.UUIDField()
    status = serializers.CharField()
    is_submitted = serializers.BooleanField()
    current_section = serializers.CharField()
    started_at = serializers.DateTimeField()
    expires_at = serializers.DateTimeField()
    is_expired = serializers.BooleanField()
    total_questions = serializers.IntegerField()
    total_answered = serializers.IntegerField()
    overall_percentage = serializers.FloatField(allow_null=True, required=False)
    sections = serializers.DictField(child=PlacementSectionSummaryItemSerializer())
    evidence = serializers.ListField(child=serializers.DictField(), required=False, default=list)
    notice = serializers.CharField()

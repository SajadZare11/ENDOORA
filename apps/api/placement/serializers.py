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
    completed_at = serializers.DateTimeField(read_only=True, allow_null=True)
    endoora_index = serializers.SerializerMethodField()

    class Meta:
        model = PlacementSession
        fields = [
            "id",
            "status",
            "current_section",
            "started_at",
            "updated_at",
            "expires_at",
            "completed_at",
            "is_expired",
            "is_active",
            "answers_count",
            "answers",
            "endoora_index",
        ]
        read_only_fields = [
            "id",
            "started_at",
            "updated_at",
            "expires_at",
            "completed_at",
            "is_expired",
            "is_active",
            "answers_count",
            "endoora_index",
        ]

    def get_endoora_index(self, obj) -> int | None:
        if obj.status == PlacementSession.Status.SUBMITTED:
            res = getattr(obj, "result", None)
            if res and hasattr(res, "endoora_index"):
                return res.endoora_index
        return None


class PlacementSectionAdvanceSerializer(serializers.Serializer):
    VALID_SECTIONS = {
        "grammar",
        "vocabulary",
        "reading",
        "listening",
        "speaking",
        "writing",
        "review",
        "completed",
    }

    section = serializers.CharField(max_length=50, required=False, allow_blank=True)
    current_section = serializers.CharField(max_length=50, required=False, allow_blank=True)
    action = serializers.CharField(max_length=50, required=False, default="complete")
    answers = serializers.JSONField(required=False, allow_null=True)

    def validate_section(self, value):
        if not value:
            return value
        norm = value.strip().lower()
        if norm not in self.VALID_SECTIONS:
            raise serializers.ValidationError(f"Invalid section: {value}. Allowed: {sorted(self.VALID_SECTIONS)}")
        return norm

    def validate_current_section(self, value):
        if not value:
            return value
        norm = value.strip().lower()
        if norm not in self.VALID_SECTIONS:
            raise serializers.ValidationError(f"Invalid current_section: {value}. Allowed: {sorted(self.VALID_SECTIONS)}")
        return norm


class PlacementQuestionItemSerializer(serializers.Serializer):
    """
    Strictly learner-safe serializer for placement questions.
    PROTECTED KEYS (answer_key, accepted_variants, rubric, target_keywords, correct_option, solution, explanation)
    are strictly excluded.
    """
    id = serializers.CharField()
    section = serializers.CharField()
    question_type = serializers.CharField(default="single_choice")
    title_fa = serializers.CharField(required=False, default="")
    title_en = serializers.CharField(required=False, default="")
    prompt_fa = serializers.CharField(required=False, default="")
    prompt_en = serializers.CharField(required=False, default="")
    instructions_fa = serializers.CharField(required=False, default="")
    instructions_en = serializers.CharField(required=False, default="")
    cefr_level = serializers.CharField(default="A1")
    difficulty = serializers.CharField(default="easy")
    difficulty_b = serializers.FloatField(required=False, default=0.0)
    discrimination_a = serializers.FloatField(required=False, default=1.0)
    passage = serializers.CharField(required=False, default="")
    audio_url = serializers.CharField(required=False, default="", allow_blank=True)
    play_limit = serializers.IntegerField(required=False, default=2)
    recording_time_limit_sec = serializers.IntegerField(required=False, default=60)
    min_words_expected = serializers.IntegerField(required=False, default=10)
    max_words_expected = serializers.IntegerField(required=False, default=100)
    options = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    question_version_id = serializers.UUIDField(required=False, allow_null=True)


class PlacementSectionSummaryItemSerializer(serializers.Serializer):
    section = serializers.CharField()
    total = serializers.IntegerField()
    answered = serializers.IntegerField()
    correct = serializers.IntegerField(required=False, default=0)
    score_percentage = serializers.FloatField(required=False, default=0.0)
    endoora_index = serializers.IntegerField(required=False, default=0)
    cefr_level = serializers.CharField(required=False, default="A1")
    objectives_covered = serializers.ListField(child=serializers.CharField(), required=False, default=list)


class PlacementSessionSummarySerializer(serializers.Serializer):
    session_id = serializers.UUIDField()
    status = serializers.CharField()
    is_submitted = serializers.BooleanField()
    current_section = serializers.CharField()
    started_at = serializers.DateTimeField()
    expires_at = serializers.DateTimeField()
    completed_at = serializers.DateTimeField(allow_null=True, required=False)
    is_expired = serializers.BooleanField()
    total_questions = serializers.IntegerField()
    total_answered = serializers.IntegerField()
    overall_percentage = serializers.FloatField(allow_null=True, required=False)
    endoora_index = serializers.IntegerField(allow_null=True, required=False)
    theta = serializers.FloatField(allow_null=True, required=False)
    standard_error = serializers.FloatField(allow_null=True, required=False)
    estimated_cefr_level = serializers.CharField(allow_null=True, required=False, default="A1")
    sections = serializers.DictField(child=PlacementSectionSummaryItemSerializer())
    evidence = serializers.ListField(child=serializers.DictField(), required=False, default=list)
    can_do_statements = serializers.ListField(child=serializers.DictField(), required=False, default=list)
    curriculum_recommendations = serializers.ListField(child=serializers.DictField(), required=False, default=list)
    notice = serializers.CharField()

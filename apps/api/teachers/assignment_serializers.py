from __future__ import annotations

from decimal import Decimal
from rest_framework import serializers

from teachers.models import (
    Assignment,
    AssignmentAccommodation,
    AssignmentAttempt,
    AssignmentQuestion,
    AssignmentStatus,
    AttemptStatus,
)


class AssignmentQuestionSerializer(serializers.ModelSerializer):
    question_version_id = serializers.UUIDField(source="question_version.id")
    slug = serializers.CharField(source="question_version.question.slug", read_only=True)
    title_fa = serializers.CharField(source="question_version.title_fa", read_only=True)
    title_en = serializers.CharField(source="question_version.title_en", read_only=True)
    prompt_fa = serializers.CharField(source="question_version.prompt_fa", read_only=True)
    prompt_en = serializers.CharField(source="question_version.prompt_en", read_only=True)
    question_type = serializers.CharField(source="question_version.question_type", read_only=True)
    cefr_level = serializers.CharField(source="question_version.cefr_level", read_only=True)
    difficulty = serializers.IntegerField(source="question_version.difficulty", read_only=True)

    class Meta:
        model = AssignmentQuestion
        fields = [
            "id",
            "question_version_id",
            "order",
            "points",
            "custom_instructions",
            "slug",
            "title_fa",
            "title_en",
            "prompt_fa",
            "prompt_en",
            "question_type",
            "cefr_level",
            "difficulty",
            "created_at",
        ]


class AssignmentAccommodationSerializer(serializers.ModelSerializer):
    learner_id = serializers.UUIDField(source="learner.id")
    learner_email = serializers.CharField(source="learner.email", read_only=True)
    learner_name = serializers.SerializerMethodField()

    class Meta:
        model = AssignmentAccommodation
        fields = [
            "id",
            "assignment_id",
            "learner_id",
            "learner_email",
            "learner_name",
            "extra_time_minutes",
            "extra_attempts",
            "extended_due_date",
            "notes",
            "created_at",
            "updated_at",
        ]

    def get_learner_name(self, obj) -> str:
        return obj.learner.get_full_name() or obj.learner.email


class AssignmentDetailSerializer(serializers.ModelSerializer):
    teacher_class_id = serializers.UUIDField(source="teacher_class.id", read_only=True)
    teacher_class_title = serializers.CharField(source="teacher_class.title", read_only=True)
    teacher_name = serializers.SerializerMethodField()
    questions = AssignmentQuestionSerializer(source="assignment_questions", many=True, read_only=True)
    accommodations = AssignmentAccommodationSerializer(many=True, read_only=True)
    submissions_count = serializers.SerializerMethodField()
    graded_count = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = [
            "id",
            "teacher_class_id",
            "teacher_class_title",
            "teacher_id",
            "teacher_name",
            "title",
            "description",
            "instructions",
            "target_cefr",
            "status",
            "due_date",
            "grace_period_minutes",
            "allow_late_submission",
            "max_attempts",
            "time_limit_minutes",
            "total_points",
            "passing_percentage",
            "version",
            "published_at",
            "created_at",
            "updated_at",
            "questions",
            "accommodations",
            "submissions_count",
            "graded_count",
        ]

    def get_teacher_name(self, obj) -> str:
        return obj.teacher.get_full_name() or obj.teacher.email

    def get_submissions_count(self, obj) -> int:
        return obj.attempts.filter(status__in=[AttemptStatus.SUBMITTED, AttemptStatus.GRADED, AttemptStatus.TIMED_OUT]).count()

    def get_graded_count(self, obj) -> int:
        return obj.attempts.filter(status=AttemptStatus.GRADED).count()


class AssignmentListSerializer(serializers.ModelSerializer):
    teacher_class_id = serializers.UUIDField(source="teacher_class.id", read_only=True)
    teacher_class_title = serializers.CharField(source="teacher_class.title", read_only=True)
    questions_count = serializers.SerializerMethodField()
    submissions_count = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = [
            "id",
            "teacher_class_id",
            "teacher_class_title",
            "title",
            "target_cefr",
            "status",
            "due_date",
            "total_points",
            "version",
            "questions_count",
            "submissions_count",
            "created_at",
            "updated_at",
        ]

    def get_questions_count(self, obj) -> int:
        return obj.assignment_questions.count()

    def get_submissions_count(self, obj) -> int:
        return obj.attempts.filter(status__in=[AttemptStatus.SUBMITTED, AttemptStatus.GRADED, AttemptStatus.TIMED_OUT]).count()


class AssignmentCreateDraftSerializer(serializers.Serializer):
    class_id = serializers.UUIDField(required=True)
    title = serializers.CharField(max_length=255, required=True)
    description = serializers.CharField(required=False, allow_blank=True, default="")
    instructions = serializers.CharField(required=False, allow_blank=True, default="")
    target_cefr = serializers.CharField(max_length=16, required=False, default="B1")


class AssignmentQuestionItemSerializer(serializers.Serializer):
    question_version_id = serializers.UUIDField(required=True)
    points = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, default=Decimal("10.00"))
    custom_instructions = serializers.CharField(required=False, allow_blank=True, default="")


class AssignmentQuestionsInputSerializer(serializers.Serializer):
    questions = AssignmentQuestionItemSerializer(many=True, required=True)
    expected_version = serializers.IntegerField(required=False, allow_null=True)


class AssignmentDeliveryInputSerializer(serializers.Serializer):
    due_date = serializers.DateTimeField(required=True)
    grace_period_minutes = serializers.IntegerField(required=False, default=0, min_value=0)
    allow_late_submission = serializers.BooleanField(required=False, default=False)
    max_attempts = serializers.IntegerField(required=False, default=1, min_value=1)
    time_limit_minutes = serializers.IntegerField(required=False, allow_null=True, min_value=1)
    passing_percentage = serializers.IntegerField(required=False, default=60, min_value=0, max_value=100)
    expected_version = serializers.IntegerField(required=False, allow_null=True)


class AssignmentAccommodationInputSerializer(serializers.Serializer):
    learner_id = serializers.UUIDField(required=True)
    extra_time_minutes = serializers.IntegerField(required=False, default=0, min_value=0)
    extra_attempts = serializers.IntegerField(required=False, default=0, min_value=0)
    extended_due_date = serializers.DateTimeField(required=False, allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True, default="")


class AssignmentAttemptSerializer(serializers.ModelSerializer):
    assignment_id = serializers.UUIDField(source="assignment.id", read_only=True)
    assignment_title = serializers.CharField(source="assignment.title", read_only=True)
    learner_id = serializers.UUIDField(source="learner.id", read_only=True)
    learner_email = serializers.CharField(source="learner.email", read_only=True)
    learner_name = serializers.SerializerMethodField()

    class Meta:
        model = AssignmentAttempt
        fields = [
            "id",
            "assignment_id",
            "assignment_title",
            "learner_id",
            "learner_email",
            "learner_name",
            "attempt_number",
            "status",
            "started_at",
            "submitted_at",
            "time_limit_expires_at",
            "answers_payload",
            "grading_results",
            "score_awarded",
            "percentage",
            "is_late",
            "teacher_feedback",
            "graded_at",
            "created_at",
            "updated_at",
        ]

    def get_learner_name(self, obj) -> str:
        return obj.learner.get_full_name() or obj.learner.email


class AutosaveInputSerializer(serializers.Serializer):
    answers = serializers.DictField(required=True)


class SubmitInputSerializer(serializers.Serializer):
    answers = serializers.DictField(required=False, allow_null=True)


class GradeAttemptInputSerializer(serializers.Serializer):
    score_awarded = serializers.DecimalField(max_digits=6, decimal_places=2, required=True)
    teacher_feedback = serializers.CharField(required=False, allow_blank=True, default="")

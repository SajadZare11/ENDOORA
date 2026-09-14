from rest_framework import serializers
from ielts.models import (
    IELTSTest,
    IELTSSection,
    IELTSPassageTask,
    IELTSQuestionGroup,
    IELTSQuestion,
    IELTSBandDescriptor,
    IELTSTestSession,
    IELTSPracticeMode,
    IELTSWritingSubmission,
    IELTSWritingSubmissionStatus,
)


class IELTSQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = IELTSQuestion
        fields = [
            "id",
            "group",
            "question_number",
            "prompt_text",
            "options",
            "correct_answers",
            "explanation",
            "max_score",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class IELTSQuestionGroupSerializer(serializers.ModelSerializer):
    questions = IELTSQuestionSerializer(many=True, read_only=True)
    question_type_display = serializers.CharField(source="get_question_type_display", read_only=True)

    class Meta:
        model = IELTSQuestionGroup
        fields = [
            "id",
            "passage_task",
            "question_type",
            "question_type_display",
            "order",
            "instructions",
            "heading_options",
            "questions",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class IELTSPassageTaskSerializer(serializers.ModelSerializer):
    question_groups = IELTSQuestionGroupSerializer(many=True, read_only=True)

    class Meta:
        model = IELTSPassageTask
        fields = [
            "id",
            "section",
            "order",
            "title",
            "content_text",
            "media_image_url",
            "word_count",
            "metadata",
            "question_groups",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class IELTSSectionSerializer(serializers.ModelSerializer):
    passages_tasks = IELTSPassageTaskSerializer(many=True, read_only=True)
    section_type_display = serializers.CharField(source="get_section_type_display", read_only=True)

    class Meta:
        model = IELTSSection
        fields = [
            "id",
            "test",
            "section_type",
            "section_type_display",
            "order",
            "duration_minutes",
            "instructions_en",
            "instructions_fa",
            "audio_media_url",
            "audio_script",
            "passages_tasks",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class IELTSTestListSerializer(serializers.ModelSerializer):
    test_type_display = serializers.CharField(source="get_test_type_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    author_name = serializers.SerializerMethodField()
    reviewer_name = serializers.SerializerMethodField()
    sections_count = serializers.IntegerField(source="sections.count", read_only=True)
    total_questions = serializers.SerializerMethodField()

    class Meta:
        model = IELTSTest
        fields = [
            "id",
            "title_en",
            "title_fa",
            "test_type",
            "test_type_display",
            "version",
            "status",
            "status_display",
            "author",
            "author_name",
            "reviewed_by",
            "reviewer_name",
            "reviewed_at",
            "is_locked",
            "copyright_source",
            "disclaimer_label",
            "total_duration_minutes",
            "difficulty_level",
            "sections_count",
            "total_questions",
            "created_at",
            "updated_at",
        ]

    def get_author_name(self, obj) -> str:
        if not obj.author:
            return "مؤلف ناشناس"
        return f"{obj.author.first_name} {obj.author.last_name}".strip() or obj.author.email

    def get_reviewer_name(self, obj) -> str:
        if not obj.reviewed_by:
            return "—"
        return f"{obj.reviewed_by.first_name} {obj.reviewed_by.last_name}".strip() or obj.reviewed_by.email

    def get_total_questions(self, obj) -> int:
        return IELTSQuestion.objects.filter(group__passage_task__section__test=obj).count()


class IELTSTestDetailSerializer(serializers.ModelSerializer):
    sections = IELTSSectionSerializer(many=True, read_only=True)
    test_type_display = serializers.CharField(source="get_test_type_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    author_name = serializers.SerializerMethodField()
    reviewer_name = serializers.SerializerMethodField()

    class Meta:
        model = IELTSTest
        fields = [
            "id",
            "title_en",
            "title_fa",
            "test_type",
            "test_type_display",
            "version",
            "status",
            "status_display",
            "author",
            "author_name",
            "reviewed_by",
            "reviewer_name",
            "reviewed_at",
            "review_notes",
            "is_locked",
            "quality_checklist",
            "copyright_source",
            "disclaimer_label",
            "total_duration_minutes",
            "difficulty_level",
            "sections",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "version",
            "status",
            "reviewed_by",
            "reviewed_at",
            "is_locked",
            "created_at",
            "updated_at",
        ]

    def get_author_name(self, obj) -> str:
        if not obj.author:
            return "مؤلف ناشناس"
        return f"{obj.author.first_name} {obj.author.last_name}".strip() or obj.author.email

    def get_reviewer_name(self, obj) -> str:
        if not obj.reviewed_by:
            return "—"
        return f"{obj.reviewed_by.first_name} {obj.reviewed_by.last_name}".strip() or obj.reviewed_by.email


class IELTSBandDescriptorSerializer(serializers.ModelSerializer):
    criteria_key_display = serializers.CharField(source="get_criteria_key_display", read_only=True)

    class Meta:
        model = IELTSBandDescriptor
        fields = [
            "id",
            "criteria_key",
            "criteria_key_display",
            "band_level",
            "section_type",
            "public_descriptor_en",
            "pedagogical_guidance_fa",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class ReviewApprovalInputSerializer(serializers.Serializer):
    checklist = serializers.JSONField(
        required=True,
        help_text="Dictionary containing confirmation of all quality checkpoints",
    )
    notes = serializers.CharField(
        required=False,
        allow_blank=True,
        default="",
        help_text="Reviewer sign-off notes",
    )


class LearnerSafeQuestionSerializer(serializers.ModelSerializer):
    """
    CRITICAL SECURITY SERIALIZER: Excludes correct_answers and explanation during active exam attempts.
    """
    class Meta:
        model = IELTSQuestion
        fields = [
            "id",
            "group",
            "question_number",
            "prompt_text",
            "options",
            "max_score",
        ]
        read_only_fields = fields


class LearnerSafeQuestionGroupSerializer(serializers.ModelSerializer):
    questions = LearnerSafeQuestionSerializer(many=True, read_only=True)
    question_type_display = serializers.CharField(source="get_question_type_display", read_only=True)

    class Meta:
        model = IELTSQuestionGroup
        fields = [
            "id",
            "passage_task",
            "question_type",
            "question_type_display",
            "order",
            "instructions",
            "heading_options",
            "questions",
        ]
        read_only_fields = fields


class LearnerSafePassageTaskSerializer(serializers.ModelSerializer):
    question_groups = LearnerSafeQuestionGroupSerializer(many=True, read_only=True)

    class Meta:
        model = IELTSPassageTask
        fields = [
            "id",
            "section",
            "order",
            "title",
            "content_text",
            "media_image_url",
            "word_count",
            "metadata",
            "question_groups",
        ]
        read_only_fields = fields


class LearnerSafeSectionSerializer(serializers.ModelSerializer):
    passages_tasks = LearnerSafePassageTaskSerializer(many=True, read_only=True)
    section_type_display = serializers.CharField(source="get_section_type_display", read_only=True)

    class Meta:
        model = IELTSSection
        fields = [
            "id",
            "test",
            "section_type",
            "section_type_display",
            "order",
            "duration_minutes",
            "instructions_en",
            "instructions_fa",
            "audio_media_url",
            "audio_script",
            "passages_tasks",
        ]
        read_only_fields = fields


class LearnerActiveSessionSerializer(serializers.ModelSerializer):
    test_title_en = serializers.CharField(source="test.title_en", read_only=True)
    test_title_fa = serializers.CharField(source="test.title_fa", read_only=True)
    test_type = serializers.CharField(source="test.test_type", read_only=True)
    disclaimer_label = serializers.CharField(source="test.disclaimer_label", read_only=True)
    sections = LearnerSafeSectionSerializer(source="test.sections", many=True, read_only=True)
    time_remaining_seconds = serializers.IntegerField(read_only=True)

    class Meta:
        model = IELTSTestSession
        fields = [
            "id",
            "test",
            "test_title_en",
            "test_title_fa",
            "test_type",
            "mode",
            "status",
            "current_section_index",
            "started_at",
            "expires_at",
            "time_remaining_seconds",
            "responses",
            "flagged_questions",
            "disclaimer_label",
            "sections",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class IELTSSessionHistorySerializer(serializers.ModelSerializer):
    test_title_en = serializers.CharField(source="test.title_en", read_only=True)
    test_title_fa = serializers.CharField(source="test.title_fa", read_only=True)
    test_type = serializers.CharField(source="test.test_type", read_only=True)

    class Meta:
        model = IELTSTestSession
        fields = [
            "id",
            "test",
            "test_title_en",
            "test_title_fa",
            "test_type",
            "mode",
            "status",
            "started_at",
            "completed_at",
            "raw_score",
            "scaled_band_score",
            "section_scores",
            "created_at",
        ]
        read_only_fields = fields


class StartSessionInputSerializer(serializers.Serializer):
    test_id = serializers.UUIDField(required=True)
    mode = serializers.CharField(default=IELTSPracticeMode.FULL_SIMULATION)


class RecordAnswerInputSerializer(serializers.Serializer):
    question_id = serializers.UUIDField(required=True)
    answer = serializers.JSONField(required=True)


class IELTSWritingPromptSerializer(serializers.Serializer):
    id = serializers.CharField()
    title = serializers.CharField()
    content_text = serializers.CharField()
    media_image_url = serializers.CharField(allow_blank=True, required=False)
    word_count = serializers.IntegerField()
    task_type = serializers.CharField()
    test_id = serializers.CharField(allow_null=True, required=False)


class IELTSWritingDraftSerializer(serializers.ModelSerializer):
    class Meta:
        model = IELTSWritingSubmission
        fields = [
            "id",
            "test",
            "session",
            "status",
            "task1_prompt_title",
            "task1_prompt_text",
            "task1_image_url",
            "task1_text",
            "task1_word_count",
            "task1_time_seconds",
            "task2_prompt_title",
            "task2_prompt_text",
            "task2_text",
            "task2_word_count",
            "task2_time_seconds",
            "updated_at",
        ]
        read_only_fields = ["id", "status", "updated_at"]


class IELTSWritingSubmitInputSerializer(serializers.Serializer):
    submission_id = serializers.UUIDField(required=False, allow_null=True)
    test_id = serializers.UUIDField(required=False, allow_null=True)
    session_id = serializers.UUIDField(required=False, allow_null=True)
    task1_prompt_title = serializers.CharField(required=False, allow_blank=True, default="")
    task1_prompt_text = serializers.CharField(required=False, allow_blank=True, default="")
    task1_image_url = serializers.CharField(required=False, allow_blank=True, default="")
    task1_text = serializers.CharField(required=False, allow_blank=True, default="")
    task1_time_seconds = serializers.IntegerField(required=False, default=0)
    task2_prompt_title = serializers.CharField(required=False, allow_blank=True, default="")
    task2_prompt_text = serializers.CharField(required=False, allow_blank=True, default="")
    task2_text = serializers.CharField(required=False, allow_blank=True, default="")
    task2_time_seconds = serializers.IntegerField(required=False, default=0)


class IELTSWritingReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = IELTSWritingSubmission
        fields = [
            "id",
            "learner",
            "test",
            "session",
            "status",
            "task1_prompt_title",
            "task1_prompt_text",
            "task1_image_url",
            "task1_text",
            "task1_word_count",
            "task1_time_seconds",
            "task1_scores",
            "task2_prompt_title",
            "task2_prompt_text",
            "task2_text",
            "task2_word_count",
            "task2_time_seconds",
            "task2_scores",
            "overall_band",
            "overall_band_min",
            "overall_band_max",
            "confidence_score",
            "cefr_level",
            "criteria_breakdown",
            "annotations",
            "pedagogical_advice",
            "teacher_review_requested",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class IELTSWritingHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = IELTSWritingSubmission
        fields = [
            "id",
            "status",
            "task1_prompt_title",
            "task2_prompt_title",
            "task1_word_count",
            "task2_word_count",
            "overall_band",
            "overall_band_min",
            "overall_band_max",
            "cefr_level",
            "confidence_score",
            "teacher_review_requested",
            "created_at",
        ]
        read_only_fields = fields



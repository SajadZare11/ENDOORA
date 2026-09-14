from rest_framework import serializers
from ielts.models import (
    IELTSTest,
    IELTSSection,
    IELTSPassageTask,
    IELTSQuestionGroup,
    IELTSQuestion,
    IELTSBandDescriptor,
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

from rest_framework import serializers
from .models import (
    ClassEnrollmentRequest,
    ClassFormat,
    CurriculumBookMapping,
    LiveClassCohort,
    TeacherSessionLog,
)


class CurriculumBookMappingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurriculumBookMapping
        fields = [
            "id",
            "slug",
            "track",
            "min_cefr",
            "max_cefr",
            "min_age",
            "max_age",
            "book_title",
            "publisher",
            "edition",
            "description_fa",
            "description_en",
            "cover_image_url",
            "syllabus_json",
        ]


class ClassEnrollmentRequestInputSerializer(serializers.Serializer):
    preferred_format = serializers.ChoiceField(
        choices=ClassFormat.choices,
        default=ClassFormat.GROUP,
    )
    max_classmates = serializers.IntegerField(default=3, min_value=1, max_value=3)
    available_slots = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        default=list,
    )
    notes = serializers.CharField(required=False, allow_blank=True, default="")


class TeacherSessionLogInputSerializer(serializers.Serializer):
    cohort_id = serializers.UUIDField()
    units_covered = serializers.CharField(max_length=255)
    grammar_covered = serializers.CharField(required=False, allow_blank=True, default="")
    vocabulary_list = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list,
    )
    homework_description = serializers.CharField(required=False, allow_blank=True, default="")
    teacher_notes = serializers.CharField(required=False, allow_blank=True, default="")
    next_session_at = serializers.DateTimeField(required=False, allow_null=True)


class ClaimCohortInputSerializer(serializers.Serializer):
    request_ids = serializers.ListField(
        child=serializers.UUIDField(),
        min_length=1,
        max_length=4,
    )
    title = serializers.CharField(max_length=255, required=False, allow_blank=True, default="")
    meeting_url = serializers.URLField(max_length=500, required=False, allow_blank=True, default="")
    schedule_summary = serializers.CharField(max_length=255, required=False, allow_blank=True, default="")
    next_session_at = serializers.DateTimeField(required=False, allow_null=True)

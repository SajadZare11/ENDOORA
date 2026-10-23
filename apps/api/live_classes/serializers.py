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


class LiveClassTokenInputSerializer(serializers.Serializer):
    session_id = serializers.CharField(max_length=64)
    role = serializers.ChoiceField(choices=["teacher", "student"], default="student")


class LiveClassTokenResponseSerializer(serializers.Serializer):
    token = serializers.CharField()
    server_url = serializers.CharField()
    room_name = serializers.CharField()
    identity = serializers.CharField()
    display_name = serializers.CharField()
    is_teacher = serializers.BooleanField()


class AttendanceRecordSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    student_email = serializers.EmailField(source="student.email", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        from .models import AttendanceRecord
        model = AttendanceRecord
        fields = [
            "id",
            "session_id",
            "student_id",
            "student_name",
            "student_email",
            "first_joined_at",
            "last_left_at",
            "total_connected_seconds",
            "attendance_percentage",
            "status",
            "status_display",
            "is_auto_verified",
            "teacher_override",
            "teacher_override_reason",
            "created_at",
            "updated_at",
        ]

    def get_student_name(self, obj):
        return getattr(obj.student, "get_full_name", lambda: "")() or obj.student.email


class TeacherAttendanceOverrideInputSerializer(serializers.Serializer):
    student_id = serializers.CharField()
    status = serializers.ChoiceField(choices=["present", "absent", "tardy", "excused"])
    reason = serializers.CharField(required=False, allow_blank=True, default="")


class LaunchQuizInputSerializer(serializers.Serializer):
    session_id = serializers.CharField(max_length=64)
    prompt = serializers.CharField(required=False, allow_blank=True, default="")
    options = serializers.ListField(child=serializers.CharField(), min_length=2, max_length=6)
    correct_option_index = serializers.IntegerField(required=False, allow_null=True, default=None)
    duration_seconds = serializers.IntegerField(default=45, min_value=10, max_value=300)


class SubmitQuizResponseInputSerializer(serializers.Serializer):
    selected_option_index = serializers.IntegerField(min_value=0)
    time_to_respond_seconds = serializers.FloatField(default=0.0, min_value=0.0)


class WhiteboardPdfUploadSerializer(serializers.Serializer):
    session_id = serializers.CharField(max_length=64)
    pdf_file = serializers.FileField()
    page_count = serializers.IntegerField(default=1, min_value=1)


class GenerateAiRecapInputSerializer(serializers.Serializer):
    session_id = serializers.CharField(max_length=64)
    topics_covered = serializers.CharField(required=False, allow_blank=True, default="")
    whiteboard_text = serializers.CharField(required=False, allow_blank=True, default="")
    teacher_notes = serializers.CharField(required=False, allow_blank=True, default="")
    chat_logs = serializers.CharField(required=False, allow_blank=True, default="")


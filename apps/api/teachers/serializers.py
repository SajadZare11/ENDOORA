from rest_framework import serializers


PRIMARY_ACTION_CHOICES = (
    "verify_profile",
    "teach_next_session",
    "answer_request",
    "grade_work",
    "complete_profile",
    "prepare_first_class",
)

QUICK_LINK_CHOICES = (
    "question_bank",
    "fixed_class",
)

EVENT_ACTION_CHOICES = PRIMARY_ACTION_CHOICES + QUICK_LINK_CHOICES


class TeacherPrimaryActionSerializer(serializers.Serializer):
    id = serializers.ChoiceField(choices=PRIMARY_ACTION_CHOICES)
    href = serializers.CharField(max_length=180)
    title_fa = serializers.CharField(max_length=180)
    title_en = serializers.CharField(max_length=180)
    description_fa = serializers.CharField(max_length=320)
    description_en = serializers.CharField(max_length=320)
    reason_fa = serializers.CharField(max_length=320)
    reason_en = serializers.CharField(max_length=320)


class TeacherCapabilitySerializer(serializers.Serializer):
    teacher_verified = serializers.BooleanField()
    marketplace_eligible = serializers.BooleanField()
    paid_class_eligible = serializers.BooleanField()


class CountSummarySerializer(serializers.Serializer):
    available = serializers.BooleanField()
    count = serializers.IntegerField(min_value=0, allow_null=True)
    note_fa = serializers.CharField(max_length=260)
    note_en = serializers.CharField(max_length=260)


class ScheduleSummarySerializer(serializers.Serializer):
    available = serializers.BooleanField()
    next_session = serializers.DictField(allow_null=True)
    note_fa = serializers.CharField(max_length=260)
    note_en = serializers.CharField(max_length=260)


class EarningsSummarySerializer(serializers.Serializer):
    available = serializers.BooleanField()
    amount_toman = serializers.IntegerField(min_value=0, allow_null=True)
    note_fa = serializers.CharField(max_length=260)
    note_en = serializers.CharField(max_length=260)


class TeacherQuickLinkSerializer(serializers.Serializer):
    id = serializers.ChoiceField(choices=QUICK_LINK_CHOICES)
    href = serializers.CharField(max_length=180)
    title_fa = serializers.CharField(max_length=160)
    title_en = serializers.CharField(max_length=160)
    description_fa = serializers.CharField(max_length=300)
    description_en = serializers.CharField(max_length=300)
    status = serializers.ChoiceField(choices=("foundation", "locked"))
    requires_verification = serializers.BooleanField()


class TeacherDashboardSerializer(serializers.Serializer):
    user_id = serializers.UUIDField()
    greeting_name = serializers.CharField(max_length=150)
    preferred_locale = serializers.ChoiceField(choices=("fa", "en"))
    verification_status = serializers.ChoiceField(choices=("verified", "unverified"))
    profile_completeness_percent = serializers.IntegerField(min_value=0, max_value=100)
    capabilities = TeacherCapabilitySerializer()
    primary_action = TeacherPrimaryActionSerializer()
    classes = CountSummarySerializer()
    students = CountSummarySerializer()
    learn_now_requests = CountSummarySerializer()
    pending_grading = CountSummarySerializer()
    schedule = ScheduleSummarySerializer()
    earnings = EarningsSummarySerializer()
    quick_links = TeacherQuickLinkSerializer(many=True)
    privacy_notice_fa = serializers.CharField(max_length=360)
    privacy_notice_en = serializers.CharField(max_length=360)
    limitations_fa = serializers.ListField(child=serializers.CharField(max_length=280))
    limitations_en = serializers.ListField(child=serializers.CharField(max_length=280))
    generated_at = serializers.DateTimeField()


class TeacherDashboardEventSerializer(serializers.Serializer):
    event_name = serializers.ChoiceField(
        choices=("primary_cta_click", "quick_link_click")
    )
    action_id = serializers.ChoiceField(choices=EVENT_ACTION_CHOICES)


# Day 33 Serializers: Classes, Learners, Sessions, and Hours Ledger

class TeacherClassSerializer(serializers.ModelSerializer):
    enrolled_students_count = serializers.IntegerField(source="enrollments.count", read_only=True)
    sessions_count = serializers.IntegerField(source="sessions.count", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        from teachers.models import TeacherClass
        model = TeacherClass
        fields = [
            "id",
            "title",
            "description",
            "subject",
            "level",
            "status",
            "status_display",
            "max_capacity",
            "objectives",
            "private_notes",
            "enrolled_students_count",
            "sessions_count",
            "created_at",
            "updated_at",
        ]


class TeacherLearnerLinkSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    learner_email = serializers.CharField(source="learner.email", read_only=True)
    class_title = serializers.CharField(source="teacher_class.title", read_only=True)

    class Meta:
        from teachers.models import TeacherLearnerLink
        model = TeacherLearnerLink
        fields = [
            "id",
            "teacher_class",
            "class_title",
            "learner",
            "learner_email",
            "status",
            "status_display",
            "invite_code",
            "consent_given_at",
            "terminated_at",
            "termination_reason",
            "created_at",
        ]


class ClassSessionSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    class_title = serializers.CharField(source="teacher_class.title", read_only=True)
    learner_email = serializers.CharField(source="learner.email", read_only=True, allow_null=True)

    class Meta:
        from teachers.models import ClassSession
        model = ClassSession
        fields = [
            "id",
            "teacher_class",
            "class_title",
            "learner",
            "learner_email",
            "title",
            "scheduled_start",
            "scheduled_end",
            "duration_minutes",
            "status",
            "status_display",
            "session_notes",
            "completed_at",
            "confirmed_by_teacher",
            "confirmed_by_learner",
            "created_at",
        ]


class TeachingHourAuditLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source="actor.email", read_only=True)

    class Meta:
        from teachers.models import TeachingHourAuditLog
        model = TeachingHourAuditLog
        fields = [
            "id",
            "action",
            "actor_email",
            "previous_hours",
            "new_hours",
            "reason",
            "timestamp",
        ]


class TeachingHourLedgerSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    session_title = serializers.CharField(source="session.title", read_only=True)
    session_date = serializers.DateTimeField(source="session.scheduled_start", read_only=True)
    audit_logs = TeachingHourAuditLogSerializer(many=True, read_only=True)

    class Meta:
        from teachers.models import TeachingHourLedger
        model = TeachingHourLedger
        fields = [
            "id",
            "session",
            "session_title",
            "session_date",
            "hours",
            "status",
            "status_display",
            "is_verified",
            "audit_logs",
            "created_at",
            "updated_at",
        ]


class CreateClassInputSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    subject = serializers.CharField(max_length=128)
    level = serializers.CharField(max_length=16, default="B1")
    max_capacity = serializers.IntegerField(min_value=1, default=1)
    objectives = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    private_notes = serializers.CharField(required=False, default="", allow_blank=True)


class ScheduleSessionInputSerializer(serializers.Serializer):
    class_id = serializers.UUIDField()
    learner_id = serializers.UUIDField(required=False, allow_null=True)
    title = serializers.CharField(max_length=255)
    scheduled_start = serializers.DateTimeField()
    scheduled_end = serializers.DateTimeField()
    duration_minutes = serializers.IntegerField(min_value=15, default=60)
    session_notes = serializers.CharField(required=False, default="", allow_blank=True)


class AdjustHoursInputSerializer(serializers.Serializer):
    new_hours = serializers.DecimalField(max_digits=5, decimal_places=2, min_value=0)
    reason = serializers.CharField(min_length=5)


class InviteLearnerInputSerializer(serializers.Serializer):
    learner_email = serializers.EmailField(required=False)
    learner_id = serializers.UUIDField(required=False)

    def validate(self, attrs):
        if not attrs.get("learner_email") and not attrs.get("learner_id"):
            raise serializers.ValidationError("Either learner_email or learner_id must be provided.")
        return attrs


class LearnerConsentInputSerializer(serializers.Serializer):
    invite_code = serializers.CharField(max_length=64)


class TerminateLinkInputSerializer(serializers.Serializer):
    reason = serializers.CharField(required=False, default="", allow_blank=True)


class CompleteSessionInputSerializer(serializers.Serializer):
    session_notes = serializers.CharField(required=False, default="", allow_blank=True)
    confirmed_by_learner = serializers.BooleanField(required=False, default=False)

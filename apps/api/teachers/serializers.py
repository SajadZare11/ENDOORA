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

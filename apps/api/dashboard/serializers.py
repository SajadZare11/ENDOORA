from rest_framework import serializers


ACTION_CHOICES = (
    "urgent_assignment",
    "continue_mission",
    "review_vocabulary",
    "start_placement",
    "join_next_class",
    "start_learning",
)


class PrimaryActionSerializer(serializers.Serializer):
    id = serializers.ChoiceField(choices=ACTION_CHOICES)
    href = serializers.CharField(max_length=160)
    title_fa = serializers.CharField(max_length=160)
    title_en = serializers.CharField(max_length=160)
    description_fa = serializers.CharField(max_length=300)
    description_en = serializers.CharField(max_length=300)
    reason_fa = serializers.CharField(max_length=300)
    reason_en = serializers.CharField(max_length=300)


class TodayMissionSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    mission_date = serializers.DateField()
    status = serializers.ChoiceField(choices=("ready", "in_progress", "completed"))
    title_fa = serializers.CharField(max_length=200)
    title_en = serializers.CharField(max_length=200)
    description_fa = serializers.CharField()
    description_en = serializers.CharField()
    reason_fa = serializers.CharField(allow_blank=True, max_length=300)
    reason_en = serializers.CharField(allow_blank=True, max_length=300)


class PathStepSerializer(serializers.Serializer):
    id = serializers.ChoiceField(
        choices=("placement", "personal_path", "daily_growth")
    )
    label_fa = serializers.CharField(max_length=120)
    label_en = serializers.CharField(max_length=120)
    state = serializers.ChoiceField(choices=("complete", "current", "locked"))


class SkillSnapshotSerializer(serializers.Serializer):
    id = serializers.ChoiceField(
        choices=("speaking", "listening", "reading", "writing", "grammar", "vocabulary")
    )
    label_fa = serializers.CharField(max_length=80)
    label_en = serializers.CharField(max_length=80)
    status_fa = serializers.CharField(max_length=120)
    status_en = serializers.CharField(max_length=120)


class LearnerHomeSerializer(serializers.Serializer):
    user_id = serializers.UUIDField()
    greeting_name = serializers.CharField(max_length=150)
    preferred_locale = serializers.ChoiceField(choices=("fa", "en"))
    dashboard_state = serializers.ChoiceField(
        choices=("first_time", "returning", "assignment_due", "mission_ready")
    )
    primary_action = PrimaryActionSerializer()
    today_mission = TodayMissionSerializer(allow_null=True)
    path_progress_percent = serializers.IntegerField(
        min_value=0, max_value=100, allow_null=True
    )
    path_steps = PathStepSerializer(many=True)
    path_message_fa = serializers.CharField(max_length=240)
    path_message_en = serializers.CharField(max_length=240)
    skills = SkillSnapshotSerializer(many=True)
    srs_available = serializers.BooleanField()
    srs_due_count = serializers.IntegerField(min_value=0)
    assignment = serializers.DictField(allow_null=True)
    next_class = serializers.DictField(allow_null=True)
    active_course = serializers.DictField(allow_null=True)
    xp_available = serializers.BooleanField()
    xp = serializers.IntegerField(min_value=0)
    streak_days = serializers.IntegerField(min_value=0)
    notifications_available = serializers.BooleanField()
    notification_count = serializers.IntegerField(min_value=0)
    limitations_fa = serializers.ListField(
        child=serializers.CharField(max_length=240)
    )
    limitations_en = serializers.ListField(
        child=serializers.CharField(max_length=240)
    )
    generated_at = serializers.DateTimeField()


class DashboardEventSerializer(serializers.Serializer):
    event_name = serializers.ChoiceField(choices=("primary_cta_click",))
    action_id = serializers.ChoiceField(choices=ACTION_CHOICES)

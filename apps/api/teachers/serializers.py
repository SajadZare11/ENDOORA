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
            "coursebook",
            "age_group",
            "class_size_type",
            "default_duration",
            "goal",
            "focus_skills",
            "equipment",
            "teaching_preferences",
            "target_exams",
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
    coursebook = serializers.CharField(required=False, default="", allow_blank=True)
    age_group = serializers.CharField(required=False, default="adult")
    class_size_type = serializers.CharField(required=False, default="small")
    default_duration = serializers.IntegerField(required=False, default=60, min_value=15)
    goal = serializers.CharField(required=False, default="general", allow_blank=True)
    focus_skills = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    equipment = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    teaching_preferences = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    target_exams = serializers.CharField(required=False, default="", allow_blank=True)


class UpdateClassInputSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255, required=False)
    description = serializers.CharField(required=False, allow_blank=True)
    subject = serializers.CharField(max_length=128, required=False)
    level = serializers.CharField(max_length=16, required=False)
    status = serializers.ChoiceField(choices=("active", "archived", "completed"), required=False)
    max_capacity = serializers.IntegerField(min_value=1, required=False)
    objectives = serializers.ListField(child=serializers.CharField(), required=False)
    private_notes = serializers.CharField(required=False, allow_blank=True)
    coursebook = serializers.CharField(required=False, allow_blank=True)
    age_group = serializers.CharField(required=False)
    class_size_type = serializers.CharField(required=False)
    default_duration = serializers.IntegerField(min_value=15, required=False)
    goal = serializers.CharField(required=False, allow_blank=True)
    focus_skills = serializers.ListField(child=serializers.CharField(), required=False)
    equipment = serializers.ListField(child=serializers.CharField(), required=False)
    teaching_preferences = serializers.ListField(child=serializers.CharField(), required=False)
    target_exams = serializers.CharField(required=False, allow_blank=True)


class UpdateSessionInputSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255, required=False)
    scheduled_start = serializers.DateTimeField(required=False)
    scheduled_end = serializers.DateTimeField(required=False)
    duration_minutes = serializers.IntegerField(min_value=15, required=False)
    status = serializers.ChoiceField(choices=("scheduled", "completed", "cancelled"), required=False)
    session_notes = serializers.CharField(required=False, allow_blank=True)
    learner_id = serializers.UUIDField(required=False, allow_null=True)
    confirmed_by_learner = serializers.BooleanField(required=False)



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


# TeacherOS Serializers


class TeacherMaterialSerializer(serializers.ModelSerializer):
    teacher_email = serializers.EmailField(source="teacher.email", read_only=True)
    class_title = serializers.CharField(source="teacher_class.title", read_only=True)
    material_type_display = serializers.CharField(source="get_material_type_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        from teachers.models import TeacherMaterial
        model = TeacherMaterial
        fields = [
            "id",
            "teacher",
            "teacher_email",
            "teacher_class",
            "class_title",
            "material_type",
            "material_type_display",
            "subtype",
            "title",
            "topic",
            "cefr_level",
            "content",
            "raw_markdown",
            "status",
            "status_display",
            "is_pinned",
            "metadata",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "teacher", "created_at", "updated_at"]


class CreateMaterialInputSerializer(serializers.Serializer):
    class_id = serializers.UUIDField(required=False, allow_null=True)
    material_type = serializers.ChoiceField(choices=["lesson", "activity", "worksheet", "assessment"])
    subtype = serializers.CharField(max_length=64, required=False, default="", allow_blank=True)
    title = serializers.CharField(max_length=255)
    topic = serializers.CharField(max_length=255, required=False, default="", allow_blank=True)
    cefr_level = serializers.CharField(max_length=16, default="B1")
    content = serializers.DictField(required=False, default=dict)
    raw_markdown = serializers.CharField(required=False, default="", allow_blank=True)
    metadata = serializers.DictField(required=False, default=dict)


class GenerateMaterialInputSerializer(serializers.Serializer):
    class_id = serializers.UUIDField(required=False, allow_null=True)
    material_type = serializers.ChoiceField(choices=["lesson", "activity", "worksheet", "assessment"])
    topic = serializers.CharField(max_length=255)
    title = serializers.CharField(max_length=255, required=False, default="", allow_blank=True)
    cefr_level = serializers.CharField(max_length=16, default="B1")
    duration = serializers.IntegerField(min_value=15, max_value=180, default=60, required=False)
    methodology = serializers.ChoiceField(choices=["ppp", "esa", "tbl"], default="ppp", required=False)
    grammar_focus = serializers.CharField(max_length=255, required=False, default="", allow_blank=True)
    vocabulary_focus = serializers.CharField(max_length=255, required=False, default="", allow_blank=True)
    activity_format = serializers.ChoiceField(
        choices=["roleplay", "infogap", "debate", "icebreaker", "speaking"],
        default="speaking",
        required=False,
    )
    worksheet_type = serializers.ChoiceField(
        choices=["grammar", "vocabulary", "reading", "writing"],
        default="grammar",
        required=False,
    )
    question_count = serializers.IntegerField(min_value=3, max_value=30, default=10, required=False)


class AdaptMaterialInputSerializer(serializers.Serializer):
    requested_change = serializers.CharField(min_length=3, max_length=1500)


class AssignMaterialInputSerializer(serializers.Serializer):
    class_id = serializers.UUIDField(required=False, allow_null=True)
    learner_ids = serializers.ListField(child=serializers.UUIDField(), required=False, default=list)
    due_date = serializers.DateTimeField(required=False, allow_null=True)
    create_assignment = serializers.BooleanField(required=False, default=False)


class ScheduleMaterialInputSerializer(serializers.Serializer):
    session_id = serializers.UUIDField(required=False, allow_null=True)
    title = serializers.CharField(required=False, default="", allow_blank=True, max_length=255)
    scheduled_start = serializers.DateTimeField(required=False, allow_null=True)
    scheduled_end = serializers.DateTimeField(required=False, allow_null=True)
    duration_minutes = serializers.IntegerField(min_value=15, max_value=240, required=False, default=60)
    session_notes = serializers.CharField(required=False, default="", allow_blank=True)


class LessonOutcomeSerializer(serializers.ModelSerializer):
    class_title = serializers.CharField(source="teacher_class.title", read_only=True)
    result_display = serializers.CharField(source="get_result_display", read_only=True)

    class Meta:
        from teachers.models import LessonOutcome
        model = LessonOutcome
        fields = [
            "id",
            "teacher_class",
            "class_title",
            "session",
            "teacher",
            "result",
            "result_display",
            "difficulty_rating",
            "completion_percent",
            "summary",
            "notes",
            "followup_reminders",
            "created_at",
        ]
        read_only_fields = ["id", "teacher", "created_at"]


class RecordOutcomeInputSerializer(serializers.Serializer):
    session_id = serializers.UUIDField(required=False, allow_null=True)
    result = serializers.ChoiceField(choices=["success", "partial", "needs_repeat"], default="success")
    difficulty_rating = serializers.IntegerField(min_value=1, max_value=5, default=3)
    completion_percent = serializers.IntegerField(min_value=0, max_value=100, default=100)
    summary = serializers.CharField(required=False, default="", allow_blank=True)
    notes = serializers.CharField(required=False, default="", allow_blank=True)
    followup_reminders = serializers.ListField(child=serializers.CharField(), required=False, default=list)


class StudentDossierSerializer(serializers.ModelSerializer):
    learner_email = serializers.EmailField(source="learner.email", read_only=True)
    class_title = serializers.CharField(source="teacher_class.title", read_only=True)
    cefr_overall = serializers.CharField(source="calculate_cefr_overall", read_only=True)

    class Meta:
        from teachers.models import StudentDossier
        model = StudentDossier
        fields = [
            "id",
            "teacher_class",
            "class_title",
            "learner",
            "learner_email",
            "teacher",
            "target_goals",
            "learning_preferences",
            "cefr_skills",
            "cefr_overall",
            "skill_scores_history",
            "error_profile",
            "strengths",
            "areas_for_development",
            "engagement_index",
            "ai_recommendations",
            "assessment_milestones",
            "updated_at",
        ]
        read_only_fields = ["id", "teacher", "updated_at"]


class ReviewSpacedItemInputSerializer(serializers.Serializer):
    grade = serializers.IntegerField(min_value=0, max_value=5, default=4)


class ScoreSkillsInputSerializer(serializers.Serializer):
    speaking = serializers.IntegerField(min_value=0, max_value=20, required=False)
    listening = serializers.IntegerField(min_value=0, max_value=20, required=False)
    reading = serializers.IntegerField(min_value=0, max_value=20, required=False)
    writing = serializers.IntegerField(min_value=0, max_value=20, required=False)
    grammar = serializers.IntegerField(min_value=0, max_value=20, required=False)
    vocabulary = serializers.IntegerField(min_value=0, max_value=20, required=False)
    pronunciation = serializers.IntegerField(min_value=0, max_value=20, required=False)
    confidence = serializers.IntegerField(min_value=1, max_value=5, required=False, default=3)
    notes = serializers.CharField(required=False, default="", allow_blank=True)

    def validate(self, attrs):
        skills = ["speaking", "listening", "reading", "writing", "grammar", "vocabulary", "pronunciation"]
        low_scores = [k for k in skills if k in attrs and attrs[k] < 10]
        notes = attrs.get("notes", "")
        if low_scores and not (notes and notes.strip()):
            raise serializers.ValidationError(
                {"notes": "For scores below 10, an explanatory diagnostic note is required."}
            )
        return attrs


class LogErrorInputSerializer(serializers.Serializer):
    category = serializers.ChoiceField(choices=["grammar", "lexis", "phonology", "l1_interference", "spelling", "other"])
    sentence = serializers.CharField()
    correction = serializers.CharField()
    notes = serializers.CharField(required=False, default="", allow_blank=True)
    frequency = serializers.ChoiceField(choices=["low", "medium", "high"], default="medium", required=False)
    status = serializers.ChoiceField(choices=["improving", "persistent", "solved"], default="improving", required=False)


class UpdateErrorStatusInputSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=["improving", "persistent", "solved"])


class RecordAssessmentInputSerializer(serializers.Serializer):
    type = serializers.ChoiceField(choices=["formal", "informal"], default="informal")
    subtype = serializers.CharField(default="mini_quiz")
    title = serializers.CharField()
    score = serializers.FloatField(min_value=0.0)
    max_score = serializers.FloatField(min_value=1.0, default=100.0)
    notes = serializers.CharField(required=False, default="", allow_blank=True)


class SpacedReviewItemSerializer(serializers.ModelSerializer):
    class Meta:
        from teachers.models import SpacedReviewItem
        model = SpacedReviewItem
        fields = [
            "id",
            "teacher_class",
            "learner",
            "target_item",
            "item_type",
            "prompt_question",
            "correct_answer",
            "due_date",
            "interval_days",
            "repetition_count",
            "ease_factor",
            "is_mastered",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class DifferentiationPlanSerializer(serializers.ModelSerializer):
    material_title = serializers.CharField(source="material.title", read_only=True)

    class Meta:
        from teachers.models import DifferentiationPlan
        model = DifferentiationPlan
        fields = [
            "id",
            "material",
            "material_title",
            "teacher_class",
            "tier_support",
            "tier_core",
            "tier_extension",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class TeacherUsageSummarySerializer(serializers.Serializer):
    plan_name = serializers.CharField()
    daily_limit = serializers.IntegerField()
    used_today = serializers.IntegerField()
    remaining_today = serializers.IntegerField()
    today = serializers.DictField()
    all_time = serializers.DictField()
    saved_materials = serializers.IntegerField()
    breakdown = serializers.DictField()


class WritingAnalyzeInputSerializer(serializers.Serializer):
    text = serializers.CharField(min_length=10)
    level = serializers.CharField(default="B1", required=False)
    mode = serializers.CharField(default="rubric", required=False)
    task_prompt = serializers.CharField(required=False, allow_blank=True, default="")
    student_label = serializers.CharField(required=False, allow_blank=True, default="Student")


class ApproveFeedbackInputSerializer(serializers.Serializer):
    class_id = serializers.UUIDField()
    learner_id = serializers.UUIDField()
    assignment_title = serializers.CharField(required=False, default="Writing Assessment", allow_blank=True)
    student_text = serializers.CharField(required=False, allow_blank=True, default="")
    analysis = serializers.DictField()
    teacher_notes = serializers.CharField(required=False, allow_blank=True, default="")


class WritingFeedbackExportInputSerializer(serializers.Serializer):
    analysis = serializers.DictField()
    mode = serializers.ChoiceField(choices=["teacher", "student"], default="student")


class DifferentiationAssignInputSerializer(serializers.Serializer):
    tier_assignments = serializers.DictField(required=False, default=dict)
    notes = serializers.CharField(required=False, allow_blank=True, default="")


class WarmupGenerateInputSerializer(serializers.Serializer):
    count = serializers.IntegerField(default=5, min_value=1, max_value=15, required=False)


class WarmupPushInputSerializer(serializers.Serializer):
    warmup_data = serializers.DictField()


class ReportCardDispatchInputSerializer(serializers.Serializer):
    term = serializers.CharField(default="Term 2 - Spring 2026", required=False)
    teacher_comment = serializers.CharField(required=False, allow_blank=True, default="")
    overall_score = serializers.FloatField(required=False, default=15.0)


class ReportCardExportInputSerializer(serializers.Serializer):
    report_data = serializers.DictField(required=False, default=dict)
    term = serializers.CharField(default="Term 2 - Spring 2026", required=False)
    teacher_comment = serializers.CharField(required=False, allow_blank=True, default="")


class TeacherPedagogicalPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        from teachers.models import TeacherPedagogicalPreference
        model = TeacherPedagogicalPreference
        fields = [
            "id",
            "plan_code",
            "plan_expires_at",
            "default_cefr",
            "default_duration",
            "preferred_methodology",
            "auto_generate_ccqs",
            "feedback_tone",
            "updated_at",
        ]
        read_only_fields = ["id", "plan_code", "plan_expires_at", "updated_at"]


class BatchMaterialActionInputSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=["archive", "pin", "unpin", "delete"])
    material_ids = serializers.ListField(child=serializers.UUIDField(), min_length=1)


class UpgradePlanInputSerializer(serializers.Serializer):
    plan_code = serializers.ChoiceField(choices=["free", "pro", "premium"])
    gateway = serializers.CharField(required=False, default="zarinpal")


class UpdatePreferencesInputSerializer(serializers.Serializer):
    default_cefr = serializers.CharField(required=False, max_length=16)
    default_duration = serializers.IntegerField(required=False, min_value=15, max_value=180)
    preferred_methodology = serializers.ChoiceField(choices=["ppp", "esa", "tbl"], required=False)
    auto_generate_ccqs = serializers.BooleanField(required=False)
    feedback_tone = serializers.ChoiceField(choices=["encouraging", "balanced", "rigorous"], required=False)




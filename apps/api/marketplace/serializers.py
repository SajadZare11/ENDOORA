from rest_framework import serializers
from .models import (
    MarketplaceRequest,
    TeacherOffer,
    SessionBooking,
    RequestSkill,
    CEFRLevel,
    SessionFormat,
    PreferredTimeWindow,
    RequestStatus,
    OfferStatus,
    BookingStatus,
)


class TeacherFeedRequestSerializer(serializers.ModelSerializer):
    learner_display_name = serializers.SerializerMethodField()
    offer_count = serializers.SerializerMethodField()
    has_my_offer = serializers.SerializerMethodField()
    my_offer_id = serializers.SerializerMethodField()
    skill_display = serializers.CharField(source="get_target_skill_display", read_only=True)
    format_display = serializers.CharField(source="get_online_format_display", read_only=True)
    time_window_display = serializers.CharField(source="get_preferred_time_window_display", read_only=True)

    class Meta:
        model = MarketplaceRequest
        fields = [
            "id",
            "learner_display_name",
            "target_skill",
            "skill_display",
            "target_subskill",
            "target_cefr_level",
            "short_description",
            "preferred_time_window",
            "time_window_display",
            "duration_minutes",
            "online_format",
            "format_display",
            "budget_max_toman",
            "status",
            "expires_at",
            "created_at",
            "offer_count",
            "has_my_offer",
            "my_offer_id",
        ]

    def get_learner_display_name(self, obj) -> str:
        learner = obj.learner
        first_name = (learner.first_name or "").strip()
        last_name = (learner.last_name or "").strip()
        if first_name and last_name:
            return f"{first_name} {last_name[0]}."
        elif first_name:
            return first_name
        return "زبان‌آموز اندورا"

    def get_offer_count(self, obj) -> int:
        return obj.offers.filter(status__in=[OfferStatus.PENDING, OfferStatus.ACCEPTED]).count()

    def get_has_my_offer(self, obj) -> bool:
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.offers.filter(teacher=request.user, status=OfferStatus.PENDING).exists()
        return False

    def get_my_offer_id(self, obj) -> str | None:
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            my_offer = obj.offers.filter(teacher=request.user, status=OfferStatus.PENDING).first()
            if my_offer:
                return str(my_offer.id)
        return None


class TeacherOfferSerializer(serializers.ModelSerializer):
    teacher_name = serializers.SerializerMethodField()
    teacher_headline = serializers.SerializerMethodField()
    teacher_verified = serializers.SerializerMethodField()
    format_display = serializers.CharField(source="get_online_format_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = TeacherOffer
        fields = [
            "id",
            "request_id",
            "teacher_id",
            "teacher_name",
            "teacher_headline",
            "teacher_verified",
            "rate_toman",
            "proposed_start_time",
            "duration_minutes",
            "online_format",
            "format_display",
            "intro_note",
            "status",
            "status_display",
            "created_at",
            "expires_at",
        ]

    def get_teacher_name(self, obj) -> str:
        name = f"{obj.teacher.first_name or ''} {obj.teacher.last_name or ''}".strip()
        return name or "استاد اندورا"

    def get_teacher_headline(self, obj) -> str:
        profile = getattr(obj.teacher, "profile", None)
        if profile and hasattr(profile, "headline") and profile.headline:
            return profile.headline
        return "مدرس زبان انگلیسی اندورا"

    def get_teacher_verified(self, obj) -> bool:
        return getattr(obj.teacher, "is_teacher_verified", False)


class LearnerRequestDetailSerializer(serializers.ModelSerializer):
    offers = serializers.SerializerMethodField()
    skill_display = serializers.CharField(source="get_target_skill_display", read_only=True)
    format_display = serializers.CharField(source="get_online_format_display", read_only=True)
    time_window_display = serializers.CharField(source="get_preferred_time_window_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    matched_offer_detail = TeacherOfferSerializer(source="matched_offer", read_only=True)
    booking_id = serializers.SerializerMethodField()

    class Meta:
        model = MarketplaceRequest
        fields = [
            "id",
            "target_skill",
            "skill_display",
            "target_subskill",
            "target_cefr_level",
            "short_description",
            "preferred_time_window",
            "time_window_display",
            "duration_minutes",
            "online_format",
            "format_display",
            "budget_max_toman",
            "status",
            "status_display",
            "matched_offer_id",
            "matched_offer_detail",
            "booking_id",
            "expires_at",
            "created_at",
            "offers",
        ]

    def get_offers(self, obj):
        offers = obj.offers.exclude(status=OfferStatus.WITHDRAWN).order_by("-created_at")
        return TeacherOfferSerializer(offers, many=True, context=self.context).data

    def get_booking_id(self, obj) -> str | None:
        booking = obj.bookings.first()
        return str(booking.id) if booking else None


class TeacherWorkspaceOfferSerializer(serializers.ModelSerializer):
    request_summary = serializers.SerializerMethodField()
    format_display = serializers.CharField(source="get_online_format_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = TeacherOffer
        fields = [
            "id",
            "request_id",
            "rate_toman",
            "proposed_start_time",
            "duration_minutes",
            "online_format",
            "format_display",
            "intro_note",
            "status",
            "status_display",
            "created_at",
            "request_summary",
        ]

    def get_request_summary(self, obj) -> dict:
        req = obj.request
        return {
            "target_skill": req.target_skill,
            "skill_display": req.get_target_skill_display(),
            "target_cefr_level": req.target_cefr_level,
            "duration_minutes": req.duration_minutes,
            "short_description": req.short_description[:120],
            "preferred_time_window": req.get_preferred_time_window_display(),
            "status": req.status,
        }


class SessionBookingSerializer(serializers.ModelSerializer):
    counterparty = serializers.SerializerMethodField()
    skill_display = serializers.CharField(source="get_target_skill_display", read_only=True)
    format_display = serializers.CharField(source="get_online_format_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    can_cancel = serializers.SerializerMethodField()
    can_reschedule = serializers.SerializerMethodField()
    can_start = serializers.SerializerMethodField()
    can_complete = serializers.SerializerMethodField()
    can_respond_reschedule = serializers.SerializerMethodField()
    meeting_room_url = serializers.CharField(source="meeting_url", read_only=True)
    is_counterparty_reschedule = serializers.SerializerMethodField()
    in_session_window = serializers.SerializerMethodField()

    class Meta:
        model = SessionBooking
        fields = [
            "id",
            "request_id",
            "offer_id",
            "target_skill",
            "skill_display",
            "target_subskill",
            "duration_minutes",
            "online_format",
            "format_display",
            "scheduled_start",
            "scheduled_end",
            "timezone_name",
            "rate_toman",
            "status",
            "status_display",
            "meeting_url",
            "meeting_room_url",
            "can_respond_reschedule",
            "session_notes",
            "cancellation_reason",
            "reschedule_proposed_start",
            "reschedule_proposed_end",
            "reschedule_note",
            "can_cancel",
            "can_reschedule",
            "can_start",
            "can_complete",
            "is_counterparty_reschedule",
            "in_session_window",
            "counterparty",
            "created_at",
            "started_at",
            "completed_at",
            "cancelled_at",
        ]

    def get_counterparty(self, obj) -> dict:
        req_user = self.context.get("request").user if self.context.get("request") else None
        if req_user and req_user.id == obj.learner_id:
            # Counterparty is teacher
            name = f"{obj.teacher.first_name or ''} {obj.teacher.last_name or ''}".strip() or "استاد اندورا"
            profile = getattr(obj.teacher, "profile", None)
            headline = getattr(profile, "headline", "مدرس زبان اندورا") if profile else "مدرس زبان اندورا"
            return {
                "id": str(obj.teacher.id),
                "name": name,
                "headline": headline,
                "role": "teacher",
                "verified": getattr(obj.teacher, "is_teacher_verified", False),
            }
        else:
            # Counterparty is learner
            first_name = (obj.learner.first_name or "").strip()
            last_name = (obj.learner.last_name or "").strip()
            name = f"{first_name} {last_name[0]}." if first_name and last_name else (first_name or "زبان‌آموز")
            return {
                "id": str(obj.learner.id),
                "name": name,
                "headline": "زبان‌آموز اندورا",
                "role": "learner",
                "verified": False,
            }

    def get_can_cancel(self, obj) -> bool:
        return obj.status in [BookingStatus.CONFIRMED, BookingStatus.RESCHEDULE_REQUESTED]

    def get_can_reschedule(self, obj) -> bool:
        return obj.status == BookingStatus.CONFIRMED

    def get_can_start(self, obj) -> bool:
        return obj.status in [BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS] and obj.is_in_session_window()

    def get_can_complete(self, obj) -> bool:
        return obj.status == BookingStatus.IN_PROGRESS

    def get_can_respond_reschedule(self, obj) -> bool:
        return self.get_is_counterparty_reschedule(obj)

    def get_is_counterparty_reschedule(self, obj) -> bool:
        req_user = self.context.get("request").user if self.context.get("request") else None
        if not req_user or obj.status != BookingStatus.RESCHEDULE_REQUESTED:
            return False
        return obj.reschedule_requested_by_id != req_user.id

    def get_in_session_window(self, obj) -> bool:
        return obj.is_in_session_window()


class CreateMarketplaceRequestSerializer(serializers.Serializer):
    target_skill = serializers.ChoiceField(choices=RequestSkill.choices)
    target_subskill = serializers.CharField(required=False, allow_blank=True, default="", max_length=128)
    target_cefr_level = serializers.ChoiceField(choices=CEFRLevel.choices, default=CEFRLevel.UNSPECIFIED)
    short_description = serializers.CharField(min_length=10, max_length=1000)
    preferred_time_window = serializers.ChoiceField(choices=PreferredTimeWindow.choices, default=PreferredTimeWindow.FLEXIBLE)
    duration_minutes = serializers.ChoiceField(choices=[30, 45, 60], default=45)
    online_format = serializers.ChoiceField(choices=SessionFormat.choices, default=SessionFormat.VIDEO)
    budget_max_toman = serializers.DecimalField(required=False, allow_null=True, max_digits=10, decimal_places=0)
    preferred_teacher_id = serializers.UUIDField(required=False, allow_null=True)
    expire_hours = serializers.IntegerField(required=False, default=24, min_value=1, max_value=72)


class SubmitTeacherOfferSerializer(serializers.Serializer):
    rate_toman = serializers.DecimalField(max_digits=10, decimal_places=0, min_value=10000)
    intro_note = serializers.CharField(min_length=10, max_length=1000)
    proposed_start_time = serializers.DateTimeField(required=False, allow_null=True)
    duration_minutes = serializers.ChoiceField(choices=[30, 45, 60], default=45)
    online_format = serializers.ChoiceField(choices=SessionFormat.choices, default=SessionFormat.VIDEO)


class DirectCreateBookingSerializer(serializers.Serializer):
    teacher_id = serializers.UUIDField()
    target_skill = serializers.ChoiceField(choices=RequestSkill.choices)
    target_subskill = serializers.CharField(required=False, allow_blank=True, default="", max_length=128)
    rate_toman = serializers.DecimalField(max_digits=10, decimal_places=0, min_value=10000)
    scheduled_start = serializers.DateTimeField()
    duration_minutes = serializers.ChoiceField(choices=[30, 45, 60], default=45)
    online_format = serializers.ChoiceField(choices=SessionFormat.choices, default=SessionFormat.VIDEO)
    timezone_name = serializers.CharField(required=False, default="Asia/Tehran", max_length=64)
    idempotency_key = serializers.CharField(required=False, allow_null=True, max_length=128)


class RescheduleBookingSerializer(serializers.Serializer):
    new_start_time = serializers.DateTimeField()
    note = serializers.CharField(required=False, allow_blank=True, default="", max_length=500)


class RespondRescheduleSerializer(serializers.Serializer):
    accept = serializers.BooleanField()


class CancelBookingSerializer(serializers.Serializer):
    reason = serializers.CharField(min_length=5, max_length=500)


class CompleteBookingSerializer(serializers.Serializer):
    session_notes = serializers.CharField(required=False, allow_blank=True, default="", max_length=1500)


# ---------------------------------------------------------------------------
# Day 39: Serializers for Teacher Profile, Reviews, and Social Proof
# ---------------------------------------------------------------------------

class TeacherReviewSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source="teacher.get_full_name", read_only=True)
    teacher_email = serializers.CharField(source="teacher.email", read_only=True)

    class Meta:
        from marketplace.models import TeacherReview
        model = TeacherReview
        fields = [
            "id",
            "overall_rating",
            "rating_teaching",
            "rating_punctuality",
            "rating_communication",
            "comment",
            "masked_display_name",
            "is_anonymous",
            "status",
            "teacher_reply",
            "teacher_replied_at",
            "created_at",
            "flag_reason",
            "teacher_id",
            "teacher_name",
            "teacher_email",
        ]


class SubmitReviewSerializer(serializers.Serializer):
    overall_rating = serializers.IntegerField(min_value=1, max_value=5)
    rating_teaching = serializers.IntegerField(min_value=1, max_value=5, default=5, required=False)
    rating_punctuality = serializers.IntegerField(min_value=1, max_value=5, default=5, required=False)
    rating_communication = serializers.IntegerField(min_value=1, max_value=5, default=5, required=False)
    comment = serializers.CharField(min_length=10, max_length=2000)
    is_anonymous = serializers.BooleanField(default=False, required=False)


class TeacherReviewReplySerializer(serializers.Serializer):
    reply_text = serializers.CharField(min_length=2, max_length=2000)


class FlagReviewSerializer(serializers.Serializer):
    reason = serializers.CharField(min_length=5, max_length=1000)

# ---------------------------------------------------------------------------
# Day 40: Serializers for Teacher Availability, Recurring Slots & Time-Off
# ---------------------------------------------------------------------------

class TeacherAvailabilitySlotSerializer(serializers.ModelSerializer):
    day_name = serializers.CharField(source="get_day_of_week_display", read_only=True)
    start_time_str = serializers.SerializerMethodField()
    end_time_str = serializers.SerializerMethodField()

    class Meta:
        from marketplace.models import TeacherAvailabilitySlot
        model = TeacherAvailabilitySlot
        fields = [
            "id",
            "day_of_week",
            "day_name",
            "start_time",
            "end_time",
            "start_time_str",
            "end_time_str",
            "is_active",
        ]

    def get_start_time_str(self, obj) -> str:
        return obj.start_time.strftime("%H:%M") if obj.start_time else ""

    def get_end_time_str(self, obj) -> str:
        return obj.end_time.strftime("%H:%M") if obj.end_time else ""


class SlotInputSerializer(serializers.Serializer):
    day_of_week = serializers.IntegerField(min_value=0, max_value=6)
    start_time = serializers.CharField(max_length=8)
    end_time = serializers.CharField(max_length=8)
    is_active = serializers.BooleanField(default=True, required=False)


class WeeklyScheduleInputSerializer(serializers.Serializer):
    slots = SlotInputSerializer(many=True, required=False)
    schedule = SlotInputSerializer(many=True, required=False)

    def validate(self, data):
        items = data.get("slots")
        if items is None:
            items = data.get("schedule")
        if items is None:
            raise serializers.ValidationError("فیلد slots یا schedule الزامی است.")
        data["slots"] = items
        return data


class TeacherTimeOffSerializer(serializers.ModelSerializer):
    start_display = serializers.SerializerMethodField()
    end_display = serializers.SerializerMethodField()

    class Meta:
        from marketplace.models import TeacherTimeOff
        model = TeacherTimeOff
        fields = [
            "id",
            "start_datetime",
            "end_datetime",
            "start_display",
            "end_display",
            "reason",
            "is_full_day",
            "created_at",
        ]

    def get_start_display(self, obj) -> str:
        from marketplace.services import TEHRAN_TZ
        return obj.start_datetime.astimezone(TEHRAN_TZ).strftime("%Y/%m/%d %H:%M")

    def get_end_display(self, obj) -> str:
        from marketplace.services import TEHRAN_TZ
        return obj.end_datetime.astimezone(TEHRAN_TZ).strftime("%Y/%m/%d %H:%M")


class CreateTimeOffSerializer(serializers.Serializer):
    start_datetime = serializers.DateTimeField(required=False)
    end_datetime = serializers.DateTimeField(required=False)
    start_time = serializers.DateTimeField(required=False)
    end_time = serializers.DateTimeField(required=False)
    reason = serializers.CharField(required=False, allow_blank=True, default="", max_length=255)
    is_full_day = serializers.BooleanField(default=False, required=False)

    def validate(self, data):
        start = data.get("start_datetime") or data.get("start_time")
        end = data.get("end_datetime") or data.get("end_time")
        if not start or not end:
            raise serializers.ValidationError({"conflicts": "فیلدهای زمان آغاز و پایان الزامی هستند."})
        data["start_datetime"] = start
        data["end_datetime"] = end
        return data


class TeacherAvailabilitySettingSerializer(serializers.ModelSerializer):
    buffer_minutes = serializers.IntegerField(source="default_buffer_minutes", read_only=True)
    session_duration_minutes = serializers.IntegerField(source="default_session_duration_minutes", read_only=True)

    class Meta:
        from marketplace.models import TeacherAvailabilitySetting
        model = TeacherAvailabilitySetting
        fields = [
            "notice_lead_time_hours",
            "max_booking_ahead_days",
            "default_session_duration_minutes",
            "default_buffer_minutes",
            "buffer_minutes",
            "session_duration_minutes",
            "auto_accept_bookings",
        ]


class BookableSlotSerializer(serializers.Serializer):
    start_utc = serializers.DateTimeField()
    end_utc = serializers.DateTimeField()
    start_time_tehran = serializers.CharField()
    end_time_tehran = serializers.CharField()
    duration_minutes = serializers.IntegerField()
    is_bookable = serializers.BooleanField(default=True)

# ---------------------------------------------------------------------------
# Day 41: Marketplace Admin Moderation, Teacher Onboarding & Dispute Resolution
# ---------------------------------------------------------------------------

class BookingDisputeSerializer(serializers.ModelSerializer):
    reason_display = serializers.CharField(source="get_reason_category_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    opened_by_id = serializers.UUIDField(source="opened_by.id", read_only=True)
    opened_by_name = serializers.SerializerMethodField()
    resolved_by_name = serializers.SerializerMethodField()
    booking_summary = serializers.SerializerMethodField()

    class Meta:
        from marketplace.models import BookingDispute
        model = BookingDispute
        fields = [
            "id",
            "booking_id",
            "opened_by_id",
            "opened_by_name",
            "reason_category",
            "reason_display",
            "description",
            "evidence_notes",
            "status",
            "status_display",
            "refund_percentage",
            "resolution_notes",
            "resolved_by_name",
            "resolved_at",
            "created_at",
            "updated_at",
            "booking_summary",
        ]

    def get_opened_by_name(self, obj) -> str:
        u = obj.opened_by
        return f"{u.first_name} {u.last_name}".strip() or u.email

    def get_resolved_by_name(self, obj) -> str:
        if not obj.resolved_by:
            return ""
        u = obj.resolved_by
        return f"{u.first_name} {u.last_name}".strip() or u.email

    def get_booking_summary(self, obj) -> dict:
        b = obj.booking
        learner_name = f"{b.learner.first_name} {b.learner.last_name}".strip() or b.learner.email
        teacher_name = f"{b.teacher.first_name} {b.teacher.last_name}".strip() or b.teacher.email
        return {
            "id": str(b.id),
            "learner_name": learner_name,
            "teacher_name": teacher_name,
            "scheduled_start": b.scheduled_start.isoformat(),
            "scheduled_end": b.scheduled_end.isoformat(),
            "rate_toman": int(b.rate_toman),
            "target_skill": b.target_skill,
            "status": b.status,
            "status_display": b.get_status_display(),
        }


class OpenDisputeInputSerializer(serializers.Serializer):
    reason_category = serializers.CharField(max_length=32)
    description = serializers.CharField(min_length=15, max_length=5000)
    evidence_notes = serializers.CharField(required=False, allow_blank=True, default="", max_length=5000)


class ResolveDisputeInputSerializer(serializers.Serializer):
    resolution_status = serializers.CharField(max_length=32)
    resolution_notes = serializers.CharField(min_length=5, max_length=5000)
    refund_percentage = serializers.IntegerField(min_value=0, max_value=100, default=0, required=False)


class TeacherOnboardingApplicationSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    teacher_id = serializers.UUIDField(source="teacher.id", read_only=True)
    teacher_email = serializers.EmailField(source="teacher.email", read_only=True)
    teacher_name = serializers.SerializerMethodField()
    reviewed_by_name = serializers.SerializerMethodField()
    is_teacher_verified = serializers.BooleanField(source="teacher.is_teacher_verified", read_only=True)
    marketplace_eligible = serializers.BooleanField(source="teacher.marketplace_eligible", read_only=True)

    class Meta:
        from marketplace.models import TeacherOnboardingApplication
        model = TeacherOnboardingApplication
        fields = [
            "id",
            "teacher_id",
            "teacher_email",
            "teacher_name",
            "status",
            "status_display",
            "national_id_number",
            "id_document_url",
            "degree_document_url",
            "celta_tesol_document_url",
            "sample_teaching_url",
            "admin_notes",
            "rejection_reason",
            "reviewed_by_name",
            "reviewed_at",
            "is_teacher_verified",
            "marketplace_eligible",
            "created_at",
            "updated_at",
        ]

    def get_teacher_name(self, obj) -> str:
        u = obj.teacher
        return f"{u.first_name} {u.last_name}".strip() or u.email

    def get_reviewed_by_name(self, obj) -> str:
        if not obj.reviewed_by:
            return ""
        u = obj.reviewed_by
        return f"{u.first_name} {u.last_name}".strip() or u.email


class SubmitOnboardingInputSerializer(serializers.Serializer):
    national_id_number = serializers.CharField(max_length=20, required=False, allow_blank=True)
    id_document_url = serializers.URLField(required=False, allow_blank=True)
    degree_document_url = serializers.URLField(required=False, allow_blank=True)
    celta_tesol_document_url = serializers.URLField(required=False, allow_blank=True)
    sample_teaching_url = serializers.URLField(required=False, allow_blank=True)


class ReviewOnboardingInputSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=["approve", "reject", "request_revision"])
    admin_notes = serializers.CharField(required=False, allow_blank=True, default="")
    reason = serializers.CharField(required=False, allow_blank=True, default="")


class PlatformPricingPlanSerializer(serializers.ModelSerializer):
    price_toman_number = serializers.IntegerField(source="price_toman", read_only=True)

    class Meta:
        from marketplace.models import PlatformPricingPlan
        model = PlatformPricingPlan
        fields = [
            "id",
            "code",
            "name_fa",
            "name_en",
            "duration_days",
            "price_toman",
            "price_toman_number",
            "is_active",
            "is_featured",
            "features_fa",
            "note_fa",
            "note_en",
            "created_at",
            "updated_at",
        ]

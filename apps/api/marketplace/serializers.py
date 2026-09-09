from rest_framework import serializers
from .models import (
    MarketplaceRequest,
    TeacherOffer,
    RequestSkill,
    CEFRLevel,
    SessionFormat,
    PreferredTimeWindow,
    RequestStatus,
    OfferStatus,
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
        # STRICT PRIVACY GUARD: never return email, phone or sensitive info
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
            "expires_at",
            "created_at",
            "offers",
        ]

    def get_offers(self, obj):
        offers = obj.offers.exclude(status=OfferStatus.WITHDRAWN).order_by("-created_at")
        return TeacherOfferSerializer(offers, many=True, context=self.context).data


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

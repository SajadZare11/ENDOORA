from datetime import timedelta
from decimal import Decimal
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.db import transaction
from django.db.models import Count, Q
from django.utils import timezone
from accounts.models import User
from .models import (
    MarketplaceRequest,
    TeacherOffer,
    RequestStatus,
    OfferStatus,
    RequestSkill,
    CEFRLevel,
    SessionFormat,
    PreferredTimeWindow,
)


def ensure_teacher_marketplace_eligible(user: User) -> None:
    if not (user.is_authenticated and user.role == User.Role.TEACHER):
        raise PermissionDenied("دسترسی به این بخش فقط برای کاربران مدرس مجاز است.")
    if not user.is_teacher_verified:
        raise PermissionDenied("دسترسی به بازار نیازمند تأیید مدارک و احراز هویت مدرس است.")
    if not user.marketplace_eligible:
        raise PermissionDenied("قابلیت پذیرش درخواست‌های بازار برای حساب کاربری شما فعال نشده است.")


def get_teacher_eligibility_status(user: User) -> dict:
    is_teacher = user.is_authenticated and user.role == User.Role.TEACHER
    is_verified = bool(user.is_authenticated and getattr(user, "is_teacher_verified", False))
    marketplace_eligible = bool(user.is_authenticated and getattr(user, "marketplace_eligible", False))
    can_access_feed = is_teacher and is_verified and marketplace_eligible
    return {
        "is_teacher": is_teacher,
        "is_teacher_verified": is_verified,
        "marketplace_eligible": marketplace_eligible,
        "can_access_feed": can_access_feed,
        "role": user.role if user.is_authenticated else "anonymous",
    }


def create_learn_now_request(
    learner: User,
    target_skill: str,
    short_description: str,
    target_subskill: str = "",
    target_cefr_level: str = CEFRLevel.UNSPECIFIED,
    preferred_time_window: str = PreferredTimeWindow.FLEXIBLE,
    duration_minutes: int = 45,
    online_format: str = SessionFormat.VIDEO,
    budget_max_toman: Decimal | None = None,
    preferred_teacher_id: str | None = None,
    expire_hours: int = 24,
) -> MarketplaceRequest:
    if not learner.is_authenticated:
        raise PermissionDenied("برای ثبت درخواست باید وارد حساب کاربری خود شوید.")

    # Duplicate check: check if learner has submitted an identical request within last 5 minutes
    recent_dup = MarketplaceRequest.objects.filter(
        learner=learner,
        target_skill=target_skill,
        status__in=[RequestStatus.OPEN, RequestStatus.MATCHED],
        created_at__gte=timezone.now() - timedelta(minutes=5),
    ).first()
    if recent_dup:
        raise ValidationError("درخواست مشابهی در چند دقیقه گذشته توسط شما ثبت شده است. لطفاً همان درخواست را پیگیری کنید.")

    # Active open request count guard (max 5 active requests per learner)
    active_count = MarketplaceRequest.objects.filter(
        learner=learner,
        status__in=[RequestStatus.OPEN, RequestStatus.MATCHED],
        expires_at__gt=timezone.now(),
    ).count()
    if active_count >= 5:
        raise ValidationError("سقف حداکثر ۵ درخواست فعال همزمان تکمیل شده است.")

    preferred_teacher = None
    if preferred_teacher_id:
        try:
            preferred_teacher = User.objects.get(id=preferred_teacher_id, role=User.Role.TEACHER)
        except User.DoesNotExist:
            preferred_teacher = None

    expires_at = timezone.now() + timedelta(hours=max(1, min(expire_hours, 72)))

    req = MarketplaceRequest.objects.create(
        learner=learner,
        preferred_teacher=preferred_teacher,
        target_skill=target_skill,
        target_subskill=target_subskill,
        target_cefr_level=target_cefr_level,
        short_description=short_description,
        preferred_time_window=preferred_time_window,
        duration_minutes=duration_minutes,
        online_format=online_format,
        budget_max_toman=budget_max_toman,
        expires_at=expires_at,
        status=RequestStatus.OPEN,
    )
    return req


def list_teacher_feed(
    teacher: User,
    skill: str | None = None,
    cefr_level: str | None = None,
    online_format: str | None = None,
    time_window: str | None = None,
    status_filter: str | None = None,
    has_offered: bool | None = None,
):
    ensure_teacher_marketplace_eligible(teacher)

    now = timezone.now()
    qs = MarketplaceRequest.objects.filter(
        status__in=[RequestStatus.OPEN, RequestStatus.MATCHED],
        expires_at__gt=now,
    ).select_related("learner", "preferred_teacher").prefetch_related("offers")

    if skill:
        qs = qs.filter(target_skill=skill)
    if cefr_level and cefr_level != "all":
        qs = qs.filter(target_cefr_level=cefr_level)
    if online_format and online_format != "all":
        qs = qs.filter(online_format=online_format)
    if time_window and time_window != "all":
        qs = qs.filter(preferred_time_window=time_window)

    if status_filter == "open":
        qs = qs.filter(status=RequestStatus.OPEN)
    elif status_filter == "matched":
        qs = qs.filter(status=RequestStatus.MATCHED)

    if has_offered is True:
        qs = qs.filter(offers__teacher=teacher, offers__status=OfferStatus.PENDING)
    elif has_offered is False:
        qs = qs.exclude(offers__teacher=teacher, offers__status=OfferStatus.PENDING)

    return qs.distinct()


def submit_teacher_offer(
    teacher: User,
    request_id: str,
    rate_toman: Decimal,
    intro_note: str,
    proposed_start_time=None,
    duration_minutes: int = 45,
    online_format: str = SessionFormat.VIDEO,
) -> TeacherOffer:
    ensure_teacher_marketplace_eligible(teacher)

    try:
        req = MarketplaceRequest.objects.get(id=request_id)
    except MarketplaceRequest.DoesNotExist:
        raise ValidationError("درخواست مورد نظر یافت نشد.")

    if not req.is_active():
        raise ValidationError("این درخواست دیگر فعال نبوده یا منقضی شده است.")

    if req.learner_id == teacher.id:
        raise ValidationError("شما نمی‌توانید برای درخواست خودتان پیشنهاد تدریس ارسال کنید.")

    # Check existing pending offer by this teacher
    existing = TeacherOffer.objects.filter(
        request=req,
        teacher=teacher,
        status=OfferStatus.PENDING,
    ).first()
    if existing:
        raise ValidationError("شما قبلاً یک پیشنهاد فعال برای این درخواست ارسال کرده‌اید.")

    with transaction.atomic():
        offer = TeacherOffer.objects.create(
            request=req,
            teacher=teacher,
            rate_toman=rate_toman,
            intro_note=intro_note,
            proposed_start_time=proposed_start_time,
            duration_minutes=duration_minutes,
            online_format=online_format,
            status=OfferStatus.PENDING,
            expires_at=req.expires_at,
        )
        if req.status == RequestStatus.OPEN:
            req.status = RequestStatus.MATCHED
            req.save(update_fields=["status", "updated_at"])

    return offer


def withdraw_teacher_offer(teacher: User, offer_id: str) -> TeacherOffer:
    try:
        offer = TeacherOffer.objects.select_related("request").get(id=offer_id, teacher=teacher)
    except TeacherOffer.DoesNotExist:
        raise ValidationError("پیشنهاد مورد نظر یافت نشد.")

    if offer.status != OfferStatus.PENDING:
        raise ValidationError("تنها پیشنهادهای در انتظار پاسخ را می‌توان پس گرفت.")

    with transaction.atomic():
        offer.status = OfferStatus.WITHDRAWN
        offer.save(update_fields=["status", "updated_at"])

        req = offer.request
        # Check if there are any remaining pending offers
        remaining_pending = TeacherOffer.objects.filter(
            request=req,
            status=OfferStatus.PENDING,
        ).exists()
        if not remaining_pending and req.status == RequestStatus.MATCHED:
            req.status = RequestStatus.OPEN
            req.save(update_fields=["status", "updated_at"])

    return offer


def accept_teacher_offer(learner: User, offer_id: str) -> tuple[MarketplaceRequest, TeacherOffer]:
    try:
        offer = TeacherOffer.objects.select_related("request", "teacher").get(id=offer_id)
    except TeacherOffer.DoesNotExist:
        raise ValidationError("پیشنهاد مورد نظر یافت نشد.")

    req = offer.request
    if req.learner_id != learner.id:
        raise PermissionDenied("شما دسترسی لازم برای پذیرش این پیشنهاد را ندارید.")

    if req.status == RequestStatus.BOOKED:
        raise ValidationError("این درخواست قبلاً رزرو و نهایی شده است.")

    if not req.is_active():
        raise ValidationError("این درخواست دیگر فعال نیست.")

    if offer.status != OfferStatus.PENDING:
        raise ValidationError("این پیشنهاد در وضعیت معتبر برای پذیرش قرار ندارد.")

    with transaction.atomic():
        offer.status = OfferStatus.ACCEPTED
        offer.save(update_fields=["status", "updated_at"])

        req.matched_offer = offer
        req.status = RequestStatus.BOOKED
        req.save(update_fields=["matched_offer", "status", "updated_at"])

        # Auto-decline all other competing pending offers
        TeacherOffer.objects.filter(
            request=req,
            status=OfferStatus.PENDING,
        ).exclude(id=offer.id).update(
            status=OfferStatus.DECLINED,
            updated_at=timezone.now(),
        )

    return req, offer


def cancel_learner_request(learner: User, request_id: str) -> MarketplaceRequest:
    try:
        req = MarketplaceRequest.objects.get(id=request_id, learner=learner)
    except MarketplaceRequest.DoesNotExist:
        raise ValidationError("درخواست مورد نظر یافت نشد.")

    if req.status == RequestStatus.BOOKED:
        raise ValidationError("درخواست نهایی و رزرو شده را نمی‌توان لغو کرد.")

    with transaction.atomic():
        req.status = RequestStatus.CANCELLED
        req.save(update_fields=["status", "updated_at"])

        TeacherOffer.objects.filter(
            request=req,
            status=OfferStatus.PENDING,
        ).update(
            status=OfferStatus.DECLINED,
            updated_at=timezone.now(),
        )

    return req


def list_teacher_offers(teacher: User, status_filter: str | None = None):
    ensure_teacher_marketplace_eligible(teacher)
    qs = TeacherOffer.objects.filter(teacher=teacher).select_related("request", "request__learner")
    if status_filter and status_filter != "all":
        qs = qs.filter(status=status_filter)
    return qs

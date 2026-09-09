from datetime import datetime, time, date, timedelta, timezone as dt_timezone
from decimal import Decimal
from typing import Optional, List, Dict, Any, Tuple
from django.db import transaction
from django.db.models import Count, Q
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied, ValidationError
from accounts.models import User
from .models import (
    MarketplaceRequest,
    TeacherOffer,
    SessionBooking,
    RequestStatus,
    OfferStatus,
    BookingStatus,
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


def check_schedule_conflict(user: User, start_time, end_time, exclude_booking_id=None) -> bool:
    """
    Checks whether the user (as learner or teacher) has an overlapping active session.
    Active states: CONFIRMED, RESCHEDULE_REQUESTED, IN_PROGRESS.
    """
    active_statuses = [
        BookingStatus.CONFIRMED,
        BookingStatus.RESCHEDULE_REQUESTED,
        BookingStatus.IN_PROGRESS,
    ]
    qs = SessionBooking.objects.filter(
        Q(learner=user) | Q(teacher=user),
        status__in=active_statuses,
        scheduled_start__lt=end_time,
        scheduled_end__gt=start_time,
    )
    if exclude_booking_id:
        qs = qs.exclude(id=exclude_booking_id)
    return qs.exists()


def create_session_booking(
    learner: User,
    teacher: User,
    target_skill: str,
    rate_toman: Decimal,
    scheduled_start,
    duration_minutes: int = 45,
    online_format: str = SessionFormat.VIDEO,
    target_subskill: str = "",
    timezone_name: str = "Asia/Tehran",
    idempotency_key: str | None = None,
    request: MarketplaceRequest | None = None,
    offer: TeacherOffer | None = None,
) -> SessionBooking:
    if not learner.is_authenticated:
        raise PermissionDenied("برای رزرو جلسه ابتدا باید وارد سیستم شوید.")

    ensure_teacher_marketplace_eligible(teacher)

    if learner.id == teacher.id:
        raise ValidationError("امکان رزرو جلسه با خودتان وجود ندارد.")

    # Idempotency check: if key already booked, return existing instance
    if idempotency_key:
        existing = SessionBooking.objects.filter(idempotency_key=idempotency_key).first()
        if existing:
            return existing

    scheduled_end = scheduled_start + timedelta(minutes=duration_minutes)

    # Double booking conflict check
    if check_schedule_conflict(teacher, scheduled_start, scheduled_end):
        raise ValidationError("مدرس در بازه زمانی درخواستی دارای جلسه دیگری است.")

    if check_schedule_conflict(learner, scheduled_start, scheduled_end):
        raise ValidationError("شما در بازه زمانی انتخابی دارای جلسه دیگری هستید.")

    meeting_url = f"/room/{uuid_slug()}"

    booking = SessionBooking.objects.create(
        learner=learner,
        teacher=teacher,
        request=request,
        offer=offer,
        target_skill=target_skill,
        target_subskill=target_subskill,
        duration_minutes=duration_minutes,
        online_format=online_format,
        scheduled_start=scheduled_start,
        scheduled_end=scheduled_end,
        timezone_name=timezone_name,
        rate_toman=rate_toman,
        status=BookingStatus.CONFIRMED,
        idempotency_key=idempotency_key,
        meeting_url=meeting_url,
    )
    return booking


def uuid_slug() -> str:
    import uuid
    return uuid.uuid4().hex[:12]


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

    recent_dup = MarketplaceRequest.objects.filter(
        learner=learner,
        target_skill=target_skill,
        status__in=[RequestStatus.OPEN, RequestStatus.MATCHED],
        created_at__gte=timezone.now() - timedelta(minutes=5),
    ).first()
    if recent_dup:
        raise ValidationError("درخواست مشابهی در چند دقیقه گذشته توسط شما ثبت شده است. لطفاً همان درخواست را پیگیری کنید.")

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
        remaining_pending = TeacherOffer.objects.filter(
            request=req,
            status=OfferStatus.PENDING,
        ).exists()
        if not remaining_pending and req.status == RequestStatus.MATCHED:
            req.status = RequestStatus.OPEN
            req.save(update_fields=["status", "updated_at"])

    return offer


def accept_teacher_offer(learner: User, offer_id: str) -> tuple[MarketplaceRequest, TeacherOffer, SessionBooking]:
    """
    Learner accepts a teacher offer.
    Atomic transaction:
      1. Sets offer status to ACCEPTED
      2. Declines competing offers
      3. Sets request to BOOKED
      4. Creates a confirmed SessionBooking with conflict prevention & idempotency
    """
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

    # Determine booking start time
    start_time = offer.proposed_start_time
    if not start_time or start_time < timezone.now():
        # Default to tomorrow at 16:00 UTC if not provided or in the past
        start_time = (timezone.now() + timedelta(days=1)).replace(hour=16, minute=0, second=0, microsecond=0)

    with transaction.atomic():
        offer.status = OfferStatus.ACCEPTED
        offer.save(update_fields=["status", "updated_at"])

        req.matched_offer = offer
        req.status = RequestStatus.BOOKED
        req.save(update_fields=["matched_offer", "status", "updated_at"])

        TeacherOffer.objects.filter(
            request=req,
            status=OfferStatus.PENDING,
        ).exclude(id=offer.id).update(
            status=OfferStatus.DECLINED,
            updated_at=timezone.now(),
        )

        idempotency_key = f"offer_accept_{offer.id}"
        booking = create_session_booking(
            learner=learner,
            teacher=offer.teacher,
            target_skill=req.target_skill,
            target_subskill=req.target_subskill,
            duration_minutes=offer.duration_minutes,
            online_format=offer.online_format,
            scheduled_start=start_time,
            rate_toman=offer.rate_toman,
            idempotency_key=idempotency_key,
            request=req,
            offer=offer,
        )

    return req, offer, booking


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


def list_user_bookings(user: User, status_filter: str | None = None, role_filter: str | None = None):
    """
    Returns bookings for the user based on role:
      - If role_filter == 'learner': learner bookings only
      - If role_filter == 'teacher': teacher bookings only
      - Else: all bookings where user is learner or teacher
    """
    if role_filter == "learner":
        qs = SessionBooking.objects.filter(learner=user)
    elif role_filter == "teacher":
        qs = SessionBooking.objects.filter(teacher=user)
    else:
        qs = SessionBooking.objects.filter(Q(learner=user) | Q(teacher=user))

    qs = qs.select_related("learner", "teacher", "request")

    if status_filter == "upcoming":
        qs = qs.filter(
            status__in=[
                BookingStatus.CONFIRMED,
                BookingStatus.RESCHEDULE_REQUESTED,
                BookingStatus.IN_PROGRESS,
            ],
            scheduled_end__gte=timezone.now() - timedelta(hours=1),
        ).order_by("scheduled_start")
    elif status_filter == "completed":
        qs = qs.filter(status=BookingStatus.COMPLETED).order_by("-scheduled_start")
    elif status_filter == "cancelled":
        qs = qs.filter(
            status__in=[
                BookingStatus.CANCELLED_BY_LEARNER,
                BookingStatus.CANCELLED_BY_TEACHER,
                BookingStatus.NO_SHOW_LEARNER,
                BookingStatus.NO_SHOW_TEACHER,
            ]
        ).order_by("-scheduled_start")
    elif status_filter and status_filter != "all":
        qs = qs.filter(status=status_filter)

    return qs


def request_booking_reschedule(user: User, booking_id: str, new_start, note: str = "") -> SessionBooking:
    try:
        booking = SessionBooking.objects.get(id=booking_id)
    except SessionBooking.DoesNotExist:
        raise ValidationError("جلسه مورد نظر یافت نشد.")

    if user.id not in [booking.learner_id, booking.teacher_id]:
        raise PermissionDenied("شما دسترسی لازم به این جلسه را ندارید.")

    if booking.status != BookingStatus.CONFIRMED:
        raise ValidationError("تنها جلسات در وضعیت قطعی را می‌توان جابجا کرد.")

    if new_start < timezone.now() + timedelta(minutes=30):
        raise ValidationError("زمان جدید جلسه باید حداقل ۳۰ دقیقه پس از زمان کنونی باشد.")

    new_end = new_start + timedelta(minutes=booking.duration_minutes)

    counterparty = booking.teacher if user.id == booking.learner_id else booking.learner
    if check_schedule_conflict(counterparty, new_start, new_end, exclude_booking_id=booking.id):
        raise ValidationError("طرف مقابل در زمان پیشنهادی جدید دارای جلسه دیگری است.")

    if check_schedule_conflict(user, new_start, new_end, exclude_booking_id=booking.id):
        raise ValidationError("شما در زمان انتخابی جدید دارای جلسه دیگری هستید.")

    booking.status = BookingStatus.RESCHEDULE_REQUESTED
    booking.reschedule_proposed_start = new_start
    booking.reschedule_proposed_end = new_end
    booking.reschedule_requested_by = user
    booking.reschedule_note = note
    booking.save(
        update_fields=[
            "status",
            "reschedule_proposed_start",
            "reschedule_proposed_end",
            "reschedule_requested_by",
            "reschedule_note",
            "updated_at",
        ]
    )
    return booking


def respond_booking_reschedule(user: User, booking_id: str, accept: bool) -> SessionBooking:
    try:
        booking = SessionBooking.objects.get(id=booking_id)
    except SessionBooking.DoesNotExist:
        raise ValidationError("جلسه مورد نظر یافت نشد.")

    if user.id not in [booking.learner_id, booking.teacher_id]:
        raise PermissionDenied("شما دسترسی لازم به این جلسه را ندارید.")

    if booking.status != BookingStatus.RESCHEDULE_REQUESTED:
        raise ValidationError("این جلسه در انتظار پاسخ جابجایی زمان نیست.")

    # Only counterparty can respond
    if booking.reschedule_requested_by_id == user.id:
        raise ValidationError("شما نمی‌توانید به درخواست جابجایی خودتان پاسخ دهید.")

    if accept:
        new_start = booking.reschedule_proposed_start
        new_end = booking.reschedule_proposed_end

        if check_schedule_conflict(booking.teacher, new_start, new_end, exclude_booking_id=booking.id):
            raise ValidationError("مدرس در زمان جدید با جلسه دیگری تداخل دارد.")
        if check_schedule_conflict(booking.learner, new_start, new_end, exclude_booking_id=booking.id):
            raise ValidationError("زبان‌آموز در زمان جدید با جلسه دیگری تداخل دارد.")

        booking.scheduled_start = new_start
        booking.scheduled_end = new_end
        booking.status = BookingStatus.CONFIRMED
        booking.reschedule_proposed_start = None
        booking.reschedule_proposed_end = None
        booking.reschedule_requested_by = None
        booking.reschedule_note = ""
        booking.save(
            update_fields=[
                "scheduled_start",
                "scheduled_end",
                "status",
                "reschedule_proposed_start",
                "reschedule_proposed_end",
                "reschedule_requested_by",
                "reschedule_note",
                "updated_at",
            ]
        )
    else:
        # Revert to confirmed with original times preserved
        booking.status = BookingStatus.CONFIRMED
        booking.reschedule_proposed_start = None
        booking.reschedule_proposed_end = None
        booking.reschedule_requested_by = None
        booking.reschedule_note = ""
        booking.save(
            update_fields=[
                "status",
                "reschedule_proposed_start",
                "reschedule_proposed_end",
                "reschedule_requested_by",
                "reschedule_note",
                "updated_at",
            ]
        )

    return booking


def cancel_session_booking(user: User, booking_id: str, reason: str = "") -> SessionBooking:
    try:
        booking = SessionBooking.objects.get(id=booking_id)
    except SessionBooking.DoesNotExist:
        raise ValidationError("جلسه مورد نظر یافت نشد.")

    if user.id not in [booking.learner_id, booking.teacher_id]:
        raise PermissionDenied("شما دسترسی لازم به این جلسه را ندارید.")

    if booking.status in [BookingStatus.COMPLETED, BookingStatus.CANCELLED_BY_LEARNER, BookingStatus.CANCELLED_BY_TEACHER]:
        raise ValidationError("این جلسه قبلاً پایان یافته یا لغو شده است.")

    status = (
        BookingStatus.CANCELLED_BY_LEARNER
        if user.id == booking.learner_id
        else BookingStatus.CANCELLED_BY_TEACHER
    )

    booking.status = status
    booking.cancellation_reason = reason
    booking.cancelled_at = timezone.now()
    booking.save(update_fields=["status", "cancellation_reason", "cancelled_at", "updated_at"])
    # Auto-refund escrow to learner wallet if held
    try:
        escrow = getattr(booking, "escrow", None)
        if escrow and escrow.status == "held":
            refund_booking_escrow(booking, refund_percentage=100, reason=f"لغو جلسه: {reason}")
    except Exception as exc:
        import logging
        logging.getLogger(__name__).warning("Failed to auto-refund escrow for booking %s: %s", booking.id, exc)
    return booking


def start_session_booking(user: User, booking_id: str) -> SessionBooking:
    try:
        booking = SessionBooking.objects.get(id=booking_id)
    except SessionBooking.DoesNotExist:
        raise ValidationError("جلسه مورد نظر یافت نشد.")

    if user.id not in [booking.learner_id, booking.teacher_id]:
        raise PermissionDenied("شما دسترسی لازم به این جلسه را ندارید.")

    if booking.status not in [BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS]:
        raise ValidationError("تنها جلسات تأییدشده را می‌توان شروع کرد.")

    booking.status = BookingStatus.IN_PROGRESS
    if not booking.started_at:
        booking.started_at = timezone.now()
    booking.save(update_fields=["status", "started_at", "updated_at"])
    return booking


def complete_session_booking(user: User, booking_id: str, session_notes: str = "") -> SessionBooking:
    try:
        booking = SessionBooking.objects.get(id=booking_id)
    except SessionBooking.DoesNotExist:
        raise ValidationError("جلسه مورد نظر یافت نشد.")

    # Typically only teacher or learner can complete
    if user.id not in [booking.learner_id, booking.teacher_id]:
        raise PermissionDenied("شما دسترسی لازم به این جلسه را ندارید.")

    if booking.status == BookingStatus.COMPLETED:
        return booking

    booking.status = BookingStatus.COMPLETED
    booking.completed_at = timezone.now()
    if session_notes:
        booking.session_notes = session_notes
    booking.save(update_fields=["status", "completed_at", "session_notes", "updated_at"])
    # Auto-release escrow to teacher wallet if held
    try:
        escrow = getattr(booking, "escrow", None)
        if escrow and escrow.status == "held":
            release_booking_escrow(booking, "جلسه با موفقیت به اتمام رسید و وجه به کیف پول مدرس واریز شد.")
    except Exception as exc:
        import logging
        logging.getLogger(__name__).warning("Failed to auto-release escrow for booking %s: %s", booking.id, exc)
    return booking


# ---------------------------------------------------------------------------
# Day 39: Teacher Directory, Public Profile & Verified Review Services
# ---------------------------------------------------------------------------

def calculate_teacher_social_proof(teacher_id) -> dict:
    from marketplace.models import TeacherReview, ReviewStatus, SessionBooking, BookingStatus
    from django.db.models import Avg, Count

    completed_sessions = SessionBooking.objects.filter(
        teacher_id=teacher_id,
        status=BookingStatus.COMPLETED,
    ).count()

    reviews_qs = TeacherReview.objects.filter(
        teacher_id=teacher_id,
        status=ReviewStatus.PUBLISHED,
    )

    total_reviews = reviews_qs.count()
    if total_reviews == 0:
        return {
            "average_rating": 5.0,
            "total_reviews": 0,
            "completed_sessions_count": completed_sessions,
            "rating_breakdown": {"5": 0, "4": 0, "3": 0, "2": 0, "1": 0},
            "dimension_averages": {
                "teaching": 5.0,
                "punctuality": 5.0,
                "communication": 5.0,
            },
            "endorsements": ["مدرس تازه‌پیوسته به اندورا"],
        }

    aggs = reviews_qs.aggregate(
        avg_overall=Avg("overall_rating"),
        avg_teaching=Avg("rating_teaching"),
        avg_punctuality=Avg("rating_punctuality"),
        avg_comm=Avg("rating_communication"),
    )

    avg_rating = round(float(aggs["avg_overall"] or 5.0), 2)
    dim_teaching = round(float(aggs["avg_teaching"] or 5.0), 1)
    dim_punct = round(float(aggs["avg_punctuality"] or 5.0), 1)
    dim_comm = round(float(aggs["avg_comm"] or 5.0), 1)

    # Breakdown counts
    counts_by_rating = dict(reviews_qs.values_list("overall_rating").annotate(c=Count("id")))
    breakdown = {str(star): counts_by_rating.get(star, 0) for star in range(5, 0, -1)}

    endorsements = []
    if dim_punct >= 4.8:
        endorsements.append("۱۰۰٪ رضایت در وقت‌شناسی")
    if dim_teaching >= 4.8:
        endorsements.append("کیفیت تدریس برتر")
    if dim_comm >= 4.8:
        endorsements.append("صبور و خوش‌برخورد")
    if completed_sessions >= 10:
        endorsements.append("مدرس باتجربه و پرمخاطب")
    if not endorsements:
        endorsements.append("مدرس تأییدشده اندورا")

    return {
        "average_rating": avg_rating,
        "total_reviews": total_reviews,
        "completed_sessions_count": completed_sessions,
        "rating_breakdown": breakdown,
        "dimension_averages": {
            "teaching": dim_teaching,
            "punctuality": dim_punct,
            "communication": dim_comm,
        },
        "endorsements": endorsements,
    }


def list_public_teachers(
    search: str | None = None,
    skill: str | None = None,
    min_rating: float | None = None,
    max_rate_toman: Decimal | None = None,
    sort_by: str = "rating",
) -> list[dict]:
    from accounts.models import User
    from django.db.models import Q

    qs = User.objects.filter(
        role=User.Role.TEACHER,
        is_teacher_verified=True,
        marketplace_eligible=True,
    ).select_related("teacher_profile")

    if search:
        s = search.strip()
        qs = qs.filter(
            Q(first_name__icontains=s)
            | Q(last_name__icontains=s)
            | Q(teacher_profile__public_name__icontains=s)
            | Q(teacher_profile__headline__icontains=s)
            | Q(teacher_profile__bio__icontains=s)
        )

    teachers_list = []
    for teacher in qs:
        prof = getattr(teacher, "teacher_profile", None)
        specs = prof.specialties if prof and prof.specialties else []
        if skill and skill != "all" and skill not in specs:
            continue

        hourly_rate = prof.hourly_rate_toman if prof and prof.hourly_rate_toman else Decimal("300000")
        if max_rate_toman and hourly_rate > max_rate_toman:
            continue

        social_proof = calculate_teacher_social_proof(teacher.id)
        if min_rating and social_proof["average_rating"] < min_rating:
            continue

        full_name = f"{teacher.first_name or ''} {teacher.last_name or ''}".strip()
        if prof and prof.public_name:
            full_name = prof.public_name

        teachers_list.append({
            "id": str(teacher.id),
            "name": full_name or "مدرس اندورا",
            "headline": (prof.headline if prof else "") or "مدرس زبان انگلیسی اندورا",
            "bio": (prof.bio if prof else "") or "",
            "city": (prof.city if prof else "") or "تهران",
            "experience_years": (prof.experience_years if prof else 3) or 3,
            "specialties": specs,
            "hourly_rate_toman": int(hourly_rate),
            "response_time_minutes": prof.response_time_minutes if prof else 30,
            "social_proof": social_proof,
            "is_verified": True,
        })

    # Sorting
    if sort_by == "rating":
        teachers_list.sort(key=lambda t: (t["social_proof"]["average_rating"], t["social_proof"]["total_reviews"]), reverse=True)
    elif sort_by == "sessions":
        teachers_list.sort(key=lambda t: t["social_proof"]["completed_sessions_count"], reverse=True)
    elif sort_by == "price_asc":
        teachers_list.sort(key=lambda t: t["hourly_rate_toman"])
    elif sort_by == "price_desc":
        teachers_list.sort(key=lambda t: t["hourly_rate_toman"], reverse=True)
    elif sort_by == "experience":
        teachers_list.sort(key=lambda t: t["experience_years"], reverse=True)

    return teachers_list


def get_teacher_public_profile(teacher_id) -> dict:
    from accounts.models import User
    from marketplace.models import TeacherReview, ReviewStatus

    try:
        teacher = User.objects.select_related("teacher_profile").get(
            id=teacher_id,
            role=User.Role.TEACHER,
            is_teacher_verified=True,
            marketplace_eligible=True,
        )
    except User.DoesNotExist:
        raise ValidationError("مدرس مورد نظر یافت نشد یا پروفایل عمومی آن فعال نیست.")

    prof = getattr(teacher, "teacher_profile", None)
    social_proof = calculate_teacher_social_proof(teacher.id)

    full_name = f"{teacher.first_name or ''} {teacher.last_name or ''}".strip()
    if prof and prof.public_name:
        full_name = prof.public_name

    # Fetch recent reviews
    recent_reviews_qs = TeacherReview.objects.filter(
        teacher=teacher,
        status=ReviewStatus.PUBLISHED,
    ).order_by("-created_at")[:10]

    reviews_data = []
    for r in recent_reviews_qs:
        reviews_data.append({
            "id": str(r.id),
            "learner_name": r.masked_display_name,
            "overall_rating": r.overall_rating,
            "rating_teaching": r.rating_teaching,
            "rating_punctuality": r.rating_punctuality,
            "rating_communication": r.rating_communication,
            "comment": r.comment,
            "teacher_reply": r.teacher_reply,
            "teacher_replied_at": r.teacher_replied_at.isoformat() if r.teacher_replied_at else None,
            "created_at": r.created_at.isoformat(),
        })

    return {
        "id": str(teacher.id),
        "name": full_name or "مدرس اندورا",
        "headline": (prof.headline if prof else "") or "مدرس زبان انگلیسی اندورا",
        "bio": (prof.bio if prof else "") or "مدرس متعهد و مجرب اندورا با رویکرد آموزش شخصی‌سازی‌شده و متمرکز بر اهداف زبان‌آموز.",
        "city": (prof.city if prof else "") or "تهران",
        "experience_years": (prof.experience_years if prof else 3) or 3,
        "specialties": prof.specialties if prof and prof.specialties else ["speaking", "grammar"],
        "languages": prof.languages if prof and prof.languages else ["فارسی", "انگلیسی"],
        "education": prof.education if prof and prof.education else [{"degree": "کارشناسی ارشد زبان و ادبیات انگلیسی", "institution": "دانشگاه تهران"}],
        "certifications": prof.certifications if prof and prof.certifications else [{"name": "CELTA Certificate", "issuer": "Cambridge English", "year": "2021"}],
        "video_intro_url": prof.video_intro_url if prof else "",
        "hourly_rate_toman": int(prof.hourly_rate_toman if prof and prof.hourly_rate_toman else Decimal("300000")),
        "response_time_minutes": prof.response_time_minutes if prof else 30,
        "social_proof": social_proof,
        "reviews": reviews_data,
        "is_verified": True,
    }


def submit_session_review(
    booking_id: str,
    learner: User,
    overall_rating: int,
    comment: str,
    rating_teaching: int = 5,
    rating_punctuality: int = 5,
    rating_communication: int = 5,
    is_anonymous: bool = False,
):
    import re
    from marketplace.models import SessionBooking, BookingStatus, TeacherReview, ReviewStatus

    if not learner.is_authenticated:
        raise PermissionDenied("برای ثبت نظر باید وارد حساب کاربری شوید.")

    try:
        booking = SessionBooking.objects.select_related("teacher", "learner").get(id=booking_id)
    except SessionBooking.DoesNotExist:
        raise ValidationError("جلسه رزرو شده یافت نشد.")

    if booking.learner_id != learner.id:
        raise PermissionDenied("تنها زبان‌آموز شرکت‌کننده در این جلسه مجاز به ثبت بازخورد است.")

    if booking.status != BookingStatus.COMPLETED:
        raise ValidationError("امکان ثبت نظر فقط برای جلساتی که وضعیت آن‌ها تکمیل‌شده (Completed) است وجود دارد.")

    if hasattr(booking, "review"):
        raise ValidationError("برای این جلسه قبلاً نظر و امتیاز ثبت شده است.")

    if not (1 <= overall_rating <= 5):
        raise ValidationError("امتیاز کلی باید بین ۱ تا ۵ باشد.")

    for r_name, r_val in [
        ("کیفیت تدریس", rating_teaching),
        ("وقت‌شناسی", rating_punctuality),
        ("فن بیان و ارتباط", rating_communication),
    ]:
        if not (1 <= r_val <= 5):
            raise ValidationError(f"امتیاز {r_name} باید بین ۱ تا ۵ باشد.")

    clean_comment = comment.strip()
    if len(clean_comment) < 10:
        raise ValidationError("متن نظر باید حداقل ۱۰ کاراکتر باشد.")

    # PII and Content Scanner
    phone_pattern = re.compile(r"(\+?98|0)?9\d{9}")
    email_pattern = re.compile(r"[\w\.-]+@[\w\.-]+\.\w+")

    status = ReviewStatus.PUBLISHED
    flag_reason = ""
    if phone_pattern.search(clean_comment) or email_pattern.search(clean_comment):
        status = ReviewStatus.PENDING_MODERATION
        flag_reason = "شامل شماره تماس یا ایمیل شناسایی‌شده توسط اسکنر PII"

    # Masked name
    if is_anonymous:
        masked_name = "زبان‌آموز اندورا"
    else:
        fn = learner.first_name.strip() if learner.first_name else ""
        ln = learner.last_name.strip() if learner.last_name else ""
        if fn and ln:
            masked_name = f"{fn} {ln[0]}."
        elif fn:
            masked_name = fn
        else:
            masked_name = "زبان‌آموز اندورا"

    with transaction.atomic():
        review = TeacherReview.objects.create(
            booking=booking,
            teacher=booking.teacher,
            learner=learner,
            overall_rating=overall_rating,
            rating_teaching=rating_teaching,
            rating_punctuality=rating_punctuality,
            rating_communication=rating_communication,
            comment=clean_comment,
            is_anonymous=is_anonymous,
            masked_display_name=masked_name,
            status=status,
            flag_reason=flag_reason,
        )

    return review


def reply_to_teacher_review(
    review_id: str,
    teacher: User,
    reply_text: str,
):
    from marketplace.models import TeacherReview

    if not teacher.is_authenticated:
        raise PermissionDenied("تنها کاربر وارد شده می‌تواند پاسخ ثبت کند.")

    try:
        review = TeacherReview.objects.get(id=review_id)
    except TeacherReview.DoesNotExist:
        raise ValidationError("نظر مورد نظر یافت نشد.")

    if review.teacher_id != teacher.id:
        raise PermissionDenied("شما تنها می‌توانید به نظرات ثبت شده برای خودتان پاسخ دهید.")

    clean_reply = reply_text.strip()
    if not clean_reply:
        raise ValidationError("متن پاسخ مدرس نمی‌تواند خالی باشد.")

    with transaction.atomic():
        review.teacher_reply = clean_reply
        review.teacher_replied_at = timezone.now()
        review.save(update_fields=["teacher_reply", "teacher_replied_at", "updated_at"])

    return review


def flag_teacher_review(
    review_id: str,
    user: User,
    reason: str,
):
    from marketplace.models import TeacherReview, ReviewStatus

    if not user.is_authenticated:
        raise PermissionDenied("برای گزارش تخلف باید وارد حساب خود شوید.")

    try:
        review = TeacherReview.objects.get(id=review_id)
    except TeacherReview.DoesNotExist:
        raise ValidationError("نظر مورد نظر یافت نشد.")

    clean_reason = reason.strip()
    if not clean_reason:
        raise ValidationError("لطفاً علت گزارش تخلف را شرح دهید.")

    with transaction.atomic():
        review.status = ReviewStatus.FLAGGED
        review.flag_reason = f"گزارش توسط {user.email}: {clean_reason}"
        review.save(update_fields=["status", "flag_reason", "updated_at"])

    return review
# ---------------------------------------------------------------------------
# Day 40: Teacher Availability Calendar, Recurring Slots & Time-Off Services
# ---------------------------------------------------------------------------

import zoneinfo
from datetime import datetime, date, time, timedelta

TEHRAN_TZ = zoneinfo.ZoneInfo("Asia/Tehran")

PERSIAN_WEEKDAY_NAMES = {
    0: "شنبه",
    1: "یک‌شنبه",
    2: "دوشنبه",
    3: "سه‌شنبه",
    4: "چهارشنبه",
    5: "پنج‌شنبه",
    6: "جمعه",
}


def get_teacher_weekly_schedule(teacher_id) -> list[dict]:
    from marketplace.models import TeacherAvailabilitySlot
    slots = TeacherAvailabilitySlot.objects.filter(
        teacher_id=teacher_id,
        is_active=True,
    ).order_by("day_of_week", "start_time")

    result = []
    for s in slots:
        result.append({
            "id": str(s.id),
            "day_of_week": s.day_of_week,
            "day_name": PERSIAN_WEEKDAY_NAMES.get(s.day_of_week, ""),
            "start_time": s.start_time.strftime("%H:%M"),
            "end_time": s.end_time.strftime("%H:%M"),
            "is_active": s.is_active,
        })
    return result


def save_teacher_weekly_schedule(teacher: User, slots_data: list[dict]) -> list[dict]:
    from marketplace.models import TeacherAvailabilitySlot, DayOfWeek

    if not (teacher.is_teacher_verified and teacher.marketplace_eligible):
        raise PermissionDenied("تنها مدرسان ارزیابی‌شده و تأییدشده مجاز به تنظیم تقویم دسترسی هستند.")

    validated_slots = []
    # Group by day to check internal collisions
    slots_by_day: dict[int, list[tuple[time, time]]] = {d: [] for d in range(7)}

    for item in slots_data:
        dow = int(item.get("day_of_week", 0))
        if dow not in range(7):
            raise ValidationError(f"روز هفته نامعتبر است: {dow}")

        st_raw = item.get("start_time")
        et_raw = item.get("end_time")
        if not st_raw or not et_raw:
            raise ValidationError("ساعت آغاز و پایان الزامی است.")

        if isinstance(st_raw, str):
            st_parts = [int(p) for p in st_raw.split(":")[:2]]
            st = time(st_parts[0], st_parts[1])
        else:
            st = st_raw

        if isinstance(et_raw, str):
            et_parts = [int(p) for p in et_raw.split(":")[:2]]
            et = time(et_parts[0], et_parts[1])
        else:
            et = et_raw

        if st >= et:
            raise ValidationError(f"ساعت پایان ({et.strftime('%H:%M')}) باید پس از ساعت آغاز ({st.strftime('%H:%M')}) باشد.")

        # Check overlapping slots within the same day
        for existing_st, existing_et in slots_by_day[dow]:
            if not (et <= existing_st or st >= existing_et):
                raise ValidationError(
                    f"تداخل زمانی در روز {PERSIAN_WEEKDAY_NAMES.get(dow, '')}: بازه {st.strftime('%H:%M')}-{et.strftime('%H:%M')} با بازه {existing_st.strftime('%H:%M')}-{existing_et.strftime('%H:%M')} هم‌پوشانی دارد."
                )

        slots_by_day[dow].append((st, et))
        validated_slots.append(
            TeacherAvailabilitySlot(
                teacher=teacher,
                day_of_week=dow,
                start_time=st,
                end_time=et,
                is_active=item.get("is_active", True),
            )
        )

    with transaction.atomic():
        TeacherAvailabilitySlot.objects.filter(teacher=teacher).delete()
        if validated_slots:
            TeacherAvailabilitySlot.objects.bulk_create(validated_slots)

    return get_teacher_weekly_schedule(teacher.id)


def list_teacher_time_off(teacher_id, future_only: bool = True) -> list[dict]:
    from marketplace.models import TeacherTimeOff
    qs = TeacherTimeOff.objects.filter(teacher_id=teacher_id)
    if future_only:
        qs = qs.filter(end_datetime__gte=timezone.now())

    qs = qs.order_by("start_datetime")
    result = []
    for item in qs:
        st_tehran = item.start_datetime.astimezone(TEHRAN_TZ)
        et_tehran = item.end_datetime.astimezone(TEHRAN_TZ)
        result.append({
            "id": str(item.id),
            "start_datetime": item.start_datetime.isoformat(),
            "end_datetime": item.end_datetime.isoformat(),
            "start_display": st_tehran.strftime("%Y/%m/%d - %H:%M"),
            "end_display": et_tehran.strftime("%Y/%m/%d - %H:%M"),
            "reason": item.reason,
            "is_full_day": item.is_full_day,
            "created_at": item.created_at.isoformat(),
        })
    return result


def add_teacher_time_off(
    teacher: User,
    start_datetime: datetime,
    end_datetime: datetime,
    reason: str = "",
    is_full_day: bool = False,
):
    from marketplace.models import TeacherTimeOff, SessionBooking, BookingStatus

    if not (teacher.is_teacher_verified and teacher.marketplace_eligible):
        raise PermissionDenied("تنها مدرسان معتبر مجاز به ثبت مرخصی و بلاک زمانی هستند.")

    if start_datetime >= end_datetime:
        raise ValidationError("زمان پایان باید بعد از زمان آغاز باشد.")

    if end_datetime <= timezone.now():
        raise ValidationError("امکان ثبت مرخصی برای زمان‌های گذشته وجود ندارد.")

    # Check for active bookings conflict
    conflicts = SessionBooking.objects.filter(
        teacher=teacher,
        status__in=[BookingStatus.CONFIRMED, BookingStatus.RESCHEDULE_REQUESTED, BookingStatus.IN_PROGRESS],
        scheduled_start__lt=end_datetime,
        scheduled_end__gt=start_datetime,
    )
    if conflicts.exists():
        conflict_list = []
        for c in conflicts[:3]:
            st = c.scheduled_start.astimezone(TEHRAN_TZ).strftime("%Y/%m/%d %H:%M")
            conflict_list.append(f"جلسه با {c.learner.email} در تاریخ {st}")
        details = "، ".join(conflict_list)
        raise ValidationError(
            f"تداخل با جلسات رزرو شده قبلی: در این بازه زمانی {conflicts.count()} جلسه رزرو شده فعال وجود دارد ({details}). لطفاً ابتدا نسبت به جابجایی یا لغو این جلسات اقدام نمایید."
        )

    return TeacherTimeOff.objects.create(
        teacher=teacher,
        start_datetime=start_datetime,
        end_datetime=end_datetime,
        reason=reason.strip(),
        is_full_day=is_full_day,
    )


def delete_teacher_time_off(teacher: User, time_off_id: str) -> bool:
    from marketplace.models import TeacherTimeOff
    try:
        time_off = TeacherTimeOff.objects.get(id=time_off_id, teacher=teacher)
    except TeacherTimeOff.DoesNotExist:
        raise ValidationError("مورد مرخصی مورد نظر یافت نشد.")

    time_off.delete()
    return True


def get_or_create_availability_settings(teacher_id):
    from marketplace.models import TeacherAvailabilitySetting
    from accounts.models import User
    try:
        teacher = User.objects.get(id=teacher_id)
    except User.DoesNotExist:
        raise ValidationError("مدرس مورد نظر یافت نشد.")

    settings, _ = TeacherAvailabilitySetting.objects.get_or_create(
        teacher=teacher,
        defaults={
            "notice_lead_time_hours": 12,
            "max_booking_ahead_days": 14,
            "default_session_duration_minutes": 45,
            "default_buffer_minutes": 15,
            "auto_accept_bookings": True,
        },
    )
    return settings


def update_availability_settings(teacher: User, settings_data: dict):
    settings = get_or_create_availability_settings(teacher.id)

    if "notice_lead_time_hours" in settings_data:
        val = int(settings_data["notice_lead_time_hours"])
        if not (1 <= val <= 72):
            raise ValidationError("فاصله رزرو از قبل باید بین ۱ تا ۷۲ ساعت باشد.")
        settings.notice_lead_time_hours = val

    if "max_booking_ahead_days" in settings_data:
        val = int(settings_data["max_booking_ahead_days"])
        if not (1 <= val <= 60):
            raise ValidationError("حداکثر روزهای قابل رزرو باید بین ۱ تا ۶۰ روز باشد.")
        settings.max_booking_ahead_days = val

    if "default_session_duration_minutes" in settings_data:
        val = int(settings_data["default_session_duration_minutes"])
        if val not in [30, 45, 60, 90]:
            raise ValidationError("مدت جلسه باید ۳۰، ۴۵، ۶۰ یا ۹۰ دقیقه باشد.")
        settings.default_session_duration_minutes = val

    buffer_val = settings_data.get("default_buffer_minutes") or settings_data.get("buffer_minutes")
    if buffer_val is not None:
        val = int(buffer_val)
        if not (0 <= val <= 60):
            raise ValidationError("فاصله استراحت بین جلسات باید بین ۰ تا ۶۰ دقیقه باشد.")
        settings.default_buffer_minutes = val

    if "auto_accept_bookings" in settings_data:
        settings.auto_accept_bookings = bool(settings_data["auto_accept_bookings"])

    settings.save()
    return settings


def generate_teacher_available_slots(
    teacher_id,
    start_date: date | None = None,
    end_date: date | None = None,
    duration_minutes: int | None = None,
) -> list[dict]:
    from marketplace.models import (
        TeacherAvailabilitySlot,
        TeacherTimeOff,
        SessionBooking,
        BookingStatus,
    )
    from accounts.models import User

    try:
        teacher = User.objects.get(
            id=teacher_id,
            role=User.Role.TEACHER,
            is_teacher_verified=True,
            marketplace_eligible=True,
        )
    except User.DoesNotExist:
        raise ValidationError("مدرس مورد نظر یافت نشد یا مجاز به ارائه خدمات در بازارگاه نیست.")

    settings = get_or_create_availability_settings(teacher.id)
    session_duration = duration_minutes or settings.default_session_duration_minutes
    buffer_m = settings.default_buffer_minutes
    lead_time_h = settings.notice_lead_time_hours
    max_days = settings.max_booking_ahead_days

    now_tehran = datetime.now(TEHRAN_TZ)
    now_utc = timezone.now()
    earliest_bookable_utc = now_utc + timedelta(hours=lead_time_h)

    if not start_date:
        start_date = now_tehran.date()
    if not end_date:
        end_date = start_date + timedelta(days=max_days)

    # Restrict to max horizon
    max_allowed_date = now_tehran.date() + timedelta(days=max_days)
    if end_date > max_allowed_date:
        end_date = max_allowed_date

    if start_date > end_date:
        return []

    # 1. Fetch recurring availability
    recurring_slots = list(
        TeacherAvailabilitySlot.objects.filter(
            teacher=teacher,
            is_active=True,
        ).order_by("day_of_week", "start_time")
    )
    if not recurring_slots:
        return []

    # Map recurring slots by day_of_week
    slots_by_dow: dict[int, list[TeacherAvailabilitySlot]] = {d: [] for d in range(7)}
    for s in recurring_slots:
        slots_by_dow[s.day_of_week].append(s)

    # 2. Fetch active time-offs in range
    range_start_utc = datetime.combine(start_date, time.min, tzinfo=TEHRAN_TZ).astimezone(dt_timezone.utc)
    range_end_utc = datetime.combine(end_date, time.max, tzinfo=TEHRAN_TZ).astimezone(dt_timezone.utc)

    time_offs = list(
        TeacherTimeOff.objects.filter(
            teacher=teacher,
            end_datetime__gte=range_start_utc,
            start_datetime__lte=range_end_utc,
        )
    )

    # 3. Fetch active bookings in range
    active_bookings = list(
        SessionBooking.objects.filter(
            teacher=teacher,
            status__in=[
                BookingStatus.CONFIRMED,
                BookingStatus.RESCHEDULE_REQUESTED,
                BookingStatus.IN_PROGRESS,
            ],
            scheduled_end__gte=range_start_utc,
            scheduled_start__lte=range_end_utc,
        )
    )

    days_result = []
    curr_date = start_date

    while curr_date <= end_date:
        # Python weekday: Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
        # Iranian dow: Sat=0, Sun=1, Mon=2, Tue=3, Wed=4, Thu=5, Fri=6
        iran_dow = (curr_date.weekday() + 2) % 7
        dow_slots = slots_by_dow.get(iran_dow, [])

        day_available_slots = []
        for block in dow_slots:
            block_start_dt = datetime.combine(curr_date, block.start_time, tzinfo=TEHRAN_TZ)
            block_end_dt = datetime.combine(curr_date, block.end_time, tzinfo=TEHRAN_TZ)

            slot_start = block_start_dt
            while True:
                slot_end = slot_start + timedelta(minutes=session_duration)
                if slot_end > block_end_dt:
                    break

                slot_start_utc = slot_start.astimezone(dt_timezone.utc)
                slot_end_utc = slot_end.astimezone(dt_timezone.utc)

                # Check 1: Lead time
                if slot_start_utc < earliest_bookable_utc:
                    slot_start = slot_end + timedelta(minutes=buffer_m)
                    continue

                # Check 2: Time-off collisions
                has_time_off = any(
                    to.start_datetime < slot_end_utc and to.end_datetime > slot_start_utc
                    for to in time_offs
                )
                if has_time_off:
                    slot_start = slot_end + timedelta(minutes=buffer_m)
                    continue

                # Check 3: Booking collisions
                has_booking = any(
                    b.scheduled_start < slot_end_utc and b.scheduled_end > slot_start_utc
                    for b in active_bookings
                )
                if has_booking:
                    slot_start = slot_end + timedelta(minutes=buffer_m)
                    continue

                day_name_fa = PERSIAN_WEEKDAY_NAMES.get(iran_dow, "")
                day_available_slots.append({
                    "start_utc": slot_start_utc.isoformat(),
                    "end_utc": slot_end_utc.isoformat(),
                    "start_time_tehran": slot_start.strftime("%H:%M"),
                    "end_time_tehran": slot_end.strftime("%H:%M"),
                    "start_tehran": slot_start.strftime("%H:%M"),
                    "end_tehran": slot_end.strftime("%H:%M"),
                    "duration_minutes": session_duration,
                    "is_bookable": True,
                    "date": curr_date.isoformat(),
                    "day_of_week": iran_dow,
                    "day_name_fa": day_name_fa,
                    "jalali_date": f"{curr_date.year}/{curr_date.month:02d}/{curr_date.day:02d}",
                })

                # Move to next slot accounting for buffer
                slot_start = slot_end + timedelta(minutes=buffer_m)

        if day_available_slots:
            day_name_fa = PERSIAN_WEEKDAY_NAMES.get(iran_dow, "")
            days_result.append({
                "date": curr_date.isoformat(),
                "day_of_week": iran_dow,
                "day_name": day_name_fa,
                "day_name_fa": day_name_fa,
                "jalali_date": f"{curr_date.year}/{curr_date.month:02d}/{curr_date.day:02d}",
                "slots_count": len(day_available_slots),
                "slots": day_available_slots,
            })

        curr_date += timedelta(days=1)

    return days_result

# ---------------------------------------------------------------------------
# Day 41: Marketplace Admin Moderation, Teacher Onboarding & Dispute Resolution
# ---------------------------------------------------------------------------

def open_booking_dispute(
    user: User,
    booking_id: str,
    reason_category: str,
    description: str,
    evidence_notes: str = "",
):
    from marketplace.models import (
        SessionBooking,
        BookingDispute,
        BookingStatus,
        DisputeReasonCategory,
        DisputeStatus,
    )

    try:
        booking = SessionBooking.objects.get(id=booking_id)
    except SessionBooking.DoesNotExist:
        raise ValidationError("جلسه مورد نظر یافت نشد.")

    # Only participants can dispute
    if booking.learner != user and booking.teacher != user:
        raise PermissionDenied("فقط طرفین حاضر در این جلسه (زبان‌آموز یا مدرس) مجاز به ثبت اختلاف هستند.")

    if not description or len(description.strip()) < 15:
        raise ValidationError("توضیحات اختلاف باید حداقل ۱۵ کاراکتر و شامل شرح شفاف مشکل باشد.")

    if reason_category not in DisputeReasonCategory.values:
        raise ValidationError("دسته‌بندی دلیل اختلاف نامعتبر است.")

    # Check if dispute already exists
    if hasattr(booking, "dispute") and booking.dispute is not None:
        raise ValidationError("برای این جلسه قبلاً پرونده اختلاف ثبت شده است.")

    eligible_statuses = [
        BookingStatus.CONFIRMED,
        BookingStatus.IN_PROGRESS,
        BookingStatus.COMPLETED,
        BookingStatus.RESCHEDULE_REQUESTED,
    ]
    if booking.status not in eligible_statuses:
        raise ValidationError(f"امکان ثبت اختلاف برای جلسه‌ای با وضعیت '{booking.get_status_display()}' وجود ندارد.")

    with transaction.atomic():
        dispute = BookingDispute.objects.create(
            booking=booking,
            opened_by=user,
            reason_category=reason_category,
            description=description.strip(),
            evidence_notes=evidence_notes.strip(),
            status=DisputeStatus.OPEN,
        )
        booking.status = BookingStatus.DISPUTED
        booking.save(update_fields=["status", "updated_at"])

    return dispute


def list_marketplace_disputes(status: str | None = None, category: str | None = None):
    from marketplace.models import BookingDispute
    qs = BookingDispute.objects.select_related("booking", "booking__learner", "booking__teacher", "opened_by", "resolved_by").all()
    if status:
        qs = qs.filter(status=status)
    if category:
        qs = qs.filter(reason_category=category)
    return list(qs.order_by("-created_at"))


def get_booking_dispute_detail(dispute_id: str, user: User):
    from marketplace.models import BookingDispute
    try:
        dispute = BookingDispute.objects.select_related("booking", "booking__learner", "booking__teacher", "opened_by", "resolved_by").get(id=dispute_id)
    except BookingDispute.DoesNotExist:
        raise ValidationError("پرونده اختلاف مورد نظر یافت نشد.")

    # Allow staff or booking participants
    is_staff = user.is_staff or getattr(user, "role", "") == User.Role.ADMINISTRATOR
    is_participant = dispute.booking.learner == user or dispute.booking.teacher == user
    if not (is_staff or is_participant):
        raise PermissionDenied("شما مجوز مشاهده این پرونده اختلاف را ندارید.")

    return dispute


def resolve_booking_dispute(
    admin_user: User,
    dispute_id: str,
    resolution_status: str,
    resolution_notes: str,
    refund_percentage: int = 0,
):
    from marketplace.models import BookingDispute, DisputeStatus, BookingStatus

    if not (admin_user.is_staff or getattr(admin_user, "role", "") == User.Role.ADMINISTRATOR):
        raise PermissionDenied("فقط مدیران و کارشناسان پشتیبانی مجاز به صدور رأی اختلاف هستند.")

    try:
        dispute = BookingDispute.objects.select_related("booking").get(id=dispute_id)
    except BookingDispute.DoesNotExist:
        raise ValidationError("پرونده اختلاف یافت نشد.")

    valid_resolutions = [
        DisputeStatus.RESOLVED_FULL_REFUND,
        DisputeStatus.RESOLVED_PARTIAL_REFUND,
        DisputeStatus.RESOLVED_PAY_TEACHER,
        DisputeStatus.DISMISSED,
    ]
    if resolution_status not in valid_resolutions:
        raise ValidationError("نتیجه رأی صادره نامعتبر است.")

    if not (0 <= refund_percentage <= 100):
        raise ValidationError("درصد بازگشت وجه باید عددی بین ۰ تا ۱۰۰ باشد.")

    if not resolution_notes or len(resolution_notes.strip()) < 5:
        raise ValidationError("ثبت توضیحات و مستندات رأی داوری برای پرونده الزامی است.")

    with transaction.atomic():
        dispute.status = resolution_status
        dispute.resolution_notes = resolution_notes.strip()
        dispute.refund_percentage = refund_percentage
        dispute.resolved_by = admin_user
        dispute.resolved_at = timezone.now()
        dispute.save()

        booking = dispute.booking
        if resolution_status == DisputeStatus.RESOLVED_FULL_REFUND:
            dispute.refund_percentage = 100
            dispute.save(update_fields=["refund_percentage"])
            booking.status = BookingStatus.CANCELLED_BY_TEACHER
            booking.cancellation_reason = f"لغو ناشی از رأی داوری اندورا (بازپرداخت ۱۰۰٪ به زبان‌آموز): {resolution_notes}"
        elif resolution_status == DisputeStatus.RESOLVED_PARTIAL_REFUND:
            booking.status = BookingStatus.COMPLETED
            booking.session_notes = f"تسویه توافقی داوری با {refund_percentage}٪ بازگشت وجه به زبان‌آموز."
        elif resolution_status == DisputeStatus.RESOLVED_PAY_TEACHER:
            booking.status = BookingStatus.COMPLETED
            dispute.refund_percentage = 0
            dispute.save(update_fields=["refund_percentage"])
        elif resolution_status == DisputeStatus.DISMISSED:
            booking.status = BookingStatus.COMPLETED

        booking.save(update_fields=["status", "cancellation_reason", "session_notes", "updated_at"])
        # Settle escrow according to dispute refund percentage
        try:
            escrow = getattr(booking, "escrow", None)
            if escrow and escrow.status == "held":
                refund_booking_escrow(booking, refund_percentage=dispute.refund_percentage, reason=f"رأی داوری: {resolution_notes}")
        except Exception as exc:
            import logging
            logging.getLogger(__name__).warning("Failed to settle dispute escrow for booking %s: %s", booking.id, exc)

    return dispute


def get_or_create_teacher_onboarding_application(teacher_user: User):
    from marketplace.models import TeacherOnboardingApplication
    if teacher_user.role != User.Role.TEACHER:
        raise PermissionDenied("فقط کاربران دارای نقش مدرس می‌توانند درخواست احراز هویت ثبت کنند.")

    app, _ = TeacherOnboardingApplication.objects.get_or_create(
        teacher=teacher_user,
        defaults={"status": "pending"},
    )
    return app


def submit_teacher_onboarding_application(teacher_user: User, data: dict):
    from marketplace.models import TeacherOnboardingStatus

    app = get_or_create_teacher_onboarding_application(teacher_user)

    if "national_id_number" in data:
        app.national_id_number = str(data["national_id_number"]).strip()
    if "id_document_url" in data:
        app.id_document_url = str(data["id_document_url"]).strip()
    if "degree_document_url" in data:
        app.degree_document_url = str(data["degree_document_url"]).strip()
    if "celta_tesol_document_url" in data:
        app.celta_tesol_document_url = str(data["celta_tesol_document_url"]).strip()
    if "sample_teaching_url" in data:
        app.sample_teaching_url = str(data["sample_teaching_url"]).strip()

    app.status = TeacherOnboardingStatus.PENDING
    app.rejection_reason = ""
    app.save()
    return app


def list_teacher_onboarding_applications(status: str | None = None):
    from marketplace.models import TeacherOnboardingApplication
    qs = TeacherOnboardingApplication.objects.select_related("teacher", "reviewed_by").all()
    if status:
        qs = qs.filter(status=status)
    return list(qs.order_by("-created_at"))


def review_teacher_onboarding_application(
    admin_user: User,
    application_id: str,
    action: str,
    admin_notes: str = "",
    reason: str = "",
):
    from marketplace.models import TeacherOnboardingApplication, TeacherOnboardingStatus

    if not (admin_user.is_staff or getattr(admin_user, "role", "") == User.Role.ADMINISTRATOR):
        raise PermissionDenied("فقط مدیران مجاز به تأیید مدارک مدرسین هستند.")

    try:
        app = TeacherOnboardingApplication.objects.select_related("teacher").get(id=application_id)
    except TeacherOnboardingApplication.DoesNotExist:
        raise ValidationError("درخواست احراز هویت یافت نشد.")

    teacher = app.teacher

    with transaction.atomic():
        app.reviewed_by = admin_user
        app.reviewed_at = timezone.now()
        app.admin_notes = admin_notes.strip()

        if action == "approve":
            app.status = TeacherOnboardingStatus.APPROVED
            app.rejection_reason = ""
            teacher.is_teacher_verified = True
            teacher.marketplace_eligible = True
            teacher.save(update_fields=["is_teacher_verified", "marketplace_eligible"])
        elif action == "reject":
            app.status = TeacherOnboardingStatus.REJECTED
            app.rejection_reason = reason.strip() or "مدارک ارسالی با استانداردهای علمی پلتفرم همخوانی ندارد."
            teacher.is_teacher_verified = False
            teacher.marketplace_eligible = False
            teacher.save(update_fields=["is_teacher_verified", "marketplace_eligible"])
        elif action == "request_revision":
            app.status = TeacherOnboardingStatus.REVISION_REQUESTED
            app.rejection_reason = reason.strip() or "لطفاً تصاویر باکیفیت‌تر و شفاف‌تری از مدارک بارگذاری فرمایید."
            teacher.is_teacher_verified = False
            teacher.marketplace_eligible = False
            teacher.save(update_fields=["is_teacher_verified", "marketplace_eligible"])
        else:
            raise ValidationError("عملیات بررسی نامعتبر است (مجاز: approve, reject, request_revision).")

        app.save()

    return app


def toggle_teacher_marketplace_eligibility(
    admin_user: User,
    teacher_id: str,
    eligible: bool,
    reason: str = "",
):
    if not (admin_user.is_staff or getattr(admin_user, "role", "") == User.Role.ADMINISTRATOR):
        raise PermissionDenied("فقط مدیران مجاز به تغییر سطح دسترسی بازارگاه مدرسین هستند.")

    try:
        teacher = User.objects.get(id=teacher_id, role=User.Role.TEACHER)
    except User.DoesNotExist:
        raise ValidationError("مدرس مورد نظر یافت نشد.")

    teacher.marketplace_eligible = bool(eligible)
    teacher.save(update_fields=["marketplace_eligible"])

    return {
        "teacher_id": str(teacher.id),
        "teacher_email": teacher.email,
        "marketplace_eligible": teacher.marketplace_eligible,
        "is_teacher_verified": teacher.is_teacher_verified,
        "reason": reason,
    }


def list_reviews_for_moderation(status: str | None = None):
    from marketplace.models import TeacherReview, ReviewStatus
    qs = TeacherReview.objects.select_related("booking", "teacher", "learner").all()
    if status:
        qs = qs.filter(status=status)
    else:
        qs = qs.filter(status__in=[ReviewStatus.PENDING_MODERATION, ReviewStatus.FLAGGED])
    return list(qs.order_by("-created_at"))


def moderate_review(
    admin_user: User,
    review_id: str,
    action: str,
    admin_notes: str = "",
):
    from marketplace.models import TeacherReview, ReviewStatus

    if not (admin_user.is_staff or getattr(admin_user, "role", "") == User.Role.ADMINISTRATOR):
        raise PermissionDenied("فقط مدیران و ناظران مجاز به تایید یا حذف بازخوردها هستند.")

    try:
        review = TeacherReview.objects.get(id=review_id)
    except TeacherReview.DoesNotExist:
        raise ValidationError("بازخورد مورد نظر یافت نشد.")

    if action == "approve":
        review.status = ReviewStatus.PUBLISHED
    elif action == "remove":
        review.status = ReviewStatus.REMOVED
        if admin_notes:
            review.flag_reason = f"حذف توسط ناظر: {admin_notes.strip()}"
    else:
        raise ValidationError("عملیات نظارت نامعتبر است (مجاز: approve, remove).")

    review.save(update_fields=["status", "flag_reason", "updated_at"])
    return review


def get_active_pricing_plans():
    from marketplace.models import PlatformPricingPlan
    plans = list(PlatformPricingPlan.objects.filter(is_active=True).order_by("price_toman"))
    if not plans:
        # Seed initial launch plan from Day 06 baseline
        plan = PlatformPricingPlan.objects.create(
            code="launch_premium_90d",
            name_fa="اشتراک ۹۰ روزه پرمیوم (دوره راه‌اندازی)",
            name_en="90-Day Premium Launch Plan",
            duration_days=90,
            price_toman=Decimal("420000"),
            is_active=True,
            is_featured=True,
            features_fa=[
                "دسترسی نامحدود به دستیار نگارش هوشمند اندورا",
                "تمرین‌های روزانه تصحیح خودکار تلفظ و مکالمه هوش مصنوعی",
                "گزارش جامع ژنوم اشتباهات و تحلیل یادگیری",
                "تخفیف ویژه جلسات تدریس خصوصی در بازارگاه اساتید",
            ],
            note_fa="قیمت اولیه برای دوره راه‌اندازی است و از بخش مدیریت سیستم قابل تنظیم است.",
            note_en="This is the launch-plan display price, centrally managed through administrator configuration.",
        )
        plans = [plan]
    return plans


def update_pricing_plan(
    admin_user: User,
    plan_id: str,
    data: dict,
):
    from marketplace.models import PlatformPricingPlan

    if not (admin_user.is_staff or getattr(admin_user, "role", "") == User.Role.ADMINISTRATOR):
        raise PermissionDenied("فقط مدیران سیستم مجاز به تغییر پلن‌های قیمت‌گذاری هستند.")

    try:
        plan = PlatformPricingPlan.objects.get(id=plan_id)
    except PlatformPricingPlan.DoesNotExist:
        raise ValidationError("پلن قیمت‌گذاری یافت نشد.")

    if "price_toman" in data:
        plan.price_toman = Decimal(str(data["price_toman"]))
    if "is_active" in data:
        plan.is_active = bool(data["is_active"])
    if "is_featured" in data:
        plan.is_featured = bool(data["is_featured"])
    if "name_fa" in data:
        plan.name_fa = str(data["name_fa"])
    if "name_en" in data:
        plan.name_en = str(data["name_en"])
    if "duration_days" in data:
        plan.duration_days = int(data["duration_days"])

    plan.save()
    return plan

# ---------------------------------------------------------------------------
# Day 42: Payment Gateway Integration, User Wallet, & Escrow Services (MKT-008)
# ---------------------------------------------------------------------------

import re
import uuid
from django.conf import settings
from marketplace.models import (
    UserWallet,
    WalletTransactionType,
    WalletTransaction,
    PaymentGatewayProvider,
    PaymentTransactionStatus,
    PaymentOrderType,
    PaymentTransaction,
    EscrowStatus,
    BookingEscrow,
    TeacherPayoutStatus,
    TeacherPayoutRequest,
)
from marketplace.zarinpal import ZarinPalGateway, PaymentGatewayError, PaymentVerificationError, toman_to_rial, rial_to_toman


def get_or_create_wallet(user: User) -> UserWallet:
    """Retrieve or initialize a user's ledger wallet."""
    if not user.is_authenticated:
        raise PermissionDenied("کاربر وارد سیستم نشده است.")
    wallet, _ = UserWallet.objects.get_or_create(user=user)
    return wallet


def deposit_to_wallet(
    user: User,
    amount_toman: Decimal | int | float,
    reference_id: str = "",
    description: str = "",
) -> WalletTransaction:
    """Safely deposit funds to a user's wallet with an atomic transaction log."""
    amount = Decimal(str(amount_toman))
    if amount <= 0:
        raise ValidationError("مبلغ واریزی باید بزرگتر از صفر باشد.")

    with transaction.atomic():
        wallet = UserWallet.objects.select_for_update().get_or_create(user=user)[0]
        wallet.balance_toman += amount
        wallet.save(update_fields=["balance_toman", "updated_at"])

        tracking = f"TX-DEP-{uuid.uuid4().hex[:10].upper()}"
        tx = WalletTransaction.objects.create(
            wallet=wallet,
            transaction_type=WalletTransactionType.DEPOSIT,
            amount_toman=amount,
            balance_after_toman=wallet.balance_toman,
            tracking_code=tracking,
            reference_id=reference_id,
            description=description or "شارژ کیف پول",
        )
        return tx


def pay_from_wallet(
    user: User,
    amount_toman: Decimal | int | float,
    transaction_type: str = WalletTransactionType.BOOKING_PAYMENT,
    reference_id: str = "",
    description: str = "",
) -> WalletTransaction:
    """Deduct funds from user wallet if available balance suffices."""
    amount = Decimal(str(amount_toman))
    if amount <= 0:
        raise ValidationError("مبلغ کسر از کیف پول باید بزرگتر از صفر باشد.")

    with transaction.atomic():
        wallet = UserWallet.objects.select_for_update().get_or_create(user=user)[0]
        if not wallet.has_sufficient_balance(amount):
            raise ValidationError(
                f"موجودی قابل استفاده کیف پول ({wallet.available_balance_toman:,} تومان) برای این پرداخت ({amount:,} تومان) کافی نیست."
            )

        wallet.balance_toman -= amount
        wallet.save(update_fields=["balance_toman", "updated_at"])

        tracking = f"TX-PAY-{uuid.uuid4().hex[:10].upper()}"
        tx = WalletTransaction.objects.create(
            wallet=wallet,
            transaction_type=transaction_type,
            amount_toman=amount,
            balance_after_toman=wallet.balance_toman,
            tracking_code=tracking,
            reference_id=reference_id,
            description=description or "پرداخت از کیف پول",
        )
        return tx


def refund_to_wallet(
    user: User,
    amount_toman: Decimal | int | float,
    reference_id: str = "",
    description: str = "",
) -> WalletTransaction:
    """Refund funds back into user's wallet with ledger entry."""
    amount = Decimal(str(amount_toman))
    if amount <= 0:
        raise ValidationError("مبلغ استرداد باید بزرگتر از صفر باشد.")

    with transaction.atomic():
        wallet = UserWallet.objects.select_for_update().get_or_create(user=user)[0]
        wallet.balance_toman += amount
        wallet.save(update_fields=["balance_toman", "updated_at"])

        tracking = f"TX-REF-{uuid.uuid4().hex[:10].upper()}"
        tx = WalletTransaction.objects.create(
            wallet=wallet,
            transaction_type=WalletTransactionType.REFUND,
            amount_toman=amount,
            balance_after_toman=wallet.balance_toman,
            tracking_code=tracking,
            reference_id=reference_id,
            description=description or "استرداد وجه به کیف پول",
        )
        return tx


def create_booking_escrow(
    booking: SessionBooking,
    commission_rate: Optional[Decimal] = None,
) -> BookingEscrow:
    """Create or return an active escrow hold for a paid booking session."""
    existing = BookingEscrow.objects.filter(booking=booking).first()
    if existing:
        return existing

    rate = commission_rate or getattr(settings, "MARKETPLACE_COMMISSION_RATE", Decimal("0.15"))
    total_amount = booking.rate_toman
    commission = (total_amount * rate).quantize(Decimal("1"))
    teacher_net = total_amount - commission

    escrow = BookingEscrow.objects.create(
        booking=booking,
        total_amount_toman=total_amount,
        platform_commission_rate=rate,
        platform_commission_toman=commission,
        teacher_net_toman=teacher_net,
        status=EscrowStatus.HELD,
    )
    return escrow


def release_booking_escrow(booking: SessionBooking, notes: str = "") -> BookingEscrow:
    """Release held escrow funds to the teacher's wallet upon verified completion."""
    with transaction.atomic():
        escrow = BookingEscrow.objects.select_for_update().filter(booking=booking).first()
        if not escrow:
            raise ValidationError("حساب امانی برای این جلسه یافت نشد.")
        if escrow.status != EscrowStatus.HELD:
            return escrow

        # Credit teacher's wallet with net earnings
        teacher_wallet = UserWallet.objects.select_for_update().get_or_create(user=booking.teacher)[0]
        teacher_wallet.balance_toman += escrow.teacher_net_toman
        teacher_wallet.save(update_fields=["balance_toman", "updated_at"])

        WalletTransaction.objects.create(
            wallet=teacher_wallet,
            transaction_type=WalletTransactionType.ESCROW_RELEASE,
            amount_toman=escrow.teacher_net_toman,
            balance_after_toman=teacher_wallet.balance_toman,
            tracking_code=f"TX-ESC-{uuid.uuid4().hex[:10].upper()}",
            reference_id=str(booking.id),
            description=f"تسویه حق‌التدریس جلسه {booking.target_skill} (کد رزرو {booking.id})",
        )

        escrow.status = EscrowStatus.RELEASED_TO_TEACHER
        escrow.settled_at = timezone.now()
        escrow.settlement_notes = notes or "تسویه موفق با مدرس پس از پایان جلسه"
        escrow.save()
        return escrow


def refund_booking_escrow(
    booking: SessionBooking,
    refund_percentage: int = 100,
    reason: str = "",
) -> BookingEscrow:
    """Refund held escrow funds to the learner (full or prorated) on cancellation/dispute."""
    with transaction.atomic():
        escrow = BookingEscrow.objects.select_for_update().filter(booking=booking).first()
        if not escrow:
            raise ValidationError("حساب امانی برای این جلسه یافت نشد.")
        if escrow.status in [EscrowStatus.REFUNDED_TO_LEARNER, EscrowStatus.PARTIALLY_SETTLED]:
            return escrow

        total = escrow.total_amount_toman
        refund_amount = (total * Decimal(str(refund_percentage)) / Decimal("100")).quantize(Decimal("1"))
        teacher_amount = total - refund_amount

        if refund_percentage == 100:
            escrow.status = EscrowStatus.REFUNDED_TO_LEARNER
            escrow.refund_amount_toman = refund_amount
            if refund_amount > 0:
                refund_to_wallet(
                    user=booking.learner,
                    amount_toman=refund_amount,
                    reference_id=str(booking.id),
                    description=f"استرداد ۱۰۰٪ هزینه رزرو جلسه {booking.id} ({reason})",
                )
        else:
            escrow.status = EscrowStatus.PARTIALLY_SETTLED
            escrow.refund_amount_toman = refund_amount
            if refund_amount > 0:
                refund_to_wallet(
                    user=booking.learner,
                    amount_toman=refund_amount,
                    reference_id=str(booking.id),
                    description=f"استرداد {refund_percentage}٪ هزینه رزرو جلسه با رأی داوری",
                )
            if teacher_amount > 0:
                teacher_commission = (teacher_amount * escrow.platform_commission_rate).quantize(Decimal("1"))
                teacher_net = teacher_amount - teacher_commission
                teacher_wallet = UserWallet.objects.select_for_update().get_or_create(user=booking.teacher)[0]
                teacher_wallet.balance_toman += teacher_net
                teacher_wallet.save(update_fields=["balance_toman", "updated_at"])

                WalletTransaction.objects.create(
                    wallet=teacher_wallet,
                    transaction_type=WalletTransactionType.ESCROW_RELEASE,
                    amount_toman=teacher_net,
                    balance_after_toman=teacher_wallet.balance_toman,
                    tracking_code=f"TX-ESC-{uuid.uuid4().hex[:10].upper()}",
                    reference_id=str(booking.id),
                    description=f"تسویه سهم داوری از جلسه ({100 - refund_percentage}٪)",
                )

        escrow.settled_at = timezone.now()
        escrow.settlement_notes = reason
        escrow.save()
        return escrow


def initiate_checkout(
    user: User,
    order_type: str,
    order_id: Optional[str] = None,
    amount_toman: Optional[Decimal | int | float] = None,
    gateway_provider: str = PaymentGatewayProvider.ZARINPAL,
    callback_url: str = "",
    idempotency_key: Optional[str] = None,
) -> dict:
    """
    Initialize checkout payment process via ZarinPal, Sandbox, or Internal Wallet.
    """
    from marketplace.models import PlatformPricingPlan

    if not user.is_authenticated:
        raise PermissionDenied("کاربر وارد سیستم نشده است.")

    booking = None
    plan = None
    amount = Decimal("0")
    description = ""

    if order_type == PaymentOrderType.BOOKING_SESSION:
        if not order_id:
            raise ValidationError("شناسه جلسه برای پرداخت الزامی است.")
        try:
            booking = SessionBooking.objects.get(id=order_id)
        except SessionBooking.DoesNotExist:
            raise ValidationError("جلسه مورد نظر یافت نشد.")
        if booking.learner_id != user.id:
            raise PermissionDenied("فقط رزروکننده جلسه می‌تواند هزینه آن را پرداخت کند.")
        if booking.is_paid:
            raise ValidationError("هزینه این جلسه قبلاً پرداخت شده است.")
        amount = booking.rate_toman
        description = f"رزرو جلسه آموزشی اندورا: {booking.get_target_skill_display()} با استاد {booking.teacher.get_full_name() or booking.teacher.email}"

    elif order_type == PaymentOrderType.SUBSCRIPTION_PLAN:
        if not order_id:
            raise ValidationError("شناسه پلن اشتراک الزامی است.")
        try:
            plan = PlatformPricingPlan.objects.get(id=order_id, is_active=True)
        except PlatformPricingPlan.DoesNotExist:
            raise ValidationError("پلن اشتراک انتخابی معتبر نیست.")
        amount = plan.price_toman
        description = f"خرید {plan.name_fa} در اندورا"

    elif order_type == PaymentOrderType.WALLET_TOPUP:
        if not amount_toman or Decimal(str(amount_toman)) < 10000:
            raise ValidationError("حداقل مبلغ شارژ کیف پول ۱۰,۰۰۰ تومان است.")
        amount = Decimal(str(amount_toman))
        description = f"شارژ حساب کیف پول کاربر {user.email} در اندورا"
    else:
        raise ValidationError("نوع سفارش نامعتبر است.")

    idem_key = idempotency_key or f"idem_{user.id}_{order_type}_{order_id or 'topup'}_{int(timezone.now().timestamp())}"

    # Wallet 1-Click Pay
    if gateway_provider == PaymentGatewayProvider.WALLET:
        with transaction.atomic():
            wallet_tx = pay_from_wallet(
                user=user,
                amount_toman=amount,
                transaction_type=WalletTransactionType.BOOKING_PAYMENT if order_type == PaymentOrderType.BOOKING_SESSION else WalletTransactionType.SUBSCRIPTION_PAYMENT,
                reference_id=str(order_id or ""),
                description=description,
            )

            tx = PaymentTransaction.objects.create(
                user=user,
                order_type=order_type,
                booking=booking,
                plan=plan,
                gateway_provider=PaymentGatewayProvider.WALLET,
                amount_toman=amount,
                amount_rial=toman_to_rial(amount),
                status=PaymentTransactionStatus.PAID,
                ref_id=wallet_tx.tracking_code,
                idempotency_key=idem_key,
                description=description,
                is_sandbox=False,
                verified_at=timezone.now(),
            )

            # Apply order fulfillment
            if order_type == PaymentOrderType.BOOKING_SESSION and booking:
                booking.is_paid = True
                if booking.status == BookingStatus.PENDING_PAYMENT:
                    booking.status = BookingStatus.CONFIRMED
                booking.save(update_fields=["is_paid", "status", "updated_at"])
                create_booking_escrow(booking)

            return {
                "transaction_id": str(tx.id),
                "order_type": order_type,
                "amount_toman": int(amount),
                "amount_rial": toman_to_rial(amount),
                "status": tx.status,
                "paid_via_wallet": True,
                "tracking_code": wallet_tx.tracking_code,
                "payment_url": "",
            }

    # Gateway Payment (ZarinPal or Sandbox)
    is_sandbox = (gateway_provider == PaymentGatewayProvider.SANDBOX) or getattr(settings, "ZARINPAL_SANDBOX", True)
    client = ZarinPalGateway(is_sandbox=is_sandbox)
    amount_rial = toman_to_rial(amount)
    cb_url = callback_url or "/checkout/callback"

    gateway_res = client.request_payment(
        amount_rial=amount_rial,
        description=description,
        callback_url=cb_url,
        metadata={"email": user.email, "mobile": getattr(user, "mobile", "")},
    )

    authority = gateway_res["authority"]
    payment_url = gateway_res["payment_url"]

    tx = PaymentTransaction.objects.create(
        user=user,
        order_type=order_type,
        booking=booking,
        plan=plan,
        gateway_provider=gateway_provider,
        amount_toman=amount,
        amount_rial=amount_rial,
        authority=authority,
        status=PaymentTransactionStatus.PENDING,
        idempotency_key=idem_key,
        description=description,
        gateway_callback_url=cb_url,
        is_sandbox=is_sandbox,
    )

    return {
        "transaction_id": str(tx.id),
        "authority": authority,
        "payment_url": payment_url,
        "amount_toman": int(amount),
        "amount_rial": amount_rial,
        "status": tx.status,
        "is_sandbox": is_sandbox,
        "paid_via_wallet": False,
    }


def verify_checkout_payment(authority: str, status_param: str = "OK") -> dict:
    """
    Verify payment authority against ZarinPal/Sandbox gateway and trigger order fulfillment.
    """
    if not authority:
        raise ValidationError("شناسه پرداخت Authority الزامی است.")

    with transaction.atomic():
        try:
            tx = PaymentTransaction.objects.select_for_update().get(authority=authority)
        except PaymentTransaction.DoesNotExist:
            raise ValidationError("تراکنش مربوط به این شناسه پرداخت یافت نشد.")

        # Idempotent response if already verified
        if tx.status == PaymentTransactionStatus.PAID:
            return {
                "transaction_id": str(tx.id),
                "status": tx.status,
                "ref_id": tx.ref_id,
                "card_pan": tx.card_pan,
                "amount_toman": int(tx.amount_toman),
                "order_type": tx.order_type,
                "booking_id": str(tx.booking_id) if tx.booking_id else None,
                "already_verified": True,
            }

        # Check if user cancelled in gateway
        if status_param.upper() != "OK":
            tx.status = PaymentTransactionStatus.FAILED
            tx.save(update_fields=["status", "updated_at"])
            return {
                "transaction_id": str(tx.id),
                "status": tx.status,
                "error": "پرداخت توسط کاربر لغو شد یا انجام نشد.",
                "amount_toman": int(tx.amount_toman),
                "order_type": tx.order_type,
                "booking_id": str(tx.booking_id) if tx.booking_id else None,
            }

        client = ZarinPalGateway(is_sandbox=tx.is_sandbox)
        verify_res = client.verify_payment(
            amount_rial=tx.amount_rial,
            authority=authority,
        )

        ref_id = verify_res.get("ref_id", "")
        card_pan = verify_res.get("card_pan", "")

        tx.status = PaymentTransactionStatus.PAID
        tx.ref_id = ref_id
        tx.card_pan = card_pan
        tx.verified_at = timezone.now()
        tx.save(update_fields=["status", "ref_id", "card_pan", "verified_at", "updated_at"])

        # Fulfillment
        if tx.order_type == PaymentOrderType.BOOKING_SESSION and tx.booking:
            booking = tx.booking
            booking.is_paid = True
            if booking.status == BookingStatus.PENDING_PAYMENT:
                booking.status = BookingStatus.CONFIRMED
            booking.save(update_fields=["is_paid", "status", "updated_at"])
            create_booking_escrow(booking)

        elif tx.order_type == PaymentOrderType.WALLET_TOPUP:
            deposit_to_wallet(
                user=tx.user,
                amount_toman=tx.amount_toman,
                reference_id=ref_id,
                description=f"شارژ آنلاین حساب کاربری با تراکنش شماره {ref_id}",
            )

        return {
            "transaction_id": str(tx.id),
            "status": tx.status,
            "ref_id": ref_id,
            "card_pan": card_pan,
            "amount_toman": int(tx.amount_toman),
            "order_type": tx.order_type,
            "booking_id": str(tx.booking_id) if tx.booking_id else None,
            "already_verified": False,
        }


def get_teacher_earnings_summary(teacher: User) -> dict:
    """
    Calculate comprehensive earnings summary for a teacher including wallet balance,
    held escrow, settled sessions, and payout pipeline.
    """
    if teacher.role != User.Role.TEACHER:
        raise PermissionDenied("فقط مدرسان می‌توانند گزارش درآمدهای تدریس را مشاهده کنند.")

    wallet = get_or_create_wallet(teacher)

    # Escrow totals
    held_escrows = BookingEscrow.objects.filter(
        booking__teacher=teacher,
        status=EscrowStatus.HELD,
    )
    held_toman = sum((e.teacher_net_toman for e in held_escrows), Decimal("0"))

    settled_escrows = BookingEscrow.objects.filter(
        booking__teacher=teacher,
        status__in=[EscrowStatus.RELEASED_TO_TEACHER, EscrowStatus.PARTIALLY_SETTLED],
    )
    settled_gross_toman = sum((e.total_amount_toman for e in settled_escrows), Decimal("0"))
    settled_net_toman = sum((e.teacher_net_toman for e in settled_escrows), Decimal("0"))
    platform_fee_toman = sum((e.platform_commission_toman for e in settled_escrows), Decimal("0"))

    # Payout requests
    payout_qs = TeacherPayoutRequest.objects.filter(teacher=teacher)
    paid_payouts_toman = sum(
        (p.amount_toman for p in payout_qs.filter(status=TeacherPayoutStatus.PAID)),
        Decimal("0"),
    )
    pending_payouts_toman = sum(
        (p.amount_toman for p in payout_qs.filter(status__in=[TeacherPayoutStatus.PENDING, TeacherPayoutStatus.APPROVED])),
        Decimal("0"),
    )

    completed_session_count = SessionBooking.objects.filter(
        teacher=teacher,
        status=BookingStatus.COMPLETED,
    ).count()

    return {
        "wallet_balance_toman": int(wallet.balance_toman),
        "available_to_withdraw_toman": int(wallet.available_balance_toman),
        "held_in_escrow_toman": int(held_toman),
        "settled_net_toman": int(settled_net_toman),
        "settled_gross_toman": int(settled_gross_toman),
        "platform_fee_toman": int(platform_fee_toman),
        "paid_payouts_toman": int(paid_payouts_toman),
        "pending_payouts_toman": int(pending_payouts_toman),
        "completed_session_count": completed_session_count,
    }


def request_teacher_payout(
    teacher: User,
    amount_toman: Decimal | int | float,
    bank_shaba_number: str,
    account_holder_name: str = "",
    bank_name: str = "",
) -> TeacherPayoutRequest:
    """Submit a payout request to bank account with Sheba validation and atomic balance hold."""
    if teacher.role != User.Role.TEACHER:
        raise PermissionDenied("فقط مدرسان مجاز به ثبت درخواست تسویه مالی هستند.")

    amount = Decimal(str(amount_toman))
    if amount < 50000:
        raise ValidationError("حداقل مبلغ قابل تسویه ۵۰,۰۰۰ تومان است.")

    # Clean and validate Iranian Sheba
    shaba_clean = bank_shaba_number.strip().upper().replace(" ", "")
    if not re.match(r"^IR\d{24}$", shaba_clean):
        raise ValidationError("شماره شبا بانکی نامعتبر است. فرمت صحیح: IR به همراه ۲۴ رقم بدون فاصله.")

    with transaction.atomic():
        wallet = UserWallet.objects.select_for_update().get_or_create(user=teacher)[0]
        if not wallet.has_sufficient_balance(amount):
            raise ValidationError(
                f"موجودی قابل برداشت کیف پول ({wallet.available_balance_toman:,} تومان) کمتر از مبلغ درخواستی ({amount:,} تومان) است."
            )

        # Deduct from wallet immediately to prevent double spending
        wallet.balance_toman -= amount
        wallet.save(update_fields=["balance_toman", "updated_at"])

        tx = WalletTransaction.objects.create(
            wallet=wallet,
            transaction_type=WalletTransactionType.PAYOUT,
            amount_toman=amount,
            balance_after_toman=wallet.balance_toman,
            tracking_code=f"TX-OUT-{uuid.uuid4().hex[:10].upper()}",
            description=f"درخواست تسویه بانکی به شماره شبا {shaba_clean}",
        )

        payout = TeacherPayoutRequest.objects.create(
            teacher=teacher,
            amount_toman=amount,
            bank_shaba_number=shaba_clean,
            account_holder_name=account_holder_name.strip() or teacher.get_full_name() or teacher.email,
            bank_name=bank_name.strip(),
            status=TeacherPayoutStatus.PENDING,
            admin_notes=f"تراکنش کسر از کیف پول: {tx.tracking_code}",
        )
        return payout


def process_teacher_payout_request(
    admin_user: User,
    payout_id: str,
    action: str,
    admin_notes: str = "",
    rejection_reason: str = "",
) -> TeacherPayoutRequest:
    """Process or reject teacher payout request by financial administrator."""
    if not (admin_user.is_staff or getattr(admin_user, "role", "") == User.Role.ADMINISTRATOR):
        raise PermissionDenied("فقط مدیران و کارشناسان مالی مجاز به بررسی درخواست‌های تسویه هستند.")

    with transaction.atomic():
        try:
            payout = TeacherPayoutRequest.objects.select_for_update().get(id=payout_id)
        except TeacherPayoutRequest.DoesNotExist:
            raise ValidationError("درخواست تسویه یافت نشد.")

        if payout.status in [TeacherPayoutStatus.PAID, TeacherPayoutStatus.REJECTED]:
            raise ValidationError("این درخواست قبلاً نهایی شده و قابل تغییر نیست.")

        action_clean = action.strip().lower()
        if action_clean == "approve":
            payout.status = TeacherPayoutStatus.APPROVED
            if admin_notes:
                payout.admin_notes = admin_notes
        elif action_clean == "pay":
            payout.status = TeacherPayoutStatus.PAID
            payout.processed_by = admin_user
            payout.processed_at = timezone.now()
            if admin_notes:
                payout.admin_notes = admin_notes
        elif action_clean == "reject":
            if not rejection_reason or len(rejection_reason.strip()) < 5:
                raise ValidationError("ثبت علت رد درخواست تسویه الزامی است.")
            payout.status = TeacherPayoutStatus.REJECTED
            payout.rejection_reason = rejection_reason.strip()
            payout.processed_by = admin_user
            payout.processed_at = timezone.now()

            # Refund held amount back to teacher's wallet
            refund_to_wallet(
                user=payout.teacher,
                amount_toman=payout.amount_toman,
                reference_id=str(payout.id),
                description=f"استرداد مبلغ تسویه رد شده: {rejection_reason}",
            )
        else:
            raise ValidationError("عملیات نامعتبر است (گزینه‌ها: approve, pay, reject).")

        payout.save()
        return payout


from datetime import timedelta
from decimal import Decimal
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
    return booking

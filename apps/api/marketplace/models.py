import uuid
from decimal import Decimal
from django.conf import settings
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class RequestSkill(models.TextChoices):
    SPEAKING = "speaking", _("اسپیکینگ و مکالمه")
    WRITING = "writing", _("رایتینگ و تصحیح انشاء")
    GRAMMAR = "grammar", _("گرامر تحلیلی و کاربردی")
    VOCABULARY = "vocabulary", _("واژگان و اصطلاحات")
    IELTS_PREP = "ielts_prep", _("آمادگی مهارت‌های آیلتس")
    PRONUNCIATION = "pronunciation", _("تلفظ و لهجه")
    GENERAL_ENGLISH = "general_english", _("انگلیسی عمومی و روزمره")


class CEFRLevel(models.TextChoices):
    A1 = "A1", "A1 - Elementary"
    A2 = "A2", "A2 - Pre-Intermediate"
    B1 = "B1", "B1 - Intermediate"
    B2 = "B2", "B2 - Upper-Intermediate"
    C1 = "C1", "C1 - Advanced"
    C2 = "C2", "C2 - Proficiency"
    UNSPECIFIED = "unspecified", "نامشخص / تعیین‌نشده"


class SessionFormat(models.TextChoices):
    VIDEO = "video", _("تماس تصویری")
    AUDIO = "audio", _("تماس صوتی")
    ASYNC_REVIEW = "async_review", _("بررسی و تصحیح آفلاین")
    TEXT_CHAT = "text_chat", _("گفتگوی متنی متمرکز")


class PreferredTimeWindow(models.TextChoices):
    TODAY_AFTERNOON = "today_afternoon", _("امروز بعدازظهر (۱۴ تا ۱۸)")
    TODAY_EVENING = "today_evening", _("امروز عصر و شب (۱۸ تا ۲۲)")
    TOMORROW_MORNING = "tomorrow_morning", _("فردا صبح (۹ تا ۱۳)")
    TOMORROW_AFTERNOON = "tomorrow_afternoon", _("فردا بعدازظهر (۱۴ تا ۱۸)")
    TOMORROW_EVENING = "tomorrow_evening", _("فردا عصر و شب (۱۸ تا ۲۲)")
    FLEXIBLE = "flexible", _("منعطف / هماهنگی با مدرس")


class RequestStatus(models.TextChoices):
    OPEN = "open", _("در انتظار دریافت پیشنهاد")
    MATCHED = "matched", _("دارای پیشنهادهای تطبیق‌یافته")
    BOOKED = "booked", _("رزرو قطعی شد")
    EXPIRED = "expired", _("منقضی شده")
    CANCELLED = "cancelled", _("لغو شده")


class OfferStatus(models.TextChoices):
    PENDING = "pending", _("در انتظار تصمیم زبان‌آموز")
    ACCEPTED = "accepted", _("پذیرفته شده")
    DECLINED = "declined", _("رد شده")
    WITHDRAWN = "withdrawn", _("پس‌گرفته شده توسط مدرس")
    EXPIRED = "expired", _("منقضی شده")


class BookingStatus(models.TextChoices):
    CONFIRMED = "confirmed", _("رزرو شده و قطعی")
    RESCHEDULE_REQUESTED = "reschedule_requested", _("درخواست جابجایی زمان")
    IN_PROGRESS = "in_progress", _("در حال برگزاری")
    COMPLETED = "completed", _("پایان یافته")
    CANCELLED_BY_LEARNER = "cancelled_by_learner", _("لغو توسط زبان‌آموز")
    CANCELLED_BY_TEACHER = "cancelled_by_teacher", _("لغو توسط مدرس")
    NO_SHOW = "no_show", _("عدم حضور در جلسه")
    NO_SHOW_LEARNER = "no_show_learner", _("عدم حضور زبان‌آموز")
    NO_SHOW_TEACHER = "no_show_teacher", _("عدم حضور مدرس")
    DISPUTED = "disputed", _("مورد اختلاف")


class MarketplaceRequest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="marketplace_requests",
    )
    preferred_teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="preferred_marketplace_requests",
    )
    target_skill = models.CharField(
        max_length=32,
        choices=RequestSkill.choices,
        default=RequestSkill.SPEAKING,
        db_index=True,
    )
    target_subskill = models.CharField(max_length=128, blank=True, default="")
    target_cefr_level = models.CharField(
        max_length=16,
        choices=CEFRLevel.choices,
        default=CEFRLevel.UNSPECIFIED,
        db_index=True,
    )
    short_description = models.TextField(help_text="توضیح هدف یا سوال یادگیری زبان‌آموز")
    preferred_time_window = models.CharField(
        max_length=32,
        choices=PreferredTimeWindow.choices,
        default=PreferredTimeWindow.FLEXIBLE,
    )
    duration_minutes = models.PositiveSmallIntegerField(
        default=45,
        choices=[(30, "30 دقیقه"), (45, "45 دقیقه"), (60, "60 دقیقه")],
    )
    online_format = models.CharField(
        max_length=24,
        choices=SessionFormat.choices,
        default=SessionFormat.VIDEO,
    )
    budget_max_toman = models.DecimalField(
        max_digits=10,
        decimal_places=0,
        null=True,
        blank=True,
        help_text="حداکثر بودجه پیشنهادی زبان‌آموز به تومان",
    )
    status = models.CharField(
        max_length=16,
        choices=RequestStatus.choices,
        default=RequestStatus.OPEN,
        db_index=True,
    )
    matched_offer = models.ForeignKey(
        "TeacherOffer",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="accepted_for_request",
    )
    expires_at = models.DateTimeField(db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status", "-created_at"]),
            models.Index(fields=["target_skill", "status"]),
        ]

    def __str__(self):
        return f"Request {self.id} ({self.target_skill} - {self.status})"

    def is_active(self) -> bool:
        if self.status in [RequestStatus.OPEN, RequestStatus.MATCHED]:
            return timezone.now() < self.expires_at
        return False


class TeacherOffer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request = models.ForeignKey(
        MarketplaceRequest,
        on_delete=models.CASCADE,
        related_name="offers",
    )
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="marketplace_offers",
    )
    rate_toman = models.DecimalField(
        max_digits=10,
        decimal_places=0,
        help_text="مبلغ پیشنهادی مدرس به تومان",
    )
    proposed_start_time = models.DateTimeField(null=True, blank=True)
    duration_minutes = models.PositiveSmallIntegerField(default=45)
    online_format = models.CharField(
        max_length=24,
        choices=SessionFormat.choices,
        default=SessionFormat.VIDEO,
    )
    intro_note = models.TextField(
        help_text="پیام اختصاصی مدرس، راهکار تدریس و شیوه برگزاری",
        blank=True,
        default="",
    )
    status = models.CharField(
        max_length=16,
        choices=OfferStatus.choices,
        default=OfferStatus.PENDING,
        db_index=True,
    )
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["request", "teacher"],
                condition=models.Q(status=OfferStatus.PENDING),
                name="unique_pending_offer_per_teacher_request",
            ),
        ]
        indexes = [
            models.Index(fields=["request", "status"]),
            models.Index(fields=["teacher", "status"]),
        ]

    def __str__(self):
        return f"Offer {self.id} by {self.teacher_id} for {self.request_id} ({self.status})"


class SessionBooking(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request = models.ForeignKey(
        MarketplaceRequest,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="bookings",
    )
    offer = models.ForeignKey(
        TeacherOffer,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="bookings",
    )
    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="learner_bookings",
    )
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="teacher_bookings",
    )
    target_skill = models.CharField(
        max_length=32,
        choices=RequestSkill.choices,
        default=RequestSkill.SPEAKING,
    )
    target_subskill = models.CharField(max_length=128, blank=True, default="")
    duration_minutes = models.PositiveSmallIntegerField(
        default=45,
        choices=[(30, "30 دقیقه"), (45, "45 دقیقه"), (60, "60 دقیقه")],
    )
    online_format = models.CharField(
        max_length=24,
        choices=SessionFormat.choices,
        default=SessionFormat.VIDEO,
    )
    scheduled_start = models.DateTimeField(db_index=True)
    scheduled_end = models.DateTimeField(db_index=True)
    timezone_name = models.CharField(max_length=64, default="Asia/Tehran")
    rate_toman = models.DecimalField(
        max_digits=10,
        decimal_places=0,
        help_text="مبلغ قطعی رزرو به تومان",
    )
    status = models.CharField(
        max_length=32,
        choices=BookingStatus.choices,
        default=BookingStatus.CONFIRMED,
        db_index=True,
    )
    idempotency_key = models.CharField(
        max_length=128,
        unique=True,
        null=True,
        blank=True,
        db_index=True,
        help_text="کلید یکتایی برای جلوگیری از ثبت تکراری (unique_booking_idempotency)",
    )
    meeting_url = models.CharField(max_length=512, blank=True, default="")

    @property
    def meeting_room_url(self) -> str:
        return self.meeting_url

    @property
    def reschedule_proposed_by(self):
        return self.reschedule_requested_by
    session_notes = models.TextField(blank=True, default="", help_text="خلاصه جلسه و یادداشت‌های آموزشی")
    cancellation_reason = models.TextField(blank=True, default="")

    # Rescheduling negotiation fields
    reschedule_proposed_start = models.DateTimeField(null=True, blank=True)
    reschedule_proposed_end = models.DateTimeField(null=True, blank=True)
    reschedule_requested_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="requested_reschedules",
    )
    reschedule_note = models.TextField(blank=True, default="")

    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-scheduled_start"]
        indexes = [
            models.Index(fields=["status", "scheduled_start"]),
            models.Index(fields=["learner", "status"]),
            models.Index(fields=["teacher", "status"]),
            models.Index(fields=["scheduled_start", "scheduled_end"]),
        ]

    def __str__(self):
        return f"Booking {self.id}: {self.learner.email} with {self.teacher.email} [{self.status}]"

    def is_in_session_window(self) -> bool:
        now = timezone.now()
        # Active window: from 15 minutes before scheduled start until scheduled end + 30 mins
        start_buffer = self.scheduled_start - timezone.timedelta(minutes=15)
        end_buffer = self.scheduled_end + timezone.timedelta(minutes=30)
        return start_buffer <= now <= end_buffer


class ReviewStatus(models.TextChoices):
    PUBLISHED = "published", _("منتشر شده")
    PENDING_MODERATION = "pending_moderation", _("در انتظار بررسی ناظر")
    FLAGGED = "flagged", _("گزارش شده")
    REMOVED = "removed", _("حذف شده")


class TeacherReview(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.OneToOneField(
        "marketplace.SessionBooking",
        on_delete=models.CASCADE,
        related_name="review",
        help_text="جلسه تکمیل‌شده متناظر با این نظر",
    )
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="received_reviews",
    )
    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="submitted_reviews",
    )
    overall_rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="امتیاز کلی از ۱ تا ۵",
    )
    rating_teaching = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        default=5,
        help_text="کیفیت تدریس و تسلط",
    )
    rating_punctuality = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        default=5,
        help_text="نظم و وقت‌شناسی",
    )
    rating_communication = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        default=5,
        help_text="فن بیان، صبوری و اخلاق حرفه‌ای",
    )
    comment = models.TextField(
        help_text="متن بازخورد و تجربه زبان‌آموز",
    )
    is_anonymous = models.BooleanField(
        default=False,
        help_text="نمایش نام زبان‌آموز به صورت مخفی/ناشناس",
    )
    masked_display_name = models.CharField(
        max_length=64,
        blank=True,
        default="",
        help_text="نام نمایشی ماسک‌شده (مثلاً سارا م.)",
    )
    status = models.CharField(
        max_length=24,
        choices=ReviewStatus.choices,
        default=ReviewStatus.PUBLISHED,
        db_index=True,
    )
    teacher_reply = models.TextField(
        blank=True,
        default="",
        help_text="پاسخ رسمی مدرس به این بازخورد",
    )
    teacher_replied_at = models.DateTimeField(null=True, blank=True)
    flag_reason = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["teacher", "status", "-created_at"]),
            models.Index(fields=["learner", "status"]),
        ]

    def __str__(self):
        return f"Review {self.id} for {self.teacher.email} by {self.learner.email} ({self.overall_rating}★)"


# ---------------------------------------------------------------------------
# Day 40: Teacher Availability Calendar, Recurring Slots & Time-Off Management
# ---------------------------------------------------------------------------

class DayOfWeek(models.IntegerChoices):
    SATURDAY = 0, _("شنبه")
    SUNDAY = 1, _("یک‌شنبه")
    MONDAY = 2, _("دوشنبه")
    TUESDAY = 3, _("سه‌شنبه")
    WEDNESDAY = 4, _("چهارشنبه")
    THURSDAY = 5, _("پنج‌شنبه")
    FRIDAY = 6, _("جمعه")


class TeacherAvailabilitySlot(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="availability_slots",
    )
    day_of_week = models.PositiveSmallIntegerField(
        choices=DayOfWeek.choices,
        help_text="روز هفته (شنبه=۰ تا جمعه=۶)",
    )
    start_time = models.TimeField(
        help_text="زمان آغاز دسترسی (ساعت و دقیقه به وقت تهران)",
    )
    end_time = models.TimeField(
        help_text="زمان پایان دسترسی (ساعت و دقیقه به وقت تهران)",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="فعال یا غیرفعال بودن این بازه زمانی",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["day_of_week", "start_time"]
        indexes = [
            models.Index(fields=["teacher", "day_of_week", "is_active"]),
        ]
        constraints = [
            models.CheckConstraint(
                check=models.Q(start_time__lt=models.F("end_time")),
                name="valid_availability_time_window",
            ),
        ]

    def __str__(self):
        return f"{self.teacher.email} - {self.get_day_of_week_display()}: {self.start_time.strftime('%H:%M')} to {self.end_time.strftime('%H:%M')}"


class TeacherTimeOff(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="time_off_periods",
    )
    start_datetime = models.DateTimeField(
        help_text="زمان آغاز مرخصی یا بلاک بودن (UTC)",
    )
    end_datetime = models.DateTimeField(
        help_text="زمان پایان مرخصی یا بلاک بودن (UTC)",
    )
    reason = models.CharField(
        max_length=255,
        blank=True,
        default="",
        help_text="علت مرخصی (سفر، امتحانات، تعطیلات رسمی و...)",
    )
    is_full_day = models.BooleanField(
        default=False,
        help_text="آیا مرخصی به صورت تمام‌روز است؟",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["start_datetime"]
        indexes = [
            models.Index(fields=["teacher", "start_datetime", "end_datetime"]),
        ]
        constraints = [
            models.CheckConstraint(
                check=models.Q(start_datetime__lt=models.F("end_datetime")),
                name="valid_time_off_window",
            ),
        ]

    def __str__(self):
        return f"Time-off {self.teacher.email}: {self.start_datetime} to {self.end_datetime} ({self.reason})"


class TeacherAvailabilitySetting(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="availability_settings",
    )
    notice_lead_time_hours = models.PositiveSmallIntegerField(
        default=12,
        help_text="حداقل فاصله زمانی قبل از جلسه برای رزرو شدن به ساعت (پیش‌فرض ۱۲ ساعت)",
    )
    max_booking_ahead_days = models.PositiveSmallIntegerField(
        default=14,
        help_text="حداکثر بازه زمانی مجاز برای رزرو از قبل به روز (پیش‌فرض ۱۴ روز)",
    )
    default_session_duration_minutes = models.PositiveSmallIntegerField(
        default=45,
        help_text="مدت پیش‌فرض هر جلسه به دقیقه (۳۰، ۴۵، ۶۰ یا ۹۰)",
    )
    default_buffer_minutes = models.PositiveSmallIntegerField(
        default=15,
        help_text="فاصله استراحت پیش‌فرض بین دو جلسه به دقیقه (۰، ۱۰، ۱۵ یا ۳۰)",
    )
    auto_accept_bookings = models.BooleanField(
        default=True,
        help_text="تأیید خودکار رزروهای منطبق با زمان‌های باز",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Settings for {self.teacher.email} (Notice: {self.notice_lead_time_hours}h, Ahead: {self.max_booking_ahead_days}d)"

# ---------------------------------------------------------------------------
# Day 41: Marketplace Admin Moderation, Teacher Onboarding & Dispute Resolution
# ---------------------------------------------------------------------------

class DisputeReasonCategory(models.TextChoices):
    TEACHER_ABSENT = "teacher_absent", _("عدم حضور مدرس / غیبت")
    LEARNER_ABSENT = "learner_absent", _("عدم حضور زبان‌آموز")
    TECHNICAL_DIFFICULTIES = "technical_difficulties", _("مشکل فنی یا قطعی سیستم/اینترنت")
    POOR_QUALITY = "poor_quality", _("کیفیت نامطلوب جلسه / عدم تطابق با تخصص")
    UNPROFESSIONAL_BEHAVIOR = "unprofessional_behavior", _("رفتار نامناسب یا نقض قوانین")
    PAYMENT_DISAGREEMENT = "payment_disagreement", _("اختلاف مالی یا محاسباتی")
    OTHER = "other", _("سایر موارد")


class DisputeStatus(models.TextChoices):
    OPEN = "open", _("در انتظار بررسی")
    UNDER_REVIEW = "under_review", _("در حال بررسی کارشناس داوری")
    RESOLVED_FULL_REFUND = "resolved_full_refund", _("تایید بازگشت کامل وجه به زبان‌آموز")
    RESOLVED_PARTIAL_REFUND = "resolved_partial_refund", _("تایید بازگشت بخشی از وجه")
    RESOLVED_PAY_TEACHER = "resolved_pay_teacher", _("رد ادعا و واریز کامل به مدرس")
    DISMISSED = "dismissed", _("رد ادعا بدون تغییر مالی")


class BookingDispute(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.OneToOneField(
        "marketplace.SessionBooking",
        on_delete=models.CASCADE,
        related_name="dispute",
        help_text="جلسه مورد اختلاف",
    )
    opened_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="opened_disputes",
        help_text="کاربر شاکی (زبان‌آموز یا مدرس)",
    )
    reason_category = models.CharField(
        max_length=32,
        choices=DisputeReasonCategory.choices,
        db_index=True,
        help_text="دسته‌بندی اصلی دلیل اختلاف",
    )
    description = models.TextField(
        help_text="توضیحات تفصیلی کاربر درباره مشکل جلسه (حداقل ۱۵ کاراکتر)",
    )
    evidence_notes = models.TextField(
        blank=True,
        default="",
        help_text="شواهد، لینک‌ها یا یادداشت‌های تکمیلی شاکی",
    )
    status = models.CharField(
        max_length=32,
        choices=DisputeStatus.choices,
        default=DisputeStatus.OPEN,
        db_index=True,
        help_text="وضعیت رسیدگی به اختلاف در پنل مدیریت",
    )
    refund_percentage = models.PositiveSmallIntegerField(
        default=0,
        help_text="درصد بازپرداخت به زبان‌آموز (۰ تا ۱۰۰)",
    )
    resolution_notes = models.TextField(
        blank=True,
        default="",
        help_text="توضیحات و دلایل رای صادره توسط تیم داوری اندورا",
    )
    resolved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="resolved_disputes",
        help_text="کارشناس یا مدیر رسیدگی‌کننده به اختلاف",
    )
    resolved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status", "-created_at"]),
            models.Index(fields=["opened_by", "-created_at"]),
        ]

    def __str__(self):
        return f"Dispute {self.id} for Booking {self.booking_id} ({self.get_status_display()})"


class TeacherOnboardingStatus(models.TextChoices):
    PENDING = "pending", _("در انتظار بررسی کارشناس")
    IN_REVIEW = "in_review", _("در حال بررسی مدارک")
    APPROVED = "approved", _("تأیید شده / فعال در بازارگاه")
    REJECTED = "rejected", _("رد درخواست")
    REVISION_REQUESTED = "revision_requested", _("نیازمند اصلاح یا بارگذاری مجدد مدارک")


class TeacherOnboardingApplication(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="onboarding_application",
        help_text="کاربر مدرس متقاضی تدریس در بازارگاه",
    )
    status = models.CharField(
        max_length=32,
        choices=TeacherOnboardingStatus.choices,
        default=TeacherOnboardingStatus.PENDING,
        db_index=True,
    )
    national_id_number = models.CharField(
        max_length=20,
        blank=True,
        default="",
        help_text="شماره ملی مدرس جهت احراز هویت",
    )
    id_document_url = models.URLField(
        blank=True,
        default="",
        help_text="لینک تصویر کارت ملی یا شناسنامه",
    )
    degree_document_url = models.URLField(
        blank=True,
        default="",
        help_text="لینک دانشنامه یا گواهی تحصیلی دانشگاهی",
    )
    celta_tesol_document_url = models.URLField(
        blank=True,
        default="",
        help_text="لینک مدارک بین‌المللی تدریس (TTC، CELTA، TESOL، DELTA)",
    )
    sample_teaching_url = models.URLField(
        blank=True,
        default="",
        help_text="لینک ویدیوی نمونه تدریس ۳ تا ۵ دقیقه‌ای",
    )
    admin_notes = models.TextField(
        blank=True,
        default="",
        help_text="یادداشت‌های محرمانه کارشناس بررسی‌کننده",
    )
    rejection_reason = models.TextField(
        blank=True,
        default="",
        help_text="دلیل رد یا موارد نیازمند اصلاح ارسالی برای مدرس",
    )
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviewed_teacher_applications",
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status", "-created_at"]),
        ]

    def __str__(self):
        return f"Onboarding Application: {self.teacher.email} ({self.get_status_display()})"


class PlatformPricingPlan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(
        max_length=64,
        unique=True,
        db_index=True,
        help_text="شناسه یکتای پلن (مانند launch_premium_90d)",
    )
    name_fa = models.CharField(
        max_length=120,
        help_text="نام فارسی پلن اشتراک",
    )
    name_en = models.CharField(
        max_length=120,
        help_text="نام انگلیسی پلن اشتراک",
    )
    duration_days = models.PositiveIntegerField(
        default=90,
        help_text="طول دوره اشتراک به روز",
    )
    price_toman = models.DecimalField(
        max_digits=12,
        decimal_places=0,
        default=Decimal("420000"),
        help_text="قیمت اشتراک به تومان",
    )
    is_active = models.BooleanField(
        default=True,
        db_index=True,
        help_text="فعال بودن پلن جهت خرید",
    )
    is_featured = models.BooleanField(
        default=False,
        help_text="برگزیده بودن پلن در صفحات قیمت‌گذاری",
    )
    features_fa = models.JSONField(
        default=list,
        blank=True,
        help_text="لیست مزایا و ویژگی‌های پلن به فارسی",
    )
    note_fa = models.TextField(
        blank=True,
        default="قیمت اولیه برای دوره راه‌اندازی است و از بخش مدیریت سیستم قابل تنظیم است.",
    )
    note_en = models.TextField(
        blank=True,
        default="This is the launch-plan display price, centrally managed through administrator configuration.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["price_toman"]

    def __str__(self):
        return f"{self.name_fa} ({self.price_toman} تومان / {self.duration_days} روز)"

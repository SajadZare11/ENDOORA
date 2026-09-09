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

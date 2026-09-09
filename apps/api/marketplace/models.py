import uuid
from decimal import Decimal
from django.conf import settings
from django.db import models
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

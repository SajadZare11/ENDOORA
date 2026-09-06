import uuid
from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from search.normalizer import normalize_text


class FAQCategory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=128, verbose_name=_("عنوان دسته‌بندی"))
    slug = models.SlugField(max_length=128, unique=True, verbose_name=_("شناسه یکتا"))
    icon = models.CharField(max_length=64, blank=True, default="help-circle", verbose_name=_("آیکون"))
    order = models.PositiveIntegerField(default=0, verbose_name=_("ترتیب نمایش"))
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("دسته‌بندی سوالات متداول")
        verbose_name_plural = _("دسته‌بندی‌های سوالات متداول")
        ordering = ["order", "title"]

    def __str__(self):
        return self.title


class FAQItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(
        FAQCategory,
        on_delete=models.CASCADE,
        related_name="items",
        verbose_name=_("دسته‌بندی"),
    )
    question = models.CharField(max_length=255, verbose_name=_("سوال"))
    normalized_question = models.CharField(max_length=255, db_index=True, blank=True)
    answer = models.TextField(verbose_name=_("پاسخ تایید شده"))
    is_published = models.BooleanField(default=True, db_index=True, verbose_name=_("منتشر شده"))
    order = models.PositiveIntegerField(default=0, verbose_name=_("ترتیب نمایش"))
    view_count = models.PositiveIntegerField(default=0, verbose_name=_("تعداد مشاهده"))
    helpful_count = models.PositiveIntegerField(default=0, verbose_name=_("تعداد رای مفید"))
    tags = models.JSONField(default=list, blank=True, verbose_name=_("برچسب‌ها"))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("سوال متداول")
        verbose_name_plural = _("سوالات متداول")
        ordering = ["order", "-helpful_count", "question"]

    def save(self, *args, **kwargs):
        self.normalized_question = normalize_text(self.question)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.question


class TicketCategory(models.TextChoices):
    PAYMENTS = "payments", _("پرداخت و امور مالی")
    ACCOUNT = "account", _("حساب کاربری")
    SECURITY = "security", _("امنیت و دسترسی")
    COURSES = "courses", _("دوره‌ها و محتوای آموزشی")
    TECHNICAL = "technical", _("مشکلات فنی پلتفرم")
    COMMUNITY = "community", _("جامعه و گزارش‌ها")
    OTHER = "other", _("سایر موارد")


class TicketStatus(models.TextChoices):
    NEW = "new", _("در انتظار بررسی")
    TRIAGED = "triaged", _("دسته‌بندی شده")
    AI_ANSWERED = "ai_answered", _("پاسخ هوشمند با استناد")
    ESCALATED = "escalated", _("ارجاع به پشتیبان انسانی")
    RESOLVED = "resolved", _("حل شده")
    CLOSED = "closed", _("بسته شده")


class SenderType(models.TextChoices):
    USER = "user", _("کاربر")
    AI_AGENT = "ai_agent", _("دستیار هوشمند")
    STAFF = "staff", _("کارشناس پشتیبانی")


class SupportTicket(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="support_tickets",
        verbose_name=_("کاربر"),
    )
    category = models.CharField(
        max_length=32,
        choices=TicketCategory.choices,
        db_index=True,
        verbose_name=_("دسته‌بندی موضوع"),
    )
    title = models.CharField(max_length=255, verbose_name=_("عنوان درخواست"))
    description = models.TextField(verbose_name=_("توضیحات و شرح مشکل"))
    status = models.CharField(
        max_length=32,
        choices=TicketStatus.choices,
        default=TicketStatus.NEW,
        db_index=True,
        verbose_name=_("وضعیت تیکت"),
    )
    escalated_to_human = models.BooleanField(
        default=False,
        db_index=True,
        verbose_name=_("ارجاع به انسان"),
    )
    escalation_reason = models.CharField(
        max_length=255,
        blank=True,
        default="",
        verbose_name=_("علت ارجاع"),
    )
    cited_faq = models.ForeignKey(
        FAQItem,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="cited_tickets",
        verbose_name=_("سوال متداول استناد شده"),
    )
    ai_confidence_score = models.FloatField(
        null=True,
        blank=True,
        verbose_name=_("ضریب اطمینان پاسخ هوشمند"),
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("تیکت پشتیبانی")
        verbose_name_plural = _("تیکت‌های پشتیبانی")
        ordering = ["-updated_at"]

    def __str__(self):
        return f"[{self.get_category_display()}][{self.get_status_display()}] {self.title}"


class TicketMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket = models.ForeignKey(
        SupportTicket,
        on_delete=models.CASCADE,
        related_name="messages",
        verbose_name=_("تیکت"),
    )
    sender_type = models.CharField(
        max_length=16,
        choices=SenderType.choices,
        default=SenderType.USER,
        verbose_name=_("فرستنده"),
    )
    sender_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        verbose_name=_("کاربر فرستنده"),
    )
    body = models.TextField(verbose_name=_("متن پیام"))
    is_internal = models.BooleanField(default=False, verbose_name=_("یادداشت داخلی"))
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("پیام تیکت")
        verbose_name_plural = _("پیام‌های تیکت")
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.sender_type}: {self.body[:40]}..."


class TicketAttachment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket = models.ForeignKey(
        SupportTicket,
        on_delete=models.CASCADE,
        related_name="attachments",
        verbose_name=_("تیکت"),
    )
    file_name = models.CharField(max_length=255, verbose_name=_("نام فایل"))
    file_url = models.CharField(max_length=512, verbose_name=_("آدرس فایل"))
    file_size = models.PositiveIntegerField(default=0, verbose_name=_("حجم فایل (بایت)"))
    content_type = models.CharField(max_length=64, blank=True, default="application/octet-stream")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("پیوست تیکت")
        verbose_name_plural = _("پیوست‌های تیکت")

    def __str__(self):
        return self.file_name

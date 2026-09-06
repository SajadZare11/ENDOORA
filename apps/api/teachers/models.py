import uuid
from decimal import Decimal
from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class ClassStatus(models.TextChoices):
    ACTIVE = "active", _("فعال")
    ARCHIVED = "archived", _("بایگانی شده")
    COMPLETED = "completed", _("تکمیل شده")


class LinkStatus(models.TextChoices):
    PENDING_CONSENT = "pending_consent", _("در انتظار تایید زبان‌آموز")
    ACTIVE = "active", _("فعال و متصل")
    TERMINATED = "terminated", _("خاتمه یافته")
    REJECTED = "rejected", _("رد شده")


class SessionStatus(models.TextChoices):
    SCHEDULED = "scheduled", _("برنامه‌ریزی شده")
    COMPLETED = "completed", _("برگزار شده")
    CANCELLED = "cancelled", _("لغو شده")


class LedgerStatus(models.TextChoices):
    PENDING = "pending", _("در انتظار تایید")
    CONFIRMED = "confirmed", _("تایید شده")
    DISPUTED = "disputed", _("مورد اختلاف")
    REVISED = "revised", _("اصلاح شده")


class TeacherClass(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="managed_classes",
        verbose_name=_("مدرس"),
    )
    title = models.CharField(max_length=255, verbose_name=_("عنوان کلاس"))
    description = models.TextField(blank=True, default="", verbose_name=_("توضیحات"))
    subject = models.CharField(max_length=128, verbose_name=_("موضوع و مهارت اصلی"))
    level = models.CharField(max_length=16, default="B1", verbose_name=_("سطح زبانی"))
    status = models.CharField(
        max_length=32,
        choices=ClassStatus.choices,
        default=ClassStatus.ACTIVE,
        db_index=True,
        verbose_name=_("وضعیت کلاس"),
    )
    max_capacity = models.PositiveIntegerField(default=1, verbose_name=_("ظرفیت حداکثر"))
    objectives = models.JSONField(default=list, blank=True, verbose_name=_("اهداف آموزشی"))
    private_notes = models.TextField(blank=True, default="", verbose_name=_("یادداشت‌های اختصاصی مدرس"))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("کلاس مدیریت شده مدرس")
        verbose_name_plural = _("کلاس‌های مدیریت شده مدرس")
        ordering = ["-updated_at"]

    def __str__(self):
        return f"{self.title} ({self.teacher.email})"


class TeacherLearnerLink(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher_class = models.ForeignKey(
        TeacherClass,
        on_delete=models.CASCADE,
        related_name="enrollments",
        verbose_name=_("کلاس"),
    )
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="teacher_links",
        verbose_name=_("مدرس"),
    )
    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="learner_links",
        verbose_name=_("زبان‌آموز"),
    )
    status = models.CharField(
        max_length=32,
        choices=LinkStatus.choices,
        default=LinkStatus.PENDING_CONSENT,
        db_index=True,
        verbose_name=_("وضعیت پیوند"),
    )
    invite_code = models.CharField(max_length=32, unique=True, db_index=True, verbose_name=_("کد دعوت"))
    consent_given_at = models.DateTimeField(null=True, blank=True, verbose_name=_("زمان اعطای رضایت"))
    terminated_at = models.DateTimeField(null=True, blank=True, verbose_name=_("زمان خاتمه ارتباط"))
    termination_reason = models.CharField(max_length=255, blank=True, default="", verbose_name=_("علت خاتمه"))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("پیوند آموزشی مدرس و زبان‌آموز")
        verbose_name_plural = _("پیوندهای آموزشی مدرس و زبان‌آموز")
        unique_together = ("teacher_class", "learner")
        ordering = ["-updated_at"]

    def __str__(self):
        return f"Link: {self.teacher.email} <-> {self.learner.email} [{self.status}]"


class ClassSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher_class = models.ForeignKey(
        TeacherClass,
        on_delete=models.CASCADE,
        related_name="sessions",
        verbose_name=_("کلاس"),
    )
    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="attended_sessions",
        verbose_name=_("زبان‌آموز"),
    )
    title = models.CharField(max_length=255, verbose_name=_("عنوان جلسه"))
    scheduled_start = models.DateTimeField(verbose_name=_("زمان شروع برنامه‌ریزی شده"))
    scheduled_end = models.DateTimeField(verbose_name=_("زمان پایان برنامه‌ریزی شده"))
    duration_minutes = models.PositiveIntegerField(default=60, verbose_name=_("مدت جلسه (دقیقه)"))
    status = models.CharField(
        max_length=32,
        choices=SessionStatus.choices,
        default=SessionStatus.SCHEDULED,
        db_index=True,
        verbose_name=_("وضعیت جلسه"),
    )
    session_notes = models.TextField(blank=True, default="", verbose_name=_("خلاصه و یادداشت جلسه"))
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name=_("زمان واقعی پایان"))
    confirmed_by_teacher = models.BooleanField(default=False, verbose_name=_("تایید مدرس"))
    confirmed_by_learner = models.BooleanField(default=False, verbose_name=_("تایید زبان‌آموز"))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("جلسه کلاسی")
        verbose_name_plural = _("جلسات کلاسی")
        ordering = ["scheduled_start"]

    def __str__(self):
        return f"{self.title} - {self.teacher_class.title} [{self.status}]"


class TeachingHourLedger(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="teaching_hour_ledgers",
        verbose_name=_("مدرس"),
    )
    session = models.OneToOneField(
        ClassSession,
        on_delete=models.CASCADE,
        related_name="ledger_entry",
        verbose_name=_("جلسه تایید شده"),
    )
    hours = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("1.00"), verbose_name=_("ساعت تدریس"))
    status = models.CharField(
        max_length=32,
        choices=LedgerStatus.choices,
        default=LedgerStatus.CONFIRMED,
        db_index=True,
        verbose_name=_("وضعیت تایید"),
    )
    is_verified = models.BooleanField(default=True, verbose_name=_("تایید شده برای ثبت مالی"))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("ثبت ساعت تدریس")
        verbose_name_plural = _("دفتر ساعات تدریس")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.teacher.email}: {self.hours} hrs [{self.status}]"


class TeachingHourAuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ledger_entry = models.ForeignKey(
        TeachingHourLedger,
        on_delete=models.CASCADE,
        related_name="audit_logs",
        verbose_name=_("رکورد ساعت تدریس"),
    )
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        verbose_name=_("کاربر اقدام‌کننده"),
    )
    action = models.CharField(max_length=32, verbose_name=_("نوع تغییر"))
    previous_hours = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    new_hours = models.DecimalField(max_digits=5, decimal_places=2)
    reason = models.TextField(verbose_name=_("علت و مستندات تغییر"))
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("گزارش حسابرسی ساعت تدریس")
        verbose_name_plural = _("گزارش‌های حسابرسی ساعت تدریس")
        ordering = ["-timestamp"]

    def __str__(self):
        return f"{self.action}: {self.previous_hours} -> {self.new_hours} by {self.actor.email}"


class TeacherDataAccessAudit(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="data_access_actions",
        verbose_name=_("مدرس"),
    )
    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="data_access_records",
        verbose_name=_("زبان‌آموز"),
    )
    access_type = models.CharField(max_length=64, verbose_name=_("نوع دسترسی به داده"))
    ip_address = models.CharField(max_length=45, blank=True, default="")
    user_agent = models.CharField(max_length=255, blank=True, default="")
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("گزارش دسترسی به داده‌های آموزشی")
        verbose_name_plural = _("گزارش‌های دسترسی به داده‌های آموزشی")
        ordering = ["-timestamp"]

    def __str__(self):
        return f"{self.teacher.email} accessed {self.learner.email} ({self.access_type})"

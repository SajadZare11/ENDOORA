from __future__ import annotations

import uuid
from django.conf import settings
from django.db import models
from django.utils import timezone


class ReportReason(models.TextChoices):
    COPYRIGHT = 'copyright_infringement', 'نقض حقوق مالکیت معنوی و کپی‌رایت'
    PII_LEAK = 'privacy_or_pii_leak', 'نشت اطلاعات حساس، هویتی یا اطلاعات خصوصی زبان‌آموز'
    HARASSMENT = 'harassment_or_abuse', 'توهین، مزاحمت یا رفتار نامناسب'
    SPAM = 'spam_or_solicitation', 'اسپم، تبلیغات نامرتبط یا تقلب'
    INAPPROPRIATE_FOR_MINORS = 'inappropriate_for_minors', 'محتوای نامناسب برای رده سنی کودکان و نوجوانان'
    MISINFORMATION = 'misinformation', 'اطلاعات نادرست و گمراه‌کننده آموزشی'
    OTHER = 'other', 'سایر موارد مغایر با قوانین جامعه اندورا'


class ModerationStatus(models.TextChoices):
    PENDING = 'pending', 'در انتظار بررسی'
    IN_REVIEW = 'in_review', 'در حال بازبینی توسط ناظر'
    RESOLVED = 'resolved', 'رسیدگی و تصمیم‌گیری شده'
    DISMISSED = 'dismissed', 'رد گزارش (فاقد تخلف)'


class ModerationAction(models.TextChoices):
    NONE = 'none', 'بدون اقدام'
    CONTENT_REMOVED = 'content_removed', 'حذف محتوا از دید عمومی'
    CONTENT_EDITED = 'content_edited', 'ویرایش محتوا و حذف بخش نامناسب'
    USER_WARNED = 'user_warned', 'ارسال اخطار رسمی به کاربر'
    USER_MUTED = 'user_muted', 'بی‌صدا کردن کاربر (محرومیت از ثبت نظر و پست)'
    USER_SUSPENDED = 'user_suspended', 'مسدودسازی موقت یا دائم حساب کاربری'


class Report(models.Model):
    # SLA standard response hours by severity
    SLA_HOURS_MAP = {
        ReportReason.PII_LEAK: 2,
        ReportReason.INAPPROPRIATE_FOR_MINORS: 2,
        ReportReason.HARASSMENT: 12,
        ReportReason.COPYRIGHT: 12,
        ReportReason.SPAM: 24,
        ReportReason.MISINFORMATION: 24,
        ReportReason.OTHER: 24,
    }

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='submitted_reports'
    )
    target_type = models.CharField(
        max_length=32,
        choices=[('post', 'Community Post'), ('comment', 'Post Comment')],
        default='post'
    )
    target_id = models.CharField(max_length=64, db_index=True)
    target_author_id = models.UUIDField(null=True, blank=True)

    # Content snapshot: permanently preserves copy of reported text for legal/audit purposes
    # even when the post/comment is removed!
    target_content_snapshot = models.TextField(
        help_text='Immutable snapshot of reported content at time of report'
    )

    reason = models.CharField(
        max_length=64,
        choices=ReportReason.choices,
        default=ReportReason.OTHER,
        db_index=True
    )
    description = models.TextField(blank=True)

    sla_hours = models.PositiveIntegerField(default=24)
    sla_deadline = models.DateTimeField(db_index=True)

    status = models.CharField(
        max_length=24,
        choices=ModerationStatus.choices,
        default=ModerationStatus.PENDING,
        db_index=True
    )

    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_reports'
    )
    resolved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='resolved_reports'
    )
    resolved_at = models.DateTimeField(null=True, blank=True)
    action_taken = models.CharField(
        max_length=32,
        choices=ModerationAction.choices,
        default=ModerationAction.NONE
    )
    resolution_notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sla_deadline', 'created_at']
        verbose_name = 'Moderation Report'
        verbose_name_plural = 'Moderation Reports'

    def save(self, *args, **kwargs):
        if not self.sla_deadline:
            hours = self.SLA_HOURS_MAP.get(self.reason, 24)
            self.sla_hours = hours
            self.sla_deadline = timezone.now() + timezone.timedelta(hours=hours)
        super().save(*args, **kwargs)

    @property
    def is_sla_breached(self) -> bool:
        if self.status in [ModerationStatus.RESOLVED, ModerationStatus.DISMISSED]:
            return False
        return timezone.now() > self.sla_deadline

    def __str__(self):
        return f'Report [{self.reason}] on {self.target_type}:{self.target_id} ({self.status})'


class ModerationAuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    report = models.ForeignKey(
        Report,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_logs'
    )
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    action = models.CharField(max_length=32, choices=ModerationAction.choices)
    target_type = models.CharField(max_length=32)
    target_id = models.CharField(max_length=64)
    details = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Moderation Audit Log'
        verbose_name_plural = 'Moderation Audit Logs'

    def __str__(self):
        return f'Audit: {self.action} on {self.target_type}:{self.target_id} by {self.actor_id}'

import uuid
from decimal import Decimal

from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class OnlineExam(models.Model):
    class ExamStatus(models.TextChoices):
        DRAFT = 'draft', _('پیشنویس')
        PUBLISHED = 'published', _('منتشر شده')
        CLOSED = 'closed', _('پایان یافته')
        ARCHIVED = 'archived', _('بایگانی شده')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='online_exams',
        verbose_name=_('مدرس')
    )
    teacher_class = models.ForeignKey(
        'teachers.TeacherClass',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='online_exams',
        verbose_name=_('کلاس')
    )
    title = models.CharField(max_length=255, verbose_name=_('عنوان آزمون'))
    description = models.TextField(blank=True, default='', verbose_name=_('توضیحات آزمون'))
    instructions = models.TextField(blank=True, default='', verbose_name=_('دستورالعمل آزمون'))
    duration_minutes = models.PositiveIntegerField(default=60, verbose_name=_('مدت زمان آزمون (دقیقه)'))
    anti_cheat_config = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_('تنظیمات ضد تقلب')
    )
    shuffle_questions = models.BooleanField(default=False, verbose_name=_('ترتیب تصادفی سوالات'))
    shuffle_choices = models.BooleanField(default=False, verbose_name=_('ترتیب تصادفی گزینهها'))
    passing_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal('60.00'),
        verbose_name=_('نمره قبولی (درصد)')
    )
    max_attempts = models.PositiveIntegerField(default=1, verbose_name=_('حداکثر دفعات شرکت'))
    status = models.CharField(
        max_length=20,
        choices=ExamStatus.choices,
        default=ExamStatus.DRAFT,
        db_index=True,
        verbose_name=_('وضعیت')
    )
    access_code = models.CharField(max_length=32, unique=True, null=True, blank=True, verbose_name=_('کد دسترسی آزمون'))
    show_results_to_student = models.BooleanField(default=True, verbose_name=_('نمایش نتایج به زبانآموز'))
    starts_at = models.DateTimeField(null=True, blank=True, verbose_name=_('زمان شروع آزمون'))
    ends_at = models.DateTimeField(null=True, blank=True, verbose_name=_('زمان پایان آزمون'))
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('آزمون آنلاین')
        verbose_name_plural = _('آزمونهای آنلاین')
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.title} [{self.status}]"

    @staticmethod
    def get_default_anti_cheat_config():
        return {
            'enforce_fullscreen': True,
            'max_blur_events': 5,
            'max_fullscreen_exits': 3,
            'block_clipboard': True,
            'block_devtools': True,
            'auto_submit_on_violation': True,
            'violation_threshold': 5
        }


class ExamQuestion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    exam = models.ForeignKey(
        OnlineExam,
        on_delete=models.CASCADE,
        related_name='exam_questions',
        verbose_name=_('آزمون')
    )
    question_version = models.ForeignKey(
        'questions.QuestionVersion',
        on_delete=models.PROTECT,
        related_name='exam_usages',
        verbose_name=_('نسخه سوال')
    )
    order = models.PositiveIntegerField(default=1, verbose_name=_('ترتیب نمایش'))
    points = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal('10.00'),
        verbose_name=_('نمره سوال')
    )
    custom_instructions = models.TextField(blank=True, default='', verbose_name=_('دستورالعمل سفارشی'))
    listening_play_limit = models.PositiveIntegerField(default=2, verbose_name=_('سقف دفعات پخش صوت'))
    speaking_time_limit_seconds = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name=_('محدودیت زمان ضبط صدا (ثانیه)')
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('exam', 'question_version')
        ordering = ['order', 'created_at']
        verbose_name = _('سوال آزمون')
        verbose_name_plural = _('سوالات آزمون')

    def __str__(self):
        return f"{self.exam.title} - {self.question_version} (Order: {self.order})"


class ExamSubmission(models.Model):
    class SubmissionStatus(models.TextChoices):
        IN_PROGRESS = 'in_progress', _('در حال انجام')
        SUBMITTED = 'submitted', _('ارسال شده')
        AUTO_GRADED = 'auto_graded', _('تصحیح خودکار')
        MANUALLY_GRADED = 'manually_graded', _('تصحیح دستی')
        TIMED_OUT = 'timed_out', _('مهلت تمام شده')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    exam = models.ForeignKey(
        OnlineExam,
        on_delete=models.CASCADE,
        related_name='submissions',
        verbose_name=_('آزمون')
    )
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='exam_submissions',
        verbose_name=_('زبانآموز')
    )
    attempt_number = models.PositiveIntegerField(default=1, verbose_name=_('شماره تلاش'))
    status = models.CharField(
        max_length=20,
        choices=SubmissionStatus.choices,
        default=SubmissionStatus.IN_PROGRESS,
        db_index=True
    )
    started_at = models.DateTimeField(auto_now_add=True, verbose_name=_('زمان شروع'))
    submitted_at = models.DateTimeField(null=True, blank=True, verbose_name=_('زمان ارسال'))
    total_score = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name=_('نمره کسب شده')
    )
    max_possible_score = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=Decimal('0.00'),
        verbose_name=_('حداکثر نمره ممکن')
    )
    percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name=_('درصد نمره')
    )
    integrity_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name=_('نمره اصالت')
    )
    integrity_details = models.JSONField(default=dict, blank=True, verbose_name=_('جزئیات نمره اصالت'))
    is_late = models.BooleanField(default=False, verbose_name=_('ثبت با تاخیر'))
    time_limit_expires_at = models.DateTimeField(null=True, blank=True, verbose_name=_('مهلت پایان تایمر'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('exam', 'student', 'attempt_number')
        ordering = ['-started_at']
        verbose_name = _('پاسخنامه آزمون')
        verbose_name_plural = _('پاسخنامههای آزمون')

    def __str__(self):
        return f"{self.student} - {self.exam.title} (Attempt {self.attempt_number})"

    def is_time_expired(self):
        if self.time_limit_expires_at:
            return timezone.now() > self.time_limit_expires_at
        return False


class ExamAnswer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submission = models.ForeignKey(
        ExamSubmission,
        on_delete=models.CASCADE,
        related_name='answers',
        verbose_name=_('پاسخنامه')
    )
    exam_question = models.ForeignKey(
        ExamQuestion,
        on_delete=models.PROTECT,
        related_name='answers',
        verbose_name=_('سوال آزمون')
    )
    student_response = models.JSONField(default=dict, blank=True, verbose_name=_('پاسخ زبانآموز'))
    audio_recording_url = models.URLField(blank=True, default='', verbose_name=_('آدرس فایل ضبط صدا'))
    is_auto_graded = models.BooleanField(default=False, verbose_name=_('تصحیح خودکار شده'))
    auto_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name=_('نمره خودکار')
    )
    manual_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name=_('نمره دستی')
    )
    score_awarded = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name=_('نمره نهایی')
    )
    teacher_feedback = models.TextField(blank=True, default='', verbose_name=_('بازخورد مدرس'))
    graded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='graded_exam_answers',
        verbose_name=_('مصحح')
    )
    graded_at = models.DateTimeField(null=True, blank=True, verbose_name=_('زمان تصحیح'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('submission', 'exam_question')
        ordering = ['exam_question__order']
        verbose_name = _('پاسخ سوال')
        verbose_name_plural = _('پاسخهای سوالات')

    def __str__(self):
        return f"Answer to {self.exam_question} by {self.submission.student}"


class ProctoringLog(models.Model):
    class ProctoringEventType(models.TextChoices):
        BLUR = 'blur', _('خروج از صفحه')
        FOCUS = 'focus', _('ورود به صفحه')
        TAB_HIDDEN = 'tab_hidden', _('مخفی شدن تب')
        TAB_VISIBLE = 'tab_visible', _('نمایش تب')
        FULLSCREEN_EXIT = 'fullscreen_exit', _('خروج از تمامصفحه')
        FULLSCREEN_ENTER = 'fullscreen_enter', _('ورود به تمامصفحه')
        PASTE_ATTEMPT = 'paste_attempt', _('تلاش برای الصاق (Paste)')
        DEVTOOLS_ATTEMPT = 'devtools_attempt', _('تلاش برای باز کردن DevTools')
        SHORTCUT_BLOCKED = 'shortcut_blocked', _('مسدود شدن میانبر')
        WINDOW_RESIZE = 'window_resize', _('تغییر اندازه پنجره')
        EXAM_STARTED = 'exam_started', _('شروع آزمون')
        EXAM_SUBMITTED = 'exam_submitted', _('پایان آزمون')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submission = models.ForeignKey(
        ExamSubmission,
        on_delete=models.CASCADE,
        related_name='proctoring_logs',
        verbose_name=_('پاسخنامه')
    )
    event_type = models.CharField(
        max_length=30,
        choices=ProctoringEventType.choices,
        db_index=True,
        verbose_name=_('نوع رویداد')
    )
    duration_seconds = models.FloatField(null=True, blank=True, verbose_name=_('مدت زمان (ثانیه)'))
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name=_('زمان ثبت سرور'))
    client_timestamp = models.DateTimeField(null=True, blank=True, verbose_name=_('زمان ثبت کلاینت'))
    metadata = models.JSONField(default=dict, blank=True, verbose_name=_('اطلاعات تکمیلی'))

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['submission', 'event_type']),
            models.Index(fields=['submission', 'timestamp']),
        ]
        verbose_name = _('لاگ نظارت')
        verbose_name_plural = _('لاگهای نظارت')

    def __str__(self):
        return f"{self.get_event_type_display()} - {self.submission}"

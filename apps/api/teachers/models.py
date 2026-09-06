import uuid
from datetime import timedelta
from decimal import Decimal
from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class AssignmentStatus(models.TextChoices):
    DRAFT = "draft", _("پیش‌نویس")
    PUBLISHED = "published", _("منتشر شده")
    CLOSED = "closed", _("پایان یافته")
    ARCHIVED = "archived", _("بایگانی شده")


class AttemptStatus(models.TextChoices):
    IN_PROGRESS = "in_progress", _("در حال انجام")
    SUBMITTED = "submitted", _("ارسال شده")
    GRADED = "graded", _("تصحیح شده")
    TIMED_OUT = "timed_out", _("مهلت تمام شده")
    REVISION_REQUESTED = "revision_requested", _("درخواست بازنگری")


class FeedbackStatus(models.TextChoices):
    PENDING = "pending", _("در انتظار بررسی مدرس")
    RETURNED = "returned", _("تصحیح شده و ارسال بازخورد")
    ACKNOWLEDGED = "acknowledged", _("مشاهده و تایید شده توسط زبان‌آموز")
    REVISION_REQUESTED = "revision_requested", _("درخواست بازنگری و اصلاح")


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


class Assignment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher_class = models.ForeignKey(
        TeacherClass,
        on_delete=models.CASCADE,
        related_name="assignments",
        verbose_name=_("کلاس"),
    )
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="teacher_assignments",
        verbose_name=_("مدرس"),
    )
    title = models.CharField(max_length=255, verbose_name=_("عنوان تکلیف/تمرین"))
    description = models.TextField(blank=True, default="", verbose_name=_("توضیحات"))
    instructions = models.TextField(blank=True, default="", verbose_name=_("دستورالعمل آزمون/تکلیف"))
    target_cefr = models.CharField(max_length=16, default="B1", verbose_name=_("سطح هدف CEFR"))
    status = models.CharField(
        max_length=32,
        choices=AssignmentStatus.choices,
        default=AssignmentStatus.DRAFT,
        db_index=True,
        verbose_name=_("وضعیت"),
    )
    due_date = models.DateTimeField(null=True, blank=True, verbose_name=_("مهلت ارسال (ددلاین)"))
    grace_period_minutes = models.PositiveIntegerField(
        default=0,
        verbose_name=_("فرصت ارفاقی (دقیقه)"),
        help_text=_("مدت زمان ارفاقی پس از ددلاین قبل از بسته شدن امکان ثبت"),
    )
    allow_late_submission = models.BooleanField(
        default=False,
        verbose_name=_("امکان ارسال با تاخیر"),
        help_text=_("آیا پس از مهلت، ارسال به عنوان با تاخیر مجاز است"),
    )
    max_attempts = models.PositiveIntegerField(
        default=1,
        verbose_name=_("حداکثر دفعات تلاش"),
        help_text=_("تعداد مجاز بار شرکت در آزمون/تکلیف"),
    )
    time_limit_minutes = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name=_("محدودیت زمانی (دقیقه)"),
        help_text=_("مدت زمان مجاز برای هر تلاش؛ خالی برای بدون محدودیت"),
    )
    total_points = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=Decimal("100.00"),
        verbose_name=_("مجموع نمره"),
    )
    passing_percentage = models.PositiveIntegerField(
        default=60,
        verbose_name=_("درصد قبولی"),
    )
    version = models.PositiveIntegerField(
        default=1,
        verbose_name=_("نسخه ویرایش (کنترل همزمانی)"),
    )
    published_at = models.DateTimeField(null=True, blank=True, verbose_name=_("زمان انتشار"))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("تکلیف کلاسی")
        verbose_name_plural = _("تکالیف کلاسی")
        ordering = ["-updated_at"]

    def __str__(self):
        return f"{self.title} ({self.teacher_class.title}) [{self.status}]"

    def effective_due_date(self, learner=None):
        if learner:
            accommodation = self.accommodations.filter(learner=learner).first()
            if accommodation and accommodation.extended_due_date:
                return accommodation.extended_due_date
        return self.due_date

    def effective_time_limit(self, learner=None):
        if not self.time_limit_minutes:
            return None
        limit = self.time_limit_minutes
        if learner:
            accommodation = self.accommodations.filter(learner=learner).first()
            if accommodation and accommodation.extra_time_minutes:
                limit += accommodation.extra_time_minutes
        return limit

    def effective_max_attempts(self, learner=None):
        max_att = self.max_attempts
        if learner:
            accommodation = self.accommodations.filter(learner=learner).first()
            if accommodation and accommodation.extra_attempts:
                max_att += accommodation.extra_attempts
        return max_att

    def is_submission_open(self, learner=None):
        if self.status != AssignmentStatus.PUBLISHED:
            return False
        eff_due = self.effective_due_date(learner)
        if not eff_due:
            return True
        cutoff = eff_due + timedelta(minutes=self.grace_period_minutes)
        if timezone.now() <= cutoff:
            return True
        return self.allow_late_submission


class AssignmentQuestion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assignment = models.ForeignKey(
        Assignment,
        on_delete=models.CASCADE,
        related_name="assignment_questions",
        verbose_name=_("تکلیف"),
    )
    question_version = models.ForeignKey(
        "questions.QuestionVersion",
        on_delete=models.PROTECT,
        related_name="assignment_usages",
        verbose_name=_("نسخه سوال بانک سوالات"),
    )
    order = models.PositiveIntegerField(default=1, verbose_name=_("ترتیب نمایش"))
    custom_instructions = models.TextField(
        blank=True,
        default="",
        verbose_name=_("دستورالعمل سفارشی مدرس"),
    )
    points = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal("10.00"),
        verbose_name=_("نمره این سوال"),
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("سوال اختصاص داده شده به تکلیف")
        verbose_name_plural = _("سوالات اختصاص داده شده به تکالیف")
        unique_together = ("assignment", "question_version")
        ordering = ["order", "created_at"]

    def __str__(self):
        return f"{self.assignment.title} - Q#{self.order}: {self.question_version.title_fa or self.question_version.question.slug}"


class AssignmentAccommodation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assignment = models.ForeignKey(
        Assignment,
        on_delete=models.CASCADE,
        related_name="accommodations",
        verbose_name=_("تکلیف"),
    )
    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="assignment_accommodations",
        verbose_name=_("زبان‌آموز"),
    )
    extra_time_minutes = models.PositiveIntegerField(
        default=0,
        verbose_name=_("زمان اضافه ارفاقی (دقیقه)"),
    )
    extra_attempts = models.PositiveIntegerField(
        default=0,
        verbose_name=_("دفعات تلاش اضافه"),
    )
    extended_due_date = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("ددلاین تمدید شده اختصاصی"),
    )
    notes = models.TextField(
        blank=True,
        default="",
        verbose_name=_("یادداشت و علت انطباق آموزشی"),
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("انطباق و تسهیلات آموزشی تکلیف")
        verbose_name_plural = _("تسهیلات و انطباقات آموزشی تکالیف")
        unique_together = ("assignment", "learner")
        ordering = ["-updated_at"]

    def __str__(self):
        return f"Accommodation for {self.learner.email} in {self.assignment.title}"


class AssignmentAttempt(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assignment = models.ForeignKey(
        Assignment,
        on_delete=models.CASCADE,
        related_name="attempts",
        verbose_name=_("تکلیف"),
    )
    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="assignment_attempts",
        verbose_name=_("زبان‌آموز"),
    )
    attempt_number = models.PositiveIntegerField(default=1, verbose_name=_("شماره تلاش"))
    status = models.CharField(
        max_length=32,
        choices=AttemptStatus.choices,
        default=AttemptStatus.IN_PROGRESS,
        db_index=True,
        verbose_name=_("وضعیت تلاش"),
    )
    started_at = models.DateTimeField(auto_now_add=True, verbose_name=_("زمان شروع"))
    submitted_at = models.DateTimeField(null=True, blank=True, verbose_name=_("زمان ارسال"))
    time_limit_expires_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("مهلت پایان تایمر این تلاش"),
    )
    answers_payload = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_("پاسخ‌های زبان‌آموز"),
        help_text=_("ذخیره خودکار پیش‌نویس پاسخ‌ها بر اساس شناسه نسخه سوال"),
    )
    grading_results = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_("نتیجه تصحیح آزمون"),
    )
    score_awarded = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name=_("نمره کسب شده"),
    )
    percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name=_("درصد نمره"),
    )
    is_late = models.BooleanField(
        default=False,
        verbose_name=_("ثبت با تاخیر"),
    )
    teacher_feedback = models.TextField(
        blank=True,
        default="",
        verbose_name=_("بازخورد کیفی مدرس"),
    )
    rubric_scores = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_("نمرات و معیارهای ارزیابی روبریم"),
    )
    question_grades = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_("نمرات و بازخوردهای تفکیکی هر سوال"),
    )
    feedback_status = models.CharField(
        max_length=32,
        choices=FeedbackStatus.choices,
        default=FeedbackStatus.PENDING,
        db_index=True,
        verbose_name=_("وضعیت بازخورد"),
    )
    learner_reflection = models.TextField(
        blank=True,
        default="",
        verbose_name=_("یادداشت و خودبازتابی زبان‌آموز"),
    )
    learner_acknowledged_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("زمان تایید بازخورد توسط زبان‌آموز"),
    )
    revision_notes = models.TextField(
        blank=True,
        default="",
        verbose_name=_("دستورالعمل بازنگری و اصلاح"),
    )
    graded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="graded_assignment_attempts",
        verbose_name=_("مصحح"),
    )
    graded_at = models.DateTimeField(null=True, blank=True, verbose_name=_("زمان تصحیح"))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("تلاش زبان‌آموز در تکلیف")
        verbose_name_plural = _("تلاش‌های زبان‌آموزان در تکالیف")
        unique_together = ("assignment", "learner", "attempt_number")
        ordering = ["-started_at"]

    def __str__(self):
        return f"{self.assignment.title} - {self.learner.email} (Attempt #{self.attempt_number}) [{self.status}]"

    def is_time_expired(self):
        if self.time_limit_expires_at and timezone.now() > self.time_limit_expires_at:
            return True
        return False


class SubmissionFeedbackMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    attempt = models.ForeignKey(
        AssignmentAttempt,
        on_delete=models.CASCADE,
        related_name="feedback_messages",
        verbose_name=_("تلاش تکلیف"),
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="submission_feedback_messages",
        verbose_name=_("نویسنده پیام"),
    )
    message = models.TextField(verbose_name=_("متن پیام یا بازخورد"))
    is_internal_note = models.BooleanField(
        default=False,
        verbose_name=_("یادداشت خصوصی مدرس"),
        help_text=_("فقط برای مدرسین قابل مشاهده است و به زبان‌آموز نشان داده نمی‌شود"),
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        verbose_name = _("پیام حلقه بازخورد تکلیف")
        verbose_name_plural = _("پیام‌های حلقه بازخورد تکالیف")
        ordering = ["created_at"]

    def __str__(self):
        return f"Feedback msg by {self.author.email} on attempt {self.attempt_id}"

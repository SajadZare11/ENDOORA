import uuid
from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class CurriculumTrack(models.TextChoices):
    ADULT_GENERAL = "adult_general", _("دوره‌های عمومی بزرگسالان")
    YOUNG_LEARNERS = "young_learners", _("کودک و نوجوان")
    EXAM_PREP_IELTS = "exam_prep_ielts", _("آمادگی آزمون آیلتس (IELTS)")
    EXAM_PREP_TOEFL = "exam_prep_toefl", _("آمادگی آزمون تافل (TOEFL)")
    EXAM_PREP_ADVANCED = "exam_prep_advanced", _("آزمون‌های پیشرفته کمبریج (CAE)")


class ClassFormat(models.TextChoices):
    SOLO = "solo", _("انفرادی (۱ به ۱)")
    GROUP = "group", _("گروهی (تا ۴ نفر)")


class EnrollmentRequestStatus(models.TextChoices):
    PENDING = "pending", _("در انتظار پذیرش مدرس")
    CLAIMED = "claimed", _("پذیرفته شده توسط مدرس")
    MATCHED = "matched", _("تشکیل شده در کلاس")
    CANCELLED = "cancelled", _("لغو شده")


class CohortStatus(models.TextChoices):
    ACTIVE = "active", _("فعال و در حال برگزاری")
    COMPLETED = "completed", _("به پایان رسیده")
    PAUSED = "paused", _("متوقف شده")


class CurriculumBookMapping(models.Model):
    """
    Standard textbook and curriculum definition mapped to CEFR level, age group, and track.
    Supports standard Iranian language school series (American English File, Family and Friends, etc.).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(max_length=120, unique=True, db_index=True)
    track = models.CharField(
        max_length=32,
        choices=CurriculumTrack.choices,
        default=CurriculumTrack.ADULT_GENERAL,
        db_index=True,
    )
    min_cefr = models.CharField(max_length=8, default="A1", db_index=True)
    max_cefr = models.CharField(max_length=8, default="A1")
    min_age = models.PositiveIntegerField(default=13)
    max_age = models.PositiveIntegerField(default=99)
    book_title = models.CharField(max_length=255)
    publisher = models.CharField(max_length=128)
    edition = models.CharField(max_length=64, blank=True, default="")
    description_fa = models.TextField(blank=True, default="")
    description_en = models.TextField(blank=True, default="")
    cover_image_url = models.URLField(max_length=500, blank=True, default="")
    syllabus_json = models.JSONField(
        default=dict,
        blank=True,
        help_text="Detailed syllabus containing units, target grammar points, vocabulary volume, speaking goals.",
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("نگاشت کتاب آموزشی")
        verbose_name_plural = _("نگاشت‌های کتب آموزشی")
        ordering = ["track", "min_cefr", "book_title"]

    def __str__(self):
        return f"{self.book_title} ({self.min_cefr}–{self.max_cefr}) [{self.get_track_display()}]"


class ClassEnrollmentRequest(models.Model):
    """
    Student request to enroll in a live online class (Step 5 of learner journey).
    Includes schedule availability, solo vs group preference, and target curriculum.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="class_enrollment_requests",
        verbose_name=_("زبان‌آموز"),
    )
    preferred_format = models.CharField(
        max_length=16,
        choices=ClassFormat.choices,
        default=ClassFormat.GROUP,
        verbose_name=_("قالب کلاس درخواستی"),
    )
    max_classmates = models.PositiveIntegerField(
        default=3,
        help_text="حداکثر تعداد همکلاسی‌ها (۱ تا ۳ نفر؛ مجموعاً ۲ تا ۴ نفر در کلاس)",
    )
    available_slots_json = models.JSONField(
        default=list,
        blank=True,
        help_text="لیست روزها و ساعت‌های در دسترس کاربر (مثلا: شنبه صبح، دوشنبه عصر)",
    )
    target_book = models.ForeignKey(
        CurriculumBookMapping,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="enrollment_requests",
        verbose_name=_("کتاب هدف پیشنهادی"),
    )
    status = models.CharField(
        max_length=24,
        choices=EnrollmentRequestStatus.choices,
        default=EnrollmentRequestStatus.PENDING,
        db_index=True,
        verbose_name=_("وضعیت درخواست"),
    )
    student_notes = models.TextField(blank=True, default="", verbose_name=_("یادداشت زبان‌آموز"))
    claimed_by_teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="claimed_class_requests",
        verbose_name=_("مدرس پذیرنده"),
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("درخواست ثبت‌نام کلاس آنلاین")
        verbose_name_plural = _("درخواست‌های ثبت‌نام کلاس آنلاین")
        ordering = ["-created_at"]

    def __str__(self):
        return f"Request by {self.student.email} [{self.get_status_display()}] - {self.preferred_format}"


class LiveClassCohort(models.Model):
    """
    An active live online class cohort managed by a verified teacher.
    Holds up to 4 students, meeting URL, and scheduled timing.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="teaching_cohorts",
        verbose_name=_("مدرس"),
    )
    book = models.ForeignKey(
        CurriculumBookMapping,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="active_cohorts",
        verbose_name=_("کتاب و سرفصل آموزشی"),
    )
    title = models.CharField(max_length=255, verbose_name=_("عنوان کلاس"))
    class_format = models.CharField(
        max_length=16,
        choices=ClassFormat.choices,
        default=ClassFormat.GROUP,
        verbose_name=_("نوع کلاس"),
    )
    max_capacity = models.PositiveIntegerField(
        default=4,
        verbose_name=_("حداکثر ظرفیت (۱ تا ۴ نفر)"),
    )
    students = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="enrolled_cohorts",
        blank=True,
        verbose_name=_("زبان‌آموزان کلاس"),
    )
    meeting_url = models.URLField(
        max_length=500,
        blank=True,
        default="",
        verbose_name=_("لینک کلاس آنلاین (اسکای‌روم / گوگل میت)"),
    )
    schedule_summary = models.CharField(
        max_length=255,
        blank=True,
        default="",
        verbose_name=_("برنامه برگزاری جلسات"),
    )
    next_session_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("زمان جلسه بعدی"),
    )
    status = models.CharField(
        max_length=24,
        choices=CohortStatus.choices,
        default=CohortStatus.ACTIVE,
        db_index=True,
        verbose_name=_("وضعیت دوره"),
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("گروه کلاسی آنلاین")
        verbose_name_plural = _("گروه‌های کلاسی آنلاین")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} ({self.students.count()}/{self.max_capacity}) - {self.teacher.email}"


class TeacherSessionLog(models.Model):
    """
    Post-session teaching log submitted by the teacher after each session.
    Directly feeds into student dashboards and prioritized Daily Mission homework.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cohort = models.ForeignKey(
        LiveClassCohort,
        on_delete=models.CASCADE,
        related_name="session_logs",
        verbose_name=_("کلاس"),
    )
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="logged_sessions",
        verbose_name=_("مدرس ثبت‌کننده"),
    )
    session_number = models.PositiveIntegerField(default=1, verbose_name=_("شماره جلسه"))
    units_covered = models.CharField(
        max_length=255,
        verbose_name=_("درس‌ها و بخش‌های تدریس شده"),
    )
    grammar_covered = models.TextField(
        blank=True,
        default="",
        verbose_name=_("نکات گرامری آموزش داده شده"),
    )
    vocabulary_list = models.JSONField(
        default=list,
        blank=True,
        verbose_name=_("واژگان کلیدی جلسه"),
    )
    homework_description = models.TextField(
        blank=True,
        default="",
        verbose_name=_("تکالیف منزل"),
    )
    teacher_notes = models.TextField(
        blank=True,
        default="",
        verbose_name=_("یادداشت عملکرد و پیشرفت"),
    )
    session_date = models.DateField(default=timezone.now, verbose_name=_("تاریخ جلسه"))
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("گزارش جلسه تدریس")
        verbose_name_plural = _("گزارش‌های جلسات تدریس")
        ordering = ["-session_date", "-session_number"]

    def __str__(self):
        return f"Log #{self.session_number} for {self.cohort.title} ({self.session_date})"

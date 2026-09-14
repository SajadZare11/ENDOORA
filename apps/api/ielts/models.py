import uuid
from decimal import Decimal
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class IELTSTestType(models.TextChoices):
    ACADEMIC = "academic", _("Academic / آکادمیک")
    GENERAL_TRAINING = "general_training", _("General Training / جنرال ترینینگ")


class IELTSSectionType(models.TextChoices):
    LISTENING = "listening", _("Listening / شنیداری")
    READING = "reading", _("Reading / خواندن و درک مطلب")
    WRITING = "writing", _("Writing / نگارش")
    SPEAKING = "speaking", _("Speaking / گفتار و مکالمه")


class IELTSTestStatus(models.TextChoices):
    DRAFT = "draft", _("Draft / پیش‌نویس")
    IN_REVIEW = "in_review", _("In Review / در حال بازبینی")
    APPROVED = "approved", _("Approved / تأیید شده")
    PUBLISHED = "published", _("Published / منتشر شده")
    ARCHIVED = "archived", _("Archived / بایگانی شده")


class IELTSQuestionType(models.TextChoices):
    # Multiple Choice & Identification
    MULTIPLE_CHOICE_SINGLE = "multiple_choice_single", _("Multiple Choice (Single) / چندگزینه‌ای تک‌جواب")
    MULTIPLE_CHOICE_MULTIPLE = "multiple_choice_multiple", _("Multiple Choice (Multi) / چندگزینه‌ای چندجواب")
    TRUE_FALSE_NOT_GIVEN = "true_false_not_given", _("True / False / Not Given (T/F/NG)")
    YES_NO_NOT_GIVEN = "yes_no_not_given", _("Yes / No / Not Given (Y/N/NG)")

    # Matching Formats
    MATCHING_HEADINGS = "matching_headings", _("Matching Headings / تطبیق عناوین")
    MATCHING_INFORMATION = "matching_information", _("Matching Information / تطبیق اطلاعات")
    MATCHING_FEATURES = "matching_features", _("Matching Features / تطبیق ویژگی‌ها")

    # Completion Formats
    SENTENCE_COMPLETION = "sentence_completion", _("Sentence Completion / تکمیل جملات")
    SUMMARY_COMPLETION = "summary_completion", _("Summary Completion / تکمیل خلاصه")
    NOTE_FORM_COMPLETION = "note_form_completion", _("Note / Form Completion / تکمیل یادداشت یا فرم")
    DIAGRAM_MAP_LABELLING = "diagram_map_labelling", _("Diagram / Map Labelling / برچسب‌گذاری نقشه یا نمودار")
    TABLE_FLOWCHART_COMPLETION = "table_flowchart_completion", _("Table / Flowchart Completion / تکمیل جدول یا فلوچارت")

    # Productive Tasks
    WRITING_TASK1_ACADEMIC = "writing_task1_academic", _("Academic Writing Task 1 / گزارش نمودار یا فرآیند")
    WRITING_TASK1_GENERAL = "writing_task1_general", _("General Writing Task 1 / نگارش نامه")
    WRITING_TASK2_ESSAY = "writing_task2_essay", _("Writing Task 2 / نگارش مقاله تحلیلی")
    SPEAKING_PART1 = "speaking_part1", _("Speaking Part 1 / مصاحبه و احوال‌پرسی")
    SPEAKING_PART2_CUE_CARD = "speaking_part2_cue_card", _("Speaking Part 2 / صحبت ۲ دقیقه‌ای با کیوکارت")
    SPEAKING_PART3_DISCUSSION = "speaking_part3_discussion", _("Speaking Part 3 / بحث و تحلیل انتزاعی")


class IELTSCriteriaKey(models.TextChoices):
    TASK_ACHIEVEMENT_RESPONSE = "task_achievement_response", _("Task Achievement / Response (TA/TR)")
    COHERENCE_COHESION = "coherence_cohesion", _("Coherence & Cohesion (CC)")
    LEXICAL_RESOURCE = "lexical_resource", _("Lexical Resource (LR)")
    GRAMMATICAL_RANGE_ACCURACY = "grammatical_range_accuracy", _("Grammatical Range & Accuracy (GRA)")
    FLUENCY_COHERENCE = "fluency_coherence", _("Fluency & Coherence (FC - Speaking)")
    PRONUNCIATION = "pronunciation", _("Pronunciation (PR - Speaking)")


MANDATORY_IELTS_DISCLAIMER = "IELTS-like practice — not official IELTS / تمرین شبیه‌ساز آیلتس — غیررسمی"


class IELTSTest(models.Model):
    """
    Top-level IELTS test suite entity with immutable versioning and strict 2-person editorial review.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title_en = models.CharField(max_length=255, help_text="English title of the test")
    title_fa = models.CharField(max_length=255, help_text="عنوان فارسی آزمون")
    test_type = models.CharField(
        max_length=32,
        choices=IELTSTestType.choices,
        default=IELTSTestType.ACADEMIC,
        db_index=True,
    )
    version = models.PositiveIntegerField(
        default=1,
        help_text="شماره نسخه آزمون (افزایشی در صورت بازبینی)",
    )
    status = models.CharField(
        max_length=24,
        choices=IELTSTestStatus.choices,
        default=IELTSTestStatus.DRAFT,
        db_index=True,
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="authored_ielts_tests",
        help_text="طراح یا مؤلف اصلی محتوای آزمون",
    )
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviewed_ielts_tests",
        help_text="بازبین مستقل آزمون (باید با نویسنده متفاوت باشد)",
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    review_notes = models.TextField(blank=True, default="", help_text="یادداشت‌ها و توضیحات تأیید کیفی بازبین")
    is_locked = models.BooleanField(
        default=False,
        help_text="قفل شدن ویرایش محتوا پس از انتشار یا ثبت نخستین تلاش زبان‌آموز",
    )
    quality_checklist = models.JSONField(
        default=dict,
        blank=True,
        help_text="چک‌لیست تأیید کیفی شامل اصالت، کالیبراسیون CEFR و تایپوگرافی",
    )
    copyright_source = models.CharField(
        max_length=500,
        help_text="تأییدیه و شناسه مالکیت معنوی محتوا (تولید اختصاصی و عدم نقض کپی‌رایت کمبریج/بریتیش کانسیل)",
    )
    disclaimer_label = models.CharField(
        max_length=255,
        default=MANDATORY_IELTS_DISCLAIMER,
        help_text="سلب مسئولیت رسمی و هشدار آزمون غیررسمی",
    )
    total_duration_minutes = models.PositiveIntegerField(
        default=165,
        help_text="مدت زمان کل آزمون به دقیقه",
    )
    difficulty_level = models.CharField(
        max_length=64,
        default="Band 6.0 - 7.5",
        help_text="سطح هدف آزمون (مثلاً Band 5.5-6.5 یا 7.0-8.5)",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("IELTS Test")
        verbose_name_plural = _("IELTS Tests")

    def __str__(self):
        return f"{self.title_en} (v{self.version}) [{self.get_test_type_display()}] - {self.status}"


class IELTSSection(models.Model):
    """
    Core section of an IELTS test (Listening, Reading, Writing, Speaking).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    test = models.ForeignKey(
        IELTSTest,
        on_delete=models.CASCADE,
        related_name="sections",
    )
    section_type = models.CharField(
        max_length=24,
        choices=IELTSSectionType.choices,
        db_index=True,
    )
    order = models.PositiveSmallIntegerField(
        default=1,
        help_text="ترتیب اجرای بخش (1=Listening, 2=Reading, 3=Writing, 4=Speaking)",
    )
    duration_minutes = models.PositiveIntegerField(
        default=30,
        help_text="مدت زمان اختصاصی این بخش به دقیقه",
    )
    instructions_en = models.TextField(blank=True, default="")
    instructions_fa = models.TextField(blank=True, default="")
    audio_media_url = models.URLField(
        blank=True,
        default="",
        help_text="آدرس فایل صوتی برای Listening یا Speaking",
    )
    audio_script = models.TextField(
        blank=True,
        default="",
        help_text="متن کامل صوت (اسکریپت) برای بازبینی و تصحیح",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["test", "order"]
        unique_together = [("test", "section_type")]
        verbose_name = _("IELTS Section")
        verbose_name_plural = _("IELTS Sections")

    def __str__(self):
        return f"{self.test.title_en} - {self.get_section_type_display()} (Part {self.order})"


class IELTSPassageTask(models.Model):
    """
    Reading passage, Writing prompt/chart, Speaking cue card, or Listening section part.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    section = models.ForeignKey(
        IELTSSection,
        on_delete=models.CASCADE,
        related_name="passages_tasks",
    )
    order = models.PositiveSmallIntegerField(
        default=1,
        help_text="ترتیب در بخش (مثلاً Passage 1/2/3 یا Writing Task 1/2 یا Speaking Part 1/2/3)",
    )
    title = models.CharField(max_length=255)
    content_text = models.TextField(
        blank=True,
        default="",
        help_text="متن متن ریدینگ، موضوع انشا، سوالات لیسنینگ یا کارت اسپیکینگ",
    )
    media_image_url = models.URLField(
        blank=True,
        default="",
        help_text="نمودار تسک ۱ رایتینگ یا تصویر نقشه/دیاگرام",
    )
    word_count = models.PositiveIntegerField(
        default=0,
        help_text="تعداد کلمات متن یا حداقل کلمات مورد انتظار",
    )
    metadata = models.JSONField(
        default=dict,
        blank=True,
        help_text="تنظیمات ویژه (مثل prep_time_seconds, speaking_time_seconds)",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["section", "order"]
        verbose_name = _("IELTS Passage / Task")
        verbose_name_plural = _("IELTS Passages / Tasks")

    def __str__(self):
        return f"{self.section} -> Task/Passage {self.order}: {self.title}"


class IELTSQuestionGroup(models.Model):
    """
    Group of questions sharing instructions and shared options bank (e.g. matching headings, completion).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    passage_task = models.ForeignKey(
        IELTSPassageTask,
        on_delete=models.CASCADE,
        related_name="question_groups",
    )
    question_type = models.CharField(
        max_length=40,
        choices=IELTSQuestionType.choices,
        db_index=True,
    )
    order = models.PositiveSmallIntegerField(default=1)
    instructions = models.TextField(
        help_text="دستورالعمل سوال (مثلاً: Choose NO MORE THAN TWO WORDS from the passage)",
    )
    heading_options = models.JSONField(
        default=list,
        blank=True,
        help_text="بانک عناوین یا گزینه‌های تطبیقی (مثلاً: ['i', 'ii', 'iii', ...])",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["passage_task", "order"]
        verbose_name = _("IELTS Question Group")
        verbose_name_plural = _("IELTS Question Groups")

    def __str__(self):
        return f"{self.passage_task.title} - Group {self.order} ({self.get_question_type_display()})"


class IELTSQuestion(models.Model):
    """
    Individual question entity with prompt, choices/blanks, accepted answers, and explanation.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    group = models.ForeignKey(
        IELTSQuestionGroup,
        on_delete=models.CASCADE,
        related_name="questions",
    )
    question_number = models.PositiveIntegerField(
        help_text="شماره سراسری سوال در بخش (مثلاً ۱ تا ۴۰ در لیسنینگ یا ریدینگ)",
    )
    prompt_text = models.TextField(
        help_text="صورت سوال یا عبارت دارای جای خالی (...)",
    )
    options = models.JSONField(
        default=list,
        blank=True,
        help_text="گزینه‌های چهارجوابی (مثلاً [{'id': 'A', 'text': '...'}, ...])",
    )
    correct_answers = models.JSONField(
        default=list,
        help_text="پاسخ‌های صحیح قابل قبول (شامل انواع املاها و حروف بزرگ/کوچک)",
    )
    explanation = models.TextField(
        blank=True,
        default="",
        help_text="تحلیل تشریحی و آدرس پاسخ در متن آزمون",
    )
    max_score = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=Decimal("1.00"),
        validators=[MinValueValidator(Decimal("0.00")), MaxValueValidator(Decimal("10.00"))],
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["group", "question_number"]
        verbose_name = _("IELTS Question")
        verbose_name_plural = _("IELTS Questions")

    def __str__(self):
        return f"Q{self.question_number}: {self.prompt_text[:50]}"


class IELTSBandDescriptor(models.Model):
    """
    Official public scoring criteria and band descriptors (1.0 to 9.0) with Persian pedagogical guidance.
    Zero proprietary test text - purely criteria standards.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    criteria_key = models.CharField(
        max_length=40,
        choices=IELTSCriteriaKey.choices,
        db_index=True,
    )
    band_level = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        help_text="نمره باند (۱.۰ تا ۹.۰)",
    )
    section_type = models.CharField(
        max_length=24,
        choices=[
            ("writing", "Writing"),
            ("speaking", "Speaking"),
        ],
        db_index=True,
    )
    public_descriptor_en = models.TextField(
        help_text="متن رسمی و عمومی توصیف‌گر باند در آزمون آیلتس",
    )
    pedagogical_guidance_fa = models.TextField(
        help_text="راهنما و شاخص‌های آموزشی فارسی برای مصححان و داوطلبان",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["section_type", "criteria_key", "-band_level"]
        unique_together = [("section_type", "criteria_key", "band_level")]
        verbose_name = _("IELTS Band Descriptor")
        verbose_name_plural = _("IELTS Band Descriptors")

    def __str__(self):
        return f"{self.section_type.title()} - {self.get_criteria_key_display()} (Band {self.band_level})"


class IELTSAttemptStatus(models.TextChoices):
    IN_PROGRESS = "in_progress", _("In Progress / در حال برگزاری")
    SUBMITTED = "submitted", _("Submitted / پایان‌یافته و ثبت‌شده")
    TIMED_OUT = "timed_out", _("Timed Out / اتمام زمان قانونی")
    ABANDONED = "abandoned", _("Abandoned / رها شده")


class IELTSPracticeMode(models.TextChoices):
    FULL_SIMULATION = "full_simulation", _("Full Exam Simulation / شبیه‌ساز کامل آزمون")
    LISTENING_PRACTICE = "listening_practice", _("Listening Practice / تمرین شنیداری")
    READING_PRACTICE = "reading_practice", _("Reading Practice / تمرین درک مطلب")
    WRITING_PRACTICE = "writing_practice", _("Writing Practice / تمرین نگارش")
    SPEAKING_PRACTICE = "speaking_practice", _("Speaking Practice / تمرین مکالمه")


class IELTSTestSession(models.Model):
    """
    A learner's active or completed test-taking attempt with anti-tampering server timestamps,
    autosaved responses, section progression, raw score, scaled IELTS band score, and diagnostics.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="ielts_sessions",
        help_text="زبان‌آموز شرکت‌کننده در آزمون",
    )
    test = models.ForeignKey(
        IELTSTest,
        on_delete=models.CASCADE,
        related_name="sessions",
        help_text="نسخه آزمون آیلتس انتخاب‌شده",
    )
    mode = models.CharField(
        max_length=32,
        choices=IELTSPracticeMode.choices,
        default=IELTSPracticeMode.FULL_SIMULATION,
        db_index=True,
    )
    status = models.CharField(
        max_length=24,
        choices=IELTSAttemptStatus.choices,
        default=IELTSAttemptStatus.IN_PROGRESS,
        db_index=True,
    )
    current_section_index = models.PositiveSmallIntegerField(
        default=0,
        help_text="شاخص بخش فعلی در آزمون (0=Listening, 1=Reading, ...)",
    )
    started_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField(help_text="زمان انقضای قطعی بخش/آزمون بر اساس ساعت سرور")
    completed_at = models.DateTimeField(null=True, blank=True)
    responses = models.JSONField(
        default=dict,
        blank=True,
        help_text="پاسخ‌های زبان‌آموز به تفکیک شناسه سوال: { question_id: answer_val }",
    )
    flagged_questions = models.JSONField(
        default=list,
        blank=True,
        help_text="فهرست شناسه‌های سوالات نشانه‌گذاری‌شده برای بازبینی: [ question_id, ... ]",
    )
    section_timings = models.JSONField(
        default=dict,
        blank=True,
        help_text="تاریخچه زمان‌بندی بخش‌ها و مدت زمان سپری‌شده",
    )
    raw_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="مجموع نمرات خام کسب‌شده (مثلاً ۳۵ از ۴۰)",
    )
    scaled_band_score = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        null=True,
        blank=True,
        help_text="نمره باند استاندارد آیلتس (۱.۰ تا ۹.۰ با گام‌های ۰.۵)",
    )
    section_scores = models.JSONField(
        default=dict,
        blank=True,
        help_text="نمرات تفکیکی مهارت‌ها: { listening: { raw, band, total }, reading: ... }",
    )
    diagnostics = models.JSONField(
        default=dict,
        blank=True,
        help_text="تحلیل تشخیصی عملکرد به تفکیک فرمت سوال و سطح CEFR",
    )
    disclaimer_acknowledged = models.BooleanField(
        default=True,
        help_text="تأیید غیررسمی بودن شبیه‌ساز آیلتس توسط زبان‌آموز",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("IELTS Test Session")
        verbose_name_plural = _("IELTS Test Sessions")

    def __str__(self):
        return f"Session {self.id} - {self.learner} ({self.status})"

    @property
    def is_expired(self) -> bool:
        return timezone.now() > self.expires_at

    @property
    def time_remaining_seconds(self) -> int:
        if self.status != IELTSAttemptStatus.IN_PROGRESS:
            return 0
        rem = int((self.expires_at - timezone.now()).total_seconds())
        return max(0, rem)


class IELTSWritingSubmissionStatus(models.TextChoices):
    DRAFT = "draft", _("Draft / پیش‌نویس ذخیره‌شده")
    SUBMITTED = "submitted", _("Submitted / ارسال‌شده برای تصحیح")
    EVALUATED = "evaluated", _("Evaluated / ارزیابی‌شده")


class IELTSWritingSubmission(models.Model):
    """
    Candidate IELTS Writing submission and AI diagnostic evaluation.
    Supports both Task 1 (Report/Letter) and Task 2 (Discursive Essay),
    live word count telemetry, multi-dimensional rubric evaluation (TA/TR, CC, LR, GRA),
    uncertainty band range estimation, inline annotations, and teacher review escalation.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="ielts_writing_submissions",
        help_text="زبان‌آموز نویسنده متن",
    )
    test = models.ForeignKey(
        IELTSTest,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="writing_submissions",
        help_text="آزمون مرتبط (اختیاری در صورت تمرین مستقل)",
    )
    session = models.ForeignKey(
        IELTSTestSession,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="writing_submissions",
        help_text="جلسه آزمون مرتبط در صورت آزمون جامع",
    )
    status = models.CharField(
        max_length=24,
        choices=IELTSWritingSubmissionStatus.choices,
        default=IELTSWritingSubmissionStatus.DRAFT,
        db_index=True,
    )
    # Task 1 details
    task1_prompt_title = models.CharField(max_length=255, blank=True, default="")
    task1_prompt_text = models.TextField(blank=True, default="")
    task1_image_url = models.URLField(blank=True, default="")
    task1_text = models.TextField(blank=True, default="")
    task1_word_count = models.PositiveIntegerField(default=0)
    task1_time_seconds = models.PositiveIntegerField(default=0)
    task1_scores = models.JSONField(
        default=dict,
        blank=True,
        help_text="نمرات تفکیکی معیارهای تسک ۱: { ta: 6.5, cc: 6.0, lr: 7.0, gra: 6.5, band: 6.5 }",
    )

    # Task 2 details
    task2_prompt_title = models.CharField(max_length=255, blank=True, default="")
    task2_prompt_text = models.TextField(blank=True, default="")
    task2_text = models.TextField(blank=True, default="")
    task2_word_count = models.PositiveIntegerField(default=0)
    task2_time_seconds = models.PositiveIntegerField(default=0)
    task2_scores = models.JSONField(
        default=dict,
        blank=True,
        help_text="نمرات تفکیکی معیارهای تسک ۲: { tr: 6.5, cc: 6.5, lr: 7.0, gra: 6.0, band: 6.5 }",
    )

    # Composite & Diagnostic evaluation
    overall_band = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        null=True,
        blank=True,
        help_text="نمره باند کل بر اساس فرمول وزنی استاندارد آیلتس (یک‌سوم تسک ۱ + دوسوم تسک ۲)",
    )
    overall_band_min = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        null=True,
        blank=True,
        help_text="حداقل دامنه تخمینی باند (عدم قطعیت هوش مصنوعی)",
    )
    overall_band_max = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        null=True,
        blank=True,
        help_text="حداکثر دامنه تخمینی باند",
    )
    confidence_score = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=Decimal("0.85"),
        help_text="میزان اطمینان مدل تشخیصی به نمره تخمین‌زده‌شده (۰ تا ۱)",
    )
    cefr_level = models.CharField(
        max_length=8,
        default="B2",
        help_text="سطح معادل CEFR (مثلاً B2 یا C1)",
    )
    criteria_breakdown = models.JSONField(
        default=dict,
        blank=True,
        help_text="توصیف‌گرهای معیارها و فیدبک تشخیصی چهارگانه",
    )
    annotations = models.JSONField(
        default=list,
        blank=True,
        help_text="پیشنهادهای اصلاحی درون‌متنی، گرامر، واژگان و ساختار جملات",
    )
    pedagogical_advice = models.JSONField(
        default=list,
        blank=True,
        help_text="توصیه‌های کاربردی به فارسی برای بهبود نگارش و افزایش نمره باند",
    )
    teacher_review_requested = models.BooleanField(
        default=False,
        help_text="درخواست تصحیح و نمره‌دهی توسط اگزمینر/مدرس رسمی اندورا",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("IELTS Writing Submission")
        verbose_name_plural = _("IELTS Writing Submissions")

    def __str__(self):
        return f"Writing Submission {self.id} - {self.learner} (Band: {self.overall_band or 'Pending'})"



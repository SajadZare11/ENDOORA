from __future__ import annotations

import uuid
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone


class ContentCategory(models.TextChoices):
    LISTENING = 'listening', 'Listening'
    SPEAKING = 'speaking', 'Speaking'
    READING = 'reading', 'Reading'
    WRITING = 'writing', 'Writing'
    GRAMMAR = 'grammar', 'Grammar'
    VOCABULARY = 'vocabulary', 'Vocabulary'
    CULTURE = 'culture', 'Culture & Events'
    SCHOOL = 'school', 'School & High School (Vision / Konkur)'


class ContentType(models.TextChoices):
    ARTICLE = 'article', 'Article / Rich Guide'
    AUDIO_LESSON = 'audio_lesson', 'Audio Lesson'
    VIDEO_LESSON = 'video_lesson', 'Video Lesson'
    CULTURE_POST = 'culture_post', 'Culture / Event Post'
    SCHOOL_GUIDE = 'school_guide', 'High School / Konkur Lesson'
    PRACTICE_QUIZ = 'practice_quiz', 'Formative Practice Quiz'


class ContentStatus(models.TextChoices):
    DRAFT = 'draft', 'Draft'
    IN_REVIEW = 'in_review', 'In Review'
    PUBLISHED = 'published', 'Published'
    ARCHIVED = 'archived', 'Archived'


class LicenseType(models.TextChoices):
    ORIGINAL_EDITORIAL = 'original_editorial', 'Original Editorial (Endoora)'
    CC_BY_SA = 'cc_by_sa', 'Creative Commons Attribution-ShareAlike'
    PUBLIC_DOMAIN = 'public_domain', 'Public Domain'
    EDUCATIONAL_FAIR_USE = 'educational_fair_use', 'Educational Fair Use'


class CefrLevel(models.TextChoices):
    A1 = 'A1', 'A1 Breakthrough'
    A2 = 'A2', 'A2 Elementary'
    B1 = 'B1', 'B1 Intermediate'
    B2 = 'B2', 'B2 Upper-Intermediate'
    C1 = 'C1', 'C1 Advanced'
    C2 = 'C2', 'C2 Proficiency'
    ALL = 'ALL', 'All Levels'


class AgeBand(models.TextChoices):
    ALL = 'all', 'All Ages'
    KIDS = 'kids', 'Kids (Under 13)'
    TEENS = 'teens', 'Teens (13-17)'
    ADULTS = 'adults', 'Adults (18+)'


class SchoolGrade(models.TextChoices):
    VISION_1 = 'vision_1', 'Vision 1 (10th Grade / پایه دهم)'
    VISION_2 = 'vision_2', 'Vision 2 (11th Grade / پایه یازدهم)'
    VISION_3 = 'vision_3', 'Vision 3 (12th Grade / پایه دوازدهم)'
    KONKUR = 'konkur', 'Konkur English (کنکور سراسری)'
    NONE = 'none', 'Not School Specific'


class ContentItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(max_length=160, unique=True, db_index=True)
    title_fa = models.CharField(max_length=255)
    title_en = models.CharField(max_length=255)
    summary_fa = models.TextField(blank=True)
    summary_en = models.TextField(blank=True)

    category = models.CharField(max_length=32, choices=ContentCategory.choices, db_index=True)
    content_type = models.CharField(max_length=32, choices=ContentType.choices, default=ContentType.ARTICLE)
    status = models.CharField(max_length=16, choices=ContentStatus.choices, default=ContentStatus.DRAFT, db_index=True)
    cefr_level = models.CharField(max_length=8, choices=CefrLevel.choices, default=CefrLevel.B1, db_index=True)
    age_band = models.CharField(max_length=16, choices=AgeBand.choices, default=AgeBand.ALL)
    school_grade = models.CharField(max_length=32, choices=SchoolGrade.choices, default=SchoolGrade.NONE, db_index=True)

    # Rich Text Learning Content (Markdown supported)
    content_body_fa = models.TextField(blank=True, help_text='Persian explanation and pedagogical guidance')
    content_body_en = models.TextField(blank=True, help_text='English text, examples, and dialogues')

    # Pedagogical structure
    learning_objectives = models.JSONField(default=list, blank=True, help_text='List of pedagogical objectives')
    prerequisites = models.JSONField(default=list, blank=True, help_text='Prerequisite knowledge or slugs')

    # Multimedia attachments
    audio_url = models.URLField(max_length=500, blank=True)
    audio_duration_seconds = models.PositiveIntegerField(default=0)
    audio_transcript_fa = models.TextField(blank=True)
    audio_transcript_en = models.TextField(blank=True)

    video_url = models.URLField(max_length=500, blank=True)
    video_duration_seconds = models.PositiveIntegerField(default=0)
    video_captions = models.TextField(blank=True, help_text='SRT or VTT formatted captions')

    # Downloadable resources (PDF, audio, worksheets)
    downloadable_resources = models.JSONField(
        default=list,
        blank=True,
        help_text='List of objects with title_fa, title_en, file_url, file_size_bytes, file_type'
    )

    # Formative Quizzes (questions, options, correct_index, explanation)
    quiz_data = models.JSONField(
        default=list,
        blank=True,
        help_text='List of quiz items with prompt_fa, prompt_en, options, correct_index, explanation_fa, explanation_en'
    )

    # Paywall & Free Preview
    is_premium = models.BooleanField(default=False, help_text='Requires active subscription if True')
    free_preview_excerpt_fa = models.TextField(blank=True, help_text='Public teaser/preview in Persian')
    free_preview_excerpt_en = models.TextField(blank=True, help_text='Public teaser/preview in English')

    # Mandatory Copyright and Attribution (Rule & Quality Contract)
    source_attribution = models.CharField(max_length=255, help_text='Author/Source attribution')
    license_type = models.CharField(max_length=32, choices=LicenseType.choices, default=LicenseType.ORIGINAL_EDITORIAL)
    author_name = models.CharField(max_length=128, default='Endoora Editorial Team')

    # Recommendations & Meta
    tags = models.JSONField(default=list, blank=True)
    view_count = models.PositiveIntegerField(default=0)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='authored_contents'
    )
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_at', '-created_at']
        verbose_name = 'Content Item'
        verbose_name_plural = 'Content Items'

    def clean(self):
        super().clean()
        if not self.source_attribution or not self.source_attribution.strip():
            raise ValidationError({'source_attribution': 'Copyright source attribution is mandatory.'})
        if not self.author_name or not self.author_name.strip():
            raise ValidationError({'author_name': 'Author name is mandatory for copyright integrity.'})
        if self.status == ContentStatus.PUBLISHED and not self.published_at:
            self.published_at = timezone.now()

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'[{self.category}] {self.title_fa} ({self.cefr_level})'


class ContentReviewLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content_item = models.ForeignKey(ContentItem, on_delete=models.CASCADE, related_name='review_logs')
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    previous_status = models.CharField(max_length=16, choices=ContentStatus.choices)
    new_status = models.CharField(max_length=16, choices=ContentStatus.choices)
    editorial_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Review: {self.content_item.slug} ({self.previous_status} -> {self.new_status})'

from __future__ import annotations

import uuid
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
from content.models import ContentCategory, ContentStatus, CefrLevel, LicenseType


class TargetAudience(models.TextChoices):
    GENERAL = 'general', 'General English Learners'
    SCHOOL_KONKUR = 'school_konkur', 'Iranian High School & Konkur'
    IELTS_ACADEMIC = 'ielts_academic', 'IELTS & Academic Prep'
    BUSINESS = 'business', 'Business & Career English'


class Course(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(max_length=160, unique=True, db_index=True)
    title_fa = models.CharField(max_length=255)
    title_en = models.CharField(max_length=255)
    description_fa = models.TextField(blank=True)
    description_en = models.TextField(blank=True)

    skill_category = models.CharField(max_length=32, choices=ContentCategory.choices, db_index=True)
    cefr_level = models.CharField(max_length=8, choices=CefrLevel.choices, default=CefrLevel.B1, db_index=True)
    target_audience = models.CharField(max_length=32, choices=TargetAudience.choices, default=TargetAudience.GENERAL, db_index=True)

    status = models.CharField(max_length=16, choices=ContentStatus.choices, default=ContentStatus.DRAFT, db_index=True)
    is_premium = models.BooleanField(default=True, help_text='Premium course requiring subscription entitlement')

    thumbnail_url = models.URLField(max_length=500, blank=True)
    estimated_hours = models.PositiveIntegerField(default=10)

    # Mandatory copyright metadata
    source_attribution = models.CharField(max_length=255, default='Endoora Curriculum Team')
    license_type = models.CharField(max_length=32, choices=LicenseType.choices, default=LicenseType.ORIGINAL_EDITORIAL)
    author_name = models.CharField(max_length=128, default='Endoora Academic Board')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-published_at', '-created_at']
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'

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
        return f'{self.title_fa} ({self.cefr_level})'


class Module(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title_fa = models.CharField(max_length=255)
    title_en = models.CharField(max_length=255)
    description_fa = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['order']
        unique_together = [('course', 'order')]

    def __str__(self):
        return f'{self.course.title_fa} - فصل {self.order}: {self.title_fa}'


class Lesson(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    title_fa = models.CharField(max_length=255)
    title_en = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=1)
    duration_minutes = models.PositiveIntegerField(default=15)

    is_free_preview = models.BooleanField(default=False, help_text='If True, accessible even without premium entitlement')

    # Rich lesson contents
    content_body_fa = models.TextField(blank=True)
    content_body_en = models.TextField(blank=True)
    video_url = models.URLField(max_length=500, blank=True)
    audio_url = models.URLField(max_length=500, blank=True)
    transcript_fa = models.TextField(blank=True)
    transcript_en = models.TextField(blank=True)

    # Formative interactive quiz
    quiz_data = models.JSONField(default=list, blank=True)
    downloadable_resources = models.JSONField(default=list, blank=True)

    # Free preview excerpt (returned when paywalled)
    free_preview_excerpt_fa = models.TextField(blank=True)
    free_preview_excerpt_en = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']
        unique_together = [('module', 'order')]

    def __str__(self):
        return f'{self.module.course.title_fa} - درس {self.order}: {self.title_fa}'


class LearnerCourseEnrollment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    learner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='course_enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    progress_percent = models.PositiveIntegerField(default=0)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = [('learner', 'course')]
        ordering = ['-enrolled_at']

    def __str__(self):
        return f'{self.learner} in {self.course.title_fa} ({self.progress_percent}%)'


class LearnerLessonProgress(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    learner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='lesson_progresses')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='learner_completions')
    is_completed = models.BooleanField(default=False)
    quiz_score = models.FloatField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = [('learner', 'lesson')]

    def __str__(self):
        return f'{self.learner} - {self.lesson.title_fa} (Done: {self.is_completed})'

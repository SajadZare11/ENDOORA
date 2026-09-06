from __future__ import annotations

import uuid
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

from .pii_scanner import assert_no_pii


class PostType(models.TextChoices):
    LEARNER_POST = 'learner_post', 'Learner Post'
    TEACHER_EXPERIENCE = 'teacher_experience', 'Teacher Experience'
    LESSON_PLAN = 'lesson_plan', 'Lesson Plan & Pedagogical Resource'
    QUESTION = 'question', 'Question & Help'
    RESOURCE = 'resource', 'Community Resource'


class PostAudience(models.TextChoices):
    ALL = 'all', 'All Community'
    LEARNERS = 'learners', 'Learners Only'
    TEACHERS = 'teachers', 'Teachers Only'


class PostStatus(models.TextChoices):
    DRAFT = 'draft', 'Draft'
    PENDING_REVIEW = 'pending_review', 'Pending Review'
    PUBLISHED = 'published', 'Published'
    HIDDEN = 'hidden', 'Hidden'
    REMOVED = 'removed', 'Removed by Moderation'


class LicenseType(models.TextChoices):
    ORIGINAL_EDITORIAL = 'original_editorial', 'Original Editorial (Endoora)'
    CC_BY_SA = 'cc_by_sa', 'Creative Commons Attribution-ShareAlike (CC BY-SA 4.0)'
    CC_BY = 'cc_by', 'Creative Commons Attribution (CC BY 4.0)'
    PUBLIC_DOMAIN = 'public_domain', 'Public Domain / CC0'
    EDUCATIONAL_FAIR_USE = 'educational_fair_use', 'Educational Fair Use'


class CommunityPost(models.Model):
    ALLOWED_RESOURCE_FORMATS = {'pdf', 'docx', 'epub', 'zip', 'mp3'}

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='community_posts'
    )
    author_name = models.CharField(max_length=128)
    author_role = models.CharField(max_length=32, default='learner')
    is_verified_teacher = models.BooleanField(
        default=False,
        help_text='Teacher verification badge verified by platform credentials'
    )

    post_type = models.CharField(
        max_length=32,
        choices=PostType.choices,
        default=PostType.LEARNER_POST,
        db_index=True
    )
    audience = models.CharField(
        max_length=16,
        choices=PostAudience.choices,
        default=PostAudience.ALL,
        db_index=True
    )
    status = models.CharField(
        max_length=16,
        choices=PostStatus.choices,
        default=PostStatus.PUBLISHED,
        db_index=True
    )

    title_fa = models.CharField(max_length=255)
    title_en = models.CharField(max_length=255, blank=True)
    content_fa = models.TextField(help_text='Main content in Persian')
    content_en = models.TextField(blank=True, help_text='English text or translation')

    tags = models.JSONField(default=list, blank=True)

    # Multimedia attachments: list of {url, file_type, file_size, caption, alt_text}
    media_attachments = models.JSONField(
        default=list,
        blank=True,
        help_text='Media attachments with mandatory alt_text and caption'
    )

    # Lesson plan and pedagogical resource upload metadata
    lesson_plan_metadata = models.JSONField(
        default=dict,
        blank=True,
        help_text='Lesson plan metadata: license_type, copyright_attribution, file_url, file_format, grade_level'
    )

    # Monthly Featured Selection (Strictly editorial review, not popularity alone)
    is_monthly_featured = models.BooleanField(default=False, db_index=True)
    featured_at = models.DateTimeField(null=True, blank=True)
    featured_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='featured_community_posts'
    )
    editorial_review_notes = models.TextField(blank=True)

    # Engagement counters (cached for fast rendering)
    view_count = models.PositiveIntegerField(default=0)
    reactions_count = models.PositiveIntegerField(default=0)
    comments_count = models.PositiveIntegerField(default=0)

    # Safety & Minor Protection
    is_suitable_for_minors = models.BooleanField(
        default=True,
        help_text='True if suitable for all learners including minors'
    )
    is_pinned = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_pinned', '-created_at']
        verbose_name = 'Community Post'
        verbose_name_plural = 'Community Posts'

    def clean(self):
        super().clean()

        # 1. PII scanner on text content
        assert_no_pii(self.title_fa, 'title_fa')
        if self.title_en:
            assert_no_pii(self.title_en, 'title_en')
        assert_no_pii(self.content_fa, 'content_fa')
        if self.content_en:
            assert_no_pii(self.content_en, 'content_en')

        # 2. Teacher Verification for Teacher Experience
        if self.post_type == PostType.TEACHER_EXPERIENCE:
            if not self.is_verified_teacher and self.author_role != 'teacher':
                raise ValidationError({
                    'post_type': 'ثبت "تجربه استاد" فقط برای مدرسان تأییدشده ممکن است. لطفاً مدرک تدریس خود را در پنل ثبت کنید.'
                })

        # 3. Lesson Plan Upload & Copyright Validation
        if self.post_type == PostType.LESSON_PLAN:
            meta = self.lesson_plan_metadata or {}
            license_type = meta.get('license_type')
            attribution = meta.get('copyright_attribution')
            if not license_type:
                raise ValidationError({
                    'lesson_plan_metadata': 'انتخاب نوع لایسنس برای طرح درس یا منبع آموزشی الزامی است.'
                })
            if not attribution or not str(attribution).strip():
                raise ValidationError({
                    'lesson_plan_metadata': 'ذکر نام مؤلف و منبع حقوقی در بخش انتساب کپی‌رایت الزامی است.'
                })
            file_format = meta.get('file_format', '').lower().strip('.')
            if file_format and file_format not in self.ALLOWED_RESOURCE_FORMATS:
                raise ValidationError({
                    'lesson_plan_metadata': f'فرمت فایل نامعتبر است. فرمت‌های مجاز: {", ".join(sorted(self.ALLOWED_RESOURCE_FORMATS))}'
                })

        # 4. Mandatory Alt-Text and Caption for Media Attachments
        if self.media_attachments and isinstance(self.media_attachments, list):
            for idx, media in enumerate(self.media_attachments):
                if isinstance(media, dict):
                    alt_text = media.get('alt_text', '').strip()
                    caption = media.get('caption', '').strip()
                    if not alt_text:
                        raise ValidationError({
                            'media_attachments': f'فایل رسانه پیوست شماره {idx + 1} فاقد متن جایگزین (alt text) جهت دسترسی‌پذیری است.'
                        })
                    if not caption:
                        raise ValidationError({
                            'media_attachments': f'فایل رسانه پیوست شماره {idx + 1} فاقد زیرنویس (caption) است.'
                        })

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'[{self.post_type}] {self.title_fa} by {self.author_name}'


class PostComment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey(
        CommunityPost,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies'
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='community_comments'
    )
    author_name = models.CharField(max_length=128)
    content = models.TextField()
    status = models.CharField(
        max_length=16,
        choices=PostStatus.choices,
        default=PostStatus.PUBLISHED,
        db_index=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

    def clean(self):
        super().clean()
        assert_no_pii(self.content, 'content')

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Comment by {self.author_name} on {self.post_id}'


class PostReaction(models.Model):
    class ReactionType(models.TextChoices):
        LIKE = 'like', 'مفید و لایک'
        HELPFUL = 'helpful', 'راهگشا و کاربردی'
        INSPIRING = 'inspiring', 'الهام‌بخش'
        INSIGHTFUL = 'insightful', 'عمیق و نکته‌آموز'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey(
        CommunityPost,
        on_delete=models.CASCADE,
        related_name='reactions'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='community_reactions'
    )
    reaction_type = models.CharField(
        max_length=16,
        choices=ReactionType.choices,
        default=ReactionType.LIKE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'user', 'reaction_type')

    def __str__(self):
        return f'{self.user_id} reacted {self.reaction_type} to {self.post_id}'


class UserBlock(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    blocker = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='blocked_users'
    )
    blocked_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='blocked_by_users'
    )
    reason = models.CharField(max_length=255, blank=True)
    is_mute_only = models.BooleanField(
        default=False,
        help_text='True if muted rather than fully blocked'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('blocker', 'blocked_user')

    def clean(self):
        if self.blocker_id == self.blocked_user_id:
            raise ValidationError({'blocked_user': 'کاربر نمی‌تواند خود را مسدود کند.'})

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        action = 'Muted' if self.is_mute_only else 'Blocked'
        return f'{self.blocker_id} {action} {self.blocked_user_id}'

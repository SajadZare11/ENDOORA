from __future__ import annotations

import re
from rest_framework import serializers
from .models import (
    ContentItem,
    ContentReviewLog,
    ContentCategory,
    ContentType,
    ContentStatus,
    CefrLevel,
    SchoolGrade,
    LicenseType,
    AgeBand,
)


class ContentItemSummarySerializer(serializers.ModelSerializer):
    duration_minutes = serializers.SerializerMethodField()

    class Meta:
        model = ContentItem
        fields = [
            "id",
            "slug",
            "title_fa",
            "title_en",
            "summary_fa",
            "summary_en",
            "category",
            "content_type",
            "status",
            "cefr_level",
            "age_band",
            "school_grade",
            "is_premium",
            "duration_minutes",
            "author_name",
            "source_attribution",
            "license_type",
            "tags",
            "published_at",
        ]

    def get_duration_minutes(self, obj: ContentItem) -> int:
        if obj.content_type == ContentType.ARTICLE:
            return 5
        sec = obj.audio_duration_seconds or obj.video_duration_seconds
        return max(1, sec // 60) if sec else 5


class ContentReviewInputSerializer(serializers.Serializer):
    new_status = serializers.ChoiceField(choices=ContentStatus.choices)
    notes = serializers.CharField(required=False, allow_blank=True, default="")


class ContentItemEditorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentItem
        fields = [
            "id",
            "slug",
            "title_fa",
            "title_en",
            "summary_fa",
            "summary_en",
            "category",
            "content_type",
            "status",
            "cefr_level",
            "age_band",
            "school_grade",
            "content_body_fa",
            "content_body_en",
            "learning_objectives",
            "prerequisites",
            "audio_url",
            "audio_duration_seconds",
            "audio_transcript_fa",
            "audio_transcript_en",
            "video_url",
            "video_duration_seconds",
            "video_captions",
            "downloadable_resources",
            "quiz_data",
            "is_premium",
            "free_preview_excerpt_fa",
            "free_preview_excerpt_en",
            "source_attribution",
            "license_type",
            "author_name",
            "tags",
            "view_count",
            "published_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "view_count", "published_at", "created_at", "updated_at"]

    def validate_slug(self, value: str) -> str:
        val = value.strip().lower()
        if not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", val):
            raise serializers.ValidationError("شناسه باید فقط شامل حروف انگلیسی کوچک، اعداد و خط تیره باشد.")
        qs = ContentItem.objects.filter(slug=val)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("این شناسه قبلاً برای محتوای دیگری ثبت شده است.")
        return val

    def validate_title_fa(self, value: str) -> str:
        if not value or not value.strip():
            raise serializers.ValidationError("عنوان فارسی محتوا الزامی است.")
        return value.strip()

    def validate_title_en(self, value: str) -> str:
        if not value or not value.strip():
            raise serializers.ValidationError("English title is required.")
        return value.strip()

    def validate_source_attribution(self, value: str) -> str:
        if not value or not value.strip():
            raise serializers.ValidationError("ذکر منبع و اطلاعات حق نشر (Source Attribution) الزامی است.")
        return value.strip()

    def validate_author_name(self, value: str) -> str:
        if not value or not value.strip():
            raise serializers.ValidationError("نام پدیدآورنده یا هیئت علمی الزامی است.")
        return value.strip()


class ContentItemTransitionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=["submit_review", "publish", "archive", "revert_draft"])
    note = serializers.CharField(required=False, allow_blank=True, default="")

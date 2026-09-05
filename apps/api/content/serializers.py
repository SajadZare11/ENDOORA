from __future__ import annotations

from rest_framework import serializers
from .models import ContentItem, ContentReviewLog, ContentCategory, ContentType, ContentStatus, CefrLevel, SchoolGrade


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

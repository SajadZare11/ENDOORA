from __future__ import annotations

from rest_framework import serializers
from .models import Course, Module, Lesson, LearnerCourseEnrollment, LearnerLessonProgress


class CourseListSerializer(serializers.ModelSerializer):
    total_modules = serializers.IntegerField(source="modules.count", read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "slug",
            "title_fa",
            "title_en",
            "description_fa",
            "description_en",
            "skill_category",
            "cefr_level",
            "target_audience",
            "is_premium",
            "estimated_hours",
            "thumbnail_url",
            "total_modules",
            "author_name",
            "source_attribution",
            "license_type",
            "published_at",
        ]


class LessonCompletionInputSerializer(serializers.Serializer):
    quiz_score = serializers.FloatField(required=False, allow_null=True)

from __future__ import annotations

from rest_framework import serializers
from content.models import CefrLevel, ContentCategory, ContentStatus, LicenseType
from .models import Course, Module, Lesson, TargetAudience


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
            "status",
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


class LessonEditorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = [
            "id",
            "module",
            "title_fa",
            "title_en",
            "order",
            "duration_minutes",
            "is_free_preview",
            "content_body_fa",
            "content_body_en",
            "video_url",
            "audio_url",
            "transcript_fa",
            "transcript_en",
            "quiz_data",
            "downloadable_resources",
            "free_preview_excerpt_fa",
            "free_preview_excerpt_en",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_title_fa(self, value: str) -> str:
        if not value or not value.strip():
            raise serializers.ValidationError("عنوان فارسی درس الزامی است.")
        return value.strip()

    def validate_title_en(self, value: str) -> str:
        if not value or not value.strip():
            raise serializers.ValidationError("English lesson title is required.")
        return value.strip()


class ModuleEditorSerializer(serializers.ModelSerializer):
    lessons = LessonEditorSerializer(many=True, read_only=True)
    lessons_count = serializers.IntegerField(source="lessons.count", read_only=True)

    class Meta:
        model = Module
        fields = [
            "id",
            "course",
            "title_fa",
            "title_en",
            "description_fa",
            "description_en",
            "order",
            "lessons",
            "lessons_count",
        ]
        read_only_fields = ["id", "lessons", "lessons_count"]

    def validate_title_fa(self, value: str) -> str:
        if not value or not value.strip():
            raise serializers.ValidationError("عنوان فارسی فصل الزامی است.")
        return value.strip()

    def validate_title_en(self, value: str) -> str:
        if not value or not value.strip():
            raise serializers.ValidationError("English module title is required.")
        return value.strip()


class CourseEditorSerializer(serializers.ModelSerializer):
    modules = ModuleEditorSerializer(many=True, read_only=True)
    total_modules = serializers.SerializerMethodField()
    total_lessons = serializers.SerializerMethodField()
    free_preview_count = serializers.SerializerMethodField()
    total_duration_minutes = serializers.SerializerMethodField()
    enrollment_count = serializers.SerializerMethodField()

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
            "status",
            "is_premium",
            "thumbnail_url",
            "estimated_hours",
            "source_attribution",
            "license_type",
            "author_name",
            "created_at",
            "updated_at",
            "published_at",
            "modules",
            "total_modules",
            "total_lessons",
            "free_preview_count",
            "total_duration_minutes",
            "enrollment_count",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "published_at", "modules"]

    def get_total_modules(self, obj: Course) -> int:
        return obj.modules.count()

    def get_total_lessons(self, obj: Course) -> int:
        return Lesson.objects.filter(module__course=obj).count()

    def get_free_preview_count(self, obj: Course) -> int:
        return Lesson.objects.filter(module__course=obj, is_free_preview=True).count()

    def get_total_duration_minutes(self, obj: Course) -> int:
        from django.db.models import Sum
        total = Lesson.objects.filter(module__course=obj).aggregate(Sum("duration_minutes"))["duration_minutes__sum"]
        return total or 0

    def get_enrollment_count(self, obj: Course) -> int:
        return obj.enrollments.count()

    def validate_slug(self, value: str) -> str:
        import re
        val = value.strip().lower()
        if not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", val):
            raise serializers.ValidationError("شناسه باید فقط شامل حروف انگلیسی کوچک، اعداد و خط تیره باشد.")
        # Check uniqueness on create or when slug changed
        qs = Course.objects.filter(slug=val)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("این شناسه دوره قبلاً ثبت شده است.")
        return val

    def validate_title_fa(self, value: str) -> str:
        if not value or not value.strip():
            raise serializers.ValidationError("عنوان فارسی دوره الزامی است.")
        return value.strip()

    def validate_title_en(self, value: str) -> str:
        if not value or not value.strip():
            raise serializers.ValidationError("English course title is required.")
        return value.strip()

    def validate_source_attribution(self, value: str) -> str:
        if not value or not value.strip():
            raise serializers.ValidationError("ذکر منبع و مشخصات حق تألیف الزامی است.")
        return value.strip()

    def validate_author_name(self, value: str) -> str:
        if not value or not value.strip():
            raise serializers.ValidationError("نام نویسنده یا هیئت علمی پدیدآورنده الزامی است.")
        return value.strip()


class CourseTransitionInputSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=["submit_review", "publish", "archive", "revert_draft"])
    note = serializers.CharField(required=False, allow_blank=True, default="")

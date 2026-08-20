from __future__ import annotations

from rest_framework import serializers

from .models import QuestionMedia, QuestionVersion


def _requested_locale(context) -> str:
    request = context.get("request")
    if request and request.query_params.get("lang") == "en":
        return "en"
    return "fa"


class LearnerMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionMedia
        fields = (
            "id",
            "media_type",
            "asset_url",
            "mime_type",
            "duration_seconds",
            "alt_text_fa",
            "alt_text_en",
            "transcript_fa",
            "transcript_en",
        )


class QuestionVersionLearnerSerializer(serializers.ModelSerializer):
    question_id = serializers.UUIDField(read_only=True)
    question_slug = serializers.CharField(source="question.slug", read_only=True)
    display_title = serializers.SerializerMethodField()
    display_instructions = serializers.SerializerMethodField()
    objectives = serializers.SerializerMethodField()
    media = serializers.SerializerMethodField()

    class Meta:
        model = QuestionVersion
        fields = (
            "id",
            "question_id",
            "question_slug",
            "version_number",
            "question_type",
            "display_title",
            "display_instructions",
            "prompt_fa",
            "prompt_en",
            "cefr_level",
            "difficulty",
            "learner_payload",
            "objectives",
            "media",
        )

    def get_display_title(self, obj):
        locale = _requested_locale(self.context)
        return obj.title_en if locale == "en" else obj.title_fa or obj.title_en

    def get_display_instructions(self, obj):
        locale = _requested_locale(self.context)
        return (
            obj.instructions_en
            if locale == "en"
            else obj.instructions_fa or obj.instructions_en
        )

    def get_objectives(self, obj):
        return [
            {
                "id": str(link.objective_id),
                "slug": link.objective.slug,
                "label_fa": link.objective.label_fa,
                "label_en": link.objective.label_en,
                "is_primary": link.is_primary,
            }
            for link in obj.objective_links.all()
        ]

    def get_media(self, obj):
        visible = [item for item in obj.media.all() if item.is_learner_visible]
        return LearnerMediaSerializer(visible, many=True).data


class QuestionVersionEditorSerializer(serializers.ModelSerializer):
    question_id = serializers.UUIDField(read_only=True)
    question_slug = serializers.CharField(source="question.slug", read_only=True)
    objectives = serializers.SerializerMethodField()
    media = LearnerMediaSerializer(many=True, read_only=True)

    class Meta:
        model = QuestionVersion
        fields = (
            "id",
            "question_id",
            "question_slug",
            "version_number",
            "question_type",
            "status",
            "title_fa",
            "title_en",
            "prompt_fa",
            "prompt_en",
            "instructions_fa",
            "instructions_en",
            "cefr_level",
            "difficulty",
            "learner_payload",
            "answer_key",
            "accepted_variants",
            "explanation_fa",
            "explanation_en",
            "rubric",
            "source_origin",
            "source_title",
            "source_url",
            "license_type",
            "license_reference",
            "rights_holder",
            "author_id",
            "reviewer_id",
            "reviewed_at",
            "published_at",
            "retired_at",
            "content_hash",
            "objectives",
            "media",
        )

    def get_objectives(self, obj):
        return [
            {
                "id": str(link.objective_id),
                "slug": link.objective.slug,
                "label_fa": link.objective.label_fa,
                "label_en": link.objective.label_en,
                "is_primary": link.is_primary,
            }
            for link in obj.objective_links.all()
        ]

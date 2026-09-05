from rest_framework import serializers
from .models import WritingDraft, WritingAnalysis


class WritingDraftSerializer(serializers.ModelSerializer):
    class Meta:
        model = WritingDraft
        fields = [
            "id",
            "prompt_id",
            "prompt_title",
            "prompt_text",
            "target_cefr",
            "mode",
            "text",
            "word_count",
            "version",
            "parent_draft",
            "status",
            "time_spent_seconds",
            "is_shared_with_teacher",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "word_count",
            "version",
            "status",
            "created_at",
            "updated_at",
        ]


class WritingAnalysisSerializer(serializers.ModelSerializer):
    draft_id = serializers.IntegerField(source="draft.id", read_only=True)

    class Meta:
        model = WritingAnalysis
        fields = [
            "id",
            "draft_id",
            "strengths_summary_fa",
            "strengths_summary_en",
            "top_priorities_fa",
            "top_priorities_en",
            "estimated_cefr_range",
            "ielts_scores",
            "error_annotations",
            "graduated_rewrites",
            "revision_tasks",
            "disclaimer_fa",
            "disclaimer_en",
            "created_at",
        ]


class WritingDraftDetailSerializer(serializers.ModelSerializer):
    analysis = WritingAnalysisSerializer(read_only=True)
    revisions = WritingDraftSerializer(many=True, read_only=True)

    class Meta:
        model = WritingDraft
        fields = [
            "id",
            "prompt_id",
            "prompt_title",
            "prompt_text",
            "target_cefr",
            "mode",
            "text",
            "word_count",
            "version",
            "parent_draft",
            "status",
            "time_spent_seconds",
            "is_shared_with_teacher",
            "analysis",
            "revisions",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "word_count",
            "version",
            "status",
            "analysis",
            "revisions",
            "created_at",
            "updated_at",
        ]

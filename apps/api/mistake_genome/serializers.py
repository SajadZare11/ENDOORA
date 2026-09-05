"""
Endoora AI Mistake Genome - Serializers
Serializes patterns, evidence records, disputes, and aggregated summaries.
"""

from rest_framework import serializers

from .models import (
    LearnerMistakePattern,
    MistakeCategory,
    MistakeEvidence,
    MistakeSeverity,
    MistakeStatus,
)


class MistakeEvidenceSerializer(serializers.ModelSerializer):
    """Serializes an individual factual evidence event for a pattern."""

    class Meta:
        model = MistakeEvidence
        fields = [
            "id",
            "source_activity",
            "source_id",
            "raw_mistake_snippet",
            "correction_snippet",
            "explanation_fa",
            "explanation_en",
            "is_scrubbed",
            "created_at",
        ]
        read_only_fields = fields


class LearnerMistakePatternSerializer(serializers.ModelSerializer):
    """Serializes a learner's aggregated mistake pattern."""

    evidence_records = MistakeEvidenceSerializer(many=True, read_only=True)

    class Meta:
        model = LearnerMistakePattern
        fields = [
            "id",
            "tag",
            "category",
            "title_fa",
            "title_en",
            "description_fa",
            "description_en",
            "l1_interference_note_fa",
            "l1_interference_note_en",
            "status",
            "severity",
            "evidence_count",
            "is_disputed",
            "dispute_reason",
            "disputed_at",
            "first_seen_at",
            "last_seen_at",
            "evidence_records",
        ]
        read_only_fields = [
            "id",
            "status",
            "evidence_count",
            "is_disputed",
            "disputed_at",
            "first_seen_at",
            "last_seen_at",
            "evidence_records",
        ]


class MistakeDisputeRequestSerializer(serializers.Serializer):
    """Validates dispute submission when a learner challenges a pattern classification."""

    reason = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=500,
        default="",
        help_text="Optional reason (e.g. 'این صرفاً یک اشتباه تایپی لحظه‌ای بود')",
    )


class MistakeRecordRequestSerializer(serializers.Serializer):
    """Payload to record a detected mistake from any learning activity."""

    tag = serializers.CharField(max_length=120)
    category = serializers.ChoiceField(
        choices=MistakeCategory.choices, default=MistakeCategory.GRAMMAR
    )
    title_fa = serializers.CharField(max_length=200, required=False, default="")
    title_en = serializers.CharField(max_length=200, required=False, default="")
    source_activity = serializers.CharField(max_length=50, default="exercise")
    source_id = serializers.CharField(max_length=100, required=False, default="")
    raw_snippet = serializers.CharField(max_length=500, required=False, default="")
    correction_snippet = serializers.CharField(max_length=500, required=False, default="")
    explanation_fa = serializers.CharField(required=False, default="")
    explanation_en = serializers.CharField(required=False, default="")
    severity = serializers.ChoiceField(
        choices=MistakeSeverity.choices, default=MistakeSeverity.MODERATE
    )
    l1_note_fa = serializers.CharField(required=False, default="")
    l1_note_en = serializers.CharField(required=False, default="")

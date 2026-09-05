from rest_framework import serializers
from .models import SrsCandidate, SrsItem, SrsReview


class SrsCandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SrsCandidate
        fields = [
            "id",
            "term",
            "lemma",
            "part_of_speech",
            "meaning_fa",
            "example_sentence",
            "source_text",
            "source_type",
            "source_id",
            "phonetic",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class CandidateApproveSerializer(serializers.Serializer):
    custom_meaning = serializers.CharField(required=False, allow_blank=True)
    custom_example = serializers.CharField(required=False, allow_blank=True)


class ExtractWordsSerializer(serializers.Serializer):
    text = serializers.CharField(min_length=3, max_length=5000)
    source_type = serializers.CharField(required=False, default="activity", max_length=50)
    source_id = serializers.CharField(required=False, allow_blank=True, default="")


class SrsItemSerializer(serializers.ModelSerializer):
    next_intervals = serializers.SerializerMethodField()

    class Meta:
        model = SrsItem
        fields = [
            "id",
            "term",
            "lemma",
            "part_of_speech",
            "sense_id",
            "meaning_fa",
            "example_sentence",
            "collocation_fa",
            "collocation_en",
            "phonetic",
            "audio_url",
            "source_text",
            "source_type",
            "objective_id",
            "status",
            "interval_days",
            "repetition",
            "ease_factor",
            "lapse_count",
            "is_leech",
            "leech_action",
            "due_at",
            "last_reviewed_at",
            "next_intervals",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "interval_days",
            "repetition",
            "ease_factor",
            "lapse_count",
            "is_leech",
            "leech_action",
            "due_at",
            "next_intervals",
            "created_at",
            "updated_at",
        ]

    def get_next_intervals(self, obj: SrsItem) -> dict:
        return obj.calculate_next_intervals()


class SrsItemEditSerializer(serializers.Serializer):
    meaning_fa = serializers.CharField(required=False, allow_blank=True)
    example_sentence = serializers.CharField(required=False, allow_blank=True)


class SrsReviewSubmitSerializer(serializers.Serializer):
    item_id = serializers.IntegerField()
    rating = serializers.IntegerField(min_value=1, max_value=4)
    response_time_ms = serializers.IntegerField(required=False, min_value=0, allow_null=True)


class SrsStatsSerializer(serializers.Serializer):
    total_cards = serializers.IntegerField()
    due_count = serializers.IntegerField()
    learning_count = serializers.IntegerField()
    review_count = serializers.IntegerField()
    mastered_count = serializers.IntegerField()
    leeches_count = serializers.IntegerField()
    pending_candidates_count = serializers.IntegerField()

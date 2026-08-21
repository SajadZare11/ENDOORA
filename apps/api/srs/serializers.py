from rest_framework import serializers
from .models import SrsItem


class SrsItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SrsItem
        fields = [
            "id",
            "term",
            "meaning_fa",
            "objective_id",
            "status",
            "interval_days",
            "due_at",
        ]


class SrsReviewSerializer(serializers.Serializer):
    item_id = serializers.IntegerField()
    rating = serializers.IntegerField(min_value=1, max_value=5)

from rest_framework import serializers

from .models import XPCategory, XPTransaction


class XPTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = XPTransaction
        fields = [
            "id",
            "amount",
            "category",
            "reason",
            "source_event",
            "created_at",
        ]
        read_only_fields = fields


class LevelCatalogItemSerializer(serializers.Serializer):
    level = serializers.IntegerField()
    threshold_xp = serializers.IntegerField()
    title_en = serializers.CharField()
    title_fa = serializers.CharField()


class GamificationSummarySerializer(serializers.Serializer):
    total_xp = serializers.IntegerField()
    current_level = serializers.IntegerField()
    level_title_en = serializers.CharField()
    level_title_fa = serializers.CharField()
    current_threshold = serializers.IntegerField()
    next_threshold = serializers.IntegerField()
    xp_to_next_level = serializers.IntegerField()
    progress_percent = serializers.IntegerField()
    current_streak = serializers.IntegerField()
    longest_streak = serializers.IntegerField()
    freeze_credits_remaining = serializers.IntegerField()
    is_streak_active_today = serializers.BooleanField()
    last_activity_date = serializers.CharField(allow_null=True)
    recent_transactions = XPTransactionSerializer(many=True, read_only=True)
    levels_catalog = LevelCatalogItemSerializer(many=True, read_only=True)
    rule_7_disclaimer_fa = serializers.CharField()
    rule_7_disclaimer_en = serializers.CharField()
    rule_8_disclaimer_fa = serializers.CharField()
    rule_8_disclaimer_en = serializers.CharField()


class AwardXPRequestSerializer(serializers.Serializer):
    amount = serializers.IntegerField(min_value=1, max_value=500)
    category = serializers.ChoiceField(choices=XPCategory.choices, default=XPCategory.MISSION)
    reason = serializers.CharField(max_length=255)
    source_event = serializers.CharField(max_length=255)
    metadata = serializers.DictField(required=False, default=dict)

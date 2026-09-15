from __future__ import annotations

from rest_framework import serializers

from analytics.models import FunnelDefinition, ProductAnalyticsEvent
from analytics.services.event_service import BOUNDED_EVENT_CHOICES


class TrackEventInputSerializer(serializers.Serializer):
    event_name = serializers.CharField(max_length=64)
    session_id = serializers.CharField(max_length=64, required=False, default="", allow_blank=True)
    properties = serializers.DictField(required=False, default=dict)
    locale = serializers.CharField(max_length=8, required=False, default="fa")

    def validate_event_name(self, value: str) -> str:
        name = value.strip()
        if name not in BOUNDED_EVENT_CHOICES:
            raise serializers.ValidationError(
                f"Event '{name}' is not in the bounded product analytics event taxonomy."
            )
        return name


class ProductAnalyticsEventSerializer(serializers.ModelSerializer):
    user_id = serializers.UUIDField(source="user.id", allow_null=True, read_only=True)

    class Meta:
        model = ProductAnalyticsEvent
        fields = [
            "id",
            "event_name",
            "category",
            "user_id",
            "session_id",
            "properties",
            "client_ip_hash",
            "user_agent_category",
            "locale",
            "created_at",
        ]
        read_only_fields = fields


class FunnelDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FunnelDefinition
        fields = [
            "id",
            "slug",
            "name_fa",
            "name_en",
            "description_fa",
            "description_en",
            "category",
            "steps",
            "is_active",
            "created_at",
            "updated_at",
        ]


class FunnelStepAnalysisSerializer(serializers.Serializer):
    step_index = serializers.IntegerField()
    event_name = serializers.CharField()
    name_fa = serializers.CharField()
    name_en = serializers.CharField()
    actors_count = serializers.IntegerField()
    step_conversion_rate = serializers.FloatField()
    cumulative_conversion_rate = serializers.FloatField()
    drop_off_count = serializers.IntegerField()
    drop_off_rate = serializers.FloatField()
    median_time_seconds = serializers.IntegerField()


class FunnelDetailSerializer(serializers.Serializer):
    funnel = serializers.DictField()
    time_window_days = serializers.IntegerField()
    total_entries = serializers.IntegerField()
    total_completions = serializers.IntegerField()
    overall_conversion_rate = serializers.FloatField()
    steps = FunnelStepAnalysisSerializer(many=True)


class FunnelSummarySerializer(serializers.Serializer):
    id = serializers.CharField()
    slug = serializers.CharField()
    name_fa = serializers.CharField()
    name_en = serializers.CharField()
    category = serializers.CharField()
    total_steps = serializers.IntegerField()
    total_entries = serializers.IntegerField()
    total_completions = serializers.IntegerField()
    overall_conversion_rate = serializers.FloatField()


class CohortRowSerializer(serializers.Serializer):
    cohort_index = serializers.IntegerField()
    cohort_week = serializers.CharField()
    cohort_label_fa = serializers.CharField()
    week_start = serializers.CharField()
    week_end = serializers.CharField()
    new_users = serializers.IntegerField()
    retention_d1 = serializers.FloatField(allow_null=True)
    retention_d7 = serializers.FloatField(allow_null=True)
    retention_d14 = serializers.FloatField(allow_null=True)
    retention_d30 = serializers.FloatField(allow_null=True)


class AnalyticsOverviewSerializer(serializers.Serializer):
    kpis = serializers.DictField()
    category_breakdown = serializers.ListField(child=serializers.DictField())
    daily_trend = serializers.ListField(child=serializers.DictField())
    funnels_summary = FunnelSummarySerializer(many=True)
    evaluated_at = serializers.DateTimeField()

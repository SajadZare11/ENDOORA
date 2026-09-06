from rest_framework import serializers
from search.models import SearchDocument, SearchQueryLog, RecentSearch, SearchContentType, SearchVisibility


class SearchDocumentSerializer(serializers.ModelSerializer):
    content_type_display = serializers.CharField(source="get_content_type_display", read_only=True)
    visibility_display = serializers.CharField(source="get_visibility_display", read_only=True)

    class Meta:
        model = SearchDocument
        fields = [
            "id",
            "title",
            "content",
            "content_type",
            "content_type_display",
            "visibility",
            "visibility_display",
            "target_id",
            "target_url",
            "tags",
            "popularity_score",
            "updated_at",
        ]


class SearchResponseSerializer(serializers.Serializer):
    query = serializers.CharField()
    normalized_query = serializers.CharField()
    total_count = serializers.IntegerField()
    is_zero_result = serializers.BooleanField()
    results = SearchDocumentSerializer(many=True)
    popular_searches = serializers.ListField(child=serializers.CharField())
    recent_searches = serializers.ListField(child=serializers.CharField())
    zero_result_suggestions = serializers.ListField(child=serializers.CharField(), required=False)


class SearchQueryLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchQueryLog
        fields = [
            "id",
            "query",
            "normalized_query",
            "results_count",
            "is_zero_result",
            "filter_applied",
            "created_at",
        ]


class RecentSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecentSearch
        fields = ["id", "query", "created_at"]

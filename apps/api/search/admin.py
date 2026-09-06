from django.contrib import admin
from search.models import SearchDocument, SearchQueryLog, RecentSearch


@admin.register(SearchDocument)
class SearchDocumentAdmin(admin.ModelAdmin):
    list_display = ["title", "content_type", "visibility", "popularity_score", "updated_at"]
    list_filter = ["content_type", "visibility"]
    search_fields = ["title", "normalized_title", "content"]


@admin.register(SearchQueryLog)
class SearchQueryLogAdmin(admin.ModelAdmin):
    list_display = ["query", "results_count", "is_zero_result", "user", "created_at"]
    list_filter = ["is_zero_result", "created_at"]
    search_fields = ["query", "normalized_query"]


@admin.register(RecentSearch)
class RecentSearchAdmin(admin.ModelAdmin):
    list_display = ["user", "query", "created_at"]
    search_fields = ["query", "user__email"]

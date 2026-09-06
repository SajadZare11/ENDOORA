from django.urls import path
from search.views import (
    UnifiedSearchView,
    PopularSearchesView,
    RecentSearchesView,
    ZeroResultAnalyticsView,
)

app_name = "search"

urlpatterns = [
    path("", UnifiedSearchView.as_view(), name="unified_search"),
    path("popular/", PopularSearchesView.as_view(), name="popular_searches"),
    path("recent/", RecentSearchesView.as_view(), name="recent_searches"),
    path("zero-results/", ZeroResultAnalyticsView.as_view(), name="zero_result_analytics"),
]

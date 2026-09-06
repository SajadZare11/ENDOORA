from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from search.services import SearchService
from search.serializers import SearchResponseSerializer, SearchDocumentSerializer


class UnifiedSearchView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.query_params.get("q", "").strip()
        content_type = request.query_params.get("category")
        try:
            page = max(1, int(request.query_params.get("page", 1)))
        except (ValueError, TypeError):
            page = 1
        try:
            page_size = min(50, max(1, int(request.query_params.get("page_size", 20))))
        except (ValueError, TypeError):
            page_size = 20

        data = SearchService.search(
            query=query,
            user=request.user,
            content_type=content_type,
            page=page,
            page_size=page_size,
        )
        serializer = SearchResponseSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PopularSearchesView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        popular = SearchService.get_popular_searches()
        return Response({"popular": popular}, status=status.HTTP_200_OK)


class RecentSearchesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        recent = SearchService.get_recent_searches(request.user)
        return Response({"recent": recent}, status=status.HTTP_200_OK)

    def delete(self, request):
        SearchService.clear_recent_searches(request.user)
        return Response({"detail": "Recent searches cleared."}, status=status.HTTP_200_OK)


class ZeroResultAnalyticsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        analytics = SearchService.get_zero_result_analytics()
        return Response({"zero_result_terms": list(analytics)}, status=status.HTTP_200_OK)

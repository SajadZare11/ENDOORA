from __future__ import annotations

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from admin_dashboard.permissions import IsAdministratorOrStaff
from analytics.models import ProductAnalyticsEvent
from analytics.serializers import (
    ProductAnalyticsEventSerializer,
    TrackEventInputSerializer,
)
from analytics.services.event_service import ingest_event
from analytics.services.funnel_service import (
    calculate_funnel_metrics,
    list_funnel_summaries,
)
from analytics.services.kpi_service import get_analytics_overview
from analytics.services.retention_service import calculate_retention_cohorts


def get_client_ip(request) -> str:
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "")


class TrackEventView(APIView):
    """
    Public endpoint for ingesting bounded client-side telemetry events.
    Enforces bounded event validation and GDPR/SEC-002 privacy rules.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = TrackEventInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        client_ip = get_client_ip(request)
        user_agent = request.META.get("HTTP_USER_AGENT", "")

        ingest_event(
            event_name=data["event_name"],
            user=request.user if request.user.is_authenticated else None,
            session_id=data.get("session_id", ""),
            properties=data.get("properties", {}),
            client_ip=client_ip,
            user_agent=user_agent,
            locale=data.get("locale", "fa"),
        )
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminAnalyticsOverviewView(APIView):
    """
    Admin-only endpoint returning high-level product analytics KPIs,
    14-day activity trends, and category breakdowns.
    """
    permission_classes = [IsAdministratorOrStaff]

    def get(self, request):
        try:
            days = int(request.query_params.get("days", 30))
        except (ValueError, TypeError):
            days = 30
        overview = get_analytics_overview(days=days)
        return Response(overview, status=status.HTTP_200_OK)


class AdminFunnelsListView(APIView):
    """
    Admin-only endpoint returning summary cards for all registered funnels.
    """
    permission_classes = [IsAdministratorOrStaff]

    def get(self, request):
        try:
            days = int(request.query_params.get("days", 30))
        except (ValueError, TypeError):
            days = 30
        summaries = list_funnel_summaries(days=days)
        return Response(summaries, status=status.HTTP_200_OK)


class AdminFunnelDetailView(APIView):
    """
    Admin-only endpoint returning step-by-step conversion and drop-off analysis
    for a specific funnel.
    """
    permission_classes = [IsAdministratorOrStaff]

    def get(self, request, slug: str):
        try:
            days = int(request.query_params.get("days", 30))
        except (ValueError, TypeError):
            days = 30
        try:
            detail = calculate_funnel_metrics(funnel_slug=slug, days=days)
        except ValueError as err:
            return Response({"detail": str(err)}, status=status.HTTP_404_NOT_FOUND)
        return Response(detail, status=status.HTTP_200_OK)


class AdminCohortsView(APIView):
    """
    Admin-only endpoint returning weekly retention cohorts heatmap matrix.
    """
    permission_classes = [IsAdministratorOrStaff]

    def get(self, request):
        try:
            weeks = int(request.query_params.get("weeks", 6))
        except (ValueError, TypeError):
            weeks = 6
        cohorts = calculate_retention_cohorts(weeks_count=weeks)
        return Response(cohorts, status=status.HTTP_200_OK)


class AdminEventsStreamView(APIView):
    """
    Admin-only endpoint streaming recent bounded analytics events.
    """
    permission_classes = [IsAdministratorOrStaff]

    def get(self, request):
        category = request.query_params.get("category")
        event_name = request.query_params.get("event_name")
        try:
            limit = min(int(request.query_params.get("limit", 50)), 200)
        except (ValueError, TypeError):
            limit = 50

        qs = ProductAnalyticsEvent.objects.all().select_related("user")
        if category:
            qs = qs.filter(category=category)
        if event_name:
            qs = qs.filter(event_name=event_name)

        events = qs[:limit]
        serializer = ProductAnalyticsEventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

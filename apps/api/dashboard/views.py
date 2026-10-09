from __future__ import annotations

import logging

from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    DashboardEventSerializer,
    LearnerActivitySerializer,
    LearnerHomeSerializer,
    RecordActivityInputSerializer,
)
from .services import (
    build_learner_home,
    format_relative_time,
    get_recent_activities,
    record_learner_activity,
)


analytics_logger = logging.getLogger("endoora.analytics")


def require_learner(request) -> Response | None:
    user = request.user
    if not user or not user.is_authenticated or not user.is_active:
        return Response(
            {
                "code": "authentication_required",
                "message_fa": "برای دیدن داشبورد باید وارد حساب کاربری شوی.",
                "message_en": "You must sign in to view the learner dashboard.",
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )

    if getattr(user, "role", None) != "learner":
        return Response(
            {
                "code": "learner_role_required",
                "message_fa": "این بخش فقط برای حساب زبان‌آموز است.",
                "message_en": "This area is available only to learner accounts.",
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    return None


class LearnerHomeView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = []

    def get(self, request):
        error = require_learner(request)
        if error is not None:
            return error

        serializer = LearnerHomeSerializer(data=build_learner_home(request.user))
        serializer.is_valid(raise_exception=True)

        analytics_logger.info(
            "learner_dashboard.view user_id=%s state=%s",
            request.user.pk,
            serializer.validated_data["dashboard_state"],
        )
        return Response(serializer.data)


class DashboardEventView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = []

    def post(self, request):
        error = require_learner(request)
        if error is not None:
            return error

        serializer = DashboardEventSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        analytics_logger.info(
            "learner_dashboard.%s user_id=%s action_id=%s",
            serializer.validated_data["event_name"],
            request.user.pk,
            serializer.validated_data["action_id"],
        )
        return Response(status=status.HTTP_204_NO_CONTENT)


class LearnerActivityListView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = []

    def get(self, request):
        error = require_learner(request)
        if error is not None:
            return error

        try:
            limit = min(int(request.query_params.get("limit", 20)), 50)
        except (ValueError, TypeError):
            limit = 20

        activities = get_recent_activities(request.user, limit=limit)
        serializer = LearnerActivitySerializer(activities, many=True)
        return Response({"results": serializer.data, "count": len(serializer.data)})


class LearnerActivityRecordView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = []

    def post(self, request):
        error = require_learner(request)
        if error is not None:
            return error

        input_serializer = RecordActivityInputSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)

        activity = record_learner_activity(
            user=request.user,
            **input_serializer.validated_data,
        )

        time_fa, time_en = format_relative_time(activity.created_at)
        output_data = {
            "id": str(activity.id),
            "activity_type": activity.activity_type,
            "title_fa": activity.title_fa,
            "title_en": activity.title_en,
            "description_fa": activity.description_fa,
            "description_en": activity.description_en,
            "category": activity.category,
            "badge_text_fa": activity.badge_text_fa,
            "badge_text_en": activity.badge_text_en,
            "icon": activity.icon,
            "link": activity.link,
            "time_ago_fa": time_fa,
            "time_ago_en": time_en,
            "created_at": activity.created_at,
        }
        output_serializer = LearnerActivitySerializer(data=output_data)
        output_serializer.is_valid(raise_exception=True)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)


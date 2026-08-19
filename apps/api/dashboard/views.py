from __future__ import annotations

import logging

from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import DashboardEventSerializer, LearnerHomeSerializer
from .services import build_learner_home


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

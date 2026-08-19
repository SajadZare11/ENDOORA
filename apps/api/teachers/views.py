from __future__ import annotations

import logging

from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView

from .dashboard import build_teacher_dashboard
from .serializers import TeacherDashboardEventSerializer, TeacherDashboardSerializer


analytics_logger = logging.getLogger("endoora.analytics")


def require_teacher(request) -> Response | None:
    user = request.user
    if not user or not user.is_authenticated or not user.is_active:
        return Response(
            {
                "code": "authentication_required",
                "message_fa": "برای دیدن فضای مدرس باید وارد حساب کاربری شوی.",
                "message_en": "You must sign in to view the teacher workspace.",
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )

    if getattr(user, "role", None) != "teacher":
        return Response(
            {
                "code": "teacher_role_required",
                "message_fa": "این بخش فقط برای حساب مدرس است.",
                "message_en": "This area is available only to teacher accounts.",
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    return None


class TeacherDashboardView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = []

    def get(self, request):
        error = require_teacher(request)
        if error is not None:
            return error

        serializer = TeacherDashboardSerializer(data=build_teacher_dashboard(request.user))
        serializer.is_valid(raise_exception=True)

        analytics_logger.info(
            "teacher_dashboard.view teacher_id=%s verification_status=%s",
            request.user.pk,
            serializer.validated_data["verification_status"],
        )
        return Response(serializer.data)


class TeacherDashboardEventView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = []

    def post(self, request):
        error = require_teacher(request)
        if error is not None:
            return error

        serializer = TeacherDashboardEventSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        analytics_logger.info(
            "teacher_dashboard.%s teacher_id=%s action_id=%s",
            serializer.validated_data["event_name"],
            request.user.pk,
            serializer.validated_data["action_id"],
        )
        return Response(status=status.HTTP_204_NO_CONTENT)

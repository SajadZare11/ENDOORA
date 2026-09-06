from __future__ import annotations

import logging
from decimal import Decimal
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView

from .dashboard import build_teacher_dashboard
from .models import (
    TeacherClass,
    TeacherLearnerLink,
    ClassSession,
    TeachingHourLedger,
    LinkStatus,
    LedgerStatus,
)
from .serializers import (
    TeacherDashboardEventSerializer,
    TeacherDashboardSerializer,
    TeacherClassSerializer,
    TeacherLearnerLinkSerializer,
    ClassSessionSerializer,
    TeachingHourLedgerSerializer,
    CreateClassInputSerializer,
    ScheduleSessionInputSerializer,
    AdjustHoursInputSerializer,
    InviteLearnerInputSerializer,
    LearnerConsentInputSerializer,
    TerminateLinkInputSerializer,
    CompleteSessionInputSerializer,
)
from .services import TeacherClassService

User = get_user_model()
analytics_logger = logging.getLogger("endoora.analytics")


def get_client_ip(request) -> str:
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "")


def require_authenticated(request) -> Response | None:
    user = request.user
    if not user or not user.is_authenticated or not user.is_active:
        return Response(
            {
                "code": "authentication_required",
                "message_fa": "برای دسترسی به این بخش باید وارد حساب کاربری شوی.",
                "message_en": "You must sign in to access this area.",
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )
    return None


def require_teacher(request) -> Response | None:
    auth_err = require_authenticated(request)
    if auth_err is not None:
        return auth_err

    user = request.user
    if getattr(user, "role", None) != "teacher" and not getattr(user, "is_teacher_verified", False):
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


# --- Day 33 Views ---

class TeacherClassListCreateView(APIView):
    """List all managed classes for the teacher or create a new class."""
    authentication_classes = [SessionAuthentication]
    permission_classes = []

    def get(self, request):
        error = require_teacher(request)
        if error is not None:
            return error

        classes = TeacherClassService.list_teacher_classes(request.user)
        serializer = TeacherClassSerializer(classes, many=True)
        return Response(serializer.data)

    def post(self, request):
        error = require_teacher(request)
        if error is not None:
            return error

        input_serializer = CreateClassInputSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)
        data = input_serializer.validated_data

        created_class = TeacherClassService.create_class(
            teacher=request.user,
            title=data["title"],
            subject=data["subject"],
            level=data.get("level", "B1"),
            max_capacity=data.get("max_capacity", 1),
            objectives=data.get("objectives", []),
            private_notes=data.get("private_notes", ""),
        )
        return Response(TeacherClassSerializer(created_class).data, status=status.HTTP_201_CREATED)


class TeacherClassDetailView(APIView):
    """Retrieve details, enrollments, and sessions of a managed class."""
    authentication_classes = [SessionAuthentication]
    permission_classes = []

    def get(self, request, pk):
        error = require_teacher(request)
        if error is not None:
            return error

        teacher_class = get_object_or_404(
            TeacherClass.objects.prefetch_related("enrollments__learner", "sessions"),
            id=pk,
            teacher=request.user,
        )

        class_data = TeacherClassSerializer(teacher_class).data
        enrollments = TeacherLearnerLinkSerializer(teacher_class.enrollments.all(), many=True).data
        sessions = ClassSessionSerializer(teacher_class.sessions.all(), many=True).data

        return Response({
            "class": class_data,
            "enrollments": enrollments,
            "sessions": sessions,
        })


class TeacherLearnerInviteView(APIView):
    """
    Invite a learner into a class.
    Generates a pending invite that requires explicit learner consent.
    """
    authentication_classes = [SessionAuthentication]
    permission_classes = []

    def post(self, request, pk):
        error = require_teacher(request)
        if error is not None:
            return error

        teacher_class = get_object_or_404(TeacherClass, id=pk, teacher=request.user)
        input_serializer = InviteLearnerInputSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)
        data = input_serializer.validated_data

        learner = None
        if data.get("learner_id"):
            learner = User.objects.filter(id=data["learner_id"]).first()
        elif data.get("learner_email"):
            learner = User.objects.filter(email__iexact=data["learner_email"].strip()).first()

        if not learner:
            return Response(
                {
                    "code": "learner_not_found",
                    "message_fa": "کاربر زبان‌آموز با این مشخصات یافت نشد.",
                    "message_en": "Learner with the specified identifier was not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        link = TeacherClassService.invite_learner(
            teacher=request.user,
            class_id=str(teacher_class.id),
            learner=learner,
        )
        return Response(TeacherLearnerLinkSerializer(link).data, status=status.HTTP_201_CREATED)


class LearnerConsentAcceptView(APIView):
    """
    Learner accepts an invite and grants consent for educational supervision.
    """
    authentication_classes = [SessionAuthentication]
    permission_classes = []

    def post(self, request, pk=None):
        error = require_authenticated(request)
        if error is not None:
            return error

        invite_code = request.data.get("invite_code")
        if not invite_code and pk:
            link = get_object_or_404(TeacherLearnerLink, id=pk, learner=request.user)
            invite_code = link.invite_code

        if not invite_code:
            input_serializer = LearnerConsentInputSerializer(data=request.data)
            input_serializer.is_valid(raise_exception=True)
            invite_code = input_serializer.validated_data["invite_code"]

        try:
            link = TeacherClassService.accept_invite(learner=request.user, invite_code=invite_code)
        except PermissionDenied as e:
            return Response(
                {"code": "consent_denied", "detail": str(e)},
                status=status.HTTP_403_FORBIDDEN,
            )
        except TeacherLearnerLink.DoesNotExist:
            return Response(
                {"code": "invite_not_found", "detail": "Invalid invite code."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(TeacherLearnerLinkSerializer(link).data, status=status.HTTP_200_OK)


class TeacherLearnerOverviewView(APIView):
    """
    Secure learner educational overview view.
    CRITICAL SECURITY BARRIER:
    1. Only actively linked learners can be inspected.
    2. Logs every view into TeacherDataAccessAudit.
    3. Private AI chats are strictly excluded.
    """
    authentication_classes = [SessionAuthentication]
    permission_classes = []

    def get(self, request, learner_pk, class_pk=None):
        error = require_teacher(request)
        if error is not None:
            return error

        ip = get_client_ip(request)
        ua = request.META.get("HTTP_USER_AGENT", "")[:255]

        try:
            overview = TeacherClassService.get_learner_overview(
                teacher=request.user,
                learner_id=str(learner_pk),
                request_ip=ip,
                user_agent=ua,
            )
        except PermissionDenied as e:
            return Response(
                {
                    "code": "access_denied",
                    "message_fa": "دسترسی به اطلاعات این زبان‌آموز امکان‌پذیر نیست یا رضایت فعال ندارد.",
                    "message_en": str(e),
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        return Response(overview, status=status.HTTP_200_OK)


class TeacherLearnerTerminateView(APIView):
    """
    Terminates the teacher-learner relationship.
    Future access is immediately revoked while historical records are preserved.
    """
    authentication_classes = [SessionAuthentication]
    permission_classes = []

    def post(self, request, pk):
        error = require_authenticated(request)
        if error is not None:
            return error

        input_serializer = TerminateLinkInputSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)
        reason = input_serializer.validated_data.get("reason", "")

        try:
            link = TeacherClassService.terminate_relationship(
                actor=request.user,
                link_id=str(pk),
                reason=reason,
            )
        except PermissionDenied as e:
            return Response(
                {"code": "permission_denied", "detail": str(e)},
                status=status.HTTP_403_FORBIDDEN,
            )
        except TeacherLearnerLink.DoesNotExist:
            return Response(
                {"code": "link_not_found", "detail": "Link record not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(TeacherLearnerLinkSerializer(link).data, status=status.HTTP_200_OK)


class ClassSessionListCreateView(APIView):
    """List sessions for a class or schedule a new session."""
    authentication_classes = [SessionAuthentication]
    permission_classes = []

    def get(self, request, class_pk):
        error = require_teacher(request)
        if error is not None:
            return error

        teacher_class = get_object_or_404(TeacherClass, id=class_pk, teacher=request.user)
        sessions = teacher_class.sessions.all()
        return Response(ClassSessionSerializer(sessions, many=True).data)

    def post(self, request, class_pk):
        error = require_teacher(request)
        if error is not None:
            return error

        payload = {**request.data, "class_id": str(class_pk)}
        input_serializer = ScheduleSessionInputSerializer(data=payload)
        input_serializer.is_valid(raise_exception=True)
        data = input_serializer.validated_data

        try:
            session = TeacherClassService.schedule_session(
                teacher=request.user,
                class_id=str(class_pk),
                title=data["title"],
                scheduled_start=data["scheduled_start"],
                scheduled_end=data["scheduled_end"],
                duration_minutes=data.get("duration_minutes", 60),
                learner_id=str(data["learner_id"]) if data.get("learner_id") else None,
                session_notes=data.get("session_notes", ""),
            )
        except PermissionDenied as e:
            return Response({"code": "permission_denied", "detail": str(e)}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return Response({"code": "schedule_failed", "detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(ClassSessionSerializer(session).data, status=status.HTTP_201_CREATED)


class ClassSessionCompleteView(APIView):
    """
    Marks a session as completed. Automatically calculates teaching hours
    and creates a confirmed TeachingHourLedger entry.
    """
    authentication_classes = [SessionAuthentication]
    permission_classes = []

    def post(self, request, pk):
        error = require_teacher(request)
        if error is not None:
            return error

        input_serializer = CompleteSessionInputSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)
        data = input_serializer.validated_data

        try:
            session = TeacherClassService.confirm_session_completion(
                teacher=request.user,
                session_id=str(pk),
                session_notes=data.get("session_notes", ""),
                confirmed_by_learner=data.get("confirmed_by_learner", False),
            )
        except PermissionDenied as e:
            return Response({"code": "permission_denied", "detail": str(e)}, status=status.HTTP_403_FORBIDDEN)
        except ClassSession.DoesNotExist:
            return Response({"code": "session_not_found"}, status=status.HTTP_404_NOT_FOUND)

        return Response(ClassSessionSerializer(session).data, status=status.HTTP_200_OK)


class TeachingHourLedgerView(APIView):
    """
    Retrieve teaching hours summary and detailed ledger entries.
    """
    authentication_classes = [SessionAuthentication]
    permission_classes = []

    def get(self, request):
        error = require_teacher(request)
        if error is not None:
            return error

        ledgers = (
            TeachingHourLedger.objects.filter(teacher=request.user)
            .select_related("session__teacher_class")
            .prefetch_related("audit_logs__actor")
            .order_by("-created_at")
        )

        total_hours = Decimal("0.00")
        confirmed_hours = Decimal("0.00")
        pending_hours = Decimal("0.00")

        for l in ledgers:
            total_hours += l.hours
            if l.status in (LedgerStatus.CONFIRMED, LedgerStatus.REVISED):
                confirmed_hours += l.hours
            elif l.status == LedgerStatus.PENDING:
                pending_hours += l.hours

        return Response({
            "total_hours": float(total_hours),
            "confirmed_hours": float(confirmed_hours),
            "pending_hours": float(pending_hours),
            "ledgers": TeachingHourLedgerSerializer(ledgers, many=True).data,
        })


class TeachingHourAdjustView(APIView):
    """
    Adjusts teaching hours for a ledger record.
    CRITICAL: Requires explicit audit reason; generates immutable TeachingHourAuditLog.
    """
    authentication_classes = [SessionAuthentication]
    permission_classes = []

    def post(self, request, pk):
        error = require_teacher(request)
        if error is not None:
            return error

        input_serializer = AdjustHoursInputSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)
        data = input_serializer.validated_data

        try:
            ledger = TeacherClassService.adjust_teaching_hours(
                actor=request.user,
                ledger_id=str(pk),
                new_hours=data["new_hours"],
                reason=data["reason"],
            )
        except PermissionDenied as e:
            return Response({"code": "permission_denied", "detail": str(e)}, status=status.HTTP_403_FORBIDDEN)
        except ValueError as e:
            return Response({"code": "invalid_adjustment", "detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except TeachingHourLedger.DoesNotExist:
            return Response({"code": "ledger_not_found"}, status=status.HTTP_404_NOT_FOUND)

        return Response(TeachingHourLedgerSerializer(ledger).data, status=status.HTTP_200_OK)


class LearnerLinkedTeachersView(APIView):
    """
    Allows a learner to view all teachers they have an active relationship with.
    """
    authentication_classes = [SessionAuthentication]
    permission_classes = []

    def get(self, request):
        error = require_authenticated(request)
        if error is not None:
            return error

        teachers = TeacherClassService.get_learner_linked_teachers(request.user)
        return Response(teachers, status=status.HTTP_200_OK)

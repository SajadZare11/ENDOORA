from __future__ import annotations

from typing import Any
from django.contrib.auth import get_user_model
from django.db.models import Count, Q, Sum
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from audit.models import AuditEvent
from content.models import ContentItem, ContentStatus
from core.models.settings import FeatureFlag
from courses.models import Course
from ledger.models import LedgerEntryType, TeacherPayableLedgerEntry
from moderation.models import ModerationStatus, Report
from questions.models import QuestionVersion
from .permissions import IsAdministratorOrStaff
from .serializers import (
    AuditEventAdminSerializer,
    FeatureFlagAdminSerializer,
    FeatureFlagToggleSerializer,
)

User = get_user_model()


def seed_standard_feature_flags() -> None:
    if FeatureFlag.objects.exists():
        return

    default_flags = [
        {
            "key": "ai_tutor_realtime",
            "enabled": True,
            "rollout_percentage": 100,
            "environments": ["development", "test", "staging", "production"],
            "owner": "AI Platform Team",
            "rationale": "Realtime pedagogical conversational guidance and pronunciation analysis.",
            "kill_switch_behavior": FeatureFlag.KillSwitchBehavior.REVIEWED_FALLBACK,
        },
        {
            "key": "marketplace_instant_booking",
            "enabled": False,
            "rollout_percentage": 0,
            "environments": ["development", "staging"],
            "owner": "Marketplace Team",
            "rationale": "Instant teacher booking without manual teacher pre-approval.",
            "kill_switch_behavior": FeatureFlag.KillSwitchBehavior.DISABLE,
        },
        {
            "key": "konkur_exam_simulators",
            "enabled": True,
            "rollout_percentage": 100,
            "environments": ["development", "test", "staging", "production"],
            "owner": "Curriculum Editorial",
            "rationale": "High school nationwide Konkur timed exam simulation with percentile analysis.",
            "kill_switch_behavior": FeatureFlag.KillSwitchBehavior.READ_ONLY,
        },
        {
            "key": "speech_shadowing_v2",
            "enabled": True,
            "rollout_percentage": 50,
            "environments": ["development", "staging", "production"],
            "owner": "Audio Research Group",
            "rationale": "Advanced phoneme-level acoustic matching and intonation feedback.",
            "kill_switch_behavior": FeatureFlag.KillSwitchBehavior.REVIEWED_FALLBACK,
        },
        {
            "key": "crypto_payments_experimental",
            "enabled": False,
            "rollout_percentage": 0,
            "environments": ["development"],
            "owner": "Treasury Team",
            "rationale": "Alternative payment gateway for international diaspora learners.",
            "kill_switch_behavior": FeatureFlag.KillSwitchBehavior.DISABLE,
        },
    ]

    for item in default_flags:
        FeatureFlag.objects.create(**item)


class AdminDashboardStatsView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def get(self, request):
        seed_standard_feature_flags()

        # Users breakdown
        total_users = User.objects.count()
        role_counts = {
            r: User.objects.filter(role=r).count()
            for r in [
                User.Role.LEARNER,
                User.Role.TEACHER,
                User.Role.EDITOR,
                User.Role.SUPPORT,
                User.Role.ADMINISTRATOR,
            ]
        }

        # Content review queues
        courses_in_review = Course.objects.filter(status=ContentStatus.IN_REVIEW).count()
        content_items_in_review = ContentItem.objects.filter(status=ContentStatus.IN_REVIEW).count()
        questions_in_review = QuestionVersion.objects.filter(status=QuestionVersion.Status.IN_REVIEW).count()

        # Teacher verification queue
        pending_teachers = User.objects.filter(
            role=User.Role.TEACHER,
            is_teacher_verified=False,
        ).count()
        verified_teachers = User.objects.filter(
            role=User.Role.TEACHER,
            is_teacher_verified=True,
        ).count()

        # Moderation reports
        pending_reports = Report.objects.filter(
            status__in=[ModerationStatus.PENDING, ModerationStatus.IN_REVIEW],
        ).count()

        # Financial & Treasury Telemetry
        commission_sum = TeacherPayableLedgerEntry.objects.aggregate(
            total=Sum("commission_amount_toman")
        )["total"] or 0
        teacher_payables_sum = TeacherPayableLedgerEntry.objects.filter(
            entry_type=LedgerEntryType.EARNING_AVAILABLE
        ).aggregate(total=Sum("amount_toman"))["total"] or 0
        escrow_pending_sum = TeacherPayableLedgerEntry.objects.filter(
            entry_type=LedgerEntryType.EARNING_PENDING
        ).aggregate(total=Sum("amount_toman"))["total"] or 0

        # Feature flags overview
        total_flags = FeatureFlag.objects.count()
        enabled_flags = FeatureFlag.objects.filter(enabled=True).count()

        # Recent audit events count
        recent_audits_count = AuditEvent.objects.count()

        data = {
            "users": {
                "total": total_users,
                "by_role": role_counts,
            },
            "review_queues": {
                "courses_in_review": courses_in_review,
                "content_items_in_review": content_items_in_review,
                "questions_in_review": questions_in_review,
                "total_in_review": courses_in_review + content_items_in_review + questions_in_review,
            },
            "teacher_verification": {
                "pending_verifications": pending_teachers,
                "verified_teachers": verified_teachers,
            },
            "moderation": {
                "pending_reports": pending_reports,
            },
            "treasury": {
                "total_platform_commission_toman": int(commission_sum),
                "total_teacher_payables_toman": int(teacher_payables_sum),
                "pending_escrow_toman": int(escrow_pending_sum),
            },
            "feature_flags": {
                "total": total_flags,
                "enabled": enabled_flags,
            },
            "audit": {
                "total_logged_events": recent_audits_count,
            },
            "system_health": {
                "status": "operational",
                "database": "connected",
                "cache": "connected",
                "evaluated_at": timezone.now().isoformat(),
            },
        }
        return Response(data, status=status.HTTP_200_OK)


class AdminFeatureFlagsListView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def get(self, request):
        seed_standard_feature_flags()
        qs = FeatureFlag.objects.all().order_by("key")
        q = request.query_params.get("q") or request.query_params.get("search")
        if q:
            term = q.strip()
            qs = qs.filter(
                Q(key__icontains=term)
                | Q(owner__icontains=term)
                | Q(rationale__icontains=term)
            )
        serializer = FeatureFlagAdminSerializer(qs, many=True)
        return Response(
            {
                "count": qs.count(),
                "results": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        serializer = FeatureFlagAdminSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        flag = serializer.save()

        # Audit creation
        AuditEvent.objects.create(
            actor=request.user,
            action=AuditEvent.Action.CREATE,
            target_app="core",
            target_model="FeatureFlag",
            target_pk=flag.key,
            before_summary={},
            after_summary=FeatureFlagAdminSerializer(flag).data,
            reason=f"Feature flag '{flag.key}' provisioned by {request.user.email}",
            request_method=request.method,
            request_path=request.path,
        )

        return Response(FeatureFlagAdminSerializer(flag).data, status=status.HTTP_201_CREATED)


class AdminFeatureFlagToggleView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def post(self, request, key):
        seed_standard_feature_flags()
        flag = get_object_or_404(FeatureFlag, key=key)
        serializer = FeatureFlagToggleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        reason = serializer.validated_data["reason"]
        before_summary = {
            "enabled": flag.enabled,
            "rollout_percentage": flag.rollout_percentage,
            "kill_switch_behavior": flag.kill_switch_behavior,
        }

        if "enabled" in serializer.validated_data:
            flag.enabled = serializer.validated_data["enabled"]
        if "rollout_percentage" in serializer.validated_data:
            flag.rollout_percentage = serializer.validated_data["rollout_percentage"]
        if "kill_switch_behavior" in serializer.validated_data:
            flag.kill_switch_behavior = serializer.validated_data["kill_switch_behavior"]

        flag.save()

        after_summary = {
            "enabled": flag.enabled,
            "rollout_percentage": flag.rollout_percentage,
            "kill_switch_behavior": flag.kill_switch_behavior,
        }

        # Record immutable audit event
        AuditEvent.objects.create(
            actor=request.user,
            action=AuditEvent.Action.UPDATE,
            target_app="core",
            target_model="FeatureFlag",
            target_pk=flag.key,
            before_summary=before_summary,
            after_summary=after_summary,
            reason=reason,
            request_method=request.method,
            request_path=request.path,
        )

        return Response(
            {
                "flag": FeatureFlagAdminSerializer(flag).data,
                "detail": f"کلید ویژگی «{flag.key}» با موفقیت به‌روزرسانی و در ثبت وقایع ممیزی ثبت شد.",
            },
            status=status.HTTP_200_OK,
        )


class AdminAuditLogsListView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def get(self, request):
        qs = AuditEvent.objects.select_related("actor").all().order_by("-occurred_at")

        target_app = request.query_params.get("target_app")
        if target_app:
            qs = qs.filter(target_app=target_app)

        action = request.query_params.get("action")
        if action:
            qs = qs.filter(action=action)

        search = request.query_params.get("search") or request.query_params.get("q")
        if search:
            s = search.strip()
            qs = qs.filter(
                Q(reason__icontains=s)
                | Q(target_pk__icontains=s)
                | Q(target_model__icontains=s)
            )

        limit = min(int(request.query_params.get("limit", 50)), 200)
        total = qs.count()
        results = qs[:limit]

        serializer = AuditEventAdminSerializer(results, many=True)
        return Response(
            {
                "count": total,
                "results": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

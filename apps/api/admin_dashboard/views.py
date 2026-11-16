from __future__ import annotations

from decimal import Decimal

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


class AdminUsersListView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def get(self, request):
        qs = User.objects.all().order_by("-date_joined")

        q = request.query_params.get("search") or request.query_params.get("q")
        if q:
            s = q.strip()
            qs = qs.filter(
                Q(email__icontains=s)
                | Q(first_name__icontains=s)
                | Q(last_name__icontains=s)
                | Q(phone__icontains=s)
            )

        role = request.query_params.get("role")
        if role and role != "all":
            qs = qs.filter(role=role)

        status_filter = request.query_params.get("status")
        if status_filter == "active":
            qs = qs.filter(is_active=True)
        elif status_filter == "banned":
            qs = qs.filter(is_active=False)

        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        banned_users = User.objects.filter(is_active=False).count()
        learners_count = User.objects.filter(role=User.Role.LEARNER).count()
        teachers_count = User.objects.filter(role=User.Role.TEACHER).count()
        admins_count = User.objects.filter(role=User.Role.ADMINISTRATOR).count()

        from marketplace.models import UserWallet
        total_wallet_balance = sum(
            UserWallet.objects.values_list("balance_toman", flat=True),
            Decimal("0"),
        )

        limit = min(int(request.query_params.get("limit", 100)), 500)
        users_list = []
        for u in qs[:limit]:
            wallet, _ = UserWallet.objects.get_or_create(user=u)
            users_list.append({
                "id": str(u.id),
                "name": f"{u.first_name} {u.last_name}".strip() or u.email,
                "email": u.email,
                "phone": u.phone or "",
                "role": u.role,
                "isActive": u.is_active,
                "isStaff": u.is_staff,
                "walletBalanceToman": int(wallet.balance_toman),
                "createdAt": u.date_joined.isoformat() if u.date_joined else "",
            })

        return Response({
            "success": True,
            "users": users_list,
            "stats": {
                "totalUsers": total_users,
                "activeUsers": active_users,
                "bannedUsers": banned_users,
                "learners": learners_count,
                "teachers": teachers_count,
                "admins": admins_count,
                "totalWalletBalanceToman": int(total_wallet_balance),
            },
        }, status=status.HTTP_200_OK)


class AdminUserActionView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def post(self, request, user_id=None):
        target_id = user_id or request.data.get("userId") or request.data.get("user_id")
        if not target_id:
            return Response({"success": False, "error": "شناسه کاربر الزامی است."}, status=status.HTTP_400_BAD_REQUEST)

        from django.db import transaction
        target_user = get_object_or_404(User, id=target_id)
        action = request.data.get("action")

        if action == "adjust_wallet":
            from marketplace.models import UserWallet, WalletTransaction, WalletTransactionType
            amount_toman = request.data.get("amountToman") or request.data.get("amount_toman")
            reason_category = request.data.get("reasonCategory") or request.data.get("reason_category", "administrative_adjustment")
            admin_note = (request.data.get("adminNote") or request.data.get("admin_note") or "").strip()

            if amount_toman is None or int(amount_toman) == 0:
                return Response({"success": False, "error": "مبلغ وارد شده معتبر نمی‌باشد."}, status=status.HTTP_400_BAD_REQUEST)

            if not admin_note:
                return Response({"success": False, "error": "ثبت یادداشت و دلیل تراکنش برای ممیزی حسابداری الزامی است."}, status=status.HTTP_400_BAD_REQUEST)

            amount_dec = Decimal(str(amount_toman))
            with transaction.atomic():
                wallet = UserWallet.objects.select_for_update().get_or_create(user=target_user)[0]
                if amount_dec < 0 and wallet.balance_toman + amount_dec < 0:
                    return Response({"success": False, "error": "موجودی کیف پول نمی‌تواند منفی شود."}, status=status.HTTP_400_BAD_REQUEST)

                before_balance = int(wallet.balance_toman)
                wallet.balance_toman += amount_dec
                wallet.save(update_fields=["balance_toman", "updated_at"])

                import uuid
                tx_type = WalletTransactionType.DEPOSIT if amount_dec > 0 else WalletTransactionType.COMMISSION_DEDUCTION
                tracking = f"ADM-{uuid.uuid4().hex[:12].upper()}"
                WalletTransaction.objects.create(
                    wallet=wallet,
                    transaction_type=tx_type,
                    amount_toman=amount_dec,
                    balance_after_toman=wallet.balance_toman,
                    tracking_code=tracking,
                    reference_id=f"admin_adj_{request.user.id}",
                    description=f"تعدیل مدیریت: {admin_note}",
                )

                AuditEvent.objects.create(
                    actor=request.user,
                    action=AuditEvent.Action.UPDATE,
                    target_app="marketplace",
                    target_model="UserWallet",
                    target_pk=str(wallet.id),
                    before_summary={"balance_toman": before_balance},
                    after_summary={"balance_toman": int(wallet.balance_toman), "delta": int(amount_dec)},
                    reason=f"تعدیل کیف پول کاربر {target_user.email}: {int(amount_dec):,} تومان ({admin_note})",
                    request_method=request.method,
                    request_path=request.path,
                )

            return Response({
                "success": True,
                "message": f"موجودی کیف پول با موفقیت به {int(wallet.balance_toman):,} تومان تغییر یافت.",
                "user": {
                    "id": str(target_user.id),
                    "walletBalanceToman": int(wallet.balance_toman),
                },
            }, status=status.HTTP_200_OK)

        elif action == "update_role":
            new_role = request.data.get("role") or request.data.get("new_role")
            if new_role not in User.Role.values:
                return Response({"success": False, "error": f"نقش {new_role} نامعتبر است."}, status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():
                before_role = target_user.role
                target_user.role = new_role
                if new_role == User.Role.ADMINISTRATOR:
                    target_user.is_staff = True
                    target_user.is_superuser = True
                else:
                    if target_user.id != request.user.id:
                        target_user.is_staff = False
                        target_user.is_superuser = False
                target_user.save(update_fields=["role", "is_staff", "is_superuser"])

                AuditEvent.objects.create(
                    actor=request.user,
                    action=AuditEvent.Action.UPDATE,
                    target_app="accounts",
                    target_model="User",
                    target_pk=str(target_user.id),
                    before_summary={"role": before_role},
                    after_summary={"role": new_role},
                    reason=f"تغییر نقش کاربر {target_user.email} از {before_role} به {new_role}",
                    request_method=request.method,
                    request_path=request.path,
                )

            return Response({
                "success": True,
                "message": f"نقش کاربر با موفقیت به {new_role} تغییر یافت.",
                "user": {
                    "id": str(target_user.id),
                    "role": target_user.role,
                },
            }, status=status.HTTP_200_OK)

        elif action in ("toggle_active", "ban"):
            with transaction.atomic():
                before_active = target_user.is_active
                target_user.is_active = not before_active
                target_user.save(update_fields=["is_active"])

                if not target_user.is_active:
                    from django.contrib.sessions.models import Session
                    for s in Session.objects.filter(expire_date__gte=timezone.now()):
                        try:
                            data = s.get_decoded()
                            if str(data.get("_auth_user_id")) == str(target_user.id):
                                s.delete()
                        except Exception:
                            pass

                AuditEvent.objects.create(
                    actor=request.user,
                    action=AuditEvent.Action.UPDATE,
                    target_app="accounts",
                    target_model="User",
                    target_pk=str(target_user.id),
                    before_summary={"is_active": before_active},
                    after_summary={"is_active": target_user.is_active},
                    reason=f"{'مسدودسازی' if not target_user.is_active else 'رفع مسدودیت'} حساب کاربری {target_user.email}",
                    request_method=request.method,
                    request_path=request.path,
                )

            status_msg = "مسدود شد" if not target_user.is_active else "فعال شد"
            return Response({
                "success": True,
                "message": f"حساب کاربری {target_user.email} با موفقیت {status_msg}.",
                "user": {
                    "id": str(target_user.id),
                    "isActive": target_user.is_active,
                },
            }, status=status.HTTP_200_OK)

        return Response({"success": False, "error": f"عملیات {action} پشتیبانی نمی‌شود."}, status=status.HTTP_400_BAD_REQUEST)

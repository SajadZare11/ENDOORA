from __future__ import annotations

from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from admin_dashboard.permissions import IsAdministratorOrStaff
from .models import Notification, NotificationPreference
from .services.dispatcher import NotificationDispatcher


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        NotificationDispatcher.seed_initial_notifications_if_empty(request.user)

        qs = Notification.objects.filter(recipient=request.user)
        unread_count = qs.filter(status__in=[Notification.Status.DELIVERED, Notification.Status.SENT]).count()

        category = request.query_params.get("category")
        if category and category != "ALL":
            qs = qs.filter(category=category)

        unread_only = request.query_params.get("unread_only")
        if unread_only in ("true", "1", "True"):
            qs = qs.filter(status__in=[Notification.Status.DELIVERED, Notification.Status.SENT])

        notifications_data = []
        for n in qs[:50]:
            notifications_data.append({
                "id": str(n.id),
                "title": n.title,
                "message": n.message,
                "category": n.category,
                "category_display": n.get_category_display(),
                "channel": n.channel,
                "status": n.status,
                "is_read": n.status == Notification.Status.READ,
                "action_url": n.action_url,
                "created_at": n.created_at.isoformat(),
                "read_at": n.read_at.isoformat() if n.read_at else None,
            })

        return Response({
            "notifications": notifications_data,
            "unread_count": unread_count,
            "total_count": len(notifications_data),
        })


class NotificationMarkReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request, pk: str) -> Response:
        try:
            notification = Notification.objects.get(id=pk, recipient=request.user)
        except (Notification.DoesNotExist, ValueError):
            return Response(
                {"detail": "اعلان مورد نظر یافت نشد.", "code": "NOT_FOUND"},
                status=status.HTTP_404_NOT_FOUND,
            )

        notification.status = Notification.Status.READ
        notification.read_at = timezone.now()
        notification.save()

        return Response({"success": True, "id": str(notification.id), "is_read": True})


class NotificationReadAllView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        updated = Notification.objects.filter(
            recipient=request.user,
            status__in=[Notification.Status.DELIVERED, Notification.Status.SENT],
        ).update(status=Notification.Status.READ, read_at=timezone.now())

        return Response({"success": True, "updated_count": updated})


class NotificationPreferencesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        prefs = NotificationDispatcher.get_or_create_preferences(request.user)
        return Response({
            "in_app_enabled": prefs.in_app_enabled,
            "sms_enabled": prefs.sms_enabled,
            "email_enabled": prefs.email_enabled,
            "learning_updates": prefs.learning_updates,
            "assignment_alerts": prefs.assignment_alerts,
            "financial_receipts": prefs.financial_receipts,
            "security_warnings": prefs.security_warnings,
            "marketing_promotions": prefs.marketing_promotions,
            "phone_number_verified": prefs.phone_number_verified,
            "user_phone": getattr(request.user, "phone", None),
            "updated_at": prefs.updated_at.isoformat(),
        })

    def put(self, request: Request) -> Response:
        prefs = NotificationDispatcher.get_or_create_preferences(request.user)
        data = request.data

        if "in_app_enabled" in data:
            prefs.in_app_enabled = bool(data["in_app_enabled"])
        if "sms_enabled" in data:
            prefs.sms_enabled = bool(data["sms_enabled"])
        if "email_enabled" in data:
            prefs.email_enabled = bool(data["email_enabled"])
        if "learning_updates" in data:
            prefs.learning_updates = bool(data["learning_updates"])
        if "assignment_alerts" in data:
            prefs.assignment_alerts = bool(data["assignment_alerts"])
        if "financial_receipts" in data:
            prefs.financial_receipts = bool(data["financial_receipts"])
        if "security_warnings" in data:
            prefs.security_warnings = bool(data["security_warnings"])
        if "marketing_promotions" in data:
            prefs.marketing_promotions = bool(data["marketing_promotions"])

        prefs.save()

        return Response({
            "success": True,
            "in_app_enabled": prefs.in_app_enabled,
            "sms_enabled": prefs.sms_enabled,
            "email_enabled": prefs.email_enabled,
            "learning_updates": prefs.learning_updates,
            "assignment_alerts": prefs.assignment_alerts,
            "financial_receipts": prefs.financial_receipts,
            "security_warnings": prefs.security_warnings,
            "marketing_promotions": prefs.marketing_promotions,
            "message": "تنظیمات دریافت اعلان‌ها با موفقیت ذخیره شد.",
        })


class AdminNotificationBroadcastView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def post(self, request: Request) -> Response:
        title = request.data.get("title", "").strip()
        message = request.data.get("message", "").strip()
        category = request.data.get("category", Notification.Category.SYSTEM)
        roles = request.data.get("roles")
        action_url = request.data.get("action_url", "")

        if not title or not message:
            return Response(
                {"detail": "عنوان و متن اعلان الزامی است.", "code": "VALIDATION_ERROR"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        res = NotificationDispatcher.broadcast_system_announcement(
            title=title,
            message=message,
            category=category,
            target_roles=roles,
            action_url=action_url,
        )

        return Response(res)


class AdminNotificationTelemetryView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def get(self, request: Request) -> Response:
        telemetry = NotificationDispatcher.get_notifications_telemetry()
        return Response(telemetry)

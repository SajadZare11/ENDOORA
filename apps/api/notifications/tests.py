from __future__ import annotations

import io
import uuid
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase
from rest_framework.test import APIClient

from notifications.models import Notification, NotificationPreference, SMSDeliveryLog
from notifications.services.dispatcher import NotificationDispatcher

User = get_user_model()


class NotificationsSystemTests(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            email="admin.notif@endoora.ir",
            password="SecurePassword123!",
            role="administrator",
            is_staff=True,
            phone="09121111111",
        )
        self.learner_user = User.objects.create_user(
            email="learner.notif@endoora.ir",
            password="SecurePassword123!",
            role="learner",
            is_staff=False,
            phone="09122222222",
        )

    def test_dispatcher_creates_in_app_notification(self) -> None:
        res = NotificationDispatcher.send_notification(
            user=self.learner_user,
            title="نمره تسک رایتینگ",
            message="نمره مقاله شما با بند اسکور ۶.۵ ثبت شد.",
            category=Notification.Category.ASSIGNMENT,
            channels=[Notification.Channel.IN_APP],
            action_url="/writing",
        )
        self.assertTrue(res["success"])
        self.assertEqual(len(res["created_notifications"]), 1)
        notif = Notification.objects.get(id=res["created_notifications"][0])
        self.assertEqual(notif.recipient, self.learner_user)
        self.assertEqual(notif.category, Notification.Category.ASSIGNMENT)
        self.assertEqual(notif.status, Notification.Status.DELIVERED)

    def test_dispatcher_respects_user_preferences(self) -> None:
        prefs = NotificationDispatcher.get_or_create_preferences(self.learner_user)
        prefs.learning_updates = False
        prefs.save()

        res = NotificationDispatcher.send_notification(
            user=self.learner_user,
            title="ماموریت روزانه",
            message="تمرین جدید آماده است.",
            category=Notification.Category.LEARNING,
        )
        self.assertFalse(res["success"])
        self.assertIn("غیرفعال", res["reason"])

    def test_security_warnings_bypass_preference_suppression(self) -> None:
        prefs = NotificationDispatcher.get_or_create_preferences(self.learner_user)
        prefs.learning_updates = False
        prefs.save()

        res = NotificationDispatcher.send_notification(
            user=self.learner_user,
            title="هشدار امنیتی تغییر گذرواژه",
            message="گذرواژه حساب کاربری شما تغییر یافت.",
            category=Notification.Category.SECURITY,
        )
        self.assertTrue(res["success"])
        self.assertEqual(len(res["created_notifications"]), 1)

    def test_dispatcher_sms_dispatch_logs(self) -> None:
        res = NotificationDispatcher.send_notification(
            user=self.learner_user,
            title="کد تایید ورود",
            message="کد ورود شما: 123456",
            category=Notification.Category.SECURITY,
            channels=[Notification.Channel.IN_APP, Notification.Channel.SMS],
            metadata={"sms_template": "auth_otp"},
        )
        self.assertTrue(res["success"])
        self.assertTrue(res["sms_dispatched"])
        sms_log = SMSDeliveryLog.objects.filter(recipient_phone=self.learner_user.phone).first()
        self.assertIsNotNone(sms_log)
        self.assertEqual(sms_log.delivery_status, "DELIVERED")

    def test_broadcast_system_announcement(self) -> None:
        res = NotificationDispatcher.broadcast_system_announcement(
            title="بروزرسانی زیرساخت پلتفرم",
            message="پلتفرم امشب به مدت ۱۰ دقیقه وارد حالت نگهداری می‌شود.",
            category=Notification.Category.SYSTEM,
            target_roles=["learner", "administrator"],
        )
        self.assertTrue(res["success"])
        self.assertGreaterEqual(res["recipients_count"], 2)

    def test_notification_telemetry(self) -> None:
        telemetry = NotificationDispatcher.get_notifications_telemetry()
        self.assertIn("total_in_app_notifications", telemetry)
        self.assertIn("sms_delivery_rate_percentage", telemetry)
        self.assertIn("active_carrier_providers", telemetry)

    def test_notification_list_view_and_seed(self) -> None:
        self.client.force_authenticate(user=self.learner_user)
        res = self.client.get("/api/notifications/")
        self.assertEqual(res.status_code, 200)
        self.assertIn("notifications", res.data)
        self.assertGreaterEqual(res.data["total_count"], 3)  # Initial seeds created
        self.assertGreater(res.data["unread_count"], 0)

    def test_notification_list_unread_filter(self) -> None:
        self.client.force_authenticate(user=self.learner_user)
        res = self.client.get("/api/notifications/?unread_only=true")
        self.assertEqual(res.status_code, 200)
        for n in res.data["notifications"]:
            self.assertFalse(n["is_read"])

    def test_notification_mark_read_view(self) -> None:
        notif = Notification.objects.create(
            recipient=self.learner_user,
            title="اعلان تست",
            message="متن تست",
            status=Notification.Status.DELIVERED,
        )
        self.client.force_authenticate(user=self.learner_user)
        res = self.client.post(f"/api/notifications/{notif.id}/read/")
        self.assertEqual(res.status_code, 200)
        notif.refresh_from_db()
        self.assertEqual(notif.status, Notification.Status.READ)
        self.assertIsNotNone(notif.read_at)

    def test_notification_mark_read_not_found(self) -> None:
        self.client.force_authenticate(user=self.learner_user)
        res = self.client.post(f"/api/notifications/{uuid.uuid4()}/read/")
        self.assertEqual(res.status_code, 404)

    def test_notification_read_all_view(self) -> None:
        Notification.objects.create(
            recipient=self.learner_user,
            title="اعلان ۱",
            message="متن ۱",
            status=Notification.Status.DELIVERED,
        )
        Notification.objects.create(
            recipient=self.learner_user,
            title="اعلان ۲",
            message="متن ۲",
            status=Notification.Status.DELIVERED,
        )
        self.client.force_authenticate(user=self.learner_user)
        res = self.client.post("/api/notifications/read-all/")
        self.assertEqual(res.status_code, 200)
        self.assertGreaterEqual(res.data["updated_count"], 2)

    def test_notification_preferences_view_get_and_put(self) -> None:
        self.client.force_authenticate(user=self.learner_user)
        res = self.client.get("/api/notifications/preferences/")
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.data["in_app_enabled"])

        # Update
        res = self.client.put(
            "/api/notifications/preferences/",
            {"sms_enabled": False, "marketing_promotions": True},
            format="json",
        )
        self.assertEqual(res.status_code, 200)
        self.assertFalse(res.data["sms_enabled"])
        self.assertTrue(res.data["marketing_promotions"])

    def test_admin_broadcast_endpoint(self) -> None:
        # Learner cannot broadcast
        self.client.force_authenticate(user=self.learner_user)
        res = self.client.post(
            "/api/notifications/ops/broadcast/",
            {"title": "سیستم", "message": "متن"},
            format="json",
        )
        self.assertEqual(res.status_code, 403)

        # Admin can broadcast
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.post(
            "/api/notifications/ops/broadcast/",
            {"title": "پیام اضطراری", "message": "لطفا توجه فرمایید", "roles": ["learner"]},
            format="json",
        )
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.data["success"])

    def test_admin_broadcast_validation_error(self) -> None:
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.post("/api/notifications/ops/broadcast/", {}, format="json")
        self.assertEqual(res.status_code, 400)

    def test_admin_telemetry_endpoint(self) -> None:
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.get("/api/notifications/ops/telemetry/")
        self.assertEqual(res.status_code, 200)
        self.assertIn("active_carrier_providers", res.data)

    def test_send_test_notification_command(self) -> None:
        out = io.StringIO()
        call_command("send_test_notification", "--email=learner.notif@endoora.ir", stdout=out)
        self.assertIn("Notification successfully dispatched", out.getvalue())

    def test_model_str_representations(self) -> None:
        notif = Notification.objects.create(
            recipient=self.learner_user,
            title="اعلان نمونه",
            message="متن",
            status=Notification.Status.DELIVERED,
        )
        self.assertIn("Notification<", str(notif))

        prefs = NotificationPreference.objects.create(user=self.admin_user)
        self.assertIn("NotificationPreference<", str(prefs))

        sms = SMSDeliveryLog.objects.create(recipient_phone="09123456789")
        self.assertIn("SMSDeliveryLog<", str(sms))

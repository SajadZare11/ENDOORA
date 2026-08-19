from django.contrib import admin
from django.contrib.auth import get_user_model
from django.test import RequestFactory, TestCase

from audit.admin_policy import is_action_allowed
from audit.context import audit_context
from audit.models import AuditEvent
from audit.redaction import safe_model_snapshot
from core.models import SystemSetting


class AuditEventTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.admin_user = User.objects.create_user(
            email="admin-day11@example.test",
            password="not-a-real-password-123",
            role="administrator",
            is_staff=True,
        )

    def test_privileged_change_creates_audit_event(self):
        with audit_context(
            actor=self.admin_user,
            reason="Day 11 test change",
            request_method="POST",
            request_path="/admin/core/systemsetting/add/",
            environment="test",
        ):
            setting = SystemSetting.objects.create(
                key="dashboard_notice_limit",
                value_type=SystemSetting.ValueType.INTEGER,
                value=3,
                environment_scope=SystemSetting.EnvironmentScope.TEST,
                owner="operations",
                rationale="Day 11 test change",
            )

        event = AuditEvent.objects.get(
            target_app="core",
            target_model="systemsetting",
            target_pk=str(setting.pk),
        )
        self.assertEqual(event.action, AuditEvent.Action.CREATE)
        self.assertEqual(event.actor_id, self.admin_user.pk)
        self.assertEqual(event.reason, "Day 11 test change")


    def test_django_admin_add_permission_hook_uses_correct_signature(self):
        User = get_user_model()
        superuser = User.objects.create_superuser(
            email="admin-signature-day11@example.test",
            password="not-a-real-password-123",
        )
        request = RequestFactory().get("/admin/")
        request.user = superuser

        model_admin = admin.site._registry[SystemSetting]
        result = model_admin.has_add_permission(request)

        self.assertIsInstance(result, bool)

    def test_audit_event_cannot_be_modified(self):
        with audit_context(
            actor=self.admin_user,
            reason="create event",
            request_method="POST",
            request_path="/admin/",
            environment="test",
        ):
            setting = SystemSetting.objects.create(
                key="safe_setting",
                value_type=SystemSetting.ValueType.BOOLEAN,
                value=False,
                environment_scope=SystemSetting.EnvironmentScope.TEST,
                owner="operations",
                rationale="test",
            )

        event = AuditEvent.objects.get(target_pk=str(setting.pk))
        event.reason = "tampered"
        with self.assertRaises(RuntimeError):
            event.save()

        with self.assertRaises(RuntimeError):
            event.delete()

        with self.assertRaises(RuntimeError):
            AuditEvent.objects.filter(pk=event.pk).update(reason="tampered")

    def test_snapshot_redacts_direct_contact_and_authentication_data(self):
        snapshot = safe_model_snapshot(self.admin_user)
        self.assertEqual(snapshot["email"], "<redacted-personal>")
        self.assertEqual(snapshot["password"], "<redacted-secret>")


class LeastPrivilegePolicyTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.support = User.objects.create_user(
            email="support-day11@example.test",
            password="not-a-real-password-123",
            role="support",
            is_staff=True,
        )

    def test_support_can_view_account_reference_but_not_change_role(self):
        self.assertTrue(is_action_allowed(self.support, "accounts.user", "view"))
        self.assertFalse(is_action_allowed(self.support, "accounts.user", "change"))

    def test_support_cannot_browse_profile_evidence(self):
        self.assertFalse(
            is_action_allowed(self.support, "profiles.learnerprofile", "view")
        )

    def test_support_cannot_access_future_payment_state(self):
        self.assertFalse(is_action_allowed(self.support, "payments.payment", "change"))
        self.assertFalse(is_action_allowed(self.support, "payments.payment", "view"))

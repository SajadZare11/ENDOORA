from django.test import override_settings
from rest_framework.test import APITestCase

from accounts.models import User
from placement.models import PlacementSession
from data_protection.services.export_service import compile_full_user_data_export
from support.models import SupportTicket, TicketMessage


class AccountReleaseTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="learner@example.test", password="BeforeRelease-4321")
        self.client.force_login(self.user)

    def test_change_password_checks_current_secret_and_keeps_session(self):
        url = "/api/auth/password/change/"
        for current, expected in [("incorrect", 400), ("BeforeRelease-4321", 204)]:
            response = self.client.post(url, {"current_password": current, "new_password": "AfterRelease-5678"})
            self.assertEqual(response.status_code, expected)
        self.assertEqual(self.client.get("/api/auth/me/").status_code, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("AfterRelease-5678"))

    def test_export_matches_session_after_refresh(self):
        session, _ = PlacementSession.get_or_create_active_session(self.user)
        exported = compile_full_user_data_export(self.user)
        self.assertEqual(exported["data"]["learning"]["placement_sessions"][0]["session_id"], str(session.pk))

    def test_internal_support_notes_remain_staff_only(self):
        ticket = SupportTicket.objects.create(user=self.user, title="Invoice", description="Payment reference", category="payments")
        TicketMessage.objects.create(ticket=ticket, sender_type="staff", body="Internal note", is_internal=True)
        url = f"/api/support/tickets/{ticket.pk}/"
        self.assertEqual(self.client.get(url).data["messages"], [])
        staff = User.objects.create_superuser(email="staff@example.test", password="StaffExample-123")
        self.client.force_login(staff)
        self.assertEqual(self.client.get(url).data["messages"][0]["body"], "Internal note")

    @override_settings(ENDOORA_REQUIRE_APPROVED_POLICIES=True, ENDOORA_APPROVED_POLICY_VERSIONS="")
    def test_registration_waits_for_approved_text(self):
        self.assertEqual(self.client.post("/api/auth/register/", {}).status_code, 503)

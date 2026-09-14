from datetime import timedelta
from decimal import Decimal
import uuid
from django.core.exceptions import PermissionDenied, ValidationError
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from accounts.models import User
from ledger.models import (
    CommissionProductType,
    CommissionRule,
    LedgerEntryType,
    PayoutAuditAction,
    PayoutAuditLog,
    TeacherPayableLedgerEntry,
    TeacherTaxIdentity,
)
from ledger.payouts import (
    compute_teacher_ledger_balances,
    generate_reconciliation_report,
    generate_teacher_statement,
    mature_pending_ledger_entries,
    process_admin_payout_dual_control,
    process_refund_allocation,
    process_session_completion_ledger,
    request_payout_with_ledger,
)
from marketplace.models import (
    BookingEscrow,
    BookingStatus,
    EscrowStatus,
    RequestSkill,
    SessionBooking,
    SessionFormat,
    TeacherPayoutRequest,
    TeacherPayoutStatus,
    UserWallet,
    WalletTransaction,
    WalletTransactionType,
)


class LedgerFinancialOperationsTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.admin = User.objects.create_superuser(
            email="finance_admin@endoora.com",
            password="AdminPassword123!",
            role=User.Role.ADMINISTRATOR,
            first_name="Finance",
            last_name="Director",
        )
        self.teacher = User.objects.create_user(
            email="reza_teacher@endoora.com",
            password="TeacherPassword123!",
            role=User.Role.TEACHER,
            first_name="Reza",
            last_name="Ghasemi",
            is_teacher_verified=True,
            marketplace_eligible=True,
        )
        self.learner = User.objects.create_user(
            email="sara_learner@endoora.com",
            password="LearnerPassword123!",
            role=User.Role.LEARNER,
            first_name="Sara",
            last_name="Najafi",
        )

        # Create standard 15% commission rule for 1on1 sessions
        self.rule_1on1 = CommissionRule.objects.create(
            name="کارمزد استاندارد جلسات خصوصی",
            product_type=CommissionProductType.SESSION_1ON1,
            rate_percentage=Decimal("15.00"),
            fixed_fee_toman=Decimal("0"),
            priority=10,
            is_active=True,
            effective_from=timezone.now() - timedelta(days=10),
        )

        # Create completed booking and escrow
        now = timezone.now()
        self.booking = SessionBooking.objects.create(
            learner=self.learner,
            teacher=self.teacher,
            target_skill=RequestSkill.IELTS_PREP,
            online_format=SessionFormat.VIDEO,
            scheduled_start=now - timedelta(hours=3),
            scheduled_end=now - timedelta(hours=2),
            rate_toman=Decimal("200000"),
            status=BookingStatus.COMPLETED,
            is_paid=True,
            completed_at=now - timedelta(hours=2),
        )
        self.escrow = BookingEscrow.objects.create(
            booking=self.booking,
            total_amount_toman=Decimal("200000"),
            platform_commission_rate=Decimal("0.15"),
            platform_commission_toman=Decimal("30000"),
            teacher_net_toman=Decimal("170000"),
            status=EscrowStatus.HELD,
        )

    def test_commission_calculation_and_pending_ledger_entry(self):
        """Verify credit teacher only after completed session into pending dispute window."""
        entry = process_session_completion_ledger(self.booking, dispute_window_hours=24)
        self.assertEqual(entry.entry_type, LedgerEntryType.EARNING_PENDING)
        self.assertEqual(entry.gross_amount_toman, Decimal("200000"))
        self.assertEqual(entry.commission_amount_toman, Decimal("30000"))
        self.assertEqual(entry.net_amount_toman, Decimal("170000"))
        self.assertFalse(entry.is_matured)

        # Balances: pending=170,000, available=0 (dispute window active)
        balances = compute_teacher_ledger_balances(self.teacher)
        self.assertEqual(balances["pending_toman"], 170000)
        self.assertEqual(balances["available_toman"], 0)

    def test_dispute_window_maturation(self):
        """Funds transition from pending to available only after dispute window elapses."""
        entry = process_session_completion_ledger(self.booking, dispute_window_hours=24)

        # Simulate time passing past dispute window
        entry.dispute_window_ends_at = timezone.now() - timedelta(minutes=5)
        entry.save(update_fields=["dispute_window_ends_at"])

        matured_count = mature_pending_ledger_entries()
        self.assertEqual(matured_count, 1)

        balances = compute_teacher_ledger_balances(self.teacher)
        self.assertEqual(balances["pending_toman"], 0)
        self.assertEqual(balances["available_toman"], 170000)
        self.assertTrue(balances["can_request_payout"])

    def test_available_balance_cannot_go_negative(self):
        """Verify available balance is strictly floored and cannot go negative."""
        # Teacher has 0 balance
        balances = compute_teacher_ledger_balances(self.teacher)
        self.assertEqual(balances["available_toman"], 0)

        # Attempting payout above balance raises ValidationError
        with self.assertRaises(ValidationError):
            request_payout_with_ledger(
                teacher=self.teacher,
                amount_toman=Decimal("50000"),
                bank_shaba_number="IR120000000000000000000034",
            )

        # Even with artificial debit entry, compute_teacher_ledger_balances clamps to >= 0
        TeacherPayableLedgerEntry.objects.create(
            teacher=self.teacher,
            entry_type=LedgerEntryType.REFUND_REVERSAL,
            amount_toman=Decimal("-100000"),
            net_amount_toman=Decimal("-100000"),
            is_matured=True,
            reference_code="TEST-FORCE-DEBIT",
        )
        balances = compute_teacher_ledger_balances(self.teacher)
        self.assertEqual(balances["available_toman"], 0)

    def test_refund_allocation_reverses_correct_entries(self):
        """Refunded class allocates reversal pro-rata across teacher payable and platform commission."""
        entry = process_session_completion_ledger(self.booking, dispute_window_hours=24)
        entry.is_matured = True
        entry.save(update_fields=["is_matured"])

        # 100% full refund
        res = process_refund_allocation(self.booking, refund_percentage=100, reason="غیبت استاد")
        self.assertEqual(res["refund_percentage"], 100)
        self.assertEqual(res["learner_refunded_toman"], 200000)
        self.assertEqual(res["teacher_deducted_net_toman"], 170000)
        self.assertEqual(res["platform_commission_reversed_toman"], 30000)

        # Teacher available balance should now be 0 after reversal
        balances = compute_teacher_ledger_balances(self.teacher)
        self.assertEqual(balances["available_toman"], 0)
        self.assertEqual(balances["reversed_toman"], 170000)

        # Escrow status updated to refunded
        self.escrow.refresh_from_db()
        self.assertEqual(self.escrow.status, EscrowStatus.REFUNDED_TO_LEARNER)

    def test_partial_refund_allocation_50_percent(self):
        """Partial refund (e.g. 50% dispute) reverses half of commission and teacher earning."""
        process_session_completion_ledger(self.booking, dispute_window_hours=24)
        res = process_refund_allocation(self.booking, refund_percentage=50, reason="توافق داوری")
        self.assertEqual(res["learner_refunded_toman"], 100000)
        self.assertEqual(res["teacher_deducted_net_toman"], 85000)
        self.assertEqual(res["platform_commission_reversed_toman"], 15000)

    def test_payout_cannot_pay_twice(self):
        """Payout approval and disbursement is atomic and cannot pay twice."""
        # Mature the booking earnings
        entry = process_session_completion_ledger(self.booking)
        entry.is_matured = True
        entry.save(update_fields=["is_matured"])

        payout = request_payout_with_ledger(
            teacher=self.teacher,
            amount_toman=Decimal("100000"),
            bank_shaba_number="IR120000000000000000000034",
            bank_name="بانک سامان",
            account_holder_name="رضا قاسمی",
        )
        self.assertEqual(payout.status, TeacherPayoutStatus.PENDING)

        # Admin approve (Step 1 dual-control)
        process_admin_payout_dual_control(self.admin, str(payout.id), action="approve")
        payout.refresh_from_db()
        self.assertEqual(payout.status, TeacherPayoutStatus.APPROVED)

        # Admin pay (Step 2 disbursement)
        process_admin_payout_dual_control(
            self.admin,
            str(payout.id),
            action="pay",
            bank_transfer_reference="PAYA-987654321",
        )
        payout.refresh_from_db()
        self.assertEqual(payout.status, TeacherPayoutStatus.PAID)
        self.assertIn("PAYA-987654321", payout.admin_notes)

        # Attempting to pay again must raise ValidationError
        with self.assertRaises(ValidationError):
            process_admin_payout_dual_control(
                self.admin,
                str(payout.id),
                action="pay",
                bank_transfer_reference="PAYA-DUPLICATE",
            )

    def test_teacher_statement_masks_sensitive_internal_fields(self):
        """Teacher statement contains financial items but restricts internal admin fields."""
        entry = process_session_completion_ledger(self.booking)
        TeacherTaxIdentity.objects.create(
            teacher=self.teacher,
            national_id_masked="001****345",
            bank_shaba_number="IR120000000000000000000034",
            is_verified=True,
        )

        statement = generate_teacher_statement(self.teacher)
        self.assertEqual(statement["teacher_email"], self.teacher.email)
        self.assertIn("balances", statement)
        self.assertIn("items", statement)
        self.assertEqual(len(statement["items"]), 1)

        first_item = statement["items"][0]
        self.assertEqual(first_item["gross_amount_toman"], 200000)
        self.assertEqual(first_item["commission_amount_toman"], 30000)
        self.assertEqual(first_item["net_amount_toman"], 170000)

        # Verify no staff user or merchant IDs are leaked
        self.assertNotIn("admin_notes", first_item)
        self.assertNotIn("performed_by", first_item)
        self.assertEqual(statement["tax_identity"]["national_id_masked"], "001****345")
        self.assertEqual(statement["tax_identity"]["sheba_masked"], "IR12******************0034")

    def test_rest_api_endpoints_permissions_and_workflows(self):
        """Test API endpoints for balances, statements, payout requests, and tax identity."""
        # 1. Teacher Balance
        self.client.force_authenticate(user=self.teacher)
        res = self.client.get("/api/ledger/teacher/balance/")
        self.assertEqual(res.status_code, 200)
        self.assertIn("available_toman", res.data)
        self.assertIn("pending_toman", res.data)

        # Learner cannot access teacher balance
        self.client.force_authenticate(user=self.learner)
        res = self.client.get("/api/ledger/teacher/balance/")
        self.assertEqual(res.status_code, 403)

        # 2. Tax identity update and masking
        self.client.force_authenticate(user=self.teacher)
        res = self.client.put(
            "/api/ledger/teacher/tax-identity/",
            data={
                "national_id": "0012345678",
                "tax_file_number": "TAX-1403-9988",
                "bank_shaba_number": "IR980120000000001234567890",
                "bank_name": "بانک ملت",
                "account_holder_name": "رضا قاسمی",
            },
            format="json",
        )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["national_id_masked"], "001****678")
        self.assertEqual(res.data["bank_shaba_masked"], "IR98******************7890")

        # 3. Admin reconciliation
        self.client.force_authenticate(user=self.admin)
        res = self.client.get("/api/ledger/admin/reconciliation/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["reconciliation_status"], "BALANCED")
        self.assertIn("escrow_metrics", res.data)
        self.assertIn("ledger_metrics", res.data)

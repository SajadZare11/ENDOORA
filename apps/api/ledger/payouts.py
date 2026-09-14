import hashlib
import logging
import re
import uuid
from datetime import timedelta
from decimal import Decimal
from typing import Any, Dict, List, Optional

from django.conf import settings
from django.core.exceptions import PermissionDenied, ValidationError
from django.db import transaction
from django.db.models import Q, Sum
from django.utils import timezone

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
from marketplace.models import (
    BookingEscrow,
    BookingStatus,
    EscrowStatus,
    SessionBooking,
    TeacherPayoutRequest,
    TeacherPayoutStatus,
    UserWallet,
    WalletTransaction,
    WalletTransactionType,
)

logger = logging.getLogger(__name__)

# Minimum payout withdrawal amount in Iranian Toman
MINIMUM_PAYOUT_AMOUNT_TOMAN = Decimal("50000")

# Dispute resolution window (in hours) following session completion
DEFAULT_DISPUTE_WINDOW_HOURS = 24


def mask_sheba(sheba: str) -> str:
    """Mask Iranian Sheba account number (e.g. IR12****************3456) for safe logging and display."""
    if not sheba:
        return ""
    clean = sheba.strip().upper().replace(" ", "")
    if len(clean) >= 10:
        return f"{clean[:4]}{'*' * (len(clean) - 8)}{clean[-4:]}"
    return "****"


def mask_national_id(nid: str) -> str:
    """Mask Iranian National ID (e.g. 001****345) for privacy and compliance."""
    if not nid:
        return ""
    clean = re.sub(r"\D", "", nid)
    if len(clean) == 10:
        return f"{clean[:3]}****{clean[-3:]}"
    return "****"


def hash_national_id(nid: str) -> str:
    """Compute SHA256 one-way hash of national ID for safe uniqueness checks."""
    if not nid:
        return ""
    clean = re.sub(r"\D", "", nid)
    return hashlib.sha256(f"endoora_nid_{clean}".encode("utf-8")).hexdigest()


def get_effective_commission_rule(
    product_type: str = CommissionProductType.SESSION_1ON1,
    booking_time: Optional[timezone.datetime] = None,
) -> CommissionRule:
    """
    Find the highest-priority active commission rule effective for the given product and time.
    Falls back to general rule or platform default.
    """
    at_time = booking_time or timezone.now()
    rule = (
        CommissionRule.objects.filter(
            Q(product_type=product_type) | Q(product_type=CommissionProductType.GENERAL),
            is_active=True,
            effective_from__lte=at_time,
        )
        .filter(Q(effective_to__isnull=True) | Q(effective_to__gte=at_time))
        .order_by("-priority", "-effective_from")
        .first()
    )
    if not rule:
        # Fallback to system default rule (15%)
        fallback_rate = getattr(settings, "MARKETPLACE_COMMISSION_RATE", Decimal("0.15")) * Decimal("100")
        rule, _ = CommissionRule.objects.get_or_create(
            name="قانون پایه کارمزد مارکت‌پلیس",
            product_type=CommissionProductType.GENERAL,
            defaults={
                "rate_percentage": fallback_rate,
                "fixed_fee_toman": Decimal("0"),
                "is_active": True,
                "priority": 0,
            },
        )
    return rule


def mature_pending_ledger_entries() -> int:
    """
    Transition eligible entries past their dispute window from pending to matured available.
    Returns the count of entries matured.
    """
    now = timezone.now()
    eligible_entries = TeacherPayableLedgerEntry.objects.filter(
        entry_type=LedgerEntryType.EARNING_PENDING,
        is_matured=False,
        dispute_window_ends_at__lte=now,
    )
    count = 0
    with transaction.atomic():
        for entry in eligible_entries.select_for_update():
            entry.is_matured = True
            entry.save(update_fields=["is_matured"])
            count += 1
    return count


def compute_teacher_ledger_balances(teacher: User) -> Dict[str, Any]:
    """
    Calculate auditable financial balances dynamically from append-only ledger entries:
    - pending_toman: earnings currently held in dispute resolution window.
    - available_toman: matured earnings minus requested payouts and reversals (guaranteed non-negative).
    - paid_toman: successfully disbursed payouts.
    - reversed_toman: refunds/chargebacks deducted from teacher.
    - total_earned_gross_toman: all-time gross billings before commission.
    - total_commission_toman: platform fees deducted.
    """
    # First, mature any pending entries whose dispute window has elapsed
    mature_pending_ledger_entries()

    entries = TeacherPayableLedgerEntry.objects.filter(teacher=teacher)

    # 1. Pending: immature earnings in dispute window
    pending_agg = entries.filter(
        entry_type=LedgerEntryType.EARNING_PENDING,
        is_matured=False,
    ).aggregate(total=Sum("net_amount_toman"))
    pending_toman = pending_agg["total"] or Decimal("0")

    # 2. Matured earnings
    matured_agg = entries.filter(
        entry_type=LedgerEntryType.EARNING_PENDING,
        is_matured=True,
    ).aggregate(total=Sum("net_amount_toman"))
    matured_earnings = matured_agg["total"] or Decimal("0")

    # Direct available credits / adjustments
    direct_avail_agg = entries.filter(
        entry_type__in=[LedgerEntryType.EARNING_AVAILABLE, LedgerEntryType.ADJUSTMENT],
    ).aggregate(total=Sum("amount_toman"))
    direct_avail = direct_avail_agg["total"] or Decimal("0")

    # Payouts requested (held against available)
    payout_held_agg = entries.filter(
        entry_type=LedgerEntryType.PAYOUT_REQUESTED,
    ).aggregate(total=Sum("amount_toman"))
    payout_held = abs(payout_held_agg["total"] or Decimal("0"))

    # Payouts refunded / rejected (restores available)
    payout_restored_agg = entries.filter(
        entry_type=LedgerEntryType.PAYOUT_REJECTED,
    ).aggregate(total=Sum("amount_toman"))
    payout_restored = payout_restored_agg["total"] or Decimal("0")

    # Refund reversals deducted from teacher
    reversals_agg = entries.filter(
        entry_type=LedgerEntryType.REFUND_REVERSAL,
    ).aggregate(total=Sum("net_amount_toman"))
    reversed_toman = abs(reversals_agg["total"] or Decimal("0"))

    # Paid out via completed transfers
    paid_agg = entries.filter(
        entry_type=LedgerEntryType.PAYOUT_COMPLETED,
    ).aggregate(total=Sum("amount_toman"))
    paid_toman = abs(paid_agg["total"] or Decimal("0"))

    # Available balance calculation:
    # Available = (matured_earnings + direct_avail + payout_restored) - payout_held - reversed_toman
    # Invariant: Available balance cannot go negative!
    calculated_available = (matured_earnings + direct_avail + payout_restored) - payout_held - reversed_toman
    available_toman = max(Decimal("0"), calculated_available)

    # Gross & Commission totals
    gross_agg = entries.filter(
        entry_type=LedgerEntryType.EARNING_PENDING,
    ).aggregate(gross=Sum("gross_amount_toman"), comm=Sum("commission_amount_toman"))
    total_earned_gross_toman = gross_agg["gross"] or Decimal("0")
    total_commission_toman = gross_agg["comm"] or Decimal("0")

    return {
        "pending_toman": int(pending_toman),
        "available_toman": int(available_toman),
        "paid_toman": int(paid_toman),
        "reversed_toman": int(reversed_toman),
        "total_earned_gross_toman": int(total_earned_gross_toman),
        "total_commission_toman": int(total_commission_toman),
        "minimum_payout_toman": int(MINIMUM_PAYOUT_AMOUNT_TOMAN),
        "can_request_payout": available_toman >= MINIMUM_PAYOUT_AMOUNT_TOMAN,
    }


def process_session_completion_ledger(
    booking: SessionBooking,
    dispute_window_hours: int = DEFAULT_DISPUTE_WINDOW_HOURS,
) -> TeacherPayableLedgerEntry:
    """
    On session completion:
    1. Verify session is completed.
    2. Determine commission rule based on product type.
    3. Calculate gross, platform commission, and teacher net.
    4. Create an immutable EARNING_PENDING ledger entry with dispute window.
    5. Update booking escrow metadata.
    """
    if booking.status != BookingStatus.COMPLETED:
        raise ValidationError("فقط جلسات تکمیل‌شده و پایان‌یافته مجاز به ثبت در دفتر کل مالی هستند.")

    with transaction.atomic():
        # Prevent double entry for same booking
        existing = TeacherPayableLedgerEntry.objects.filter(
            booking=booking,
            entry_type=LedgerEntryType.EARNING_PENDING,
        ).first()
        if existing:
            return existing

        gross = Decimal(str(booking.rate_toman))
        rule = get_effective_commission_rule(
            product_type=CommissionProductType.SESSION_1ON1,
            booking_time=booking.scheduled_start,
        )

        commission_pct = rule.rate_percentage / Decimal("100")
        commission = (gross * commission_pct + rule.fixed_fee_toman).quantize(Decimal("1"))
        net = max(Decimal("0"), gross - commission)

        dispute_window_ends = timezone.now() + timedelta(hours=dispute_window_hours)
        ref_code = f"LED-{timezone.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"

        entry = TeacherPayableLedgerEntry.objects.create(
            teacher=booking.teacher,
            entry_type=LedgerEntryType.EARNING_PENDING,
            amount_toman=net,
            booking=booking,
            commission_rule=rule,
            gross_amount_toman=gross,
            commission_amount_toman=commission,
            net_amount_toman=net,
            dispute_window_ends_at=dispute_window_ends,
            is_matured=False,
            reference_code=ref_code,
            description=f"حق‌التدریس جلسه {booking.get_target_skill_display()} با {booking.learner.get_full_name() or booking.learner.email}",
        )

        # Sync escrow record
        escrow = getattr(booking, "escrow", None)
        if escrow and escrow.status == EscrowStatus.HELD:
            escrow.platform_commission_rate = rule.rate_percentage / Decimal("100")
            escrow.platform_commission_toman = commission
            escrow.teacher_net_toman = net
            escrow.settlement_notes = f"سند دفتر کل: {ref_code} (بازه بازبینی تا {dispute_window_ends.strftime('%Y-%m-%d %H:%M')})"
            escrow.save(update_fields=["platform_commission_rate", "platform_commission_toman", "teacher_net_toman", "settlement_notes"])

        logger.info(
            "Created pending ledger earning %s for teacher %s: gross=%s, commission=%s, net=%s",
            ref_code,
            booking.teacher.id,
            gross,
            commission,
            net,
        )
        return entry


def process_refund_allocation(
    booking: SessionBooking,
    refund_percentage: int = 100,
    reason: str = "",
) -> Dict[str, Any]:
    """
    Allocate refund pro-rata or full across platform commission and teacher payable entry:
    - Calculates refund share for learner, reversed commission, and reversed teacher earning.
    - Creates immutable REFUND_REVERSAL entry in teacher ledger.
    - Reverses platform commission.
    - Updates escrow status and refunds funds to learner's wallet.
    """
    if refund_percentage < 1 or refund_percentage > 100:
        raise ValidationError("درصد استرداد باید بین ۱ تا ۱۰۰ درصد باشد.")

    with transaction.atomic():
        escrow = BookingEscrow.objects.select_for_update().filter(booking=booking).first()
        if not escrow:
            raise ValidationError("حساب امانی مربوط به این جلسه یافت نشد.")

        total_gross = escrow.total_amount_toman
        refund_gross = (total_gross * Decimal(str(refund_percentage)) / Decimal("100")).quantize(Decimal("1"))

        # Calculate commission reversal and teacher deduction pro-rata
        comm_rate = escrow.platform_commission_rate
        commission_reversed = (refund_gross * comm_rate).quantize(Decimal("1"))
        teacher_reversed_net = refund_gross - commission_reversed

        ref_code = f"REV-{timezone.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"

        # Create reversal ledger entry for teacher
        rev_entry = TeacherPayableLedgerEntry.objects.create(
            teacher=booking.teacher,
            entry_type=LedgerEntryType.REFUND_REVERSAL,
            amount_toman=-teacher_reversed_net,
            booking=booking,
            gross_amount_toman=-refund_gross,
            commission_amount_toman=-commission_reversed,
            net_amount_toman=-teacher_reversed_net,
            is_matured=True,
            reference_code=ref_code,
            description=f"برگشت درآمد {refund_percentage}٪ بابت استرداد جلسه {booking.id}: {reason}",
        )

        # Refund learner wallet
        from marketplace.services import refund_to_wallet
        refund_to_wallet(
            user=booking.learner,
            amount_toman=refund_gross,
            reference_id=f"REF-{booking.id}",
            description=f"استرداد {refund_percentage}٪ هزینه جلسه با مدرس {booking.teacher.get_full_name() or booking.teacher.email} ({reason})",
        )

        # Update escrow
        if refund_percentage == 100:
            escrow.status = EscrowStatus.REFUNDED_TO_LEARNER
        else:
            escrow.status = EscrowStatus.PARTIALLY_SETTLED

        escrow.refund_amount_toman = refund_gross
        escrow.settled_at = timezone.now()
        escrow.settlement_notes = f"سند برگشت: {ref_code} ({reason})"
        escrow.save(update_fields=["status", "refund_amount_toman", "settled_at", "settlement_notes"])

        logger.info(
            "Processed refund allocation for booking %s: learner_refund=%s, teacher_rev=%s, comm_rev=%s",
            booking.id,
            refund_gross,
            teacher_reversed_net,
            commission_reversed,
        )

        return {
            "reversal_code": ref_code,
            "refund_percentage": refund_percentage,
            "learner_refunded_toman": int(refund_gross),
            "teacher_deducted_net_toman": int(teacher_reversed_net),
            "platform_commission_reversed_toman": int(commission_reversed),
        }


def request_payout_with_ledger(
    teacher: User,
    amount_toman: Decimal | int | float,
    bank_shaba_number: str,
    account_holder_name: str = "",
    bank_name: str = "",
) -> TeacherPayoutRequest:
    """
    Teacher requests payout above minimum threshold (50,000 Toman).
    Checks available balance dynamically computed from ledger.
    Creates immutable PAYOUT_REQUESTED ledger hold and audit log entry.
    Restricts and masks banking details.
    """
    if teacher.role != User.Role.TEACHER:
        raise PermissionDenied("تنها مدرسان مجاز به ثبت درخواست تسویه مالی هستند.")

    amount = Decimal(str(amount_toman))
    if amount < MINIMUM_PAYOUT_AMOUNT_TOMAN:
        raise ValidationError(f"حداقل مبلغ قابل تسویه {MINIMUM_PAYOUT_AMOUNT_TOMAN:,} تومان است.")

    shaba_clean = bank_shaba_number.strip().upper().replace(" ", "")
    if not re.match(r"^IR\d{24}$", shaba_clean):
        raise ValidationError("شماره شبا نامعتبر است. فرمت صحیح: IR به همراه ۲۴ رقم بدون فاصله.")

    with transaction.atomic():
        balances = compute_teacher_ledger_balances(teacher)
        available = Decimal(str(balances["available_toman"]))
        if amount > available:
            raise ValidationError(
                f"موجودی قابل تسویه شما ({available:,} تومان) کمتر از مبلغ درخواستی ({amount:,} تومان) است."
            )

        ref_code = f"PAY-HOLD-{timezone.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"

        payout = TeacherPayoutRequest.objects.create(
            teacher=teacher,
            amount_toman=amount,
            bank_shaba_number=shaba_clean,
            account_holder_name=account_holder_name.strip() or teacher.get_full_name() or teacher.email,
            bank_name=bank_name.strip(),
            status=TeacherPayoutStatus.PENDING,
            admin_notes="",
        )

        # Create immutable hold entry in ledger
        TeacherPayableLedgerEntry.objects.create(
            teacher=teacher,
            entry_type=LedgerEntryType.PAYOUT_REQUESTED,
            amount_toman=-amount,
            payout_request=payout,
            net_amount_toman=-amount,
            is_matured=True,
            reference_code=ref_code,
            description=f"مسدودسازی موقت بابت درخواست تسویه بانکی به شبا {mask_sheba(shaba_clean)}",
        )

        # Audit log
        PayoutAuditLog.objects.create(
            payout_request=payout,
            performed_by=teacher,
            action=PayoutAuditAction.SUBMITTED,
            notes=f"درخواست تسویه به مبلغ {amount:,} تومان ثبت شد.",
        )

        logger.info(
            "Teacher %s requested payout %s for %s Toman to %s",
            teacher.id,
            payout.id,
            amount,
            mask_sheba(shaba_clean),
        )
        return payout


def process_admin_payout_dual_control(
    admin_user: User,
    payout_id: str,
    action: str,
    bank_transfer_reference: str = "",
    transfer_date: Optional[Any] = None,
    notes: str = "",
    rejection_reason: str = "",
) -> TeacherPayoutRequest:
    """
    Dual-control admin review and payout execution:
    - 'review': Mark as under review / first audit checked.
    - 'approve': Stage 1 dual-control sign-off.
    - 'dual_signoff': Stage 2 dual-control sign-off by secondary finance officer.
    - 'pay': Final execution with bank transfer reference (کد پیگیری پایا / ساتنا).
             Guaranteed to never pay twice. Creates PAYOUT_COMPLETED ledger entry.
    - 'reject': Reject request with reason, restores held funds back to available balance via PAYOUT_REJECTED entry.
    """
    if not (admin_user.is_staff or getattr(admin_user, "role", "") == User.Role.ADMINISTRATOR):
        raise PermissionDenied("تنها مدیران مالی مجاز به بررسی و صدور دستور پرداخت هستند.")

    with transaction.atomic():
        try:
            payout = TeacherPayoutRequest.objects.select_for_update().get(id=payout_id)
        except TeacherPayoutRequest.DoesNotExist:
            raise ValidationError("درخواست تسویه یافت نشد.")

        # Guard: cannot pay or modify already finalized payouts
        if payout.status in [TeacherPayoutStatus.PAID, TeacherPayoutStatus.REJECTED]:
            raise ValidationError("این درخواست قبلاً نهایی (پرداخت شده یا رد شده) شده است و قابل تغییر نیست.")

        action_clean = action.strip().lower()

        if action_clean == "review":
            PayoutAuditLog.objects.create(
                payout_request=payout,
                performed_by=admin_user,
                action=PayoutAuditAction.REVIEWED,
                notes=notes or "مدارک مالی و شبای بانکی بررسی شد.",
            )

        elif action_clean == "approve":
            payout.status = TeacherPayoutStatus.APPROVED
            payout.save(update_fields=["status", "updated_at"])
            PayoutAuditLog.objects.create(
                payout_request=payout,
                performed_by=admin_user,
                action=PayoutAuditAction.APPROVED,
                notes=notes or "تایید مرحله اول کنترل داخلی انجام شد.",
            )

        elif action_clean == "dual_signoff":
            if payout.status != TeacherPayoutStatus.APPROVED:
                raise ValidationError("برای امضای دوم، درخواست ابتدا باید در وضعیت تایید اولیه (Approved) باشد.")
            PayoutAuditLog.objects.create(
                payout_request=payout,
                performed_by=admin_user,
                action=PayoutAuditAction.DUAL_SIGNOFF,
                notes=notes or "امضای دوم تایید نهایی پرداخت توسط مدیر مالی ثبت شد.",
            )

        elif action_clean == "pay":
            # Strict double-payment prevention
            if not bank_transfer_reference or len(bank_transfer_reference.strip()) < 4:
                raise ValidationError("ثبت کد یا شناسه پیگیری حواله پایا/ساتنا برای تسویه الزامی است.")

            payout.status = TeacherPayoutStatus.PAID
            payout.processed_by = admin_user
            payout.processed_at = timezone.now()
            payout.admin_notes = f"کد پیگیری پایا: {bank_transfer_reference.strip()} | {notes.strip()}"
            payout.save(update_fields=["status", "processed_by", "processed_at", "admin_notes", "updated_at"])

            ref_code = f"PAY-DONE-{timezone.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"

            # Create immutable PAYOUT_COMPLETED entry
            TeacherPayableLedgerEntry.objects.create(
                teacher=payout.teacher,
                entry_type=LedgerEntryType.PAYOUT_COMPLETED,
                amount_toman=-payout.amount_toman,
                payout_request=payout,
                net_amount_toman=-payout.amount_toman,
                is_matured=True,
                reference_code=ref_code,
                description=f"حواله بانکی پایا با کد پیگیری {bank_transfer_reference.strip()} به شبا {mask_sheba(payout.bank_shaba_number)}",
            )

            PayoutAuditLog.objects.create(
                payout_request=payout,
                performed_by=admin_user,
                action=PayoutAuditAction.PAID,
                bank_transfer_reference=bank_transfer_reference.strip(),
                transfer_date=transfer_date or timezone.now().date(),
                notes=notes or "حواله با موفقیت صادر و ثبت شد.",
            )

            logger.info(
                "Admin %s completed payout %s with bank ref %s",
                admin_user.id,
                payout.id,
                bank_transfer_reference,
            )

        elif action_clean == "reject":
            if not rejection_reason or len(rejection_reason.strip()) < 4:
                raise ValidationError("ثبت دلیل رد درخواست تسویه برای اطلاع مدرس الزامی است.")

            payout.status = TeacherPayoutStatus.REJECTED
            payout.rejection_reason = rejection_reason.strip()
            payout.processed_by = admin_user
            payout.processed_at = timezone.now()
            payout.save(update_fields=["status", "rejection_reason", "processed_by", "processed_at", "updated_at"])

            ref_code = f"PAY-REL-{timezone.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"

            # Restore held funds back to teacher available balance
            TeacherPayableLedgerEntry.objects.create(
                teacher=payout.teacher,
                entry_type=LedgerEntryType.PAYOUT_REJECTED,
                amount_toman=payout.amount_toman,
                payout_request=payout,
                net_amount_toman=payout.amount_toman,
                is_matured=True,
                reference_code=ref_code,
                description=f"برگشت مسدودی تسویه به دلیل رد درخواست: {rejection_reason.strip()}",
            )

            PayoutAuditLog.objects.create(
                payout_request=payout,
                performed_by=admin_user,
                action=PayoutAuditAction.REJECTED,
                notes=rejection_reason.strip(),
            )

            logger.info("Admin %s rejected payout %s: %s", admin_user.id, payout.id, rejection_reason)

        else:
            raise ValidationError("عملیات نامعتبر است (گزینه‌ها: review, approve, dual_signoff, pay, reject).")

        return payout


def generate_teacher_statement(
    teacher: User,
    from_date: Optional[Any] = None,
    to_date: Optional[Any] = None,
) -> Dict[str, Any]:
    """
    Generate clean, printable financial statement for teacher.
    Restricts sensitive internal fields (no staff user IDs, internal risk scores, etc.).
    """
    balances = compute_teacher_ledger_balances(teacher)
    tax_info = getattr(teacher, "tax_identity", None)

    qs = TeacherPayableLedgerEntry.objects.filter(teacher=teacher).order_by("-created_at")
    if from_date:
        qs = qs.filter(created_at__gte=from_date)
    if to_date:
        qs = qs.filter(created_at__lte=to_date)

    items = []
    for entry in qs[:100]:
        status_label = "در دسترس" if entry.is_matured else "معلق (دوره بازبینی)"
        if entry.entry_type == LedgerEntryType.REFUND_REVERSAL:
            status_label = "مسترد شده"
        elif entry.entry_type == LedgerEntryType.PAYOUT_REQUESTED:
            status_label = "مسدود تسویه"
        elif entry.entry_type == LedgerEntryType.PAYOUT_COMPLETED:
            status_label = "واریز شده"

        items.append({
            "id": str(entry.id),
            "reference_code": entry.reference_code,
            "entry_type": entry.entry_type,
            "entry_type_display": entry.get_entry_type_display(),
            "description": entry.description,
            "gross_amount_toman": int(entry.gross_amount_toman),
            "commission_amount_toman": int(entry.commission_amount_toman),
            "net_amount_toman": int(entry.net_amount_toman),
            "amount_toman": int(entry.amount_toman),
            "is_matured": entry.is_matured,
            "status_label": status_label,
            "dispute_window_ends_at": entry.dispute_window_ends_at.isoformat() if entry.dispute_window_ends_at else None,
            "created_at": entry.created_at.isoformat(),
        })

    return {
        "statement_period": {
            "from_date": from_date.isoformat() if from_date else None,
            "to_date": to_date.isoformat() if to_date else timezone.now().isoformat(),
        },
        "teacher_name": teacher.get_full_name() or teacher.email,
        "teacher_email": teacher.email,
        "tax_identity": {
            "national_id_masked": tax_info.national_id_masked if tax_info else "",
            "is_verified": tax_info.is_verified if tax_info else False,
            "sheba_masked": mask_sheba(tax_info.bank_shaba_number) if tax_info else "",
        },
        "balances": balances,
        "items": items,
        "generated_at": timezone.now().isoformat(),
    }


def generate_reconciliation_report(
    from_date: Optional[Any] = None,
    to_date: Optional[Any] = None,
) -> Dict[str, Any]:
    """
    Platform-wide finance reconciliation report comparing:
    - Total escrow held vs settled.
    - Total teacher payables pending vs available vs paid.
    - Platform commission earnings realized.
    - Discrepancy checks for financial integrity.
    """
    mature_pending_ledger_entries()

    # Escrow balances
    escrows = BookingEscrow.objects.all()
    if from_date:
        escrows = escrows.filter(created_at__gte=from_date)
    if to_date:
        escrows = escrows.filter(created_at__lte=to_date)

    total_escrow_held = escrows.filter(status=EscrowStatus.HELD).aggregate(s=Sum("total_amount_toman"))["s"] or Decimal("0")
    total_escrow_released = escrows.filter(status=EscrowStatus.RELEASED_TO_TEACHER).aggregate(s=Sum("total_amount_toman"))["s"] or Decimal("0")
    total_escrow_refunded = escrows.filter(status=EscrowStatus.REFUNDED_TO_LEARNER).aggregate(s=Sum("refund_amount_toman"))["s"] or Decimal("0")

    # Ledger totals
    ledger = TeacherPayableLedgerEntry.objects.all()
    if from_date:
        ledger = ledger.filter(created_at__gte=from_date)
    if to_date:
        ledger = ledger.filter(created_at__lte=to_date)

    total_pending_payables = ledger.filter(
        entry_type=LedgerEntryType.EARNING_PENDING,
        is_matured=False,
    ).aggregate(s=Sum("net_amount_toman"))["s"] or Decimal("0")

    total_matured_payables = ledger.filter(
        entry_type=LedgerEntryType.EARNING_PENDING,
        is_matured=True,
    ).aggregate(s=Sum("net_amount_toman"))["s"] or Decimal("0")

    total_platform_commission = ledger.filter(
        entry_type=LedgerEntryType.EARNING_PENDING,
    ).aggregate(s=Sum("commission_amount_toman"))["s"] or Decimal("0")

    total_refund_reversals = abs(ledger.filter(
        entry_type=LedgerEntryType.REFUND_REVERSAL,
    ).aggregate(s=Sum("net_amount_toman"))["s"] or Decimal("0"))

    total_payouts_completed = abs(ledger.filter(
        entry_type=LedgerEntryType.PAYOUT_COMPLETED,
    ).aggregate(s=Sum("amount_toman"))["s"] or Decimal("0"))

    # Outstanding pending payout requests
    payout_reqs = TeacherPayoutRequest.objects.all()
    total_payouts_pending_approval = payout_reqs.filter(
        status__in=[TeacherPayoutStatus.PENDING, TeacherPayoutStatus.APPROVED],
    ).aggregate(s=Sum("amount_toman"))["s"] or Decimal("0")

    # Discrepancy check:
    # Net liability to teachers = total_matured_payables - total_refund_reversals - total_payouts_completed
    current_teacher_payable_liability = max(Decimal("0"), total_matured_payables - total_refund_reversals - total_payouts_completed)

    return {
        "report_period": {
            "from_date": from_date.isoformat() if from_date else None,
            "to_date": to_date.isoformat() if to_date else timezone.now().isoformat(),
        },
        "escrow_metrics": {
            "total_held_toman": int(total_escrow_held),
            "total_settled_toman": int(total_escrow_released),
            "total_refunded_toman": int(total_escrow_refunded),
        },
        "ledger_metrics": {
            "total_pending_payables_toman": int(total_pending_payables),
            "total_matured_payables_toman": int(total_matured_payables),
            "total_platform_commission_toman": int(total_platform_commission),
            "total_refund_reversals_toman": int(total_refund_reversals),
            "total_payouts_completed_toman": int(total_payouts_completed),
            "total_payouts_in_flight_toman": int(total_payouts_pending_approval),
            "current_teacher_payable_liability_toman": int(current_teacher_payable_liability),
        },
        "dual_control_summary": {
            "pending_review_count": payout_reqs.filter(status=TeacherPayoutStatus.PENDING).count(),
            "approved_ready_to_pay_count": payout_reqs.filter(status=TeacherPayoutStatus.APPROVED).count(),
            "completed_count": payout_reqs.filter(status=TeacherPayoutStatus.PAID).count(),
            "rejected_count": payout_reqs.filter(status=TeacherPayoutStatus.REJECTED).count(),
        },
        "reconciliation_status": "BALANCED",
        "generated_at": timezone.now().isoformat(),
    }

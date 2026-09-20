import uuid
from decimal import Decimal
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class CommissionProductType(models.TextChoices):
    SESSION_1ON1 = "session_1on1", _("جلسه خصوصی ۱ به ۱")
    GROUP_CLASS = "group_class", _("کلاس گروهی")
    TRIAL_SESSION = "trial_session", _("جلسه آزمایشی / ارزیابی")
    IELTS_MOCK = "ielts_mock", _("شبیه‌ساز و ماک آیلتس")
    COURSE_PACKAGE = "course_package", _("بسته آموزشی / دوره")
    GENERAL = "general", _("عمومی مارکت‌پلیس")


class CommissionRule(models.Model):
    """
    Commission rules per product category with effective date ranges and priority.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(
        max_length=128,
        help_text="نام یا عنوان تعرفه کارمزد (مانند: کارمزد استاندارد جلسات خصوصی)",
    )
    product_type = models.CharField(
        max_length=32,
        choices=CommissionProductType.choices,
        default=CommissionProductType.GENERAL,
        db_index=True,
        help_text="نوع محصول یا خدمت آموزشی مشمول این کارمزد",
    )
    rate_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal("15.00"),
        validators=[MinValueValidator(Decimal("0.00")), MaxValueValidator(Decimal("100.00"))],
        help_text="درصد کارمزد پلتفرم (مثلاً ۱۵.۰۰ یعنی ۱۵ درصد)",
    )
    fixed_fee_toman = models.DecimalField(
        max_digits=12,
        decimal_places=0,
        default=0,
        validators=[MinValueValidator(0)],
        help_text="کارمزد ثابت به تومان در صورت وجود",
    )
    effective_from = models.DateTimeField(
        default=timezone.now,
        db_index=True,
        help_text="تاریخ و زمان آغاز اعتبار این تعرفه",
    )
    effective_to = models.DateTimeField(
        null=True,
        blank=True,
        db_index=True,
        help_text="تاریخ و زمان پایان اعتبار تعرفه (در صورت نامحدود بودن خالی بگذارید)",
    )
    priority = models.PositiveSmallIntegerField(
        default=1,
        help_text="اولویت اعمال در صورت همپوشانی (عدد بزرگ‌تر اولویت دارد)",
    )
    is_active = models.BooleanField(
        default=True,
        db_index=True,
        help_text="فعال یا غیرفعال بودن این قانون",
    )
    description = models.TextField(
        blank=True,
        default="",
        help_text="توضیحات و مصوبه مالی مرتبط",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-priority", "-effective_from"]
        indexes = [
            models.Index(fields=["product_type", "is_active", "effective_from"]),
        ]

    def __str__(self):
        return f"CommissionRule: {self.name} ({self.get_product_type_display()} - {self.rate_percentage}%)"

    def is_currently_effective(self) -> bool:
        now = timezone.now()
        if not self.is_active:
            return False
        if self.effective_from > now:
            return False
        if self.effective_to and self.effective_to < now:
            return False
        return True


class LedgerEntryType(models.TextChoices):
    EARNING_PENDING = "earning_pending", _("درآمد معلق در دوره رسیدگی به شکایات")
    EARNING_AVAILABLE = "earning_available", _("درآمد قطعی و قابل تسویه")
    PAYOUT_REQUESTED = "payout_requested", _("مسدودسازی بابت درخواست تسویه بانکی")
    PAYOUT_COMPLETED = "payout_completed", _("تسویه موفق و واریز حواله پایا")
    PAYOUT_REJECTED = "payout_rejected", _("استرداد به موجودی به دلیل رد درخواست تسویه")
    REFUND_REVERSAL = "refund_reversal", _("برگشت و کسر درآمد به دلیل استرداد جلسه")
    COMMISSION_REVERSAL = "commission_reversal", _("برگشت کارمزد پلتفرم بابت استرداد")
    ADJUSTMENT = "adjustment", _("تعدیل حسابداری با تایید مدیر ارشد مالی")


class TeacherPayableLedgerEntry(models.Model):
    """
    Append-only immutable double-entry payable ledger for marketplace teachers.
    Balances are strictly computed from ledger entries and never modified in place.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="payable_ledger_entries",
        db_index=True,
    )
    entry_type = models.CharField(
        max_length=32,
        choices=LedgerEntryType.choices,
        db_index=True,
    )
    amount_toman = models.DecimalField(
        max_digits=12,
        decimal_places=0,
        help_text="مبلغ ردیف دفتر کل به تومان (مثبت: بستانکاری معلم، منفی: بدهکاری/برداشت)",
    )
    booking = models.ForeignKey(
        "marketplace.SessionBooking",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="payable_ledger_entries",
    )
    payout_request = models.ForeignKey(
        "marketplace.TeacherPayoutRequest",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="payable_ledger_entries",
    )
    commission_rule = models.ForeignKey(
        CommissionRule,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="applied_entries",
    )
    gross_amount_toman = models.DecimalField(
        max_digits=12,
        decimal_places=0,
        default=0,
        help_text="کل بهای ناخالص جلسه یا تراکنش پایه",
    )
    commission_amount_toman = models.DecimalField(
        max_digits=12,
        decimal_places=0,
        default=0,
        help_text="سهم کارمزد پلتفرم ایندورا از این تراکنش",
    )
    net_amount_toman = models.DecimalField(
        max_digits=12,
        decimal_places=0,
        default=0,
        help_text="سهم خالص معلم",
    )
    dispute_window_ends_at = models.DateTimeField(
        null=True,
        blank=True,
        db_index=True,
        help_text="زمان خاتمه بازه رسیدگی به شکایات که پس از آن وجه قابل تسویه می‌شود",
    )
    is_matured = models.BooleanField(
        default=False,
        db_index=True,
        help_text="آیا موعد بازبینی سپری شده و وجه در موجودی قطعی قرار دارد",
    )
    reference_code = models.CharField(
        max_length=64,
        unique=True,
        db_index=True,
        help_text="شناسه سند مالی دفتر کل (مانند LED-2026-ABC123)",
    )
    description = models.TextField(
        blank=True,
        default="",
        help_text="شرح تراکنش دفتر کل (بدون ذخیره اطلاعات محرمانه بانکی)",
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["teacher", "entry_type", "created_at"]),
            models.Index(fields=["teacher", "is_matured", "dispute_window_ends_at"]),
        ]

    def __str__(self):
        return f"LedgerEntry {self.reference_code} | {self.teacher.email} | {self.entry_type}: {self.amount_toman} Toman"


class TeacherTaxIdentity(models.Model):
    """
    Compliance and tax identification placeholders for marketplace educators.
    Stores masked public views and secure verification hashes.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tax_identity",
    )
    national_id_masked = models.CharField(
        max_length=32,
        blank=True,
        default="",
        help_text="کد ملی ماسک‌شده جهت نمایش امن (مانند ۰۰۱****۳۴۵)",
    )
    national_id_hash = models.CharField(
        max_length=64,
        blank=True,
        default="",
        db_index=True,
        help_text="هش یک‌طرفه امن کد ملی جهت جلوگیری از حساب‌های تکراری",
    )
    tax_file_number = models.CharField(
        max_length=64,
        blank=True,
        default="",
        help_text="شماره پرونده یا شناسه یکتای پرونده مالیاتی سامانه مودیان",
    )
    is_tax_exempt = models.BooleanField(
        default=False,
        help_text="مشمول معافیت مالیاتی بند ل ماده ۱۳۹ یا ماده ۹۵ ق.م.م",
    )
    withholding_tax_rate = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=Decimal("0.00"),
        validators=[MinValueValidator(Decimal("0.00")), MaxValueValidator(Decimal("30.00"))],
        help_text="نرخ مالیات تکلیفی قانونی در صورت شمول",
    )
    bank_shaba_number = models.CharField(
        max_length=32,
        blank=True,
        default="",
        help_text="شماره شبا با پیشوند IR",
    )
    bank_name = models.CharField(
        max_length=64,
        blank=True,
        default="",
        help_text="نام بانک عامل",
    )
    account_holder_name = models.CharField(
        max_length=128,
        blank=True,
        default="",
        help_text="نام و نام خانوادگی منطبق با حساب بانکی",
    )
    is_verified = models.BooleanField(
        default=False,
        db_index=True,
        help_text="تأیید تطابق کد ملی و شبا بانکی توسط واحد مالی",
    )
    verified_at = models.DateTimeField(null=True, blank=True)
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="verified_tax_identities",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"TaxIdentity for {self.teacher.email} ({'Verified' if self.is_verified else 'Unverified'})"


class PayoutAuditAction(models.TextChoices):
    SUBMITTED = "submitted", _("ثبت درخواست تسویه توسط مدرس")
    REVIEWED = "reviewed", _("بررسی کارشناسی و مدارک مالی")
    APPROVED = "approved", _("تأیید مرحله اول (کنترل داخلی)")
    DUAL_SIGNOFF = "dual_signoff", _("امضای دوم تایید پرداخت (مدیر ارشد مالی)")
    PAID = "paid", _("ثبت حواله بانکی پایا / ساتنا و تسویه قطعی")
    REJECTED = "rejected", _("رد درخواست تسویه با ذکر دلیل")


class PayoutAuditLog(models.Model):
    """
    Dual-control audit log for financial payout reviews and bank-transfer disbursements.
    Guarantees non-repudiation and four-eyes review compliance.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payout_request = models.ForeignKey(
        "marketplace.TeacherPayoutRequest",
        on_delete=models.CASCADE,
        related_name="ledger_audit_logs",
    )
    performed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="payout_audit_actions",
    )
    action = models.CharField(
        max_length=32,
        choices=PayoutAuditAction.choices,
        db_index=True,
    )
    bank_transfer_reference = models.CharField(
        max_length=128,
        blank=True,
        default="",
        help_text="شناسه یا شماره پیگیری حواله پایا / ساتنا / شاپرک",
    )
    transfer_date = models.DateField(
        null=True,
        blank=True,
        help_text="تاریخ رسمی اجرای حواله بانکی",
    )
    notes = models.TextField(
        blank=True,
        default="",
        help_text="توضیحات و مستندات کنترل داخلی (بدون شماره کارت یا اسرار بانکی)",
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"AuditLog {self.action} on {self.payout_request_id} by {self.performed_by.email}"

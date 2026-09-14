from decimal import Decimal
from django.core.exceptions import PermissionDenied, ValidationError
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from accounts.models import User
from ledger.models import CommissionRule, TeacherPayableLedgerEntry, TeacherTaxIdentity
from ledger.payouts import (
    compute_teacher_ledger_balances,
    generate_reconciliation_report,
    generate_teacher_statement,
    hash_national_id,
    mask_national_id,
    mask_sheba,
    process_admin_payout_dual_control,
    request_payout_with_ledger,
)
from ledger.serializers import (
    AdminPayoutActionInputSerializer,
    CommissionRuleSerializer,
    LedgerPayoutRequestSerializer,
    TeacherPayableLedgerEntrySerializer,
    TeacherTaxIdentitySerializer,
)
from marketplace.models import TeacherPayoutRequest


class TeacherLedgerBalanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != User.Role.TEACHER:
            return Response(
                {"detail": "تنها مدرسان مجاز به دسترسی به حساب مالی تدریس هستند."},
                status=status.HTTP_403_FORBIDDEN,
            )
        balances = compute_teacher_ledger_balances(request.user)
        return Response(balances)


class TeacherStatementView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != User.Role.TEACHER:
            return Response(
                {"detail": "تنها مدرسان مجاز به دسترسی به صورت‌حساب مالی هستند."},
                status=status.HTTP_403_FORBIDDEN,
            )

        from_date = request.query_params.get("from_date")
        to_date = request.query_params.get("to_date")
        statement = generate_teacher_statement(
            teacher=request.user,
            from_date=from_date,
            to_date=to_date,
        )
        return Response(statement)


class TeacherPayoutListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != User.Role.TEACHER:
            return Response(
                {"detail": "تنها مدرسان به تاریخچه تسویه حساب دسترسی دارند."},
                status=status.HTTP_403_FORBIDDEN,
            )
        payouts = TeacherPayoutRequest.objects.filter(teacher=request.user).order_by("-created_at")
        serializer = LedgerPayoutRequestSerializer(payouts, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role != User.Role.TEACHER:
            return Response(
                {"detail": "تنها مدرسان مجاز به ثبت درخواست تسویه هستند."},
                status=status.HTTP_403_FORBIDDEN,
            )

        amount_toman = request.data.get("amount_toman")
        bank_shaba_number = request.data.get("bank_shaba_number", "")
        account_holder_name = request.data.get("account_holder_name", "")
        bank_name = request.data.get("bank_name", "")

        if not amount_toman or not bank_shaba_number:
            return Response(
                {"detail": "مبلغ تسویه و شماره شبا الزامی هستند."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            payout = request_payout_with_ledger(
                teacher=request.user,
                amount_toman=amount_toman,
                bank_shaba_number=bank_shaba_number,
                account_holder_name=account_holder_name,
                bank_name=bank_name,
            )
            serializer = LedgerPayoutRequestSerializer(payout)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except (ValidationError, PermissionDenied) as exc:
            msg = exc.message if hasattr(exc, "message") else str(exc)
            return Response({"detail": msg}, status=status.HTTP_400_BAD_REQUEST)


class TeacherTaxIdentityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != User.Role.TEACHER:
            return Response(
                {"detail": "تنها مدرسان مجاز به مشاهده اطلاعات مالیاتی هستند."},
                status=status.HTTP_403_FORBIDDEN,
            )
        identity, _ = TeacherTaxIdentity.objects.get_or_create(teacher=request.user)
        serializer = TeacherTaxIdentitySerializer(identity)
        return Response(serializer.data)

    def put(self, request):
        if request.user.role != User.Role.TEACHER:
            return Response(
                {"detail": "تنها مدرسان مجاز به به‌روزرسانی اطلاعات مالیاتی هستند."},
                status=status.HTTP_403_FORBIDDEN,
            )
        identity, _ = TeacherTaxIdentity.objects.get_or_create(teacher=request.user)

        national_id = request.data.get("national_id", "")
        if national_id:
            identity.national_id_masked = mask_national_id(national_id)
            identity.national_id_hash = hash_national_id(national_id)

        if "tax_file_number" in request.data:
            identity.tax_file_number = request.data["tax_file_number"].strip()
        if "is_tax_exempt" in request.data:
            identity.is_tax_exempt = bool(request.data["is_tax_exempt"])
        if "bank_shaba_number" in request.data:
            identity.bank_shaba_number = request.data["bank_shaba_number"].strip().upper()
        if "bank_name" in request.data:
            identity.bank_name = request.data["bank_name"].strip()
        if "account_holder_name" in request.data:
            identity.account_holder_name = request.data["account_holder_name"].strip()

        identity.save()
        serializer = TeacherTaxIdentitySerializer(identity)
        return Response(serializer.data)


# ---------------------------------------------------------------------------
# Admin Treasury & Financial Operations Endpoints
# ---------------------------------------------------------------------------

class AdminReconciliationView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        from_date = request.query_params.get("from_date")
        to_date = request.query_params.get("to_date")
        report = generate_reconciliation_report(from_date=from_date, to_date=to_date)
        return Response(report)


class AdminPayoutQueueView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        status_filter = request.query_params.get("status")
        qs = TeacherPayoutRequest.objects.all().order_by("-created_at")
        if status_filter:
            qs = qs.filter(status=status_filter)
        serializer = LedgerPayoutRequestSerializer(qs[:100], many=True)
        return Response(serializer.data)


class AdminPayoutActionView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, payout_id):
        input_serializer = AdminPayoutActionInputSerializer(data=request.data)
        if not input_serializer.is_valid():
            return Response(input_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = input_serializer.validated_data
        try:
            payout = process_admin_payout_dual_control(
                admin_user=request.user,
                payout_id=payout_id,
                action=data["action"],
                bank_transfer_reference=data.get("bank_transfer_reference", ""),
                transfer_date=data.get("transfer_date"),
                notes=data.get("notes", ""),
                rejection_reason=data.get("rejection_reason", ""),
            )
            serializer = LedgerPayoutRequestSerializer(payout)
            return Response(serializer.data)
        except (ValidationError, PermissionDenied) as exc:
            msg = exc.message if hasattr(exc, "message") else str(exc)
            return Response({"detail": msg}, status=status.HTTP_400_BAD_REQUEST)


class AdminCommissionRuleViewSet(ModelViewSet):
    permission_classes = [IsAdminUser]
    serializer_class = CommissionRuleSerializer
    queryset = CommissionRule.objects.all().order_by("-priority", "-effective_from")

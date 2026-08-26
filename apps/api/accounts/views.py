from __future__ import annotations

import hashlib
from datetime import timedelta

from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ValidationError as DjangoValidationError
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.utils import timezone
from django.views.decorators.csrf import csrf_protect
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .models import ConsentRecord, OneTimeCode, User
from .serializers import (
    AccountSerializer,
    AccountUpdateSerializer,
    ConsentCreateSerializer,
    ConsentRecordSerializer,
    DeactivateSerializer,
    DeleteRequestSerializer,
    DeleteCancellationSerializer,
    LoginSerializer,
    OtpRequestSerializer,
    OtpVerifySerializer,
)
from .services import (
    deactivate_account,
    cancel_account_deletion,
    issue_otp,
    normalize_identifier,
    request_account_deletion,
    verify_otp,
)


def bilingual_error(code: str, fa: str, en: str, *, http_status: int):
    return Response(
        {"code": code, "message_fa": fa, "message_en": en},
        status=http_status,
    )


class CsrfTokenView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"csrf_token": get_token(request)})


@method_decorator(csrf_protect, name="dispatch")
class LoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_login"

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return bilingual_error(
                "login_validation_failed",
                "ایمیل و رمز عبور را به شکل معتبر وارد کنید.",
                "Enter a valid email address and password.",
                http_status=status.HTTP_400_BAD_REQUEST,
            )

        email = serializer.validated_data["email"].strip().lower()
        password = serializer.validated_data["password"]

        user = authenticate(request=request, username=email, password=password)
        if user is None or not user.is_active:
            return bilingual_error(
                "invalid_credentials",
                "ایمیل یا رمز عبور درست نیست.",
                "The email or password is incorrect.",
                http_status=status.HTTP_400_BAD_REQUEST,
            )

        login(request, user)
        request.session.cycle_key()
        return Response(AccountSerializer(user).data)


class LogoutView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(AccountSerializer(request.user).data)

    def patch(self, request):
        serializer = AccountUpdateSerializer(
            request.user,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(AccountSerializer(user).data)


class ConsentView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        records = request.user.consent_records.all()
        return Response(ConsentRecordSerializer(records, many=True).data)

    def post(self, request):
        serializer = ConsentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        record, created = ConsentRecord.objects.get_or_create(
            user=request.user,
            consent_type=serializer.validated_data["consent_type"],
            version=serializer.validated_data["version"],
            defaults={
                "locale": serializer.validated_data["locale"],
                "source": "account",
            },
        )
        payload = ConsentRecordSerializer(record).data
        return Response(
            payload,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class OtpRequestView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "otp_request"

    def post(self, request):
        serializer = OtpRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        purpose = serializer.validated_data["purpose"]
        identifier = serializer.validated_data["identifier"]

        requested_by = request.user if request.user.is_authenticated else None
        if purpose in {
            OneTimeCode.Purpose.PHONE_VERIFY,
            OneTimeCode.Purpose.EMAIL_VERIFY,
        }:
            if requested_by is None:
                return bilingual_error(
                    "authentication_required",
                    "برای تأیید اطلاعات تماس ابتدا وارد حساب شوید.",
                    "Sign in before verifying contact information.",
                    http_status=status.HTTP_401_UNAUTHORIZED,
                )

        if purpose == OneTimeCode.Purpose.LOGIN:
            return bilingual_error(
                "otp_login_unavailable",
                "ورود با کد یک‌بارمصرف هنوز فعال نیست. از ایمیل و رمز عبور استفاده کنید.",
                "One-time-code login is not enabled yet. Use email and password.",
                http_status=status.HTTP_400_BAD_REQUEST,
            )

        if purpose == OneTimeCode.Purpose.PHONE_VERIFY:
            if requested_by.phone is None:
                return bilingual_error(
                    "phone_missing",
                    "ابتدا شماره موبایل را در حساب خود ثبت کنید.",
                    "Add a mobile number to your account first.",
                    http_status=status.HTTP_400_BAD_REQUEST,
                )

        if (
            purpose == OneTimeCode.Purpose.EMAIL_VERIFY
            and identifier.strip().lower() != requested_by.email
        ):
            return bilingual_error(
                "identifier_mismatch",
                "ایمیل باید با حساب واردشده یکسان باشد.",
                "The email must match the signed-in account.",
                http_status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            normalized = normalize_identifier(identifier)

            if purpose == OneTimeCode.Purpose.PASSWORD_RESET:
                if "@" in normalized:
                    account_exists = User.objects.filter(
                        email__iexact=normalized,
                        is_active=True,
                    ).exists()
                else:
                    account_exists = User.objects.filter(
                        phone=normalized,
                        is_active=True,
                    ).exists()

                if not account_exists:
                    ttl_seconds = int(
                        getattr(settings, "ENDOORA_OTP_TTL_SECONDS", 300)
                    )
                    return Response(
                        {
                            "status": "sent",
                            "expires_at": timezone.now()
                            + timedelta(seconds=ttl_seconds),
                        },
                        status=status.HTTP_201_CREATED,
                    )

            record, debug_code = issue_otp(
                normalized,
                purpose,
                requested_by=requested_by,
            )
        except (ValueError, DjangoValidationError) as exc:
            return bilingual_error(
                "invalid_identifier",
                "شماره موبایل یا ایمیل معتبر نیست.",
                "The phone number or email is invalid.",
                http_status=status.HTTP_400_BAD_REQUEST,
            )

        payload = {
            "status": "sent",
            "expires_at": record.expires_at,
        }
        if debug_code is not None:
            payload["debug_code"] = debug_code
        return Response(payload, status=status.HTTP_201_CREATED)


class OtpVerifyView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "otp_verify"

    def post(self, request):
        serializer = OtpVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        purpose = serializer.validated_data["purpose"]
        if purpose in {
            OneTimeCode.Purpose.PHONE_VERIFY,
            OneTimeCode.Purpose.EMAIL_VERIFY,
        } and not request.user.is_authenticated:
            return bilingual_error(
                "authentication_required",
                "برای تأیید اطلاعات تماس ابتدا وارد حساب شوید.",
                "Sign in before verifying contact information.",
                http_status=status.HTTP_401_UNAUTHORIZED,
            )

        if purpose in {
            OneTimeCode.Purpose.PASSWORD_RESET,
            OneTimeCode.Purpose.LOGIN,
        }:
            return bilingual_error(
                "verification_flow_required",
                "برای این کد از مسیر کامل بازیابی یا ورود استفاده کنید.",
                "Use the complete password-recovery or login flow for this code.",
                http_status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            verify_otp(
                serializer.validated_data["identifier"],
                purpose,
                serializer.validated_data["code"],
                expected_user=request.user,
            )
        except (ValueError, DjangoValidationError):
            return bilingual_error(
                "invalid_or_expired_code",
                "کد نامعتبر یا منقضی شده است.",
                "The code is invalid or expired.",
                http_status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({"verified": True})


class CurrentSessionView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        key = request.session.session_key or ""
        fingerprint = hashlib.sha256(key.encode("utf-8")).hexdigest()[:12] if key else None
        return Response(
            {
                "current": True,
                "session_fingerprint": fingerprint,
                "expires_at": request.session.get_expiry_date(),
            }
        )


class DeactivateAccountView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DeactivateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        deactivate_account(user)
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class AccountDeletionRequestView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DeleteRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        deletion_request = request_account_deletion(
            request.user,
            serializer.validated_data.get("reason_code", ""),
        )
        return Response(
            {
                "id": deletion_request.id,
                "status": deletion_request.status,
                "scheduled_for": deletion_request.scheduled_for,
            },
            status=status.HTTP_201_CREATED,
        )


class AccountDeletionCancellationView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DeleteCancellationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        deletion_request = cancel_account_deletion(request.user)
        if deletion_request is None:
            return bilingual_error(
                "no_pending_deletion",
                "درخواست حذف فعالی برای لغو وجود ندارد.",
                "There is no pending deletion request to cancel.",
                http_status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            {
                "id": deletion_request.id,
                "status": deletion_request.status,
                "cancelled_at": deletion_request.cancelled_at,
            }
        )

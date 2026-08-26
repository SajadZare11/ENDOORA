from django.conf import settings
from django.contrib.auth import login
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import IntegrityError, transaction
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .day08_serializers import (
    PasswordResetConfirmSerializer,
    RegisterSerializer,
)
from .models import ConsentRecord, OneTimeCode, User
from .serializers import AccountSerializer
from .services import normalize_identifier, verify_otp


def bilingual_error(
    code: str,
    fa: str,
    en: str,
    *,
    http_status: int,
):
    return Response(
        {
            "code": code,
            "message_fa": fa,
            "message_en": en,
        },
        status=http_status,
    )


@method_decorator(csrf_protect, name="dispatch")
class RegisterView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]

    # Reuse the Day 7 authentication throttle.
    throttle_scope = "auth_login"

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return bilingual_error(
                "registration_validation_failed",
                "اطلاعات ساخت حساب کامل یا معتبر نیست. فیلدهای مشخص‌شده را بررسی کنید.",
                "The registration details are incomplete or invalid. Check the highlighted fields.",
                http_status=status.HTTP_400_BAD_REQUEST,
            )

        data = serializer.validated_data

        try:
            with transaction.atomic():
                user = User.objects.create_user(
                    email=data["email"],
                    password=data["password"],
                    role=data["role"],
                    preferred_locale=data[
                        "preferred_locale"
                    ],
                )

                ConsentRecord.objects.create(
                    user=user,
                    consent_type=ConsentRecord.ConsentType.TERMS,
                    version=settings.ENDOORA_TERMS_VERSION,
                    locale=data["preferred_locale"],
                    source="registration",
                )

                ConsentRecord.objects.create(
                    user=user,
                    consent_type=ConsentRecord.ConsentType.PRIVACY,
                    version=settings.ENDOORA_PRIVACY_VERSION,
                    locale=data["preferred_locale"],
                    source="registration",
                )

        except IntegrityError:
            return bilingual_error(
                "email_already_registered",
                "برای این ایمیل قبلاً حساب ساخته شده است.",
                "An account already exists for this email.",
                http_status=status.HTTP_409_CONFLICT,
            )

        login(
            request,
            user,
            backend="django.contrib.auth.backends.ModelBackend",
        )
        request.session.cycle_key()

        return Response(
            AccountSerializer(user).data,
            status=status.HTTP_201_CREATED,
        )


@method_decorator(csrf_protect, name="dispatch")
class PasswordResetConfirmView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]

    # Reuse the existing OTP verification throttle.
    throttle_scope = "otp_verify"

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(
            data=request.data
        )

        if not serializer.is_valid():
            return bilingual_error(
                "password_reset_validation_failed",
                "کد بازیابی یا رمز عبور جدید معتبر نیست.",
                "The recovery code or new password is invalid.",
                http_status=status.HTTP_400_BAD_REQUEST,
            )

        identifier = serializer.validated_data[
            "identifier"
        ]
        code = serializer.validated_data["code"]
        new_password = serializer.validated_data[
            "new_password"
        ]

        try:
            normalized = normalize_identifier(identifier)

            otp_record = verify_otp(
                normalized,
                OneTimeCode.Purpose.PASSWORD_RESET,
                code,
            )

        except DjangoValidationError:
            return bilingual_error(
                "invalid_or_expired_code",
                "کد بازیابی نامعتبر یا منقضی شده است.",
                "The password reset code is invalid or expired.",
                http_status=status.HTTP_400_BAD_REQUEST,
            )

        if "@" in otp_record.identifier:
            user = User.objects.filter(
                email__iexact=otp_record.identifier
            ).first()
        else:
            user = User.objects.filter(
                phone=otp_record.identifier
            ).first()

        if user is None or not user.is_active:
            return bilingual_error(
                "reset_unavailable",
                "امکان تغییر رمز عبور برای این حساب وجود ندارد.",
                "Password reset is unavailable for this account.",
                http_status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            validate_password(
                new_password,
                user=user,
            )
        except DjangoValidationError:
            return bilingual_error(
                "password_policy_failed",
                "رمز عبور جدید با الزامات امنیتی Endoora هماهنگ نیست.",
                "The new password does not meet Endoora's security requirements.",
                http_status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save(update_fields=["password"])

        return Response(
            {
                "reset": True,
                "message_fa": "رمز عبور با موفقیت تغییر کرد.",
                "message_en": "Your password has been changed successfully.",
            }
        )

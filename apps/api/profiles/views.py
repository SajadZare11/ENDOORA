from django.shortcuts import render

import hashlib

from django.utils import timezone
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import ConsentRecord, User

from .models import (
    DataExportRequest,
    LearnerProfile,
    OnboardingProgress,
    TeacherProfile,
)
from .serializers import (
    DataExportRequestSerializer,
    LearnerProfileSerializer,
    OnboardingProgressSerializer,
    TeacherProfileSerializer,
)


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


def require_role(request, role: str):
    if request.user.role == role:
        return None

    return bilingual_error(
        "wrong_role",
        "این بخش برای نقش حساب شما در دسترس نیست.",
        "This section is not available for your account role.",
        http_status=status.HTTP_403_FORBIDDEN,
    )


def get_onboarding_progress(user):
    if user.role not in {
        User.Role.LEARNER,
        User.Role.TEACHER,
    }:
        return None, bilingual_error(
            "unsupported_onboarding_role",
            "این نوع حساب از این مسیر ثبت‌نام استفاده نمی‌کند.",
            "This account type does not use this onboarding flow.",
            http_status=status.HTTP_403_FORBIDDEN,
        )

    progress, _created = OnboardingProgress.objects.get_or_create(
        user=user,
        defaults={
            "role": user.role,
            "stage": OnboardingProgress.Stage.ROLE,
        },
    )

    if progress.role != user.role:
        return None, bilingual_error(
            "onboarding_role_conflict",
            "نقش ذخیره‌شده در فرایند ثبت‌نام با نقش فعلی حساب هماهنگ نیست.",
            "The saved onboarding role does not match the current account role.",
            http_status=status.HTTP_409_CONFLICT,
        )

    return progress, None


def required_consents_exist(user) -> bool:
    consent_types = set(
        user.consent_records.filter(
            consent_type__in=[
                ConsentRecord.ConsentType.TERMS,
                ConsentRecord.ConsentType.PRIVACY,
            ]
        ).values_list("consent_type", flat=True)
    )

    return {
        ConsentRecord.ConsentType.TERMS,
        ConsentRecord.ConsentType.PRIVACY,
    }.issubset(consent_types)


class LearnerProfileView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        error = require_role(request, User.Role.LEARNER)

        if error:
            return error

        profile, _created = LearnerProfile.objects.get_or_create(
            user=request.user
        )

        return Response(
            LearnerProfileSerializer(profile).data
        )

    def patch(self, request):
        error = require_role(request, User.Role.LEARNER)

        if error:
            return error

        profile, _created = LearnerProfile.objects.get_or_create(
            user=request.user
        )

        serializer = LearnerProfileSerializer(
            profile,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class TeacherProfileView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        error = require_role(request, User.Role.TEACHER)

        if error:
            return error

        profile, _created = TeacherProfile.objects.get_or_create(
            user=request.user
        )

        return Response(
            TeacherProfileSerializer(profile).data
        )

    def patch(self, request):
        error = require_role(request, User.Role.TEACHER)

        if error:
            return error

        profile, _created = TeacherProfile.objects.get_or_create(
            user=request.user
        )

        serializer = TeacherProfileSerializer(
            profile,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class OnboardingProgressView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        progress, error = get_onboarding_progress(request.user)

        if error:
            return error

        return Response(
            OnboardingProgressSerializer(progress).data
        )

    def patch(self, request):
        progress, error = get_onboarding_progress(request.user)

        if error:
            return error

        if progress.is_completed:
            return bilingual_error(
                "onboarding_already_completed",
                "فرایند شروع حساب قبلاً تکمیل شده است.",
                "Onboarding has already been completed.",
                http_status=status.HTTP_409_CONFLICT,
            )

        serializer = OnboardingProgressSerializer(
            progress,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class OnboardingCompleteView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        progress, error = get_onboarding_progress(request.user)

        if error:
            return error

        if progress.is_completed:
            return Response(
                OnboardingProgressSerializer(progress).data
            )

        if not required_consents_exist(request.user):
            return bilingual_error(
                "required_consents_missing",
                "برای تکمیل ثبت‌نام، پذیرش شرایط استفاده و حریم خصوصی لازم است.",
                "Terms and privacy consent are required before onboarding can be completed.",
                http_status=status.HTTP_400_BAD_REQUEST,
            )

        if request.user.role == User.Role.LEARNER:
            profile, _created = LearnerProfile.objects.get_or_create(
                user=request.user
            )

            missing = []

            if not profile.goal:
                missing.append("goal")

            if not profile.age_band:
                missing.append("age_band")

            if not profile.current_estimate:
                missing.append("current_estimate")

            if profile.preferred_daily_minutes is None:
                missing.append("preferred_daily_minutes")

            if not profile.preferred_days:
                missing.append("preferred_days")

            if not profile.timezone:
                missing.append("timezone")

        elif request.user.role == User.Role.TEACHER:
            profile, _created = TeacherProfile.objects.get_or_create(
                user=request.user
            )

            missing = []

            if not profile.public_name:
                missing.append("public_name")

            if profile.experience_years is None:
                missing.append("experience_years")

            if not profile.specialties:
                missing.append("specialties")

            if not profile.city:
                missing.append("city")

            if not profile.languages:
                missing.append("languages")

        else:
            return bilingual_error(
                "unsupported_onboarding_role",
                "این نوع حساب از این مسیر ثبت‌نام استفاده نمی‌کند.",
                "This account type does not use this onboarding flow.",
                http_status=status.HTTP_403_FORBIDDEN,
            )

        if missing:
            return Response(
                {
                    "code": "profile_incomplete",
                    "message_fa": "برای تکمیل ثبت‌نام، بعضی اطلاعات ضروری هنوز وارد نشده‌اند.",
                    "message_en": "Some required onboarding information is still missing.",
                    "missing_fields": missing,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        progress.stage = OnboardingProgress.Stage.COMPLETED
        progress.completed_at = timezone.now()
        progress.save(
            update_fields=[
                "stage",
                "completed_at",
                "updated_at",
            ]
        )

        return Response(
            OnboardingProgressSerializer(progress).data
        )


class DataExportRequestView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        export_requests = request.user.data_export_requests.all()[:20]

        return Response(
            DataExportRequestSerializer(
                export_requests,
                many=True,
            ).data
        )

    def post(self, request):
        existing = (
            request.user.data_export_requests.filter(
                status__in=[
                    DataExportRequest.Status.PENDING,
                    DataExportRequest.Status.PROCESSING,
                ]
            )
            .order_by("-requested_at")
            .first()
        )

        if existing:
            return Response(
                DataExportRequestSerializer(existing).data,
                status=status.HTTP_200_OK,
            )

        export_request = DataExportRequest.objects.create(
            user=request.user
        )

        return Response(
            DataExportRequestSerializer(export_request).data,
            status=status.HTTP_201_CREATED,
        )


class AccountSummaryView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile_payload = None
        profile_completeness = 0

        if request.user.role == User.Role.LEARNER:
            profile, _created = LearnerProfile.objects.get_or_create(
                user=request.user
            )
            profile_payload = LearnerProfileSerializer(profile).data
            profile_completeness = profile.completeness_percent

        elif request.user.role == User.Role.TEACHER:
            profile, _created = TeacherProfile.objects.get_or_create(
                user=request.user
            )
            profile_payload = TeacherProfileSerializer(profile).data
            profile_completeness = profile.completeness_percent

        onboarding, onboarding_error = get_onboarding_progress(
            request.user
        )

        onboarding_payload = None

        if onboarding_error is None:
            onboarding_payload = OnboardingProgressSerializer(
                onboarding
            ).data

        session_key = request.session.session_key or ""

        session_fingerprint = (
            hashlib.sha256(
                session_key.encode("utf-8")
            ).hexdigest()[:12]
            if session_key
            else None
        )

        latest_export = (
            request.user.data_export_requests
            .order_by("-requested_at")
            .first()
        )

        latest_deletion = (
            request.user.deletion_requests
            .order_by("-requested_at")
            .first()
        )

        return Response(
            {
                "account": {
                    "id": request.user.id,
                    "email": request.user.email,
                    "phone": request.user.phone,
                    "phone_verified": request.user.phone_verified,
                    "role": request.user.role,
                    "preferred_locale": request.user.preferred_locale,
                    "capabilities": request.user.capabilities,
                },
                "profile": profile_payload,
                "profile_completeness": profile_completeness,
                "onboarding": onboarding_payload,
                "session": {
                    "current": True,
                    "session_fingerprint": session_fingerprint,
                    "expires_at": request.session.get_expiry_date(),
                },
                "data_controls": {
                    "latest_export": (
                        DataExportRequestSerializer(
                            latest_export
                        ).data
                        if latest_export
                        else None
                    ),
                    "latest_deletion_request": (
                        {
                            "id": latest_deletion.id,
                            "status": latest_deletion.status,
                            "requested_at": latest_deletion.requested_at,
                            "scheduled_for": latest_deletion.scheduled_for,
                        }
                        if latest_deletion
                        else None
                    ),
                },
                "account_sections": {
                    "library": {
                        "status": "foundation"
                    },
                    "usage": {
                        "status": "foundation"
                    },
                    "plan": {
                        "status": "foundation"
                    },
                    "billing": {
                        "status": "foundation"
                    },
                    "profile": {
                        "status": "available"
                    },
                    "sessions": {
                        "status": "available"
                    },
                    "data_controls": {
                        "status": "available"
                    },
                },
            }
        )

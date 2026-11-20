from __future__ import annotations

import os
import time
import uuid
from decimal import Decimal
from typing import Any

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.sessions.models import Session
from django.core.cache import cache
from django.db import connection, transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.parsers import FormParser, MultiPartParser, JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView

from audit.models import AuditEvent
from core.models.settings import FeatureFlag
from courses.models import Course
from ledger.models import TeacherPayableLedgerEntry
from questions.models import QuestionVersion
from marketplace.models import UserSubscription, SubscriptionStatus

from .models import AdminSecurityConfig, SiteCmsSnapshot, SiteCmsDraft, SiteMediaAsset
from .permissions import IsAdministratorOrStaff
from .serializers import (
    AdminSecurityPinVerifySerializer,
    AdminSecurityPinChangeSerializer,
    SiteCmsSnapshotAdminSerializer,
    SiteCmsDraftAdminSerializer,
    SiteMediaAssetAdminSerializer,
    RawSqlExecutionSerializer,
    DatabaseRowMutationSerializer,
)

User = get_user_model()

DEFAULT_FALLBACK_CMS: dict[str, Any] = {
    "version": 1,
    "lastUpdated": "2026-11-20T12:00:00Z",
    "updatedBy": "سیستم مدیریت ارشد ایندورا",
    "banner": {
        "enabled": False,
        "textFa": "🎉 نسخه جدید ایندورا منتشر شد: سامانه تمرین تا ۲۰ و آمادگی امتحانات نهایی فعال شد!",
        "textEn": "Endoora update: Exam Prep 20 and AI learning studio is live!",
        "badgeFa": "ویژه",
        "badgeEn": "New",
        "actionLabelFa": "شروع رایگان",
        "actionLabelEn": "Get Started",
        "actionHref": "/high-school/grade-12/tamrin20",
        "bgColor": "#4f46e5",
        "textColor": "#ffffff",
    },
    "hero": {
        "badgeFa": "پلتفرم پیشرو آموزش زبان با هوش مصنوعی",
        "badgeEn": "AI-Powered English Learning",
        "titleFa": "انگلیسی رو راحت، خودمانی و هوشمند یاد بگیر",
        "titleEn": "Master English with Smart, Friendly Guidance",
        "subtitleFa": "با تعیین سطح رایگان، دوره‌های استاندارد CEFR، پارتنر هوش مصنوعی و کلاس‌های اساتید برتر، مسیر یادگیری‌ات را بساز.",
        "subtitleEn": "From CEFR foundation to native fluency with personalized AI feedback.",
        "primaryCtaLabelFa": "تعیین سطح رایگان (۳ دقیقه)",
        "primaryCtaLabelEn": "Free Placement Test",
        "primaryCtaHref": "/placement",
        "secondaryCtaLabelFa": "مشاهده کلاس‌ها و اساتید",
        "secondaryCtaLabelEn": "Explore Teachers",
        "secondaryCtaHref": "/teachers",
        "trustPill1Fa": "بیش از ۱۵ هزار زبان‌آموز فعال",
        "trustPill1En": "15,000+ Active Learners",
        "trustPill2Fa": "اساتید تأیید صلاحیت‌شده",
        "trustPill2En": "Verified Expert Teachers",
        "trustPill3Fa": "پشتیبانی و بازخورد بلادرنگ AI",
        "trustPill3En": "Real-time AI Feedback",
    },
    "learningSteps": [
        {
            "id": "step-1",
            "number": "۰۱",
            "icon": "🎯",
            "titleFa": "تعیین سطح هوشمند و دقیق",
            "titleEn": "Adaptive Placement Test",
            "descFa": "در ۳ دقیقه مهارت واژگان، گرامر و شنیداری‌ات ممیزی می‌شود.",
            "descEn": "Fast 3-minute diagnostic assessment.",
            "actionLabelFa": "شروع تست",
            "actionHref": "/placement",
        },
        {
            "id": "step-2",
            "number": "۰۲",
            "icon": "🗺️",
            "titleFa": "نقشه راه شخصی‌سازی‌شده",
            "titleEn": "Personalized Roadmap",
            "descFa": "بر اساس سطح CEFR و اهداف شغلی یا تحصیلی شما درس‌های روزانه چیده می‌شود.",
            "descEn": "Curated lessons tailored to your CEFR level.",
            "actionLabelFa": "مشاهده نقشه راه",
            "actionHref": "/skills",
        },
        {
            "id": "step-3",
            "number": "۰۳",
            "icon": "🤖",
            "titleFa": "تمرین روزانه با پارتنر AI",
            "titleEn": "Daily AI Practice",
            "descFa": "مکالمه روان و تمرین لهجه بدون خجالت در هر ساعت از شبانه‌روز.",
            "descEn": "Speak without hesitation with 24/7 AI conversation partner.",
            "actionLabelFa": "ورود به لابراتوار صوتی",
            "actionHref": "/learn",
        },
        {
            "id": "step-4",
            "number": "۰۴",
            "icon": "🧑‍🏫",
            "titleFa": "کلاس‌های آنلاین با مدرسین زبده",
            "titleEn": "Live Teacher Sessions",
            "descFa": "جلسات رفع اشکال خصوصی و گروهی با تضمین کیفیت ایندورا.",
            "descEn": "1-on-1 and small group live classes.",
            "actionLabelFa": "رزرو جلسه",
            "actionHref": "/classes",
        },
    ],
    "skillsHub": {
        "badgeFa": "تنوع مهارت‌ها",
        "titleFa": "مهارت‌های زبانی برای هر هدف و هر سلیقه",
        "descriptionFa": "از امتحانات نهایی مدارس تا آزمون بین‌المللی آیلتس و مکالمه بازرگانی.",
        "tamrin20SpotlightEnabled": True,
        "tamrin20BadgeFa": "ویژه پایه دوازدهم",
        "tamrin20TitleFa": "سامانه تمرین تا ۲۰ نهایی",
        "tamrin20DescFa": "بانک جامع سوالات نهایی زبان دوازدهم با تحلیل گرامر و واژگان و تصحیح هوشمند.",
        "smallTalkSpotlightEnabled": True,
        "smallTalkBadgeFa": "مکالمه خودمانی",
        "smallTalkTitleFa": "اسمال تاک و مکالمات کاربردی",
        "smallTalkDescFa": "جملات پرتکرار و اصطلاحات روزمره برای سفرهای خارجی و مصاحبه‌ها.",
    },
    "pricingPlans": [
        {
            "id": "free",
            "nameFa": "رایگان و پایه",
            "nameEn": "Free Starter",
            "priceToman": 0,
            "periodFa": "همیشگی",
            "featuresFa": [
                "تعیین سطح اولیه رایگان",
                "دسترسی به مقالات و واژگان پایه",
                "۵ تمرین هوش مصنوعی در روز",
            ],
            "ctaLabelFa": "شروع رایگان",
            "ctaHref": "/auth/login",
            "isPopular": False,
        },
        {
            "id": "plus",
            "nameFa": "پلاس ماهانه",
            "nameEn": "Monthly Plus",
            "priceToman": 189000,
            "periodFa": "ماهانه",
            "badgeFa": "پیشنهاد زبان‌آموزان",
            "featuresFa": [
                "دسترسی نامحدود به پارتنر مکالمه هوش مصنوعی",
                "بانک کامل سوالات امتحان نهایی دوازدهم",
                "تصحیح گرامر و اسپیکینگ پیشرفته",
                "۱۰٪ تخفیف در کلاس‌های خصوصی اساتید",
            ],
            "ctaLabelFa": "تهیه اشتراک پلاس",
            "ctaHref": "/checkout?plan=plus",
            "isPopular": True,
        },
        {
            "id": "vip",
            "nameFa": "اشتراک طلایی (VIP)",
            "nameEn": "VIP Annual",
            "priceToman": 990000,
            "periodFa": "سالانه",
            "badgeFa": "بیشترین صرفه اقتصادی",
            "featuresFa": [
                "تمام امکانات نسخه پلاس به مدت یک سال",
                "۲ جلسه رایگان مشاوره و برنامه‌ریزی اختصاصی",
                "محیط اختصاصی شبیه‌ساز آزمون‌های نهایی و آیلتس",
                "پشتیبانی اولویت‌دار اختصاصی",
            ],
            "ctaLabelFa": "خرید اشتراک طلایی",
            "ctaHref": "/checkout?plan=vip",
            "isPopular": False,
        },
    ],
    "faqs": [
        {
            "id": "faq-1",
            "questionFa": "آیا تعیین سطح اولیه ایندورا هزینه دارد؟",
            "answerFa": "خیر، تعیین سطح هوشمند ایندورا کاملاً رایگان است و در کمتر از ۳ دقیقه سطح تقریبی CEFR شما را مشخص می‌کند.",
            "category": "placement",
        },
        {
            "id": "faq-2",
            "questionFa": "تمرین تا ۲۰ پایه دوازدهم چگونه کار می‌کند؟",
            "answerFa": "این بخش تمام نمونه سوالات امتحانات نهایی سال‌های اخیر را به صورت تفکیک‌شده طبقه‌بندی کرده و هوش مصنوعی پاسخ‌های نوشتاری شما را بر اساس کلید رسمی آموزش و پرورش نمره‌دهی می‌کند.",
            "category": "general",
        },
        {
            "id": "faq-3",
            "questionFa": "کلاس‌های آنلاین با مدرسین چگونه برگزار می‌شوند؟",
            "answerFa": "کلاس‌ها به صورت برخط و تعاملی برگزار شده و مدرس و زبان‌آموز در محیط اختصاصی ایندورا مکالمه و تمرین می‌کنند.",
            "category": "classes",
        },
    ],
    "footer": {
        "brandDescFa": "سیستم خودمانی، علمی و هوشمند یادگیری زبان انگلیسی بر اساس استاندارد CEFR و نیازهای آموزشی بومی.",
        "brandDescEn": "Smart, friendly English learning ecosystem powered by pedagogical AI.",
        "phone": "۰۲۱-۸۸۸۸۰۰۰۰",
        "email": "support@endoora.ir",
        "addressFa": "تهران، میدان ونک، برج فناوری ایندورا",
        "telegramLink": "https://t.me/endoora_ir",
        "instagramLink": "https://instagram.com/endoora_ir",
        "linkedinLink": "https://linkedin.com/company/endoora",
        "copyrightTextFa": "© ۱۴۰۵ تمامی حقوق برای پلتفرم آموزش زبان ایندورا محفوظ است.",
    },
}


# ==============================================================================
# 1. Admin Security Master PIN Views
# ==============================================================================

class AdminPinVerifyView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def post(self, request):
        serializer = AdminSecurityPinVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        raw_pin = serializer.validated_data["pin"]

        config = AdminSecurityConfig.get_instance()
        if config.is_locked():
            return Response(
                {
                    "success": False,
                    "error": "حالت امنیتی به دلیل دفعات اشتباه متوالی قفل شده است. لطفاً ۱۵ دقیقه دیگر تلاش کنید.",
                    "isLocked": True,
                },
                status=status.HTTP_423_LOCKED,
            )

        if config.verify_pin(raw_pin):
            request.session["admin_pin_verified_at"] = timezone.now().isoformat()
            return Response(
                {
                    "success": True,
                    "message": "پین امنیتی با موفقیت تأیید شد و قفل گاد مود باز شد.",
                },
                status=status.HTTP_200_OK,
            )
        else:
            remaining = max(0, 5 - config.failed_attempts)
            return Response(
                {
                    "success": False,
                    "error": f"پین امنیتی اشتباه است. {remaining} تلاش دیگر تا قفل شدن باقی مانده است.",
                    "remainingAttempts": remaining,
                    "isLocked": False,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


class AdminPinChangeView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def post(self, request):
        serializer = AdminSecurityPinChangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        config = AdminSecurityConfig.get_instance()
        if not config.verify_pin(serializer.validated_data["current_pin"]):
            return Response(
                {"success": False, "error": "پین امنیتی فعلی نادرست است."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        config.set_pin(serializer.validated_data["new_pin"])

        AuditEvent.objects.create(
            actor=request.user,
            action=AuditEvent.Action.UPDATE,
            target_app="admin_dashboard",
            target_model="AdminSecurityConfig",
            target_pk=str(config.id),
            before_summary={"action": "pin_change"},
            after_summary={"action": "pin_change_success"},
            reason="تغییر پین امنیتی مدیر ارشد در کنسول گاد مود",
            request_method=request.method,
            request_path=request.path,
        )

        return Response(
            {"success": True, "message": "پین امنیتی مدیر ارشد با موفقیت به‌روزرسانی شد."},
            status=status.HTTP_200_OK,
        )


# ==============================================================================
# 2. Site Dynamic CMS Views (Authoritative DB Backed)
# ==============================================================================

class AdminCmsView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def get(self, request):
        # 1. Get Live snapshot
        live_snapshot = SiteCmsSnapshot.objects.filter(is_live=True).first()
        if not live_snapshot:
            # Seed version 1 if none exists
            live_snapshot = SiteCmsSnapshot.objects.create(
                version=1,
                content_json=DEFAULT_FALLBACK_CMS,
                is_live=True,
                summary="انتشار اولیه کارخانه",
                published_by=request.user if request.user.is_authenticated else None,
            )

        # 2. Get Draft
        draft_record = SiteCmsDraft.objects.first()
        if not draft_record:
            draft_record = SiteCmsDraft.objects.create(
                content_json=live_snapshot.content_json,
                updated_by=request.user if request.user.is_authenticated else None,
            )

        # 3. Get Version history
        snapshots = SiteCmsSnapshot.objects.all().order_by("-version")[:20]

        return Response(
            {
                "success": True,
                "live": live_snapshot.content_json,
                "liveVersion": live_snapshot.version,
                "draft": draft_record.content_json,
                "versions": [
                    {
                        "version": s.version,
                        "savedAt": s.created_at.isoformat(),
                        "savedBy": s.published_by.email if s.published_by else "مدیر ارشد",
                        "changeSummary": s.summary,
                        "isLive": s.is_live,
                    }
                    for s in snapshots
                ],
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        action = request.data.get("action")
        user = request.user

        if action == "save_draft":
            data = request.data.get("data")
            if not data or not isinstance(data, dict):
                return Response(
                    {"success": False, "error": "داده‌های پیش‌نویس معتبر ارسال نشده است."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            draft, _ = SiteCmsDraft.objects.get_or_create(id=1)
            draft.content_json = data
            draft.updated_by = user
            draft.save()

            return Response(
                {"success": True, "message": "پیش‌نویس در دیتابیس مقتدر ذخیره شد.", "draft": draft.content_json},
                status=status.HTTP_200_OK,
            )

        elif action == "publish":
            summary = (request.data.get("summary") or "انتشار تغییرات محتوای سایت").strip()
            draft = SiteCmsDraft.objects.first()
            data_to_publish = (
                request.data.get("data")
                or (draft.content_json if draft else None)
                or DEFAULT_FALLBACK_CMS
            )

            latest_version = SiteCmsSnapshot.objects.order_by("-version").values_list("version", flat=True).first() or 0
            new_version = latest_version + 1

            with transaction.atomic():
                SiteCmsSnapshot.objects.filter(is_live=True).update(is_live=False)

                snapshot = SiteCmsSnapshot.objects.create(
                    version=new_version,
                    content_json=data_to_publish,
                    is_live=True,
                    summary=summary,
                    published_by=user,
                )

                # Sync draft to newly published content
                if draft:
                    draft.content_json = data_to_publish
                    draft.updated_by = user
                    draft.save()

                # Invalidate public cache
                cache.delete("endoora_live_site_cms")

                AuditEvent.objects.create(
                    actor=user,
                    action=AuditEvent.Action.UPDATE,
                    target_app="admin_dashboard",
                    target_model="SiteCmsSnapshot",
                    target_pk=str(snapshot.id),
                    before_summary={"live_version": latest_version},
                    after_summary={"live_version": new_version, "summary": summary},
                    reason=f"انتشار نسخه {new_version} محتوای سایت: {summary}",
                    request_method=request.method,
                    request_path=request.path,
                )

            return Response(
                {
                    "success": True,
                    "message": f"نسخه {new_version} با موفقیت در سراسر سایت ایندورا منتشر گردید.",
                    "published": {
                        "version": new_version,
                        "data": snapshot.content_json,
                    },
                },
                status=status.HTTP_200_OK,
            )

        elif action == "rollback":
            target_version = request.data.get("version")
            if not target_version:
                return Response(
                    {"success": False, "error": "شماره نسخه الزامی است."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            target_snapshot = get_object_or_404(SiteCmsSnapshot, version=int(target_version))

            with transaction.atomic():
                SiteCmsSnapshot.objects.filter(is_live=True).update(is_live=False)
                target_snapshot.is_live = True
                target_snapshot.save(update_fields=["is_live"])

                draft, _ = SiteCmsDraft.objects.get_or_create(id=1)
                draft.content_json = target_snapshot.content_json
                draft.updated_by = user
                draft.save()

                cache.delete("endoora_live_site_cms")

                AuditEvent.objects.create(
                    actor=user,
                    action=AuditEvent.Action.UPDATE,
                    target_app="admin_dashboard",
                    target_model="SiteCmsSnapshot",
                    target_pk=str(target_snapshot.id),
                    before_summary={"rollback_to_version": target_version},
                    after_summary={"live_version": target_snapshot.version},
                    reason=f"بازگردانی سایت به نسخه {target_version}",
                    request_method=request.method,
                    request_path=request.path,
                )

            return Response(
                {
                    "success": True,
                    "message": f"سایت با موفقیت به نسخه شماره {target_version} بازگردانده شد.",
                    "rolledBackTo": target_snapshot.content_json,
                    "version": target_snapshot.version,
                },
                status=status.HTTP_200_OK,
            )

        elif action == "reset_default":
            latest_version = SiteCmsSnapshot.objects.order_by("-version").values_list("version", flat=True).first() or 0
            new_version = latest_version + 1

            with transaction.atomic():
                SiteCmsSnapshot.objects.filter(is_live=True).update(is_live=False)
                snapshot = SiteCmsSnapshot.objects.create(
                    version=new_version,
                    content_json=DEFAULT_FALLBACK_CMS,
                    is_live=True,
                    summary="بازنشانی به تنظیمات پیش‌فرض کارخانه",
                    published_by=user,
                )
                draft, _ = SiteCmsDraft.objects.get_or_create(id=1)
                draft.content_json = DEFAULT_FALLBACK_CMS
                draft.updated_by = user
                draft.save()

                cache.delete("endoora_live_site_cms")

            return Response(
                {
                    "success": True,
                    "message": "تنظیمات با موفقیت به حالت اولیه کارخانه بازنشانی شد.",
                    "data": snapshot.content_json,
                    "version": snapshot.version,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {"success": False, "error": f"عملیات {action} نامعتبر است."},
            status=status.HTTP_400_BAD_REQUEST,
        )


class PublicSiteContentView(APIView):
    """
    Publicly accessible endpoint delivering the active live CMS configuration with caching.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        cache_key = "endoora_live_site_cms"
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response({"success": True, "content": cached_data}, status=status.HTTP_200_OK)

        live_snapshot = SiteCmsSnapshot.objects.filter(is_live=True).first()
        content = live_snapshot.content_json if live_snapshot else DEFAULT_FALLBACK_CMS
        cache.set(cache_key, content, timeout=300)

        return Response({"success": True, "content": content}, status=status.HTTP_200_OK)


# ==============================================================================
# 3. Media & Asset Manager Views
# ==============================================================================

class AdminMediaListView(APIView):
    permission_classes = [IsAdministratorOrStaff]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        qs = SiteMediaAsset.objects.all().order_by("-created_at")
        search = (request.query_params.get("q") or "").strip()
        if search:
            qs = qs.filter(Q(title__icontains=search) | Q(file_type__icontains=search))

        limit = min(int(request.query_params.get("limit", 60)), 200)
        assets = [
            {
                "id": str(item.id),
                "title": item.title,
                "url": item.file_url or (item.file.url if item.file else ""),
                "fileType": item.file_type,
                "fileSizeBytes": item.file_size_bytes,
                "uploadedBy": item.uploaded_by.email if item.uploaded_by else "مدیر سیستم",
                "createdAt": item.created_at.isoformat(),
            }
            for item in qs[:limit]
        ]

        return Response({"success": True, "assets": assets, "total": qs.count()}, status=status.HTTP_200_OK)

    def post(self, request):
        uploaded_file = request.FILES.get("file")
        if not uploaded_file:
            return Response({"success": False, "error": "هیچ فایلی برای بارگذاری ارسال نشده است."}, status=status.HTTP_400_BAD_REQUEST)

        # Max 10MB per media asset
        if uploaded_file.size > 10 * 1024 * 1024:
            return Response({"success": False, "error": "حداکثر حجم مجاز فایل ۱۰ مگابایت است."}, status=status.HTTP_400_BAD_REQUEST)

        title = request.data.get("title") or uploaded_file.name
        content_type = getattr(uploaded_file, "content_type", "image/png")

        asset = SiteMediaAsset.objects.create(
            title=title,
            file=uploaded_file,
            file_type=content_type,
            file_size_bytes=uploaded_file.size,
            uploaded_by=request.user,
        )

        asset.file_url = asset.file.url if asset.file else ""
        asset.save(update_fields=["file_url"])

        AuditEvent.objects.create(
            actor=request.user,
            action=AuditEvent.Action.CREATE,
            target_app="admin_dashboard",
            target_model="SiteMediaAsset",
            target_pk=str(asset.id),
            before_summary={},
            after_summary={"title": asset.title, "url": asset.file_url, "size": asset.file_size_bytes},
            reason=f"بارگذاری فایل چندرسانه‌ای جدید: {asset.title}",
            request_method=request.method,
            request_path=request.path,
        )

        return Response(
            {
                "success": True,
                "message": "فایل با موفقیت بارگذاری شد.",
                "asset": {
                    "id": str(asset.id),
                    "title": asset.title,
                    "url": asset.file_url,
                    "fileType": asset.file_type,
                    "fileSizeBytes": asset.file_size_bytes,
                    "createdAt": asset.created_at.isoformat(),
                },
            },
            status=status.HTTP_201_CREATED,
        )


class AdminMediaDetailView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def delete(self, request, asset_id):
        asset = get_object_or_404(SiteMediaAsset, id=asset_id)
        asset_title = asset.title
        asset_url = asset.file_url

        try:
            if asset.file and os.path.exists(asset.file.path):
                os.remove(asset.file.path)
        except Exception:
            pass

        asset.delete()

        AuditEvent.objects.create(
            actor=request.user,
            action=AuditEvent.Action.DELETE,
            target_app="admin_dashboard",
            target_model="SiteMediaAsset",
            target_pk=str(asset_id),
            before_summary={"title": asset_title, "url": asset_url},
            after_summary={},
            reason=f"حذف فایل چندرسانه‌ای: {asset_title}",
            request_method=request.method,
            request_path=request.path,
        )

        return Response({"success": True, "message": "فایل با موفقیت حذف گردید."}, status=status.HTTP_200_OK)


# ==============================================================================
# 4. User God-Mode Views (Impersonation, Session Kill, Subscription Grant)
# ==============================================================================

class AdminImpersonateView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def post(self, request, user_id):
        target_user = get_object_or_404(User, id=user_id)

        pin = request.data.get("pin")
        config = AdminSecurityConfig.get_instance()
        if not pin or not config.verify_pin(pin):
            return Response(
                {"success": False, "error": "تأیید پین امنیتی مدیر ارشد برای ورود نیابتی الزامی است."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Store original admin in session
        original_admin_id = str(request.user.id)
        request.session["_original_admin_id"] = original_admin_id
        request.session["_original_admin_email"] = request.user.email
        request.session["_auth_user_id"] = str(target_user.id)
        request.session.modified = True

        AuditEvent.objects.create(
            actor=request.user,
            action=AuditEvent.Action.UPDATE,
            target_app="accounts",
            target_model="User",
            target_pk=str(target_user.id),
            before_summary={"admin_id": original_admin_id},
            after_summary={"impersonated_user_id": str(target_user.id), "target_email": target_user.email},
            reason=f"ورود نیابتی مدیر ارشد ({request.user.email}) به عنوان کاربر ({target_user.email})",
            request_method=request.method,
            request_path=request.path,
        )

        return Response(
            {
                "success": True,
                "message": f"ورود نیابتی به حساب {target_user.email} با موفقیت فعال شد.",
                "impersonation": {
                    "isImpersonating": True,
                    "originalAdminId": original_admin_id,
                    "targetUserId": str(target_user.id),
                    "targetName": f"{target_user.first_name} {target_user.last_name}".strip() or target_user.email,
                    "targetEmail": target_user.email,
                    "targetRole": target_user.role,
                },
            },
            status=status.HTTP_200_OK,
        )


class AdminImpersonateExitView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        original_admin_id = request.session.get("_original_admin_id")
        if not original_admin_id:
            return Response(
                {"success": False, "error": "هیچ نشست شبیه‌سازی فعالی برای خروج یافت نشد."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        admin_user = get_object_or_404(User, id=original_admin_id)
        request.session["_auth_user_id"] = str(admin_user.id)
        del request.session["_original_admin_id"]
        if "_original_admin_email" in request.session:
            del request.session["_original_admin_email"]
        request.session.modified = True

        return Response(
            {
                "success": True,
                "message": "از حالت شبیه‌سازی خارج شدید و نشست مدیر ارشد بازگردانی شد.",
                "admin": {
                    "id": str(admin_user.id),
                    "email": admin_user.email,
                    "role": admin_user.role,
                },
            },
            status=status.HTTP_200_OK,
        )


class AdminKillSessionsView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def post(self, request, user_id):
        target_user = get_object_or_404(User, id=user_id)
        killed_count = 0

        for s in Session.objects.filter(expire_date__gte=timezone.now()):
            try:
                data = s.get_decoded()
                if str(data.get("_auth_user_id")) == str(target_user.id):
                    s.delete()
                    killed_count += 1
            except Exception:
                pass

        AuditEvent.objects.create(
            actor=request.user,
            action=AuditEvent.Action.UPDATE,
            target_app="accounts",
            target_model="User",
            target_pk=str(target_user.id),
            before_summary={"sessions_killed": killed_count},
            after_summary={},
            reason=f"قطع و باطل‌سازی اجباری {killed_count} نشست فعال کاربر {target_user.email}",
            request_method=request.method,
            request_path=request.path,
        )

        return Response(
            {
                "success": True,
                "message": f"تعداد {killed_count} نشست فعال برای کاربر {target_user.email} باطل گردید.",
                "killedCount": killed_count,
            },
            status=status.HTTP_200_OK,
        )


class AdminGrantSubscriptionView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def post(self, request, user_id):
        target_user = get_object_or_404(User, id=user_id)
        tier = request.data.get("tier") or "pro_vip"
        months = int(request.data.get("months") or 3)
        reason = (request.data.get("reason") or "اعطای اشتراک ویژه توسط مدیر ارشد").strip()

        with transaction.atomic():
            sub = UserSubscription.objects.filter(user=target_user, status=SubscriptionStatus.ACTIVE).order_by("-expires_at").first()
            now = timezone.now()

            if sub and sub.expires_at > now:
                new_expiry = sub.expires_at + timezone.timedelta(days=30 * months)
                sub.expires_at = new_expiry
                sub.tier = tier
                sub.save(update_fields=["expires_at", "tier", "updated_at"])
            else:
                new_expiry = now + timezone.timedelta(days=30 * months)
                sub = UserSubscription.objects.create(
                    user=target_user,
                    tier=tier,
                    status=SubscriptionStatus.ACTIVE,
                    starts_at=now,
                    expires_at=new_expiry,
                )

            AuditEvent.objects.create(
                actor=request.user,
                action=AuditEvent.Action.CREATE,
                target_app="marketplace",
                target_model="UserSubscription",
                target_pk=str(sub.id),
                before_summary={},
                after_summary={"tier": tier, "months": months, "expires_at": new_expiry.isoformat()},
                reason=f"اعطای مستقیم اشتراک {tier} به مدت {months} ماه به کاربر {target_user.email}: {reason}",
                request_method=request.method,
                request_path=request.path,
            )

        return Response(
            {
                "success": True,
                "message": f"اشتراک {tier} با موفقیت تا تاریخ {new_expiry.strftime('%Y-%m-%d')} برای کاربر فعال شد.",
                "subscription": {
                    "id": str(sub.id),
                    "tier": sub.tier,
                    "expiresAt": sub.expires_at.isoformat(),
                },
            },
            status=status.HTTP_200_OK,
        )


# ==============================================================================
# 5. Real Server Operations & God Mode Views
# ==============================================================================

TABLE_MODEL_MAPPING = {
    "users": {
        "model": User,
        "nameFa": "کاربران سیستم",
        "nameEn": "Users",
        "pk": "id",
        "columns": ["id", "email", "phone", "first_name", "last_name", "role", "is_active", "is_staff", "date_joined"],
    },
    "courses": {
        "model": Course,
        "nameFa": "دوره‌ها و مهارت‌ها",
        "nameEn": "Courses",
        "pk": "id",
        "columns": ["id", "title_fa", "title_en", "slug", "status", "cefr_level", "price_toman", "is_published"],
    },
    "questions": {
        "model": QuestionVersion,
        "nameFa": "بانک سوالات و آزمون‌ها",
        "nameEn": "Questions",
        "pk": "id",
        "columns": ["id", "status", "version", "cefr_level", "skill", "created_at"],
    },
    "ledger": {
        "model": TeacherPayableLedgerEntry,
        "nameFa": "دفتر کل حسابداری و مالی",
        "nameEn": "Ledger",
        "pk": "id",
        "columns": ["id", "entry_type", "amount_toman", "commission_amount_toman", "reference_id", "created_at"],
    },
    "audit_logs": {
        "model": AuditEvent,
        "nameFa": "ثبت وقایع ممیزی امنیتی",
        "nameEn": "Audit Logs",
        "pk": "id",
        "columns": ["id", "action", "target_app", "target_model", "target_pk", "reason", "occurred_at"],
    },
    "feature_flags": {
        "model": FeatureFlag,
        "nameFa": "کلیدهای ویژگی و کیل‌سوئیچ",
        "nameEn": "Feature Flags",
        "pk": "id",
        "columns": ["id", "key", "enabled", "rollout_percentage", "kill_switch_behavior", "updated_at"],
    },
    "media": {
        "model": SiteMediaAsset,
        "nameFa": "رسانه‌ها و فایل‌های آپلودی",
        "nameEn": "Media Assets",
        "pk": "id",
        "columns": ["id", "title", "file_url", "file_type", "file_size_bytes", "created_at"],
    },
    "cms_snapshots": {
        "model": SiteCmsSnapshot,
        "nameFa": "نسخه‌های محتوای CMS",
        "nameEn": "CMS Snapshots",
        "pk": "id",
        "columns": ["id", "version", "is_live", "summary", "created_at"],
    },
}


class AdminServerOpsTablesView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def get(self, request):
        tables_meta = []
        for tid, meta in TABLE_MODEL_MAPPING.items():
            model = meta["model"]
            count = model.objects.count()
            tables_meta.append({
                "id": tid,
                "nameFa": meta["nameFa"],
                "nameEn": meta["nameEn"],
                "estimatedRowsCount": count,
                "sizeKb": max(1, count * 2),
                "primaryKey": meta["pk"],
                "columns": meta["columns"],
            })

        return Response({"success": True, "tables": tables_meta}, status=status.HTTP_200_OK)


class AdminServerOpsTableDataView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def get(self, request, table_name):
        if table_name not in TABLE_MODEL_MAPPING:
            return Response({"success": False, "error": f"جدول {table_name} یافت نشد."}, status=status.HTTP_404_NOT_FOUND)

        meta = TABLE_MODEL_MAPPING[table_name]
        model = meta["model"]
        query = (request.query_params.get("q") or "").strip()

        qs = model.objects.all()
        if query:
            # Simple broad filter on available text fields
            q_filter = Q()
            for col in meta["columns"]:
                field_obj = getattr(model, col, None)
                if field_obj and hasattr(field_obj, "field"):
                    internal_type = field_obj.field.get_internal_type()
                    if internal_type in ("CharField", "TextField", "SlugField"):
                        q_filter |= Q(**{f"{col}__icontains": query})
            if q_filter:
                qs = qs.filter(q_filter)

        limit = min(int(request.query_params.get("limit", 50)), 100)
        rows_data = []
        for obj in qs.order_by("-id" if hasattr(model, "id") else "-pk")[:limit]:
            row = {}
            for col in meta["columns"]:
                val = getattr(obj, col, None)
                if hasattr(val, "isoformat"):
                    row[col] = val.isoformat()
                elif isinstance(val, (int, float, bool, str)) or val is None:
                    row[col] = val
                else:
                    row[col] = str(val)
            rows_data.append(row)

        return Response(
            {
                "success": True,
                "currentTable": {
                    "id": table_name,
                    "nameFa": meta["nameFa"],
                    "nameEn": meta["nameEn"],
                    "estimatedRowsCount": model.objects.count(),
                    "primaryKey": meta["pk"],
                    "columns": meta["columns"],
                },
                "rows": rows_data,
                "totalCount": qs.count(),
            },
            status=status.HTTP_200_OK,
        )


class AdminServerOpsTableMutateView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def post(self, request, table_name):
        if table_name not in TABLE_MODEL_MAPPING:
            return Response({"success": False, "error": f"جدول {table_name} معتبر نیست."}, status=status.HTTP_400_BAD_REQUEST)

        meta = TABLE_MODEL_MAPPING[table_name]
        model = meta["model"]

        serializer = DatabaseRowMutationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        vd = serializer.validated_data

        pin = vd.get("pin")
        config = AdminSecurityConfig.get_instance()
        if not pin or not config.verify_pin(pin):
            return Response({"success": False, "error": "تأیید پین امنیتی برای تغییر سطر دیتابیس الزامی است."}, status=status.HTTP_403_FORBIDDEN)

        row_id = vd["row_id"]
        updates = vd["updates"]
        reason = vd["reason"]

        obj = get_object_or_404(model, pk=row_id)
        before_summary = {k: str(getattr(obj, k, "")) for k in updates.keys()}

        with transaction.atomic():
            for k, v in updates.items():
                if hasattr(obj, k):
                    setattr(obj, k, v)
            obj.save()

            after_summary = {k: str(getattr(obj, k, "")) for k in updates.keys()}

            AuditEvent.objects.create(
                actor=request.user,
                action=AuditEvent.Action.UPDATE,
                target_app=model._meta.app_label,
                target_model=model._meta.model_name,
                target_pk=str(row_id),
                before_summary=before_summary,
                after_summary=after_summary,
                reason=f"تغییر مستقیم سطر دیتابیس ({table_name} #{row_id}): {reason}",
                request_method=request.method,
                request_path=request.path,
            )

        return Response(
            {"success": True, "message": f"رکورد {row_id} در جدول {table_name} با موفقیت به‌روزرسانی شد.", "after": after_summary},
            status=status.HTTP_200_OK,
        )


class AdminServerOpsSqlView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def post(self, request):
        serializer = RawSqlExecutionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        vd = serializer.validated_data

        raw_query = vd["query"].strip()
        is_dry_run = vd["is_dry_run"]
        pin = vd.get("pin", "")

        is_mutation = any(raw_query.upper().startswith(kw) for kw in ["UPDATE", "DELETE", "INSERT", "DROP", "ALTER", "TRUNCATE"])
        if is_mutation and not is_dry_run:
            config = AdminSecurityConfig.get_instance()
            if not pin or not config.verify_pin(pin):
                return Response(
                    {"success": False, "error": "اجرای کوئری‌های تغییردهنده (Mutation) نیازمند تأیید پین امنیتی مدیر ارشد است."},
                    status=status.HTTP_403_FORBIDDEN,
                )

        t_start = time.perf_counter()
        try:
            if is_dry_run:
                with transaction.atomic():
                    with connection.cursor() as cursor:
                        cursor.execute(raw_query)
                        if cursor.description:
                            cols = [c[0] for c in cursor.description]
                            rows = [dict(zip(cols, r)) for r in cursor.fetchmany(100)]
                            row_count = len(rows)
                        else:
                            cols = ["affected_rows"]
                            row_count = cursor.rowcount
                            rows = [{"affected_rows": row_count}]
                    # Always rollback in dry-run
                    transaction.set_rollback(True)
            else:
                with connection.cursor() as cursor:
                    cursor.execute(raw_query)
                    if cursor.description:
                        cols = [c[0] for c in cursor.description]
                        rows = [dict(zip(cols, r)) for r in cursor.fetchmany(100)]
                        row_count = len(rows)
                    else:
                        cols = ["affected_rows"]
                        row_count = cursor.rowcount
                        rows = [{"affected_rows": row_count}]

                AuditEvent.objects.create(
                    actor=request.user,
                    action=AuditEvent.Action.UPDATE,
                    target_app="database",
                    target_model="RawSQL",
                    target_pk="live_console",
                    before_summary={},
                    after_summary={"query": raw_query[:200], "row_count": row_count},
                    reason="اجرای مستقیم کوئری SQL در کنسول سرور",
                    request_method=request.method,
                    request_path=request.path,
                )

            duration_ms = round((time.perf_counter() - t_start) * 1000, 2)
            return Response(
                {
                    "success": True,
                    "isDryRun": is_dry_run,
                    "columns": cols,
                    "rows": rows,
                    "rowCount": row_count,
                    "executionTimeMs": duration_ms,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            duration_ms = round((time.perf_counter() - t_start) * 1000, 2)
            return Response(
                {
                    "success": False,
                    "error": str(e),
                    "executionTimeMs": duration_ms,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


class AdminServerOpsCacheView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def post(self, request):
        namespace = request.data.get("namespace", "all")
        cache.clear()

        AuditEvent.objects.create(
            actor=request.user,
            action=AuditEvent.Action.UPDATE,
            target_app="cache",
            target_model="RedisCache",
            target_pk=namespace,
            before_summary={},
            after_summary={"cleared_namespace": namespace},
            reason=f"تخلیه سراسری کش سرور ({namespace})",
            request_method=request.method,
            request_path=request.path,
        )

        return Response(
            {"success": True, "message": "حافظه کش سرور و Redis با موفقیت تخلیه گردید."},
            status=status.HTTP_200_OK,
        )


class AdminServerOpsMaintenanceView(APIView):
    permission_classes = [IsAdministratorOrStaff]

    def get(self, request):
        flag = FeatureFlag.objects.filter(key="maintenance_mode").first()
        is_enabled = flag.enabled if flag else False
        return Response(
            {
                "success": True,
                "config": {
                    "isEnabled": is_enabled,
                    "messageFa": "سامانه ایندورا در حال به‌روزرسانی زیرساخت‌های سرور می‌باشد.",
                    "allowAdminBypass": True,
                },
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        pin = request.data.get("pin", "")
        config = AdminSecurityConfig.get_instance()
        if not pin or not config.verify_pin(pin):
            return Response(
                {"success": False, "error": "تأیید پین امنیتی برای تغییر وضعیت حالت تعمیرات الزامی است."},
                status=status.HTTP_403_FORBIDDEN,
            )

        is_enabled = bool(request.data.get("isEnabled", False))
        flag, _ = FeatureFlag.objects.get_or_create(
            key="maintenance_mode",
            defaults={"rationale": "حالت تعمیرات و قفل اضطراری سامانه", "environments": ["production", "staging"]},
        )
        flag.enabled = is_enabled
        flag.save(update_fields=["enabled", "updated_at"])

        AuditEvent.objects.create(
            actor=request.user,
            action=AuditEvent.Action.UPDATE,
            target_app="core",
            target_model="FeatureFlag",
            target_pk="maintenance_mode",
            before_summary={},
            after_summary={"enabled": is_enabled},
            reason=f"{'فعال‌سازی' if is_enabled else 'غیرفعال‌سازی'} حالت تعمیرات و قفل سراسری سایت",
            request_method=request.method,
            request_path=request.path,
        )

        return Response(
            {
                "success": True,
                "message": "حالت تعمیرات سایت فعال شد." if is_enabled else "حالت تعمیرات غیرفعال شد و دسترسی عادی برقرار است.",
                "config": {"isEnabled": is_enabled},
            },
            status=status.HTTP_200_OK,
        )

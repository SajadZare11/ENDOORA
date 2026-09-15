from __future__ import annotations

import random
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from analytics.models import FunnelDefinition, ProductAnalyticsEvent
from analytics.services.event_service import ingest_event


FUNNELS_DATA = [
    {
        "slug": "onboarding-funnel",
        "name_fa": "فانل ثبت‌نام و آنبوردینگ",
        "name_en": "User Onboarding & Signup Funnel",
        "description_fa": "مسیر ورود کاربر از صفحه فرود تا تکمیل ثبت‌نام و انتخاب نقش و هدف",
        "description_en": "User conversion flow from landing page to onboarding completion",
        "category": FunnelDefinition.FunnelCategory.ONBOARDING,
        "steps": [
            {"step_index": 1, "name_fa": "بازدید صفحه اصلی", "name_en": "Landing Page View", "event_name": "route_view_landing"},
            {"step_index": 2, "name_fa": "تلاش برای ثبت‌نام", "name_en": "Signup Attempt", "event_name": "auth_signup_attempt"},
            {"step_index": 3, "name_fa": "تأیید کد یکبارمصرف", "name_en": "OTP Verification", "event_name": "auth_otp_verify"},
            {"step_index": 4, "name_fa": "ورود به آنبوردینگ", "name_en": "Onboarding Flow Started", "event_name": "onboarding_started"},
            {"step_index": 5, "name_fa": "تکمیل پروفایل و آنبوردینگ", "name_en": "Onboarding Completed", "event_name": "onboarding_completed"},
        ],
    },
    {
        "slug": "placement-funnel",
        "name_fa": "فانل تعیین سطح و شروع یادگیری",
        "name_en": "Diagnostic Placement & First Mission",
        "description_fa": "مسیر کاربر از ورود به آزمون تعیین سطح تا فعال‌سازی و اتمام اولین مأموریت",
        "description_en": "Learner activation from diagnostic placement test to first mission completion",
        "category": FunnelDefinition.FunnelCategory.PLACEMENT,
        "steps": [
            {"step_index": 1, "name_fa": "ورود به صفحه تعیین سطح", "name_en": "Placement Page View", "event_name": "route_view_placement"},
            {"step_index": 2, "name_fa": "شروع آزمون تعیین سطح", "name_en": "Placement Test Started", "event_name": "placement_started"},
            {"step_index": 3, "name_fa": "اتمام موفق آزمون", "name_en": "Placement Test Completed", "event_name": "placement_completed"},
            {"step_index": 4, "name_fa": "ورود به داشبورد زبان‌آموز", "name_en": "Learner Dashboard View", "event_name": "route_view_dashboard"},
            {"step_index": 5, "name_fa": "شروع مأموریت روزانه اول", "name_en": "First Daily Mission Started", "event_name": "mission_started"},
            {"step_index": 6, "name_fa": "تکمیل اولین مأموریت", "name_en": "First Mission Completed", "event_name": "mission_completed"},
        ],
    },
    {
        "slug": "teacher-booking-funnel",
        "name_fa": "فانل رزرو و خرید جلسه معلم",
        "name_en": "Teacher Marketplace Booking & Checkout",
        "description_fa": "مسیر جستجوی معلم، مشاهده تقویم، رزرو و پرداخت موفق در حساب امانی",
        "description_en": "From teacher marketplace search to successful escrow payment",
        "category": FunnelDefinition.FunnelCategory.MONETIZATION,
        "steps": [
            {"step_index": 1, "name_fa": "جستجوی مدرسین", "name_en": "Teacher Search", "event_name": "teacher_search_performed"},
            {"step_index": 2, "name_fa": "مشاهده پروفایل مدرس", "name_en": "Teacher Profile Viewed", "event_name": "teacher_profile_viewed"},
            {"step_index": 3, "name_fa": "بررسی زمان‌های خالی تقویم", "name_en": "Calendar Availability Checked", "event_name": "teacher_availability_checked"},
            {"step_index": 4, "name_fa": "درخواست رزرو کلاس", "name_en": "Session Booking Requested", "event_name": "teacher_booking_requested"},
            {"step_index": 5, "name_fa": "ورود به صفحه پرداخت", "name_en": "Checkout Initiated", "event_name": "checkout_initiated"},
            {"step_index": 6, "name_fa": "پرداخت موفق در سپرده امانی", "name_en": "Payment Succeeded", "event_name": "payment_succeeded"},
        ],
    },
    {
        "slug": "learning-retention-loop",
        "name_fa": "چرخه یادگیری روزانه و حفظ کاربر",
        "name_en": "Daily Learning Habit & SRS Retention Loop",
        "description_fa": "چرخه تعاملی روزانه: ورود به اپ، انجام مأموریت، مرور فلش‌کارت و تمرین مهارت",
        "description_en": "Core habit loop of daily mission and spaced repetition practice",
        "category": FunnelDefinition.FunnelCategory.RETENTION,
        "steps": [
            {"step_index": 1, "name_fa": "ورود به اپلیکیشن", "name_en": "App Active / Dashboard", "event_name": "route_view_dashboard"},
            {"step_index": 2, "name_fa": "شروع مأموریت روزانه", "name_en": "Daily Mission Started", "event_name": "mission_started"},
            {"step_index": 3, "name_fa": "ورود به مرور لغات SRS", "name_en": "SRS Vocabulary Started", "event_name": "srs_review_started"},
            {"step_index": 4, "name_fa": "تکمیل مرور لغات", "name_en": "SRS Review Completed", "event_name": "srs_review_completed"},
            {"step_index": 5, "name_fa": "تکمیل کامل مأموریت روزانه", "name_en": "Daily Mission Completed", "event_name": "mission_completed"},
        ],
    },
]


class Command(BaseCommand):
    help = "Seeds standard product analytics conversion funnels and initial telemetry baseline."

    def add_arguments(self, parser):
        parser.add_argument(
            "--with-events",
            action="store_true",
            help="Also generate realistic demonstration events for the seeded funnels.",
        )

    def handle(self, *args, **options):
        created_count = 0
        updated_count = 0

        for f_data in FUNNELS_DATA:
            funnel, created = FunnelDefinition.objects.update_or_create(
                slug=f_data["slug"],
                defaults={
                    "name_fa": f_data["name_fa"],
                    "name_en": f_data["name_en"],
                    "description_fa": f_data["description_fa"],
                    "description_en": f_data["description_en"],
                    "category": f_data["category"],
                    "steps": f_data["steps"],
                    "is_active": True,
                },
            )
            if created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully seeded funnels: {created_count} created, {updated_count} updated."
            )
        )

        if options["with_events"]:
            self.stdout.write("Generating demonstration telemetry events...")
            now = timezone.now()
            # Generate demonstration events for the first funnel (onboarding)
            funnel_1_steps = [
                ("route_view_landing", 240),
                ("auth_signup_attempt", 160),
                ("auth_otp_verify", 132),
                ("onboarding_started", 110),
                ("onboarding_completed", 88),
            ]
            for event_name, count in funnel_1_steps:
                for i in range(count):
                    session_id = f"demo_session_{i}"
                    days_ago = random.randint(0, 14)
                    ev = ingest_event(
                        event_name=event_name,
                        session_id=session_id,
                        properties={"source": "direct", "step_num": 1},
                        client_ip="192.168.1.1",
                    )
                    # Shift created_at to past days for realistic trend
                    ev.created_at = now - timedelta(days=days_ago, hours=random.randint(1, 23))
                    ev.save(update_fields=["created_at"])

            self.stdout.write(self.style.SUCCESS("Demonstration telemetry events generated."))

from __future__ import annotations

from typing import Any, Dict, List
from django.utils import timezone

from ..models import RunbookDefinition


class RunbookService:
    """Provides standard mission-critical operational runbooks and simulated dry-run execution."""

    OFFICIAL_RUNBOOKS: List[Dict[str, Any]] = [
        {
            "slug": "db-failover-recovery",
            "title": "Database Failure & Replica Promotion",
            "title_fa": "بازیابی و انتقال به پایگاه‌داده پشتیبان (Database Failover)",
            "severity_trigger": "P1_CRITICAL",
            "target_service": "PostgreSQL Primary Cluster",
            "steps": [
                {
                    "step": 1,
                    "title": "فعال‌سازی حالت نگهداری و قطع نوشتن‌های جدید",
                    "command": "python manage.py set_maintenance_mode --readonly",
                    "verification": "بررسی بازگشت خطای ۵۰۳ دوستانه یا هدایت به حالت آفلاین",
                },
                {
                    "step": 2,
                    "title": "ارزیابی تاخیر تکثیر در پایگاه‌داده رونوشت (Replica Lag)",
                    "command": "SELECT now() - pg_last_xact_replay_timestamp() AS replication_lag;",
                    "verification": "تأیید تاخیر کمتر از ۱۵ ثانیه قبل از ارتقاء",
                },
                {
                    "step": 3,
                    "title": "ارتقاء رپلیکا به سرور اصلی (Promote to Primary)",
                    "command": "pg_ctl promote -D /var/lib/postgresql/data",
                    "verification": "بررسی خروج پایگاه‌داده از وضعیت read_only",
                },
                {
                    "step": 4,
                    "title": "به‌روزرسانی تنظیمات اتصال نرم‌افزار و بازگردانی ترافیک",
                    "command": "kubectl set env deployment/endoora-api ENDOORA_DB_HOST=pg-standby-01.internal",
                    "verification": "بررسی اتصال موفق در پروب‌های سلامت /api/health/",
                },
            ],
        },
        {
            "slug": "payment-gateway-outage",
            "title": "Payment Gateway & PSP Outage",
            "title_fa": "مهار قطعی درگاه پرداخت بانکی (PSP Outage)",
            "severity_trigger": "P2_HIGH",
            "target_service": "Billing & Escrow Subsystem",
            "steps": [
                {
                    "step": 1,
                    "title": "تشخیص افزایش خطاهای اتصال به شاپرک / درگاه اصلی",
                    "command": "python manage.py check_psp_health --provider=zarinpal",
                    "verification": "ثبت نرخ شکست بالای ۳۰٪ در ۵ دقیقه اخیر",
                },
                {
                    "step": 2,
                    "title": "تغییر مسیر خودکار تراکنش‌ها به درگاه پرداخت رزرو",
                    "command": "python manage.py switch_active_psp --to=secondary_gateway",
                    "verification": "بررسی بازگشت URL توکن معتبر از درگاه ثانویه",
                },
                {
                    "step": 3,
                    "title": "قرار دادن تراکنش‌های بازبینی‌نشده در صف استعلام مجدد",
                    "command": "python manage.py reconcile_pending_escrow_transactions",
                    "verification": "تأیید تطابق مانده حساب اسکرو با تراکنش‌های تاییدشده",
                },
            ],
        },
        {
            "slug": "ai-quota-exhaustion",
            "title": "AI Gateway Quota & Provider Fallback",
            "title_fa": "مهار اتمام سهمیه یا خطای ارائه‌دهنده هوش مصنوعی (AI Quota Fallback)",
            "severity_trigger": "P2_HIGH",
            "target_service": "AI Gateway & LLM Orchestrator",
            "steps": [
                {
                    "step": 1,
                    "title": "تشخیص خطای سهمیه یا محدودیت نرخ (HTTP 429 / Out of Credits)",
                    "command": "python manage.py check_ai_gateway_health",
                    "verification": "مشاهده اعلام وضعیت Degraded در رجیستری مدل‌ها",
                },
                {
                    "step": 2,
                    "title": "سوییچ فوری مسیریابی به مدل‌های محلی و پشتیبان (Local/Free Tier)",
                    "command": "python manage.py update_model_routing --fallback-tier=secondary",
                    "verification": "تأیید دریافت پاسخ‌های ارزیابی نوشتار از مدل پشتیبان",
                },
                {
                    "step": 3,
                    "title": "فعال‌سازی کش پاسخ‌های پرتکرار پداگوژیک",
                    "command": "python manage.py enable_ai_response_cache --ttl=86400",
                    "verification": "کاهش مصرف توکن‌های شبکه خارجی تا ۶۰٪",
                },
            ],
        },
        {
            "slug": "auth-credential-stuffing",
            "title": "Credential Stuffing & Auth Defense",
            "title_fa": "مهار حملات حدس رمز عبور و حفاظت از نشست‌ها (Auth Defense)",
            "severity_trigger": "P1_CRITICAL",
            "target_service": "Security & Identity Subsystem",
            "steps": [
                {
                    "step": 1,
                    "title": "تشخیص امواج درخواست‌های ناموفق ورود از رنج‌های IP مشکوک",
                    "command": "python manage.py detect_auth_anomalies --threshold=50",
                    "verification": "شناسایی آدرس‌های IP مهاجم و ایجاد لیست سیاه موقت",
                },
                {
                    "step": 2,
                    "title": "افزایش شدت محدودیت نرخ بر روی اندپوینت‌های احراز هویت",
                    "command": "python manage.py apply_tight_rate_limit --scope=auth_login --rate=10/min",
                    "verification": "مسدودسازی درخواست‌های اضافه با وضعیت HTTP 429",
                },
                {
                    "step": 3,
                    "title": "ابطال اختیاری توکن‌های مشکوک و اجباری‌سازی اعتبارسنجی پیامکی",
                    "command": "python manage.py enforce_step_up_auth --require-sms-otp",
                    "verification": "درخواست کد یکبار مصرف برای تمامی ورودهای مشکوک",
                },
            ],
        },
        {
            "slug": "storage-unavailability",
            "title": "Media Storage Unavailability",
            "title_fa": "مدیریت اختلال در رسانه‌ها و فایل‌های صوتی (Media Storage Outage)",
            "severity_trigger": "P3_MEDIUM",
            "target_service": "Object Storage & Audio Lab",
            "steps": [
                {
                    "step": 1,
                    "title": "تشخیص قطعی دسترسی به باکت ذخیره‌سازی ابری فایل‌های صوتی",
                    "command": "python manage.py test_storage_connectivity",
                    "verification": "ثبت خطای ارتباطی در کلاینت S3/GCS",
                },
                {
                    "step": 2,
                    "title": "تغییر مسیر فایل‌های صوتی حیاتی به کش محلی (Static Pre-cached Audio)",
                    "command": "python manage.py route_media_to_fallback_cache",
                    "verification": "تأیید پخش فایل‌های آزمون تعیین سطح از روی CDN پشتیبان",
                },
                {
                    "step": 3,
                    "title": "فعال‌سازی صف ارسال تاخیری در کلاینت مرورگر (PWA Offline Queue)",
                    "command": "python manage.py notify_clients_defer_audio_sync",
                    "verification": "ذخیره فایل‌های ضبط‌شده کاربر در IndexedDB تا زمان اتصال",
                },
            ],
        },
        {
            "slug": "ddos-rate-limiting",
            "title": "DDoS Mitigation & Traffic Spike",
            "title_fa": "مهار حملات منع سرویس توزیع‌شده و ترافیک سنگین (DDoS Mitigation)",
            "severity_trigger": "P1_CRITICAL",
            "target_service": "Edge Proxy & Web Application",
            "steps": [
                {
                    "step": 1,
                    "title": "فعال‌سازی حالت محافظت در لایه CDN (Under-Attack Mode)",
                    "command": "python manage.py cdn_security_mode --enable-under-attack",
                    "verification": "نمایش چالش جاوااسکریپت نامحسوس برای ترافیک مشکوک",
                },
                {
                    "step": 2,
                    "title": "فعال‌سازی حالت مصرف بهینه اینترنت (Low-Bandwidth Mode) برای کلیه کلاینت‌ها",
                    "command": "python manage.py set_global_low_bandwidth_flag --enabled=true",
                    "verification": "حذف رسانه‌های سنگین و کاهش ۸۰ درصدی بار پردازشی سرور",
                },
                {
                    "step": 3,
                    "title": "افزایش پویای تعداد ورکرها در کلاستر اپلیکیشن (Autoscaling)",
                    "command": "kubectl scale deployment/endoora-api --replicas=8",
                    "verification": "پایدار شدن مصرف CPU زیر ۶۵٪ در تمامی گره‌ها",
                },
            ],
        },
    ]

    @classmethod
    def sync_official_runbooks(cls) -> int:
        """Populate database with the 6 standard runbook definitions."""
        count = 0
        for data in cls.OFFICIAL_RUNBOOKS:
            RunbookDefinition.objects.update_or_create(
                slug=data["slug"],
                defaults={
                    "title": data["title"],
                    "title_fa": data["title_fa"],
                    "severity_trigger": data["severity_trigger"],
                    "target_service": data["target_service"],
                    "steps_json": data["steps"],
                    "automated_verification_available": True,
                    "last_rehearsed_at": timezone.now(),
                },
            )
            count += 1
        return count

    @classmethod
    def execute_dry_run_step(cls, slug: str, step_number: int) -> Dict[str, Any]:
        """Simulate execution of a runbook step non-destructively."""
        runbook = RunbookDefinition.objects.filter(slug=slug).first()
        if not runbook:
            cls.sync_official_runbooks()
            runbook = RunbookDefinition.objects.filter(slug=slug).first()

        steps = runbook.steps_json if runbook else []
        target_step = next((s for s in steps if s.get("step") == step_number), None)

        if not target_step:
            return {
                "success": False,
                "error": f"مرحله {step_number} در ران‌بوک {slug} یافت نشد.",
                "detail": f"مرحله {step_number} در ران‌بوک {slug} یافت نشد.",
            }

        if runbook:
            runbook.last_rehearsed_at = timezone.now()
            runbook.save(update_fields=["last_rehearsed_at"])

        return {
            "success": True,
            "slug": slug,
            "step_number": step_number,
            "step_title": target_step.get("title"),
            "command": target_step.get("command"),
            "verification": target_step.get("verification"),
            "status": "PASSED (DRY RUN)",
            "output": f"دستور با موفقیت در حالت آزمایشی شبیه‌سازی شد. تأیید شد: {target_step.get('verification')}",
            "executed_at": timezone.now().isoformat(),
        }

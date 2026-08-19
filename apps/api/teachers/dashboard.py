from __future__ import annotations

from dataclasses import dataclass

from django.utils import timezone

from profiles.models import TeacherProfile


@dataclass(frozen=True)
class TeacherSignals:
    verified: bool
    profile_completeness_percent: int
    next_session_available: bool = False
    unanswered_requests: int = 0
    pending_grading: int = 0


def resolve_teacher_primary_action(signals: TeacherSignals) -> dict[str, str]:
    if not signals.verified:
        return {
            "id": "verify_profile",
            "href": "/account/profile",
            "title_fa": "تأیید هویت مدرس را شروع کن",
            "title_en": "Start teacher verification",
            "description_fa": "قبل از فعال‌شدن قابلیت‌های بازار و کلاس پولی، وضعیت مدرس باید جداگانه تأیید شود.",
            "description_en": "Teacher verification is required before marketplace and paid-class capabilities can activate.",
            "reason_fa": "تأیید مدرس، مهم‌ترین اقدام فعلی برای بازشدن قابلیت‌های بعدی است.",
            "reason_en": "Teacher verification is the most important current step before later capabilities can unlock.",
        }

    if signals.next_session_available:
        return {
            "id": "teach_next_session",
            "href": "/teacher/classes",
            "title_fa": "برای جلسه بعدی آماده شو",
            "title_en": "Prepare for your next session",
            "description_fa": "جزئیات نزدیک‌ترین جلسه را بررسی کن و کارهای لازم را قبل از شروع انجام بده.",
            "description_en": "Review the nearest session and complete the preparation needed before it starts.",
            "reason_fa": "جلسه زمان‌بندی‌شده نزدیک، اولویت اصلی فضای مدرس است.",
            "reason_en": "An upcoming scheduled session is the highest-priority teacher action.",
        }

    if signals.unanswered_requests > 0:
        return {
            "id": "answer_request",
            "href": "/marketplace/requests",
            "title_fa": "به درخواست بدون پاسخ رسیدگی کن",
            "title_en": "Respond to an unanswered request",
            "description_fa": "درخواست فعال را بررسی کن و فقط در چارچوب قابلیت‌های تأییدشده پاسخ بده.",
            "description_en": "Review the active request and respond only within your verified capabilities.",
            "reason_fa": "درخواست بدون پاسخ باید قبل از کارهای کم‌فوریت بررسی شود.",
            "reason_en": "An unanswered learner request should be handled before lower-urgency work.",
        }

    if signals.pending_grading > 0:
        return {
            "id": "grade_work",
            "href": "/teacher/classes",
            "title_fa": "کارهای منتظر تصحیح را بررسی کن",
            "title_en": "Review work waiting for grading",
            "description_fa": "صف تصحیح را باز کن و ابتدا مواردی را بررسی کن که زمان بیشتری منتظر مانده‌اند.",
            "description_en": "Open the grading queue and start with work that has been waiting longest.",
            "reason_fa": "بازخورد به‌موقع برای جریان آموزشی مدرس و زبان‌آموز مهم است.",
            "reason_en": "Timely feedback is important to the teacher-learner learning loop.",
        }

    if signals.profile_completeness_percent < 100:
        return {
            "id": "complete_profile",
            "href": "/account/profile",
            "title_fa": "پروفایل مدرس را کامل کن",
            "title_en": "Complete your teacher profile",
            "description_fa": "اطلاعات عمومی لازم برای معرفی حرفه‌ای مدرس را تکمیل کن؛ عکس اجباری نیست.",
            "description_en": "Complete the useful public teacher information; a profile photo is not required.",
            "reason_fa": "در حال حاضر جلسه، درخواست یا تصحیح واقعی برای نمایش وجود ندارد.",
            "reason_en": "There is currently no real session, request, or grading item to show.",
        }

    return {
        "id": "prepare_first_class",
        "href": "/teacher/classes",
        "title_fa": "فضای اولین کلاس را آماده کن",
        "title_en": "Prepare your first class workspace",
        "description_fa": "ساخت کلاس کامل هنوز در مرحله بعدی نقشه راه فعال می‌شود؛ فعلاً ساختار و وضعیت دسترسی را ببین.",
        "description_en": "Full class creation is enabled in a later roadmap stage; for now, review the workspace and capability status.",
        "reason_fa": "کار فوری واقعی ثبت نشده است؛ آماده‌سازی فضای کلاس امن‌ترین اقدام بعدی است.",
        "reason_en": "No real urgent work is recorded yet, so preparing the class workspace is the safest next action.",
    }


def _teacher_profile(user) -> TeacherProfile | None:
    return (
        TeacherProfile.objects.filter(user_id=user.pk)
        .only(
            "public_name",
            "bio",
            "experience_years",
            "specialties",
            "city",
            "languages",
        )
        .first()
    )


def build_teacher_dashboard(user) -> dict:
    """Build the Day 10 teacher summary using only data that truly exists today.

    The teacher profile lookup is intentionally the only domain query in this
    service. Future class, assignment, marketplace, schedule, and finance
    domains must replace their placeholders only when those real models exist.
    """

    profile = _teacher_profile(user)
    profile_completeness = profile.completeness_percent if profile else 0
    capabilities = user.capabilities
    verified = capabilities["teacher_verified"]

    signals = TeacherSignals(
        verified=verified,
        profile_completeness_percent=profile_completeness,
    )
    primary_action = resolve_teacher_primary_action(signals)

    public_name = (profile.public_name if profile else "").strip()
    fallback_name = (user.get_full_name() or "").strip() or user.email.split("@", 1)[0]
    greeting_name = public_name or fallback_name

    unavailable_count_fa = "این شمارنده بعد از ساخته‌شدن دامنه واقعی خود فعال می‌شود؛ عدد ساختگی نمایش داده نمی‌شود."
    unavailable_count_en = "This count activates after its real domain exists; no invented number is shown."

    return {
        "user_id": user.pk,
        "greeting_name": greeting_name,
        "preferred_locale": user.preferred_locale,
        "verification_status": "verified" if verified else "unverified",
        "profile_completeness_percent": profile_completeness,
        "capabilities": capabilities,
        "primary_action": primary_action,
        "classes": {
            "available": False,
            "count": None,
            "note_fa": unavailable_count_fa,
            "note_en": unavailable_count_en,
        },
        "students": {
            "available": False,
            "count": None,
            "note_fa": unavailable_count_fa,
            "note_en": unavailable_count_en,
        },
        "learn_now_requests": {
            "available": False,
            "count": None,
            "note_fa": "درخواست‌های Learn Now فقط بعد از پیاده‌سازی بازار مدرس و کنترل‌های صلاحیت فعال می‌شوند.",
            "note_en": "Learn Now requests activate only after the teacher marketplace and eligibility controls are implemented.",
        },
        "pending_grading": {
            "available": False,
            "count": None,
            "note_fa": "صف تصحیح بعد از ساخته‌شدن تکلیف و ارسال پاسخ واقعی فعال می‌شود.",
            "note_en": "The grading queue activates after real assignments and submissions exist.",
        },
        "schedule": {
            "available": False,
            "next_session": None,
            "note_fa": "جلسه بعدی فقط زمانی نمایش داده می‌شود که سیستم کلاس و رزرو واقعی داده زمان‌بندی‌شده داشته باشد.",
            "note_en": "The next session appears only when the real class and booking domains contain scheduled data.",
        },
        "earnings": {
            "available": False,
            "amount_toman": None,
            "note_fa": "درآمد در حساب مدرس نگهداری می‌شود و تا ساخته‌شدن دفتر مالی واقعی هیچ مبلغی حدس زده نمی‌شود.",
            "note_en": "Earnings live under Account, and no amount is guessed before the real finance ledger exists.",
        },
        "quick_links": [
            {
                "id": "question_bank",
                "href": "/teacher/question-bank",
                "title_fa": "بانک سؤال",
                "title_en": "Question bank",
                "description_fa": "مسیر پایه بانک سؤال را ببین؛ آپلود و بازبینی کامل در روز اختصاصی آن فعال می‌شود.",
                "description_en": "Open the question-bank foundation; full upload and review are enabled on its dedicated roadmap day.",
                "status": "foundation",
                "requires_verification": False,
            },
            {
                "id": "fixed_class",
                "href": "/teacher/fixed-classes/new",
                "title_fa": "ایجاد کلاس ثابت",
                "title_en": "Create fixed class",
                "description_fa": "این مسیر فقط پایه رابط را نشان می‌دهد؛ ایجاد کلاس پولی قبل از تأیید مدرس و پیاده‌سازی کامل فعال نیست.",
                "description_en": "This route exposes only the UI foundation; paid class creation stays disabled until verification and full implementation.",
                "status": "foundation" if verified else "locked",
                "requires_verification": True,
            },
        ],
        "privacy_notice_fa": "داشبورد فقط وضعیت عملیاتی، شمارنده‌ها و قابلیت‌های لازم را برمی‌گرداند. متن خام نوشته زبان‌آموز، صوت، مکالمه هوش مصنوعی و پاسخ‌های خصوصی در این خلاصه قرار نمی‌گیرند.",
        "privacy_notice_en": "The dashboard returns only operational status, counts, and capability state. Raw learner writing, audio, AI conversations, and private answers are not included in this summary.",
        "limitations_fa": [
            "کلاس‌ها، دانش‌آموزان، تکالیف، بازار مدرس و امور مالی فقط پس از وجود داده و مدل واقعی فعال می‌شوند.",
            "نقش teacher به‌تنهایی اجازه بازار یا کلاس پولی نمی‌دهد؛ این قابلیت‌ها به تأیید جداگانه وابسته‌اند.",
            "خلاصه داشبورد برای نمایش محتوای حساس زبان‌آموز استفاده نمی‌شود.",
        ],
        "limitations_en": [
            "Classes, students, assignments, marketplace, and finance activate only after their real data models exist.",
            "The teacher role alone does not grant marketplace or paid-class access; those capabilities require separate verification.",
            "The dashboard summary is never used to expose sensitive learner content.",
        ],
        "generated_at": timezone.now(),
    }

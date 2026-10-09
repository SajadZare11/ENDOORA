from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from django.db.models import Count, Q
from django.utils import timezone

from gamification.models import LearnerLevel, LearnerStreak, XPTransaction
from learner_twin.models import LearnerTwin
from missions.models import DailyMission
from placement.models import PlacementSession
from srs.models import SrsItem


@dataclass(frozen=True)
class LearnerSignals:
    placement_complete: bool = False
    mission_status: str | None = None
    urgent_assignment: bool = False
    srs_due_count: int = 0
    next_class_available: bool = False


def resolve_next_best_action(signals: LearnerSignals) -> dict[str, str]:
    if signals.urgent_assignment:
        return {
            "id": "urgent_assignment",
            "href": "/assignments",
            "title_fa": "تکلیف نزدیک به موعد را انجام بده",
            "title_en": "Complete your urgent assignment",
            "description_fa": "اول تکلیفی را انجام بده که زودتر موعدش می‌رسد.",
            "description_en": "Start with the assignment whose deadline is closest.",
            "reason_fa": "تکلیف نزدیک به موعد، بالاترین اولویت امروز است.",
            "reason_en": "A near-deadline assignment is today's highest priority.",
        }

    if signals.mission_status in {
        DailyMission.Status.READY,
        DailyMission.Status.IN_PROGRESS,
    }:
        return {
            "id": "continue_mission",
            "href": "/today",
            "title_fa": "ماموریت امروز را ادامه بده",
            "title_en": "Continue today's mission",
            "description_fa": "از همان جایی ادامه بده که آخرین بار متوقف شدی.",
            "description_en": "Continue from the point where you last stopped.",
            "reason_fa": "ماموریت روزانه آماده است و مسیر اصلی تمرین امروز است.",
            "reason_en": "Your daily mission is ready and is today's main practice path.",
        }

    if signals.srs_due_count > 0:
        return {
            "id": "review_vocabulary",
            "href": "/review",
            "title_fa": "واژگان موعدرسیده را مرور کن",
            "title_en": "Review due vocabulary",
            "description_fa": "واژه‌هایی را که امروز موعد مرورشان است بازیابی کن.",
            "description_en": "Recall the vocabulary items due for review today.",
            "reason_fa": "مرورهای موعدرسیده قبل از مطالب جدید اولویت دارند.",
            "reason_en": "Due reviews are prioritized before new material.",
        }

    if not signals.placement_complete:
        return {
            "id": "start_placement",
            "href": "/placement",
            "title_fa": "شروع تعیین سطح",
            "title_en": "Start placement",
            "description_fa": "با چند قدم کوتاه، نقطه شروع مسیر شخصی‌ات را پیدا کن.",
            "description_en": "Find the starting point for your personal path in a few short steps.",
            "reason_fa": "هنوز شواهد کافی برای ساخت مسیر شخصی و نمایش مهارت‌ها وجود ندارد.",
            "reason_en": "There is not enough evidence yet to build a personal path or skill snapshot.",
        }

    if signals.next_class_available:
        return {
            "id": "join_next_class",
            "href": "/teachers",
            "title_fa": "برای کلاس بعدی آماده شو",
            "title_en": "Prepare for your next class",
            "description_fa": "جزئیات و کارهای قبل از کلاس بعدی را ببین.",
            "description_en": "Review your next class and its preparation.",
            "reason_fa": "کلاس زمان‌بندی‌شده نزدیک، اقدام بعدی مناسب است.",
            "reason_en": "An upcoming scheduled class is the best next action.",
        }

    return {
        "id": "start_learning",
        "href": "/learn",
        "title_fa": "یادگیری امروز را شروع کن",
        "title_en": "Start learning today",
        "description_fa": "یک فعالیت کوتاه مرتبط با مسیر فعلی‌ات را شروع کن.",
        "description_en": "Start a short activity connected to your current path.",
        "reason_fa": "کار فوری دیگری وجود ندارد؛ ادامه مسیر بهترین قدم بعدی است.",
        "reason_en": "There is no more urgent task, so continuing the path is best.",
    }


SKILL_LABELS = {
    "speaking": ("گفتاری", "Speaking"),
    "listening": ("شنیداری", "Listening"),
    "reading": ("خواندن", "Reading"),
    "writing": ("نوشتاری", "Writing"),
    "grammar": ("دستور زبان", "Grammar"),
    "vocabulary": ("واژگان", "Vocabulary"),
}


def _skill_snapshot(user) -> list[dict[str, str]]:
    twin = (
        LearnerTwin.objects.filter(
            user=user,
            consent_enabled=True,
            evidence_count__gt=0,
        )
        .only("summary", "evidence_count")
        .first()
    )
    if twin is None or not isinstance(twin.summary, dict):
        return []

    raw_skills = twin.summary.get("skills")
    if not isinstance(raw_skills, dict):
        return []

    result: list[dict[str, str]] = []
    for raw_key, raw_value in raw_skills.items():
        key = str(raw_key).strip().lower()
        if key not in SKILL_LABELS or raw_value in (None, {}, []):
            continue
        label_fa, label_en = SKILL_LABELS[key]
        result.append(
            {
                "id": key,
                "label_fa": label_fa,
                "label_en": label_en,
                "status_fa": "شواهد یادگیری ثبت شده",
                "status_en": "Learning evidence recorded",
            }
        )
    return result[:6]


def _mission_payload(mission: DailyMission | None) -> dict[str, Any] | None:
    if mission is None:
        return None

    reason = mission.evidence_reason if isinstance(mission.evidence_reason, dict) else {}
    return {
        "id": mission.id,
        "mission_date": mission.mission_date,
        "status": mission.status,
        "title_fa": mission.title_fa,
        "title_en": mission.title_en,
        "description_fa": mission.explanation_fa,
        "description_en": mission.explanation_en,
        "reason_fa": str(reason.get("reason_fa", "")).strip(),
        "reason_en": str(reason.get("reason_en", "")).strip(),
    }


def _path_preview(placement_complete: bool) -> list[dict[str, str]]:
    return [
        {
            "id": "placement",
            "label_fa": "شناخت نقطه شروع",
            "label_en": "Discover your starting point",
            "state": "complete" if placement_complete else "current",
        },
        {
            "id": "personal_path",
            "label_fa": "ساخت مسیر شخصی",
            "label_en": "Build your personal path",
            "state": "current" if placement_complete else "locked",
        },
        {
            "id": "daily_growth",
            "label_fa": "یادگیری و رشد روزانه",
            "label_en": "Learn and grow each day",
            "state": "locked",
        },
    ]


def format_relative_time(dt) -> tuple[str, str]:
    if not dt:
        return "", ""
    now = timezone.now()
    diff = (now - dt).total_seconds()
    if diff < 60:
        return "لحظاتی پیش", "Just now"
    if diff < 3600:
        mins = max(1, int(diff // 60))
        return f"{mins} دقیقه پیش", f"{mins}m ago"
    if diff < 86400:
        hours = int(diff // 3600)
        return f"{hours} ساعت پیش", f"{hours}h ago"
    if diff < 172800:
        return "دیروز", "Yesterday"
    days = int(diff // 86400)
    return f"{days} روز پیش", f"{days}d ago"


def record_learner_activity(
    user,
    activity_type: str,
    title_fa: str,
    title_en: str = "",
    category: str = "general",
    badge_text_fa: str = "",
    badge_text_en: str = "",
    icon: str = "⚡",
    link: str = "",
    description_fa: str = "",
    description_en: str = "",
    metadata: dict | None = None,
    created_at=None,
):
    from .models import LearnerActivity
    return LearnerActivity.objects.create(
        user=user,
        activity_type=activity_type,
        title_fa=title_fa,
        title_en=title_en or title_fa,
        category=category,
        badge_text_fa=badge_text_fa,
        badge_text_en=badge_text_en,
        icon=icon,
        link=link,
        description_fa=description_fa,
        description_en=description_en,
        metadata=metadata or {},
        created_at=created_at or timezone.now(),
    )


def _sync_domain_activities(user) -> None:
    from .models import LearnerActivity
    # 1. Lesson completions
    try:
        from courses.models import LearnerLessonProgress
        progs = (
            LearnerLessonProgress.objects.filter(learner=user, is_completed=True)
            .select_related("lesson__module__course")
            .order_by("-updated_at")[:10]
        )
        for p in progs:
            lesson = p.lesson
            if not lesson:
                continue
            course = lesson.module.course if lesson.module else None
            lesson_id_str = str(lesson.id)
            if not LearnerActivity.objects.filter(user=user, activity_type="lesson_completed", metadata__lesson_id=lesson_id_str).exists():
                score_badge = f"نمره {int(p.quiz_score)}٪" if p.quiz_score is not None else "تکمیل شده"
                score_badge_en = f"Score: {int(p.quiz_score)}%" if p.quiz_score is not None else "Completed"
                course_slug = course.slug if course else "course"
                LearnerActivity.objects.create(
                    user=user,
                    activity_type="lesson_completed",
                    title_fa=f"تکمیل درس: {lesson.title_fa}",
                    title_en=f"Completed lesson: {lesson.title_en}",
                    category=LearnerActivity.ActivityCategory.COURSE,
                    badge_text_fa=score_badge,
                    badge_text_en=score_badge_en,
                    icon="🎓",
                    link=f"/courses/{course_slug}/lessons/{lesson.id}",
                    metadata={"lesson_id": lesson_id_str, "quiz_score": p.quiz_score},
                    created_at=p.completed_at or p.updated_at,
                )
    except Exception:
        pass

    # 2. Payments & Subscription
    try:
        from marketplace.models import PaymentTransaction, PaymentTransactionStatus, PaymentOrderType
        txs = (
            PaymentTransaction.objects.filter(user=user, status=PaymentTransactionStatus.PAID)
            .select_related("plan")
            .order_by("-created_at")[:5]
        )
        for tx in txs:
            tx_id_str = str(tx.id)
            if not LearnerActivity.objects.filter(user=user, activity_type="payment_success", metadata__tx_id=tx_id_str).exists():
                if tx.order_type == PaymentOrderType.SUBSCRIPTION_PLAN:
                    title_fa = f"خرید {tx.plan.name_fa if tx.plan else 'اشتراک ویژه'}"
                    title_en = f"Activated {tx.plan.name_en if tx.plan else 'Premium Plan'}"
                    cat = LearnerActivity.ActivityCategory.MEMBERSHIP
                    icon = "⭐"
                    badge_fa = "اشتراک فعال"
                    badge_en = "Active Plan"
                    link = "/account/plan"
                elif tx.order_type == PaymentOrderType.WALLET_TOPUP:
                    title_fa = f"شارژ کیف پول ({int(tx.amount_toman):,} تومان)"
                    title_en = f"Wallet Top-up ({int(tx.amount_toman):,} Toman)"
                    cat = LearnerActivity.ActivityCategory.MEMBERSHIP
                    icon = "💳"
                    badge_fa = "شارژ موفق"
                    badge_en = "Success"
                    link = "/account/wallet"
                else:
                    title_fa = "پرداخت موفق جلسه آموزشی"
                    title_en = "Session booking payment"
                    cat = LearnerActivity.ActivityCategory.BOOKING
                    icon = "📅"
                    badge_fa = "پرداخت شد"
                    badge_en = "Paid"
                    link = "/account/billing"

                LearnerActivity.objects.create(
                    user=user,
                    activity_type="payment_success",
                    title_fa=title_fa,
                    title_en=title_en,
                    category=cat,
                    badge_text_fa=badge_fa,
                    badge_text_en=badge_en,
                    icon=icon,
                    link=link,
                    metadata={"tx_id": tx_id_str},
                    created_at=tx.verified_at or tx.created_at,
                )
    except Exception:
        pass

    # 3. Placement tests
    try:
        from placement.models import PlacementSession
        placements = PlacementSession.objects.filter(user=user, status="submitted").order_by("-completed_at")[:2]
        for pl in placements:
            pl_id_str = str(pl.id)
            if not LearnerActivity.objects.filter(user=user, activity_type="placement_completed", metadata__placement_id=pl_id_str).exists():
                LearnerActivity.objects.create(
                    user=user,
                    activity_type="placement_completed",
                    title_fa="تکمیل سنجش تعیین سطح زبان انگلیسی (CEFR)",
                    title_en="Completed CEFR English Placement Test",
                    category=LearnerActivity.ActivityCategory.PLACEMENT,
                    badge_text_fa="تعیین سطح",
                    badge_text_en="Placement",
                    icon="🎯",
                    link="/placement",
                    metadata={"placement_id": pl_id_str},
                    created_at=pl.completed_at or pl.created_at,
                )
    except Exception:
        pass

    # 4. Completed Daily Missions
    try:
        from missions.models import DailyMission
        completed_missions = DailyMission.objects.filter(
            user=user, status=DailyMission.Status.COMPLETED
        ).order_by("-mission_date")[:3]
        for m in completed_missions:
            m_id_str = str(m.id)
            if not LearnerActivity.objects.filter(
                user=user, activity_type="mission_completed", metadata__mission_id=m_id_str
            ).exists():
                LearnerActivity.objects.create(
                    user=user,
                    activity_type="mission_completed",
                    title_fa=f"انجام کامل مأموریت روزانه: {m.title_fa}",
                    title_en=f"Completed Daily Mission: {m.title_en}",
                    category=LearnerActivity.ActivityCategory.GAMIFICATION,
                    badge_text_fa="مأموریت روز",
                    badge_text_en="Daily Mission",
                    icon="🌟",
                    link="/today",
                    metadata={"mission_id": m_id_str},
                    created_at=timezone.now(),
                )
    except Exception:
        pass

    # 5. SRS Vocabulary Reviews
    try:
        from srs.models import SrsItem
        reviewed_items = (
            SrsItem.objects.filter(learner=user, last_reviewed_at__isnull=False)
            .order_by("-last_reviewed_at")[:5]
        )
        for item in reviewed_items:
            item_id_str = str(item.id)
            if not LearnerActivity.objects.filter(
                user=user, activity_type="vocab_reviewed", metadata__srs_id=item_id_str
            ).exists():
                LearnerActivity.objects.create(
                    user=user,
                    activity_type="vocab_reviewed",
                    title_fa=f"مرور و تثبیت واژه: {item.term} ({item.meaning_fa})",
                    title_en=f"Reviewed vocabulary: {item.term}",
                    category=LearnerActivity.ActivityCategory.VOCABULARY,
                    badge_text_fa=f"تکرار {item.repetition}",
                    badge_text_en=f"Repetition {item.repetition}",
                    icon="💡",
                    link="/review",
                    metadata={"srs_id": item_id_str, "term": item.term},
                    created_at=item.last_reviewed_at or timezone.now(),
                )
    except Exception:
        pass

    # 6. Live Class Requests
    try:
        from live_classes.models import ClassEnrollmentRequest
        requests = ClassEnrollmentRequest.objects.filter(student=user).order_by("-created_at")[:3]
        for req in requests:
            req_id_str = str(req.id)
            if not LearnerActivity.objects.filter(
                user=user, activity_type="class_request", metadata__request_id=req_id_str
            ).exists():
                book_title = req.target_book.book_title if req.target_book else "کلاس آنلاین"
                LearnerActivity.objects.create(
                    user=user,
                    activity_type="class_request",
                    title_fa=f"ثبت درخواست کلاس: {book_title}",
                    title_en=f"Class request submitted: {book_title}",
                    category=LearnerActivity.ActivityCategory.BOOKING,
                    badge_text_fa=req.get_status_display() or "درخواست کلاس",
                    badge_text_en=req.status,
                    icon="📅",
                    link="/learn/now",
                    metadata={"request_id": req_id_str},
                    created_at=req.created_at,
                )
    except Exception:
        pass


def get_recent_activities(user, limit: int = 10) -> list[dict[str, Any]]:
    from .models import LearnerActivity
    _sync_domain_activities(user)

    activities = (
        LearnerActivity.objects.filter(user=user)
        .order_by("-created_at")[:limit]
    )
    result = []
    for act in activities:
        time_fa, time_en = format_relative_time(act.created_at)
        result.append(
            {
                "id": str(act.id),
                "activity_type": act.activity_type,
                "title_fa": act.title_fa,
                "title_en": act.title_en,
                "description_fa": act.description_fa,
                "description_en": act.description_en,
                "category": act.category,
                "badge_text_fa": act.badge_text_fa,
                "badge_text_en": act.badge_text_en,
                "icon": act.icon,
                "link": act.link,
                "time_ago_fa": time_fa,
                "time_ago_en": time_en,
                "created_at": act.created_at,
            }
        )
    return result


def build_learner_home(user) -> dict[str, Any]:
    today = timezone.localdate()
    now = timezone.now()

    placement_complete = PlacementSession.objects.filter(
        user=user,
        status="submitted",
    ).exists()
    mission = (
        DailyMission.objects.filter(user=user, mission_date=today)
        .only(
            "id",
            "mission_date",
            "status",
            "title_fa",
            "title_en",
            "explanation_fa",
            "explanation_en",
            "evidence_reason",
        )
        .first()
    )
    srs_counts = SrsItem.objects.filter(learner=user).aggregate(
        total=Count("pk"),
        due=Count("pk", filter=Q(due_at__lte=now)),
    )
    srs_available = srs_counts["total"] > 0
    srs_due_count = srs_counts["due"]
    skills = _skill_snapshot(user)

    signals = LearnerSignals(
        placement_complete=placement_complete,
        mission_status=mission.status if mission else None,
        srs_due_count=srs_due_count,
    )
    action = resolve_next_best_action(signals)
    full_name = (user.get_full_name() or "").strip()
    greeting_name = full_name or user.email.split("@", 1)[0]

    if mission and mission.status in {
        DailyMission.Status.READY,
        DailyMission.Status.IN_PROGRESS,
    }:
        dashboard_state = "mission_ready"
    elif placement_complete:
        dashboard_state = "returning"
    else:
        dashboard_state = "first_time"

    # Active course resolution
    active_course = None
    try:
        from courses.models import LearnerCourseEnrollment
        active_enrollment = (
            LearnerCourseEnrollment.objects.filter(learner=user)
            .select_related("course")
            .order_by("-updated_at")
            .first()
        )
        if active_enrollment and active_enrollment.course:
            c = active_enrollment.course
            active_course = {
                "slug": c.slug,
                "title_fa": c.title_fa,
                "title_en": c.title_en,
                "progress_percent": active_enrollment.progress_percent,
            }
    except Exception:
        pass

    recent_activities = get_recent_activities(user, limit=8)

    return {
        "user_id": user.id,
        "greeting_name": greeting_name,
        "preferred_locale": user.preferred_locale,
        "dashboard_state": dashboard_state,
        "primary_action": action,
        "today_mission": _mission_payload(mission),
        "path_progress_percent": None,
        "path_steps": _path_preview(placement_complete),
        "path_message_fa": (
            "شواهد تعیین سطح ثبت شده است؛ ساخت مسیر شخصی قدم بعدی شماست."
            if placement_complete
            else "بعد از تعیین سطح، مسیر یادگیری شخصی شما از همین‌جا شروع می‌شود."
        ),
        "path_message_en": (
            "Placement evidence is recorded; building your personal path is next."
            if placement_complete
            else "Your personal learning path starts here after placement."
        ),
        "skills": skills,
        "srs_available": srs_available,
        "srs_due_count": srs_due_count,
        "assignment": None,
        "next_class": None,
        "active_course": active_course,
        "recent_activities": recent_activities,
        "xp_available": XPTransaction.objects.filter(learner=user).exists(),
        "xp": (
            LearnerLevel.objects.filter(learner=user).values_list("total_xp", flat=True).first()
            if XPTransaction.objects.filter(learner=user).exists()
            else 0
        ) or 0,
        "streak_days": (
            LearnerStreak.objects.filter(learner=user).values_list("current_streak", flat=True).first()
            if LearnerStreak.objects.filter(learner=user).exists()
            else 0
        ) or 0,
        "notifications_available": False,
        "notification_count": 0,
        "limitations_fa": [
            "تا وقتی شواهد واقعی یادگیری ثبت نشده، هیچ نمره یا سطح ساختگی نشان داده نمی‌شود.",
            "تکلیف، کلاس، دوره و اعلان‌ها فقط بعد از ساخته‌شدن دامنه واقعی خود فعال می‌شوند.",
        ],
        "limitations_en": [
            "No invented score or level is shown before real learning evidence exists.",
            "Assignments, classes, courses and notifications activate only after their real domains exist.",
        ],
        "generated_at": now,
    }

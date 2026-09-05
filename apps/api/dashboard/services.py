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
        "active_course": None,
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

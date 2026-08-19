from __future__ import annotations

from dataclasses import dataclass

from django.utils import timezone


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

    if signals.mission_status in {"ready", "in_progress"}:
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
            "href": "/vocabulary",
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
            "title_fa": "از تعیین سطح شروع کن",
            "title_en": "Start with placement",
            "description_fa": "برای ساخت مسیر شخصی، ابتدا شواهد اولیه سطح زبانت را ثبت کن.",
            "description_en": "Provide initial level evidence so Endoora can build your personal path.",
            "reason_fa": "هنوز شواهد کافی برای پیشنهاد مسیر شخصی وجود ندارد.",
            "reason_en": "There is not enough evidence yet to recommend a personal learning path.",
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


def build_learner_home(user) -> dict:
    # Day 09 must not fabricate data from future domains.
    signals = LearnerSignals()
    action = resolve_next_best_action(signals)
    full_name = (user.get_full_name() or "").strip()
    greeting_name = full_name or user.email.split("@", 1)[0]

    return {
        "user_id": user.id,
        "greeting_name": greeting_name,
        "preferred_locale": user.preferred_locale,
        "dashboard_state": "first_time",
        "primary_action": action,
        "path_progress_percent": None,
        "path_message_fa": "بعد از تعیین سطح، پیش‌نمایش مسیر یادگیری اینجا نمایش داده می‌شود.",
        "path_message_en": "Your learning-path preview will appear here after placement evidence exists.",
        "skills": [],
        "srs_available": False,
        "srs_due_count": 0,
        "assignment": None,
        "next_class": None,
        "active_course": None,
        "xp_available": False,
        "xp": 0,
        "streak_days": 0,
        "notifications_available": False,
        "notification_count": 0,
        "limitations_fa": [
            "تا وقتی شواهد واقعی یادگیری ثبت نشده، هیچ نمره یا سطح ساختگی نشان داده نمی‌شود.",
            "تکلیف، SRS، کلاس، XP و اعلان‌ها فقط بعد از ساخته‌شدن دامنه واقعی خود فعال می‌شوند.",
        ],
        "limitations_en": [
            "No invented score or level is shown before real learning evidence exists.",
            "Assignments, SRS, classes, XP and notifications activate only after their real domains exist.",
        ],
        "generated_at": timezone.now(),
    }

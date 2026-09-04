import json
from pathlib import Path
from typing import Any

from django.conf import settings
from django.utils import timezone

from assessment.services import evaluate_placement_answers, map_score_to_cefr_estimate
from placement.models import PlacementSession


CORE_ITEMS_PATH = getattr(settings, "REPO_ROOT", Path(__file__).resolve().parents[3]) / "data" / "placement" / "core-items.json"


SKILL_METADATA: dict[str, dict[str, str]] = {
    "grammar": {
        "label_fa": "دستور زبان",
        "label_en": "Grammar",
        "action_href": "/practice-ai",
        "recommendation_fa": "تقویت الگوهای گرامری و ساختار جملات پیچیده",
        "recommendation_en": "Reinforce core grammar patterns and sentence structures",
    },
    "vocabulary": {
        "label_fa": "واژگان",
        "label_en": "Vocabulary",
        "action_href": "/review",
        "recommendation_fa": "مرور فعال واژگان موعدرسیده با روش تکرار فاصله‌دار (SRS)",
        "recommendation_en": "Active review of target vocabulary via spaced repetition",
    },
    "reading": {
        "label_fa": "درک مطلب",
        "label_en": "Reading",
        "action_href": "/practice-ai",
        "recommendation_fa": "مطالعه متن‌های ساختاریافته و تمرین استنتاج مفاهیم",
        "recommendation_en": "Read level-appropriate texts and extract key inferences",
    },
    "listening": {
        "label_fa": "شنیداری",
        "label_en": "Listening",
        "action_href": "/listening",
        "recommendation_fa": "گوش دادن به مکالمات و تشخیص جزئیات در سرعت‌های گوناگون",
        "recommendation_en": "Listen to spoken English and discern details at varying speeds",
    },
    "speaking": {
        "label_fa": "گفتاری",
        "label_en": "Speaking",
        "action_href": "/voice",
        "recommendation_fa": "تمرین مکالمه، ضبط صدا و سنجش گستره واژگان شفاهی",
        "recommendation_en": "Practice conversational speech, voice recording, and oral fluency",
    },
    "writing": {
        "label_fa": "نگارش",
        "label_en": "Writing",
        "action_href": "/writing",
        "recommendation_fa": "نوشتن متن‌های ساختاریافته در ویرایشگر و دریافت ارزیابی تحلیلی",
        "recommendation_en": "Draft guided essays with formatting tools and automated feedback",
    },
}


def build_unplaced_learning_path(user: Any) -> dict[str, Any]:
    """Generates an honest onboarding learning path when no placement evidence exists yet."""
    return {
        "placement_completed": False,
        "estimated_cefr_level": None,
        "overall_percentage": None,
        "generated_from": [
            "onboarding",
            "learner_twin",
        ],
        "next_best_step": "start_placement",
        "next_best_step_fa": "شروع ارزیابی تعیین سطح ۶ مهارت",
        "next_best_step_en": "Start 6-Skill Placement Assessment",
        "next_best_step_href": "/placement",
        "focus_areas": [],
        "section_scores": [],
        "timeline": [
            {
                "id": "placement",
                "title_fa": "تعیین سطح و شناخت نقطه شروع",
                "title_en": "Placement & Starting Point",
                "status": "current",
                "description_fa": "ارزیابی ۶ مهارت (دستور زبان، واژگان، درک مطلب، شنیداری، گفتاری، نگارش) برای تعیین دقیق نقشه راه یادگیری.",
                "description_en": "6-skill placement (Grammar, Vocabulary, Reading, Listening, Speaking, Writing) to establish your exact baseline.",
                "evidence": ["placement_pending"],
                "action_href": "/placement",
            },
            {
                "id": "core_reinforcement",
                "title_fa": "تثبیت پایه‌ها و رفع نقاط چالش",
                "title_en": "Core Reinforcement & Growth Areas",
                "status": "locked",
                "description_fa": "تمرین هدفمند روی مهارت‌های اولویت‌دار بعد از اتمام تعیین سطح فعال می‌شود.",
                "description_en": "Targeted practice on priority skills unlocks after placement completion.",
                "evidence": [],
                "action_href": "/practice-ai",
            },
            {
                "id": "adaptive_practice",
                "title_fa": "مأموریت‌های روزانه و تمرین تطبیقی",
                "title_en": "Daily Missions & Adaptive Practice",
                "status": "upcoming",
                "description_fa": "برنامه تمرین روزانه شخصی‌سازی‌شده متناسب با برنامه زمانی شما.",
                "description_en": "Daily practice missions tailored to your pace and goals.",
                "evidence": ["future_daily_mission"],
                "action_href": "/today",
            },
            {
                "id": "vocabulary_retention",
                "title_fa": "گسترش واژگان با یادآوری فاصله‌دار (SRS)",
                "title_en": "Active Vocabulary Retention (SRS)",
                "status": "planned",
                "description_fa": "مرور هوشمند لغات با فواصل بهینه جهت تثبیت در حافظه بلندمدت.",
                "description_en": "Spaced repetition reviews for long-term vocabulary retention.",
                "evidence": ["future_srs_reviews"],
                "action_href": "/review",
            },
            {
                "id": "teacher_support",
                "title_fa": "مهارت‌های ارتباطی و پشتیبانی مدرس",
                "title_en": "Productive Skills & Teacher Support",
                "status": "planned",
                "description_fa": "کلاس‌های رفع اشکال و تمرین تعاملی با مدرسان مورد تایید در صورت نیاز.",
                "description_en": "Targeted feedback sessions and conversation practice with verified teachers.",
                "evidence": ["future_teacher_support"],
                "action_href": "/teachers",
            },
        ],
        "limitations_fa": [
            "مسیر یادگیری اختصاصی نیازمند شواهد عملکرد شما در آزمون تعیین سطح است.",
            "بدون ارزیابی واقعی، هیچ سطح یا نمره اولیه‌ای حدس زده نمی‌شود.",
        ],
        "limitations_en": [
            "A personalized path requires verified evidence from your placement test.",
            "No initial level or score is fabricated without real learning data.",
        ],
    }


def build_placed_learning_path(user: Any, session: PlacementSession) -> dict[str, Any]:
    """Generates an evidence-grounded learning path derived from completed placement session."""
    raw_items = []
    if CORE_ITEMS_PATH.is_file():
        try:
            raw_items = json.loads(CORE_ITEMS_PATH.read_text(encoding="utf-8-sig"))
        except Exception:
            raw_items = []

    answers_map = {}
    for ans in session.answers.all():
        val = ans.answer_value
        if isinstance(val, dict):
            answers_map[ans.question_key] = val.get("selected_option") or val.get("spoken_text") or val.get("written_text") or val
        else:
            answers_map[ans.question_key] = val

    evaluation = evaluate_placement_answers(raw_items, answers_map)
    overall_percentage = float(evaluation.get("overall_percentage", 0.0))
    estimated_cefr = evaluation.get("estimated_cefr_level") or map_score_to_cefr_estimate(overall_percentage)
    sections_eval = evaluation.get("sections", {})

    section_scores: list[dict[str, Any]] = []
    skill_rankings: list[dict[str, Any]] = []

    for sec_key, meta in SKILL_METADATA.items():
        sec_data = sections_eval.get(sec_key, {})
        score_pct = float(sec_data.get("score_percentage", 0.0))
        answered = int(sec_data.get("answered", 0))
        total = int(sec_data.get("total", 0))
        objectives = sec_data.get("objectives_covered", [])

        sec_score_item = {
            "section": sec_key,
            "label_fa": meta["label_fa"],
            "label_en": meta["label_en"],
            "score_percentage": score_pct,
            "answered": answered,
            "total": total,
            "objectives_covered": objectives,
        }
        section_scores.append(sec_score_item)

        skill_rankings.append({
            "skill": sec_key,
            "label_fa": meta["label_fa"],
            "label_en": meta["label_en"],
            "score_percentage": score_pct,
            "action_href": meta["action_href"],
            "recommendation_fa": meta["recommendation_fa"],
            "recommendation_en": meta["recommendation_en"],
        })

    # Sort skills by score ascending (lowest score is highest growth priority)
    skill_rankings.sort(key=lambda s: s["score_percentage"])

    focus_areas: list[dict[str, Any]] = []
    for idx, skill_info in enumerate(skill_rankings):
        if idx < 2:
            priority = "high"
        elif idx < 4:
            priority = "medium"
        else:
            priority = "maintenance"

        focus_areas.append({
            "skill": skill_info["skill"],
            "label_fa": skill_info["label_fa"],
            "label_en": skill_info["label_en"],
            "score_percentage": skill_info["score_percentage"],
            "priority": priority,
            "recommendation_fa": skill_info["recommendation_fa"],
            "recommendation_en": skill_info["recommendation_en"],
            "action_href": skill_info["action_href"],
        })

    # Primary growth target is the lowest-performing skill
    primary_growth = skill_rankings[0] if skill_rankings else None
    lowest_label_fa = primary_growth["label_fa"] if primary_growth else "نگارش"
    lowest_label_en = primary_growth["label_en"] if primary_growth else "Writing"
    next_step_href = primary_growth["action_href"] if primary_growth else "/today"

    # Derive next best step
    if primary_growth and primary_growth["skill"] == "writing":
        next_best_step = "practice_writing"
        next_best_step_fa = "تمرین نگارش در آزمایشگاه نویسندگی"
        next_best_step_en = "Practice writing in the essay mentor lab"
    elif primary_growth and primary_growth["skill"] == "speaking":
        next_best_step = "practice_speaking"
        next_best_step_fa = "تمرین گفتاری و ضبط صدا در استودیو صوت"
        next_best_step_en = "Practice speaking and voice recording in the voice lab"
    elif primary_growth and primary_growth["skill"] == "listening":
        next_best_step = "practice_listening"
        next_best_step_fa = "تقویت درک شنیداری در آزمایشگاه صوت"
        next_best_step_en = "Enhance listening comprehension in the listening lab"
    elif primary_growth and primary_growth["skill"] == "vocabulary":
        next_best_step = "review_vocabulary"
        next_best_step_fa = "مرور فعال واژگان با فلش‌کارت‌های فاصله‌دار"
        next_best_step_en = "Review target vocabulary via spaced flashcards"
    else:
        next_best_step = "start_today_mission"
        next_best_step_fa = "شروع مأموریت تمرینی امروز"
        next_best_step_en = "Start today's daily mission"
        next_step_href = "/today"

    twin = getattr(user, 'learner_twin', None)
    evidence_count = getattr(twin, 'evidence_count', 0) if twin else 0

    timeline = [
        {
            "id": "placement",
            "title_fa": "ارزیابی چندبُعدی و تعیین سطح اولیه",
            "title_en": "6-Skill Placement & Baseline Diagnosis",
            "status": "complete",
            "description_fa": f"ارزیابی کامل ۶ بخش با میانگین نمره {overall_percentage}% و سطح تخمینی {estimated_cefr}.",
            "description_en": f"Completed 6-section placement with {overall_percentage}% average score and provisional {estimated_cefr} estimate.",
            "evidence": [
                f"session:{session.id}",
                f"cefr:{estimated_cefr}",
                f"overall:{overall_percentage}%",
                f"twin_evidence_count:{evidence_count}",
            ],
            "action_href": "/placement/report",
        },
        {
            "id": "core_reinforcement",
            "title_fa": f"تثبیت پایه‌ها و تقویت مهارت {lowest_label_fa}",
            "title_en": f"Core Reinforcement & {lowest_label_en} Practice",
            "status": "current",
            "description_fa": f"تمرکز ویژه روی مهارت‌های نیازمند رشد ({lowest_label_fa}) برای توازن مهارت‌ها.",
            "description_en": f"Targeted practice focused on priority skill ({lowest_label_en}) to build balanced proficiency.",
            "evidence": [f"priority_skill:{primary_growth['skill'] if primary_growth else 'writing'}"],
            "action_href": next_step_href,
        },
        {
            "id": "adaptive_practice",
            "title_fa": "مأموریت‌های یادگیری تطبیقی روزانه",
            "title_en": "Daily Missions & Adaptive Practice",
            "status": "upcoming",
            "description_fa": "تمرین‌های روزانه شخصی‌سازی‌شده متناسب با سطح و اهداف شما.",
            "description_en": "Daily missions adapted to your proficiency and pace.",
            "evidence": ["future_daily_mission"],
            "action_href": "/today",
        },
        {
            "id": "vocabulary_retention",
            "title_fa": "مرور فعال واژگان با یادآوری فاصله‌دار (SRS)",
            "title_en": "Active Vocabulary Retention (SRS)",
            "status": "planned",
            "description_fa": "سیستم تکرار فاصله‌دار برای تثبیت واژگان هدف در حافظه بلندمدت.",
            "description_en": "Spaced repetition retention preventing vocabulary decay.",
            "evidence": ["future_srs_reviews"],
            "action_href": "/review",
        },
        {
            "id": "teacher_support",
            "title_fa": "مهارت‌های ارتباطی و پشتیبانی مدرس",
            "title_en": "Productive Skills & Teacher Support",
            "status": "planned",
            "description_fa": "پشتیبانی آموزشی و جلسات مکالمه رفع اشکال با مدرسان مورد تایید.",
            "description_en": "Live teacher feedback and guided conversation practice when ready.",
            "evidence": ["future_teacher_evidence"],
            "action_href": "/teachers",
        },
    ]

    return {
        "placement_completed": True,
        "estimated_cefr_level": estimated_cefr,
        "overall_percentage": overall_percentage,
        "generated_from": [
            "placement_evidence",
            "learner_twin",
            "six_skills_diagnostic",
        ],
        "next_best_step": next_best_step,
        "next_best_step_fa": next_best_step_fa,
        "next_best_step_en": next_best_step_en,
        "next_best_step_href": next_step_href,
        "focus_areas": focus_areas,
        "section_scores": section_scores,
        "timeline": timeline,
        "limitations_fa": [
            "این مسیر یادگیری بر پایه شواهد عملکرد شما در تعیین سطح ۶ مهارتی شکل گرفته و با تمرین‌های جدید به‌روزرسانی می‌شود.",
            "تخمین سطح CEFR جنبه تشخیصی و آموزشی دارد و بدون آزمون رسمی تحت نظارت مدرک معتبر محسوب نمی‌شود.",
        ],
        "limitations_en": [
            "This learning path is derived from your 6-skill placement evidence and dynamically updates as you learn.",
            "The CEFR estimate is an educational diagnostic guide and does not constitute an accredited certificate.",
        ],
    }


def build_learning_path(user: Any) -> dict[str, Any]:
    """
    Main entry point for building a learner's personalized learning path.
    Inspects user's submitted placement evidence and returns an honest, explainable path.
    """
    if not getattr(user, "is_authenticated", False):
        return build_unplaced_learning_path(user)

    session = (
        PlacementSession.objects.filter(user=user, status=PlacementSession.Status.SUBMITTED)
        .order_by("-started_at")
        .first()
    )

    if session is None:
        return build_unplaced_learning_path(user)

    return build_placed_learning_path(user, session)

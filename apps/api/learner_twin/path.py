import json
from pathlib import Path
from typing import Any

from django.conf import settings
from django.utils import timezone

from assessment.services import evaluate_placement_answers, map_score_to_cefr_estimate
from live_classes.services import get_learner_class_status, recommend_curriculum_for_user
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
    curriculum = recommend_curriculum_for_user(user)
    class_status = get_learner_class_status(user)
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
                "id": "onboarding_profiling",
                "title_fa": "گام ۱: مشخصات و هدف‌گذاری آموزشی",
                "title_en": "Step 1: Onboarding & Goal Profiling",
                "status": "complete",
                "description_fa": "ثبت مشخصات، اهداف یادگیری و سن برای تنظیم بهینه منابع آموزشی.",
                "description_en": "Profile registration, age, and learning objectives established.",
                "evidence": ["account_created"],
                "action_href": "/dashboard",
            },
            {
                "id": "placement",
                "title_fa": "گام ۲: ارزیابی تعیین سطح ۶ مهارتی",
                "title_en": "Step 2: 6-Skill Diagnostic Placement Test",
                "status": "current",
                "description_fa": "ارزیابی ۶ مهارت (دستور زبان، واژگان، درک مطلب، شنیداری، گفتاری، نگارش) برای تعیین دقیق نقشه راه یادگیری.",
                "description_en": "6-skill placement to establish your exact baseline without fake scores.",
                "evidence": ["placement_pending"],
                "action_href": "/placement",
            },
            {
                "id": "baseline_diagnosis",
                "title_fa": "گام ۳: گزارش تحلیل سطح و تشخیص CEFR",
                "title_en": "Step 3: Placement Analysis & CEFR Diagnosis Report",
                "status": "locked",
                "description_fa": "کارنامه تحلیلی نقاط قوت و نیازمند رشد پس از ارسال آزمون فعال می‌شود.",
                "description_en": "Diagnostic breakdown unlocks upon completing the placement test.",
                "evidence": [],
                "action_href": "/placement",
            },
            {
                "id": "curriculum_roadmap",
                "title_fa": "گام ۴: مسیر اختصاصی و نقشه کتب آموزشی",
                "title_en": "Step 4: Personalized Path & Visual Curriculum Roadmap",
                "status": "locked",
                "description_fa": "انتخاب خودکار کتاب استاندارد (American English File / Family & Friends / IELTS) و گراف پیشرفت.",
                "description_en": "Automated standard textbook matching and syllabus milestones.",
                "evidence": [],
                "action_href": "/path",
            },
            {
                "id": "class_enrollment",
                "title_fa": "گام ۵: ثبت‌نام کلاس آنلاین با مدرس",
                "title_en": "Step 5: Live Online Class Enrollment & Matching",
                "status": "locked",
                "description_fa": "تنظیم روزها و ساعات آزاد و انتخاب نوع کلاس (انفرادی یا گروهی تا ۴ نفر).",
                "description_en": "Select availability and class size (1-on-1 vs up to 4 students) to match a verified teacher.",
                "evidence": [],
                "action_href": "/path#enroll",
            },
            {
                "id": "adaptive_practice",
                "title_fa": "گام ۶: مأموریت‌های روزانه (تکالیف مدرس + SRS)",
                "title_en": "Step 6: Adaptive Daily Mission",
                "status": "upcoming",
                "description_fa": "برنامه تمرین روزانه شخصی‌سازی‌شده متناسب با برنامه زمانی و تکالیف شما.",
                "description_en": "Daily practice missions tailored to your pace and goals.",
                "evidence": ["future_daily_mission"],
                "action_href": "/today",
            },
            {
                "id": "ai_labs",
                "title_fa": "گام ۷: آزمایشگاه‌های هوش مصنوعی و تمرین عمیق",
                "title_en": "Step 7: AI Labs & Deep Practice",
                "status": "planned",
                "description_fa": "منتور نگارش، آزمایشگاه صوت و تلفظ، شبیه‌ساز مکالمه و تمرین اشتباهات پرتکرار.",
                "description_en": "Writing Mentor, Voice/Pronunciation Lab, AI Roleplay, and Mistake Genome drills.",
                "evidence": [],
                "action_href": "/practice-ai",
            },
        ],
        "curriculum_recommendation": curriculum,
        "class_status": class_status,
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

    curriculum = recommend_curriculum_for_user(user)
    class_status = get_learner_class_status(user)

    timeline = [
        {
            "id": "onboarding_profiling",
            "title_fa": "گام ۱: مشخصات و هدف‌گذاری آموزشی",
            "title_en": "Step 1: Onboarding & Goal Profiling",
            "status": "complete",
            "description_fa": "ثبت هدف یادگیری و ویژگی‌های آموزشی زبان‌آموز.",
            "description_en": "Target goals and learner profile registered.",
            "evidence": ["profile_ready"],
            "action_href": "/dashboard",
        },
        {
            "id": "placement",
            "title_fa": "گام ۲: ارزیابی تعیین سطح ۶ مهارتی",
            "title_en": "Step 2: 6-Skill Diagnostic Placement Test",
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
            "id": "baseline_diagnosis",
            "title_fa": f"گام ۳: گزارش تحلیل و تقویت {lowest_label_fa}",
            "title_en": f"Step 3: Diagnostic Report & {lowest_label_en} Focus",
            "status": "complete",
            "description_fa": f"تمرکز تحلیلی بر روی نقاط چالش و اولویت‌بندی مهارت {lowest_label_fa}.",
            "description_en": f"Targeted diagnosis identifying {lowest_label_en} as priority growth area.",
            "evidence": [f"priority_skill:{primary_growth['skill'] if primary_growth else 'writing'}"],
            "action_href": "/placement/report",
        },
        {
            "id": "curriculum_roadmap",
            "title_fa": f"گام ۴: نقشه راه کتب آموزشی ({curriculum['book_title']})",
            "title_en": f"Step 4: Curriculum Roadmap ({curriculum['book_title']})",
            "status": "complete",
            "description_fa": f"انتخاب خودکار کتاب {curriculum['book_title']} ({curriculum['publisher']}) منطبق بر سطح {estimated_cefr} و سرفصل آموزشی.",
            "description_en": f"Assigned {curriculum['book_title']} ({curriculum['publisher']}) tailored to {estimated_cefr} baseline.",
            "evidence": [f"book:{curriculum['slug']}", f"track:{curriculum['track']}"],
            "action_href": "/path#curriculum",
        },
        {
            "id": "class_enrollment",
            "title_fa": "گام ۵: ثبت‌نام کلاس آنلاین و اتصال به مدرس",
            "title_en": "Step 5: Live Online Class Enrollment & Teacher Matching",
            "status": "complete" if class_status["is_enrolled"] else ("current" if class_status["has_active_request"] else "upcoming"),
            "description_fa": (
                f"عضو فعال در کلاس {class_status['cohort']['title']} با مدرس {class_status['cohort']['teacher_name']}."
                if class_status["is_enrolled"]
                else ("درخواست ثبت‌نام کلاس آنلاین شما ثبت شده و در انتظار پذیرش توسط مدرس است." if class_status["has_active_request"] else "ثبت ساعات آزاد و انتخاب نوع کلاس (انفرادی یا گروهی تا ۴ نفر) جهت اتصال به مدرس مجرب.")
            ),
            "description_en": (
                f"Enrolled in {class_status['cohort']['title']} with teacher {class_status['cohort']['teacher_name']}."
                if class_status["is_enrolled"]
                else ("Class request is active in teacher queue." if class_status["has_active_request"] else "Configure weekly availability and class format (solo vs group up to 4).")
            ),
            "evidence": ["enrolled_cohort" if class_status["is_enrolled"] else ("pending_class_request" if class_status["has_active_request"] else "not_requested")],
            "action_href": "/path#enroll",
        },
        {
            "id": "adaptive_practice",
            "title_fa": "گام ۶: مأموریت‌های روزانه تطبیقی (تکالیف مدرس + SRS)",
            "title_en": "Step 6: Adaptive Daily Mission",
            "status": "current" if class_status["is_enrolled"] else "upcoming",
            "description_fa": "برنامه روزانه شامل واژگان لایتنر، تمرین مهارت‌های هدف و تکالیف محوله مدرس.",
            "description_en": "Daily missions tailored to your proficiency, teacher homework, and SRS retention.",
            "evidence": ["future_daily_mission"],
            "action_href": "/today",
        },
        {
            "id": "ai_labs",
            "title_fa": "گام ۷: آزمایشگاه‌های هوش مصنوعی و تمرین عمیق",
            "title_en": "Step 7: AI Labs & Deep Practice",
            "status": "planned",
            "description_fa": "منتور نگارش مقاله، آزمایشگاه صوت و تلفظ، شبیه‌ساز مکالمه و تمرین بر روی ژنوم اشتباهات.",
            "description_en": "Writing Mentor, Voice Lab, AI Roleplay Universe, and Mistake Genome drills.",
            "evidence": ["ai_labs_available"],
            "action_href": "/practice-ai",
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
        "curriculum_recommendation": curriculum,
        "class_status": class_status,
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

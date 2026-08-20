def build_learning_path(user):
    twin = getattr(user, 'learner_twin', None)
    evidence_count = getattr(twin, 'evidence_count', 0) if twin else 0

    return {
        "generated_from": [
            "placement",
            "learner_twin",
            "future_learning_evidence",
        ],
        "next_best_step": "placement_review",
        "next_best_step_fa": "مرور نتیجه تعیین سطح و شروع مسیر پیشنهادی",
        "next_best_step_en": "Review placement and start the suggested path",
        "timeline": [
            {
                "id": "foundation",
                "title_fa": "ساخت پایه",
                "title_en": "Build foundations",
                "status": "current",
                "description_fa": "مهارت‌های پایه بر اساس شواهد واقعی تقویت می‌شوند.",
                "description_en": "Foundation skills improve from real evidence.",
                "evidence": [f"twin_evidence_count:{evidence_count}"],
            },
            {
                "id": "adaptive_practice",
                "title_fa": "تمرین تطبیقی",
                "title_en": "Adaptive practice",
                "status": "upcoming",
                "description_fa": "تمرین‌ها بعد از ساخت داده‌های بیشتر شخصی‌سازی می‌شوند.",
                "description_en": "Practice becomes personalized after more evidence exists.",
                "evidence": ["future_daily_mission"],
            },
            {
                "id": "teacher_support",
                "title_fa": "اتصال به مدرس",
                "title_en": "Teacher support",
                "status": "planned",
                "description_fa": "در صورت نیاز، مسیر به پشتیبانی مدرس متصل می‌شود.",
                "description_en": "The path can connect to teacher support when needed.",
                "evidence": ["future_teacher_evidence"],
            },
        ],
        "limitations_fa": [
            "این مسیر پیشنهاد اولیه است و بدون شواهد کافی سطح قطعی اعلام نمی‌کند.",
        ],
        "limitations_en": [
            "This is an initial path and does not claim a final level without evidence.",
        ],
    }

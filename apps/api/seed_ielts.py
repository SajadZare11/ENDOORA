"""
Django IELTS Exam Seeder
Ingests verified JSON fixtures from apps/web/data/ielts/ielts-mock-exams.json
into the Django SQLite database using standard Django ORM models.
"""

import json
import os
import sys
from decimal import Decimal

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "endoora_api.settings.development")

import django
django.setup()

from django.utils import timezone
from accounts.models import User
from ielts.models import (
    IELTSTest,
    IELTSTestType,
    IELTSTestStatus,
    IELTSSection,
    IELTSSectionType,
    IELTSPassageTask,
    IELTSQuestionGroup,
    IELTSQuestion,
    IELTSQuestionType,
    MANDATORY_IELTS_DISCLAIMER,
)

FIXTURES_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "web",
    "data",
    "ielts",
    "ielts-mock-exams.json",
)

QUESTION_TYPE_MAP = {
    "multiple_choice": IELTSQuestionType.MULTIPLE_CHOICE_SINGLE,
    "multiple_choice_multiple_answers": IELTSQuestionType.MULTIPLE_CHOICE_MULTIPLE,
    "fill_in_the_blank": IELTSQuestionType.NOTE_FORM_COMPLETION,
    "true_false_not_given": IELTSQuestionType.TRUE_FALSE_NOT_GIVEN,
    "yes_no_not_given": IELTSQuestionType.YES_NO_NOT_GIVEN,
    "matching_headings": IELTSQuestionType.MATCHING_HEADINGS,
    "matching_features": IELTSQuestionType.MATCHING_FEATURES,
    "map_labelling": IELTSQuestionType.DIAGRAM_MAP_LABELLING,
}


def seed_django_ielts():
    print("=======================================================")
    print("      DJANGO IELTS SEEDING & SYNC PIPELINE             ")
    print("=======================================================")

    if not os.path.exists(FIXTURES_PATH):
        print(f"Error: Fixture file not found at {FIXTURES_PATH}")
        sys.exit(1)

    with open(FIXTURES_PATH, "r", encoding="utf-8") as f:
        exams_data = json.load(f)

    print(f"Loaded {len(exams_data)} exams from JSON fixture.")

    author = User.objects.filter(role=User.Role.ADMINISTRATOR).first()
    if not author:
        author = User.objects.first()

    for exam_item in exams_data:
        category_str = (
            IELTSTestType.ACADEMIC
            if exam_item["category"] == "Academic"
            else IELTSTestType.GENERAL_TRAINING
        )

        test_obj, _ = IELTSTest.objects.update_or_create(
            title_en=exam_item["title"],
            defaults={
                "title_fa": f"آزمون شبیه‌ساز {exam_item['title']}",
                "test_type": category_str,
                "version": 1,
                "status": IELTSTestStatus.PUBLISHED,
                "author": author,
                "reviewed_at": timezone.now(),
                "copyright_source": f"Endoora Simulation Engine - {exam_item['source']} Mock Standards",
                "disclaimer_label": MANDATORY_IELTS_DISCLAIMER,
                "total_duration_minutes": exam_item.get("total_duration_minutes", 165),
                "difficulty_level": "Standard",
            },
        )
        print(f"\n[+] Seeded Test: {test_obj.title_en} (ID: {test_obj.id})")

        for mod_order, mod_item in enumerate(exam_item.get("modules", []), start=1):
            skill_map = {
                "listening": IELTSSectionType.LISTENING,
                "reading": IELTSSectionType.READING,
                "writing": IELTSSectionType.WRITING,
                "speaking": IELTSSectionType.SPEAKING,
            }
            sec_type = skill_map.get(mod_item["skill"], IELTSSectionType.READING)

            sec_obj, _ = IELTSSection.objects.update_or_create(
                test=test_obj,
                section_type=sec_type,
                defaults={
                    "order": mod_order,
                    "duration_minutes": mod_item.get("duration_minutes", 60),
                    "audio_media_url": mod_item.get("audio_url", ""),
                    "instructions_en": f"Official IELTS {sec_type.title()} examination instructions.",
                },
            )
            print(f"  -> Section: {sec_type} ({len(mod_item.get('sections', []))} parts)")

            for s_idx, sec_part in enumerate(mod_item.get("sections", []), start=1):
                task_obj, _ = IELTSPassageTask.objects.update_or_create(
                    section=sec_obj,
                    order=s_idx,
                    defaults={
                        "title": sec_part.get("passage_title", f"Part {s_idx}"),
                        "content_text": sec_part.get("passage_content", ""),
                    },
                )

                q_list = sec_part.get("questions", [])
                if q_list:
                    group_obj, _ = IELTSQuestionGroup.objects.update_or_create(
                        passage_task=task_obj,
                        order=1,
                        defaults={
                            "question_type": QUESTION_TYPE_MAP.get(
                                q_list[0].get("question_type"),
                                IELTSQuestionType.MULTIPLE_CHOICE_SINGLE,
                            ),
                            "instructions": sec_part.get("instructions", "Answer all questions."),
                        },
                    )

                    for q in q_list:
                        IELTSQuestion.objects.update_or_create(
                            group=group_obj,
                            question_number=q["question_number"],
                            defaults={
                                "prompt_text": q["prompt"],
                                "options": q.get("options", []),
                                "correct_answers": q.get("accepted_answers", []),
                                "explanation": q.get("explanation", ""),
                                "max_score": Decimal("1.00"),
                            },
                        )

    print("\n[OK] Django IELTS database seeding completed successfully!")


if __name__ == "__main__":
    seed_django_ielts()

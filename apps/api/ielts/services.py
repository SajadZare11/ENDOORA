import re
from decimal import Decimal
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from ielts.models import (
    IELTSTest,
    IELTSTestStatus,
    IELTSSection,
    IELTSPassageTask,
    IELTSQuestionGroup,
    IELTSQuestion,
    MANDATORY_IELTS_DISCLAIMER,
)


REQUIRED_QUALITY_CHECKLIST_KEYS = [
    "zero_copyright_infringement",
    "cefr_calibrated",
    "answer_key_verified",
    "audio_script_verified",
    "typo_and_formatting_checked",
]


def submit_test_for_review(test: IELTSTest, user) -> IELTSTest:
    """
    Submits a draft test to the editorial review queue.
    """
    if test.is_locked:
        raise ValidationError("آزمون قفل شده است و امکان تغییر وضعیت آن وجود ندارد.")

    if test.status != IELTSTestStatus.DRAFT:
        raise ValidationError("تنها آزمون‌های در وضعیت پیش‌نویس (Draft) قابل ارسال برای بازبینی هستند.")

    if not test.sections.exists():
        raise ValidationError("آزمون باید حداقل دارای یک بخش (Section) باشد.")

    has_questions = IELTSQuestion.objects.filter(group__passage_task__section__test=test).exists()
    if not has_questions:
        raise ValidationError("آزمون باید حداقل شامل یک سوال طراحی‌شده باشد.")

    if not test.copyright_source or len(test.copyright_source.strip()) < 10:
        raise ValidationError("ثبت منبع اصالت و عدم نقض کپی‌رایت (حداقل ۱۰ کاراکتر) پیش از ارسال الزامی است.")

    test.status = IELTSTestStatus.IN_REVIEW
    test.save(update_fields=["status", "updated_at"])
    return test


def review_and_approve_test(
    test: IELTSTest,
    reviewer,
    checklist: dict,
    notes: str = "",
) -> IELTSTest:
    """
    Two-Person Review Gate:
    Enforces that reviewer is distinct from the author, checks quality checklist, and approves the test.
    """
    if test.status != IELTSTestStatus.IN_REVIEW:
        raise ValidationError("تنها آزمون‌های در صف بازبینی (In Review) قابل بررسی و تأیید هستند.")

    # Two-Person Review Gate check
    if test.author_id and test.author_id == reviewer.id:
        raise ValidationError(
            "نقض قانون بازبینی دونفره (Two-Person Review): "
            "طراح یا مؤلف آزمون نمی‌تواند بازبین و تأییدکننده آزمون خود باشد."
        )

    # Validate quality checklist
    for key in REQUIRED_QUALITY_CHECKLIST_KEYS:
        if not checklist.get(key):
            raise ValidationError(
                f"تکمیل و تأیید تمام بندهای چک‌لیست کیفی الزامی است. بند '{key}' تأیید نشده است."
            )

    test.reviewed_by = reviewer
    test.reviewed_at = timezone.now()
    test.review_notes = notes
    test.quality_checklist = checklist
    test.status = IELTSTestStatus.APPROVED
    test.save(update_fields=["reviewed_by", "reviewed_at", "review_notes", "quality_checklist", "status", "updated_at"])
    return test


def publish_test(test: IELTSTest, user) -> IELTSTest:
    """
    Publishes an approved test and permanently locks its content for learner attempt consistency.
    """
    if test.status != IELTSTestStatus.APPROVED:
        raise ValidationError(
            "امکان انتشار آزمون بدون طی مرحله بازبینی و دریافت تأییدیه رسمی بازبین مستقل وجود ندارد."
        )

    if not test.reviewed_by_id or not test.reviewed_at:
        raise ValidationError("آزمون فاقد امضا یا تاریخچه بازبینی معتبر است.")

    if test.author_id and test.author_id == test.reviewed_by_id:
        raise ValidationError("نویسنده و بازبین آزمون نمی‌توانند شخص یکسانی باشند.")

    if not test.copyright_source or len(test.copyright_source.strip()) < 10:
        raise ValidationError("تأییدیه عدم نقض کپی‌رایت و اصالت متن آزمون ثبت نشده است.")

    # Trademark disclaimer verification
    disclaimer = (test.disclaimer_label or "").lower()
    if "not official ielts" not in disclaimer and "غیررسمی" not in disclaimer:
        raise ValidationError("درج بیانیه سلب مسئولیت قانونی 'شبیه‌ساز غیررسمی آیلتس' الزامی است.")

    test.status = IELTSTestStatus.PUBLISHED
    test.is_locked = True
    test.save(update_fields=["status", "is_locked", "updated_at"])
    return test


@transaction.atomic
def clone_test_new_version(test: IELTSTest, new_author) -> IELTSTest:
    """
    Clones a published or locked test into a brand-new editable DRAFT version (version + 1).
    Ensures complete isolation so existing learner test attempts remain unmodified.
    """
    new_version_num = test.version + 1

    new_test = IELTSTest.objects.create(
        title_en=test.title_en,
        title_fa=test.title_fa,
        test_type=test.test_type,
        version=new_version_num,
        status=IELTSTestStatus.DRAFT,
        author=new_author,
        reviewed_by=None,
        reviewed_at=None,
        review_notes="",
        is_locked=False,
        quality_checklist={},
        copyright_source=test.copyright_source,
        disclaimer_label=test.disclaimer_label or MANDATORY_IELTS_DISCLAIMER,
        total_duration_minutes=test.total_duration_minutes,
        difficulty_level=test.difficulty_level,
    )

    for section in test.sections.all().order_by("order"):
        new_section = IELTSSection.objects.create(
            test=new_test,
            section_type=section.section_type,
            order=section.order,
            duration_minutes=section.duration_minutes,
            instructions_en=section.instructions_en,
            instructions_fa=section.instructions_fa,
            audio_media_url=section.audio_media_url,
            audio_script=section.audio_script,
        )

        for pt in section.passages_tasks.all().order_by("order"):
            new_pt = IELTSPassageTask.objects.create(
                section=new_section,
                order=pt.order,
                title=pt.title,
                content_text=pt.content_text,
                media_image_url=pt.media_image_url,
                word_count=pt.word_count,
                metadata=dict(pt.metadata or {}),
            )

            for qg in pt.question_groups.all().order_by("order"):
                new_qg = IELTSQuestionGroup.objects.create(
                    passage_task=new_pt,
                    question_type=qg.question_type,
                    order=qg.order,
                    instructions=qg.instructions,
                    heading_options=list(qg.heading_options or []),
                )

                for q in qg.questions.all().order_by("question_number"):
                    IELTSQuestion.objects.create(
                        group=new_qg,
                        question_number=q.question_number,
                        prompt_text=q.prompt_text,
                        options=list(q.options or []),
                        correct_answers=list(q.correct_answers or []),
                        explanation=q.explanation,
                        max_score=q.max_score,
                    )

    return new_test


def normalize_ielts_answer(text: str) -> str:
    """
    Normalizes candidate answer string for robust comparison:
    strips whitespace, lowercases, collapses multi-spaces, removes trailing punctuation.
    """
    if not text:
        return ""
    cleaned = str(text).strip().lower()
    cleaned = re.sub(r"\s+", " ", cleaned)
    cleaned = re.sub(r"[.,;!?]+$", "", cleaned)
    return cleaned.strip()


def evaluate_ielts_answer(question: IELTSQuestion, candidate_answer: str | list) -> tuple[bool, Decimal]:
    """
    Evaluates a candidate answer against acceptable variants in question.correct_answers.
    Returns (is_correct, score).
    """
    if not candidate_answer:
        return False, Decimal("0.00")

    acceptable = [normalize_ielts_answer(ans) for ans in question.correct_answers]

    if isinstance(candidate_answer, list):
        # Multi-select matching or completion
        norm_list = [normalize_ielts_answer(item) for item in candidate_answer]
        is_match = any(item in acceptable for item in norm_list)
        return is_match, (question.max_score if is_match else Decimal("0.00"))

    cand_norm = normalize_ielts_answer(str(candidate_answer))
    is_match = cand_norm in acceptable
    return is_match, (question.max_score if is_match else Decimal("0.00"))

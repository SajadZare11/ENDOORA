from decimal import Decimal
from typing import Any

from ielts.models import IELTSQuestionType, IELTSSectionType


READING_ACADEMIC_RAW_TO_BAND = [
    (39, Decimal("9.0")),
    (37, Decimal("8.5")),
    (35, Decimal("8.0")),
    (33, Decimal("7.5")),
    (30, Decimal("7.0")),
    (27, Decimal("6.5")),
    (23, Decimal("6.0")),
    (19, Decimal("5.5")),
    (15, Decimal("5.0")),
    (13, Decimal("4.5")),
    (10, Decimal("4.0")),
    (8, Decimal("3.5")),
    (6, Decimal("3.0")),
    (4, Decimal("2.5")),
    (0, Decimal("2.0")),
]

LISTENING_RAW_TO_BAND = [
    (39, Decimal("9.0")),
    (37, Decimal("8.5")),
    (35, Decimal("8.0")),
    (32, Decimal("7.5")),
    (30, Decimal("7.0")),
    (26, Decimal("6.5")),
    (23, Decimal("6.0")),
    (18, Decimal("5.5")),
    (16, Decimal("5.0")),
    (13, Decimal("4.5")),
    (10, Decimal("4.0")),
    (8, Decimal("3.5")),
    (6, Decimal("3.0")),
    (4, Decimal("2.5")),
    (0, Decimal("2.0")),
]


def round_to_ielts_half_band(band: Decimal | float) -> Decimal:
    """
    Standard official IELTS rounding:
    e.g. 6.25 -> 6.5, 6.75 -> 7.0, 6.125 -> 6.0, 6.625 -> 6.5.
    Fraction < 0.25 rounds down to whole band.
    Fraction >= 0.25 and < 0.75 rounds to .5 band.
    Fraction >= 0.75 rounds up to next whole band.
    """
    val = float(band)
    whole = int(val)
    fraction = val - whole

    if fraction < 0.25:
        res = float(whole)
    elif fraction < 0.75:
        res = float(whole) + 0.5
    else:
        res = float(whole + 1)

    bounded = min(9.0, max(1.0, res))
    return Decimal(f"{bounded:.1f}")


def calculate_ielts_band(raw_score: Decimal | float, total_questions: int, skill: str) -> Decimal:
    """
    Converts raw points to standard 1.0–9.0 IELTS Band score.
    Supports both full 40-item tests and pro-rated mini-tests.
    """
    if total_questions <= 0 or float(raw_score) <= 0:
        return Decimal("1.0")

    # Normalize to 40-question benchmark
    normalized_40 = (float(raw_score) / float(total_questions)) * 40.0

    table = LISTENING_RAW_TO_BAND if skill == IELTSSectionType.LISTENING else READING_ACADEMIC_RAW_TO_BAND

    for min_raw, band in table:
        if normalized_40 >= min_raw:
            return band

    return Decimal("1.0")


def map_band_to_cefr(band: Decimal | float) -> dict[str, str]:
    """
    Maps IELTS Band to CEFR level description.
    """
    b = float(band)
    if b >= 8.5:
        return {"level": "C2", "descriptor_en": "Proficient User / Mastery", "descriptor_fa": "تسلط کامل و بومی (C2)"}
    if b >= 7.0:
        return {"level": "C1", "descriptor_en": "Effective Operational Proficiency", "descriptor_fa": "پیشرفته و روان (C1)"}
    if b >= 5.5:
        return {"level": "B2", "descriptor_en": "Vantage / Independent User", "descriptor_fa": "متوسط رو به بالا (B2)"}
    if b >= 4.0:
        return {"level": "B1", "descriptor_en": "Threshold / Intermediate", "descriptor_fa": "متوسط پایه (B1)"}
    return {"level": "A2", "descriptor_en": "Waystage / Elementary", "descriptor_fa": "مقدماتی (A2)"}


def generate_pedagogical_advice(question_type_diagnostics: dict[str, Any]) -> list[str]:
    """
    Generates actionable Persian learning advice based on candidate's question type weaknesses.
    """
    advice: list[str] = []

    tf_ng = question_type_diagnostics.get(IELTSQuestionType.TRUE_FALSE_NOT_GIVEN)
    if tf_ng and tf_ng.get("accuracy_pct", 100) < 60:
        advice.append(
            "در سوالات True / False / Not Given تمایز گزاره غلط (False) با گزاره ذکرنشده (Not Given) نیازمند تمرکز بیشتر است. به گزاره‌های تعمیم‌دهنده مثل always, only, completely توجه ویژه داشته باشید."
        )

    headings = question_type_diagnostics.get(IELTSQuestionType.MATCHING_HEADINGS)
    if headings and headings.get("accuracy_pct", 100) < 60:
        advice.append(
            "در سوالات Matching Headings ابتدا ایده محوری و جمله آغازین/پایانی پاراگراف را بخوانید و از تطبیق کلمه به کلمه سطحی با عناوین پرهیز کنید."
        )

    completion = question_type_diagnostics.get(IELTSQuestionType.NOTE_FORM_COMPLETION) or question_type_diagnostics.get(
        IELTSQuestionType.SENTENCE_COMPLETION
    )
    if completion and completion.get("accuracy_pct", 100) < 60:
        advice.append(
            "در سوالات تکمیلی (Completion) حتماً به محدودیت تعداد کلمات (مثلاً NO MORE THAN TWO WORDS) و گرامر بخش خالی دقت کنید تا نقش دستوری واژه صحیح باشد."
        )

    if not advice:
        advice.append(
            "عملکرد کلی شما در تمامی فرمت‌های سوالات متوازن و با دقت بالاست. برای ارتقای باند به ۸+، بر سرعت ریدینگ و مدیریت زمان تمرین کنید."
        )

    return advice

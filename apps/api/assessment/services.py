import uuid
from dataclasses import dataclass, field
from typing import Any


@dataclass(frozen=True)
class PlacementSectionResult:
    section: str
    answered: int
    correct: int
    total: int = 0
    score_percentage: float = 0.0
    objectives_covered: list[str] = field(default_factory=list)


def item_key_to_uuid(item_key: str) -> uuid.UUID:
    """Derive a stable UUID from a question key string."""
    try:
        return uuid.UUID(str(item_key))
    except (ValueError, AttributeError):
        return uuid.uuid5(uuid.NAMESPACE_DNS, f"endoora-placement-{item_key}")


def normalize_answer(val: Any) -> str:
    """Conservative answer normalization."""
    if val is None:
        return ""
    if isinstance(val, dict):
        val = val.get("selected_option", "")
    return str(val).strip().lower()


def calculate_section_result(
    section: str,
    answers: list[dict],
    total: int | None = None,
) -> PlacementSectionResult:
    """Calculate deterministic score and evidence for a placement section."""
    answered = len(answers)
    tot = total if total is not None else answered
    correct = sum(1 for item in answers if item.get("is_correct") is True)
    percentage = round((correct / tot) * 100, 2) if tot > 0 else 0.0
    objectives = sorted(list({item.get("objective") for item in answers if item.get("objective")}))

    return PlacementSectionResult(
        section=section,
        answered=answered,
        correct=correct,
        total=tot,
        score_percentage=percentage,
        objectives_covered=objectives,
    )


def evaluate_placement_answers(
    items: list[dict],
    learner_answers: dict[str, Any],
) -> dict[str, Any]:
    """
    Evaluates learner answers against item bank correct options server-side.
    Stores evidence for each item without exposing answer keys to learner endpoints.
    """
    section_results: dict[str, dict] = {}
    evidence_items: list[dict] = []

    # Group items by section
    items_by_section: dict[str, list[dict]] = {}
    for item in items:
        sec = item.get("section", "general").lower()
        items_by_section.setdefault(sec, []).append(item)

    total_correct = 0
    total_answered = 0
    total_questions = len(items)

    for sec, sec_items in items_by_section.items():
        evaluated_for_sec = []
        for itm in sec_items:
            q_id = itm.get("id")
            expected = normalize_answer(itm.get("correct_option"))
            given_raw = learner_answers.get(q_id)
            given = normalize_answer(given_raw)

            has_answered = given_raw is not None and str(given_raw).strip() != ""
            is_correct = has_answered and (given == expected)

            if has_answered:
                total_answered += 1
            if is_correct:
                total_correct += 1

            record = {
                "item_id": q_id,
                "section": sec,
                "difficulty": itm.get("difficulty", "medium"),
                "cefr_level": itm.get("cefr_level", "A1"),
                "objective": itm.get("objective", ""),
                "has_answered": has_answered,
                "is_correct": is_correct,
            }
            evaluated_for_sec.append(record)
            evidence_items.append(record)

        sec_result = calculate_section_result(sec, evaluated_for_sec, total=len(sec_items))
        section_results[sec] = {
            "section": sec,
            "total": sec_result.total,
            "answered": sec_result.answered,
            "correct": sec_result.correct,
            "score_percentage": sec_result.score_percentage,
            "objectives_covered": sec_result.objectives_covered,
        }

    overall_percentage = round((total_correct / total_questions) * 100, 2) if total_questions else 0.0

    return {
        "total_questions": total_questions,
        "total_answered": total_answered,
        "total_correct": total_correct,
        "overall_percentage": overall_percentage,
        "sections": section_results,
        "evidence": evidence_items,
        "notice": "این کارنامه یک برآورد آموزشی اولیه بر اساس بخش‌های گرامر، واژگان و درک مطلب است و مدرک رسمی یا نهایی CEFR محسوب نمی‌شود.",
    }

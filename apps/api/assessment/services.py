import re
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
        val = val.get("selected_option", val.get("spoken_text", val.get("written_text", "")))
    return str(val).strip().lower()


def map_score_to_cefr_estimate(score_percentage: float) -> str:
    """
    Map score to provisional CEFR band according to docs/assessment/scoring-model.md:
    90-100: C1
    75-89: B2
    60-74: B1
    45-59: A2
    0-44: A1
    """
    if score_percentage >= 90.0:
        return "C1"
    if score_percentage >= 75.0:
        return "B2"
    if score_percentage >= 60.0:
        return "B1"
    if score_percentage >= 45.0:
        return "A2"
    return "A1"


def evaluate_speaking_response(itm: dict, raw_val: Any) -> dict[str, Any]:
    """
    Evaluates a learner speaking response server-side using word count,
    sufficiency against min_words, and topical keyword coverage.
    Protects rubrics and target keywords from ever leaking to pre-submission endpoints.
    """
    text = ""
    duration_sec = 0.0
    if isinstance(raw_val, dict):
        text = str(raw_val.get("spoken_text") or raw_val.get("text") or "").strip()
        try:
            duration_sec = float(raw_val.get("duration_sec") or 0.0)
        except (ValueError, TypeError):
            duration_sec = 0.0
    elif isinstance(raw_val, str):
        text = raw_val.strip()

    min_words = int(itm.get("min_words", 10))
    target_keywords = itm.get("target_keywords", [])

    # Tokenize English words
    words = [w for w in re.findall(r"\b[a-zA-Z']+\b", text.lower()) if len(w) > 1]
    word_count = len(words)

    has_answered = word_count > 0 or bool(text)

    if not has_answered:
        return {
            "has_answered": False,
            "is_correct": False,
            "score_percentage": 0.0,
            "word_count": 0,
            "min_words": min_words,
            "duration_sec": 0.0,
        }

    # 1. Word count sufficiency ratio
    word_ratio = min(1.0, word_count / max(1, min_words))

    # 2. Semantic keywords coverage
    matched_keywords = [kw for kw in target_keywords if kw.lower() in text.lower()]
    target_threshold = max(1, round(len(target_keywords) * 0.4)) if target_keywords else 1
    kw_ratio = min(1.0, len(matched_keywords) / target_threshold) if target_keywords else 1.0

    # Score: 50% length sufficiency + 50% vocabulary coverage
    score = round((0.5 * word_ratio + 0.5 * kw_ratio) * 100, 2)
    is_correct = score >= 50.0

    return {
        "has_answered": True,
        "is_correct": is_correct,
        "score_percentage": score,
        "word_count": word_count,
        "min_words": min_words,
        "matched_keywords_count": len(matched_keywords),
        "duration_sec": duration_sec,
    }


def evaluate_writing_response(itm: dict, raw_val: Any) -> dict[str, Any]:
    """
    Evaluates a learner writing response server-side using word count,
    sufficiency against min_words, topical keyword coverage, and sentence structure.
    Protects rubrics and target keywords from ever leaking to pre-submission endpoints.
    """
    text = ""
    if isinstance(raw_val, dict):
        text = str(raw_val.get("written_text") or raw_val.get("text") or "").strip()
    elif isinstance(raw_val, str):
        text = raw_val.strip()

    min_words = int(itm.get("min_words", 15))
    target_keywords = itm.get("target_keywords", [])

    # Tokenize English words
    words = [w for w in re.findall(r"\b[a-zA-Z']+\b", text.lower()) if len(w) > 1]
    word_count = len(words)

    has_answered = word_count > 0 or bool(text)

    if not has_answered:
        return {
            "has_answered": False,
            "is_correct": False,
            "score_percentage": 0.0,
            "word_count": 0,
            "min_words": min_words,
            "sentences_count": 0,
            "matched_keywords_count": 0,
        }

    # 1. Word count sufficiency ratio
    word_ratio = min(1.0, word_count / max(1, min_words))

    # 2. Semantic keywords coverage
    matched_keywords = [kw for kw in target_keywords if kw.lower() in text.lower()]
    target_threshold = max(1, round(len(target_keywords) * 0.4)) if target_keywords else 1
    kw_ratio = min(1.0, len(matched_keywords) / target_threshold) if target_keywords else 1.0

    # 3. Structural coherence / sentences
    raw_sentences = [s.strip() for s in re.split(r"[.!?\n]+", text) if len(s.strip()) > 3]
    sentences_count = len(raw_sentences)
    struct_ratio = min(1.0, sentences_count / max(1, 2 if min_words >= 25 else 1))

    # Score: 40% length sufficiency + 40% vocabulary coverage + 20% structure
    score = round((0.4 * word_ratio + 0.4 * kw_ratio + 0.2 * struct_ratio) * 100, 2)
    is_correct = score >= 50.0

    return {
        "has_answered": True,
        "is_correct": is_correct,
        "score_percentage": score,
        "word_count": word_count,
        "min_words": min_words,
        "sentences_count": sentences_count,
        "matched_keywords_count": len(matched_keywords),
    }


def calculate_section_result(
    section: str,
    answers: list[dict],
    total: int | None = None,
) -> PlacementSectionResult:
    """Calculate deterministic score and evidence for a placement section."""
    answered = len(answers)
    tot = total if total is not None else answered
    correct = sum(1 for item in answers if item.get("is_correct") is True)

    if section in ("speaking", "writing") and tot > 0:
        # For speaking and writing, score percentage is the average of evaluated items
        item_scores = [item.get("score_percentage", 0.0) for item in answers if "score_percentage" in item]
        if item_scores:
            percentage = round(sum(item_scores) / tot, 2)
        else:
            percentage = round((correct / tot) * 100, 2)
    else:
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
    Evaluates learner answers against item bank correct options and speaking rubrics server-side.
    Stores evidence for each item without exposing answer keys or rubrics to learner endpoints.
    Calculates 5-section average score and provisional CEFR estimate.
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
            given_raw = learner_answers.get(q_id)

            if sec == "speaking":
                spk_eval = evaluate_speaking_response(itm, given_raw)
                has_answered = spk_eval["has_answered"]
                is_correct = spk_eval["is_correct"]
                item_score = spk_eval["score_percentage"]

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
                    "score_percentage": item_score,
                    "word_count": spk_eval["word_count"],
                    "min_words": spk_eval["min_words"],
                }
            elif sec == "writing":
                wrt_eval = evaluate_writing_response(itm, given_raw)
                has_answered = wrt_eval["has_answered"]
                is_correct = wrt_eval["is_correct"]
                item_score = wrt_eval["score_percentage"]

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
                    "score_percentage": item_score,
                    "word_count": wrt_eval["word_count"],
                    "min_words": wrt_eval["min_words"],
                    "sentences_count": wrt_eval["sentences_count"],
                }
            else:
                expected = normalize_answer(itm.get("correct_option"))
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
                    "score_percentage": 100.0 if is_correct else 0.0,
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

    # Overall score calculation: sum(section scores) / number of sections (scoring-model.md)
    if section_results:
        sec_scores = [s["score_percentage"] for s in section_results.values()]
        overall_percentage = round(sum(sec_scores) / len(sec_scores), 2)
    else:
        overall_percentage = 0.0

    estimated_cefr = map_score_to_cefr_estimate(overall_percentage)

    return {
        "total_questions": total_questions,
        "total_answered": total_answered,
        "total_correct": total_correct,
        "overall_percentage": overall_percentage,
        "estimated_cefr_level": estimated_cefr,
        "sections": section_results,
        "evidence": evidence_items,
        "notice": "این کارنامه یک برآورد آموزشی اولیه بر اساس بخش‌های گرامر، واژگان، درک مطلب، شنیداری، گفتاری و نگارش است و مدرک رسمی یا نهایی CEFR محسوب نمی‌شود.",
    }

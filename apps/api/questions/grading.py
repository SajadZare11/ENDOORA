from __future__ import annotations

from typing import Any
from django.core.exceptions import ValidationError

from .models import QuestionVersion
from .normalization import normalize_list, normalize_text


def _ensure_list(value: Any) -> list[Any]:
    if not isinstance(value, list):
        raise ValidationError("This response must be a list.")
    return value


def grade_response(version: QuestionVersion, response: Any) -> dict[str, Any]:
    qtype = version.question_type
    key = version.answer_key or {}

    if qtype == QuestionVersion.QuestionType.MCQ:
        expected = normalize_text(key.get("correct_option", ""))
        return {"status": "scored", "correct": bool(expected) and normalize_text(response) == expected}

    if qtype == QuestionVersion.QuestionType.MULTI_SELECT:
        expected = sorted(normalize_list(key.get("correct_options", [])))
        actual = sorted(normalize_list(_ensure_list(response)))
        return {"status": "scored", "correct": bool(expected) and actual == expected}

    if qtype in {
        QuestionVersion.QuestionType.GAP,
        QuestionVersion.QuestionType.SHORT_ANSWER,
        QuestionVersion.QuestionType.AUDIO,
    }:
        accepted = key.get("accepted", [])
        if not isinstance(accepted, list):
            raise ValidationError("Question answer key is malformed.")
        accepted = list(accepted) + list(version.accepted_variants or [])
        case_sensitive = bool(key.get("case_sensitive", False))
        strip_punctuation = bool(key.get("strip_punctuation", False))
        normalized = {
            normalize_text(x, case_sensitive=case_sensitive, strip_punctuation=strip_punctuation)
            for x in accepted
        }
        actual = normalize_text(
            response, case_sensitive=case_sensitive, strip_punctuation=strip_punctuation
        )
        return {"status": "scored", "correct": bool(normalized) and actual in normalized}

    if qtype == QuestionVersion.QuestionType.MATCHING:
        expected = key.get("pairs", {})
        if not isinstance(expected, dict) or not isinstance(response, dict):
            raise ValidationError("Matching response/key must be objects.")
        e = {normalize_text(k): normalize_text(v) for k, v in expected.items()}
        a = {normalize_text(k): normalize_text(v) for k, v in response.items()}
        return {"status": "scored", "correct": bool(e) and a == e}

    if qtype == QuestionVersion.QuestionType.ORDERING:
        expected = normalize_list(key.get("order", []))
        actual = normalize_list(_ensure_list(response))
        return {"status": "scored", "correct": bool(expected) and actual == expected}

    if qtype in {
        QuestionVersion.QuestionType.LONG_WRITING,
        QuestionVersion.QuestionType.SPEAKING,
    }:
        return {"status": "manual_review_required", "correct": None}

    raise ValidationError("Unsupported question type.")

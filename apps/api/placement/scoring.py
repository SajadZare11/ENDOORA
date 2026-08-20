from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class SectionScore:
    section: str
    correct: int
    total: int
    percentage: float


def normalize_answer(value: Any) -> str:
    return str(value).strip().lower()


def score_section(section: str, responses: list[dict]) -> SectionScore:
    correct = 0
    total = len(responses)

    for item in responses:
        answer = normalize_answer(item.get("answer"))
        expected = normalize_answer(item.get("correct_answer"))
        if answer == expected:
            correct += 1

    percentage = round((correct / total) * 100, 2) if total else 0
    return SectionScore(section, correct, total, percentage)

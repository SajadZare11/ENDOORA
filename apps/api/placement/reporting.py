"""
Day 17 - Placement transparent reporting.

This module intentionally produces an explainable estimate, not an official
CEFR certification. It keeps evidence, confidence and limitations visible.
"""
from dataclasses import dataclass
from typing import Any


CEFR_BANDS = [
    (90, "C1"),
    (75, "B2"),
    (60, "B1"),
    (45, "A2"),
    (0, "A1"),
]


@dataclass(frozen=True)
class SkillEvidence:
    skill: str
    score: float
    evidence: list[str]


def estimate_cefr(overall_score: float) -> str:
    for threshold, level in CEFR_BANDS:
        if overall_score >= threshold:
            return level
    return "A1"


def confidence_from_evidence(total_items: int) -> str:
    if total_items >= 40:
        return "high"
    if total_items >= 20:
        return "medium"
    return "low"


def build_placement_report(
    section_scores: dict[str, float],
    evidence: list[SkillEvidence],
) -> dict[str, Any]:
    scores = list(section_scores.values())
    overall = round(sum(scores) / len(scores), 2) if scores else 0

    return {
        "estimate": estimate_cefr(overall),
        "overall_score": overall,
        "confidence": confidence_from_evidence(len(evidence)),
        "skills": [
            {
                "skill": item.skill,
                "score": item.score,
                "evidence": item.evidence,
            }
            for item in evidence
        ],
        "limitations": [
            "این گزارش تخمین سطح است و مدرک رسمی CEFR محسوب نمی‌شود.",
            "نتیجه با افزایش تعداد پاسخ‌ها و مهارت‌های ارزیابی‌شده دقیق‌تر می‌شود.",
        ],
        "next_actions": [
            "تمرین مهارت‌هایی که کمترین امتیاز را گرفته‌اند.",
            "شروع مسیر یادگیری متناسب با سطح تخمینی.",
        ],
    }

from dataclasses import dataclass


@dataclass(frozen=True)
class PlacementSectionResult:
    section: str
    answered: int
    correct: int


def calculate_section_result(section: str, answers: list[dict]) -> PlacementSectionResult:
    return PlacementSectionResult(
        section=section,
        answered=len(answers),
        correct=sum(1 for item in answers if item.get("is_correct") is True),
    )

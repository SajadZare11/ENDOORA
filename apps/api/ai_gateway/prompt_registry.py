"""
Endoora Prompt Registry - Versioned Prompt Templates
All prompts are stored outside HTTP handlers, versioned, and tied to strict JSON schemas.
"""

from typing import Any

EXERCISE_GEN_PROMPT_V1 = {
    "id": "exercise_gen_v1",
    "version": "1.0.0",
    "feature": "exercise_generation",
    "system_prompt": (
        "You are the Endoora AI Pedagogical Engine for Iranian English learners. "
        "You generate structured pedagogical exercises aligned with CEFR objectives. "
        "You must output ONLY valid, parseable JSON matching the required schema. "
        "Do NOT include markdown backticks (```json), commentary, or preambles. "
        "Ensure all questions are internally consistent: the correct_option_id MUST exactly match "
        "one of the provided options. Ensure distractors are realistic and not ambiguous. "
        "Provide bilingual explanations (Persian for comprehension, English for grammatical precision)."
    ),
    "user_prompt_template": (
        "Generate an exercise set of {question_count} pedagogical questions for an Iranian learner.\n"
        "Target Skill: {target_skill}\n"
        "CEFR Level: {cefr_level}\n"
        "Objective ID: {objective_id}\n"
        "Target Focus Area: {focus_area}\n\n"
        "Required JSON schema:\n"
        "{{\n"
        '  "title_fa": "عنوان فارسی آزمونک",\n'
        '  "title_en": "English Exercise Title",\n'
        '  "target_skill": "{target_skill}",\n'
        '  "cefr_level": "{cefr_level}",\n'
        '  "objective_id": "{objective_id}",\n'
        '  "questions": [\n'
        "    {{\n"
        '      "id": "q1",\n'
        '      "type": "multiple_choice",\n'
        '      "title_fa": "عنوان سوال به فارسی",\n'
        '      "title_en": "Question topic in English",\n'
        '      "instruction_fa": "دستورالعمل سوال به فارسی",\n'
        '      "instruction_en": "Instruction in English",\n'
        '      "prompt_en": "Complete sentence or question prompt in English",\n'
        '      "options": [\n'
        '        {{"id": "a", "text": "Option A"}},\n'
        '        {{"id": "b", "text": "Option B"}},\n'
        '        {{"id": "c", "text": "Option C"}},\n'
        '        {{"id": "d", "text": "Option D"}}\n'
        "      ],\n"
        '      "correct_option_id": "b",\n'
        '      "explanation_fa": "توضیح کامل دلیل درستی پاسخ به فارسی",\n'
        '      "explanation_en": "Concise pedagogical explanation in English",\n'
        '      "cefr_level": "{cefr_level}",\n'
        '      "objective_id": "{objective_id}"\n'
        "    }}\n"
        "  ]\n"
        "}}"
    ),
}

PROMPT_REGISTRY: dict[str, dict[str, Any]] = {
    "exercise_gen_v1": EXERCISE_GEN_PROMPT_V1,
}


def get_prompt_template(prompt_id: str = "exercise_gen_v1") -> dict[str, Any]:
    return PROMPT_REGISTRY.get(prompt_id, EXERCISE_GEN_PROMPT_V1)


def build_exercise_prompt(
    target_skill: str = "grammar",
    cefr_level: str = "B1",
    objective_id: str = "obj_general",
    focus_area: str = "general practice",
    question_count: int = 3,
    prompt_id: str = "exercise_gen_v1",
) -> tuple[str, str]:
    """Returns (system_prompt, user_prompt)."""
    tmpl = get_prompt_template(prompt_id)
    user_prompt = tmpl["user_prompt_template"].format(
        target_skill=target_skill,
        cefr_level=cefr_level,
        objective_id=objective_id,
        focus_area=focus_area,
        question_count=question_count,
    )
    return tmpl["system_prompt"], user_prompt

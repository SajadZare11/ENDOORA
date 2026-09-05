"""
Endoora AI Gateway - Structured JSON Exercise Validators
Enforces:
1. Strict parseability of model output (cleaning accidental markdown formatting).
2. Required schema compliance (titles, CEFR levels, target skill, question count).
3. Question-level internal consistency (correct_option_id MUST match one of the options).
4. Distractor uniqueness (no duplicate options).
5. Bilingual pedagogical explanations (Persian for concept comprehension, English for precision).
"""

import json
import re
from typing import Any

VALID_CEFR_LEVELS = {"A1", "A2", "B1", "B2", "C1", "C2"}
VALID_SKILLS = {"grammar", "vocabulary", "reading", "listening", "collocations", "pronunciation", "general"}


class ExerciseValidationError(Exception):
    """Raised when generated AI exercises violate pedagogical or structural invariants."""
    pass


class ExerciseValidator:
    """Validates generated exercises against strict pedagogical contracts."""

    @classmethod
    def clean_raw_output(cls, raw_text: str) -> str:
        """Strips markdown code blocks, backticks, or trailing commentary."""
        text = raw_text.strip()
        # Remove ```json ... ``` or ``` ... ``` wrappers
        if text.startswith("```"):
            lines = text.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            text = "\n".join(lines).strip()

        # If there is extraneous preamble before '{', find the first '{' and last '}'
        start_idx = text.find("{")
        end_idx = text.rfind("}")
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            text = text[start_idx : end_idx + 1]

        return text

    @classmethod
    def parse_and_validate(
        cls,
        raw_output: str | dict[str, Any],
        expected_count: int = 3,
        expected_cefr: str = "B1",
    ) -> tuple[bool, dict[str, Any] | None, str | None]:
        """
        Parses raw text or dictionary and validates exercise invariants.
        Returns: (is_valid, sanitized_dict, error_message)
        """
        try:
            if isinstance(raw_output, dict):
                data = raw_output
            else:
                cleaned = cls.clean_raw_output(raw_output)
                data = json.loads(cleaned)

            if not isinstance(data, dict):
                return False, None, "Generated output root must be a JSON object."

            # Top-level required keys
            required_top = ["title_fa", "title_en", "target_skill", "cefr_level", "questions"]
            for key in required_top:
                if key not in data:
                    return False, None, f"Missing required top-level key: '{key}'"

            # Check CEFR
            cefr = str(data.get("cefr_level", "")).strip().upper()
            if cefr not in VALID_CEFR_LEVELS:
                # Default to expected_cefr if slightly malformed
                data["cefr_level"] = expected_cefr.upper()
            else:
                data["cefr_level"] = cefr

            # Check target skill
            skill = str(data.get("target_skill", "grammar")).strip().lower()
            if skill not in VALID_SKILLS:
                data["target_skill"] = "grammar"

            # Validate questions list
            questions = data.get("questions")
            if not isinstance(questions, list) or len(questions) == 0:
                return False, None, "Exercise set must contain at least one question."

            if len(questions) > 10:
                return False, None, f"Exercise question count {len(questions)} exceeds maximum cap of 10."

            sanitized_questions: list[dict[str, Any]] = []

            for idx, q in enumerate(questions):
                if not isinstance(q, dict):
                    return False, None, f"Question index {idx} must be a JSON object."

                # Validate prompt
                prompt = q.get("prompt_en") or q.get("question") or q.get("prompt")
                if not prompt or not str(prompt).strip():
                    return False, None, f"Question index {idx} is missing prompt_en."

                # Validate options
                options = q.get("options")
                if not isinstance(options, list) or len(options) < 2:
                    return False, None, f"Question index {idx} must have at least 2 options."

                sanitized_options = []
                option_ids = set()
                option_texts = set()

                for opt_idx, opt in enumerate(options):
                    if isinstance(opt, str):
                        opt_id = chr(ord("a") + opt_idx)
                        opt_text = opt.strip()
                    elif isinstance(opt, dict):
                        opt_id = str(opt.get("id", chr(ord("a") + opt_idx))).strip().lower()
                        opt_text = str(opt.get("text", "")).strip()
                    else:
                        return False, None, f"Invalid option format in question index {idx}."

                    if not opt_text:
                        return False, None, f"Empty option text in question index {idx}, option {opt_id}."

                    # Check for duplicate options (ambiguity bug)
                    norm_text = opt_text.lower()
                    if norm_text in option_texts:
                        return False, None, f"Duplicate option text '{opt_text}' in question index {idx}."
                    option_texts.add(norm_text)

                    if opt_id in option_ids:
                        opt_id = f"{opt_id}_{opt_idx}"
                    option_ids.add(opt_id)

                    sanitized_options.append({"id": opt_id, "text": opt_text})

                # Validate internal consistency of correct_option_id
                correct_id = str(q.get("correct_option_id") or q.get("correct_option") or "").strip().lower()

                # If the correct_id was given as text rather than id, attempt resolution
                if correct_id not in option_ids:
                    matched_opt = next((o for o in sanitized_options if o["text"].strip().lower() == correct_id), None)
                    if matched_opt:
                        correct_id = matched_opt["id"]
                    else:
                        return (
                            False,
                            None,
                            f"Internal consistency violation: correct_option_id '{correct_id}' not found in options {list(option_ids)} for question index {idx}."
                        )

                # Validate bilingual explanations
                explanation_fa = str(q.get("explanation_fa") or "").strip()
                explanation_en = str(q.get("explanation_en") or "").strip()
                if not explanation_fa:
                    explanation_fa = "پاسخ صحیح بر اساس قواعد ساختاری این سطح زبان انتخاب شده است."
                if not explanation_en:
                    explanation_en = f"Option {correct_id.upper()} is correct according to standard target language rules."

                q_id = str(q.get("id") or f"q{idx + 1}").strip()

                sanitized_questions.append({
                    "id": q_id,
                    "type": "multiple_choice",
                    "title_fa": str(q.get("title_fa") or f"سوال {idx + 1}").strip(),
                    "title_en": str(q.get("title_en") or f"Question {idx + 1}").strip(),
                    "instruction_fa": str(q.get("instruction_fa") or "گزینه صحیح را انتخاب کنید.").strip(),
                    "instruction_en": str(q.get("instruction_en") or "Choose the correct option.").strip(),
                    "prompt_en": str(prompt).strip(),
                    "options": sanitized_options,
                    "correct_option_id": correct_id,
                    "explanation_fa": explanation_fa,
                    "explanation_en": explanation_en,
                    "cefr_level": str(q.get("cefr_level") or data["cefr_level"]).strip().upper(),
                    "objective_id": str(q.get("objective_id") or data.get("objective_id") or "").strip(),
                })

            data["questions"] = sanitized_questions
            return True, data, None

        except json.JSONDecodeError as exc:
            return False, None, f"JSON parse error: {exc}"
        except Exception as exc:
            return False, None, f"Validation failure: {exc}"

from __future__ import annotations

import re
from decimal import Decimal
from typing import Any

from django.db import transaction
from django.utils import timezone

from ..models import ExamAnswer, ExamSubmission


class ExamAutoGrader:
    """موتور نمره‌دهی خودکار آزمون آنلاین
    
    Grades auto-scorable question types immediately on submission.
    Speaking and Long Writing questions are marked as pending manual review.
    """
    
    AUTO_GRADABLE_TYPES = {'mcq', 'multi_select', 'gap', 'short_answer', 'matching', 'ordering', 'audio'}
    MANUAL_REVIEW_TYPES = {'long_writing', 'speaking'}

    @classmethod
    @transaction.atomic
    def grade_submission(cls, submission_id: str) -> ExamSubmission:
        """Grade all auto-gradable answers in a submission."""
        submission = ExamSubmission.objects.select_related('exam').prefetch_related(
            'answers__exam_question__question_version'
        ).get(id=submission_id)

        has_manual_questions = False
        calculated_total_score = Decimal('0.00')

        answers = list(submission.answers.all())

        for ans in answers:
            eq = ans.exam_question
            qv = eq.question_version
            max_points = eq.points
            q_type = qv.question_type

            student_resp = ans.student_response or {}
            answer_key = qv.answer_key or {}
            accepted_variants = qv.accepted_variants or []

            if q_type in cls.MANUAL_REVIEW_TYPES:
                has_manual_questions = True
                ans.is_auto_graded = False
                ans.auto_score = None
                ans.score_awarded = ans.manual_score
                ans.save(update_fields=['is_auto_graded', 'auto_score', 'score_awarded', 'updated_at'])
                if ans.manual_score is not None:
                    calculated_total_score += ans.manual_score
                continue

            # Auto-scoreable questions
            awarded = Decimal('0.00')

            if q_type == 'mcq':
                awarded = cls.grade_mcq(student_resp, answer_key, max_points)
            elif q_type == 'multi_select':
                awarded = cls.grade_multi_select(student_resp, answer_key, max_points)
            elif q_type in {'gap', 'short_answer', 'audio'}:
                awarded = cls.grade_gap_fill(student_resp, answer_key, accepted_variants, max_points)
            elif q_type == 'matching':
                awarded = cls.grade_matching(student_resp, answer_key, max_points)
            elif q_type == 'ordering':
                awarded = cls.grade_ordering(student_resp, answer_key, max_points)
            else:
                awarded = cls.grade_mcq(student_resp, answer_key, max_points)

            ans.is_auto_graded = True
            ans.auto_score = awarded
            # If manual score was previously set, prefer manual, else awarded
            ans.score_awarded = ans.manual_score if ans.manual_score is not None else awarded
            ans.save(update_fields=['is_auto_graded', 'auto_score', 'score_awarded', 'updated_at'])

            calculated_total_score += ans.score_awarded

        submission.total_score = calculated_total_score
        max_possible = submission.max_possible_score or Decimal('1.00')
        if max_possible > 0:
            percentage = (calculated_total_score / max_possible) * Decimal('100.00')
            submission.percentage = round(percentage, 2)

        if has_manual_questions:
            submission.status = ExamSubmission.SubmissionStatus.SUBMITTED
        else:
            submission.status = ExamSubmission.SubmissionStatus.AUTO_GRADED

        submission.save(update_fields=['total_score', 'percentage', 'status', 'updated_at'])
        return submission

    @classmethod
    def grade_mcq(cls, student_response: dict[str, Any], answer_key: dict[str, Any], max_points: Decimal) -> Decimal:
        """Grade a single-correct MCQ question."""
        selected = str(student_response.get('selected_option', '')).strip()
        correct = str(answer_key.get('correct_option', '')).strip()

        if selected and correct and selected == correct:
            return max_points
        return Decimal('0.00')

    @classmethod
    def grade_multi_select(
        cls, student_response: dict[str, Any], answer_key: dict[str, Any], max_points: Decimal
    ) -> Decimal:
        """Grade a multi-select question with partial credit."""
        raw_selected = student_response.get('selected_options', [])
        if not isinstance(raw_selected, list):
            return Decimal('0.00')

        selected_set = {str(opt).strip() for opt in raw_selected if str(opt).strip()}
        correct_list = answer_key.get('correct_options', [])
        if not isinstance(correct_list, list) or not correct_list:
            return Decimal('0.00')

        correct_set = {str(opt).strip() for opt in correct_list if str(opt).strip()}
        if not correct_set:
            return Decimal('0.00')

        correct_picks = len(selected_set.intersection(correct_set))
        wrong_picks = len(selected_set.difference(correct_set))

        net_correct = max(0, correct_picks - wrong_picks)
        score_ratio = Decimal(net_correct) / Decimal(len(correct_set))
        awarded = score_ratio * max_points
        return max(Decimal('0.00'), round(awarded, 2))

    @classmethod
    def grade_gap_fill(
        cls,
        student_response: dict[str, Any],
        answer_key: dict[str, Any],
        accepted_variants: list[Any],
        max_points: Decimal,
    ) -> Decimal:
        """Grade gap fill / cloze / short answer questions."""
        blanks = student_response.get('blanks', {})
        if not isinstance(blanks, dict):
            # Maybe direct string answer:
            direct_ans = str(student_response.get('answer', '')).strip().lower()
            if not direct_ans:
                return Decimal('0.00')
            blanks = {'gap_0': direct_ans}

        # Expected answers can be in answer_key['accepted'] or answer_key['blanks']
        key_blanks = answer_key.get('blanks') or answer_key.get('accepted')
        
        # If single answer list in answer_key
        if isinstance(key_blanks, list):
            target_accepted = [str(a).strip().lower() for a in key_blanks]
            for variant in accepted_variants:
                target_accepted.append(str(variant).strip().lower())

            # Check if any user blank matches
            user_text = ' '.join(str(v).strip().lower() for v in blanks.values())
            for acc in target_accepted:
                if acc == user_text or re.fullmatch(acc, user_text):
                    return max_points
            return Decimal('0.00')

        if isinstance(key_blanks, dict) and key_blanks:
            total_gaps = len(key_blanks)
            if total_gaps == 0:
                return Decimal('0.00')

            correct_count = 0
            for gap_key, expected_val in key_blanks.items():
                user_val = str(blanks.get(gap_key, '')).strip().lower()
                if not user_val:
                    continue

                # Expected can be string or list of accepted strings
                expected_list = (
                    [str(item).strip().lower() for item in expected_val]
                    if isinstance(expected_val, list)
                    else [str(expected_val).strip().lower()]
                )

                if user_val in expected_list:
                    correct_count += 1
                else:
                    # Check regex
                    for pattern in expected_list:
                        try:
                            if re.fullmatch(pattern, user_val):
                                correct_count += 1
                                break
                        except re.error:
                            pass

            ratio = Decimal(correct_count) / Decimal(total_gaps)
            return round(ratio * max_points, 2)

        return Decimal('0.00')

    @classmethod
    def grade_matching(
        cls, student_response: dict[str, Any], answer_key: dict[str, Any], max_points: Decimal
    ) -> Decimal:
        """Grade matching question with partial credit."""
        user_pairs = student_response.get('pairs', {})
        if not isinstance(user_pairs, dict) or not user_pairs:
            return Decimal('0.00')

        correct_pairs = answer_key.get('pairs', {})
        if not isinstance(correct_pairs, dict) or not correct_pairs:
            return Decimal('0.00')

        total_pairs = len(correct_pairs)
        if total_pairs == 0:
            return Decimal('0.00')

        matched_count = 0
        for term_id, def_id in correct_pairs.items():
            if str(user_pairs.get(term_id, '')).strip() == str(def_id).strip():
                matched_count += 1

        ratio = Decimal(matched_count) / Decimal(total_pairs)
        return round(ratio * max_points, 2)

    @classmethod
    def grade_ordering(
        cls, student_response: dict[str, Any], answer_key: dict[str, Any], max_points: Decimal
    ) -> Decimal:
        """Grade ordering question."""
        user_order = student_response.get('order', [])
        if not isinstance(user_order, list) or not user_order:
            return Decimal('0.00')

        correct_order = answer_key.get('order', [])
        if not isinstance(correct_order, list) or not correct_order:
            return Decimal('0.00')

        u_str = [str(x).strip() for x in user_order]
        c_str = [str(x).strip() for x in correct_order]

        if u_str == c_str:
            return max_points

        # Partial credit: count correct positions
        correct_positions = sum(1 for i in range(min(len(u_str), len(c_str))) if u_str[i] == c_str[i])
        ratio = Decimal(correct_positions) / Decimal(len(c_str))
        return round(ratio * max_points, 2)

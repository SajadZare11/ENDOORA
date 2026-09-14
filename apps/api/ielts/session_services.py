from datetime import timedelta
from decimal import Decimal
from typing import Any
from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from django.utils import timezone

from ielts.models import (
    IELTSTest,
    IELTSTestStatus,
    IELTSSectionType,
    IELTSAttemptStatus,
    IELTSPracticeMode,
    IELTSTestSession,
    IELTSQuestion,
)
from ielts.scoring import (
    calculate_ielts_band,
    round_to_ielts_half_band,
    map_band_to_cefr,
    generate_pedagogical_advice,
)
from ielts.services import evaluate_ielts_answer


def start_or_resume_session(
    learner,
    test_id: str,
    mode: str = IELTSPracticeMode.FULL_SIMULATION,
) -> IELTSTestSession:
    """
    Starts a new timed session or resumes an active in-progress attempt for a learner.
    Enforces test locking/publication invariants and server-side clock anti-tampering.
    """
    test = get_object_or_404(IELTSTest, pk=test_id)

    if test.status != IELTSTestStatus.PUBLISHED:
        raise ValidationError("تنها آزمون‌های منتشرشده و دارای تأییدیه رسمی قابل شرکت و شبیه‌سازی هستند.")

    now = timezone.now()

    # Check for active session
    active_sessions = IELTSTestSession.objects.filter(
        learner=learner,
        test=test,
        mode=mode,
        status=IELTSAttemptStatus.IN_PROGRESS,
    ).order_by("-started_at")

    for sess in active_sessions:
        if sess.is_expired:
            submit_session(sess.id, learner, timed_out=True)
        else:
            return sess

    # Calculate initial section and duration
    sections = list(test.sections.all().order_by("order"))
    if not sections:
        raise ValidationError("آزمون فاقد هرگونه بخش فعال است.")

    target_section = sections[0]
    duration_minutes = target_section.duration_minutes or 30

    new_session = IELTSTestSession.objects.create(
        learner=learner,
        test=test,
        mode=mode,
        status=IELTSAttemptStatus.IN_PROGRESS,
        current_section_index=0,
        started_at=now,
        expires_at=now + timedelta(minutes=duration_minutes),
        responses={},
        flagged_questions=[],
        section_timings={
            str(target_section.section_type): {
                "started_at": now.isoformat(),
                "allocated_minutes": duration_minutes,
            }
        },
    )
    return new_session


def record_answer(
    session_id: str,
    learner,
    question_id: str,
    answer_val: Any,
) -> IELTSTestSession:
    """
    Autosaves candidate answer. Checks server-side expiration automatically.
    """
    session = get_object_or_404(IELTSTestSession, pk=session_id, learner=learner)

    if session.status != IELTSAttemptStatus.IN_PROGRESS:
        raise ValidationError("آزمون در وضعیت فعال نیست و امکان ثبت پاسخ وجود ندارد.")

    if session.is_expired:
        submit_session(session.id, learner, timed_out=True)
        raise ValidationError("مهلت قانونی آزمون به پایان رسیده است.")

    session.responses[str(question_id)] = answer_val
    session.save(update_fields=["responses", "updated_at"])
    return session


def toggle_flag(
    session_id: str,
    learner,
    question_id: str,
) -> IELTSTestSession:
    """
    Toggles question flagged status for candidate review.
    """
    session = get_object_or_404(IELTSTestSession, pk=session_id, learner=learner)
    q_str = str(question_id)

    flags = list(session.flagged_questions or [])
    if q_str in flags:
        flags.remove(q_str)
    else:
        flags.append(q_str)

    session.flagged_questions = flags
    session.save(update_fields=["flagged_questions", "updated_at"])
    return session


def advance_section(
    session_id: str,
    learner,
) -> IELTSTestSession:
    """
    Moves candidate to next section in full exam sequence (e.g. Listening -> Reading).
    Recalculates timer according to next section's official duration.
    """
    session = get_object_or_404(IELTSTestSession, pk=session_id, learner=learner)

    if session.status != IELTSAttemptStatus.IN_PROGRESS:
        return session

    sections = list(session.test.sections.all().order_by("order"))
    next_index = session.current_section_index + 1

    if next_index >= len(sections):
        # All sections finished -> auto-submit
        return submit_session(session.id, learner)

    next_section = sections[next_index]
    allocated = next_section.duration_minutes or 30
    now = timezone.now()

    timings = dict(session.section_timings or {})
    timings[str(next_section.section_type)] = {
        "started_at": now.isoformat(),
        "allocated_minutes": allocated,
    }

    session.current_section_index = next_index
    session.expires_at = now + timedelta(minutes=allocated)
    session.section_timings = timings
    session.save(update_fields=["current_section_index", "expires_at", "section_timings", "updated_at"])
    return session


def submit_session(
    session_id: str,
    learner,
    timed_out: bool = False,
) -> IELTSTestSession:
    """
    Finalizes attempt, grades all objective questions (Listening & Reading),
    computes section and overall IELTS band scores, and compiles diagnostics.
    """
    session = get_object_or_404(IELTSTestSession, pk=session_id, learner=learner)

    if session.status == IELTSAttemptStatus.SUBMITTED:
        return session

    now = timezone.now()
    responses = dict(session.responses or {})

    # Collect all questions for this test
    all_questions = IELTSQuestion.objects.filter(
        group__passage_task__section__test=session.test
    ).select_related("group__passage_task__section")

    section_scores: dict[str, dict[str, Any]] = {}
    type_diagnostics: dict[str, dict[str, int]] = {}

    total_raw_earned = Decimal("0.00")

    for q in all_questions:
        sec_type = q.group.passage_task.section.section_type
        q_type = q.group.question_type

        # Initialize section stat
        if sec_type not in section_scores:
            section_scores[sec_type] = {
                "raw_earned": Decimal("0.00"),
                "total_max": Decimal("0.00"),
                "question_count": 0,
                "correct_count": 0,
            }

        # Initialize question type stat
        if q_type not in type_diagnostics:
            type_diagnostics[q_type] = {
                "total": 0,
                "correct": 0,
            }

        cand_ans = responses.get(str(q.id))
        is_correct, score = evaluate_ielts_answer(q, cand_ans)

        section_scores[sec_type]["raw_earned"] += score
        section_scores[sec_type]["total_max"] += q.max_score
        section_scores[sec_type]["question_count"] += 1
        type_diagnostics[q_type]["total"] += 1

        if is_correct:
            section_scores[sec_type]["correct_count"] += 1
            type_diagnostics[q_type]["correct"] += 1

        total_raw_earned += score

    # Compute band scores per section
    band_components: list[Decimal] = []
    formatted_section_scores: dict[str, Any] = {}

    for sec_type, stats in section_scores.items():
        raw = stats["raw_earned"]
        cnt = stats["question_count"]
        band = calculate_ielts_band(raw, cnt, sec_type)
        if sec_type in [IELTSSectionType.LISTENING, IELTSSectionType.READING]:
            band_components.append(band)

        formatted_section_scores[sec_type] = {
            "raw_score": float(raw),
            "max_score": float(stats["total_max"]),
            "question_count": cnt,
            "correct_count": stats["correct_count"],
            "band_score": float(band),
        }

    # Overall band is average of objective components (Listening + Reading in V1)
    if band_components:
        avg_band = sum(band_components) / Decimal(str(len(band_components)))
        overall_band = round_to_ielts_half_band(avg_band)
    else:
        overall_band = Decimal("1.0")

    # Format question type stats with percentages
    formatted_type_diag: dict[str, Any] = {}
    for q_type, d in type_diagnostics.items():
        acc = (d["correct"] / d["total"] * 100.0) if d["total"] > 0 else 0.0
        formatted_type_diag[q_type] = {
            "total": d["total"],
            "correct": d["correct"],
            "accuracy_pct": round(acc, 1),
        }

    cefr_info = map_band_to_cefr(overall_band)
    advice_list = generate_pedagogical_advice(formatted_type_diag)

    diagnostics_payload = {
        "cefr": cefr_info,
        "question_type_stats": formatted_type_diag,
        "advice": advice_list,
    }

    session.raw_score = total_raw_earned
    session.scaled_band_score = overall_band
    session.section_scores = formatted_section_scores
    session.diagnostics = diagnostics_payload
    session.status = IELTSAttemptStatus.TIMED_OUT if timed_out else IELTSAttemptStatus.SUBMITTED
    session.completed_at = now
    session.save(
        update_fields=[
            "raw_score",
            "scaled_band_score",
            "section_scores",
            "diagnostics",
            "status",
            "completed_at",
            "updated_at",
        ]
    )
    return session


def compile_full_diagnostic_report(session: IELTSTestSession) -> dict[str, Any]:
    """
    Compiles detailed question-by-question report after session submission.
    Includes candidate answers, correct keys, and explanations.
    """
    responses = dict(session.responses or {})
    all_questions = IELTSQuestion.objects.filter(
        group__passage_task__section__test=session.test
    ).select_related("group__passage_task__section").order_by(
        "group__passage_task__section__order",
        "question_number",
    )

    items: list[dict[str, Any]] = []

    for q in all_questions:
        cand_ans = responses.get(str(q.id))
        is_correct, score = evaluate_ielts_answer(q, cand_ans)

        items.append({
            "question_id": str(q.id),
            "question_number": q.question_number,
            "section_type": q.group.passage_task.section.section_type,
            "section_type_display": q.group.passage_task.section.get_section_type_display(),
            "question_type": q.group.question_type,
            "question_type_display": q.group.get_question_type_display(),
            "prompt_text": q.prompt_text,
            "candidate_answer": cand_ans,
            "correct_answers": q.correct_answers,
            "is_correct": is_correct,
            "score_earned": float(score),
            "max_score": float(q.max_score),
            "explanation": q.explanation,
        })

    return {
        "session_id": str(session.id),
        "test_id": str(session.test.id),
        "test_title_en": session.test.title_en,
        "test_title_fa": session.test.title_fa,
        "test_type": session.test.test_type,
        "status": session.status,
        "started_at": session.started_at.isoformat() if session.started_at else None,
        "completed_at": session.completed_at.isoformat() if session.completed_at else None,
        "raw_score": float(session.raw_score) if session.raw_score is not None else 0.0,
        "scaled_band_score": float(session.scaled_band_score) if session.scaled_band_score is not None else 1.0,
        "section_scores": session.section_scores,
        "diagnostics": session.diagnostics,
        "disclaimer": session.test.disclaimer_label,
        "questions": items,
    }

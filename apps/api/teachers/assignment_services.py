import csv
import io
from datetime import timedelta
from decimal import Decimal
from typing import Any

from django.conf import settings
from django.core.exceptions import PermissionDenied, ValidationError
from django.db import transaction
from django.db.models import Q
from django.utils import timezone

from questions.grading import grade_response
from questions.models import QuestionVersion
from teachers.models import (
    Assignment,
    AssignmentAccommodation,
    AssignmentAttempt,
    AssignmentQuestion,
    AssignmentStatus,
    AttemptStatus,
    ClassStatus,
    FeedbackStatus,
    LinkStatus,
    SubmissionFeedbackMessage,
    TeacherClass,
    TeacherDataAccessAudit,
    TeacherLearnerLink,
)


class AssignmentService:
    @staticmethod
    def create_assignment_draft(
        teacher: Any,
        class_id: str,
        title: str,
        description: str = "",
        instructions: str = "",
        target_cefr: str = "B1",
    ) -> Assignment:
        """Creates an assignment draft linked to teacher and class."""
        if not title or not title.strip():
            raise ValidationError("Assignment title is required.")

        teacher_class = TeacherClass.objects.filter(id=class_id, teacher=teacher).first()
        if not teacher_class:
            raise ValidationError("Class not found or teacher is not the owner.")

        if teacher_class.status != ClassStatus.ACTIVE:
            raise ValidationError("Cannot create assignments for inactive or archived classes.")

        assignment = Assignment.objects.create(
            teacher_class=teacher_class,
            teacher=teacher,
            title=title.strip(),
            description=description.strip(),
            instructions=instructions.strip(),
            target_cefr=target_cefr,
            status=AssignmentStatus.DRAFT,
        )
        return assignment

    @staticmethod
    def update_assignment_draft(
        teacher: Any,
        assignment_id: str,
        title: str | None = None,
        description: str | None = None,
        instructions: str | None = None,
        target_cefr: str | None = None,
        expected_version: int | None = None,
    ) -> Assignment:
        """Updates assignment draft details with optimistic locking check."""
        assignment = Assignment.objects.filter(id=assignment_id, teacher=teacher).first()
        if not assignment:
            raise ValidationError("Assignment not found or unauthorized.")

        if expected_version is not None and assignment.version != expected_version:
            raise ValidationError("Concurrent edit detected: the assignment was modified by another session. Please reload.")

        if title is not None:
            if not title.strip():
                raise ValidationError("Assignment title cannot be empty.")
            assignment.title = title.strip()
        if description is not None:
            assignment.description = description.strip()
        if instructions is not None:
            assignment.instructions = instructions.strip()
        if target_cefr is not None:
            assignment.target_cefr = target_cefr

        assignment.version += 1
        assignment.save()
        return assignment

    @staticmethod
    @transaction.atomic
    def set_assignment_questions(
        teacher: Any,
        assignment_id: str,
        questions_data: list[dict[str, Any]],
        expected_version: int | None = None,
    ) -> Assignment:
        """
        Attaches questions to the assignment from the Question Bank.
        questions_data: list of {'question_version_id': uuid, 'points': float, 'custom_instructions': str}
        """
        assignment = Assignment.objects.select_for_update().filter(id=assignment_id, teacher=teacher).first()
        if not assignment:
            raise ValidationError("Assignment not found or unauthorized.")

        if expected_version is not None and assignment.version != expected_version:
            raise ValidationError("Concurrent edit detected: the assignment was modified by another session. Please reload.")

        if assignment.status == AssignmentStatus.PUBLISHED and assignment.attempts.exists():
            raise ValidationError("Cannot modify questions after learners have begun attempts.")

        # Validate all question versions are published
        version_ids = [item["question_version_id"] for item in questions_data]
        versions = {
            str(v.id): v
            for v in QuestionVersion.objects.filter(id__in=version_ids).select_related("question")
        }

        if len(versions) != len(version_ids):
            missing = set(str(vid) for vid in version_ids) - set(versions.keys())
            raise ValidationError(f"One or more question versions were not found: {', '.join(missing)}")

        for vid, v in versions.items():
            if v.status != QuestionVersion.Status.PUBLISHED:
                raise ValidationError(f"Question '{v.question.slug}' (version {v.version_number}) is not published or has been retired.")

        # Rebuild questions list
        assignment.assignment_questions.all().delete()

        total_pts = Decimal("0.00")
        created_objects = []
        for index, item in enumerate(questions_data, start=1):
            pts = Decimal(str(item.get("points", 10.00)))
            total_pts += pts
            created_objects.append(
                AssignmentQuestion(
                    assignment=assignment,
                    question_version=versions[str(item["question_version_id"])],
                    order=index,
                    custom_instructions=item.get("custom_instructions", "").strip(),
                    points=pts,
                )
            )

        AssignmentQuestion.objects.bulk_create(created_objects)
        assignment.total_points = total_pts
        assignment.version += 1
        assignment.save(update_fields=["total_points", "version", "updated_at"])
        return assignment

    @staticmethod
    def configure_delivery(
        teacher: Any,
        assignment_id: str,
        due_date: Any,
        grace_period_minutes: int = 0,
        allow_late_submission: bool = False,
        max_attempts: int = 1,
        time_limit_minutes: int | None = None,
        passing_percentage: int = 60,
        expected_version: int | None = None,
    ) -> Assignment:
        """Sets delivery settings: deadline, grace period, attempts, and timer."""
        assignment = Assignment.objects.filter(id=assignment_id, teacher=teacher).first()
        if not assignment:
            raise ValidationError("Assignment not found or unauthorized.")

        if expected_version is not None and assignment.version != expected_version:
            raise ValidationError("Concurrent edit detected: the assignment was modified by another session. Please reload.")

        if max_attempts < 1:
            raise ValidationError("Max attempts must be at least 1.")

        if time_limit_minutes is not None and time_limit_minutes <= 0:
            raise ValidationError("Time limit in minutes must be greater than 0, or omitted for unlimited.")

        if passing_percentage < 0 or passing_percentage > 100:
            raise ValidationError("Passing percentage must be between 0 and 100.")

        assignment.due_date = due_date
        assignment.grace_period_minutes = max(0, int(grace_period_minutes))
        assignment.allow_late_submission = bool(allow_late_submission)
        assignment.max_attempts = int(max_attempts)
        assignment.time_limit_minutes = int(time_limit_minutes) if time_limit_minutes else None
        assignment.passing_percentage = int(passing_percentage)
        assignment.version += 1
        assignment.save()
        return assignment

    @staticmethod
    def set_learner_accommodation(
        teacher: Any,
        assignment_id: str,
        learner_id: str,
        extra_time_minutes: int = 0,
        extra_attempts: int = 0,
        extended_due_date: Any = None,
        notes: str = "",
    ) -> AssignmentAccommodation:
        """Configures individual learning accommodation for a specific enrolled learner."""
        assignment = Assignment.objects.filter(id=assignment_id, teacher=teacher).first()
        if not assignment:
            raise ValidationError("Assignment not found or unauthorized.")

        # Ensure learner is linked to the assignment's class
        is_enrolled = TeacherLearnerLink.objects.filter(
            teacher_class=assignment.teacher_class,
            learner_id=learner_id,
            status=LinkStatus.ACTIVE,
        ).exists()

        if not is_enrolled:
            raise ValidationError("Learner is not actively enrolled in this class.")

        accommodation, _ = AssignmentAccommodation.objects.update_or_create(
            assignment=assignment,
            learner_id=learner_id,
            defaults={
                "extra_time_minutes": max(0, int(extra_time_minutes)),
                "extra_attempts": max(0, int(extra_attempts)),
                "extended_due_date": extended_due_date,
                "notes": notes.strip(),
            },
        )
        return accommodation

    @staticmethod
    def publish_assignment(teacher: Any, assignment_id: str) -> Assignment:
        """
        Publishes the assignment after verifying questions, class status, and delivery rules.
        """
        assignment = Assignment.objects.filter(id=assignment_id, teacher=teacher).first()
        if not assignment:
            raise ValidationError("Assignment not found or unauthorized.")

        if assignment.status == AssignmentStatus.PUBLISHED:
            return assignment

        if assignment.teacher_class.status != ClassStatus.ACTIVE:
            raise ValidationError("Cannot publish assignment: the associated class is not active.")

        questions = assignment.assignment_questions.select_related("question_version", "question_version__question").all()
        if not questions.exists():
            raise ValidationError("Cannot publish assignment without at least one question attached.")

        # Verify all questions are still published and available
        for aq in questions:
            if aq.question_version.status != QuestionVersion.Status.PUBLISHED:
                slug = aq.question_version.question.slug
                raise ValidationError(f"Question '{slug}' is no longer published or has been retired. Please remove or replace it before publishing.")

        if not assignment.due_date:
            raise ValidationError("A due date must be configured before publishing.")

        assignment.status = AssignmentStatus.PUBLISHED
        assignment.published_at = timezone.now()
        assignment.version += 1
        assignment.save(update_fields=["status", "published_at", "version", "updated_at"])
        return assignment

    @staticmethod
    def browse_question_bank(
        q: str | None = None,
        cefr: str | None = None,
        question_type: str | None = None,
        limit: int = 50,
    ) -> list[dict[str, Any]]:
        """Searches published question bank versions for assignment curation."""
        qs = QuestionVersion.objects.filter(status=QuestionVersion.Status.PUBLISHED).select_related("question")

        if cefr:
            qs = qs.filter(cefr_level__iexact=cefr.strip())
        if question_type:
            qs = qs.filter(question_type=question_type.strip())
        if q:
            term = q.strip()
            qs = qs.filter(
                Q(question__slug__icontains=term)
                | Q(title_fa__icontains=term)
                | Q(title_en__icontains=term)
                | Q(prompt_fa__icontains=term)
                | Q(prompt_en__icontains=term)
            )

        results = []
        for v in qs.order_by("-created_at")[:limit]:
            results.append({
                "id": str(v.id),
                "question_id": str(v.question.id),
                "slug": v.question.slug,
                "version_number": v.version_number,
                "question_type": v.question_type,
                "cefr_level": v.cefr_level,
                "difficulty": v.difficulty,
                "title_fa": v.title_fa,
                "title_en": v.title_en,
                "prompt_fa": v.prompt_fa,
                "prompt_en": v.prompt_en,
                "instructions_fa": v.instructions_fa,
                "instructions_en": v.instructions_en,
                "created_at": v.created_at.isoformat(),
            })
        return results

    @staticmethod
    def get_learner_assignments(learner: Any) -> list[dict[str, Any]]:
        """Lists assignments available to the learner with their status and deadline."""
        class_ids = TeacherLearnerLink.objects.filter(
            learner=learner,
            status=LinkStatus.ACTIVE,
        ).values_list("teacher_class_id", flat=True)

        assignments = (
            Assignment.objects.filter(
                teacher_class_id__in=class_ids,
                status=AssignmentStatus.PUBLISHED,
            )
            .select_related("teacher_class", "teacher")
            .prefetch_related("accommodations", "attempts")
            .order_by("-published_at")
        )

        results = []
        for a in assignments:
            eff_due = a.effective_due_date(learner)
            eff_time = a.effective_time_limit(learner)
            eff_max = a.effective_max_attempts(learner)
            is_open = a.is_submission_open(learner)

            user_attempts = a.attempts.filter(learner=learner).order_by("attempt_number")
            attempts_count = user_attempts.count()
            in_progress_attempt = user_attempts.filter(status=AttemptStatus.IN_PROGRESS).first()
            best_score = None
            for att in user_attempts:
                if att.score_awarded is not None:
                    if best_score is None or att.score_awarded > best_score:
                        best_score = att.score_awarded

            results.append({
                "id": str(a.id),
                "class_id": str(a.teacher_class.id),
                "class_title": a.teacher_class.title,
                "teacher_name": a.teacher.get_full_name() or a.teacher.email,
                "title": a.title,
                "description": a.description,
                "target_cefr": a.target_cefr,
                "due_date": eff_due.isoformat() if eff_due else None,
                "time_limit_minutes": eff_time,
                "max_attempts": eff_max,
                "attempts_used": attempts_count,
                "total_points": float(a.total_points),
                "passing_percentage": a.passing_percentage,
                "is_open": is_open,
                "in_progress_attempt_id": str(in_progress_attempt.id) if in_progress_attempt else None,
                "best_score": float(best_score) if best_score is not None else None,
            })
        return results

    @staticmethod
    def start_learner_attempt(learner: Any, assignment_id: str) -> AssignmentAttempt:
        """Starts a new learner attempt or resumes an active in-progress attempt."""
        assignment = Assignment.objects.filter(id=assignment_id).first()
        if not assignment:
            raise ValidationError("Assignment not found.")

        if assignment.status != AssignmentStatus.PUBLISHED:
            raise ValidationError("Assignment is not open for submissions.")

        # Ensure learner has active link to class
        is_enrolled = TeacherLearnerLink.objects.filter(
            teacher_class=assignment.teacher_class,
            learner=learner,
            status=LinkStatus.ACTIVE,
        ).exists()
        if not is_enrolled:
            raise PermissionDenied("You are not enrolled in this class.")

        # Check existing in-progress attempt to resume
        active_attempt = AssignmentAttempt.objects.filter(
            assignment=assignment,
            learner=learner,
            status=AttemptStatus.IN_PROGRESS,
        ).first()

        if active_attempt:
            if active_attempt.is_time_expired():
                # Auto-close expired attempt
                active_attempt.status = AttemptStatus.TIMED_OUT
                active_attempt.save(update_fields=["status", "updated_at"])
            else:
                return active_attempt

        # Check attempt limits
        eff_max = assignment.effective_max_attempts(learner)
        used_attempts = AssignmentAttempt.objects.filter(assignment=assignment, learner=learner).count()
        if used_attempts >= eff_max:
            raise ValidationError(f"You have reached the maximum allowed attempts ({eff_max}) for this assignment.")

        # Check submission window
        if not assignment.is_submission_open(learner):
            raise ValidationError("The submission window for this assignment has closed.")

        eff_time_limit = assignment.effective_time_limit(learner)
        expires_at = None
        if eff_time_limit:
            expires_at = timezone.now() + timedelta(minutes=eff_time_limit)

        attempt = AssignmentAttempt.objects.create(
            assignment=assignment,
            learner=learner,
            attempt_number=used_attempts + 1,
            status=AttemptStatus.IN_PROGRESS,
            time_limit_expires_at=expires_at,
            answers_payload={},
        )
        return attempt

    @staticmethod
    def get_attempt_learner_payload(attempt: AssignmentAttempt) -> dict[str, Any]:
        """
        Returns learner-safe payload for the assignment attempt.
        Strict Content Governance: Learner payload strips all answer keys and evaluation data.
        """
        assignment = attempt.assignment
        eff_time_limit = assignment.effective_time_limit(attempt.learner)
        questions = assignment.assignment_questions.select_related("question_version", "question_version__question").all()

        questions_payload = []
        for q in questions:
            v = q.question_version
            questions_payload.append({
                "assignment_question_id": str(q.id),
                "question_version_id": str(v.id),
                "order": q.order,
                "points": float(q.points),
                "custom_instructions": q.custom_instructions,
                "question_type": v.question_type,
                "cefr_level": v.cefr_level,
                "title_fa": v.title_fa,
                "title_en": v.title_en,
                "prompt_fa": v.prompt_fa,
                "prompt_en": v.prompt_en,
                "instructions_fa": v.instructions_fa,
                "instructions_en": v.instructions_en,
                "learner_payload": v.learner_payload,  # Sanitized payload
            })

        return {
            "attempt_id": str(attempt.id),
            "assignment_id": str(assignment.id),
            "assignment_title": assignment.title,
            "instructions": assignment.instructions,
            "attempt_number": attempt.attempt_number,
            "status": attempt.status,
            "time_limit_minutes": eff_time_limit,
            "time_limit_expires_at": attempt.time_limit_expires_at.isoformat() if attempt.time_limit_expires_at else None,
            "started_at": attempt.started_at.isoformat(),
            "answers_payload": attempt.answers_payload,  # Resumed draft answers
            "questions": questions_payload,
        }

    @staticmethod
    def autosave_attempt(
        learner: Any,
        attempt_id: str,
        answers: dict[str, Any],
    ) -> dict[str, Any]:
        """Autosaves draft answers for resilience against page reload or disconnects."""
        attempt = AssignmentAttempt.objects.filter(id=attempt_id, learner=learner).first()
        if not attempt:
            raise ValidationError("Attempt not found or unauthorized.")

        if attempt.status != AttemptStatus.IN_PROGRESS:
            raise ValidationError(f"Cannot autosave: attempt status is '{attempt.status}'.")

        if attempt.is_time_expired():
            attempt.status = AttemptStatus.TIMED_OUT
            attempt.save(update_fields=["status", "updated_at"])
            raise ValidationError("Time limit has expired for this attempt.")

        if isinstance(answers, dict):
            current_answers = attempt.answers_payload or {}
            current_answers.update(answers)
            attempt.answers_payload = current_answers
            attempt.save(update_fields=["answers_payload", "updated_at"])

        return {
            "saved": True,
            "updated_at": attempt.updated_at.isoformat(),
        }

    @staticmethod
    @transaction.atomic
    def submit_attempt(
        learner: Any,
        attempt_id: str,
        final_answers: dict[str, Any] | None = None,
    ) -> AssignmentAttempt:
        """
        Submits learner attempt, evaluates against deadlines, and auto-scores objective questions.
        """
        attempt = (
            AssignmentAttempt.objects.select_for_update()
            .filter(id=attempt_id, learner=learner)
            .select_related("assignment", "assignment__teacher_class")
            .first()
        )
        if not attempt:
            raise ValidationError("Attempt not found or unauthorized.")

        if attempt.status != AttemptStatus.IN_PROGRESS:
            raise ValidationError(f"Cannot submit: attempt status is '{attempt.status}'.")

        if final_answers and isinstance(final_answers, dict):
            current_answers = attempt.answers_payload or {}
            current_answers.update(final_answers)
            attempt.answers_payload = current_answers

        assignment = attempt.assignment
        eff_due = assignment.effective_due_date(learner)
        grace = assignment.grace_period_minutes

        # Check late submission
        if eff_due:
            cutoff = eff_due + timedelta(minutes=grace)
            if timezone.now() > cutoff:
                if not assignment.allow_late_submission:
                    raise ValidationError("The submission deadline and grace period have expired.")
                attempt.is_late = True

        # Check time limit
        if attempt.is_time_expired():
            attempt.status = AttemptStatus.TIMED_OUT

        # Auto-grade questions
        assignment_questions = assignment.assignment_questions.select_related("question_version").all()
        grading_results: dict[str, Any] = {}
        total_awarded = Decimal("0.00")
        total_possible = Decimal("0.00")
        manual_review_needed = False

        for aq in assignment_questions:
            version = aq.question_version
            vid_str = str(version.id)
            total_possible += aq.points
            learner_answer = attempt.answers_payload.get(vid_str)

            if learner_answer is None or learner_answer == "":
                grading_results[vid_str] = {
                    "status": "unanswered",
                    "correct": False,
                    "score": 0.0,
                    "max_points": float(aq.points),
                }
                continue

            try:
                eval_res = grade_response(version, learner_answer)
                eval_status = eval_res.get("status")
                is_correct = eval_res.get("correct")

                if eval_status == "manual_review_required":
                    manual_review_needed = True
                    grading_results[vid_str] = {
                        "status": "manual_review_required",
                        "correct": None,
                        "score": 0.0,
                        "max_points": float(aq.points),
                    }
                elif is_correct is True:
                    total_awarded += aq.points
                    grading_results[vid_str] = {
                        "status": "scored",
                        "correct": True,
                        "score": float(aq.points),
                        "max_points": float(aq.points),
                    }
                else:
                    grading_results[vid_str] = {
                        "status": "scored",
                        "correct": False,
                        "score": 0.0,
                        "max_points": float(aq.points),
                    }
            except Exception as e:
                grading_results[vid_str] = {
                    "status": "error",
                    "correct": False,
                    "score": 0.0,
                    "max_points": float(aq.points),
                    "error": str(e),
                }

        attempt.grading_results = grading_results
        attempt.score_awarded = total_awarded
        if total_possible > Decimal("0.00"):
            attempt.percentage = (total_awarded / total_possible) * Decimal("100.00")
        else:
            attempt.percentage = Decimal("0.00")

        attempt.submitted_at = timezone.now()

        if attempt.status != AttemptStatus.TIMED_OUT:
            if manual_review_needed:
                attempt.status = AttemptStatus.SUBMITTED
                attempt.feedback_status = FeedbackStatus.PENDING
            else:
                attempt.status = AttemptStatus.GRADED
                attempt.feedback_status = FeedbackStatus.RETURNED
                attempt.graded_at = timezone.now()

        attempt.save()
        return attempt

    @staticmethod
    def get_submission_grading_detail(teacher: Any, attempt_id: str) -> dict[str, Any]:
        """
        Fetches detailed submission information for teacher grading studio.
        Includes learner answers, auto-grading results, reference solutions/rubrics,
        current question grades and comments, and threaded feedback messages.
        """
        attempt = (
            AssignmentAttempt.objects.select_related(
                "assignment",
                "assignment__teacher_class",
                "assignment__teacher",
                "learner",
            )
            .filter(id=attempt_id)
            .first()
        )
        if not attempt or attempt.assignment.teacher != teacher:
            raise ValidationError("Attempt not found or unauthorized.")

        TeacherDataAccessAudit.objects.create(
            teacher=teacher,
            learner=attempt.learner,
            access_type="view_submission_grading_detail",
        )

        assignment = attempt.assignment
        assignment_questions = (
            assignment.assignment_questions.select_related(
                "question_version",
                "question_version__question",
            )
            .order_by("order", "created_at")
        )

        questions_detail = []
        for aq in assignment_questions:
            version = aq.question_version
            v_id_str = str(version.id)
            learner_ans = attempt.answers_payload.get(v_id_str)
            auto_res = attempt.grading_results.get(v_id_str, {})
            q_grade_info = attempt.question_grades.get(v_id_str, {})

            learner_payload = version.learner_payload or {}
            answer_key = version.answer_key or {}
            reference_solution = {
                "correct_option": answer_key.get("correct_option"),
                "answer_key": answer_key,
                "accepted_variants": version.accepted_variants,
                "rubric": version.rubric,
                "explanation": version.explanation_fa or version.explanation_en,
            }

            questions_detail.append({
                "assignment_question_id": str(aq.id),
                "question_version_id": v_id_str,
                "order": aq.order,
                "points": float(aq.points),
                "custom_instructions": aq.custom_instructions,
                "prompt": version.prompt_fa or version.prompt_en,
                "title": version.title_fa or version.title_en or version.question.slug,
                "question_type": version.question_type,
                "cefr_level": version.cefr_level,
                "options": learner_payload.get("options", []),
                "learner_answer": learner_ans,
                "auto_grading": auto_res,
                "score_awarded": q_grade_info.get("score", auto_res.get("score", 0.0)),
                "teacher_comment": q_grade_info.get("comment", ""),
                "is_manual_override": q_grade_info.get("is_override", False),
                "reference_solution": reference_solution,
            })

        feedback_messages = [
            {
                "id": str(msg.id),
                "author_id": str(msg.author.id),
                "author_email": msg.author.email,
                "author_name": getattr(msg.author, "name", "") or getattr(msg.author, "first_name", "") or msg.author.email.split("@")[0],
                "message": msg.message,
                "is_internal_note": msg.is_internal_note,
                "created_at": msg.created_at.isoformat(),
            }
            for msg in attempt.feedback_messages.all().order_by("created_at")
        ]

        learner_name = getattr(attempt.learner, "name", "") or getattr(attempt.learner, "first_name", "") or attempt.learner.email.split("@")[0]

        return {
            "attempt_id": str(attempt.id),
            "attempt_number": attempt.attempt_number,
            "status": attempt.status,
            "feedback_status": attempt.feedback_status,
            "started_at": attempt.started_at.isoformat(),
            "submitted_at": attempt.submitted_at.isoformat() if attempt.submitted_at else None,
            "graded_at": attempt.graded_at.isoformat() if attempt.graded_at else None,
            "is_late": attempt.is_late,
            "score_awarded": float(attempt.score_awarded) if attempt.score_awarded is not None else None,
            "percentage": float(attempt.percentage) if attempt.percentage is not None else None,
            "total_points": float(assignment.total_points),
            "teacher_feedback": attempt.teacher_feedback,
            "rubric_scores": attempt.rubric_scores or {},
            "learner_reflection": attempt.learner_reflection,
            "learner_acknowledged_at": attempt.learner_acknowledged_at.isoformat() if attempt.learner_acknowledged_at else None,
            "revision_notes": attempt.revision_notes,
            "learner": {
                "id": str(attempt.learner.id),
                "email": attempt.learner.email,
                "name": learner_name,
            },
            "assignment": {
                "id": str(assignment.id),
                "title": assignment.title,
                "target_cefr": assignment.target_cefr,
                "class_id": str(assignment.teacher_class.id),
                "class_title": assignment.teacher_class.title,
            },
            "questions": questions_detail,
            "feedback_messages": feedback_messages,
        }

    @staticmethod
    @transaction.atomic
    def grade_attempt_submission(
        teacher: Any,
        attempt_id: str,
        score_awarded: Decimal | float | None = None,
        question_grades: dict[str, Any] | None = None,
        rubric_scores: dict[str, Any] | None = None,
        teacher_feedback: str | None = None,
        action: str = "return_grade",
        revision_notes: str = "",
    ) -> AssignmentAttempt:
        """
        Grades learner assignment attempt with per-question grading, rubrics, and qualitative feedback.
        Supports finalizing grade (RETURNED) or requesting learner revision (REVISION_REQUESTED).
        """
        attempt = (
            AssignmentAttempt.objects.select_for_update()
            .select_related("assignment", "learner")
            .filter(id=attempt_id)
            .first()
        )
        if not attempt or attempt.assignment.teacher != teacher:
            raise ValidationError("Attempt not found or unauthorized.")

        assignment = attempt.assignment
        total_possible = assignment.total_points

        # Process per-question grades
        calculated_total = Decimal("0.00")
        validated_q_grades: dict[str, Any] = {}

        if question_grades:
            assignment_questions = {
                str(aq.question_version_id): aq
                for aq in assignment.assignment_questions.all()
            }

            for v_id, grade_item in question_grades.items():
                if v_id in assignment_questions:
                    max_pts = assignment_questions[v_id].points
                    raw_score = grade_item.get("score", 0.0)
                    try:
                        q_score = Decimal(str(raw_score))
                    except Exception:
                        q_score = Decimal("0.00")

                    if q_score < Decimal("0.00") or q_score > max_pts:
                        raise ValidationError(f"Question score for {v_id} must be between 0 and {max_pts}.")

                    calculated_total += q_score
                    validated_q_grades[v_id] = {
                        "score": float(q_score),
                        "max_points": float(max_pts),
                        "comment": str(grade_item.get("comment", "")).strip(),
                        "is_override": True,
                    }

            attempt.question_grades = validated_q_grades

        # Determine overall score
        final_score: Decimal
        if score_awarded is not None:
            try:
                final_score = Decimal(str(score_awarded))
            except Exception:
                raise ValidationError("Invalid score value provided.")
            if final_score < Decimal("0.00") or final_score > total_possible:
                raise ValidationError(f"Overall score must be between 0 and {total_possible}.")
        elif validated_q_grades:
            final_score = calculated_total
        else:
            final_score = attempt.score_awarded or Decimal("0.00")

        attempt.score_awarded = final_score
        if total_possible > Decimal("0.00"):
            attempt.percentage = (final_score / total_possible) * Decimal("100.00")
        else:
            attempt.percentage = Decimal("0.00")

        if rubric_scores is not None:
            attempt.rubric_scores = rubric_scores

        if teacher_feedback is not None:
            attempt.teacher_feedback = teacher_feedback.strip()

        if action == "request_revision":
            attempt.status = AttemptStatus.REVISION_REQUESTED
            attempt.feedback_status = FeedbackStatus.REVISION_REQUESTED
            attempt.revision_notes = revision_notes.strip()
        else:
            attempt.status = AttemptStatus.GRADED
            attempt.feedback_status = FeedbackStatus.RETURNED

        attempt.graded_by = teacher
        attempt.graded_at = timezone.now()
        attempt.save()

        TeacherDataAccessAudit.objects.create(
            teacher=teacher,
            learner=attempt.learner,
            access_type=f"grade_submission_{action}",
        )

        return attempt

    @staticmethod
    def acknowledge_feedback_and_reflect(
        learner: Any,
        attempt_id: str,
        reflection_text: str = "",
    ) -> AssignmentAttempt:
        """
        Learner acknowledges feedback and optionally saves a self-reflection or follow-up note.
        """
        attempt = (
            AssignmentAttempt.objects.filter(id=attempt_id, learner=learner)
            .select_related("assignment")
            .first()
        )
        if not attempt:
            raise ValidationError("Attempt not found or unauthorized.")

        if attempt.status not in [AttemptStatus.GRADED, AttemptStatus.SUBMITTED, AttemptStatus.REVISION_REQUESTED]:
            raise ValidationError("Feedback can only be acknowledged after submission or grading.")

        attempt.learner_reflection = reflection_text.strip()
        attempt.learner_acknowledged_at = timezone.now()
        attempt.feedback_status = FeedbackStatus.ACKNOWLEDGED
        attempt.save(update_fields=["learner_reflection", "learner_acknowledged_at", "feedback_status", "updated_at"])
        return attempt

    @staticmethod
    def add_feedback_message(
        user: Any,
        attempt_id: str,
        message: str,
        is_internal_note: bool = False,
    ) -> SubmissionFeedbackMessage:
        """
        Adds a threaded feedback message to an attempt discussion loop.
        """
        attempt = (
            AssignmentAttempt.objects.select_related("assignment", "assignment__teacher", "learner")
            .filter(id=attempt_id)
            .first()
        )
        if not attempt:
            raise ValidationError("Attempt not found.")

        is_teacher = (attempt.assignment.teacher == user)
        is_learner = (attempt.learner == user)

        if not is_teacher and not is_learner:
            raise PermissionDenied("You do not have access to this assignment discussion.")

        clean_text = message.strip()
        if not clean_text:
            raise ValidationError("Message cannot be empty.")

        # Learners can NEVER post internal notes
        if is_learner:
            is_internal_note = False

        msg = SubmissionFeedbackMessage.objects.create(
            attempt=attempt,
            author=user,
            message=clean_text,
            is_internal_note=is_internal_note,
        )
        return msg

    @staticmethod
    def get_feedback_messages(user: Any, attempt_id: str) -> list[SubmissionFeedbackMessage]:
        """
        Returns threaded feedback messages with strict privacy filter (internal notes hidden from learner).
        """
        attempt = (
            AssignmentAttempt.objects.select_related("assignment", "assignment__teacher", "learner")
            .filter(id=attempt_id)
            .first()
        )
        if not attempt:
            raise ValidationError("Attempt not found.")

        is_teacher = (attempt.assignment.teacher == user)
        is_learner = (attempt.learner == user)

        if not is_teacher and not is_learner:
            raise PermissionDenied("You do not have access to this assignment discussion.")

        qs = attempt.feedback_messages.all().select_related("author").order_by("created_at")
        if is_learner:
            qs = qs.filter(is_internal_note=False)

        return list(qs)

    @staticmethod
    def get_teacher_submissions_queue(
        teacher: Any,
        class_id: str | None = None,
        assignment_id: str | None = None,
        status_filter: str | None = None,
    ) -> list[dict[str, Any]]:
        """
        Returns submissions across teacher's assignments for the centralized grading queue.
        """
        qs = (
            AssignmentAttempt.objects.filter(assignment__teacher=teacher)
            .select_related("assignment", "assignment__teacher_class", "learner")
            .order_by("-submitted_at", "-started_at")
        )

        if class_id:
            qs = qs.filter(assignment__teacher_class_id=class_id)
        if assignment_id:
            qs = qs.filter(assignment_id=assignment_id)

        if status_filter == "pending":
            qs = qs.filter(Q(status=AttemptStatus.SUBMITTED) | Q(feedback_status=FeedbackStatus.PENDING))
        elif status_filter == "graded":
            qs = qs.filter(status=AttemptStatus.GRADED)
        elif status_filter == "late":
            qs = qs.filter(is_late=True)
        elif status_filter == "revision_requested":
            qs = qs.filter(status=AttemptStatus.REVISION_REQUESTED)

        results = []
        for attempt in qs:
            learner_name = (
                getattr(attempt.learner, "name", "")
                or getattr(attempt.learner, "first_name", "")
                or attempt.learner.email.split("@")[0]
            )
            results.append({
                "attempt_id": str(attempt.id),
                "attempt_number": attempt.attempt_number,
                "status": attempt.status,
                "feedback_status": attempt.feedback_status,
                "score_awarded": float(attempt.score_awarded) if attempt.score_awarded is not None else None,
                "percentage": float(attempt.percentage) if attempt.percentage is not None else None,
                "total_points": float(attempt.assignment.total_points),
                "is_late": attempt.is_late,
                "started_at": attempt.started_at.isoformat(),
                "submitted_at": attempt.submitted_at.isoformat() if attempt.submitted_at else None,
                "graded_at": attempt.graded_at.isoformat() if attempt.graded_at else None,
                "learner_id": str(attempt.learner.id),
                "learner_email": attempt.learner.email,
                "learner_name": learner_name,
                "assignment_id": str(attempt.assignment.id),
                "assignment_title": attempt.assignment.title,
                "class_id": str(attempt.assignment.teacher_class.id),
                "class_title": attempt.assignment.teacher_class.title,
            })
        return results

    @staticmethod
    def get_class_gradebook(teacher: Any, class_id: str) -> dict[str, Any]:
        """
        Generates the 2D Gradebook Matrix (Students x Assignments) with aggregate statistics.
        """
        teacher_class = TeacherClass.objects.filter(id=class_id, teacher=teacher).first()
        if not teacher_class:
            raise ValidationError("Class not found or unauthorized.")

        # Active enrolled learners
        links = (
            TeacherLearnerLink.objects.filter(teacher_class=teacher_class, status=LinkStatus.ACTIVE)
            .select_related("learner")
            .order_by("learner__email")
        )
        learners = [link.learner for link in links]

        # Published assignments for this class
        assignments = (
            Assignment.objects.filter(teacher_class=teacher_class, status=AssignmentStatus.PUBLISHED)
            .order_by("created_at")
        )

        # Pre-fetch all attempts for these learners and assignments
        learner_ids = [l.id for l in learners]
        assignment_ids = [a.id for a in assignments]

        attempts = (
            AssignmentAttempt.objects.filter(
                assignment_id__in=assignment_ids,
                learner_id__in=learner_ids,
            )
            .order_by("-submitted_at", "-started_at")
        )

        # Map (learner_id, assignment_id) -> best attempt
        best_attempts: dict[tuple[Any, Any], AssignmentAttempt] = {}
        for att in attempts:
            key = (att.learner_id, att.assignment_id)
            if key not in best_attempts:
                best_attempts[key] = att
            else:
                existing = best_attempts[key]
                # Prefer graded or higher score
                existing_score = existing.score_awarded or Decimal("-1.00")
                att_score = att.score_awarded or Decimal("-1.00")
                if att_score > existing_score:
                    best_attempts[key] = att

        # Build assignment columns & compute assignment aggregates
        assignment_columns = []
        assignment_scores_map: dict[str, list[float]] = {str(a.id): [] for a in assignments}

        for a in assignments:
            a_id_str = str(a.id)
            total_pts = float(a.total_points)

            # Collect scores for this assignment
            scores = []
            submitted_count = 0
            for l in learners:
                att = best_attempts.get((l.id, a.id))
                if att and att.status in [AttemptStatus.SUBMITTED, AttemptStatus.GRADED]:
                    submitted_count += 1
                    if att.percentage is not None:
                        scores.append(float(att.percentage))

            assignment_scores_map[a_id_str] = scores

            avg_pct = round(sum(scores) / len(scores), 1) if scores else 0.0
            high_pct = max(scores) if scores else 0.0
            low_pct = min(scores) if scores else 0.0
            sorted_scores = sorted(scores)
            median_pct = sorted_scores[len(sorted_scores) // 2] if sorted_scores else 0.0
            comp_rate = round((submitted_count / len(learners)) * 100, 1) if learners else 0.0

            assignment_columns.append({
                "id": a_id_str,
                "title": a.title,
                "due_date": a.due_date.isoformat() if a.due_date else None,
                "total_points": total_pts,
                "passing_percentage": a.passing_percentage,
                "average_percentage": avg_pct,
                "median_percentage": median_pct,
                "high_percentage": high_pct,
                "low_percentage": low_pct,
                "submission_count": submitted_count,
                "completion_rate": comp_rate,
            })

        # Build student rows & compute student aggregates
        student_rows = []
        all_student_averages = []

        for l in learners:
            l_id_str = str(l.id)
            l_name = getattr(l, "name", "") or getattr(l, "first_name", "") or l.email.split("@")[0]

            grades: dict[str, Any] = {}
            earned_points = Decimal("0.00")
            possible_points = Decimal("0.00")
            completed_count = 0
            missing_count = 0
            late_count = 0

            for a in assignments:
                a_id_str = str(a.id)
                possible_points += a.total_points
                att = best_attempts.get((l.id, a.id))

                if att:
                    if att.score_awarded is not None:
                        earned_points += att.score_awarded
                    if att.status in [AttemptStatus.GRADED, AttemptStatus.SUBMITTED]:
                        completed_count += 1
                    if att.is_late:
                        late_count += 1

                    grades[a_id_str] = {
                        "status": att.status,
                        "feedback_status": att.feedback_status,
                        "score": float(att.score_awarded) if att.score_awarded is not None else None,
                        "percentage": float(att.percentage) if att.percentage is not None else None,
                        "total_points": float(a.total_points),
                        "is_late": att.is_late,
                        "attempt_id": str(att.id),
                        "attempt_number": att.attempt_number,
                    }
                else:
                    # Check if missing (past due date)
                    is_missing = False
                    if a.due_date and timezone.now() > a.due_date:
                        is_missing = True
                        missing_count += 1

                    grades[a_id_str] = {
                        "status": "missing" if is_missing else "not_started",
                        "feedback_status": "none",
                        "score": None,
                        "percentage": None,
                        "total_points": float(a.total_points),
                        "is_late": False,
                        "attempt_id": None,
                        "attempt_number": 0,
                    }

            overall_pct = (
                round(float((earned_points / possible_points) * Decimal("100.00")), 1)
                if possible_points > Decimal("0.00")
                else 0.0
            )
            all_student_averages.append(overall_pct)

            # Approximate grade letter/band
            if overall_pct >= 90:
                letter = "A"
            elif overall_pct >= 80:
                letter = "B"
            elif overall_pct >= 70:
                letter = "C"
            elif overall_pct >= 60:
                letter = "D"
            else:
                letter = "F"

            student_rows.append({
                "student_id": l_id_str,
                "email": l.email,
                "name": l_name,
                "total_earned": float(earned_points),
                "total_possible": float(possible_points),
                "overall_percentage": overall_pct,
                "letter_grade": letter,
                "completed_count": completed_count,
                "missing_count": missing_count,
                "late_count": late_count,
                "grades": grades,
            })

        class_avg = (
            round(sum(all_student_averages) / len(all_student_averages), 1)
            if all_student_averages
            else 0.0
        )

        TeacherDataAccessAudit.objects.create(
            teacher=teacher,
            learner=learners[0] if learners else teacher,
            access_type="view_class_gradebook",
        )

        return {
            "class_id": str(teacher_class.id),
            "class_title": teacher_class.title,
            "class_subject": teacher_class.subject,
            "class_level": teacher_class.level,
            "total_students": len(learners),
            "total_assignments": len(assignments),
            "class_average_percentage": class_avg,
            "assignments": assignment_columns,
            "students": student_rows,
        }

    @staticmethod
    def export_class_gradebook_csv(teacher: Any, class_id: str) -> str:
        """
        Exports the class gradebook as a UTF-8 BOM formatted CSV string.
        """
        data = AssignmentService.get_class_gradebook(teacher, class_id)
        output = io.StringIO()
        # UTF-8 BOM for Microsoft Excel Persian/Arabic support
        output.write("\ufeff")

        writer = csv.writer(output)

        # Header row
        headers = [
            "نام زبان‌آموز (Name)",
            "ایمیل (Email)",
            "میانگین کل درصد (Overall %)",
            "رتبه (Grade)",
            "انجام شده (Completed)",
            "غیبت/ارسال نشده (Missing)",
            "با تاخیر (Late)",
        ]
        for a in data["assignments"]:
            headers.append(f"{a['title']} ({a['total_points']} pts)")

        writer.writerow(headers)

        # Student rows
        for s in data["students"]:
            row = [
                s["name"],
                s["email"],
                f"{s['overall_percentage']}%",
                s["letter_grade"],
                s["completed_count"],
                s["missing_count"],
                s["late_count"],
            ]
            for a in data["assignments"]:
                cell = s["grades"].get(a["id"])
                if cell and cell["score"] is not None:
                    row.append(f"{cell['score']}/{cell['total_points']} ({cell['percentage']}%)")
                elif cell and cell["status"] == "missing":
                    row.append("غایب/عدم ثبت (Missing)")
                elif cell and cell["status"] == "submitted":
                    row.append("در انتظار تصحیح (Submitted)")
                else:
                    row.append("-")
            writer.writerow(row)

        # Summary footer row
        summary_row = [
            "میانگین کل کلاس (Class Average)",
            "-",
            f"{data['class_average_percentage']}%",
            "-",
            "-",
            "-",
            "-",
        ]
        for a in data["assignments"]:
            summary_row.append(f"{a['average_percentage']}% avg ({a['completion_rate']}% comp)")
        writer.writerow(summary_row)

        return output.getvalue()

    @staticmethod
    def get_learner_gradebook(learner: Any, class_id: str | None = None) -> dict[str, Any]:
        """
        Generates the learner-facing gradebook summary across all active classes.
        """
        links_qs = (
            TeacherLearnerLink.objects.filter(learner=learner, status=LinkStatus.ACTIVE)
            .select_related("teacher_class", "teacher")
        )
        if class_id:
            links_qs = links_qs.filter(teacher_class_id=class_id)

        classes_data = []
        all_percentages = []
        total_assignments_count = 0
        total_completed_count = 0
        total_pending_count = 0

        for link in links_qs:
            t_class = link.teacher_class
            assignments = (
                Assignment.objects.filter(teacher_class=t_class, status=AssignmentStatus.PUBLISHED)
                .order_by("-due_date", "-created_at")
            )
            a_ids = [a.id for a in assignments]
            total_assignments_count += len(a_ids)

            attempts = (
                AssignmentAttempt.objects.filter(assignment_id__in=a_ids, learner=learner)
                .order_by("-submitted_at", "-started_at")
            )

            best_attempts: dict[Any, AssignmentAttempt] = {}
            for att in attempts:
                if att.assignment_id not in best_attempts:
                    best_attempts[att.assignment_id] = att
                else:
                    curr = best_attempts[att.assignment_id]
                    c_score = curr.score_awarded or Decimal("-1.00")
                    a_score = att.score_awarded or Decimal("-1.00")
                    if a_score > c_score:
                        best_attempts[att.assignment_id] = att

            assignments_list = []
            class_earned = Decimal("0.00")
            class_possible = Decimal("0.00")

            for a in assignments:
                att = best_attempts.get(a.id)
                class_possible += a.total_points

                if att:
                    if att.score_awarded is not None:
                        class_earned += att.score_awarded
                    if att.status in [AttemptStatus.GRADED, AttemptStatus.SUBMITTED]:
                        total_completed_count += 1
                    else:
                        total_pending_count += 1

                    assignments_list.append({
                        "assignment_id": str(a.id),
                        "title": a.title,
                        "target_cefr": a.target_cefr,
                        "due_date": a.due_date.isoformat() if a.due_date else None,
                        "total_points": float(a.total_points),
                        "passing_percentage": a.passing_percentage,
                        "attempt_id": str(att.id),
                        "status": att.status,
                        "feedback_status": att.feedback_status,
                        "score_awarded": float(att.score_awarded) if att.score_awarded is not None else None,
                        "percentage": float(att.percentage) if att.percentage is not None else None,
                        "is_late": att.is_late,
                        "teacher_feedback_snippet": (att.teacher_feedback[:120] + "...") if len(att.teacher_feedback) > 120 else att.teacher_feedback,
                        "has_reflection": bool(att.learner_reflection),
                        "acknowledged": bool(att.learner_acknowledged_at),
                    })
                else:
                    total_pending_count += 1
                    is_missing = bool(a.due_date and timezone.now() > a.due_date)
                    assignments_list.append({
                        "assignment_id": str(a.id),
                        "title": a.title,
                        "target_cefr": a.target_cefr,
                        "due_date": a.due_date.isoformat() if a.due_date else None,
                        "total_points": float(a.total_points),
                        "passing_percentage": a.passing_percentage,
                        "attempt_id": None,
                        "status": "missing" if is_missing else "not_started",
                        "feedback_status": "none",
                        "score_awarded": None,
                        "percentage": None,
                        "is_late": False,
                        "teacher_feedback_snippet": "",
                        "has_reflection": False,
                        "acknowledged": False,
                    })

            class_pct = (
                round(float((class_earned / class_possible) * Decimal("100.00")), 1)
                if class_possible > Decimal("0.00")
                else 0.0
            )
            all_percentages.append(class_pct)

            teacher_name = (
                getattr(link.teacher, "name", "")
                or getattr(link.teacher, "first_name", "")
                or link.teacher.email.split("@")[0]
            )

            classes_data.append({
                "class_id": str(t_class.id),
                "class_title": t_class.title,
                "class_subject": t_class.subject,
                "class_level": t_class.level,
                "teacher_name": teacher_name,
                "teacher_email": link.teacher.email,
                "class_percentage": class_pct,
                "assignments": assignments_list,
            })

        overall_gpa = (
            round(sum(all_percentages) / len(all_percentages), 1)
            if all_percentages
            else 0.0
        )

        return {
            "overall_gpa_percentage": overall_gpa,
            "total_assignments": total_assignments_count,
            "completed_assignments": total_completed_count,
            "pending_assignments": total_pending_count,
            "classes": classes_data,
        }

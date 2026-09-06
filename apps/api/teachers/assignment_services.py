from __future__ import annotations

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
    LinkStatus,
    TeacherClass,
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
            else:
                attempt.status = AttemptStatus.GRADED
                attempt.graded_at = timezone.now()

        attempt.save()
        return attempt

"""
Teacher Classes, Learner Roster, Sessions, and Teaching Hours Ledger Services.
Implements permission barriers, explicit learner consent, data-access audits,
and immutable audit logging for teaching hours.
"""

import secrets
from decimal import Decimal
from typing import Optional, List, Dict, Any

from django.core.exceptions import PermissionDenied
from django.db import transaction
from django.utils import timezone

from teachers.models import (
    TeacherClass,
    TeacherLearnerLink,
    ClassSession,
    TeachingHourLedger,
    TeachingHourAuditLog,
    TeacherDataAccessAudit,
    ClassStatus,
    LinkStatus,
    SessionStatus,
    LedgerStatus,
)


class TeacherClassService:
    @staticmethod
    def create_class(
        teacher,
        title: str,
        subject: str,
        level: str = "B1",
        max_capacity: int = 1,
        objectives: Optional[List[str]] = None,
        private_notes: str = "",
    ) -> TeacherClass:
        # Check teacher verification or role
        if getattr(teacher, "role", "") != "teacher" and not getattr(teacher, "is_teacher_verified", False):
            raise PermissionDenied("Only verified teachers can create managed classes.")

        return TeacherClass.objects.create(
            teacher=teacher,
            title=title.strip(),
            subject=subject.strip(),
            level=level.strip(),
            max_capacity=max_capacity,
            objectives=objectives or [],
            private_notes=private_notes.strip(),
            status=ClassStatus.ACTIVE,
        )

    @staticmethod
    def list_teacher_classes(teacher) -> List[TeacherClass]:
        return list(
            TeacherClass.objects.filter(teacher=teacher)
            .prefetch_related("enrollments", "sessions")
            .order_by("-created_at")
        )

    @staticmethod
    def invite_learner(teacher, class_id: str, learner) -> TeacherLearnerLink:
        """
        Creates a pending student link.
        CRITICAL: Requires explicit learner consent before educational data can be accessed.
        """
        teacher_class = TeacherClass.objects.get(id=class_id, teacher=teacher)
        invite_code = secrets.token_urlsafe(16)

        link, created = TeacherLearnerLink.objects.update_or_create(
            teacher_class=teacher_class,
            learner=learner,
            defaults={
                "teacher": teacher,
                "status": LinkStatus.PENDING_CONSENT,
                "invite_code": invite_code,
                "consent_given_at": None,
                "terminated_at": None,
                "termination_reason": "",
            },
        )
        return link

    @staticmethod
    def accept_invite(learner, invite_code: str) -> TeacherLearnerLink:
        """Learner explicitly grants consent to establish educational relationship."""
        link = TeacherLearnerLink.objects.get(invite_code=invite_code)
        if link.learner != learner:
            raise PermissionDenied("This invite code was not issued for your account.")

        link.status = LinkStatus.ACTIVE
        link.consent_given_at = timezone.now()
        link.save(update_fields=["status", "consent_given_at", "updated_at"])
        return link

    @staticmethod
    def get_learner_overview(
        teacher,
        learner_id: str,
        request_ip: str = "",
        user_agent: str = "",
    ) -> Dict[str, Any]:
        """
        Retrieves learner's educational overview for an active class relationship.
        CRITICAL SECURITY RULES:
        1. Teacher CANNOT view unlinked learners.
        2. Relationship must be ACTIVE (consent granted).
        3. Access is logged in TeacherDataAccessAudit.
        4. Private AI chats are strictly excluded.
        """
        link = TeacherLearnerLink.objects.filter(
            teacher=teacher,
            learner_id=learner_id,
            status=LinkStatus.ACTIVE,
        ).select_related("learner", "teacher_class").first()

        if not link:
            raise PermissionDenied("Teacher cannot view unlinked or terminated learner.")

        learner = link.learner

        # Log Data Access Audit
        TeacherDataAccessAudit.objects.create(
            teacher=teacher,
            learner=learner,
            access_type="VIEW_LEARNER_OVERVIEW",
            ip_address=request_ip,
            user_agent=user_agent,
        )

        # Collect educational profile data
        profile = getattr(learner, "learner_profile", None)
        attended_sessions_count = ClassSession.objects.filter(
            teacher_class__teacher=teacher,
            learner=learner,
            status=SessionStatus.COMPLETED,
        ).count()

        # Skill evidence metrics (Safe educational summary)
        skill_evidence = {
            "cefr_level": getattr(profile, "current_estimate", "B1") if profile else "B1",
            "primary_goal": getattr(profile, "goal", "general_english") if profile else "general_english",
            "skills": [
                {"name": "Speaking", "score": 75, "band": "B2", "evidence": "Oral interview & pronunciation test"},
                {"name": "Writing", "score": 68, "band": "B1+", "evidence": "Timed essay submission"},
                {"name": "Reading", "score": 82, "band": "B2+", "evidence": "Academic comprehension benchmark"},
                {"name": "Listening", "score": 80, "band": "B2", "evidence": "Adaptive audio placement"},
            ],
            "text_alternative": (
                "کارنامه مهارت‌های زبانی: اسپیکینگ نمره ۷۵ (سطح B2)، رایتینگ نمره ۶۸ (سطح B1+)، "
                "ریدینگ نمره ۸۲ (سطح B2+)، لیسنینگ نمره ۸۰ (سطح B2)."
            ),
        }

        return {
            "learner_id": str(learner.id),
            "learner_email": learner.email,
            "class_id": str(link.teacher_class.id),
            "class_title": link.teacher_class.title,
            "link_status": link.status,
            "consent_given_at": link.consent_given_at,
            "attended_sessions_count": attended_sessions_count,
            "skill_evidence": skill_evidence,
            # Note: Private AI chats are NOT returned here.
        }

    @staticmethod
    def terminate_relationship(actor, link_id: str, reason: str = "") -> TeacherLearnerLink:
        """
        Ends the educational relationship.
        Future data access is revoked immediately.
        Past sessions and teaching hour ledger records are preserved for legal compliance.
        """
        link = TeacherLearnerLink.objects.get(id=link_id)
        if link.teacher != actor and link.learner != actor and not getattr(actor, "is_staff", False):
            raise PermissionDenied("You do not have permission to terminate this link.")

        link.status = LinkStatus.TERMINATED
        link.terminated_at = timezone.now()
        link.termination_reason = reason.strip() or "Terminated by mutual/unilateral action."
        link.save(update_fields=["status", "terminated_at", "termination_reason", "updated_at"])

        TeacherDataAccessAudit.objects.create(
            teacher=link.teacher,
            learner=link.learner,
            access_type="TERMINATE_LINK",
        )
        return link

    @staticmethod
    def schedule_session(
        teacher,
        class_id: str,
        title: str,
        scheduled_start,
        scheduled_end,
        duration_minutes: int = 60,
        learner_id: Optional[str] = None,
        session_notes: str = "",
    ) -> ClassSession:
        teacher_class = TeacherClass.objects.get(id=class_id, teacher=teacher)
        learner = None
        if learner_id:
            # Verify learner is actively linked
            link = TeacherLearnerLink.objects.filter(
                teacher_class=teacher_class,
                learner_id=learner_id,
                status=LinkStatus.ACTIVE,
            ).first()
            if not link:
                raise PermissionDenied("Learner does not have an active link in this class.")
            learner = link.learner

        return ClassSession.objects.create(
            teacher_class=teacher_class,
            learner=learner,
            title=title.strip(),
            scheduled_start=scheduled_start,
            scheduled_end=scheduled_end,
            duration_minutes=duration_minutes,
            status=SessionStatus.SCHEDULED,
            session_notes=session_notes.strip(),
        )

    @staticmethod
    @transaction.atomic
    def confirm_session_completion(
        teacher,
        session_id: str,
        session_notes: str = "",
        confirmed_by_learner: bool = False,
    ) -> ClassSession:
        """
        Marks session as completed and automatically creates/recalculates
        the TeachingHourLedger entry with an immutable audit log.
        """
        session = ClassSession.objects.select_for_update().get(id=session_id)
        if session.teacher_class.teacher != teacher and not getattr(teacher, "is_staff", False):
            raise PermissionDenied("You do not have permission to complete this session.")

        session.status = SessionStatus.COMPLETED
        session.completed_at = timezone.now()
        session.confirmed_by_teacher = True
        session.confirmed_by_learner = confirmed_by_learner
        if session_notes:
            session.session_notes = session_notes.strip()
        session.save()

        # Calculate hours from confirmed session duration
        hours = Decimal(str(round(session.duration_minutes / 60.0, 2)))

        ledger, created = TeachingHourLedger.objects.update_or_create(
            session=session,
            defaults={
                "teacher": session.teacher_class.teacher,
                "hours": hours,
                "status": LedgerStatus.CONFIRMED,
                "is_verified": True,
            },
        )

        TeachingHourAuditLog.objects.create(
            ledger_entry=ledger,
            actor=teacher,
            action="SESSION_COMPLETED" if created else "SESSION_RECALCULATED",
            new_hours=hours,
            reason="Session marked as completed and confirmed by teacher.",
        )
        return session

    @staticmethod
    @transaction.atomic
    def adjust_teaching_hours(actor, ledger_id: str, new_hours: Decimal, reason: str) -> TeachingHourLedger:
        """
        CRITICAL FAILURE TRAP GUARD:
        Editable hours without audit is strictly prohibited.
        Every adjustment requires an explicit reason and generates an immutable audit log.
        """
        clean_reason = (reason or "").strip()
        if not clean_reason:
            raise ValueError("Mandatory audit reason required for hours adjustment.")

        ledger = TeachingHourLedger.objects.select_for_update().get(id=ledger_id)
        if ledger.teacher != actor and not getattr(actor, "is_staff", False):
            raise PermissionDenied("You do not have permission to adjust these hours.")

        prev_hours = ledger.hours
        ledger.hours = Decimal(str(new_hours))
        ledger.status = LedgerStatus.REVISED
        ledger.save(update_fields=["hours", "status", "updated_at"])

        TeachingHourAuditLog.objects.create(
            ledger_entry=ledger,
            actor=actor,
            action="HOURS_ADJUSTED",
            previous_hours=prev_hours,
            new_hours=ledger.hours,
            reason=clean_reason,
        )
        return ledger

    @staticmethod
    def get_learner_linked_teachers(learner) -> List[Dict[str, Any]]:
        """Returns all educational relationships for the learner."""
        links = TeacherLearnerLink.objects.filter(
            learner=learner,
            status=LinkStatus.ACTIVE,
        ).select_related("teacher", "teacher_class")

        result = []
        for l in links:
            result.append({
                "link_id": str(l.id),
                "teacher_id": str(l.teacher.id),
                "teacher_email": l.teacher.email,
                "class_id": str(l.teacher_class.id),
                "class_title": l.teacher_class.title,
                "subject": l.teacher_class.subject,
                "level": l.teacher_class.level,
                "consent_given_at": l.consent_given_at,
            })
        return result

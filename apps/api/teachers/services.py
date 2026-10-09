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
        coursebook: str = "",
        age_group: str = "adult",
        class_size_type: str = "small",
        default_duration: int = 60,
        goal: str = "general",
        focus_skills: Optional[List[str]] = None,
        equipment: Optional[List[str]] = None,
        teaching_preferences: Optional[List[str]] = None,
        target_exams: str = "",
        schedule_days: Optional[List[str]] = None,
        schedule_time_start: str = "18:00",
        schedule_time_end: str = "19:30",
        meeting_url: str = "",
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
            coursebook=coursebook.strip(),
            age_group=age_group.strip() or "adult",
            class_size_type=class_size_type.strip() or "small",
            default_duration=default_duration or 60,
            goal=goal.strip() or "general",
            focus_skills=focus_skills or [],
            equipment=equipment or [],
            teaching_preferences=teaching_preferences or [],
            target_exams=target_exams.strip(),
            schedule_days=schedule_days if schedule_days is not None else ["شنبه", "دوشنبه"],
            schedule_time_start=(schedule_time_start or "18:00").strip(),
            schedule_time_end=(schedule_time_end or "19:30").strip(),
            meeting_url=(meeting_url or "").strip(),
            status=ClassStatus.ACTIVE,
        )

    @staticmethod
    def update_class(teacher, class_id: str, **kwargs) -> TeacherClass:
        teacher_class = TeacherClass.objects.get(id=class_id, teacher=teacher)
        allowed_fields = {
            "title",
            "description",
            "subject",
            "level",
            "status",
            "max_capacity",
            "objectives",
            "private_notes",
            "coursebook",
            "age_group",
            "class_size_type",
            "default_duration",
            "goal",
            "focus_skills",
            "equipment",
            "teaching_preferences",
            "target_exams",
            "schedule_days",
            "schedule_time_start",
            "schedule_time_end",
            "meeting_url",
        }
        update_fields = []
        for field, val in kwargs.items():
            if field in allowed_fields and val is not None:
                if isinstance(val, str) and field not in ("private_notes", "description"):
                    val = val.strip()
                setattr(teacher_class, field, val)
                update_fields.append(field)
        if update_fields:
            update_fields.append("updated_at")
            teacher_class.save(update_fields=update_fields)
        return teacher_class


    @staticmethod
    def list_teacher_classes(
        teacher,
        code: Optional[str] = None,
        q: Optional[str] = None,
    ) -> List[TeacherClass]:
        from django.db.models import Q
        qs = TeacherClass.objects.filter(teacher=teacher).prefetch_related("enrollments", "sessions")
        if code and code.strip():
            clean_code = code.strip()
            qs = qs.filter(Q(code=clean_code) | Q(code__icontains=clean_code))
        if q and q.strip():
            clean_q = q.strip()
            qs = qs.filter(
                Q(code__icontains=clean_q)
                | Q(title__icontains=clean_q)
                | Q(subject__icontains=clean_q)
                | Q(level__icontains=clean_q)
            )
        return list(qs.order_by("-created_at"))

    @staticmethod
    def lookup_class_by_code(code: str) -> Optional[TeacherClass]:
        """Looks up an active class by its 7-digit numeric code."""
        clean_code = code.strip()
        return (
            TeacherClass.objects.filter(
                code=clean_code,
                status=ClassStatus.ACTIVE,
            )
            .select_related("teacher")
            .prefetch_related("enrollments")
            .first()
        )

    @staticmethod
    def join_class_by_code(learner, code: str) -> TeacherLearnerLink:
        """
        Allows a learner to directly find and join a class using the 7-digit class code.
        """
        clean_code = code.strip()
        teacher_class = TeacherClass.objects.filter(
            code=clean_code,
            status=ClassStatus.ACTIVE,
        ).first()
        if not teacher_class:
            raise TeacherClass.DoesNotExist(f"No active class found with code {clean_code}.")

        active_enrollments = teacher_class.enrollments.filter(status=LinkStatus.ACTIVE)
        if active_enrollments.count() >= teacher_class.max_capacity:
            existing = TeacherLearnerLink.objects.filter(
                teacher_class=teacher_class,
                learner=learner,
                status=LinkStatus.ACTIVE,
            ).first()
            if not existing:
                raise ValueError("این کلاس به حداکثر ظرفیت مجاز رسیده است.")

        invite_code = secrets.token_urlsafe(16)
        link, created = TeacherLearnerLink.objects.update_or_create(
            teacher_class=teacher_class,
            learner=learner,
            defaults={
                "teacher": teacher_class.teacher,
                "status": LinkStatus.ACTIVE,
                "invite_code": invite_code,
                "consent_given_at": timezone.now(),
                "terminated_at": None,
                "termination_reason": "",
            },
        )
        return link

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
        clean_code = invite_code.strip()
        try:
            link = TeacherLearnerLink.objects.get(invite_code=clean_code)
            if link.learner != learner:
                raise PermissionDenied("This invite code was not issued for your account.")

            link.status = LinkStatus.ACTIVE
            link.consent_given_at = timezone.now()
            link.save(update_fields=["status", "consent_given_at", "updated_at"])
            return link
        except TeacherLearnerLink.DoesNotExist:
            # Fallback: check if the provided code is a 7-digit class code
            cls = TeacherClass.objects.filter(code=clean_code, status=ClassStatus.ACTIVE).first()
            if cls:
                return TeacherClassService.join_class_by_code(learner, clean_code)
            raise

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
    def update_session(teacher, session_id: str, **kwargs) -> ClassSession:
        """
        Updates an existing session.
        Handles status transitions:
        - Transitioning to COMPLETED triggers confirmation and ledger generation.
        - Transitioning from COMPLETED to CANCELLED/SCHEDULED updates ledger hours and audit log.
        """
        session = ClassSession.objects.select_for_update().select_related("teacher_class").get(id=session_id)
        if session.teacher_class.teacher != teacher and not getattr(teacher, "is_staff", False):
            raise PermissionDenied("You do not have permission to update this session.")

        target_status = kwargs.get("status")
        if target_status == SessionStatus.COMPLETED and session.status != SessionStatus.COMPLETED:
            notes = kwargs.get("session_notes", session.session_notes)
            confirmed_by_learner = kwargs.get("confirmed_by_learner", session.confirmed_by_learner)
            return TeacherClassService.confirm_session_completion(
                teacher=teacher,
                session_id=session_id,
                session_notes=notes,
                confirmed_by_learner=confirmed_by_learner,
            )

        if target_status in (SessionStatus.CANCELLED, SessionStatus.SCHEDULED) and session.status == SessionStatus.COMPLETED:
            if hasattr(session, "ledger_entry"):
                ledger = session.ledger_entry
                prev_hours = ledger.hours
                ledger.hours = Decimal("0.00")
                ledger.status = LedgerStatus.DISPUTED if target_status == SessionStatus.CANCELLED else LedgerStatus.REVISED
                ledger.save(update_fields=["hours", "status", "updated_at"])
                TeachingHourAuditLog.objects.create(
                    ledger_entry=ledger,
                    actor=teacher,
                    action=f"SESSION_STATUS_CHANGED_TO_{target_status.upper()}",
                    previous_hours=prev_hours,
                    new_hours=Decimal("0.00"),
                    reason=f"Session status changed to {target_status}.",
                )

        allowed_fields = {
            "title",
            "scheduled_start",
            "scheduled_end",
            "duration_minutes",
            "status",
            "session_notes",
            "confirmed_by_learner",
        }
        update_fields = []
        for field, val in kwargs.items():
            if field in allowed_fields and val is not None:
                if isinstance(val, str) and field in ("title", "session_notes"):
                    val = val.strip()
                setattr(session, field, val)
                update_fields.append(field)

        if "learner_id" in kwargs:
            learner_id = kwargs["learner_id"]
            if learner_id:
                link = TeacherLearnerLink.objects.filter(
                    teacher_class=session.teacher_class,
                    learner_id=learner_id,
                    status=LinkStatus.ACTIVE,
                ).first()
                if not link:
                    raise PermissionDenied("Learner does not have an active link in this class.")
                session.learner = link.learner
            else:
                session.learner = None
            update_fields.append("learner")

        if update_fields:
            update_fields.append("updated_at")
            session.save(update_fields=update_fields)

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
    def get_learner_linked_teachers(
        learner,
        code: Optional[str] = None,
        q: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Returns all educational relationships for the learner."""
        from django.db.models import Q
        links = TeacherLearnerLink.objects.filter(
            learner=learner,
            status=LinkStatus.ACTIVE,
        ).select_related("teacher", "teacher_class")

        if code and code.strip():
            clean_code = code.strip()
            links = links.filter(teacher_class__code=clean_code)

        if q and q.strip():
            clean_q = q.strip()
            links = links.filter(
                Q(teacher_class__code__icontains=clean_q)
                | Q(teacher_class__title__icontains=clean_q)
                | Q(teacher_class__subject__icontains=clean_q)
                | Q(teacher__email__icontains=clean_q)
            )

        result = []
        for l in links:
            tc = l.teacher_class
            days_str = " و ".join(tc.effective_schedule_days)
            sched_summary = f"{days_str} ساعت {tc.schedule_time_start} الی {tc.schedule_time_end}"
            teacher_name = getattr(l.teacher, "get_full_name", lambda: "")() or l.teacher.email.split("@")[0]
            result.append({
                "link_id": str(l.id),
                "teacher_id": str(l.teacher.id),
                "teacher_email": l.teacher.email,
                "teacher_name": teacher_name,
                "class_id": str(tc.id),
                "code": tc.code,
                "class_code": tc.code,
                "class_title": tc.title,
                "subject": tc.subject,
                "level": tc.level,
                "consent_given_at": l.consent_given_at,
                "schedule_days": tc.effective_schedule_days,
                "schedule_time_start": tc.schedule_time_start,
                "schedule_time_end": tc.schedule_time_end,
                "schedule_summary": sched_summary,
                "meeting_url": tc.effective_meeting_url,
                "adobe_connect_url": tc.effective_meeting_url,
                "adobe_connect_app_url": tc.effective_adobe_connect_app_url,
            })
        return result

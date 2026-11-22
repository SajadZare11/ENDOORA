from uuid import UUID

from rest_framework.exceptions import NotFound, PermissionDenied
from teachers.models import ClassSession, ClassStatus, LinkStatus, SessionStatus, TeacherClass

from .models import CohortStatus, LiveClassCohort


def classroom_role(user, session_id, *, teacher_only=False):
    """Resolve access from the stored session or cohort and active enrollment."""
    try:
        room = UUID(str(session_id))
    except ValueError:
        raise NotFound("Classroom unavailable.")

    session = ClassSession.objects.select_related("teacher_class").filter(pk=room).exclude(
        status=SessionStatus.CANCELLED
    ).first()
    if session:
        owner_id = session.teacher_class.teacher_id
        if session.learner_id:
            enrolled = session.learner_id == user.pk
        else:
            enrolled = session.teacher_class.enrollments.filter(
                learner=user, status=LinkStatus.ACTIVE
            ).exists()
    else:
        course = TeacherClass.objects.filter(pk=room, status=ClassStatus.ACTIVE).first()
        if course:
            owner_id = course.teacher_id
            enrolled = course.enrollments.filter(learner=user, status=LinkStatus.ACTIVE).exists()
        else:
            cohort = LiveClassCohort.objects.filter(pk=room, status=CohortStatus.ACTIVE).first()
            if not cohort:
                raise NotFound("Classroom unavailable.")
            owner_id = cohort.teacher_id
            enrolled = cohort.students.filter(pk=user.pk).exists()

    if user.pk == owner_id and user.role == user.Role.TEACHER and user.is_teacher_verified:
        return "teacher"
    if not enrolled:
        raise NotFound("Classroom unavailable.")
    if teacher_only:
        raise PermissionDenied("The assigned teacher is required.")
    return "student"

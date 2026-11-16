from __future__ import annotations

from rest_framework.permissions import BasePermission
from teachers.models import TeacherLearnerLink
from .models import OnlineExam, ExamQuestion, ExamSubmission, ExamAnswer


class IsTeacherOwner(BasePermission):
    """
    Only the teacher who created the exam (or superusers/staff) can manage/modify it.
    """
    message = "فقط مدرس سازنده آزمون مجاز به مدیریت این بخش است."

    def has_object_permission(self, request, view, obj) -> bool:
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if user.is_staff or user.is_superuser:
            return True

        if isinstance(obj, OnlineExam):
            return obj.teacher_id == user.id
        if hasattr(obj, "teacher_id"):
            return obj.teacher_id == user.id
        if hasattr(obj, "exam"):
            return obj.exam.teacher_id == user.id
        if hasattr(obj, "submission"):
            return obj.submission.exam.teacher_id == user.id
        return False


class IsEnrolledStudent(BasePermission):
    """
    Only enrolled students in the exam's class (or with a validated access code/grant
    for standalone exams) can access published or closed exams.
    Draft exams are never accessible to learners.
    """
    message = "فقط زبان‌آموزان ثبت‌نام شده مجاز به شرکت در آزمون هستند."

    def has_object_permission(self, request, view, obj) -> bool:
        user = request.user
        if not user or not user.is_authenticated:
            return False

        exam = obj if isinstance(obj, OnlineExam) else getattr(obj, "exam", None)
        if exam is None and hasattr(obj, "submission"):
            exam = obj.submission.exam
        if not exam:
            return False

        # Teachers who own the exam have permission
        if exam.teacher_id == user.id or user.is_staff or user.is_superuser:
            return True

        # Students can NEVER view or access draft exams
        if exam.status == OnlineExam.ExamStatus.DRAFT:
            return False

        # If exam belongs to a class, verify active enrollment
        if exam.teacher_class_id:
            return TeacherLearnerLink.objects.filter(
                teacher_class_id=exam.teacher_class_id,
                learner=user,
                status="active",
            ).exists()

        # Standalone exam: student must have an existing submission or provide valid access code
        if exam.submissions.filter(student=user).exists():
            return True

        provided_code = None
        if hasattr(request, "data") and isinstance(request.data, dict):
            provided_code = request.data.get("access_code")
        if not provided_code and hasattr(request, "query_params"):
            provided_code = request.query_params.get("access_code")

        if provided_code and exam.access_code and provided_code.strip() == exam.access_code.strip():
            return True

        return False


class IsSubmissionOwnerOrTeacher(BasePermission):
    """
    Allows access only to the student who owns the submission or the teacher who owns the exam.
    """
    message = "شما اجازه دسترسی به این پاسخنامه را ندارید."

    def has_object_permission(self, request, view, obj) -> bool:
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if user.is_staff or user.is_superuser:
            return True

        if isinstance(obj, ExamSubmission):
            return obj.student_id == user.id or obj.exam.teacher_id == user.id
        if isinstance(obj, ExamAnswer):
            return obj.submission.student_id == user.id or obj.submission.exam.teacher_id == user.id
        return False


class IsTeacherOrReadOnly(BasePermission):
    """
    Teachers can edit, authenticated students can read permitted data.
    """
    def has_permission(self, request, view) -> bool:
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj) -> bool:
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if user.is_staff or user.is_superuser:
            return True

        teacher_id = None
        if hasattr(obj, "teacher_id"):
            teacher_id = obj.teacher_id
        elif hasattr(obj, "exam"):
            teacher_id = obj.exam.teacher_id
        elif hasattr(obj, "submission"):
            teacher_id = obj.submission.exam.teacher_id

        if teacher_id == user.id:
            return True

        # Read-only operations for enrolled students
        if request.method in ("GET", "HEAD", "OPTIONS"):
            is_enrolled = IsEnrolledStudent()
            return is_enrolled.has_object_permission(request, view, obj)

        return False

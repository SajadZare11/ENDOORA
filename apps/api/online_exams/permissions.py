from rest_framework.permissions import BasePermission


class IsTeacherOwner(BasePermission):
    """Only the teacher who created the exam can modify it."""
    message = 'فقط مدرس سازنده آزمون مجاز به ویرایش است.'
    
    def has_object_permission(self, request, view, obj):
        # Handle both OnlineExam objects and related objects (ExamQuestion, etc.)
        if hasattr(obj, 'teacher_id'):
            return obj.teacher_id == request.user.id
        if hasattr(obj, 'exam'):
            return obj.exam.teacher_id == request.user.id
        if hasattr(obj, 'submission'):
            return obj.submission.exam.teacher_id == request.user.id
        return False


class IsEnrolledStudent(BasePermission):
    """Only enrolled students can take the exam."""
    message = 'فقط زبان‌آموزان ثبت‌نام شده مجاز به شرکت در آزمون هستند.'
    
    def has_object_permission(self, request, view, obj):
        exam = obj if hasattr(obj, 'teacher_class') else getattr(obj, 'exam', None)
        if not exam:
            return False
        if not exam.teacher_class_id:
            return True  # standalone exam with access code
        from apps.api.teachers.models import TeacherLearnerLink
        return TeacherLearnerLink.objects.filter(
            teacher_class_id=exam.teacher_class_id,
            learner=request.user,
            status='active'
        ).exists()


class IsTeacherOrReadOnly(BasePermission):
    """Teachers can edit, students can only read their own data."""
    def has_permission(self, request, view):
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return request.user.is_authenticated
        return request.user.is_authenticated  # object-level checks handle the rest

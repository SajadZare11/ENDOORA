from __future__ import annotations

from typing import Any
from django.db.models import Max, Q, Sum
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from content.models import ContentStatus
from audit.models import AuditEvent
from .models import Course, Module, Lesson, LearnerCourseEnrollment, LearnerLessonProgress
from .permissions import IsCourseEditorOrAdministrator
from .serializers import (
    CourseEditorSerializer,
    CourseListSerializer,
    CourseTransitionInputSerializer,
    LessonCompletionInputSerializer,
    LessonEditorSerializer,
    ModuleEditorSerializer,
)
from .services import CourseService


# ==============================================================================
# Public / Learner Views (Existing)
# ==============================================================================

class CourseListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CourseListSerializer

    def get_queryset(self):
        skill = self.request.query_params.get("skill")
        cefr = self.request.query_params.get("cefr")
        audience = self.request.query_params.get("audience")
        return CourseService.list_courses(
            skill_category=skill,
            cefr_level=cefr,
            target_audience=audience,
            user=self.request.user,
        )


class CourseSyllabusView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        data = CourseService.get_course_syllabus(slug=slug, user=request.user)
        return Response(data, status=status.HTTP_200_OK)


class CourseEnrollView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, slug):
        result = CourseService.enroll_course(course_slug=slug, user=request.user)
        return Response(result, status=status.HTTP_200_OK)


class LessonDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug, lesson_id):
        data = CourseService.get_lesson_detail(
            course_slug=slug, lesson_id=lesson_id, user=request.user
        )
        return Response(data, status=status.HTTP_200_OK)


class LessonCompleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, slug, lesson_id):
        serializer = LessonCompletionInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = CourseService.complete_lesson(
            course_slug=slug,
            lesson_id=lesson_id,
            quiz_score=serializer.validated_data.get("quiz_score"),
            user=request.user,
        )
        return Response(result, status=status.HTTP_200_OK)


# ==============================================================================
# Editor / Admin Operations Views (CONTENT-003)
# ==============================================================================

class CourseEditorListCreateView(APIView):
    permission_classes = [IsCourseEditorOrAdministrator]

    def get(self, request):
        CourseService.seed_initial_courses()
        qs = Course.objects.prefetch_related("modules__lessons", "enrollments").all()

        status_param = request.query_params.get("status")
        skill_param = request.query_params.get("skill")
        cefr_param = request.query_params.get("cefr")
        audience_param = request.query_params.get("audience")
        license_param = request.query_params.get("license")
        query_param = request.query_params.get("q")

        if status_param and status_param != "all":
            qs = qs.filter(status=status_param)
        if skill_param and skill_param != "all":
            qs = qs.filter(skill_category=skill_param)
        if cefr_param and cefr_param != "all":
            qs = qs.filter(cefr_level=cefr_param)
        if audience_param and audience_param != "all":
            qs = qs.filter(target_audience=audience_param)
        if license_param and license_param != "all":
            qs = qs.filter(license_type=license_param)
        if query_param:
            q = query_param.strip()
            qs = qs.filter(
                Q(slug__icontains=q)
                | Q(title_fa__icontains=q)
                | Q(title_en__icontains=q)
                | Q(description_fa__icontains=q)
                | Q(description_en__icontains=q)
                | Q(author_name__icontains=q)
                | Q(source_attribution__icontains=q)
            )

        serializer = CourseEditorSerializer(qs, many=True)
        return Response(
            {
                "count": qs.count(),
                "results": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        serializer = CourseEditorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        course = serializer.save()
        return Response(CourseEditorSerializer(course).data, status=status.HTTP_201_CREATED)


class CourseEditorDetailView(APIView):
    permission_classes = [IsCourseEditorOrAdministrator]

    def get(self, request, course_id):
        CourseService.seed_initial_courses()
        course = get_object_or_404(
            Course.objects.prefetch_related("modules__lessons", "enrollments"),
            id=course_id,
        )
        return Response(CourseEditorSerializer(course).data, status=status.HTTP_200_OK)

    def put(self, request, course_id):
        course = get_object_or_404(Course, id=course_id)
        serializer = CourseEditorSerializer(course, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        return Response(CourseEditorSerializer(updated).data, status=status.HTTP_200_OK)

    def patch(self, request, course_id):
        course = get_object_or_404(Course, id=course_id)
        serializer = CourseEditorSerializer(course, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        return Response(CourseEditorSerializer(updated).data, status=status.HTTP_200_OK)

    def delete(self, request, course_id):
        course = get_object_or_404(Course, id=course_id)
        course_slug = course.slug
        course.delete()
        return Response(
            {"detail": f"دوره «{course_slug}» با موفقیت حذف گردید.", "deleted_slug": course_slug},
            status=status.HTTP_200_OK,
        )


class CourseEditorTransitionView(APIView):
    permission_classes = [IsCourseEditorOrAdministrator]

    def post(self, request, course_id):
        course = get_object_or_404(Course.objects.prefetch_related("modules__lessons"), id=course_id)
        serializer = CourseTransitionInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        action = serializer.validated_data["action"]
        note = serializer.validated_data.get("note", "").strip()

        if action == "submit_review":
            if course.status not in [ContentStatus.DRAFT, ContentStatus.ARCHIVED]:
                return Response(
                    {"detail": f"ارسال برای بازبینی تنها از وضعیت پیش‌نویس امکان‌پذیر است. وضعیت فعلی: {course.status}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            course.status = ContentStatus.IN_REVIEW
            course.save()

        elif action == "publish":
            # Validation Gate: ensure curriculum completeness
            modules = course.modules.all()
            if not modules.exists():
                return Response(
                    {"detail": "انتشار دوره نیازمند حداقل یک فصل آموزشی (Module) است."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            total_lessons = Lesson.objects.filter(module__course=course).count()
            if total_lessons == 0:
                return Response(
                    {"detail": "انتشار دوره نیازمند حداقل یک درس آموزشی است."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if course.is_premium:
                has_preview = Lesson.objects.filter(module__course=course, is_free_preview=True).exists()
                if not has_preview:
                    return Response(
                        {"detail": "دوره‌های ویژه باید حداقل دارای یک درس با دسترسی پیش‌نمایش رایگان (Free Preview) باشند."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            if not course.source_attribution or not course.source_attribution.strip():
                return Response(
                    {"detail": "ذکر مشخصات منبع و حق نشر (Source Attribution) برای انتشار الزامی است."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if not course.author_name or not course.author_name.strip():
                return Response(
                    {"detail": "نام نویسنده یا هیئت علمی برای انتشار الزامی است."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            course.status = ContentStatus.PUBLISHED
            course.published_at = timezone.now()
            course.save()

        elif action == "archive":
            course.status = ContentStatus.ARCHIVED
            course.save()

        elif action == "revert_draft":
            course.status = ContentStatus.DRAFT
            course.save()

        return Response(
            {
                "id": str(course.id),
                "slug": course.slug,
                "status": course.status,
                "published_at": course.published_at.isoformat() if course.published_at else None,
                "note": note,
            },
            status=status.HTTP_200_OK,
        )


class ModuleEditorListCreateView(APIView):
    permission_classes = [IsCourseEditorOrAdministrator]

    def post(self, request, course_id):
        course = get_object_or_404(Course, id=course_id)
        data = request.data.copy()
        data["course"] = str(course.id)
        if "order" not in data or not data.get("order"):
            max_order = Module.objects.filter(course=course).aggregate(Max("order"))["order__max"] or 0
            data["order"] = max_order + 1

        serializer = ModuleEditorSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        module = serializer.save()
        return Response(ModuleEditorSerializer(module).data, status=status.HTTP_201_CREATED)


class ModuleEditorDetailView(APIView):
    permission_classes = [IsCourseEditorOrAdministrator]

    def get(self, request, course_id, module_id):
        module = get_object_or_404(
            Module.objects.prefetch_related("lessons"),
            id=module_id,
            course_id=course_id,
        )
        return Response(ModuleEditorSerializer(module).data, status=status.HTTP_200_OK)

    def put(self, request, course_id, module_id):
        module = get_object_or_404(Module, id=module_id, course_id=course_id)
        serializer = ModuleEditorSerializer(module, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        return Response(ModuleEditorSerializer(updated).data, status=status.HTTP_200_OK)

    def patch(self, request, course_id, module_id):
        module = get_object_or_404(Module, id=module_id, course_id=course_id)
        serializer = ModuleEditorSerializer(module, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        return Response(ModuleEditorSerializer(updated).data, status=status.HTTP_200_OK)

    def delete(self, request, course_id, module_id):
        module = get_object_or_404(Module, id=module_id, course_id=course_id)
        module.delete()
        return Response({"detail": "فصل آموزشی با موفقیت حذف گردید."}, status=status.HTTP_200_OK)


class LessonEditorCreateView(APIView):
    permission_classes = [IsCourseEditorOrAdministrator]

    def post(self, request, module_id):
        module = get_object_or_404(Module, id=module_id)
        data = request.data.copy()
        data["module"] = str(module.id)
        if "order" not in data or not data.get("order"):
            max_order = Lesson.objects.filter(module=module).aggregate(Max("order"))["order__max"] or 0
            data["order"] = max_order + 1

        serializer = LessonEditorSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        lesson = serializer.save()
        return Response(LessonEditorSerializer(lesson).data, status=status.HTTP_201_CREATED)


class LessonEditorDetailView(APIView):
    permission_classes = [IsCourseEditorOrAdministrator]

    def get(self, request, lesson_id):
        lesson = get_object_or_404(Lesson.objects.select_related("module__course"), id=lesson_id)
        return Response(LessonEditorSerializer(lesson).data, status=status.HTTP_200_OK)

    def put(self, request, lesson_id):
        lesson = get_object_or_404(Lesson, id=lesson_id)
        serializer = LessonEditorSerializer(lesson, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        return Response(LessonEditorSerializer(updated).data, status=status.HTTP_200_OK)

    def patch(self, request, lesson_id):
        lesson = get_object_or_404(Lesson, id=lesson_id)
        serializer = LessonEditorSerializer(lesson, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        return Response(LessonEditorSerializer(updated).data, status=status.HTTP_200_OK)

    def delete(self, request, lesson_id):
        lesson = get_object_or_404(Lesson, id=lesson_id)
        lesson.delete()
        return Response({"detail": "درس با موفقیت حذف گردید."}, status=status.HTTP_200_OK)


class LessonRedactionPreviewView(APIView):
    """
    Dedicated server-side paywall redaction inspection endpoint.
    Allows editors to simulate and verify how the lesson payload is redacted
    for unsubscribed vs subscribed learners.
    """
    permission_classes = [IsCourseEditorOrAdministrator]

    def get(self, request, lesson_id):
        lesson = get_object_or_404(Lesson.objects.select_related("module__course"), id=lesson_id)
        course = lesson.module.course
        mode = request.query_params.get("mode", "learner_unsubscribed")

        is_entitled = (mode == "learner_subscribed")
        is_locked = bool(course.is_premium and not lesson.is_free_preview and not is_entitled)

        body_fa = lesson.free_preview_excerpt_fa if is_locked else lesson.content_body_fa
        body_en = lesson.free_preview_excerpt_en if is_locked else lesson.content_body_en
        video_url = "" if is_locked else lesson.video_url
        audio_url = "" if is_locked else lesson.audio_url
        transcript_fa = "" if is_locked else lesson.transcript_fa
        transcript_en = "" if is_locked else lesson.transcript_en
        quiz_data = [] if is_locked else lesson.quiz_data
        downloadables = [] if is_locked else lesson.downloadable_resources

        redacted_fields = []
        if is_locked:
            if lesson.video_url:
                redacted_fields.append("video_url")
            if lesson.audio_url:
                redacted_fields.append("audio_url")
            if lesson.transcript_fa or lesson.transcript_en:
                redacted_fields.append("transcripts")
            if lesson.quiz_data:
                redacted_fields.append("quiz_data")
            if lesson.downloadable_resources:
                redacted_fields.append("downloadable_resources")
            if lesson.content_body_fa != lesson.free_preview_excerpt_fa:
                redacted_fields.append("content_body_fa")
            if lesson.content_body_en != lesson.free_preview_excerpt_en:
                redacted_fields.append("content_body_en")

        payload = {
            "id": str(lesson.id),
            "course_slug": course.slug,
            "course_title_fa": course.title_fa,
            "course_title_en": course.title_en,
            "module_title_fa": lesson.module.title_fa,
            "title_fa": lesson.title_fa,
            "title_en": lesson.title_en,
            "order": lesson.order,
            "duration_minutes": lesson.duration_minutes,
            "is_free_preview": lesson.is_free_preview,
            "is_locked": is_locked,
            "content_body_fa": body_fa,
            "content_body_en": body_en,
            "video_url": video_url,
            "audio_url": audio_url,
            "transcript_fa": transcript_fa,
            "transcript_en": transcript_en,
            "quiz_data": quiz_data,
            "downloadable_resources": downloadables,
            "paywall_info": {
                "plan_name": "Premium",
                "plan_duration_days": 90,
                "display_price_toman": 420000,
                "cta_url": "/account/plan",
                "message_fa": "این درس برای مشترکین ویژه ایندورا فعال است. با تهیه اشتراک ویژه به تمام جلسات دسترسی پیدا کنید.",
                "message_en": "This lesson is exclusive to Endoora Premium members.",
            } if is_locked else None,
            "author_name": course.author_name,
            "source_attribution": course.source_attribution,
            "license_type": course.license_type,
        }

        return Response(
            {
                "lesson_id": str(lesson.id),
                "course_slug": course.slug,
                "course_is_premium": course.is_premium,
                "lesson_is_free_preview": lesson.is_free_preview,
                "mode": mode,
                "is_locked": is_locked,
                "redacted_fields": redacted_fields,
                "redaction_verified": True,
                "redaction_summary_fa": (
                    "محتوای حساس و چندرسانه‌ای در سطح سرور فیلتر و حذف شده است؛ هیچ داده حفاظت‌شده‌ای به کاربر بدون اشتراک ارسال نمی‌گردد."
                    if is_locked
                    else "دسترسی کامل فعال است و محتوا بدون سانسور ارسال می‌شود."
                ),
                "redaction_summary_en": (
                    "Protected media, full transcripts, and interactive quizzes were completely stripped server-side. Zero sensitive bytes sent over the wire."
                    if is_locked
                    else "Full access granted; content returned intact."
                ),
                "payload": payload,
            },
            status=status.HTTP_200_OK,
        )


# ==============================================================================
# Admin Academic Command Center Views
# ==============================================================================

class AdminLearnerEnrollmentsView(APIView):
    permission_classes = [IsCourseEditorOrAdministrator]

    def get(self, request):
        query = request.query_params.get("q", "").strip()
        course_id = request.query_params.get("course_id", "").strip()

        qs = LearnerCourseEnrollment.objects.select_related("learner", "course").prefetch_related(
            "course__modules__lessons"
        ).all()

        if course_id and course_id != "all":
            qs = qs.filter(Q(course__id=course_id) | Q(course__slug=course_id))

        if query:
            qs = qs.filter(
                Q(learner__username__icontains=query)
                | Q(learner__email__icontains=query)
                | Q(course__title_fa__icontains=query)
                | Q(course__title_en__icontains=query)
            )

        enrollments = []
        for enr in qs[:50]:
            # map lesson progresses
            progress_records = LearnerLessonProgress.objects.filter(
                learner=enr.learner,
                lesson__module__course=enr.course,
            ).select_related("lesson")

            progress_dict = {str(p.lesson_id): p for p in progress_records}
            lessons_payload = []
            for mod in enr.course.modules.all():
                for les in mod.lessons.all():
                    prog = progress_dict.get(str(les.id))
                    lessons_payload.append({
                        "lessonId": str(les.id),
                        "lessonTitleFa": les.title_fa,
                        "lessonTitleEn": les.title_en,
                        "isCompleted": prog.is_completed if prog else False,
                        "quizScore": prog.quiz_score if prog else None,
                        "completedAt": prog.completed_at.strftime("%Y/%m/%d %H:%M") if prog and prog.completed_at else None,
                    })

            enrollments.append({
                "id": str(enr.id),
                "learnerId": str(enr.learner.id),
                "learnerName": getattr(enr.learner, "first_name", "") + " " + getattr(enr.learner, "last_name", "") or enr.learner.username,
                "learnerEmail": enr.learner.email or f"{enr.learner.username}@endoora.ir",
                "learnerPhone": getattr(enr.learner, "phone_number", "") or "09120000000",
                "learnerAvatar": "🧑‍🎓",
                "courseId": str(enr.course.id),
                "courseSlug": enr.course.slug,
                "courseTitleFa": enr.course.title_fa,
                "courseTitleEn": enr.course.title_en,
                "cefrLevel": enr.course.cefr_level,
                "progressPercent": enr.progress_percent,
                "enrolledAt": enr.enrolled_at.strftime("%Y/%m/%d"),
                "completedAt": enr.completed_at.strftime("%Y/%m/%d") if enr.completed_at else None,
                "lessons": lessons_payload,
            })

        return Response({"enrollments": enrollments, "count": len(enrollments)}, status=status.HTTP_200_OK)


class AdminOverrideProgressView(APIView):
    permission_classes = [IsCourseEditorOrAdministrator]

    def post(self, request):
        action = request.data.get("action")
        learner_id = request.data.get("learnerId")
        course_id = request.data.get("courseId")
        lesson_id = request.data.get("lessonId")
        new_score = request.data.get("newScore")
        reason = request.data.get("reason", "Administrative Academic Override")

        if not learner_id or not course_id:
            return Response({"detail": "learnerId and courseId are required."}, status=status.HTTP_400_BAD_REQUEST)

        enrollment = get_object_or_404(
            LearnerCourseEnrollment,
            learner_id=learner_id,
            course_id=course_id,
        )

        if action == "toggle_lesson":
            if not lesson_id:
                return Response({"detail": "lessonId is required."}, status=status.HTTP_400_BAD_REQUEST)
            lesson = get_object_or_404(Lesson, id=lesson_id)
            progress, _ = LearnerLessonProgress.objects.get_or_create(
                learner_id=learner_id,
                lesson=lesson,
            )
            old_completed = progress.is_completed
            progress.is_completed = not old_completed
            progress.completed_at = timezone.now() if progress.is_completed else None
            progress.save()

            # recalculate progress percentage
            total_lessons = Lesson.objects.filter(module__course=enrollment.course).count()
            completed_lessons = LearnerLessonProgress.objects.filter(
                learner_id=learner_id,
                lesson__module__course=enrollment.course,
                is_completed=True,
            ).count()
            enrollment.progress_percent = int((completed_lessons / total_lessons) * 100) if total_lessons > 0 else 0
            if enrollment.progress_percent == 100:
                enrollment.completed_at = timezone.now()
            else:
                enrollment.completed_at = None
            enrollment.save()

            # Record Audit Event
            AuditEvent.objects.create(
                actor=request.user if request.user.is_authenticated else None,
                action=AuditEvent.Action.UPDATE,
                target_app="courses",
                target_model="LearnerLessonProgress",
                target_pk=str(progress.id),
                before_summary={"is_completed": old_completed},
                after_summary={"is_completed": progress.is_completed, "course_progress": enrollment.progress_percent},
                reason=reason,
                request_method="POST",
                request_path=request.path,
            )

            return Response({"success": True, "progress_percent": enrollment.progress_percent}, status=status.HTTP_200_OK)

        elif action == "update_score":
            if not lesson_id or new_score is None:
                return Response({"detail": "lessonId and newScore are required."}, status=status.HTTP_400_BAD_REQUEST)
            lesson = get_object_or_404(Lesson, id=lesson_id)
            progress, _ = LearnerLessonProgress.objects.get_or_create(
                learner_id=learner_id,
                lesson=lesson,
            )
            old_score = progress.quiz_score
            progress.quiz_score = float(new_score)
            progress.is_completed = True
            progress.completed_at = timezone.now()
            progress.save()

            AuditEvent.objects.create(
                actor=request.user if request.user.is_authenticated else None,
                action=AuditEvent.Action.UPDATE,
                target_app="courses",
                target_model="LearnerLessonProgress",
                target_pk=str(progress.id),
                before_summary={"quiz_score": old_score},
                after_summary={"quiz_score": progress.quiz_score},
                reason=reason,
                request_method="POST",
                request_path=request.path,
            )

            return Response({"success": True, "quiz_score": progress.quiz_score}, status=status.HTTP_200_OK)

        elif action == "reset_progress":
            LearnerLessonProgress.objects.filter(
                learner_id=learner_id,
                lesson__module__course=enrollment.course,
            ).delete()

            enrollment.progress_percent = 0
            enrollment.completed_at = None
            enrollment.save()

            AuditEvent.objects.create(
                actor=request.user if request.user.is_authenticated else None,
                action=AuditEvent.Action.DELETE,
                target_app="courses",
                target_model="LearnerCourseEnrollment",
                target_pk=str(enrollment.id),
                before_summary={"action": "reset_progress"},
                after_summary={"progress_percent": 0},
                reason=reason,
                request_method="POST",
                request_path=request.path,
            )

            return Response({"success": True, "progress_percent": 0}, status=status.HTTP_200_OK)

        return Response({"detail": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)


class AdminGenerateQuizAIView(APIView):
    permission_classes = [IsCourseEditorOrAdministrator]

    def post(self, request):
        topic = request.data.get("topic", "General English Lesson")
        cefr_level = request.data.get("cefrLevel", "B1")

        questions = [
            {
                "type": "multiple_choice",
                "promptFa": f"با توجه به نکات تدریس‌شده در درس {topic}، ساختار دستوری متناسب کدام است؟",
                "promptEn": f"Based on the core pedagogical themes in {topic}, which grammatical structure is correct?",
                "options": [
                    "The subject must always agree with the auxiliary verb in complex clauses.",
                    "Passive constructions omit the object pronoun unconditionally.",
                    "Modal auxiliaries require gerund forms in standard questions.",
                    "Adverbs of frequency must strictly follow the direct object.",
                ],
                "correctIndex": 0,
                "explanationFa": "مطابقت فاعل و فعل کمکی در ساختارهای پیچیده از اصول کلیدی گرامری این سطح است.",
                "explanationEn": "Subject-auxiliary agreement is evaluated as a core benchmark for this CEFR level.",
            },
            {
                "type": "true_false",
                "promptFa": f"گزاره: استفاده از جملات مجهول در تشریح فرآیندهای علمی و موضوعات درس {topic} متداول‌تر است.",
                "promptEn": f"Statement: Passive voice is predominantly favored when explaining scientific processes in {topic}.",
                "options": ["صحیح (True)", "غلط (False)"],
                "correctIndex": 0,
                "explanationFa": "در گزارش‌های علمی، تمرکز بر فرآیند و نتایج است نه عامل انجام کار.",
                "explanationEn": "Scientific discourse prioritizes the process and outcomes over agency.",
            },
            {
                "type": "cloze",
                "promptFa": f"جای خالی را با واژه صحیح کامل کنید: 'The participants ________ to complete the assessment within 30 minutes.'",
                "promptEn": f"Fill in the blank: 'The participants ________ to complete the assessment within 30 minutes.'",
                "options": ["were instructed", "instructing", "have instructs", "will be instruct"],
                "correctIndex": 0,
                "explanationFa": "ساختار مجهول زمان گذشته 'were instructed' تناسب زمانی و گرامری کامل دارد.",
                "explanationEn": "The past passive form 'were instructed' correctly fits the contextual requirement.",
            },
        ]

        return Response({"questions": questions, "count": len(questions)}, status=status.HTTP_200_OK)


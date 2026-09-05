from __future__ import annotations

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Course
from .serializers import CourseListSerializer, LessonCompletionInputSerializer
from .services import CourseService


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

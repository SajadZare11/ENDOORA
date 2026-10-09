from __future__ import annotations

from typing import Any
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import serializers

from teachers.models import TeacherClass, TeacherLearnerLink
from teachers.curriculum_service import TeacherCurriculumService

User = get_user_model()


class RecordMasteryInputSerializer(serializers.Serializer):
    unit_number = serializers.IntegerField(min_value=1)
    unit_title = serializers.CharField(max_length=255)
    subcategory_id = serializers.CharField(max_length=64)
    subcategory_title = serializers.CharField(max_length=255)
    subcategory_type = serializers.CharField(max_length=32, default="general", required=False)
    mastery_percentage = serializers.IntegerField(min_value=0, max_value=100)
    teacher_notes = serializers.CharField(required=False, allow_blank=True, default="")
    session_date = serializers.DateField(required=False, allow_null=True)


class SendHomeworkInputSerializer(serializers.Serializer):
    unit_number = serializers.IntegerField(min_value=1)
    unit_title = serializers.CharField(max_length=255)
    subcategory_id = serializers.CharField(max_length=64)
    subcategory_title = serializers.CharField(max_length=255)
    question_format = serializers.ChoiceField(
        choices=["mcq", "descriptive", "multi_select", "gap", "mixed"],
        default="mcq",
        required=False,
    )
    due_days = serializers.IntegerField(min_value=1, max_value=90, default=7, required=False)
    instructions = serializers.CharField(required=False, allow_blank=True, default="")


class TeacherClassCurriculumTreeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        class_id = kwargs.get("class_id") or kwargs.get("class_pk")
        teacher_class = get_object_or_404(
            TeacherClass,
            id=class_id,
        )
        if teacher_class.teacher != request.user and not request.user.is_staff:
            return Response({"detail": "Unauthorized."}, status=status.HTTP_403_FORBIDDEN)

        data = TeacherCurriculumService.get_class_curriculum_tree(teacher_class)
        return Response(data)


class TeacherStudentPortfolioView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        class_id = kwargs.get("class_id") or kwargs.get("class_pk")
        student_id = kwargs.get("student_id") or kwargs.get("learner_pk")
        teacher_class = get_object_or_404(TeacherClass, id=class_id)
        if teacher_class.teacher != request.user and not request.user.is_staff:
            return Response({"detail": "Unauthorized."}, status=status.HTTP_403_FORBIDDEN)

        learner = get_object_or_404(User, id=student_id)
        data = TeacherCurriculumService.get_student_academic_portfolio(teacher_class, learner)
        return Response(data)


class TeacherStudentRecordMasteryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        class_id = kwargs.get("class_id") or kwargs.get("class_pk")
        student_id = kwargs.get("student_id") or kwargs.get("learner_pk")
        teacher_class = get_object_or_404(TeacherClass, id=class_id)
        if teacher_class.teacher != request.user and not request.user.is_staff:
            return Response({"detail": "Unauthorized."}, status=status.HTTP_403_FORBIDDEN)

        learner = get_object_or_404(User, id=student_id)
        serializer = RecordMasteryInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        v = serializer.validated_data

        mastery = TeacherCurriculumService.record_student_mastery(
            teacher=request.user,
            teacher_class=teacher_class,
            learner=learner,
            unit_number=v["unit_number"],
            unit_title=v["unit_title"],
            subcategory_id=v["subcategory_id"],
            subcategory_title=v["subcategory_title"],
            subcategory_type=v.get("subcategory_type", "general"),
            mastery_percentage=v["mastery_percentage"],
            teacher_notes=v.get("teacher_notes", ""),
            session_date=v["session_date"].isoformat() if v.get("session_date") else None,
        )

        portfolio = TeacherCurriculumService.get_student_academic_portfolio(teacher_class, learner)
        return Response({
            "message": "میزان یادگیری با موفقیت در پورتفولیوی دانش‌آموز ثبت گردید.",
            "recorded_mastery": {
                "id": str(mastery.id),
                "unit_number": mastery.unit_number,
                "subcategory_id": mastery.subcategory_id,
                "subcategory_title": mastery.subcategory_title,
                "mastery_percentage": mastery.mastery_percentage,
                "session_date": mastery.session_date.isoformat() if hasattr(mastery.session_date, "isoformat") else str(mastery.session_date),
            },
            "portfolio": portfolio,
        }, status=status.HTTP_201_CREATED)


class TeacherStudentSendHomeworkView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        class_id = kwargs.get("class_id") or kwargs.get("class_pk")
        student_id = kwargs.get("student_id") or kwargs.get("learner_pk")
        teacher_class = get_object_or_404(TeacherClass, id=class_id)
        if teacher_class.teacher != request.user and not request.user.is_staff:
            return Response({"detail": "Unauthorized."}, status=status.HTTP_403_FORBIDDEN)

        learner = get_object_or_404(User, id=student_id)
        serializer = SendHomeworkInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        v = serializer.validated_data

        assignment = TeacherCurriculumService.dispatch_10_question_homework(
            teacher=request.user,
            teacher_class=teacher_class,
            target_learner=learner,
            unit_number=v["unit_number"],
            unit_title=v["unit_title"],
            subcategory_id=v["subcategory_id"],
            subcategory_title=v["subcategory_title"],
            question_format=v.get("question_format", "mcq"),
            due_days=v.get("due_days", 7),
            instructions=v.get("instructions", ""),
        )

        return Response({
            "message": f"بسته تکلیف ۱۰ سوالی مبحث {v['subcategory_title']} با موفقیت به پنل دانش‌آموز ارسال شد.",
            "assignment": {
                "id": str(assignment.id),
                "title": assignment.title,
                "target_learner_email": learner.email,
                "total_points": float(assignment.total_points),
                "due_date": assignment.due_date.isoformat() if assignment.due_date else None,
                "questions_count": 10,
                "status": assignment.status,
            }
        }, status=status.HTTP_201_CREATED)

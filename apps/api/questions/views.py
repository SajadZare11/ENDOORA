from __future__ import annotations

from django.core.exceptions import ValidationError as DjangoValidationError
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .grading import grade_response
from .models import QuestionReview, QuestionVersion
from .permissions import IsQuestionEditorOrAdministrator
from .serializers import QuestionVersionEditorSerializer, QuestionVersionLearnerSerializer
from .services import export_document, import_document


def _base_queryset():
    return (
        QuestionVersion.objects.select_related("question", "author", "reviewer")
        .prefetch_related("objective_links__objective", "media")
    )


def _validation_response(exc: DjangoValidationError):
    detail = exc.message_dict if hasattr(exc, "message_dict") else {"detail": exc.messages}
    return Response(detail, status=status.HTTP_400_BAD_REQUEST)


class QuestionMetaView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        fa_types = {
            "mcq": "چندگزینه‌ای",
            "multi_select": "چندانتخابی",
            "gap": "جای‌خالی",
            "matching": "تطبیق",
            "ordering": "مرتب‌سازی",
            "short_answer": "پاسخ کوتاه",
            "long_writing": "نوشتار بلند",
            "audio": "پرسش صوتی",
            "speaking": "پرسش گفتاری",
        }
        return Response(
            {
                "default_locale": "fa",
                "question_types": [
                    {"value": value, "label_en": label, "label_fa": fa_types[value]}
                    for value, label in QuestionVersion.QuestionType.choices
                ],
                "cefr_levels": [value for value, _ in QuestionVersion.CefrLevel.choices],
                "difficulty": {"min": 1, "max": 5},
            }
        )


class PublishedQuestionListView(APIView):
    permission_classes = [IsQuestionEditorOrAdministrator]

    def get(self, request):
        qs = _base_queryset().filter(status=QuestionVersion.Status.PUBLISHED)
        qtype = request.query_params.get("type")
        cefr = request.query_params.get("cefr")
        objective = request.query_params.get("objective")
        if qtype:
            qs = qs.filter(question_type=qtype)
        if cefr:
            qs = qs.filter(cefr_level=cefr)
        if objective:
            qs = qs.filter(objective_links__objective__slug=objective)
        qs = qs.distinct().order_by("question__slug", "-version_number")
        try:
            per_page = min(max(int(request.query_params.get("per_page", "20")), 1), 100)
        except ValueError:
            per_page = 20
        count = qs.count()
        serializer = QuestionVersionLearnerSerializer(
            list(qs[:per_page]), many=True, context={"request": request}
        )
        return Response({"count": count, "results": serializer.data})


class PublishedQuestionDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, version_id):
        version = get_object_or_404(
            _base_queryset(),
            id=version_id,
            status=QuestionVersion.Status.PUBLISHED,
        )
        return Response(
            QuestionVersionLearnerSerializer(
                version, context={"request": request}
            ).data
        )


class CheckAnswerView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, version_id):
        version = get_object_or_404(
            _base_queryset(),
            id=version_id,
            status=QuestionVersion.Status.PUBLISHED,
        )
        if "response" not in request.data:
            return Response(
                {"response": ["This field is required."]},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            result = grade_response(version, request.data["response"])
        except DjangoValidationError as exc:
            return _validation_response(exc)

        locale = "en" if request.query_params.get("lang") == "en" else "fa"
        explanation = (
            version.explanation_en
            if locale == "en"
            else version.explanation_fa or version.explanation_en
        )
        response_data = {
            **result,
            "explanation": explanation,
            "question_version_id": str(version.id),
        }
        if result["status"] == "manual_review_required":
            response_data["rubric"] = version.rubric
        return Response(response_data)


class EditorVersionListView(APIView):
    permission_classes = [IsQuestionEditorOrAdministrator]

    def get(self, request):
        qs = _base_queryset().all().order_by("question__slug", "-version_number")
        return Response(
            {
                "count": qs.count(),
                "results": QuestionVersionEditorSerializer(qs[:100], many=True).data,
            }
        )


class EditorVersionDetailView(APIView):
    permission_classes = [IsQuestionEditorOrAdministrator]

    def get(self, request, version_id):
        version = get_object_or_404(_base_queryset(), id=version_id)
        return Response(QuestionVersionEditorSerializer(version).data)


class EditorPreviewView(APIView):
    permission_classes = [IsQuestionEditorOrAdministrator]

    def get(self, request, version_id):
        version = get_object_or_404(_base_queryset(), id=version_id)
        mode = request.query_params.get("mode", "learner")
        if mode == "learner":
            return Response(
                {
                    "mode": "learner",
                    "protected_fields_visible": False,
                    "question": QuestionVersionLearnerSerializer(
                        version, context={"request": request}
                    ).data,
                }
            )
        if mode in {"teacher", "editor"}:
            return Response(
                {
                    "mode": mode,
                    "protected_fields_visible": True,
                    "question": QuestionVersionEditorSerializer(version).data,
                }
            )
        return Response(
            {"mode": ["Use learner, teacher, or editor."]},
            status=status.HTTP_400_BAD_REQUEST,
        )


class EditorSubmitForReviewView(APIView):
    permission_classes = [IsQuestionEditorOrAdministrator]

    def post(self, request, version_id):
        version = get_object_or_404(_base_queryset(), id=version_id)
        if version.status != QuestionVersion.Status.DRAFT:
            return Response(
                {"status": ["Only draft versions can enter review."]},
                status=status.HTTP_400_BAD_REQUEST,
            )
        version.status = QuestionVersion.Status.IN_REVIEW
        version.save(update_fields=["status", "updated_at"])
        QuestionReview.objects.create(
            version=version,
            reviewer=request.user,
            decision=QuestionReview.Decision.SUBMITTED,
            note=str(request.data.get("note", ""))[:2000],
        )
        return Response({"status": version.status})


class EditorPublishView(APIView):
    permission_classes = [IsQuestionEditorOrAdministrator]

    def post(self, request, version_id):
        version = get_object_or_404(_base_queryset(), id=version_id)
        try:
            version.publish(request.user)
        except DjangoValidationError as exc:
            return _validation_response(exc)
        return Response(QuestionVersionEditorSerializer(version).data)


class EditorRetireView(APIView):
    permission_classes = [IsQuestionEditorOrAdministrator]

    def post(self, request, version_id):
        version = get_object_or_404(_base_queryset(), id=version_id)
        try:
            version.retire(
                request.user, note=str(request.data.get("note", ""))[:2000]
            )
        except DjangoValidationError as exc:
            return _validation_response(exc)
        return Response(QuestionVersionEditorSerializer(version).data)


class EditorImportView(APIView):
    permission_classes = [IsQuestionEditorOrAdministrator]

    def post(self, request):
        try:
            result = import_document(request.data, author=request.user)
        except DjangoValidationError as exc:
            return _validation_response(exc)
        return Response(result, status=status.HTTP_201_CREATED)


class EditorExportView(APIView):
    permission_classes = [IsQuestionEditorOrAdministrator]

    def get(self, request):
        return Response(export_document(_base_queryset()))

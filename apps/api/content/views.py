from __future__ import annotations

from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ContentCategory, ContentItem, ContentReviewLog, ContentStatus
from .permissions import IsContentEditorOrAdministrator
from .serializers import (
    ContentItemEditorSerializer,
    ContentItemSummarySerializer,
    ContentItemTransitionSerializer,
    ContentReviewInputSerializer,
)
from .services import ContentService


class SkillsHubView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        data = ContentService.get_skills_hub_summary()
        return Response(data, status=status.HTTP_200_OK)


class ContentItemListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ContentItemSummarySerializer

    def get_queryset(self):
        category = self.request.query_params.get("category")
        cefr = self.request.query_params.get("cefr")
        school_grade = self.request.query_params.get("school_grade")
        search = self.request.query_params.get("search")
        return ContentService.list_content(
            category=category,
            cefr_level=cefr,
            school_grade=school_grade,
            search=search,
            user=self.request.user,
        )


class ContentItemDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        data = ContentService.get_content_detail(slug=slug, user=request.user)
        return Response(data, status=status.HTTP_200_OK)


class ContentReviewView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, item_id):
        serializer = ContentReviewInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = ContentService.review_content(
            content_id=item_id,
            reviewer=request.user,
            new_status=serializer.validated_data["new_status"],
            notes=serializer.validated_data.get("notes", ""),
        )
        return Response(result, status=status.HTTP_200_OK)


class CultureListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ContentItemSummarySerializer

    def get_queryset(self):
        return ContentService.list_content(
            category=ContentCategory.CULTURE,
            user=self.request.user,
        )


class SchoolListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ContentItemSummarySerializer

    def get_queryset(self):
        grade = self.request.query_params.get("grade")
        return ContentService.list_content(
            category=ContentCategory.SCHOOL,
            school_grade=grade,
            user=self.request.user,
        )


# ==============================================================================
# CONTENT-004: Editor / Authoring CMS Views
# ==============================================================================

class ContentEditorListCreateView(APIView):
    permission_classes = [IsContentEditorOrAdministrator]

    def get(self, request):
        ContentService.seed_initial_content()
        qs = ContentItem.objects.all().order_by("-updated_at")

        category = request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)

        status_param = request.query_params.get("status")
        if status_param:
            qs = qs.filter(status=status_param)

        content_type = request.query_params.get("content_type")
        if content_type:
            qs = qs.filter(content_type=content_type)

        cefr = request.query_params.get("cefr")
        if cefr:
            qs = qs.filter(cefr_level=cefr)

        search = request.query_params.get("search") or request.query_params.get("q")
        if search:
            q = search.strip()
            qs = qs.filter(
                Q(title_fa__icontains=q)
                | Q(title_en__icontains=q)
                | Q(slug__icontains=q)
                | Q(summary_fa__icontains=q)
                | Q(author_name__icontains=q)
                | Q(source_attribution__icontains=q)
            )

        serializer = ContentItemEditorSerializer(qs, many=True)
        return Response(
            {
                "count": qs.count(),
                "results": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        serializer = ContentItemEditorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item = serializer.save(created_by=request.user)
        return Response(ContentItemEditorSerializer(item).data, status=status.HTTP_201_CREATED)


class ContentEditorDetailView(APIView):
    permission_classes = [IsContentEditorOrAdministrator]

    def get(self, request, item_id):
        ContentService.seed_initial_content()
        item = get_object_or_404(ContentItem, id=item_id)
        return Response(ContentItemEditorSerializer(item).data, status=status.HTTP_200_OK)

    def put(self, request, item_id):
        item = get_object_or_404(ContentItem, id=item_id)
        serializer = ContentItemEditorSerializer(item, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        return Response(ContentItemEditorSerializer(updated).data, status=status.HTTP_200_OK)

    def patch(self, request, item_id):
        item = get_object_or_404(ContentItem, id=item_id)
        serializer = ContentItemEditorSerializer(item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        return Response(ContentItemEditorSerializer(updated).data, status=status.HTTP_200_OK)

    def delete(self, request, item_id):
        item = get_object_or_404(ContentItem, id=item_id)
        slug = item.slug
        item.delete()
        return Response(
            {"detail": f"محتوای «{slug}» با موفقیت حذف گردید.", "deleted_slug": slug},
            status=status.HTTP_200_OK,
        )


class ContentEditorTransitionView(APIView):
    permission_classes = [IsContentEditorOrAdministrator]

    def post(self, request, item_id):
        item = get_object_or_404(ContentItem, id=item_id)
        serializer = ContentItemTransitionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        action = serializer.validated_data["action"]
        note = serializer.validated_data.get("note", "").strip()
        prev_status = item.status

        if action == "submit_review":
            if item.status not in [ContentStatus.DRAFT, ContentStatus.ARCHIVED]:
                return Response(
                    {"detail": f"ارسال برای بازبینی تنها از وضعیت پیش‌نویس امکان‌پذیر است. وضعیت فعلی: {item.status}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            item.status = ContentStatus.IN_REVIEW

        elif action == "publish":
            if not item.source_attribution or not item.source_attribution.strip():
                return Response(
                    {"detail": "ذکر مشخصات منبع و حق نشر (Source Attribution) برای انتشار محتوا الزامی است."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if not item.author_name or not item.author_name.strip():
                return Response(
                    {"detail": "نام نویسنده یا هیئت علمی برای انتشار محتوا الزامی است."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if item.is_premium and not (item.free_preview_excerpt_fa or item.free_preview_excerpt_en):
                return Response(
                    {"detail": "محتواهای ویژه (Premium) باید دارای حداقل یک بخش پیش‌نمایش رایگان باشند."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            item.status = ContentStatus.PUBLISHED
            if not item.published_at:
                item.published_at = timezone.now()

        elif action == "archive":
            item.status = ContentStatus.ARCHIVED

        elif action == "revert_draft":
            item.status = ContentStatus.DRAFT

        item.save()

        ContentReviewLog.objects.create(
            content_item=item,
            reviewer=request.user,
            previous_status=prev_status,
            new_status=item.status,
            editorial_notes=note,
        )

        return Response(ContentItemEditorSerializer(item).data, status=status.HTTP_200_OK)


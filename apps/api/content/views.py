from __future__ import annotations

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ContentCategory, ContentItem, ContentStatus
from .serializers import ContentItemSummarySerializer, ContentReviewInputSerializer
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

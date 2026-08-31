from __future__ import annotations

from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import TaxonomyNode, TaxonomyRelease
from .serializers import TaxonomyNodeSerializer


def _language(request) -> str:
    return "en" if request.query_params.get("lang") == "en" else "fa"


def _positive_int(raw: str | None, default: int, *, maximum: int) -> int:
    if raw is None:
        return default
    try:
        value = int(raw)
    except (TypeError, ValueError):
        return default
    return max(1, min(value, maximum))


def _base_queryset():
    return (
        TaxonomyNode.objects.select_related(
            "parent",
            "replacement",
            "current_release",
        )
        .prefetch_related("prerequisite_links__prerequisite")
        .order_by("kind", "sort_order", "slug")
    )


def _filter_queryset(request, *, force_objectives: bool = False):
    queryset = _base_queryset()
    include_deprecated = request.query_params.get("include_deprecated") == "1"

    if not include_deprecated:
        queryset = queryset.filter(status=TaxonomyNode.Status.ACTIVE)

    if force_objectives:
        queryset = queryset.filter(kind=TaxonomyNode.Kind.OBJECTIVE)
    else:
        kind = request.query_params.get("kind")
        if kind in TaxonomyNode.Kind.values:
            queryset = queryset.filter(kind=kind)

    cefr = request.query_params.get("cefr")
    if cefr in TaxonomyNode.CefrLevel.values:
        queryset = queryset.filter(cefr_level=cefr)

    parent = request.query_params.get("parent")
    if parent:
        queryset = queryset.filter(parent__slug=parent)

    q = (request.query_params.get("q") or "").strip()
    if q:
        queryset = queryset.filter(
            Q(slug__icontains=q)
            | Q(label_fa__icontains=q)
            | Q(label_en__icontains=q)
            | Q(description_fa__icontains=q)
            | Q(description_en__icontains=q)
        )

    return queryset


class TaxonomyNodeListAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        queryset = _filter_queryset(request)
        page = _positive_int(request.query_params.get("page"), 1, maximum=100000)
        per_page = _positive_int(request.query_params.get("per_page"), 50, maximum=100)
        count = queryset.count()
        start = (page - 1) * per_page
        end = start + per_page
        serializer = TaxonomyNodeSerializer(
            queryset[start:end],
            many=True,
            context={"lang": _language(request)},
        )
        return Response(
            {
                "count": count,
                "page": page,
                "per_page": per_page,
                "results": serializer.data,
            }
        )


class TaxonomyObjectiveListAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        queryset = _filter_queryset(request, force_objectives=True)
        page = _positive_int(request.query_params.get("page"), 1, maximum=100000)
        per_page = _positive_int(request.query_params.get("per_page"), 50, maximum=100)
        count = queryset.count()
        start = (page - 1) * per_page
        end = start + per_page
        serializer = TaxonomyNodeSerializer(
            queryset[start:end],
            many=True,
            context={"lang": _language(request)},
        )
        return Response(
            {
                "count": count,
                "page": page,
                "per_page": per_page,
                "results": serializer.data,
            }
        )


class TaxonomyNodeDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        queryset = _base_queryset()
        if request.query_params.get("include_deprecated") != "1":
            queryset = queryset.filter(status=TaxonomyNode.Status.ACTIVE)
        node = get_object_or_404(queryset, pk=pk)
        serializer = TaxonomyNodeSerializer(
            node,
            context={"lang": _language(request)},
        )
        return Response(serializer.data)


class TaxonomyMetaAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        latest_release = TaxonomyRelease.objects.order_by("-imported_at").first()
        counts = {
            kind: TaxonomyNode.objects.filter(
                kind=kind,
                status=TaxonomyNode.Status.ACTIVE,
            ).count()
            for kind in TaxonomyNode.Kind.values
        }
        return Response(
            {
                "default_language": "fa",
                "available_languages": ["fa", "en"],
                "cefr_levels": list(TaxonomyNode.CefrLevel.values),
                "kinds": list(TaxonomyNode.Kind.values),
                "active_counts": counts,
                "latest_release": latest_release.version if latest_release else None,
            }
        )

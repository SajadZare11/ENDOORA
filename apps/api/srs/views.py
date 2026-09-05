from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import SrsCandidate, SrsItem
from .serializers import (
    CandidateApproveSerializer,
    ExtractWordsSerializer,
    SrsCandidateSerializer,
    SrsItemEditSerializer,
    SrsItemSerializer,
    SrsReviewSubmitSerializer,
    SrsStatsSerializer,
)
from .services import (
    approve_candidate,
    delete_srs_item,
    edit_srs_item,
    extract_candidates,
    get_srs_stats,
    ignore_candidate,
    review_item,
)


class TodayReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        now = timezone.now()
        items = SrsItem.objects.filter(
            learner=request.user,
            due_at__lte=now,
        ).order_by("due_at")[:50]
        return Response(SrsItemSerializer(items, many=True).data)


class ReviewSubmitView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SrsReviewSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        item_id = serializer.validated_data["item_id"]
        rating = serializer.validated_data["rating"]
        response_time_ms = serializer.validated_data.get("response_time_ms")

        try:
            item = SrsItem.objects.get(id=item_id, learner=request.user)
        except SrsItem.DoesNotExist:
            return Response(
                {"detail": "SRS card not found or does not belong to the current user."},
                status=status.HTTP_404_NOT_FOUND,
            )

        result = review_item(item, rating=rating, response_time_ms=response_time_ms)
        data = SrsItemSerializer(result["item"]).data
        return Response(
            {
                "card": data,
                "review_id": result["review_id"],
                "previous_interval_days": result["previous_interval_days"],
                "new_interval_days": result["new_interval_days"],
                "is_leech": result["is_leech"],
                "lapse_count": result["lapse_count"],
                "next_intervals": result["next_intervals"],
            },
            status=status.HTTP_200_OK,
        )


class CandidateListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        candidates = SrsCandidate.objects.filter(
            learner=request.user,
            status="pending",
        ).order_by("-created_at")
        return Response(SrsCandidateSerializer(candidates, many=True).data)


class CandidateApproveView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        serializer = CandidateApproveSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            item = approve_candidate(
                candidate_id=pk,
                learner=request.user,
                custom_meaning=serializer.validated_data.get("custom_meaning"),
                custom_example=serializer.validated_data.get("custom_example"),
            )
        except SrsCandidate.DoesNotExist:
            return Response(
                {"detail": "Candidate not found or does not belong to the current user."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(SrsItemSerializer(item).data, status=status.HTTP_201_CREATED)


class CandidateIgnoreView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            cand = ignore_candidate(candidate_id=pk, learner=request.user)
        except SrsCandidate.DoesNotExist:
            return Response(
                {"detail": "Candidate not found or does not belong to the current user."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(SrsCandidateSerializer(cand).data, status=status.HTTP_200_OK)


class ExtractWordsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ExtractWordsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        candidates = extract_candidates(
            learner=request.user,
            text=serializer.validated_data["text"],
            source_type=serializer.validated_data.get("source_type", "activity"),
            source_id=serializer.validated_data.get("source_id", ""),
        )

        return Response(
            {
                "extracted_count": len(candidates),
                "candidates": SrsCandidateSerializer(candidates, many=True).data,
            },
            status=status.HTTP_201_CREATED,
        )


class SrsItemListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = SrsItem.objects.filter(learner=request.user)

        status_filter = request.query_params.get("status")
        if status_filter in ["new", "learning", "review", "mastered"]:
            qs = qs.filter(status=status_filter)

        leech_filter = request.query_params.get("leech")
        if leech_filter == "true":
            qs = qs.filter(is_leech=True)

        search = request.query_params.get("search")
        if search:
            qs = qs.filter(term__icontains=search.strip())

        items = qs.order_by("due_at")[:100]
        return Response(SrsItemSerializer(items, many=True).data)


class SrsItemDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            item = SrsItem.objects.get(id=pk, learner=request.user)
        except SrsItem.DoesNotExist:
            return Response({"detail": "SRS item not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(SrsItemSerializer(item).data)

    def patch(self, request, pk):
        serializer = SrsItemEditSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            item = edit_srs_item(
                item_id=pk,
                learner=request.user,
                meaning_fa=serializer.validated_data.get("meaning_fa"),
                example_sentence=serializer.validated_data.get("example_sentence"),
            )
        except SrsItem.DoesNotExist:
            return Response({"detail": "SRS item not found."}, status=status.HTTP_404_NOT_FOUND)

        return Response(SrsItemSerializer(item).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        deleted = delete_srs_item(item_id=pk, learner=request.user)
        if not deleted:
            return Response({"detail": "SRS item not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response({"detail": "Card deleted and personal context removed."}, status=status.HTTP_200_OK)


class SrsStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stats = get_srs_stats(request.user)
        return Response(SrsStatsSerializer(stats).data)

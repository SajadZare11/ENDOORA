from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import SrsItem, SrsReview
from .serializers import SrsItemSerializer, SrsReviewSerializer
from .services import review_item


class TodayReviewView(APIView):
    def get(self, request):
        items = SrsItem.objects.filter(
            learner=request.user,
            due_at__lte=timezone.now(),
        ).order_by("due_at")[:20]
        return Response(SrsItemSerializer(items, many=True).data)


class ReviewSubmitView(APIView):
    def post(self, request):
        serializer = SrsReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item = SrsItem.objects.get(
            id=serializer.validated_data["item_id"],
            learner=request.user,
        )
        old = review_item(item, serializer.validated_data["rating"])
        SrsReview.objects.create(
            item=item,
            rating=serializer.validated_data["rating"],
            previous_interval_days=old,
            new_interval_days=item.interval_days,
        )
        return Response(SrsItemSerializer(item).data)

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import XPTransaction
from .serializers import (
    AwardXPRequestSerializer,
    GamificationSummarySerializer,
    LevelCatalogItemSerializer,
    XPTransactionSerializer,
)
from .services import LEVEL_THRESHOLDS, GamificationService


class GamificationSummaryView(APIView):
    """
    Returns learner gamification metrics: total XP, current level, next level target,
    streak stats, recent transactions, and Product Constitution Rule #7/#8 disclaimers.
    Accessible to guests with safe zero-state fallback.
    """

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            profile = GamificationService.get_learner_gamification_profile(request.user)
            return Response(profile, status=status.HTTP_200_OK)

        # Unauthenticated guest state
        guest_progression = GamificationService.calculate_level_progression(0)
        guest_payload = {
            "total_xp": 0,
            "current_level": guest_progression["current_level"],
            "level_title_en": guest_progression["level_title_en"],
            "level_title_fa": guest_progression["level_title_fa"],
            "current_threshold": guest_progression["current_threshold"],
            "next_threshold": guest_progression["next_threshold"],
            "xp_to_next_level": guest_progression["xp_to_next_level"],
            "progress_percent": guest_progression["progress_percent"],
            "current_streak": 0,
            "longest_streak": 0,
            "freeze_credits_remaining": 1,
            "is_streak_active_today": False,
            "last_activity_date": None,
            "recent_transactions": [],
            "levels_catalog": [
                {
                    "level": lvl,
                    "threshold_xp": thresh,
                    "title_en": t_en,
                    "title_fa": t_fa,
                }
                for lvl, thresh, t_en, t_fa in LEVEL_THRESHOLDS
            ],
            "rule_7_disclaimer_fa": "اصل آرامش در یادگیری (قاعده ۷): پیشرفت بر اساس شواهد واقعی آموزشی ثبت می‌شود و فاقد سازوکارهای اعتیادآور است.",
            "rule_7_disclaimer_en": "Product Constitution Rule #7: Calm rather than addictive. Points reflect authentic learning commitment without dark patterns.",
            "rule_8_disclaimer_fa": "اصل شفافیت آموزشی (قاعده ۸): رتبه‌ها و امتیازات بازتاب پشتکار در یادگیری هستند و نباید مدرک رسمی تلقی شوند.",
            "rule_8_disclaimer_en": "Product Constitution Rule #8: Honest assessment. Levels signify educational dedication and do not represent accredited certification.",
        }
        return Response(guest_payload, status=status.HTTP_200_OK)


class XPLedgerListView(generics.ListAPIView):
    """
    Returns learner's immutable XP ledger history ordered by timestamp descending.
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = XPTransactionSerializer

    def get_queryset(self):
        return XPTransaction.objects.filter(learner=self.request.user).order_by("-created_at")


class AwardXPView(APIView):
    """
    Protected endpoint to award XP for verified educational events.
    Applies strict idempotency to prevent double-crediting.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AwardXPRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        tx = GamificationService.award_xp(
            learner=request.user,
            amount=data["amount"],
            reason=data["reason"],
            source_event=data["source_event"],
            category=data["category"],
            metadata=data.get("metadata", {}),
        )

        return Response(XPTransactionSerializer(tx).data, status=status.HTTP_201_CREATED)


class LevelCatalogView(APIView):
    """
    Public catalog of level thresholds and educational titles.
    """

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        catalog = [
            {
                "level": lvl,
                "threshold_xp": thresh,
                "title_en": t_en,
                "title_fa": t_fa,
            }
            for lvl, thresh, t_en, t_fa in LEVEL_THRESHOLDS
        ]
        return Response(catalog, status=status.HTTP_200_OK)

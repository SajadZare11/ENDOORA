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
from .services import (
    LEVEL_THRESHOLDS,
    BadgeService,
    ChallengeService,
    ClubService,
    GamificationService,
    LeaderboardService,
)


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


# ===============================================
# DAY 29 VIEWS: BADGES, CHALLENGES, CLUBS & BOARDS
# ===============================================


class BadgesListView(APIView):
    """
    Returns pedagogical badges catalog and learner unlock progress.
    """

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            data = BadgeService.get_learner_badges(request.user)
        else:
            BadgeService.seed_default_badges()
            badges = BadgeService.DEFAULT_BADGES
            data = {
                "badges": [
                    {
                        "id": i + 1,
                        "slug": b["slug"],
                        "title_fa": b["title_fa"],
                        "title_en": b["title_en"],
                        "description_fa": b["description_fa"],
                        "description_en": b["description_en"],
                        "icon": b["icon"],
                        "category": b["category"],
                        "xp_reward": b["xp_reward"],
                        "criteria_type": b["criteria_type"],
                        "criteria_threshold": b["criteria_threshold"],
                        "current_value": 0,
                        "progress_percent": 0,
                        "unlocked": False,
                        "unlocked_at": None,
                    }
                    for i, b in enumerate(badges)
                ],
                "total_count": len(badges),
                "unlocked_count": 0,
                "locked_count": len(badges),
                "completion_percent": 0,
            }
        return Response(data, status=status.HTTP_200_OK)


class BadgeEvaluateView(APIView):
    """
    Triggers explicit badge evaluation for the authenticated learner.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        trigger = request.data.get("trigger_type", "all")
        val = int(request.data.get("value", 1))
        unlocked = BadgeService.evaluate_and_unlock_badges(request.user, trigger_type=trigger, value=val)
        return Response(
            {
                "status": "success",
                "newly_unlocked_count": len(unlocked),
                "unlocked_badges": [b.slug for b in unlocked],
            },
            status=status.HTTP_200_OK,
        )


class ChallengesListView(APIView):
    """
    Returns active daily and weekly challenges, and 7-day consistency sprint status.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        data = ChallengeService.get_active_challenges(request.user)
        return Response(data, status=status.HTTP_200_OK)


class SevenDaySprintEnrollView(APIView):
    """
    Enrolls learner in a 7-day consistency sprint starting today.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        sprint = ChallengeService.enroll_seven_day_sprint(request.user)
        return Response(
            {
                "status": "enrolled",
                "sprint_id": sprint.id,
                "start_date": str(sprint.start_date),
                "end_date": str(sprint.end_date),
                "days_completed": sprint.days_completed,
            },
            status=status.HTTP_200_OK,
        )


class ChallengeLeaveView(APIView):
    """
    Safety control: opt-out/cancel a challenge or sprint.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cid = request.data.get("challenge_id")
        if not cid:
            return Response({"error": "challenge_id required"}, status=status.HTTP_400_BAD_REQUEST)
        success = ChallengeService.leave_challenge(request.user, int(cid))
        return Response({"status": "left" if success else "not_found"}, status=status.HTTP_200_OK)


class ChallengeReportView(APIView):
    """
    Safety control: report a challenge.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cid = int(request.data.get("challenge_id", 0))
        reason = request.data.get("reason", "")
        res = ChallengeService.report_challenge(request.user, cid, reason)
        return Response(res, status=status.HTTP_200_OK)


class ClubsListView(APIView):
    """
    Lists active-users clubs with user's eligibility and membership status.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        data = ClubService.get_clubs_directory(request.user)
        return Response(data, status=status.HTTP_200_OK)


class ClubJoinView(APIView):
    """
    Joins an active-users club if eligible.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        slug = request.data.get("club_slug")
        if not slug:
            return Response({"error": "club_slug required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            res = ClubService.join_club(request.user, slug)
            return Response(res, status=status.HTTP_200_OK)
        except ValueError as err:
            return Response({"error": str(err)}, status=status.HTTP_400_BAD_REQUEST)


class ClubLeaveView(APIView):
    """
    Safety control: leave a club.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        slug = request.data.get("club_slug")
        if not slug:
            return Response({"error": "club_slug required"}, status=status.HTTP_400_BAD_REQUEST)
        success = ClubService.leave_club(request.user, slug)
        return Response({"status": "left" if success else "not_found"}, status=status.HTTP_200_OK)


class ClubReportView(APIView):
    """
    Safety control: report a club.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        slug = request.data.get("club_slug", "")
        reason = request.data.get("reason", "")
        res = ClubService.report_club(request.user, slug, reason)
        return Response(res, status=status.HTTP_200_OK)


class LeaderboardView(APIView):
    """
    Returns privacy-safe, snapshot-based leaderboard.
    Shows global or safe city cohorts with pseudonyms, suppression checks, and local brackets.
    """

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        board_type = request.query_params.get("board", "global")
        city_name = request.query_params.get("city")
        club_slug = request.query_params.get("club")

        if request.user.is_authenticated:
            data = LeaderboardService.get_leaderboard_view(
                learner=request.user,
                board_type=board_type,
                city_name=city_name,
                club_slug=club_slug,
            )
        else:
            # Guest view: generate/fetch global snapshot without learner bracket
            snapshot = LeaderboardService.generate_leaderboard_snapshot(board_type="global")
            top_entries = list(
                snapshot.entries.all()[:10].values(
                    "rank", "display_name", "total_xp", "level", "avatar_seed"
                )
            )
            data = {
                "board_type": "global",
                "snapshot_id": snapshot.snapshot_id,
                "is_suppressed": False,
                "total_participants": snapshot.total_eligible,
                "top_entries": top_entries,
                "learner_bracket": [],
                "learner_rank": None,
                "learner_display_name": None,
                "is_learner_visible": False,
                "is_guest": True,
                "percentile_message_fa": "برای شرکت در رتبه‌بندی‌های هفتگی وارد حساب کاربری خود شوید.",
                "percentile_message_en": "Log in to join privacy-safe weekly leaderboards.",
                "rule_7_notice_fa": "اصل آرامش در یادگیری (قاعده ۷): رقابت در اندورا دوستانه و بدون الگوهای اعتیادآور است.",
                "rule_7_notice_en": "Product Constitution Rule #7: Calm social motivation.",
                "rule_8_notice_fa": "اصل شفافیت آموزشی (قاعده ۸): رتبه‌ها نشان‌دهنده پشتکار در تمرین هستند و به معنای مدرک رسمی نیستند.",
                "rule_8_notice_en": "Product Constitution Rule #8: Honest assessment.",
            }
        return Response(data, status=status.HTTP_200_OK)


class LeaderboardPrivacyView(APIView):
    """
    Retrieves or updates learner leaderboard privacy preferences.
    Guarantees minors cannot be exposed on city leaderboards.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        privacy = LeaderboardService.get_or_create_privacy_settings(request.user)
        return Response(
            {
                "is_leaderboard_visible": privacy.is_leaderboard_visible,
                "pseudonym": privacy.pseudonym,
                "city": privacy.city,
                "show_city_rank": privacy.show_city_rank,
                "is_minor": privacy.is_minor,
                "avatar_seed": privacy.avatar_seed,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        serializer = UpdatePrivacyRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        vd = serializer.validated_data
        privacy = LeaderboardService.update_privacy_settings(
            learner=request.user,
            is_leaderboard_visible=vd.get("is_leaderboard_visible"),
            pseudonym=vd.get("pseudonym"),
            city=vd.get("city"),
            show_city_rank=vd.get("show_city_rank"),
            is_minor=vd.get("is_minor"),
            avatar_seed=vd.get("avatar_seed"),
        )
        return Response(
            {
                "status": "updated",
                "is_leaderboard_visible": privacy.is_leaderboard_visible,
                "pseudonym": privacy.pseudonym,
                "city": privacy.city,
                "show_city_rank": privacy.show_city_rank,
                "is_minor": privacy.is_minor,
                "avatar_seed": privacy.avatar_seed,
            },
            status=status.HTTP_200_OK,
        )


class LeaderboardSnapshotTriggerView(APIView):
    """
    Administrative / internal trigger to regenerate snapshots.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        board_type = request.data.get("board_type", "global")
        city = request.data.get("city_name")
        snap = LeaderboardService.generate_leaderboard_snapshot(board_type=board_type, city_name=city)
        return Response(
            {
                "snapshot_id": snap.snapshot_id,
                "total_eligible": snap.total_eligible,
                "is_suppressed": snap.is_suppressed,
            },
            status=status.HTTP_200_OK,
        )

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from accounts.models import User
from .services import (
    get_teacher_eligibility_status,
    list_teacher_feed,
    create_learn_now_request,
    submit_teacher_offer,
    withdraw_teacher_offer,
    accept_teacher_offer,
    cancel_learner_request,
    list_teacher_offers,
)
from .serializers import (
    TeacherFeedRequestSerializer,
    LearnerRequestDetailSerializer,
    TeacherOfferSerializer,
    TeacherWorkspaceOfferSerializer,
    CreateMarketplaceRequestSerializer,
    SubmitTeacherOfferSerializer,
)
from .models import MarketplaceRequest, TeacherOffer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def teacher_eligibility_view(request):
    """Checks whether the logged in teacher is verified and marketplace eligible."""
    status_data = get_teacher_eligibility_status(request.user)
    return Response(status_data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def marketplace_requests_view(request):
    """
    GET:
      - If role == 'teacher' and not ?view=mine: return verified teacher request feed.
      - If role == 'learner' or ?view=mine: return learner's own requests.
    POST:
      - Learner creates a new Learn Now request.
    """
    if request.method == "GET":
        view_mode = request.query_params.get("view")
        if request.user.role == User.Role.TEACHER and view_mode != "mine":
            # Teacher feed
            skill = request.query_params.get("skill")
            cefr_level = request.query_params.get("cefr_level")
            online_format = request.query_params.get("format")
            time_window = request.query_params.get("timing")
            status_filter = request.query_params.get("status")
            has_offered_param = request.query_params.get("offered")
            has_offered = None
            if has_offered_param == "true":
                has_offered = True
            elif has_offered_param == "false":
                has_offered = False

            feed_qs = list_teacher_feed(
                teacher=request.user,
                skill=skill,
                cefr_level=cefr_level,
                online_format=online_format,
                time_window=time_window,
                status_filter=status_filter,
                has_offered=has_offered,
            )
            serializer = TeacherFeedRequestSerializer(feed_qs, many=True, context={"request": request})
            return Response({"requests": serializer.data, "count": len(serializer.data)})
        else:
            # Learner's own requests
            qs = MarketplaceRequest.objects.filter(learner=request.user).order_by("-created_at")
            serializer = LearnerRequestDetailSerializer(qs, many=True, context={"request": request})
            return Response({"requests": serializer.data, "count": len(serializer.data)})

    elif request.method == "POST":
        serializer = CreateMarketplaceRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        req = create_learn_now_request(
            learner=request.user,
            target_skill=data["target_skill"],
            short_description=data["short_description"],
            target_subskill=data.get("target_subskill", ""),
            target_cefr_level=data.get("target_cefr_level", "unspecified"),
            preferred_time_window=data.get("preferred_time_window", "flexible"),
            duration_minutes=data.get("duration_minutes", 45),
            online_format=data.get("online_format", "video"),
            budget_max_toman=data.get("budget_max_toman"),
            preferred_teacher_id=str(data["preferred_teacher_id"]) if data.get("preferred_teacher_id") else None,
            expire_hours=data.get("expire_hours", 24),
        )
        return Response(
            LearnerRequestDetailSerializer(req, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


@api_view(["GET", "DELETE"])
@permission_classes([IsAuthenticated])
def marketplace_request_detail_view(request, request_id):
    """
    GET:
      - Learner receives full detail + received offers.
      - Teacher receives privacy-masked feed item + their own offer status.
    DELETE:
      - Learner cancels their active request.
    """
    if request.method == "GET":
        if request.user.role == User.Role.TEACHER:
            try:
                req = MarketplaceRequest.objects.get(id=request_id)
            except MarketplaceRequest.DoesNotExist:
                return Response({"detail": "درخواست یافت نشد."}, status=status.HTTP_404_NOT_FOUND)
            serializer = TeacherFeedRequestSerializer(req, context={"request": request})
            return Response(serializer.data)
        else:
            try:
                req = MarketplaceRequest.objects.get(id=request_id, learner=request.user)
            except MarketplaceRequest.DoesNotExist:
                return Response({"detail": "درخواست یافت نشد."}, status=status.HTTP_404_NOT_FOUND)
            serializer = LearnerRequestDetailSerializer(req, context={"request": request})
            return Response(serializer.data)

    elif request.method == "DELETE":
        cancelled = cancel_learner_request(request.user, request_id)
        return Response({"status": "cancelled", "id": str(cancelled.id)})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cancel_marketplace_request_view(request, request_id):
    """Explicit POST endpoint for canceling a request."""
    cancelled = cancel_learner_request(request.user, request_id)
    return Response({"status": "cancelled", "id": str(cancelled.id)})


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def request_offers_view(request, request_id):
    """
    GET: Learner retrieves offers for their request.
    POST: Teacher submits a new structured offer.
    """
    if request.method == "GET":
        try:
            req = MarketplaceRequest.objects.get(id=request_id, learner=request.user)
        except MarketplaceRequest.DoesNotExist:
            return Response({"detail": "درخواست یافت نشد."}, status=status.HTTP_404_NOT_FOUND)
        offers = req.offers.exclude(status="withdrawn").order_by("-created_at")
        serializer = TeacherOfferSerializer(offers, many=True, context={"request": request})
        return Response({"offers": serializer.data, "count": len(serializer.data)})

    elif request.method == "POST":
        serializer = SubmitTeacherOfferSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        offer = submit_teacher_offer(
            teacher=request.user,
            request_id=request_id,
            rate_toman=data["rate_toman"],
            intro_note=data["intro_note"],
            proposed_start_time=data.get("proposed_start_time"),
            duration_minutes=data.get("duration_minutes", 45),
            online_format=data.get("online_format", "video"),
        )
        return Response(
            TeacherOfferSerializer(offer, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def teacher_offers_workspace_view(request):
    """Teacher lists all offers they have submitted."""
    status_filter = request.query_params.get("status")
    offers_qs = list_teacher_offers(request.user, status_filter=status_filter)
    serializer = TeacherWorkspaceOfferSerializer(offers_qs, many=True)
    return Response({"offers": serializer.data, "count": len(serializer.data)})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def withdraw_teacher_offer_view(request, offer_id):
    """Teacher withdraws their pending offer."""
    offer = withdraw_teacher_offer(request.user, offer_id)
    return Response({"status": "withdrawn", "id": str(offer.id)})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def accept_teacher_offer_view(request, offer_id):
    """Learner accepts an offer, booking the session and declining competing offers."""
    req, offer = accept_teacher_offer(request.user, offer_id)
    return Response({
        "status": "booked",
        "request_id": str(req.id),
        "offer_id": str(offer.id),
        "message": "پیشنهاد با موفقیت پذیرفته شد و درخواست به وضعیت رزرو شده انتقال یافت.",
    })

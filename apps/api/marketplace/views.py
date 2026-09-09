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
    create_session_booking,
    list_user_bookings,
    request_booking_reschedule,
    respond_booking_reschedule,
    cancel_session_booking,
    start_session_booking,
    complete_session_booking,
)
from .serializers import (
    TeacherFeedRequestSerializer,
    LearnerRequestDetailSerializer,
    TeacherOfferSerializer,
    TeacherWorkspaceOfferSerializer,
    CreateMarketplaceRequestSerializer,
    SubmitTeacherOfferSerializer,
    SessionBookingSerializer,
    DirectCreateBookingSerializer,
    RescheduleBookingSerializer,
    RespondRescheduleSerializer,
    CancelBookingSerializer,
    CompleteBookingSerializer,
)
from .models import MarketplaceRequest, TeacherOffer, SessionBooking


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def teacher_eligibility_view(request):
    """Checks whether the logged in teacher is verified and marketplace eligible."""
    status_data = get_teacher_eligibility_status(request.user)
    return Response(status_data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def marketplace_requests_view(request):
    if request.method == "GET":
        view_mode = request.query_params.get("view")
        if request.user.role == User.Role.TEACHER and view_mode != "mine":
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
    cancelled = cancel_learner_request(request.user, request_id)
    return Response({"status": "cancelled", "id": str(cancelled.id)})


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def request_offers_view(request, request_id):
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
    status_filter = request.query_params.get("status")
    offers_qs = list_teacher_offers(request.user, status_filter=status_filter)
    serializer = TeacherWorkspaceOfferSerializer(offers_qs, many=True)
    return Response({"offers": serializer.data, "count": len(serializer.data)})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def withdraw_teacher_offer_view(request, offer_id):
    offer = withdraw_teacher_offer(request.user, offer_id)
    return Response({"status": "withdrawn", "id": str(offer.id)})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def accept_teacher_offer_view(request, offer_id):
    """Learner accepts an offer, booking the session and auto-declining competing offers."""
    req, offer, booking = accept_teacher_offer(request.user, offer_id)
    return Response({
        "status": "booked",
        "request_id": str(req.id),
        "offer_id": str(offer.id),
        "booking_id": str(booking.id),
        "message": "پیشنهاد با موفقیت پذیرفته شد و جلسه شما رزرو گردید.",
    })


# --- Day 38: Session Booking & Scheduling Endpoints ---

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def bookings_collection_view(request):
    """
    GET: List user's bookings (learner or teacher).
    POST: Direct booking creation (idempotent, conflict-checked).
    """
    if request.method == "GET":
        status_filter = request.query_params.get("status")
        role_filter = request.query_params.get("role")
        qs = list_user_bookings(request.user, status_filter=status_filter, role_filter=role_filter)
        serializer = SessionBookingSerializer(qs, many=True, context={"request": request})
        return Response({"bookings": serializer.data, "count": len(serializer.data)})

    elif request.method == "POST":
        serializer = DirectCreateBookingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            teacher = User.objects.get(id=data["teacher_id"], role=User.Role.TEACHER)
        except User.DoesNotExist:
            return Response({"detail": "مدرس مورد نظر یافت نشد."}, status=status.HTTP_404_NOT_FOUND)

        booking = create_session_booking(
            learner=request.user,
            teacher=teacher,
            target_skill=data["target_skill"],
            target_subskill=data.get("target_subskill", ""),
            rate_toman=data["rate_toman"],
            scheduled_start=data["scheduled_start"],
            duration_minutes=data.get("duration_minutes", 45),
            online_format=data.get("online_format", "video"),
            timezone_name=data.get("timezone_name", "Asia/Tehran"),
            idempotency_key=data.get("idempotency_key"),
        )
        return Response(
            SessionBookingSerializer(booking, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def booking_detail_view(request, booking_id):
    """Full booking details with counterparty, action capabilities and localized schedule."""
    try:
        booking = SessionBooking.objects.get(id=booking_id)
    except SessionBooking.DoesNotExist:
        return Response({"detail": "جلسه مورد نظر یافت نشد."}, status=status.HTTP_404_NOT_FOUND)

    if request.user.id not in [booking.learner_id, booking.teacher_id]:
        return Response({"detail": "شما دسترسی به این جلسه را ندارید."}, status=status.HTTP_403_FORBIDDEN)

    serializer = SessionBookingSerializer(booking, context={"request": request})
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cancel_booking_view(request, booking_id):
    """Learner or teacher cancels a confirmed/reschedule-requested session with reason."""
    serializer = CancelBookingSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    reason = serializer.validated_data["reason"]

    cancelled = cancel_session_booking(request.user, booking_id, reason)
    return Response({
        "status": cancelled.status,
        "id": str(cancelled.id),
        "message": "جلسه با موفقیت لغو شد.",
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def request_reschedule_view(request, booking_id):
    """Propose a new start time for the session."""
    serializer = RescheduleBookingSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    updated = request_booking_reschedule(
        user=request.user,
        booking_id=booking_id,
        new_start=data["new_start_time"],
        note=data.get("note", ""),
    )
    return Response(SessionBookingSerializer(updated, context={"request": request}).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def respond_reschedule_view(request, booking_id):
    """Accept or reject proposed reschedule time."""
    serializer = RespondRescheduleSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    accept = serializer.validated_data["accept"]

    updated = respond_booking_reschedule(user=request.user, booking_id=booking_id, accept=accept)
    return Response(SessionBookingSerializer(updated, context={"request": request}).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def start_booking_session_view(request, booking_id):
    """Transition confirmed booking to in_progress within session time window."""
    updated = start_session_booking(request.user, booking_id)
    return Response({
        "status": updated.status,
        "meeting_url": updated.meeting_url,
        "message": "جلسه آغاز شد.",
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def complete_booking_session_view(request, booking_id):
    """Complete in_progress session with notes."""
    serializer = CompleteBookingSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    notes = serializer.validated_data.get("session_notes", "")

    updated = complete_session_booking(request.user, booking_id, notes)
    return Response({
        "status": updated.status,
        "message": "جلسه با موفقیت به پایان رسید و ثبت گردید.",
    })

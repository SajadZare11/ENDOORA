from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.request import Request
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


# ---------------------------------------------------------------------------
# Day 39: Teacher Directory, Public Profile & Review Endpoints
# ---------------------------------------------------------------------------

@api_view(["GET"])
@permission_classes([AllowAny])
def public_teachers_directory_view(request: Request) -> Response:
    from marketplace.services import list_public_teachers

    search = request.query_params.get("search")
    skill = request.query_params.get("skill")
    min_rating = float(request.query_params.get("min_rating")) if request.query_params.get("min_rating") else None
    max_rate = Decimal(request.query_params.get("max_rate")) if request.query_params.get("max_rate") else None
    sort_by = request.query_params.get("sort_by", "rating")

    teachers = list_public_teachers(
        search=search,
        skill=skill,
        min_rating=min_rating,
        max_rate_toman=max_rate,
        sort_by=sort_by,
    )
    return Response({"teachers": teachers, "count": len(teachers)})


@api_view(["GET"])
@permission_classes([AllowAny])
def teacher_public_profile_view(request: Request, teacher_id: str) -> Response:
    from marketplace.services import get_teacher_public_profile

    profile_data = get_teacher_public_profile(teacher_id)
    return Response(profile_data)


@api_view(["GET"])
@permission_classes([AllowAny])
def teacher_reviews_list_view(request: Request, teacher_id: str) -> Response:
    from marketplace.models import TeacherReview, ReviewStatus
    from marketplace.serializers import TeacherReviewSerializer

    reviews = TeacherReview.objects.filter(
        teacher_id=teacher_id,
        status=ReviewStatus.PUBLISHED,
    ).order_by("-created_at")[:50]

    return Response({
        "reviews": TeacherReviewSerializer(reviews, many=True).data,
        "count": len(reviews),
    })


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def booking_review_view(request: Request, booking_id: str) -> Response:
    from marketplace.models import SessionBooking
    from marketplace.services import submit_session_review
    from marketplace.serializers import TeacherReviewSerializer, SubmitReviewSerializer

    try:
        booking = SessionBooking.objects.get(id=booking_id)
    except SessionBooking.DoesNotExist:
        return Response({"error": "جلسه یافت نشد."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        review = getattr(booking, "review", None)
        if not review:
            return Response({"review": None, "has_review": False})
        return Response({"review": TeacherReviewSerializer(review).data, "has_review": True})

    # POST: Submit review
    serializer = SubmitReviewSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    d = serializer.validated_data

    review = submit_session_review(
        booking_id=booking_id,
        learner=request.user,
        overall_rating=d["overall_rating"],
        comment=d["comment"],
        rating_teaching=d.get("rating_teaching", 5),
        rating_punctuality=d.get("rating_punctuality", 5),
        rating_communication=d.get("rating_communication", 5),
        is_anonymous=d.get("is_anonymous", False),
    )

    return Response({
        "status": "success",
        "message": "نظر شما با موفقیت ثبت شد.",
        "review": TeacherReviewSerializer(review).data,
    }, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def reply_to_review_view(request: Request, review_id: str) -> Response:
    from marketplace.services import reply_to_teacher_review
    from marketplace.serializers import TeacherReviewReplySerializer, TeacherReviewSerializer

    serializer = TeacherReviewReplySerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    review = reply_to_teacher_review(
        review_id=review_id,
        teacher=request.user,
        reply_text=serializer.validated_data["reply_text"],
    )

    return Response({
        "status": "success",
        "message": "پاسخ مدرس با موفقیت ثبت شد.",
        "review": TeacherReviewSerializer(review).data,
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def flag_review_view(request: Request, review_id: str) -> Response:
    from marketplace.services import flag_teacher_review
    from marketplace.serializers import FlagReviewSerializer

    serializer = FlagReviewSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    review = flag_teacher_review(
        review_id=review_id,
        user=request.user,
        reason=serializer.validated_data["reason"],
    )

    return Response({
        "status": "success",
        "message": "گزارش تخلف ثبت گردید و توسط تیم نظارت بررسی خواهد شد.",
    })

# ---------------------------------------------------------------------------
# Day 40: Teacher Availability Calendar, Recurring Slots & Time-Off Views
# ---------------------------------------------------------------------------

@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def teacher_availability_view(request):
    """Teacher retrieves or updates their weekly recurring availability schedule."""
    from accounts.models import User
    if not (request.user.is_authenticated and request.user.role == User.Role.TEACHER and getattr(request.user, "is_teacher_verified", False) and getattr(request.user, "marketplace_eligible", False)):
        return Response({"detail": "فقط اساتید تاییدشده و واجد شرایط مجاز به تنظیم ساعات کاری هستند."}, status=status.HTTP_403_FORBIDDEN)
    from marketplace.services import (
        get_teacher_weekly_schedule,
        save_teacher_weekly_schedule,
        get_or_create_availability_settings,
    )
    from marketplace.serializers import (
        WeeklyScheduleInputSerializer,
        TeacherAvailabilitySettingSerializer,
    )

    if request.method == "GET":
        schedule = get_teacher_weekly_schedule(request.user.id)
        settings_obj = get_or_create_availability_settings(request.user.id)
        return Response({
            "schedule": schedule,
            "settings": TeacherAvailabilitySettingSerializer(settings_obj).data,
            "is_verified": request.user.is_teacher_verified,
            "marketplace_eligible": request.user.marketplace_eligible,
        }, status=status.HTTP_200_OK)

    elif request.method == "PUT":
        ser = WeeklyScheduleInputSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

        slots_data = ser.validated_data.get("slots", [])
        updated_schedule = save_teacher_weekly_schedule(request.user, slots_data)
        return Response({
            "message": "برنامه هفتگی دسترسی با موفقیت ذخیره شد.",
            "schedule": updated_schedule,
        }, status=status.HTTP_200_OK)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def teacher_time_off_list_create_view(request):
    """Teacher lists or creates time-off / blackout periods."""
    from accounts.models import User
    if not (request.user.is_authenticated and request.user.role == User.Role.TEACHER and getattr(request.user, "is_teacher_verified", False) and getattr(request.user, "marketplace_eligible", False)):
        return Response({"detail": "فقط اساتید تاییدشده و واجد شرایط مجاز به ثبت مرخصی هستند."}, status=status.HTTP_403_FORBIDDEN)
    from marketplace.services import list_teacher_time_off, add_teacher_time_off
    from marketplace.serializers import CreateTimeOffSerializer, TeacherTimeOffSerializer

    if request.method == "GET":
        time_offs = list_teacher_time_off(request.user.id, future_only=False)
        return Response({"time_offs": time_offs}, status=status.HTTP_200_OK)

    elif request.method == "POST":
        ser = CreateTimeOffSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

        from rest_framework.exceptions import ValidationError as DRFValidationError
        try:
            time_off = add_teacher_time_off(
                teacher=request.user,
                start_datetime=ser.validated_data["start_datetime"],
                end_datetime=ser.validated_data["end_datetime"],
                reason=ser.validated_data.get("reason", ""),
                is_full_day=ser.validated_data.get("is_full_day", False),
            )
        except DRFValidationError as exc:
            return Response(exc.detail if isinstance(exc.detail, dict) else {"conflicts": str(exc.detail)}, status=status.HTTP_400_BAD_REQUEST)

        time_off_data = TeacherTimeOffSerializer(time_off).data
        response_payload = dict(time_off_data)
        response_payload["message"] = "بازه مرخصی با موفقیت ثبت شد."
        response_payload["time_off"] = time_off_data
        return Response(response_payload, status=status.HTTP_201_CREATED)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def teacher_time_off_delete_view(request, time_off_id):
    """Teacher cancels/deletes an active time-off period."""
    from marketplace.services import delete_teacher_time_off
    delete_teacher_time_off(request.user, str(time_off_id))
    return Response({"message": "بازه مرخصی حذف شد.", "deleted": True}, status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def teacher_availability_settings_view(request):
    """Teacher manages availability parameters (lead time, horizon, buffer)."""
    from accounts.models import User
    if not (request.user.is_authenticated and request.user.role == User.Role.TEACHER and getattr(request.user, "is_teacher_verified", False) and getattr(request.user, "marketplace_eligible", False)):
        return Response({"detail": "فقط اساتید تاییدشده و واجد شرایط مجاز به تغییر تنظیمات هستند."}, status=status.HTTP_403_FORBIDDEN)
    from marketplace.services import get_or_create_availability_settings, update_availability_settings
    from marketplace.serializers import TeacherAvailabilitySettingSerializer

    if request.method == "GET":
        settings_obj = get_or_create_availability_settings(request.user.id)
        return Response(TeacherAvailabilitySettingSerializer(settings_obj).data, status=status.HTTP_200_OK)

    elif request.method == "PATCH":
        updated_settings = update_availability_settings(request.user, request.data)
        ser_data = TeacherAvailabilitySettingSerializer(updated_settings).data
        response_data = dict(ser_data)
        response_data["message"] = "تنظیمات دسترسی با موفقیت بروزرسانی شد."
        response_data["settings"] = ser_data
        return Response(response_data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([AllowAny])
def public_teacher_available_slots_view(request, teacher_id):
    """Public endpoint for learners to retrieve real-time available booking slots for a teacher."""
    from datetime import date
    from marketplace.services import generate_teacher_available_slots

    start_date_str = request.query_params.get("start_date")
    end_date_str = request.query_params.get("end_date")
    duration_str = request.query_params.get("duration")

    start_d = None
    end_d = None
    duration_m = None

    if start_date_str:
        try:
            start_d = date.fromisoformat(start_date_str)
        except ValueError:
            return Response({"detail": "تاریخ آغاز نامعتبر است (فرمت مجاز: YYYY-MM-DD)"}, status=status.HTTP_400_BAD_REQUEST)

    if end_date_str:
        try:
            end_d = date.fromisoformat(end_date_str)
        except ValueError:
            return Response({"detail": "تاریخ پایان نامعتبر است (فرمت مجاز: YYYY-MM-DD)"}, status=status.HTTP_400_BAD_REQUEST)

    if duration_str:
        try:
            duration_m = int(duration_str)
        except ValueError:
            return Response({"detail": "مدت جلسه نامعتبر است"}, status=status.HTTP_400_BAD_REQUEST)

    days = generate_teacher_available_slots(
        teacher_id=str(teacher_id),
        start_date=start_d,
        end_date=end_d,
        duration_minutes=duration_m,
    )
    all_slots = []
    for d in days:
        all_slots.extend(d.get("slots", []))

    return Response({
        "success": True,
        "teacher_id": str(teacher_id),
        "days": days,
        "slots": all_slots,
        "total_slots": len(all_slots),
    }, status=status.HTTP_200_OK)

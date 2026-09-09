from django.urls import path
from .views import (
    teacher_eligibility_view,
    marketplace_requests_view,
    marketplace_request_detail_view,
    cancel_marketplace_request_view,
    request_offers_view,
    teacher_offers_workspace_view,
    withdraw_teacher_offer_view,
    accept_teacher_offer_view,
    bookings_collection_view,
    booking_detail_view,
    cancel_booking_view,
    request_reschedule_view,
    respond_reschedule_view,
    start_booking_session_view,
    complete_booking_session_view,
)

urlpatterns = [
    path("eligibility/", teacher_eligibility_view, name="marketplace_teacher_eligibility"),
    path("requests/", marketplace_requests_view, name="marketplace_requests"),
    path("requests/<uuid:request_id>/", marketplace_request_detail_view, name="marketplace_request_detail"),
    path("requests/<uuid:request_id>/cancel/", cancel_marketplace_request_view, name="marketplace_request_cancel"),
    path("requests/<uuid:request_id>/offers/", request_offers_view, name="marketplace_request_offers"),
    path("offers/", teacher_offers_workspace_view, name="marketplace_teacher_offers"),
    path("offers/<uuid:offer_id>/withdraw/", withdraw_teacher_offer_view, name="marketplace_offer_withdraw"),
    path("offers/<uuid:offer_id>/accept/", accept_teacher_offer_view, name="marketplace_offer_accept"),

    # Day 38: Booking & Scheduling Endpoints
    path("bookings/", bookings_collection_view, name="marketplace_bookings"),
    path("bookings/create_direct/", bookings_collection_view, name="marketplace_booking_create_direct"),
    path("bookings/<uuid:booking_id>/", booking_detail_view, name="marketplace_booking_detail"),
    path("bookings/<uuid:booking_id>/cancel/", cancel_booking_view, name="marketplace_booking_cancel"),
    path("bookings/<uuid:booking_id>/reschedule/", request_reschedule_view, name="marketplace_booking_reschedule"),
    path("bookings/<uuid:booking_id>/reschedule/respond/", respond_reschedule_view, name="marketplace_booking_reschedule_respond"),
    path("bookings/<uuid:booking_id>/start/", start_booking_session_view, name="marketplace_booking_start"),
    path("bookings/<uuid:booking_id>/complete/", complete_booking_session_view, name="marketplace_booking_complete"),
]

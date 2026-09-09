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
]

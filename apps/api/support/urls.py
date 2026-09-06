from django.urls import path
from support.views import (
    FAQListView,
    FAQSearchView,
    FAQHelpfulVoteView,
    SupportTicketListCreateView,
    SupportTicketDetailView,
    SupportTicketMessageCreateView,
    SupportTicketEscalateView,
)

app_name = "support"

urlpatterns = [
    # FAQ Endpoints
    path("faq/", FAQListView.as_view(), name="faq_list"),
    path("faq/search/", FAQSearchView.as_view(), name="faq_search"),
    path("faq/<uuid:pk>/helpful/", FAQHelpfulVoteView.as_view(), name="faq_helpful_vote"),

    # Support Ticket Endpoints
    path("tickets/", SupportTicketListCreateView.as_view(), name="ticket_list_create"),
    path("tickets/<uuid:pk>/", SupportTicketDetailView.as_view(), name="ticket_detail"),
    path("tickets/<uuid:pk>/messages/", SupportTicketMessageCreateView.as_view(), name="ticket_message_create"),
    path("tickets/<uuid:pk>/escalate/", SupportTicketEscalateView.as_view(), name="ticket_escalate"),
]

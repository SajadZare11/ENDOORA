from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from support.models import FAQCategory, FAQItem, SupportTicket
from support.services import FAQService, TicketService
from support.serializers import (
    FAQCategorySerializer,
    FAQItemSerializer,
    SupportTicketListSerializer,
    SupportTicketDetailSerializer,
    SupportTicketCreateSerializer,
    TicketMessageSerializer,
)


class FAQListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        categories = FAQService.list_categories()
        serializer = FAQCategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FAQSearchView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        q = request.query_params.get("q", "")
        faqs = FAQService.search_faqs(q)
        serializer = FAQItemSerializer(faqs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FAQHelpfulVoteView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, pk):
        success = FAQService.vote_helpful(pk)
        if success:
            return Response({"detail": "Vote recorded."}, status=status.HTTP_200_OK)
        return Response({"error": "FAQ item not found."}, status=status.HTTP_404_NOT_FOUND)


class SupportTicketListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if getattr(request.user, "is_staff", False):
            tickets = SupportTicket.objects.all().order_by("-updated_at")
        else:
            tickets = SupportTicket.objects.filter(user=request.user).order_by("-updated_at")
        serializer = SupportTicketListSerializer(tickets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = SupportTicketCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        ticket = TicketService.create_ticket(
            user=request.user,
            category=serializer.validated_data["category"],
            title=serializer.validated_data["title"],
            description=serializer.validated_data["description"],
            attachments=serializer.validated_data.get("attachments", []),
        )
        detail_serializer = SupportTicketDetailSerializer(ticket)
        return Response(detail_serializer.data, status=status.HTTP_201_CREATED)


class SupportTicketDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            if getattr(request.user, "is_staff", False):
                ticket = SupportTicket.objects.get(id=pk)
            else:
                ticket = SupportTicket.objects.get(id=pk, user=request.user)
        except SupportTicket.DoesNotExist:
            return Response({"error": "Ticket not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = SupportTicketDetailSerializer(ticket)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SupportTicketMessageCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            if getattr(request.user, "is_staff", False):
                ticket = SupportTicket.objects.get(id=pk)
            else:
                ticket = SupportTicket.objects.get(id=pk, user=request.user)
        except SupportTicket.DoesNotExist:
            return Response({"error": "Ticket not found."}, status=status.HTTP_404_NOT_FOUND)

        body = request.data.get("body", "").strip()
        if not body:
            return Response({"error": "Message body cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

        msg = TicketService.add_message(
            ticket_id=str(ticket.id),
            sender_user=request.user,
            body=body,
            is_internal=request.data.get("is_internal", False),
        )
        serializer = TicketMessageSerializer(msg)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SupportTicketEscalateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        reason = request.data.get("reason", "")
        try:
            ticket = TicketService.escalate_to_human(
                ticket_id=str(pk),
                user=request.user,
                reason=reason,
            )
        except SupportTicket.DoesNotExist:
            return Response({"error": "Ticket not found."}, status=status.HTTP_404_NOT_FOUND)
        except PermissionError as e:
            return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)

        serializer = SupportTicketDetailSerializer(ticket)
        return Response(serializer.data, status=status.HTTP_200_OK)

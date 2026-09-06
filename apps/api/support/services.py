"""
Support and AI Triage Services.
Implements bounded AI support triage strictly citing approved FAQs,
automatic escalation for payments/account/security, and human handoff.
"""

from typing import Optional, List, Dict, Any
from django.db import models
from django.db.models import Q, F
from django.utils import timezone

from search.normalizer import normalize_text, tokenize
from support.models import (
    FAQCategory,
    FAQItem,
    SupportTicket,
    TicketMessage,
    TicketAttachment,
    TicketCategory,
    TicketStatus,
    SenderType,
)

# Mandatory escalation categories that MUST NEVER be handled by AI answers
SENSITIVE_CATEGORIES = {
    TicketCategory.PAYMENTS,
    TicketCategory.ACCOUNT,
    TicketCategory.SECURITY,
}


class FAQService:
    @staticmethod
    def list_categories() -> List[FAQCategory]:
        return list(
            FAQCategory.objects.prefetch_related(
                models.Prefetch("items", queryset=FAQItem.objects.filter(is_published=True).order_by("order", "-helpful_count"))
            ).order_by("order", "title")
        )

    @staticmethod
    def search_faqs(query: str) -> List[FAQItem]:
        clean_q = (query or "").strip()
        if not clean_q:
            return list(FAQItem.objects.filter(is_published=True).order_by("order", "-helpful_count")[:20])

        norm_q = normalize_text(clean_q)
        tokens = tokenize(clean_q)

        q_filter = (
            Q(normalized_question__icontains=norm_q)
            | Q(answer__icontains=clean_q)
        )
        for t in tokens:
            q_filter |= Q(normalized_question__icontains=t) | Q(answer__icontains=t)

        return list(FAQItem.objects.filter(is_published=True).filter(q_filter).distinct()[:20])

    @staticmethod
    def vote_helpful(faq_id: str) -> bool:
        updated = FAQItem.objects.filter(id=faq_id, is_published=True).update(
            helpful_count=F("helpful_count") + 1
        )
        return updated > 0


class AITriageService:
    @staticmethod
    def triage_ticket(ticket: SupportTicket) -> SupportTicket:
        """
        AI Support Triage Engine with Mandatory Safety Gates:
        1. If category is PAYMENTS, ACCOUNT, or SECURITY:
           AI is strictly forbidden from drafting responses.
           Ticket is immediately escalated to human staff.
        2. For other categories:
           AI searches published FAQs only.
           If a high-confidence match is found, drafts response citing the FAQ.
           Otherwise, escalates to human agent.
        """
        # 1. Mandatory Human Escalation Safety Gate
        if ticket.category in SENSITIVE_CATEGORIES:
            ticket.status = TicketStatus.ESCALATED
            ticket.escalated_to_human = True
            ticket.escalation_reason = (
                "Mandatory safety policy: Financial, account, and security issues require human staff review."
            )
            ticket.save(update_fields=["status", "escalated_to_human", "escalation_reason", "updated_at"])

            TicketMessage.objects.create(
                ticket=ticket,
                sender_type=SenderType.AI_AGENT,
                body=(
                    "درخواست شما مربوط به موضوعات حساس (امور مالی/حساب کاربری/امنیت) است "
                    "و جهت حفظ امنیت شما، بلافاصله جهت بررسی به کارشناس پشتیبانی ارجاع گردید."
                ),
            )
            return ticket

        # 2. General Inquiry: Search approved published FAQs
        norm_title = normalize_text(ticket.title)
        norm_desc = normalize_text(ticket.description)
        combined_text = f"{norm_title} {norm_desc}"
        tokens = set(tokenize(combined_text))

        published_faqs = list(FAQItem.objects.filter(is_published=True))
        best_faq: Optional[FAQItem] = None
        best_score: float = 0.0

        for faq in published_faqs:
            faq_tokens = set(tokenize(f"{faq.normalized_question} {normalize_text(faq.answer)}"))
            if not faq_tokens:
                continue
            # Token overlap score
            overlap = tokens.intersection(faq_tokens)
            score = len(overlap) / max(1, len(tokens))

            # Bonus if question matches title directly
            if norm_title and (norm_title in faq.normalized_question or faq.normalized_question in norm_title):
                score += 0.5

            if score > best_score:
                best_score = score
                best_faq = faq

        # Confidence threshold for AI answer citing approved FAQ
        if best_faq and best_score >= 0.35:
            ticket.status = TicketStatus.AI_ANSWERED
            ticket.cited_faq = best_faq
            ticket.ai_confidence_score = min(1.0, round(best_score, 2))
            ticket.save(update_fields=["status", "cited_faq", "ai_confidence_score", "updated_at"])

            TicketMessage.objects.create(
                ticket=ticket,
                sender_type=SenderType.AI_AGENT,
                body=(
                    f"با سلام. راهنمای رسمی زیر ممکن است پاسخگوی درخواست شما باشد:\n\n"
                    f"📌 **سوال مرتبط:** {best_faq.question}\n\n"
                    f"💡 **پاسخ راهنما:**\n{best_faq.answer}\n\n"
                    f"---\n"
                    f"*این پاسخ به صورت خودکار بر اساس پایگاه دانش رسمی اندورا پیشنهاد شده است. "
                    f"در صورتی که پاسخ شما کامل نیست، می‌توانید با زدن دکمه «ارجاع به پشتیبان انسانی» درخواست خود را به کارشناس بسپارید.*"
                ),
            )
        else:
            # Low confidence or no relevant FAQ: Escalate to human
            ticket.status = TicketStatus.ESCALATED
            ticket.escalated_to_human = True
            ticket.escalation_reason = "No high-confidence matching official FAQ entry found."
            ticket.save(update_fields=["status", "escalated_to_human", "escalation_reason", "updated_at"])

            TicketMessage.objects.create(
                ticket=ticket,
                sender_type=SenderType.AI_AGENT,
                body=(
                    "درخواست شما با موفقیت ثبت شد. پاسخ مستقیمی در سوالات متداول یافت نشد و تیکت جهت رسیدگی در صف کارشناسان پشتیبانی قرار گرفت."
                ),
            )

        return ticket


class TicketService:
    @staticmethod
    def create_ticket(
        user,
        category: str,
        title: str,
        description: str,
        attachments: Optional[List[Dict[str, Any]]] = None,
    ) -> SupportTicket:
        ticket = SupportTicket.objects.create(
            user=user,
            category=category,
            title=title.strip(),
            description=description.strip(),
            status=TicketStatus.NEW,
        )

        # Initial user message
        TicketMessage.objects.create(
            ticket=ticket,
            sender_type=SenderType.USER,
            sender_user=user,
            body=description.strip(),
        )

        # Attachments
        if attachments:
            for att in attachments:
                TicketAttachment.objects.create(
                    ticket=ticket,
                    file_name=att.get("file_name", "attachment"),
                    file_url=att.get("file_url", ""),
                    file_size=att.get("file_size", 0),
                    content_type=att.get("content_type", "application/octet-stream"),
                )

        # Run automated AI triage
        AITriageService.triage_ticket(ticket)
        return ticket

    @staticmethod
    def escalate_to_human(ticket_id: str, user, reason: str = "") -> SupportTicket:
        """Guaranteed Human Handoff: Transits ticket to ESCALATED status upon user or staff request."""
        ticket = SupportTicket.objects.get(id=ticket_id)
        if ticket.user != user and not getattr(user, "is_staff", False):
            raise PermissionError("You do not have permission to escalate this ticket.")

        ticket.status = TicketStatus.ESCALATED
        ticket.escalated_to_human = True
        ticket.escalation_reason = reason or "User explicitly requested human agent handoff."
        ticket.save(update_fields=["status", "escalated_to_human", "escalation_reason", "updated_at"])

        TicketMessage.objects.create(
            ticket=ticket,
            sender_type=SenderType.USER if ticket.user == user else SenderType.STAFF,
            sender_user=user,
            body="تیکت به صف بررسی کارشناسان انسانی منتقل شد.",
        )
        return ticket

    @staticmethod
    def add_message(ticket_id: str, sender_user, body: str, is_internal: bool = False) -> TicketMessage:
        ticket = SupportTicket.objects.get(id=ticket_id)
        is_staff = getattr(sender_user, "is_staff", False)

        sender_type = SenderType.STAFF if is_staff else SenderType.USER
        msg = TicketMessage.objects.create(
            ticket=ticket,
            sender_type=sender_type,
            sender_user=sender_user,
            body=body.strip(),
            is_internal=is_internal and is_staff,
        )

        # If staff replied, update ticket status
        if is_staff and not is_internal:
            ticket.status = TicketStatus.TRIAGED
            ticket.save(update_fields=["status", "updated_at"])

        return msg

    @staticmethod
    def resolve_ticket(ticket_id: str, staff_user) -> SupportTicket:
        ticket = SupportTicket.objects.get(id=ticket_id)
        ticket.status = TicketStatus.RESOLVED
        ticket.save(update_fields=["status", "updated_at"])

        TicketMessage.objects.create(
            ticket=ticket,
            sender_type=SenderType.STAFF,
            sender_user=staff_user,
            body="این تیکت با موفقیت بررسی و حل شد.",
        )
        return ticket

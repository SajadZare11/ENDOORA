import uuid
from django.contrib.auth import get_user_model
from django.test import TestCase

from support.models import (
    FAQCategory,
    FAQItem,
    SupportTicket,
    TicketMessage,
    TicketCategory,
    TicketStatus,
    SenderType,
)
from support.services import FAQService, AITriageService, TicketService

User = get_user_model()


class FAQServiceTests(TestCase):
    def setUp(self):
        self.cat = FAQCategory.objects.create(title="اشتراک و آزمون", slug="subscription-test", order=1)
        self.faq1 = FAQItem.objects.create(
            category=self.cat,
            question="آزمون تعیین سطح چگونه کار می‌کند؟",
            answer="آزمون تعیین سطح اندورا دارای بخش‌های لیسنینگ، ریدینگ و گرامر تطبیقی است و نتیجه در کارنامه تفصیلی ثبت می‌شود.",
            is_published=True,
            order=1,
        )
        self.faq_draft = FAQItem.objects.create(
            category=self.cat,
            question="پیش‌نویس سوال منتشر نشده",
            answer="این سوال نباید در نتایج عمومی جستجو ظاهر شود.",
            is_published=False,
        )

    def test_list_categories_includes_only_published(self):
        cats = FAQService.list_categories()
        self.assertEqual(len(cats), 1)
        items = list(cats[0].items.all())
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0].id, self.faq1.id)

    def test_search_faqs_normalized(self):
        # Arabic Kaf and Yeh query
        results = FAQService.search_faqs("تعيين سطح كجا")
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].id, self.faq1.id)

    def test_vote_helpful(self):
        prev = self.faq1.helpful_count
        success = FAQService.vote_helpful(str(self.faq1.id))
        self.assertTrue(success)
        self.faq1.refresh_from_db()
        self.assertEqual(self.faq1.helpful_count, prev + 1)


class AITriageAndEscalationTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="learner@example.com", password="password123")
        self.other_user = User.objects.create_user(email="intruder@example.com", password="password123")

        self.cat = FAQCategory.objects.create(title="دوره‌ها", slug="courses")
        self.faq_course = FAQItem.objects.create(
            category=self.cat,
            question="چگونه می‌توانم در دوره آیلتس ثبت‌نام کنم؟",
            answer="برای ثبت‌نام در دوره آیلتس، پس از ورود به حساب کاربری از منوی دوره‌ها، سطح مورد نظر را انتخاب و دکمه شروع یادگیری را بزنید.",
            is_published=True,
        )

    def test_payments_ticket_automatically_escalates_to_human(self):
        """CRITICAL FAILURE TRAP: AI must NEVER invent payment policies and must immediately escalate."""
        ticket = TicketService.create_ticket(
            user=self.user,
            category=TicketCategory.PAYMENTS,
            title="مشکل در پرداخت اشتراک ماهیانه",
            description="مبلغ از حساب من کسر شد اما وضعیت اشتراک هنوز فعال نشده است.",
        )
        ticket.refresh_from_db()

        self.assertEqual(ticket.status, TicketStatus.ESCALATED)
        self.assertTrue(ticket.escalated_to_human)
        self.assertIn("Mandatory safety policy", ticket.escalation_reason)
        self.assertIsNone(ticket.cited_faq)

        # Confirm system message informed user of human handoff
        messages = ticket.messages.all()
        ai_msg = messages.filter(sender_type=SenderType.AI_AGENT).first()
        self.assertIsNotNone(ai_msg)
        self.assertIn("امور مالی", ai_msg.body)
        self.assertIn("کارشناس پشتیبانی", ai_msg.body)

    def test_security_ticket_automatically_escalates_to_human(self):
        ticket = TicketService.create_ticket(
            user=self.user,
            category=TicketCategory.SECURITY,
            title="مشکوک بودن به ورود غیرمجاز",
            description="یک نشست ناشناس در حساب کاربری من دیده می‌شود.",
        )
        ticket.refresh_from_db()

        self.assertEqual(ticket.status, TicketStatus.ESCALATED)
        self.assertTrue(ticket.escalated_to_human)

    def test_general_course_inquiry_cites_approved_faq(self):
        ticket = TicketService.create_ticket(
            user=self.user,
            category=TicketCategory.COURSES,
            title="راهنمایی ثبت‌نام دوره آیلتس",
            description="چگونه می‌توانم در دوره آیلتس آکادمیک شرکت کنم؟",
        )
        ticket.refresh_from_db()

        self.assertEqual(ticket.status, TicketStatus.AI_ANSWERED)
        self.assertEqual(ticket.cited_faq_id, self.faq_course.id)
        self.assertGreaterEqual(ticket.ai_confidence_score, 0.35)

        # Confirm AI draft message contains cited FAQ answer
        ai_msg = ticket.messages.filter(sender_type=SenderType.AI_AGENT).first()
        self.assertIsNotNone(ai_msg)
        self.assertIn(self.faq_course.question, ai_msg.body)
        self.assertIn(self.faq_course.answer, ai_msg.body)

    def test_unmatched_inquiry_escalates_to_human(self):
        ticket = TicketService.create_ticket(
            user=self.user,
            category=TicketCategory.OTHER,
            title="موضوع کاملا غیرمرتبط و ناشناخته",
            description="توضیحاتی که به هیچ یک از سوالات متداول موجود در سیستم شباهتی ندارد.",
        )
        ticket.refresh_from_db()

        self.assertEqual(ticket.status, TicketStatus.ESCALATED)
        self.assertTrue(ticket.escalated_to_human)

    def test_guaranteed_human_handoff_action(self):
        # Create ticket that got an AI answer
        ticket = TicketService.create_ticket(
            user=self.user,
            category=TicketCategory.COURSES,
            title="سوال درباره دوره آیلتس",
            description="چگونه در دوره آیلتس شرکت کنم؟",
        )
        self.assertEqual(ticket.status, TicketStatus.AI_ANSWERED)

        # User presses "ارجاع به پشتیبان انسانی"
        updated_ticket = TicketService.escalate_to_human(str(ticket.id), self.user, reason="نیاز به راهنمایی بیشتر دارم")
        self.assertEqual(updated_ticket.status, TicketStatus.ESCALATED)
        self.assertTrue(updated_ticket.escalated_to_human)

    def test_unauthorized_user_cannot_escalate_ticket(self):
        ticket = TicketService.create_ticket(
            user=self.user,
            category=TicketCategory.COURSES,
            title="تست دسترسی تیکت",
            description="شرح درخواست کاربر اصلی",
        )
        with self.assertRaises(PermissionError):
            TicketService.escalate_to_human(str(ticket.id), self.other_user)

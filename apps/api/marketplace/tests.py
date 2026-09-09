from decimal import Decimal
from datetime import timedelta
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from accounts.models import User
from marketplace.models import (
    MarketplaceRequest,
    TeacherOffer,
    RequestSkill,
    CEFRLevel,
    SessionFormat,
    RequestStatus,
    OfferStatus,
)
from marketplace.services import (
    create_learn_now_request,
    list_teacher_feed,
    submit_teacher_offer,
    withdraw_teacher_offer,
    accept_teacher_offer,
    cancel_learner_request,
)


class MarketplaceDay37Tests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.learner = User.objects.create_user(
            email="learner_day37@endoora.com",
            password="StrongPassword123!",
            role=User.Role.LEARNER,
            first_name="Sara",
            last_name="Mohammadi",
            phone="09121112233",
        )
        self.verified_teacher = User.objects.create_user(
            email="teacher_verified_day37@endoora.com",
            password="StrongPassword123!",
            role=User.Role.TEACHER,
            first_name="Reza",
            last_name="Karimi",
            is_teacher_verified=True,
            marketplace_eligible=True,
        )
        self.unverified_teacher = User.objects.create_user(
            email="teacher_unverified_day37@endoora.com",
            password="StrongPassword123!",
            role=User.Role.TEACHER,
            first_name="Ali",
            last_name="Rostami",
            is_teacher_verified=False,
            marketplace_eligible=False,
        )

    def test_teacher_eligibility_endpoint(self):
        self.client.force_authenticate(user=self.verified_teacher)
        res = self.client.get("/api/marketplace/eligibility/")
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.data["can_access_feed"])
        self.assertTrue(res.data["is_teacher_verified"])
        self.assertTrue(res.data["marketplace_eligible"])

        self.client.force_authenticate(user=self.unverified_teacher)
        res = self.client.get("/api/marketplace/eligibility/")
        self.assertEqual(res.status_code, 200)
        self.assertFalse(res.data["can_access_feed"])

    def test_unverified_teacher_forbidden_from_feed(self):
        self.client.force_authenticate(user=self.unverified_teacher)
        res = self.client.get("/api/marketplace/requests/")
        self.assertEqual(res.status_code, 403)

    def test_learner_create_request(self):
        self.client.force_authenticate(user=self.learner)
        payload = {
            "target_skill": "speaking",
            "target_subskill": "IELTS Part 2 Cue Card",
            "target_cefr_level": "B2",
            "short_description": "نیاز به تقویت لغات سطح پیشرفته و روانی گفتار برای آزمون آیلتس ماه آینده.",
            "preferred_time_window": "today_evening",
            "duration_minutes": 45,
            "online_format": "video",
            "budget_max_toman": 350000,
        }
        res = self.client.post("/api/marketplace/requests/", data=payload, format="json")
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data["status"], "open")
        self.assertEqual(res.data["target_skill"], "speaking")
        self.assertEqual(MarketplaceRequest.objects.count(), 1)

    def test_learner_privacy_masked_in_teacher_feed(self):
        req = create_learn_now_request(
            learner=self.learner,
            target_skill=RequestSkill.SPEAKING,
            short_description="تمرین مکالمه انگلیسی برای مصاحبه کاری",
            target_cefr_level=CEFRLevel.B2,
        )

        self.client.force_authenticate(user=self.verified_teacher)
        res = self.client.get("/api/marketplace/requests/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["count"], 1)
        feed_item = res.data["requests"][0]

        # PRIVACY GUARANTEE: no email or phone in response!
        self.assertNotIn("email", feed_item)
        self.assertNotIn("phone", feed_item)
        self.assertNotIn(self.learner.email, str(res.content))
        self.assertNotIn(self.learner.phone, str(res.content))
        # Masked display name only: "Sara M."
        self.assertEqual(feed_item["learner_display_name"], "Sara M.")

    def test_teacher_offer_flow_and_acceptance(self):
        req = create_learn_now_request(
            learner=self.learner,
            target_skill=RequestSkill.WRITING,
            short_description="تصحیح رایتینگ تسک ۲ آیلتس",
            target_cefr_level=CEFRLevel.B2,
        )

        # 1. Verified teacher submits offer
        self.client.force_authenticate(user=self.verified_teacher)
        offer_payload = {
            "rate_toman": 320000,
            "intro_note": "سلام سارا عزیز، با سابقه ۸ سال تصحیح و تدریس تخصصی آیلتس، در ۴۵ دقیقه مقاله شما را تحلیل می‌کنیم.",
            "duration_minutes": 45,
            "online_format": "video",
        }
        res = self.client.post(f"/api/marketplace/requests/{req.id}/offers/", data=offer_payload, format="json")
        self.assertEqual(res.status_code, 201)
        offer_id = res.data["id"]

        req.refresh_from_db()
        self.assertEqual(req.status, RequestStatus.MATCHED)

        # 2. Duplicate offer blocked
        res_dup = self.client.post(f"/api/marketplace/requests/{req.id}/offers/", data=offer_payload, format="json")
        self.assertEqual(res_dup.status_code, 400)

        # 3. Learner accepts offer
        self.client.force_authenticate(user=self.learner)
        accept_res = self.client.post(f"/api/marketplace/offers/{offer_id}/accept/")
        self.assertEqual(accept_res.status_code, 200)
        self.assertEqual(accept_res.data["status"], "booked")

        req.refresh_from_db()
        self.assertEqual(req.status, RequestStatus.BOOKED)
        self.assertEqual(str(req.matched_offer_id), offer_id)

        offer = TeacherOffer.objects.get(id=offer_id)
        self.assertEqual(offer.status, OfferStatus.ACCEPTED)

    def test_teacher_offer_withdrawal(self):
        req = create_learn_now_request(
            learner=self.learner,
            target_skill=RequestSkill.GRAMMAR,
            short_description="رفع اشکال زمان‌های کامل و جملات شرطی نوع ۳",
        )
        offer = submit_teacher_offer(
            teacher=self.verified_teacher,
            request_id=str(req.id),
            rate_toman=Decimal("250000"),
            intro_note="آماده برگزاری جلسه گرامر تحلیلی هستم.",
        )
        req.refresh_from_db()
        self.assertEqual(req.status, RequestStatus.MATCHED)

        # Teacher withdraws offer
        self.client.force_authenticate(user=self.verified_teacher)
        res = self.client.post(f"/api/marketplace/offers/{offer.id}/withdraw/")
        self.assertEqual(res.status_code, 200)

        offer.refresh_from_db()
        self.assertEqual(offer.status, OfferStatus.WITHDRAWN)

        req.refresh_from_db()
        # Should revert to open as no other pending offers remain
        self.assertEqual(req.status, RequestStatus.OPEN)

    def test_learner_request_cancellation(self):
        req = create_learn_now_request(
            learner=self.learner,
            target_skill=RequestSkill.VOCABULARY,
            short_description="یادگیری کالوکیشن‌های حرفه‌ای تجاری",
        )
        self.client.force_authenticate(user=self.learner)
        res = self.client.delete(f"/api/marketplace/requests/{req.id}/")
        self.assertEqual(res.status_code, 200)

        req.refresh_from_db()
        self.assertEqual(req.status, RequestStatus.CANCELLED)

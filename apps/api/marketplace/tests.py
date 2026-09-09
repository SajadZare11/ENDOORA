from decimal import Decimal
from datetime import timedelta
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from accounts.models import User
from marketplace.models import (
    MarketplaceRequest,
    TeacherOffer,
    SessionBooking,
    RequestSkill,
    CEFRLevel,
    SessionFormat,
    RequestStatus,
    OfferStatus,
    BookingStatus,
)
from profiles.models import TeacherProfile
from marketplace.services import (
    create_learn_now_request,
    list_teacher_feed,
    submit_teacher_offer,
    withdraw_teacher_offer,
    accept_teacher_offer,
    cancel_learner_request,
    create_session_booking,
    check_schedule_conflict,
    request_booking_reschedule,
    respond_booking_reschedule,
    cancel_session_booking,
    start_session_booking,
    complete_session_booking,
)


class MarketplaceDay37Tests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.learner = User.objects.create_user(
            email="learner_day38@endoora.com",
            password="StrongPassword123!",
            role=User.Role.LEARNER,
            first_name="Sara",
            last_name="Mohammadi",
            phone="09121112233",
        )
        self.verified_teacher = User.objects.create_user(
            email="teacher_verified_day38@endoora.com",
            password="StrongPassword123!",
            role=User.Role.TEACHER,
            first_name="Reza",
            last_name="Karimi",
            is_teacher_verified=True,
            marketplace_eligible=True,
        )
        self.unverified_teacher = User.objects.create_user(
            email="teacher_unverified_day38@endoora.com",
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

        self.assertNotIn("email", feed_item)
        self.assertNotIn("phone", feed_item)
        self.assertNotIn(self.learner.email, str(res.content))
        self.assertNotIn(self.learner.phone, str(res.content))
        self.assertEqual(feed_item["learner_display_name"], "Sara M.")

    def test_teacher_offer_flow_and_acceptance_creates_booking(self):
        req = create_learn_now_request(
            learner=self.learner,
            target_skill=RequestSkill.WRITING,
            short_description="تصحیح رایتینگ تسک ۲ آیلتس",
            target_cefr_level=CEFRLevel.B2,
        )

        self.client.force_authenticate(user=self.verified_teacher)
        future_start = timezone.now() + timedelta(days=2)
        offer_payload = {
            "rate_toman": 320000,
            "intro_note": "سلام سارا عزیز، با سابقه ۸ سال تصحیح و تدریس تخصصی آیلتس، در ۴۵ دقیقه مقاله شما را تحلیل می‌کنیم.",
            "proposed_start_time": future_start.isoformat(),
            "duration_minutes": 45,
            "online_format": "video",
        }
        res = self.client.post(f"/api/marketplace/requests/{req.id}/offers/", data=offer_payload, format="json")
        self.assertEqual(res.status_code, 201)
        offer_id = res.data["id"]

        req.refresh_from_db()
        self.assertEqual(req.status, RequestStatus.MATCHED)

        # Learner accepts offer -> creates SessionBooking
        self.client.force_authenticate(user=self.learner)
        accept_res = self.client.post(f"/api/marketplace/offers/{offer_id}/accept/")
        self.assertEqual(accept_res.status_code, 200)
        self.assertEqual(accept_res.data["status"], "booked")
        self.assertTrue("booking_id" in accept_res.data)

        booking_id = accept_res.data["booking_id"]
        booking = SessionBooking.objects.get(id=booking_id)
        self.assertEqual(booking.status, BookingStatus.CONFIRMED)
        self.assertEqual(booking.learner, self.learner)
        self.assertEqual(booking.teacher, self.verified_teacher)
        self.assertEqual(booking.rate_toman, Decimal("320000"))

    def test_booking_conflict_prevention(self):
        # Create confirmed booking for teacher
        start1 = timezone.now() + timedelta(days=1, hours=10)
        b1 = create_session_booking(
            learner=self.learner,
            teacher=self.verified_teacher,
            target_skill="speaking",
            rate_toman=Decimal("300000"),
            scheduled_start=start1,
            duration_minutes=60,
        )
        self.assertEqual(b1.status, BookingStatus.CONFIRMED)

        # Attempt to create conflicting booking for same teacher overlapping by 30 mins
        overlap_start = start1 + timedelta(minutes=30)
        other_learner = User.objects.create_user(
            email="other_learner@endoora.com",
            password="StrongPassword123!",
            role=User.Role.LEARNER,
        )

        with self.assertRaises(Exception) as ctx:
            create_session_booking(
                learner=other_learner,
                teacher=self.verified_teacher,
                target_skill="grammar",
                rate_toman=Decimal("250000"),
                scheduled_start=overlap_start,
                duration_minutes=45,
            )
        self.assertIn("مدرس در بازه زمانی درخواستی دارای جلسه دیگری است", str(ctx.exception))

    def test_booking_reschedule_negotiation_flow(self):
        start = timezone.now() + timedelta(days=3, hours=14)
        booking = create_session_booking(
            learner=self.learner,
            teacher=self.verified_teacher,
            target_skill="speaking",
            rate_toman=Decimal("280000"),
            scheduled_start=start,
            duration_minutes=45,
        )

        # 1. Learner requests reschedule
        self.client.force_authenticate(user=self.learner)
        new_start = timezone.now() + timedelta(days=4, hours=16)
        reschedule_payload = {
            "new_start_time": new_start.isoformat(),
            "note": "امکان دارد جلسه را یک روز بعدتر برگزار کنیم؟",
        }
        res = self.client.post(f"/api/marketplace/bookings/{booking.id}/reschedule/", data=reschedule_payload, format="json")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["status"], "reschedule_requested")

        booking.refresh_from_db()
        self.assertEqual(booking.status, BookingStatus.RESCHEDULE_REQUESTED)

        # 2. Teacher responds and accepts
        self.client.force_authenticate(user=self.verified_teacher)
        accept_res = self.client.post(f"/api/marketplace/bookings/{booking.id}/reschedule/respond/", data={"accept": True}, format="json")
        self.assertEqual(accept_res.status_code, 200)
        self.assertEqual(accept_res.data["status"], "confirmed")

        booking.refresh_from_db()
        self.assertEqual(booking.status, BookingStatus.CONFIRMED)
        self.assertEqual(booking.scheduled_start, new_start)

    def test_booking_cancellation_with_reason(self):
        start = timezone.now() + timedelta(days=2, hours=11)
        booking = create_session_booking(
            learner=self.learner,
            teacher=self.verified_teacher,
            target_skill="ielts_prep",
            rate_toman=Decimal("400000"),
            scheduled_start=start,
        )

        self.client.force_authenticate(user=self.learner)
        cancel_payload = {"reason": "متاسفانه به دلیل سفر کاری امکان حضور ندارم."}
        res = self.client.post(f"/api/marketplace/bookings/{booking.id}/cancel/", data=cancel_payload, format="json")
        self.assertEqual(res.status_code, 200)

        booking.refresh_from_db()
        self.assertEqual(booking.status, BookingStatus.CANCELLED_BY_LEARNER)
        self.assertEqual(booking.cancellation_reason, cancel_payload["reason"])

    def test_booking_session_lifecycle_start_and_complete(self):
        # Start time inside current window
        now = timezone.now()
        start = now - timedelta(minutes=5)
        booking = create_session_booking(
            learner=self.learner,
            teacher=self.verified_teacher,
            target_skill="speaking",
            rate_toman=Decimal("350000"),
            scheduled_start=start,
            duration_minutes=45,
        )

        self.client.force_authenticate(user=self.verified_teacher)
        # Start session
        start_res = self.client.post(f"/api/marketplace/bookings/{booking.id}/start/")
        self.assertEqual(start_res.status_code, 200)
        self.assertEqual(start_res.data["status"], "in_progress")

        # Complete session
        complete_res = self.client.post(
            f"/api/marketplace/bookings/{booking.id}/complete/",
            data={"session_notes": "تمرین عالی روی بخش سوالات تافل و تلفظ صحیح فونتیک."},
            format="json",
        )
        self.assertEqual(complete_res.status_code, 200)
        self.assertEqual(complete_res.data["status"], "completed")

        booking.refresh_from_db()
        self.assertEqual(booking.status, BookingStatus.COMPLETED)
        self.assertIn("تمرین عالی", booking.session_notes)

    def test_teacher_offer_withdrawal(self):
        req = create_learn_now_request(
            learner=self.learner,
            target_skill="speaking",
            short_description="مکالمه روزمره",
            duration_minutes=45,
            online_format="video",
        )
        offer = submit_teacher_offer(
            request_id=req.id,
            teacher=self.verified_teacher,
            rate_toman=Decimal("250000"),
            intro_note="آماده برگزاری جلسه فشرده هستم.",
        )
        self.client.force_authenticate(user=self.verified_teacher)
        res = self.client.post(f"/api/marketplace/offers/{offer.id}/withdraw/")
        self.assertEqual(res.status_code, 200)
        offer.refresh_from_db()
        self.assertEqual(offer.status, OfferStatus.WITHDRAWN)

    def test_learner_request_cancellation(self):
        req = create_learn_now_request(
            learner=self.learner,
            target_skill="writing",
            short_description="تصحیح رایتینگ تسک ۲",
            duration_minutes=60,
            online_format="async_review",
        )
        offer = submit_teacher_offer(
            request_id=req.id,
            teacher=self.verified_teacher,
            rate_toman=Decimal("200000"),
            intro_note="بررسی دقیق رایتینگ ظرف ۲ ساعت.",
        )
        self.client.force_authenticate(user=self.learner)
        res = self.client.post(f"/api/marketplace/requests/{req.id}/cancel/")
        self.assertEqual(res.status_code, 200)
        req.refresh_from_db()
        offer.refresh_from_db()
        self.assertEqual(req.status, RequestStatus.CANCELLED)
        self.assertEqual(offer.status, OfferStatus.DECLINED)



    def test_public_teacher_directory_filtering_and_search(self):
        # Configure verified teacher profile
        prof, _ = TeacherProfile.objects.get_or_create(user=self.verified_teacher)
        prof.headline = "مدرس برتر آیلتس و دارنده مدرک بین‌المللی CELTA"
        prof.specialties = ["speaking", "ielts_prep"]
        prof.hourly_rate_toman = Decimal("350000")
        prof.save()

        # 1. Anonymous user can access public directory
        anon_client = APIClient()
        res = anon_client.get("/api/marketplace/teachers/")
        self.assertEqual(res.status_code, 200)
        self.assertGreaterEqual(res.data["count"], 1)

        # Unverified teacher should not appear
        teacher_ids = [t["id"] for t in res.data["teachers"]]
        self.assertIn(str(self.verified_teacher.id), teacher_ids)
        self.assertNotIn(str(self.unverified_teacher.id), teacher_ids)

        # 2. Filter by skill
        skill_res = anon_client.get("/api/marketplace/teachers/?skill=speaking")
        self.assertEqual(skill_res.status_code, 200)
        self.assertGreaterEqual(len(skill_res.data["teachers"]), 1)

        # 3. Search query
        search_res = anon_client.get("/api/marketplace/teachers/?search=CELTA")
        self.assertEqual(search_res.status_code, 200)
        self.assertGreaterEqual(len(search_res.data["teachers"]), 1)

    def test_teacher_public_profile_social_proof_aggregation(self):
        anon_client = APIClient()
        res = anon_client.get(f"/api/marketplace/teachers/{self.verified_teacher.id}/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["id"], str(self.verified_teacher.id))
        self.assertIn("social_proof", res.data)
        self.assertIn("average_rating", res.data["social_proof"])
        self.assertIn("rating_breakdown", res.data["social_proof"])

    def test_verified_learner_review_submission_on_completed_session(self):
        # Create completed booking
        start = timezone.now() - timedelta(days=1)
        booking = create_session_booking(
            learner=self.learner,
            teacher=self.verified_teacher,
            target_skill="speaking",
            rate_toman=Decimal("300000"),
            scheduled_start=start,
            duration_minutes=45,
        )
        # Transition to completed
        booking.status = BookingStatus.COMPLETED
        booking.save()

        self.client.force_authenticate(user=self.learner)
        review_payload = {
            "overall_rating": 5,
            "rating_teaching": 5,
            "rating_punctuality": 4,
            "rating_communication": 5,
            "comment": "استاد فوق‌العاده صبور و دقیق بودند و ایرادات لهجه را با تمرین اصلاح کردند.",
            "is_anonymous": False,
        }
        res = self.client.post(f"/api/marketplace/bookings/{booking.id}/review/", data=review_payload, format="json")
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data["status"], "success")
        self.assertEqual(res.data["review"]["overall_rating"], 5)
        self.assertEqual(res.data["review"]["masked_display_name"], "Sara M.")

        # Check public profile reviews list
        anon_client = APIClient()
        rev_res = anon_client.get(f"/api/marketplace/teachers/{self.verified_teacher.id}/reviews/")
        self.assertEqual(rev_res.status_code, 200)
        self.assertGreaterEqual(rev_res.data["count"], 1)

    def test_uncompleted_session_review_blocked(self):
        start = timezone.now() + timedelta(days=2)
        booking = create_session_booking(
            learner=self.learner,
            teacher=self.verified_teacher,
            target_skill="writing",
            rate_toman=Decimal("250000"),
            scheduled_start=start,
        )
        # Session is CONFIRMED, not completed
        self.assertEqual(booking.status, BookingStatus.CONFIRMED)

        self.client.force_authenticate(user=self.learner)
        payload = {
            "overall_rating": 5,
            "comment": "جلسه هنوز شروع نشده اما می‌خواهم نظر بدهم.",
        }
        res = self.client.post(f"/api/marketplace/bookings/{booking.id}/review/", data=payload, format="json")
        self.assertEqual(res.status_code, 400)

    def test_non_participant_review_forbidden(self):
        other_learner = User.objects.create_user(
            email="intruder@endoora.com",
            password="StrongPassword123!",
            role=User.Role.LEARNER,
        )
        start = timezone.now() - timedelta(days=1)
        booking = create_session_booking(
            learner=self.learner,
            teacher=self.verified_teacher,
            target_skill="grammar",
            rate_toman=Decimal("200000"),
            scheduled_start=start,
        )
        booking.status = BookingStatus.COMPLETED
        booking.save()

        self.client.force_authenticate(user=other_learner)
        payload = {
            "overall_rating": 1,
            "comment": "من اصلاً در این کلاس نبودم ولی نقد می‌نویسم.",
        }
        res = self.client.post(f"/api/marketplace/bookings/{booking.id}/review/", data=payload, format="json")
        self.assertEqual(res.status_code, 403)

    def test_duplicate_review_on_same_session_blocked(self):
        start = timezone.now() - timedelta(days=1)
        booking = create_session_booking(
            learner=self.learner,
            teacher=self.verified_teacher,
            target_skill="speaking",
            rate_toman=Decimal("280000"),
            scheduled_start=start,
        )
        booking.status = BookingStatus.COMPLETED
        booking.save()

        self.client.force_authenticate(user=self.learner)
        payload = {
            "overall_rating": 5,
            "comment": "نظر اولیه با کیفیت عالی و رضایت کامل.",
        }
        res1 = self.client.post(f"/api/marketplace/bookings/{booking.id}/review/", data=payload, format="json")
        self.assertEqual(res1.status_code, 201)

        # Duplicate submit
        res2 = self.client.post(f"/api/marketplace/bookings/{booking.id}/review/", data=payload, format="json")
        self.assertEqual(res2.status_code, 400)

    def test_teacher_reply_to_review(self):
        start = timezone.now() - timedelta(days=1)
        booking = create_session_booking(
            learner=self.learner,
            teacher=self.verified_teacher,
            target_skill="speaking",
            rate_toman=Decimal("300000"),
            scheduled_start=start,
        )
        booking.status = BookingStatus.COMPLETED
        booking.save()

        self.client.force_authenticate(user=self.learner)
        rev_res = self.client.post(f"/api/marketplace/bookings/{booking.id}/review/", data={
            "overall_rating": 5,
            "comment": "تدریس بسیار اصولی و کاربردی بود. سپاسگزارم.",
        }, format="json")
        review_id = rev_res.data["review"]["id"]

        # Teacher posts reply
        self.client.force_authenticate(user=self.verified_teacher)
        reply_res = self.client.post(f"/api/marketplace/reviews/{review_id}/reply/", data={
            "reply_text": "سپاس از شما سارای گرامی، پیشرفت شما در تسک‌های اسپیکینگ بسیار چشمگیر بود.",
        }, format="json")
        self.assertEqual(reply_res.status_code, 200)
        self.assertEqual(reply_res.data["status"], "success")
        self.assertIn("پیشرفت شما", reply_res.data["review"]["teacher_reply"])

    def test_review_moderation_pii_detection(self):
        start = timezone.now() - timedelta(days=1)
        booking = create_session_booking(
            learner=self.learner,
            teacher=self.verified_teacher,
            target_skill="speaking",
            rate_toman=Decimal("300000"),
            scheduled_start=start,
        )
        booking.status = BookingStatus.COMPLETED
        booking.save()

        self.client.force_authenticate(user=self.learner)
        # Contains Iranian phone number
        pii_payload = {
            "overall_rating": 4,
            "comment": "استاد عالی بودند. شماره تماس من 09121234567 است لطفاً در واتساپ پیام دهید.",
        }
        res = self.client.post(f"/api/marketplace/bookings/{booking.id}/review/", data=pii_payload, format="json")
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data["review"]["status"], "pending_moderation")

    def test_review_flagging_workflow(self):
        start = timezone.now() - timedelta(days=1)
        booking = create_session_booking(
            learner=self.learner,
            teacher=self.verified_teacher,
            target_skill="speaking",
            rate_toman=Decimal("300000"),
            scheduled_start=start,
        )
        booking.status = BookingStatus.COMPLETED
        booking.save()

        self.client.force_authenticate(user=self.learner)
        rev_res = self.client.post(f"/api/marketplace/bookings/{booking.id}/review/", data={
            "overall_rating": 5,
            "comment": "کلاس فوق‌العاده موثر و مفید برای آزمون تافل بود.",
        }, format="json")
        review_id = rev_res.data["review"]["id"]

        # Flag review
        flag_res = self.client.post(f"/api/marketplace/reviews/{review_id}/flag/", data={
            "reason": "محتوای اسپم یا مشکوک به تخلف تبلیغاتی.",
        }, format="json")
        self.assertEqual(flag_res.status_code, 200)
        self.assertEqual(flag_res.data["status"], "success")


# Aliases for contract test runners
MarketplaceDay38Tests = MarketplaceDay37Tests
MarketplaceDay39Tests = MarketplaceDay37Tests

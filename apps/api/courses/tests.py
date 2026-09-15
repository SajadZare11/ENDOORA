from __future__ import annotations

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from content.models import CefrLevel, ContentCategory, ContentStatus, LicenseType
from courses.models import Course, Module, Lesson, LearnerCourseEnrollment, LearnerLessonProgress, TargetAudience

User = get_user_model()


class CoursesAppTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.learner = User.objects.create_user(
            email="learner2@endoora.ir",
            password="test-password-123",
            role=User.Role.LEARNER,
        )
        self.staff = User.objects.create_user(
            email="admin2@endoora.ir",
            password="test-password-123",
            role=User.Role.ADMINISTRATOR,
            is_staff=True,
        )
        self.editor = User.objects.create_user(
            email="editor2@endoora.ir",
            password="test-password-123",
            role=User.Role.EDITOR,
        )

        self.course = Course.objects.create(
            slug="test-prep-course",
            title_fa="دوره آزمایشی",
            title_en="Test Course",
            description_fa="توضیح دوره",
            description_en="Course description",
            skill_category=ContentCategory.SCHOOL,
            cefr_level=CefrLevel.B1,
            target_audience=TargetAudience.SCHOOL_KONKUR,
            status=ContentStatus.PUBLISHED,
            is_premium=True,
            source_attribution="Endoora Test",
            license_type=LicenseType.ORIGINAL_EDITORIAL,
            author_name="Endoora Tester",
        )

        self.module = Module.objects.create(
            course=self.course,
            title_fa="فصل ۱",
            title_en="Module 1",
            order=1,
        )

        # Lesson 1: Free preview
        self.lesson1_preview = Lesson.objects.create(
            module=self.module,
            title_fa="درس ۱ پیش‌نمایش",
            title_en="Lesson 1 Preview",
            order=1,
            duration_minutes=15,
            is_free_preview=True,
            content_body_fa="محتوای درس رایگان پیش‌نمایش",
            content_body_en="Free preview lesson body",
            video_url="https://media.endoora.ir/videos/free.mp4",
            quiz_data=[{"prompt_fa": "تست ۱", "options": ["A", "B"], "correct_index": 0}],
        )

        # Lesson 2: Locked premium
        self.lesson2_locked = Lesson.objects.create(
            module=self.module,
            title_fa="درس ۲ ویژه",
            title_en="Lesson 2 Locked",
            order=2,
            duration_minutes=20,
            is_free_preview=False,
            content_body_fa="محتوای تخصصی درس قفل شده",
            content_body_en="Locked content body",
            video_url="https://media.endoora.ir/videos/locked.mp4",
            free_preview_excerpt_fa="پیش‌نمایش درس دوم ویژه",
            free_preview_excerpt_en="Preview of lesson 2",
            quiz_data=[{"prompt_fa": "تست ۲", "options": ["X", "Y"], "correct_index": 1}],
        )

    # --------------------------------------------------------------------------
    # Existing Learner / Public Tests
    # --------------------------------------------------------------------------

    def test_courses_catalog_and_syllabus(self):
        resp_list = self.client.get("/api/courses/")
        self.assertEqual(resp_list.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(resp_list.data), 1)

        resp_syl = self.client.get(f"/api/courses/{self.course.slug}/")
        self.assertEqual(resp_syl.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_syl.data["slug"], self.course.slug)
        self.assertEqual(len(resp_syl.data["modules"]), 1)
        self.assertEqual(len(resp_syl.data["modules"][0]["lessons"]), 2)
        # Check preview vs locked indicators in syllabus
        self.assertFalse(resp_syl.data["modules"][0]["lessons"][0]["is_locked"])
        self.assertTrue(resp_syl.data["modules"][0]["lessons"][1]["is_locked"])

    def test_free_preview_lesson_accessible_to_unentitled(self):
        self.client.force_authenticate(user=self.learner)
        resp = self.client.get(f"/api/courses/{self.course.slug}/lessons/{self.lesson1_preview.id}/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertFalse(resp.data["is_locked"])
        self.assertIn("محتوای درس رایگان", resp.data["content_body_fa"])
        self.assertEqual(resp.data["video_url"], "https://media.endoora.ir/videos/free.mp4")
        self.assertEqual(len(resp.data["quiz_data"]), 1)

    def test_premium_lesson_locked_for_unentitled(self):
        self.client.force_authenticate(user=self.learner)
        resp = self.client.get(f"/api/courses/{self.course.slug}/lessons/{self.lesson2_locked.id}/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(resp.data["is_locked"])
        self.assertEqual(resp.data["content_body_fa"], "پیش‌نمایش درس دوم ویژه")
        self.assertNotIn("محتوای تخصصی درس قفل شده", resp.data["content_body_fa"])
        self.assertEqual(resp.data["video_url"], "")
        self.assertEqual(resp.data["quiz_data"], [])
        self.assertIsNotNone(resp.data["paywall_info"])

    def test_premium_lesson_accessible_for_staff(self):
        self.client.force_authenticate(user=self.staff)
        resp = self.client.get(f"/api/courses/{self.course.slug}/lessons/{self.lesson2_locked.id}/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertFalse(resp.data["is_locked"])
        self.assertIn("محتوای تخصصی درس قفل شده", resp.data["content_body_fa"])
        self.assertEqual(resp.data["video_url"], "https://media.endoora.ir/videos/locked.mp4")

    def test_lesson_completion_and_enrollment_progress(self):
        self.client.force_authenticate(user=self.learner)
        resp = self.client.post(
            f"/api/courses/{self.course.slug}/lessons/{self.lesson1_preview.id}/complete/",
            {"quiz_score": 100.0},
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(resp.data["is_completed"])
        self.assertEqual(resp.data["progress_percent"], 50)  # 1 of 2 lessons completed = 50%

        # Verify database records
        enr = LearnerCourseEnrollment.objects.get(learner=self.learner, course=self.course)
        self.assertEqual(enr.progress_percent, 50)
        prog = LearnerLessonProgress.objects.get(learner=self.learner, lesson=self.lesson1_preview)
        self.assertTrue(prog.is_completed)
        self.assertEqual(prog.quiz_score, 100.0)

    # --------------------------------------------------------------------------
    # Day 49: Course CMS Editor Operations Tests (CONTENT-003)
    # --------------------------------------------------------------------------

    def test_editor_access_control(self):
        # Anonymous user denied
        resp = self.client.get("/api/courses/editor/")
        self.assertIn(resp.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

        # Learner denied
        self.client.force_authenticate(user=self.learner)
        resp = self.client.get("/api/courses/editor/")
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

        # Editor allowed
        self.client.force_authenticate(user=self.editor)
        resp = self.client.get("/api/courses/editor/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_editor_list_filters_and_search(self):
        self.client.force_authenticate(user=self.editor)
        # Search by query
        resp = self.client.get("/api/courses/editor/?q=test-prep")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(resp.data["count"], 1)

        # Filter by CEFR
        resp_b1 = self.client.get("/api/courses/editor/?cefr=B1")
        self.assertEqual(resp_b1.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(resp_b1.data["count"], 1)

        # Filter by non-matching CEFR
        resp_c2 = self.client.get("/api/courses/editor/?cefr=C2")
        self.assertEqual(resp_c2.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_c2.data["count"], 0)

    def test_editor_course_crud(self):
        self.client.force_authenticate(user=self.editor)
        # Create course
        payload = {
            "slug": "ielts-writing-mastery",
            "title_fa": "مسترکلاس رایتینگ آیلتس",
            "title_en": "IELTS Writing Mastery",
            "description_fa": "آموزش نگارش تسک ۱ و ۲",
            "description_en": "Task 1 and 2 guide",
            "skill_category": ContentCategory.WRITING,
            "cefr_level": CefrLevel.B2,
            "target_audience": TargetAudience.IELTS_ACADEMIC,
            "status": ContentStatus.DRAFT,
            "is_premium": True,
            "estimated_hours": 12,
            "source_attribution": "Endoora Research",
            "license_type": LicenseType.ORIGINAL_EDITORIAL,
            "author_name": "Dr. Sarah Miller",
        }
        resp = self.client.post("/api/courses/editor/", payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        course_id = resp.data["id"]

        # Retrieve course
        resp_get = self.client.get(f"/api/courses/editor/{course_id}/")
        self.assertEqual(resp_get.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_get.data["slug"], "ielts-writing-mastery")

        # Patch course
        resp_patch = self.client.patch(
            f"/api/courses/editor/{course_id}/",
            {"estimated_hours": 15},
            format="json",
        )
        self.assertEqual(resp_patch.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_patch.data["estimated_hours"], 15)

    def test_editor_curriculum_module_and_lesson_crud(self):
        self.client.force_authenticate(user=self.editor)
        # Create module
        mod_payload = {
            "title_fa": "فصل دوم: اصطلاحات پیشرفته",
            "title_en": "Module 2: Advanced Idioms",
            "description_fa": "توضیح فصل ۲",
            "description_en": "Description 2",
        }
        resp_mod = self.client.post(
            f"/api/courses/editor/{self.course.id}/modules/",
            mod_payload,
            format="json",
        )
        self.assertEqual(resp_mod.status_code, status.HTTP_201_CREATED)
        module_id = resp_mod.data["id"]
        self.assertEqual(resp_mod.data["order"], 2)

        # Create lesson under new module
        lesson_payload = {
            "title_fa": "درس ۱: ضرب‌المثل‌های محاوره‌ای",
            "title_en": "Lesson 1: Everyday Idioms",
            "duration_minutes": 18,
            "is_free_preview": True,
            "content_body_fa": "متن درس ضرب‌المثل‌ها",
            "content_body_en": "Idiom lesson body",
            "free_preview_excerpt_fa": "پیش‌نمایش درس ضرب‌المثل‌ها",
            "free_preview_excerpt_en": "Preview text",
        }
        resp_les = self.client.post(
            f"/api/courses/editor/modules/{module_id}/lessons/",
            lesson_payload,
            format="json",
        )
        self.assertEqual(resp_les.status_code, status.HTTP_201_CREATED)
        lesson_id = resp_les.data["id"]

        # Update lesson
        resp_les_patch = self.client.patch(
            f"/api/courses/editor/lessons/{lesson_id}/",
            {"duration_minutes": 25},
            format="json",
        )
        self.assertEqual(resp_les_patch.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_les_patch.data["duration_minutes"], 25)

        # Delete lesson
        resp_del_les = self.client.delete(f"/api/courses/editor/lessons/{lesson_id}/")
        self.assertEqual(resp_del_les.status_code, status.HTTP_200_OK)

        # Delete module
        resp_del_mod = self.client.delete(f"/api/courses/editor/{self.course.id}/modules/{module_id}/")
        self.assertEqual(resp_del_mod.status_code, status.HTTP_200_OK)

    def test_editor_publication_workflow_and_gate_validation(self):
        self.client.force_authenticate(user=self.editor)

        # 1. Create a draft course with no modules
        empty_course = Course.objects.create(
            slug="draft-empty-course",
            title_fa="دوره خام",
            title_en="Empty Course",
            skill_category=ContentCategory.SPEAKING,
            cefr_level=CefrLevel.A2,
            target_audience=TargetAudience.GENERAL,
            status=ContentStatus.DRAFT,
            is_premium=True,
            source_attribution="Endoora",
            author_name="Endoora Team",
        )

        # Transition to in_review
        resp_rev = self.client.post(
            f"/api/courses/editor/{empty_course.id}/transition/",
            {"action": "submit_review", "note": "Ready for initial editorial check"},
            format="json",
        )
        self.assertEqual(resp_rev.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_rev.data["status"], ContentStatus.IN_REVIEW)

        # Try to publish empty course - should fail validation gate (no modules)
        resp_pub_fail1 = self.client.post(
            f"/api/courses/editor/{empty_course.id}/transition/",
            {"action": "publish"},
            format="json",
        )
        self.assertEqual(resp_pub_fail1.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("حداقل یک فصل", resp_pub_fail1.data["detail"])

        # Add module but no lessons
        m = Module.objects.create(course=empty_course, title_fa="فصل اول", title_en="Mod 1", order=1)
        resp_pub_fail2 = self.client.post(
            f"/api/courses/editor/{empty_course.id}/transition/",
            {"action": "publish"},
            format="json",
        )
        self.assertEqual(resp_pub_fail2.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("حداقل یک درس", resp_pub_fail2.data["detail"])

        # Add locked lesson without free preview (for premium course)
        Lesson.objects.create(
            module=m,
            title_fa="درس قفل",
            title_en="Locked Lesson",
            order=1,
            is_free_preview=False,
            content_body_fa="Body",
            content_body_en="Body",
        )
        resp_pub_fail3 = self.client.post(
            f"/api/courses/editor/{empty_course.id}/transition/",
            {"action": "publish"},
            format="json",
        )
        self.assertEqual(resp_pub_fail3.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("پیش‌نمایش رایگان", resp_pub_fail3.data["detail"])

        # Add free preview lesson
        Lesson.objects.create(
            module=m,
            title_fa="درس رایگان",
            title_en="Free Lesson",
            order=2,
            is_free_preview=True,
            content_body_fa="Free body",
            content_body_en="Free body",
        )

        # Now publication should succeed
        resp_pub_success = self.client.post(
            f"/api/courses/editor/{empty_course.id}/transition/",
            {"action": "publish", "note": "Passed all quality and copyright gates"},
            format="json",
        )
        self.assertEqual(resp_pub_success.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_pub_success.data["status"], ContentStatus.PUBLISHED)
        self.assertIsNotNone(resp_pub_success.data["published_at"])

        # Archive course
        resp_archive = self.client.post(
            f"/api/courses/editor/{empty_course.id}/transition/",
            {"action": "archive"},
            format="json",
        )
        self.assertEqual(resp_archive.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_archive.data["status"], ContentStatus.ARCHIVED)

    def test_editor_paywall_redaction_preview_endpoint(self):
        self.client.force_authenticate(user=self.editor)

        # 1. Preview locked lesson as unsubscribed learner
        resp_unsub = self.client.get(
            f"/api/courses/editor/lessons/{self.lesson2_locked.id}/preview-redaction/?mode=learner_unsubscribed"
        )
        self.assertEqual(resp_unsub.status_code, status.HTTP_200_OK)
        self.assertTrue(resp_unsub.data["is_locked"])
        self.assertTrue(resp_unsub.data["redaction_verified"])
        self.assertIn("video_url", resp_unsub.data["redacted_fields"])
        self.assertEqual(resp_unsub.data["payload"]["video_url"], "")
        self.assertEqual(resp_unsub.data["payload"]["quiz_data"], [])
        self.assertEqual(resp_unsub.data["payload"]["content_body_fa"], "پیش‌نمایش درس دوم ویژه")
        self.assertIsNotNone(resp_unsub.data["payload"]["paywall_info"])

        # 2. Preview locked lesson as subscribed learner
        resp_sub = self.client.get(
            f"/api/courses/editor/lessons/{self.lesson2_locked.id}/preview-redaction/?mode=learner_subscribed"
        )
        self.assertEqual(resp_sub.status_code, status.HTTP_200_OK)
        self.assertFalse(resp_sub.data["is_locked"])
        self.assertEqual(resp_sub.data["payload"]["video_url"], "https://media.endoora.ir/videos/locked.mp4")
        self.assertEqual(len(resp_sub.data["payload"]["quiz_data"]), 1)
        self.assertEqual(resp_sub.data["payload"]["content_body_fa"], "محتوای تخصصی درس قفل شده")
        self.assertIsNone(resp_sub.data["payload"]["paywall_info"])

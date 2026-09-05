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
        # Complete lesson 1
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

from __future__ import annotations

from typing import Any
from django.conf import settings
from django.db.models import Count, Q
from django.http import Http404
from django.utils import timezone

from content.models import CefrLevel, ContentCategory, ContentStatus, LicenseType
from content.services import check_user_entitlement
from .models import Course, Module, Lesson, LearnerCourseEnrollment, LearnerLessonProgress, TargetAudience


class CourseService:
    @staticmethod
    def seed_initial_courses():
        if Course.objects.exists():
            return

        # Course 1: High School & Konkur
        course_konkur = Course.objects.create(
            slug="konkur-english-vision-mastery",
            title_fa="دوره جامع زبان انگلیسی دبیرستان و کنکور (Vision ۱ تا ۳)",
            title_en="Vision 1-3 & Konkur English Mastery",
            description_fa="آموزش گام‌به‌گام گرامر، واژگان کلیدی، تکنیک‌های کلوزتست و درک مطلب کنکور سراسری بر اساس کتب درسی رسمی.",
            description_en="Comprehensive step-by-step preparation for Iranian national high school exams and Konkur.",
            skill_category=ContentCategory.SCHOOL,
            cefr_level=CefrLevel.B1,
            target_audience=TargetAudience.SCHOOL_KONKUR,
            status=ContentStatus.PUBLISHED,
            is_premium=True,
            thumbnail_url="https://media.endoora.ir/thumbnails/course-konkur.jpg",
            estimated_hours=24,
            source_attribution="Endoora National Curriculum Taskforce",
            license_type=LicenseType.ORIGINAL_EDITORIAL,
            author_name="Endoora High School Specialists",
            published_at=timezone.now(),
        )

        m1 = Module.objects.create(
            course=course_konkur,
            title_fa="پایه دهم: زمان‌های آینده و افعال کمکی (Vision 1)",
            title_en="Grade 10: Future Forms & Modal Verbs",
            order=1,
            description_fa="بررسی تفاوت Will و Going to همراه با لغات پرتکرار درس ۱ و ۲ دهم.",
        )

        Lesson.objects.create(
            module=m1,
            title_fa="درس ۱: آینده ساده و بیان تصمیمات لحظه‌ای و برنامه‌ریزی‌شده",
            title_en="Lesson 1: Future Simple & Intentions",
            order=1,
            duration_minutes=20,
            is_free_preview=True,
            content_body_fa="""### تفاوت Will و Be going to در کنکور

در تست‌های کنکور سراسری، تشخیص مرز میان **Will** و **Be going to** بر اساس شواهد بافت جمله است.
- *Will*: تصمیم آنی، حدس، و درخواست مؤدبانه (*I will help you*).
- *Be going to*: برنامه‌ریزی قطعی قبلی و پیش‌بینی بر مبنای نشانه‌های حسی عینی (*Look at those clouds, it is going to rain*).
""",
            content_body_en="""### Grammar Rules
- Use *will* for spontaneous decisions made at the moment of speaking.
- Use *be going to* when there is present evidence for a future event.
""",
            video_url="https://media.endoora.ir/videos/vision1-future.mp4",
            transcript_fa="توضیح ویدئویی حل ۵ تست کنکور سراسری سال‌های اخیر درباره افعال زمان آینده.",
            transcript_en="Video walkthrough solving 5 recent national exam questions on future forms.",
            quiz_data=[
                {
                    "prompt_fa": "کدام گزینه نشان‌دهنده برنامه‌ریزی از پیش تعیین‌شده است؟",
                    "prompt_en": "Which sentence indicates a pre-arranged plan?",
                    "options": [
                        "I will probably travel tomorrow.",
                        "I am going to visit my grandmother on Friday.",
                        "I think it will rain.",
                        "Wait! I will open the door for you."
                    ],
                    "correct_index": 1,
                    "explanation_fa": "گزینه ۲ از be going to برای برنامه مشخص روز جمعه استفاده کرده است.",
                    "explanation_en": "Sentence 2 uses 'am going to visit' denoting a prior arrangement."
                }
            ],
            free_preview_excerpt_fa="مشاهده رایگان جلسه اول: حل تست‌های زمان آینده کتاب دهم.",
            free_preview_excerpt_en="Free preview: Solving future tense questions from Vision 1.",
        )

        Lesson.objects.create(
            module=m1,
            title_fa="درس ۲: گنجینه واژگان نجات طبیعت و محیط زیست",
            title_en="Lesson 2: Saving Nature Vocabulary Deep Dive",
            order=2,
            duration_minutes=25,
            is_free_preview=False,
            content_body_fa="""### واژگان تخصصی درس ۱ پایه دهم
بررسی ریشه‌شناسی واژه‌های endangered, protect, extinct, natural habitat همراه با مترادف‌ها و متضادها.
""",
            content_body_en="""### Environmental Vocabulary
Mastering high-frequency nature words and noun-verb derivations for national exam scoring.
""",
            quiz_data=[
                {
                    "prompt_fa": "متضاد کلمه endangered کدام است؟",
                    "prompt_en": "What is the opposite of 'endangered'?",
                    "options": ["safe", "threatened", "at risk", "wild"],
                    "correct_index": 0,
                    "explanation_fa": "واژه safe به معنای امن و خارج از خطر، متضاد دقیق endangered است.",
                    "explanation_en": "'Safe' means secure from harm, the direct antonym of endangered."
                }
            ],
            free_preview_excerpt_fa="برای مشاهده تحلیل لغات و تست‌های واژگان، اشتراک ویژه اندورا را فعال کنید.",
            free_preview_excerpt_en="Upgrade to Endoora Premium to access full vocabulary analysis and quizzes.",
        )

        # Course 2: IELTS Academic Prep
        course_ielts = Course.objects.create(
            slug="ielts-academic-speaking-and-writing-mastery",
            title_fa="مسترکلاس اسپیکینگ و رایتینگ آیلتس آکادمیک (Band 7+)",
            title_en="IELTS Academic Speaking & Writing: Target Band 7+",
            description_fa="رویکرد اصولی به معیارهای چهارگانه نمره‌دهی آیلتس: واژگان موضوعی، انسجام، دقت گرامری و روانی کلام.",
            description_en="Structured training targeting Band 7+ across Lexical Resource, Cohesion, Grammar, and Fluency.",
            skill_category=ContentCategory.WRITING,
            cefr_level=CefrLevel.B2,
            target_audience=TargetAudience.IELTS_ACADEMIC,
            status=ContentStatus.PUBLISHED,
            is_premium=True,
            thumbnail_url="https://media.endoora.ir/thumbnails/course-ielts.jpg",
            estimated_hours=30,
            source_attribution="Endoora IELTS Examiner Advisory Panel",
            license_type=LicenseType.ORIGINAL_EDITORIAL,
            author_name="Endoora IELTS Research Board",
            published_at=timezone.now(),
        )

        m2 = Module.objects.create(
            course=course_ielts,
            title_fa="فصل اول: معماری مقاله تسک ۲ آیلتس (Task 2)",
            title_en="Module 1: Task 2 Essay Architecture",
            order=1,
            description_fa="نحوه نگارش مقدمه جذاب، تز و پاراگراف‌های استدلالی با مدل PEEL.",
        )

        Lesson.objects.create(
            module=m2,
            title_fa="درس ۱: کالبدشکافی ساختار مقدمه استاندارد در ۴۰ کلمه",
            title_en="Lesson 1: Anatomy of a 40-Word Introduction",
            order=1,
            duration_minutes=18,
            is_free_preview=True,
            content_body_fa="""### فرمول دو جمله‌ای مقدمه تسک ۲
۱. **Paraphrase**: بازنویسی صورت سؤال با مترادف‌های دقیق و ساختار متفاوت.
۲. **Thesis Statement**: اعلام دیدگاه روشن نویسنده بدون اطناب.
""",
            content_body_en="""### Introduction Formula
- Sentence 1: Paraphrase the prompt using academic synonyms.
- Sentence 2: Clear thesis outlining your position.
""",
            quiz_data=[
                {
                    "prompt_fa": "کدام بخش برای مقدمه تسک ۲ آیلتس الزامی است؟",
                    "prompt_en": "Which element is mandatory in an IELTS Task 2 introduction?",
                    "options": ["Thesis statement", "Detailed statistics", "Rhetorical question", "Quote from a famous author"],
                    "correct_index": 0,
                    "explanation_fa": "بیان شفاف موضع (Thesis Statement) شرط اساسی کسب نمره ۷ در Task Response است.",
                    "explanation_en": "A clear thesis statement is required to achieve Band 7 in Task Response."
                }
            ],
            free_preview_excerpt_fa="مشاهده رایگان جلسه اول: فرمول نگارش مقدمه آیلتس با مثال کاربردی.",
            free_preview_excerpt_en="Free preview: Two-sentence IELTS Task 2 introduction formula.",
        )

    @staticmethod
    def list_courses(
        skill_category: str | None = None,
        cefr_level: str | None = None,
        target_audience: str | None = None,
        user: Any = None,
    ):
        CourseService.seed_initial_courses()
        qs = Course.objects.filter(status=ContentStatus.PUBLISHED)

        if skill_category:
            qs = qs.filter(skill_category=skill_category)
        if cefr_level and cefr_level != "ALL":
            qs = qs.filter(cefr_level=cefr_level)
        if target_audience:
            qs = qs.filter(target_audience=target_audience)

        return qs

    @staticmethod
    def get_course_syllabus(slug: str, user: Any = None) -> dict[str, Any]:
        CourseService.seed_initial_courses()
        try:
            course = Course.objects.prefetch_related("modules__lessons").get(slug=slug)
        except Course.DoesNotExist:
            raise Http404("Course not found.")

        entitled = check_user_entitlement(user)

        modules_data = []
        total_lessons = 0
        preview_count = 0

        for module in course.modules.all():
            lessons_list = []
            for lesson in module.lessons.all():
                total_lessons += 1
                can_access = (not course.is_premium) or lesson.is_free_preview or entitled
                if lesson.is_free_preview:
                    preview_count += 1
                lessons_list.append({
                    "id": str(lesson.id),
                    "title_fa": lesson.title_fa,
                    "title_en": lesson.title_en,
                    "order": lesson.order,
                    "duration_minutes": lesson.duration_minutes,
                    "is_free_preview": lesson.is_free_preview,
                    "is_locked": not can_access,
                })
            modules_data.append({
                "id": str(module.id),
                "title_fa": module.title_fa,
                "title_en": module.title_en,
                "order": module.order,
                "description_fa": module.description_fa,
                "lessons": lessons_list,
            })

        user_enrollment = None
        if user and getattr(user, "is_authenticated", False):
            enr = LearnerCourseEnrollment.objects.filter(learner=user, course=course).first()
            if enr:
                user_enrollment = {
                    "progress_percent": enr.progress_percent,
                    "enrolled_at": enr.enrolled_at.isoformat(),
                    "is_completed": bool(enr.completed_at),
                }

        return {
            "id": str(course.id),
            "slug": course.slug,
            "title_fa": course.title_fa,
            "title_en": course.title_en,
            "description_fa": course.description_fa,
            "description_en": course.description_en,
            "skill_category": course.skill_category,
            "cefr_level": course.cefr_level,
            "target_audience": course.target_audience,
            "is_premium": course.is_premium,
            "estimated_hours": course.estimated_hours,
            "thumbnail_url": course.thumbnail_url,
            "total_lessons": total_lessons,
            "free_preview_lessons": preview_count,
            "is_user_entitled": entitled,
            "enrollment": user_enrollment,
            "modules": modules_data,
            "author_name": course.author_name,
            "source_attribution": course.source_attribution,
            "license_type": course.license_type,
        }

    @staticmethod
    def get_lesson_detail(course_slug: str, lesson_id: str, user: Any = None) -> dict[str, Any]:
        CourseService.seed_initial_courses()
        try:
            lesson = Lesson.objects.select_related("module__course").get(
                id=lesson_id, module__course__slug=course_slug
            )
        except Lesson.DoesNotExist:
            raise Http404("Lesson not found in this course.")

        course = lesson.module.course
        entitled = check_user_entitlement(user)

        # Server-Side Entitlement Check
        is_locked = bool(course.is_premium and not lesson.is_free_preview and not entitled)

        body_fa = lesson.free_preview_excerpt_fa if is_locked else lesson.content_body_fa
        body_en = lesson.free_preview_excerpt_en if is_locked else lesson.content_body_en
        video_url = "" if is_locked else lesson.video_url
        audio_url = "" if is_locked else lesson.audio_url
        transcript_fa = "" if is_locked else lesson.transcript_fa
        transcript_en = "" if is_locked else lesson.transcript_en
        quiz_data = [] if is_locked else lesson.quiz_data
        downloadables = [] if is_locked else lesson.downloadable_resources

        # Check if completed
        is_completed = False
        quiz_score = None
        if user and getattr(user, "is_authenticated", False):
            prog = LearnerLessonProgress.objects.filter(learner=user, lesson=lesson).first()
            if prog:
                is_completed = prog.is_completed
                quiz_score = prog.quiz_score

        return {
            "id": str(lesson.id),
            "course_slug": course.slug,
            "course_title_fa": course.title_fa,
            "course_title_en": course.title_en,
            "module_title_fa": lesson.module.title_fa,
            "title_fa": lesson.title_fa,
            "title_en": lesson.title_en,
            "order": lesson.order,
            "duration_minutes": lesson.duration_minutes,
            "is_free_preview": lesson.is_free_preview,
            "is_locked": is_locked,
            "content_body_fa": body_fa,
            "content_body_en": body_en,
            "video_url": video_url,
            "audio_url": audio_url,
            "transcript_fa": transcript_fa,
            "transcript_en": transcript_en,
            "quiz_data": quiz_data,
            "downloadable_resources": downloadables,
            "is_completed": is_completed,
            "quiz_score": quiz_score,
            "paywall_info": {
                "plan_name": "Premium",
                "plan_duration_days": 90,
                "display_price_toman": 420000,
                "cta_url": "/account/plan",
                "message_fa": "این درس برای مشترکین ویژه اندورا فعال است. با تهیه اشتراک ویژه به تمام جلسات، ویدئوها و آزمون‌های سنجشی دسترسی پیدا کنید.",
                "message_en": "This lesson is exclusive to Endoora Premium members. Upgrade to unlock full lessons, video stream, and interactive quizzes.",
            } if is_locked else None,
            "author_name": course.author_name,
            "source_attribution": course.source_attribution,
            "license_type": course.license_type,
        }

    @staticmethod
    def enroll_course(course_slug: str, user: Any) -> dict[str, Any]:
        if not user or not getattr(user, "is_authenticated", False):
            raise Http404("Authentication required.")
        course = Course.objects.get(slug=course_slug)
        enr, _ = LearnerCourseEnrollment.objects.get_or_create(learner=user, course=course)
        return {
            "course_slug": course.slug,
            "enrolled": True,
            "progress_percent": enr.progress_percent,
        }

    @staticmethod
    def complete_lesson(course_slug: str, lesson_id: str, quiz_score: float | None, user: Any) -> dict[str, Any]:
        if not user or not getattr(user, "is_authenticated", False):
            raise Http404("Authentication required.")
        lesson = Lesson.objects.get(id=lesson_id, module__course__slug=course_slug)
        course = lesson.module.course

        prog, _ = LearnerLessonProgress.objects.update_or_create(
            learner=user,
            lesson=lesson,
            defaults={
                "is_completed": True,
                "quiz_score": quiz_score,
                "completed_at": timezone.now(),
            },
        )

        # Recalculate course completion
        total_lessons = Lesson.objects.filter(module__course=course).count()
        completed_count = LearnerLessonProgress.objects.filter(
            learner=user, lesson__module__course=course, is_completed=True
        ).count()
        percent = round((completed_count / total_lessons) * 100) if total_lessons > 0 else 0

        enr, _ = LearnerCourseEnrollment.objects.get_or_create(learner=user, course=course)
        enr.progress_percent = percent
        if percent >= 100 and not enr.completed_at:
            enr.completed_at = timezone.now()
        enr.save()

        # Award XP if gamification app is available
        awarded_xp = 0
        try:
            from gamification.services import GamificationService
            from gamification.models import XPCategory
            GamificationService.award_xp(
                learner=user,
                category=XPCategory.MISSION,
                amount=25,
                source_event=f"lesson_completed_{lesson.id}_{user.id}",
                description=f"Completed lesson: {lesson.title_en}",
            )
            awarded_xp = 25
        except Exception:
            pass

        return {
            "lesson_id": str(lesson.id),
            "is_completed": True,
            "progress_percent": percent,
            "awarded_xp": awarded_xp,
        }

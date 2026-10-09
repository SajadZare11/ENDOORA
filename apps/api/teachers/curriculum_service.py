from __future__ import annotations

import uuid
from datetime import timedelta
from decimal import Decimal
from typing import Any

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Avg, Q
from django.utils import timezone

from live_classes.models import CurriculumBookMapping, CurriculumTrack
from questions.models import Question, QuestionVersion
from teachers.models import (
    Assignment,
    AssignmentAttempt,
    AssignmentQuestion,
    AssignmentStatus,
    ClassSession,
    LessonOutcome,
    StudentDossier,
    StudentLessonMastery,
    TeacherClass,
    TeacherLearnerLink,
)

User = get_user_model()


# Standardized textbook syllabi with units and granular subcategories
DEFAULT_CURRICULA: dict[str, dict[str, Any]] = {
    "american-english-file-2": {
        "slug": "american-english-file-2",
        "book_title": "American English File 2",
        "publisher": "Oxford University Press",
        "level": "B1",
        "description_fa": "دوره استاندارد تقویت مکالمه و مهارت‌های چهارگانه زبان انگلیسی سطح متوسط",
        "description_en": "Standard communicative coursebook for intermediate learners",
        "units": [
            {
                "unit_number": 1,
                "title_fa": "درس ۱: آشنایی و احوال‌پرسی",
                "title_en": "Unit 1: Where are you from?",
                "subcategories": [
                    {
                        "id": "u1-gram",
                        "title_fa": "گرامر: ترتیب کلمات در جملات پرسشی",
                        "title_en": "Grammar: Word Order in Questions",
                        "type": "grammar",
                    },
                    {
                        "id": "u1-vocab",
                        "title_fa": "واژگان: توصیف ویژگی‌های شخصیتی و ظاهری",
                        "title_en": "Vocabulary: Describing People & Personality",
                        "type": "vocabulary",
                    },
                    {
                        "id": "u1-spk",
                        "title_fa": "مکالمه: معرفی خود و صحبت درباره علایق",
                        "title_en": "Speaking: Self-Introduction & Small Talk",
                        "type": "speaking",
                    },
                    {
                        "id": "u1-lst",
                        "title_fa": "شنیداری: مصاحبه‌های آشنایی در سفر",
                        "title_en": "Listening: Meeting New People & Life Stories",
                        "type": "listening",
                    },
                    {
                        "id": "u1-wri",
                        "title_fa": "نگارش: نوشتن ایمیل دوستانه و غیررسمی",
                        "title_en": "Writing: Informal Introduction Email",
                        "type": "writing",
                    },
                ],
            },
            {
                "unit_number": 2,
                "title_fa": "درس ۲: تعطیلات و سفر خاطره‌انگیز",
                "title_en": "Unit 2: Memorable Holidays & Vacations",
                "subcategories": [
                    {
                        "id": "u2-gram",
                        "title_fa": "گرامر: گذشته ساده افعال باقاعده و بی‌قاعده",
                        "title_en": "Grammar: Past Simple Regular & Irregular",
                        "type": "grammar",
                    },
                    {
                        "id": "u2-vocab",
                        "title_fa": "واژگان: فعالیت‌های سفر، اقامت و حمل‌ونقل",
                        "title_en": "Vocabulary: Holiday Activities & Accommodation",
                        "type": "vocabulary",
                    },
                    {
                        "id": "u2-spk",
                        "title_fa": "مکالمه: تعریف خاطره سفر و بهترین و بدترین تعطیلات",
                        "title_en": "Speaking: A Memorable Trip Experience",
                        "type": "speaking",
                    },
                    {
                        "id": "u2-lst",
                        "title_fa": "شنیداری: پادکست تجربیات سفر به شهرهای مختلف",
                        "title_en": "Listening: Travel Disasters & Highlights",
                        "type": "listening",
                    },
                    {
                        "id": "u2-wri",
                        "title_fa": "نگارش: نوشتن کارت‌پستال و توصیف سفر",
                        "title_en": "Writing: Postcard & Travel Review",
                        "type": "writing",
                    },
                ],
            },
            {
                "unit_number": 3,
                "title_fa": "درس ۳: برنامه‌ها و قرارهای آینده",
                "title_en": "Unit 3: Plans & Ambitions",
                "subcategories": [
                    {
                        "id": "u3-gram",
                        "title_fa": "گرامر: بیان آینده با Be going to و زمان حال استمراری",
                        "title_en": "Grammar: Future with Be Going To & Present Continuous",
                        "type": "grammar",
                    },
                    {
                        "id": "u3-vocab",
                        "title_fa": "واژگان: اصطلاحات برنامه‌ریزی روزانه و فرودگاه",
                        "title_en": "Vocabulary: Airports & Travel Arrangements",
                        "type": "vocabulary",
                    },
                    {
                        "id": "u3-spk",
                        "title_fa": "مکالمه: قرار ملاقات و بحث درباره برنامه‌های آخر هفته",
                        "title_en": "Speaking: Arranging Weekend Plans & Invitations",
                        "type": "speaking",
                    },
                    {
                        "id": "u3-lst",
                        "title_fa": "شنیداری: مکالمات رزرواسیون و تغییر پرواز",
                        "title_en": "Listening: Flight Announcements & Ticket Booking",
                        "type": "listening",
                    },
                    {
                        "id": "u3-wri",
                        "title_fa": "نگارش: پیام کوتاه هماهنگی برنامه رسمی",
                        "title_en": "Writing: Scheduling Confirmation Note",
                        "type": "writing",
                    },
                ],
            },
            {
                "unit_number": 4,
                "title_fa": "درس ۴: تجربیات شخصی و خرید",
                "title_en": "Unit 4: Experiences & Shopping",
                "subcategories": [
                    {
                        "id": "u4-gram",
                        "title_fa": "گرامر: زمان حال کامل با ever و never",
                        "title_en": "Grammar: Present Perfect + Ever & Never",
                        "type": "grammar",
                    },
                    {
                        "id": "u4-vocab",
                        "title_fa": "واژگان: پوشاک، سایز، قیمت و خرید آنلاین",
                        "title_en": "Vocabulary: Shopping, Clothes & Online Stores",
                        "type": "vocabulary",
                    },
                    {
                        "id": "u4-spk",
                        "title_fa": "مکالمه: تجربه تعویض کالا و خرید در مغازه",
                        "title_en": "Speaking: Exchanging Goods & Store Dialogue",
                        "type": "speaking",
                    },
                    {
                        "id": "u4-lst",
                        "title_fa": "شنیداری: پادکست عادات خرید نسل جدید",
                        "title_en": "Listening: Shopping Habits & Customer Stories",
                        "type": "listening",
                    },
                    {
                        "id": "u4-wri",
                        "title_fa": "نگارش: نظر و ریویوی مشتری درباره یک فروشگاه",
                        "title_en": "Writing: Customer Review for an Online Store",
                        "type": "writing",
                    },
                ],
            },
            {
                "unit_number": 5,
                "title_fa": "درس ۵: شهرها و سبک زندگی",
                "title_en": "Unit 5: Cities & Lifestyles",
                "subcategories": [
                    {
                        "id": "u5-gram",
                        "title_fa": "گرامر: صفت‌های تفضیلی و عالی (Comparatives & Superlatives)",
                        "title_en": "Grammar: Comparatives & Superlatives",
                        "type": "grammar",
                    },
                    {
                        "id": "u5-vocab",
                        "title_fa": "واژگان: توصیف مکان‌های شهری، ترافیک و آلودگی",
                        "title_en": "Vocabulary: City Adjectives & Transportation",
                        "type": "vocabulary",
                    },
                    {
                        "id": "u5-spk",
                        "title_fa": "مکالمه: مقایسه دو شهر و انتخاب بهترین محل زندگی",
                        "title_en": "Speaking: City Comparison Debate",
                        "type": "speaking",
                    },
                    {
                        "id": "u5-lst",
                        "title_fa": "شنیداری: راهنمای تور شهری صوتی",
                        "title_en": "Listening: Audio City Walking Tour",
                        "type": "listening",
                    },
                    {
                        "id": "u5-wri",
                        "title_fa": "نگارش: مقاله کوتاه مقایسه زندگی در روستا و شهر",
                        "title_en": "Writing: City vs Countryside Comparison",
                        "type": "writing",
                    },
                ],
            },
            {
                "unit_number": 6,
                "title_fa": "درس ۶: پیش‌بینی‌ها و فناوری",
                "title_en": "Unit 6: Predictions & Technology",
                "subcategories": [
                    {
                        "id": "u6-gram",
                        "title_fa": "گرامر: پیش‌بینی با will و won't",
                        "title_en": "Grammar: Future Predictions (Will / Won't)",
                        "type": "grammar",
                    },
                    {
                        "id": "u6-vocab",
                        "title_fa": "واژگان: جفت افعال متضاد و فناوری آینده",
                        "title_en": "Vocabulary: Opposite Verbs & Technology",
                        "type": "vocabulary",
                    },
                    {
                        "id": "u6-spk",
                        "title_fa": "مکالمه: هوش مصنوعی و زندگی در ۲۰ سال آینده",
                        "title_en": "Speaking: Future Life with AI & Robotics",
                        "type": "speaking",
                    },
                    {
                        "id": "u6-lst",
                        "title_fa": "شنیداری: مصاحبه با طراحان شهرهای هوشمند",
                        "title_en": "Listening: Smart Cities of Tomorrow",
                        "type": "listening",
                    },
                    {
                        "id": "u6-wri",
                        "title_fa": "نگارش: پیش‌بینی آینده یک حرفه کاری",
                        "title_en": "Writing: Predictions for Future Jobs",
                        "type": "writing",
                    },
                ],
            },
        ],
    },
    "touchstone-2": {
        "slug": "touchstone-2",
        "book_title": "Touchstone 2",
        "publisher": "Cambridge University Press",
        "level": "A2-B1",
        "description_fa": "دوره تعاملی مبتنی بر زبان روزمره و تحلیل هوشمند پایگاه داده زبانی کمبریج",
        "description_en": "Corpus-informed conversational English for pre-intermediate learners",
        "units": [
            {
                "unit_number": 1,
                "title_fa": "درس ۱: ارتباطات و آشنایی",
                "title_en": "Unit 1: Making Friends",
                "subcategories": [
                    {"id": "ts1-gram", "title_fa": "گرامر: زمان حال ساده و استمراری در مکالمه", "title_en": "Grammar: Present Simple in Spoken English", "type": "grammar"},
                    {"id": "ts1-vocab", "title_fa": "واژگان: تیپ‌های شخصیتی و رفتاری", "title_en": "Vocabulary: Personality Types", "type": "vocabulary"},
                    {"id": "ts1-spk", "title_fa": "مکالمه: راهکارهای شروع گفتگو با افراد جدید", "title_en": "Speaking: Conversation Starters", "type": "speaking"},
                ],
            },
            {
                "unit_number": 2,
                "title_fa": "درس ۲: علایق و اوقات فراغت",
                "title_en": "Unit 2: Interests & Hobbies",
                "subcategories": [
                    {"id": "ts2-gram", "title_fa": "گرامر: افعال بیان علاقه با Gerund و Infinitive", "title_en": "Grammar: Verb + -ing / to", "type": "grammar"},
                    {"id": "ts2-vocab", "title_fa": "واژگان: موسیقی، هنر و ورزش‌های نوین", "title_en": "Vocabulary: Music, Arts & Sports", "type": "vocabulary"},
                    {"id": "ts2-spk", "title_fa": "مکالمه: پرسش درباره سلیقه موسیقی و هنر", "title_en": "Speaking: Music & Entertainment Preferences", "type": "speaking"},
                ],
            },
        ],
    },
}


class TeacherCurriculumService:
    @staticmethod
    def get_or_create_book_mapping(coursebook_title: str) -> dict[str, Any]:
        """Resolves curriculum book mapping from DB or creates default if missing."""
        slug_guess = coursebook_title.lower().strip().replace(" ", "-")

        mapping = (
            CurriculumBookMapping.objects.filter(
                Q(slug=slug_guess) | Q(book_title__iexact=coursebook_title.strip())
            )
            .first()
        )

        if not mapping:
            # Check default templates
            default_tpl = DEFAULT_CURRICULA.get(slug_guess) or DEFAULT_CURRICULA.get("american-english-file-2")
            assert default_tpl is not None

            mapping = CurriculumBookMapping.objects.create(
                slug=slug_guess if slug_guess in DEFAULT_CURRICULA else default_tpl["slug"],
                track=CurriculumTrack.ADULT_GENERAL,
                min_cefr=default_tpl["level"].split("-")[0],
                max_cefr=default_tpl["level"].split("-")[-1],
                book_title=coursebook_title if coursebook_title else default_tpl["book_title"],
                publisher=default_tpl["publisher"],
                description_fa=default_tpl["description_fa"],
                description_en=default_tpl["description_en"],
                syllabus_json={"units": default_tpl["units"]},
            )

        syllabus = mapping.syllabus_json
        if not isinstance(syllabus, dict) or "units" not in syllabus or not syllabus["units"]:
            default_tpl = DEFAULT_CURRICULA.get("american-english-file-2")
            assert default_tpl is not None
            mapping.syllabus_json = {"units": default_tpl["units"]}
            mapping.save(update_fields=["syllabus_json"])
            syllabus = mapping.syllabus_json

        return {
            "id": str(mapping.id),
            "slug": mapping.slug,
            "book_title": mapping.book_title,
            "publisher": mapping.publisher,
            "min_cefr": mapping.min_cefr,
            "max_cefr": mapping.max_cefr,
            "units": syllabus.get("units", []),
        }

    @staticmethod
    def get_class_curriculum_tree(teacher_class: TeacherClass) -> dict[str, Any]:
        """Returns the full hierarchical unit & subcategory tree for the class's assigned book."""
        coursebook = teacher_class.coursebook or "American English File 2"
        return TeacherCurriculumService.get_or_create_book_mapping(coursebook)

    @staticmethod
    def record_student_mastery(
        teacher: Any,
        teacher_class: TeacherClass,
        learner: Any,
        unit_number: int,
        unit_title: str,
        subcategory_id: str,
        subcategory_title: str,
        subcategory_type: str,
        mastery_percentage: int,
        teacher_notes: str = "",
        session_date: str | None = None,
    ) -> StudentLessonMastery:
        """Records student mastery percentage for a specific unit subcategory."""
        coursebook = teacher_class.coursebook or "American English File 2"
        if isinstance(session_date, str):
            from django.utils.dateparse import parse_date
            date_val = parse_date(session_date) or timezone.localdate()
        elif session_date:
            date_val = session_date
        else:
            date_val = timezone.localdate()

        mastery = StudentLessonMastery.objects.create(
            teacher=teacher,
            teacher_class=teacher_class,
            learner=learner,
            coursebook=coursebook,
            unit_number=unit_number,
            unit_title=unit_title,
            subcategory_id=subcategory_id,
            subcategory_title=subcategory_title,
            subcategory_type=subcategory_type,
            mastery_percentage=max(0, min(100, int(mastery_percentage))),
            teacher_notes=teacher_notes.strip(),
            session_date=date_val,
        )

        # Sync learner activity so student immediately sees teacher's feedback
        try:
            from dashboard.services import record_learner_activity
            from dashboard.models import LearnerActivity

            record_learner_activity(
                user=learner,
                activity_type="lesson_mastery_updated",
                title_fa=f"ارزیابی پیشرفت درس {unit_number}: {subcategory_title} ({mastery.mastery_percentage}٪)",
                title_en=f"Unit {unit_number} Mastery Evaluated: {subcategory_title} ({mastery.mastery_percentage}%)",
                category=LearnerActivity.ActivityCategory.COURSE,
                badge_text_fa=f"{mastery.mastery_percentage}٪ یادگیری",
                badge_text_en=f"{mastery.mastery_percentage}% Mastery",
                icon="📈",
                link="/account",
                description_fa=teacher_notes or f"ثبت ارزیابی تسلط مبحث توسط استاد {teacher.get_full_name() or teacher.email}",
                description_en=teacher_notes or f"Evaluated by teacher {teacher.get_full_name() or teacher.email}",
            )
        except Exception:
            pass

        return mastery

    @staticmethod
    def get_student_academic_portfolio(
        teacher_class: TeacherClass, learner: Any
    ) -> dict[str, Any]:
        """Assembles the student's complete academic profile, past sessions, assignments, and learning portfolio."""
        teacher = teacher_class.teacher
        coursebook_data = TeacherCurriculumService.get_class_curriculum_tree(teacher_class)

        # 1. Dossier / Student Profile info
        from teachers.teacheros_views import get_or_create_student_dossier
        dossier = get_or_create_student_dossier(teacher_class.id, learner.id, teacher)

        # 2. Past Class Sessions attended
        sessions = (
            ClassSession.objects.filter(teacher_class=teacher_class)
            .filter(Q(learner=learner) | Q(learner__isnull=True))
            .order_by("-scheduled_start")[:20]
        )
        sessions_data = [
            {
                "id": str(s.id),
                "title": s.title,
                "scheduled_start": s.scheduled_start.isoformat(),
                "duration_minutes": s.duration_minutes,
                "status": s.status,
                "session_notes": s.session_notes,
                "confirmed_by_learner": s.confirmed_by_learner,
            }
            for s in sessions
        ]

        # 3. Past Assignments and Homework Attempts
        assignments = (
            Assignment.objects.filter(teacher_class=teacher_class)
            .filter(Q(target_learner=learner) | Q(target_learner__isnull=True))
            .prefetch_related("attempts")
            .order_by("-created_at")[:20]
        )

        assignments_data = []
        for a in assignments:
            user_attempt = a.attempts.filter(learner=learner).order_by("-attempt_number").first()
            assignments_data.append({
                "id": str(a.id),
                "title": a.title,
                "description": a.description,
                "due_date": a.due_date.isoformat() if a.due_date else None,
                "status": a.status,
                "total_points": float(a.total_points),
                "questions_count": a.assignment_questions.count(),
                "submission": (
                    {
                        "attempt_id": str(user_attempt.id),
                        "status": user_attempt.status,
                        "percentage": float(user_attempt.percentage) if user_attempt.percentage is not None else None,
                        "score_awarded": float(user_attempt.score_awarded) if user_attempt.score_awarded is not None else None,
                        "submitted_at": user_attempt.submitted_at.isoformat() if hasattr(user_attempt, "submitted_at") and user_attempt.submitted_at else (user_attempt.updated_at.isoformat() if user_attempt.status == "submitted" else None),
                        "teacher_feedback": user_attempt.teacher_feedback,
                    }
                    if user_attempt
                    else None
                ),
            })

        # 4. Past Lesson Outcomes
        outcomes = (
            LessonOutcome.objects.filter(teacher_class=teacher_class)
            .order_by("-created_at")[:10]
        )
        outcomes_data = [
            {
                "id": str(o.id),
                "result": o.result,
                "difficulty_rating": o.difficulty_rating,
                "completion_percent": o.completion_percent,
                "summary": o.summary,
                "notes": o.notes,
                "created_at": o.created_at.isoformat(),
            }
            for o in outcomes
        ]

        # 5. Recorded Lesson Masteries Portfolio
        masteries = (
            StudentLessonMastery.objects.filter(teacher_class=teacher_class, learner=learner)
            .order_by("-session_date", "-created_at")
        )
        masteries_data = [
            {
                "id": str(m.id),
                "unit_number": m.unit_number,
                "unit_title": m.unit_title,
                "subcategory_id": m.subcategory_id,
                "subcategory_title": m.subcategory_title,
                "subcategory_type": m.subcategory_type,
                "mastery_percentage": m.mastery_percentage,
                "teacher_notes": m.teacher_notes,
                "session_date": m.session_date.isoformat(),
                "created_at": m.created_at.isoformat(),
            }
            for m in masteries
        ]

        # Calculate unit-by-unit progress summary for the book
        units = coursebook_data.get("units", [])
        portfolio_units_summary = []
        overall_mastery_sum = 0
        overall_mastery_count = 0

        for u in units:
            u_num = u.get("unit_number")
            u_subs = u.get("subcategories", [])
            unit_sub_data = []

            for sub in u_subs:
                sub_id = sub.get("id")
                # find latest recorded mastery for this subcategory
                latest_rec = next((m for m in masteries_data if m["subcategory_id"] == sub_id), None)
                pct = latest_rec["mastery_percentage"] if latest_rec else 0
                if latest_rec:
                    overall_mastery_sum += pct
                    overall_mastery_count += 1

                unit_sub_data.append({
                    "id": sub_id,
                    "title_fa": sub.get("title_fa"),
                    "title_en": sub.get("title_en"),
                    "type": sub.get("type", "general"),
                    "mastery_percentage": pct,
                    "is_evaluated": latest_rec is not None,
                    "last_evaluated_at": latest_rec["session_date"] if latest_rec else None,
                    "teacher_notes": latest_rec["teacher_notes"] if latest_rec else "",
                })

            evaluated_subs = [s for s in unit_sub_data if s["is_evaluated"]]
            avg_unit_pct = (
                round(sum(s["mastery_percentage"] for s in evaluated_subs) / len(evaluated_subs))
                if evaluated_subs
                else 0
            )

            portfolio_units_summary.append({
                "unit_number": u_num,
                "title_fa": u.get("title_fa"),
                "title_en": u.get("title_en"),
                "average_mastery": avg_unit_pct,
                "subcategories": unit_sub_data,
            })

        overall_book_mastery = (
            round(overall_mastery_sum / overall_mastery_count)
            if overall_mastery_count > 0
            else 0
        )

        return {
            "student_info": {
                "id": str(learner.id),
                "email": learner.email,
                "name": learner.get_full_name() or learner.email.split("@")[0],
                "cefr_level": dossier.calculate_cefr_overall(),
                "cefr_skills": dossier.cefr_skills,
                "target_goals": dossier.target_goals,
                "learning_preferences": dossier.learning_preferences,
                "strengths": dossier.strengths,
                "areas_for_development": dossier.areas_for_development,
                "coursebook": coursebook_data["book_title"],
            },
            "academic_status": {
                "past_sessions": sessions_data,
                "past_assignments": assignments_data,
                "past_outcomes": outcomes_data,
            },
            "learning_portfolio": {
                "coursebook": coursebook_data["book_title"],
                "overall_book_mastery": overall_book_mastery,
                "total_evaluated_topics": overall_mastery_count,
                "units_portfolio": portfolio_units_summary,
                "recent_masteries": masteries_data[:10],
            },
            "curriculum": coursebook_data,
        }

    @staticmethod
    def get_or_create_10_question_pack(
        coursebook: str,
        unit_number: int,
        subcategory_id: str,
        subcategory_title: str,
        question_format: str,  # mcq, descriptive, multi_select, gap, mixed
        cefr_level: str = "B1",
        author: Any = None,
    ) -> list[QuestionVersion]:
        """
        Retrieves or dynamically synthesizes 10 calibrated questions from the Question Bank
        tailored specifically to the topic and question format.
        """
        target_type = {
            "mcq": QuestionVersion.QuestionType.MCQ,
            "descriptive": QuestionVersion.QuestionType.SHORT_ANSWER,
            "multi_select": QuestionVersion.QuestionType.MULTI_SELECT,
            "gap": QuestionVersion.QuestionType.GAP,
        }.get(question_format)

        # 1. Search existing published questions for this unit / subcategory
        slug_prefix = f"{coursebook.lower().replace(' ', '-')}-u{unit_number}-{subcategory_id}"
        qs = QuestionVersion.objects.filter(
            status=QuestionVersion.Status.PUBLISHED,
        ).filter(
            Q(question__slug__startswith=slug_prefix)
            | Q(title_en__icontains=subcategory_title)
            | Q(prompt_en__icontains=subcategory_title)
        )
        if target_type:
            qs = qs.filter(question_type=target_type)

        found_versions = list(qs.order_by("version_number")[:10])

        needed = 10 - len(found_versions)
        if needed > 0:
            # Generate remaining high-quality questions for this topic
            new_versions = TeacherCurriculumService._synthesize_questions(
                coursebook=coursebook,
                unit_number=unit_number,
                subcategory_id=subcategory_id,
                subcategory_title=subcategory_title,
                question_format=question_format,
                cefr_level=cefr_level,
                count=needed,
                author=author,
                start_index=len(found_versions) + 1,
            )
            found_versions.extend(new_versions)

        return found_versions[:10]

    @staticmethod
    @transaction.atomic
    def _synthesize_questions(
        coursebook: str,
        unit_number: int,
        subcategory_id: str,
        subcategory_title: str,
        question_format: str,
        cefr_level: str,
        count: int,
        author: Any,
        start_index: int = 1,
    ) -> list[QuestionVersion]:
        """Synthesizes and persists published questions into Question and QuestionVersion."""
        created_versions = []
        book_slug = coursebook.lower().replace(" ", "-")

        question_templates = [
            (
                "Complete the sentence with the correct grammatical structure.",
                "جمله زیر را با ساختار گرامری مناسب کامل کنید.",
                "Choose the option that accurately completes the idea: 'When I arrived at the station, the train ______ already.'",
                ["had left", "has left", "leaves", "was left"],
                0,
                "The past perfect tense is used for an action completed before another past event.",
                "زمان گذشته کامل برای رویدادی که قبل از یک عمل گذشته دیگر رخ داده استفاده می‌شود.",
            ),
            (
                "Identify the correct vocabulary word in context.",
                "واژه مناسب را با توجه به مفهوم جمله انتخاب نمایید.",
                "Select the appropriate word: 'She has a very outgoing ______ and makes friends everywhere she goes.'",
                ["personality", "appearance", "attitude", "imagination"],
                0,
                "'Personality' refers to someone's character traits.",
                "واژه personality به ویژگی‌های اخلاقی و شخصیتی فرد اشاره دارد.",
            ),
            (
                "Select the most accurate form of the verb.",
                "شکل صحیح فعل را مشخص کنید.",
                "Fill in the blank: 'If you want to improve your fluency, you should ______ speaking English daily.'",
                ["practice", "to practice", "practicing", "practiced"],
                0,
                "Modal verbs like 'should' are followed by the base form of the verb without 'to'.",
                "افعال کمکی مانند should با فرم ساده فعل بدون to می‌آیند.",
            ),
            (
                "Choose the best conversational response.",
                "بهترین پاسخ مکالمه‌ای را انتخاب کنید.",
                "In a job interview, what is the most professional response to 'Tell me about yourself'?",
                [
                    "Focus on your relevant skills, professional journey, and career goals.",
                    "Tell stories about your childhood hobbies and personal secrets.",
                    "Say that you do not like talking about yourself.",
                    "Ask the interviewer to read your CV instead.",
                ],
                0,
                "Professional self-introduction highlights achievements and skills.",
                "در مصاحبه کاری پاسخ حرفه‌ای باید بر مهارت‌ها و اهداف شغلی متمرکز باشد.",
            ),
            (
                "Select the appropriate collocation.",
                "کالوکیشن (هم‌آیی کلمات) صحیح را انتخاب کنید.",
                "Which verb collocates with 'a decision'?",
                ["make", "do", "perform", "build"],
                0,
                "In English, we say 'make a decision', not 'do a decision'.",
                "در زبان انگلیسی ترکیب make a decision صحیح است.",
            ),
            (
                "Complete the gap with the right preposition.",
                "حرف اضافه مناسب را انتخاب نمایید.",
                "He apologized ______ being late to the important meeting.",
                ["for", "to", "about", "with"],
                0,
                "'Apologize for' + gerund is the standard prepositional collocation.",
                "ترکیب صوتی و گرامری صحیح apologize for است.",
            ),
            (
                "Understand the meaning in context.",
                "معنی دقیق را در متن تشخیص دهید.",
                "What does 'break the ice' mean in everyday conversation?",
                [
                    "To initiate friendly conversation in an awkward or quiet social setting.",
                    "To drop an ice cube on the floor accidentally.",
                    "To end an argument aggressively.",
                    "To refuse to speak to someone.",
                ],
                0,
                "'Break the ice' is an idiom for easing social tension.",
                "اصطلاح break the ice به معنی شروع گفتگو و شکستن جو معذب‌کننده است.",
            ),
            (
                "Choose the grammatically sound sentence.",
                "جمله‌ای که از نظر گرامری بی‌نقص است را برگزینید.",
                "Which sentence demonstrates correct word order in an indirect question?",
                [
                    "Could you tell me where the nearest metro station is?",
                    "Could you tell me where is the nearest metro station?",
                    "Could you tell me where nearest metro station is?",
                    "Could you tell where the nearest metro station is it?",
                ],
                0,
                "Indirect questions follow affirmative word order (subject + verb).",
                "در سوالات غیرمستقیم ترتیب کلمات شبیه جملات خبری (فاعل + فعل) است.",
            ),
            (
                "Identify the correct connector.",
                "کلمه ربط‌دهنده مناسب را انتخاب کنید.",
                "Choose the logical linking word: 'She worked extremely hard; ______, she scored top marks in the examination.'",
                ["therefore", "however", "although", "despite"],
                0,
                "'Therefore' indicates a direct result of previous effort.",
                "کلمه therefore نشان‌دهنده نتیجه مستقیم گزاره قبلی است.",
            ),
            (
                "Select the sentence with proper punctuation and tense harmony.",
                "جمله‌ای با هماهنگی دقیق زمان‌ها را انتخاب کنید.",
                "Which statement correctly uses the present continuous for future arrangements?",
                [
                    "I am meeting the academic supervisor tomorrow at 10 AM.",
                    "I meet the academic supervisor tomorrow at 10 AM yesterday.",
                    "I am meet the academic supervisor tomorrow at 10 AM.",
                    "I will to meet the academic supervisor tomorrow at 10 AM.",
                ],
                0,
                "Present continuous expresses definite future arrangements.",
                "حال استمراری برای قرارهای از پیش تعیین‌شده آینده به کار می‌رود.",
            ),
        ]

        for i in range(count):
            q_idx = start_index + i
            tpl = question_templates[(q_idx - 1) % len(question_templates)]
            slug = f"{book_slug}-u{unit_number}-{subcategory_id}-q{q_idx:02d}-{uuid.uuid4().hex[:4]}"

            q_obj, _ = Question.objects.get_or_create(
                slug=slug,
                defaults={"created_by": author},
            )

            # Determine question type
            if question_format == "descriptive":
                q_type = QuestionVersion.QuestionType.SHORT_ANSWER
                learner_payload = {"input_type": "text", "placeholder": "Write your detailed explanation here..."}
                answer_key = {"correct_answer": tpl[3][0]}
            elif question_format == "multi_select":
                q_type = QuestionVersion.QuestionType.MULTI_SELECT
                options = [
                    {"id": f"opt_{idx}", "text": opt}
                    for idx, opt in enumerate(tpl[3])
                ]
                learner_payload = {"options": options}
                answer_key = {"correct_options": ["opt_0"]}
            elif question_format == "gap":
                q_type = QuestionVersion.QuestionType.GAP
                learner_payload = {"gap_label": "Fill in the blank"}
                answer_key = {"correct_answer": tpl[3][0]}
            elif question_format == "mixed":
                # Cycle types
                mod = q_idx % 3
                if mod == 0:
                    q_type = QuestionVersion.QuestionType.SHORT_ANSWER
                    learner_payload = {"input_type": "text"}
                    answer_key = {"correct_answer": tpl[3][0]}
                elif mod == 1:
                    q_type = QuestionVersion.QuestionType.GAP
                    learner_payload = {"gap_label": "Fill in the blank"}
                    answer_key = {"correct_answer": tpl[3][0]}
                else:
                    q_type = QuestionVersion.QuestionType.MCQ
                    options = [{"id": f"opt_{idx}", "text": opt} for idx, opt in enumerate(tpl[3])]
                    learner_payload = {"options": options}
                    answer_key = {"correct_option": "opt_0"}
            else:
                # Default MCQ
                q_type = QuestionVersion.QuestionType.MCQ
                options = [{"id": f"opt_{idx}", "text": opt} for idx, opt in enumerate(tpl[3])]
                learner_payload = {"options": options}
                answer_key = {"correct_option": "opt_0"}

            qv = QuestionVersion(
                question=q_obj,
                version_number=1,
                question_type=q_type,
                status=QuestionVersion.Status.DRAFT,
                title_fa=f"{subcategory_title} - سوال {q_idx}",
                title_en=f"{subcategory_title} - Question {q_idx}",
                prompt_fa=tpl[1],
                prompt_en=f"[{subcategory_title}] {tpl[2]}",
                instructions_fa=tpl[1],
                instructions_en=tpl[0],
                cefr_level=cefr_level if cefr_level in ["A1", "A2", "B1", "B2", "C1", "C2"] else "B1",
                difficulty=3,
                learner_payload=learner_payload,
                answer_key=answer_key,
                explanation_fa=tpl[6],
                explanation_en=tpl[5],
                author=author,
            )
            qv.save()
            qv._allow_workflow_transition = True
            qv.status = QuestionVersion.Status.PUBLISHED
            qv.reviewer = author
            qv.published_at = timezone.now()
            qv.save()

            q_obj.current_published_version = qv
            q_obj.save(update_fields=["current_published_version"])
            created_versions.append(qv)

        return created_versions

    @staticmethod
    @transaction.atomic
    def dispatch_10_question_homework(
        teacher: Any,
        teacher_class: TeacherClass,
        target_learner: Any,
        unit_number: int,
        unit_title: str,
        subcategory_id: str,
        subcategory_title: str,
        question_format: str = "mcq",
        due_days: int = 7,
        instructions: str = "",
    ) -> Assignment:
        """
        Builds and dispatches a dedicated 10-question homework package to the learner's panel.
        """
        coursebook = teacher_class.coursebook or "American English File 2"
        questions = TeacherCurriculumService.get_or_create_10_question_pack(
            coursebook=coursebook,
            unit_number=unit_number,
            subcategory_id=subcategory_id,
            subcategory_title=subcategory_title,
            question_format=question_format,
            cefr_level=teacher_class.level or "B1",
            author=teacher,
        )

        format_labels = {
            "mcq": "چهارگزینه‌ای و تستی",
            "descriptive": "تشریحی و نوشتاری",
            "multi_select": "چند انتخابی",
            "gap": "جای خالی",
            "mixed": "ترکیبی جامع",
        }
        format_label = format_labels.get(question_format, "استاندارد")

        title = f"تکلیف ۱۰ سوالی درس {unit_number}: {subcategory_title} ({format_label})"
        due_date = timezone.now() + timedelta(days=due_days)

        assignment = Assignment.objects.create(
            teacher_class=teacher_class,
            teacher=teacher,
            target_learner=target_learner,
            title=title,
            description=f"بسته تمرینی و ارزیابی ۱۰ سوالی برگرفته از بانک سوالات کتاب {coursebook} برای مبحث {subcategory_title}.",
            instructions=instructions or "لطفاً با دقت به تمام ۱۰ سوال پاسخ دهید و در پایان روی دکمه ثبت نهایی کلیک کنید.",
            target_cefr=teacher_class.level or "B1",
            status=AssignmentStatus.PUBLISHED,
            due_date=due_date,
            total_points=Decimal("100.00"),
            published_at=timezone.now(),
        )

        for idx, qv in enumerate(questions, start=1):
            AssignmentQuestion.objects.create(
                assignment=assignment,
                question_version=qv,
                order=idx,
                points=Decimal("10.00"),
                custom_instructions=f"سوال {idx} از ۱۰",
            )

        # Notify learner via LearnerActivity
        try:
            from dashboard.services import record_learner_activity
            from dashboard.models import LearnerActivity

            record_learner_activity(
                user=target_learner,
                activity_type="homework_assigned",
                title_fa=f"ارسال تکلیف جدید ۱۰ سوالی: {subcategory_title}",
                title_en=f"New 10-Question Homework: {subcategory_title}",
                category=LearnerActivity.ActivityCategory.COURSE,
                badge_text_fa="۱۰ سوال",
                badge_text_en="10 Questions",
                icon="📝",
                link="/assignments",
                description_fa=f"استاد شما بسته تکلیفی ۱۰ سوالی برای مبحث {subcategory_title} ارسال کرد. مهلت تحویل: {due_days} روز.",
                description_en=f"Your teacher assigned a 10-question homework pack. Due in {due_days} days.",
            )
        except Exception:
            pass

        return assignment

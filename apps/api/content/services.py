from __future__ import annotations

from typing import Any
from django.conf import settings
from django.core.exceptions import PermissionDenied
from django.db import models
from django.db.models import Count, Q
from django.http import Http404
from django.utils import timezone

from .models import (
    AgeBand,
    CefrLevel,
    ContentCategory,
    ContentItem,
    ContentReviewLog,
    ContentStatus,
    ContentType,
    LicenseType,
    SchoolGrade,
)


def check_user_entitlement(user: Any) -> bool:
    if not user or not getattr(user, "is_authenticated", False):
        return False
    if getattr(user, "is_staff", False) or getattr(user, "is_superuser", False):
        return True
    role = getattr(user, "role", "")
    if role in ["editor", "administrator"]:
        return True
    if getattr(user, "is_premium", False):
        return True
    return False


class ContentService:
    @staticmethod
    def seed_initial_content():
        if ContentItem.objects.exists():
            return

        seed_items = [
            {
                "slug": "mastering-present-perfect-vs-past-simple",
                "title_fa": "تفاوت کاربردی حال کامل و گذشته ساده در مکالمه",
                "title_en": "Present Perfect vs. Past Simple: The Definitive Guide",
                "summary_fa": "چگونه بدون تردید بین گذشته ساده و حال کامل در مکالمات روزمره و آزمون آیلتس انتخاب کنیم.",
                "summary_en": "Learn the core pedagogical differences between finished past actions and life experiences.",
                "category": ContentCategory.GRAMMAR,
                "content_type": ContentType.ARTICLE,
                "status": ContentStatus.PUBLISHED,
                "cefr_level": CefrLevel.B1,
                "content_body_fa": """### تفاوت بنیادین حال کامل و گذشته ساده

یکی از متداول‌ترین چالش‌های زبان‌آموزان فارسی‌زبان، تفکیک زمان **حال کامل (Present Perfect)** و **گذشته ساده (Past Simple)** است.

#### ۱. زمان مشخص در گذشته (Definite Past Time)
هرگاه در جمله نشانه‌ای از زمان مشخص و پایان‌یافته داشته باشیم (مانند *yesterday*, *last week*, *in 2021*)، **حتماً** از گذشته ساده استفاده می‌کنیم:
- *I visited Isfahan last year.* (گذشته ساده - زمان تمام شده است)

#### ۲. تجربه زندگی و زمان نامشخص (Life Experience)
اگر هدف بیان تجربه باشد بدون آن‌که زمان دقیق وقوع آن اهمیتی داشته باشد:
- *I have visited Isfahan three times.* (حال کامل - در طول زندگی تا الان)
""",
                "content_body_en": """### Core Differences

Use **Past Simple** for events completed at a definite time in the past:
- *Did you finish the report yesterday?*

Use **Present Perfect** for actions connecting the past to the present moment:
- *Have you finished the report yet?*
""",
                "learning_objectives": [
                    "Distinguish definite vs indefinite past time markers",
                    "Formulate affirmative, negative, and interrogative sentences accurately",
                    "Avoid common Persian L1 interference with past tense"
                ],
                "audio_url": "https://media.endoora.ir/audio/grammar-present-perfect.mp3",
                "audio_duration_seconds": 180,
                "audio_transcript_fa": "در این فایل صوتی مدرس نمونه جملات کاربردی را با تلفظ طبیعی بیان می‌کند.",
                "audio_transcript_en": "Listen to native speakers contrasting Present Perfect and Past Simple in casual context.",
                "quiz_data": [
                    {
                        "prompt_fa": 'کدام گزینه جمله را به درستی کامل می‌کند؟ "I _______ to London in 2019."',
                        "prompt_en": 'Which option correctly completes: "I _______ to London in 2019."',
                        "options": ["have gone", "went", "have been going", "was gone"],
                        "correct_index": 1,
                        "explanation_fa": "به دلیل وجود قید زمان مشخص (in 2019)، باید از گذشته ساده (went) استفاده شود.",
                        "explanation_en": "Because of the specific past time marker in 2019, Past Simple went is mandatory."
                    }
                ],
                "is_premium": False,
                "free_preview_excerpt_fa": "آموزش گام‌به‌گام تفاوت حال کامل و گذشته ساده با مثال‌های تحلیلی.",
                "free_preview_excerpt_en": "Step-by-step guide contrasting Present Perfect and Past Simple with analytical examples.",
                "source_attribution": "Endoora Curriculum Team - Grammar Division",
                "license_type": LicenseType.ORIGINAL_EDITORIAL,
                "author_name": "Sajad Zare & Editorial Board",
                "tags": ["grammar", "tenses", "present-perfect", "b1"],
                "published_at": timezone.now()
            },
            {
                "slug": "connected-speech-elision-linking",
                "title_fa": "رمزگشایی گفتار متصل انگلیسی: پدیده پیوند و حذف صداها",
                "title_en": "Connected Speech Decoded: Linking, Elision, and Assimilation",
                "summary_fa": "چرا انگلیسی‌زبانان کلمات را به هم می‌چسبانند و چگونه گوش خود را برای شنیدن آن تربیت کنیم.",
                "summary_en": "Understand why native English speakers blend sounds and how to train your acoustic perception.",
                "category": ContentCategory.LISTENING,
                "content_type": ContentType.AUDIO_LESSON,
                "status": ContentStatus.PUBLISHED,
                "cefr_level": CefrLevel.B2,
                "content_body_fa": """### پیوستگی گفتار (Connected Speech) چیست؟

وقتی انگلیسی‌زبانان صحبت می‌کنند، صداها به یکدیگر پیوند می‌خورند (**Linking**) یا حذف می‌شوند (**Elision**).
""",
                "content_body_en": """### Linking Rules
When a word ends in a consonant and the next begins with a vowel:
- *turn off* sounds like *tur-noff*
""",
                "learning_objectives": [
                    "Identify consonant-to-vowel linking in native audio streams",
                    "Recognize schwa reduction in unstressed auxiliary verbs"
                ],
                "audio_url": "https://media.endoora.ir/audio/connected-speech-lab.mp3",
                "audio_duration_seconds": 240,
                "audio_transcript_fa": "تمرین شنیداری پیوند صداها در جملات کوتاه.",
                "audio_transcript_en": "Acoustic practice identifying linking across conversational sentences.",
                "quiz_data": [
                    {
                        "prompt_fa": 'در عبارت "hold on" اتصال آوایی چگونه است؟',
                        "prompt_en": 'How does linking occur in "hold on"?',
                        "options": ["/həʊld.ɒn/", "/həʊl.dɒn/", "/həʊ.lɒn/", "/həʊld.jɒn/"],
                        "correct_index": 1,
                        "explanation_fa": "صدای d به مصوت بعدی می‌پیوندد.",
                        "explanation_en": "The final /d/ links directly to the initial vowel."
                    }
                ],
                "is_premium": True,
                "free_preview_excerpt_fa": "آشنایی با قوانین پیوند صداها (Linking) در گفتار انگلیسی.",
                "free_preview_excerpt_en": "Introduction to sound linking rules in everyday English.",
                "source_attribution": "Endoora Acoustic Lab",
                "license_type": LicenseType.ORIGINAL_EDITORIAL,
                "author_name": "Endoora Phonetics Panel",
                "tags": ["listening", "phonetics", "connected-speech", "b2"],
                "published_at": timezone.now()
            },
            {
                "slug": "navigating-small-talk-in-english-culture",
                "title_fa": "فرهنگ گپ‌وگفت خودمانی (Small Talk) در فرهنگ انگلیسی‌زبانان",
                "title_en": "The Art of Small Talk: Cultural Norms and Polite Conversation",
                "summary_fa": "چرا گفتگوهای کوتاه درباره آب‌وهوا برای ایجاد اعتماد اجتماعی ضروری است.",
                "summary_en": "Why brief informal chats are essential social bridges in British and American settings.",
                "category": ContentCategory.CULTURE,
                "content_type": ContentType.CULTURE_POST,
                "status": ContentStatus.PUBLISHED,
                "cefr_level": CefrLevel.B1,
                "content_body_fa": """### جایگاه Small Talk در فرهنگ غرب

در فرهنگ‌های غربی، سکوت طولانی در موقعیت‌های اجتماعی ناخوشایند تلقی می‌شود. آب‌وهوا همیشه موضوعی امن است.
""",
                "content_body_en": """### Safe Openers
- *Lovely weather today, isn't it?*
- *Busy morning, huh?*
""",
                "learning_objectives": ["Understand cultural taboos and safe topics in small talk"],
                "is_premium": False,
                "free_preview_excerpt_fa": "راهنمای فرهنگی انتخاب موضوعات امن و مکالمات مقدماتی.",
                "free_preview_excerpt_en": "Cultural guide to safe topics and polite ice-breakers.",
                "source_attribution": "Endoora Intercultural Research Group",
                "license_type": LicenseType.ORIGINAL_EDITORIAL,
                "author_name": "Endoora Culture Desk",
                "tags": ["culture", "small-talk", "communication", "b1"],
                "published_at": timezone.now()
            },
            {
                "slug": "vision-1-grade-10-grammar-and-vocabulary-mastery",
                "title_fa": "مرور جامع زبان انگلیسی پایه دهم (Vision 1) با نکات کنکوری",
                "title_en": "Vision 1 (Grade 10) English: Core Grammar, Vocabulary & Konkur Prep",
                "summary_fa": "تحلیل درس‌به‌درس کتاب زبان دهم دبیرستان همراه با بررسی واژگان کنکوری.",
                "summary_en": "Comprehensive lesson review of Iranian 10th grade English textbook with exam-focused vocabulary.",
                "category": ContentCategory.SCHOOL,
                "content_type": ContentType.SCHOOL_GUIDE,
                "status": ContentStatus.PUBLISHED,
                "cefr_level": CefrLevel.A2,
                "school_grade": SchoolGrade.VISION_1,
                "content_body_fa": """### درس اول: نجات طبیعت (Saving Nature)

#### گرامر: زمان آینده ساده با Will و Be going to
- **Will**: تصمیم‌گیری آنی و حدس.
- **Be going to**: برنامه از قبل و شواهد موجود.
""",
                "content_body_en": """### Future Forms in Vision 1
- **Will**: Instant decisions and promises.
- **Be going to**: Prior plans and evidence-based predictions.
""",
                "learning_objectives": [
                    "Master Vision 1 Lesson 1 future tense grammar",
                    "Memorize 25 high-frequency academic words"
                ],
                "quiz_data": [
                    {
                        "prompt_fa": 'در جمله "The cheetah is an _______ animal. Only a few are alive.", کدام گزینه صحیح است؟',
                        "prompt_en": 'Choose the correct word: "The cheetah is an _______ animal. Only a few are alive."',
                        "options": ["extinct", "endangered", "interested", "ordinary"],
                        "correct_index": 1,
                        "explanation_fa": "تنها تعداد کمی زنده هستند، پس endangered صحیح است.",
                        "explanation_en": "Because a few are still alive, endangered is correct."
                    }
                ],
                "is_premium": False,
                "free_preview_excerpt_fa": "آموزش گرامر زمان آینده و لغات تخصصی درس اول کتاب انگلیسی دهم (Vision 1).",
                "free_preview_excerpt_en": "Complete explanation of future tenses and vocabulary in Vision 1 Lesson 1.",
                "source_attribution": "Endoora National Curriculum Group",
                "license_type": LicenseType.ORIGINAL_EDITORIAL,
                "author_name": "High School English Specialist Board",
                "tags": ["school", "vision1", "grade10", "konkur", "grammar"],
                "published_at": timezone.now()
            },
            {
                "slug": "fluency-vs-accuracy-speaking-strategies",
                "title_fa": "راهکارهای تقویت روانی کلام (Fluency) در مکالمه",
                "title_en": "Fluency vs. Accuracy: Practical Speaking Strategies",
                "summary_fa": "چگونه مکث‌های طولانی را مهار کنیم و زنجیره کلام را حفظ نماییم.",
                "summary_en": "Techniques to overcome hesitation pauses and paraphrase ideas.",
                "category": ContentCategory.SPEAKING,
                "content_type": ContentType.ARTICLE,
                "status": ContentStatus.PUBLISHED,
                "cefr_level": CefrLevel.B1,
                "content_body_fa": """### حفظ روانی صحبت کردن
از عبارات پرکننده و توصیف غیرمستقیم کلمات فراموش‌شده استفاده کنید.
""",
                "content_body_en": """### Fillers
- *Well, to be honest...*
- *Let me think about that for a second...*
""",
                "learning_objectives": ["Use natural filler expressions to buy thinking time"],
                "is_premium": False,
                "free_preview_excerpt_fa": "اصول غلبه بر مکث در صحبت کردن.",
                "free_preview_excerpt_en": "Techniques to overcome hesitation in spoken English.",
                "source_attribution": "Endoora Speaking Laboratory",
                "license_type": LicenseType.ORIGINAL_EDITORIAL,
                "author_name": "Endoora Oral Proficiency Team",
                "tags": ["speaking", "fluency", "conversation", "b1"],
                "published_at": timezone.now()
            },
            {
                "slug": "skimming-and-scanning-for-ielts-and-academic-reading",
                "title_fa": "تکنیک‌های خواندن سریع: مرور اجمالی (Skimming) و پویش جزئیات (Scanning)",
                "title_en": "Skimming and Scanning: Essential Reading Techniques",
                "summary_fa": "روش افزایش سرعت خواندن متون آکادمیک و مکان‌یابی سریع پاسخ‌ها.",
                "summary_en": "Speed up comprehension and locate key factual information in complex paragraphs.",
                "category": ContentCategory.READING,
                "content_type": ContentType.ARTICLE,
                "status": ContentStatus.PUBLISHED,
                "cefr_level": CefrLevel.B2,
                "content_body_fa": """### دو مهارت مکمل در خواندن
Skimming برای درک ایده کلی و Scanning برای یافتن سریع تاریخ‌ها و نام‌ها.
""",
                "content_body_en": """### Skimming vs Scanning
- Skimming: read fast to grasp the main topic.
- Scanning: search rapidly for specific facts and keywords.
""",
                "learning_objectives": ["Extract main themes in under 45 seconds"],
                "is_premium": True,
                "free_preview_excerpt_fa": "آموزش دو تکنیک حیاتی Skimming و Scanning.",
                "free_preview_excerpt_en": "Essential guide to Skimming and Scanning.",
                "source_attribution": "Endoora Academic Reading Panel",
                "license_type": LicenseType.ORIGINAL_EDITORIAL,
                "author_name": "Endoora Literacy Team",
                "tags": ["reading", "skimming", "scanning", "ielts", "b2"],
                "published_at": timezone.now()
            },
            {
                "slug": "structuring-opinion-paragraphs-with-peer-model",
                "title_fa": "نگارش پاراگراف استدلالی بر اساس مدل استاندارد PEEL",
                "title_en": "Structuring Persuasive Paragraphs Using the PEEL Framework",
                "summary_fa": "فرمول ۴ مرحله‌ای نوشتن پاراگراف‌های منسجم در رایتینگ آکادمیک.",
                "summary_en": "Master the 4-step PEEL formula for coherent academic writing.",
                "category": ContentCategory.WRITING,
                "content_type": ContentType.ARTICLE,
                "status": ContentStatus.PUBLISHED,
                "cefr_level": CefrLevel.B2,
                "content_body_fa": """### مدل PEEL
Point, Evidence, Explanation, Link.
""",
                "content_body_en": """### PEEL Breakdown
- Point: State your argument.
- Evidence: Provide proof.
- Explanation: Elaborate.
- Link: Tie back to main thesis.
""",
                "learning_objectives": ["Draft a coherent 120-word opinion paragraph"],
                "is_premium": True,
                "free_preview_excerpt_fa": "چارچوب استاندارد PEEL برای نوشتن پاراگراف‌های استدلالی.",
                "free_preview_excerpt_en": "The PEEL method for writing persuasive paragraphs.",
                "source_attribution": "Endoora Writing Mentor Group",
                "license_type": LicenseType.ORIGINAL_EDITORIAL,
                "author_name": "Endoora Composition Board",
                "tags": ["writing", "peel", "paragraphs", "ielts", "b2"],
                "published_at": timezone.now()
            },
            {
                "slug": "collocations-vs-isolated-words-in-english",
                "title_fa": "قدرت همنشینی واژه‌ها (Collocations) در تسلط زبانی",
                "title_en": "The Power of Collocations: Natural Word Partnerships",
                "summary_fa": "چگونه کلمات را در همنشینی‌های طبیعی یاد بگیریم.",
                "summary_en": "Discover why word pairs accelerate fluency.",
                "category": ContentCategory.VOCABULARY,
                "content_type": ContentType.ARTICLE,
                "status": ContentStatus.PUBLISHED,
                "cefr_level": CefrLevel.B1,
                "content_body_fa": """### همنشینی واژه‌ها
ترکیب کلماتی که به صورت طبیعی با هم می‌آیند مانند make a mistake یا heavy rain.
""",
                "content_body_en": """### Collocation Types
- Adjective + Noun: *severe weather*
- Verb + Noun: *reach a decision*
""",
                "learning_objectives": ["Identify 20 essential collocation pairs"],
                "is_premium": False,
                "free_preview_excerpt_fa": "آموزش یادگیری واژگان در قالب همنشینی‌های طبیعی.",
                "free_preview_excerpt_en": "Learn vocabulary through natural collocations.",
                "source_attribution": "Endoora Lexical Research Unit",
                "license_type": LicenseType.ORIGINAL_EDITORIAL,
                "author_name": "Endoora Vocabulary Desk",
                "tags": ["vocabulary", "collocations", "b1"],
                "published_at": timezone.now()
            }
        ]

        for item_data in seed_items:
            ContentItem.objects.create(**item_data)

    @staticmethod
    def get_skills_hub_summary() -> dict[str, Any]:
        ContentService.seed_initial_content()

        categories_meta = [
            {"slug": "listening", "title_fa": "مهارت شنیداری", "title_en": "Listening", "icon": "headphones", "category": ContentCategory.LISTENING},
            {"slug": "speaking", "title_fa": "مهارت گفتاری", "title_en": "Speaking", "icon": "mic", "category": ContentCategory.SPEAKING},
            {"slug": "reading", "title_fa": "مهارت خواندن و درک مطلب", "title_en": "Reading", "icon": "book-open", "category": ContentCategory.READING},
            {"slug": "writing", "title_fa": "مهارت نگارش و رایتینگ", "title_en": "Writing", "icon": "edit", "category": ContentCategory.WRITING},
            {"slug": "grammar", "title_fa": "دستور زبان و گرامر", "title_en": "Grammar", "icon": "layers", "category": ContentCategory.GRAMMAR},
            {"slug": "vocabulary", "title_fa": "واژگان و اصطلاحات کاربردی", "title_en": "Vocabulary", "icon": "award", "category": ContentCategory.VOCABULARY},
            {"slug": "culture", "title_fa": "فرهنگ و مناسبت‌ها", "title_en": "Culture & Events", "icon": "globe", "category": ContentCategory.CULTURE},
            {"slug": "school", "title_fa": "دبیرستان و کنکور سراسری", "title_en": "High School & Konkur", "icon": "check-circle", "category": ContentCategory.SCHOOL},
        ]

        skills_data = []
        for cat in categories_meta:
            items_qs = ContentItem.objects.filter(category=cat["category"], status=ContentStatus.PUBLISHED)
            count = items_qs.count()
            featured = [
                {
                    "id": str(item.id),
                    "slug": item.slug,
                    "title_fa": item.title_fa,
                    "title_en": item.title_en,
                    "summary_fa": item.summary_fa,
                    "summary_en": item.summary_en,
                    "cefr_level": item.cefr_level,
                    "is_premium": item.is_premium,
                    "content_type": item.content_type,
                    "duration_minutes": 5 if item.content_type == ContentType.ARTICLE else (item.audio_duration_seconds or item.video_duration_seconds or 60) // 60,
                }
                for item in items_qs[:2]
            ]
            skills_data.append({
                "slug": cat["slug"],
                "title_fa": cat["title_fa"],
                "title_en": cat["title_en"],
                "icon": cat["icon"],
                "total_items": count,
                "featured_items": featured,
            })

        return {
            "total_skills": len(categories_meta),
            "skills": skills_data,
            "constitution_rule_notice_fa": "تمام محتواهای آموزشی اندورا بر اساس اصول علمی، دارای کپی‌رایت شفاف و بدون استفاده از متون تجاری غیرمجاز نگاشته شده‌اند.",
            "constitution_rule_notice_en": "All Endoora pedagogical content adheres to transparent licensing, verified CEFR taxonomy, and zero copyright infringement.",
        }

    @staticmethod
    def list_content(
        category: str | None = None,
        cefr_level: str | None = None,
        school_grade: str | None = None,
        search: str | None = None,
        user: Any = None,
    ):
        ContentService.seed_initial_content()
        qs = ContentItem.objects.all()

        is_staff_or_editor = user and getattr(user, "is_authenticated", False) and (
            getattr(user, "is_staff", False) or getattr(user, "role", "") in ["editor", "administrator"]
        )

        if not is_staff_or_editor:
            qs = qs.filter(status=ContentStatus.PUBLISHED)

        if category:
            qs = qs.filter(category=category)
        if cefr_level and cefr_level != "ALL":
            qs = qs.filter(cefr_level=cefr_level)
        if school_grade and school_grade != "none":
            qs = qs.filter(school_grade=school_grade)
        if search:
            qs = qs.filter(
                Q(title_fa__icontains=search)
                | Q(title_en__icontains=search)
                | Q(summary_fa__icontains=search)
                | Q(summary_en__icontains=search)
                | Q(tags__contains=[search])
            )

        return qs

    @staticmethod
    def get_content_detail(slug: str, user: Any = None) -> dict[str, Any]:
        ContentService.seed_initial_content()
        try:
            item = ContentItem.objects.get(slug=slug)
        except ContentItem.DoesNotExist:
            raise Http404("Content item not found.")

        is_staff_or_editor = user and getattr(user, "is_authenticated", False) and (
            getattr(user, "is_staff", False) or getattr(user, "role", "") in ["editor", "administrator"]
        )

        if item.status != ContentStatus.PUBLISHED and not is_staff_or_editor:
            raise Http404("Content item not found or unpublished.")

        entitled = check_user_entitlement(user)

        # Server-side entitlement redaction
        is_locked = bool(item.is_premium and not entitled)

        body_fa = item.free_preview_excerpt_fa if is_locked else item.content_body_fa
        body_en = item.free_preview_excerpt_en if is_locked else item.content_body_en
        audio_url = "" if is_locked else item.audio_url
        video_url = "" if is_locked else item.video_url
        quiz_data = [] if is_locked else item.quiz_data
        downloadables = [] if is_locked else item.downloadable_resources

        ContentItem.objects.filter(pk=item.pk).update(view_count=models.F("view_count") + 1)
        related = ContentService.get_related_content(item, limit=3)

        return {
            "id": str(item.id),
            "slug": item.slug,
            "title_fa": item.title_fa,
            "title_en": item.title_en,
            "summary_fa": item.summary_fa,
            "summary_en": item.summary_en,
            "category": item.category,
            "content_type": item.content_type,
            "status": item.status,
            "cefr_level": item.cefr_level,
            "age_band": item.age_band,
            "school_grade": item.school_grade,
            "content_body_fa": body_fa,
            "content_body_en": body_en,
            "learning_objectives": item.learning_objectives,
            "prerequisites": item.prerequisites,
            "audio_url": audio_url,
            "audio_duration_seconds": item.audio_duration_seconds,
            "audio_transcript_fa": "" if is_locked else item.audio_transcript_fa,
            "audio_transcript_en": "" if is_locked else item.audio_transcript_en,
            "video_url": video_url,
            "video_duration_seconds": item.video_duration_seconds,
            "video_captions": "" if is_locked else item.video_captions,
            "downloadable_resources": downloadables,
            "quiz_data": quiz_data,
            "is_premium": item.is_premium,
            "is_locked": is_locked,
            "paywall_info": {
                "plan_name": "Premium",
                "plan_duration_days": 90,
                "display_price_toman": 420000,
                "cta_url": "/account/plan",
                "message_fa": "این محتوای تخصصی نیازمند اشتراک ویژه اندورا است. با فعال‌سازی اشتراک ۹۰ روزه به تمام امکانات دسترسی داشته باشید.",
                "message_en": "This premium lesson requires an active Endoora Premium subscription. Upgrade to unlock full content, audio, and quizzes.",
            } if is_locked else None,
            "source_attribution": item.source_attribution,
            "license_type": item.license_type,
            "author_name": item.author_name,
            "tags": item.tags,
            "published_at": item.published_at.isoformat() if item.published_at else None,
            "related_items": related,
        }

    @staticmethod
    def get_related_content(item: ContentItem, limit: int = 3) -> list[dict[str, Any]]:
        related_qs = ContentItem.objects.filter(
            status=ContentStatus.PUBLISHED
        ).exclude(pk=item.pk).filter(
            Q(category=item.category) | Q(cefr_level=item.cefr_level)
        )[:limit]

        return [
            {
                "id": str(r.id),
                "slug": r.slug,
                "title_fa": r.title_fa,
                "title_en": r.title_en,
                "category": r.category,
                "cefr_level": r.cefr_level,
                "is_premium": r.is_premium,
            }
            for r in related_qs
        ]

    @staticmethod
    def review_content(content_id: str, reviewer: Any, new_status: str, notes: str = "") -> dict[str, Any]:
        if not reviewer or not getattr(reviewer, "is_authenticated", False):
            raise PermissionDenied("Authentication required for editorial review.")

        role = getattr(reviewer, "role", "")
        if not (getattr(reviewer, "is_staff", False) or role in ["editor", "administrator"]):
            raise PermissionDenied("Only editors or administrators can review content.")

        try:
            item = ContentItem.objects.get(pk=content_id)
        except ContentItem.DoesNotExist:
            raise Http404("Content item not found.")

        previous_status = item.status
        item.status = new_status
        if new_status == ContentStatus.PUBLISHED and not item.published_at:
            item.published_at = timezone.now()
        item.save()

        log = ContentReviewLog.objects.create(
            content_item=item,
            reviewer=reviewer,
            previous_status=previous_status,
            new_status=new_status,
            editorial_notes=notes,
        )

        return {
            "content_id": str(item.id),
            "slug": item.slug,
            "previous_status": previous_status,
            "new_status": new_status,
            "reviewed_at": log.created_at.isoformat(),
        }

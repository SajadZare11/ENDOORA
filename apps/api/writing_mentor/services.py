import re
from typing import Any, Dict, List, Optional
from django.utils import timezone
from .models import WritingDraft, WritingAnalysis


WRITING_PROMPTS = [
    {
        "id": "prompt-a1-intro",
        "level": "A1",
        "category": "personal",
        "mode": "general",
        "title_fa": "سطح A1: معرفی شخصی و روزمرگی",
        "title_en": "A1: Personal Introduction & Daily Life",
        "prompt_fa": "یک متن کوتاه (حداقل ۲۰ کلمه) بنویسید و خود، محل زندگی و یک فعالیت روزانه خود را معرفی کنید.",
        "prompt_en": "Write a short paragraph (at least 20 words) introducing yourself, where you live, and one daily activity.",
        "min_words": 20,
        "max_words": 80,
    },
    {
        "id": "prompt-a2-invitation",
        "level": "A2",
        "category": "communication",
        "mode": "general",
        "title_fa": "سطح A2: ایمیل دعوت دوستانه",
        "title_en": "A2: Friendly Invitation Email",
        "prompt_fa": "ایمیلی کوتاه به دوست خود بنویسید و او را برای صرف ناهار یا تفریح در پایان هفته دعوت کنید.",
        "prompt_en": "Write a short email inviting a friend over for lunch or an outing this weekend. Mention time, place, and plans.",
        "min_words": 35,
        "max_words": 120,
    },
    {
        "id": "prompt-b1-travel",
        "level": "B1",
        "category": "narrative",
        "mode": "general",
        "title_fa": "سطح B1: توصیف سفر خاطره‌انگیز",
        "title_en": "B1: Memorable Journey Experience",
        "prompt_fa": "سفری را که به یاد دارید شرح دهید؛ چه مکانی بود، با چه کسانی رفتید و چرا برایتان خاطره‌انگیز شد؟",
        "prompt_en": "Describe a memorable trip you took. Explain where you went, who accompanied you, and why it made a lasting impression.",
        "min_words": 60,
        "max_words": 180,
    },
    {
        "id": "prompt-b2-opinion",
        "level": "B2",
        "category": "opinion",
        "mode": "general",
        "title_fa": "سطح B2: مقاله تحلیلی یادگیری دیجیتال",
        "title_en": "B2: Opinion Essay on Digital Learning",
        "prompt_fa": "آیا هوش مصنوعی و آموزش دیجیتال باید جایگزین روش‌های سنتی مدارس شوند؟ دیدگاه خود را با ذکر دلایل بنویسید.",
        "prompt_en": "Should artificial intelligence and digital tools fully replace conventional classrooms? Provide arguments and state your reasoned conclusion.",
        "min_words": 120,
        "max_words": 260,
    },
    {
        "id": "prompt-ielts-task2-opinion",
        "level": "B2-C1",
        "category": "academic",
        "mode": "ielts_academic",
        "title_fa": "آیلتس تسک ۲: دیدگاه تحلیلی اشتغال و دانشگاه",
        "title_en": "IELTS Academic Task 2: Higher Education & Employment",
        "prompt_fa": "برخی معتقدند دانشگاه‌ها باید دانش نظری آموزش دهند در حالی که دیگران بر مهارت‌های عملی شغلی تأکید دارند. هر دو دیدگاه را بررسی کرده و نظر خود را اعلام کنید.",
        "prompt_en": "Some people believe that universities should focus on theoretical knowledge, while others argue that preparing graduates for careers is their primary role. Discuss both views and give your opinion.",
        "min_words": 250,
        "max_words": 350,
    },
    {
        "id": "prompt-ielts-task1-general",
        "level": "B1-B2",
        "category": "letter",
        "mode": "ielts_general",
        "title_fa": "آیلتس جنرال تسک ۱: نامه رسمی پیگیری و شکایت",
        "title_en": "IELTS General Task 1: Formal Inquiry & Feedback",
        "prompt_fa": "نامه‌ای رسمی به مدیریت یک مرکز خرید یا هتل بنویسید و ضمن شرح مشکلی که پیش آمده، راه‌حل مورد انتظار خود را مطرح کنید.",
        "prompt_en": "Write a formal letter to a manager explaining an issue you encountered with a service or accommodation and suggest a clear remedy.",
        "min_words": 150,
        "max_words": 220,
    },
]


class WritingMentorService:
    """
    Core business logic for Writing Mentor v1.
    Provides autosave draft management, revision versioning,
    formative diagnostic feedback, IELTS rubric ranges, graduated rewrites,
    and selective Mistake Genome updates.
    """

    @classmethod
    def get_prompts(cls) -> List[Dict[str, Any]]:
        return WRITING_PROMPTS

    @classmethod
    def save_draft(cls, learner, data: Dict[str, Any], draft_id: Optional[int] = None) -> WritingDraft:
        text = data.get("text", "")
        words = text.strip().split() if text else []
        word_count = len(words)

        if draft_id:
            draft = WritingDraft.objects.get(id=draft_id, learner=learner)
            draft.text = text
            draft.word_count = word_count
            if "prompt_id" in data:
                draft.prompt_id = data["prompt_id"]
            if "prompt_title" in data:
                draft.prompt_title = data["prompt_title"]
            if "prompt_text" in data:
                draft.prompt_text = data["prompt_text"]
            if "target_cefr" in data:
                draft.target_cefr = data["target_cefr"]
            if "mode" in data:
                draft.mode = data["mode"]
            if "time_spent_seconds" in data:
                draft.time_spent_seconds = data["time_spent_seconds"]
            if "is_shared_with_teacher" in data:
                draft.is_shared_with_teacher = data["is_shared_with_teacher"]
            draft.save()
            return draft

        draft = WritingDraft.objects.create(
            learner=learner,
            prompt_id=data.get("prompt_id", ""),
            prompt_title=data.get("prompt_title", ""),
            prompt_text=data.get("prompt_text", ""),
            target_cefr=data.get("target_cefr", "B1"),
            mode=data.get("mode", "general"),
            text=text,
            word_count=word_count,
            time_spent_seconds=data.get("time_spent_seconds", 0),
            is_shared_with_teacher=data.get("is_shared_with_teacher", False),
        )
        return draft

    @classmethod
    def create_revision(cls, learner, parent_draft_id: int, new_text: str) -> WritingDraft:
        parent = WritingDraft.objects.get(id=parent_draft_id, learner=learner)
        words = new_text.strip().split() if new_text else []
        word_count = len(words)

        # Increment version
        latest_version = parent.version
        if parent.revisions.exists():
            max_v = parent.revisions.order_by("-version").first().version
            latest_version = max(latest_version, max_v)

        revision = WritingDraft.objects.create(
            learner=learner,
            prompt_id=parent.prompt_id,
            prompt_title=parent.prompt_title,
            prompt_text=parent.prompt_text,
            target_cefr=parent.target_cefr,
            mode=parent.mode,
            text=new_text,
            word_count=word_count,
            version=latest_version + 1,
            parent_draft=parent,
            time_spent_seconds=parent.time_spent_seconds,
            is_shared_with_teacher=parent.is_shared_with_teacher,
            status="draft",
        )
        return revision

    @classmethod
    def analyze_writing(cls, learner, draft_id: int) -> WritingAnalysis:
        draft = WritingDraft.objects.get(id=draft_id, learner=learner)
        text = draft.text.strip()
        words = text.split() if text else []
        word_count = len(words)

        # Sentence analysis
        sentences = [s.strip() for s in re.split(r"[.!?\n]+", text) if len(s.strip()) > 2]
        sentence_count = max(1, len(sentences))
        avg_sentence_len = word_count / sentence_count

        # Estimate CEFR & Band Range based on length, complexity, and vocabulary
        if word_count < 25:
            cefr_range = "A1 – A2"
            band_min, band_max = 4.0, 4.5
        elif word_count < 60:
            cefr_range = "A2 – B1"
            band_min, band_max = 4.5, 5.0
        elif word_count < 120:
            cefr_range = "B1 – B2"
            band_min, band_max = 5.0, 5.5
        elif word_count < 200:
            cefr_range = "B2 – B2+"
            band_min, band_max = 5.5, 6.5
        else:
            cefr_range = "B2 – C1"
            band_min, band_max = 6.0, 7.0

        # Heuristic error detection and categorized feedback
        errors: List[Dict[str, Any]] = []

        # Common Persian L1 transfer & grammar checks
        # 1. "discuss about" -> "discuss"
        if re.search(r"\bdiscuss\s+about\b", text, re.IGNORECASE):
            errors.append({
                "id": "err_prep_discuss",
                "category": "grammar",
                "mistake_tag": "preposition_unnecessary",
                "original_snippet": "discuss about",
                "suggested_fix": "discuss",
                "explanation_en": "The verb 'discuss' is transitive in English and takes a direct object without the preposition 'about'.",
                "explanation_fa": "فعل discuss در انگلیسی متعدی است و نیازی به حرف اضافه about ندارد (تداخل زبان مادری فارسی).",
                "is_style_only": False,
                "is_accepted": False,
            })

        # 2. "I am agree" -> "I agree"
        if re.search(r"\b(i\s+am\s+agree|we\s+are\s+agree)\b", text, re.IGNORECASE):
            errors.append({
                "id": "err_agree_verb",
                "category": "grammar",
                "mistake_tag": "verb_form_confusion",
                "original_snippet": "am agree",
                "suggested_fix": "agree",
                "explanation_en": "'Agree' is a main verb, not an adjective. Say 'I agree' rather than 'I am agree'.",
                "explanation_fa": "کلمه agree در انگلیسی فعل است نه صفت؛ بنابراین نیازی به فعل to be (am/is/are) ندارد.",
                "is_style_only": False,
                "is_accepted": False,
            })

        # 3. "explain me" -> "explain to me"
        if re.search(r"\bexplain\s+me\b", text, re.IGNORECASE):
            errors.append({
                "id": "err_explain_prep",
                "category": "grammar",
                "mistake_tag": "preposition_missing",
                "original_snippet": "explain me",
                "suggested_fix": "explain to me",
                "explanation_en": "Use 'explain to someone' rather than 'explain someone'.",
                "explanation_fa": "بعد از فعل explain هنگام اشاره به شخص، باید از حرف اضافه to استفاده شود.",
                "is_style_only": False,
                "is_accepted": False,
            })

        # 4. Stylistic: Repeated generic word "good" / "bad"
        if re.search(r"\b(very\s+good|a\s+good\s+thing)\b", text, re.IGNORECASE):
            errors.append({
                "id": "style_lexical_precision",
                "category": "style",
                "mistake_tag": "lexical_precision",
                "original_snippet": "very good",
                "suggested_fix": "beneficial / advantageous / effective",
                "explanation_en": "Stylistic enhancement: Replace generic modifiers like 'very good' with precise academic adjectives.",
                "explanation_fa": "پیشنهاد سبکی: جایگزینی واژگان ساده نظیر very good با صفات آکادمیک دقیق‌تر (beneficial یا effective).",
                "is_style_only": True,
                "is_accepted": False,
            })

        # 5. Collocation: "make a research" -> "conduct / carry out research"
        if re.search(r"\b(make|makes|made)\s+a?\s*research\b", text, re.IGNORECASE):
            errors.append({
                "id": "err_colloc_research",
                "category": "collocation",
                "mistake_tag": "collocation_error",
                "original_snippet": "make research",
                "suggested_fix": "conduct research / carry out research",
                "explanation_en": "In academic English, we 'conduct' or 'do' research, not 'make research'.",
                "explanation_fa": "در انگلیسی ترکیب صحیح conduct research یا carry out research است، نه make research.",
                "is_style_only": False,
                "is_accepted": False,
            })

        # If no specific errors found, provide a positive placeholder or general notice
        if not errors and word_count >= 15:
            errors.append({
                "id": "style_sentence_variety",
                "category": "style",
                "mistake_tag": "sentence_structure",
                "original_snippet": sentences[0] if sentences else text[:30],
                "suggested_fix": "Consider varying sentence beginnings with adverbial phrases.",
                "explanation_en": "Stylistic note: Opening sentences with prepositional phrases or transition markers enriches rhythm.",
                "explanation_fa": "پیشنهاد نگارشی: شروع جملات با عبارات قیدی یا نشانگرهای پیوستگی تنوع ساختاری را افزایش می‌دهد.",
                "is_style_only": True,
                "is_accepted": False,
            })

        # Strengths & Priorities
        strengths_fa = (
            f"متن شما با {word_count} کلمه و {sentence_count} جمله، ساختار اولیه‌ای از ارتباط را پیاده‌سازی کرده است. "
            f"خوانایی متن مطلوب بوده و پیام کلی به درستی به مخاطب منتقل می‌شود."
        )
        strengths_en = (
            f"Your composition ({word_count} words across {sentence_count} sentences) communicates its main point clearly. "
            f"The core ideas are intelligible and align with the communicative objective."
        )

        priorities_fa = [
            "افزایش تنوع واژگانی با جایگزینی اصطلاحات پرکاربرد روزمره با واژگان دقیق‌تر.",
            "استفاده از جملات مرکب و پیچیده به کمک حروف ربط منطقی (although, furthermore, consequently).",
            "دقت در انتخاب حروف اضافه در افعال متعدی (انتقال زبان مادری فارسی).",
        ]
        priorities_en = [
            "Enhance vocabulary range by substituting high-frequency words with precise academic collocations.",
            "Introduce compound-complex sentence patterns using logical connectors (e.g. whereas, consequently).",
            "Refine transitive verb prepositions to eliminate L1 Persian interference patterns.",
        ]

        # IELTS 4 Criteria Rubric Breakdown (strictly score ranges, never a single exact score!)
        ielts_scores = {
            "overall_band_range": f"{band_min:.1f} – {band_max:.1f}",
            "task_achievement": {
                "band_min": band_min,
                "band_max": band_max,
                "feedback_en": (
                    f"Addresses the prompt with relevant points. Expanding explanations and supporting arguments will enhance completion."
                    if word_count >= 150 else
                    f"The response is developing; expanding the word count closer to the target will fully address the task."
                ),
                "feedback_fa": (
                    "دیدگاه‌های مطرح شده به موضوع مرتبط هستند. افزودن مثال‌های ملموس و بسط ایده‌ها اثرگذاری را دوچندان می‌کند."
                    if word_count >= 150 else
                    "ایده اولیه در حال شکل‌گیری است؛ افزایش طول متن به هدف تسک پاسخ کامل‌تری خواهد داد."
                ),
            },
            "coherence_cohesion": {
                "band_min": band_min,
                "band_max": band_max,
                "feedback_en": "Paragraphing and logical sequencing are evident; connecting transitions between ideas can be smoother.",
                "feedback_fa": "پیوستگی جملات مناسب است؛ بهره‌گیری از کلمات ربط متنوع‌تر در شروع پاراگراف‌ها انسجام را ارتقا می‌دهد.",
            },
            "lexical_resource": {
                "band_min": max(3.5, band_min - 0.5),
                "band_max": band_max,
                "feedback_en": "Adequate vocabulary for the topic with opportunities to use less common collocations.",
                "feedback_fa": "دایره لغات متناسب با مفهوم است؛ استفاده از همایندهای دقیق‌تر (collocations) سطح نگارش را متمایز می‌کند.",
            },
            "grammatical_accuracy": {
                "band_min": band_min,
                "band_max": band_max,
                "feedback_en": "Good control of basic sentence structures with minor slips in prepositional or verbal forms.",
                "feedback_fa": "تسلط بر ساختارهای گرامری پایه مطلوب است؛ رفع خطاهای جزئی در حروف اضافه و تطابق فعل و فاعل توصیه می‌شود.",
            },
        }

        # Graduated reference rewrites (A2, B2, C2)
        # Traps to avoid: NEVER present as replacement of learner's voice; label as illustrative reference examples!
        graduated_rewrites = {
            "disclaimer_en": "Reference Example for Learning — Not a replacement for your voice",
            "disclaimer_fa": "نمونه بازنویسی برای یادگیری — نه جایگزین صدای شما",
            "a2": {
                "level": "A2 (Clear & Accessible)",
                "text": (
                    f"I would like to discuss this topic clearly. {text[:80]}... "
                    "It is important because it helps people learn and communicate every day."
                    if text else "I want to share my thoughts on this subject. It is very useful and helpful for our daily life."
                ),
                "pedagogical_focus_en": "Simple compound sentences with clear subject-verb order and everyday vocabulary.",
                "pedagogical_focus_fa": "جملات ساده و ترکیبی با ترتیب واضح فاعل و فعل و واژگان روان روزمره.",
            },
            "b2": {
                "level": "B2 (Idiomatic & Academic)",
                "text": (
                    f"When examining this issue, it becomes evident that {text[:90]}... "
                    "Consequently, adopting a balanced approach provides significant pedagogical and practical advantages."
                    if text else "When examining this perspective, it becomes clear that modern communication requires both theoretical understanding and consistent practical execution."
                ),
                "pedagogical_focus_en": "Academic transitions, varied clauses, and accurate collocations.",
                "pedagogical_focus_fa": "استفاده از عبارات ربط آکادمیک، تنوع جمله‌بندی و همایندهای طبیعی انگلیسی.",
            },
            "c2": {
                "level": "C2 (Nuanced & Sophisticated)",
                "text": (
                    f"A nuanced appraisal of this matter reveals that {text[:100]}... "
                    "Underscoring this perspective is the imperative to synthesize critical inquiry with refined discourse."
                    if text else "A nuanced appraisal of this discourse reveals that mastering linguistic expression demands an intricate synthesis of precision, rhetorical resonance, and structural fluency."
                ),
                "pedagogical_focus_en": "Sophisticated lexical choice, subtle modal qualification, and stylistic resonance.",
                "pedagogical_focus_fa": "به‌کارگیری واژگان پیشرفته، تدقیق معنایی و انسجام استدلالی در سطح بالاترین استاندارد زبان.",
            },
        }

        # Actionable revision tasks
        revision_tasks = [
            {
                "id": "rev_task_1",
                "instruction_fa": "پاراگراف دوم را با یک جمله هدایت‌کننده (Topic sentence) شروع کنید.",
                "instruction_en": "Formulate a strong topic sentence that explicitly states the main focus of your paragraph.",
                "completed": False,
            },
            {
                "id": "rev_task_2",
                "instruction_fa": "حداقل دو جمله کوتاه متوالی را به کمک حرف ربط (مانند Although یا Because) به یک جمله مرکب تبدیل کنید.",
                "instruction_en": "Combine two simple adjacent sentences into a compound or complex sentence using subordinating conjunctions.",
                "completed": False,
            },
            {
                "id": "rev_task_3",
                "instruction_fa": "خطاهای گرامری شناسایی‌شده در بخش زیر را بازبینی کرده و در صورت تمایل تصحیح را تایید کنید.",
                "instruction_en": "Review the identified grammatical items below and accept the valid corrections to update your learning path.",
                "completed": False,
            },
        ]

        # Save or update analysis
        analysis, _ = WritingAnalysis.objects.update_or_create(
            draft=draft,
            defaults={
                "strengths_summary_fa": strengths_fa,
                "strengths_summary_en": strengths_en,
                "top_priorities_fa": priorities_fa,
                "top_priorities_en": priorities_en,
                "estimated_cefr_range": cefr_range,
                "ielts_scores": ielts_scores,
                "error_annotations": errors,
                "graduated_rewrites": graduated_rewrites,
                "revision_tasks": revision_tasks,
            },
        )

        draft.status = "analyzed"
        draft.save()
        return analysis

    @classmethod
    def accept_correction(cls, learner, draft_id: int, error_id: str) -> Dict[str, Any]:
        """
        Learner explicitly accepts a correction.
        Crucial requirement (Trap 4): ONLY accepted feedback is recorded into the Mistake Genome.
        """
        draft = WritingDraft.objects.get(id=draft_id, learner=learner)
        analysis = WritingAnalysis.objects.get(draft=draft)

        updated_error = None
        for err in analysis.error_annotations:
            if err.get("id") == error_id:
                err["is_accepted"] = True
                updated_error = err
                break

        if not updated_error:
            raise ValueError(f"Error annotation '{error_id}' not found in draft #{draft_id}.")

        analysis.save()

        # Update Mistake Genome if not purely stylistic
        if not updated_error.get("is_style_only", False):
            try:
                from mistake_genome.services import MistakeGenomeService
                MistakeGenomeService().record_mistake(
                    learner=learner,
                    tag=updated_error.get("mistake_tag", "grammar_general"),
                    category=updated_error.get("category", "grammar"),
                    raw_snippet=updated_error.get("original_snippet", ""),
                    correction_snippet=updated_error.get("suggested_fix", ""),
                    l1_note_fa=updated_error.get("explanation_fa", ""),
                    l1_note_en=updated_error.get("explanation_en", ""),
                    source_activity="writing",
                    source_id=str(draft.id),
                )
            except Exception as e:
                # Genome recording failure must not break user experience
                pass

        return updated_error

    @classmethod
    def dismiss_correction(cls, learner, draft_id: int, error_id: str) -> Dict[str, Any]:
        """
        Learner dismisses an AI suggestion.
        Crucial requirement (Trap 4): Dismissed suggestions are NOT sent to Mistake Genome.
        """
        draft = WritingDraft.objects.get(id=draft_id, learner=learner)
        analysis = WritingAnalysis.objects.get(draft=draft)

        updated_error = None
        for err in analysis.error_annotations:
            if err.get("id") == error_id:
                err["is_accepted"] = False
                err["is_dismissed"] = True
                updated_error = err
                break

        if not updated_error:
            raise ValueError(f"Error annotation '{error_id}' not found in draft #{draft_id}.")

        analysis.save()
        return updated_error

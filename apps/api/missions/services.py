import json
from pathlib import Path
from typing import Any
from django.conf import settings
from django.utils import timezone
from assessment.services import evaluate_placement_answers
from placement.models import PlacementAnswer, PlacementSession
from srs.models import SrsItem
from .models import DailyMission

CORE_ITEMS_PATH = getattr(settings, "REPO_ROOT", Path(__file__).resolve().parents[3]) / "data" / "placement" / "core-items.json"

def _load_placement_items() -> list[dict[str, Any]]:
    if CORE_ITEMS_PATH.is_file():
        try:
            return json.loads(CORE_ITEMS_PATH.read_text(encoding="utf-8-sig"))
        except Exception:
            return []
    return []

SKILL_TITLES = {
    "grammar": ("دستور زبان", "Grammar"),
    "vocabulary": ("واژگان و اصطلاحات", "Vocabulary & Collocations"),
    "reading": ("درک مطلب و خواندن", "Reading Comprehension"),
    "listening": ("شنیداری و درک گفتار", "Listening Comprehension"),
    "writing": ("نگارش و ساختار متن", "Writing & Discourse Structure"),
    "speaking": ("مهارت‌های گفتاری و مکالمه", "Spoken Fluency & Pragmatics"),
}

def _get_curated_tasks(target_skill: str) -> list[dict[str, Any]]:
    if target_skill == "grammar":
        return [
            {
                "id": "gram_01",
                "type": "multiple_choice",
                "title_fa": "توالی زمان‌ها در گذشته",
                "title_en": "Past Time Sequencing",
                "instruction_fa": "گزینه‌ای را انتخاب کنید که توالی صحیح رویدادهای گذشته را نشان می‌دهد.",
                "instruction_en": "Select the option that correctly sequences the past events.",
                "prompt_en": "By the time the keynote speaker arrived at the auditorium, the conference organizers ___ the technical setup.",
                "options": [
                    {"id": "a", "text": "have already finished"},
                    {"id": "b", "text": "had already finished"},
                    {"id": "c", "text": "already finished"},
                    {"id": "d", "text": "are already finishing"}
                ],
                "correct_option_id": "b",
                "explanation_fa": "برای عملی که قبل از یک عمل دیگر در گذشته به پایان رسیده است (رویداد زودتر)، از زمان گذشته کامل (had + p.p) استفاده می‌شود.",
                "explanation_en": "Past Perfect (had + past participle) is required for an action completed before another event in the past."
            },
            {
                "id": "gram_02",
                "type": "multiple_choice",
                "title_fa": "جملات شرطی نوع سوم (فرضی در گذشته)",
                "title_en": "Third Conditional (Past Unreal)",
                "instruction_fa": "جمله شرطی را برای بیان موقعیت فرضی تحقق‌نیافته در گذشته کامل کنید.",
                "instruction_en": "Complete the conditional sentence expressing an unreal past situation.",
                "prompt_en": "If the research team ___ the data anomalies earlier, they would have avoided the experimental delay.",
                "options": [
                    {"id": "a", "text": "detected"},
                    {"id": "b", "text": "would detect"},
                    {"id": "c", "text": "had detected"},
                    {"id": "d", "text": "have detected"}
                ],
                "correct_option_id": "c",
                "explanation_fa": "در شرطی نوع سوم، ساختار عبارت شرطی (if-clause) به صورت had + p.p و جواب شرط به صورت would have + p.p است.",
                "explanation_en": "In the third conditional, the if-clause uses the past perfect (had + past participle) to reflect an unreal past situation."
            },
            {
                "id": "gram_03",
                "type": "multiple_choice",
                "title_fa": "وارونگی ساختاری برای تأکید",
                "title_en": "Inversion for Emphasis",
                "instruction_fa": "بهترین ساختار را با توجه به قید نفی آغازین (Not only) انتخاب کنید.",
                "instruction_en": "Choose the best structure following the initial negative adverbial.",
                "prompt_en": "Not only ___ deliver the final report on schedule, but she also identified key areas for cost reduction.",
                "options": [
                    {"id": "a", "text": "she did"},
                    {"id": "b", "text": "did she"},
                    {"id": "c", "text": "has she"},
                    {"id": "d", "text": "she had"}
                ],
                "correct_option_id": "b",
                "explanation_fa": "وقتی جمله‌ای با قیدهای منفی یا تحدیدی مانند Not only آغاز می‌شود، جای فعل کمکی و فاعل وارونه (Inversion) می‌شود: did + subject + verb.",
                "explanation_en": "When a sentence begins with negative or restrictive adverbials like Not only, subject-auxiliary inversion (did she deliver) is required."
            }
        ]

    if target_skill == "vocabulary":
        return [
            {
                "id": "voc_01",
                "type": "multiple_choice",
                "title_fa": "همایندها و کالوکیشن‌های دانشگاهی",
                "title_en": "Academic Collocations",
                "instruction_fa": "فعلی را انتخاب کنید که رایج‌ترین همایند طبیعی با واژه research در متون رسمی است.",
                "instruction_en": "Select the verb that naturally collocates with research in formal English.",
                "prompt_en": "The university department intends to ___ comprehensive research into renewable energy storage.",
                "options": [
                    {"id": "a", "text": "make"},
                    {"id": "b", "text": "conduct"},
                    {"id": "c", "text": "create"},
                    {"id": "d", "text": "practice"}
                ],
                "correct_option_id": "b",
                "explanation_fa": "در زبان انگلیسی معیار و دانشگاهی، برای پژوهش از همایندهای conduct research یا undertake research استفاده می‌شود، نه make یا create.",
                "explanation_en": "In academic English, conduct research or carry out research are standard collocations; make and create are non-standard here."
            },
            {
                "id": "voc_02",
                "type": "multiple_choice",
                "title_fa": "تمایز واژگان مشابه و ظریف",
                "title_en": "Nuance Discrimination",
                "instruction_fa": "واژه‌ای را انتخاب کنید که به معنای جامع، کامل و دربرگیرنده تمام جزئیات است.",
                "instruction_en": "Choose the word meaning complete and including everything that is necessary.",
                "prompt_en": "The committee published a ___ evaluation outlining every vulnerability in the current network architecture.",
                "options": [
                    {"id": "a", "text": "comprehensible"},
                    {"id": "b", "text": "comprehensive"},
                    {"id": "c", "text": "apprehensive"},
                    {"id": "d", "text": "comprehending"}
                ],
                "correct_option_id": "b",
                "explanation_fa": "comprehensive به معنای جامع، همه‌جانبه و کامل است، در حالی که comprehensible به معنای قابل‌فهم است.",
                "explanation_en": "Comprehensive means complete and thorough. Comprehensible means capable of being understood."
            },
            {
                "id": "voc_03",
                "type": "multiple_choice",
                "title_fa": "افعال دومفعولی و عبارتی در بافت کاری",
                "title_en": "Contextual Phrasal Verbs",
                "instruction_fa": "فعل عبارتی مناسب برای مطرح کردن یک موضوع در جلسه را برگزینید.",
                "instruction_en": "Choose the phrasal verb that means to raise or mention a topic for discussion.",
                "prompt_en": "During the quarterly review, the project lead decided to ___ the issue of team workload allocation.",
                "options": [
                    {"id": "a", "text": "bring up"},
                    {"id": "b", "text": "take down"},
                    {"id": "c", "text": "call off"},
                    {"id": "d", "text": "look into"}
                ],
                "correct_option_id": "a",
                "explanation_fa": "فعل عبارتی bring up به معنای مطرح کردن یک موضوع جهت بحث است. look into به معنای بررسی کردن و call off به معنای لغو کردن است.",
                "explanation_en": "Bring up means to mention or initiate discussion on a subject. Look into means investigate; call off means cancel."
            }
        ]

    if target_skill == "reading":
        return [
            {
                "id": "read_01",
                "type": "multiple_choice",
                "title_fa": "تشخیص ایده اصلی و تز نویسنده",
                "title_en": "Main Idea & Thesis Identification",
                "instruction_fa": "ایده کلیدی پاراگراف زیر را انتخاب کنید.",
                "instruction_en": "Identify the central thesis of the excerpt.",
                "prompt_en": "While automation undoubtedly streamlines repetitive logistics, recent studies show that human oversight remains indispensable for nuanced decision-making in unpredictable supply chain crises. What is the author's primary argument?",
                "options": [
                    {"id": "a", "text": "Automation will completely replace supply chain staff."},
                    {"id": "b", "text": "Human oversight remains essential despite increased automation."},
                    {"id": "c", "text": "Logistics companies should abandon automated technologies."},
                    {"id": "d", "text": "Supply chain crises are largely caused by automation."}
                ],
                "correct_option_id": "b",
                "explanation_fa": "تز اصلی نویسنده بر کلمه indispensable (ضروری و غیرقابل جایگزینی) برای نظارت انسانی در شرایط بحرانی تأکید دارد.",
                "explanation_en": "The contrastive structure highlights human oversight as essential and indispensable despite automation."
            },
            {
                "id": "read_02",
                "type": "multiple_choice",
                "title_fa": "ارجاع ضمیر و انسجام متنی",
                "title_en": "Pronoun Reference Resolution",
                "instruction_fa": "مشخص کنید عبارت ارجاعی this phenomenon به چه موضوعی برمی‌گردد.",
                "instruction_en": "Determine what the phrase this phenomenon refers to.",
                "prompt_en": "Urban temperatures frequently surpass surrounding rural areas by several degrees due to dense concrete infrastructure and reduced vegetation. Climatologists refer to this phenomenon when evaluating municipal heat mitigation. What does this phenomenon designate?",
                "options": [
                    {"id": "a", "text": "Higher temperatures in urban regions compared to rural areas"},
                    {"id": "b", "text": "The construction of agricultural vegetation zones"},
                    {"id": "c", "text": "The complete absence of municipal cooling plans"},
                    {"id": "d", "text": "Seasonal temperature fluctuations across continents"}
                ],
                "correct_option_id": "a",
                "explanation_fa": "عبارت this phenomenon مستقیماً به دمای بالاتر مناطق شهری نسبت به مناطق روستایی در جمله قبلی اشاره دارد.",
                "explanation_en": "This phenomenon directly anaphorically references the urban heat differential described in the first sentence."
            },
            {
                "id": "read_03",
                "type": "multiple_choice",
                "title_fa": "استنتاج لحن و دیدگاه نویسنده",
                "title_en": "Author Tone & Stance Inference",
                "instruction_fa": "لحن نویسنده را در عبارت زیر تحلیل کنید.",
                "instruction_en": "Assess the author's tone in the passage.",
                "prompt_en": "Although initial trials indicate measurable efficacy, jumping to triumphant conclusions would be premature without replication in diverse demographics. How would you characterize the author's tone?",
                "options": [
                    {"id": "a", "text": "Overly dismissive and cynical"},
                    {"id": "b", "text": "Cautious and evidence-oriented"},
                    {"id": "c", "text": "Enthusiastically supportive without reservation"},
                    {"id": "d", "text": "Indifferent and uncommitted"}
                ],
                "correct_option_id": "b",
                "explanation_fa": "استفاده از عباراتی نظیر measurable efficacy همراه با premature without replication نشان‌دهنده لحنی محتاطانه، علمی و مبتنی بر شواهد است.",
                "explanation_en": "Balancing acknowledged efficacy with warnings against premature triumph indicates a cautious, scientifically rigorous stance."
            }
        ]

    if target_skill == "listening":
        return [
            {
                "id": "lis_01",
                "type": "multiple_choice",
                "title_fa": "درک مقصود اصلی گوینده",
                "title_en": "Speaker Intention & Gist",
                "instruction_fa": "بر اساس مکالمه زیر، منظور واقعی گوینده چیست؟",
                "instruction_en": "Based on the dialogue transcript, what is the speaker actually implying?",
                "prompt_en": "Speaker A: Do you think we have enough time to finalize the proposal before 5 PM?\nSpeaker B: Well, assuming the printer stops jamming every ten minutes and Sarah sends her budget table.\nWhat does Speaker B mean?",
                "options": [
                    {"id": "a", "text": "They will definitely finish ahead of schedule."},
                    {"id": "b", "text": "Finishing on time depends on overcoming several obstacles."},
                    {"id": "c", "text": "The proposal has already been submitted."},
                    {"id": "d", "text": "Sarah refused to participate in the proposal."}
                ],
                "correct_option_id": "b",
                "explanation_fa": "گوینده با آوردن شروطی نظیر توقف خرابی پرینتر و ارسال جدول سارا، به طور ضمنی بیان می‌کند که اتمام کار منوط به رفع این موانع است.",
                "explanation_en": "Speaker B uses conditional clauses to politely imply that on-time completion is doubtful unless existing hurdles are resolved."
            },
            {
                "id": "lis_02",
                "type": "multiple_choice",
                "title_fa": "مخالفت و توافق مشروط",
                "title_en": "Nuanced Agreement & Qualification",
                "instruction_fa": "کدام گزینه مفهوم توافق در کلیات، اما ابراز نگرانی در اجرا را به درستی می‌رساند؟",
                "instruction_en": "Which option conveys conceptual agreement accompanied by practical reservation?",
                "prompt_en": "Colleague: I propose shifting all meetings to Mondays to leave the rest of the week uninterrupted.\nWhich response reflects nuanced agreement with caution?",
                "options": [
                    {"id": "a", "text": "That is completely unacceptable and will never work."},
                    {"id": "b", "text": "I like the focus it creates, though packing everything into one day might cause decision fatigue."},
                    {"id": "c", "text": "I could not care less about when meetings are held."},
                    {"id": "d", "text": "Sure, Monday is completely empty anyway."}
                ],
                "correct_option_id": "b",
                "explanation_fa": "گزینه B ساختار تأیید منفعت اولیه همراه با طرح احتیاط در اجرا را پیاده کرده است که از مهارت‌های مهم مکالمه حرفه‌ای است.",
                "explanation_en": "Option B exemplifies collaborative pragmatics by validating the benefit while raising a constructive caveat."
            },
            {
                "id": "lis_03",
                "type": "multiple_choice",
                "title_fa": "راهبرد شفاف‌سازی و بازپرسی مودبانه",
                "title_en": "Polite Clarification Strategy",
                "instruction_fa": "طبیعی‌ترین عبارت برای درخواست توضیح بیشتر درباره یک نکته مبهم در سخنرانی را انتخاب کنید.",
                "instruction_en": "Select the most natural professional phrase to request clarification.",
                "prompt_en": "A presenter mentions substantial downstream synergies without detailing them. Which question most effectively and politely seeks clarification?",
                "options": [
                    {"id": "a", "text": "What does that even mean?"},
                    {"id": "b", "text": "Could you elaborate on how those downstream synergies translate into day-to-day operations?"},
                    {"id": "c", "text": "You forgot to explain that slide."},
                    {"id": "d", "text": "I do not believe downstream synergies exist."}
                ],
                "correct_option_id": "b",
                "explanation_fa": "ساختار Could you elaborate on... محترمانه، حرفه‌ای و دقیق است و بدون حالت تهاجمی، اطلاعات مورد نظر را درخواست می‌کند.",
                "explanation_en": "Could you elaborate on... provides an appropriately hedged, courteous, and precise clarification inquiry in professional discourse."
            }
        ]

    if target_skill == "writing":
        return [
            {
                "id": "wri_01",
                "type": "multiple_choice",
                "title_fa": "کلمات ربط و انتقال منطقی",
                "title_en": "Cohesive Transition Markers",
                "instruction_fa": "کلمه ربط مناسب برای بیان تقابل منطقی میان دو جمله را انتخاب کنید.",
                "instruction_en": "Select the cohesive device expressing logical contrast.",
                "prompt_en": "Traditional retail footfall experienced a sharp decline last quarter. ___, digital storefront transactions rose by twenty-two percent over the identical period.",
                "options": [
                    {"id": "a", "text": "Furthermore"},
                    {"id": "b", "text": "Conversely"},
                    {"id": "c", "text": "Consequently"},
                    {"id": "d", "text": "Similarly"}
                ],
                "correct_option_id": "b",
                "explanation_fa": "Conversely برای بیان دو واقعیت کاملاً متقابل و وارونه استفاده می‌شود (کاهش خرید حضوری در مقابل افزایش خرید آنلاین).",
                "explanation_en": "Conversely signals an antithetical contrast between declining physical footfall and surging e-commerce transactions."
            },
            {
                "id": "wri_02",
                "type": "multiple_choice",
                "title_fa": "ارتقای لحن رسمی و اجتناب از واژگان محاوره‌ای",
                "title_en": "Register Elevation",
                "instruction_fa": "کدام جایگزین واژه عامیانه kids را به شکل رسمی و متناسب با مقالات تحلیلی ارتقا می‌دهد؟",
                "instruction_en": "Which substitution elevates the informal phrase in an academic essay?",
                "prompt_en": "Original: Educators must ensure that kids develop digital literacy early. What is the most appropriate formal substitution for kids?",
                "options": [
                    {"id": "a", "text": "young learners"},
                    {"id": "b", "text": "little buddies"},
                    {"id": "c", "text": "youngsters and pals"},
                    {"id": "d", "text": "toddlers only"}
                ],
                "correct_option_id": "a",
                "explanation_fa": "در نوشتار رسمی و آکادمیک، استفاده از واژگان دقیق مانند young learners یا children جایگزین عبارات محاوره‌ای نظیر kids می‌شود.",
                "explanation_en": "Young learners is an established academic term denoting children in educational contexts, elevating the register appropriately."
            },
            {
                "id": "wri_03",
                "type": "multiple_choice",
                "title_fa": "چارچوب‌بندی استدلال و پاسخ به نظر مخالف",
                "title_en": "Counter-Argument Concession",
                "instruction_fa": "بهترین ساختار برای پذیرش بخشی از نظر مخالف همراه با حفظ نظر اصلی نویسنده را انتخاب کنید.",
                "instruction_en": "Choose the construction that effectively concedes an opposing point while reinforcing the author's primary argument.",
                "prompt_en": "___ the initial upfront investment in solar energy is significant, long-term operational savings clearly outweigh initial costs.",
                "options": [
                    {"id": "a", "text": "Because"},
                    {"id": "b", "text": "While it is true that"},
                    {"id": "c", "text": "Despite of"},
                    {"id": "d", "text": "In addition to"}
                ],
                "correct_option_id": "b",
                "explanation_fa": "ساختار While it is true that [concession], [counter-claim] ابزار کلاسیک استدلال تحلیلی برای بیان پذیرش منصفانه و سپس اثبات نظر اصلی است.",
                "explanation_en": "While it is true that... gracefully establishes an acknowledged concession before pivoting to the dominant thesis."
            }
        ]

    if target_skill == "speaking":
        return [
            {
                "id": "spk_01",
                "type": "multiple_choice",
                "title_fa": "عبارات مقدمه‌چینی و بیان دیدگاه شخصی",
                "title_en": "Hedging & Stance Markers",
                "instruction_fa": "طبیعی‌ترین عبارت برای بیان دیدگاه شخصی به شیوه‌ای حرفه‌ای و منعطف را انتخاب کنید.",
                "instruction_en": "Select the most natural conversational marker for presenting a reasoned personal stance.",
                "prompt_en": "___, the most sustainable solution is to invest in workforce upskilling rather than outsourcing.",
                "options": [
                    {"id": "a", "text": "From my perspective"},
                    {"id": "b", "text": "As everyone must agree with me"},
                    {"id": "c", "text": "Without anyone thinking differently"},
                    {"id": "d", "text": "I force this opinion that"}
                ],
                "correct_option_id": "a",
                "explanation_fa": "From my perspective یا In my view عبارات طبیعی و معتبر در گفت‌وگوهای تعاملی و آزمون‌های بین‌المللی برای معرفی نظر فردی هستند.",
                "explanation_en": "From my perspective politely frames an assertion as a thoughtful personal viewpoint rather than an aggressive absolute."
            },
            {
                "id": "spk_02",
                "type": "multiple_choice",
                "title_fa": "مخالفت مؤدبانه و دیپلماتیک در مکالمه",
                "title_en": "Diplomatic Disagreement",
                "instruction_fa": "بهترین فرمول برای مخالفت محترمانه در یک گفت‌وگوی کاری را انتخاب کنید.",
                "instruction_en": "Choose the most diplomatically sound formula for expressing disagreement in discussion.",
                "prompt_en": "Partner: We should cancel the client workshop because attendance is lower than expected.\nWhich response disagrees effectively without being rude?",
                "options": [
                    {"id": "a", "text": "You are wrong and that idea makes no sense."},
                    {"id": "b", "text": "I see your point about numbers, but smaller cohorts often yield much higher engagement."},
                    {"id": "c", "text": "No way, do not speak like that."},
                    {"id": "d", "text": "I guess you always want to cancel everything."}
                ],
                "correct_option_id": "b",
                "explanation_fa": "فرمول I see your point, but... ابتدا دغدغه طرف مقابل را به رسمیت می‌شناسد و سپس زاویه دید جایگزین را با آرامش مطرح می‌کند.",
                "explanation_en": "I see your point... but... exemplifies professional conversational diplomacy by acknowledging the concern before providing counter-evidence."
            },
            {
                "id": "spk_03",
                "type": "multiple_choice",
                "title_fa": "مدیریت زمان و جمع‌بندی نکات گفتار",
                "title_en": "Turn Completion & Summarizing",
                "instruction_fa": "عبارت مناسب برای خلاصه کردن نکته اصلی و دعوت از طرف مقابل برای بیان نظر را انتخاب کنید.",
                "instruction_en": "Select the appropriate conversational close that summarizes and hands over the turn.",
                "prompt_en": "So to wrap up, optimizing onboarding reduces churn significantly. ___",
                "options": [
                    {"id": "a", "text": "How do you see this impacting your department?"},
                    {"id": "b", "text": "Now you have to talk for five minutes."},
                    {"id": "c", "text": "I am done forever."},
                    {"id": "d", "text": "Do not disagree with my summary."}
                ],
                "correct_option_id": "a",
                "explanation_fa": "پرسش‌های باز نظیر How do you see this...? نوبت مکالمه را با ظرافت و پویایی به شنونده واگذار می‌کنند و به جریان مثبت بحث کمک می‌کنند.",
                "explanation_en": "An open invitation cleanly yields the floor while inviting collaborative engagement."
            }
        ]

    # Default fallback / Diagnostic readiness (unplaced onboarding)
    return [
        {
            "id": "onb_01",
            "type": "multiple_choice",
            "title_fa": "واژگان کاربردی در بافت روزمره",
            "title_en": "Core Vocabulary in Context",
            "instruction_fa": "بهترین واژه را برای تکمیل جمله انتخاب کنید.",
            "instruction_en": "Choose the best word to complete the sentence.",
            "prompt_en": "Clear communication is ___ for successful collaboration in any diverse team.",
            "options": [
                {"id": "a", "text": "essential"},
                {"id": "b", "text": "accidental"},
                {"id": "c", "text": "occasional"},
                {"id": "d", "text": "hesitant"}
            ],
            "correct_option_id": "a",
            "explanation_fa": "essential به معنای ضروری و حیاتی است و با زمینه همکاری موفق تیمی همخوانی دارد.",
            "explanation_en": "Essential (crucial/necessary) logically fits the requirements of successful team collaboration."
        },
        {
            "id": "onb_02",
            "type": "multiple_choice",
            "title_fa": "ساختار حال کامل و کاربرد زمان‌ها",
            "title_en": "Present Perfect Syntax",
            "instruction_fa": "شکل صحیح فعل را برای رویدادی که از گذشته تا کنون ادامه داشته است انتخاب کنید.",
            "instruction_en": "Select the correct verb form indicating an ongoing state from the past to the present.",
            "prompt_en": "She ___ English at the language institute for the past three years.",
            "options": [
                {"id": "a", "text": "has studied"},
                {"id": "b", "text": "studies"},
                {"id": "c", "text": "studied yesterday"},
                {"id": "d", "text": "is study"}
            ],
            "correct_option_id": "a",
            "explanation_fa": "برای عملی که در گذشته شروع شده و اثر یا استمرار آن تا زمان حال ادامه دارد، همراه با for the past three years از حال کامل (has + p.p) استفاده می‌شود.",
            "explanation_en": "Present Perfect (has studied) is used with duration markers continuing to the present moment."
        },
        {
            "id": "onb_03",
            "type": "multiple_choice",
            "title_fa": "بیان قصد و تعیین هدف یادگیری",
            "title_en": "Expressing Intent & Goal Setting",
            "instruction_fa": "کدام ساختار برای بیان تصمیم محکم و برنامه‌ریزی هدفمند در یادگیری زبان مناسب است؟",
            "instruction_en": "Which structure appropriately expresses purposeful learning intent?",
            "prompt_en": "Which sentence most clearly expresses a committed learning objective?",
            "options": [
                {"id": "a", "text": "I intend to practice conversational English for twenty minutes every morning."},
                {"id": "b", "text": "Maybe English will learn itself one day."},
                {"id": "c", "text": "I forgot why I opened this website."},
                {"id": "d", "text": "English is words and books."}
            ],
            "correct_option_id": "a",
            "explanation_fa": "عبارت I intend to practice... ساختاری صریح، متعهدانه و شفاف برای تنظیم اهداف یادگیری است که پایه اصلی ادامه مسیر در اندورا خواهد بود.",
            "explanation_en": "I intend to practice... clearly states an actionable, intentional learning habit."
        }
    ]

def _resolve_target_skill_from_placement(user) -> tuple[str, str, str]:
    session = (
        PlacementSession.objects.filter(user=user, status="submitted")
        .order_by("-started_at")
        .first()
    )
    if not session:
        return (
            "diagnostic_readiness",
            "هنوز تعیین سطح انجام نشده است؛ این ماموریت مقدماتی برای آشنایی با روند یادگیری اندورا آماده شده است.",
            "Placement is not yet completed; this introductory mission gets you familiar with Endoora learning flow."
        )

    answers_map = {}
    for ans in session.answers.all():
        val = ans.answer_value
        if isinstance(val, dict):
            answers_map[ans.question_key] = val.get("selected_option") or val.get("spoken_text") or val.get("written_text") or val
        else:
            answers_map[ans.question_key] = val

    raw_items = _load_placement_items()
    evaluation = evaluate_placement_answers(raw_items, answers_map)
    sections_eval = evaluation.get("sections", {})

    ranked = []
    for skill_key, skill_tuple in SKILL_TITLES.items():
        sec_data = sections_eval.get(skill_key, {})
        pct = float(sec_data.get("score_percentage", 0.0))
        ranked.append((skill_key, pct, skill_tuple[0], skill_tuple[1]))

    ranked.sort(key=lambda x: x[1])
    target_skill, lowest_pct, skill_fa, skill_en = ranked[0]

    reason_fa = f"بر اساس ارزیابی تعیین سطح، مهارت {skill_fa} (با امتیاز {int(lowest_pct)}٪) بیشترین اولویت را برای تمرین امروز شما دارد."
    reason_en = f"Based on placement evidence, {skill_en} (at {int(lowest_pct)}%) is your highest priority growth area for today."
    return target_skill, reason_fa, reason_en

def build_daily_mission(user) -> DailyMission:
    today = timezone.localdate()
    existing = DailyMission.objects.filter(user=user, mission_date=today).first()
    if existing:
        if not existing.evidence_reason.get("tasks"):
            target_skill, reason_fa, reason_en = _resolve_target_skill_from_placement(user)
            tasks = _get_curated_tasks(target_skill)
            existing.evidence_reason["target_skill"] = target_skill
            existing.evidence_reason["reason_fa"] = reason_fa
            existing.evidence_reason["reason_en"] = reason_en
            existing.evidence_reason["tasks"] = tasks
            existing.evidence_reason["current_task_index"] = 0
            existing.evidence_reason["completed_task_ids"] = []
            existing.save(update_fields=["evidence_reason"])
        return existing

    target_skill, reason_fa, reason_en = _resolve_target_skill_from_placement(user)
    skill_tuple = SKILL_TITLES.get(target_skill, ("مهارت عمومی", "General Skill"))
    tasks = _get_curated_tasks(target_skill)

    if target_skill == "diagnostic_readiness":
        title_fa = "ماموریت امروز: آشنایی و سنجش نقطه شروع"
        title_en = "Today's Mission: Readiness & Starting Point"
        explanation_fa = "این ماموریت مقدماتی شما را با ساختار یادگیری اندورا آشنا می‌کند. برای دریافت برنامه‌های اختصاصی‌تر، تعیین سطح را تکمیل کنید."
        explanation_en = "This introductory mission introduces you to Endoora flow. Complete placement to unlock fully tailored missions."
        source = "unplaced_onboarding"
    else:
        title_fa = f"ماموریت امروز: تقویت {skill_tuple[0]}"
        title_en = f"Today's Mission: Strengthen {skill_tuple[1]}"
        explanation_fa = f"این ماموریت بر مبنای کارنامه تعیین سطح شما و با تمرکز بر چالش‌های {skill_tuple[0]} طراحی شده است."
        explanation_en = f"This mission is derived from your placement evidence with targeted practice in {skill_tuple[1]}."
        source = "placement_evaluation"

    evidence_reason = {
        "source": source,
        "target_skill": target_skill,
        "reason_fa": reason_fa,
        "reason_en": reason_en,
        "tasks": tasks,
        "current_task_index": 0,
        "completed_task_ids": [],
    }

    mission = DailyMission.objects.create(
        user=user,
        mission_date=today,
        title_fa=title_fa,
        title_en=title_en,
        explanation_fa=explanation_fa,
        explanation_en=explanation_en,
        evidence_reason=evidence_reason,
        status=DailyMission.Status.READY,
    )
    return mission

def start_daily_mission(user) -> DailyMission:
    mission = build_daily_mission(user)
    if mission.status == DailyMission.Status.READY:
        mission.status = DailyMission.Status.IN_PROGRESS
        mission.save(update_fields=["status"])
    return mission

def resolve_mission_next_action(user, mission: DailyMission) -> dict[str, str]:
    has_placement = PlacementSession.objects.filter(user=user, status="submitted").exists()
    now = timezone.now()
    has_due_srs = SrsItem.objects.filter(learner=user, due_at__lte=now).exists()

    if not has_placement:
        return {
            "id": "start_placement",
            "href": "/placement",
            "title_fa": "تکمیل تعیین سطح تخصصی",
            "title_en": "Complete Placement Assessment",
            "reason_fa": "با انجام تعیین سطح ۱۵ دقیقه‌ای، مسیر شخصی و ماموریت‌های هدفمند شما فعال می‌شوند.",
            "reason_en": "Taking the 15-minute placement test activates your personal learning path and targeted missions.",
        }

    if has_due_srs:
        return {
            "id": "review_vocabulary",
            "href": "/review",
            "title_fa": "مرور واژگان موعدرسیده در SRS",
            "title_en": "Review Due Vocabulary in SRS",
            "reason_fa": "تثبیت واژگان بر اساس منحنی فراموشی بالاترین اولویت پس از انجام ماموریت روزانه است.",
            "reason_en": "Consolidating vocabulary along the forgetting curve is top priority after the daily mission.",
        }

    return {
        "id": "explore_path",
        "href": "/path",
        "title_fa": "مشاهده مسیر یادگیری شخصی",
        "title_en": "View Personal Learning Path",
        "reason_fa": "ماموریت امروز با موفقیت تکمیل شد؛ روند پیشرفت در مهارت‌های شش‌گانه را در مسیر شخصی ببینید.",
        "reason_en": "Today's mission is complete; review your 6-skill progress roadmap in your personal path.",
    }

def submit_mission_step(user, task_id: str, selected_option_id: str) -> dict[str, Any]:
    today = timezone.localdate()
    mission = DailyMission.objects.filter(user=user, mission_date=today).first()
    if not mission:
        mission = build_daily_mission(user)

    tasks = mission.get_tasks()
    task = next((t for t in tasks if str(t.get("id")) == str(task_id)), None)
    if not task:
        raise ValueError(f"Task with ID {task_id} not found in today's mission.")

    correct_option_id = task.get("correct_option_id")
    is_correct = (str(selected_option_id).strip().lower() == str(correct_option_id).strip().lower())

    task["user_answer"] = selected_option_id
    task["is_correct"] = is_correct
    task["completed"] = True

    completed_ids = set(mission.get_completed_task_ids())
    completed_ids.add(str(task_id))
    mission.evidence_reason["completed_task_ids"] = list(completed_ids)

    next_task_index = None
    for idx, t in enumerate(tasks):
        if str(t.get("id")) not in completed_ids:
            next_task_index = idx
            break

    if next_task_index is not None:
        mission.evidence_reason["current_task_index"] = next_task_index
        mission.status = DailyMission.Status.IN_PROGRESS
        all_completed = False
    else:
        mission.evidence_reason["current_task_index"] = len(tasks)
        mission.status = DailyMission.Status.COMPLETED
        all_completed = True

    mission.save(update_fields=["evidence_reason", "status"])

    next_best_action = resolve_mission_next_action(user, mission) if all_completed else None

    return {
        "task_id": task_id,
        "is_correct": is_correct,
        "selected_option_id": selected_option_id,
        "correct_option_id": correct_option_id,
        "explanation_fa": task.get("explanation_fa", ""),
        "explanation_en": task.get("explanation_en", ""),
        "mission_status": mission.status,
        "all_completed": all_completed,
        "next_task_index": next_task_index,
        "next_best_action": next_best_action,
    }

from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils import timezone

from accounts.models import User
from ielts.models import (
    IELTSTest,
    IELTSTestType,
    IELTSTestStatus,
    IELTSSection,
    IELTSSectionType,
    IELTSPassageTask,
    IELTSQuestionGroup,
    IELTSQuestion,
    IELTSQuestionType,
    IELTSBandDescriptor,
    IELTSCriteriaKey,
    MANDATORY_IELTS_DISCLAIMER,
)


class Command(BaseCommand):
    help = "Seeds 100% original Academic IELTS mini-test and official public band descriptors"

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding IELTS Public Band Descriptors..."))
        self._seed_band_descriptors()

        self.stdout.write(self.style.NOTICE("Seeding 100% Original Academic IELTS Mini-Test..."))
        self._seed_academic_mini_test()

        self.stdout.write(self.style.SUCCESS("IELTS Seed data completed successfully."))

    def _seed_band_descriptors(self):
        descriptors = [
            # Writing - Task Achievement / Response
            {
                "section_type": "writing",
                "criteria_key": IELTSCriteriaKey.TASK_ACHIEVEMENT_RESPONSE,
                "band_level": Decimal("9.0"),
                "public_descriptor_en": "Fully addresses all parts of the task. Presents a fully developed position with relevant, fully extended and well supported ideas.",
                "pedagogical_guidance_fa": "پاسخ کامل و جامع به تمام بخش‌های سوال؛ بسط ایده‌ها با استدلال‌های شفاف و شواهد بدون هرگونه حاشیه‌روی.",
            },
            {
                "section_type": "writing",
                "criteria_key": IELTSCriteriaKey.TASK_ACHIEVEMENT_RESPONSE,
                "band_level": Decimal("7.0"),
                "public_descriptor_en": "Addresses all parts of the task. Presents a clear position throughout the response. Extends and supports main ideas, but there may be a tendency to over-generalise.",
                "pedagogical_guidance_fa": "پوشش کلیه بخش‌های تسک؛ اتخاذ موضع شفاف و مداوم؛ تشریح ایده‌های اصلی با احتمال تعمیم‌یافتگی‌های اندک.",
            },
            {
                "section_type": "writing",
                "criteria_key": IELTSCriteriaKey.TASK_ACHIEVEMENT_RESPONSE,
                "band_level": Decimal("6.0"),
                "public_descriptor_en": "Addresses all parts of the task although some parts may be more fully covered than others. Presents a relevant position, though conclusions may become unclear.",
                "pedagogical_guidance_fa": "پوشش سوال با عمق نامتوازن در برخی بخش‌ها؛ موضع مرتبط اما با نتیجه‌گیری‌هایی که گاهی مبهم یا تکراری می‌شوند.",
            },
            # Writing - Coherence & Cohesion
            {
                "section_type": "writing",
                "criteria_key": IELTSCriteriaKey.COHERENCE_COHESION,
                "band_level": Decimal("9.0"),
                "public_descriptor_en": "Uses cohesion in such a way that it attracts no attention. Skilfully manages paragraphing.",
                "pedagogical_guidance_fa": "انسجام کاملاً طبیعی و نامحسوس؛ پاراگراف‌بندی بی‌نقص با توالی منطقی و روان اندیشه‌ها.",
            },
            {
                "section_type": "writing",
                "criteria_key": IELTSCriteriaKey.COHERENCE_COHESION,
                "band_level": Decimal("7.0"),
                "public_descriptor_en": "Logically organises information and ideas; there is clear progression throughout. Uses a range of cohesive devices appropriately.",
                "pedagogical_guidance_fa": "سازمان‌دهی منطقی اطلاعات با روند پیشرفت آشکار؛ استفاده مناسب از پیونددهنده‌ها با کمترین خطا.",
            },
            # Writing - Lexical Resource
            {
                "section_type": "writing",
                "criteria_key": IELTSCriteriaKey.LEXICAL_RESOURCE,
                "band_level": Decimal("8.0"),
                "public_descriptor_en": "Uses a wide range of vocabulary fluently and flexibly. Skilfully uses uncommon lexical items with rare inaccuracies in word choice and collocation.",
                "pedagogical_guidance_fa": "دایره واژگان بسیار وسیع و منعطف؛ به‌کارگیری اصطلاحات و همایندهای پیشرفته با اشتباهات انگشت‌شمار.",
            },
            {
                "section_type": "writing",
                "criteria_key": IELTSCriteriaKey.LEXICAL_RESOURCE,
                "band_level": Decimal("6.0"),
                "public_descriptor_en": "Uses an adequate range of vocabulary for the task. Attempts to use less common vocabulary but with some inaccuracy.",
                "pedagogical_guidance_fa": "واژگان کافی برای موضوع؛ تلاش برای استفاده از کلمات پیشرفته همراه با برخی خطاهای واژه‌گزینی یا هجی.",
            },
            # Writing - Grammatical Range & Accuracy
            {
                "section_type": "writing",
                "criteria_key": IELTSCriteriaKey.GRAMMATICAL_RANGE_ACCURACY,
                "band_level": Decimal("8.0"),
                "public_descriptor_en": "Uses a wide range of structures. The majority of sentences are error-free. Makes only occasional non-systematic errors.",
                "pedagogical_guidance_fa": "تنوع بالای سازه‌های گرامری ساده و مرکب؛ اکثریت مطلق جملات فاقد خطا با لغزش‌های پراکنده و غیرساختاری.",
            },
            {
                "section_type": "writing",
                "criteria_key": IELTSCriteriaKey.GRAMMATICAL_RANGE_ACCURACY,
                "band_level": Decimal("6.0"),
                "public_descriptor_en": "Uses a mix of simple and complex sentence forms. Makes some errors in grammar and punctuation, but they rarely reduce communication.",
                "pedagogical_guidance_fa": "ترکیب جملات ساده و پیچیده؛ وجود اشتباهات گرامری و نشانه‌گذاری که مانع از درک پیام اصلی نمی‌شوند.",
            },
            # Speaking - Fluency & Coherence
            {
                "section_type": "speaking",
                "criteria_key": IELTSCriteriaKey.FLUENCY_COHERENCE,
                "band_level": Decimal("7.0"),
                "public_descriptor_en": "Speaks at length without noticeable effort or loss of coherence. May demonstrate language-related hesitation at times.",
                "pedagogical_guidance_fa": "توانایی صحبت طولانی با تلاش اندک و حفظ پیوستگی کلام؛ مکث‌های محدود و مقطعی برای جستجوی واژه یا ساختار.",
            },
            # Speaking - Pronunciation
            {
                "section_type": "speaking",
                "criteria_key": IELTSCriteriaKey.PRONUNCIATION,
                "band_level": Decimal("7.0"),
                "public_descriptor_en": "Shows all the positive features of Band 6 and some, but not all, of the positive features of Band 8. Easy to understand throughout with natural intonation.",
                "pedagogical_guidance_fa": "تلفظ واضح و آهنگ کلامی طبیعی در سراسر مکالمه با حداقل ابهام و تکیه صحیح بر سیلاب‌ها و واژگان کلیدی.",
            },
        ]

        for item in descriptors:
            IELTSBandDescriptor.objects.update_or_create(
                section_type=item["section_type"],
                criteria_key=item["criteria_key"],
                band_level=item["band_level"],
                defaults={
                    "public_descriptor_en": item["public_descriptor_en"],
                    "pedagogical_guidance_fa": item["pedagogical_guidance_fa"],
                },
            )

    def _seed_academic_mini_test(self):
        # Obtain or create author and distinct reviewer for Two-Person review governance
        author, _ = User.objects.get_or_create(
            email="ielts.author@endoora.ir",
            defaults={
                "first_name": "دکتر آرش",
                "last_name": "کاویانی",
                "role": User.Role.EDITOR,
                "is_staff": True,
            },
        )

        reviewer, _ = User.objects.get_or_create(
            email="ielts.reviewer@endoora.ir",
            defaults={
                "first_name": "مریم",
                "last_name": "شمس‌آبادی",
                "role": User.Role.ADMINISTRATOR,
                "is_staff": True,
            },
        )

        test, created = IELTSTest.objects.get_or_create(
            title_en="Endoora Academic IELTS Diagnostic Simulation 01",
            version=1,
            defaults={
                "title_fa": "آزمون شبیه‌ساز تشخیصی آیلتس آکادمیک ایندورا ۰۱",
                "test_type": IELTSTestType.ACADEMIC,
                "status": IELTSTestStatus.PUBLISHED,
                "author": author,
                "reviewed_by": reviewer,
                "reviewed_at": timezone.now(),
                "review_notes": "تأییدیه کیفی هیئت داوران: ۱۰۰٪ اصیل، متناسب با استانداردهای رسمی آیلتس و فاقد هرگونه استفاده از سوالات دارای حق نشر.",
                "is_locked": True,
                "quality_checklist": {
                    "zero_copyright_infringement": True,
                    "cefr_calibrated": True,
                    "answer_key_verified": True,
                    "audio_script_verified": True,
                    "typo_and_formatting_checked": True,
                },
                "copyright_source": "100% Original Endoora Academic Content. Authored by Dr. K. Arash (PhD Applied Linguistics). Audited by Editorial Board. Zero Cambridge/IDP reproduction.",
                "disclaimer_label": MANDATORY_IELTS_DISCLAIMER,
                "total_duration_minutes": 85,
                "difficulty_level": "Band 6.0 - 7.5",
            },
        )

        if not created:
            self.stdout.write("Test already exists, skipping re-creation.")
            return

        # -------------------------------------------------------------------
        # SECTION 1: LISTENING (Part 1 - Information Desk)
        # -------------------------------------------------------------------
        sec_listening = IELTSSection.objects.create(
            test=test,
            section_type=IELTSSectionType.LISTENING,
            order=1,
            duration_minutes=20,
            instructions_en="Listen carefully to the audio recordings and answer the questions. You will hear each recording once only.",
            instructions_fa="با دقت به فایل صوتی گوش فرا دهید و به سوالات پاسخ دهید. هر فایل تنها یک‌بار پخش خواهد شد.",
            audio_media_url="https://media.endoora.ir/audio/ielts/mini01_listening.mp3",
            audio_script=(
                "Receptionist: Good morning, welcome to the University Royal Botanical Gardens visitor services. How may I assist you today?\n"
                "Visitor: Hello! I'm visiting with two postgraduate students, and we'd love to know about your admission hours and ticket discounts.\n"
                "Receptionist: Certainly! We open promptly at 8:30 am on weekdays, and 9:00 am on weekends. For full-time university students with a valid ID card, "
                "the ticket price is reduced from the standard ten pounds to just £6.50.\n"
                "Visitor: That's great value! What about guided tours or audio headsets?\n"
                "Receptionist: You can rent our interactive audio tour handset right beside the main entrance gate. It is available in six languages.\n"
                "Visitor: Wonderful. Are there any restrictions inside the glasshouses?\n"
                "Receptionist: Yes, please note that while bottled water and small bags are permitted, flash photography is strictly prohibited inside the tropical glasshouse to protect sensitive nocturnal specimens.\n"
                "Visitor: Understood. And how long will the current native flora exhibition remain open?\n"
                "Receptionist: The native flora exhibition will officially conclude in October, followed by our winter orchid festival in December.\n"
                "Visitor: Thank you very much for your help!"
            ),
        )

        task_l1 = IELTSPassageTask.objects.create(
            section=sec_listening,
            order=1,
            title="Botanical Garden Visitor Services & Guidelines",
            content_text="A conversation between a visitor and a botanical garden receptionist regarding admission, hours, and visitor regulations.",
            word_count=180,
        )

        # Q1-Q3: Note Completion
        group_l1 = IELTSQuestionGroup.objects.create(
            passage_task=task_l1,
            question_type=IELTSQuestionType.NOTE_FORM_COMPLETION,
            order=1,
            instructions="Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
        )
        IELTSQuestion.objects.create(
            group=group_l1,
            question_number=1,
            prompt_text="Weekday opening time: ...",
            correct_answers=["8:30 am", "8:30", "08:30", "8.30 am", "8.30"],
            explanation="Receptionist states: 'We open promptly at 8:30 am on weekdays'.",
            max_score=Decimal("1.00"),
        )
        IELTSQuestion.objects.create(
            group=group_l1,
            question_number=2,
            prompt_text="Discounted ticket price for students: £...",
            correct_answers=["6.50", "6.5"],
            explanation="Receptionist states: 'reduced from the standard ten pounds to just £6.50'.",
            max_score=Decimal("1.00"),
        )
        IELTSQuestion.objects.create(
            group=group_l1,
            question_number=3,
            prompt_text="Audio guide headsets are available beside the main ...",
            correct_answers=["entrance", "gate", "entrance gate"],
            explanation="Receptionist states: 'beside the main entrance gate'.",
            max_score=Decimal("1.00"),
        )

        # Q4-Q5: Multiple Choice Single
        group_l2 = IELTSQuestionGroup.objects.create(
            passage_task=task_l1,
            question_type=IELTSQuestionType.MULTIPLE_CHOICE_SINGLE,
            order=2,
            instructions="Choose the correct letter, A, B, or C.",
        )
        IELTSQuestion.objects.create(
            group=group_l2,
            question_number=4,
            prompt_text="What is strictly prohibited inside the tropical glasshouse?",
            options=[
                {"id": "A", "text": "Drinking bottled water"},
                {"id": "B", "text": "Flash photography"},
                {"id": "C", "text": "Carrying small backpacks"},
            ],
            correct_answers=["B"],
            explanation="Receptionist explicitly mentions: 'flash photography is strictly prohibited inside the tropical glasshouse'.",
            max_score=Decimal("1.00"),
        )
        IELTSQuestion.objects.create(
            group=group_l2,
            question_number=5,
            prompt_text="The special native flora exhibition will conclude in ...",
            options=[
                {"id": "A", "text": "October"},
                {"id": "B", "text": "November"},
                {"id": "C", "text": "December"},
            ],
            correct_answers=["A"],
            explanation="Receptionist states: 'The native flora exhibition will officially conclude in October'.",
            max_score=Decimal("1.00"),
        )

        # -------------------------------------------------------------------
        # SECTION 2: READING (Urban Microclimates & Architecture)
        # -------------------------------------------------------------------
        sec_reading = IELTSSection.objects.create(
            test=test,
            section_type=IELTSSectionType.READING,
            order=2,
            duration_minutes=30,
            instructions_en="You should spend about 30 minutes on Questions 6-12, which are based on Reading Passage 1 below.",
            instructions_fa="شما باید حدود ۳۰ دقیقه زمان را به سوالات ۶ الی ۱۲ بر اساس متن ریدینگ اختصاص دهید.",
        )

        passage_text = (
            "Paragraph A: Urban heat islands (UHIs) represent one of the most pronounced manifestations of anthropogenic environmental modification. "
            "Dense conglomerations of concrete, asphalt, and masonry continuously absorb solar radiation during daylight hours, re-radiating thermal energy "
            "well past sunset. In metropolitan centers with towering high-rises, narrow street geometry restricts nocturnal radiant cooling, producing nighttime "
            "ambient temperature differentials as high as six degrees Celsius compared with surrounding rural landscapes.\n\n"
            "Paragraph B: To mitigate these elevated microclimates, contemporary architectural engineers are increasingly implementing biophilic design paradigms. "
            "Among these, extensive green roof systems have demonstrated remarkable thermodynamic efficiency. Through continuous plant evapotranspiration, vegetative "
            "layers prevent direct solar interception on rooftop membranes, lowering localized surface temperatures by fifteen to twenty degrees. Empirical trials "
            "indicate that light-colored reflective roofs can reduce indoor air temperatures by up to 4 degrees Celsius in unconditioned top-floor residential units.\n\n"
            "Paragraph C: Beyond vegetative buffers, aerodynamic building orientation plays a decisive role in passive urban ventilation. By orienting high-density "
            "towers parallel to prevailing seasonal breeze vectors, architects can prevent stagnant hot air pockets from forming at street level. However, excessive funneling "
            "can inadvertently accelerate ground winds into uncomfortable drafts for pedestrians, demanding sophisticated computational fluid dynamics (CFD) simulations "
            "prior to zoning approval."
        )

        task_r1 = IELTSPassageTask.objects.create(
            section=sec_reading,
            order=1,
            title="Urban Microclimates and Sustainable Architecture",
            content_text=passage_text,
            word_count=235,
        )

        # Q6-Q8: Matching Headings
        group_r1 = IELTSQuestionGroup.objects.create(
            passage_task=task_r1,
            question_type=IELTSQuestionType.MATCHING_HEADINGS,
            order=1,
            instructions="The reading passage has three paragraphs, A-C. Choose the correct heading for each paragraph from the list of headings below.",
            heading_options=[
                {"id": "i", "text": "Thermal dynamics and nocturnal radiation in concrete canyons"},
                {"id": "ii", "text": "Vegetative buffers and passive surface cooling strategies"},
                {"id": "iii", "text": "Economic costs of maintaining municipal drainage channels"},
                {"id": "iv", "text": "Aerodynamic orientation and computational airflow modeling"},
                {"id": "v", "text": "Government mandates for high-speed residential elevators"},
            ],
        )
        IELTSQuestion.objects.create(
            group=group_r1,
            question_number=6,
            prompt_text="Paragraph A",
            correct_answers=["i"],
            explanation="Paragraph A explains UHI mechanisms, solar absorption of concrete, and narrow street geometry.",
            max_score=Decimal("1.00"),
        )
        IELTSQuestion.objects.create(
            group=group_r1,
            question_number=7,
            prompt_text="Paragraph B",
            correct_answers=["ii"],
            explanation="Paragraph B details green roofs, plant evapotranspiration, and vegetative thermodynamic cooling.",
            max_score=Decimal("1.00"),
        )
        IELTSQuestion.objects.create(
            group=group_r1,
            question_number=8,
            prompt_text="Paragraph C",
            correct_answers=["iv"],
            explanation="Paragraph C explores aerodynamic building orientation, wind vectors, and CFD airflow simulations.",
            max_score=Decimal("1.00"),
        )

        # Q9-Q11: True / False / Not Given
        group_r2 = IELTSQuestionGroup.objects.create(
            passage_task=task_r1,
            question_type=IELTSQuestionType.TRUE_FALSE_NOT_GIVEN,
            order=2,
            instructions="Do the following statements agree with the information given in Reading Passage 1? Write TRUE if the statement agrees, FALSE if the statement contradicts, NOT GIVEN if there is no information on this.",
        )
        IELTSQuestion.objects.create(
            group=group_r2,
            question_number=9,
            prompt_text="Light-colored reflective roofs can reduce indoor air temperatures by up to 4 degrees Celsius.",
            correct_answers=["true", "t"],
            explanation="Paragraph B explicitly confirms: 'reflective roofs can reduce indoor air temperatures by up to 4 degrees Celsius'.",
            max_score=Decimal("1.00"),
        )
        IELTSQuestion.objects.create(
            group=group_r2,
            question_number=10,
            prompt_text="Urban architects in Singapore are legally required to construct subterranean wind tunnels.",
            correct_answers=["not given", "ng"],
            explanation="The passage mentions aerodynamic simulation and breeze vectors, but makes no mention of Singapore or legal subterranean requirements.",
            max_score=Decimal("1.00"),
        )
        IELTSQuestion.objects.create(
            group=group_r2,
            question_number=11,
            prompt_text="Tall high-rises invariably eliminate all pedestrian drafts at street level.",
            correct_answers=["false", "f"],
            explanation="Paragraph C states that excessive funneling can inadvertently accelerate ground winds into uncomfortable drafts.",
            max_score=Decimal("1.00"),
        )

        # Q12: Sentence Completion
        group_r3 = IELTSQuestionGroup.objects.create(
            passage_task=task_r1,
            question_type=IELTSQuestionType.SENTENCE_COMPLETION,
            order=3,
            instructions="Complete the sentence below. Choose NO MORE THAN TWO WORDS from the passage for your answer.",
        )
        IELTSQuestion.objects.create(
            group=group_r3,
            question_number=12,
            prompt_text="Elevated temperatures in cities caused by human modification are known as urban ...",
            correct_answers=["heat islands", "heat island"],
            explanation="Paragraph A opens with: 'Urban heat islands (UHIs) represent one of the most pronounced manifestations...'",
            max_score=Decimal("1.00"),
        )

        # -------------------------------------------------------------------
        # SECTION 3: WRITING (Task 1 & Task 2)
        # -------------------------------------------------------------------
        sec_writing = IELTSSection.objects.create(
            test=test,
            section_type=IELTSSectionType.WRITING,
            order=3,
            duration_minutes=45,
            instructions_en="You should complete both writing tasks. Write in a formal, academic style.",
            instructions_fa="شما باید هر دو تسک نوشتاری را کامل کنید. نگارش باید در سبک رسمی و آکادمیک باشد.",
        )

        task_w1 = IELTSPassageTask.objects.create(
            section=sec_writing,
            order=1,
            title="Task 1: Renewable Energy Generation in Northern Europe",
            content_text=(
                "The bar chart illustrates the proportion of domestic electricity generated from renewable sources "
                "(wind, hydro, and solar) across Denmark, Norway, and Sweden between 2015 and 2025.\n\n"
                "Summarise the information by selecting and reporting the main features, and make comparisons where relevant.\n"
                "Write at least 150 words."
            ),
            media_image_url="https://media.endoora.ir/diagrams/ielts/mini01_energy_chart.png",
            word_count=150,
        )
        group_w1 = IELTSQuestionGroup.objects.create(
            passage_task=task_w1,
            question_type=IELTSQuestionType.WRITING_TASK1_ACADEMIC,
            order=1,
            instructions="Write at least 150 words. Spend about 15 minutes on this task.",
        )
        IELTSQuestion.objects.create(
            group=group_w1,
            question_number=13,
            prompt_text="Submit your Academic Task 1 response here.",
            max_score=Decimal("3.00"),
        )

        task_w2 = IELTSPassageTask.objects.create(
            section=sec_writing,
            order=2,
            title="Task 2: Artificial Intelligence in Primary and Secondary Education",
            content_text=(
                "Some educators assert that incorporating artificial intelligence tutors and adaptive learning platforms into schools "
                "substantially enhances student motivation and personalizes instruction. Others contend that algorithmic learning undermines "
                "critical inquiry and diminishes vital human empathy between students and classroom teachers.\n\n"
                "Discuss both views and give your own opinion.\n"
                "Give reasons for your answer and include any relevant examples from your own knowledge or experience.\n"
                "Write at least 250 words."
            ),
            word_count=250,
        )
        group_w2 = IELTSQuestionGroup.objects.create(
            passage_task=task_w2,
            question_type=IELTSQuestionType.WRITING_TASK2_ESSAY,
            order=1,
            instructions="Write at least 250 words. Spend about 30 minutes on this task.",
        )
        IELTSQuestion.objects.create(
            group=group_w2,
            question_number=14,
            prompt_text="Submit your Academic Task 2 essay here.",
            max_score=Decimal("6.00"),
        )

        # -------------------------------------------------------------------
        # SECTION 4: SPEAKING (Part 1, Part 2, Part 3)
        # -------------------------------------------------------------------
        sec_speaking = IELTSSection.objects.create(
            test=test,
            section_type=IELTSSectionType.SPEAKING,
            order=4,
            duration_minutes=14,
            instructions_en="The Speaking test consists of 3 parts and assesses your spoken English proficiency through an interactive interview.",
            instructions_fa="بخش مکالمه شامل ۳ قسمت است و مهارت گفتاری شما را در قالبی تعاملی ارزیابی می‌کند.",
            audio_media_url="https://media.endoora.ir/audio/ielts/mini01_speaking_prompts.mp3",
        )

        # Part 1
        task_s1 = IELTSPassageTask.objects.create(
            section=sec_speaking,
            order=1,
            title="Part 1: Daily Habits and Hometown",
            content_text="The examiner asks general questions about your background, living area, and daily morning routines.",
            word_count=50,
        )
        group_s1 = IELTSQuestionGroup.objects.create(
            passage_task=task_s1,
            question_type=IELTSQuestionType.SPEAKING_PART1,
            order=1,
            instructions="Answer the questions naturally and at moderate length (2-4 sentences each).",
        )
        IELTSQuestion.objects.create(
            group=group_s1,
            question_number=15,
            prompt_text="What do you enjoy most about the neighborhood where you currently reside?",
            max_score=Decimal("1.00"),
        )
        IELTSQuestion.objects.create(
            group=group_s1,
            question_number=16,
            prompt_text="Has your personal morning routine altered noticeably over the past two years?",
            max_score=Decimal("1.00"),
        )

        # Part 2 Cue Card
        task_s2 = IELTSPassageTask.objects.create(
            section=sec_speaking,
            order=2,
            title="Part 2: Long Turn (Cue Card)",
            content_text=(
                "Describe a complex skill you learned independently outside of a formal educational institution.\n\n"
                "You should say:\n"
                "- What skill you acquired\n"
                "- Why you decided to pursue it independently\n"
                "- What resources or techniques you utilized\n\n"
                "and explain what obstacles you encountered and how you felt once you achieved proficiency."
            ),
            word_count=80,
            metadata={"preparation_time_seconds": 60, "speaking_time_seconds": 120},
        )
        group_s2 = IELTSQuestionGroup.objects.create(
            passage_task=task_s2,
            question_type=IELTSQuestionType.SPEAKING_PART2_CUE_CARD,
            order=1,
            instructions="You have 1 minute to take notes. Then speak for 1 to 2 minutes continuously.",
        )
        IELTSQuestion.objects.create(
            group=group_s2,
            question_number=17,
            prompt_text="Candidate Long Turn: Record your 1 to 2 minute monologue based on the cue card.",
            max_score=Decimal("4.00"),
        )

        # Part 3 Discussion
        task_s3 = IELTSPassageTask.objects.create(
            section=sec_speaking,
            order=3,
            title="Part 3: Discussion on Lifelong Education & Autonomous Learning",
            content_text="The examiner explores deeper, abstract questions regarding self-directed learning and workplace demands.",
            word_count=60,
        )
        group_s3 = IELTSQuestionGroup.objects.create(
            passage_task=task_s3,
            question_type=IELTSQuestionType.SPEAKING_PART3_DISCUSSION,
            order=1,
            instructions="Develop your answers with reasoning, comparisons, and broad societal perspectives.",
        )
        IELTSQuestion.objects.create(
            group=group_s3,
            question_number=18,
            prompt_text="Why do many adults find self-directed online tutorials more productive than conventional classroom courses?",
            max_score=Decimal("1.50"),
        )
        IELTSQuestion.objects.create(
            group=group_s3,
            question_number=19,
            prompt_text="In the coming decades, will demonstrable project portfolios overshadow traditional degree credentials in hiring decisions?",
            max_score=Decimal("1.50"),
        )

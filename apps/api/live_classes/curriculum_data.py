"""
Pre-seeded catalog of standard textbooks and syllabus mappings for Endoora.
Reflects standard Iranian language institutes (Kish, Safir, Iran-Mehr, ILI) and international exams.
"""

CURRICULUM_SEEDS = [
    # -------------------------------------------------------------
    # ADULT GENERAL TRACK: American English File (Oxford)
    # -------------------------------------------------------------
    {
        "slug": "aef-starter",
        "track": "adult_general",
        "min_cefr": "A1",
        "max_cefr": "A1",
        "min_age": 14,
        "max_age": 99,
        "book_title": "American English File Starter",
        "publisher": "Oxford University Press",
        "edition": "3rd Edition",
        "description_fa": "دوره بنیادین زبان انگلیسی برای زبان‌آموزان مبتدی؛ آموزش اصوات پایه، الفبا، مکالمات روزمره و الگوهای ساده جمله‌سازی.",
        "description_en": "Foundational course for beginners covering basic phonics, everyday expressions, and simple declarative/interrogative structures.",
        "cover_image_url": "/images/curriculum/aef-starter.jpg",
        "syllabus_json": {
            "total_units": 12,
            "estimated_weeks": 10,
            "current_recommended_unit": 1,
            "grammar_milestones": [
                "Verb to be (am/is/are) in affirmative, negative, and questions",
                "Singular and plural nouns, demonstratives (this/that/these/those)",
                "Present simple: affirmative, negative, questions (do/does)",
                "Possessive adjectives and 's genitive",
                "Adverbs of frequency and basic word order",
                "Can / can't for abilities and permissions",
                "Past simple of be (was/were) and regular simple past verbs"
            ],
            "vocabulary_themes": [
                "Greetings and introductions",
                "Numbers, days of the week, countries and nationalities",
                "Common everyday objects and classroom language",
                "Family members and relationships",
                "Daily routines and leisure activities",
                "Telling the time and places in town"
            ],
            "speaking_goals": [
                "Introduce yourself and ask someone's name and nationality",
                "Order food and drink in a basic cafe dialogue",
                "Describe your daily schedule and free time activities",
                "Ask for and understand basic directions in a city"
            ],
            "sample_units": [
                {"unit": 1, "title": "Hello!", "grammar": "Verb to be (am/are)", "speaking": "Saying hello and goodbye"},
                {"unit": 2, "title": "Where are you from?", "grammar": "Verb to be (is/are) + countries", "speaking": "Asking origin"},
                {"unit": 3, "title": "What's this?", "grammar": "Singular/plural nouns + this/that", "speaking": "Identifying objects"},
                {"unit": 4, "title": "My family", "grammar": "Possessive adjectives and 's", "speaking": "Talking about family"},
                {"unit": 5, "title": "A typical day", "grammar": "Simple present (I/you/we/they)", "speaking": "Daily routines"}
            ]
        }
    },
    {
        "slug": "aef-1",
        "track": "adult_general",
        "min_cefr": "A2",
        "max_cefr": "A2",
        "min_age": 14,
        "max_age": 99,
        "book_title": "American English File 1",
        "publisher": "Oxford University Press",
        "edition": "3rd Edition",
        "description_fa": "سطح مقدماتی جامع؛ گسترش زمان‌های گذشته و آینده، توصیف ظواهر و احساسات، و تسلط بر مکالمات سفر و خرید.",
        "description_en": "Comprehensive elementary course expanding past and future tenses, personal descriptions, and practical travel communication.",
        "cover_image_url": "/images/curriculum/aef-1.jpg",
        "syllabus_json": {
            "total_units": 12,
            "estimated_weeks": 12,
            "current_recommended_unit": 1,
            "grammar_milestones": [
                "Present simple vs. Present continuous contrast",
                "Past simple: regular and irregular verbs",
                "Past continuous for interrupted actions",
                "Time sequencers (after that, next, suddenly)",
                "Future forms: be going to vs. present continuous for arrangements",
                "Comparative and superlative adjectives",
                "Present perfect with ever/never"
            ],
            "vocabulary_themes": [
                "Describing appearance, clothes, and personality",
                "Holidays, travel, and vacation experiences",
                "Weather and seasonal plans",
                "Airport and hotel interactions",
                "Shopping, prices, and sizes",
                "Housework and prepositions of movement"
            ],
            "speaking_goals": [
                "Narrate a holiday trip or memorable weekend in the past",
                "Describe ongoing actions and contrast with routine habits",
                "Make plans and invite friends to social events",
                "Compare products and express preferences when shopping"
            ],
            "sample_units": [
                {"unit": 1, "title": "Where are you from?", "grammar": "Word order in questions", "speaking": "Describing people"},
                {"unit": 2, "title": "Vacations", "grammar": "Past simple: regular and irregular", "speaking": "Narrating a vacation"},
                {"unit": 3, "title": "Trip of a lifetime", "grammar": "Be going to (plans and predictions)", "speaking": "Airport situations"},
                {"unit": 4, "title": "House and home", "grammar": "Present perfect + yet/already", "speaking": "Sharing house duties"}
            ]
        }
    },
    {
        "slug": "aef-2",
        "track": "adult_general",
        "min_cefr": "A2",
        "max_cefr": "B1",
        "min_age": 14,
        "max_age": 99,
        "book_title": "American English File 2",
        "publisher": "Oxford University Press",
        "edition": "3rd Edition",
        "description_fa": "سطح پیش‌متوسطه اول؛ تقویت اعتماد به نفس در برقراری ارتباط، استفاده از زمان‌های کامل، و مدیریت موقعیت‌های غیرمنتظره.",
        "description_en": "Pre-intermediate step building fluency in perfect tenses, modal verbs of obligation, and problem-solving conversations.",
        "cover_image_url": "/images/curriculum/aef-2.jpg",
        "syllabus_json": {
            "total_units": 12,
            "estimated_weeks": 12,
            "current_recommended_unit": 1,
            "grammar_milestones": [
                "Present perfect with for and since",
                "Modals of obligation and permission (must, have to, should)",
                "First conditional (if + present, will + infinitive)",
                "Second conditional (if + past, would + infinitive)",
                "Passive voice (present and past simple)",
                "Reported speech basics",
                "Gerunds vs. Infinitives"
            ],
            "vocabulary_themes": [
                "Money, spending, and banking idioms",
                "Education systems, studying, and discipline",
                "Health, illness, and medical visits",
                "Work, careers, and office environments",
                "Cinema, movies, and character types"
            ],
            "speaking_goals": [
                "Give advice and recommendations for health and lifestyle problems",
                "Discuss hypothetical situations and life dilemmas",
                "Express personal opinions about movies, books, and news stories",
                "Handle complaints in hotels and restaurants"
            ],
            "sample_units": [
                {"unit": 1, "title": "Money matters", "grammar": "Present perfect vs. Past simple", "speaking": "Financial habits"},
                {"unit": 2, "title": "Changing lives", "grammar": "Present perfect continuous", "speaking": "Life changes"},
                {"unit": 3, "title": "Survive the drive", "grammar": "Comparative structures", "speaking": "Transportation"},
                {"unit": 4, "title": "Rules of the road", "grammar": "Must, have to, should", "speaking": "Discussing regulations"}
            ]
        }
    },
    {
        "slug": "aef-3",
        "track": "adult_general",
        "min_cefr": "B1",
        "max_cefr": "B1",
        "min_age": 14,
        "max_age": 99,
        "book_title": "American English File 3",
        "publisher": "Oxford University Press",
        "edition": "3rd Edition",
        "description_fa": "سطح متوسطه؛ توانایی بحث و استدلال، روایت رویدادهای پیچیده، درک رادیو و پادکست، و استفاده دقیق از اصطلاحات.",
        "description_en": "Intermediate flagship course focusing on discussion, debating, nuanced narrative tenses, and natural idiomatic flow.",
        "cover_image_url": "/images/curriculum/aef-3.jpg",
        "syllabus_json": {
            "total_units": 10,
            "estimated_weeks": 12,
            "current_recommended_unit": 1,
            "grammar_milestones": [
                "Narrative tenses: Past simple, past continuous, and past perfect",
                "Modals of deduction (might, can't, must)",
                "Third conditional and wish structures",
                "Quantifiers and determiners (few, little, both, neither)",
                "Relative clauses (defining and non-defining)",
                "Question tags and indirect questions",
                "Phrasal verbs in context"
            ],
            "vocabulary_themes": [
                "Food, cooking styles, and culinary traditions",
                "Personality adjectives and character analysis",
                "Crime, justice, and courtroom terminology",
                "Media, journalism, and social networking",
                "Advertising methods and consumer psychology"
            ],
            "speaking_goals": [
                "Participate actively in group debates and defend arguments with reasons",
                "Speculate about past and present mysteries using deduction modals",
                "Ask polite indirect questions in formal or professional scenarios",
                "Summarize and critique short articles, documentaries, or news reports"
            ],
            "sample_units": [
                {"unit": 1, "title": "Mood food", "grammar": "Present simple & continuous, action/non-action verbs", "speaking": "Food & lifestyle"},
                {"unit": 2, "title": "Family fortunes", "grammar": "Present perfect simple & continuous", "speaking": "Family relationships"},
                {"unit": 3, "title": "Ka-ching!", "grammar": "Comparatives and superlatives", "speaking": "Spending & saving"},
                {"unit": 4, "title": "Stereotypes", "grammar": "Articles: a/an, the, no article", "speaking": "Cultural myths"}
            ]
        }
    },
    {
        "slug": "aef-4",
        "track": "adult_general",
        "min_cefr": "B2",
        "max_cefr": "B2",
        "min_age": 14,
        "max_age": 99,
        "book_title": "American English File 4",
        "publisher": "Oxford University Press",
        "edition": "3rd Edition",
        "description_fa": "سطح فوق‌متوسطه؛ تسلط بر واژگان تخصصی و آکادمیک، مهارت‌های ظریف بیانی، استعاره‌ها و شرکت در جلسات و سمینارها.",
        "description_en": "Upper-intermediate curriculum mastering academic discourse, subtle modal nuances, advanced passives, and spontaneous discussions.",
        "cover_image_url": "/images/curriculum/aef-4.jpg",
        "syllabus_json": {
            "total_units": 10,
            "estimated_weeks": 14,
            "current_recommended_unit": 1,
            "grammar_milestones": [
                "Discourse markers and linking devices (linkers of concession & result)",
                "Inversion with negative adverbials (Not only, Seldom, Never before)",
                "Mixed conditionals and hypothetical inversion (Had I known...)",
                "Advanced passive structures (It is believed that... / He is thought to be...)",
                "Cleft sentences for emphasis (What I really liked was...)",
                "Future perfect and future continuous",
                "Ellipsis and substitution"
            ],
            "vocabulary_themes": [
                "Collocations with make, do, take, and have",
                "Advanced expressions for emotions and psychological reactions",
                "Environment, ecology, and climate crisis terms",
                "Business, negotiations, and leadership vocabulary",
                "Slang, registers, and idiomatic expressions"
            ],
            "speaking_goals": [
                "Deliver a structured 5-minute presentation with clear transitions",
                "Negotiate compromises in workplace or academic simulations",
                "Identify subtle bias or emotional stance in spoken interactions",
                "Express nuanced agreement and diplomatic disagreement"
            ],
            "sample_units": [
                {"unit": 1, "title": "Q&A", "grammar": "Question formation, auxiliary verbs", "speaking": "Job interview strategies"},
                {"unit": 2, "title": "Do you believe in it?", "grammar": "Present perfect simple vs. continuous", "speaking": "Mysteries & belief"},
                {"unit": 3, "title": "Air travel", "grammar": "Narrative tenses, past perfect continuous", "speaking": "Flight anecdotes"},
                {"unit": 4, "title": "Extreme weather", "grammar": "Future perfect and future continuous", "speaking": "Climate forecast"}
            ]
        }
    },
    {
        "slug": "aef-5",
        "track": "adult_general",
        "min_cefr": "C1",
        "max_cefr": "C2",
        "min_age": 16,
        "max_age": 99,
        "book_title": "American English File 5",
        "publisher": "Oxford University Press",
        "edition": "3rd Edition",
        "description_fa": "سطح پیشرفته C1–C2؛ زبان تحلیلی، متون تخصصی دانشگاهی و مطبوعاتی، واژگان سطح بالا و تسلط هم‌تراز گویشور بومی.",
        "description_en": "Advanced C1/C2 course delivering near-native fluency, complex syntax, academic style, and deep cultural idioms.",
        "cover_image_url": "/images/curriculum/aef-5.jpg",
        "syllabus_json": {
            "total_units": 10,
            "estimated_weeks": 14,
            "current_recommended_unit": 1,
            "grammar_milestones": [
                "Advanced hedging and tentative language in professional discourse",
                "Subjunctive moods and formal structures",
                "Participle clauses (-ing and -ed clauses replacing relative clauses)",
                "Complex prepositional phrases and binomials (pros and cons, give and take)",
                "Compound adjectives and multi-word verbs in academic registers",
                "Nuanced intonation and pragmatic tone modulation"
            ],
            "vocabulary_themes": [
                "Academic collocations and abstract concepts",
                "Political systems, governance, and civic discourse",
                "Philosophy, cognition, and neuroscience metaphors",
                "Artistic critiques, literature review terms",
                "Sophisticated rhetorical devices"
            ],
            "speaking_goals": [
                "Conduct critical academic reviews and thesis defense simulations",
                "Navigate high-stakes executive meetings and diplomacy scenarios",
                "Detect irony, sarcasm, and subtext across diverse native accents",
                "Formulate comprehensive spontaneous arguments on multifaceted dilemmas"
            ],
            "sample_units": [
                {"unit": 1, "title": "Self-portrait", "grammar": "Discourse markers; connectors", "speaking": "Introspection and identity"},
                {"unit": 2, "title": "Modern dilemmas", "grammar": "Have: auxiliary or main verb", "speaking": "Bioethics & ethics"},
                {"unit": 3, "title": "Sound and silence", "grammar": "Pronouns: generic pronouns", "speaking": "Urban noise vs quietude"}
            ]
        }
    },
    {
        "slug": "cambridge-cae",
        "track": "exam_prep_advanced",
        "min_cefr": "C1",
        "max_cefr": "C2",
        "min_age": 16,
        "max_age": 99,
        "book_title": "Cambridge English Advanced (CAE) Prep Series",
        "publisher": "Cambridge Assessment English",
        "edition": "Official Cambridge Guide",
        "description_fa": "مجموعه رسمی آمادگی آزمون بین‌المللی C1 Advanced (CAE)؛ شامل تکنیک‌های هر ۴ مهارت و تمرین با نمونه سوالات واقعی.",
        "description_en": "Official Cambridge preparation course for C1 Advanced certificate, targeted at professional credentials and university admission.",
        "cover_image_url": "/images/curriculum/cambridge-cae.jpg",
        "syllabus_json": {
            "total_units": 10,
            "estimated_weeks": 14,
            "current_recommended_unit": 1,
            "grammar_milestones": [
                "Key word transformations (Sentence completion with strict rules)",
                "Inversion and emphatic structures for academic writing",
                "Advanced participle clauses and nominalization",
                "Register shifting (formal essay vs. persuasive proposal vs. critique)"
            ],
            "vocabulary_themes": [
                "C1 academic and formal collocations",
                "Fixed expressions and idioms in Reading Part 1",
                "Discourse connectives and advanced linkers"
            ],
            "speaking_goals": [
                "CAE Speaking Part 2: Long turn (comparative photo analysis with speculation)",
                "CAE Speaking Part 3: Collaborative task and decision making",
                "CAE Speaking Part 4: Extended discussion on abstract topics"
            ],
            "sample_units": [
                {"unit": 1, "title": "Our world", "grammar": "Conditional inversion", "speaking": "Environmental dialogue"},
                {"unit": 2, "title": "Mastering the essay", "grammar": "Nominalization", "speaking": "Persuasive argumentation"}
            ]
        }
    },

    # -------------------------------------------------------------
    # YOUNG LEARNERS TRACK (KIDS & TEENS)
    # -------------------------------------------------------------
    {
        "slug": "family-and-friends-starter",
        "track": "young_learners",
        "min_cefr": "A1",
        "max_cefr": "A1",
        "min_age": 4,
        "max_age": 7,
        "book_title": "Family and Friends Starter / Level 1",
        "publisher": "Oxford University Press",
        "edition": "2nd Edition",
        "description_fa": "ویژه کودکان ۴ تا ۷ سال؛ آموزش الفبا و صداها (Phonics)، ترانه‌های شاد کودکانه، داستان‌های مصور، و مکالمات شیرین ساده.",
        "description_en": "Specialized course for young children (ages 4–7) featuring synthetic phonics, engaging songs, colorful stories, and social routines.",
        "cover_image_url": "/images/curriculum/family-friends.jpg",
        "syllabus_json": {
            "total_units": 10,
            "estimated_weeks": 12,
            "current_recommended_unit": 1,
            "grammar_milestones": [
                "Alphabet phonics (a to z letter sounds)",
                "Simple greetings: Hello, Goodbye, What's your name?",
                "Colors and numbers (1 to 20)",
                "What is it? It's a pencil / It's a ball",
                "This is my family / Is this your teddy?"
            ],
            "vocabulary_themes": [
                "Alphabet sounds and initial letters",
                "Colors, shapes, and counting toys",
                "School supplies (pencil, rubber, ruler, book)",
                "Family members (mom, dad, brother, sister)",
                "Animals and body parts"
            ],
            "speaking_goals": [
                "Sing phonics songs and pronounce letter sounds correctly",
                "Identify and name everyday toys and classroom objects",
                "Point and say family members in a family portrait"
            ],
            "sample_units": [
                {"unit": 1, "title": "First friends", "grammar": "What's your name? I'm Tim", "speaking": "Hello song"},
                {"unit": 2, "title": "My classroom", "grammar": "What's this? It's a book", "speaking": "Classroom game"}
            ]
        }
    },
    {
        "slug": "oxford-discover-superminds",
        "track": "young_learners",
        "min_cefr": "A1",
        "max_cefr": "A2",
        "min_age": 8,
        "max_age": 12,
        "book_title": "Oxford Discover / Super Minds Series",
        "publisher": "Oxford / Cambridge",
        "edition": "Contemporary Edition",
        "description_fa": "ویژه رده سنی ۸ تا ۱۲ سال؛ ترکیب زبان‌آموزی با تفکر نقادانه، پروژه‌های علمی کودکانه، داستان‌گویی، و گفتگوی گروهی پویا.",
        "description_en": "Inquiry-based English for learners aged 8–12 combining critical thinking, CLIL content, storytelling, and structured speaking.",
        "cover_image_url": "/images/curriculum/oxford-discover.jpg",
        "syllabus_json": {
            "total_units": 10,
            "estimated_weeks": 12,
            "current_recommended_unit": 1,
            "grammar_milestones": [
                "Present simple and present continuous in stories",
                "Past simple of common action verbs",
                "Comparative adjectives (bigger, faster, stronger)",
                "Must and mustn't for rules and safety",
                "Questions with who, what, where, when, why"
            ],
            "vocabulary_themes": [
                "Nature, habitats, and endangered species",
                "Inventions and technological wonders",
                "Healthy food and active sports",
                "Communities, professions, and teamwork"
            ],
            "speaking_goals": [
                "Present a mini science project in English to classmates",
                "Narrate an adventure story based on picture prompts",
                "Participate in roleplays asking for information and giving opinions"
            ],
            "sample_units": [
                {"unit": 1, "title": "How do animals adapt?", "grammar": "Present simple facts", "speaking": "Animal presentation"},
                {"unit": 2, "title": "Past heroes", "grammar": "Past simple verbs", "speaking": "Historic storytelling"}
            ]
        }
    },

    # -------------------------------------------------------------
    # EXAM PREPARATION TRACK (IELTS & TOEFL - IRAN HIGH DEMAND)
    # -------------------------------------------------------------
    {
        "slug": "cambridge-ielts-series",
        "track": "exam_prep_ielts",
        "min_cefr": "B1",
        "max_cefr": "C2",
        "min_age": 15,
        "max_age": 99,
        "book_title": "Cambridge IELTS Practice Series & Road to IELTS",
        "publisher": "Cambridge University Press",
        "edition": "Official Past Papers (Tests 11–19) + Road to IELTS",
        "description_fa": "دوره تخصصی آمادگی آزمون آیلتس (Academic & General)؛ کار بر روی نمونه سوالات واقعی کمبریج، متدهای تست‌زنی ریدینگ و لیسنینگ، و ارزیابی تحلیلی رایتینگ و اسپیکینگ.",
        "description_en": "Authentic IELTS preparation utilizing Cambridge official examination papers (11–19), Road to IELTS, and Target Band 7 strategies.",
        "cover_image_url": "/images/curriculum/cambridge-ielts.jpg",
        "syllabus_json": {
            "total_units": 8,
            "estimated_weeks": 12,
            "current_recommended_unit": 1,
            "grammar_milestones": [
                "Task 1 descriptive grammar: Trends, proportions, comparative data structures",
                "Task 2 essay grammar: Complex sentences, concession clauses, passive academic style",
                "Cohesion and coherence markers across band 7+ criteria",
                "Syntactic variety and precision under timed conditions"
            ],
            "vocabulary_themes": [
                "Academic Word List (AWL) core sublists 1 through 10",
                "Collocations for science, technology, environment, urbanization, and education",
                "Band 8+ lexical resource substitutions and topic-specific vocabulary"
            ],
            "speaking_goals": [
                "IELTS Speaking Part 1: Fluency, hesitation reduction, and immediate topic engagement",
                "IELTS Speaking Part 2: 2-minute uninterrupted monologue on cue card with rich narrative",
                "IELTS Speaking Part 3: Deep analytical discussion answering abstract social queries"
            ],
            "sample_units": [
                {"unit": 1, "title": "IELTS Diagnostic Test 1", "grammar": "Describing trends & line graphs", "speaking": "Part 1 introductory questions"},
                {"unit": 2, "title": "Reading Speed & True/False/Not Given", "grammar": "Paraphrasing structures", "speaking": "Part 2 cue card practice"},
                {"unit": 3, "title": "Writing Task 2: Agree/Disagree Essays", "grammar": "Concession & counter-argument", "speaking": "Part 3 abstract reasoning"}
            ]
        }
    },
    {
        "slug": "barrons-toefl-ibt",
        "track": "exam_prep_toefl",
        "min_cefr": "B1",
        "max_cefr": "C2",
        "min_age": 15,
        "max_age": 99,
        "book_title": "Barron's TOEFL iBT & Delta's Key",
        "publisher": "Barron's Educational Series / Delta",
        "edition": "17th Edition",
        "description_fa": "دوره جامع آمادگی آزمون تافل iBT؛ تقویت مهارت‌های تلفیقی (Integrated Tasks)، نوت‌برداری حرفه‌ای، و مدیریت زمان هوشمند در آزمون کامپیوتری.",
        "description_en": "Comprehensive TOEFL iBT preparation covering Barron's full-length tests, Delta's Key strategies, note-taking, and integrated tasks.",
        "cover_image_url": "/images/curriculum/barrons-toefl.jpg",
        "syllabus_json": {
            "total_units": 8,
            "estimated_weeks": 12,
            "current_recommended_unit": 1,
            "grammar_milestones": [
                "Synthesizing multiple viewpoints (Read -> Listen -> Speak/Write)",
                "Transitions for integrated essays and oral summaries",
                "Precise academic paraphrasing without verbatim copying"
            ],
            "vocabulary_themes": [
                "Essential Words for the TOEFL (Barron's 500 words)",
                "Campus conversation idiomatic expressions",
                "Academic lecture vocabulary (Anthropology, Astronomy, Biology, Economics)"
            ],
            "speaking_goals": [
                "Integrated Speaking Task 2: Campus announcement and student reaction synthesis",
                "Integrated Speaking Task 3: Academic concept and professor example explanation",
                "Integrated Speaking Task 4: Academic lecture summary under strict 60s recording timer"
            ],
            "sample_units": [
                {"unit": 1, "title": "TOEFL Reading: Inference & Vocabulary Questions", "grammar": "Sentence simplification", "speaking": "Independent opinion"},
                {"unit": 2, "title": "Integrated Listening & Note-taking", "grammar": "Cause-and-effect markers", "speaking": "Campus situation synthesis"}
            ]
        }
    },
    {
        "slug": "4000-essential-english-words",
        "track": "exam_prep_ielts",
        "min_cefr": "A2",
        "max_cefr": "C1",
        "min_age": 13,
        "max_age": 99,
        "book_title": "4000 Essential English Words & Essential Words for TOEFL",
        "publisher": "Compass Publishing / Barron's",
        "edition": "2nd Edition (Books 1–6)",
        "description_fa": "مجموعه مرجع تقویت واژگان کاربردی و آزمونی بر پایه فرکانس کاربرد؛ همراه با تمرینات تثبیت حافظه و درک متن در بافت داستان.",
        "description_en": "Foundational and advanced vocabulary acquisition series (Books 1-6) categorizing high-frequency target words for IELTS/TOEFL success.",
        "cover_image_url": "/images/curriculum/4000-words.jpg",
        "syllabus_json": {
            "total_units": 30,
            "estimated_weeks": 15,
            "current_recommended_unit": 1,
            "grammar_milestones": [
                "Word families (noun/verb/adjective/adverb transformations)",
                "Collocations and prepositional combinations",
                "Prefixes and suffixes indicating meaning"
            ],
            "vocabulary_themes": [
                "Targeted frequency tiers (Book 1: 500-1000, up to Book 6: 4000+ words)",
                "Contextual usage in narrative reading passages",
                "Antonyms, synonyms, and connotation distinctions"
            ],
            "speaking_goals": [
                "Incorporate newly acquired target vocabulary into daily conversations",
                "Retell short reading stories utilizing minimum 5 target words accurately"
            ],
            "sample_units": [
                {"unit": 1, "title": "Unit 1: Everyday actions", "grammar": "Word forms", "speaking": "Describing routines"},
                {"unit": 2, "title": "Unit 2: Science & discovery", "grammar": "Adjective suffixes", "speaking": "Explaining concepts"}
            ]
        }
    }
]

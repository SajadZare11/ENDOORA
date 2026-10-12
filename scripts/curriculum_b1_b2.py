# -*- coding: utf-8 -*-
"""
B1 and B2 Cases for Writing Clue Hunter:
Theme: 'noir-evidence-board' (اتاق مدارک کارآگاه نوآر با نخ‌های قرمز)
"""

B1_CASES = [
  {
    "levelNumber": 1,
    "cefr": "B1",
    "theme": "noir-evidence-board",
    "themeTitleFa": "اتاق مدارک کارآگاه نوآر",
    "caseCode": "CASE-B1-01",
    "stageTitleEn": "The Midnight Alibi: Narrative Sequencing",
    "stageTitleFa": "شاهد نیمه‌شب: توالی زمانی و کلمات ربط روایی",
    "scenarioFa": "ساعت ۱۲ شب از موزه جواهرات سرقت شده. برای اثبات دروغ مظنون، باید توالی کارهای شب گذشته را با کلمات ربط زمانی مثل Meanwhile و Afterward به هم بدوزی.",
    "locationFa": "اتاق بازجویی اداره پلیس",
    "pillar": "connectors-cohesion",
    "xpReward": 100,
    "timeLimitSeconds": 75,
    "round1": {
      "id": "w-b1-1-r1",
      "roundTitleFa": "اتصال شواهد با نخ قرمز",
      "promptFa": "کارت‌های شواهد را طوری بچین که توالی زمانی دقیق خروج مظنون مشخص شود:",
      "promptEn": "Link the evidence fragments in chronological sequence:",
      "hintFa": "ابتدا قید زمان Initially یا First می‌آید و سپس فاعل و فعل گذشته.",
      "goldenRuleFa": "نکته طلایی: Initially, the suspect claimed he was asleep at home.",
      "scrambledChips": [
        { "id": "c1", "text": "Initially," },
        { "id": "c2", "text": "the" },
        { "id": "c3", "text": "suspect" },
        { "id": "c4", "text": "denied" },
        { "id": "c5", "text": "being" },
        { "id": "c6", "text": "at" },
        { "id": "c7", "text": "the" },
        { "id": "c8", "text": "museum." },
        { "id": "d1", "text": "deny", "isDistractor": True, "distractorReasonFa": "برای گزارش گذشته باید از شکل زمان گذشته denied استفاده شود." }
      ],
      "correctSequence": ["Initially,", "the", "suspect", "denied", "being", "at", "the", "museum."],
      "assembledSentence": "Initially, the suspect denied being at the museum."
    },
    "round2": {
      "id": "w-b1-1-r2",
      "roundTitleFa": "گره زدن دو مدرک متناقض",
      "contextFa": "مظنون ادعا کرد خواب بوده در حالی که دوربین‌ها خودرویش را ثبت کردند:",
      "sentenceA": "The suspect claimed he was asleep",
      "sentenceB": "traffic cameras recorded his vehicle.",
      "targetSlot": "The suspect claimed he was asleep; [___], traffic cameras recorded his vehicle.",
      "connectorOptions": [
        { "text": "however", "isCorrect": True, "explanationFa": "however برای پیوند دو گزاره متناقض و رد کردن ادعا در گزارش جنایی بهترین است." },
        { "text": "therefore", "isCorrect": False, "explanationFa": "دوربین‌ها نتیجه خواب بودن او نیستند." },
        { "text": "furthermore", "isCorrect": False, "explanationFa": "این مدرک تاییدکننده ادعای او نیست، بلکه ردکننده آن است." }
      ],
      "lexicalUpgrade": {
        "originalWord": "said",
        "promptFa": "فعل رسمی‌تر و قضایی‌تر برای ادعا کردن انتخاب کن:",
        "upgrades": [
          { "text": "alleged", "isCorrect": True, "explanationFa": "alleged یعنی بدون اثبات رسمی ادعا کرد." },
          { "text": "whispered", "isCorrect": False, "explanationFa": "whispered یعنی پچ‌پچ کرد." }
        ]
      }
    },
    "round3": {
      "id": "w-b1-1-r3",
      "roundTitleFa": "تایپ تناقض پرونده",
      "briefFa": "کلمه به معنی «بهانه / عذر موجه غیبت در صحنه جرم» را تایپ کن:",
      "briefEn": "Type the legal word for a suspect's presence elsewhere:",
      "templateSentence": "His midnight [___] completely fell apart.",
      "targetBlank": "alibi",
      "acceptableAnswers": ["alibi", "story", "claim"],
      "typingHintFa": "کلمه ۵ حرفی الیبای (a-l-i-b-i).",
      "explanationFa": "alibi یعنی بهانه حضور در جایی دیگر در زمان وقوع جرم.",
      "quickChips": ["alibi", "defense", "truth"]
    }
  },
  {
    "levelNumber": 2,
    "cefr": "B1",
    "theme": "noir-evidence-board",
    "themeTitleFa": "اتاق مدارک کارآگاه نوآر",
    "caseCode": "CASE-B1-02",
    "stageTitleEn": "The Smashed Safe: Cause & Effect Linkers",
    "stageTitleFa": "گاوصندوق شکسته: تحلیل علت و معلول با Due to و Consequently",
    "scenarioFa": "سارقان با ابزار حرارتی گاوصندوق را باز کرده‌اند. در گزارش بررسی فنی باید روابط علت و معلولی را با دقت بنویسی.",
    "locationFa": "دفتر صرافی بانک مرکزی",
    "pillar": "connectors-cohesion",
    "xpReward": 105,
    "timeLimitSeconds": 75,
    "round1": {
      "id": "w-b1-2-r1",
      "roundTitleFa": "چیدمان علت سرقت",
      "promptFa": "کارت‌ها را بچین تا علت نفوذ سارقین را به علت نقص سیستم زنگ خطر بنویسی:",
      "promptEn": "Assemble the cause-and-effect opening:",
      "hintFa": "Due to a technical failure, the alarm remained silent.",
      "goldenRuleFa": "نکته طلایی: Due to a power cut, the cameras shut down.",
      "scrambledChips": [
        { "id": "c1", "text": "Due" },
        { "id": "c2", "text": "to" },
        { "id": "c3", "text": "a" },
        { "id": "c4", "text": "power" },
        { "id": "c5", "text": "failure," },
        { "id": "c6", "text": "the" },
        { "id": "c7", "text": "alarm" },
        { "id": "c8", "text": "failed." },
        { "id": "d1", "text": "because", "isDistractor": True, "distractorReasonFa": "بعد از because باید جمله بیاید، اما بعد از Due to اسم یا عبارت اسمی می‌آید." }
      ],
      "correctSequence": ["Due", "to", "a", "power", "failure,", "the", "alarm", "failed."],
      "assembledSentence": "Due to a power failure, the alarm failed."
    },
    "round2": {
      "id": "w-b1-2-r2",
      "roundTitleFa": "گره زدن معلول به علت",
      "contextFa": "زنگ خطر از کار افتاد، بنابراین سارقان ۱۰ دقیقه وقت داشتند:",
      "sentenceA": "The alarm remained inactive",
      "sentenceB": "the thieves operated undisturbed.",
      "targetSlot": "The alarm remained inactive; [___], the thieves operated undisturbed.",
      "connectorOptions": [
        { "text": "consequently", "isCorrect": True, "explanationFa": "consequently یعنی در نتیجه / بنابراین و برای ارتباط علت و معلول رسمی فوق‌العاده است." },
        { "text": "nonetheless", "isCorrect": False, "explanationFa": "nonetheless برای تضاد است نه نتیجه." },
        { "text": "meanwhile", "isCorrect": False, "explanationFa": "meanwhile هم‌زمانی را می‌رساند نه نتیجه منطقی." }
      ],
      "lexicalUpgrade": {
        "originalWord": "took money",
        "promptFa": "عبارت جنایی‌تر برای به سرقت بردن وجوه نقد انتخاب کن:",
        "upgrades": [
          { "text": "stole substantial assets", "isCorrect": True, "explanationFa": "stole substantial assets یعنی مبالغ هنگفتی به سرقت بردند." },
          { "text": "borrowed coins", "isCorrect": False, "explanationFa": "borrowed coins یعنی سکه قرض گرفتند!" }
        ]
      }
    },
    "round3": {
      "id": "w-b1-2-r3",
      "roundTitleFa": "تایپ کلمه کلیدی نتیجه",
      "briefFa": "کلمه ربط رسمی به معنی «در نتیجه» را تایپ کن:",
      "briefEn": "Type the formal cause-effect transition word:",
      "templateSentence": "[___], security protocols must be overhauled.",
      "targetBlank": "Therefore",
      "acceptableAnswers": ["Therefore", "Thus", "Consequently"],
      "typingHintFa": "کلمه ۹ حرفی به معنی بنابراین (T-h-e-r-e-f-o-r-e).",
      "explanationFa": "Therefore بهترین پیونددهنده رسمی برای نتیجه‌گیری در گزارش‌ها است.",
      "quickChips": ["Therefore", "However", "Instead"]
    }
  },
  {
    "levelNumber": 3,
    "cefr": "B1",
    "theme": "noir-evidence-board",
    "themeTitleFa": "اتاق مدارک کارآگاه نوآر",
    "caseCode": "CASE-B1-03",
    "stageTitleEn": "Witness Statements: Relative Clauses",
    "stageTitleFa": "اظهارات شاهدان: استفاده از جمله‌واره‌های موصولی (who, which, whose)",
    "scenarioFa": "سه شاهد صحنه جرم را دیده‌اند. باید با وصل کردن جمله‌واره‌های موصولی، توصیف مظنون و خودروی فراری را بدون تکرار جملات کوتاه بنویسی.",
    "locationFa": "کافه مه‌آلود خیابان بارانی",
    "pillar": "word-order-punctuation",
    "xpReward": 110,
    "timeLimitSeconds": 75,
    "round1": {
      "id": "w-b1-3-r1",
      "roundTitleFa": "پیوند شاهد و مظنون",
      "promptFa": "کارت‌ها را طوری بچین که بگویی راننده‌ای که بارانی پوشیده بود گریخت:",
      "promptEn": "Assemble the relative clause sentence:",
      "hintFa": "The driver who wore a trench coat fled the scene.",
      "goldenRuleFa": "نکته طلایی: برای انسان از ضمیر موصولی who استفاده می‌کنیم نه which.",
      "scrambledChips": [
        { "id": "c1", "text": "The" },
        { "id": "c2", "text": "man" },
        { "id": "c3", "text": "who" },
        { "id": "c4", "text": "wore" },
        { "id": "c5", "text": "a" },
        { "id": "c6", "text": "black" },
        { "id": "c7", "text": "hat" },
        { "id": "c8", "text": "escaped." },
        { "id": "d1", "text": "which", "isDistractor": True, "distractorReasonFa": "برای اشخاص از who استفاده می‌کنیم نه which!" }
      ],
      "correctSequence": ["The", "man", "who", "wore", "a", "black", "hat", "escaped."],
      "assembledSentence": "The man who wore a black hat escaped."
    },
    "round2": {
      "id": "w-b1-3-r2",
      "roundTitleFa": "اتصال خودرو به سرنخ",
      "contextFa": "پلیس خودرویی را پیدا کرد که پلاکش مخدوش شده بود:",
      "sentenceA": "Officers located a dark sedan",
      "sentenceB": "its license plate had been altered.",
      "targetSlot": "Officers located a dark sedan [___] license plate had been altered.",
      "connectorOptions": [
        { "text": "whose", "isCorrect": True, "explanationFa": "whose ضمیر موصولی مالکیت است و برای اشیاء و اشخاص هر دو به کار می‌رود." },
        { "text": "which", "isCorrect": False, "explanationFa": "which نیازمند حرف اضافه یا حذف its بود." },
        { "text": "where", "isCorrect": False, "explanationFa": "where برای مکان است." }
      ],
      "lexicalUpgrade": {
        "originalWord": "saw",
        "promptFa": "فعل دقیق‌تر برای زیر نظر گرفتن مظنون انتخاب کن:",
        "upgrades": [
          { "text": "observed", "isCorrect": True, "explanationFa": "observed یعنی با دقت و زیر نظر گرفتن مشاهده کرد." },
          { "text": "forgot", "isCorrect": False, "explanationFa": "متضاد است." }
        ]
      }
    },
    "round3": {
      "id": "w-b1-3-r3",
      "roundTitleFa": "تایپ ضمیر موصولی مکان",
      "briefFa": "ضمیر موصولی برای محل وقوع جرم را تایپ کن:",
      "briefEn": "Type the relative pronoun referring to place:",
      "templateSentence": "This is the alley [___] the bag was dropped.",
      "targetBlank": "where",
      "acceptableAnswers": ["where", "in which"],
      "typingHintFa": "کلمه ۵ حرفی به معنی جایی که (w-h-e-r-e).",
      "explanationFa": "the alley where the bag was dropped یعنی کوچه‌ای که کیف در آن انداخته شد.",
      "quickChips": ["where", "which", "when"]
    }
  },
  {
    "levelNumber": 4,
    "cefr": "B1",
    "theme": "noir-evidence-board",
    "themeTitleFa": "اتاق مدارک کارآگاه نوآر",
    "caseCode": "CASE-B1-04",
    "stageTitleEn": "The Chief's Memo: Formal vs Informal Register",
    "stageTitleFa": "یادداشت رئیس پلیس: تنظیم لحن اداری و مکاتبات رسمی",
    "scenarioFa": "بازرس باید گزارش مکتوب خود را از حالت محاوره‌ای کوچه و بازار به لحن اداری استاندارد ارتقا دهد تا به دادستانی ارسال شود.",
    "locationFa": "دفتر فرماندهی ناحیه ۴",
    "pillar": "paragraph-register",
    "xpReward": 115,
    "timeLimitSeconds": 80,
    "round1": {
      "id": "w-b1-4-r1",
      "roundTitleFa": "چیدمان افتتاحیه گزارش رسمی",
      "promptFa": "کارت‌ها را بچین تا افتتاحیه اداری گزارش را بنویسی:",
      "promptEn": "Assemble the formal administrative opening statement:",
      "hintFa": "I am writing to report the findings of our inquiry.",
      "goldenRuleFa": "نکته طلایی: I am writing to submit the preliminary investigative report.",
      "scrambledChips": [
        { "id": "c1", "text": "I" },
        { "id": "c2", "text": "am" },
        { "id": "c3", "text": "writing" },
        { "id": "c4", "text": "to" },
        { "id": "c5", "text": "submit" },
        { "id": "c6", "text": "the" },
        { "id": "c7", "text": "official" },
        { "id": "c8", "text": "findings." },
        { "id": "d1", "text": "write", "isDistractor": True, "distractorReasonFa": "در فرمول استاندارد نامه‌نگاری اداری از حال استمراری I am writing استفاده می‌شود." }
      ],
      "correctSequence": ["I", "am", "writing", "to", "submit", "the", "official", "findings."],
      "assembledSentence": "I am writing to submit the official findings."
    },
    "round2": {
      "id": "w-b1-4-r2",
      "roundTitleFa": "افزودن ضمیمه رسمی",
      "contextFa": "گزارش اصلی حاضر است علاوه بر این شواهد صوتی نیز پیوست گردیده:",
      "sentenceA": "The transcript is enclosed",
      "sentenceB": "audio recordings are attached.",
      "targetSlot": "The transcript is enclosed; [___], audio recordings are attached.",
      "connectorOptions": [
        { "text": "in addition", "isCorrect": True, "explanationFa": "in addition یعنی علاوه بر این، و برای نامه‌نگاری اداری لحنی شیک دارد." },
        { "text": "otherwise", "isCorrect": False, "explanationFa": "otherwise یعنی در غیر این صورت." },
        { "text": "despite", "isCorrect": False, "explanationFa": "despite تضاد را نشان می‌دهد." }
      ],
      "lexicalUpgrade": {
        "originalWord": "look into",
        "promptFa": "فعل رسمی‌تر به جای look into انتخاب کن:",
        "upgrades": [
          { "text": "investigate", "isCorrect": True, "explanationFa": "investigate یعنی بررسی و تحقیق موشکافانه قضایی." },
          { "text": "check out", "isCorrect": False, "explanationFa": "check out غیررسمی و عامیانه است." }
        ]
      }
    },
    "round3": {
      "id": "w-b1-4-r3",
      "roundTitleFa": "تایپ پایان نامه اداری",
      "briefFa": "قید پایان نامه رسمی را تایپ کن:",
      "briefEn": "Type the formal sign-off adverb:",
      "templateSentence": "Yours [___], Detective Miller.",
      "targetBlank": "sincerely",
      "acceptableAnswers": ["sincerely", "faithfully"],
      "typingHintFa": "کلمه ۹ حرفی ارادتمند شما (s-i-n-c-e-r-e-l-y).",
      "explanationFa": "Yours sincerely عبارت رسمی و محترمانه در پایان نامه‌ها است.",
      "quickChips": ["sincerely", "truly", "warmly"]
    }
  },
  {
    "levelNumber": 5,
    "cefr": "B1",
    "theme": "noir-evidence-board",
    "themeTitleFa": "اتاق مدارک کارآگاه نوآر",
    "caseCode": "CASE-B1-05",
    "stageTitleEn": "Conflicting Clues: 'Although' & 'In Spite Of'",
    "stageTitleFa": "سرنخ‌های متناقض: تضاد پیچیده با Although و In spite of",
    "scenarioFa": "علیرغم وجود باران شدید، ردپای خشکی در راهرو به جا مانده! این معما را با ساختارهای تضاد پیشرفته بنویس.",
    "locationFa": "عمارت قدیمی بارون ثروتمند",
    "pillar": "connectors-cohesion",
    "xpReward": 120,
    "timeLimitSeconds": 80,
    "round1": {
      "id": "w-b1-5-r1",
      "roundTitleFa": "چیدمان تضاد صحنه جرم",
      "promptFa": "کارت‌ها را بچین تا بگویی گرچه باران می‌بارید، ردپاها کاملاً خشک بودند:",
      "promptEn": "Form the complex concession clause using Although:",
      "hintFa": "Although it was raining, the footprints remained dry.",
      "goldenRuleFa": "نکته طلایی: بعد از Although جمله کامل (فاعل + فعل) می‌آید، اما بعد از In spite of اسم یا فعل ing دار.",
      "scrambledChips": [
        { "id": "c1", "text": "Although" },
        { "id": "c2", "text": "it" },
        { "id": "c3", "text": "rained" },
        { "id": "c4", "text": "outside," },
        { "id": "c5", "text": "the" },
        { "id": "c6", "text": "floor" },
        { "id": "c7", "text": "stayed" },
        { "id": "c8", "text": "dry." },
        { "id": "d1", "text": "but", "isDistractor": True, "distractorReasonFa": "وقتی اول جمله Although می‌آوریم، هرگز نباید در وسط جمله but بگذاریم!" }
      ],
      "correctSequence": ["Although", "it", "rained", "outside,", "the", "floor", "stayed", "dry."],
      "assembledSentence": "Although it rained outside, the floor stayed dry."
    },
    "round2": {
      "id": "w-b1-5-r2",
      "roundTitleFa": "تضاد با عبارت اسمی",
      "contextFa": "با وجود هشدارهای مکرر، درب پشتی قفل نشده بود:",
      "sentenceA": "The back door was unlocked",
      "sentenceB": "repeated warnings by guards.",
      "targetSlot": "The back door was unlocked [___] repeated warnings by guards.",
      "connectorOptions": [
        { "text": "in spite of", "isCorrect": True, "explanationFa": "in spite of قبل از عبارات اسمی (repeated warnings) می‌آید." },
        { "text": "although", "isCorrect": False, "explanationFa": "although نیازمند جمله کامل با فعل است." },
        { "text": "because of", "isCorrect": False, "explanationFa": "هشدارها علت باز ماندن در نبودند." }
      ],
      "lexicalUpgrade": {
        "originalWord": "strange thing",
        "promptFa": "کلمه دقیق‌تر کارآگاهی برای این ناهماهنگی انتخاب کن:",
        "upgrades": [
          { "text": "glaring anomaly", "isCorrect": True, "explanationFa": "glaring anomaly یعنی یک تناقض فاحش و بسیار مشکوک." },
          { "text": "funny joke", "isCorrect": False, "explanationFa": "funny joke یعنی شوخی خنده‌دار که مناسب صحنه قتل نیست!" }
        ]
      }
    },
    "round3": {
      "id": "w-b1-5-r3",
      "roundTitleFa": "تایپ کلمه تضاد تک‌کلمه‌ای",
      "briefFa": "کلمه ربط تضاد به معنی «علیرغم / با وجود اینکه» را تایپ کن:",
      "briefEn": "Type the single-word concession linker:",
      "templateSentence": "[___] the darkness, the witness saw the emblem.",
      "targetBlank": "Despite",
      "acceptableAnswers": ["Despite"],
      "typingHintFa": "کلمه ۷ حرفی به معنی با وجودِ (D-e-s-p-i-t-e).",
      "explanationFa": "Despite the darkness یعنی با وجود تاریکی.",
      "quickChips": ["Despite", "Because", "Unless"]
    }
  },
  {
    "levelNumber": 6,
    "cefr": "B1",
    "theme": "noir-evidence-board",
    "themeTitleFa": "اتاق مدارک کارآگاه نوآر",
    "caseCode": "CASE-B1-06",
    "stageTitleEn": "The Anonymous Tip: Passive Voice in Reports",
    "stageTitleFa": "تماس ناشناس: نگارش ساختارهای مجهول در گزارش‌های پلیسی",
    "scenarioFa": "وقتی هویت گوینده یا سارق هنوز نامعلوم است، زبان مجهول پلیسی الزامی است: مدارک کشف شدند، زنگ به صدا درآمد.",
    "locationFa": "مرکز تماس اضطراری پلیس",
    "pillar": "paragraph-register",
    "xpReward": 125,
    "timeLimitSeconds": 80,
    "round1": {
      "id": "w-b1-6-r1",
      "roundTitleFa": "چیدمان مجهول پلیسی",
      "promptFa": "کارت‌ها را بچین تا بگویی جواهرات در یک انباری متروکه پیدا شدند:",
      "promptEn": "Construct the formal passive crime report sentence:",
      "hintFa": "The diamonds were discovered in an abandoned warehouse.",
      "goldenRuleFa": "نکته طلایی: ساختار مجهول: فاعل مجهول + were/was + شکل سوم فعل (past participle).",
      "scrambledChips": [
        { "id": "c1", "text": "The" },
        { "id": "c2", "text": "jewels" },
        { "id": "c3", "text": "were" },
        { "id": "c4", "text": "discovered" },
        { "id": "c5", "text": "in" },
        { "id": "c6", "text": "the" },
        { "id": "c7", "text": "cellar." },
        { "id": "d1", "text": "was", "isDistractor": True, "distractorReasonFa": "فاعل The jewels اسم جمع است و باید were بگیرد نه was!" }
      ],
      "correctSequence": ["The", "jewels", "were", "discovered", "in", "the", "cellar."],
      "assembledSentence": "The jewels were discovered in the cellar."
    },
    "round2": {
      "id": "w-b1-6-r2",
      "roundTitleFa": "ادعای بی‌طرفانه",
      "contextFa": "گزارش شده است که مظنون از مرز خارج شده:",
      "sentenceA": "The police secured the border",
      "sentenceB": "it was reported that the suspect fled.",
      "targetSlot": "The police secured the border, [___] it was reported that the suspect fled.",
      "connectorOptions": [
        { "text": "as", "isCorrect": True, "explanationFa": "as برای بیان همزمانی و تشریح بستر رخدادها به کار می‌رود (چنان‌که گزارش شد)." },
        { "text": "unless", "isCorrect": False, "explanationFa": "شرط منفی بی‌معنی است." },
        { "text": "instead", "isCorrect": False, "explanationFa": "تضاد جایگزینی نیست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "found out",
        "promptFa": "فعل رسمی‌تر برای فاش شدن حقیقت انتخاب کن:",
        "upgrades": [
          { "text": "revealed", "isCorrect": True, "explanationFa": "revealed یعنی افشا و آشکار شد." },
          { "text": "forgotten", "isCorrect": False, "explanationFa": "متضاد است." }
        ]
      }
    },
    "round3": {
      "id": "w-b1-6-r3",
      "roundTitleFa": "تایپ شکل سوم فعل مجهول",
      "briefFa": "شکل سوم فعل سرقت کردن (steal) را تایپ کن:",
      "briefEn": "Type the past participle of steal:",
      "templateSentence": "The documents were [___] yesterday.",
      "targetBlank": "stolen",
      "acceptableAnswers": ["stolen"],
      "typingHintFa": "کلمه ۶ حرفی دزدیده شده (s-t-o-l-e-n).",
      "explanationFa": "were stolen یعنی به سرقت رفتند.",
      "quickChips": ["stolen", "lost", "broken"]
    }
  },
  {
    "levelNumber": 7,
    "cefr": "B1",
    "theme": "noir-evidence-board",
    "themeTitleFa": "اتاق مدارک کارآگاه نوآر",
    "caseCode": "CASE-B1-07",
    "stageTitleEn": "Forensic Deduction: Modals of Deduction",
    "stageTitleFa": "استنتاج جنایی: نگارش با must have been و could not have",
    "scenarioFa": "شیشه پنجره از داخل شکسته شده است! کارآگاه باید با استدلال قاطع ثابت کند که سارق از بیرون نیامده بلکه کسی از داخل خانه پنجره را شکسته است.",
    "locationFa": "آزمایشگاه پزشکی قانونی و جرم‌شناسی",
    "pillar": "connectors-cohesion",
    "xpReward": 130,
    "timeLimitSeconds": 85,
    "round1": {
      "id": "w-b1-7-r1",
      "roundTitleFa": "چیدمان استنتاج کارآگاه",
      "promptFa": "کارت‌ها را بچین تا بگویی سارق حتماً کلید ورودی را داشته است:",
      "promptEn": "Assemble the past deduction using modal 'must have':",
      "hintFa": "The intruder must have had the access card.",
      "goldenRuleFa": "نکته طلایی: برای استنتاج با اطمینان بالا از گذشته: must have + past participle.",
      "scrambledChips": [
        { "id": "c1", "text": "The" },
        { "id": "c2", "text": "intruder" },
        { "id": "c3", "text": "must" },
        { "id": "c4", "text": "have" },
        { "id": "c5", "text": "had" },
        { "id": "c6", "text": "the" },
        { "id": "c7", "text": "master" },
        { "id": "c8", "text": "key." },
        { "id": "d1", "text": "has", "isDistractor": True, "distractorReasonFa": "بعد از افعال مدال مثل must همیشه have ساده می‌آید نه has!" }
      ],
      "correctSequence": ["The", "intruder", "must", "have", "had", "the", "master", "key."],
      "assembledSentence": "The intruder must have had the master key."
    },
    "round2": {
      "id": "w-b1-7-r2",
      "roundTitleFa": "رد فرضیه اشتباه",
      "contextFa": "پنجره از داخل شکسته شده بود بنابراین نمی‌توانست نفوذ از بیرون باشد:",
      "sentenceA": "The glass fell outward",
      "sentenceB": "the burglar could not have entered from outside.",
      "targetSlot": "The glass fell outward; [___], the burglar could not have entered from outside.",
      "connectorOptions": [
        { "text": "clearly", "isCorrect": True, "explanationFa": "clearly یعنی واضح است که... و استنتاج منطقی را محکم می‌کند." },
        { "text": "although", "isCorrect": False, "explanationFa": "تضادی وجود ندارد." },
        { "text": "however", "isCorrect": False, "explanationFa": "جهت گزاره‌ها یکی است." }
      ],
      "lexicalUpgrade": {
        "originalWord": "guess",
        "promptFa": "فعل تخصصی‌تر برای نتیجه‌گیری بر مبنای مدارک انتخاب کن:",
        "upgrades": [
          { "text": "deduce", "isCorrect": True, "explanationFa": "deduce یعنی استنتاج علمی و منطقی کردن." },
          { "text": "wish", "isCorrect": False, "explanationFa": "wish یعنی آرزو کردن که بی‌ربط است." }
        ]
      }
    },
    "round3": {
      "id": "w-b1-7-r3",
      "roundTitleFa": "تایپ قطعیت منفی",
      "briefFa": "کلمه وجهی منفی برای غیرممکن بودن در گذشته را تایپ کن:",
      "briefEn": "Type the modal expressing impossibility in deduction:",
      "templateSentence": "He [___] not have acted alone.",
      "targetBlank": "could",
      "acceptableAnswers": ["could", "might"],
      "typingHintFa": "کلمه ۵ حرفی could به معنای می‌توانست (c-o-u-l-d).",
      "explanationFa": "could not have acted alone یعنی امکان ندارد تنهایی عمل کرده باشد.",
      "quickChips": ["could", "would", "should"]
    }
  },
  {
    "levelNumber": 8,
    "cefr": "B1",
    "theme": "noir-evidence-board",
    "themeTitleFa": "اتاق مدارک کارآگاه نوآر",
    "caseCode": "CASE-B1-08",
    "stageTitleEn": "The Blackmail Letter: Cohesive Paragraph Craft",
    "stageTitleFa": "نامه باج‌خواهی: معماری پاراگراف استاندارد با جمله موضوعی",
    "scenarioFa": "سندی پیدا شده که نشان می‌دهد باج‌گیر چطور برنامه‌ریزی کرده است. یک پاراگراف کامل با رعایت جمله موضوعی (Topic Sentence) و شواهد کمکی بساز.",
    "locationFa": "اتاق مطالعه مخفی در زیرزمین عمارت",
    "pillar": "paragraph-register",
    "xpReward": 135,
    "timeLimitSeconds": 85,
    "round1": {
      "id": "w-b1-8-r1",
      "roundTitleFa": "چیدمان جمله موضوعی پاراگراف",
      "promptFa": "کارت‌ها را بچین تا جمله موضوعی اصلی (Topic Sentence) پاراگراف را بسازی:",
      "promptEn": "Assemble the cohesive paragraph topic sentence:",
      "hintFa": "Multiple pieces of evidence demonstrate premeditated blackmail.",
      "goldenRuleFa": "نکته طلایی: جمله موضوعی باید ایده کلی پاراگراف را بدون پرگویی اعلام کند.",
      "scrambledChips": [
        { "id": "c1", "text": "The" },
        { "id": "c2", "text": "evidence" },
        { "id": "c3", "text": "proves" },
        { "id": "c4", "text": "that" },
        { "id": "c5", "text": "the" },
        { "id": "c6", "text": "plot" },
        { "id": "c7", "text": "was" },
        { "id": "c8", "text": "premeditated." },
        { "id": "d1", "text": "prove", "isDistractor": True, "distractorReasonFa": "کلمه evidence اسم غیرقابل شمارش و مفرد است و فعل باید proves باشد." }
      ],
      "correctSequence": ["The", "evidence", "proves", "that", "the", "plot", "was", "premeditated."],
      "assembledSentence": "The evidence proves that the plot was premeditated."
    },
    "round2": {
      "id": "w-b1-8-r2",
      "roundTitleFa": "اتصال شاهد به نتیجه",
      "contextFa": "ابتدا پاکت خریداری شد و سپس نامه با ماشین تحریر تایپ شد:",
      "sentenceA": "The envelope was bought on Monday",
      "sentenceB": "the letter was drafted on the same typewriter.",
      "targetSlot": "The envelope was bought on Monday; [___], the letter was drafted on the same typewriter.",
      "connectorOptions": [
        { "text": "subsequently", "isCorrect": True, "explanationFa": "subsequently یعنی متعاقباً / پس از آن، و لحنی بسیار غنی و کارآگاهی دارد." },
        { "text": "otherwise", "isCorrect": False, "explanationFa": "otherwise یعنی در غیر این صورت." },
        { "text": "although", "isCorrect": False, "explanationFa": "تضادی وجود ندارد." }
      ],
      "lexicalUpgrade": {
        "originalWord": "bad plan",
        "promptFa": "کلمه سنگین‌تر حقوقی برای توطئه مجرمانه انتخاب کن:",
        "upgrades": [
          { "text": "criminal conspiracy", "isCorrect": True, "explanationFa": "criminal conspiracy یعنی تبانی و توطئه مجرمانه سازمان‌یافته." },
          { "text": "silly mistake", "isCorrect": False, "explanationFa": "silly mistake یعنی اشتباه احمقانه." }
        ]
      }
    },
    "round3": {
      "id": "w-b1-8-r3",
      "roundTitleFa": "تایپ عبارت نتیجه‌گیری پاراگراف",
      "briefFa": "عبارت ربط نتیجه‌گیری به معنی «به طور خلاصه» را تایپ کن:",
      "briefEn": "Type the concluding summary phrase:",
      "templateSentence": "[___], all signs point to the chief accountant.",
      "targetBlank": "In short",
      "acceptableAnswers": ["In short", "In summary", "Overall"],
      "typingHintFa": "عبارت ۷ حرفی In short (به طور خلاصه).",
      "explanationFa": "In short برای جمع‌بندی پاراگراف تحلیلی عالی است.",
      "quickChips": ["In short", "For example", "First of all"]
    }
  },
  {
    "levelNumber": 9,
    "cefr": "B1",
    "theme": "noir-evidence-board",
    "themeTitleFa": "اتاق مدارک کارآگاه نوآر",
    "caseCode": "CASE-B1-09",
    "stageTitleEn": "Crime Scene Log: Lexical Collocations",
    "stageTitleFa": "دفترچه صحنه جرم: همایندها و کالوکیشن‌های تخصصی نگارش جنایی",
    "scenarioFa": "دادستان پرونده روی واژگان دقیق حساس است: نباید بگویی «مظنون اصلی» به شکل غلط! باید کالوکیشن‌های اصیل انگلیسی مثل prime suspect و solid alibi را به کار ببری.",
    "locationFa": "میز کار بازپرس در نیمه‌شب بارانی",
    "pillar": "word-order-punctuation",
    "xpReward": 140,
    "timeLimitSeconds": 85,
    "round1": {
      "id": "w-b1-9-r1",
      "roundTitleFa": "چیدمان کالوکیشن مظنون اصلی",
      "promptFa": "کارت‌ها را بچین تا بگویی بازرس به مظنون اصلی پرونده مشکوک شده:",
      "promptEn": "Assemble the sentence using the collocation 'prime suspect':",
      "hintFa": "The detective identified the prime suspect.",
      "goldenRuleFa": "نکته طلایی: کالوکیشن ثابت برای مظنون اصلی: prime suspect (نه first suspect یا main suspect).",
      "scrambledChips": [
        { "id": "c1", "text": "The" },
        { "id": "c2", "text": "detective" },
        { "id": "c3", "text": "interrogated" },
        { "id": "c4", "text": "the" },
        { "id": "c5", "text": "prime" },
        { "id": "c6", "text": "suspect" },
        { "id": "c7", "text": "tonight." },
        { "id": "d1", "text": "primary", "isDistractor": True, "distractorReasonFa": "اصطلاح دقیق در انگلیسی حقوقی prime suspect است نه primary suspect." }
      ],
      "correctSequence": ["The", "detective", "interrogated", "the", "prime", "suspect", "tonight."],
      "assembledSentence": "The detective interrogated the prime suspect tonight."
    },
    "round2": {
      "id": "w-b1-9-r2",
      "roundTitleFa": "پیوند مدرک مادی",
      "contextFa": "مظنون ادعای بیگناهی کرد اما شواهد ملموس علیه او بود:",
      "sentenceA": "The defendant denied all involvement",
      "sentenceB": "tangible evidence linked him to the scene.",
      "targetSlot": "The defendant denied all involvement; [___], tangible evidence linked him to the scene.",
      "connectorOptions": [
        { "text": "nevertheless", "isCorrect": True, "explanationFa": "nevertheless یعنی با این حال، و برای ارائه مدارک بر خلاف میل متهم بسیار برازنده است." },
        { "text": "therefore", "isCorrect": False, "explanationFa": "نتیجه‌گیری مستقیم نیست." },
        { "text": "for instance", "isCorrect": False, "explanationFa": "برای مثال زدن نیست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "bad evidence",
        "promptFa": "اصطلاح حقوقی برای شواهد غیرمستقیم و قرائن انتخاب کن:",
        "upgrades": [
          { "text": "circumstantial evidence", "isCorrect": True, "explanationFa": "circumstantial evidence یعنی شواهد اوضاع و احوال و قرائن پیرامونی." },
          { "text": "fake paper", "isCorrect": False, "explanationFa": "fake paper یعنی کاغذ جعلی." }
        ]
      }
    },
    "round3": {
      "id": "w-b1-9-r3",
      "roundTitleFa": "تایپ کالوکیشن مدرک محکم",
      "briefFa": "صفت همایند با evidence به معنی «مدرک غیرقابل انکار و قاطع» را تایپ کن:",
      "briefEn": "Type the collocation adjective meaning indisputable proof:",
      "templateSentence": "We discovered [___] proof of his guilt.",
      "targetBlank": "conclusive",
      "acceptableAnswers": ["conclusive", "solid", "concrete"],
      "typingHintFa": "کلمه ۱۰ حرفی قاطع و نهایی (c-o-n-c-l-u-s-i-v-e).",
      "explanationFa": "conclusive proof یعنی مدرک قاطع و قانع‌کننده که جای شک باقی نمی‌گذارد.",
      "quickChips": ["conclusive", "weak", "simple"]
    }
  },
  {
    "levelNumber": 10,
    "cefr": "B1",
    "theme": "noir-evidence-board",
    "themeTitleFa": "اتاق مدارک کارآگاه نوآر",
    "caseCode": "CASE-B1-10",
    "stageTitleEn": "Boss Case: The Grand Court Indictment",
    "stageTitleFa": "غول مرحله آخر: کیفرخواست نهایی دادگاه و محکومیت مجرم",
    "scenarioFa": "پرونده بزرگ قرن به دادگاه رسیده است! با نگارش لایحه اتهامی کامل و استدلال منسجم، مجرم را محکوم کن و جام طلایی B1 را ببر تا مجوز باز شدن مدارک B2 را دریافت کنی!",
    "locationFa": "دادگاه عالی جنایی شهر نوآر",
    "pillar": "master-investigation",
    "xpReward": 200,
    "timeLimitSeconds": 100,
    "isBossStage": True,
    "round1": {
      "id": "w-b1-10-r1",
      "roundTitleFa": "چیدمان کیفرخواست نهایی",
      "promptFa": "کارت‌های بیانیه رسمی اتهام دادستان را به ترتیب درست بچین:",
      "promptEn": "Assemble the prosecutor's formal opening indictment statement:",
      "hintFa": "The prosecution intends to prove guilt beyond reasonable doubt.",
      "goldenRuleFa": "نکته طلایی: عبارت اصیل دادگاهی: beyond reasonable doubt (فراتر از هرگونه شک معقول).",
      "scrambledChips": [
        { "id": "c1", "text": "The" },
        { "id": "c2", "text": "state" },
        { "id": "c3", "text": "will" },
        { "id": "c4", "text": "prove" },
        { "id": "c5", "text": "guilt" },
        { "id": "c6", "text": "beyond" },
        { "id": "c7", "text": "reasonable" },
        { "id": "c8", "text": "doubt." },
        { "id": "d1", "text": "without", "isDistractor": True, "distractorReasonFa": "اصطلاح حقوقی استاندارد beyond reasonable doubt است نه without reasonable doubt." }
      ],
      "correctSequence": ["The", "state", "will", "prove", "guilt", "beyond", "reasonable", "doubt."],
      "assembledSentence": "The state will prove guilt beyond reasonable doubt."
    },
    "round2": {
      "id": "w-b1-10-r2",
      "roundTitleFa": "گره زدن انگیزه و ارتکاب جرم",
      "contextFa": "متهم هم انگیزه مالی داشت و هم فرصت ارتکاب جرم:",
      "sentenceA": "The accused possessed a clear financial motive",
      "sentenceB": "he had unmonitored access to the vault.",
      "targetSlot": "The accused possessed a clear financial motive; [___], he had unmonitored access to the vault.",
      "connectorOptions": [
        { "text": "furthermore", "isCorrect": True, "explanationFa": "furthermore دلیل دوم را برای تقویت اتهام اضافه می‌کند." },
        { "text": "despite this", "isCorrect": False, "explanationFa": "تضادی وجود ندارد." },
        { "text": "instead", "isCorrect": False, "explanationFa": "ارتباط جایگزینی نیست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "bad action",
        "promptFa": "اصطلاح حقوقی سنگین برای جرم ارتکابی انتخاب کن:",
        "upgrades": [
          { "text": "flagrant felony", "isCorrect": True, "explanationFa": "flagrant felony یعنی جنایت آشکار و نقض فاحش قانون." },
          { "text": "minor error", "isCorrect": False, "explanationFa": "minor error جرم را کم‌اهمیت جلوه می‌دهد." }
        ]
      }
    },
    "round3": {
      "id": "w-b1-10-r3",
      "roundTitleFa": "تایپ رای نهایی قاضی",
      "briefFa": "کلمه حقوقی به معنی «گناهکار و مجرم» را تایپ کن:",
      "briefEn": "Type the jury verdict word finding criminal culpability:",
      "templateSentence": "The court finds the defendant [___] as charged.",
      "targetBlank": "guilty",
      "acceptableAnswers": ["guilty"],
      "typingHintFa": "کلمه ۶ حرفی به معنی گناهکار (g-u-i-l-t-y).",
      "explanationFa": "guilty as charged یعنی مجرم در تمام بندهای اتهامی.",
      "quickChips": ["guilty", "innocent", "free"]
    }
  }
]

# We will populate B2_CASES
B2_CASES = [
  {
    "levelNumber": 1,
    "cefr": "B2",
    "theme": "noir-evidence-board",
    "themeTitleFa": "اتاق مدارک کارآگاه نوآر",
    "caseCode": "CASE-B2-01",
    "stageTitleEn": "Cross-Examination: Balanced Argumentation",
    "stageTitleFa": "بازجویی متقابل: نگارش مقایسه‌ای با On the one hand",
    "scenarioFa": "وکیل مدافع ادعا می‌کند موکلش از نظر روانی آسیب‌پذیر بوده، در حالی که گزارش پزشکی هوشیاری کامل او را نشان می‌دهد. باید متنی با تعادل و ساختار استدلالی دوطرفه بنویسی.",
    "locationFa": "دفتر دادستان ویژه جرائم سازمان‌یافته",
    "pillar": "connectors-cohesion",
    "xpReward": 140,
    "timeLimitSeconds": 85,
    "round1": {
      "id": "w-b2-1-r1",
      "roundTitleFa": "چیدمان استدلال دو وجهی",
      "promptFa": "کارت‌ها را بچین تا وجه اول استدلال را با On the one hand مطرح کنی:",
      "promptEn": "Assemble the balanced thesis opening clause:",
      "hintFa": "On the one hand, the defense claims extreme distress.",
      "goldenRuleFa": "نکته طلایی: ساختار On the one hand حتماً باید در ادامه با On the other hand جفت شود.",
      "scrambledChips": [
        { "id": "c1", "text": "On" },
        { "id": "c2", "text": "the" },
        { "id": "c3", "text": "one" },
        { "id": "c4", "text": "hand," },
        { "id": "c5", "text": "he" },
        { "id": "c6", "text": "claimed" },
        { "id": "c7", "text": "total" },
        { "id": "c8", "text": "amnesia." },
        { "id": "d1", "text": "in", "isDistractor": True, "distractorReasonFa": "عبارت درست On the one hand است نه In the one hand!" }
      ],
      "correctSequence": ["On", "the", "one", "hand,", "he", "claimed", "total", "amnesia."],
      "assembledSentence": "On the one hand, he claimed total amnesia."
    },
    "round2": {
      "id": "w-b2-1-r2",
      "roundTitleFa": "اتصال به وجه متقابل",
      "contextFa": "از سوی دیگر، شواهد نشان از مکاتبات مخفیانه قبل از ماجرا دارد:",
      "sentenceA": "He claimed he acted impulsively",
      "sentenceB": "his search history demonstrates months of preparation.",
      "targetSlot": "He claimed he acted impulsively; [___], his search history demonstrates months of preparation.",
      "connectorOptions": [
        { "text": "on the other hand", "isCorrect": True, "explanationFa": "on the other hand جفت مکمل on the one hand برای بیان دیدگاه معارض است." },
        { "text": "in conclusion", "isCorrect": False, "explanationFa": "برای نتیجه‌گیری انتهای متن است." },
        { "text": "for example", "isCorrect": False, "explanationFa": "اینجا مثال نیست بلکه نفی ادعاست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "shows",
        "promptFa": "فعل آکادمیک‌تر و تحلیلی‌تر به جای shows انتخاب کن:",
        "upgrades": [
          { "text": "demonstrates conclusively", "isCorrect": True, "explanationFa": "demonstrates conclusively یعنی به طور قاطعانه اثبات و آشکار می‌سازد." },
          { "text": "hints slightly", "isCorrect": False, "explanationFa": "hints slightly یعنی اشاره خفیف که لحن را ضعیف می‌کند." }
        ]
      }
    },
    "round3": {
      "id": "w-b2-1-r3",
      "roundTitleFa": "تایپ کلمه تضاد مقایسه‌ای",
      "briefFa": "کلمه ربط رسمی به معنی «در حالی که / در شرایطی که» را تایپ کن:",
      "briefEn": "Type the formal comparative contrast conjunction:",
      "templateSentence": "The accomplice confessed, [___] the leader maintained silence.",
      "targetBlank": "whereas",
      "acceptableAnswers": ["whereas", "while"],
      "typingHintFa": "کلمه ۷ حرفی در حالی که (w-h-e-r-e-a-s).",
      "explanationFa": "whereas برای مقایسه مستقیم رفتار دو طرف متضاد بهترین پیونددهنده سطح B2 است.",
      "quickChips": ["whereas", "because", "unless"]
    }
  },
  {
    "levelNumber": 2,
    "cefr": "B2",
    "theme": "noir-evidence-board",
    "themeTitleFa": "اتاق مدارک کارآگاه نوآر",
    "caseCode": "CASE-B2-02",
    "stageTitleEn": "Forensic Contradiction: 'Whereas' & 'Notwithstanding'",
    "stageTitleFa": "تناقض در پزشکی قانونی: نگارش با Notwithstanding و In stark contrast",
    "scenarioFa": "علیرغم تمام تکذیب‌های متهم، آزمایش دی‌ان‌ای اثبات کرد که او در محل حاضر بوده است. گزارشی با ساختار تسلیم و تقابل پیشرفته بنویس.",
    "locationFa": "آرشیو محرمانه پرونده‌های مختومه",
    "pillar": "connectors-cohesion",
    "xpReward": 145,
    "timeLimitSeconds": 85,
    "round1": {
      "id": "w-b2-2-r1",
      "roundTitleFa": "چیدمان تضاد پیشرفته",
      "promptFa": "کارت‌ها را بچین تا گزاره تقابل پیشرفته با Notwithstanding را بسازی:",
      "promptEn": "Assemble the high-tier concession clause using Notwithstanding:",
      "hintFa": "Notwithstanding his vigorous denial, forensic evidence placed him at the crime scene.",
      "goldenRuleFa": "نکته طلایی: کلمه Notwithstanding یعنی «علیرغم / با وجود اینکه» و به همراه اسم می‌آید.",
      "scrambledChips": [
        { "id": "c1", "text": "Notwithstanding" },
        { "id": "c2", "text": "his" },
        { "id": "c3", "text": "alibi," },
        { "id": "c4", "text": "DNA" },
        { "id": "c5", "text": "evidence" },
        { "id": "c6", "text": "placed" },
        { "id": "c7", "text": "him" },
        { "id": "c8", "text": "there." },
        { "id": "d1", "text": "despite of", "isDistractor": True, "distractorReasonFa": "در انگلیسی despite of غلط است؛ یا Despite یا In spite of." }
      ],
      "correctSequence": ["Notwithstanding", "his", "alibi,", "DNA", "evidence", "placed", "him", "there."],
      "assembledSentence": "Notwithstanding his alibi, DNA evidence placed him there."
    },
    "round2": {
      "id": "w-b2-2-r2",
      "roundTitleFa": "تقابل چشمگیر در مدارک",
      "contextFa": "گزارش اول حاکی از خودکشی بود، اما شواهد جدید حکایت از قتلی حساب‌شده دارد:",
      "sentenceA": "Initial assumptions suggested suicide",
      "sentenceB": "new findings reveal a cold-blooded homicide.",
      "targetSlot": "Initial assumptions suggested suicide; [___], new findings reveal a cold-blooded homicide.",
      "connectorOptions": [
        { "text": "in stark contrast", "isCorrect": True, "explanationFa": "in stark contrast یعنی در تقابلی آشکار و پررنگ، و برای تغییر زاویه پرونده عالی است." },
        { "text": "similarly", "isCorrect": False, "explanationFa": "similarly برای تشابه است نه تقابل کامل." },
        { "text": "accordingly", "isCorrect": False, "explanationFa": "accordingly برای نتیجه است." }
      ],
      "lexicalUpgrade": {
        "originalWord": "big difference",
        "promptFa": "اصطلاح تحلیلی‌تر برای شکاف و ناهمخوانی اسناد انتخاب کن:",
        "upgrades": [
          { "text": "irreconcilable discrepancy", "isCorrect": True, "explanationFa": "irreconcilable discrepancy یعنی تناقض آشتی‌ناپذیر و بنیادین." },
          { "text": "small change", "isCorrect": False, "explanationFa": "small change یعنی تغییر جزئی." }
        ]
      }
    },
    "round3": {
      "id": "w-b2-2-r3",
      "roundTitleFa": "تایپ قید تضاد رسمی",
      "briefFa": "قید رسمی به معنی «با این حال / با وجود این» را تایپ کن:",
      "briefEn": "Type the formal transition adverb:",
      "templateSentence": "The lead was slim; [___], we pursued it relentlessly.",
      "targetBlank": "nonetheless",
      "acceptableAnswers": ["nonetheless", "nevertheless"],
      "typingHintFa": "کلمه ۱۲ حرفی پیوسته (n-o-n-e-t-h-e-l-e-s-s).",
      "explanationFa": "nonetheless یکی از شاخص‌ترین ترانزیشن‌های تضاد در متون آکادمیک و قضایی است.",
      "quickChips": ["nonetheless", "therefore", "meanwhile"]
    }
  },
  {
    "levelNumber": 3,
    "cefr": "B2",
    "theme": "noir-evidence-board",
    "themeTitleFa": "اتاق مدارک کارآگاه نوآر",
    "caseCode": "CASE-B2-03",
    "stageTitleEn": "Internal Affairs: Impersonal Reporting",
    "stageTitleFa": "بازرسی ویژه: ساختارهای گزارش خنثی با It is claimed that",
    "scenarioFa": "بازرسی ویژه مشغول تحقیق درباره رشوه‌خواری است. در این گزارش‌ها باید از قضاوت مستقیم پرهیز کنی و از ساختارهای بی‌طرفانه اداری استفاده کنی.",
    "locationFa": "دفتر بازرسی کل نیروهای انتظامی",
    "pillar": "paragraph-register",
    "xpReward": 150,
    "timeLimitSeconds": 85,
    "round1": {
      "id": "w-b2-3-r1",
      "roundTitleFa": "چیدمان گزارش مجهول خنثی",
      "promptFa": "کارت‌ها را بچین تا بگویی ادعا شده است که افسر پرونده وجوهی را دریافت کرده:",
      "promptEn": "Assemble the impersonal reporting passive sentence:",
      "hintFa": "It is widely alleged that the officer accepted improper funds.",
      "goldenRuleFa": "نکته طلایی: ساختار گزارش اداری بی‌طرفانه: It is believed / alleged / claimed that...",
      "scrambledChips": [
        { "id": "c1", "text": "It" },
        { "id": "c2", "text": "is" },
        { "id": "c3", "text": "alleged" },
        { "id": "c4", "text": "that" },
        { "id": "c5", "text": "confidential" },
        { "id": "c6", "text": "files" },
        { "id": "c7", "text": "were" },
        { "id": "c8", "text": "leaked." },
        { "id": "d1", "text": "alleging", "isDistractor": True, "distractorReasonFa": "در ساختار مجهول بی‌طرفانه فعل سوم یعنی alleged می‌آید نه ing دار." }
      ],
      "correctSequence": ["It", "is", "alleged", "that", "confidential", "files", "were", "leaked."],
      "assembledSentence": "It is alleged that confidential files were leaked."
    },
    "round2": {
      "id": "w-b2-3-r2",
      "roundTitleFa": "ارتقای لحن بی‌طرف",
      "contextFa": "تحقیقات هنوز ادامه دارد بنابراین هیچ اتهامی قطعی تلقی نمی‌شود:",
      "sentenceA": "The investigation remains underway",
      "sentenceB": "no formal reprimands have been issued.",
      "targetSlot": "The investigation remains underway; [___], no formal reprimands have been issued.",
      "connectorOptions": [
        { "text": "hence", "isCorrect": True, "explanationFa": "hence یعنی از این رو / بنا بر این، و لحن گزارش اداری را ارتقا می‌دهد." },
        { "text": "although", "isCorrect": False, "explanationFa": "تضادی وجود ندارد." },
        { "text": "instead", "isCorrect": False, "explanationFa": "ارتباط جایگزینی نیست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "bad cop",
        "promptFa": "اصطلاح رسمی سازمانی برای افسر متخلف انتخاب کن:",
        "upgrades": [
          { "text": "compromised personnel", "isCorrect": True, "explanationFa": "compromised personnel یعنی پرسنل آسیب‌پذیر یا آلوده‌شده به فساد." },
          { "text": "naughty officer", "isCorrect": False, "explanationFa": "naughty بچگانه است!" }
        ]
      }
    },
    "round3": {
      "id": "w-b2-3-r3",
      "roundTitleFa": "تایپ ساختار مجهول شخصی",
      "briefFa": "فعل مصدر کامل به معنی «دست داشتن در ماجرا» را تایپ کن:",
      "briefEn": "Type the infinitive phrase used in personal passive reporting:",
      "templateSentence": "The captain is purported [___] involved.",
      "targetBlank": "to be",
      "acceptableAnswers": ["to be", "to have been"],
      "typingHintFa": "ترکیب دو کلمه‌ای to be (بودن).",
      "explanationFa": "The captain is purported to be involved یعنی ادعا می‌شود سروان در این ماجرا دست دارد.",
      "quickChips": ["to be", "being", "been"]
    }
  },
  {
    "levelNumber": 4,
    "cefr": "B2",
    "theme": "noir-evidence-board",
    "themeTitleFa": "اتاق مدارک کارآگاه نوآر",
    "caseCode": "CASE-B2-04",
    "stageTitleEn": "Formal Letter of Complaint: Assertive Register",
    "stageTitleFa": "نامه اعتراض رسمی: نگارش قاطعانه با I am writing to express my dissatisfaction",
    "scenarioFa": "شهردار از عملکرد تیم تحقیق شاکی است. نامه‌ای قاطع، رسمی و بدون پرخاشگری شخصی اما با جدیت حقوقی آماده کن.",
    "locationFa": "دفتر شهرداری و شورای شهر",
    "pillar": "paragraph-register",
    "xpReward": 155,
    "timeLimitSeconds": 90,
    "round1": {
      "id": "w-b2-4-r1",
      "roundTitleFa": "چیدمان اعتراض رسمی",
      "promptFa": "کارت‌ها را بچین تا جمله گشایش نامه شکایت رسمی را تنظیم کنی:",
      "promptEn": "Assemble the assertive complaint letter opening:",
      "hintFa": "I am writing to express my profound dissatisfaction regarding the delays.",
      "goldenRuleFa": "نکته طلایی: I am writing to express my profound concern regarding this oversight.",
      "scrambledChips": [
        { "id": "c1", "text": "I" },
        { "id": "c2", "text": "am" },
        { "id": "c3", "text": "writing" },
        { "id": "c4", "text": "to" },
        { "id": "c5", "text": "voice" },
        { "id": "c6", "text": "grave" },
        { "id": "c7", "text": "concerns" },
        { "id": "c8", "text": "today." },
        { "id": "d1", "text": "complain about", "isDistractor": True, "distractorReasonFa": "در نامه‌های سطح بالای B2 به جای I write to complain about از I am writing to voice grave concerns استفاده می‌شود." }
      ],
      "correctSequence": ["I", "am", "writing", "to", "voice", "grave", "concerns", "today."],
      "assembledSentence": "I am writing to voice grave concerns today."
    },
    "round2": {
      "id": "w-b2-4-r2",
      "roundTitleFa": "تعیین ضرب‌الاجل با کلمه ربط",
      "contextFa": "پاسخ فوری مورد انتظار است وگرنه موضوع به بازرسی کل ارجاع داده خواهد شد:",
      "sentenceA": "We expect an immediate rectification",
      "sentenceB": "we will be forced to escalate the matter.",
      "targetSlot": "We expect an immediate rectification; [___], we will be forced to escalate the matter.",
      "connectorOptions": [
        { "text": "failing which", "isCorrect": True, "explanationFa": "failing which یعنی «در غیر این صورت / چنانچه میسر نشود» و نهایت لحن قاطع حقوقی است." },
        { "text": "for example", "isCorrect": False, "explanationFa": "مثال زدن نیست." },
        { "text": "similarly", "isCorrect": False, "explanationFa": "تشابه نیست بلکه هشدار عواقب است." }
      ],
      "lexicalUpgrade": {
        "originalWord": "fix it",
        "promptFa": "فعل رسمی‌تر برای جبران خسارت و اصلاح امور انتخاب کن:",
        "upgrades": [
          { "text": "rectify the deficiency", "isCorrect": True, "explanationFa": "rectify the deficiency یعنی اصلاح و جبران نواقص موجود." },
          { "text": "clean the mess", "isCorrect": False, "explanationFa": "لحن غیررسمی است." }
        ]
      }
    },
    "round3": {
      "id": "w-b2-4-r3",
      "roundTitleFa": "تایپ تقاضای پاسخ سریع",
      "briefFa": "کلمه به معنی «پاسخ سریع و به‌موقع» را تایپ کن:",
      "briefEn": "Type the adjective meaning quick and punctual in correspondence:",
      "templateSentence": "I anticipate your [___] reply to this inquiry.",
      "targetBlank": "prompt",
      "acceptableAnswers": ["prompt", "timely", "swift"],
      "typingHintFa": "کلمه ۶ حرفی سریع و فوری (p-r-o-m-p-t).",
      "explanationFa": "prompt reply یک کالوکیشن کلاسیک نامه‌نگاری اداری به معنی پاسخ سریع و عاجل است.",
      "quickChips": ["prompt", "slow", "late"]
    }
  },
  {
    "levelNumber": 5,
    "cefr": "B2",
    "theme": "noir-evidence-board",
    "themeTitleFa": "اتاق مدارک کارآگاه نوآر",
    "caseCode": "CASE-B2-05",
    "stageTitleEn": "The Counterfeit Will: Cohesive Referencing",
    "stageTitleFa": "وصیت‌نامه جعلی: ارجاع منسجم با The former و The latter",
    "scenarioFa": "دو نسخه وصیت‌نامه روی میز است. برای جلوگیری از تکرار نام‌ها، از ابزارهای ارجاع پیشرفته The former (اولی) و The latter (دومی) برای نگارش تحلیل استفاده کن.",
    "locationFa": "دفترخانه اسناد رسمی شماره ۱۲",
    "pillar": "connectors-cohesion",
    "xpReward": 160,
    "timeLimitSeconds": 90,
    "round1": {
      "id": "w-b2-5-r1",
      "roundTitleFa": "چیدمان ارجاع درون‌متنی",
      "promptFa": "کارت‌ها را بچین تا بگویی نسخه اول اصلی و نسخه دومی ساختگی است:",
      "promptEn": "Assemble the cohesive comparative sentence using former/latter:",
      "hintFa": "Between the two drafts, the former is authentic while the latter is fraudulent.",
      "goldenRuleFa": "نکته طلایی: The former به مورد اول و The latter به مورد دوم اشاره دارد.",
      "scrambledChips": [
        { "id": "c1", "text": "The" },
        { "id": "c2", "text": "former" },
        { "id": "c3", "text": "is" },
        { "id": "c4", "text": "authentic," },
        { "id": "c5", "text": "whereas" },
        { "id": "c6", "text": "the" },
        { "id": "c7", "text": "latter" },
        { "id": "c8", "text": "is" },
        { "id": "c9", "text": "forged." },
        { "id": "d1", "text": "later", "isDistractor": True, "distractorReasonFa": "کلمه latter با دو تا t به معنی «دومی» است، later یعنی «بعداً»!" }
      ],
      "correctSequence": ["The", "former", "is", "authentic,", "whereas", "the", "latter", "is", "forged."],
      "assembledSentence": "The former is authentic, whereas the latter is forged."
    },
    "round2": {
      "id": "w-b2-5-r2",
      "roundTitleFa": "پیوند تحلیل امضا",
      "contextFa": "جوهر امضا با تاریخ کاغذ همخوانی ندارد علاوه بر این امضا با دست لرزان کشیده شده:",
      "sentenceA": "The ink composition does not match the paper's era",
      "sentenceB": "the signature exhibits tremor marks consistent with tracing.",
      "targetSlot": "The ink composition does not match the paper's era; [___], the signature exhibits tremor marks consistent with tracing.",
      "connectorOptions": [
        { "text": "moreover", "isCorrect": True, "explanationFa": "moreover یعنی علاوه بر این، و یک دلیل اثباتی محکم‌تر را به مدرک قبلی می‌افزاید." },
        { "text": "instead", "isCorrect": False, "explanationFa": "جایگزینی نیست." },
        { "text": "despite", "isCorrect": False, "explanationFa": "تضادی وجود ندارد." }
      ],
      "lexicalUpgrade": {
        "originalWord": "fake writing",
        "promptFa": "اصطلاح جرم‌شناسی برای دستکاری و جعل سند انتخاب کن:",
        "upgrades": [
          { "text": "meticulous forgery", "isCorrect": True, "explanationFa": "meticulous forgery یعنی جعل ماهرانه و دقیق." },
          { "text": "bad drawing", "isCorrect": False, "explanationFa": "bad drawing یعنی نقاشی بد!" }
        ]
      }
    },
    "round3": {
      "id": "w-b2-5-r3",
      "roundTitleFa": "تایپ ارجاع تلویحی",
      "briefFa": "کلمه اشاره به معنی «چنین» ناهماهنگی‌هایی را تایپ کن:",
      "briefEn": "Type the cohesive demonstrative determiner:",
      "templateSentence": "[___] anomalies cannot be dismissed as accidental.",
      "targetBlank": "Such",
      "acceptableAnswers": ["Such", "These"],
      "typingHintFa": "کلمه ۴ حرفی به معنی چنین (S-u-c-h).",
      "explanationFa": "Such anomalies یعنی چنین ناهماهنگی‌هایی که اشاره به موارد پیش‌گفته دارد.",
      "quickChips": ["Such", "Much", "Each"]
    }
  },
  {
    "levelNumber": 6,
    "cefr": "B2",
    "theme": "noir-evidence-board",
    "themeTitleFa": "اتاق مدارک کارآگاه نوآر",
    "caseCode": "CASE-B2-06",
    "stageTitleEn": "The Heist Reconstruction: Participle Clauses",
    "stageTitleFa": "بازسازی صحنه سرقت: جمله‌واره‌های وجه وصفی با Having bypassed",
    "scenarioFa": "جملات طولانی و سنگین بازسازی صحنه جرم را با عبارات وصفی فاعلی و مفعولی (Having breached / Realizing) فشرده و حرفه‌ای بنویس.",
    "locationFa": "راهروی حسگرهای لیزری موزه ملی",
    "pillar": "word-order-punctuation",
    "xpReward": 165,
    "timeLimitSeconds": 90,
    "round1": {
      "id": "w-b2-6-r1",
      "roundTitleFa": "چیدمان عبارت وصفی کامل",
      "promptFa": "کارت‌ها را بچین تا بگویی سارق پس از دور زدن سنسورها وارد خزانه شد:",
      "promptEn": "Assemble the perfect participle clause sentence:",
      "hintFa": "Having bypassed the infrared grid, the thief entered the vault.",
      "goldenRuleFa": "نکته طلایی: ساختار Having + p.p برای نشان دادن عملی است که قبل از عمل اصلی تمام شده است.",
      "scrambledChips": [
        { "id": "c1", "text": "Having" },
        { "id": "c2", "text": "disabled" },
        { "id": "c3", "text": "the" },
        { "id": "c4", "text": "cameras," },
        { "id": "c5", "text": "the" },
        { "id": "c6", "text": "thief" },
        { "id": "c7", "text": "approached" },
        { "id": "c8", "text": "the" },
        { "id": "c9", "text": "safe." },
        { "id": "d1", "text": "have", "isDistractor": True, "distractorReasonFa": "در ابتدای عبارت وصفی کامل باید شکل Having بیاید نه have!" }
      ],
      "correctSequence": ["Having", "disabled", "the", "cameras,", "the", "thief", "approached", "the", "safe."],
      "assembledSentence": "Having disabled the cameras, the thief approached the safe."
    },
    "round2": {
      "id": "w-b2-6-r2",
      "roundTitleFa": "نتیجه هم‌زمان با عبارت وصفی",
      "contextFa": "او با آگاهی از حضور نگهبانان، سریعاً از شفت تهویه گریخت:",
      "sentenceA": "He realized the guards were near",
      "sentenceB": "he escaped through the rooftop vent.",
      "targetSlot": "Realizing the guards were closing in, [___] he escaped through the rooftop vent.",
      "connectorOptions": [
        { "text": "", "isCorrect": True, "explanationFa": "در جمله‌واره‌های وصفی، بعد از کاما بلافاصله فاعل اصلی می‌آید و نیازی به کلمه ربط اضافه نیست." },
        { "text": "so", "isCorrect": False, "explanationFa": "آوردن so بعد از کامای عبارت وصفی غلط گرامری است." },
        { "text": "because", "isCorrect": False, "explanationFa": "خود Realizing مفهوم علت را درون خود دارد." }
      ],
      "lexicalUpgrade": {
        "originalWord": "went through",
        "promptFa": "فعل تخصصی‌تر برای عبور مخفیانه انتخاب کن:",
        "upgrades": [
          { "text": "infiltrated via", "isCorrect": True, "explanationFa": "infiltrated via یعنی از طریق... نفوذ نامحسوس کرد." },
          { "text": "walked into", "isCorrect": False, "explanationFa": "walked into یعنی عادی راه رفت." }
        ]
      }
    },
    "round3": {
      "id": "w-b2-6-r3",
      "roundTitleFa": "تایپ عبارت وجه وصفی حال",
      "briefFa": "فعل know را به شکل وجه وصفی حال برای ابتدای جمله تایپ کن:",
      "briefEn": "Type the present participle form of know:",
      "templateSentence": "[___] the risks, he proceeded regardless.",
      "targetBlank": "Knowing",
      "acceptableAnswers": ["Knowing"],
      "typingHintFa": "فعل Know + ing (با دانستنِ).",
      "explanationFa": "Knowing the risks یعنی با علم به خطرات موجود.",
      "quickChips": ["Knowing", "Known", "Knew"]
    }
  },
  {
    "levelNumber": 7,
    "cefr": "B2",
    "theme": "noir-evidence-board",
    "themeTitleFa": "اتاق مدارک کارآگاه نوآر",
    "caseCode": "CASE-B2-07",
    "stageTitleEn": "The Syndicate Ledger: Inverted Conditionals",
    "stageTitleFa": "دفتر کل کارتل: جملات شرطی وارونه با Had he known",
    "scenarioFa": "اسناد رمزگذاری شده شبکه مافیا کشف شده. گزارش سناریوهای فرضی را با ساختار شیک شرطی وارونه بدون if بازنویسی کن.",
    "locationFa": "مخفیگاه ساحلی رییس کارتل",
    "pillar": "academic-inversion",
    "xpReward": 170,
    "timeLimitSeconds": 95,
    "round1": {
      "id": "w-b2-7-r1",
      "roundTitleFa": "چیدمان شرطی وارونه نوع سوم",
      "promptFa": "کارت‌ها را بچین تا بگویی اگر نگهبانان هوشیار بودند، سرقت رخ نمی‌داد:",
      "promptEn": "Assemble the inverted third conditional sentence (omitting 'if'):",
      "hintFa": "Had the guards remained alert, the breach would have been averted.",
      "goldenRuleFa": "نکته طلایی: فرمول شرطی وارونه نوع ۳: Had + فاعل + شکل سوم فعل (p.p).",
      "scrambledChips": [
        { "id": "c1", "text": "Had" },
        { "id": "c2", "text": "the" },
        { "id": "c3", "text": "guards" },
        { "id": "c4", "text": "been" },
        { "id": "c5", "text": "alert," },
        { "id": "c6", "text": "the" },
        { "id": "c7", "text": "heist" },
        { "id": "c8", "text": "would" },
        { "id": "c9", "text": "fail." },
        { "id": "d1", "text": "if had", "isDistractor": True, "distractorReasonFa": "در حالت Inversion کلمه if کاملاً حذف می‌شود!" }
      ],
      "correctSequence": ["Had", "the", "guards", "been", "alert,", "the", "heist", "would", "fail."],
      "assembledSentence": "Had the guards been alert, the heist would fail."
    },
    "round2": {
      "id": "w-b2-7-r2",
      "roundTitleFa": "شرطی نوع دوم با Were",
      "contextFa": "اگر متهم بی‌پناه و فقیر بود، چنین وکلای گران‌قیمتی استخدام نمی‌کرد:",
      "sentenceA": "The suspect claims indigence",
      "sentenceB": "were he truly penniless, he could not afford senior counsel.",
      "targetSlot": "The suspect claims indigence; [___], were he truly penniless, he could not afford senior counsel.",
      "connectorOptions": [
        { "text": "yet", "isCorrect": True, "explanationFa": "yet تضاد ظریف را در کنار شرطی وارونه به زیبایی نشان می‌دهد." },
        { "text": "because", "isCorrect": False, "explanationFa": "علت و معلول نیست." },
        { "text": "so", "isCorrect": False, "explanationFa": "نتیجه‌گیری مستقیم نیست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "poor",
        "promptFa": "کلمه حقوقی و رسمی‌تر برای ورشکسته و بی‌نوا انتخاب کن:",
        "upgrades": [
          { "text": "destitute", "isCorrect": True, "explanationFa": "destitute یعنی کاملاً تهیدست و بی‌پول." },
          { "text": "cheap", "isCorrect": False, "explanationFa": "cheap یعنی ارزان." }
        ]
      }
    },
    "round3": {
      "id": "w-b2-7-r3",
      "roundTitleFa": "تایپ وارونگی شرطی زمان حال",
      "briefFa": "کلمه Should را برای ساختار شرطی وارونه رسمی نوع اول تایپ کن:",
      "briefEn": "Type the inverted conditional word replacing 'if':",
      "templateSentence": "[___] you discover any further records, notify headquarters.",
      "targetBlank": "Should",
      "acceptableAnswers": ["Should"],
      "typingHintFa": "کلمه ۶ حرفی Should به جای if (چنانچه...).",
      "explanationFa": "Should you discover یعنی اگر احیاناً کشف کردید.",
      "quickChips": ["Should", "Could", "Would"]
    }
  },
  {
    "levelNumber": 8,
    "cefr": "B2",
    "theme": "noir-evidence-board",
    "themeTitleFa": "اتاق مدارک کارآگاه نوآر",
    "caseCode": "CASE-B2-08",
    "stageTitleEn": "Press Conference Statement: Nuanced Hedging",
    "stageTitleFa": "بیانیه کنفرانس مطبوعاتی: تعدیل احتیاط‌آمیز لحن با Hedging",
    "scenarioFa": "خبرنگاران به دنبال تیتر جنجالی هستند. سخنگوی پلیس باید بیانیه‌ای دقیق با زبان محتاطانه (It appears that / Evidence indicates) بنویسد تا اتهام زودهنگام وارد نشود.",
    "locationFa": "اتاق نشست خبری فرماندهی پلیس",
    "pillar": "paragraph-register",
    "xpReward": 175,
    "timeLimitSeconds": 95,
    "round1": {
      "id": "w-b2-8-r1",
      "roundTitleFa": "چیدمان بیانیه محتاطانه",
      "promptFa": "کارت‌ها را بچین تا بگویی شواهد مقدماتی نشان می‌دهد که فرضیه تبانی محتمل است:",
      "promptEn": "Assemble the carefully hedged press statement:",
      "hintFa": "Preliminary findings suggest that collusion appears likely.",
      "goldenRuleFa": "نکته طلایی: استفاده از افعالی مانند suggest / appear به جای proves برای تعدیل لحن ضروری است.",
      "scrambledChips": [
        { "id": "c1", "text": "Available" },
        { "id": "c2", "text": "data" },
        { "id": "c3", "text": "suggests" },
        { "id": "c4", "text": "that" },
        { "id": "c5", "text": "conspiracy" },
        { "id": "c6", "text": "appears" },
        { "id": "c7", "text": "plausible." },
        { "id": "d1", "text": "definitely proves", "isDistractor": True, "distractorReasonFa": "در بیانیه‌های محتاطانه (Hedging) نباید از واژگان قطعی مثل definitely proves استفاده کرد." }
      ],
      "correctSequence": ["Available", "data", "suggests", "that", "conspiracy", "appears", "plausible."],
      "assembledSentence": "Available data suggests that conspiracy appears plausible."
    },
    "round2": {
      "id": "w-b2-8-r2",
      "roundTitleFa": "مدیریت انتظارات عمومی",
      "contextFa": "پیشرفت خوبی حاصل شده اما شهروندان باید تا اتمام تحقیقات صبور باشند:",
      "sentenceA": "Substantial progress has been achieved",
      "sentenceB": "conclusive statements remain premature at this juncture.",
      "targetSlot": "Substantial progress has been achieved; [___], conclusive statements remain premature at this juncture.",
      "connectorOptions": [
        { "text": "nevertheless", "isCorrect": True, "explanationFa": "nevertheless تعادل بین موفقیت تیم و ضرورت احتیاط را به خوبی برقرار می‌سازد." },
        { "text": "in addition", "isCorrect": False, "explanationFa": "جمله دوم تکمیلی نیست بلکه تحدیدکننده است." },
        { "text": "because", "isCorrect": False, "explanationFa": "علت و معلول نیستند." }
      ],
      "lexicalUpgrade": {
        "originalWord": "we think",
        "promptFa": "عبارت سازمانی فاخرتر به جای we think انتخاب کن:",
        "upgrades": [
          { "text": "it is widely presumed", "isCorrect": True, "explanationFa": "it is widely presumed یعنی چنین برآورد و گمانه‌زنی می‌شود." },
          { "text": "we guess", "isCorrect": False, "explanationFa": "we guess یعنی حدس می‌زنیم که خیلی غیرحرفه‌ای است." }
        ]
      }
    },
    "round3": {
      "id": "w-b2-8-r3",
      "roundTitleFa": "تایپ فعل تعدیل لحن",
      "briefFa": "فعل به معنی «به نظر می‌رسد / چنین می‌نماید» را تایپ کن:",
      "briefEn": "Type the primary hedging verb:",
      "templateSentence": "The suspect [___] to have acted with outside assistance.",
      "targetBlank": "appears",
      "acceptableAnswers": ["appears", "seems"],
      "typingHintFa": "فعل ۷ حرفی به نظر می‌رسد (a-p-p-e-a-r-s).",
      "explanationFa": "appears to have acted یعنی به نظر می‌رسد که عمل کرده باشد.",
      "quickChips": ["appears", "is", "must"]
    }
  },
  {
    "levelNumber": 9,
    "cefr": "B2",
    "theme": "noir-evidence-board",
    "themeTitleFa": "اتاق مدارک کارآگاه نوآر",
    "caseCode": "CASE-B2-09",
    "stageTitleEn": "The Detective's Memoir: Complex Sentence Packaging",
    "stageTitleFa": "خاطرات بازرس: بسته‌بندی جملات پیچیده و ریتم روایی غنی",
    "scenarioFa": "یادداشت‌های پایانی بازرس پیش از بازنشستگی باید دارای غنای زبانی و ساختار ترکیبی از جمله‌واره‌های فرعی و اصلی باشد.",
    "locationFa": "ایستگاه قطار در شب بارانی",
    "pillar": "paragraph-register",
    "xpReward": 180,
    "timeLimitSeconds": 100,
    "round1": {
      "id": "w-b2-9-r1",
      "roundTitleFa": "چیدمان پاراگراف غنی چندبندی",
      "promptFa": "کارت‌ها را بچین تا جمله تأملی چندبندی بازرس را بسازی:",
      "promptEn": "Assemble the multi-clause reflective narrative sentence:",
      "hintFa": "Though the streets had grown quiet, the weight of the unsolved riddle lingered.",
      "goldenRuleFa": "نکته طلایی: ساختار بند پیرو (Though...) با بند پایه هماهنگ می‌شود.",
      "scrambledChips": [
        { "id": "c1", "text": "Though" },
        { "id": "c2", "text": "the" },
        { "id": "c3", "text": "streets" },
        { "id": "c4", "text": "grew" },
        { "id": "c5", "text": "silent," },
        { "id": "c6", "text": "the" },
        { "id": "c7", "text": "truth" },
        { "id": "c8", "text": "echoed." },
        { "id": "d1", "text": "but yet", "isDistractor": True, "distractorReasonFa": "حشو زبانی است؛ ترکیب but yet در این ساختار غلط است." }
      ],
      "correctSequence": ["Though", "the", "streets", "grew", "silent,", "the", "truth", "echoed."],
      "assembledSentence": "Though the streets grew silent, the truth echoed."
    },
    "round2": {
      "id": "w-b2-9-r2",
      "roundTitleFa": "نتیجه‌گیری فلسفی",
      "contextFa": "سال‌ها سپری شد اما عدالت بالاخره مسیر خود را پیدا کرد:",
      "sentenceA": "Decades elapsed without resolution",
      "sentenceB": "retribution eventually caught up with the perpetrators.",
      "targetSlot": "Decades elapsed without resolution; [___], retribution eventually caught up with the perpetrators.",
      "connectorOptions": [
        { "text": "ultimately", "isCorrect": True, "explanationFa": "ultimately یعنی در غایت امر و فرجام نهایی، و ریتم روایی نوآر را به کمال می‌رساند." },
        { "text": "for instance", "isCorrect": False, "explanationFa": "مثال نیست." },
        { "text": "initially", "isCorrect": False, "explanationFa": "initially برای شروع است نه پایان دهه‌ها انتظار." }
      ],
      "lexicalUpgrade": {
        "originalWord": "caught him",
        "promptFa": "عبارت ادبی‌تر برای مجازات شدن مقصر انتخاب کن:",
        "upgrades": [
          { "text": "brought him to justice", "isCorrect": True, "explanationFa": "brought him to justice یعنی او را پای میز محاکمه و اجرای عدالت کشاند." },
          { "text": "grabbed his coat", "isCorrect": False, "explanationFa": "grabbed his coat یعنی کتش را گرفت." }
        ]
      }
    },
    "round3": {
      "id": "w-b2-9-r3",
      "roundTitleFa": "تایپ صفت به معنی حل‌ناشدنی",
      "briefFa": "صفت به معنی «معمای حل‌نشدنی و سردرگم‌کننده» را تایپ کن:",
      "briefEn": "Type the adjective meaning defying explanation:",
      "templateSentence": "It remained an [___] enigma for decades.",
      "targetBlank": "unsolved",
      "acceptableAnswers": ["unsolved", "insoluble", "inexplicable"],
      "typingHintFa": "کلمه ۸ حرفی حل‌نشده (u-n-s-o-l-v-e-d).",
      "explanationFa": "an unsolved enigma یعنی معمایی گره‌خورده و حل‌نشده.",
      "quickChips": ["unsolved", "simple", "closed"]
    }
  },
  {
    "levelNumber": 10,
    "cefr": "B2",
    "theme": "noir-evidence-board",
    "themeTitleFa": "اتاق مدارک کارآگاه نوآر",
    "caseCode": "CASE-B2-10",
    "stageTitleEn": "Master Case: The Syndicate Mastermind Trial Dossier",
    "stageTitleFa": "غول مرحله آخر: لایحه کامل محاکمه مغز متفکر کارتل",
    "scenarioFa": "دادگاه تاریخی سران مافیا در جریان است! با تلفیق تمام مهارت‌های نگارش B2، بیانیه نهایی هیئت منصفه را تدوین کن تا جام طلایی B2 را به دست آوری و قفل پروتکل سایبری C1 باز شود!",
    "locationFa": "تالار اصلی دیوان عالی کشور",
    "pillar": "master-investigation",
    "xpReward": 220,
    "timeLimitSeconds": 110,
    "isBossStage": True,
    "round1": {
      "id": "w-b2-10-r1",
      "roundTitleFa": "چیدمان بیانیه نهایی محاکمه",
      "promptFa": "کارت‌های لایحه اتهامی مغز متفکر کارتل را مرتب کن:",
      "promptEn": "Assemble the master trial closing indictment sentence:",
      "hintFa": "The evidence unequivocally demonstrates that the syndicate operated under his direct authority.",
      "goldenRuleFa": "نکته طلایی: استفاده از قیدهای تأکیدی مانند unequivocally در نگارش عالی قضایی.",
      "scrambledChips": [
        { "id": "c1", "text": "The" },
        { "id": "c2", "text": "proof" },
        { "id": "c3", "text": "unequivocally" },
        { "id": "c4", "text": "links" },
        { "id": "c5", "text": "the" },
        { "id": "c6", "text": "boss" },
        { "id": "c7", "text": "to" },
        { "id": "c8", "text": "the" },
        { "id": "c9", "text": "crimes." },
        { "id": "d1", "text": "link", "isDistractor": True, "distractorReasonFa": "کلمه proof مفرد است و فعل حتماً s می‌گیرد (links)." }
      ],
      "correctSequence": ["The", "proof", "unequivocally", "links", "the", "boss", "to", "the", "crimes."],
      "assembledSentence": "The proof unequivocally links the boss to the crimes."
    },
    "round2": {
      "id": "w-b2-10-r2",
      "roundTitleFa": "رد آخرین خط دفاعی",
      "contextFa": "دفاعیه بر نقص مدارک متکی بود اما شواهد زنجیره‌ای خدشه‌ناپذیر هستند:",
      "sentenceA": "The defense argued procedural irregularity",
      "sentenceB": "the chain of custody remained impeccable throughout.",
      "targetSlot": "The defense argued procedural irregularity; [___], the chain of custody remained impeccable throughout.",
      "connectorOptions": [
        { "text": "notwithstanding this assertion", "isCorrect": True, "explanationFa": "notwithstanding this assertion یعنی علیرغم این ادعا، و نهایت تسلط بر رایتینگ پیشرفته است." },
        { "text": "because of this", "isCorrect": False, "explanationFa": "علت و معلول نیست." },
        { "text": "for example", "isCorrect": False, "explanationFa": "مثال نیست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "bad criminal",
        "promptFa": "اصطلاح درجات عالی برای متهم ردیف اول سازمان‌یافته انتخاب کن:",
        "upgrades": [
          { "text": "orchestrator of the enterprise", "isCorrect": True, "explanationFa": "orchestrator of the enterprise یعنی معمار و هماهنگ‌کننده کل شبکه مجرمانه." },
          { "text": "troublemaker", "isCorrect": False, "explanationFa": "troublemaker کلمه‌ای سطحی و روزمره است." }
        ]
      }
    },
    "round3": {
      "id": "w-b2-10-r3",
      "roundTitleFa": "تایپ کلمه حکم قطعی",
      "briefFa": "کلمه حقوقی به معنی «محکومیت قطعی کیفری» را تایپ کن:",
      "briefEn": "Type the formal criminal conviction noun:",
      "templateSentence": "The verdict secured an absolute [___].",
      "targetBlank": "conviction",
      "acceptableAnswers": ["conviction", "judgment"],
      "typingHintFa": "کلمه ۱۰ حرفی محکومیت (c-o-n-v-i-c-t-i-o-n).",
      "explanationFa": "secured an absolute conviction یعنی محکومیت قطعی و کامل را به همراه آورد.",
      "quickChips": ["conviction", "release", "bail"]
    }
  }
]

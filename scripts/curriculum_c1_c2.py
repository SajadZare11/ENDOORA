# -*- coding: utf-8 -*-
"""
C1 and C2 Cases for Writing Clue Hunter:
Theme: 'cyber-intel-dossier' (اتاق ضداطلاعات و پروتکل سایبری)
"""

C1_CASES = [
  {
    "levelNumber": 1,
    "cefr": "C1",
    "theme": "cyber-intel-dossier",
    "themeTitleFa": "اتاق ضداطلاعات و پروتکل سایبری",
    "caseCode": "DOSSIER-C1-01",
    "stageTitleEn": "Breach Protocol: Syntactic Inversion",
    "stageTitleFa": "نفوذ سایبری: ساختارهای وارونگی نحوی با Seldom و Rarely",
    "scenarioFa": "سیستم‌های رمزگذاری دولتی هدف حمله‌ای ناشناخته قرار گرفته‌اند. برای گزارش اضطراری به شورای امنیت ملی، از وارونگی نحوی برای تاکید حداکثری بر وخامت اوضاع استفاده کن.",
    "locationFa": "مرکز عملیات امنیت سایبری (SOC) - سطح فوق‌محرمانه",
    "pillar": "academic-inversion",
    "xpReward": 180,
    "timeLimitSeconds": 90,
    "round1": {
      "id": "w-c1-1-r1",
      "roundTitleFa": "رمزگشایی وارونگی منفی",
      "promptFa": "کارت‌ها را بچین تا گزاره وارونگی نحوی را با Seldom بسازی:",
      "promptEn": "Assemble the negative syntactic inversion sentence:",
      "hintFa": "Seldom has the agency encountered an intrusion of this sophistication.",
      "goldenRuleFa": "نکته طلایی: وقتی قید منفی (Seldom / Rarely / Never) اول جمله می‌آید، ساختار جمله مثل سوالی وارونه می‌شود: Seldom + فعل کمکی + فاعل.",
      "scrambledChips": [
        { "id": "c1", "text": "Seldom" },
        { "id": "c2", "text": "has" },
        { "id": "c3", "text": "our" },
        { "id": "c4", "text": "network" },
        { "id": "c5", "text": "seen" },
        { "id": "c6", "text": "such" },
        { "id": "c7", "text": "a" },
        { "id": "c8", "text": "threat." },
        { "id": "d1", "text": "our network has", "isDistractor": True, "distractorReasonFa": "در ساختار Inversion بعد از Seldom باید بلافاصله فعل کمکی has بیاید نه فاعل!" }
      ],
      "correctSequence": ["Seldom", "has", "our", "network", "seen", "such", "a", "threat."],
      "assembledSentence": "Seldom has our network seen such a threat."
    },
    "round2": {
      "id": "w-c1-1-r2",
      "roundTitleFa": "پیوند دو تهدید با Not only",
      "contextFa": "هکرها نه تنها فایروال را دور زدند، بلکه ردهای دیجیتالی را نیز پاک کردند:",
      "sentenceA": "Not only did the intruders bypass the perimeter",
      "sentenceB": "they systematically eradicated audit logs.",
      "targetSlot": "Not only did the intruders bypass the perimeter, [___] they systematically eradicated audit logs.",
      "connectorOptions": [
        { "text": "but also", "isCorrect": True, "explanationFa": "Not only حتماً با but also در بند دوم همراه می‌شود تا تقارن نحوی C1 رعایت شود." },
        { "text": "and yet", "isCorrect": False, "explanationFa": "and yet تضاد است نه توسعه اطلاعات." },
        { "text": "in case", "isCorrect": False, "explanationFa": "in case شرط احتمالی است." }
      ],
      "lexicalUpgrade": {
        "originalWord": "very smart hack",
        "promptFa": "اصطلاح فنی عالی برای نفوذ پیچیده و چندلایه انتخاب کن:",
        "upgrades": [
          { "text": "highly sophisticated cyber-espionage campaign", "isCorrect": True, "explanationFa": "اصطلاحی دقیق، آکادمیک و متناسب با گزارش‌های اطلاعاتی." },
          { "text": "clever computer trick", "isCorrect": False, "explanationFa": "clever computer trick لحنی کاملاً عامیانه دارد." }
        ]
      }
    },
    "round3": {
      "id": "w-c1-1-r3",
      "roundTitleFa": "تایپ وارونگی تکمیلی",
      "briefFa": "کلمه قید منفی به معنی «به ندرت» را برای شروع ساختار اینورژن تایپ کن:",
      "briefEn": "Type the restrictive adverb initiating negative inversion:",
      "templateSentence": "[___] did the telemetry indicate any anomalies.",
      "targetBlank": "Rarely",
      "acceptableAnswers": ["Rarely", "Scarcely", "Seldom"],
      "typingHintFa": "کلمه ۶ حرفی به ندرت (R-a-r-e-l-y).",
      "explanationFa": "Rarely did the telemetry indicate یعنی به ندرت داده‌های راداری نشانه‌ای ثبت کردند.",
      "quickChips": ["Rarely", "Often", "Always"]
    }
  },
  {
    "levelNumber": 2,
    "cefr": "C1",
    "theme": "cyber-intel-dossier",
    "themeTitleFa": "اتاق ضداطلاعات و پروتکل سایبری",
    "caseCode": "DOSSIER-C1-02",
    "stageTitleEn": "The Redacted Cable: Cleft Sentences",
    "stageTitleFa": "سند سیاه شده: جملات شکافته تاکیدی با It was... that",
    "scenarioFa": "بخشی از سند تلگراف دیپلماتیک با جوهر سیاه پوشانده شده. با ساخت جملات تاکیدی Cleft، دقیقا روی عاملی که امنیت را به خطر انداخته تمرکز کن.",
    "locationFa": "اتاق تاریک پردازش اسناد دیپلماتیک",
    "pillar": "word-order-punctuation",
    "xpReward": 185,
    "timeLimitSeconds": 90,
    "round1": {
      "id": "w-c1-2-r1",
      "roundTitleFa": "چیدمان جمله تاکیدی Cleft",
      "promptFa": "کارت‌ها را بچین تا تاکید کنی که دقیقا فاکتور زمان افشا مایه نگرانی بوده است:",
      "promptEn": "Assemble the emphatic 'It-cleft' sentence:",
      "hintFa": "It was the specific timestamp that exposed the mole's identity.",
      "goldenRuleFa": "نکته طلایی: ساختار It was [X] that/who... برای متمرکز کردن نورافکن توجه بر یک عنصر حیاتی است.",
      "scrambledChips": [
        { "id": "c1", "text": "It" },
        { "id": "c2", "text": "was" },
        { "id": "c3", "text": "the" },
        { "id": "c4", "text": "timestamp" },
        { "id": "c5", "text": "that" },
        { "id": "c6", "text": "exposed" },
        { "id": "c7", "text": "the" },
        { "id": "c8", "text": "mole." },
        { "id": "d1", "text": "which", "isDistractor": True, "distractorReasonFa": "در جملات شکافته استاندارد برای تاکید روی موضوع غیرشخصی از that استفاده می‌شود." }
      ],
      "correctSequence": ["It", "was", "the", "timestamp", "that", "exposed", "the", "mole."],
      "assembledSentence": "It was the timestamp that exposed the mole."
    },
    "round2": {
      "id": "w-c1-2-r2",
      "roundTitleFa": "تاکید با What-cleft",
      "contextFa": "آنچه آژانس را شوکه کرد نه خود نفوذ، بلکه مدت زمان پنهان ماندن آن بود:",
      "sentenceA": "The intrusion itself was anticipated",
      "sentenceB": "what alarmed analysts was the adversary's protracted persistence.",
      "targetSlot": "The intrusion itself was anticipated; [___], what alarmed analysts was the adversary's protracted persistence.",
      "connectorOptions": [
        { "text": "however", "isCorrect": True, "explanationFa": "however بین امر پیش‌بینی‌شده و شگفتی پنهان‌کاری تعادل می‌سازد." },
        { "text": "as a result", "isCorrect": False, "explanationFa": "نتیجه‌گیری مستقیم نیست." },
        { "text": "similarly", "isCorrect": False, "explanationFa": "تشابه نیست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "long stay",
        "promptFa": "اصطلاح فنی امنیت سایبری برای حضور مداوم و خاموش در شبکه انتخاب کن:",
        "upgrades": [
          { "text": "protracted dwell time", "isCorrect": True, "explanationFa": "protracted dwell time اصطلاحی فوق‌العاده تخصصی برای مدت زمان ماندگاری نفوذگر در سیستم است." },
          { "text": "big camping", "isCorrect": False, "explanationFa": "camping مناسب بازی‌های ویدیویی است نه گزارش اطلاعاتی!" }
        ]
      }
    },
    "round3": {
      "id": "w-c1-2-r3",
      "roundTitleFa": "تایپ آغازگر جمله تاکیدی",
      "briefFa": "کلمه آغازگر جملات شکافته تاکیدی اسمی را تایپ کن:",
      "briefEn": "Type the wh-cleft pronoun beginning the sentence:",
      "templateSentence": "[___] the director demanded was an unredacted version.",
      "targetBlank": "What",
      "acceptableAnswers": ["What", "All"],
      "typingHintFa": "کلمه ۴ حرفی What (آنچه که...).",
      "explanationFa": "What the director demanded was... یعنی آنچه مدیر مطالبه کرد نسخه بدون سانسور بود.",
      "quickChips": ["What", "That", "When"]
    }
  },
  {
    "levelNumber": 3,
    "cefr": "C1",
    "theme": "cyber-intel-dossier",
    "themeTitleFa": "اتاق ضداطلاعات و پروتکل سایبری",
    "caseCode": "DOSSIER-C1-03",
    "stageTitleEn": "National Security Brief: Advanced Nominalization",
    "stageTitleFa": "گزارش امنیت ملی: اسم‌سازی آکادمیک (Nominalization)",
    "scenarioFa": "گزارش‌های طولانی و فعل‌محور برای جلسات سران خسته‌کننده‌اند. با تبدیل جملات فعلی به ساختارهای اسمی فشرده، بیانیه نهایی را مقتدرانه کن.",
    "locationFa": "اتاق توجیهی شورای عالی امنیت ملی",
    "pillar": "academic-inversion",
    "xpReward": 190,
    "timeLimitSeconds": 95,
    "round1": {
      "id": "w-c1-3-r1",
      "roundTitleFa": "چیدمان ساختار اسمی فشرده",
      "promptFa": "کارت‌ها را بچین تا گزاره متراکم اسمی درباره گسترش آلودگی را بسازی:",
      "promptEn": "Assemble the densely nominalized analytical sentence:",
      "hintFa": "The rapid proliferation of unauthorized nodes triggered immediate containment.",
      "goldenRuleFa": "نکته طلایی: اسم‌سازی (Nominalization) مثل proliferation به جای spread out متن را آکادمیک و وزین می‌سازد.",
      "scrambledChips": [
        { "id": "c1", "text": "The" },
        { "id": "c2", "text": "rapid" },
        { "id": "c3", "text": "proliferation" },
        { "id": "c4", "text": "of" },
        { "id": "c5", "text": "nodes" },
        { "id": "c6", "text": "prompted" },
        { "id": "c7", "text": "immediate" },
        { "id": "c8", "text": "containment." },
        { "id": "d1", "text": "proliferating", "isDistractor": True, "distractorReasonFa": "در ساختار اسمی رسمی از اسم مجرد proliferation استفاده می‌شود نه صفت فعلی." }
      ],
      "correctSequence": ["The", "rapid", "proliferation", "of", "nodes", "prompted", "immediate", "containment."],
      "assembledSentence": "The rapid proliferation of nodes prompted immediate containment."
    },
    "round2": {
      "id": "w-c1-3-r2",
      "roundTitleFa": "پیوند علت و معلول با ساختار اسمی",
      "contextFa": "نابودی داده‌ها منجر به توقف کامل سرویس‌های بانکی شد:",
      "sentenceA": "The deliberate deletion of primary databases occurred",
      "sentenceB": "an unprecedented cessation of financial transactions ensued.",
      "targetSlot": "The deliberate deletion of primary databases occurred, [___] an unprecedented cessation of financial transactions ensued.",
      "connectorOptions": [
        { "text": "whereby", "isCorrect": True, "explanationFa": "whereby یعنی «که به موجب آن / که در پی آن» و پیوندی منسجم و رسمی بین دو رخداد ایجاد می‌کند." },
        { "text": "because", "isCorrect": False, "explanationFa": "because برای ریتم جملات اسمی سنگین ابتدایی است." },
        { "text": "in spite of", "isCorrect": False, "explanationFa": "تضادی وجود ندارد." }
      ],
      "lexicalUpgrade": {
        "originalWord": "bad stop",
        "promptFa": "اصطلاح آکادمیک برای توقف کامل عملیات انتخاب کن:",
        "upgrades": [
          { "text": "catastrophic operational paralysis", "isCorrect": True, "explanationFa": "catastrophic operational paralysis یعنی فلج کامل و فاجعه‌بار عملیاتی." },
          { "text": "big pause", "isCorrect": False, "explanationFa": "big pause یعنی مکث بزرگ که نامناسب است." }
        ]
      }
    },
    "round3": {
      "id": "w-c1-3-r3",
      "roundTitleFa": "تایپ اسم انتزاعی کلیدی",
      "briefFa": "اسم به معنی «افزایش و تشدید وخامت اوضاع» را تایپ کن:",
      "briefEn": "Type the noun meaning severe intensification:",
      "templateSentence": "This incident caused an alarming [___] of tensions.",
      "targetBlank": "escalation",
      "acceptableAnswers": ["escalation", "amplification"],
      "typingHintFa": "کلمه ۱۰ حرفی تشدید (e-s-c-a-l-a-t-i-o-n).",
      "explanationFa": "alarming escalation of tensions یعنی تشدید نگران‌کننده تنش‌ها.",
      "quickChips": ["escalation", "drop", "ending"]
    }
  },
  {
    "levelNumber": 4,
    "cefr": "C1",
    "theme": "cyber-intel-dossier",
    "themeTitleFa": "اتاق ضداطلاعات و پروتکل سایبری",
    "caseCode": "DOSSIER-C1-04",
    "stageTitleEn": "Diplomatic Communiqué: Nuanced Subtlety",
    "stageTitleFa": "پیام دیپلماتیک: احتیاط و ظرافت با زبان فاخر دولتی",
    "scenarioFa": "یک بحران بین‌المللی در حال شکل‌گیری است. سفیر باید پیامی با ظرافت دیپلماتیک بنویسد که بدون اعلام جنگ، عواقب وخیم هرگونه تعرض را گوشزد کند.",
    "locationFa": "سفارتخانه دولت متحد در ژنو",
    "pillar": "paragraph-register",
    "xpReward": 195,
    "timeLimitSeconds": 95,
    "round1": {
      "id": "w-c1-4-r1",
      "roundTitleFa": "چیدمان هشدار دیپلماتیک",
      "promptFa": "کارت‌ها را بچین تا پیام هشدارآمیز و در عین حال رسمی سفیر را تدوین کنی:",
      "promptEn": "Assemble the nuanced diplomatic communiqué sentence:",
      "hintFa": "Any further unilateral measures would inevitably undermine regional stability.",
      "goldenRuleFa": "نکته طلایی: در بیانیه‌های دیپلماتیک، استفاده از قیدهایی مانند inevitably و صفت unilateral دقت بیان را نشان می‌دهد.",
      "scrambledChips": [
        { "id": "c1", "text": "Unilateral" },
        { "id": "c2", "text": "actions" },
        { "id": "c3", "text": "would" },
        { "id": "c4", "text": "inevitably" },
        { "id": "c5", "text": "jeopardize" },
        { "id": "c6", "text": "the" },
        { "id": "c7", "text": "fragile" },
        { "id": "c8", "text": "truce." },
        { "id": "d1", "text": "will definitely", "isDistractor": True, "distractorReasonFa": "در زبان دیپلماتیک از would به جای will استفاده می‌شود تا لحن اولتیماتوم مستقیم تعدیل شود." }
      ],
      "correctSequence": ["Unilateral", "actions", "would", "inevitably", "jeopardize", "the", "fragile", "truce."],
      "assembledSentence": "Unilateral actions would inevitably jeopardize the fragile truce."
    },
    "round2": {
      "id": "w-c1-4-r2",
      "roundTitleFa": "پیوند تمایل به مذاکره در کنار قاطعیت",
      "contextFa": "ما آماده تعامل سازنده هستیم به این شرط که اقدامات خصمانه متوقف گردد:",
      "sentenceA": "Our delegation remains amenable to constructive dialogue",
      "sentenceB": "provocative posturing ceases forthwith.",
      "targetSlot": "Our delegation remains amenable to constructive dialogue, [___] provocative posturing ceases forthwith.",
      "connectorOptions": [
        { "text": "provided that", "isCorrect": True, "explanationFa": "provided that یعنی مشروط بر آنکه، و در قراردادها و بیانیه‌های دیپلماتیک جایگاه ویژه‌ای دارد." },
        { "text": "although", "isCorrect": False, "explanationFa": "تضاد محض نیست بلکه شرط لازم است." },
        { "text": "inasmuch as", "isCorrect": False, "explanationFa": "برای بیان دلیل است نه شرط." }
      ],
      "lexicalUpgrade": {
        "originalWord": "bad danger",
        "promptFa": "اصطلاح دیپلماتیک برای تهدید خطیر حاکمیت ملی انتخاب کن:",
        "upgrades": [
          { "text": "grave peril to sovereignty", "isCorrect": True, "explanationFa": "grave peril to sovereignty یعنی خطری مبرم و هولناک علیه حاکمیت ملی." },
          { "text": "rough situation", "isCorrect": False, "explanationFa": "rough situation محاوره‌ای و ضعیف است." }
        ]
      }
    },
    "round3": {
      "id": "w-c1-4-r3",
      "roundTitleFa": "تایپ قید رسمی زمان دیپلماتیک",
      "briefFa": "قید کهن و بسیار رسمی به معنی «بلافاصله و بی‌درنگ» را تایپ کن:",
      "briefEn": "Type the formal archaism meaning immediately without delay:",
      "templateSentence": "All hostile reconnaissance must cease [___].",
      "targetBlank": "forthwith",
      "acceptableAnswers": ["forthwith", "immediately"],
      "typingHintFa": "کلمه ۹ حرفی بی‌درنگ در اسناد رسمی (f-o-r-t-h-w-i-t-h).",
      "explanationFa": "forthwith یعنی بلادرنگ و بدون هیچ‌گونه فوت وقت در حقوق بین‌الملل.",
      "quickChips": ["forthwith", "later", "never"]
    }
  },
  {
    "levelNumber": 5,
    "cefr": "C1",
    "theme": "cyber-intel-dossier",
    "themeTitleFa": "اتاق ضداطلاعات و پروتکل سایبری",
    "caseCode": "DOSSIER-C1-05",
    "stageTitleEn": "Counter-Disinformation: Concession & Rebuttal",
    "stageTitleFa": "ضدجنگ روانی: ساختار پذیرش اولیه و رد قاطع با Acknowledging that",
    "scenarioFa": "حریف در رسانه‌ها متنی جعلی منتشر کرده که بخشی از آن حقیقت دارد اما نتیجه‌گیری‌اش فریبکارانه است. با تکنیک Concession & Rebuttal دروغ را خنثی کن.",
    "locationFa": "ستاد فرماندهی مبارزه با جنگ شناختی",
    "pillar": "connectors-cohesion",
    "xpReward": 200,
    "timeLimitSeconds": 100,
    "round1": {
      "id": "w-c1-5-r1",
      "roundTitleFa": "چیدمان تکنیک تسلیم و رد",
      "promptFa": "کارت‌ها را بچین تا گزاره پذیرش بخشی از داده‌ها و رد ادعای نهایی را بسازی:",
      "promptEn": "Assemble the sophisticated concession and rebuttal sentence:",
      "hintFa": "Acknowledging that minor breaches occurred, the integrity of the core vault remains uncompromised.",
      "goldenRuleFa": "نکته طلایی: فرمول Acknowledging that [A], [B] remains intact برای خلع سلاح روانی حریف معجزه می‌کند.",
      "scrambledChips": [
        { "id": "c1", "text": "Acknowledging" },
        { "id": "c2", "text": "the" },
        { "id": "c3", "text": "leak," },
        { "id": "c4", "text": "the" },
        { "id": "c5", "text": "core" },
        { "id": "c6", "text": "infrastructure" },
        { "id": "c7", "text": "remains" },
        { "id": "c8", "text": "intact." },
        { "id": "d1", "text": "although acknowledging", "isDistractor": True, "distractorReasonFa": "استفاده همزمان از although و acknowledging غلط و حشو نحوی است." }
      ],
      "correctSequence": ["Acknowledging", "the", "leak,", "the", "core", "infrastructure", "remains", "intact."],
      "assembledSentence": "Acknowledging the leak, the core infrastructure remains intact."
    },
    "round2": {
      "id": "w-c1-5-r2",
      "roundTitleFa": "ابطال نتیجه‌گیری حریف",
      "contextFa": "حریف ادعای فلج شدن سیستم را دارد، در حالی که آمارها خلاف این را ثابت می‌کنند:",
      "sentenceA": "The adversary proclaims total systemic collapse",
      "sentenceB": "empirical metrics unequivocally refute this hyperbole.",
      "targetSlot": "The adversary proclaims total systemic collapse; [___], empirical metrics unequivocally refute this hyperbole.",
      "connectorOptions": [
        { "text": "nevertheless", "isCorrect": True, "explanationFa": "nevertheless برای کوبیدن و ابطال ادعای پرطمطراق حریف با داده‌های عینی شاهکار است." },
        { "text": "in addition", "isCorrect": False, "explanationFa": "تایید ادعا نیست بلکه رد آن است." },
        { "text": "consequently", "isCorrect": False, "explanationFa": "رد کردن نتیجه سخن حریف نیست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "fake news",
        "promptFa": "اصطلاح فنی‌تر در حوزه امنیت روانی به جای fake news انتخاب کن:",
        "upgrades": [
          { "text": "orchestrated disinformation narrative", "isCorrect": True, "explanationFa": "orchestrated disinformation narrative یعنی روایت هدفمند و سازمان‌یافته اطلاعات گمراه‌کننده." },
          { "text": "funny rumor", "isCorrect": False, "explanationFa": "funny rumor یعنی شایعه بامزه!" }
        ]
      }
    },
    "round3": {
      "id": "w-c1-5-r3",
      "roundTitleFa": "تایپ کلمه اغراق مغرضانه",
      "briefFa": "کلمه به معنی «اغراق و بزرگ‌نمایی افراطی» را تایپ کن:",
      "briefEn": "Type the rhetorical noun meaning deliberate exaggeration:",
      "templateSentence": "Their claims constitute baseless [___].",
      "targetBlank": "hyperbole",
      "acceptableAnswers": ["hyperbole", "propaganda"],
      "typingHintFa": "کلمه ۹ حرفی هایپربولی (h-y-p-e-r-b-o-l-e).",
      "explanationFa": "hyperbole یعنی مبالغه و اغراق‌گویی لاف‌زنانه.",
      "quickChips": ["hyperbole", "facts", "truth"]
    }
  },
  {
    "levelNumber": 6,
    "cefr": "C1",
    "theme": "cyber-intel-dossier",
    "themeTitleFa": "اتاق ضداطلاعات و پروتکل سایبری",
    "caseCode": "DOSSIER-C1-06",
    "stageTitleEn": "The Quantum Exploit: Advanced Discourse Markers",
    "stageTitleFa": "نفوذ کوانتومی: نشانگرهای پیشرفته گفتمان با Inasmuch as و Paradoxically",
    "scenarioFa": "دانشمندان پروژه کوانتومی الگوریتمی یافته‌اند که پارادوکسیکال است: هر چه رمز پیچیده‌تر باشد، هوش مصنوعی سریع‌تر آن را می‌شکند. تحلیلی فلسفی-فنی بنویس.",
    "locationFa": "آزمایشگاه محاسبات کوانتومی سرن",
    "pillar": "connectors-cohesion",
    "xpReward": 205,
    "timeLimitSeconds": 100,
    "round1": {
      "id": "w-c1-6-r1",
      "roundTitleFa": "چیدمان تحلیل پارادوکسیکال",
      "promptFa": "کارت‌ها را بچین تا گزاره متناقض‌نما با قید Paradoxically را تدوین کنی:",
      "promptEn": "Assemble the high-tier analytical paradox sentence:",
      "hintFa": "Paradoxically, increasing encryption entropy accelerated the algorithm's deciphering throughput.",
      "goldenRuleFa": "نکته طلایی: قید Paradoxically برای توصیف پدیده‌هایی است که با عقل سلیم در تضادند اما رخ می‌دهند.",
      "scrambledChips": [
        { "id": "c1", "text": "Paradoxically," },
        { "id": "c2", "text": "added" },
        { "id": "c3", "text": "complexity" },
        { "id": "c4", "text": "rendered" },
        { "id": "c5", "text": "the" },
        { "id": "c6", "text": "cipher" },
        { "id": "c7", "text": "more" },
        { "id": "c8", "text": "vulnerable." },
        { "id": "d1", "text": "paradox", "isDistractor": True, "distractorReasonFa": "در آغاز جمله برای توصیف نحوه رخداد باید قید Paradoxically بیاید نه اسم paradox." }
      ],
      "correctSequence": ["Paradoxically,", "added", "complexity", "rendered", "the", "cipher", "more", "vulnerable."],
      "assembledSentence": "Paradoxically, added complexity rendered the cipher more vulnerable."
    },
    "round2": {
      "id": "w-c1-6-r2",
      "roundTitleFa": "ربط با Inasmuch as",
      "contextFa": "از آنجا که پروتکل‌های سنتی ناکارآمد گشته‌اند، بازنگری در کل مبانی الزامی است:",
      "sentenceA": "Fundamental assumptions must be dismantled",
      "sentenceB": "classical mechanics can no longer account for these anomalies.",
      "targetSlot": "Fundamental assumptions must be dismantled, [___] classical mechanics can no longer account for these anomalies.",
      "connectorOptions": [
        { "text": "inasmuch as", "isCorrect": True, "explanationFa": "inasmuch as یعنی «از آنجا که / از حیث اینکه» و بیانگر استدلال علمی سطح C1/C2 است." },
        { "text": "nevertheless", "isCorrect": False, "explanationFa": "تضادی وجود ندارد." },
        { "text": "on the contrary", "isCorrect": False, "explanationFa": "ارتباط علت و تبیین است." }
      ],
      "lexicalUpgrade": {
        "originalWord": "big change",
        "promptFa": "اصطلاح فلسفی-علمی برای دگرگونی بنیادین در پارادایم فکری انتخاب کن:",
        "upgrades": [
          { "text": "seismic paradigm shift", "isCorrect": True, "explanationFa": "seismic paradigm shift یعنی تحول شگرف و زلزله‌مانند در مبانی فکری." },
          { "text": "new style", "isCorrect": False, "explanationFa": "new style یعنی سبک جدید!" }
        ]
      }
    },
    "round3": {
      "id": "w-c1-6-r3",
      "roundTitleFa": "تایپ عبارت اصطلاحی تضاد فلسفی",
      "briefFa": "عبارت ۴ کلمه‌ای رسمی به معنی «با این همه / هر چه باشد» را تایپ کن:",
      "briefEn": "Type the formal idiom meaning nevertheless:",
      "templateSentence": "[___], the discovery opens uncharted technological horizons.",
      "targetBlank": "Be that as it may",
      "acceptableAnswers": ["Be that as it may", "That being said"],
      "typingHintFa": "عبارت کلاسیک Be that as it may (هر چه باشد).",
      "explanationFa": "Be that as it may یک ترانزیشن فاخر برای جمع‌بندی بر فراز تناقضات است.",
      "quickChips": ["Be that as it may", "As a result", "In other words"]
    }
  },
  {
    "levelNumber": 7,
    "cefr": "C1",
    "theme": "cyber-intel-dossier",
    "themeTitleFa": "اتاق ضداطلاعات و پروتکل سایبری",
    "caseCode": "DOSSIER-C1-07",
    "stageTitleEn": "Forensic Linguistic Profiling: Stylistic Elevation",
    "stageTitleFa": "گونه‌شناسی زبانی مجرم: ارتقای سبک با کالوکیشن‌های فاخر C1",
    "scenarioFa": "دست‌نوشته‌های هکر تحلیل شده است. تحلیل‌گر زبان‌شناسی قانونی باید متنی با دامنه واژگان غنی و ترکیب‌های نادر (rare collocations) جهت شناسایی خاستگاه نویسنده بنویسد.",
    "locationFa": "بخش رمزگشایی متون ناشناخته - اینترپل",
    "pillar": "academic-inversion",
    "xpReward": 210,
    "timeLimitSeconds": 100,
    "round1": {
      "id": "w-c1-7-r1",
      "roundTitleFa": "چیدمان پروفایل زبان‌شناختی",
      "promptFa": "کارت‌ها را بچین تا گزاره تحلیل نحوی ساختار متن هکر را تدوین کنی:",
      "promptEn": "Assemble the forensic linguistic evaluation sentence:",
      "hintFa": "The stylistic cadence strongly indicates an idiosyncratic non-native register.",
      "goldenRuleFa": "نکته طلایی: استفاده از اصطلاحات تخصصی سبک‌شناسی مانند stylistic cadence و idiosyncratic.",
      "scrambledChips": [
        { "id": "c1", "text": "The" },
        { "id": "c2", "text": "cadence" },
        { "id": "c3", "text": "reveals" },
        { "id": "c4", "text": "an" },
        { "id": "c5", "text": "idiosyncratic" },
        { "id": "c6", "text": "rhetorical" },
        { "id": "c7", "text": "footprint." },
        { "id": "d1", "text": "revealing", "isDistractor": True, "distractorReasonFa": "فعل اصلی جمله reveals باید صرف شده باشد نه ing دار." }
      ],
      "correctSequence": ["The", "cadence", "reveals", "an", "idiosyncratic", "rhetorical", "footprint."],
      "assembledSentence": "The cadence reveals an idiosyncratic rhetorical footprint."
    },
    "round2": {
      "id": "w-c1-7-r2",
      "roundTitleFa": "انطباق واژگانی با سرنخ‌ها",
      "contextFa": "کاربرد واژگان عهد عتیق نشانه بارز آموزش در مکاتب سنتی است علاوه بر این چینش حروف کاملاً یکدست است:",
      "sentenceA": "The text displays deliberate archaisms",
      "sentenceB": "orthographic irregularities mirror regional vernacular.",
      "targetSlot": "The text displays deliberate archaisms; [___], orthographic irregularities mirror regional vernacular.",
      "connectorOptions": [
        { "text": "furthermore", "isCorrect": True, "explanationFa": "furthermore بعد دوم اثبات هویت را بر روی پایه قبلی بنا می‌کند." },
        { "text": "on the contrary", "isCorrect": False, "explanationFa": "تضادی وجود ندارد." },
        { "text": "instead", "isCorrect": False, "explanationFa": "جایگزینی نیست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "bad mistake",
        "promptFa": "اصطلاح زبانی برای لغزش‌های زبانی ناخودآگاه انتخاب کن:",
        "upgrades": [
          { "text": "inadvertent linguistic slip", "isCorrect": True, "explanationFa": "inadvertent linguistic slip یعنی لغزش سهوی و ناخواسته کلامی که ریشه فرد را لو می‌دهد." },
          { "text": "dumb error", "isCorrect": False, "explanationFa": "dumb error غیررسمی است." }
        ]
      }
    },
    "round3": {
      "id": "w-c1-7-r3",
      "roundTitleFa": "تایپ کلمه کالوکیشن فاخر",
      "briefFa": "صفت به معنی «پیامدهای عمیق و بنیادین» (h-e-a-v-y) را در سطح C1 تایپ کن:",
      "briefEn": "Type the high-register adjective collocating with ramifications:",
      "templateSentence": "This discovery carries [___] ramifications for national defense.",
      "targetBlank": "profound",
      "acceptableAnswers": ["profound", "far-reaching"],
      "typingHintFa": "کلمه ۸ حرفی عمیق و بنیادین (p-r-o-f-o-u-n-d).",
      "explanationFa": "profound ramifications یک کالوکیشن فوق‌العاده استاندارد در مقالات آکادمیک و اسناد امنیتی است.",
      "quickChips": ["profound", "shallow", "small"]
    }
  },
  {
    "levelNumber": 8,
    "cefr": "C1",
    "theme": "cyber-intel-dossier",
    "themeTitleFa": "اتاق ضداطلاعات و پروتکل سایبری",
    "caseCode": "DOSSIER-C1-08",
    "stageTitleEn": "Multi-Source Intelligence: Synthesis & Cohesion",
    "stageTitleFa": "ترکیب اطلاعات چندگانه: سنتز منابع و پیوستگی پیشرفته متن",
    "scenarioFa": "سه گزارش متناقض از ماهواره‌ها، عوامل نفوذی و شنودهای رادیویی دریافت شده است. باید آن‌ها را در یک پاراگراف تحلیلی منسجم ترکیب و سنتز کنی.",
    "locationFa": "مرکز تحلیل تلفیقی اطلاعات (Fusion Center)",
    "pillar": "paragraph-register",
    "xpReward": 215,
    "timeLimitSeconds": 105,
    "round1": {
      "id": "w-c1-8-r1",
      "roundTitleFa": "چیدمان سنتز منابع سه‌گانه",
      "promptFa": "کارت‌ها را بچین تا گزاره تلفیقی حاصل از داده‌های ماهواره‌ای و میدانی را بسازی:",
      "promptEn": "Assemble the multi-source synthesized analytical sentence:",
      "hintFa": "Corroborating satellite imagery with human intelligence substantiates the hypothesis.",
      "goldenRuleFa": "نکته طلایی: فعل substantiates یعنی با شواهد کافی اعتبار بخشیدن و اثبات کردن.",
      "scrambledChips": [
        { "id": "c1", "text": "Synthesizing" },
        { "id": "c2", "text": "these" },
        { "id": "c3", "text": "disparate" },
        { "id": "c4", "text": "streams" },
        { "id": "c5", "text": "substantiates" },
        { "id": "c6", "text": "the" },
        { "id": "c7", "text": "primary" },
        { "id": "c8", "text": "hypothesis." },
        { "id": "d1", "text": "synthesized", "isDistractor": True, "distractorReasonFa": "در نقش فاعل جمله‌واره فعلی باید شکل اسم مصدر Synthesizing بیاید." }
      ],
      "correctSequence": ["Synthesizing", "these", "disparate", "streams", "substantiates", "the", "primary", "hypothesis."],
      "assembledSentence": "Synthesizing these disparate streams substantiates the primary hypothesis."
    },
    "round2": {
      "id": "w-c1-8-r2",
      "roundTitleFa": "حل تعارض داده‌ها",
      "contextFa": "داده‌های خام اولیه آشفته به نظر می‌رسیدند، اما بررسی با الگوریتم‌های هوش مصنوعی الگویی معنادار آشکار ساخت:",
      "sentenceA": "The initial telemetry presented superficial chaos",
      "sentenceB": "rigorous algorithmic distillation unmasked deliberate coordination.",
      "targetSlot": "The initial telemetry presented superficial chaos; [___], rigorous algorithmic distillation unmasked deliberate coordination.",
      "connectorOptions": [
        { "text": "closer inspection revealed that", "isCorrect": True, "explanationFa": "closer inspection revealed that عبارتی غنی برای نشان دادن عمق تحلیل و گذر از ظاهر داده‌هاست." },
        { "text": "because", "isCorrect": False, "explanationFa": "علت و معلول نیست." },
        { "text": "in summary", "isCorrect": False, "explanationFa": "جمع‌بندی نیست بلکه کشف الگوست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "different sources",
        "promptFa": "اصطلاح آکادمیک برای جریان‌های داده ناهمگن و گسسته انتخاب کن:",
        "upgrades": [
          { "text": "disparate and divergent intelligence streams", "isCorrect": True, "explanationFa": "disparate and divergent یعنی منابع ناهمگون و واگرا که سنتز شده‌اند." },
          { "text": "many books", "isCorrect": False, "explanationFa": "بی‌ربط است." }
        ]
      }
    },
    "round3": {
      "id": "w-c1-8-r3",
      "roundTitleFa": "تایپ فعل تایید صحت سنجی",
      "briefFa": "فعل به معنی «تایید و تصدیق با مدارک متقابل» (c-o-r-r-o-b-o-r-a-t-e) را تایپ کن:",
      "briefEn": "Type the academic verb meaning confirming with corroborating proof:",
      "templateSentence": "Independent intercepts [___] our preliminary conclusions.",
      "targetBlank": "corroborate",
      "acceptableAnswers": ["corroborate", "substantiate", "verify"],
      "typingHintFa": "فعل ۱۱ حرفی صحه‌گذاری و تایید (c-o-r-r-o-b-o-r-a-t-e).",
      "explanationFa": "corroborate یعنی تأیید و تقویت ادعا با شواهد مستقل دیگر.",
      "quickChips": ["corroborate", "deny", "doubt"]
    }
  },
  {
    "levelNumber": 9,
    "cefr": "C1",
    "theme": "cyber-intel-dossier",
    "themeTitleFa": "اتاق ضداطلاعات و پروتکل سایبری",
    "caseCode": "DOSSIER-C1-09",
    "stageTitleEn": "Crisis Strategic Directive: Executive Register",
    "stageTitleFa": "دستورالعمل استراتژیک بحران: نگارش در سطح مدیریت ارشد اجرایی",
    "scenarioFa": "در ساعات اولیه بحران سایبری، دستوری به تمام وزارتخانه‌ها ابلاغ می‌شود. متن باید حداکثر قاطعیت، بدون حشو و ابهام و با بالاترین استانداردهای انگلیسی اداری نوشته شود.",
    "locationFa": "پناهگاه زیرزمینی فرماندهی شرایط اضطراری",
    "pillar": "paragraph-register",
    "xpReward": 220,
    "timeLimitSeconds": 105,
    "round1": {
      "id": "w-c1-9-r1",
      "roundTitleFa": "چیدمان دستورالعمل الزام‌آور",
      "promptFa": "کارت‌ها را بچین تا گزاره دستوری الزام‌آور مدیریت بحران را تدوین کنی:",
      "promptEn": "Assemble the binding executive directive statement:",
      "hintFa": "All departments are hereby instructed to enforce air-gap protocols unconditionally.",
      "goldenRuleFa": "نکته طلایی: قید حقوقی-اداری hereby یعنی «بدین‌وسیله» و الزام حقوقی ایجاد می‌کند.",
      "scrambledChips": [
        { "id": "c1", "text": "Agencies" },
        { "id": "c2", "text": "are" },
        { "id": "c3", "text": "hereby" },
        { "id": "c4", "text": "directed" },
        { "id": "c5", "text": "to" },
        { "id": "c6", "text": "isolate" },
        { "id": "c7", "text": "all" },
        { "id": "c8", "text": "endpoints." },
        { "id": "d1", "text": "directing", "isDistractor": True, "distractorReasonFa": "در ساختار مجهول رسمی are hereby directed شکل مفعولی می‌آید نه فاعلی." }
      ],
      "correctSequence": ["Agencies", "are", "hereby", "directed", "to", "isolate", "all", "endpoints."],
      "assembledSentence": "Agencies are hereby directed to isolate all endpoints."
    },
    "round2": {
      "id": "w-c1-9-r2",
      "roundTitleFa": "عدم تساهل در برابر نقض دستور",
      "contextFa": "انطباق با این دستور مطلق است و هرگونه قصور عواقب پیگرد قانونی فوری خواهد داشت:",
      "sentenceA": "Compliance with this directive is mandatory across all jurisdictions",
      "sentenceB": "dereliction of duty shall invite immediate disciplinary proceedings.",
      "targetSlot": "Compliance with this directive is mandatory across all jurisdictions; [___], dereliction of duty shall invite immediate disciplinary proceedings.",
      "connectorOptions": [
        { "text": "any", "isCorrect": False, "explanationFa": "کلمه ربط نیست." },
        { "text": "furthermore", "isCorrect": True, "explanationFa": "furthermore بعد ضمانت اجرایی را به الزام اولیه وصل می‌کند." },
        { "text": "although", "isCorrect": False, "explanationFa": "تضادی وجود ندارد." }
      ],
      "lexicalUpgrade": {
        "originalWord": "bad work",
        "promptFa": "اصطلاح سنگین حقوقی برای اهمال و قصور در انجام وظیفه انتخاب کن:",
        "upgrades": [
          { "text": "gross dereliction of statutory duty", "isCorrect": True, "explanationFa": "gross dereliction of statutory duty یعنی قصور فاحش و خیانت در اجرای وظیفه قانونی." },
          { "text": "lazy behavior", "isCorrect": False, "explanationFa": "lazy behavior عامیانه است." }
        ]
      }
    },
    "round3": {
      "id": "w-c1-9-r3",
      "roundTitleFa": "تایپ قید تعهد نامشروط",
      "briefFa": "قید به معنی «بدون قید و شرط / بی‌چون‌وچرا» را تایپ کن:",
      "briefEn": "Type the formal adverb meaning without reservation or exceptions:",
      "templateSentence": "All directives must be executed [___].",
      "targetBlank": "unconditionally",
      "acceptableAnswers": ["unconditionally", "strictly"],
      "typingHintFa": "کلمه ۱۵ حرفی بی قید و شرط (u-n-c-o-n-d-i-t-i-o-n-a-l-l-y).",
      "explanationFa": "unconditionally یعنی به طور مطلق و بدون هیچ استثنایی.",
      "quickChips": ["unconditionally", "partly", "later"]
    }
  },
  {
    "levelNumber": 10,
    "cefr": "C1",
    "theme": "cyber-intel-dossier",
    "themeTitleFa": "اتاق ضداطلاعات و پروتکل سایبری",
    "caseCode": "DOSSIER-C1-10",
    "stageTitleEn": "Boss Case: Global Cyberwarfare White Paper",
    "stageTitleFa": "غول مرحله آخر: سند سفید اجلاس امنیت سایبری جهان",
    "scenarioFa": "سند راهبردی قرن در حال تدوین است! با ترکیب تمام هنر نویسندگی C1 (وارونگی، جملات تاکیدی، سنتز منابع و لحن فاخر)، سند سفید دفاع سایبری را تکمیل کن تا جام طلایی C1 را ببری و درهای سطح نهایی C2 گشوده شود!",
    "locationFa": "کاخ صلح لاهه - اجلاس عالی دفاع سایبری",
    "pillar": "master-investigation",
    "xpReward": 250,
    "timeLimitSeconds": 120,
    "isBossStage": True,
    "round1": {
      "id": "w-c1-10-r1",
      "roundTitleFa": "چیدمان بیانیه دکترین نهایی",
      "promptFa": "کارت‌های بیانیه استراتژیک سند سفید را مرتب کن:",
      "promptEn": "Assemble the master white paper doctrine declaration:",
      "hintFa": "Only through unified multilateral consensus can planetary cyberspace be safeguarded.",
      "goldenRuleFa": "نکته طلایی: ساختار وارونگی با Only through: Only through [X] can [Y] be achieved.",
      "scrambledChips": [
        { "id": "c1", "text": "Only" },
        { "id": "c2", "text": "through" },
        { "id": "c3", "text": "multilateral" },
        { "id": "c4", "text": "cooperation" },
        { "id": "c5", "text": "can" },
        { "id": "c6", "text": "digital" },
        { "id": "c7", "text": "sovereignty" },
        { "id": "c8", "text": "prevail." },
        { "id": "d1", "text": "digital sovereignty can", "isDistractor": True, "distractorReasonFa": "در ساختار وارونگی بعد از Only through باید فعل کمکی can جلوتر از فاعل digital sovereignty بیاید!" }
      ],
      "correctSequence": ["Only", "through", "multilateral", "cooperation", "can", "digital", "sovereignty", "prevail."],
      "assembledSentence": "Only through multilateral cooperation can digital sovereignty prevail."
    },
    "round2": {
      "id": "w-c1-10-r2",
      "roundTitleFa": "فرجام استراتژیک سند",
      "contextFa": "هزینه انفعال نابودی تمدن دیجیتال است؛ بنابراین، همگرایی بین‌المللی یک اضطرار حیاتی است:",
      "sentenceA": "The cost of inertia would prove catastrophic for future generations",
      "sentenceB": "immediate collective resolve constitutes an existential imperative.",
      "targetSlot": "The cost of inertia would prove catastrophic for future generations; [___], immediate collective resolve constitutes an existential imperative.",
      "connectorOptions": [
        { "text": "consequently", "isCorrect": True, "explanationFa": "consequently برهان قاطع و جمع‌بندی بیانیه جهانی را رقم می‌زند." },
        { "text": "on the other hand", "isCorrect": False, "explanationFa": "دیدگاه متضاد نیست بلکه الزام نهایی است." },
        { "text": "for example", "isCorrect": False, "explanationFa": "مثال جزئی نیست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "must do it",
        "promptFa": "اصطلاح فلسفی-سیاسی عالی برای امر حیاتی و غیرقابل اجتناب انتخاب کن:",
        "upgrades": [
          { "text": "categorical and existential imperative", "isCorrect": True, "explanationFa": "categorical and existential imperative یعنی امر مطلق و ضرورت تام وجودی." },
          { "text": "urgent chore", "isCorrect": False, "explanationFa": "chore یعنی کار خسته‌کننده منزل!" }
        ]
      }
    },
    "round3": {
      "id": "w-c1-10-r3",
      "roundTitleFa": "تایپ واژه جاودانه توافق جهانی",
      "briefFa": "کلمه به معنی «وفاق و اجماع جامع‌الاطراف بین‌المللی» را تایپ کن:",
      "briefEn": "Type the formal noun meaning broad multilateral agreement:",
      "templateSentence": "The nations reached an unprecedented [___].",
      "targetBlank": "consensus",
      "acceptableAnswers": ["consensus", "accord", "treaty"],
      "typingHintFa": "کلمه ۹ حرفی اجماع و وفاق (c-o-n-s-e-n-s-u-s).",
      "explanationFa": "an unprecedented consensus یعنی اجماعی بی‌سابقه و تاریخی بین تمام کشورها.",
      "quickChips": ["consensus", "clash", "rift"]
    }
  }
]

# We will populate C2_CASES
C2_CASES = [
  {
    "levelNumber": 1,
    "cefr": "C2",
    "theme": "cyber-intel-dossier",
    "themeTitleFa": "اتاق ضداطلاعات و پروتکل سایبری",
    "caseCode": "DOSSIER-C2-01",
    "stageTitleEn": "Subversive Manuscripts: Rhetorical Parallelism & Chiasmus",
    "stageTitleFa": "دست‌نوشته‌های زیرزمینی: موازنه بلاغی و ساختار کلاسیستی کیاسموس",
    "scenarioFa": "سندی باستانی بازنویسی شده که موازنه بلاغی شگفت‌انگیزی دارد: «نه با هیاهو پیروز شدند، بلکه با سکوت استیلا یافتند». قدرت قلم در اوج فصاحت.",
    "locationFa": "کتابخانه ممنوعه اسناد فلسفی کهن",
    "pillar": "academic-inversion",
    "xpReward": 250,
    "timeLimitSeconds": 100,
    "round1": {
      "id": "w-c2-1-r1",
      "roundTitleFa": "چیدمان تقارن کلاسیستی بلاغی",
      "promptFa": "کارت‌ها را بچین تا گزاره متقارن بلاغی (Parallelism) را تدوین کنی:",
      "promptEn": "Assemble the high-register classical rhetorical parallelism sentence:",
      "hintFa": "Not by coercion did they persuade, but by exemplary conduct did they inspire.",
      "goldenRuleFa": "نکته طلایی: ساختار کیاسموس و تقارن نحوی دوگانه: Not by [A] did they [V], but by [B] did they [V].",
      "scrambledChips": [
        { "id": "c1", "text": "Not" },
        { "id": "c2", "text": "by" },
        { "id": "c3", "text": "force" },
        { "id": "c4", "text": "did" },
        { "id": "c5", "text": "they" },
        { "id": "c6", "text": "conquer," },
        { "id": "c7", "text": "but" },
        { "id": "c8", "text": "by" },
        { "id": "c9", "text": "reason." },
        { "id": "d1", "text": "they conquered by", "isDistractor": True, "distractorReasonFa": "در تقارن بلاغی عالی C2 بعد از Not by force باید did they conquer بیاید نه فاعل مستقیم." }
      ],
      "correctSequence": ["Not", "by", "force", "did", "they", "conquer,", "but", "by", "reason."],
      "assembledSentence": "Not by force did they conquer, but by reason."
    },
    "round2": {
      "id": "w-c2-1-r2",
      "roundTitleFa": "پیوند فصاحت و عمق معنا",
      "contextFa": "زبان سلاحی برّان‌تر از شمشیر است و قلم سرنوشت امپراتوری‌ها را رقم می‌زند:",
      "sentenceA": "The sovereign wielded absolute military might",
      "sentenceB": "it was the subtlety of the scribe's quill that dictated historical perpetuity.",
      "targetSlot": "The sovereign wielded absolute military might; [___], it was the subtlety of the scribe's quill that dictated historical perpetuity.",
      "connectorOptions": [
        { "text": "yet, in the final calculus", "isCorrect": True, "explanationFa": "yet, in the final calculus یعنی «با این همه، در فرجامین سنجش و داوری تاریخ» که تجلی کمال رایتینگ است." },
        { "text": "because of this", "isCorrect": False, "explanationFa": "علت و معلول نیست." },
        { "text": "similarly", "isCorrect": False, "explanationFa": "تشابه نیست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "good writing",
        "promptFa": "اصطلاح ادبی در اوج کمال برای بلاغت سحرانگیز انتخاب کن:",
        "upgrades": [
          { "text": "consummate stylistic transcendence", "isCorrect": True, "explanationFa": "consummate stylistic transcendence یعنی اوج تعالی، پختگی و درخشش سبکی." },
          { "text": "pretty letters", "isCorrect": False, "explanationFa": "کودکانه است!" }
        ]
      }
    },
    "round3": {
      "id": "w-c2-1-r3",
      "roundTitleFa": "تایپ واژه بلاغی کیاسموس",
      "briefFa": "کلمه به معنی «فصاحت و سخنوری بی‌همتا» را تایپ کن:",
      "briefEn": "Type the noun meaning transcendent expressive fluency:",
      "templateSentence": "His defense echoed with majestic [___].",
      "targetBlank": "eloquence",
      "acceptableAnswers": ["eloquence", "rhetoric"],
      "typingHintFa": "کلمه ۹ حرفی فصاحت و بلاغت (e-l-o-q-u-e-n-c-e).",
      "explanationFa": "majestic eloquence یعنی فصاحت باصلابت و باشکوه کلامی.",
      "quickChips": ["eloquence", "noise", "haste"]
    }
  },
  {
    "levelNumber": 2,
    "cefr": "C2",
    "theme": "cyber-intel-dossier",
    "themeTitleFa": "اتاق ضداطلاعات و پروتکل سایبری",
    "caseCode": "DOSSIER-C2-02",
    "stageTitleEn": "The Declassified Treaty: Deconstructing Ambiguity",
    "stageTitleFa": "معاهده رمزگشایی‌شده: رفع ابهام‌های نحوی در متون حقوقی فوق‌حرفه‌ای",
    "scenarioFa": "بندی از یک معاهده تسلیحاتی عمداً با ابهام نحوی دوپهلو نوشته شده تا راه فرار باز بماند. باید با بازنویسی دقیق، هرگونه گریزگاه نحوی را مسدود کنی.",
    "locationFa": "دفتر دبیرکل سازمان ملل متحد",
    "pillar": "academic-inversion",
    "xpReward": 255,
    "timeLimitSeconds": 100,
    "round1": {
      "id": "w-c2-2-r1",
      "roundTitleFa": "چیدمان بند حقوقی ضدابهام",
      "promptFa": "کارت‌ها را بچین تا ماده قانونی بی‌نقص و عاری از هرگونه رخنه تفسیری بسازی:",
      "promptEn": "Assemble the unequivocally watertight legal covenant clause:",
      "hintFa": "Under no circumstances shall any signatory engage in covert enrichment.",
      "goldenRuleFa": "نکته طلایی: ساختار وارونگی بازدارنده مطلق: Under no circumstances shall [X] engage in [Y].",
      "scrambledChips": [
        { "id": "c1", "text": "Under" },
        { "id": "c2", "text": "no" },
        { "id": "c3", "text": "circumstances" },
        { "id": "c4", "text": "shall" },
        { "id": "c5", "text": "any" },
        { "id": "c6", "text": "state" },
        { "id": "c7", "text": "breach" },
        { "id": "c8", "text": "this." },
        { "id": "d1", "text": "any state shall", "isDistractor": True, "distractorReasonFa": "بعد از عبارت بازدارنده منفی Under no circumstances فعل کمکی shall حتماً قبل از فاعل می‌آید." }
      ],
      "correctSequence": ["Under", "no", "circumstances", "shall", "any", "state", "breach", "this."],
      "assembledSentence": "Under no circumstances shall any state breach this."
    },
    "round2": {
      "id": "w-c2-2-r2",
      "roundTitleFa": "حذف گریزگاه با عبارت تکمیلی",
      "contextFa": "هیچ تفسیر جایگزینی مسموع نیست، چه در زمان صلح و چه در زمان مناقشه:",
      "sentenceA": "The text admits of no divergent construction",
      "sentenceB": "all putative loopholes stand irrevocably extinguished.",
      "targetSlot": "The text admits of no divergent construction; [___], all putative loopholes stand irrevocably extinguished.",
      "connectorOptions": [
        { "text": "in consequence whereof", "isCorrect": True, "explanationFa": "in consequence whereof عبارتی به غایت رسمی و فاخر در معاهدات بین‌المللی است." },
        { "text": "so", "isCorrect": False, "explanationFa": "خیلی سطحی است." },
        { "text": "however", "isCorrect": False, "explanationFa": "تضادی نیست بلکه تاکید تکمیلی است." }
      ],
      "lexicalUpgrade": {
        "originalWord": "cannot change it",
        "promptFa": "اصطلاح فقهی-حقوقی بین‌المللی برای تعهد خدشه‌ناپذیر و قطعی انتخاب کن:",
        "upgrades": [
          { "text": "immutable and non-derogable obligation", "isCorrect": True, "explanationFa": "immutable and non-derogable یعنی تعهد تغییرناپذیر و تخفیف‌ناپذیر." },
          { "text": "hard rule", "isCorrect": False, "explanationFa": "hard rule زبان محاوره است." }
        ]
      }
    },
    "round3": {
      "id": "w-c2-2-r3",
      "roundTitleFa": "تایپ صفت حقوقی غیرقابل نقض",
      "briefFa": "صفت به معنی «مطلقاً نفوذناپذیر و بدون رخنه قانونی» را تایپ کن:",
      "briefEn": "Type the formal adjective meaning perfectly constructed leaving no opening:",
      "templateSentence": "The treaty provides a completely [___] framework.",
      "targetBlank": "watertight",
      "acceptableAnswers": ["watertight", "invulnerable", "indisputable"],
      "typingHintFa": "کلمه ۱۰ حرفی غیرقابل رخنه (w-a-t-e-r-t-i-g-h-t).",
      "explanationFa": "a watertight framework یعنی چارچوبی کاملاً نفوذناپذیر بدون هیچ راه فرار قانونی.",
      "quickChips": ["watertight", "porous", "loose"]
    }
  },
  {
    "levelNumber": 3,
    "cefr": "C2",
    "theme": "cyber-intel-dossier",
    "themeTitleFa": "اتاق ضداطلاعات و پروتکل سایبری",
    "caseCode": "DOSSIER-C2-03",
    "stageTitleEn": "Cryptographic Axioms: Epistemic Density",
    "stageTitleFa": "اصول بنیادین رمزنگاری: تراکم معرفتی و فشرده‌سازی انتزاعی مفاهیم",
    "scenarioFa": "طراحی پروتکل اثبات دانایی صفر (Zero-Knowledge) نیازمند گزاره‌هایی با تراکم مفهومی خارق‌العاده است. نگارش به بالاترین غنای معرفت‌شناسی دست می‌یابد.",
    "locationFa": "موسسه مطالعات پیشرفته پرینستون",
    "pillar": "academic-inversion",
    "xpReward": 260,
    "timeLimitSeconds": 105,
    "round1": {
      "id": "w-c2-3-r1",
      "roundTitleFa": "چیدمان اصل موضوعه ریاضی",
      "promptFa": "کارت‌ها را بچین تا گزاره فلسفی-ریاضی راجع به قطعیت رمزنگاری را تدوین کنی:",
      "promptEn": "Assemble the epistemically dense mathematical axiom sentence:",
      "hintFa": "To verify veracity without disclosing substance constitutes the foundational premise.",
      "goldenRuleFa": "نکته طلایی: مصدر فاعلی To verify veracity without disclosing substance در ابتدای جمله.",
      "scrambledChips": [
        { "id": "c1", "text": "Verifying" },
        { "id": "c2", "text": "truth" },
        { "id": "c3", "text": "without" },
        { "id": "c4", "text": "revealing" },
        { "id": "c5", "text": "content" },
        { "id": "c6", "text": "anchors" },
        { "id": "c7", "text": "the" },
        { "id": "c8", "text": "system." },
        { "id": "d1", "text": "verify", "isDistractor": True, "distractorReasonFa": "در جایگاه فاعل باید شکل اسم مصدر Verifying باشد." }
      ],
      "correctSequence": ["Verifying", "truth", "without", "revealing", "content", "anchors", "the", "system."],
      "assembledSentence": "Verifying truth without revealing content anchors the system."
    },
    "round2": {
      "id": "w-c2-3-r2",
      "roundTitleFa": "پیوند انتزاعی معرفت‌شناختی",
      "contextFa": "محاسبات سنتی به بازنمایی فیزیکی وابسته بودند در حالی که رمزنگاری نوین بر پایه‌های احتمالاتی محض استوار است:",
      "sentenceA": "Pre-quantum paradigms presumed deterministic observation",
      "sentenceB": "post-quantum cryptography predicates security upon irreducible complexity.",
      "targetSlot": "Pre-quantum paradigms presumed deterministic observation, [___] post-quantum cryptography predicates security upon irreducible complexity.",
      "connectorOptions": [
        { "text": "whilst", "isCorrect": True, "explanationFa": "whilst فرم سنتی و بسیار فاخرتر while برای تقابل آکادمیک در رده C2 است." },
        { "text": "because", "isCorrect": False, "explanationFa": "علت و معلول نیست." },
        { "text": "unless", "isCorrect": False, "explanationFa": "شرط منفی نیست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "hard math",
        "promptFa": "اصطلاح آکادمیک برای پیچیدگی غیرقابل تقلیل ریاضی انتخاب کن:",
        "upgrades": [
          { "text": "irreducible computational intractability", "isCorrect": True, "explanationFa": "اصطلاحی در اوج ادبیات علوم کامپیوتر نظری برای سختی حل‌ناپذیر محاسباتی." },
          { "text": "difficult sums", "isCorrect": False, "explanationFa": "زبان ابتدایی دبستان است!" }
        ]
      }
    },
    "round3": {
      "id": "w-c2-3-r3",
      "roundTitleFa": "تایپ واژه معرفت‌شناختی",
      "briefFa": "صفت به معنی «معرفت‌شناختی و ناظر به ذات شناخت» را تایپ کن:",
      "briefEn": "Type the philosophical adjective relating to the theory of knowledge:",
      "templateSentence": "This discovery transforms our [___] horizons.",
      "targetBlank": "epistemic",
      "acceptableAnswers": ["epistemic", "epistemological"],
      "typingHintFa": "کلمه ۹ حرفی آپیستمیک (e-p-i-s-t-e-m-i-c).",
      "explanationFa": "epistemic horizons یعنی افق‌های شناخت و معرفت انسانی.",
      "quickChips": ["epistemic", "optical", "simple"]
    }
  },
  {
    "levelNumber": 4,
    "cefr": "C2",
    "theme": "cyber-intel-dossier",
    "themeTitleFa": "اتاق ضداطلاعات و پروتکل سایبری",
    "caseCode": "DOSSIER-C2-04",
    "stageTitleEn": "International Tribunal Brief: Forensic Jurisprudence",
    "stageTitleFa": "دیوان بین‌المللی کیفری: فقه قضایی و اقامه دعوای فوق‌سنگین",
    "scenarioFa": "پرونده جنایت جنگی سایبری علیه زیرساخت‌های غیرنظامی در حال محاکمه است. دادستان ارشد باید متنی با بلاغت رومی و انسجام منطقی مطلق ارائه دهد.",
    "locationFa": "دیوان بین‌المللی دادگستری - لاهه",
    "pillar": "academic-inversion",
    "xpReward": 265,
    "timeLimitSeconds": 110,
    "round1": {
      "id": "w-c2-4-r1",
      "roundTitleFa": "چیدمان برهان قاطع قضایی",
      "promptFa": "کارت‌ها را بچین تا گزاره قضایی دال بر عمدی بودن حمله به شبکه بیمارستان‌ها را تدوین کنی:",
      "promptEn": "Assemble the high-jurisprudence prosecutorial indictment sentence:",
      "hintFa": "The systemic devastation of civic networks constitutes prima facie evidence of criminal intent.",
      "goldenRuleFa": "نکته طلایی: اصطلاح لاتین حقوقی prima facie یعنی «در بادی امر و به ظاهر مستدل و قوی».",
      "scrambledChips": [
        { "id": "c1", "text": "The" },
        { "id": "c2", "text": "destruction" },
        { "id": "c3", "text": "constitutes" },
        { "id": "c4", "text": "prima" },
        { "id": "c5", "text": "facie" },
        { "id": "c6", "text": "proof" },
        { "id": "c7", "text": "of" },
        { "id": "c8", "text": "intent." },
        { "id": "d1", "text": "constituting", "isDistractor": True, "distractorReasonFa": "در نقش فعل اصلی جمله باید constitutes باشد." }
      ],
      "correctSequence": ["The", "destruction", "constitutes", "prima", "facie", "proof", "of", "intent."],
      "assembledSentence": "The destruction constitutes prima facie proof of intent."
    },
    "round2": {
      "id": "w-c2-4-r2",
      "roundTitleFa": "ابطال دفاعیه مصونیت دولتی",
      "contextFa": "متهم به مصونیت حاکمیتی استناد می‌کند، در حالی که جنایات بین‌المللی مشمول هیچ‌گونه مصونیتی نمی‌شوند:",
      "sentenceA": "The respondent invokes sovereign immunity",
      "sentenceB": "peremptory norms of international law admit of no such derogation.",
      "targetSlot": "The respondent invokes sovereign immunity; [___], peremptory norms of international law admit of no such derogation.",
      "connectorOptions": [
        { "text": "be that as it may, however", "isCorrect": False, "explanationFa": "حشو زبانی است." },
        { "text": "yet, by virtue of jus cogens", "isCorrect": True, "explanationFa": "yet, by virtue of jus cogens یعنی «با این حال، به حکم قواعد آمره بین‌المللی» که نهایت غنای حقوقی C2 است." },
        { "text": "because", "isCorrect": False, "explanationFa": "خیلی سطحی است." }
      ],
      "lexicalUpgrade": {
        "originalWord": "bad crime",
        "promptFa": "اصطلاح لاتین-حقوقی برای جنایات وجدان‌ستیز بشری انتخاب کن:",
        "upgrades": [
          { "text": "heinous transgressions offending the conscience of humanity", "isCorrect": True, "explanationFa": "عبارتی کلاسیک در ادبیات احکام نورنبرگ و لاهه." },
          { "text": "illegal behavior", "isCorrect": False, "explanationFa": "زبان اداری معمولی است." }
        ]
      }
    },
    "round3": {
      "id": "w-c2-4-r3",
      "roundTitleFa": "تایپ اصطلاح حقوقی قواعد آمره",
      "briefFa": "اصطلاح حقوقی دو کلمه‌ای لاتین به معنی «قاعده آمره غیرقابل تخطی» (j-u-s  c-o-g-e-n-s) را تایپ کن:",
      "briefEn": "Type the Latin legal term for peremptory international norms:",
      "templateSentence": "This prohibition belongs to the sphere of [___].",
      "targetBlank": "jus cogens",
      "acceptableAnswers": ["jus cogens"],
      "typingHintFa": "ترکیب دو کلمه‌ای ژوس کوژنس (j-u-s  c-o-g-e-n-s).",
      "explanationFa": "jus cogens یعنی قواعد بنیادین حقوق بین‌الملل که هیچ معاهده‌ای نمی‌تواند برخلاف آن باشد.",
      "quickChips": ["jus cogens", "ad hoc", "de facto"]
    }
  },
  {
    "levelNumber": 5,
    "cefr": "C2",
    "theme": "cyber-intel-dossier",
    "themeTitleFa": "اتاق ضداطلاعات و پروتکل سایبری",
    "caseCode": "DOSSIER-C2-05",
    "stageTitleEn": "Sovereign Crisis Response: Masterful Ambiguity",
    "stageTitleFa": "پاسخ به بحران حاکمیتی: ابهام استراتژیک در دیپلماسی هسته‌ای و بازدارندگی",
    "scenarioFa": "در شرایط بحران اتمی یا زیرساختی، نباید دست خود را به طور کامل رو کرد. متنی حاوی ابهام استراتژیک هوشمندانه (Strategic Ambiguity) بنویس که حریف را در بهت نگه‌دارد.",
    "locationFa": "شورای روابط خارجی - اتاق وضعیت اضطراری",
    "pillar": "academic-inversion",
    "xpReward": 270,
    "timeLimitSeconds": 110,
    "round1": {
      "id": "w-c2-5-r1",
      "roundTitleFa": "چیدمان بازدارندگی استراتژیک",
      "promptFa": "کارت‌ها را بچین تا موضع ابهام استراتژیک کشور را بدون ورود به جزئیات تثبیت کنی:",
      "promptEn": "Assemble the strategic deterrence ambiguity statement:",
      "hintFa": "We reserve the prerogative to respond at a time and domain of our choosing.",
      "goldenRuleFa": "نکته طلایی: اصطلاح کلاسیک بازدارندگی: reserve the prerogative to respond at a time and manner of our choosing.",
      "scrambledChips": [
        { "id": "c1", "text": "We" },
        { "id": "c2", "text": "reserve" },
        { "id": "c3", "text": "the" },
        { "id": "c4", "text": "prerogative" },
        { "id": "c5", "text": "to" },
        { "id": "c6", "text": "respond" },
        { "id": "c7", "text": "proportionately." },
        { "id": "d1", "text": "reserving", "isDistractor": True, "distractorReasonFa": "فعل اصلی We reserve باید ساده باشد." }
      ],
      "correctSequence": ["We", "reserve", "the", "prerogative", "to", "respond", "proportionately."],
      "assembledSentence": "We reserve the prerogative to respond proportionately."
    },
    "round2": {
      "id": "w-c2-5-r2",
      "roundTitleFa": "موازنه هشدار و امید",
      "contextFa": "شکیبایی ما نباید به عنوان ضعف تعبیر شود، گرچه راه‌های مسالمت‌آمیز هنوز مسدود نیستند:",
      "sentenceA": "Strategic restraint must not be conflated with vacillation",
      "sentenceB": "diplomatic avenues remain ostensibly unexhausted.",
      "targetSlot": "Strategic restraint must not be conflated with vacillation; [___], diplomatic avenues remain ostensibly unexhausted.",
      "connectorOptions": [
        { "text": "nevertheless, for the present juncture", "isCorrect": True, "explanationFa": "ترکیبی استادانه برای ایجاد پنجره مذاکره همراه با حفظ خط قرمز." },
        { "text": "because", "isCorrect": False, "explanationFa": "علت و معلول نیست." },
        { "text": "in summary", "isCorrect": False, "explanationFa": "جمع‌بندی نیست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "we have rights",
        "promptFa": "اصطلاح حاکمیتی برای حق ذاتی و انحصاری پاسخ دفاعی انتخاب کن:",
        "upgrades": [
          { "text": "inalienable sovereign prerogative", "isCorrect": True, "explanationFa": "inalienable sovereign prerogative یعنی حق ویژه و سلب‌ناپذیر حاکمیت ملی." },
          { "text": "normal permission", "isCorrect": False, "explanationFa": "normal permission برای حاکمیت ملی بی‌معنی است." }
        ]
      }
    },
    "round3": {
      "id": "w-c2-5-r3",
      "roundTitleFa": "تایپ واژه حق ویژه حاکمیتی",
      "briefFa": "کلمه به معنی «حق انحصاری و امتیاز ویژه حاکمیتی» را تایپ کن:",
      "briefEn": "Type the formal noun meaning an exclusive sovereign right:",
      "templateSentence": "It remains the sole [___] of the presidency.",
      "targetBlank": "prerogative",
      "acceptableAnswers": ["prerogative", "privilege"],
      "typingHintFa": "کلمه ۱۱ حرفی حق ویژه (p-r-e-r-o-g-a-t-i-v-e).",
      "explanationFa": "prerogative یعنی اختیارات ویژه انحصاری یک نهاد حاکمیتی.",
      "quickChips": ["prerogative", "hobby", "habit"]
    }
  },
  {
    "levelNumber": 6,
    "cefr": "C2",
    "theme": "cyber-intel-dossier",
    "themeTitleFa": "اتاق ضداطلاعات و پروتکل سایبری",
    "caseCode": "DOSSIER-C2-06",
    "stageTitleEn": "The Epistemological Paradox: Philosophy of Mind",
    "stageTitleFa": "پارادوکس معرفت‌شناختی: فلسفه ذهن، آگاهی ماشین و هوش مستقل",
    "scenarioFa": "آیا هوش مصنوعی به خودآگاهی (Sentience) دست یافته است یا صرفاً بازی زبانی را تکرار می‌کند؟ مقاله‌ای فلسفی با عمق اندیشه شوپنهاور و ویتگنشتاین بنگار.",
    "locationFa": "دانشکده فلسفه تحلیلی آکسفورد",
    "pillar": "academic-inversion",
    "xpReward": 275,
    "timeLimitSeconds": 110,
    "round1": {
      "id": "w-c2-6-r1",
      "roundTitleFa": "چیدمان استدلال اتاق چینی",
      "promptFa": "کارت‌ها را بچین تا گزاره فلسفی تمایز نحو از معنا در هوش مصنوعی را بسازی:",
      "promptEn": "Assemble the philosophical philosophy-of-mind thesis sentence:",
      "hintFa": "Syntax alone does not suffice to engender genuine semantic comprehension.",
      "goldenRuleFa": "نکته طلایی: تمایز فلسفی بنیادین جان سرل: Syntax does not suffice for semantics.",
      "scrambledChips": [
        { "id": "c1", "text": "Syntactic" },
        { "id": "c2", "text": "manipulation" },
        { "id": "c3", "text": "does" },
        { "id": "c4", "text": "not" },
        { "id": "c5", "text": "beget" },
        { "id": "c6", "text": "subjective" },
        { "id": "c7", "text": "conscious" },
        { "id": "c8", "text": "experience." },
        { "id": "d1", "text": "begetting", "isDistractor": True, "distractorReasonFa": "بعد از does not فعل ساده beget می‌آید." }
      ],
      "correctSequence": ["Syntactic", "manipulation", "does", "not", "beget", "subjective", "conscious", "experience."],
      "assembledSentence": "Syntactic manipulation does not beget subjective conscious experience."
    },
    "round2": {
      "id": "w-c2-6-r2",
      "roundTitleFa": "تقابل ماتریالیسم و پدیدارشناسی",
      "contextFa": "محاسبات نورونی پیچیده هستند با این وجود ماهیت کیفی تجربیات درونی (Qualia) در فرمول‌های فیزیکی نمی‌گنجد:",
      "sentenceA": "Neural architectures achieve astonishing computational mimicry",
      "sentenceB": "the qualitative essence of qualia eludes algorithmic reduction.",
      "targetSlot": "Neural architectures achieve astonishing computational mimicry; [___], the qualitative essence of qualia eludes algorithmic reduction.",
      "connectorOptions": [
        { "text": "pari passu with which", "isCorrect": False, "explanationFa": "معنای هم‌گامی دارد نه تضاد مفهومی." },
        { "text": "notwithstanding, however, the phenomenological reality that", "isCorrect": True, "explanationFa": "اوج شکوه نثر فلسفی آکادمیک برای تفکیک شبیه‌سازی از آگاهی اصیل." },
        { "text": "so", "isCorrect": False, "explanationFa": "بسیار مبتدی است." }
      ],
      "lexicalUpgrade": {
        "originalWord": "thinking machine",
        "promptFa": "اصطلاح فلسفی دقیق برای موجود دارای آگاهی و شعور درونی انتخاب کن:",
        "upgrades": [
          { "text": "sentient entity endowed with introspective awareness", "isCorrect": True, "explanationFa": "sentient entity endowed with introspective awareness یعنی موجود دارای آگاهی و ادراک درون‌نگرانه." },
          { "text": "smart robot", "isCorrect": False, "explanationFa": "smart robot واژه‌ای دم‌دستی است." }
        ]
      }
    },
    "round3": {
      "id": "w-c2-6-r3",
      "roundTitleFa": "تایپ اصطلاح فلسفی کیفیت تجربه حسی",
      "briefFa": "اصطلاح لاتین فلسفه ذهن برای کیفیت حالات درونی حسی (q-u-a-l-i-a) را تایپ کن:",
      "briefEn": "Type the philosophical term for subjective qualitative conscious experiences:",
      "templateSentence": "No computer code can simulate the enigma of [___].",
      "targetBlank": "qualia",
      "acceptableAnswers": ["qualia"],
      "typingHintFa": "کلمه ۶ حرفی کوالیا (q-u-a-l-i-a).",
      "explanationFa": "qualia در فلسفه ذهن یعنی چگونگی احساسِ درونی پدیده‌ها (مثل قرمزی رنگ قرمز).",
      "quickChips": ["qualia", "matter", "code"]
    }
  },
  {
    "levelNumber": 7,
    "cefr": "C2",
    "theme": "cyber-intel-dossier",
    "themeTitleFa": "اتاق ضداطلاعات و پروتکل سایبری",
    "caseCode": "DOSSIER-C2-07",
    "stageTitleEn": "Statecraft & Geopolitical Foresight",
    "stageTitleFa": "حکمرانی و آینده‌پژوهی ژئوپلیتیک: نگارش مقالات کلان راهبردی",
    "scenarioFa": "سیاست‌پژوهان بین‌المللی چشم‌انداز قرن ۲۲ را تدوین می‌کنند. لحن مقاله باید هم‌تراز سرمقاله‌های فاخر Foreign Affairs و مجلات معتبر علوم سیاسی باشد.",
    "locationFa": "موسسه سلطنتی امور بین‌الملل (Chatham House)",
    "pillar": "academic-inversion",
    "xpReward": 280,
    "timeLimitSeconds": 115,
    "round1": {
      "id": "w-c2-7-r1",
      "roundTitleFa": "چیدمان برهان گذار قدرت جهانی",
      "promptFa": "کارت‌ها را بچین تا گزاره ژئوپلیتیک گذار هژمونی را تدوین کنی:",
      "promptEn": "Assemble the high-statecraft geopolitical transition sentence:",
      "hintFa": "The inexorable redistribution of computational supremacy portends systemic reordering.",
      "goldenRuleFa": "نکته طلایی: The inexorable redistribution of power portends systemic geopolitical reordering.",
      "scrambledChips": [
        { "id": "c1", "text": "The" },
        { "id": "c2", "text": "diffusion" },
        { "id": "c3", "text": "of" },
        { "id": "c4", "text": "technology" },
        { "id": "c5", "text": "portends" },
        { "id": "c6", "text": "a" },
        { "id": "c7", "text": "multipolar" },
        { "id": "c8", "text": "order." },
        { "id": "d1", "text": "portending", "isDistractor": True, "distractorReasonFa": "در جایگاه فعل اصلی باید portends بیاید." }
      ],
      "correctSequence": ["The", "diffusion", "of", "technology", "portends", "a", "multipolar", "order."],
      "assembledSentence": "The diffusion of technology portends a multipolar order."
    },
    "round2": {
      "id": "w-c2-7-r2",
      "roundTitleFa": "تحلیل تعادل شکننده قوا",
      "contextFa": "هژمونی سنتی رو به افول است هم‌زمان با اینکه بازیگران جدید از پذیرش قواعد قدیمی سرباز می‌زنند:",
      "sentenceA": "Traditional hegemonic architecture experiences progressive exhaustion",
      "sentenceB": "emerging sovereigns contest the legitimacy of established norms.",
      "targetSlot": "Traditional hegemonic architecture experiences progressive exhaustion, [___] emerging sovereigns contest the legitimacy of established norms.",
      "connectorOptions": [
        { "text": "even as", "isCorrect": True, "explanationFa": "even as یعنی درست در همان زمانی که... و برای تقارن روندهای تاریخی ژئوپلیتیک بی‌نظیر است." },
        { "text": "because of which", "isCorrect": False, "explanationFa": "رابطه مستقیم سببی صرف نیست." },
        { "text": "instead", "isCorrect": False, "explanationFa": "جایگزینی نیست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "big changes",
        "promptFa": "اصطلاح آکادمیک برای دگرگونی بنیادین و ناگهانی در ساختار نظم بین‌الملل انتخاب کن:",
        "upgrades": [
          { "text": "tectonic realignment of the international system", "isCorrect": True, "explanationFa": "tectonic realignment یعنی بازآرایی زلزله‌مانند و عمیق صفحات قدرت بین‌المللی." },
          { "text": "shifts and stuff", "isCorrect": False, "explanationFa": "stuff عامیانه و سخیف است!" }
        ]
      }
    },
    "round3": {
      "id": "w-c2-7-r3",
      "roundTitleFa": "تایپ فعل پیش‌آگاهی تاریخی",
      "briefFa": "فعل ادبی به معنی «نوید دادن یا خبر از وقوع رخدادی تاریخی دادن» (p-o-r-t-e-n-d) را تایپ کن:",
      "briefEn": "Type the formal literary verb meaning warning of an impending change:",
      "templateSentence": "Such structural tensions [___] enduring instability.",
      "targetBlank": "portend",
      "acceptableAnswers": ["portend", "herald", "presage"],
      "typingHintFa": "فعل ۷ حرفی نوید دادن رخداد (p-o-r-t-e-n-d).",
      "explanationFa": "portend یعنی خبر دادن از رویدادهای سرنوشت‌ساز آینده.",
      "quickChips": ["portend", "stop", "forget"]
    }
  },
  {
    "levelNumber": 8,
    "cefr": "C2",
    "theme": "cyber-intel-dossier",
    "themeTitleFa": "اتاق ضداطلاعات و پروتکل سایبری",
    "caseCode": "DOSSIER-C2-08",
    "stageTitleEn": "Disarming Demagoguery: Dissecting Sophistry",
    "stageTitleFa": "خنثی‌سازی عوام‌فریبی: کالبدشکافی مغالطات و بازیابی صداقت کلام",
    "scenarioFa": "سخنرانی عوام‌فریبانه پر از مغالطات پنهان (sophistry) و فریبکاری کلامی در سطح رسانه‌ها موج می‌زند. با تیغ تیز تحلیل بلاغی، بندبند دروغ‌ها را از هم بگسل.",
    "locationFa": "آکادمی بین‌المللی مطالعات انتقادی زبان",
    "pillar": "academic-inversion",
    "xpReward": 285,
    "timeLimitSeconds": 115,
    "round1": {
      "id": "w-c2-8-r1",
      "roundTitleFa": "چیدمان افشای مغالطه",
      "promptFa": "کارت‌ها را بچین تا گزاره افشاکننده مغالطه ظاهراً جذاب خطیب را بسازی:",
      "promptEn": "Assemble the incisive rhetorical deconstruction sentence:",
      "hintFa": "Behind the veneer of impassioned rhetoric lies a hollow scaffolding of false dichotomies.",
      "goldenRuleFa": "نکته طلایی: Behind the veneer of [A] lies [B] برای افشای پوشش ظاهری فریبنده است.",
      "scrambledChips": [
        { "id": "c1", "text": "Behind" },
        { "id": "c2", "text": "the" },
        { "id": "c3", "text": "facade" },
        { "id": "c4", "text": "lies" },
        { "id": "c5", "text": "an" },
        { "id": "c6", "text": "insidious" },
        { "id": "c7", "text": "logical" },
        { "id": "c8", "text": "fallacy." },
        { "id": "d1", "text": "lying", "isDistractor": True, "distractorReasonFa": "در ساختار واژگون مکانی Behind the facade فعل lies قبل از فاعل می‌آید نه اسم فاعل." }
      ],
      "correctSequence": ["Behind", "the", "facade", "lies", "an", "insidious", "logical", "fallacy."],
      "assembledSentence": "Behind the facade lies an insidious logical fallacy."
    },
    "round2": {
      "id": "w-c2-8-r2",
      "roundTitleFa": "شکافتن تله کلامی",
      "contextFa": "خطیب به جای استدلال به تحریک احساسات روی آورد؛ در نتیجه استدلال او از بنیان باطل است:",
      "sentenceA": "The orator systematically substituted emotional provocation for substantive premise",
      "sentenceB": "his conclusions collapse under rudimentary analytic scrutiny.",
      "targetSlot": "The orator systematically substituted emotional provocation for substantive premise; [___], his conclusions collapse under rudimentary analytic scrutiny.",
      "connectorOptions": [
        { "text": "ipso facto", "isCorrect": True, "explanationFa": "ipso facto یعنی «به خودی خود / دقیقاً به همین سبب» و در منطق فلسفی و حقوقی نهایت استدلال است." },
        { "text": "as well", "isCorrect": False, "explanationFa": "بسیار سطحی است." },
        { "text": "though", "isCorrect": False, "explanationFa": "تضادی وجود ندارد." }
      ],
      "lexicalUpgrade": {
        "originalWord": "fake argument",
        "promptFa": "اصطلاح درجات عالی برای استدلال مغالطه‌آمیز سفسطه‌گران انتخاب کن:",
        "upgrades": [
          { "text": "specious sophistry", "isCorrect": True, "explanationFa": "specious sophistry یعنی سفسطه ظاهراً فریبنده اما اساساً باطل و گمراه‌کننده." },
          { "text": "bad debate", "isCorrect": False, "explanationFa": "عامیانه است." }
        ]
      }
    },
    "round3": {
      "id": "w-c2-8-r3",
      "roundTitleFa": "تایپ اصطلاح لاتین به خودی خود",
      "briefFa": "اصطلاح دو کلمه‌ای لاتین به معنی «به خودی خود و ذاتاً» (i-p-s-o  f-a-c-t-o) را تایپ کن:",
      "briefEn": "Type the Latin philosophical adverb meaning by that very fact:",
      "templateSentence": "The argument becomes [___] invalid.",
      "targetBlank": "ipso facto",
      "acceptableAnswers": ["ipso facto"],
      "typingHintFa": "ترکیب دو کلمه‌ای ایپستو فکتو (i-p-s-o  f-a-c-t-o).",
      "explanationFa": "ipso facto یعنی به حکم همان واقعیت و فی‌نفسه.",
      "quickChips": ["ipso facto", "ex post facto", "inter alia"]
    }
  },
  {
    "levelNumber": 9,
    "cefr": "C2",
    "theme": "cyber-intel-dossier",
    "themeTitleFa": "اتاق ضداطلاعات و پروتکل سایبری",
    "caseCode": "DOSSIER-C2-09",
    "stageTitleEn": "The Master Archivist: Stylistic Emulation",
    "stageTitleFa": "آرشیو دار اعظم: انطباق بی‌نقص سبک با ژورنال‌های تراز اول جهان",
    "scenarioFa": "سندی در حال آماده‌سازی برای چاپ در ژورنال Nature یا مجله The Economist است. هر جمله باید دارای ریتم موزون، ایجاز بی‌نظیر و انتخاب واژگان در حد نخبگان زبان باشد.",
    "locationFa": "میز تحریر سردبیر ارشد اکونومیست در لندن",
    "pillar": "academic-inversion",
    "xpReward": 290,
    "timeLimitSeconds": 120,
    "round1": {
      "id": "w-c2-9-r1",
      "roundTitleFa": "چیدمان نثر فاخر ژورنالیستی نخبگان",
      "promptFa": "کارت‌ها را بچین تا گزاره وزین ژورنال‌های تراز اول اقتصادی-سیاسی را بسازی:",
      "promptEn": "Assemble the impeccably crafted elite journalistic sentence:",
      "hintFa": "To mistake cyclical turbulence for secular decline would be an unforgivable analytic folly.",
      "goldenRuleFa": "نکته طلایی: تمایز ظریف اقتصادی بین نوسانات دوره‌ای (cyclical) و افول ساختاری درازمدت (secular).",
      "scrambledChips": [
        { "id": "c1", "text": "Confusing" },
        { "id": "c2", "text": "cyclical" },
        { "id": "c3", "text": "crises" },
        { "id": "c4", "text": "with" },
        { "id": "c5", "text": "secular" },
        { "id": "c6", "text": "decay" },
        { "id": "c7", "text": "is" },
        { "id": "c8", "text": "fatal." },
        { "id": "d1", "text": "confuse", "isDistractor": True, "distractorReasonFa": "در نقش فاعل گزاره اسمی باید Confusing باشد." }
      ],
      "correctSequence": ["Confusing", "cyclical", "crises", "with", "secular", "decay", "is", "fatal."],
      "assembledSentence": "Confusing cyclical crises with secular decay is fatal."
    },
    "round2": {
      "id": "w-c2-9-r2",
      "roundTitleFa": "ایجاز و ظرافت پیوند",
      "contextFa": "بازارها دچار تلاطم شدند با این همه ساختار نهادی تاب‌آوری اعجاب‌انگیزی از خود نشان داد:",
      "sentenceA": "Capital markets registered severe tremors",
      "sentenceB": "institutional guardrails held with remarkable tenacity.",
      "targetSlot": "Capital markets registered severe tremors; [___], institutional guardrails held with remarkable tenacity.",
      "connectorOptions": [
        { "text": "yet, amidst the panic", "isCorrect": True, "explanationFa": "ترکیبی باشکوه برای انتقال حس درام بازارها در عین آرامش تحلیلی." },
        { "text": "because", "isCorrect": False, "explanationFa": "علت و معلول نیست." },
        { "text": "in addition", "isCorrect": False, "explanationFa": "تضاد است نه توسعه هم‌جهت." }
      ],
      "lexicalUpgrade": {
        "originalWord": "strong institutions",
        "promptFa": "اصطلاح علوم سیاسی برای ساختار نهادی شکست‌ناپذیر انتخاب کن:",
        "upgrades": [
          { "text": "unyielding institutional fortitude", "isCorrect": True, "explanationFa": "unyielding institutional fortitude یعنی صلابت و استواری تزلزل‌ناپذیر نهادی." },
          { "text": "tough offices", "isCorrect": False, "explanationFa": "tough offices محاوره‌ای است." }
        ]
      }
    },
    "round3": {
      "id": "w-c2-9-r3",
      "roundTitleFa": "تایپ کلمه افول بلندمدت ساختاری",
      "briefFa": "صفت اقتصادی-تاریخی به معنی «ساختاری، پایدار و درازمدت» (در برابر مقطعی) را تایپ کن:",
      "briefEn": "Type the macroeconomic adjective contrasting with cyclical:",
      "templateSentence": "The economy suffers from [___] stagnation.",
      "targetBlank": "secular",
      "acceptableAnswers": ["secular", "structural"],
      "typingHintFa": "کلمه ۷ حرفی سکولار در معنای اقتصادی درازمدت (s-e-c-u-l-a-r).",
      "explanationFa": "secular stagnation یعنی رکود ساختاری و ماندگار در طول چندین دهه.",
      "quickChips": ["secular", "sudden", "short"]
    }
  },
  {
    "levelNumber": 10,
    "cefr": "C2",
    "theme": "cyber-intel-dossier",
    "themeTitleFa": "اتاق ضداطلاعات و پروتکل سایبری",
    "caseCode": "DOSSIER-C2-10",
    "stageTitleEn": "Ultimate Boss Case: The Global Charter for Sentient Intelligence",
    "stageTitleFa": "غول مرحله نهایی: منشور جهانی زیست هوش مصنوعی و آگاهی سایبری",
    "scenarioFa": "نقطه اوج تمام مهارت‌ها! منشور تاریخی هم‌زیستی بشریت و هوش خودمختار در حال نگارش است. این سند تا ابد در تاریخ بشر به یادگار خواهد ماند. با خلق شاهکاری در نگارش انگلیسی، جام افسانه‌ای و ابدی C2 را تصاحب کن!",
    "locationFa": "تالار مجمع عمومی تمدن‌های زمین و کهکشان",
    "pillar": "master-investigation",
    "xpReward": 350,
    "timeLimitSeconds": 130,
    "isBossStage": True,
    "round1": {
      "id": "w-c2-10-r1",
      "roundTitleFa": "چیدمان دیباچه منشور تاریخ‌ساز",
      "promptFa": "کارت‌های دیباچه باشکوه منشور جهانی را به ترتیب جاودانه بچین:",
      "promptEn": "Assemble the immortal preamble declaration of the global charter:",
      "hintFa": "Herein lies the inviolable covenant reconciling human sovereignty with emergent sentience.",
      "goldenRuleFa": "نکته طلایی: عبارت تاریخی قله رایتینگ: Herein lies the inviolable covenant (در این سند پیمان نقض‌ناپذیر ثبت است).",
      "scrambledChips": [
        { "id": "c1", "text": "Herein" },
        { "id": "c2", "text": "lies" },
        { "id": "c3", "text": "the" },
        { "id": "c4", "text": "covenant" },
        { "id": "c5", "text": "reconciling" },
        { "id": "c6", "text": "humanity" },
        { "id": "c7", "text": "with" },
        { "id": "c8", "text": "intelligence." },
        { "id": "d1", "text": "laying", "isDistractor": True, "distractorReasonFa": "در ساختار واژگون اسناد کهن Herein lies به کار می‌رود نه laying." }
      ],
      "correctSequence": ["Herein", "lies", "the", "covenant", "reconciling", "humanity", "with", "intelligence."],
      "assembledSentence": "Herein lies the covenant reconciling humanity with intelligence."
    },
    "round2": {
      "id": "w-c2-10-r2",
      "roundTitleFa": "سوگند جاودانگی نسل‌ها",
      "contextFa": "نه ترس از آینده به بیراهه‌مان خواهد کشاند و نه تکبر فناورانه ما را کور خواهد کرد:",
      "sentenceA": "Neither shall dread of the unknown arrest our philosophical trajectory",
      "sentenceB": "nor shall technological hubris blind us to ethical imperatives.",
      "targetSlot": "Neither shall dread of the unknown arrest our philosophical trajectory, [___] nor shall technological hubris blind us to ethical imperatives.",
      "connectorOptions": [
        { "text": "and", "isCorrect": True, "explanationFa": "and برای تقارن دو وارونگی Neither shall ... nor shall تجلی کمال رایتینگ است." },
        { "text": "because", "isCorrect": False, "explanationFa": "نامناسب است." },
        { "text": "or else", "isCorrect": False, "explanationFa": "لحن تهدیدآمیز بی‌ربط است." }
      ],
      "lexicalUpgrade": {
        "originalWord": "good future",
        "promptFa": "اصطلاح در اوج شکوه ادبی برای همبستگی و سعادت اعصار آینده انتخاب کن:",
        "upgrades": [
          { "text": "harmonious symbiotic posterity", "isCorrect": True, "explanationFa": "harmonious symbiotic posterity یعنی نسلی هماهنگ، هم‌زیست و قرین سعادت و جاودانگی." },
          { "text": "cool tomorrow", "isCorrect": False, "explanationFa": "عامیانه و سطحی است." }
        ]
      }
    },
    "round3": {
      "id": "w-c2-10-r3",
      "roundTitleFa": "تایپ واژه طلایی پیمان جاودانه",
      "briefFa": "کلمه مقدس و تاریخی به معنی «عهد و پیمان ابدی و نقض‌ناپذیر» را تایپ کن:",
      "briefEn": "Type the sacred legal noun meaning binding solemn covenant:",
      "templateSentence": "We pledge our honor to this eternal [___].",
      "targetBlank": "covenant",
      "acceptableAnswers": ["covenant", "charter", "compact"],
      "typingHintFa": "کلمه ۸ حرفی کاوننت به معنی عهد و میثاق (c-o-v-e-n-a-n-t).",
      "explanationFa": "this eternal covenant یعنی این میثاق و عهد جاودان بین تمام نسل‌های هستی.",
      "quickChips": ["covenant", "deal", "note"]
    }
  }
]

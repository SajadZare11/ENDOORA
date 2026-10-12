# -*- coding: utf-8 -*-
"""
A1 and A2 Cases for Writing Clue Hunter:
Theme: 'word-bot-factory' (کارخانه روبات‌های کلمه‌ساز)
"""

A1_CASES = [
  {
    "levelNumber": 1,
    "cefr": "A1",
    "theme": "word-bot-factory",
    "themeTitleFa": "کارخانه روبات‌های کلمه‌ساز",
    "caseCode": "BOT-A1-01",
    "stageTitleEn": "Power On: Capital Letters & Full Stops",
    "stageTitleFa": "روشن شدن ربات: حرف بزرگ و نقطه پایان",
    "scenarioFa": "اولین ربات روی نوار نقاله خوابیده! برای روشن کردن موتورش باید نشانه‌گذاری و حروف بزرگ جمله اولش رو مرتب کنی.",
    "locationFa": "خط تولید ۱ - کارگاه مونتاژ",
    "pillar": "word-order-punctuation",
    "xpReward": 60,
    "timeLimitSeconds": 60,
    "round1": {
      "id": "w-a1-1-r1",
      "roundTitleFa": "مونتاژ قطعات جمله",
      "promptFa": "کارت‌های کلمه را به ترتیب درست بچین تا موتور ربات روشن شود:",
      "promptEn": "Assemble the chips into a grammatically correct sentence:",
      "hintFa": "جمله در انگلیسی با فاعل شروع می‌شود، فعل بعد از آن می‌آید و در آخر نقطه قرار می‌گیرد.",
      "goldenRuleFa": "نکته طلایی: همیشه حرف اول جمله بزرگ است (My) و پایان جمله خبری نقطه (.) قرار می‌گیرد.",
      "scrambledChips": [
        { "id": "c1", "text": "My" },
        { "id": "c2", "text": "name" },
        { "id": "c3", "text": "is" },
        { "id": "c4", "text": "Sparky." },
        { "id": "d1", "text": "are", "isDistractor": True, "distractorReasonFa": "برای اسم مفرد (name) باید از فعل is استفاده کنیم نه are!" }
      ],
      "correctSequence": ["My", "name", "is", "Sparky."],
      "assembledSentence": "My name is Sparky."
    },
    "round2": {
      "id": "w-a1-1-r2",
      "roundTitleFa": "تزریق کلمه ربط",
      "contextFa": "ربات می‌خواهد دو تا ویژگی خودش را بگوید:",
      "sentenceA": "I have two shiny eyes",
      "sentenceB": "I can walk fast.",
      "targetSlot": "I have two shiny eyes [___] I can walk fast.",
      "connectorOptions": [
        { "text": "and", "isCorrect": True, "explanationFa": "کلمه and برای اضافه کردن اطلاعات تکمیلی و هم‌جهت به کار می‌رود." },
        { "text": "but", "isCorrect": False, "explanationFa": "کلمه but برای تضاد است، اما اینجا هر دو ویژگی مثبت هستند." },
        { "text": "because", "isCorrect": False, "explanationFa": "کلمه because دلیل را بیان می‌کند؛ تند راه رفتن علت داشتن چشم نیست!" }
      ],
      "lexicalUpgrade": {
        "originalWord": "nice",
        "promptFa": "یک کلمه شادتر و دقیق‌تر برای توصیف ربات انتخاب کن:",
        "upgrades": [
          { "text": "friendly", "isCorrect": True, "explanationFa": "کلمه friendly یعنی خونگرم و صمیمی که برای ربات مهربان دقیق‌تر است." },
          { "text": "big", "isCorrect": False, "explanationFa": "کلمه big یعنی بزرگ و ربطی به مهربانی ربات ندارد." }
        ]
      }
    },
    "round3": {
      "id": "w-a1-1-r3",
      "roundTitleFa": "شلیک نهایی و تایپ رمز",
      "briefFa": "سلام ربات را به دفتر مرکزی با تایپ عبارت کوتاه کامل کن:",
      "briefEn": "Type the missing greeting words to complete the robot's transmission:",
      "templateSentence": "Hello, I am [___] to meet you.",
      "targetBlank": "happy",
      "acceptableAnswers": ["happy", "glad", "pleased"],
      "typingHintFa": "کلمه انگلیسی به معنی «خوشحال» را تایپ کن (h-a-p-p-y).",
      "explanationFa": "جمله I am happy to meet you یک عبارت مرسوم و دوستانه برای معرفی است.",
      "quickChips": ["happy", "glad", "ready"]
    }
  },
  {
    "levelNumber": 2,
    "cefr": "A1",
    "theme": "word-bot-factory",
    "themeTitleFa": "کارخانه روبات‌های کلمه‌ساز",
    "caseCode": "BOT-A1-02",
    "stageTitleEn": "Color Sensors: Adjective Order",
    "stageTitleFa": "حسگرهای رنگی: جایگاه صفت قبل از اسم",
    "scenarioFa": "حسگرهای رنگی ربات قاطی کرده‌اند! باید رنگ‌ها و صفت‌ها را دقیقاً قبل از اسم‌ها بنویسی تا بازوهای رنگی کار کنند.",
    "locationFa": "بخش رنگ‌آمیزی و نورسنجی",
    "pillar": "word-order-punctuation",
    "xpReward": 65,
    "timeLimitSeconds": 60,
    "round1": {
      "id": "w-a1-2-r1",
      "roundTitleFa": "مونتاژ قطعات صفت و اسم",
      "promptFa": "کارت‌ها را طوری بچین که نشان دهد ربات یک دکمه آبی دارد:",
      "promptEn": "Order the chips correctly showing the robot holds a blue button:",
      "hintFa": "در زبان انگلیسی صفت همیشه قبل از اسم قرار می‌گیرد (blue button نه button blue).",
      "goldenRuleFa": "نکته طلایی: برخلاف فارسی، در انگلیسی اول صفت میاد بعد اسم: a blue button.",
      "scrambledChips": [
        { "id": "c1", "text": "The" },
        { "id": "c2", "text": "robot" },
        { "id": "c3", "text": "has" },
        { "id": "c4", "text": "a" },
        { "id": "c5", "text": "blue" },
        { "id": "c6", "text": "button." },
        { "id": "d1", "text": "have", "isDistractor": True, "distractorReasonFa": "فاعل The robot سوم‌شخص مفرد است و باید has بگیرد نه have!" }
      ],
      "correctSequence": ["The", "robot", "has", "a", "blue", "button."],
      "assembledSentence": "The robot has a blue button."
    },
    "round2": {
      "id": "w-a1-2-r2",
      "roundTitleFa": "تزریق کلمه ربط",
      "contextFa": "ربات نور آبی دارد ولی زنگ هشدار نمی‌زند:",
      "sentenceA": "The light is blue",
      "sentenceB": "the alarm is quiet.",
      "targetSlot": "The light is blue [___] the alarm is quiet.",
      "connectorOptions": [
        { "text": "and", "isCorrect": True, "explanationFa": "اینجا دو توصیف هم‌زمان با and به هم وصل می‌شوند." },
        { "text": "so", "isCorrect": False, "explanationFa": "کلمه so یعنی «بنابراین» و اینجا رابطه علت و معلول نیست." },
        { "text": "or", "isCorrect": False, "explanationFa": "کلمه or یعنی «یا» و برای انتخاب بین دو گزینه است." }
      ],
      "lexicalUpgrade": {
        "originalWord": "small",
        "promptFa": "صفت دقیق‌تری برای یک لامپ خیلی ریز پیدا کن:",
        "upgrades": [
          { "text": "tiny", "isCorrect": True, "explanationFa": "tiny یعنی بسیار کوچک و مینیاتوری." },
          { "text": "fast", "isCorrect": False, "explanationFa": "fast به سرعت اشاره دارد نه اندازه." }
        ]
      }
    },
    "round3": {
      "id": "w-a1-2-r3",
      "roundTitleFa": "تایپ رمز فعال‌سازی",
      "briefFa": "جمله حسگر نور را تایپ کن:",
      "briefEn": "Type the missing color word for the main lamp:",
      "templateSentence": "The lamp is very [___].",
      "targetBlank": "bright",
      "acceptableAnswers": ["bright", "shiny"],
      "typingHintFa": "کلمه به معنای «درخشان و روشن» (b-r-i-g-h-t).",
      "explanationFa": "صفت bright برای لامپ و نور کاملاً طبیعی و استاندارد است.",
      "quickChips": ["bright", "green", "clean"]
    }
  },
  {
    "levelNumber": 3,
    "cefr": "A1",
    "theme": "word-bot-factory",
    "themeTitleFa": "کارخانه روبات‌های کلمه‌ساز",
    "caseCode": "BOT-A1-03",
    "stageTitleEn": "Daily Routine Chips: Present Simple",
    "stageTitleFa": "تراشه‌های روزمره: حال ساده و ساعت‌ها",
    "scenarioFa": "جدول برنامه‌ریزی نظافت کارخانه پاک شده. با چیدن کارهای روزانه به انگلیسی، برنامه ربات نظافتچی را بنویس.",
    "locationFa": "ایستگاه شارژ و نگهداری",
    "pillar": "word-order-punctuation",
    "xpReward": 70,
    "timeLimitSeconds": 65,
    "round1": {
      "id": "w-a1-3-r1",
      "roundTitleFa": "چیدمان کار روزانه",
      "promptFa": "کارت‌ها را بچین تا ساعت شروع کار ربات مشخص شود:",
      "promptEn": "Arrange the words to state when the robot starts working:",
      "hintFa": "برای ساعت‌ها همیشه از حرف اضافه at استفاده می‌کنیم (at 7 o'clock).",
      "goldenRuleFa": "نکته طلایی: فاعل سوم شخص مفرد در حال ساده فعل با s می‌گیرد: It starts at 8 AM.",
      "scrambledChips": [
        { "id": "c1", "text": "It" },
        { "id": "c2", "text": "cleans" },
        { "id": "c3", "text": "the" },
        { "id": "c4", "text": "floor" },
        { "id": "c5", "text": "every" },
        { "id": "c6", "text": "morning." },
        { "id": "d1", "text": "clean", "isDistractor": True, "distractorReasonFa": "فاعل It است و فعل حتماً باید s بگیرد (cleans)!" }
      ],
      "correctSequence": ["It", "cleans", "the", "floor", "every", "morning."],
      "assembledSentence": "It cleans the floor every morning."
    },
    "round2": {
      "id": "w-a1-3-r2",
      "roundTitleFa": "کلمه ربط زمان",
      "contextFa": "ربات اول باتری پر می‌کند و سپس راه می‌افتد:",
      "sentenceA": "The robot charges its battery",
      "sentenceB": "it begins to sweep.",
      "targetSlot": "The robot charges its battery, [___] it begins to sweep.",
      "connectorOptions": [
        { "text": "then", "isCorrect": True, "explanationFa": "کلمه then برای بیان ترتیب کارهای بعدی به کار می‌رود (سپس)." },
        { "text": "because", "isCorrect": False, "explanationFa": "کلمه because برای بیان دلیل است." },
        { "text": "or", "isCorrect": False, "explanationFa": "کلمه or برای گزینه‌های جایگزین است." }
      ],
      "lexicalUpgrade": {
        "originalWord": "works",
        "promptFa": "کلمه دقیق‌تری به جای کار کردن عادی انتخاب کن:",
        "upgrades": [
          { "text": "operates", "isCorrect": True, "explanationFa": "operates یعنی با دقت کار می‌کند و فعالیت ماشینی دارد." },
          { "text": "plays", "isCorrect": False, "explanationFa": "plays یعنی بازی کردن و برای ماشین نامناسب است." }
        ]
      }
    },
    "round3": {
      "id": "w-a1-3-r3",
      "roundTitleFa": "تایپ زمان‌بندی",
      "briefFa": "حرف اضافه مناسب برای ساعت را تایپ کن:",
      "briefEn": "Type the preposition used before clock time:",
      "templateSentence": "The robot sleeps [___] night.",
      "targetBlank": "at",
      "acceptableAnswers": ["at"],
      "typingHintFa": "حرف اضافه دو حرفی برای night (a-t).",
      "explanationFa": "در انگلیسی همیشه می‌گوییم at night (نه in night).",
      "quickChips": ["at", "on", "in"]
    }
  },
  {
    "levelNumber": 4,
    "cefr": "A1",
    "theme": "word-bot-factory",
    "themeTitleFa": "کارخانه روبات‌های کلمه‌ساز",
    "caseCode": "BOT-A1-04",
    "stageTitleEn": "Likes & Fuel: Expressing Preferences",
    "stageTitleFa": "سوخت و علاقه‌مندی‌ها: بیان علایق با like",
    "scenarioFa": "ربات آشپز باید یادداشت مواد اولیه مورد نیازش را بنویسد؛ به او کمک کن با جملات انگلیسی بگوید چه چیزی می‌خواهد.",
    "locationFa": "آشپزخانه اتوماتیک کارخانه",
    "pillar": "word-order-punctuation",
    "xpReward": 75,
    "timeLimitSeconds": 65,
    "round1": {
      "id": "w-a1-4-r1",
      "roundTitleFa": "چیدمان علاقه آشپز",
      "promptFa": "جمله علاقه ربات به میوه‌ها را مرتب کن:",
      "promptEn": "Build the sentence expressing the robot's preference:",
      "hintFa": "ترتیب: فاعل + فعل like/likes + مفعول.",
      "goldenRuleFa": "نکته طلایی: بعد از I فعل ساده می‌آید: I like apples.",
      "scrambledChips": [
        { "id": "c1", "text": "I" },
        { "id": "c2", "text": "like" },
        { "id": "c3", "text": "fresh" },
        { "id": "c4", "text": "apples" },
        { "id": "c5", "text": "and" },
        { "id": "c6", "text": "oranges." },
        { "id": "d1", "text": "likes", "isDistractor": True, "distractorReasonFa": "با ضمیر I هرگز از likes با s استفاده نمی‌کنیم!" }
      ],
      "correctSequence": ["I", "like", "fresh", "apples", "and", "oranges."],
      "assembledSentence": "I like fresh apples and oranges."
    },
    "round2": {
      "id": "w-a1-4-r2",
      "roundTitleFa": "تضاد در سلیقه",
      "contextFa": "ربات چای دوست دارد اما قهوه نمی‌نوشد:",
      "sentenceA": "I drink warm tea",
      "sentenceB": "I do not drink coffee.",
      "targetSlot": "I drink warm tea, [___] I do not drink coffee.",
      "connectorOptions": [
        { "text": "but", "isCorrect": True, "explanationFa": "کلمه but بیانگر تضاد است (اما)." },
        { "text": "so", "isCorrect": False, "explanationFa": "کلمه so یعنی «پس، بنابراین» و ارتباط نتیجه‌ای می‌سازد." },
        { "text": "because", "isCorrect": False, "explanationFa": "قهوه نخوردن دلیل چای خوردن نیست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "good",
        "promptFa": "صفت اشتهاآورتر برای غذا انتخاب کن:",
        "upgrades": [
          { "text": "delicious", "isCorrect": True, "explanationFa": "delicious یعنی بسیار خوشمزه و لذیذ." },
          { "text": "cold", "isCorrect": False, "explanationFa": "cold یعنی سرد که مزه غذا نیست." }
        ]
      }
    },
    "round3": {
      "id": "w-a1-4-r3",
      "roundTitleFa": "تایپ سفارش",
      "briefFa": "کلمه مورد نیاز برای درخواست محترمانه را تایپ کن:",
      "briefEn": "Type the magic polite word for a request:",
      "templateSentence": "Can I have some water, [___]?",
      "targetBlank": "please",
      "acceptableAnswers": ["please"],
      "typingHintFa": "کلمه مودبانه «لطفاً» (p-l-e-a-s-e).",
      "explanationFa": "همیشه در پایان درخواست‌ها از please برای ادب بیشتر استفاده می‌شود.",
      "quickChips": ["please", "thanks", "now"]
    }
  },
  {
    "levelNumber": 5,
    "cefr": "A1",
    "theme": "word-bot-factory",
    "themeTitleFa": "کارخانه روبات‌های کلمه‌ساز",
    "caseCode": "BOT-A1-05",
    "stageTitleEn": "Location Chips: Prepositions of Place",
    "stageTitleFa": "تراشه‌های مکان: حروف اضافه مکان در کارگاه",
    "scenarioFa": "آچار جادویی گم شده! باید یادداشتی بنویسی و جای دقیق آن را روی میز با حروف اضافه مشخص کنی.",
    "locationFa": "انبار ابزار و چرخ‌دنده‌ها",
    "pillar": "word-order-punctuation",
    "xpReward": 80,
    "timeLimitSeconds": 70,
    "round1": {
      "id": "w-a1-5-r1",
      "roundTitleFa": "چیدمان محل آچار",
      "promptFa": "کارت‌ها را بچین تا محل آچار روی میز کار مشخص شود:",
      "promptEn": "Form the sentence stating where the wrench is located:",
      "hintFa": "برای سطوح صاف مثل میز از on استفاده می‌کنیم: on the table.",
      "goldenRuleFa": "نکته طلایی: The wrench is on the wooden table.",
      "scrambledChips": [
        { "id": "c1", "text": "The" },
        { "id": "c2", "text": "wrench" },
        { "id": "c3", "text": "is" },
        { "id": "c4", "text": "on" },
        { "id": "c5", "text": "the" },
        { "id": "c6", "text": "table." },
        { "id": "d1", "text": "in", "isDistractor": True, "distractorReasonFa": "روی میز on the table است، in یعنی درون کشو یا جعبه!" }
      ],
      "correctSequence": ["The", "wrench", "is", "on", "the", "table."],
      "assembledSentence": "The wrench is on the table."
    },
    "round2": {
      "id": "w-a1-5-r2",
      "roundTitleFa": "ربط مکان دوم",
      "contextFa": "آچار روی میز است و کنار جعبه پیچ‌ها قرار دارد:",
      "sentenceA": "The wrench is on the desk",
      "sentenceB": "the screws are next to it.",
      "targetSlot": "The wrench is on the desk, [___] the screws are next to it.",
      "connectorOptions": [
        { "text": "and", "isCorrect": True, "explanationFa": "برای پیوند دو مشاهده مکانی از and استفاده می‌شود." },
        { "text": "because", "isCorrect": False, "explanationFa": "اینجا دلیلی آورده نشده است." },
        { "text": "but", "isCorrect": False, "explanationFa": "تضادی بین دو گزاره وجود ندارد." }
      ],
      "lexicalUpgrade": {
        "originalWord": "near",
        "promptFa": "عبارت دقیق‌تر برای چسبیده بودن انتخاب کن:",
        "upgrades": [
          { "text": "beside", "isCorrect": True, "explanationFa": "beside یعنی درست در کنار و مجاور." },
          { "text": "far", "isCorrect": False, "explanationFa": "far یعنی دور که متضاد است." }
        ]
      }
    },
    "round3": {
      "id": "w-a1-5-r3",
      "roundTitleFa": "تایپ جهت",
      "briefFa": "حرف اضافه به معنی «زیر» میز را تایپ کن:",
      "briefEn": "Type the preposition meaning beneath:",
      "templateSentence": "The box is [___] the bench.",
      "targetBlank": "under",
      "acceptableAnswers": ["under", "below"],
      "typingHintFa": "کلمه ۵ حرفی به معنی زیر (u-n-d-e-r).",
      "explanationFa": "under the bench یعنی زیر نیمکت.",
      "quickChips": ["under", "over", "into"]
    }
  },
  {
    "levelNumber": 6,
    "cefr": "A1",
    "theme": "word-bot-factory",
    "themeTitleFa": "کارخانه روبات‌های کلمه‌ساز",
    "caseCode": "BOT-A1-06",
    "stageTitleEn": "Ability Circuits: Writing with 'Can'",
    "stageTitleFa": "مدارهای توانایی: جمله‌سازی با can و can't",
    "scenarioFa": "دفترچه راهنمای ربات پرنده باید نوشته شود تا مهندسان بدانند چه کارهایی از عهده‌اش برمی‌آید.",
    "locationFa": "سکوی آزمایش پرواز",
    "pillar": "word-order-punctuation",
    "xpReward": 85,
    "timeLimitSeconds": 70,
    "round1": {
      "id": "w-a1-6-r1",
      "roundTitleFa": "چیدمان توانایی ربات",
      "promptFa": "کارت‌ها را بچین تا توانایی پرواز ربات را اعلام کنی:",
      "promptEn": "Build the ability sentence using modal 'can':",
      "hintFa": "فرمول: فاعل + can + فعل ساده بدون to یا ing.",
      "goldenRuleFa": "نکته طلایی: بعد از can فعل همیشه ساده است: can fly (نه can to fly یا can flies).",
      "scrambledChips": [
        { "id": "c1", "text": "This" },
        { "id": "c2", "text": "robot" },
        { "id": "c3", "text": "can" },
        { "id": "c4", "text": "fly" },
        { "id": "c5", "text": "very" },
        { "id": "c6", "text": "high." },
        { "id": "d1", "text": "flies", "isDistractor": True, "distractorReasonFa": "بعد از can هرگز فعل s نمی‌گیرد!" }
      ],
      "correctSequence": ["This", "robot", "can", "fly", "very", "high."],
      "assembledSentence": "This robot can fly very high."
    },
    "round2": {
      "id": "w-a1-6-r2",
      "roundTitleFa": "توانایی در برابر محدودیت",
      "contextFa": "ربات می‌تواند پرواز کند اما نمی‌تواند شنا کند:",
      "sentenceA": "It can fly in the sky",
      "sentenceB": "it cannot swim in water.",
      "targetSlot": "It can fly in the sky, [___] it cannot swim in water.",
      "connectorOptions": [
        { "text": "but", "isCorrect": True, "explanationFa": "برای بیان تضاد بین یک توانایی و یک ناتوانی از but استفاده می‌شود." },
        { "text": "so", "isCorrect": False, "explanationFa": "کلمه so نشان‌دهنده نتیجه است." },
        { "text": "because", "isCorrect": False, "explanationFa": "شنا نکردن نتیجه پرواز نیست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "fast",
        "promptFa": "قید جذاب‌تری برای حرکت بی‌صدا انتخاب کن:",
        "upgrades": [
          { "text": "smoothly", "isCorrect": True, "explanationFa": "smoothly یعنی روان و بدون تکان." },
          { "text": "loudly", "isCorrect": False, "explanationFa": "loudly یعنی با سر و صدای زیاد." }
        ]
      }
    },
    "round3": {
      "id": "w-a1-6-r3",
      "roundTitleFa": "تایپ فعل توانستن منفی",
      "briefFa": "حالت منفی کلمه can را با آپوستروف تایپ کن:",
      "briefEn": "Type the short contraction for cannot:",
      "templateSentence": "The small drone [___] carry heavy rocks.",
      "targetBlank": "can't",
      "acceptableAnswers": ["can't", "cannot"],
      "typingHintFa": "مخفف cannot به شکل c-a-n-'-t.",
      "explanationFa": "can't فرم کوتاه و روزمره cannot است.",
      "quickChips": ["can't", "cannot", "won't"]
    }
  },
  {
    "levelNumber": 7,
    "cefr": "A1",
    "theme": "word-bot-factory",
    "themeTitleFa": "کارخانه روبات‌های کلمه‌ساز",
    "caseCode": "BOT-A1-07",
    "stageTitleEn": "SMS to the Engineer: Short Messages",
    "stageTitleFa": "پیامک به مهندس: نگارش پیام‌های کوتاه و فوری",
    "scenarioFa": "پیچ اصلی خط تولید لق شده! ربات باید یک پیامک کوتاه و فوری برای سرپرست شیفت بفرستد.",
    "locationFa": "مرکز فرمان رادیویی",
    "pillar": "word-order-punctuation",
    "xpReward": 90,
    "timeLimitSeconds": 70,
    "round1": {
      "id": "w-a1-7-r1",
      "roundTitleFa": "چیدمان پیامک فوری",
      "promptFa": "کارت‌ها را بچین تا به مهندس بگویی نیاز به کمک فوری داری:",
      "promptEn": "Form a concise SMS alert to the chief engineer:",
      "hintFa": "جمله با فاعل We و فعل need شروع می‌شود.",
      "goldenRuleFa": "نکته طلایی: We need your help right now.",
      "scrambledChips": [
        { "id": "c1", "text": "We" },
        { "id": "c2", "text": "need" },
        { "id": "c3", "text": "your" },
        { "id": "c4", "text": "help" },
        { "id": "c5", "text": "right" },
        { "id": "c6", "text": "now." },
        { "id": "d1", "text": "needs", "isDistractor": True, "distractorReasonFa": "فاعل We جمع است و فعل s نمی‌گیرد!" }
      ],
      "correctSequence": ["We", "need", "your", "help", "right", "now."],
      "assembledSentence": "We need your help right now."
    },
    "round2": {
      "id": "w-a1-7-r2",
      "roundTitleFa": "دلیل در پیامک",
      "contextFa": "باید سریع بیاید چون دستگاه متوقف شده:",
      "sentenceA": "Please come quickly",
      "sentenceB": "the machine stopped.",
      "targetSlot": "Please come quickly [___] the machine stopped.",
      "connectorOptions": [
        { "text": "because", "isCorrect": True, "explanationFa": "کلمه because علت درخواست حضور فوری را توضیح می‌دهد." },
        { "text": "or", "isCorrect": False, "explanationFa": "کلمه or برای گزینه‌های جایگزین است." },
        { "text": "so", "isCorrect": False, "explanationFa": "اینجا علت بعد از جای خالی آمده، پس because درست است." }
      ],
      "lexicalUpgrade": {
        "originalWord": "bad",
        "promptFa": "کلمه بهتری برای توصیف یک مشکل فنی جدی انتخاب کن:",
        "upgrades": [
          { "text": "urgent", "isCorrect": True, "explanationFa": "urgent یعنی فوری و اضطراری." },
          { "text": "slow", "isCorrect": False, "explanationFa": "slow ربطی به ماهیت مشکل ندارد." }
        ]
      }
    },
    "round3": {
      "id": "w-a1-7-r3",
      "roundTitleFa": "تایپ امضای پیامک",
      "briefFa": "کلمه خداحافظی صمیمانه را تایپ کن:",
      "briefEn": "Type a warm sign-off word:",
      "templateSentence": "[___] regards, Bot-9.",
      "targetBlank": "Best",
      "acceptableAnswers": ["Best", "Warm", "Kind"],
      "typingHintFa": "کلمه ۴ حرفی به معنای بهترین (B-e-s-t).",
      "explanationFa": "Best regards یک عبارت پایانی بسیار پرکاربرد و محترمانه در مکاتبات است.",
      "quickChips": ["Best", "Warm", "Good"]
    }
  },
  {
    "levelNumber": 8,
    "cefr": "A1",
    "theme": "word-bot-factory",
    "themeTitleFa": "کارخانه روبات‌های کلمه‌ساز",
    "caseCode": "BOT-A1-08",
    "stageTitleEn": "Friendly Postcard: Greetings from the Workshop",
    "stageTitleFa": "کارت‌پستال دوستانه: احوال‌پرسی از کارگاه",
    "scenarioFa": "ربات‌ها برای تعطیلات آخر هفته کارت‌پستال می‌فرستند. با ساخت جملات توصیفی کارت‌پستال را بنویس.",
    "locationFa": "ایستگاه بسته‌بندی پستی",
    "pillar": "word-order-punctuation",
    "xpReward": 95,
    "timeLimitSeconds": 75,
    "round1": {
      "id": "w-a1-8-r1",
      "roundTitleFa": "چیدمان شروع کارت‌پستال",
      "promptFa": "کارت‌ها را بچین تا آب‌وهوای عالی کارگاه را توصیف کنی:",
      "promptEn": "Assemble the postcard weather opening:",
      "hintFa": "برای وضعیت هوا از ساختار The weather is + صفت استفاده کن.",
      "goldenRuleFa": "نکته طلایی: The weather is sunny and warm.",
      "scrambledChips": [
        { "id": "c1", "text": "The" },
        { "id": "c2", "text": "weather" },
        { "id": "c3", "text": "is" },
        { "id": "c4", "text": "sunny" },
        { "id": "c5", "text": "and" },
        { "id": "c6", "text": "warm." },
        { "id": "d1", "text": "are", "isDistractor": True, "distractorReasonFa": "کلمه weather اسم غیرقابل شمارش و مفرد است و is می‌خواهد." }
      ],
      "correctSequence": ["The", "weather", "is", "sunny", "and", "warm."],
      "assembledSentence": "The weather is sunny and warm."
    },
    "round2": {
      "id": "w-a1-8-r2",
      "roundTitleFa": "نتیجه‌گیری هوای خوب",
      "contextFa": "هوا آفتابی است بنابراین در حیاط قدم می‌زنیم:",
      "sentenceA": "The sun is shining",
      "sentenceB": "we are walking outside.",
      "targetSlot": "The sun is shining, [___] we are walking outside.",
      "connectorOptions": [
        { "text": "so", "isCorrect": True, "explanationFa": "کلمه so یعنی «بنابراین» و نتیجه آفتابی بودن هوا را بیان می‌کند." },
        { "text": "but", "isCorrect": False, "explanationFa": "قدم زدن در هوای آفتابی تضادی ندارد." },
        { "text": "because", "isCorrect": False, "explanationFa": "قدم زدن علت تابیدن خورشید نیست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "having fun",
        "promptFa": "عبارت جذاب‌تر برای لذت بردن از لحظات انتخاب کن:",
        "upgrades": [
          { "text": "enjoying our time", "isCorrect": True, "explanationFa": "enjoying our time یعنی حسابی لذت بردن از اوقات." },
          { "text": "working hard", "isCorrect": False, "explanationFa": "متضاد مفهوم تعطیلات و استراحت است." }
        ]
      }
    },
    "round3": {
      "id": "w-a1-8-r3",
      "roundTitleFa": "تایپ پایان کارت‌پستال",
      "briefFa": "عبارت معروف پایان کارت‌پستال را تایپ کن:",
      "briefEn": "Type the classic postcard longing phrase:",
      "templateSentence": "Wish you were [___]!",
      "targetBlank": "here",
      "acceptableAnswers": ["here"],
      "typingHintFa": "کلمه به معنی «اینجا» (h-e-r-e).",
      "explanationFa": "Wish you were here! یعنی «کاش اینجا بودی!» که امضای مشهور کارت‌پستال است.",
      "quickChips": ["here", "there", "well"]
    }
  },
  {
    "levelNumber": 9,
    "cefr": "A1",
    "theme": "word-bot-factory",
    "themeTitleFa": "کارخانه روبات‌های کلمه‌ساز",
    "caseCode": "BOT-A1-09",
    "stageTitleEn": "Lost Robot Notice: Physical Descriptions",
    "stageTitleFa": "آگهی ربات گمشده: توصیف ویژگی‌های ظاهری",
    "scenarioFa": "یک ربات آزمایشگاهی کوچولو در محوطه گمشده. باید مشخصات ظاهری‌اش را دقیق بنویسی تا پیدایش کنند.",
    "locationFa": "تابلوی اعلانات شهر ربات‌ها",
    "pillar": "word-order-punctuation",
    "xpReward": 100,
    "timeLimitSeconds": 75,
    "round1": {
      "id": "w-a1-9-r1",
      "roundTitleFa": "چیدمان مشخصات ظاهری",
      "promptFa": "کارت‌ها را بچین تا رنگ و چرخ‌های ربات گمشده را توصیف کنی:",
      "promptEn": "Describe the missing bot's appearance:",
      "hintFa": "فاعل It + has + صفت‌ها + اسم اعضای بدن.",
      "goldenRuleFa": "نکته طلایی: It has silver wheels and green eyes.",
      "scrambledChips": [
        { "id": "c1", "text": "It" },
        { "id": "c2", "text": "has" },
        { "id": "c3", "text": "silver" },
        { "id": "c4", "text": "wheels" },
        { "id": "c5", "text": "and" },
        { "id": "c6", "text": "green" },
        { "id": "c7", "text": "eyes." },
        { "id": "d1", "text": "have", "isDistractor": True, "distractorReasonFa": "برای ضمیر It باید has به کار ببریم." }
      ],
      "correctSequence": ["It", "has", "silver", "wheels", "and", "green", "eyes."],
      "assembledSentence": "It has silver wheels and green eyes."
    },
    "round2": {
      "id": "w-a1-9-r2",
      "roundTitleFa": "هشدار رفتار ربات",
      "contextFa": "ربات آرام است اما اگر بترسد بوق می‌زند:",
      "sentenceA": "The little bot is quiet",
      "sentenceB": "it beeps when scared.",
      "targetSlot": "The little bot is quiet, [___] it beeps when scared.",
      "connectorOptions": [
        { "text": "but", "isCorrect": True, "explanationFa": "کلمه but استثنا و تضاد را بیان می‌کند." },
        { "text": "and", "isCorrect": False, "explanationFa": "but برای نشان دادن شرایط تغییر رفتار مناسب‌تر است." },
        { "text": "because", "isCorrect": False, "explanationFa": "بوق زدن علت آرام بودن نیست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "nice",
        "promptFa": "کلمه دقیق‌تر برای توصیف اخلاق ربات انتخاب کن:",
        "upgrades": [
          { "text": "gentle", "isCorrect": True, "explanationFa": "gentle یعنی آرام، ملایم و بی‌آزار." },
          { "text": "angry", "isCorrect": False, "explanationFa": "angry متضاد است." }
        ]
      }
    },
    "round3": {
      "id": "w-a1-9-r3",
      "roundTitleFa": "تایپ شماره تماس",
      "briefFa": "فعل تماس گرفتن را تایپ کن:",
      "briefEn": "Type the verb for calling someone by phone:",
      "templateSentence": "Please [___] our lab immediately.",
      "targetBlank": "call",
      "acceptableAnswers": ["call", "contact", "ring"],
      "typingHintFa": "فعل چهار حرفی به معنی زنگ زدن (c-a-l-l).",
      "explanationFa": "Please call our lab یعنی لطفاً با آزمایشگاه ما تماس بگیرید.",
      "quickChips": ["call", "help", "visit"]
    }
  },
  {
    "levelNumber": 10,
    "cefr": "A1",
    "theme": "word-bot-factory",
    "themeTitleFa": "کارخانه روبات‌های کلمه‌ساز",
    "caseCode": "BOT-A1-10",
    "stageTitleEn": "Boss Case: Factory Graduation Diploma",
    "stageTitleFa": "غول مرحله آخر: دیپلم افتخار کارخانه ربات‌ها",
    "scenarioFa": "پرونده بزرگ فارغ‌التحصیلی! باید سند پایانی معرفی ربات را کامل بنویسی تا جام طلایی سطح A1 را ببری و کلید سطح A2 را باز کنی!",
    "locationFa": "تالار افتخارات کارخانه",
    "pillar": "master-investigation",
    "xpReward": 150,
    "timeLimitSeconds": 90,
    "isBossStage": True,
    "round1": {
      "id": "w-a1-10-r1",
      "roundTitleFa": "چیدمان بیانیه افتخار",
      "promptFa": "کارت‌های بیانیه رسمی ربات برتر را به ترتیب درست بچین:",
      "promptEn": "Assemble the master graduation declaration:",
      "hintFa": "جمله با فاعل I شروع می‌شود، با am ready ادامه می‌یابد.",
      "goldenRuleFa": "نکته طلایی: I am ready to explore the world.",
      "scrambledChips": [
        { "id": "c1", "text": "I" },
        { "id": "c2", "text": "am" },
        { "id": "c3", "text": "ready" },
        { "id": "c4", "text": "to" },
        { "id": "c5", "text": "explore" },
        { "id": "c6", "text": "the" },
        { "id": "c7", "text": "world." },
        { "id": "d1", "text": "is", "isDistractor": True, "distractorReasonFa": "با ضمیر I فعل am می‌آید نه is!" }
      ],
      "correctSequence": ["I", "am", "ready", "to", "explore", "the", "world."],
      "assembledSentence": "I am ready to explore the world."
    },
    "round2": {
      "id": "w-a1-10-r2",
      "roundTitleFa": "پیوند دو افتخار بزرگ",
      "contextFa": "ربات آموزش را تمام کرده و آماده مأموریت بعدی است:",
      "sentenceA": "I completed my training",
      "sentenceB": "now I hold the golden key.",
      "targetSlot": "I completed my training, [___] now I hold the golden key.",
      "connectorOptions": [
        { "text": "and", "isCorrect": True, "explanationFa": "کلمه and دو دستاورد مثبت را به زیبایی کنار هم می‌نشاند." },
        { "text": "but", "isCorrect": False, "explanationFa": "تضادی وجود ندارد." },
        { "text": "or", "isCorrect": False, "explanationFa": "این دو هم‌زمان اتفاق افتاده‌اند." }
      ],
      "lexicalUpgrade": {
        "originalWord": "happy",
        "promptFa": "کلمه مغرورانه و درخشان برای یک ربات پیروز انتخاب کن:",
        "upgrades": [
          { "text": "proud", "isCorrect": True, "explanationFa": "proud یعنی سربلند و مفتخر." },
          { "text": "tired", "isCorrect": False, "explanationFa": "tired یعنی خسته که مناسب جشن نیست." }
        ]
      }
    },
    "round3": {
      "id": "w-a1-10-r3",
      "roundTitleFa": "تایپ رمز گاوصندوق جام طلایی",
      "briefFa": "جمله سوگند کارآگاهی ربات را تایپ کن:",
      "briefEn": "Type the master oath word to unlock the trophy safe:",
      "templateSentence": "I promise to write every day with [___].",
      "targetBlank": "care",
      "acceptableAnswers": ["care", "joy", "pride"],
      "typingHintFa": "کلمه ۴ حرفی به معنای دقت و مراقبت (c-a-r-e).",
      "explanationFa": "with care یعنی با دقت و توجه کامل.",
      "quickChips": ["care", "pride", "speed"]
    }
  }
]

# We will populate A2_CASES similarly
A2_CASES = [
  {
    "levelNumber": 1,
    "cefr": "A2",
    "theme": "word-bot-factory",
    "themeTitleFa": "کارخانه روبات‌های کلمه‌ساز",
    "caseCode": "BOT-A2-01",
    "stageTitleEn": "Past Memories: Yesterday's Shift Log",
    "stageTitleFa": "خاطرات گذشته: گزارش شیفت کاری دیروز",
    "scenarioFa": "ربات نگهبان دیشب اتفاق عجیبی را ثبت کرده. باید گزارش اتفاقات گذشته را با افعال باقاعده و بی‌قاعده زمان گذشته بنویسی.",
    "locationFa": "اتاق حراست کارخانه",
    "pillar": "word-order-punctuation",
    "xpReward": 90,
    "timeLimitSeconds": 70,
    "round1": {
      "id": "w-a2-1-r1",
      "roundTitleFa": "چیدمان گزارش گذشته",
      "promptFa": "کارت‌ها را بچین تا بگویی دیشب چه کسی وارد کارخانه شد:",
      "promptEn": "Form the past simple report statement:",
      "hintFa": "در گذشته ساده، فعل به حالت گذشته می‌رود (visited / arrived).",
      "goldenRuleFa": "نکته طلایی: A mysterious visitor arrived at midnight.",
      "scrambledChips": [
        { "id": "c1", "text": "A" },
        { "id": "c2", "text": "visitor" },
        { "id": "c3", "text": "arrived" },
        { "id": "c4", "text": "at" },
        { "id": "c5", "text": "the" },
        { "id": "c6", "text": "gate." },
        { "id": "d1", "text": "arrive", "isDistractor": True, "distractorReasonFa": "چون اتفاق در گذشته افتاده باید arrived باشد نه arrive!" }
      ],
      "correctSequence": ["A", "visitor", "arrived", "at", "the", "gate."],
      "assembledSentence": "A visitor arrived at the gate."
    },
    "round2": {
      "id": "w-a2-1-r2",
      "roundTitleFa": "توالی زمانی گذشته",
      "contextFa": "بازدیدکننده ابتدا در زد و سپس داخل شد:",
      "sentenceA": "The man knocked on the door",
      "sentenceB": "he stepped inside.",
      "targetSlot": "The man knocked on the door [___] he stepped inside.",
      "connectorOptions": [
        { "text": "before", "isCorrect": True, "explanationFa": "before یعنی «قبل از اینکه» و تقدم و تاخر اعمال را نشان می‌دهد." },
        { "text": "although", "isCorrect": False, "explanationFa": "تضادی وجود ندارد." },
        { "text": "because", "isCorrect": False, "explanationFa": "در زدن علت وارد شدن نیست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "went",
        "promptFa": "فعل گذشته شیک‌تر برای وارد شدن انتخاب کن:",
        "upgrades": [
          { "text": "entered", "isCorrect": True, "explanationFa": "entered یعنی رسماً وارد شد." },
          { "text": "slept", "isCorrect": False, "explanationFa": "slept یعنی خوابید که بی‌ربط است." }
        ]
      }
    },
    "round3": {
      "id": "w-a2-1-r3",
      "roundTitleFa": "تایپ قید زمان گذشته",
      "briefFa": "قید زمان به معنی «دیروز» را تایپ کن:",
      "briefEn": "Type the key past adverb:",
      "templateSentence": "The inspection happened [___].",
      "targetBlank": "yesterday",
      "acceptableAnswers": ["yesterday"],
      "typingHintFa": "کلمه ۹ حرفی برای دیروز (y-e-s-t-e-r-d-a-y).",
      "explanationFa": "yesterday نشانه واضح زمان گذشته ساده است.",
      "quickChips": ["yesterday", "tonight", "soon"]
    }
  },
  {
    "levelNumber": 2,
    "cefr": "A2",
    "theme": "word-bot-factory",
    "themeTitleFa": "کارخانه روبات‌های کلمه‌ساز",
    "caseCode": "BOT-A2-02",
    "stageTitleEn": "Future Plans: 'Going To' Upgrades",
    "stageTitleFa": "برنامه‌های آینده: ساخت جملات با going to",
    "scenarioFa": "مدیران کارخانه می‌خواهند هفته آینده مدل جدیدی از روبات‌ها را بسازند. برنامه‌های آینده را مستند کن.",
    "locationFa": "دفتر طراحی صنعتی",
    "pillar": "word-order-punctuation",
    "xpReward": 95,
    "timeLimitSeconds": 70,
    "round1": {
      "id": "w-a2-2-r1",
      "roundTitleFa": "چیدمان برنامه آینده",
      "promptFa": "کارت‌ها را طوری بچین که نشان دهد قصد ساخت چه چیزی را دارند:",
      "promptEn": "Assemble the intended future project sentence:",
      "hintFa": "فرمول: فاعل + be (am/is/are) + going to + فعل ساده.",
      "goldenRuleFa": "نکته طلایی: We are going to build a smart robot.",
      "scrambledChips": [
        { "id": "c1", "text": "We" },
        { "id": "c2", "text": "are" },
        { "id": "c3", "text": "going" },
        { "id": "c4", "text": "to" },
        { "id": "c5", "text": "build" },
        { "id": "c6", "text": "a" },
        { "id": "c7", "text": "drone." },
        { "id": "d1", "text": "is", "isDistractor": True, "distractorReasonFa": "با فاعل We باید are بیاید نه is!" }
      ],
      "correctSequence": ["We", "are", "going", "to", "build", "a", "drone."],
      "assembledSentence": "We are going to build a drone."
    },
    "round2": {
      "id": "w-a2-2-r2",
      "roundTitleFa": "هدف آینده",
      "contextFa": "آن‌ها قصد دارند پهپاد بسازند تا محموله‌ها سریع‌تر جابجا شوند:",
      "sentenceA": "We will launch the drone",
      "sentenceB": "it delivers packages faster.",
      "targetSlot": "We will launch the drone [___] it delivers packages faster.",
      "connectorOptions": [
        { "text": "so that", "isCorrect": True, "explanationFa": "so that یعنی «تا اینکه / به این منظور که» و هدف کار را بیان می‌کند." },
        { "text": "but", "isCorrect": False, "explanationFa": "تضادی در کار نیست." },
        { "text": "unless", "isCorrect": False, "explanationFa": "unless یعنی مگر اینکه و شرط منفی است." }
      ],
      "lexicalUpgrade": {
        "originalWord": "make",
        "promptFa": "فعل مهندسی‌تر به جای ساختن معمولی انتخاب کن:",
        "upgrades": [
          { "text": "construct", "isCorrect": True, "explanationFa": "construct یعنی ساختن اصولی و مهندسی." },
          { "text": "break", "isCorrect": False, "explanationFa": "متضاد است." }
        ]
      }
    },
    "round3": {
      "id": "w-a2-2-r3",
      "roundTitleFa": "تایپ زمان آینده",
      "briefFa": "کلمه به معنی «فردا» را تایپ کن:",
      "briefEn": "Type the tomorrow keyword:",
      "templateSentence": "The presentation starts [___].",
      "targetBlank": "tomorrow",
      "acceptableAnswers": ["tomorrow"],
      "typingHintFa": "کلمه ۸ حرفی فردا (t-o-m-o-r-r-o-w).",
      "explanationFa": "tomorrow برای آینده نزدیک است.",
      "quickChips": ["tomorrow", "later", "daily"]
    }
  },
  {
    "levelNumber": 3,
    "cefr": "A2",
    "theme": "word-bot-factory",
    "themeTitleFa": "کارخانه روبات‌های کلمه‌ساز",
    "caseCode": "BOT-A2-03",
    "stageTitleEn": "Comparing Models: Comparatives & Superlatives",
    "stageTitleFa": "مقایسه مدل‌ها: صفت‌های تفضیلی و عالی",
    "scenarioFa": "کاتالوگ مقایسه ربات‌ها باید نوشته شود: کدام مدل سریع‌تر است؟ کدام مدل قوی‌ترین است؟",
    "locationFa": "واحد سنجش کیفیت",
    "pillar": "word-order-punctuation",
    "xpReward": 100,
    "timeLimitSeconds": 75,
    "round1": {
      "id": "w-a2-3-r1",
      "roundTitleFa": "چیدمان جمله مقایسه‌ای",
      "promptFa": "کارت‌ها را بچین تا بگویی مدل A سریع‌تر از مدل B است:",
      "promptEn": "Form the comparative sentence between two robot models:",
      "hintFa": "صفت کوتاه + er + than: faster than.",
      "goldenRuleFa": "نکته طلایی: Model A is faster than Model B.",
      "scrambledChips": [
        { "id": "c1", "text": "Model" },
        { "id": "c2", "text": "A" },
        { "id": "c3", "text": "is" },
        { "id": "c4", "text": "faster" },
        { "id": "c5", "text": "than" },
        { "id": "c6", "text": "Model" },
        { "id": "c7", "text": "B." },
        { "id": "d1", "text": "then", "isDistractor": True, "distractorReasonFa": "در مقایسه همیشه than می‌آید نه then!" }
      ],
      "correctSequence": ["Model", "A", "is", "faster", "than", "Model", "B."],
      "assembledSentence": "Model A is faster than Model B."
    },
    "round2": {
      "id": "w-a2-3-r2",
      "roundTitleFa": "تضاد در مقایسه",
      "contextFa": "مدل A سریع‌تر است اما مدل B باتری بادوام‌تری دارد:",
      "sentenceA": "Model A is faster",
      "sentenceB": "Model B lasts longer.",
      "targetSlot": "Model A is faster, [___] Model B lasts longer.",
      "connectorOptions": [
        { "text": "however", "isCorrect": True, "explanationFa": "however برای ایجاد تضاد شیک بین دو ویژگی در سطح A2/B1 عالی است." },
        { "text": "because", "isCorrect": False, "explanationFa": "علت و معلول نیستند." },
        { "text": "so", "isCorrect": False, "explanationFa": "ارتباط نتیجه‌ای نیست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "good",
        "promptFa": "صفت برتر به جای good انتخاب کن:",
        "upgrades": [
          { "text": "superior", "isCorrect": True, "explanationFa": "superior یعنی برتر و باکیفیت‌تر." },
          { "text": "cheap", "isCorrect": False, "explanationFa": "cheap یعنی ارزان که لزوماً مثبت نیست." }
        ]
      }
    },
    "round3": {
      "id": "w-a2-3-r3",
      "roundTitleFa": "تایپ صفت عالی",
      "briefFa": "صفت عالی برای کلمه strong را تایپ کن:",
      "briefEn": "Type the superlative form of strong:",
      "templateSentence": "Titan is the [___] machine in our shop.",
      "targetBlank": "strongest",
      "acceptableAnswers": ["strongest"],
      "typingHintFa": "کلمه strong + est (قوی‌ترین).",
      "explanationFa": "the strongest یعنی قوی‌ترین.",
      "quickChips": ["strongest", "faster", "best"]
    }
  },
  {
    "levelNumber": 4,
    "cefr": "A2",
    "theme": "word-bot-factory",
    "themeTitleFa": "کارخانه روبات‌های کلمه‌ساز",
    "caseCode": "BOT-A2-04",
    "stageTitleEn": "Polite Requests: Could & Would You Mind",
    "stageTitleFa": "درخواست‌های محترمانه: نامه‌نگاری با could",
    "scenarioFa": "ربات منشی باید یک ایمیل محترمانه به بازرس شهر بزند و تقاضای بازدید دوباره کند.",
    "locationFa": "دفتر روابط عمومی",
    "pillar": "paragraph-register",
    "xpReward": 105,
    "timeLimitSeconds": 75,
    "round1": {
      "id": "w-a2-4-r1",
      "roundTitleFa": "چیدمان تقاضای محترمانه",
      "promptFa": "کارت‌ها را بچین تا درخواستی محترمانه برای ارسال کاتالوگ بسازی:",
      "promptEn": "Form a polite request using modal 'Could':",
      "hintFa": "Could you please + فعل ساده + مفعول؟",
      "goldenRuleFa": "نکته طلایی: Could you please send the report?",
      "scrambledChips": [
        { "id": "c1", "text": "Could" },
        { "id": "c2", "text": "you" },
        { "id": "c3", "text": "please" },
        { "id": "c4", "text": "send" },
        { "id": "c5", "text": "the" },
        { "id": "c6", "text": "report?" },
        { "id": "d1", "text": "sending", "isDistractor": True, "distractorReasonFa": "بعد از could you please فعل ساده می‌آید نه ing دار!" }
      ],
      "correctSequence": ["Could", "you", "please", "send", "the", "report?"],
      "assembledSentence": "Could you please send the report?"
    },
    "round2": {
      "id": "w-a2-4-r2",
      "roundTitleFa": "شرط محترمانه",
      "contextFa": "اگر وقت دارید، فردا بیایید:",
      "sentenceA": "Please visit us tomorrow",
      "sentenceB": "you have free time.",
      "targetSlot": "Please visit us tomorrow [___] you have free time.",
      "connectorOptions": [
        { "text": "if", "isCorrect": True, "explanationFa": "if یعنی اگر و شرط انجام کار را تعیین می‌کند." },
        { "text": "although", "isCorrect": False, "explanationFa": "تضادی در کار نیست." },
        { "text": "so", "isCorrect": False, "explanationFa": "ارتباط شرطی است نه نتیجه‌ای." }
      ],
      "lexicalUpgrade": {
        "originalWord": "tell me",
        "promptFa": "عبارت اداری‌تر برای در جریان گذاشتن انتخاب کن:",
        "upgrades": [
          { "text": "inform me", "isCorrect": True, "explanationFa": "inform me یعنی مرا مطلع سازید." },
          { "text": "shout", "isCorrect": False, "explanationFa": "shout یعنی فریاد زدن!" }
        ]
      }
    },
    "round3": {
      "id": "w-a2-4-r3",
      "roundTitleFa": "تایپ عبارت سپاسگزاری",
      "briefFa": "عبارت پیشاپیش سپاسگزارم را تایپ کن:",
      "briefEn": "Type the advance gratitude adverb:",
      "templateSentence": "Thank you in [___] for your help.",
      "targetBlank": "advance",
      "acceptableAnswers": ["advance"],
      "typingHintFa": "کلمه ۷ حرفی به معنی جلو / پیشاپیش (a-d-v-a-n-c-e).",
      "explanationFa": "Thank you in advance یعنی پیشاپیش سپاسگزارم.",
      "quickChips": ["advance", "time", "return"]
    }
  },
  {
    "levelNumber": 5,
    "cefr": "A2",
    "theme": "word-bot-factory",
    "themeTitleFa": "کارخانه روبات‌های کلمه‌ساز",
    "caseCode": "BOT-A2-05",
    "stageTitleEn": "Giving Directions: Navigating the Plant",
    "stageTitleFa": "آدرس دادن در محوطه کارخانه: حروف اضافه جهت",
    "scenarioFa": "یک مهندس تازه‌کار مسیر اتاق سرور را گم کرده. دستورالعمل جهت‌یابی گام‌به‌گام برایش بنویس.",
    "locationFa": "راهروی مرکزی کارخانه",
    "pillar": "paragraph-register",
    "xpReward": 110,
    "timeLimitSeconds": 75,
    "round1": {
      "id": "w-a2-5-r1",
      "roundTitleFa": "چیدمان جهت دادن",
      "promptFa": "کارت‌ها را بچین تا بگویی مستقیم برو و بعد به راست بپیچ:",
      "promptEn": "Assemble the direction instruction:",
      "hintFa": "فعل‌های امری: Go straight, then turn right.",
      "goldenRuleFa": "نکته طلایی: Go straight and turn right at the corner.",
      "scrambledChips": [
        { "id": "c1", "text": "Go" },
        { "id": "c2", "text": "straight" },
        { "id": "c3", "text": "and" },
        { "id": "c4", "text": "turn" },
        { "id": "c5", "text": "left" },
        { "id": "c6", "text": "at" },
        { "id": "c7", "text": "the" },
        { "id": "c8", "text": "hall." },
        { "id": "d1", "text": "going", "isDistractor": True, "distractorReasonFa": "جملات امری آدرس‌دهی با فعل ساده شروع می‌شوند نه ing دار!" }
      ],
      "correctSequence": ["Go", "straight", "and", "turn", "left", "at", "the", "hall."],
      "assembledSentence": "Go straight and turn left at the hall."
    },
    "round2": {
      "id": "w-a2-5-r2",
      "roundTitleFa": "ترتیب گام دوم",
      "contextFa": "وقتی به آسانسور رسیدی، دکمه طبقه دوم را بزن:",
      "sentenceA": "Walk past the elevator",
      "sentenceB": "press the top button.",
      "targetSlot": "Walk past the elevator [___] press the top button.",
      "connectorOptions": [
        { "text": "and then", "isCorrect": True, "explanationFa": "and then یعنی «و سپس» و برای گام‌های پیاپی عالی است." },
        { "text": "because", "isCorrect": False, "explanationFa": "قدم زدن علت دکمه زدن نیست." },
        { "text": "but", "isCorrect": False, "explanationFa": "تضادی وجود ندارد." }
      ],
      "lexicalUpgrade": {
        "originalWord": "near",
        "promptFa": "حرف اضافه دقیق‌تر برای روبه‌روی هم بودن انتخاب کن:",
        "upgrades": [
          { "text": "opposite", "isCorrect": True, "explanationFa": "opposite یعنی دقیقاً روبه‌رو." },
          { "text": "behind", "isCorrect": False, "explanationFa": "behind یعنی پشت سر." }
        ]
      }
    },
    "round3": {
      "id": "w-a2-5-r3",
      "roundTitleFa": "تایپ مقصد نهایی",
      "briefFa": "کلمه به معنی «مستقیم» را تایپ کن:",
      "briefEn": "Type the adverb meaning straight ahead:",
      "templateSentence": "Continue [___] until you see the blue door.",
      "targetBlank": "straight",
      "acceptableAnswers": ["straight", "forward"],
      "typingHintFa": "کلمه ۸ حرفی مستقیم (s-t-r-a-i-g-h-t).",
      "explanationFa": "Continue straight یعنی مستقیم ادامه بده.",
      "quickChips": ["straight", "back", "away"]
    }
  },
  {
    "levelNumber": 6,
    "cefr": "A2",
    "theme": "word-bot-factory",
    "themeTitleFa": "کارخانه روبات‌های کلمه‌ساز",
    "caseCode": "BOT-A2-06",
    "stageTitleEn": "Product Review: Giving Opinions",
    "stageTitleFa": "نقد و بررسی محصول: بیان نظر شخصی",
    "scenarioFa": "کاربران به ربات دستیار خانگی نظر داده‌اند. باید نقد کوتاه و منصفانه‌ای درباره کارکرد آن بنویسی.",
    "locationFa": "بخش بازخورد مشتریان",
    "pillar": "paragraph-register",
    "xpReward": 115,
    "timeLimitSeconds": 80,
    "round1": {
      "id": "w-a2-6-r1",
      "roundTitleFa": "چیدمان نظر شخصی",
      "promptFa": "کارت‌ها را بچین تا نظرت را با In my opinion بیان کنی:",
      "promptEn": "Form the opinion opening clause:",
      "hintFa": "In my opinion, + جمله کامل.",
      "goldenRuleFa": "نکته طلایی: In my opinion, this device is very useful.",
      "scrambledChips": [
        { "id": "c1", "text": "In" },
        { "id": "c2", "text": "my" },
        { "id": "c3", "text": "opinion," },
        { "id": "c4", "text": "it" },
        { "id": "c5", "text": "is" },
        { "id": "c6", "text": "very" },
        { "id": "c7", "text": "useful." },
        { "id": "d1", "text": "to", "isDistractor": True, "distractorReasonFa": "عبارت درست In my opinion است نه To my opinion!" }
      ],
      "correctSequence": ["In", "my", "opinion,", "it", "is", "very", "useful."],
      "assembledSentence": "In my opinion, it is very useful."
    },
    "round2": {
      "id": "w-a2-6-r2",
      "roundTitleFa": "بیان نکته منفی در کنار مثبت",
      "contextFa": "دستگاه مفید است اما قیمتش کمی بالاست:",
      "sentenceA": "The device works smoothly",
      "sentenceB": "it is somewhat expensive.",
      "targetSlot": "The device works smoothly; [___], it is somewhat expensive.",
      "connectorOptions": [
        { "text": "however", "isCorrect": True, "explanationFa": "however برای ایجاد تعادل بین نقد مثبت و منفی به کار می‌رود." },
        { "text": "because", "isCorrect": False, "explanationFa": "قیمت بالا علت روان کار کردن نیست." },
        { "text": "therefore", "isCorrect": False, "explanationFa": "ارتباط نتیجه‌ای نیست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "bad",
        "promptFa": "کلمه فنی‌تر به جای خراب بودن انتخاب کن:",
        "upgrades": [
          { "text": "faulty", "isCorrect": True, "explanationFa": "faulty یعنی دارای نقص فنی." },
          { "text": "cold", "isCorrect": False, "explanationFa": "cold یعنی سرد!" }
        ]
      }
    },
    "round3": {
      "id": "w-a2-6-r3",
      "roundTitleFa": "تایپ پیشنهاد نهایی",
      "briefFa": "فعل به معنی «توصیه می‌کنم» را تایپ کن:",
      "briefEn": "Type the recommendation verb:",
      "templateSentence": "I [___] this model to all students.",
      "targetBlank": "recommend",
      "acceptableAnswers": ["recommend", "suggest"],
      "typingHintFa": "فعل ۹ حرفی توصیه کردن (r-e-c-o-m-m-e-n-d).",
      "explanationFa": "I recommend this یعنی من این را پیشنهاد می‌کنم.",
      "quickChips": ["recommend", "suggest", "order"]
    }
  },
  {
    "levelNumber": 7,
    "cefr": "A2",
    "theme": "word-bot-factory",
    "themeTitleFa": "کارخانه روبات‌های کلمه‌ساز",
    "caseCode": "BOT-A2-07",
    "stageTitleEn": "Incident Report: Explaining Problems",
    "stageTitleFa": "گزارش حادثه فنی: توضیح علل بروز نقص",
    "scenarioFa": "دیروز یکی از بازوهای مکانیکی متوقف شده. گزارش مختصری از علت حادثه و راه‌حل برطرف کردن آن بنویس.",
    "locationFa": "ایستگاه تعمیرات فوری",
    "pillar": "connectors-cohesion",
    "xpReward": 120,
    "timeLimitSeconds": 80,
    "round1": {
      "id": "w-a2-7-r1",
      "roundTitleFa": "چیدمان علت توقف",
      "promptFa": "کارت‌ها را بچین تا علت خاموشی موتور را توضیح دهی:",
      "promptEn": "Assemble the machine stoppage statement:",
      "hintFa": "The motor stopped because it got too hot.",
      "goldenRuleFa": "نکته طلایی: The motor stopped because it overheated.",
      "scrambledChips": [
        { "id": "c1", "text": "The" },
        { "id": "c2", "text": "motor" },
        { "id": "c3", "text": "stopped" },
        { "id": "c4", "text": "because" },
        { "id": "c5", "text": "it" },
        { "id": "c6", "text": "became" },
        { "id": "c7", "text": "hot." },
        { "id": "d1", "text": "stops", "isDistractor": True, "distractorReasonFa": "حادثه در گذشته اتفاق افتاده و فعل باید stopped باشد." }
      ],
      "correctSequence": ["The", "motor", "stopped", "because", "it", "became", "hot."],
      "assembledSentence": "The motor stopped because it became hot."
    },
    "round2": {
      "id": "w-a2-7-r2",
      "roundTitleFa": "نتیجه و اقدام",
      "contextFa": "موتور داغ کرد بنابراین برق را قطع کردیم:",
      "sentenceA": "The temperature rose quickly",
      "sentenceB": "we turned off the power.",
      "targetSlot": "The temperature rose quickly, [___] we turned off the power.",
      "connectorOptions": [
        { "text": "so", "isCorrect": True, "explanationFa": "so نتیجه مستقیم بالا رفتن دما را نشان می‌دهد." },
        { "text": "although", "isCorrect": False, "explanationFa": "تضادی وجود ندارد." },
        { "text": "but", "isCorrect": False, "explanationFa": "خاموش کردن برق نتیجه منطقی است نه متناقض." }
      ],
      "lexicalUpgrade": {
        "originalWord": "fix",
        "promptFa": "فعل رسمی‌تر برای تعمیر اساسی انتخاب کن:",
        "upgrades": [
          { "text": "repair", "isCorrect": True, "explanationFa": "repair یعنی تعمیر تخصصی." },
          { "text": "break", "isCorrect": False, "explanationFa": "متضاد است." }
        ]
      }
    },
    "round3": {
      "id": "w-a2-7-r3",
      "roundTitleFa": "تایپ هشدار ایمنی",
      "briefFa": "صفت به معنی «ایمن» را تایپ کن:",
      "briefEn": "Type the adjective meaning free from danger:",
      "templateSentence": "The workplace is now completely [___].",
      "targetBlank": "safe",
      "acceptableAnswers": ["safe", "secure"],
      "typingHintFa": "کلمه ۴ حرفی ایمن (s-a-f-e).",
      "explanationFa": "completely safe یعنی کاملاً ایمن و بی‌خطر.",
      "quickChips": ["safe", "clean", "open"]
    }
  },
  {
    "levelNumber": 8,
    "cefr": "A2",
    "theme": "word-bot-factory",
    "themeTitleFa": "کارخانه روبات‌های کلمه‌ساز",
    "caseCode": "BOT-A2-08",
    "stageTitleEn": "Formal Invitation: Factory Open Day",
    "stageTitleFa": "دعوت‌نامه رسمی: روز بازدید باز از کارخانه",
    "scenarioFa": "کارخانه می‌خواهد میزبان دانش‌آموزان شهر باشد. متن یک دعوت‌نامه رسمی با ذکر تاریخ، ساعت و برنامه آماده کن.",
    "locationFa": "تالار همایش‌های کارخانه",
    "pillar": "paragraph-register",
    "xpReward": 125,
    "timeLimitSeconds": 80,
    "round1": {
      "id": "w-a2-8-r1",
      "roundTitleFa": "چیدمان دعوت رسمی",
      "promptFa": "کارت‌ها را بچین تا جمله خوش‌آمدگویی و دعوت را بسازی:",
      "promptEn": "Form the formal invitation sentence:",
      "hintFa": "We are pleased to invite you to + نام رویداد.",
      "goldenRuleFa": "نکته طلایی: We invite you to our annual exhibition.",
      "scrambledChips": [
        { "id": "c1", "text": "We" },
        { "id": "c2", "text": "cordially" },
        { "id": "c3", "text": "invite" },
        { "id": "c4", "text": "you" },
        { "id": "c5", "text": "to" },
        { "id": "c6", "text": "our" },
        { "id": "c7", "text": "science" },
        { "id": "c8", "text": "fair." },
        { "id": "d1", "text": "inviting", "isDistractor": True, "distractorReasonFa": "فعل اصلی invite ساده است نه ing دار." }
      ],
      "correctSequence": ["We", "cordially", "invite", "you", "to", "our", "science", "fair."],
      "assembledSentence": "We cordially invite you to our science fair."
    },
    "round2": {
      "id": "w-a2-8-r2",
      "roundTitleFa": "شرط ثبت‌نام",
      "contextFa": "ورود رایگان است به شرطی که از قبل ثبت‌نام کرده باشید:",
      "sentenceA": "Admission is completely free",
      "sentenceB": "you must register online.",
      "targetSlot": "Admission is completely free; [___], you must register online.",
      "connectorOptions": [
        { "text": "however", "isCorrect": True, "explanationFa": "however شرط و محدودیت را در کنار مزیت رایگان بودن نشان می‌دهد." },
        { "text": "because", "isCorrect": False, "explanationFa": "ثبت‌نام علت رایگان بودن نیست." },
        { "text": "so", "isCorrect": False, "explanationFa": "ارتباط مستقیم نتیجه‌ای نیست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "come",
        "promptFa": "فعل رسمی‌تر برای حضور پیدا کردن انتخاب کن:",
        "upgrades": [
          { "text": "attend", "isCorrect": True, "explanationFa": "attend یعنی شرکت کردن در رویداد یا جلسه." },
          { "text": "watch", "isCorrect": False, "explanationFa": "watch یعنی تماشا کردن." }
        ]
      }
    },
    "round3": {
      "id": "w-a2-8-r3",
      "roundTitleFa": "تایپ مهلت ثبت‌نام",
      "briefFa": "حرف اضافه به معنی «تا قبل از» تاریخ را تایپ کن:",
      "briefEn": "Type the deadline preposition:",
      "templateSentence": "Please reply [___] Friday morning.",
      "targetBlank": "by",
      "acceptableAnswers": ["by", "before"],
      "typingHintFa": "حرف اضافه دو حرفی موعد مقرر (b-y).",
      "explanationFa": "by Friday یعنی حداکثر تا روز جمعه.",
      "quickChips": ["by", "at", "on"]
    }
  },
  {
    "levelNumber": 9,
    "cefr": "A2",
    "theme": "word-bot-factory",
    "themeTitleFa": "کارخانه روبات‌های کلمه‌ساز",
    "caseCode": "BOT-A2-09",
    "stageTitleEn": "Diary Entry: The Night Shift Discovery",
    "stageTitleFa": "یادداشت روزانه: کشف راز شیفت شب",
    "scenarioFa": "کارآموز جوان خاطرات شیفت شب را می‌نویسد: صدایی از انبار قدیمی آمد و راز یک اختراع قدیمی برملا شد.",
    "locationFa": "بایگانی اسناد کارخانه",
    "pillar": "connectors-cohesion",
    "xpReward": 130,
    "timeLimitSeconds": 85,
    "round1": {
      "id": "w-a2-9-r1",
      "roundTitleFa": "چیدمان یادداشت روزانه",
      "promptFa": "کارت‌ها را بچین تا شروع یادداشت راز شبانه را بنویسی:",
      "promptEn": "Form the diary reflection opening sentence:",
      "hintFa": "While I was working, I heard a strange sound.",
      "goldenRuleFa": "نکته طلایی: While I was walking, I found a hidden key.",
      "scrambledChips": [
        { "id": "c1", "text": "While" },
        { "id": "c2", "text": "I" },
        { "id": "c3", "text": "was" },
        { "id": "c4", "text": "walking," },
        { "id": "c5", "text": "I" },
        { "id": "c6", "text": "found" },
        { "id": "c7", "text": "a" },
        { "id": "c8", "text": "key." },
        { "id": "d1", "text": "find", "isDistractor": True, "distractorReasonFa": "عمل در گذشته کامل شده و باید found باشد." }
      ],
      "correctSequence": ["While", "I", "was", "walking,", "I", "found", "a", "key."],
      "assembledSentence": "While I was walking, I found a key."
    },
    "round2": {
      "id": "w-a2-9-r2",
      "roundTitleFa": "پیوند کنجکاوی و ترس",
      "contextFa": "من کمی ترسیده بودم اما کنجکاوی‌ام بیشتر بود:",
      "sentenceA": "I felt a bit nervous",
      "sentenceB": "my curiosity pushed me forward.",
      "targetSlot": "I felt a bit nervous, [___] my curiosity pushed me forward.",
      "connectorOptions": [
        { "text": "yet", "isCorrect": True, "explanationFa": "yet یعنی «با این وجود / اما» و تضاد شاعرانه‌ای می‌سازد." },
        { "text": "because", "isCorrect": False, "explanationFa": "علت احساس نگرانی نبود." },
        { "text": "so", "isCorrect": False, "explanationFa": "نتیجه ترس به جلو رفتن نیست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "old",
        "promptFa": "صفت تاریخی‌تر و پررمزورازتر برای صندوقچه انتخاب کن:",
        "upgrades": [
          { "text": "ancient", "isCorrect": True, "explanationFa": "ancient یعنی بسیار کهن و تاریخی." },
          { "text": "new", "isCorrect": False, "explanationFa": "متضاد است." }
        ]
      }
    },
    "round3": {
      "id": "w-a2-9-r3",
      "roundTitleFa": "تایپ پایان ماجرا",
      "briefFa": "قید به معنی «سرانجام / بالاخره» را تایپ کن:",
      "briefEn": "Type the conclusion transition adverb:",
      "templateSentence": "[___], the mystery was solved.",
      "targetBlank": "Finally",
      "acceptableAnswers": ["Finally", "Eventually"],
      "typingHintFa": "کلمه ۷ حرفی سرانجام (F-i-n-a-l-l-y).",
      "explanationFa": "Finally یعنی در نهایت و پایان کار.",
      "quickChips": ["Finally", "Suddenly", "Always"]
    }
  },
  {
    "levelNumber": 10,
    "cefr": "A2",
    "theme": "word-bot-factory",
    "themeTitleFa": "کارخانه روبات‌های کلمه‌ساز",
    "caseCode": "BOT-A2-10",
    "stageTitleEn": "Master Case: Patent Application Dossier",
    "stageTitleFa": "غول مرحله آخر: ثبت اختراع نهایی ربات هوشمند",
    "scenarioFa": "پرونده ثبت اختراع بین‌المللی آماده ارسال است! با نوشتن شرح کامل نوآوری، برنده جام طلایی A2 شو و مجوز ورود به سازمان بازرسان نوآر B1 را دریافت کن!",
    "locationFa": "دفتر ثبت اختراعات و حقوق نوآوری",
    "pillar": "master-investigation",
    "xpReward": 180,
    "timeLimitSeconds": 95,
    "isBossStage": True,
    "round1": {
      "id": "w-a2-10-r1",
      "roundTitleFa": "چیدمان چکیده ثبت اختراع",
      "promptFa": "کارت‌های چکیده خلاصه اختراع را مرتب کن:",
      "promptEn": "Assemble the official patent summary sentence:",
      "hintFa": "This invention solves the power shortage problem.",
      "goldenRuleFa": "نکته طلایی: This new system provides clean energy efficiently.",
      "scrambledChips": [
        { "id": "c1", "text": "This" },
        { "id": "c2", "text": "new" },
        { "id": "c3", "text": "system" },
        { "id": "c4", "text": "provides" },
        { "id": "c5", "text": "clean" },
        { "id": "c6", "text": "energy" },
        { "id": "c7", "text": "efficiently." },
        { "id": "d1", "text": "provide", "isDistractor": True, "distractorReasonFa": "فاعل This new system مفرد است و فعل حتماً s می‌گیرد." }
      ],
      "correctSequence": ["This", "new", "system", "provides", "clean", "energy", "efficiently."],
      "assembledSentence": "This new system provides clean energy efficiently."
    },
    "round2": {
      "id": "w-a2-10-r2",
      "roundTitleFa": "نتیجه اقتصادی و صنعتی",
      "contextFa": "این سیستم انرژی پاک تولید می‌کند بنابراین هزینه‌ها را نصف می‌کند:",
      "sentenceA": "The device saves battery life",
      "sentenceB": "it cuts operating costs in half.",
      "targetSlot": "The device saves battery life; [___], it cuts operating costs in half.",
      "connectorOptions": [
        { "text": "furthermore", "isCorrect": True, "explanationFa": "furthermore یعنی «علاوه بر این» و مزیت دوم را اضافه می‌کند." },
        { "text": "although", "isCorrect": False, "explanationFa": "تضادی وجود ندارد." },
        { "text": "instead", "isCorrect": False, "explanationFa": "instead یعنی به جای آن که اینجا مناسب نیست." }
      ],
      "lexicalUpgrade": {
        "originalWord": "great idea",
        "promptFa": "عبارت اداری و آکادمیک‌تر برای دستاورد انتخاب کن:",
        "upgrades": [
          { "text": "groundbreaking breakthrough", "isCorrect": True, "explanationFa": "groundbreaking breakthrough یعنی پیشرفت چشمگیر و انقلابی." },
          { "text": "simple trick", "isCorrect": False, "explanationFa": "simple trick شأن علمی اختراع را پایین می‌آورد." }
        ]
      }
    },
    "round3": {
      "id": "w-a2-10-r3",
      "roundTitleFa": "تایپ تاییدیه پایانی دیپلماتیک",
      "briefFa": "کلمه به معنی «تایید شد» را تایپ کن:",
      "briefEn": "Type the official approval status word:",
      "templateSentence": "The patent application is officially [___].",
      "targetBlank": "approved",
      "acceptableAnswers": ["approved", "accepted", "granted"],
      "typingHintFa": "کلمه ۸ حرفی تایید شده (a-p-p-r-o-v-e-d).",
      "explanationFa": "officially approved یعنی رسماً تصویب و تایید شد.",
      "quickChips": ["approved", "closed", "signed"]
    }
  }
]

import type { CefrLevel } from "./types";
import type {
  WritingStageCase,
  DailyBountyMeta,
  WritingTheme,
} from "./writing-clue-types";

// ============================================================================
// A1 CASES: WORD-BOT FACTORY (کارخانه اسباب‌بازی روبات‌ها)
// ============================================================================
export const A1_WRITING_CASES: WritingStageCase[] = [
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
        {
          "id": "c1",
          "text": "My"
        },
        {
          "id": "c2",
          "text": "name"
        },
        {
          "id": "c3",
          "text": "is"
        },
        {
          "id": "c4",
          "text": "Sparky."
        },
        {
          "id": "d1",
          "text": "are",
          "isDistractor": true,
          "distractorReasonFa": "برای اسم مفرد (name) باید از فعل is استفاده کنیم نه are!"
        }
      ],
      "correctSequence": [
        "My",
        "name",
        "is",
        "Sparky."
      ],
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
        {
          "text": "and",
          "isCorrect": true,
          "explanationFa": "کلمه and برای اضافه کردن اطلاعات تکمیلی و هم‌جهت به کار می‌رود."
        },
        {
          "text": "but",
          "isCorrect": false,
          "explanationFa": "کلمه but برای تضاد است، اما اینجا هر دو ویژگی مثبت هستند."
        },
        {
          "text": "because",
          "isCorrect": false,
          "explanationFa": "کلمه because دلیل را بیان می‌کند؛ تند راه رفتن علت داشتن چشم نیست!"
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "nice",
        "promptFa": "یک کلمه شادتر و دقیق‌تر برای توصیف ربات انتخاب کن:",
        "upgrades": [
          {
            "text": "friendly",
            "isCorrect": true,
            "explanationFa": "کلمه friendly یعنی خونگرم و صمیمی که برای ربات مهربان دقیق‌تر است."
          },
          {
            "text": "big",
            "isCorrect": false,
            "explanationFa": "کلمه big یعنی بزرگ و ربطی به مهربانی ربات ندارد."
          }
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
      "acceptableAnswers": [
        "happy",
        "glad",
        "pleased"
      ],
      "typingHintFa": "کلمه انگلیسی به معنی «خوشحال» را تایپ کن (h-a-p-p-y).",
      "explanationFa": "جمله I am happy to meet you یک عبارت مرسوم و دوستانه برای معرفی است.",
      "quickChips": [
        "happy",
        "glad",
        "ready"
      ]
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
        {
          "id": "c1",
          "text": "The"
        },
        {
          "id": "c2",
          "text": "robot"
        },
        {
          "id": "c3",
          "text": "has"
        },
        {
          "id": "c4",
          "text": "a"
        },
        {
          "id": "c5",
          "text": "blue"
        },
        {
          "id": "c6",
          "text": "button."
        },
        {
          "id": "d1",
          "text": "have",
          "isDistractor": true,
          "distractorReasonFa": "فاعل The robot سوم‌شخص مفرد است و باید has بگیرد نه have!"
        }
      ],
      "correctSequence": [
        "The",
        "robot",
        "has",
        "a",
        "blue",
        "button."
      ],
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
        {
          "text": "and",
          "isCorrect": true,
          "explanationFa": "اینجا دو توصیف هم‌زمان با and به هم وصل می‌شوند."
        },
        {
          "text": "so",
          "isCorrect": false,
          "explanationFa": "کلمه so یعنی «بنابراین» و اینجا رابطه علت و معلول نیست."
        },
        {
          "text": "or",
          "isCorrect": false,
          "explanationFa": "کلمه or یعنی «یا» و برای انتخاب بین دو گزینه است."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "small",
        "promptFa": "صفت دقیق‌تری برای یک لامپ خیلی ریز پیدا کن:",
        "upgrades": [
          {
            "text": "tiny",
            "isCorrect": true,
            "explanationFa": "tiny یعنی بسیار کوچک و مینیاتوری."
          },
          {
            "text": "fast",
            "isCorrect": false,
            "explanationFa": "fast به سرعت اشاره دارد نه اندازه."
          }
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
      "acceptableAnswers": [
        "bright",
        "shiny"
      ],
      "typingHintFa": "کلمه به معنای «درخشان و روشن» (b-r-i-g-h-t).",
      "explanationFa": "صفت bright برای لامپ و نور کاملاً طبیعی و استاندارد است.",
      "quickChips": [
        "bright",
        "green",
        "clean"
      ]
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
        {
          "id": "c1",
          "text": "It"
        },
        {
          "id": "c2",
          "text": "cleans"
        },
        {
          "id": "c3",
          "text": "the"
        },
        {
          "id": "c4",
          "text": "floor"
        },
        {
          "id": "c5",
          "text": "every"
        },
        {
          "id": "c6",
          "text": "morning."
        },
        {
          "id": "d1",
          "text": "clean",
          "isDistractor": true,
          "distractorReasonFa": "فاعل It است و فعل حتماً باید s بگیرد (cleans)!"
        }
      ],
      "correctSequence": [
        "It",
        "cleans",
        "the",
        "floor",
        "every",
        "morning."
      ],
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
        {
          "text": "then",
          "isCorrect": true,
          "explanationFa": "کلمه then برای بیان ترتیب کارهای بعدی به کار می‌رود (سپس)."
        },
        {
          "text": "because",
          "isCorrect": false,
          "explanationFa": "کلمه because برای بیان دلیل است."
        },
        {
          "text": "or",
          "isCorrect": false,
          "explanationFa": "کلمه or برای گزینه‌های جایگزین است."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "works",
        "promptFa": "کلمه دقیق‌تری به جای کار کردن عادی انتخاب کن:",
        "upgrades": [
          {
            "text": "operates",
            "isCorrect": true,
            "explanationFa": "operates یعنی با دقت کار می‌کند و فعالیت ماشینی دارد."
          },
          {
            "text": "plays",
            "isCorrect": false,
            "explanationFa": "plays یعنی بازی کردن و برای ماشین نامناسب است."
          }
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
      "acceptableAnswers": [
        "at"
      ],
      "typingHintFa": "حرف اضافه دو حرفی برای night (a-t).",
      "explanationFa": "در انگلیسی همیشه می‌گوییم at night (نه in night).",
      "quickChips": [
        "at",
        "on",
        "in"
      ]
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
        {
          "id": "c1",
          "text": "I"
        },
        {
          "id": "c2",
          "text": "like"
        },
        {
          "id": "c3",
          "text": "fresh"
        },
        {
          "id": "c4",
          "text": "apples"
        },
        {
          "id": "c5",
          "text": "and"
        },
        {
          "id": "c6",
          "text": "oranges."
        },
        {
          "id": "d1",
          "text": "likes",
          "isDistractor": true,
          "distractorReasonFa": "با ضمیر I هرگز از likes با s استفاده نمی‌کنیم!"
        }
      ],
      "correctSequence": [
        "I",
        "like",
        "fresh",
        "apples",
        "and",
        "oranges."
      ],
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
        {
          "text": "but",
          "isCorrect": true,
          "explanationFa": "کلمه but بیانگر تضاد است (اما)."
        },
        {
          "text": "so",
          "isCorrect": false,
          "explanationFa": "کلمه so یعنی «پس، بنابراین» و ارتباط نتیجه‌ای می‌سازد."
        },
        {
          "text": "because",
          "isCorrect": false,
          "explanationFa": "قهوه نخوردن دلیل چای خوردن نیست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "good",
        "promptFa": "صفت اشتهاآورتر برای غذا انتخاب کن:",
        "upgrades": [
          {
            "text": "delicious",
            "isCorrect": true,
            "explanationFa": "delicious یعنی بسیار خوشمزه و لذیذ."
          },
          {
            "text": "cold",
            "isCorrect": false,
            "explanationFa": "cold یعنی سرد که مزه غذا نیست."
          }
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
      "acceptableAnswers": [
        "please"
      ],
      "typingHintFa": "کلمه مودبانه «لطفاً» (p-l-e-a-s-e).",
      "explanationFa": "همیشه در پایان درخواست‌ها از please برای ادب بیشتر استفاده می‌شود.",
      "quickChips": [
        "please",
        "thanks",
        "now"
      ]
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
        {
          "id": "c1",
          "text": "The"
        },
        {
          "id": "c2",
          "text": "wrench"
        },
        {
          "id": "c3",
          "text": "is"
        },
        {
          "id": "c4",
          "text": "on"
        },
        {
          "id": "c5",
          "text": "the"
        },
        {
          "id": "c6",
          "text": "table."
        },
        {
          "id": "d1",
          "text": "in",
          "isDistractor": true,
          "distractorReasonFa": "روی میز on the table است، in یعنی درون کشو یا جعبه!"
        }
      ],
      "correctSequence": [
        "The",
        "wrench",
        "is",
        "on",
        "the",
        "table."
      ],
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
        {
          "text": "and",
          "isCorrect": true,
          "explanationFa": "برای پیوند دو مشاهده مکانی از and استفاده می‌شود."
        },
        {
          "text": "because",
          "isCorrect": false,
          "explanationFa": "اینجا دلیلی آورده نشده است."
        },
        {
          "text": "but",
          "isCorrect": false,
          "explanationFa": "تضادی بین دو گزاره وجود ندارد."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "near",
        "promptFa": "عبارت دقیق‌تر برای چسبیده بودن انتخاب کن:",
        "upgrades": [
          {
            "text": "beside",
            "isCorrect": true,
            "explanationFa": "beside یعنی درست در کنار و مجاور."
          },
          {
            "text": "far",
            "isCorrect": false,
            "explanationFa": "far یعنی دور که متضاد است."
          }
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
      "acceptableAnswers": [
        "under",
        "below"
      ],
      "typingHintFa": "کلمه ۵ حرفی به معنی زیر (u-n-d-e-r).",
      "explanationFa": "under the bench یعنی زیر نیمکت.",
      "quickChips": [
        "under",
        "over",
        "into"
      ]
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
        {
          "id": "c1",
          "text": "This"
        },
        {
          "id": "c2",
          "text": "robot"
        },
        {
          "id": "c3",
          "text": "can"
        },
        {
          "id": "c4",
          "text": "fly"
        },
        {
          "id": "c5",
          "text": "very"
        },
        {
          "id": "c6",
          "text": "high."
        },
        {
          "id": "d1",
          "text": "flies",
          "isDistractor": true,
          "distractorReasonFa": "بعد از can هرگز فعل s نمی‌گیرد!"
        }
      ],
      "correctSequence": [
        "This",
        "robot",
        "can",
        "fly",
        "very",
        "high."
      ],
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
        {
          "text": "but",
          "isCorrect": true,
          "explanationFa": "برای بیان تضاد بین یک توانایی و یک ناتوانی از but استفاده می‌شود."
        },
        {
          "text": "so",
          "isCorrect": false,
          "explanationFa": "کلمه so نشان‌دهنده نتیجه است."
        },
        {
          "text": "because",
          "isCorrect": false,
          "explanationFa": "شنا نکردن نتیجه پرواز نیست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "fast",
        "promptFa": "قید جذاب‌تری برای حرکت بی‌صدا انتخاب کن:",
        "upgrades": [
          {
            "text": "smoothly",
            "isCorrect": true,
            "explanationFa": "smoothly یعنی روان و بدون تکان."
          },
          {
            "text": "loudly",
            "isCorrect": false,
            "explanationFa": "loudly یعنی با سر و صدای زیاد."
          }
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
      "acceptableAnswers": [
        "can't",
        "cannot"
      ],
      "typingHintFa": "مخفف cannot به شکل c-a-n-'-t.",
      "explanationFa": "can't فرم کوتاه و روزمره cannot است.",
      "quickChips": [
        "can't",
        "cannot",
        "won't"
      ]
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
        {
          "id": "c1",
          "text": "We"
        },
        {
          "id": "c2",
          "text": "need"
        },
        {
          "id": "c3",
          "text": "your"
        },
        {
          "id": "c4",
          "text": "help"
        },
        {
          "id": "c5",
          "text": "right"
        },
        {
          "id": "c6",
          "text": "now."
        },
        {
          "id": "d1",
          "text": "needs",
          "isDistractor": true,
          "distractorReasonFa": "فاعل We جمع است و فعل s نمی‌گیرد!"
        }
      ],
      "correctSequence": [
        "We",
        "need",
        "your",
        "help",
        "right",
        "now."
      ],
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
        {
          "text": "because",
          "isCorrect": true,
          "explanationFa": "کلمه because علت درخواست حضور فوری را توضیح می‌دهد."
        },
        {
          "text": "or",
          "isCorrect": false,
          "explanationFa": "کلمه or برای گزینه‌های جایگزین است."
        },
        {
          "text": "so",
          "isCorrect": false,
          "explanationFa": "اینجا علت بعد از جای خالی آمده، پس because درست است."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "bad",
        "promptFa": "کلمه بهتری برای توصیف یک مشکل فنی جدی انتخاب کن:",
        "upgrades": [
          {
            "text": "urgent",
            "isCorrect": true,
            "explanationFa": "urgent یعنی فوری و اضطراری."
          },
          {
            "text": "slow",
            "isCorrect": false,
            "explanationFa": "slow ربطی به ماهیت مشکل ندارد."
          }
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
      "acceptableAnswers": [
        "Best",
        "Warm",
        "Kind"
      ],
      "typingHintFa": "کلمه ۴ حرفی به معنای بهترین (B-e-s-t).",
      "explanationFa": "Best regards یک عبارت پایانی بسیار پرکاربرد و محترمانه در مکاتبات است.",
      "quickChips": [
        "Best",
        "Warm",
        "Good"
      ]
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
        {
          "id": "c1",
          "text": "The"
        },
        {
          "id": "c2",
          "text": "weather"
        },
        {
          "id": "c3",
          "text": "is"
        },
        {
          "id": "c4",
          "text": "sunny"
        },
        {
          "id": "c5",
          "text": "and"
        },
        {
          "id": "c6",
          "text": "warm."
        },
        {
          "id": "d1",
          "text": "are",
          "isDistractor": true,
          "distractorReasonFa": "کلمه weather اسم غیرقابل شمارش و مفرد است و is می‌خواهد."
        }
      ],
      "correctSequence": [
        "The",
        "weather",
        "is",
        "sunny",
        "and",
        "warm."
      ],
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
        {
          "text": "so",
          "isCorrect": true,
          "explanationFa": "کلمه so یعنی «بنابراین» و نتیجه آفتابی بودن هوا را بیان می‌کند."
        },
        {
          "text": "but",
          "isCorrect": false,
          "explanationFa": "قدم زدن در هوای آفتابی تضادی ندارد."
        },
        {
          "text": "because",
          "isCorrect": false,
          "explanationFa": "قدم زدن علت تابیدن خورشید نیست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "having fun",
        "promptFa": "عبارت جذاب‌تر برای لذت بردن از لحظات انتخاب کن:",
        "upgrades": [
          {
            "text": "enjoying our time",
            "isCorrect": true,
            "explanationFa": "enjoying our time یعنی حسابی لذت بردن از اوقات."
          },
          {
            "text": "working hard",
            "isCorrect": false,
            "explanationFa": "متضاد مفهوم تعطیلات و استراحت است."
          }
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
      "acceptableAnswers": [
        "here"
      ],
      "typingHintFa": "کلمه به معنی «اینجا» (h-e-r-e).",
      "explanationFa": "Wish you were here! یعنی «کاش اینجا بودی!» که امضای مشهور کارت‌پستال است.",
      "quickChips": [
        "here",
        "there",
        "well"
      ]
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
        {
          "id": "c1",
          "text": "It"
        },
        {
          "id": "c2",
          "text": "has"
        },
        {
          "id": "c3",
          "text": "silver"
        },
        {
          "id": "c4",
          "text": "wheels"
        },
        {
          "id": "c5",
          "text": "and"
        },
        {
          "id": "c6",
          "text": "green"
        },
        {
          "id": "c7",
          "text": "eyes."
        },
        {
          "id": "d1",
          "text": "have",
          "isDistractor": true,
          "distractorReasonFa": "برای ضمیر It باید has به کار ببریم."
        }
      ],
      "correctSequence": [
        "It",
        "has",
        "silver",
        "wheels",
        "and",
        "green",
        "eyes."
      ],
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
        {
          "text": "but",
          "isCorrect": true,
          "explanationFa": "کلمه but استثنا و تضاد را بیان می‌کند."
        },
        {
          "text": "and",
          "isCorrect": false,
          "explanationFa": "but برای نشان دادن شرایط تغییر رفتار مناسب‌تر است."
        },
        {
          "text": "because",
          "isCorrect": false,
          "explanationFa": "بوق زدن علت آرام بودن نیست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "nice",
        "promptFa": "کلمه دقیق‌تر برای توصیف اخلاق ربات انتخاب کن:",
        "upgrades": [
          {
            "text": "gentle",
            "isCorrect": true,
            "explanationFa": "gentle یعنی آرام، ملایم و بی‌آزار."
          },
          {
            "text": "angry",
            "isCorrect": false,
            "explanationFa": "angry متضاد است."
          }
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
      "acceptableAnswers": [
        "call",
        "contact",
        "ring"
      ],
      "typingHintFa": "فعل چهار حرفی به معنی زنگ زدن (c-a-l-l).",
      "explanationFa": "Please call our lab یعنی لطفاً با آزمایشگاه ما تماس بگیرید.",
      "quickChips": [
        "call",
        "help",
        "visit"
      ]
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
    "isBossStage": true,
    "round1": {
      "id": "w-a1-10-r1",
      "roundTitleFa": "چیدمان بیانیه افتخار",
      "promptFa": "کارت‌های بیانیه رسمی ربات برتر را به ترتیب درست بچین:",
      "promptEn": "Assemble the master graduation declaration:",
      "hintFa": "جمله با فاعل I شروع می‌شود، با am ready ادامه می‌یابد.",
      "goldenRuleFa": "نکته طلایی: I am ready to explore the world.",
      "scrambledChips": [
        {
          "id": "c1",
          "text": "I"
        },
        {
          "id": "c2",
          "text": "am"
        },
        {
          "id": "c3",
          "text": "ready"
        },
        {
          "id": "c4",
          "text": "to"
        },
        {
          "id": "c5",
          "text": "explore"
        },
        {
          "id": "c6",
          "text": "the"
        },
        {
          "id": "c7",
          "text": "world."
        },
        {
          "id": "d1",
          "text": "is",
          "isDistractor": true,
          "distractorReasonFa": "با ضمیر I فعل am می‌آید نه is!"
        }
      ],
      "correctSequence": [
        "I",
        "am",
        "ready",
        "to",
        "explore",
        "the",
        "world."
      ],
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
        {
          "text": "and",
          "isCorrect": true,
          "explanationFa": "کلمه and دو دستاورد مثبت را به زیبایی کنار هم می‌نشاند."
        },
        {
          "text": "but",
          "isCorrect": false,
          "explanationFa": "تضادی وجود ندارد."
        },
        {
          "text": "or",
          "isCorrect": false,
          "explanationFa": "این دو هم‌زمان اتفاق افتاده‌اند."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "happy",
        "promptFa": "کلمه مغرورانه و درخشان برای یک ربات پیروز انتخاب کن:",
        "upgrades": [
          {
            "text": "proud",
            "isCorrect": true,
            "explanationFa": "proud یعنی سربلند و مفتخر."
          },
          {
            "text": "tired",
            "isCorrect": false,
            "explanationFa": "tired یعنی خسته که مناسب جشن نیست."
          }
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
      "acceptableAnswers": [
        "care",
        "joy",
        "pride"
      ],
      "typingHintFa": "کلمه ۴ حرفی به معنای دقت و مراقبت (c-a-r-e).",
      "explanationFa": "with care یعنی با دقت و توجه کامل.",
      "quickChips": [
        "care",
        "pride",
        "speed"
      ]
    }
  }
];

// ============================================================================
// A2 CASES: WORD-BOT FACTORY ADVANCED (کارخانه روبات‌ها - چالش‌های پیشرفته)
// ============================================================================
export const A2_WRITING_CASES: WritingStageCase[] = [
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
        {
          "id": "c1",
          "text": "A"
        },
        {
          "id": "c2",
          "text": "visitor"
        },
        {
          "id": "c3",
          "text": "arrived"
        },
        {
          "id": "c4",
          "text": "at"
        },
        {
          "id": "c5",
          "text": "the"
        },
        {
          "id": "c6",
          "text": "gate."
        },
        {
          "id": "d1",
          "text": "arrive",
          "isDistractor": true,
          "distractorReasonFa": "چون اتفاق در گذشته افتاده باید arrived باشد نه arrive!"
        }
      ],
      "correctSequence": [
        "A",
        "visitor",
        "arrived",
        "at",
        "the",
        "gate."
      ],
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
        {
          "text": "before",
          "isCorrect": true,
          "explanationFa": "before یعنی «قبل از اینکه» و تقدم و تاخر اعمال را نشان می‌دهد."
        },
        {
          "text": "although",
          "isCorrect": false,
          "explanationFa": "تضادی وجود ندارد."
        },
        {
          "text": "because",
          "isCorrect": false,
          "explanationFa": "در زدن علت وارد شدن نیست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "went",
        "promptFa": "فعل گذشته شیک‌تر برای وارد شدن انتخاب کن:",
        "upgrades": [
          {
            "text": "entered",
            "isCorrect": true,
            "explanationFa": "entered یعنی رسماً وارد شد."
          },
          {
            "text": "slept",
            "isCorrect": false,
            "explanationFa": "slept یعنی خوابید که بی‌ربط است."
          }
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
      "acceptableAnswers": [
        "yesterday"
      ],
      "typingHintFa": "کلمه ۹ حرفی برای دیروز (y-e-s-t-e-r-d-a-y).",
      "explanationFa": "yesterday نشانه واضح زمان گذشته ساده است.",
      "quickChips": [
        "yesterday",
        "tonight",
        "soon"
      ]
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
        {
          "id": "c1",
          "text": "We"
        },
        {
          "id": "c2",
          "text": "are"
        },
        {
          "id": "c3",
          "text": "going"
        },
        {
          "id": "c4",
          "text": "to"
        },
        {
          "id": "c5",
          "text": "build"
        },
        {
          "id": "c6",
          "text": "a"
        },
        {
          "id": "c7",
          "text": "drone."
        },
        {
          "id": "d1",
          "text": "is",
          "isDistractor": true,
          "distractorReasonFa": "با فاعل We باید are بیاید نه is!"
        }
      ],
      "correctSequence": [
        "We",
        "are",
        "going",
        "to",
        "build",
        "a",
        "drone."
      ],
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
        {
          "text": "so that",
          "isCorrect": true,
          "explanationFa": "so that یعنی «تا اینکه / به این منظور که» و هدف کار را بیان می‌کند."
        },
        {
          "text": "but",
          "isCorrect": false,
          "explanationFa": "تضادی در کار نیست."
        },
        {
          "text": "unless",
          "isCorrect": false,
          "explanationFa": "unless یعنی مگر اینکه و شرط منفی است."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "make",
        "promptFa": "فعل مهندسی‌تر به جای ساختن معمولی انتخاب کن:",
        "upgrades": [
          {
            "text": "construct",
            "isCorrect": true,
            "explanationFa": "construct یعنی ساختن اصولی و مهندسی."
          },
          {
            "text": "break",
            "isCorrect": false,
            "explanationFa": "متضاد است."
          }
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
      "acceptableAnswers": [
        "tomorrow"
      ],
      "typingHintFa": "کلمه ۸ حرفی فردا (t-o-m-o-r-r-o-w).",
      "explanationFa": "tomorrow برای آینده نزدیک است.",
      "quickChips": [
        "tomorrow",
        "later",
        "daily"
      ]
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
        {
          "id": "c1",
          "text": "Model"
        },
        {
          "id": "c2",
          "text": "A"
        },
        {
          "id": "c3",
          "text": "is"
        },
        {
          "id": "c4",
          "text": "faster"
        },
        {
          "id": "c5",
          "text": "than"
        },
        {
          "id": "c6",
          "text": "Model"
        },
        {
          "id": "c7",
          "text": "B."
        },
        {
          "id": "d1",
          "text": "then",
          "isDistractor": true,
          "distractorReasonFa": "در مقایسه همیشه than می‌آید نه then!"
        }
      ],
      "correctSequence": [
        "Model",
        "A",
        "is",
        "faster",
        "than",
        "Model",
        "B."
      ],
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
        {
          "text": "however",
          "isCorrect": true,
          "explanationFa": "however برای ایجاد تضاد شیک بین دو ویژگی در سطح A2/B1 عالی است."
        },
        {
          "text": "because",
          "isCorrect": false,
          "explanationFa": "علت و معلول نیستند."
        },
        {
          "text": "so",
          "isCorrect": false,
          "explanationFa": "ارتباط نتیجه‌ای نیست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "good",
        "promptFa": "صفت برتر به جای good انتخاب کن:",
        "upgrades": [
          {
            "text": "superior",
            "isCorrect": true,
            "explanationFa": "superior یعنی برتر و باکیفیت‌تر."
          },
          {
            "text": "cheap",
            "isCorrect": false,
            "explanationFa": "cheap یعنی ارزان که لزوماً مثبت نیست."
          }
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
      "acceptableAnswers": [
        "strongest"
      ],
      "typingHintFa": "کلمه strong + est (قوی‌ترین).",
      "explanationFa": "the strongest یعنی قوی‌ترین.",
      "quickChips": [
        "strongest",
        "faster",
        "best"
      ]
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
        {
          "id": "c1",
          "text": "Could"
        },
        {
          "id": "c2",
          "text": "you"
        },
        {
          "id": "c3",
          "text": "please"
        },
        {
          "id": "c4",
          "text": "send"
        },
        {
          "id": "c5",
          "text": "the"
        },
        {
          "id": "c6",
          "text": "report?"
        },
        {
          "id": "d1",
          "text": "sending",
          "isDistractor": true,
          "distractorReasonFa": "بعد از could you please فعل ساده می‌آید نه ing دار!"
        }
      ],
      "correctSequence": [
        "Could",
        "you",
        "please",
        "send",
        "the",
        "report?"
      ],
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
        {
          "text": "if",
          "isCorrect": true,
          "explanationFa": "if یعنی اگر و شرط انجام کار را تعیین می‌کند."
        },
        {
          "text": "although",
          "isCorrect": false,
          "explanationFa": "تضادی در کار نیست."
        },
        {
          "text": "so",
          "isCorrect": false,
          "explanationFa": "ارتباط شرطی است نه نتیجه‌ای."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "tell me",
        "promptFa": "عبارت اداری‌تر برای در جریان گذاشتن انتخاب کن:",
        "upgrades": [
          {
            "text": "inform me",
            "isCorrect": true,
            "explanationFa": "inform me یعنی مرا مطلع سازید."
          },
          {
            "text": "shout",
            "isCorrect": false,
            "explanationFa": "shout یعنی فریاد زدن!"
          }
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
      "acceptableAnswers": [
        "advance"
      ],
      "typingHintFa": "کلمه ۷ حرفی به معنی جلو / پیشاپیش (a-d-v-a-n-c-e).",
      "explanationFa": "Thank you in advance یعنی پیشاپیش سپاسگزارم.",
      "quickChips": [
        "advance",
        "time",
        "return"
      ]
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
        {
          "id": "c1",
          "text": "Go"
        },
        {
          "id": "c2",
          "text": "straight"
        },
        {
          "id": "c3",
          "text": "and"
        },
        {
          "id": "c4",
          "text": "turn"
        },
        {
          "id": "c5",
          "text": "left"
        },
        {
          "id": "c6",
          "text": "at"
        },
        {
          "id": "c7",
          "text": "the"
        },
        {
          "id": "c8",
          "text": "hall."
        },
        {
          "id": "d1",
          "text": "going",
          "isDistractor": true,
          "distractorReasonFa": "جملات امری آدرس‌دهی با فعل ساده شروع می‌شوند نه ing دار!"
        }
      ],
      "correctSequence": [
        "Go",
        "straight",
        "and",
        "turn",
        "left",
        "at",
        "the",
        "hall."
      ],
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
        {
          "text": "and then",
          "isCorrect": true,
          "explanationFa": "and then یعنی «و سپس» و برای گام‌های پیاپی عالی است."
        },
        {
          "text": "because",
          "isCorrect": false,
          "explanationFa": "قدم زدن علت دکمه زدن نیست."
        },
        {
          "text": "but",
          "isCorrect": false,
          "explanationFa": "تضادی وجود ندارد."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "near",
        "promptFa": "حرف اضافه دقیق‌تر برای روبه‌روی هم بودن انتخاب کن:",
        "upgrades": [
          {
            "text": "opposite",
            "isCorrect": true,
            "explanationFa": "opposite یعنی دقیقاً روبه‌رو."
          },
          {
            "text": "behind",
            "isCorrect": false,
            "explanationFa": "behind یعنی پشت سر."
          }
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
      "acceptableAnswers": [
        "straight",
        "forward"
      ],
      "typingHintFa": "کلمه ۸ حرفی مستقیم (s-t-r-a-i-g-h-t).",
      "explanationFa": "Continue straight یعنی مستقیم ادامه بده.",
      "quickChips": [
        "straight",
        "back",
        "away"
      ]
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
        {
          "id": "c1",
          "text": "In"
        },
        {
          "id": "c2",
          "text": "my"
        },
        {
          "id": "c3",
          "text": "opinion,"
        },
        {
          "id": "c4",
          "text": "it"
        },
        {
          "id": "c5",
          "text": "is"
        },
        {
          "id": "c6",
          "text": "very"
        },
        {
          "id": "c7",
          "text": "useful."
        },
        {
          "id": "d1",
          "text": "to",
          "isDistractor": true,
          "distractorReasonFa": "عبارت درست In my opinion است نه To my opinion!"
        }
      ],
      "correctSequence": [
        "In",
        "my",
        "opinion,",
        "it",
        "is",
        "very",
        "useful."
      ],
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
        {
          "text": "however",
          "isCorrect": true,
          "explanationFa": "however برای ایجاد تعادل بین نقد مثبت و منفی به کار می‌رود."
        },
        {
          "text": "because",
          "isCorrect": false,
          "explanationFa": "قیمت بالا علت روان کار کردن نیست."
        },
        {
          "text": "therefore",
          "isCorrect": false,
          "explanationFa": "ارتباط نتیجه‌ای نیست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "bad",
        "promptFa": "کلمه فنی‌تر به جای خراب بودن انتخاب کن:",
        "upgrades": [
          {
            "text": "faulty",
            "isCorrect": true,
            "explanationFa": "faulty یعنی دارای نقص فنی."
          },
          {
            "text": "cold",
            "isCorrect": false,
            "explanationFa": "cold یعنی سرد!"
          }
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
      "acceptableAnswers": [
        "recommend",
        "suggest"
      ],
      "typingHintFa": "فعل ۹ حرفی توصیه کردن (r-e-c-o-m-m-e-n-d).",
      "explanationFa": "I recommend this یعنی من این را پیشنهاد می‌کنم.",
      "quickChips": [
        "recommend",
        "suggest",
        "order"
      ]
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
        {
          "id": "c1",
          "text": "The"
        },
        {
          "id": "c2",
          "text": "motor"
        },
        {
          "id": "c3",
          "text": "stopped"
        },
        {
          "id": "c4",
          "text": "because"
        },
        {
          "id": "c5",
          "text": "it"
        },
        {
          "id": "c6",
          "text": "became"
        },
        {
          "id": "c7",
          "text": "hot."
        },
        {
          "id": "d1",
          "text": "stops",
          "isDistractor": true,
          "distractorReasonFa": "حادثه در گذشته اتفاق افتاده و فعل باید stopped باشد."
        }
      ],
      "correctSequence": [
        "The",
        "motor",
        "stopped",
        "because",
        "it",
        "became",
        "hot."
      ],
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
        {
          "text": "so",
          "isCorrect": true,
          "explanationFa": "so نتیجه مستقیم بالا رفتن دما را نشان می‌دهد."
        },
        {
          "text": "although",
          "isCorrect": false,
          "explanationFa": "تضادی وجود ندارد."
        },
        {
          "text": "but",
          "isCorrect": false,
          "explanationFa": "خاموش کردن برق نتیجه منطقی است نه متناقض."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "fix",
        "promptFa": "فعل رسمی‌تر برای تعمیر اساسی انتخاب کن:",
        "upgrades": [
          {
            "text": "repair",
            "isCorrect": true,
            "explanationFa": "repair یعنی تعمیر تخصصی."
          },
          {
            "text": "break",
            "isCorrect": false,
            "explanationFa": "متضاد است."
          }
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
      "acceptableAnswers": [
        "safe",
        "secure"
      ],
      "typingHintFa": "کلمه ۴ حرفی ایمن (s-a-f-e).",
      "explanationFa": "completely safe یعنی کاملاً ایمن و بی‌خطر.",
      "quickChips": [
        "safe",
        "clean",
        "open"
      ]
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
        {
          "id": "c1",
          "text": "We"
        },
        {
          "id": "c2",
          "text": "cordially"
        },
        {
          "id": "c3",
          "text": "invite"
        },
        {
          "id": "c4",
          "text": "you"
        },
        {
          "id": "c5",
          "text": "to"
        },
        {
          "id": "c6",
          "text": "our"
        },
        {
          "id": "c7",
          "text": "science"
        },
        {
          "id": "c8",
          "text": "fair."
        },
        {
          "id": "d1",
          "text": "inviting",
          "isDistractor": true,
          "distractorReasonFa": "فعل اصلی invite ساده است نه ing دار."
        }
      ],
      "correctSequence": [
        "We",
        "cordially",
        "invite",
        "you",
        "to",
        "our",
        "science",
        "fair."
      ],
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
        {
          "text": "however",
          "isCorrect": true,
          "explanationFa": "however شرط و محدودیت را در کنار مزیت رایگان بودن نشان می‌دهد."
        },
        {
          "text": "because",
          "isCorrect": false,
          "explanationFa": "ثبت‌نام علت رایگان بودن نیست."
        },
        {
          "text": "so",
          "isCorrect": false,
          "explanationFa": "ارتباط مستقیم نتیجه‌ای نیست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "come",
        "promptFa": "فعل رسمی‌تر برای حضور پیدا کردن انتخاب کن:",
        "upgrades": [
          {
            "text": "attend",
            "isCorrect": true,
            "explanationFa": "attend یعنی شرکت کردن در رویداد یا جلسه."
          },
          {
            "text": "watch",
            "isCorrect": false,
            "explanationFa": "watch یعنی تماشا کردن."
          }
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
      "acceptableAnswers": [
        "by",
        "before"
      ],
      "typingHintFa": "حرف اضافه دو حرفی موعد مقرر (b-y).",
      "explanationFa": "by Friday یعنی حداکثر تا روز جمعه.",
      "quickChips": [
        "by",
        "at",
        "on"
      ]
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
        {
          "id": "c1",
          "text": "While"
        },
        {
          "id": "c2",
          "text": "I"
        },
        {
          "id": "c3",
          "text": "was"
        },
        {
          "id": "c4",
          "text": "walking,"
        },
        {
          "id": "c5",
          "text": "I"
        },
        {
          "id": "c6",
          "text": "found"
        },
        {
          "id": "c7",
          "text": "a"
        },
        {
          "id": "c8",
          "text": "key."
        },
        {
          "id": "d1",
          "text": "find",
          "isDistractor": true,
          "distractorReasonFa": "عمل در گذشته کامل شده و باید found باشد."
        }
      ],
      "correctSequence": [
        "While",
        "I",
        "was",
        "walking,",
        "I",
        "found",
        "a",
        "key."
      ],
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
        {
          "text": "yet",
          "isCorrect": true,
          "explanationFa": "yet یعنی «با این وجود / اما» و تضاد شاعرانه‌ای می‌سازد."
        },
        {
          "text": "because",
          "isCorrect": false,
          "explanationFa": "علت احساس نگرانی نبود."
        },
        {
          "text": "so",
          "isCorrect": false,
          "explanationFa": "نتیجه ترس به جلو رفتن نیست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "old",
        "promptFa": "صفت تاریخی‌تر و پررمزورازتر برای صندوقچه انتخاب کن:",
        "upgrades": [
          {
            "text": "ancient",
            "isCorrect": true,
            "explanationFa": "ancient یعنی بسیار کهن و تاریخی."
          },
          {
            "text": "new",
            "isCorrect": false,
            "explanationFa": "متضاد است."
          }
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
      "acceptableAnswers": [
        "Finally",
        "Eventually"
      ],
      "typingHintFa": "کلمه ۷ حرفی سرانجام (F-i-n-a-l-l-y).",
      "explanationFa": "Finally یعنی در نهایت و پایان کار.",
      "quickChips": [
        "Finally",
        "Suddenly",
        "Always"
      ]
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
    "isBossStage": true,
    "round1": {
      "id": "w-a2-10-r1",
      "roundTitleFa": "چیدمان چکیده ثبت اختراع",
      "promptFa": "کارت‌های چکیده خلاصه اختراع را مرتب کن:",
      "promptEn": "Assemble the official patent summary sentence:",
      "hintFa": "This invention solves the power shortage problem.",
      "goldenRuleFa": "نکته طلایی: This new system provides clean energy efficiently.",
      "scrambledChips": [
        {
          "id": "c1",
          "text": "This"
        },
        {
          "id": "c2",
          "text": "new"
        },
        {
          "id": "c3",
          "text": "system"
        },
        {
          "id": "c4",
          "text": "provides"
        },
        {
          "id": "c5",
          "text": "clean"
        },
        {
          "id": "c6",
          "text": "energy"
        },
        {
          "id": "c7",
          "text": "efficiently."
        },
        {
          "id": "d1",
          "text": "provide",
          "isDistractor": true,
          "distractorReasonFa": "فاعل This new system مفرد است و فعل حتماً s می‌گیرد."
        }
      ],
      "correctSequence": [
        "This",
        "new",
        "system",
        "provides",
        "clean",
        "energy",
        "efficiently."
      ],
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
        {
          "text": "furthermore",
          "isCorrect": true,
          "explanationFa": "furthermore یعنی «علاوه بر این» و مزیت دوم را اضافه می‌کند."
        },
        {
          "text": "although",
          "isCorrect": false,
          "explanationFa": "تضادی وجود ندارد."
        },
        {
          "text": "instead",
          "isCorrect": false,
          "explanationFa": "instead یعنی به جای آن که اینجا مناسب نیست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "great idea",
        "promptFa": "عبارت اداری و آکادمیک‌تر برای دستاورد انتخاب کن:",
        "upgrades": [
          {
            "text": "groundbreaking breakthrough",
            "isCorrect": true,
            "explanationFa": "groundbreaking breakthrough یعنی پیشرفت چشمگیر و انقلابی."
          },
          {
            "text": "simple trick",
            "isCorrect": false,
            "explanationFa": "simple trick شأن علمی اختراع را پایین می‌آورد."
          }
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
      "acceptableAnswers": [
        "approved",
        "accepted",
        "granted"
      ],
      "typingHintFa": "کلمه ۸ حرفی تایید شده (a-p-p-r-o-v-e-d).",
      "explanationFa": "officially approved یعنی رسماً تصویب و تایید شد.",
      "quickChips": [
        "approved",
        "closed",
        "signed"
      ]
    }
  }
];

// ============================================================================
// B1 CASES: NOIR EVIDENCE BOARD (اتاق مدارک کارآگاه نوآر)
// ============================================================================
export const B1_WRITING_CASES: WritingStageCase[] = [
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
        {
          "id": "c1",
          "text": "Initially,"
        },
        {
          "id": "c2",
          "text": "the"
        },
        {
          "id": "c3",
          "text": "suspect"
        },
        {
          "id": "c4",
          "text": "denied"
        },
        {
          "id": "c5",
          "text": "being"
        },
        {
          "id": "c6",
          "text": "at"
        },
        {
          "id": "c7",
          "text": "the"
        },
        {
          "id": "c8",
          "text": "museum."
        },
        {
          "id": "d1",
          "text": "deny",
          "isDistractor": true,
          "distractorReasonFa": "برای گزارش گذشته باید از شکل زمان گذشته denied استفاده شود."
        }
      ],
      "correctSequence": [
        "Initially,",
        "the",
        "suspect",
        "denied",
        "being",
        "at",
        "the",
        "museum."
      ],
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
        {
          "text": "however",
          "isCorrect": true,
          "explanationFa": "however برای پیوند دو گزاره متناقض و رد کردن ادعا در گزارش جنایی بهترین است."
        },
        {
          "text": "therefore",
          "isCorrect": false,
          "explanationFa": "دوربین‌ها نتیجه خواب بودن او نیستند."
        },
        {
          "text": "furthermore",
          "isCorrect": false,
          "explanationFa": "این مدرک تاییدکننده ادعای او نیست، بلکه ردکننده آن است."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "said",
        "promptFa": "فعل رسمی‌تر و قضایی‌تر برای ادعا کردن انتخاب کن:",
        "upgrades": [
          {
            "text": "alleged",
            "isCorrect": true,
            "explanationFa": "alleged یعنی بدون اثبات رسمی ادعا کرد."
          },
          {
            "text": "whispered",
            "isCorrect": false,
            "explanationFa": "whispered یعنی پچ‌پچ کرد."
          }
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
      "acceptableAnswers": [
        "alibi",
        "story",
        "claim"
      ],
      "typingHintFa": "کلمه ۵ حرفی الیبای (a-l-i-b-i).",
      "explanationFa": "alibi یعنی بهانه حضور در جایی دیگر در زمان وقوع جرم.",
      "quickChips": [
        "alibi",
        "defense",
        "truth"
      ]
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
        {
          "id": "c1",
          "text": "Due"
        },
        {
          "id": "c2",
          "text": "to"
        },
        {
          "id": "c3",
          "text": "a"
        },
        {
          "id": "c4",
          "text": "power"
        },
        {
          "id": "c5",
          "text": "failure,"
        },
        {
          "id": "c6",
          "text": "the"
        },
        {
          "id": "c7",
          "text": "alarm"
        },
        {
          "id": "c8",
          "text": "failed."
        },
        {
          "id": "d1",
          "text": "because",
          "isDistractor": true,
          "distractorReasonFa": "بعد از because باید جمله بیاید، اما بعد از Due to اسم یا عبارت اسمی می‌آید."
        }
      ],
      "correctSequence": [
        "Due",
        "to",
        "a",
        "power",
        "failure,",
        "the",
        "alarm",
        "failed."
      ],
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
        {
          "text": "consequently",
          "isCorrect": true,
          "explanationFa": "consequently یعنی در نتیجه / بنابراین و برای ارتباط علت و معلول رسمی فوق‌العاده است."
        },
        {
          "text": "nonetheless",
          "isCorrect": false,
          "explanationFa": "nonetheless برای تضاد است نه نتیجه."
        },
        {
          "text": "meanwhile",
          "isCorrect": false,
          "explanationFa": "meanwhile هم‌زمانی را می‌رساند نه نتیجه منطقی."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "took money",
        "promptFa": "عبارت جنایی‌تر برای به سرقت بردن وجوه نقد انتخاب کن:",
        "upgrades": [
          {
            "text": "stole substantial assets",
            "isCorrect": true,
            "explanationFa": "stole substantial assets یعنی مبالغ هنگفتی به سرقت بردند."
          },
          {
            "text": "borrowed coins",
            "isCorrect": false,
            "explanationFa": "borrowed coins یعنی سکه قرض گرفتند!"
          }
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
      "acceptableAnswers": [
        "Therefore",
        "Thus",
        "Consequently"
      ],
      "typingHintFa": "کلمه ۹ حرفی به معنی بنابراین (T-h-e-r-e-f-o-r-e).",
      "explanationFa": "Therefore بهترین پیونددهنده رسمی برای نتیجه‌گیری در گزارش‌ها است.",
      "quickChips": [
        "Therefore",
        "However",
        "Instead"
      ]
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
        {
          "id": "c1",
          "text": "The"
        },
        {
          "id": "c2",
          "text": "man"
        },
        {
          "id": "c3",
          "text": "who"
        },
        {
          "id": "c4",
          "text": "wore"
        },
        {
          "id": "c5",
          "text": "a"
        },
        {
          "id": "c6",
          "text": "black"
        },
        {
          "id": "c7",
          "text": "hat"
        },
        {
          "id": "c8",
          "text": "escaped."
        },
        {
          "id": "d1",
          "text": "which",
          "isDistractor": true,
          "distractorReasonFa": "برای اشخاص از who استفاده می‌کنیم نه which!"
        }
      ],
      "correctSequence": [
        "The",
        "man",
        "who",
        "wore",
        "a",
        "black",
        "hat",
        "escaped."
      ],
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
        {
          "text": "whose",
          "isCorrect": true,
          "explanationFa": "whose ضمیر موصولی مالکیت است و برای اشیاء و اشخاص هر دو به کار می‌رود."
        },
        {
          "text": "which",
          "isCorrect": false,
          "explanationFa": "which نیازمند حرف اضافه یا حذف its بود."
        },
        {
          "text": "where",
          "isCorrect": false,
          "explanationFa": "where برای مکان است."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "saw",
        "promptFa": "فعل دقیق‌تر برای زیر نظر گرفتن مظنون انتخاب کن:",
        "upgrades": [
          {
            "text": "observed",
            "isCorrect": true,
            "explanationFa": "observed یعنی با دقت و زیر نظر گرفتن مشاهده کرد."
          },
          {
            "text": "forgot",
            "isCorrect": false,
            "explanationFa": "متضاد است."
          }
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
      "acceptableAnswers": [
        "where",
        "in which"
      ],
      "typingHintFa": "کلمه ۵ حرفی به معنی جایی که (w-h-e-r-e).",
      "explanationFa": "the alley where the bag was dropped یعنی کوچه‌ای که کیف در آن انداخته شد.",
      "quickChips": [
        "where",
        "which",
        "when"
      ]
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
        {
          "id": "c1",
          "text": "I"
        },
        {
          "id": "c2",
          "text": "am"
        },
        {
          "id": "c3",
          "text": "writing"
        },
        {
          "id": "c4",
          "text": "to"
        },
        {
          "id": "c5",
          "text": "submit"
        },
        {
          "id": "c6",
          "text": "the"
        },
        {
          "id": "c7",
          "text": "official"
        },
        {
          "id": "c8",
          "text": "findings."
        },
        {
          "id": "d1",
          "text": "write",
          "isDistractor": true,
          "distractorReasonFa": "در فرمول استاندارد نامه‌نگاری اداری از حال استمراری I am writing استفاده می‌شود."
        }
      ],
      "correctSequence": [
        "I",
        "am",
        "writing",
        "to",
        "submit",
        "the",
        "official",
        "findings."
      ],
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
        {
          "text": "in addition",
          "isCorrect": true,
          "explanationFa": "in addition یعنی علاوه بر این، و برای نامه‌نگاری اداری لحنی شیک دارد."
        },
        {
          "text": "otherwise",
          "isCorrect": false,
          "explanationFa": "otherwise یعنی در غیر این صورت."
        },
        {
          "text": "despite",
          "isCorrect": false,
          "explanationFa": "despite تضاد را نشان می‌دهد."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "look into",
        "promptFa": "فعل رسمی‌تر به جای look into انتخاب کن:",
        "upgrades": [
          {
            "text": "investigate",
            "isCorrect": true,
            "explanationFa": "investigate یعنی بررسی و تحقیق موشکافانه قضایی."
          },
          {
            "text": "check out",
            "isCorrect": false,
            "explanationFa": "check out غیررسمی و عامیانه است."
          }
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
      "acceptableAnswers": [
        "sincerely",
        "faithfully"
      ],
      "typingHintFa": "کلمه ۹ حرفی ارادتمند شما (s-i-n-c-e-r-e-l-y).",
      "explanationFa": "Yours sincerely عبارت رسمی و محترمانه در پایان نامه‌ها است.",
      "quickChips": [
        "sincerely",
        "truly",
        "warmly"
      ]
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
        {
          "id": "c1",
          "text": "Although"
        },
        {
          "id": "c2",
          "text": "it"
        },
        {
          "id": "c3",
          "text": "rained"
        },
        {
          "id": "c4",
          "text": "outside,"
        },
        {
          "id": "c5",
          "text": "the"
        },
        {
          "id": "c6",
          "text": "floor"
        },
        {
          "id": "c7",
          "text": "stayed"
        },
        {
          "id": "c8",
          "text": "dry."
        },
        {
          "id": "d1",
          "text": "but",
          "isDistractor": true,
          "distractorReasonFa": "وقتی اول جمله Although می‌آوریم، هرگز نباید در وسط جمله but بگذاریم!"
        }
      ],
      "correctSequence": [
        "Although",
        "it",
        "rained",
        "outside,",
        "the",
        "floor",
        "stayed",
        "dry."
      ],
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
        {
          "text": "in spite of",
          "isCorrect": true,
          "explanationFa": "in spite of قبل از عبارات اسمی (repeated warnings) می‌آید."
        },
        {
          "text": "although",
          "isCorrect": false,
          "explanationFa": "although نیازمند جمله کامل با فعل است."
        },
        {
          "text": "because of",
          "isCorrect": false,
          "explanationFa": "هشدارها علت باز ماندن در نبودند."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "strange thing",
        "promptFa": "کلمه دقیق‌تر کارآگاهی برای این ناهماهنگی انتخاب کن:",
        "upgrades": [
          {
            "text": "glaring anomaly",
            "isCorrect": true,
            "explanationFa": "glaring anomaly یعنی یک تناقض فاحش و بسیار مشکوک."
          },
          {
            "text": "funny joke",
            "isCorrect": false,
            "explanationFa": "funny joke یعنی شوخی خنده‌دار که مناسب صحنه قتل نیست!"
          }
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
      "acceptableAnswers": [
        "Despite"
      ],
      "typingHintFa": "کلمه ۷ حرفی به معنی با وجودِ (D-e-s-p-i-t-e).",
      "explanationFa": "Despite the darkness یعنی با وجود تاریکی.",
      "quickChips": [
        "Despite",
        "Because",
        "Unless"
      ]
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
        {
          "id": "c1",
          "text": "The"
        },
        {
          "id": "c2",
          "text": "jewels"
        },
        {
          "id": "c3",
          "text": "were"
        },
        {
          "id": "c4",
          "text": "discovered"
        },
        {
          "id": "c5",
          "text": "in"
        },
        {
          "id": "c6",
          "text": "the"
        },
        {
          "id": "c7",
          "text": "cellar."
        },
        {
          "id": "d1",
          "text": "was",
          "isDistractor": true,
          "distractorReasonFa": "فاعل The jewels اسم جمع است و باید were بگیرد نه was!"
        }
      ],
      "correctSequence": [
        "The",
        "jewels",
        "were",
        "discovered",
        "in",
        "the",
        "cellar."
      ],
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
        {
          "text": "as",
          "isCorrect": true,
          "explanationFa": "as برای بیان همزمانی و تشریح بستر رخدادها به کار می‌رود (چنان‌که گزارش شد)."
        },
        {
          "text": "unless",
          "isCorrect": false,
          "explanationFa": "شرط منفی بی‌معنی است."
        },
        {
          "text": "instead",
          "isCorrect": false,
          "explanationFa": "تضاد جایگزینی نیست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "found out",
        "promptFa": "فعل رسمی‌تر برای فاش شدن حقیقت انتخاب کن:",
        "upgrades": [
          {
            "text": "revealed",
            "isCorrect": true,
            "explanationFa": "revealed یعنی افشا و آشکار شد."
          },
          {
            "text": "forgotten",
            "isCorrect": false,
            "explanationFa": "متضاد است."
          }
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
      "acceptableAnswers": [
        "stolen"
      ],
      "typingHintFa": "کلمه ۶ حرفی دزدیده شده (s-t-o-l-e-n).",
      "explanationFa": "were stolen یعنی به سرقت رفتند.",
      "quickChips": [
        "stolen",
        "lost",
        "broken"
      ]
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
        {
          "id": "c1",
          "text": "The"
        },
        {
          "id": "c2",
          "text": "intruder"
        },
        {
          "id": "c3",
          "text": "must"
        },
        {
          "id": "c4",
          "text": "have"
        },
        {
          "id": "c5",
          "text": "had"
        },
        {
          "id": "c6",
          "text": "the"
        },
        {
          "id": "c7",
          "text": "master"
        },
        {
          "id": "c8",
          "text": "key."
        },
        {
          "id": "d1",
          "text": "has",
          "isDistractor": true,
          "distractorReasonFa": "بعد از افعال مدال مثل must همیشه have ساده می‌آید نه has!"
        }
      ],
      "correctSequence": [
        "The",
        "intruder",
        "must",
        "have",
        "had",
        "the",
        "master",
        "key."
      ],
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
        {
          "text": "clearly",
          "isCorrect": true,
          "explanationFa": "clearly یعنی واضح است که... و استنتاج منطقی را محکم می‌کند."
        },
        {
          "text": "although",
          "isCorrect": false,
          "explanationFa": "تضادی وجود ندارد."
        },
        {
          "text": "however",
          "isCorrect": false,
          "explanationFa": "جهت گزاره‌ها یکی است."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "guess",
        "promptFa": "فعل تخصصی‌تر برای نتیجه‌گیری بر مبنای مدارک انتخاب کن:",
        "upgrades": [
          {
            "text": "deduce",
            "isCorrect": true,
            "explanationFa": "deduce یعنی استنتاج علمی و منطقی کردن."
          },
          {
            "text": "wish",
            "isCorrect": false,
            "explanationFa": "wish یعنی آرزو کردن که بی‌ربط است."
          }
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
      "acceptableAnswers": [
        "could",
        "might"
      ],
      "typingHintFa": "کلمه ۵ حرفی could به معنای می‌توانست (c-o-u-l-d).",
      "explanationFa": "could not have acted alone یعنی امکان ندارد تنهایی عمل کرده باشد.",
      "quickChips": [
        "could",
        "would",
        "should"
      ]
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
        {
          "id": "c1",
          "text": "The"
        },
        {
          "id": "c2",
          "text": "evidence"
        },
        {
          "id": "c3",
          "text": "proves"
        },
        {
          "id": "c4",
          "text": "that"
        },
        {
          "id": "c5",
          "text": "the"
        },
        {
          "id": "c6",
          "text": "plot"
        },
        {
          "id": "c7",
          "text": "was"
        },
        {
          "id": "c8",
          "text": "premeditated."
        },
        {
          "id": "d1",
          "text": "prove",
          "isDistractor": true,
          "distractorReasonFa": "کلمه evidence اسم غیرقابل شمارش و مفرد است و فعل باید proves باشد."
        }
      ],
      "correctSequence": [
        "The",
        "evidence",
        "proves",
        "that",
        "the",
        "plot",
        "was",
        "premeditated."
      ],
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
        {
          "text": "subsequently",
          "isCorrect": true,
          "explanationFa": "subsequently یعنی متعاقباً / پس از آن، و لحنی بسیار غنی و کارآگاهی دارد."
        },
        {
          "text": "otherwise",
          "isCorrect": false,
          "explanationFa": "otherwise یعنی در غیر این صورت."
        },
        {
          "text": "although",
          "isCorrect": false,
          "explanationFa": "تضادی وجود ندارد."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "bad plan",
        "promptFa": "کلمه سنگین‌تر حقوقی برای توطئه مجرمانه انتخاب کن:",
        "upgrades": [
          {
            "text": "criminal conspiracy",
            "isCorrect": true,
            "explanationFa": "criminal conspiracy یعنی تبانی و توطئه مجرمانه سازمان‌یافته."
          },
          {
            "text": "silly mistake",
            "isCorrect": false,
            "explanationFa": "silly mistake یعنی اشتباه احمقانه."
          }
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
      "acceptableAnswers": [
        "In short",
        "In summary",
        "Overall"
      ],
      "typingHintFa": "عبارت ۷ حرفی In short (به طور خلاصه).",
      "explanationFa": "In short برای جمع‌بندی پاراگراف تحلیلی عالی است.",
      "quickChips": [
        "In short",
        "For example",
        "First of all"
      ]
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
        {
          "id": "c1",
          "text": "The"
        },
        {
          "id": "c2",
          "text": "detective"
        },
        {
          "id": "c3",
          "text": "interrogated"
        },
        {
          "id": "c4",
          "text": "the"
        },
        {
          "id": "c5",
          "text": "prime"
        },
        {
          "id": "c6",
          "text": "suspect"
        },
        {
          "id": "c7",
          "text": "tonight."
        },
        {
          "id": "d1",
          "text": "primary",
          "isDistractor": true,
          "distractorReasonFa": "اصطلاح دقیق در انگلیسی حقوقی prime suspect است نه primary suspect."
        }
      ],
      "correctSequence": [
        "The",
        "detective",
        "interrogated",
        "the",
        "prime",
        "suspect",
        "tonight."
      ],
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
        {
          "text": "nevertheless",
          "isCorrect": true,
          "explanationFa": "nevertheless یعنی با این حال، و برای ارائه مدارک بر خلاف میل متهم بسیار برازنده است."
        },
        {
          "text": "therefore",
          "isCorrect": false,
          "explanationFa": "نتیجه‌گیری مستقیم نیست."
        },
        {
          "text": "for instance",
          "isCorrect": false,
          "explanationFa": "برای مثال زدن نیست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "bad evidence",
        "promptFa": "اصطلاح حقوقی برای شواهد غیرمستقیم و قرائن انتخاب کن:",
        "upgrades": [
          {
            "text": "circumstantial evidence",
            "isCorrect": true,
            "explanationFa": "circumstantial evidence یعنی شواهد اوضاع و احوال و قرائن پیرامونی."
          },
          {
            "text": "fake paper",
            "isCorrect": false,
            "explanationFa": "fake paper یعنی کاغذ جعلی."
          }
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
      "acceptableAnswers": [
        "conclusive",
        "solid",
        "concrete"
      ],
      "typingHintFa": "کلمه ۱۰ حرفی قاطع و نهایی (c-o-n-c-l-u-s-i-v-e).",
      "explanationFa": "conclusive proof یعنی مدرک قاطع و قانع‌کننده که جای شک باقی نمی‌گذارد.",
      "quickChips": [
        "conclusive",
        "weak",
        "simple"
      ]
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
    "isBossStage": true,
    "round1": {
      "id": "w-b1-10-r1",
      "roundTitleFa": "چیدمان کیفرخواست نهایی",
      "promptFa": "کارت‌های بیانیه رسمی اتهام دادستان را به ترتیب درست بچین:",
      "promptEn": "Assemble the prosecutor's formal opening indictment statement:",
      "hintFa": "The prosecution intends to prove guilt beyond reasonable doubt.",
      "goldenRuleFa": "نکته طلایی: عبارت اصیل دادگاهی: beyond reasonable doubt (فراتر از هرگونه شک معقول).",
      "scrambledChips": [
        {
          "id": "c1",
          "text": "The"
        },
        {
          "id": "c2",
          "text": "state"
        },
        {
          "id": "c3",
          "text": "will"
        },
        {
          "id": "c4",
          "text": "prove"
        },
        {
          "id": "c5",
          "text": "guilt"
        },
        {
          "id": "c6",
          "text": "beyond"
        },
        {
          "id": "c7",
          "text": "reasonable"
        },
        {
          "id": "c8",
          "text": "doubt."
        },
        {
          "id": "d1",
          "text": "without",
          "isDistractor": true,
          "distractorReasonFa": "اصطلاح حقوقی استاندارد beyond reasonable doubt است نه without reasonable doubt."
        }
      ],
      "correctSequence": [
        "The",
        "state",
        "will",
        "prove",
        "guilt",
        "beyond",
        "reasonable",
        "doubt."
      ],
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
        {
          "text": "furthermore",
          "isCorrect": true,
          "explanationFa": "furthermore دلیل دوم را برای تقویت اتهام اضافه می‌کند."
        },
        {
          "text": "despite this",
          "isCorrect": false,
          "explanationFa": "تضادی وجود ندارد."
        },
        {
          "text": "instead",
          "isCorrect": false,
          "explanationFa": "ارتباط جایگزینی نیست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "bad action",
        "promptFa": "اصطلاح حقوقی سنگین برای جرم ارتکابی انتخاب کن:",
        "upgrades": [
          {
            "text": "flagrant felony",
            "isCorrect": true,
            "explanationFa": "flagrant felony یعنی جنایت آشکار و نقض فاحش قانون."
          },
          {
            "text": "minor error",
            "isCorrect": false,
            "explanationFa": "minor error جرم را کم‌اهمیت جلوه می‌دهد."
          }
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
      "acceptableAnswers": [
        "guilty"
      ],
      "typingHintFa": "کلمه ۶ حرفی به معنی گناهکار (g-u-i-l-t-y).",
      "explanationFa": "guilty as charged یعنی مجرم در تمام بندهای اتهامی.",
      "quickChips": [
        "guilty",
        "innocent",
        "free"
      ]
    }
  }
];

// ============================================================================
// B2 CASES: NOIR EVIDENCE BOARD MASTER (سازمان بازرسی ویژه نوآر)
// ============================================================================
export const B2_WRITING_CASES: WritingStageCase[] = [
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
        {
          "id": "c1",
          "text": "On"
        },
        {
          "id": "c2",
          "text": "the"
        },
        {
          "id": "c3",
          "text": "one"
        },
        {
          "id": "c4",
          "text": "hand,"
        },
        {
          "id": "c5",
          "text": "he"
        },
        {
          "id": "c6",
          "text": "claimed"
        },
        {
          "id": "c7",
          "text": "total"
        },
        {
          "id": "c8",
          "text": "amnesia."
        },
        {
          "id": "d1",
          "text": "in",
          "isDistractor": true,
          "distractorReasonFa": "عبارت درست On the one hand است نه In the one hand!"
        }
      ],
      "correctSequence": [
        "On",
        "the",
        "one",
        "hand,",
        "he",
        "claimed",
        "total",
        "amnesia."
      ],
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
        {
          "text": "on the other hand",
          "isCorrect": true,
          "explanationFa": "on the other hand جفت مکمل on the one hand برای بیان دیدگاه معارض است."
        },
        {
          "text": "in conclusion",
          "isCorrect": false,
          "explanationFa": "برای نتیجه‌گیری انتهای متن است."
        },
        {
          "text": "for example",
          "isCorrect": false,
          "explanationFa": "اینجا مثال نیست بلکه نفی ادعاست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "shows",
        "promptFa": "فعل آکادمیک‌تر و تحلیلی‌تر به جای shows انتخاب کن:",
        "upgrades": [
          {
            "text": "demonstrates conclusively",
            "isCorrect": true,
            "explanationFa": "demonstrates conclusively یعنی به طور قاطعانه اثبات و آشکار می‌سازد."
          },
          {
            "text": "hints slightly",
            "isCorrect": false,
            "explanationFa": "hints slightly یعنی اشاره خفیف که لحن را ضعیف می‌کند."
          }
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
      "acceptableAnswers": [
        "whereas",
        "while"
      ],
      "typingHintFa": "کلمه ۷ حرفی در حالی که (w-h-e-r-e-a-s).",
      "explanationFa": "whereas برای مقایسه مستقیم رفتار دو طرف متضاد بهترین پیونددهنده سطح B2 است.",
      "quickChips": [
        "whereas",
        "because",
        "unless"
      ]
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
        {
          "id": "c1",
          "text": "Notwithstanding"
        },
        {
          "id": "c2",
          "text": "his"
        },
        {
          "id": "c3",
          "text": "alibi,"
        },
        {
          "id": "c4",
          "text": "DNA"
        },
        {
          "id": "c5",
          "text": "evidence"
        },
        {
          "id": "c6",
          "text": "placed"
        },
        {
          "id": "c7",
          "text": "him"
        },
        {
          "id": "c8",
          "text": "there."
        },
        {
          "id": "d1",
          "text": "despite of",
          "isDistractor": true,
          "distractorReasonFa": "در انگلیسی despite of غلط است؛ یا Despite یا In spite of."
        }
      ],
      "correctSequence": [
        "Notwithstanding",
        "his",
        "alibi,",
        "DNA",
        "evidence",
        "placed",
        "him",
        "there."
      ],
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
        {
          "text": "in stark contrast",
          "isCorrect": true,
          "explanationFa": "in stark contrast یعنی در تقابلی آشکار و پررنگ، و برای تغییر زاویه پرونده عالی است."
        },
        {
          "text": "similarly",
          "isCorrect": false,
          "explanationFa": "similarly برای تشابه است نه تقابل کامل."
        },
        {
          "text": "accordingly",
          "isCorrect": false,
          "explanationFa": "accordingly برای نتیجه است."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "big difference",
        "promptFa": "اصطلاح تحلیلی‌تر برای شکاف و ناهمخوانی اسناد انتخاب کن:",
        "upgrades": [
          {
            "text": "irreconcilable discrepancy",
            "isCorrect": true,
            "explanationFa": "irreconcilable discrepancy یعنی تناقض آشتی‌ناپذیر و بنیادین."
          },
          {
            "text": "small change",
            "isCorrect": false,
            "explanationFa": "small change یعنی تغییر جزئی."
          }
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
      "acceptableAnswers": [
        "nonetheless",
        "nevertheless"
      ],
      "typingHintFa": "کلمه ۱۲ حرفی پیوسته (n-o-n-e-t-h-e-l-e-s-s).",
      "explanationFa": "nonetheless یکی از شاخص‌ترین ترانزیشن‌های تضاد در متون آکادمیک و قضایی است.",
      "quickChips": [
        "nonetheless",
        "therefore",
        "meanwhile"
      ]
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
        {
          "id": "c1",
          "text": "It"
        },
        {
          "id": "c2",
          "text": "is"
        },
        {
          "id": "c3",
          "text": "alleged"
        },
        {
          "id": "c4",
          "text": "that"
        },
        {
          "id": "c5",
          "text": "confidential"
        },
        {
          "id": "c6",
          "text": "files"
        },
        {
          "id": "c7",
          "text": "were"
        },
        {
          "id": "c8",
          "text": "leaked."
        },
        {
          "id": "d1",
          "text": "alleging",
          "isDistractor": true,
          "distractorReasonFa": "در ساختار مجهول بی‌طرفانه فعل سوم یعنی alleged می‌آید نه ing دار."
        }
      ],
      "correctSequence": [
        "It",
        "is",
        "alleged",
        "that",
        "confidential",
        "files",
        "were",
        "leaked."
      ],
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
        {
          "text": "hence",
          "isCorrect": true,
          "explanationFa": "hence یعنی از این رو / بنا بر این، و لحن گزارش اداری را ارتقا می‌دهد."
        },
        {
          "text": "although",
          "isCorrect": false,
          "explanationFa": "تضادی وجود ندارد."
        },
        {
          "text": "instead",
          "isCorrect": false,
          "explanationFa": "ارتباط جایگزینی نیست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "bad cop",
        "promptFa": "اصطلاح رسمی سازمانی برای افسر متخلف انتخاب کن:",
        "upgrades": [
          {
            "text": "compromised personnel",
            "isCorrect": true,
            "explanationFa": "compromised personnel یعنی پرسنل آسیب‌پذیر یا آلوده‌شده به فساد."
          },
          {
            "text": "naughty officer",
            "isCorrect": false,
            "explanationFa": "naughty بچگانه است!"
          }
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
      "acceptableAnswers": [
        "to be",
        "to have been"
      ],
      "typingHintFa": "ترکیب دو کلمه‌ای to be (بودن).",
      "explanationFa": "The captain is purported to be involved یعنی ادعا می‌شود سروان در این ماجرا دست دارد.",
      "quickChips": [
        "to be",
        "being",
        "been"
      ]
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
        {
          "id": "c1",
          "text": "I"
        },
        {
          "id": "c2",
          "text": "am"
        },
        {
          "id": "c3",
          "text": "writing"
        },
        {
          "id": "c4",
          "text": "to"
        },
        {
          "id": "c5",
          "text": "voice"
        },
        {
          "id": "c6",
          "text": "grave"
        },
        {
          "id": "c7",
          "text": "concerns"
        },
        {
          "id": "c8",
          "text": "today."
        },
        {
          "id": "d1",
          "text": "complain about",
          "isDistractor": true,
          "distractorReasonFa": "در نامه‌های سطح بالای B2 به جای I write to complain about از I am writing to voice grave concerns استفاده می‌شود."
        }
      ],
      "correctSequence": [
        "I",
        "am",
        "writing",
        "to",
        "voice",
        "grave",
        "concerns",
        "today."
      ],
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
        {
          "text": "failing which",
          "isCorrect": true,
          "explanationFa": "failing which یعنی «در غیر این صورت / چنانچه میسر نشود» و نهایت لحن قاطع حقوقی است."
        },
        {
          "text": "for example",
          "isCorrect": false,
          "explanationFa": "مثال زدن نیست."
        },
        {
          "text": "similarly",
          "isCorrect": false,
          "explanationFa": "تشابه نیست بلکه هشدار عواقب است."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "fix it",
        "promptFa": "فعل رسمی‌تر برای جبران خسارت و اصلاح امور انتخاب کن:",
        "upgrades": [
          {
            "text": "rectify the deficiency",
            "isCorrect": true,
            "explanationFa": "rectify the deficiency یعنی اصلاح و جبران نواقص موجود."
          },
          {
            "text": "clean the mess",
            "isCorrect": false,
            "explanationFa": "لحن غیررسمی است."
          }
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
      "acceptableAnswers": [
        "prompt",
        "timely",
        "swift"
      ],
      "typingHintFa": "کلمه ۶ حرفی سریع و فوری (p-r-o-m-p-t).",
      "explanationFa": "prompt reply یک کالوکیشن کلاسیک نامه‌نگاری اداری به معنی پاسخ سریع و عاجل است.",
      "quickChips": [
        "prompt",
        "slow",
        "late"
      ]
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
        {
          "id": "c1",
          "text": "The"
        },
        {
          "id": "c2",
          "text": "former"
        },
        {
          "id": "c3",
          "text": "is"
        },
        {
          "id": "c4",
          "text": "authentic,"
        },
        {
          "id": "c5",
          "text": "whereas"
        },
        {
          "id": "c6",
          "text": "the"
        },
        {
          "id": "c7",
          "text": "latter"
        },
        {
          "id": "c8",
          "text": "is"
        },
        {
          "id": "c9",
          "text": "forged."
        },
        {
          "id": "d1",
          "text": "later",
          "isDistractor": true,
          "distractorReasonFa": "کلمه latter با دو تا t به معنی «دومی» است، later یعنی «بعداً»!"
        }
      ],
      "correctSequence": [
        "The",
        "former",
        "is",
        "authentic,",
        "whereas",
        "the",
        "latter",
        "is",
        "forged."
      ],
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
        {
          "text": "moreover",
          "isCorrect": true,
          "explanationFa": "moreover یعنی علاوه بر این، و یک دلیل اثباتی محکم‌تر را به مدرک قبلی می‌افزاید."
        },
        {
          "text": "instead",
          "isCorrect": false,
          "explanationFa": "جایگزینی نیست."
        },
        {
          "text": "despite",
          "isCorrect": false,
          "explanationFa": "تضادی وجود ندارد."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "fake writing",
        "promptFa": "اصطلاح جرم‌شناسی برای دستکاری و جعل سند انتخاب کن:",
        "upgrades": [
          {
            "text": "meticulous forgery",
            "isCorrect": true,
            "explanationFa": "meticulous forgery یعنی جعل ماهرانه و دقیق."
          },
          {
            "text": "bad drawing",
            "isCorrect": false,
            "explanationFa": "bad drawing یعنی نقاشی بد!"
          }
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
      "acceptableAnswers": [
        "Such",
        "These"
      ],
      "typingHintFa": "کلمه ۴ حرفی به معنی چنین (S-u-c-h).",
      "explanationFa": "Such anomalies یعنی چنین ناهماهنگی‌هایی که اشاره به موارد پیش‌گفته دارد.",
      "quickChips": [
        "Such",
        "Much",
        "Each"
      ]
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
        {
          "id": "c1",
          "text": "Having"
        },
        {
          "id": "c2",
          "text": "disabled"
        },
        {
          "id": "c3",
          "text": "the"
        },
        {
          "id": "c4",
          "text": "cameras,"
        },
        {
          "id": "c5",
          "text": "the"
        },
        {
          "id": "c6",
          "text": "thief"
        },
        {
          "id": "c7",
          "text": "approached"
        },
        {
          "id": "c8",
          "text": "the"
        },
        {
          "id": "c9",
          "text": "safe."
        },
        {
          "id": "d1",
          "text": "have",
          "isDistractor": true,
          "distractorReasonFa": "در ابتدای عبارت وصفی کامل باید شکل Having بیاید نه have!"
        }
      ],
      "correctSequence": [
        "Having",
        "disabled",
        "the",
        "cameras,",
        "the",
        "thief",
        "approached",
        "the",
        "safe."
      ],
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
        {
          "text": "",
          "isCorrect": true,
          "explanationFa": "در جمله‌واره‌های وصفی، بعد از کاما بلافاصله فاعل اصلی می‌آید و نیازی به کلمه ربط اضافه نیست."
        },
        {
          "text": "so",
          "isCorrect": false,
          "explanationFa": "آوردن so بعد از کامای عبارت وصفی غلط گرامری است."
        },
        {
          "text": "because",
          "isCorrect": false,
          "explanationFa": "خود Realizing مفهوم علت را درون خود دارد."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "went through",
        "promptFa": "فعل تخصصی‌تر برای عبور مخفیانه انتخاب کن:",
        "upgrades": [
          {
            "text": "infiltrated via",
            "isCorrect": true,
            "explanationFa": "infiltrated via یعنی از طریق... نفوذ نامحسوس کرد."
          },
          {
            "text": "walked into",
            "isCorrect": false,
            "explanationFa": "walked into یعنی عادی راه رفت."
          }
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
      "acceptableAnswers": [
        "Knowing"
      ],
      "typingHintFa": "فعل Know + ing (با دانستنِ).",
      "explanationFa": "Knowing the risks یعنی با علم به خطرات موجود.",
      "quickChips": [
        "Knowing",
        "Known",
        "Knew"
      ]
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
        {
          "id": "c1",
          "text": "Had"
        },
        {
          "id": "c2",
          "text": "the"
        },
        {
          "id": "c3",
          "text": "guards"
        },
        {
          "id": "c4",
          "text": "been"
        },
        {
          "id": "c5",
          "text": "alert,"
        },
        {
          "id": "c6",
          "text": "the"
        },
        {
          "id": "c7",
          "text": "heist"
        },
        {
          "id": "c8",
          "text": "would"
        },
        {
          "id": "c9",
          "text": "fail."
        },
        {
          "id": "d1",
          "text": "if had",
          "isDistractor": true,
          "distractorReasonFa": "در حالت Inversion کلمه if کاملاً حذف می‌شود!"
        }
      ],
      "correctSequence": [
        "Had",
        "the",
        "guards",
        "been",
        "alert,",
        "the",
        "heist",
        "would",
        "fail."
      ],
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
        {
          "text": "yet",
          "isCorrect": true,
          "explanationFa": "yet تضاد ظریف را در کنار شرطی وارونه به زیبایی نشان می‌دهد."
        },
        {
          "text": "because",
          "isCorrect": false,
          "explanationFa": "علت و معلول نیست."
        },
        {
          "text": "so",
          "isCorrect": false,
          "explanationFa": "نتیجه‌گیری مستقیم نیست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "poor",
        "promptFa": "کلمه حقوقی و رسمی‌تر برای ورشکسته و بی‌نوا انتخاب کن:",
        "upgrades": [
          {
            "text": "destitute",
            "isCorrect": true,
            "explanationFa": "destitute یعنی کاملاً تهیدست و بی‌پول."
          },
          {
            "text": "cheap",
            "isCorrect": false,
            "explanationFa": "cheap یعنی ارزان."
          }
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
      "acceptableAnswers": [
        "Should"
      ],
      "typingHintFa": "کلمه ۶ حرفی Should به جای if (چنانچه...).",
      "explanationFa": "Should you discover یعنی اگر احیاناً کشف کردید.",
      "quickChips": [
        "Should",
        "Could",
        "Would"
      ]
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
        {
          "id": "c1",
          "text": "Available"
        },
        {
          "id": "c2",
          "text": "data"
        },
        {
          "id": "c3",
          "text": "suggests"
        },
        {
          "id": "c4",
          "text": "that"
        },
        {
          "id": "c5",
          "text": "conspiracy"
        },
        {
          "id": "c6",
          "text": "appears"
        },
        {
          "id": "c7",
          "text": "plausible."
        },
        {
          "id": "d1",
          "text": "definitely proves",
          "isDistractor": true,
          "distractorReasonFa": "در بیانیه‌های محتاطانه (Hedging) نباید از واژگان قطعی مثل definitely proves استفاده کرد."
        }
      ],
      "correctSequence": [
        "Available",
        "data",
        "suggests",
        "that",
        "conspiracy",
        "appears",
        "plausible."
      ],
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
        {
          "text": "nevertheless",
          "isCorrect": true,
          "explanationFa": "nevertheless تعادل بین موفقیت تیم و ضرورت احتیاط را به خوبی برقرار می‌سازد."
        },
        {
          "text": "in addition",
          "isCorrect": false,
          "explanationFa": "جمله دوم تکمیلی نیست بلکه تحدیدکننده است."
        },
        {
          "text": "because",
          "isCorrect": false,
          "explanationFa": "علت و معلول نیستند."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "we think",
        "promptFa": "عبارت سازمانی فاخرتر به جای we think انتخاب کن:",
        "upgrades": [
          {
            "text": "it is widely presumed",
            "isCorrect": true,
            "explanationFa": "it is widely presumed یعنی چنین برآورد و گمانه‌زنی می‌شود."
          },
          {
            "text": "we guess",
            "isCorrect": false,
            "explanationFa": "we guess یعنی حدس می‌زنیم که خیلی غیرحرفه‌ای است."
          }
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
      "acceptableAnswers": [
        "appears",
        "seems"
      ],
      "typingHintFa": "فعل ۷ حرفی به نظر می‌رسد (a-p-p-e-a-r-s).",
      "explanationFa": "appears to have acted یعنی به نظر می‌رسد که عمل کرده باشد.",
      "quickChips": [
        "appears",
        "is",
        "must"
      ]
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
        {
          "id": "c1",
          "text": "Though"
        },
        {
          "id": "c2",
          "text": "the"
        },
        {
          "id": "c3",
          "text": "streets"
        },
        {
          "id": "c4",
          "text": "grew"
        },
        {
          "id": "c5",
          "text": "silent,"
        },
        {
          "id": "c6",
          "text": "the"
        },
        {
          "id": "c7",
          "text": "truth"
        },
        {
          "id": "c8",
          "text": "echoed."
        },
        {
          "id": "d1",
          "text": "but yet",
          "isDistractor": true,
          "distractorReasonFa": "حشو زبانی است؛ ترکیب but yet در این ساختار غلط است."
        }
      ],
      "correctSequence": [
        "Though",
        "the",
        "streets",
        "grew",
        "silent,",
        "the",
        "truth",
        "echoed."
      ],
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
        {
          "text": "ultimately",
          "isCorrect": true,
          "explanationFa": "ultimately یعنی در غایت امر و فرجام نهایی، و ریتم روایی نوآر را به کمال می‌رساند."
        },
        {
          "text": "for instance",
          "isCorrect": false,
          "explanationFa": "مثال نیست."
        },
        {
          "text": "initially",
          "isCorrect": false,
          "explanationFa": "initially برای شروع است نه پایان دهه‌ها انتظار."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "caught him",
        "promptFa": "عبارت ادبی‌تر برای مجازات شدن مقصر انتخاب کن:",
        "upgrades": [
          {
            "text": "brought him to justice",
            "isCorrect": true,
            "explanationFa": "brought him to justice یعنی او را پای میز محاکمه و اجرای عدالت کشاند."
          },
          {
            "text": "grabbed his coat",
            "isCorrect": false,
            "explanationFa": "grabbed his coat یعنی کتش را گرفت."
          }
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
      "acceptableAnswers": [
        "unsolved",
        "insoluble",
        "inexplicable"
      ],
      "typingHintFa": "کلمه ۸ حرفی حل‌نشده (u-n-s-o-l-v-e-d).",
      "explanationFa": "an unsolved enigma یعنی معمایی گره‌خورده و حل‌نشده.",
      "quickChips": [
        "unsolved",
        "simple",
        "closed"
      ]
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
    "isBossStage": true,
    "round1": {
      "id": "w-b2-10-r1",
      "roundTitleFa": "چیدمان بیانیه نهایی محاکمه",
      "promptFa": "کارت‌های لایحه اتهامی مغز متفکر کارتل را مرتب کن:",
      "promptEn": "Assemble the master trial closing indictment sentence:",
      "hintFa": "The evidence unequivocally demonstrates that the syndicate operated under his direct authority.",
      "goldenRuleFa": "نکته طلایی: استفاده از قیدهای تأکیدی مانند unequivocally در نگارش عالی قضایی.",
      "scrambledChips": [
        {
          "id": "c1",
          "text": "The"
        },
        {
          "id": "c2",
          "text": "proof"
        },
        {
          "id": "c3",
          "text": "unequivocally"
        },
        {
          "id": "c4",
          "text": "links"
        },
        {
          "id": "c5",
          "text": "the"
        },
        {
          "id": "c6",
          "text": "boss"
        },
        {
          "id": "c7",
          "text": "to"
        },
        {
          "id": "c8",
          "text": "the"
        },
        {
          "id": "c9",
          "text": "crimes."
        },
        {
          "id": "d1",
          "text": "link",
          "isDistractor": true,
          "distractorReasonFa": "کلمه proof مفرد است و فعل حتماً s می‌گیرد (links)."
        }
      ],
      "correctSequence": [
        "The",
        "proof",
        "unequivocally",
        "links",
        "the",
        "boss",
        "to",
        "the",
        "crimes."
      ],
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
        {
          "text": "notwithstanding this assertion",
          "isCorrect": true,
          "explanationFa": "notwithstanding this assertion یعنی علیرغم این ادعا، و نهایت تسلط بر رایتینگ پیشرفته است."
        },
        {
          "text": "because of this",
          "isCorrect": false,
          "explanationFa": "علت و معلول نیست."
        },
        {
          "text": "for example",
          "isCorrect": false,
          "explanationFa": "مثال نیست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "bad criminal",
        "promptFa": "اصطلاح درجات عالی برای متهم ردیف اول سازمان‌یافته انتخاب کن:",
        "upgrades": [
          {
            "text": "orchestrator of the enterprise",
            "isCorrect": true,
            "explanationFa": "orchestrator of the enterprise یعنی معمار و هماهنگ‌کننده کل شبکه مجرمانه."
          },
          {
            "text": "troublemaker",
            "isCorrect": false,
            "explanationFa": "troublemaker کلمه‌ای سطحی و روزمره است."
          }
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
      "acceptableAnswers": [
        "conviction",
        "judgment"
      ],
      "typingHintFa": "کلمه ۱۰ حرفی محکومیت (c-o-n-v-i-c-t-i-o-n).",
      "explanationFa": "secured an absolute conviction یعنی محکومیت قطعی و کامل را به همراه آورد.",
      "quickChips": [
        "conviction",
        "release",
        "bail"
      ]
    }
  }
];

// ============================================================================
// C1 CASES: PROTOCOL ZERO: CYBER INTEL DOSSIER (اتاق ضداطلاعات و پروتکل سایبری)
// ============================================================================
export const C1_WRITING_CASES: WritingStageCase[] = [
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
        {
          "id": "c1",
          "text": "Seldom"
        },
        {
          "id": "c2",
          "text": "has"
        },
        {
          "id": "c3",
          "text": "our"
        },
        {
          "id": "c4",
          "text": "network"
        },
        {
          "id": "c5",
          "text": "seen"
        },
        {
          "id": "c6",
          "text": "such"
        },
        {
          "id": "c7",
          "text": "a"
        },
        {
          "id": "c8",
          "text": "threat."
        },
        {
          "id": "d1",
          "text": "our network has",
          "isDistractor": true,
          "distractorReasonFa": "در ساختار Inversion بعد از Seldom باید بلافاصله فعل کمکی has بیاید نه فاعل!"
        }
      ],
      "correctSequence": [
        "Seldom",
        "has",
        "our",
        "network",
        "seen",
        "such",
        "a",
        "threat."
      ],
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
        {
          "text": "but also",
          "isCorrect": true,
          "explanationFa": "Not only حتماً با but also در بند دوم همراه می‌شود تا تقارن نحوی C1 رعایت شود."
        },
        {
          "text": "and yet",
          "isCorrect": false,
          "explanationFa": "and yet تضاد است نه توسعه اطلاعات."
        },
        {
          "text": "in case",
          "isCorrect": false,
          "explanationFa": "in case شرط احتمالی است."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "very smart hack",
        "promptFa": "اصطلاح فنی عالی برای نفوذ پیچیده و چندلایه انتخاب کن:",
        "upgrades": [
          {
            "text": "highly sophisticated cyber-espionage campaign",
            "isCorrect": true,
            "explanationFa": "اصطلاحی دقیق، آکادمیک و متناسب با گزارش‌های اطلاعاتی."
          },
          {
            "text": "clever computer trick",
            "isCorrect": false,
            "explanationFa": "clever computer trick لحنی کاملاً عامیانه دارد."
          }
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
      "acceptableAnswers": [
        "Rarely",
        "Scarcely",
        "Seldom"
      ],
      "typingHintFa": "کلمه ۶ حرفی به ندرت (R-a-r-e-l-y).",
      "explanationFa": "Rarely did the telemetry indicate یعنی به ندرت داده‌های راداری نشانه‌ای ثبت کردند.",
      "quickChips": [
        "Rarely",
        "Often",
        "Always"
      ]
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
        {
          "id": "c1",
          "text": "It"
        },
        {
          "id": "c2",
          "text": "was"
        },
        {
          "id": "c3",
          "text": "the"
        },
        {
          "id": "c4",
          "text": "timestamp"
        },
        {
          "id": "c5",
          "text": "that"
        },
        {
          "id": "c6",
          "text": "exposed"
        },
        {
          "id": "c7",
          "text": "the"
        },
        {
          "id": "c8",
          "text": "mole."
        },
        {
          "id": "d1",
          "text": "which",
          "isDistractor": true,
          "distractorReasonFa": "در جملات شکافته استاندارد برای تاکید روی موضوع غیرشخصی از that استفاده می‌شود."
        }
      ],
      "correctSequence": [
        "It",
        "was",
        "the",
        "timestamp",
        "that",
        "exposed",
        "the",
        "mole."
      ],
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
        {
          "text": "however",
          "isCorrect": true,
          "explanationFa": "however بین امر پیش‌بینی‌شده و شگفتی پنهان‌کاری تعادل می‌سازد."
        },
        {
          "text": "as a result",
          "isCorrect": false,
          "explanationFa": "نتیجه‌گیری مستقیم نیست."
        },
        {
          "text": "similarly",
          "isCorrect": false,
          "explanationFa": "تشابه نیست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "long stay",
        "promptFa": "اصطلاح فنی امنیت سایبری برای حضور مداوم و خاموش در شبکه انتخاب کن:",
        "upgrades": [
          {
            "text": "protracted dwell time",
            "isCorrect": true,
            "explanationFa": "protracted dwell time اصطلاحی فوق‌العاده تخصصی برای مدت زمان ماندگاری نفوذگر در سیستم است."
          },
          {
            "text": "big camping",
            "isCorrect": false,
            "explanationFa": "camping مناسب بازی‌های ویدیویی است نه گزارش اطلاعاتی!"
          }
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
      "acceptableAnswers": [
        "What",
        "All"
      ],
      "typingHintFa": "کلمه ۴ حرفی What (آنچه که...).",
      "explanationFa": "What the director demanded was... یعنی آنچه مدیر مطالبه کرد نسخه بدون سانسور بود.",
      "quickChips": [
        "What",
        "That",
        "When"
      ]
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
        {
          "id": "c1",
          "text": "The"
        },
        {
          "id": "c2",
          "text": "rapid"
        },
        {
          "id": "c3",
          "text": "proliferation"
        },
        {
          "id": "c4",
          "text": "of"
        },
        {
          "id": "c5",
          "text": "nodes"
        },
        {
          "id": "c6",
          "text": "prompted"
        },
        {
          "id": "c7",
          "text": "immediate"
        },
        {
          "id": "c8",
          "text": "containment."
        },
        {
          "id": "d1",
          "text": "proliferating",
          "isDistractor": true,
          "distractorReasonFa": "در ساختار اسمی رسمی از اسم مجرد proliferation استفاده می‌شود نه صفت فعلی."
        }
      ],
      "correctSequence": [
        "The",
        "rapid",
        "proliferation",
        "of",
        "nodes",
        "prompted",
        "immediate",
        "containment."
      ],
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
        {
          "text": "whereby",
          "isCorrect": true,
          "explanationFa": "whereby یعنی «که به موجب آن / که در پی آن» و پیوندی منسجم و رسمی بین دو رخداد ایجاد می‌کند."
        },
        {
          "text": "because",
          "isCorrect": false,
          "explanationFa": "because برای ریتم جملات اسمی سنگین ابتدایی است."
        },
        {
          "text": "in spite of",
          "isCorrect": false,
          "explanationFa": "تضادی وجود ندارد."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "bad stop",
        "promptFa": "اصطلاح آکادمیک برای توقف کامل عملیات انتخاب کن:",
        "upgrades": [
          {
            "text": "catastrophic operational paralysis",
            "isCorrect": true,
            "explanationFa": "catastrophic operational paralysis یعنی فلج کامل و فاجعه‌بار عملیاتی."
          },
          {
            "text": "big pause",
            "isCorrect": false,
            "explanationFa": "big pause یعنی مکث بزرگ که نامناسب است."
          }
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
      "acceptableAnswers": [
        "escalation",
        "amplification"
      ],
      "typingHintFa": "کلمه ۱۰ حرفی تشدید (e-s-c-a-l-a-t-i-o-n).",
      "explanationFa": "alarming escalation of tensions یعنی تشدید نگران‌کننده تنش‌ها.",
      "quickChips": [
        "escalation",
        "drop",
        "ending"
      ]
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
        {
          "id": "c1",
          "text": "Unilateral"
        },
        {
          "id": "c2",
          "text": "actions"
        },
        {
          "id": "c3",
          "text": "would"
        },
        {
          "id": "c4",
          "text": "inevitably"
        },
        {
          "id": "c5",
          "text": "jeopardize"
        },
        {
          "id": "c6",
          "text": "the"
        },
        {
          "id": "c7",
          "text": "fragile"
        },
        {
          "id": "c8",
          "text": "truce."
        },
        {
          "id": "d1",
          "text": "will definitely",
          "isDistractor": true,
          "distractorReasonFa": "در زبان دیپلماتیک از would به جای will استفاده می‌شود تا لحن اولتیماتوم مستقیم تعدیل شود."
        }
      ],
      "correctSequence": [
        "Unilateral",
        "actions",
        "would",
        "inevitably",
        "jeopardize",
        "the",
        "fragile",
        "truce."
      ],
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
        {
          "text": "provided that",
          "isCorrect": true,
          "explanationFa": "provided that یعنی مشروط بر آنکه، و در قراردادها و بیانیه‌های دیپلماتیک جایگاه ویژه‌ای دارد."
        },
        {
          "text": "although",
          "isCorrect": false,
          "explanationFa": "تضاد محض نیست بلکه شرط لازم است."
        },
        {
          "text": "inasmuch as",
          "isCorrect": false,
          "explanationFa": "برای بیان دلیل است نه شرط."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "bad danger",
        "promptFa": "اصطلاح دیپلماتیک برای تهدید خطیر حاکمیت ملی انتخاب کن:",
        "upgrades": [
          {
            "text": "grave peril to sovereignty",
            "isCorrect": true,
            "explanationFa": "grave peril to sovereignty یعنی خطری مبرم و هولناک علیه حاکمیت ملی."
          },
          {
            "text": "rough situation",
            "isCorrect": false,
            "explanationFa": "rough situation محاوره‌ای و ضعیف است."
          }
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
      "acceptableAnswers": [
        "forthwith",
        "immediately"
      ],
      "typingHintFa": "کلمه ۹ حرفی بی‌درنگ در اسناد رسمی (f-o-r-t-h-w-i-t-h).",
      "explanationFa": "forthwith یعنی بلادرنگ و بدون هیچ‌گونه فوت وقت در حقوق بین‌الملل.",
      "quickChips": [
        "forthwith",
        "later",
        "never"
      ]
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
        {
          "id": "c1",
          "text": "Acknowledging"
        },
        {
          "id": "c2",
          "text": "the"
        },
        {
          "id": "c3",
          "text": "leak,"
        },
        {
          "id": "c4",
          "text": "the"
        },
        {
          "id": "c5",
          "text": "core"
        },
        {
          "id": "c6",
          "text": "infrastructure"
        },
        {
          "id": "c7",
          "text": "remains"
        },
        {
          "id": "c8",
          "text": "intact."
        },
        {
          "id": "d1",
          "text": "although acknowledging",
          "isDistractor": true,
          "distractorReasonFa": "استفاده همزمان از although و acknowledging غلط و حشو نحوی است."
        }
      ],
      "correctSequence": [
        "Acknowledging",
        "the",
        "leak,",
        "the",
        "core",
        "infrastructure",
        "remains",
        "intact."
      ],
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
        {
          "text": "nevertheless",
          "isCorrect": true,
          "explanationFa": "nevertheless برای کوبیدن و ابطال ادعای پرطمطراق حریف با داده‌های عینی شاهکار است."
        },
        {
          "text": "in addition",
          "isCorrect": false,
          "explanationFa": "تایید ادعا نیست بلکه رد آن است."
        },
        {
          "text": "consequently",
          "isCorrect": false,
          "explanationFa": "رد کردن نتیجه سخن حریف نیست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "fake news",
        "promptFa": "اصطلاح فنی‌تر در حوزه امنیت روانی به جای fake news انتخاب کن:",
        "upgrades": [
          {
            "text": "orchestrated disinformation narrative",
            "isCorrect": true,
            "explanationFa": "orchestrated disinformation narrative یعنی روایت هدفمند و سازمان‌یافته اطلاعات گمراه‌کننده."
          },
          {
            "text": "funny rumor",
            "isCorrect": false,
            "explanationFa": "funny rumor یعنی شایعه بامزه!"
          }
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
      "acceptableAnswers": [
        "hyperbole",
        "propaganda"
      ],
      "typingHintFa": "کلمه ۹ حرفی هایپربولی (h-y-p-e-r-b-o-l-e).",
      "explanationFa": "hyperbole یعنی مبالغه و اغراق‌گویی لاف‌زنانه.",
      "quickChips": [
        "hyperbole",
        "facts",
        "truth"
      ]
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
        {
          "id": "c1",
          "text": "Paradoxically,"
        },
        {
          "id": "c2",
          "text": "added"
        },
        {
          "id": "c3",
          "text": "complexity"
        },
        {
          "id": "c4",
          "text": "rendered"
        },
        {
          "id": "c5",
          "text": "the"
        },
        {
          "id": "c6",
          "text": "cipher"
        },
        {
          "id": "c7",
          "text": "more"
        },
        {
          "id": "c8",
          "text": "vulnerable."
        },
        {
          "id": "d1",
          "text": "paradox",
          "isDistractor": true,
          "distractorReasonFa": "در آغاز جمله برای توصیف نحوه رخداد باید قید Paradoxically بیاید نه اسم paradox."
        }
      ],
      "correctSequence": [
        "Paradoxically,",
        "added",
        "complexity",
        "rendered",
        "the",
        "cipher",
        "more",
        "vulnerable."
      ],
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
        {
          "text": "inasmuch as",
          "isCorrect": true,
          "explanationFa": "inasmuch as یعنی «از آنجا که / از حیث اینکه» و بیانگر استدلال علمی سطح C1/C2 است."
        },
        {
          "text": "nevertheless",
          "isCorrect": false,
          "explanationFa": "تضادی وجود ندارد."
        },
        {
          "text": "on the contrary",
          "isCorrect": false,
          "explanationFa": "ارتباط علت و تبیین است."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "big change",
        "promptFa": "اصطلاح فلسفی-علمی برای دگرگونی بنیادین در پارادایم فکری انتخاب کن:",
        "upgrades": [
          {
            "text": "seismic paradigm shift",
            "isCorrect": true,
            "explanationFa": "seismic paradigm shift یعنی تحول شگرف و زلزله‌مانند در مبانی فکری."
          },
          {
            "text": "new style",
            "isCorrect": false,
            "explanationFa": "new style یعنی سبک جدید!"
          }
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
      "acceptableAnswers": [
        "Be that as it may",
        "That being said"
      ],
      "typingHintFa": "عبارت کلاسیک Be that as it may (هر چه باشد).",
      "explanationFa": "Be that as it may یک ترانزیشن فاخر برای جمع‌بندی بر فراز تناقضات است.",
      "quickChips": [
        "Be that as it may",
        "As a result",
        "In other words"
      ]
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
        {
          "id": "c1",
          "text": "The"
        },
        {
          "id": "c2",
          "text": "cadence"
        },
        {
          "id": "c3",
          "text": "reveals"
        },
        {
          "id": "c4",
          "text": "an"
        },
        {
          "id": "c5",
          "text": "idiosyncratic"
        },
        {
          "id": "c6",
          "text": "rhetorical"
        },
        {
          "id": "c7",
          "text": "footprint."
        },
        {
          "id": "d1",
          "text": "revealing",
          "isDistractor": true,
          "distractorReasonFa": "فعل اصلی جمله reveals باید صرف شده باشد نه ing دار."
        }
      ],
      "correctSequence": [
        "The",
        "cadence",
        "reveals",
        "an",
        "idiosyncratic",
        "rhetorical",
        "footprint."
      ],
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
        {
          "text": "furthermore",
          "isCorrect": true,
          "explanationFa": "furthermore بعد دوم اثبات هویت را بر روی پایه قبلی بنا می‌کند."
        },
        {
          "text": "on the contrary",
          "isCorrect": false,
          "explanationFa": "تضادی وجود ندارد."
        },
        {
          "text": "instead",
          "isCorrect": false,
          "explanationFa": "جایگزینی نیست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "bad mistake",
        "promptFa": "اصطلاح زبانی برای لغزش‌های زبانی ناخودآگاه انتخاب کن:",
        "upgrades": [
          {
            "text": "inadvertent linguistic slip",
            "isCorrect": true,
            "explanationFa": "inadvertent linguistic slip یعنی لغزش سهوی و ناخواسته کلامی که ریشه فرد را لو می‌دهد."
          },
          {
            "text": "dumb error",
            "isCorrect": false,
            "explanationFa": "dumb error غیررسمی است."
          }
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
      "acceptableAnswers": [
        "profound",
        "far-reaching"
      ],
      "typingHintFa": "کلمه ۸ حرفی عمیق و بنیادین (p-r-o-f-o-u-n-d).",
      "explanationFa": "profound ramifications یک کالوکیشن فوق‌العاده استاندارد در مقالات آکادمیک و اسناد امنیتی است.",
      "quickChips": [
        "profound",
        "shallow",
        "small"
      ]
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
        {
          "id": "c1",
          "text": "Synthesizing"
        },
        {
          "id": "c2",
          "text": "these"
        },
        {
          "id": "c3",
          "text": "disparate"
        },
        {
          "id": "c4",
          "text": "streams"
        },
        {
          "id": "c5",
          "text": "substantiates"
        },
        {
          "id": "c6",
          "text": "the"
        },
        {
          "id": "c7",
          "text": "primary"
        },
        {
          "id": "c8",
          "text": "hypothesis."
        },
        {
          "id": "d1",
          "text": "synthesized",
          "isDistractor": true,
          "distractorReasonFa": "در نقش فاعل جمله‌واره فعلی باید شکل اسم مصدر Synthesizing بیاید."
        }
      ],
      "correctSequence": [
        "Synthesizing",
        "these",
        "disparate",
        "streams",
        "substantiates",
        "the",
        "primary",
        "hypothesis."
      ],
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
        {
          "text": "closer inspection revealed that",
          "isCorrect": true,
          "explanationFa": "closer inspection revealed that عبارتی غنی برای نشان دادن عمق تحلیل و گذر از ظاهر داده‌هاست."
        },
        {
          "text": "because",
          "isCorrect": false,
          "explanationFa": "علت و معلول نیست."
        },
        {
          "text": "in summary",
          "isCorrect": false,
          "explanationFa": "جمع‌بندی نیست بلکه کشف الگوست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "different sources",
        "promptFa": "اصطلاح آکادمیک برای جریان‌های داده ناهمگن و گسسته انتخاب کن:",
        "upgrades": [
          {
            "text": "disparate and divergent intelligence streams",
            "isCorrect": true,
            "explanationFa": "disparate and divergent یعنی منابع ناهمگون و واگرا که سنتز شده‌اند."
          },
          {
            "text": "many books",
            "isCorrect": false,
            "explanationFa": "بی‌ربط است."
          }
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
      "acceptableAnswers": [
        "corroborate",
        "substantiate",
        "verify"
      ],
      "typingHintFa": "فعل ۱۱ حرفی صحه‌گذاری و تایید (c-o-r-r-o-b-o-r-a-t-e).",
      "explanationFa": "corroborate یعنی تأیید و تقویت ادعا با شواهد مستقل دیگر.",
      "quickChips": [
        "corroborate",
        "deny",
        "doubt"
      ]
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
        {
          "id": "c1",
          "text": "Agencies"
        },
        {
          "id": "c2",
          "text": "are"
        },
        {
          "id": "c3",
          "text": "hereby"
        },
        {
          "id": "c4",
          "text": "directed"
        },
        {
          "id": "c5",
          "text": "to"
        },
        {
          "id": "c6",
          "text": "isolate"
        },
        {
          "id": "c7",
          "text": "all"
        },
        {
          "id": "c8",
          "text": "endpoints."
        },
        {
          "id": "d1",
          "text": "directing",
          "isDistractor": true,
          "distractorReasonFa": "در ساختار مجهول رسمی are hereby directed شکل مفعولی می‌آید نه فاعلی."
        }
      ],
      "correctSequence": [
        "Agencies",
        "are",
        "hereby",
        "directed",
        "to",
        "isolate",
        "all",
        "endpoints."
      ],
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
        {
          "text": "any",
          "isCorrect": false,
          "explanationFa": "کلمه ربط نیست."
        },
        {
          "text": "furthermore",
          "isCorrect": true,
          "explanationFa": "furthermore بعد ضمانت اجرایی را به الزام اولیه وصل می‌کند."
        },
        {
          "text": "although",
          "isCorrect": false,
          "explanationFa": "تضادی وجود ندارد."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "bad work",
        "promptFa": "اصطلاح سنگین حقوقی برای اهمال و قصور در انجام وظیفه انتخاب کن:",
        "upgrades": [
          {
            "text": "gross dereliction of statutory duty",
            "isCorrect": true,
            "explanationFa": "gross dereliction of statutory duty یعنی قصور فاحش و خیانت در اجرای وظیفه قانونی."
          },
          {
            "text": "lazy behavior",
            "isCorrect": false,
            "explanationFa": "lazy behavior عامیانه است."
          }
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
      "acceptableAnswers": [
        "unconditionally",
        "strictly"
      ],
      "typingHintFa": "کلمه ۱۵ حرفی بی قید و شرط (u-n-c-o-n-d-i-t-i-o-n-a-l-l-y).",
      "explanationFa": "unconditionally یعنی به طور مطلق و بدون هیچ استثنایی.",
      "quickChips": [
        "unconditionally",
        "partly",
        "later"
      ]
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
    "isBossStage": true,
    "round1": {
      "id": "w-c1-10-r1",
      "roundTitleFa": "چیدمان بیانیه دکترین نهایی",
      "promptFa": "کارت‌های بیانیه استراتژیک سند سفید را مرتب کن:",
      "promptEn": "Assemble the master white paper doctrine declaration:",
      "hintFa": "Only through unified multilateral consensus can planetary cyberspace be safeguarded.",
      "goldenRuleFa": "نکته طلایی: ساختار وارونگی با Only through: Only through [X] can [Y] be achieved.",
      "scrambledChips": [
        {
          "id": "c1",
          "text": "Only"
        },
        {
          "id": "c2",
          "text": "through"
        },
        {
          "id": "c3",
          "text": "multilateral"
        },
        {
          "id": "c4",
          "text": "cooperation"
        },
        {
          "id": "c5",
          "text": "can"
        },
        {
          "id": "c6",
          "text": "digital"
        },
        {
          "id": "c7",
          "text": "sovereignty"
        },
        {
          "id": "c8",
          "text": "prevail."
        },
        {
          "id": "d1",
          "text": "digital sovereignty can",
          "isDistractor": true,
          "distractorReasonFa": "در ساختار وارونگی بعد از Only through باید فعل کمکی can جلوتر از فاعل digital sovereignty بیاید!"
        }
      ],
      "correctSequence": [
        "Only",
        "through",
        "multilateral",
        "cooperation",
        "can",
        "digital",
        "sovereignty",
        "prevail."
      ],
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
        {
          "text": "consequently",
          "isCorrect": true,
          "explanationFa": "consequently برهان قاطع و جمع‌بندی بیانیه جهانی را رقم می‌زند."
        },
        {
          "text": "on the other hand",
          "isCorrect": false,
          "explanationFa": "دیدگاه متضاد نیست بلکه الزام نهایی است."
        },
        {
          "text": "for example",
          "isCorrect": false,
          "explanationFa": "مثال جزئی نیست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "must do it",
        "promptFa": "اصطلاح فلسفی-سیاسی عالی برای امر حیاتی و غیرقابل اجتناب انتخاب کن:",
        "upgrades": [
          {
            "text": "categorical and existential imperative",
            "isCorrect": true,
            "explanationFa": "categorical and existential imperative یعنی امر مطلق و ضرورت تام وجودی."
          },
          {
            "text": "urgent chore",
            "isCorrect": false,
            "explanationFa": "chore یعنی کار خسته‌کننده منزل!"
          }
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
      "acceptableAnswers": [
        "consensus",
        "accord",
        "treaty"
      ],
      "typingHintFa": "کلمه ۹ حرفی اجماع و وفاق (c-o-n-s-e-n-s-u-s).",
      "explanationFa": "an unprecedented consensus یعنی اجماعی بی‌سابقه و تاریخی بین تمام کشورها.",
      "quickChips": [
        "consensus",
        "clash",
        "rift"
      ]
    }
  }
];

// ============================================================================
// C2 CASES: PROTOCOL ZERO: SUPREME STATECRAFT (اتاق فرماندهی عالی و اسناد فوق‌محرمانه)
// ============================================================================
export const C2_WRITING_CASES: WritingStageCase[] = [
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
        {
          "id": "c1",
          "text": "Not"
        },
        {
          "id": "c2",
          "text": "by"
        },
        {
          "id": "c3",
          "text": "force"
        },
        {
          "id": "c4",
          "text": "did"
        },
        {
          "id": "c5",
          "text": "they"
        },
        {
          "id": "c6",
          "text": "conquer,"
        },
        {
          "id": "c7",
          "text": "but"
        },
        {
          "id": "c8",
          "text": "by"
        },
        {
          "id": "c9",
          "text": "reason."
        },
        {
          "id": "d1",
          "text": "they conquered by",
          "isDistractor": true,
          "distractorReasonFa": "در تقارن بلاغی عالی C2 بعد از Not by force باید did they conquer بیاید نه فاعل مستقیم."
        }
      ],
      "correctSequence": [
        "Not",
        "by",
        "force",
        "did",
        "they",
        "conquer,",
        "but",
        "by",
        "reason."
      ],
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
        {
          "text": "yet, in the final calculus",
          "isCorrect": true,
          "explanationFa": "yet, in the final calculus یعنی «با این همه، در فرجامین سنجش و داوری تاریخ» که تجلی کمال رایتینگ است."
        },
        {
          "text": "because of this",
          "isCorrect": false,
          "explanationFa": "علت و معلول نیست."
        },
        {
          "text": "similarly",
          "isCorrect": false,
          "explanationFa": "تشابه نیست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "good writing",
        "promptFa": "اصطلاح ادبی در اوج کمال برای بلاغت سحرانگیز انتخاب کن:",
        "upgrades": [
          {
            "text": "consummate stylistic transcendence",
            "isCorrect": true,
            "explanationFa": "consummate stylistic transcendence یعنی اوج تعالی، پختگی و درخشش سبکی."
          },
          {
            "text": "pretty letters",
            "isCorrect": false,
            "explanationFa": "کودکانه است!"
          }
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
      "acceptableAnswers": [
        "eloquence",
        "rhetoric"
      ],
      "typingHintFa": "کلمه ۹ حرفی فصاحت و بلاغت (e-l-o-q-u-e-n-c-e).",
      "explanationFa": "majestic eloquence یعنی فصاحت باصلابت و باشکوه کلامی.",
      "quickChips": [
        "eloquence",
        "noise",
        "haste"
      ]
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
        {
          "id": "c1",
          "text": "Under"
        },
        {
          "id": "c2",
          "text": "no"
        },
        {
          "id": "c3",
          "text": "circumstances"
        },
        {
          "id": "c4",
          "text": "shall"
        },
        {
          "id": "c5",
          "text": "any"
        },
        {
          "id": "c6",
          "text": "state"
        },
        {
          "id": "c7",
          "text": "breach"
        },
        {
          "id": "c8",
          "text": "this."
        },
        {
          "id": "d1",
          "text": "any state shall",
          "isDistractor": true,
          "distractorReasonFa": "بعد از عبارت بازدارنده منفی Under no circumstances فعل کمکی shall حتماً قبل از فاعل می‌آید."
        }
      ],
      "correctSequence": [
        "Under",
        "no",
        "circumstances",
        "shall",
        "any",
        "state",
        "breach",
        "this."
      ],
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
        {
          "text": "in consequence whereof",
          "isCorrect": true,
          "explanationFa": "in consequence whereof عبارتی به غایت رسمی و فاخر در معاهدات بین‌المللی است."
        },
        {
          "text": "so",
          "isCorrect": false,
          "explanationFa": "خیلی سطحی است."
        },
        {
          "text": "however",
          "isCorrect": false,
          "explanationFa": "تضادی نیست بلکه تاکید تکمیلی است."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "cannot change it",
        "promptFa": "اصطلاح فقهی-حقوقی بین‌المللی برای تعهد خدشه‌ناپذیر و قطعی انتخاب کن:",
        "upgrades": [
          {
            "text": "immutable and non-derogable obligation",
            "isCorrect": true,
            "explanationFa": "immutable and non-derogable یعنی تعهد تغییرناپذیر و تخفیف‌ناپذیر."
          },
          {
            "text": "hard rule",
            "isCorrect": false,
            "explanationFa": "hard rule زبان محاوره است."
          }
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
      "acceptableAnswers": [
        "watertight",
        "invulnerable",
        "indisputable"
      ],
      "typingHintFa": "کلمه ۱۰ حرفی غیرقابل رخنه (w-a-t-e-r-t-i-g-h-t).",
      "explanationFa": "a watertight framework یعنی چارچوبی کاملاً نفوذناپذیر بدون هیچ راه فرار قانونی.",
      "quickChips": [
        "watertight",
        "porous",
        "loose"
      ]
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
        {
          "id": "c1",
          "text": "Verifying"
        },
        {
          "id": "c2",
          "text": "truth"
        },
        {
          "id": "c3",
          "text": "without"
        },
        {
          "id": "c4",
          "text": "revealing"
        },
        {
          "id": "c5",
          "text": "content"
        },
        {
          "id": "c6",
          "text": "anchors"
        },
        {
          "id": "c7",
          "text": "the"
        },
        {
          "id": "c8",
          "text": "system."
        },
        {
          "id": "d1",
          "text": "verify",
          "isDistractor": true,
          "distractorReasonFa": "در جایگاه فاعل باید شکل اسم مصدر Verifying باشد."
        }
      ],
      "correctSequence": [
        "Verifying",
        "truth",
        "without",
        "revealing",
        "content",
        "anchors",
        "the",
        "system."
      ],
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
        {
          "text": "whilst",
          "isCorrect": true,
          "explanationFa": "whilst فرم سنتی و بسیار فاخرتر while برای تقابل آکادمیک در رده C2 است."
        },
        {
          "text": "because",
          "isCorrect": false,
          "explanationFa": "علت و معلول نیست."
        },
        {
          "text": "unless",
          "isCorrect": false,
          "explanationFa": "شرط منفی نیست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "hard math",
        "promptFa": "اصطلاح آکادمیک برای پیچیدگی غیرقابل تقلیل ریاضی انتخاب کن:",
        "upgrades": [
          {
            "text": "irreducible computational intractability",
            "isCorrect": true,
            "explanationFa": "اصطلاحی در اوج ادبیات علوم کامپیوتر نظری برای سختی حل‌ناپذیر محاسباتی."
          },
          {
            "text": "difficult sums",
            "isCorrect": false,
            "explanationFa": "زبان ابتدایی دبستان است!"
          }
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
      "acceptableAnswers": [
        "epistemic",
        "epistemological"
      ],
      "typingHintFa": "کلمه ۹ حرفی آپیستمیک (e-p-i-s-t-e-m-i-c).",
      "explanationFa": "epistemic horizons یعنی افق‌های شناخت و معرفت انسانی.",
      "quickChips": [
        "epistemic",
        "optical",
        "simple"
      ]
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
        {
          "id": "c1",
          "text": "The"
        },
        {
          "id": "c2",
          "text": "destruction"
        },
        {
          "id": "c3",
          "text": "constitutes"
        },
        {
          "id": "c4",
          "text": "prima"
        },
        {
          "id": "c5",
          "text": "facie"
        },
        {
          "id": "c6",
          "text": "proof"
        },
        {
          "id": "c7",
          "text": "of"
        },
        {
          "id": "c8",
          "text": "intent."
        },
        {
          "id": "d1",
          "text": "constituting",
          "isDistractor": true,
          "distractorReasonFa": "در نقش فعل اصلی جمله باید constitutes باشد."
        }
      ],
      "correctSequence": [
        "The",
        "destruction",
        "constitutes",
        "prima",
        "facie",
        "proof",
        "of",
        "intent."
      ],
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
        {
          "text": "be that as it may, however",
          "isCorrect": false,
          "explanationFa": "حشو زبانی است."
        },
        {
          "text": "yet, by virtue of jus cogens",
          "isCorrect": true,
          "explanationFa": "yet, by virtue of jus cogens یعنی «با این حال، به حکم قواعد آمره بین‌المللی» که نهایت غنای حقوقی C2 است."
        },
        {
          "text": "because",
          "isCorrect": false,
          "explanationFa": "خیلی سطحی است."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "bad crime",
        "promptFa": "اصطلاح لاتین-حقوقی برای جنایات وجدان‌ستیز بشری انتخاب کن:",
        "upgrades": [
          {
            "text": "heinous transgressions offending the conscience of humanity",
            "isCorrect": true,
            "explanationFa": "عبارتی کلاسیک در ادبیات احکام نورنبرگ و لاهه."
          },
          {
            "text": "illegal behavior",
            "isCorrect": false,
            "explanationFa": "زبان اداری معمولی است."
          }
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
      "acceptableAnswers": [
        "jus cogens"
      ],
      "typingHintFa": "ترکیب دو کلمه‌ای ژوس کوژنس (j-u-s  c-o-g-e-n-s).",
      "explanationFa": "jus cogens یعنی قواعد بنیادین حقوق بین‌الملل که هیچ معاهده‌ای نمی‌تواند برخلاف آن باشد.",
      "quickChips": [
        "jus cogens",
        "ad hoc",
        "de facto"
      ]
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
        {
          "id": "c1",
          "text": "We"
        },
        {
          "id": "c2",
          "text": "reserve"
        },
        {
          "id": "c3",
          "text": "the"
        },
        {
          "id": "c4",
          "text": "prerogative"
        },
        {
          "id": "c5",
          "text": "to"
        },
        {
          "id": "c6",
          "text": "respond"
        },
        {
          "id": "c7",
          "text": "proportionately."
        },
        {
          "id": "d1",
          "text": "reserving",
          "isDistractor": true,
          "distractorReasonFa": "فعل اصلی We reserve باید ساده باشد."
        }
      ],
      "correctSequence": [
        "We",
        "reserve",
        "the",
        "prerogative",
        "to",
        "respond",
        "proportionately."
      ],
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
        {
          "text": "nevertheless, for the present juncture",
          "isCorrect": true,
          "explanationFa": "ترکیبی استادانه برای ایجاد پنجره مذاکره همراه با حفظ خط قرمز."
        },
        {
          "text": "because",
          "isCorrect": false,
          "explanationFa": "علت و معلول نیست."
        },
        {
          "text": "in summary",
          "isCorrect": false,
          "explanationFa": "جمع‌بندی نیست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "we have rights",
        "promptFa": "اصطلاح حاکمیتی برای حق ذاتی و انحصاری پاسخ دفاعی انتخاب کن:",
        "upgrades": [
          {
            "text": "inalienable sovereign prerogative",
            "isCorrect": true,
            "explanationFa": "inalienable sovereign prerogative یعنی حق ویژه و سلب‌ناپذیر حاکمیت ملی."
          },
          {
            "text": "normal permission",
            "isCorrect": false,
            "explanationFa": "normal permission برای حاکمیت ملی بی‌معنی است."
          }
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
      "acceptableAnswers": [
        "prerogative",
        "privilege"
      ],
      "typingHintFa": "کلمه ۱۱ حرفی حق ویژه (p-r-e-r-o-g-a-t-i-v-e).",
      "explanationFa": "prerogative یعنی اختیارات ویژه انحصاری یک نهاد حاکمیتی.",
      "quickChips": [
        "prerogative",
        "hobby",
        "habit"
      ]
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
        {
          "id": "c1",
          "text": "Syntactic"
        },
        {
          "id": "c2",
          "text": "manipulation"
        },
        {
          "id": "c3",
          "text": "does"
        },
        {
          "id": "c4",
          "text": "not"
        },
        {
          "id": "c5",
          "text": "beget"
        },
        {
          "id": "c6",
          "text": "subjective"
        },
        {
          "id": "c7",
          "text": "conscious"
        },
        {
          "id": "c8",
          "text": "experience."
        },
        {
          "id": "d1",
          "text": "begetting",
          "isDistractor": true,
          "distractorReasonFa": "بعد از does not فعل ساده beget می‌آید."
        }
      ],
      "correctSequence": [
        "Syntactic",
        "manipulation",
        "does",
        "not",
        "beget",
        "subjective",
        "conscious",
        "experience."
      ],
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
        {
          "text": "pari passu with which",
          "isCorrect": false,
          "explanationFa": "معنای هم‌گامی دارد نه تضاد مفهومی."
        },
        {
          "text": "notwithstanding, however, the phenomenological reality that",
          "isCorrect": true,
          "explanationFa": "اوج شکوه نثر فلسفی آکادمیک برای تفکیک شبیه‌سازی از آگاهی اصیل."
        },
        {
          "text": "so",
          "isCorrect": false,
          "explanationFa": "بسیار مبتدی است."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "thinking machine",
        "promptFa": "اصطلاح فلسفی دقیق برای موجود دارای آگاهی و شعور درونی انتخاب کن:",
        "upgrades": [
          {
            "text": "sentient entity endowed with introspective awareness",
            "isCorrect": true,
            "explanationFa": "sentient entity endowed with introspective awareness یعنی موجود دارای آگاهی و ادراک درون‌نگرانه."
          },
          {
            "text": "smart robot",
            "isCorrect": false,
            "explanationFa": "smart robot واژه‌ای دم‌دستی است."
          }
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
      "acceptableAnswers": [
        "qualia"
      ],
      "typingHintFa": "کلمه ۶ حرفی کوالیا (q-u-a-l-i-a).",
      "explanationFa": "qualia در فلسفه ذهن یعنی چگونگی احساسِ درونی پدیده‌ها (مثل قرمزی رنگ قرمز).",
      "quickChips": [
        "qualia",
        "matter",
        "code"
      ]
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
        {
          "id": "c1",
          "text": "The"
        },
        {
          "id": "c2",
          "text": "diffusion"
        },
        {
          "id": "c3",
          "text": "of"
        },
        {
          "id": "c4",
          "text": "technology"
        },
        {
          "id": "c5",
          "text": "portends"
        },
        {
          "id": "c6",
          "text": "a"
        },
        {
          "id": "c7",
          "text": "multipolar"
        },
        {
          "id": "c8",
          "text": "order."
        },
        {
          "id": "d1",
          "text": "portending",
          "isDistractor": true,
          "distractorReasonFa": "در جایگاه فعل اصلی باید portends بیاید."
        }
      ],
      "correctSequence": [
        "The",
        "diffusion",
        "of",
        "technology",
        "portends",
        "a",
        "multipolar",
        "order."
      ],
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
        {
          "text": "even as",
          "isCorrect": true,
          "explanationFa": "even as یعنی درست در همان زمانی که... و برای تقارن روندهای تاریخی ژئوپلیتیک بی‌نظیر است."
        },
        {
          "text": "because of which",
          "isCorrect": false,
          "explanationFa": "رابطه مستقیم سببی صرف نیست."
        },
        {
          "text": "instead",
          "isCorrect": false,
          "explanationFa": "جایگزینی نیست."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "big changes",
        "promptFa": "اصطلاح آکادمیک برای دگرگونی بنیادین و ناگهانی در ساختار نظم بین‌الملل انتخاب کن:",
        "upgrades": [
          {
            "text": "tectonic realignment of the international system",
            "isCorrect": true,
            "explanationFa": "tectonic realignment یعنی بازآرایی زلزله‌مانند و عمیق صفحات قدرت بین‌المللی."
          },
          {
            "text": "shifts and stuff",
            "isCorrect": false,
            "explanationFa": "stuff عامیانه و سخیف است!"
          }
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
      "acceptableAnswers": [
        "portend",
        "herald",
        "presage"
      ],
      "typingHintFa": "فعل ۷ حرفی نوید دادن رخداد (p-o-r-t-e-n-d).",
      "explanationFa": "portend یعنی خبر دادن از رویدادهای سرنوشت‌ساز آینده.",
      "quickChips": [
        "portend",
        "stop",
        "forget"
      ]
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
        {
          "id": "c1",
          "text": "Behind"
        },
        {
          "id": "c2",
          "text": "the"
        },
        {
          "id": "c3",
          "text": "facade"
        },
        {
          "id": "c4",
          "text": "lies"
        },
        {
          "id": "c5",
          "text": "an"
        },
        {
          "id": "c6",
          "text": "insidious"
        },
        {
          "id": "c7",
          "text": "logical"
        },
        {
          "id": "c8",
          "text": "fallacy."
        },
        {
          "id": "d1",
          "text": "lying",
          "isDistractor": true,
          "distractorReasonFa": "در ساختار واژگون مکانی Behind the facade فعل lies قبل از فاعل می‌آید نه اسم فاعل."
        }
      ],
      "correctSequence": [
        "Behind",
        "the",
        "facade",
        "lies",
        "an",
        "insidious",
        "logical",
        "fallacy."
      ],
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
        {
          "text": "ipso facto",
          "isCorrect": true,
          "explanationFa": "ipso facto یعنی «به خودی خود / دقیقاً به همین سبب» و در منطق فلسفی و حقوقی نهایت استدلال است."
        },
        {
          "text": "as well",
          "isCorrect": false,
          "explanationFa": "بسیار سطحی است."
        },
        {
          "text": "though",
          "isCorrect": false,
          "explanationFa": "تضادی وجود ندارد."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "fake argument",
        "promptFa": "اصطلاح درجات عالی برای استدلال مغالطه‌آمیز سفسطه‌گران انتخاب کن:",
        "upgrades": [
          {
            "text": "specious sophistry",
            "isCorrect": true,
            "explanationFa": "specious sophistry یعنی سفسطه ظاهراً فریبنده اما اساساً باطل و گمراه‌کننده."
          },
          {
            "text": "bad debate",
            "isCorrect": false,
            "explanationFa": "عامیانه است."
          }
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
      "acceptableAnswers": [
        "ipso facto"
      ],
      "typingHintFa": "ترکیب دو کلمه‌ای ایپستو فکتو (i-p-s-o  f-a-c-t-o).",
      "explanationFa": "ipso facto یعنی به حکم همان واقعیت و فی‌نفسه.",
      "quickChips": [
        "ipso facto",
        "ex post facto",
        "inter alia"
      ]
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
        {
          "id": "c1",
          "text": "Confusing"
        },
        {
          "id": "c2",
          "text": "cyclical"
        },
        {
          "id": "c3",
          "text": "crises"
        },
        {
          "id": "c4",
          "text": "with"
        },
        {
          "id": "c5",
          "text": "secular"
        },
        {
          "id": "c6",
          "text": "decay"
        },
        {
          "id": "c7",
          "text": "is"
        },
        {
          "id": "c8",
          "text": "fatal."
        },
        {
          "id": "d1",
          "text": "confuse",
          "isDistractor": true,
          "distractorReasonFa": "در نقش فاعل گزاره اسمی باید Confusing باشد."
        }
      ],
      "correctSequence": [
        "Confusing",
        "cyclical",
        "crises",
        "with",
        "secular",
        "decay",
        "is",
        "fatal."
      ],
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
        {
          "text": "yet, amidst the panic",
          "isCorrect": true,
          "explanationFa": "ترکیبی باشکوه برای انتقال حس درام بازارها در عین آرامش تحلیلی."
        },
        {
          "text": "because",
          "isCorrect": false,
          "explanationFa": "علت و معلول نیست."
        },
        {
          "text": "in addition",
          "isCorrect": false,
          "explanationFa": "تضاد است نه توسعه هم‌جهت."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "strong institutions",
        "promptFa": "اصطلاح علوم سیاسی برای ساختار نهادی شکست‌ناپذیر انتخاب کن:",
        "upgrades": [
          {
            "text": "unyielding institutional fortitude",
            "isCorrect": true,
            "explanationFa": "unyielding institutional fortitude یعنی صلابت و استواری تزلزل‌ناپذیر نهادی."
          },
          {
            "text": "tough offices",
            "isCorrect": false,
            "explanationFa": "tough offices محاوره‌ای است."
          }
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
      "acceptableAnswers": [
        "secular",
        "structural"
      ],
      "typingHintFa": "کلمه ۷ حرفی سکولار در معنای اقتصادی درازمدت (s-e-c-u-l-a-r).",
      "explanationFa": "secular stagnation یعنی رکود ساختاری و ماندگار در طول چندین دهه.",
      "quickChips": [
        "secular",
        "sudden",
        "short"
      ]
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
    "isBossStage": true,
    "round1": {
      "id": "w-c2-10-r1",
      "roundTitleFa": "چیدمان دیباچه منشور تاریخ‌ساز",
      "promptFa": "کارت‌های دیباچه باشکوه منشور جهانی را به ترتیب جاودانه بچین:",
      "promptEn": "Assemble the immortal preamble declaration of the global charter:",
      "hintFa": "Herein lies the inviolable covenant reconciling human sovereignty with emergent sentience.",
      "goldenRuleFa": "نکته طلایی: عبارت تاریخی قله رایتینگ: Herein lies the inviolable covenant (در این سند پیمان نقض‌ناپذیر ثبت است).",
      "scrambledChips": [
        {
          "id": "c1",
          "text": "Herein"
        },
        {
          "id": "c2",
          "text": "lies"
        },
        {
          "id": "c3",
          "text": "the"
        },
        {
          "id": "c4",
          "text": "covenant"
        },
        {
          "id": "c5",
          "text": "reconciling"
        },
        {
          "id": "c6",
          "text": "humanity"
        },
        {
          "id": "c7",
          "text": "with"
        },
        {
          "id": "c8",
          "text": "intelligence."
        },
        {
          "id": "d1",
          "text": "laying",
          "isDistractor": true,
          "distractorReasonFa": "در ساختار واژگون اسناد کهن Herein lies به کار می‌رود نه laying."
        }
      ],
      "correctSequence": [
        "Herein",
        "lies",
        "the",
        "covenant",
        "reconciling",
        "humanity",
        "with",
        "intelligence."
      ],
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
        {
          "text": "and",
          "isCorrect": true,
          "explanationFa": "and برای تقارن دو وارونگی Neither shall ... nor shall تجلی کمال رایتینگ است."
        },
        {
          "text": "because",
          "isCorrect": false,
          "explanationFa": "نامناسب است."
        },
        {
          "text": "or else",
          "isCorrect": false,
          "explanationFa": "لحن تهدیدآمیز بی‌ربط است."
        }
      ],
      "lexicalUpgrade": {
        "originalWord": "good future",
        "promptFa": "اصطلاح در اوج شکوه ادبی برای همبستگی و سعادت اعصار آینده انتخاب کن:",
        "upgrades": [
          {
            "text": "harmonious symbiotic posterity",
            "isCorrect": true,
            "explanationFa": "harmonious symbiotic posterity یعنی نسلی هماهنگ، هم‌زیست و قرین سعادت و جاودانگی."
          },
          {
            "text": "cool tomorrow",
            "isCorrect": false,
            "explanationFa": "عامیانه و سطحی است."
          }
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
      "acceptableAnswers": [
        "covenant",
        "charter",
        "compact"
      ],
      "typingHintFa": "کلمه ۸ حرفی کاوننت به معنی عهد و میثاق (c-o-v-e-n-a-n-t).",
      "explanationFa": "this eternal covenant یعنی این میثاق و عهد جاودان بین تمام نسل‌های هستی.",
      "quickChips": [
        "covenant",
        "deal",
        "note"
      ]
    }
  }
];

export const ALL_WRITING_CASES: Record<CefrLevel, WritingStageCase[]> = {
  A1: A1_WRITING_CASES,
  A2: A2_WRITING_CASES,
  B1: B1_WRITING_CASES,
  B2: B2_WRITING_CASES,
  C1: C1_WRITING_CASES,
  C2: C2_WRITING_CASES,
};

export function getWritingStageCasesByCefr(cefr: CefrLevel): WritingStageCase[] {
  return ALL_WRITING_CASES[cefr] || [];
}

export function getWritingStageCase(cefr: CefrLevel, levelNumber: number): WritingStageCase | undefined {
  const cases = getWritingStageCasesByCefr(cefr);
  return cases.find((c) => c.levelNumber === levelNumber);
}

export function getWritingDailyBounty(): DailyBountyMeta {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
  );
  const tiers: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const selectedCefr = tiers[dayOfYear % tiers.length];
  const selectedLvl = (dayOfYear % 10) + 1;
  const stageCase = getWritingStageCase(selectedCefr, selectedLvl) || A1_WRITING_CASES[0];

  return {
    cefr: selectedCefr,
    levelNumber: selectedLvl,
    caseCode: stageCase.caseCode,
    titleFa: stageCase.stageTitleFa,
    bountyBonusXp: 120,
    taglineFa: "پرونده طلایی امروز: حل مأموریت ویژه با امتیاز ۲ برابر و پین شدن روی تابلوی شهر!",
  };
}

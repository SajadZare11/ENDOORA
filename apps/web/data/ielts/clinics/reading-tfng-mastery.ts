import type { IeltsClinicData } from "@endoora/contracts";

export const READING_TFNG_CLINIC: IeltsClinicData = {
  id: "reading-tfng-mastery",
  skill: "reading",
  titleFa: "تله‌شناسی True / False / Not Given",
  titleEn: "The Not Given Decryption Protocol",
  targetBands: "باند ۶.۵ تا ۸.۵",
  estimatedMinutes: 20,
  heroIcon: "🎯",
  badgeLabelFa: "رمزگشایی Not Given",
  hurdleSummaryFa:
    "بزرگ‌ترین کابوس داوطلبان آیلتس: تشخیص مرز باریک میان Not Given و False و شناسایی تله کلمات محدودکننده (مانند only، all، predominantly).",

  // Stage 1: Strategy Guide
  strategyGuide: {
    corePrinciplesFa: [
      "قانون طلایی تناقض: پاسخ تنها زمانی FALSE است که متن صراحتاً خلاف آن را اثبات کند یا امکان هم‌زمانی دو گزاره صفر باشد.",
      "اگر برای اثبات درستی یک جمله مجبورید دانش عمومی یا فرضیات شخصی خود را به متن اضافه کنید، پاسخ بدون شک NOT GIVEN است.",
      "مراقب واژگان محدودکننده (Qualifying Words) باشید: تغییر 'often' به 'always' یا 'some' به 'all' پاسخ را مستقیم به FALSE تبدیل می‌کند.",
      "ترتیب سوالات در متن رعایت می‌شود: سوالات T/F/NG تقریباً همیشه بر اساس ترتیب پاراگراف‌های متن چیده شده‌اند.",
    ],
    goldenFormulaFa:
      "TRUE = عین مفهوم در متن هست (با کلمات پارافریز شده) | FALSE = متن صریحاً عکس این ادعا را ثابت می‌کند | NOT GIVEN = متن درباره این مقایسه یا جزئیات سکوت کرده است.",
    goldenFormulaEn:
      "TRUE: 100% facts align | FALSE: Text contradicts statement directly | NOT GIVEN: Information is missing, unconfirmed, or speculative.",
    timeManagementTipFa:
      "برای هر سوال حداکثر ۷۵ ثانیه زمان بگذارید. اگر بعد از خواندن پاراگراف مربوطه شواهدی برای رد یا تایید نیافتید، سریعاً Not Given را انتخاب کنید و متوقف نشوید.",
    keyVocabulary: [
      { word: "contradict", fa: "تناقض داشتن، رد کردن", ipa: "/ˌkɒn.trəˈdɪkt/" },
      { word: "qualifying word", fa: "کلمه مقیدکننده (مانند اغلب، تنها، تمام)", ipa: "/ˈkwɒl.ɪ.faɪ.ɪŋ wɜːd/" },
      { word: "unsubstantiated", fa: "بی‌پایه، اثبات‌نشده در متن", ipa: "/ˌʌn.səbˈstæn.ʃi.eɪ.tɪd/" },
      { word: "paraphrase", fa: "بیان مجدد با عبارات مترادف", ipa: "/ˈpær.ə.freɪz/" },
    ],
  },

  // Stage 2: Trap Deconstruction
  trapDeconstructions: [
    {
      id: "trap-1-common-knowledge",
      trapTitleFa: "تله دانش عمومی شخصی (Assumption Fallacy)",
      trapTitleEn: "Bringing Outside World Knowledge into the Text",
      contextPassageOrPrompt:
        "Passage: 'Ancient Roman aqueducts supplied clean mountain water to public baths throughout the capital.'\nQuestion: 'Roman citizens paid higher property taxes because of the construction of aqueducts.'",
      commonWrongChoice: "TRUE (یا FALSE بر اساس حدس منطقی که ساخت آبراهه هزینه داشته است)",
      whyWrongFa:
        "داوطلب با تکیه بر اطلاعات تاریخی یا منطق روزمره فکر می‌کند احداث سازه‌ای عظیم قطعاً مالیات شهروندان را افزایش داده است.",
      correctChoice: "NOT GIVEN",
      whyCorrectFa:
        "متن صرفاً به انتقال آب پاک به حمام‌های عمومی اشاره دارد و هیچ اطلاعاتی درباره نحوه تامین مالی، مالیات املاک یا هزینه شهروندان ارائه نداده است.",
      examinerSecretFa:
        "اگزمینر دقیقاً مواردی را مطرح می‌کند که به نظر عقلانی می‌آیند اما در متن وجود ندارند تا تمایز داوطلب دقیق را بسنجد.",
    },
    {
      id: "trap-2-quantifier-switch",
      trapTitleFa: "تله تغییر سور و کمیت‌نما (Quantifier Shift)",
      trapTitleEn: "Distorting 'Predominantly' into 'Exclusively'",
      contextPassageOrPrompt:
        "Passage: 'While wolves feed predominantly on large ungulates such as deer, they frequently supplement their diet with rodents and wild berries during summer months.'\nQuestion: 'Wolves subsist entirely on large mammals throughout the entire year.'",
      commonWrongChoice: "NOT GIVEN (به گمان اینکه رژیم غذایی فصلی نامشخص است)",
      whyWrongFa:
        "داوطلب واژه predominantly (عمدتاً) را دیده و متوجه تناقض کلمه entirely (منحصراً) با توت‌ها و جوندگان نمی‌شود.",
      correctChoice: "FALSE",
      whyCorrectFa:
        "متن صریحاً اعلام می‌کند که گرگ‌ها جوندگان و توت نیز مصرف می‌کنند، بنابراین ادعای تغذیه 'منحصراً از پستانداران بزرگ در تمام سال' ۱۰۰٪ نادرست است.",
      examinerSecretFa:
        "واژگانی چون entirely, exclusively, solely تله‌های قطعی سازندگان آزمون برای گزاره‌های FALSE هستند.",
    },
  ],

  // Stage 3: Live Drills
  drills: [
    {
      id: "tfng-q1",
      orderNumber: 1,
      promptFa: "بر اساس بند زیر، وضعیت گزاره مشخص شده چیست؟",
      promptEn: "Determine whether the statement is TRUE, FALSE, or NOT GIVEN according to the passage.",
      passageSnippet:
        "Autonomous electric shuttles were first piloted in downtown Helsinki during the spring of 2019. Initial public surveys revealed that commuter satisfaction was over 85%, largely attributed to the punctual timetables and absence of erratic braking common in manual buses.",
      options: ["TRUE", "FALSE", "NOT GIVEN"],
      correctAnswerIndex: 0,
      trapTypeBadge: "#ParaphraseMatch",
      explanation: {
        briefFa: "گزاره کاملاً با متن منطبق است (بیش از ۸۵٪ رضایت به دلیل زمان‌بندی دقیق و حرکت روان).",
        detailedFa:
          "صورت سوال می‌گوید 'مسافران اولیه از دقت و آرامش حرکت شاتل‌های بدون راننده رضایت داشتند'؛ متن مستقیماً رضایت بالای ۸۵ درصدی را به punctual timetables و نبود ترمزهای ناگهانی نسبت می‌دهد.",
        cambridgeTipFa:
          "عبارت 'commuter satisfaction' و 'punctual timetables' در متن مستقیماً گزاره را تایید می‌کند.",
      },
    },
    {
      id: "tfng-q2",
      orderNumber: 2,
      promptFa: "آیا گزاره زیر درباره هزینه نگهداری شاتل‌ها درست است؟",
      promptEn: "Statement: 'Operating autonomous shuttles in Helsinki proved cheaper than maintaining conventional diesel fleets.'",
      passageSnippet:
        "Autonomous electric shuttles were first piloted in downtown Helsinki during the spring of 2019. Initial public surveys revealed that commuter satisfaction was over 85%, largely attributed to the punctual timetables and absence of erratic braking common in manual buses.",
      options: ["TRUE", "FALSE", "NOT GIVEN"],
      correctAnswerIndex: 2,
      trapTypeBadge: "#CostAssumptionTrap",
      explanation: {
        briefFa: "متن هیچ اشاره‌ای به هزینه، بودجه یا مقایسه اقتصادی با اتوبوس‌های دیزلی نکرده است.",
        detailedFa:
          "داوطلب ممکن است فکر کند فناوری برقی معمولاً ارزان‌تر است، اما این متن فقط به رضایت مسافران پرداخته است. بنابراین پاسخ قطعاً NOT GIVEN است.",
        cambridgeTipFa:
          "هرگز حدس اقتصادی نزنید؛ اگر واژه هزینه (cost, budget, expense) در متن نیامده، پاسخ قطعی Not Given است.",
      },
    },
    {
      id: "tfng-q3",
      orderNumber: 3,
      promptFa: "آیا گزاره زیر درباره زمان راه‌اندازی این سیستم درست است؟",
      promptEn: "Statement: 'The autonomous shuttles were implemented simultaneously across all major Finnish metropolitan centers in 2019.'",
      passageSnippet:
        "Autonomous electric shuttles were first piloted in downtown Helsinki during the spring of 2019. Initial public surveys revealed that commuter satisfaction was over 85%, largely attributed to the punctual timetables and absence of erratic braking common in manual buses.",
      options: ["TRUE", "FALSE", "NOT GIVEN"],
      correctAnswerIndex: 1,
      trapTypeBadge: "#ScopeExaggerationTrap",
      explanation: {
        briefFa: "پاسخ FALSE است، زیرا پروژه تنها به عنوان طرح آزمایشی در مرکز شهر هلسینکی اجرا شد نه در همه کلان‌شهرهای فنلاند.",
        detailedFa:
          "متن می‌گوید 'first piloted in downtown Helsinki' (طرح آزمایشی محدود در مرکز هلسینکی)، در حالی که گزاره ادعا می‌کند 'simultaneously across all major Finnish metropolitan centers' که مستقیماً نقض متن است.",
        cambridgeTipFa:
          "کلمه piloted به معنی آزمایشی و محدود است و با ادعای 'all major centers' تناقض مستقیم دارد.",
      },
    },
    {
      id: "tfng-q4",
      orderNumber: 4,
      promptFa: "درباره تولید فیبر نوری، گزاره زیر را ارزیابی کنید:",
      promptEn: "Passage: 'Modern silica fibers transmit light pulses with minimal attenuation, though impurities like hydroxyl ions can absorb optical energy at specific infrared wavelengths.'\nStatement: 'Hydroxyl impurities prevent optical signals from passing through silica fibers at every infrared frequency.'",
      options: ["TRUE", "FALSE", "NOT GIVEN"],
      correctAnswerIndex: 1,
      trapTypeBadge: "#EveryVsSpecificTrap",
      explanation: {
        briefFa: "پاسخ FALSE است. متن می‌گوید جذب در 'طول‌موج‌های خاص' (specific) رخ می‌دهد نه در 'همه' فرکانس‌ها (every).",
        detailedFa:
          "تله کلاسیک کمبریج: تبدیل واژه specific به every. چون جذب فقط در نقاط خاص رخ می‌دهد، گزاره ادعای اغراق‌آمیز کرده و متناقض است.",
        cambridgeTipFa:
          "تفاوت واژه‌های specific / particular با every / all یکی از پرتکرارترین کلیدهای تشخیص گزینه FALSE است.",
      },
    },
    {
      id: "tfng-q5",
      orderNumber: 5,
      promptFa: "درباره مخترع فیبر نوری:",
      promptEn: "Passage: 'Modern silica fibers transmit light pulses with minimal attenuation, though impurities like hydroxyl ions can absorb optical energy at specific infrared wavelengths.'\nStatement: 'Charles Kao was awarded the Nobel Prize for identifying how hydroxyl impurities degrade fiber transmission.'",
      options: ["TRUE", "FALSE", "NOT GIVEN"],
      correctAnswerIndex: 2,
      trapTypeBadge: "#FamousFigureTrap",
      explanation: {
        briefFa: "متن اصلاً نامی از چارلز کائو یا جایزه نوبل نبرده است؛ پاسخ بدون شک NOT GIVEN است.",
        detailedFa:
          "اگرچه این گزاره در واقعیت تاریخی درست است (چارلز کائو نوبل فیزیک گرفت)، اما در متن ارائه‌شده هیچ نامی از وی یا جایزه وجود ندارد. معیار ما فقط و فقط متن است.",
        cambridgeTipFa:
          "حتی اگر دانشمند معروف یا حقیقت علمی معتبری در سوال آمد، تا زمانی که در متن نیست، پاسخ NOT GIVEN است.",
      },
    },
  ],
};

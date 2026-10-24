export type CEFRTier = "A1" | "A2" | "B1" | "B2" | "C1";

export type PathNodeType = "concept" | "receptive" | "speaking" | "leitner" | "boss" | "side_quest";

export type PathNodeStatus = "locked" | "available" | "completed";

export interface PathNode {
  id: string;
  unitId: string;
  order: number;
  titleFa: string;
  titleEn: string;
  type: PathNodeType;
  typeLabelFa: string;
  icon: string;
  xpReward: number;
  deepLinkHref: string;
  summaryFa: string;
  estimatedMinutes: number;
}

export interface BossQuestion {
  id: string;
  promptFa: string;
  questionTextEn: string;
  options: string[];
  correctIndex: number;
  explanationFa: string;
  audioSnippetTextEn?: string;
}

export interface PathUnit {
  id: string;
  tier: CEFRTier;
  tierLabelFa: string;
  unitNumber: number;
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  badgeIcon: string;
  nodes: PathNode[];
  bossQuestions: BossQuestion[];
  sideQuest?: {
    id: string;
    titleFa: string;
    descriptionFa: string;
    deepLinkHref: string;
    icon: string;
  };
}

export interface LearnerPathProgress {
  completedNodeIds: string[];
  unlockedUnitIds: string[];
  nodeStars: Record<string, number>;
  totalXp: number;
  currentStreak: number;
  lastActiveDate: string;
}

const STORAGE_KEY = "endoora_learning_path_v1";
const PLACEMENT_KEY = "endoora_placement_v1";

// 15 Comprehensive Units across 5 CEFR Tiers
export const CURRICULUM_UNITS: PathUnit[] = [
  // ==========================================
  // TIER 1: A1 BREAKTHROUGH (Units 1 - 3)
  // ==========================================
  {
    id: "unit-1",
    tier: "A1",
    tierLabelFa: "سطح A1: نقطه شروع و مکالمه پایه",
    unitNumber: 1,
    titleFa: "یونیت ۱: هویت، احوالپرسی و الفبای ارتباط",
    titleEn: "Unit 1: Identity, Greetings & First Contact",
    descriptionFa: "معرفی خود، ملیت‌ها، ضمایر فاعلی و فعل To Be در موقعیت‌های طبیعی روزمره.",
    badgeIcon: "👋",
    sideQuest: {
      id: "sq-1",
      titleFa: "مینی‌تمرین الفبا و هجی کردن نام‌ها",
      descriptionFa: "تمرین تلفظ حروف و هجی کردن کلمات با صدای بومی",
      deepLinkHref: "/vocabulary",
      icon: "🔤",
    },
    nodes: [
      {
        id: "u1-n1",
        unitId: "unit-1",
        order: 1,
        titleFa: "کالبدشکافی ضمایر فاعلی و فعل To Be",
        titleEn: "Mastering Subject Pronouns & To Be",
        type: "concept",
        typeLabelFa: "درس مفهومی",
        icon: "📖",
        xpReward: 30,
        deepLinkHref: "/learn/grammar",
        summaryFa: "تمایز کاربرد am, is, are و اجتناب از تله‌های ترجمه کلمه‌به‌کلمه از فارسی.",
        estimatedMinutes: 5,
      },
      {
        id: "u1-n2",
        unitId: "unit-1",
        order: 2,
        titleFa: "لیسنینگ: مکالمات کوتاه در فرودگاه و هتل",
        titleEn: "Listening: Short Airport Encounters",
        type: "receptive",
        typeLabelFa: "تمرین دریافتی",
        icon: "🎧",
        xpReward: 40,
        deepLinkHref: "/listening",
        summaryFa: "تشخیص اطلاعات هویتی و پر کردن فرم ورود مسافر.",
        estimatedMinutes: 7,
      },
      {
        id: "u1-n3",
        unitId: "unit-1",
        order: 3,
        titleFa: "اسپیکینگ: سفارش نوشیدنی در کافه",
        titleEn: "Speaking: Ordering at the Cafe",
        type: "speaking",
        typeLabelFa: "مأموریت تعاملی",
        icon: "🗣️",
        xpReward: 50,
        deepLinkHref: "/roleplay",
        summaryFa: "مکالمه هوشمند با باریستا برای سفارش قهوه و پرداخت به انگلیسی.",
        estimatedMinutes: 8,
      },
      {
        id: "u1-n4",
        unitId: "unit-1",
        order: 4,
        titleFa: "تثبیت لایتنر: خطاهای رایج سلام و معرفی",
        titleEn: "Leitner Checkpoint: Common Starter Slips",
        type: "leitner",
        typeLabelFa: "ایستگاه مرور لایتنر",
        icon: "🗃️",
        xpReward: 35,
        deepLinkHref: "/mistakes/leitner",
        summaryFa: "مرور خطای I am agree و تفاوت How do you do با How are you.",
        estimatedMinutes: 4,
      },
      {
        id: "u1-n5",
        unitId: "unit-1",
        order: 5,
        titleFa: "غول‌آزمون یونیت ۱: دروازه تسلط مقدماتی",
        titleEn: "Boss Gate 1: Identity & Survival Basics",
        type: "boss",
        typeLabelFa: "دروازه ارزیابی (Boss Gate)",
        icon: "🛡️",
        xpReward: 100,
        deepLinkHref: "#boss-gate",
        summaryFa: "کوییز ترکیبی ۵ سواله برای کسب نشان یونیت ۱ و باز کردن یونیت ۲.",
        estimatedMinutes: 6,
      },
    ],
    bossQuestions: [
      {
        id: "u1-q1",
        promptFa: "کدام گزینه شکل صحیح فعل to be را برای این جمله دارد؟",
        questionTextEn: "Sarah and her brother ______ from Tehran, but now they live in London.",
        options: ["is", "am", "are", "be"],
        correctIndex: 2,
        explanationFa: "فاعل Sarah and her brother جمع است (they)، بنابراین فعل are الزامی است.",
      },
      {
        id: "u1-q2",
        promptFa: "پاسخ طبیعی و مودبانه در کافه به سوال 'Can I get you anything else?' کدام است؟",
        questionTextEn: "Barista: 'Can I get you anything else?'\nYou: '__________________'",
        options: [
          "No, that will be all, thank you.",
          "I am no wanting more.",
          "Yes, I finish everything.",
          "Not any other things.",
        ],
        correctIndex: 0,
        explanationFa: "'No, that will be all, thank you' عبارت معیار و بومی انگلیسی است.",
      },
      {
        id: "u1-q3",
        promptFa: "خطای نگارشی این عبارت رایج ایرانیان چیست؟",
        questionTextEn: "❌ 'I am agree with your proposal.'",
        options: [
          "باید نوشته شود: 'I agree with your proposal.'",
          "باید نوشته شود: 'I am agreeing with you.'",
          "باید نوشته شود: 'I do agree with.'",
          "جمله کاملاً درست است.",
        ],
        correctIndex: 0,
        explanationFa: "فعل agree فعل اصلی است و نیازی به am ندارد.",
      },
      {
        id: "u1-q4",
        promptFa: "در فایل صوتی فرودگاه، مسافر ملیت خود را چه اعلام می‌کند؟",
        audioSnippetTextEn: "Excuse me officer, my passport is Canadian, although I was born in Spain.",
        questionTextEn: "What is the traveler's official nationality?",
        options: ["Spanish", "Canadian", "British", "American"],
        correctIndex: 1,
        explanationFa: "مسافر تصریح می‌کند که پاسپورت کانادایی دارد (Canadian).",
      },
      {
        id: "u1-q5",
        promptFa: "کدام ضمیر ملکی برای تکمیل جمله زیر صحیح است؟",
        questionTextEn: "Look at that car! ______ color is very unique.",
        options: ["It's", "Its", "Their", "His"],
        correctIndex: 1,
        explanationFa: "صفت ملکی برای اشیا Its بدون آپاستروف است. It's مخفف It is است.",
      },
    ],
  },
  {
    id: "unit-2",
    tier: "A1",
    tierLabelFa: "سطح A1: نقطه شروع و مکالمه پایه",
    unitNumber: 2,
    titleFa: "یونیت ۲: روتین‌های روزمره و زمان حال ساده",
    titleEn: "Unit 2: Daily Routines & Present Simple Habits",
    descriptionFa: "ساعت، فعالیت‌های تکرارشونده، قیدهای تکرار (always, usually) و ساختار سوالی do/does.",
    badgeIcon: "⏰",
    nodes: [
      {
        id: "u2-n1",
        unitId: "unit-2",
        order: 1,
        titleFa: "گرامر: تله‌های s سوم‌شخص و قیدهای تکرار",
        titleEn: "Present Simple & Adverbs of Frequency",
        type: "concept",
        typeLabelFa: "درس مفهومی",
        icon: "📖",
        xpReward: 30,
        deepLinkHref: "/learn/grammar",
        summaryFa: "چرا فراموش کردن s در سوم‌شخص رخ می‌دهد و جایگاه always قبل از فعل اصلی کجاست؟",
        estimatedMinutes: 5,
      },
      {
        id: "u2-n2",
        unitId: "unit-2",
        order: 2,
        titleFa: "ریدینگ تعاملی: یک روز از زندگی برنامه‌نویس جوان",
        titleEn: "Reading: A Day in the Life of a Coder",
        type: "receptive",
        typeLabelFa: "تمرین دریافتی",
        icon: "🎧",
        xpReward: 40,
        deepLinkHref: "/learn/reading",
        summaryFa: "خواندن برنامه روزانه و تطبیق ساعت‌ها با فعالیت‌ها.",
        estimatedMinutes: 6,
      },
      {
        id: "u2-n3",
        unitId: "unit-2",
        order: 3,
        titleFa: "اسپیکینگ: توصیف برنامه روزمره‌ات به پارتنر",
        titleEn: "Speaking: Explaining Your Routine",
        type: "speaking",
        typeLabelFa: "مأموریت تعاملی",
        icon: "🗣️",
        xpReward: 50,
        deepLinkHref: "/roleplay",
        summaryFa: "شبیه‌سازی گفت‌وگو درباره ساعات کاری و زمان بیدار شدن.",
        estimatedMinutes: 8,
      },
      {
        id: "u2-n4",
        unitId: "unit-2",
        order: 4,
        titleFa: "لایتنر: تثبیت همایندهای زمان و ساعت",
        titleEn: "Leitner Checkpoint: Prepositions of Time",
        type: "leitner",
        typeLabelFa: "ایستگاه مرور لایتنر",
        icon: "🗃️",
        xpReward: 35,
        deepLinkHref: "/mistakes/leitner",
        summaryFa: "تمایز کاربرد حروف اضافه at 8:00, on Mondays, in the morning.",
        estimatedMinutes: 4,
      },
      {
        id: "u2-n5",
        unitId: "unit-2",
        order: 5,
        titleFa: "غول‌آزمون یونیت ۲: چالش روتین و زمان‌ها",
        titleEn: "Boss Gate 2: Routines & Clockwork Precision",
        type: "boss",
        typeLabelFa: "دروازه ارزیابی (Boss Gate)",
        icon: "🛡️",
        xpReward: 100,
        deepLinkHref: "#boss-gate",
        summaryFa: "آزمون سنجش زمان حال ساده، تلفظ s پایانی و حروف اضافه زمان.",
        estimatedMinutes: 6,
      },
    ],
    bossQuestions: [
      {
        id: "u2-q1",
        promptFa: "کدام گزینه جمله زیر را از نظر گرامری درست کامل می‌کند؟",
        questionTextEn: "My roommate ______ up at 6:30 AM every morning.",
        options: ["wake", "wakes", "waking", "is wake"],
        correctIndex: 1,
        explanationFa: "برای سوم‌شخص مفرد (my roommate) در حال ساده پسوند -s الزامی است (wakes).",
      },
      {
        id: "u2-q2",
        promptFa: "حرف اضافه مناسب برای روزهای هفته در انگلیسی کدام است؟",
        questionTextEn: "We always have our English speaking clinic ______ Fridays.",
        options: ["in", "at", "on", "to"],
        correctIndex: 2,
        explanationFa: "برای روزهای هفته از حرف اضافه on استفاده می‌شود.",
      },
      {
        id: "u2-q3",
        promptFa: "جایگاه صحیح قید تکرار usually در جمله زیر کدام است؟",
        questionTextEn: "They (usually / play) tennis after work.",
        options: [
          "They usually play tennis after work.",
          "They play usually tennis after work.",
          "They play tennis usually after work.",
          "Usually they are play tennis.",
        ],
        correctIndex: 0,
        explanationFa: "قیدهای تکرار پیش از فعل اصلی (play) قرار می‌گیرند.",
      },
      {
        id: "u2-q4",
        promptFa: "کدام سوال برای پرسیدن درباره شغل صحیح است؟",
        questionTextEn: "Which question correctly asks someone about their profession?",
        options: [
          "What do you do?",
          "What are you doing now?",
          "What do you make?",
          "What is your work doing?",
        ],
        correctIndex: 0,
        explanationFa: "'What do you do?' اصطلاح استاندارد انگلیسی برای پرسیدن شغل است.",
      },
      {
        id: "u2-q5",
        promptFa: "منفی جمله 'He likes seafood' کدام است؟",
        questionTextEn: "Choose the correct negative form:",
        options: [
          "He doesn't like seafood.",
          "He doesn't likes seafood.",
          "He don't like seafood.",
          "He isn't like seafood.",
        ],
        correctIndex: 0,
        explanationFa: "با حضور فعل کمکی doesn't، فعل اصلی بدون s می‌آید: doesn't like.",
      },
    ],
  },
  {
    id: "unit-3",
    tier: "A1",
    tierLabelFa: "سطح A1: نقطه شروع و مکالمه پایه",
    unitNumber: 3,
    titleFa: "یونیت ۳: خرید، قیمت‌ها و اشیای روزمره",
    titleEn: "Unit 3: Shopping, Prices & Everyday Items",
    descriptionFa: "اسم‌های قابل شمارش و غیرقابل شمارش، How much / How many و صفات اشاره this/these.",
    badgeIcon: "🛍️",
    nodes: [
      {
        id: "u3-n1",
        unitId: "unit-3",
        order: 1,
        titleFa: "گرامر: اسم‌های شمارشی، غیرشمارشی و much/many",
        titleEn: "Countable vs Uncountable & Quantifiers",
        type: "concept",
        typeLabelFa: "درس مفهومی",
        icon: "📖",
        xpReward: 30,
        deepLinkHref: "/learn/grammar",
        summaryFa: "چرا information و advice جمع بسته نمی‌شوند و چگونه how much بکار ببریم؟",
        estimatedMinutes: 5,
      },
      {
        id: "u3-n2",
        unitId: "unit-3",
        order: 2,
        titleFa: "لیسنینگ: قیمت‌ها و تخفیف‌ها در بازارچه لندن",
        titleEn: "Listening: Prices & Bargains at Camden Market",
        type: "receptive",
        typeLabelFa: "تمرین دریافتی",
        icon: "🎧",
        xpReward: 40,
        deepLinkHref: "/listening",
        summaryFa: "تشخیص اعداد و تفاوت تلفظ پانزده (fifteen) و پنجاه (fifty).",
        estimatedMinutes: 6,
      },
      {
        id: "u3-n3",
        unitId: "unit-3",
        order: 3,
        titleFa: "اسپیکینگ: خرید لباس و پرسیدن سایز",
        titleEn: "Speaking: Asking for Sizes & Fitting Room",
        type: "speaking",
        typeLabelFa: "مأموریت تعاملی",
        icon: "🗣️",
        xpReward: 50,
        deepLinkHref: "/roleplay",
        summaryFa: "تعامل با فروشنده برای پرو کردن شلوار و تعویض رنگ.",
        estimatedMinutes: 7,
      },
      {
        id: "u3-n4",
        unitId: "unit-3",
        order: 4,
        titleFa: "لایتنر: خطاهای رایج اعداد و قیمت‌ها",
        titleEn: "Leitner Checkpoint: Numbers & Money Pitfalls",
        type: "leitner",
        typeLabelFa: "ایستگاه مرور لایتنر",
        icon: "🗃️",
        xpReward: 35,
        deepLinkHref: "/mistakes/leitner",
        summaryFa: "تثبیت نحوه بیان اعداد بزرگ و عدم افزودن s به hundred و thousand در ترکیب عددی.",
        estimatedMinutes: 4,
      },
      {
        id: "u3-n5",
        unitId: "unit-3",
        order: 5,
        titleFa: "غول‌آزمون یونیت ۳: ارزیابی پایان سطح A1",
        titleEn: "Boss Gate 3: A1 Mastery Checkpoint",
        type: "boss",
        typeLabelFa: "دروازه ارزیابی (Boss Gate)",
        icon: "🛡️",
        xpReward: 120,
        deepLinkHref: "#boss-gate",
        summaryFa: "آزمون عبور از سطح A1 و ورود رسمی به سطح A2.",
        estimatedMinutes: 7,
      },
    ],
    bossQuestions: [
      {
        id: "u3-q1",
        promptFa: "برای پرسیدن قیمت یک جفت کفش کدام گزینه مناسب است؟",
        questionTextEn: "How ______ are these leather boots?",
        options: ["many", "much", "cost", "price"],
        correctIndex: 1,
        explanationFa: "برای پرسیدن قیمت از عبارت How much استفاده می‌شود.",
      },
      {
        id: "u3-q2",
        promptFa: "کدام کلمه در انگلیسی غیرقابل شمارش است و هرگز s جمع نمی‌گیرد؟",
        questionTextEn: "Which of the following is an uncountable noun in English?",
        options: ["Information", "Book", "Car", "Chair"],
        correctIndex: 0,
        explanationFa: "کلمه information غیرقابل شمارش است و s جمع نمی‌گیرد.",
      },
      {
        id: "u3-q3",
        promptFa: "پاسخ فروشنده به 'Can I try this jacket on?' چیست؟",
        questionTextEn: "Customer: 'Can I try this jacket on?'\nClerk: '__________________'",
        options: [
          "Sure, the fitting rooms are over there.",
          "No, you are wearing it.",
          "Yes, give me your jacket.",
          "I am not agree with trying.",
        ],
        correctIndex: 0,
        explanationFa: "'Fitting room' به معنای اتاق پرو است.",
      },
      {
        id: "u3-q4",
        promptFa: "تکمیل صحیح جمله زیر با ضمایر اشاره:",
        questionTextEn: "Can you pass me ______ apples on that distant table?",
        options: ["this", "that", "these", "those"],
        correctIndex: 3,
        explanationFa: "برای اسم‌های جمع دور (on that distant table) از those استفاده می‌شود.",
      },
      {
        id: "u3-q5",
        promptFa: "نگارش صحیح عدد ۲,۵۰۰ دلار به حروف کدام است؟",
        questionTextEn: "$2,500 written in words:",
        options: [
          "Two thousand five hundred dollars",
          "Two thousands and five hundreds dollars",
          "Two thousand with five hundred dollar",
          "Two thousands dollars",
        ],
        correctIndex: 0,
        explanationFa: "کلمات thousand و hundred در ترکیب عددی مشخص جمع بسته نمی‌شوند.",
      },
    ],
  },

  // ==========================================
  // TIER 2: A2 WAYSTAGE (Units 4 - 6)
  // ==========================================
  {
    id: "unit-4",
    tier: "A2",
    tierLabelFa: "سطح A2: توصیف گذشته و تجربیات",
    unitNumber: 4,
    titleFa: "یونیت ۴: خاطرات سفر و زمان گذشته ساده",
    titleEn: "Unit 4: Travel Tales & Past Simple",
    descriptionFa: "افعال باقاعده و بی‌قاعده در گذشته، سوال با Did، و توصیف تعطیلات و سفرها.",
    badgeIcon: "✈️",
    sideQuest: {
      id: "sq-4",
      titleFa: "بازی کارآگاهی شرلوک: مرحله اول خیابان بیکر",
      descriptionFa: "تمرین افعال گذشته در صحنه جرم با شرلوک هلمز",
      deepLinkHref: "/roleplay",
      icon: "🔍",
    },
    nodes: [
      {
        id: "u4-n1",
        unitId: "unit-4",
        order: 1,
        titleFa: "گرامر: افعال بی‌قاعده پرکاربرد و سوال با Did",
        titleEn: "Irregular Past Verbs & Question Mechanics",
        type: "concept",
        typeLabelFa: "درس مفهومی",
        icon: "📖",
        xpReward: 35,
        deepLinkHref: "/learn/grammar",
        summaryFa: "چرا بعد از Did فعل به حالت ساده برمی‌گردد؟ (Did you went اشتباه است).",
        estimatedMinutes: 6,
      },
      {
        id: "u4-n2",
        unitId: "unit-4",
        order: 2,
        titleFa: "ریدینگ: ماجرای گم شدن چمدان در فرودگاه استانبول",
        titleEn: "Reading: The Lost Luggage Episode",
        type: "receptive",
        typeLabelFa: "تمرین دریافتی",
        icon: "🎧",
        xpReward: 45,
        deepLinkHref: "/learn/reading",
        summaryFa: "درک ترتیب وقایع در گذشته با استفاده از then, after that, finally.",
        estimatedMinutes: 7,
      },
      {
        id: "u4-n3",
        unitId: "unit-4",
        order: 3,
        titleFa: "اسپیکینگ: تعریف خاطره مهیج‌ترین تعطیلات",
        titleEn: "Speaking: My Best Vacation Story",
        type: "speaking",
        typeLabelFa: "مأموریت تعاملی",
        icon: "🗣️",
        xpReward: 55,
        deepLinkHref: "/roleplay",
        summaryFa: "پاسخ به سوالات درباره مقصد، هتل و غذاهایی که خورده‌اید.",
        estimatedMinutes: 8,
      },
      {
        id: "u4-n4",
        unitId: "unit-4",
        order: 4,
        titleFa: "لایتنر: خطاهای رایج ed پایانی و تلفظ آن",
        titleEn: "Leitner Checkpoint: Past Tense Pronunciation",
        type: "leitner",
        typeLabelFa: "ایستگاه مرور لایتنر",
        icon: "🗃️",
        xpReward: 35,
        deepLinkHref: "/mistakes/leitner",
        summaryFa: "سه تلفظ /t/, /d/, /ɪd/ برای پسوند ed در افعال گذشته.",
        estimatedMinutes: 5,
      },
      {
        id: "u4-n5",
        unitId: "unit-4",
        order: 5,
        titleFa: "غول‌آزمون یونیت ۴: چالش خاطرات و زمان گذشته",
        titleEn: "Boss Gate 4: Past Simple Mastery",
        type: "boss",
        typeLabelFa: "دروازه ارزیابی (Boss Gate)",
        icon: "🛡️",
        xpReward: 110,
        deepLinkHref: "#boss-gate",
        summaryFa: "سنجش افعال بی‌قاعده و سوالات Did.",
        estimatedMinutes: 6,
      },
    ],
    bossQuestions: [
      {
        id: "u4-q1",
        promptFa: "شکل صحیح سوالی در گذشته ساده کدام است؟",
        questionTextEn: "Choose the correct past question:",
        options: [
          "Did you saw the Eiffel Tower yesterday?",
          "Did you see the Eiffel Tower yesterday?",
          "Were you see the Eiffel Tower yesterday?",
          "Did you seen the Eiffel Tower yesterday?",
        ],
        correctIndex: 1,
        explanationFa: "بعد از فعل کمکی Did، فعل اصلی حتماً به فرم پایه (see) می‌آید.",
      },
      {
        id: "u4-q2",
        promptFa: "گذشته فعل buy کدام است؟",
        questionTextEn: "She ______ a brand new laptop last weekend.",
        options: ["buyed", "bought", "brought", "buying"],
        correctIndex: 1,
        explanationFa: "گذشته فعل buy کلمه bought است (brought گذشته bring است).",
      },
      {
        id: "u4-q3",
        promptFa: "در کدام فعل، پسوند ed به صورت /ɪd/ تلفظ می‌شود؟",
        questionTextEn: "In which word is '-ed' pronounced as /ɪd/?",
        options: ["wanted", "worked", "played", "watched"],
        correctIndex: 0,
        explanationFa: "افعالی که به صدای /t/ یا /d/ ختم می‌شوند پسوند ed را /ɪd/ تلفظ می‌کنند (wanted).",
      },
      {
        id: "u4-q4",
        promptFa: "تکمیل پاسخ با منفی گذشته:",
        questionTextEn: "We ______ to the cinema because we were too tired.",
        options: ["didn't go", "didn't went", "weren't go", "not went"],
        correctIndex: 0,
        explanationFa: "منفی در گذشته ساده با didn't + فعل ساده است: didn't go.",
      },
      {
        id: "u4-q5",
        promptFa: "کدام کلمه ربطی برای بیان تضاد در روایت داستان مناسب است؟",
        questionTextEn: "The flight was delayed, ______ the hotel staff were extremely welcoming.",
        options: ["so", "but", "because", "then"],
        correctIndex: 1,
        explanationFa: "برای بیان تضاد بین تاخیر پرواز و خوش‌رویی پرسنل از but استفاده می‌شود.",
      },
    ],
  },
  {
    id: "unit-5",
    tier: "A2",
    tierLabelFa: "سطح A2: توصیف گذشته و تجربیات",
    unitNumber: 5,
    titleFa: "یونیت ۵: جهت‌یابی، شهر و قرار ملاقات",
    titleEn: "Unit 5: Navigating the City & Meeting Up",
    descriptionFa: "حروف اضافه مکان، آدرس دادن (turn left, go straight)، و استفاده از Can/Could برای خواهش.",
    badgeIcon: "🗺️",
    nodes: [
      {
        id: "u5-n1",
        unitId: "unit-5",
        order: 1,
        titleFa: "گرامر: حروف اضافه مکان و عبارات آدرس‌دهی",
        titleEn: "Prepositions of Place & Directions",
        type: "concept",
        typeLabelFa: "درس مفهومی",
        icon: "📖",
        xpReward: 35,
        deepLinkHref: "/learn/grammar",
        summaryFa: "تمایز across from, next to, opposite و تفاوت at و in در شهر.",
        estimatedMinutes: 5,
      },
      {
        id: "u5-n2",
        unitId: "unit-5",
        order: 2,
        titleFa: "لیسنینگ: کلینیک نقشه‌خوانی و پیدا کردن مسیر",
        titleEn: "Listening: Map Labelling & Route Finding",
        type: "receptive",
        typeLabelFa: "تمرین دریافتی",
        icon: "🎧",
        xpReward: 45,
        deepLinkHref: "/listening",
        summaryFa: "شبیه‌سازی نقشه شهری و دنبال کردن دستورالعمل‌های صوتی صریح.",
        estimatedMinutes: 7,
      },
      {
        id: "u5-n3",
        unitId: "unit-5",
        order: 3,
        titleFa: "اسپیکینگ: آدرس پرسیدن از رهگذر در لندن",
        titleEn: "Speaking: Asking for Directions in London",
        type: "speaking",
        typeLabelFa: "مأموریت تعاملی",
        icon: "🗣️",
        xpReward: 55,
        deepLinkHref: "/roleplay",
        summaryFa: "شبیه‌سازی مکالمه برای پیدا کردن نزدیک‌ترین ایستگاه مترو.",
        estimatedMinutes: 8,
      },
      {
        id: "u5-n4",
        unitId: "unit-5",
        order: 4,
        titleFa: "لایتنر: خطاهای رایج آدرس در فارسی به انگلیسی",
        titleEn: "Leitner Checkpoint: Persian L1 Direction Traps",
        type: "leitner",
        typeLabelFa: "ایستگاه مرور لایتنر",
        icon: "🗃️",
        xpReward: 35,
        deepLinkHref: "/mistakes/leitner",
        summaryFa: "رفع خطای 'take the right' و تثبیت 'turn right'.",
        estimatedMinutes: 4,
      },
      {
        id: "u5-n5",
        unitId: "unit-5",
        order: 5,
        titleFa: "غول‌آزمون یونیت ۵: چالش نقشه‌خوانی و جهت‌یابی",
        titleEn: "Boss Gate 5: City Navigation & Directions",
        type: "boss",
        typeLabelFa: "دروازه ارزیابی (Boss Gate)",
        icon: "🛡️",
        xpReward: 110,
        deepLinkHref: "#boss-gate",
        summaryFa: "آزمون درک آدرس‌های صوتی و حروف اضافه مکان.",
        estimatedMinutes: 6,
      },
    ],
    bossQuestions: [
      {
        id: "u5-q1",
        promptFa: "کدام عبارت برای آدرس دادن به معنای 'مستقیم برو تا به چهارراه برسی' است؟",
        questionTextEn: "Go straight ______ until you reach the crossroads.",
        options: ["on", "ahead", "in", "to"],
        correctIndex: 1,
        explanationFa: "ترکیب 'Go straight ahead' اصطلاح استاندارد برای مستقیم رفتن است.",
      },
      {
        id: "u5-q2",
        promptFa: "داروخانه روبروی بیمارستان است:",
        questionTextEn: "The pharmacy is ______ the main hospital.",
        options: ["opposite", "behind to", "between", "front"],
        correctIndex: 0,
        explanationFa: "واژه opposite بدون حرف اضافه به معنای روبرویِ یک مکان است.",
      },
      {
        id: "u5-q3",
        promptFa: "کدام سوال مودبانه‌ترین شیوه برای پرسیدن آدرس است؟",
        questionTextEn: "Choose the most polite question to ask a stranger:",
        options: [
          "Could you tell me how to get to the museum, please?",
          "Where is museum? Tell me.",
          "You must show me the museum path.",
          "I want museum right now.",
        ],
        correctIndex: 0,
        explanationFa: "استفاده از Could you tell me ... please مودبانه‌ترین شیوه سوال پرسیدن از غریبه‌هاست.",
      },
      {
        id: "u5-q4",
        promptFa: "مفهوم عبارت 'Take the second turning on your left' چیست؟",
        questionTextEn: "What does 'Take the second turning on your left' mean?",
        options: [
          "دومین کوچه/خیابان سمت چپ بپیچید",
          "دو بار به چپ دور بزنید",
          "دومین خیابان سمت راست بروید",
          "بعد از دو ساعت به چپ بروید",
        ],
        correctIndex: 0,
        explanationFa: "یعنی به دومین فرعی سمت چپ بپیچید.",
      },
      {
        id: "u5-q5",
        promptFa: "کدام حرف اضافه برای گوشه خیابان بکار می‌رود؟",
        questionTextEn: "There is a lovely cafe ______ the corner of Oxford Street.",
        options: ["on", "in", "with", "from"],
        correctIndex: 0,
        explanationFa: "برای گوشه خیابان از on the corner (یا at the corner) استفاده می‌شود.",
      },
    ],
  },
  {
    id: "unit-6",
    tier: "A2",
    tierLabelFa: "سطح A2: توصیف گذشته و تجربیات",
    unitNumber: 6,
    titleFa: "یونیت ۶: مقایسه صفات، سلامت و سبک زندگی",
    titleEn: "Unit 6: Comparisons, Health & Lifestyle",
    descriptionFa: "صفات تفضیلی و عالی (er/more, est/most)، گفتگو با پزشک و بیماری‌های متداول.",
    badgeIcon: "🩺",
    nodes: [
      {
        id: "u6-n1",
        unitId: "unit-6",
        order: 1,
        titleFa: "گرامر: صفات برتر، عالی و بی‌قاعده‌ها (good/better/best)",
        titleEn: "Comparatives & Superlatives Blueprint",
        type: "concept",
        typeLabelFa: "درس مفهومی",
        icon: "📖",
        xpReward: 35,
        deepLinkHref: "/learn/grammar",
        summaryFa: "چرا more better اشتباه است و تفاوت as...as در بیان شباهت.",
        estimatedMinutes: 5,
      },
      {
        id: "u6-n2",
        unitId: "unit-6",
        order: 2,
        titleFa: "ریدینگ: مقایسه سبک زندگی شهرهای بزرگ با حومه",
        titleEn: "Reading: Urban vs Rural Quality of Life",
        type: "receptive",
        typeLabelFa: "تمرین دریافتی",
        icon: "🎧",
        xpReward: 45,
        deepLinkHref: "/learn/reading",
        summaryFa: "استخراج اطلاعات آماری و مقایسه‌ای از متن بهداشت و هوا.",
        estimatedMinutes: 7,
      },
      {
        id: "u6-n3",
        unitId: "unit-6",
        order: 3,
        titleFa: "اسپیکینگ: شرح علائم بیماری در مطب پزشک",
        titleEn: "Speaking: Explaining Symptoms to a Doctor",
        type: "speaking",
        typeLabelFa: "مأموریت تعاملی",
        icon: "🗣️",
        xpReward: 55,
        deepLinkHref: "/roleplay",
        summaryFa: "توضیح سردرد، تب و پرسیدن درباره دوز دارو.",
        estimatedMinutes: 8,
      },
      {
        id: "u6-n4",
        unitId: "unit-6",
        order: 4,
        titleFa: "لایتنر: خطاهای رایج صفات و بیماری‌ها",
        titleEn: "Leitner Checkpoint: Health & Comparison Slips",
        type: "leitner",
        typeLabelFa: "ایستگاه مرور لایتنر",
        icon: "🗃️",
        xpReward: 35,
        deepLinkHref: "/mistakes/leitner",
        summaryFa: "تثبیت have a headache به جای I am headache.",
        estimatedMinutes: 4,
      },
      {
        id: "u6-n5",
        unitId: "unit-6",
        order: 5,
        titleFa: "غول‌آزمون یونیت ۶: ارزیابی پایان سطح A2",
        titleEn: "Boss Gate 6: A2 Waystage Certification",
        type: "boss",
        typeLabelFa: "دروازه ارزیابی (Boss Gate)",
        icon: "🛡️",
        xpReward: 130,
        deepLinkHref: "#boss-gate",
        summaryFa: "آزمون عبور از سطح مقدماتی A2 و ورود به سطح میانی B1.",
        estimatedMinutes: 7,
      },
    ],
    bossQuestions: [
      {
        id: "u6-q1",
        promptFa: "شکل تفضیلی صفت healthy کدام است؟",
        questionTextEn: "Eating fruits is ______ than having fast food every day.",
        options: ["more healthy", "healthier", "more healthier", "healthyest"],
        correctIndex: 1,
        explanationFa: "صفات دو هجایی مختوم به y حرف y را به i تبدیل کرده و er می‌گیرند (healthier).",
      },
      {
        id: "u6-q2",
        promptFa: "شکل عالی صفت bad کدام است؟",
        questionTextEn: "That was the ______ flu I have had in five years.",
        options: ["baddest", "worse", "worst", "most bad"],
        correctIndex: 2,
        explanationFa: "صفت عالی بی‌قاعده bad کلمه the worst است.",
      },
      {
        id: "u6-q3",
        promptFa: "بیان صحیح سرماخوردگی در انگلیسی:",
        questionTextEn: "❌ 'I am cold since yesterday.' -> Correct version:",
        options: [
          "I have a cold since yesterday.",
          "I have caught a cold.",
          "I am having coldness.",
          "My body is cold sick.",
        ],
        correctIndex: 1,
        explanationFa: "در انگلیسی می‌گوییم 'have a cold' یا 'caught a cold'؛ عبارت 'I am cold' یعنی احساس سرما دارم.",
      },
      {
        id: "u6-q4",
        promptFa: "تکمیل ساختار شباهت (as ... as):",
        questionTextEn: "Cycling to work is not as ______ as driving a car in heavy traffic.",
        options: ["stressful", "more stressful", "most stressful", "stressfully"],
        correctIndex: 0,
        explanationFa: "در ساختار as ... as صفت به فرم پایه و ساده می‌آید (stressful).",
      },
      {
        id: "u6-q5",
        promptFa: "توصیه پزشک با should:",
        questionTextEn: "You have a severe cough; you ______ see a specialist immediately.",
        options: ["should", "should to", "ought", "must to"],
        correctIndex: 0,
        explanationFa: "بعد از فعل کمکی should مستقیماً فعل ساده بدون to می‌آید (should see).",
      },
    ],
  },

  // ==========================================
  // TIER 3: B1 THRESHOLD (Units 7 - 9)
  // ==========================================
  {
    id: "unit-7",
    tier: "B1",
    tierLabelFa: "سطح B1: استقلال زبانی و کاربرد موقعیتی",
    unitNumber: 7,
    titleFa: "یونیت ۷: برنامه‌ریزی آینده و بیان اهداف",
    titleEn: "Unit 7: Future Ambitions & Making Plans",
    descriptionFa: "تمایز دقیق will و be going to و حال استمراری برای قرار ملاقات‌های قطعی آینده.",
    badgeIcon: "🎯",
    sideQuest: {
      id: "sq-7",
      titleFa: "بازی خیابانی StreetVibe: بقا در متروی لندن",
      descriptionFa: "استفاده از اصطلاحات روزمره و عبارات جوانان در مکالمات سریع",
      deepLinkHref: "/practice-ai",
      icon: "🎧",
    },
    nodes: [
      {
        id: "u7-n1",
        unitId: "unit-7",
        order: 1,
        titleFa: "گرامر هگزا: تفکیک will و going to و Present Continuous",
        titleEn: "Future Nuances: Will vs Going To vs Continuous",
        type: "concept",
        typeLabelFa: "درس مفهومی",
        icon: "📖",
        xpReward: 40,
        deepLinkHref: "/learn/grammar",
        summaryFa: "تصمیم‌های ناگهانی (will) در برابر برنامه‌های از پیش تعیین‌شده (going to).",
        estimatedMinutes: 6,
      },
      {
        id: "u7-n2",
        unitId: "unit-7",
        order: 2,
        titleFa: "لیسنینگ: هماهنگی قرار کاری بین دو مدیر محصول",
        titleEn: "Listening: Rescheduling a Project Meeting",
        type: "receptive",
        typeLabelFa: "تمرین دریافتی",
        icon: "🎧",
        xpReward: 50,
        deepLinkHref: "/listening",
        summaryFa: "تشخیص تغییر زمان از روی تقویم و اصطلاحات push back / bring forward.",
        estimatedMinutes: 7,
      },
      {
        id: "u7-n3",
        unitId: "unit-7",
        order: 3,
        titleFa: "اسپیکینگ: پرزنت اهداف ۵ ساله شغلی در مصاحبه",
        titleEn: "Speaking: 5-Year Career Aspirations",
        type: "speaking",
        typeLabelFa: "مأموریت تعاملی",
        icon: "🗣️",
        xpReward: 60,
        deepLinkHref: "/roleplay",
        summaryFa: "بیان انگیزه‌ها و برنامه‌های ارتقای مهارت در مصاحبه کاری.",
        estimatedMinutes: 8,
      },
      {
        id: "u7-n4",
        unitId: "unit-7",
        order: 4,
        titleFa: "لایتنر: خطاهای رایج آینده در زبان فارسی‌زبانان",
        titleEn: "Leitner Checkpoint: Future Time Clauses",
        type: "leitner",
        typeLabelFa: "ایستگاه مرور لایتنر",
        icon: "🗃️",
        xpReward: 40,
        deepLinkHref: "/mistakes/leitner",
        summaryFa: "عدم استفاده از will بعد از when و as soon as (When I arrive درست است).",
        estimatedMinutes: 4,
      },
      {
        id: "u7-n5",
        unitId: "unit-7",
        order: 5,
        titleFa: "غول‌آزمون یونیت ۷: چالش آینده و تعهدات",
        titleEn: "Boss Gate 7: Future Forms Mastery",
        type: "boss",
        typeLabelFa: "دروازه ارزیابی (Boss Gate)",
        icon: "🛡️",
        xpReward: 120,
        deepLinkHref: "#boss-gate",
        summaryFa: "کوییز آینده‌نگاری، عبارات زمانی و پیش‌بینی‌ها.",
        estimatedMinutes: 6,
      },
    ],
    bossQuestions: [
      {
        id: "u7-q1",
        promptFa: "تصمیم ناگهانی در لحظه صحبت (Spontaneous Decision):",
        questionTextEn: "Phone is ringing!\n'Don't worry, I ______ it!'",
        options: ["am going to answer", "will answer", "am answering", "answer"],
        correctIndex: 1,
        explanationFa: "تصمیم‌های ناگهانی در لحظه مکالمه با will بیان می‌شوند.",
      },
      {
        id: "u7-q2",
        promptFa: "برنامه قطعی با زمان و بلیط مشخص (Arrangement):",
        questionTextEn: "I ______ the dentist tomorrow at 3:00 PM; my appointment is confirmed.",
        options: ["will see", "am seeing", "see", "saw"],
        correctIndex: 1,
        explanationFa: "برای قرارهای قطعی آینده که رزرو یا برنامه‌ریزی شده‌اند، حال استمراری طبیعی‌ترین ساختار است.",
      },
      {
        id: "u7-q3",
        promptFa: "کدام گزینه در بند زمانی آینده درست است؟",
        questionTextEn: "We will start the celebration as soon as our guests ______.",
        options: ["will arrive", "arrive", "are arriving", "arrived"],
        correctIndex: 1,
        explanationFa: "بعد از عبارات زمانی مانند as soon as و when از حال ساده استفاده می‌شود، نه will.",
      },
      {
        id: "u7-q4",
        promptFa: "پیش‌بینی بر اساس شواهد عینی موجود (Present Evidence):",
        questionTextEn: "Look at those dark clouds! It ______ rain very soon.",
        options: ["will", "is going to", "is raining", "shall"],
        correctIndex: 1,
        explanationFa: "پیش‌بینی بر مبنای شواهد عینی حاضر در صحنه با be going to بیان می‌شود.",
      },
      {
        id: "u7-q5",
        promptFa: "معنای اصطلاح 'push back the meeting' چیست؟",
        questionTextEn: "What does 'push back the meeting by two days' mean?",
        options: [
          "جلسه را ۲ روز به تعویق انداختن",
          "جلسه را ۲ روز زودتر برگزار کردن",
          "جلسه را کاملاً لغو کردن",
          "مدت جلسه را ۲ ساعت افزایش دادن",
        ],
        correctIndex: 0,
        explanationFa: "عبارت push back یعنی موکول کردن به تاریخی دیرتر (به تعویق انداختن).",
      },
    ],
  },
  {
    id: "unit-8",
    tier: "B1",
    tierLabelFa: "سطح B1: استقلال زبانی و کاربرد موقعیتی",
    unitNumber: 8,
    titleFa: "یونیت ۸: شرطی‌های نوع ۱ و ۲ و توصیه‌های اخلاقی",
    titleEn: "Unit 8: Conditionals (Types 1 & 2) & Advice",
    descriptionFa: "بیان احتمالات واقعی (If it rains) و فرضیات ناممکن در زمان حال (If I were you).",
    badgeIcon: "⚖️",
    nodes: [
      {
        id: "u8-n1",
        unitId: "unit-8",
        order: 1,
        titleFa: "گرامر: تفاوت بنیادین شرطی نوع اول و دوم",
        titleEn: "Conditionals Architecture: Real vs Unreal Present",
        type: "concept",
        typeLabelFa: "درس مفهومی",
        icon: "📖",
        xpReward: 40,
        deepLinkHref: "/learn/grammar",
        summaryFa: "چرا در انگلیسی می‌گوییم If I were you و تله‌های حذف would.",
        estimatedMinutes: 6,
      },
      {
        id: "u8-n2",
        unitId: "unit-8",
        order: 2,
        titleFa: "ریدینگ: معضلات اخلاقی و تصمیم‌گیری در کار تیمی",
        titleEn: "Reading: Workplace Ethical Dilemmas",
        type: "receptive",
        typeLabelFa: "تمرین دریافتی",
        icon: "🎧",
        xpReward: 50,
        deepLinkHref: "/learn/reading",
        summaryFa: "تحلیل موقعیت‌های فرضی اگر فلان اتفاق بیفتد چه باید کرد.",
        estimatedMinutes: 7,
      },
      {
        id: "u8-n3",
        unitId: "unit-8",
        order: 3,
        titleFa: "اسپیکینگ: مشاوره به دوست برای تغییر شغل",
        titleEn: "Speaking: Giving Career Advice & Empathy",
        type: "speaking",
        typeLabelFa: "مأموریت تعاملی",
        icon: "🗣️",
        xpReward: 60,
        deepLinkHref: "/roleplay",
        summaryFa: "استفاده از فرمول If I were in your shoes و You should consider.",
        estimatedMinutes: 8,
      },
      {
        id: "u8-n4",
        unitId: "unit-8",
        order: 4,
        titleFa: "لایتنر: خطاهای رایج فارسی‌زبانان در شرطی‌ها",
        titleEn: "Leitner Checkpoint: Conditional Pitfalls",
        type: "leitner",
        typeLabelFa: "ایستگاه مرور لایتنر",
        icon: "🗃️",
        xpReward: 40,
        deepLinkHref: "/mistakes/leitner",
        summaryFa: "عدم استفاده از will یا would در بخش If clause.",
        estimatedMinutes: 4,
      },
      {
        id: "u8-n5",
        unitId: "unit-8",
        order: 5,
        titleFa: "غول‌آزمون یونیت ۸: چالش فرضیات و شرطی‌ها",
        titleEn: "Boss Gate 8: Conditionals & Hypotheticals",
        type: "boss",
        typeLabelFa: "دروازه ارزیابی (Boss Gate)",
        icon: "🛡️",
        xpReward: 120,
        deepLinkHref: "#boss-gate",
        summaryFa: "کوییز تشخیص شرطی نوع یک و دو و پاسخ‌دهی به معماها.",
        estimatedMinutes: 6,
      },
    ],
    bossQuestions: [
      {
        id: "u8-q1",
        promptFa: "شرطی نوع اول (احتمال واقعی در آینده):",
        questionTextEn: "If it ______ tomorrow, we will reschedule the outdoor tournament.",
        options: ["rains", "will rain", "rained", "is raining"],
        correctIndex: 0,
        explanationFa: "در بند شرط (If clause) در شرطی نوع اول فعل زمان حال ساده می‌گیرد (rains).",
      },
      {
        id: "u8-q2",
        promptFa: "شرطی نوع دوم (فرضی و غیرواقعی در زمان حال):",
        questionTextEn: "If I won a million dollars, I ______ travel around the globe.",
        options: ["will", "would", "can", "am to"],
        correctIndex: 1,
        explanationFa: "در جواب شرط نوع دوم ساختار would + فعل ساده الزامی است.",
      },
      {
        id: "u8-q3",
        promptFa: "توصیه به دیگران با فرمول استاندارد If I were you:",
        questionTextEn: "'If I ______ in your position, I would negotiate the starting salary.'",
        options: ["am", "was", "were", "been"],
        correctIndex: 2,
        explanationFa: "در انگلیسی استاندارد و موقعیت‌های فرضی رسمی، برای تمام ضمایر از were استفاده می‌شود.",
      },
      {
        id: "u8-q4",
        promptFa: "کدام گزینه از نظر گرامری کاملاً بدون خطاست؟",
        questionTextEn: "Identify the grammatically correct sentence:",
        options: [
          "If you will study, you will pass.",
          "If you study, you will pass.",
          "If you studied, you will pass.",
          "If you study, you would pass.",
        ],
        correctIndex: 1,
        explanationFa: "آوردن will در بند شرط اشتباه است؛ فرم صحیح: If you study, you will pass.",
      },
      {
        id: "u8-q5",
        promptFa: "معنای عبارت Unless you practice regularly چیست؟",
        questionTextEn: "What does 'Unless you practice regularly, you won't improve' mean?",
        options: [
          "تنها در صورتی که منظم تمرین کنی پیشرفت نمی‌کنی",
          "مگر اینکه (اگر تمرین نکنی)، پیشرفت نخواهی کرد",
          "همیشه بعد از تمرین پیشرفت می‌کنی",
          "چون تمرین کردی پیشرفت کردی",
        ],
        correctIndex: 1,
        explanationFa: "کلمه Unless معادل If ... not است (مگر اینکه، اگر نه).",
      },
    ],
  },
  {
    id: "unit-9",
    tier: "B1",
    tierLabelFa: "سطح B1: استقلال زبانی و کاربرد موقعیتی",
    unitNumber: 9,
    titleFa: "یونیت ۹: زمان حال کامل (Present Perfect) و تجربیات زیسته",
    titleEn: "Unit 9: Life Experiences & Present Perfect",
    descriptionFa: "پیوند گذشته با حال (have + p.p)، تمایز since و for، و کاربرد already, yet, just.",
    badgeIcon: "🌟",
    nodes: [
      {
        id: "u9-n1",
        unitId: "unit-9",
        order: 1,
        titleFa: "گرامر: تمایز زمان حال کامل و گذشته ساده",
        titleEn: "Present Perfect vs Past Simple Battleground",
        type: "concept",
        typeLabelFa: "درس مفهومی",
        icon: "📖",
        xpReward: 40,
        deepLinkHref: "/learn/grammar",
        summaryFa: "چرا با قید زمان مشخص (yesterday, in 2020) نباید have آورده شود؟",
        estimatedMinutes: 6,
      },
      {
        id: "u9-n2",
        unitId: "unit-9",
        order: 2,
        titleFa: "لیسنینگ: مصاحبه با مسافر دور دنیا",
        titleEn: "Listening: Interview with a Globetrotter",
        type: "receptive",
        typeLabelFa: "تمرین دریافتی",
        icon: "🎧",
        xpReward: 50,
        deepLinkHref: "/listening",
        summaryFa: "تشخیص تجربیات گذشته نامعین با Have you ever...",
        estimatedMinutes: 7,
      },
      {
        id: "u9-n3",
        unitId: "unit-9",
        order: 3,
        titleFa: "اسپیکینگ: صحبت درباره مهارت‌های کسب‌شده",
        titleEn: "Speaking: Skills & Achievements",
        type: "speaking",
        typeLabelFa: "مأموریت تعاملی",
        icon: "🗣️",
        xpReward: 60,
        deepLinkHref: "/roleplay",
        summaryFa: "مکالمه درباره کارهایی که در ۳ سال اخیر انجام داده‌اید با since و for.",
        estimatedMinutes: 8,
      },
      {
        id: "u9-n4",
        unitId: "unit-9",
        order: 4,
        titleFa: "لایتنر: خطای ترجمه گذشته نقلی از فارسی",
        titleEn: "Leitner Checkpoint: L1 Persian Past Perfect Slips",
        type: "leitner",
        typeLabelFa: "ایستگاه مرور لایتنر",
        icon: "🗃️",
        xpReward: 40,
        deepLinkHref: "/mistakes/leitner",
        summaryFa: "تثبیت I have lived here for 5 years در برابر I am living.",
        estimatedMinutes: 4,
      },
      {
        id: "u9-n5",
        unitId: "unit-9",
        order: 5,
        titleFa: "غول‌آزمون یونیت ۹: ارزیابی پایان سطح B1",
        titleEn: "Boss Gate 9: B1 Intermediate Threshold",
        type: "boss",
        typeLabelFa: "دروازه ارزیابی (Boss Gate)",
        icon: "🛡️",
        xpReward: 140,
        deepLinkHref: "#boss-gate",
        summaryFa: "آزمون سنجش استقلال زبانی B1 و ورود به سطح تخصصی B2.",
        estimatedMinutes: 7,
      },
    ],
    bossQuestions: [
      {
        id: "u9-q1",
        promptFa: "تمایز گذشته ساده و حال کامل با قید زمان مشخص:",
        questionTextEn: "I ______ to Rome in 2021, but I have never visited Madrid.",
        options: ["went", "have gone", "have been", "was going"],
        correctIndex: 0,
        explanationFa: "به دلیل وجود قید زمان معین در گذشته (in 2021) گذشته ساده (went) الزامی است.",
      },
      {
        id: "u9-q2",
        promptFa: "کاربرد since و for برای بیان بازه زمانی:",
        questionTextEn: "My colleague has worked at Endoora ______ more than three years.",
        options: ["since", "for", "from", "during"],
        correctIndex: 1,
        explanationFa: "برای طول دوره و مدت زمان (three years) از for استفاده می‌شود (since برای نقطه آغاز است).",
      },
      {
        id: "u9-q3",
        promptFa: "جایگاه کلمه yet در جملات سوالی و منفی:",
        questionTextEn: "Have you submitted your final assignment ______?",
        options: ["already", "just", "yet", "still"],
        correctIndex: 2,
        explanationFa: "کلمه yet در انتهای جملات منفی و پرسشی حال کامل می‌آید.",
      },
      {
        id: "u9-q4",
        promptFa: "تفاوت have been to و have gone to:",
        questionTextEn: "'Where is Daniel?' - 'He isn't here; he has ______ to the supermarket.'",
        options: ["been", "gone", "went", "visited"],
        correctIndex: 1,
        explanationFa: "کلمه gone to یعنی رفته و هنوز بازنگشته است؛ been to یعنی رفته و برگشته.",
      },
      {
        id: "u9-q5",
        promptFa: "خطای این جمله چیست: 'I am living in Tehran since 2018'؟",
        questionTextEn: "Correct the sentence: 'I am living in Tehran since 2018.'",
        options: [
          "I have lived in Tehran since 2018.",
          "I live in Tehran since 2018.",
          "I was living in Tehran since 2018.",
          "جمله بدون ایراد است.",
        ],
        correctIndex: 0,
        explanationFa: "برای عملی که از گذشته آغاز شده و تا امروز ادامه دارد، حال کامل (have lived) به کار می‌رود.",
      },
    ],
  },

  // ==========================================
  // TIER 4: B2 VANTAGE (Units 10 - 12)
  // ==========================================
  {
    id: "unit-10",
    tier: "B2",
    tierLabelFa: "سطح B2: روانی کلام، استدلال و مباحثه",
    unitNumber: 10,
    titleFa: "یونیت ۱۰: ساختارهای مجهول (Passive Voice) و زبان رسمی",
    titleEn: "Unit 10: Passive Voice & Formal Register",
    descriptionFa: "تمرکز بر مجهول در اخبار، گزارش‌های آکادمیک، محیط کار و پنهان‌سازی فاعل برای لحن بی‌طرفانه.",
    badgeIcon: "🏛️",
    nodes: [
      {
        id: "u10-n1",
        unitId: "unit-10",
        order: 1,
        titleFa: "گرامر: تبدیل ساختارهای معلوم به مجهول در زمان‌های مختلف",
        titleEn: "Passive Voice Mechanics Across All Tenses",
        type: "concept",
        typeLabelFa: "درس مفهومی",
        icon: "📖",
        xpReward: 45,
        deepLinkHref: "/learn/grammar",
        summaryFa: "کاربرد be + past participle و دلایل استفاده از مجهول در متون علمی.",
        estimatedMinutes: 6,
      },
      {
        id: "u10-n2",
        unitId: "unit-10",
        order: 2,
        titleFa: "ریدینگ: گزارش پیشرفت انرژی‌های تجدیدپذیر در جهان",
        titleEn: "Reading: Renewable Energy Global Report",
        type: "receptive",
        typeLabelFa: "تمرین دریافتی",
        icon: "🎧",
        xpReward: 55,
        deepLinkHref: "/learn/reading",
        summaryFa: "شناسایی ساختارهای مجهول و استخراج واقعیت‌ها از گزارش‌های تحلیلی.",
        estimatedMinutes: 7,
      },
      {
        id: "u10-n3",
        unitId: "unit-10",
        order: 3,
        titleFa: "اسپیکینگ: شبیه‌سازی جلسه دفاع از محصول در استارتاپ",
        titleEn: "Speaking: Defending a Product Pitch",
        type: "speaking",
        typeLabelFa: "مأموریت تعاملی",
        icon: "🗣️",
        xpReward: 65,
        deepLinkHref: "/roleplay",
        summaryFa: "پاسخ به چالش‌های سرمایه‌گذاران با زبان قاطع و مودبانه رسمی.",
        estimatedMinutes: 8,
      },
      {
        id: "u10-n4",
        unitId: "unit-10",
        order: 4,
        titleFa: "لایتنر: خطاهای متداول مجهول با افعال لازم (Intransitive)",
        titleEn: "Leitner Checkpoint: Intransitive Passive Errors",
        type: "leitner",
        typeLabelFa: "ایستگاه مرور لایتنر",
        icon: "🗃️",
        xpReward: 45,
        deepLinkHref: "/mistakes/leitner",
        summaryFa: "چرا اتفاق افتادن (happen, occur) مجهول نمی‌شود؟ (It was happened غلط است).",
        estimatedMinutes: 4,
      },
      {
        id: "u10-n5",
        unitId: "unit-10",
        order: 5,
        titleFa: "غول‌آزمون یونیت ۱۰: چالش زبان رسمی و مجهول",
        titleEn: "Boss Gate 10: Passive Voice Proficiency",
        type: "boss",
        typeLabelFa: "دروازه ارزیابی (Boss Gate)",
        icon: "🛡️",
        xpReward: 130,
        deepLinkHref: "#boss-gate",
        summaryFa: "کوییز بازنویسی جملات معلوم به مجهول و لحن رسمی آکادمیک.",
        estimatedMinutes: 6,
      },
    ],
    bossQuestions: [
      {
        id: "u10-q1",
        promptFa: "شکل مجهول صحیح این جمله کدام است؟ 'Engineers are testing the software.'",
        questionTextEn: "'Engineers are testing the new software.' in passive voice:",
        options: [
          "The new software is tested by engineers.",
          "The new software is being tested by engineers.",
          "The new software has been tested.",
          "The new software was being tested.",
        ],
        correctIndex: 1,
        explanationFa: "برای مجهول حال استمراری از ساختار is/are + being + p.p استفاده می‌شود.",
      },
      {
        id: "u10-q2",
        promptFa: "کدام فعل لازم است و هرگز نمی‌تواند مجهول شود؟",
        questionTextEn: "Which sentence contains a serious grammatical error?",
        options: [
          "The accident occurred at midnight.",
          "The accident was occurred at midnight.",
          "The car was damaged in the accident.",
          "The report was prepared yesterday.",
        ],
        correctIndex: 1,
        explanationFa: "فعل occur لازم است و مفعول نمی‌گیرد؛ بنابراین 'was occurred' خطای فاحش است.",
      },
      {
        id: "u10-q3",
        promptFa: "مجهول با افعال معین (Modals):",
        questionTextEn: "All confidential files ______ before leaving the office.",
        options: [
          "must lock",
          "must be locked",
          "must being locked",
          "must to be locked",
        ],
        correctIndex: 1,
        explanationFa: "ساختار مجهول با مودال‌ها: modal + be + past participle.",
      },
      {
        id: "u10-q4",
        promptFa: "کدام عبارت لحن رسمی آکادمیک را در استدلال بهتر منتقل می‌کند؟",
        questionTextEn: "Which phrase is most appropriate for an academic report?",
        options: [
          "It is widely believed that...",
          "A lot of folks say that...",
          "People think crazy things like...",
          "I and my pals believe that...",
        ],
        correctIndex: 0,
        explanationFa: "ساختار مجهول غیرشخصی 'It is widely believed that...' لحن بی‌طرفانه و استاندارد پژوهشی است.",
      },
      {
        id: "u10-q5",
        promptFa: "مجهول زمان حال کامل:",
        questionTextEn: "The bridge ______ completely restored following the renovation.",
        options: ["has", "has been", "is been", "was being"],
        correctIndex: 1,
        explanationFa: "مجهول حال کامل به صورت has/have been + past participle ساخته می‌شود.",
      },
    ],
  },
  {
    id: "unit-11",
    tier: "B2",
    tierLabelFa: "سطح B2: روانی کلام، استدلال و مباحثه",
    unitNumber: 11,
    titleFa: "یونیت ۱۱: بندهای موصولی (Relative Clauses) و همایندهای پیشرفته",
    titleEn: "Unit 11: Relative Clauses & Collocations",
    descriptionFa: "جملات توصیفی تحدیدی و غیرتحدیدی (defining vs non-defining)، ویرگول‌گذاری و collocations.",
    badgeIcon: "🔗",
    sideQuest: {
      id: "sq-11",
      titleFa: "کلینیک ریدینگ آیلتس: تطبیق عناوین (Headings)",
      descriptionFa: "تکنیک تفکیک ایده محوری پاراگراف از جزییات فرعی در متون فشرده کمبریج",
      deepLinkHref: "/ielts/clinics",
      icon: "📑",
    },
    nodes: [
      {
        id: "u11-n1",
        unitId: "unit-11",
        order: 1,
        titleFa: "گرامر: تفاوت who, which, that و ویرگول‌گذاری حیاتی",
        titleEn: "Defining vs Non-Defining Clauses Masterclass",
        type: "concept",
        typeLabelFa: "درس مفهومی",
        icon: "📖",
        xpReward: 45,
        deepLinkHref: "/learn/grammar",
        summaryFa: "چرا آوردن that در بندهای غیرتحدیدی (دارای ویرگول) در انگلیسی آکادمیک نادرست است؟",
        estimatedMinutes: 6,
      },
      {
        id: "u11-n2",
        unitId: "unit-11",
        order: 2,
        titleFa: "ریدینگ: بررسی تاثیر هوش مصنوعی بر بازار اشتغال",
        titleEn: "Reading: Automation & The Future of Labor",
        type: "receptive",
        typeLabelFa: "تمرین دریافتی",
        icon: "🎧",
        xpReward: 55,
        deepLinkHref: "/learn/reading",
        summaryFa: "شناسایی ارجاعات موصولی در بندهای طولانی و استخراج استدلال نویسنده.",
        estimatedMinutes: 7,
      },
      {
        id: "u11-n3",
        unitId: "unit-11",
        order: 3,
        titleFa: "اسپیکینگ: مناظره درباره آموزش آنلاین در برابر حضوری",
        titleEn: "Speaking: Online vs Traditional Learning Debate",
        type: "speaking",
        typeLabelFa: "مأموریت تعاملی",
        icon: "🗣️",
        xpReward: 65,
        deepLinkHref: "/roleplay",
        summaryFa: "بکارگیری کلمات ربط پیشرفته: Furthermore, On the other hand, Whereas.",
        estimatedMinutes: 8,
      },
      {
        id: "u11-n4",
        unitId: "unit-11",
        order: 4,
        titleFa: "لایتنر: همایندهای اشتباه Do و Make در رایتینگ",
        titleEn: "Leitner Checkpoint: Make vs Do Collocations",
        type: "leitner",
        typeLabelFa: "ایستگاه مرور لایتنر",
        icon: "🗃️",
        xpReward: 45,
        deepLinkHref: "/mistakes/leitner",
        summaryFa: "تثبیت make a contribution, do research, make progress.",
        estimatedMinutes: 4,
      },
      {
        id: "u11-n5",
        unitId: "unit-11",
        order: 5,
        titleFa: "غول‌آزمون یونیت ۱۱: چالش انسجام و بندهای موصولی",
        titleEn: "Boss Gate 11: Cohesion & Clauses Mastery",
        type: "boss",
        typeLabelFa: "دروازه ارزیابی (Boss Gate)",
        icon: "🛡️",
        xpReward: 130,
        deepLinkHref: "#boss-gate",
        summaryFa: "کوییز اتصال جملات و انتخاب همایندهای درست واژگان.",
        estimatedMinutes: 6,
      },
    ],
    bossQuestions: [
      {
        id: "u11-q1",
        promptFa: "کدام ضمیر موصولی در بند غیرتحدیدی (Non-defining) بین ویرگول‌ها مجاز است؟",
        questionTextEn: "My laptop, ______ I bought only two months ago, is already malfunctioning.",
        options: ["that", "which", "what", "whom"],
        correctIndex: 1,
        explanationFa: "در بندهای دارای ویرگول (non-defining) نمی‌توان از that استفاده کرد؛ which الزامی است.",
      },
      {
        id: "u11-q2",
        promptFa: "همایند صحیح برای عبارت انجام پژوهش کدام است؟",
        questionTextEn: "Scientists are planning to ______ extensive research into the vaccine's efficacy.",
        options: ["make", "do", "perform", "create"],
        correctIndex: 1,
        explanationFa: "همایند طبیعی و دانشگاهی 'do research' است.",
      },
      {
        id: "u11-q3",
        promptFa: "کاربرد ضمیر ملکی موصولی whose:",
        questionTextEn: "I interviewed an architect ______ innovative designs won the national award.",
        options: ["who", "whose", "which", "that"],
        correctIndex: 1,
        explanationFa: "برای نشان دادن مالکیت طرح‌های آن معمار از whose designs استفاده می‌شود.",
      },
      {
        id: "u11-q4",
        promptFa: "کدام کلمه ربطی برای افزودن یک استدلال هم‌راستا مناسب است؟",
        questionTextEn: "The proposal is financially viable. ______, it aligns with our environmental goals.",
        options: ["Furthermore", "However", "Despite", "Nevertheless"],
        correctIndex: 0,
        explanationFa: "کلمه Furthermore برای اضافه کردن یک دلیل تکمیلی و هم‌جهت بکار می‌رود.",
      },
      {
        id: "u11-q5",
        promptFa: "تکمیل همایند برای تصمیم‌گیری:",
        questionTextEn: "We must ______ an informed decision before the fiscal quarter ends.",
        options: ["do", "make", "take", "give"],
        correctIndex: 1,
        explanationFa: "در انگلیسی همایند منحصراً 'make a decision' است.",
      },
    ],
  },
  {
    id: "unit-12",
    tier: "B2",
    tierLabelFa: "سطح B2: روانی کلام، استدلال و مباحثه",
    unitNumber: 12,
    titleFa: "یونیت ۱۲: شرطی نوع ۳ و فرضیات گذشته (Unreal Past)",
    titleEn: "Unit 12: Third Conditional & Regrets",
    descriptionFa: "ساختار If had + p.p ... would have + p.p، بیان حسرت‌ها و نقدهای گذشته با should have.",
    badgeIcon: "⏳",
    nodes: [
      {
        id: "u12-n1",
        unitId: "unit-12",
        order: 1,
        titleFa: "گرامر: شرطی نوع سوم و کالبدشکافی ساختارهای would have",
        titleEn: "Third Conditional & Past Regret Architecture",
        type: "concept",
        typeLabelFa: "درس مفهومی",
        icon: "📖",
        xpReward: 45,
        deepLinkHref: "/learn/grammar",
        summaryFa: "تحلیل ریشه‌ای تله ترجمه کلمه‌به‌کلمه از فارسی در شرطی گذشته.",
        estimatedMinutes: 6,
      },
      {
        id: "u12-n2",
        unitId: "unit-12",
        order: 2,
        titleFa: "لیسنینگ: کالبدشکافی یک تصمیم اشتباه در بحران تجاری",
        titleEn: "Listening: Post-Mortem of a Business Misstep",
        type: "receptive",
        typeLabelFa: "تمرین دریافتی",
        icon: "🎧",
        xpReward: 55,
        deepLinkHref: "/listening",
        summaryFa: "درک پشیمانی‌ها و عبارات 'We should have anticipated this'.",
        estimatedMinutes: 7,
      },
      {
        id: "u12-n3",
        unitId: "unit-12",
        order: 3,
        titleFa: "اسپیکینگ: صحبت درباره بزرگ‌ترین درس‌هایی که آموخته‌اید",
        titleEn: "Speaking: Valuable Lessons from Past Mistakes",
        type: "speaking",
        typeLabelFa: "مأموریت تعاملی",
        icon: "🗣️",
        xpReward: 65,
        deepLinkHref: "/roleplay",
        summaryFa: "پاسخ به سوالات عمیق مصاحبه درباره شکست‌های قبلی و مدیریت آنها.",
        estimatedMinutes: 8,
      },
      {
        id: "u12-n4",
        unitId: "unit-12",
        order: 4,
        titleFa: "لایتنر: حذف would have ناشی از ترجمه تحت‌اللفظی",
        titleEn: "Leitner Checkpoint: Third Conditional Persian Traps",
        type: "leitner",
        typeLabelFa: "ایستگاه مرور لایتنر",
        icon: "🗃️",
        xpReward: 45,
        deepLinkHref: "/mistakes/leitner",
        summaryFa: "تثبیت If they had trained harder, they would have won.",
        estimatedMinutes: 4,
      },
      {
        id: "u12-n5",
        unitId: "unit-12",
        order: 5,
        titleFa: "غول‌آزمون یونیت ۱۲: ارزیابی پایان سطح B2",
        titleEn: "Boss Gate 12: B2 Vantage Certification",
        type: "boss",
        typeLabelFa: "دروازه ارزیابی (Boss Gate)",
        icon: "🛡️",
        xpReward: 150,
        deepLinkHref: "#boss-gate",
        summaryFa: "آزمون عبور از سطح B2 و صلاحیت ورود به سطح پیشرفته C1 و آیلتس.",
        estimatedMinutes: 7,
      },
    ],
    bossQuestions: [
      {
        id: "u12-q1",
        promptFa: "شرطی نوع سوم برای رخداد فرضی در گذشته:",
        questionTextEn: "If the train ______ on time, we would not have missed the opening keynote.",
        options: ["had arrived", "arrived", "would arrive", "has arrived"],
        correctIndex: 0,
        explanationFa: "در بند شرط (If clause) شرطی نوع سوم ساختار Past Perfect (had arrived) الزامی است.",
      },
      {
        id: "u12-q2",
        promptFa: "بیان پشیمانی و انتقاد از کار ناتمام در گذشته:",
        questionTextEn: "You ______ informed your supervisor before publishing the press release.",
        options: ["should have", "must have to", "ought have", "had to have"],
        correctIndex: 0,
        explanationFa: "ساختار 'should have + past participle' بیانگر کاری است که انجام آن بهتر بود ولی نشد.",
      },
      {
        id: "u12-q3",
        promptFa: "شکل صحیح شرطی نوع سوم در بند اصلی:",
        questionTextEn: "If we had known about the severe blizzard, we ______ at home.",
        options: [
          "would have stayed",
          "would stay",
          "will have stayed",
          "had stayed",
        ],
        correctIndex: 0,
        explanationFa: "در جواب شرط سوم فرمول 'would have + p.p' رعایت می‌شود.",
      },
      {
        id: "u12-q4",
        promptFa: "معنای عبارت I wish I had taken the offer چیست؟",
        questionTextEn: "What does 'I wish I had accepted that job offer' express?",
        options: [
          "حسرت و پشیمانی نسبت به رد کردن پیشنهاد کاری در گذشته",
          "امید به دریافت پیشنهاد در آینده",
          "رضایت کامل از شغل فعلی",
          "برنامه‌ریزی برای مصاحبه فردا",
        ],
        correctIndex: 0,
        explanationFa: "ترکیب wish + had p.p بیانگر حسرت و ای کاش در گذشته است.",
      },
      {
        id: "u12-q5",
        promptFa: "کدام گزینه شرطی ترکیبی (Mixed Conditional) زمان گذشته و اثر حال را نشان می‌دهد؟",
        questionTextEn: "If I had practiced speaking consistently back then, I ______ fluent today.",
        options: ["would be", "would have been", "will be", "had been"],
        correctIndex: 0,
        explanationFa: "وقتی شرط در گذشته اما نتیجه در حال حاضر است (today)، از would be استفاده می‌شود.",
      },
    ],
  },

  // ==========================================
  // TIER 5: C1 ADVANCED & IELTS MASTERY (Units 13 - 15)
  // ==========================================
  {
    id: "unit-13",
    tier: "C1",
    tierLabelFa: "سطح C1: تسلط پیشرفته و مهارت‌های آیلتس",
    unitNumber: 13,
    titleFa: "یونیت ۱۳: وارونگی نحوی (Inversion) و تاکید ساختاری",
    titleEn: "Unit 13: Inversion & Emphatic Structures",
    descriptionFa: "ساختارهای با تراز C1 شامل Rarely have I, Not only... but also, و Cleft sentences برای رایتینگ بند ۷.۵+.",
    badgeIcon: "💎",
    sideQuest: {
      id: "sq-13",
      titleFa: "کلینیک رایتینگ تسک ۲: انسجام و تز استیتمنت",
      descriptionFa: "فرمول‌بندی پاراگراف مقدمه و بسط منطقی ایده‌ها بدون خطای Cohesion",
      deepLinkHref: "/ielts/clinics",
      icon: "✍️",
    },
    nodes: [
      {
        id: "u13-n1",
        unitId: "unit-13",
        order: 1,
        titleFa: "گرامر پیشرفته: وارونگی نحوی با عبارات منفی (Negative Inversion)",
        titleEn: "Mastering Inversion for C1 Stylistic Precision",
        type: "concept",
        typeLabelFa: "درس مفهومی",
        icon: "📖",
        xpReward: 50,
        deepLinkHref: "/learn/grammar",
        summaryFa: "چگونه جمله را با Seldom, Under no circumstances یا Scarcely آغاز کنیم؟",
        estimatedMinutes: 6,
      },
      {
        id: "u13-n2",
        unitId: "unit-13",
        order: 2,
        titleFa: "ریدینگ تخصصی: کلینیک تله‌های True/False/Not Given کمبریج",
        titleEn: "Reading: Deconstructing Cambridge TFNG Traps",
        type: "receptive",
        typeLabelFa: "تمرین دریافتی",
        icon: "🎧",
        xpReward: 60,
        deepLinkHref: "/ielts/clinics",
        summaryFa: "تمایز بین اطلاعات صریحاً غلط (False) و اطلاعات ذکرنشده (Not Given).",
        estimatedMinutes: 7,
      },
      {
        id: "u13-n3",
        unitId: "unit-13",
        order: 3,
        titleFa: "اسپیکینگ: فرمول ۳ بخشی پارت ۲ آیلتس (گذشته/حال/آینده)",
        titleEn: "Speaking: The Past-Present-Future Cue Card Formula",
        type: "speaking",
        typeLabelFa: "مأموریت تعاملی",
        icon: "🗣️",
        xpReward: 70,
        deepLinkHref: "/ielts/clinics",
        summaryFa: "صحبت ۲ دقیقه‌ای مداوم بدون مکث و پرش‌های نامنظم فکری.",
        estimatedMinutes: 8,
      },
      {
        id: "u13-n4",
        unitId: "unit-13",
        order: 4,
        titleFa: "لایتنر: تله Despite of و علائم نگارشی Comma Splice",
        titleEn: "Leitner Checkpoint: High-Level Writing Mechanics",
        type: "leitner",
        typeLabelFa: "ایستگاه مرور لایتنر",
        icon: "🗃️",
        xpReward: 50,
        deepLinkHref: "/mistakes/leitner",
        summaryFa: "حذف of بعد از despite و استفاده از سمی‌کولن در اتصال دو جمله مستقل.",
        estimatedMinutes: 4,
      },
      {
        id: "u13-n5",
        unitId: "unit-13",
        order: 5,
        titleFa: "غول‌آزمون یونیت ۱۳: چالش گرامر سبک‌شناختی و اینورژن",
        titleEn: "Boss Gate 13: C1 Advanced Syntax Exam",
        type: "boss",
        typeLabelFa: "دروازه ارزیابی (Boss Gate)",
        icon: "🛡️",
        xpReward: 160,
        deepLinkHref: "#boss-gate",
        summaryFa: "کوییز بازنویسی به سبک وارونگی و ارزیابی استدلال‌های C1.",
        estimatedMinutes: 7,
      },
    ],
    bossQuestions: [
      {
        id: "u13-q1",
        promptFa: "شکل صحیح وارونگی نحوی با Rarely در ابتدای جمله:",
        questionTextEn: "Rarely ______ such an overwhelming level of dedication among junior staff.",
        options: [
          "I have seen",
          "have I seen",
          "did I seen",
          "I saw",
        ],
        correctIndex: 1,
        explanationFa: "با آمدن Rarely در اول جمله، ساختار پرسشی و وارونه می‌شود: have I seen.",
      },
      {
        id: "u13-q2",
        promptFa: "وارونگی با عبارت Under no circumstances:",
        questionTextEn: "Under no circumstances ______ reveal your master password to third parties.",
        options: [
          "you should",
          "should you",
          "you must",
          "must you not",
        ],
        correctIndex: 1,
        explanationFa: "عبارات منفی مانند under no circumstances ساختار فعل کمکی + فاعل را ایجاب می‌کنند (should you).",
      },
      {
        id: "u13-q3",
        promptFa: "کدام جمله خطای Comma Splice (اتصال نادرست صرفاً با ویرگول) دارد؟",
        questionTextEn: "Identify the sentence with a comma splice error:",
        options: [
          "The deadline was strict, however the team completed the audit.",
          "The deadline was strict; however, the team completed the audit.",
          "Although the deadline was strict, the team completed the audit.",
          "The deadline was strict, and the team completed the audit.",
        ],
        correctIndex: 0,
        explanationFa: "اتصال دو جمله مستقل فقط با ویرگول و however بدون سمی‌کولن، خطای نگارشی Comma Splice است.",
      },
      {
        id: "u13-q4",
        promptFa: "عبارت تاکیدی Cleft sentence:",
        questionTextEn: "'What impressed the examiners most ______ her impeccable pronunciation.'",
        options: ["was", "were", "is been", "being"],
        correctIndex: 0,
        explanationFa: "در ساختار what-cleft جمله با فعل مفرد was کامل می‌شود.",
      },
      {
        id: "u13-q5",
        promptFa: "نگارش صحیح عبارت علیرغم:",
        questionTextEn: "Choose the correct sentence:",
        options: [
          "Despite of the rain, the match continued.",
          "Despite the rain, the match continued.",
          "In spite the rain, the match continued.",
          "Despite that the rain, the match continued.",
        ],
        correctIndex: 1,
        explanationFa: "کلمه despite هرگز of نمی‌گیرد؛ در حالی که in spite حتماً of دارد (in spite of).",
      },
    ],
  },
  {
    id: "unit-14",
    tier: "C1",
    tierLabelFa: "سطح C1: تسلط پیشرفته و مهارت‌های آیلتس",
    unitNumber: 14,
    titleFa: "یونیت ۱۴: کالبدشکافی تله‌های لیسنینگ و همایندهای آکادمیک",
    titleEn: "Unit 14: Listening Distractor Mastery & Academic Collocations",
    descriptionFa: "شناسایی اصلاحات لحظه‌ای (Self-Correction)، تله‌های املایی پارت ۱ و ۴ آیلتس و واژگان AWL.",
    badgeIcon: "🎯",
    sideQuest: {
      id: "sq-14",
      titleFa: "کلینیک لیسنینگ آیلتس: تله‌های حواس‌پرت‌کن و املا",
      descriptionFa: "تکنیک شنیدن کلمات کلیدی، نام خانوادگی‌های دارای دوبل لتر و شماره‌های تلفن",
      deepLinkHref: "/ielts/clinics",
      icon: "🎧",
    },
    nodes: [
      {
        id: "u14-n1",
        unitId: "unit-14",
        order: 1,
        titleFa: "درس تخصصی: آناتومی تله‌های خوداصلاحی (Self-Correction Distractors)",
        titleEn: "Anatomy of Cambridge Audio Distractors",
        type: "concept",
        typeLabelFa: "درس مفهومی",
        icon: "📖",
        xpReward: 50,
        deepLinkHref: "/listening",
        summaryFa: "چگونه گوینده ابتدا عددی را می‌گوید اما سپس با 'Oh wait, actually...' آن را اصلاح می‌کند؟",
        estimatedMinutes: 6,
      },
      {
        id: "u14-n2",
        unitId: "unit-14",
        order: 2,
        titleFa: "لیسنینگ شبیه‌سازی‌شده: سخنرانی آکادمیک درباره رفتارشناسی جانوری",
        titleEn: "Listening: Academic Lecture on Ethology",
        type: "receptive",
        typeLabelFa: "تمرین دریافتی",
        icon: "🎧",
        xpReward: 60,
        deepLinkHref: "/listening",
        summaryFa: "یادداشت‌برداری سریع و تکمیل جدول خلاصه‌نویسی در قالب پارت ۴ آیلتس.",
        estimatedMinutes: 8,
      },
      {
        id: "u14-n3",
        unitId: "unit-14",
        order: 3,
        titleFa: "اسپیکینگ: پارت ۳ آیلتس و تحلیل پدیده‌های کلان اجتماعی",
        titleEn: "Speaking: Abstract Societal Analysis (IELTS Part 3)",
        type: "speaking",
        typeLabelFa: "مأموریت تعاملی",
        icon: "🗣️",
        xpReward: 70,
        deepLinkHref: "/ielts/clinics",
        summaryFa: "پرهیز از مثال‌های شخصی و پاسخ در سطح جوامع بشری و نسل‌ها.",
        estimatedMinutes: 8,
      },
      {
        id: "u14-n4",
        unitId: "unit-14",
        order: 4,
        titleFa: "لایتنر: املای کلمات تله‌ساز آیلتس (Accommodation, Necessary)",
        titleEn: "Leitner Checkpoint: Cambridge Spelling Nightmares",
        type: "leitner",
        typeLabelFa: "ایستگاه مرور لایتنر",
        icon: "🗃️",
        xpReward: 50,
        deepLinkHref: "/mistakes/leitner",
        summaryFa: "تثبیت حروف دوبل: double c & double m در accommodation.",
        estimatedMinutes: 5,
      },
      {
        id: "u14-n5",
        unitId: "unit-14",
        order: 5,
        titleFa: "غول‌آزمون یونیت ۱۴: چالش سنجش هوش شنیداری آیلتس",
        titleEn: "Boss Gate 14: Advanced Receptive Diagnostics",
        type: "boss",
        typeLabelFa: "دروازه ارزیابی (Boss Gate)",
        icon: "🛡️",
        xpReward: 160,
        deepLinkHref: "#boss-gate",
        summaryFa: "آزمون دقت شنیداری، املای صحیح و ردیابی تله‌های خوداصلاحی.",
        estimatedMinutes: 7,
      },
    ],
    bossQuestions: [
      {
        id: "u14-q1",
        promptFa: "ردیابی خوداصلاحی در فایل صوتی:\n'I initially reserved room 402, but wait, the conference manager upgraded us to suite 510.'",
        audioSnippetTextEn: "I initially reserved room 402, but wait, the conference manager upgraded us to suite 510.",
        questionTextEn: "Which room is the speaker actually staying in?",
        options: ["Room 402", "Suite 510", "Room 400", "Suite 500"],
        correctIndex: 1,
        explanationFa: "گوینده با عبارت 'but wait... upgraded us to' پاسخ را به 510 تغییر داد.",
      },
      {
        id: "u14-q2",
        promptFa: "املای دقیق کلمه اقامتگاه در آزمون آیلتس:",
        questionTextEn: "Choose the correct spelling:",
        options: ["Accomodation", "Accommodation", "Acommodation", "Acomodation"],
        correctIndex: 1,
        explanationFa: "کلمه accommodation هم دو c و هم دو m دارد.",
      },
      {
        id: "u14-q3",
        promptFa: "همایند آکادمیک برای 'تاثیر عمیق گذاشتن':",
        questionTextEn: "The breakthrough had a ______ impact on modern oncology research.",
        options: ["profound", "heavy", "tall", "thick"],
        correctIndex: 0,
        explanationFa: "همایند پیشرفته برای تاثیر عمیق 'profound impact' است.",
      },
      {
        id: "u14-q4",
        promptFa: "در اسپیکینگ پارت ۳ آیلتس، پاسخ به 'Do people in your country read books?' چگونه باید شروع شود؟",
        questionTextEn: "Which opening demonstrates Band 7.5+ register in IELTS Part 3?",
        options: [
          "Well, generally speaking, there is a generational divide in reading habits...",
          "Yes, I really like reading books every weekend at my home...",
          "My brother never reads books because he plays games...",
          "Reading is good thing for everyone in Iran...",
        ],
        correctIndex: 0,
        explanationFa: "در پارت ۳ آیلتس از مثال‌های فردی پرهیز کرده و دیدگاه کلان جامعه‌شناختی (generational divide) ارائه می‌شود.",
      },
      {
        id: "u14-q5",
        promptFa: "املای صحیح کلمه ضروری:",
        questionTextEn: "Choose the correct spelling:",
        options: ["Neccessary", "Necessary", "Necesary", "Neccesary"],
        correctIndex: 1,
        explanationFa: "کلمه necessary دارای یک c و دو s است (one Collar, two Socks).",
      },
    ],
  },
  {
    id: "unit-15",
    tier: "C1",
    tierLabelFa: "سطح C1: تسلط پیشرفته و مهارت‌های آیلتس",
    unitNumber: 15,
    titleFa: "یونیت ۱۵: قله تسلط آیلتس و زبان بومی (Native Fluency Summit)",
    titleEn: "Unit 15: Grand Master Summit & IELTS 8.0+ Precision",
    descriptionFa: "همایندهای سطح بالای لکزیکال، تسلط بر لحن و آهنگ جمله (Intonation)، و ارزیابی نهایی نقشه راه.",
    badgeIcon: "👑",
    sideQuest: {
      id: "sq-15",
      titleFa: "شبیه‌ساز کامل آزمون ماک آیلتس ایندورا",
      descriptionFa: "آزمون شبیه‌سازی‌شده ۴ مهارتی آیلتس آکادمیک با کارنامه تحلیلی هوشمند",
      deepLinkHref: "/ielts",
      icon: "🎓",
    },
    nodes: [
      {
        id: "u15-n1",
        unitId: "unit-15",
        order: 1,
        titleFa: "درس قله: همایندهای پیشرفته غیربدیهی (Nuanced Collocations)",
        titleEn: "Advanced Collocations for Academic Band 8.5",
        type: "concept",
        typeLabelFa: "درس مفهومی",
        icon: "📖",
        xpReward: 50,
        deepLinkHref: "/learn/grammar",
        summaryFa: "تثبیت ترکیبات طبیعی نظیر fiercely competitive, bitterly disappointed, cast light upon.",
        estimatedMinutes: 6,
      },
      {
        id: "u15-n2",
        unitId: "unit-15",
        order: 2,
        titleFa: "ریدینگ نهایی: مقاله فلسفی-زبانی درباره ترجمه‌ناپذیری واژگان",
        titleEn: "Reading: The Untranslatability Paradox",
        type: "receptive",
        typeLabelFa: "تمرین دریافتی",
        icon: "🎧",
        xpReward: 65,
        deepLinkHref: "/ielts/clinics",
        summaryFa: "پاسخ به سوالات پیچیده Summary Completion و Matching Features در سطح C1.",
        estimatedMinutes: 8,
      },
      {
        id: "u15-n3",
        unitId: "unit-15",
        order: 3,
        titleFa: "اسپیکینگ قله: کلینیک فونولوژی و رفع تداخل لهجه مادری",
        titleEn: "Speaking: Persian L1 Phonological Polish",
        type: "speaking",
        typeLabelFa: "مأموریت تعاملی",
        icon: "🗣️",
        xpReward: 75,
        deepLinkHref: "/ielts/clinics",
        summaryFa: "حذف کسره اضافه در خوشه‌های همخوانی es-school و تثبیت تفاوت /w/ و /v/.",
        estimatedMinutes: 8,
      },
      {
        id: "u15-n4",
        unitId: "unit-15",
        order: 4,
        titleFa: "لایتنر نهایی: مرور گنجینه خانه ۵ (طلایی) لایتنر",
        titleEn: "Leitner Checkpoint: Conquering Box 5 Masteries",
        type: "leitner",
        typeLabelFa: "ایستگاه مرور لایتنر",
        icon: "🗃️",
        xpReward: 50,
        deepLinkHref: "/mistakes/leitner",
        summaryFa: "تایید پایانی تسلط بر خطاهای قدیمی لاگ‌شده از استودیوی کلاس و تمرین‌ها.",
        estimatedMinutes: 5,
      },
      {
        id: "u15-n5",
        unitId: "unit-15",
        order: 5,
        titleFa: "تاج‌گذاری: آزمون جامع قله تسلط ایندورا (Grand Master Gate)",
        titleEn: "Grand Master Gate 15: The Peak of Fluency",
        type: "boss",
        typeLabelFa: "دروازه ارزیابی (Boss Gate)",
        icon: "👑",
        xpReward: 250,
        deepLinkHref: "#boss-gate",
        summaryFa: "ارزیابی جامع فارغ‌التحصیلی از درخت مهارت‌های ایندورا با نشان طلایی C1.",
        estimatedMinutes: 10,
      },
    ],
    bossQuestions: [
      {
        id: "u15-q1",
        promptFa: "همایند قوی برای ناامیدی شدید:",
        questionTextEn: "The delegates were ______ disappointed by the failure to reach a consensus.",
        options: ["bitterly", "strongly", "hardly", "heavily"],
        correctIndex: 0,
        explanationFa: "همایند طبیعی و ثبت‌شده زبان برای ناامیدی عمیق 'bitterly disappointed' است.",
      },
      {
        id: "u15-q2",
        promptFa: "کدام ساختار تشبیهی سبک‌شناختی بدون خطاست؟",
        questionTextEn: "Choose the flawless academic expression:",
        options: [
          "Not until the data was verified did the panel publish the findings.",
          "Not until the data was verified the panel published the findings.",
          "Not until the data was verified did the panel published the findings.",
          "Not until was the data verified the panel did publish findings.",
        ],
        correctIndex: 0,
        explanationFa: "بعد از Not until + بند اول، در بند دوم وارونگی کمکی صورت می‌گیرد: did the panel publish.",
      },
      {
        id: "u15-q3",
        promptFa: "همایند صحیح برای رقابت تنگاتنگ و بی‌رحمانه:",
        questionTextEn: "The global artificial intelligence market has become ______ competitive.",
        options: ["fiercely", "angrily", "speedily", "strictly"],
        correctIndex: 0,
        explanationFa: "ترکیب 'fiercely competitive' همایند تحلیلی تراز اول انگلیسی است.",
      },
      {
        id: "u15-q4",
        promptFa: "پدیده واج‌شناختی Persian L1 Vowel Epenthesis چیست؟",
        questionTextEn: "What causes Persian speakers to say /es.kuːl/ instead of /skuːl/?",
        options: [
          "Persian phonotactics do not allow complex syllable-initial consonant clusters.",
          "Persian speakers cannot produce the sound /s/.",
          "It is a dialectal variation originating in American English.",
          "It is caused by confusing spelling with phonetics.",
        ],
        correctIndex: 0,
        explanationFa: "در دستگاه آوایی زبان فارسی خوشه‌های همخوانی ابتدای هجا (مانند sk) مجاز نیست و ذهن ناخودآگاه یک واکه کمکی e قبل از آن اضافه می‌کند.",
      },
      {
        id: "u15-q5",
        promptFa: "عبارت استعاری برای پرتوافکنی و روشن ساختن یک راز تاریخی:",
        questionTextEn: "The newly discovered archives ______ significant light on the negotiations.",
        options: ["shed", "throwed", "shined", "beamed"],
        correctIndex: 0,
        explanationFa: "همایند اصطلاحی استاندارد 'shed light on' (یا cast light on) است.",
      },
    ],
  },
];

// Helper to calculate initial progress with placement sync
export function getInitialProgress(): LearnerPathProgress {
  const defaultProgress: LearnerPathProgress = {
    completedNodeIds: [],
    unlockedUnitIds: ["unit-1"],
    nodeStars: {},
    totalXp: 0,
    currentStreak: 1,
    lastActiveDate: new Date().toISOString(),
  };

  if (typeof window === "undefined") {
    return defaultProgress;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }

    // Auto-sync with Placement Test if completed!
    const rawPlacement = localStorage.getItem(PLACEMENT_KEY);
    if (rawPlacement) {
      try {
        const placementData = JSON.parse(rawPlacement);
        const cefr = placementData.estimatedLevel || placementData.cefr_level || "A1";
        const synced = applyPlacementSync(defaultProgress, cefr);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(synced));
        return synced;
      } catch {
        // ignore placement parse error
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProgress));
    return defaultProgress;
  } catch {
    return defaultProgress;
  }
}

// Auto-unlock lower tiers based on placement level
export function applyPlacementSync(
  progress: LearnerPathProgress,
  cefrLevel: string
): LearnerPathProgress {
  const tierOrder: CEFRTier[] = ["A1", "A2", "B1", "B2", "C1"];
  const targetLevel = cefrLevel.toUpperCase().trim() as CEFRTier;
  const targetIdx = tierOrder.indexOf(targetLevel);

  if (targetIdx <= 0) {
    return progress; // Starts at A1
  }

  const completedNodeIds = new Set(progress.completedNodeIds);
  const unlockedUnitIds = new Set(progress.unlockedUnitIds);
  const nodeStars = { ...progress.nodeStars };
  let addedXp = progress.totalXp;

  for (const unit of CURRICULUM_UNITS) {
    const unitTierIdx = tierOrder.indexOf(unit.tier);
    if (unitTierIdx < targetIdx) {
      // Completed by placement bypass
      unlockedUnitIds.add(unit.id);
      for (const node of unit.nodes) {
        completedNodeIds.add(node.id);
        nodeStars[node.id] = 3;
        addedXp += node.xpReward;
      }
    } else if (unitTierIdx === targetIdx && unit.unitNumber === (targetIdx === 1 ? 4 : targetIdx === 2 ? 7 : targetIdx === 3 ? 10 : 13)) {
      // Unlock the first unit of their target level
      unlockedUnitIds.add(unit.id);
    }
  }

  return {
    ...progress,
    completedNodeIds: Array.from(completedNodeIds),
    unlockedUnitIds: Array.from(unlockedUnitIds),
    nodeStars,
    totalXp: addedXp,
  };
}

export function saveLearnerPathProgress(progress: LearnerPathProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error("Failed to save learning path progress:", err);
  }
}

// Mark a single node completed
export function completePathNode(
  nodeId: string,
  stars: number = 3,
  xpBonus: number = 0
): LearnerPathProgress {
  const current = getInitialProgress();
  const completedSet = new Set(current.completedNodeIds);
  const unlockedUnitsSet = new Set(current.unlockedUnitIds);
  const starsMap = { ...current.nodeStars };

  completedSet.add(nodeId);
  starsMap[nodeId] = Math.max(starsMap[nodeId] || 0, stars);

  // Find the node and unit
  let nodeReward = xpBonus;
  let targetUnit: PathUnit | undefined;
  for (const u of CURRICULUM_UNITS) {
    const foundNode = u.nodes.find((n) => n.id === nodeId);
    if (foundNode) {
      targetUnit = u;
      nodeReward += foundNode.xpReward;
      break;
    }
  }

  // Check if all nodes in targetUnit are completed
  if (targetUnit) {
    const allUnitNodesDone = targetUnit.nodes.every((n) => completedSet.has(n.id));
    if (allUnitNodesDone) {
      // Unlock next unit
      const currentUnitIndex = CURRICULUM_UNITS.findIndex((u) => u.id === targetUnit!.id);
      if (currentUnitIndex >= 0 && currentUnitIndex + 1 < CURRICULUM_UNITS.length) {
        unlockedUnitsSet.add(CURRICULUM_UNITS[currentUnitIndex + 1].id);
      }
    }
  }

  const updated: LearnerPathProgress = {
    ...current,
    completedNodeIds: Array.from(completedSet),
    unlockedUnitIds: Array.from(unlockedUnitsSet),
    nodeStars: starsMap,
    totalXp: current.totalXp + nodeReward,
    lastActiveDate: new Date().toISOString(),
  };

  saveLearnerPathProgress(updated);
  return updated;
}

// Pass a Boss Gate / Jump Ahead
export function passBossGate(unitId: string, scorePercent: number): LearnerPathProgress {
  const current = getInitialProgress();
  const unit = CURRICULUM_UNITS.find((u) => u.id === unitId);
  if (!unit) return current;

  const completedSet = new Set(current.completedNodeIds);
  const unlockedUnitsSet = new Set(current.unlockedUnitIds);
  const starsMap = { ...current.nodeStars };

  // Calculate stars: >= 95% = 3 stars, >= 85% = 2 stars, >= 80% = 1 star
  const stars = scorePercent >= 95 ? 3 : scorePercent >= 85 ? 2 : 1;

  // Mark all nodes in this unit as complete (Test-out effect)
  let gainedXp = 0;
  for (const node of unit.nodes) {
    if (!completedSet.has(node.id)) {
      completedSet.add(node.id);
      starsMap[node.id] = stars;
      gainedXp += node.xpReward;
    }
  }

  // Unlock the subsequent unit
  const currentUnitIndex = CURRICULUM_UNITS.findIndex((u) => u.id === unitId);
  if (currentUnitIndex >= 0 && currentUnitIndex + 1 < CURRICULUM_UNITS.length) {
    unlockedUnitsSet.add(CURRICULUM_UNITS[currentUnitIndex + 1].id);
  }

  const updated: LearnerPathProgress = {
    ...current,
    completedNodeIds: Array.from(completedSet),
    unlockedUnitIds: Array.from(unlockedUnitsSet),
    nodeStars: starsMap,
    totalXp: current.totalXp + gainedXp + 50, // 50 XP bonus for clearing boss gate
    lastActiveDate: new Date().toISOString(),
  };

  saveLearnerPathProgress(updated);
  return updated;
}

// Calculate the Next Best Step
export function getNextBestNode(progress: LearnerPathProgress): {
  unit: PathUnit;
  node: PathNode;
  orderInUnit: number;
} | null {
  for (const unit of CURRICULUM_UNITS) {
    if (progress.unlockedUnitIds.includes(unit.id)) {
      for (let i = 0; i < unit.nodes.length; i++) {
        const node = unit.nodes[i];
        if (!progress.completedNodeIds.includes(node.id)) {
          return { unit, node, orderInUnit: i + 1 };
        }
      }
    }
  }
  // If all completed, return last node of last unit
  const lastUnit = CURRICULUM_UNITS[CURRICULUM_UNITS.length - 1];
  return {
    unit: lastUnit,
    node: lastUnit.nodes[lastUnit.nodes.length - 1],
    orderInUnit: lastUnit.nodes.length,
  };
}

export function getNodeStatus(
  nodeId: string,
  unitId: string,
  progress: LearnerPathProgress
): PathNodeStatus {
  if (progress.completedNodeIds.includes(nodeId)) {
    return "completed";
  }

  if (!progress.unlockedUnitIds.includes(unitId)) {
    return "locked";
  }

  const unit = CURRICULUM_UNITS.find((u) => u.id === unitId);
  if (!unit) return "locked";

  const nodeIndex = unit.nodes.findIndex((n) => n.id === nodeId);
  if (nodeIndex === 0) {
    return "available";
  }

  const previousNode = unit.nodes[nodeIndex - 1];
  if (progress.completedNodeIds.includes(previousNode.id)) {
    return "available";
  }

  return "locked";
}

import { PathNode, PathUnit } from "./learning-path-storage";

export interface InteractiveLessonContent {
  conceptTipTitleFa: string;
  conceptTipBodyFa: string;
  exampleEn: string;
  exampleFa: string;
  audioPhraseEn: string;
  quizPromptFa: string;
  quizQuestionEn: string;
  quizAudioSnippetEn?: string;
  quizOptions: string[];
  correctIndex: number;
  explanationFa: string;
}

// Play natural native English speech using browser SpeechSynthesis
export function playEnglishAudio(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[_—]+/g, " blank ").trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-US";
    utterance.rate = 0.88;

    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Natural") ||
          v.name.includes("Google") ||
          v.name.includes("Samantha") ||
          v.name.includes("US"))
    );
    if (enVoice) {
      utterance.voice = enVoice;
    }
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn("Speech synthesis error:", err);
  }
}

// Curated lessons for core units with pedagogical depth
const CURATED_LESSONS: Record<string, InteractiveLessonContent> = {
  // UNIT 1: A1
  "u1-n1": {
    conceptTipTitleFa: "کالبدشکافی ضمایر فاعلی و فعل To Be",
    conceptTipBodyFa:
      "افعال To Be (شامل am, is, are) ستون فقرات جمله‌سازی در زبان انگلیسی هستند. به یاد داشته باشید که در انگلیسی فاعل هرگز حذف نمی‌شود و با هر ضمیر، فعل مناسب آن همراه می‌گردد.",
    exampleEn: "She is a university student and I am her teacher.",
    exampleFa: "او یک دانشجو است و من معلم او هستم.",
    audioPhraseEn: "She is a university student and I am her teacher.",
    quizPromptFa: "جای خالی را با فعل To Be مناسب کامل کنید:",
    quizQuestionEn: "My parents and I _______ very happy to meet you here.",
    quizAudioSnippetEn: "My parents and I are very happy to meet you here.",
    quizOptions: ["am", "is", "are", "be"],
    correctIndex: 2,
    explanationFa:
      "چون فاعل جمله ترکیب «My parents and I» یعنی جمع (ما / We) است، فعل مناسب آن are می‌باشد، هرچند بعد از ضمیر I قرار گرفته است.",
  },
  "u1-n2": {
    conceptTipTitleFa: "تکنیک لیسنینگ: درک مکالمات هتل و فرودگاه",
    conceptTipBodyFa:
      "هنگام شنیدن نام‌ها و مشخصات، روی کلمات کلیدی مثل Surname (نام خانوادگی)، Nationality (ملیت) و Purpose of visit (هدف از سفر) تمرکز کنید. حروف اضافه ارتباطی را نادیده بگیرید تا استرس کاهش یابد.",
    exampleEn: "Excuse me, could you please spell your last name for the check-in?",
    exampleFa: "ببخشید، ممکن است نام خانوادگی‌تان را برای پذیرش هجی کنید؟",
    audioPhraseEn: "Excuse me, could you please spell your last name for the check-in?",
    quizPromptFa: "به جمله صوتی گوش دهید یا بخوانید؛ هدف مسافر کدام است؟",
    quizQuestionEn: "'I have a reservation under the name of Miller for three nights.'",
    quizAudioSnippetEn: "I have a reservation under the name of Miller for three nights.",
    quizOptions: [
      "خرید بلیط هواپیما",
      "تحویل اتاق رزرو شده در هتل",
      "لغو پرواز به علت تاخیر",
      "اجاره خودرو در فرودگاه",
    ],
    correctIndex: 1,
    explanationFa:
      "عبارت «reservation under the name... for three nights» به صراحت نشان‌دهنده ورود به هتل و تحویل اتاق رزرو شده است.",
  },
  "u1-n3": {
    conceptTipTitleFa: "الگوهای کاربردی سفارش نوشیدنی در کافه",
    conceptTipBodyFa:
      "برای سفارش دادن، از عبارت محترمانه 'Can I have...' یا 'I'd like...' همراه با اندازه (Small, Medium, Large) و نحوه مصرف (For here یا To go) استفاده کنید.",
    exampleEn: "Can I have a medium cappuccino to go, please?",
    exampleFa: "می‌توانم یک کاپوچینوی متوسط بیرون‌بر داشته باشم، لطفاً؟",
    audioPhraseEn: "Can I have a medium cappuccino to go, please?",
    quizPromptFa: "کدام گزینه طبیعی‌ترین و محترمانه‌ترین روش سفارش قهوه است؟",
    quizQuestionEn: "Cashier: 'What can I get for you today?'",
    quizAudioSnippetEn: "What can I get for you today?",
    quizOptions: [
      "Give me a coffee right now.",
      "I want coffee without sugar.",
      "I'd like a large latte with oat milk, please.",
      "You make me coffee immediately.",
    ],
    correctIndex: 2,
    explanationFa:
      "استفاده از ساختار «I'd like... please» استاندارد بین‌المللی ادب و احترام در سفارشات روزمره است.",
  },
  "u1-n4": {
    conceptTipTitleFa: "اصلاح اشتباهات رایج: سلام، خداحافظی و توافق",
    conceptTipBodyFa:
      "یکی از شایع‌ترین تله‌های زبانی، ترجمه کلمه‌به‌کلمه 'من موافقم' به 'I am agree' است. کلمه agree خود یک فعل است، بنابراین شکل صحیح آن 'I agree' می‌باشد.",
    exampleEn: "I totally agree with your suggestion.",
    exampleFa: "من کاملاً با پیشنهاد شما موافقم.",
    audioPhraseEn: "I totally agree with your suggestion.",
    quizPromptFa: "کدام جمله از نظر ساختار گرامری کاملاً صحیح است؟",
    quizQuestionEn: "Choose the grammatically correct sentence:",
    quizAudioSnippetEn: "I completely agree with what you just said.",
    quizOptions: [
      "I am agree with your opinion.",
      "I agree with your opinion.",
      "I am agreeing with you always.",
      "She is agree with the plan.",
    ],
    correctIndex: 1,
    explanationFa:
      "فعل agree نیاز به فعل کمکی am ندارد. بنابراین 'I agree with your opinion' صحیح است.",
  },

  // UNIT 2: A1
  "u2-n1": {
    conceptTipTitleFa: "حال ساده و روتین‌های روزمره (Present Simple)",
    conceptTipBodyFa:
      "برای بیان کارهای همیشگی و عادات روزانه از زمان حال ساده استفاده می‌کنیم. در سوم شخص مفرد (he, she, it) افزودن s یا es به انتهای فعل الزامی است.",
    exampleEn: "He wakes up at 7 AM and drinks coffee before work.",
    exampleFa: "او ساعت ۷ صبح بیدار می‌شود و قبل از کار قهوه می‌نوشد.",
    audioPhraseEn: "He wakes up at 7 AM and drinks coffee before work.",
    quizPromptFa: "گزینه صحیح را برای پر کردن جای خالی انتخاب کنید:",
    quizQuestionEn: "My brother usually _______ to the gym on weekends.",
    quizAudioSnippetEn: "My brother usually goes to the gym on weekends.",
    quizOptions: ["go", "goes", "is going", "went"],
    correctIndex: 1,
    explanationFa:
      "چون فاعل My brother (سوم شخص مفرد / he) است و قید تکرار usually استفاده شده، فعل شکل goes به خود می‌گیرد.",
  },
  "u2-n2": {
    conceptTipTitleFa: "درک مکالمه: برنامه‌ریزی یک قرار ملاقات",
    conceptTipBodyFa:
      "در مکالمات هماهنگی زمان، حروف اضافه زمان بسیار حیاتی‌اند: برای ساعت از at (مثل at 5 PM)، برای روزها از on (مثل on Monday) و برای ماه‌ها از in (مثل in May) استفاده کنید.",
    exampleEn: "Let's meet on Friday at 6:30 PM outside the cinema.",
    exampleFa: "بیا جمعه ساعت ۶:۳۰ بعدازظهر جلوی سینما همدیگر را ببینیم.",
    audioPhraseEn: "Let's meet on Friday at 6:30 PM outside the cinema.",
    quizPromptFa: "حرف اضافه مناسب برای زمان و روز در جمله زیر چیست؟",
    quizQuestionEn: "The meeting starts _______ 9:00 AM _______ Monday.",
    quizAudioSnippetEn: "The meeting starts at 9:00 AM on Monday.",
    quizOptions: ["in / at", "on / in", "at / on", "at / in"],
    correctIndex: 2,
    explanationFa:
      "برای ساعت دقیق از at و برای روزهای هفته از on استفاده می‌شود: at 9:00 AM on Monday.",
  },
  "u2-n3": {
    conceptTipTitleFa: "مکالمه هوشمند: توصیف خانواده و شغل‌ها",
    conceptTipBodyFa:
      "هنگام صحبت درباره شغل از حرف تعریف a یا an قبل از نام شغل استفاده کنید: She is an architect / He is a doctor.",
    exampleEn: "My sister works as an engineer for a software company.",
    exampleFa: "خواهرم به عنوان یک مهندس برای یک شرکت نرم‌افزاری کار می‌کند.",
    audioPhraseEn: "My sister works as an engineer for a software company.",
    quizPromptFa: "کدام گزینه جمله را به درستی کامل می‌کند؟",
    quizQuestionEn: "Sarah is _______ accountant and her husband is _______ dentist.",
    quizAudioSnippetEn: "Sarah is an accountant and her husband is a dentist.",
    quizOptions: ["a / a", "an / a", "a / an", "an / the"],
    correctIndex: 1,
    explanationFa:
      "کلمه accountant با صدای صدادار شروع می‌شود و an می‌گیرد؛ dentist با حرف بی‌صدا شروع شده و a می‌گیرد.",
  },
  "u2-n4": {
    conceptTipTitleFa: "تثبیت لایتنر: قیود تکرار و جایگاه آن‌ها در جمله",
    conceptTipBodyFa:
      "قیود تکرار (always, usually, often, sometimes, never) قبل از فعل اصلی قرار می‌گیرند، اما بعد از فعل to be می‌آیند: I always eat breakfast / I am always late.",
    exampleEn: "They never arrive late for important meetings.",
    exampleFa: "آن‌ها هرگز برای جلسات مهم دیر نمی‌رسند.",
    audioPhraseEn: "They never arrive late for important meetings.",
    quizPromptFa: "جایگاه صحیح قید تکرار always در کدام گزینه رعایت شده است؟",
    quizQuestionEn: "Which sentence has the correct word order?",
    quizAudioSnippetEn: "He is always polite to his colleagues.",
    quizOptions: [
      "He always is polite to his colleagues.",
      "He is always polite to his colleagues.",
      "Always he is polite to his colleagues.",
      "He is polite always to his colleagues.",
    ],
    correctIndex: 1,
    explanationFa:
      "قیود تکرار همواره بعد از فعل to be (در اینجا is) قرار می‌گیرند: He is always polite.",
  },

  // UNIT 3: A1
  "u3-n1": {
    conceptTipTitleFa: "اسامی قابل شمارش و غیرقابل شمارش (There is / There are)",
    conceptTipBodyFa:
      "برای اسامی مفرد و غیرقابل‌شمارش از There is و برای اسامی جمع از There are استفاده کنید. با اسامی غیرقابل‌شمارش از some و any استفاده می‌شود.",
    exampleEn: "There is some milk in the fridge, but there aren't any eggs.",
    exampleFa: "مقداری شیر در یخچال هست، اما هیچ تخم‌مرغی وجود ندارد.",
    audioPhraseEn: "There is some milk in the fridge, but there aren't any eggs.",
    quizPromptFa: "گزینه صحیح را برای پر کردن جای خالی انتخاب کنید:",
    quizQuestionEn: "Are there _______ clean glasses on the dining table?",
    quizAudioSnippetEn: "Are there any clean glasses on the dining table?",
    quizOptions: ["some", "any", "a", "much"],
    correctIndex: 1,
    explanationFa:
      "در جملات سوالی و منفی برای اسامی جمع یا غیرقابل‌شمارش معمولاً از any استفاده می‌شود.",
  },
};

// Fallback high quality dynamic lesson generator for any node
export function getInteractiveLessonForNode(
  node: PathNode,
  unit: PathUnit
): InteractiveLessonContent {
  if (CURATED_LESSONS[node.id]) {
    return CURATED_LESSONS[node.id];
  }

  // Type-aware educational generation
  if (node.type === "concept") {
    return {
      conceptTipTitleFa: `مفاهیم کلیدی و الگوهای ${node.titleFa}`,
      conceptTipBodyFa:
        node.summaryFa ||
        `در این درس تحلیلی، الگوهای طبیعی و ساختار استاندارد ${node.titleEn} را می‌آموزید تا بتوانید بدون ترجمه از فارسی به راحتی صحبت کنید.`,
      exampleEn: `Mastering ${node.titleEn} allows you to speak naturally and accurately.`,
      exampleFa: `تسلط بر این مبحث به شما کمک می‌کند تا طبیعی و با اعتمادبه‌نفس مکالمه کنید.`,
      audioPhraseEn: `Mastering ${node.titleEn} allows you to speak naturally and accurately.`,
      quizPromptFa: `کدام گزینه مناسب‌ترین عبارت را برای کاربرد در این مفهوم دارد؟`,
      quizQuestionEn: `In the context of ${node.titleEn}, which sentence is natural and correct?`,
      quizAudioSnippetEn: `Practice makes progress when learning step by step.`,
      quizOptions: [
        "Applying the rules consistently in everyday conversations.",
        "Translating every single word literally from your native tongue.",
        "Ignoring grammatical agreement between subject and verb.",
        "Skipping sentence structure and memorizing random words.",
      ],
      correctIndex: 0,
      explanationFa:
        "کاربرد مداوم ساختارهای آموخته‌شده در مکالمات واقعی بهترین راه تثبیت مفاهیم است.",
    };
  }

  if (node.type === "receptive") {
    return {
      conceptTipTitleFa: `مهارت شنیداری و درک مطلب: ${node.titleFa}`,
      conceptTipBodyFa:
        "در مهارت‌های دریافتی، توجه به استرس کلمات (Stress) و آهنگ جمله (Intonation) کلید فهم پیام اصلی گوینده بدون گیج شدن در جزییات است.",
      exampleEn: "Listen for the stressed words: nouns, verbs, and adjectives carry the meaning.",
      exampleFa: "به کلمات دارای تکیه گوش دهید: اسم‌ها، فعل‌ها و صفت‌ها معنای اصلی را حمل می‌کنند.",
      audioPhraseEn: "Listen for the stressed words: nouns, verbs, and adjectives carry the meaning.",
      quizPromptFa: "با توجه به هدف این تمرین شنیداری/درک‌مطلب، پاسخ صحیح را بیابید:",
      quizQuestionEn: `According to standard listening comprehension for ${node.titleEn}, what should you prioritize?`,
      quizAudioSnippetEn: "Focus on the overall message first, then catch the specific details.",
      quizOptions: [
        "Focusing on the main idea and key content words.",
        "Stopping the audio every time an unfamiliar word appears.",
        "Trying to write down every preposition and auxiliary verb.",
        "Translating every sound into Persian simultaneously.",
      ],
      correctIndex: 0,
      explanationFa:
        "تمرکز بر پیام کلی و کلمات حامل محتوا (Content Words) موثرترین استراتژی تقویت درک شنیداری است.",
    };
  }

  if (node.type === "speaking") {
    return {
      conceptTipTitleFa: `چالش مکالمه فعال: ${node.titleFa}`,
      conceptTipBodyFa:
        "در مکالمه انگلیسی، روانی (Fluency) در ابتدای کار بر دقت ۱۰۰٪ ارجحیت دارد. از وقفه‌های طولانی نترسید و با عبارات پیونددهنده مثل Well, You know, In my opinion صحبت خود را پیش ببرید.",
      exampleEn: "In my opinion, regular daily practice is the secret to natural fluency.",
      exampleFa: "به نظر من، تمرین منظم روزانه راز روانی و تسلط طبیعی در مکالمه است.",
      audioPhraseEn: "In my opinion, regular daily practice is the secret to natural fluency.",
      quizPromptFa: "مناسب‌ترین واکنش کلامی در این موقعیت چیست؟",
      quizQuestionEn: `Speaker A: 'Could you tell me more about your experience with this topic?'`,
      quizAudioSnippetEn: "Could you tell me more about your experience with this topic?",
      quizOptions: [
        "Certainly, I'd be happy to share my thoughts on that.",
        "No, don't ask me anything because I am busy.",
        "I am agree with whatever you say blindly.",
        "Yes, English is very difficult for everyone.",
      ],
      correctIndex: 0,
      explanationFa:
        "پاسخ محترمانه و حرفه‌ای با استفاده از فرمول‌های گفتاری 'Certainly, I'd be happy to...' نشان‌دهنده تسلط و ادب کلامی است.",
    };
  }

  // Leitner / Vocabulary Review
  return {
    conceptTipTitleFa: `تثبیت در حافظه بلندمدت (SRS): ${node.titleFa}`,
    conceptTipBodyFa:
      "برای یادگیری دائمی واژگان، هر کلمه را در قالب یک 'کولومیشن' یا عبارت معنادار (Collocation) یاد بگیرید، نه به صورت کلمه تک و ایزوله.",
    exampleEn: "Always learn words in context: make a decision, take a break, pay attention.",
    exampleFa: "کلمات را در بافت جمله یاد بگیرید: تصمیم گرفتن، استراحت کردن، توجه کردن.",
    audioPhraseEn: "Always learn words in context: make a decision, take a break, pay attention.",
    quizPromptFa: "کدام کلمه این عبارت پرکاربرد را به درستی کامل می‌کند؟",
    quizQuestionEn: "Before you make up your mind, please _______ careful attention to the details.",
    quizAudioSnippetEn: "Please pay careful attention to the details.",
    quizOptions: ["give", "pay", "take", "bring"],
    correctIndex: 1,
    explanationFa:
      "اصطلاح صحیح و طبیعی در زبان انگلیسی pay attention (توجه کردن) است که یک هم‌آیی (Collocation) ثابت محسوب می‌شود.",
  };
}

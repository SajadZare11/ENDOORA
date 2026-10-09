/**
 * Video-Based Learning Engine & Dataset
 * Supports Family and Friends (Children & Beginners) & American English File (Adults & Teens)
 * Provides comprehensive 6-Skill Assessment (Listening, Vocabulary, Grammar, Speaking, Reading, Writing)
 */

export type VideoSeries = "family_and_friends" | "american_english_file";

export type SkillType =
  | "listening"
  | "vocabulary"
  | "grammar"
  | "speaking"
  | "reading"
  | "writing";

export interface SkillMeta {
  id: SkillType;
  titleFa: string;
  titleEn: string;
  icon: string;
  color: string;
  accentBg: string;
}

export const SKILLS_META: Record<SkillType, SkillMeta> = {
  listening: {
    id: "listening",
    titleFa: "مهارت شنیداری",
    titleEn: "Listening Comprehension",
    icon: "🎧",
    color: "#2563eb",
    accentBg: "rgba(37, 99, 235, 0.1)",
  },
  vocabulary: {
    id: "vocabulary",
    titleFa: "واژگان و اصطلاحات",
    titleEn: "Vocabulary & Phrases",
    icon: "💡",
    color: "#14b8a6",
    accentBg: "rgba(20, 184, 166, 0.1)",
  },
  grammar: {
    id: "grammar",
    titleFa: "گرامر و ساختار",
    titleEn: "Grammar & Structure",
    icon: "📐",
    color: "#8b5cf6",
    accentBg: "rgba(139, 92, 246, 0.1)",
  },
  speaking: {
    id: "speaking",
    titleFa: "گفتاری و تلفظ",
    titleEn: "Speaking & Pronunciation",
    icon: "🎙️",
    color: "#f59e0b",
    accentBg: "rgba(245, 158, 11, 0.1)",
  },
  reading: {
    id: "reading",
    titleFa: "درک مطلب و خواندن",
    titleEn: "Reading Comprehension",
    icon: "📖",
    color: "#0ea5e9",
    accentBg: "rgba(14, 165, 233, 0.1)",
  },
  writing: {
    id: "writing",
    titleFa: "نگارش کاربردی",
    titleEn: "Applied Writing",
    icon: "✍️",
    color: "#10b981",
    accentBg: "rgba(16, 185, 129, 0.1)",
  },
};

export interface TranscriptLine {
  id: number;
  seconds: number;
  timeDisplay: string;
  speaker: string;
  textEn: string;
  textFa: string;
}

export interface BaseQuestion {
  skill: SkillType;
  promptFa: string;
  promptEn: string;
  explanationFa: string;
}

export interface ChoiceQuestion extends BaseQuestion {
  skill: "listening" | "vocabulary" | "grammar" | "reading";
  timestampSeconds?: number;
  timestampDisplay?: string;
  targetTerm?: string;
  options: Array<{
    id: number;
    textEn: string;
    textFa: string;
  }>;
  correctOptionId: number;
}

export interface SpeakingQuestion extends BaseQuestion {
  skill: "speaking";
  targetPhraseEn: string;
  targetPhraseFa: string;
  phoneticGuide: string;
  timestampSeconds?: number;
  timestampDisplay?: string;
  speakingTipsFa: string;
}

export interface WritingQuestion extends BaseQuestion {
  skill: "writing";
  minWords: number;
  sampleAnswerEn: string;
  sampleAnswerFa: string;
  keywordsToUse: string[];
  evaluationTipsFa: string;
}

export type SkillQuestionItem = ChoiceQuestion | SpeakingQuestion | WritingQuestion;

export interface VideoLesson {
  id: string;
  series: VideoSeries;
  seriesTitleFa: string;
  seriesTitleEn: string;
  targetAudienceFa: string;
  titleFa: string;
  titleEn: string;
  bookLevel: string;
  unit: string;
  cefr: "A1" | "A2" | "B1" | "B2";
  duration: string;
  durationSec: number;
  posterGradient: string;
  posterIcon: string;
  summaryFa: string;
  summaryEn: string;
  keyTopicsFa: string[];
  transcript: TranscriptLine[];
  questions: {
    listening: ChoiceQuestion;
    vocabulary: ChoiceQuestion;
    grammar: ChoiceQuestion;
    speaking: SpeakingQuestion;
    reading: ChoiceQuestion;
    writing: WritingQuestion;
  };
}

export const VIDEO_LESSONS: VideoLesson[] = [
  // ==========================================
  // American English File - Lesson 1 (AEF-01)
  // ==========================================
  {
    id: "aef-01-restaurant",
    series: "american_english_file",
    seriesTitleFa: "American English File",
    seriesTitleEn: "American English File",
    targetAudienceFa: "بزرگسالان و جوانان",
    titleFa: "در رستوران: سفارش غذا با راب و جنی در نیویورک",
    titleEn: "At the Restaurant: Jenny and Rob in New York",
    bookLevel: "Book 2 (سطح پیش‌متوسط)",
    unit: "Practical English · Episode 2",
    cefr: "A2",
    duration: "4:30",
    durationSec: 270,
    posterGradient: "linear-gradient(135deg, #1e3a8a, #0d9488)",
    posterIcon: "🍽️",
    summaryFa: "راب به نیویورک آمده و با جنی به رستوران می‌روند. این ویدیو عبارات محاوره‌ای، سفارش محترمانه غذا، رسیدگی به اشتباهات سفارش و پرداخت صورت‌حساب را آموزش می‌دهد.",
    summaryEn: "Rob arrives in New York and meets Jenny at a restaurant. Learn practical phrases for ordering meals, handling order issues, and asking for the bill politely.",
    keyTopicsFa: ["سفارش مؤدبانه غذا", "بیان ترجیحات و آلرژی‌ها", "درخواست صورت‌حساب", "مکالمه با پیشخدمت"],
    transcript: [
      {
        id: 1,
        seconds: 12,
        timeDisplay: "00:12",
        speaker: "Waiter",
        textEn: "Good evening. Are you ready to order?",
        textFa: "عصر بخیر. آیا برای سفارش آماده‌اید؟",
      },
      {
        id: 2,
        seconds: 24,
        timeDisplay: "00:24",
        speaker: "Jenny",
        textEn: "Yes, I'd like the grilled tuna with roasted potatoes, please.",
        textFa: "بله، من تن ماهی کبابی با سیب‌زمینی تنوری می‌خواهم، لطفاً.",
      },
      {
        id: 3,
        seconds: 38,
        timeDisplay: "00:38",
        speaker: "Waiter",
        textEn: "And for you, sir?",
        textFa: "و برای شما جناب؟",
      },
      {
        id: 4,
        seconds: 46,
        timeDisplay: "00:46",
        speaker: "Rob",
        textEn: "I'll have the mushroom risotto, and could we have some still water?",
        textFa: "من ریزوتوی قارچ می‌خورم، و می‌توانیم مقداری آب بدون گاز داشته باشیم؟",
      },
      {
        id: 5,
        seconds: 68,
        timeDisplay: "01:08",
        speaker: "Waiter",
        textEn: "Certainly. Still or sparkling? And would you like any starters?",
        textFa: "حتماً. آب معمولی یا گازدار؟ و آیا پیش‌غذا میل دارید؟",
      },
      {
        id: 6,
        seconds: 92,
        timeDisplay: "01:32",
        speaker: "Jenny",
        textEn: "No starters for us, thank you. Could we have the bill when you're ready?",
        textFa: "پیش‌غذا میل نداریم، متشکرم. لطفاً هر زمان آماده بودید صورت‌حساب را هم بیاورید؟",
      },
    ],
    questions: {
      listening: {
        skill: "listening",
        promptFa: "بر اساس مکالمه در زمان 00:46، راب چه غذایی را برای شام سفارش می‌دهد؟",
        promptEn: "According to the dialogue at 00:46, what dish does Rob order for dinner?",
        timestampSeconds: 46,
        timestampDisplay: "00:46",
        explanationFa: "راب به صورت مستقیم می‌گوید: 'I'll have the mushroom risotto'.",
        options: [
          { id: 1, textEn: "The grilled tuna with potatoes", textFa: "ماهی تن کبابی با سیب‌زمینی" },
          { id: 2, textEn: "The mushroom risotto", textFa: "ریزوتوی قارچ" },
          { id: 3, textEn: "A chicken salad with dressing", textFa: "سالاد مرغ با سس مخصوص" },
          { id: 4, textEn: "Tomato soup and fresh bread", textFa: "سوپ گوجه با نان تازه" },
        ],
        correctOptionId: 2,
      },
      vocabulary: {
        skill: "vocabulary",
        promptFa: "در انگلیسی کاربردی رستوران، تفاوت میان 'still water' و 'sparkling water' چیست؟",
        promptEn: "In restaurant English, what does 'still water' mean?",
        targetTerm: "still water vs sparkling water",
        explanationFa: "کلمه 'still water' به معنی آب معمولی بدون گاز است، در حالی که 'sparkling water' آب گازدار یا سودا می‌باشد.",
        options: [
          { id: 1, textEn: "Non-carbonated regular drinking water", textFa: "آب آشامیدنی معمولی بدون گاز" },
          { id: 2, textEn: "Boiled tap water with lemon", textFa: "آب جوشیده لوله‌کشی با لیمو" },
          { id: 3, textEn: "Fizzy soda with bubbles", textFa: "نوشیدنی گازدار دارای حباب" },
          { id: 4, textEn: "Iced mineral water with sugar", textFa: "آب‌معدنی بسیار خنک با شکر" },
        ],
        correctOptionId: 1,
      },
      grammar: {
        skill: "grammar",
        promptFa: "کدام ساختار گرامری مؤدبانه‌ترین شیوه برای سفارش غذا در زبان انگلیسی است؟",
        promptEn: "Which sentence uses the most polite grammatical structure for ordering food?",
        explanationFa: "ساختار 'I'd like...' (مخفف I would like) یا 'Could I have...' استانداردترین و محترمانه‌ترین ساختار برای سفارش در رستوران است.",
        options: [
          { id: 1, textEn: "I want the tuna immediately.", textFa: "من همین حالا تن ماهی را می‌خواهم." },
          { id: 2, textEn: "Give me the mushroom risotto right now.", textFa: "همین الان ریزوتو قارچ را به من بده." },
          { id: 3, textEn: "I'd like the grilled tuna, please.", textFa: "من تن ماهی کبابی می‌خواهم، لطفاً." },
          { id: 4, textEn: "I will take it if it is cheap.", textFa: "اگر ارزان باشد آن را برمی‌دارم." },
        ],
        correctOptionId: 3,
      },
      speaking: {
        skill: "speaking",
        promptFa: "جمله کلیدی زیر را گوش دهید و با لحن محترمانه انگلیسی تکرار کنید (Shadowing):",
        promptEn: "Listen and record your voice repeating this polite request:",
        targetPhraseEn: "Could we have the bill, please?",
        targetPhraseFa: "می‌توانیم صورت‌حساب را داشته باشیم، لطفاً؟",
        phoneticGuide: "/kəd wiː hæv ðə bɪl pliːz/",
        timestampSeconds: 92,
        timestampDisplay: "01:32",
        speakingTipsFa: "روی کلمات 'bill' و 'please' تکیه و استرس صوتی داشته باشید و لحن انتهای جمله ملایم رو به بالا باشد.",
        explanationFa: "عبارت 'Could we have...' لحنی طبیعی و بسیار مؤدبانه در مراودات بین‌المللی ایجاد می‌کند.",
      },
      reading: {
        skill: "reading",
        promptFa: "بر اساس دیالوگ زیرنویس جنی: 'No starters for us, thank you'، چه نتیجه‌ای برداشت می‌شود؟",
        promptEn: "Based on Jenny's line: 'No starters for us, thank you', what is correct?",
        explanationFa: "کلمه 'starters' به معنای پیش‌غذا است. جنی اعلام می‌کند که آن‌ها پیش‌غذا سفارش نمی‌دهند و مستقیماً غذای اصلی را میل می‌کنند.",
        options: [
          { id: 1, textEn: "They do not want any appetizers before the main course.", textFa: "آن‌ها هیچ پیش‌غذایی قبل از غذای اصلی میل ندارند." },
          { id: 2, textEn: "They are leaving the restaurant immediately without eating.", textFa: "آن‌ها بدون غذا خوردن بلافاصله رستوران را ترک می‌کنند." },
          { id: 3, textEn: "They want the dessert menu first.", textFa: "آن‌ها ابتدا منوی دسر را می‌خواهند." },
          { id: 4, textEn: "The waiter refused to serve them dinner.", textFa: "پیشخدمت از آوردن شام برای آن‌ها امتناع کرد." },
        ],
        correctOptionId: 1,
      },
      writing: {
        skill: "writing",
        promptFa: "تصور کنید در این رستوران هستید؛ با استفاده از ساختار 'I'd like...' یک سفارش کامل (غذای اصلی + نوشیدنی) در ۱ الی ۲ جمله بنویسید.",
        promptEn: "Imagine you are at this restaurant. Write 1 or 2 polite sentences ordering a main dish and a drink using 'I'd like...'.",
        minWords: 8,
        sampleAnswerEn: "Good evening. I'd like the chicken pasta with garlic bread, and could I have an orange juice, please?",
        sampleAnswerFa: "عصر بخیر. من پاستای مرغ با نان سیر می‌خواهم، و می‌توانم یک آب‌پرتقال داشته باشم، لطفاً؟",
        keywordsToUse: ["I'd like", "please", "water / juice / pasta"],
        evaluationTipsFa: "رعایت املای کلمات، استفاده از 'please' و ساختار صحیح 'I'd like' ملاک کسب نمره کامل است.",
        explanationFa: "نوشتن سفارش محترمانه مهارت نوشتاری کاربردی شما را برای سفرهای خارجی تقویت می‌کند.",
      },
    },
  },

  // ==========================================
  // American English File - Lesson 2 (AEF-02)
  // ==========================================
  {
    id: "aef-02-in-the-street",
    series: "american_english_file",
    seriesTitleFa: "American English File",
    seriesTitleEn: "American English File",
    targetAudienceFa: "بزرگسالان و جوانان",
    titleFa: "مصاحبه خیابانی: اهل کجایی و شغلت چیه؟",
    titleEn: "In the Street: Where Are You From and What Do You Do?",
    bookLevel: "Book 1 (سطح مبتدی تا پیش‌متوسط)",
    unit: "Unit 2 · Practical Video",
    cefr: "A1",
    duration: "3:40",
    durationSec: 220,
    posterGradient: "linear-gradient(135deg, #0284c7, #4f46e5)",
    posterIcon: "🏙️",
    summaryFa: "مصاحبه واقعی در خیابان‌های نیویورک و لندن با افراد گوناگون درباره ملیت، شهر زادگاه، شغل‌های مختلف و ساعات کاری روزانه.",
    summaryEn: "Authentic street interviews in New York and London. People share their home countries, cities, various occupations, and daily routines.",
    keyTopicsFa: ["ملیت‌ها و کشورها", "معرفی شغل و حرفه", "افعال زمان حال ساده", "پاسخ به مصاحبه‌های کوتاه"],
    transcript: [
      {
        id: 1,
        seconds: 8,
        timeDisplay: "00:08",
        speaker: "Interviewer",
        textEn: "Hi! Where are you from?",
        textFa: "سلام! اهل کجا هستید؟",
      },
      {
        id: 2,
        seconds: 16,
        timeDisplay: "00:16",
        speaker: "Elena",
        textEn: "I'm from Madrid in Spain, but I live and work in London now.",
        textFa: "من اهل مادرید در اسپانیا هستم، اما اکنون در لندن زندگی و کار می‌کنم.",
      },
      {
        id: 3,
        seconds: 32,
        timeDisplay: "00:32",
        speaker: "Interviewer",
        textEn: "What do you do?",
        textFa: "شغلت چیه؟",
      },
      {
        id: 4,
        seconds: 42,
        timeDisplay: "00:42",
        speaker: "Elena",
        textEn: "I'm a graphic designer for a technology startup.",
        textFa: "من طراح گرافیک در یک استارتاپ فناوری هستم.",
      },
      {
        id: 5,
        seconds: 65,
        timeDisplay: "01:05",
        speaker: "Interviewer",
        textEn: "Do you enjoy your job?",
        textFa: "آیا از شغلت لذت می‌بری؟",
      },
      {
        id: 6,
        seconds: 78,
        timeDisplay: "01:18",
        speaker: "Elena",
        textEn: "Yes, I love it! The team is creative and very friendly.",
        textFa: "بله، عاشقشم! تیم بسیار خلاق و صمیمی است.",
      },
    ],
    questions: {
      listening: {
        skill: "listening",
        promptFa: "طبق مصاحبه، النا اصالتاً اهل کجاست و در حال حاضر کجا زندگی می‌کند؟",
        promptEn: "According to Elena, where is she originally from and where does she currently live?",
        timestampSeconds: 16,
        timestampDisplay: "00:16",
        explanationFa: "النا می‌گوید: 'I'm from Madrid in Spain, but I live and work in London now.'",
        options: [
          { id: 1, textEn: "From Barcelona, lives in Paris", textFa: "اهل بارسلونا، ساکن پاریس" },
          { id: 2, textEn: "From Madrid, lives in London", textFa: "اهل مادرید، ساکن لندن" },
          { id: 3, textEn: "From New York, lives in Madrid", textFa: "اهل نیویورک، ساکن مادرید" },
          { id: 4, textEn: "From London, lives in Rome", textFa: "اهل لندن، ساکن رم" },
        ],
        correctOptionId: 2,
      },
      vocabulary: {
        skill: "vocabulary",
        promptFa: "در مصاحبه انگلیسی، پرسش 'What do you do?' دقیقاً به چه معناست؟",
        promptEn: "What does the question 'What do you do?' mean?",
        targetTerm: "What do you do?",
        explanationFa: "عبارت 'What do you do?' به شغل و حرفه فرد اشاره دارد (شغل شما چیست؟).",
        options: [
          { id: 1, textEn: "What is your job / occupation?", textFa: "شغل و پیشه شما چیست؟" },
          { id: 2, textEn: "What are you doing right at this moment?", textFa: "هم‌اکنون دقیقا چه کاری انجام می‌دهی؟" },
          { id: 3, textEn: "What sports do you play on weekends?", textFa: "آخر هفته‌ها چه ورزشی می‌کنی؟" },
          { id: 4, textEn: "What did you buy yesterday?", textFa: "دیروز چه چیزی خریدی؟" },
        ],
        correctOptionId: 1,
      },
      grammar: {
        skill: "grammar",
        promptFa: "قبل از عناوین شغلی در زبان انگلیسی (مانند graphic designer)، کدام حرف تعریف استفاده می‌شود؟",
        promptEn: "Which article correctly precedes the singular profession 'graphic designer'?",
        explanationFa: "قبل از مشاغل مفرد که با صامت شروع می‌شوند از 'a' و اگر با مصوت شروع شوند از 'an' استفاده می‌کنیم (مثال: a graphic designer, an architect).",
        options: [
          { id: 1, textEn: "I'm a graphic designer.", textFa: "I'm a graphic designer." },
          { id: 2, textEn: "I'm an graphic designer.", textFa: "I'm an graphic designer." },
          { id: 3, textEn: "I'm the graphic designer in general.", textFa: "I'm the graphic designer in general." },
          { id: 4, textEn: "I'm graphic designer without articles.", textFa: "I'm graphic designer without articles." },
        ],
        correctOptionId: 1,
      },
      speaking: {
        skill: "speaking",
        promptFa: "جمله معرفی شغل را با تلفظ روان بگویید و صدای خود را ضبط نمایید:",
        promptEn: "Record your voice saying this introduction sentence clearly:",
        targetPhraseEn: "I live in Tehran and I'm a student.",
        targetPhraseFa: "من در تهران زندگی می‌کنم و یک دانش‌آموز/دانشجو هستم.",
        phoneticGuide: "/aɪ lɪv ɪn tehrɑːn ænd aɪm ə stjuːdənt/",
        timestampSeconds: 16,
        timestampDisplay: "00:16",
        speakingTipsFa: "کلمه 'live' با مصوت کوتاه /ɪ/ تلفظ می‌شود؛ آن را با 'leave' اشتباه نکنید.",
        explanationFa: "معرفی کوتاه محل زندگی و شغل از اساسی‌ترین مهارت‌های مکالمه است.",
      },
      reading: {
        skill: "reading",
        promptFa: "چرا النا شغل خود را دوست دارد؟ بر اساس گفته او در متن دیالوگ:",
        promptEn: "Why does Elena enjoy her job, according to her own words?",
        explanationFa: "النا در پاسخ می‌گوید: 'The team is creative and very friendly.' (تیم خلاق و صمیمی است).",
        options: [
          { id: 1, textEn: "Because the salary is extremely high.", textFa: "چون حقوق آن بی‌نهایت زیاد است." },
          { id: 2, textEn: "Because the team is creative and friendly.", textFa: "چون اعضای تیم خلاق و بسیار صمیمی هستند." },
          { id: 3, textEn: "Because she works only on Mondays.", textFa: "چون فقط دوشنبه‌ها کار می‌کند." },
          { id: 4, textEn: "Because the office is close to her house in Spain.", textFa: "چون دفتر کار نزدیک خانه‌اش در اسپانیا است." },
        ],
        correctOptionId: 2,
      },
      writing: {
        skill: "writing",
        promptFa: "خود را در ۲ جمله معرفی کنید: شهر زادگاه، محل فعلی سکونت و شغلتان را بنویسید.",
        promptEn: "Write 2 sentences introducing yourself: mention your home city, where you live now, and your occupation.",
        minWords: 10,
        sampleAnswerEn: "I'm from Isfahan, but I currently live in Tehran. I work as an English teacher and I enjoy my job.",
        sampleAnswerFa: "من اهل اصفهان هستم، اما در حال حاضر در تهران زندگی می‌کنم. من به عنوان دبیر زبان انگلیسی کار می‌کنم و از کارم لذت می‌برم.",
        keywordsToUse: ["from", "live in", "work as / student"],
        evaluationTipsFa: "استفاده صحیح از حروف بزرگ اول اسامی خاص (شهرهای ایران) و ساختار حال ساده مورد ارزیابی قرار می‌گیرد.",
        explanationFa: "این تمرین نگارش کوتاه، مهارت نوشتن پروفایل شخصی در شبکه‌های حرفه‌ای را تقویت می‌کند.",
      },
    },
  },

  // ==========================================
  // Family and Friends - Lesson 1 (FF-01)
  // ==========================================
  {
    id: "faf-01-hello",
    series: "family_and_friends",
    seriesTitleFa: "Family and Friends",
    seriesTitleEn: "Family and Friends",
    targetAudienceFa: "کودکان و نوجوانان",
    titleFa: "خانواده و احوال‌پرسی: داستان روزی، تیم و بیلی",
    titleEn: "Hello, Rosy! Meeting the Family and Friends",
    bookLevel: "Starter & Level 1 (سطح پایه کودکان)",
    unit: "Starter Unit · Hello!",
    cefr: "A1",
    duration: "2:50",
    durationSec: 170,
    posterGradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
    posterIcon: "🎒",
    summaryFa: "انیمیشن شاد و جذاب داستان درس اول Family and Friends. شخصیت‌های دوست‌داشتنی روزی، تیم و برادر کوچک‌شان بیلی، معرفی اعضای خانواده و وسایل مدرسه را آموزش می‌دهند.",
    summaryEn: "An engaging animated story from Family and Friends Unit 1. Friendly characters Rosy, Tim, and little Billy teach greetings, family members, and school items.",
    keyTopicsFa: ["سلام و احوال‌پرسی کودکان", "اعضای خانواده", "نام‌گذاری رنگ‌ها و اشیا", "افعال ساده حرکتی"],
    transcript: [
      {
        id: 1,
        seconds: 6,
        timeDisplay: "00:06",
        speaker: "Rosy",
        textEn: "Hello! My name is Rosy. This is my cousin, Tim.",
        textFa: "سلام! نام من روزی است. این پسرعمه من، تیم است.",
      },
      {
        id: 2,
        seconds: 18,
        timeDisplay: "00:18",
        speaker: "Tim",
        textEn: "Hello, everyone! And look, this is my little brother, Billy.",
        textFa: "سلام به همگی! و ببینید، این برادر کوچک من، بیلی است.",
      },
      {
        id: 3,
        seconds: 32,
        timeDisplay: "00:32",
        speaker: "Billy",
        textEn: "Two! I am two years old!",
        textFa: "دو! من دو سال دارم!",
      },
      {
        id: 4,
        seconds: 52,
        timeDisplay: "00:52",
        speaker: "Rosy",
        textEn: "Billy, look! This is your blue bag and this is your yellow teddy bear.",
        textFa: "بیلی، ببین! این کیف آبی تو است و این خرس عروسکی زرد تو است.",
      },
      {
        id: 5,
        seconds: 70,
        timeDisplay: "01:10",
        speaker: "Billy",
        textEn: "Teddy bear! Thank you, Rosy!",
        textFa: "خرس عروسکی! متشکرم روزی!",
      },
    ],
    questions: {
      listening: {
        skill: "listening",
        promptFa: "در انیمیشن، بیلی چند سال دارد؟ (با دقت به گفتار بیلی در ثانیه 00:32 گوش دهید)",
        promptEn: "In the video story, how old is little Billy?",
        timestampSeconds: 32,
        timestampDisplay: "00:32",
        explanationFa: "بیلی با شادی می‌گوید: 'Two! I am two years old!'.",
        options: [
          { id: 1, textEn: "He is two years old.", textFa: "او دو سال دارد." },
          { id: 2, textEn: "He is five years old.", textFa: "او پنج سال دارد." },
          { id: 3, textEn: "He is seven years old.", textFa: "او هفت سال دارد." },
          { id: 4, textEn: "He is ten years old.", textFa: "او ده سال دارد." },
        ],
        correctOptionId: 1,
      },
      vocabulary: {
        skill: "vocabulary",
        promptFa: "رنگ خرس عروسکی بیلی (teddy bear) در ویدیو چه رنگی است؟",
        promptEn: "What color is Billy's teddy bear in the story?",
        targetTerm: "yellow teddy bear",
        explanationFa: "روزی می‌گوید: 'this is your yellow teddy bear' (خرس عروسکی زرد).",
        options: [
          { id: 1, textEn: "Yellow", textFa: "زرد (Yellow)" },
          { id: 2, textEn: "Blue", textFa: "آبی (Blue)" },
          { id: 3, textEn: "Green", textFa: "سبز (Green)" },
          { id: 4, textEn: "Red", textFa: "قرمز (Red)" },
        ],
        correctOptionId: 1,
      },
      grammar: {
        skill: "grammar",
        promptFa: "برای اشاره به یک شیء نزدیک (مانند کیف در دست روزی)، کدام کلمه اشاره درست است؟",
        promptEn: "Which demonstrative pronoun is used for a single object close to you?",
        explanationFa: "برای اشاره به یک شیء مفرد نزدیک از 'This is' استفاده می‌کنیم: 'This is your blue bag'.",
        options: [
          { id: 1, textEn: "This is a blue bag.", textFa: "This is a blue bag." },
          { id: 2, textEn: "These are a blue bag.", textFa: "These are a blue bag." },
          { id: 3, textEn: "Those is a blue bag.", textFa: "Those is a blue bag." },
          { id: 4, textEn: "They is a blue bag.", textFa: "They is a blue bag." },
        ],
        correctOptionId: 1,
      },
      speaking: {
        skill: "speaking",
        promptFa: "جمله معرفی کودکانه را شاد و رسا تکرار کرده و صدایتان را ضبط کنید:",
        promptEn: "Record your voice saying this friendly greeting cheerfully:",
        targetPhraseEn: "Hello! My name is Billy.",
        targetPhraseFa: "سلام! اسم من بیلی است.",
        phoneticGuide: "/həˈloʊ maɪ neɪm ɪz ˈbɪli/",
        timestampSeconds: 6,
        timestampDisplay: "00:06",
        speakingTipsFa: "با لبخند و لحن پرانرژی صحبت کنید تا اعتمادبه‌نفس گفتاری تقویت شود.",
        explanationFa: "جملات احوال‌پرسی اولین گام برای مکالمه بدون استرس کودکان است.",
      },
      reading: {
        skill: "reading",
        promptFa: "تیم، روزی را با چه نسبتی معرفی می‌کند؟ ('This is my cousin, Tim')",
        promptEn: "What family relationship does Rosy share with Tim?",
        explanationFa: "کلمه 'cousin' به معنی پسرعمو، دخترعمو، پسردایی یا دخترخاله است.",
        options: [
          { id: 1, textEn: "They are cousins.", textFa: "آن‌ها با هم عموزاده/خاله‌زاده (cousins) هستند." },
          { id: 2, textEn: "Tim is her grandfather.", textFa: "تیم پدربزرگ او است." },
          { id: 3, textEn: "They are school teachers.", textFa: "آن‌ها معلمان مدرسه هستند." },
          { id: 4, textEn: "Rosy is Tim's mother.", textFa: "روزی مادر تیم است." },
        ],
        correctOptionId: 1,
      },
      writing: {
        skill: "writing",
        promptFa: "یک جمله کوتاه به زبان انگلیسی بنویسید و خودتان را با فرمت 'Hello! My name is [نام شما].' معرفی کنید.",
        promptEn: "Write 1 simple sentence introducing yourself: 'Hello! My name is [Your Name].'",
        minWords: 5,
        sampleAnswerEn: "Hello! My name is Ali and I am happy.",
        sampleAnswerFa: "سلام! اسم من علی است و من خوشحالم.",
        keywordsToUse: ["Hello", "name is"],
        evaluationTipsFa: "رعایت بزرگ نوشتن حرف اول نام خود و شروع جمله با حرف بزرگ انگلیسی.",
        explanationFa: "این تمرین دست‌گرمی عالی برای یادگیری حروف‌چینی انگلیسی است.",
      },
    },
  },

  // ==========================================
  // Family and Friends - Lesson 2 (FF-02)
  // ==========================================
  {
    id: "faf-02-grandma",
    series: "family_and_friends",
    seriesTitleFa: "Family and Friends",
    seriesTitleEn: "Family and Friends",
    targetAudienceFa: "کودکان و نوجوانان",
    titleFa: "مادربزرگ کجاست؟ در اتاق نشیمن!",
    titleEn: "Where's Grandma? Rooms of the House",
    bookLevel: "Level 1 (سطح مبتدی کودکان)",
    unit: "Unit 8 · Where's Grandma?",
    cefr: "A1",
    duration: "3:10",
    durationSec: 190,
    posterGradient: "linear-gradient(135deg, #10b981, #06b6d4)",
    posterIcon: "🏡",
    summaryFa: "انیمیشن ماجرای جذاب پیدا کردن اعضای خانواده در بخش‌های مختلف خانه: اتاق خواب، آشپزخانه، اتاق نشیمن و حیاط خانه با ریتم شاد و کلمات تصویری.",
    summaryEn: "A fun animated story searching for family members across the house: bedroom, kitchen, living room, and garden with cheerful dialogues.",
    keyTopicsFa: ["بخش‌های خانه (اتاق‌ها)", "پرسش Where is...?", "حروف اضافه مکان (in, on)", "اعضای خانواده"],
    transcript: [
      {
        id: 1,
        seconds: 8,
        timeDisplay: "00:08",
        speaker: "Tim",
        textEn: "Where's Grandma? Is she in the kitchen?",
        textFa: "مادربزرگ کجاست؟ آیا او در آشپزخانه است؟",
      },
      {
        id: 2,
        seconds: 20,
        timeDisplay: "00:20",
        speaker: "Rosy",
        textEn: "No, she isn't. Look, she's in the dining room with Grandpa!",
        textFa: "نه، او آنجا نیست. نگاه کن، او در اتاق غذاخوری همراه با پدربزرگ است!",
      },
      {
        id: 3,
        seconds: 40,
        timeDisplay: "00:40",
        speaker: "Tim",
        textEn: "Are Mum and Dad in the garden?",
        textFa: "آیا مامان و بابا در حیاط هستند؟",
      },
      {
        id: 4,
        seconds: 58,
        timeDisplay: "00:58",
        speaker: "Rosy",
        textEn: "Yes, they are! They are having tea together.",
        textFa: "بله، هستند! آن‌ها با هم چای می‌نوشند.",
      },
    ],
    questions: {
      listening: {
        skill: "listening",
        promptFa: "بر اساس ویدیوی انیمیشن در ثانیه 00:20، مادربزرگ در کدام اتاق است؟",
        promptEn: "According to the story at 00:20, where is Grandma?",
        timestampSeconds: 20,
        timestampDisplay: "00:20",
        explanationFa: "روزی پاسخ می‌دهد: 'she's in the dining room with Grandpa!' (در اتاق غذاخوری با پدربزرگ).",
        options: [
          { id: 1, textEn: "In the bedroom", textFa: "در اتاق خواب" },
          { id: 2, textEn: "In the kitchen", textFa: "در آشپزخانه" },
          { id: 3, textEn: "In the dining room", textFa: "در اتاق غذاخوری" },
          { id: 4, textEn: "In the garage", textFa: "در پارکینگ" },
        ],
        correctOptionId: 3,
      },
      vocabulary: {
        skill: "vocabulary",
        promptFa: "کلمه 'dining room' به کدام بخش از خانه اشاره دارد؟",
        promptEn: "What room does 'dining room' refer to?",
        targetTerm: "dining room",
        explanationFa: "'dining room' اتاقی است که میز و صندلی غذاخوری در آن قرار دارد.",
        options: [
          { id: 1, textEn: "The room where people eat meals", textFa: "اتاق صرف غذا و غذاخوری" },
          { id: 2, textEn: "The room where cars park", textFa: "جایی که اتومبیل پارک می‌شود" },
          { id: 3, textEn: "The place where people sleep", textFa: "اتاق خواب و استراحت" },
          { id: 4, textEn: "The shower room", textFa: "حمام و دستشویی" },
        ],
        correctOptionId: 1,
      },
      grammar: {
        skill: "grammar",
        promptFa: "پاسخ کوتاه منفی به سوال 'Is she in the kitchen?' کدام گزینه است؟",
        promptEn: "What is the correct short negative answer to 'Is she in the kitchen?'?",
        explanationFa: "برای ضمیر 'she'، پاسخ منفی کوتاه با فعل to be به صورت 'No, she isn't' است.",
        options: [
          { id: 1, textEn: "No, she isn't.", textFa: "No, she isn't." },
          { id: 2, textEn: "No, she don't.", textFa: "No, she don't." },
          { id: 3, textEn: "No, she aren't.", textFa: "No, she aren't." },
          { id: 4, textEn: "No, she not.", textFa: "No, she not." },
        ],
        correctOptionId: 1,
      },
      speaking: {
        skill: "speaking",
        promptFa: "جمله پرسشی جست‌وجوی مکان را با تلفظ کودکانه تکرار کنید:",
        promptEn: "Record your voice asking this question clearly:",
        targetPhraseEn: "Where is Grandma? Is she in the garden?",
        targetPhraseFa: "مادربزرگ کجاست؟ آیا در حیاط است؟",
        phoneticGuide: "/weər ɪz ˈɡrændmɑː ɪz ʃiː ɪn ðə ˈɡɑːrdn/",
        timestampSeconds: 8,
        timestampDisplay: "00:08",
        speakingTipsFa: "در انتهای کلمه 'garden' صدای /n/ را نرم و طبیعی ادا کنید.",
        explanationFa: "تمرین این الگو به کودکان در پرسیدن مکان اشخاص و اشیا کمک شایانی می‌کند.",
      },
      reading: {
        skill: "reading",
        promptFa: "مامان و بابا در حیاط مشغول انجام چه کاری هستند؟ ('They are having tea together')",
        promptEn: "What are Mum and Dad doing in the garden?",
        explanationFa: "در دیالوگ ذکر شده: 'They are having tea together' (با هم چای می‌نوشند).",
        options: [
          { id: 1, textEn: "They are drinking tea together.", textFa: "آن‌ها با یکدیگر چای می‌نوشند." },
          { id: 2, textEn: "They are washing the car.", textFa: "آن‌ها در حال شستن ماشین هستند." },
          { id: 3, textEn: "They are playing football.", textFa: "آن‌ها فوتبال بازی می‌کنند." },
          { id: 4, textEn: "They are cooking dinner.", textFa: "آن‌ها شام می‌پزند." },
        ],
        correctOptionId: 1,
      },
      writing: {
        skill: "writing",
        promptFa: "یک جمله بنویسید و بگویید در کدام اتاق از خانه هستید (مثال: 'I am in the living room.').",
        promptEn: "Write 1 simple sentence describing which room of your home you are currently in.",
        minWords: 6,
        sampleAnswerEn: "I am in my bedroom studying English.",
        sampleAnswerFa: "من در اتاق خوابم هستم و انگلیسی می‌خوانم.",
        keywordsToUse: ["I am in", "room / bedroom / kitchen"],
        evaluationTipsFa: "استفاده از حرف اضافه 'in' برای اتاق‌ها و رعایت نقطه در پایان جمله.",
        explanationFa: "توصیف موقعیت مکانی از مهارت‌های اولیه و ضروری زبان‌آموزان است.",
      },
    },
  },
];

export function getLessonById(id: string): VideoLesson | undefined {
  return VIDEO_LESSONS.find((lesson) => lesson.id === id);
}

export function getLessonsBySeries(series: VideoSeries | "all"): VideoLesson[] {
  if (series === "all") return VIDEO_LESSONS;
  return VIDEO_LESSONS.filter((lesson) => lesson.series === series);
}

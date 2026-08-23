import type { Metadata } from "next";

export type PublicLocale = "fa" | "en";

export const BRAND_MOTTO = "A new door to your English";

export const PUBLIC_BASE_URL = (
  process.env.ENDOORA_PUBLIC_URL ?? "https://endoora.ir"
).replace(/\/$/, "");

export const LAUNCH_PLAN = {
  name: "Premium",
  durationDays: 90,
  displayPriceFa: "۴۲۰٬۰۰۰ تومان",
  displayPriceEn: "420,000 toman",
  noteFa: "قیمت فعلیِ برنامه عرضه است و در روز ۴۱ به منبع داده مدیریتی منتقل می‌شود.",
  noteEn: "This is the current launch-plan display price; Day 41 moves it to admin-managed plan data.",
} as const;

export type PublicPageKey =
  | "how-it-works"
  | "placement"
  | "teachers"
  | "classes"
  | "learn"
  | "skills"
  | "ielts"
  | "culture"
  | "resources"
  | "pricing"
  | "help"
  | "about"
  | "contact"
  | "status";

export type FeatureKey =
  | "learner-twin"
  | "daily-mission"
  | "mistake-genome"
  | "writing-mentor"
  | "roleplay-voice"
  | "teachers-classes"
  | "ielts-practice"
  | "premium";

export type LegalKey =
  | "privacy"
  | "terms"
  | "accessibility"
  | "refund"
  | "ai-limitations"
  | "copyright";

type CopyBlock = {
  eyebrow: string;
  title: string;
  summary: string;
  sections: Array<{ title: string; body: string }>;
};

type Localized<T> = Record<PublicLocale, T>;

export const homeCopy: Localized<{
  heroTitle: string;
  heroSummary: string;
  placementCta: string;
  startCta: string;
  trustTitle: string;
  trustBody: string;
  loopTitle: string;
  loopSteps: string[];
  featureTitle: string;
  waitlistTitle: string;
  waitlistBody: string;
}> = {
  fa: {
    heroTitle: "مسیر یادگیری انگلیسی، متصل و شخصی‌سازی‌شده",
    heroSummary:
      "Endoora برای زبان‌آموز ایرانی طراحی می‌شود: تعیین سطح، برنامه شخصی، تمرین روزانه، تحلیل اشتباه‌ها، ارتباط با مدرس و سنجش پیشرفت در یک مسیر واحد.",
    placementCta: "آشنایی با تعیین سطح",
    startCta: "شروع مسیر یادگیری",
    trustTitle: "اعتماد قبل از هیجان",
    trustBody:
      "Endoora نتیجه یا نمره رسمی IELTS/CEFR را تضمین نمی‌کند. قابلیت‌های هوش مصنوعی با محدودیت‌های روشن، شواهد قابل بررسی و امکان بازخورد انسانی ارائه می‌شوند.",
    loopTitle: "چرخه اصلی Endoora",
    loopSteps: [
      "ارزیابی",
      "ساخت Learner Twin",
      "برنامه‌ریزی",
      "تمرین",
      "تشخیص اشتباه",
      "سازگاری",
      "اتصال به مدرس",
      "اندازه‌گیری پیشرفت",
    ],
    featureTitle: "قابلیت‌های اصلی که به همین چرخه وصل می‌شوند",
    waitlistTitle: "برای شروع نسخه اولیه خبرم کن",
    waitlistBody:
      "ایمیل شما فقط برای اطلاع‌رسانی پیش‌راه‌اندازی Endoora استفاده می‌شود. هیچ ابزار تحلیل اختیاری قبل از رضایت شما فعال نیست.",
  },
  en: {
    heroTitle: "A connected, personalized path to better English",
    heroSummary:
      "Endoora is being built for Iranian English learners: placement, a personal plan, daily practice, mistake evidence, qualified teachers, and progress measurement in one connected loop.",
    placementCta: "Explore placement",
    startCta: "Start the learning path",
    trustTitle: "Trust before hype",
    trustBody:
      "Endoora does not guarantee official IELTS or CEFR outcomes. AI features are presented with explicit limitations, inspectable evidence, and human-review foundations where appropriate.",
    loopTitle: "The Endoora learning loop",
    loopSteps: [
      "Assess",
      "Build Learner Twin",
      "Plan",
      "Practise",
      "Detect mistakes",
      "Adapt",
      "Connect to teacher",
      "Measure progress",
    ],
    featureTitle: "Core features connected to the same loop",
    waitlistTitle: "Tell me when early access opens",
    waitlistBody:
      "Your email is used only for Endoora prelaunch updates. No optional third-party analytics are activated before consent.",
  },
};

export const publicPages: Record<PublicPageKey, Localized<CopyBlock>> = {
  "how-it-works": {
    fa: {
      eyebrow: "چطور کار می‌کند",
      title: "از ارزیابی تا اقدام بعدی، بدون صفحه‌های جدا از هم",
      summary: "Endoora قرار است داده یادگیری را بین ارزیابی، تمرین، مدرس و پیشرفت به شکل توضیح‌پذیر منتقل کند.",
      sections: [
        { title: "۱. ارزیابی", body: "تعیین سطح چندبخشی شواهد اولیه را می‌سازد؛ نه یک برچسب دائمی." },
        { title: "۲. برنامه و تمرین", body: "برنامه شخصی و Daily Mission از هدف، زمان در دسترس و شواهد یادگیری استفاده می‌کنند." },
        { title: "۳. بازخورد و سازگاری", body: "Mistake Genome و Learner Twin فقط از شواهد معتبر و قابل اصلاح تغذیه می‌شوند." },
        { title: "۴. مدرس و پیشرفت", body: "مدرسِ مجاز شواهد آموزشی مرتبط را می‌بیند و پیشرفت از فعالیت واقعی ثبت می‌شود." },
      ],
    },
    en: {
      eyebrow: "How it works",
      title: "From assessment to the next useful action",
      summary: "Endoora is designed to move learning evidence across assessment, practice, teachers, and progress instead of creating disconnected feature pages.",
      sections: [
        { title: "1. Assess", body: "A multi-stage placement flow creates initial evidence, not a permanent label." },
        { title: "2. Plan and practise", body: "The personal path and Daily Mission use goals, available time, and learning evidence." },
        { title: "3. Feedback and adaptation", body: "Mistake Genome and Learner Twin are fed only by validated, correctable evidence." },
        { title: "4. Teacher and progress", body: "Authorized teachers see relevant learning evidence and progress reflects real activity." },
      ],
    },
  },
  placement: {
    fa: {
      eyebrow: "تعیین سطح",
      title: "برآورد شفاف سطح، نه ادعای مدرک رسمی",
      summary: "هسته تعیین سطح در روزهای ۱۴ تا ۱۷ ساخته می‌شود و نتیجه آن با شواهد، پوشش مهارت‌ها و میزان اطمینان نمایش داده خواهد شد.",
      sections: [
        { title: "مهارت‌های چندگانه", body: "گرامر، واژگان، خواندن، شنیدن و تعامل متنی بررسی می‌شوند؛ صدا اختیاری خواهد بود." },
        { title: "قابل ادامه", body: "پاسخ‌ها ذخیره می‌شوند تا قطع اینترنت یا تازه‌سازی صفحه باعث از دست رفتن مسیر نشود." },
        { title: "گزارش توضیح‌پذیر", body: "قدرت‌ها، ضعف‌ها، تعداد شواهد و محدودیت‌های برآورد کنار نتیجه نشان داده می‌شوند." },
      ],
    },
    en: {
      eyebrow: "Placement",
      title: "A transparent level estimate, not an official certificate",
      summary: "The placement engine is scheduled for Days 14–17 and will report evidence, skill coverage, and uncertainty alongside the estimate.",
      sections: [
        { title: "Multiple skills", body: "Grammar, vocabulary, reading, listening, and text interaction are covered; voice evidence remains optional." },
        { title: "Resumable", body: "Answers are saved so refreshes and weak connections do not destroy progress." },
        { title: "Explainable report", body: "Strengths, weaknesses, evidence counts, and limitations appear next to the result." },
      ],
    },
  },
  teachers: {
    fa: {
      eyebrow: "مدرس‌ها",
      title: "انتخاب مدرس با اطلاعات قابل اعتماد",
      summary: "پروفایل و فرایند تأیید مدرس در فاز Marketplace ساخته می‌شود؛ اطلاعات هویتی خصوصی باقی می‌ماند.",
      sections: [
        { title: "پروفایل بررسی‌شده", body: "تخصص، تجربه، زبان‌ها، محدوده خدمت و وضعیت تأیید به شکل قابل فهم نمایش داده می‌شود." },
        { title: "حریم خصوصی", body: "مدارک تأیید عمومی نمی‌شوند و مدرس فقط به شواهد آموزشی مجاز دسترسی خواهد داشت." },
        { title: "نظر معتبر", body: "بازخورد فقط پس از تعامل واجد شرایط ثبت می‌شود تا خودامتیازدهی و نظر جعلی محدود شود." },
      ],
    },
    en: {
      eyebrow: "Teachers",
      title: "Choose a teacher using relevant trust signals",
      summary: "Teacher profiles and verification are built later in the marketplace phase; identity documents remain private.",
      sections: [
        { title: "Reviewed profile", body: "Specialties, experience, languages, service area, and verification status are shown clearly." },
        { title: "Privacy", body: "Verification documents are not public and teachers only receive authorized learning evidence." },
        { title: "Eligible reviews", body: "Reviews require an eligible completed interaction to reduce fake or self-authored ratings." },
      ],
    },
  },
  classes: {
    fa: {
      eyebrow: "کلاس‌ها",
      title: "کلاس‌های کوچک با ظرفیت و وضعیت روشن",
      summary: "کلاس ثابت، درخواست مهمان، ظرفیت، لیست انتظار و ثبت‌نام در روز ۴۰ به جریان واقعی تبدیل می‌شوند.",
      sections: [
        { title: "ظرفیت محدود", body: "کلاس‌ها برای ۱ تا ۶ زبان‌آموز، با برنامه، پیش‌نیاز و ظرفیت شفاف طراحی می‌شوند." },
        { title: "ثبت‌نام امن", body: "ظرفیت و وضعیت پرداخت/تأیید روی سرور کنترل می‌شوند، نه فقط در رابط کاربری." },
        { title: "قوانین روشن", body: "شرایط حضور، لغو، لیست انتظار و درخواست مهمان قبل از تأیید نمایش داده می‌شوند." },
      ],
    },
    en: {
      eyebrow: "Classes",
      title: "Small classes with explicit capacity and state",
      summary: "Fixed classes, guest requests, capacity, waitlists, and enrollment become transactional on Day 40.",
      sections: [
        { title: "Limited capacity", body: "Classes are designed for 1–6 learners with clear schedules, prerequisites, and capacity." },
        { title: "Safe enrollment", body: "Capacity and payment/approval state are enforced server-side, not only in the UI." },
        { title: "Clear rules", body: "Attendance, cancellation, waitlist, and guest-request rules are shown before confirmation." },
      ],
    },
  },
  learn: {
    fa: {
      eyebrow: "یادگیری",
      title: "محتوای اصلی و مجاز برای شش مهارت",
      summary: "درس‌ها، دوره‌ها و منابع باید اصل، دارای مجوز یا در مالکیت عمومی باشند و به هدف‌های آموزشی ثابت متصل شوند.",
      sections: [
        { title: "مسیر شخصی", body: "محتوا فقط فهرست نمی‌شود؛ بعداً به مسیر، مأموریت و شواهد پیشرفت متصل خواهد شد." },
        { title: "حقوق محتوا", body: "منبع، مالک حقوق و نوع مجوز برای دارایی‌های آموزشی ثبت می‌شود." },
        { title: "دسترسی", body: "متن فارسی RTL و محتوای آموزشی انگلیسی LTR جدا و خوانا باقی می‌مانند." },
      ],
    },
    en: {
      eyebrow: "Learn",
      title: "Original and licensed learning across six skills",
      summary: "Lessons, courses, and resources must be original, licensed, or public-domain and linked to stable learning objectives.",
      sections: [
        { title: "Personal path", body: "Content is not just catalogued; it later connects to paths, missions, and learning evidence." },
        { title: "Content rights", body: "Source, rights owner, and license type are recorded for educational assets." },
        { title: "Readable directions", body: "Persian RTL interface and English LTR learning content remain clearly isolated." },
      ],
    },
  },
  skills: {
    fa: { eyebrow: "مهارت‌ها", title: "شش مهارت، یک نقشه یادگیری", summary: "Listening، Speaking، Reading، Writing، Grammar و Vocabulary به هدف‌های CEFR و تمرین واقعی متصل می‌شوند.", sections: [
      { title: "هدف‌های پایدار", body: "شناسه‌های فنی مستقل از ترجمه هستند تا محتوا و گزارش‌ها با تغییر متن نشکنند." },
      { title: "تمرین متنوع", body: "تمرین‌ها می‌توانند چندگزینه‌ای، جای‌خالی، مرتب‌سازی، پاسخ کوتاه، نوشتن و نقش‌آفرینی باشند." },
      { title: "پیشرفت مبتنی بر شواهد", body: "نمودار یا امتیاز بدون داده واقعی نمایش داده نخواهد شد." },
    ]},
    en: { eyebrow: "Skills", title: "Six skills, one learning map", summary: "Listening, Speaking, Reading, Writing, Grammar, and Vocabulary connect to CEFR-informed objectives and real practice.", sections: [
      { title: "Stable objectives", body: "Machine identifiers remain independent from translations so content and reports stay linked." },
      { title: "Varied practice", body: "Exercises can include MCQ, gaps, ordering, short answers, writing, and roleplay." },
      { title: "Evidence-backed progress", body: "No decorative score or chart is shown without real evidence." },
    ]},
  },
  ielts: {
    fa: {
      eyebrow: "IELTS",
      title: "تمرین شبیه‌سازی‌شده با محتوای اصل و برآورد شفاف",
      summary: "Endoora محتوای کتاب‌های تجاری IELTS را کپی نمی‌کند و برآورد AI را نمره رسمی ممتحن معرفی نخواهد کرد.",
      sections: [
        { title: "Listening و Reading", body: "ساختار زمان‌دار و نمره‌دهی عینی در صورت امکان، با محتوای اصل یا مجاز." },
        { title: "Writing و Speaking", body: "بازخورد AI به شکل بازه، معیار و شواهد ارائه می‌شود و محدودیت‌ها کنار آن می‌آید." },
        { title: "تمرین هدفمند بعدی", body: "الگوهای تأییدشده به تمرین بعدی و Mistake Genome وصل می‌شوند." },
      ],
    },
    en: {
      eyebrow: "IELTS",
      title: "Original simulations with transparent AI estimates",
      summary: "Endoora will not copy commercial IELTS books and will never present AI estimates as official examiner scores.",
      sections: [
        { title: "Listening and Reading", body: "Timed simulation and objective scoring where possible, using original or licensed material." },
        { title: "Writing and Speaking", body: "AI feedback is shown as a range with criteria, evidence, and limitations." },
        { title: "Targeted follow-up", body: "Approved patterns connect to the next practice task and Mistake Genome." },
      ],
    },
  },
  culture: {
    fa: { eyebrow: "فرهنگ و وبلاگ", title: "محتوای فرهنگی برای یادگیری، نه پر کردن سایت", summary: "مقاله‌های فرهنگی باید به هدف آموزشی، منبع و وضعیت حقوق محتوا متصل باشند.", sections: [
      { title: "اصل یا مجاز", body: "محتوا از منابع تجاری بدون اجازه کپی نمی‌شود." },
      { title: "قابل جست‌وجو", body: "مقاله‌ها بعداً با سطح، موضوع و مهارت برچسب‌گذاری می‌شوند." },
      { title: "کاربرد آموزشی", body: "هر مطلب باید امکان تمرین یا اقدام بعدی معنادار داشته باشد." },
    ]},
    en: { eyebrow: "Culture & blog", title: "Cultural content that serves learning", summary: "Culture articles connect to learning goals, sources, and rights metadata instead of simply filling a blog.", sections: [
      { title: "Original or licensed", body: "Commercial material is not copied without permission." },
      { title: "Discoverable", body: "Articles later receive level, topic, and skill metadata." },
      { title: "Learning purpose", body: "Each article should lead to a meaningful practice or next action." },
    ]},
  },
  resources: {
    fa: { eyebrow: "منابع", title: "منابع آموزشی و طرح درس با حقوق روشن", summary: "منابع مدرس و زبان‌آموز با متادیتای مجوز، دسترسی و گزارش تخلف ساخته می‌شوند.", sections: [
      { title: "حقوق و مالکیت", body: "بارگذاری‌کننده باید وضعیت مالکیت یا مجوز را مشخص کند." },
      { title: "دسترسی‌پذیری", body: "فایل‌ها و رسانه‌ها باید متن جایگزین، کپشن یا ترنسکریپت لازم را داشته باشند." },
      { title: "بازبینی", body: "انتشار عمومی از مسیر بررسی محتوا عبور می‌کند." },
    ]},
    en: { eyebrow: "Resources", title: "Teaching resources with explicit rights", summary: "Teacher and learner resources are built with licensing metadata, accessibility fields, and reporting controls.", sections: [
      { title: "Rights", body: "Uploaders must identify ownership or permission status." },
      { title: "Accessibility", body: "Files and media require suitable alt text, captions, or transcripts." },
      { title: "Review", body: "Public publication goes through a content-review workflow." },
    ]},
  },
  pricing: {
    fa: { eyebrow: "قیمت", title: "Premium ساده و شفاف", summary: "برنامه عرضه Premium برای ۹۰ روز و دسترسی عادیِ نامحدود به قابلیت‌های AI طراحی شده است؛ محدودیت منصفانه ضدسوءاستفاده باقی می‌ماند.", sections: [
      { title: "یک منبع قیمت", body: "قیمت پرداخت و استحقاق در Day 41 به داده مدیریتی منتقل می‌شود تا در کامپوننت‌ها و پرداخت تکرار نشود." },
      { title: "مصرف منصفانه", body: "نامحدود به معنی استفاده آموزشی عادی است، نه خودکارسازی سوءاستفاده یا مصرف بی‌حد سرویس‌دهنده." },
      { title: "پرداخت امن", body: "فعال‌سازی دسترسی فقط بعد از تأیید سرور-به-سرور ZarinPal در فاز پرداخت انجام می‌شود." },
    ]},
    en: { eyebrow: "Pricing", title: "A simple, transparent Premium plan", summary: "The launch Premium plan is designed for 90 days with unlimited normal-use AI access, while fair-use and abuse controls remain in place.", sections: [
      { title: "One price source", body: "Day 41 moves price and entitlement data into an admin-managed source rather than repeating it in components or payment code." },
      { title: "Fair use", body: "Unlimited means normal educational use, not automated abuse or unbounded provider spend." },
      { title: "Verified payment", body: "Access is granted only after server-to-server ZarinPal verification in the payment phase." },
    ]},
  },
  help: {
    fa: { eyebrow: "راهنما", title: "پاسخ کوتاه، مسیر پشتیبانی روشن", summary: "مرکز راهنما ابتدا بر سوال‌های واقعی محصول تکیه می‌کند و پشتیبانی AI فقط از دانش تأییدشده پاسخ می‌دهد.", sections: [
      { title: "سوال‌های متداول", body: "پاسخ‌ها باید کوتاه، قابل جست‌وجو و دارای مالک محتوا باشند." },
      { title: "ارجاع انسانی", body: "موضوع‌های مالی، امنیتی و حساس امکان ارجاع به پشتیبانی انسانی خواهند داشت." },
      { title: "حریم خصوصی", body: "پشتیبانی به داده‌ای بیشتر از نیاز پرونده دسترسی نخواهد داشت." },
    ]},
    en: { eyebrow: "Help", title: "Concise answers with a clear support path", summary: "Help content starts from approved product knowledge; AI support is constrained to reviewed information.", sections: [
      { title: "FAQ", body: "Answers remain short, searchable, and content-owned." },
      { title: "Human escalation", body: "Financial, security, and sensitive cases can move to human support." },
      { title: "Privacy", body: "Support receives no more user data than the case requires." },
    ]},
  },
  about: {
    fa: { eyebrow: "درباره Endoora", title: "یک سیستم یادگیری متصل برای زبان‌آموز ایرانی", summary: "ماموریت Endoora ایجاد وابستگی سالم به چرخه یادگیری مفید است، نه افزایش تعداد قابلیت‌ها.", sections: [
      { title: "برای ایران", body: "رابط پیش‌فرض فارسی و RTL است و تصمیم‌های پرداخت، پیامک و زیرساخت باید از ایران قابل استفاده باشند." },
      { title: "برای یادگیری", body: "هر قابلیت اصلی باید یکی از حلقه‌های ارزیابی، تمرین، مدرس یا پیشرفت را تقویت کند." },
      { title: "برای اعتماد", body: "ادعاهای رسمی، گواهی و دقت علمی بدون اعتبارسنجی منتشر نمی‌شوند." },
    ]},
    en: { eyebrow: "About Endoora", title: "A connected learning system for Iranian learners", summary: "Endoora optimizes for a useful learning loop, not for feature count.", sections: [
      { title: "Built for Iran", body: "Persian RTL is the default and payment, SMS, and infrastructure choices must remain usable from Iran." },
      { title: "Built for learning", body: "Each major capability strengthens assessment, practice, teacher, or progress loops." },
      { title: "Built for trust", body: "Official claims, certificates, and scientific-accuracy claims are not published without validation." },
    ]},
  },
  contact: {
    fa: { eyebrow: "تماس", title: "مسیر تماس و پشتیبانی", summary: "کانال‌های پشتیبانی نهایی در فاز عملیات منتشر می‌شوند. تا آن زمان هیچ شماره یا ایمیل ساختگی نمایش داده نمی‌شود.", sections: [
      { title: "پشتیبانی حساب", body: "بازیابی حساب و مسائل امنیتی در Day 7–8 پایه‌گذاری می‌شوند." },
      { title: "پشتیبانی پرداخت", body: "پس از اتصال پرداخت، وضعیت سفارش و پیگیری از داده تأییدشده نمایش داده می‌شود." },
      { title: "گزارش محتوا", body: "مسیر گزارش نقض کپی‌رایت و محتوای نامناسب در فاز جامعه/عملیات تکمیل می‌شود." },
    ]},
    en: { eyebrow: "Contact", title: "A clear contact and support path", summary: "Final support channels are published during operations setup. No fake phone number or email is shown in the meantime.", sections: [
      { title: "Account support", body: "Recovery and security foundations are built on Days 7–8." },
      { title: "Payment support", body: "Once payments exist, order state and follow-up come from verified transaction data." },
      { title: "Content reports", body: "Copyright and safety reporting mature in the community/operations phase." },
    ]},
  },
  status: {
    fa: { eyebrow: "وضعیت سرویس", title: "وضعیت فعلی Endoora", summary: "این پروژه در مرحله ساخت است و هنوز سرویس عمومی Production راه‌اندازی نشده است.", sections: [
      { title: "وب عمومی", body: "Day 06: پوسته عمومی و SEO در حال تکمیل و راستی‌آزمایی است." },
      { title: "حساب کاربری", body: "در Days 07–08 ساخته می‌شود." },
      { title: "پرداخت", body: "پرداخت زنده تا گذر از تست‌های ZarinPal و HTTPS فعال نمی‌شود." },
    ]},
    en: { eyebrow: "Service status", title: "Current Endoora status", summary: "Endoora is under active construction and is not yet a public production service.", sections: [
      { title: "Public web", body: "Day 06: public shell and SEO are being completed and verified." },
      { title: "Accounts", body: "Built on Days 07–08." },
      { title: "Payments", body: "Live payments stay disabled until ZarinPal and public-HTTPS verification pass." },
    ]},
  },
};

export const featurePages: Record<FeatureKey, Localized<CopyBlock>> = {
  "learner-twin": {
    fa: { eyebrow: "Validated Beta", title: "Learner Twin توضیح‌پذیر", summary: "یک مدل یادگیرنده که فقط از شواهد آموزشی تأییدشده تغذیه می‌شود و کاربر می‌تواند آن را ببیند، اصلاح کند یا بازنشانی کند.", sections: [
      { title: "شواهد، نه حدس شخصیت", body: "مهارت، واژگان، الگوهای اشتباه و ترجیحات آموزشی ثبت می‌شوند؛ نه تشخیص شخصیت یا سلامت." },
      { title: "تاریخچه", body: "Snapshotها تغییرات را در زمان قابل مشاهده می‌کنند." },
      { title: "کنترل کاربر", body: "کاربر می‌تواند ادعاهای کم‌شواهد را بررسی، اصلاح یا حذف کند." },
    ]},
    en: { eyebrow: "Validated Beta", title: "An explainable Learner Twin", summary: "A learner model fed only by approved educational evidence that users can inspect, correct, or reset.", sections: [
      { title: "Evidence, not personality guesses", body: "Skills, vocabulary, mistake patterns, and learning preferences are tracked—not personality or health diagnoses." },
      { title: "History", body: "Snapshots make changes over time inspectable." },
      { title: "User control", body: "Low-evidence claims can be reviewed, corrected, or removed." },
    ]},
  },
  "daily-mission": {
    fa: { eyebrow: "Production V1", title: "Daily Mission قابل مدیریت", summary: "برنامه روزانه با زمان در دسترس، مرور واژگان، تکلیف مدرس و نقاط ضعف واقعی سازگار می‌شود.", sections: [
      { title: "بودجه زمانی", body: "ماموریت باید در زمان اعلام‌شده کاربر جا شود." },
      { title: "اولویت واقعی", body: "تکلیف نزدیک، مرورهای عقب‌افتاده و نیازهای یادگیری قبل از محتوای تصادفی قرار می‌گیرند." },
      { title: "بدون تنبیه", body: "Skip و Pause دلیل‌دار هستند و از الگوهای دستکاری‌کننده استفاده نمی‌شود." },
    ]},
    en: { eyebrow: "Production V1", title: "A manageable Daily Mission", summary: "Daily planning adapts to available time, vocabulary review, teacher assignments, and real learning needs.", sections: [
      { title: "Time budget", body: "A mission must fit the learner's declared available time." },
      { title: "Real priorities", body: "Deadlines, overdue reviews, and learning needs outrank random content." },
      { title: "No punishment", body: "Skip and Pause remain explicit choices without manipulative engagement patterns." },
    ]},
  },
  "mistake-genome": {
    fa: { eyebrow: "Validated Beta", title: "Mistake Genome بدون برچسب‌زنی دائمی", summary: "اشتباه‌های معتبر به الگو تبدیل می‌شوند فقط وقتی شواهد کافی وجود داشته باشد.", sections: [
      { title: "چند شاهد", body: "یک اشتباه منفرد به‌عنوان الگوی دائمی ثبت نمی‌شود." },
      { title: "قابل اعتراض", body: "زبان‌آموز و مدرس می‌توانند طبقه‌بندی AI را اصلاح کنند." },
      { title: "تمرین هدفمند", body: "الگوهای معتبر به انتخاب تمرین بعدی وصل می‌شوند." },
    ]},
    en: { eyebrow: "Validated Beta", title: "Mistake Genome without permanent labels", summary: "Validated mistakes become patterns only when enough evidence exists.", sections: [
      { title: "Multiple evidence events", body: "A single mistake does not become a permanent learner pattern." },
      { title: "Disputable", body: "Learners and teachers can correct AI classification." },
      { title: "Targeted practice", body: "Approved patterns feed the next useful practice selection." },
    ]},
  },
  "writing-mentor": {
    fa: { eyebrow: "Validated Beta", title: "Writing Mentor برای بازنویسی توسط خود زبان‌آموز", summary: "هدف، جایگزین کردن صدای زبان‌آموز نیست؛ بازخورد، اولویت اصلاح و نمونه بازنویسی برای یادگیری ارائه می‌شود.", sections: [
      { title: "نسخه‌های محفوظ", body: "متن اصلی و نسخه‌های بعدی جدا می‌مانند." },
      { title: "بازخورد اولویت‌دار", body: "به‌جای اصلاح بی‌پایان، مهم‌ترین تغییرهای آموزشی برجسته می‌شوند." },
      { title: "برآورد، نه نمره رسمی", body: "حالت IELTS بازه و محدودیت را نشان می‌دهد." },
    ]},
    en: { eyebrow: "Validated Beta", title: "Writing Mentor that coaches revision", summary: "The goal is not to replace learner voice; feedback, priorities, and example rewrites support learning.", sections: [
      { title: "Version history", body: "Original and revised drafts remain separate." },
      { title: "Prioritized feedback", body: "The system highlights the most educationally useful changes instead of endless correction." },
      { title: "Estimate, not official grade", body: "IELTS mode displays a range and limitations." },
    ]},
  },
  "roleplay-voice": {
    fa: { eyebrow: "Validated Beta", title: "Roleplay و Voice با رضایت و محدودیت روشن", summary: "تمرین مکالمه ابتدا متنی است؛ صدا اختیاری و دارای کنترل حذف و نگهداری خواهد بود.", sections: [
      { title: "سناریوی هدفمند", body: "هر نقش هدف، سطح، واژگان هدف و معیار پایان دارد." },
      { title: "روانی قبل از قطع مداوم", body: "همه خطاها وسط مکالمه تصحیح نمی‌شوند؛ جمع‌بندی بعد از گفتگو انجام می‌شود." },
      { title: "Voice با رضایت", body: "ضبط، نگهداری و حذف صدا شفاف و قابل کنترل است." },
    ]},
    en: { eyebrow: "Validated Beta", title: "Roleplay and voice with explicit consent", summary: "Conversation practice starts with text; voice remains optional with clear retention and deletion controls.", sections: [
      { title: "Goal-based scenarios", body: "Each roleplay has an objective, level, target language, and completion criteria." },
      { title: "Fluency before interruption", body: "Not every error is corrected mid-conversation; a post-session summary protects fluency." },
      { title: "Consent-based voice", body: "Recording, retention, and deletion controls are explicit." },
    ]},
  },
  "teachers-classes": {
    fa: { eyebrow: "Validated Beta", title: "مدرس و کلاس، متصل به شواهد یادگیری", summary: "بازار مدرس باید با تأیید، دسترسی حداقلی، ظرفیت واقعی و وضعیت رزرو روشن ساخته شود.", sections: [
      { title: "تأیید قبل از قابلیت مالی", body: "داشتن نقش Teacher به‌تنهایی مجوز کلاس پولی نمی‌دهد." },
      { title: "دسترسی حداقلی", body: "مدرس فقط داده آموزشی مرتبط با رابطه مجاز را می‌بیند." },
      { title: "رزرو قابل حسابرسی", body: "درخواست، پیشنهاد، رزرو، لغو و اختلاف وضعیت‌های مشخص دارند." },
    ]},
    en: { eyebrow: "Validated Beta", title: "Teachers and classes connected to learning evidence", summary: "Teacher supply is built around verification, least-privilege access, real capacity, and explicit booking state.", sections: [
      { title: "Verification before paid capability", body: "The Teacher role alone does not grant paid-class permission." },
      { title: "Least privilege", body: "Teachers see only educational data authorized by a legitimate relationship." },
      { title: "Auditable booking", body: "Request, offer, booking, cancellation, and dispute states are explicit." },
    ]},
  },
  "ielts-practice": {
    fa: { eyebrow: "Validated Beta", title: "IELTS Practice با برآورد محدود و شفاف", summary: "شبیه‌سازی IELTS به چرخه تمرین و تحلیل اشتباه وصل می‌شود، بدون کپی محتوای تجاری یا معرفی بازخورد AI به‌عنوان نمره رسمی.", sections: [
      { title: "محتوای اصل یا مجاز", body: "متن، صدا و سوال باید تولید Endoora، دارای مجوز یا در مالکیت عمومی باشند." },
      { title: "بازه به‌جای قطعیت", body: "بازخورد Writing و Speaking معیار، شواهد، بازه و محدودیت را کنار هم نشان می‌دهد." },
      { title: "اقدام بعدی", body: "الگوهای تأییدشده به تمرین هدفمند بعدی متصل می‌شوند، نه صرفاً یک صفحه نتیجه." },
    ]},
    en: { eyebrow: "Validated Beta", title: "IELTS Practice with bounded, transparent estimates", summary: "IELTS simulation connects to practice and mistake evidence without copying commercial material or presenting AI feedback as an official score.", sections: [
      { title: "Original or licensed", body: "Text, audio, and questions must be Endoora originals, licensed, or public-domain." },
      { title: "Ranges over certainty", body: "Writing and Speaking feedback displays criteria, evidence, a range, and limitations together." },
      { title: "A useful next action", body: "Approved patterns lead to targeted follow-up practice rather than a dead-end result page." },
    ]},
  },
  premium: {
    fa: { eyebrow: "Production V1", title: "Premium Endoora با قیمت و مصرف قابل توضیح", summary: "Premium به یک منبع قیمت مدیریتی، استحقاق سروری و سیاست مصرف منصفانه متصل می‌شود؛ متن بازاریابی به‌تنهایی دسترسی ایجاد نمی‌کند.", sections: [
      { title: "منبع واحد قیمت", body: "مبلغ نمایش، سفارش و تأیید پرداخت از یک منبع داده می‌آیند." },
      { title: "استحقاق سروری", body: "دسترسی فقط پس از تأیید پرداخت یا اعطای مدیریتی معتبر فعال می‌شود." },
      { title: "مصرف منصفانه", body: "استفاده عادی آموزشی نامحدود از سوءاستفاده خودکار و هزینه کنترل‌نشده جدا می‌شود." },
    ]},
    en: { eyebrow: "Production V1", title: "Endoora Premium with explainable price and usage", summary: "Premium connects to admin-managed pricing, server-side entitlement, and a fair-use policy; marketing copy alone never grants access.", sections: [
      { title: "One price source", body: "Display, order, and payment verification read from one managed data source." },
      { title: "Server-side entitlement", body: "Access activates only after verified payment or a valid administrative grant." },
      { title: "Fair use", body: "Unlimited normal educational use remains distinct from automation abuse and uncontrolled provider cost." },
    ]},
  },
};

export const legalPages: Record<LegalKey, Localized<CopyBlock>> = {
  privacy: {
    fa: { eyebrow: "پیش‌نویس — هنوز منتشر نشده", title: "حریم خصوصی", summary: "این صفحه در Day 06 فقط جایگاه و موضوعات لازم را مشخص می‌کند و هنوز متن حقوقی نهایی Endoora نیست.", sections: [
      { title: "داده مورد نیاز", body: "داده‌ها باید حداقل، هدف‌دار و قابل توضیح باشند." },
      { title: "کنترل کاربر", body: "خروجی، اصلاح و حذف داده در فازهای مربوط تکمیل می‌شود." },
      { title: "نگهداری", body: "برای صدا، نوشته، پیام و پشتیبانی دوره نگهداری جدا تعریف می‌شود." },
    ]},
    en: { eyebrow: "Draft — not yet published", title: "Privacy", summary: "Day 06 defines the required privacy topics only; this is not Endoora's final legal policy.", sections: [
      { title: "Data minimization", body: "Collected data must be necessary, purpose-bound, and explainable." },
      { title: "User controls", body: "Export, correction, and deletion workflows are completed in later phases." },
      { title: "Retention", body: "Audio, writing, messages, and support data receive separate retention rules." },
    ]},
  },
  terms: {
    fa: { eyebrow: "پیش‌نویس — هنوز منتشر نشده", title: "شرایط استفاده", summary: "قوانین نهایی حساب، پرداخت، محتوای کاربر و رفتار مجاز پیش از راه‌اندازی حقوقی بازبینی می‌شوند.", sections: [
      { title: "حساب و دسترسی", body: "کاربر مسئول امنیت حساب خود است و دسترسی‌ها بر اساس نقش و مجوز کنترل می‌شوند." },
      { title: "استفاده منصفانه", body: "سوءاستفاده خودکار و ایجاد بار غیرعادی مجاز نخواهد بود." },
      { title: "محدودیت سرویس", body: "قابلیت‌های Beta و AI با محدودیت‌های صریح عرضه می‌شوند." },
    ]},
    en: { eyebrow: "Draft — not yet published", title: "Terms of use", summary: "Final account, payment, user-content, and acceptable-use terms require legal review before launch.", sections: [
      { title: "Account and access", body: "Users are responsible for account security and capabilities are role/permission controlled." },
      { title: "Fair use", body: "Automated abuse and abnormal provider load are not permitted." },
      { title: "Service limits", body: "Beta and AI capabilities carry explicit limitations." },
    ]},
  },
  accessibility: {
    fa: { eyebrow: "پیش‌نویس — هنوز منتشر نشده", title: "بیانیه دسترسی‌پذیری", summary: "هدف Endoora برای مسیرهای اصلی WCAG 2.2 AA است؛ ممیزی کامل در Day 54 انجام می‌شود.", sections: [
      { title: "کیبورد", body: "کنترل‌های اصلی باید بدون ماوس قابل استفاده باشند." },
      { title: "خوانایی", body: "کنتراست، اندازه هدف و بزرگ‌نمایی در طراحی پایه لحاظ می‌شوند." },
      { title: "دو جهت متن", body: "RTL فارسی و LTR انگلیسی باید بدون شکستن معنا کنار هم کار کنند." },
    ]},
    en: { eyebrow: "Draft — not yet published", title: "Accessibility statement", summary: "Endoora targets WCAG 2.2 AA for core journeys; the complete review is scheduled for Day 54.", sections: [
      { title: "Keyboard", body: "Core controls should be usable without a mouse." },
      { title: "Readability", body: "Contrast, target size, and zoom are part of the design foundation." },
      { title: "Bidirectional text", body: "Persian RTL and English LTR content must coexist without breaking meaning." },
    ]},
  },
  refund: {
    fa: { eyebrow: "پیش‌نویس — هنوز منتشر نشده", title: "بازپرداخت", summary: "سیاست نهایی بعد از تعریف سفارش، رزرو و وضعیت‌های مالی در Days 39–43 منتشر می‌شود.", sections: [
      { title: "قابل پیش‌بینی", body: "مبلغ و شرایط بازپرداخت باید بر اساس وضعیت تراکنش قابل محاسبه باشد." },
      { title: "ثبت تاریخچه", body: "تغییر مالی با رویداد جبرانی ثبت می‌شود، نه ویرایش تاریخچه." },
      { title: "پشتیبانی", body: "اختلاف پرداخت مسیر ارجاع و پیگیری مشخص خواهد داشت." },
    ]},
    en: { eyebrow: "Draft — not yet published", title: "Refund policy", summary: "The final policy is published after orders, bookings, and financial states are built on Days 39–43.", sections: [
      { title: "Predictable", body: "Refund amount and eligibility should be deterministically derived from transaction state." },
      { title: "Recorded history", body: "Financial changes use compensating events rather than editing history." },
      { title: "Support", body: "Payment disputes receive an explicit escalation path." },
    ]},
  },
  "ai-limitations": {
    fa: { eyebrow: "پیش‌نویس — هنوز منتشر نشده", title: "محدودیت‌های هوش مصنوعی", summary: "AI می‌تواند اشتباه کند؛ خروجی‌های آموزشی باید دارای محدوده، شواهد و مسیر اصلاح باشند.", sections: [
      { title: "نمره رسمی نیست", body: "برآورد CEFR یا IELTS بدون اعتبارسنجی انسانی/علمی به‌عنوان نمره رسمی نمایش داده نمی‌شود." },
      { title: "قابل گزارش", body: "کاربر باید بتواند خروجی نامناسب یا اشتباه را گزارش کند." },
      { title: "مدل قابل تغییر", body: "Endoora نباید به یک مدل یا سرویس‌دهنده واحد وابسته بماند." },
    ]},
    en: { eyebrow: "Draft — not yet published", title: "AI limitations", summary: "AI can be wrong; educational output must expose scope, evidence, and a correction path.", sections: [
      { title: "Not an official score", body: "CEFR or IELTS estimates are not presented as official without appropriate validation." },
      { title: "Reportable", body: "Users should be able to report incorrect or inappropriate output." },
      { title: "Provider-independent", body: "Endoora should not depend permanently on one model or provider." },
    ]},
  },
  copyright: {
    fa: { eyebrow: "پیش‌نویس — هنوز منتشر نشده", title: "کپی‌رایت و درخواست حذف", summary: "Endoora فقط محتوای اصل، مجاز یا عمومی را برای آموزش منتشر می‌کند و مسیر گزارش حقوقی قبل از راه‌اندازی تکمیل می‌شود.", sections: [
      { title: "متادیتای حقوق", body: "مالک، نوع مجوز، منبع و تاریخ انقضا برای دارایی‌های دارای مجوز ثبت می‌شود." },
      { title: "گزارش", body: "صاحب حق می‌تواند درخواست بررسی و حذف ثبت کند." },
      { title: "عدم کپی کتاب تجاری", body: "دسترسی آسان آنلاین مجوز بازنشر محتوا نیست." },
    ]},
    en: { eyebrow: "Draft — not yet published", title: "Copyright and takedown", summary: "Endoora publishes original, licensed, or public-domain learning material and will complete a takedown process before launch.", sections: [
      { title: "Rights metadata", body: "Rights owner, license type, source, and expiry are recorded for licensed assets." },
      { title: "Reporting", body: "Rights holders can submit a review and takedown request." },
      { title: "No commercial-book copying", body: "Easy online access does not create redistribution permission." },
    ]},
  },
};

export const publicPageKeys = Object.keys(publicPages) as PublicPageKey[];
export const featureKeys = Object.keys(featurePages) as FeatureKey[];
export const legalKeys = Object.keys(legalPages) as LegalKey[];

export function localizedPath(locale: PublicLocale, path: string): string {
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  if (locale === "fa") return normalized || "/";
  return `/en${normalized}` || "/en";
}

export function accountPath(
  locale: PublicLocale,
  path: "/auth/login" | "/auth/register",
): string {
  return locale === "fa" ? path : `${path}?locale=en`;
}

export function alternatePath(locale: PublicLocale, path: string): string {
  return localizedPath(locale === "fa" ? "en" : "fa", path);
}

export function buildMetadata(
  locale: PublicLocale,
  path: string,
  title: string,
  description: string,
  options: { index?: boolean } = {},
): Metadata {
  const current = `${PUBLIC_BASE_URL}${localizedPath(locale, path)}`;
  const faUrl = `${PUBLIC_BASE_URL}${localizedPath("fa", path)}`;
  const enUrl = `${PUBLIC_BASE_URL}${localizedPath("en", path)}`;
  const index = options.index ?? true;

  return {
    title,
    description,
    alternates: {
      canonical: current,
      languages: {
        "fa-IR": faUrl,
        en: enUrl,
        "x-default": faUrl,
      },
    },
    openGraph: {
      type: "website",
      siteName: "Endoora",
      title,
      description,
      url: current,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      alternateLocale: locale === "fa" ? ["en_US"] : ["fa_IR"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index,
      follow: index,
    },
  };
}

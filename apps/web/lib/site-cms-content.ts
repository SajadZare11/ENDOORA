export interface AnnouncementBannerConfig {
  enabled: boolean;
  textFa: string;
  textEn: string;
  badgeFa?: string;
  badgeEn?: string;
  actionLabelFa?: string;
  actionLabelEn?: string;
  actionHref?: string;
  bgColor?: string;
  textColor?: string;
}

export interface HeroSectionConfig {
  badgeFa: string;
  badgeEn: string;
  titleFa: string;
  titleEn: string;
  subtitleFa: string;
  subtitleEn: string;
  primaryCtaLabelFa: string;
  primaryCtaLabelEn: string;
  primaryCtaHref: string;
  secondaryCtaLabelFa: string;
  secondaryCtaLabelEn: string;
  secondaryCtaHref: string;
  trustPill1Fa: string;
  trustPill1En: string;
  trustPill2Fa: string;
  trustPill2En: string;
  trustPill3Fa: string;
  trustPill3En: string;
}

export interface LearningStepConfig {
  id: string;
  number: string;
  icon: string;
  titleFa: string;
  titleEn: string;
  descFa: string;
  descEn: string;
  actionLabelFa: string;
  actionHref: string;
}

export interface SkillsHubConfig {
  badgeFa: string;
  titleFa: string;
  descriptionFa: string;
  tamrin20SpotlightEnabled: boolean;
  tamrin20BadgeFa: string;
  tamrin20TitleFa: string;
  tamrin20DescFa: string;
  smallTalkSpotlightEnabled: boolean;
  smallTalkBadgeFa: string;
  smallTalkTitleFa: string;
  smallTalkDescFa: string;
}

export interface PricingPlanConfig {
  id: string;
  nameFa: string;
  nameEn: string;
  priceToman: number;
  periodFa: string;
  badgeFa?: string;
  featuresFa: string[];
  ctaLabelFa: string;
  ctaHref: string;
  isPopular?: boolean;
}

export interface FaqItemConfig {
  id: string;
  questionFa: string;
  answerFa: string;
  category: "general" | "placement" | "classes" | "ai" | "pricing";
}

export interface FooterConfig {
  brandDescFa: string;
  brandDescEn: string;
  phone: string;
  email: string;
  addressFa: string;
  telegramLink?: string;
  instagramLink?: string;
  linkedinLink?: string;
  copyrightTextFa: string;
}

export interface SiteContentData {
  version: number;
  lastUpdated: string;
  updatedBy: string;
  banner: AnnouncementBannerConfig;
  hero: HeroSectionConfig;
  learningSteps: LearningStepConfig[];
  skillsHub: SkillsHubConfig;
  pricingPlans: PricingPlanConfig[];
  faqs: FaqItemConfig[];
  footer: FooterConfig;
}

export interface SiteContentVersionRecord {
  version: number;
  savedAt: string;
  savedBy: string;
  changeSummary: string;
  data: SiteContentData;
}

export const DEFAULT_SITE_CONTENT: SiteContentData = {
  version: 1,
  lastUpdated: "2026-11-12T00:00:00Z",
  updatedBy: "مدیر ارشد ایندورا",
  banner: {
    enabled: false,
    textFa: "🎉 نسخه جدید ایندورا منتشر شد: سامانه تمرین تا ۲۰ و آمادگی امتحانات نهایی با تصحیح هوشمند هوش مصنوعی فعال شد!",
    textEn: "🎉 New Endoora Release: Tamrin 20 module with AI grading is now live!",
    badgeFa: "ویژه دانش‌آموزان",
    badgeEn: "Special",
    actionLabelFa: "مشاهده تمرین‌ها",
    actionLabelEn: "Explore",
    actionHref: "/high-school/grade-12/tamrin20",
    bgColor: "linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)",
    textColor: "#ffffff",
  },
  hero: {
    badgeFa: "روشی خودمانی، اصولی و هوشمند برای یادگیری زبان",
    badgeEn: "A friendly, grounded, and smart English learning journey",
    titleFa: "انگلیسی رو راحت، پیوسته و بدون استرس یاد بگیر",
    titleEn: "Master English Naturally and Confidently",
    subtitleFa: "در ایندورا با تعیین سطح رایگان، نقشه راه اختصاصی، کلاس‌های آنلاین خودمانی و تمرین‌های ۱۰ دقیقه‌ای با هوش مصنوعی، انگلیسی رو ساده و لذت‌بخش یاد بگیر.",
    subtitleEn: "Personalized placement, step-by-step roadmap, interactive live classes, and 10-minute daily AI practice tailored for Iranian learners.",
    primaryCtaLabelFa: "شروع با تعیین سطح رایگان",
    primaryCtaLabelEn: "Free Diagnostic Placement",
    primaryCtaHref: "/placement",
    secondaryCtaLabelFa: "مشاهده کلاس‌ها و اساتید",
    secondaryCtaLabelEn: "Browse Classes & Teachers",
    secondaryCtaHref: "/teachers",
    trustPill1Fa: "✨ منطبق بر استاندارد بین‌المللی CEFR",
    trustPill1En: "CEFR Standardized",
    trustPill2Fa: "🎯 فیدبک هوش مصنوعی بدون معطلی",
    trustPill2En: "Instant AI Feedback",
    trustPill3Fa: "👥 کلاس‌های زنده کوچک و تعاملی",
    trustPill3En: "Live Interactive Classes",
  },
  learningSteps: [
    {
      id: "step-1",
      number: "01",
      icon: "🎯",
      titleFa: "انتخاب سن و هدف",
      titleEn: "Onboarding & Goal Profiling",
      descFa: "اول به ما بگو چند سالته و برای چی می‌خوای انگلیسی یاد بگیری؛ مکالمه، مدرسه یا مهاجرت؟ تا مسیرت رو آماده کنیم.",
      descEn: "Age group bracket and core learning goals to calibrate your personalized journey.",
      actionLabelFa: "ثبت‌نام و شروع",
      actionHref: "/auth/register",
    },
    {
      id: "step-2",
      number: "02",
      icon: "📊",
      titleFa: "تعیین سطح ۶ مهارتی",
      titleEn: "6-Skill Diagnostic Placement",
      descFa: "یک آزمون هوشمند و بدون استرس در ۶ مهارت؛ تا دقیقاً مشخص بشه کجای مسیری و از چه سطحی باید شروع کنی.",
      descEn: "Adaptive placement in Grammar, Vocabulary, Reading, Listening, Speaking, and Writing.",
      actionLabelFa: "شروع تعیین سطح",
      actionHref: "/placement",
    },
    {
      id: "step-3",
      number: "03",
      icon: "🗺️",
      titleFa: "کارنامه و نقشه راه اختصاصی",
      titleEn: "Diagnostic Report & Roadmaps",
      descFa: "نقاط قوت و نیاز به تمرینت رو به تفکیک مهارت‌ها در قالب تراز استاندارد CEFR شفاف و روشن ببین.",
      descEn: "Detailed analytics identifying strengths and focus areas from A1 to C2.",
      actionLabelFa: "مشاهده نمونه کارنامه",
      actionHref: "/placement/sample-report",
    },
    {
      id: "step-4",
      number: "04",
      icon: "📚",
      titleFa: "کتاب درسی و سرفصل‌ها",
      titleEn: "Course & Curriculum Mapping",
      descFa: "تطبیق خودکار با معتبرترین منابع آموزشی مانند American English File و پکیج‌های تخصصی بر اساس سطح تو.",
      descEn: "Automated mapping to American English File, Family & Friends, or IELTS materials.",
      actionLabelFa: "مشاهده منابع",
      actionHref: "/learn",
    },
    {
      id: "step-5",
      number: "05",
      icon: "🧑‍🏫",
      titleFa: "کلاس آنلاین زنده با مدرس",
      titleEn: "Live Online Classes",
      descFa: "شرکت در کلاس‌های تعاملی خصوصی یا نیمه‌خصوصی حداکثر ۴ نفره با مدرسان تایید صلاحیت شده.",
      descEn: "Interactive live classes with verified teachers in small groups (up to 4 learners).",
      actionLabelFa: "رزرو کلاس",
      actionHref: "/classes",
    },
    {
      id: "step-6",
      number: "06",
      icon: "⏱️",
      titleFa: "ماموریت روزانه و جعبه لایتنر",
      titleEn: "Daily Adaptive Missions",
      descFa: "تمرین‌های انطباقی ۱۰ دقیقه‌ای در روز بر اساس الگوریتم مرور فاصله‌دار (SRS) برای تثبیت آموخته‌ها.",
      descEn: "10-minute prioritized daily homework and Spaced Repetition System (SRS).",
      actionLabelFa: "ورود به ماموریت روز",
      actionHref: "/learner/missions",
    },
    {
      id: "step-7",
      number: "07",
      icon: "🤖",
      titleFa: "آزمایشگاه‌های هوش مصنوعی",
      titleEn: "AI Practice Labs",
      descFa: "تصحیح نگارش رایتینگ، آزمایشگاه صوت و تلفظ، شبیه‌ساز مکالمه و تحلیل اشتباهات پرتکرار فارسی‌زبانان.",
      descEn: "Writing mentor, pronunciation voice lab, and Iranian L1 mistake diagnostics.",
      actionLabelFa: "آشنایی با آزمایشگاه‌ها",
      actionHref: "/features",
    },
  ],
  skillsHub: {
    badgeFa: "تسلط بر ۶ رکن زبان",
    titleFa: "مهارت‌های زبان انگلیسی با متد اختصاصی",
    descriptionFa: "هر مهارت دارای ۴ ستون یادگیری: جعبه‌ابزار طلایی عبارات، تمرین تعاملی لحظه‌ای، رفع خطاهای رایج فارسی‌زبانان و نقشه راه روزانه.",
    tamrin20SpotlightEnabled: true,
    tamrin20BadgeFa: "ویژه نهایی دوازدهم",
    tamrin20TitleFa: "تمرین تا ۲۰ - زبان انگلیسی دوازدهم",
    tamrin20DescFa: "حل خط به خط نمونه سوالات امتحانات نهایی با بازخورد آنی سبز و قرمز و پاسخ تشریحی جامع.",
    smallTalkSpotlightEnabled: true,
    smallTalkBadgeFa: "فرهنگ و روابط اجتماعی",
    smallTalkTitleFa: "Small Talk & مکالمه روزمره",
    smallTalkDescFa: "یادگیری الگوهای مودبانه، یخ‌شکنی، اصطلاحات روزمره و تفاوت‌های فرهنگی در ارتباطات واقعی.",
  },
  pricingPlans: [
    {
      id: "plan-free",
      nameFa: "شروع رایگان",
      nameEn: "Free Starter",
      priceToman: 0,
      periodFa: "همیشگی",
      badgeFa: "برای همه",
      featuresFa: [
        "تعیین سطح اولیه رایگان",
        "دسترسی به مقالات و لغات روزانه",
        "حل ۵ تست روزانه با هوش مصنوعی",
        "مشاهده تقویم کلاسی اساتید",
      ],
      ctaLabelFa: "شروع رایگان",
      ctaHref: "/auth/register",
      isPopular: false,
    },
    {
      id: "plan-pro",
      nameFa: "اشتراک طلایی (پریمیوم)",
      nameEn: "Endoora Pro",
      priceToman: 420000,
      periodFa: "۳ ماهه",
      badgeFa: "پیشنهاد ویژه",
      featuresFa: [
        "آزمون جامع تعیین سطح ۶ مهارتی نامحدود",
        "دسترسی به تمامی آزمایشگاه‌های هوش مصنوعی (صوت، مکالمه، نگارش)",
        "سامانه کامل تمرین تا ۲۰ ویژه امتحانات نهایی",
        "تخفیف ۲۰ درصدی رزرو کلاس‌های آنلاین با اساتید برتر",
        "جعبه لایتنر هوشمند انطباقی بدون محدودیت",
      ],
      ctaLabelFa: "ارتقا به پرو",
      ctaHref: "/checkout?plan=pro",
      isPopular: true,
    },
    {
      id: "plan-vip",
      nameFa: "بسته آیلتس و آمادگی جامع",
      nameEn: "IELTS & Intensive",
      priceToman: 980000,
      periodFa: "۶ ماهه",
      badgeFa: "جامع‌ترین پکیج",
      featuresFa: [
        "تمامی امکانات بسته پرو",
        "شبیه‌ساز رسمی ماک تست آیلتس (۴ مهارت)",
        "تصحیح تخصصی رایتینگ تسک ۱ و ۲ توسط اساتید بین‌المللی",
        "جلسات مکالمه آزمایشی اسپیکینگ با فیدبک بند اسکور",
        "پشتیبانی مستقیم و منتور اختصاصی",
      ],
      ctaLabelFa: "انتخاب پکیج آیلتس",
      ctaHref: "/checkout?plan=vip",
      isPopular: false,
    },
  ],
  faqs: [
    {
      id: "faq-1",
      category: "placement",
      questionFa: "آیا آزمون تعیین سطح ایندورا رایگان است و چقدر زمان می‌برد؟",
      answerFa: "بله، تعیین سطح ۶ مهارتی اولیه ایندورا کاملاً رایگان است و به طور میانگین حدود ۱۵ تا ۲۰ دقیقه زمان می‌برد. سوالات بر اساس پاسخ‌های شما انطباق پیدا می‌کنند تا در کوتاه‌ترین زمان، سطح دقیق شما سنجیده شود.",
    },
    {
      id: "faq-2",
      category: "classes",
      questionFa: "کلاس‌های آنلاین چگونه برگزار می‌شوند و چند نفره هستند؟",
      answerFa: "کلاس‌های زنده ایندورا در محیط اختصاصی و سبک پلتفرم برگزار می‌شوند و نیاز به نصب برنامه جانبی ندارند. برای بالاترین بازدهی مکالمه، ظرفیت کلاس‌ها خصوصی (۱ نفره) یا نیمه‌خصوصی حداکثر تا ۴ نفر هم‌سطح است.",
    },
    {
      id: "faq-3",
      category: "ai",
      questionFa: "آزمایشگاه‌های هوش مصنوعی چطور به یادگیری زبان کمک می‌کنند؟",
      answerFa: "ابزارهای هوش مصنوعی ایندورا جایگزین استاد نیستند، بلکه مکمل روزانه شما هستند؛ شما می‌توانید مکالمه گفتاری با هوش مصنوعی را تمرین کنید، متن رایتینگ خود را برای تحلیل گرامری ارسال کنید و بدون خجالت هر چقدر می‌خواهید تمرین کنید.",
    },
    {
      id: "faq-4",
      category: "pricing",
      questionFa: "آیا امکان انصراف و بازگشت وجه وجود دارد؟",
      answerFa: "بله، در صورتی که پس از رزرو اولین جلسه کلاس یا خرید اشتراک ظرف ۲۴ ساعت رضایت نداشتید، وجه پرداختی مطابق قوانین سایت بدون قید و شرط عودت داده می‌شود.",
    },
  ],
  footer: {
    brandDescFa: "ایندورا؛ سامانه خودمانی و هوشمند یادگیری زبان انگلیسی. ترکیب آزمون‌های تحلیلی، کلاس‌های آنلاین زنده با اساتید مجرب و آزمایشگاه‌های پیشرفته هوش مصنوعی.",
    brandDescEn: "Endoora - The smart, friendly English learning ecosystem for Persian speakers.",
    phone: "۰۲۱-۸۸۸۸۹۹۹۹",
    email: "support@endoora.ir",
    addressFa: "تهران، میدان ونک، خیابان ولیعصر، برج فناوری، طبقه ۷",
    telegramLink: "https://t.me/endoora_official",
    instagramLink: "https://instagram.com/endoora_ir",
    linkedinLink: "https://linkedin.com/company/endoora",
    copyrightTextFa: "تمامی حقوق مادی و معنوی این پلتفرم متعلق به سامانه آموزش آنلاین ایندورا است.",
  },
};


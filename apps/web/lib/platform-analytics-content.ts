export type AnalyticsTimeframe = "7d" | "30d" | "90d" | "1y";

export interface FunnelStageData {
  stageKey: "landing" | "course_view" | "checkout_start" | "paid_conversion";
  stageLabel: string;
  visitorCount: number;
  dropoffPercentage: number;
  conversionRateFromStart: number;
  avgTimeSpentSeconds: number;
}

export interface AcquisitionChannelMetric {
  channelKey: "organic_search" | "instagram_social" | "direct_traffic" | "affiliate_referral";
  channelLabel: string;
  visitors: number;
  checkoutStarts: number;
  paidCustomers: number;
  revenueToman: number;
  conversionRate: number;
}

export interface AbandonedCartItem {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  courseId: string;
  courseTitle: string;
  cartValueToman: number;
  abandonedAt: string;
  hoursAgo: number;
  recoveryStatus: "uncontacted" | "coupon_sent" | "recovered" | "expired";
  discountCouponCode?: string;
}

export interface CohortMonthData {
  cohortMonth: string;
  newLearnersCount: number;
  m1Retention: number;
  m2Retention: number;
  m3Retention: number;
  m4Retention: number;
  m5Retention: number;
  m6Retention: number;
}

export interface AtRiskLearner {
  userId: string;
  userName: string;
  userEmail: string;
  courseTitle: string;
  daysInactive: number;
  progressPercentage: number;
  lastLessonCompleted: string;
  churnRiskScore: number; // 1 to 100
  nudgeSent: boolean;
}

export interface CourseUnitEconomic {
  courseId: string;
  courseTitle: string;
  teacherName: string;
  category: string;
  priceToman: number;
  totalEnrolled: number;
  grossRevenueToman: number;
  platformNetCommissionToman: number;
  completionRate: number; // درصد تکمیل دروس
  refundRate: number; // درصد استرداد وجه
  averageRating: number; // از ۵
  healthStatus: "excellent" | "healthy" | "needs_attention" | "high_refund";
}

export interface PlatformAnalyticsStats {
  totalVisitors: number;
  totalCheckouts: number;
  totalPaidOrders: number;
  overallConversionRate: number;
  abandonedCartValueToman: number;
  recoveredCartValueToman: number;
  dauToMauRatio: number; // نسبت چسبندگی (DAU/MAU)
  avgDailyLearningMinutes: number;
  grossPlatformRevenueToman: number;
}

export const TIMEFRAME_LABELS: Record<AnalyticsTimeframe, string> = {
  "7d": "۷ روز گذشته",
  "30d": "۳۰ روز گذشته (ماه جاری)",
  "90d": "۳ ماه اخیر (فصل جاری)",
  "1y": "یک سال کامل (سال جاری)",
};

export const COURSE_HEALTH_LABELS: Record<CourseUnitEconomic["healthStatus"], { fa: string; color: string; badgeClass: string }> = {
  excellent: { fa: "عملکرد عالی و سودآور", color: "#10b981", badgeClass: "healthExcellent" },
  healthy: { fa: "پایدار و استاندارد", color: "#3b82f6", badgeClass: "healthHealthy" },
  needs_attention: { fa: "نیازمند بهبود محتوا", color: "#f59e0b", badgeClass: "healthWarning" },
  high_refund: { fa: "هشدار نرخ استرداد بالا", color: "#ef4444", badgeClass: "healthCritical" },
};

export const INITIAL_FUNNEL_STAGES: Record<AnalyticsTimeframe, FunnelStageData[]> = {
  "30d": [
    {
      stageKey: "landing",
      stageLabel: "۱. ورود و بازدید صفحه اصلی",
      visitorCount: 142500,
      dropoffPercentage: 0,
      conversionRateFromStart: 100,
      avgTimeSpentSeconds: 78,
    },
    {
      stageKey: "course_view",
      stageLabel: "۲. بررسی صفحه معرفی دوره‌ها",
      visitorCount: 54150,
      dropoffPercentage: 62.0,
      conversionRateFromStart: 38.0,
      avgTimeSpentSeconds: 145,
    },
    {
      stageKey: "checkout_start",
      stageLabel: "۳. ورود به سبد خرید و تسویه",
      visitorCount: 14620,
      dropoffPercentage: 73.0,
      conversionRateFromStart: 10.25,
      avgTimeSpentSeconds: 110,
    },
    {
      stageKey: "paid_conversion",
      stageLabel: "۴. پرداخت موفق و ثبت‌نام قطعی",
      visitorCount: 6840,
      dropoffPercentage: 53.2,
      conversionRateFromStart: 4.8,
      avgTimeSpentSeconds: 65,
    },
  ],
  "7d": [
    {
      stageKey: "landing",
      stageLabel: "۱. ورود و بازدید صفحه اصلی",
      visitorCount: 35600,
      dropoffPercentage: 0,
      conversionRateFromStart: 100,
      avgTimeSpentSeconds: 72,
    },
    {
      stageKey: "course_view",
      stageLabel: "۲. بررسی صفحه معرفی دوره‌ها",
      visitorCount: 13900,
      dropoffPercentage: 60.9,
      conversionRateFromStart: 39.0,
      avgTimeSpentSeconds: 138,
    },
    {
      stageKey: "checkout_start",
      stageLabel: "۳. ورود به سبد خرید و تسویه",
      visitorCount: 3920,
      dropoffPercentage: 71.8,
      conversionRateFromStart: 11.0,
      avgTimeSpentSeconds: 98,
    },
    {
      stageKey: "paid_conversion",
      stageLabel: "۴. پرداخت موفق و ثبت‌نام قطعی",
      visitorCount: 1850,
      dropoffPercentage: 52.8,
      conversionRateFromStart: 5.2,
      avgTimeSpentSeconds: 60,
    },
  ],
  "90d": [
    {
      stageKey: "landing",
      stageLabel: "۱. ورود و بازدید صفحه اصلی",
      visitorCount: 410000,
      dropoffPercentage: 0,
      conversionRateFromStart: 100,
      avgTimeSpentSeconds: 82,
    },
    {
      stageKey: "course_view",
      stageLabel: "۲. بررسی صفحه معرفی دوره‌ها",
      visitorCount: 151700,
      dropoffPercentage: 63.0,
      conversionRateFromStart: 37.0,
      avgTimeSpentSeconds: 150,
    },
    {
      stageKey: "checkout_start",
      stageLabel: "۳. ورود به سبد خرید و تسویه",
      visitorCount: 39800,
      dropoffPercentage: 73.8,
      conversionRateFromStart: 9.7,
      avgTimeSpentSeconds: 115,
    },
    {
      stageKey: "paid_conversion",
      stageLabel: "۴. پرداخت موفق و ثبت‌نام قطعی",
      visitorCount: 18450,
      dropoffPercentage: 53.6,
      conversionRateFromStart: 4.5,
      avgTimeSpentSeconds: 70,
    },
  ],
  "1y": [
    {
      stageKey: "landing",
      stageLabel: "۱. ورود و بازدید صفحه اصلی",
      visitorCount: 1650000,
      dropoffPercentage: 0,
      conversionRateFromStart: 100,
      avgTimeSpentSeconds: 80,
    },
    {
      stageKey: "course_view",
      stageLabel: "۲. بررسی صفحه معرفی دوره‌ها",
      visitorCount: 610500,
      dropoffPercentage: 63.0,
      conversionRateFromStart: 37.0,
      avgTimeSpentSeconds: 148,
    },
    {
      stageKey: "checkout_start",
      stageLabel: "۳. ورود به سبد خرید و تسویه",
      visitorCount: 160000,
      dropoffPercentage: 73.8,
      conversionRateFromStart: 9.7,
      avgTimeSpentSeconds: 118,
    },
    {
      stageKey: "paid_conversion",
      stageLabel: "۴. پرداخت موفق و ثبت‌نام قطعی",
      visitorCount: 74200,
      dropoffPercentage: 53.6,
      conversionRateFromStart: 4.5,
      avgTimeSpentSeconds: 72,
    },
  ],
};

export const INITIAL_ACQUISITION_CHANNELS: AcquisitionChannelMetric[] = [
  {
    channelKey: "organic_search",
    channelLabel: "جستجوی ارگانیک گوگل (SEO)",
    visitors: 68400,
    checkoutStarts: 7800,
    paidCustomers: 3820,
    revenueToman: 4584000000,
    conversionRate: 5.58,
  },
  {
    channelKey: "instagram_social",
    channelLabel: "شبکه‌های اجتماعی (اینستاگرام / تلگرام)",
    visitors: 45200,
    checkoutStarts: 4200,
    paidCustomers: 1850,
    revenueToman: 2220000000,
    conversionRate: 4.09,
  },
  {
    channelKey: "direct_traffic",
    channelLabel: "ترافیک مستقیم و برند بوک‌مارک",
    visitors: 18900,
    checkoutStarts: 1720,
    paidCustomers: 810,
    revenueToman: 972000000,
    conversionRate: 4.28,
  },
  {
    channelKey: "affiliate_referral",
    channelLabel: "معرفین و همکاری در فروش (Affiliate)",
    visitors: 10000,
    checkoutStarts: 900,
    paidCustomers: 360,
    revenueToman: 432000000,
    conversionRate: 3.6,
  },
];

export const INITIAL_ABANDONED_CARTS: AbandonedCartItem[] = [
  {
    id: "cart-ab-001",
    userId: "usr-cart-sina",
    userName: "سینا شجاعی",
    userPhone: "09121112233",
    courseId: "ielts-academic-speaking-and-writing-mastery",
    courseTitle: "مسترکلاس اسپیکینگ و رایتینگ آکادمیک آیلتس",
    cartValueToman: 2400000,
    abandonedAt: "2026-11-15T10:15:00Z",
    hoursAgo: 6,
    recoveryStatus: "uncontacted",
  },
  {
    id: "cart-ab-002",
    userId: "usr-cart-niloufar",
    userName: "نیلوفر کیانی",
    userPhone: "09359876543",
    courseId: "konkur-english-vision-mastery",
    courseTitle: "پکیج جامع زبان کنکور و نهایی پایه دوازدهم",
    cartValueToman: 1850000,
    abandonedAt: "2026-11-15T07:30:00Z",
    hoursAgo: 9,
    recoveryStatus: "coupon_sent",
    discountCouponCode: "WINBACK-25-NILOU",
  },
  {
    id: "cart-ab-003",
    userId: "usr-cart-mohammad",
    userName: "محمد باقرپناه",
    userPhone: "09135554433",
    courseId: "foundations-of-spoken-fluency",
    courseTitle: "شالوده روانی مکالمه و حذف تردیدهای کلامی",
    cartValueToman: 1200000,
    abandonedAt: "2026-11-14T20:00:00Z",
    hoursAgo: 20,
    recoveryStatus: "uncontacted",
  },
  {
    id: "cart-ab-004",
    userId: "usr-cart-parisa",
    userName: "پریسا میرزایی",
    userPhone: "09194443322",
    courseId: "ielts-academic-speaking-and-writing-mastery",
    courseTitle: "مسترکلاس اسپیکینگ و رایتینگ آکادمیک آیلتس",
    cartValueToman: 2400000,
    abandonedAt: "2026-11-14T15:45:00Z",
    hoursAgo: 25,
    recoveryStatus: "recovered",
    discountCouponCode: "WINBACK-25-PARI",
  },
];

export const INITIAL_COHORTS_DATA: CohortMonthData[] = [
  {
    cohortMonth: "خرداد ۱۴۰۵",
    newLearnersCount: 1240,
    m1Retention: 78,
    m2Retention: 64,
    m3Retention: 55,
    m4Retention: 48,
    m5Retention: 44,
    m6Retention: 41,
  },
  {
    cohortMonth: "تیر ۱۴۰۵",
    newLearnersCount: 1580,
    m1Retention: 81,
    m2Retention: 68,
    m3Retention: 59,
    m4Retention: 52,
    m5Retention: 47,
    m6Retention: 0,
  },
  {
    cohortMonth: "مرداد ۱۴۰۵",
    newLearnersCount: 1820,
    m1Retention: 83,
    m2Retention: 71,
    m3Retention: 62,
    m4Retention: 56,
    m5Retention: 0,
    m6Retention: 0,
  },
  {
    cohortMonth: "شهریور ۱۴۰۵",
    newLearnersCount: 2450,
    m1Retention: 86,
    m2Retention: 74,
    m3Retention: 66,
    m4Retention: 0,
    m5Retention: 0,
    m6Retention: 0,
  },
  {
    cohortMonth: "مهر ۱۴۰۵",
    newLearnersCount: 2980,
    m1Retention: 89,
    m2Retention: 79,
    m3Retention: 0,
    m4Retention: 0,
    m5Retention: 0,
    m6Retention: 0,
  },
  {
    cohortMonth: "آبان ۱۴۰۵ (جاری)",
    newLearnersCount: 3120,
    m1Retention: 91,
    m2Retention: 0,
    m3Retention: 0,
    m4Retention: 0,
    m5Retention: 0,
    m6Retention: 0,
  },
];

export const INITIAL_AT_RISK_LEARNERS: AtRiskLearner[] = [
  {
    userId: "usr-risk-001",
    userName: "آرش افخمی",
    userEmail: "arash.afkhami@gmail.com",
    courseTitle: "مسترکلاس اسپیکینگ و رایتینگ آکادمیک آیلتس",
    daysInactive: 12,
    progressPercentage: 24,
    lastLessonCompleted: "درس ۴: ساختارهای گرامری پیشرفته رایتینگ تسک ۲",
    churnRiskScore: 88,
    nudgeSent: false,
  },
  {
    userId: "usr-risk-002",
    userName: "مهسا قنبری",
    userEmail: "m.ghanbari@yahoo.com",
    courseTitle: "پکیج جامع زبان کنکور و نهایی پایه دوازدهم",
    daysInactive: 9,
    progressPercentage: 42,
    lastLessonCompleted: "درس ۷: حل تست‌های لغت ریدینگ کنکور تجربی",
    churnRiskScore: 76,
    nudgeSent: false,
  },
  {
    userId: "usr-risk-003",
    userName: "کیوان کاظمی",
    userEmail: "k.kazemi@outlook.com",
    courseTitle: "شالوده روانی مکالمه و حذف تردیدهای کلامی",
    daysInactive: 15,
    progressPercentage: 15,
    lastLessonCompleted: "درس ۲: متدهای تکنیک سایه (Shadowing)",
    churnRiskScore: 94,
    nudgeSent: true,
  },
];

export const INITIAL_COURSE_ECONOMICS: CourseUnitEconomic[] = [
  {
    courseId: "ielts-academic-speaking-and-writing-mastery",
    courseTitle: "مسترکلاس اسپیکینگ و رایتینگ آکادمیک آیلتس",
    teacherName: "دکتر مسعود رضایی (ممتحن بین‌المللی)",
    category: "IELTS & TOEFL",
    priceToman: 2400000,
    totalEnrolled: 1850,
    grossRevenueToman: 4440000000,
    platformNetCommissionToman: 888000000,
    completionRate: 74.5,
    refundRate: 1.8,
    averageRating: 4.85,
    healthStatus: "excellent",
  },
  {
    courseId: "konkur-english-vision-mastery",
    courseTitle: "پکیج جامع زبان کنکور و نهایی پایه دوازدهم (ویژن)",
    teacherName: "استاد سارا رادمنش",
    category: "High School & Konkur",
    priceToman: 1850000,
    totalEnrolled: 2420,
    grossRevenueToman: 4477000000,
    platformNetCommissionToman: 1119250000,
    completionRate: 68.2,
    refundRate: 2.1,
    averageRating: 4.72,
    healthStatus: "excellent",
  },
  {
    courseId: "foundations-of-spoken-fluency",
    courseTitle: "شالوده روانی مکالمه و حذف تردیدهای کلامی (Speaking Gym)",
    teacherName: "استاد کیانوش شمس",
    category: "General English",
    priceToman: 1200000,
    totalEnrolled: 1180,
    grossRevenueToman: 1416000000,
    platformNetCommissionToman: 354000000,
    completionRate: 59.0,
    refundRate: 3.4,
    averageRating: 4.58,
    healthStatus: "healthy",
  },
  {
    courseId: "cefr-c1-advanced-idioms",
    courseTitle: "اصطلاحات پیشرفته و تعابیر بومی سطح C1",
    teacherName: "استاد مریم صبوری",
    category: "Advanced Idioms",
    priceToman: 980000,
    totalEnrolled: 420,
    grossRevenueToman: 411600000,
    platformNetCommissionToman: 102900000,
    completionRate: 41.2,
    refundRate: 7.2,
    averageRating: 4.1,
    healthStatus: "needs_attention",
  },
];

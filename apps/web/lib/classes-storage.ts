export type CohortCategory =
  | "ielts"
  | "fluency"
  | "starter"
  | "business"
  | "highschool"
  | "phonetics"
  | "debate";

export type CohortFormat = "group" | "solo";

export type CohortLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "All";

export interface TeacherInfo {
  id: string;
  nameFa: string;
  nameEn: string;
  titleFa: string;
  avatarUrl?: string;
  rating: number;
  verified: boolean;
  experienceYears: number;
}

export interface LiveClassCohort {
  id: string;
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  category: CohortCategory;
  categoryLabelFa: string;
  levelRequired: CohortLevel;
  levelBadgeFa: string;
  format: CohortFormat;
  formatLabelFa: string;
  teacher: TeacherInfo;
  scheduleDays: string[];
  scheduleTime: string;
  startDateFa: string;
  totalSessions: number;
  sessionDurationMinutes: number;
  maxCapacity: number;
  enrolledCount: number;
  priceToman: number;
  status: "enrolling" | "full" | "started";
  bookingId: string;
  prerequisiteNoteFa: string;
}

export interface EnrolledClassRecord {
  enrollmentId: string;
  cohortId: string;
  cohortTitleFa: string;
  enrolledAt: string;
  teacherNameFa: string;
  scheduleDays: string[];
  scheduleTime: string;
  studentNotes?: string;
  bookingId: string;
  nextSessionTextFa: string;
}

const STORAGE_KEY = "endoora_live_cohorts_v1";
const ENROLLED_KEY = "endoora_enrolled_classes_v1";
const PLACEMENT_KEY = "endoora_placement_v1";

export const INITIAL_COHORTS: LiveClassCohort[] = [
  {
    id: "cohort-ielts-speaking-1",
    titleFa: "مسترکلاس اسپیکینگ آیلتس (هدف: نمره ۷.۵ و ۸)",
    titleEn: "IELTS Speaking 7.5+ Masterclass",
    descriptionFa:
      "تمرین فشرده پارت‌های ۱ تا ۳ با فرمول زمانی PPF، کالبدشکافی تله‌های تلفظ فارسی و شبیه‌سازی اتاق اگزمینر در استودیوی ایندورا.",
    category: "ielts",
    categoryLabelFa: "آمادگی آزمون آیلتس",
    levelRequired: "B2",
    levelBadgeFa: "سطح B2 به بالا",
    format: "group",
    formatLabelFa: "کلاس گروهی (حداکثر ۴ نفر)",
    teacher: {
      id: "t-rezaei",
      nameFa: "استاد کاوه رضایی",
      nameEn: "Kaveh Rezaei",
      titleFa: "دارنده مدرک DELTA کمبریج و اگزمینر ماک‌تست آیلتس",
      rating: 4.9,
      verified: true,
      experienceYears: 12,
    },
    scheduleDays: ["دوشنبه", "چهارشنبه"],
    scheduleTime: "۱۹:۰۰ تا ۲۰:۳۰",
    startDateFa: "شنبه آینده",
    totalSessions: 12,
    sessionDurationMinutes: 90,
    maxCapacity: 4,
    enrolledCount: 2,
    priceToman: 1850000,
    status: "enrolling",
    bookingId: "booking-cohort-ielts-spk",
    prerequisiteNoteFa: "نیازمند تعیین سطح B2 به بالا برای تضمین کیفیت بحث و هماهنگی همکلاسی‌ها.",
  },
  {
    id: "cohort-fluency-slang-2",
    titleFa: "کارگاه مکالمه روان، اصطلاحات روز و اسلنگ‌های خیابانی",
    titleEn: "Everyday English Fluency & Street Slang",
    descriptionFa:
      "شکستن سد روانی صحبت کردن، اصطلاحات محاوره‌ای بومی، کاهش توقف‌های ناخواسته و تمرین بداهه‌گویی در سناریوهای واقعی شهری.",
    category: "fluency",
    categoryLabelFa: "مکالمه روان و کاربردی",
    levelRequired: "B1",
    levelBadgeFa: "سطح B1 متوسطه",
    format: "group",
    formatLabelFa: "کلاس گروهی (حداکثر ۴ نفر)",
    teacher: {
      id: "t-tehrani",
      nameFa: "استاد نیما تهرانی",
      nameEn: "Nima Tehrani",
      titleFa: "مدرس ارشد دوره‌های فلوئنسی و اصطلاحات فیلم و سریال",
      rating: 4.8,
      verified: true,
      experienceYears: 9,
    },
    scheduleDays: ["شنبه", "سه‌شنبه"],
    scheduleTime: "۱۸:۰۰ تا ۱۹:۳۰",
    startDateFa: "از اول هفته آینده",
    totalSessions: 10,
    sessionDurationMinutes: 90,
    maxCapacity: 4,
    enrolledCount: 3,
    priceToman: 1450000,
    status: "enrolling",
    bookingId: "booking-cohort-fluency-street",
    prerequisiteNoteFa: "مناسب برای زبان‌آموزان با سطح B1 که دایره لغات دارند اما در مکالمه پیوسته مکث می‌کنند.",
  },
  {
    id: "cohort-starter-a1-3",
    titleFa: "شروع قدرتمند از صفر: دوره مقدماتی A1 تا A2",
    titleEn: "English from Scratch: A1-A2 Starter Cohort",
    descriptionFa:
      "برای کسانی که می‌خواهند از پایه الفبا، جمله‌سازی حال و گذشته، اعداد، ساعت و مکالمات ضروری روزمره را به شکل اصولی یاد بگیرند.",
    category: "starter",
    categoryLabelFa: "مقدماتی و پایه",
    levelRequired: "A1",
    levelBadgeFa: "سطح A1 (مقدماتی / صفر)",
    format: "group",
    formatLabelFa: "کلاس گروهی (حداکثر ۴ نفر)",
    teacher: {
      id: "t-moradi",
      nameFa: "استاد سارا مرادی",
      nameEn: "Sara Moradi",
      titleFa: "متخصص آموزش پایه‌ای با متدولوژی بدون استرس",
      rating: 4.95,
      verified: true,
      experienceYears: 8,
    },
    scheduleDays: ["یکشنبه", "سه‌شنبه"],
    scheduleTime: "۱۷:۰۰ تا ۱۸:۳۰",
    startDateFa: "یکشنبه هفته بعد",
    totalSessions: 12,
    sessionDurationMinutes: 90,
    maxCapacity: 4,
    enrolledCount: 1,
    priceToman: 1250000,
    status: "enrolling",
    bookingId: "booking-cohort-starter-a1",
    prerequisiteNoteFa: "مناسب برای مبتدیان و بدون نیاز به پیش‌نیاز قبلی.",
  },
  {
    id: "cohort-business-english-4",
    titleFa: "انگلیسی حرفه‌ای کسب‌وکار، مذاکره و مکاتبات بین‌المللی",
    titleEn: "Business English & Global Negotiations",
    descriptionFa:
      "شبیه‌سازی جلسات کاری، تکنیک‌های ایمیل‌نگاری تجاری، پرزنت حرفه‌ای محصول و اصول مذاکرات قراردادهای بین‌المللی.",
    category: "business",
    categoryLabelFa: "انگلیسی کسب‌وکار",
    levelRequired: "B2",
    levelBadgeFa: "سطح B2 به بالا",
    format: "solo",
    formatLabelFa: "کلاس خصوصی ۱ به ۱",
    teacher: {
      id: "t-karimi",
      nameFa: "دکتر فرزاد کریمی",
      nameEn: "Farzad Karimi",
      titleFa: "مشاور مکاتبات بین‌المللی شرکت‌های فناوری و مدرس زبان تخصصی",
      rating: 4.9,
      verified: true,
      experienceYears: 15,
    },
    scheduleDays: ["پنج‌شنبه", "جمعه"],
    scheduleTime: "۱۰:۰۰ تا ۱۱:۳۰",
    startDateFa: "هماهنگی اختصاصی با دانش‌پذیر",
    totalSessions: 8,
    sessionDurationMinutes: 90,
    maxCapacity: 1,
    enrolledCount: 0,
    priceToman: 2200000,
    status: "enrolling",
    bookingId: "booking-cohort-business-vip",
    prerequisiteNoteFa: "سطح پیشنهادی B2 به بالا جهت شرکت در مباحث تخصصی تجاری.",
  },
  {
    id: "cohort-ielts-writing-5",
    titleFa: "ورکشاپ رایتینگ آیلتس (تسک ۱ و ۲ آکادمیک)",
    titleEn: "IELTS Academic Writing Tasks 1 & 2 Workshop",
    descriptionFa:
      "تکنیک‌های نوشتن Overview تحلیلی، استدلال‌سازی منطقی در Task 2، رفع خطاهای گرامری Comma Splice و تصحیح مداوم انشاها.",
    category: "ielts",
    categoryLabelFa: "آمادگی آزمون آیلتس",
    levelRequired: "B2",
    levelBadgeFa: "سطح B2 به بالا",
    format: "group",
    formatLabelFa: "کلاس گروهی (حداکثر ۴ نفر)",
    teacher: {
      id: "t-rezaei",
      nameFa: "استاد کاوه رضایی",
      nameEn: "Kaveh Rezaei",
      titleFa: "دارنده مدرک DELTA کمبریج و اگزمینر ماک‌تست آیلتس",
      rating: 4.9,
      verified: true,
      experienceYears: 12,
    },
    scheduleDays: ["دوشنبه", "چهارشنبه"],
    scheduleTime: "۲۰:۳۰ تا ۲۲:۰۰",
    startDateFa: "دوشنبه هفته آینده",
    totalSessions: 10,
    sessionDurationMinutes: 90,
    maxCapacity: 4,
    enrolledCount: 4,
    priceToman: 1950000,
    status: "full",
    bookingId: "booking-cohort-ielts-wrt",
    prerequisiteNoteFa: "ظرفیت این دوره تکمیل شده است؛ رزرو در لیست انتظار فعال است.",
  },
  {
    id: "cohort-phonology-accent-6",
    titleFa: "کلینیک تلفظ طبیعی، لهجه و تکیه هجایی (Phonology Lab)",
    titleEn: "Persian Accent Reduction & Phonology Lab",
    descriptionFa:
      "کالبدشکافی خطاهای آوایی فارسی‌زبانان (تمایز w و v، حذف کسره در es-school، و آهنگ سقوطی جملات اخباری انگلیسی).",
    category: "phonetics",
    categoryLabelFa: "تلفظ و لهجه بومی",
    levelRequired: "All",
    levelBadgeFa: "تمام سطوح (A2 تا C1)",
    format: "group",
    formatLabelFa: "کلاس گروهی (حداکثر ۴ نفر)",
    teacher: {
      id: "t-tehrani",
      nameFa: "استاد نیما تهرانی",
      nameEn: "Nima Tehrani",
      titleFa: "مدرس ارشد دوره‌های فلوئنسی و فونتیک زبان انگلیسی",
      rating: 4.8,
      verified: true,
      experienceYears: 9,
    },
    scheduleDays: ["جمعه‌ها"],
    scheduleTime: "۱۶:۰۰ تا ۱۸:۰۰",
    startDateFa: "جمعه آینده",
    totalSessions: 6,
    sessionDurationMinutes: 120,
    maxCapacity: 4,
    enrolledCount: 2,
    priceToman: 950000,
    status: "enrolling",
    bookingId: "booking-cohort-phonology-lab",
    prerequisiteNoteFa: "مناسب برای تمام کسانی که می‌خواهند لحن صحبت و لهجه بومی انگلیسی‌شان طبیعی‌تر شنیده شود.",
  },
  {
    id: "cohort-tamrin20-grade12-7",
    titleFa: "کلاس آنلاین امتحان نهایی زبان دوازدهم (تمرین تا ۲۰)",
    titleEn: "High School Grade 12 Final Exam Prep",
    descriptionFa:
      "مرور سوالات نهایی خرداد، تکنیک‌های پاسخ به ریدینگ، گرامر درس ۱ تا ۳ زبان دوازدهم و حل تست‌های نهایی در وایت‌برد تعاملی.",
    category: "highschool",
    categoryLabelFa: "امتحان نهایی دبیرستان",
    levelRequired: "All",
    levelBadgeFa: "دانش‌آموزان پایه دوازدهم",
    format: "group",
    formatLabelFa: "کلاس گروهی (حداکثر ۴ نفر)",
    teacher: {
      id: "t-alavi",
      nameFa: "استاد مریم علوی",
      nameEn: "Maryam Alavi",
      titleFa: "مدرس مدارس برتر و مولف سوالات مفهومی نهایی کشوری",
      rating: 4.9,
      verified: true,
      experienceYears: 10,
    },
    scheduleDays: ["یکشنبه", "سه‌شنبه"],
    scheduleTime: "۱۹:۳۰ تا ۲۱:۰۰",
    startDateFa: "از هفته آینده",
    totalSessions: 8,
    sessionDurationMinutes: 90,
    maxCapacity: 4,
    enrolledCount: 3,
    priceToman: 890000,
    status: "enrolling",
    bookingId: "booking-cohort-tamrin20-g12",
    prerequisiteNoteFa: "ویژه دانش‌آموزان دوازدهم تجربی، ریاضی و انسانی جهت کسب نمره ۲۰ کتبی نهایی.",
  },
  {
    id: "cohort-debate-club-8",
    titleFa: "کلوب بحث آزاد پیرامون هوش مصنوعی و موضوعات جهانی",
    titleEn: "Global Issues & AI Debate Club",
    descriptionFa:
      "مناظره هدایت‌شده درباره داغ‌ترین موضوعات علمی، روانشناسی و فلسفی دنیا با تمرکز بر استفاده از واژگان آکادمیک سطح پیشرفته.",
    category: "debate",
    categoryLabelFa: "کلوب بحث آزاد (Debate)",
    levelRequired: "B2",
    levelBadgeFa: "سطح B2 تا C1",
    format: "group",
    formatLabelFa: "کلاس گروهی (حداکثر ۴ نفر)",
    teacher: {
      id: "t-moradi",
      nameFa: "استاد سارا مرادی",
      nameEn: "Sara Moradi",
      titleFa: "متخصص تدریس مکالمه تحلیلی و کلوپ‌های گفتگوی آزاد",
      rating: 4.95,
      verified: true,
      experienceYears: 8,
    },
    scheduleDays: ["پنج‌شنبه‌ها"],
    scheduleTime: "۱۸:۰۰ تا ۲۰:۰۰",
    startDateFa: "پنج‌شنبه هفته جاری",
    totalSessions: 6,
    sessionDurationMinutes: 120,
    maxCapacity: 4,
    enrolledCount: 2,
    priceToman: 990000,
    status: "enrolling",
    bookingId: "booking-cohort-debate-club",
    prerequisiteNoteFa: "نیازمند توانایی استدلال به زبان انگلیسی بدون گیر کردن در کلمات روزمره.",
  },
];

export function getLiveCohorts(): LiveClassCohort[] {
  if (typeof window === "undefined") {
    return INITIAL_COHORTS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COHORTS));
    return INITIAL_COHORTS;
  } catch {
    return INITIAL_COHORTS;
  }
}

export function saveLiveCohorts(cohorts: LiveClassCohort[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cohorts));
  } catch (err) {
    console.error("Failed to save live cohorts:", err);
  }
}

export function getEnrolledCohorts(): EnrolledClassRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ENROLLED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEnrolledCohorts(records: EnrolledClassRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ENROLLED_KEY, JSON.stringify(records));
  } catch (err) {
    console.error("Failed to save enrolled classes:", err);
  }
}

export function getUserPlacementLevel(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PLACEMENT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data.estimatedLevel || data.cefr_level || data.level || null;
  } catch {
    return null;
  }
}

export function verifyPlacementRequirement(
  cohortLevel: CohortLevel,
  userLevel: string | null
): { allowed: boolean; reason?: "unplaced" | "level_too_low"; currentLevel?: string; requiredLevel: CohortLevel } {
  if (cohortLevel === "All") {
    return { allowed: true, requiredLevel: cohortLevel };
  }

  if (!userLevel) {
    return {
      allowed: false,
      reason: "unplaced",
      requiredLevel: cohortLevel,
    };
  }

  const levelHierarchy: Record<string, number> = {
    A1: 1,
    A2: 2,
    B1: 3,
    B2: 4,
    C1: 5,
    C2: 6,
  };

  const userRank = levelHierarchy[userLevel.toUpperCase().trim()] || 1;
  const cohortRank = levelHierarchy[cohortLevel] || 1;

  if (userRank < cohortRank) {
    return {
      allowed: false,
      reason: "level_too_low",
      currentLevel: userLevel.toUpperCase(),
      requiredLevel: cohortLevel,
    };
  }

  return { allowed: true, requiredLevel: cohortLevel };
}

export function enrollInCohort(
  cohortId: string,
  studentNotes?: string
): { success: boolean; record?: EnrolledClassRecord; error?: string } {
  const cohorts = getLiveCohorts();
  const index = cohorts.findIndex((c) => c.id === cohortId);
  if (index < 0) {
    return { success: false, error: "کلاس مورد نظر یافت نشد." };
  }

  const cohort = cohorts[index];
  if (cohort.enrolledCount >= cohort.maxCapacity) {
    return { success: false, error: "متاسفانه ظرفیت این کلاس تکمیل شده است." };
  }

  // Update cohort capacity
  const updatedCohort: LiveClassCohort = {
    ...cohort,
    enrolledCount: cohort.enrolledCount + 1,
    status: cohort.enrolledCount + 1 >= cohort.maxCapacity ? "full" : "enrolling",
  };
  cohorts[index] = updatedCohort;
  saveLiveCohorts(cohorts);

  // Create enrollment record
  const record: EnrolledClassRecord = {
    enrollmentId: `enr-${Date.now()}`,
    cohortId: cohort.id,
    cohortTitleFa: cohort.titleFa,
    enrolledAt: new Date().toISOString(),
    teacherNameFa: cohort.teacher.nameFa,
    scheduleDays: cohort.scheduleDays,
    scheduleTime: cohort.scheduleTime,
    studentNotes: studentNotes?.trim(),
    bookingId: cohort.bookingId,
    nextSessionTextFa: `${cohort.scheduleDays[0]} آینده ساعت ${cohort.scheduleTime.split("تا")[0].trim()}`,
  };

  const currentEnrolled = getEnrolledCohorts();
  currentEnrolled.unshift(record);
  saveEnrolledCohorts(currentEnrolled);

  return { success: true, record };
}

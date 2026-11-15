export type TeacherPayoutStatus = "pending" | "processing" | "completed" | "rejected";

export type EscrowStatus = "held" | "disputed" | "released" | "refunded" | "split";

export interface TeacherPayoutRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  teacherPhone: string;
  verifiedTeacherName: string;
  amountToman: number;
  bankShabaNumber: string;
  bankName: string;
  accountHolderName: string;
  status: TeacherPayoutStatus;
  adminNotes: string;
  rejectionReason: string;
  bankTrackingCode: string;
  disbursedAt?: string;
  disbursedBy?: string;
  createdAt: string;
}

export interface EscrowRecord {
  id: string;
  bookingId: string;
  sessionTopic: string;
  learnerId: string;
  learnerName: string;
  teacherId: string;
  teacherName: string;
  totalAmountToman: number;
  commissionAmountToman: number;
  teacherNetToman: number;
  status: EscrowStatus;
  heldAt: string;
  sessionDate: string;
  disputeReason?: string;
  arbitrationVerdict?: string;
  arbitratedAt?: string;
  arbitratedBy?: string;
  splitLearnerAmountToman?: number;
  splitTeacherAmountToman?: number;
}

export interface ProductRevenueBreakdown {
  productType: "session_1on1" | "course_package" | "trial_session" | "group_class";
  labelFa: string;
  grossAmountToman: number;
  commissionAmountToman: number;
  transactionsCount: number;
}

export interface TreasuryStats {
  totalGrossVolumeToman: number;
  totalPlatformCommissionToman: number;
  pendingPayoutsToman: number;
  pendingPayoutsCount: number;
  activeEscrowFloatToman: number;
  activeEscrowFloatCount: number;
  disputedEscrowCount: number;
  completedDisbursementsThisMonthToman: number;
  revenueBreakdown: ProductRevenueBreakdown[];
}

export const IRANIAN_BANKS_CODE_MAP: Record<string, string> = {
  "010": "بانک مرکزی",
  "011": "بانک صنعت و معدن",
  "012": "بانک ملت",
  "013": "بانک رفاه کارگران",
  "014": "بانک مسکن",
  "015": "بانک سپه",
  "016": "بانک کشاورزی",
  "017": "بانک ملی ایران",
  "018": "بانک تجارت",
  "019": "بانک صادرات ایران",
  "020": "بانک توسعه صادرات",
  "021": "پست بانک ایران",
  "022": "بانک توسعه تعاون",
  "051": "موسسه اعتباری توسعه",
  "053": "بانک کارآفرین",
  "054": "بانک پارسیان",
  "055": "بانک اقتصاد نوین",
  "056": "بانک سامان",
  "057": "بانک پاسارگاد",
  "058": "بانک سرمایه",
  "059": "بانک سینا",
  "060": "قرض الحسنه مهر ایران",
  "061": "بانک شهر",
  "062": "بانک آینده",
  "064": "بانک گردشگری",
  "065": "بانک حکمت ایرانیان",
  "066": "بانک دی",
  "069": "بانک ایران زمین",
  "070": "قرض الحسنه رسالت",
  "078": "بانک خاورمیانه",
};

export function validateIranianSheba(rawSheba: string): {
  isValid: boolean;
  bankName: string;
  bankCode: string;
  formatted: string;
  error?: string;
} {
  const cleaned = rawSheba.replace(/\s+/g, "").toUpperCase();

  if (!cleaned.startsWith("IR")) {
    return {
      isValid: false,
      bankName: "نامشخص",
      bankCode: "",
      formatted: cleaned,
      error: "شماره شبا باید با حروف IR آغاز شود.",
    };
  }

  if (cleaned.length !== 26) {
    return {
      isValid: false,
      bankName: "نامشخص",
      bankCode: "",
      formatted: cleaned,
      error: `طول شماره شبا باید ۲۶ کاراکتر باشد (در حال حاضر: ${cleaned.length} کاراکتر).`,
    };
  }

  // Extract 3-digit bank identifier (characters at index 4 to 6 in ISO format, or 2 to 4 after IR + 2 check digits)
  // In Iranian Sheba: IR [2 check digits] [3 bank code digits] ...
  const bankCode = cleaned.substring(4, 7);
  const bankName = IRANIAN_BANKS_CODE_MAP[bankCode] || "بانک مجاز شبکه شتاب";

  // Check digits validation (ISO 7064 Mod 97-10 check)
  const rearranged = cleaned.substring(4) + "1827" + cleaned.substring(2, 4);
  let remainder = 0;
  for (let i = 0; i < rearranged.length; i++) {
    remainder = (remainder * 10 + parseInt(rearranged[i], 10)) % 97;
  }

  if (remainder !== 1) {
    return {
      isValid: false,
      bankName,
      bankCode,
      formatted: cleaned,
      error: "کد کنترلی و ساختار ارقام شبا بر اساس الگوریتم بانکی نامعتبر است.",
    };
  }

  const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim();

  return {
    isValid: true,
    bankName,
    bankCode,
    formatted,
  };
}

export const INITIAL_PAYOUT_REQUESTS: TeacherPayoutRecord[] = [
  {
    id: "payout-001",
    teacherId: "usr-003",
    teacherName: "استاد پویا صامتی",
    teacherEmail: "pouya.sameti@gmail.com",
    teacherPhone: "09351234567",
    verifiedTeacherName: "پویا صامتی",
    amountToman: 4200000,
    bankShabaNumber: "IR160120000000001234567890",
    bankName: "بانک ملت",
    accountHolderName: "پویا صامتی",
    status: "pending",
    adminNotes: "تسویه حق‌التدریس ۷ جلسه کلاس خصوصی آیلتس آبان‌ماه",
    rejectionReason: "",
    bankTrackingCode: "",
    createdAt: "2026-11-13T10:15:00Z",
  },
  {
    id: "payout-002",
    teacherId: "usr-002",
    teacherName: "دکتر سارا شریفی",
    teacherEmail: "sara.sharifi@endoora.ir",
    teacherPhone: "09123456789",
    verifiedTeacherName: "سارا شریفی",
    amountToman: 8500000,
    bankShabaNumber: "IR010560000000009876543210",
    bankName: "بانک سامان",
    accountHolderName: "سارا شریفی",
    status: "processing",
    adminNotes: "درخواست تایید شده و به صف ارسال حواله ساتنا منتقل گردید.",
    rejectionReason: "",
    bankTrackingCode: "",
    createdAt: "2026-11-12T16:40:00Z",
  },
  {
    id: "payout-003",
    teacherId: "usr-007",
    teacherName: "مهندس آرش شایگان",
    teacherEmail: "arash.shaygan@gmail.com",
    teacherPhone: "09127894561",
    verifiedTeacherName: "آرش شایگان",
    amountToman: 2800000,
    bankShabaNumber: "IR920570000000005544332211",
    bankName: "بانک پاسارگاد",
    accountHolderName: "کامبیز شایگان (پدر)",
    status: "pending",
    adminNotes: "هشدار: نام دارنده شماره شبا با نام تاییدشده مدرس مغایرت دارد.",
    rejectionReason: "",
    bankTrackingCode: "",
    createdAt: "2026-11-14T09:20:00Z",
  },
  {
    id: "payout-004",
    teacherId: "t-rezaei",
    teacherName: "استاد کاوه رضایی",
    teacherEmail: "kaveh.rezaei@endoora.ir",
    teacherPhone: "09121115599",
    verifiedTeacherName: "کاوه رضایی",
    amountToman: 14500000,
    bankShabaNumber: "IR750170000000008877665544",
    bankName: "بانک ملی ایران",
    accountHolderName: "کاوه رضایی",
    status: "completed",
    adminNotes: "تسویه کامل جلسات مهر و آبان‌ماه",
    rejectionReason: "",
    bankTrackingCode: "SATNA-20261111-99882104",
    disbursedAt: "2026-11-11T14:30:00Z",
    disbursedBy: "مدیر ارشد خزانه‌داری ایندورا",
    createdAt: "2026-11-10T11:00:00Z",
  },
  {
    id: "payout-005",
    teacherId: "t-tehrani",
    teacherName: "دکتر لیلا تهرانی",
    teacherEmail: "leila.tehrani@gmail.com",
    teacherPhone: "09123337788",
    verifiedTeacherName: "لیلا تهرانی",
    amountToman: 6400000,
    bankShabaNumber: "IR340180000000003322114455",
    bankName: "بانک تجارت",
    accountHolderName: "لیلا تهرانی",
    status: "completed",
    adminNotes: "واریز موفق پایا",
    rejectionReason: "",
    bankTrackingCode: "PAYA-20261108-77441209",
    disbursedAt: "2026-11-08T18:15:00Z",
    disbursedBy: "مدیر مالی ایندورا",
    createdAt: "2026-11-07T12:00:00Z",
  },
];

export const INITIAL_ESCROW_RECORDS: EscrowRecord[] = [
  {
    id: "escrow-001",
    bookingId: "bk-901",
    sessionTopic: "جلسه تخصصی رفع اشکال ریدینگ آیلتس (تسک ۳)",
    learnerId: "usr-004",
    learnerName: "علی رضایی",
    teacherId: "t-rezaei",
    teacherName: "استاد کاوه رضایی",
    totalAmountToman: 380000,
    commissionAmountToman: 57000,
    teacherNetToman: 323000,
    status: "held",
    heldAt: "2026-11-14T10:00:00Z",
    sessionDate: "2026-11-15T16:00:00Z",
  },
  {
    id: "escrow-002",
    bookingId: "bk-902",
    sessionTopic: "تمرین لهجه و استرس کلمات A2",
    learnerId: "usr-005",
    learnerName: "مریم احمدی",
    teacherId: "t-moradi",
    teacherName: "استاد سامان مرادی",
    totalAmountToman: 240000,
    commissionAmountToman: 36000,
    teacherNetToman: 204000,
    status: "disputed",
    heldAt: "2026-11-12T14:00:00Z",
    sessionDate: "2026-11-13T17:00:00Z",
    disputeReason: "زبان‌آموز گزارش داده که به دلیل قطعی مکرر اینترنت استاد، تنها ۱۰ دقیقه از جلسه برگزار شد.",
  },
  {
    id: "escrow-003",
    bookingId: "bk-903",
    sessionTopic: "کوچینگ تکنیک‌های اسپیکینگ و اعتماد به نفس",
    learnerId: "usr-004",
    learnerName: "علی رضایی",
    teacherId: "t-tehrani",
    teacherName: "دکتر لیلا تهرانی",
    totalAmountToman: 420000,
    commissionAmountToman: 42000,
    teacherNetToman: 378000,
    status: "released",
    heldAt: "2026-11-09T09:00:00Z",
    sessionDate: "2026-11-10T14:30:00Z",
    arbitrationVerdict: "جلسه با موفقیت کامل برگزار شد و هر دو طرف رضایت کامل را اعلام نمودند.",
    arbitratedAt: "2026-11-10T15:30:00Z",
    arbitratedBy: "سیستم خودکار پس از پایان کلاس",
  },
  {
    id: "escrow-004",
    bookingId: "bk-904",
    sessionTopic: "تحلیل خط‌به‌خط ساختار ریدینگ آزمون نهایی",
    learnerId: "usr-007",
    learnerName: "کاربر تستی دارای اخطار",
    teacherId: "t-rezaei",
    teacherName: "استاد کاوه رضایی",
    totalAmountToman: 380000,
    commissionAmountToman: 57000,
    teacherNetToman: 323000,
    status: "refunded",
    heldAt: "2026-11-05T12:00:00Z",
    sessionDate: "2026-11-06T10:00:00Z",
    disputeReason: "غیبت بدون اطلاع قبلی استاد کاوه رضایی به دلیل شرایط اضطراری پزشکی.",
    arbitrationVerdict: "استرداد ۱۰۰٪ وجه به کیف‌پول زبان‌آموز به دلیل غیبت تاییدشده مدرس.",
    arbitratedAt: "2026-11-06T12:00:00Z",
    arbitratedBy: "مدیر پشتیبانی ایندورا",
  },
];

export const INITIAL_REVENUE_STATS: TreasuryStats = {
  totalGrossVolumeToman: 182400000,
  totalPlatformCommissionToman: 34650000,
  pendingPayoutsToman: 15500000,
  pendingPayoutsCount: 3,
  activeEscrowFloatToman: 620000,
  activeEscrowFloatCount: 2,
  disputedEscrowCount: 1,
  completedDisbursementsThisMonthToman: 20900000,
  revenueBreakdown: [
    {
      productType: "session_1on1",
      labelFa: "کلاس‌های خصوصی ۱-به-۱",
      grossAmountToman: 112000000,
      commissionAmountToman: 20160000,
      transactionsCount: 320,
    },
    {
      productType: "course_package",
      labelFa: "دوره‌ها و پکیج‌های آموزشی (تمرین تا ۲۰ و آیلتس)",
      grossAmountToman: 54000000,
      commissionAmountToman: 10800000,
      transactionsCount: 145,
    },
    {
      productType: "trial_session",
      labelFa: "جلسات آزمایشی و ارزیابی اولیه",
      grossAmountToman: 16400000,
      commissionAmountToman: 3690000,
      transactionsCount: 88,
    },
  ],
};

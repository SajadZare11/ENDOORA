export type CommissionTierKey = "bronze" | "silver" | "gold" | "diamond";
export type ContractType = "teaching_agreement" | "content_ip_assignment" | "nda_confidentiality";
export type ContractStatus = "draft" | "pending_signature" | "active_signed" | "expired" | "terminated";

export interface CommissionTierConfig {
  key: CommissionTierKey;
  name: string;
  teacherSharePercent: number;
  platformSharePercent: number;
  minTeachingHours: number;
  minCourseSales: number;
  minRating: number;
  badgeColor: string;
}

export interface TeacherCommissionProfile {
  teacherId: string;
  teacherName: string;
  nationalId: string;
  phone: string;
  currentTier: CommissionTierKey;
  effectiveCommissionPercent: number; // e.g. 70, 75, 80, 85 or custom override like 82
  isCustomOverride: boolean;
  customOverrideReason?: string;
  totalTeachingHours: number;
  totalCourseSales: number;
  averageRating: number;
  activeContractId?: string;
  hasSignedActiveContract: boolean;
  isLegalHoldActive: boolean;
  legalHoldReason?: string;
  withholdingTaxPercent: number;
}

export interface TeacherContractItem {
  id: string;
  teacherId: string;
  teacherName: string;
  contractType: ContractType;
  contractTitle: string;
  version: string;
  status: ContractStatus;
  termsSummary: string;
  teacherCommissionPercent: number;
  createdAt: string;
  signedAt?: string;
  expiresAt?: string;
  digitalSignature?: {
    signerPhone: string;
    otpTrackingCode: string;
    signerIp: string;
    nationalIdHash: string;
  };
}

export interface TeacherContractsStats {
  totalTeachersUnderContract: number;
  activeContractsCount: number;
  pendingSignaturesCount: number;
  activeLegalHoldsCount: number;
  diamondTierCount: number;
  avgTeacherCommissionPercent: number;
}

export const INITIAL_COMMISSION_TIERS: CommissionTierConfig[] = [
  {
    key: "bronze",
    name: "برنزی (پایه)",
    teacherSharePercent: 70,
    platformSharePercent: 30,
    minTeachingHours: 0,
    minCourseSales: 0,
    minRating: 0,
    badgeColor: "#cd7f32",
  },
  {
    key: "silver",
    name: "نقره‌ای (رشد)",
    teacherSharePercent: 75,
    platformSharePercent: 25,
    minTeachingHours: 50,
    minCourseSales: 100,
    minRating: 4.5,
    badgeColor: "#94a3b8",
  },
  {
    key: "gold",
    name: "طلایی (حرفه‌ای)",
    teacherSharePercent: 80,
    platformSharePercent: 20,
    minTeachingHours: 200,
    minCourseSales: 500,
    minRating: 4.7,
    badgeColor: "#eab308",
  },
  {
    key: "diamond",
    name: "الماسی (VIP انحصاری)",
    teacherSharePercent: 85,
    platformSharePercent: 15,
    minTeachingHours: 500,
    minCourseSales: 1500,
    minRating: 4.85,
    badgeColor: "#38bdf8",
  },
];

export const INITIAL_TEACHER_PROFILES: TeacherCommissionProfile[] = [
  {
    teacherId: "tch-rezaei-01",
    teacherName: "دکتر مسعود رضایی",
    nationalId: "0012938471",
    phone: "09121112233",
    currentTier: "diamond",
    effectiveCommissionPercent: 85,
    isCustomOverride: false,
    totalTeachingHours: 580,
    totalCourseSales: 2140,
    averageRating: 4.92,
    activeContractId: "cnt-rez-2026",
    hasSignedActiveContract: true,
    isLegalHoldActive: false,
    withholdingTaxPercent: 0, // معافیت آموزشی تایید شده
  },
  {
    teacherId: "tch-shams-02",
    teacherName: "دکتر مریم شمس",
    nationalId: "0028475910",
    phone: "09123334455",
    currentTier: "gold",
    effectiveCommissionPercent: 80,
    isCustomOverride: false,
    totalTeachingHours: 240,
    totalCourseSales: 680,
    averageRating: 4.81,
    activeContractId: "cnt-shams-2026",
    hasSignedActiveContract: true,
    isLegalHoldActive: false,
    withholdingTaxPercent: 5,
  },
  {
    teacherId: "tch-rahimi-03",
    teacherName: "استاد فرهاد رحیمی",
    nationalId: "0059382014",
    phone: "09127778899",
    currentTier: "silver",
    effectiveCommissionPercent: 78, // Custom negotiated split
    isCustomOverride: true,
    customOverrideReason: "توافق ویژه بابت تدریس انحصاری دوره مکالمه سریع",
    totalTeachingHours: 92,
    totalCourseSales: 160,
    averageRating: 4.65,
    activeContractId: "cnt-rahimi-2026",
    hasSignedActiveContract: false, // Pending OTP Signature
    isLegalHoldActive: false,
    withholdingTaxPercent: 5,
  },
  {
    teacherId: "tch-ghasemi-04",
    teacherName: "مهدی قاسمی",
    nationalId: "0082736451",
    phone: "09129990011",
    currentTier: "bronze",
    effectiveCommissionPercent: 70,
    isCustomOverride: false,
    totalTeachingHours: 18,
    totalCourseSales: 24,
    averageRating: 4.2,
    hasSignedActiveContract: false,
    isLegalHoldActive: true,
    legalHoldReason: "بررسی گزارش عدم تطابق سرفصل‌های تدریس با تعهدات دوره",
    withholdingTaxPercent: 10,
  },
];

export const INITIAL_TEACHER_CONTRACTS: TeacherContractItem[] = [
  {
    id: "cnt-rez-2026",
    teacherId: "tch-rezaei-01",
    teacherName: "دکتر مسعود رضایی",
    contractType: "teaching_agreement",
    contractTitle: "قرارداد تدریس و همکاری آموزشی مسترکلاس آیلتس (سال ۱۴۰۵)",
    version: "v3.2",
    status: "active_signed",
    termsSummary: "همکاری تدریس آنلاین دوره‌های آکادمیک آیلتس، سهم ۸۵٪ مدرس، معافیت مالیاتی مصوب و تعهد کیفیت نمرات رایتینگ و اسپیکینگ.",
    teacherCommissionPercent: 85,
    createdAt: "2026-01-10T09:00:00Z",
    signedAt: "2026-01-11T14:22:00Z",
    expiresAt: "2027-01-10T23:59:59Z",
    digitalSignature: {
      signerPhone: "09121112233",
      otpTrackingCode: "OTP-884920",
      signerIp: "5.160.22.84",
      nationalIdHash: "SHA256:0012938471:SEAL-901",
    },
  },
  {
    id: "cnt-rez-nda",
    teacherId: "tch-rezaei-01",
    teacherName: "دکتر مسعود رضایی",
    contractType: "nda_confidentiality",
    contractTitle: "توافق‌نامه حفظ محرمانگی الگوریتم‌های تصحیح هوش مصنوعی آیلتس",
    version: "v1.0",
    status: "active_signed",
    termsSummary: "تعهد به عدم افشای ساختار داده‌های دوقلوی هوش مصنوعی و مدل‌های زبانی تصحیح رایتینگ ایندورا.",
    teacherCommissionPercent: 85,
    createdAt: "2026-01-10T09:15:00Z",
    signedAt: "2026-01-11T14:25:00Z",
    expiresAt: "2029-01-10T23:59:59Z",
    digitalSignature: {
      signerPhone: "09121112233",
      otpTrackingCode: "OTP-884925",
      signerIp: "5.160.22.84",
      nationalIdHash: "SHA256:0012938471:SEAL-902",
    },
  },
  {
    id: "cnt-shams-2026",
    teacherId: "tch-shams-02",
    teacherName: "دکتر مریم شمس",
    contractType: "content_ip_assignment",
    contractTitle: "قرارداد واگذاری حقوق نشر و تکثیر دوره گرامر هگز (Grammar Hex)",
    version: "v2.0",
    status: "active_signed",
    termsSummary: "واگذاری حقوق مادی انتشار پکیج گرامر به پلتفرم ایندورا با سهم سود ۸۰ درصدی مدرس به مدت ۲ سال.",
    teacherCommissionPercent: 80,
    createdAt: "2026-03-01T11:00:00Z",
    signedAt: "2026-03-02T16:40:00Z",
    expiresAt: "2028-03-01T23:59:59Z",
    digitalSignature: {
      signerPhone: "09123334455",
      otpTrackingCode: "OTP-334190",
      signerIp: "2.188.45.12",
      nationalIdHash: "SHA256:0028475910:SEAL-441",
    },
  },
  {
    id: "cnt-rahimi-2026",
    teacherId: "tch-rahimi-03",
    teacherName: "استاد فرهاد رحیمی",
    contractType: "teaching_agreement",
    contractTitle: "پیش‌نویس قرارداد تدریس و تولید محتوای مکالمه روان (سال ۱۴۰۵)",
    version: "v1.1",
    status: "pending_signature",
    termsSummary: "سهم توافقی ۷۸٪ مدرس، برگزاری کلاس‌های تعاملی صوتی و پایش مکث‌های زبان‌آموزان در استودیو آنلاین.",
    teacherCommissionPercent: 78,
    createdAt: "2026-11-12T10:00:00Z",
    expiresAt: "2027-11-12T23:59:59Z",
  },
  {
    id: "cnt-old-005",
    teacherId: "tch-ghasemi-04",
    teacherName: "مهدی قاسمی",
    contractType: "teaching_agreement",
    contractTitle: "قرارداد آزمایشی تدریس متون کنکور سراسری (منقضی شده)",
    version: "v1.0",
    status: "terminated",
    termsSummary: "قرارداد دوره ۳ ماهه آزمایشی که به دلیل عدم تحقق استانداردهای کیفی فسخ گردید.",
    teacherCommissionPercent: 70,
    createdAt: "2026-06-01T08:00:00Z",
    signedAt: "2026-06-02T09:30:00Z",
    expiresAt: "2026-09-01T23:59:59Z",
    digitalSignature: {
      signerPhone: "09129990011",
      otpTrackingCode: "OTP-110022",
      signerIp: "85.185.10.4",
      nationalIdHash: "SHA256:0082736451:SEAL-100",
    },
  },
];

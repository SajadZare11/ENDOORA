export type TeacherVerificationStatus =
  | "pending"
  | "in_review"
  | "approved"
  | "revision_requested"
  | "rejected"
  | "suspended";

export type CommissionTier = "vip_gold" | "senior_silver" | "standard_bronze" | "custom";

export interface OfficialBadgeDefinition {
  key: string;
  titleFa: string;
  titleEn: string;
  icon: string;
  badgeColor: string;
  descriptionFa: string;
  category: "credentials" | "skills" | "achievement";
}

export const OFFICIAL_BADGE_CATALOG: OfficialBadgeDefinition[] = [
  {
    key: "celta_delta",
    titleFa: "مدارک بین‌المللی CELTA / DELTA کمبریج",
    titleEn: "Cambridge CELTA / DELTA Certified",
    icon: "📜",
    badgeColor: "#0284c7",
    descriptionFa: "دارنده مدرک رسمی روش تدریس کمبریج با متدولوژی استاندارد جهانی",
    category: "credentials",
  },
  {
    key: "ielts_examiner",
    titleFa: "اگزمینر رسمی ماک‌تست آیلتس",
    titleEn: "IELTS Mock Examiner & Trainer",
    icon: "🎯",
    badgeColor: "#dc2626",
    descriptionFa: "تسلط کامل بر ۴ معیار سنجش اگزمینر و کارنامه تحلیلی باند ۸+",
    category: "credentials",
  },
  {
    key: "top_rated",
    titleFa: "مدرس برگزیده و برتر ماه (Top Rated)",
    titleEn: "Top Rated Teacher of the Month",
    icon: "⭐",
    badgeColor: "#d97706",
    descriptionFa: "بیشترین نرخ رضایت زبان‌آموزان (میانگین امتیاز ۴.۹ از ۵) و برگزاری موفق جلسات",
    category: "achievement",
  },
  {
    key: "native_accent",
    titleFa: "تلفظ نیتیو و بدون لهجه (Native Accent)",
    titleEn: "Native Accent & Pronunciation Master",
    icon: "🎙️",
    badgeColor: "#7c3aed",
    descriptionFa: "تایید صحت تلفظ، استرس کلمات و اینتونیشن طبیعی در مصاحبه تخصصی",
    category: "skills",
  },
  {
    key: "konkur_expert",
    titleFa: "متخصص رتبه برتر کنکور و امتحانات نهایی",
    titleEn: "Konkur & High School Final Exam Specialist",
    icon: "🏆",
    badgeColor: "#059669",
    descriptionFa: "تحلیل موشکافانه تست‌های سراسری و تمرین تا ۲۰ برای نمره کامل کتبی نهایی",
    category: "skills",
  },
  {
    key: "conversation_master",
    titleFa: "مستر کلاس مکالمه و کوچ روان‌زبانی",
    titleEn: "Fluency & Conversation Coach",
    icon: "💬",
    badgeColor: "#db2777",
    descriptionFa: "تکنیک‌های رفع خجالت، شکستن سد مکالمه و گفت‌وگوی روان در موقعیت‌های واقعی",
    category: "skills",
  },
];

export interface TeachingPermissions {
  privateVideo1on1: boolean;
  asyncReview: boolean;
  groupWebinars: boolean;
  courseCreation: boolean;
}

export interface ReviewHistoryEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  notes?: string;
  previousStatus?: TeacherVerificationStatus;
  newStatus?: TeacherVerificationStatus;
}

export interface TeacherApplicationRecord {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl: string;
  email: string;
  phone: string;
  nationalId: string;
  city: string;
  degree: string;
  university: string;
  experienceYears: number;
  bio: string;
  specialties: string[];
  hourlyRateToman: number;
  idDocumentUrl: string;
  degreeDocumentUrl: string;
  certificationsDocumentUrl: string;
  sampleTeachingVideoUrl: string;
  sampleTeachingThumbnail: string;
  status: TeacherVerificationStatus;
  assignedBadges: string[];
  customBadges: string[];
  commissionRatePercent: number;
  commissionTier: CommissionTier;
  teachingPermissions: TeachingPermissions;
  isFeatured: boolean;
  adminNotes: string;
  rejectionReason: string;
  revisionChecklist: string[];
  revisionInstructions: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  history: ReviewHistoryEntry[];
}

export interface VerificationStats {
  totalApplicants: number;
  pendingCount: number;
  inReviewCount: number;
  revisionRequestedCount: number;
  approvedCount: number;
  rejectedCount: number;
  suspendedCount: number;
  averageCommissionPercent: number;
}

export interface ReviewDecisionPayload {
  decision: "approve" | "request_revision" | "reject" | "suspend" | "update_privileges";
  actor: string;
  adminNotes?: string;
  commissionRatePercent?: number;
  commissionTier?: CommissionTier;
  assignedBadges?: string[];
  customBadges?: string[];
  teachingPermissions?: Partial<TeachingPermissions>;
  isFeatured?: boolean;
  rejectionReason?: string;
  revisionChecklist?: string[];
  revisionInstructions?: string;
}

export const INITIAL_TEACHER_APPLICATIONS: TeacherApplicationRecord[] = [
  {
    id: "app-t-003",
    userId: "usr-003",
    fullName: "استاد پویا صامتی",
    avatarUrl: "/images/skills/speaking/sherlock_stage5_telegraph_officer.jpg",
    email: "pouya.sameti@gmail.com",
    phone: "09351234567",
    nationalId: "0018945231",
    city: "اصفهان",
    degree: "کارشناسی ارشد آموزش زبان انگلیسی",
    university: "دانشگاه اصفهان",
    experienceYears: 6,
    bio: "مدرس دوره‌های فشرده ریدینگ و رایتینگ آیلتس با ۶ سال سابقه تدریس در مراکز معتبر. دارای گواهی TTC و CELTA با متد تعاملی.",
    specialties: ["آمادگی آیلتس (IELTS)", "گرامر (Grammar)", "رایتینگ تخصصی (Writing)"],
    hourlyRateToman: 320000,
    idDocumentUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800",
    degreeDocumentUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800",
    certificationsDocumentUrl: "https://images.unsplash.com/photo-1589330694653-dad6d3240a2b?w=800",
    sampleTeachingVideoUrl: "https://www.aparat.com/video/video/embed/videohash/k1p2q3/vt/frame",
    sampleTeachingThumbnail: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800",
    status: "pending",
    assignedBadges: [],
    customBadges: [],
    commissionRatePercent: 20,
    commissionTier: "standard_bronze",
    teachingPermissions: {
      privateVideo1on1: true,
      asyncReview: true,
      groupWebinars: false,
      courseCreation: false,
    },
    isFeatured: false,
    adminNotes: "مدارک بارگذاری شده، نیازمند مشاهده و ارزیابی کیفیت تدریس در ویدئوی نمونه و تعیین کارمزد.",
    rejectionReason: "",
    revisionChecklist: [],
    revisionInstructions: "",
    submittedAt: "2026-11-12T14:30:00Z",
    history: [
      {
        id: "hist-001",
        timestamp: "2026-11-12T14:30:00Z",
        action: "ثبت اولیه درخواست تدریس",
        actor: "سیستم خودکار ثبت نام متقاضیان",
        newStatus: "pending",
      },
    ],
  },
  {
    id: "app-t-004",
    userId: "usr-007",
    fullName: "مهندس آرش شایگان",
    avatarUrl: "/images/skills/speaking/sherlock_stage5_telegraph_officer.jpg",
    email: "arash.shaygan@gmail.com",
    phone: "09127894561",
    nationalId: "0074125896",
    city: "شیراز",
    degree: "کارشناسی ارشد زبان‌شناسی کاربردی",
    university: "دانشگاه شیراز",
    experienceYears: 7,
    bio: "کوچ تلفظ نیتیو و مکالمه پیشرفته با تجربه برگزاری بیش از ۴۰۰ کلاس آنلاین موفق. تسلط بر تکنیک‌های لهجه آمریکایی.",
    specialties: ["مکالمه (Speaking)", "تلفظ و لهجه آمریکایی (Pronunciation)", "انگلیسی تجاری (Business)"],
    hourlyRateToman: 350000,
    idDocumentUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800",
    degreeDocumentUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800",
    certificationsDocumentUrl: "https://images.unsplash.com/photo-1589330694653-dad6d3240a2b?w=800",
    sampleTeachingVideoUrl: "https://www.aparat.com/video/video/embed/videohash/b4v5c6/vt/frame",
    sampleTeachingThumbnail: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
    status: "in_review",
    assignedBadges: ["native_accent"],
    customBadges: ["مدرس مکالمه تجاری"],
    commissionRatePercent: 15,
    commissionTier: "senior_silver",
    teachingPermissions: {
      privateVideo1on1: true,
      asyncReview: true,
      groupWebinars: true,
      courseCreation: false,
    },
    isFeatured: true,
    adminNotes: "ویدئوی نمونه تدریس از نظر تسلط و تلفظ عالی است. در حال استعلام صحت مدرک زبان‌شناسی.",
    rejectionReason: "",
    revisionChecklist: [],
    revisionInstructions: "",
    submittedAt: "2026-11-10T11:15:00Z",
    history: [
      {
        id: "hist-002",
        timestamp: "2026-11-10T11:15:00Z",
        action: "ثبت اولیه درخواست",
        actor: "سیستم خودکار",
        newStatus: "pending",
      },
      {
        id: "hist-003",
        timestamp: "2026-11-11T09:20:00Z",
        action: "آغاز ارزیابی تخصصی ویدیو",
        actor: "کارشناس آموزش ایندورا",
        previousStatus: "pending",
        newStatus: "in_review",
        notes: "کیفیت لهجه و روان صحبت کردن ارزیابی شد.",
      },
    ],
  },
  {
    id: "app-t-005",
    userId: "usr-008",
    fullName: "سرکار خانم مونا فرهمند",
    avatarUrl: "/images/skills/speaking/sherlock_stage5_telegraph_officer.jpg",
    email: "mona.farahmand@yahoo.com",
    phone: "09361114477",
    nationalId: "0442356891",
    city: "مشهد",
    degree: "کارشناسی مترجمی زبان انگلیسی",
    university: "دانشگاه فردوسی مشهد",
    experienceYears: 4,
    bio: "مدرس مکالمه عمومی نوجوانان و بزرگسالان، تمرکز بر تقویت شنیداری و تقویت اعتماد به نفس در صحبت کردن.",
    specialties: ["مکالمه عمومی (General Speaking)", "مهارت شنیداری (Listening)"],
    hourlyRateToman: 240000,
    idDocumentUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800",
    degreeDocumentUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800",
    certificationsDocumentUrl: "",
    sampleTeachingVideoUrl: "",
    sampleTeachingThumbnail: "",
    status: "revision_requested",
    assignedBadges: [],
    customBadges: [],
    commissionRatePercent: 20,
    commissionTier: "standard_bronze",
    teachingPermissions: {
      privateVideo1on1: true,
      asyncReview: false,
      groupWebinars: false,
      courseCreation: false,
    },
    isFeatured: false,
    adminNotes: "کیفیت تصویر پشت کارت ملی تار است و نمونه ویدیوی تدریس بارگذاری نشده است.",
    rejectionReason: "",
    revisionChecklist: [
      "تصویر باکیفیت و خوانا از روی کارت ملی",
      "آپلود ویدیوی معرفی تدریس (حداقل ۳ دقیقه تدریس نمونه به زبان انگلیسی)",
      "بارگذاری تصویر مدرک دانشگاهی یا گواهی TTC",
    ],
    revisionInstructions: "همکار گرامی، لطفاً موارد مشخص شده در چک‌لیست را از طریق پنل کاربری مجدداً ارسال نمایید تا فرآیند احراز هویت تکمیل گردد.",
    submittedAt: "2026-11-08T16:40:00Z",
    history: [
      {
        id: "hist-004",
        timestamp: "2026-11-08T16:40:00Z",
        action: "ثبت درخواست",
        actor: "سیستم خودکار",
        newStatus: "pending",
      },
      {
        id: "hist-005",
        timestamp: "2026-11-09T14:10:00Z",
        action: "درخواست بازنگری مدارک",
        actor: "مدیر ارشد ایندورا",
        previousStatus: "pending",
        newStatus: "revision_requested",
        notes: "نقص در مدارک هویتی و نمونه تدریس.",
      },
    ],
  },
  {
    id: "app-t-001",
    userId: "usr-002",
    fullName: "استاد کاوه رضایی",
    avatarUrl: "/images/skills/speaking/sherlock_stage5_telegraph_officer.jpg",
    email: "kaveh.rezaei@endoora.ir",
    phone: "09121115599",
    nationalId: "0058741236",
    city: "تهران",
    degree: "کارشناسی ارشد آموزش زبان انگلیسی",
    university: "دانشگاه تهران",
    experienceYears: 12,
    bio: "دارنده مدرک DELTA کمبریج و اگزمینر ماک‌تست آیلتس. بیش از ۱۲ سال سابقه تدریس تخصصی آیلتس و مکالمه پیشرفته.",
    specialties: ["آمادگی آیلتس (IELTS)", "مکالمه (Speaking)", "تلفظ (Pronunciation)", "گرامر (Grammar)"],
    hourlyRateToman: 380000,
    idDocumentUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800",
    degreeDocumentUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800",
    certificationsDocumentUrl: "https://images.unsplash.com/photo-1589330694653-dad6d3240a2b?w=800",
    sampleTeachingVideoUrl: "https://www.aparat.com/video/video/embed/videohash/a1b2c3/vt/frame",
    sampleTeachingThumbnail: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
    status: "approved",
    assignedBadges: ["celta_delta", "ielts_examiner", "top_rated"],
    customBadges: ["اگزمینر بین‌المللی"],
    commissionRatePercent: 15,
    commissionTier: "senior_silver",
    teachingPermissions: {
      privateVideo1on1: true,
      asyncReview: true,
      groupWebinars: true,
      courseCreation: true,
    },
    isFeatured: true,
    adminNotes: "رزومه و گواهینامه‌های DELTA کمبریج کاملاً تایید شد. مدرس ارشد با نرخ کارمزد ترجیحی ۱۵٪.",
    rejectionReason: "",
    revisionChecklist: [],
    revisionInstructions: "",
    submittedAt: "2026-02-15T10:30:00Z",
    reviewedAt: "2026-02-16T11:00:00Z",
    reviewedBy: "مدیر ارشد ایندورا",
    history: [
      {
        id: "hist-006",
        timestamp: "2026-02-15T10:30:00Z",
        action: "ثبت مدارک",
        actor: "سیستم خودکار",
        newStatus: "pending",
      },
      {
        id: "hist-007",
        timestamp: "2026-02-16T11:00:00Z",
        action: "تایید صلاحیت نهایی و اعطای نشان‌ها",
        actor: "مدیر ارشد ایندورا",
        previousStatus: "pending",
        newStatus: "approved",
        notes: "تایید صلاحیت به همراه ۳ نشان شایستگی و کارمزد ۱۵٪.",
      },
    ],
  },
  {
    id: "app-t-002",
    userId: "usr-009",
    fullName: "دکتر لیلا تهرانی",
    avatarUrl: "/images/skills/speaking/sherlock_stage5_telegraph_officer.jpg",
    email: "leila.tehrani@gmail.com",
    phone: "09123337788",
    nationalId: "0069874521",
    city: "تهران",
    degree: "دکتری آموزش زبان انگلیسی (TEFL)",
    university: "دانشگاه علامه طباطبایی",
    experienceYears: 14,
    bio: "عضو هیئت علمی و پژوهشگر حوزه روان‌شناسی یادگیری زبان. متخصص شکستن سد مکالمه و تدریس رایتینگ تحلیلی آیلتس.",
    specialties: ["مکالمه و اعتماد به نفس (Speaking)", "آمادگی آیلتس (IELTS)", "رایتینگ تسک ۲ (Writing Task 2)"],
    hourlyRateToman: 420000,
    idDocumentUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800",
    degreeDocumentUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800",
    certificationsDocumentUrl: "https://images.unsplash.com/photo-1589330694653-dad6d3240a2b?w=800",
    sampleTeachingVideoUrl: "https://www.aparat.com/video/video/embed/videohash/c7d8e9/vt/frame",
    sampleTeachingThumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800",
    status: "approved",
    assignedBadges: ["celta_delta", "native_accent", "conversation_master"],
    customBadges: ["دکتری تخصصی آموزش"],
    commissionRatePercent: 10,
    commissionTier: "vip_gold",
    teachingPermissions: {
      privateVideo1on1: true,
      asyncReview: true,
      groupWebinars: true,
      courseCreation: true,
    },
    isFeatured: true,
    adminNotes: "استاد VIP پلتفرم با کارمزد طلایی ۱۰٪ و تمام مجوزهای تدریس و وبینار.",
    rejectionReason: "",
    revisionChecklist: [],
    revisionInstructions: "",
    submittedAt: "2026-03-01T09:00:00Z",
    reviewedAt: "2026-03-02T14:30:00Z",
    reviewedBy: "مدیر ارشد ایندورا",
    history: [
      {
        id: "hist-008",
        timestamp: "2026-03-01T09:00:00Z",
        action: "ثبت مدارک",
        actor: "سیستم خودکار",
        newStatus: "pending",
      },
      {
        id: "hist-009",
        timestamp: "2026-03-02T14:30:00Z",
        action: "تایید صلاحیت و ارتقا به شریک VIP",
        actor: "مدیر ارشد ایندورا",
        previousStatus: "pending",
        newStatus: "approved",
        notes: "اعطای کارمزد طلایی ۱۰٪ به همراه نشان مستر کلاس مکالمه.",
      },
    ],
  },
  {
    id: "app-t-006",
    userId: "usr-010",
    fullName: "پرهام سهرابی",
    avatarUrl: "/images/skills/speaking/sherlock_stage5_telegraph_officer.jpg",
    email: "parham.sohrabi@gmail.com",
    phone: "09198889900",
    nationalId: "0032145698",
    city: "کرج",
    degree: "دانشجوی کارشناسی مهندسی کامپیوتر",
    university: "دانشگاه آزاد کرج",
    experienceYears: 0,
    bio: "علاقه‌مند به زبان انگلیسی و مکالمه روزمره.",
    specialties: ["مکالمه مقدماتی"],
    hourlyRateToman: 150000,
    idDocumentUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800",
    degreeDocumentUrl: "",
    certificationsDocumentUrl: "",
    sampleTeachingVideoUrl: "",
    sampleTeachingThumbnail: "",
    status: "rejected",
    assignedBadges: [],
    customBadges: [],
    commissionRatePercent: 20,
    commissionTier: "standard_bronze",
    teachingPermissions: {
      privateVideo1on1: false,
      asyncReview: false,
      groupWebinars: false,
      courseCreation: false,
    },
    isFeatured: false,
    adminNotes: "عدم تطابق با شرایط حداقلی جذب مدرس (حداقل مدرک مرتبط یا حداقل ۲ سال سابقه تدریس مستند).",
    rejectionReason: "متقاضی محترم، مطابق قوانین جذب مدرس ایندورا، حداقل نیازمندی داشتن مدرک دانشگاهی مرتبط، گواهی TTC/CELTA یا حداقل ۲ سال سابقه تدریس مستند می‌باشد.",
    revisionChecklist: [],
    revisionInstructions: "",
    submittedAt: "2026-11-05T18:00:00Z",
    reviewedAt: "2026-11-06T10:15:00Z",
    reviewedBy: "مدیر ارشد ایندورا",
    history: [
      {
        id: "hist-010",
        timestamp: "2026-11-05T18:00:00Z",
        action: "ثبت درخواست",
        actor: "سیستم خودکار",
        newStatus: "pending",
      },
      {
        id: "hist-011",
        timestamp: "2026-11-06T10:15:00Z",
        action: "رد درخواست",
        actor: "مدیر ارشد ایندورا",
        previousStatus: "pending",
        newStatus: "rejected",
        notes: "عدم احراز شرایط حداقلی جذب مدرس.",
      },
    ],
  },
];

export type ExamType = "ielts_mock" | "placement_adaptive" | "konkur_course" | "term_exam";
export type ExamSessionStatus = "active" | "flagged" | "suspended" | "completed" | "disqualified";
export type ViolationSeverity = "low" | "medium" | "high" | "critical";
export type ViolationType =
  | "fullscreen_exit"
  | "tab_hidden"
  | "blur"
  | "clipboard_violation"
  | "devtools_attempt"
  | "speed_anomaly"
  | "multiple_ips";

export interface ProctoringViolationEvent {
  id: string;
  type: ViolationType;
  severity: ViolationSeverity;
  timestamp: string;
  details: string;
  isPardoned: boolean;
}

export interface LiveExamSession {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  examId: string;
  examTitle: string;
  examType: ExamType;
  status: ExamSessionStatus;
  startedAt: string;
  durationMinutes: number;
  timeRemainingSeconds: number;
  integrityScore: number; // 0 - 100
  ipAddress: string;
  userAgent: string;
  violations: ProctoringViolationEvent[];
  adminNotes?: string;
}

export type AuditTriggerReason = "low_confidence" | "score_discrepancy" | "qa_sampling";
export type AuditStatus = "pending_review" | "calibrated" | "confirmed_original";

export interface AiCriterionScores {
  tr: number; // Task Achievement / Response (0 - 9)
  cc: number; // Coherence & Cohesion (0 - 9)
  lr: number; // Lexical Resource (0 - 9)
  gra: number; // Grammatical Range & Accuracy (0 - 9)
  overallBand: number;
}

export interface AiGradeAuditRecord {
  id: string;
  submissionId: string;
  studentName: string;
  examTitle: string;
  skill: "writing_task1" | "writing_task2" | "speaking";
  triggerReason: AuditTriggerReason;
  aiConfidence: number; // 0 - 100
  aiScores: AiCriterionScores;
  humanScores?: AiCriterionScores;
  status: AuditStatus;
  studentSubmissionText?: string;
  audioRecordingUrl?: string;
  aiFeedback: string;
  examinerFeedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export type QuestionItemStatus = "active" | "flagged_defective" | "quarantined" | "regraded_compensated";

export interface DistractorStats {
  option: string;
  textFa: string;
  selectionRate: number; // 0.0 - 1.0
  isCorrect: boolean;
  isTopPerformerTrap?: boolean;
}

export interface QuestionPsychometricsItem {
  id: string;
  questionId: string;
  questionTitle: string;
  category: "placement_grammar" | "placement_vocab" | "ielts_reading" | "ielts_listening" | "konkur";
  difficultyIndex: number; // p-value: 0.0 - 1.0
  discriminationIndex: number; // r_pb: -1.0 to +1.0
  totalAttempts: number;
  correctAnswers: number;
  avgDwellTimeSeconds: number;
  status: QuestionItemStatus;
  flagReason?: string;
  distractorAnalysis: DistractorStats[];
}

export type AppealStatus = "under_investigation" | "upgraded" | "rejected";

export interface GradeAppealCase {
  id: string;
  studentId: string;
  studentName: string;
  examTitle: string;
  skill: string;
  originalBand: number;
  appealedAt: string;
  studentStatement: string;
  appealFeePaid: number; // Toman
  status: AppealStatus;
  revisedBand?: number;
  decisionNotes?: string;
  refundIssued?: boolean;
  adjudicatedBy?: string;
  adjudicatedAt?: string;
}

export interface ExamIntegrityStats {
  activeSessionsCount: number;
  flaggedViolationsToday: number;
  pendingAiAudits: number;
  quarantinedQuestions: number;
  openAppeals: number;
  platformAvgIntegrityScore: number;
}

export const INITIAL_LIVE_SESSIONS: LiveExamSession[] = [
  {
    id: "sess-live-101",
    studentId: "usr-stu-204",
    studentName: "آرمان کمالی",
    studentEmail: "arman.k@gmail.com",
    examId: "exam-ielts-m1",
    examTitle: "آزمون شبیه‌ساز جامع آیلتس آکادمیک (Mock Test 1)",
    examType: "ielts_mock",
    status: "flagged",
    startedAt: "2026-11-16T00:15:00Z",
    durationMinutes: 60,
    timeRemainingSeconds: 1420,
    integrityScore: 68,
    ipAddress: "5.127.84.19",
    userAgent: "Chrome 128 / Windows 11",
    violations: [
      {
        id: "viol-01",
        type: "fullscreen_exit",
        severity: "medium",
        timestamp: "2026-11-16T00:22:15Z",
        details: "خروج از حالت تمام‌صفحه به مدت ۱۲ ثانیه",
        isPardoned: false,
      },
      {
        id: "viol-02",
        type: "tab_hidden",
        severity: "high",
        timestamp: "2026-11-16T00:28:40Z",
        details: "جابجایی فوکوس تب مرورگر به برنامه بیرونی",
        isPardoned: false,
      },
    ],
    adminNotes: "هشدار اول به داوطلب ارسال شد.",
  },
  {
    id: "sess-live-102",
    studentId: "usr-stu-312",
    studentName: "سارا میرزایی",
    studentEmail: "sara.m@yahoo.com",
    examId: "exam-place-cefr",
    examTitle: "آزمون تعیین سطح انطباقی هوشمند (CEFR Adaptive)",
    examType: "placement_adaptive",
    status: "active",
    startedAt: "2026-11-16T00:32:00Z",
    durationMinutes: 45,
    timeRemainingSeconds: 2180,
    integrityScore: 98,
    ipAddress: "2.184.21.90",
    userAgent: "Safari 17 / macOS Sonoma",
    violations: [],
  },
  {
    id: "sess-live-103",
    studentId: "usr-stu-405",
    studentName: "پرهام اسدی",
    studentEmail: "parham.asadi@chmail.ir",
    examId: "exam-konkur-g12",
    examTitle: "آزمون نهایی شبیه‌ساز کنکور سراسری و نهایی دوازدهم",
    examType: "konkur_course",
    status: "suspended",
    startedAt: "2026-11-16T00:05:00Z",
    durationMinutes: 90,
    timeRemainingSeconds: 2800,
    integrityScore: 42,
    ipAddress: "178.252.14.77",
    userAgent: "Firefox 130 / Windows 10",
    violations: [
      {
        id: "viol-03",
        type: "clipboard_violation",
        severity: "critical",
        timestamp: "2026-11-16T00:18:10Z",
        details: "تلاش برای پیست متن ۴۵ کلمه‌ای در فیلد تشریحی",
        isPardoned: false,
      },
      {
        id: "viol-04",
        type: "devtools_attempt",
        severity: "critical",
        timestamp: "2026-11-16T00:20:05Z",
        details: "تلاش برای بازکردن ابزار توسعه مرورگر (F12 DevTools)",
        isPardoned: false,
      },
    ],
    adminNotes: "آزمون توسط ناظر هوشمند معلق گردید.",
  },
  {
    id: "sess-live-104",
    studentId: "usr-stu-520",
    studentName: "مریم جعفری",
    studentEmail: "m.jafari@gmail.com",
    examId: "exam-ielts-m1",
    examTitle: "آزمون شبیه‌ساز جامع آیلتس آکادمیک (Mock Test 1)",
    examType: "ielts_mock",
    status: "active",
    startedAt: "2026-11-16T00:20:00Z",
    durationMinutes: 60,
    timeRemainingSeconds: 1650,
    integrityScore: 94,
    ipAddress: "91.98.112.44",
    userAgent: "Edge 128 / Windows 11",
    violations: [
      {
        id: "viol-05",
        type: "blur",
        severity: "low",
        timestamp: "2026-11-16T00:30:12Z",
        details: "کلیک بیرون از پنجره مرورگر (زیر ۲ ثانیه)",
        isPardoned: true,
      },
    ],
  },
];

export const INITIAL_AI_AUDITS: AiGradeAuditRecord[] = [
  {
    id: "aud-ai-001",
    submissionId: "sub-w2-8841",
    studentName: "نیما رادپور",
    examTitle: "ماک آکادمیک آیلتس - رایتینگ تسک ۲",
    skill: "writing_task2",
    triggerReason: "low_confidence",
    aiConfidence: 68,
    aiScores: {
      tr: 5.5,
      cc: 6.0,
      lr: 6.5,
      gra: 5.0,
      overallBand: 5.5,
    },
    status: "pending_review",
    studentSubmissionText:
      "In modern society, some believe that universities should focus only on job skills, while others think education must provide general knowledge. Although practical skills are essential for employment, academic breadth develops critical thinking. Therefore, an integrated approach prepares graduates more effectively.",
    aiFeedback:
      "ایده‌ها خوب بسط داده شده‌اند اما استفاده از ساختارهای گرامری متناقض و ابهام در استدلال پاراگراف دوم اطمینان مدل را کاهش داد.",
  },
  {
    id: "aud-ai-002",
    submissionId: "sub-sp-9012",
    studentName: "الناز شاکری",
    examTitle: "آزمون اسپیکینگ تعاملی با دوقلوی هوش مصنوعی",
    skill: "speaking",
    triggerReason: "score_discrepancy",
    aiConfidence: 89,
    aiScores: {
      tr: 8.0,
      cc: 7.5,
      lr: 7.5,
      gra: 4.5,
      overallBand: 7.0,
    },
    status: "pending_review",
    audioRecordingUrl: "/audio/speaking-sample-sub-9012.mp3",
    aiFeedback:
      "تسلط و فلوئنسی بسیار بالا در کنار واژگان آکادمیک غنی، اما افت چشمگیر در تطابق زمان افعال در تسک ۲ باعث اختلاف میانگین شده است.",
  },
  {
    id: "aud-ai-003",
    submissionId: "sub-w1-7720",
    studentName: "فرزاد حسینی",
    examTitle: "ماک آکادمیک آیلتس - رایتینگ تسک ۱ (گراف خطی)",
    skill: "writing_task1",
    triggerReason: "qa_sampling",
    aiConfidence: 94,
    aiScores: {
      tr: 7.0,
      cc: 7.0,
      lr: 7.5,
      gra: 7.0,
      overallBand: 7.0,
    },
    humanScores: {
      tr: 7.0,
      cc: 7.0,
      lr: 7.5,
      gra: 7.5,
      overallBand: 7.5,
    },
    status: "calibrated",
    studentSubmissionText:
      "The line graph illustrates the consumption of energy across four distinct European countries between 2000 and 2024. Overall, renewable sources exhibited a substantial upward trend, whereas coal-fired generation experienced a persistent decline.",
    aiFeedback: "تحلیل روند کلی (Overview) شفاف و مقایسه داده‌ها دقیق است.",
    examinerFeedback: "کالیبره شد؛ ساختار دستوری با توجه به تنوع بندهای پیرو شایسته باند ۷.۵ بود.",
    reviewedBy: "دکتر مریم رضوانی (سرممیز آیلتس)",
    reviewedAt: "2026-11-15T19:40:00Z",
  },
];

export const INITIAL_PSYCHOMETRICS: QuestionPsychometricsItem[] = [
  {
    id: "psy-q-001",
    questionId: "q-cefr-gr-109",
    questionTitle: "تشخیص کاربرد Inversion در عبارات منفی (Not only / Seldom)",
    category: "placement_grammar",
    difficultyIndex: 0.22, // Too Hard
    discriminationIndex: -0.12, // Defective negative discrimination (High scorers failed it!)
    totalAttempts: 340,
    correctAnswers: 75,
    avgDwellTimeSeconds: 88,
    status: "flagged_defective",
    flagReason: "ضریب تمیز منفی (-0.12): زبان‌آموزان برتر به علت ابهام در صورت سوال گزینه اشتباه را انتخاب کرده‌اند.",
    distractorAnalysis: [
      { option: "A", textFa: "Seldom had he seen", selectionRate: 0.22, isCorrect: true },
      { option: "B", textFa: "Seldom he had seen", selectionRate: 0.48, isCorrect: false, isTopPerformerTrap: true },
      { option: "C", textFa: "He had seldom seen", selectionRate: 0.18, isCorrect: false },
      { option: "D", textFa: "Had he seldom seen", selectionRate: 0.12, isCorrect: false },
    ],
  },
  {
    id: "psy-q-002",
    questionId: "q-ielts-rd-204",
    questionTitle: "تطابق تیترها در متن هوش مصنوعی (Matching Headings - Paragraph C)",
    category: "ielts_reading",
    difficultyIndex: 0.54, // Balanced
    discriminationIndex: 0.48, // Excellent discrimination
    totalAttempts: 520,
    correctAnswers: 281,
    avgDwellTimeSeconds: 72,
    status: "active",
    distractorAnalysis: [
      { option: "iv", textFa: "Economic repercussions of automation", selectionRate: 0.54, isCorrect: true },
      { option: "ii", textFa: "Historical origins of computing", selectionRate: 0.24, isCorrect: false },
      { option: "vi", textFa: "The psychological impact on workforce", selectionRate: 0.15, isCorrect: false },
      { option: "ix", textFa: "Future predictions for 2050", selectionRate: 0.07, isCorrect: false },
    ],
  },
  {
    id: "psy-q-003",
    questionId: "q-konkur-voc-410",
    questionTitle: "کالوکیشن‌های کتاب ویژن ۳ درس ۱ (Sense of responsibility)",
    category: "konkur",
    difficultyIndex: 0.92, // Too Easy
    discriminationIndex: 0.15, // Poor discrimination
    totalAttempts: 890,
    correctAnswers: 819,
    avgDwellTimeSeconds: 24,
    status: "active",
    flagReason: "سوال بیش از حد آسان (۹۲٪ پاسخ صحیح) با توان تمایز پایین.",
    distractorAnalysis: [
      { option: "1", textFa: "sense of responsibility", selectionRate: 0.92, isCorrect: true },
      { option: "2", textFa: "feeling of kindness", selectionRate: 0.04, isCorrect: false },
      { option: "3", textFa: "taste of success", selectionRate: 0.02, isCorrect: false },
      { option: "4", textFa: "sight of duty", selectionRate: 0.02, isCorrect: false },
    ],
  },
];

export const INITIAL_APPEALS: GradeAppealCase[] = [
  {
    id: "app-case-501",
    studentId: "usr-stu-601",
    studentName: "کیانوش طاهری",
    examTitle: "ماک رسمی آیلتس آکادمیک آبان ماه",
    skill: "Writing Task 2",
    originalBand: 6.0,
    appealedAt: "2026-11-15T14:30:00Z",
    studentStatement:
      "من در آزمون قبلی باند ۷.۵ در رایتینگ گرفته بودم و در این آزمون تمام المان‌های Task Achievement را به شکل تفصیلی پوشش دادم؛ معتقدم نمره هوش مصنوعی بسیار سختگیرانه بوده است.",
    appealFeePaid: 250000,
    status: "under_investigation",
  },
  {
    id: "app-case-502",
    studentId: "usr-stu-742",
    studentName: "بهاره رضایی",
    examTitle: "ماک رسمی آیلتس آکادمیک آبان ماه",
    skill: "Speaking Task 2 & 3",
    originalBand: 6.5,
    appealedAt: "2026-11-14T11:00:00Z",
    studentStatement:
      "در حین ضبط صدای من نویز میکروفون رخ داده بود اما هوش مصنوعی آن را مِن‌مِن و تاخیر زبانی ارزیابی کرده است.",
    appealFeePaid: 250000,
    status: "upgraded",
    revisedBand: 7.5,
    decisionNotes: "فایل صوتی توسط داور ارشد گوش داده شد؛ نویز سخت‌افزاری تایید و نمره به ۷.۵ ارتقا یافت. وجه عودت شد.",
    refundIssued: true,
    adjudicatedBy: "دکتر مریم رضوانی",
    adjudicatedAt: "2026-11-15T16:20:00Z",
  },
];

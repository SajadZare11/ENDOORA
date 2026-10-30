/**
 * SIDA (سامانه سیدا وزارت آموزش و پرورش) Gradebook & Student Record Management
 */

export interface SubjectScoreBreakdown {
  english: number;
  math: number;
  science: number;
  literature: number;
  history: number;
}

export interface SidaStudentRecord {
  studentId: string;
  name: string;
  email: string;
  nationalCode: string;
  // Dynamic Exam/Quiz Grade
  examScore: number;
  isAbsent: boolean;
  weeklyStudyHours: number;
  // SIDA 4 Official Terms
  continuous1: number; // مستمر نوبت اول (ضریب ۱)
  final1: number; // پایانی نوبت اول (ضریب ۲)
  continuous2: number; // مستمر نوبت دوم (ضریب ۱)
  final2: number; // پایانی نوبت دوم (ضریب ۴ یا ۶)
  annualScore: number; // نمره سالانه محاسبه شده رسمی
  conduct: "عالی" | "خیلی خوب" | "خوب" | "نیاز به تلاش";
  // Cross-subject radar comparison
  subjectScores: SubjectScoreBreakdown;
  // Item question breakdown (Q1 to Q5) for psychometric item analysis
  itemScores: Record<string, number>;
}

export interface SidaGradebookState {
  classId: string;
  examTitle: string;
  maxScore: number; // 20, 10, 100, or custom
  sidaMultiplier: 4 | 6; // 6 for high school (div by 10), 4 for middle school (div by 8)
  students: SidaStudentRecord[];
  updatedAt: string;
}

export const EXAM_ITEMS = [
  { id: "q1", title: "سوال ۱: واژگان و درک متن", maxPoints: 4 },
  { id: "q2", title: "سوال ۲: گرامر و ساختار جمله", maxPoints: 4 },
  { id: "q3", title: "سوال ۳: مهارت شنیداری و تلفظ", maxPoints: 4 },
  { id: "q4", title: "سوال ۴: نگارش و انشا", maxPoints: 4 },
  { id: "q5", title: "سوال ۵: درک مطلب پیشرفته و تحلیل", maxPoints: 4 },
];

export const RADAR_SUBJECTS: Array<{ key: keyof SubjectScoreBreakdown; labelFa: string }> = [
  { key: "english", labelFa: "زبان انگلیسی" },
  { key: "math", labelFa: "ریاضی و هندسه" },
  { key: "science", labelFa: "علوم و فیزیک" },
  { key: "literature", labelFa: "ادبیات فارسی" },
  { key: "history", labelFa: "عربی و مطالعات" },
];

/**
 * Official Ministry of Education (SIDA) Annual Score Formula
 * High School: (Continuous1 * 1 + Final1 * 2 + Continuous2 * 1 + Final2 * 6) / 10
 * Middle School: (Continuous1 * 1 + Final1 * 2 + Continuous2 * 1 + Final2 * 4) / 8
 */
export function calculateSidaAnnualScore(
  continuous1: number,
  final1: number,
  continuous2: number,
  final2: number,
  multiplier: 4 | 6 = 6
): number {
  const sum = continuous1 * 1 + final1 * 2 + continuous2 * 1 + final2 * multiplier;
  const divisor = 4 + multiplier;
  return Number((sum / divisor).toFixed(2));
}

/**
 * Qualitative Mastery Badge Determinator:
 * >= 85%: عالی (سبز)
 * 70% - 84%: خوب (آبی)
 * 50% - 69%: متوسط (زرد)
 * < 50%: نیاز به تلاش (قرمز)
 */
export function getPerformanceTier(percentage: number): {
  level: "excellent" | "good" | "average" | "needs_effort";
  labelFa: string;
  badgeClass: string;
  colorHex: string;
} {
  if (percentage >= 85) {
    return {
      level: "excellent",
      labelFa: "عالی",
      badgeClass: "badge-excellent",
      colorHex: "#10b981", // green
    };
  }
  if (percentage >= 70) {
    return {
      level: "good",
      labelFa: "خوب",
      badgeClass: "badge-good",
      colorHex: "#3b82f6", // blue
    };
  }
  if (percentage >= 50) {
    return {
      level: "average",
      labelFa: "متوسط",
      badgeClass: "badge-average",
      colorHex: "#f59e0b", // yellow/amber
    };
  }
  return {
    level: "needs_effort",
    labelFa: "نیاز به تلاش/جبران",
    badgeClass: "badge-needs-effort",
    colorHex: "#ef4444", // red
  };
}

/**
 * Generates initial rich mock dataset or maps enrolled learners
 */
export function createDefaultSidaStudents(
  enrolledLearners?: Array<{ id: string; name: string; email: string }>
): SidaStudentRecord[] {
  const defaultSeeds: Array<Omit<SidaStudentRecord, "annualScore">> = [
    {
      studentId: "std-01",
      name: "سارا محمدی",
      email: "sara.mohammadi@example.com",
      nationalCode: "0012345678",
      examScore: 19.5,
      isAbsent: false,
      weeklyStudyHours: 14,
      continuous1: 19,
      final1: 19.5,
      continuous2: 20,
      final2: 19.5,
      conduct: "عالی",
      subjectScores: { english: 19.5, math: 18.5, science: 19, literature: 20, history: 19 },
      itemScores: { q1: 4, q2: 4, q3: 3.75, q4: 4, q5: 3.75 },
    },
    {
      studentId: "std-02",
      name: "علی رضایی",
      email: "ali.rezaei@example.com",
      nationalCode: "0023456789",
      examScore: 17.5,
      isAbsent: false,
      weeklyStudyHours: 11,
      continuous1: 17,
      final1: 18,
      continuous2: 18,
      final2: 17.5,
      conduct: "عالی",
      subjectScores: { english: 17.5, math: 19, science: 18, literature: 16.5, history: 17 },
      itemScores: { q1: 4, q2: 3.5, q3: 3.5, q4: 3.5, q5: 3 },
    },
    {
      studentId: "std-03",
      name: "امیرحسین پارسا",
      email: "amir.parsa@example.com",
      nationalCode: "0034567890",
      examScore: 14.5,
      isAbsent: false,
      weeklyStudyHours: 8,
      continuous1: 15,
      final1: 14,
      continuous2: 15.5,
      final2: 14.5,
      conduct: "خیلی خوب",
      subjectScores: { english: 14.5, math: 15, science: 14, literature: 15, history: 16 },
      itemScores: { q1: 3.5, q2: 3, q3: 3, q4: 2.5, q5: 2.5 },
    },
    {
      studentId: "std-04",
      name: "فاطمه کریمی",
      email: "fatemeh.karimi@example.com",
      nationalCode: "0045678901",
      examScore: 11.0,
      isAbsent: false,
      weeklyStudyHours: 5,
      continuous1: 12,
      final1: 11,
      continuous2: 12.5,
      final2: 11,
      conduct: "خوب",
      subjectScores: { english: 11, math: 13, science: 10.5, literature: 13, history: 12 },
      itemScores: { q1: 2.5, q2: 2, q3: 2.5, q4: 2, q5: 2 },
    },
    {
      studentId: "std-05",
      name: "نیما صادقی",
      email: "nima.sadeghi@example.com",
      nationalCode: "0056789012",
      examScore: 8.5,
      isAbsent: false,
      weeklyStudyHours: 3,
      continuous1: 9,
      final1: 8,
      continuous2: 10,
      final2: 8.5,
      conduct: "نیاز به تلاش",
      subjectScores: { english: 8.5, math: 10, science: 9, literature: 11, history: 9 },
      itemScores: { q1: 2, q2: 1.5, q3: 2, q4: 1.5, q5: 1.5 },
    },
    {
      studentId: "std-06",
      name: "مریم حسینی",
      email: "maryam.hosseini@example.com",
      nationalCode: "0067890123",
      examScore: 18.0,
      isAbsent: false,
      weeklyStudyHours: 12,
      continuous1: 18,
      final1: 18.5,
      continuous2: 19,
      final2: 18,
      conduct: "عالی",
      subjectScores: { english: 18, math: 17.5, science: 18, literature: 19, history: 18 },
      itemScores: { q1: 4, q2: 3.5, q3: 3.5, q4: 3.5, q5: 3.5 },
    },
    {
      studentId: "std-07",
      name: "سینا کاظمی",
      email: "sina.kazemi@example.com",
      nationalCode: "0078901234",
      examScore: 0,
      isAbsent: true, // Absent student
      weeklyStudyHours: 2,
      continuous1: 14,
      final1: 13.5,
      continuous2: 0,
      final2: 0,
      conduct: "خوب",
      subjectScores: { english: 12, math: 14, science: 13, literature: 14, history: 13 },
      itemScores: { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 },
    },
    {
      studentId: "std-08",
      name: "یاسمین شریفی",
      email: "yasmin.sharifi@example.com",
      nationalCode: "0089012345",
      examScore: 16.0,
      isAbsent: false,
      weeklyStudyHours: 9,
      continuous1: 16,
      final1: 16.5,
      continuous2: 17,
      final2: 16,
      conduct: "خیلی خوب",
      subjectScores: { english: 16, math: 15.5, science: 16, literature: 17, history: 16 },
      itemScores: { q1: 3.5, q2: 3.5, q3: 3, q4: 3, q5: 3 },
    },
  ];

  // If real enrolled learners are provided from database, merge or use them
  if (enrolledLearners && enrolledLearners.length > 0) {
    return enrolledLearners.map((learner, idx) => {
      const template = defaultSeeds[idx % defaultSeeds.length];
      const annualScore = calculateSidaAnnualScore(
        template.continuous1,
        template.final1,
        template.continuous2,
        template.final2,
        6
      );
      return {
        ...template,
        studentId: learner.id,
        name: learner.name || template.name,
        email: learner.email || template.email,
        nationalCode: `00${(10000000 + idx).toString()}`,
        annualScore,
      };
    });
  }

  return defaultSeeds.map((s) => ({
    ...s,
    annualScore: calculateSidaAnnualScore(s.continuous1, s.final1, s.continuous2, s.final2, 6),
  }));
}

const STORAGE_PREFIX = "endoora_sida_gradebook_";

/**
 * Loads SIDA Gradebook state from LocalStorage for classId
 */
export function loadSidaGradebook(
  classId: string,
  enrolledLearners?: Array<{ id: string; name: string; email: string }>
): SidaGradebookState {
  if (typeof window === "undefined") {
    const students = createDefaultSidaStudents(enrolledLearners);
    return {
      classId,
      examTitle: "ارزیابی جامع و آزمون کلاسی",
      maxScore: 20,
      sidaMultiplier: 6,
      students,
      updatedAt: new Date().toISOString(),
    };
  }

  try {
    const key = `${STORAGE_PREFIX}${classId}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed: SidaGradebookState = JSON.parse(raw);
      // Ensure recalculation of annual scores and backward compatibility
      if (parsed && Array.isArray(parsed.students)) {
        parsed.students = parsed.students.map((s) => ({
          ...s,
          annualScore: calculateSidaAnnualScore(
            s.continuous1,
            s.final1,
            s.continuous2,
            s.final2,
            parsed.sidaMultiplier || 6
          ),
        }));
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to load gradebook from localStorage:", err);
  }

  // Create fresh state
  const students = createDefaultSidaStudents(enrolledLearners);
  const freshState: SidaGradebookState = {
    classId,
    examTitle: "ارزیابی جامع و آزمون کلاسی",
    maxScore: 20,
    sidaMultiplier: 6,
    students,
    updatedAt: new Date().toISOString(),
  };
  saveSidaGradebook(freshState);
  return freshState;
}

/**
 * Saves SIDA Gradebook state to LocalStorage
 */
export function saveSidaGradebook(state: SidaGradebookState): void {
  if (typeof window === "undefined") return;
  try {
    const key = `${STORAGE_PREFIX}${state.classId}`;
    localStorage.setItem(key, JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save gradebook to localStorage:", err);
  }
}

/**
 * Resets SIDA Gradebook state to default seeds
 */
export function resetSidaGradebook(
  classId: string,
  enrolledLearners?: Array<{ id: string; name: string; email: string }>
): SidaGradebookState {
  const students = createDefaultSidaStudents(enrolledLearners);
  const freshState: SidaGradebookState = {
    classId,
    examTitle: "ارزیابی جامع و آزمون کلاسی",
    maxScore: 20,
    sidaMultiplier: 6,
    students,
    updatedAt: new Date().toISOString(),
  };
  saveSidaGradebook(freshState);
  return freshState;
}

/**
 * Exports complete Gradebook to Excel-compatible CSV with UTF-8 BOM
 */
export function exportSidaGradebookCsv(state: SidaGradebookState, classTitle: string): void {
  const headers = [
    "ردیف",
    "کد ملی",
    "نام و نام خانوادگی",
    "ایمیل",
    `نمره خام (سقف ${state.maxScore})`,
    "درصد",
    "سطح تسلط",
    "وضعیت حضور",
    "ساعت مطالعه هفتگی",
    "مستمر نوبت اول (ضریب ۱)",
    "پایانی نوبت اول (ضریب ۲)",
    "مستمر نوبت دوم (ضریب ۱)",
    `پایانی نوبت دوم (ضریب ${state.sidaMultiplier})`,
    "نمره سالانه سیدا",
    "نمره انضباط",
  ];

  const rows = state.students.map((s, idx) => {
    const percentage = state.maxScore > 0 ? ((s.examScore / state.maxScore) * 100).toFixed(1) : "0";
    const tier = getPerformanceTier(Number(percentage));
    const presence = s.isAbsent ? "غایب موجه/غیرموجه" : "حاضر";
    return [
      idx + 1,
      `="${s.nationalCode}"`,
      `"${s.name.replace(/"/g, '""')}"`,
      s.email,
      s.isAbsent ? "غایب" : s.examScore,
      `${percentage}%`,
      tier.labelFa,
      presence,
      s.weeklyStudyHours,
      s.continuous1,
      s.final1,
      s.continuous2,
      s.final2,
      s.annualScore,
      s.conduct,
    ].join(",");
  });

  // \ufeff is the UTF-8 Byte Order Mark (BOM) ensuring Persian text displays flawlessly in Excel
  const csvContent = "\ufeff" + [headers.join(","), ...rows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `كارنامه_سیدا_${classTitle.replace(/\s+/g, "_")}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

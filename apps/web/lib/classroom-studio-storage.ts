import type {
  ClassroomSessionData,
  ClassroomLoggedError,
  ClassroomVocabItem,
  ClassroomAgendaItem,
  ErrorCategory,
} from "@endoora/contracts";

const SESSION_PREFIX = "endoora_classroom_session_";
const MISTAKES_KEY = "endoora_learner_mistakes_v1";
const VOCAB_BANK_KEY = "endoora_learner_vocab_bank_v1";

export const ERROR_CATEGORIES: Array<{
  id: ErrorCategory;
  labelFa: string;
  badgeColor: string;
}> = [
  { id: "grammar", labelFa: "دستور زبان (Grammar)", badgeColor: "#2563eb" },
  { id: "vocabulary", labelFa: "انتخاب واژه (Vocabulary)", badgeColor: "#059669" },
  { id: "pronunciation", labelFa: "تلفظ و لهجه (Pronunciation)", badgeColor: "#d97706" },
  { id: "l1_persian", labelFa: "تداخل فارسی (L1 Transfer)", badgeColor: "#dc2626" },
  { id: "cohesion", labelFa: "پیوستگی کلام (Cohesion)", badgeColor: "#7c3aed" },
];

export function getCategoryLabelFa(cat: ErrorCategory): string {
  const match = ERROR_CATEGORIES.find((c) => c.id === cat);
  return match ? match.labelFa : cat;
}

export function getDefaultStarterSession(bookingId: string): ClassroomSessionData {
  const defaultAgenda: ClassroomAgendaItem[] = [
    {
      id: "agenda-1",
      titleFa: "احوال‌پرسی، گرم‌کردن و ارزیابی روانی صحبت (Warm-up & Fluency)",
      durationMinutes: 5,
      completed: true,
    },
    {
      id: "agenda-2",
      titleFa: "تمرین موضوعی پارت ۲ و شبیه‌سازی مکالمه فعال (Target Practice)",
      durationMinutes: 20,
      completed: false,
    },
    {
      id: "agenda-3",
      titleFa: "کالبدشکافی خطاهای گرامری و تلفظی فارسی (L1 Error Analysis)",
      durationMinutes: 15,
      completed: false,
    },
    {
      id: "agenda-4",
      titleFa: "جمع‌بندی، تعیین تکلیف منزل و هدف‌گذاری جلسه بعد (Wrap-up)",
      durationMinutes: 5,
      completed: false,
    },
  ];

  const initialErrors: ClassroomLoggedError[] = [
    {
      id: "err-demo-1",
      timestamp: "18:08",
      category: "grammar",
      categoryLabelFa: "دستور زبان (Grammar)",
      learnerSpoke: "I am agree with your opinion about technology.",
      nativeCorrection: "I agree with your opinion (or: I completely share your view).",
      explanationFa: "فعل agree یک فعل اصلی است و نباید با فعل to be (مانند am) ترکیب شود.",
      syncedToLeitner: false,
    },
    {
      id: "err-demo-2",
      timestamp: "18:14",
      category: "l1_persian",
      categoryLabelFa: "تداخل فارسی (L1 Transfer)",
      learnerSpoke: "We discussed about the recent economic problems.",
      nativeCorrection: "We discussed the recent economic problems.",
      explanationFa: "فعل discuss در انگلیسی متعدی است و نیازی به حرف اضافه about ندارد (ترجمه مستقیم از 'بحث کردن درباره').",
      syncedToLeitner: true,
    },
  ];

  const initialVocab: ClassroomVocabItem[] = [
    {
      id: "voc-demo-1",
      wordEn: "watershed moment",
      ipa: "/ˈwɔː.tə.ʃed ˈməʊ.mənt/",
      meaningFa: "نقطه عطف حیاتی و سرنوشت‌ساز",
      exampleSentenceEn: "Graduating from university was a watershed moment in my professional career.",
      syncedToVocabBank: true,
    },
    {
      id: "voc-demo-2",
      wordEn: "indispensable",
      ipa: "/ˌɪn.dɪˈspen.sə.bəl/",
      meaningFa: "ضروری، غیرقابل چشم‌پوشی",
      exampleSentenceEn: "Adaptive AI tools have become indispensable for personalized language acquisition.",
      syncedToVocabBank: false,
    },
  ];

  const starterNotes = `# یادداشت‌های تخته مشترک جلسه آموزشی (Shared Lesson Notes)
**موضوع جلسه:** تسلط بر پارت ۲ اسپیکینگ آیلتس و تکنیک داستان‌سرایی PPF (Past, Present, Future).

---

### فرمول طلایی جلسه امروز:
> «هرگز اجازه ندهید سکوت کلامی رخ دهد! اگر وقت اضافه آوردید، از زمان حال به چشم‌انداز آینده (Future Outlook) تغییر مسیر دهید.»

* **عبارت اتصال کلیدی:** *Looking ahead to the upcoming years, if circumstances permit...*
* **تلفظ /w/ در برابر /v/:** تمرین لب‌های غنچه در کلمات: *wonderful, world, with, were*.
`;

  return {
    bookingId,
    teacherName: "استاد مهدی رضایی (IELTS 8.5 Master Mentor)",
    learnerName: "زبان‌آموز گرامی",
    skillNameFa: "اسپیکینگ و مکالمه پیشرفته (IELTS Speaking Mastery)",
    durationMinutes: 45,
    startTimeIso: new Date().toISOString(),
    notesMarkdown: starterNotes,
    agenda: defaultAgenda,
    loggedErrors: initialErrors,
    vocabItems: initialVocab,
    homeworkAssigned: "۱) ضبط فایل صوتی ۲ دقیقه‌ای با موضوع 'A memorable journey' با رعایت ساختار PPF.\n۲) مرور ۵ واژه ثبت‌شده در لایتنر و نگارش یک پاراگراف برای هر کدام.",
    teacherFinalNotes: "روانی کلام شما در پارت اول عالی بود. تمرکز اصلی برای جلسه آینده روی تلفظ دقیق واج /w/ و پرهیز از افزودن حرف اضافه بعد از discuss باشد.",
    isCompleted: false,
  };
}

export function loadClassroomSession(bookingId: string): ClassroomSessionData {
  if (typeof window === "undefined") {
    return getDefaultStarterSession(bookingId);
  }
  try {
    const raw = localStorage.getItem(`${SESSION_PREFIX}${bookingId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Failed to parse classroom session from localStorage:", err);
  }
  const defaultSession = getDefaultStarterSession(bookingId);
  saveClassroomSession(defaultSession);
  return defaultSession;
}

export function saveClassroomSession(session: ClassroomSessionData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      `${SESSION_PREFIX}${session.bookingId}`,
      JSON.stringify(session)
    );
  } catch (err) {
    console.error("Failed to save classroom session to localStorage:", err);
  }
}

// -----------------------------------------------------------------------------
// LEITNER & MISTAKE BANK INTEGRATION
// -----------------------------------------------------------------------------

export interface StoredMistakeItem {
  id: string;
  source: string; // e.g. "Classroom #bookingId with teacherName"
  timestamp: string;
  category: string;
  originalMistake: string;
  correctedText: string;
  explanation: string;
  boxLevel: number; // Leitner box 1-5
  nextReviewAt: string;
}

export function syncErrorToLeitner(
  error: ClassroomLoggedError,
  sessionInfo: { bookingId: string; teacherName: string }
): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(MISTAKES_KEY);
    const mistakes: StoredMistakeItem[] = raw ? JSON.parse(raw) : [];

    const existingIndex = mistakes.findIndex((m) => m.id === error.id);
    const item: StoredMistakeItem = {
      id: error.id,
      source: `جلسه آنلاین ایندورا با ${sessionInfo.teacherName}`,
      timestamp: error.timestamp,
      category: error.categoryLabelFa,
      originalMistake: error.learnerSpoke,
      correctedText: error.nativeCorrection,
      explanation: error.explanationFa,
      boxLevel: 1,
      nextReviewAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), // tomorrow
    };

    if (existingIndex >= 0) {
      mistakes[existingIndex] = item;
    } else {
      mistakes.unshift(item);
    }

    localStorage.setItem(MISTAKES_KEY, JSON.stringify(mistakes));
    return true;
  } catch (err) {
    console.error("Failed to sync error to Leitner mistakes:", err);
    return false;
  }
}

export function syncVocabToBank(vocab: ClassroomVocabItem): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(VOCAB_BANK_KEY);
    const items: ClassroomVocabItem[] = raw ? JSON.parse(raw) : [];

    const existingIndex = items.findIndex((v) => v.id === vocab.id);
    if (existingIndex >= 0) {
      items[existingIndex] = vocab;
    } else {
      items.unshift(vocab);
    }

    localStorage.setItem(VOCAB_BANK_KEY, JSON.stringify(items));
    return true;
  } catch (err) {
    console.error("Failed to sync vocab to bank:", err);
    return false;
  }
}

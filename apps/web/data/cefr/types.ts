export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type LeitnerBoxLevel = 1 | 2 | 3 | 4 | 5;

export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "preposition"
  | "pronoun"
  | "conjunction"
  | "determiner"
  | "interjection"
  | "number"
  | "other";

export interface InductiveClues {
  contextClueEn: string; // Contextual sentence with [ ___ ] for the learner to infer the word
  situationHintFa: string; // Persian contextual/situational clue
  synonyms?: string[]; // Helpful English synonyms
  antonyms?: string[]; // Helpful English opposites
}

export interface PracticalExample {
  sentenceEn: string; // Real-world practical example sentence
  translationFa: string; // Natural Persian translation
}

export interface CEFRWord {
  id: string; // e.g. "a1-action"
  level: CEFRLevel;
  word: string; // Base headword: e.g. "action" or "add"
  displayTerm: string; // Display format: e.g. "action (n)" or "to add (v)"
  partOfSpeech: PartOfSpeech;
  partOfSpeechLabelFa: string; // e.g. "اسم (Noun)"
  phonetic: string; // IPA e.g. "/ˈæk.ʃən/"
  meaningFa: string; // Persian primary meaning e.g. "اقدام، عمل"
  englishDefinition: string; // Simple learner-friendly definition
  inductiveClues: InductiveClues;
  practicalExample: PracticalExample;
  lessonIndex: number; // Lesson group number (1-based, e.g. 1 to 87)
}

export interface CEFRCardState {
  wordId: string;
  level: CEFRLevel;
  boxLevel: LeitnerBoxLevel;
  intervalDays: number;
  lastReviewedAt?: string;
  nextReviewAt: string;
  consecutiveSuccesses: number;
  lapseCount: number;
  totalReviews: number;
  isMastered: boolean;
  addedAt: string;
}

export interface CEFRLevelStats {
  level: CEFRLevel;
  totalWords: number;
  learnedCount: number;
  dueTodayCount: number;
  boxCounts: Record<LeitnerBoxLevel, number>;
  masteredCount: number;
  progressPercentage: number;
}

export interface CEFRLevelMeta {
  level: CEFRLevel;
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  badgeColor: string;
  icon: string;
}

export const CEFR_LEVELS_META: Record<CEFRLevel, CEFRLevelMeta> = {
  A1: {
    level: "A1",
    titleFa: "سطح A1: مبتدی",
    titleEn: "Beginner",
    descriptionFa: "واژگان پایه‌ای روزمره، احوالپرسی، اشیاء، زمان و نیازهای اولیه",
    badgeColor: "#10b981", // Emerald
    icon: "🌱",
  },
  A2: {
    level: "A2",
    titleFa: "سطح A2: پیش‌مبتدی",
    titleEn: "Elementary",
    descriptionFa: "توصیف محیط، کار، خرید، احساسات و ارتباطات روزانه",
    badgeColor: "#06b6d4", // Cyan
    icon: "🌿",
  },
  B1: {
    level: "B1",
    titleFa: "سطح B1: متوسط",
    titleEn: "Intermediate",
    descriptionFa: "بیان تجربیات، امیدها، برنامه‌ها، نظرات شخصی و اصطلاحات رایج",
    badgeColor: "#3b82f6", // Blue
    icon: "🌳",
  },
  B2: {
    level: "B2",
    titleFa: "سطح B2: فرامتوسط",
    titleEn: "Upper-Intermediate",
    descriptionFa: "مفاهیم انتزاعی، متون تخصصی، استدلال و تعامل روان با انگلیسی‌زبانان",
    badgeColor: "#8b5cf6", // Purple
    icon: "⚡",
  },
  C1: {
    level: "C1",
    titleFa: "سطح C1: پیشرفته",
    titleEn: "Advanced",
    descriptionFa: "بیان روان، بدون تأمل آشکار، واژگان غنی آکادمیک و ساختارهای پیچیده",
    badgeColor: "#f59e0b", // Amber
    icon: "🔥",
  },
  C2: {
    level: "C2",
    titleFa: "سطح C2: تسلط کامل",
    titleEn: "Proficiency / Mastery",
    descriptionFa: "تسلط کامل، تمایز ظریف معانی و کاربرد در عالی‌ترین سطوح ادبی و حرفه‌ای",
    badgeColor: "#ec4899", // Pink
    icon: "👑",
  },
};

export const LEITNER_INTERVALS: Record<LeitnerBoxLevel, number> = {
  1: 1, // 1 day
  2: 3, // 3 days
  3: 7, // 1 week
  4: 14, // 2 weeks
  5: 30, // 1 month / Golden Mastered
};

export const LEITNER_BOX_META: Record<
  LeitnerBoxLevel,
  { labelFa: string; color: string; intervalDescFa: string; icon: string }
> = {
  1: {
    labelFa: "خانه ۱: تازه‌واردها",
    color: "#ef4444",
    intervalDescFa: "مرور روزانه (هر ۱ روز)",
    icon: "📥",
  },
  2: {
    labelFa: "خانه ۲: در حال یادگیری",
    color: "#f97316",
    intervalDescFa: "هر ۳ روز یک‌بار",
    icon: "🔄",
  },
  3: {
    labelFa: "خانه ۳: تثبیت اولیه",
    color: "#eab308",
    intervalDescFa: "هر هفته (۷ روز)",
    icon: "🌱",
  },
  4: {
    labelFa: "خانه ۴: حافظه پایدار",
    color: "#3b82f6",
    intervalDescFa: "هر ۲ هفته (۱۴ روز)",
    icon: "🧠",
  },
  5: {
    labelFa: "خانه ۵: فتح‌شده طلایی",
    color: "#10b981",
    intervalDescFa: "ماهانه / گنجینه تسلط",
    icon: "🏆",
  },
};

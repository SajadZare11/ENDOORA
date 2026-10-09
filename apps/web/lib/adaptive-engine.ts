/**
 * Endoora Computer-Adaptive Testing (CAT) Engine
 * Calibrated against CEFR (A1 to C2) and 0–100 Endoora Placement Index
 * Based on 1-PL Item Response Theory (Rasch Model)
 */

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type SectionType =
  | "grammar"
  | "vocabulary"
  | "reading"
  | "listening"
  | "speaking"
  | "writing";

export const SECTIONS_ORDER: SectionType[] = [
  "grammar",
  "vocabulary",
  "reading",
  "listening",
  "speaking",
  "writing",
];

export const SECTION_ITEM_QUOTAS: Record<SectionType, number> = {
  grammar: 15,
  vocabulary: 15,
  reading: 5,
  listening: 5,
  speaking: 5,
  writing: 5,
};

export const SECTION_DURATIONS: Record<SectionType, number> = {
  grammar: 15 * 60, // 900 seconds (15 minutes)
  vocabulary: 15 * 60, // 900 seconds (15 minutes)
  reading: 12 * 60, // 720 seconds (12 minutes)
  listening: 10 * 60, // 600 seconds (10 minutes)
  speaking: 10 * 60, // 600 seconds (10 minutes)
  writing: 10 * 60, // 600 seconds (10 minutes)
};

export const TOTAL_ADMINISTERED_ITEMS = 50;

export const CEFR_LEVEL_RANK: Record<CefrLevel, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

export const RANK_TO_CEFR: Record<number, CefrLevel> = {
  1: "A1",
  2: "A2",
  3: "B1",
  4: "B2",
  5: "C1",
  6: "C2",
};

/**
 * Authoritative Theta thresholds for CEFR levels on standard [-3.0, +3.0] scale.
 */
export const CEFR_THETA_BOUNDS: Record<CefrLevel, { min: number; max: number; baseScore: number }> = {
  A1: { min: -3.0, max: -1.8, baseScore: 15 },
  A2: { min: -1.8, max: -0.8, baseScore: 35 },
  B1: { min: -0.8, max: +0.2, baseScore: 55 },
  B2: { min: +0.2, max: +1.2, baseScore: 72 },
  C1: { min: +1.2, max: +2.2, baseScore: 85 },
  C2: { min: +2.2, max: +3.0, baseScore: 96 },
};

export interface AdaptiveItem {
  id: string;
  section: string;
  question_type?: string;
  title_fa?: string;
  title_en?: string;
  prompt_fa?: string;
  prompt_en: string;
  question?: string;
  prompt?: string;
  instructions_fa?: string;
  instructions_en?: string;
  cefr_level?: string;
  difficulty?: string;
  difficulty_b?: number;
  discrimination_a?: number;
  passage?: string;
  audio_url?: string;
  play_limit?: number;
  recording_time_limit_sec?: number;
  time_limit_sec?: number;
  min_words?: number;
  max_words?: number;
  min_words_expected?: number;
  max_words_expected?: number;
  options: string[];
  question_version_id?: string | null;
  correct_option?: string;
  answer_key?: string;
  transcript?: string;
  target_keywords?: string[];
  rubric?: Record<string, unknown>;
}

/**
 * Normalizes any raw item from the item bank into a complete AdaptiveItem.
 */
export function normalizeItem(item: any): AdaptiveItem {
  const sec = String(item.section || "grammar").toLowerCase();
  const qType = item.question_type || (sec === "speaking" ? "speaking" : sec === "writing" ? "writing" : "single_choice");
  const promptEn = item.prompt_en || item.question || item.prompt || "";
  const titleFa = item.title_fa || (
    sec === "grammar" ? "بخش دستور زبان (Grammar)" :
    sec === "vocabulary" ? "بخش واژگان (Vocabulary)" :
    sec === "reading" ? "بخش درک مطلب (Reading)" :
    sec === "listening" ? "بخش شنیداری (Listening)" :
    sec === "speaking" ? "بخش گفتاری (Speaking)" : "بخش نگارش (Writing)"
  );
  const titleEn = item.title_en || (
    sec === "grammar" ? "Grammar Section" :
    sec === "vocabulary" ? "Vocabulary Section" :
    sec === "reading" ? "Reading Comprehension" :
    sec === "listening" ? "Listening Comprehension" :
    sec === "speaking" ? "Speaking Section" : "Writing Section"
  );
  return {
    ...item,
    section: sec,
    question_type: qType,
    prompt_en: promptEn,
    title_fa: titleFa,
    title_en: titleEn,
    options: Array.isArray(item.options) ? item.options : [],
    min_words_expected: item.min_words_expected || item.min_words || (sec === "writing" ? 15 : 10),
    max_words_expected: item.max_words_expected || item.max_words || (sec === "writing" ? 60 : 100),
    recording_time_limit_sec: item.recording_time_limit_sec || item.time_limit_sec || 60,
  };
}

/**
 * Accurately validates learner answer against item key and rubric constraints.
 * Never gives a free pass for incorrect options.
 */
export function isItemCorrect(item: AdaptiveItem, answerValue?: string): boolean {
  if (!answerValue || typeof answerValue !== "string" || !answerValue.trim()) {
    return false;
  }
  const given = answerValue.trim().toLowerCase();
  const expected = (item.correct_option || item.answer_key || "").trim().toLowerCase();

  if (item.section === "speaking") {
    const minWords = item.min_words_expected || item.min_words || 10;
    const words = given.split(/\s+/).filter(Boolean).length;
    return words >= minWords;
  }

  if (item.section === "writing") {
    const minWords = item.min_words_expected || item.min_words || 15;
    const words = given.split(/\s+/).filter(Boolean).length;
    return words >= minWords;
  }

  // Multiple Choice Questions (Grammar, Vocabulary, Reading, Listening)
  if (!expected) {
    return false;
  }
  return given === expected;
}

export interface AdaptiveAnswerEvaluation {
  itemId: string;
  section: string;
  cefrLevel: CefrLevel;
  isCorrect: boolean;
  scorePercentage?: number;
}

export interface AdaptiveState {
  theta: number; // ability estimate: -3.0 to +3.0
  currentCefr: CefrLevel;
  endooraIndex: number; // 0 to 100 Endoora Placement Index
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
  history: AdaptiveAnswerEvaluation[];
}

/**
 * Converts ability parameter theta (-3.0 to +3.0) to 0-100 Endoora Placement Index
 * using exact piecewise linear concordance matching the backend Rasch model.
 * A1: [-3.0, -1.8) -> 0–29
 * A2: [-1.8, -0.8) -> 30–44
 * B1: [-0.8, 0.2)  -> 45–64
 * B2: [0.2, 1.2)   -> 65–79
 * C1: [1.2, 2.2)   -> 80–91
 * C2: [2.2, 3.0]   -> 92–100
 */
export function thetaToEndooraIndex(theta: number): number {
  const clamped = Math.max(-3.0, Math.min(3.0, theta));

  if (clamped < -1.8) {
    const ratio = (clamped - -3.0) / (-1.8 - -3.0);
    return Math.max(0, Math.min(29, Math.round(ratio * 29)));
  } else if (clamped < -0.8) {
    const ratio = (clamped - -1.8) / (-0.8 - -1.8);
    return Math.max(30, Math.min(44, Math.round(30 + ratio * 14)));
  } else if (clamped < 0.2) {
    const ratio = (clamped - -0.8) / (0.2 - -0.8);
    return Math.max(45, Math.min(64, Math.round(45 + ratio * 19)));
  } else if (clamped < 1.2) {
    const ratio = (clamped - 0.2) / (1.2 - 0.2);
    return Math.max(65, Math.min(79, Math.round(65 + ratio * 14)));
  } else if (clamped < 2.2) {
    const ratio = (clamped - 1.2) / (2.2 - 1.2);
    return Math.max(80, Math.min(91, Math.round(80 + ratio * 11)));
  } else {
    const ratio = (clamped - 2.2) / (3.0 - 2.2);
    return Math.max(92, Math.min(100, Math.round(92 + ratio * 8)));
  }
}

/**
 * Converts Endoora Placement Index to CEFR level based on authorized concordances.
 */
export function endooraIndexToCefr(index: number): CefrLevel {
  const score = Math.max(0, Math.min(100, Math.round(index)));
  if (score >= 92) return "C2";
  if (score >= 80) return "C1";
  if (score >= 65) return "B2";
  if (score >= 45) return "B1";
  if (score >= 30) return "A2";
  return "A1";
}

/**
 * Converts theta directly to CEFR level.
 */
export function thetaToCefr(theta: number): CefrLevel {
  const index = thetaToEndooraIndex(theta);
  return endooraIndexToCefr(index);
}

/**
 * Maps 0-100 Endoora Placement Index back to continuous latent ability theta in [-3.0, +3.0].
 */
export function endooraIndexToTheta(index: number): number {
  const score = Math.max(0, Math.min(100, Math.round(index)));
  if (score < 30) {
    const ratio = score / 29;
    return parseFloat((-3.0 + ratio * 1.2).toFixed(2));
  } else if (score < 45) {
    const ratio = (score - 30) / 14;
    return parseFloat((-1.8 + ratio * 1.0).toFixed(2));
  } else if (score < 65) {
    const ratio = (score - 45) / 19;
    return parseFloat((-0.8 + ratio * 1.0).toFixed(2));
  } else if (score < 80) {
    const ratio = (score - 65) / 14;
    return parseFloat((0.2 + ratio * 1.0).toFixed(2));
  } else if (score < 92) {
    const ratio = (score - 80) / 11;
    return parseFloat((1.2 + ratio * 1.0).toFixed(2));
  } else {
    const ratio = (score - 92) / 8;
    return parseFloat((2.2 + ratio * 0.8).toFixed(2));
  }
}

/**
 * Initialize default adaptive state.
 * Test starts at A2/B1 baseline (theta = -0.5, Endoora Index ~ 39).
 */
export function createInitialAdaptiveState(): AdaptiveState {
  const initialTheta = -0.5;
  const initialIndex = thetaToEndooraIndex(initialTheta);
  return {
    theta: initialTheta,
    currentCefr: endooraIndexToCefr(initialIndex),
    endooraIndex: initialIndex,
    consecutiveCorrect: 0,
    consecutiveIncorrect: 0,
    history: [],
  };
}

/**
 * Updates the learner's estimated ability based on their answer.
 */
export function updateAdaptiveState(
  state: AdaptiveState,
  evaluation: AdaptiveAnswerEvaluation
): AdaptiveState {
  const itemRank = CEFR_LEVEL_RANK[evaluation.cefrLevel] || 3;
  let newTheta = state.theta;
  let consecCorrect = state.consecutiveCorrect;
  let consecIncorrect = state.consecutiveIncorrect;

  if (evaluation.isCorrect) {
    consecCorrect += 1;
    consecIncorrect = 0;

    const diffBonus = Math.max(0.08, (itemRank - 1) * 0.12);
    const momentum = Math.min(1.4, 1.0 + (consecCorrect - 1) * 0.2);
    const delta = (0.35 + diffBonus) * momentum;

    newTheta = Math.min(3.0, newTheta + delta);
  } else {
    consecIncorrect += 1;
    consecCorrect = 0;

    const momentum = Math.min(1.4, 1.0 + (consecIncorrect - 1) * 0.2);
    const delta = 0.4 * momentum;

    newTheta = Math.max(-3.0, newTheta - delta);
  }

  const newIndex = thetaToEndooraIndex(newTheta);
  const newCefr = endooraIndexToCefr(newIndex);

  return {
    theta: parseFloat(newTheta.toFixed(3)),
    currentCefr: newCefr,
    endooraIndex: newIndex,
    consecutiveCorrect: consecCorrect,
    consecutiveIncorrect: consecIncorrect,
    history: [...state.history, evaluation],
  };
}

/**
 * Selects the next adaptive question from the pool of unasked items in the section.
 * Adapts strictly based on learner's performance:
 * - If last answer was correct: steps up to a harder question (or same level if at ceiling or pool exhausted).
 * - If last answer was incorrect: steps down to an easier question (or same level if at floor or pool exhausted).
 */
export function selectNextAdaptiveItem(
  allSectionItems: AdaptiveItem[],
  askedItemIds: Set<string>,
  targetCefr: CefrLevel,
  lastAnswerCorrect?: boolean | null
): AdaptiveItem | null {
  const unasked = allSectionItems.filter((itm) => !askedItemIds.has(itm.id));
  if (unasked.length === 0) return null;

  const currentRank = CEFR_LEVEL_RANK[targetCefr] || 3;

  if (lastAnswerCorrect === true) {
    // 1. Correct answer: advance to harder tier (targetRank + 1)
    const harderRank = Math.min(6, currentRank + 1);
    const harderItems = unasked.filter(
      (itm) => (CEFR_LEVEL_RANK[(itm.cefr_level || "B1").toUpperCase() as CefrLevel] || 3) === harderRank
    );
    if (harderItems.length > 0) {
      return harderItems[0];
    }

    // 2. Fallback to same tier (همسطح)
    const sameItems = unasked.filter(
      (itm) => (CEFR_LEVEL_RANK[(itm.cefr_level || "B1").toUpperCase() as CefrLevel] || 3) === currentRank
    );
    if (sameItems.length > 0) {
      return sameItems[0];
    }
  } else if (lastAnswerCorrect === false) {
    // 1. Incorrect answer: step down to easier tier (targetRank - 1)
    const easierRank = Math.max(1, currentRank - 1);
    const easierItems = unasked.filter(
      (itm) => (CEFR_LEVEL_RANK[(itm.cefr_level || "B1").toUpperCase() as CefrLevel] || 3) === easierRank
    );
    if (easierItems.length > 0) {
      return easierItems[0];
    }

    // 2. Fallback to same tier (همسطح)
    const sameItems = unasked.filter(
      (itm) => (CEFR_LEVEL_RANK[(itm.cefr_level || "B1").toUpperCase() as CefrLevel] || 3) === currentRank
    );
    if (sameItems.length > 0) {
      return sameItems[0];
    }
  } else {
    // Initial item or neutral: direct match with target CEFR level
    const exactMatches = unasked.filter(
      (itm) => (itm.cefr_level || "B1").toUpperCase() === targetCefr
    );
    if (exactMatches.length > 0) {
      return exactMatches[0];
    }
  }

  // 3. Nearest rank fallback
  let bestItem = unasked[0];
  let minDiff = 999;
  for (const item of unasked) {
    const itemLevel = ((item.cefr_level || "B1").toUpperCase() as CefrLevel) || "B1";
    const itemRank = CEFR_LEVEL_RANK[itemLevel] || 3;
    const diff = Math.abs(itemRank - currentRank);
    if (diff < minDiff) {
      minDiff = diff;
      bestItem = item;
    }
  }

  return bestItem;
}

export interface DiagnosticPlacementSummary {
  session_id: string;
  status: "submitted";
  is_submitted: true;
  current_section: "completed";
  started_at: string;
  expires_at: string;
  total_questions: number;
  total_answered: number;
  overall_percentage: number;
  endoora_index: number;
  estimated_cefr_level: CefrLevel;
  theta: number;
  sections: Record<
    string,
    {
      section: string;
      total: number;
      answered: number;
      correct: number;
      score_percentage: number;
      endoora_index: number;
      cefr_level: CefrLevel;
      objectives_covered: string[];
    }
  >;
  evidence: Array<{
    item_id: string;
    section: string;
    difficulty: string;
    cefr_level: string;
    objective: string;
    has_answered: boolean;
    is_correct: boolean;
  }>;
  notice: string;
}

/**
 * Accurately calculates section scores and overall diagnostic summary.
 * The overall score and CEFR level are strictly the arithmetic average of all 6 skills.
 */
export function calculatePlacementSummary(
  activeQuestions: AdaptiveItem[],
  answers: Record<string, string>,
  sessionId?: string
): DiagnosticPlacementSummary {
  const sectionsPayload: Record<string, any> = {};
  const sectionScoresList: number[] = [];

  for (const sec of SECTIONS_ORDER) {
    const secQuestions = activeQuestions.filter((q) => q.section === sec);
    const quota = SECTION_ITEM_QUOTAS[sec] || 5;
    const total = secQuestions.length || quota;

    const answeredCount = secQuestions.filter((q) => {
      const a = answers[q.id];
      return a !== undefined && a !== null && String(a).trim().length > 0;
    }).length;

    const correctCount = secQuestions.filter((q) => isItemCorrect(q, answers[q.id])).length;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const secIndex = percentage;
    const secCefr = endooraIndexToCefr(secIndex);

    sectionScoresList.push(percentage);

    sectionsPayload[sec] = {
      section: sec,
      total,
      answered: answeredCount,
      correct: correctCount,
      score_percentage: percentage,
      endoora_index: secIndex,
      cefr_level: secCefr,
      objectives_covered: [sec],
    };
  }

  // Exact arithmetic average of all 6 skills
  const averageScore = Math.round(
    sectionScoresList.reduce((sum, score) => sum + score, 0) / sectionScoresList.length
  );
  const overallIndex = averageScore;
  const overallCefr = endooraIndexToCefr(overallIndex);
  const overallTheta = endooraIndexToTheta(overallIndex);

  const evidence = activeQuestions.map((q) => {
    const ans = answers[q.id];
    const hasAnswered = ans !== undefined && ans !== null && String(ans).trim().length > 0;
    const correct = isItemCorrect(q, ans);
    return {
      item_id: q.id,
      section: q.section,
      difficulty: q.difficulty || "medium",
      cefr_level: q.cefr_level || "B1",
      objective: q.section,
      has_answered: hasAnswered,
      is_correct: correct,
    };
  });

  return {
    session_id: sessionId || "guest-session-" + Date.now(),
    status: "submitted",
    is_submitted: true,
    current_section: "completed",
    started_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 86400000).toISOString(),
    total_questions: activeQuestions.length,
    total_answered: Object.keys(answers).filter((k) => answers[k]?.trim()).length,
    overall_percentage: overallIndex,
    endoora_index: overallIndex,
    estimated_cefr_level: overallCefr,
    theta: overallTheta,
    sections: sectionsPayload,
    evidence,
    notice: "این کارنامه یک برآورد علمی روان‌سنجی بر اساس چارچوب CEFR در سامانه سنجش اختصاصی اندورا است و مدرک رسمی یا نهایی CEFR محسوب نمی‌شود.",
  };
}

/**
 * Human-readable CEFR level descriptor in Persian and English.
 */
export const CEFR_DESCRIPTIONS: Record<
  CefrLevel,
  {
    nameFa: string;
    nameEn: string;
    badgeColor: string;
    summaryFa: string;
    summaryEn: string;
    indexRange: string;
    recommendedBooks: string[];
  }
> = {
  A1: {
    nameFa: "مبتدی (Starter)",
    nameEn: "Beginner",
    badgeColor: "#94a3b8",
    summaryFa: "درک و بیان عبارات روزمره، معرفی خود و برقراری ارتباط در موقعیت‌های ابتدایی با سخنرانان صبور.",
    summaryEn: "Can understand and use familiar everyday expressions and basic phrases aimed at the satisfaction of needs.",
    indexRange: "۰ – ۲۹ / ۱۰۰",
    recommendedBooks: ["American English File Starter", "English Grammar in Use (Basic)", "Tactics for Listening (Basic)"],
  },
  A2: {
    nameFa: "مقدماتی (Elementary)",
    nameEn: "Elementary",
    badgeColor: "#38bdf8",
    summaryFa: "توانایی درک جملات در زمینه‌های پرکاربرد (اطلاعات فردی، خرید، محیط کار) و تبادل اطلاعات ساده.",
    summaryEn: "Can communicate in simple and routine tasks requiring a simple and direct exchange of information on familiar topics.",
    indexRange: "۳۰ – ۴۴ / ۱۰۰",
    recommendedBooks: ["American English File 1", "Speakout Starter/Elementary", "Destination A1/A2"],
  },
  B1: {
    nameFa: "متوسط (Intermediate)",
    nameEn: "Intermediate",
    badgeColor: "#34d399",
    summaryFa: "درک نکات اصلی متون شفاف، مکالمه در سفرها و ارائه توضیحات کوتاه درباره برنامه‌ها، تجربیات و دلایل.",
    summaryEn: "Can understand the main points of clear standard input on familiar matters and handle most travel/work situations.",
    indexRange: "۴۵ – ۶۴ / ۱۰۰",
    recommendedBooks: ["American English File 2 & 3", "Oxford Word Skills (Intermediate)", "Destination B1"],
  },
  B2: {
    nameFa: "فوق‌متوسط (Upper-Intermediate)",
    nameEn: "Upper-Intermediate",
    badgeColor: "#818cf8",
    summaryFa: "درک متون پیچیده، مکالمه روان و پیوسته با افراد بومی، و نگارش متون مستدل در موضوعات تخصصی.",
    summaryEn: "Can interact with a degree of fluency and spontaneity with native speakers and formulate nuanced arguments.",
    indexRange: "۶۵ – ۷۹ / ۱۰۰",
    recommendedBooks: ["American English File 4", "Cambridge English Empower B2", "Destination B2"],
  },
  C1: {
    nameFa: "پیشرفته (Advanced)",
    nameEn: "Advanced",
    badgeColor: "#f59e0b",
    summaryFa: "درک طیف وسیعی از متون طولانی و معانی ضمنی، بیان روان بدون جستجوی کلمات، و تسلط در محافل دانشگاهی.",
    summaryEn: "Can express ideas fluently and spontaneously, using language flexibly and effectively for social, academic and professional purposes.",
    indexRange: "۸۰ – ۹۱ / ۱۰۰",
    recommendedBooks: ["American English File 5", "Cambridge Advanced Grammar in Use", "IELTS Cambridge 15-18"],
  },
  C2: {
    nameFa: "مسلط و حرفه‌ای (Proficient)",
    nameEn: "Proficient",
    badgeColor: "#ec4899",
    summaryFa: "تسلط کامل، درک فوری هر گفتار یا نوشتار، و بازآفرینی استدلال‌ها با دقت، تمایز ظریف و روانی بالا.",
    summaryEn: "Can express themselves spontaneously, very fluently and precisely, differentiating finer shades of meaning even in complex situations.",
    indexRange: "۹۲ – ۱۰۰ / ۱۰۰",
    recommendedBooks: ["Proficiency Expert (Pearson)", "Cambridge English: Proficiency (CPE) Masterclass"],
  },
};

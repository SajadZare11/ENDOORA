import type {
  IeltsExamCategory,
  IeltsModule,
  IeltsQuestion,
  IeltsSkill,
  QuestionGradingResult,
  SkillScoreSummary,
} from "@endoora/contracts";

/**
 * Normalizes candidate input string for IELTS auto-grading:
 * - Trims whitespace and collapses multiple whitespace
 * - Converts to lower-case
 * - Strips trailing/leading punctuation
 * - Strips currency symbols and redundant articles ("a", "an", "the") when optional
 */
export function normalizeAnswer(input: string | null | undefined): string {
  if (input === null || input === undefined) return "";
  let str = String(input).trim().toLowerCase();

  // Replace typographic quotes and hyphens
  str = str.replace(/[‘’`]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-");

  // Remove currency signs (£, $, €)
  str = str.replace(/[£$€]/g, "");

  // Remove extraneous punctuation except internal hyphen or decimal point
  str = str.replace(/^[.,\/#!$%\^&\*;:{}=\-_~()"'?]+|[.,\/#!$%\^&\*;:{}=\-_~()"'?]+$/g, "");

  // Collapse multiple spaces
  str = str.replace(/\s+/g, " ").trim();

  // Strip leading redundant articles if the residual string is non-empty
  const articleStripped = str.replace(/^(the|a|an)\s+/i, "").trim();
  if (articleStripped.length > 0) {
    str = articleStripped;
  }

  return str;
}

/**
 * Checks if a user's answer is among the valid variations of accepted answers.
 */
export function isAnswerCorrect(
  userAnswer: string | string[] | null | undefined,
  acceptedAnswers: string[]
): boolean {
  if (!userAnswer) return false;

  // Multi-answer (checkboxes/multiple answers)
  if (Array.isArray(userAnswer)) {
    if (userAnswer.length === 0) return false;
    const normalizedUser = userAnswer.map(normalizeAnswer).sort().join("|");
    return acceptedAnswers.some((acc) => {
      // acc could be "A, B" or ["A", "B"]
      const splitted = acc
        .split(/[,/|]/)
        .map(normalizeAnswer)
        .sort()
        .join("|");
      return splitted === normalizedUser;
    });
  }

  const normalizedUser = normalizeAnswer(userAnswer);
  if (!normalizedUser) return false;

  // Normalization dictionary for True/False/Not Given & Yes/No/Not Given
  const tfMap: Record<string, string> = {
    t: "true",
    true: "true",
    f: "false",
    false: "false",
    ng: "not given",
    "not given": "not given",
    notgiven: "not given",
    y: "yes",
    yes: "yes",
    n: "no",
    no: "no",
  };

  const canonicalUser = tfMap[normalizedUser] || normalizedUser;

  for (const acc of acceptedAnswers) {
    const normalizedAcc = normalizeAnswer(acc);
    const canonicalAcc = tfMap[normalizedAcc] || normalizedAcc;

    if (canonicalUser === canonicalAcc) return true;

    // Numerical equivalence (e.g. "8:30" vs "8.30", "6.50" vs "6.5")
    const cleanNumUser = canonicalUser.replace(":", ".");
    const cleanNumAcc = canonicalAcc.replace(":", ".");
    if (cleanNumUser === cleanNumAcc) return true;
    if (!isNaN(Number(cleanNumUser)) && !isNaN(Number(cleanNumAcc))) {
      if (parseFloat(cleanNumUser) === parseFloat(cleanNumAcc)) return true;
    }
  }

  return false;
}

/**
 * Official IELTS Raw-to-Band score lookup tables.
 */
const LISTENING_TABLE: Array<[number, number]> = [
  [39, 9.0],
  [37, 8.5],
  [35, 8.0],
  [32, 7.5],
  [30, 7.0],
  [26, 6.5],
  [23, 6.0],
  [18, 5.5],
  [16, 5.0],
  [13, 4.5],
  [10, 4.0],
  [8, 3.5],
  [6, 3.0],
  [4, 2.5],
  [0, 2.0],
];

const ACADEMIC_READING_TABLE: Array<[number, number]> = [
  [39, 9.0],
  [37, 8.5],
  [35, 8.0],
  [33, 7.5],
  [30, 7.0],
  [27, 6.5],
  [23, 6.0],
  [19, 5.5],
  [15, 5.0],
  [13, 4.5],
  [10, 4.0],
  [8, 3.5],
  [6, 3.0],
  [4, 2.5],
  [0, 2.0],
];

const GENERAL_READING_TABLE: Array<[number, number]> = [
  [40, 9.0],
  [39, 8.5],
  [37, 8.0],
  [36, 7.5],
  [34, 7.0],
  [32, 6.5],
  [30, 6.0],
  [27, 5.5],
  [23, 5.0],
  [19, 4.5],
  [15, 4.0],
  [12, 3.5],
  [9, 3.0],
  [6, 2.5],
  [0, 2.0],
];

/**
 * Converts a raw score out of 40 to standard IELTS band score (0.0 to 9.0).
 */
export function calculateIeltsBandScore(
  rawScore: number,
  skill: IeltsSkill,
  category: IeltsExamCategory = "Academic"
): number {
  if (rawScore <= 0) return 1.0;
  const clampedRaw = Math.min(40, Math.max(0, Math.round(rawScore)));

  let table: Array<[number, number]>;
  if (skill === "listening") {
    table = LISTENING_TABLE;
  } else if (skill === "reading") {
    table = category === "General" ? GENERAL_READING_TABLE : ACADEMIC_READING_TABLE;
  } else {
    // For writing/speaking default to proration
    return 6.0;
  }

  for (const [minScore, band] of table) {
    if (clampedRaw >= minScore) {
      return band;
    }
  }

  return 1.0;
}

/**
 * Standard official IELTS half-band rounding:
 * Fraction < 0.25 -> rounds down (e.g. 6.125 -> 6.0)
 * Fraction >= 0.25 and < 0.75 -> rounds to .5 (e.g. 6.25 -> 6.5, 6.625 -> 6.5)
 * Fraction >= 0.75 -> rounds up (e.g. 6.75 -> 7.0)
 */
export function roundToIeltsBand(score: number): number {
  const whole = Math.floor(score);
  const frac = score - whole;

  if (frac < 0.25) {
    return Math.min(9.0, Math.max(1.0, whole));
  } else if (frac < 0.75) {
    return Math.min(9.0, Math.max(1.0, whole + 0.5));
  } else {
    return Math.min(9.0, Math.max(1.0, whole + 1.0));
  }
}

/**
 * Maps standard IELTS band score to CEFR level and descriptions.
 */
export function mapBandToCEFR(band: number): {
  level: string;
  descriptor_en: string;
  descriptor_fa: string;
} {
  if (band >= 8.5) {
    return {
      level: "C2",
      descriptor_en: "Proficient User / Mastery",
      descriptor_fa: "تسلط کامل و بومی — درک آسان متون پیچیده و استخراج تمامی جزئیات.",
    };
  }
  if (band >= 7.0) {
    return {
      level: "C1",
      descriptor_en: "Effective Operational Proficiency",
      descriptor_fa: "پیشرفته و مسلط — درک طیف وسیعی از متون و فایل‌های صوتی تخصصی.",
    };
  }
  if (band >= 5.5) {
    return {
      level: "B2",
      descriptor_en: "Vantage / Independent User",
      descriptor_fa: "کاربر مستقل — تسلط بر ایده‌های اصلی در شرایط مختلف کاری و تحصیلی.",
    };
  }
  if (band >= 4.0) {
    return {
      level: "B1",
      descriptor_en: "Threshold / Intermediate",
      descriptor_fa: "متوسط کاربردی — درک نکات اصلی موضوعات آشنا و روزمره.",
    };
  }
  return {
    level: "A2",
    descriptor_en: "Waystage / Elementary",
    descriptor_fa: "مقدماتی — نیازمند تمرین بیشتر بر روی واژگان پایه و قواعد ساختاری.",
  };
}

/**
 * Grades an entire IELTS exam module (Listening or Reading).
 */
export function gradeExamModule(
  module: IeltsModule,
  userAnswers: Record<number, string | string[]>,
  category: IeltsExamCategory = "Academic"
): {
  summary: SkillScoreSummary;
  gradingResults: QuestionGradingResult[];
  questionTypeStats: Record<
    string,
    { total: number; correct: number; accuracy: number }
  >;
  recommendations: string[];
} {
  const allQuestions: IeltsQuestion[] = [];
  module.sections.forEach((sec) => {
    sec.questions.forEach((q) => {
      allQuestions.push(q);
    });
  });

  const gradingResults: QuestionGradingResult[] = [];
  let correctCount = 0;
  const questionTypeStats: Record<
    string,
    { total: number; correct: number; accuracy: number }
  > = {};

  allQuestions.forEach((q) => {
    const userAns = userAnswers[q.question_number];
    const isCorrect = isAnswerCorrect(userAns, q.accepted_answers);

    if (isCorrect) correctCount++;

    gradingResults.push({
      question_number: q.question_number,
      question_id: q.id,
      user_answer: userAns ?? null,
      accepted_answers: q.accepted_answers,
      is_correct: isCorrect,
      score_earned: isCorrect ? 1 : 0,
      max_score: 1,
      explanation: q.explanation,
      passage_reference: q.passage_reference,
      transcript_timestamp: q.transcript_timestamp,
    });

    // Update stats per question type
    const qType = q.question_type;
    if (!questionTypeStats[qType]) {
      questionTypeStats[qType] = { total: 0, correct: 0, accuracy: 0 };
    }
    questionTypeStats[qType].total += 1;
    if (isCorrect) {
      questionTypeStats[qType].correct += 1;
    }
  });

  // Calculate percentage accuracy per type
  Object.keys(questionTypeStats).forEach((k) => {
    const item = questionTypeStats[k];
    item.accuracy = Math.round((item.correct / item.total) * 100);
  });

  const totalQuestions = allQuestions.length || 40;
  const rawScore = correctCount;
  const bandScore = calculateIeltsBandScore(rawScore, module.skill, category);
  const accuracyRate = Math.round((correctCount / totalQuestions) * 100);

  // Diagnostic advice
  const recommendations: string[] = [];
  if (accuracyRate >= 85) {
    recommendations.push(
      "عملکرد کلی شما بسیار برجسته و در رده داوطلبان نمره ۸ به بالا قرار دارد."
    );
  } else if (accuracyRate >= 70) {
    recommendations.push(
      "تسلط بسیار خوبی دارید؛ با تمرکز بر دام‌های تستی در سوالات تطبیقی می‌توانید نمره خود را به ۸ برسانید."
    );
  } else {
    recommendations.push(
      "پیشنهاد می‌شود تمرینات هدفمند بر روی تطبیق کلمات کلیدی مترادف (Paraphrasing) انجام دهید."
    );
  }

  // Type specific recommendations
  if (
    questionTypeStats["matching_headings"] &&
    questionTypeStats["matching_headings"].accuracy < 60
  ) {
    recommendations.push(
      "در سوالات Matching Headings، روی خواندن اجمالی (Skimming) و تشخیص ایده محوری هر پاراگراف تمرین کنید."
    );
  }
  if (
    questionTypeStats["true_false_not_given"] &&
    questionTypeStats["true_false_not_given"].accuracy < 65
  ) {
    recommendations.push(
      "در سوالات True/False/Not Given، به قیدهای محدودکننده مانند 'only', 'always', 'rarely' دقت فرمایید."
    );
  }
  if (
    questionTypeStats["fill_in_the_blank"] &&
    questionTypeStats["fill_in_the_blank"].accuracy < 70
  ) {
    recommendations.push(
      "در سوالات جای خالی، املای کلمات (Spelling) و محدودیت تعداد واژگان (Word Limit) را مجدداً مرور کنید."
    );
  }

  return {
    summary: {
      raw_score: rawScore,
      max_score: totalQuestions,
      band_score: bandScore,
      total_questions: totalQuestions,
      correct_count: correctCount,
      accuracy_rate: accuracyRate,
    },
    gradingResults,
    questionTypeStats,
    recommendations,
  };
}

/**
 * Tamrin20 Data Loader and Pedagogical Evaluation Engine
 * Grade 12 (Vision 3) Authentic Final Exam Question Bank
 */

import type {
  Tamrin20Skill,
  Tamrin20QuestionType,
  Tamrin20Explanation,
  Tamrin20Question,
  Tamrin20SkillBatch,
  Tamrin20LessonData,
  Tamrin20ProgressRecord,
} from "@endoora/contracts";

export type { Tamrin20QuestionType };

import lesson1Raw from "../data/highschool/tamrin20/grade12-lesson1-tamrin20.json" with { type: "json" };
import lesson2Raw from "../data/highschool/tamrin20/grade12-lesson2-tamrin20.json" with { type: "json" };
import lesson3Raw from "../data/highschool/tamrin20/grade12-lesson3-tamrin20.json" with { type: "json" };

// Type-cast imported JSON data
export const lesson1Data = lesson1Raw as unknown as Tamrin20LessonData;
export const lesson2Data = lesson2Raw as unknown as Tamrin20LessonData;
export const lesson3Data = lesson3Raw as unknown as Tamrin20LessonData;

export const ALL_LESSONS: Record<number, Tamrin20LessonData> = {
  1: lesson1Data,
  2: lesson2Data,
  3: lesson3Data,
};

export const ALL_SKILLS: Tamrin20Skill[] = [
  "listening",
  "vocabulary",
  "grammar",
  "reading",
  "writing",
];

export const SKILL_TITLES_FA: Record<Tamrin20Skill, string> = {
  listening: "شنیداری",
  vocabulary: "واژگان",
  grammar: "دستور زبان",
  reading: "درک مطلب",
  writing: "نگارش",
};

export const SKILL_TITLES_EN: Record<Tamrin20Skill, string> = {
  listening: "Listening",
  vocabulary: "Vocabulary",
  grammar: "Grammar",
  reading: "Reading",
  writing: "Writing",
};

export const STORAGE_KEY_PROGRESS = "endoora_tamrin20_progress_v1";

/**
 * Returns the typed lesson data for lesson 1, 2, or 3.
 */
export function getTamrin20Lesson(
  lessonNum: 1 | 2 | 3 | string | number
): Tamrin20LessonData | null {
  const parsed = typeof lessonNum === "string" ? Number.parseInt(lessonNum, 10) : lessonNum;
  return ALL_LESSONS[parsed] ?? null;
}

/**
 * Async version of getTamrin20Lesson for Next.js App Router server actions or dynamic imports.
 */
export async function getTamrin20LessonAsync(
  lessonNum: 1 | 2 | 3 | string | number
): Promise<Tamrin20LessonData | null> {
  return getTamrin20Lesson(lessonNum);
}

/**
 * Returns all 3 Grade 12 Vision 3 lessons.
 */
export function getAllTamrin20Lessons(): Tamrin20LessonData[] {
  return [lesson1Data, lesson2Data, lesson3Data];
}

/**
 * Returns the specific skill batch (e.g. grammar in lesson 1).
 */
export function getTamrin20SkillBatch(
  lessonNum: 1 | 2 | 3 | string | number,
  skill: Tamrin20Skill | string
): Tamrin20SkillBatch | null {
  const lesson = getTamrin20Lesson(lessonNum);
  if (!lesson) return null;
  return lesson.skills[skill as Tamrin20Skill] ?? null;
}

/**
 * Retrieves a single question by lesson, skill, and question ID.
 */
export function getTamrin20Question(
  lessonNum: 1 | 2 | 3 | string | number,
  skill: Tamrin20Skill | string,
  questionId: string
): Tamrin20Question | null {
  const batch = getTamrin20SkillBatch(lessonNum, skill);
  if (!batch) return null;
  return batch.questions.find((q) => q.id === questionId) ?? null;
}

/**
 * Normalizes user answer text by:
 * - Trimming leading/trailing whitespace
 * - Collapsing multiple internal spaces to a single space
 * - Lowercasing English characters
 * - Converting Persian digits (۰-۹) and Arabic digits (٠-٩) to ASCII digits (0-9)
 * - Normalizing Arabic Kaf (ك) to Persian Kaf (ک) and Arabic Yeh (ي) to Persian Yeh (ی)
 * - Trimming non-essential trailing punctuation (. , ! ? ؟)
 */
export function normalizeAnswer(input: unknown): string {
  if (input === null || input === undefined) return "";
  let text = String(input).trim();

  // Convert Persian & Arabic digits to ASCII
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  for (let i = 0; i < 10; i++) {
    text = text.replaceAll(persianDigits[i], String(i));
    text = text.replaceAll(arabicDigits[i], String(i));
  }

  // Normalize Persian/Arabic character variants
  text = text.replaceAll("ي", "ی").replaceAll("ك", "ک");

  // Lowercase & collapse spaces
  text = text.toLowerCase().replace(/\s+/g, " ");

  // Strip trailing punctuation
  text = text.replace(/[.,!?؟]+$/, "").trim();

  return text;
}

export interface Tamrin20EvaluationResult {
  isCorrect: boolean;
  feedbackState: "correct" | "incorrect";
  colorToken: string;
  revealedAnswer: string | number | null;
  revealedAnswerText: string | null;
  showExplanationToggle: boolean;
  isExplanationOpen: boolean;
  explanation: Tamrin20Explanation;
}

/**
 * Evaluates a user's answer against a Tamrin20 question.
 * Supports MCQ, fill-in-the-blank, cloze, matching, listening, and reading questions.
 */
export function evaluateAnswer(
  question: Tamrin20Question,
  userAnswer: unknown
): Tamrin20EvaluationResult {
  const normUser = normalizeAnswer(userAnswer);
  let isCorrect = false;

  if (question.questionType === "multiple_choice") {
    if (typeof userAnswer === "number") {
      isCorrect = userAnswer === question.correctAnswer;
    } else {
      const parsedNum = Number.parseInt(normUser, 10);
      if (!Number.isNaN(parsedNum) && parsedNum === question.correctAnswer) {
        isCorrect = true;
      } else if (Array.isArray(question.options)) {
        // Check if user entered the option text directly
        const correctOptionText = question.options[question.correctAnswer as number];
        if (correctOptionText && normalizeAnswer(correctOptionText) === normUser) {
          isCorrect = true;
        }
      }
    }
  } else if (Array.isArray(question.options) && question.options.length > 0) {
    // Other question types that provide options (e.g. True/False or ABCD in listening/reading)
    if (typeof question.correctAnswer === "number") {
      if (typeof userAnswer === "number") {
        isCorrect = userAnswer === question.correctAnswer;
      } else {
        const parsedNum = Number.parseInt(normUser, 10);
        if (!Number.isNaN(parsedNum) && parsedNum === question.correctAnswer) {
          isCorrect = true;
        } else {
          const correctOptionText = question.options[question.correctAnswer];
          if (correctOptionText && normalizeAnswer(correctOptionText) === normUser) {
            isCorrect = true;
          }
        }
      }
    } else {
      // correctAnswer is a string (like "True" or "False")
      const normCorrect = normalizeAnswer(question.correctAnswer);
      if (normUser === normCorrect && normUser.length > 0) {
        isCorrect = true;
      } else if (typeof userAnswer === "number" && question.options[userAnswer]) {
        isCorrect = normalizeAnswer(question.options[userAnswer]) === normCorrect;
      } else if (Array.isArray(question.acceptableAnswers)) {
        isCorrect = question.acceptableAnswers.some(
          (alt) => normalizeAnswer(alt) === normUser && normUser.length > 0
        );
      }
    }
  } else {
    // Free text, fill-in-the-blank, cloze, sentence combining, etc.
    const normCorrect = normalizeAnswer(question.correctAnswer);
    if (normUser === normCorrect && normUser.length > 0) {
      isCorrect = true;
    } else if (Array.isArray(question.acceptableAnswers)) {
      isCorrect = question.acceptableAnswers.some(
        (alt) => normalizeAnswer(alt) === normUser && normUser.length > 0
      );
    }
  }

  // Derive revealed answer text
  let revealedAnswerText: string | null = null;
  if (!isCorrect) {
    if (
      typeof question.correctAnswer === "number" &&
      Array.isArray(question.options) &&
      question.options[question.correctAnswer]
    ) {
      revealedAnswerText = question.options[question.correctAnswer];
    } else {
      revealedAnswerText = String(question.correctAnswer);
    }
  }

  return {
    isCorrect,
    feedbackState: isCorrect ? "correct" : "incorrect",
    colorToken: isCorrect ? "var(--color-success)" : "var(--color-danger)",
    revealedAnswer: isCorrect ? null : question.correctAnswer,
    revealedAnswerText,
    showExplanationToggle: isCorrect,
    isExplanationOpen: !isCorrect, // Auto-opened on incorrect, collapsed on correct
    explanation: question.explanation,
  };
}

/**
 * Progressive loading slice manager
 * Returns first 20 questions initially, and all questions upon expansion.
 */
export function getVisibleQuestions(
  allQuestions: Tamrin20Question[],
  isExpanded: boolean
): Tamrin20Question[] {
  if (!Array.isArray(allQuestions)) return [];
  if (isExpanded || allQuestions.length <= 20) {
    return allQuestions;
  }
  return allQuestions.slice(0, 20);
}

/**
 * Default empty progress record conforming to Tamrin20ProgressRecord
 */
export function createDefaultProgressRecord(): Tamrin20ProgressRecord {
  const skills: Tamrin20Skill[] = [
    "listening",
    "vocabulary",
    "grammar",
    "reading",
    "writing",
  ];
  const byLesson: Record<
    number,
    Record<Tamrin20Skill, { attempted: number; correct: number; timeSeconds: number }>
  > = {};

  for (const l of [1, 2, 3]) {
    byLesson[l] = {} as Record<
      Tamrin20Skill,
      { attempted: number; correct: number; timeSeconds: number }
    >;
    for (const s of skills) {
      byLesson[l][s] = { attempted: 0, correct: 0, timeSeconds: 0 };
    }
  }

  return {
    summary: {
      totalAttempted: 0,
      totalCorrect: 0,
      totalTimeSeconds: 0,
      lastActiveAt: new Date().toISOString(),
    },
    byLesson,
    weakTags: {},
    completedQuestionIds: [],
  };
}

/**
 * Records a question attempt into progress tracking state.
 */
export function recordQuestionAttempt(
  record: Tamrin20ProgressRecord,
  attempt: {
    lesson: 1 | 2 | 3 | number;
    skill: Tamrin20Skill;
    questionId: string;
    isCorrect: boolean;
    timeSeconds?: number;
    tag?: string;
  }
): Tamrin20ProgressRecord {
  const next: Tamrin20ProgressRecord = JSON.parse(JSON.stringify(record));
  const { lesson, skill, questionId, isCorrect, timeSeconds = 0, tag } = attempt;

  // Summary counters
  next.summary.totalAttempted += 1;
  if (isCorrect) next.summary.totalCorrect += 1;
  next.summary.totalTimeSeconds += timeSeconds;
  next.summary.lastActiveAt = new Date().toISOString();

  // byLesson counters
  if (!next.byLesson[lesson]) {
    next.byLesson[lesson] = {} as Record<
      Tamrin20Skill,
      { attempted: number; correct: number; timeSeconds: number }
    >;
  }
  if (!next.byLesson[lesson][skill]) {
    next.byLesson[lesson][skill] = { attempted: 0, correct: 0, timeSeconds: 0 };
  }
  next.byLesson[lesson][skill].attempted += 1;
  if (isCorrect) next.byLesson[lesson][skill].correct += 1;
  next.byLesson[lesson][skill].timeSeconds += timeSeconds;

  // Weak tag tracking on incorrect answers
  if (!isCorrect && tag) {
    next.weakTags[tag] = (next.weakTags[tag] || 0) + 1;
  }

  // Completed question IDs deduplication
  if (!next.completedQuestionIds.includes(questionId)) {
    next.completedQuestionIds.push(questionId);
  }

  return next;
}

/**
 * Safe deserializer for localStorage progress data with fallback.
 */
export function deserializeProgress(
  rawJson: string | null | undefined
): Tamrin20ProgressRecord {
  if (!rawJson || typeof rawJson !== "string") {
    return createDefaultProgressRecord();
  }
  try {
    const parsed = JSON.parse(rawJson);
    const def = createDefaultProgressRecord();
    return {
      summary: { ...def.summary, ...(parsed.summary || {}) },
      byLesson: { ...def.byLesson, ...(parsed.byLesson || {}) },
      weakTags: { ...(parsed.weakTags || {}) },
      completedQuestionIds: Array.isArray(parsed.completedQuestionIds)
        ? parsed.completedQuestionIds
        : [],
    };
  } catch {
    return createDefaultProgressRecord();
  }
}

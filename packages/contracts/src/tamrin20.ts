/**
 * Contracts for "تمرین تا ۲۰" (Vision 3 - پایه دوازدهم)
 * Authentic Final Exam practice data structures and student progress tracking.
 */

export type Tamrin20Skill = "listening" | "vocabulary" | "grammar" | "reading" | "writing";

export type Tamrin20QuestionType =
  | "multiple_choice"
  | "fill_in_the_blank"
  | "matching"
  | "cloze_test"
  | "reading_passage_qa"
  | "listening_comprehension"
  | "sentence_combining";

export interface Tamrin20Explanation {
  briefFa: string;
  detailedFa: string;
  pedagogicalRuleFa?: string;
}

export interface Tamrin20Question {
  id: string;
  grade: 12;
  lesson: 1 | 2 | 3;
  skill: Tamrin20Skill;
  examPeriod: string;
  questionType: Tamrin20QuestionType;
  prompt: string;
  promptFa?: string;
  passage?: string;
  audioUrl?: string;
  audioTimestamps?: {
    startSeconds: number;
    endSeconds: number;
  };
  options?: string[];
  correctAnswer: string | number;
  acceptableAnswers?: string[];
  explanation: Tamrin20Explanation;
  isInitialBatch: boolean;
  orderIndex: number;
  tag?: string;
}

export interface Tamrin20SkillBatch {
  skillTitleFa: string;
  skillTitleEn: string;
  totalQuestions: number;
  initialCount: number;
  questions: Tamrin20Question[];
}

export interface Tamrin20LessonData {
  grade: 12;
  book: "Vision 3";
  lesson: 1 | 2 | 3;
  titleFa: string;
  titleEn: string;
  skills: Record<Tamrin20Skill, Tamrin20SkillBatch>;
}

export interface Tamrin20ProgressRecord {
  summary: {
    totalAttempted: number;
    totalCorrect: number;
    totalTimeSeconds: number;
    lastActiveAt: string;
  };
  byLesson: Record<number, Record<Tamrin20Skill, { attempted: number; correct: number; timeSeconds: number }>>;
  weakTags: Record<string, number>;
  completedQuestionIds: string[];
}

/**
 * Official IELTS Exam Simulation Schema and Types
 * Compliant with Computer-Delivered IELTS standards.
 */

export type IeltsExamCategory = "Academic" | "General";

export type IeltsSkill = "listening" | "reading" | "writing" | "speaking";

export type IeltsQuestionType =
  | "multiple_choice"
  | "multiple_choice_multiple_answers"
  | "fill_in_the_blank"
  | "true_false_not_given"
  | "yes_no_not_given"
  | "matching_headings"
  | "matching_features"
  | "map_labelling";

export interface IeltsQuestionOption {
  id: string;
  text: string;
}

export interface IeltsQuestion {
  id: string;
  section_id: string;
  question_number: number; // Strictly 1 through 40 for L/R
  question_type: IeltsQuestionType;
  prompt: string; // Rich text / sentence with [blank_X] or question prompt
  options?: Array<IeltsQuestionOption | string>;
  accepted_answers: string[]; // Variations for auto-grading
  explanation: string;
  passage_reference?: string; // Text fragment or paragraph identifier for review
  transcript_timestamp?: string; // e.g., "02:45" for listening review
}

export interface IeltsSection {
  id: string;
  module_id: string;
  section_number: number; // 1-4 for Listening/Reading, 1-2 for Writing, 1-3 for Speaking
  passage_title: string;
  passage_content: string; // Rich text / HTML
  transcript?: string; // Optional transcript for post-exam review
  questions: IeltsQuestion[];
  instructions?: string;
}

export interface IeltsModule {
  id: string;
  exam_id: string;
  skill: IeltsSkill;
  duration_minutes: number; // Listening: 30-40, Reading: 60, Writing: 60, Speaking: 15
  total_questions: number; // Reading/Listening: 40
  audio_url?: string;
  sections: IeltsSection[];
}

export interface IeltsExam {
  id: string;
  title: string;
  category: IeltsExamCategory;
  source: string; // e.g. "Cambridge", "Recent Actual", "Endoora Official"
  description?: string;
  total_duration_minutes: number;
  modules: IeltsModule[];
  created_at: string;
  updated_at: string;
}

export type ExamAttemptStatus = "in_progress" | "submitted" | "reviewed";

export interface QuestionGradingResult {
  question_number: number;
  question_id: string;
  user_answer: string | string[] | null;
  accepted_answers: string[];
  is_correct: boolean;
  score_earned: number;
  max_score: number;
  explanation: string;
  passage_reference?: string;
  transcript_timestamp?: string;
}

export interface SkillScoreSummary {
  raw_score: number;
  max_score: number;
  band_score: number;
  total_questions: number;
  correct_count: number;
  accuracy_rate: number;
}

export interface ExamAttempt {
  id: string;
  user_id: string;
  exam_id: string;
  exam_title: string;
  category: IeltsExamCategory;
  skill: IeltsSkill | "full";
  module_id?: string;
  status: ExamAttemptStatus;
  started_at: string;
  finished_at?: string;
  time_spent_seconds: number;
  user_answers: Record<number, string | string[]>; // Keyed by question_number
  flagged_questions: number[]; // Question numbers flagged for review
  raw_score?: number;
  band_score?: number;
  section_scores?: Partial<Record<IeltsSkill, SkillScoreSummary>>;
  grading_results?: QuestionGradingResult[];
  diagnostic?: {
    accuracy_rate: number;
    question_type_stats: Record<
      string,
      { total: number; correct: number; accuracy: number }
    >;
    cefr_level: string;
    cefr_description_en: string;
    cefr_description_fa: string;
    recommendations: string[];
  };
}

// =============================================================================
// IELTS SKILL CLINICS & STRATEGY HUB CONTRACTS
// =============================================================================

export type ClinicSkill = "reading" | "writing" | "listening" | "speaking";

export interface ClinicTrapDeconstruction {
  id: string;
  trapTitleFa: string;
  trapTitleEn: string;
  contextPassageOrPrompt: string;
  commonWrongChoice: string;
  whyWrongFa: string;
  correctChoice: string;
  whyCorrectFa: string;
  examinerSecretFa: string;
}

export interface ClinicDrillQuestion {
  id: string;
  orderNumber: number;
  promptFa: string;
  promptEn: string;
  passageSnippet?: string;
  audioUrl?: string;
  audioTimestamp?: string;
  options: string[];
  correctAnswerIndex: number; // 0-based
  trapTypeBadge: string;
  explanation: {
    briefFa: string;
    detailedFa: string;
    cambridgeTipFa: string;
    vocabularyExtracted?: Array<{ word: string; fa: string; ipa?: string }>;
  };
}

export interface IeltsClinicData {
  id: string;
  skill: ClinicSkill;
  titleFa: string;
  titleEn: string;
  targetBands: string; // e.g. "Band 6.5 -> 8.0"
  estimatedMinutes: number;
  heroIcon: string;
  hurdleSummaryFa: string;
  badgeLabelFa: string;

  // Stage 1
  strategyGuide: {
    corePrinciplesFa: string[];
    goldenFormulaFa: string;
    goldenFormulaEn?: string;
    timeManagementTipFa: string;
    keyVocabulary?: Array<{ word: string; fa: string; ipa?: string }>;
  };

  // Stage 2
  trapDeconstructions: ClinicTrapDeconstruction[];

  // Stage 3
  drills: ClinicDrillQuestion[];
}

export interface ClinicProgressRecord {
  clinicId: string;
  skill: ClinicSkill;
  completed: boolean;
  score: number; // e.g. 5
  totalQuestions: number; // e.g. 6
  accuracyPercentage: number;
  timeSpentSeconds: number;
  badgeUnlocked: boolean;
  lastAttemptedAt: string;
  userAnswers: Record<string, number>; // questionId -> selectedIndex
}


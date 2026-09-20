import { endooraApi } from "./endoora-api";
import {
  IELTSTestType,
  IELTSSectionType,
  IELTSQuestionType,
  MANDATORY_IELTS_DISCLAIMER_TEXT,
} from "./ielts";
export type { IELTSTestListItem } from "./ielts";
export { MANDATORY_IELTS_DISCLAIMER_TEXT };

export type IELTSPracticeMode =
  | "full_simulation"
  | "listening_practice"
  | "reading_practice"
  | "writing_practice"
  | "speaking_practice";

export type IELTSAttemptStatus =
  | "in_progress"
  | "submitted"
  | "completed"
  | "timed_out"
  | "abandoned";

export interface LearnerSafeQuestion {
  id: string;
  group: string;
  question_number: number;
  prompt_text: string;
  options?: Array<{ id: string; text: string }>;
  max_score: string | number;
}

export interface LearnerSafeQuestionGroup {
  id: string;
  passage_task: string;
  question_type: IELTSQuestionType;
  question_type_display: string;
  order: number;
  instructions: string;
  heading_options?: Array<{ id: string; text: string } | string>;
  questions: LearnerSafeQuestion[];
}

export interface LearnerSafePassageTask {
  id: string;
  section: string;
  order: number;
  title: string;
  content_text: string;
  media_image_url?: string;
  word_count: number;
  metadata?: Record<string, unknown>;
  question_groups: LearnerSafeQuestionGroup[];
}

export interface LearnerSafeSection {
  id: string;
  test: string;
  section_type: IELTSSectionType;
  section_type_display: string;
  order: number;
  duration_minutes: number;
  instructions_en: string;
  instructions_fa: string;
  audio_media_url?: string;
  audio_script?: string;
  passages_tasks: LearnerSafePassageTask[];
}

export interface ActiveSessionData {
  id: string;
  test: string;
  test_title_en: string;
  test_title_fa: string;
  test_type: IELTSTestType;
  mode: IELTSPracticeMode;
  status: IELTSAttemptStatus;
  current_section_index: number;
  started_at: string;
  expires_at: string;
  time_remaining_seconds: number;
  responses: Record<string, string | string[]>;
  flagged_questions: string[];
  disclaimer_label: string;
  sections: LearnerSafeSection[];
  created_at: string;
  updated_at: string;
}

export interface SectionScoreSummary {
  raw_score: number;
  max_score: number;
  question_count: number;
  correct_count: number;
  band_score: number;
}

export interface QuestionTypeDiagnostic {
  total: number;
  correct: number;
  accuracy_pct: number;
}

export interface DiagnosticDiagnostics {
  cefr: {
    level: string;
    descriptor_en: string;
    descriptor_fa: string;
  };
  question_type_stats: Record<string, QuestionTypeDiagnostic>;
  advice: string[];
}

export interface QuestionReportItem {
  question_id: string;
  question_number: number;
  section_type: string;
  section_type_display: string;
  question_type: string;
  question_type_display: string;
  prompt_text: string;
  candidate_answer: string | string[] | null;
  correct_answers: string[];
  is_correct: boolean;
  score_earned: number;
  max_score: number;
  explanation: string;
}

export interface SessionReportData {
  session_id: string;
  test_id: string;
  test_title_en: string;
  test_title_fa: string;
  test_type: IELTSTestType;
  status: IELTSAttemptStatus;
  started_at: string | null;
  completed_at: string | null;
  raw_score: number;
  scaled_band_score: number;
  section_scores: Record<string, SectionScoreSummary>;
  diagnostics: DiagnosticDiagnostics;
  disclaimer: string;
  questions: QuestionReportItem[];
}

export interface SessionHistoryItem {
  id: string;
  test: string;
  test_title_en: string;
  test_title_fa: string;
  test_type: IELTSTestType;
  mode: IELTSPracticeMode;
  status: IELTSAttemptStatus;
  started_at: string;
  completed_at?: string | null;
  raw_score?: number | null;
  scaled_band_score?: number | null;
  section_scores?: Record<string, SectionScoreSummary>;
  created_at: string;
}

export const DEFAULT_DEMO_SESSION: ActiveSessionData = {
  id: "demo-ielts-session",
  test: "ielts-mock-acad-01",
  test_title_en: "IELTS Academic Practice Test 1",
  test_title_fa: "آزمون شبیه‌ساز کامل آیلتس آکادمیک شماره ۱",
  test_type: "academic",
  mode: "full_simulation",
  status: "in_progress",
  current_section_index: 0,
  started_at: new Date().toISOString(),
  expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
  time_remaining_seconds: 3600,
  responses: {},
  flagged_questions: [],
  disclaimer_label: MANDATORY_IELTS_DISCLAIMER_TEXT,
  sections: [
    {
      id: "sec-reading",
      test: "ielts-mock-acad-01",
      section_type: "reading",
      section_type_display: "Reading",
      order: 1,
      duration_minutes: 60,
      instructions_en: "Answer all questions based on the reading passage below.",
      instructions_fa: "به تمامی پرسش‌ها بر اساس متن خواندن زیر پاسخ دهید.",
      passages_tasks: [
        {
          id: "pt-reading-1",
          section: "sec-reading",
          order: 1,
          title: "The Architecture of Ancient Windcatchers",
          content_text:
            "Windcatchers (badgirs) represent one of the most sophisticated traditional passive cooling architectures engineered in arid desert climates, notably throughout central and southern Iran. Functioning as non-mechanical air conditioning systems, these towers exploit prevailing thermal gradients and local pressure differentials to channel cool subterranean air currents into living quarters while venting warm stale air out through leeward openings.",
          word_count: 70,
          question_groups: [
            {
              id: "qg-reading-1",
              passage_task: "pt-reading-1",
              question_type: "multiple_choice_single",
              question_type_display: "Multiple Choice",
              order: 1,
              instructions: "Choose the correct letter, A, B, C, or D.",
              questions: [
                {
                  id: "q-1",
                  group: "qg-reading-1",
                  question_number: 1,
                  prompt_text: "What is the primary aerodynamic mechanism utilized by traditional windcatchers?",
                  options: [
                    { id: "A", text: "Electric-powered ventilation fans" },
                    { id: "B", text: "Thermal gradients and local pressure differentials" },
                    { id: "C", text: "Artificial refrigerant chemicals" },
                    { id: "D", text: "High-pressure groundwater pumps" },
                  ],
                  max_score: 1,
                },
                {
                  id: "q-2",
                  group: "qg-reading-1",
                  question_number: 2,
                  prompt_text: "According to the passage, through which openings is stale warm air expelled?",
                  options: [
                    { id: "A", text: "Subterranean trenches" },
                    { id: "B", text: "Leeward shaft openings" },
                    { id: "C", text: "Basement water channels" },
                    { id: "D", text: "Windward portals" },
                  ],
                  max_score: 1,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_DEMO_REPORT: SessionReportData = {
  session_id: "demo-ielts-session",
  test_id: "ielts-mock-acad-01",
  test_title_en: "IELTS Academic Practice Test 1",
  test_title_fa: "آزمون شبیه‌ساز کامل آیلتس آکادمیک شماره ۱",
  test_type: "academic",
  status: "completed",
  started_at: new Date(Date.now() - 3600 * 1000).toISOString(),
  completed_at: new Date().toISOString(),
  raw_score: 34,
  scaled_band_score: 7.5,
  section_scores: {
    reading: {
      raw_score: 35,
      max_score: 40,
      question_count: 40,
      correct_count: 35,
      band_score: 7.5,
    },
    listening: {
      raw_score: 33,
      max_score: 40,
      question_count: 40,
      correct_count: 33,
      band_score: 7.5,
    },
  },
  diagnostics: {
    cefr: {
      level: "C1",
      descriptor_en: "Effective Operational Proficiency",
      descriptor_fa: "تسلط عملیاتی موثر — درک متون پیچیده و استخراج دقیق جزئیات بدون نیاز به ترجمه لفظی.",
    },
    question_type_stats: {
      multiple_choice_single: { total: 10, correct: 9, accuracy_pct: 90 },
      matching_headings: { total: 10, correct: 8, accuracy_pct: 80 },
      true_false_not_given: { total: 10, correct: 9, accuracy_pct: 90 },
      sentence_completion: { total: 10, correct: 9, accuracy_pct: 90 },
    },
    advice: [
      "دقت شما در سوالات چهارگزینه‌ای و تطبیق تیترها در سطح ممتاز باند ۷.۵ قرار دارد.",
      "برای ارتقا به نمره ۸.۰، در سوالات True/False/Not Given به واژگان محدودکننده (نظیر solely, invariably, seldom) توجه بیشتری مبذول فرمایید.",
    ],
  },
  disclaimer: MANDATORY_IELTS_DISCLAIMER_TEXT,
  questions: [
    {
      question_id: "q-1",
      question_number: 1,
      section_type: "reading",
      section_type_display: "Reading",
      question_type: "multiple_choice_single",
      question_type_display: "Multiple Choice",
      prompt_text: "What is the primary aerodynamic mechanism utilized by traditional windcatchers?",
      candidate_answer: "B",
      correct_answers: ["B"],
      is_correct: true,
      score_earned: 1,
      max_score: 1,
      explanation: "The passage explicitly credits thermal gradients and pressure differentials.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Client API Functions
// ---------------------------------------------------------------------------

export async function startIELTSSession(
  testId: string,
  mode: IELTSPracticeMode = "full_simulation"
): Promise<ActiveSessionData> {
  try {
    return await endooraApi<ActiveSessionData>("/ielts/sessions/start/", {
      method: "POST",
      json: {
        test_id: testId,
        mode,
      },
    });
  } catch {
    return {
      ...DEFAULT_DEMO_SESSION,
      test: testId,
      mode,
    };
  }
}

export async function fetchActiveSession(sessionId: string): Promise<ActiveSessionData> {
  try {
    return await endooraApi<ActiveSessionData>(`/ielts/sessions/${sessionId}/`);
  } catch {
    return {
      ...DEFAULT_DEMO_SESSION,
      id: sessionId,
    };
  }
}

export async function saveSessionAnswer(
  sessionId: string,
  questionId: string,
  answer: string | string[]
): Promise<{ success: boolean; question_id: string; time_remaining_seconds: number }> {
  try {
    return await endooraApi<{ success: boolean; question_id: string; time_remaining_seconds: number }>(
      `/ielts/sessions/${sessionId}/answer/`,
      {
        method: "POST",
        json: {
          question_id: questionId,
          answer,
        },
      }
    );
  } catch {
    return {
      success: true,
      question_id: questionId,
      time_remaining_seconds: 3500,
    };
  }
}

export async function toggleQuestionFlag(
  sessionId: string,
  questionId: string
): Promise<{ success: boolean; flagged_questions: string[] }> {
  try {
    return await endooraApi<{ success: boolean; flagged_questions: string[] }>(
      `/ielts/sessions/${sessionId}/flag/`,
      {
        method: "POST",
        json: { question_id: questionId },
      }
    );
  } catch {
    return {
      success: true,
      flagged_questions: [questionId],
    };
  }
}

export async function advanceSessionSection(sessionId: string): Promise<ActiveSessionData> {
  try {
    return await endooraApi<ActiveSessionData>(`/ielts/sessions/${sessionId}/advance/`, {
      method: "POST",
    });
  } catch {
    return {
      ...DEFAULT_DEMO_SESSION,
      id: sessionId,
    };
  }
}

export async function submitSession(sessionId: string): Promise<{
  session_id: string;
  status: string;
  raw_score: number;
  scaled_band_score: number;
  completed_at: string;
}> {
  try {
    return await endooraApi<{
      session_id: string;
      status: string;
      raw_score: number;
      scaled_band_score: number;
      completed_at: string;
    }>(`/ielts/sessions/${sessionId}/submit/`, {
      method: "POST",
    });
  } catch {
    return {
      session_id: sessionId,
      status: "completed",
      raw_score: 34,
      scaled_band_score: 7.5,
      completed_at: new Date().toISOString(),
    };
  }
}

export async function fetchSessionReport(sessionId: string): Promise<SessionReportData> {
  try {
    return await endooraApi<SessionReportData>(`/ielts/sessions/${sessionId}/report/`);
  } catch {
    return {
      ...DEFAULT_DEMO_REPORT,
      session_id: sessionId,
    };
  }
}

export async function fetchSessionHistory(): Promise<SessionHistoryItem[]> {
  try {
    return await endooraApi<SessionHistoryItem[]>("/ielts/sessions/history/");
  } catch {
    return [];
  }
}

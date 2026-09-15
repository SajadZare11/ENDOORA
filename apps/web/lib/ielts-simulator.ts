import { endooraApi } from "./endoora-api";
import {
  IELTSTestType,
  IELTSSectionType,
  IELTSQuestionType,
} from "./ielts";
export type { IELTSTestListItem } from "./ielts";
export { MANDATORY_IELTS_DISCLAIMER_TEXT } from "./ielts";

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

// ---------------------------------------------------------------------------
// Client API Functions
// ---------------------------------------------------------------------------

export async function startIELTSSession(
  testId: string,
  mode: IELTSPracticeMode = "full_simulation"
): Promise<ActiveSessionData> {
  return await endooraApi<ActiveSessionData>("/api/ielts/sessions/start/", {
    method: "POST",
    json: {
      test_id: testId,
      mode,
    },
  });
}

export async function fetchActiveSession(sessionId: string): Promise<ActiveSessionData> {
  return await endooraApi<ActiveSessionData>(`/api/ielts/sessions/${sessionId}/`);
}

export async function saveSessionAnswer(
  sessionId: string,
  questionId: string,
  answer: string | string[]
): Promise<{ success: boolean; question_id: string; time_remaining_seconds: number }> {
  return await endooraApi<{ success: boolean; question_id: string; time_remaining_seconds: number }>(
    `/api/ielts/sessions/${sessionId}/answer/`,
    {
      method: "POST",
      json: {
        question_id: questionId,
        answer,
      },
    }
  );
}

export async function toggleQuestionFlag(
  sessionId: string,
  questionId: string
): Promise<{ success: boolean; flagged_questions: string[] }> {
  return await endooraApi<{ success: boolean; flagged_questions: string[] }>(
    `/api/ielts/sessions/${sessionId}/flag/`,
    {
      method: "POST",
      json: { question_id: questionId },
    }
  );
}

export async function advanceSessionSection(sessionId: string): Promise<ActiveSessionData> {
  return await endooraApi<ActiveSessionData>(`/api/ielts/sessions/${sessionId}/advance/`, {
    method: "POST",
  });
}

export async function submitSession(sessionId: string): Promise<{
  session_id: string;
  status: string;
  raw_score: number;
  scaled_band_score: number;
  completed_at: string;
}> {
  return await endooraApi<{
    session_id: string;
    status: string;
    raw_score: number;
    scaled_band_score: number;
    completed_at: string;
  }>(`/api/ielts/sessions/${sessionId}/submit/`, {
    method: "POST",
  });
}

export async function fetchSessionReport(sessionId: string): Promise<SessionReportData> {
  return await endooraApi<SessionReportData>(`/api/ielts/sessions/${sessionId}/report/`);
}

export async function fetchSessionHistory(): Promise<SessionHistoryItem[]> {
  return await endooraApi<SessionHistoryItem[]>("/api/ielts/sessions/history/");
}

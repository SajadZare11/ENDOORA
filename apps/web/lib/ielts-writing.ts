import { endooraApi } from "./endoora-api";
import { MANDATORY_IELTS_DISCLAIMER_TEXT } from "./ielts";

export interface IELTSWritingPrompt {
  id: string;
  title: string;
  content_text: string;
  media_image_url?: string;
  word_count: number;
  task_type: "writing_task1_academic" | "writing_task1_general" | "writing_task2_essay";
  test_id?: string | null;
}

export interface IELTSWritingDraft {
  id: string;
  test?: string | null;
  session?: string | null;
  status: "draft" | "submitted" | "evaluated";
  task1_prompt_title: string;
  task1_prompt_text: string;
  task1_image_url?: string;
  task1_text: string;
  task1_word_count: number;
  task1_time_seconds: number;
  task2_prompt_title: string;
  task2_prompt_text: string;
  task2_text: string;
  task2_word_count: number;
  task2_time_seconds: number;
  updated_at: string;
}

export interface IELTSWritingSubmitPayload {
  submission_id?: string | null;
  test_id?: string | null;
  task1_prompt_title?: string;
  task1_prompt_text?: string;
  task1_image_url?: string;
  task1_text: string;
  task1_time_seconds: number;
  task2_prompt_title?: string;
  task2_prompt_text?: string;
  task2_text: string;
  task2_time_seconds: number;
}

export interface IELTSWritingAnnotation {
  task: 1 | 2;
  snippet: string;
  category: "grammar" | "lexical" | "cohesion" | "task_response";
  suggestion: string;
  explanation_en: string;
  explanation_fa: string;
}

export interface IELTSWritingCriteriaScore {
  score: number;
  descriptor_en: string;
  guidance_fa: string;
}

export interface TaskScores {
  ta?: number;
  tr?: number;
  cc: number;
  lr: number;
  gra: number;
  band: number;
  metadata?: {
    word_count?: number;
    paragraph_count?: number;
    sentence_count?: number;
    awl_word_count?: number;
    type_token_ratio?: number;
    cohesive_connectors_used?: string[];
    error_count?: number;
  };
}

export interface IELTSWritingReport {
  id: string;
  learner: number | string;
  test?: string | null;
  session?: string | null;
  status: "draft" | "submitted" | "evaluated";
  task1_prompt_title: string;
  task1_prompt_text: string;
  task1_image_url?: string;
  task1_text: string;
  task1_word_count: number;
  task1_time_seconds: number;
  task1_scores?: TaskScores;
  task2_prompt_title: string;
  task2_prompt_text: string;
  task2_text: string;
  task2_word_count: number;
  task2_time_seconds: number;
  task2_scores?: TaskScores;
  overall_band: number;
  overall_band_min: number;
  overall_band_max: number;
  confidence_score: number;
  cefr_level: string;
  criteria_breakdown: {
    task_achievement_or_response?: IELTSWritingCriteriaScore;
    coherence_and_cohesion?: IELTSWritingCriteriaScore;
    lexical_resource?: IELTSWritingCriteriaScore;
    grammatical_range_and_accuracy?: IELTSWritingCriteriaScore;
    [key: string]: IELTSWritingCriteriaScore | undefined;
  };
  annotations: IELTSWritingAnnotation[];
  pedagogical_advice: string[];
  teacher_review_requested: boolean;
  created_at: string;
  updated_at: string;
}

export interface IELTSWritingHistoryItem {
  id: string;
  status: "draft" | "submitted" | "evaluated";
  task1_prompt_title: string;
  task2_prompt_title: string;
  task1_word_count: number;
  task2_word_count: number;
  overall_band?: number | null;
  overall_band_min?: number | null;
  overall_band_max?: number | null;
  cefr_level: string;
  confidence_score: number;
  teacher_review_requested: boolean;
  created_at: string;
}

// =============================================================================
// API CLIENT METHODS WITH SECURE FALLBACKS
// =============================================================================

export async function fetchWritingPrompts(): Promise<IELTSWritingPrompt[]> {
  try {
    const data = await endooraApi<IELTSWritingPrompt[]>("/api/ielts/writing/prompts/");
    return data;
  } catch {
    return [
      {
        id: "default-task1",
        title: "Task 1: Renewable Energy Generation in Northern Europe",
        content_text:
          "The bar chart illustrates the proportion of domestic electricity generated from renewable sources (wind, hydro, and solar) across Denmark, Norway, and Sweden between 2015 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\nWrite at least 150 words.",
        media_image_url: "https://media.endoora.ir/diagrams/ielts/mini01_energy_chart.png",
        word_count: 150,
        task_type: "writing_task1_academic",
      },
      {
        id: "default-task2",
        title: "Task 2: Artificial Intelligence in Primary and Secondary Education",
        content_text:
          "Some educators assert that incorporating artificial intelligence tutors and adaptive learning platforms into schools substantially enhances student motivation and personalizes instruction. Others contend that algorithmic learning undermines critical inquiry and diminishes vital human empathy between students and classroom teachers.\n\nDiscuss both views and give your own opinion.\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\nWrite at least 250 words.",
        word_count: 250,
        task_type: "writing_task2_essay",
      },
    ];
  }
}

export async function saveWritingDraft(
  payload: Partial<IELTSWritingSubmitPayload>
): Promise<{ success: boolean; submission_id: string; task1_word_count: number; task2_word_count: number }> {
  return endooraApi<{
    success: boolean;
    submission_id: string;
    task1_word_count: number;
    task2_word_count: number;
  }>("/api/ielts/writing/draft/", {
    method: "POST",
    json: payload,
  });
}

export async function fetchWritingDraft(submissionId?: string): Promise<IELTSWritingDraft> {
  const url = submissionId
    ? `/api/ielts/writing/draft/${submissionId}/`
    : "/api/ielts/writing/draft/";
  return endooraApi<IELTSWritingDraft>(url);
}

export async function submitWriting(
  payload: IELTSWritingSubmitPayload
): Promise<IELTSWritingReport> {
  return endooraApi<IELTSWritingReport>("/api/ielts/writing/submit/", {
    method: "POST",
    json: payload,
  });
}

export async function fetchWritingReport(submissionId: string): Promise<IELTSWritingReport> {
  return endooraApi<IELTSWritingReport>(`/api/ielts/writing/report/${submissionId}/`);
}

export async function fetchWritingHistory(): Promise<IELTSWritingHistoryItem[]> {
  try {
    return await endooraApi<IELTSWritingHistoryItem[]>("/api/ielts/writing/history/");
  } catch {
    return [];
  }
}

export async function requestTeacherWritingReview(
  submissionId: string
): Promise<{ success: boolean; message: string; submission_id: string }> {
  return endooraApi<{ success: boolean; message: string; submission_id: string }>(
    `/api/ielts/writing/${submissionId}/request-teacher-review/`,
    {
      method: "POST",
      json: {},
    }
  );
}

export { MANDATORY_IELTS_DISCLAIMER_TEXT };

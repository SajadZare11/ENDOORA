import { endooraApi } from "./endoora-api";
import { MANDATORY_IELTS_DISCLAIMER_TEXT } from "./ielts";

export interface IELTSSpeakingPart1Prompt {
  title: string;
  instructions: string;
  questions: string[];
}

export interface IELTSSpeakingPart2Prompt {
  title: string;
  cue_card_prompt: string;
  bullet_points: string[];
  prep_time_seconds: number;
  speaking_time_seconds: number;
}

export interface IELTSSpeakingPart3Prompt {
  title: string;
  instructions: string;
  questions: string[];
}

export interface IELTSSpeakingPrompt {
  id: string;
  title: string;
  test_id?: string | null;
  part1: IELTSSpeakingPart1Prompt;
  part2: IELTSSpeakingPart2Prompt;
  part3: IELTSSpeakingPart3Prompt;
}

export interface IELTSSpeakingDraft {
  id: string;
  test?: string | null;
  session?: string | null;
  status: "draft" | "submitted" | "evaluated";
  part1_prompt_title: string;
  part1_questions: string[];
  part1_recording_url?: string;
  part1_transcript: string;
  part1_duration_seconds: number;
  part2_cue_card_title: string;
  part2_cue_card_prompt: string;
  part2_bullet_points: string[];
  part2_prep_notes: string;
  part2_prep_time_seconds: number;
  part2_recording_url?: string;
  part2_transcript: string;
  part2_duration_seconds: number;
  part3_prompt_title: string;
  part3_questions: string[];
  part3_recording_url?: string;
  part3_transcript: string;
  part3_duration_seconds: number;
  updated_at: string;
}

export interface IELTSSpeakingSubmitPayload {
  submission_id?: string | null;
  test_id?: string | null;
  session_id?: string | null;
  part1_prompt_title?: string;
  part1_questions?: string[];
  part1_recording_url?: string;
  part1_transcript: string;
  part1_duration_seconds: number;
  part2_cue_card_title?: string;
  part2_cue_card_prompt?: string;
  part2_bullet_points?: string[];
  part2_prep_notes?: string;
  part2_prep_time_seconds?: number;
  part2_recording_url?: string;
  part2_transcript: string;
  part2_duration_seconds: number;
  part3_prompt_title?: string;
  part3_questions?: string[];
  part3_recording_url?: string;
  part3_transcript: string;
  part3_duration_seconds: number;
}

export interface IELTSSpeakingCriteriaScore {
  score: number;
  title_fa: string;
  descriptor_en: string;
  guidance_fa: string;
}

export interface IELTSSpeakingAnnotation {
  part: number;
  snippet: string;
  category: "grammar" | "lexical" | "cohesion";
  suggestion: string;
  explanation_en: string;
  explanation_fa: string;
}

export interface PersianPhonologyFlag {
  sound: string;
  title_fa: string;
  guidance_fa: string;
  sample_words: string[];
}

export interface IELTSSpeakingFluencyMetrics {
  composite_wpm: number;
  total_words: number;
  total_duration_seconds: number;
  hesitation_count: number;
  hesitation_ratio: number;
  discourse_markers_count: number;
  discourse_markers_used: string[];
  part1_wpm: number;
  part2_wpm: number;
  part3_wpm: number;
}

export interface IELTSSpeakingPronunciationDiagnostics {
  intelligibility_score: number;
  pacing_stability: "Optimal" | "Slow" | "Fast";
  persian_phonological_flags: PersianPhonologyFlag[];
  syllable_stress_note: string;
}

export interface IELTSSpeakingReport {
  id: string;
  learner: number | string;
  test?: string | null;
  session?: string | null;
  status: "draft" | "submitted" | "evaluated";
  part1_prompt_title: string;
  part1_questions: string[];
  part1_recording_url?: string;
  part1_transcript: string;
  part1_duration_seconds: number;
  part2_cue_card_title: string;
  part2_cue_card_prompt: string;
  part2_bullet_points: string[];
  part2_prep_notes: string;
  part2_prep_time_seconds: number;
  part2_recording_url?: string;
  part2_transcript: string;
  part2_duration_seconds: number;
  part3_prompt_title: string;
  part3_questions: string[];
  part3_recording_url?: string;
  part3_transcript: string;
  part3_duration_seconds: number;
  fc_score: number;
  lr_score: number;
  gra_score: number;
  pr_score: number;
  overall_band: number;
  overall_band_min: number;
  overall_band_max: number;
  confidence_score: number;
  cefr_level: string;
  criteria_breakdown: {
    fluency_and_coherence?: IELTSSpeakingCriteriaScore;
    lexical_resource?: IELTSSpeakingCriteriaScore;
    grammatical_range_and_accuracy?: IELTSSpeakingCriteriaScore;
    pronunciation?: IELTSSpeakingCriteriaScore;
    [key: string]: IELTSSpeakingCriteriaScore | undefined;
  };
  fluency_metrics: IELTSSpeakingFluencyMetrics;
  pronunciation_diagnostics: IELTSSpeakingPronunciationDiagnostics;
  annotations: IELTSSpeakingAnnotation[];
  pedagogical_advice: string[];
  teacher_review_requested: boolean;
  created_at: string;
  updated_at: string;
}

export interface IELTSSpeakingHistoryItem {
  id: string;
  status: "draft" | "submitted" | "evaluated";
  part1_prompt_title: string;
  part2_cue_card_title: string;
  part3_prompt_title: string;
  overall_band?: number | null;
  overall_band_min?: number | null;
  overall_band_max?: number | null;
  fc_score?: number | null;
  lr_score?: number | null;
  gra_score?: number | null;
  pr_score?: number | null;
  cefr_level: string;
  confidence_score: number;
  teacher_review_requested: boolean;
  created_at: string;
}

// =============================================================================
// DEFAULT FALLBACK PROMPT
// =============================================================================

export const DEFAULT_SPEAKING_FALLBACK_PROMPT: IELTSSpeakingPrompt = {
  id: "default-speaking-sim",
  title: "Endoora Academic Speaking Diagnostic 01",
  part1: {
    title: "Part 1: Daily Habits, Neighborhood & Technology",
    instructions: "The examiner asks general questions about your background, living area, and daily morning routines.",
    questions: [
      "What do you enjoy most about the neighborhood where you currently reside?",
      "Has your personal morning routine altered noticeably over the past two years?",
      "Do you prefer studying or working in the early morning or late evening? Why?",
    ],
  },
  part2: {
    title: "Part 2: Long Turn (Cue Card)",
    cue_card_prompt:
      "Describe a complex practical skill you acquired independently outside of a formal educational institution.\n\nYou should say:\n- What skill you acquired\n- Why you decided to pursue it independently\n- What resources or learning techniques you utilized\n\nand explain what obstacles you encountered and how you felt once you achieved proficiency.",
    bullet_points: [
      "What skill you acquired",
      "Why you decided to pursue it independently",
      "What resources or learning techniques you utilized",
      "Explain obstacles encountered and how you felt upon achieving proficiency",
    ],
    prep_time_seconds: 60,
    speaking_time_seconds: 120,
  },
  part3: {
    title: "Part 3: Discussion on Lifelong Education & Autonomous Learning",
    instructions: "The examiner explores deeper, abstract questions regarding self-directed learning and workplace demands.",
    questions: [
      "Why do many adults find self-directed online tutorials more productive than conventional classroom courses?",
      "In the coming decades, will demonstrable project portfolios overshadow traditional degree credentials in hiring decisions?",
      "What role should national educational systems play in supporting continuous adult upskilling?",
    ],
  },
};

// =============================================================================
// API CLIENT METHODS
// =============================================================================

import { getIeltsExamById } from "../data/ielts/index.ts";

export async function fetchSpeakingPrompts(testId?: string): Promise<IELTSSpeakingPrompt[]> {
  if (testId) {
    const exam = getIeltsExamById(testId);
    if (exam) {
      const sMod = exam.modules.find((m) => m.skill === "speaking");
      if (sMod && sMod.sections.length >= 3) {
        return [
          {
            id: sMod.id,
            title: exam.title,
            test_id: exam.id,
            part1: {
              title: sMod.sections[0].passage_title,
              instructions: sMod.sections[0].instructions || "Answer the examiner's questions clearly.",
              questions: [
                "What aspects of your daily routine do you find most productive?",
                "How has digital communication transformed how you interact with friends?",
                "What hobbies do you typically pursue during weekend free time?",
              ],
            },
            part2: {
              title: sMod.sections[1].passage_title,
              cue_card_prompt: sMod.sections[1].passage_content,
              bullet_points: [
                "What the topic or experience was",
                "Why it was meaningful or challenging",
                "What actions you took",
                "And explain what you learned from this experience.",
              ],
              prep_time_seconds: 60,
              speaking_time_seconds: 120,
            },
            part3: {
              title: sMod.sections[2].passage_title,
              instructions: sMod.sections[2].instructions || "Discuss these abstract themes with the examiner.",
              questions: [
                "How do generational differences influence attitudes toward this topic?",
                "What role should government policy play in regulating these societal changes?",
                "Do you believe future technological advances will resolve these challenges?",
              ],
            },
          },
        ];
      }
    }
  }

  const data = await endooraApi<IELTSSpeakingPrompt[]>("/api/ielts/speaking/prompts/");
  return data && data.length > 0 ? data : [DEFAULT_SPEAKING_FALLBACK_PROMPT];
}

export async function fetchSpeakingDraft(submissionId?: string): Promise<IELTSSpeakingDraft | null> {
  const url = submissionId ? `/api/ielts/speaking/draft/${submissionId}/` : `/api/ielts/speaking/draft/`;
  const data = await endooraApi<IELTSSpeakingDraft>(url);
  return data;
}

export async function saveSpeakingDraft(payload: {
  submission_id?: string | null;
  part1_prompt_title?: string;
  part1_questions?: string[];
  part1_recording_url?: string;
  part1_transcript?: string;
  part1_duration_seconds?: number;
  part2_cue_card_title?: string;
  part2_cue_card_prompt?: string;
  part2_bullet_points?: string[];
  part2_prep_notes?: string;
  part2_prep_time_seconds?: number;
  part2_recording_url?: string;
  part2_transcript?: string;
  part2_duration_seconds?: number;
  part3_prompt_title?: string;
  part3_questions?: string[];
  part3_recording_url?: string;
  part3_transcript?: string;
  part3_duration_seconds?: number;
}): Promise<{ success: boolean; submission_id: string; status: string; updated_at: string }> {
  const data = await endooraApi<{
    success: boolean;
    submission_id: string;
    status: string;
    updated_at: string;
  }>("/api/ielts/speaking/draft/", {
    method: "POST",
    json: payload,
  });
  return data;
}

export async function submitSpeaking(payload: IELTSSpeakingSubmitPayload): Promise<IELTSSpeakingReport> {
  const data = await endooraApi<IELTSSpeakingReport>("/api/ielts/speaking/submit/", {
    method: "POST",
    json: payload,
  });
  return data;
}

export async function fetchSpeakingReport(submissionId: string): Promise<IELTSSpeakingReport> {
  const data = await endooraApi<IELTSSpeakingReport>(`/api/ielts/speaking/report/${submissionId}/`);
  return data;
}

export async function fetchSpeakingHistory(): Promise<IELTSSpeakingHistoryItem[]> {
  const data = await endooraApi<IELTSSpeakingHistoryItem[]>("/api/ielts/speaking/history/");
  return data;
}

export async function requestTeacherSpeakingReview(submissionId: string): Promise<{ success: boolean; message: string }> {
  const data = await endooraApi<{ success: boolean; message: string }>(
    `/api/ielts/speaking/${submissionId}/request-teacher-review/`,
    { method: "POST" }
  );
  return data;
}

export { MANDATORY_IELTS_DISCLAIMER_TEXT };

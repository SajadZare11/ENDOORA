import { endooraApi } from "./endoora-api";

export type IELTSTestType = "academic" | "general_training";
export type IELTSSectionType = "listening" | "reading" | "writing" | "speaking";
export type IELTSTestStatus = "draft" | "in_review" | "approved" | "published" | "archived";

export type IELTSQuestionType =
  | "multiple_choice_single"
  | "multiple_choice_multiple"
  | "true_false_not_given"
  | "yes_no_not_given"
  | "matching_headings"
  | "matching_information"
  | "matching_features"
  | "sentence_completion"
  | "summary_completion"
  | "note_form_completion"
  | "diagram_map_labelling"
  | "table_flowchart_completion"
  | "writing_task1_academic"
  | "writing_task1_general"
  | "writing_task2_essay"
  | "speaking_part1"
  | "speaking_part2_cue_card"
  | "speaking_part3_discussion";

export interface IELTSQuestionOption {
  id: string;
  text: string;
}

export interface IELTSQuestion {
  id: string;
  group: string;
  question_number: number;
  prompt_text: string;
  options: IELTSQuestionOption[];
  correct_answers: string[];
  explanation: string;
  max_score: string | number;
  created_at: string;
  updated_at: string;
}

export interface IELTSQuestionGroup {
  id: string;
  passage_task: string;
  question_type: IELTSQuestionType;
  question_type_display: string;
  order: number;
  instructions: string;
  heading_options: Array<{ id: string; text: string } | string>;
  questions: IELTSQuestion[];
  created_at: string;
  updated_at: string;
}

export interface IELTSPassageTask {
  id: string;
  section: string;
  order: number;
  title: string;
  content_text: string;
  media_image_url?: string;
  word_count: number;
  metadata?: Record<string, unknown>;
  question_groups: IELTSQuestionGroup[];
  created_at: string;
  updated_at: string;
}

export interface IELTSSection {
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
  passages_tasks: IELTSPassageTask[];
  created_at: string;
  updated_at: string;
}

export interface IELTSTestListItem {
  id: string;
  title_en: string;
  title_fa: string;
  test_type: IELTSTestType;
  test_type_display: string;
  version: number;
  status: IELTSTestStatus;
  status_display: string;
  author?: string;
  author_name: string;
  reviewed_by?: string;
  reviewer_name: string;
  reviewed_at?: string | null;
  is_locked: boolean;
  copyright_source: string;
  disclaimer_label: string;
  total_duration_minutes: number;
  difficulty_level: string;
  sections_count: number;
  total_questions: number;
  created_at: string;
  updated_at: string;
}

export interface IELTSTestDetail extends IELTSTestListItem {
  review_notes?: string;
  quality_checklist?: Record<string, boolean>;
  sections: IELTSSection[];
}

export interface IELTSBandDescriptor {
  id: string;
  criteria_key: string;
  criteria_key_display: string;
  band_level: string | number;
  section_type: "writing" | "speaking";
  public_descriptor_en: string;
  pedagogical_guidance_fa: string;
  created_at: string;
  updated_at: string;
}

export interface QualityChecklistState {
  zero_copyright_infringement: boolean;
  cefr_calibrated: boolean;
  answer_key_verified: boolean;
  audio_script_verified: boolean;
  typo_and_formatting_checked: boolean;
}

export const MANDATORY_IELTS_DISCLAIMER_TEXT =
  "IELTS-like practice — not official IELTS / تمرین شبیه‌ساز آیلتس — غیررسمی";

// ---------------------------------------------------------------------------
// Client API Functions
// ---------------------------------------------------------------------------

export async function fetchAdminIELTSTests(params?: {
  status?: string;
  test_type?: string;
}): Promise<IELTSTestListItem[]> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== "all") query.set("status", params.status);
  if (params?.test_type && params.test_type !== "all") query.set("test_type", params.test_type);

  const qs = query.toString() ? `?${query.toString()}` : "";
  return await endooraApi<IELTSTestListItem[]>(`/api/ielts/tests/${qs}`);
}

export async function fetchAdminIELTSTestDetail(testId: string): Promise<IELTSTestDetail> {
  return await endooraApi<IELTSTestDetail>(`/api/ielts/tests/${testId}/`);
}

export async function submitTestForReview(testId: string): Promise<IELTSTestDetail> {
  return await endooraApi<IELTSTestDetail>(`/api/ielts/tests/${testId}/submit-review/`, {
    method: "POST",
  });
}

export async function approveIELTSTest(
  testId: string,
  payload: { checklist: QualityChecklistState; notes?: string }
): Promise<IELTSTestDetail> {
  return await endooraApi<IELTSTestDetail>(`/api/ielts/tests/${testId}/approve/`, {
    method: "POST",
    json: payload,
  });
}

export async function publishIELTSTest(testId: string): Promise<IELTSTestDetail> {
  return await endooraApi<IELTSTestDetail>(`/api/ielts/tests/${testId}/publish/`, {
    method: "POST",
  });
}

export async function cloneIELTSTestVersion(testId: string): Promise<IELTSTestDetail> {
  return await endooraApi<IELTSTestDetail>(`/api/ielts/tests/${testId}/clone/`, {
    method: "POST",
  });
}

export async function fetchBandDescriptors(params?: {
  section_type?: string;
  criteria_key?: string;
}): Promise<IELTSBandDescriptor[]> {
  const query = new URLSearchParams();
  if (params?.section_type) query.set("section_type", params.section_type);
  if (params?.criteria_key) query.set("criteria_key", params.criteria_key);

  const qs = query.toString() ? `?${query.toString()}` : "";
  return await endooraApi<IELTSBandDescriptor[]>(`/api/ielts/band-descriptors/${qs}`);
}

export async function fetchPublicIELTSTests(params?: {
  test_type?: string;
}): Promise<{ disclaimer: string; results: IELTSTestListItem[] }> {
  const query = new URLSearchParams();
  if (params?.test_type) query.set("test_type", params.test_type);

  const qs = query.toString() ? `?${query.toString()}` : "";
  return await endooraApi<{ disclaimer: string; results: IELTSTestListItem[] }>(
    `/api/ielts/public/tests/${qs}`
  );
}

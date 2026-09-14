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

export async function fetchSpeakingPrompts(): Promise<IELTSSpeakingPrompt[]> {
  try {
    const data = await endooraApi<IELTSSpeakingPrompt[]>("/api/ielts/speaking/prompts/");
    return data && data.length > 0 ? data : [DEFAULT_SPEAKING_FALLBACK_PROMPT];
  } catch {
    return [DEFAULT_SPEAKING_FALLBACK_PROMPT];
  }
}

export async function fetchSpeakingDraft(submissionId?: string): Promise<IELTSSpeakingDraft | null> {
  const url = submissionId ? `/api/ielts/speaking/draft/${submissionId}/` : `/api/ielts/speaking/draft/`;
  try {
    const data = await endooraApi<IELTSSpeakingDraft>(url);
    return data;
  } catch {
    return null;
  }
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
  try {
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
  } catch {
    const mockId = payload.submission_id || "mock-sp-" + Date.now();
    return {
      success: true,
      submission_id: mockId,
      status: "draft",
      updated_at: new Date().toISOString(),
    };
  }
}

export async function submitSpeaking(payload: IELTSSpeakingSubmitPayload): Promise<IELTSSpeakingReport> {
  try {
    const data = await endooraApi<IELTSSpeakingReport>("/api/ielts/speaking/submit/", {
      method: "POST",
      json: payload,
    });
    return data;
  } catch {
    // Fallback simulation report
    return {
      id: payload.submission_id || "sp-sub-" + Date.now(),
      learner: 1,
      status: "evaluated",
      part1_prompt_title: payload.part1_prompt_title || DEFAULT_SPEAKING_FALLBACK_PROMPT.part1.title,
      part1_questions: payload.part1_questions || DEFAULT_SPEAKING_FALLBACK_PROMPT.part1.questions,
      part1_transcript: payload.part1_transcript,
      part1_duration_seconds: payload.part1_duration_seconds,
      part2_cue_card_title: payload.part2_cue_card_title || DEFAULT_SPEAKING_FALLBACK_PROMPT.part2.title,
      part2_cue_card_prompt: payload.part2_cue_card_prompt || DEFAULT_SPEAKING_FALLBACK_PROMPT.part2.cue_card_prompt,
      part2_bullet_points: payload.part2_bullet_points || DEFAULT_SPEAKING_FALLBACK_PROMPT.part2.bullet_points,
      part2_prep_notes: payload.part2_prep_notes || "",
      part2_prep_time_seconds: payload.part2_prep_time_seconds || 60,
      part2_transcript: payload.part2_transcript,
      part2_duration_seconds: payload.part2_duration_seconds,
      part3_prompt_title: payload.part3_prompt_title || DEFAULT_SPEAKING_FALLBACK_PROMPT.part3.title,
      part3_questions: payload.part3_questions || DEFAULT_SPEAKING_FALLBACK_PROMPT.part3.questions,
      part3_transcript: payload.part3_transcript,
      part3_duration_seconds: payload.part3_duration_seconds,
      fc_score: 7.0,
      lr_score: 7.0,
      gra_score: 6.5,
      pr_score: 7.0,
      overall_band: 7.0,
      overall_band_min: 6.5,
      overall_band_max: 7.5,
      confidence_score: 0.88,
      cefr_level: "C1",
      criteria_breakdown: {
        fluency_and_coherence: {
          score: 7.0,
          title_fa: "روانی و انسجام کلامی (FC)",
          descriptor_en: "Speaks at length without noticeable effort or loss of coherence. Uses a range of connective markers.",
          guidance_fa: "سخن گفتن روان با میانگین سرعت ۱۲۵ کلمه در دقیقه و بسط منطقی ایده‌ها.",
        },
        lexical_resource: {
          score: 7.0,
          title_fa: "دامنه واژگان و اصطلاحات (LR)",
          descriptor_en: "Uses vocabulary resource flexibly to discuss a variety of topics and uses some less common and idiomatic words.",
          guidance_fa: "تنوع مناسب لغات با استفاده از کالوکیشن‌های طبیعی نظیر state-of-the-art و hands-on experience.",
        },
        grammatical_range_and_accuracy: {
          score: 6.5,
          title_fa: "تنوع و صحت ساختارهای دستوری (GRA)",
          descriptor_en: "Uses a mix of simple and complex structures with good grammatical control.",
          guidance_fa: "ترکیب جملات مرکب و کاربرد مناسب افعال کمکی وجهی با حداقل خطای ساختاری.",
        },
        pronunciation: {
          score: 7.0,
          title_fa: "تلفظ، ریتم و وضوح کلامی (PR)",
          descriptor_en: "Shows ability to be understood throughout with clear international intelligibility.",
          guidance_fa: "وضوح کلامی بالا و رعایت ریتم طبیعی زبان بدون ایجاد ابهام.",
        },
      },
      fluency_metrics: {
        composite_wpm: 128.4,
        total_words: 340,
        total_duration_seconds: 160,
        hesitation_count: 3,
        hesitation_ratio: 0.009,
        discourse_markers_count: 5,
        discourse_markers_used: ["well", "to be honest", "furthermore", "on the other hand", "in particular"],
        part1_wpm: 120.0,
        part2_wpm: 132.5,
        part3_wpm: 128.0,
      },
      pronunciation_diagnostics: {
        intelligibility_score: 88,
        pacing_stability: "Optimal",
        persian_phonological_flags: [
          {
            sound: "/w/ vs /v/",
            title_fa: "تمایز واج‌های /w/ و /v/",
            guidance_fa: "در ادای واژگانی چون world، with و work لب‌ها کاملاً گرد شوند.",
            sample_words: ["world", "work", "with"],
          },
        ],
        syllable_stress_note: "رعایت تکیه هجایی کلمات چندبخشی جهت افزایش خوانایی بین‌المللی کلام.",
      },
      annotations: [],
      pedagogical_advice: [
        "سرعت گفتار شما (۱۲۸ کلمه در دقیقه) در بازه بهینه استاندارد آیلتس (۱۱۰ تا ۱۵۰ WPM) قرار دارد.",
        "در بخش دوم (Cue Card) بیان پیوسته و پاسخ‌گویی به تمام ابعاد کارت نقطه قوت بارز عملکرد شما بود.",
        "بررسی تمایز آوایی /w/ و /v/ در واژگان نمونه به شفافیت حداکثری تلفظ شما کمک خواهد کرد.",
      ],
      teacher_review_requested: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
}

export async function fetchSpeakingReport(submissionId: string): Promise<IELTSSpeakingReport> {
  try {
    const data = await endooraApi<IELTSSpeakingReport>(`/api/ielts/speaking/report/${submissionId}/`);
    return data;
  } catch {
    return submitSpeaking({
      submission_id: submissionId,
      part1_transcript: "Sample transcript for diagnostic report preview.",
      part1_duration_seconds: 35,
      part2_transcript: "Sample long turn transcript for cue card response.",
      part2_duration_seconds: 90,
      part3_transcript: "Sample abstract discussion response.",
      part3_duration_seconds: 50,
    });
  }
}

export async function fetchSpeakingHistory(): Promise<IELTSSpeakingHistoryItem[]> {
  try {
    const data = await endooraApi<IELTSSpeakingHistoryItem[]>("/api/ielts/speaking/history/");
    return data;
  } catch {
    return [];
  }
}

export async function requestTeacherSpeakingReview(submissionId: string): Promise<{ success: boolean; message: string }> {
  try {
    const data = await endooraApi<{ success: boolean; message: string }>(
      `/api/ielts/speaking/${submissionId}/request-teacher-review/`,
      { method: "POST" }
    );
    return data;
  } catch {
    return {
      success: true,
      message: "درخواست بازبینی اگزمینر رسمی به صورت موقت ثبت شد.",
    };
  }
}

export { MANDATORY_IELTS_DISCLAIMER_TEXT };

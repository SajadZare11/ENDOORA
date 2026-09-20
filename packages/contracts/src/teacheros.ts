export type MaterialType = "lesson" | "activity" | "worksheet" | "assessment";

export type MaterialStatus = "draft" | "approved" | "archived";

export interface TeacherMaterial {
  id: string;
  teacher: string;
  teacher_email?: string;
  teacher_class?: string | null;
  class_title?: string | null;
  material_type: MaterialType;
  material_type_display?: string;
  subtype?: string;
  title: string;
  topic: string;
  cefr_level: string;
  content: Record<string, any>;
  raw_markdown: string;
  status: MaterialStatus;
  status_display?: string;
  is_pinned: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface GenerateMaterialPayload {
  material_type: MaterialType;
  topic: string;
  cefr_level?: string;
  duration?: number | string;
  methodology?: "ppp" | "esa" | "tbl";
  grammar_focus?: string;
  vocabulary_focus?: string;
  activity_format?: "roleplay" | "infogap" | "debate" | "icebreaker" | "speaking";
  worksheet_type?: "grammar" | "vocabulary" | "reading" | "writing";
  question_count?: number | string;
  class_id?: string | null;
  title?: string;
}

export type OutcomeResult = "success" | "partial" | "needs_repeat";

export interface LessonOutcome {
  id: string;
  teacher_class: string;
  class_title?: string;
  session?: string | null;
  teacher: string;
  result: OutcomeResult;
  result_display?: string;
  difficulty_rating: number; // 1-5
  completion_percent: number; // 0-100
  summary: string;
  notes: string;
  followup_reminders: string[];
  created_at: string;
}

export interface CefrSkillDetail {
  score: number; // 0-20
  confidence: number; // 1-5
  level: string;
}

export interface CefrSkillsMap {
  speaking: CefrSkillDetail;
  listening: CefrSkillDetail;
  reading: CefrSkillDetail;
  writing: CefrSkillDetail;
  grammar: CefrSkillDetail;
  vocabulary: CefrSkillDetail;
  pronunciation: CefrSkillDetail;
}

export interface SkillScoreHistoryEntry {
  date: string;
  scores: Record<string, number>;
  confidence: number;
  notes?: string;
}

export interface ErrorProfileEntry {
  id: string;
  category: "grammar" | "lexis" | "phonology" | "l1_interference" | "spelling" | "other";
  sentence: string;
  correction: string;
  notes?: string;
  frequency?: "low" | "medium" | "high";
  status?: "improving" | "persistent" | "solved";
  date: string;
}

export interface AssessmentMilestoneItem {
  id?: string;
  type: "formal" | "informal";
  subtype: string;
  title: string;
  score: number;
  max_score: number;
  percentage?: number;
  notes?: string;
  date?: string;
}

export interface StudentDossier {
  id: string;
  teacher_class: string;
  class_title?: string;
  learner: string;
  learner_email?: string;
  teacher: string;
  target_goals: {
    long_term?: string;
    short_term?: string;
    long_term_goals?: string[];
    [key: string]: any;
  };
  learning_preferences: {
    style?: string;
    pace?: string;
    anxieties?: string;
    preferred_activities?: string[];
    learning_behaviors?: string[];
    [key: string]: any;
  };
  cefr_skills: CefrSkillsMap;
  cefr_overall?: string;
  skill_scores_history: SkillScoreHistoryEntry[];
  error_profile: ErrorProfileEntry[];
  strengths: string[];
  areas_for_development: string[];
  engagement_index: string | number;
  engagement_metrics?: {
    attendance?: number;
    punctuality?: number;
    participation?: number;
    homework_completion?: number;
    preparation?: number;
  };
  motivation_dynamics?: {
    current_motivation?: string;
    primary_driver?: string;
    goal_commitment?: number;
    confidence_level?: string;
  };
  ai_recommendations: string[];
  assessment_milestones?: AssessmentMilestoneItem[];
  updated_at: string;
}

export interface SpacedReviewItem {
  id: string;
  teacher_class: string;
  learner?: string | null;
  target_item: string;
  item_type: string;
  prompt_question: string;
  correct_answer: string;
  due_date: string;
  interval_days: number;
  repetition_count: number;
  ease_factor: number;
  is_mastered: boolean;
  created_at: string;
}

export interface DifferentiationPlan {
  id: string;
  material: string;
  material_title?: string;
  teacher_class: string;
  tier_support: {
    title?: string;
    scaffolds?: string[];
    target_learners?: string;
    [key: string]: any;
  };
  tier_core: {
    title?: string;
    tasks?: any[];
    target_learners?: string;
    [key: string]: any;
  };
  tier_extension: {
    title?: string;
    challenges?: string[];
    target_learners?: string;
    [key: string]: any;
  };
  created_at: string;
}

export interface NextLessonRecommendation {
  class_id: string;
  class_title: string;
  level: string;
  mode: "introductory" | "reinforcement" | "advancement";
  recommended_topic: string;
  priority_focus: string;
  pedagogical_rationale: string;
  reminders_from_last_session: string[];
  suggested_actions: Array<{
    action: string;
    label_fa: string;
    label_en: string;
  }>;
}

export interface TeacherUsageSummary {
  plan_name: string;
  daily_limit: number;
  used_today: number;
  remaining_today: number;
  today: {
    generations: number;
    word_exports: number;
    pdf_exports: number;
  };
  all_time: {
    generations: number;
    word_exports: number;
    pdf_exports: number;
  };
  saved_materials: number;
  breakdown: {
    lesson: number;
    activity: number;
    worksheet: number;
    assessment: number;
  };
}

export type ExportMode = "teacher" | "student";

export interface AssignMaterialPayload {
  class_id?: string | null;
  learner_ids?: string[];
  due_date?: string | null;
  create_assignment?: boolean;
}

export interface ScheduleMaterialPayload {
  session_id?: string | null;
  title?: string;
  scheduled_start?: string;
  scheduled_end?: string;
  duration_minutes?: number;
  session_notes?: string;
}

export interface RubricScoreDetail {
  score: number;
  band: string;
  feedback_en: string;
  feedback_fa: string;
}

export interface RubricScoresMap {
  task_achievement: RubricScoreDetail;
  coherence_cohesion: RubricScoreDetail;
  lexical_resource: RubricScoreDetail;
  grammatical_accuracy: RubricScoreDetail;
}

export interface InlineCorrectionItem {
  id: string;
  original: string;
  corrected: string;
  rule: string;
  category?: string;
}

export interface InlineSuggestionItem {
  id: string;
  original: string;
  suggestion: string;
  rationale: string;
}

export interface FeedbackAnalysis {
  band: string;
  cefr: string;
  target_level?: string;
  mode?: string;
  word_count: number;
  sentence_count: number;
  rubrics: RubricScoresMap;
  corrections: InlineCorrectionItem[];
  suggestions: InlineSuggestionItem[];
  strengths: string[];
  next_steps: string[];
  revision_task: string;
  student_copy?: string;
  teacher_copy?: string;
  time_saved_minutes?: number;
}

export interface WritingAnalyzePayload {
  text: string;
  level?: string;
  mode?: "rubric" | "detailed" | "balanced" | "light";
  task_prompt?: string;
  student_label?: string;
}

export interface ApproveFeedbackPayload {
  class_id: string;
  learner_id: string;
  assignment_title?: string;
  student_text?: string;
  analysis: FeedbackAnalysis;
  teacher_notes?: string;
}

// ==============================================================================
// Day 9: Deep Pedagogical Supertools Contracts
// ==============================================================================

export interface WarmupQuestion {
  part: number;
  category: string;
  question: string;
  key_answer: string;
  time_seconds: number;
}

export interface WarmupQuizData {
  title: string;
  duration_minutes: number;
  class_id: string;
  target_items: string[];
  questions: WarmupQuestion[];
  raw_markdown: string;
}

export interface PacingSkillCoverage {
  skill: string;
  name_en: string;
  name_fa: string;
  percentage: number;
  variance: string;
  status: "normal" | "ahead" | "needs_attention";
}

export interface PacingAdjustment {
  title_en: string;
  title_fa: string;
  description_en: string;
  description_fa: string;
  type: "rebalance" | "retention" | "extension";
}

export interface PacingAuditData {
  class_id: string;
  class_title: string;
  cefr_level: string;
  current_week: number;
  total_weeks: number;
  total_sessions: number;
  completed_sessions: number;
  upcoming_sessions: number;
  cancelled_sessions: number;
  average_difficulty: number;
  average_completion: number;
  pacing_status: "on_track" | "ahead" | "behind";
  status_label_en: string;
  status_label_fa: string;
  skill_coverages: PacingSkillCoverage[];
  pedagogical_adjustments: PacingAdjustment[];
}

export interface ProgressReportCardData {
  class_id: string;
  class_title: string;
  learner_id: string;
  learner_name: string;
  learner_email: string;
  term: string;
  cefr_level: string;
  overall_score: number;
  attendance_rate: number;
  homework_rate: number;
  participation_score: number;
  cefr_skills: Record<string, { score: number; confidence?: number; level?: string }>;
  strengths: string[];
  growth_areas: string[];
  teacher_comment: string;
  issue_date: string;
}

export interface ReportCardDispatchPayload {
  term?: string;
  teacher_comment?: string;
  overall_score?: number;
}

export interface TeacherPreferences {
  id?: string;
  plan_code?: string;
  plan_expires_at?: string | null;
  default_cefr: string;
  default_duration: number;
  preferred_methodology: "ppp" | "esa" | "tbl";
  auto_generate_ccqs: boolean;
  feedback_tone: "encouraging" | "balanced" | "rigorous";
  updated_at?: string;
}

export interface PlanTierOption {
  code: "free" | "pro" | "premium";
  name: string;
  name_fa: string;
  price_toman: number;
  period_days: number;
  daily_limit: number;
  is_popular?: boolean;
  features_fa: string[];
  features_en: string[];
}

export interface TeacherAccountSummary {
  teacher: {
    id: string;
    email: string;
    name: string;
    is_verified: boolean;
    date_joined: string;
  };
  plan: {
    code: string;
    name: string;
    name_fa: string;
    daily_limit: number;
    expires_at: string | null;
    is_active: boolean;
  };
  usage: TeacherUsageSummary;
  productivity: {
    hours_saved: number;
    minutes_saved: number;
    materials_count: number;
    classes_count: number;
  };
  preferences: TeacherPreferences;
  available_plans: PlanTierOption[];
}

export interface BatchMaterialActionPayload {
  action: "archive" | "pin" | "unpin" | "delete";
  material_ids: string[];
}




export interface SampleUnit {
  unit: number;
  title: string;
  grammar: string;
  speaking: string;
}

export interface FutureMilestone {
  phase: string;
  phase_en: string;
  units: string;
  grammar_focus: string[];
  vocabulary_focus: string[];
  status: "in_progress" | "planned" | "completed";
}

export interface CurriculumRecommendation {
  book_id: string | null;
  slug: string;
  book_title: string;
  publisher: string;
  edition: string;
  cover_image_url: string;
  description_fa: string;
  description_en: string;
  track: string;
  track_display_fa: string;
  target_cefr: string;
  overall_percentage: number;
  current_unit: number;
  total_units: number;
  grammar_milestones: string[];
  vocabulary_themes: string[];
  speaking_goals: string[];
  sample_units: SampleUnit[];
  future_milestones: FutureMilestone[];
}

export interface ScheduleSlot {
  day: "sat" | "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | string;
  time_window: "morning" | "afternoon" | "evening" | string;
}

export interface ClassEnrollmentRequest {
  id: string;
  preferred_format: "solo" | "group";
  preferred_format_display: string;
  max_classmates: number;
  available_slots: ScheduleSlot[];
  status: "pending" | "claimed" | "matched" | "cancelled";
  status_display: string;
  target_book_title?: string | null;
  notes?: string;
  created_at: string;
}

export interface TeacherSessionLog {
  id: string;
  session_number: number;
  units_covered: string;
  grammar_covered: string;
  vocabulary_list: string[];
  homework_description: string;
  teacher_notes: string;
  session_date: string;
}

export interface LiveClassCohort {
  id: string;
  title: string;
  teacher_id: string;
  teacher_name: string;
  book_title: string;
  class_format: "solo" | "group";
  class_format_display: string;
  meeting_url: string;
  schedule_summary: string;
  next_session_at: string | null;
  students_count: number;
  max_capacity: number;
}

export interface LearnerClassStatus {
  has_active_request: boolean;
  request: ClassEnrollmentRequest | null;
  is_enrolled: boolean;
  cohort: LiveClassCohort | null;
  latest_session_log: TeacherSessionLog | null;
}

export interface OpenRequestItem {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  cefr_level: string;
  preferred_format: "solo" | "group";
  preferred_format_display: string;
  max_classmates: number;
  available_slots: ScheduleSlot[];
  target_book_id: string | null;
  target_book_title: string;
  notes: string;
  created_at: string;
}

export interface CohortSuggestion {
  book_title: string;
  cefr_level: string;
  suggested_capacity: number;
  member_ids: string[];
  student_names: string[];
  common_slots: string[];
}

export interface OpenRequestsResponse {
  requests: OpenRequestItem[];
  cohort_suggestions: CohortSuggestion[];
  total_pending: number;
}

export async function fetchCurriculumRecommendation(): Promise<CurriculumRecommendation | null> {
  try {
    const res = await fetch("/api/curriculum/recommendation/", {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as CurriculumRecommendation;
  } catch {
    return null;
  }
}

export async function submitClassEnrollmentRequest(payload: {
  preferred_format: "solo" | "group";
  max_classmates: number;
  available_slots: ScheduleSlot[];
  notes?: string;
}): Promise<{ success: boolean; message_fa?: string; error?: string }> {
  try {
    const res = await fetch("/api/classes/request/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.detail || data.error || "خطا در ثبت درخواست" };
    }
    return { success: true, message_fa: data.message_fa };
  } catch (err: any) {
    return { success: false, error: err.message || "خطای ارتباط با سرور" };
  }
}

export async function fetchLearnerClassStatus(): Promise<LearnerClassStatus | null> {
  try {
    const res = await fetch("/api/classes/my-status/", {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as LearnerClassStatus;
  } catch {
    return null;
  }
}

export async function fetchTeacherOpenClassRequests(): Promise<OpenRequestsResponse | null> {
  try {
    const res = await fetch("/api/teacher/classes/open-requests/", {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as OpenRequestsResponse;
  } catch {
    return null;
  }
}

export async function claimTeacherCohort(payload: {
  request_ids: string[];
  title?: string;
  meeting_url?: string;
  schedule_summary?: string;
  next_session_at?: string | null;
}): Promise<{ success: boolean; cohort_id?: string; message_fa?: string; error?: string }> {
  try {
    const res = await fetch("/api/teacher/classes/claim/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || data.detail || "خطا در تشکیل کلاس" };
    }
    return { success: true, cohort_id: data.cohort_id, message_fa: data.message_fa };
  } catch (err: any) {
    return { success: false, error: err.message || "خطای ارتباط با سرور" };
  }
}

export async function logTeacherSession(payload: {
  cohort_id: string;
  units_covered: string;
  grammar_covered?: string;
  vocabulary_list?: string[];
  homework_description?: string;
  teacher_notes?: string;
  next_session_at?: string | null;
}): Promise<{ success: boolean; log_id?: string; message_fa?: string; error?: string }> {
  try {
    const res = await fetch("/api/teacher/classes/sessions/log/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || data.detail || "خطا در ثبت گزارش جلسه" };
    }
    return { success: true, log_id: data.log_id, message_fa: data.message_fa };
  } catch (err: any) {
    return { success: false, error: err.message || "خطای ارتباط با سرور" };
  }
}

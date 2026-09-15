export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "ALL";

export type SkillCategory =
  | "listening"
  | "speaking"
  | "reading"
  | "writing"
  | "grammar"
  | "vocabulary"
  | "culture"
  | "school";

export type TargetAudience = "general" | "school_konkur" | "ielts_academic" | "business";

export type ContentStatus = "draft" | "in_review" | "published" | "archived";

export type LicenseType =
  | "original_editorial"
  | "cc_by_sa"
  | "public_domain"
  | "educational_fair_use";

export interface QuizItem {
  prompt_fa?: string;
  prompt_en?: string;
  options?: string[];
  correct_index?: number;
  explanation_fa?: string;
  explanation_en?: string;
}

export interface DownloadableResource {
  title?: string;
  url?: string;
  size?: string;
}

export interface LessonEditorItem {
  id: string;
  module: string;
  title_fa: string;
  title_en: string;
  order: number;
  duration_minutes: number;
  is_free_preview: boolean;
  content_body_fa: string;
  content_body_en: string;
  video_url: string;
  audio_url: string;
  transcript_fa: string;
  transcript_en: string;
  quiz_data: QuizItem[];
  downloadable_resources: DownloadableResource[];
  free_preview_excerpt_fa: string;
  free_preview_excerpt_en: string;
  created_at: string;
  updated_at: string;
}

export interface ModuleEditorItem {
  id: string;
  course: string;
  title_fa: string;
  title_en: string;
  description_fa: string;
  description_en: string;
  order: number;
  lessons: LessonEditorItem[];
  lessons_count: number;
}

export interface CourseEditorItem {
  id: string;
  slug: string;
  title_fa: string;
  title_en: string;
  description_fa: string;
  description_en: string;
  skill_category: SkillCategory;
  cefr_level: CefrLevel;
  target_audience: TargetAudience;
  status: ContentStatus;
  is_premium: boolean;
  thumbnail_url: string;
  estimated_hours: number;
  source_attribution: string;
  license_type: LicenseType;
  author_name: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  modules: ModuleEditorItem[];
  total_modules: number;
  total_lessons: number;
  free_preview_count: number;
  total_duration_minutes: number;
  enrollment_count: number;
}

export interface PaywallRedactionPreview {
  lesson_id: string;
  course_slug: string;
  course_is_premium: boolean;
  lesson_is_free_preview: boolean;
  mode: "learner_unsubscribed" | "learner_subscribed";
  is_locked: boolean;
  redacted_fields: string[];
  redaction_verified: boolean;
  redaction_summary_fa: string;
  redaction_summary_en: string;
  payload: {
    id: string;
    course_slug: string;
    course_title_fa: string;
    course_title_en: string;
    module_title_fa: string;
    title_fa: string;
    title_en: string;
    order: number;
    duration_minutes: number;
    is_free_preview: boolean;
    is_locked: boolean;
    content_body_fa: string;
    content_body_en: string;
    video_url: string;
    audio_url: string;
    transcript_fa: string;
    transcript_en: string;
    quiz_data: QuizItem[];
    downloadable_resources: DownloadableResource[];
    paywall_info: {
      plan_name: string;
      plan_duration_days: number;
      display_price_toman: number;
      cta_url: string;
      message_fa: string;
      message_en: string;
    } | null;
    author_name: string;
    source_attribution: string;
    license_type: string;
  };
}

export interface CourseFilters {
  status?: string;
  skill?: string;
  cefr?: string;
  audience?: string;
  license?: string;
  q?: string;
}

export async function fetchEditorCourses(
  filters: CourseFilters = {},
  signal?: AbortSignal
): Promise<{ count: number; results: CourseEditorItem[] }> {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== "all") params.set("status", filters.status);
  if (filters.skill && filters.skill !== "all") params.set("skill", filters.skill);
  if (filters.cefr && filters.cefr !== "all") params.set("cefr", filters.cefr);
  if (filters.audience && filters.audience !== "all") params.set("audience", filters.audience);
  if (filters.license && filters.license !== "all") params.set("license", filters.license);
  if (filters.q && filters.q.trim()) params.set("q", filters.q.trim());

  const res = await fetch(`/api/courses/editor/?${params.toString()}`, {
    signal,
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

export async function fetchEditorCourse(
  courseId: string,
  signal?: AbortSignal
): Promise<CourseEditorItem> {
  const res = await fetch(`/api/courses/editor/${courseId}/`, {
    signal,
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

export async function createEditorCourse(
  payload: Partial<CourseEditorItem>
): Promise<CourseEditorItem> {
  const res = await fetch(`/api/courses/editor/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    const message = Object.values(errorJson).flat().join(" ") || `HTTP ${res.status}`;
    throw new Error(message);
  }

  return res.json();
}

export async function updateEditorCourse(
  courseId: string,
  payload: Partial<CourseEditorItem>
): Promise<CourseEditorItem> {
  const res = await fetch(`/api/courses/editor/${courseId}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    const message = Object.values(errorJson).flat().join(" ") || `HTTP ${res.status}`;
    throw new Error(message);
  }

  return res.json();
}

export async function deleteEditorCourse(courseId: string): Promise<void> {
  const res = await fetch(`/api/courses/editor/${courseId}/`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.detail || `HTTP ${res.status}`);
  }
}

export async function transitionCourse(
  courseId: string,
  action: "submit_review" | "publish" | "archive" | "revert_draft",
  note: string = ""
): Promise<{ id: string; status: ContentStatus; published_at: string | null }> {
  const res = await fetch(`/api/courses/editor/${courseId}/transition/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ action, note }),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

export async function createEditorModule(
  courseId: string,
  payload: Partial<ModuleEditorItem>
): Promise<ModuleEditorItem> {
  const res = await fetch(`/api/courses/editor/${courseId}/modules/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    const message = Object.values(errorJson).flat().join(" ") || `HTTP ${res.status}`;
    throw new Error(message);
  }

  return res.json();
}

export async function updateEditorModule(
  courseId: string,
  moduleId: string,
  payload: Partial<ModuleEditorItem>
): Promise<ModuleEditorItem> {
  const res = await fetch(`/api/courses/editor/${courseId}/modules/${moduleId}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    const message = Object.values(errorJson).flat().join(" ") || `HTTP ${res.status}`;
    throw new Error(message);
  }

  return res.json();
}

export async function deleteEditorModule(courseId: string, moduleId: string): Promise<void> {
  const res = await fetch(`/api/courses/editor/${courseId}/modules/${moduleId}/`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.detail || `HTTP ${res.status}`);
  }
}

export async function createEditorLesson(
  moduleId: string,
  payload: Partial<LessonEditorItem>
): Promise<LessonEditorItem> {
  const res = await fetch(`/api/courses/editor/modules/${moduleId}/lessons/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    const message = Object.values(errorJson).flat().join(" ") || `HTTP ${res.status}`;
    throw new Error(message);
  }

  return res.json();
}

export async function updateEditorLesson(
  lessonId: string,
  payload: Partial<LessonEditorItem>
): Promise<LessonEditorItem> {
  const res = await fetch(`/api/courses/editor/lessons/${lessonId}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    const message = Object.values(errorJson).flat().join(" ") || `HTTP ${res.status}`;
    throw new Error(message);
  }

  return res.json();
}

export async function deleteEditorLesson(lessonId: string): Promise<void> {
  const res = await fetch(`/api/courses/editor/lessons/${lessonId}/`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.detail || `HTTP ${res.status}`);
  }
}

export async function previewLessonRedaction(
  lessonId: string,
  mode: "learner_unsubscribed" | "learner_subscribed",
  signal?: AbortSignal
): Promise<PaywallRedactionPreview> {
  const res = await fetch(
    `/api/courses/editor/lessons/${lessonId}/preview-redaction/?mode=${mode}`,
    {
      signal,
      credentials: "include",
      headers: { Accept: "application/json" },
    }
  );

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

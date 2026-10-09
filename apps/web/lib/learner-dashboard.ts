export type Locale = "fa" | "en";

export type PrimaryActionId =
  | "urgent_assignment"
  | "continue_mission"
  | "review_vocabulary"
  | "start_placement"
  | "join_next_class"
  | "start_learning";

export interface LearnerActivity {
  id: string;
  activity_type: string;
  title_fa: string;
  title_en: string;
  description_fa?: string;
  description_en?: string;
  category: string;
  badge_text_fa?: string;
  badge_text_en?: string;
  icon: string;
  link?: string;
  time_ago_fa?: string;
  time_ago_en?: string;
  created_at: string;
}

export type LearnerHome = {
  user_id: string;
  greeting_name: string;
  preferred_locale: Locale;
  dashboard_state: "first_time" | "returning" | "assignment_due" | "mission_ready";
  primary_action: {
    id: PrimaryActionId;
    href: string;
    title_fa: string;
    title_en: string;
    description_fa: string;
    description_en: string;
    reason_fa: string;
    reason_en: string;
  };
  today_mission: {
    id: string;
    mission_date: string;
    status: "ready" | "in_progress" | "completed";
    title_fa: string;
    title_en: string;
    description_fa: string;
    description_en: string;
    reason_fa: string;
    reason_en: string;
  } | null;
  path_progress_percent: number | null;
  path_steps: Array<{
    id: "placement" | "personal_path" | "daily_growth";
    label_fa: string;
    label_en: string;
    state: "complete" | "current" | "locked";
  }>;
  path_message_fa: string;
  path_message_en: string;
  skills: Array<{
    id: "speaking" | "listening" | "reading" | "writing" | "grammar" | "vocabulary";
    label_fa: string;
    label_en: string;
    status_fa: string;
    status_en: string;
  }>;
  srs_available: boolean;
  srs_due_count: number;
  assignment: Record<string, unknown> | null;
  next_class: Record<string, unknown> | null;
  active_course: Record<string, unknown> | null;
  recent_activities?: LearnerActivity[];
  xp_available: boolean;
  xp: number;
  streak_days: number;
  notifications_available: boolean;
  notification_count: number;
  limitations_fa: string[];
  limitations_en: string[];
  generated_at: string;
};

export class DashboardApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "DashboardApiError";
    this.status = status;
  }
}

async function errorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as {
      message_fa?: string;
      message_en?: string;
      detail?: string;
    };
    return body.message_fa ?? body.message_en ?? body.detail ?? "Dashboard request failed.";
  } catch {
    return "Dashboard request failed.";
  }
}

export async function fetchLearnerHome(signal?: AbortSignal): Promise<LearnerHome> {
  const response = await fetch("/api/dashboard/home/", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    signal,
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new DashboardApiError(response.status, await errorMessage(response));
  }

  return (await response.json()) as LearnerHome;
}

async function csrfToken(): Promise<string | null> {
  try {
    const response = await fetch("/api/auth/csrf/", {
      credentials: "include",
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    const body = (await response.json()) as { csrf_token?: string };
    return body.csrf_token ?? null;
  } catch {
    return null;
  }
}

export async function trackPrimaryAction(actionId: PrimaryActionId): Promise<void> {
  const token = await csrfToken();
  if (!token) return;

  try {
    await fetch("/api/dashboard/events/", {
      method: "POST",
      credentials: "include",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": token,
      },
      body: JSON.stringify({
        event_name: "primary_cta_click",
        action_id: actionId,
      }),
    });
  } catch {
    // Analytics must never block navigation.
  }
}

export interface RecordActivityPayload {
  activity_type: string;
  title_fa: string;
  title_en?: string;
  description_fa?: string;
  description_en?: string;
  category?: string;
  badge_text_fa?: string;
  badge_text_en?: string;
  icon?: string;
  link?: string;
  metadata?: Record<string, unknown>;
}

export async function recordLearnerActivity(payload: RecordActivityPayload): Promise<LearnerActivity | null> {
  const token = await csrfToken();
  try {
    const response = await fetch("/api/dashboard/activities/record/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { "X-CSRFToken": token } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return null;
    return (await response.json()) as LearnerActivity;
  } catch {
    return null;
  }
}

export async function fetchLearnerActivities(limit = 10): Promise<LearnerActivity[]> {
  try {
    const response = await fetch(`/api/dashboard/activities/?limit=${limit}`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return [];
    const data = (await response.json()) as { results?: LearnerActivity[] };
    return data.results ?? [];
  } catch {
    return [];
  }
}


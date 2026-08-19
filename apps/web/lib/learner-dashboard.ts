export type Locale = "fa" | "en";

export type PrimaryActionId =
  | "urgent_assignment"
  | "continue_mission"
  | "review_vocabulary"
  | "start_placement"
  | "join_next_class"
  | "start_learning";

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
  path_progress_percent: number | null;
  path_message_fa: string;
  path_message_en: string;
  skills: Array<Record<string, unknown>>;
  srs_available: boolean;
  srs_due_count: number;
  assignment: Record<string, unknown> | null;
  next_class: Record<string, unknown> | null;
  active_course: Record<string, unknown> | null;
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

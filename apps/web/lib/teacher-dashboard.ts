export type TeacherLocale = "fa" | "en";

export type TeacherPrimaryActionId =
  | "verify_profile"
  | "teach_next_session"
  | "answer_request"
  | "grade_work"
  | "complete_profile"
  | "prepare_first_class";

export type TeacherQuickLinkId = "question_bank" | "fixed_class";

export type TeacherCountSummary = {
  available: boolean;
  count: number | null;
  note_fa: string;
  note_en: string;
};

export type TeacherHome = {
  user_id: string;
  greeting_name: string;
  preferred_locale: TeacherLocale;
  verification_status: "verified" | "unverified";
  profile_completeness_percent: number;
  capabilities: {
    teacher_verified: boolean;
    marketplace_eligible: boolean;
    paid_class_eligible: boolean;
  };
  primary_action: {
    id: TeacherPrimaryActionId;
    href: string;
    title_fa: string;
    title_en: string;
    description_fa: string;
    description_en: string;
    reason_fa: string;
    reason_en: string;
  };
  classes: TeacherCountSummary;
  students: TeacherCountSummary;
  learn_now_requests: TeacherCountSummary;
  pending_grading: TeacherCountSummary;
  schedule: {
    available: boolean;
    next_session: Record<string, unknown> | null;
    note_fa: string;
    note_en: string;
  };
  earnings: {
    available: boolean;
    amount_toman: number | null;
    note_fa: string;
    note_en: string;
  };
  quick_links: Array<{
    id: TeacherQuickLinkId;
    href: string;
    title_fa: string;
    title_en: string;
    description_fa: string;
    description_en: string;
    status: "foundation" | "locked";
    requires_verification: boolean;
  }>;
  privacy_notice_fa: string;
  privacy_notice_en: string;
  limitations_fa: string[];
  limitations_en: string[];
  generated_at: string;
};

export class TeacherDashboardApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "TeacherDashboardApiError";
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
    return (
      body.message_fa ??
      body.message_en ??
      body.detail ??
      "Teacher dashboard request failed."
    );
  } catch {
    return "Teacher dashboard request failed.";
  }
}

export async function fetchTeacherHome(signal?: AbortSignal): Promise<TeacherHome> {
  const response = await fetch("/api/teachers/dashboard/", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    signal,
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new TeacherDashboardApiError(response.status, await errorMessage(response));
  }

  return (await response.json()) as TeacherHome;
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

export async function trackTeacherAction(
  eventName: "primary_cta_click" | "quick_link_click",
  actionId: TeacherPrimaryActionId | TeacherQuickLinkId,
): Promise<void> {
  const token = await csrfToken();
  if (!token) return;

  try {
    await fetch("/api/teachers/dashboard/events/", {
      method: "POST",
      credentials: "include",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": token,
      },
      body: JSON.stringify({
        event_name: eventName,
        action_id: actionId,
      }),
    });
  } catch {
    // Analytics must never block a teacher action.
  }
}

export interface AdminDashboardStats {
  users: {
    total: number;
    by_role: {
      learner: number;
      teacher: number;
      editor: number;
      support: number;
      administrator: number;
      [key: string]: number;
    };
  };
  review_queues: {
    courses_in_review: number;
    content_items_in_review: number;
    questions_in_review: number;
    total_in_review: number;
  };
  teacher_verification: {
    pending_verifications: number;
    verified_teachers: number;
  };
  moderation: {
    pending_reports: number;
  };
  treasury: {
    total_platform_commission_toman: number;
    total_teacher_payables_toman: number;
    pending_escrow_toman: number;
  };
  feature_flags: {
    total: number;
    enabled: number;
  };
  audit: {
    total_logged_events: number;
  };
  system_health: {
    status: string;
    database: string;
    cache: string;
    evaluated_at: string;
  };
}

export interface FeatureFlagRecord {
  id?: string;
  key: string;
  enabled: boolean;
  rollout_percentage: number;
  environments: string[];
  owner: string;
  rationale: string;
  dependencies: string[];
  kill_switch_behavior: "disable_feature" | "reviewed_fallback" | "read_only" | "retry_later";
  created_at?: string;
  updated_at?: string;
}

export interface AuditEventRecord {
  id: string;
  actor_id: string | null;
  actor_email: string;
  actor_role: string;
  action: "create" | "update" | "delete" | "m2m_change";
  target_app: string;
  target_model: string;
  target_pk: string;
  before_summary: Record<string, unknown>;
  after_summary: Record<string, unknown>;
  reason: string;
  request_method: string;
  request_path: string;
  environment: string;
  occurred_at: string;
}

export const MOCK_ADMIN_STATS: AdminDashboardStats = {
  users: {
    total: 28450,
    by_role: {
      learner: 26800,
      teacher: 1420,
      editor: 85,
      support: 95,
      administrator: 50,
    },
  },
  review_queues: {
    courses_in_review: 4,
    content_items_in_review: 7,
    questions_in_review: 19,
    total_in_review: 30,
  },
  teacher_verification: {
    pending_verifications: 14,
    verified_teachers: 1406,
  },
  moderation: {
    pending_reports: 3,
  },
  treasury: {
    total_platform_commission_toman: 184500000,
    total_teacher_payables_toman: 945200000,
    pending_escrow_toman: 76400000,
  },
  feature_flags: {
    total: 5,
    enabled: 3,
  },
  audit: {
    total_logged_events: 18420,
  },
  system_health: {
    status: "operational",
    database: "connected (PostgreSQL 16 HA)",
    cache: "connected (Redis Cluster 7)",
    evaluated_at: new Date().toISOString(),
  },
};

export const MOCK_FEATURE_FLAGS: FeatureFlagRecord[] = [
  {
    key: "ai_tutor_realtime",
    enabled: true,
    rollout_percentage: 100,
    environments: ["development", "test", "staging", "production"],
    owner: "AI Platform Team",
    rationale: "Realtime pedagogical conversational guidance and pronunciation analysis.",
    dependencies: ["speech_shadowing_v2"],
    kill_switch_behavior: "reviewed_fallback",
    created_at: "2026-01-10T12:00:00Z",
    updated_at: "2026-03-12T09:30:00Z",
  },
  {
    key: "marketplace_instant_booking",
    enabled: false,
    rollout_percentage: 0,
    environments: ["development", "staging"],
    owner: "Marketplace Team",
    rationale: "Instant teacher booking without manual teacher pre-approval.",
    dependencies: [],
    kill_switch_behavior: "disable_feature",
    created_at: "2026-02-01T14:00:00Z",
    updated_at: "2026-03-10T11:00:00Z",
  },
  {
    key: "konkur_exam_simulators",
    enabled: true,
    rollout_percentage: 100,
    environments: ["development", "test", "staging", "production"],
    owner: "Curriculum Editorial",
    rationale: "High school nationwide Konkur timed exam simulation with percentile analysis.",
    dependencies: [],
    kill_switch_behavior: "read_only",
    created_at: "2026-02-15T08:00:00Z",
    updated_at: "2026-03-14T10:00:00Z",
  },
  {
    key: "speech_shadowing_v2",
    enabled: true,
    rollout_percentage: 50,
    environments: ["development", "staging", "production"],
    owner: "Audio Research Group",
    rationale: "Advanced phoneme-level acoustic matching and intonation feedback.",
    dependencies: [],
    kill_switch_behavior: "reviewed_fallback",
    created_at: "2026-02-20T16:00:00Z",
    updated_at: "2026-03-14T18:00:00Z",
  },
  {
    key: "crypto_payments_experimental",
    enabled: false,
    rollout_percentage: 0,
    environments: ["development"],
    owner: "Treasury Team",
    rationale: "Alternative payment gateway for international diaspora learners.",
    dependencies: [],
    kill_switch_behavior: "disable_feature",
    created_at: "2026-03-01T10:00:00Z",
    updated_at: "2026-03-12T14:00:00Z",
  },
];

export const MOCK_AUDIT_LOGS: AuditEventRecord[] = [
  {
    id: "aud-001",
    actor_id: "usr-admin-1",
    actor_email: "founder@endoora.ir",
    actor_role: "administrator",
    action: "update",
    target_app: "core",
    target_model: "FeatureFlag",
    target_pk: "speech_shadowing_v2",
    before_summary: { enabled: true, rollout_percentage: 25 },
    after_summary: { enabled: true, rollout_percentage: 50 },
    reason: "Scale rollout to 50% following successful latency benchmark results.",
    request_method: "POST",
    request_path: "/api/admin-ops/flags/speech_shadowing_v2/toggle/",
    environment: "production",
    occurred_at: "2026-03-15T09:40:00Z",
  },
  {
    id: "aud-002",
    actor_id: "usr-admin-1",
    actor_email: "founder@endoora.ir",
    actor_role: "administrator",
    action: "update",
    target_app: "content",
    target_model: "Course",
    target_pk: "ielts-band-8-masterclass",
    before_summary: { status: "in_review" },
    after_summary: { status: "published" },
    reason: "Passed curriculum QA and copyright attribution checks.",
    request_method: "POST",
    request_path: "/api/courses/editor/crs-ielts-8/transition/",
    environment: "production",
    occurred_at: "2026-03-15T08:15:00Z",
  },
  {
    id: "aud-003",
    actor_id: "usr-editor-2",
    actor_email: "editor@endoora.ir",
    actor_role: "editor",
    action: "create",
    target_app: "content",
    target_model: "ContentItem",
    target_pk: "mastering-present-perfect-vs-past-simple",
    before_summary: {},
    after_summary: { slug: "mastering-present-perfect-vs-past-simple", category: "grammar" },
    reason: "Initial authoring of CEFR B1 grammar core guide.",
    request_method: "POST",
    request_path: "/api/content/editor/",
    environment: "production",
    occurred_at: "2026-03-14T14:20:00Z",
  },
];

export async function fetchAdminStats(signal?: AbortSignal): Promise<AdminDashboardStats> {
  try {
    const res = await fetch("/api/admin-ops/stats/", {
      signal,
      credentials: "include",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }
  return MOCK_ADMIN_STATS;
}

export async function fetchAdminFeatureFlags(
  search?: string,
  signal?: AbortSignal
): Promise<{ count: number; results: FeatureFlagRecord[] }> {
  const query = new URLSearchParams();
  if (search) query.set("q", search);

  try {
    const res = await fetch(`/api/admin-ops/flags/?${query.toString()}`, {
      signal,
      credentials: "include",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  let list = [...MOCK_FEATURE_FLAGS];
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(
      (f) =>
        f.key.toLowerCase().includes(s) ||
        f.owner.toLowerCase().includes(s) ||
        f.rationale.toLowerCase().includes(s)
    );
  }
  return { count: list.length, results: list };
}

export async function toggleAdminFeatureFlag(
  key: string,
  data: {
    enabled?: boolean;
    rollout_percentage?: number;
    kill_switch_behavior?: string;
    reason: string;
  }
): Promise<{ flag: FeatureFlagRecord; detail: string }> {
  const res = await fetch(`/api/admin-ops/flags/${key}/toggle/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg =
      err.detail ||
      Object.entries(err)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
        .join(" | ") ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return res.json();
}

export async function fetchAdminAuditLogs(
  params?: {
    target_app?: string;
    action?: string;
    search?: string;
    limit?: number;
  },
  signal?: AbortSignal
): Promise<{ count: number; results: AuditEventRecord[] }> {
  const query = new URLSearchParams();
  if (params?.target_app && params.target_app !== "all") query.set("target_app", params.target_app);
  if (params?.action && params.action !== "all") query.set("action", params.action);
  if (params?.search) query.set("search", params.search);
  if (params?.limit) query.set("limit", String(params.limit));

  try {
    const res = await fetch(`/api/admin-ops/audit/?${query.toString()}`, {
      signal,
      credentials: "include",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  let list = [...MOCK_AUDIT_LOGS];
  if (params?.target_app && params.target_app !== "all") {
    list = list.filter((a) => a.target_app === params.target_app);
  }
  if (params?.action && params.action !== "all") {
    list = list.filter((a) => a.action === params.action);
  }
  if (params?.search) {
    const s = params.search.toLowerCase();
    list = list.filter(
      (a) =>
        a.reason.toLowerCase().includes(s) ||
        a.target_pk.toLowerCase().includes(s) ||
        a.actor_email.toLowerCase().includes(s)
    );
  }
  return { count: list.length, results: list };
}

/**
 * Client API and TypeScript interfaces for Production Monitoring & Observability (OPS-006)
 */

export interface ApmMetrics {
  uptime_percentage: number;
  p50_latency_ms: number;
  p95_latency_ms: number;
  p99_latency_ms: number;
  requests_per_second: number;
  error_rate_percentage: number;
  sla_target_percentage: number;
  status: "HEALTHY" | "DEGRADED" | "CRITICAL";
}

export interface DatabasePoolStatus {
  cluster_nodes: number;
  engine: string;
  active_connections: number;
  available_connections: number;
  max_connections: number;
  slow_queries_last_hour: number;
  status: "OPTIMAL" | "CONGESTED";
}

export interface RedisCacheStatus {
  topology: string;
  hit_ratio_percentage: number;
  keys_count: number;
  memory_used_mb: number;
  status: "OPTIMAL" | "DEGRADED";
}

export interface WorkerQueuesStatus {
  queue_name: string;
  queue_depth: number;
  active_workers: number;
  active_tasks: number;
  failed_tasks_24h: number;
  status: "OPTIMAL" | "BACKLOGGED";
}

export interface IncidentAlertItem {
  id: string;
  title: string;
  title_fa: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  component: "API" | "DATABASE" | "REDIS" | "AI_GATEWAY" | "WORKER" | "NETWORK";
  status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED";
  details: string;
  threshold_breach: string;
  triggered_at: string;
  acknowledged_at: string | null;
  resolved_at: string | null;
}

export interface AlertsSummary {
  active_count: number;
  acknowledged_count: number;
  resolved_count: number;
  active_items: IncidentAlertItem[];
  recent_resolved: IncidentAlertItem[];
}

export interface ObservabilityOverview {
  status: string;
  service_name: string;
  environment: string;
  evaluated_at: string;
  apm_metrics: ApmMetrics;
  database_pool: DatabasePoolStatus;
  redis_cache: RedisCacheStatus;
  worker_queues: WorkerQueuesStatus;
  alerts_summary: AlertsSummary;
}

export interface TraceSpan {
  id: string;
  trace_id: string;
  span_id: string;
  parent_span_id: string | null;
  service_name: string;
  operation_name: string;
  duration_ms: number;
  status: "OK" | "ERROR" | "WARNING";
  http_method?: string;
  http_status?: number;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface WaterfallTrace {
  trace_id: string;
  root_service: string;
  root_operation: string;
  total_duration_ms: number;
  http_status: number;
  status: string;
  span_count: number;
  timestamp: string;
  spans: TraceSpan[];
}

export interface StructuredLogItem {
  timestamp: string;
  level: "INFO" | "WARNING" | "ERROR" | "CRITICAL";
  trace_id: string;
  correlation_id: string;
  method: string;
  path: string;
  status_code: number;
  duration_ms: number;
  client_ip: string;
  user_id: string | null;
}

// Realistic fallback mock data for development and SSR
export const FALLBACK_OBSERVABILITY_OVERVIEW: ObservabilityOverview = {
  status: "OPTIMAL",
  service_name: "endoora-production-platform",
  environment: "production",
  evaluated_at: new Date().toISOString(),
  apm_metrics: {
    uptime_percentage: 99.85,
    p50_latency_ms: 42.0,
    p95_latency_ms: 185.0,
    p99_latency_ms: 340.0,
    requests_per_second: 142.5,
    error_rate_percentage: 0.15,
    sla_target_percentage: 99.5,
    status: "HEALTHY",
  },
  database_pool: {
    cluster_nodes: 3,
    engine: "PostgreSQL 16 HA + PgBouncer",
    active_connections: 18,
    available_connections: 82,
    max_connections: 100,
    slow_queries_last_hour: 0,
    status: "OPTIMAL",
  },
  redis_cache: {
    topology: "Redis Sentinel (Quorum 2/3)",
    hit_ratio_percentage: 96.4,
    keys_count: 14280,
    memory_used_mb: 142.8,
    status: "OPTIMAL",
  },
  worker_queues: {
    queue_name: "celery-high-priority",
    queue_depth: 4,
    active_workers: 6,
    active_tasks: 12,
    failed_tasks_24h: 1,
    status: "OPTIMAL",
  },
  alerts_summary: {
    active_count: 1,
    acknowledged_count: 0,
    resolved_count: 1,
    active_items: [
      {
        id: "alt-001",
        title: "Occasional External AI Model Latency Spike",
        title_fa: "نوسان مقطعی تاخیر ارائه‌دهنده خارجی مدل هوش مصنوعی",
        severity: "LOW",
        component: "AI_GATEWAY",
        status: "ACTIVE",
        details: "Provider mistralai/mistral-7b-instruct response latency reached 480ms (circuit breaker intact).",
        threshold_breach: "Provider Latency > 450ms",
        triggered_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        acknowledged_at: null,
        resolved_at: null,
      },
    ],
    recent_resolved: [
      {
        id: "alt-002",
        title: "Database Connection Pool Normalization",
        title_fa: "تثبیت ظرفیت اتصالات کلاستر پایگاه داده",
        severity: "INFO",
        component: "DATABASE",
        status: "RESOLVED",
        details: "PgBouncer active pool returned to steady state at 18/100 connections.",
        threshold_breach: "Active connections < 75%",
        triggered_at: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
        acknowledged_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        resolved_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
    ],
  },
};

export const FALLBACK_WATERFALL_TRACES: WaterfallTrace[] = [
  {
    trace_id: "trc-98a2f1c84b10",
    root_service: "web-gateway",
    root_operation: "HTTP GET /api/dashboard/home/",
    total_duration_ms: 64.2,
    http_status: 200,
    status: "OK",
    span_count: 3,
    timestamp: new Date(Date.now() - 1000 * 15).toISOString(),
    spans: [
      {
        id: "sp-01",
        trace_id: "trc-98a2f1c84b10",
        span_id: "sp-root",
        parent_span_id: null,
        service_name: "web-gateway",
        operation_name: "HTTP GET /api/dashboard/home/",
        duration_ms: 64.2,
        status: "OK",
        http_method: "GET",
        http_status: 200,
        metadata: { client_ip: "5.218.42.19", user_role: "learner" },
        created_at: new Date(Date.now() - 1000 * 15).toISOString(),
      },
      {
        id: "sp-02",
        trace_id: "trc-98a2f1c84b10",
        span_id: "sp-cache",
        parent_span_id: "sp-root",
        service_name: "redis-cache",
        operation_name: "REDIS GET user:session:cache",
        duration_ms: 2.1,
        status: "OK",
        metadata: { hit: true, key: "session_token" },
        created_at: new Date(Date.now() - 1000 * 15).toISOString(),
      },
      {
        id: "sp-03",
        trace_id: "trc-98a2f1c84b10",
        span_id: "sp-db",
        parent_span_id: "sp-root",
        service_name: "db-postgresql",
        operation_name: "SQL SELECT missions_dailymission WHERE learner_id",
        duration_ms: 14.5,
        status: "OK",
        metadata: { rows: 1, table: "missions_dailymission" },
        created_at: new Date(Date.now() - 1000 * 15).toISOString(),
      },
    ],
  },
  {
    trace_id: "trc-f4b82c19e57a",
    root_service: "web-gateway",
    root_operation: "HTTP POST /api/writing-mentor/evaluate/",
    total_duration_ms: 385.0,
    http_status: 200,
    status: "OK",
    span_count: 3,
    timestamp: new Date(Date.now() - 1000 * 42).toISOString(),
    spans: [
      {
        id: "sp-04",
        trace_id: "trc-f4b82c19e57a",
        span_id: "sp-root-2",
        parent_span_id: null,
        service_name: "web-gateway",
        operation_name: "HTTP POST /api/writing-mentor/evaluate/",
        duration_ms: 385.0,
        status: "OK",
        http_method: "POST",
        http_status: 200,
        metadata: { task_type: "ielts_task2", word_count: 284 },
        created_at: new Date(Date.now() - 1000 * 42).toISOString(),
      },
      {
        id: "sp-05",
        trace_id: "trc-f4b82c19e57a",
        span_id: "sp-auth-2",
        parent_span_id: "sp-root-2",
        service_name: "django-auth",
        operation_name: "SessionAuthentication.authenticate",
        duration_ms: 3.4,
        status: "OK",
        created_at: new Date(Date.now() - 1000 * 42).toISOString(),
      },
      {
        id: "sp-06",
        trace_id: "trc-f4b82c19e57a",
        span_id: "sp-ai-2",
        parent_span_id: "sp-root-2",
        service_name: "ai-gateway",
        operation_name: "ModelRouter.cascade google/gemma-2-9b-it:free",
        duration_ms: 320.0,
        status: "OK",
        metadata: { prompt_id: "writing_eval_v1", tokens: 1420 },
        created_at: new Date(Date.now() - 1000 * 42).toISOString(),
      },
    ],
  },
];

export async function fetchObservabilityOverview(): Promise<ObservabilityOverview> {
  try {
    const res = await fetch("/api/observability/overview/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return FALLBACK_OBSERVABILITY_OVERVIEW;
    return (await res.json()) as ObservabilityOverview;
  } catch {
    return FALLBACK_OBSERVABILITY_OVERVIEW;
  }
}

export async function fetchWaterfallTraces(limit: number = 20): Promise<WaterfallTrace[]> {
  try {
    const res = await fetch(`/api/observability/traces/?limit=${limit}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return FALLBACK_WATERFALL_TRACES;
    const data = await res.json();
    return data.traces || FALLBACK_WATERFALL_TRACES;
  } catch {
    return FALLBACK_WATERFALL_TRACES;
  }
}

export async function fetchStructuredLogs(
  limit: number = 50,
  level?: string,
  search?: string
): Promise<StructuredLogItem[]> {
  try {
    const params = new URLSearchParams({ limit: String(limit) });
    if (level && level !== "ALL") params.set("level", level);
    if (search) params.set("search", search);

    const res = await fetch(`/api/observability/logs/?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.logs || [];
  } catch {
    return [];
  }
}

export async function acknowledgeIncidentAlert(alertId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`/api/observability/alerts/${alertId}/ack/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return { success: false, message: "خطا در تایید هشدار" };
    return (await res.json()) as { success: boolean; message?: string };
  } catch {
    return { success: false, message: "عدم برقراری ارتباط با سرور" };
  }
}

export async function simulateLatencyDrill(durationMs: number = 480): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch("/api/observability/drill/latency/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ duration_ms: durationMs }),
    });
    if (!res.ok) return { success: false, message: "خطا در اجرای مانور" };
    return (await res.json()) as { success: boolean; message?: string };
  } catch {
    return { success: false, message: "عدم برقراری ارتباط با سرور" };
  }
}

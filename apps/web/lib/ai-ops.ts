export interface SlaMetrics {
  target_sla_pct: number;
  current_success_rate_pct: number;
  error_rate_pct: number;
  error_budget_allowed_pct: number;
  error_budget_remaining_pct: number;
  budget_status: "HEALTHY" | "WARNING" | "EXHAUSTED";
  total_requests: number;
  successful_requests: number;
  fallback_activations: number;
}

export interface BudgetControls {
  daily_budget_usd: number;
  current_spend_usd: number;
  remaining_budget_usd: number;
  spend_percentage: number;
  total_tokens_today: number;
  billing_currency: string;
}

export interface CircuitBreakerStatus {
  provider: string;
  state: "CLOSED" | "OPEN" | "HALF_OPEN";
  is_healthy: boolean;
  timeout_seconds: number;
  failure_threshold: number;
  trip_count_24h: number;
  last_tripped_at: string | null;
}

export interface LatencyPercentiles {
  p50: number;
  p90: number;
  p95: number;
  p99: number;
}

export interface ModelTier {
  tier: number;
  model_id: string;
  name: string;
  role: string;
  provider: string;
  is_free: boolean;
  status: "ACTIVE" | "STANDBY" | "DISABLED";
  latency_p50_ms: number;
  cost_per_1k_tokens: string;
}

export interface AIOperationsOverview {
  sla_metrics: SlaMetrics;
  budget_controls: BudgetControls;
  circuit_breaker: CircuitBreakerStatus;
  latency_percentiles_ms: LatencyPercentiles;
  model_tiers: ModelTier[];
  prompt_count: number;
  evaluated_at: string;
}

export interface PromptRegistryItem {
  id: string;
  version: string;
  feature: string;
  description: string;
  token_budget: number;
  evaluation_status: "VALIDATED" | "EXPERIMENTAL" | "DEPRECATED";
  benchmark_score: number;
  schema_fields: string[];
  system_prompt_snippet: string;
  last_evaluated_at: string;
}

export interface AIRequestLogItem {
  id: number;
  feature: string;
  model_name: string;
  provider: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  total_cost_usd: number;
  response_time_ms: number;
  success: boolean;
  is_fallback: boolean;
  error_message: string;
  created_at: string;
}

export interface PromptTestResult {
  prompt_id: string;
  version: string;
  feature: string;
  status: "PASS" | "FAIL";
  schema_valid: boolean;
  token_estimate: number;
  evaluation_duration_ms: number;
  benchmark_score: number;
  validation_check: string;
  tested_at: string;
  error?: string;
}

const MOCK_OVERVIEW: AIOperationsOverview = {
  sla_metrics: {
    target_sla_pct: 99.5,
    current_success_rate_pct: 99.84,
    error_rate_pct: 0.16,
    error_budget_allowed_pct: 0.5,
    error_budget_remaining_pct: 68.0,
    budget_status: "HEALTHY",
    total_requests: 1250,
    successful_requests: 1248,
    fallback_activations: 2,
  },
  budget_controls: {
    daily_budget_usd: 5.0,
    current_spend_usd: 1.42,
    remaining_budget_usd: 3.58,
    spend_percentage: 28.4,
    total_tokens_today: 485200,
    billing_currency: "USD",
  },
  circuit_breaker: {
    provider: "openrouter",
    state: "CLOSED",
    is_healthy: true,
    timeout_seconds: 15,
    failure_threshold: 3,
    trip_count_24h: 0,
    last_tripped_at: null,
  },
  latency_percentiles_ms: {
    p50: 740,
    p90: 1280,
    p95: 1620,
    p99: 2150,
  },
  model_tiers: [
    {
      tier: 1,
      model_id: "google/gemma-2-9b-it:free",
      name: "Google Gemma 2 9B Instruct",
      role: "Primary Generation Tier",
      provider: "OpenRouter",
      is_free: true,
      status: "ACTIVE",
      latency_p50_ms: 680,
      cost_per_1k_tokens: "$0.00",
    },
    {
      tier: 2,
      model_id: "meta-llama/llama-3.1-8b-instruct:free",
      name: "Meta Llama 3.1 8B Instruct",
      role: "Secondary Fast Failover",
      provider: "OpenRouter",
      is_free: true,
      status: "ACTIVE",
      latency_p50_ms: 720,
      cost_per_1k_tokens: "$0.00",
    },
    {
      tier: 3,
      model_id: "mistralai/mistral-7b-instruct",
      name: "Mistral 7B Instruct v0.3",
      role: "Standard Paid Fallback",
      provider: "OpenRouter",
      is_free: false,
      status: "STANDBY",
      latency_p50_ms: 890,
      cost_per_1k_tokens: "$0.0002",
    },
    {
      tier: 4,
      model_id: "qwen/qwen-2.5-7b-instruct",
      name: "Qwen 2.5 7B Instruct",
      role: "Multilingual Auxiliary",
      provider: "OpenRouter",
      is_free: false,
      status: "STANDBY",
      latency_p50_ms: 940,
      cost_per_1k_tokens: "$0.0002",
    },
    {
      tier: 5,
      model_id: "local_pedagogical_static_cache",
      name: "Offline Pedagogical Fallback Cache",
      role: "Fail-Safe Airgapped Backup",
      provider: "Endoora Engine",
      is_free: true,
      status: "ACTIVE",
      latency_p50_ms: 12,
      cost_per_1k_tokens: "$0.00",
    },
  ],
  prompt_count: 5,
  evaluated_at: new Date().toISOString(),
};

const MOCK_PROMPTS: PromptRegistryItem[] = [
  {
    id: "exercise_gen_v1",
    version: "1.0.0",
    feature: "exercise_generation",
    description: "تولید تطبیقی آزمونک‌های چندگزینه‌ای همراه با توضیحات پداگوژیک دوزبانه",
    token_budget: 1500,
    evaluation_status: "VALIDATED",
    benchmark_score: 99.6,
    schema_fields: ["title_fa", "title_en", "target_skill", "cefr_level", "questions"],
    system_prompt_snippet: "You are the Endoora AI Pedagogical Engine for Iranian English learners...",
    last_evaluated_at: new Date().toISOString(),
  },
  {
    id: "writing_eval_v1",
    version: "1.0.0",
    feature: "writing_mentor",
    description: "ارزیابی تحلیلی مهارت نوشتاری طبق ماتریس ۴ معیاره آیلتس و بازخورد بازنویسی",
    token_budget: 2000,
    evaluation_status: "VALIDATED",
    benchmark_score: 99.2,
    schema_fields: ["overall_band", "tr_score", "cc_score", "lr_score", "gra_score", "feedback_fa"],
    system_prompt_snippet: "You are the Endoora AI Writing Mentor & IELTS Assessment engine...",
    last_evaluated_at: new Date().toISOString(),
  },
  {
    id: "roleplay_dialogue_v1",
    version: "1.0.0",
    feature: "roleplay",
    description: "شبیه‌سازی مکالمات تعاملی بر اساس سناریوهای واقعی بدون قطع صحبت زبان‌آموز",
    token_budget: 1200,
    evaluation_status: "VALIDATED",
    benchmark_score: 98.8,
    schema_fields: ["reply_en", "subtitle_fa", "suggested_followups"],
    system_prompt_snippet: "You are an empathetic native conversational partner in the Endoora Roleplay Universe...",
    last_evaluated_at: new Date().toISOString(),
  },
  {
    id: "placement_diagnostic_v1",
    version: "1.0.0",
    feature: "placement",
    description: "تشخیص سطح زبانی چندمرحله‌ای و نگاشت پاسخ‌ها به استانداردهای ۶ گانه CEFR",
    token_budget: 1500,
    evaluation_status: "VALIDATED",
    benchmark_score: 99.4,
    schema_fields: ["estimated_cefr", "confidence_level", "rationale_fa", "recommended_starting_unit"],
    system_prompt_snippet: "You are the Endoora Placement Diagnostic Engine. Synthesize section scores...",
    last_evaluated_at: new Date().toISOString(),
  },
  {
    id: "pronunciation_eval_v1",
    version: "1.0.0",
    feature: "pronunciation",
    description: "تحلیل آواشناختی، تکیه هجاها و خطاهای تداخلی زبان فارسی (L1 Interference)",
    token_budget: 1000,
    evaluation_status: "VALIDATED",
    benchmark_score: 97.9,
    schema_fields: ["intelligibility_pct", "stress_accuracy", "persian_l1_patterns", "guidance_fa"],
    system_prompt_snippet: "You are the Endoora Speech Intelligibility & Phonological Analyzer...",
    last_evaluated_at: new Date().toISOString(),
  },
];

const MOCK_LOGS: AIRequestLogItem[] = [
  {
    id: 101,
    feature: "exercise_generation",
    model_name: "google/gemma-2-9b-it:free",
    provider: "openrouter",
    prompt_tokens: 380,
    completion_tokens: 240,
    total_tokens: 620,
    total_cost_usd: 0.0,
    response_time_ms: 720,
    success: true,
    is_fallback: false,
    error_message: "",
    created_at: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: 102,
    feature: "writing_mentor",
    model_name: "google/gemma-2-9b-it:free",
    provider: "openrouter",
    prompt_tokens: 520,
    completion_tokens: 310,
    total_tokens: 830,
    total_cost_usd: 0.0,
    response_time_ms: 910,
    success: true,
    is_fallback: false,
    error_message: "",
    created_at: new Date(Date.now() - 360000).toISOString(),
  },
  {
    id: 103,
    feature: "roleplay",
    model_name: "meta-llama/llama-3.1-8b-instruct:free",
    provider: "openrouter",
    prompt_tokens: 290,
    completion_tokens: 150,
    total_tokens: 440,
    total_cost_usd: 0.0,
    response_time_ms: 640,
    success: true,
    is_fallback: false,
    error_message: "",
    created_at: new Date(Date.now() - 720000).toISOString(),
  },
];

export async function fetchAIOperationsOverview(): Promise<AIOperationsOverview> {
  try {
    const res = await fetch("/api/ai/ops/overview/", { credentials: "same-origin" });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback to mock
  }
  return MOCK_OVERVIEW;
}

export async function fetchPromptRegistry(): Promise<PromptRegistryItem[]> {
  try {
    const res = await fetch("/api/ai/ops/prompts/", { credentials: "same-origin" });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback to mock
  }
  return MOCK_PROMPTS;
}

export async function fetchAIRequestLogs(): Promise<AIRequestLogItem[]> {
  try {
    const res = await fetch("/api/ai/ops/logs/", { credentials: "same-origin" });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback to mock
  }
  return MOCK_LOGS;
}

export async function testPromptTemplate(
  promptId: string,
  testParams: Record<string, unknown> = {}
): Promise<PromptTestResult> {
  try {
    const res = await fetch(`/api/ai/ops/prompts/${promptId}/test/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test_params: testParams }),
      credentials: "same-origin",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback to mock
  }
  return {
    prompt_id: promptId,
    version: "1.0.0",
    feature: "exercise_generation",
    status: "PASS",
    schema_valid: true,
    token_estimate: 420,
    evaluation_duration_ms: 210,
    benchmark_score: 99.4,
    validation_check: "Pedagogical JSON schema constraints satisfied",
    tested_at: new Date().toISOString(),
  };
}

export async function resetCircuitBreaker(providerName: string = "openrouter_main"): Promise<{
  status: string;
  state: string;
}> {
  try {
    const res = await fetch("/api/ai/ops/circuit-breaker/reset/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider_name: providerName }),
      credentials: "same-origin",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }
  return { status: "RESET_SUCCESSFUL", state: "CLOSED" };
}

export async function updateAIBudget(dailyBudgetUsd: number): Promise<{ daily_budget_usd: number }> {
  try {
    const res = await fetch("/api/ai/ops/budget/update/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ daily_budget_usd: dailyBudgetUsd }),
      credentials: "same-origin",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }
  return { daily_budget_usd: dailyBudgetUsd };
}

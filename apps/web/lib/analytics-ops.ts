import { endooraApi } from "./endoora-api";

export interface AnalyticsKPIs {
  dau: number;
  wau: number;
  mau: number;
  stickiness_percent: number;
  total_events_30d: number;
  avg_events_per_user: number;
  primary_onboarding_cr: number;
  placement_completion_cr: number;
}

export interface CategoryDistribution {
  category: string;
  label_fa: string;
  events_count: number;
  percentage: number;
}

export interface DailyTrendPoint {
  date: string;
  date_fa: string;
  events_count: number;
  active_users: number;
}

export interface FunnelSummary {
  id: string;
  slug: string;
  name_fa: string;
  name_en: string;
  category: string;
  total_steps: number;
  total_entries: number;
  total_completions: number;
  overall_conversion_rate: number;
}

export interface FunnelStep {
  step_index: number;
  event_name: string;
  name_fa: string;
  name_en: string;
  actors_count: number;
  step_conversion_rate: number;
  cumulative_conversion_rate: number;
  drop_off_count: number;
  drop_off_rate: number;
  median_time_seconds: number;
}

export interface FunnelDetail {
  funnel: {
    id: string;
    slug: string;
    name_fa: string;
    name_en: string;
    description_fa: string;
    description_en: string;
    category: string;
    total_steps: number;
  };
  time_window_days: number;
  total_entries: number;
  total_completions: number;
  overall_conversion_rate: number;
  steps: FunnelStep[];
}

export interface RetentionCohort {
  cohort_index: number;
  cohort_week: string;
  cohort_label_fa: string;
  week_start: string;
  week_end: string;
  new_users: number;
  retention_d1: number | null;
  retention_d7: number | null;
  retention_d14: number | null;
  retention_d30: number | null;
}

export interface AnalyticsOverviewData {
  kpis: AnalyticsKPIs;
  category_breakdown: CategoryDistribution[];
  daily_trend: DailyTrendPoint[];
  funnels_summary: FunnelSummary[];
  evaluated_at: string;
}

export interface AnalyticsEventRecord {
  id: string;
  event_name: string;
  category: string;
  user_id: string | null;
  session_id: string;
  properties: Record<string, unknown>;
  client_ip_hash: string;
  user_agent_category: string;
  locale: string;
  created_at: string;
}

// Fallback Mock Data for High-Reliability UI
export async function fetchAnalyticsOverview(days = 30): Promise<AnalyticsOverviewData> {
  return endooraApi<AnalyticsOverviewData>("/analytics/ops/overview/?days="+days);
}
export function fetchAnalyticsFunnels(days=30) {return endooraApi<FunnelSummary[]>("/analytics/ops/funnels/?days="+days);}
export function fetchFunnelDetail(slug:string,days=30) {return endooraApi<FunnelDetail>("/analytics/ops/funnels/"+encodeURIComponent(slug)+"/?days="+days);}
export function fetchRetentionCohorts(weeks=6) {return endooraApi<RetentionCohort[]>("/analytics/ops/cohorts/?weeks="+weeks);}
export function fetchAnalyticsEvents(params?:{category?:string;event_name?:string;limit?:number}) {
  const query = new URLSearchParams();
  if(params?.category) query.set("category",params.category);
  if(params?.event_name) query.set("event_name",params.event_name);
  if(params?.limit) query.set("limit",String(params.limit));
  return endooraApi<AnalyticsEventRecord[]>("/analytics/ops/events/?"+query);
}

export async function trackProductEvent(
  eventName: string,
  properties?: Record<string, unknown>
): Promise<void> {
  if(localStorage.getItem("endoora_optional_analytics_consent") !== "accepted") throw new Error("Optional analytics disabled");
  await endooraApi("/analytics/track/",{method:"POST",json:{event_name:eventName, properties:properties || {},optional_consent:true}});
}

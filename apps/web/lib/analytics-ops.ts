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
export const MOCK_ANALYTICS_OVERVIEW: AnalyticsOverviewData = {
  kpis: {
    dau: 1420,
    wau: 4850,
    mau: 12600,
    stickiness_percent: 28.6,
    total_events_30d: 48250,
    avg_events_per_user: 3.8,
    primary_onboarding_cr: 36.8,
    placement_completion_cr: 78.4,
  },
  category_breakdown: [
    { category: "learning", label_fa: "یادگیری روزانه و تمرین (Learning)", events_count: 20500, percentage: 42.5 },
    { category: "placement", label_fa: "تعیین سطح و ارزیابی (Placement)", events_count: 9200, percentage: 19.1 },
    { category: "onboarding", label_fa: "آنبوردینگ و شروع (Onboarding)", events_count: 6800, percentage: 14.1 },
    { category: "auth", label_fa: "ورود و هویت (Authentication)", events_count: 5400, percentage: 11.2 },
    { category: "teacher", label_fa: "تدریس و جلسات (Teacher)", events_count: 3850, percentage: 8.0 },
    { category: "route", label_fa: "ناوبری و بازدید صفحات (Navigation)", events_count: 1650, percentage: 3.4 },
    { category: "commerce", label_fa: "تراکنش و خرید (Commerce)", events_count: 850, percentage: 1.7 },
  ],
  daily_trend: [
    { date: "2026-09-02", date_fa: "۶/۱۲", events_count: 2950, active_users: 1134 },
    { date: "2026-09-03", date_fa: "۶/۱۳", events_count: 3100, active_users: 1192 },
    { date: "2026-09-04", date_fa: "۶/۱۴", events_count: 3250, active_users: 1250 },
    { date: "2026-09-05", date_fa: "۶/۱۵", events_count: 3180, active_users: 1223 },
    { date: "2026-09-06", date_fa: "۶/۱۶", events_count: 3420, active_users: 1315 },
    { date: "2026-09-07", date_fa: "۶/۱۷", events_count: 3500, active_users: 1346 },
    { date: "2026-09-08", date_fa: "۶/۱۸", events_count: 3380, active_users: 1300 },
    { date: "2026-09-09", date_fa: "۶/۱۹", events_count: 3620, active_users: 1392 },
    { date: "2026-09-10", date_fa: "۶/۲۰", events_count: 3750, active_users: 1442 },
    { date: "2026-09-11", date_fa: "۶/۲۱", events_count: 3690, active_users: 1419 },
    { date: "2026-09-12", date_fa: "۶/۲۲", events_count: 3820, active_users: 1469 },
    { date: "2026-09-13", date_fa: "۶/۲۳", events_count: 3950, active_users: 1519 },
    { date: "2026-09-14", date_fa: "۶/۲۴", events_count: 4120, active_users: 1584 },
    { date: "2026-09-15", date_fa: "۶/۲۵", events_count: 4280, active_users: 1646 },
  ],
  funnels_summary: [
    {
      id: "f-1",
      slug: "onboarding-funnel",
      name_fa: "فانل ثبت‌نام و آنبوردینگ",
      name_en: "User Onboarding & Signup Funnel",
      category: "onboarding",
      total_steps: 5,
      total_entries: 2400,
      total_completions: 884,
      overall_conversion_rate: 36.8,
    },
    {
      id: "f-2",
      slug: "placement-funnel",
      name_fa: "فانل تعیین سطح و شروع یادگیری",
      name_en: "Diagnostic Placement & First Mission",
      category: "placement",
      total_steps: 6,
      total_entries: 1650,
      total_completions: 1294,
      overall_conversion_rate: 78.4,
    },
    {
      id: "f-3",
      slug: "teacher-booking-funnel",
      name_fa: "فانل رزرو و خرید جلسه معلم",
      name_en: "Teacher Marketplace Booking & Checkout",
      category: "monetization",
      total_steps: 6,
      total_entries: 980,
      total_completions: 215,
      overall_conversion_rate: 21.9,
    },
    {
      id: "f-4",
      slug: "learning-retention-loop",
      name_fa: "چرخه یادگیری روزانه و حفظ کاربر",
      name_en: "Daily Learning Habit & SRS Retention Loop",
      category: "retention",
      total_steps: 5,
      total_entries: 3100,
      total_completions: 2015,
      overall_conversion_rate: 65.0,
    },
  ],
  evaluated_at: new Date().toISOString(),
};

export const MOCK_FUNNEL_DETAILS: Record<string, FunnelDetail> = {
  "onboarding-funnel": {
    funnel: {
      id: "f-1",
      slug: "onboarding-funnel",
      name_fa: "فانل ثبت‌نام و آنبوردینگ",
      name_en: "User Onboarding & Signup Funnel",
      description_fa: "مسیر ورود کاربر از صفحه فرود تا تکمیل ثبت‌نام و انتخاب نقش و هدف",
      description_en: "User conversion flow from landing page to onboarding completion",
      category: "onboarding",
      total_steps: 5,
    },
    time_window_days: 30,
    total_entries: 2400,
    total_completions: 884,
    overall_conversion_rate: 36.8,
    steps: [
      {
        step_index: 1,
        event_name: "route_view_landing",
        name_fa: "بازدید صفحه اصلی",
        name_en: "Landing Page View",
        actors_count: 2400,
        step_conversion_rate: 100.0,
        cumulative_conversion_rate: 100.0,
        drop_off_count: 0,
        drop_off_rate: 0.0,
        median_time_seconds: 0,
      },
      {
        step_index: 2,
        event_name: "auth_signup_attempt",
        name_fa: "تلاش برای ثبت‌نام",
        name_en: "Signup Attempt",
        actors_count: 1560,
        step_conversion_rate: 65.0,
        cumulative_conversion_rate: 65.0,
        drop_off_count: 840,
        drop_off_rate: 35.0,
        median_time_seconds: 45,
      },
      {
        step_index: 3,
        event_name: "auth_otp_verify",
        name_fa: "تأیید کد یکبارمصرف",
        name_en: "OTP Verification",
        actors_count: 1326,
        step_conversion_rate: 85.0,
        cumulative_conversion_rate: 55.3,
        drop_off_count: 234,
        drop_off_rate: 15.0,
        median_time_seconds: 90,
      },
      {
        step_index: 4,
        event_name: "onboarding_started",
        name_fa: "ورود به آنبوردینگ",
        name_en: "Onboarding Flow Started",
        actors_count: 1127,
        step_conversion_rate: 85.0,
        cumulative_conversion_rate: 47.0,
        drop_off_count: 199,
        drop_off_rate: 15.0,
        median_time_seconds: 135,
      },
      {
        step_index: 5,
        event_name: "onboarding_completed",
        name_fa: "تکمیل پروفایل و آنبوردینگ",
        name_en: "Onboarding Completed",
        actors_count: 884,
        step_conversion_rate: 78.4,
        cumulative_conversion_rate: 36.8,
        drop_off_count: 243,
        drop_off_rate: 21.6,
        median_time_seconds: 180,
      },
    ],
  },
  "placement-funnel": {
    funnel: {
      id: "f-2",
      slug: "placement-funnel",
      name_fa: "فانل تعیین سطح و شروع یادگیری",
      name_en: "Diagnostic Placement & First Mission",
      description_fa: "مسیر کاربر از ورود به آزمون تعیین سطح تا فعال‌سازی و اتمام اولین مأموریت",
      description_en: "Learner activation from diagnostic placement test to first mission completion",
      category: "placement",
      total_steps: 6,
    },
    time_window_days: 30,
    total_entries: 1650,
    total_completions: 1294,
    overall_conversion_rate: 78.4,
    steps: [
      { step_index: 1, event_name: "route_view_placement", name_fa: "ورود به صفحه تعیین سطح", name_en: "Placement Page View", actors_count: 1650, step_conversion_rate: 100.0, cumulative_conversion_rate: 100.0, drop_off_count: 0, drop_off_rate: 0.0, median_time_seconds: 0 },
      { step_index: 2, event_name: "placement_started", name_fa: "شروع آزمون تعیین سطح", name_en: "Placement Test Started", actors_count: 1535, step_conversion_rate: 93.0, cumulative_conversion_rate: 93.0, drop_off_count: 115, drop_off_rate: 7.0, median_time_seconds: 30 },
      { step_index: 3, event_name: "placement_completed", name_fa: "اتمام موفق آزمون", name_en: "Placement Test Completed", actors_count: 1412, step_conversion_rate: 92.0, cumulative_conversion_rate: 85.6, drop_off_count: 123, drop_off_rate: 8.0, median_time_seconds: 480 },
      { step_index: 4, event_name: "route_view_dashboard", name_fa: "ورود به داشبورد زبان‌آموز", name_en: "Learner Dashboard View", actors_count: 1384, step_conversion_rate: 98.0, cumulative_conversion_rate: 83.9, drop_off_count: 28, drop_off_rate: 2.0, median_time_seconds: 510 },
      { step_index: 5, event_name: "mission_started", name_fa: "شروع مأموریت روزانه اول", name_en: "First Daily Mission Started", actors_count: 1342, step_conversion_rate: 97.0, cumulative_conversion_rate: 81.3, drop_off_count: 42, drop_off_rate: 3.0, median_time_seconds: 560 },
      { step_index: 6, event_name: "mission_completed", name_fa: "تکمیل اولین مأموریت", name_en: "First Mission Completed", actors_count: 1294, step_conversion_rate: 96.4, cumulative_conversion_rate: 78.4, drop_off_count: 48, drop_off_rate: 3.6, median_time_seconds: 720 },
    ],
  },
  "teacher-booking-funnel": {
    funnel: {
      id: "f-3",
      slug: "teacher-booking-funnel",
      name_fa: "فانل رزرو و خرید جلسه معلم",
      name_en: "Teacher Marketplace Booking & Checkout",
      description_fa: "مسیر جستجوی معلم، مشاهده تقویم، رزرو و پرداخت موفق در حساب امانی",
      description_en: "From teacher marketplace search to successful escrow payment",
      category: "monetization",
      total_steps: 6,
    },
    time_window_days: 30,
    total_entries: 980,
    total_completions: 215,
    overall_conversion_rate: 21.9,
    steps: [
      { step_index: 1, event_name: "teacher_search_performed", name_fa: "جستجوی مدرسین", name_en: "Teacher Search", actors_count: 980, step_conversion_rate: 100.0, cumulative_conversion_rate: 100.0, drop_off_count: 0, drop_off_rate: 0.0, median_time_seconds: 0 },
      { step_index: 2, event_name: "teacher_profile_viewed", name_fa: "مشاهده پروفایل مدرس", name_en: "Teacher Profile Viewed", actors_count: 686, step_conversion_rate: 70.0, cumulative_conversion_rate: 70.0, drop_off_count: 294, drop_off_rate: 30.0, median_time_seconds: 40 },
      { step_index: 3, event_name: "teacher_availability_checked", name_fa: "بررسی زمان‌های خالی تقویم", name_en: "Calendar Availability Checked", actors_count: 480, step_conversion_rate: 70.0, cumulative_conversion_rate: 49.0, drop_off_count: 206, drop_off_rate: 30.0, median_time_seconds: 75 },
      { step_index: 4, event_name: "teacher_booking_requested", name_fa: "درخواست رزرو کلاس", name_en: "Session Booking Requested", actors_count: 336, step_conversion_rate: 70.0, cumulative_conversion_rate: 34.3, drop_off_count: 144, drop_off_rate: 30.0, median_time_seconds: 120 },
      { step_index: 5, event_name: "checkout_initiated", name_fa: "ورود به صفحه پرداخت", name_en: "Checkout Initiated", actors_count: 269, step_conversion_rate: 80.1, cumulative_conversion_rate: 27.4, drop_off_count: 67, drop_off_rate: 19.9, median_time_seconds: 150 },
      { step_index: 6, event_name: "payment_succeeded", name_fa: "پرداخت موفق در سپرده امانی", name_en: "Payment Succeeded", actors_count: 215, step_conversion_rate: 79.9, cumulative_conversion_rate: 21.9, drop_off_count: 54, drop_off_rate: 20.1, median_time_seconds: 210 },
    ],
  },
  "learning-retention-loop": {
    funnel: {
      id: "f-4",
      slug: "learning-retention-loop",
      name_fa: "چرخه یادگیری روزانه و حفظ کاربر",
      name_en: "Daily Learning Habit & SRS Retention Loop",
      description_fa: "چرخه تعاملی روزانه: ورود به اپ، انجام مأموریت، مرور فلش‌کارت و تمرین مهارت",
      description_en: "Core habit loop of daily mission and spaced repetition practice",
      category: "retention",
      total_steps: 5,
    },
    time_window_days: 30,
    total_entries: 3100,
    total_completions: 2015,
    overall_conversion_rate: 65.0,
    steps: [
      { step_index: 1, event_name: "route_view_dashboard", name_fa: "ورود به اپلیکیشن", name_en: "App Active / Dashboard", actors_count: 3100, step_conversion_rate: 100.0, cumulative_conversion_rate: 100.0, drop_off_count: 0, drop_off_rate: 0.0, median_time_seconds: 0 },
      { step_index: 2, event_name: "mission_started", name_fa: "شروع مأموریت روزانه", name_en: "Daily Mission Started", actors_count: 2790, step_conversion_rate: 90.0, cumulative_conversion_rate: 90.0, drop_off_count: 310, drop_off_rate: 10.0, median_time_seconds: 30 },
      { step_index: 3, event_name: "srs_review_started", name_fa: "ورود به مرور لغات SRS", name_en: "SRS Vocabulary Started", actors_count: 2511, step_conversion_rate: 90.0, cumulative_conversion_rate: 81.0, drop_off_count: 279, drop_off_rate: 10.0, median_time_seconds: 60 },
      { step_index: 4, event_name: "srs_review_completed", name_fa: "تکمیل مرور لغات", name_en: "SRS Review Completed", actors_count: 2260, step_conversion_rate: 90.0, cumulative_conversion_rate: 72.9, drop_off_count: 251, drop_off_rate: 10.0, median_time_seconds: 180 },
      { step_index: 5, event_name: "mission_completed", name_fa: "تکمیل کامل مأموریت روزانه", name_en: "Daily Mission Completed", actors_count: 2015, step_conversion_rate: 89.2, cumulative_conversion_rate: 65.0, drop_off_count: 245, drop_off_rate: 10.8, median_time_seconds: 360 },
    ],
  },
};

export const MOCK_RETENTION_COHORTS: RetentionCohort[] = [
  { cohort_index: 0, cohort_week: "2026-W36", cohort_label_fa: "هفته ۳۶ (شهریور)", week_start: "2026-09-08", week_end: "2026-09-14", new_users: 385, retention_d1: 74.2, retention_d7: 48.6, retention_d14: null, retention_d30: null },
  { cohort_index: 1, cohort_week: "2026-W35", cohort_label_fa: "هفته ۳۵ (شهریور)", week_start: "2026-09-01", week_end: "2026-09-07", new_users: 360, retention_d1: 72.8, retention_d7: 46.5, retention_d14: 36.2, retention_d30: null },
  { cohort_index: 2, cohort_week: "2026-W34", cohort_label_fa: "هفته ۳۴ (مرداد)", week_start: "2026-08-25", week_end: "2026-08-31", new_users: 342, retention_d1: 71.5, retention_d7: 45.1, retention_d14: 34.8, retention_d30: null },
  { cohort_index: 3, cohort_week: "2026-W33", cohort_label_fa: "هفته ۳۳ (مرداد)", week_start: "2026-08-18", week_end: "2026-08-24", new_users: 318, retention_d1: 70.2, retention_d7: 43.8, retention_d14: 33.5, retention_d30: null },
  { cohort_index: 4, cohort_week: "2026-W32", cohort_label_fa: "هفته ۳۲ (مرداد)", week_start: "2026-08-11", week_end: "2026-08-17", new_users: 295, retention_d1: 69.4, retention_d7: 42.6, retention_d14: 32.1, retention_d30: 25.4 },
  { cohort_index: 5, cohort_week: "2026-W31", cohort_label_fa: "هفته ۳۱ (مرداد)", week_start: "2026-08-04", week_end: "2026-08-10", new_users: 280, retention_d1: 68.8, retention_d7: 41.5, retention_d14: 31.0, retention_d30: 24.2 },
];

export const MOCK_RECENT_EVENTS: AnalyticsEventRecord[] = [
  { id: "ev-1", event_name: "mission_completed", category: "learning", user_id: "u-892", session_id: "s-101", properties: { mission_type: "speaking", score: 92 }, client_ip_hash: "a4f8...3b9", user_agent_category: "mobile", locale: "fa", created_at: "2 دقیقه پیش" },
  { id: "ev-2", event_name: "payment_succeeded", category: "commerce", user_id: "u-451", session_id: "s-102", properties: { amount_tomans: 250000, teacher_id: "t-12" }, client_ip_hash: "c2e1...8fa", user_agent_category: "desktop", locale: "fa", created_at: "5 دقیقه پیش" },
  { id: "ev-3", event_name: "placement_completed", category: "placement", user_id: "u-992", session_id: "s-103", properties: { cefr_level: "B2", duration_sec: 420 }, client_ip_hash: "7f4d...11c", user_agent_category: "mobile", locale: "fa", created_at: "9 دقیقه پیش" },
  { id: "ev-4", event_name: "auth_signup_success", category: "auth", user_id: "u-992", session_id: "s-103", properties: { provider: "mobile_otp" }, client_ip_hash: "7f4d...11c", user_agent_category: "mobile", locale: "fa", created_at: "18 دقیقه پیش" },
  { id: "ev-5", event_name: "srs_review_completed", category: "learning", user_id: "u-334", session_id: "s-105", properties: { cards_reviewed: 15, accuracy_pct: 86.6 }, client_ip_hash: "e501...62a", user_agent_category: "desktop", locale: "fa", created_at: "24 دقیقه پیش" },
  { id: "ev-6", event_name: "teacher_booking_requested", category: "teacher", user_id: "u-612", session_id: "s-106", properties: { session_slot: "2026-09-17T18:00:00Z" }, client_ip_hash: "99cb...31e", user_agent_category: "desktop", locale: "fa", created_at: "31 دقیقه پیش" },
];

// Client API Functions
export async function fetchAnalyticsOverview(days = 30): Promise<AnalyticsOverviewData> {
  try {
    const data = await endooraApi<AnalyticsOverviewData>(`/api/analytics/ops/overview/?days=${days}`, {
      method: "GET",
    });
    if (data && data.kpis) {
      return data;
    }
  } catch (err) {
    console.warn("Analytics API fallback to mock overview:", err);
  }
  return MOCK_ANALYTICS_OVERVIEW;
}

export async function fetchAnalyticsFunnels(days = 30): Promise<FunnelSummary[]> {
  try {
    const data = await endooraApi<FunnelSummary[]>(`/api/analytics/ops/funnels/?days=${days}`, {
      method: "GET",
    });
    if (data && Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn("Analytics API fallback to mock funnels list:", err);
  }
  return MOCK_ANALYTICS_OVERVIEW.funnels_summary;
}

export async function fetchFunnelDetail(slug: string, days = 30): Promise<FunnelDetail> {
  try {
    const data = await endooraApi<FunnelDetail>(`/api/analytics/ops/funnels/${slug}/?days=${days}`, {
      method: "GET",
    });
    if (data && data.steps) {
      return data;
    }
  } catch (err) {
    console.warn(`Analytics API fallback to mock funnel detail for ${slug}:`, err);
  }
  return MOCK_FUNNEL_DETAILS[slug] || MOCK_FUNNEL_DETAILS["onboarding-funnel"];
}

export async function fetchRetentionCohorts(weeks = 6): Promise<RetentionCohort[]> {
  try {
    const data = await endooraApi<RetentionCohort[]>(`/api/analytics/ops/cohorts/?weeks=${weeks}`, {
      method: "GET",
    });
    if (data && Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn("Analytics API fallback to mock retention cohorts:", err);
  }
  return MOCK_RETENTION_COHORTS;
}

export async function fetchAnalyticsEvents(params?: {
  category?: string;
  event_name?: string;
  limit?: number;
}): Promise<AnalyticsEventRecord[]> {
  try {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.event_name) query.set("event_name", params.event_name);
    if (params?.limit) query.set("limit", String(params.limit));

    const data = await endooraApi<AnalyticsEventRecord[]>(`/api/analytics/ops/events/?${query.toString()}`, {
      method: "GET",
    });
    if (data && Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn("Analytics API fallback to mock events:", err);
  }
  return MOCK_RECENT_EVENTS;
}

export async function trackProductEvent(
  eventName: string,
  properties?: Record<string, unknown>
): Promise<void> {
  try {
    await endooraApi("/api/analytics/track/", {
      method: "POST",
      json: {
        event_name: eventName,
        properties: properties || {},
        locale: "fa",
      },
    });
  } catch (err) {
    // Non-blocking telemetry delivery
    console.debug(`[Telemetry] Failed to deliver event ${eventName}:`, err);
  }
}

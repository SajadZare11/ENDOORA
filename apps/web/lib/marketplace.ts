import { endooraApi } from "./endoora-api";

export type BookingStatus =
  | "confirmed"
  | "reschedule_requested"
  | "in_progress"
  | "completed"
  | "cancelled_by_learner"
  | "cancelled_by_teacher"
  | "no_show"
  | "disputed";

export interface SessionBooking {
  id: string;
  request_id?: string | null;
  offer_id?: string | null;
  learner_id: string;
  learner_name: string;
  teacher_id: string;
  teacher_name: string;
  scheduled_start: string; // ISO UTC
  scheduled_end: string;   // ISO UTC
  duration_minutes: number;
  status: BookingStatus;
  status_display: string;
  rate_toman: number;
  online_format: string;
  format_display: string;
  target_skill: string;
  skill_display: string;
  target_subskill?: string;
  learner_notes?: string;
  teacher_notes?: string;
  cancellation_reason?: string;
  cancelled_by_id?: string | null;
  reschedule_proposed_start?: string | null;
  reschedule_proposed_by_id?: string | null;
  reschedule_note?: string;
  meeting_room_url: string;
  is_active: boolean;
  can_reschedule: boolean;
  can_cancel: boolean;
  can_start: boolean;
  can_complete: boolean;
  can_respond_reschedule: boolean;
  created_at: string;
  updated_at: string;
}

export interface MarketplaceRequest {
  id: string;
  learner_display_name?: string;
  target_skill: string;
  skill_display?: string;
  target_subskill?: string;
  target_cefr_level: string;
  short_description: string;
  preferred_time_window: string;
  time_window_display?: string;
  duration_minutes: number;
  online_format: string;
  format_display?: string;
  budget_max_toman?: number | null;
  status: "open" | "matched" | "booked" | "expired" | "cancelled";
  status_display?: string;
  matched_offer_id?: string | null;
  matched_offer_detail?: TeacherOffer | null;
  expires_at: string;
  created_at: string;
  offer_count?: number;
  has_my_offer?: boolean;
  my_offer_id?: string | null;
  offers?: TeacherOffer[];
}

export interface TeacherOffer {
  id: string;
  request_id: string;
  teacher_id?: string;
  teacher_name: string;
  teacher_headline: string;
  teacher_verified: boolean;
  rate_toman: number;
  proposed_start_time?: string | null;
  duration_minutes: number;
  online_format: string;
  format_display?: string;
  intro_note: string;
  status: "pending" | "accepted" | "declined" | "withdrawn" | "expired";
  status_display?: string;
  created_at: string;
  expires_at?: string | null;
  request_summary?: {
    target_skill: string;
    skill_display: string;
    target_cefr_level: string;
    duration_minutes: number;
    short_description: string;
    preferred_time_window: string;
    status: string;
  };
}

export interface TeacherEligibility {
  is_teacher: boolean;
  is_teacher_verified: boolean;
  marketplace_eligible: boolean;
  can_access_feed: boolean;
  role: string;
}

export interface TeacherFeedFilters {
  skill?: string;
  cefr_level?: string;
  format?: string;
  timing?: string;
  status?: string;
  offered?: boolean;
}

export interface CreateRequestPayload {
  target_skill: string;
  short_description: string;
  target_subskill?: string;
  target_cefr_level?: string;
  preferred_time_window?: string;
  duration_minutes?: number;
  online_format?: string;
  budget_max_toman?: number | null;
  preferred_teacher_id?: string | null;
  expire_hours?: number;
}

export interface SubmitOfferPayload {
  rate_toman: number;
  intro_note: string;
  proposed_start_time?: string | null;
  duration_minutes?: number;
  online_format?: string;
}

export interface DirectBookingPayload {
  teacher_id: string;
  scheduled_start: string;
  duration_minutes?: number;
  rate_toman: number;
  online_format?: string;
  target_skill?: string;
  target_subskill?: string;
  learner_notes?: string;
  idempotency_key?: string;
}

export async function fetchTeacherEligibility(): Promise<TeacherEligibility> {
  try {
    return await endooraApi<TeacherEligibility>("/api/marketplace/eligibility/");
  } catch {
    return {
      is_teacher: false,
      is_teacher_verified: false,
      marketplace_eligible: false,
      can_access_feed: false,
      role: "anonymous",
    };
  }
}

export async function fetchTeacherFeed(
  filters: TeacherFeedFilters = {}
): Promise<{ requests: MarketplaceRequest[]; count: number }> {
  const query = new URLSearchParams();
  if (filters.skill) query.set("skill", filters.skill);
  if (filters.cefr_level) query.set("cefr_level", filters.cefr_level);
  if (filters.format) query.set("format", filters.format);
  if (filters.timing) query.set("timing", filters.timing);
  if (filters.status) query.set("status", filters.status);
  if (filters.offered !== undefined) query.set("offered", String(filters.offered));

  const path = `/api/marketplace/requests/${query.toString() ? `?${query.toString()}` : ""}`;
  return await endooraApi<{ requests: MarketplaceRequest[]; count: number }>(path);
}

export async function fetchTeacherOffers(
  statusFilter?: string
): Promise<{ offers: TeacherOffer[]; count: number }> {
  const query = statusFilter && statusFilter !== "all" ? `?status=${statusFilter}` : "";
  return await endooraApi<{ offers: TeacherOffer[]; count: number }>(`/api/marketplace/offers/${query}`);
}

export async function submitTeacherOffer(
  requestId: string,
  payload: SubmitOfferPayload
): Promise<TeacherOffer> {
  return await endooraApi<TeacherOffer>(`/api/marketplace/requests/${requestId}/offers/`, {
    method: "POST",
    json: payload,
  });
}

export async function withdrawTeacherOffer(
  offerId: string
): Promise<{ status: string; id: string }> {
  return await endooraApi<{ status: string; id: string }>(`/api/marketplace/offers/${offerId}/withdraw/`, {
    method: "POST",
  });
}

export async function createLearnNowRequest(
  payload: CreateRequestPayload
): Promise<MarketplaceRequest> {
  return await endooraApi<MarketplaceRequest>("/api/marketplace/requests/", {
    method: "POST",
    json: payload,
  });
}

export async function fetchLearnerRequests(): Promise<{ requests: MarketplaceRequest[]; count: number }> {
  return await endooraApi<{ requests: MarketplaceRequest[]; count: number }>("/api/marketplace/requests/?view=mine");
}

export async function fetchRequestDetail(
  requestId: string
): Promise<MarketplaceRequest> {
  return await endooraApi<MarketplaceRequest>(`/api/marketplace/requests/${requestId}/`);
}

export async function cancelLearnerRequest(
  requestId: string
): Promise<{ status: string; id: string }> {
  return await endooraApi<{ status: string; id: string }>(`/api/marketplace/requests/${requestId}/cancel/`, {
    method: "POST",
  });
}

export async function acceptTeacherOffer(
  offerId: string
): Promise<{ status: string; request_id: string; offer_id: string; booking_id: string; booking: SessionBooking; message: string }> {
  return await endooraApi<{ status: string; request_id: string; offer_id: string; booking_id: string; booking: SessionBooking; message: string }>(
    `/api/marketplace/offers/${offerId}/accept/`,
    {
      method: "POST",
    }
  );
}

// ---------------------------------------------------------------------------
// Day 38: Session Booking and Scheduling API Endpoints
// ---------------------------------------------------------------------------

export async function fetchUserBookings(
  statusFilter?: string,
  roleFilter?: "learner" | "teacher"
): Promise<{ bookings: SessionBooking[]; count: number }> {
  const query = new URLSearchParams();
  if (statusFilter && statusFilter !== "all") query.set("status", statusFilter);
  if (roleFilter) query.set("role", roleFilter);
  const path = `/api/marketplace/bookings/${query.toString() ? `?${query.toString()}` : ""}`;
  return await endooraApi<{ bookings: SessionBooking[]; count: number }>(path);
}

export async function fetchBookingDetail(
  bookingId: string
): Promise<SessionBooking> {
  return await endooraApi<SessionBooking>(`/api/marketplace/bookings/${bookingId}/`);
}

export async function createDirectBooking(
  payload: DirectBookingPayload
): Promise<SessionBooking> {
  return await endooraApi<SessionBooking>("/api/marketplace/bookings/create_direct/", {
    method: "POST",
    json: payload,
  });
}

export async function requestBookingReschedule(
  bookingId: string,
  newStartTime: string,
  rescheduleNote?: string
): Promise<SessionBooking> {
  return await endooraApi<SessionBooking>(`/api/marketplace/bookings/${bookingId}/reschedule/`, {
    method: "POST",
    json: {
      new_start_time: newStartTime,
      reschedule_note: rescheduleNote || "",
    },
  });
}

export async function respondBookingReschedule(
  bookingId: string,
  action: "accept" | "decline",
  responseNote?: string
): Promise<SessionBooking> {
  return await endooraApi<SessionBooking>(`/api/marketplace/bookings/${bookingId}/respond_reschedule/`, {
    method: "POST",
    json: {
      action,
      response_note: responseNote || "",
    },
  });
}

export async function cancelBooking(
  bookingId: string,
  reason: string
): Promise<SessionBooking> {
  return await endooraApi<SessionBooking>(`/api/marketplace/bookings/${bookingId}/cancel/`, {
    method: "POST",
    json: {
      reason,
    },
  });
}

export async function startSession(
  bookingId: string
): Promise<SessionBooking> {
  return await endooraApi<SessionBooking>(`/api/marketplace/bookings/${bookingId}/start/`, {
    method: "POST",
  });
}

export async function completeSession(
  bookingId: string,
  notes?: string
): Promise<SessionBooking> {
  return await endooraApi<SessionBooking>(`/api/marketplace/bookings/${bookingId}/complete/`, {
    method: "POST",
    json: {
      notes: notes || "",
    },
  });
}

// ---------------------------------------------------------------------------
// Timezone and Date Format Helpers (Persian-First & Asia/Tehran Reference)
// ---------------------------------------------------------------------------

export const TEHRAN_TIMEZONE = "Asia/Tehran";

export function formatTehranDateTime(isoString: string): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("fa-IR", {
      timeZone: TEHRAN_TIMEZONE,
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return isoString;
  }
}

export function formatTehranDateOnly(isoString: string): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("fa-IR", {
      timeZone: TEHRAN_TIMEZONE,
      weekday: "long",
      month: "short",
      day: "numeric",
    }).format(d);
  } catch {
    return isoString;
  }
}

export function formatTehranTimeOnly(isoString: string): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("fa-IR", {
      timeZone: TEHRAN_TIMEZONE,
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return isoString;
  }
}

export function formatUserLocalTime(isoString: string): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(d);
  } catch {
    return "";
  }
}

export function isSameTimezoneAsTehran(): boolean {
  try {
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return userTz === TEHRAN_TIMEZONE;
  } catch {
    return true;
  }
}

// ---------------------------------------------------------------------------
// Day 39: Teacher Directory, Public Profile, Social Proof & Reviews
// ---------------------------------------------------------------------------

export interface TeacherSocialProof {
  average_rating: number;
  review_count: number;
  completed_sessions: number;
  rating_breakdown: Record<string, number>;
  dimension_averages: {
    teaching_quality: number;
    punctuality: number;
    communication: number;
  };
}

export interface TeacherDirectoryItem {
  id: string;
  name: string;
  headline: string;
  bio: string;
  specialties: string[];
  hourly_rate_toman: number;
  experience_years: number;
  response_time_minutes: number;
  is_teacher_verified: boolean;
  avatar_url?: string | null;
  social_proof: TeacherSocialProof;
}

export interface TeacherPublicProfile extends TeacherDirectoryItem {
  video_intro_url?: string | null;
  education?: string | null;
  certifications?: string[] | null;
  city?: string | null;
  languages?: string[] | null;
  reviews: TeacherReview[];
}

export interface TeacherReview {
  id: string;
  booking_id: string;
  teacher_id: string;
  learner_display_name: string;
  overall_rating: number;
  teaching_quality: number;
  punctuality: number;
  communication: number;
  comment: string;
  teacher_reply?: string | null;
  teacher_replied_at?: string | null;
  created_at: string;
  status: "published" | "pending_moderation" | "flagged" | "rejected";
}

export interface SubmitReviewPayload {
  overall_rating: number;
  teaching_quality: number;
  punctuality: number;
  communication: number;
  comment: string;
}

export interface TeacherDirectoryResponse {
  count: number;
  page: number;
  page_size: number;
  teachers: TeacherDirectoryItem[];
}

export interface TeacherReviewsResponse {
  count: number;
  page: number;
  page_size: number;
  reviews: TeacherReview[];
}

export async function fetchPublicTeachers(params?: {
  search?: string;
  skill?: string;
  min_rating?: number;
  max_rate?: number;
  sort_by?: string;
  page?: number;
}): Promise<TeacherDirectoryResponse> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.skill) query.set("skill", params.skill);
  if (params?.min_rating !== undefined && params.min_rating > 0)
    query.set("min_rating", String(params.min_rating));
  if (params?.max_rate !== undefined && params.max_rate > 0)
    query.set("max_rate", String(params.max_rate));
  if (params?.sort_by) query.set("sort_by", params.sort_by);
  if (params?.page) query.set("page", String(params.page));

  const qs = query.toString();
  const url = `/api/marketplace/teachers/${qs ? `?${qs}` : ""}`;
  return await endooraApi<TeacherDirectoryResponse>(url);
}

export async function fetchTeacherPublicProfile(
  teacherId: string
): Promise<TeacherPublicProfile> {
  return await endooraApi<TeacherPublicProfile>(
    `/api/marketplace/teachers/${teacherId}/`
  );
}

export async function fetchTeacherReviews(
  teacherId: string,
  page: number = 1
): Promise<TeacherReviewsResponse> {
  return await endooraApi<TeacherReviewsResponse>(
    `/api/marketplace/teachers/${teacherId}/reviews/?page=${page}`
  );
}

export async function fetchBookingReview(
  bookingId: string
): Promise<{ review: TeacherReview | null; can_review: boolean; is_completed: boolean }> {
  return await endooraApi<{ review: TeacherReview | null; can_review: boolean; is_completed: boolean }>(
    `/api/marketplace/bookings/${bookingId}/review/`
  );
}

export async function submitBookingReview(
  bookingId: string,
  payload: SubmitReviewPayload
): Promise<TeacherReview> {
  return await endooraApi<TeacherReview>(
    `/api/marketplace/bookings/${bookingId}/review/`,
    {
      method: "POST",
      json: payload,
    }
  );
}

export async function replyToTeacherReview(
  reviewId: string,
  reply: string
): Promise<TeacherReview> {
  return await endooraApi<TeacherReview>(
    `/api/marketplace/reviews/${reviewId}/reply/`,
    {
      method: "POST",
      json: { reply },
    }
  );
}

export async function flagTeacherReview(
  reviewId: string,
  reason: string
): Promise<{ id: string; status: string; message: string }> {
  return await endooraApi<{ id: string; status: string; message: string }>(
    `/api/marketplace/reviews/${reviewId}/flag/`,
    {
      method: "POST",
      json: { reason },
    }
  );
}

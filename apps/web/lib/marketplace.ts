import { endooraApi } from "./endoora-api";

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
): Promise<{ status: string; request_id: string; offer_id: string; message: string }> {
  return await endooraApi<{ status: string; request_id: string; offer_id: string; message: string }>(
    `/api/marketplace/offers/${offerId}/accept/`,
    {
      method: "POST",
    }
  );
}

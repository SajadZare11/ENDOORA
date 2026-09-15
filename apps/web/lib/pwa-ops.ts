import { endooraApi } from "./endoora-api";

export interface DraftTypeStat {
  type: string;
  label: string;
  count: number;
}

export interface NetworkTypeStat {
  type: string;
  count: number;
}

export interface RecentSyncEvent {
  id: string;
  sync_session_id: string;
  drafts_received: number;
  drafts_updated: number;
  conflicts_detected: number;
  network_effective_type: string;
  is_low_bandwidth: boolean;
  payload_bytes: number;
  created_at: string;
}

export interface PWAPosture {
  manifest_status: string;
  service_worker_version: string;
  cache_storage_strategy: string;
  offline_fallback_route: string;
  compliance_status: string;
}

export interface PWAOperationsTelemetry {
  total_drafts_synced: number;
  pending_conflicts_count: number;
  active_drafts_24h: number;
  total_sync_sessions: number;
  low_bandwidth_sessions_count: number;
  low_bandwidth_percentage: number;
  conflict_rate_percent: number;
  offline_cache_hit_rate: number;
  draft_distribution: DraftTypeStat[];
  network_distribution: NetworkTypeStat[];
  recent_sync_events: RecentSyncEvent[];
  pwa_posture: PWAPosture;
  evaluated_at: string;
}

export const MOCK_PWA_TELEMETRY: PWAOperationsTelemetry = {
  total_drafts_synced: 148,
  pending_conflicts_count: 1,
  active_drafts_24h: 36,
  total_sync_sessions: 612,
  low_bandwidth_sessions_count: 89,
  low_bandwidth_percentage: 14.5,
  conflict_rate_percent: 0.16,
  offline_cache_hit_rate: 94.2,
  draft_distribution: [
    { type: "writing_submission", label: "Writing Mentor Submission", count: 62 },
    { type: "placement_checkpoint", label: "Placement Test Checkpoint", count: 44 },
    { type: "teacher_note", label: "Teacher Class Note", count: 21 },
    { type: "roleplay_response", label: "Roleplay Scenario Response", count: 14 },
    { type: "community_draft", label: "Community Post Draft", count: 5 },
    { type: "general_draft", label: "General Resumable Draft", count: 2 },
  ],
  network_distribution: [
    { type: "4g", count: 420 },
    { type: "3g", count: 103 },
    { type: "2g", count: 65 },
    { type: "slow-2g", count: 24 },
  ],
  recent_sync_events: [
    {
      id: "ev-01",
      sync_session_id: "sync-cli-8f12a9",
      drafts_received: 3,
      drafts_updated: 3,
      conflicts_detected: 0,
      network_effective_type: "4g",
      is_low_bandwidth: false,
      payload_bytes: 1420,
      created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
    {
      id: "ev-02",
      sync_session_id: "sync-cli-4c33e1",
      drafts_received: 1,
      drafts_updated: 1,
      conflicts_detected: 0,
      network_effective_type: "3g",
      is_low_bandwidth: true,
      payload_bytes: 480,
      created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: "ev-03",
      sync_session_id: "sync-cli-1a99bb",
      drafts_received: 2,
      drafts_updated: 1,
      conflicts_detected: 1,
      network_effective_type: "2g",
      is_low_bandwidth: true,
      payload_bytes: 890,
      created_at: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    },
  ],
  pwa_posture: {
    manifest_status: "active",
    service_worker_version: "endoora-sw-v1",
    cache_storage_strategy: "stale-while-revalidate / network-first",
    offline_fallback_route: "/offline",
    compliance_status: "SEC-002 Compliant",
  },
  evaluated_at: new Date().toISOString(),
};

export async function fetchPWAOperationsTelemetry(): Promise<PWAOperationsTelemetry> {
  try {
    const data = await endooraApi<PWAOperationsTelemetry>(
      "/api/drafts/ops/telemetry/"
    );
    if (data && typeof data.total_drafts_synced === "number") {
      return data;
    }
  } catch (error) {
    console.warn("Using fallback mock PWA telemetry:", error);
  }
  return MOCK_PWA_TELEMETRY;
}

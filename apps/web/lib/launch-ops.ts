import { endooraApi } from "./endoora-api";
export interface GoldenFlowStep {
  step: number;
  description: string;
  status: string;
}

export interface GoldenFlowItem {
  flow_id: string;
  name: string;
  status: "PASS" | "WARN" | "FAIL";
  duration_ms: number;
  steps: GoldenFlowStep[];
  evidence: string;
}

export interface GoldenFlowRehearsalResult {
  run_id: string;
  score: number;
  status: "PASS" | "WARN" | "FAIL";
  passed_flows: number;
  total_flows: number;
  duration_ms: number;
  rehearsed_at: string;
  flows: GoldenFlowItem[];
}

export interface LaunchCheckItem {
  id: string;
  name: string;
  category: string;
  status: "PASS" | "WARN" | "FAIL";
  requirement: string;
  evidence: string;
}

export interface ProductionLaunchSignoffRecord {
  id: string;
  authorized_by: string | null;
  authorized_by_email: string | null;
  engineer_name: string;
  role: string;
  checklist_version: string;
  status: "APPROVED" | "CONDITIONAL" | "REVOKED";
  verification_score: number;
  confirmation_hash: string;
  notes: string;
  signed_at: string;
}

export interface LaunchStatusScorecard {
  score: number;
  passed_count: number;
  total_checks: number;
  status: "READY_FOR_PRODUCTION" | "ACTION_REQUIRED";
  certification: string;
  evaluated_at: string;
  confirmation_hash: string;
  checks: LaunchCheckItem[];
  latest_rehearsal: {
    id: string | null;
    score: number;
    passed_flows: number;
    total_flows: number;
    duration_ms: number;
    rehearsed_at: string;
  };
  latest_signoff: {
    id: string | null;
    engineer_name: string;
    role: string;
    status: string;
    confirmation_hash: string;
    signed_at: string;
  } | null;
}

export interface GoldenFlowLogSummary {
  id: string;
  operator: string | null;
  operator_email: string | null;
  total_flows: number;
  passed_flows: number;
  duration_ms: number;
  status: string;
  score: number;
  rehearsed_at: string;
}

export function fetchLaunchStatus() {
  return endooraApi<LaunchStatusScorecard>("/launch/status/");
}
export function triggerGoldenFlowRehearsal() {
  return endooraApi<GoldenFlowRehearsalResult>("/launch/rehearsal/", {method: "POST"});
}
export function submitProductionSignoff(payload: {engineer_name: string; role?: string; notes?: string}) {
  return endooraApi<ProductionLaunchSignoffRecord>("/launch/signoff/", {method: "POST", json: payload});
}
export function fetchProductionSignoff() {
  return endooraApi<ProductionLaunchSignoffRecord | null>("/launch/signoff/");
}
export function fetchRehearsalHistory() {
  return endooraApi<GoldenFlowLogSummary[]>("/launch/history/");
}

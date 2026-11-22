import { endooraApi } from "./endoora-api";
export interface PrivacyConsentPreference {
  functional_storage: boolean;
  analytics_processing: boolean;
  ai_model_training_telemetry: boolean;
  marketing_communications: boolean;
  locale: string;
  policy_version: string;
  updated_at: string;
}

export interface DataPurgeLogRecord {
  id: string;
  trigger: string;
  operator_email: string | null;
  accounts_erased: number;
  audio_files_purged: number;
  stale_otps_purged: number;
  stale_exports_purged: number;
  duration_ms: number;
  status: string;
  executed_at: string;
}

export interface RetentionScheduleItem {
  data_category: string;
  category_fa: string;
  retention_period: string;
  legal_basis: string;
  action_on_expiry: string;
}

export interface ComplianceScorecard {
  right_to_access: number;
  right_to_erasure: number;
  right_to_portability: number;
  purpose_limitation: number;
  consent_granularity: number;
  audit_traceability: number;
}

export interface PrivacyTelemetry {
  deletion_stats: { pending: number; completed: number; cancelled: number; total: number; };
  export_stats: { total: number; completed: number; in_progress: number; };
  retention_schedules: RetentionScheduleItem[];
  recent_purge_logs: DataPurgeLogRecord[];
  compliance_scorecard: ComplianceScorecard;
  evaluated_at: string;
}

export function fetchPrivacyPreferences() {return endooraApi<PrivacyConsentPreference>("/privacy/preferences/");}
export function updatePrivacyPreferences(prefs: Partial<PrivacyConsentPreference>) {
  return endooraApi<PrivacyConsentPreference>("/privacy/preferences/",{method:"PUT",json:prefs});
}
export async function fetchPrivacyTelemetry() {
  const data = await endooraApi<{deletion_stats:PrivacyTelemetry["deletion_stats"];export_stats:{completed_count:number};
    retention_schedules:{category:string;period:string}[]; recent_purge_logs:DataPurgeLogRecord[]}>("/privacy/ops/telemetry/");
  return {...data,export_stats:{completed:data.export_stats.completed_count}};
}

export interface RetentionPurgeResult {
  success: boolean;
  dryRun: boolean;
  message: string;
}

export async function triggerRetentionPurge(dryRun: boolean): Promise<RetentionPurgeResult> {
  const result = await endooraApi<{dry_run:boolean;status:string}>("/privacy/ops/trigger-purge/",{method:"POST",json:{dry_run:dryRun}});
  return {success:true,dryRun:result.dry_run,message:result.status};
}

export interface DataExportTriggerResult {
  success: boolean;
  id: string;
  status: string;
  message: string;
}

export async function triggerDataExport(): Promise<DataExportTriggerResult> {
  const data = await endooraApi<{export_id:string;status:string}>("/privacy/export/",{method:"POST"});
  return {success:true,id:data.export_id,status:data.status,message:"Data export ready."};
}

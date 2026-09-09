import { endooraApi } from "./endoora-api";

export interface AtRiskAlert {
  id: string;
  teacher_id: string;
  learner_id: string;
  learner_name: string;
  learner_email: string;
  teacher_class_id: string;
  class_title: string;
  alert_type:
    | "performance_drop"
    | "low_mastery"
    | "missing_assignments"
    | "attendance_drop"
    | "unaddressed_feedback"
    | "manual_flag";
  alert_type_display: string;
  severity: "high" | "medium" | "low";
  severity_display: string;
  status: "active" | "acknowledged" | "resolved" | "dismissed";
  status_display: string;
  title: string;
  description: string;
  metrics_snapshot: Record<string, unknown>;
  acknowledged_at: string | null;
  resolved_at: string | null;
  resolution_notes: string;
  created_at: string;
  updated_at: string;
}

export interface TeacherIntervention {
  id: string;
  teacher_id: string;
  learner_id: string;
  learner_name: string;
  learner_email: string;
  teacher_class_id: string;
  class_title: string;
  alert_id?: string | null;
  alert_title?: string | null;
  intervention_type:
    | "extra_time_accommodation"
    | "targeted_remedial_assignment"
    | "one_on_one_office_hour"
    | "direct_encouragement_note"
    | "learning_plan_adjustment"
    | "other";
  intervention_type_display: string;
  status: "planned" | "in_progress" | "completed" | "cancelled";
  status_display: string;
  title: string;
  description: string;
  action_data: Record<string, unknown>;
  outcome_notes: string;
  score_before: number | null;
  score_after: number | null;
  target_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeacherClassSummary {
  id: string;
  title: string;
  subject: string;
  level: string;
  learner_count: number;
  average_score: number | null;
  submission_rate: number;
  active_alerts_count: number;
  high_severity_alerts_count: number;
}

export interface TeacherAnalyticsOverview {
  total_classes: number;
  total_learners: number;
  average_mastery_percentage: number;
  alerts_summary: {
    total_active: number;
    high_severity: number;
    medium_severity: number;
    low_severity: number;
  };
  interventions_summary: {
    total: number;
    planned: number;
    in_progress: number;
    completed: number;
  };
  class_summaries: TeacherClassSummary[];
  recent_alerts: AtRiskAlert[];
  recent_interventions: TeacherIntervention[];
}

export interface ScoreDistributionBin {
  range: string;
  count: number;
  percentage: number;
  label_fa: string;
}

export interface SkillMasteryItem {
  skill: string;
  label: string;
  average_score: number;
  status: "mastered" | "proficient" | "needs_work";
}

export interface TrajectoryItem {
  assignment_id: string;
  title: string;
  target_cefr: string;
  due_date: string | null;
  submissions_count: number;
  total_learners: number;
  average_score: number | null;
  median_score: number | null;
}

export interface LearnerRosterItem {
  learner_id: string;
  name: string;
  email: string;
  enrolled_at: string;
  average_score: number | null;
  completed_assignments: number;
  missing_assignments: number;
  late_submissions: number;
  attendance_rate: number;
  active_alerts_count: number;
  highest_alert_severity: "high" | "medium" | "low" | null;
}

export interface ClassAnalyticsReport {
  class_id: string;
  title: string;
  subject: string;
  level: string;
  status: string;
  total_learners: number;
  total_assignments: number;
  aggregates: {
    average_score: number | null;
    median_score: number | null;
    submission_rate: number;
    on_time_rate: number;
    active_alerts_count: number;
  };
  score_distribution: ScoreDistributionBin[];
  skill_mastery: SkillMasteryItem[];
  trajectory: TrajectoryItem[];
  learners_roster: LearnerRosterItem[];
  active_alerts: AtRiskAlert[];
}

export interface LearnerSkillBreakdown {
  skill: string;
  label: string;
  score: number;
  level: string;
}

export interface LearnerAssignmentHistoryItem {
  assignment_id: string;
  title: string;
  target_cefr: string;
  due_date: string | null;
  effective_due_date: string | null;
  attempt_id: string | null;
  status: string;
  percentage: number | null;
  score_awarded: number | null;
  total_points: number;
  is_late: boolean;
  submitted_at: string | null;
  teacher_feedback: string;
  feedback_status: string;
  acknowledged: boolean;
}

export interface LearnerAnalyticsProfile {
  learner_id: string;
  name: string;
  email: string;
  enrolled_at: string;
  class_id: string;
  class_title: string;
  class_level: string;
  metrics: {
    average_score: number | null;
    attendance_rate: number;
    completed_assignments: number;
    missing_assignments: number;
    late_assignments: number;
    active_alerts_count: number;
    total_interventions_count: number;
  };
  skills_breakdown: LearnerSkillBreakdown[];
  assignments_history: LearnerAssignmentHistoryItem[];
  alerts: AtRiskAlert[];
  interventions: TeacherIntervention[];
}

export interface CreateInterventionInput {
  class_id: string;
  learner_id: string;
  alert_id?: string | null;
  intervention_type: string;
  title: string;
  description: string;
  action_data?: Record<string, unknown>;
  score_before?: number | null;
  target_date?: string | null;
}

export interface UpdateInterventionInput {
  status?: string;
  title?: string;
  description?: string;
  action_data?: Record<string, unknown>;
  outcome_notes?: string;
  score_before?: number | null;
  score_after?: number | null;
  target_date?: string | null;
  auto_resolve_alert?: boolean;
}

export async function fetchTeacherAnalyticsOverview(): Promise<TeacherAnalyticsOverview> {
  return endooraApi<TeacherAnalyticsOverview>("/api/teachers/analytics/overview/");
}

export async function fetchClassAnalyticsReport(classId: string): Promise<ClassAnalyticsReport> {
  return endooraApi<ClassAnalyticsReport>(`/api/teachers/classes/${classId}/analytics/`);
}

export function getClassAnalyticsCsvExportUrl(classId: string): string {
  const base = process.env.NEXT_PUBLIC_API_URL || "";
  return `${base}/api/teachers/classes/${classId}/analytics/export/`;
}

export async function fetchLearnerAnalyticsProfile(
  classId: string,
  learnerId: string
): Promise<LearnerAnalyticsProfile> {
  return endooraApi<LearnerAnalyticsProfile>(
    `/api/teachers/classes/${classId}/learners/${learnerId}/analytics/`
  );
}

export async function fetchAtRiskAlerts(params?: {
  class_id?: string;
  severity?: string;
  status?: string;
}): Promise<AtRiskAlert[]> {
  const q = new URLSearchParams();
  if (params?.class_id) q.set("class_id", params.class_id);
  if (params?.severity) q.set("severity", params.severity);
  if (params?.status) q.set("status", params.status);
  const qs = q.toString() ? `?${q.toString()}` : "";
  return endooraApi<AtRiskAlert[]>(`/api/teachers/alerts/${qs}`);
}

export async function acknowledgeAtRiskAlert(alertId: string): Promise<AtRiskAlert> {
  return endooraApi<AtRiskAlert>(`/api/teachers/alerts/${alertId}/acknowledge/`, {
    method: "POST",
  });
}

export async function resolveAtRiskAlert(
  alertId: string,
  resolutionNotes: string = ""
): Promise<AtRiskAlert> {
  return endooraApi<AtRiskAlert>(`/api/teachers/alerts/${alertId}/resolve/`, {
    method: "POST",
    json: { resolution_notes: resolutionNotes },
  });
}

export async function fetchTeacherInterventions(params?: {
  class_id?: string;
  learner_id?: string;
  status?: string;
}): Promise<TeacherIntervention[]> {
  const q = new URLSearchParams();
  if (params?.class_id) q.set("class_id", params.class_id);
  if (params?.learner_id) q.set("learner_id", params.learner_id);
  if (params?.status) q.set("status", params.status);
  const qs = q.toString() ? `?${q.toString()}` : "";
  return endooraApi<TeacherIntervention[]>(`/api/teachers/interventions/${qs}`);
}

export async function createTeacherIntervention(
  input: CreateInterventionInput
): Promise<TeacherIntervention> {
  return endooraApi<TeacherIntervention>("/api/teachers/interventions/", {
    method: "POST",
    json: input,
  });
}

export async function updateTeacherIntervention(
  interventionId: string,
  input: UpdateInterventionInput
): Promise<TeacherIntervention> {
  return endooraApi<TeacherIntervention>(`/api/teachers/interventions/${interventionId}/`, {
    method: "PATCH",
    json: input,
  });
}


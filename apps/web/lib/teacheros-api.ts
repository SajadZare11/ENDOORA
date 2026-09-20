import type {
  TeacherMaterial,
  LessonOutcome,
  StudentDossier,
  SpacedReviewItem,
  DifferentiationPlan,
  NextLessonRecommendation,
  MaterialType,
  GenerateMaterialPayload,
  TeacherUsageSummary,
  ExportMode,
  AssignMaterialPayload,
  ScheduleMaterialPayload,
  FeedbackAnalysis,
  WritingAnalyzePayload,
  ApproveFeedbackPayload,
  WarmupQuizData,
  PacingAuditData,
  ProgressReportCardData,
  ReportCardDispatchPayload,
  TeacherAccountSummary,
  TeacherPreferences,
} from "@endoora/contracts";

export interface ActiveClassInfo {
  id: string;
  title: string;
  level: string;
  subject?: string;
  max_capacity?: number;
  coursebook?: string;
  target_exams?: string;
  age_group?: string;
}

export async function fetchTeacherClasses(): Promise<ActiveClassInfo[]> {
  const response = await fetch("/api/teachers/classes/", {
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) return [];
  const data = await response.json();
  return Array.isArray(data) ? data : data.results ?? [];
}

export async function fetchTeacherMaterials(params?: {
  material_type?: MaterialType;
  class_id?: string;
  status?: string;
  is_pinned?: boolean;
  search?: string;
  cefr_level?: string;
  ordering?: string;
}): Promise<TeacherMaterial[]> {
  const query = new URLSearchParams();
  if (params?.material_type) query.set("material_type", params.material_type);
  if (params?.class_id) query.set("class_id", params.class_id);
  if (params?.status) query.set("status", params.status);
  if (params?.is_pinned !== undefined) query.set("is_pinned", String(params.is_pinned));
  if (params?.search) query.set("search", params.search);
  if (params?.cefr_level) query.set("cefr_level", params.cefr_level);
  if (params?.ordering) query.set("ordering", params.ordering);

  const response = await fetch(`/api/teachers/materials/?${query.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch materials.");
  return response.json();
}

export async function createTeacherMaterial(payload: {
  class_id?: string | null;
  material_type: MaterialType;
  title: string;
  topic?: string;
  cefr_level?: string;
  content?: Record<string, unknown>;
  raw_markdown?: string;
  metadata?: Record<string, unknown>;
}): Promise<TeacherMaterial> {
  const response = await fetch("/api/teachers/materials/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to create material.");
  return response.json();
}

export async function generateTeacherMaterial(payload: GenerateMaterialPayload): Promise<TeacherMaterial> {
  const response = await fetch("/api/teachers/materials/generate/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to generate calibrated material.");
  return response.json();
}

export async function updateTeacherMaterial(
  id: string,
  payload: Partial<TeacherMaterial>
): Promise<TeacherMaterial> {
  const response = await fetch(`/api/teachers/materials/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to update material.");
  return response.json();
}

export function getMaterialDocxExportUrl(id: string, mode: ExportMode = "teacher"): string {
  return `/api/teachers/materials/${id}/export/docx/?mode=${mode}`;
}

export function getMaterialPdfExportUrl(id: string, mode: ExportMode = "teacher"): string {
  return `/api/teachers/materials/${id}/export/pdf/?mode=${mode}`;
}

export async function downloadMaterialDocx(id: string, filename?: string, mode: ExportMode = "teacher"): Promise<void> {
  const url = getMaterialDocxExportUrl(id, mode);
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to download Word document.");
  const blob = await response.blob();
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = filename || `Material-${id}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

export async function downloadMaterialPdf(id: string, filename?: string, mode: ExportMode = "teacher"): Promise<void> {
  const url = getMaterialPdfExportUrl(id, mode);
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to download PDF document.");
  const blob = await response.blob();
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = filename || `Material-${id}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

export async function adaptTeacherMaterial(id: string, requestedChange: string): Promise<TeacherMaterial> {
  const response = await fetch(`/api/teachers/materials/${id}/adapt/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requested_change: requestedChange }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to adapt material.");
  }
  return response.json();
}

export async function scheduleTeacherMaterial(
  id: string,
  payload: ScheduleMaterialPayload
): Promise<{ message: string; session_id: string; session_title: string; scheduled_start: string; status: string; material_id: string }> {
  const response = await fetch(`/api/teachers/materials/${id}/schedule/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.error || "Failed to schedule material.");
  }
  return response.json();
}

export async function assignTeacherMaterial(
  id: string,
  payload?: AssignMaterialPayload
): Promise<{ message: string; learner_count: number; class_id?: string; assignment_id?: string }> {
  const response = await fetch(`/api/teachers/materials/${id}/assign/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload || {}),
  });
  if (!response.ok) throw new Error("Failed to assign material.");
  return response.json();
}

export async function differentiateTeacherMaterial(id: string): Promise<DifferentiationPlan> {
  const response = await fetch(`/api/teachers/materials/${id}/differentiate/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to differentiate material.");
  return response.json();
}

export async function fetchClassOutcomes(classId: string): Promise<LessonOutcome[]> {
  const response = await fetch(`/api/teachers/classes/${classId}/outcomes/`);
  if (!response.ok) return [];
  return response.json();
}

export async function recordClassOutcome(
  classId: string,
  payload: {
    result: "success" | "partial" | "needs_repeat";
    difficulty_rating: number;
    completion_percent: number;
    summary?: string;
    notes?: string;
    followup_reminders?: string[];
  }
): Promise<LessonOutcome> {
  const response = await fetch(`/api/teachers/classes/${classId}/outcomes/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to record outcome.");
  return response.json();
}

export async function fetchNextLessonRecommendation(classId: string): Promise<NextLessonRecommendation> {
  const response = await fetch(`/api/teachers/classes/${classId}/next-lesson-recommendation/`);
  if (!response.ok) throw new Error("Failed to fetch recommendation.");
  return response.json();
}

export async function fetchStudentDossier(classId: string, learnerId: string): Promise<StudentDossier> {
  const response = await fetch(`/api/teachers/classes/${classId}/learners/${learnerId}/dossier/`);
  if (!response.ok) throw new Error("Failed to fetch student dossier.");
  return response.json();
}

export async function scoreStudentSkills(
  classId: string,
  learnerId: string,
  scores: Record<string, number>,
  confidence = 3,
  notes = ""
): Promise<StudentDossier> {
  const response = await fetch(
    `/api/teachers/classes/${classId}/learners/${learnerId}/dossier/score-skills/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...scores, confidence, notes }),
    }
  );
  if (!response.ok) throw new Error("Failed to score skills.");
  return response.json();
}

export async function logStudentError(
  classId: string,
  learnerId: string,
  payload: {
    category: string;
    sentence: string;
    correction: string;
    notes?: string;
    frequency?: "low" | "medium" | "high";
    status?: "improving" | "persistent" | "solved";
  }
): Promise<{ status: string; error: unknown; dossier?: StudentDossier }> {
  const response = await fetch(
    `/api/teachers/classes/${classId}/learners/${learnerId}/dossier/log-error/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok) throw new Error("Failed to log error.");
  return response.json();
}

export async function updateStudentErrorStatus(
  classId: string,
  learnerId: string,
  errorId: string,
  status: "improving" | "persistent" | "solved"
): Promise<StudentDossier> {
  const response = await fetch(
    `/api/teachers/classes/${classId}/learners/${learnerId}/dossier/errors/${errorId}/`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }
  );
  if (!response.ok) throw new Error("Failed to update error status.");
  return response.json();
}

export async function recordStudentAssessment(
  classId: string,
  learnerId: string,
  payload: {
    type: "formal" | "informal";
    subtype: string;
    title: string;
    score: number;
    max_score: number;
    notes?: string;
  }
): Promise<{ status: string; assessment: unknown; dossier: StudentDossier }> {
  const response = await fetch(
    `/api/teachers/classes/${classId}/learners/${learnerId}/dossier/assessments/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok) throw new Error("Failed to record assessment.");
  return response.json();
}

export async function updateStudentDossier(
  classId: string,
  learnerId: string,
  payload: Partial<StudentDossier>
): Promise<StudentDossier> {
  const response = await fetch(
    `/api/teachers/classes/${classId}/learners/${learnerId}/dossier/`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok) throw new Error("Failed to update student dossier.");
  return response.json();
}

export async function fetchSpacedReviews(classId: string): Promise<SpacedReviewItem[]> {
  const response = await fetch(`/api/teachers/classes/${classId}/spaced-reviews/`);
  if (!response.ok) return [];
  return response.json();
}

export async function addSpacedReviewItem(
  classId: string,
  targetItem: string,
  itemType = "vocabulary",
  promptQuestion?: string,
  correctAnswer?: string
): Promise<SpacedReviewItem> {
  const response = await fetch(`/api/teachers/classes/${classId}/spaced-reviews/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      target_item: targetItem,
      item_type: itemType,
      prompt_question: promptQuestion,
      correct_answer: correctAnswer,
    }),
  });
  if (!response.ok) throw new Error("Failed to add review item.");
  return response.json();
}

export async function fetchTeacherUsageSummary(): Promise<TeacherUsageSummary> {
  const response = await fetch("/api/teachers/usage/");
  if (!response.ok) throw new Error("Failed to fetch teacher usage summary.");
  return response.json();
}

export async function analyzeWritingSubmission(
  payload: WritingAnalyzePayload
): Promise<FeedbackAnalysis> {
  const response = await fetch("/api/teachers/assessment/analyze/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || err.error || "Failed to analyze writing submission.");
  }
  return response.json();
}

export async function approveAndPushFeedback(
  payload: ApproveFeedbackPayload
): Promise<{ success: boolean; message: string; dossier: StudentDossier }> {
  const response = await fetch("/api/teachers/assessment/approve/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || err.error || "Failed to approve and push feedback.");
  }
  return response.json();
}

export async function downloadWritingFeedbackDocx(
  analysis: FeedbackAnalysis,
  filename = "Writing_Feedback.docx",
  mode: ExportMode = "student"
): Promise<void> {
  const response = await fetch("/api/teachers/assessment/export/docx/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ analysis, mode }),
  });
  if (!response.ok) throw new Error("Failed to export Word feedback.");
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function downloadWritingFeedbackPdf(
  analysis: FeedbackAnalysis,
  filename = "Writing_Feedback.pdf",
  mode: ExportMode = "student"
): Promise<void> {
  const response = await fetch("/api/teachers/assessment/export/pdf/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ analysis, mode }),
  });
  if (!response.ok) throw new Error("Failed to export PDF feedback.");
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

// ==============================================================================
// Day 9: Deep Pedagogical Supertools Client SDK
// ==============================================================================

export async function downloadDifferentiationDocx(
  materialId: string,
  filename = "Differentiation_Plan.docx"
): Promise<void> {
  const response = await fetch(`/api/teachers/materials/${materialId}/differentiation/export/docx/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to export differentiation Word document.");
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function assignDifferentiationTiers(
  materialId: string,
  payload?: { tier_assignments?: Record<string, string>; notes?: string }
): Promise<{ success: boolean; message: string; learner_count: number; plan_id: string }> {
  const response = await fetch(`/api/teachers/materials/${materialId}/differentiation/assign/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload || {}),
  });
  if (!response.ok) throw new Error("Failed to assign differentiation tiers.");
  return response.json();
}

export async function generateWarmupQuiz(
  classId: string,
  count = 5
): Promise<WarmupQuizData> {
  const response = await fetch(`/api/teachers/classes/${classId}/srs/warmup/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ count }),
  });
  if (!response.ok) throw new Error("Failed to generate 5-minute warm-up quiz.");
  return response.json();
}

export async function pushWarmupQuiz(
  classId: string,
  warmupData: WarmupQuizData
): Promise<{ success: boolean; message: string; students_linked: number }> {
  const response = await fetch(`/api/teachers/classes/${classId}/srs/warmup/push/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ warmup_data: warmupData }),
  });
  if (!response.ok) throw new Error("Failed to push warm-up quiz to students.");
  return response.json();
}

export async function downloadWarmupQuizDocx(
  classId: string,
  warmupData?: WarmupQuizData,
  filename = "5Min_Warmup_Quiz.docx"
): Promise<void> {
  const response = await fetch(`/api/teachers/classes/${classId}/srs/warmup/export/docx/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ warmup_data: warmupData }),
  });
  if (!response.ok) throw new Error("Failed to export warm-up quiz Word document.");
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function fetchClassPacingAudit(classId: string): Promise<PacingAuditData> {
  const response = await fetch(`/api/teachers/classes/${classId}/pacing-audit/`);
  if (!response.ok) throw new Error("Failed to fetch curriculum pacing audit.");
  return response.json();
}

export async function downloadPacingAuditDocx(
  classId: string,
  filename = "Curriculum_Pacing_Audit.docx"
): Promise<void> {
  const response = await fetch(`/api/teachers/classes/${classId}/pacing-audit/export/docx/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to export pacing audit Word report.");
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function fetchProgressReportData(
  classId: string,
  learnerId: string
): Promise<ProgressReportCardData> {
  const response = await fetch(`/api/teachers/classes/${classId}/learners/${learnerId}/report-card/`);
  if (!response.ok) throw new Error("Failed to fetch progress report card data.");
  return response.json();
}

export async function dispatchReportCard(
  classId: string,
  learnerId: string,
  payload: ReportCardDispatchPayload
): Promise<{ success: boolean; message: string; milestone: Record<string, unknown> }> {
  const response = await fetch(
    `/api/teachers/classes/${classId}/learners/${learnerId}/report-card/dispatch/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok) throw new Error("Failed to dispatch report card to learner.");
  return response.json();
}

export async function downloadReportCardDocx(
  classId: string,
  learnerId: string,
  payload?: ReportCardDispatchPayload,
  filename = "Official_Progress_Report_Card.docx"
): Promise<void> {
  const response = await fetch(
    `/api/teachers/classes/${classId}/learners/${learnerId}/report-card/export/docx/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    }
  );
  if (!response.ok) throw new Error("Failed to export report card Word document.");
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function downloadReportCardPdf(
  classId: string,
  learnerId: string,
  payload?: ReportCardDispatchPayload,
  filename = "Official_Progress_Report_Card.pdf"
): Promise<void> {
  const response = await fetch(
    `/api/teachers/classes/${classId}/learners/${learnerId}/report-card/export/pdf/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    }
  );
  if (!response.ok) throw new Error("Failed to export report card PDF document.");
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function batchMaterialAction(
  action: "archive" | "pin" | "unpin" | "delete",
  materialIds: string[]
): Promise<{ success: boolean; action: string; affected_count: number; message: string }> {
  const response = await fetch("/api/teachers/materials/batch/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, material_ids: materialIds }),
  });
  if (!response.ok) throw new Error("Failed to execute batch action.");
  return response.json();
}

export async function fetchTeacherAccountSummary(): Promise<TeacherAccountSummary> {
  const response = await fetch("/api/teachers/account/summary/", {
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to fetch teacher account summary.");
  return response.json();
}

export async function updateTeacherPreferences(
  preferences: Partial<TeacherPreferences>
): Promise<{ success: boolean; preferences: TeacherPreferences; message: string }> {
  const response = await fetch("/api/teachers/account/preferences/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(preferences),
  });
  if (!response.ok) throw new Error("Failed to update teacher preferences.");
  return response.json();
}

export async function upgradeTeacherPlan(
  planCode: "free" | "pro" | "premium",
  gateway = "zarinpal"
): Promise<{
  success: boolean;
  plan_code: string;
  plan_expires_at: string | null;
  transaction: { gateway: string; ref_id: string; status: string; verified_at: string };
  message: string;
}> {
  const response = await fetch("/api/teachers/account/upgrade/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan_code: planCode, gateway }),
  });
  if (!response.ok) throw new Error("Failed to upgrade teacher plan.");
  return response.json();
}



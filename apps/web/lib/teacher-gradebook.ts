import { endooraApi } from "./endoora-api";

export interface QuestionReferenceSolution {
  correct_option?: string | null;
  answer_key?: Record<string, unknown>;
  accepted_variants?: string[];
  rubric?: Record<string, unknown>;
  explanation?: string;
}

export interface QuestionGradingDetail {
  assignment_question_id: string;
  question_version_id: string;
  order: number;
  points: number;
  custom_instructions: string;
  prompt: string;
  title: string;
  question_type: string;
  cefr_level: string;
  options?: Array<{ id: string; text: string }>;
  learner_answer?: unknown;
  auto_grading?: {
    status?: string;
    correct?: boolean | null;
    score?: number;
    max_points?: number;
    explanation?: string;
    error?: string;
  };
  score_awarded: number;
  teacher_comment: string;
  is_manual_override: boolean;
  reference_solution: QuestionReferenceSolution;
}

export interface FeedbackMessage {
  id: string;
  author_id: string;
  author_email: string;
  author_name: string;
  message: string;
  is_internal_note: boolean;
  created_at: string;
}

export interface SubmissionGradingDetail {
  attempt_id: string;
  attempt_number: number;
  status: string;
  feedback_status: string;
  started_at: string;
  submitted_at: string | null;
  graded_at: string | null;
  is_late: boolean;
  score_awarded: number | null;
  percentage: number | null;
  total_points: number;
  teacher_feedback: string;
  rubric_scores: Record<string, { score: number; max: number; comment?: string }>;
  learner_reflection: string;
  learner_acknowledged_at: string | null;
  revision_notes: string;
  learner: {
    id: string;
    email: string;
    name: string;
  };
  assignment: {
    id: string;
    title: string;
    target_cefr: string;
    class_id: string;
    class_title: string;
  };
  questions: QuestionGradingDetail[];
  feedback_messages: FeedbackMessage[];
}

export interface SubmissionQueueItem {
  attempt_id: string;
  attempt_number: number;
  status: string;
  feedback_status: string;
  score_awarded: number | null;
  percentage: number | null;
  total_points: number;
  is_late: boolean;
  started_at: string;
  submitted_at: string | null;
  graded_at: string | null;
  learner_id: string;
  learner_email: string;
  learner_name: string;
  assignment_id: string;
  assignment_title: string;
  class_id: string;
  class_title: string;
}

export interface GradebookAssignmentColumn {
  id: string;
  title: string;
  due_date: string | null;
  total_points: number;
  passing_percentage: number;
  average_percentage: number;
  median_percentage: number;
  high_percentage: number;
  low_percentage: number;
  submission_count: number;
  completion_rate: number;
}

export interface GradebookCellData {
  status: string;
  feedback_status: string;
  score: number | null;
  percentage: number | null;
  total_points: number;
  is_late: boolean;
  attempt_id: string | null;
  attempt_number: number;
}

export interface GradebookStudentRow {
  student_id: string;
  email: string;
  name: string;
  total_earned: number;
  total_possible: number;
  overall_percentage: number;
  letter_grade: string;
  completed_count: number;
  missing_count: number;
  late_count: number;
  grades: Record<string, GradebookCellData>;
}

export interface ClassGradebookMatrix {
  class_id: string;
  class_title: string;
  class_subject: string;
  class_level: string;
  total_students: number;
  total_assignments: number;
  class_average_percentage: number;
  assignments: GradebookAssignmentColumn[];
  students: GradebookStudentRow[];
}

export interface LearnerGradebookAssignment {
  assignment_id: string;
  title: string;
  target_cefr: string;
  due_date: string | null;
  total_points: number;
  passing_percentage: number;
  attempt_id: string | null;
  status: string;
  feedback_status: string;
  score_awarded: number | null;
  percentage: number | null;
  is_late: boolean;
  teacher_feedback_snippet: string;
  has_reflection: boolean;
  acknowledged: boolean;
}

export interface LearnerGradebookClass {
  class_id: string;
  class_title: string;
  class_subject: string;
  class_level: string;
  teacher_name: string;
  teacher_email: string;
  class_percentage: number;
  assignments: LearnerGradebookAssignment[];
}

export interface LearnerGradebookSummary {
  overall_gpa_percentage: number;
  total_assignments: number;
  completed_assignments: number;
  pending_assignments: number;
  classes: LearnerGradebookClass[];
}

// -------------------------------------------------------------
// API Client Methods
// -------------------------------------------------------------

export async function fetchTeacherSubmissionsQueue(filters?: {
  class_id?: string;
  assignment_id?: string;
  status?: "pending" | "submitted" | "graded" | "late" | "revision_requested";
}): Promise<SubmissionQueueItem[]> {
  const params = new URLSearchParams();
  if (filters?.class_id) params.set("class_id", filters.class_id);
  if (filters?.assignment_id) params.set("assignment_id", filters.assignment_id);
  if (filters?.status) params.set("status", filters.status);

  return endooraApi<SubmissionQueueItem[]>(`/teachers/submissions/queue/?${params.toString()}`);
}

export async function fetchSubmissionGradingDetail(attemptId: string): Promise<SubmissionGradingDetail> {
  return endooraApi<SubmissionGradingDetail>(`/teachers/attempts/${attemptId}/grading-detail/`);
}

export async function submitAttemptGrading(
  attemptId: string,
  payload: {
    score_awarded?: number | null;
    question_grades?: Record<string, { score: number; comment?: string }>;
    rubric_scores?: Record<string, { score: number; max: number; comment?: string }>;
    teacher_feedback?: string;
    action?: "return_grade" | "request_revision";
    revision_notes?: string;
  }
): Promise<SubmissionGradingDetail> {
  return endooraApi<SubmissionGradingDetail>(`/teachers/attempts/${attemptId}/grade/`, {
    method: "POST",
    json: payload,
  });
}

export async function fetchClassGradebook(classId: string): Promise<ClassGradebookMatrix> {
  return endooraApi<ClassGradebookMatrix>(`/teachers/classes/${classId}/gradebook/`);
}

export function getClassGradebookExportCsvUrl(classId: string): string {
  return `/backend/api/teachers/classes/${classId}/gradebook/export/`;
}

export async function acknowledgeAttemptFeedback(
  attemptId: string,
  reflectionText: string
): Promise<{ acknowledged: boolean; learner_acknowledged_at: string; learner_reflection: string }> {
  return endooraApi<{ acknowledged: boolean; learner_acknowledged_at: string; learner_reflection: string }>(
    `/teachers/attempts/${attemptId}/acknowledge-feedback/`,
    {
      method: "POST",
      json: { reflection: reflectionText },
    }
  );
}

export const acknowledgeLearnerFeedback = acknowledgeAttemptFeedback;

export async function fetchFeedbackMessages(attemptId: string): Promise<FeedbackMessage[]> {
  return endooraApi<FeedbackMessage[]>(`/teachers/attempts/${attemptId}/feedback-messages/`);
}

export async function sendFeedbackMessage(
  attemptId: string,
  message: string,
  isInternalNote: boolean = false
): Promise<FeedbackMessage> {
  return endooraApi<FeedbackMessage>(`/teachers/attempts/${attemptId}/feedback-messages/`, {
    method: "POST",
    json: { message, is_internal_note: isInternalNote },
  });
}

export async function fetchLearnerGradebook(classId?: string): Promise<LearnerGradebookSummary> {
  const params = classId ? `?class_id=${encodeURIComponent(classId)}` : "";
  return endooraApi<LearnerGradebookSummary>(`/teachers/my-grades/${params}`);
}

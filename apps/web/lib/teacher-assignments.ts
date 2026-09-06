import { endooraApi } from "./endoora-api";

export type AssignmentStatus = "draft" | "published" | "closed" | "archived";
export type AttemptStatus = "in_progress" | "submitted" | "graded" | "timed_out";

export type AssignmentListItem = {
  id: string;
  teacher_class_id: string;
  teacher_class_title: string;
  title: string;
  target_cefr: string;
  status: AssignmentStatus;
  due_date: string | null;
  total_points: string | number;
  version: number;
  questions_count: number;
  submissions_count: number;
  created_at: string;
  updated_at: string;
};

export type AssignmentQuestion = {
  id: string;
  question_version_id: string;
  order: number;
  points: string | number;
  custom_instructions: string;
  slug: string;
  title_fa: string;
  title_en: string;
  prompt_fa: string;
  prompt_en: string;
  question_type: string;
  cefr_level: string;
  difficulty: number;
  created_at?: string;
};

export type AssignmentAccommodation = {
  id: string;
  assignment_id: string;
  learner_id: string;
  learner_email: string;
  learner_name: string;
  extra_time_minutes: number;
  extra_attempts: number;
  extended_due_date: string | null;
  notes: string;
  created_at?: string;
  updated_at?: string;
};

export type AssignmentDetail = {
  id: string;
  teacher_class_id: string;
  teacher_class_title: string;
  teacher_id: string;
  teacher_name: string;
  title: string;
  description: string;
  instructions: string;
  target_cefr: string;
  status: AssignmentStatus;
  due_date: string | null;
  grace_period_minutes: number;
  allow_late_submission: boolean;
  max_attempts: number;
  time_limit_minutes: number | null;
  total_points: string | number;
  passing_percentage: number;
  version: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  questions: AssignmentQuestion[];
  accommodations: AssignmentAccommodation[];
  submissions_count: number;
  graded_count: number;
};

export type QuestionBankItem = {
  id: string;
  question_id: string;
  slug: string;
  version_number: number;
  question_type: string;
  cefr_level: string;
  difficulty: number;
  title_fa: string;
  title_en: string;
  prompt_fa: string;
  prompt_en: string;
  instructions_fa: string;
  instructions_en: string;
  created_at: string;
};

export type AssignmentAttempt = {
  id: string;
  assignment_id: string;
  assignment_title: string;
  learner_id: string;
  learner_email: string;
  learner_name: string;
  attempt_number: number;
  status: AttemptStatus;
  started_at: string;
  submitted_at: string | null;
  time_limit_expires_at: string | null;
  answers_payload: Record<string, unknown>;
  grading_results: Record<string, {
    correct?: boolean | null;
    score?: number;
    max_points?: number;
    status?: string;
    error?: string;
  }>;
  score_awarded: string | number | null;
  percentage: string | number | null;
  is_late: boolean;
  teacher_feedback: string;
  graded_at: string | null;
  created_at: string;
  updated_at: string;
};

export type LearnerAssignmentItem = {
  id: string;
  class_id: string;
  class_title: string;
  teacher_name: string;
  title: string;
  description: string;
  target_cefr: string;
  due_date: string | null;
  time_limit_minutes: number | null;
  max_attempts: number;
  attempts_used: number;
  total_points: number;
  passing_percentage: number;
  is_open: boolean;
  in_progress_attempt_id: string | null;
  best_score: number | null;
};

export type LearnerQuestionItem = {
  assignment_question_id: string;
  question_version_id: string;
  order: number;
  points: number;
  custom_instructions: string;
  question_type: string;
  cefr_level: string;
  title_fa: string;
  title_en: string;
  prompt_fa: string;
  prompt_en: string;
  instructions_fa: string;
  instructions_en: string;
  learner_payload: Record<string, unknown>;
};

export type LearnerAttemptPayload = {
  attempt_id: string;
  assignment_id: string;
  assignment_title: string;
  instructions: string;
  attempt_number: number;
  status: AttemptStatus;
  time_limit_minutes: number | null;
  time_limit_expires_at: string | null;
  started_at: string;
  answers_payload: Record<string, unknown>;
  questions: LearnerQuestionItem[];
};

export type CreateDraftPayload = {
  class_id: string;
  title: string;
  description?: string;
  instructions?: string;
  target_cefr?: string;
};

export type UpdateDraftPayload = {
  title?: string;
  description?: string;
  instructions?: string;
  target_cefr?: string;
  expected_version?: number;
};

export type SetQuestionsPayload = {
  questions: {
    question_version_id: string;
    points?: number;
    custom_instructions?: string;
  }[];
  expected_version?: number;
};

export type DeliveryPayload = {
  due_date: string;
  grace_period_minutes?: number;
  allow_late_submission?: boolean;
  max_attempts?: number;
  time_limit_minutes?: number | null;
  passing_percentage?: number;
  expected_version?: number;
};

export type AccommodationPayload = {
  learner_id: string;
  extra_time_minutes?: number;
  extra_attempts?: number;
  extended_due_date?: string | null;
  notes?: string;
};

// Teacher API methods
export async function fetchTeacherAssignments(params?: {
  class_id?: string;
  status?: string;
}): Promise<AssignmentListItem[]> {
  const query = new URLSearchParams();
  if (params?.class_id) query.set("class_id", params.class_id);
  if (params?.status) query.set("status", params.status);
  const qStr = query.toString();
  return endooraApi<AssignmentListItem[]>(`/teachers/assignments/${qStr ? `?${qStr}` : ""}`);
}

export async function fetchTeacherAssignment(assignmentId: string): Promise<AssignmentDetail> {
  return endooraApi<AssignmentDetail>(`/teachers/assignments/${assignmentId}/`);
}

export async function createAssignmentDraft(payload: CreateDraftPayload): Promise<AssignmentDetail> {
  return endooraApi<AssignmentDetail>("/teachers/assignments/", {
    method: "POST",
    json: payload,
  });
}

export async function updateAssignmentDraft(
  assignmentId: string,
  payload: UpdateDraftPayload
): Promise<AssignmentDetail> {
  return endooraApi<AssignmentDetail>(`/teachers/assignments/${assignmentId}/`, {
    method: "PATCH",
    json: payload,
  });
}

export async function deleteAssignmentDraft(assignmentId: string): Promise<void> {
  return endooraApi<void>(`/teachers/assignments/${assignmentId}/`, {
    method: "DELETE",
  });
}

export async function setAssignmentQuestions(
  assignmentId: string,
  payload: SetQuestionsPayload
): Promise<AssignmentDetail> {
  return endooraApi<AssignmentDetail>(`/teachers/assignments/${assignmentId}/questions/`, {
    method: "POST",
    json: payload,
  });
}

export async function configureAssignmentDelivery(
  assignmentId: string,
  payload: DeliveryPayload
): Promise<AssignmentDetail> {
  return endooraApi<AssignmentDetail>(`/teachers/assignments/${assignmentId}/delivery/`, {
    method: "POST",
    json: payload,
  });
}

export async function fetchAssignmentAccommodations(
  assignmentId: string
): Promise<AssignmentAccommodation[]> {
  return endooraApi<AssignmentAccommodation[]>(`/teachers/assignments/${assignmentId}/accommodations/`);
}

export async function setAssignmentAccommodation(
  assignmentId: string,
  payload: AccommodationPayload
): Promise<AssignmentAccommodation> {
  return endooraApi<AssignmentAccommodation>(`/teachers/assignments/${assignmentId}/accommodations/`, {
    method: "POST",
    json: payload,
  });
}

export async function publishAssignment(assignmentId: string): Promise<AssignmentDetail> {
  return endooraApi<AssignmentDetail>(`/teachers/assignments/${assignmentId}/publish/`, {
    method: "POST",
  });
}

export async function fetchAssignmentSubmissions(assignmentId: string): Promise<AssignmentAttempt[]> {
  return endooraApi<AssignmentAttempt[]>(`/teachers/assignments/${assignmentId}/submissions/`);
}

export async function gradeAttempt(
  attemptId: string,
  payload: { score_awarded: number | string; teacher_feedback?: string }
): Promise<AssignmentAttempt> {
  return endooraApi<AssignmentAttempt>(`/teachers/attempts/${attemptId}/grade/`, {
    method: "POST",
    json: payload,
  });
}

export async function browseQuestionBank(params?: {
  q?: string;
  cefr?: string;
  type?: string;
  limit?: number;
}): Promise<QuestionBankItem[]> {
  const query = new URLSearchParams();
  if (params?.q) query.set("q", params.q);
  if (params?.cefr) query.set("cefr", params.cefr);
  if (params?.type) query.set("type", params.type);
  if (params?.limit) query.set("limit", String(params.limit));
  const qStr = query.toString();
  return endooraApi<QuestionBankItem[]>(`/teachers/question-bank/browse/${qStr ? `?${qStr}` : ""}`);
}

// Learner API methods
export async function fetchLearnerAssignments(): Promise<LearnerAssignmentItem[]> {
  return endooraApi<LearnerAssignmentItem[]>("/teachers/my-assignments/");
}

export async function startLearnerAttempt(assignmentId: string): Promise<LearnerAttemptPayload> {
  return endooraApi<LearnerAttemptPayload>(`/teachers/assignments/${assignmentId}/start/`, {
    method: "POST",
  });
}

export async function autosaveLearnerAttempt(
  attemptId: string,
  answers: Record<string, unknown>
): Promise<{ saved: boolean; updated_at: string }> {
  return endooraApi<{ saved: boolean; updated_at: string }>(`/teachers/attempts/${attemptId}/autosave/`, {
    method: "POST",
    json: { answers },
  });
}

export async function submitLearnerAttempt(
  attemptId: string,
  answers?: Record<string, unknown>
): Promise<AssignmentAttempt> {
  return endooraApi<AssignmentAttempt>(`/teachers/attempts/${attemptId}/submit/`, {
    method: "POST",
    json: { answers: answers || {} },
  });
}

export async function fetchLearnerAttempt(attemptId: string): Promise<AssignmentAttempt> {
  return endooraApi<AssignmentAttempt>(`/teachers/attempts/${attemptId}/`);
}

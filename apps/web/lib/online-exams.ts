import { endooraApi } from "./endoora-api";

export type ExamStatus = "draft" | "published" | "closed" | "archived";
export type SubmissionStatus = "in_progress" | "submitted" | "auto_graded" | "manually_graded" | "timed_out";

export type AntiCheatConfig = {
  enforce_fullscreen: boolean;
  max_blur_events: number;
  max_fullscreen_exits: number;
  block_clipboard: boolean;
  block_devtools: boolean;
  auto_submit_on_violation: boolean;
  violation_threshold: number;
};

export type OnlineExamListItem = {
  id: string;
  teacher: string;
  teacher_class_id: string | null;
  teacher_class_title: string | null;
  title: string;
  status: ExamStatus;
  duration_minutes: number;
  passing_score: string | number;
  max_attempts: number;
  access_code: string | null;
  starts_at: string | null;
  ends_at: string | null;
  questions_count: number;
  submissions_count: number;
  created_at: string;
  updated_at: string;
};

export type ExamQuestionItem = {
  id: string;
  exam_id: string;
  question_version_id: string;
  order: number;
  points: string | number;
  custom_instructions: string;
  listening_play_limit: number;
  speaking_time_limit_seconds: number | null;
  question_slug?: string;
  question_title_fa?: string;
  question_title_en?: string;
  question_type?: string;
  cefr_level?: string;
  prompt_fa?: string;
  prompt_en?: string;
  learner_payload?: Record<string, unknown>;
  created_at?: string;
};

export type OnlineExamDetail = {
  id: string;
  teacher: {
    id: string;
    email: string;
  };
  teacher_class: string | null;
  title: string;
  description: string;
  instructions: string;
  duration_minutes: number;
  anti_cheat_config: AntiCheatConfig;
  shuffle_questions: boolean;
  shuffle_choices: boolean;
  passing_score: string | number;
  max_attempts: number;
  status: ExamStatus;
  access_code: string | null;
  show_results_to_student: boolean;
  starts_at: string | null;
  ends_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  exam_questions: ExamQuestionItem[];
};

export type OnlineExamCreatePayload = {
  title: string;
  description?: string;
  instructions?: string;
  duration_minutes: number;
  anti_cheat_config?: Partial<AntiCheatConfig>;
  shuffle_questions?: boolean;
  shuffle_choices?: boolean;
  passing_score?: number;
  max_attempts?: number;
  show_results_to_student?: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
  teacher_class?: string | null;
};

export type ExamSubmissionListItem = {
  id: string;
  exam_id: string;
  student: {
    id: string;
    email: string;
    name?: string;
  };
  attempt_number: number;
  status: SubmissionStatus;
  started_at: string;
  submitted_at: string | null;
  total_score: string | number | null;
  percentage: string | number | null;
  integrity_score: string | number | null;
  is_late: boolean;
};

export type ExamAnswerDetail = {
  id: string;
  submission: string;
  exam_question: string;
  question_type?: string;
  question_title?: string;
  question_points?: string | number;
  student_response: Record<string, unknown>;
  audio_recording_url?: string;
  is_auto_graded: boolean;
  auto_score: string | number | null;
  manual_score: string | number | null;
  score_awarded: string | number | null;
  teacher_feedback: string;
  graded_by: string | null;
  graded_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ExamSubmissionDetail = {
  id: string;
  exam: string;
  student: {
    id: string;
    email: string;
  };
  attempt_number: number;
  status: SubmissionStatus;
  started_at: string;
  submitted_at: string | null;
  total_score: string | number | null;
  max_possible_score: string | number;
  percentage: string | number | null;
  integrity_score: string | number | null;
  integrity_details: Record<string, unknown>;
  is_late: boolean;
  time_limit_expires_at: string | null;
  answers: ExamAnswerDetail[];
  created_at: string;
  updated_at: string;
};

export type ProctoringEvent = {
  event_type:
    | "blur"
    | "focus"
    | "tab_hidden"
    | "tab_visible"
    | "fullscreen_exit"
    | "fullscreen_enter"
    | "paste_attempt"
    | "devtools_attempt"
    | "shortcut_blocked"
    | "window_resize"
    | "exam_started"
    | "exam_submitted";
  duration_seconds?: number | null;
  client_timestamp: string;
  metadata?: Record<string, unknown>;
};

export type StudentExamView = {
  id: string;
  title: string;
  description: string;
  instructions: string;
  duration_minutes: number;
  anti_cheat_config: AntiCheatConfig;
  questions_count: number;
  questions: ExamQuestionItem[];
};

// Teacher API Calls
export async function listTeacherExams(): Promise<OnlineExamListItem[]> {
  const data = await endooraApi<OnlineExamListItem[] | { results: OnlineExamListItem[] }>("/online-exams/");
  if (Array.isArray(data)) return data;
  return data.results ?? [];
}

export async function getTeacherExam(examId: string): Promise<OnlineExamDetail> {
  return endooraApi<OnlineExamDetail>(`/online-exams/${examId}/`);
}

export async function createOnlineExam(payload: OnlineExamCreatePayload): Promise<OnlineExamDetail> {
  return endooraApi<OnlineExamDetail>("/online-exams/", {
    method: "POST",
    json: payload,
  });
}

export async function updateOnlineExam(examId: string, payload: Partial<OnlineExamCreatePayload>): Promise<OnlineExamDetail> {
  return endooraApi<OnlineExamDetail>(`/online-exams/${examId}/`, {
    method: "PATCH",
    json: payload,
  });
}

export async function publishOnlineExam(examId: string): Promise<{ status: string }> {
  return endooraApi<{ status: string }>(`/online-exams/${examId}/publish/`, {
    method: "POST",
  });
}

export async function closeOnlineExam(examId: string): Promise<{ status: string }> {
  return endooraApi<{ status: string }>(`/online-exams/${examId}/close/`, {
    method: "POST",
  });
}

export async function deleteOnlineExam(examId: string): Promise<void> {
  return endooraApi<void>(`/online-exams/${examId}/`, {
    method: "DELETE",
  });
}

// Question Management
export async function addQuestionToExam(
  examId: string,
  payload: {
    question_version_id: string;
    points: number;
    order?: number;
    custom_instructions?: string;
    listening_play_limit?: number;
    speaking_time_limit_seconds?: number | null;
  }
): Promise<ExamQuestionItem> {
  return endooraApi<ExamQuestionItem>(`/online-exams/${examId}/questions/`, {
    method: "POST",
    json: payload,
  });
}

export async function removeQuestionFromExam(examId: string, questionId: string): Promise<void> {
  return endooraApi<void>(`/online-exams/${examId}/questions/${questionId}/`, {
    method: "DELETE",
  });
}

export async function reorderExamQuestions(
  examId: string,
  items: { id: string; order: number }[]
): Promise<{ status: string }> {
  return endooraApi<{ status: string }>(`/online-exams/${examId}/questions/reorder/`, {
    method: "POST",
    json: { items },
  });
}

// Submissions & Grading
export async function listExamSubmissions(examId: string): Promise<ExamSubmissionListItem[]> {
  const data = await endooraApi<ExamSubmissionListItem[] | { results: ExamSubmissionListItem[] }>(
    `/online-exams/${examId}/submissions/`
  );
  if (Array.isArray(data)) return data;
  return data.results ?? [];
}

export async function getExamSubmissionDetail(examId: string, submissionId: string): Promise<ExamSubmissionDetail> {
  return endooraApi<ExamSubmissionDetail>(`/online-exams/${examId}/submissions/${submissionId}/`);
}

export async function updateAnswerGrade(
  examId: string,
  submissionId: string,
  answerId: string,
  payload: {
    manual_score: number;
    teacher_feedback?: string;
  }
): Promise<ExamAnswerDetail> {
  return endooraApi<ExamAnswerDetail>(
    `/online-exams/${examId}/submissions/${submissionId}/answers/${answerId}/`,
    {
      method: "PATCH",
      json: payload,
    }
  );
}

// Student & Exam Runner APIs
export async function getExamByAccessCode(accessCode: string): Promise<StudentExamView> {
  return endooraApi<StudentExamView>(`/online-exams/by-code/${accessCode}/`);
}

export async function startExamSubmission(examId: string): Promise<ExamSubmissionDetail> {
  return endooraApi<ExamSubmissionDetail>(`/online-exams/${examId}/submissions/`, {
    method: "POST",
    json: {},
  });
}

export async function saveExamAnswer(
  examId: string,
  submissionId: string,
  payload: {
    exam_question_id: string;
    student_response: Record<string, unknown>;
    audio_recording_url?: string;
  }
): Promise<ExamAnswerDetail> {
  return endooraApi<ExamAnswerDetail>(
    `/online-exams/${examId}/submissions/${submissionId}/answers/`,
    {
      method: "POST",
      json: payload,
    }
  );
}

export async function submitExamAttempt(examId: string, submissionId: string): Promise<ExamSubmissionDetail> {
  return endooraApi<ExamSubmissionDetail>(
    `/online-exams/${examId}/submissions/${submissionId}/submit/`,
    {
      method: "POST",
      json: {},
    }
  );
}

export async function batchSendProctoringEvents(
  examId: string,
  submissionId: string,
  events: ProctoringEvent[]
): Promise<{ created_count: number }> {
  return endooraApi<{ created_count: number }>(
    `/online-exams/${examId}/submissions/${submissionId}/proctoring-logs/`,
    {
      method: "POST",
      json: { events },
    }
  );
}

import { endooraApi } from "./endoora-api";

export type TeacherClass = {
  id: string;
  code?: string;
  class_code?: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  status: "active" | "archived" | "completed";
  status_display: string;
  max_capacity: number;
  objectives: string[];
  private_notes: string;
  coursebook?: string;
  age_group?: string;
  class_size_type?: string;
  default_duration?: number;
  goal?: string;
  focus_skills?: string[];
  equipment?: string[];
  teaching_preferences?: string[];
  target_exams?: string;
  schedule_days?: string[];
  schedule_time_start?: string;
  schedule_time_end?: string;
  schedule_summary?: string;
  meeting_url?: string;
  adobe_connect_url?: string;
  adobe_connect_app_url?: string;
  enrolled_students_count: number;
  sessions_count: number;
  created_at: string;
  updated_at: string;
};

export type TeacherLearnerLink = {
  id: string;
  teacher_class: string;
  code?: string;
  class_code?: string;
  class_title: string;
  learner: string;
  learner_email: string;
  status: "pending_consent" | "active" | "terminated" | "rejected";
  status_display: string;
  invite_code: string;
  consent_given_at: string | null;
  terminated_at: string | null;
  termination_reason: string;
  created_at: string;
};

export type ClassSession = {
  id: string;
  teacher_class: string;
  class_title: string;
  learner: string | null;
  learner_email: string | null;
  title: string;
  scheduled_start: string;
  scheduled_end: string;
  duration_minutes: number;
  status: "scheduled" | "completed" | "cancelled";
  status_display: string;
  session_notes: string;
  completed_at: string | null;
  confirmed_by_teacher: boolean;
  confirmed_by_learner: boolean;
  created_at: string;
};

export type TeachingHourAuditLog = {
  id: string;
  action: string;
  actor_email: string;
  previous_hours: string | null;
  new_hours: string;
  reason: string;
  timestamp: string;
};

export type TeachingHourLedger = {
  id: string;
  session: string;
  session_title: string;
  session_date: string;
  hours: string;
  status: "pending" | "confirmed" | "disputed" | "revised";
  status_display: string;
  is_verified: boolean;
  audit_logs: TeachingHourAuditLog[];
  created_at: string;
  updated_at: string;
};

export type TeachingHoursSummary = {
  total_hours: number;
  confirmed_hours: number;
  pending_hours: number;
  ledgers: TeachingHourLedger[];
};

export type SkillItem = {
  name: string;
  score: number;
  band: string;
  evidence: string;
};

export type LearnerOverview = {
  learner_id: string;
  learner_email: string;
  class_id: string;
  class_title: string;
  link_status: string;
  consent_given_at: string | null;
  attended_sessions_count: number;
  skill_evidence: {
    cefr_level: string;
    primary_goal: string;
    skills: SkillItem[];
    text_alternative: string;
  };
};

export type CreateClassPayload = {
  title: string;
  subject: string;
  level?: string;
  max_capacity?: number;
  objectives?: string[];
  private_notes?: string;
  coursebook?: string;
  age_group?: string;
  class_size_type?: string;
  default_duration?: number;
  goal?: string;
  focus_skills?: string[];
  equipment?: string[];
  teaching_preferences?: string[];
  target_exams?: string;
  schedule_days?: string[];
  schedule_time_start?: string;
  schedule_time_end?: string;
  meeting_url?: string;
};

export type UpdateClassPayload = Partial<{
  title: string;
  description: string;
  subject: string;
  level: string;
  status: "active" | "archived" | "completed";
  max_capacity: number;
  objectives: string[];
  private_notes: string;
  coursebook: string;
  age_group: string;
  class_size_type: string;
  default_duration: number;
  goal: string;
  focus_skills: string[];
  equipment: string[];
  teaching_preferences: string[];
  target_exams: string;
  schedule_days: string[];
  schedule_time_start: string;
  schedule_time_end: string;
  meeting_url: string;
}>;

export type ScheduleSessionPayload = {
  title: string;
  scheduled_start: string;
  scheduled_end: string;
  duration_minutes: number;
  learner_id?: string | null;
  session_notes?: string;
};

export type UpdateSessionPayload = Partial<{
  title: string;
  scheduled_start: string;
  scheduled_end: string;
  duration_minutes: number;
  status: "scheduled" | "completed" | "cancelled";
  session_notes: string;
  learner_id: string | null;
  confirmed_by_learner: boolean;
}>;

export type LinkedTeacher = {
  link_id: string;
  teacher_id: string;
  teacher_name?: string;
  teacher_email: string;
  class_id: string;
  code?: string;
  class_code?: string;
  class_title: string;
  subject: string;
  level: string;
  consent_given_at: string | null;
  schedule_days?: string[];
  schedule_time_start?: string;
  schedule_time_end?: string;
  schedule_summary?: string;
  meeting_url?: string;
  adobe_connect_url?: string;
  adobe_connect_app_url?: string;
};

export async function fetchTeacherClasses(params?: { code?: string; q?: string }): Promise<TeacherClass[]> {
  const query = new URLSearchParams();
  if (params?.code) query.set("code", params.code);
  if (params?.q) query.set("q", params.q);
  const qs = query.toString();
  return endooraApi<TeacherClass[]>(`/teachers/classes/${qs ? `?${qs}` : ""}`);
}

export async function fetchTeacherClassDetail(classId: string): Promise<{
  class: TeacherClass;
  enrollments: TeacherLearnerLink[];
  sessions: ClassSession[];
}> {
  return endooraApi<{
    class: TeacherClass;
    enrollments: TeacherLearnerLink[];
    sessions: ClassSession[];
  }>(`/teachers/classes/${classId}/`);
}

export async function createTeacherClass(payload: CreateClassPayload): Promise<TeacherClass> {
  return endooraApi<TeacherClass>("/teachers/classes/", {
    method: "POST",
    json: payload,
  });
}

export async function inviteLearnerToClass(
  classId: string,
  emailOrId: { learner_email?: string; learner_id?: string }
): Promise<TeacherLearnerLink> {
  return endooraApi<TeacherLearnerLink>(`/teachers/classes/${classId}/invite/`, {
    method: "POST",
    json: emailOrId,
  });
}

export async function fetchLearnerOverview(
  learnerId: string,
  classId?: string
): Promise<LearnerOverview> {
  const path = classId
    ? `/teachers/classes/${classId}/learners/${learnerId}/overview/`
    : `/teachers/learners/${learnerId}/overview/`;
  return endooraApi<LearnerOverview>(path);
}

export async function terminateLearnerLink(
  linkId: string,
  reason: string = ""
): Promise<TeacherLearnerLink> {
  return endooraApi<TeacherLearnerLink>(`/teachers/links/${linkId}/terminate/`, {
    method: "POST",
    json: { reason },
  });
}

export async function scheduleClassSession(
  classId: string,
  payload: ScheduleSessionPayload
): Promise<ClassSession> {
  return endooraApi<ClassSession>(`/teachers/classes/${classId}/sessions/`, {
    method: "POST",
    json: payload,
  });
}

export async function completeClassSession(
  sessionId: string,
  sessionNotes: string = "",
  confirmedByLearner: boolean = false
): Promise<ClassSession> {
  return endooraApi<ClassSession>(`/teachers/sessions/${sessionId}/complete/`, {
    method: "POST",
    json: { session_notes: sessionNotes, confirmed_by_learner: confirmedByLearner },
  });
}

export async function fetchTeachingHoursSummary(): Promise<TeachingHoursSummary> {
  return endooraApi<TeachingHoursSummary>("/teachers/hours/");
}

export async function adjustTeachingHours(
  ledgerId: string,
  newHours: number,
  reason: string
): Promise<TeachingHourLedger> {
  return endooraApi<TeachingHourLedger>(`/teachers/hours/${ledgerId}/adjust/`, {
    method: "POST",
    json: { new_hours: newHours, reason },
  });
}

export async function acceptLearnerConsent(inviteCode: string): Promise<TeacherLearnerLink> {
  return endooraApi<TeacherLearnerLink>("/teachers/consent/", {
    method: "POST",
    json: { invite_code: inviteCode },
  });
}

export async function updateTeacherClass(
  classId: string,
  payload: UpdateClassPayload
): Promise<TeacherClass> {
  return endooraApi<TeacherClass>(`/teachers/classes/${classId}/`, {
    method: "PATCH",
    json: payload,
  });
}

export async function updateClassSession(
  classId: string,
  sessionId: string,
  payload: UpdateSessionPayload
): Promise<ClassSession> {
  return endooraApi<ClassSession>(`/teachers/classes/${classId}/sessions/${sessionId}/`, {
    method: "PATCH",
    json: payload,
  });
}

export async function deleteClassSession(
  classId: string,
  sessionId: string
): Promise<void> {
  return endooraApi<void>(`/teachers/classes/${classId}/sessions/${sessionId}/`, {
    method: "DELETE",
  });
}

export async function fetchLearnerLinkedTeachers(params?: { code?: string; q?: string }): Promise<LinkedTeacher[]> {
  const query = new URLSearchParams();
  if (params?.code) query.set("code", params.code);
  if (params?.q) query.set("q", params.q);
  const qs = query.toString();
  return endooraApi<LinkedTeacher[]>(`/teachers/my-teachers/${qs ? `?${qs}` : ""}`);
}

export async function lookupClassByCode(code: string): Promise<TeacherClass & { teacher_name?: string; enrolled_count?: number }> {
  return endooraApi<TeacherClass & { teacher_name?: string; enrolled_count?: number }>(
    `/teachers/classes/lookup-by-code/?code=${encodeURIComponent(code)}`
  );
}

export async function joinClassByCode(code: string): Promise<{
  success: boolean;
  class_id: string;
  class_title: string;
  code: string;
  class_code: string;
  status: string;
  message: string;
  class?: TeacherClass;
  link?: TeacherLearnerLink;
}> {
  return endooraApi("/teachers/classes/join-by-code/", {
    method: "POST",
    json: { code },
  });
}


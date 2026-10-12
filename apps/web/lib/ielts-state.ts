import type {
  ExamAttempt,
  IeltsExam,
  IeltsSkill,
  QuestionGradingResult,
  SkillScoreSummary,
} from "@endoora/contracts";

const STORAGE_PREFIX = "endoora_ielts_attempt_";
const ATTEMPTS_INDEX_KEY = "endoora_ielts_attempts_index";

export function getStorageKey(attemptId: string): string {
  return `${STORAGE_PREFIX}${attemptId}`;
}

export function saveAttemptToStorage(attempt: ExamAttempt): void {
  if (typeof window === "undefined") return;
  try {
    const key = getStorageKey(attempt.id);
    localStorage.setItem(key, JSON.stringify(attempt));

    // Update index of attempts
    const rawIndex = localStorage.getItem(ATTEMPTS_INDEX_KEY);
    const index: string[] = rawIndex ? JSON.parse(rawIndex) : [];
    if (!index.includes(attempt.id)) {
      index.unshift(attempt.id);
      localStorage.setItem(ATTEMPTS_INDEX_KEY, JSON.stringify(index.slice(0, 50)));
    }
  } catch (err) {
    console.warn("Failed to persist IELTS attempt to localStorage", err);
  }
}

export function loadAttemptFromStorage(attemptId: string): ExamAttempt | null {
  if (typeof window === "undefined") return null;
  try {
    const key = getStorageKey(attemptId);
    const data = localStorage.getItem(key);
    if (!data) return null;
    return JSON.parse(data) as ExamAttempt;
  } catch {
    return null;
  }
}

export function listAttemptsFromStorage(): ExamAttempt[] {
  if (typeof window === "undefined") return [];
  try {
    const rawIndex = localStorage.getItem(ATTEMPTS_INDEX_KEY);
    if (!rawIndex) return [];
    const ids: string[] = JSON.parse(rawIndex);
    const list: ExamAttempt[] = [];
    for (const id of ids) {
      const attempt = loadAttemptFromStorage(id);
      if (attempt) list.push(attempt);
    }
    return list;
  } catch {
    return [];
  }
}

export function createNewAttempt(
  exam: IeltsExam,
  skill: IeltsSkill | "full" = "reading"
): ExamAttempt {
  const attemptId = `attempt_${exam.id}_${skill}_${Date.now()}`;
  const now = new Date().toISOString();

  const attempt: ExamAttempt = {
    id: attemptId,
    user_id: "local_candidate",
    exam_id: exam.id,
    exam_title: exam.title,
    category: exam.category,
    skill,
    status: "in_progress",
    started_at: now,
    time_spent_seconds: 0,
    user_answers: {},
    flagged_questions: [],
  };

  saveAttemptToStorage(attempt);
  return attempt;
}

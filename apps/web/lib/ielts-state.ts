import type {
  ExamAttempt,
  IeltsExam,
  IeltsSkill,
  QuestionGradingResult,
  SkillScoreSummary,
} from "@endoora/contracts";
import {
  getActiveUserId,
  getScopedStorageKey,
  scopedLocalStorage,
} from "./client-storage.ts";

const STORAGE_PREFIX = "ielts_attempt_";
const ATTEMPTS_INDEX_KEY = "ielts_attempts_index";

export function getStorageKey(
  attemptId: string,
  userId?: string | null
): string {
  return getScopedStorageKey(`${STORAGE_PREFIX}${attemptId}`, userId);
}

export function saveAttemptToStorage(
  attempt: ExamAttempt,
  userId?: string | null
): void {
  try {
    const effectiveUserId =
      userId !== undefined ? userId : getActiveUserId() || attempt.user_id || null;
    attempt.user_id = effectiveUserId || "guest";

    scopedLocalStorage.setItem(
      `${STORAGE_PREFIX}${attempt.id}`,
      JSON.stringify(attempt),
      effectiveUserId
    );

    // Update scoped index of attempts
    const rawIndex = scopedLocalStorage.getItem(ATTEMPTS_INDEX_KEY, effectiveUserId);
    const index: string[] = rawIndex ? JSON.parse(rawIndex) : [];
    if (!index.includes(attempt.id)) {
      index.unshift(attempt.id);
      scopedLocalStorage.setItem(
        ATTEMPTS_INDEX_KEY,
        JSON.stringify(index.slice(0, 50)),
        effectiveUserId
      );
    }
  } catch (err) {
    console.warn("Failed to persist IELTS attempt to scoped storage", err);
  }
}

export function loadAttemptFromStorage(
  attemptId: string,
  userId?: string | null
): ExamAttempt | null {
  try {
    const effectiveUserId =
      userId !== undefined ? userId : getActiveUserId();
    const data = scopedLocalStorage.getItem(
      `${STORAGE_PREFIX}${attemptId}`,
      effectiveUserId
    );
    if (!data) return null;
    return JSON.parse(data) as ExamAttempt;
  } catch {
    return null;
  }
}

export function listAttemptsFromStorage(userId?: string | null): ExamAttempt[] {
  try {
    const effectiveUserId =
      userId !== undefined ? userId : getActiveUserId();
    const rawIndex = scopedLocalStorage.getItem(
      ATTEMPTS_INDEX_KEY,
      effectiveUserId
    );
    if (!rawIndex) return [];
    const ids: string[] = JSON.parse(rawIndex);
    const list: ExamAttempt[] = [];
    for (const id of ids) {
      const attempt = loadAttemptFromStorage(id, effectiveUserId);
      if (attempt) list.push(attempt);
    }
    return list;
  } catch {
    return [];
  }
}

export function createNewAttempt(
  exam: IeltsExam,
  skill: IeltsSkill | "full" = "reading",
  userId?: string | null
): ExamAttempt {
  const attemptId = `attempt_${exam.id}_${skill}_${Date.now()}`;
  const now = new Date().toISOString();
  const effectiveUserId =
    userId ? userId : getActiveUserId() || "guest";

  const attempt: ExamAttempt = {
    id: attemptId,
    user_id: effectiveUserId,
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

  saveAttemptToStorage(attempt, effectiveUserId);
  return attempt;
}

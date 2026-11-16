import fs from "fs";
import path from "path";
export * from "./exam-integrity-content.ts";
import {
  type LiveExamSession,
  type AiGradeAuditRecord,
  type QuestionPsychometricsItem,
  type GradeAppealCase,
  type ExamIntegrityStats,
  type AiCriterionScores,
  INITIAL_LIVE_SESSIONS,
  INITIAL_AI_AUDITS,
  INITIAL_PSYCHOMETRICS,
  INITIAL_APPEALS,
} from "./exam-integrity-content.ts";

interface ExamIntegrityStoragePayload {
  sessions: LiveExamSession[];
  aiAudits: AiGradeAuditRecord[];
  psychometrics: QuestionPsychometricsItem[];
  appeals: GradeAppealCase[];
}

let inMemoryExamIntegrity: ExamIntegrityStoragePayload | null = null;

function resolveStoragePath(): string {
  const candidateWeb = path.join(
    process.cwd(),
    "apps",
    "web",
    "data",
    "exam-integrity-operations.json"
  );
  const candidateLocal = path.join(
    process.cwd(),
    "data",
    "exam-integrity-operations.json"
  );
  if (fs.existsSync(path.dirname(candidateWeb))) {
    return candidateWeb;
  }
  return candidateLocal;
}

function persistToDisk(): void {
  if (!inMemoryExamIntegrity) return;
  try {
    const filePath = resolveStoragePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(inMemoryExamIntegrity, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist Exam Integrity store to disk:", err);
  }
}

function loadFromDisk(): ExamIntegrityStoragePayload {
  try {
    const filePath = resolveStoragePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(content) as ExamIntegrityStoragePayload;
      if (
        Array.isArray(parsed.sessions) &&
        Array.isArray(parsed.aiAudits) &&
        Array.isArray(parsed.psychometrics) &&
        Array.isArray(parsed.appeals)
      ) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to load Exam Integrity store from disk:", err);
  }

  return {
    sessions: JSON.parse(JSON.stringify(INITIAL_LIVE_SESSIONS)),
    aiAudits: JSON.parse(JSON.stringify(INITIAL_AI_AUDITS)),
    psychometrics: JSON.parse(JSON.stringify(INITIAL_PSYCHOMETRICS)),
    appeals: JSON.parse(JSON.stringify(INITIAL_APPEALS)),
  };
}

function ensureStore(): ExamIntegrityStoragePayload {
  if (!inMemoryExamIntegrity) {
    inMemoryExamIntegrity = loadFromDisk();
  }
  return inMemoryExamIntegrity;
}

export function computeExamIntegrityStats(data: ExamIntegrityStoragePayload): ExamIntegrityStats {
  const activeSessionsCount = data.sessions.filter(
    (s) => s.status === "active" || s.status === "flagged" || s.status === "suspended"
  ).length;

  const flaggedViolationsToday = data.sessions.reduce(
    (acc, s) => acc + s.violations.filter((v) => !v.isPardoned).length,
    0
  );

  const pendingAiAudits = data.aiAudits.filter((a) => a.status === "pending_review").length;
  const quarantinedQuestions = data.psychometrics.filter(
    (q) => q.status === "quarantined" || q.status === "flagged_defective"
  ).length;
  const openAppeals = data.appeals.filter((a) => a.status === "under_investigation").length;

  const totalScore = data.sessions.reduce((acc, s) => acc + s.integrityScore, 0);
  const platformAvgIntegrityScore =
    data.sessions.length > 0 ? Math.round(totalScore / data.sessions.length) : 100;

  return {
    activeSessionsCount,
    flaggedViolationsToday,
    pendingAiAudits,
    quarantinedQuestions,
    openAppeals,
    platformAvgIntegrityScore,
  };
}

export function getExamIntegrityData(): {
  sessions: LiveExamSession[];
  aiAudits: AiGradeAuditRecord[];
  psychometrics: QuestionPsychometricsItem[];
  appeals: GradeAppealCase[];
  stats: ExamIntegrityStats;
} {
  const store = ensureStore();
  const stats = computeExamIntegrityStats(store);
  return {
    sessions: store.sessions,
    aiAudits: store.aiAudits,
    psychometrics: store.psychometrics,
    appeals: store.appeals,
    stats,
  };
}

// 1. Live Proctoring Actions
export function sendLiveWarning(sessionId: string, message: string): LiveExamSession {
  const store = ensureStore();
  const session = store.sessions.find((s) => s.id === sessionId);
  if (!session) throw new Error(`Exam session '${sessionId}' not found.`);

  session.adminNotes = `اخطار زنده به داوطلب: "${message}" (${new Date().toLocaleTimeString("fa-IR")})`;
  if (session.status === "active") {
    session.status = "flagged";
  }
  session.integrityScore = Math.max(0, session.integrityScore - 5);
  persistToDisk();
  return session;
}

export function suspendExamSession(sessionId: string, reason: string): LiveExamSession {
  const store = ensureStore();
  const session = store.sessions.find((s) => s.id === sessionId);
  if (!session) throw new Error(`Exam session '${sessionId}' not found.`);

  session.status = "suspended";
  session.adminNotes = `تعلیق موقت توسط ناظر: ${reason}`;
  session.integrityScore = Math.max(0, session.integrityScore - 15);
  persistToDisk();
  return session;
}

export function resumeExamSession(sessionId: string): LiveExamSession {
  const store = ensureStore();
  const session = store.sessions.find((s) => s.id === sessionId);
  if (!session) throw new Error(`Exam session '${sessionId}' not found.`);

  session.status = "active";
  session.adminNotes = `رفع تعلیق و بازگشت به آزمون (${new Date().toLocaleTimeString("fa-IR")})`;
  persistToDisk();
  return session;
}

export function pardonViolation(sessionId: string, violationId: string, reason: string): LiveExamSession {
  const store = ensureStore();
  const session = store.sessions.find((s) => s.id === sessionId);
  if (!session) throw new Error(`Exam session '${sessionId}' not found.`);

  const violation = session.violations.find((v) => v.id === violationId);
  if (!violation) throw new Error(`Violation '${violationId}' not found.`);

  violation.isPardoned = true;
  session.adminNotes = `بخشش تخلف ${violation.type}: ${reason}`;
  session.integrityScore = Math.min(100, session.integrityScore + 10);
  if (session.violations.every((v) => v.isPardoned) && session.status === "flagged") {
    session.status = "active";
  }
  persistToDisk();
  return session;
}

export function grantCompensationTime(sessionId: string, additionalMinutes: number): LiveExamSession {
  const store = ensureStore();
  const session = store.sessions.find((s) => s.id === sessionId);
  if (!session) throw new Error(`Exam session '${sessionId}' not found.`);

  session.durationMinutes += additionalMinutes;
  session.timeRemainingSeconds += additionalMinutes * 60;
  session.adminNotes = `اعطای ${additionalMinutes} دقیقه وقت جبرانی (${new Date().toLocaleTimeString("fa-IR")})`;
  if (session.status === "suspended") {
    session.status = "active";
  }
  persistToDisk();
  return session;
}

export function invalidateExamSession(sessionId: string, reason: string): LiveExamSession {
  const store = ensureStore();
  const session = store.sessions.find((s) => s.id === sessionId);
  if (!session) throw new Error(`Exam session '${sessionId}' not found.`);

  session.status = "disqualified";
  session.timeRemainingSeconds = 0;
  session.integrityScore = 0;
  session.adminNotes = `ابطال قطعی آزمون (Disqualified) به علت تقلب: ${reason}`;
  persistToDisk();
  return session;
}

// 2. AI Grade Audit Actions
export function calibrateAiScore(
  auditId: string,
  humanScores: AiCriterionScores,
  examinerFeedback: string,
  reviewedBy: string
): AiGradeAuditRecord {
  const store = ensureStore();
  const record = store.aiAudits.find((a) => a.id === auditId);
  if (!record) throw new Error(`AI Audit record '${auditId}' not found.`);

  record.humanScores = humanScores;
  record.examinerFeedback = examinerFeedback;
  record.reviewedBy = reviewedBy;
  record.reviewedAt = new Date().toISOString();
  record.status = "calibrated";
  persistToDisk();
  return record;
}

export function confirmOriginalAiScore(auditId: string, reviewedBy: string): AiGradeAuditRecord {
  const store = ensureStore();
  const record = store.aiAudits.find((a) => a.id === auditId);
  if (!record) throw new Error(`AI Audit record '${auditId}' not found.`);

  record.humanScores = { ...record.aiScores };
  record.examinerFeedback = "نمره و تحلیل هوش مصنوعی توسط اگزمینر تایید قطعی شد.";
  record.reviewedBy = reviewedBy;
  record.reviewedAt = new Date().toISOString();
  record.status = "confirmed_original";
  persistToDisk();
  return record;
}

// 3. Question Psychometrics Actions
export function quarantineQuestionItem(itemId: string, reason: string): QuestionPsychometricsItem {
  const store = ensureStore();
  const item = store.psychometrics.find((q) => q.id === itemId);
  if (!item) throw new Error(`Psychometrics question '${itemId}' not found.`);

  item.status = "quarantined";
  item.flagReason = reason;
  persistToDisk();
  return item;
}

export function activateQuestionItem(itemId: string): QuestionPsychometricsItem {
  const store = ensureStore();
  const item = store.psychometrics.find((q) => q.id === itemId);
  if (!item) throw new Error(`Psychometrics question '${itemId}' not found.`);

  item.status = "active";
  item.flagReason = undefined;
  persistToDisk();
  return item;
}

export function regradeQuestionCompensation(itemId: string): {
  item: QuestionPsychometricsItem;
  affectedCandidatesCount: number;
} {
  const store = ensureStore();
  const item = store.psychometrics.find((q) => q.id === itemId);
  if (!item) throw new Error(`Psychometrics question '${itemId}' not found.`);

  item.status = "regraded_compensated";
  const affectedCandidatesCount = item.totalAttempts - item.correctAnswers;
  item.flagReason = `تصحیح عطف‌به‌ماسبق اعمال شد: به تعداد ${affectedCandidatesCount} زبان‌آموزی که پاسخ اشتباه داشتند نمره سوال اختصاص داده شد.`;
  persistToDisk();
  return {
    item,
    affectedCandidatesCount,
  };
}

// 4. Grade Appeals Actions
export function resolveGradeAppeal(
  appealId: string,
  decision: "upgraded" | "rejected",
  revisedBand?: number,
  notes?: string,
  refundIssued: boolean = false,
  adjudicatedBy: string = "مدیر آموزش و داوری سنجش"
): GradeAppealCase {
  const store = ensureStore();
  const appeal = store.appeals.find((a) => a.id === appealId);
  if (!appeal) throw new Error(`Grade appeal case '${appealId}' not found.`);

  appeal.status = decision;
  appeal.revisedBand = decision === "upgraded" ? revisedBand : appeal.originalBand;
  appeal.decisionNotes = notes || (decision === "upgraded" ? "اعتراض پذیرفته و نمره ارتقا یافت." : "اعتراض بررسی و نمره اولیه ابقا شد.");
  appeal.refundIssued = decision === "upgraded" ? refundIssued : false;
  appeal.adjudicatedBy = adjudicatedBy;
  appeal.adjudicatedAt = new Date().toISOString();
  persistToDisk();
  return appeal;
}

// Reset
export function resetExamIntegrityDataToInitial(): void {
  inMemoryExamIntegrity = {
    sessions: JSON.parse(JSON.stringify(INITIAL_LIVE_SESSIONS)),
    aiAudits: JSON.parse(JSON.stringify(INITIAL_AI_AUDITS)),
    psychometrics: JSON.parse(JSON.stringify(INITIAL_PSYCHOMETRICS)),
    appeals: JSON.parse(JSON.stringify(INITIAL_APPEALS)),
  };
  persistToDisk();
}

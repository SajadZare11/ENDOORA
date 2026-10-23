import type { ClinicProgressRecord, ClinicSkill } from "@endoora/contracts";

const STORAGE_KEY = "endoora_ielts_clinic_progress_v1";

export function getStoredClinicProgress(): Record<string, ClinicProgressRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveClinicProgress(record: ClinicProgressRecord): void {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredClinicProgress();
    current[record.clinicId] = record;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.error("Failed to save clinic progress to localStorage:", err);
  }
}

export function getClinicRecord(clinicId: string): ClinicProgressRecord | undefined {
  const current = getStoredClinicProgress();
  return current[clinicId];
}

export interface ClinicsOverallStats {
  totalClinics: number;
  completedCount: number;
  badgesUnlockedCount: number;
  overallAccuracy: number;
  totalTimeSpentSeconds: number;
  skillBreakdown: Record<
    ClinicSkill,
    { total: number; completed: number; accuracy: number }
  >;
}

export function calculateClinicsOverallStats(totalClinicsCount = 9): ClinicsOverallStats {
  const progress = getStoredClinicProgress();
  const records = Object.values(progress);

  const completedCount = records.filter((r) => r.completed).length;
  const badgesUnlockedCount = records.filter((r) => r.badgeUnlocked).length;

  let totalQuestionsAnswered = 0;
  let totalScoreEarned = 0;
  let totalTime = 0;

  const skillBreakdown: Record<
    ClinicSkill,
    { total: number; completed: number; accuracy: number }
  > = {
    reading: { total: 3, completed: 0, accuracy: 0 },
    writing: { total: 2, completed: 0, accuracy: 0 },
    listening: { total: 2, completed: 0, accuracy: 0 },
    speaking: { total: 2, completed: 0, accuracy: 0 },
  };

  const skillScores: Record<ClinicSkill, { score: number; questions: number }> = {
    reading: { score: 0, questions: 0 },
    writing: { score: 0, questions: 0 },
    listening: { score: 0, questions: 0 },
    speaking: { score: 0, questions: 0 },
  };

  records.forEach((r) => {
    totalQuestionsAnswered += r.totalQuestions;
    totalScoreEarned += r.score;
    totalTime += r.timeSpentSeconds || 0;

    if (r.completed && skillBreakdown[r.skill]) {
      skillBreakdown[r.skill].completed += 1;
    }
    if (skillScores[r.skill]) {
      skillScores[r.skill].score += r.score;
      skillScores[r.skill].questions += r.totalQuestions;
    }
  });

  (Object.keys(skillBreakdown) as ClinicSkill[]).forEach((skill) => {
    const qCount = skillScores[skill].questions;
    skillBreakdown[skill].accuracy =
      qCount > 0 ? Math.round((skillScores[skill].score / qCount) * 100) : 0;
  });

  const overallAccuracy =
    totalQuestionsAnswered > 0
      ? Math.round((totalScoreEarned / totalQuestionsAnswered) * 100)
      : 0;

  return {
    totalClinics: totalClinicsCount,
    completedCount,
    badgesUnlockedCount,
    overallAccuracy,
    totalTimeSpentSeconds: totalTime,
    skillBreakdown,
  };
}

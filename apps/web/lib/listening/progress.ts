/**
 * Local-First Reactive Progress & Recommendation Engine for Listening
 * Tracks attempts, stage completion, time spent, CEFR mastery, and weak skills.
 */

import type {
  CEFRLevel,
  ListeningLesson,
  ListeningLessonAttempt,
  ListeningProgressRecord,
  ListeningRecommendation,
  ListeningSkillTag,
} from "@endoora/contracts";
import { ALL_LISTENING_LESSONS } from "@/data/listening";

export const STORAGE_KEY_LISTENING_PROGRESS = "endoora_listening_progress_v2";
export const LISTENING_PROGRESS_EVENT = "endoora:listening:progress-change";

export function createDefaultListeningProgress(): ListeningProgressRecord {
  const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const byLevel: ListeningProgressRecord["byLevel"] = {} as any;

  levels.forEach((lvl) => {
    const available = ALL_LISTENING_LESSONS.filter((l) => l.level === lvl).length;
    byLevel[lvl] = {
      totalAvailable: available,
      completedCount: 0,
      averageScorePercent: 0,
    };
  });

  const skillMastery: ListeningProgressRecord["skillMastery"] = {} as any;
  const allSkills: ListeningSkillTag[] = [
    "gist",
    "specific_information",
    "detail",
    "main_idea",
    "inference",
    "speaker_intention",
    "speaker_attitude",
    "paraphrase",
    "note_taking",
    "prediction",
    "sequencing",
    "dictation",
    "pronunciation",
    "connected_speech",
    "implicit_meaning",
    "pragmatics",
    "discourse",
    "argumentation",
    "nuance",
    "rhetorical_purpose",
  ];

  allSkills.forEach((s) => {
    skillMastery[s] = {
      attemptsCount: 0,
      correctCount: 0,
      accuracyPercent: 0,
    };
  });

  return {
    summary: {
      totalLessonsCompleted: 0,
      totalListeningSeconds: 0,
      overallAccuracyPercent: 0,
      lastActiveAt: new Date().toISOString(),
      currentStreakDays: 1,
    },
    byLevel,
    skillMastery,
    lessonAttempts: {},
    recommendedLessonId: ALL_LISTENING_LESSONS[0]?.id || "a1-daily-001",
  };
}

export function loadListeningProgress(): ListeningProgressRecord {
  if (typeof window === "undefined" || !window.localStorage) {
    return createDefaultListeningProgress();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_LISTENING_PROGRESS);
    if (!raw) return createDefaultListeningProgress();
    const parsed = JSON.parse(raw);
    return {
      ...createDefaultListeningProgress(),
      ...parsed,
      summary: {
        ...createDefaultListeningProgress().summary,
        ...(parsed.summary || {}),
      },
    };
  } catch (err) {
    console.error("Failed to load listening progress:", err);
    return createDefaultListeningProgress();
  }
}

export function saveListeningProgress(record: ListeningProgressRecord): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(STORAGE_KEY_LISTENING_PROGRESS, JSON.stringify(record));
    window.dispatchEvent(new CustomEvent(LISTENING_PROGRESS_EVENT, { detail: record }));
  } catch (err) {
    console.error("Failed to save listening progress:", err);
  }
}

export function recordLessonAttempt(
  lesson: ListeningLesson,
  scorePercent: number,
  listeningTimeDeltaSeconds: number,
  completedStages: number[],
  exerciseAnswers: Record<string, any>,
  difficultQuestions: string[]
): ListeningProgressRecord {
  const current = loadListeningProgress();
  const existing = current.lessonAttempts[lesson.id];

  const isCompleted = completedStages.includes(7) || scorePercent >= 70;
  const attemptNumber = (existing?.attemptNumber || 0) + 1;
  const newListeningTime = (existing?.listeningTimeSeconds || 0) + listeningTimeDeltaSeconds;

  const updatedAttempt: ListeningLessonAttempt = {
    lessonId: lesson.id,
    startedAt: existing?.startedAt || new Date().toISOString(),
    completedAt: isCompleted ? new Date().toISOString() : existing?.completedAt,
    isCompleted,
    scorePercent: Math.max(scorePercent, existing?.scorePercent || 0),
    attemptNumber,
    listeningTimeSeconds: newListeningTime,
    completedStages: Array.from(new Set([...(existing?.completedStages || []), ...completedStages])),
    exerciseAnswers: { ...(existing?.exerciseAnswers || {}), ...exerciseAnswers },
    difficultQuestionIds: Array.from(new Set([...(existing?.difficultQuestionIds || []), ...difficultQuestions])),
    lastPlaybackPositionSeconds: 0,
  };

  current.lessonAttempts[lesson.id] = updatedAttempt;
  current.currentActiveLessonId = lesson.id;
  current.summary.totalListeningSeconds += listeningTimeDeltaSeconds;
  current.summary.lastActiveAt = new Date().toISOString();

  // Recalculate summary & level stats
  let totalScoreSum = 0;
  let totalCompleted = 0;
  const levelScores: Record<CEFRLevel, number[]> = { A1: [], A2: [], B1: [], B2: [], C1: [], C2: [] };

  Object.values(current.lessonAttempts).forEach((att) => {
    const l = ALL_LISTENING_LESSONS.find((item) => item.id === att.lessonId);
    if (!l) return;
    if (att.isCompleted) {
      totalCompleted++;
    }
    totalScoreSum += att.scorePercent;
    levelScores[l.level].push(att.scorePercent);
  });

  const totalAttemptsCount = Object.keys(current.lessonAttempts).length;
  current.summary.totalLessonsCompleted = totalCompleted;
  current.summary.overallAccuracyPercent =
    totalAttemptsCount > 0 ? Math.round(totalScoreSum / totalAttemptsCount) : 0;

  // Level breakdowns
  (["A1", "A2", "B1", "B2", "C1", "C2"] as CEFRLevel[]).forEach((lvl) => {
    const scores = levelScores[lvl];
    const completedForLevel = Object.values(current.lessonAttempts).filter((att) => {
      const l = ALL_LISTENING_LESSONS.find((item) => item.id === att.lessonId);
      return l?.level === lvl && att.isCompleted;
    }).length;

    current.byLevel[lvl] = {
      totalAvailable: ALL_LISTENING_LESSONS.filter((l) => l.level === lvl).length,
      completedCount: completedForLevel,
      averageScorePercent: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    };
  });

  // Update skill mastery
  lesson.skillTags.forEach((tag) => {
    const prev = current.skillMastery[tag] || { attemptsCount: 0, correctCount: 0, accuracyPercent: 0 };
    const attempts = prev.attemptsCount + 1;
    const isGood = scorePercent >= 70;
    const correct = prev.correctCount + (isGood ? 1 : 0);
    current.skillMastery[tag] = {
      attemptsCount: attempts,
      correctCount: correct,
      accuracyPercent: Math.round((correct / attempts) * 100),
    };
  });

  // Calculate new recommendation
  current.recommendedLessonId = determineNextRecommendedLesson(current);

  saveListeningProgress(current);
  return current;
}

/**
 * Intelligent recommendation logic:
 * 1. Prioritizes weak skills (skills with < 65% accuracy)
 * 2. If current level is completed, bridges to the next CEFR level
 * 3. Finds unstarted lessons at the learner's frontier level
 */
export function determineNextRecommendedLesson(progress: ListeningProgressRecord): string {
  // Check for weak skill tag
  const weakSkillEntry = Object.entries(progress.skillMastery).find(
    ([_, stats]) => stats.attemptsCount >= 2 && stats.accuracyPercent < 60
  );

  if (weakSkillEntry) {
    const [weakTag] = weakSkillEntry as [ListeningSkillTag, any];
    const matchingUnfinished = ALL_LISTENING_LESSONS.find(
      (l) => l.skillTags.includes(weakTag) && !progress.lessonAttempts[l.id]?.isCompleted
    );
    if (matchingUnfinished) return matchingUnfinished.id;
  }

  // Find lowest incomplete level
  const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  for (const lvl of levels) {
    const levelLessons = ALL_LISTENING_LESSONS.filter((l) => l.level === lvl);
    const incomplete = levelLessons.find((l) => !progress.lessonAttempts[l.id]?.isCompleted);
    if (incomplete) {
      return incomplete.id;
    }
  }

  return ALL_LISTENING_LESSONS[0]?.id || "a1-daily-001";
}

export function getPersonalizedRecommendations(
  progress: ListeningProgressRecord,
  limit = 3
): ListeningRecommendation[] {
  const recommendations: ListeningRecommendation[] = [];

  // Weak skill check
  const weakSkills = Object.entries(progress.skillMastery)
    .filter(([_, stats]) => stats.attemptsCount >= 1 && stats.accuracyPercent < 70)
    .sort((a, b) => a[1].accuracyPercent - b[1].accuracyPercent);

  if (weakSkills.length > 0) {
    const [weakTag] = weakSkills[0] as [ListeningSkillTag, any];
    const targetLesson = ALL_LISTENING_LESSONS.find(
      (l) => l.skillTags.includes(weakTag) && !progress.lessonAttempts[l.id]?.isCompleted
    );
    if (targetLesson) {
      recommendations.push({
        lessonId: targetLesson.id,
        targetSkill: weakTag,
        urgency: "high",
        reasonFa: `تقویت مهارت هدف: دقت شما در بخش «${weakTag}» نیازمند تمرین بیشتر است.`,
        reasonEn: `Targeted practice: boost your comprehension in ${weakTag}.`,
      });
    }
  }

  // Frontier level check
  const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  for (const lvl of levels) {
    const lvlLessons = ALL_LISTENING_LESSONS.filter((l) => l.level === lvl);
    const uncompleted = lvlLessons.filter((l) => !progress.lessonAttempts[l.id]?.isCompleted);

    for (const lesson of uncompleted) {
      if (recommendations.length >= limit) break;
      if (!recommendations.some((r) => r.lessonId === lesson.id)) {
        recommendations.push({
          lessonId: lesson.id,
          targetSkill: lesson.skillTags[0] || "gist",
          urgency: "medium",
          reasonFa: `درس بعدی در مسیر تسلط سطح ${lvl}: ${lesson.titleFa}`,
          reasonEn: `Next lesson in CEFR ${lvl} roadmap.`,
        });
      }
    }
    if (recommendations.length >= limit) break;
  }

  return recommendations;
}

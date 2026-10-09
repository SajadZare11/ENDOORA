/**
 * Hybrid Student Progress & Analytics Persistence for "تمرین تا ۲۰" (Vision 3)
 *
 * Provides:
 * - Local-first persistence in localStorage (`endoora_tamrin20_progress_v1`)
 * - Reactive state updates across browser windows and components
 * - Pedagogical metrics: accuracy %, total time, error tagging, weakest skills
 * - Integration hooks for Learner Dashboard (/dashboard) and Progress (/progress)
 */

"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import type { Tamrin20ProgressRecord, Tamrin20Skill } from "@endoora/contracts";
import {
  createDefaultProgressRecord,
  recordQuestionAttempt,
  deserializeProgress,
  STORAGE_KEY_PROGRESS,
  SKILL_TITLES_FA,
  SKILL_TITLES_EN,
} from "./tamrin20-data";

export type { Tamrin20ProgressRecord, Tamrin20Skill };
export { createDefaultProgressRecord, recordQuestionAttempt, deserializeProgress };

// Custom DOM event name for real-time reactive sync across components
const PROGRESS_EVENT_NAME = "endoora:tamrin20:progress-change";

/**
 * Loads current Tamrin20 progress from localStorage (with SSR safety).
 */
export function loadTamrin20Progress(): Tamrin20ProgressRecord {
  if (typeof window === "undefined" || !window.localStorage) {
    return createDefaultProgressRecord();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_PROGRESS);
    return deserializeProgress(raw);
  } catch (err) {
    console.error("Failed to load Tamrin20 progress from localStorage:", err);
    return createDefaultProgressRecord();
  }
}

/**
 * Saves updated Tamrin20 progress to localStorage and notifies reactive subscribers.
 */
export function saveTamrin20Progress(record: Tamrin20ProgressRecord): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(record));
    window.dispatchEvent(new CustomEvent(PROGRESS_EVENT_NAME, { detail: record }));
  } catch (err) {
    console.error("Failed to save Tamrin20 progress to localStorage:", err);
  }
}

/**
 * Convenience alias for recording an attempt and immediately persisting.
 */
export function recordAttempt(attempt: {
  lesson: 1 | 2 | 3 | number;
  skill: Tamrin20Skill;
  questionId: string;
  isCorrect: boolean;
  timeSeconds?: number;
  tag?: string;
}): Tamrin20ProgressRecord {
  const current = loadTamrin20Progress();
  const next = recordQuestionAttempt(current, attempt);
  saveTamrin20Progress(next);
  return next;
}

/**
 * Calculates overall accuracy percentage (0-100).
 */
export function getOverallAccuracy(record: Tamrin20ProgressRecord): number {
  if (record.summary.totalAttempted === 0) return 0;
  return Math.round((record.summary.totalCorrect / record.summary.totalAttempted) * 100);
}

/**
 * Formats time spent in seconds into human-readable Persian string.
 */
export function formatTimeSpentFa(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds < 60) {
    return `${Math.max(0, Math.round(totalSeconds || 0))} ثانیه`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) {
    const remainingMins = minutes % 60;
    return `${hours} ساعت و ${remainingMins} دقیقه`;
  }
  return `${minutes} دقیقه`;
}

export interface SkillPerformanceMetric {
  skill: Tamrin20Skill;
  skillTitleFa: string;
  skillTitleEn: string;
  attempted: number;
  correct: number;
  accuracy: number;
  timeSeconds: number;
}

/**
 * Aggregates performance across all 3 lessons for each of the 5 skills.
 */
export function getAggregatedSkillMetrics(record: Tamrin20ProgressRecord): SkillPerformanceMetric[] {
  const skills: Tamrin20Skill[] = ["listening", "vocabulary", "grammar", "reading", "writing"];

  return skills.map((skill) => {
    let attempted = 0;
    let correct = 0;
    let timeSeconds = 0;

    for (const lessonNum of [1, 2, 3]) {
      const lessonStats = record.byLesson[lessonNum]?.[skill];
      if (lessonStats) {
        attempted += lessonStats.attempted || 0;
        correct += lessonStats.correct || 0;
        timeSeconds += lessonStats.timeSeconds || 0;
      }
    }

    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

    return {
      skill,
      skillTitleFa: SKILL_TITLES_FA[skill] || skill,
      skillTitleEn: SKILL_TITLES_EN[skill] || skill,
      attempted,
      correct,
      accuracy,
      timeSeconds,
    };
  });
}

/**
 * Identifies the top weak skills or topics that need pedagogical improvement.
 */
export function getWeakAreasAnalysis(record: Tamrin20ProgressRecord): {
  weakSkills: SkillPerformanceMetric[];
  topWeakTags: Array<{ tag: string; count: number; titleFa: string }>;
  suggestedActionFa: string;
} {
  const allSkills = getAggregatedSkillMetrics(record);
  // Sort attempted skills by lowest accuracy
  const attemptedSkills = allSkills.filter((s) => s.attempted >= 3);
  const weakSkills = [...attemptedSkills].sort((a, b) => a.accuracy - b.accuracy);

  // Parse weak tags
  const tagEntries = Object.entries(record.weakTags || {})
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([tag, count]) => {
      // Friendly Persian translation for known tags
      const tagLabels: Record<string, string> = {
        passive_voice: "گرامر جملات مجهول",
        tag_questions: "گرامر سوالات ضمیمه",
        relative_clauses: "جملات موصولی (who, which, that)",
        conditional_type2: "شرطی نوع دوم",
        past_perfect: "زمان گذشته کامل (ماضی بعید)",
        modal_passive: "مجهول با افعال کمکی",
        compound_sentences: "نگارش جملات مرکب (and, but, or, so)",
        paragraph_structure: "ساختار پاراگراف و Topic Sentence",
        supporting_sentences: "جملات پشتیبان و نتیجه‌گیری",
        collocations: "هم‌آیی‌ها و اصطلاحات",
        word_families: "خانواده اجزای کلمات",
        proverbs: "ضرب‌المثل‌ها",
        listening_detail: "درک جزئیات بخش شنیداری",
        reading_reference: "مرجع ضمایر در ریدینگ",
        reading_context: "معنی واژه در متن ریدینگ",
      };

      return {
        tag,
        count,
        titleFa: tagLabels[tag] || tag.replace(/_/g, " "),
      };
    });

  let suggestedActionFa = "تمرینات را آغاز کنید تا نقاط قوت و ضعف شما تحلیل شود.";
  if (weakSkills.length > 0 && weakSkills[0].accuracy < 70) {
    const weakest = weakSkills[0];
    suggestedActionFa = `نیاز به تمرین بیشتر در مهارت «${weakest.skillTitleFa}» (دقت ${weakest.accuracy}٪). توصیه می‌شود سوالات تکمیلی این بخش را حل کنید.`;
  } else if (record.summary.totalAttempted > 0) {
    suggestedActionFa = "عملکرد شما در سطح مطلوبی قرار دارد. برای تسلط ۲۰، تمرینات سایر دروس را ادامه دهید.";
  }

  return {
    weakSkills,
    topWeakTags: tagEntries,
    suggestedActionFa,
  };
}

/**
 * Custom React hook for reactive Tamrin20 progress state.
 */
export function useTamrin20Progress(): {
  progress: Tamrin20ProgressRecord;
  recordAttempt: (attempt: {
    lesson: 1 | 2 | 3 | number;
    skill: Tamrin20Skill;
    questionId: string;
    isCorrect: boolean;
    timeSeconds?: number;
    tag?: string;
  }) => void;
  resetProgress: () => void;
  metrics: SkillPerformanceMetric[];
  analysis: ReturnType<typeof getWeakAreasAnalysis>;
} {
  const [progress, setProgress] = useState<Tamrin20ProgressRecord>(createDefaultProgressRecord());

  useEffect(() => {
    // Initial load on mount
    setProgress(loadTamrin20Progress());

    // Listen to custom intra-app events
    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<Tamrin20ProgressRecord>;
      if (customEvent.detail) {
        setProgress(customEvent.detail);
      } else {
        setProgress(loadTamrin20Progress());
      }
    };

    // Listen to storage events from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_PROGRESS) {
        setProgress(deserializeProgress(e.newValue));
      }
    };

    window.addEventListener(PROGRESS_EVENT_NAME, handleCustomChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(PROGRESS_EVENT_NAME, handleCustomChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleRecordAttempt = useCallback(
    (attempt: {
      lesson: 1 | 2 | 3 | number;
      skill: Tamrin20Skill;
      questionId: string;
      isCorrect: boolean;
      timeSeconds?: number;
      tag?: string;
    }) => {
      setProgress((prev) => {
        const next = recordQuestionAttempt(prev, attempt);
        saveTamrin20Progress(next);
        return next;
      });
    },
    []
  );

  const resetProgress = useCallback(() => {
    const empty = createDefaultProgressRecord();
    saveTamrin20Progress(empty);
    setProgress(empty);
  }, []);

  const metrics = getAggregatedSkillMetrics(progress);
  const analysis = getWeakAreasAnalysis(progress);

  return {
    progress,
    recordAttempt: handleRecordAttempt,
    resetProgress,
    metrics,
    analysis,
  };
}

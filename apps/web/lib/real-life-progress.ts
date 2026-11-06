"use client";

import { SkillType } from "./video-learning";
import { getRealLifeLessonsByLevel } from "./real-life-curriculum";

export interface RealLifeLessonProgress {
  lessonId: string;
  level: string;
  episodeNumber: number;
  watchPercentage: number;
  maxWatchedSeconds: number;
  scores?: Partial<Record<SkillType, number>>;
  totalScore?: number;
  isWatched: boolean;
  isQuizPassed: boolean;
  isCompleted: boolean;
  updatedAt: string;
  completedAt?: string;
}

export interface RealLifeLevelSummary {
  level: string;
  totalLessons: number;
  completedCount: number;
  averageWatchPercentage: number;
  averageMasteryScore: number;
  percentCompleted: number;
}

const STORAGE_KEY = "endoora_real_life_video_progress_v1";

/**
 * Get all saved Real-Life progress from localStorage
 */
export function getRealLifeAllProgress(): Record<string, RealLifeLessonProgress> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse Real-Life progress from localStorage:", err);
    return {};
  }
}

/**
 * Get progress for a single lesson
 */
export function getRealLifeLessonProgress(lessonId: string): RealLifeLessonProgress | null {
  const all = getRealLifeAllProgress();
  return all[lessonId.toLowerCase()] || null;
}

/**
 * Check if a specific lesson is unlocked.
 * Rule:
 * - Episode 1 of any level is ALWAYS unlocked.
 * - Episode N (N > 1) is unlocked if Episode N-1 has watchPercentage >= 80 AND totalScore >= 70.
 */
export function isRealLifeLessonUnlocked(
  level: string,
  episodeNumber: number,
  allProgressCache?: Record<string, RealLifeLessonProgress>
): boolean {
  if (episodeNumber <= 1) return true;

  const all = allProgressCache || getRealLifeAllProgress();
  const prevEpNumber = episodeNumber - 1;
  const prevLessonId = `${level.toLowerCase()}-v${prevEpNumber.toString().padStart(2, "0")}`;
  const prevProgress = all[prevLessonId];

  if (!prevProgress) return false;

  const watchedValid = (prevProgress.watchPercentage || 0) >= 80;
  const quizValid = (prevProgress.totalScore || 0) >= 70;

  return watchedValid && quizValid;
}

/**
 * Save watch progress for a lesson
 */
export function saveRealLifeWatchProgress(
  lessonId: string,
  level: string,
  episodeNumber: number,
  watchPercentage: number,
  maxWatchedSeconds: number
): RealLifeLessonProgress {
  if (typeof window === "undefined") {
    return {
      lessonId,
      level,
      episodeNumber,
      watchPercentage,
      maxWatchedSeconds,
      isWatched: watchPercentage >= 80,
      isQuizPassed: false,
      isCompleted: false,
      updatedAt: new Date().toISOString(),
    };
  }

  const all = getRealLifeAllProgress();
  const key = lessonId.toLowerCase();
  const existing = all[key] || {
    lessonId,
    level,
    episodeNumber,
    watchPercentage: 0,
    maxWatchedSeconds: 0,
    isWatched: false,
    isQuizPassed: false,
    isCompleted: false,
    updatedAt: new Date().toISOString(),
  };

  const newWatchPct = Math.max(existing.watchPercentage || 0, Math.min(100, Math.round(watchPercentage)));
  const newMaxSec = Math.max(existing.maxWatchedSeconds || 0, Math.round(maxWatchedSeconds));
  const isWatched = newWatchPct >= 80;
  const isCompleted = isWatched && existing.isQuizPassed;

  const updated: RealLifeLessonProgress = {
    ...existing,
    watchPercentage: newWatchPct,
    maxWatchedSeconds: newMaxSec,
    isWatched,
    isCompleted,
    updatedAt: new Date().toISOString(),
    completedAt: isCompleted ? (existing.completedAt || new Date().toISOString()) : undefined,
  };

  all[key] = updated;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent("real-life-progress-updated", { detail: { lessonId, updated } }));
  } catch (err) {
    console.error("Failed to persist Real-Life watch progress:", err);
  }

  return updated;
}

/**
 * Save quiz results for a lesson
 */
export function saveRealLifeQuizResults(
  lessonId: string,
  level: string,
  episodeNumber: number,
  scores: Partial<Record<SkillType, number>>,
  totalScore: number
): RealLifeLessonProgress {
  if (typeof window === "undefined") {
    return {
      lessonId,
      level,
      episodeNumber,
      watchPercentage: 0,
      maxWatchedSeconds: 0,
      scores,
      totalScore,
      isWatched: false,
      isQuizPassed: totalScore >= 70,
      isCompleted: false,
      updatedAt: new Date().toISOString(),
    };
  }

  const all = getRealLifeAllProgress();
  const key = lessonId.toLowerCase();
  const existing = all[key] || {
    lessonId,
    level,
    episodeNumber,
    watchPercentage: 0,
    maxWatchedSeconds: 0,
    isWatched: false,
    isQuizPassed: false,
    isCompleted: false,
    updatedAt: new Date().toISOString(),
  };

  const isQuizPassed = totalScore >= 70;
  const isCompleted = existing.isWatched && isQuizPassed;

  const updated: RealLifeLessonProgress = {
    ...existing,
    scores,
    totalScore: Math.round(totalScore),
    isQuizPassed,
    isCompleted,
    updatedAt: new Date().toISOString(),
    completedAt: isCompleted ? (existing.completedAt || new Date().toISOString()) : undefined,
  };

  all[key] = updated;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent("real-life-progress-updated", { detail: { lessonId, updated } }));
  } catch (err) {
    console.error("Failed to persist Real-Life quiz progress:", err);
  }

  return updated;
}

/**
 * Calculate level summary statistics
 */
export function getRealLifeLevelSummary(level: string): RealLifeLevelSummary {
  const lessons = getRealLifeLessonsByLevel(level);
  const all = getRealLifeAllProgress();

  if (lessons.length === 0) {
    return {
      level,
      totalLessons: 0,
      completedCount: 0,
      averageWatchPercentage: 0,
      averageMasteryScore: 0,
      percentCompleted: 0,
    };
  }

  let completedCount = 0;
  let totalWatch = 0;
  let totalScoreSum = 0;
  let scoredLessonsCount = 0;

  for (const les of lessons) {
    const prog = all[les.id.toLowerCase()];
    if (prog) {
      if (prog.isCompleted) {
        completedCount++;
      }
      totalWatch += prog.watchPercentage || 0;
      if (typeof prog.totalScore === "number") {
        totalScoreSum += prog.totalScore;
        scoredLessonsCount++;
      }
    }
  }

  const averageWatchPercentage = Math.round(totalWatch / lessons.length);
  const averageMasteryScore = scoredLessonsCount > 0 ? Math.round(totalScoreSum / scoredLessonsCount) : 0;
  const percentCompleted = Math.round((completedCount / lessons.length) * 100);

  return {
    level,
    totalLessons: lessons.length,
    completedCount,
    averageWatchPercentage,
    averageMasteryScore,
    percentCompleted,
  };
}

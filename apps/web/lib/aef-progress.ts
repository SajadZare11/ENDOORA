"use client";

import { SkillType } from "./video-learning";
import { getAEFLessonsByLevel } from "./aef-curriculum";

export interface AEFLessonProgress {
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

export interface AEFLevelSummary {
  level: string;
  totalLessons: number;
  completedCount: number;
  averageWatchPercentage: number;
  averageMasteryScore: number;
  percentCompleted: number;
}

const STORAGE_KEY = "endoora_aef_video_progress_v1";

/**
 * Get all saved AEF progress from localStorage
 */
export function getAEFAllProgress(): Record<string, AEFLessonProgress> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse AEF progress from localStorage:", err);
    return {};
  }
}

/**
 * Get progress for a single lesson
 */
export function getAEFLessonProgress(lessonId: string): AEFLessonProgress | null {
  const all = getAEFAllProgress();
  return all[lessonId.toLowerCase()] || null;
}

/**
 * Check if a specific lesson is unlocked.
 * Rule:
 * - Episode 1 of any level is ALWAYS unlocked.
 * - Episode N (N > 1) is unlocked if Episode N-1 has watchPercentage >= 80 AND totalScore >= 70.
 */
export function isAEFLessonUnlocked(
  level: string,
  episodeNumber: number,
  allProgressCache?: Record<string, AEFLessonProgress>
): boolean {
  if (episodeNumber <= 1) return true;

  const all = allProgressCache || getAEFAllProgress();
  const prevEpNumber = episodeNumber - 1;
  const prevLessonId = `${level.toLowerCase()}-v${prevEpNumber.toString().padStart(2, "0")}`;
  const prevProgress = all[prevLessonId];

  if (!prevProgress) return false;

  const isWatched = (prevProgress.watchPercentage ?? 0) >= 80;
  const isQuizPassed = (prevProgress.totalScore ?? 0) >= 70;

  return isWatched && isQuizPassed;
}

/**
 * Save watch progress
 */
export function saveAEFWatchProgress(
  lessonId: string,
  level: string,
  episodeNumber: number,
  percentage: number,
  currentSec: number
): AEFLessonProgress {
  if (typeof window === "undefined") {
    return {
      lessonId,
      level,
      episodeNumber,
      watchPercentage: percentage,
      maxWatchedSeconds: currentSec,
      isWatched: percentage >= 80,
      isQuizPassed: false,
      isCompleted: false,
      updatedAt: new Date().toISOString(),
    };
  }

  const all = getAEFAllProgress();
  const id = lessonId.toLowerCase();
  const prev = all[id] || {
    lessonId: id,
    level: level.toLowerCase(),
    episodeNumber,
    watchPercentage: 0,
    maxWatchedSeconds: 0,
    isWatched: false,
    isQuizPassed: false,
    isCompleted: false,
    updatedAt: new Date().toISOString(),
  };

  const newPercentage = Math.max(prev.watchPercentage, Math.min(100, Math.round(percentage)));
  const newMaxSec = Math.max(prev.maxWatchedSeconds, Math.round(currentSec));
  const isWatched = newPercentage >= 80;
  const isCompleted = isWatched && prev.isQuizPassed;

  const updated: AEFLessonProgress = {
    ...prev,
    watchPercentage: newPercentage,
    maxWatchedSeconds: newMaxSec,
    isWatched,
    isCompleted,
    updatedAt: new Date().toISOString(),
    completedAt: isCompleted ? (prev.completedAt || new Date().toISOString()) : undefined,
  };

  all[id] = updated;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event("aef-progress-updated"));
  } catch (err) {
    console.error("Failed to save AEF watch progress:", err);
  }

  return updated;
}

/**
 * Save 6-skill quiz results
 */
export function saveAEFQuizResults(
  lessonId: string,
  level: string,
  episodeNumber: number,
  scores: Record<SkillType, number>,
  totalScore: number
): AEFLessonProgress {
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

  const all = getAEFAllProgress();
  const id = lessonId.toLowerCase();
  const prev = all[id] || {
    lessonId: id,
    level: level.toLowerCase(),
    episodeNumber,
    watchPercentage: 0,
    maxWatchedSeconds: 0,
    isWatched: false,
    isQuizPassed: false,
    isCompleted: false,
    updatedAt: new Date().toISOString(),
  };

  const isQuizPassed = totalScore >= 70;
  const isCompleted = prev.isWatched && isQuizPassed;

  const updated: AEFLessonProgress = {
    ...prev,
    scores,
    totalScore,
    isQuizPassed,
    isCompleted,
    updatedAt: new Date().toISOString(),
    completedAt: isCompleted ? (prev.completedAt || new Date().toISOString()) : undefined,
  };

  all[id] = updated;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event("aef-progress-updated"));
  } catch (err) {
    console.error("Failed to save AEF quiz results:", err);
  }

  return updated;
}

/**
 * Get summary stats for a level (A1 to C2)
 */
export function getAEFLevelSummary(level: string): AEFLevelSummary {
  const norm = level.toLowerCase();
  const lessons = getAEFLessonsByLevel(norm);
  const totalLessons = lessons.length || 20;

  const all = getAEFAllProgress();

  let completedCount = 0;
  let totalWatch = 0;
  let totalScoreSum = 0;
  let scoredCount = 0;

  for (const lesson of lessons) {
    const prog = all[lesson.id.toLowerCase()];
    if (prog) {
      if (prog.isCompleted) {
        completedCount++;
      }
      totalWatch += prog.watchPercentage || 0;
      if (typeof prog.totalScore === "number") {
        totalScoreSum += prog.totalScore;
        scoredCount++;
      }
    }
  }

  const averageWatchPercentage = Math.round(totalWatch / totalLessons);
  const averageMasteryScore = scoredCount > 0 ? Math.round(totalScoreSum / scoredCount) : 0;
  const percentCompleted = Math.round((completedCount / totalLessons) * 100);

  return {
    level: norm,
    totalLessons,
    completedCount,
    averageWatchPercentage,
    averageMasteryScore,
    percentCompleted,
  };
}

import type { CefrLevel } from "../../data/skills/games/types";
import type { LevelAdventureProgress } from "../../data/skills/games/reading-adventure-types";

const ADVENTURE_STORAGE_KEY_PREFIX = "endoora_reading_adventure_v2_";

const DEFAULT_ADVENTURE_PROGRESS: LevelAdventureProgress = {
  completedStoryIds: [],
  discoveredEndingsByStory: {},
  storyBestTimes: {},
  storyBestScores: {},
};

export function getDefaultAdventureProgress(): LevelAdventureProgress {
  return {
    completedStoryIds: [],
    discoveredEndingsByStory: {},
    storyBestTimes: {},
    storyBestScores: {},
  };
}

export function getAdventureProgress(cefr: CefrLevel): LevelAdventureProgress {
  if (typeof window === "undefined") {
    return getDefaultAdventureProgress();
  }
  try {
    const raw = window.localStorage.getItem(`${ADVENTURE_STORAGE_KEY_PREFIX}${cefr}`);
    if (!raw) return getDefaultAdventureProgress();
    const parsed = JSON.parse(raw);
    return {
      completedStoryIds: Array.isArray(parsed.completedStoryIds) ? parsed.completedStoryIds : [],
      discoveredEndingsByStory: parsed.discoveredEndingsByStory || {},
      storyBestTimes: parsed.storyBestTimes || {},
      storyBestScores: parsed.storyBestScores || {},
    };
  } catch {
    return getDefaultAdventureProgress();
  }
}

export function saveAdventureProgress(cefr: CefrLevel, data: LevelAdventureProgress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      `${ADVENTURE_STORAGE_KEY_PREFIX}${cefr}`,
      JSON.stringify(data)
    );
  } catch (err) {
    console.error("Failed to save adventure progress", err);
  }
}

export function recordAdventureCompletion(
  cefr: CefrLevel,
  storyId: string,
  endingId: string,
  timeSeconds: number,
  score: number
): { isNewEnding: boolean; totalStoryEndings: number; isLevelPassed: boolean } {
  const current = getAdventureProgress(cefr);

  // 1. Mark completed story
  if (!current.completedStoryIds.includes(storyId)) {
    current.completedStoryIds.push(storyId);
  }

  // 2. Add ending
  const endingsList = current.discoveredEndingsByStory[storyId] || [];
  const isNewEnding = !endingsList.includes(endingId);
  if (isNewEnding) {
    endingsList.push(endingId);
    current.discoveredEndingsByStory[storyId] = endingsList;
  }

  // 3. Best time
  const existingBestTime = current.storyBestTimes[storyId];
  if (!existingBestTime || timeSeconds < existingBestTime) {
    current.storyBestTimes[storyId] = timeSeconds;
  }

  // 4. Best score
  const existingBestScore = current.storyBestScores[storyId] || 0;
  if (score > existingBestScore) {
    current.storyBestScores[storyId] = score;
  }

  saveAdventureProgress(cefr, current);

  return {
    isNewEnding,
    totalStoryEndings: endingsList.length,
    isLevelPassed: current.completedStoryIds.length >= 2,
  };
}

export function isLevelAdventurePassed(cefr: CefrLevel): boolean {
  const progress = getAdventureProgress(cefr);
  return progress.completedStoryIds.length >= 2;
}

export function getStoryDiscoveredEndingsCount(cefr: CefrLevel, storyId: string): number {
  const progress = getAdventureProgress(cefr);
  return (progress.discoveredEndingsByStory[storyId] || []).length;
}

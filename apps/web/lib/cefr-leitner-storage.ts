"use client";

import type {
  CEFRLevel,
  LeitnerBoxLevel,
  CEFRWord,
  CEFRCardState,
  CEFRLevelStats,
} from "../data/cefr/types.ts";
import {
  LEITNER_INTERVALS,
  LEITNER_BOX_META,
  CEFR_LEVELS_META,
} from "../data/cefr/types.ts";
import { getVocabForLevel, getWordById } from "../data/cefr/index.ts";

const STORAGE_KEY_PREFIX = "endoora_cefr_deck_v2_";
const ACTIVE_LEVEL_KEY = "endoora_cefr_active_level_v2";
const EVENT_NAME = "endoora:cefr-leitner-updated";

/**
 * Check if running in browser
 */
function isClient(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

/**
 * Get active CEFR level
 */
export function getActiveCefrLevel(): CEFRLevel {
  if (!isClient()) return "A1";
  const stored = localStorage.getItem(ACTIVE_LEVEL_KEY) as CEFRLevel | null;
  if (stored && ["A1", "A2", "B1", "B2", "C1", "C2"].includes(stored)) {
    return stored;
  }
  return "A1";
}

/**
 * Set active CEFR level
 */
export function setActiveCefrLevel(level: CEFRLevel): void {
  if (!isClient()) return;
  localStorage.setItem(ACTIVE_LEVEL_KEY, level);
  notifyUpdate(level);
}

/**
 * Helper to notify listeners of storage changes
 */
function notifyUpdate(level: CEFRLevel): void {
  if (!isClient()) return;
  window.dispatchEvent(
    new CustomEvent(EVENT_NAME, {
      detail: { level, timestamp: Date.now() },
    })
  );
}

/**
 * Get raw deck object for a given level: Record<wordId, CEFRCardState>
 */
export function getLevelDeck(level: CEFRLevel): Record<string, CEFRCardState> {
  if (!isClient()) return {};
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${level}`);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to load CEFR deck for ${level}:`, err);
    return {};
  }
}

/**
 * Save raw deck object for a given level
 */
function saveLevelDeck(level: CEFRLevel, deck: Record<string, CEFRCardState>): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${level}`, JSON.stringify(deck));
    notifyUpdate(level);
  } catch (err) {
    console.error(`Failed to save CEFR deck for ${level}:`, err);
  }
}

/**
 * Check if a card is due for review today
 */
export function isCardDue(card: CEFRCardState): boolean {
  if (card.isMastered) {
    return new Date(card.nextReviewAt).getTime() <= Date.now();
  }
  return new Date(card.nextReviewAt).getTime() <= Date.now();
}

/**
 * Get all due cards for review in a specific level
 */
export function getDueCardsForLevel(
  level: CEFRLevel
): Array<{ card: CEFRCardState; word: CEFRWord }> {
  const deck = getLevelDeck(level);
  const dueItems: Array<{ card: CEFRCardState; word: CEFRWord }> = [];

  for (const card of Object.values(deck)) {
    if (isCardDue(card)) {
      const word = getWordById(level, card.wordId);
      if (word) {
        dueItems.push({ card, word });
      }
    }
  }

  dueItems.sort(
    (a, b) => new Date(a.card.nextReviewAt).getTime() - new Date(b.card.nextReviewAt).getTime()
  );

  return dueItems;
}

/**
 * Get all words that haven't been added to Leitner yet in a level
 */
export function getUnlearnedWordsForLevel(level: CEFRLevel): CEFRWord[] {
  const deck = getLevelDeck(level);
  const allWords = getVocabForLevel(level);
  return allWords.filter((w) => !deck[w.id]);
}

/**
 * Get words belonging to a specific lesson index
 */
export function getLessonWords(level: CEFRLevel, lessonIndex: number): CEFRWord[] {
  const allWords = getVocabForLevel(level);
  return allWords.filter((w) => w.lessonIndex === lessonIndex);
}

/**
 * Get total number of lessons for a level
 */
export function getTotalLessonsCount(level: CEFRLevel): number {
  const allWords = getVocabForLevel(level);
  if (allWords.length === 0) return 0;
  return Math.max(...allWords.map((w) => w.lessonIndex), 1);
}

/**
 * Find the next lesson that has unlearned words
 */
export function getNextAvailableLesson(level: CEFRLevel): {
  lessonIndex: number;
  words: CEFRWord[];
  unlearnedCount: number;
} {
  const deck = getLevelDeck(level);
  const allWords = getVocabForLevel(level);
  const totalLessons = getTotalLessonsCount(level);

  for (let l = 1; l <= totalLessons; l++) {
    const lessonWords = allWords.filter((w) => w.lessonIndex === l);
    const unlearned = lessonWords.filter((w) => !deck[w.id]);
    if (unlearned.length > 0) {
      return {
        lessonIndex: l,
        words: lessonWords,
        unlearnedCount: unlearned.length,
      };
    }
  }

  return {
    lessonIndex: 1,
    words: allWords.filter((w) => w.lessonIndex === 1),
    unlearnedCount: 0,
  };
}

/**
 * Add a new word to Box 1 (تازه‌واردها) after inductive study
 */
export function addWordToBox1(word: CEFRWord): CEFRCardState {
  const deck = getLevelDeck(word.level);
  const now = new Date();
  const nextReview = new Date(now.getTime() + LEITNER_INTERVALS[1] * 24 * 60 * 60 * 1000);

  const newCard: CEFRCardState = {
    wordId: word.id,
    level: word.level,
    boxLevel: 1,
    intervalDays: LEITNER_INTERVALS[1],
    lastReviewedAt: now.toISOString(),
    nextReviewAt: nextReview.toISOString(),
    consecutiveSuccesses: 1,
    lapseCount: 0,
    totalReviews: 1,
    isMastered: false,
    addedAt: now.toISOString(),
  };

  deck[word.id] = newCard;
  saveLevelDeck(word.level, deck);
  return newCard;
}

/**
 * Promote card to next box upon successful recall (1 -> 2 -> 3 -> 4 -> 5 / Mastered)
 */
export function promoteCard(level: CEFRLevel, wordId: string): CEFRCardState | null {
  const deck = getLevelDeck(level);
  const card = deck[wordId];
  if (!card) return null;

  const now = new Date();
  const nextLevel = Math.min(card.boxLevel + 1, 5) as LeitnerBoxLevel;
  const isMastered = nextLevel === 5;
  const intervalDays = LEITNER_INTERVALS[nextLevel];
  const nextReview = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

  const updated: CEFRCardState = {
    ...card,
    boxLevel: nextLevel,
    intervalDays,
    lastReviewedAt: now.toISOString(),
    nextReviewAt: nextReview.toISOString(),
    consecutiveSuccesses: card.consecutiveSuccesses + 1,
    totalReviews: card.totalReviews + 1,
    isMastered,
  };

  deck[wordId] = updated;
  saveLevelDeck(level, deck);
  return updated;
}

/**
 * Demote card back to Box 1 upon forgotten / failure (Classical Leitner Penalty)
 */
export function demoteCard(level: CEFRLevel, wordId: string): CEFRCardState | null {
  const deck = getLevelDeck(level);
  const card = deck[wordId];
  if (!card) return null;

  const now = new Date();
  const nextReview = new Date(now.getTime() + LEITNER_INTERVALS[1] * 24 * 60 * 60 * 1000);

  const updated: CEFRCardState = {
    ...card,
    boxLevel: 1,
    intervalDays: LEITNER_INTERVALS[1],
    lastReviewedAt: now.toISOString(),
    nextReviewAt: nextReview.toISOString(),
    consecutiveSuccesses: 0,
    lapseCount: card.lapseCount + 1,
    totalReviews: card.totalReviews + 1,
    isMastered: false,
  };

  deck[wordId] = updated;
  saveLevelDeck(level, deck);
  return updated;
}

/**
 * Reset progress of a specific card
 */
export function resetCardProgress(level: CEFRLevel, wordId: string): void {
  const deck = getLevelDeck(level);
  if (deck[wordId]) {
    delete deck[wordId];
    saveLevelDeck(level, deck);
  }
}

/**
 * Calculate statistics for a single level
 */
export function getLevelStats(level: CEFRLevel): CEFRLevelStats {
  const deck = getLevelDeck(level);
  const allWords = getVocabForLevel(level);
  const totalWords = allWords.length;

  const boxCounts: Record<LeitnerBoxLevel, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  let dueTodayCount = 0;
  let masteredCount = 0;
  let learnedCount = 0;

  for (const card of Object.values(deck)) {
    learnedCount++;
    boxCounts[card.boxLevel] = (boxCounts[card.boxLevel] || 0) + 1;
    if (isCardDue(card)) {
      dueTodayCount++;
    }
    if (card.isMastered || card.boxLevel === 5) {
      masteredCount++;
    }
  }

  const progressPercentage =
    totalWords > 0 ? Math.round((learnedCount / totalWords) * 100) : 0;

  return {
    level,
    totalWords,
    learnedCount,
    dueTodayCount,
    boxCounts,
    masteredCount,
    progressPercentage,
  };
}

/**
 * Calculate stats across all 6 CEFR levels
 */
export function getAllLevelsStats(): Record<CEFRLevel, CEFRLevelStats> {
  return {
    A1: getLevelStats("A1"),
    A2: getLevelStats("A2"),
    B1: getLevelStats("B1"),
    B2: getLevelStats("B2"),
    C1: getLevelStats("C1"),
    C2: getLevelStats("C2"),
  };
}

/**
 * Initialize starter seed words in Box 1 for A1 if totally empty
 */
export function seedInitialCardsIfEmpty(): void {
  if (!isClient()) return;
  const a1Deck = getLevelDeck("A1");
  if (Object.keys(a1Deck).length > 0) return;

  const a1Words = getVocabForLevel("A1");
  if (a1Words.length === 0) return;

  const now = new Date();
  const seedSlice = a1Words.slice(0, 10);
  const initialDeck: Record<string, CEFRCardState> = {};

  seedSlice.forEach((word, idx) => {
    const isDue = idx < 4;
    const nextReview = isDue
      ? new Date(now.getTime() - 1000).toISOString()
      : new Date(now.getTime() + ((idx % 3) + 1) * 24 * 3600 * 1000).toISOString();

    const boxLevel = (idx === 0 ? 2 : 1) as LeitnerBoxLevel;

    initialDeck[word.id] = {
      wordId: word.id,
      level: "A1",
      boxLevel,
      intervalDays: LEITNER_INTERVALS[boxLevel],
      lastReviewedAt: now.toISOString(),
      nextReviewAt: nextReview,
      consecutiveSuccesses: boxLevel === 2 ? 1 : 0,
      lapseCount: 0,
      totalReviews: 1,
      isMastered: false,
      addedAt: now.toISOString(),
    };
  });

  saveLevelDeck("A1", initialDeck);
}

export { LEITNER_INTERVALS, LEITNER_BOX_META, CEFR_LEVELS_META };

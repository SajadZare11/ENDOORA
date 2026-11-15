import type { CEFRLevel, CEFRWord, CEFRCardState } from "../../data/cefr/types.ts";
import {
  getLevelDeck,
  getWordById,
  getAllLevelsStats,
} from "../cefr-leitner-storage.ts";
import { DktEngine } from "./dkt-engine.ts";

export interface CefrLevelRetention {
  level: CEFRLevel;
  totalWords: number;
  learnedCount: number;
  masteredCount: number;
  dueCount: number;
  currentRecallProb: number; // 0.0 - 1.0
  projectedDecay7Days: number; // 0.0 - 1.0
  vulnerableCardsCount: number; // Cards with estimated recall < 0.65
  status: "mastered" | "spaced_retrieval_zpd" | "decaying";
}

export interface OverallVocabTelemetry {
  overallRetentionIndex: number; // 0 - 100%
  totalCriticalZpdWords: number;
  totalMasteredWords: number;
  averageCognitiveSpeedMs: number;
  levels: Record<CEFRLevel, CefrLevelRetention>;
  lastUpdated: number;
}

const VOCAB_LATENCY_KEY = "endoora_vocab_cognitive_latencies_v1";

/**
 * Calculates estimated recall probability for a card based on Ebbinghaus decay,
 * box level, and days elapsed since last review.
 */
export function estimateCardRecallProbability(card: CEFRCardState): number {
  const now = Date.now();
  const lastReviewed = card.lastReviewedAt ? new Date(card.lastReviewedAt).getTime() : now;
  const elapsedDays = Math.max(0, (now - lastReviewed) / (1000 * 60 * 60 * 24));

  // Decay lambda decreases as box level increases (higher box = slower forgetting)
  // Box 1: lambda = 0.22, Box 2: 0.12, Box 3: 0.07, Box 4: 0.04, Box 5: 0.02
  const lambdas: Record<number, number> = {
    1: 0.22,
    2: 0.12,
    3: 0.07,
    4: 0.04,
    5: 0.02,
  };
  const lambda = lambdas[card.boxLevel] || 0.15;

  // Recall probability: P(t) = P0 * exp(-lambda * t)
  const baseProb = 0.92;
  const prob = baseProb * Math.exp(-lambda * elapsedDays);
  return Math.max(0.08, Math.min(1.0, prob));
}

/**
 * Computes CEFR level retention and 7-day projected decay across all 6 levels.
 */
export function computeCefrVocabularyRetention(): OverallVocabTelemetry {
  const allStats = getAllLevelsStats();
  const levelsList: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

  let totalProbSum = 0;
  let totalCriticalZpd = 0;
  let totalMastered = 0;

  const levels = {} as Record<CEFRLevel, CefrLevelRetention>;

  for (const lvl of levelsList) {
    const stats = allStats[lvl];
    const deck = getLevelDeck(lvl);
    const cards = Object.values(deck);

    let levelProbSum = 0;
    let vulnerableCount = 0;

    if (cards.length > 0) {
      for (const c of cards) {
        const p = estimateCardRecallProbability(c);
        levelProbSum += p;
        if (p < 0.65) {
          vulnerableCount++;
        }
      }
    }

    // If no cards learned yet, default to baseline 0.50 (neutral readiness)
    const currentRecall = cards.length > 0 ? levelProbSum / cards.length : 0.5;

    // Projected decay in 7 days without practice
    // Average lambda for the level deck
    const avgLambda = 0.08;
    const projected7Days = Number((currentRecall * Math.exp(-avgLambda * 7)).toFixed(3));

    let status: CefrLevelRetention["status"] = "spaced_retrieval_zpd";
    if (currentRecall >= 0.75) status = "mastered";
    else if (currentRecall < 0.42) status = "decaying";

    levels[lvl] = {
      level: lvl,
      totalWords: stats.totalWords,
      learnedCount: stats.learnedCount,
      masteredCount: stats.masteredCount,
      dueCount: stats.dueTodayCount,
      currentRecallProb: Number(currentRecall.toFixed(3)),
      projectedDecay7Days: projected7Days,
      vulnerableCardsCount: vulnerableCount,
      status,
    };

    totalProbSum += currentRecall;
    totalCriticalZpd += vulnerableCount;
    totalMastered += stats.masteredCount;
  }

  const overallRetentionIndex = Math.round((totalProbSum / levelsList.length) * 100);

  // Retrieve cognitive latency telemetry
  let averageCognitiveSpeedMs = 1850;
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    try {
      const stored = localStorage.getItem(VOCAB_LATENCY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          averageCognitiveSpeedMs = Math.round(
            parsed.reduce((a, b) => a + b, 0) / parsed.length
          );
        }
      }
    } catch {
      // ignore
    }
  }

  return {
    overallRetentionIndex,
    totalCriticalZpdWords: totalCriticalZpd,
    totalMasteredWords: totalMastered,
    averageCognitiveSpeedMs,
    levels,
    lastUpdated: Date.now(),
  };
}

/**
 * Returns cards for a level sorted by vulnerability (lowest recall probability first).
 * Prioritizes cards in Box 1 and 2 or cards due for review.
 */
export function getCriticalDecayCardsForLevel(
  level: CEFRLevel
): Array<{ card: CEFRCardState; word: CEFRWord; estimatedRecall: number }> {
  const deck = getLevelDeck(level);
  const items: Array<{ card: CEFRCardState; word: CEFRWord; estimatedRecall: number }> = [];

  for (const card of Object.values(deck)) {
    const word = getWordById(level, card.wordId);
    if (word) {
      const estimatedRecall = estimateCardRecallProbability(card);
      items.push({ card, word, estimatedRecall });
    }
  }

  // Sort by lowest recall first (highest risk of forgetting)
  items.sort((a, b) => a.estimatedRecall - b.estimatedRecall);
  return items;
}

/**
 * Records a cognitive review result in active recall arena.
 * Updates DKT state and average cognitive latency history.
 */
export function recordLeitnerActiveRecallResult(
  wordId: string,
  level: CEFRLevel,
  latencyMs: number,
  isKnown: boolean
): void {
  // 1. Update cognitive latency rolling window
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    try {
      const raw = localStorage.getItem(VOCAB_LATENCY_KEY);
      const list: number[] = raw ? JSON.parse(raw) : [];
      list.push(latencyMs);
      const trimmed = list.slice(-30); // keep last 30 interactions
      localStorage.setItem(VOCAB_LATENCY_KEY, JSON.stringify(trimmed));
    } catch {
      // ignore
    }
  }

  // 2. Feed interaction into DKT neural engine
  try {
    const engine = DktEngine.getInstance();
    const conceptId = `${level.toLowerCase()}-01`;
    engine.recordInteraction({
      conceptId,
      isCorrect: isKnown,
      isTrap: false,
      latencyMs,
    });
  } catch {
    // ignore
  }
}

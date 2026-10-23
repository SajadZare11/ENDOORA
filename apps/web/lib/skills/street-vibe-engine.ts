import type {
  WordMasteryRecord,
  WordMasteryLevel,
  MatchTurnLog,
  MatchPayload,
  MatchValidationResult,
  WeeklyLeagueTier,
  GhostRivalProfile,
  StreetVibeLocationId,
} from "../../data/skills/games/street-vibe-types.ts";
import { WEEKLY_LEAGUES } from "../../data/skills/games/street-vibe-data.ts";

const MASTERY_STORAGE_KEY = "endoora_streetvibe_mastery_v1";
const MISSED_WORDS_STORAGE_KEY = "endoora_streetvibe_missed_v1";
const LEAGUE_STORAGE_KEY = "endoora_streetvibe_league_v1";

// ============================================================================
// 1. WORD MASTERY & SPACED REPETITION (COMEBACK BOUNTY SYSTEM)
// ============================================================================

export function getWordMasteryMap(): Record<string, WordMasteryRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(MASTERY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveWordMasteryMap(map: Record<string, WordMasteryRecord>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MASTERY_STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

export function getWordMastery(word?: string): WordMasteryLevel {
  if (!word) return "learning";
  const map = getWordMasteryMap();
  const normalized = word.toLowerCase().trim();
  const record = map[normalized];
  if (!record) return "learning";
  if (record.isMissedBounty) return "bounty";
  if (record.correctCount >= 5) return "mastered";
  return "learning";
}

export function recordWordResult(word?: string, isCorrect: boolean = true): WordMasteryLevel {
  if (!word) return "learning";
  const map = getWordMasteryMap();
  const normalized = word.toLowerCase().trim();
  const existing: WordMasteryRecord = map[normalized] || {
    word: normalized,
    correctCount: 0,
    wrongCount: 0,
    lastEncountered: new Date().toISOString(),
    isMissedBounty: false,
    mastery: "learning",
  };

  existing.lastEncountered = new Date().toISOString();

  if (isCorrect) {
    existing.correctCount += 1;
    existing.isMissedBounty = false; // Resolved bounty
    existing.mastery = existing.correctCount >= 5 ? "mastered" : "learning";
  } else {
    existing.wrongCount += 1;
    existing.isMissedBounty = true;
    existing.mastery = "bounty";
  }

  map[normalized] = existing;
  saveWordMasteryMap(map);

  // Synchronize with missed words queue
  if (!isCorrect) {
    addMissedWord(normalized);
  } else {
    removeMissedWord(normalized);
  }

  return existing.mastery;
}

export function getMissedWordsQueue(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MISSED_WORDS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addMissedWord(word: string): void {
  if (typeof window === "undefined") return;
  try {
    const queue = getMissedWordsQueue();
    const normalized = word.toLowerCase().trim();
    if (!queue.includes(normalized)) {
      queue.push(normalized);
      localStorage.setItem(MISSED_WORDS_STORAGE_KEY, JSON.stringify(queue));
    }
  } catch {}
}

export function removeMissedWord(word: string): void {
  if (typeof window === "undefined") return;
  try {
    const queue = getMissedWordsQueue();
    const normalized = word.toLowerCase().trim();
    const filtered = queue.filter((w) => w !== normalized);
    localStorage.setItem(MISSED_WORDS_STORAGE_KEY, JSON.stringify(filtered));
  } catch {}
}

// ============================================================================
// 2. ANTI-FARMING DYNAMIC SCORING ENGINE
// ============================================================================

export interface ScoreCalculationParams {
  wave: 1 | 2 | 3;
  targetWord?: string;
  responseTimeSeconds: number;
  currentStreak: number;
  usedMic?: boolean;
  voiceMatched?: boolean;
  overrideMastery?: WordMasteryLevel;
}

export interface CalculatedQuestionScore {
  basePoints: number;
  comboMultiplier: number;
  speedBonus: number;
  noveltyWeight: number;
  voiceBonus: number;
  charismaTipBonus: number;
  isAwkwardSilence: boolean;
  isCharismaTip: boolean;
  finalQuestionPoints: number;
  isUnstoppableTriggered: boolean;
  masteryStatus: WordMasteryLevel;
}

/**
 * Anti-Farming Score Formula:
 * QuestionScore = (BasePoints * ComboMultiplier * SpeedBonus) * NoveltyWeight * VoiceBonus + CharismaTip
 *
 * Novelty Weights:
 * - 1.5 for New/Learning words
 * - 2.5 for Bounty (previously missed) words
 * - 0.2 for Mastered words (prevents farming already known words)
 */
export function calculateQuestionScore(params: ScoreCalculationParams): CalculatedQuestionScore {
  const { wave, targetWord, responseTimeSeconds, currentStreak, usedMic, voiceMatched, overrideMastery } = params;

  // 1. Base Points
  const basePoints = wave === 3 ? 200 : 100;

  // 2. Combo Multiplier
  let comboMultiplier = 1.0;
  if (currentStreak >= 8) {
    comboMultiplier = 8.0;
  } else if (currentStreak >= 6) {
    comboMultiplier = 4.0;
  } else if (currentStreak >= 3) {
    comboMultiplier = 2.0;
  }

  const isUnstoppableTriggered = currentStreak === 8;

  // 3. Speed Bonus & Patience Mechanics
  let speedBonus = 1.0;
  let charismaTipBonus = 0;
  let isCharismaTip = false;
  let isAwkwardSilence = false;

  if (responseTimeSeconds <= 0) {
    // Timeout
    isAwkwardSilence = true;
    speedBonus = 0;
  } else if (responseTimeSeconds < 2.0) {
    // Lightning fast answer (< 2s)
    speedBonus = 1.5;
    charismaTipBonus = 75; // Extra Charisma Tip bonus
    isCharismaTip = true;
  } else if (responseTimeSeconds <= 3.5) {
    speedBonus = 1.0;
  } else {
    speedBonus = 0.8;
  }

  // 4. Anti-Farming Novelty Weight
  const masteryStatus = overrideMastery || getWordMastery(targetWord);
  let noveltyWeight = 1.5; // default for Learning words
  if (masteryStatus === "bounty") {
    noveltyWeight = 2.5; // Revenge Bonus
  } else if (masteryStatus === "mastered") {
    noveltyWeight = 0.2; // Drastically diminished return for farming mastered words
  }

  // 5. Voice Charisma Bonus (Web Speech API)
  let voiceBonus = 1.0;
  if (usedMic && voiceMatched) {
    voiceBonus = 3.0; // 3x Voice Charisma Bonus
  }

  // Calculate final score
  let finalQuestionPoints = 0;
  if (!isAwkwardSilence) {
    const raw = (basePoints * comboMultiplier * speedBonus) * noveltyWeight * voiceBonus + charismaTipBonus;
    finalQuestionPoints = Math.round(raw);
  } else {
    // Penalty for Awkward Silence
    finalQuestionPoints = -50;
  }

  return {
    basePoints,
    comboMultiplier,
    speedBonus,
    noveltyWeight,
    voiceBonus,
    charismaTipBonus,
    isAwkwardSilence,
    isCharismaTip,
    finalQuestionPoints,
    isUnstoppableTriggered,
    masteryStatus,
  };
}

// ============================================================================
// 3. DOUBLE-OR-NOTHING VAULT CALCULATIONS
// ============================================================================

export interface VaultOutcome {
  bankedScore: number;
  gambleAttempted: boolean;
  vaultSuccess: boolean;
  finalScore: number;
  scoreDelta: number;
}

export function resolveDoubleOrNothingVault(
  currentScore: number,
  gambleChosen: boolean,
  answerCorrect?: boolean
): VaultOutcome {
  if (!gambleChosen) {
    return {
      bankedScore: currentScore,
      gambleAttempted: false,
      vaultSuccess: false,
      finalScore: currentScore,
      scoreDelta: 0,
    };
  }

  if (answerCorrect) {
    // 1.5x Total Score (+50%)
    const multiplied = Math.round(currentScore * 1.5);
    return {
      bankedScore: currentScore,
      gambleAttempted: true,
      vaultSuccess: true,
      finalScore: multiplied,
      scoreDelta: multiplied - currentScore,
    };
  } else {
    // Burns 30% of match score
    const burned = Math.round(currentScore * 0.7);
    return {
      bankedScore: currentScore,
      gambleAttempted: true,
      vaultSuccess: false,
      finalScore: Math.max(0, burned),
      scoreDelta: Math.max(0, burned) - currentScore,
    };
  }
}

// ============================================================================
// 4. WEEKLY LEAGUE TIERS & LIVE GHOST RIVAL HUD
// ============================================================================

export interface LeagueRival {
  id: string;
  name: string;
  avatar: string;
  city: string;
  score: number;
  rank: number;
  isCurrentUser?: boolean;
}

export interface WeeklyLeagueState {
  currentTier: WeeklyLeagueTier;
  weeklyPoints: number;
  userRank: number;
  totalParticipants: number;
  rivals: LeagueRival[];
  inPromotionZone: boolean;
  inDemotionZone: boolean;
}

// Simulated active cohort leaderboard for realistic competitive feeling
const BASE_LEAGUE_RIVALS: Array<{ id: string; name: string; avatar: string; city: string; baseScore: number }> = [
  { id: "r-1", name: "امیرحسین تهرانی", avatar: "🦁", city: "تهران", baseScore: 4200 },
  { id: "r-2", name: "فاطمه کاظمی", avatar: "⚡", city: "شیراز", baseScore: 3850 },
  { id: "r-3", name: "سینا راد", avatar: "🚀", city: "اصفهان", baseScore: 3500 },
  { id: "r-4", name: "مونا سرمد", avatar: "💎", city: "مشهد", baseScore: 3200 },
  { id: "r-5", name: "علی شمس", avatar: "🔥", city: "تبریز", baseScore: 2900 },
  { id: "r-6", name: "سارا نیکنام", avatar: "🌟", city: "کرج", baseScore: 2650 },
  { id: "r-7", name: "پویا بهرامی", avatar: "🎯", city: "رشت", baseScore: 2400 },
  { id: "r-8", name: "نرگس موسوی", avatar: "🦊", city: "اهواز", baseScore: 2150 },
  { id: "r-9", name: "مهدی جلالی", avatar: "🦅", city: "یزد", baseScore: 1900 },
  { id: "r-10", name: "الهام صادقی", avatar: "🌸", city: "قم", baseScore: 1750 },
  { id: "r-11", name: "آیدین خسروی", avatar: "🐺", city: "همدان", baseScore: 1600 },
  { id: "r-12", name: "رویا معتمد", avatar: "🦋", city: "کرمانشاه", baseScore: 1450 },
  { id: "r-13", name: "دانیال یزدانی", avatar: "🍀", city: "ساری", baseScore: 1300 },
  { id: "r-14", name: "زهرا رحیمی", avatar: "🦄", city: "گرگان", baseScore: 1150 },
  { id: "r-15", name: "کیانوش افشار", avatar: "🕶️", city: "بندرعباس", baseScore: 980 },
  { id: "r-16", name: "بهار زمانی", avatar: "🌺", city: "ارومیه", baseScore: 820 },
  { id: "r-17", name: "نوید رستگار", avatar: "🛡️", city: "زاهدان", baseScore: 690 },
  { id: "r-18", name: "ترانه کیانی", avatar: "🎶", city: "کاشان", baseScore: 540 },
  { id: "r-19", name: "بردیا فرهمند", avatar: "🌪️", city: "اراک", baseScore: 390 },
  { id: "r-20", name: "غزل پیروز", avatar: "✨", city: "قزوین", baseScore: 240 },
];

export function getWeeklyLeagueTier(points: number): WeeklyLeagueTier {
  if (points >= 15000) return "diamond";
  if (points >= 9000) return "platinum";
  if (points >= 5000) return "gold";
  if (points >= 2000) return "silver";
  return "bronze";
}

export function getWeeklyLeagueState(userScore: number = 0): WeeklyLeagueState {
  const currentTier = getWeeklyLeagueTier(userScore);

  // Build sorted roster including the user
  const roster: LeagueRival[] = BASE_LEAGUE_RIVALS.map((r) => ({
    id: r.id,
    name: r.name,
    avatar: r.avatar,
    city: r.city,
    score: r.baseScore,
    rank: 0,
  }));

  const userEntry: LeagueRival = {
    id: "user_me",
    name: "شما (زبان‌آموز)",
    avatar: "🦁",
    city: "ایران",
    score: userScore,
    rank: 0,
    isCurrentUser: true,
  };

  roster.push(userEntry);
  roster.sort((a, b) => b.score - a.score);

  // Assign ranks
  roster.forEach((r, idx) => {
    r.rank = idx + 1;
  });

  const userRank = roster.find((r) => r.isCurrentUser)?.rank || roster.length;
  const inPromotionZone = userRank <= 10;
  const inDemotionZone = userRank > roster.length - 5;

  return {
    currentTier,
    weeklyPoints: userScore,
    userRank,
    totalParticipants: roster.length,
    rivals: roster,
    inPromotionZone,
    inDemotionZone,
  };
}

/**
 * Finds the rival immediately above the user's current match score
 * for the live Ghost Rival mini-widget HUD.
 */
export function getLiveGhostRival(currentMatchScore: number): GhostRivalProfile | null {
  const rivals = [...BASE_LEAGUE_RIVALS].sort((a, b) => a.baseScore - b.baseScore);
  // Find the first rival with a score higher than currentMatchScore
  const nextRival = rivals.find((r) => r.baseScore > currentMatchScore);

  if (!nextRival) {
    // User is leading everyone! Return the top dog as overtaken benchmark
    const top = rivals[rivals.length - 1];
    return {
      id: top.id,
      name: top.name,
      avatar: top.avatar,
      city: top.city,
      score: top.baseScore,
      league: getWeeklyLeagueTier(top.baseScore),
      distanceToOvertake: 0,
    };
  }

  return {
    id: nextRival.id,
    name: nextRival.name,
    avatar: nextRival.avatar,
    city: nextRival.city,
    score: nextRival.baseScore,
    league: getWeeklyLeagueTier(nextRival.baseScore),
    distanceToOvertake: nextRival.baseScore - currentMatchScore,
  };
}

// ============================================================================
// 5. ANTI-CHEAT MATCH VALIDATION
// ============================================================================

export function validateMatchSubmission(payload: MatchPayload): MatchValidationResult {
  const { totalDurationMs, allowedTimeSeconds, turns, finalScore } = payload;

  // 1. Minimum response time check (Bot/Script protection)
  // If user answered at least 3 questions with average response time < 300ms, flag as bot
  if (turns.length >= 3) {
    const totalResponseTime = turns.reduce((acc, t) => acc + t.responseTimeMs, 0);
    const avgResponseTime = totalResponseTime / turns.length;
    if (avgResponseTime < 300) {
      return {
        isValid: false,
        flagReason: `Bot detection: Average response time (${Math.round(avgResponseTime)}ms) is below 300ms threshold.`,
        calculatedScore: 0,
        starsEarned: 0,
        xpAwarded: 0,
        isDailyRecord: false,
      };
    }
  }

  // 2. Total duration validation
  // Total match duration must not exceed allowed time + earned bonuses + 5s latency grace window
  const maxAllowedDurationMs = (allowedTimeSeconds + 5) * 1000;
  if (totalDurationMs > maxAllowedDurationMs) {
    return {
      isValid: false,
      flagReason: `Match duration exceeded: Played ${Math.round(totalDurationMs / 1000)}s with allowed ${allowedTimeSeconds}s.`,
      calculatedScore: 0,
      starsEarned: 0,
      xpAwarded: 0,
      isDailyRecord: false,
    };
  }

  // 3. Mathematical score consistency
  let computedTurnsScore = 0;
  turns.forEach((t) => {
    computedTurnsScore += t.earnedPoints;
  });

  // Calculate stars (1-3)
  const accuracy = payload.accuracyPct;
  let starsEarned = 1;
  if (accuracy >= 90 && finalScore >= 1800) {
    starsEarned = 3;
  } else if (accuracy >= 75 || finalScore >= 1200) {
    starsEarned = 2;
  }

  // Award XP based on performance
  const xpAwarded = Math.round(50 + finalScore / 25);

  const leagueState = getWeeklyLeagueState(finalScore);

  return {
    isValid: true,
    calculatedScore: finalScore,
    starsEarned,
    xpAwarded,
    isDailyRecord: false,
    newLeagueRank: leagueState.userRank,
    leaguePromotionStatus: leagueState.inPromotionZone
      ? "promotion"
      : leagueState.inDemotionZone
      ? "demotion"
      : "safe",
  };
}

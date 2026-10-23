import type { CefrLevel } from "./types";

export type StreetVibeLocationId = "cafe" | "airport" | "city" | "shopping" | "party";

export type NpcReactionMood =
  | "happy"
  | "shocked_laugh"
  | "confused_smirk"
  | "facepalm"
  | "sarcastic_smile"
  | "crying_laugh"
  | "wide_eyed"
  | "proud"
  | "impatient";

export interface StreetVibeLocation {
  id: StreetVibeLocationId;
  titleFa: string;
  titleEn: string;
  icon: string;
  themeColor: string;
  themeBgGradient: string;
  stages: [number, number]; // [startStage, endStage]
  taglineFa: string;
  descriptionFa: string;
  a1LexicalFocus: string[];
}

export interface StreetVibeWave1Option {
  text: string;
  isCorrect: boolean;
  npcReaction: string;
  npcReactionMood: NpcReactionMood;
}

export interface StreetVibeWave1Item {
  id: string;
  locationId: StreetVibeLocationId;
  wave: 1;
  cefrLevel: CefrLevel; // "A1"
  stageNumber: number; // 1 to 10
  targetWord: string;
  targetChunk?: string;
  npcName: string;
  npcAvatar: string;
  npcLine: string;
  playerTemplate: string; // e.g. "Can I have a ___ latte, please?"
  options: [StreetVibeWave1Option, StreetVibeWave1Option, StreetVibeWave1Option];
  fullSentenceText: string; // For Web Speech Recognition comparison
  hintFa?: string;
  comedyExplanationFa?: string;
}

export interface StreetVibeTrayItem {
  id: string;
  nameEn: string;
  nameFa: string;
  icon: string;
  category: string;
}

export interface StreetVibeWave2Item {
  id: string;
  locationId: StreetVibeLocationId;
  wave: 2;
  cefrLevel: CefrLevel; // "A1"
  stageNumber: number; // 1 to 10
  targetWord: string;
  npcName: string;
  npcAvatar: string;
  npcRequestLine: string; // Spoken request with 0 translation
  targetItemIds: string[]; // 1 or 2 items requested
  trayItems: [
    StreetVibeTrayItem,
    StreetVibeTrayItem,
    StreetVibeTrayItem,
    StreetVibeTrayItem,
    StreetVibeTrayItem,
    StreetVibeTrayItem
  ];
  npcSuccessReaction: string;
  npcWrongReaction: string;
  hintFa?: string;
}

export interface StreetVibeWave3ChainTurn {
  step: 1 | 2 | 3 | 4;
  phase: "greeting" | "question" | "problem" | "goodbye";
  npcLine: string;
  playerTemplate: string;
  targetWord: string;
  options: [StreetVibeWave1Option, StreetVibeWave1Option, StreetVibeWave1Option];
  fullSentenceText: string;
  timeLimitSeconds: number; // fast: 4.0 - 5.0s
}

export interface StreetVibeWave3BossFight {
  id: string;
  locationId: StreetVibeLocationId;
  wave: 3;
  cefrLevel: CefrLevel; // "A1"
  stageNumber: number; // 1 to 10
  bossName: string;
  bossAvatar: string;
  bossRoleFa: string;
  introLine: string;
  feverTheme: string;
  turns: [
    StreetVibeWave3ChainTurn,
    StreetVibeWave3ChainTurn,
    StreetVibeWave3ChainTurn,
    StreetVibeWave3ChainTurn
  ];
  completionBonus: number;
}

export interface StreetVibeVaultQuestion {
  id: string;
  locationId: StreetVibeLocationId;
  targetWord: string;
  npcName: string;
  npcAvatar: string;
  npcLine: string;
  playerTemplate: string;
  options: [StreetVibeWave1Option, StreetVibeWave1Option, StreetVibeWave1Option];
  vaultPromptFa: string;
  explanationFa: string;
}

export interface StreetVibeStage {
  stageNumber: number; // 1 to 10
  locationId: StreetVibeLocationId;
  titleFa: string;
  titleEn: string;
  taglineFa: string;
  descriptionFa: string;
  a1VocabFocus: string[];
  xpReward: number;
  passThresholdPoints: number;
  wave1Items: StreetVibeWave1Item[];
  wave2Items: StreetVibeWave2Item[];
  wave3Boss: StreetVibeWave3BossFight;
  vaultQuestion: StreetVibeVaultQuestion;
}

// User Spaced Repetition & Mastery State
export type WordMasteryLevel = "learning" | "bounty" | "mastered";

export interface WordMasteryRecord {
  word: string;
  correctCount: number;
  wrongCount: number;
  lastEncountered: string; // ISO date
  isMissedBounty: boolean;
  mastery: WordMasteryLevel;
}

export interface MatchTurnLog {
  turnIndex: number;
  wave: 1 | 2 | 3;
  questionId: string;
  targetWord: string;
  shownAt: number; // timestamp ms
  answeredAt: number; // timestamp ms
  responseTimeMs: number;
  isCorrect: boolean;
  selectedText: string;
  usedMic: boolean;
  voiceConfidence?: number;
  noveltyWeight: number;
  comboMultiplier: number;
  speedBonus: number;
  earnedPoints: number;
}

export interface MatchPayload {
  stageNumber: number;
  locationId: StreetVibeLocationId;
  startedAt: number;
  finishedAt: number;
  totalDurationMs: number;
  allowedTimeSeconds: number; // 90s + bonus
  turns: MatchTurnLog[];
  finalScore: number;
  accuracyPct: number;
  correctTurns: number;
  totalTurns: number;
  unstoppableCount: number;
  vaultAttempted: boolean;
  vaultSuccess?: boolean;
}

export interface MatchValidationResult {
  isValid: boolean;
  flagReason?: string;
  calculatedScore: number;
  starsEarned: number;
  xpAwarded: number;
  isDailyRecord: boolean;
  newLeagueRank?: number;
  leaguePromotionStatus?: "promotion" | "demotion" | "safe";
}

export type WeeklyLeagueTier = "bronze" | "silver" | "gold" | "platinum" | "diamond";

export interface WeeklyLeagueConfig {
  tier: WeeklyLeagueTier;
  titleFa: string;
  titleEn: string;
  badge: string;
  minPoints: number;
  promotionRank: number; // top 10
  demotionRank: number; // bottom 5
  accentColor: string;
}

export interface GhostRivalProfile {
  id: string;
  name: string;
  avatar: string;
  city: string;
  score: number;
  league: WeeklyLeagueTier;
  distanceToOvertake: number;
}

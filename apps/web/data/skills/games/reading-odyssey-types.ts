import type { CefrLevel } from "./types";

export type OdysseyTheme = "magic-academy" | "secret-lab" | "interstellar-command";

export type OdysseyEndingCategory =
  | "legendary"
  | "heroic"
  | "secret"
  | "funny"
  | "cautionary"
  | "diplomatic"
  | "explorer"
  | "escape"
  | "scholar"
  | "paradox";

export interface OdysseyEnding {
  id: number; // 1 to 10
  category: OdysseyEndingCategory;
  badgeIcon: string;
  badgeLabelFa: string;
  titleEn: string;
  titleFa: string;
  descriptionEn: string;
  descriptionFa: string;
  xpReward: number;
}

export interface OdysseySpeedGate {
  questionEn: string;
  questionFa: string;
  options: string[];
  correctIndex: number;
  evidenceSnippet: string;
  explanationFa: string;
  timeLimitSeconds: number;
}

export interface OdysseyChoice {
  id: string;
  textEn: string;
  textFa: string;
  targetEndingId: number; // 1 to 10
  pathSummaryEn: string;
  pathSummaryFa: string;
}

export interface OdysseyStory {
  id: string; // e.g. "ro-a1-s1-1"
  storyIndex: number; // 1 to 10
  stageLevelNumber: number; // 1 to 10
  cefr: CefrLevel;
  theme: OdysseyTheme;
  titleEn: string;
  titleFa: string;
  synopsisFa: string;
  passage: string;
  wordCount: number;
  speedGate: OdysseySpeedGate;
  choices: OdysseyChoice[];
  endings: OdysseyEnding[]; // exactly 10 unique endings
}

export interface OdysseyStage {
  levelNumber: number; // 1 to 10
  cefr: CefrLevel;
  theme: OdysseyTheme;
  themeTitleFa: string;
  stageTitleEn: string;
  stageTitleFa: string;
  descriptionFa: string;
  stories: OdysseyStory[]; // exactly 10 stories
}

export interface OdysseyStoryProgress {
  discoveredEndingIds: number[];
  bestScore: number;
  fastestSeconds: number;
  flawlessRuns: number;
  totalPlays: number;
}

export interface OdysseyCompletionResult {
  cefr: CefrLevel;
  levelNumber: number;
  storyIndex: number;
  endingId: number;
  endingCategory: OdysseyEndingCategory;
  isNewEnding: boolean;
  totalEndingsDiscoveredForStory: number;
  heartsRemaining: number;
  speedBonus: number;
  baseXp: number;
  finalScore: number;
  stars: number;
}

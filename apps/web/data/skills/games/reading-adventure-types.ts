import type { CefrLevel } from "./types";

export type AdventureGenre =
  | "comedy"
  | "mystery"
  | "travel"
  | "scifi"
  | "rescue"
  | "music"
  | "cinema"
  | "celebrity";

export type EndingBadgeCategory =
  | "legendary"
  | "heroic"
  | "funny"
  | "secret"
  | "explorer"
  | "scholar"
  | "cautionary";

export interface AdventureKeyword {
  word: string;
  meaningFa: string;
  phonetic?: string;
}

export interface AdventureQuestion {
  promptEn: string;
  promptFa: string;
  options: string[];
  correctIndex: number;
  hintSnippet: string; // Sentence in passage containing clue
  clueFa: string; // Friendly hint shown when hearts <= 2
}

export interface AdventureChoice {
  id: "A" | "B";
  labelEn: string;
  labelFa: string;
  descriptionFa: string;
  nextNodeId?: string;
  endingId?: string;
}

export interface AdventureNode {
  id: string;
  stepNumber: number; // 1 to 5
  pathCode: string; // e.g. "root", "A", "B", "AA", "AB", etc.
  passageEn: string;
  keywords: AdventureKeyword[];
  question: AdventureQuestion;
  choices: [AdventureChoice, AdventureChoice]; // Exactly 2 choices
}

export interface AdventureEnding {
  id: string; // e.g. "ending-1" to "ending-32"
  pathCode: string; // e.g. "AAAAA", "AAAAB", etc.
  titleEn: string;
  titleFa: string;
  badgeCategory: EndingBadgeCategory;
  badgeIcon: string;
  badgeNameFa: string;
  climaxEn: string;
  climaxFa: string;
  xpReward: number;
}

export interface AdventureStory {
  id: string;
  storyIndex: number; // 1 to 5
  cefr: CefrLevel;
  titleEn: string;
  titleFa: string;
  genre: AdventureGenre;
  genreLabelFa: string;
  genreIcon: string;
  synopsisFa: string;
  synopsisEn: string;
  coverImage: string;
  rootNodeId: string;
  nodes: Record<string, AdventureNode>;
  endings: Record<string, AdventureEnding>; // Exactly 32 endings
}

export interface LevelAdventureProgress {
  completedStoryIds: string[]; // Story IDs completed by user
  discoveredEndingsByStory: Record<string, string[]>; // storyId -> array of discovered ending IDs
  storyBestTimes: Record<string, number>;
  storyBestScores: Record<string, number>;
}

import type { CefrLevel } from "./types";

export type WritingTheme = "word-bot-factory" | "noir-evidence-board" | "cyber-intel-dossier";

export type WritingPillar =
  | "word-order-punctuation"
  | "connectors-cohesion"
  | "paragraph-register"
  | "academic-inversion"
  | "master-investigation";

// Round 1: Tile Arrangement & Fragment Puzzle
export interface WritingFragmentRound {
  id: string;
  roundTitleFa: string;
  promptFa: string;
  promptEn: string;
  hintFa: string;
  goldenRuleFa: string;
  scrambledChips: Array<{
    id: string;
    text: string;
    isDistractor?: boolean;
    distractorReasonFa?: string;
  }>;
  correctSequence: string[]; // chip texts in correct order
  assembledSentence: string;
}

// Round 2: Evidence Connector & Lexical Upgrade
export interface WritingConnectorRound {
  id: string;
  roundTitleFa: string;
  contextFa: string;
  sentenceA: string;
  sentenceB: string;
  targetSlot: string; // The joined text showing the placeholder e.g. "The suspect fled. [___], the weapon was left behind."
  connectorOptions: Array<{
    text: string;
    isCorrect: boolean;
    explanationFa: string;
    isTrap?: boolean;
  }>;
  lexicalUpgrade?: {
    originalWord: string;
    promptFa: string;
    upgrades: Array<{
      text: string;
      isCorrect: boolean;
      explanationFa: string;
    }>;
  };
}

// Round 3: Punchline Typing / Boss Completion
export interface WritingPunchlineRound {
  id: string;
  roundTitleFa: string;
  briefFa: string;
  briefEn: string;
  templateSentence: string; // Sentence with blank
  targetBlank: string;      // Expected typed words
  acceptableAnswers: string[]; // Variations for robust validation
  typingHintFa: string;
  explanationFa: string;
  quickChips?: string[]; // Clickable helper chips for faster typing on mobile
}

// Full 3-Round Case Stage
export interface WritingStageCase {
  levelNumber: number; // 1 to 10
  cefr: CefrLevel;
  theme: WritingTheme;
  themeTitleFa: string;
  caseCode: string;
  stageTitleEn: string;
  stageTitleFa: string;
  scenarioFa: string;
  locationFa: string;
  pillar: WritingPillar;
  xpReward: number;
  timeLimitSeconds: number;
  isBossStage?: boolean;

  // The 3 investigative rounds
  round1: WritingFragmentRound;
  round2: WritingConnectorRound;
  round3: WritingPunchlineRound;
}

// Result of solving a case
export interface WritingCaseResult {
  cefr: CefrLevel;
  levelNumber: number;
  caseCode: string;
  finalScore: number;
  accuracyPct: number;
  speedBonus: number;
  stylePoints: number;
  comboStreak: number;
  stars: number; // 1 to 3
  xpEarned: number;
  passed: boolean;
  timeSpentSeconds: number;
  isDailyBounty: boolean;
  magnifierNotesUnlocked: string[];
}

// Daily Golden Bounty
export interface DailyBountyMeta {
  cefr: CefrLevel;
  levelNumber: number;
  caseCode: string;
  titleFa: string;
  bountyBonusXp: number;
  taglineFa: string;
}

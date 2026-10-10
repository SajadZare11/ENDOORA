export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type SkillKey = "vocabulary" | "grammar" | "listening" | "reading" | "writing" | "speaking";

export type GameEngineType =
  | "vocab-blitz"
  | "chunk-fill"
  | "dialogue-reply"
  | "syntax-architect"
  | "audio-detective"
  | "speed-reader"
  | "sentence-smith"
  | "voice-echo";

export interface DialogueSpeaker {
  name: string;
  avatar?: string;
  text: string;
  roleFa?: string;
}

export interface GameQuestion {
  id: string;
  type?: GameEngineType;
  prompt: string;
  promptFa?: string;
  options?: string[];
  correctAnswer?: number | string; // index (0-3) or exact string
  scrambledTokens?: string[]; // for syntax-architect
  correctOrder?: string[]; // for syntax-architect
  audioText?: string; // pronunciation text for TTS
  passage?: string; // for speed-reader
  targetSentence?: string; // for sentence-smith and voice-echo
  hintFa?: string;
  explanationFa: string;
  contextTagFa?: string; // e.g. "در کافه", "فرودگاه", "موقعیت روزمره"
  speakerA?: DialogueSpeaker; // for dialogue-reply turn
}

export interface GameLevel {
  levelNumber: number; // 1 to 10
  cefr: CefrLevel;
  skill: SkillKey;
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  xpReward: number;
  timeLimitSeconds?: number;
  stageFocus?: "words" | "chunks" | "dialogues"; // pedagogical tier
  questions: GameQuestion[];
}

export interface LevelResult {
  levelNumber: number;
  cefr: CefrLevel;
  skill: SkillKey;
  score: number; // percentage 0-100 or final points
  stars: number; // 0 to 3
  xpEarned: number;
  passed: boolean; // score >= 70
}

export interface VocabRushResult {
  levelNumber: number;
  cefr: CefrLevel;
  skill: SkillKey;
  finalScore: number; // limitless points
  accuracy: number; // 0 to 100 percentage
  correctCount: number;
  totalAnswered: number;
  maxStreak: number;
  timeSurvivedSeconds: number;
  passed: boolean; // accuracy >= 70 and totalAnswered >= 5
  stars: number; // 1 to 3 stars
  xpEarned: number;
  isDailyRecord: boolean;
  missedQuestions: GameQuestion[];
}

export interface SkillProgressData {
  unlockedLevel: number; // 1 to 10
  stars: Record<number, number>; // levelNumber -> stars (0-3)
  highScores: Record<number, number>; // levelNumber -> score percentage or points
  bestPoints?: Record<number, number>; // levelNumber -> highest raw points achieved
  totalXp: number;
}

export type AllSkillsProgress = Record<SkillKey, Record<CefrLevel, SkillProgressData>>;

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  city: string;
  cefrLevel: CefrLevel;
  score: number; // current score for the scope (daily, weekly, all-time, or global XP)
  totalXp: number;
  starsCount: number;
  streakDays: number;
  rank: number;
  isCurrentUser?: boolean;
  bestStreak?: number;
  bestTimeSeconds?: number;
  honoraryBadge?: string;
  grammarTitle?: string;
  trapsDisarmed?: number;
}

export type LeaderboardPeriod = "daily" | "weekly" | "all-time";
export type LeaderboardScope = "level" | "global";

// Hexagonal Edge-Based Grammar Routing Types
export interface HexEdgeOption {
  id: string;
  text: string;
  isCorrect: boolean;
  isTrap?: boolean; // Persian L1 error trap
  trapExplanationFa?: string; // Concise Persian explanation of the L1 error
  isBranchingClause?: boolean; // Leads to a longer/more complex grammatical structure
  comboBoost?: number;
  nextNodeId?: string; // Destination node ID when this edge is routed
}

export interface HexCircuitNode {
  id: string;
  stepIndex: number;
  label?: string; // Current node token / accumulated fragment
  options: HexEdgeOption[];
  isGoal?: boolean;
}

export interface GrammarCircuitRound {
  id: string;
  titleFa: string;
  titleEn: string;
  targetConcept: string;
  aefReference: string; // e.g. "AEF Starter Unit 3B", "AEF 5 Unit 6A"
  startingPrompt: string;
  translationFa: string;
  nodes: HexCircuitNode[];
  branchingExplanationFa?: string;
}

export interface GrammarStageData {
  levelNumber: number;
  cefr: CefrLevel;
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  aefUnit: string;
  circuits: GrammarCircuitRound[];
}

export interface GrammarCircuitResult {
  levelNumber: number;
  cefr: CefrLevel;
  finalScore: number;
  cleanStreak: number;
  speedrunSeconds: number;
  trapsDisarmed: number;
  wonDualRace: boolean;
  accuracy: number;
  stars: number;
  xpEarned: number;
  honoraryTitle?: string;
}

// Speaking Mission & Voice Arena Types
export interface SpeakingKeywordObjective {
  id: string;
  phrase: string;
  phoneticOrHintFa: string;
  weight: number;
}

export interface SpeakingVocabUpgrade {
  learnerPhrase: string;
  nativeUpgrade: string;
  explanationFa: string;
  audioText: string;
}

export interface SpeakingTurn {
  turnNumber: number; // 1, 2, or 3
  characterSpeaker: DialogueSpeaker;
  idealResponse: {
    text: string;
    audioText?: string;
    explanationFa: string;
  };
  keywords: SpeakingKeywordObjective[];
  fallbackOptions: string[];
  vocabUpgrades: SpeakingVocabUpgrade[];
  reactionWindowSeconds: number;
}

export interface SpeakingGhostProfile {
  name: string;
  avatar: string;
  city: string;
  reactionTimeAvg: number;
  targetScore: number;
  wpm: number;
  title: string;
}

export interface SpeakingMission {
  levelNumber: number;
  cefr: CefrLevel;
  titleFa: string;
  titleEn: string;
  scenarioFa: string;
  locationContextFa: string;
  xpReward: number;
  timeLimitTotalSeconds: number;
  minPassScore: number;
  ghostRival: SpeakingGhostProfile;
  turns: SpeakingTurn[];
}

export interface SpeakingEvaluationResult {
  levelNumber: number;
  cefr: CefrLevel;
  finalScore: number;
  passed: boolean;
  stars: number;
  xpEarned: number;
  wpm: number;
  hesitationsCount: number;
  accuracyPct: number;
  fluencyPct: number;
  keywordsFound: string[];
  totalKeywordsCount: number;
  avgReactionSeconds: number;
  beatGhostRival: boolean;
  awardedBadges: string[];
  vocabUpgrades: SpeakingVocabUpgrade[];
  usedEmergencyFallback: boolean;
}


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
}

export type LeaderboardPeriod = "daily" | "weekly" | "all-time";
export type LeaderboardScope = "level" | "global";

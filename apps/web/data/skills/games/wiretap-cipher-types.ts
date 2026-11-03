import type { CefrLevel } from "./types";

export type WiretapAccent = "en-GB" | "en-US" | "en-AU" | "en-IE";

export type WiretapNoiseLevel = "low" | "medium" | "heavy";

export interface WiretapSpeaker {
  name: string;
  roleFa: string;
  accent: WiretapAccent;
}

export interface LiveInterceptWord {
  id: string;
  word: string;
  timeOffsetSeconds?: number;
  isDistractor?: boolean; // false = genuine code word in audio, true = decoy
  explanationFa: string;
}

export interface BurntTranscriptGap {
  id: string;
  beforeText: string;
  afterText: string;
  correctWord: string;
  options: string[];
  explanationFa: string;
}

export interface WiretapDeductionQuestion {
  questionFa: string;
  optionsFa: string[];
  correctOptionIndex: number;
  explanationFa: string;
}

export interface WiretapStage {
  levelNumber: number; // 1 to 10
  cefr: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  caseCode: string; // e.g. "CASE-B1-01"
  tapeCode: string; // e.g. "REEL #B1-01"
  caseTitleFa: string;
  caseTitleEn: string;
  mysterySeriesTitleFa: string;
  locationFa: string;
  targetFrequencyMHz: number; // Frequency to tune into, e.g. 94.6
  speaker: WiretapSpeaker;
  secondarySpeaker?: WiretapSpeaker;
  speechRate: number; // 0.9 to 1.3
  noiseLevel: WiretapNoiseLevel;
  xpReward: number;
  timeLimitSeconds: number;
  
  // Audio Content
  audioScriptEn: string; // Full transcript to be spoken by TTS or played
  audioScriptFa: string; // Persian translation of the intercepted call
  audioUrl?: string; // Natural Neural MP3 URL (e.g. /audio/skills/listening/a1-01.mp3)
  
  // 4 Interactive Gameplay Vectors:
  // Phase 1: Frequency Tuner (uses targetFrequencyMHz)
  
  // Phase 2: Live Word Intercept
  interceptWords: LiveInterceptWord[]; // Words to catch while tape is rolling
  requiredInterceptCount: number; // Minimum genuine words needed to crack phase 2
  
  // Phase 3: Burnt Transcript Reconstruction
  burntGaps: BurntTranscriptGap[];
  
  // Phase 4: Detective Deduction
  deduction: WiretapDeductionQuestion;

  // Narrative Dossier & Story Context
  sherlockBriefingFa?: string; // دست‌خط و بریفینگ شرلوک هولمز
  suspectAliasFa?: string; // نام مستعار یا عنوان مظنون
  suspectBioFa?: string; // بیوگرافی و انگیزه مظنون
  missionStakesFa?: string; // ریسک و خطر امنیتی در صورت لو رفتن شنود
  aftermathReportFa?: string; // گزارش میدانی پلیس اسکاتلندیارد پس از موفقیت
  cliffhangerFa?: string; // سرنخ متصل‌کننده به مرحله یا سطح بعدی
}

export interface WiretapCompletionResult {
  caseCode: string;
  finalScore: number;
  accuracyPct: number;
  signalIntegrity: number; // 0-100%
  stars: number; // 1 to 3
  xpEarned: number;
  passed: boolean;
  timeSpentSeconds: number;
}

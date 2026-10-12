import type {
  CefrLevel,
  SkillKey,
  SkillProgressData,
  AllSkillsProgress,
  LeaderboardEntry,
  LeaderboardPeriod,
  VocabRushResult,
} from "../../data/skills/games/types";

const STORAGE_KEY = "endoora_skills_progress_v1";
const LEADERBOARD_USER_KEY = "endoora_skills_user_profile_v1";
const DAILY_RECORDS_KEY = "endoora_skills_daily_records_v1";
const BEST_POINTS_KEY = "endoora_skills_best_points_v1";
const BEST_TIME_KEY = "endoora_skills_best_time_v1";

export const CEFR_ORDER: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

const DEFAULT_SKILL_PROGRESS: SkillProgressData = {
  unlockedLevel: 1,
  stars: {},
  highScores: {},
  bestPoints: {},
  totalXp: 0,
};

// ==========================================
// 1. UNIVERSAL STANDARDIZED SCORING ENGINE
// (معیار نمره در همه سطح‌ها یکسان است)
// ==========================================
export interface ScoreCalcResult {
  points: number;
  speedBonus: number;
  multiplier: number;
  isFever: boolean;
}

export function calculateQuestionScore(timeSpentSeconds: number, streak: number): ScoreCalcResult {
  const basePoints = 100;
  let speedBonus = 0;

  if (timeSpentSeconds <= 1.2) {
    speedBonus = 50; // Lightning fast reaction
  } else if (timeSpentSeconds <= 2.5) {
    speedBonus = 20; // Swift answer
  }

  let multiplier = 1.0;
  let isFever = false;

  if (streak >= 10) {
    multiplier = 3.0; // FEVER MODE!
    isFever = true;
  } else if (streak >= 7) {
    multiplier = 2.0;
  } else if (streak >= 4) {
    multiplier = 1.5;
  }

  const points = Math.round((basePoints + speedBonus) * multiplier);

  return { points, speedBonus, multiplier, isFever };
}

// ==========================================
// 2. PROGRESSION & LOCAL STORAGE
// ==========================================
export function getDefaultProgress(): AllSkillsProgress {
  const skills: SkillKey[] = ["vocabulary", "grammar", "listening", "reading", "writing", "speaking"];
  const progress: Partial<AllSkillsProgress> = {};

  for (const skill of skills) {
    progress[skill] = {
      A1: { ...DEFAULT_SKILL_PROGRESS },
      A2: { ...DEFAULT_SKILL_PROGRESS, unlockedLevel: 0 },
      B1: { ...DEFAULT_SKILL_PROGRESS, unlockedLevel: 0 },
      B2: { ...DEFAULT_SKILL_PROGRESS, unlockedLevel: 0 },
      C1: { ...DEFAULT_SKILL_PROGRESS, unlockedLevel: 0 },
      C2: { ...DEFAULT_SKILL_PROGRESS, unlockedLevel: 0 },
    };
  }

  return progress as AllSkillsProgress;
}

export function loadAllSkillsProgress(): AllSkillsProgress {
  if (typeof window === "undefined") {
    return getDefaultProgress();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    const parsed = JSON.parse(raw);
    return { ...getDefaultProgress(), ...parsed };
  } catch {
    return getDefaultProgress();
  }
}

export function saveAllSkillsProgress(progress: AllSkillsProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // ignore
  }
}

export function getSkillProgress(skill: SkillKey, cefr: CefrLevel): SkillProgressData {
  const all = loadAllSkillsProgress();
  return all[skill]?.[cefr] || { ...DEFAULT_SKILL_PROGRESS, unlockedLevel: cefr === "A1" ? 1 : 0 };
}

// ==========================================
// 3. DAILY RECORD & BEST POINTS TRACKING
// ==========================================
export function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getDailyRecords(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(DAILY_RECORDS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getLevelDailyHighScore(skill: SkillKey, cefr: CefrLevel): number {
  const records = getDailyRecords();
  const key = `${getTodayKey()}_${skill}_${cefr}`;
  return records[key] || 0;
}

export function saveLevelDailyHighScore(skill: SkillKey, cefr: CefrLevel, score: number): boolean {
  if (typeof window === "undefined") return false;
  try {
    const records = getDailyRecords();
    const key = `${getTodayKey()}_${skill}_${cefr}`;
    const previous = records[key] || 0;
    if (score > previous) {
      records[key] = score;
      localStorage.setItem(DAILY_RECORDS_KEY, JSON.stringify(records));
      return true; // Broke daily record!
    }
  } catch {}
  return false;
}

export function getStageBestPoints(skill: SkillKey, cefr: CefrLevel, stageNum: number): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(BEST_POINTS_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    return parsed[`${skill}_${cefr}_${stageNum}`] || 0;
  } catch {
    return 0;
  }
}

export function saveStageBestPoints(skill: SkillKey, cefr: CefrLevel, stageNum: number, points: number): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(BEST_POINTS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const key = `${skill}_${cefr}_${stageNum}`;
    if ((parsed[key] || 0) < points) {
      parsed[key] = points;
      localStorage.setItem(BEST_POINTS_KEY, JSON.stringify(parsed));
    }
  } catch {}
}

export function getStageBestTime(skill: SkillKey, cefr: CefrLevel, stageNum: number): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(BEST_TIME_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    return parsed[`${skill}_${cefr}_${stageNum}`] || 0;
  } catch {
    return 0;
  }
}

export function saveStageBestTime(
  skill: SkillKey,
  cefr: CefrLevel,
  stageNum: number,
  timeSeconds: number
): boolean {
  if (typeof window === "undefined" || timeSeconds <= 0) return false;
  try {
    const raw = localStorage.getItem(BEST_TIME_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const key = `${skill}_${cefr}_${stageNum}`;
    const prevBest = parsed[key] || 0;
    // Lower completion time is superior
    if (prevBest === 0 || timeSeconds < prevBest) {
      parsed[key] = timeSeconds;
      localStorage.setItem(BEST_TIME_KEY, JSON.stringify(parsed));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function formatStopwatchTime(seconds: number): string {
  if (!seconds || seconds <= 0) return "00:00.0";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const tenths = Math.floor((seconds % 1) * 10);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${tenths}`;
}

// ==========================================
// 4. LEVEL & RUSH COMPLETION HANDLERS
// ==========================================
export interface SaveOutcome {
  unlockedNextLevel: boolean;
  unlockedNextCefr: boolean;
  newStarsEarned: number;
  xpEarned: number;
  newTotalXp: number;
  isDailyRecord: boolean;
}

export function recordVocabRushCompletion(
  skill: SkillKey,
  cefr: CefrLevel,
  levelNumber: number,
  finalScore: number,
  accuracy: number,
  correctCount: number,
  totalAnswered: number,
  baseXp: number
): SaveOutcome {
  const all = loadAllSkillsProgress();
  const currentSkillCefr = all[skill]?.[cefr] || { ...DEFAULT_SKILL_PROGRESS, unlockedLevel: cefr === "A1" ? 1 : 0 };

  // Pass condition: accuracy >= 70% and at least 5 answered
  const passed = accuracy >= 70 && totalAnswered >= 5;

  let stars = 0;
  if (accuracy >= 95 && finalScore >= 1200) stars = 3;
  else if (accuracy >= 85 || finalScore >= 800) stars = 2;
  else if (passed) stars = 1;

  const previousStars = currentSkillCefr.stars[levelNumber] || 0;
  const newStarsEarned = Math.max(0, stars - previousStars);

  // Proportional XP scaled by performance and accuracy
  let xpEarned = 0;
  if (passed) {
    const multiplier = accuracy / 100;
    xpEarned = Math.round(baseXp * multiplier + Math.min(finalScore * 0.1, 80));
  } else {
    // Consolation XP for effort
    xpEarned = Math.max(10, Math.round(finalScore * 0.05));
  }

  // Update stars and scores
  currentSkillCefr.stars[levelNumber] = Math.max(previousStars, stars);
  currentSkillCefr.highScores[levelNumber] = Math.max(currentSkillCefr.highScores[levelNumber] || 0, accuracy);
  if (!currentSkillCefr.bestPoints) currentSkillCefr.bestPoints = {};
  currentSkillCefr.bestPoints[levelNumber] = Math.max(currentSkillCefr.bestPoints[levelNumber] || 0, finalScore);
  currentSkillCefr.totalXp += xpEarned;

  // Save best points in dedicated store
  saveStageBestPoints(skill, cefr, levelNumber, finalScore);

  // Check if daily record was broken
  const isDailyRecord = saveLevelDailyHighScore(skill, cefr, finalScore);

  let unlockedNextLevel = false;
  let unlockedNextCefr = false;

  if (passed) {
    if (levelNumber < 10) {
      if (currentSkillCefr.unlockedLevel <= levelNumber) {
        currentSkillCefr.unlockedLevel = levelNumber + 1;
        unlockedNextLevel = true;
      }
    } else if (levelNumber === 10) {
      // Unlocked the next CEFR tier!
      const currentCefrIndex = CEFR_ORDER.indexOf(cefr);
      if (currentCefrIndex >= 0 && currentCefrIndex < CEFR_ORDER.length - 1) {
        const nextCefr = CEFR_ORDER[currentCefrIndex + 1];
        if (all[skill][nextCefr].unlockedLevel < 1) {
          all[skill][nextCefr].unlockedLevel = 1;
          unlockedNextCefr = true;
        }
      }
    }
  }

  all[skill][cefr] = currentSkillCefr;
  saveAllSkillsProgress(all);

  return {
    unlockedNextLevel,
    unlockedNextCefr,
    newStarsEarned,
    xpEarned,
    newTotalXp: calculateGrandTotalXp(all),
    isDailyRecord,
  };
}

export function recordSpeedDialogueCompletion(
  skill: SkillKey,
  cefr: CefrLevel,
  levelNumber: number,
  finalTimeSeconds: number,
  accuracy: number,
  correctTurns: number,
  totalTurns: number,
  baseXp: number = 150
): SaveOutcome & { isTimeRecord: boolean; timeString: string } {
  // Speed calculation: faster completion yields higher points for universal progression
  // Baseline ~60s yields ~1000pts; Sub-30s yields ~1600pts
  const speedPoints = Math.max(250, Math.round(2200 - Math.min(finalTimeSeconds, 90) * 18));
  const isTimeRecord = saveStageBestTime(skill, cefr, levelNumber, finalTimeSeconds);
  const outcome = recordVocabRushCompletion(
    skill,
    cefr,
    levelNumber,
    speedPoints,
    accuracy,
    correctTurns,
    totalTurns,
    baseXp
  );

  return {
    ...outcome,
    isTimeRecord,
    timeString: formatStopwatchTime(finalTimeSeconds),
  };
}

export function recordLevelCompletion(
  skill: SkillKey,
  cefr: CefrLevel,
  levelNumber: number,
  scorePercentage: number,
  baseXp: number
): SaveOutcome {
  return recordVocabRushCompletion(
    skill,
    cefr,
    levelNumber,
    scorePercentage * 10,
    scorePercentage,
    Math.round(scorePercentage / 10),
    10,
    baseXp
  );
}

export function recordGrammarHexCompletion(
  cefr: CefrLevel,
  levelNumber: number,
  result: {
    finalScore: number;
    cleanStreak: number;
    speedrunSeconds: number;
    trapsDisarmed: number;
    wonDualRace: boolean;
    accuracy: number;
    stars: number;
  },
  baseXp: number = 100
): SaveOutcome {
  if (result.speedrunSeconds > 0) {
    saveStageBestTime("grammar", cefr, levelNumber, result.speedrunSeconds);
  }
  return recordVocabRushCompletion(
    "grammar",
    cefr,
    levelNumber,
    result.finalScore,
    result.accuracy,
    Math.round((result.accuracy / 100) * 10),
    10,
    baseXp
  );
}

export function recordSpeakingMissionCompletion(
  cefr: CefrLevel,
  levelNumber: number,
  finalScore: number,
  accuracyPct: number,
  fluencyPct: number,
  wpm: number,
  baseXp: number = 80
): SaveOutcome {
  saveStageBestPoints("speaking", cefr, levelNumber, finalScore);
  return recordVocabRushCompletion(
    "speaking",
    cefr,
    levelNumber,
    finalScore,
    accuracyPct,
    Math.round((accuracyPct / 100) * 10),
    10,
    baseXp
  );
}


export function recordReadingOdysseyCompletion(
  cefr: CefrLevel,
  levelNumber: number,
  storyIndex: number,
  endingId: number,
  result: {
    finalScore: number;
    heartsRemaining: number;
    speedBonus: number;
    stars: number;
    elapsedSeconds?: number;
    baseXp?: number;
  }
): SaveOutcome & { isNewEnding: boolean; totalStoryEndings: number } {
  const endingOutcome = recordDiscoveredEnding(cefr, levelNumber, storyIndex, endingId);
  saveStageBestPoints("reading", cefr, levelNumber, result.finalScore);

  if (result.elapsedSeconds !== undefined && result.elapsedSeconds > 0) {
    saveStageBestTime("reading", cefr, levelNumber, result.elapsedSeconds);
  }

  const baseXp = result.baseXp || 80;
  const accuracy = result.heartsRemaining === 3 ? 100 : result.heartsRemaining === 2 ? 85 : 70;
  const scaledScore = result.heartsRemaining === 3 ? 1300 : result.heartsRemaining === 2 ? 900 : 700;

  const outcome = recordVocabRushCompletion(
    "reading",
    cefr,
    levelNumber,
    scaledScore,
    accuracy,
    Math.round((accuracy / 100) * 10),
    10,
    baseXp
  );

  return {
    ...outcome,
    isNewEnding: endingOutcome.isNew,
    totalStoryEndings: endingOutcome.totalForStory,
  };
}

const LAST_PLAYED_STORY_KEY = "endoora_reading_last_played_v1";

export function getLastPlayedStoryIndex(cefr: CefrLevel, stageNum: number): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = sessionStorage.getItem(LAST_PLAYED_STORY_KEY) || localStorage.getItem(LAST_PLAYED_STORY_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    return parsed[`${cefr}_${stageNum}`] || 0;
  } catch {
    return 0;
  }
}

export function setLastPlayedStoryIndex(cefr: CefrLevel, stageNum: number, storyIndex: number): void {
  if (typeof window === "undefined") return;
  try {
    const raw = sessionStorage.getItem(LAST_PLAYED_STORY_KEY) || localStorage.getItem(LAST_PLAYED_STORY_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[`${cefr}_${stageNum}`] = storyIndex;
    sessionStorage.setItem(LAST_PLAYED_STORY_KEY, JSON.stringify(parsed));
    localStorage.setItem(LAST_PLAYED_STORY_KEY, JSON.stringify(parsed));
  } catch {}
}

const WRITING_CASES_STORAGE_KEY = "endoora_writing_clue_cases_v1";

export function getWritingSolvedCases(cefr: CefrLevel): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WRITING_CASES_STORAGE_KEY);
    if (!raw) return [];
    const map: Record<string, string[]> = JSON.parse(raw);
    return map[cefr] || [];
  } catch {
    return [];
  }
}

export function recordWritingCaseCompletion(
  cefr: CefrLevel,
  levelNumber: number,
  result: {
    caseCode: string;
    finalScore: number;
    accuracyPct: number;
    speedBonus: number;
    stylePoints: number;
    stars: number;
    passed: boolean;
    baseXp?: number;
    isDailyBounty?: boolean;
  }
): SaveOutcome {
  saveStageBestPoints("writing", cefr, levelNumber, result.finalScore);

  // Store solved case code
  if (typeof window !== "undefined" && result.passed) {
    try {
      const raw = localStorage.getItem(WRITING_CASES_STORAGE_KEY);
      const map: Record<string, string[]> = raw ? JSON.parse(raw) : {};
      const list = map[cefr] || [];
      if (!list.includes(result.caseCode)) {
        list.push(result.caseCode);
        map[cefr] = list;
        localStorage.setItem(WRITING_CASES_STORAGE_KEY, JSON.stringify(map));
      }
    } catch {}
  }

  const baseXp = result.baseXp || (result.isDailyBounty ? 160 : 90);
  return recordVocabRushCompletion(
    "writing",
    cefr,
    levelNumber,
    result.finalScore,
    result.accuracyPct,
    Math.round((result.accuracyPct / 100) * 10),
    10,
    baseXp
  );
}

const READING_ENDINGS_STORAGE_KEY = "endoora_reading_odyssey_endings_v1";

export function getDiscoveredEndings(
  cefr: CefrLevel,
  levelNumber: number,
  storyIndex: number
): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(READING_ENDINGS_STORAGE_KEY);
    if (!raw) return [];
    const map: Record<string, number[]> = JSON.parse(raw);
    const key = `${cefr}_l${levelNumber}_s${storyIndex}`;
    return map[key] || [];
  } catch {
    return [];
  }
}

export function recordDiscoveredEnding(
  cefr: CefrLevel,
  levelNumber: number,
  storyIndex: number,
  endingId: number
): { isNew: boolean; totalForStory: number } {
  if (typeof window === "undefined") return { isNew: false, totalForStory: 0 };
  try {
    const raw = localStorage.getItem(READING_ENDINGS_STORAGE_KEY);
    const map: Record<string, number[]> = raw ? JSON.parse(raw) : {};
    const key = `${cefr}_l${levelNumber}_s${storyIndex}`;
    const current = map[key] || [];
    const isNew = !current.includes(endingId);
    if (isNew) {
      current.push(endingId);
      current.sort((a, b) => a - b);
      map[key] = current;
      localStorage.setItem(READING_ENDINGS_STORAGE_KEY, JSON.stringify(map));
    }
    return { isNew, totalForStory: current.length };
  } catch {
    return { isNew: false, totalForStory: 0 };
  }
}

export function getStageDiscoveredEndingsCount(cefr: CefrLevel, levelNumber: number): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(READING_ENDINGS_STORAGE_KEY);
    if (!raw) return 0;
    const map: Record<string, number[]> = JSON.parse(raw);
    let count = 0;
    for (let s = 1; s <= 10; s++) {
      const key = `${cefr}_l${levelNumber}_s${s}`;
      count += (map[key] || []).length;
    }
    return count;
  } catch {
    return 0;
  }
}

export function getTotalReadingEndingsDiscovered(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(READING_ENDINGS_STORAGE_KEY);
    if (!raw) return 0;
    const map: Record<string, number[]> = JSON.parse(raw);
    let total = 0;
    for (const list of Object.values(map)) {
      total += list.length;
    }
    return total;
  } catch {
    return 0;
  }
}

export function calculateGrandTotalXp(all?: AllSkillsProgress): number {
  const progress = all || loadAllSkillsProgress();
  let total = 0;
  for (const skill of Object.keys(progress) as SkillKey[]) {
    for (const cefr of CEFR_ORDER) {
      total += progress[skill]?.[cefr]?.totalXp || 0;
    }
  }
  return total;
}

export function calculateTotalStars(all?: AllSkillsProgress): number {
  const progress = all || loadAllSkillsProgress();
  let stars = 0;
  for (const skill of Object.keys(progress) as SkillKey[]) {
    for (const cefr of CEFR_ORDER) {
      const levelStars = progress[skill]?.[cefr]?.stars || {};
      for (const s of Object.values(levelStars)) {
        stars += s;
      }
    }
  }
  return stars;
}

export function calculateCefrTotalXp(cefr: CefrLevel, all?: AllSkillsProgress): number {
  const progress = all || loadAllSkillsProgress();
  let total = 0;
  const skills: SkillKey[] = ["vocabulary", "grammar", "listening", "reading", "writing", "speaking"];
  for (const skill of skills) {
    total += progress[skill]?.[cefr]?.totalXp || 0;
  }
  return total;
}

// ==========================================
// 5. USER PROFILE & DUAL LEADERBOARD SYSTEM
// ==========================================
export interface LocalUserProfile {
  nickname: string;
  avatar: string;
  city: string;
}

export function getLocalUserProfile(): LocalUserProfile {
  if (typeof window === "undefined") {
    return { nickname: "شما (زبان‌آموز)", avatar: "🦁", city: "ایران" };
  }
  try {
    const raw = localStorage.getItem(LEADERBOARD_USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { nickname: "شما (زبان‌آموز)", avatar: "🦁", city: "ایران" };
}

export function saveLocalUserProfile(profile: LocalUserProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LEADERBOARD_USER_KEY, JSON.stringify(profile));
  } catch {}
}

// Cohort learners with realistic base stats across CEFR levels
interface PeerLearnerConfig {
  id: string;
  name: string;
  avatar: string;
  city: string;
  cefrLevel: CefrLevel;
  basePointsPerLevel: Partial<Record<CefrLevel, number>>;
  baseSpeeds?: Partial<Record<"C1" | "C2", number>>; // Speed in seconds for C1/C2
  totalXp: number;
  streakDays: number;
}

const PEER_LEARNERS: PeerLearnerConfig[] = [
  // --- A1 Cohort ---
  {
    id: "p-a1-1",
    name: "پریا احمدی",
    avatar: "🎯",
    city: "مشهد",
    cefrLevel: "A1",
    basePointsPerLevel: { A1: 1885 },
    totalXp: 1885,
    streakDays: 14,
  },
  {
    id: "p-a1-2",
    name: "آرش دلاور",
    avatar: "🔥",
    city: "کرج",
    cefrLevel: "A1",
    basePointsPerLevel: { A1: 1690 },
    totalXp: 1690,
    streakDays: 10,
  },
  {
    id: "p-a1-3",
    name: "نگین صادقی",
    avatar: "💎",
    city: "رشت",
    cefrLevel: "A1",
    basePointsPerLevel: { A1: 1520 },
    totalXp: 1520,
    streakDays: 8,
  },
  {
    id: "p-a1-4",
    name: "پارسا کاظمی",
    avatar: "⚡",
    city: "تهران",
    cefrLevel: "A1",
    basePointsPerLevel: { A1: 1350 },
    totalXp: 1350,
    streakDays: 6,
  },
  {
    id: "p-a1-5",
    name: "یلدا رستمی",
    avatar: "🌟",
    city: "اصفهان",
    cefrLevel: "A1",
    basePointsPerLevel: { A1: 1210 },
    totalXp: 1210,
    streakDays: 5,
  },
  {
    id: "p-a1-6",
    name: "آرتین جعفری",
    avatar: "🚀",
    city: "شیراز",
    cefrLevel: "A1",
    basePointsPerLevel: { A1: 1040 },
    totalXp: 1040,
    streakDays: 3,
  },

  // --- A2 Cohort ---
  {
    id: "p-a2-1",
    name: "علی رضایی",
    avatar: "⚡",
    city: "اصفهان",
    cefrLevel: "A2",
    basePointsPerLevel: { A2: 2180, A1: 1750 },
    totalXp: 3930,
    streakDays: 19,
  },
  {
    id: "p-a2-2",
    name: "نیما شایان",
    avatar: "🚀",
    city: "تبریز",
    cefrLevel: "A2",
    basePointsPerLevel: { A2: 1980, A1: 1620 },
    totalXp: 3600,
    streakDays: 15,
  },
  {
    id: "p-a2-3",
    name: "روژان سعیدی",
    avatar: "🌸",
    city: "سنندج",
    cefrLevel: "A2",
    basePointsPerLevel: { A2: 1840, A1: 1530 },
    totalXp: 3370,
    streakDays: 12,
  },
  {
    id: "p-a2-4",
    name: "بردیا مهرابی",
    avatar: "🦁",
    city: "تهران",
    cefrLevel: "A2",
    basePointsPerLevel: { A2: 1690 },
    totalXp: 2890,
    streakDays: 9,
  },
  {
    id: "p-a2-5",
    name: "النا حسینی",
    avatar: "💎",
    city: "قم",
    cefrLevel: "A2",
    basePointsPerLevel: { A2: 1540 },
    totalXp: 2640,
    streakDays: 7,
  },
  {
    id: "p-a2-6",
    name: "سینا رادپور",
    avatar: "🎯",
    city: "کرمانشاه",
    cefrLevel: "A2",
    basePointsPerLevel: { A2: 1380 },
    totalXp: 2380,
    streakDays: 5,
  },

  // --- B1 Cohort ---
  {
    id: "p-b1-1",
    name: "سارا محمدی",
    avatar: "👩‍🚀",
    city: "تهران",
    cefrLevel: "B1",
    basePointsPerLevel: { B1: 2450, A2: 1950, A1: 1800 },
    totalXp: 6200,
    streakDays: 28,
  },
  {
    id: "p-b1-2",
    name: "کیان راد",
    avatar: "🦉",
    city: "اهواز",
    cefrLevel: "B1",
    basePointsPerLevel: { B1: 2280, A2: 1810, A1: 1650 },
    totalXp: 5740,
    streakDays: 22,
  },
  {
    id: "p-b1-3",
    name: "هیراد شمس",
    avatar: "⚡",
    city: "یزد",
    cefrLevel: "B1",
    basePointsPerLevel: { B1: 2110, A2: 1690 },
    totalXp: 5120,
    streakDays: 17,
  },
  {
    id: "p-b1-4",
    name: "آوا کریمی",
    avatar: "💎",
    city: "کرمان",
    cefrLevel: "B1",
    basePointsPerLevel: { B1: 1960 },
    totalXp: 4620,
    streakDays: 14,
  },
  {
    id: "p-b1-5",
    name: "دانیال خسروی",
    avatar: "🔥",
    city: "همدان",
    cefrLevel: "B1",
    basePointsPerLevel: { B1: 1810 },
    totalXp: 4210,
    streakDays: 11,
  },
  {
    id: "p-b1-6",
    name: "فاطمه نجات",
    avatar: "🎯",
    city: "ساری",
    cefrLevel: "B1",
    basePointsPerLevel: { B1: 1650 },
    totalXp: 3750,
    streakDays: 8,
  },

  // --- B2 Cohort ---
  {
    id: "p-b2-1",
    name: "مریم کاظمی",
    avatar: "🌟",
    city: "شیراز",
    cefrLevel: "B2",
    basePointsPerLevel: { B2: 2690, B1: 2250, A2: 1900 },
    totalXp: 6840,
    streakDays: 34,
  },
  {
    id: "p-b2-2",
    name: "امیرحسین پاشا",
    avatar: "🦁",
    city: "تهران",
    cefrLevel: "B2",
    basePointsPerLevel: { B2: 2510, B1: 2090, A2: 1780 },
    totalXp: 6380,
    streakDays: 26,
  },
  {
    id: "p-b2-3",
    name: "سوگل افشار",
    avatar: "💎",
    city: "مشهد",
    cefrLevel: "B2",
    basePointsPerLevel: { B2: 2340, B1: 1940 },
    totalXp: 5820,
    streakDays: 20,
  },
  {
    id: "p-b2-4",
    name: "شایان قنبری",
    avatar: "⚡",
    city: "اصفهان",
    cefrLevel: "B2",
    basePointsPerLevel: { B2: 2180 },
    totalXp: 5310,
    streakDays: 16,
  },
  {
    id: "p-b2-5",
    name: "هلیا مرادی",
    avatar: "🎯",
    city: "قزوین",
    cefrLevel: "B2",
    basePointsPerLevel: { B2: 2010 },
    totalXp: 4860,
    streakDays: 13,
  },
  {
    id: "p-b2-6",
    name: "سپنتا وثوق",
    avatar: "🦉",
    city: "بوشهر",
    cefrLevel: "B2",
    basePointsPerLevel: { B2: 1850 },
    totalXp: 4320,
    streakDays: 10,
  },

  // --- C1 Cohort (Speedrun Dialogues based on AEF 5) ---
  {
    id: "p-c1-1",
    name: "مهسا ابراهیمی",
    avatar: "🏆",
    city: "یزد",
    cefrLevel: "C1",
    basePointsPerLevel: { C1: 2890, B2: 2400 },
    baseSpeeds: { C1: 22.4 },
    totalXp: 7850,
    streakDays: 42,
  },
  {
    id: "p-c1-2",
    name: "کیارش بهمنش",
    avatar: "⚡",
    city: "تهران",
    cefrLevel: "C1",
    basePointsPerLevel: { C1: 2720, B2: 2250 },
    baseSpeeds: { C1: 24.8 },
    totalXp: 7310,
    streakDays: 36,
  },
  {
    id: "p-c1-3",
    name: "درسا فیاض",
    avatar: "🌟",
    city: "شیراز",
    cefrLevel: "C1",
    basePointsPerLevel: { C1: 2560, B2: 2100 },
    baseSpeeds: { C1: 27.2 },
    totalXp: 6850,
    streakDays: 29,
  },
  {
    id: "p-c1-4",
    name: "نوید سرافراز",
    avatar: "🚀",
    city: "کرج",
    cefrLevel: "C1",
    basePointsPerLevel: { C1: 2410 },
    baseSpeeds: { C1: 30.5 },
    totalXp: 6320,
    streakDays: 21,
  },
  {
    id: "p-c1-5",
    name: "پرنیان صالحی",
    avatar: "💎",
    city: "رشت",
    cefrLevel: "C1",
    basePointsPerLevel: { C1: 2260 },
    baseSpeeds: { C1: 33.9 },
    totalXp: 5820,
    streakDays: 18,
  },
  {
    id: "p-c1-6",
    name: "آرین طهماسبی",
    avatar: "🦉",
    city: "تبریز",
    cefrLevel: "C1",
    basePointsPerLevel: { C1: 2110 },
    baseSpeeds: { C1: 37.1 },
    totalXp: 5290,
    streakDays: 14,
  },

  // --- C2 Cohort (Mastery & Classical Rhetoric) ---
  {
    id: "p-c2-1",
    name: "دکتر سپهر رادمنش",
    avatar: "🏛️",
    city: "تهران",
    cefrLevel: "C2",
    basePointsPerLevel: { C2: 3200, C1: 2950 },
    baseSpeeds: { C2: 17.8 },
    totalXp: 9450,
    streakDays: 65,
  },
  {
    id: "p-c2-2",
    name: "رکسانا شایگان",
    avatar: "👑",
    city: "اصفهان",
    cefrLevel: "C2",
    basePointsPerLevel: { C2: 3020, C1: 2800 },
    baseSpeeds: { C2: 19.9 },
    totalXp: 8900,
    streakDays: 54,
  },
  {
    id: "p-c2-3",
    name: "رادمهر نیک‌پی",
    avatar: "💎",
    city: "مشهد",
    cefrLevel: "C2",
    basePointsPerLevel: { C2: 2850, C1: 2640 },
    baseSpeeds: { C2: 21.6 },
    totalXp: 8350,
    streakDays: 45,
  },
  {
    id: "p-c2-4",
    name: "الین کیانی",
    avatar: "🌟",
    city: "شیراز",
    cefrLevel: "C2",
    basePointsPerLevel: { C2: 2690 },
    baseSpeeds: { C2: 23.8 },
    totalXp: 7820,
    streakDays: 38,
  },
  {
    id: "p-c2-5",
    name: "فرزاد پیروز",
    avatar: "⚡",
    city: "تبریز",
    cefrLevel: "C2",
    basePointsPerLevel: { C2: 2540 },
    baseSpeeds: { C2: 26.4 },
    totalXp: 7300,
    streakDays: 31,
  },
  {
    id: "p-c2-6",
    name: "بهار سرمدی",
    avatar: "🎯",
    city: "تهران",
    cefrLevel: "C2",
    basePointsPerLevel: { C2: 2390 },
    baseSpeeds: { C2: 29.2 },
    totalXp: 6790,
    streakDays: 25,
  },
];

/**
 * Stage weights for the 10 stages of each CEFR level.
 * Stages 1-3: 1.0x - 1.2x
 * Stages 4-7: 1.4x - 1.8x
 * Stages 8-10: 2.0x - 2.5x (Gold mastery stages holding >50% weight)
 */
export const STAGE_WEIGHTS: Record<number, number> = {
  1: 1.0,
  2: 1.1,
  3: 1.2,
  4: 1.4,
  5: 1.5,
  6: 1.6,
  7: 1.8,
  8: 2.0,
  9: 2.2,
  10: 2.5,
};

/**
 * Calculates the total weighted score of a skill & CEFR level
 * based on the sum of best scores achieved in stages 1-10 multiplied by their stage weight.
 */
export function calculateLevelTotalWeightedScore(
  skill: SkillKey = "vocabulary",
  cefr: CefrLevel,
  allProgress?: AllSkillsProgress
): number {
  const progress = allProgress || loadAllSkillsProgress();
  const currentSkillCefr = progress[skill]?.[cefr] || { ...DEFAULT_SKILL_PROGRESS };
  const bestPoints = currentSkillCefr.bestPoints || {};

  let totalWeighted = 0;
  for (let stage = 1; stage <= 10; stage++) {
    const raw = bestPoints[stage] || 0;
    const weight = STAGE_WEIGHTS[stage] || 1.0;
    totalWeighted += Math.round(raw * weight);
  }

  return totalWeighted;
}

const SKILL_PEER_MODIFIERS: Record<SkillKey, (peerId: string) => number> = {
  vocabulary: () => 1.0,
  speaking: (id) => 0.95 + (((id.charCodeAt(id.length - 1) * 19) % 22) / 100),
  listening: (id) => 0.92 + (((id.charCodeAt(id.length - 1) * 13) % 24) / 100),
  reading: (id) => 0.88 + (((id.charCodeAt(id.length - 1) * 11) % 27) / 100),
  writing: (id) => 0.85 + (((id.charCodeAt(id.length - 1) * 17) % 30) / 100),
  grammar: (id) => 0.9 + (((id.charCodeAt(id.length - 1) * 7) % 25) / 100),
};

/**
 * Returns the Level-Specific Leaderboard across any of the 6 skills and 6 CEFR levels
 * Supports Daily Reset, Weekly League, and All-Time (Weighted 10 Stages Sum)
 */
export function getLevelLeaderboard(
  cefr: CefrLevel,
  period?: LeaderboardPeriod,
  customProgress?: AllSkillsProgress
): { entries: LeaderboardEntry[]; userRank: number; pointsToLeader: number };
export function getLevelLeaderboard(
  skill: SkillKey,
  cefr: CefrLevel,
  period?: LeaderboardPeriod,
  customProgress?: AllSkillsProgress
): { entries: LeaderboardEntry[]; userRank: number; pointsToLeader: number };
export function getLevelLeaderboard(
  skillOrCefr: SkillKey | CefrLevel,
  cefrOrPeriod?: CefrLevel | LeaderboardPeriod,
  maybePeriod?: LeaderboardPeriod | AllSkillsProgress,
  customProgress?: AllSkillsProgress
): {
  entries: LeaderboardEntry[];
  userRank: number;
  pointsToLeader: number;
} {
  let skill: SkillKey = "vocabulary";
  let cefr: CefrLevel = "A1";
  let period: LeaderboardPeriod = "daily";
  let effectiveProgress: AllSkillsProgress | undefined = customProgress;

  const CEFR_SET = new Set<string>(["A1", "A2", "B1", "B2", "C1", "C2"]);

  if (CEFR_SET.has(skillOrCefr)) {
    cefr = skillOrCefr as CefrLevel;
    if (cefrOrPeriod && (cefrOrPeriod === "daily" || cefrOrPeriod === "weekly" || cefrOrPeriod === "all-time")) {
      period = cefrOrPeriod as LeaderboardPeriod;
    }
    if (maybePeriod && typeof maybePeriod === "object") {
      effectiveProgress = maybePeriod as AllSkillsProgress;
    }
  } else {
    skill = skillOrCefr as SkillKey;
    if (cefrOrPeriod && CEFR_SET.has(cefrOrPeriod as string)) {
      cefr = cefrOrPeriod as CefrLevel;
    }
    if (maybePeriod && typeof maybePeriod === "string") {
      period = maybePeriod as LeaderboardPeriod;
    } else if (maybePeriod && typeof maybePeriod === "object") {
      effectiveProgress = maybePeriod as AllSkillsProgress;
    }
  }

  const user = getLocalUserProfile();
  const allProgress = effectiveProgress || loadAllSkillsProgress();
  const currentSkillCefr = allProgress[skill]?.[cefr] || { ...DEFAULT_SKILL_PROGRESS };

  const totalWeighted = calculateLevelTotalWeightedScore(skill, cefr, allProgress);

  // Calculate user's score for this level and period
  let userScore = 0;
  if (period === "daily") {
    userScore = getLevelDailyHighScore(skill, cefr);
  } else if (period === "weekly") {
    userScore = Math.round(totalWeighted * 0.85) || currentSkillCefr.totalXp;
  } else {
    // All-time: Sum of all 10 weighted stage records
    userScore = totalWeighted || currentSkillCefr.totalXp * 2;
  }

  // Daily multiplier modifier (adds slight dynamic daily jitter so daily records feel alive)
  const todayDateNum = new Date().getDate();
  const dailyJitterFactor = 0.8 + ((todayDateNum % 5) * 0.05);

  // Filter peers that have active participation in this level
  const activePeers = PEER_LEARNERS.filter(
    (peer) => (peer.basePointsPerLevel[cefr] || 0) > 0
  );

  const entries: LeaderboardEntry[] = activePeers.map((peer, idx) => {
    const skillMod = (SKILL_PEER_MODIFIERS[skill] || (() => 1.0))(peer.id);
    let peerScore = Math.round((peer.basePointsPerLevel[cefr] || 600) * skillMod);
    if (period === "daily") {
      peerScore = Math.round(peerScore * 0.65 * dailyJitterFactor);
    } else if (period === "weekly") {
      peerScore = Math.round(peerScore * 0.9);
    }

    const peerSpeed = peer.baseSpeeds?.[cefr as "C1" | "C2"];
    let computedSpeed: number | undefined = undefined;
    if (skill === "grammar") {
      computedSpeed = Number((18.0 + ((peer.id.charCodeAt(peer.id.length - 1) * 3) % 12) + (10 - Math.min(peerScore / 300, 8))).toFixed(1));
    } else if (skill === "reading") {
      computedSpeed = Number((14.0 + ((peer.id.charCodeAt(peer.id.length - 1) * 3) % 15) + (10 - Math.min(peerScore / 250, 8))).toFixed(1));
    } else if ((cefr === "C1" || cefr === "C2") && (skill === "vocabulary" || skill === "speaking")) {
      computedSpeed = peerSpeed ?? Math.max(18.5, Number((55 - peerScore / 60 + (idx % 3) * 1.5).toFixed(1)));
    }

    return {
      id: peer.id,
      name: peer.name,
      avatar: peer.avatar,
      city: peer.city,
      cefrLevel: cefr,
      score: peerScore,
      totalXp: peer.totalXp,
      starsCount: Math.round(peerScore / 100),
      streakDays: peer.streakDays,
      rank: 0,
      bestStreak: skill === "grammar" ? Math.min(10, Math.round(peerScore / 250) + 4) : Math.round(peerScore / 150) + 3,
      bestTimeSeconds: computedSpeed,
    };
  });

  // Look up best completion time for user
  let userBestTime: number | undefined = undefined;
  if (skill === "grammar" || skill === "reading" || ((cefr === "C1" || cefr === "C2") && (skill === "vocabulary" || skill === "speaking"))) {
    let minTime = 0;
    for (let st = 1; st <= 10; st++) {
      const t = getStageBestTime(skill, cefr, st);
      if (t > 0 && (minTime === 0 || t < minTime)) minTime = t;
    }
    if (minTime > 0) userBestTime = minTime;
  }

  // Current user entry
  const userEntry: LeaderboardEntry = {
    id: "current-user",
    name: user.nickname,
    avatar: user.avatar,
    city: user.city,
    cefrLevel: cefr,
    score: userScore,
    totalXp: currentSkillCefr.totalXp,
    starsCount: calculateTotalStars(allProgress),
    streakDays: userScore > 0 ? 3 : 1,
    rank: 0,
    isCurrentUser: true,
    bestStreak: skill === "grammar" ? Math.min(10, Math.round(userScore / 280) || (userScore > 0 ? 6 : 0)) : Math.round(userScore / 140),
    bestTimeSeconds: userBestTime,
  };

  entries.push(userEntry);

  // Sorting
  if (skill === "grammar") {
    // Grammar Tie-Breaker:
    // 1. Clean Streak (bestStreak descending)
    // 2. Speedrun Time (bestTimeSeconds ascending, lower is better)
    // 3. Total Weighted Score (descending)
    entries.sort((a, b) => {
      const streakA = a.bestStreak || 0;
      const streakB = b.bestStreak || 0;
      if (streakB !== streakA) return streakB - streakA;

      const timeA = a.bestTimeSeconds || 999;
      const timeB = b.bestTimeSeconds || 999;
      if (timeA !== timeB) return timeA - timeB;

      return b.score - a.score;
    });
  } else if (skill === "reading") {
    // Reading Tie-Breaker: Score descending -> Lower completion time ascending
    entries.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const timeA = a.bestTimeSeconds || 999;
      const timeB = b.bestTimeSeconds || 999;
      return timeA - timeB;
    });
  } else {
    // Standard score sort
    entries.sort((a, b) => b.score - a.score);
  }

  // Assign ranks & dynamic honorary badges
  const rankedEntries = entries.map((item, idx) => {
    let honoraryBadge: string | undefined = undefined;
    let grammarTitle: string | undefined = undefined;

    if (skill === "grammar") {
      if (idx === 0) {
        honoraryBadge = "👑 معمار ارشد نحو";
        grammarTitle = "معمار ارشد نحو";
      } else if (idx === 1 || idx === 2) {
        honoraryBadge = "⚡ مهندس سازه";
        grammarTitle = "مهندس سازه";
      } else if ((item.bestStreak || 0) >= 10) {
        honoraryBadge = "🛡️ دست‌نیافتنی (Zero Error)";
        grammarTitle = "شکارچی خطای نحو";
      }
    }

    return {
      ...item,
      rank: idx + 1,
      honoraryBadge,
      grammarTitle,
    };
  });

  const userRankItem = rankedEntries.find((e) => e.isCurrentUser);
  const userRank = userRankItem?.rank || rankedEntries.length;
  const topScore = rankedEntries[0]?.score || 0;
  const pointsToLeader = Math.max(0, topScore - userScore);

  return {
    entries: rankedEntries,
    userRank,
    pointsToLeader,
  };
}

export interface BestSkillRankResult {
  bestRank: number;
  bestSkill: SkillKey;
  skillTitleFa: string;
}

/**
 * Returns the learner's best rank across all skills in a specific CEFR level.
 */
export function getBestSkillRankForCefr(
  cefr: CefrLevel,
  allProgress?: AllSkillsProgress
): BestSkillRankResult {
  const skills: SkillKey[] = ["grammar", "vocabulary", "speaking", "listening", "reading", "writing"];
  const skillNamesFa: Record<SkillKey, string> = {
    grammar: "دستور زبان",
    vocabulary: "واژگان",
    speaking: "مکالمه",
    listening: "شنیداری",
    reading: "درک مطلب",
    writing: "نگارش",
  };

  const progress = allProgress || loadAllSkillsProgress();
  let bestRank = 999;
  let bestSkill: SkillKey = "grammar";

  for (const skill of skills) {
    const dailyRank = getLevelLeaderboard(skill, cefr, "daily", progress).userRank;
    const allTimeRank = getLevelLeaderboard(skill, cefr, "all-time", progress).userRank;
    const skillBestRank = Math.min(dailyRank, allTimeRank);

    if (skillBestRank < bestRank) {
      bestRank = skillBestRank;
      bestSkill = skill;
    }
  }

  if (bestRank > 7 || bestRank === 999) {
    bestRank = 7;
  }

  return {
    bestRank,
    bestSkill,
    skillTitleFa: skillNamesFa[bestSkill] || "مهارت‌ها",
  };
}

export interface LevelChampionData {
  cefr: CefrLevel;
  titleFa: string;
  badgeColor: string;
  top3: LeaderboardEntry[];
  totalLearners: number;
  userRank: number;
  userScore: number;
  userBestTime?: number;
}

/**
 * Returns Top Champions and standings across ALL 6 CEFR levels simultaneously.
 * Perfect for the "All Levels Showcase" overview.
 */
export function getAllLevelsChampions(period: LeaderboardPeriod = "daily"): LevelChampionData[] {
  const CEFR_CONFIG: Record<CefrLevel, { titleFa: string; badgeColor: string }> = {
    A1: { titleFa: "مقدماتی (Everyday Essentials)", badgeColor: "#10b981" },
    A2: { titleFa: "پیش‌متوسط (Travel & City Living)", badgeColor: "#0284c7" },
    B1: { titleFa: "متوسط (Synonyms & Fluency)", badgeColor: "#0d9488" },
    B2: { titleFa: "فوق‌متوسط (Synonyms & Idioms)", badgeColor: "#0f766e" },
    C1: { titleFa: "پیشرفته (اسپیدران مکالمه AEF 5)", badgeColor: "#ea580c" },
    C2: { titleFa: "استادی زبان (تسلط کامل و سرعت)", badgeColor: "#e11d48" },
  };

  const levels: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  return levels.map((lvl) => {
    const data = getLevelLeaderboard(lvl, period);
    const userEntry = data.entries.find((e) => e.isCurrentUser);
    return {
      cefr: lvl,
      titleFa: CEFR_CONFIG[lvl].titleFa,
      badgeColor: CEFR_CONFIG[lvl].badgeColor,
      top3: data.entries.slice(0, 3),
      totalLearners: data.entries.length,
      userRank: data.userRank,
      userScore: userEntry?.score || 0,
      userBestTime: userEntry?.bestTimeSeconds,
    };
  });
}

/**
 * Returns the Global Leaderboard across all levels combined
 * Shows the Top Learners on the entire platform
 */
export function getGlobalLeaderboard(period: LeaderboardPeriod = "all-time"): {
  entries: LeaderboardEntry[];
  podiumTop3: LeaderboardEntry[];
  userRank: number;
} {
  const user = getLocalUserProfile();
  const allProgress = loadAllSkillsProgress();
  const grandTotalXp = calculateGrandTotalXp(allProgress);
  const totalStars = calculateTotalStars(allProgress);

  const factor = period === "weekly" ? 0.6 : period === "daily" ? 0.25 : 1.0;

  const entries: LeaderboardEntry[] = PEER_LEARNERS.map((peer) => ({
    id: peer.id,
    name: peer.name,
    avatar: peer.avatar,
    city: peer.city,
    cefrLevel: peer.cefrLevel,
    score: Math.round(peer.totalXp * factor),
    totalXp: Math.round(peer.totalXp * factor),
    starsCount: Math.round(peer.totalXp / 80),
    streakDays: peer.streakDays,
    rank: 0,
  }));

  const userGlobalScore = Math.round(grandTotalXp * factor);

  entries.push({
    id: "current-user",
    name: user.nickname,
    avatar: user.avatar,
    city: user.city,
    cefrLevel: "A1",
    score: userGlobalScore,
    totalXp: userGlobalScore,
    starsCount: totalStars,
    streakDays: grandTotalXp > 0 ? 3 : 1,
    rank: 0,
    isCurrentUser: true,
  });

  entries.sort((a, b) => b.score - a.score);

  const rankedEntries = entries.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));

  const podiumTop3 = rankedEntries.slice(0, 3);
  const userRankItem = rankedEntries.find((e) => e.isCurrentUser);
  const userRank = userRankItem?.rank || rankedEntries.length;

  return {
    entries: rankedEntries,
    podiumTop3,
    userRank,
  };
}

// Backward compatibility alias
export function getLeaderboard(period: "weekly" | "all-time" = "weekly"): LeaderboardEntry[] {
  return getGlobalLeaderboard(period).entries;
}

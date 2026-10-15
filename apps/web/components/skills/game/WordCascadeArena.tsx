"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./skills-game.module.css";
import { GameLevel, VocabRushResult } from "../../../data/skills/games/types";
import {
  getShuffledCascadePairs,
  CascadePair,
  WEBSITE_BOOKS_VOCAB_BANK,
} from "../../../data/skills/games/website-books-vocab";
import {
  recordVocabRushCompletion,
  getLevelDailyHighScore,
} from "../../../lib/skills/game-storage";
import { soundSynth } from "../../../lib/skills/game-audio";
import { playEnglishSpeech, stopEnglishSpeech } from "../../../lib/speech";
import { SkillStageBriefingModal, BriefingTriggerButton } from "./SkillStageBriefingModal";

interface Props {
  level: GameLevel;
  onClose: () => void;
  onNextLevel?: () => void;
  onOpenLeaderboard?: () => void;
}

interface ActiveTile {
  tileId: string;
  pairId: string;
  side: "english" | "match";
  text: string;
  audioText: string;
  category: "word" | "chunk" | "dialogue";
  contextFa?: string;
  powerUp?: "bomb" | "freeze" | "star";
  col: number; // 0..4
  row: number; // 0..3
  isExploding?: boolean;
  isShaking?: boolean;
  isFalling?: boolean;
}

interface FloatingToast {
  id: number;
  text: string;
  color: string;
}

const COLS = 4;
const ROWS = 4;
const TOTAL_CELLS = COLS * ROWS; // 16 tiles = 8 pairs active at a time

// Fisher-Yates shuffle helper
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Stage-by-stage progressive time limits for Word Cascade:
 * Stage 1: 40s
 * Stage 2: 35s
 * Stage 3: 30s
 * Stages 4 - 10: 40s
 */
export function getVocabStageTimeLimit(stageNumber: number): number {
  if (stageNumber === 1) return 40;
  if (stageNumber === 2) return 35;
  if (stageNumber === 3) return 30;
  return 40; // Stages 4 to 10
}

/**
 * Minimum correct matches required to pass/advance to the next stage:
 * Stages 1-2: 5
 * Stages 3-10: 6
 */
export function getVocabStagePassThreshold(stageNumber: number): number {
  if (stageNumber <= 2) return 5;
  return 6;
}

export function WordCascadeArena({ level, onClose, onNextLevel, onOpenLeaderboard }: Props) {
  const isB1B2 = level.cefr === "B1" || level.cefr === "B2";
  const stageTimeLimit = getVocabStageTimeLimit(level.levelNumber);
  const requiredMatches = getVocabStagePassThreshold(level.levelNumber);

  const defaultTeacherTip = isB1B2
    ? "🔍 Find synonyms. Match the words on the left with their synonyms on the right!"
    : "روی کلمه انگلیسی (آبی) و ترجمه فارسی (کهربایی) کلیک کن تا انفجار رخ بده! 💥";

  const isA1A2 = level.cefr === "A1" || level.cefr === "A2";

  // Game metrics & state
  const [timeLeft, setTimeLeft] = useState(stageTimeLimit);
  const [isTimerFrozen, setIsTimerFrozen] = useState(false);
  const [isScreenShaking, setIsScreenShaking] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [maxCombo, setMaxCombo] = useState(1);
  const [correctMatches, setCorrectMatches] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isBriefingOpen, setIsBriefingOpen] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const canAdvance = correctMatches >= requiredMatches;
  const [teacherTip, setTeacherTip] = useState(defaultTeacherTip);

  // Grid & pair reserves
  const [tiles, setTiles] = useState<ActiveTile[]>([]);
  const [pairReserve, setPairReserve] = useState<CascadePair[]>([]);
  const [selectedTile, setSelectedTile] = useState<ActiveTile | null>(null);

  // Mistakes for the Mistake Vault
  const [missedPairs, setMissedPairs] = useState<CascadePair[]>([]);
  const [floatingList, setFloatingList] = useState<FloatingToast[]>([]);

  // Results & Daily Best
  const [result, setResult] = useState<VocabRushResult | null>(null);
  const previousDailyBest = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const freezeTimerTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const floatingIdCounter = useRef(0);
  const tileIdCounter = useRef(0);

  // Helper to scramble tiles across 4x4 grid positions
  // For B1/B2: Main Words stay on LEFT (cols 0, 1) and Synonyms stay on RIGHT (cols 2, 3)
  const scrambleTilePositions = useCallback(
    (currentTiles: ActiveTile[]): ActiveTile[] => {
      if (isB1B2) {
        const leftPositions: { col: number; row: number }[] = [];
        const rightPositions: { col: number; row: number }[] = [];
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < 2; c++) {
            leftPositions.push({ col: c, row: r });
          }
          for (let c = 2; c < COLS; c++) {
            rightPositions.push({ col: c, row: r });
          }
        }
        const shuffledLeft = shuffleArray(leftPositions);
        const shuffledRight = shuffleArray(rightPositions);

        let leftIdx = 0;
        let rightIdx = 0;

        return currentTiles.map((tile) => {
          if (tile.side === "english") {
            const pos = shuffledLeft[leftIdx++ % shuffledLeft.length];
            return {
              ...tile,
              col: pos.col,
              row: pos.row,
              isExploding: false,
              isShaking: false,
              isFalling: true,
            };
          } else {
            const pos = shuffledRight[rightIdx++ % shuffledRight.length];
            return {
              ...tile,
              col: pos.col,
              row: pos.row,
              isExploding: false,
              isShaking: false,
              isFalling: true,
            };
          }
        });
      }

      // Default A1/A2 scramble
      const positions: { col: number; row: number }[] = [];
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          positions.push({ col: c, row: r });
        }
      }
      const shuffledPositions = shuffleArray(positions);

      return currentTiles.map((tile, idx) => ({
        ...tile,
        col: shuffledPositions[idx % shuffledPositions.length].col,
        row: shuffledPositions[idx % shuffledPositions.length].row,
        isExploding: false,
        isShaking: false,
        isFalling: true,
      }));
    },
    [isB1B2]
  );

  // Pronunciation with high-fidelity native audio engine
  const speakText = useCallback(
    (text?: string) => {
      if (isMuted || typeof window === "undefined" || !text) return;
      playEnglishSpeech(text, { accent: "en-US", rate: 0.94 });
    },
    [isMuted]
  );

  // Stop speech, clear freeze timer and lock background body scroll while modal is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "contain";
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.overscrollBehavior = originalOverscroll;
      stopEnglishSpeech();
      if (freezeTimerTimeoutRef.current) clearTimeout(freezeTimerTimeoutRef.current);
    };
  }, []);

  // Trigger floating notifications
  const triggerFloatingBadge = useCallback((text: string, color: string) => {
    const id = ++floatingIdCounter.current;
    setFloatingList((prev) => [...prev, { id, text, color }]);
    setTimeout(() => {
      setFloatingList((prev) => prev.filter((item) => item.id !== id));
    }, 850);
  }, []);

  // Initialize board and reserves
  const initializeGame = useCallback(() => {
    previousDailyBest.current = getLevelDailyHighScore(level.skill, level.cefr);
    if (freezeTimerTimeoutRef.current) clearTimeout(freezeTimerTimeoutRef.current);

    // Get fresh shuffled pairs strictly from this level's vocabulary and stage group (fresh words every 2 stages)
    const shuffledPool = getShuffledCascadePairs(level.cefr, level.levelNumber);

    // 8 pairs needed for the initial 16 cells (4 cols x 4 rows)
    const initialPairs = shuffledPool.slice(0, 8);
    const reserve = shuffledPool.slice(8);

    // Construct 16 tiles
    const rawTiles: ActiveTile[] = [];
    initialPairs.forEach((pair) => {
      rawTiles.push({
        tileId: `t-${++tileIdCounter.current}`,
        pairId: pair.id,
        side: "english",
        text: pair.english,
        audioText: pair.english,
        category: pair.category,
        contextFa: pair.contextFa,
        powerUp: pair.powerUp,
        col: 0,
        row: 0,
        isFalling: false,
      });
      const matchText = isB1B2 && pair.synonym ? pair.synonym : pair.match;
      rawTiles.push({
        tileId: `t-${++tileIdCounter.current}`,
        pairId: pair.id,
        side: "match",
        text: matchText,
        audioText: matchText,
        category: pair.category,
        contextFa: pair.contextFa,
        powerUp: pair.powerUp,
        col: 0,
        row: 0,
        isFalling: false,
      });
    });

    const finalTiles = scrambleTilePositions(rawTiles).map((t) => ({ ...t, isFalling: false }));

    const currentStageTime = getVocabStageTimeLimit(level.levelNumber);
    setTiles(finalTiles);
    setPairReserve(reserve);
    setSelectedTile(null);
    setTimeLeft(currentStageTime);
    setIsTimerFrozen(false);
    setIsScreenShaking(false);
    setScore(0);
    setCombo(1);
    setMaxCombo(1);
    setCorrectMatches(0);
    setTotalAttempts(0);
    setIsGameOver(false);
    setIsBriefingOpen(true);
    setMissedPairs([]);
    setResult(null);
    setTeacherTip(defaultTeacherTip);
  }, [level, isB1B2, defaultTeacherTip, scrambleTilePositions]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Dynamic teacher encouraging messages
  useEffect(() => {
    if (isB1B2) {
      if (combo >= 5) {
        setTeacherTip("🔥 Supernova Active! Double points, keep the momentum going! 💥");
      } else if (combo >= 3) {
        setTeacherTip("⚡ Excellent combo! Fast synonym matching!");
      } else if (timeLeft <= 15) {
        setTeacherTip("⏳ Time is running low! Focus and match the remaining synonyms!");
      } else {
        setTeacherTip("🔍 Find synonyms. Match the words on the left with their synonyms on the right!");
      }
    } else {
      if (combo >= 5) {
        setTeacherTip("🔥 حالت سوپرنوا فعاله! امتیازها دو برابر میشن، همین فرمون برو جلو!");
      } else if (combo >= 3) {
        setTeacherTip("⚡ کمبوی عالی! سرعتت فوق‌العاده‌ست!");
      } else if (timeLeft <= 15) {
        setTeacherTip("⏳ نفس عمیق بکش و تمرکز کن، هنوز وقت داری رکورد بزنی!");
      } else {
        setTeacherTip("روی کلمه انگلیسی (آبی) و ترجمه فارسی (کهربایی) کلیک کن تا انفجار رخ بده! 💥");
      }
    }
  }, [combo, timeLeft, isB1B2]);

  // Round completion logic
  const handleFinishRound = useCallback(() => {
    setIsGameOver(true);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    setScore((finalScore) => {
      setCorrectMatches((matches) => {
        setTotalAttempts((attempts) => {
          setMaxCombo((peakCombo) => {
            const required = getVocabStagePassThreshold(level.levelNumber);
            const accuracy = attempts > 0 ? Math.round((matches / attempts) * 100) : 0;
            const passed = matches >= required;

            let stars = 0;
            if (accuracy >= 95 && finalScore >= 1000) stars = 3;
            else if (accuracy >= 85 || finalScore >= 600) stars = 2;
            else if (passed) stars = 1;

            if (passed && !isMuted) {
              soundSynth.playFanfare();
            } else if (!isMuted) {
              soundSynth.playWrong();
            }

            // Save in system game storage
            const outcome = recordVocabRushCompletion(
              level.skill,
              level.cefr,
              level.levelNumber,
              finalScore,
              accuracy,
              matches,
              attempts,
              level.xpReward
            );

            // Populate Game Questions format for result compatibility
            const missedQuestionsFormatted = missedPairs.map((p) => ({
              id: p.id,
              prompt: p.english,
              promptFa: p.contextFa || "واژگان و مکالمات کتاب‌های معتبر",
              options: [p.match, "گزینه نادرست ۱", "گزینه نادرست ۲", "گزینه نادرست ۳"],
              correctAnswer: 0,
              explanationFa: `معنی و کاربرد در کتاب: «${p.match}» (${p.contextFa || "منبع اصلی"})`,
              audioText: p.match,
            }));

            setResult({
              levelNumber: level.levelNumber,
              cefr: level.cefr,
              skill: level.skill,
              finalScore,
              accuracy,
              correctCount: matches,
              totalAnswered: attempts,
              maxStreak: peakCombo,
              timeSurvivedSeconds: Math.max(0, stageTimeLimit - timeLeft),
              passed,
              stars,
              xpEarned: outcome.xpEarned,
              isDailyRecord: outcome.isDailyRecord,
              missedQuestions: missedQuestionsFormatted,
            });

            return peakCombo;
          });
          return attempts;
        });
        return matches;
      });
      return finalScore;
    });
  }, [level, isMuted, missedPairs, timeLeft]);

  // Live stage advance triggered by clicking "رفتن به مرحله بعد"
  const handleAdvanceNextStage = useCallback(() => {
    if (isGameOver) return;
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsGameOver(true);

    const required = getVocabStagePassThreshold(level.levelNumber);
    const accuracy = totalAttempts > 0 ? Math.round((correctMatches / totalAttempts) * 100) : 100;

    let stars = 1;
    if (accuracy >= 95 && score >= 1000) stars = 3;
    else if (accuracy >= 85 || score >= 600) stars = 2;

    if (!isMuted) {
      soundSynth.playFanfare();
    }

    recordVocabRushCompletion(
      level.skill,
      level.cefr,
      level.levelNumber,
      score,
      accuracy,
      correctMatches,
      totalAttempts,
      level.xpReward
    );

    if (onNextLevel) {
      onNextLevel();
    }
  }, [
    isGameOver,
    level,
    totalAttempts,
    correctMatches,
    score,
    isMuted,
    onNextLevel,
  ]);

  // Countdown timer effect with Freeze mechanic
  useEffect(() => {
    if (isGameOver || isBriefingOpen) return;

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (isTimerFrozen) return prev; // Freeze active!
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          handleFinishRound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isGameOver, isBriefingOpen, isTimerFrozen, handleFinishRound]);

  // Execute match replacement and scramble ALL 16 tiles across the board on CORRECT MATCH
  const executeMatchAndScramble = (tileId1: string, tileId2: string, hasBomb: boolean = false) => {
    setTiles((prevTiles) => {
      const tile1 = prevTiles.find((t) => t.tileId === tileId1);
      const tile2 = prevTiles.find((t) => t.tileId === tileId2);
      if (!tile1 || !tile2) return prevTiles;

      const removedIds = new Set([tileId1, tileId2]);

      // If bomb power-up: also clear another unsolved pair!
      let extraPairsCount = 0;
      if (hasBomb) {
        const otherPair = prevTiles.find(
          (t) => !removedIds.has(t.tileId) && t.pairId !== tile1.pairId
        );
        if (otherPair) {
          const matchingPairTiles = prevTiles.filter((t) => t.pairId === otherPair.pairId);
          matchingPairTiles.forEach((t) => removedIds.add(t.tileId));
          extraPairsCount = 1;
        }
      }

      const surviving = prevTiles.filter((t) => !removedIds.has(t.tileId));

      // Need new tiles from reserve
      let currentReserve = [...pairReserve];
      const newTilesToAdd: ActiveTile[] = [];
      const totalPairsNeeded = 1 + extraPairsCount;

      for (let i = 0; i < totalPairsNeeded; i++) {
        if (currentReserve.length < 1) {
          currentReserve = [
            ...currentReserve,
            ...getShuffledCascadePairs(level.cefr, level.levelNumber),
          ];
        }
        const newPair = currentReserve.shift();
        if (!newPair) break;

        newTilesToAdd.push({
          tileId: `t-${++tileIdCounter.current}`,
          pairId: newPair.id,
          side: "english",
          text: newPair.english,
          audioText: newPair.english,
          category: newPair.category,
          contextFa: newPair.contextFa,
          powerUp: newPair.powerUp,
          col: 0,
          row: 0,
          isFalling: true,
        });

        const matchText = isB1B2 && newPair.synonym ? newPair.synonym : newPair.match;
        newTilesToAdd.push({
          tileId: `t-${++tileIdCounter.current}`,
          pairId: newPair.id,
          side: "match",
          text: matchText,
          audioText: matchText,
          category: newPair.category,
          contextFa: newPair.contextFa,
          powerUp: newPair.powerUp,
          col: 0,
          row: 0,
          isFalling: true,
        });
      }

      setPairReserve(currentReserve);
      const combined = [...surviving, ...newTilesToAdd];
      return scrambleTilePositions(combined);
    });

    setTimeout(() => {
      setTiles((prev) => prev.map((t) => (t.isFalling ? { ...t, isFalling: false } : t)));
    }, 300);
  };

  // Handle tile click
  const handleTileClick = (clicked: ActiveTile) => {
    if (
      isGameOver ||
      clicked.isExploding ||
      clicked.isShaking
    ) {
      return;
    }

    // Deselect if already selected
    if (selectedTile && selectedTile.tileId === clicked.tileId) {
      setSelectedTile(null);
      if (!isMuted) soundSynth.playClick();
      return;
    }

    // First tile selection: Select and turn green (stay in place, no shuffle!)
    if (!selectedTile) {
      setSelectedTile(clicked);
      if (!isMuted) soundSynth.playClick();
      return;
    }

    // If clicked tile is on the SAME side, switch active selection (stay in place, no shuffle!)
    if (selectedTile.side === clicked.side) {
      setSelectedTile(clicked);
      if (!isMuted) soundSynth.playClick();
      return;
    }

    // Second tile selected (from opposite side) - check match!
    const isMatch = selectedTile.pairId === clicked.pairId;

    setTotalAttempts((prev) => prev + 1);

    if (isMatch) {
      // SUCCESS MATCH: Both tiles explode, new tiles enter, and ALL 16 TILES SHUFFLE!
      const hasStar = selectedTile.powerUp === "star" || clicked.powerUp === "star";
      const hasFreeze = selectedTile.powerUp === "freeze" || clicked.powerUp === "freeze";
      const hasBomb = selectedTile.powerUp === "bomb" || clicked.powerUp === "bomb";

      const isSupernova = combo >= 5;
      let multiplier = isSupernova ? 2 : 1;
      if (hasStar) multiplier *= 2;

      const basePoints = 120;
      const comboBonus = combo * 35;
      const ptsEarned = (basePoints + comboBonus) * multiplier + (hasBomb ? 150 : 0);

      setScore((prev) => prev + ptsEarned);
      const addedMatches = 1 + (hasBomb ? 1 : 0);
      setCorrectMatches((prev) => prev + addedMatches);

      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setMaxCombo((prev) => Math.max(prev, nextCombo));

      // Pronunciation:
      const englishAudio = selectedTile.side === "english" ? selectedTile.audioText : clicked.audioText;
      speakText(englishAudio);

      // Bonus time (+2s)
      setTimeLeft((prev) => Math.min(120, prev + 2.0));

      // Floating badges
      triggerFloatingBadge(`+2s ⏱️`, "#10b981");
      triggerFloatingBadge(`+${ptsEarned} pts 🔥`, hasStar ? "#f59e0b" : "#2563eb");

      if (hasStar) {
        triggerFloatingBadge(`⭐ ستاره دوبل x2!`, "#f59e0b");
      }

      if (hasFreeze) {
        triggerFloatingBadge(`❄️ زمان یخ زد! (۴ ثانیه)`, "#06b6d4");
        setIsTimerFrozen(true);
        if (freezeTimerTimeoutRef.current) clearTimeout(freezeTimerTimeoutRef.current);
        freezeTimerTimeoutRef.current = setTimeout(() => {
          setIsTimerFrozen(false);
        }, 4000);
      }

      if (hasBomb) {
        triggerFloatingBadge(`💣 بمب ترکید! (+۱۵۰)`, "#ef4444");
      }

      if (isSupernova) {
        triggerFloatingBadge(`💥 سوپرنوا x2!`, "#ec4899");
      }

      if (isA1A2) {
        setIsScreenShaking(true);
        setTimeout(() => setIsScreenShaking(false), 420);
      }

      // Audio: sound effects only
      if (!isMuted) {
        soundSynth.playCorrect();
        if (nextCombo > 2 || hasBomb) soundSynth.playCombo(nextCombo);
      }

      // Trigger explosion animation on both (and other pair if bomb)
      setTiles((prev) => {
        const explodingPairIds = new Set([selectedTile.pairId]);
        if (hasBomb) {
          const otherP = prev.find((t) => t.pairId !== selectedTile.pairId);
          if (otherP) explodingPairIds.add(otherP.pairId);
        }
        return prev.map((t) =>
          explodingPairIds.has(t.pairId) ? { ...t, isExploding: true } : t
        );
      });

      const t1Id = selectedTile.tileId;
      const t2Id = clicked.tileId;
      setSelectedTile(null);

      // Execute replacement AND SHUFFLE whole board on correct match!
      setTimeout(() => {
        executeMatchAndScramble(t1Id, t2Id, hasBomb);
      }, 250);
    } else {
      // MISMATCH
      if (!isMuted) soundSynth.playWrong();
      setCombo(1);
      setTimeLeft((prev) => Math.max(0, prev - 2.0));
      triggerFloatingBadge(`-2s ⚠️`, "#ef4444");

      // Record in missedPairs for the Mistake Vault
      const foundSource = WEBSITE_BOOKS_VOCAB_BANK.find((p) => p.id === selectedTile.pairId);
      if (foundSource) {
        setMissedPairs((prev) => {
          if (!prev.some((p) => p.id === foundSource.id)) {
            return [...prev, foundSource];
          }
          return prev;
        });
      }

      // Shake animation
      setTiles((prev) =>
        prev.map((t) =>
          t.tileId === selectedTile.tileId || t.tileId === clicked.tileId
            ? { ...t, isShaking: true }
            : t
        )
      );

      // Reset selection and shaking after mistake without shuffling board
      setTimeout(() => {
        setSelectedTile(null);
        setTiles((prev) =>
          prev.map((t) => (t.isShaking ? { ...t, isShaking: false } : t))
        );
      }, 400);
    }
  };

  const isSupernova = combo >= 5;
  const isDangerTime = timeLeft <= 15;
  const energyPercent = Math.min(100, (timeLeft / stageTimeLimit) * 100);

  // =========================================================================
  // RESULTS MODAL (Stage Clear / Try Again & Mistake Vault)
  // =========================================================================
  if (result) {
    return (
      <div className={styles.arenaOverlay}>
        <div className={styles.cascadeArenaModal} style={{ maxWidth: 720 }}>
          <div className={styles.victoryCard}>
            {/* Stars */}
            <div className={styles.victoryStars}>
              {result.stars === 3
                ? "⭐⭐⭐"
                : result.stars === 2
                ? "⭐⭐"
                : result.stars === 1
                ? "⭐"
                : "💔"}
            </div>

            <h2 className={styles.victoryTitle}>
              {result.passed
                ? "آفرین رفیق! این مرحله رو با اقتدار پشت سر گذاشتی 🎉"
                : "خیلی نزدیک بودی رفیق! نیاز به تمرین بیشتر داری 💪"}
            </h2>

            {!result.passed && (
              <p className={styles.victoryDesc}>
                دقتت {result.accuracy}٪ شد. برای عبور از این استیج دوباره امتحان کن، این بار رکورد می‌زنی!
              </p>
            )}

            {/* Daily Record Alert */}
            {result.isDailyRecord && (
              <div
                style={{
                  background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                  border: "2px solid #f59e0b",
                  borderRadius: "1rem",
                  padding: "0.75rem 1.25rem",
                  margin: "0.75rem 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  color: "#92400e",
                  fontWeight: 900,
                  fontSize: "1rem",
                }}
              >
                <span>🔥</span>
                <span>
                  تبریک! رکورد امروز سطح {level.cefr} رو شکستی! (
                  {result.finalScore.toLocaleString("fa-IR")} امتیاز)
                </span>
              </div>
            )}

            {/* Stats Row */}
            <div className={styles.victoryStatsRow} style={{ flexWrap: "wrap", justifyContent: "center" }}>
              <div className={styles.victoryStatItem}>
                <span className={styles.victoryStatVal}>
                  {result.finalScore.toLocaleString("fa-IR")}
                </span>
                <span className={styles.victoryStatLbl}>امتیاز نهایی</span>
              </div>
              <div className={styles.victoryStatItem}>
                <span className={styles.victoryStatVal}>{result.accuracy}٪</span>
                <span className={styles.victoryStatLbl}>دقت تطابق</span>
              </div>
              <div className={styles.victoryStatItem}>
                <span className={styles.victoryStatVal}>{result.correctCount}</span>
                <span className={styles.victoryStatLbl}>انفجارهای موفق</span>
              </div>
              <div className={styles.victoryStatItem}>
                <span className={styles.victoryStatVal}>{result.maxStreak}x</span>
                <span className={styles.victoryStatLbl}>بزرگترین کمبو</span>
              </div>
              <div className={styles.victoryStatItem}>
                <span className={styles.victoryStatVal}>+{result.xpEarned}</span>
                <span className={styles.victoryStatLbl}>XP کسب‌شده</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
                justifyContent: "center",
                marginTop: "1.25rem",
              }}
            >
              {result.passed && onNextLevel && (
                <button className={styles.victoryActionBtn} onClick={onNextLevel}>
                  🚀 رفتن به مرحله بعد
                </button>
              )}
              <button
                className={styles.playBtn}
                onClick={initializeGame}
                style={{
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  padding: "0.85rem 1.75rem",
                  fontSize: "1rem",
                }}
              >
                🔄 بازی مجدد و شکستن رکورد
              </button>
              {onOpenLeaderboard && (
                <button
                  type="button"
                  className={styles.tabBtn}
                  onClick={onOpenLeaderboard}
                  style={{
                    background: "rgba(37, 99, 235, 0.08)",
                    color: "#2563eb",
                    borderColor: "#bfdbfe",
                  }}
                >
                  🏆 مشاهده لیدربرد
                </button>
              )}
              <button className={styles.quitBtn} onClick={onClose}>
                بازگشت به نقشه
              </button>
            </div>

            {/* Mistake Vault Section */}
            {missedPairs.length > 0 && (
              <div
                style={{
                  marginTop: "2rem",
                  width: "100%",
                  textAlign: "right",
                  borderTop: "1px solid #e2e8f0",
                  paddingTop: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "1.05rem",
                      fontWeight: 800,
                      color: "#2563eb",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span>📖</span>
                    <span>دفترچه مرور و تثبیت (Mistake Vault)</span>
                  </h3>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    {missedPairs.length} جفت برای مرور و یادگیری
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {missedPairs.map((p) => (
                    <div key={p.id} className={styles.mistakeVaultItem}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <button
                          type="button"
                          onClick={() => speakText(p.audioText)}
                          style={{
                            background: "rgba(37, 99, 235, 0.12)",
                            border: "1px solid rgba(37, 99, 235, 0.3)",
                            color: "#2563eb",
                            borderRadius: "50%",
                            width: 36,
                            height: 36,
                            cursor: "pointer",
                            fontSize: "1rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          title="پخش تلفظ انگلیسی"
                        >
                          🔊
                        </button>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 800,
                              fontSize: "1rem",
                              color: "#0f172a",
                              direction: "ltr",
                              textAlign: "left",
                              lineHeight: 1.35,
                            }}
                          >
                            🇬🇧 {p.english}
                          </div>
                          <div
                            style={{
                              fontSize: "0.88rem",
                              color: "#0d9488",
                              fontWeight: 700,
                              marginTop: "0.25rem",
                              direction: isB1B2 ? "ltr" : "rtl",
                              textAlign: isB1B2 ? "left" : "right",
                              lineHeight: 1.35,
                            }}
                          >
                            {isB1B2 ? `💠 Synonym: ${p.synonym || p.match}` : `🇮🇷 ${p.match}`}
                          </div>
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: "0.725rem",
                          background: "#e2e8f0",
                          color: "#475569",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "0.4rem",
                          fontWeight: 600,
                        }}
                      >
                        {p.contextFa || "کتاب‌های منبع"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Helper to render individual tile completely stationary without continuous kinetic motion
  const renderTile = (
    tile: ActiveTile,
    useGridPosition: boolean = true
  ) => {
    const isSelected = selectedTile?.tileId === tile.tileId;

    const styleObj: React.CSSProperties = {
      ...(useGridPosition
        ? {
            gridColumn: `${tile.col + 1}`,
            gridRow: `${tile.row + 1}`,
          }
        : {}),
    };

    const isMainWord = isB1B2 && tile.side === "english";
    const isSynonym = isB1B2 && tile.side === "match";

    const sideClass = isMainWord
      ? styles.tileMainWord
      : isSynonym
      ? styles.tileSynonym
      : tile.side === "english"
      ? styles.tileEnglish
      : styles.tilePersian;

    return (
      <div
        key={tile.tileId}
        style={styleObj}
        className={`${styles.cascadeTile} ${sideClass} ${
          isSelected ? styles.tileSelected : ""
        } ${tile.isExploding ? styles.tileExploding : ""} ${
          tile.isShaking ? styles.tileShaking : ""
        } ${tile.isFalling ? styles.tileShuffling : ""}`}
        onClick={() => handleTileClick(tile)}
      >
        {/* Subtle category or language chip */}
        <span
          style={{
            position: "absolute",
            top: "5px",
            right: tile.side === "english" || isB1B2 ? "auto" : "8px",
            left: tile.side === "english" || isB1B2 ? "8px" : "auto",
            fontSize: "0.66rem",
            fontWeight: 800,
            opacity: 0.95,
            letterSpacing: "0.02em",
            color: isSelected
              ? "#b45309"
              : isMainWord
              ? "#1d4ed8"
              : isSynonym
              ? "#0d9488"
              : tile.side === "english"
              ? "#2563eb"
              : "#0d9488",
          }}
        >
          {isB1B2
            ? tile.side === "english"
              ? "🔹 Main Word"
              : "💠 Synonym"
            : tile.side === "english"
            ? "🇬🇧 English"
            : "🇮🇷 ترجمه"}
        </span>

        {/* Manual Speaker Pronunciation Button (for English words and all B1/B2 synonyms) */}
        {(tile.side === "english" || isB1B2) && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              speakText(tile.audioText);
            }}
            style={{
              position: "absolute",
              top: "4px",
              right: "6px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "0.82rem",
              padding: "2px",
              opacity: 0.75,
              transition: "opacity 0.2s, transform 0.2s",
              color: isSelected ? "#b45309" : undefined,
            }}
            title="پخش تلفظ صوتی نیتیو"
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.75")}
          >
            🔊
          </button>
        )}

        {/* Context badge if available */}
        {tile.contextFa && !isB1B2 && (
          <span
            style={{
              position: "absolute",
              bottom: "4px",
              left: "6px",
              fontSize: "0.6rem",
              opacity: isSelected ? 0.9 : 0.65,
              fontWeight: 600,
              color: isSelected ? "#b45309" : "#64748b",
            }}
          >
            {tile.contextFa}
          </span>
        )}

        {/* Power-Up Special Tile Badge */}
        {tile.powerUp === "bomb" && (
          <span className={`${styles.tilePowerUpBadge} ${styles.powerUpBomb}`} title="کاشی بمب: انفجار یک جفت دیگر را پاک می‌کند!">
            💣 BOMB
          </span>
        )}
        {tile.powerUp === "freeze" && (
          <span className={`${styles.tilePowerUpBadge} ${styles.powerUpFreeze}`} title="کاشی یخ: زمان را ۴ ثانیه متوقف می‌کند!">
            ❄️ FREEZE
          </span>
        )}
        {tile.powerUp === "star" && (
          <span className={`${styles.tilePowerUpBadge} ${styles.powerUpStar}`} title="کاشی ستاره: امتیاز دوبل می‌دهد!">
            ⭐ 2X XP
          </span>
        )}

        {/* Tile Content */}
        <div
          style={{
            fontSize:
              tile.text.length > 40
                 ? "0.82rem"
                 : tile.text.length > 24
                 ? "0.88rem"
                 : "0.96rem",
            fontWeight: 800,
            lineHeight: 1.4,
            direction: isB1B2 || tile.side === "english" ? "ltr" : "rtl",
            textAlign: "center",
            padding: "0.25rem 0.4rem",
            wordBreak: "break-word",
            color: isSelected ? "#78350f" : undefined,
          }}
        >
          {tile.text}
        </div>
      </div>
    );
  };

  // =========================================================================
  // MAIN ARCADE BOARD VIEW
  // =========================================================================
  return (
    <div className={styles.arenaOverlay}>
      <SkillStageBriefingModal
        skill="vocabulary"
        cefr={level.cefr}
        levelNumber={level.levelNumber}
        isOpen={isBriefingOpen}
        onStart={() => setIsBriefingOpen(false)}
        titleFa={level.titleFa}
        titleEn={level.titleEn}
      />

      <div
        className={`${styles.cascadeArenaModal} ${
          isSupernova ? styles.supernovaActive : ""
        } ${isScreenShaking ? styles.screenShaking : ""}`}
      >
        {/* Floating Badges */}
        {floatingList.map((f) => (
          <div key={f.id} className={styles.floatingBadge} style={{ color: f.color }}>
            {f.text}
          </div>
        ))}

        {/* Top Header Cluster */}
        <div className={styles.cascadeHeaderCluster}>
          <div className={styles.cascadeMetaGroup}>
            <span className={styles.cascadeCefrBadge}>{level.cefr}</span>
            <span className={styles.cascadeStageBadge}>
              استیج {level.levelNumber} از ۱۰ ({level.titleFa})
            </span>
            <span className={styles.quotaPill}>
              🎯 {correctMatches} / {requiredMatches} جفت
            </span>
            {combo > 1 && (
              <span className={styles.cascadeComboPill}>
                ⚡ کمبو {combo}x {isSupernova ? "🔥 سوپرنوا" : ""}
              </span>
            )}
          </div>

          <div className={styles.cascadeScoreBox}>
            <BriefingTriggerButton onClick={() => setIsBriefingOpen(true)} />

            {canAdvance && onNextLevel && !isGameOver && (
              <button
                type="button"
                className={styles.headerAdvanceBtn}
                onClick={handleAdvanceNextStage}
                title="حد نصاب مرحله کسب شد! کلیک کنید تا به مرحله بعد بروید"
              >
                <span>🚀</span>
                <span>رفتن به مرحله بعد</span>
              </button>
            )}

            <div className={styles.cascadeScoreDisplay}>
              🏆 {score.toLocaleString("fa-IR")}
            </div>

            <button
              type="button"
              className={styles.cascadeMuteBtn}
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? "وصل صدا" : "قطع صدا"}
            >
              {isMuted ? "🔇" : "🔊"}
            </button>

            <button
              type="button"
              className={styles.cascadeCloseBtn}
              onClick={onClose}
              title="خروج از بازی"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Energy & Countdown Bar */}
        <div className={styles.cascadeEnergyTrack}>
          <div
            className={`${styles.cascadeEnergyFill} ${
              isDangerTime ? styles.cascadeEnergyDanger : ""
            } ${isTimerFrozen ? styles.timerFrozen : ""}`}
            style={{ width: `${energyPercent}%` }}
          />
        </div>

        {/* Question / Teacher Motivational Tip & Time info */}
        <div className={styles.cascadeTeacherTip}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span>{teacherTip}</span>
          </div>
          <span
            className={`${isDangerTime && !isTimerFrozen ? styles.timerPulsing : ""} ${
              isTimerFrozen ? styles.timerFrozen : ""
            }`}
            style={{
              fontWeight: 800,
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              color: isTimerFrozen ? "#ffffff" : isDangerTime ? "#ef4444" : "#2563eb",
              background: isTimerFrozen
                ? undefined
                : isDangerTime
                ? "rgba(239, 68, 68, 0.12)"
                : "rgba(37, 99, 235, 0.1)",
            }}
          >
            {isTimerFrozen ? "❄️ زمان یخ‌زده!" : `⏳ ${Math.ceil(timeLeft)} ثانیه`}
          </span>
        </div>

        {/* Stage Passed Live Celebration Banner */}
        {canAdvance && onNextLevel && !isGameOver && (
          <div className={styles.stagePassedBanner}>
            <div className={styles.stagePassedInfo}>
              <span className={styles.stagePassedIcon}>🎯</span>
              <div>
                <div className={styles.stagePassedHeading}>
                  حد نصاب این مرحله کسب شد ({correctMatches} از {requiredMatches} تطابق صحیح)!
                </div>
                <div className={styles.stagePassedSubtext}>
                  می‌توانید به مرحله بعد بروید، یا برای شکستن رکورد به بازی ادامه دهید.
                </div>
              </div>
            </div>
            <button
              type="button"
              className={styles.stagePassedActionBtn}
              onClick={handleAdvanceNextStage}
            >
              🚀 رفتن به مرحله بعد
            </button>
          </div>
        )}

        {/* Visual Guide Header: Main Words vs Synonyms (B1/B2) or English vs Persian (A1/A2) */}
        {isB1B2 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.45rem 1rem",
              background: "rgba(255, 255, 255, 0.82)",
              backdropFilter: "blur(10px)",
              borderRadius: "0.75rem",
              margin: "0 0 0.65rem 0",
              border: "1.5px solid rgba(226, 232, 240, 0.9)",
              fontWeight: 800,
              fontSize: "0.85rem",
              direction: "ltr",
            }}
          >
            <div style={{ color: "#1e3a8a", display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <span>⬅️</span>
              <span>🔹 Main Words (Left)</span>
            </div>
            <div className={styles.synonymPromptBadge}>
              🔍 Find Synonyms
            </div>
            <div style={{ color: "#0f766e", display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <span>💠 Synonyms (Right)</span>
              <span>➡️</span>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.35rem 0.9rem",
              background: "rgba(255, 255, 255, 0.72)",
              borderRadius: "0.6rem",
              margin: "0 0 0.55rem 0",
              fontSize: "0.82rem",
              fontWeight: 800,
            }}
          >
            <span style={{ color: "#1e3a8a" }}>🇬🇧 کلمات انگلیسی (آبی)</span>
            <span style={{ color: "#0f766e" }}>🇮🇷 ترجمه فارسی (سبزآبی تیره Teal)</span>
          </div>
        )}

        {/* Tiles Board: Unified 4x4 Grid with Spacious Physical Collisions */}
        <div className={styles.cascadeGrid}>
          {tiles
            .slice()
            .sort((a, b) => a.row * COLS + a.col - (b.row * COLS + b.col))
            .map((tile) => renderTile(tile, true))}
        </div>

        {/* Bottom Status bar */}
        <div className={styles.cascadeBottomBar}>
          <div>
            <span>تطابق‌های موفق: </span>
            <strong style={{ color: "#0d9488" }}>{correctMatches}</strong>
            <span style={{ margin: "0 0.5rem" }}>|</span>
            <span>دقت فعلی: </span>
            <strong style={{ color: "#2563eb" }}>
              {totalAttempts > 0
                ? Math.round((correctMatches / totalAttempts) * 100)
                : 100}
              ٪
            </strong>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>حد نصاب قبولی استیج: </span>
            <span
              style={{
                background: "rgba(13, 148, 136, 0.12)",
                color: "#0d9488",
                padding: "0.15rem 0.45rem",
                borderRadius: "0.3rem",
                fontWeight: 800,
              }}
            >
              ۷۰٪
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

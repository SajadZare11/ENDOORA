"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./writing-clue.module.css";
import type { GameLevel } from "../../../data/skills/games/types";
import {
  getWritingStageCase,
  getWritingDailyBounty,
} from "../../../data/skills/games/writing-clue-curriculum";
import type {
  WritingStageCase,
  WritingTheme,
} from "../../../data/skills/games/writing-clue-types";
import { recordWritingCaseCompletion } from "../../../lib/skills/game-storage";
import { soundSynth } from "../../../lib/skills/game-audio";
import { SkillStageBriefingModal } from "./SkillStageBriefingModal";

interface Props {
  level: GameLevel;
  onClose: () => void;
  onNextLevel?: () => void;
  onOpenLeaderboard?: () => void;
}

export function WritingClueHunterArena({
  level,
  onClose,
  onNextLevel,
  onOpenLeaderboard,
}: Props) {
  const stageCase: WritingStageCase | undefined = getWritingStageCase(
    level.cefr,
    level.levelNumber
  );

  // Fallback if data is missing
  const fallbackCase: WritingStageCase = {
    levelNumber: level.levelNumber,
    cefr: level.cefr,
    theme: "word-bot-factory",
    themeTitleFa: "کارخانه روبات‌های کلمه‌ساز",
    caseCode: `CASE-${level.cefr}-${level.levelNumber}`,
    stageTitleEn: level.titleEn,
    stageTitleFa: level.titleFa,
    scenarioFa: level.descriptionFa,
    locationFa: "مرکز کارآگاهی",
    pillar: "word-order-punctuation",
    xpReward: level.xpReward || 80,
    timeLimitSeconds: 70,
    round1: {
      id: "fallback-r1",
      roundTitleFa: "مونتاژ قطعات",
      promptFa: "جمله را مرتب کنید:",
      promptEn: "Order the sentence:",
      hintFa: "نظم طبیعی فاعل و فعل",
      goldenRuleFa: "نظم جمله در انگلیسی: S + V + O",
      scrambledChips: [
        { id: "c1", text: "The" },
        { id: "c2", text: "clue" },
        { id: "c3", text: "is" },
        { id: "c4", text: "here." },
      ],
      correctSequence: ["The", "clue", "is", "here."],
      assembledSentence: "The clue is here.",
    },
    round2: {
      id: "fallback-r2",
      roundTitleFa: "کلمه ربط",
      contextFa: "شواهد اولیه بررسی شد:",
      sentenceA: "We found the map",
      sentenceB: "we followed the footprints.",
      targetSlot: "We found the map [___] we followed the footprints.",
      connectorOptions: [
        { text: "and", isCorrect: true, explanationFa: "and برای اتصال دو رخداد هم‌راستاست." },
        { text: "but", isCorrect: false, explanationFa: "تضادی وجود ندارد." },
      ],
    },
    round3: {
      id: "fallback-r3",
      roundTitleFa: "تایپ رمز",
      briefFa: "کلمه نهایی را تایپ کنید:",
      briefEn: "Type the target word:",
      templateSentence: "The case is now [___].",
      targetBlank: "solved",
      acceptableAnswers: ["solved", "closed"],
      typingHintFa: "کلمه به معنی حل شده (s-o-l-v-e-d)",
      explanationFa: "case is solved",
    },
  };

  const activeCase = stageCase || fallbackCase;
  const dailyBounty = getWritingDailyBounty();
  const isDailyBounty =
    dailyBounty.cefr === level.cefr && dailyBounty.levelNumber === level.levelNumber;

  // Active Investigative Round: 1, 2, or 3
  const [currentRound, setCurrentRound] = useState<1 | 2 | 3>(1);

  // Scoring & Stats
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [stylePoints, setStylePoints] = useState<number>(0);
  const [mistakesCount, setMistakesCount] = useState<number>(0);

  // Timer
  const [secondsLeft, setSecondsLeft] = useState<number>(activeCase.timeLimitSeconds);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [showBriefing, setShowBriefing] = useState<boolean>(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Gentle Magnifier Modal State (ذره‌بین مهربان)
  const [magnifierInfo, setMagnifierInfo] = useState<{
    isOpen: boolean;
    title: string;
    text: string;
  } | null>(null);

  // Round 1 (Fragment Assembly) State
  const [availableChips, setAvailableChips] = useState<
    Array<{ id: string; text: string; isDistractor?: boolean; distractorReasonFa?: string }>
  >([]);
  const [placedChips, setPlacedChips] = useState<
    Array<{ id: string; text: string; isDistractor?: boolean; distractorReasonFa?: string }>
  >([]);
  const [shakeDistractorId, setShakeDistractorId] = useState<string | null>(null);

  // Round 2 (Connector & Lexical Upgrade) State
  const [selectedConnectorIdx, setSelectedConnectorIdx] = useState<number | null>(null);
  const [connectorFeedback, setConnectorFeedback] = useState<"correct" | "wrong" | null>(null);
  const [selectedUpgradeIdx, setSelectedUpgradeIdx] = useState<number | null>(null);

  // Round 3 (Punchline Typing) State
  const [typedInput, setTypedInput] = useState<string>("");
  const [typingFeedback, setTypingFeedback] = useState<"correct" | "wrong" | null>(null);

  // Case Solved State
  const [isCaseSolved, setIsCaseSolved] = useState<boolean>(false);
  const [summaryOutcome, setSummaryOutcome] = useState<{
    finalScore: number;
    accuracyPct: number;
    stars: number;
    xpEarned: number;
    speedBonus: number;
  } | null>(null);

  // Initialize Round 1 chips
  useEffect(() => {
    if (activeCase?.round1) {
      // Shuffle chips initially for puzzle engagement
      const chips = [...activeCase.round1.scrambledChips].sort(() => Math.random() - 0.5);
      setAvailableChips(chips);
      setPlacedChips([]);
      setCurrentRound(1);
      setScore(0);
      setCombo(0);
      setStylePoints(0);
      setMistakesCount(0);
      setSecondsLeft(activeCase.timeLimitSeconds);
      setIsCaseSolved(false);
      setSummaryOutcome(null);
      setShowBriefing(true);
      setIsTimerPaused(false);
    }
  }, [activeCase]);

  // Start mission handler from briefing
  const handleStartMission = () => {
    setShowBriefing(false);
    setIsTimerPaused(false);
    soundSynth.playClick();
  };

  // Countdown Timer
  useEffect(() => {
    if (isCaseSolved || isTimerPaused || showBriefing || secondsLeft <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCaseSolved, isTimerPaused, showBriefing, secondsLeft]);

  // Handle clicking an available chip in Round 1
  const handlePickChip = (chip: {
    id: string;
    text: string;
    isDistractor?: boolean;
    distractorReasonFa?: string;
  }) => {
    soundSynth.playClick();

    if (chip.isDistractor) {
      // Distractor trap triggered! Shake and show gentle magnifier
      soundSynth.playWrong();
      setShakeDistractorId(chip.id);
      setCombo(0);
      setMistakesCount((c) => c + 1);
      setMagnifierInfo({
        isOpen: true,
        title: "تله سرنخ اشتباه!",
        text: chip.distractorReasonFa || "این قطعه برای این جمله مناسب نیست؛ یک بار دیگر دقت کنید.",
      });
      setTimeout(() => setShakeDistractorId(null), 500);
      return;
    }

    // Place chip
    setAvailableChips((prev) => prev.filter((c) => c.id !== chip.id));
    setPlacedChips((prev) => [...prev, chip]);
  };

  // Remove a placed chip back to available pool
  const handleReturnChip = (chip: { id: string; text: string }) => {
    soundSynth.playClick();
    setPlacedChips((prev) => prev.filter((c) => c.id !== chip.id));
    setAvailableChips((prev) => [...prev, chip]);
  };

  // Check Round 1 Sentence
  const handleVerifyRound1 = () => {
    const placedSequence = placedChips.map((c) => c.text);
    const correctSequence = activeCase.round1.correctSequence;

    const isMatch =
      placedSequence.length === correctSequence.length &&
      placedSequence.every((val, idx) => val === correctSequence[idx]);

    if (isMatch) {
      soundSynth.playCorrect();
      const points = 120 + combo * 20;
      setScore((s) => s + points);
      setCombo((c) => c + 1);
      setStylePoints((sp) => sp + 30);

      // Transition smoothly to Round 2
      setTimeout(() => {
        setCurrentRound(2);
      }, 600);
    } else {
      soundSynth.playWrong();
      setCombo(0);
      setMistakesCount((c) => c + 1);
      setMagnifierInfo({
        isOpen: true,
        title: "نظم کلمات نیاز به بازبینی دارد",
        text: activeCase.round1.goldenRuleFa || activeCase.round1.hintFa,
      });
    }
  };

  // Round 2: Select Connector
  const handleSelectConnector = (idx: number) => {
    const option = activeCase.round2.connectorOptions[idx];
    if (!option) return;

    setSelectedConnectorIdx(idx);

    if (option.isCorrect) {
      soundSynth.playCorrect();
      setConnectorFeedback("correct");
      const points = 150 + combo * 25;
      setScore((s) => s + points);
      setCombo((c) => c + 1);
      setStylePoints((sp) => sp + 40);

      // If there is a lexical upgrade, wait a moment; otherwise move to Round 3
      if (!activeCase.round2.lexicalUpgrade) {
        setTimeout(() => {
          setCurrentRound(3);
        }, 900);
      }
    } else {
      soundSynth.playWrong();
      setConnectorFeedback("wrong");
      setCombo(0);
      setMistakesCount((c) => c + 1);
      setMagnifierInfo({
        isOpen: true,
        title: "کلمه ربط اشتباه!",
        text: option.explanationFa || "این کلمه ربط تناسب معنایی مناسب با دو بخش جمله ندارد.",
      });
    }
  };

  // Round 2: Select Lexical Upgrade
  const handleSelectUpgrade = (idx: number) => {
    const upgrade = activeCase.round2.lexicalUpgrade?.upgrades[idx];
    if (!upgrade) return;

    setSelectedUpgradeIdx(idx);

    if (upgrade.isCorrect) {
      soundSynth.playCombo(combo + 1);
      setStylePoints((sp) => sp + 50);
      setTimeout(() => {
        setCurrentRound(3);
      }, 700);
    } else {
      soundSynth.playWrong();
      setMagnifierInfo({
        isOpen: true,
        title: "واژه پیشنهادی دقیق‌تر",
        text: upgrade.explanationFa || "این واژه برای سبک نگارش این پرونده مناسب نیست.",
      });
    }
  };

  // Round 3: Check Typed Punchline
  const handleVerifyRound3 = () => {
    const cleaned = typedInput.trim().toLowerCase().replace(/[.,!?;]/g, "");
    const targetCleaned = activeCase.round3.targetBlank.trim().toLowerCase().replace(/[.,!?;]/g, "");
    const accepted = activeCase.round3.acceptableAnswers.map((a) =>
      a.trim().toLowerCase().replace(/[.,!?;]/g, "")
    );

    const isMatch = cleaned === targetCleaned || accepted.includes(cleaned);

    if (isMatch) {
      soundSynth.playFanfare();
      setTypingFeedback("correct");

      const speedBonus = Math.max(0, secondsLeft * 5);
      const totalPoints = score + 200 + speedBonus + stylePoints;
      const accuracy = Math.max(70, Math.round(100 - mistakesCount * 10));
      const stars = mistakesCount === 0 ? 3 : mistakesCount <= 2 ? 2 : 1;

      // Save to storage
      const outcome = recordWritingCaseCompletion(level.cefr, level.levelNumber, {
        caseCode: activeCase.caseCode,
        finalScore: totalPoints,
        accuracyPct: accuracy,
        speedBonus,
        stylePoints,
        stars,
        passed: true,
        baseXp: activeCase.xpReward,
        isDailyBounty,
      });

      setSummaryOutcome({
        finalScore: totalPoints,
        accuracyPct: accuracy,
        stars,
        xpEarned: outcome.xpEarned || activeCase.xpReward,
        speedBonus,
      });

      setIsCaseSolved(true);
    } else {
      soundSynth.playWrong();
      setTypingFeedback("wrong");
      setCombo(0);
      setMistakesCount((c) => c + 1);
      setMagnifierInfo({
        isOpen: true,
        title: "نکته تایپ سرنخ",
        text: activeCase.round3.typingHintFa || "یک بار دیگر املای کلمه را بررسی کنید.",
      });
    }
  };

  // Determine theme style class
  const themeClass =
    activeCase.theme === "word-bot-factory"
      ? styles.themeWordBot
      : activeCase.theme === "noir-evidence-board"
      ? styles.themeNoirBoard
      : styles.themeCyberIntel;

  return (
    <div className={styles.modalBackdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`${styles.arenaContainer} ${themeClass}`}>
        {/* ================================================================
            STAGE CONTEXT BRIEFING MODAL (1-sentence context + 1-sentence mission)
            ================================================================ */}
        <SkillStageBriefingModal
          skill="writing"
          cefr={level.cefr}
          levelNumber={level.levelNumber}
          isOpen={showBriefing}
          onStart={handleStartMission}
          titleFa={activeCase.stageTitleFa}
          titleEn={activeCase.stageTitleEn}
        />

        {/* Top Header Bar */}
        <div className={styles.topBar}>
          <div className={styles.caseIdentity}>
            <span className={styles.caseIcon}>
              {activeCase.theme === "word-bot-factory"
                ? "🤖"
                : activeCase.theme === "noir-evidence-board"
                ? "🕵️"
                : "🛰️"}
            </span>
            <div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <span className={styles.caseCode}>{activeCase.caseCode}</span>
                <span className={styles.themeBadge}>{activeCase.themeTitleFa}</span>
                {isDailyBounty && (
                  <span
                    style={{
                      background: "#fef08a",
                      color: "#854d0e",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      padding: "0.2rem 0.5rem",
                      borderRadius: "0.4rem",
                    }}
                  >
                    👑 پرونده طلایی روز
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.statsCluster}>
            <button
              className={styles.briefingToggleBtn}
              onClick={() => {
                setIsTimerPaused(true);
                setShowBriefing(true);
              }}
              title="مرور سناریو و مأموریت پرونده"
              type="button"
            >
              📜 سناریو و راهنما
            </button>

            <div className={`${styles.timerBadge} ${secondsLeft <= 15 ? styles.timerLow : ""}`}>
              ⏳ {secondsLeft}s
            </div>

            <div className={styles.scoreBadge}>🏆 {score} PTS</div>

            {combo >= 2 && <div className={styles.comboBadge}>🔥 x{combo}</div>}

            <button className={styles.closeBtn} onClick={onClose} title="بستن">
              ✕
            </button>
          </div>
        </div>

        {/* Round Stepper */}
        <div className={styles.stepperTrack}>
          <div
            className={`${styles.stepPill} ${
              currentRound === 1
                ? styles.stepActive
                : currentRound > 1
                ? styles.stepCompleted
                : ""
            }`}
          >
            <span className={styles.stepNumber}>۱</span>
            <span>مونتاژ قطعات جمله</span>
          </div>

          <div
            className={`${styles.stepPill} ${
              currentRound === 2
                ? styles.stepActive
                : currentRound > 2
                ? styles.stepCompleted
                : ""
            }`}
          >
            <span className={styles.stepNumber}>۲</span>
            <span>کلمات ربط و ارتقا</span>
          </div>

          <div
            className={`${styles.stepPill} ${
              currentRound === 3 ? styles.stepActive : ""
            }`}
          >
            <span className={styles.stepNumber}>۳</span>
            <span>تایپ رمز نهایی</span>
          </div>
        </div>

        {/* Case Scenario Briefing */}
        <div className={styles.briefingCard}>
          <div>
            <div className={styles.scenarioTitle}>
              {activeCase.stageTitleFa} ({activeCase.stageTitleEn})
            </div>
            <div className={styles.scenarioText}>{activeCase.scenarioFa}</div>
            <div className={styles.locationPin}>📍 {activeCase.locationFa}</div>
          </div>
        </div>

        {/* ================================================================
            ROUND 1: FRAGMENT TILE PUZZLE
            ================================================================ */}
        {currentRound === 1 && (
          <div className={styles.roundContainer}>
            <div className={styles.promptBanner}>
              🧩 {activeCase.round1.promptFa}
            </div>

            {/* Assembled Tray (LTR) */}
            <div
              className={`${styles.assemblyTray} ${
                placedChips.length > 0 ? styles.assemblyTrayActive : ""
              }`}
            >
              {placedChips.length === 0 ? (
                <div className={styles.emptyTrayPlaceholder}>
                  روی کلمات زیر بزنید تا سر جای خود در جمله قرار بگیرند...
                </div>
              ) : (
                placedChips.map((chip) => (
                  <button
                    key={`placed-${chip.id}`}
                    className={`${styles.wordChip} ${styles.wordChipPlaced}`}
                    onClick={() => handleReturnChip(chip)}
                    title="کلیک برای بازگشت"
                  >
                    {chip.text} ✕
                  </button>
                ))
              )}
            </div>

            {/* Available Chips Pool */}
            <div className={styles.chipGrid}>
              {availableChips.map((chip) => (
                <button
                  key={`avail-${chip.id}`}
                  className={`${styles.wordChip} ${
                    shakeDistractorId === chip.id ? styles.wordChipDistractorShake : ""
                  }`}
                  onClick={() => handlePickChip(chip)}
                >
                  {chip.text}
                </button>
              ))}
            </div>

            <div className={styles.trayActions}>
              {placedChips.length > 0 && (
                <button
                  className={styles.clearBtn}
                  onClick={() => {
                    setAvailableChips([...placedChips, ...availableChips]);
                    setPlacedChips([]);
                  }}
                >
                  ↺ پاک کردن
                </button>
              )}

              <button
                className={styles.submitBtn}
                onClick={handleVerifyRound1}
                disabled={placedChips.length === 0}
              >
                تایید چینش قطعات ✓
              </button>
            </div>
          </div>
        )}

        {/* ================================================================
            ROUND 2: CONNECTOR & LEXICAL UPGRADE
            ================================================================ */}
        {currentRound === 2 && (
          <div className={styles.roundContainer}>
            <div className={styles.promptBanner}>
              🔗 {activeCase.round2.contextFa}
            </div>

            <div className={styles.connectorCard}>
              <div className={styles.targetSlotDisplay}>
                {activeCase.round2.targetSlot.replace("[___]", " ") && (
                  <>
                    <span>{activeCase.round2.sentenceA} </span>
                    <span className={styles.highlightSlot}>
                      {selectedConnectorIdx !== null
                        ? activeCase.round2.connectorOptions[selectedConnectorIdx]?.text
                        : "[ جای خالی کلمه ربط ]"}
                    </span>
                    <span> {activeCase.round2.sentenceB}</span>
                  </>
                )}
              </div>

              <div className={styles.connectorGrid}>
                {activeCase.round2.connectorOptions.map((opt, idx) => (
                  <button
                    key={`conn-${idx}`}
                    className={`${styles.connectorOptionBtn} ${
                      selectedConnectorIdx === idx && connectorFeedback === "correct"
                        ? styles.connectorSelectedCorrect
                        : selectedConnectorIdx === idx && connectorFeedback === "wrong"
                        ? styles.connectorSelectedWrong
                        : ""
                    }`}
                    onClick={() => handleSelectConnector(idx)}
                  >
                    <span>{opt.text}</span>
                  </button>
                ))}
              </div>

              {/* Optional Lexical Upgrade */}
              {activeCase.round2.lexicalUpgrade && connectorFeedback === "correct" && (
                <div className={styles.upgradeBox}>
                  <div className={styles.upgradePrompt}>
                    ✨ ارتقای استایل کارآگاهی: {activeCase.round2.lexicalUpgrade.promptFa}
                  </div>
                  <div className={styles.upgradeOptionGrid}>
                    {activeCase.round2.lexicalUpgrade.upgrades.map((upg, idx) => (
                      <button
                        key={`upg-${idx}`}
                        className={styles.upgradeBtn}
                        onClick={() => handleSelectUpgrade(idx)}
                      >
                        {upg.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================
            ROUND 3: PUNCHLINE TYPING
            ================================================================ */}
        {currentRound === 3 && (
          <div className={styles.typingContainer}>
            <div className={styles.promptBanner}>
              ✍️ {activeCase.round3.briefFa}
            </div>

            <div className={styles.typingTemplateCard}>
              {activeCase.round3.templateSentence.replace(
                "[___]",
                `[ ${typedInput || " ... "} ]`
              )}
            </div>

            <div className={styles.inputGroup}>
              <input
                type="text"
                className={styles.typeInput}
                placeholder="تایپ کلمه یا عبارت مورد نظر به انگلیسی..."
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleVerifyRound3();
                  }
                }}
                autoFocus
              />

              {activeCase.round3.quickChips && activeCase.round3.quickChips.length > 0 && (
                <div className={styles.typingHelperRow}>
                  <span className={styles.helperLabel}>راهنمای سریع لمسی:</span>
                  {activeCase.round3.quickChips.map((chip, idx) => (
                    <button
                      key={`qc-${idx}`}
                      type="button"
                      className={styles.quickChipBtn}
                      onClick={() => setTypedInput(chip)}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                className={styles.submitBtn}
                onClick={handleVerifyRound3}
                disabled={!typedInput.trim()}
              >
                ثبت سند نهایی و حل پرونده 🚀
              </button>
            </div>
          </div>
        )}

        {/* ================================================================
            GENTLE MAGNIFIER DRAWER / POPUP (ذره‌بین مهربان)
            ================================================================ */}
        {magnifierInfo?.isOpen && (
          <div className={styles.magnifierModal}>
            <div className={styles.magnifierIcon}>🔍</div>
            <div className={styles.magnifierContent}>
              <div className={styles.magnifierTitle}>{magnifierInfo.title}</div>
              <div className={styles.magnifierText}>{magnifierInfo.text}</div>
              <button
                className={styles.magnifierGotItBtn}
                onClick={() => setMagnifierInfo(null)}
              >
                متوجه شدم، تلاش مجدد ✓
              </button>
            </div>
          </div>
        )}

        {/* ================================================================
            CASE SOLVED CELEBRATION OVERLAY
            ================================================================ */}
        {isCaseSolved && summaryOutcome && (
          <div className={styles.caseSolvedOverlay}>
            <div className={styles.stampBadge}>پرونده با موفقیت حل شد! 🎖️</div>

            <div className={styles.starsRow}>
              {Array.from({ length: summaryOutcome.stars }).map((_, i) => (
                <span key={i} style={{ animation: `bounceCombo 0.4s ease ${i * 0.15}s` }}>
                  ⭐
                </span>
              ))}
            </div>

            <div className={styles.summaryScoreGrid}>
              <div className={styles.summaryScoreItem}>
                <span className={styles.summaryScoreVal}>
                  +{summaryOutcome.xpEarned} XP
                </span>
                <span className={styles.summaryScoreLabel}>امتیاز تجربه کسب‌شده</span>
              </div>

              <div className={styles.summaryScoreItem}>
                <span className={styles.summaryScoreVal}>
                  {summaryOutcome.finalScore}
                </span>
                <span className={styles.summaryScoreLabel}>مجموع امتیاز پرونده</span>
              </div>

              <div className={styles.summaryScoreItem}>
                <span className={styles.summaryScoreVal}>
                  {summaryOutcome.accuracyPct}%
                </span>
                <span className={styles.summaryScoreLabel}>دقت نگارش</span>
              </div>
            </div>

            <div className={styles.celebrationActionRow}>
              {level.levelNumber < 10 && onNextLevel && (
                <button className={styles.nextLevelBtn} onClick={onNextLevel}>
                  پرونده مرحله بعد ←
                </button>
              )}

              {onOpenLeaderboard && (
                <button className={styles.replayBtn} onClick={onOpenLeaderboard}>
                  🏆 مشاهده جدول افتخارات شهر
                </button>
              )}

              <button className={styles.replayBtn} onClick={onClose}>
                بازگشت به نقشه مراحل
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

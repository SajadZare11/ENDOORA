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
import {
  evaluateStudentWriting,
  ERROR_TAXONOMY,
  LEVEL_REQUIREMENTS,
  getStageRequirements,
  getStageScenarioPrompt,
  type WritingEvaluationOutput,
} from "../../../lib/skills/writing-evaluator";

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

  // Phase Workflow: Warm-up -> Main Draft 1 -> Self-Editing Draft 2 -> Final Result
  type ArenaPhase = "warmup" | "main-draft1" | "self-editing-draft2" | "final-result";
  const [phase, setPhase] = useState<ArenaPhase>("warmup");

  // Active Investigative Warm-up Round: 1, 2, or 3
  const [currentRound, setCurrentRound] = useState<1 | 2 | 3>(1);

  // Main Writing Task States
  const [draft1Text, setDraft1Text] = useState<string>("");
  const [draft2Text, setDraft2Text] = useState<string>("");
  const [draft1Eval, setDraft1Eval] = useState<WritingEvaluationOutput | null>(null);
  const [finalEval, setFinalEval] = useState<WritingEvaluationOutput | null>(null);

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
  const arenaRef = useRef<HTMLDivElement | null>(null);

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

  // Target Vocabulary Deck for Live Checklist
  const targetWordsList = React.useMemo(() => {
    if (activeCase.targetVocabularyDeck && activeCase.targetVocabularyDeck.length > 0) {
      return activeCase.targetVocabularyDeck;
    }
    const list: Array<{ id: string; wordEn: string; meaningFa: string; cefrLevel: string }> = [];
    if (activeCase.round3.targetBlank) {
      list.push({
        id: "tw-1",
        wordEn: activeCase.round3.targetBlank,
        meaningFa: activeCase.round3.explanationFa?.slice(0, 36) || "واژه کلیدی سناریو",
        cefrLevel: level.cefr,
      });
    }
    if (activeCase.round2.lexicalUpgrade?.upgrades?.[0]?.text) {
      list.push({
        id: "tw-2",
        wordEn: activeCase.round2.lexicalUpgrade.upgrades[0].text,
        meaningFa: "واژه ارتقایافته",
        cefrLevel: level.cefr,
      });
    }
    const correctConn = activeCase.round2.connectorOptions?.find((c) => c.isCorrect);
    if (correctConn) {
      list.push({
        id: "tw-3",
        wordEn: correctConn.text,
        meaningFa: "کلمه ربط طلایی",
        cefrLevel: level.cefr,
      });
    }
    return list;
  }, [activeCase, level.cefr]);

  // Detected simple words that can be upgraded
  const detectedUpgradeTip = React.useMemo(() => {
    if (!typedInput) return null;
    const simpleWordSuggestions: Record<string, string> = {
      good: "fantastic یا impressive",
      nice: "friendly یا pleasant",
      bad: "terrible یا unacceptable",
      big: "substantial یا prominent",
      happy: "delighted یا cheerful",
      sad: "gloomy یا distressed",
      like: "appreciate یا admire",
    };
    const words = typedInput.toLowerCase().split(/\s+/);
    for (const w of words) {
      const cleanW = w.replace(/[.,!?;]/g, "");
      if (simpleWordSuggestions[cleanW]) {
        return `✨ پیشنهاد ارتقای لغوی کتاب: می‌توانی به جای «${cleanW}» از «${simpleWordSuggestions[cleanW]}» استفاده کنی!`;
      }
    }
    return null;
  }, [typedInput]);

  // Initialize Round 1 chips
  useEffect(() => {
    if (activeCase?.round1) {
      // Shuffle chips initially for puzzle engagement
      const chips = [...activeCase.round1.scrambledChips].sort(() => Math.random() - 0.5);
      setAvailableChips(chips);
      setPlacedChips([]);
      setCurrentRound(1);
      setPhase("warmup");
      setDraft1Text("");
      setDraft2Text("");
      setDraft1Eval(null);
      setFinalEval(null);
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

  // Aggregate Suggested Words from Warm-up for Main Writing Task
  const suggestedWords = React.useMemo(() => {
    const s = new Set<string>();
    activeCase.round1.correctSequence.forEach((w) => {
      const c = w.replace(/[.,!?;]/g, "").trim();
      if (c.length > 2 && !["the", "and", "but", "for"].includes(c.toLowerCase())) {
        s.add(c);
      }
    });
    const conn = activeCase.round2.connectorOptions?.find((c) => c.isCorrect);
    if (conn) s.add(conn.text.trim());
    const upg = activeCase.round2.lexicalUpgrade?.upgrades?.find((u) => u.isCorrect);
    if (upg) s.add(upg.text.trim());
    if (activeCase.round3.targetBlank) s.add(activeCase.round3.targetBlank.trim());
    if (activeCase.targetVocabularyDeck) {
      activeCase.targetVocabularyDeck.forEach((t) => s.add(t.wordEn.trim()));
    }
    return Array.from(s);
  }, [activeCase]);

  // Stage-specific requirements (escalates from stage 1 to 10)
  const stageReq = React.useMemo(() => {
    return getStageRequirements(level.cefr, level.levelNumber);
  }, [level.cefr, level.levelNumber]);

  // Stage-specific scenario prompt
  const stagePromptFa = React.useMemo(() => {
    return getStageScenarioPrompt(activeCase, level.cefr, level.levelNumber);
  }, [activeCase, level.cefr, level.levelNumber]);

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

  // Reset scroll position when transitioning between phases
  useEffect(() => {
    if (arenaRef.current) {
      arenaRef.current.scrollTop = 0;
    }
  }, [phase]);

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

  // Round 3: Check Typed Punchline (Completes Warm-up & activates Main Writing Task)
  const handleVerifyRound3 = () => {
    const cleaned = typedInput.trim().toLowerCase().replace(/[.,!?;]/g, "");
    const targetCleaned = activeCase.round3.targetBlank.trim().toLowerCase().replace(/[.,!?;]/g, "");
    const accepted = activeCase.round3.acceptableAnswers.map((a) =>
      a.trim().toLowerCase().replace(/[.,!?;]/g, "")
    );

    const isMatch = cleaned === targetCleaned || accepted.includes(cleaned);

    if (isMatch) {
      soundSynth.playCorrect();
      setTypingFeedback("correct");
      const bonus = 150 + stylePoints;
      setScore((s) => s + bonus);
      setCombo((c) => c + 1);

      // Transition to Main Writing Task
      setTimeout(() => {
        setPhase("main-draft1");
      }, 700);
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

  // Submit Draft 1 for Coded Feedback (Self-Editing)
  const handleSubmitDraft1 = () => {
    if (!draft1Text.trim()) return;
    const evaluation = evaluateStudentWriting(
      draft1Text,
      level.cefr,
      suggestedWords,
      "draft1",
      0,
      level.levelNumber
    );
    setDraft1Eval(evaluation);
    setDraft2Text(draft1Text);
    setPhase("self-editing-draft2");
    soundSynth.playClick();
  };

  // Submit Draft 2 for Final Scoring and Progression
  const handleSubmitDraft2 = () => {
    if (!draft2Text.trim()) return;
    const evaluation = evaluateStudentWriting(
      draft2Text,
      level.cefr,
      suggestedWords,
      "draft2",
      draft1Eval?.score || 0,
      level.levelNumber
    );
    setFinalEval(evaluation);

    const speedBonus = Math.max(0, secondsLeft * 3);
    const totalPoints = score + evaluation.score * 5 + (evaluation.improvementBonusXp || 0) + speedBonus;
    const stars = evaluation.score >= 85 ? 3 : evaluation.score >= 70 ? 2 : 1;

    // Save to storage
    const outcome = recordWritingCaseCompletion(level.cefr, level.levelNumber, {
      caseCode: activeCase.caseCode,
      finalScore: totalPoints,
      accuracyPct: evaluation.score,
      speedBonus,
      stylePoints: evaluation.improvementBonusXp || 0,
      stars,
      passed: evaluation.isReadyForNextLevel,
      baseXp: activeCase.xpReward + (evaluation.improvementBonusXp || 0),
      isDailyBounty,
    });

    setSummaryOutcome({
      finalScore: totalPoints,
      accuracyPct: evaluation.score,
      stars,
      xpEarned: outcome.xpEarned || activeCase.xpReward + (evaluation.improvementBonusXp || 0),
      speedBonus,
    });

    soundSynth.playFanfare();
    setIsCaseSolved(true);
    setPhase("final-result");
    if (arenaRef.current) {
      arenaRef.current.scrollTop = 0;
    }
  };

  // Render Draft 1 with Color-Coded Error Tags
  const renderAnnotatedDraft1 = () => {
    if (!draft1Eval || draft1Eval.detectedErrors.length === 0) {
      return <span>{draft1Text}</span>;
    }
    const sorted = [...draft1Eval.detectedErrors].sort((a, b) => a.startIndex - b.startIndex);
    const elements: React.ReactNode[] = [];
    let lastIdx = 0;

    sorted.forEach((err, idx) => {
      if (err.startIndex > lastIdx) {
        elements.push(<span key={`txt-${idx}`}>{draft1Text.slice(lastIdx, err.startIndex)}</span>);
      }
      const tax = ERROR_TAXONOMY[err.code] || ERROR_TAXONOMY.SENTENCE;
      elements.push(
        <span key={`err-${idx}`} className={styles.codedErrorItem} title={err.shortHintFa}>
          <span
            className={styles.codedTagAbove}
            style={{ background: tax.color, color: "#ffffff" }}
          >
            [{err.code}]
          </span>
          <mark
            className={styles.codedTextMark}
            style={{
              background: tax.bgColor,
              color: tax.textColor,
              borderBottomColor: tax.color,
            }}
          >
            {err.originalText}
          </mark>
        </span>
      );
      lastIdx = Math.max(lastIdx, err.endIndex);
    });

    if (lastIdx < draft1Text.length) {
      elements.push(<span key="txt-end">{draft1Text.slice(lastIdx)}</span>);
    }

    return elements;
  };

  const themeClass =
    activeCase.theme === "word-bot-factory"
      ? styles.themeWordBot
      : activeCase.theme === "noir-evidence-board"
      ? styles.themeNoirBoard
      : styles.themeCyberIntel;

  return (
    <div className={styles.modalBackdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={arenaRef} className={`${styles.arenaContainer} ${themeClass}`}>
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
        {phase !== "final-result" ? (
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
        ) : (
          <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", paddingBottom: "0.25rem", flexShrink: 0 }}>
            <button className={styles.closeBtn} onClick={onClose} title="بستن">
              ✕
            </button>
          </div>
        )}

        {/* Phase & Round Stepper */}
        {phase !== "final-result" && (
          <div className={styles.stepperTrack}>
            {phase === "warmup" ? (
              <>
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
                  <span>دست‌گرمی: قطعات جمله</span>
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
                  <span>دست‌گرمی: کلمات ربط</span>
                </div>

                <div
                  className={`${styles.stepPill} ${
                    currentRound === 3 ? styles.stepActive : ""
                  }`}
                >
                  <span className={styles.stepNumber}>۳</span>
                  <span>دست‌گرمی: رمز نهایی</span>
                </div>
              </>
            ) : (
              <>
                <div className={`${styles.stepPill} ${styles.stepCompleted}`}>
                  <span className={styles.stepNumber}>✓</span>
                  <span>دست‌گرمی کلمات</span>
                </div>

                <div
                  className={`${styles.stepPill} ${
                    phase === "main-draft1"
                      ? styles.stepActive
                      : styles.stepCompleted
                  }`}
                >
                  <span className={styles.stepNumber}>۴</span>
                  <span>نگارش اصلی (Draft 1)</span>
                </div>

                <div
                  className={`${styles.stepPill} ${
                    phase === "self-editing-draft2" ? styles.stepActive : ""
                  }`}
                >
                  <span className={styles.stepNumber}>۵</span>
                  <span>خودویرایشی با کدها</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* ================================================================
            WARM-UP INVESTIGATIVE ROUNDS (1, 2, 3)
            ================================================================ */}
        {phase === "warmup" && (
          <>
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

            {/* Live Target Vocabulary Deck (Checklist) */}
            <div className={styles.vocabDeckBox}>
              <div className={styles.vocabDeckHeader}>
                <span className={styles.vocabDeckTitle}>
                  📋 چک‌لیست زنده واژگان هدف سطح {level.cefr} (Books & CEFR):
                </span>
                <span className={styles.vocabDeckScoreBadge}>
                  {targetWordsList.filter((item) =>
                    typedInput.toLowerCase().includes(item.wordEn.toLowerCase())
                  ).length} / {targetWordsList.length} واژه به کار رفته
                </span>
              </div>

              <div className={styles.vocabChipsGrid}>
                {targetWordsList.map((item) => {
                  const isChecked = typedInput
                    .toLowerCase()
                    .includes(item.wordEn.toLowerCase());
                  return (
                    <div
                      key={item.id}
                      className={`${styles.vocabDeckChip} ${
                        isChecked ? styles.vocabDeckChipChecked : ""
                      }`}
                      title={item.meaningFa}
                    >
                      <span className={styles.vocabCheckmark}>{isChecked ? "✓" : "○"}</span>
                      <span>{item.wordEn}</span>
                      <small style={{ opacity: 0.7, fontSize: "0.7rem" }}>
                        ({item.meaningFa})
                      </small>
                    </div>
                  );
                })}
              </div>

              {detectedUpgradeTip && (
                <div className={styles.upgradePromptToast}>
                  {detectedUpgradeTip}
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                className={styles.submitBtn}
                onClick={handleVerifyRound3}
                disabled={!typedInput.trim()}
              >
                تکمیل دست‌گرمی و ورود به تسک اصلی رایتینگ 🚀
              </button>
            </div>
          </div>
        )}
      </>
    )}

    {/* ================================================================
        MAIN WRITING TASK: DRAFT 1
        ================================================================ */}
        {phase === "main-draft1" && (
          <div className={styles.mainWritingSection}>
            <div className={styles.taskHeaderBanner}>
              <div className={styles.taskTopRow}>
                <span className={styles.taskTitleText}>
                  📝 تسک اصلی رایتینگ سطح {level.cefr} - پیش‌نویس اول (Draft 1)
                </span>
                <span className={styles.taskGenreBadge}>
                  {stageReq.genreFa}
                </span>
              </div>
              <div className={styles.taskScenarioPrompt}>
                <strong>سناریو و موضوع: </strong>
                {stagePromptFa}
              </div>
            </div>

            {/* Suggested Words Box */}
            <div className={styles.suggestedBox}>
              <div className={styles.suggestedHeader}>
                <span>💡 کلمات کلیدی پیشنهادی از بخش دست‌گرمی (Books & CEFR):</span>
                <span style={{ fontSize: "0.8rem", color: "#10b981", fontWeight: 700 }}>
                  {suggestedWords.filter((w) => draft1Text.toLowerCase().includes(w.toLowerCase())).length} / {suggestedWords.length} کلمه استفاده شده
                </span>
              </div>
              <div className={styles.suggestedChipsRow}>
                {suggestedWords.map((word, idx) => {
                  const isUsed = draft1Text.toLowerCase().includes(word.toLowerCase());
                  return (
                    <span
                      key={`sw-${idx}`}
                      className={`${styles.suggestedChip} ${isUsed ? styles.suggestedChipUsed : ""}`}
                    >
                      {isUsed ? "✓" : "○"} {word}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Editor Textarea */}
            <div className={styles.writingEditorWrapper}>
              <textarea
                className={styles.writingTextarea}
                placeholder={`متن انگلیسی خود را اینجا بنویسید (حداقل ${stageReq.minSentences} جمله و ${stageReq.minWords} کلمه)...`}
                value={draft1Text}
                onChange={(e) => setDraft1Text(e.target.value)}
                autoFocus
              />
              <div className={styles.wordCountBar}>
                <span>
                  تعداد کلمات:{" "}
                  <strong
                    className={
                      (draft1Text.trim() ? draft1Text.trim().split(/\s+/).length : 0) >=
                      stageReq.minWords
                        ? styles.wordCountMet
                        : ""
                    }
                  >
                    {draft1Text.trim() ? draft1Text.trim().split(/\s+/).length : 0}
                  </strong>{" "}
                  / حداقل {stageReq.minWords} کلمه
                </span>
                <span>
                  تعداد جملات:{" "}
                  <strong
                    className={
                      (draft1Text.trim()
                        ? draft1Text.trim().split(/[.!?]+/).filter((s) => s.trim().length > 0).length
                        : 0) >= stageReq.minSentences
                        ? styles.wordCountMet
                        : ""
                    }
                  >
                    {draft1Text.trim()
                      ? draft1Text.trim().split(/[.!?]+/).filter((s) => s.trim().length > 0).length
                      : 0}
                  </strong>{" "}
                  / حداقل {stageReq.minSentences} جمله
                </span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                type="button"
                className={styles.briefingToggleBtn}
                onClick={() => setPhase("warmup")}
              >
                ← مرور دست‌گرمی
              </button>

              <button
                type="button"
                className={styles.submitBtn}
                onClick={handleSubmitDraft1}
                disabled={!draft1Text.trim()}
              >
                ارسال پیش‌نویس ۱ و دریافت کدهای خودویرایشی 🔍
              </button>
            </div>
          </div>
        )}

        {/* ================================================================
            MAIN WRITING TASK: SELF-EDITING (DRAFT 2)
            ================================================================ */}
        {phase === "self-editing-draft2" && draft1Eval && (
          <div className={styles.mainWritingSection}>
            <div className={styles.taskHeaderBanner} style={{ borderLeftColor: "#8b5cf6" }}>
              <div className={styles.taskTopRow}>
                <span className={styles.taskTitleText}>
                  🔍 مرحله خودویرایشی (Self-Editing) - پیش‌نویس دوم
                </span>
                <span className={styles.taskGenreBadge} style={{ background: "#8b5cf6" }}>
                  نمره پیش‌نویس ۱: {draft1Eval.score} از ۱۰۰
                </span>
              </div>
              <div className={styles.taskScenarioPrompt}>
                با توجه به کدهای خطای رنگی در متن بالا، اشتباهات را خودتان پیدا کرده و در کادر ویرایشگر اصلاح نمایید.
                پاسخ مستقیم ارائه نشده است تا مهارت خودویرایشی و تحلیل شما تقویت شود.
              </div>
            </div>

            <div className={styles.selfEditingLayout}>
              {/* Left Column: Coded Draft 1 Preview + Draft 2 Editor */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className={styles.codedFeedbackDisplay}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#64748b" }}>
                    متن پیش‌نویس اول با کدهای خطای شناسایی‌شده:
                  </div>
                  <div className={styles.codedAnnotatedText}>
                    {renderAnnotatedDraft1()}
                  </div>
                </div>

                <div className={styles.writingEditorWrapper}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#334155" }}>
                    ✏️ پیش‌نویس اصلاح‌شده شما (Draft 2):
                  </label>
                  <textarea
                    className={styles.writingTextarea}
                    value={draft2Text}
                    onChange={(e) => setDraft2Text(e.target.value)}
                    placeholder="متن اصلاح‌شده خود را اینجا بنویسید..."
                    autoFocus
                  />
                  <div className={styles.wordCountBar}>
                    <span>
                      کلمات:{" "}
                      <strong
                        className={
                          (draft2Text.trim() ? draft2Text.trim().split(/\s+/).length : 0) >=
                          stageReq.minWords
                            ? styles.wordCountMet
                            : ""
                        }
                      >
                        {draft2Text.trim() ? draft2Text.trim().split(/\s+/).length : 0}
                      </strong>{" "}
                      / حداقل {stageReq.minWords} کلمه
                    </span>
                    <span>
                      جملات:{" "}
                      <strong
                        className={
                          (draft2Text.trim()
                            ? draft2Text.trim().split(/[.!?]+/).filter((s) => s.trim().length > 0).length
                            : 0) >= stageReq.minSentences
                            ? styles.wordCountMet
                            : ""
                        }
                      >
                        {draft2Text.trim()
                          ? draft2Text.trim().split(/[.!?]+/).filter((s) => s.trim().length > 0).length
                          : 0}
                      </strong>{" "}
                      / حداقل {stageReq.minSentences} جمله
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    className={styles.submitBtn}
                    onClick={handleSubmitDraft2}
                    disabled={!draft2Text.trim()}
                  >
                    ثبت نهایی اصلاحات و محاسبه نمره 🚀
                  </button>
                </div>
              </div>

              {/* Right Column: Error Code Legend */}
              <div className={styles.codedLegendBox}>
                <div className={styles.legendTitle}>
                  <span>🏷️ راهنمای کدهای خطا</span>
                </div>
                <div className={styles.legendList}>
                  {Object.values(ERROR_TAXONOMY).map((tax) => (
                    <div key={tax.code} className={styles.legendItem}>
                      <span
                        className={styles.legendCodePill}
                        style={{
                          background: tax.bgColor,
                          color: tax.textColor,
                          border: `1px solid ${tax.color}`,
                        }}
                      >
                        [{tax.code}]
                      </span>
                      <div>
                        <strong>{tax.titleFa}:</strong> {tax.descriptionFa}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
            FINAL CELEBRATION & REVIEW
            ================================================================ */}
        {phase === "final-result" && summaryOutcome && (
          <div className={styles.caseSolvedOverlay}>
            <div className={styles.stampBadge}>مرحله با موفقیت به پایان رسید! 🎖️</div>

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
                <span className={styles.summaryScoreLabel}>مجموع امتیاز مرحله</span>
              </div>

              <div className={styles.summaryScoreItem}>
                <span className={styles.summaryScoreVal}>
                  {summaryOutcome.accuracyPct}%
                </span>
                <span className={styles.summaryScoreLabel}>دقت نگارش و لغات</span>
              </div>
            </div>

            {/* Improvement Bonus Banner */}
            {finalEval && finalEval.improvementBonusXp && finalEval.improvementBonusXp > 0 && (
              <div className={styles.improvementBanner}>
                <span>
                  🌟 جهش نمره از {draft1Eval?.score} به {finalEval.score}!
                </span>
                <span>+{finalEval.improvementBonusXp} XP پاداش خودویرایشی</span>
              </div>
            )}

            {/* Student's Final Written Text */}
            <div className={styles.finalSubmittedTextBox}>
              <div className={styles.finalSubmittedTextHeader}>
                <span>📝 متن نهایی نگارش‌شده شما:</span>
                <span className={styles.finalWordCountBadge}>
                  {(draft2Text || draft1Text).trim().split(/\s+/).filter(Boolean).length} کلمه •{" "}
                  {(draft2Text || draft1Text).trim().split(/[.!?]+/).filter((s) => s.trim().length > 0).length} جمله
                </span>
              </div>
              <div className={styles.finalSubmittedTextContent}>
                {draft2Text || draft1Text}
              </div>
            </div>

            {/* Final Concise Direct Corrections or Perfect Notice */}
            {finalEval && finalEval.detectedErrors.length > 0 ? (
              <div className={styles.finalCorrectionSection}>
                <div className={styles.finalCorrectionTitle}>
                  📌 تصحیح اشکالات نهایی:
                </div>
                <div className={styles.correctionCardsGrid}>
                  {finalEval.detectedErrors.map((err) => (
                    <div key={err.id} className={styles.correctionCard}>
                      <span className={styles.correctionWrong}>{err.originalText}</span>
                      <span className={styles.correctionArrow}>➔</span>
                      <span className={styles.correctionRight}>{err.directCorrection}</span>
                      <span
                        className={styles.legendCodePill}
                        style={{
                          background: ERROR_TAXONOMY[err.code]?.bgColor,
                          color: ERROR_TAXONOMY[err.code]?.textColor,
                        }}
                      >
                        [{err.code}]
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.perfectTextNotice}>
                <span>✨ تمام اشکالات برطرف شدند و متن نهایی بدون نقص است!</span>
              </div>
            )}

            {/* Secret Quest Unlock Reward (Unlocked when score or accuracy >= 85%) */}
            {summaryOutcome.accuracyPct >= 85 && (
              <div className={styles.secretQuestBanner}>
                <div className={styles.secretQuestHeader}>
                  <span className={styles.secretQuestTitle}>
                    🗝️ ماموریت ویژه باز شد! (نمره بالای ۸۵٪)
                  </span>
                  <span className={styles.secretQuestCode}>
                    SECRET-QUEST-{level.cefr}
                  </span>
                </div>
                <div className={styles.secretQuestDesc}>
                  با تسلط بر ساختار و لغات این مرحله، قفل ماموریت ویژه را باز کردید! ۵۰+ XP امتیاز ویژه به شما تعلق گرفت.
                </div>
              </div>
            )}

            <div className={styles.celebrationActionRow}>
              {level.levelNumber < 10 && onNextLevel && (
                <button className={styles.nextLevelBtn} onClick={onNextLevel}>
                  مرحله بعد ←
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

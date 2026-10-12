"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./skills-game.module.css";
import { GameLevel } from "../../../data/skills/games/types";
import {
  ContinuousDialogueScenario,
  DialogueTurn,
  getScenarioForStage,
  getScenariosForLevel,
} from "../../../data/skills/games/continuous-dialogues";
import {
  recordSpeedDialogueCompletion,
  formatStopwatchTime,
  getStageBestTime,
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

interface PlacedTurn {
  turnIndex: number;
  partnerPrompt: string;
  userReply: string;
  targetIdiom: string;
  contextFa: string;
  isCorrect: boolean;
}

interface DeckCardItem {
  id: string;
  text: string;
  isUsed: boolean;
  correspondingTurnIndex?: number; // matching turn index if it's a correct comeback
  isDistractor: boolean;
  targetIdiom?: string;
  contextFa?: string;
}

export function SpeedDialogueArena({
  level,
  onClose,
  onNextLevel,
  onOpenLeaderboard,
}: Props) {
  const isC2 = level.cefr === "C2";
  const cefrKey: "C1" | "C2" = isC2 ? "C2" : "C1";

  // Active scenario from continuous dialogue bank
  const [scenario, setScenario] = useState<ContinuousDialogueScenario>(() =>
    getScenarioForStage(cefrKey, level.levelNumber)
  );

  // Completed turns placed in the left chat stream
  const [placedTurns, setPlacedTurns] = useState<PlacedTurn[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);

  // Deck of cards available on the right side
  const [deckCards, setDeckCards] = useState<DeckCardItem[]>([]);

  // Stopwatch & Game State (Forward counting stopwatch!)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [penaltySeconds, setPenaltySeconds] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [combo, setCombo] = useState(1);
  const [maxCombo, setMaxCombo] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isBriefingOpen, setIsBriefingOpen] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [isEvaluationLocked, setIsEvaluationLocked] = useState(false);

  // Visual alerts
  const [penaltyToast, setPenaltyToast] = useState<{ id: number; text: string } | null>(null);
  const [nuanceAlert, setNuanceAlert] = useState<{ text: string; note: string } | null>(null);
  const [missedTurns, setMissedTurns] = useState<DialogueTurn[]>([]);

  const stopwatchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const leftStreamRef = useRef<HTMLDivElement | null>(null);
  const toastCounter = useRef(0);
  const personalBestTime = useRef(0);

  // Native audio speaker helper
  const speakDialogue = useCallback(
    (text?: string, speaker: "partner" | "user" = "partner") => {
      if (isMuted || typeof window === "undefined" || !text) return;
      const accent = scenario.partnerFlag.includes("🇬🇧") ? "en-GB" : "en-US";
      playEnglishSpeech(text, { accent, rate: speaker === "user" ? 0.98 : 0.94 });
    },
    [isMuted, scenario.partnerFlag]
  );

  // Stop speech and unlock body scroll on unmount
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "contain";
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.overscrollBehavior = originalOverscroll;
      stopEnglishSpeech();
    };
  }, []);

  // Initialize or Restart scenario session
  const startSession = useCallback(
    (chosenScenario?: ContinuousDialogueScenario) => {
      const activeScn = chosenScenario || getScenarioForStage(cefrKey, level.levelNumber);
      setScenario(activeScn);
      personalBestTime.current = getStageBestTime("vocabulary", activeScn.cefr, level.levelNumber);

      // Assemble all cards for right side: all scenario comebacks + 2 distractors
      const correctCards: DeckCardItem[] = activeScn.turns.map((t) => ({
        id: `card-correct-${t.turnIndex}-${Date.now()}`,
        text: t.correctComeback,
        isUsed: false,
        correspondingTurnIndex: t.turnIndex,
        isDistractor: false,
        targetIdiom: t.targetIdiom,
        contextFa: t.contextFa,
      }));

      const distractorCards: DeckCardItem[] = activeScn.distractorPool.slice(0, 2).map((d, i) => ({
        id: `card-distractor-${i}-${Date.now()}`,
        text: d,
        isUsed: false,
        isDistractor: true,
      }));

      // Deeply shuffle all cards together
      const fullDeck = [...correctCards, ...distractorCards].sort(() => 0.5 - Math.random());
      setDeckCards(fullDeck);

      // Reset gameplay state
      setPlacedTurns([]);
      setCurrentTurnIndex(0);
      setElapsedSeconds(0);
      setPenaltySeconds(0);
      setWrongAttempts(0);
      setCombo(1);
      setMaxCombo(1);
      setIsGameOver(false);
      setIsBriefingOpen(true);
      setIsEvaluationLocked(false);
      setNuanceAlert(null);
      setMissedTurns([]);

      // Start initial partner greeting (manual speech only upon clicking speaker icon)
      setIsPartnerTyping(true);
      setTimeout(() => {
        setIsPartnerTyping(false);
      }, 400);
    },
    [cefrKey, level.levelNumber]
  );

  // Mount effect
  useEffect(() => {
    startSession();
  }, [startSession]);

  // Stopwatch timer interval (counts UP every 100ms)
  useEffect(() => {
    if (isGameOver || isBriefingOpen) {
      if (stopwatchTimerRef.current) clearInterval(stopwatchTimerRef.current);
      return;
    }

    stopwatchTimerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => Number((prev + 0.1).toFixed(1)));
    }, 100);

    return () => {
      if (stopwatchTimerRef.current) clearInterval(stopwatchTimerRef.current);
    };
  }, [isGameOver]);

  // Auto-scroll left stream to bottom
  useEffect(() => {
    if (leftStreamRef.current) {
      leftStreamRef.current.scrollTop = leftStreamRef.current.scrollHeight;
    }
  }, [placedTurns, currentTurnIndex, isPartnerTyping]);

  // Trigger temporary penalty toast
  const triggerPenaltyToast = (penalty: number) => {
    const id = ++toastCounter.current;
    setPenaltyToast({ id, text: `⚠️ +${penalty}s جریمه زمانی!` });
    setTimeout(() => {
      setPenaltyToast((prev) => (prev?.id === id ? null : prev));
    }, 1100);
  };

  // Handle player clicking an answer card on the right
  const handleSelectCard = (card: DeckCardItem) => {
    if (isEvaluationLocked || isGameOver || card.isUsed || isPartnerTyping) return;

    const currentTurn = scenario.turns[currentTurnIndex];
    if (!currentTurn) return;

    // Check if clicked card is the correct comeback for the active turn
    const isCorrect = !card.isDistractor && card.correspondingTurnIndex === currentTurnIndex;

    if (isCorrect) {
      // SUCCESSFUL COMEBACK!
      if (!isMuted) soundSynth.playCorrect();

      // Mark card as used in deck
      setDeckCards((prev) =>
        prev.map((c) => (c.id === card.id ? { ...c, isUsed: true } : c))
      );

      // Record placed turn in the left stream
      const newPlaced: PlacedTurn = {
        turnIndex: currentTurnIndex,
        partnerPrompt: currentTurn.partnerPrompt,
        userReply: card.text,
        targetIdiom: currentTurn.targetIdiom,
        contextFa: currentTurn.contextFa,
        isCorrect: true,
      };
      setPlacedTurns((prev) => [...prev, newPlaced]);

      // Boost combo
      setCombo((prev) => {
        const next = prev + 1;
        if (next > maxCombo) setMaxCombo(next);
        return next;
      });
      setNuanceAlert(null);

      const nextTurnIdx = currentTurnIndex + 1;

      if (nextTurnIdx >= scenario.turns.length) {
        // ENTIRE CONTINUOUS SCENARIO COMPLETED!
        setTimeout(() => {
          handleScenarioVictory();
        }, 800);
      } else {
        // Advance to next turn in the continuous storyline
        setCurrentTurnIndex(nextTurnIdx);
        setIsPartnerTyping(true);
        setTimeout(() => {
          setIsPartnerTyping(false);
        }, 500);
      }
    } else {
      // MISTAKE / WRONG COMEBACK FOR THIS TURN
      if (!isMuted) soundSynth.playWrong();
      setCombo(1);
      setWrongAttempts((prev) => prev + 1);

      // Apply 3-second penalty
      setPenaltySeconds((prev) => prev + 3);
      triggerPenaltyToast(3);

      // Nuance educational hint
      setNuanceAlert({
        text: `💡 اصطلاح متناسب این نوبت: "${currentTurn.correctComeback}"`,
        note: currentTurn.contextFa,
      });

      if (!missedTurns.some((t) => t.turnIndex === currentTurn.turnIndex)) {
        setMissedTurns((prev) => [...prev, currentTurn]);
      }
    }
  };

  // Scenario Victory handler
  const handleScenarioVictory = () => {
    setIsGameOver(true);
    if (!isMuted) soundSynth.playFanfare();

    const totalTime = Number((elapsedSeconds + penaltySeconds).toFixed(1));
    const totalTurns = scenario.turns.length;
    const accuracy =
      totalTurns + wrongAttempts > 0
        ? Math.round((totalTurns / (totalTurns + wrongAttempts)) * 100)
        : 100;

    recordSpeedDialogueCompletion(
      level.skill,
      scenario.cefr,
      level.levelNumber,
      totalTime,
      accuracy,
      totalTurns,
      totalTurns + wrongAttempts,
      level.xpReward || 150
    );
  };

  // Keyboard shortcut listener (1, 2, 3, 4, 5, 6)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEvaluationLocked || isGameOver || isPartnerTyping) return;
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1) {
        // Map to available (unused) cards
        const availableCards = deckCards.filter((c) => !c.isUsed);
        const targetCard = availableCards[num - 1];
        if (targetCard) {
          handleSelectCard(targetCard);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEvaluationLocked, isGameOver, isPartnerTyping, deckCards, handleSelectCard]);

  // Calculations for display
  const totalOfficialTime = Number((elapsedSeconds + penaltySeconds).toFixed(1));
  const activePrompt = scenario.turns[currentTurnIndex];
  const progressPercent = Math.round(
    (placedTurns.length / scenario.turns.length) * 100
  );

  // Available unused cards for right deck
  const unusedCards = deckCards.filter((c) => !c.isUsed);

  // =========================================================================
  // GAME OVER / VICTORY MODAL VIEW
  // =========================================================================
  if (isGameOver) {
    const accuracy =
      scenario.turns.length + wrongAttempts > 0
        ? Math.round(
            (scenario.turns.length /
              (scenario.turns.length + wrongAttempts)) *
              100
          )
        : 100;
    const isNewRecord =
      personalBestTime.current === 0 || totalOfficialTime < personalBestTime.current;

    return (
      <div className={styles.arenaOverlay}>
        <div className={styles.speedArenaModal}>
          <div style={{ textAlign: "center", padding: "1.5rem 1rem" }}>
            <span style={{ fontSize: "3.5rem" }}>
              {isNewRecord ? "🏆" : "⚡"}
            </span>

            <h2
              style={{
                fontSize: "1.6rem",
                fontWeight: 900,
                color: "#1e293b",
                margin: "0.5rem 0",
              }}
            >
              {isNewRecord
                ? "رکورد جدید سرعت ثبت شد!"
                : "مکالمه پیوسته با موفقیت تکمیل شد!"}
            </h2>

            <p style={{ color: "#64748b", fontSize: "0.92rem", margin: "0 0 1.25rem" }}>
              سناریو: {scenario.titleFa} ({scenario.topicEn})
            </p>

            {/* Performance Metric Dashboard */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: "0.75rem",
                margin: "1rem 0 1.5rem",
              }}
            >
              {/* Total Time */}
              <div
                style={{
                  background: "#eff6ff",
                  padding: "0.85rem",
                  borderRadius: "1rem",
                  border: "1.5px solid #bfdbfe",
                }}
              >
                <div style={{ fontSize: "0.78rem", color: "#1d4ed8", fontWeight: 700 }}>
                  زمان نهایی مسابقه
                </div>
                <div
                  style={{
                    fontSize: "1.65rem",
                    fontWeight: 900,
                    color: "#2563eb",
                    marginTop: "0.25rem",
                    direction: "ltr",
                  }}
                >
                  ⏱️ {formatStopwatchTime(totalOfficialTime)}
                </div>
                {penaltySeconds > 0 && (
                  <div style={{ fontSize: "0.72rem", color: "#ef4444", marginTop: 2 }}>
                    (زمان خام: {formatStopwatchTime(elapsedSeconds)} + {penaltySeconds}s جریمه)
                  </div>
                )}
              </div>

              {/* Accuracy */}
              <div
                style={{
                  background: "#f0fdf4",
                  padding: "0.85rem",
                  borderRadius: "1rem",
                  border: "1.5px solid #bbf7d0",
                }}
              >
                <div style={{ fontSize: "0.78rem", color: "#15803d", fontWeight: 700 }}>
                  دقت مکالمه
                </div>
                <div
                  style={{
                    fontSize: "1.65rem",
                    fontWeight: 900,
                    color: "#16a34a",
                    marginTop: "0.25rem",
                  }}
                >
                  🎯 {accuracy}٪
                </div>
              </div>

              {/* Best Combo */}
              <div
                style={{
                  background: "#fffbeb",
                  padding: "0.85rem",
                  borderRadius: "1rem",
                  border: "1.5px solid #fde68a",
                }}
              >
                <div style={{ fontSize: "0.78rem", color: "#b45309", fontWeight: 700 }}>
                  بالاترین کمبو
                </div>
                <div
                  style={{
                    fontSize: "1.65rem",
                    fontWeight: 900,
                    color: "#d97706",
                    marginTop: "0.25rem",
                  }}
                >
                  ⚡ {maxCombo}x
                </div>
              </div>
            </div>

            {/* Mistake & Nuance Vault */}
            {missedTurns.length > 0 && (
              <div
                style={{
                  textAlign: "right",
                  borderTop: "1px solid #e2e8f0",
                  paddingTop: "1.25rem",
                  marginTop: "1.25rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "#2563eb",
                    margin: "0 0 0.85rem",
                  }}
                >
                  📖 مرور اصطلاحات و نکات سناریو (Mistake Vault)
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {missedTurns.map((turn) => (
                    <div key={turn.turnIndex} className={styles.mistakeVaultItem}>
                      <div>
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: "0.92rem",
                            color: "#0f172a",
                            direction: "ltr",
                            textAlign: "left",
                          }}
                        >
                          💬 "{turn.partnerPrompt}"
                        </div>
                        <div
                          style={{
                            fontSize: "0.85rem",
                            color: "#059669",
                            fontWeight: 700,
                            marginTop: "0.2rem",
                            direction: "ltr",
                            textAlign: "left",
                          }}
                        >
                          ⚡ Comeback: "{turn.correctComeback}"
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          background: "#e2e8f0",
                          color: "#475569",
                          padding: "0.25rem 0.6rem",
                          borderRadius: "0.4rem",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {turn.contextFa}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.75rem",
                marginTop: "1.75rem",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                className={styles.cascadeMuteBtn}
                style={{ borderRadius: "0.75rem", padding: "0.75rem 1.25rem", width: "auto" }}
                onClick={() => {
                  const scenarios = getScenariosForLevel(cefrKey);
                  const nextScn = scenarios.find((s) => s.id !== scenario.id) || scenario;
                  startSession(nextScn);
                }}
              >
                🔄 سناریوی جدید و ارتقای رکورد
              </button>

              {onNextLevel && (
                <button
                  type="button"
                  style={{
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "0.75rem",
                    padding: "0.75rem 1.5rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
                  }}
                  onClick={onNextLevel}
                >
                  استیج بعدی ➔
                </button>
              )}

              {onOpenLeaderboard && (
                <button
                  type="button"
                  style={{
                    background: "#fef3c7",
                    border: "1.5px solid #fde68a",
                    color: "#b45309",
                    borderRadius: "0.75rem",
                    padding: "0.75rem 1.25rem",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                  onClick={onOpenLeaderboard}
                >
                  🏆 رتبه‌بندی سرعت لیدربرد
                </button>
              )}

              <button
                type="button"
                className={styles.cascadeCloseBtn}
                style={{ borderRadius: "0.75rem", padding: "0.75rem 1.25rem" }}
                onClick={onClose}
              >
                خروج
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN TWO-COLUMN SPEED DIALOGUE STREAM ARENA
  // =========================================================================
  return (
    <div className={styles.arenaOverlay}>
      <SkillStageBriefingModal
        skill="vocabulary"
        cefr={level.cefr}
        levelNumber={level.levelNumber}
        isOpen={isBriefingOpen}
        onStart={() => setIsBriefingOpen(false)}
        titleFa={scenario.titleFa || level.titleFa}
        titleEn={scenario.titleEn || level.titleEn}
      />

      <div className={styles.speedArenaModal}>
        {/* Floating Time Penalty Toast */}
        {penaltyToast && (
          <div
            className={styles.floatingBadge}
            style={{ color: "#ef4444", top: "30%" }}
          >
            {penaltyToast.text}
          </div>
        )}

        {/* Top Header: Partner Profile, Topic, Stopwatch & Controls */}
        <div className={styles.pingPongPartnerHeader}>
          <div className={styles.partnerProfile}>
            <div className={styles.partnerAvatar}>
              <span>{scenario.partnerAvatar}</span>
              <span className={styles.onlineDot} />
            </div>
            <div className={styles.partnerMeta}>
              <div className={styles.partnerName}>
                <span>{scenario.partnerName}</span>
                <span style={{ fontSize: "0.8rem", opacity: 0.75 }}>
                  ({scenario.partnerFlag})
                </span>
              </div>
              <div className={styles.partnerRole}>
                <span>{scenario.partnerRole}</span>
                <span>•</span>
                <span style={{ color: "#2563eb", fontWeight: 700 }}>
                  {scenario.titleFa}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.pingPongStatusPills}>
            <BriefingTriggerButton onClick={() => setIsBriefingOpen(true)} />

            {/* Live Forward-Counting Stopwatch Badge */}
            <div
              className={styles.speedStopwatchBadge}
              title="کرنومتر ثبت زمان تکمیل مکالمه"
            >
              <span>⏱️</span>
              <span style={{ direction: "ltr", fontVariantNumeric: "tabular-nums" }}>
                {formatStopwatchTime(totalOfficialTime)}
              </span>
            </div>

            {/* Combo */}
            {combo > 1 && (
              <span className={styles.cascadeComboPill}>
                ⚡ {combo}x {combo >= 4 ? "🔥" : ""}
              </span>
            )}

            {/* Audio Toggle */}
            <button
              type="button"
              className={styles.cascadeMuteBtn}
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? "وصل صدا" : "قطع صدا"}
            >
              {isMuted ? "🔇" : "🔊"}
            </button>

            {/* Close */}
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

        {/* Educational Tip on Mistake */}
        {nuanceAlert && (
          <div className={styles.nuanceFeedbackBox} style={{ margin: "0.5rem 0" }}>
            <div>
              <strong>{nuanceAlert.text}</strong>
              <div style={{ fontSize: "0.78rem", opacity: 0.85, marginTop: "0.15rem" }}>
                نکته و زمینه کاربرد: {nuanceAlert.note}
              </div>
            </div>
            <button
              type="button"
              onClick={() => speakDialogue(nuanceAlert.text, "user")}
              className={styles.cardAudioBtn}
              title="تلفظ اصطلاح درست"
            >
              🔊
            </button>
          </div>
        )}

        {/* TWO-COLUMN SPLIT GRID */}
        <div className={styles.speedArenaGrid}>
          {/* ⬅️ LEFT COLUMN: Continuous Dialogue Stream (جریان پیوسته چت) */}
          <div className={styles.leftStreamColumn} ref={leftStreamRef}>
            <div className={styles.columnHeaderLabel}>
              <span>💬 جریان پیوسته مکالمه ({level.cefr})</span>
              <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>
                پیشرفت سناریو: {placedTurns.length} از {scenario.turns.length}
              </span>
            </div>

            {/* Placed turns so far */}
            {placedTurns.map((turn, i) => (
              <div key={i} className={styles.completedTurnPair}>
                {/* Partner Turn */}
                <div className={styles.chatBubblePartner}>
                  <div className={styles.bubbleSpeakerLabel}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <span>{scenario.partnerName}</span>
                      <button
                        type="button"
                        onClick={() => speakDialogue(turn.partnerPrompt, "partner")}
                        className={styles.bubbleMiniAudioBtn}
                        title="پخش مجدد صدای پارتنر"
                      >
                        🔊
                      </button>
                    </div>
                  </div>
                  <div className={styles.bubbleTextPrompt}>{turn.partnerPrompt}</div>
                </div>

                {/* User Comeback */}
                <div className={styles.chatBubbleUser}>
                  <div className={styles.bubbleSpeakerLabel}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <span>You (Fast Comeback)</span>
                      <button
                        type="button"
                        onClick={() => speakDialogue(turn.userReply, "user")}
                        className={styles.bubbleMiniAudioBtn}
                        style={{ color: "#ffffff" }}
                        title="پخش مجدد صدای شما"
                      >
                        🔊
                      </button>
                    </div>
                    <span style={{ fontSize: "0.72rem" }}>✅</span>
                  </div>
                  <div className={styles.bubbleTextUser}>{turn.userReply}</div>
                </div>
              </div>
            ))}

            {/* Active Turn waiting for completion */}
            {activePrompt && (
              <div className={styles.activeTurnContainer}>
                {/* Partner's active prompt */}
                <div className={styles.chatBubblePartner}>
                  <div className={styles.bubbleSpeakerLabel}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <span>{scenario.partnerName}</span>
                      <button
                        type="button"
                        onClick={() => speakDialogue(activePrompt.partnerPrompt, "partner")}
                        className={styles.bubbleMiniAudioBtn}
                        title="پخش مجدد صدای پارتنر"
                      >
                        🔊
                      </button>
                    </div>
                    <span style={{ fontSize: "0.7rem", color: "#2563eb", fontWeight: 800 }}>
                      نوبت #{currentTurnIndex + 1}
                    </span>
                  </div>
                  <div className={styles.bubbleTextPrompt}>{activePrompt.partnerPrompt}</div>
                </div>

                {/* Partner typing indicator when speaking next sentence */}
                {isPartnerTyping ? (
                  <div className={styles.chatBubbleTyping}>
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                  </div>
                ) : (
                  /* Glowing Active Blank Slot for User's Answer */
                  <div className={styles.activeTurnSlot}>
                    <div className={styles.slotPulseDot} />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "#2563eb" }}>
                        🔘 منتظر تیکه‌کلام و پاسخ شما در مکالمه...
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "#64748b", marginTop: 2 }}>
                        کارت متناسب با این بخش از گفتگو را از پنل سمت راست انتخاب کنید
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ➡️ RIGHT COLUMN: Available Answer Cards Deck (بانک کارت‌های پاسخ) */}
          <div className={styles.rightDeckColumn}>
            <div className={styles.columnHeaderLabel}>
              <span>🃏 بانک کارت‌های پاسخ (کلیدهای کیبورد ۱ تا ۴)</span>
              <span style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 700 }}>
                {unusedCards.length} کارت باقیمانده
              </span>
            </div>

            <div className={styles.deckCardsCluster}>
              {unusedCards.map((card, idx) => (
                <div
                  key={card.id}
                  className={styles.speedDeckCard}
                  onClick={() => handleSelectCard(card)}
                >
                  <div className={styles.comebackKeyPill}>{idx + 1}</div>
                  <div className={styles.comebackText}>{card.text}</div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakDialogue(card.text, "user");
                    }}
                    className={styles.cardAudioBtn}
                    title="پیش‌شنوایی صوتی کارت"
                  >
                    🔊
                  </button>
                </div>
              ))}
            </div>

            {unusedCards.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "#059669",
                  fontWeight: 800,
                  fontSize: "1rem",
                }}
              >
                🎉 تمام پاسخ‌های سناریو در جریان مکالمه نشانده شدند!
              </div>
            )}
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className={styles.cascadeBottomBar} style={{ marginTop: "0.75rem" }}>
          <div>
            <span>نوبت داستان: </span>
            <strong style={{ color: "#2563eb" }}>
              {Math.min(currentTurnIndex + 1, scenario.turns.length)} از {scenario.turns.length}
            </strong>
            <span style={{ margin: "0 0.5rem" }}>|</span>
            <span>جریمه زمانی: </span>
            <strong style={{ color: penaltySeconds > 0 ? "#ef4444" : "#64748b" }}>
              +{penaltySeconds} ثانیه
            </strong>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span>کلیدهای سریع کیبورد: </span>
            <span style={{ color: "#64748b", fontWeight: 700 }}>
              [ 1 ] [ 2 ] [ 3 ] [ 4 ]
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./skills-game.module.css";
import { GameLevel, GameQuestion, VocabRushResult } from "../../../data/skills/games/types";
import {
  calculateQuestionScore,
  recordVocabRushCompletion,
  getLevelDailyHighScore,
  ScoreCalcResult,
} from "../../../lib/skills/game-storage";
import { soundSynth } from "../../../lib/skills/game-audio";
import { playEnglishSpeech, stopEnglishSpeech } from "../../../lib/speech";

interface Props {
  level: GameLevel;
  onClose: () => void;
  onNextLevel?: () => void;
  onOpenLeaderboard?: () => void;
}

interface ActiveCardItem {
  question: GameQuestion;
  isRedemption?: boolean;
}

interface FloatingFeedback {
  id: number;
  text: string;
  type: "bonus" | "time" | "penalty" | "redeem";
}

export function VocabTimeAttackArena({ level, onClose, onNextLevel, onOpenLeaderboard }: Props) {
  // Game state
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Deck queue & question tracking
  const [cardDeck, setCardDeck] = useState<ActiveCardItem[]>([]);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answeredState, setAnsweredState] = useState<"none" | "correct" | "wrong">("none");
  const [missedQuestions, setMissedQuestions] = useState<GameQuestion[]>([]);
  const [floatingList, setFloatingList] = useState<FloatingFeedback[]>([]);

  // Result state
  const [result, setResult] = useState<VocabRushResult | null>(null);

  // Timers and metrics
  const cardStartTimeRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const floatingIdCounter = useRef(0);

  // Daily high score before this run
  const previousDailyBest = useRef<number>(0);

  // Initialize deck and timer on mount
  useEffect(() => {
    previousDailyBest.current = getLevelDailyHighScore(level.skill, level.cefr);

    // Shuffle questions or duplicate if few to create a continuous fast-paced deck
    const baseQuestions = [...level.questions];
    // Duplicate deck 3 times to guarantee a long seamless run without running out of cards
    const initialDeck: ActiveCardItem[] = [...baseQuestions, ...baseQuestions, ...baseQuestions].map((q) => ({
      question: q,
      isRedemption: false,
    }));

    setCardDeck(initialDeck);
    setCurrentCardIdx(0);
    setTimeLeft(60);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setTotalAnswered(0);
    setIsGameOver(false);
    setMissedQuestions([]);
    cardStartTimeRef.current = Date.now();
  }, [level]);

  // High-fidelity audio TTS helper
  const speakText = useCallback((text?: string) => {
    if (typeof window === "undefined" || !text) return;
    playEnglishSpeech(text, { accent: "en-US", rate: 0.94 });
  }, []);

  useEffect(() => {
    return () => {
      stopEnglishSpeech();
    };
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (isGameOver || isPaused) return;

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
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
  }, [isGameOver, isPaused]);

  // Current active question
  const currentItem = cardDeck[currentCardIdx];
  const currentQuestion = currentItem?.question;

  // Auto-play audio on question load for dialogues
  useEffect(() => {
    if (!currentQuestion || isGameOver) return;
    setSelectedOption(null);
    setAnsweredState("none");
    cardStartTimeRef.current = Date.now();

    if (currentQuestion.speakerA?.text) {
      speakText(currentQuestion.speakerA.text);
    } else if (currentQuestion.audioText && currentQuestion.type === "chunk-fill") {
      // Auto-pronounce chunk prompts if desired
    }
  }, [currentCardIdx, currentQuestion, isGameOver, speakText]);

  // Add floating visual badge
  const triggerFloatingBadge = (text: string, type: "bonus" | "time" | "penalty" | "redeem") => {
    const id = ++floatingIdCounter.current;
    setFloatingList((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setFloatingList((prev) => prev.filter((item) => item.id !== id));
    }, 1200);
  };

  // Complete and finish round
  const handleFinishRound = useCallback(() => {
    setIsGameOver(true);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    setTotalAnswered((answeredSoFar) => {
      setCorrectCount((correctSoFar) => {
        setScore((finalScore) => {
          setMaxStreak((peakStreak) => {
            const accuracy = answeredSoFar > 0 ? Math.round((correctSoFar / answeredSoFar) * 100) : 0;
            const passed = accuracy >= 70 && answeredSoFar >= 5;

            let stars = 0;
            if (accuracy >= 95 && finalScore >= 1200) stars = 3;
            else if (accuracy >= 85 || finalScore >= 800) stars = 2;
            else if (passed) stars = 1;

            if (passed) {
              soundSynth.playFanfare();
            } else {
              soundSynth.playWrong();
            }

            const outcome = recordVocabRushCompletion(
              level.skill,
              level.cefr,
              level.levelNumber,
              finalScore,
              accuracy,
              correctSoFar,
              answeredSoFar,
              level.xpReward
            );

            setResult({
              levelNumber: level.levelNumber,
              cefr: level.cefr,
              skill: level.skill,
              finalScore,
              accuracy,
              correctCount: correctSoFar,
              totalAnswered: answeredSoFar,
              maxStreak: peakStreak,
              timeSurvivedSeconds: 60 - timeLeft,
              passed,
              stars,
              xpEarned: outcome.xpEarned,
              isDailyRecord: outcome.isDailyRecord,
              missedQuestions,
            });

            return peakStreak;
          });
          return finalScore;
        });
        return correctSoFar;
      });
      return answeredSoFar;
    });
  }, [level, missedQuestions, timeLeft]);

  // Handle option selection
  const handleSelectOption = (idx: number) => {
    if (answeredState !== "none" || !currentQuestion || isGameOver) return;

    const timeSpent = (Date.now() - cardStartTimeRef.current) / 1000;
    const isCorrect = idx === currentQuestion.correctAnswer;

    setSelectedOption(idx);
    setTotalAnswered((prev) => prev + 1);

    if (isCorrect) {
      setAnsweredState("correct");
      soundSynth.playCorrect();

      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak((prev) => Math.max(prev, newStreak));

      if (newStreak > 1) {
        soundSynth.playCombo(newStreak);
      }

      // Calculate score points with universal formula
      const calc: ScoreCalcResult = calculateQuestionScore(timeSpent, newStreak);
      setScore((prev) => prev + calc.points);
      setCorrectCount((prev) => prev + 1);

      // Add time bonus (+2s normal, +3s in fever)
      const addedTime = calc.isFever ? 3 : 2;
      setTimeLeft((prev) => prev + addedTime);

      triggerFloatingBadge(`+${calc.points} pts`, "bonus");
      triggerFloatingBadge(`+${addedTime}s`, "time");

      if (currentItem.isRedemption) {
        triggerFloatingBadge("✨ جبران شد!", "redeem");
      }

      // Move to next card after brief visual confirmation (350ms)
      setTimeout(() => {
        advanceToNextCard();
      }, 350);
    } else {
      setAnsweredState("wrong");
      soundSynth.playWrong();
      setStreak(0);

      // Time penalty (-2s)
      setTimeLeft((prev) => Math.max(0, prev - 2));
      triggerFloatingBadge("-2s", "penalty");

      // Record as missed question (for the end-of-round Mistake Vault)
      setMissedQuestions((prev) => {
        if (!prev.some((q) => q.id === currentQuestion.id)) {
          return [...prev, currentQuestion];
        }
        return prev;
      });

      // IN-ROUND REDEMPTION: Re-queue card 3 positions ahead in the active deck!
      setCardDeck((prev) => {
        const nextDeck = [...prev];
        const insertPos = Math.min(nextDeck.length, currentCardIdx + 3);
        nextDeck.splice(insertPos, 0, {
          question: currentQuestion,
          isRedemption: true,
        });
        return nextDeck;
      });

      // Advance after 550ms so user registers the mistake
      setTimeout(() => {
        advanceToNextCard();
      }, 550);
    }
  };

  const advanceToNextCard = () => {
    if (currentCardIdx + 1 < cardDeck.length) {
      setCurrentCardIdx((prev) => prev + 1);
    } else {
      handleFinishRound();
    }
  };

  const isFeverMode = streak >= 10;
  const isDangerTime = timeLeft <= 10;

  // Render Post-Game Victory & Mistake Vault Modal
  if (result) {
    return (
      <div className={styles.arenaOverlay}>
        <div className={styles.arenaCard} style={{ maxWidth: 640 }}>
          <div className={styles.victoryCard}>
            {/* Stars & Pass Badge */}
            <div className={styles.victoryStars}>
              {result.stars === 3 ? "⭐⭐⭐" : result.stars === 2 ? "⭐⭐" : result.stars === 1 ? "⭐" : "💔"}
            </div>

            <h2 className={styles.victoryTitle}>
              {result.passed ? "آفرین! مرحله با موفقیت پشت سر گذاشته شد" : "نیاز به کمی تمرین بیشتر داری"}
            </h2>

            {!result.passed && (
              <p className={styles.victoryDesc}>
                برای باز شدن مرحله بعدی، باید حداقل به ۷۰٪ دقت پاسخ‌ها برسی. یک بار دیگر امتحان کن!
              </p>
            )}

            {/* Daily Record Broken Celebration */}
            {result.isDailyRecord && (
              <div
                style={{
                  background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                  border: "2px solid #f59e0b",
                  borderRadius: "1rem",
                  padding: "0.75rem 1rem",
                  margin: "1rem 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  color: "#92400e",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                }}
              >
                <span>🔥</span>
                <span>رکورد جدید امروز برای سطح {level.cefr} ثبت شد! ({result.finalScore.toLocaleString("fa-IR")} امتیاز)</span>
              </div>
            )}

            {/* Performance Stats Grid */}
            <div className={styles.victoryStatsRow}>
              <div className={styles.victoryStatItem}>
                <span className={styles.victoryStatVal}>{result.finalScore.toLocaleString("fa-IR")}</span>
                <span className={styles.victoryStatLbl}>امتیاز نهایی</span>
              </div>
              <div className={styles.victoryStatItem}>
                <span className={styles.victoryStatVal}>{result.accuracy}٪</span>
                <span className={styles.victoryStatLbl}>دقت پاسخ‌ها</span>
              </div>
              <div className={styles.victoryStatItem}>
                <span className={styles.victoryStatVal}>+{result.xpEarned}</span>
                <span className={styles.victoryStatLbl}>XP دریافتی</span>
              </div>
              <div className={styles.victoryStatItem}>
                <span className={styles.victoryStatVal}>{result.maxStreak}x</span>
                <span className={styles.victoryStatLbl}>بزرگترین کمبو</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center", marginTop: "1.5rem" }}>
              {result.passed && onNextLevel && (
                <button className={styles.victoryActionBtn} onClick={onNextLevel}>
                  🚀 ورود به مرحله بعدی
                </button>
              )}
              <button
                className={styles.playBtn}
                onClick={() => {
                  setResult(null);
                  setTimeLeft(60);
                  setScore(0);
                  setStreak(0);
                  setMaxStreak(0);
                  setCorrectCount(0);
                  setTotalAnswered(0);
                  setIsGameOver(false);
                  setCurrentCardIdx(0);
                  setMissedQuestions([]);
                }}
              >
                🔄 بازی مجدد و شکستن رکورد
              </button>
              {onOpenLeaderboard && (
                <button
                  type="button"
                  className={styles.tabBtn}
                  onClick={onOpenLeaderboard}
                  style={{ background: "#f8fafc", borderColor: "#cbd5e1" }}
                >
                  🏆 مشاهده لیدربرد
                </button>
              )}
              <button className={styles.quitBtn} onClick={onClose}>
                بازگشت به نقشه
              </button>
            </div>

            {/* MISTAKE VAULT (دفترچه یادگیری و تثبیت اشتباهات) */}
            <div
              style={{
                marginTop: "2rem",
                textAlign: "right",
                borderTop: "1px solid #e2e8f0",
                paddingTop: "1.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#1e293b", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>📖</span>
                  <span>دفترچه مرور و تثبیت اشتباهات (Mistake Vault)</span>
                </h3>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  {result.missedQuestions.length} مورد نیازمند مرور
                </span>
              </div>

              {result.missedQuestions.length === 0 ? (
                <div
                  style={{
                    background: "#ecfdf5",
                    border: "1px solid #a7f3d0",
                    borderRadius: "0.75rem",
                    padding: "1rem",
                    textAlign: "center",
                    color: "#065f46",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                  }}
                >
                  💎 فوق‌العاده! هیچ اشتباهی نداشتی و تمام کلمات را با تسلط کامل پاسخ دادی!
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "260px", overflowY: "auto", paddingRight: "0.25rem" }}>
                  {result.missedQuestions.map((q, idx) => {
                    const correctOpt = typeof q.correctAnswer === "number" && q.options ? q.options[q.correctAnswer] : "";
                    const spokenSentence = q.speakerA?.text || correctOpt || q.audioText || q.prompt;

                    return (
                      <div
                        key={q.id || idx}
                        style={{
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "0.75rem",
                          padding: "0.85rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.35rem",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            {q.contextTagFa && (
                              <span
                                style={{
                                  fontSize: "0.7rem",
                                  background: "#eff6ff",
                                  color: "#2563eb",
                                  padding: "0.15rem 0.5rem",
                                  borderRadius: "0.35rem",
                                  fontWeight: 700,
                                  marginLeft: "0.5rem",
                                }}
                              >
                                {q.contextTagFa}
                              </span>
                            )}
                            <strong style={{ fontSize: "0.9rem", color: "#0f172a" }}>{q.prompt}</strong>
                          </div>

                          <button
                            type="button"
                            onClick={() => speakText(spokenSentence)}
                            style={{
                              background: "#f1f5f9",
                              border: "none",
                              borderRadius: "0.5rem",
                              padding: "0.35rem 0.6rem",
                              cursor: "pointer",
                              fontSize: "0.85rem",
                              color: "#0284c7",
                            }}
                            title="شنیدن تلفظ انگلیسی"
                          >
                            🔊 تلفظ
                          </button>
                        </div>

                        {correctOpt && (
                          <div style={{ fontSize: "0.85rem", color: "#16a34a", fontWeight: 700 }}>
                            پاسخ صحیح: {correctOpt}
                          </div>
                        )}

                        <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                          💡 نکته: {q.explanationFa}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.arenaOverlay}>
      <div
        className={`${styles.arenaCard} ${isFeverMode ? styles.feverActive : ""}`}
        style={{
          boxShadow: isFeverMode ? "0 0 35px rgba(239, 68, 68, 0.45)" : undefined,
          border: isFeverMode ? "2px solid #ef4444" : undefined,
        }}
      >
        {/* Top Arena Header: Stage info, Timer, Unlimited Score & Combo */}
        <div className={styles.arenaHeader} style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: "#2563eb",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
              }}
            >
              {level.levelNumber}
            </span>
            <div>
              <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>
                {level.cefr} • مرحله {level.levelNumber} از ۱۰
              </div>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800 }}>{level.titleFa}</h3>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {/* Live Score Counter */}
            <div
              style={{
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: "0.75rem",
                padding: "0.35rem 0.75rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "0.65rem", color: "#1e40af", fontWeight: 700 }}>امتیاز نامحدود</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#1d4ed8" }}>
                {score.toLocaleString("fa-IR")}
              </div>
            </div>

            {/* Streak / Fever Pill */}
            <div
              style={{
                background: isFeverMode ? "#fee2e2" : streak > 3 ? "#fef3c7" : "#f1f5f9",
                border: isFeverMode ? "1px solid #f87171" : streak > 3 ? "1px solid #fcd34d" : "1px solid #e2e8f0",
                borderRadius: "0.75rem",
                padding: "0.35rem 0.75rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "0.65rem", color: isFeverMode ? "#b91c1c" : "#64748b", fontWeight: 700 }}>
                {isFeverMode ? "🔥 FEVER 3x" : streak > 3 ? "⚡ کمبو" : "زنجیره"}
              </div>
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 900,
                  color: isFeverMode ? "#dc2626" : streak > 3 ? "#d97706" : "#475569",
                }}
              >
                {streak}x
              </div>
            </div>

            <button
              className={styles.closeArenaBtn}
              onClick={onClose}
              title="خروج از بازی"
              aria-label="خروج"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 60s Live Countdown Bar */}
        <div style={{ margin: "0.75rem 0 1.25rem", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700 }}>
              {isDangerTime ? "⚠️ زمان رو به اتمام است!" : "تایمر سرعتی (پاسخ درست = +۲ ثانیه)"}
            </span>
            <span
              style={{
                fontSize: "1.1rem",
                fontWeight: 900,
                color: isDangerTime ? "#dc2626" : "#0284c7",
                animation: isDangerTime ? "pulse 0.8s infinite" : "none",
              }}
            >
              ⏱️ {timeLeft} ثانیه
            </span>
          </div>

          <div
            style={{
              height: 10,
              background: "#e2e8f0",
              borderRadius: 5,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.min(100, (timeLeft / 60) * 100)}%`,
                background: isDangerTime
                  ? "#ef4444"
                  : isFeverMode
                  ? "linear-gradient(90deg, #f59e0b, #ef4444)"
                  : "linear-gradient(90deg, #06b6d4, #3b82f6)",
                transition: "width 0.3s ease, background 0.3s ease",
              }}
            />
          </div>

          {/* Floating score & time badge animations */}
          <div
            style={{
              position: "absolute",
              top: 15,
              right: "45%",
              pointerEvents: "none",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              zIndex: 30,
            }}
          >
            {floatingList.map((f) => (
              <span
                key={f.id}
                style={{
                  fontSize: "1rem",
                  fontWeight: 900,
                  padding: "0.2rem 0.6rem",
                  borderRadius: "0.5rem",
                  background:
                    f.type === "bonus"
                      ? "#22c55e"
                      : f.type === "time"
                      ? "#0284c7"
                      : f.type === "penalty"
                      ? "#ef4444"
                      : "#8b5cf6",
                  color: "#ffffff",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                }}
              >
                {f.text}
              </span>
            ))}
          </div>
        </div>

        {/* Current Active Question Area */}
        {currentQuestion && (
          <div style={{ position: "relative", minHeight: 280, display: "flex", flexDirection: "column" }}>
            {/* Context & Redemption Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                {currentQuestion.contextTagFa && (
                  <span
                    style={{
                      fontSize: "0.75rem",
                      background: "#f1f5f9",
                      color: "#475569",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "0.5rem",
                      fontWeight: 700,
                    }}
                  >
                    📍 موقعیت: {currentQuestion.contextTagFa}
                  </span>
                )}
                {currentItem.isRedemption && (
                  <span
                    style={{
                      fontSize: "0.75rem",
                      background: "#fef3c7",
                      color: "#92400e",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "0.5rem",
                      fontWeight: 800,
                      border: "1px solid #fde68a",
                    }}
                  >
                    🔄 جبران اشتباه (Redemption)
                  </span>
                )}
              </div>

              <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                پاسخ داده‌شده: {totalAnswered}
              </span>
            </div>

            {/* DIALOGUE MODE: Chat Bubble Turn */}
            {currentQuestion.speakerA ? (
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "1rem",
                  padding: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.4rem" }}>{currentQuestion.speakerA.avatar || "👤"}</span>
                  <div>
                    <strong style={{ fontSize: "0.9rem", color: "#1e293b" }}>
                      {currentQuestion.speakerA.name}
                    </strong>
                    {currentQuestion.speakerA.roleFa && (
                      <span style={{ fontSize: "0.75rem", color: "#64748b", marginRight: "0.5rem" }}>
                        ({currentQuestion.speakerA.roleFa})
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => speakText(currentQuestion.speakerA?.text)}
                    style={{
                      marginRight: "auto",
                      background: "#e0f2fe",
                      border: "none",
                      borderRadius: "0.5rem",
                      padding: "0.25rem 0.5rem",
                      color: "#0369a1",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                    title="پخش مجدد صدای مکالمه"
                  >
                    🔊 شنیدن
                  </button>
                </div>

                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "0.75rem",
                    padding: "0.75rem 1rem",
                    border: "1px solid #cbd5e1",
                    fontSize: "1.05rem",
                    color: "#0f172a",
                    fontWeight: 600,
                    direction: "ltr",
                    textAlign: "left",
                  }}
                >
                  "{currentQuestion.speakerA.text}"
                </div>

                <div style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#475569", fontWeight: 700 }}>
                  👉 نوبت شماست: {currentQuestion.prompt}
                </div>
              </div>
            ) : (
              /* REGULAR PROMPT: Vocab Blitz or Chunk Fill */
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: "1rem",
                  padding: "1rem 1.25rem",
                  marginBottom: "1rem",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#0f172a" }}>
                    {currentQuestion.prompt}
                  </h2>
                  {currentQuestion.promptFa && (
                    <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#64748b" }}>
                      {currentQuestion.promptFa}
                    </p>
                  )}
                </div>

                {currentQuestion.audioText && (
                  <button
                    type="button"
                    onClick={() => speakText(currentQuestion.audioText)}
                    style={{
                      background: "#e0f2fe",
                      border: "none",
                      borderRadius: "0.5rem",
                      padding: "0.4rem 0.75rem",
                      color: "#0369a1",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    🔊 تلفظ
                  </button>
                )}
              </div>
            )}

            {/* Answer Options Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "0.6rem",
                marginTop: "auto",
              }}
            >
              {currentQuestion.options?.map((option, idx) => {
                let btnStyle = {
                  background: "#ffffff",
                  borderColor: "#cbd5e1",
                  color: "#0f172a",
                };

                if (answeredState !== "none") {
                  if (idx === currentQuestion.correctAnswer) {
                    btnStyle = {
                      background: "#dcfce7",
                      borderColor: "#22c55e",
                      color: "#15803d",
                    };
                  } else if (selectedOption === idx) {
                    btnStyle = {
                      background: "#fee2e2",
                      borderColor: "#ef4444",
                      color: "#b91c1c",
                    };
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={answeredState !== "none"}
                    style={{
                      ...btnStyle,
                      borderWidth: "1.5px",
                      borderStyle: "solid",
                      borderRadius: "0.75rem",
                      padding: "0.85rem 1rem",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      textAlign: "left",
                      direction: "ltr",
                      cursor: answeredState === "none" ? "pointer" : "default",
                      transition: "transform 0.1s ease, border-color 0.15s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{option}</span>
                    {answeredState !== "none" && idx === currentQuestion.correctAnswer && (
                      <span style={{ fontSize: "1.1rem" }}>✔</span>
                    )}
                    {answeredState !== "none" && selectedOption === idx && idx !== currentQuestion.correctAnswer && (
                      <span style={{ fontSize: "1.1rem" }}>✖</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

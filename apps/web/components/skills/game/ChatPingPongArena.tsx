"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./skills-game.module.css";
import { GameLevel } from "../../../data/skills/games/types";
import {
  CascadePair,
  getShuffledCascadePairs,
  WEBSITE_BOOKS_VOCAB_BANK,
} from "../../../data/skills/games/website-books-vocab";
import {
  recordVocabRushCompletion,
  getLevelDailyHighScore,
} from "../../../lib/skills/game-storage";
import { soundSynth } from "../../../lib/skills/game-audio";
import { playEnglishSpeech, stopEnglishSpeech } from "../../../lib/speech";

interface Props {
  level: GameLevel;
  onClose: () => void;
  onNextLevel?: () => void;
  onOpenLeaderboard?: () => void;
}

interface ChatMessage {
  id: string;
  sender: "partner" | "user";
  text: string;
  timestamp: string;
  isCorrect?: boolean;
}

interface ComebackOption {
  id: string;
  text: string;
  isCorrect: boolean;
  contextFa?: string;
}

interface PartnerProfile {
  name: string;
  role: string;
  avatar: string;
  flag: string;
}

const PARTNER_PROFILES: Record<"C1" | "C2", PartnerProfile[]> = {
  C1: [
    { name: "Oliver Vance", role: "Creative Director", avatar: "👨‍💼", flag: "🇬🇧 London" },
    { name: "Claire Chen", role: "Silicon Valley PM", avatar: "👩‍💻", flag: "🇺🇸 California" },
    { name: "Julian Ross", role: "Senior Editor & Essayist", avatar: "✍️", flag: "🇨🇦 Toronto" },
  ],
  C2: [
    { name: "Prof. Alistair Finch", role: "Oxford Literary Fellow", avatar: "🎓", flag: "🇬🇧 Oxford" },
    { name: "Victoria Sterling", role: "Managing Director", avatar: "💼", flag: "🇺🇸 Manhattan" },
    { name: "Dr. Henri Moreau", role: "Diplomatic Envoy", avatar: "🌐", flag: "🇨🇭 Geneva" },
  ],
};

function formatCurrentTime(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
}

export function ChatPingPongArena({ level, onClose, onNextLevel, onOpenLeaderboard }: Props) {
  const isC2 = level.cefr === "C2";
  const cefrKey: "C1" | "C2" = isC2 ? "C2" : "C1";

  // Partner persona
  const [partner] = useState<PartnerProfile>(() => {
    const list = PARTNER_PROFILES[cefrKey];
    return list[Math.floor(Math.random() * list.length)];
  });

  // Game mechanics state
  const [dialogues, setDialogues] = useState<CascadePair[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [maxCombo, setMaxCombo] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8);
  const [partnerIsTyping, setPartnerIsTyping] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Chat message stream & current cards
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [options, setOptions] = useState<ComebackOption[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isEvaluationLocked, setIsEvaluationLocked] = useState(false);
  const [nuanceTip, setNuanceTip] = useState<{ text: string; correctText: string } | null>(null);
  const [missedPairs, setMissedPairs] = useState<CascadePair[]>([]);
  const [floatingToast, setFloatingToast] = useState<{ id: number; text: string; color: string } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chatStreamRef = useRef<HTMLDivElement | null>(null);
  const roundStartTimeRef = useRef<number>(Date.now());
  const toastCounter = useRef(0);
  const previousDailyBest = useRef(0);

  // High-fidelity native speech helper
  const speakText = useCallback(
    (text?: string, voiceGender: "partner" | "user" = "partner") => {
      if (isMuted || typeof window === "undefined" || !text) return;
      const accent = partner.flag.includes("🇬🇧") ? "en-GB" : "en-US";
      playEnglishSpeech(text, { accent, rate: voiceGender === "user" ? 0.98 : 0.94 });
    },
    [isMuted, partner.flag]
  );

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      stopEnglishSpeech();
    };
  }, []);

  // Trigger floating visual feedback
  const triggerToast = (text: string, color: string) => {
    const id = ++toastCounter.current;
    setFloatingToast({ id, text, color });
    setTimeout(() => {
      setFloatingToast((prev) => (prev?.id === id ? null : prev));
    }, 900);
  };

  // Build 3 plausible comeback options for current dialogue
  const buildOptionsForDialogue = useCallback(
    (targetPair: CascadePair, fullPool: CascadePair[]): ComebackOption[] => {
      // Correct option
      const correctOpt: ComebackOption = {
        id: `opt-correct-${targetPair.id}-${Date.now()}`,
        text: targetPair.match,
        isCorrect: true,
        contextFa: targetPair.contextFa,
      };

      // Find 2 sophisticated distractors strictly from the matching CEFR dialogue pool
      const levelDialogues = fullPool.filter(
        (p) => p.id !== targetPair.id && p.cefr === level.cefr && p.category === "dialogue"
      );
      const candidates =
        levelDialogues.length >= 2 ? levelDialogues : fullPool.filter((p) => p.id !== targetPair.id);
      const shuffledOthers = [...candidates].sort(() => 0.5 - Math.random());

      const distractor1 =
        shuffledOthers[0]?.match || "Let's revisit this matter when we have more concrete evidence.";
      const distractor2 =
        shuffledOthers[1]?.match || "That sounds reasonable, but we should not jump to conclusions.";

      const wrongOpt1: ComebackOption = {
        id: `opt-wrong-1-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        text: distractor1,
        isCorrect: false,
      };

      const wrongOpt2: ComebackOption = {
        id: `opt-wrong-2-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        text: distractor2,
        isCorrect: false,
      };

      // Shuffle the 3 options
      return [correctOpt, wrongOpt1, wrongOpt2].sort(() => 0.5 - Math.random());
    },
    [level.cefr]
  );

  // Initialize or restart stage with freshly shuffled dialogues
  const startSession = useCallback(() => {
    previousDailyBest.current = getLevelDailyHighScore(level.skill, level.cefr);
    const pool = getShuffledCascadePairs(level.cefr, level.levelNumber);
    // Take 8 pairs for a focused, high-energy comeback round
    const sessionPairs = pool.slice(0, 8);
    setDialogues(sessionPairs);
    setCurrentIndex(0);
    setLives(3);
    setScore(0);
    setCombo(1);
    setMaxCombo(1);
    setCorrectCount(0);
    setTotalAttempts(0);
    setIsGameOver(false);
    setSelectedOptionId(null);
    setIsEvaluationLocked(false);
    setNuanceTip(null);
    setMissedPairs([]);

    if (sessionPairs.length > 0) {
      const firstPair = sessionPairs[0];
      // Simulate partner initiating the banter
      setPartnerIsTyping(true);
      setTimeout(() => {
        setPartnerIsTyping(false);
        const firstMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          sender: "partner",
          text: firstPair.english,
          timestamp: formatCurrentTime(),
        };
        setChatMessages([firstMsg]);
        setOptions(buildOptionsForDialogue(firstPair, WEBSITE_BOOKS_VOCAB_BANK));
        speakText(firstPair.english, "partner");
        setTimeLeft(8);
        roundStartTimeRef.current = Date.now();
      }, 700);
    }
  }, [level, buildOptionsForDialogue, speakText]);

  // Mount effect
  useEffect(() => {
    startSession();
  }, [startSession]);

  // Auto-scroll chat area
  useEffect(() => {
    if (chatStreamRef.current) {
      chatStreamRef.current.scrollTop = chatStreamRef.current.scrollHeight;
    }
  }, [chatMessages, partnerIsTyping]);

  // Round countdown timer
  useEffect(() => {
    if (isGameOver || isEvaluationLocked || partnerIsTyping || dialogues.length === 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time expired for this comeback!
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameOver, isEvaluationLocked, partnerIsTyping, dialogues.length]);

  // Handle timeout mistake
  const handleTimeout = () => {
    if (isEvaluationLocked) return;
    setIsEvaluationLocked(true);
    setTotalAttempts((prev) => prev + 1);
    setCombo(1);
    if (!isMuted) soundSynth.playWrong();

    const currentPair = dialogues[currentIndex];
    if (currentPair) {
      setMissedPairs((prev) => [...prev, currentPair]);
      setNuanceTip({
        text: `⏰ زمان تمام شد! اصطلاح متناسب: "${currentPair.match}"`,
        correctText: currentPair.contextFa || "اصطلاح کاربردی C1/C2",
      });
    }

    setLives((prevLives) => {
      const newLives = prevLives - 1;
      if (newLives <= 0) {
        setTimeout(() => triggerGameOver(false), 1200);
      } else {
        setTimeout(() => proceedToNextDialogue(), 1800);
      }
      return newLives;
    });
  };

  // Handle player selecting a comeback card
  const handleSelectOption = (option: ComebackOption) => {
    if (isEvaluationLocked || partnerIsTyping || isGameOver) return;
    setIsEvaluationLocked(true);
    setSelectedOptionId(option.id);
    setTotalAttempts((prev) => prev + 1);

    const timeSpent = (Date.now() - roundStartTimeRef.current) / 1000;
    const currentPair = dialogues[currentIndex];

    // Push player's chosen message into chat
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text: option.text,
      timestamp: formatCurrentTime(),
      isCorrect: option.isCorrect,
    };
    setChatMessages((prev) => [...prev, userMsg]);

    if (option.isCorrect) {
      // SUCCESSFUL NATIVE COMEBACK!
      if (!isMuted) soundSynth.playCorrect();
      speakText(option.text, "user");

      // Score calculation
      const basePoints = 150;
      const speedBonus = timeSpent <= 2.8 ? 60 : timeSpent <= 4.5 ? 30 : 0;
      const comboMultiplier = combo >= 5 ? 2.0 : combo >= 3 ? 1.5 : 1.0;
      const pts = Math.round((basePoints + speedBonus) * comboMultiplier);

      setScore((prev) => prev + pts);
      setCorrectCount((prev) => prev + 1);
      setCombo((prev) => {
        const next = prev + 1;
        if (next > maxCombo) setMaxCombo(next);
        return next;
      });

      triggerToast(
        speedBonus > 0 ? `⚡ حاضر‌جوابی عالی! +${pts}` : `🎯 اصطلاح اصیل نیتیو! +${pts}`,
        "#10b981"
      );

      setNuanceTip(null);
      setTimeout(() => proceedToNextDialogue(), 1000);
    } else {
      // MISTAKE / AWKWARD COMEBACK
      if (!isMuted) soundSynth.playWrong();
      setCombo(1);

      if (currentPair) {
        setMissedPairs((prev) => [...prev, currentPair]);
        setNuanceTip({
          text: `💡 پاسخ درست: "${currentPair.match}"`,
          correctText: currentPair.contextFa || "اصطلاح استاندارد پیشرفته",
        });
      }

      triggerToast("❌ عدم تطابق در لحن یا کانتکست!", "#ef4444");

      setLives((prevLives) => {
        const newLives = prevLives - 1;
        if (newLives <= 0) {
          setTimeout(() => triggerGameOver(false), 1400);
        } else {
          setTimeout(() => proceedToNextDialogue(), 1800);
        }
        return newLives;
      });
    }
  };

  // Advance to next dialogue turn
  const proceedToNextDialogue = () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx >= dialogues.length) {
      // All dialogues in stage finished!
      triggerGameOver(true);
      return;
    }

    setCurrentIndex(nextIdx);
    setSelectedOptionId(null);
    setIsEvaluationLocked(false);
    setNuanceTip(null);

    const nextPair = dialogues[nextIdx];
    setPartnerIsTyping(true);

    setTimeout(() => {
      setPartnerIsTyping(false);
      const partnerMsg: ChatMessage = {
        id: `msg-partner-${Date.now()}`,
        sender: "partner",
        text: nextPair.english,
        timestamp: formatCurrentTime(),
      };
      setChatMessages((prev) => [...prev, partnerMsg]);
      setOptions(buildOptionsForDialogue(nextPair, WEBSITE_BOOKS_VOCAB_BANK));
      speakText(nextPair.english, "partner");
      setTimeLeft(8);
      roundStartTimeRef.current = Date.now();
    }, 750);
  };

  // Complete round and record statistics
  const triggerGameOver = (finishedAll: boolean) => {
    setIsGameOver(true);
    if (!isMuted) soundSynth.playFanfare();

    const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;
    recordVocabRushCompletion(
      level.skill,
      level.cefr,
      level.levelNumber,
      score,
      accuracy,
      correctCount,
      totalAttempts,
      level.xpReward || 120
    );
  };

  // Keyboard shortcut listener for options (1, 2, 3)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEvaluationLocked || partnerIsTyping || isGameOver) return;
      if (e.key === "1" && options[0]) handleSelectOption(options[0]);
      if (e.key === "2" && options[1]) handleSelectOption(options[1]);
      if (e.key === "3" && options[2]) handleSelectOption(options[2]);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options, isEvaluationLocked, partnerIsTyping, isGameOver]);

  const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100;
  const isPassed = accuracy >= 70 && correctCount >= 4;
  const isDangerTime = timeLeft <= 3;
  const timerPercent = Math.max(0, Math.min(100, (timeLeft / 8) * 100));

  // =========================================================================
  // RESULTS / VICTORY VIEW
  // =========================================================================
  if (isGameOver) {
    return (
      <div className={styles.arenaOverlay}>
        <div className={styles.pingPongModal} style={{ maxHeight: "90vh", overflowY: "auto" }}>
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>
              {isPassed ? "🏆" : "💪"}
            </div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 900, margin: "0 0 0.5rem" }}>
              {isPassed ? "شاهکار حاضر‌جوابی و تسلط مکالمه!" : "پایان دوئل کلامی - نیاز به تمرین مجدد"}
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.95rem", margin: 0 }}>
              استیج {level.levelNumber} سطح {level.cefr} ({level.titleFa})
            </p>

            {/* Score & Accuracy metrics */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1rem",
                margin: "1.75rem 0",
              }}
            >
              <div
                style={{
                  background: "#eff6ff",
                  padding: "1rem",
                  borderRadius: "1rem",
                  border: "1.5px solid #bfdbfe",
                }}
              >
                <div style={{ fontSize: "0.8rem", color: "#1e40af", fontWeight: 700 }}>امتیاز نهایی</div>
                <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#1d4ed8", marginTop: "0.25rem" }}>
                  {score.toLocaleString("fa-IR")}
                </div>
              </div>

              <div
                style={{
                  background: "#f0fdf4",
                  padding: "1rem",
                  borderRadius: "1rem",
                  border: "1.5px solid #bbf7d0",
                }}
              >
                <div style={{ fontSize: "0.8rem", color: "#166534", fontWeight: 700 }}>دقت مکالمه</div>
                <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#15803d", marginTop: "0.25rem" }}>
                  {accuracy}٪
                </div>
              </div>

              <div
                style={{
                  background: "#fef3c7",
                  padding: "1rem",
                  borderRadius: "1rem",
                  border: "1.5px solid #fde68a",
                }}
              >
                <div style={{ fontSize: "0.8rem", color: "#92400e", fontWeight: 700 }}>بهترین کمبو</div>
                <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#b45309", marginTop: "0.25rem" }}>
                  ⚡ {maxCombo}x
                </div>
              </div>
            </div>

            {/* Mistake Vault */}
            {missedPairs.length > 0 && (
              <div
                style={{
                  textAlign: "right",
                  borderTop: "1px solid #e2e8f0",
                  paddingTop: "1.25rem",
                  marginTop: "1.5rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 800,
                    color: "#2563eb",
                    margin: "0 0 0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <span>📖</span>
                  <span>دفترچه مرور اصطلاحات و تیکه‌کلام‌ها (Mistake Vault)</span>
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {missedPairs.map((pair) => (
                    <div key={pair.id} className={styles.mistakeVaultItem}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <button
                          type="button"
                          onClick={() => speakText(`${pair.english} ... ${pair.match}`)}
                          style={{
                            background: "rgba(37, 99, 235, 0.12)",
                            border: "1px solid rgba(37, 99, 235, 0.3)",
                            color: "#2563eb",
                            borderRadius: "50%",
                            width: 36,
                            height: 36,
                            cursor: "pointer",
                            fontSize: "1rem",
                          }}
                          title="پخش صوتی دیالوگ"
                        >
                          🔊
                        </button>
                        <div>
                          <div
                            style={{
                              fontWeight: 800,
                              fontSize: "0.95rem",
                              color: "#0f172a",
                              direction: "ltr",
                              textAlign: "left",
                            }}
                          >
                            💬 "{pair.english}"
                          </div>
                          <div
                            style={{
                              fontSize: "0.88rem",
                              color: "#059669",
                              fontWeight: 700,
                              marginTop: "0.2rem",
                              direction: "ltr",
                              textAlign: "left",
                            }}
                          >
                            ⚡ Comeback: "{pair.match}"
                          </div>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          background: "#e2e8f0",
                          color: "#475569",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "0.4rem",
                          fontWeight: 700,
                        }}
                      >
                        {pair.contextFa || "اصطلاح بومی"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
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
                onClick={startSession}
              >
                🔄 بازی مجدد و ارتقای رکورد
              </button>

              {isPassed && onNextLevel && (
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
                  🏆 رتبه‌بندی و لیدربرد
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
  // MAIN CHAT PING-PONG ARENA VIEW
  // =========================================================================
  return (
    <div className={styles.arenaOverlay}>
      <div className={styles.pingPongModal}>
        {/* Floating toast notification */}
        {floatingToast && (
          <div
            className={styles.floatingBadge}
            style={{ color: floatingToast.color, top: "35%" }}
          >
            {floatingToast.text}
          </div>
        )}

        {/* Top Partner Profile & Controls Header */}
        <div className={styles.pingPongPartnerHeader}>
          <div className={styles.partnerProfile}>
            <div className={styles.partnerAvatar}>
              <span>{partner.avatar}</span>
              <span className={styles.onlineDot} />
            </div>
            <div className={styles.partnerMeta}>
              <div className={styles.partnerName}>
                <span>{partner.name}</span>
                <span style={{ fontSize: "0.8rem", opacity: 0.75 }}>({partner.flag})</span>
              </div>
              <div className={styles.partnerRole}>
                <span>{partner.role}</span>
                <span>•</span>
                <span style={{ color: "#2563eb", fontWeight: 700 }}>{level.cefr} Native Banter</span>
              </div>
            </div>
          </div>

          <div className={styles.pingPongStatusPills}>
            {/* Lives */}
            <div className={styles.heartsTrack} title="جان‌های باقیمانده">
              {[...Array(3)].map((_, i) => (
                <span key={i} style={{ opacity: i < lives ? 1 : 0.25 }}>
                  ❤️
                </span>
              ))}
            </div>

            {/* Score */}
            <div className={styles.pingPongScoreBadge}>
              <span>🏆</span>
              <span>{score.toLocaleString("fa-IR")}</span>
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

        {/* Live Chat Stream */}
        <div ref={chatStreamRef} className={styles.pingPongChatStream}>
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={msg.sender === "partner" ? styles.chatBubblePartner : styles.chatBubbleUser}
            >
              <div className={styles.bubbleSpeakerLabel}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <span>{msg.sender === "partner" ? partner.name : "You (Fast Comeback)"}</span>
                  {msg.sender === "partner" && (
                    <button
                      type="button"
                      onClick={() => speakText(msg.text, "partner")}
                      className={styles.bubbleMiniAudioBtn}
                      title="پخش مجدد صدای پارتنر"
                    >
                      🔊
                    </button>
                  )}
                </div>
                <span style={{ fontSize: "0.68rem", opacity: 0.65 }}>{msg.timestamp}</span>
              </div>
              <div
                className={msg.sender === "partner" ? styles.bubbleTextPrompt : styles.bubbleTextUser}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {partnerIsTyping && (
            <div className={styles.chatBubbleTyping}>
              <span className={styles.typingDot} />
              <span className={styles.typingDot} />
              <span className={styles.typingDot} />
            </div>
          )}
        </div>

        {/* Speed Countdown Timer Bar */}
        <div className={styles.pingPongCountdownTrack}>
          <div
            className={`${styles.pingPongCountdownFill} ${
              isDangerTime ? styles.pingPongCountdownDanger : ""
            }`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>

        {/* Educational Tip on Mistake */}
        {nuanceTip && (
          <div className={styles.nuanceFeedbackBox}>
            <div>
              <strong>{nuanceTip.text}</strong>
              <div style={{ fontSize: "0.78rem", opacity: 0.85, marginTop: "0.15rem" }}>
                مفهوم فرهنگی و کانتکست: {nuanceTip.correctText}
              </div>
            </div>
            <button
              type="button"
              onClick={() => speakText(nuanceTip.text)}
              className={styles.cardAudioBtn}
              title="تلفظ اصطلاح درست"
            >
              🔊
            </button>
          </div>
        )}

        {/* 3 Interactive Comeback Cards */}
        <div className={styles.comebackCardsGrid}>
          {options.map((opt, idx) => {
            const isSelected = selectedOptionId === opt.id;
            let statusClass = "";
            if (isSelected) {
              statusClass = opt.isCorrect ? styles.comebackCardCorrect : styles.comebackCardWrong;
            }

            return (
              <div
                key={opt.id}
                className={`${styles.comebackCard} ${statusClass}`}
                onClick={() => handleSelectOption(opt)}
              >
                <div className={styles.comebackKeyPill}>{idx + 1}</div>
                <div className={styles.comebackText}>{opt.text}</div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakText(opt.text, "user");
                  }}
                  className={styles.cardAudioBtn}
                  title="شنیدن تلفظ نیتیو"
                >
                  🔊
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Game Status */}
        <div className={styles.cascadeBottomBar}>
          <div>
            <span>دیالوگ: </span>
            <strong style={{ color: "#2563eb" }}>
              {Math.min(currentIndex + 1, dialogues.length)} از {dialogues.length}
            </strong>
            <span style={{ margin: "0 0.5rem" }}>|</span>
            <span>حاضر‌جوابی صحیح: </span>
            <strong style={{ color: "#059669" }}>{correctCount}</strong>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span>کلیدهای سریع: </span>
            <span style={{ color: "#64748b", fontWeight: 700 }}>[ 1 ] [ 2 ] [ 3 ] روی کیبورد</span>
          </div>
        </div>
      </div>
    </div>
  );
}

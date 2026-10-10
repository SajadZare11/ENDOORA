"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./speaking-escape-room.module.css";
import { GameLevel } from "../../../data/skills/games/types";
import {
  getEscapeRoomStage,
  InteractiveRoomObject,
  EscapeRoomStage,
} from "../../../data/skills/games/escape-rooms-curriculum";
import { recordSpeakingMissionCompletion } from "../../../lib/skills/game-storage";
import { soundSynth } from "../../../lib/skills/game-audio";
import { playEnglishSpeech, stopEnglishSpeech } from "../../../lib/speech";

interface Props {
  level: GameLevel;
  onClose: () => void;
  onNextLevel?: () => void;
  onOpenLeaderboard?: () => void;
}

export function SpeakingEscapeRoomArena({
  level,
  onClose,
  onNextLevel,
  onOpenLeaderboard,
}: Props) {
  // Load rich AEF-based Escape Room Stage
  const stage: EscapeRoomStage = getEscapeRoomStage(level.cefr, level.levelNumber);

  // Tension & Game State
  const [hearts, setHearts] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(stage.escapeTimeLimitSeconds);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  // Solved Objects tracking
  const [solvedObjectIds, setSolvedObjectIds] = useState<string[]>([]);
  const [selectedObject, setSelectedObject] = useState<InteractiveRoomObject | null>(null);

  // Voice Interaction State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isSuccessDelay, setIsSuccessDelay] = useState<boolean>(false);

  // Victory Stats State
  const [victoryStats, setVictoryStats] = useState<{
    finalScore: number;
    accuracy: number;
    fluency: number;
    wpm: number;
    beatGhost: boolean;
    xpEarned: number;
  } | null>(null);

  // Recognition ref
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean speech when unmounting
  useEffect(() => {
    return () => {
      stopEnglishSpeech();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Main Escape Room countdown and elapsed timer
  useEffect(() => {
    if (isGameOver || isVictory) return;

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isGameOver, isVictory]);

  const handleTimeOut = () => {
    soundSynth.playWrong();
    setIsGameOver(true);
  };

  // Check victory condition whenever solved objects change
  useEffect(() => {
    if (stage.objects.length > 0 && solvedObjectIds.length >= stage.objects.length && !isVictory) {
      triggerVictory();
    }
  }, [solvedObjectIds, stage.objects.length, isVictory]);

  const triggerVictory = () => {
    setIsVictory(true);
    soundSynth.playFanfare();

    const speedBonus = Math.max(0, timeLeft * 16);
    const heartsBonus = hearts * 120;
    const finalScore = Math.min(2000, 1000 + speedBonus + heartsBonus);
    const accuracy = Math.round((hearts / 3) * 100);
    const fluency = hearts === 3 ? 96 : hearts === 2 ? 85 : 74;
    const wpm = Math.round(115 + (stage.escapeTimeLimitSeconds - elapsedSeconds) / 2);
    const beatGhost = elapsedSeconds <= stage.targetGhostTimeSeconds;

    // Save completion into storage
    const outcome = recordSpeakingMissionCompletion(
      level.cefr,
      level.levelNumber,
      finalScore,
      accuracy,
      fluency,
      wpm,
      140
    );

    setVictoryStats({
      finalScore,
      accuracy,
      fluency,
      wpm,
      beatGhost,
      xpEarned: outcome.xpEarned || 140,
    });
  };

  // Reset stage
  const handleRestart = () => {
    stopEnglishSpeech();
    setHearts(3);
    setTimeLeft(stage.escapeTimeLimitSeconds);
    setElapsedSeconds(0);
    setIsGameOver(false);
    setIsVictory(false);
    setSolvedObjectIds([]);
    setSelectedObject(null);
    setTranscript("");
    setFeedbackMsg(null);
    setVictoryStats(null);
  };

  // Open Decryption Modal for an object
  const handleInspectObject = (obj: InteractiveRoomObject) => {
    setSelectedObject(obj);
    setTranscript("");
    setFeedbackMsg(null);
    setIsSuccessDelay(false);

    // Play prompt audio in human-like pronunciation
    playEnglishSpeech(obj.speakerPromptEn, { accent: "en-US", rate: 1.0 });
  };

  const handleCloseDecryptionModal = () => {
    stopEnglishSpeech();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }
    setIsListening(false);
    setSelectedObject(null);
    setTranscript("");
    setFeedbackMsg(null);
  };

  // Handle Speech Recognition toggle
  const handleToggleListening = useCallback(() => {
    if (!selectedObject) return;

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    if (typeof window === "undefined") return;

    // @ts-expect-error Webkit SpeechRecognition fallback
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRec) {
      // Browser doesn't support Web Speech API - fallback simulated voice check
      setTranscript("Checking microphone...");
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        handleValidateSpokenText(selectedObject.idealVoiceResponseEn);
      }, 1500);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
        setFeedbackMsg(null);
        setTranscript("در حال شنیدن صدای قشنگت... به انگلیسی بگو!");
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        if (event.results[0].isFinal) {
          handleValidateSpokenText(currentTranscript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setFeedbackMsg({
          text: "میکروفون صداتو نگرفت رفیق! یه بار دیگه واضح‌تر بگو یا از گزینه‌های پایین کمک بگیر.",
          isError: true,
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setFeedbackMsg({
        text: "دسترسی میکروفون وصل نشد! نگران نباش، از گزینه‌های نوشتاری پایین استفاده کن.",
        isError: true,
      });
    }
  }, [isListening, selectedObject]);

  // Validate the player's voice answer
  const handleValidateSpokenText = (spokenText: string) => {
    if (!selectedObject) return;

    const normalizedSpoken = spokenText.toLowerCase().replace(/[^a-z0-9 ]/g, " ").trim();
    const normalizedIdeal = selectedObject.idealVoiceResponseEn.toLowerCase().replace(/[^a-z0-9 ]/g, " ");

    // Check keyword hits
    let matchedKeywordsCount = 0;
    selectedObject.targetKeywords.forEach((kw) => {
      const cleanKw = kw.phrase.toLowerCase().replace(/[^a-z0-9 ]/g, " ").trim();
      if (normalizedSpoken.includes(cleanKw)) {
        matchedKeywordsCount++;
      }
    });

    const isDirectMatch = normalizedSpoken.length > 5 && normalizedIdeal.includes(normalizedSpoken);
    const hasSufficientKeywords = matchedKeywordsCount >= Math.min(1, selectedObject.targetKeywords.length);

    if (hasSufficientKeywords || isDirectMatch) {
      // Success!
      soundSynth.playCorrect();
      setIsSuccessDelay(true);
      setFeedbackMsg({
        text: `ایول! دمت گرم! رمز باز شد: "${selectedObject.unlockedItemNameFa || "مدرک رو پیدا کردی"}" 🎉`,
        isError: false,
      });

      if (!solvedObjectIds.includes(selectedObject.id)) {
        setSolvedObjectIds((prev) => [...prev, selectedObject.id]);
      }

      setTimeout(() => {
        handleCloseDecryptionModal();
      }, 1200);
    } else {
      // Missed key keywords / Wrong pronunciation
      soundSynth.playWrong();
      setHearts((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setIsGameOver(true);
        }
        return Math.max(0, next);
      });
      setFeedbackMsg({
        text: "آخ آخ! کلمات کلیدی هدف رو درست نگفتی! به کلمات آبی اون بغل نگاه کن و دوباره با دقت بگو!",
        isError: true,
      });
    }
  };

  // Handle emergency fallback selection
  const handleSelectFallback = (choiceText: string) => {
    if (!selectedObject || isSuccessDelay) return;

    // Play pronunciation of selected choice
    playEnglishSpeech(choiceText, { accent: "en-US", rate: 1.0 });
    setTranscript(choiceText);

    const isCorrect = choiceText.trim() === selectedObject.idealVoiceResponseEn.trim();
    if (isCorrect) {
      soundSynth.playCorrect();
      setIsSuccessDelay(true);
      setFeedbackMsg({
        text: `دمت گرم! ${selectedObject.unlockedItemNameFa || "مدرک"} رفت توی کوله‌پشتیت! 🎉`,
        isError: false,
      });

      if (!solvedObjectIds.includes(selectedObject.id)) {
        setSolvedObjectIds((prev) => [...prev, selectedObject.id]);
      }

      setTimeout(() => {
        handleCloseDecryptionModal();
      }, 1100);
    } else {
      soundSynth.playWrong();
      setHearts((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setIsGameOver(true);
        }
        return Math.max(0, next);
      });
      setFeedbackMsg({
        text: "آخ آخ! این جواب برای این موقعیت جور درنمی‌اومد! یه دونه از قلب‌هات پرید!",
        isError: true,
      });
    }
  };

  // Get background class for room theme
  const getThemeClass = (theme: string) => {
    switch (theme) {
      case "hotel":
        return styles.roomThemeHotel;
      case "cafe":
        return styles.roomThemeCafe;
      case "airport":
        return styles.roomThemeAirport;
      case "safehouse":
        return styles.roomThemeSafehouse;
      case "vault":
        return styles.roomThemeVault;
      case "courtroom":
        return styles.roomThemeCourtroom;
      default:
        return styles.roomThemeHotel;
    }
  };

  return (
    <div className={styles.escapeOverlay}>
      <div className={styles.escapeContainer}>
        {/* ================================================================= */}
        {/* 1. TOP ESCAPE HUD BAR                                             */}
        {/* ================================================================= */}
        <header className={styles.hudTopBar}>
          <div className={styles.roomMetaCluster}>
            <span className={styles.cefrPillBadge}>
              {level.cefr} - مرحله {level.levelNumber}
            </span>
            <div className={styles.roomTitleBlock}>
              <h2 className={styles.roomTitle}>{stage.titleFa}</h2>
              <span className={styles.aefRefLabel}>{stage.aefBookAndUnit}</span>
            </div>
          </div>

          <div className={styles.tensionCenterCluster}>
            {/* Hearts Container */}
            <div className={styles.heartsContainer}>
              {[1, 2, 3].map((heartIndex) => (
                <span
                  key={heartIndex}
                  className={`${styles.heartIcon} ${heartIndex <= hearts ? styles.heartbeat : styles.lost}`}
                >
                  ❤️
                </span>
              ))}
            </div>

            {/* Bomb Fuse / Countdown Clock */}
            <div className={styles.escapeTimerBox}>
              <span>💣</span>
              <span className={`${styles.timerDigit} ${timeLeft <= 15 ? styles.danger : ""}`}>
                {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
                {String(timeLeft % 60).padStart(2, "0")}
              </span>
            </div>
          </div>

          <button
            type="button"
            className={styles.topCloseBtn}
            onClick={onClose}
            aria-label="خروج از اتاق فرار"
          >
            ✕
          </button>
        </header>

        {/* ================================================================= */}
        {/* 2. THE VISUAL ESCAPE ROOM SCENE CANVAS                            */}
        {/* ================================================================= */}
        <main className={`${styles.roomCanvasWrapper} ${getThemeClass(stage.roomTheme)}`}>
          {/* Ambient Security Grid if C1/C2 or Vault */}
          {stage.archetype === "high-security-vault" && (
            <div className={styles.laserSecurityGrid} />
          )}

          {/* Ambient Floor Shadow Mesh */}
          <div className={styles.roomFloorMesh} />

          {/* Mission Story Intro Prompt Banner */}
          <div
            style={{
              position: "absolute",
              top: 14,
              right: 18,
              left: 18,
              background: "rgba(15, 23, 42, 0.88)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              borderRadius: 14,
              padding: "0.6rem 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: 5,
              backdropFilter: "blur(8px)",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span style={{ fontSize: "1.3rem" }}>🗝️</span>
              <span style={{ fontSize: "0.85rem", color: "#f8fafc", fontWeight: 700 }}>
                {stage.storyIntroFa}
              </span>
            </div>
            <span style={{ fontSize: "0.78rem", color: "#38bdf8", fontWeight: 800 }}>
              {solvedObjectIds.length} از {stage.objects.length} تا معما حل شد
            </span>
          </div>

          {/* 3 Interactive Objects Placed in the Scene */}
          {stage.objects.map((obj) => {
            const isSolved = solvedObjectIds.includes(obj.id);

            return (
              <div
                key={obj.id}
                className={styles.interactiveObjectPin}
                style={{
                  left: `${obj.coordinates.xPct}%`,
                  top: `${obj.coordinates.yPct}%`,
                }}
                onClick={() => handleInspectObject(obj)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleInspectObject(obj);
                }}
              >
                {!isSolved && <div className={styles.objectTargetPulse} />}

                <div className={`${styles.objectIconDisc} ${isSolved ? styles.solved : ""}`}>
                  <span>{obj.icon}</span>
                  {isSolved && <span className={styles.solvedBadgeCheck}>✓</span>}
                </div>

                <div className={styles.objectLabelTag}>{obj.nameFa}</div>
              </div>
            );
          })}
        </main>

        {/* ================================================================= */}
        {/* 3. BOTTOM INVENTORY TRAY (کوله‌پشتی مدارک و کلیدها)               */}
        {/* ================================================================= */}
        <footer className={styles.inventoryTrayFooter}>
          <div className={styles.inventoryTitleBox}>
            <span>🎒</span>
            <span>کوله‌پشتی فرار (چیزمیزایی که پیدا کردی):</span>
          </div>

          <div className={styles.inventorySlotsGrid}>
            {stage.objects.map((obj) => {
              const isSolved = solvedObjectIds.includes(obj.id);

              return (
                <div
                  key={obj.id}
                  className={`${styles.inventorySlot} ${isSolved ? styles.filled : ""}`}
                  title={isSolved ? obj.unlockedItemNameFa : "خالی"}
                >
                  {isSolved ? obj.unlockedItemIcon || "🔑" : "🔒"}
                </div>
              );
            })}
          </div>

          <div className={styles.ghostSpeedTrackInline}>
            <span>{stage.ghostRivalAvatar}</span>
            <span>
              شبح رقیب ({stage.ghostRivalName}): {stage.targetGhostTimeSeconds} ثانیه
            </span>
            <span style={{ color: "#38bdf8", marginRight: "0.5rem" }}>
              ⏱️ زمان تو: {elapsedSeconds} ثانیه
            </span>
          </div>
        </footer>

        {/* ================================================================= */}
        {/* 4. OBJECT VOICE DECRYPTION POPUP MODAL (2-COLUMN MODERN GRID)     */}
        {/* ================================================================= */}
        {selectedObject && (
          <div className={styles.decryptionModalBackdrop}>
            <div className={styles.decryptionPanel}>
              <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>
                  <span>{selectedObject.icon}</span>
                  <span>{selectedObject.nameFa}</span>
                  <span style={{ fontSize: "0.85rem", opacity: 0.7, fontWeight: 500 }}>
                    ({selectedObject.nameEn})
                  </span>
                </h3>

                <button
                  type="button"
                  className={styles.topCloseBtn}
                  onClick={handleCloseDecryptionModal}
                >
                  ✕
                </button>
              </div>

              {/* Two-Column Grid Body */}
              <div className={styles.decryptionGridBody}>
                {/* Right Column: Mission and Environment Sounds */}
                <div className={styles.decryptionColRight}>
                  {/* Speaker Prompt Card */}
                  <div className={styles.promptCard}>
                    <div className={styles.promptSpeakerRow}>
                      <span>صدای محیط ({selectedObject.speakerRoleFa}):</span>
                      <button
                        type="button"
                        className={styles.soundListenBtn}
                        onClick={() =>
                          playEnglishSpeech(selectedObject.speakerPromptEn, {
                            accent: "en-US",
                            rate: 1.0,
                          })
                        }
                      >
                        🔊 دوباره بشنو
                      </button>
                    </div>
                    <div className={styles.promptSpeakerText}>
                      &ldquo;{selectedObject.speakerPromptEn}&rdquo;
                    </div>
                  </div>

                  {/* Task Instruction Banner */}
                  <div className={styles.taskInstructionBanner}>
                    <span>💡 مأموریت تو: </span>
                    <span>{selectedObject.taskInstructionFa}</span>
                  </div>

                  {/* Target Keywords Guide */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <span style={{ fontSize: "0.8rem", opacity: 0.75, fontWeight: 700 }}>
                      کلمات کلیدی طلایی برای باز شدن رمز:
                    </span>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {selectedObject.targetKeywords.map((kw, i) => (
                        <span
                          key={i}
                          style={{
                            background: "rgba(56, 189, 248, 0.15)",
                            border: "1px solid rgba(56, 189, 248, 0.4)",
                            color: "#0284c7",
                            borderRadius: 8,
                            padding: "0.25rem 0.6rem",
                            fontSize: "0.82rem",
                            fontWeight: 700,
                          }}
                        >
                          {kw.phrase} <small style={{ opacity: 0.85 }}>{kw.hintFa}</small>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Left Column: Voice Interaction & Fallback */}
                <div className={styles.decryptionColLeft}>
                  {/* Microphone & Live Voice Recognition Console */}
                  <div className={styles.micConsoleZone}>
                    <button
                      type="button"
                      className={`${styles.giantMicBtn} ${isListening ? styles.listening : ""}`}
                      onClick={handleToggleListening}
                      title="روی میکروفون بزن و صحبت کن"
                    >
                      {isListening ? "🔴" : "🎙️"}
                    </button>

                    <span style={{ fontSize: "0.82rem", opacity: 0.85, fontWeight: 600 }}>
                      {isListening
                        ? "در حال شنیدن صدای قشنگت... جمله رو واضح بگو و دوباره روی دکمه بزن!"
                        : "روی میکروفون بزن و با صدای خودت انگلیسی بگو!"}
                    </span>

                    {transcript && (
                      <div className={styles.transcriptLiveBubble}>
                        &ldquo;{transcript}&rdquo;
                      </div>
                    )}

                    {feedbackMsg && (
                      <div
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 800,
                          color: feedbackMsg.isError ? "#ef4444" : "#10b981",
                          textAlign: "center",
                          marginTop: "0.2rem",
                        }}
                      >
                        {feedbackMsg.text}
                      </div>
                    )}
                  </div>

                  {/* Emergency Fallback Choices */}
                  <div>
                    <span
                      style={{
                        fontSize: "0.78rem",
                        opacity: 0.75,
                        fontWeight: 700,
                        marginBottom: "0.4rem",
                        display: "block",
                      }}
                    >
                      یا اگر میکروفون نداری، یکی از اینا رو انتخاب کن:
                    </span>
                    <div className={styles.emergencyChoiceList}>
                      {selectedObject.fallbackChoices.map((choice, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={styles.choiceBtn}
                          onClick={() => handleSelectFallback(choice)}
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 5. VICTORY DEBRIEF & ESCAPE OVERLAY                               */}
        {/* ================================================================= */}
        {isVictory && victoryStats && (
          <div className={styles.victoryDebriefBackdrop}>
            <div className={styles.victoryCard}>
              <span style={{ fontSize: "3.5rem" }}>🏆</span>
              <h2 className={styles.victoryCrownHeading}>ایول! دمت گرم! موفق شدی فرار کنی!</h2>
              <p style={{ margin: 0, opacity: 0.85, fontSize: "0.95rem" }}>
                همه‌چی رو مثل بلبل انگلیسی گفتی، قفل‌ها وا شدن و زدی به چاک!
              </p>

              {/* Speedrun Comparison vs Ghost */}
              <div className={styles.speedrunComparisonBox}>
                <div className={styles.speedrunPlayerCard}>
                  <span style={{ fontSize: "0.8rem", opacity: 0.75 }}>زمان فرار تو:</span>
                  <span className={styles.timeScoreBig}>{elapsedSeconds} ثانیه</span>
                </div>

                <div
                  style={{
                    background: victoryStats.beatGhost
                      ? "rgba(16, 185, 129, 0.2)"
                      : "rgba(239, 68, 68, 0.2)",
                    border: `1px solid ${victoryStats.beatGhost ? "#10b981" : "#ef4444"}`,
                    color: victoryStats.beatGhost ? "#10b981" : "#ef4444",
                    padding: "0.4rem 0.8rem",
                    borderRadius: 12,
                    fontSize: "0.85rem",
                    fontWeight: 900,
                  }}
                >
                  {victoryStats.beatGhost ? "⚡ رکورد شبح رقیب رو پوکوندی!" : "🥈 این بار شبح سریع‌تر بود"}
                </div>

                <div className={styles.speedrunPlayerCard}>
                  <span style={{ fontSize: "0.8rem", opacity: 0.75 }}>
                    شبح ({stage.ghostRivalName}):
                  </span>
                  <span className={styles.timeScoreBig} style={{ color: "#a855f7" }}>
                    {stage.targetGhostTimeSeconds} ثانیه
                  </span>
                </div>
              </div>

              {/* Detailed Performance Stats */}
              <div className={styles.victoryStatsRow}>
                <div className={styles.vStatBox}>
                  <span className={styles.vStatVal}>{victoryStats.fluency}٪</span>
                  <span className={styles.vStatLabel}>روانی کلام (Fluency)</span>
                </div>
                <div className={styles.vStatBox}>
                  <span className={styles.vStatVal}>{victoryStats.wpm}</span>
                  <span className={styles.vStatLabel}>سرعت کلمات در دقیقه (WPM)</span>
                </div>
                <div className={styles.vStatBox}>
                  <span className={styles.vStatVal}>+{victoryStats.xpEarned} XP</span>
                  <span className={styles.vStatLabel}>امتیاز تجربه کسب‌شده</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.victoryActionButtons}>
                {onNextLevel && (
                  <button
                    type="button"
                    className={styles.btnEscapeNext}
                    onClick={onNextLevel}
                  >
                    🚀 بزن بریم مرحله بعد!
                  </button>
                )}
                {onOpenLeaderboard && (
                  <button
                    type="button"
                    className={styles.btnEscapeAlt}
                    onClick={onOpenLeaderboard}
                  >
                    🏆 دیدن لیدربرد و رکوردها
                  </button>
                )}
                <button
                  type="button"
                  className={styles.btnEscapeAlt}
                  onClick={handleRestart}
                >
                  🔄 یه دست دیگه فرار کنیم!
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 6. DEFEAT / ALARM LOCKDOWN OVERLAY                                */}
        {/* ================================================================= */}
        {isGameOver && (
          <div className={styles.victoryDebriefBackdrop}>
            <div
              className={styles.victoryCard}
              style={{
                borderColor: "#ef4444",
                boxShadow: "0 30px 80px rgba(0, 0, 0, 0.85), 0 0 50px rgba(239, 68, 68, 0.4)",
              }}
            >
              <span style={{ fontSize: "3.5rem" }}>🚨</span>
              <h2
                className={styles.victoryCrownHeading}
                style={{
                  background: "linear-gradient(135deg, #f87171, #ef4444)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                آژیر خطر کشیده شد! گیر افتادی!
              </h2>

              <p style={{ margin: 0, opacity: 0.9, fontSize: "0.95rem", lineHeight: 1.6 }}>
                {hearts <= 0
                  ? "سوتی‌های تلفظت زیاد شد و قلب‌هات تموم شدن!"
                  : "وقتت تموم شد و آژیر اتاق به صدا دراومد!"}
                <br />
                عیبی نداره رفیق؛ یه نفس عمیق بکش و دوباره باهم فرار کنیم!
              </p>

              <div className={styles.victoryActionButtons}>
                <button
                  type="button"
                  className={styles.btnEscapeNext}
                  style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}
                  onClick={handleRestart}
                >
                  🔄 یه بار دیگه بزن بریم!
                </button>
                <button
                  type="button"
                  className={styles.btnEscapeAlt}
                  onClick={onClose}
                >
                  ✕ فعلاً خروج
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

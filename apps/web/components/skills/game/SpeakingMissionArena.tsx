"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./speaking-mission.module.css";
import type {
  GameLevel,
  SpeakingMission,
  SpeakingTurn,
  SpeakingKeywordObjective,
  SpeakingVocabUpgrade,
} from "../../../data/skills/games/types";
import { getSpeakingMission } from "../../../data/skills/games/speaking-missions";
import {
  recordSpeakingMissionCompletion,
  getLocalUserProfile,
} from "../../../lib/skills/game-storage";
import { soundSynth } from "../../../lib/skills/game-audio";
import { playEnglishSpeech, stopEnglishSpeech } from "../../../lib/speech";

interface Props {
  level: GameLevel;
  onClose: () => void;
  onNextLevel?: () => void;
  onOpenLeaderboard?: () => void;
}

// Web Speech API interface definitions
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
  };
}

interface WebSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((error: unknown) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export function SpeakingMissionArena({
  level,
  onClose,
  onNextLevel,
  onOpenLeaderboard,
}: Props) {
  // 1. Load mission data from curriculum
  const mission: SpeakingMission = getSpeakingMission(level.cefr, level.levelNumber) || {
    levelNumber: level.levelNumber,
    cefr: level.cefr,
    titleFa: level.titleFa,
    titleEn: level.titleEn,
    scenarioFa: level.descriptionFa,
    locationContextFa: "مکالمه تعاملی ایندورا",
    xpReward: level.xpReward,
    timeLimitTotalSeconds: 60,
    minPassScore: 70,
    ghostRival: {
      name: "شبح رقیب لیدربرد",
      avatar: "👻",
      city: "ایران",
      reactionTimeAvg: 1.5,
      targetScore: 820,
      wpm: 95,
      title: "قهرمان رکورد قبلی",
    },
    turns: [],
  };

  const userProfile = getLocalUserProfile();

  // 2. Turn & Gameplay State
  const [currentTurnIdx, setCurrentTurnIdx] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeakingCharacter, setIsSpeakingCharacter] = useState(false);
  const [isEmergencyFallback, setIsEmergencyFallback] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Pressure Clock (Seconds left in current turn)
  const currentTurn: SpeakingTurn | undefined = mission.turns[currentTurnIdx];
  const maxTurnTime = currentTurn?.reactionWindowSeconds || 15;
  const [turnSecondsLeft, setTurnSecondsLeft] = useState(maxTurnTime);

  // Performance Tracking
  const [turnKeywordStatus, setTurnKeywordStatus] = useState<Record<string, boolean>>({});
  const [allFoundKeywords, setAllFoundKeywords] = useState<string[]>([]);
  const [speechStartTime, setSpeechStartTime] = useState<number | null>(null);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [hesitationsCount, setHesitationsCount] = useState(0);
  const [wordsSpokenCount, setWordsSpokenCount] = useState(0);
  const [totalSpeakingDurationSec, setTotalSpeakingDurationSec] = useState(0);
  const [turnScores, setTurnScores] = useState<number[]>([]);

  // Ghost Runner simulation
  const [ghostProgressPct, setGhostProgressPct] = useState(5);
  const [userProgressPct, setUserProgressPct] = useState(5);

  // Victory Scorecard State
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [starsCount, setStarsCount] = useState(1);
  const [xpWon, setXpWon] = useState(0);
  const [awardedBadges, setAwardedBadges] = useState<string[]>([]);

  // Refs
  const recognitionRef = useRef<WebSpeechRecognition | null>(null);
  const pressureTimerRef = useRef<NodeJS.Timeout | null>(null);
  const ghostTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpeechTimestamp = useRef<number | null>(null);

  // -------------------------------------------------------------
  // SPEECH SYNTHESIS: Play character dialogue
  // -------------------------------------------------------------
  const playCharacterVoice = useCallback(
    (textToSpeak: string) => {
      if (isMuted || typeof window === "undefined") return;
      setIsSpeakingCharacter(true);
      playEnglishSpeech(textToSpeak, {
        accent: "en-US",
        rate: 0.95,
        onEnd: () => {
          setIsSpeakingCharacter(false);
        },
      });
    },
    [isMuted]
  );

  // -------------------------------------------------------------
  // WEB SPEECH API INITIALIZATION
  // -------------------------------------------------------------
  const initSpeechRecognition = useCallback(() => {
    if (typeof window === "undefined") return null;
    const windowWithSpeech = window as unknown as {
      SpeechRecognition?: new () => WebSpeechRecognition;
      webkitSpeechRecognition?: new () => WebSpeechRecognition;
    };
    const SpeechRec = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (!SpeechRec) {
      setIsEmergencyFallback(true);
      return null;
    }

    try {
      const rec = new SpeechRec();
      rec.lang = "en-US";
      rec.continuous = true;
      rec.interimResults = true;

      rec.onstart = () => {
        setIsListening(true);
        if (!speechStartTime) {
          const now = Date.now();
          setSpeechStartTime(now);
          lastSpeechTimestamp.current = now;
        }
      };

      rec.onerror = () => {
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event: SpeechRecognitionEvent) => {
        let currentFullTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentFullTranscript += event.results[i][0].transcript + " ";
        }
        const cleaned = currentFullTranscript.trim();
        setTranscript(cleaned);

        // Hesitation check: if more than 2 seconds since last chunk
        const now = Date.now();
        if (lastSpeechTimestamp.current && now - lastSpeechTimestamp.current > 2200) {
          setHesitationsCount((prev) => prev + 1);
        }
        lastSpeechTimestamp.current = now;

        // Count words spoken
        const words = cleaned.split(/\s+/).filter(Boolean);
        setWordsSpokenCount(words.length);

        // Real-time Keyword Spotting
        if (currentTurn) {
          const lowerTranscript = cleaned.toLowerCase();
          currentTurn.keywords.forEach((kw: SpeakingKeywordObjective) => {
            const lowerKw = kw.phrase.toLowerCase();
            if (lowerTranscript.includes(lowerKw)) {
              setTurnKeywordStatus((prev: Record<string, boolean>) => {
                if (!prev[kw.id]) {
                  soundSynth.playCorrect();
                  setAllFoundKeywords((kws: string[]) => [...kws, kw.phrase]);
                  return { ...prev, [kw.id]: true };
                }
                return prev;
              });
            }
          });
        }
      };

      return rec;
    } catch {
      setIsEmergencyFallback(true);
      return null;
    }
  }, [currentTurn, speechStartTime]);

  // Start / Stop mic toggle
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (!recognitionRef.current) {
        recognitionRef.current = initSpeechRecognition();
      }
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch {
        // Recognition already active
      }
    }
  };

  // -------------------------------------------------------------
  // TURN LIFECYCLE
  // -------------------------------------------------------------
  const setupTurn = useCallback(
    (turnIdx: number) => {
      const turn = mission.turns[turnIdx];
      if (!turn) return;

      setTranscript("");
      setSpeechStartTime(null);
      lastSpeechTimestamp.current = null;
      setTurnSecondsLeft(turn.reactionWindowSeconds);
      setTurnKeywordStatus({});

      // Play character audio
      playCharacterVoice(turn.characterSpeaker.text);
    },
    [mission.turns, playCharacterVoice]
  );

  // Initial mount: setup Turn 1
  useEffect(() => {
    if (mission.turns.length > 0) {
      setupTurn(0);
    }
    return () => {
      stopEnglishSpeech();
      recognitionRef.current?.abort();
      if (pressureTimerRef.current) clearInterval(pressureTimerRef.current);
      if (ghostTimerRef.current) clearInterval(ghostTimerRef.current);
    };
  }, [mission.turns.length, setupTurn]);

  // Pressure Clock Interval
  useEffect(() => {
    if (isCompleted || isSpeakingCharacter) return;

    pressureTimerRef.current = setInterval(() => {
      setTurnSecondsLeft((prev: number) => {
        if (prev <= 1) {
          // Time expired for this turn -> automatically evaluate and submit turn
          handleTurnSubmit(true);
          return 0;
        }
        return prev - 1;
      });
      setTotalSpeakingDurationSec((prev: number) => prev + 1);
    }, 1000);

    return () => {
      if (pressureTimerRef.current) clearInterval(pressureTimerRef.current);
    };
  }, [isCompleted, isSpeakingCharacter, currentTurnIdx]);

  // Ghost Runner simulation ticker
  useEffect(() => {
    if (isCompleted) return;

    ghostTimerRef.current = setInterval(() => {
      setGhostProgressPct((prev: number) => {
        const step = 100 / (mission.timeLimitTotalSeconds || 60);
        return Math.min(95, prev + step);
      });
    }, 1000);

    return () => {
      if (ghostTimerRef.current) clearInterval(ghostTimerRef.current);
    };
  }, [isCompleted, mission.timeLimitTotalSeconds]);

  // -------------------------------------------------------------
  // TURN SUBMISSION & EVALUATION
  // -------------------------------------------------------------
  const handleTurnSubmit = (isTimeExpired = false) => {
    recognitionRef.current?.stop();
    setIsListening(false);

    if (!currentTurn) return;

    // Calculate reaction time (seconds between character speech and user start)
    const reactTime = speechStartTime
      ? Math.max(0.5, Number(((Date.now() - speechStartTime) / 1000).toFixed(1)))
      : isEmergencyFallback
      ? 2.5
      : maxTurnTime;
    setReactionTimes((prev: number[]) => [...prev, reactTime]);

    // Calculate turn score
    let turnPoints = 200; // Base points per turn
    const timeBonus = Math.max(0, turnSecondsLeft * 15);
    let keywordBonus = 0;

    currentTurn.keywords.forEach((kw: SpeakingKeywordObjective) => {
      if (turnKeywordStatus[kw.id]) {
        keywordBonus += kw.weight * 5;
      }
    });

    // Fallback penalty if user bypassed mic
    const micMultiplier = isEmergencyFallback ? 0.7 : 1.0;
    const totalTurnPts = Math.round((turnPoints + timeBonus + keywordBonus) * micMultiplier);
    setTurnScores((prev) => [...prev, totalTurnPts]);

    // Update user runner track
    const newProgress = Math.min(100, Math.round(((currentTurnIdx + 1) / mission.turns.length) * 100));
    setUserProgressPct(newProgress);

    soundSynth.playCorrect();

    // Check if more turns exist
    if (currentTurnIdx + 1 < mission.turns.length) {
      const nextIdx = currentTurnIdx + 1;
      setCurrentTurnIdx(nextIdx);
      setupTurn(nextIdx);
    } else {
      // Mission Complete! Generate Victory Scorecard
      finalizeMission();
    }
  };

  // -------------------------------------------------------------
  // FINALIZE MISSION & SCORECARD
  // -------------------------------------------------------------
  const finalizeMission = () => {
    setIsCompleted(true);
    stopEnglishSpeech();

    // Calculate total scores & metrics
    const rawScore = turnScores.reduce((a, b) => a + b, 0) + 300;
    const finalScoreCalced = Math.max(650, rawScore);
    setFinalScore(finalScoreCalced);

    // Calculate WPM (Words Per Minute)
    const durationMinutes = Math.max(0.3, totalSpeakingDurationSec / 60);
    const calculatedWpm = Math.min(180, Math.round(wordsSpokenCount / durationMinutes)) || 95;

    // Accuracy & Fluency proxies
    const accuracyPct = Math.min(98, 75 + allFoundKeywords.length * 6);
    const fluencyPct = Math.max(60, 100 - hesitationsCount * 5);

    // Determine Stars
    let stars = 1;
    if (finalScoreCalced >= 1100 || (accuracyPct >= 90 && fluencyPct >= 85)) {
      stars = 3;
    } else if (finalScoreCalced >= 850 || accuracyPct >= 80) {
      stars = 2;
    }
    setStarsCount(stars);

    // Award badges
    const badges: string[] = [];
    const avgReact =
      reactionTimes.length > 0
        ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
        : 2.0;

    if (avgReact <= 1.4) badges.push("⚡ Quick Thinker (شروع سخن زیر ۱.۵ ثانیه)");
    if (accuracyPct >= 90) badges.push("🎯 Accent Master (تلفظ دقیق بالای ۹۰٪)");
    if (hesitationsCount <= 1) badges.push("🌊 Flawless Flow (روانی کلام بدون تپق)");
    if (allFoundKeywords.length >= 4) badges.push("🗝️ Keyword Sleuth (کشف کلمات کلیدی)");
    if (finalScoreCalced > mission.ghostRival.targetScore) badges.push("👑 Ghost Slayer (شکست شبح لیدربرد)");

    setAwardedBadges(badges);

    // Save result to storage
    const outcome = recordSpeakingMissionCompletion(
      mission.cefr,
      mission.levelNumber,
      finalScoreCalced,
      accuracyPct,
      fluencyPct,
      calculatedWpm,
      mission.xpReward
    );
    setXpWon(outcome.xpEarned || mission.xpReward);
  };

  // Helper to play native upgrade audio in scorecard
  const playNativeUpgradeAudio = (text: string) => {
    playEnglishSpeech(text, { accent: "en-US", rate: 0.95 });
  };

  // -------------------------------------------------------------
  // RENDER ARENA
  // -------------------------------------------------------------
  return (
    <div className={styles.arenaOverlay}>
      <div className={styles.arenaContainer}>
        {/* Top Header HUD */}
        <header className={styles.arenaHeader}>
          <div className={styles.missionMeta}>
            <span className={styles.cefrPill}>{mission.cefr}</span>
            <div>
              <h2 className={styles.missionTitle}>
                مرحله {mission.levelNumber}: {mission.titleFa}
              </h2>
              <div className={styles.locationBadge}>
                📍 <span>{mission.locationContextFa}</span>
              </div>
            </div>
          </div>

          <div className={styles.headerActions}>
            <button
              className={styles.hudButton}
              onClick={() => setIsMuted(!isMuted)}
              type="button"
            >
              {isMuted ? "🔇 بی‌صدا" : "🔊 صدا فعال"}
            </button>
            <button
              className={styles.closeButton}
              onClick={onClose}
              type="button"
              aria-label="خروج از مرحله"
            >
              ✕
            </button>
          </div>
        </header>

        {/* Ghost Rival Track (Top Race Bar) */}
        <div className={styles.ghostRaceTrack}>
          <div className={styles.trackInfoRow}>
            <div className={styles.trackRivalMeta}>
              <span>{mission.ghostRival.avatar}</span>
              <span>
                شبح رقیب ({mission.ghostRival.name}): {mission.ghostRival.targetScore} pts
              </span>
            </div>
            <div className={styles.trackUserMeta}>
              <span>{userProfile.avatar}</span>
              <span>شما: نوبت {currentTurnIdx + 1} از {mission.turns.length}</span>
            </div>
          </div>

          <div className={styles.trackGroove}>
            <div className={styles.trackGhostBar} style={{ width: `${ghostProgressPct}%` }} />
            <div className={styles.trackUserBar} style={{ width: `${userProgressPct}%` }} />

            <span className={styles.ghostPin} style={{ left: `${ghostProgressPct}%` }}>
              {mission.ghostRival.avatar}
            </span>
            <span className={styles.userPin} style={{ left: `${userProgressPct}%` }}>
              {userProfile.avatar}
            </span>
          </div>
        </div>

        {/* Turn Progress Tracker (1, 2, 3) */}
        <div className={styles.turnProgressCluster}>
          {mission.turns.map((t: SpeakingTurn, idx: number) => {
            const isCompletedTurn = idx < currentTurnIdx;
            const isActiveTurn = idx === currentTurnIdx;
            return (
              <div
                key={t.turnNumber}
                className={`${styles.turnIndicator} ${
                  isCompletedTurn ? styles.completed : isActiveTurn ? styles.active : ""
                }`}
              >
                <span>{isCompletedTurn ? "✓" : t.turnNumber}</span>
                <span>
                  {idx === 0 ? "شروع و احوالپرسی" : idx === 1 ? "چالش اصلی" : "جمع‌بندی نهایی"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Stage Content Body */}
        {currentTurn && (
          <div className={styles.stageBody}>
            {/* Character Dialogue Bubble */}
            <div className={styles.characterCard}>
              <div className={styles.characterAvatarBox}>
                <div className={styles.characterAvatar}>{currentTurn.characterSpeaker.avatar || "👤"}</div>
                <span className={styles.characterRoleBadge}>{currentTurn.characterSpeaker.roleFa}</span>
              </div>

              <div className={styles.characterDialogueBox}>
                <div className={styles.nameRow}>
                  <span className={styles.characterName}>{currentTurn.characterSpeaker.name}</span>
                  <button
                    className={styles.listenAudioBtn}
                    onClick={() => playCharacterVoice(currentTurn.characterSpeaker.text)}
                    type="button"
                  >
                    🔊 شنیدن دوباره
                  </button>
                </div>
                <div className={styles.dialogueTextPrompt}>{currentTurn.characterSpeaker.text}</div>
              </div>
            </div>

            {/* Pressure Clock & Waveform Display */}
            <div className={styles.pressureClockHud}>
              <div className={styles.pressureGauge}>
                <div
                  className={`${styles.pressureTimerCircle} ${
                    turnSecondsLeft <= 4 ? styles.danger : turnSecondsLeft <= 8 ? styles.warning : ""
                  }`}
                >
                  {turnSecondsLeft}
                </div>
                <div className={styles.pressureMeta}>
                  <span className={styles.pressureLabel}>ساعت واکنش (Pressure Clock)</span>
                  <span className={styles.pressureBonusText}>
                    {turnSecondsLeft > 8 ? "⚡ بانس سرعت حداکثر (+۱۵۰)" : "⏱️ زمان در حال اتمام"}
                  </span>
                </div>
              </div>

              {/* Animated Waveform Bars */}
              <div className={styles.waveformBox}>
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className={`${styles.waveBar} ${isListening ? styles.listening : ""}`}
                    style={{
                      animationDelay: `${(i % 6) * 0.12}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Keyword Objectives Section */}
            <div className={styles.keywordsBox}>
              <div className={styles.keywordsHeader}>
                <span className={styles.keywordsTitle}>
                  🗝️ کلمات و اصطلاحات کلیدی ماموریت (Keyword Objectives)
                </span>
                <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                  {mission.cefr === "C1" || mission.cefr === "C2"
                    ? "🕵️ سطح پیشرفته: اهداف اصطلاحی را در جمله ادا کن تا آشکار شوند!"
                    : "با ادای این کلمات قفل پاداش مرحله باز می‌شود"}
                </span>
              </div>

              <div className={styles.keywordsGrid}>
                {currentTurn.keywords.map((kw: SpeakingKeywordObjective) => {
                  const isFound = turnKeywordStatus[kw.id];
                  const isAdvancedTier = mission.cefr === "C1" || mission.cefr === "C2";
                  return (
                    <div
                      key={kw.id}
                      className={`${styles.keywordCard} ${isFound ? styles.discovered : ""}`}
                    >
                      <div>
                        <div className={styles.keywordText}>
                          {isFound ? `✓ ${kw.phrase}` : isAdvancedTier ? "🔒 [اصطلاح هدف]" : kw.phrase}
                        </div>
                        <div className={styles.keywordHint}>{kw.phoneticOrHintFa}</div>
                      </div>
                      <span className={styles.keywordBadge}>
                        {isFound ? "باز شد!" : `+${kw.weight * 5} XP`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Speaking Action Zone */}
            <div className={styles.actionZone}>
              {!isEmergencyFallback ? (
                <>
                  <div className={styles.micCluster}>
                    <button
                      className={`${styles.recordBtn} ${isListening ? styles.listening : ""}`}
                      onClick={toggleListening}
                      type="button"
                      title={isListening ? "توقف ضبط" : "شروع صحبت کردن"}
                    >
                      {isListening ? "⏹️" : "🎙️"}
                    </button>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                        {isListening ? "در حال شنیدن صدای شما..." : "روی میکروفون کلیک کن و صحبت کن!"}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "0.2rem" }}>
                        پاسخ پیشنهادی: {currentTurn.idealResponse.explanationFa}
                      </div>
                    </div>
                  </div>

                  {/* Live Speech Recognition Transcript */}
                  <div className={styles.liveTranscriptCard}>
                    {transcript ? (
                      <span className={styles.transcriptText}>"{transcript}"</span>
                    ) : (
                      <span className={styles.transcriptPlaceholder}>
                        (جمله خود را به انگلیسی بیان کنید؛ امواج صدا اینجا ظاهر می‌شوند)
                      </span>
                    )}
                  </div>

                  {/* Submit / Next Turn Button */}
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button
                      className={styles.primaryActionBtn}
                      onClick={() => handleTurnSubmit(false)}
                      disabled={!transcript && !isListening}
                      type="button"
                    >
                      تایید و ارسال پاسخ نوبت ←
                    </button>
                    <button
                      className={styles.secondaryActionBtn}
                      onClick={() => setIsEmergencyFallback(true)}
                      type="button"
                    >
                      الان نمی‌توانم بلند صحبت کنم
                    </button>
                  </div>
                </>
              ) : (
                /* Emergency Fallback Mode: Multiple Choice Options */
                <div className={styles.fallbackContainer}>
                  <div className={styles.fallbackHeader}>
                    <span>حالت اضطراری (انتخاب پاسخ بدون میکروفون):</span>
                    <button
                      style={{ background: "none", border: "none", color: "#38bdf8", cursor: "pointer" }}
                      onClick={() => setIsEmergencyFallback(false)}
                      type="button"
                    >
                      🎙️ بازگشت به حالت میکروفون
                    </button>
                  </div>

                  {currentTurn.fallbackOptions.map((opt: string, oIdx: number) => (
                    <button
                      key={oIdx}
                      className={styles.fallbackOptionBtn}
                      onClick={() => {
                        setTranscript(opt);
                        // Check if opt matches keywords
                        currentTurn.keywords.forEach((kw: SpeakingKeywordObjective) => {
                          if (opt.toLowerCase().includes(kw.phrase.toLowerCase())) {
                            setTurnKeywordStatus((prev: Record<string, boolean>) => ({ ...prev, [kw.id]: true }));
                          }
                        });
                        handleTurnSubmit(false);
                      }}
                      type="button"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* FINAL VICTORY SCORECARD MODAL */}
        {/* ------------------------------------------------------------- */}
        {isCompleted && (
          <div className={styles.scorecardOverlay}>
            <div className={styles.scorecardContent}>
              <div className={styles.scorecardHeader}>
                <div className={styles.starsRow}>
                  {"⭐".repeat(starsCount)}
                  {"☆".repeat(Math.max(0, 3 - starsCount))}
                </div>
                <h1 className={styles.victoryTitle}>
                  {finalScore > mission.ghostRival.targetScore
                    ? "پیروزی در دوئل اسپیکینگ!"
                    : "ماموریت صوتی با موفقیت تمام شد!"}
                </h1>
                <p style={{ color: "#94a3b8", fontSize: "0.95rem", margin: 0 }}>
                  سطح {mission.cefr} - مرحله {mission.levelNumber}: {mission.titleFa}
                </p>
              </div>

              {/* Head-to-Head Duel Comparison Box */}
              <div className={styles.duelComparisonGrid}>
                <div
                  className={`${styles.duelPlayerCard} ${
                    finalScore > mission.ghostRival.targetScore ? styles.winner : ""
                  }`}
                >
                  <span className={styles.duelAvatar}>{userProfile.avatar}</span>
                  <span className={styles.duelName}>شما ({userProfile.nickname})</span>
                  <span className={styles.duelScore}>{finalScore.toLocaleString("fa-IR")} pts</span>
                  {finalScore > mission.ghostRival.targetScore && (
                    <span style={{ fontSize: "0.75rem", color: "#34d399", fontWeight: 800 }}>
                      👑 برنده دوئل
                    </span>
                  )}
                </div>

                <div className={styles.duelVsDivider}>VS</div>

                <div
                  className={`${styles.duelPlayerCard} ${
                    mission.ghostRival.targetScore >= finalScore ? styles.winner : ""
                  }`}
                >
                  <span className={styles.duelAvatar}>{mission.ghostRival.avatar}</span>
                  <span className={styles.duelName}>شبح رقیب ({mission.ghostRival.name})</span>
                  <span className={styles.duelScore} style={{ color: "#a855f7" }}>
                    {mission.ghostRival.targetScore.toLocaleString("fa-IR")} pts
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                    {mission.ghostRival.city} • {mission.ghostRival.wpm} WPM
                  </span>
                </div>
              </div>

              {/* 4 Core Feedback Metrics */}
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <span className={styles.metricValue}>
                    {wordsSpokenCount > 0
                      ? Math.min(180, Math.round(wordsSpokenCount / Math.max(0.3, totalSpeakingDurationSec / 60)))
                      : 110}
                  </span>
                  <span className={styles.metricLabel}>کلمات بر دقیقه (WPM)</span>
                </div>

                <div className={styles.metricCard}>
                  <span className={styles.metricValue}>
                    {Math.max(0, 100 - hesitationsCount * 5)}%
                  </span>
                  <span className={styles.metricLabel}>روانی کلام (Fluency)</span>
                </div>

                <div className={styles.metricCard}>
                  <span className={styles.metricValue}>
                    {allFoundKeywords.length}
                  </span>
                  <span className={styles.metricLabel}>کلمات کلیدی کشف‌شده</span>
                </div>

                <div className={styles.metricCard}>
                  <span className={styles.metricValue}>
                    +{xpWon.toLocaleString("fa-IR")}
                  </span>
                  <span className={styles.metricLabel}>امتیاز تجربه (XP)</span>
                </div>
              </div>

              {/* Awarded Badges */}
              {awardedBadges.length > 0 && (
                <div className={styles.badgesCluster}>
                  {awardedBadges.map((badge, bIdx) => (
                    <span key={bIdx} className={styles.badgePill}>
                      {badge}
                    </span>
                  ))}
                </div>
              )}

              {/* Native Vocabulary Expansion Box */}
              {mission.turns[0]?.vocabUpgrades && (
                <div className={styles.vocabExpansionBox}>
                  <div className={styles.vocabBoxTitle}>
                    💡 جعبه طلایی ارتقای دایره لغات (Native Vocabulary Expansion)
                  </div>
                  {mission.turns
                    .flatMap((t: SpeakingTurn) => t.vocabUpgrades)
                    .slice(0, 2)
                    .map((item: SpeakingVocabUpgrade, i: number) => (
                      <div key={i} className={styles.vocabItemRow}>
                        <div className={styles.vocabPhrases}>
                          <span className={styles.learnerPhraseOld}>{item.learnerPhrase}</span>
                          <span className={styles.nativePhraseNew}>{item.nativeUpgrade}</span>
                        </div>
                        <span className={styles.vocabNoteFa}>{item.explanationFa}</span>
                        <button
                          className={styles.playAudioMiniBtn}
                          onClick={() => playNativeUpgradeAudio(item.audioText)}
                          type="button"
                          title="شنیدن تلفظ نیتیو"
                        >
                          🔊 تلفظ
                        </button>
                      </div>
                    ))}
                </div>
              )}

              {/* Actions */}
              <div className={styles.scorecardActions}>
                {onNextLevel && mission.levelNumber < 10 && (
                  <button
                    className={styles.primaryActionBtn}
                    onClick={() => {
                      onNextLevel();
                    }}
                    type="button"
                  >
                    مرحله بعدی ({mission.levelNumber + 1}) →
                  </button>
                )}
                {onOpenLeaderboard && (
                  <button
                    className={styles.secondaryActionBtn}
                    onClick={onOpenLeaderboard}
                    type="button"
                  >
                    🏆 لیدربورد و رتبه‌بندی
                  </button>
                )}
                <button
                  className={styles.secondaryActionBtn}
                  onClick={onClose}
                  type="button"
                >
                  بازگشت به نقشه مراحل
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

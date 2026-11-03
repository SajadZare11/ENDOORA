"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./wiretap-cipher.module.css";
import type { GameLevel } from "../../../data/skills/games/types";
import { getWiretapStage } from "../../../data/skills/games/wiretap-cipher-curriculum";
import type { WiretapStage } from "../../../data/skills/games/wiretap-cipher-types";
import { wiretapAudio } from "../../../lib/skills/wiretap-audio-engine";
import { recordWiretapCompletion } from "../../../lib/skills/game-storage";
import { soundSynth } from "../../../lib/skills/game-audio";
import { WiretapDossierModal } from "./WiretapDossierModal";

interface Props {
  level: GameLevel;
  onClose: () => void;
  onNextLevel?: () => void;
  onOpenLeaderboard?: () => void;
}

export function WiretapCipherArena({
  level,
  onClose,
  onNextLevel,
  onOpenLeaderboard,
}: Props) {
  const stageData: WiretapStage | undefined = getWiretapStage(level.cefr, level.levelNumber);

  // Fallback if data is missing
  const fallbackStage: WiretapStage = {
    levelNumber: level.levelNumber,
    cefr: (level.cefr as any) || "B1",
    caseCode: `CASE-${level.cefr}-${level.levelNumber}`,
    tapeCode: `REEL #${level.cefr}-${level.levelNumber}`,
    caseTitleFa: level.titleFa || "تمرین شنیداری",
    caseTitleEn: level.titleEn || "Listening Practice",
    mysterySeriesTitleFa: "استودیوی شنیداری",
    locationFa: "لندن",
    targetFrequencyMHz: 94.6,
    speaker: { name: "Agent Vance", roleFa: "گوینده زبان", accent: "en-GB" },
    speechRate: 1.0,
    noiseLevel: "low",
    xpReward: level.xpReward || 100,
    timeLimitSeconds: 80,
    audioScriptEn:
      "Pay close attention. The secret rendezvous is set for tomorrow midnight at the old clocktower. Bring the cipher notebook without fail.",
    audioScriptFa:
      "با دقت گوش کنید. قرار ملاقات برای فردا نیمه‌شب در برج ساعت قدیمی تعیین شده است.",
    audioUrl: `/audio/skills/listening/${level.cefr.toLowerCase()}-${String(level.levelNumber).padStart(2, "0")}.mp3`,
    interceptWords: [
      { id: "w1", word: "secret", explanationFa: "محرمانه" },
      { id: "w2", word: "midnight", explanationFa: "نیمه‌شب" },
      { id: "w3", word: "clocktower", explanationFa: "برج ساعت" },
      { id: "w4", word: "cipher", explanationFa: "رمز" },
      { id: "d1", word: "morning", isDistractor: true, explanationFa: "کلمه گمراه‌کننده" },
    ],
    requiredInterceptCount: 3,
    burntGaps: [
      {
        id: "g1",
        beforeText: "The secret rendezvous is at the",
        afterText: ".",
        correctWord: "clocktower",
        options: ["clocktower", "harbor", "museum"],
        explanationFa: "محل قرار برج ساعت بود.",
      },
    ],
    deduction: {
      questionFa: "محل قرار ملاقات ذکر شده در پیام کجا بود؟",
      optionsFa: [
        "در برج ساعت قدیمی",
        "در ایستگاه قطار",
        "در موزه شهر",
        "در اسکله باربری",
      ],
      correctOptionIndex: 0,
      explanationFa: "گوینده صراحتاً clocktower را بیان کرد.",
    },
  };

  const activeStage = stageData || fallbackStage;

  // Game state
  const [phase, setPhase] = useState<1 | 2 | 3 | 4 | "win" | "lose">(1);
  const [signalIntegrity, setSignalIntegrity] = useState(100);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(activeStage.timeLimitSeconds);
  const [currentMHz, setCurrentMHz] = useState(88.0);
  const [isSignalLocked, setIsSignalLocked] = useState(false);
  const [isPlayingTape, setIsPlayingTape] = useState(false);
  const [speechRate, setSpeechRate] = useState(activeStage.speechRate);
  const [interceptedWordIds, setInterceptedWordIds] = useState<string[]>([]);
  const [decoyHitIds, setDecoyHitIds] = useState<string[]>([]);
  const [filledGaps, setFilledGaps] = useState<Record<string, string>>({});
  const [selectedDeductionIdx, setSelectedDeductionIdx] = useState<number | null>(null);
  const [shuffledDeductionOptions, setShuffledDeductionOptions] = useState<
    { text: string; originalIndex: number }[]
  >([]);
  const [isDossierOpen, setIsDossierOpen] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Fisher-Yates shuffle helper
  const shuffleDeduction = useCallback((options: string[]) => {
    const list = options.map((text, originalIndex) => ({ text, originalIndex }));
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }, []);

  // Shuffle deduction options whenever activeStage changes
  useEffect(() => {
    if (activeStage.deduction?.optionsFa) {
      setShuffledDeductionOptions(shuffleDeduction(activeStage.deduction.optionsFa));
    }
  }, [activeStage, shuffleDeduction]);

  // Initialize frequency tuning at an organic, random distance
  useEffect(() => {
    const direction = Math.random() > 0.5 ? 1 : -1;
    const offset = 3.0 + Math.random() * 2.5;
    let initialOff = activeStage.targetFrequencyMHz + direction * offset;
    if (initialOff < 88.0) initialOff = activeStage.targetFrequencyMHz + offset;
    if (initialOff > 108.0) initialOff = activeStage.targetFrequencyMHz - offset;
    const roundedOff = Number(Math.max(88.0, Math.min(108.0, initialOff)).toFixed(1));

    setCurrentMHz(roundedOff);
    wiretapAudio.startRadioStatic(activeStage.targetFrequencyMHz, roundedOff);

    return () => {
      wiretapAudio.dispose();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeStage]);

  // Countdown timer
  useEffect(() => {
    if (phase === "win" || phase === "lose") return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  // Smooth Modern Audio Wave Canvas (Clean Indigo / Sky Blue on Light Background)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phaseOffset = 0;

    const renderWave = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Soft clean grid lines
      ctx.strokeStyle = "rgba(226, 232, 240, 0.8)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Draw active waveform
      ctx.beginPath();
      const centerY = height / 2;
      const amplitude = isPlayingTape ? (isSignalLocked ? 20 : 10) : 4;
      const freqMultiplier = isSignalLocked ? 0.045 : 0.08;

      ctx.strokeStyle = isSignalLocked ? "#2563eb" : "#f59e0b";
      ctx.lineWidth = 2.5;

      for (let x = 0; x < width; x++) {
        const noise = (Math.random() - 0.5) * (isSignalLocked ? 1.5 : 5);
        const y = centerY + Math.sin(x * freqMultiplier + phaseOffset) * amplitude + noise;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phaseOffset += isPlayingTape ? 0.22 : 0.06;
      animFrameRef.current = requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlayingTape, isSignalLocked]);

  // Frequency tuning handler
  const handleFrequencyChange = (newFreq: number) => {
    const rounded = Number(newFreq.toFixed(1));
    setCurrentMHz(rounded);
    wiretapAudio.playDialTick();
    wiretapAudio.updateTuningStatic(activeStage.targetFrequencyMHz, rounded);

    const delta = Math.abs(rounded - activeStage.targetFrequencyMHz);
    const locked = delta <= 0.35;
    if (locked && !isSignalLocked) {
      setIsSignalLocked(true);
      wiretapAudio.stopRadioStatic();
      soundSynth.playCorrect();
      setTimeout(() => {
        setPhase(2);
        startTapePlayback();
      }, 400);
    } else if (!locked && isSignalLocked) {
      setIsSignalLocked(false);
    }
  };

  // Playback Handlers
  const startTapePlayback = useCallback(() => {
    setIsPlayingTape(true);
    wiretapAudio.playStageAudio(
      activeStage.audioUrl,
      activeStage.audioScriptEn,
      activeStage.speaker.accent,
      speechRate,
      undefined,
      () => {
        setIsPlayingTape(false);
      }
    );
  }, [activeStage, speechRate]);

  const stopTapePlayback = useCallback(() => {
    wiretapAudio.stopSpeaking();
    setIsPlayingTape(false);
  }, []);

  const handleReplay = () => {
    stopTapePlayback();
    setTimeout(() => {
      startTapePlayback();
    }, 200);
  };

  // Signal Damage
  const penalizeSignal = (amount: number) => {
    wiretapAudio.playSignalLossWarning();
    setSignalIntegrity((prev) => {
      const next = Math.max(0, prev - amount);
      if (next <= 0) {
        handleGameOver();
      }
      return next;
    });
  };

  // Phase 2: Word Click
  const handleWordInterceptClick = (wordObj: typeof activeStage.interceptWords[0]) => {
    if (wordObj.isDistractor) {
      setDecoyHitIds((prev) => [...prev, wordObj.id]);
      penalizeSignal(15);
      return;
    }

    if (interceptedWordIds.includes(wordObj.id)) return;

    const newIntercepts = [...interceptedWordIds, wordObj.id];
    setInterceptedWordIds(newIntercepts);
    wiretapAudio.playWordInterceptHit();
    setScore((prev) => prev + 150);

    if (newIntercepts.length >= activeStage.requiredInterceptCount) {
      soundSynth.playCorrect();
      setTimeout(() => {
        setPhase(3);
      }, 600);
    }
  };

  // Phase 3: Gap Fill
  const handleGapSelect = (gapId: string, chosenWord: string, correctWord: string) => {
    if (chosenWord === correctWord) {
      soundSynth.playCorrect();
      const updated = { ...filledGaps, [gapId]: chosenWord };
      setFilledGaps(updated);
      setScore((prev) => prev + 200);

      if (Object.keys(updated).length >= activeStage.burntGaps.length) {
        setTimeout(() => {
          setPhase(4);
        }, 700);
      }
    } else {
      penalizeSignal(18);
    }
  };

  // Phase 4: Deduction Quiz
  const handleDeductionSelect = (optionIdx: number) => {
    setSelectedDeductionIdx(optionIdx);
    const selected = shuffledDeductionOptions[optionIdx];
    const isCorrect = selected
      ? selected.originalIndex === activeStage.deduction.correctOptionIndex
      : optionIdx === activeStage.deduction.correctOptionIndex;

    if (isCorrect) {
      soundSynth.playCorrect();
      soundSynth.playFanfare();
      const finalScoreCalc = score + 400 + Math.round(signalIntegrity * 2.5);
      setScore(finalScoreCalc);
      setPhase("win");

      const stars = signalIntegrity >= 70 ? 3 : signalIntegrity >= 40 ? 2 : 1;

      recordWiretapCompletion(activeStage.cefr, activeStage.levelNumber, {
        caseCode: activeStage.caseCode,
        finalScore: finalScoreCalc,
        accuracyPct: Math.round(signalIntegrity),
        signalIntegrity,
        stars,
        passed: true,
        baseXp: activeStage.xpReward,
      });
    } else {
      penalizeSignal(25);
    }
  };

  // Game Over
  const handleGameOver = () => {
    stopTapePlayback();
    wiretapAudio.playSignalLossWarning();
    setPhase("lose");
  };

  // Retry
  const handleRetry = () => {
    setPhase(1);
    setSignalIntegrity(100);
    setScore(0);
    setTimeRemaining(activeStage.timeLimitSeconds);
    setInterceptedWordIds([]);
    setDecoyHitIds([]);
    setFilledGaps({});
    setSelectedDeductionIdx(null);
    setIsSignalLocked(false);

    // Reshuffle options on retry
    if (activeStage.deduction?.optionsFa) {
      setShuffledDeductionOptions(shuffleDeduction(activeStage.deduction.optionsFa));
    }

    const direction = Math.random() > 0.5 ? 1 : -1;
    const offset = 3.0 + Math.random() * 2.5;
    let initialOff = activeStage.targetFrequencyMHz + direction * offset;
    if (initialOff < 88.0) initialOff = activeStage.targetFrequencyMHz + offset;
    if (initialOff > 108.0) initialOff = activeStage.targetFrequencyMHz - offset;
    const roundedOff = Number(Math.max(88.0, Math.min(108.0, initialOff)).toFixed(1));

    setCurrentMHz(roundedOff);
    wiretapAudio.startRadioStatic(activeStage.targetFrequencyMHz, roundedOff);
  };

  const getSignalColor = () => {
    if (signalIntegrity > 60) return "#10b981";
    if (signalIntegrity > 30) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.consoleContainer}>
        {/* Top Clean Header Panel */}
        <div className={styles.headerPanel}>
          <div className={styles.tapeInfo}>
            <span className={styles.classifiedBadge}>
              🎧 تمرین شنیداری • سطح {activeStage.cefr}
            </span>
            <h2 className={styles.stageTitle}>{activeStage.caseTitleFa}</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <button
              className={styles.dossierBtn}
              onClick={() => setIsDossierOpen(true)}
              title="مشاهده راهنمای مرحله"
            >
              💡 راهنمای تمرین
            </button>
            <button className={styles.closeButton} onClick={onClose} title="بستن پنجره">
              ✕
            </button>
          </div>
        </div>

        {/* Telemetry Row */}
        <div className={styles.telemetryRow}>
          <div className={styles.signalBlock}>
            <span className={styles.signalLabel}>دقت و سلامت سیگنال:</span>
            <div className={styles.signalBarTrack}>
              <div
                className={styles.signalBarFill}
                style={{
                  width: `${signalIntegrity}%`,
                  background: getSignalColor(),
                }}
              />
            </div>
            <span className={styles.signalPercent} style={{ color: getSignalColor() }}>
              {signalIntegrity}٪
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span className={styles.timerPill}>
              ⏱️ {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
            </span>
            <span className={styles.scorePill}>🏆 {score.toLocaleString("fa-IR")} امتیاز</span>
          </div>
        </div>

        {/* Main Operational Deck */}
        <div className={styles.operationalDeck}>
          {/* Modern Audio Player & Waveform Deck */}
          <div className={styles.deckHardware}>
            {/* Visual Reel Spools */}
            <div className={styles.reelConsole}>
              <div className={styles.reelsContainer}>
                <div className={`${styles.spool} ${isPlayingTape ? styles.spoolSpinning : ""}`}>
                  <div className={styles.spoolInnerHoles} />
                </div>
                <div className={`${styles.spool} ${isPlayingTape ? styles.spoolSpinning : ""}`}>
                  <div className={styles.spoolInnerHoles} />
                </div>
              </div>

              <div className={styles.recIndicator}>
                <div
                  className={`${styles.recLed} ${isPlayingTape ? styles.recLedBlinking : ""}`}
                />
                <span>{isPlayingTape ? "در حال پخش صوت... 🔊" : "آماده پخش 🎧"}</span>
              </div>
            </div>

            {/* Clean Audio Wave Display */}
            <div className={styles.crtMonitor}>
              <div className={styles.crtHeader}>
                <span>نمایشگر موج صدا</span>
                <span>
                  🗣️ {activeStage.speaker.name} ({activeStage.speaker.accent})
                </span>
              </div>

              <canvas
                ref={canvasRef}
                className={styles.oscilloscopeCanvas}
                width={480}
                height={64}
              />

              <div className={styles.frequencyDisplayRow}>
                <div>
                  <span className={styles.currentFreqText}>{currentMHz.toFixed(1)} MHz</span>
                </div>
                <div>
                  <span
                    className={`${styles.lockBadge} ${
                      isSignalLocked ? styles.lockBadgeLocked : styles.lockBadgeSearching
                    }`}
                  >
                    {isSignalLocked ? "🔒 موج تنظیم شد" : "📻 در حال تنظیم موج..."}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stepper Navigation */}
          <div className={styles.stepperRow}>
            <div
              className={`${styles.stepPill} ${
                phase === 1
                  ? styles.stepPillActive
                  : (typeof phase === "number" && phase > 1) || phase === "win"
                  ? styles.stepPillCompleted
                  : ""
              }`}
            >
              <span>۱. تنظیم موج صدا</span>
            </div>
            <div
              className={`${styles.stepPill} ${
                phase === 2
                  ? styles.stepPillActive
                  : (typeof phase === "number" && phase > 2) || phase === "win"
                  ? styles.stepPillCompleted
                  : ""
              }`}
            >
              <span>۲. شکار کلمات</span>
            </div>
            <div
              className={`${styles.stepPill} ${
                phase === 3
                  ? styles.stepPillActive
                  : (typeof phase === "number" && phase > 3) || phase === "win"
                  ? styles.stepPillCompleted
                  : ""
              }`}
            >
              <span>۳. تکمیل متن</span>
            </div>
            <div
              className={`${styles.stepPill} ${
                phase === 4
                  ? styles.stepPillActive
                  : phase === "win"
                  ? styles.stepPillCompleted
                  : ""
              }`}
            >
              <span>۴. درک مطلب</span>
            </div>
          </div>

          {/* Audio Controls Bar */}
          {isSignalLocked && phase !== "win" && phase !== "lose" && (
            <div className={styles.tapeControlsBar}>
              <button
                className={`${styles.controlBtn} ${styles.controlBtnPlay}`}
                onClick={isPlayingTape ? stopTapePlayback : startTapePlayback}
              >
                {isPlayingTape ? "⏸️ توقف پخش" : "▶️ پخش مجدد صدا"}
              </button>
              <button className={styles.controlBtn} onClick={handleReplay}>
                🔄 بازگشت به اول
              </button>

              <div className={styles.speedSelector}>
                <span style={{ fontSize: "0.82rem", color: "#64748b", marginInline: "0.3rem" }}>
                  سرعت:
                </span>
                {[0.8, 1.0, 1.25].map((s) => (
                  <button
                    key={s}
                    className={`${styles.speedBtn} ${speechRate === s ? styles.speedBtnActive : ""}`}
                    onClick={() => {
                      setSpeechRate(s);
                      wiretapAudio.setPlaybackRate(s);
                    }}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PHASE 1: Frequency Tuner */}
          {phase === 1 && (
            <div className={styles.phaseCard}>
              <div className={styles.phaseHeader}>
                <h3 className={styles.phaseTitle}>
                  <span>🎛️ گام اول: تنظیم موج رادیو</span>
                </h3>
                <span className={styles.targetHintPill}>
                  فرکانس هدف: {activeStage.targetFrequencyMHz} MHz
                </span>
              </div>
              <p className={styles.phaseHelp}>
                اسلایدر را جابجا کنید تا روی موج <strong>{activeStage.targetFrequencyMHz} MHz</strong>{" "}
                قرار بگیرید. به محض رسیدن به موج درست، صدا شفاف شده و مرحله بعد فعال می‌شود.
              </p>

              <div className={styles.tunerModule}>
                <div className={styles.tunerSliderWrapper}>
                  <button
                    className={styles.tunerFineBtn}
                    onClick={() => handleFrequencyChange(Math.max(88.0, currentMHz - 0.2))}
                  >
                    - ۰.۲
                  </button>
                  <input
                    type="range"
                    min="88.0"
                    max="108.0"
                    step="0.1"
                    value={currentMHz}
                    onChange={(e) => handleFrequencyChange(parseFloat(e.target.value))}
                    className={styles.tunerSlider}
                  />
                  <button
                    className={styles.tunerFineBtn}
                    onClick={() => handleFrequencyChange(Math.min(108.0, currentMHz + 0.2))}
                  >
                    + ۰.۲
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PHASE 2: Live Word Intercept */}
          {phase === 2 && (
            <div className={styles.phaseCard}>
              <div className={styles.phaseHeader}>
                <h3 className={styles.phaseTitle}>
                  <span>🎙️ گام دوم: کلمات شنیده‌شده را انتخاب کنید</span>
                </h3>
                <span style={{ fontSize: "0.85rem", color: "#16a34a", fontWeight: 700 }}>
                  یافت‌شده: {interceptedWordIds.length} از {activeStage.requiredInterceptCount}
                </span>
              </div>
              <p className={styles.phaseHelp}>
                به مکالمه با دقت گوش کنید. هر کلمه‌ای را که در صوت می‌شنوید لمس کنید. مراقب
                گزینه‌های گمراه‌کننده باشید!
              </p>

              <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap", marginBlock: "0.25rem" }}>
                <button
                  className={`${styles.controlBtn} ${isPlayingTape ? styles.controlBtnPlaying : styles.controlBtnPlay}`}
                  onClick={isPlayingTape ? stopTapePlayback : startTapePlayback}
                  style={{ padding: "0.6rem 1.25rem", fontSize: "0.95rem" }}
                >
                  {isPlayingTape ? "⏸️ توقف پخش صوت" : "▶️ پخش صدای مکالمه 🎧"}
                </button>
                <button
                  className={styles.controlBtn}
                  onClick={handleReplay}
                  style={{ padding: "0.6rem 1rem", fontSize: "0.9rem" }}
                >
                  🔄 پخش از اول
                </button>
              </div>

              <div className={styles.wordPoolGrid}>
                {activeStage.interceptWords.map((wordObj) => {
                  const isCaught = interceptedWordIds.includes(wordObj.id);
                  const isDecoy = decoyHitIds.includes(wordObj.id);
                  return (
                    <button
                      key={wordObj.id}
                      onClick={() => handleWordInterceptClick(wordObj)}
                      className={`${styles.wordChip} ${
                        isCaught
                          ? styles.wordChipIntercepted
                          : isDecoy
                          ? styles.wordChipDecoyHit
                          : ""
                      }`}
                      title={wordObj.explanationFa}
                    >
                      <span>{isCaught ? "✓ " : ""}{wordObj.word}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* PHASE 3: Gap Fill */}
          {phase === 3 && (
            <div className={styles.phaseCard}>
              <div className={styles.phaseHeader}>
                <h3 className={styles.phaseTitle}>
                  <span>✍️ گام سوم: جای خالی متن را تکمیل کنید</span>
                </h3>
                <span style={{ fontSize: "0.85rem", color: "#2563eb", fontWeight: 700 }}>
                  تکمیل: {Object.keys(filledGaps).length} از {activeStage.burntGaps.length}
                </span>
              </div>
              <p className={styles.phaseHelp}>
                با توجه به صدایی که شنیدید، کلمه درست را برای جای خالی انتخاب کنید.
              </p>

              <div className={styles.memoBoard}>
                {activeStage.burntGaps.map((gap) => {
                  const isFilled = filledGaps[gap.id] === gap.correctWord;
                  return (
                    <div key={gap.id} className={styles.gapSentenceCard}>
                      <div className={styles.gapTextPrompt}>
                        {gap.beforeText}{" "}
                        <span
                          className={`${styles.burntBlank} ${
                            isFilled ? styles.burntBlankFilled : ""
                          }`}
                        >
                          {isFilled ? gap.correctWord : "[ ... ]"}
                        </span>{" "}
                        {gap.afterText}
                      </div>

                      {!isFilled && (
                        <div className={styles.gapOptionsRow}>
                          {gap.options.map((opt) => (
                            <button
                              key={opt}
                              className={styles.gapOptionBtn}
                              onClick={() => handleGapSelect(gap.id, opt, gap.correctWord)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PHASE 4: Deduction Quiz */}
          {phase === 4 && (
            <div className={styles.phaseCard}>
              <div className={styles.phaseHeader}>
                <h3 className={styles.phaseTitle}>
                  <span>🎯 گام چهارم: درک مطلب و نتیجه‌گیری</span>
                </h3>
              </div>
              <div className={styles.deductionQuestion}>{activeStage.deduction.questionFa}</div>

              <div className={styles.deductionOptionsList}>
                {(shuffledDeductionOptions.length > 0
                  ? shuffledDeductionOptions
                  : activeStage.deduction.optionsFa.map((text, originalIndex) => ({ text, originalIndex }))
                ).map((optObj, idx) => (
                  <div
                    key={idx}
                    className={`${styles.deductionOptionItem} ${
                      selectedDeductionIdx === idx ? styles.deductionOptionItemSelected : ""
                    }`}
                    onClick={() => handleDeductionSelect(idx)}
                  >
                    <span>{idx + 1}.</span>
                    <span>{optObj.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WIN OUTCOME */}
          {phase === "win" && (
            <div className={styles.outcomeModal}>
              <div className={styles.starsRow}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      color:
                        i < (signalIntegrity >= 70 ? 3 : signalIntegrity >= 40 ? 2 : 1)
                          ? "#f59e0b"
                          : "#cbd5e1",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <h2 className={styles.outcomeTitle}>
                آفرین! تمرین رو عالی انجام دادی 🎉
              </h2>
              <p className={styles.outcomeDesc}>
                به تمام بخش‌های مکالمه به خوبی گوش دادی و کلمات و مفهوم درس را کامل متوجه شدی.
              </p>

              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>امتیاز کسب‌شده</span>
                  <span className={styles.statVal}>{score.toLocaleString("fa-IR")}</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>دقت شنیداری</span>
                  <span className={styles.statVal} style={{ color: "#16a34a" }}>
                    {signalIntegrity}٪
                  </span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>پاداش XP</span>
                  <span className={styles.statVal} style={{ color: "#2563eb" }}>
                    +{activeStage.xpReward}
                  </span>
                </div>
              </div>

              {activeStage.aftermathReportFa && (
                <div className={styles.aftermathCard}>
                  <div className={styles.aftermathHeader}>
                    <span>💡 نتیجه تمرین:</span>
                  </div>
                  <p className={styles.aftermathText}>{activeStage.aftermathReportFa}</p>
                  {activeStage.cliffhangerFa && (
                    <div className={styles.cliffhangerBox}>
                      <span>✨ {activeStage.cliffhangerFa}</span>
                    </div>
                  )}
                </div>
              )}

              <div className={styles.actionBtnRow}>
                {onNextLevel && level.levelNumber < 10 && (
                  <button className={styles.primaryActionBtn} onClick={onNextLevel}>
                    🎧 رفتن به تمرین بعدی ({level.levelNumber + 1}) →
                  </button>
                )}
                {onOpenLeaderboard && (
                  <button className={styles.secondaryActionBtn} onClick={onOpenLeaderboard}>
                    📊 تابلوی امتیازات
                  </button>
                )}
                <button className={styles.secondaryActionBtn} onClick={onClose}>
                  بازگشت به فهرست
                </button>
              </div>
            </div>
          )}

          {/* LOSE OUTCOME */}
          {phase === "lose" && (
            <div className={styles.outcomeModal}>
              <div style={{ fontSize: "2.8rem" }}>🎧💫</div>
              <h2 className={styles.outcomeTitle} style={{ color: "#e11d48" }}>
                اشکالی نداره دوست من! دوباره امتحان کنیم؟
              </h2>
              <p className={styles.outcomeDesc}>
                تمرین شنیداری نیاز به تکرار دارد. یک بار دیگر با آرامش گوش بده تا کلمات را دقیق‌تر متوجه شوی.
              </p>

              <div className={styles.actionBtnRow}>
                <button className={styles.primaryActionBtn} onClick={handleRetry}>
                  🔄 شروع مجدد تمرین
                </button>
                <button className={styles.secondaryActionBtn} onClick={onClose}>
                  بازگشت به فهرست
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Friendly Briefing Modal */}
      <WiretapDossierModal
        stage={activeStage}
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        onStart={() => setIsDossierOpen(false)}
      />
    </div>
  );
}

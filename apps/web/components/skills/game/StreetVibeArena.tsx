"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import styles from "./street-vibe.module.css";
import type { GameLevel } from "../../../data/skills/games/types";
import type {
  StreetVibeStage,
  StreetVibeLocationId,
  StreetVibeWave1Item,
  StreetVibeWave2Item,
  StreetVibeWave3ChainTurn,
  MatchTurnLog,
  MatchPayload,
  GhostRivalProfile,
  NpcReactionMood,
} from "../../../data/skills/games/street-vibe-types";
import {
  STREET_VIBE_STAGES,
  STREET_VIBE_LOCATIONS,
  getStreetVibeStage,
} from "../../../data/skills/games/street-vibe-data";
import {
  calculateQuestionScore,
  resolveDoubleOrNothingVault,
  getWordMastery,
  recordWordResult,
  getMissedWordsQueue,
  getLiveGhostRival,
  validateMatchSubmission,
} from "../../../lib/skills/street-vibe-engine";
import {
  recordVocabRushCompletion,
  getLevelDailyHighScore,
  saveStageBestPoints,
} from "../../../lib/skills/game-storage";
import { soundSynth } from "../../../lib/skills/game-audio";
import { playEnglishSpeech, stopEnglishSpeech } from "../../../lib/speech";

interface Props {
  level: GameLevel;
  onClose: () => void;
  onNextLevel?: () => void;
  onOpenLeaderboard?: () => void;
}

export function StreetVibeArena({ level, onClose, onNextLevel, onOpenLeaderboard }: Props) {
  // Resolve active StreetVibe stage (1 to 10)
  const stage: StreetVibeStage = useMemo(() => {
    return getStreetVibeStage(level.levelNumber);
  }, [level.levelNumber]);

  const locationInfo = STREET_VIBE_LOCATIONS[stage.locationId];

  // Match loop timers (120 real seconds: 40s Wave 1, 40s Wave 2, 40s Wave 3)
  const [matchTimeLeft, setMatchTimeLeft] = useState<number>(120);
  const [isMatchActive, setIsMatchActive] = useState<boolean>(true);
  const [activeWave, setActiveWave] = useState<1 | 2 | 3>(1);

  // Score & Streak State
  const [score, setScore] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [unstoppableCount, setUnstoppableCount] = useState<number>(0);
  const [isUnstoppableActive, setIsUnstoppableActive] = useState<boolean>(false);

  // Turn logs for Anti-Cheat
  const [turnLogs, setTurnLogs] = useState<MatchTurnLog[]>([]);
  const matchStartTimeRef = useRef<number>(Date.now());
  const questionStartTimeRef = useRef<number>(Date.now());

  // Wave 1 State
  const [w1Index, setW1Index] = useState<number>(0);
  const currentW1: StreetVibeWave1Item = stage.wave1Items[Math.min(w1Index, stage.wave1Items.length - 1)];

  // Wave 2 State
  const [w2Index, setW2Index] = useState<number>(0);
  const currentW2: StreetVibeWave2Item = stage.wave2Items[Math.min(w2Index, stage.wave2Items.length - 1)];
  const [grabbedItemIds, setGrabbedItemIds] = useState<string[]>([]);

  // Wave 3 Boss State
  const [w3TurnStep, setW3TurnStep] = useState<1 | 2 | 3 | 4>(1);
  const currentW3Turn: StreetVibeWave3ChainTurn = stage.wave3Boss.turns[w3TurnStep - 1];

  // Dynamic NPC Reaction & Patience State (20s for Wave 1/2, 15s for Wave 3 Boss)
  const [activeNpcMood, setActiveNpcMood] = useState<NpcReactionMood>("happy");
  const [activeComedyReaction, setActiveComedyReaction] = useState<string | null>(null);
  const [patiencePercent, setPatiencePercent] = useState<number>(100);
  const patienceDurationSeconds = activeWave === 3 ? 15.0 : 20.0;

  // Speak-to-Win Mic State
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);
  const [micStatusText, setMicStatusText] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Live Ghost Rival
  const [ghostRival, setGhostRival] = useState<GhostRivalProfile | null>(() => getLiveGhostRival(0));

  // Double-or-Nothing Vault Modal State
  const [isVaultModalOpen, setIsVaultModalOpen] = useState<boolean>(false);
  const [isVaultQuestionActive, setIsVaultQuestionActive] = useState<boolean>(false);
  const [vaultSelectedChoice, setVaultSelectedChoice] = useState<number | null>(null);

  // Celebration Modal State
  const [isCelebrationOpen, setIsCelebrationOpen] = useState<boolean>(false);
  const [celebrationData, setCelebrationData] = useState<{
    stars: number;
    finalScore: number;
    xpEarned: number;
    wordsLearned: number;
    accuracy: number;
    isDailyRecord: boolean;
  } | null>(null);

  // Floating score toast
  const [floatingToast, setFloatingToast] = useState<{ text: string; color: string } | null>(null);

  // Manual Audio Playback State (No automatic voice playing)
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const speakCurrentNpcLine = useCallback((text: string) => {
    try {
      if (isPlayingAudio) {
        stopEnglishSpeech();
        setIsPlayingAudio(false);
        return;
      }
      setIsPlayingAudio(true);
      playEnglishSpeech(text, {
        accent: "en-US",
        rate: 0.95,
        onEnd: () => setIsPlayingAudio(false),
      });
    } catch {
      setIsPlayingAudio(false);
    }
  }, [isPlayingAudio]);

  // Update question shown time (NO auto-play TTS)
  useEffect(() => {
    questionStartTimeRef.current = Date.now();
    setActiveComedyReaction(null);
    setPatiencePercent(100);
    stopEnglishSpeech();
    setIsPlayingAudio(false);
  }, [activeWave, w1Index, w2Index, w3TurnStep]);

  // Clean audio on unmount
  useEffect(() => {
    return () => {
      stopEnglishSpeech();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
    };
  }, []);

  // Show floating toast helper
  const showToast = (text: string, color: string = "#facc15") => {
    setFloatingToast({ text, color });
    setTimeout(() => {
      setFloatingToast(null);
    }, 1200);
  };

  // --------------------------------------------------------------------------
  // MATCH TIMER & PATIENCE TICKER
  // --------------------------------------------------------------------------

  // Prevent background scrolling while modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // 1. Real Match Timer (Ticks once every 1000ms / 1 real second)
  useEffect(() => {
    if (!isMatchActive || isVaultModalOpen || isCelebrationOpen) return;

    const timer = setInterval(() => {
      setMatchTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleMatchTimeExpired();
          return 0;
        }

        const next = prev - 1;

        // Transitions across 120 seconds (Forward only! Never force user back):
        // Wave 1: 120s to 80s (40 seconds)
        // Wave 2: 80s to 40s (40 seconds)
        // Wave 3: 40s to 0s (final 40 seconds Boss Fever)
        if (next <= 80 && next > 40) {
          setActiveWave((curr) => {
            if (curr < 2) {
              showToast("WAVE 2: REAL-WORLD GRAB!", "#2563eb");
              soundSynth.playFanfare();
              return 2;
            }
            return curr;
          });
        } else if (next <= 40) {
          setActiveWave((curr) => {
            if (curr < 3) {
              showToast("🔥 WAVE 3: BOSS FIGHT 2X FEVER!", "#ec4899");
              soundSynth.playFanfare();
              return 3;
            }
            return curr;
          });
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isMatchActive, isVaultModalOpen, isCelebrationOpen]);

  // 2. Patience Meter Decay (Smooth 100ms ticks across 20/15 seconds)
  useEffect(() => {
    if (!isMatchActive || isVaultModalOpen || isCelebrationOpen) return;

    const patienceInterval = setInterval(() => {
      setPatiencePercent((prev) => {
        const decayStep = 100 / (patienceDurationSeconds * 10); // 10 ticks per sec
        const nextVal = Math.max(0, prev - decayStep);
        if (nextVal <= 0) {
          handleAwkwardSilence();
          return 100;
        }
        return nextVal;
      });
    }, 100);

    return () => clearInterval(patienceInterval);
  }, [isMatchActive, isVaultModalOpen, isCelebrationOpen, patienceDurationSeconds]);

  // Update Live Ghost Rival as score changes
  useEffect(() => {
    const rival = getLiveGhostRival(score);
    if (rival) {
      if (ghostRival && rival.id !== ghostRival.id && score > ghostRival.score) {
        showToast(`OVERTAKEN: ${ghostRival.name}! 🚀`, "#10b981");
        soundSynth.playCombo(3);
      }
      if (!ghostRival || ghostRival.id !== rival.id) {
        setGhostRival(rival);
      }
    }
  }, [score, ghostRival]);

  // Awkward Silence penalty when patience runs out (Advance without duplicates)
  const handleAwkwardSilence = () => {
    setActiveNpcMood("facepalm");
    setActiveComedyReaction("Awkward silence! The NPC is tapping their foot impatiently!");
    soundSynth.playWrong();
    setCurrentStreak(0);
    setIsUnstoppableActive(false);

    // Apply -50 pts penalty
    setScore((s) => Math.max(0, s - 50));
    showToast("Awkward Silence! -50", "#ef4444");

    // Advance prompt without duplicate
    setTimeout(() => {
      setActiveComedyReaction(null);
      if (activeWave === 1) {
        if (w1Index + 1 < stage.wave1Items.length) {
          setW1Index((i) => i + 1);
        } else {
          setActiveWave(2);
          showToast("WAVE 2: REAL-WORLD GRAB!", "#2563eb");
          soundSynth.playFanfare();
        }
      } else if (activeWave === 2) {
        if (w2Index + 1 < stage.wave2Items.length) {
          setW2Index((i) => i + 1);
        } else {
          setActiveWave(3);
          showToast("🔥 WAVE 3: BOSS FIGHT 2X FEVER!", "#ec4899");
          soundSynth.playFanfare();
        }
      } else if (activeWave === 3) {
        if (w3TurnStep < 4) {
          setW3TurnStep((s) => ((s + 1) as 1 | 2 | 3 | 4));
        } else {
          handleMatchTimeExpired();
        }
      }
    }, 1400);
  };

  // --------------------------------------------------------------------------
  // MATCH TIME EXPIRED & VAULT TRIGGER
  // --------------------------------------------------------------------------

  const handleMatchTimeExpired = () => {
    setIsMatchActive(false);
    stopEnglishSpeech();
    soundSynth.playFanfare();
    setIsVaultModalOpen(true);
  };

  // --------------------------------------------------------------------------
  // WAVE 1: CLICK OPTION HANDLER
  // --------------------------------------------------------------------------

  const handleWave1Select = (optionIndex: number, usedMic: boolean = false) => {
    const option = currentW1.options[optionIndex];
    if (!option) return;

    const responseTimeMs = Date.now() - questionStartTimeRef.current;
    const responseTimeSeconds = responseTimeMs / 1000;

    if (option.isCorrect) {
      // Correct!
      const nextStreak = currentStreak + 1;
      setCurrentStreak(nextStreak);

      // Check Unstoppable Mode trigger (8x streak)
      let bonusTimeEarned = 0;
      if (nextStreak === 8) {
        setIsUnstoppableActive(true);
        setUnstoppableCount((c) => c + 1);
        bonusTimeEarned = 5;
        setMatchTimeLeft((t) => t + 5);
        showToast("🔥 UNSTOPPABLE MODE: +5 SECONDS!", "#f59e0b");
        soundSynth.playFanfare();
      }

      // Calculate score with Anti-Farming weights
      const calc = calculateQuestionScore({
        wave: 1,
        targetWord: currentW1.targetWord,
        responseTimeSeconds,
        currentStreak: nextStreak,
        usedMic,
        voiceMatched: usedMic,
      });

      setScore((s) => s + calc.finalQuestionPoints);
      setActiveNpcMood(calc.isCharismaTip ? "proud" : "happy");
      soundSynth.playCorrect();

      if (calc.isCharismaTip) {
        showToast(`⚡ CHARISMA TIP! +${calc.finalQuestionPoints}`, "#38bdf8");
      } else {
        showToast(`+${calc.finalQuestionPoints}`, "#10b981");
      }

      // Record Word Mastery
      recordWordResult(currentW1.targetWord, true);

      // Turn log
      const turnLog: MatchTurnLog = {
        turnIndex: turnLogs.length + 1,
        wave: 1,
        questionId: currentW1.id,
        targetWord: currentW1.targetWord,
        shownAt: questionStartTimeRef.current,
        answeredAt: Date.now(),
        responseTimeMs,
        isCorrect: true,
        selectedText: option.text,
        usedMic,
        noveltyWeight: calc.noveltyWeight,
        comboMultiplier: calc.comboMultiplier,
        speedBonus: calc.speedBonus,
        earnedPoints: calc.finalQuestionPoints,
      };
      setTurnLogs((logs) => [...logs, turnLog]);

      setTimeout(() => {
        if (w1Index + 1 < stage.wave1Items.length) {
          setW1Index((i) => i + 1);
        } else {
          setActiveWave(2);
          showToast("WAVE 2: REAL-WORLD GRAB!", "#2563eb");
          soundSynth.playFanfare();
        }
      }, 1000);
    } else {
      // Wrong answer! Trigger Scripted Comedy Feedback Reaction!
      setCurrentStreak(0);
      setIsUnstoppableActive(false);
      setActiveNpcMood(option.npcReactionMood);
      setActiveComedyReaction(option.npcReaction);
      soundSynth.playWrong();

      // Record Missed Word for Spaced Repetition Bounty
      recordWordResult(currentW1.targetWord, false);

      const turnLog: MatchTurnLog = {
        turnIndex: turnLogs.length + 1,
        wave: 1,
        questionId: currentW1.id,
        targetWord: currentW1.targetWord,
        shownAt: questionStartTimeRef.current,
        answeredAt: Date.now(),
        responseTimeMs,
        isCorrect: false,
        selectedText: option.text,
        usedMic,
        noveltyWeight: 1.0,
        comboMultiplier: 1.0,
        speedBonus: 1.0,
        earnedPoints: 0,
      };
      setTurnLogs((logs) => [...logs, turnLog]);

      // Advance to next unvisited question after showing comedy feedback
      setTimeout(() => {
        setActiveComedyReaction(null);
        if (w1Index + 1 < stage.wave1Items.length) {
          setW1Index((i) => i + 1);
        } else {
          setActiveWave(2);
          showToast("WAVE 2: REAL-WORLD GRAB!", "#2563eb");
          soundSynth.playFanfare();
        }
      }, 1800);
    }
  };

  // --------------------------------------------------------------------------
  // WAVE 2: REAL-WORLD GRAB (TAP/DRAG ITEM)
  // --------------------------------------------------------------------------

  const handleWave2ItemTap = (itemId: string) => {
    if (grabbedItemIds.includes(itemId)) return;

    const responseTimeMs = Date.now() - questionStartTimeRef.current;
    const responseTimeSeconds = responseTimeMs / 1000;

    if (currentW2.targetItemIds.includes(itemId)) {
      // Correct item grabbed!
      const updatedGrabbed = [...grabbedItemIds, itemId];
      setGrabbedItemIds(updatedGrabbed);
      soundSynth.playCorrect();

      // Check if all requested items grabbed
      const allGrabbed = currentW2.targetItemIds.every((id) => updatedGrabbed.includes(id));

      if (allGrabbed) {
        const nextStreak = currentStreak + 1;
        setCurrentStreak(nextStreak);

        const calc = calculateQuestionScore({
          wave: 2,
          targetWord: currentW2.targetWord,
          responseTimeSeconds,
          currentStreak: nextStreak,
          usedMic: false,
          voiceMatched: false,
        });

        setScore((s) => s + calc.finalQuestionPoints);
        showToast(`GRAB MATCH! +${calc.finalQuestionPoints}`, "#10b981");

        // Turn log
        const turnLog: MatchTurnLog = {
          turnIndex: turnLogs.length + 1,
          wave: 2,
          questionId: currentW2.id,
          targetWord: currentW2.targetWord,
          shownAt: questionStartTimeRef.current,
          answeredAt: Date.now(),
          responseTimeMs,
          isCorrect: true,
          selectedText: itemId,
          usedMic: false,
          noveltyWeight: calc.noveltyWeight,
          comboMultiplier: calc.comboMultiplier,
          speedBonus: calc.speedBonus,
          earnedPoints: calc.finalQuestionPoints,
        };
        setTurnLogs((logs) => [...logs, turnLog]);

        setTimeout(() => {
          setGrabbedItemIds([]);
          if (w2Index + 1 < stage.wave2Items.length) {
            setW2Index((i) => i + 1);
          } else {
            setActiveWave(3);
            showToast("🔥 WAVE 3: BOSS FIGHT 2X FEVER!", "#ec4899");
            soundSynth.playFanfare();
          }
        }, 1100);
      }
    } else {
      // Wrong item grabbed!
      soundSynth.playWrong();
      setActiveNpcMood("shocked_laugh");
      setActiveComedyReaction(currentW2.npcWrongReaction);
      setCurrentStreak(0);
      setIsUnstoppableActive(false);
    }
  };

  // --------------------------------------------------------------------------
  // WAVE 3: BOSS FIGHT CONTINUOUS CHAIN TURN
  // --------------------------------------------------------------------------

  const handleWave3Select = (optionIndex: number, usedMic: boolean = false) => {
    const option = currentW3Turn.options[optionIndex];
    if (!option) return;

    const responseTimeMs = Date.now() - questionStartTimeRef.current;
    const responseTimeSeconds = responseTimeMs / 1000;

    if (option.isCorrect) {
      const nextStreak = currentStreak + 1;
      setCurrentStreak(nextStreak);

      const calc = calculateQuestionScore({
        wave: 3,
        targetWord: currentW3Turn.targetWord,
        responseTimeSeconds,
        currentStreak: nextStreak,
        usedMic,
        voiceMatched: usedMic,
      });

      setScore((s) => s + calc.finalQuestionPoints);
      soundSynth.playCorrect();
      showToast(`CHAIN STEP ${w3TurnStep}/4! +${calc.finalQuestionPoints}`, "#ec4899");

      // Turn log
      const turnLog: MatchTurnLog = {
        turnIndex: turnLogs.length + 1,
        wave: 3,
        questionId: `${stage.wave3Boss.id}_step${w3TurnStep}`,
        targetWord: currentW3Turn.targetWord,
        shownAt: questionStartTimeRef.current,
        answeredAt: Date.now(),
        responseTimeMs,
        isCorrect: true,
        selectedText: option.text,
        usedMic,
        noveltyWeight: calc.noveltyWeight,
        comboMultiplier: calc.comboMultiplier,
        speedBonus: calc.speedBonus,
        earnedPoints: calc.finalQuestionPoints,
      };
      setTurnLogs((logs) => [...logs, turnLog]);

      if (w3TurnStep < 4) {
        setTimeout(() => {
          setW3TurnStep((s) => ((s + 1) as 1 | 2 | 3 | 4));
        }, 1100);
      } else {
        // Boss Defeated! No looping - advance straight to Vault / Celebration!
        setScore((s) => s + stage.wave3Boss.completionBonus);
        showToast(`BOSS DEFEATED! +${stage.wave3Boss.completionBonus} BONUS`, "#f59e0b");
        soundSynth.playFanfare();
        setTimeout(() => {
          handleMatchTimeExpired();
        }, 1400);
      }
    } else {
      // Chain broken!
      setCurrentStreak(0);
      setIsUnstoppableActive(false);
      setActiveNpcMood(option.npcReactionMood);
      setActiveComedyReaction(option.npcReaction);
      soundSynth.playWrong();

      setTimeout(() => {
        setActiveComedyReaction(null);
        if (w3TurnStep < 4) {
          setW3TurnStep((s) => ((s + 1) as 1 | 2 | 3 | 4));
        } else {
          handleMatchTimeExpired();
        }
      }, 1800);
    }
  };

  // --------------------------------------------------------------------------
  // SPEAK-TO-WIN MIC BOOSTER (WEB SPEECH API)
  // --------------------------------------------------------------------------

  const toggleMicrophone = () => {
    if (isListeningMic) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsListeningMic(false);
      return;
    }

    // Check browser SpeechRecognition support
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("مرورگر شما از SpeechRecognition پشتیبانی نمی‌کند. از گزینه‌های متنی استفاده کنید.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListeningMic(true);
        setMicStatusText("در حال شنیدن... جمله را بخوانید 🎙️");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        setIsListeningMic(false);
        setMicStatusText(`شنیده شد: "${transcript}"`);

        // Check if transcript contains target word or sentence
        const targetWord =
          activeWave === 1
            ? currentW1.targetWord.toLowerCase()
            : activeWave === 3
            ? currentW3Turn.targetWord.toLowerCase()
            : "";

        if (targetWord && transcript.includes(targetWord)) {
          showToast("🔥 3X VOICE CHARISMA BONUS!", "#10b981");
          soundSynth.playFanfare();
          if (activeWave === 1) {
            const correctIdx = currentW1.options.findIndex((o) => o.isCorrect);
            handleWave1Select(correctIdx, true);
          } else if (activeWave === 3) {
            const correctIdx = currentW3Turn.options.findIndex((o) => o.isCorrect);
            handleWave3Select(correctIdx, true);
          }
        } else {
          showToast("تلفظ تطبیق نیافت، دوباره تلاش کنید", "#ef4444");
        }
      };

      recognition.onerror = () => {
        setIsListeningMic(false);
        setMicStatusText("خطا در تشخیص صدا");
      };

      recognition.onend = () => {
        setIsListeningMic(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListeningMic(false);
    }
  };

  // --------------------------------------------------------------------------
  // DOUBLE-OR-NOTHING VAULT HANDLERS
  // --------------------------------------------------------------------------

  const handleBankPoints = () => {
    setIsVaultModalOpen(false);
    finalizeMatch(score, false);
  };

  const handleTriggerVaultQuestion = () => {
    setIsVaultModalOpen(false);
    setIsVaultQuestionActive(true);
  };

  const handleVaultAnswer = (choiceIndex: number) => {
    setVaultSelectedChoice(choiceIndex);
    const option = stage.vaultQuestion.options[choiceIndex];

    const outcome = resolveDoubleOrNothingVault(score, true, option.isCorrect);

    if (option.isCorrect) {
      soundSynth.playFanfare();
      showToast(`VAULT WON! 1.5X SCORE: ${outcome.finalScore}`, "#f59e0b");
    } else {
      soundSynth.playWrong();
      showToast(`VAULT BURNED 30%: ${outcome.finalScore}`, "#ef4444");
    }

    setTimeout(() => {
      setIsVaultQuestionActive(false);
      finalizeMatch(outcome.finalScore, true, option.isCorrect);
    }, 2000);
  };

  // --------------------------------------------------------------------------
  // MATCH FINALIZATION & ANTI-CHEAT SUBMISSION
  // --------------------------------------------------------------------------

  const finalizeMatch = async (
    finalScore: number,
    vaultAttempted: boolean = false,
    vaultSuccess?: boolean
  ) => {
    const totalDurationMs = Date.now() - matchStartTimeRef.current;
    const correctCount = turnLogs.filter((t) => t.isCorrect).length;
    const totalCount = Math.max(1, turnLogs.length);
    const accuracyPct = Math.round((correctCount / totalCount) * 100);

    const payload: MatchPayload = {
      stageNumber: stage.stageNumber,
      locationId: stage.locationId,
      startedAt: matchStartTimeRef.current,
      finishedAt: Date.now(),
      totalDurationMs,
      allowedTimeSeconds: 120 + unstoppableCount * 10,
      turns: turnLogs,
      finalScore,
      accuracyPct,
      correctTurns: correctCount,
      totalTurns: totalCount,
      unstoppableCount,
      vaultAttempted,
      vaultSuccess,
    };

    // Client validation
    const clientValidation = validateMatchSubmission(payload);

    // Save record to universal EnDoora storage
    saveStageBestPoints("vocabulary", "A1", stage.stageNumber, finalScore);
    const dailyHighScore = getLevelDailyHighScore("vocabulary", "A1");
    const isDaily = finalScore > dailyHighScore;

    const outcome = recordVocabRushCompletion(
      "vocabulary",
      "A1",
      stage.stageNumber,
      finalScore,
      accuracyPct,
      correctCount,
      totalCount,
      stage.xpReward
    );

    // Asynchronously send to server anti-cheat endpoint
    try {
      fetch("/api/skills/streetvibe/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
    } catch {}

    setCelebrationData({
      stars: clientValidation.starsEarned,
      finalScore,
      xpEarned: outcome.xpEarned,
      wordsLearned: correctCount,
      accuracy: accuracyPct,
      isDailyRecord: isDaily,
    });

    setIsCelebrationOpen(true);
  };

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------

  // Check if current target word is in missed bounty queue
  const isBountyTarget =
    activeWave === 1
      ? getMissedWordsQueue().includes(currentW1?.targetWord.toLowerCase())
      : false;

  return (
    <div
      className={styles.arenaOverlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`${styles.arcadeContainer} ${
          isUnstoppableActive ? styles.unstoppableMode : ""
        } ${activeWave === 3 ? styles.feverMode : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Score Toast */}
        {floatingToast && (
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: floatingToast.color,
              fontSize: "1.75rem",
              fontWeight: 900,
              textShadow: "0 0 20px rgba(0,0,0,0.8)",
              zIndex: 100,
              pointerEvents: "none",
              animation: "bounceBounty 0.5s ease",
            }}
          >
            {floatingToast.text}
          </div>
        )}

        {/* TOP HUD BAR */}
        <div className={styles.topHud}>
          <div className={styles.hudLeft}>
            <button className={styles.exitBtn} onClick={onClose} type="button">
              ✕ خروج
            </button>
            <div className={styles.locationBadge} style={{ borderColor: locationInfo.themeColor }}>
              <span>{locationInfo.icon}</span>
              <span>{locationInfo.titleEn}</span>
              <span style={{ opacity: 0.6 }}>|</span>
              <span>استیج {stage.stageNumber}</span>
            </div>
          </div>

          {/* Match Timer (MM:SS) */}
          <div className={`${styles.timerCluster} ${matchTimeLeft <= 15 ? styles.timerUrgent : ""}`}>
            <span>⏱️</span>
            <span className={`${styles.timerText} ${matchTimeLeft <= 15 ? styles.timerTextUrgent : ""}`}>
              {Math.floor(matchTimeLeft / 60).toString().padStart(2, "0")}:{(matchTimeLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>

        {/* Wave Indicator */}
        <div className={styles.waveIndicator}>
          <span className={`${styles.wavePill} ${activeWave === 1 ? styles.wavePillActive : ""}`}>
            W1: PingPong
          </span>
          <span className={`${styles.wavePill} ${activeWave === 2 ? styles.wavePillActive : ""}`}>
            W2: Grab
          </span>
          <span className={`${styles.wavePill} ${activeWave === 3 ? styles.wavePillActive : ""}`}>
            W3: Boss 2X
          </span>
        </div>

        {/* Combo Multiplier Bar */}
        <div className={styles.comboContainer}>
          <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700 }}>COMBO:</span>
          <span
            className={`${styles.comboPill} ${
              currentStreak >= 8
                ? styles.combo8x
                : currentStreak >= 6
                ? styles.combo4x
                : currentStreak >= 3
                ? styles.combo2x
                : ""
            }`}
          >
            {currentStreak >= 8 ? "8x UNSTOPPABLE" : currentStreak >= 6 ? "4x" : currentStreak >= 3 ? "2x" : "1x"}
          </span>
        </div>

        {/* Score Display */}
        <div className={styles.scoreDisplay}>
          <span>🪙</span>
          <span>{score.toLocaleString()}</span>
        </div>

        {/* Live Ghost Rival Mini-HUD */}
        {ghostRival && (
          <div
            className={styles.ghostRivalWidget}
            title="رقیب بالای سر شما در جدول هفتگی استریت‌وایب"
            onClick={onOpenLeaderboard}
            style={{ cursor: "pointer" }}
          >
            <div className={styles.ghostAvatar}>{ghostRival.avatar}</div>
            <div className={styles.ghostDetails}>
              <span className={styles.ghostName}>{ghostRival.name}</span>
              <span className={styles.ghostPoints}>
                {ghostRival.distanceToOvertake > 0
                  ? `سبقت: ${ghostRival.distanceToOvertake} pts`
                  : "🏆 صدرنشین شدی!"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* PLAY ARENA BODY */}
      <div className={styles.arenaBody}>
        {/* Comeback Bounty Badge */}
        {isBountyTarget && (
          <div className={styles.bountyBadge}>
            <span>🔥</span>
            <span>بونوس انتقام ۲.۵ برابری (Comeback Bounty)</span>
          </div>
        )}

        {/* NPC Character Box */}
        <div className={styles.npcBox}>
          {/* NPC Patience Meter */}
          <div className={styles.npcPatienceMeter} title="فرصت پاسخ سریع برای کسب تیپ کاریزما">
            <div
              className={`${styles.npcPatienceFill} ${
                patiencePercent > 50
                  ? styles.patienceHigh
                  : patiencePercent > 20
                  ? styles.patienceMed
                  : styles.patienceLow
              }`}
              style={{ width: `${patiencePercent}%` }}
            />
          </div>

          {/* NPC Avatar & Mood */}
          <div className={styles.npcAvatarBox}>
            {activeWave === 1
              ? currentW1.npcAvatar
              : activeWave === 2
              ? currentW2.npcAvatar
              : stage.wave3Boss.bossAvatar}
            <div className={styles.npcMoodBadge}>
              {activeNpcMood === "happy"
                ? "😊"
                : activeNpcMood === "shocked_laugh"
                ? "😂"
                : activeNpcMood === "confused_smirk"
                ? "😏"
                : activeNpcMood === "facepalm"
                ? "🤦"
                : activeNpcMood === "proud"
                ? "🤩"
                : "😐"}
            </div>
          </div>

          <span className={styles.npcNameLabel}>
            {activeWave === 1
              ? currentW1.npcName
              : activeWave === 2
              ? currentW2.npcName
              : `${stage.wave3Boss.bossName} (${stage.wave3Boss.bossRoleFa})`}
          </span>

          {/* NPC Speech Line Bubble */}
          <div className={styles.speechBubble}>
            <p style={{ margin: 0 }}>
              {activeWave === 1
                ? `"${currentW1.npcLine}"`
                : activeWave === 2
                ? `"${currentW2.npcRequestLine}"`
                : `"${currentW3Turn.npcLine}"`}
            </p>
            <button
              className={`${styles.ttsListenBtn} ${isPlayingAudio ? styles.ttsPlaying : ""}`}
              onClick={() =>
                speakCurrentNpcLine(
                  activeWave === 1
                    ? currentW1.npcLine
                    : activeWave === 2
                    ? currentW2.npcRequestLine
                    : currentW3Turn.npcLine
                )
              }
              type="button"
            >
              {isPlayingAudio ? "⏹️ توقف صدا" : "🔊 شنیدن تلفظ (پخش صدا)"}
            </button>
          </div>

          {/* Scripted Comedy Feedback Reaction Bubble */}
          {activeComedyReaction && (
            <div className={styles.comedyReactionBubble}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", width: "100%" }}>
                <span>🎭 {activeComedyReaction}</span>
                <button
                  className={styles.miniAudioBtn}
                  onClick={() => speakCurrentNpcLine(activeComedyReaction)}
                  type="button"
                  title="شنیدن واکنش طنز"
                >
                  🔊
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------------
            WAVE 1: QUICK-REPLY PING-PONG INTERACTION
            ------------------------------------------------------------------ */}
        {activeWave === 1 && (
          <div className={styles.playerReplySection}>
            <div className={styles.playerTemplateBubble}>
              {currentW1.playerTemplate.split("___").map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && <span className={styles.blankSlot}>[ ... ]</span>}
                </React.Fragment>
              ))}
            </div>

            {/* Options Grid */}
            <div className={styles.optionsGrid}>
              {currentW1.options.map((opt, idx) => (
                <button
                  key={idx}
                  className={styles.optionBtn}
                  onClick={() => handleWave1Select(idx)}
                  type="button"
                >
                  <span>{opt.text}</span>
                  <span className={styles.optionHotkey}>کلید {idx + 1}</span>
                </button>
              ))}
            </div>

            {/* Microphone Booster */}
            <div className={styles.micSection}>
              <button
                className={`${styles.micBtn} ${isListeningMic ? styles.micListening : ""}`}
                onClick={toggleMicrophone}
                type="button"
              >
                <span>🎙️</span>
                <span>{isListeningMic ? "در حال شنیدن گفتار شما..." : "خواندن کل جمله (بونوس ۳ برابری)"}</span>
              </button>
              {micStatusText && (
                <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{micStatusText}</span>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
            WAVE 2: REAL-WORLD GRAB (ZERO TRANSLATION)
            ------------------------------------------------------------------ */}
        {activeWave === 2 && (
          <div className={styles.trayContainer}>
            <span className={styles.trayTitle}>
              👇 وسایل درخواستی را سریعاً لمس کن و به شخصیت تحویل بده (بدون ترجمه!):
            </span>
            <div className={styles.trayGrid}>
              {currentW2.trayItems.map((item) => {
                const isSelected = grabbedItemIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`${styles.trayItemCard} ${
                      isSelected ? styles.trayItemCardSelected : ""
                    }`}
                    onClick={() => handleWave2ItemTap(item.id)}
                  >
                    <span className={styles.trayItemIcon}>{item.icon}</span>
                    <span className={styles.trayItemLabel}>{item.nameEn}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
            WAVE 3: BOSS FIGHT CONTINUOUS 4-TURN CHAIN
            ------------------------------------------------------------------ */}
        {activeWave === 3 && (
          <div className={styles.playerReplySection}>
            {/* Step Pills */}
            <div className={styles.bossChainSteps}>
              <span
                className={`${styles.chainStepPill} ${
                  w3TurnStep === 1 ? styles.chainStepActive : w3TurnStep > 1 ? styles.chainStepDone : ""
                }`}
              >
                ۱. سلام سریع
              </span>
              <span
                className={`${styles.chainStepPill} ${
                  w3TurnStep === 2 ? styles.chainStepActive : w3TurnStep > 2 ? styles.chainStepDone : ""
                }`}
              >
                ۲. پرسش کلیدی
              </span>
              <span
                className={`${styles.chainStepPill} ${
                  w3TurnStep === 3 ? styles.chainStepActive : w3TurnStep > 3 ? styles.chainStepDone : ""
                }`}
              >
                ۳. حل مشکل
              </span>
              <span
                className={`${styles.chainStepPill} ${
                  w3TurnStep === 4 ? styles.chainStepActive : ""
                }`}
              >
                ۴. خداحافظی و برد
              </span>
            </div>

            <div className={styles.playerTemplateBubble}>
              {currentW3Turn.playerTemplate.split("___").map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && <span className={styles.blankSlot}>[ ... ]</span>}
                </React.Fragment>
              ))}
            </div>

            {/* Boss Options */}
            <div className={styles.optionsGrid}>
              {currentW3Turn.options.map((opt, idx) => (
                <button
                  key={idx}
                  className={styles.optionBtn}
                  onClick={() => handleWave3Select(idx)}
                  type="button"
                >
                  <span>{opt.text}</span>
                  <span className={styles.optionHotkey}>کلید {idx + 1}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------------
          DOUBLE-OR-NOTHING VAULT MODAL (AT 00:00)
          ---------------------------------------------------------------------- */}
      {isVaultModalOpen && (
        <div className={styles.vaultOverlay}>
          <div className={styles.vaultModal}>
            <div className={styles.vaultIcon}>🏦</div>
            <h2 className={styles.vaultTitle}>صندوق ریسک یا ثبت امتیاز (Double-or-Nothing)?</h2>
            <p className={styles.vaultDesc}>
              زمان ۹۰ ثانیه بازی به پایان رسید! امتیاز خام شما در این راند:
            </p>
            <div className={styles.vaultScoreHighlight}>{score.toLocaleString()} امتیاز</div>
            <p style={{ fontSize: "0.88rem", color: "#64748b" }}>
              می‌توانید امتیازتان را همین الان ثبت کنید، یا با پاسخ به یک تک‌سوال غول مرحله، امتیازتان را
              ۱.۵ برابر (۵۰٪ بیشتر) کنید! (هشدار: در صورت پاسخ اشتباه، ۳۰٪ از امتیاز شما می‌سوزد).
            </p>
            <div className={styles.vaultActions}>
              <button className={styles.vaultBankBtn} onClick={handleBankPoints} type="button">
                💰 ثبت مستقیم {score.toLocaleString()} امتیاز
              </button>
              <button
                className={styles.vaultGambleBtn}
                onClick={handleTriggerVaultQuestion}
                type="button"
              >
                ⚡ ورود به چالش صندوق (۱.۵ برابر)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          SUDDEN-DEATH VAULT QUESTION MODAL
          ---------------------------------------------------------------------- */}
      {isVaultQuestionActive && (
        <div className={styles.vaultOverlay}>
          <div className={styles.vaultModal} style={{ maxWidth: 700 }}>
            <span style={{ fontSize: "2.5rem" }}>⚡</span>
            <h3 style={{ color: "#d97706", margin: 0, fontWeight: 900 }}>
              چالش تک‌سوال مرگ ناگهانی صندوق!
            </h3>
            <p style={{ color: "#1e293b", fontSize: "1.1rem", fontWeight: 700 }}>
              {stage.vaultQuestion.npcAvatar} {stage.vaultQuestion.npcName}: &quot;
              {stage.vaultQuestion.npcLine}&quot;
            </p>
            <button
              className={`${styles.ttsListenBtn} ${isPlayingAudio ? styles.ttsPlaying : ""}`}
              onClick={() => speakCurrentNpcLine(stage.vaultQuestion.npcLine)}
              type="button"
              style={{ margin: "0.25rem auto 1rem", display: "inline-flex" }}
            >
              {isPlayingAudio ? "⏹️ توقف صدا" : "🔊 شنیدن سوال غول مرحله"}
            </button>
            <div className={styles.playerTemplateBubble}>
              {stage.vaultQuestion.playerTemplate}
            </div>
            <div className={styles.optionsGrid}>
              {stage.vaultQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  className={styles.optionBtn}
                  onClick={() => handleVaultAnswer(idx)}
                  disabled={vaultSelectedChoice !== null}
                  type="button"
                >
                  <span>{opt.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          POST-MATCH CELEBRATION SUMMARY MODAL
          ---------------------------------------------------------------------- */}
      {isCelebrationOpen && celebrationData && (
        <div className={styles.vaultOverlay}>
          <div className={styles.celebrationModal}>
            <div className={styles.starsRow}>
              {[1, 2, 3].map((starNum) => (
                <span
                  key={starNum}
                  className={starNum <= celebrationData.stars ? styles.starEarned : styles.starEmpty}
                >
                  ★
                </span>
              ))}
            </div>

            <h2 className={styles.celebrationTitle}>
              {celebrationData.stars >= 2 ? "تبریک! رکورد عالی ثبت شد 🏆" : "آفرین! استیج به پایان رسید ✨"}
            </h2>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statValue}>{celebrationData.finalScore.toLocaleString()}</span>
                <span className={styles.statLabel}>امتیاز نهایی مسابقه</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>+{celebrationData.xpEarned} XP</span>
                <span className={styles.statLabel}>تجربه دریافتی</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>{celebrationData.accuracy}٪</span>
                <span className={styles.statLabel}>دقت گفت‌وگو</span>
              </div>
            </div>

            {celebrationData.isDailyRecord && (
              <div style={{ color: "#d97706", fontWeight: 800, fontSize: "0.95rem" }}>
                🔥 رکورد روزانه استریت‌وایب را شکستید!
              </div>
            )}

            <div style={{ display: "flex", gap: "1rem", width: "100%", marginTop: "0.5rem" }}>
              <button
                style={{
                  flex: 1,
                  background: "#f1f5f9",
                  border: "1.5px solid #cbd5e1",
                  color: "#1e293b",
                  padding: "0.85rem",
                  borderRadius: "0.75rem",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
                onClick={onClose}
                type="button"
              >
                بازگشت به نقشه شهر
              </button>

              {onNextLevel && level.levelNumber < 10 && (
                <button
                  style={{
                    flex: 1,
                    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                    border: "none",
                    color: "#ffffff",
                    padding: "0.85rem",
                    borderRadius: "0.75rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)",
                  }}
                  onClick={() => {
                    setIsCelebrationOpen(false);
                    onNextLevel();
                  }}
                  type="button"
                >
                  استیج بعدی ➔
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

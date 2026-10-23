"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import styles from "./sherlock-speaking.module.css";
import { GameLevel } from "../../../data/skills/games/types";
import {
  getSherlockStage,
  DetectiveStage,
  DetectiveSpeakingTask,
  DetectiveDecisionChoice,
  calculateA1DecisionScore,
  A1_WIN_THRESHOLD,
} from "../../../data/skills/games/sherlock-detective-curriculum";
import { recordSpeakingMissionCompletion } from "../../../lib/skills/game-storage";
import { soundSynth } from "../../../lib/skills/game-audio";
import { playEnglishSpeech, stopEnglishSpeech } from "../../../lib/speech";

interface Props {
  level: GameLevel;
  onClose: () => void;
  onNextLevel?: () => void;
  onOpenLeaderboard?: () => void;
}

export function SherlockSpeakingArena({
  level,
  onClose,
  onNextLevel,
  onOpenLeaderboard,
}: Props) {
  // Load official Sherlock Detective Stage (1 to 10) for active CEFR level (A1 or A2)
  const stage: DetectiveStage = getSherlockStage(level.levelNumber, level.cefr);

  const storageKey = `endoora_sherlock_${(level.cefr || "a1").toLowerCase()}_decisions`;

  // Flow State
  const [isCutsceneOpen, setIsCutsceneOpen] = useState<boolean>(true);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
  const [selectedDecision, setSelectedDecision] = useState<DetectiveDecisionChoice | null>(null);
  const [storyDecisions, setStoryDecisions] = useState<Record<number, string>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const saved = sessionStorage.getItem(storageKey) || localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Dynamically resolve active stage variant based on branch decisions
  const activeStage: DetectiveStage = useMemo(() => {
    if (!stage.branchVariants || stage.branchVariants.length === 0) return stage;
    const decisionIds = Object.values(storyDecisions);
    const matchedVariant = stage.branchVariants.find((v) =>
      decisionIds.includes(v.conditionChoiceId)
    );
    if (!matchedVariant) return stage;

    return {
      ...stage,
      titleFa: matchedVariant.titleFa || stage.titleFa,
      titleEn: matchedVariant.titleEn || stage.titleEn,
      locationFa: matchedVariant.locationFa || stage.locationFa,
      locationEn: matchedVariant.locationEn || stage.locationEn,
      storyIntroFa: matchedVariant.storyIntroFa || stage.storyIntroFa,
      cutscene: matchedVariant.cutscene || stage.cutscene,
      decisionPoint: matchedVariant.decisionPoint || stage.decisionPoint,
      tasks: matchedVariant.tasks || stage.tasks,
    };
  }, [stage, storyDecisions]);

  const [hearts, setHearts] = useState<number>(3);
  const [score, setScore] = useState<number>(1000);
  const [accuracyHistory, setAccuracyHistory] = useState<number[]>([]);

  // Active Task Speaking State
  const currentTask: DetectiveSpeakingTask = activeStage.tasks[currentTaskIndex] || activeStage.tasks[0];
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [taskHasMistake, setTaskHasMistake] = useState<boolean>(false);
  const [isTaskSuccess, setIsTaskSuccess] = useState<boolean>(false);
  const [lastUserSuccessfulSpeech, setLastUserSuccessfulSpeech] = useState<string>("");
  const [showPromptTranslation, setShowPromptTranslation] = useState<boolean>(false);

  // Climax & Stage Victory State
  const [isStageComplete, setIsStageComplete] = useState<boolean>(false);
  const [isFinalClimaxRevealed, setIsFinalClimaxRevealed] = useState<boolean>(false);
  const [activeEndingType, setActiveEndingType] = useState<"ending1" | "ending2">("ending2");

  // Recognition refs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const accumulatedTranscriptRef = useRef<string>("");
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup audio & recognition on unmount
  useEffect(() => {
    return () => {
      stopEnglishSpeech();
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  // Reset task state when task changes
  useEffect(() => {
    setTranscript("");
    accumulatedTranscriptRef.current = "";
    setTaskHasMistake(false);
    setIsTaskSuccess(false);
    setLastUserSuccessfulSpeech("");
    setShowPromptTranslation(false);
  }, [currentTaskIndex]);

  // Handle Speech Recognition toggle
  const handleToggleListening = () => {
    if (isListening) {
      // User manually stopped speaking: trigger evaluation
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRec =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      setTaskHasMistake(true);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = true;
      accumulatedTranscriptRef.current = "";
      setTranscript("");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let interimText = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            accumulatedTranscriptRef.current += (accumulatedTranscriptRef.current ? " " : "") + event.results[i][0].transcript;
          } else {
            interimText += event.results[i][0].transcript;
          }
        }

        const currentLiveText = (accumulatedTranscriptRef.current + " " + interimText).trim();
        setTranscript(currentLiveText);

        // DO NOT evaluate mid-sentence! Reset a silence timeout of 2 seconds
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
        silenceTimeoutRef.current = setTimeout(() => {
          // Silence detected: stop recognition gracefully and evaluate!
          if (recognitionRef.current) {
            try {
              recognitionRef.current.stop();
            } catch {}
          }
        }, 2200);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = () => {
        if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
        setIsListening(false);
      };

      recognition.onend = () => {
        if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
        setIsListening(false);

        const finalText = (accumulatedTranscriptRef.current || transcript).trim();
        if (finalText) {
          evaluateSpokenText(finalText);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
      setTaskHasMistake(true);
    }
  };

  // Evaluate user's spoken answer using majority keyword & synonym checking
  const evaluateSpokenText = (spoken: string) => {
    const cleaned = spoken.toLowerCase().trim();
    const totalKeywords = currentTask.targetKeywords.length;

    let matchedKeywordsCount = 0;

    currentTask.targetKeywords.forEach((kw) => {
      const phraseHit = cleaned.includes(kw.phrase.toLowerCase());
      const synonymHit = kw.synonyms?.some((syn) => cleaned.includes(syn.toLowerCase()));
      if (phraseHit || synonymHit) {
        matchedKeywordsCount++;
      }
    });

    // Check similarity with ideal response or alternatives
    const isCloseToIdeal =
      cleaned.includes(currentTask.idealVoiceResponseEn.toLowerCase().slice(0, 16)) ||
      currentTask.alternativeResponsesEn.some((alt) =>
        cleaned.includes(alt.phraseEn.toLowerCase().slice(0, 16))
      );

    // Rule: Must match the majority of keywords (or close to ideal response)
    const requiredMajority = Math.ceil(totalKeywords * 0.5);
    const isMajority = matchedKeywordsCount >= requiredMajority && matchedKeywordsCount >= 1;

    // Calculate accuracy: strictly proportional, 100% ONLY if ALL keywords are used on FIRST attempt!
    let taskAccuracy = Math.round((matchedKeywordsCount / totalKeywords) * 100);

    // If user previously made a mistake on this task, apply strict penalty
    if (taskHasMistake) {
      taskAccuracy = Math.min(68, Math.round(taskAccuracy * 0.7));
    } else if (matchedKeywordsCount < totalKeywords) {
      // Not all keywords used: strictly reduce accuracy proportionally
      taskAccuracy = Math.min(84, Math.round((matchedKeywordsCount / totalKeywords) * 88));
    }

    if (taskAccuracy > 100) taskAccuracy = 100;
    if (taskAccuracy < 30) taskAccuracy = 30;

    if (isMajority || isCloseToIdeal) {
      setAccuracyHistory((prev) => [...prev, taskAccuracy]);
      triggerTaskSuccess(spoken);
    } else {
      triggerTaskMistake();
    }
  };

  // On Mistake: White provides friendly guidance in colloquial Persian, keywords and choices appear
  const triggerTaskMistake = () => {
    soundSynth.playWrong();
    setHearts((prev) => Math.max(1, prev - 1));
    setScore((prev) => Math.max(300, prev - 150));
    setTaskHasMistake(true);
  };

  // On Success: Show Three Sections (User Answer with Checkmark, Keywords, Alternatives) + Live NPC Turn
  const triggerTaskSuccess = (spokenText: string) => {
    soundSynth.playCorrect();
    setLastUserSuccessfulSpeech(spokenText || currentTask.idealVoiceResponseEn);
    setIsTaskSuccess(true);
    setScore((prev) => prev + 150);
  };

  // User chooses a fallback multiple-choice option (available only after mistake)
  const handleSelectFallback = (choice: string) => {
    if (choice === currentTask.fallbackChoices[0] || choice.length > 25) {
      setAccuracyHistory((prev) => [...prev, 50]); // Fallback capped at 50%
      triggerTaskSuccess(choice);
    } else {
      triggerTaskMistake();
    }
  };

  // Advance to next task or stage completion
  const handleAdvanceToNextTask = () => {
    if (currentTaskIndex + 1 < activeStage.tasks.length) {
      setCurrentTaskIndex((prev) => prev + 1);
    } else {
      handleCompleteStage();
    }
  };

  // Calculate final stage accuracy
  const calculateFinalAccuracy = () => {
    if (accuracyHistory.length === 0) return 50;
    const sum = accuracyHistory.reduce((a, b) => a + b, 0);
    return Math.round(sum / accuracyHistory.length);
  };

  // Handle stage completion
  const handleCompleteStage = () => {
    const finalAccuracy = calculateFinalAccuracy();

    if (activeStage.levelNumber === 10) {
      if (level.cefr === "A2") {
        // A2 Climax Evaluation: 16-Branch Consequence Matrix
        // Decisions: Stage 2 (1A/1B), Stage 5 (2A/2B), Stage 7 (3A/3B), Stage 9 (4A/4B)
        const d1 = storyDecisions[2]; // "choice-1a" (Code 77) or "choice-1b" (Antidote)
        const d2 = storyDecisions[5]; // "choice-2a" (Trust Watson) or "choice-2b" (Handcuff Watson)
        const d3 = storyDecisions[7]; // "choice-3a" (Treat Judge / Wire trick) or "choice-3b" (Rush to station)
        const d4 = storyDecisions[9]; // "choice-4a" (Cut Black wire) or "choice-4b" (Cut White wire)

        let isSuccess = false;
        if (d4 === "choice-4a") {
          // Cutting the black wire:
          // Branches 1 to 7 succeed (Ending 1: Case Solved)
          // Branch 9 (1B + 2B + 3B + 4A) fails without Code 77, without Judge, and without Watson's early bond
          if (d1 === "choice-1b" && d2 === "choice-2b" && d3 === "choice-3b") {
            isSuccess = false; // Branch 9 -> Ending 2
          } else {
            isSuccess = true; // Branches 1 to 7 -> Ending 1
          }
        } else {
          // d4 === "choice-4b" (Cutting the white wire):
          // Branch 8 (1A + 2A + 3A + 4B) succeeds because Code 77 + high trust locked the valve in advance!
          if (d1 === "choice-1a" && d2 === "choice-2a" && d3 === "choice-3a") {
            isSuccess = true; // Branch 8 -> Ending 1
          } else {
            isSuccess = false; // Branches 10 to 16 -> Ending 2
          }
        }

        setActiveEndingType(isSuccess ? "ending1" : "ending2");
        setIsFinalClimaxRevealed(true);
        soundSynth.playFanfare();
      } else {
        // Climax Evaluation for A1:
        // Cumulative decision score from stages 3, 5, 6, 7, 9 must strictly exceed 610 threshold
        const a1DecisionScore = calculateA1DecisionScore(storyDecisions);
        const wonRescue = a1DecisionScore > A1_WIN_THRESHOLD;
        setActiveEndingType(wonRescue ? "ending2" : "ending1");
        setIsFinalClimaxRevealed(true);
        soundSynth.playFanfare();
      }
    } else {
      setIsStageComplete(true);
      soundSynth.playFanfare();
    }

    // Record progress
    recordSpeakingMissionCompletion(
      level.cefr,
      level.levelNumber,
      score,
      finalAccuracy,
      hearts === 3 ? 95 : 82,
      120,
      150
    );
  };

  // Decision Choice Selection (NO SPOILERS)
  const handleSelectDecision = (choice: DetectiveDecisionChoice) => {
    setSelectedDecision(choice);
    setCurrentTaskIndex(0);
    setTaskHasMistake(false);
    setIsTaskSuccess(false);
    setTranscript("");
    accumulatedTranscriptRef.current = "";
    const updated = {
      ...storyDecisions,
      [activeStage.levelNumber]: choice.id,
    };
    setStoryDecisions(updated);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(updated));
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}
    }
    // In A1, the decision score is strictly secret during the story, so do NOT leak it into the visible episode score!
    if (activeStage.cefr !== "A1") {
      setScore((prev) => prev + choice.pointsDelta);
    }
  };

  // =========================================================================
  // VIEW 1: STANDALONE CLIMAX REVEAL (STAGE 10: ENDING 1 OR ENDING 2)
  // Background removed completely as requested by user!
  // =========================================================================
  if (isFinalClimaxRevealed && activeStage.possibleEndings) {
    const activeEnding = activeStage.possibleEndings[activeEndingType];
    const finalAccuracy = calculateFinalAccuracy();

    return (
      <div className={styles.arenaOverlay}>
        <div className={styles.arenaContainer}>
          <div className={styles.climaxEndingModal}>
            <span className={styles.caseBadge} style={{ fontSize: "0.95rem" }}>
              {activeEnding.badgeTitleFa}
            </span>

            <h2 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#b45309", margin: 0 }}>
              {activeEnding.titleFa}
            </h2>

            <div className={styles.endingHeroImgBox}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeEnding.imageSrc}
                alt={activeEnding.titleFa}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div className={styles.endingDialogueRevealBox}>
              <div style={{ fontWeight: 800, marginBottom: "0.75rem", fontSize: "1.05rem" }}>
                {activeEnding.climaxStoryFa}
              </div>
              <div style={{ whiteSpace: "pre-line", lineHeight: 1.75 }}>
                {activeEnding.revealDialogueFa}
              </div>
            </div>

            <div
              style={{
                background: "#f0fdf4",
                border: "1.5px solid #10b981",
                borderRadius: 14,
                padding: "1rem 1.5rem",
                maxWidth: 820,
                fontSize: "0.92rem",
                color: "#065f46",
                fontWeight: 700,
              }}
            >
              💡 {activeEnding.nextTierHintFa}
            </div>

            <div style={{ display: "flex", gap: "2.5rem", margin: "0.5rem 0", flexWrap: "wrap", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "0.82rem", color: "#64748b" }}>امتیاز نهایی پرونده:</span>
                <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#b45309" }}>{score}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "0.82rem", color: "#64748b" }}>دقت نهایی مکالمه:</span>
                <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#10b981" }}>
                  {finalAccuracy}%
                </div>
              </div>
              {level.cefr === "A1" && (
                <div style={{ textAlign: "center" }}>
                  <span style={{ fontSize: "0.82rem", color: "#64748b" }}>مجموع امتیاز تصمیمات (محرمانه):</span>
                  <div
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: 900,
                      color: calculateA1DecisionScore(storyDecisions) > A1_WIN_THRESHOLD ? "#10b981" : "#ef4444",
                    }}
                  >
                    {calculateA1DecisionScore(storyDecisions)}{" "}
                    <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 700 }}>
                      (حد نصاب: {A1_WIN_THRESHOLD})
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
              <button
                type="button"
                className={styles.advanceActionBtn}
                onClick={() => {
                  setIsFinalClimaxRevealed(false);
                  onClose();
                  if (onOpenLeaderboard) onOpenLeaderboard();
                }}
              >
                🏆 مشاهده کارنامه و رتبه در لیدربرد
              </button>

              <button
                type="button"
                className={styles.advanceActionBtn}
                style={{ background: "#475569" }}
                onClick={onClose}
              >
                بستن پرونده
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: STANDALONE STAGE VICTORY / DEBRIEF (STAGES 1 TO 9)
  // Background removed completely as requested by user!
  // =========================================================================
  if (isStageComplete) {
    const finalAccuracy = calculateFinalAccuracy();

    return (
      <div className={styles.arenaOverlay}>
        <div className={styles.debriefModalContainer}>
          <div className={styles.standaloneDebriefContainer}>
            <span className={styles.caseBadge} style={{ marginBottom: "0.25rem" }}>
              <span>🎖️</span>
              <span>پرونده جنایی لندن ({activeStage.cefr}) • پایان موفق اپیزود {activeStage.levelNumber}</span>
            </span>

            <span style={{ fontSize: "4rem", filter: "drop-shadow(0 6px 16px rgba(217, 119, 6, 0.35))" }}>
              🏅
            </span>

            <h2 style={{ fontSize: "1.85rem", fontWeight: 900, color: "#10b981", margin: 0 }}>
              احسنت کارآگاه! اپیزود {activeStage.levelNumber} با موفقیت حل شد!
            </h2>

            <p style={{ maxWidth: 580, color: "#475569", lineHeight: 1.7, margin: 0, fontSize: "1rem" }}>
              {activeStage.cefr === "A2"
                ? "مکالمه انگلیسی این بخش با موفقیت به پایان رسید و شواهد در پرونده اسکاتلندیارد ثبت شدند. دکتر جان واتسون در حال همراهی شما برای پیگیری سرنخ بعدی است."
                : "مکالمه انگلیسی این بخش با موفقیت به پایان رسید و شواهد در پرونده اسکاتلندیارد ثبت شدند. کارآگاه وایت در حال همراهی شما برای پیگیری سرنخ بعدی است."}
            </p>

            <div className={styles.standaloneScoreCard}>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "0.82rem", color: "#64748b", display: "block", marginBottom: "0.25rem" }}>🏆 امتیاز کارآگاهی:</span>
                <div style={{ fontSize: "2.1rem", fontWeight: 900, color: "#b45309" }}>{score}</div>
              </div>

              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "0.82rem", color: "#64748b", display: "block", marginBottom: "0.25rem" }}>🎯 دقت مکالمه:</span>
                <div style={{ fontSize: "2.1rem", fontWeight: 900, color: finalAccuracy >= 80 ? "#10b981" : "#d97706" }}>
                  {finalAccuracy}%
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "0.82rem", color: "#64748b", display: "block", marginBottom: "0.25rem" }}>📁 سرنخ‌ها:</span>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0369a1", marginTop: "0.45rem" }}>
                  ثبت رسمی ✓
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", justifyContent: "center", marginTop: "0.5rem" }}>
              {onNextLevel && activeStage.levelNumber < 10 && (
                <button
                  type="button"
                  className={styles.advanceActionBtn}
                  style={{ padding: "0.85rem 2rem", fontSize: "1.05rem" }}
                  onClick={() => {
                    setIsStageComplete(false);
                    onNextLevel();
                  }}
                >
                  <span>ورود به اپیزود {activeStage.levelNumber + 1}</span>
                  <span>➔</span>
                </button>
              )}

              <button
                type="button"
                className={styles.advanceActionBtn}
                style={{ background: "#475569", padding: "0.85rem 1.6rem", fontSize: "1rem" }}
                onClick={onClose}
              >
                بازگشت به نقشه پرونده‌ها
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: MAIN STAGE VIEW (CUTSCENE OR ACTIVE SPEAKING ARENA)
  // =========================================================================
  return (
    <div className={styles.arenaOverlay}>
      <div className={styles.arenaContainer}>
        {/* ================================================================= */}
        {/* HUD TOP BAR                                                       */}
        {/* ================================================================= */}
        <header className={styles.hudTopBar}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <span className={styles.caseBadge}>
              <span>{activeStage.cefr === "A2" ? "🩺" : "🕵️‍♂️"}</span>
              <span>پرونده جنایی لندن ({activeStage.cefr}) • مرحله {activeStage.levelNumber} از ۱۰</span>
            </span>
            <span style={{ fontSize: "0.95rem", fontWeight: 800 }}>
              {activeStage.titleFa}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Hearts indicator */}
            <div style={{ display: "flex", gap: "0.25rem", fontSize: "1.2rem" }}>
              {[1, 2, 3].map((h) => (
                <span
                  key={h}
                  style={{
                    filter: h <= hearts ? "none" : "grayscale(1) opacity(0.35)",
                    transition: "all 0.3s",
                  }}
                >
                  ❤️
                </span>
              ))}
            </div>

            {/* Replay Cutscene Button */}
            <button
              type="button"
              className={styles.bubbleAudioBtn}
              onClick={() => setIsCutsceneOpen(true)}
              title="مشاهده مجدد صحنه داستانی و دیالوگ‌ها"
            >
              🎬 صحنه داستان
            </button>

            {/* Close Button */}
            <button
              type="button"
              className={styles.topCloseBtn}
              onClick={onClose}
              aria-label="بستن"
            >
              ✕
            </button>
          </div>
        </header>

        {/* ================================================================= */}
        {/* CINEMATIC CUTSCENE VIEW (ابرهای دیالوگ + تصویر صحنه)               */}
        {/* ================================================================= */}
        {isCutsceneOpen ? (
          <div style={{ padding: "1.5rem" }}>
            {/* Cinematic Hero Image */}
            <div className={styles.cutsceneHeroBox}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeStage.cutscene.imageSrc}
                alt={activeStage.cutscene.titleFa}
                className={styles.cutsceneHeroImg}
              />
              <div className={styles.cutsceneImageOverlay}>
                <span className={styles.cutsceneTitleBadge}>
                  {activeStage.locationFa}
                </span>
                <h2 className={styles.cutsceneMainHeading}>
                  {activeStage.cutscene.titleFa}
                </h2>
                <p style={{ margin: 0, opacity: 0.95, fontSize: "0.9rem", color: "#f8fafc" }}>
                  {activeStage.storyIntroFa}
                </p>
              </div>
            </div>

            {/* Speech Bubbles Stream */}
            <div className={styles.dialogueStreamCluster}>
              {activeStage.cutscene.dialogues.map((dlg, idx) => (
                <div
                  key={idx}
                  className={`${styles.speechBubbleRow} ${
                    dlg.bubblePosition === "right" ? styles.right : styles.left
                  }`}
                >
                  <div className={styles.speakerAvatarBox} title={dlg.speakerNameFa}>
                    {dlg.speakerAvatar}
                  </div>

                  <div className={styles.comicBubbleCard}>
                    <div className={styles.bubbleSpeakerLabel}>
                      <div>
                        <span className={styles.speakerNameTitle}>{dlg.speakerNameFa}</span>
                        {dlg.speakerRoleFa &&
                          !dlg.speakerRoleFa.includes("اسکاتلندیارد") &&
                          !dlg.speakerRoleFa.includes("مشاور") &&
                          dlg.speakerRoleFa !== dlg.speakerNameFa && (
                            <span className={styles.speakerRoleSmall}> ({dlg.speakerRoleFa})</span>
                          )}
                      </div>
                      <button
                        type="button"
                        className={styles.bubbleAudioBtn}
                        onClick={() =>
                          playEnglishSpeech(dlg.textEn, {
                            accent: "en-GB",
                            rate: 0.95,
                          })
                        }
                      >
                        🔊 بشنو
                      </button>
                    </div>

                    <div className={styles.bubbleEnglishText} dir="ltr">
                      &ldquo;{dlg.textEn}&rdquo;
                    </div>

                    <div className={styles.bubblePersianTranslation}>
                      {dlg.textFa}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Decision Point (Stages 3, 6, 9, 10 - NO SPOILERS) */}
            {activeStage.decisionPoint && (
              <div className={styles.decisionBox}>
                <div className={styles.decisionPromptText}>
                  <span>⚖️</span>
                  <span>{activeStage.decisionPoint.promptFa}</span>
                </div>

                <div className={styles.decisionGrid}>
                  {activeStage.decisionPoint.choices.map((choice) => {
                    const isChosen =
                      selectedDecision?.id === choice.id ||
                      storyDecisions[activeStage.levelNumber] === choice.id;

                    return (
                      <div
                        key={choice.id}
                        className={`${styles.decisionCardOption} ${isChosen ? styles.selected : ""}`}
                        onClick={() => handleSelectDecision(choice)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className={styles.decisionOptionTitle}>
                          {choice.labelFa}
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#b45309", direction: "ltr", textAlign: "left", marginBottom: "0.25rem", fontWeight: 700 }}>
                          &ldquo;{choice.labelEn}&rdquo;
                        </div>
                        <div className={styles.decisionOptionDesc}>
                          {choice.descriptionFa}
                        </div>
                        {isChosen && (
                          <div style={{ color: "#10b981", fontWeight: 800, fontSize: "0.8rem", marginTop: "0.45rem" }}>
                            ✓ مسیر مورد نظر انتخاب شد
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Proceed to Task Button */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
              <button
                type="button"
                className={styles.advanceActionBtn}
                onClick={() => setIsCutsceneOpen(false)}
              >
                <span>🔍 شروع تحقیقات و مکالمه</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        ) : (
          /* ================================================================= */
          /* SPEAKING CHALLENGE INTERFACE (محیط حل مکالمه با میکروفون)         */
          /* ================================================================= */
          <div style={{ padding: "1.5rem" }}>
            {/* Task Main Card */}
            <div className={styles.taskMainCard}>
              {/* Speaker Prompt Zone (NO "صدای محیط") */}
              <div className={styles.speakerPromptZone}>
                <div className={styles.speakerHeaderRow}>
                  <div className={styles.speakerIdentityBox}>
                    <span className={styles.speakerAvatarEmoji}>{currentTask.speakerAvatar}</span>
                    <span className={styles.speakerNameText}>
                      {currentTask.speakerRoleFa
                        .replace(/\s*\((?:کارآگاه\s*)?اسکاتلندیارد\)/g, "")
                        .replace(/\s*\((?:کارآگاه\s*)?مشاور\)/g, "")
                        .replace("کارآگاه اسکاتلندیارد", "کارآگاه وایت")
                        .replace("کارآگاه مشاور", "شرلوک هلمز")}:
                    </span>
                  </div>

                  <div className={styles.speakerActionBtns}>
                    <button
                      type="button"
                      className={styles.translationToggleBtn}
                      onClick={() => setShowPromptTranslation((prev) => !prev)}
                      title="نمایش یا پنهان کردن ترجمه فارسی"
                    >
                      🔤 {showPromptTranslation ? "بستن ترجمه" : "ترجمه فارسی"}
                    </button>

                    <button
                      type="button"
                      className={styles.bubbleAudioBtn}
                      onClick={() =>
                        playEnglishSpeech(currentTask.speakerPromptEn, {
                          accent: "en-GB",
                          rate: 0.95,
                        })
                      }
                    >
                      🔊 دوباره بشنو
                    </button>
                  </div>
                </div>

                <div className={styles.promptEnglishQuote} dir="ltr">
                  &ldquo;{currentTask.speakerPromptEn}&rdquo;
                </div>

                {showPromptTranslation && (
                  <div className={styles.promptPersianTranslationBox}>
                    {currentTask.speakerPromptFa}
                  </div>
                )}
              </div>

              {/* Task Instruction Banner */}
              <div className={styles.taskInstructionBanner}>
                <span>💡 مأموریت تو: </span>
                <span>{currentTask.taskInstructionFa}</span>
              </div>

              {/* SUCCESS STATE: THREE SECTIONS (User Answer, Keywords, Alternatives) */}
              {isTaskSuccess ? (
                <div className={styles.threeSectionSuccessCard}>
                  {/* Live NPC Dialogue Turn (NPC answers Holmes's spoken question/statement) */}
                  {currentTask.npcResponse && (
                    <div className={styles.npcResponseCard}>
                      <div className={styles.npcHeaderRow}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontSize: "1.3rem" }}>{currentTask.npcResponse.speakerAvatar}</span>
                          <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0369a1" }}>
                            {currentTask.npcResponse.speakerNameFa}:
                          </span>
                        </div>
                        <button
                          type="button"
                          className={styles.bubbleAudioBtn}
                          onClick={() =>
                            playEnglishSpeech(currentTask.npcResponse!.textEn, {
                              accent: "en-GB",
                              rate: 0.95,
                            })
                          }
                        >
                          🔊 بشنو مجدد
                        </button>
                      </div>
                      <div className={styles.promptEnglishQuote} dir="ltr" style={{ color: "#0f172a" }}>
                        &ldquo;{currentTask.npcResponse.textEn}&rdquo;
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#475569", lineHeight: 1.6 }}>
                        {currentTask.npcResponse.textFa}
                      </div>
                    </div>
                  )}

                  {/* Section 1: User's own answer with green checkmark */}
                  <div>
                    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#10b981", display: "block", marginBottom: "0.4rem" }}>
                      بخش ۱: پاسخ خودت با تایید کارآگاه
                    </span>
                    <div className={styles.section1UserResponse}>
                      <span className={styles.userSpeechDisplay} dir="ltr">
                        &ldquo;{lastUserSuccessfulSpeech}&rdquo;
                      </span>
                      <span style={{ fontSize: "1.6rem", color: "#10b981" }}>✓</span>
                    </div>
                  </div>

                  {/* Section 2: Key words for this situation */}
                  <div className={styles.section2KeywordsBox}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#b45309", display: "block", marginBottom: "0.5rem" }}>
                      بخش ۲: کلمات کلیدی طلایی برای استفاده در این موقعیت
                    </span>
                    <div className={styles.keywordsBadgeCluster}>
                      {currentTask.targetKeywords.map((kw, i) => (
                        <span key={i} className={styles.keywordGoldenPill}>
                          <span>{kw.phrase}</span>
                          <small style={{ opacity: 0.85 }}>{kw.hintFa}</small>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: Alternative correct responses that could also be used */}
                  <div className={styles.section3AlternativesBox}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0369a1", display: "block", marginBottom: "0.5rem" }}>
                      بخش ۳: پاسخ‌هایی که می‌تونستی به جای پاسخ خودت بدی و اونا هم درست بودن (همراه با تلفظ نیتیو)
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                      {currentTask.alternativeResponsesEn.map((alt, i) => (
                        <div key={i} className={styles.alternativeRow}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                            <span className={styles.alternativeEn} dir="ltr">&ldquo;{alt.phraseEn}&rdquo;</span>
                            <span className={styles.alternativeFa}>{alt.translationFa}</span>
                          </div>
                          <button
                            type="button"
                            className={styles.bubbleAudioBtn}
                            onClick={() =>
                              playEnglishSpeech(alt.phraseEn, {
                                accent: "en-GB",
                                rate: 0.95,
                              })
                            }
                          >
                            🔊 بشنو
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Manual Proceed Button */}
                  <button
                    type="button"
                    className={styles.advanceActionBtn}
                    onClick={handleAdvanceToNextTask}
                  >
                    <span>ادامه تحقیقات</span>
                    <span>➔</span>
                  </button>
                </div>
              ) : (
                /* ACTIVE CHALLENGE: MICROPHONE FIRST (NO OPTIONS / NO KEYWORDS INITIALLY) */
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div className={styles.micConsoleZone}>
                    <button
                      type="button"
                      className={`${styles.giantMicBtn} ${isListening ? styles.listening : ""}`}
                      onClick={handleToggleListening}
                      title={isListening ? "برای پایان صحبت کلیک کن" : "روی میکروفون بزن و صحبت کن"}
                    >
                      {isListening ? "🔴" : "🎙️"}
                    </button>

                    <span className={styles.micPromptText}>
                      {isListening
                        ? "در حال شنیدن صحبت‌های شما... وقتی صحبتت تمام شد، دوباره روی میکروفون بزن یا ۲ ثانیه سکوت کن!"
                        : "روی میکروفون بزن و جمله‌ات را کامل به انگلیسی بگو!"}
                    </span>

                    {transcript && (
                      <div className={styles.transcriptLiveBubble}>
                        &ldquo;{transcript}&rdquo;
                      </div>
                    )}
                  </div>

                  {/* ERROR STATE: DETECTIVE WHITE'S HINT + KEYWORDS + FALLBACK CHOICES REVEALED */}
                  {taskHasMistake && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {/* Detective White / Watson Guidance Banner */}
                      <div className={styles.whiteHintCard}>
                        <div style={{ fontSize: "2.2rem" }}>
                          {activeStage.cefr === "A2" ? "🩺" : "🕵️‍♂️"}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                          <span className={styles.whiteHintName}>
                            {activeStage.cefr === "A2" ? "دکتر واتسون:" : "کارآگاه وایت:"}
                          </span>
                          <span className={styles.whiteHintSpeech}>
                            {currentTask.whiteHintFa}
                          </span>

                          {/* Keywords revealed */}
                          <div className={styles.keywordsBadgeCluster}>
                            {currentTask.targetKeywords.map((kw, i) => (
                              <span key={i} className={styles.keywordGoldenPill}>
                                <span>{kw.phrase}</span>
                                <small style={{ opacity: 0.85 }}>{kw.hintFa}</small>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Fallback choices revealed */}
                      <div className={styles.fallbackContainer}>
                        <span className={styles.fallbackHeaderTitle}>
                          یا می‌تونی با دقت یکی از این جملات رو انتخاب کنی:
                        </span>
                        {currentTask.fallbackChoices.map((choice, i) => (
                          <button
                            key={i}
                            type="button"
                            className={styles.fallbackChoiceBtn}
                            onClick={() => handleSelectFallback(choice)}
                          >
                            {choice}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import { Button } from "@endoora/ui";
import {
  loadStaticQuestionBank,
  useAdaptiveQuestion,
} from "../../lib/ai/useAdaptiveQuestion";
import { EnDooraLinUCBBandit } from "../../lib/ai/linucb-bandit-engine";
import { DktEngine } from "../../lib/dkt-engine/dkt-engine";
import type {
  AdaptiveQuestionPayload,
  AdaptiveInteractionResult,
  TrapCategory,
} from "../../lib/ai/types";
import { TRAP_CATEGORIES } from "../../lib/ai/types";

export interface AdaptivePracticeHubProps {
  initialSection?: "all" | "grammar" | "vocabulary" | "reading" | "listening";
  aiFocused?: boolean;
  locale?: "fa" | "en";
}

const SECTION_OPTIONS = [
  { id: "all", labelFa: "همه مهارت‌ها", labelEn: "All Skills", icon: "🌐" },
  { id: "grammar", labelFa: "دستور زبان", labelEn: "Grammar", icon: "🧩" },
  { id: "vocabulary", labelFa: "واژگان", labelEn: "Vocabulary", icon: "📚" },
  { id: "reading", labelFa: "درک مطلب", labelEn: "Reading", icon: "📖" },
  { id: "listening", labelFa: "شنیداری", labelEn: "Listening", icon: "🎧" },
] as const;

const TRAP_META: Record<TrapCategory, { nameFa: string; nameEn: string; icon: string; color: string }> = {
  phonetic_ortho: { nameFa: "تله شباهت آوایی و املایی", nameEn: "Phonetic/Ortho Trap", icon: "🔊", color: "#3b82f6" },
  semantic_siamese: { nameFa: "تله معنایی شبه‌مترادف", nameEn: "Semantic Siamese Trap", icon: "🧠", color: "#8b5cf6" },
  morphological: { nameFa: "تله ساختواژه و اشتقاقی", nameEn: "Morphological Trap", icon: "📐", color: "#ec4899" },
  l1_persian: { nameFa: "تله تداخل زبان مادری (فارسی)", nameEn: "L1 Persian Interference", icon: "🇮🇷", color: "#f59e0b" },
};

export default function AdaptivePracticeHub({
  initialSection = "all",
  aiFocused = false,
  locale = "fa",
}: AdaptivePracticeHubProps) {
  const isFa = locale === "fa";

  // Section and level filtering
  const [section, setSection] = useState<string>(initialSection);
  const [cefrLevel, setCefrLevel] = useState<string>("adaptive");
  const [alpha, setAlpha] = useState<number>(0.5);
  const [showTelemetryDrawer, setShowTelemetryDrawer] = useState<boolean>(aiFocused);

  // Question bank loading and queue
  const allQuestionsMap = useMemo(() => loadStaticQuestionBank(), []);
  const allQuestionsList = useMemo(() => Array.from(allQuestionsMap.values()), [allQuestionsMap]);

  const filteredQuestions = useMemo(() => {
    return allQuestionsList.filter((q) => {
      const matchSection = section === "all" || q.section === section;
      const matchLevel = cefrLevel === "adaptive" || (q.cefr_level || q.cefrLevel) === cefrLevel;
      return matchSection && matchLevel;
    });
  }, [allQuestionsList, section, cefrLevel]);

  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const activePayload: AdaptiveQuestionPayload | undefined = useMemo(() => {
    if (!filteredQuestions.length) return undefined;
    const safeIndex = questionIndex % filteredQuestions.length;
    return filteredQuestions[safeIndex];
  }, [filteredQuestions, questionIndex]);

  // Session Statistics
  const [sessionStats, setSessionStats] = useState({
    answered: 0,
    correct: 0,
    streak: 0,
    bestStreak: 0,
    trapsTriggered: 0,
    lastLatencyMs: 0,
  });

  // Real-time live timer
  const [elapsedTimerSeconds, setElapsedTimerSeconds] = useState<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startLiveTimer = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    const start = Date.now();
    setElapsedTimerSeconds(0);
    timerIntervalRef.current = setInterval(() => {
      setElapsedTimerSeconds(Number(((Date.now() - start) / 1000).toFixed(1)));
    }, 100);
  }, []);

  const stopLiveTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    startLiveTimer();
    return () => stopLiveTimer();
  }, [questionIndex, section, cefrLevel, startLiveTimer, stopLiveTimer]);

  // Dual feedback callback
  const handleAnswerFeedback = useCallback((res: AdaptiveInteractionResult) => {
    stopLiveTimer();
    setSessionStats((prev) => {
      const isCor = res.isCorrect;
      const newStreak = isCor ? prev.streak + 1 : 0;
      return {
        answered: prev.answered + 1,
        correct: prev.correct + (isCor ? 1 : 0),
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        trapsTriggered: prev.trapsTriggered + (res.isTrap ? 1 : 0),
        lastLatencyMs: res.latencyMs,
      };
    });
  }, [stopLiveTimer]);

  // Adaptive Question Hook (LinUCB + DKT-Forget + Telemetry)
  const {
    assembledQuestion,
    options,
    selectedOptionIndex,
    isAnswered,
    isCorrect,
    latencyMs,
    assemblyTimeMs,
    isLoading,
    error,
    selectOption,
    resetQuestion,
  } = useAdaptiveQuestion({
    question: activePayload,
    alpha,
    autoUpdateBandit: true,
    autoUpdateDkt: true,
    onAnswer: handleAnswerFeedback,
  });

  // Next question navigation
  const handleNext = useCallback(() => {
    if (!filteredQuestions.length) return;
    const nextIdx = questionIndex + 1;
    setQuestionIndex(nextIdx);
    const nextPayload = filteredQuestions[nextIdx % filteredQuestions.length];
    resetQuestion(nextPayload);
    startLiveTimer();
  }, [questionIndex, filteredQuestions, resetQuestion, startLiveTimer]);

  // Keyboard shortcut listener (Space or Enter for next question)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswered && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAnswered, handleNext]);

  // LinUCB arm states for telemetry panel
  const banditArms = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      return EnDooraLinUCBBandit.getInstance(alpha).getAllArms();
    } catch {
      return null;
    }
  }, [alpha, sessionStats.answered]);

  // DKT retention state
  const dktRetention = useMemo(() => {
    if (typeof window === "undefined") return 72;
    try {
      return Math.round(DktEngine.getInstance().getPredictions().overallRetentionIndex);
    } catch {
      return 72;
    }
  }, [sessionStats.answered]);

  const accuracy = sessionStats.answered > 0
    ? Math.round((sessionStats.correct / sessionStats.answered) * 100)
    : 100;

  return (
    <div className="aph-hub-container" dir={isFa ? "rtl" : "ltr"}>
      <style>{`
        .aph-hub-container {
          max-inline-size: 72rem;
          margin-inline: auto;
          padding-inline: clamp(1rem, 3vw, 1.5rem);
          padding-block: 1.5rem 3rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .aph-hub-header {
          text-align: center;
          max-inline-size: 48rem;
          margin-inline: auto;
        }
        .aph-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.85rem;
          border-radius: 9999px;
          background: color-mix(in srgb, var(--color-action, #0284c7) 12%, var(--color-surface, #ffffff));
          border: 1px solid color-mix(in srgb, var(--color-action, #0284c7) 30%, transparent);
          color: var(--color-action, #0284c7);
          font-size: 0.82rem;
          font-weight: 750;
          margin-bottom: 0.5rem;
        }
        .aph-header-title {
          font-size: clamp(1.8rem, 3.5vw, 2.5rem);
          font-weight: 900;
          color: var(--color-text, #0f172a);
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.02em;
        }
        .aph-header-subtitle {
          color: var(--color-muted, #64748b);
          font-size: 0.96rem;
          line-height: 1.8;
          margin: 0;
        }
        .aph-control-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          flex-wrap: wrap;
          padding: 0.75rem 1rem;
          background: var(--color-surface, #ffffff);
          border: 1px solid var(--color-border, #e2e8f0);
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
        }
        .aph-section-tabs {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          flex-wrap: wrap;
        }
        .aph-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.85rem;
          border-radius: 9999px;
          border: 1px solid transparent;
          background: transparent;
          color: var(--color-muted, #64748b);
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .aph-tab-btn:hover {
          background: var(--color-surface-hover, rgba(0,0,0,0.04));
          color: var(--color-text, #0f172a);
        }
        .aph-tab-btn-active {
          background: color-mix(in srgb, var(--color-action, #0284c7) 14%, var(--color-surface, #ffffff));
          border-color: var(--color-action, #0284c7);
          color: var(--color-action, #0284c7);
        }
        .aph-level-selector-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .aph-level-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-muted, #64748b);
        }
        .aph-level-select {
          padding: 0.45rem 0.85rem;
          border-radius: 8px;
          background: var(--color-surface, #ffffff);
          border: 1px solid var(--color-border, #e2e8f0);
          color: var(--color-text, #0f172a);
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
        }
        .aph-hud-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          flex-wrap: wrap;
          padding: 0.75rem 1rem;
          background: color-mix(in srgb, var(--color-action, #0284c7) 6%, var(--color-surface, #ffffff));
          border: 1px solid color-mix(in srgb, var(--color-action, #0284c7) 20%, var(--color-border, #e2e8f0));
          border-radius: 8px;
        }
        .aph-hud-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.86rem;
        }
        .aph-hud-label {
          color: var(--color-muted, #64748b);
          font-weight: 600;
        }
        .aph-hud-value {
          color: var(--color-text, #0f172a);
          font-weight: 800;
        }
        .aph-hud-timer-warning {
          color: #d97706 !important;
          animation: pulse 1.5s infinite;
        }
        .aph-hud-badge {
          background: color-mix(in srgb, #06b6d4 15%, var(--color-surface, #ffffff));
          color: #0284c7;
          padding: 0.15rem 0.45rem;
          border-radius: 9999px;
          font-size: 0.78rem;
          font-family: monospace;
        }
        .aph-telemetry-toggle-btn {
          background: var(--color-surface, #ffffff);
          border: 1px solid var(--color-border, #e2e8f0);
          color: var(--color-text, #0f172a);
          padding: 0.35rem 0.75rem;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .aph-telemetry-toggle-btn:hover {
          background: var(--color-surface-hover, rgba(0,0,0,0.04));
          border-color: var(--color-action, #0284c7);
        }
        .aph-arena-card {
          background: var(--color-surface, #ffffff);
          border: 1.5px solid var(--color-border, #e2e8f0);
          border-radius: 16px;
          padding: clamp(1.25rem, 4vw, 2rem);
          box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.04);
        }
        .aph-loading-state, .aph-error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          gap: 1rem;
          text-align: center;
        }
        .aph-spinner {
          width: 2.5rem;
          height: 2.5rem;
          border: 3px solid rgba(0,0,0,0.1);
          border-top-color: var(--color-action, #0284c7);
          border-radius: 50%;
          animation: aph-spin 0.8s linear infinite;
        }
        @keyframes aph-spin {
          to { transform: rotate(360deg); }
        }
        .aph-question-meta-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .aph-question-tags {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .aph-section-badge, .aph-cefr-badge, .aph-counter-badge {
          padding: 0.2rem 0.55rem;
          border-radius: 9999px;
          font-size: 0.76rem;
          font-weight: 750;
          border: 1px solid var(--color-border, #e2e8f0);
        }
        .aph-section-badge {
          background: color-mix(in srgb, var(--color-action, #0284c7) 12%, var(--color-surface, #ffffff));
          color: var(--color-action, #0284c7);
        }
        .aph-cefr-badge {
          background: color-mix(in srgb, #8b5cf6 12%, var(--color-surface, #ffffff));
          color: #8b5cf6;
        }
        .aph-counter-badge {
          background: var(--color-surface-hover, rgba(0,0,0,0.04));
          color: var(--color-muted, #64748b);
        }
        .aph-persian-guide-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.85rem;
          background: color-mix(in srgb, var(--color-action, #0284c7) 6%, var(--color-surface, #ffffff));
          border: 1px solid color-mix(in srgb, var(--color-action, #0284c7) 15%, var(--color-border, #e2e8f0));
          border-radius: 8px;
          font-size: 0.92rem;
          color: var(--color-text, #0f172a);
          margin-bottom: 1rem;
        }
        .aph-persian-guide-box p {
          margin: 0;
        }
        .aph-english-prompt-box {
          padding: 1rem 1.25rem;
          background: var(--color-surface-hover, rgba(0,0,0,0.02));
          border-radius: 8px;
          border: 1px solid var(--color-border, #e2e8f0);
          margin-bottom: 1.25rem;
        }
        .aph-prompt-text {
          font-size: clamp(1.25rem, 2.5vw, 1.6rem);
          font-weight: 800;
          color: var(--color-text, #0f172a);
          margin: 0;
          line-height: 1.5;
        }
        .aph-options-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        .aph-option-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          background: var(--color-surface, #ffffff);
          border: 1.5px solid var(--color-border, #e2e8f0);
          color: var(--color-text, #0f172a);
          font-size: 1.05rem;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
          min-height: 3.5rem;
          position: relative;
        }
        .aph-option-card:hover:not(:disabled) {
          border-color: var(--color-action, #0284c7);
          background: color-mix(in srgb, var(--color-action, #0284c7) 5%, var(--color-surface, #ffffff));
          transform: translateX(4px);
        }
        .aph-option-letter {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-weight: 800;
          font-size: 0.9rem;
          background: var(--color-surface-hover, rgba(0,0,0,0.04));
          border: 1px solid var(--color-border, #e2e8f0);
          flex-shrink: 0;
        }
        .aph-option-text {
          flex: 1;
          font-weight: 600;
        }
        .aph-option-correct {
          border-color: #10b981 !important;
          background: color-mix(in srgb, #10b981 12%, var(--color-surface, #ffffff)) !important;
          color: #065f46 !important;
        }
        .aph-option-trap {
          border-color: #ef4444 !important;
          background: color-mix(in srgb, #ef4444 12%, var(--color-surface, #ffffff)) !important;
          color: #991b1b !important;
        }
        .aph-option-disabled {
          opacity: 0.65;
          cursor: default;
        }
        .aph-correct-pill {
          background: #10b981;
          color: #ffffff;
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 800;
        }
        .aph-trap-pill {
          background: #ef4444;
          color: #ffffff;
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 800;
        }
        .aph-feedback-card {
          border-radius: 8px;
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 0.75rem;
        }
        .aph-feedback-correct {
          background: color-mix(in srgb, #10b981 8%, var(--color-surface, #ffffff));
          border: 1.5px solid #10b981;
        }
        .aph-feedback-incorrect {
          background: color-mix(in srgb, #ef4444 8%, var(--color-surface, #ffffff));
          border: 1.5px solid #ef4444;
        }
        .aph-feedback-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .aph-feedback-title-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .aph-feedback-title-row h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 800;
        }
        .aph-key-hint {
          font-size: 0.72rem;
          background: rgba(0, 0, 0, 0.2);
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
        }
        .aph-explanation-body {
          font-size: 0.94rem;
          line-height: 1.8;
          color: var(--color-text, #0f172a);
          border-top: 1px solid var(--color-border, #e2e8f0);
          padding-top: 0.5rem;
        }
        .aph-explanation-label {
          display: block;
          font-weight: 800;
          margin-bottom: 0.25rem;
        }
        .aph-explanation-text {
          margin: 0;
        }
        .aph-distractor-breakdown-box {
          margin-top: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: var(--color-surface, #ffffff);
          border: 1px solid var(--color-border, #e2e8f0);
          border-radius: 8px;
          font-size: 0.85rem;
        }
        .aph-distractor-breakdown-title {
          display: block;
          font-weight: 750;
          margin-bottom: 0.35rem;
        }
        .aph-distractor-tags-row {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .aph-distractor-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: var(--color-surface-hover, rgba(0,0,0,0.03));
          padding: 0.15rem 0.5rem;
          border-radius: 9999px;
          border: 1px solid var(--color-border, #e2e8f0);
          font-size: 0.78rem;
        }
        .aph-telemetry-drawer {
          background: var(--color-surface, #ffffff);
          border: 1.5px solid var(--color-border, #e2e8f0);
          border-radius: 12px;
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .aph-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .aph-drawer-header h3 {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 800;
        }
        .aph-alpha-control {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 700;
        }
        .aph-arms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
          gap: 0.75rem;
        }
        .aph-arm-card {
          background: var(--color-surface-hover, rgba(0,0,0,0.02));
          border: 1px solid var(--color-border, #e2e8f0);
          border-radius: 8px;
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .aph-arm-top {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.88rem;
          font-weight: 800;
        }
        .aph-arm-metrics {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          color: var(--color-muted, #64748b);
        }
        .aph-arm-track {
          inline-size: 100%;
          block-size: 5px;
          background: var(--color-border, #e2e8f0);
          border-radius: 9999px;
          overflow: hidden;
        }
        .aph-arm-bar {
          block-size: 100%;
          transition: inline-size 0.3s ease;
        }
      `}</style>

      {/* Top Header */}
      <header className="aph-hub-header">
        <div className="aph-header-badge">
          <span>⚡</span>
          <span>{isFa ? "موتور انطباقی LinUCB + DKT-Forget" : "LinUCB Bandit + DKT Neural Engine"}</span>
        </div>
        <h1 className="aph-header-title">
          {isFa ? "هاب تمرین تعاملی و انطباقی زبان" : "Adaptive Practice Hub"}
        </h1>
        <p className="aph-header-subtitle">
          {isFa
            ? "چینش هوشمند تله‌های گزینه‌ای متناسب با نقاط ضعف ذهنی شما با سرعت زیر ۰.۲ میلی‌ثانیه و پایش بلادرنگ تسلط"
            : "Dynamic distractor trap assembly tailored to your cognitive vulnerabilities in <0.2ms with live retention tracking."}
        </p>
      </header>

      {/* Filter and Control Bar */}
      <div className="aph-control-bar">
        <div className="aph-section-tabs" role="tablist">
          {SECTION_OPTIONS.map((sec) => (
            <button
              key={sec.id}
              type="button"
              role="tab"
              aria-selected={section === sec.id}
              className={`aph-tab-btn ${section === sec.id ? "aph-tab-btn-active" : ""}`}
              onClick={() => {
                setSection(sec.id);
                setQuestionIndex(0);
              }}
            >
              <span>{sec.icon}</span>
              <span>{isFa ? sec.labelFa : sec.labelEn}</span>
            </button>
          ))}
        </div>

        <div className="aph-level-selector-wrap">
          <label htmlFor="cefr-select" className="aph-level-label">
            {isFa ? "سطح تمرین:" : "Level:"}
          </label>
          <select
            id="cefr-select"
            value={cefrLevel}
            onChange={(e) => {
              setCefrLevel(e.target.value);
              setQuestionIndex(0);
            }}
            className="aph-level-select"
          >
            <option value="adaptive">{isFa ? "🎯 انطباقی هوشمند (Adaptive)" : "🎯 Smart Adaptive"}</option>
            <option value="A1">A1 · Starter</option>
            <option value="A2">A2 · Elementary</option>
            <option value="B1">B1 · Intermediate</option>
            <option value="B2">B2 · Upper-Intermediate</option>
            <option value="C1">C1 · Advanced</option>
            <option value="C2">C2 · Mastery</option>
          </select>
        </div>
      </div>

      {/* Live Cognitive HUD Bar */}
      <div className="aph-hud-bar">
        <div className="aph-hud-item">
          <span className="aph-hud-label">{isFa ? "دقت نشست:" : "Accuracy:"}</span>
          <strong className="aph-hud-value">{accuracy}٪</strong>
        </div>

        <div className="aph-hud-item">
          <span className="aph-hud-label">{isFa ? "نوار پیاپی:" : "Streak:"}</span>
          <strong className="aph-hud-value">🔥 {sessionStats.streak}</strong>
        </div>

        <div className="aph-hud-item">
          <span className="aph-hud-label">{isFa ? "زمان تفکر شناختی:" : "Cognitive Latency:"}</span>
          <strong className={`aph-hud-value ${!isAnswered && elapsedTimerSeconds > 5 ? "aph-hud-timer-warning" : ""}`}>
            ⏱️ {isAnswered ? `${((latencyMs || 0) / 1000).toFixed(2)}s` : `${elapsedTimerSeconds}s`}
          </strong>
        </div>

        <div className="aph-hud-item">
          <span className="aph-hud-label">{isFa ? "شاخص نگهداری حافظه DKT:" : "DKT Memory Retention:"}</span>
          <strong className="aph-hud-value" style={{ color: "#10b981" }}>
            🧠 {dktRetention}٪
          </strong>
        </div>

        <div className="aph-hud-item">
          <span className="aph-hud-label">{isFa ? "مونتاژ LinUCB:" : "Bandit Assembly:"}</span>
          <strong className="aph-hud-badge">
            ⚡ {assemblyTimeMs.toFixed(3)} ms
          </strong>
        </div>

        <button
          type="button"
          className="aph-telemetry-toggle-btn"
          onClick={() => setShowTelemetryDrawer((prev) => !prev)}
        >
          {showTelemetryDrawer ? (isFa ? "بستن پنل تله‌متری ✕" : "Close Telemetry ✕") : (isFa ? "نمودار هوش مصنوعی ⚙️" : "AI Diagnostics ⚙️")}
        </button>
      </div>

      {/* Main Question Arena */}
      <main className="aph-arena-card">
        {isLoading && (
          <div className="aph-loading-state">
            <div className="aph-spinner" />
            <p>{isFa ? "در حال محاسبه UCB و مونتاژ انطباقی سوال..." : "Calculating UCB & assembling distractors..."}</p>
          </div>
        )}

        {error && (
          <div className="aph-error-state">
            <p>⚠️ {error.message}</p>
            <Button onClick={() => handleNext()}>{isFa ? "سوال بعدی" : "Next Question"}</Button>
          </div>
        )}

        {!isLoading && !error && assembledQuestion && activePayload && (
          <div>
            {/* Question Meta Header */}
            <div className="aph-question-meta-header">
              <div className="aph-question-tags">
                <span className="aph-section-badge">
                  {activePayload.section?.toUpperCase() || "GENERAL"}
                </span>
                <span className="aph-cefr-badge">
                  CEFR {activePayload.cefr_level || activePayload.cefrLevel || "B1"}
                </span>
                <span className="aph-counter-badge">
                  {isFa
                    ? `سوال ${questionIndex + 1} از ${filteredQuestions.length}`
                    : `Question ${questionIndex + 1} of ${filteredQuestions.length}`}
                </span>
              </div>
            </div>

            {/* Persian Guidance Prompt */}
            {activePayload.prompt_fa && (
              <div className="aph-persian-guide-box">
                <span>💡</span>
                <p>{activePayload.prompt_fa}</p>
              </div>
            )}

            {/* English Prompt */}
            <div className="aph-english-prompt-box" dir="ltr">
              <h2 className="aph-prompt-text">
                {assembledQuestion.prompt}
              </h2>
            </div>

            {/* 4 Interactive Options */}
            <div className="aph-options-grid" dir="ltr">
              {options.map((opt, idx) => {
                const isSelected = selectedOptionIndex === idx;
                const letter = String.fromCharCode(65 + idx);

                let optClass = "aph-option-card";
                if (isAnswered) {
                  if (opt.isCorrect) optClass += " aph-option-correct";
                  else if (isSelected && !opt.isCorrect) optClass += " aph-option-trap";
                  else optClass += " aph-option-disabled";
                } else if (isSelected) {
                  optClass += " aph-option-active";
                }

                return (
                  <button
                    key={`${assembledQuestion.questionId}_opt_${idx}`}
                    type="button"
                    className={optClass}
                    onClick={() => selectOption(idx)}
                    disabled={isAnswered}
                  >
                    <span className="aph-option-letter">{letter}</span>
                    <span className="aph-option-text">{opt.text}</span>
                    {isAnswered && opt.isCorrect && (
                      <span className="aph-correct-pill">
                        {isFa ? "پاسخ صحیح ✓" : "Correct ✓"}
                      </span>
                    )}
                    {isAnswered && isSelected && !opt.isCorrect && opt.trapCategory && (
                      <span className="aph-trap-pill">
                        {TRAP_META[opt.trapCategory]?.nameFa || "تله انطباقی"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Post-Answer Feedback Banner & Explanations */}
            {isAnswered && (
              <div className={`aph-feedback-card ${isCorrect ? "aph-feedback-correct" : "aph-feedback-incorrect"}`}>
                <div className="aph-feedback-header">
                  <div className="aph-feedback-title-row">
                    <span>{isCorrect ? "✅" : "⚠️"}</span>
                    <h3>
                      {isCorrect
                        ? (isFa ? "آفرین! پاسخ کاملاً درست است." : "Excellent! Correct Answer.")
                        : (isFa ? "به تله انطباقی برخوردید!" : "Distractor Trap Triggered!")}
                    </h3>
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleNext}
                  >
                    <span>{isFa ? "سوال بعدی" : "Next Question"}</span>
                    <span aria-hidden="true">{isFa ? "←" : "→"}</span>
                    <kbd className="aph-key-hint">[Space]</kbd>
                  </Button>
                </div>

                <div className="aph-explanation-body" dir={isFa ? "rtl" : "ltr"}>
                  <strong className="aph-explanation-label">
                    {isFa ? "توضیحات تکمیلی و آموزشی:" : "Educational Explanation:"}
                  </strong>
                  <p className="aph-explanation-text">
                    {activePayload.explanation_fa || activePayload.explanationFa ||
                      (isCorrect
                        ? "گزینه انتخابی شما از نظر معنایی و ساختار دستوری کاملاً دقیق است."
                        : "این گزینه یکی از تله‌های رایج آزمون‌های بین‌المللی است که ساختار ظاهری موجهی دارد اما پاسخ هدف نیست.")}
                  </p>
                </div>

                {/* LinUCB Distractor Analysis Box */}
                {assembledQuestion.selectedDistractors.length > 0 && (
                  <div className="aph-distractor-breakdown-box">
                    <span className="aph-distractor-breakdown-title">
                      🎯 {isFa ? "تله‌های مهندسی‌شده با هوش مصنوعی در این سوال:" : "AI Disjoint Distractor Analysis:"}
                    </span>
                    <div className="aph-distractor-tags-row">
                      {assembledQuestion.selectedDistractors.map((d) => (
                        <div key={d.id} className="aph-distractor-tag">
                          <span style={{ color: TRAP_META[d.category]?.color }}>
                            {TRAP_META[d.category]?.icon} {TRAP_META[d.category]?.nameFa}
                          </span>
                          <span style={{ fontFamily: "monospace", fontWeight: 700 }}>«{d.text}»</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Deep Cognitive & Bandit Telemetry Drawer */}
      {showTelemetryDrawer && (
        <aside className="aph-telemetry-drawer" aria-label={isFa ? "وضعیت الگوریتم‌های هوش مصنوعی" : "AI Telemetry"}>
          <div className="aph-drawer-header">
            <h3>🤖 {isFa ? "وضعیت زنده یادگیری تقویتی LinUCB و DKT" : "Live LinUCB & DKT Telemetry"}</h3>
            <div className="aph-alpha-control">
              <label htmlFor="alpha-range">{isFa ? `ضریب کاوش (α = ${alpha.toFixed(2)}):` : `Exploration α = ${alpha.toFixed(2)}:`}</label>
              <input
                id="alpha-range"
                type="range"
                min="0.0"
                max="2.0"
                step="0.05"
                value={alpha}
                onChange={(e) => setAlpha(parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div className="aph-arms-grid">
            {TRAP_CATEGORIES.map((cat) => {
              const arm = banditArms?.[cat];
              const meta = TRAP_META[cat];
              const pulls = arm?.pulls ?? 0;
              const rewards = arm?.rewards ?? 0;
              const avgReward = pulls > 0 ? (rewards / pulls).toFixed(2) : "0.00";

              return (
                <div key={cat} className="aph-arm-card">
                  <div className="aph-arm-top">
                    <span>{meta.icon}</span>
                    <strong>{isFa ? meta.nameFa : meta.nameEn}</strong>
                  </div>
                  <div className="aph-arm-metrics">
                    <span>{isFa ? "دفعات ارائه:" : "Pulls:"} <strong>{pulls}</strong></span>
                    <span>{isFa ? "نرخ فریب (پاداش):" : "Trap Rate:"} <strong>{avgReward}</strong></span>
                  </div>
                  <div className="aph-arm-track">
                    <div
                      className="aph-arm-bar"
                      style={{
                        inlineSize: `${Math.min(100, Math.round(Number(avgReward) * 100))}%`,
                        backgroundColor: meta.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      )}
    </div>
  );
}

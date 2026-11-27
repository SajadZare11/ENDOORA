"use client";

import { useState, useRef, useEffect } from "react";
import type { MiniPracticeQuestion, SkillKey } from "@/data/skills/skills-content";
import { EnDooraLinUCBBandit } from "@/lib/ai/linucb-bandit-engine";
import type { TrapCategory, Vector4 } from "@/lib/ai/types";
import { DktEngine } from "@/lib/dkt-engine/dkt-engine";
import {
  ensureTwinLearnerScope,
  getLearnerTwin,
  setTwinLearnerScope,
  recordTwinObservation,
  recordTwinGrammarInteraction,
  twinTelemetry,
} from "@/lib/ai/learner-twin-store";
import { useTwin } from "@/components/twin/useTwin";
import { SkillMasteryIndicator } from "./SkillMasteryIndicator";
import styles from "./skills-components.module.css";

interface SkillMiniPracticeProps {
  sectionTitleFa: string;
  sectionDescFa: string;
  questions: MiniPracticeQuestion[];
  /** Optional skill key for routing telemetry to appropriate AI models ("grammar" | "vocabulary" | "reading" | "writing" | "listening" | "speaking") */
  skill?: SkillKey | string;
}

/** Curriculum Concept Mapping for Curated Questions */
const QUESTION_GRAMMAR_CONCEPT_MAP: Record<string, string> = {
  // Grammar concepts
  "grm-q1": "b1-02", // Present Perfect Continuous vs Simple
  "grm-q2": "a2-08", // Gerunds vs Infinitives
  "grm-q3": "b2-01", // Third Conditional
  // Vocabulary concepts (Discourse, Collocations & Connectors)
  "voc-q1": "b1-09", // Clauses of Contrast and Purpose
  "voc-q2": "b2-10", // Discourse Markers and Linkers
  "voc-q3": "c1-08", // Complex Prepositional Phrases
  // Reading concepts
  "rdg-q1": "b1-07", // Non-defining Relative Clauses
  "rdg-q2": "b2-07", // Relative Clauses with Prepositions
  "rdg-q3": "c1-06", // Nominalisation in Formal Syntax
  // Writing concepts
  "wrt-q1": "b1-05", // Reported Speech
  "wrt-q2": "b2-08", // Reporting Passives
  "wrt-q3": "c1-02", // Cleft Sentences for Emphasis
  // Speaking concepts
  "spk-q1": "a1-04", // Can & Can't for Ability & Modals
  "spk-q2": "b1-03", // Modals of Deduction
  "spk-q3": "c1-05", // Distancing Expressions and Hedging
  // Listening concepts
  "lis-q1": "a2-10", // Used to for Past Habits
  "lis-q2": "b1-08", // Question Tags & Echo Questions
  "lis-q3": "c1-07", // Ellipsis and Substitution
};

function inferSkillFromQuestions(questions: MiniPracticeQuestion[], fallback: string = "grammar"): string {
  const firstId = questions[0]?.id || "";
  if (firstId.startsWith("grm")) return "grammar";
  if (firstId.startsWith("voc")) return "vocabulary";
  if (firstId.startsWith("rdg")) return "reading";
  if (firstId.startsWith("wrt")) return "writing";
  if (firstId.startsWith("spk")) return "speaking";
  if (firstId.startsWith("lis")) return "listening";
  return fallback;
}

export function SkillMiniPractice({
  sectionTitleFa,
  sectionDescFa,
  questions,
  skill,
}: SkillMiniPracticeProps) {
  const effectiveSkill = (skill as SkillKey) || inferSkillFromQuestions(questions, "grammar");

  // Map of question.id -> selected option index
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  // Map of question.id -> boolean for explanation visibility
  const [explanationVisibility, setExplanationVisibility] = useState<Record<string, boolean>>({});
  // Millisecond-precision start timestamps for each question card
  const questionStartTimes = useRef<Record<string, number>>({});
  // Visual pulse tracking for live telemetry feedback
  const [lastTelemetryUpdate, setLastTelemetryUpdate] = useState<{ questionId: string; latencyMs: number } | null>(null);

  // Subscribe to live Neuro-Bayesian Learner Twin updates
  useTwin();

  // Initialize start timestamps when questions arrive
  useEffect(() => {
    const now = performance.now();
    questions.forEach((q) => {
      if (!questionStartTimes.current[q.id]) {
        questionStartTimes.current[q.id] = now;
      }
    });
  }, [questions]);

  // Ensure Learner Twin scope on mount
  useEffect(() => {
    void ensureTwinLearnerScope().catch(() => {});
    // Fall back to local learner scope if unauthenticated
    if (typeof window !== "undefined" && !getLearnerTwin()) {
      setTwinLearnerScope("local_learner");
    }
  }, []);

  const handleSelectOption = (questionId: string, optionIndex: number, correctAnswer: number) => {
    // If already answered, do nothing
    if (selectedAnswers[questionId] !== undefined) return;

    // 1. Measure millisecond-precision response latency via performance.now()
    const startMs = questionStartTimes.current[questionId] ?? performance.now();
    const latencyMs = Math.max(120, Math.min(120000, Math.round(performance.now() - startMs)));
    const isCorrect = optionIndex === correctAnswer;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));

    // If incorrect, auto-expand explanation. If correct, keep collapsed initially.
    setExplanationVisibility((prev) => ({
      ...prev,
      [questionId]: !isCorrect,
    }));

    setLastTelemetryUpdate({ questionId, latencyMs });

    // 2. Dispatch answer feedback to LinUCB Contextual Bandit
    try {
      const bandit = EnDooraLinUCBBandit.getInstance();
      const trapCategory: TrapCategory =
        effectiveSkill === "vocabulary"
          ? "semantic_siamese"
          : effectiveSkill === "speaking" || effectiveSkill === "listening"
          ? "phonetic_ortho"
          : effectiveSkill === "grammar"
          ? "l1_persian"
          : "morphological";

      const features: Vector4 =
        trapCategory === "semantic_siamese"
          ? [0.25, 0.75, 0.35, 0.45]
          : trapCategory === "phonetic_ortho"
          ? [0.80, 0.25, 0.20, 0.50]
          : trapCategory === "l1_persian"
          ? [0.35, 0.35, 0.35, 0.79]
          : [0.30, 0.40, 0.70, 0.50];

      bandit.recordInteractionFeedback({
        category: trapCategory,
        features,
        trapTriggered: !isCorrect,
        latencyMs,
      });
    } catch {
      // Safe fallback
    }

    // 3. Dispatch concept updates to DKT-Forget Neural GRU Engine
    const targetConcept = QUESTION_GRAMMAR_CONCEPT_MAP[questionId] || "b1-01";
    try {
      const dkt = DktEngine.getInstance();
      dkt.recordInteraction({
        conceptId: targetConcept,
        isCorrect,
        isTrap: !isCorrect,
        latencyMs,
        twinContext: {
          itemId: questionId,
          latencyMs,
          guessingFloor: 1 / Math.max(2, (questions.find((q) => q.id === questionId)?.options.length ?? 4)),
        },
      });
    } catch {
      // Safe fallback
    }

    // 4. Dispatch skill evidence to Neuro-Bayesian Learner Twin
    try {
      if (
        effectiveSkill === "listening" ||
        effectiveSkill === "reading" ||
        effectiveSkill === "writing" ||
        effectiveSkill === "speaking"
      ) {
        recordTwinObservation({
          skillIds: [],
          observedScore: isCorrect ? 1.0 : 0.0,
          modality: "mcq_bandit",
          ieltsSkill: effectiveSkill,
          guessingFloor: 1 / Math.max(2, (questions.find((q) => q.id === questionId)?.options.length ?? 4)),
          latencyMs,
          expectedLatencyMs: 15000,
          ...twinTelemetry(),
          itemId: questionId,
        });
      } else if (effectiveSkill === "vocabulary") {
        recordTwinGrammarInteraction({
          conceptId: "b2-10",
          isCorrect,
          latencyMs,
          itemId: questionId,
          guessingFloor: 0.25,
        });
      }
      // Note: for "grammar", dkt.recordInteraction internally calls recordTwinGrammarInteraction
    } catch {
      // Safe fallback
    }
  };

  const toggleExplanation = (questionId: string) => {
    setExplanationVisibility((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setExplanationVisibility({});
    setLastTelemetryUpdate(null);
    const now = performance.now();
    questions.forEach((q) => {
      questionStartTimes.current[q.id] = now;
    });
  };

  // Stats
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = questions.filter(
    (q) => selectedAnswers[q.id] === q.correctAnswer
  ).length;

  return (
    <section id="mini-practice" className={styles.section} aria-labelledby="practice-title">
      <header className={styles.sectionHeader}>
        <div className={styles.sectionBadge}>🎯 ستون دوم: کارگاه تعاملی درجا</div>
        <h2 id="practice-title" className={styles.sectionTitle}>
          {sectionTitleFa}
        </h2>
        <p className={styles.sectionDesc}>
          {sectionDescFa}
        </p>
      </header>

      {/* Live Cognitive Twin Mastery & Confidence Indicator */}
      <SkillMasteryIndicator
        skill={effectiveSkill}
        skillTitleFa={sectionTitleFa}
      />

      <div className={styles.practiceContainer}>
        {/* Score & Telemetry Ribbon */}
        <div className={styles.practiceScoreRibbon}>
          <div className={styles.practiceScoreStats}>
            <span>
              پاسخ داده شده:{" "}
              <strong className={styles.statHighlight}>{answeredCount}</strong> از{" "}
              {totalQuestions}
            </span>
            {answeredCount > 0 && (
              <span>
                درست:{" "}
                <strong className={styles.statSuccess}>{correctCount}</strong>
              </span>
            )}
            {lastTelemetryUpdate && (
              <span
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "#15803d",
                  backgroundColor: "#dcfce7",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "9999px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
                title="ثبت در دوقلوی شناختی و بندیت LinUCB"
              >
                ⚡ درنگ ذهنی: {lastTelemetryUpdate.latencyMs}ms | ثبت در دوقلو ✓
              </span>
            )}
          </div>
          {answeredCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className={styles.resetBtn}
              aria-label="شروع مجدد تمرین‌ها"
            >
              <span>↺ تلاش مجدد</span>
            </button>
          )}
        </div>

        {/* Questions Cards */}
        {questions.map((q) => {
          const selectedOption = selectedAnswers[q.id];
          const isAnswered = selectedOption !== undefined;
          const isCorrect = isAnswered && selectedOption === q.correctAnswer;
          const isExplanationOpen = Boolean(explanationVisibility[q.id]);

          let cardModifier = "";
          if (isAnswered) {
            cardModifier = isCorrect
              ? styles.questionCardCorrect
              : styles.questionCardIncorrect;
          }

          return (
            <div
              key={q.id}
              className={`${styles.questionCard} ${cardModifier}`}
              role="region"
              aria-label={`سوال شماره ${q.orderNumber}`}
            >
              <div className={styles.questionHeaderRow}>
                <span className={styles.questionNumberBadge}>
                  سوال {q.orderNumber} از {totalQuestions}
                </span>

                {isAnswered && (
                  <span
                    className={`${styles.questionStatusBadge} ${
                      isCorrect ? styles.statusCorrect : styles.statusIncorrect
                    }`}
                  >
                    {isCorrect ? "✓ پاسخ درست!" : "✗ نیاز به دقت"}
                  </span>
                )}
              </div>

              <div className={styles.questionPromptFa}>
                {q.promptFa}
              </div>

              {q.promptEn && (
                <div className={styles.questionPromptEn}>
                  {q.promptEn}
                </div>
              )}

              {/* Options */}
              <div className={styles.optionsGrid} role="radiogroup">
                {q.options.map((optText, optIdx) => {
                  const isThisSelected = selectedOption === optIdx;
                  let optionClass = styles.optionBtn;
                  let badgeContent = null;

                  if (isAnswered) {
                    if (isThisSelected && isCorrect) {
                      optionClass = `${styles.optionBtn} ${styles.optionCorrect}`;
                      badgeContent = <span className={styles.optionBadgeIcon}>✓</span>;
                    } else if (isThisSelected && !isCorrect) {
                      optionClass = `${styles.optionBtn} ${styles.optionIncorrect}`;
                      badgeContent = <span className={styles.optionBadgeIcon}>✗</span>;
                    } else if (!isCorrect && optIdx === q.correctAnswer) {
                      optionClass = `${styles.optionBtn} ${styles.optionRevealed}`;
                      badgeContent = (
                        <span className={styles.optionBadgeIcon} title="پاسخ صحیح">
                          ✓
                        </span>
                      );
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      className={optionClass}
                      onClick={() => handleSelectOption(q.id, optIdx, q.correctAnswer)}
                      disabled={isAnswered}
                      aria-checked={isThisSelected}
                      role="radio"
                    >
                      <span>{optText}</span>
                      {badgeContent}
                    </button>
                  );
                })}
              </div>

              {/* Pedagogical Explanation Accordion */}
              {isAnswered && (
                <div className={styles.explanationSection}>
                  {isCorrect ? (
                    <button
                      type="button"
                      className={styles.explanationToggleBtn}
                      onClick={() => toggleExplanation(q.id)}
                      aria-expanded={isExplanationOpen}
                    >
                      <span>{isExplanationOpen ? "بستن توضیحات تکمیلی" : "توضیحات تکمیلی"}</span>
                      <span aria-hidden="true">{isExplanationOpen ? "▲" : "▼"}</span>
                    </button>
                  ) : (
                    <div className={styles.explanationHeaderAuto}>
                      <span aria-hidden="true">💡</span>
                      <span>تحلیل تشریحی و نکته آموزشی</span>
                    </div>
                  )}

                  {isExplanationOpen && (
                    <div className={styles.explanationBox} role="region" aria-label="تحلیل تشریحی">
                      <div className={styles.explanationBrief}>
                        {q.explanation.briefFa}
                      </div>
                      <div className={styles.explanationDetailed}>
                        {q.explanation.detailedFa}
                      </div>
                      <div className={styles.goldenRuleBox}>
                        <span className={styles.goldenRuleLabel}>📌 نکته طلایی:</span>
                        <span>{q.explanation.goldenRuleFa}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

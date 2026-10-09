"use client";

import { useState } from "react";
import type { MiniPracticeQuestion } from "@/data/skills/skills-content";
import styles from "./skills-components.module.css";

interface SkillMiniPracticeProps {
  sectionTitleFa: string;
  sectionDescFa: string;
  questions: MiniPracticeQuestion[];
}

export function SkillMiniPractice({
  sectionTitleFa,
  sectionDescFa,
  questions,
}: SkillMiniPracticeProps) {
  // Map of question.id -> selected option index
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  // Map of question.id -> boolean for explanation visibility
  const [explanationVisibility, setExplanationVisibility] = useState<Record<string, boolean>>({});

  const handleSelectOption = (questionId: string, optionIndex: number, correctAnswer: number) => {
    // If already answered, do nothing
    if (selectedAnswers[questionId] !== undefined) return;

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

      <div className={styles.practiceContainer}>
        {/* Score & Progress Ribbon */}
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
                      // Auto-reveal correct option with dashed green border
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
                    // Correct answer: Collapsed toggle button
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
                    // Incorrect answer: Prominent auto-expanded educational banner
                    <div className={styles.explanationHeaderAuto}>
                      <span aria-hidden="true">💡</span>
                      <span>تحلیل تشریحی و نکته آموزشی</span>
                    </div>
                  )}

                  {/* Expanded Content Box */}
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

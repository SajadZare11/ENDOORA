"use client";

import React, { useState } from "react";
import type { ListeningExercise } from "@endoora/contracts";
import styles from "./listening-components.module.css";

interface ListeningExerciseEngineProps {
  exercises: ListeningExercise[];
  onAnswerSubmitted?: (exerciseId: string, isCorrect: boolean) => void;
  onAllCompleted?: (scorePercent: number) => void;
}

export const ListeningExerciseEngine: React.FC<ListeningExerciseEngineProps> = ({
  exercises,
  onAnswerSubmitted,
  onAllCompleted,
}) => {
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [evaluated, setEvaluated] = useState<Record<string, boolean>>({});
  const [fillInputs, setFillInputs] = useState<Record<string, string>>({});

  const handleMultipleChoice = (exId: string, selectedIdx: number, correctIdx: number) => {
    if (evaluated[exId]) return;
    const isCorrect = selectedIdx === correctIdx;
    setUserAnswers((prev) => ({ ...prev, [exId]: selectedIdx }));
    setEvaluated((prev) => ({ ...prev, [exId]: true }));
    onAnswerSubmitted?.(exId, isCorrect);
    checkAllCompletion({ ...userAnswers, [exId]: selectedIdx });
  };

  const handleTrueFalse = (exId: string, choice: boolean, actualTrue: boolean) => {
    if (evaluated[exId]) return;
    const isCorrect = choice === actualTrue;
    setUserAnswers((prev) => ({ ...prev, [exId]: choice }));
    setEvaluated((prev) => ({ ...prev, [exId]: true }));
    onAnswerSubmitted?.(exId, isCorrect);
    checkAllCompletion({ ...userAnswers, [exId]: choice });
  };

  const handleFillBlank = (exId: string, acceptedAnswers: string[]) => {
    if (evaluated[exId]) return;
    const input = (fillInputs[exId] || "").trim().toLowerCase();
    const isCorrect = acceptedAnswers.some((ans) => ans.trim().toLowerCase() === input);
    setUserAnswers((prev) => ({ ...prev, [exId]: input }));
    setEvaluated((prev) => ({ ...prev, [exId]: true }));
    onAnswerSubmitted?.(exId, isCorrect);
    checkAllCompletion({ ...userAnswers, [exId]: input });
  };

  const checkAllCompletion = (currentAnswers: Record<string, any>) => {
    const answeredCount = Object.keys(currentAnswers).length;
    if (answeredCount >= exercises.length && onAllCompleted) {
      // Calculate overall score
      let correctCount = 0;
      exercises.forEach((ex) => {
        const ans = currentAnswers[ex.id];
        if (ex.type === "true_false") {
          if (ans === ex.isTrue) correctCount++;
        } else if (
          ex.type === "multiple_choice" ||
          ex.type === "main_idea" ||
          ex.type === "detail_recognition" ||
          ex.type === "inference" ||
          ex.type === "speaker_attitude" ||
          ex.type === "speaker_identification"
        ) {
          if (ans === ex.correctIndex) correctCount++;
        } else if (ex.type === "fill_blank" || ex.type === "sentence_completion" || ex.type === "summary_completion") {
          const val = (ans || "").toLowerCase().trim();
          if (ex.acceptedAnswers.some((a) => a.toLowerCase().trim() === val)) correctCount++;
        } else {
          correctCount++; // Default credit for open formats
        }
      });
      const pct = Math.round((correctCount / exercises.length) * 100);
      onAllCompleted(pct);
    }
  };

  if (!exercises || exercises.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "1.5rem", color: "#64748b" }}>
        تمرینی برای این بخش تعریف نشده است.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {exercises.map((ex, idx) => {
        const isAnswered = evaluated[ex.id];
        const selected = userAnswers[ex.id];

        return (
          <div key={ex.id} className={styles.exerciseCard}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2563eb" }}>
                تمرین {idx + 1} از {exercises.length} ({ex.skillFocus})
              </span>
              {isAnswered && (
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#16a34a",
                    background: "#dcfce7",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "4px",
                  }}
                >
                  ثبت شد
                </span>
              )}
            </div>

            {/* Prompts */}
            <div className={styles.exercisePromptEn}>{ex.promptEn}</div>
            <div className={styles.exercisePromptFa}>{ex.promptFa}</div>

            {/* Multiple Choice / Main Idea / Detail / Inference / Attitude */}
            {(ex.type === "multiple_choice" ||
              ex.type === "main_idea" ||
              ex.type === "detail_recognition" ||
              ex.type === "inference" ||
              ex.type === "speaker_attitude" ||
              ex.type === "speaker_identification") && (
              <div className={styles.optionsGrid}>
                {ex.options.map((opt, optIdx) => {
                  const isThisSelected = selected === optIdx;
                  const isCorrectAnswer = optIdx === ex.correctIndex;

                  let optClass = styles.optionBtn;
                  if (isAnswered) {
                    if (isCorrectAnswer) {
                      optClass += ` ${styles.optionCorrect}`;
                    } else if (isThisSelected && !isCorrectAnswer) {
                      optClass += ` ${styles.optionWrong}`;
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleMultipleChoice(ex.id, optIdx, ex.correctIndex)}
                      className={optClass}
                    >
                      <span>{opt}</span>
                      {isAnswered && isCorrectAnswer && <span>✓ پاسخ صحیح</span>}
                      {isAnswered && isThisSelected && !isCorrectAnswer && <span>✕</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {/* True / False */}
            {ex.type === "true_false" && (
              <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
                <button
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleTrueFalse(ex.id, true, ex.isTrue)}
                  className={`${styles.optionBtn} ${
                    isAnswered && ex.isTrue
                      ? styles.optionCorrect
                      : isAnswered && selected === true && !ex.isTrue
                      ? styles.optionWrong
                      : ""
                  }`}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  درست (True)
                </button>
                <button
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleTrueFalse(ex.id, false, ex.isTrue)}
                  className={`${styles.optionBtn} ${
                    isAnswered && !ex.isTrue
                      ? styles.optionCorrect
                      : isAnswered && selected === false && ex.isTrue
                      ? styles.optionWrong
                      : ""
                  }`}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  نادرست (False)
                </button>
              </div>
            )}

            {/* Fill Blank / Sentence Completion */}
            {(ex.type === "fill_blank" ||
              ex.type === "sentence_completion" ||
              ex.type === "summary_completion") && (
              <div style={{ marginBottom: "1rem" }}>
                <div
                  style={{
                    background: "#f8fafc",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    border: "1px dashed #cbd5e1",
                    direction: "ltr",
                    fontWeight: 600,
                    marginBottom: "0.75rem",
                  }}
                >
                  {ex.sentenceWithBlank}
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    disabled={isAnswered}
                    placeholder="پاسخ را اینجا بنویسید..."
                    value={fillInputs[ex.id] || ""}
                    onChange={(e) => setFillInputs((prev) => ({ ...prev, [ex.id]: e.target.value }))}
                    style={{
                      flex: 1,
                      padding: "0.6rem 0.85rem",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      direction: "ltr",
                      fontSize: "0.95rem",
                    }}
                  />
                  <button
                    type="button"
                    disabled={isAnswered || !fillInputs[ex.id]?.trim()}
                    onClick={() => handleFillBlank(ex.id, ex.acceptedAnswers)}
                    className={styles.secBtn}
                    style={{ background: "#2563eb", color: "#ffffff", borderColor: "#2563eb" }}
                  >
                    تایید
                  </button>
                </div>
              </div>
            )}

            {/* Pedagogical Explanation Accordion (Visible on answer) */}
            {isAnswered && (
              <div className={styles.explanationBox}>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#166534", marginBottom: "0.25rem" }}>
                  💡 تحلیل آموزشی سوال:
                </div>
                <div style={{ fontSize: "0.85rem", color: "#14532d", lineHeight: 1.6 }}>
                  {ex.explanation.briefFa} {ex.explanation.detailedFa}
                </div>
                {ex.explanation.targetQuoteEn && (
                  <div className={styles.targetQuote}>
                    <strong>نقل قول صوتی در متن: </strong>"{ex.explanation.targetQuoteEn}"
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

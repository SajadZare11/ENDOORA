"use client";

import React, { useState } from "react";
import { PathUnit, BossQuestion } from "../../../lib/learning-path-storage";
import styles from "./learning-path.module.css";

interface BossGateModalProps {
  unit: PathUnit;
  isTestOut?: boolean;
  onClose: () => void;
  onPass: (scorePercent: number) => void;
}

export const BossGateModal: React.FC<BossGateModalProps> = ({
  unit,
  isTestOut = false,
  onClose,
  onPass,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scorePercent, setScorePercent] = useState(0);

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handlePlayAudio = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let correctCount = 0;
    unit.bossQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const percent = Math.round((correctCount / unit.bossQuestions.length) * 100);
    setScorePercent(percent);
    setIsSubmitted(true);

    if (percent >= 80) {
      onPass(percent);
    }
  };

  const allAnswered =
    unit.bossQuestions.length > 0 &&
    unit.bossQuestions.every((q) => selectedAnswers[q.id] !== undefined);

  const isPassed = scorePercent >= 80;

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true">
      <div className={styles.modalContent}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <span>{isTestOut ? "⚡" : "🛡️"}</span>
            <span>
              {isTestOut ? `آزمون جهش میانبر: ${unit.titleFa}` : `غول‌آزمون: ${unit.titleFa}`}
            </span>
          </h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="بستن">
            ×
          </button>
        </div>

        {/* Evaluation Result View */}
        {isSubmitted ? (
          <div className={styles.resultCard}>
            <div className={styles.resultIcon}>{isPassed ? "🎉" : "💪"}</div>
            <h3
              style={{
                fontSize: "1.4rem",
                fontWeight: 900,
                color: isPassed ? "#10b981" : "#ef4444",
                marginBottom: "0.5rem",
              }}
            >
              {isPassed ? "تبریک! دروازه با موفقیت فتح شد!" : "نیاز به تمرین و مرور بیشتر"}
            </h3>

            <div className={styles.resultScoreText} style={{ color: isPassed ? "#10b981" : "#ef4444" }}>
              %{scorePercent}
            </div>

            <div className={styles.resultStarsRow}>
              {scorePercent >= 95 ? "⭐⭐⭐" : scorePercent >= 85 ? "⭐⭐" : isPassed ? "⭐" : "❌"}
            </div>

            <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: 450, margin: "0 auto 1.5rem auto" }}>
              {isPassed
                ? isTestOut
                  ? "آفرین! با موفقیت تمام این یونیت را جهش کردی و یونیت بعدی برایت گشوده شد."
                  : "عالی بود! تمام مهارت‌های این یونیت را با نمره قبولی پشت سر گذاشتی."
                : "برای عبور از این دروازه به حداقل نمره ۸۰٪ نیاز داری. پاسخ‌های صحیح را در زیر مشاهده کن و دوباره تلاش کن."}
            </p>

            {/* Answer Explanations */}
            <div style={{ textAlign: "right", marginTop: "1.5rem" }}>
              <h4 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "1rem" }}>
                کالبدشکافی پاسخ‌های آزمون:
              </h4>
              {unit.bossQuestions.map((q, idx) => {
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className={styles.quizCard}
                    style={{
                      borderLeft: `4px solid ${isCorrect ? "#10b981" : "#ef4444"}`,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                      <span style={{ fontWeight: 800, fontSize: "0.85rem" }}>سوال {idx + 1}</span>
                      <span style={{ fontWeight: 800, color: isCorrect ? "#10b981" : "#ef4444", fontSize: "0.85rem" }}>
                        {isCorrect ? "✅ صحیح" : "❌ نادرست"}
                      </span>
                    </div>
                    <div className={styles.quizQuestionEn}>{q.questionTextEn}</div>
                    <p style={{ fontSize: "0.85rem", color: "#475569", margin: "0.25rem 0" }}>
                      <strong>پاسخ صحیح: </strong> {q.options[q.correctIndex]}
                    </p>
                    <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0, fontStyle: "italic" }}>
                      💡 {q.explanationFa}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.nextStepBtn}
                style={{ background: isPassed ? "#10b981" : "#2563eb" }}
                onClick={onClose}
              >
                <span>{isPassed ? "ورود به یونیت باز شده" : "متوجه شدم و بازگشت به نقشه"}</span>
                <span aria-hidden="true">←</span>
              </button>
            </div>
          </div>
        ) : (
          /* Question Form View */
          <form onSubmit={handleSubmit}>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginBlockEnd: "1.25rem" }}>
              به {unit.bossQuestions.length} سوال زیر پاسخ بده. برای عبور از این دروازه، کسب نمره حداقل
              ۸۰٪ الزامی است.
            </p>

            {unit.bossQuestions.map((q, idx) => (
              <div key={q.id} className={styles.quizCard}>
                <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#94a3b8", marginBottom: "0.25rem" }}>
                  سوال {idx + 1} از {unit.bossQuestions.length}
                </div>
                <div className={styles.quizQuestionFa}>{q.promptFa}</div>

                {q.audioSnippetTextEn && (
                  <div className={styles.audioBar}>
                    <button
                      type="button"
                      className={styles.playAudioBtn}
                      onClick={() => handlePlayAudio(q.audioSnippetTextEn!)}
                    >
                      <span>🔊 پخش صوت سوال</span>
                    </button>
                    <span style={{ fontSize: "0.75rem", color: "#2563eb" }}>
                      به فایل صوتی گوش بده و پاسخ درست را انتخاب کن.
                    </span>
                  </div>
                )}

                <div className={styles.quizQuestionEn}>{q.questionTextEn}</div>

                <div className={styles.optionsList}>
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[q.id] === optIdx;

                    return (
                      <label
                        key={optIdx}
                        className={`${styles.optionLabel} ${isSelected ? styles.optionSelected : ""}`}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={isSelected}
                          onChange={() => handleSelectOption(q.id, optIdx)}
                          style={{ margin: 0 }}
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.testOutBtn}
                style={{ borderColor: "#cbd5e1", color: "#64748b" }}
                onClick={onClose}
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={!allAnswered}
                className={styles.nextStepBtn}
                style={{
                  opacity: allAnswered ? 1 : 0.5,
                  cursor: allAnswered ? "pointer" : "not-allowed",
                }}
              >
                <span>ارزیابی پاسخ‌ها و ثبت نمره</span>
                <span aria-hidden="true">←</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

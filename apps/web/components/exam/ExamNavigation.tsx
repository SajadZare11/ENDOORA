"use client";

import React from "react";
import styles from "./exam.module.css";
import { Button } from "@endoora/ui";

interface ExamNavigationProps {
  totalQuestions: number;
  currentIndex: number;
  answeredIndices: Set<number>;
  onSelectQuestion: (index: number) => void;
  onSubmitExam: () => void;
  isSubmitting?: boolean;
  sequentialNavigation?: boolean;
}

export function ExamNavigation({
  totalQuestions,
  currentIndex,
  answeredIndices,
  onSelectQuestion,
  onSubmitExam,
  isSubmitting = false,
  sequentialNavigation = false,
}: ExamNavigationProps) {
  return (
    <aside className={styles.navSidebar}>
      <h3 className={styles.navTitle}>نقشه سوالات آزمون</h3>

      {sequentialNavigation && (
        <div
          style={{
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: "0.5rem",
            padding: "0.5rem 0.75rem",
            marginBottom: "0.75rem",
            fontSize: "0.75rem",
            color: "#92400e",
            fontWeight: 600,
            lineHeight: 1.5,
          }}
        >
          🔒 ناوبری یک‌طرفه فعال است؛ امکان بازگشت به سوالات قبل وجود ندارد.
        </div>
      )}

      <div className={styles.navGrid}>
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = answeredIndices.has(idx);
          const isLocked = sequentialNavigation && idx < currentIndex;
          const isFutureLocked = sequentialNavigation && idx > currentIndex;

          let btnClass = styles.navButton;
          if (isCurrent) {
            btnClass += ` ${styles.navCurrent}`;
          } else if (isAnswered) {
            btnClass += ` ${styles.navAnswered}`;
          }

          return (
            <button
              key={idx}
              type="button"
              className={btnClass}
              onClick={() => {
                if (sequentialNavigation) {
                  if (idx === currentIndex) return;
                  // In sequential mode, direct jumping is restricted
                  return;
                }
                onSelectQuestion(idx);
              }}
              disabled={isLocked || isFutureLocked}
              title={
                isLocked
                  ? "قفل شده (ناوبری یک‌طرفه)"
                  : `سوال ${idx + 1}${isAnswered ? " (پاسخ داده شده)" : ""}`
              }
              style={{
                opacity: isLocked ? 0.45 : isFutureLocked ? 0.65 : 1,
                cursor: sequentialNavigation ? (isCurrent ? "default" : "not-allowed") : "pointer",
                position: "relative",
              }}
              aria-label={`سوال ${idx + 1}${isAnswered ? " (پاسخ داده شده)" : ""}`}
            >
              {isLocked ? "🔒" : idx + 1}
            </button>
          );
        })}
      </div>

      <div className={styles.examControls}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", color: "#64748b", marginBottom: "0.5rem" }}>
          <span>پاسخ‌داده‌شده: {answeredIndices.size} از {totalQuestions}</span>
        </div>

        <Button
          type="button"
          onClick={onSubmitExam}
          disabled={isSubmitting}
          style={{ width: "100%", background: "#10b981", color: "#ffffff", fontWeight: 700 }}
        >
          {isSubmitting ? "در حال ثبت نهایی..." : "پایان و ارسال آزمون 📤"}
        </Button>
      </div>
    </aside>
  );
}

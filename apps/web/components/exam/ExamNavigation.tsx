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
}

export function ExamNavigation({
  totalQuestions,
  currentIndex,
  answeredIndices,
  onSelectQuestion,
  onSubmitExam,
  isSubmitting = false,
}: ExamNavigationProps) {
  return (
    <aside className={styles.navSidebar}>
      <h3 className={styles.navTitle}>نقشه سوالات آزمون</h3>

      <div className={styles.navGrid}>
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = answeredIndices.has(idx);

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
              onClick={() => onSelectQuestion(idx)}
              aria-label={`سوال ${idx + 1}${isAnswered ? " (پاسخ داده شده)" : ""}`}
            >
              {idx + 1}
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

"use client";

import React from "react";
import Link from "next/link";
import styles from "./video-learning.module.css";

export interface ModalResults {
  scores?: {
    phrase1?: number;
    phrase2?: number;
    speaking?: number;
    [key: string]: number | undefined;
  };
  totalScore: number;
  completedAt?: Date;
}

interface VideoCompletionModalProps {
  isOpen: boolean;
  results: ModalResults | null;
  lesson: {
    id: string;
    titleFa: string;
    level?: string;
  };
  onRetry: () => void;
  nextLessonHref?: string;
  nextLessonId?: string;
  onClose: () => void;
  watchPercentage?: number;
}

export default function VideoCompletionModal({
  isOpen,
  results,
  lesson,
  onRetry,
  nextLessonHref,
  nextLessonId,
  onClose,
  watchPercentage = 100,
}: VideoCompletionModalProps) {
  if (!isOpen || !results) return null;

  const totalScore = results.totalScore ?? 0;
  const isPassed = totalScore >= 70 && watchPercentage >= 80;

  const phrase1Score = results.scores?.phrase1;
  const phrase2Score = results.scores?.phrase2;

  return (
    <div className={styles.modalBackdrop} onClick={onClose} dir="rtl">
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalCelebrationIcon}>{isPassed ? "🎉" : "💡"}</div>

        <h2 className={styles.modalTitle}>
          {isPassed ? "تبریک! ارزیابی مکالمه و تلفظ با موفقیت تکمیل شد" : "نیاز به تمرین و مرور مجدد اسپیکینگ"}
        </h2>
        <p className={styles.modalSubtitle}>
          {isPassed
            ? `شما ۲ اصطلاح مهم کاربردی ویدیوی «${lesson.titleFa}» را با دقت و تلفظ عالی تکرار کردید و ویدیوی بعدی برای شما باز شد.`
            : `برای باز شدن ویدیوی بعدی، حداقل نمره ۷۰٪ در ارزیابی اسپیکینگ و تماشای حداقل ۸۰٪ از ویدیو الزامی است. شما می‌توانید مجدداً تمرین کنید.`}
        </p>

        {/* Score & Watch Percentage Banner */}
        <div className={styles.modalScoreBanner}>
          <div className={styles.modalScoreItem}>
            <span
              className={styles.modalScoreVal}
              style={{ color: totalScore >= 70 ? "#10b981" : "#ef4444" }}
            >
              {totalScore}٪
            </span>
            <span className={styles.modalScoreSub}>میانگین نمره اسپیکینگ</span>
          </div>

          <div style={{ width: "1px", height: "2.5rem", background: "#bfdbfe" }} />

          <div className={styles.modalScoreItem}>
            <span
              className={styles.modalScoreVal}
              style={{ color: watchPercentage >= 80 ? "#2563eb" : "#f59e0b" }}
            >
              {watchPercentage}٪
            </span>
            <span className={styles.modalScoreSub}>درصد تماشای ویدیو</span>
          </div>

          <div style={{ width: "1px", height: "2.5rem", background: "#bfdbfe" }} />

          <div className={styles.modalScoreItem}>
            <span className={styles.modalScoreVal} style={{ color: isPassed ? "#10b981" : "#94a3b8" }}>
              {isPassed ? "+150 XP" : "—"}
            </span>
            <span className={styles.modalScoreSub}>امتیاز تجربه</span>
          </div>
        </div>

        {/* Speaking Phrases Breakdown */}
        {phrase1Score !== undefined && phrase2Score !== undefined && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
              margin: "1rem 0 1.25rem",
            }}
          >
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "0.75rem 1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>🗣️</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b" }}>اصطلاح اول:</span>
              </div>
              <strong style={{ color: phrase1Score >= 70 ? "#15803d" : "#b91c1c", fontSize: "1rem" }}>
                {phrase1Score}٪
              </strong>
            </div>

            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "0.75rem 1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>🗣️</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b" }}>اصطلاح دوم:</span>
              </div>
              <strong style={{ color: phrase2Score >= 70 ? "#15803d" : "#b91c1c", fontSize: "1rem" }}>
                {phrase2Score}٪
              </strong>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className={styles.modalActionsRow}>
          <button
            type="button"
            className={styles.modalBtnSecondary}
            onClick={onRetry}
          >
            ↺ تمرین مجدد اسپیکینگ
          </button>

          {isPassed && (nextLessonHref || nextLessonId) ? (
            <Link
              href={nextLessonHref || `/learn/video/${nextLessonId}`}
              className={styles.modalBtnPrimary}
            >
              <span>مشاهده ویدیوی بعدی</span>
              <span>←</span>
            </Link>
          ) : (
            <Link
              href={lesson.level ? `/learn/video/${lesson.level}` : "/learn?tab=video"}
              className={styles.modalBtnPrimary}
            >
              <span>بازگشت به فهرست درس‌ها</span>
              <span>←</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

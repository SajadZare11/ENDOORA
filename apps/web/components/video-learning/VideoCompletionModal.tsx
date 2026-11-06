"use client";

import React from "react";
import Link from "next/link";
import { SKILLS_META, SkillType } from "@/lib/video-learning";
import { SkillQuizResults } from "./SixSkillQuiz";
import styles from "./video-learning.module.css";

interface VideoCompletionModalProps {
  isOpen: boolean;
  results: SkillQuizResults | null;
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

const ORDERED_SKILLS: SkillType[] = [
  "listening",
  "vocabulary",
  "grammar",
  "speaking",
  "reading",
  "writing",
];

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

  const isPassed = results.totalScore >= 70 && watchPercentage >= 80;

  return (
    <div className={styles.modalBackdrop} onClick={onClose} dir="rtl">
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalCelebrationIcon}>{isPassed ? "🎉" : "💡"}</div>

        <h2 className={styles.modalTitle}>
          {isPassed ? "تبریک! ویدیوی آموزشی با موفقیت تکمیل شد" : "نیاز به تمرین و مرور مجدد"}
        </h2>
        <p className={styles.modalSubtitle}>
          {isPassed
            ? `شما هر ۶ مهارت زبانی را بر اساس محتوای «${lesson.titleFa}» با موفقیت تمرین کردید و ویدیوی بعدی برای شما باز شد.`
            : `برای باز شدن ویدیوی بعدی، حداقل نمره ۷۰٪ در آزمون و تماشای ۸۰٪ از ویدیو الزامی است. شما می‌توانید مجدداً تمرین کنید.`}
        </p>

        {/* Score & Watch Percentage Banner */}
        <div className={styles.modalScoreBanner}>
          <div className={styles.modalScoreItem}>
            <span
              className={styles.modalScoreVal}
              style={{ color: results.totalScore >= 70 ? "#10b981" : "#ef4444" }}
            >
              {results.totalScore}٪
            </span>
            <span className={styles.modalScoreSub}>میانگین نمره آزمون</span>
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

        {/* 6-Skill Breakdown */}
        <div className={styles.skillsBreakdownGrid}>
          {ORDERED_SKILLS.map((skill) => {
            const meta = SKILLS_META[skill];
            const score = results.scores[skill] ?? 0;
            return (
              <div key={skill} className={styles.skillResultPill}>
                <span className={styles.skillResultTitle}>
                  <span>{meta.icon}</span>
                  <span>{meta.titleFa}</span>
                </span>
                <span
                  className={styles.skillResultStatus}
                  style={{
                    color: score >= 70 ? "#10b981" : "#ef4444",
                  }}
                >
                  {score}٪
                </span>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className={styles.modalActionsRow}>
          <button
            type="button"
            className={styles.modalBtnSecondary}
            onClick={onRetry}
          >
            ↺ آزمون مجدد
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

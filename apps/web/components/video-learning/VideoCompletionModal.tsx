"use client";

import React from "react";
import Link from "next/link";
import { VideoLesson, SKILLS_META, SkillType } from "@/lib/video-learning";
import { SkillQuizResults } from "./SixSkillQuiz";
import styles from "./video-learning.module.css";

interface VideoCompletionModalProps {
  isOpen: boolean;
  results: SkillQuizResults | null;
  lesson: VideoLesson;
  onRetry: () => void;
  nextLessonId?: string;
  onClose: () => void;
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
  nextLessonId,
  onClose,
}: VideoCompletionModalProps) {
  if (!isOpen || !results) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalCelebrationIcon}>🎉</div>

        <h2 className={styles.modalTitle}>تبریک! ویدیوی آموزشی تکمیل شد</h2>
        <p className={styles.modalSubtitle}>
          شما تمام ۶ مهارت زبانی را بر اساس محتوای «{lesson.titleFa}» با موفقیت تمرین کردید.
        </p>

        {/* Score & XP Banner */}
        <div className={styles.modalScoreBanner}>
          <div className={styles.modalScoreItem}>
            <span className={styles.modalScoreVal}>{results.totalScore}٪</span>
            <span className={styles.modalScoreSub}>میانگین نمره کل</span>
          </div>

          <div
            style={{ width: "1px", height: "2.5rem", background: "#bfdbfe" }}
          />

          <div className={styles.modalScoreItem}>
            <span className={styles.modalScoreVal} style={{ color: "#10b981" }}>
              +150 XP
            </span>
            <span className={styles.modalScoreSub}>امتیاز تجربه کسب‌شده</span>
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
            ↺ تمرین مجدد
          </button>

          {nextLessonId ? (
            <Link
              href={`/learn/video/${nextLessonId}`}
              className={styles.modalBtnPrimary}
            >
              <span>درس بعدی</span>
              <span>←</span>
            </Link>
          ) : (
            <Link href="/learn/video" className={styles.modalBtnPrimary}>
              <span>فهرست ویدیوها</span>
              <span>←</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

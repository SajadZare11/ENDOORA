"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LearnerPathProgress,
  getNextBestNode,
  PathUnit,
  PathNode,
  CURRICULUM_UNITS,
} from "../../../lib/learning-path-storage";
import styles from "./learning-path.module.css";

interface PathHeroBannerProps {
  progress: LearnerPathProgress;
  onSelectNode?: (nodeId: string, unitId: string) => void;
  onStartNode?: (node: PathNode, unit: PathUnit) => void;
  onResetProgress?: () => void;
  onUnlockAll?: () => void;
}

const TIER_NAMES: Record<string, string> = {
  A1: "مقدماتی (Breakthrough)",
  A2: "پیش‌متوسط (Waystage)",
  B1: "متوسط (Threshold)",
  B2: "فوق‌متوسط (Vantage)",
  C1: "پیشرفته و آیلتس ۷.۵+ (Mastery)",
};

export const PathHeroBanner: React.FC<PathHeroBannerProps> = ({
  progress,
  onSelectNode,
  onStartNode,
  onResetProgress,
  onUnlockAll,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const nextStep = getNextBestNode(progress);

  // Determine current active level tier
  let activeTier = "A1";
  for (const u of CURRICULUM_UNITS) {
    if (progress.unlockedUnitIds.includes(u.id)) {
      activeTier = u.tier;
    }
  }

  // Count total stars
  const totalStars = Object.values(progress.nodeStars).reduce((acc, curr) => acc + curr, 0);

  // Overall CEFR progression
  const totalNodes = CURRICULUM_UNITS.reduce((sum, u) => sum + u.nodes.length, 0);
  const completedCount = progress.completedNodeIds.length;
  const overallPercent = Math.min(100, Math.round((completedCount / (totalNodes || 1)) * 100));

  const handleNextClick = () => {
    if (!nextStep) return;
    if (onStartNode) {
      onStartNode(nextStep.node, nextStep.unit);
    } else if (onSelectNode) {
      onSelectNode(nextStep.node.id, nextStep.unit.id);
    }
  };

  return (
    <div className={styles.heroBanner}>
      <div className={styles.heroContent}>
        {/* Top Badges Row */}
        <div className={styles.heroBadgeRow}>
          <span className={styles.cefrLevelPill}>
            <span>🏆</span>
            <span>
              سطح فعلی: {activeTier} ({TIER_NAMES[activeTier] || activeTier})
            </span>
          </span>

          <span className={styles.streakPill}>
            <span>🔥</span>
            <span>{progress.currentStreak} روز تداوم</span>
          </span>

          <span
            className={styles.streakPill}
            style={{
              borderColor: "#10b981",
              color: "#34d399",
              background: "rgba(16, 185, 129, 0.15)",
            }}
          >
            <span>⭐</span>
            <span>{totalStars} ستاره تسلط</span>
          </span>

          <span
            className={styles.streakPill}
            style={{
              borderColor: "#8b5cf6",
              color: "#a78bfa",
              background: "rgba(139, 92, 246, 0.15)",
            }}
          >
            <span>⚡</span>
            <span>{progress.totalXp} XP</span>
          </span>
        </div>

        {/* Title & Subtitle */}
        <h1 className={styles.heroTitle}>مرکز جامع و درخت مهارت‌های یادگیری CEFR</h1>
        <p className={styles.heroSub}>
          مسیر پیوسته از مکالمه پایه (A1) تا تسلط آکادمیک (C1) با ۱۵ یونیت آموزشی، دروازه‌های چالش‌برانگیز غول‌آزمون و تثبیت در جعبه ۵ خانه‌ای لایتنر.
        </p>

        {/* Overall Progress Meter */}
        <div style={{ marginBlockStart: "1.25rem", maxWidth: "480px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.8rem",
              color: "#94a3b8",
              marginBlockEnd: "0.4rem",
              fontWeight: 700,
            }}
          >
            <span>پیشرفت کل در مسیر استقرایی CEFR</span>
            <span style={{ color: "#38bdf8" }}>
              {completedCount} از {totalNodes} مرحله ({overallPercent}٪)
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: "8px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "9999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${overallPercent}%`,
                height: "100%",
                background: "linear-gradient(90deg, #2563eb, #38bdf8, #10b981)",
                borderRadius: "9999px",
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>

        {/* Management & Testing Tools Bar */}
        <div className={styles.heroToolsRow}>
          <span className={styles.heroToolsLabel}>ابزارهای پیشرفت:</span>

          {!showConfirmReset ? (
            <button
              type="button"
              className={styles.toolPillBtn}
              onClick={() => setShowConfirmReset(true)}
              title="بازنشانی تمام مراحل و ستاره‌ها به نقطه آغاز"
            >
              <span>🔄</span>
              <span>بازنشانی پیشرفت (Reset)</span>
            </button>
          ) : (
            <div className={styles.confirmResetGroup}>
              <span className={styles.confirmResetText}>پیشرفت ریست شود؟</span>
              <button
                type="button"
                className={styles.confirmResetYesBtn}
                onClick={() => {
                  setShowConfirmReset(false);
                  if (onResetProgress) onResetProgress();
                }}
              >
                بله، بازنشانی
              </button>
              <button
                type="button"
                className={styles.confirmResetNoBtn}
                onClick={() => setShowConfirmReset(false)}
              >
                انصراف
              </button>
            </div>
          )}

          {onUnlockAll && (
            <button
              type="button"
              className={styles.toolPillBtn}
              onClick={onUnlockAll}
              title="باز کردن تمام ۱۵ یونیت و ۷۵ مرحله جهت تست و ارزیابی"
            >
              <span>🔓</span>
              <span>حالت تست (آنلاک همه)</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Box: Next Step CTA & Video Courses Link */}
      <div className={styles.nextStepActionBox}>
        {nextStep ? (
          <>
            <button
              type="button"
              className={styles.nextStepBtn}
              onClick={handleNextClick}
            >
              <span>{nextStep.node.icon}</span>
              <span>ادامه یادگیری: {nextStep.node.titleFa}</span>
              <span aria-hidden="true">←</span>
            </button>
            <span className={styles.nextStepHint}>
              {nextStep.unit.titleFa} • مرحله {nextStep.orderInUnit} از ۵
            </span>
          </>
        ) : (
          <span className={styles.nextStepBtn} style={{ background: "#10b981" }}>
            <span>👑</span>
            <span>تبریک! تمام گره‌ها با موفقیت فتح شده‌اند</span>
          </span>
        )}

        {/* Link to Video Courses Hub */}
        <Link href="/learn/video" className={styles.videoHubLink}>
          <span>🎬</span>
          <span>مشاهده دوره‌های ویدیویی (Speakout & AEF) ←</span>
        </Link>
      </div>
    </div>
  );
};

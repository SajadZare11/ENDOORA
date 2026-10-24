"use client";

import React from "react";
import Link from "next/link";
import {
  LearnerPathProgress,
  getNextBestNode,
  PathUnit,
  CURRICULUM_UNITS,
} from "../../../lib/learning-path-storage";
import styles from "./learning-path.module.css";

interface PathHeroBannerProps {
  progress: LearnerPathProgress;
  onSelectNode?: (nodeId: string, unitId: string) => void;
}

export const PathHeroBanner: React.FC<PathHeroBannerProps> = ({ progress, onSelectNode }) => {
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

  return (
    <div className={styles.heroBanner}>
      <div className={styles.heroContent}>
        <div className={styles.heroBadgeRow}>
          <span className={styles.cefrLevelPill}>
            <span>🏆</span>
            <span>سطح فعلی: {activeTier}</span>
          </span>
          <span className={styles.streakPill}>
            <span>🔥</span>
            <span>{progress.currentStreak} روز رگه پیوسته</span>
          </span>
          <span className={styles.streakPill} style={{ borderColor: "#10b981", color: "#34d399" }}>
            <span>⭐</span>
            <span>{totalStars} ستاره تسلط</span>
          </span>
          <span className={styles.streakPill} style={{ borderColor: "#8b5cf6", color: "#a78bfa" }}>
            <span>⚡</span>
            <span>{progress.totalXp} XP</span>
          </span>
        </div>

        <h1 className={styles.heroTitle}>نقشه راه جامع و درخت مهارت‌های تسلط (Master Path)</h1>
        <p className={styles.heroSub}>
          مسیر پیوسته از مقدماتی تا آیلتس ۸.۵ با گذر از ۱۵ یونیت، دروازه‌های چالش‌برانگیز غول‌آزمون و
          تثبیت دائمی در جعبه ۵ خانه‌ای لایتنر.
        </p>
      </div>

      <div className={styles.nextStepActionBox}>
        {nextStep ? (
          <>
            <Link
              href={nextStep.node.deepLinkHref}
              className={styles.nextStepBtn}
              onClick={() => {
                if (onSelectNode) {
                  onSelectNode(nextStep.node.id, nextStep.unit.id);
                }
              }}
            >
              <span>{nextStep.node.icon}</span>
              <span>ادامه مسیر: {nextStep.node.titleFa}</span>
              <span aria-hidden="true">←</span>
            </Link>
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
      </div>
    </div>
  );
};

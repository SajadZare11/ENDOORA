"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CEFRLevel,
  LeitnerBoxLevel,
  CEFRLevelStats,
  LEITNER_BOX_META,
  CEFR_LEVELS_META,
} from "../../../data/cefr/types";
import {
  getActiveCefrLevel,
  getLevelStats,
  getNextAvailableLesson,
} from "../../../lib/cefr-leitner-storage";
import styles from "./leitner.module.css";

export interface LeitnerShelfProps {
  level?: CEFRLevel;
  stats?: CEFRLevelStats;
  nextLessonIndex?: number;
  onStartNewLesson?: () => void;
  onStartDueReview?: () => void;
  onScrollToWordlist?: () => void;
}

const BOX_LEVELS: LeitnerBoxLevel[] = [1, 2, 3, 4, 5];

export const LeitnerShelf: React.FC<LeitnerShelfProps> = ({
  level: propLevel,
  stats: propStats,
  nextLessonIndex: propNextLessonIndex,
  onStartNewLesson,
  onStartDueReview,
  onScrollToWordlist,
}) => {
  const router = useRouter();
  const [internalLevel, setInternalLevel] = useState<CEFRLevel>("A1");
  const [internalStats, setInternalStats] = useState<CEFRLevelStats | null>(null);

  useEffect(() => {
    if (!propLevel) {
      const active = getActiveCefrLevel();
      setInternalLevel(active);
      setInternalStats(getLevelStats(active));
    }
  }, [propLevel]);

  const level = propLevel || internalLevel;
  const stats =
    propStats ||
    internalStats ||
    getLevelStats(level);

  const nextLessonIndex =
    propNextLessonIndex ?? getNextAvailableLesson(level).lessonIndex;

  const meta = CEFR_LEVELS_META[level] || CEFR_LEVELS_META["A1"];

  const handleNewLesson = () => {
    if (onStartNewLesson) {
      onStartNewLesson();
    } else {
      router.push("/leitner");
    }
  };

  const handleDueReview = () => {
    if (onStartDueReview) {
      onStartDueReview();
    } else {
      router.push("/leitner");
    }
  };

  return (
    <div className={styles.shelfContainer} aria-label={`جعبه ۵ خانه‌ای لایتنر سطح ${level}`}>
      {/* Header */}
      <div className={styles.shelfHeader}>
        <div className={styles.shelfTitleGroup}>
          <span className={styles.shelfIcon} role="img" aria-label="قفسه لایتنر">
            🗃️
          </span>
          <div>
            <h2 className={styles.shelfTitle}>
              جعبه ۵ خانه‌ای لایتنر واژگان {meta.titleFa} ({level})
            </h2>
            <p className={styles.shelfSubtitle}>
              انتقال فعال کلمات با تدریس استقرایی و فواصل زمانی علمی (۱، ۳، ۷، ۱۴ و ۳۰ روز) به حافظه پایدار
            </p>
          </div>
        </div>

        <div className={styles.shelfActions}>
          <button
            type="button"
            className={styles.startLessonButton}
            onClick={handleNewLesson}
          >
            🚀 شروع درس جدید (درس {nextLessonIndex})
          </button>
        </div>
      </div>

      {/* Due Today Notification Banner */}
      <div
        className={`${styles.dueTodayBanner} ${
          stats.dueTodayCount > 0 ? styles.dueBannerActive : styles.dueBannerCalm
        }`}
      >
        <div className={styles.dueTodayInfo}>
          <span className={styles.dueTodayIcon}>
            {stats.dueTodayCount > 0 ? "⚡" : "✨"}
          </span>
          <div>
            <h4 className={styles.dueTodayTitle}>
              {stats.dueTodayCount > 0
                ? `${stats.dueTodayCount} کارت آماده مرور برای امروز در سطح ${level}!`
                : `همه کارت‌های امروز سطح ${level} مرور شده‌اند!`}
            </h4>
            <p className={styles.dueTodayDesc}>
              {stats.dueTodayCount > 0
                ? "برای تثبیت واژه‌ها در حافظه بلندمدت و جلوگیری از فراموشی، مرور با بازیابی فعال را آغاز کنید."
                : "عالی است! می‌توانید یک درس ۱۰ واژه‌ای جدید شروع کنید یا کلمات را در جدول زیر کاوش نمایید."}
            </p>
          </div>
        </div>

        <div className={styles.dueTodayActions}>
          {stats.dueTodayCount > 0 ? (
            <button
              type="button"
              className={styles.dueReviewActionBtn}
              onClick={handleDueReview}
            >
              شروع مرور کارت‌های امروز ({stats.dueTodayCount}) ⚡
            </button>
          ) : (
            <button
              type="button"
              className={styles.dueLessonActionBtn}
              onClick={handleNewLesson}
            >
              شروع درس بعدی 🚀
            </button>
          )}
        </div>
      </div>

      {/* 5-Boxes Shelf Grid */}
      <div className={styles.boxesGrid} role="list" aria-label="خانه‌های ۵گانه جعبه لایتنر">
        {BOX_LEVELS.map((boxNum) => {
          const bMeta = LEITNER_BOX_META[boxNum];
          const count = stats.boxCounts[boxNum] || 0;

          return (
            <div
              key={boxNum}
              className={styles.boxCard}
              style={{
                borderColor: count > 0 ? bMeta.color : undefined,
              }}
              role="listitem"
            >
              <div
                className={styles.boxCardHeader}
                style={{ backgroundColor: `${bMeta.color}15`, color: bMeta.color }}
              >
                <span className={styles.boxNumberBadge}>{boxNum}</span>
                <span className={styles.boxIcon}>{bMeta.icon}</span>
              </div>

              <div className={styles.boxCardBody}>
                <h4 className={styles.boxTitle}>{bMeta.labelFa}</h4>
                <div className={styles.boxCountRow}>
                  <span
                    className={styles.boxCountNumber}
                    style={{ color: count > 0 ? bMeta.color : undefined }}
                  >
                    {count}
                  </span>
                  <span className={styles.boxCountUnit}>کارت</span>
                </div>
                <span className={styles.boxIntervalText}>{bMeta.intervalDescFa}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Summary Bar */}
      <div className={styles.shelfFooterSummary}>
        <div className={styles.summaryStatItem}>
          <span className={styles.summaryLabel}>کل واژگان سطح {level}:</span>
          <span className={styles.summaryValue}>{stats.totalWords} واژه</span>
        </div>
        <div className={styles.summaryStatItem}>
          <span className={styles.summaryLabel}>کلمات واردشده به لایتنر:</span>
          <span className={styles.summaryValue}>{stats.learnedCount} واژه</span>
        </div>
        <div className={styles.summaryStatItem}>
          <span className={styles.summaryLabel}>کلمات فتح‌شده طلایی (خانه ۵):</span>
          <span className={styles.summaryValue} style={{ color: "#10b981", fontWeight: 700 }}>
            {stats.masteredCount} واژه
          </span>
        </div>
        <div className={styles.summaryStatItem}>
          <span className={styles.summaryLabel}>درصد تسلط کلی:</span>
          <span className={styles.summaryValue}>{stats.progressPercentage}%</span>
        </div>
      </div>
    </div>
  );
};

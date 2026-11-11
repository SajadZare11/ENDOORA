"use client";

import React from "react";
import {
  CEFRLevel,
  CEFRLevelStats,
  CEFR_LEVELS_META,
} from "../../../data/cefr/types";
import styles from "./leitner.module.css";

interface LeitnerLevelSelectorProps {
  activeLevel: CEFRLevel;
  onSelectLevel: (level: CEFRLevel) => void;
  levelsStats: Record<CEFRLevel, CEFRLevelStats>;
}

const ORDERED_LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const LeitnerLevelSelector: React.FC<LeitnerLevelSelectorProps> = ({
  activeLevel,
  onSelectLevel,
  levelsStats,
}) => {
  return (
    <div className={styles.levelSelectorContainer} aria-label="انتخاب سطح زبانی CEFR">
      <div className={styles.levelSelectorHeader}>
        <div>
          <h3 className={styles.levelSelectorTitle}>سطوح استاندارد واژگان اروپایی (CEFR)</h3>
          <p className={styles.levelSelectorSubtitle}>
            سطح مورد نظر خود را برای یادگیری و مرور کلمات در جعبه‌های ۵گانه لایتنر انتخاب کنید
          </p>
        </div>
      </div>

      <div className={styles.levelCardsGrid}>
        {ORDERED_LEVELS.map((lvl) => {
          const meta = CEFR_LEVELS_META[lvl];
          const stat = levelsStats[lvl] || {
            totalWords: 0,
            learnedCount: 0,
            dueTodayCount: 0,
            progressPercentage: 0,
          };
          const isActive = activeLevel === lvl;

          return (
            <button
              key={lvl}
              type="button"
              className={`${styles.levelCard} ${isActive ? styles.levelCardActive : ""}`}
              onClick={() => onSelectLevel(lvl)}
              style={
                isActive
                  ? {
                      borderColor: meta.badgeColor,
                      boxShadow: `0 6px 20px ${meta.badgeColor}25`,
                    }
                  : undefined
              }
              aria-pressed={isActive}
            >
              <div className={styles.levelCardTop}>
                <div className={styles.levelBadge} style={{ backgroundColor: `${meta.badgeColor}15`, color: meta.badgeColor }}>
                  <span className={styles.levelIcon}>{meta.icon}</span>
                  <span className={styles.levelCode}>{lvl}</span>
                </div>
                {stat.dueTodayCount > 0 && (
                  <span className={styles.levelDueBadge} title={`${stat.dueTodayCount} کارت آماده مرور`}>
                    {stat.dueTodayCount} مرور
                  </span>
                )}
              </div>

              <div className={styles.levelInfo}>
                <h4 className={styles.levelTitleFa}>{meta.titleFa}</h4>
                <span className={styles.levelTitleEn}>{meta.titleEn}</span>
                <p className={styles.levelDesc}>{meta.descriptionFa}</p>
              </div>

              <div className={styles.levelProgressContainer}>
                <div className={styles.levelProgressStats}>
                  <span>
                    <strong>{stat.learnedCount}</strong> از {stat.totalWords} واژه
                  </span>
                  <span className={styles.levelPercentage}>{stat.progressPercentage}%</span>
                </div>
                <div className={styles.levelProgressBar}>
                  <div
                    className={styles.levelProgressFill}
                    style={{
                      width: `${stat.progressPercentage}%`,
                      backgroundColor: meta.badgeColor,
                    }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

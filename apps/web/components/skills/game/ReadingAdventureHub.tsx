"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./reading-adventure.module.css";
import type { CefrLevel } from "../../../data/skills/games/types";
import type { AdventureStory } from "../../../data/skills/games/reading-adventure-types";
import { getLevelAdventureStories } from "../../../data/skills/games/adventures";
import {
  getAdventureProgress,
  getDefaultAdventureProgress,
} from "../../../lib/skills/reading-adventure-storage";
import { ReadingAdventureArena } from "./ReadingAdventureArena";

interface Props {
  cefr: CefrLevel;
  onRefreshParent?: () => void;
}

export function ReadingAdventureHub({ cefr, onRefreshParent }: Props) {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [progress, setProgress] = useState(getDefaultAdventureProgress());
  const [activeStory, setActiveStory] = useState<AdventureStory | null>(null);

  const stories = getLevelAdventureStories(cefr);

  const refreshProgress = () => {
    const current = getAdventureProgress(cefr);
    setProgress(current);
  };

  useEffect(() => {
    setIsMounted(true);
    refreshProgress();
  }, [cefr]);

  const effectiveProgress = isMounted ? progress : getDefaultAdventureProgress();
  const completedCount = effectiveProgress.completedStoryIds.length;
  const isLevelPassed = completedCount >= 2;

  return (
    <div className={styles.hubContainer}>
      {/* LEVEL PROGRESS BANNER (2 of 5 to pass) */}
      <div className={styles.levelProgressBanner}>
        <div className={styles.bannerTitleArea}>
          <div className={styles.bannerIcon}>{isLevelPassed ? "🌟" : "📖"}</div>
          <div className={styles.bannerText}>
            <h3>
              ماجراجویی‌های ریدینگ سطح {cefr}{" "}
              {isLevelPassed ? "• سطح با موفقیت فتح شد!" : `• قانون عبور: تکمیل ۲ از ${stories.length} داستان`}
            </h3>
            <p>
              {isLevelPassed
                ? `آفرین قهرمان! تا الان ${completedCount} ماجراجویی از ${stories.length} داستان رو تموم کردی و سطح بعدی برات باز شد!`
                : `با انتخاب و اتمام هر داستان، به یکی از ۳۲ پایان هیجان‌انگیز می‌رسی. برای فتح سطح، حداقل ۲ داستان رو تموم کن.`}
            </p>
          </div>
        </div>

        <div className={styles.bannerProgressBar}>
          <div className={styles.meterTrack}>
            <div
              className={styles.meterFill}
              style={{ width: `${Math.min(100, (completedCount / 2) * 100)}%` }}
            />
          </div>
          <span style={{ fontSize: "0.88rem", fontWeight: 800, color: isLevelPassed ? "#10b981" : "#64748b" }}>
            {Math.min(2, completedCount)} از ۲ تکمیل شد
          </span>
        </div>
      </div>

      {/* 5 ADVENTURE CARDS GRID */}
      <div className={styles.cardsGrid}>
        {stories.map((story) => {
          const isDone = effectiveProgress.completedStoryIds.includes(story.id);
          const discoveredEndings = effectiveProgress.discoveredEndingsByStory[story.id] || [];

          return (
            <div key={story.id} className={styles.adventureCard}>
              {/* IMAGE COVER */}
              <div className={styles.cardImageWrapper}>
                <Image
                  src={story.coverImage}
                  alt={story.titleFa}
                  fill
                  className={styles.cardImage}
                  sizes="(max-width: 768px) 100vw, 360px"
                  unoptimized
                />

                {/* Genre Tag */}
                <div className={styles.genreBadge}>{story.genreLabelFa}</div>

                {/* Done Badge */}
                {isDone && (
                  <div className={styles.doneBadge}>
                    <span>✅</span>
                    <span>انجام شد / Done</span>
                  </div>
                )}
              </div>

              {/* CARD BODY */}
              <div className={styles.cardBody}>
                <div className={styles.cardTitles}>
                  <h4>{story.titleFa}</h4>
                  <span>{story.titleEn}</span>
                </div>

                <p className={styles.synopsisText}>{story.synopsisFa}</p>

                {/* FOOTER */}
                <div className={styles.cardFooter}>
                  <div className={styles.endingsBadge} title="تعداد رازها و پایان‌های کشف‌شده این داستان">
                    <span>🏆</span>
                    <span>{discoveredEndings.length} از ۳۲ پایان کشف شد</span>
                  </div>

                  <button
                    type="button"
                    className={`${styles.startBtn} ${isDone ? styles.startBtnDone : ""}`}
                    onClick={() => setActiveStory(story)}
                  >
                    {isDone ? "🔄 کشف پایان‌های دیگر" : "🚀 بزن بریم توی قصه!"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTIVE ADVENTURE ARENA MODAL */}
      {activeStory && (
        <ReadingAdventureArena
          story={activeStory}
          cefr={cefr}
          onClose={() => {
            setActiveStory(null);
            refreshProgress();
            if (onRefreshParent) onRefreshParent();
          }}
          onCompleted={() => {
            refreshProgress();
            if (onRefreshParent) onRefreshParent();
          }}
        />
      )}
    </div>
  );
}

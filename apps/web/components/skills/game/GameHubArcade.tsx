"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./skills-game.module.css";
import { CefrLevel, SkillKey, GameLevel } from "../../../data/skills/games/types";
import { getSkillLevels, getSkillLevel } from "../../../data/skills/games/game-data";
import {
  loadAllSkillsProgress,
  calculateGrandTotalXp,
  calculateTotalStars,
} from "../../../lib/skills/game-storage";
import { GameArena } from "./GameArena";
import { VocabTimeAttackArena } from "./VocabTimeAttackArena";
import { WordCascadeArena } from "./WordCascadeArena";
import { SpeedDialogueArena } from "./SpeedDialogueArena";
import { GrammarHexArena } from "./GrammarHexArena";
import { SpeakingEscapeRoomArena } from "./SpeakingEscapeRoomArena";
import { SkillsLeaderboardModal } from "./SkillsLeaderboardModal";

interface SkillCardMeta {
  key: SkillKey;
  icon: string;
  titleFa: string;
  titleEn: string;
  gameName: string;
  descFa: string;
}

const SKILL_METAS: SkillCardMeta[] = [
  {
    key: "vocabulary",
    icon: "📚",
    titleFa: "واژگان و کلمات",
    titleEn: "Vocabulary",
    gameName: "Word Cascade (آبشار کلمات ۱۰ مرحله‌ای)",
    descFa: "چالش ۱۰ مرحله‌ای تطابق کلمات با جابجایی و شافل تایل‌ها در هر انتخاب، رنگ‌آمیزی متمایز و سختی تصاعدی زمان برای تمام سطوح A1 تا C2.",
  },
  {
    key: "grammar",
    icon: "⚡",
    titleFa: "گرامر و ساختار",
    titleEn: "Grammar",
    gameName: "Hex Wire Routing (سیم‌کشی شش‌ضلعی نحو)",
    descFa: "مسیریابی یال‌محور روی شبکه ۱۲ شش‌ضلعی با جریان سبز الکتریکی، تله‌های خطای فارسی (L1 Traps) و مسابقه سیم‌کشی همزمان بر اساس American English File.",
  },
  {
    key: "listening",
    icon: "🎧",
    titleFa: "شنیداری و صوت",
    titleEn: "Listening",
    gameName: "Audio Detective",
    descFa: "درک گفتار طبیعی و رمزگشایی جزئیات صوتی با موتور تلفظ مرورگر.",
  },
  {
    key: "reading",
    icon: "📖",
    titleFa: "خواندن و درک مطلب",
    titleEn: "Reading",
    gameName: "Speed Reader Sprint",
    descFa: "تندخوانی متون کوتاه سطح‌بندی شده و پاسخ به معماهای محتوایی.",
  },
  {
    key: "writing",
    icon: "✍️",
    titleFa: "نگارش و رایتینگ",
    titleEn: "Writing",
    gameName: "Sentence Smith",
    descFa: "نشانه‌گذاری، تصحیح املا و اتصال ایده‌ها با حروف ربط در قالب بازی.",
  },
  {
    key: "speaking",
    icon: "🎙️",
    titleFa: "مکالمه و گفتار",
    titleEn: "Speaking",
    gameName: "Voice Escape Room (اتاق فرار صوتی AEF)",
    descFa: "توی اتاق فرار قفل شدی! اشیای اتاق رو بگرد، با مکالمه درست انگلیسی قفل‌ها رو وا کن و قبل از تموم شدن وقت بزن بیرون!",
  },
];

const CEFR_LEVELS: { id: CefrLevel; labelFa: string; descFa: string }[] = [
  { id: "A1", labelFa: "سطح A1", descFa: "مقدماتی پایه" },
  { id: "A2", labelFa: "سطح A2", descFa: "پیش‌متوسطه" },
  { id: "B1", labelFa: "سطح B1", descFa: "متوسط کاربردی" },
  { id: "B2", labelFa: "سطح B2", descFa: "بالاتر از متوسط" },
  { id: "C1", labelFa: "سطح C1", descFa: "پیشرفته تسلط" },
  { id: "C2", labelFa: "سطح C2", descFa: "استادی زبان" },
];

export function GameHubArcade() {
  const [selectedCefr, setSelectedCefr] = useState<CefrLevel>("A1");
  const [activeLevel, setActiveLevel] = useState<GameLevel | null>(null);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [leaderboardSkill, setLeaderboardSkill] = useState<SkillKey>("grammar");
  const [totalXp, setTotalXp] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [skillsProgress, setSkillsProgress] = useState(loadAllSkillsProgress());

  // Refresh progress from storage
  const refreshProgress = () => {
    const p = loadAllSkillsProgress();
    setSkillsProgress(p);
    setTotalXp(calculateGrandTotalXp(p));
    setTotalStars(calculateTotalStars(p));
  };

  useEffect(() => {
    refreshProgress();
  }, []);

  const handleStartGame = (skill: SkillKey) => {
    setLeaderboardSkill(skill);
    const currentProgress = skillsProgress[skill]?.[selectedCefr];
    const targetLevelNum = Math.min(10, Math.max(1, currentProgress?.unlockedLevel || 1));
    const levelData = getSkillLevel(skill, selectedCefr, targetLevelNum);
    if (levelData) {
      setActiveLevel(levelData);
    }
  };

  const handleNextLevel = () => {
    if (!activeLevel) return;
    const nextNum = activeLevel.levelNumber + 1;
    if (nextNum <= 10) {
      const nextLevelData = getSkillLevel(activeLevel.skill, activeLevel.cefr, nextNum);
      if (nextLevelData) {
        setActiveLevel(nextLevelData);
        refreshProgress();
        return;
      }
    }
    // Completed level 10
    setActiveLevel(null);
    refreshProgress();
  };

  return (
    <section className={styles.arcadeContainer} aria-label="آرکید بازی‌های مهارتی ایندورا">
      {/* Top Arcade Header */}
      <div className={styles.arcadeHeader}>
        <div className={styles.arcadeTopBar}>
          <div className={styles.arcadeTitleBox}>
            <span className={styles.arcadeIcon}>🕹️</span>
            <div>
              <h2 className={styles.arcadeTitle}>باشگاه بازی‌های تعاملی مهارت‌ها</h2>
              <p className={styles.arcadeSubtitle}>
                یادگیری مهارت‌های زبان در قالب بازی‌های کم‌حجم و سریع با نردبان ۱۰ مرحله‌ای هر سطح CEFR
              </p>
            </div>
          </div>

          <div className={styles.statsCluster}>
            <div className={`${styles.statBadge} ${styles.xp}`}>
              ⚡ {totalXp.toLocaleString("fa-IR")} XP
            </div>
            <div className={`${styles.statBadge} ${styles.stars}`}>
              ⭐ {totalStars.toLocaleString("fa-IR")} ستاره
            </div>
            <button
              className={styles.leaderboardBtn}
              onClick={() => setIsLeaderboardOpen(true)}
              type="button"
            >
              🏆 جدول برترین‌ها
            </button>
          </div>
        </div>

        {/* CEFR Ladder Track */}
        <div className={styles.cefrLadderTrack} role="tablist">
          {CEFR_LEVELS.map((tier) => {
            const isSelected = selectedCefr === tier.id;
            return (
              <button
                key={tier.id}
                role="tab"
                aria-selected={isSelected}
                className={`${styles.cefrPill} ${isSelected ? styles.active : ""}`}
                onClick={() => setSelectedCefr(tier.id)}
              >
                <span className={styles.cefrBadgeText}>{tier.id}</span>
                <span className={styles.cefrSubLabel}>{tier.descFa}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6 Core Skills Game Cards Grid */}
      <div className={styles.skillsGrid}>
        {SKILL_METAS.map((meta) => {
          const progress = skillsProgress[meta.key]?.[selectedCefr] || {
            unlockedLevel: selectedCefr === "A1" ? 1 : 0,
            stars: {},
            highScores: {},
            totalXp: 0,
          };

          const currentLevel = Math.min(10, Math.max(1, progress.unlockedLevel));
          const starsCount = Object.values(progress.stars).reduce((a, b) => a + b, 0);

          return (
            <div key={meta.key} className={styles.skillGameCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitleArea}>
                  <span className={styles.cardIcon}>{meta.icon}</span>
                  <div>
                    <h3 className={styles.cardTitleFa}>{meta.titleFa}</h3>
                    <p className={styles.cardTitleEn}>{meta.titleEn}</p>
                  </div>
                </div>
                <span className={styles.gameNameBadge}>{meta.gameName}</span>
              </div>

              <div className={styles.cardBody}>
                <p className={styles.cardDesc}>{meta.descFa}</p>

                {/* 10-Level Mini Ladder Nodes */}
                <div>
                  <div className={styles.progressInfo}>
                    <span>
                      مرحله {currentLevel} از ۱۰ • {selectedCefr}
                    </span>
                    <span>⭐ {starsCount} ستاره</span>
                  </div>

                  <div className={styles.levelPathTrack}>
                    {Array.from({ length: 10 }).map((_, idx) => {
                      const lvlNum = idx + 1;
                      const isCompleted = (progress.stars[lvlNum] || 0) > 0;
                      const isCurrent = progress.unlockedLevel === lvlNum;

                      return (
                        <div
                          key={lvlNum}
                          className={`${styles.pathNode} ${isCompleted ? styles.completed : ""} ${
                            isCurrent ? styles.current : ""
                          }`}
                          title={`مرحله ${lvlNum}: ${isCompleted ? "انجام شده" : isCurrent ? "مرحله جاری" : "قفل"}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className={styles.playBtn}
                  onClick={() => handleStartGame(meta.key)}
                  type="button"
                >
                  🎮 شروع مرحله {currentLevel}
                </button>
                <Link
                  href={`/skills/${meta.key}/game`}
                  className={styles.tabBtn}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                  }}
                  title="ورود به نقشه کامل مراحل"
                >
                  🗺️
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Game Arena Modal */}
      {activeLevel && activeLevel.skill === "grammar" ? (
        <GrammarHexArena
          key={`grammar-${activeLevel.cefr}-${activeLevel.levelNumber}`}
          level={activeLevel}
          onClose={() => {
            setActiveLevel(null);
            refreshProgress();
          }}
          onNextLevel={handleNextLevel}
          onOpenLeaderboard={() => {
            setActiveLevel(null);
            setLeaderboardSkill("grammar");
            setIsLeaderboardOpen(true);
            refreshProgress();
          }}
        />
      ) : activeLevel && activeLevel.skill === "vocabulary" && (activeLevel.cefr === "C1" || activeLevel.cefr === "C2") ? (
        <SpeedDialogueArena
          key={`dialogue-${activeLevel.cefr}-${activeLevel.levelNumber}`}
          level={activeLevel}
          onClose={() => {
            setActiveLevel(null);
            refreshProgress();
          }}
          onNextLevel={handleNextLevel}
          onOpenLeaderboard={() => {
            setActiveLevel(null);
            setLeaderboardSkill("vocabulary");
            setIsLeaderboardOpen(true);
            refreshProgress();
          }}
        />
      ) : activeLevel && activeLevel.skill === "vocabulary" ? (
        <WordCascadeArena
          key={`vocab-${activeLevel.cefr}-${activeLevel.levelNumber}`}
          level={activeLevel}
          onClose={() => {
            setActiveLevel(null);
            refreshProgress();
          }}
          onNextLevel={handleNextLevel}
          onOpenLeaderboard={() => {
            setActiveLevel(null);
            setLeaderboardSkill("vocabulary");
            setIsLeaderboardOpen(true);
            refreshProgress();
          }}
        />
      ) : activeLevel && activeLevel.skill === "speaking" ? (
        <SpeakingEscapeRoomArena
          key={`speaking-${activeLevel.cefr}-${activeLevel.levelNumber}`}
          level={activeLevel}
          onClose={() => {
            setActiveLevel(null);
            refreshProgress();
          }}
          onNextLevel={handleNextLevel}
          onOpenLeaderboard={() => {
            setActiveLevel(null);
            setLeaderboardSkill("speaking");
            setIsLeaderboardOpen(true);
            refreshProgress();
          }}
        />
      ) : activeLevel ? (
        <GameArena
          key={`generic-${activeLevel.cefr}-${activeLevel.levelNumber}`}
          level={activeLevel}
          onClose={() => {
            setActiveLevel(null);
            refreshProgress();
          }}
          onNextLevel={handleNextLevel}
        />
      ) : null}

      {/* Leaderboard Modal */}
      <SkillsLeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        initialCefr={selectedCefr}
        initialSkill={leaderboardSkill}
      />
    </section>
  );
}

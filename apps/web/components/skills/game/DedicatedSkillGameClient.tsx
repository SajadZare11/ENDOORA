"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./skills-game.module.css";
import { SkillKey, CefrLevel, GameLevel } from "../../../data/skills/games/types";
import { getSkillLevels, getSkillLevel } from "../../../data/skills/games/game-data";
import {
  loadAllSkillsProgress,
  calculateGrandTotalXp,
  calculateTotalStars,
  calculateCefrTotalXp,
  getLevelLeaderboard,
  getLevelDailyHighScore,
  getStageBestPoints,
} from "../../../lib/skills/game-storage";
import { GameArena } from "./GameArena";
import { VocabTimeAttackArena } from "./VocabTimeAttackArena";
import { WordCascadeArena } from "./WordCascadeArena";
import { ChatPingPongArena } from "./ChatPingPongArena";
import { SpeedDialogueArena } from "./SpeedDialogueArena";
import { GrammarHexArena } from "./GrammarHexArena";
import { SpeakingEscapeRoomArena } from "./SpeakingEscapeRoomArena";
import { SkillsLeaderboardModal } from "./SkillsLeaderboardModal";


interface Props {
  skill: SkillKey;
}

const SKILL_NAMES: Record<SkillKey, { fa: string; en: string; icon: string }> = {
  vocabulary: { fa: "واژگان و اصطلاحات", en: "Vocabulary", icon: "📚" },
  grammar: { fa: "گرامر و ساختار", en: "Grammar", icon: "🧩" },
  listening: { fa: "شنیداری و صوت", en: "Listening", icon: "🎧" },
  reading: { fa: "درک مطلب و خواندن", en: "Reading", icon: "📖" },
  writing: { fa: "نگارش و رایتینگ", en: "Writing", icon: "✍️" },
  speaking: { fa: "مکالمه و گفتار", en: "Speaking", icon: "🎙️" },
};

const CEFR_TABS: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export function DedicatedSkillGameClient({ skill }: Props) {
  const [cefr, setCefr] = useState<CefrLevel>("A1");
  const [activeLevel, setActiveLevel] = useState<GameLevel | null>(null);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [allProgress, setAllProgress] = useState(loadAllSkillsProgress());

  const skillInfo = SKILL_NAMES[skill] || { fa: skill, en: skill, icon: "🎮" };

  const refreshProgress = () => {
    setAllProgress(loadAllSkillsProgress());
  };

  useEffect(() => {
    refreshProgress();
  }, []);

  const progress = allProgress[skill]?.[cefr] || {
    unlockedLevel: cefr === "A1" ? 1 : 0,
    stars: {},
    highScores: {},
    bestPoints: {},
    totalXp: 0,
  };

  const levels = getSkillLevels(skill, cefr);
  const dailyRecord = getLevelDailyHighScore(skill, cefr);

  const handleNextLevel = () => {
    if (!activeLevel) return;
    const nextNum = activeLevel.levelNumber + 1;
    if (nextNum <= 10) {
      const nextLvl = getSkillLevel(skill, cefr, nextNum);
      if (nextLvl) {
        setActiveLevel(nextLvl);
        refreshProgress();
        return;
      }
    }
    setActiveLevel(null);
    refreshProgress();
  };

  return (
    <div style={{ maxWidth: 1400, width: "100%", margin: "0 auto", padding: "1.75rem clamp(1rem, 2.5vw, 2.5rem)" }}>
      {/* Navigation Breadcrumb */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Link
            href="/skills"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              fontSize: "0.875rem",
              color: "#3b82f6",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            ← بازگشت به هاب مهارت‌ها
          </Link>
          <span style={{ color: "#94a3b8" }}>/</span>
          <Link
            href={`/skills/${skill}`}
            style={{
              fontSize: "0.875rem",
              color: "#64748b",
              textDecoration: "none",
            }}
          >
            راهنمای آموزشی {skillInfo.fa}
          </Link>
        </div>

        <button
          className={styles.leaderboardBtn}
          onClick={() => setIsLeaderboardOpen(true)}
          type="button"
        >
          🏆 لیدربرد و رکوردها
        </button>
      </div>

      {/* Hero Header */}
      <div className={styles.arcadeHeader}>
        <div className={styles.arcadeTopBar}>
          <div className={styles.arcadeTitleBox}>
            <span style={{ fontSize: "2.5rem" }}>{skillInfo.icon}</span>
            <div>
              <h1 className={styles.arcadeTitle}>
                نقشه ۱۰ مرحله‌ای {skillInfo.fa} ({cefr})
              </h1>
              <p className={styles.arcadeSubtitle}>
                {skill === "grammar"
                  ? "مدارهای شش‌ضلعی نحو را با سیم‌کشی جریان سبز و انتخاب اضلاع درست هدایت کن؛ مراقب شوک اتصال کوتاه و تله‌های خطای فارسی باش و سریع‌تر از شبح لیدربرد به گره پایانی برس!"
                  : skill === "speaking"
                  ? "توی اتاق فرار صوتی، اشیای قفل‌شده اتاق رو بررسی کن؛ با تلفظ انگلیسی و گفتن کلمات کلیدی، قفل‌ها رو وا کن و قبل از اینکه وقتت تموم بشه بزن بیرون و رکورد شبح رقیب رو بشکن!"
                  : "مراحل ۱۰ گانه را با حداقل حد نصاب قبولی پشت سر بگذار؛ با انتخاب هر کلمه تایل‌ها شافل می‌شوند، زمان فشرده‌تر می‌شود و کلمات جدیدی ارائه می‌گردند!"}
              </p>
            </div>
          </div>

          <div className={styles.statsCluster}>
            <div
              className={`${styles.statBadge} ${styles.xp}`}
              title={`مجموع امتیاز شما در تمام مهارت‌های سطح ${cefr}`}
            >
              ⚡ {calculateCefrTotalXp(cefr, allProgress).toLocaleString("fa-IR")} XP
            </div>
            <div
              className={`${styles.statBadge} ${styles.rank}`}
              title={`رتبه شما در مهارت ${skillInfo.fa} سطح ${cefr}`}
              onClick={() => setIsLeaderboardOpen(true)}
              style={{ cursor: "pointer" }}
            >
              🏅 رتبه {Math.min(
                getLevelLeaderboard(skill, cefr, "daily", allProgress).userRank,
                getLevelLeaderboard(skill, cefr, "all-time", allProgress).userRank
              ).toLocaleString("fa-IR")}
            </div>
            {dailyRecord > 0 && (
              <div
                className={`${styles.statBadge}`}
                style={{ background: "#fef3c7", color: "#b45309", borderColor: "#fde68a" }}
              >
                🔥 رکورد امروز: {dailyRecord.toLocaleString("fa-IR")}
              </div>
            )}
          </div>
        </div>

        {/* CEFR Level Tabs */}
        <div className={styles.cefrLadderTrack} role="tablist">
          {CEFR_TABS.map((tier) => {
            const isSelected = cefr === tier;
            return (
              <button
                key={tier}
                role="tab"
                aria-selected={isSelected}
                className={`${styles.cefrPill} ${isSelected ? styles.active : ""}`}
                onClick={() => setCefr(tier)}
              >
                <span className={styles.cefrBadgeText}>{tier}</span>
                <span className={styles.cefrSubLabel}>۱۰ مرحله</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 10-Level Roadmap Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
          gap: "1.5rem",
          marginBlockStart: "2rem",
        }}
      >
        {levels.map((lvl) => {
          const isUnlocked = progress.unlockedLevel >= lvl.levelNumber;
          const starsEarned = progress.stars[lvl.levelNumber] || 0;
          const highScoreAccuracy = progress.highScores[lvl.levelNumber];
          const bestRawPoints = getStageBestPoints(skill, cefr, lvl.levelNumber);

          // Focus label
          const isConversationalC1C2 = skill === "vocabulary" && (cefr === "C1" || cefr === "C2");
          const isGrammar = skill === "grammar";
          const isSpeaking = skill === "speaking";
          const focusLabel = isSpeaking
            ? cefr === "A1" || cefr === "A2"
              ? "🎙️ مکالمه هدایت‌شده و سناریو"
              : cefr === "B1" || cefr === "B2"
              ? "🗣️ حل مسئله و دفاع از نظر"
              : "⚡ بداهه‌گویی و مناظره زیر فشار"
            : isGrammar
            ? cefr === "A1" || cefr === "A2"
              ? "⚡ معمار پایه نحو (AEF 1-2)"
              : cefr === "B1" || cefr === "B2"
              ? "🧩 مهندسی بندها و شرطی‌ها (AEF 3-4)"
              : "👑 سوپرلیگ وارونگی و ساختار (AEF 5)"
            : isConversationalC1C2
            ? "🏓 پینگ‌پنگ مکالمه"
            : lvl.stageFocus === "dialogues" || lvl.levelNumber >= 8
            ? "💬 مکالمه واقعی"
            : lvl.stageFocus === "chunks" || (lvl.levelNumber >= 5 && lvl.levelNumber <= 7)
            ? "🧩 چانک‌های محاوره‌ای"
            : "📚 لغات و همایندها";

          const focusColor = isSpeaking
            ? cefr === "C1" || cefr === "C2"
              ? "#ef4444"
              : cefr === "B1" || cefr === "B2"
              ? "#f59e0b"
              : "#10b981"
            : isGrammar
            ? cefr === "C1" || cefr === "C2"
              ? "#d946ef"
              : cefr === "B1" || cefr === "B2"
              ? "#6366f1"
              : "#0284c7"
            : isConversationalC1C2
            ? "#6366f1"
            : lvl.stageFocus === "dialogues" || lvl.levelNumber >= 8
            ? "#8b5cf6"
            : lvl.stageFocus === "chunks" || (lvl.levelNumber >= 5 && lvl.levelNumber <= 7)
            ? "#0284c7"
            : "#059669";


          return (
            <div
              key={lvl.levelNumber}
              className={styles.skillGameCard}
              style={{
                opacity: isUnlocked ? 1 : 0.65,
                borderColor: isUnlocked ? "#cbd5e1" : "#f1f5f9",
              }}
            >
              <div className={styles.cardHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      background: isUnlocked ? "#3b82f6" : "#94a3b8",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                    }}
                  >
                    {lvl.levelNumber}
                  </span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800 }}>
                      {lvl.titleFa}
                    </h3>
                    <p style={{ margin: "0.15rem 0 0", fontSize: "0.75rem", color: "#64748b" }}>
                      {lvl.titleEn}
                    </p>
                  </div>
                </div>

                <span>
                  {isUnlocked ? (
                    starsEarned > 0 ? (
                      starsEarned === 3 ? "⭐⭐⭐" : starsEarned === 2 ? "⭐⭐" : "⭐"
                    ) : (
                      "🆕"
                    )
                  ) : (
                    "🔒"
                  )}
                </span>
              </div>

              <div className={styles.cardBody}>
                {/* Pedagogical Focus Tag */}
                <span
                  style={{
                    alignSelf: "flex-start",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "0.15rem 0.5rem",
                    borderRadius: "0.35rem",
                    background: `${focusColor}15`,
                    color: focusColor,
                    marginBottom: "0.35rem",
                  }}
                >
                  {focusLabel}
                </span>

                <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>
                  {lvl.descriptionFa}
                </p>

                {/* Performance records */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.4rem" }}>
                  {highScoreAccuracy !== undefined && (
                    <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 700 }}>
                      دقت: {highScoreAccuracy}٪
                    </span>
                  )}
                  {bestRawPoints > 0 && (
                    <span style={{ fontSize: "0.75rem", color: "#d97706", fontWeight: 800 }}>
                      رکورد: {bestRawPoints.toLocaleString("fa-IR")} pts
                    </span>
                  )}
                </div>
              </div>

              <button
                className={styles.playBtn}
                disabled={!isUnlocked}
                onClick={() => isUnlocked && setActiveLevel(lvl)}
                style={{
                  background: isUnlocked
                    ? isSpeaking
                      ? "linear-gradient(135deg, #10b981, #059669)"
                      : isConversationalC1C2
                      ? "linear-gradient(135deg, #6366f1, #4f46e5)"
                      : "linear-gradient(135deg, #2563eb, #1d4ed8)"
                    : "#94a3b8",
                  cursor: isUnlocked ? "pointer" : "not-allowed",
                }}
              >
                {isUnlocked
                  ? starsEarned > 0
                    ? isSpeaking
                      ? "🔄 دوئل صوتی و رکورد مجدد"
                      : isConversationalC1C2
                      ? "🔄 رقابت مجدد سرعت و زمان"
                      : "🔄 بازی سرعتی و رکورد"
                    : isSpeaking
                    ? "🎙️ شروع مأموریت صوتی"
                    : isConversationalC1C2
                    ? "⚡ شروع چالش مکالمه پیوسته"
                    : "▶️ شروع استیج"
                  : "قفل شده"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Active Game Arena Modal */}
      {activeLevel && skill === "speaking" ? (
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
            setIsLeaderboardOpen(true);
            refreshProgress();
          }}
        />
      ) : activeLevel && skill === "grammar" ? (
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
            setIsLeaderboardOpen(true);
            refreshProgress();
          }}
        />
      ) : activeLevel && skill === "vocabulary" && (activeLevel.cefr === "C1" || activeLevel.cefr === "C2") ? (
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
            setIsLeaderboardOpen(true);
            refreshProgress();
          }}
        />
      ) : activeLevel && skill === "vocabulary" ? (
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


      {/* Dual Leaderboard Modal */}
      <SkillsLeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        initialCefr={cefr}
        initialSkill={skill}
      />
    </div>
  );
}

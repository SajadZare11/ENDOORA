"use client";

import React, { useState, useEffect } from "react";
import styles from "./skills-game.module.css";
import {
  getLevelLeaderboard,
  getGlobalLeaderboard,
  getLocalUserProfile,
  saveLocalUserProfile,
  LocalUserProfile,
} from "../../../lib/skills/game-storage";
import { CefrLevel, SkillKey, LeaderboardEntry, LeaderboardPeriod } from "../../../data/skills/games/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialCefr?: CefrLevel;
  initialSkill?: SkillKey;
}

type LeaderboardScope = "level" | "global";

const CEFR_TABS: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const AVAILABLE_AVATARS = ["🦁", "🚀", "⚡", "💎", "🦉", "🎯", "🌟", "👩‍🚀", "🔥", "🏆"];

export const SKILL_TABS: {
  key: SkillKey;
  labelFa: string;
  icon: string;
  color: string;
  activeBg: string;
}[] = [
  { key: "vocabulary", labelFa: "واژگان", icon: "💡", color: "#0d9488", activeBg: "#f0fdfa" },
  { key: "speaking", labelFa: "مکالمه", icon: "🎙️", color: "#ea580c", activeBg: "#fff7ed" },
  { key: "listening", labelFa: "شنیداری", icon: "🎧", color: "#2563eb", activeBg: "#eff6ff" },
  { key: "reading", labelFa: "درک مطلب", icon: "📖", color: "#0284c7", activeBg: "#f0f9ff" },
  { key: "writing", labelFa: "نگارش", icon: "✍️", color: "#8b5cf6", activeBg: "#f5f3ff" },
  { key: "grammar", labelFa: "دستور زبان", icon: "⚡", color: "#d946ef", activeBg: "#fdf4ff" },
];

const CEFR_CONFIG: Record<
  CefrLevel,
  { label: string; titleFa: string; color: string; bg: string; border: string; isSpeed: boolean }
> = {
  A1: {
    label: "سطح A1",
    titleFa: "مقدماتی (Everyday Essentials)",
    color: "#059669",
    bg: "#ecfdf5",
    border: "#10b981",
    isSpeed: false,
  },
  A2: {
    label: "سطح A2",
    titleFa: "پیش‌متوسط (Travel & City Living)",
    color: "#0284c7",
    bg: "#f0f9ff",
    border: "#0284c7",
    isSpeed: false,
  },
  B1: {
    label: "سطح B1",
    titleFa: "متوسط (Synonyms & Fluency)",
    color: "#0d9488",
    bg: "#f0fdfa",
    border: "#0d9488",
    isSpeed: false,
  },
  B2: {
    label: "سطح B2",
    titleFa: "فوق‌متوسط (Synonyms & Idioms)",
    color: "#0f766e",
    bg: "#f0fdfa",
    border: "#14b8a6",
    isSpeed: false,
  },
  C1: {
    label: "سطح C1",
    titleFa: "پیشرفته (اسپیدران مکالمه AEF 5)",
    color: "#ea580c",
    bg: "#fff7ed",
    border: "#ea580c",
    isSpeed: true,
  },
  C2: {
    label: "سطح C2",
    titleFa: "استادی زبان (تسلط کامل و سرعت)",
    color: "#e11d48",
    bg: "#fff1f2",
    border: "#e11d48",
    isSpeed: true,
  },
};

export function SkillsLeaderboardModal({
  isOpen,
  onClose,
  initialCefr = "A1",
  initialSkill = "vocabulary",
}: Props) {
  // Dual scope: Level-specific table | Global hall of fame
  const [scope, setScope] = useState<LeaderboardScope>("level");
  const [selectedSkill, setSelectedSkill] = useState<SkillKey>(initialSkill);
  const [selectedCefr, setSelectedCefr] = useState<CefrLevel>(initialCefr);
  const [period, setPeriod] = useState<LeaderboardPeriod>("daily");

  // Data states
  const [levelData, setLevelData] = useState<{
    entries: LeaderboardEntry[];
    userRank: number;
    pointsToLeader: number;
  }>({ entries: [], userRank: 0, pointsToLeader: 0 });

  const [globalData, setGlobalData] = useState<{
    entries: LeaderboardEntry[];
    podiumTop3: LeaderboardEntry[];
    userRank: number;
  }>({ entries: [], podiumTop3: [], userRank: 0 });

  // Profile editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userProfile, setUserProfile] = useState<LocalUserProfile>(getLocalUserProfile());

  // Synchronize initialCefr & initialSkill when modal opens or props change
  useEffect(() => {
    if (initialCefr) {
      setSelectedCefr(initialCefr);
    }
    if (initialSkill) {
      setSelectedSkill(initialSkill);
    }
  }, [initialCefr, initialSkill, isOpen]);

  // Refresh leaderboard data sets
  const refreshData = () => {
    if (scope === "level") {
      setLevelData(getLevelLeaderboard(selectedSkill, selectedCefr, period));
    } else {
      setGlobalData(getGlobalLeaderboard(period === "daily" ? "weekly" : period));
    }
  };

  useEffect(() => {
    if (isOpen) {
      setUserProfile(getLocalUserProfile());
      refreshData();
    }
  }, [isOpen, scope, selectedSkill, selectedCefr, period]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveLocalUserProfile(userProfile);
    setIsEditingProfile(false);
    refreshData();
  };

  if (!isOpen) return null;

  const isCurrentCLevel = selectedCefr === "C1" || selectedCefr === "C2";
  const currentSkillObj = SKILL_TABS.find((s) => s.key === selectedSkill) || SKILL_TABS[0];

  return (
    <div className={styles.leaderboardModal} onClick={onClose}>
      <div
        className={styles.leaderboardCard}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 680, width: "95%" }}
      >
        {/* Header */}
        <div className={styles.leaderboardHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontSize: "1.7rem" }}>🏆</span>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>
                {scope === "level"
                  ? `لیدربرد ${currentSkillObj.labelFa} • سطح ${selectedCefr}`
                  : "تالار مشاهیر کل سطوح (ملی)"}
              </h3>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
                {scope === "level"
                  ? isCurrentCLevel && selectedSkill === "vocabulary"
                    ? "اسپیدران مکالمات کاربردی AEF 5 — رده‌بندی بر اساس کمترین زمان تکمیل (ثانیه ⏱️)"
                    : `رقابت زنده زبان‌آموزان در مهارت ${currentSkillObj.labelFa} سطح ${selectedCefr}`
                  : "رده‌بندی برترین زبان‌آموزان کل کشور در مجموع تمام سطوح و مهارت‌ها"}
              </p>
            </div>
          </div>
          <button className={styles.closeArenaBtn} onClick={onClose} aria-label="بستن">
            ✕
          </button>
        </div>

        {/* Master Scope Switcher: Level-Specific vs Global */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem 0",
          }}
        >
          <button
            type="button"
            className={`${styles.tabBtn} ${scope === "level" ? styles.active : ""}`}
            onClick={() => setScope("level")}
            style={{ fontWeight: 800, padding: "0.6rem 0.5rem", fontSize: "0.9rem" }}
          >
            🎯 جدول اختصاصی ({currentSkillObj.labelFa} - {selectedCefr})
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${scope === "global" ? styles.active : ""}`}
            onClick={() => setScope("global")}
            style={{ fontWeight: 800, padding: "0.6rem 0.5rem", fontSize: "0.9rem" }}
          >
            🌐 تالار مشاهیر (کل سطوح)
          </button>
        </div>

        {/* Sub-Filters: Skills row, Level pills & Period Switcher */}
        <div
          style={{
            padding: "0.75rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          {/* 1. Skill Selector (6 Core Skills) - Placed directly ABOVE CEFR levels */}
          {scope === "level" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b" }}>
                  انتخاب مهارت (۶ مهارت اصلی):
                </span>
                <span style={{ fontSize: "0.75rem", color: currentSkillObj.color, fontWeight: 700 }}>
                  فعال: {currentSkillObj.labelFa}
                </span>
              </div>
              <div style={{ display: "flex", gap: "0.35rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
                {SKILL_TABS.map((sk) => {
                  const isSelected = selectedSkill === sk.key;
                  return (
                    <button
                      key={sk.key}
                      type="button"
                      onClick={() => setSelectedSkill(sk.key)}
                      style={{
                        padding: "0.35rem 0.65rem",
                        borderRadius: "0.6rem",
                        border: isSelected ? `2px solid ${sk.color}` : "1px solid #cbd5e1",
                        background: isSelected ? sk.activeBg : "#ffffff",
                        color: isSelected ? sk.color : "#475569",
                        fontWeight: 800,
                        fontSize: "0.82rem",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        transition: "all 0.15s ease",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ fontSize: "1rem" }}>{sk.icon}</span>
                      <span>{sk.labelFa}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. CEFR Level Selector (Visible in Level scope) - Placed BELOW Skills */}
          {scope === "level" && (
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", marginBottom: "0.35rem" }}>
                انتخاب سطح CEFR:
              </div>
              <div style={{ display: "flex", gap: "0.35rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
                {CEFR_TABS.map((lvl) => {
                  const cfg = CEFR_CONFIG[lvl];
                  const isSelected = selectedCefr === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedCefr(lvl)}
                      style={{
                        padding: "0.32rem 0.75rem",
                        borderRadius: "0.6rem",
                        border: isSelected ? `2px solid ${cfg.border}` : "1px solid #cbd5e1",
                        background: isSelected ? cfg.bg : "#ffffff",
                        color: isSelected ? cfg.color : "#475569",
                        fontWeight: 800,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        transition: "all 0.15s ease",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      <span>سطح {lvl}</span>
                      {cfg.isSpeed && selectedSkill === "vocabulary" && <span style={{ fontSize: "0.7rem" }}>⏱️</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Timeframe & Profile Edit button */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
            <div className={styles.leaderboardTabs} style={{ padding: 0 }}>
              <button
                className={`${styles.tabBtn} ${period === "daily" ? styles.active : ""}`}
                onClick={() => setPeriod("daily")}
              >
                🔥 رکورد امروز
              </button>
              <button
                className={`${styles.tabBtn} ${period === "weekly" ? styles.active : ""}`}
                onClick={() => setPeriod("weekly")}
              >
                ⚡ لیگ هفتگی
              </button>
              <button
                className={`${styles.tabBtn} ${period === "all-time" ? styles.active : ""}`}
                onClick={() => setPeriod("all-time")}
              >
                ⭐ کل زمان‌ها
              </button>
            </div>

            <button
              className={styles.tabBtn}
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              style={{ fontSize: "0.8rem", borderColor: "#93c5fd", color: "#2563eb" }}
              type="button"
            >
              ✏️ {isEditingProfile ? "بستن ویرایش" : "پروفایل من"}
            </button>
          </div>
        </div>

        {/* Profile Editor Panel */}
        {isEditingProfile && (
          <form
            onSubmit={handleSaveProfile}
            style={{
              margin: "0.75rem 1.5rem",
              padding: "1rem",
              borderRadius: "1rem",
              background: "#f8fafc",
              border: "1px solid #cbd5e1",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b" }}>
              تنظیم نام و نشان در لیدربورد:
            </span>

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>آواتار:</span>
              {AVAILABLE_AVATARS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setUserProfile({ ...userProfile, avatar: av })}
                  style={{
                    fontSize: "1.25rem",
                    padding: "0.2rem 0.4rem",
                    borderRadius: "0.5rem",
                    border: userProfile.avatar === av ? "2px solid #3b82f6" : "1px solid transparent",
                    background: userProfile.avatar === av ? "rgba(59, 130, 246, 0.1)" : "none",
                    cursor: "pointer",
                  }}
                >
                  {av}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                placeholder="نام نمایشی شما"
                value={userProfile.nickname}
                onChange={(e) => setUserProfile({ ...userProfile, nickname: e.target.value })}
                maxLength={25}
                style={{
                  flex: 1,
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.85rem",
                  fontFamily: "inherit",
                }}
              />
              <input
                type="text"
                placeholder="شهر شما"
                value={userProfile.city}
                onChange={(e) => setUserProfile({ ...userProfile, city: e.target.value })}
                maxLength={20}
                style={{
                  width: "120px",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.85rem",
                  fontFamily: "inherit",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  background: "#2563eb",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                ذخیره
              </button>
            </div>
          </form>
        )}

        {/* Motivational Pacing Banner in Level-Specific View */}
        {scope === "level" && (
          <div
            style={{
              margin: "0.75rem 1.5rem 0.25rem",
              padding: "0.65rem 1rem",
              borderRadius: "0.75rem",
              background: levelData.userRank === 1 ? "#ecfdf5" : "#eff6ff",
              border: levelData.userRank === 1 ? "1px solid #a7f3d0" : "1px solid #bfdbfe",
              color: levelData.userRank === 1 ? "#065f46" : "#1e40af",
              fontSize: "0.85rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <div>
              {selectedSkill === "grammar" ? (
                levelData.userRank === 1 ? (
                  <span>👑 تبریک! شما در حال حاضر دارنده نشان «معمار ارشد نحو» در سطح {selectedCefr} هستید!</span>
                ) : (
                  <span>⚡ رتبه شما در گرامر سطح {selectedCefr}: #{levelData.userRank} (در رقابت برای عنوان «معمار ارشد نحو» 👑)</span>
                )
              ) : levelData.userRank === 1 ? (
                <span>👑 تبریک! شما در حال حاضر رتبه ۱ {currentSkillObj.labelFa} سطح {selectedCefr} هستید!</span>
              ) : (
                <span>⚡ رتبه شما در {currentSkillObj.labelFa} سطح {selectedCefr}: #{levelData.userRank}</span>
              )}
              {isCurrentCLevel && selectedSkill === "vocabulary" && (
                <span style={{ marginRight: "0.75rem", fontSize: "0.78rem", color: "#64748b" }}>
                  (اسپیدران مکالمه — رده‌بندی بر اساس کمترین ثانیه)
                </span>
              )}
              {selectedSkill === "grammar" && (
                <span style={{ marginRight: "0.75rem", fontSize: "0.78rem", color: "#a855f7" }}>
                  (رده‌بندی: استریک بدون غلط 🔥 $\rightarrow$ زمان اسپیدران ⏱️)
                </span>
              )}
            </div>

            {!(isCurrentCLevel && selectedSkill === "vocabulary") && levelData.userRank > 1 && levelData.pointsToLeader > 0 && (
              <span style={{ fontSize: "0.8rem", color: "#2563eb" }}>
                تنها {levelData.pointsToLeader.toLocaleString("fa-IR")} امتیاز تا رتبه ۱
              </span>
            )}
          </div>
        )}

        {/* =========================================================================
            SCOPE 1: LEVEL-SPECIFIC DETAILED TABLE (10 LEARNERS)
            ========================================================================= */}
        {scope === "level" && (
          <div className={styles.leaderboardList}>
            {levelData.entries.map((item) => {
              const isCurrentUser = item.isCurrentUser;

              return (
                <div
                  key={item.id}
                  className={`${styles.leaderboardRow} ${isCurrentUser ? styles.currentUserRow : ""}`}
                >
                  {/* Rank number or medal */}
                  <div className={styles.rankCell}>
                    {item.rank === 1 ? (
                      <span className={styles.medalGold}>🥇</span>
                    ) : item.rank === 2 ? (
                      <span className={styles.medalSilver}>🥈</span>
                    ) : item.rank === 3 ? (
                      <span className={styles.medalBronze}>🥉</span>
                    ) : (
                      <span className={styles.rankNum}>{item.rank}</span>
                    )}
                  </div>

                  {/* Avatar and name */}
                  <div className={styles.userCell}>
                    <span className={styles.userAvatar}>{item.avatar}</span>
                    <div className={styles.userNameBlock}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexWrap: "wrap" }}>
                        <span className={styles.userNameText}>{item.name}</span>
                        {isCurrentUser && <span className={styles.youBadge}>شما</span>}
                        {item.honoraryBadge && (
                          <span
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 800,
                              padding: "0.1rem 0.45rem",
                              borderRadius: "9999px",
                              background: item.rank === 1 ? "rgba(217, 70, 239, 0.15)" : "rgba(99, 102, 241, 0.15)",
                              color: item.rank === 1 ? "#d946ef" : "#6366f1",
                              border: `1px solid ${item.rank === 1 ? "#d946ef" : "rgba(99, 102, 241, 0.4)"}`,
                              boxShadow: item.rank === 1 ? "0 0 10px rgba(217, 70, 239, 0.3)" : "none",
                            }}
                          >
                            {item.honoraryBadge}
                          </span>
                        )}
                      </div>
                      <span className={styles.userMeta}>
                        {item.city}
                      </span>
                    </div>
                  </div>

                  {/* Score badge or Speed/Streak for Grammar / C1/C2 */}
                  <div className={styles.scoreCell}>
                    {selectedSkill === "grammar" ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.2rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", direction: "ltr" }}>
                          <span style={{ color: "#f97316", fontWeight: 800, fontSize: "0.85rem" }}>
                            🔥 {item.bestStreak || 0}x
                          </span>
                          {item.bestTimeSeconds && (
                            <span style={{ color: "#0284c7", fontWeight: 700, fontSize: "0.85rem" }}>
                              ⏱️ {item.bestTimeSeconds.toFixed(1)}s
                            </span>
                          )}
                        </div>
                        <span className={styles.scoreUnit} style={{ color: "#64748b", fontWeight: 700 }}>
                          {item.score.toLocaleString("fa-IR")} امتیاز
                        </span>
                      </div>
                    ) : item.bestTimeSeconds && selectedSkill === "vocabulary" && isCurrentCLevel ? (
                      <>
                        <span
                          className={styles.scoreNumber}
                          style={{ color: "#2563eb", direction: "ltr", fontSize: "0.95rem" }}
                        >
                          ⏱️ {item.bestTimeSeconds.toFixed(1)}s
                        </span>
                        <span className={styles.scoreUnit} style={{ color: "#059669", fontWeight: 700 }}>
                          {item.score.toLocaleString("fa-IR")} امتیاز
                        </span>
                      </>
                    ) : (
                      <>
                        <span className={styles.scoreNumber}>{item.score.toLocaleString("fa-IR")}</span>
                        <span className={styles.scoreUnit}>
                          {period === "daily" ? "امتیاز روز" : period === "weekly" ? "امتیاز لیگ" : "امتیاز موزون"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* =========================================================================
            SCOPE 2: GLOBAL LEADERBOARD (HALL OF FAME & PODIUM)
            ========================================================================= */}
        {scope === "global" && (
          <>
            {globalData.podiumTop3.length >= 3 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.15fr 1fr",
                  gap: "0.5rem",
                  margin: "1rem 1.5rem",
                  textAlign: "center",
                }}
              >
                {/* Rank 2 (Silver) */}
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #cbd5e1",
                    borderRadius: "1rem",
                    padding: "0.85rem 0.5rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "1.6rem" }}>🥈</span>
                  <span style={{ fontSize: "1.4rem" }}>{globalData.podiumTop3[1]?.avatar}</span>
                  <strong style={{ fontSize: "0.85rem", marginTop: 4 }}>{globalData.podiumTop3[1]?.name}</strong>
                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{globalData.podiumTop3[1]?.city}</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#2563eb", marginTop: 4 }}>
                    {globalData.podiumTop3[1]?.score.toLocaleString("fa-IR")} XP
                  </span>
                </div>

                {/* Rank 1 (Gold Champion) */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #fef3c7, #fffbeb)",
                    border: "2px solid #f59e0b",
                    borderRadius: "1rem",
                    padding: "1rem 0.5rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transform: "translateY(-6px)",
                    boxShadow: "0 6px 15px rgba(245, 158, 11, 0.2)",
                  }}
                >
                  <span style={{ fontSize: "2rem" }}>🥇</span>
                  <span style={{ fontSize: "1.6rem" }}>{globalData.podiumTop3[0]?.avatar}</span>
                  <strong style={{ fontSize: "0.95rem", color: "#92400e", marginTop: 4 }}>
                    {globalData.podiumTop3[0]?.name}
                  </strong>
                  <span style={{ fontSize: "0.75rem", color: "#b45309" }}>{globalData.podiumTop3[0]?.city}</span>
                  <span style={{ fontSize: "0.95rem", fontWeight: 900, color: "#d97706", marginTop: 4 }}>
                    {globalData.podiumTop3[0]?.score.toLocaleString("fa-IR")} XP
                  </span>
                </div>

                {/* Rank 3 (Bronze) */}
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #cbd5e1",
                    borderRadius: "1rem",
                    padding: "0.85rem 0.5rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "1.6rem" }}>🥉</span>
                  <span style={{ fontSize: "1.4rem" }}>{globalData.podiumTop3[2]?.avatar}</span>
                  <strong style={{ fontSize: "0.85rem", marginTop: 4 }}>{globalData.podiumTop3[2]?.name}</strong>
                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{globalData.podiumTop3[2]?.city}</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#2563eb", marginTop: 4 }}>
                    {globalData.podiumTop3[2]?.score.toLocaleString("fa-IR")} XP
                  </span>
                </div>
              </div>
            )}

            {/* Global Table */}
            <div className={styles.leaderboardList}>
              {globalData.entries.map((item) => {
                const isCurrentUser = item.isCurrentUser;

                return (
                  <div
                    key={item.id}
                    className={`${styles.leaderboardRow} ${isCurrentUser ? styles.currentUserRow : ""}`}
                  >
                    <div className={styles.rankCell}>
                      {item.rank === 1 ? (
                        <span className={styles.medalGold}>🥇</span>
                      ) : item.rank === 2 ? (
                        <span className={styles.medalSilver}>🥈</span>
                      ) : item.rank === 3 ? (
                        <span className={styles.medalBronze}>🥉</span>
                      ) : (
                        <span className={styles.rankNum}>{item.rank}</span>
                      )}
                    </div>

                    <div className={styles.userCell}>
                      <span className={styles.userAvatar}>{item.avatar}</span>
                      <div className={styles.userNameBlock}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <span className={styles.userNameText}>{item.name}</span>
                          {isCurrentUser && <span className={styles.youBadge}>شما</span>}
                        </div>
                        <span className={styles.userMeta}>
                          {item.city}
                        </span>
                      </div>
                    </div>

                    <div className={styles.scoreCell}>
                      <span className={styles.scoreNumber}>{item.score.toLocaleString("fa-IR")}</span>
                      <span className={styles.scoreUnit}>امتیاز کل XP</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./gamification-affiliates.module.css";
import {
  LearnerGamificationProfile,
  BadgeRecord,
  XpRuleConfig,
  AffiliatePartner,
  AffiliatePayoutRequest,
  ReferralConversionLog,
  LeagueTier,
  INITIAL_BADGES,
  INITIAL_LEARNERS_GAMIFICATION,
  INITIAL_XP_RULES,
  INITIAL_AFFILIATES,
  INITIAL_PAYOUT_REQUESTS,
  INITIAL_CONVERSION_LOGS,
} from "@/lib/admin-gamification-affiliates-store";

type GamificationTab = "leaderboard" | "badges" | "rules" | "affiliates";

export function GamificationAffiliatesHub() {
  const [activeTab, setActiveTab] = useState<GamificationTab>("leaderboard");
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Gamification & Leaderboard State
  const [learners, setLearners] = useState<LearnerGamificationProfile[]>(INITIAL_LEARNERS_GAMIFICATION);
  const [badges, setBadges] = useState<BadgeRecord[]>(INITIAL_BADGES);
  const [xpRules, setXpRules] = useState<XpRuleConfig>(INITIAL_XP_RULES);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<"weekly" | "monthly" | "all_time">("all_time");

  // Modals for Learner Actions
  const [adjustXpLearner, setAdjustXpLearner] = useState<LearnerGamificationProfile | null>(null);
  const [deltaXpInput, setDeltaXpInput] = useState<number>(100);
  const [xpReasonInput, setXpReasonInput] = useState<string>("پاداش فعالیت برجسته و پیشرفت چشمگیر در اسپیکینگ");

  const [awardBadgeLearner, setAwardBadgeLearner] = useState<LearnerGamificationProfile | null>(null);
  const [selectedBadgeToAward, setSelectedBadgeToAward] = useState<string>(INITIAL_BADGES[0]?.id || "");

  // Affiliates State
  const [affiliates, setAffiliates] = useState<AffiliatePartner[]>(INITIAL_AFFILIATES);
  const [payoutRequests, setPayoutRequests] = useState<AffiliatePayoutRequest[]>(INITIAL_PAYOUT_REQUESTS);
  const [conversionLogs, setConversionLogs] = useState<ReferralConversionLog[]>(INITIAL_CONVERSION_LOGS);
  const [showNewAffiliateModal, setShowNewAffiliateModal] = useState<boolean>(false);
  const [newAffiliateForm, setNewAffiliateForm] = useState({
    partnerName: "",
    phone: "",
    email: "",
    referralCode: "",
    commissionRatePercent: 15,
    shebaNumber: "IR",
    bankName: "بانک ملت",
  });

  // Notification helper
  const notify = (text: string, isError = false) => {
    setStatusMessage({ text, isError });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Fetch Leaderboard
  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/gamification/leaderboard?period=${leaderboardPeriod}`);
      const data = await res.json();
      if (data.success) {
        if (data.learners) setLearners(data.learners);
        if (data.badges) setBadges(data.badges);
        if (data.rules) setXpRules(data.rules);
      }
    } catch {
      // fallback
    }
  }, [leaderboardPeriod]);

  // Fetch Affiliates
  const fetchAffiliates = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/affiliates/partners");
      const data = await res.json();
      if (data.success) {
        if (data.affiliates) setAffiliates(data.affiliates);
        if (data.payoutRequests) setPayoutRequests(data.payoutRequests);
        if (data.conversionLogs) setConversionLogs(data.conversionLogs);
      }
    } catch {
      // fallback
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
    fetchAffiliates();
  }, [fetchLeaderboard, fetchAffiliates]);

  // Submit XP Adjustment
  const handleAdjustXpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustXpLearner) return;

    try {
      const res = await fetch("/api/admin/gamification/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "adjust_xp",
          userId: adjustXpLearner.userId,
          deltaXp: deltaXpInput,
          reason: xpReasonInput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        notify(data.message);
        setAdjustXpLearner(null);
        fetchLeaderboard();
      } else {
        notify(data.error || "خطا در اصلاح امتیاز", true);
      }
    } catch {
      notify("خطا در ارتباط با سرور", true);
    }
  };

  // Submit Badge Award
  const handleAwardBadgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!awardBadgeLearner || !selectedBadgeToAward) return;

    try {
      const res = await fetch("/api/admin/gamification/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "award_badge",
          userId: awardBadgeLearner.userId,
          badgeId: selectedBadgeToAward,
        }),
      });
      const data = await res.json();
      if (data.success) {
        notify(data.message);
        setAwardBadgeLearner(null);
        fetchLeaderboard();
      } else {
        notify(data.error || "خطا در اعطای نشان", true);
      }
    } catch {
      notify("خطا در اعطای نشان", true);
    }
  };

  // Save XP Rules
  const handleSaveXpRules = async () => {
    try {
      const res = await fetch("/api/admin/gamification/xp-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules: xpRules }),
      });
      const data = await res.json();
      if (data.success) {
        notify(data.message);
      } else {
        notify(data.error || "خطا در ذخیره قوانین", true);
      }
    } catch {
      notify("خطا در ذخیره قوانین", true);
    }
  };

  // Create Affiliate Partner
  const handleCreateAffiliate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/affiliates/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", partnerData: newAffiliateForm }),
      });
      const data = await res.json();
      if (data.success) {
        notify(data.message);
        setShowNewAffiliateModal(false);
        fetchAffiliates();
      } else {
        notify(data.error || "خطا در ثبت همکار", true);
      }
    } catch {
      notify("خطا در ثبت همکار", true);
    }
  };

  // Process Affiliate Payout
  const handleProcessPayout = async (
    payoutId: string,
    action: "approve_bank" | "approve_wallet" | "reject"
  ) => {
    try {
      const res = await fetch("/api/admin/affiliates/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payoutId }),
      });
      const data = await res.json();
      if (data.success) {
        notify(data.message);
        fetchAffiliates();
      } else {
        notify(data.error || "خطا در پردازش تسویه", true);
      }
    } catch {
      notify("خطا در پردازش تسویه", true);
    }
  };

  // Helper for league badge
  const renderLeagueBadge = (tier: LeagueTier) => {
    if (tier === "master") return <span className={styles.badgeMaster}>استاد اعظم (Master)</span>;
    if (tier === "diamond") return <span className={styles.badgeDiamond}>الماس (Diamond)</span>;
    if (tier === "gold") return <span className={styles.badgeGold}>طلا (Gold)</span>;
    if (tier === "silver") return <span className={styles.badgeSilver}>نقره (Silver)</span>;
    return <span className={styles.badgeBronze}>برنز (Bronze)</span>;
  };

  // Total sums
  const totalAffiliateSalesSum = affiliates.reduce((acc, a) => acc + a.totalSalesVolumeToman, 0);
  const totalCommissionEarnedSum = affiliates.reduce((acc, a) => acc + a.totalCommissionEarnedToman, 0);

  return (
    <div className={styles.container} dir="rtl">
      {/* Toast Notification */}
      {statusMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "2rem",
            zIndex: 10000,
            padding: "0.85rem 1.5rem",
            borderRadius: "10px",
            fontSize: "0.9rem",
            fontWeight: "700",
            boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            background: statusMessage.isError ? "#ef4444" : "#10b981",
            color: "#ffffff",
          }}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Header Card */}
      <div className={styles.headerCard}>
        <div className={styles.topRow}>
          <div className={styles.titleArea}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h2>مرکز لیگ‌های افتخاری، گیمیفیکیشن و شبکه همکاری در فروش (Gamification & Affiliates Hub)</h2>
              <span style={{ background: "#fef3c7", color: "#b45309", fontSize: "0.75rem", fontWeight: "800", padding: "0.2rem 0.6rem", borderRadius: "999px" }}>
                Prestige & Growth
              </span>
            </div>
            <p>
              مدیریت رده‌بندی لیگ‌های ۵گانه، اعطای نشان‌های افتخار، تنظیم ضرایب کسب XP، و مدیریت شبکه بازاریابان و تسویه کمیسیون رفرال‌ها
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => setShowNewAffiliateModal(true)}
            >
              ➕ ثبت همکار بازاریابی جدید
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>
              <span>کل فروش تحقق‌یافته از رفرال</span>
              <span>تومان</span>
            </div>
            <div className={styles.metricValue} style={{ color: "#10b981" }}>
              {totalAffiliateSalesSum.toLocaleString()} تومان
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>
              <span>مجموع کمیسیون تعلق‌گرفته</span>
              <span>همکاران</span>
            </div>
            <div className={styles.metricValue} style={{ color: "#b45309" }}>
              {totalCommissionEarnedSum.toLocaleString()} تومان
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>
              <span>تعداد کل نشان‌های افتخار اعطا شده</span>
              <span>Badges</span>
            </div>
            <div className={styles.metricValue} style={{ color: "#7c3aed" }}>
              {badges.reduce((acc, b) => acc + b.awardedCount, 0)} نشان
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>
              <span>بالاترین رکورد استریک مطالعه</span>
              <span>پیوسته</span>
            </div>
            <div className={styles.metricValue} style={{ color: "#ef4444" }}>
              {learners[0]?.currentStreakDays || 34} روز 🔥
            </div>
          </div>
        </div>

        {/* Sub-Tabs Nav */}
        <nav className={styles.subTabsNav} style={{ marginTop: "1.25rem" }}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "leaderboard" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("leaderboard")}
          >
            🏆 جدول رتبه‌بندی و لیگ‌های ۵گانه
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "badges" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("badges")}
          >
            🎖️ نشان‌های افتخار و زنجیره مطالعه ({badges.length})
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "rules" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("rules")}
          >
            ⚙️ قوانین امتیازدهی و ضرایب XP
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "affiliates" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("affiliates")}
          >
            🤝 شبکه همکاری در فروش و تسویه کمیسیون‌ها ({affiliates.length})
          </button>
        </nav>
      </div>

      {/* ===================================================================== */}
      {/* 1. Sub-Tab: Leaderboard & Leagues */}
      {/* ===================================================================== */}
      {activeTab === "leaderboard" && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>جدول رده‌بندی برترین زبان‌آموزان و رتبه‌بندی لیگ‌ها</h3>
              <p>زبان‌آموزان بر اساس فعالیت روزانه، آزمونک‌ها و نمرات اسپیکینگ در لیگ‌های برنز تا استاد اعظم ارتقا می‌یابند.</p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {(["all_time", "monthly", "weekly"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`${styles.tabBtn} ${leaderboardPeriod === p ? styles.tabBtnActive : ""}`}
                  style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
                  onClick={() => setLeaderboardPeriod(p)}
                >
                  {p === "all_time" ? "رده‌بندی کل" : p === "monthly" ? "ماه جاری" : "هفته جاری"}
                </button>
              ))}
            </div>
          </div>

          {/* Top 3 Podium */}
          <div className={styles.podiumGrid}>
            {/* Rank 2 */}
            {learners[1] && (
              <div className={`${styles.podiumCard} ${styles.podiumSecond}`}>
                <div className={`${styles.rankCircle} ${styles.circleSilver}`}>۲</div>
                <h4 style={{ margin: "0.2rem 0", fontSize: "1.05rem" }}>{learners[1].name}</h4>
                <div>{renderLeagueBadge(learners[1].league)}</div>
                <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#475569" }}>
                  {learners[1].totalXp.toLocaleString()} XP
                </div>
                <div style={{ fontSize: "0.8rem", color: "#64748b" }}>🔥 استریک {learners[1].currentStreakDays} روزه</div>
              </div>
            )}

            {/* Rank 1 (Center) */}
            {learners[0] && (
              <div className={`${styles.podiumCard} ${styles.podiumFirst}`}>
                <div style={{ position: "absolute", top: "-12px", fontSize: "1.5rem" }}>👑</div>
                <div className={`${styles.rankCircle} ${styles.circleGold}`} style={{ width: "52px", height: "52px" }}>
                  ۱
                </div>
                <h4 style={{ margin: "0.2rem 0", fontSize: "1.15rem", color: "#92400e" }}>{learners[0].name}</h4>
                <div>{renderLeagueBadge(learners[0].league)}</div>
                <div style={{ fontSize: "1.35rem", fontWeight: "800", color: "#b45309" }}>
                  {learners[0].totalXp.toLocaleString()} XP
                </div>
                <div style={{ fontSize: "0.85rem", color: "#78350f", fontWeight: "700" }}>
                  🔥 استریک {learners[0].currentStreakDays} روزه متوالی
                </div>
              </div>
            )}

            {/* Rank 3 */}
            {learners[2] && (
              <div className={`${styles.podiumCard} ${styles.podiumThird}`}>
                <div className={`${styles.rankCircle} ${styles.circleBronze}`}>۳</div>
                <h4 style={{ margin: "0.2rem 0", fontSize: "1.05rem" }}>{learners[2].name}</h4>
                <div>{renderLeagueBadge(learners[2].league)}</div>
                <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#c2410c" }}>
                  {learners[2].totalXp.toLocaleString()} XP
                </div>
                <div style={{ fontSize: "0.8rem", color: "#64748b" }}>🔥 استریک {learners[2].currentStreakDays} روزه</div>
              </div>
            )}
          </div>

          {/* Full Leaderboard Table */}
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>رتبه</th>
                  <th>زبان‌آموز</th>
                  <th>لیگ افتخاری</th>
                  <th>مجموع امتیاز (XP)</th>
                  <th>زنجیره استریک</th>
                  <th>نشان‌ها</th>
                  <th style={{ textAlign: "center" }}>عملیات گاد مود</th>
                </tr>
              </thead>
              <tbody>
                {learners.map((learner) => (
                  <tr key={learner.userId}>
                    <td style={{ fontWeight: "800", fontSize: "1.05rem" }}>#{learner.rank}</td>
                    <td>
                      <div style={{ fontWeight: "700" }}>{learner.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{learner.email}</div>
                    </td>
                    <td>{renderLeagueBadge(learner.league)}</td>
                    <td style={{ fontWeight: "800", color: "#0f172a", fontFamily: "monospace" }}>
                      {learner.totalXp.toLocaleString()} XP
                    </td>
                    <td>
                      <span style={{ color: "#ef4444", fontWeight: "700" }}>🔥 {learner.currentStreakDays} روز</span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.25rem" }}>
                        {learner.badges.map((bId) => {
                          const badge = badges.find((b) => b.id === bId);
                          return (
                            <span key={bId} title={badge?.titleFa || bId} style={{ fontSize: "1.2rem" }}>
                              {badge?.icon || "🎖️"}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                        <button
                          type="button"
                          className={styles.btnSecondary}
                          style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
                          onClick={() => setAdjustXpLearner(learner)}
                        >
                          تغییر XP ✏️
                        </button>
                        <button
                          type="button"
                          className={styles.btnPrimary}
                          style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
                          onClick={() => setAwardBadgeLearner(learner)}
                        >
                          اعطای نشان 🎖️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. Sub-Tab: Badges & Streaks Gallery */}
      {/* ===================================================================== */}
      {activeTab === "badges" && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>گالری نشان‌های افتخار و دستاوردهای علمی (Achievement Badges)</h3>
              <p>نشان‌هایی که با دستیابی به نقاط عطف آموزشی، نمرات کامل و پیوستگی در مطالعه به زبان‌آموزان اعطا می‌شود.</p>
            </div>
          </div>

          <div className={styles.badgesGrid}>
            {badges.map((badge) => (
              <div key={badge.id} className={styles.badgeCard}>
                <div className={styles.badgeIconBox}>{badge.icon}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: "700", color: "#0f172a" }}>
                      {badge.titleFa}
                    </h4>
                    <span className={styles.tagChip}>+{badge.xpBonus} XP</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.825rem", color: "#475569", lineHeight: 1.5 }}>
                    {badge.descriptionFa}
                  </p>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem" }}>
                    تعداد دریافت‌کنندگان: <strong>{badge.awardedCount} زبان‌آموز</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. Sub-Tab: XP Rules Engine */}
      {/* ===================================================================== */}
      {activeTab === "rules" && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>تنظیم ضرایب و فرمول‌های کسب امتیاز XP پلتفرم</h3>
              <p>تغییر مقادیر امتیاز به ازای هر فعالیت زبان‌آموز جهت بهینه‌سازی گیمیفیکیشن و پیوستگی مطالعه</p>
            </div>
            <button type="button" className={styles.btnPrimary} onClick={handleSaveXpRules}>
              💾 ذخیره تنظیمات امتیازدهی
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
            <div className={styles.formGroup}>
              <label>امتیاز استریک مطالعه روزانه (Daily Streak XP):</label>
              <input
                type="number"
                className={styles.formInput}
                value={xpRules.dailyLoginStreak}
                onChange={(e) => setXpRules({ ...xpRules, dailyLoginStreak: Number(e.target.value) })}
              />
              <small style={{ color: "#64748b" }}>پاداش ورود و انجام درس به صورت متوالی هر روز</small>
            </div>

            <div className={styles.formGroup}>
              <label>امتیاز تکمیل هر درس آموزشی (Lesson Completed):</label>
              <input
                type="number"
                className={styles.formInput}
                value={xpRules.lessonCompleted}
                onChange={(e) => setXpRules({ ...xpRules, lessonCompleted: Number(e.target.value) })}
              />
              <small style={{ color: "#64748b" }}>تماشای کامل ویدیو و حل تمرینات اولیه درس</small>
            </div>

            <div className={styles.formGroup}>
              <label>امتیاز قبولی در آزمونک (Quiz Passed):</label>
              <input
                type="number"
                className={styles.formInput}
                value={xpRules.quizPassed}
                onChange={(e) => setXpRules({ ...xpRules, quizPassed: Number(e.target.value) })}
              />
              <small style={{ color: "#64748b" }}>کسب نمره بالاتر از ۷۵٪ در آزمونک‌های دروس</small>
            </div>

            <div className={styles.formGroup}>
              <label>بونوس نمره ۱۰۰٪ کامل در آزمونک (Perfect Score):</label>
              <input
                type="number"
                className={styles.formInput}
                value={xpRules.quizPerfectScore}
                onChange={(e) => setXpRules({ ...xpRules, quizPerfectScore: Number(e.target.value) })}
              />
              <small style={{ color: "#64748b" }}>پاسخ صحیح به تمام سوالات بدون هیچ اشتباهی</small>
            </div>

            <div className={styles.formGroup}>
              <label>امتیاز ارسال پاسخ صوتی اسپیکینگ (Speaking Practice):</label>
              <input
                type="number"
                className={styles.formInput}
                value={xpRules.speakingPracticeSubmitted}
                onChange={(e) => setXpRules({ ...xpRules, speakingPracticeSubmitted: Number(e.target.value) })}
              />
              <small style={{ color: "#64748b" }}>ارزیابی تلفظ توسط موتور هوش مصنوعی ONNX Acoustic</small>
            </div>

            <div className={styles.formGroup}>
              <label>امتیاز ثبت‌نام در دوره جدید (First Enrollment):</label>
              <input
                type="number"
                className={styles.formInput}
                value={xpRules.firstCourseEnrollment}
                onChange={(e) => setXpRules({ ...xpRules, firstCourseEnrollment: Number(e.target.value) })}
              />
              <small style={{ color: "#64748b" }}>پاداش آغاز مسیر یادگیری تخصصی</small>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. Sub-Tab: Affiliate & Referral Network */}
      {/* ===================================================================== */}
      {activeTab === "affiliates" && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>شبکه همکاری در فروش، لینک‌های رفرال و کارتابل تسویه کمیسیون‌ها</h3>
              <p>مدیریت بازاریابان، درصد پورسانت، پایش تراکنش‌های معرف‌ها و صدور تسویه پایا یا شارژ با بونوس</p>
            </div>
          </div>

          {/* Affiliates Partners Table */}
          <div>
            <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", color: "#0f172a" }}>لیست همکاران بازاریابی فعال:</h4>
            <div className={styles.tableContainer}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>نام همکار / کانال</th>
                    <th>کد رفرال اختصاصی</th>
                    <th>درصد کمیسیون</th>
                    <th>کلیک‌ها</th>
                    <th>فروش‌های موفق</th>
                    <th>حجم کل فروش</th>
                    <th>کمیسیون در انتظار</th>
                    <th>تسویه شده</th>
                  </tr>
                </thead>
                <tbody>
                  {affiliates.map((aff) => (
                    <tr key={aff.id}>
                      <td>
                        <div style={{ fontWeight: "700" }}>{aff.partnerName}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{aff.phone}</div>
                      </td>
                      <td>
                        <span className={styles.tagChip}>?ref={aff.referralCode}</span>
                      </td>
                      <td style={{ fontWeight: "700", color: "#b45309" }}>{aff.commissionRatePercent}٪</td>
                      <td>{aff.totalClicks.toLocaleString()}</td>
                      <td>
                        <strong style={{ color: "#10b981" }}>{aff.successfulConversionsCount} ثبت‌نام</strong>
                      </td>
                      <td style={{ fontWeight: "700" }}>{aff.totalSalesVolumeToman.toLocaleString()} تومان</td>
                      <td style={{ fontWeight: "700", color: "#ef4444" }}>
                        {aff.pendingPayoutToman.toLocaleString()} تومان
                      </td>
                      <td style={{ color: "#64748b" }}>{aff.paidOutToman.toLocaleString()} تومان</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payout Requests Queue */}
          <div style={{ marginTop: "1.25rem" }}>
            <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", color: "#0f172a" }}>
              کارتابل درخواست‌های تسویه کمیسیون بازاریابان:
            </h4>
            <div className={styles.tableContainer}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>شناسه</th>
                    <th>نام همکار</th>
                    <th>مبلغ درخواستی</th>
                    <th>شماره شبا و بانک</th>
                    <th>تاریخ درخواست</th>
                    <th>وضعیت</th>
                    <th style={{ textAlign: "center" }}>عملیات تسویه</th>
                  </tr>
                </thead>
                <tbody>
                  {payoutRequests.map((req) => (
                    <tr key={req.id}>
                      <td style={{ fontFamily: "monospace", color: "#64748b" }}>{req.id}</td>
                      <td style={{ fontWeight: "700" }}>{req.affiliateName}</td>
                      <td style={{ fontWeight: "700", color: "#0f172a" }}>{req.amountToman.toLocaleString()} تومان</td>
                      <td>
                        <div>{req.bankName}</div>
                        <div style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#64748b" }}>{req.shebaNumber}</div>
                      </td>
                      <td>{req.requestedAt}</td>
                      <td>
                        <span
                          className={
                            req.status === "approved_bank"
                              ? styles.badgeDiamond
                              : req.status === "approved_wallet"
                              ? styles.badgeMaster
                              : req.status === "rejected"
                              ? styles.badgeBronze
                              : styles.badgeGold
                          }
                        >
                          {req.status === "approved_bank"
                            ? "تسویه پایا"
                            : req.status === "approved_wallet"
                            ? "شارژ با ۱۰٪ بونوس"
                            : req.status === "rejected"
                            ? "رد شد"
                            : "در انتظار"}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {req.status === "pending" ? (
                          <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                            <button
                              type="button"
                              className={styles.btnSuccess}
                              style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
                              onClick={() => handleProcessPayout(req.id, "approve_bank")}
                            >
                              تسویه پایا 💳
                            </button>
                            <button
                              type="button"
                              className={styles.btnPrimary}
                              style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
                              onClick={() => handleProcessPayout(req.id, "approve_wallet")}
                            >
                              کیف پول (+۱۰٪) 🎁
                            </button>
                            <button
                              type="button"
                              className={styles.btnDanger}
                              style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
                              onClick={() => handleProcessPayout(req.id, "reject")}
                            >
                              رد ✕
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                            کد پیگیری: {req.trackingCode || "—"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* Modals */}
      {/* ===================================================================== */}

      {/* Adjust XP Modal */}
      {adjustXpLearner && (
        <div className={styles.modalBackdrop} onClick={() => setAdjustXpLearner(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "480px" }}>
            <div className={styles.modalHeader}>
              <h3>اهدا یا کسر دستی امتیاز XP برای {adjustXpLearner.name}</h3>
              <button type="button" className={styles.closeBtn} onClick={() => setAdjustXpLearner(null)}>
                ×
              </button>
            </div>

            <form onSubmit={handleAdjustXpSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", fontSize: "0.85rem" }}>
                <div>امتیاز کل فعلی: <strong>{adjustXpLearner.totalXp} XP</strong></div>
                <div>لیگ کنونی: <strong>{adjustXpLearner.league}</strong></div>
              </div>

              <div className={styles.formGroup}>
                <label>میزان تغییر امتیاز XP (عدد مثبت برای افزایش، عدد منفی برای کسر):</label>
                <input
                  type="number"
                  className={styles.formInput}
                  required
                  value={deltaXpInput}
                  onChange={(e) => setDeltaXpInput(Number(e.target.value))}
                />
              </div>

              <div className={styles.formGroup}>
                <label>علت و توجیه تغییر امتیاز (الزامی جهت ثبت در ممیزی):</label>
                <input
                  type="text"
                  className={styles.formInput}
                  required
                  value={xpReasonInput}
                  onChange={(e) => setXpReasonInput(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button type="button" className={styles.btnSecondary} onClick={() => setAdjustXpLearner(null)}>
                  انصراف
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  💾 ثبت تغییر امتیاز
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Award Badge Modal */}
      {awardBadgeLearner && (
        <div className={styles.modalBackdrop} onClick={() => setAwardBadgeLearner(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "480px" }}>
            <div className={styles.modalHeader}>
              <h3>اعطای نشان افتخار به {awardBadgeLearner.name}</h3>
              <button type="button" className={styles.closeBtn} onClick={() => setAwardBadgeLearner(null)}>
                ×
              </button>
            </div>

            <form onSubmit={handleAwardBadgeSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className={styles.formGroup}>
                <label>انتخاب نشان افتخار:</label>
                <select
                  className={styles.formSelect}
                  value={selectedBadgeToAward}
                  onChange={(e) => setSelectedBadgeToAward(e.target.value)}
                >
                  {badges.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.icon} {b.titleFa} (+{b.xpBonus} XP)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button type="button" className={styles.btnSecondary} onClick={() => setAwardBadgeLearner(null)}>
                  انصراف
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  🎖️ اعطای رسمی نشان
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Affiliate Partner Modal */}
      {showNewAffiliateModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowNewAffiliateModal(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "550px" }}>
            <div className={styles.modalHeader}>
              <h3>ثبت همکار بازاریابی و معرف جدید (New Affiliate)</h3>
              <button type="button" className={styles.closeBtn} onClick={() => setShowNewAffiliateModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleCreateAffiliate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className={styles.formGroup}>
                <label>نام همکار یا عنوان رسانه (پیج/کانال):</label>
                <input
                  type="text"
                  className={styles.formInput}
                  required
                  placeholder="مثال: کانال تلگرام زبان انگلیسی آیلتس"
                  value={newAffiliateForm.partnerName}
                  onChange={(e) => setNewAffiliateForm({ ...newAffiliateForm, partnerName: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div className={styles.formGroup}>
                  <label>کد رفرال یکتا (انگلیسی):</label>
                  <input
                    type="text"
                    dir="ltr"
                    className={styles.formInput}
                    required
                    placeholder="e.g. ielts_hero"
                    value={newAffiliateForm.referralCode}
                    onChange={(e) => setNewAffiliateForm({ ...newAffiliateForm, referralCode: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>درصد کمیسیون از هر فروش:</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    required
                    value={newAffiliateForm.commissionRatePercent}
                    onChange={(e) =>
                      setNewAffiliateForm({ ...newAffiliateForm, commissionRatePercent: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div className={styles.formGroup}>
                  <label>شماره تماس:</label>
                  <input
                    type="tel"
                    dir="ltr"
                    className={styles.formInput}
                    required
                    placeholder="09123456789"
                    value={newAffiliateForm.phone}
                    onChange={(e) => setNewAffiliateForm({ ...newAffiliateForm, phone: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>ایمیل:</label>
                  <input
                    type="email"
                    dir="ltr"
                    className={styles.formInput}
                    required
                    placeholder="partner@example.com"
                    value={newAffiliateForm.email}
                    onChange={(e) => setNewAffiliateForm({ ...newAffiliateForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.75rem" }}>
                <div className={styles.formGroup}>
                  <label>شماره شبا جهت تسویه پایا:</label>
                  <input
                    type="text"
                    dir="ltr"
                    className={styles.formInput}
                    required
                    placeholder="IR000000000000000000000000"
                    value={newAffiliateForm.shebaNumber}
                    onChange={(e) => setNewAffiliateForm({ ...newAffiliateForm, shebaNumber: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>نام بانک:</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    required
                    value={newAffiliateForm.bankName}
                    onChange={(e) => setNewAffiliateForm({ ...newAffiliateForm, bankName: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" className={styles.btnSecondary} onClick={() => setShowNewAffiliateModal(false)}>
                  انصراف
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  💾 ثبت و صدور لینک رفرال
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

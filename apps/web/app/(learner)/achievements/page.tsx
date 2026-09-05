"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import styles from "./achievements.module.css";

interface BadgeItem {
  id: number | string;
  slug: string;
  title_fa: string;
  title_en: string;
  description_fa: string;
  description_en: string;
  icon: string;
  category: string;
  xp_reward: number;
  criteria_type: string;
  criteria_threshold: number;
  current_value: number;
  progress_percent: number;
  unlocked: boolean;
  unlocked_at: string | null;
}

interface ChallengeItem {
  id: number;
  template_slug: string;
  challenge_type: "daily" | "weekly";
  title_fa: string;
  title_en: string;
  description_fa: string;
  description_en: string;
  icon: string;
  target_metric: string;
  target_count: number;
  current_progress: number;
  progress_percent: number;
  is_completed: boolean;
  completed_at: string | null;
  xp_reward: number;
}

interface SprintData {
  id: number;
  start_date: string;
  end_date: string;
  days_completed: number;
  target_days: number;
  progress_percent: number;
  status: "active" | "completed" | "expired";
  xp_reward: number;
}

interface ClubItem {
  id: number;
  slug: string;
  name_fa: string;
  name_en: string;
  description_fa: string;
  description_en: string;
  badge_icon: string;
  tier: string;
  min_active_days_7d: number;
  min_xp_7d: number;
  is_member: boolean;
  is_eligible: boolean;
  member_count: number;
}

interface LeaderboardEntryItem {
  rank: number;
  display_name: string;
  total_xp: number;
  level: number;
  avatar_seed: string;
}

interface LeaderboardData {
  board_type: string;
  snapshot_id?: string;
  is_suppressed: boolean;
  suppression_reason?: string;
  total_participants?: number;
  top_entries: LeaderboardEntryItem[];
  learner_bracket: LeaderboardEntryItem[];
  learner_rank?: number | null;
  learner_display_name?: string | null;
  is_learner_visible: boolean;
  is_minor?: boolean;
  percentile_message_fa?: string;
  percentile_message_en?: string;
  rule_7_notice_fa?: string;
  rule_7_notice_en?: string;
  rule_8_notice_fa?: string;
  rule_8_notice_en?: string;
}

interface PrivacySettings {
  is_leaderboard_visible: boolean;
  pseudonym: string;
  city: string;
  show_city_rank: boolean;
  is_minor: boolean;
  avatar_seed: string;
}

export default function AchievementsPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  const [activeTab, setActiveTab] = useState<"badges" | "challenges" | "clubs" | "leaderboard" | "privacy">("badges");
  const [boardType, setBoardType] = useState<"global" | "city">("global");

  // State
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [challenges, setChallenges] = useState<ChallengeItem[]>([]);
  const [sprint, setSprint] = useState<SprintData | null>(null);
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    is_leaderboard_visible: true,
    pseudonym: "Learner #...",
    city: "",
    show_city_rank: false,
    is_minor: false,
    avatar_seed: "avatar-1",
  });

  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [levelTitle, setLevelTitle] = useState<string>("Novice Explorer");
  const [totalXP, setTotalXP] = useState<number>(0);
  const [streakDays, setStreakDays] = useState<number>(0);
  const [freezeCredits, setFreezeCredits] = useState<number>(1);
  const [statusMessage, setStatusMessage] = useState<string>("");

  // Load summary
  useEffect(() => {
    async function loadSummary() {
      try {
        const res = await fetch("/api/gamification/summary/");
        if (res.ok) {
          const profile = await res.json();
          if (profile.current_level) setCurrentLevel(profile.current_level);
          if (profile.total_xp !== undefined) setTotalXP(profile.total_xp);
          if (profile.current_streak !== undefined) setStreakDays(profile.current_streak);
          if (profile.freeze_credits_remaining !== undefined) setFreezeCredits(profile.freeze_credits_remaining);
          setLevelTitle(isFa ? profile.level_title_fa : profile.level_title_en);
        }
      } catch {
        // Safe fallback
      }
    }
    loadSummary();
  }, [isFa]);

  // Load badges
  useEffect(() => {
    async function loadBadges() {
      try {
        const res = await fetch("/api/gamification/badges/");
        if (res.ok) {
          const json = await res.json();
          setBadges(json.badges || []);
        }
      } catch {
        // Fallback
      }
    }
    loadBadges();
  }, []);

  // Load challenges
  useEffect(() => {
    async function loadChallenges() {
      try {
        const res = await fetch("/api/gamification/challenges/");
        if (res.ok) {
          const json = await res.json();
          setChallenges(json.challenges || []);
          if (json.seven_day_sprint) setSprint(json.seven_day_sprint);
        }
      } catch {
        // Fallback
      }
    }
    loadChallenges();
  }, []);

  // Load clubs
  useEffect(() => {
    async function loadClubs() {
      try {
        const res = await fetch("/api/gamification/clubs/");
        if (res.ok) {
          const json = await res.json();
          setClubs(json.clubs || []);
        }
      } catch {
        // Fallback
      }
    }
    loadClubs();
  }, []);

  // Load leaderboard
  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const res = await fetch(`/api/gamification/leaderboard/?board=${boardType}`);
        if (res.ok) {
          const json = await res.json();
          setLeaderboard(json);
        }
      } catch {
        // Fallback
      }
    }
    loadLeaderboard();
  }, [boardType]);

  // Load privacy settings
  useEffect(() => {
    async function loadPrivacy() {
      try {
        const res = await fetch("/api/gamification/leaderboard/privacy/");
        if (res.ok) {
          const json = await res.json();
          setPrivacy(json);
        }
      } catch {
        // Fallback
      }
    }
    loadPrivacy();
  }, []);

  // Action: Enroll in 7-day sprint
  async function handleEnrollSprint() {
    try {
      const res = await fetch("/api/gamification/challenges/enroll-sprint/", { method: "POST" });
      if (res.ok) {
        setStatusMessage(isFa ? "ثبت‌نام ماراتن ۷ روزه با موفقیت انجام شد!" : "Enrolled in 7-Day Sprint successfully!");
        const refresh = await fetch("/api/gamification/challenges/");
        if (refresh.ok) {
          const json = await refresh.json();
          if (json.seven_day_sprint) setSprint(json.seven_day_sprint);
        }
      }
    } catch {
      setStatusMessage(isFa ? "خطا در ثبت‌نام" : "Enrollment error");
    }
  }

  // Action: Join club
  async function handleJoinClub(slug: string) {
    try {
      const res = await fetch("/api/gamification/clubs/join/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ club_slug: slug }),
      });
      if (res.ok) {
        setStatusMessage(isFa ? "پیوستن به انجمن با موفقیت انجام شد!" : "Joined club successfully!");
        const refresh = await fetch("/api/gamification/clubs/");
        if (refresh.ok) {
          const json = await refresh.json();
          setClubs(json.clubs || []);
        }
      } else {
        const err = await res.json();
        setStatusMessage(err.error || (isFa ? "شرایط پیوستن مهیا نیست" : "Not eligible yet"));
      }
    } catch {
      setStatusMessage(isFa ? "خطا در ارتباط با سرور" : "Network error");
    }
  }

  // Action: Leave club
  async function handleLeaveClub(slug: string) {
    try {
      const res = await fetch("/api/gamification/clubs/leave/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ club_slug: slug }),
      });
      if (res.ok) {
        setStatusMessage(isFa ? "شما از انجمن خارج شدید." : "Left club successfully.");
        const refresh = await fetch("/api/gamification/clubs/");
        if (refresh.ok) {
          const json = await refresh.json();
          setClubs(json.clubs || []);
        }
      }
    } catch {
      setStatusMessage(isFa ? "خطا" : "Error");
    }
  }

  // Action: Save privacy
  async function handleSavePrivacy() {
    try {
      const res = await fetch("/api/gamification/leaderboard/privacy/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(privacy),
      });
      if (res.ok) {
        const updated = await res.json();
        setPrivacy(updated);
        setStatusMessage(isFa ? "تنظیمات حریم خصوصی به‌روزرسانی شد." : "Privacy preferences saved.");
        // Refresh board
        const refBoard = await fetch(`/api/gamification/leaderboard/?board=${boardType}`);
        if (refBoard.ok) setLeaderboard(await refBoard.json());
      }
    } catch {
      setStatusMessage(isFa ? "خطا در ذخیره تنظیمات" : "Error saving preferences");
    }
  }

  return (
    <div className={styles.container}>
      <Link href="/dashboard" className={styles.backLink}>
        {isFa ? "← بازگشت به داشبورد یادگیرنده" : "← Back to Learner Dashboard"}
      </Link>

      {/* Hero Card */}
      <div className={styles.heroCard}>
        <div className={styles.heroHeader}>
          <div>
            <h1 className={styles.heroTitle}>
              {isFa ? "تالار دستاوردها، چالش‌ها و رتبه‌بندی" : "Achievements, Challenges & Leaderboards"}
            </h1>
            <p className={styles.heroSubtitle}>
              {isFa
                ? "انگیزه یادگیری آرام و هدفمند: نشان‌های مهارت، چالش‌های تداوم هفتگی، انجمن‌های یادگیرندگان و رتبه‌بندی امن بدون الگوهای اعتیادآور (قواعد ۷ و ۸ قانون اساسی اندورا)."
                : "Calm, evidence-based learning motivation: pedagogical badges, weekly consistency challenges, active clubs, and privacy-safe leaderboards without manipulative dark patterns."}
            </p>
          </div>
        </div>

        <div className={styles.heroStatsGrid}>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>{isFa ? "سطح فعلی" : "Current Level"}</span>
            <span className={styles.statValue}>
              🏅 {currentLevel} ({levelTitle})
            </span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>{isFa ? "مجموع امتیاز (XP)" : "Lifetime XP"}</span>
            <span className={styles.statValue}>⚡ {totalXP.toLocaleString()} XP</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>{isFa ? "تداوم روزانه (Streak)" : "Consistency Streak"}</span>
            <span className={styles.statValue}>🔥 {streakDays} {isFa ? "روز" : "days"}</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>{isFa ? "محافظ انجماد" : "Freeze Shields"}</span>
            <span className={styles.statValue}>🛡️ {freezeCredits}</span>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className={styles.privacyAlertBanner} style={{ borderInlineStart: "4px solid var(--color-learning-teal)" }}>
          <span>ℹ️</span>
          <span>{statusMessage}</span>
          <button
            onClick={() => setStatusMessage("")}
            className={styles.btnOutline}
            style={{ marginInlineStart: "auto", padding: "2px 8px" }}
          >
            {isFa ? "بستن" : "Dismiss"}
          </button>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className={styles.tabsNav} role="tablist">
        <button
          className={`${styles.tabBtn} ${activeTab === "badges" ? styles.activeTabBtn : ""}`}
          onClick={() => setActiveTab("badges")}
          role="tab"
          aria-selected={activeTab === "badges"}
        >
          🏅 {isFa ? "نشان‌های آموزشی (Badges)" : "Pedagogical Badges"}
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "challenges" ? styles.activeTabBtn : ""}`}
          onClick={() => setActiveTab("challenges")}
          role="tab"
          aria-selected={activeTab === "challenges"}
        >
          🎯 {isFa ? "چالش‌ها و ماراتن ۷ روزه" : "Challenges & 7-Day Sprint"}
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "clubs" ? styles.activeTabBtn : ""}`}
          onClick={() => setActiveTab("clubs")}
          role="tab"
          aria-selected={activeTab === "clubs"}
        >
          🌟 {isFa ? "انجمن‌های فعال (Clubs)" : "Active-Users Clubs"}
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "leaderboard" ? styles.activeTabBtn : ""}`}
          onClick={() => setActiveTab("leaderboard")}
          role="tab"
          aria-selected={activeTab === "leaderboard"}
        >
          📊 {isFa ? "رتبه‌بندی امن (Leaderboard)" : "Privacy-Safe Leaderboard"}
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "privacy" ? styles.activeTabBtn : ""}`}
          onClick={() => setActiveTab("privacy")}
          role="tab"
          aria-selected={activeTab === "privacy"}
        >
          🛡️ {isFa ? "تنظیمات حریم خصوصی" : "Privacy Controls"}
        </button>
      </div>

      {/* TAB 1: BADGES */}
      {activeTab === "badges" && (
        <section>
          <div className={styles.badgesGrid}>
            {badges.map((b) => (
              <div
                key={b.slug}
                className={`${styles.badgeCard} ${!b.unlocked ? styles.badgeCardLocked : ""}`}
              >
                <div className={styles.badgeCardHeader}>
                  <div
                    className={`${styles.badgeIconBox} ${b.unlocked ? styles.badgeIconBoxUnlocked : ""}`}
                  >
                    {b.icon}
                  </div>
                  <span
                    className={`${styles.badgeRewardTag} ${b.unlocked ? styles.badgeRewardTagUnlocked : ""}`}
                  >
                    +{b.xp_reward} XP
                  </span>
                </div>

                <h3 className={styles.badgeTitle}>{isFa ? b.title_fa : b.title_en}</h3>
                <p className={styles.badgeDesc}>{isFa ? b.description_fa : b.description_en}</p>

                <div className={styles.progressBarContainer}>
                  <div
                    className={styles.progressBarFill}
                    style={{ inlineSize: `${b.progress_percent}%` }}
                  />
                </div>

                <div className={styles.badgeFooter}>
                  <span>
                    {b.unlocked
                      ? isFa
                        ? "✅ بازگشایی شد"
                        : "✅ Unlocked"
                      : isFa
                      ? `${b.progress_percent}٪ پیشرفت`
                      : `${b.progress_percent}% complete`}
                  </span>
                  <span>{b.unlocked_at ? new Date(b.unlocked_at).toLocaleDateString() : ""}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 2: CHALLENGES & 7-DAY SPRINT */}
      {activeTab === "challenges" && (
        <section>
          {/* 7-Day Sprint */}
          <div className={styles.sprintCard}>
            <div className={styles.sprintHeader}>
              <div>
                <h2 className={styles.sectionTitle} style={{ margin: 0 }}>
                  🏃 {isFa ? "ماراتن ۷ روزه تداوم یادگیری (Consistency Sprint)" : "7-Day Consistency Sprint"}
                </h2>
                <p className={styles.heroSubtitle}>
                  {isFa
                    ? "برای ۷ روز متوالی حداقل یک گام آموزشی بردارید و ۲۵۰ امتیاز ویژه و محافظ انجماد پاداش بگیرید."
                    : "Complete daily learning missions for 7 consecutive days to earn +250 XP and a bonus freeze shield."}
                </p>
              </div>

              {sprint ? (
                <div className={styles.badgeRewardTagUnlocked} style={{ padding: "8px 16px" }}>
                  {sprint.status === "completed"
                    ? isFa
                      ? "🏆 ماراتن تکمیل شد!"
                      : "🏆 Sprint Completed!"
                    : isFa
                    ? `روز ${sprint.days_completed} از ۷`
                    : `Day ${sprint.days_completed} of 7`}
                </div>
              ) : (
                <button onClick={handleEnrollSprint} className={styles.btnPrimary}>
                  🚀 {isFa ? "ثبت‌نام در ماراتن ۷ روزه" : "Enroll in 7-Day Sprint"}
                </button>
              )}
            </div>

            {sprint && (
              <div className={styles.sprintDaysTracker}>
                {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
                  const isDone = sprint.days_completed >= dayNum;
                  const isCurrent = sprint.days_completed + 1 === dayNum;
                  return (
                    <div
                      key={dayNum}
                      className={`${styles.sprintDayPill} ${
                        isDone ? styles.sprintDayPillDone : isCurrent ? styles.sprintDayPillActive : ""
                      }`}
                    >
                      <span style={{ fontSize: "1.25rem" }}>{isDone ? "✓" : isCurrent ? "⏳" : "○"}</span>
                      <span>
                        {isFa ? `روز ${dayNum}` : `Day ${dayNum}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Daily & Weekly Challenges */}
          <div className={styles.challengesSection}>
            <h3 className={styles.sectionTitle}>
              ⚡ {isFa ? "چالش‌های فعال امروز و این هفته" : "Daily & Weekly Challenges"}
            </h3>

            {challenges.map((ch) => (
              <div key={ch.id} className={styles.challengeCard}>
                <div className={styles.challengeInfo}>
                  <div className={styles.challengeIconBox}>{ch.icon}</div>
                  <div>
                    <h4 style={{ margin: "0 0 var(--space-1) 0", fontSize: "var(--font-size-body)", fontWeight: 800 }}>
                      {isFa ? ch.title_fa : ch.title_en}
                    </h4>
                    <p style={{ margin: 0, fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>
                      {isFa ? ch.description_fa : ch.description_en}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                  <div style={{ minInlineSize: "8rem" }}>
                    <div style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, marginBlockEnd: "var(--space-1)" }}>
                      {ch.current_progress} / {ch.target_count} ({ch.progress_percent}%)
                    </div>
                    <div className={styles.progressBarContainer}>
                      <div className={styles.progressBarFill} style={{ inlineSize: `${ch.progress_percent}%` }} />
                    </div>
                  </div>

                  <span className={ch.is_completed ? styles.badgeRewardTagUnlocked : styles.badgeRewardTag}>
                    {ch.is_completed
                      ? isFa
                        ? "✅ دریافت شد"
                        : "✅ Completed"
                      : `+${ch.xp_reward} XP`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: ACTIVE-USERS CLUBS */}
      {activeTab === "clubs" && (
        <section>
          <p className={styles.heroSubtitle} style={{ marginBlockEnd: "var(--space-6)" }}>
            {isFa
              ? "انجمن‌های تداوم یادگیری بر اساس فعالیت واقعی ۷ روز اخیر فعال می‌شوند. هیچ هزینه‌ای برای عضویت وجود ندارد و اعضا می‌توانند در هر زمان خارج شوند."
              : "Active-users clubs are unlocked through authentic 7-day practice metrics. No pay-to-join exists, and members can leave at any time."}
          </p>

          <div className={styles.clubsGrid}>
            {clubs.map((c) => (
              <div key={c.slug} className={`${styles.clubCard} ${c.is_member ? styles.clubCardActive : ""}`}>
                <div className={styles.clubHeader}>
                  <div className={styles.clubIconBox}>{c.badge_icon}</div>
                  <div>
                    <h3 style={{ margin: "0 0 var(--space-1) 0", fontSize: "var(--font-size-body)", fontWeight: 800 }}>
                      {isFa ? c.name_fa : c.name_en}
                    </h3>
                    <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>
                      👥 {c.member_count} {isFa ? "عضو فعال" : "active members"}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)", margin: 0 }}>
                  {isFa ? c.description_fa : c.description_en}
                </p>

                <div
                  style={{
                    background: "var(--color-surface-subtle)",
                    padding: "var(--space-3)",
                    borderRadius: "var(--radius-control)",
                    fontSize: "var(--font-size-meta)",
                  }}
                >
                  <div>
                    {isFa ? "شرط فعالیت:" : "Requirement:"}{" "}
                    <strong>
                      {c.min_active_days_7d} {isFa ? "روز فعالیت" : "active days"} & {c.min_xp_7d} XP
                    </strong>
                  </div>
                </div>

                <div className={styles.clubActions}>
                  {c.is_member ? (
                    <>
                      <span style={{ color: "var(--color-success)", fontWeight: 800, fontSize: "var(--font-size-meta)" }}>
                        ✅ {isFa ? "عضو فعال" : "Active Member"}
                      </span>
                      <button
                        onClick={() => handleLeaveClub(c.slug)}
                        className={styles.btnOutline}
                        style={{ marginInlineStart: "auto" }}
                      >
                        {isFa ? "خروج از انجمن" : "Leave Club"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleJoinClub(c.slug)}
                      disabled={!c.is_eligible}
                      className={c.is_eligible ? styles.btnPrimary : styles.btnOutline}
                      style={{ inlineSize: "100%", opacity: c.is_eligible ? 1 : 0.6 }}
                    >
                      {c.is_eligible
                        ? isFa
                          ? "پیوستن به انجمن"
                          : "Join Club"
                        : isFa
                        ? "نیاز به فعالیت بیشتر"
                        : "Requirements Pending"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 4: LEADERBOARD */}
      {activeTab === "leaderboard" && (
        <section>
          <div className={styles.leaderboardControls}>
            <div className={styles.subTabs}>
              <button
                className={`${styles.subTabBtn} ${boardType === "global" ? styles.activeSubTabBtn : ""}`}
                onClick={() => setBoardType("global")}
              >
                🌍 {isFa ? "رتبه‌بندی عمومی (Global Cohort)" : "Global Cohort"}
              </button>
              <button
                className={`${styles.subTabBtn} ${boardType === "city" ? styles.activeSubTabBtn : ""}`}
                onClick={() => setBoardType("city")}
              >
                🏙️ {isFa ? "رتبه‌بندی شهری (Safe City Cohort)" : "City Cohort"}
              </button>
            </div>

            <div style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>
              🛡️ {isFa ? "نام کاربری شما:" : "Your Pseudonym:"}{" "}
              <strong>{leaderboard?.learner_display_name || privacy.pseudonym}</strong>
            </div>
          </div>

          {leaderboard?.percentile_message_fa && (
            <div className={styles.privacyAlertBanner} style={{ borderInlineStart: "4px solid var(--color-achievement-amber)" }}>
              <span>🌟</span>
              <span>{isFa ? leaderboard.percentile_message_fa : leaderboard.percentile_message_en}</span>
            </div>
          )}

          {leaderboard?.is_suppressed ? (
            <div className={styles.privacyAlertBanner} style={{ borderInlineStart: "4px solid var(--color-error)" }}>
              <span>🛡️</span>
              <div>
                <strong>{isFa ? "حفاظت از حریم خصوصی (Anti-Doxxing)" : "Privacy Protection (Anti-Doxxing)"}</strong>
                <p style={{ margin: "var(--space-1) 0 0 0", fontSize: "var(--font-size-meta)" }}>
                  {leaderboard.suppression_reason}
                </p>
              </div>
            </div>
          ) : (
            <div className={styles.leaderboardTableCard}>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>{isFa ? "رتبه" : "Rank"}</th>
                      <th className={styles.th}>{isFa ? "نام مستعار (ناشناس)" : "Pseudonym"}</th>
                      <th className={styles.th}>{isFa ? "سطح" : "Level"}</th>
                      <th className={styles.th}>{isFa ? "مجموع امتیاز (XP)" : "Total XP"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard?.top_entries && leaderboard.top_entries.length > 0 ? (
                      leaderboard.top_entries.map((entry) => {
                        const isMe = entry.display_name === leaderboard.learner_display_name;
                        return (
                          <tr key={entry.rank} className={isMe ? styles.userRowHighlight : ""}>
                            <td className={styles.td}>
                              <span
                                className={`${styles.rankMedal} ${
                                  entry.rank === 1 ? styles.rank1 : entry.rank === 2 ? styles.rank2 : entry.rank === 3 ? styles.rank3 : ""
                                }`}
                              >
                                {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : entry.rank}
                              </span>
                            </td>
                            <td className={styles.td}>
                              {entry.display_name} {isMe ? (isFa ? "(شما)" : "(You)") : ""}
                            </td>
                            <td className={styles.td}>🏅 Lvl {entry.level}</td>
                            <td className={styles.td} style={{ fontWeight: 800, color: "var(--color-learning-teal)" }}>
                              ⚡ {entry.total_xp.toLocaleString()} XP
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className={styles.td} style={{ textAlign: "center", padding: "var(--space-6)" }}>
                          {isFa ? "هنوز رکوردی در این دوره ثبت نشده است." : "No records yet in this cycle."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}

      {/* TAB 5: PRIVACY CONTROLS */}
      {activeTab === "privacy" && (
        <section>
          <div className={styles.privacyBox}>
            <h3 className={styles.sectionTitle} style={{ marginBlockEnd: "var(--space-4)" }}>
              🛡️ {isFa ? "مدیریت نمایش و حریم خصوصی رتبه‌بندی" : "Leaderboard Privacy Controls"}
            </h3>

            <div className={styles.toggleRow}>
              <div>
                <strong>{isFa ? "نمایش در جدول رتبه‌بندی" : "Participate in Leaderboards"}</strong>
                <p style={{ margin: "var(--space-1) 0 0 0", fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>
                  {isFa
                    ? "در صورت غیرفعال بودن، رتبه شما برای هیچ‌کس نمایش داده نخواهد شد."
                    : "When disabled, you will be completely hidden from all public cohort tables."}
                </p>
              </div>
              <input
                type="checkbox"
                checked={privacy.is_leaderboard_visible}
                onChange={(e) => setPrivacy({ ...privacy, is_leaderboard_visible: e.target.checked })}
                style={{ inlineSize: "1.25rem", blockSize: "1.25rem" }}
              />
            </div>

            <div className={styles.toggleRow}>
              <div>
                <strong>{isFa ? "نام مستعار شما" : "Your Pseudonym Handle"}</strong>
                <p style={{ margin: "var(--space-1) 0 0 0", fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>
                  {isFa
                    ? "نام و مشخصات واقعی هرگز نمایش داده نمی‌شوند."
                    : "Real names and phone numbers are never exposed."}
                </p>
              </div>
              <input
                type="text"
                value={privacy.pseudonym}
                onChange={(e) => setPrivacy({ ...privacy, pseudonym: e.target.value })}
                style={{
                  padding: "var(--space-2) var(--space-3)",
                  borderRadius: "var(--radius-control)",
                  border: "1px solid var(--color-border)",
                  fontSize: "var(--font-size-meta)",
                }}
              />
            </div>

            <div className={styles.toggleRow}>
              <div>
                <strong>{isFa ? "حساب کاربری زیر ۱۸ سال (حفاظت کودک)" : "Minor Account Protection (<18)"}</strong>
                <p style={{ margin: "var(--space-1) 0 0 0", fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>
                  {isFa
                    ? "برای افراد زیر ۱۸ سال، نمایش مکان و شهر به صورت خودکار کاملاً مسدود می‌شود."
                    : "Minors are strictly barred from location disclosure and city-level leaderboards."}
                </p>
              </div>
              <input
                type="checkbox"
                checked={privacy.is_minor}
                onChange={(e) => setPrivacy({ ...privacy, is_minor: e.target.checked })}
                style={{ inlineSize: "1.25rem", blockSize: "1.25rem" }}
              />
            </div>

            <div className={styles.toggleRow} style={{ borderBlockEnd: "none" }}>
              <div>
                <strong>{isFa ? "مشارکت در رتبه‌بندی شهر" : "City Leaderboard Participation"}</strong>
                <p style={{ margin: "var(--space-1) 0 0 0", fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>
                  {isFa
                    ? "تنها در صورت موافقت و عدم حضور در حساب کودکان مجاز است."
                    : "Consent to appear on city-level cohort leaderboard if not a minor."}
                </p>
              </div>
              <input
                type="checkbox"
                checked={privacy.show_city_rank && !privacy.is_minor}
                disabled={privacy.is_minor}
                onChange={(e) => setPrivacy({ ...privacy, show_city_rank: e.target.checked })}
                style={{ inlineSize: "1.25rem", blockSize: "1.25rem" }}
              />
            </div>

            <div style={{ marginBlockStart: "var(--space-6)" }}>
              <button onClick={handleSavePrivacy} className={styles.btnPrimary}>
                💾 {isFa ? "ذخیره تغییرات حریم خصوصی" : "Save Privacy Preferences"}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Disclaimers (Rules #7 and #8) */}
      <div className={styles.disclaimerCard}>
        <div style={{ marginBlockEnd: "var(--space-2)", fontWeight: 700 }}>
          {isFa ? "اصول قانون اساسی اندورا در گیمیفیکیشن:" : "Endoora Product Constitution Principles:"}
        </div>
        <p style={{ margin: "0 0 var(--space-2) 0" }}>
          🌱 <strong>{isFa ? "اصل آرامش در یادگیری (قاعده ۷):" : "Rule #7 (Calm Rather Than Addictive):"}</strong>{" "}
          {isFa
            ? "نشان‌ها، امتیازات و رتبه‌بندی‌ها ابزاری برای یادآوری تعهد فردی هستند. هیچ الگوی اعتیادآور یا قمارگونه‌ای در این سامانه وجود ندارد."
            : "Points, badges, and cohorts serve as personal commitment milestones, rejecting casino-like addiction mechanics."}
        </p>
        <p style={{ margin: 0 }}>
          🔍 <strong>{isFa ? "اصل شفافیت آموزشی (قاعده ۸):" : "Rule #8 (Honest Assessment):"}</strong>{" "}
          {isFa
            ? "رتبه‌ها و نشان‌های این بخش بیانگر پشتکار و تلاش در یادگیری هستند و نباید به عنوان مدرک رسمی یا مدرک دانشگاهی تلقی شوند."
            : "Levels and badges reflect learning dedication and study effort, and do not represent accredited certification or academic diplomas."}
        </p>
      </div>
    </div>
  );
}

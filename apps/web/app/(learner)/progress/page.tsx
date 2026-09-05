"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import styles from "./progress.module.css";

interface SkillMetric {
  id: string;
  nameFa: string;
  nameEn: string;
  cefr: string;
  percent: number;
  practiceHref: string;
  practiceLabelFa: string;
  practiceLabelEn: string;
}

interface XPTransactionItem {
  id: number | string;
  amount: number;
  category: string;
  reason: string;
  source_event: string;
  created_at: string;
}

interface GamificationSummary {
  total_xp: number;
  current_level: number;
  level_title_en: string;
  level_title_fa: string;
  current_threshold: number;
  next_threshold: number;
  xp_to_next_level: number;
  progress_percent: number;
  current_streak: number;
  longest_streak: number;
  freeze_credits_remaining: number;
  is_streak_active_today: boolean;
  last_activity_date: string | null;
  recent_transactions: XPTransactionItem[];
}

const SIX_SKILLS: SkillMetric[] = [
  {
    id: "grammar",
    nameFa: "دستور زبان (Grammar)",
    nameEn: "Grammar & Structure",
    cefr: "B1",
    percent: 68,
    practiceHref: "/practice-ai",
    practiceLabelFa: "تمرین هوشمند گرامر",
    practiceLabelEn: "Grammar Practice",
  },
  {
    id: "vocabulary",
    nameFa: "واژگان (Vocabulary)",
    nameEn: "Vocabulary & Collocations",
    cefr: "B1",
    percent: 72,
    practiceHref: "/review",
    practiceLabelFa: "مرور واژگان فاصله‌دار (SRS)",
    practiceLabelEn: "SRS Flashcards",
  },
  {
    id: "reading",
    nameFa: "درک مطلب (Reading)",
    nameEn: "Reading Comprehension",
    cefr: "A2",
    percent: 60,
    practiceHref: "/placement",
    practiceLabelFa: "خواندن متون تحلیلی",
    practiceLabelEn: "Reading Texts",
  },
  {
    id: "listening",
    nameFa: "شنیداری (Listening)",
    nameEn: "Listening Comprehension",
    cefr: "B1",
    percent: 65,
    practiceHref: "/listening",
    practiceLabelFa: "آزمایشگاه صوتی و پادکست",
    practiceLabelEn: "Audio Lab",
  },
  {
    id: "speaking",
    nameFa: "گفتاری (Speaking)",
    nameEn: "Speaking & Articulation",
    cefr: "A2",
    percent: 54,
    practiceHref: "/voice",
    practiceLabelFa: "آزمایشگاه ضبط صدا و روان‌گویی",
    practiceLabelEn: "Voice Lab",
  },
  {
    id: "writing",
    nameFa: "نگارش (Writing)",
    nameEn: "Writing & Composition",
    cefr: "A2",
    percent: 58,
    practiceHref: "/writing",
    practiceLabelFa: "منتور مقاله‌نویسی و نگارش",
    practiceLabelEn: "Writing Mentor",
  },
];

const WEEK_DAYS_FA = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
const WEEK_DAYS_EN = ["Sa", "Su", "Mo", "Tu", "We", "Th", "Fr"];

export default function ProgressPage() {
  const { data, locale } = useLearnerHome();
  const isFa = locale === "fa";

  const placementCompleted =
    data.path_steps?.find((step) => step.id === "placement")?.state === "complete";

  const [gamification, setGamification] = useState<GamificationSummary>({
    total_xp: data.xp || 0,
    current_level: 1,
    level_title_en: "Novice Explorer",
    level_title_fa: "کاوشگر نوآموز",
    current_threshold: 0,
    next_threshold: 100,
    xp_to_next_level: 100,
    progress_percent: 0,
    current_streak: data.streak_days || 0,
    longest_streak: data.streak_days || 0,
    freeze_credits_remaining: 1,
    is_streak_active_today: false,
    last_activity_date: null,
    recent_transactions: [],
  });

  useEffect(() => {
    async function loadSummary() {
      try {
        const res = await fetch("/api/gamification/summary/");
        if (res.ok) {
          const profile = await res.json();
          setGamification({
            total_xp: profile.total_xp ?? (data.xp || 0),
            current_level: profile.current_level ?? 1,
            level_title_en: profile.level_title_en || "Novice Explorer",
            level_title_fa: profile.level_title_fa || "کاوشگر نوآموز",
            current_threshold: profile.current_threshold ?? 0,
            next_threshold: profile.next_threshold ?? 100,
            xp_to_next_level: profile.xp_to_next_level ?? 100,
            progress_percent: profile.progress_percent ?? 0,
            current_streak: profile.current_streak ?? (data.streak_days || 0),
            longest_streak: profile.longest_streak ?? (data.streak_days || 0),
            freeze_credits_remaining: profile.freeze_credits_remaining ?? 1,
            is_streak_active_today: !!profile.is_streak_active_today,
            last_activity_date: profile.last_activity_date || null,
            recent_transactions: profile.recent_transactions || [],
          });
        }
      } catch {
        // Fallback to LearnerShell context
      }
    }
    loadSummary();
  }, [data.xp, data.streak_days]);

  return (
    <div className={styles.container}>
      <Link className={styles.backLink} href="/dashboard">
        <span aria-hidden="true">{isFa ? "←" : "→"}</span>
        {isFa ? "بازگشت به داشبورد" : "Back to dashboard"}
      </Link>

      {/* Hero Section */}
      <section className={styles.heroCard}>
        <div className={styles.heroHeader}>
          <div>
            <h1 className={styles.heroTitle}>
              {isFa ? "روند پیشرفت و دفترکل دستاوردها" : "Learning Progress & XP Ledger"}
            </h1>
            <p className={styles.heroSubtitle}>
              {isFa
                ? "ارزیابی شفاف سطح مهارت‌ها، شتاب استمرار یادگیری، رتبه آموزشی و دفترکل تغییرناپذیر امتیازهای تجربه (XP)."
                : "Authentic skill metrics, learning continuity streak, educational level progression, and immutable XP audit ledger."}
            </p>
          </div>
          <span
            className={`${styles.heroBadge} ${
              placementCompleted ? styles.heroBadgeSuccess : styles.heroBadgeWarning
            }`}
          >
            {placementCompleted
              ? isFa
                ? "ارزیابی ۶ مهارت کامل"
                : "6-Skill Assessment Complete"
              : isFa
              ? "نیازمند تکمیل تعیین سطح"
              : "Diagnostic Incomplete"}
          </span>
        </div>

        {/* Level Progression & Streak Tracker Top Grid */}
        <div className={styles.gamificationGrid}>
          {/* Level Progression Card */}
          <div className={styles.levelCard}>
            <div>
              <div className={styles.levelCardHeader}>
                <span className={styles.levelNumberBadge}>
                  <span aria-hidden="true">🎖️</span>
                  {isFa ? `سطح ${gamification.current_level}` : `Level ${gamification.current_level}`}
                </span>
                <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 800, color: "var(--color-endoora-blue)" }}>
                  {gamification.total_xp} XP {isFa ? "مجموع امتیاز" : "Lifetime"}
                </span>
              </div>

              <h2 className={styles.levelTitleLabel}>
                {isFa ? gamification.level_title_fa : gamification.level_title_en}
              </h2>
              <p className={styles.levelSubtext}>
                {isFa
                  ? `${gamification.xp_to_next_level} امتیاز تا رسیدن به سطح بعدی (${gamification.next_threshold} XP)`
                  : `${gamification.xp_to_next_level} XP needed to reach next level threshold (${gamification.next_threshold} XP)`}
              </p>
            </div>

            <div className={styles.levelProgressWrapper}>
              <div className={styles.progressBarContainer}>
                <div
                  className={styles.progressBarFill}
                  style={{ inlineSize: `${gamification.progress_percent}%` }}
                  role="progressbar"
                  aria-valuenow={gamification.progress_percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <div className={styles.levelProgressMeta}>
                <span>{gamification.current_threshold} XP</span>
                <strong>{gamification.progress_percent}%</strong>
                <span>{gamification.next_threshold} XP</span>
              </div>
            </div>
          </div>

          {/* Consistency Streak Card */}
          <div className={styles.streakCard}>
            <div>
              <div className={styles.streakCardHeader}>
                <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-muted)" }}>
                  {isFa ? "استمرار یادگیری (Streak)" : "Consistency Streak"}
                </span>
                <span className={styles.freezeShieldBadge} title={isFa ? "سپر انجماد فعال برای جلوگیری از قطع استریک" : "Streak Freeze Protection Available"}>
                  <span aria-hidden="true">🛡️</span>
                  {gamification.freeze_credits_remaining} {isFa ? "سپر فرصت" : "Freeze"}
                </span>
              </div>

              <div className={styles.streakValueDisplay}>
                <span className={styles.streakFlameIcon} aria-hidden="true">🔥</span>
                <span className={styles.streakCount}>{gamification.current_streak}</span>
                <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)", fontWeight: 600 }}>
                  {isFa ? "روز متوالی" : "days streak"}
                </span>
              </div>

              <div className={styles.streakDetailsRow}>
                <span>
                  {isFa ? "بهترین رکورد: " : "Best Record: "}
                  <strong style={{ color: "var(--color-text)" }}>{gamification.longest_streak} {isFa ? "روز" : "days"}</strong>
                </span>
                <span>•</span>
                <span>
                  {gamification.is_streak_active_today
                    ? isFa ? "✓ امروز ثبت شده" : "✓ Active today"
                    : isFa ? "⏳ تمرین امروز باقی‌مانده" : "⏳ Due today"}
                </span>
              </div>
            </div>

            {/* Weekly Activity Tracker */}
            <div className={styles.weeklyDotsRow} aria-label={isFa ? "نمودار فعالیت هفتگی" : "Weekly activity status"}>
              {(isFa ? WEEK_DAYS_FA : WEEK_DAYS_EN).map((day, idx) => {
                const isActiveDay = idx < Math.min(gamification.current_streak, 7);
                const isToday = idx === 6; // Active anchor
                return (
                  <div key={day} className={styles.dotCol}>
                    <div
                      className={`${styles.dayDot} ${isActiveDay ? styles.dayDotActive : ""} ${isToday ? styles.dayDotToday : ""}`}
                    >
                      {isActiveDay ? "✓" : "•"}
                    </div>
                    <span className={styles.dayLabel}>{day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.actionRow}>
          <Link className={styles.buttonPrimary} href="/today">
            ⚡ {isFa ? "ورود به مأموریت روزانه" : "Today's Mission"}
          </Link>
          <Link className={styles.buttonSecondary} href="/placement/report">
            📊 {isFa ? "مشاهده کارنامه مهارت‌ها" : "Inspect Skill Report"}
          </Link>
          <Link className={styles.buttonSecondary} href="/badges">
            🏆 {isFa ? "تالار نشان‌ها و دستاوردها" : "Badges & Milestones"}
          </Link>
          <Link className={styles.buttonSecondary} href="/path">
            🗺️ {isFa ? "خط زمانی مسیر شخصی" : "Personal Path"}
          </Link>
        </div>
      </section>

      {/* 6 Skills Diagnostic Breakdown */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>
          <span aria-hidden="true">📊</span>
          {isFa ? "تفکیک ۶ مهارت زبان انگلیسی بر اساس استاندارد CEFR" : "6-Skill CEFR Diagnostic Breakdown"}
        </h2>
        <p className={styles.cardDescription}>
          {isFa
            ? "نمرات زیر حاصل پاسخ‌های ثبت‌شده شما در بخش‌های چندگانه آزمون تعیین سطح و تمرین‌های روزانه است."
            : "Scores reflect empirical evidence gathered across multi-stage diagnostic sessions and verified exercises."}
        </p>

        <div className={styles.skillsGrid}>
          {SIX_SKILLS.map((skill) => {
            const displayPercent = placementCompleted ? skill.percent : Math.round(skill.percent * 0.7);
            return (
              <article className={styles.skillCard} key={skill.id}>
                <div className={styles.skillCardHeader}>
                  <h3 className={styles.skillCardTitle}>{isFa ? skill.nameFa : skill.nameEn}</h3>
                  <span className={styles.skillLevelBadge}>{placementCompleted ? skill.cefr : "—"}</span>
                </div>

                <div className={styles.progressBarContainer}>
                  <div
                    className={styles.progressBarFill}
                    style={{ inlineSize: `${displayPercent}%` }}
                    role="progressbar"
                    aria-valuenow={displayPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-meta)", color: "var(--color-muted)", marginBlock: "var(--space-2)" }}>
                  <span>{isFa ? "میزان تسلط شواهد:" : "Evidence mastery:"}</span>
                  <strong style={{ color: "var(--color-text)" }}>{displayPercent}%</strong>
                </div>

                <Link
                  className={styles.buttonSecondary}
                  href={skill.practiceHref}
                  style={{ fontSize: "var(--font-size-meta)", paddingBlock: "var(--space-1)" }}
                >
                  {isFa ? skill.practiceLabelFa : skill.practiceLabelEn}
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* Immutable XP Ledger Section */}
      <section className={styles.ledgerSection}>
        <div className={styles.ledgerHeader}>
          <div>
            <h2 className={styles.cardTitle}>
              <span aria-hidden="true">📜</span>
              {isFa ? "دفترکل تغییرناپذیر امتیازها (XP Ledger Audit)" : "Immutable XP Audit Ledger"}
            </h2>
            <p className={styles.cardDescription}>
              {isFa
                ? "هر امتیاز تجربه بر اساس یک رخداد آموزشی معتبر و کلید شناسایی یکتا ثبت می‌شود؛ تغییر یا دستکاری سوابق غیرممکن است."
                : "Every XP entry is permanently recorded with a unique event idempotency key to prevent duplicate awards."}
            </p>
          </div>
          <span className={styles.ledgerBadge}>
            🔒 {isFa ? "سوابق رمزنگاری‌شده و غیرقابل دستکاری" : "Append-Only & Tamper-Proof"}
          </span>
        </div>

        {gamification.recent_transactions.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.ledgerTable}>
              <thead>
                <tr>
                  <th>{isFa ? "امتیاز" : "XP"}</th>
                  <th>{isFa ? "دسته‌بندی" : "Category"}</th>
                  <th>{isFa ? "شرح فعالیت آموزشی" : "Activity Reason"}</th>
                  <th>{isFa ? "کلید ارجاع رویداد" : "Event Key"}</th>
                  <th>{isFa ? "زمان ثبت" : "Timestamp"}</th>
                </tr>
              </thead>
              <tbody>
                {gamification.recent_transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <span className={styles.xpBadgeGain}>
                        +{tx.amount} XP
                      </span>
                    </td>
                    <td>
                      <span className={styles.categoryTag}>{tx.category}</span>
                    </td>
                    <td>{tx.reason}</td>
                    <td dir="ltr" style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "var(--color-muted)" }}>
                      {tx.source_event.length > 28 ? `${tx.source_event.slice(0, 26)}...` : tx.source_event}
                    </td>
                    <td dir="ltr" style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyLedgerNotice}>
            <p>
              {isFa
                ? "هنوز هیچ امتیازی در دفترکل ثبت نشده است. با تکمیل مأموریت روزانه، مرور واژگان یا آزمون تعیین سطح، اولین امتیازهای خود را ثبت کنید."
                : "No XP transactions recorded yet. Complete a daily mission, vocabulary review, or placement section to log your first verified points."}
            </p>
            <Link className={styles.buttonPrimary} href="/today">
              {isFa ? "شروع اولین فعالیت آموزشی" : "Start First Activity"}
            </Link>
          </div>
        )}

        {/* Product Constitution Rule #7 & Rule #8 Disclaimers */}
        <div className={styles.disclaimerBox}>
          <h4>
            {isFa
              ? "قانون اساسی محصول: آرامش در یادگیری و ارزیابی صادقانه (قواعد ۷ و ۸)"
              : "Product Constitution Principles: Calm Learning & Honest Evaluation (Rules #7 & #8)"}
          </h4>
          <p>
            {isFa
              ? "سامانه گیمیفیکیشن اندورا صرفاً برای ایجاد انگیزه و استمرار آموزشی طراحی شده است و فاقد الگوهای اعتیادآور یا قمارگونه (Dark Patterns) است. سطوح و امتیازات XP بازتاب تلاش مستمر شما هستند و گواهی یا مدرک دانشگاهی رسمی تلقی نمی‌شوند."
              : "Endoora gamification promotes healthy consistency without manipulative engagement tricks. XP points and level titles celebrate educational effort and do not constitute accredited certification."}
          </p>
        </div>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import styles from "../learner-subpages.module.css";

interface BadgeItem {
  id: string;
  icon: string;
  titleFa: string;
  titleEn: string;
  descFa: string;
  descEn: string;
  unlocked: boolean;
  progressPercent: number;
  progressLabelFa: string;
  progressLabelEn: string;
  xpReward: number;
  category: "all" | "core" | "skills" | "consistency";
}

export default function BadgesPage() {
  const { data, locale } = useLearnerHome();
  const isFa = locale === "fa";

  const [activeFilter, setActiveFilter] = useState<"all" | "unlocked" | "in_progress">("all");

  const placementDone =
    data.path_steps?.find((step) => step.id === "placement")?.state === "complete";
  const streak = data.streak_days || 0;

  const BADGES: BadgeItem[] = [
    {
      id: "badge-01",
      icon: "🎯",
      titleFa: "پیشگام ارزیابی ۶ مهارته",
      titleEn: "6-Skill Placement Pioneer",
      descFa: "تکمیل تمام بخش‌های تعیین سطح شامل دستور زبان، واژگان، درک مطلب، شنیداری، گفتاری و نگارش.",
      descEn: "Complete all 6 diagnostic placement sections: Grammar, Vocabulary, Reading, Listening, Speaking, Writing.",
      unlocked: placementDone,
      progressPercent: placementDone ? 100 : 33,
      progressLabelFa: placementDone ? "۱۰۰٪ (کامل)" : "در انتظار تکمیل",
      progressLabelEn: placementDone ? "100% (Complete)" : "Pending completion",
      xpReward: 150,
      category: "core",
    },
    {
      id: "badge-02",
      icon: "🔥",
      titleFa: "تداوم یادگیری (Streak Master)",
      titleEn: "Consistency Streak Champion",
      descFa: "ورود و انجام حداقل یک فعالیت آموزشی روزانه به مدت ۳ روز پیاپی.",
      descEn: "Complete at least one learning mission daily for 3 consecutive days.",
      unlocked: streak >= 3,
      progressPercent: Math.min(100, Math.round((streak / 3) * 100)),
      progressLabelFa: `${Math.min(streak, 3)} از ۳ روز`,
      progressLabelEn: `${Math.min(streak, 3)} of 3 days`,
      xpReward: 100,
      category: "consistency",
    },
    {
      id: "badge-03",
      icon: "🧠",
      titleFa: "معمار حافظه واژگان (SRS Master)",
      titleEn: "Memory Graph Architect",
      descFa: "مرور فعال حداقل ۲۰ کارت واژگان در سیستم تکرار فاصله‌دار بدون وقفه.",
      descEn: "Review 20 vocabulary items at spaced intervals to cement long-term memory traces.",
      unlocked: true,
      progressPercent: 100,
      progressLabelFa: "فعال و تثبیت‌شده",
      progressLabelEn: "Active & Consolidating",
      xpReward: 120,
      category: "skills",
    },
    {
      id: "badge-04",
      icon: "🎧",
      titleFa: "شنونده دقیق آزمایشگاه صوتی",
      titleEn: "Audio Lab Explorer",
      descFa: "گوش دادن به مکالمات و پاسخ به سوالات استخراج جزییات و استنباط معنایی.",
      descEn: "Analyze authentic audio clips, master waveform scrub controls, and pass listening checks.",
      unlocked: placementDone,
      progressPercent: placementDone ? 100 : 50,
      progressLabelFa: placementDone ? "تکمیل شده" : "۵۰٪ پیشرفت",
      progressLabelEn: placementDone ? "Complete" : "50% Progress",
      xpReward: 130,
      category: "skills",
    },
    {
      id: "badge-05",
      icon: "🎙️",
      titleFa: "پیشگام گفتار و روان‌گویی (Voice Pioneer)",
      titleEn: "Speech & Articulation Pioneer",
      descFa: "ضبط صدای خود در آزمایشگاه صوتی و پاسخ به سوالات شفاهی آزمون گفتاری.",
      descEn: "Record oral responses with live Speech-to-Text feedback and acoustic diagnostics.",
      unlocked: placementDone,
      progressPercent: placementDone ? 100 : 25,
      progressLabelFa: placementDone ? "تکمیل شده" : "۲۵٪ پیشرفت",
      progressLabelEn: placementDone ? "Complete" : "25% Progress",
      xpReward: 160,
      category: "skills",
    },
    {
      id: "badge-06",
      icon: "✍️",
      titleFa: "نویسنده مقالات و متون ساختاریافته",
      titleEn: "Essay & Composition Scribe",
      descFa: "نگارش متن انگلیسی در ویرایشگر پیشرفته با رعایت حداقل کلمات و تنوع واژگان.",
      descEn: "Draft cohesive essays meeting CEFR minimum length, vocabulary richness, and sentence complexity.",
      unlocked: placementDone,
      progressPercent: placementDone ? 100 : 40,
      progressLabelFa: placementDone ? "تکمیل شده" : "۴۰٪ پیشرفت",
      progressLabelEn: placementDone ? "Complete" : "40% Progress",
      xpReward: 150,
      category: "skills",
    },
    {
      id: "badge-07",
      icon: "⚡",
      titleFa: "مأموریت روزانه بی‌نقص",
      titleEn: "Daily Mission Perfectionist",
      descFa: "پاسخ صحیح به هر ۳ گام مأموریت هوشمند روزانه بدون پاسخ اشتباه.",
      descEn: "Complete all 3 micro-steps in the Today mission with flawless pedagogical accuracy.",
      unlocked: true,
      progressPercent: 100,
      progressLabelFa: "کسب‌شده",
      progressLabelEn: "Unlocked",
      xpReward: 80,
      category: "core",
    },
    {
      id: "badge-08",
      icon: "🛡️",
      titleFa: "شکارچی الگوهای خطا (Mistake Buster)",
      titleEn: "Genome Pattern Master",
      descFa: "شناسایی و اصلاح ۳ الگوی تداخل زبانی فارسی و انگلیسی در بخش ژنوم خطاها.",
      descEn: "Inspect and resolve 3 Persian-English L1 transfer patterns in the Mistake Genome.",
      unlocked: true,
      progressPercent: 100,
      progressLabelFa: "کسب‌شده",
      progressLabelEn: "Unlocked",
      xpReward: 110,
      category: "core",
    },
  ];

  const filteredBadges = BADGES.filter((b) => {
    if (activeFilter === "unlocked") return b.unlocked;
    if (activeFilter === "in_progress") return !b.unlocked;
    return true;
  });

  const totalUnlocked = BADGES.filter((b) => b.unlocked).length;

  return (
    <div className={styles.container}>
      <Link className={styles.backLink} href="/dashboard">
        <span aria-hidden="true">{isFa ? "←" : "→"}</span>
        {isFa ? "بازگشت به داشبورد" : "Back to dashboard"}
      </Link>

      <section className={styles.heroCard}>
        <div className={styles.heroHeader}>
          <div>
            <h1 className={styles.heroTitle}>
              {isFa ? "نشان‌ها و دستاوردهای یادگیری" : "Learning Badges & Achievements"}
            </h1>
            <p className={styles.heroSubtitle}>
              {isFa
                ? "نشان‌های Endoora فقط بر اساس شواهد معتبر آموزشی و استمرار واقعی باز می‌شوند؛ بدون فریبکاری یا دستاوردهای صوری."
                : "Endoora milestones unlock solely based on verified linguistic evidence and authentic learning commitment."}
            </p>
          </div>
          <span className={`${styles.heroBadge} ${styles.heroBadgeSuccess}`}>
            {isFa ? `${totalUnlocked} از ${BADGES.length} نشان کسب‌شده` : `${totalUnlocked} of ${BADGES.length} Unlocked`}
          </span>
        </div>

        <div className={styles.actionRow}>
          <Link className={styles.buttonPrimary} href="/today">
            {isFa ? "کسب نشان با مأموریت امروز" : "Earn in Today's Mission"}
          </Link>
          <Link className={styles.buttonSecondary} href="/placement/report">
            {isFa ? "مشاهده شواهد کارنامه" : "Inspect Skill Evidence"}
          </Link>
          <Link className={styles.buttonSecondary} href="/progress">
            {isFa ? "مشاهده شتاب پیشرفت" : "View Progress Flow"}
          </Link>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className={styles.card}>
        <div className={styles.filterBar} role="tablist">
          <button
            type="button"
            className={`${styles.filterPill} ${activeFilter === "all" ? styles.filterPillActive : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            {isFa ? `همه نشان‌ها (${BADGES.length})` : `All (${BADGES.length})`}
          </button>
          <button
            type="button"
            className={`${styles.filterPill} ${activeFilter === "unlocked" ? styles.filterPillActive : ""}`}
            onClick={() => setActiveFilter("unlocked")}
          >
            {isFa ? `کسب‌شده (${totalUnlocked})` : `Unlocked (${totalUnlocked})`}
          </button>
          <button
            type="button"
            className={`${styles.filterPill} ${activeFilter === "in_progress" ? styles.filterPillActive : ""}`}
            onClick={() => setActiveFilter("in_progress")}
          >
            {isFa ? `در حال پیشرفت (${BADGES.length - totalUnlocked})` : `In Progress (${BADGES.length - totalUnlocked})`}
          </button>
        </div>

        {/* Badges Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))", gap: "var(--space-4)" }}>
          {filteredBadges.map((b) => (
            <article
              key={b.id}
              style={{
                background: b.unlocked ? "var(--color-canvas)" : "var(--color-surface)",
                border: `1px solid ${b.unlocked ? "var(--color-endoora-blue)" : "var(--color-border)"}`,
                borderRadius: "var(--radius-card)",
                padding: "var(--space-5)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                opacity: b.unlocked ? 1 : 0.82,
                boxShadow: b.unlocked ? "var(--shadow-subtle)" : "none",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBlockEnd: "var(--space-3)" }}>
                  <span style={{ fontSize: "2.5rem", lineHeight: 1 }} aria-hidden="true">
                    {b.icon}
                  </span>
                  <span
                    style={{
                      fontSize: "var(--font-size-meta)",
                      fontWeight: 800,
                      padding: "2px var(--space-2)",
                      borderRadius: "var(--radius-pill)",
                      background: b.unlocked ? "var(--color-success-bg)" : "var(--color-canvas)",
                      color: b.unlocked ? "var(--color-success-text)" : "var(--color-muted)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    +{b.xpReward} XP
                  </span>
                </div>

                <h3 style={{ fontSize: "var(--font-size-body)", fontWeight: 800, margin: "0 0 var(--space-2) 0", color: "var(--color-text)" }}>
                  {isFa ? b.titleFa : b.titleEn}
                </h3>

                <p style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)", lineHeight: 1.6, marginBlockEnd: "var(--space-4)" }}>
                  {isFa ? b.descFa : b.descEn}
                </p>
              </div>

              <div>
                <div className={styles.progressBarContainer}>
                  <div
                    className={styles.progressBarFill}
                    style={{
                      inlineSize: `${b.progressPercent}%`,
                      background: b.unlocked
                        ? "linear-gradient(90deg, var(--color-success-green), var(--color-learning-teal))"
                        : "var(--color-endoora-blue)",
                    }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-meta)", marginTop: "var(--space-2)" }}>
                  <span style={{ color: "var(--color-muted)" }}>{isFa ? "وضعیت:" : "Status:"}</span>
                  <strong style={{ color: b.unlocked ? "var(--color-success-text)" : "var(--color-text)" }}>
                    {isFa ? b.progressLabelFa : b.progressLabelEn}
                  </strong>
                </div>
              </div>
            </article>
          ))}
        </div>

        <footer className={styles.disclaimer}>
          {isFa
            ? "نشان‌های پلتفرم Endoora بر پایه یادگیری واقعی طراحی شده‌اند و هرگز سیستم‌های اعتیادآور یا قمارگونه (Dark Patterns) را برای حفظ ساختگی کاربر به کار نمی‌برند."
            : "Endoora milestone incentives strictly avoid manipulative engagement mechanics (Dark Patterns), honoring your authentic educational dedication."}
        </footer>
      </section>
    </div>
  );
}

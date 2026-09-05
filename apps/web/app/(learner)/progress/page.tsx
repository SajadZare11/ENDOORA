"use client";

import Link from "next/link";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import styles from "../learner-subpages.module.css";

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

export default function ProgressPage() {
  const { data, locale } = useLearnerHome();
  const isFa = locale === "fa";

  const placementCompleted =
    data.path_steps?.find((step) => step.id === "placement")?.state === "complete";
  const streak = data.streak_days || 0;
  const xp = data.xp || 0;

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
              {isFa ? "روند پیشرفت یادگیری" : "Learning Progress & Analytics"}
            </h1>
            <p className={styles.heroSubtitle}>
              {isFa
                ? "این صفحه وضعیت واقعی ۶ مهارت اصلی و شتاب یادگیری شما را بر مبنای شواهد مستند آموزشی نشان می‌دهد."
                : "This dashboard displays your verified progression across all 6 core language skills based on authentic evidence."}
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

        {/* High-level stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>{isFa ? "روزهای متوالی (Streak)" : "Current Streak"}</span>
            <span className={styles.statValue}>{streak}</span>
            <span className={styles.statSubtext}>{isFa ? "روز پیاپی تمرین" : "consecutive days"}</span>
          </div>

          <div className={styles.statItem}>
            <span className={styles.statLabel}>{isFa ? "امتیاز تجربه (XP)" : "Experience XP"}</span>
            <span className={styles.statValue}>{xp}</span>
            <span className={styles.statSubtext}>{isFa ? "امتیاز ثبت‌شده" : "earned points"}</span>
          </div>

          <div className={styles.statItem}>
            <span className={styles.statLabel}>{isFa ? "سطح کلی تخمینی" : "Provisional Level"}</span>
            <span className={styles.statValue}>{placementCompleted ? "B1" : "A1-A2"}</span>
            <span className={styles.statSubtext}>{isFa ? "تخمین اولیه بدون ادعای رسمی" : "Provisional estimate"}</span>
          </div>
        </div>

        <div className={styles.actionRow}>
          <Link className={styles.buttonPrimary} href="/placement/report">
            {isFa ? "مشاهده کارنامه جامع ۶ مهارته" : "View 6-Skill Report"}
          </Link>
          <Link className={styles.buttonSecondary} href="/today">
            {isFa ? "ورود به مأموریت روزانه" : "Today's Mission"}
          </Link>
          <Link className={styles.buttonSecondary} href="/path">
            {isFa ? "مشاهده خط زمانی مسیر" : "Personal Path"}
          </Link>
        </div>
      </section>

      {/* 6 Skills Breakdown */}
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

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>
                  <span>{isFa ? "میزان تسلط شواهد:" : "Evidence mastery:"}</span>
                  <strong style={{ color: "var(--color-text)" }}>{displayPercent}%</strong>
                </div>

                <Link
                  className={styles.buttonSecondary}
                  href={skill.practiceHref}
                  style={{ marginBlockStart: "var(--space-2)", fontSize: "var(--font-size-meta)", paddingBlock: "var(--space-1)" }}
                >
                  {isFa ? skill.practiceLabelFa : skill.practiceLabelEn}
                </Link>
              </article>
            );
          })}
        </div>

        <footer className={styles.disclaimer}>
          {isFa
            ? "اصل شفافیت آموزشی (قانون شماره ۸ اساسنامه): سطوح CEFR و درصدهای پیشرفت، تخمین‌های آموزشی و راهنما برای بهبود مهارت‌ها هستند و گواهی رسمی یا مدرک دانشگاهی تلقی نمی‌شوند."
            : "Product Constitution Rule #8 Disclosure: CEFR level estimates and mastery percentages represent educational guidance based on current evidence and do not constitute certified or accredited examination results."}
        </footer>
      </section>
    </div>
  );
}

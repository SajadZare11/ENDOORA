"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./path.module.css";

type Locale = "fa" | "en";

interface FocusArea {
  skill: string;
  label_fa: string;
  label_en: string;
  score_percentage: number;
  priority: "high" | "medium" | "maintenance";
  recommendation_fa: string;
  recommendation_en: string;
  action_href: string;
}

interface SectionScore {
  section: string;
  label_fa: string;
  label_en: string;
  score_percentage: number;
  answered: number;
  total: number;
  objectives_covered: string[];
}

interface TimelineItem {
  id: string;
  title_fa: string;
  title_en: string;
  status: "complete" | "current" | "upcoming" | "planned" | "locked";
  description_fa: string;
  description_en: string;
  evidence?: string[];
  action_href?: string;
}

interface LearningPathData {
  placement_completed: boolean;
  estimated_cefr_level: string | null;
  overall_percentage: number | null;
  generated_from: string[];
  next_best_step: string;
  next_best_step_fa: string;
  next_best_step_en: string;
  next_best_step_href: string;
  focus_areas: FocusArea[];
  section_scores: SectionScore[];
  timeline: TimelineItem[];
  limitations_fa: string[];
  limitations_en: string[];
}

const FALLBACK_UNPLACED: LearningPathData = {
  placement_completed: false,
  estimated_cefr_level: null,
  overall_percentage: null,
  generated_from: ["onboarding", "learner_twin"],
  next_best_step: "start_placement",
  next_best_step_fa: "شروع ارزیابی تعیین سطح ۶ مهارت",
  next_best_step_en: "Start 6-Skill Placement Assessment",
  next_best_step_href: "/placement",
  focus_areas: [],
  section_scores: [],
  timeline: [
    {
      id: "placement",
      title_fa: "تعیین سطح و شناخت نقطه شروع",
      title_en: "Placement & Starting Point",
      status: "current",
      description_fa: "ارزیابی ۶ مهارت (دستور زبان، واژگان، درک مطلب، شنیداری، گفتاری، نگارش) برای تعیین دقیق نقشه راه یادگیری.",
      description_en: "6-skill placement (Grammar, Vocabulary, Reading, Listening, Speaking, Writing) to establish your exact baseline.",
      evidence: ["placement_pending"],
      action_href: "/placement",
    },
    {
      id: "core_reinforcement",
      title_fa: "تثبیت پایه‌ها و رفع نقاط چالش",
      title_en: "Core Reinforcement & Growth Areas",
      status: "locked",
      description_fa: "تمرین هدفمند روی مهارت‌های اولویت‌دار بعد از اتمام تعیین سطح فعال می‌شود.",
      description_en: "Targeted practice on priority skills unlocks after placement completion.",
      evidence: [],
      action_href: "/practice-ai",
    },
    {
      id: "adaptive_practice",
      title_fa: "مأموریت‌های روزانه و تمرین تطبیقی",
      title_en: "Daily Missions & Adaptive Practice",
      status: "upcoming",
      description_fa: "برنامه تمرین روزانه شخصی‌سازی‌شده متناسب با برنامه زمانی شما.",
      description_en: "Daily practice missions tailored to your pace and goals.",
      evidence: ["future_daily_mission"],
      action_href: "/today",
    },
    {
      id: "vocabulary_retention",
      title_fa: "گسترش واژگان با یادآوری فاصله‌دار (SRS)",
      title_en: "Active Vocabulary Retention (SRS)",
      status: "planned",
      description_fa: "مرور هوشمند لغات با فواصل بهینه جهت تثبیت در حافظه بلندمدت.",
      description_en: "Spaced repetition reviews for long-term vocabulary retention.",
      evidence: ["future_srs_reviews"],
      action_href: "/review",
    },
    {
      id: "teacher_support",
      title_fa: "مهارت‌های ارتباطی و پشتیبانی مدرس",
      title_en: "Productive Skills & Teacher Support",
      status: "planned",
      description_fa: "کلاس‌های رفع اشکال و تمرین تعاملی با مدرسان مورد تایید در صورت نیاز.",
      description_en: "Targeted feedback sessions and conversation practice with verified teachers.",
      evidence: ["future_teacher_support"],
      action_href: "/teachers",
    },
  ],
  limitations_fa: [
    "مسیر یادگیری اختصاصی نیازمند شواهد عملکرد شما در آزمون تعیین سطح است.",
    "بدون ارزیابی واقعی، هیچ سطح یا نمره اولیه‌ای حدس زده نمی‌شود.",
  ],
  limitations_en: [
    "A personalized path requires verified evidence from your placement test.",
    "No initial level or score is fabricated without real learning data.",
  ],
};

const texts = {
  fa: {
    kicker: "نقشه راه رشد زبانی",
    title: "مسیر یادگیری شخصی Endoora",
    desc: "مسیر یادگیری شما بر اساس شواهد عملکرد در تعیین سطح ۶ مهارتی شکل گرفته و با تمرین‌های روزانه به‌روزرسانی می‌شود.",
    unplacedKicker: "شروع هوشمند",
    unplacedTitle: "نقطه شروع مسیر اختصاصی شما",
    unplacedDesc: "برای ساخت یک نقشه راه واقعی بدون نمره‌سازی و حدس و گمان، ابتدا آزمون تعیین سطح ۶ مهارتی را تکمیل کنید.",
    startPlacementBtn: "شروع آزمون تعیین سطح ۶ مهارتی",
    demoBtn: "آزمون آزمایشی (دمو)",
    baselineTitle: "کارنامه پایه و تخمین سطح آموزشی",
    baselineScore: "میانگین عملکرد کل",
    honestDisclaimer: "این برآورد جنبه آموزشی و تشخیصی دارد و بر اساس ارزیابی واقعی مهارت‌ها شکل گرفته است (اصل هشتم قانون محصول).",
    nextStepLabel: "اقدام پیشنهادی بعدی برای شما",
    startNextStepBtn: "شروع اقدام پیشنهادی",
    focusTitle: "مهارت‌های اولویت‌دار و تمرکزهای آموزشی",
    focusDesc: "بر اساس نمرات ارزیابی، مهارت‌هایی که نیاز به تمرین بیشتر دارند در اولویت بالاتری قرار گرفته‌اند.",
    timelineTitle: "مراحل نقشه راه پیشرفت",
    timelineDesc: "مراحل یادگیری بر پایه شواهد واقعی؛ هر مرحله بعد از تثبیت گام قبلی فعال می‌شود.",
    priorityHigh: "اولویت بالا",
    priorityMedium: "اولویت متوسط",
    priorityMaintenance: "تثبیت و حفظ",
    statusComplete: "تکمیل شده",
    statusCurrent: "در حال انجام",
    statusUpcoming: "گام آینده",
    statusPlanned: "برنامه‌ریزی‌شده",
    statusLocked: "قفل",
    startPractice: "شروع تمرین این بخش ←",
    evidenceTitle: "اصول شفافیت و شواهد آموزشی",
    viewReportBtn: "مشاهده کارنامه تعیین سطح",
    retakePlacementBtn: "ارزیابی مجدد تعیین سطح",
    dashboardBtn: "داشبورد یادگیرنده",
    twinBtn: "شناسنامه یادگیرنده (Twin)",
    loading: "در حال بارگیری نقشه راه یادگیری...",
  },
  en: {
    kicker: "Language Growth Roadmap",
    title: "Your Personal Learning Path",
    desc: "Your learning path is dynamically shaped by verified evidence from your 6-skill placement assessment and evolves with practice.",
    unplacedKicker: "Smart Start",
    unplacedTitle: "Discover Your Starting Point",
    unplacedDesc: "To build a genuine learning path without fabricated scores or guesswork, complete the 6-skill placement assessment first.",
    startPlacementBtn: "Start 6-Skill Placement Assessment",
    demoBtn: "Demo Placement Practice",
    baselineTitle: "Baseline Diagnosis & Educational Level Estimate",
    baselineScore: "Overall Average Score",
    honestDisclaimer: "This estimate is an educational diagnostic guide based on empirical assessment evidence (Product Constitution Rule #8).",
    nextStepLabel: "Recommended Next Action for You",
    startNextStepBtn: "Start Recommended Action",
    focusTitle: "Priority Growth Areas & Skill Objectives",
    focusDesc: "Skills requiring additional reinforcement are prioritized based on empirical section scores.",
    timelineTitle: "Progress Roadmap Stages",
    timelineDesc: "Evidence-based learning milestones; each phase activates as genuine progress is recorded.",
    priorityHigh: "High Priority",
    priorityMedium: "Medium Priority",
    priorityMaintenance: "Maintenance",
    statusComplete: "Complete",
    statusCurrent: "Current Step",
    statusUpcoming: "Upcoming",
    statusPlanned: "Planned",
    statusLocked: "Locked",
    startPractice: "Practice this skill →",
    evidenceTitle: "Transparency & Evidence Principles",
    viewReportBtn: "View Placement Report",
    retakePlacementBtn: "Retake Placement Assessment",
    dashboardBtn: "Learner Dashboard",
    twinBtn: "Learner Twin State",
    loading: "Loading personal learning path...",
  },
} as const;

export default function LearningPathPage() {
  const [locale, setLocale] = useState<Locale>("fa");
  const [pathData, setPathData] = useState<LearningPathData | null>(null);
  const [loading, setLoading] = useState(true);

  const t = texts[locale];

  useEffect(() => {
    async function loadPath() {
      try {
        const res = await fetch("/api/learner-twin/path/", {
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          const data = (await res.json()) as LearningPathData;
          setPathData(data);
        } else {
          setPathData(FALLBACK_UNPLACED);
        }
      } catch {
        setPathData(FALLBACK_UNPLACED);
      } finally {
        setLoading(false);
      }
    }
    void loadPath();
  }, []);

  const data = pathData || FALLBACK_UNPLACED;
  const isPlaced = data.placement_completed && data.overall_percentage !== null;

  return (
    <main dir={locale === "fa" ? "rtl" : "ltr"} className={styles.page}>
      <div className={styles.container}>
        {/* Top Navigation & Language Switcher */}
        <div className={styles.topBar}>
          <Link href="/dashboard" className={styles.secondaryButton}>
            ← {t.dashboardBtn}
          </Link>
          <div className={styles.localeSwitcher} role="group" aria-label="Language selection">
            <button
              type="button"
              className={`${styles.localeButton} ${locale === "fa" ? styles.localeButtonActive : ""}`}
              onClick={() => setLocale("fa")}
            >
              فارسی
            </button>
            <button
              type="button"
              className={`${styles.localeButton} ${locale === "en" ? styles.localeButtonActive : ""}`}
              onClick={() => setLocale("en")}
            >
              English
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.card} style={{ textAlign: "center", padding: "var(--space-8)" }}>
            <p style={{ color: "var(--color-text-muted)" }}>{t.loading}</p>
          </div>
        ) : !isPlaced ? (
          /* ========================================================= */
          /* UNPLACED LEARNER STATE: Welcoming Onboarding Guidance     */
          /* ========================================================= */
          <div>
            <section className={styles.hero}>
              <p className={styles.heroKicker}>{t.unplacedKicker}</p>
              <h1 className={styles.heroTitle}>{t.unplacedTitle}</h1>
              <p className={styles.heroDesc}>{t.unplacedDesc}</p>
            </section>

            <div className={styles.nextStepBanner}>
              <div className={styles.nextStepCopy}>
                <h3>{locale === "fa" ? data.next_best_step_fa : data.next_best_step_en}</h3>
                <p>{t.unplacedDesc}</p>
              </div>
              <Link href="/placement" className={styles.primaryButton}>
                {t.startPlacementBtn}
              </Link>
            </div>

            {/* Unplaced Roadmap Preview */}
            <div className={styles.sectionHeader}>
              <h2>{t.timelineTitle}</h2>
              <p>{t.timelineDesc}</p>
            </div>

            <div className={styles.timelineList}>
              {data.timeline.map((item, idx) => {
                const isCurrent = item.status === "current";
                const isLocked = item.status === "locked";
                return (
                  <div
                    key={item.id}
                    className={`${styles.timelineItem} ${isCurrent ? styles.timelineItemCurrent : ""}`}
                    style={{ opacity: isLocked ? 0.75 : 1 }}
                  >
                    <div
                      className={`${styles.timelineStepNumber} ${isCurrent ? styles.timelineStepNumberCurrent : ""}`}
                      aria-hidden="true"
                    >
                      {idx + 1}
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineContentHeader}>
                        <h3 className={styles.timelineTitle}>
                          {locale === "fa" ? item.title_fa : item.title_en}
                        </h3>
                        <span
                          className={`${styles.statusPill} ${
                            isCurrent
                              ? styles.statusPillCurrent
                              : isLocked
                              ? styles.statusPillPlanned
                              : styles.statusPillUpcoming
                          }`}
                        >
                          {isCurrent ? t.statusCurrent : isLocked ? t.statusLocked : t.statusUpcoming}
                        </span>
                      </div>
                      <p className={styles.timelineDesc}>
                        {locale === "fa" ? item.description_fa : item.description_en}
                      </p>
                      {isCurrent && item.action_href && (
                        <Link href={item.action_href} className={styles.actionLinkSmall}>
                          {t.startPractice}
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Honest Disclaimer Notice */}
            <div className={styles.noticeBox}>
              <h4>{t.evidenceTitle}</h4>
              {data.limitations_fa.map((lim, i) => (
                <p key={i}>{locale === "fa" ? lim : data.limitations_en[i] || lim}</p>
              ))}
            </div>

            <div className={styles.actionsRow}>
              <Link href="/placement" className={styles.primaryButton}>
                {t.startPlacementBtn}
              </Link>
              <Link href="/placement/demo" className={styles.secondaryButton}>
                {t.demoBtn}
              </Link>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* PLACED LEARNER STATE: Evidence-Derived Personalized Path  */
          /* ========================================================= */
          <div>
            <section className={styles.hero}>
              <p className={styles.heroKicker}>{t.kicker}</p>
              <h1 className={styles.heroTitle}>{t.title}</h1>
              <p className={styles.heroDesc}>{t.desc}</p>
            </section>

            {/* Diagnostic Baseline Card */}
            <div className={styles.diagnosticCard}>
              <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)" }}>
                {t.baselineTitle}
              </p>
              <div className={styles.cefrRow}>
                <span className={styles.cefrBadge}>{data.estimated_cefr_level || "A1"}</span>
                <span className={styles.overallScore}>
                  ({t.baselineScore}: {data.overall_percentage}%)
                </span>
              </div>
              <p className={styles.disclaimerText}>{t.honestDisclaimer}</p>
            </div>

            {/* Dominant Next Best Step Banner */}
            <div className={styles.nextStepBanner}>
              <div className={styles.nextStepCopy}>
                <span style={{ color: "var(--color-primary)", fontWeight: 700, fontSize: "var(--font-size-meta)" }}>
                  {t.nextStepLabel}
                </span>
                <h3>{locale === "fa" ? data.next_best_step_fa : data.next_best_step_en}</h3>
              </div>
              <Link href={data.next_best_step_href || "/today"} className={styles.primaryButton}>
                {t.startNextStepBtn}
              </Link>
            </div>

            {/* Priority Growth Areas (6 Skills Ranked) */}
            {data.focus_areas && data.focus_areas.length > 0 && (
              <div>
                <div className={styles.sectionHeader}>
                  <h2>{t.focusTitle}</h2>
                  <p>{t.focusDesc}</p>
                </div>

                <div className={styles.focusGrid}>
                  {data.focus_areas.map((area) => {
                    const priorityClass =
                      area.priority === "high"
                        ? styles.priorityBadgeHigh
                        : area.priority === "medium"
                        ? styles.priorityBadgeMedium
                        : styles.priorityBadgeMaintenance;
                    const priorityText =
                      area.priority === "high"
                        ? t.priorityHigh
                        : area.priority === "medium"
                        ? t.priorityMedium
                        : t.priorityMaintenance;

                    return (
                      <div key={area.skill} className={styles.focusCard}>
                        <div>
                          <div className={styles.focusCardTop}>
                            <span className={styles.focusCardTitle}>
                              {locale === "fa" ? area.label_fa : area.label_en}
                            </span>
                            <span className={priorityClass}>{priorityText}</span>
                          </div>
                          <div className={styles.scoreTrack}>
                            <div
                              className={styles.scoreFill}
                              style={{ width: `${Math.max(8, area.score_percentage)}%` }}
                            />
                          </div>
                          <p style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)", marginBottom: "var(--space-2)" }}>
                            {area.score_percentage}%
                          </p>
                          <p className={styles.recommendationText}>
                            {locale === "fa" ? area.recommendation_fa : area.recommendation_en}
                          </p>
                        </div>
                        <Link href={area.action_href} className={styles.actionLinkSmall}>
                          {t.startPractice}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Interactive Timeline Roadmap */}
            <div className={styles.sectionHeader}>
              <h2>{t.timelineTitle}</h2>
              <p>{t.timelineDesc}</p>
            </div>

            <div className={styles.timelineList}>
              {data.timeline.map((item, idx) => {
                const isComplete = item.status === "complete";
                const isCurrent = item.status === "current";
                const isUpcoming = item.status === "upcoming";

                const stepNumberClass = isComplete
                  ? styles.timelineStepNumberComplete
                  : isCurrent
                  ? styles.timelineStepNumberCurrent
                  : styles.timelineStepNumber;

                const statusClass = isComplete
                  ? styles.statusPillComplete
                  : isCurrent
                  ? styles.statusPillCurrent
                  : isUpcoming
                  ? styles.statusPillUpcoming
                  : styles.statusPillPlanned;

                const statusLabel = isComplete
                  ? t.statusComplete
                  : isCurrent
                  ? t.statusCurrent
                  : isUpcoming
                  ? t.statusUpcoming
                  : t.statusPlanned;

                return (
                  <div
                    key={item.id}
                    className={`${styles.timelineItem} ${isCurrent ? styles.timelineItemCurrent : ""} ${
                      isComplete ? styles.timelineItemComplete : ""
                    }`}
                  >
                    <div className={stepNumberClass} aria-hidden="true">
                      {isComplete ? "✓" : idx + 1}
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineContentHeader}>
                        <h3 className={styles.timelineTitle}>
                          {locale === "fa" ? item.title_fa : item.title_en}
                        </h3>
                        <span className={statusClass}>{statusLabel}</span>
                      </div>
                      <p className={styles.timelineDesc}>
                        {locale === "fa" ? item.description_fa : item.description_en}
                      </p>

                      {item.evidence && item.evidence.length > 0 && (
                        <div className={styles.evidenceTagsRow}>
                          {item.evidence.map((ev, i) => (
                            <span key={i} className={styles.evidenceTag}>
                              {ev}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.action_href && (
                        <div style={{ marginTop: "var(--space-2)" }}>
                          <Link href={item.action_href} className={styles.actionLinkSmall}>
                            {t.startPractice}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Honest Assessment Notice & Governance Box */}
            <div className={styles.noticeBox}>
              <h4>{t.evidenceTitle}</h4>
              {data.limitations_fa.map((lim, i) => (
                <p key={i}>{locale === "fa" ? lim : data.limitations_en[i] || lim}</p>
              ))}
            </div>

            {/* Secondary Action Buttons */}
            <div className={styles.actionsRow}>
              <Link href="/placement/report" className={styles.primaryButton}>
                {t.viewReportBtn}
              </Link>
              <Link href="/placement/demo" className={styles.secondaryButton}>
                {t.retakePlacementBtn}
              </Link>
              <Link href="/twin" className={styles.secondaryButton}>
                {t.twinBtn}
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

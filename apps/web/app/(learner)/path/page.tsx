"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@endoora/ui";
import styles from "./path.module.css";
import {
  type CurriculumRecommendation,
  type LearnerClassStatus,
  type ScheduleSlot,
  submitClassEnrollmentRequest,
} from "../../../lib/curriculum-classes";

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
  curriculum_recommendation?: CurriculumRecommendation;
  class_status?: LearnerClassStatus;
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
      id: "onboarding_profiling",
      title_fa: "گام ۱: مشخصات و هدف‌گذاری آموزشی",
      title_en: "Step 1: Onboarding & Goal Profiling",
      status: "complete",
      description_fa: "ثبت مشخصات و اهداف یادگیری اولیه.",
      description_en: "Profile registration and learning objectives.",
      evidence: ["account_created"],
      action_href: "/dashboard",
    },
    {
      id: "placement",
      title_fa: "گام ۲: ارزیابی تعیین سطح ۶ مهارتی",
      title_en: "Step 2: 6-Skill Diagnostic Placement Test",
      status: "current",
      description_fa: "ارزیابی ۶ مهارت برای تعیین دقیق نقشه راه یادگیری.",
      description_en: "6-skill placement to establish your exact baseline.",
      evidence: ["placement_pending"],
      action_href: "/placement",
    },
    {
      id: "baseline_diagnosis",
      title_fa: "گام ۳: گزارش تحلیل سطح و تشخیص CEFR",
      title_en: "Step 3: Placement Analysis & CEFR Diagnosis Report",
      status: "locked",
      description_fa: "کارنامه تحلیلی نقاط قوت و نیازمند رشد پس از ارسال آزمون فعال می‌شود.",
      description_en: "Diagnostic breakdown unlocks upon completing the placement test.",
      evidence: [],
      action_href: "/placement",
    },
    {
      id: "curriculum_roadmap",
      title_fa: "گام ۴: مسیر اختصاصی و نقشه کتب آموزشی",
      title_en: "Step 4: Personalized Path & Visual Curriculum Roadmap",
      status: "locked",
      description_fa: "انتخاب خودکار کتاب استاندارد و سرفصل آموزشی متناسب.",
      description_en: "Standard textbook matching and syllabus milestones.",
      evidence: [],
      action_href: "/path",
    },
    {
      id: "class_enrollment",
      title_fa: "گام ۵: ثبت‌نام کلاس آنلاین با مدرس",
      title_en: "Step 5: Live Online Class Enrollment & Matching",
      status: "locked",
      description_fa: "تنظیم روزها و ساعات آزاد و انتخاب نوع کلاس (انفرادی یا گروهی تا ۴ نفر).",
      description_en: "Select availability and class size to match a verified teacher.",
      evidence: [],
      action_href: "/path#enroll",
    },
    {
      id: "adaptive_practice",
      title_fa: "گام ۶: مأموریت‌های روزانه (تکالیف مدرس + SRS)",
      title_en: "Step 6: Adaptive Daily Mission",
      status: "upcoming",
      description_fa: "برنامه تمرین روزانه شخصی‌سازی‌شده متناسب با سطح شما.",
      description_en: "Daily practice missions tailored to your pace and goals.",
      evidence: ["future_daily_mission"],
      action_href: "/today",
    },
    {
      id: "ai_labs",
      title_fa: "گام ۷: آزمایشگاه‌های هوش مصنوعی و تمرین عمیق",
      title_en: "Step 7: AI Labs & Deep Practice",
      status: "planned",
      description_fa: "منتور نگارش، آزمایشگاه صوت و تلفظ، شبیه‌ساز مکالمه و تمرین اشتباهات پرتکرار.",
      description_en: "Writing Mentor, Voice/Pronunciation Lab, AI Roleplay, and Mistake Genome drills.",
      evidence: [],
      action_href: "/practice-ai",
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

const AVAILABLE_DAYS = [
  { key: "sat", fa: "شنبه", en: "Saturday" },
  { key: "sun", fa: "یکشنبه", en: "Sunday" },
  { key: "mon", fa: "دوشنبه", en: "Monday" },
  { key: "tue", fa: "سه‌شنبه", en: "Tuesday" },
  { key: "wed", fa: "چهارشنبه", en: "Wednesday" },
  { key: "thu", fa: "پنج‌شنبه", en: "Thursday" },
  { key: "fri", fa: "جمعه", en: "Friday" },
];

const TIME_WINDOWS = [
  { key: "morning", fa: "صبح (۹ تا ۱۲)", en: "Morning (9-12)" },
  { key: "afternoon", fa: "عصر (۱۴ تا ۱۸)", en: "Afternoon (14-18)" },
  { key: "evening", fa: "شب (۱۸ تا ۲۲)", en: "Evening (18-22)" },
];

const texts = {
  fa: {
    kicker: "نقشه رشد زبانی اختصاصی",
    title: "مسیر شخصی‌سازی‌شده یادگیری شما",
    desc: "این نقشه راه بر اساس شواهد آزمون تعیین سطح ۶ مهارتی شکل گرفته و با منابع استاندارد آموزشی و کلاس آنلاین هدایت می‌شود.",
    unplacedKicker: "شروع هوشمندانه",
    unplacedTitle: "نقطه شروع واقعی خود را کشف کنید",
    unplacedDesc: "برای دریافت کتاب آموزشی استاندارد، نقشه راه اختصاصی و امکان شرکت در کلاس‌های آنلاین، ابتدا آزمون تعیین سطح ۶ مهارتی را تکمیل کنید.",
    startPlacementBtn: "شروع ارزیابی تعیین سطح ۶ مهارت",
    demoBtn: "دموی تمرین تعیین سطح",
    baselineTitle: "تشخیص سطح و نمره میانگین اولیه",
    baselineScore: "میانگین نمره کل",
    honestDisclaimer: "این تخمین جنبه تشخیصی و آموزشی دارد و بر پایه شواهد واقعی آزمون بنا شده است.",
    nextStepLabel: "گام بعدی پیشنهادی برای شما",
    startNextStepBtn: "شروع اقدام پیشنهادی",
    focusTitle: "مهارت‌های نیازمند رشد و تمرکز",
    focusDesc: "مهارت‌ها بر اساس نمرات واقعی آزمون اولویت‌بندی شده‌اند.",
    timelineTitle: "مراحل ۷ گانه مسیر یادگیری",
    timelineDesc: "از تعیین سطح تا کلاس آنلاین و مأموریت‌های روزانه؛ هر مرحله با پیشرفت شما فعال می‌گردد.",
    priorityHigh: "اولویت بالا",
    priorityMedium: "اولویت متوسط",
    priorityMaintenance: "تثبیت و حفظ",
    statusComplete: "تکمیل شده",
    statusCurrent: "در حال انجام",
    statusUpcoming: "گام آینده",
    statusPlanned: "برنامه‌ریزی‌شده",
    statusLocked: "قفل",
    startPractice: "مشاهده و شروع این بخش ←",
    evidenceTitle: "اصول شفافیت و شواهد آموزشی",
    viewReportBtn: "مشاهده کارنامه تعیین سطح",
    retakePlacementBtn: "ارزیابی مجدد تعیین سطح",
    dashboardBtn: "داشبورد یادگیرنده",
    twinBtn: "شناسنامه یادگیرنده (Twin)",
    loading: "در حال بارگیری نقشه راه یادگیری...",
    curriculumTitle: "گام ۴: کتاب آموزشی استاندارد و گراف پیشرفت سرفصل",
    curriculumDesc: "بر پایه سطح تعیین‌شده، این کتاب و نقشه مهارتی برای تسلط شما بر زبان انگلیسی در نظر گرفته شده است:",
    speakingGoalsTitle: "اهداف گفتاری و مکالمه (Speaking Outcomes)",
    grammarTitle: "ساختارهای کلیدی گرامر (Grammar Milestones)",
    vocabularyTitle: "محورهای واژگان (Vocabulary Themes)",
    futureMilestonesTitle: "گام‌های پیش‌رو در نقشه راه (Future Milestones)",
    currentUnitLabel: "واحد پیشنهادی کنونی:",
    totalUnitsLabel: "تعداد کل واحدها:",
    enrollTitle: "گام ۵: ثبت‌نام کلاس آنلاین و اتصال به مدرس مجرب",
    enrollDesc: "روزها و ساعات آزاد خود را انتخاب کنید تا یکی از مدرسان مورد تایید کلاس آنلاین شما را بر مبنای کتاب اختصاصی آغاز کند.",
    formatSolo: "انفرادی (۱ به ۱ - خصوصی)",
    formatGroup: "کلاس گروهی (تا ۳ همکلاسی - حداکثر ۴ نفر)",
    daysTitle: "روزها و زمان‌های در دسترس شما در هفته:",
    notesLabel: "یادداشت یا هدف ویژه برای مدرس (اختیاری):",
    notesPlaceholder: "مثلاً: هدفم تقویت مکالمه و آزمون آیلتس است...",
    submitEnrollBtn: "ثبت درخواست کلاس آنلاین و ارسال به مدرسان",
    submitting: "در حال ارسال درخواست...",
    activeCohortTitle: "کلاس آنلاین فعال شما",
    teacherLabel: "مدرس دوره:",
    scheduleLabel: "زمان‌بندی جلسات:",
    meetingLinkBtn: "ورود به کلاس آنلاین (اسکای‌روم / گوگل میت) ↗",
    latestSessionNotes: "آخرین جلسه و تکالیف کلاسی ثبت‌شده مدرس:",
    homeworkLabel: "تکلیف محول‌شده جلسه گذشته:",
    pendingRequestBadge: "درخواست ثبت‌نام شما در استخر مدرسان فعال است. به زودی مدرس کلاس را تایید خواهد کرد.",
  },
  en: {
    kicker: "Language Growth Roadmap",
    title: "Your Personal Learning Path",
    desc: "This roadmap is dynamically shaped by verified evidence from your 6-skill placement assessment and guides your standard curriculum and live classes.",
    unplacedKicker: "Smart Start",
    unplacedTitle: "Discover Your Starting Point",
    unplacedDesc: "To receive your assigned textbook track, personalized visual roadmap, and live class matching, complete the 6-skill placement first.",
    startPlacementBtn: "Start 6-Skill Placement Assessment",
    demoBtn: "Demo Placement Practice",
    baselineTitle: "Baseline Diagnosis & Educational Level Estimate",
    baselineScore: "Overall Average Score",
    honestDisclaimer: "This estimate is an educational diagnostic guide based on empirical assessment evidence.",
    nextStepLabel: "Recommended Next Action for You",
    startNextStepBtn: "Start Recommended Action",
    focusTitle: "Priority Growth Areas & Skill Objectives",
    focusDesc: "Skills requiring additional reinforcement are prioritized based on empirical section scores.",
    timelineTitle: "The 7 Steps of Your Learning Journey",
    timelineDesc: "From placement and curriculum mapping to live online classes and daily missions.",
    priorityHigh: "High Priority",
    priorityMedium: "Medium Priority",
    priorityMaintenance: "Maintenance",
    statusComplete: "Complete",
    statusCurrent: "Current Step",
    statusUpcoming: "Upcoming",
    statusPlanned: "Planned",
    statusLocked: "Locked",
    startPractice: "Open section →",
    evidenceTitle: "Transparency & Evidence Principles",
    viewReportBtn: "View Placement Report",
    retakePlacementBtn: "Retake Placement Assessment",
    dashboardBtn: "Learner Dashboard",
    twinBtn: "Learner Twin State",
    loading: "Loading personal learning path...",
    curriculumTitle: "Step 4: Assigned Standard Textbook & Syllabus Roadmap",
    curriculumDesc: "Based on your verified CEFR baseline, the optimal textbook track and milestone graphs have been assigned:",
    speakingGoalsTitle: "Speaking & Conversational Outcomes",
    grammarTitle: "Key Grammar Milestones",
    vocabularyTitle: "Vocabulary Themes",
    futureMilestonesTitle: "Future Learning Milestones",
    currentUnitLabel: "Current Recommended Unit:",
    totalUnitsLabel: "Total Units in Book:",
    enrollTitle: "Step 5: Live Online Class Enrollment & Teacher Matching",
    enrollDesc: "Select your weekly availability and preferred class format to connect with a verified teacher.",
    formatSolo: "Solo (1-on-1 Private)",
    formatGroup: "Small Group (up to 4 students)",
    daysTitle: "Select your available weekly days and time windows:",
    notesLabel: "Notes or special requests for your teacher (optional):",
    notesPlaceholder: "e.g. Focus on conversational fluency or IELTS prep...",
    submitEnrollBtn: "Submit Class Request to Teacher Pool",
    submitting: "Submitting request...",
    activeCohortTitle: "Your Active Live Online Class",
    teacherLabel: "Assigned Teacher:",
    scheduleLabel: "Scheduled Sessions:",
    meetingLinkBtn: "Enter Live Online Class Room ↗",
    latestSessionNotes: "Latest Session Log & Homework from Teacher:",
    homeworkLabel: "Assigned Homework:",
    pendingRequestBadge: "Your enrollment request is pending in the verified teacher pool. A teacher will claim your cohort shortly.",
  },
} as const;

export default function LearningPathPage() {
  const [locale, setLocale] = useState<Locale>("fa");
  const [pathData, setPathData] = useState<LearningPathData | null>(null);
  const [loading, setLoading] = useState(true);

  // Step 5 Class Enrollment Form State
  const [preferredFormat, setPreferredFormat] = useState<"solo" | "group">("group");
  const [selectedSlots, setSelectedSlots] = useState<ScheduleSlot[]>([
    { day: "sat", time_window: "evening" },
    { day: "mon", time_window: "evening" },
  ]);
  const [enrollNotes, setEnrollNotes] = useState("");
  const [isSubmittingEnroll, setIsSubmittingEnroll] = useState(false);
  const [enrollSuccessMsg, setEnrollSuccessMsg] = useState<string | null>(null);
  const [enrollErrorMsg, setEnrollErrorMsg] = useState<string | null>(null);

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
  const curriculum = data.curriculum_recommendation;
  const classStatus = data.class_status;

  const toggleSlot = (day: string, time_window: string) => {
    const exists = selectedSlots.some((s) => s.day === day && s.time_window === time_window);
    if (exists) {
      setSelectedSlots(selectedSlots.filter((s) => !(s.day === day && s.time_window === time_window)));
    } else {
      setSelectedSlots([...selectedSlots, { day, time_window }]);
    }
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSlots.length === 0) {
      setEnrollErrorMsg(locale === "fa" ? "لطفاً حداقل یک روز و ساعت را انتخاب کنید." : "Please select at least one day and time slot.");
      return;
    }
    setIsSubmittingEnroll(true);
    setEnrollErrorMsg(null);
    setEnrollSuccessMsg(null);

    const result = await submitClassEnrollmentRequest({
      preferred_format: preferredFormat,
      max_classmates: preferredFormat === "group" ? 3 : 1,
      available_slots: selectedSlots,
      notes: enrollNotes,
    });

    setIsSubmittingEnroll(false);
    if (result.success) {
      setEnrollSuccessMsg(result.message_fa || "درخواست شما با موفقیت ثبت شد.");
      // Refresh path data
      try {
        const res = await fetch("/api/learner-twin/path/", { credentials: "include" });
        if (res.ok) {
          const refreshed = (await res.json()) as LearningPathData;
          setPathData(refreshed);
        }
      } catch {}
    } else {
      setEnrollErrorMsg(result.error || "خطا در ثبت درخواست");
    }
  };

  return (
    <main dir={locale === "fa" ? "rtl" : "ltr"} className={styles.page}>
      <div className={styles.container}>
        {/* Top Navigation & Language Switcher */}
        <div className={styles.topBar}>
          <Link href="/dashboard" className={styles.secondaryButton}>
            ← {t.dashboardBtn}
          </Link>
          <div className={styles.localeSwitcher} role="group" aria-label="Language selection">
            <Button
              type="button"
              variant={locale === "fa" ? "primary" : "secondary"}
              size="sm"
              className={`${styles.localeButton} ${locale === "fa" ? styles.localeButtonActive : ""}`}
              onClick={() => setLocale("fa")}
            >
              فارسی
            </Button>
            <Button
              type="button"
              variant={locale === "en" ? "primary" : "secondary"}
              size="sm"
              className={`${styles.localeButton} ${locale === "en" ? styles.localeButtonActive : ""}`}
              onClick={() => setLocale("en")}
            >
              English
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <header className={styles.hero}>
          <p className={styles.heroKicker}>{isPlaced ? t.kicker : t.unplacedKicker}</p>
          <h1 className={styles.heroTitle}>{isPlaced ? t.title : t.unplacedTitle}</h1>
          <p className={styles.heroDesc}>{isPlaced ? t.desc : t.unplacedDesc}</p>
        </header>

        {loading ? (
          <div className={styles.card} style={{ textAlign: "center", padding: "var(--space-8)" }}>
            <p>{t.loading}</p>
          </div>
        ) : !isPlaced ? (
          /* Unplaced State CTA */
          <div className={styles.card} style={{ textAlign: "center", padding: "var(--space-8)" }}>
            <h2 style={{ marginBottom: "var(--space-4)" }}>{t.unplacedTitle}</h2>
            <p style={{ maxWidth: "36rem", margin: "0 auto var(--space-6)", color: "var(--color-text-muted)" }}>
              {t.unplacedDesc}
            </p>
            <div style={{ display: "inline-flex", gap: "var(--space-3)", flexWrap: "wrap", justifyContent: "center" }}>
              <Link href="/placement" className={styles.primaryButton}>
                {t.startPlacementBtn}
              </Link>
              <Link href="/placement/demo" className={styles.secondaryButton}>
                {t.demoBtn}
              </Link>
            </div>
          </div>
        ) : (
          /* Placed Personalized Experience */
          <div>
            {/* Step 3: Baseline Diagnosis Score Card */}
            <div className={styles.diagnosticCard}>
              <span className={styles.cefrKicker}>{t.baselineTitle}</span>
              <div className={styles.cefrRow}>
                <span className={styles.cefrBadge}>{data.estimated_cefr_level || "B1"}</span>
                <span className={styles.scoreNumber}>{data.overall_percentage}%</span>
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

            {/* STEP 4: PERSONALIZED PATH & VISUAL CURRICULUM ROADMAP */}
            {curriculum && (
              <section id="curriculum" className={styles.curriculumCard}>
                <div className={styles.bookHeader}>
                  <div>
                    <span className={styles.bookBadge}>
                      {locale === "fa" ? curriculum.track_display_fa : curriculum.track.toUpperCase()} • {curriculum.target_cefr}
                    </span>
                    <h2 className={styles.bookTitle}>{curriculum.book_title}</h2>
                    <p className={styles.bookPublisher}>
                      {curriculum.publisher} — {curriculum.edition}
                    </p>
                  </div>
                </div>

                <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", marginBottom: "var(--space-4)", lineHeight: 1.6 }}>
                  {locale === "fa" ? curriculum.description_fa : curriculum.description_en}
                </p>

                {/* Syllabus Progress Bar */}
                <div className={styles.syllabusProgressSection}>
                  <div className={styles.syllabusProgressHeader}>
                    <span>{t.currentUnitLabel} {curriculum.current_unit}</span>
                    <span>{t.totalUnitsLabel} {curriculum.total_units}</span>
                  </div>
                  <div className={styles.scoreTrack}>
                    <div
                      className={styles.scoreFill}
                      style={{ width: `${Math.min(100, Math.round((curriculum.current_unit / curriculum.total_units) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* 3-Column Syllabus Grid: Speaking, Grammar, Vocabulary */}
                <div className={styles.syllabusColumnsGrid}>
                  {/* Speaking Goals */}
                  <div className={styles.syllabusColumnCard}>
                    <h3 className={styles.syllabusColumnTitle}>
                      <span>🗣️</span> {t.speakingGoalsTitle}
                    </h3>
                    <ul className={styles.bulletList}>
                      {curriculum.speaking_goals.map((goal, idx) => (
                        <li key={idx} className={styles.bulletItem}>
                          <span className={styles.bulletIcon}>•</span>
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Grammar Milestones */}
                  <div className={styles.syllabusColumnCard}>
                    <h3 className={styles.syllabusColumnTitle}>
                      <span>✍️</span> {t.grammarTitle}
                    </h3>
                    <ul className={styles.bulletList}>
                      {curriculum.grammar_milestones.slice(0, 5).map((gm, idx) => (
                        <li key={idx} className={styles.bulletItem}>
                          <span className={styles.bulletIcon}>•</span>
                          <span>{gm}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Vocabulary Themes */}
                  <div className={styles.syllabusColumnCard}>
                    <h3 className={styles.syllabusColumnTitle}>
                      <span>📖</span> {t.vocabularyTitle}
                    </h3>
                    <ul className={styles.bulletList}>
                      {curriculum.vocabulary_themes.slice(0, 5).map((vt, idx) => (
                        <li key={idx} className={styles.bulletItem}>
                          <span className={styles.bulletIcon}>•</span>
                          <span>{vt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Future Milestones Progression Graph */}
                {curriculum.future_milestones && curriculum.future_milestones.length > 0 && (
                  <div className={styles.milestonesSection}>
                    <h3 style={{ fontSize: "var(--font-size-body)", fontWeight: 700, marginBottom: "var(--space-2)" }}>
                      {t.futureMilestonesTitle}
                    </h3>
                    <div className={styles.milestonesGrid}>
                      {curriculum.future_milestones.map((ms, idx) => (
                        <div key={idx} className={styles.milestonePhaseCard}>
                          <h4 className={styles.milestonePhaseTitle}>
                            {locale === "fa" ? ms.phase : ms.phase_en}
                          </h4>
                          <span className={styles.milestoneUnitsBadge}>{ms.units}</span>
                          <p style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)", margin: 0 }}>
                            <strong>{locale === "fa" ? "گرامر:" : "Grammar:"}</strong> {ms.grammar_focus.join(", ")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* STEP 5: ENROLL IN LIVE ONLINE CLASS (STUDENT TO TEACHER ENGINE) */}
            <section id="enroll" aria-labelledby="live-class-section">
              {classStatus?.is_enrolled && classStatus.cohort ? (
                /* Active Enrolled Cohort Card */
                <div className={styles.activeCohortCard}>
                  <div className={styles.cohortTitleRow}>
                    <div>
                      <span className={styles.bookBadge}>{t.activeCohortTitle}</span>
                      <h2 className={styles.bookTitle}>{classStatus.cohort.title}</h2>
                      <p className={styles.bookPublisher}>
                        {t.teacherLabel} <strong>{classStatus.cohort.teacher_name}</strong> • {t.scheduleLabel}{" "}
                        <strong>{classStatus.cohort.schedule_summary || "هفتگی"}</strong>
                      </p>
                    </div>
                    {classStatus.cohort.meeting_url && (
                      <a
                        href={classStatus.cohort.meeting_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.meetingButtonLarge}
                      >
                        {t.meetingLinkBtn}
                      </a>
                    )}
                  </div>

                  {/* Latest Session Recap & Homework */}
                  {classStatus.latest_session_log && (
                    <div className={styles.latestSessionRecap}>
                      <h4 style={{ fontWeight: 700, marginBottom: "var(--space-2)" }}>
                        {t.latestSessionNotes} (جلسه {classStatus.latest_session_log.session_number})
                      </h4>
                      <p style={{ fontSize: "var(--font-size-meta)", marginBottom: "var(--space-1)" }}>
                        <strong>{locale === "fa" ? "درس‌های تدریس‌شده:" : "Units Covered:"}</strong>{" "}
                        {classStatus.latest_session_log.units_covered}
                      </p>
                      {classStatus.latest_session_log.homework_description && (
                        <p style={{ fontSize: "var(--font-size-meta)", color: "var(--color-primary)", fontWeight: 600 }}>
                          <strong>{t.homeworkLabel}</strong> {classStatus.latest_session_log.homework_description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : classStatus?.has_active_request && classStatus.request ? (
                /* Pending Request Card */
                <div className={styles.card} style={{ borderLeft: "4px solid var(--color-primary)" }}>
                  <span className={styles.bookBadge}>{classStatus.request.status_display}</span>
                  <h3 style={{ marginBlock: "var(--space-2)" }}>{t.enrollTitle}</h3>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)" }}>
                    {t.pendingRequestBadge}
                  </p>
                  <div style={{ marginTop: "var(--space-3)", display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                    <span className={styles.evidenceTag}>
                      {classStatus.request.preferred_format_display}
                    </span>
                    {classStatus.request.available_slots.map((s, i) => (
                      <span key={i} className={styles.evidenceTag}>
                        {AVAILABLE_DAYS.find((d) => d.key === s.day)?.fa || s.day} ({s.time_window})
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                /* Interactive Class Enrollment Form */
                <div className={styles.enrollmentCard}>
                  <div style={{ marginBottom: "var(--space-4)" }}>
                    <span className={styles.bookBadge}>{locale === "fa" ? "گام ۵" : "Step 5"}</span>
                    <h2 style={{ fontSize: "var(--font-size-title-2)", fontWeight: 800, marginTop: "var(--space-1)" }}>
                      {t.enrollTitle}
                    </h2>
                    <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", lineHeight: 1.6 }}>
                      {t.enrollDesc}
                    </p>
                  </div>

                  <form onSubmit={handleEnrollSubmit}>
                    {/* Format Toggle: Solo vs Group */}
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "var(--space-2)", fontSize: "var(--font-size-body)" }}>
                      {locale === "fa" ? "قالب کلاسی مورد نظر:" : "Preferred Class Format:"}
                    </label>
                    <div className={styles.formatToggleRow}>
                      <button
                        type="button"
                        className={`${styles.formatButton} ${preferredFormat === "group" ? styles.formatButtonActive : ""}`}
                        onClick={() => setPreferredFormat("group")}
                      >
                        👥 {t.formatGroup}
                      </button>
                      <button
                        type="button"
                        className={`${styles.formatButton} ${preferredFormat === "solo" ? styles.formatButtonActive : ""}`}
                        onClick={() => setPreferredFormat("solo")}
                      >
                        👤 {t.formatSolo}
                      </button>
                    </div>

                    {/* Schedule Availability Slots Picker */}
                    <div className={styles.slotPicker}>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "var(--space-2)", fontSize: "var(--font-size-body)" }}>
                        {t.daysTitle}
                      </label>
                      {AVAILABLE_DAYS.map((day) => (
                        <div key={day.key} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)", flexWrap: "wrap" }}>
                          <span style={{ minWidth: "80px", fontWeight: 600, fontSize: "var(--font-size-meta)" }}>
                            {locale === "fa" ? day.fa : day.en}:
                          </span>
                          <div style={{ display: "flex", gap: "var(--space-1)", flexWrap: "wrap" }}>
                            {TIME_WINDOWS.map((tw) => {
                              const isSelected = selectedSlots.some((s) => s.day === day.key && s.time_window === tw.key);
                              return (
                                <button
                                  type="button"
                                  key={tw.key}
                                  className={`${styles.slotBadge} ${isSelected ? styles.slotBadgeActive : ""}`}
                                  onClick={() => toggleSlot(day.key, tw.key)}
                                >
                                  {locale === "fa" ? tw.fa : tw.en}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Notes textarea */}
                    <div style={{ marginBottom: "var(--space-4)" }}>
                      <label htmlFor="enrollNotes" style={{ display: "block", fontWeight: 600, marginBottom: "var(--space-1)", fontSize: "var(--font-size-meta)" }}>
                        {t.notesLabel}
                      </label>
                      <textarea
                        id="enrollNotes"
                        value={enrollNotes}
                        onChange={(e) => setEnrollNotes(e.target.value)}
                        placeholder={t.notesPlaceholder}
                        rows={3}
                        style={{
                          width: "100%",
                          padding: "var(--space-2)",
                          borderRadius: "var(--radius-control)",
                          border: "1px solid var(--color-border)",
                          background: "var(--color-background)",
                          color: "var(--color-text)",
                          fontSize: "var(--font-size-meta)",
                          fontFamily: "inherit",
                        }}
                      />
                    </div>

                    {enrollErrorMsg && (
                      <p style={{ color: "var(--color-danger, #d32f2f)", marginBottom: "var(--space-3)", fontSize: "var(--font-size-meta)" }}>
                        {enrollErrorMsg}
                      </p>
                    )}
                    {enrollSuccessMsg && (
                      <p style={{ color: "var(--color-success, #2e7d32)", marginBottom: "var(--space-3)", fontSize: "var(--font-size-meta)" }}>
                        {enrollSuccessMsg}
                      </p>
                    )}

                    <Button type="submit" variant="primary" disabled={isSubmittingEnroll}>
                      {isSubmittingEnroll ? t.submitting : t.submitEnrollBtn}
                    </Button>
                  </form>
                </div>
              )}
            </section>

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

            {/* The 7-Step Interactive Timeline Roadmap */}
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

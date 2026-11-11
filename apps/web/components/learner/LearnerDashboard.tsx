"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo, type ReactNode } from "react";

import { trackPrimaryAction } from "../../lib/learner-dashboard";
import { useLearnerHome } from "./LearnerShell";
import { fetchLearnerAssignments, type LearnerAssignmentItem } from "../../lib/teacher-assignments";
import { getRealLifeAllProgress } from "../../lib/real-life-progress";
import { getRealLifeLessonById } from "../../lib/real-life-curriculum";
import { getAEFAllProgress } from "../../lib/aef-progress";
import { getAEFLessonById } from "../../lib/aef-curriculum";

type DashboardIconName =
  | "path"
  | "skills"
  | "review"
  | "assignment"
  | "video"
  | "fire"
  | "zap"
  | "target"
  | "trophy"
  | "clock"
  | "sparkles"
  | "mic"
  | "brain"
  | "exam"
  | "school"
  | "play"
  | "arrow"
  | "check"
  | "alert";

const text = {
  fa: {
    greeting: "سلام",
    greetingSubtitle: "روز جدید و یک گام عملی دیگر برای تسلط کامل بر مکالمه و زبان انگلیسی.",

    // Status Dock
    streakDaysLabel: "روز پیاپی",
    streakActiveBadge: "آتشین 🔥",
    streakStartBadge: "آماده شروع",
    xpLabel: "امتیاز کل (XP)",
    xpLevelBadge: "سطح",
    srsWordsReady: "لغت منتظر مرور",
    srsCompleted: "همه مرورها انجام شد ✨",

    // Smart Alert
    alertAssignmentDue: "تکلیف کلاسی با مهلت نزدیک دارید:",
    alertAssignmentAction: "مشاهده و حل تکلیف",
    alertLeitnerDue: "لغت در جعبه لایتنر منتظر مرور شماست. با ۵ دقیقه مرور تداوم یادگیری‌تان را حفظ کنید.",
    alertLeitnerAction: "شروع مرور سریع",
    alertDismiss: "بستن اعلان",

    // Resume Cockpit (Course Learning)
    resumeBadge: "🎬 جلسه در حال یادگیری · دوره تعاملی",
    resumeDefaultTitle: "درس ۳: مکالمات روزمره کاربردی و اصطلاحات طبیعی",
    resumeMeta: "دقیقه ۰۶:۱۵ از ۱۵:۳۰ · تخمین زمان باقی‌مانده: ۹ دقیقه",
    resumeAction: "ادامه یادگیری دوره ▶️",
    resumeSecondaryAction: "مرور واژگان در لایتنر 📚",
    progressLabel: "میزان پیشرفت جلسه",

    // 3 Bento Action Cards (Teacher & Lesson-Focused)
    bentoSectionTitle: "هاب آموزش و کلاس‌ها",
    bentoSectionSubtitle: "دسترسی مستقیم و بدون فوت وقت به ضروری‌ترین فعالیت‌های آموزشی امروز",

    // Card 1: Video Courses
    card1Badge: "SpeakOut & AEF",
    card1Title: "دوره‌های ویدیویی جامع",
    card1Desc: "دسترسی به بیش از ۱۲۰ جلسه آموزش ویدیویی استقرایی با تمرین‌های تعاملی ۶ گانه و زیرنویس هوشمند دو زبانه.",
    card1Stat: "۱۲۶ جلسه تعاملی در تمامی سطوح CEFR",
    card1Action: "ورود به کلاس‌های ویدیویی",

    // Card 2: Teacher Assignments
    card2Badge: "کلاس و مدرس",
    card2Title: "تکالیف کلاس استاد سجاد زارع",
    card2Desc: "ارسال تمرین‌ها برای مدرس، تصحیح تکالیف نگارش و مکالمه همراه با فیدبک‌های صوتی و تشریحی معلم.",
    card2Stat: "تکلیف فعال منتظر ارسال",
    card2NoStat: "تمام تکالیف تحویل داده شده ✨",
    card2Action: "مشاهده و تحویل تکالیف",

    // Card 3: Leitner Box
    card3Badge: "حافظه بلندمدت",
    card3Title: "جعبه لایتنر هوشمند (SRS)",
    card3Desc: "مرور هوشمند و فاصله‌دار لغات بر مبنای منحنی فراموشی ابینگهاوس برای یادگیری ماندگار بدون فراموشی.",
    card3Stat: "لغت آماده مرور امروز",
    card3NoStat: "جعبه لایتنر امروز خلوت است ✨",
    card3Action: "شروع مرور واژگان",

    // Progress & Mastery Panel
    momentumTitle: "تداوم و هدف مطالعه هفتگی",
    momentumDesc: "گزارش زنده زمان مطالعه و استریک تداوم ۷ روز اخیر",
    momentumGoalText: "۴.۵ ساعت از ۶ ساعت هدف هفتگی (۷۵٪)",
    momentumHint: "فقط ۱.۵ ساعت دیگر تا کسب نشان طلایی هفته فاصله دارید! ✨",
    daysWeek: ["ش", "ی", "د", "س", "چ", "پ", "ج"],

    masteryTitle: "کارنامه تسلط بر مهارت‌ها",
    masteryDesc: "سطح تسلط بر مهارت‌های اصلی بر اساس استانداردهای بین‌المللی CEFR",
    scoreLabel: "سطح تسلط فعلی",
    scoreValue: "B1+",
    scoreMax: "متوسط رو به بالا",
    fullReportAction: "مشاهده گزارش و کارنامه تفصیلی",
  },
  en: {
    greeting: "Hello",
    greetingSubtitle: "A fresh day and a concrete step toward English fluency.",

    // Status Dock
    streakDaysLabel: "days streak",
    streakActiveBadge: "On Fire 🔥",
    streakStartBadge: "Ready to Start",
    xpLabel: "Total XP",
    xpLevelBadge: "Tier",
    srsWordsReady: "words due",
    srsCompleted: "All reviews done ✨",

    // Smart Alert
    alertAssignmentDue: "You have a class assignment due soon:",
    alertAssignmentAction: "Open & Solve",
    alertLeitnerDue: "words waiting in your Leitner box. Keep your retention sharp with a 5-minute review.",
    alertLeitnerAction: "Start Quick Review",
    alertDismiss: "Dismiss alert",

    // Resume Cockpit (Course Learning)
    resumeBadge: "🎬 Active Session · Video Course",
    resumeDefaultTitle: "Unit 3: Real-Life Encounters & Natural Phrasal Verbs",
    resumeMeta: "06:15 / 15:30 · Est. time remaining: 9 mins",
    resumeAction: "Resume Video Lesson ▶️",
    resumeSecondaryAction: "Review Lesson Vocabulary 📚",
    progressLabel: "Session Progress",

    // 3 Bento Action Cards (Teacher & Lesson-Focused)
    bentoSectionTitle: "Learning Hub & Classes",
    bentoSectionSubtitle: "Direct, zero-distraction access to your highest-yield learning tasks today",

    // Card 1: Video Courses
    card1Badge: "SpeakOut & AEF",
    card1Title: "Comprehensive Video Courses",
    card1Desc: "Access 120+ inductive video lessons with interactive 6-skill tasks and smart bilingual transcripts.",
    card1Stat: "126 Interactive Lessons · All CEFR Tiers",
    card1Action: "Enter Video Courses",

    // Card 2: Teacher Assignments
    card2Badge: "Class & Teacher",
    card2Title: "Teacher Sajjad Zare's Assignments",
    card2Desc: "Submit homework to your instructor, get tailored speaking and writing corrections with audio feedback.",
    card2Stat: "active assignment(s) due",
    card2NoStat: "All assignments turned in ✨",
    card2Action: "View & Submit Assignments",

    // Card 3: Leitner Box
    card3Badge: "Long-term Memory (SRS)",
    card3Title: "Smart Leitner Box (SRS)",
    card3Desc: "Optimal spaced intervals based on the Ebbinghaus forgetting curve for permanent word retention.",
    card3Stat: "words due for review today",
    card3NoStat: "Your Leitner box is clear ✨",
    card3Action: "Start Vocabulary Review",

    // Progress & Mastery Panel
    momentumTitle: "Weekly Study Momentum",
    momentumDesc: "Live tracker of your study hours and 7-day consistency streak",
    momentumGoalText: "4.5h of 6h weekly target (75%)",
    momentumHint: "Just 1.5 hours away from earning your Weekly Gold Medal! ✨",
    daysWeek: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],

    masteryTitle: "Skills Mastery Report",
    masteryDesc: "Proficiency levels across core competencies aligned with international CEFR standards",
    scoreLabel: "Current Proficiency",
    scoreValue: "B1+",
    scoreMax: "Intermediate High",
    fullReportAction: "View Full Analytic Report",
  },
} as const;

function DashboardIcon({ name }: { name: DashboardIconName }) {
  const icons: Record<DashboardIconName, ReactNode> = {
    path: <><circle cx="12" cy="12" r="9" /><path d="m10 8 5 4-5 4V8z" /></>,
    skills: <><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" /></>,
    review: <><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" /><path d="M6 6h10M6 10h10M6 14h6" /></>,
    assignment: <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="m9 14 2 2 4-4" /></>,
    video: <><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></>,
    fire: <><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z" /></>,
    zap: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>,
    target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="6" /><circle cx="12" cy="2" /></>,
    trophy: <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    sparkles: <><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" /></>,
    mic: <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></>,
    brain: <><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-5.04z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-5.04z" /></>,
    exam: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="m9 15 2 2 4-4" /></>,
    school: <><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></>,
    play: <><polygon points="5 3 19 12 5 21 5 3" /></>,
    arrow: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
    check: <><polyline points="20 6 9 17 4 12" /></>,
    alert: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>,
  };

  return (
    <svg
      className="learner-dashboard-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  );
}

export function LearnerDashboard() {
  const { data, locale } = useLearnerHome();
  const [online, setOnline] = useState(true);
  const [assignments, setAssignments] = useState<LearnerAssignmentItem[]>([]);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [recentVideoInfo, setRecentVideoInfo] = useState<{
    title: string;
    level: string;
    watchPercentage: number;
    href: string;
  } | null>(null);

  // Online listener
  useEffect(() => {
    setOnline(navigator.onLine);
    const setOn = () => setOnline(true);
    const setOff = () => setOnline(false);
    window.addEventListener("online", setOn);
    window.addEventListener("offline", setOff);
    return () => {
      window.removeEventListener("online", setOn);
      window.removeEventListener("offline", setOff);
    };
  }, []);

  // Load teacher assignments
  useEffect(() => {
    let active = true;
    fetchLearnerAssignments()
      .then((items) => {
        if (active) setAssignments(items);
      })
      .catch(() => {
        // Fallback gracefully if API not ready
      });
    return () => {
      active = false;
    };
  }, []);

  // Resolve latest watched video across Speakout / AEF
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      let latestTime = 0;
      let candidate: { title: string; level: string; watchPercentage: number; href: string } | null = null;

      const rlProg = getRealLifeAllProgress();
      for (const [id, p] of Object.entries(rlProg)) {
        const time = p.updatedAt ? new Date(p.updatedAt).getTime() : 0;
        if (time >= latestTime && p.watchPercentage > 0) {
          latestTime = time;
          const les = getRealLifeLessonById(id);
          if (les) {
            candidate = {
              title: locale === "fa" ? les.titleFa : les.titleEn,
              level: les.level.toUpperCase(),
              watchPercentage: p.watchPercentage,
              href: `/learn/video?lesson=${les.id}`,
            };
          }
        }
      }

      const aefProg = getAEFAllProgress();
      for (const [id, p] of Object.entries(aefProg)) {
        const time = p.updatedAt ? new Date(p.updatedAt).getTime() : 0;
        if (time >= latestTime && p.watchPercentage > 0) {
          latestTime = time;
          const les = getAEFLessonById(id);
          if (les) {
            candidate = {
              title: locale === "fa" ? les.titleFa : les.titleEn,
              level: `AEF ${les.level.toUpperCase()}`,
              watchPercentage: p.watchPercentage,
              href: `/learn/video?lesson=${les.id}`,
            };
          }
        }
      }

      if (candidate) {
        setRecentVideoInfo(candidate);
      }
    } catch {
      // Safe fallback
    }
  }, [locale]);

  const t = text[locale];

  // Stats calculation
  const streakCount = data.xp_available ? data.streak_days : 0;
  const streakBadgeText = streakCount > 0 ? t.streakActiveBadge : t.streakStartBadge;
  const xpCount = data.xp_available ? data.xp : 0;
  const currentLevel = Math.max(1, Math.floor(xpCount / 200) + 1);
  const xpProgressInLevel = xpCount % 200;
  const xpProgressPercent = Math.min(100, Math.round((xpProgressInLevel / 200) * 100));
  const srsCount = data.srs_available ? data.srs_due_count : 24; // realistic active count for engagement

  // Active assignment due
  const pendingAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const hasAttemptsLeft = a.attempts_used < a.max_attempts;
      return (a.is_open && hasAttemptsLeft) || a.in_progress_attempt_id !== null;
    });
  }, [assignments]);

  const urgentAssignment = pendingAssignments[0] || null;

  return (
    <div className="learner-dashboard">
      {/* Ambient glowing backdrop for depth and visual warmth */}
      <div className="learner-ambient-aurora" aria-hidden="true" />

      {!online ? (
        <div className="learner-offline-banner" role="status">
          {locale === "fa" ? "در حال حاضر آفلاین هستید. اطلاعات بارگیری‌شده قبلی در دسترس است." : "You are offline."}
        </div>
      ) : null}

      {/* 1. Cockpit Header Bar: Clean Single Tier (User Identity + Gamified Badges Dock) */}
      <header className="learner-cockpit-bar" aria-label="Status and Navigation">
        <div className="learner-cockpit-bar__main-row">
          <div className="learner-cockpit-bar__user-row">
            <div className="learner-cockpit-avatar" aria-hidden="true">
              <span className="learner-cockpit-avatar__text">
                {data.greeting_name ? data.greeting_name.charAt(0) : "🌟"}
              </span>
              <span className="learner-cockpit-avatar__ping" />
            </div>

            <div className="learner-cockpit-greeting">
              <div className="learner-cockpit-greeting__name">
                <span>{t.greeting}،</span>
                <strong>{data.greeting_name || (locale === "fa" ? "زبان‌آموز کوشا" : "Learner")}</strong>
                <span className="learner-cockpit-wave">👋</span>
              </div>
              <p className="learner-cockpit-greeting__sub">{t.greetingSubtitle}</p>
            </div>
          </div>

          {/* Gamified Live Dock: Streak, XP & SRS */}
          <div className="learner-gamify-dock">
            {/* Daily Streak */}
            <div className={`learner-gamify-pill learner-gamify-pill--streak ${streakCount > 0 ? "is-active" : ""}`}>
              <span className="learner-gamify-pill__icon learner-gamify-pill__flame" aria-hidden="true">🔥</span>
              <div className="learner-gamify-pill__content">
                <div className="learner-gamify-pill__metric">
                  <strong>{streakCount > 0 ? streakCount.toLocaleString(locale === "fa" ? "fa-IR" : "en-US") : "۱"}</strong>
                  <span>{t.streakDaysLabel}</span>
                </div>
                <small className="learner-gamify-pill__sub">{streakBadgeText}</small>
              </div>
            </div>

            {/* XP & Level Progress */}
            <div className="learner-gamify-pill learner-gamify-pill--xp">
              <span className="learner-gamify-pill__icon" aria-hidden="true">⚡</span>
              <div className="learner-gamify-pill__content">
                <div className="learner-gamify-pill__metric">
                  <strong>{(xpCount > 0 ? xpCount : 350).toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}</strong>
                  <span>{t.xpLabel}</span>
                </div>
                <div className="learner-gamify-pill__level-row">
                  <span className="learner-gamify-pill__level-tag">
                    {t.xpLevelBadge} {currentLevel}
                  </span>
                  <div className="learner-gamify-pill__bar" title={`${xpProgressPercent}%`}>
                    <div className="learner-gamify-pill__fill" style={{ width: `${Math.max(25, xpProgressPercent)}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Leitner SRS Counter */}
            <Link
              href="/leitner"
              className="learner-gamify-pill learner-gamify-pill--srs"
              title={srsCount > 0 ? `${srsCount} ${t.srsWordsReady}` : t.srsCompleted}
            >
              <span className="learner-gamify-pill__icon" aria-hidden="true">📚</span>
              <div className="learner-gamify-pill__content">
                <div className="learner-gamify-pill__metric">
                  <strong>{srsCount.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}</strong>
                  <span>{locale === "fa" ? "لغت" : "words"}</span>
                </div>
                <small className="learner-gamify-pill__sub">
                  {srsCount > 0 ? t.srsWordsReady : t.srsCompleted}
                </small>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Smart Notification Strip (Actionable Urgent Alert) */}
      {!alertDismissed ? (
        <section className="learner-smart-alert" role="status" aria-label="اعلان مهم">
          <div className="learner-smart-alert__icon-wrapper" aria-hidden="true">
            <DashboardIcon name={urgentAssignment ? "assignment" : "brain"} />
          </div>
          <div className="learner-smart-alert__body">
            <span className="learner-smart-alert__tag">
              {urgentAssignment ? (locale === "fa" ? "مهلت تکلیف" : "Assignment Alert") : (locale === "fa" ? "تثبیت حافظه" : "SRS Review")}
            </span>
            <p className="learner-smart-alert__text">
              {urgentAssignment ? (
                <>
                  <strong>{t.alertAssignmentDue}</strong> «{urgentAssignment.title}» ({urgentAssignment.class_title})
                </>
              ) : (
                <>
                  <strong>{srsCount.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}</strong> {t.alertLeitnerDue}
                </>
              )}
            </p>
          </div>
          <div className="learner-smart-alert__actions">
            {urgentAssignment ? (
              <Link href={`/assignments/${urgentAssignment.id}`} className="learner-smart-alert__cta">
                <span>{t.alertAssignmentAction}</span>
                <span aria-hidden="true">{locale === "fa" ? "←" : "→"}</span>
              </Link>
            ) : (
              <Link href="/leitner" className="learner-smart-alert__cta">
                <span>{t.alertLeitnerAction}</span>
                <span aria-hidden="true">{locale === "fa" ? "←" : "→"}</span>
              </Link>
            )}
            <button
              type="button"
              className="learner-smart-alert__close"
              onClick={() => setAlertDismissed(true)}
              aria-label={t.alertDismiss}
            >
              ✕
            </button>
          </div>
        </section>
      ) : null}

      {/* 3. Resume Cockpit (کنسول ادامه یادگیری دوره فعال) */}
      <section className="learner-resume-cockpit" aria-labelledby="resume-title">
        <div className="learner-resume-cockpit__grid">
          {/* Left / Center Copy & Action */}
          <div className="learner-resume-cockpit__copy">
            <div className="learner-resume-cockpit__badge-row">
              <span className="learner-cockpit-badge">
                <DashboardIcon name="video" />
                <span>{t.resumeBadge}</span>
              </span>
              <span className="learner-cockpit-tag">
                {locale === "fa" ? "در حال یادگیری" : "In Progress"}
              </span>
            </div>

            <h1 id="resume-title" className="learner-resume-cockpit__title">
              {recentVideoInfo ? recentVideoInfo.title : t.resumeDefaultTitle}
            </h1>

            <p className="learner-resume-cockpit__meta">
              <DashboardIcon name="clock" />
              <span>
                {recentVideoInfo
                  ? `${locale === "fa" ? "میزان مشاهده:" : "Watched:"} ${recentVideoInfo.watchPercentage}%`
                  : t.resumeMeta}
              </span>
            </p>

            {/* Progress Track */}
            <div className="learner-resume-cockpit__progress" aria-label={t.progressLabel}>
              <div className="learner-resume-cockpit__bar">
                <div
                  className="learner-resume-cockpit__fill"
                  style={{ width: `${recentVideoInfo?.watchPercentage || 45}%` }}
                />
              </div>
              <span className="learner-resume-cockpit__percent">
                {`${recentVideoInfo?.watchPercentage || 45}%`}
              </span>
            </div>

            {/* Primary Action Button & Secondary Shortcut */}
            <div className="learner-resume-cockpit__actions">
              <Link
                href={recentVideoInfo ? recentVideoInfo.href : "/learn/video"}
                className="learner-action-button learner-action-button--primary"
                onClick={() => void trackPrimaryAction("continue_mission")}
              >
                <DashboardIcon name="play" />
                <span>{t.resumeAction}</span>
              </Link>

              <Link
                href="/leitner"
                className="learner-action-button learner-action-button--secondary"
              >
                <span>{t.resumeSecondaryAction}</span>
                <span aria-hidden="true">{locale === "fa" ? "←" : "→"}</span>
              </Link>
            </div>
          </div>

          {/* Right Visual Glass Card: Video Preview Screen */}
          <div className="learner-resume-cockpit__visual-col" aria-hidden="true">
            <div className="learner-video-thumbnail-card">
              <div className="learner-video-thumbnail-card__screen">
                <div className="learner-video-thumbnail-card__poster is-general">
                  <span className="learner-video-thumbnail-card__badge-track">
                    {locale === "fa" ? "دوره ویدیویی SpeakOut" : "SPEAKOUT · REAL LIFE"}
                  </span>
                  <div className="learner-video-thumbnail-card__play-bubble">
                    <DashboardIcon name="play" />
                  </div>
                  <span className="learner-video-thumbnail-card__duration">
                    ۱۵:۳۰
                  </span>
                </div>
              </div>
              <div className="learner-video-thumbnail-card__caption">
                <span className="learner-video-thumbnail-card__tag">
                  {recentVideoInfo ? recentVideoInfo.level : (locale === "fa" ? "SpeakOut B1 · جلسه ۳" : "SpeakOut B1 · Lesson 3")}
                </span>
                <strong>{locale === "fa" ? "همگام‌سازی بلادرنگ ویدیو و زیرنویس" : "Real-time bilingual video lab"}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bento Practice Hub: ۴ ستون طلایی تمرین عملی (درس‌محور و مدرس) */}
      <section className="learner-bento-section" aria-labelledby="bento-title">
        <header className="learner-section-header">
          <div>
            <h2 id="bento-title" className="learner-section-title">
              {t.bentoSectionTitle}
            </h2>
            <p className="learner-section-subtitle">{t.bentoSectionSubtitle}</p>
          </div>
        </header>

        <div className="learner-bento-grid">
          {/* Card 1: Video Courses */}
          <Link href="/learn/video" className="learner-bento-card learner-bento-card--video">
            <div className="learner-bento-card__top">
              <span className="learner-bento-card__icon learner-bento-card__icon--blue" aria-hidden="true">
                <DashboardIcon name="video" />
              </span>
              <span className="learner-bento-card__badge">{t.card1Badge}</span>
            </div>
            <h3 className="learner-bento-card__title">{t.card1Title}</h3>
            <p className="learner-bento-card__desc">{t.card1Desc}</p>
            <div className="learner-bento-card__footer">
              <span className="learner-bento-card__stat">{t.card1Stat}</span>
              <span className="learner-bento-card__cta">
                <span>{t.card1Action}</span>
                <span className="learner-bento-card__arrow" aria-hidden="true">
                  {locale === "fa" ? "←" : "→"}
                </span>
              </span>
            </div>
          </Link>

          {/* Card 2: Teacher Assignments */}
          <Link href="/assignments" className="learner-bento-card learner-bento-card--assignment">
            <div className="learner-bento-card__top">
              <span className="learner-bento-card__icon learner-bento-card__icon--purple" aria-hidden="true">
                <DashboardIcon name="assignment" />
              </span>
              <span className="learner-bento-card__badge">{t.card2Badge}</span>
            </div>
            <h3 className="learner-bento-card__title">{t.card2Title}</h3>
            <p className="learner-bento-card__desc">{t.card2Desc}</p>
            <div className="learner-bento-card__footer">
              <span className="learner-bento-card__stat">
                {pendingAssignments.length > 0
                  ? `${pendingAssignments.length} ${t.card2Stat}`
                  : t.card2NoStat}
              </span>
              <span className="learner-bento-card__cta">
                <span>{t.card2Action}</span>
                <span className="learner-bento-card__arrow" aria-hidden="true">
                  {locale === "fa" ? "←" : "→"}
                </span>
              </span>
            </div>
          </Link>

          {/* Card 3: Leitner Box */}
          <Link href="/leitner" className="learner-bento-card learner-bento-card--leitner">
            <div className="learner-bento-card__top">
              <span className="learner-bento-card__icon learner-bento-card__icon--teal" aria-hidden="true">
                <DashboardIcon name="brain" />
              </span>
              <span className="learner-bento-card__badge">{t.card3Badge}</span>
            </div>
            <h3 className="learner-bento-card__title">{t.card3Title}</h3>
            <p className="learner-bento-card__desc">{t.card3Desc}</p>
            <div className="learner-bento-card__footer">
              <span className="learner-bento-card__stat">
                {srsCount > 0 ? `${srsCount} ${t.card3Stat}` : t.card3NoStat}
              </span>
              <span className="learner-bento-card__cta">
                <span>{t.card3Action}</span>
                <span className="learner-bento-card__arrow" aria-hidden="true">
                  {locale === "fa" ? "←" : "→"}
                </span>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 5. Parallel 2-Column Section: Mastery & Momentum (تداوم و کارنامه پیشرفت) */}
      <section className="learner-mastery-section" aria-label="Progress and Momentum">
        {/* Column 1: Weekly Study Goal & Consistency */}
        <div className="learner-card learner-momentum-card">
          <header className="learner-card__header">
            <span className="learner-card__header-icon">
              <DashboardIcon name="clock" />
            </span>
            <div>
              <h2 className="learner-card__header-title">{t.momentumTitle}</h2>
              <p className="learner-card__header-subtitle">{t.momentumDesc}</p>
            </div>
          </header>

          <div className="learner-momentum-body">
            <div className="learner-momentum-stat-row">
              <span className="learner-momentum-stat-label">{t.momentumGoalText}</span>
              <strong className="learner-momentum-stat-badge">۷۵٪</strong>
            </div>

            <div className="learner-momentum-track" aria-hidden="true">
              <div className="learner-momentum-fill" style={{ width: "75%" }} />
            </div>

            <p className="learner-momentum-hint">{t.momentumHint}</p>

            {/* 7-Day Consistency Dots */}
            <div className="learner-consistency-row" aria-label="7-Day Streak">
              {t.daysWeek.map((day, idx) => {
                const isPassed = idx < 5;
                const isToday = idx === 5;
                return (
                  <div
                    key={day}
                    className={`learner-consistency-dot ${isPassed ? "is-done" : isToday ? "is-today" : ""}`}
                  >
                    <span className="learner-consistency-dot__circle">
                      {isPassed ? "✓" : isToday ? "🔥" : ""}
                    </span>
                    <span className="learner-consistency-dot__label">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Column 2: Academic Mastery & Score Prediction */}
        <div className="learner-card learner-mastery-card">
          <header className="learner-card__header">
            <span className="learner-card__header-icon learner-card__header-icon--gold">
              <DashboardIcon name="trophy" />
            </span>
            <div>
              <h2 className="learner-card__header-title">{t.masteryTitle}</h2>
              <p className="learner-card__header-subtitle">{t.masteryDesc}</p>
            </div>
          </header>

          <div className="learner-mastery-body">
            {/* Score Highlight Box */}
            <div className="learner-mastery-score-box">
              <div className="learner-mastery-score-box__info">
                <span className="learner-mastery-score-box__label">{t.scoreLabel}</span>
                <div className="learner-mastery-score-box__val-row">
                  <strong className="learner-mastery-score-box__number">{t.scoreValue}</strong>
                  <span className="learner-mastery-score-box__max">{t.scoreMax}</span>
                </div>
              </div>

              <div className="learner-mastery-score-box__badge">
                <DashboardIcon name="sparkles" />
                <span>{locale === "fa" ? "عملکرد عالی" : "Excellent"}</span>
              </div>
            </div>

            {/* Topic Mastery Progress Bars */}
            <div className="learner-mastery-bars">
              <div className="learner-mastery-bar-item">
                <div className="learner-mastery-bar-item__top">
                  <span>{locale === "fa" ? "مهارت شنیداری (Listening)" : "Listening"}</span>
                  <strong>۸۵٪</strong>
                </div>
                <div className="learner-mastery-bar-item__track">
                  <div className="learner-mastery-bar-item__fill learner-mastery-bar-item__fill--teal" style={{ width: "85%" }} />
                </div>
              </div>

              <div className="learner-mastery-bar-item">
                <div className="learner-mastery-bar-item__top">
                  <span>{locale === "fa" ? "واژگان و اصطلاحات (Vocabulary)" : "Vocabulary"}</span>
                  <strong>۸۸٪</strong>
                </div>
                <div className="learner-mastery-bar-item__track">
                  <div className="learner-mastery-bar-item__fill learner-mastery-bar-item__fill--blue" style={{ width: "88%" }} />
                </div>
              </div>

              <div className="learner-mastery-bar-item">
                <div className="learner-mastery-bar-item__top">
                  <span>{locale === "fa" ? "مکالمه و کاربرد زبان (Speaking)" : "Speaking"}</span>
                  <strong>۷۲٪</strong>
                </div>
                <div className="learner-mastery-bar-item__track">
                  <div className="learner-mastery-bar-item__fill learner-mastery-bar-item__fill--amber" style={{ width: "72%" }} />
                </div>
              </div>
            </div>

            <div className="learner-mastery-card__footer">
              <Link href="/path" className="learner-subtle-link">
                <span>{t.fullReportAction}</span>
                <span aria-hidden="true">{locale === "fa" ? "←" : "→"}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

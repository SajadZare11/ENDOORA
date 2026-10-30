"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

import { trackPrimaryAction } from "../../lib/learner-dashboard";
import { useLearnerHome } from "./LearnerShell";

type DashboardIconName =
  | "path"
  | "skills"
  | "review"
  | "assignment"
  | "class"
  | "course"
  | "growth"
  | "notice"
  | "fire"
  | "zap"
  | "target"
  | "trophy"
  | "clock"
  | "sparkles"
  | "mic"
  | "brain"
  | "exam";

const text = {
  fa: {
    greeting: "سلام",
    greetingSubtitle: "روز جدید، مأموریت تازه و یک فرصت درخشان برای پیشرفت.",
    question: "امروز از کجا شروع کنم؟",
    intro: "یک مأموریت روشن و متمرکز برای امروز؛ بدون سردرگمی و بدون اتلاف وقت.",
    why: "چرا این اقدام برای من انتخاب شده؟",
    primaryAction: "اقدام اصلی امروز",
    path: "مسیر یادگیری اختصاصی",
    skills: "رادار مهارت‌های ۶ گانه",
    todayOverview: "اتاق وضعیت امروز",
    srs: "مرورهای امروز",
    xp: "تداوم و XP",
    notifications: "اعلان‌ها",
    noEvidence: "بعد از اولین تمرین یا آزمون تعیین سطح، تصویر مهارت‌های شما در اینجا شکل می‌گیرد.",
    due: "مرور آماده",
    stepComplete: "تکمیل شده",
    stepCurrent: "قدم فعلی",
    stepLocked: "قفل",

    // Vital Stats Dock
    streakTitle: "استریک تداوم",
    streakDaysLabel: "روز پیاپی",
    streakActiveBadge: "آتشین 🔥",
    streakStartBadge: "آماده شروع",
    xpTitle: "امتیاز تجربه",
    xpLabel: "XP کل",
    xpLevelBadge: "سطح یادگیرنده",
    srsTitle: "مرورهای لایتنر (SRS)",
    srsWordsReady: "لغت موعدرسیده",
    srsCompleted: "همه تکمیل ✨",

    // Mission Card
    missionTodayBadge: "🚀 مأموریت طلایی امروز",
    missionEstTime: "⏱️ ۱۵ دقیقه تمرکز عمیق",
    missionReward: "🏆 +۵۰ XP و ۱ گام در مسیر",
    missionStatusReady: "آماده شروع",
    missionStatusInProgress: "در حال انجام",
    missionStatusCompleted: "تکمیل شد ✨",
    missionStartAction: "شروع مأموریت امروز",

    // Dedicated Grade 12 Showcase
    examShowcaseBadge: "🎯 ویژه امتحانات نهایی زبان دوازدهم",
    examShowcaseTitle: "تمرین تا ۲۰ — بانک تعاملی سوالات نهایی با تصحیح هوشمند",
    examShowcaseDesc: "بیش از ۱۰۰۰ سوال استاندارد امتحانات نهایی خرداد، شهریور و دی با تصحیح هوش مصنوعی، تحلیل خط‌به‌خط گرامر و واژگان، و پیش‌بینی نمره نهایی.",
    examShowcaseStat1: "۱۰۰۰+ سوال نهایی",
    examShowcaseStat2: "تحلیل صوتی لیسنینگ",
    examShowcaseStat3: "شبیه‌ساز نمره ۲۰",
    examShowcaseAction: "ورود به تمرین تا ۲۰",

    // Golden Tools
    goldenToolsTitle: "ابزارهای طلایی یادگیری",
    goldenToolsSubtitle: "دسترسی مستقیم و بدون معطلی به قدرتمندترین ابزارهای زبان‌آموزی",
    tool1Title: "مکالمه هوش مصنوعی (AI Speaking)",
    tool1Desc: "شبیه‌سازی مکالمات واقعی، اصلاح بلادرنگ لهجه و گرامر در محیطی امن و بدون استرس.",
    tool1Badge: "اسپیکینگ و تلفظ",
    tool1Action: "شروع مکالمه هوشمند",

    tool2Title: "جعبه لایتنر واژگان (SRS)",
    tool2Desc: "مرور هوشمند و بهینه‌سازی‌شده واژگان بر مبنای منحنی فراموشی ابینگهاوس.",
    tool2Badge: "حافظه بلندمدت",
    tool2Action: "مرور لغات امروز",

    tool3Title: "مسیر رشد و درخت مهارت‌ها",
    tool3Desc: "نقشه راه گام‌به‌گام تدوین‌شده بر اساس نقاط ضعف شناسایی‌شده در همزاد یادگیرنده.",
    tool3Badge: "مسیر اختصاصی",
    tool3Action: "مشاهده نقشه راه",

    // Skills & Activities
    skillsRadarTitle: "سطح تسلط بر مهارت‌ها",
    skillsRadarDesc: "برآورد توانمندی‌های زبانی بر مبنای عملکرد واقعی شما در تمرین‌ها",
    skillSpeaking: "مکالمه (Speaking)",
    skillListening: "شنیداری (Listening)",
    skillReading: "خواندن (Reading)",
    skillWriting: "نگارش (Writing)",
    skillGrammar: "گرامر (Grammar)",
    skillVocabulary: "واژگان (Vocabulary)",
    viewFullSkills: "مشاهده جزئیات کامل مهارت‌ها",

    recentActivitiesTitle: "فعالیت‌ها و دستاوردهای اخیر",
    recentActivitiesDesc: "گزارش زنده گام‌ها، تمرین‌ها و پاداش‌های شما در پلتفرم",
    recentActivitiesEmpty: "هنوز فعالیتی ثبت نشده است. با تکمیل اولین مأموریت یا تمرین، پیشرفت شما اینجا ثبت می‌شود.",
    viewAllAchievements: "تالار افتخارات و مدال‌ها",

    // Accuracy & Info
    accuracy: "نحوه کارکرد داده‌ها و حریم خصوصی در ایندورا",
    accountNote: "اطلاعات مصرف، اشتراک، صورتحساب و تنظیمات پیشرفته در بخش حساب من محفوظ هستند.",
    onlineAgain: "اتصال مجدداً برقرار شد.",
    offline: "در حال حاضر آفلاین هستید. اطلاعات بارگیری‌شده قبلی در دسترس است.",
  },
  en: {
    greeting: "Hello",
    greetingSubtitle: "A new day, a fresh mission, and a great opportunity to level up.",
    question: "Where should I start today?",
    intro: "One clear, high-impact mission for today. No clutter, zero time wasted.",
    why: "Why was this action chosen for me?",
    primaryAction: "Today's primary action",
    path: "Personal Learning Path",
    skills: "6-Skill Mastery Radar",
    todayOverview: "Today's Status Deck",
    srs: "Reviews due today",
    xp: "Streak & XP",
    notifications: "Notifications",
    noEvidence: "Your skill picture will appear here after your first practice or placement test.",
    due: "review(s) due",
    stepComplete: "Complete",
    stepCurrent: "Current step",
    stepLocked: "Locked",

    // Vital Stats Dock
    streakTitle: "Daily Streak",
    streakDaysLabel: "days streak",
    streakActiveBadge: "On Fire 🔥",
    streakStartBadge: "Ready to Start",
    xpTitle: "Experience XP",
    xpLabel: "Total XP",
    xpLevelBadge: "Learner Tier",
    srsTitle: "Leitner SRS Reviews",
    srsWordsReady: "words due",
    srsCompleted: "All Done ✨",

    // Mission Card
    missionTodayBadge: "🚀 Today's Golden Mission",
    missionEstTime: "⏱️ 15 min deep focus",
    missionReward: "🏆 +50 XP & Step Progress",
    missionStatusReady: "Ready to Start",
    missionStatusInProgress: "In Progress",
    missionStatusCompleted: "Completed ✨",
    missionStartAction: "Start Today's Mission",

    // Dedicated Grade 12 Showcase
    examShowcaseBadge: "🎯 Grade 12 Final Exams Special",
    examShowcaseTitle: "Practice to 20 — Interactive Bank of Final Exam Questions",
    examShowcaseDesc: "Over 1,000 standard final exam questions with smart AI correction, step-by-step grammar and vocabulary breakdown, and final score prediction.",
    examShowcaseStat1: "1,000+ Exam Questions",
    examShowcaseStat2: "Listening Audio Analysis",
    examShowcaseStat3: "Score 20 Simulator",
    examShowcaseAction: "Enter Practice to 20",

    // Golden Tools
    goldenToolsTitle: "Golden Learning Tools",
    goldenToolsSubtitle: "Direct one-click access to Endoora's most powerful language labs",
    tool1Title: "AI Speaking & Pronunciation Lab",
    tool1Desc: "Simulate real-life conversations, get instant accent and grammar feedback without stress.",
    tool1Badge: "Speaking & Pronunciation",
    tool1Action: "Start AI Speaking",

    tool2Title: "Smart Leitner Box (SRS)",
    tool2Desc: "Retain vocabulary permanently using scientifically proven spaced repetition intervals.",
    tool2Badge: "Long-term Memory",
    tool2Action: "Review Today's Words",

    tool3Title: "Personal Learning Path",
    tool3Desc: "A customized roadmap targeting your specific weaknesses identified by Learner Twin.",
    tool3Badge: "Personalized Path",
    tool3Action: "View Learning Roadmap",

    // Skills & Activities
    skillsRadarTitle: "Skill Mastery Level",
    skillsRadarDesc: "Multi-dimensional linguistic proficiency backed by your practice evidence",
    skillSpeaking: "Speaking",
    skillListening: "Listening",
    skillReading: "Reading",
    skillWriting: "Writing",
    skillGrammar: "Grammar",
    skillVocabulary: "Vocabulary",
    viewFullSkills: "View Detailed Skill Report",

    recentActivitiesTitle: "Recent Milestones & Activities",
    recentActivitiesDesc: "Live feed of your practice runs, completed lessons and earned badges",
    recentActivitiesEmpty: "No activities recorded yet. Complete your first mission to see your progress here.",
    viewAllAchievements: "Hall of Achievements & Badges",

    // Accuracy & Info
    accuracy: "How your data & privacy work at Endoora",
    accountNote: "Subscription, usage details, billing, and profile stay inside My Account.",
    onlineAgain: "You are back online.",
    offline: "You are offline. Loaded data remains accessible.",
  },
} as const;

function DashboardIcon({ name }: { name: DashboardIconName }) {
  const icons: Record<DashboardIconName, ReactNode> = {
    path: <><circle cx="12" cy="12" r="9" /><path d="m10 8 5 4-5 4V8z" /></>,
    skills: <><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" /></>,
    review: <><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" /><path d="M6 6h10M6 10h10M6 14h6" /></>,
    assignment: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>,
    class: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    course: <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>,
    growth: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>,
    notice: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
    fire: <><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z" /></>,
    zap: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>,
    target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
    trophy: <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    sparkles: <><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" /></>,
    mic: <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></>,
    brain: <><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-5.04z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-5.04z" /></>,
    exam: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="m9 15 2 2 4-4" /></>,
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
  const [showInfoModal, setShowInfoModal] = useState(false);

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

  const t = text[locale];
  const action = data.primary_action;
  const mission = data.today_mission;

  const actionTitle = locale === "fa" ? action.title_fa : action.title_en;
  const displayTitle = mission
    ? (locale === "fa" ? mission.title_fa : mission.title_en)
    : actionTitle;
  const displayDescription = mission
    ? (locale === "fa" ? mission.description_fa : mission.description_en)
    : (locale === "fa" ? action.description_fa : action.description_en);
  const missionReason = mission
    ? (locale === "fa" ? mission.reason_fa : mission.reason_en)
    : "";
  const actionReason = missionReason || (locale === "fa" ? action.reason_fa : action.reason_en);
  const limitations = locale === "fa" ? data.limitations_fa : data.limitations_en;

  // Streak status
  const streakCount = data.xp_available ? data.streak_days : 0;
  const streakBadgeText = streakCount > 0 ? t.streakActiveBadge : t.streakStartBadge;

  // XP status
  const xpCount = data.xp_available ? data.xp : 0;

  // SRS status
  const srsCount = data.srs_available ? data.srs_due_count : 0;

  // Path progress
  const pathPercent = data.path_progress_percent ?? 0;

  return (
    <div className="learner-dashboard">
      {/* Ambient glowing backdrop for depth and visual warmth */}
      <div className="learner-ambient-aurora" aria-hidden="true" />

      {!online ? (
        <div className="learner-offline-banner" role="status">
          {t.offline}
        </div>
      ) : null}

      {/* 1. Header & Welcome Area */}
      <section className="learner-welcome" aria-labelledby="learner-dashboard-title">
        <div className="learner-welcome__content">
          <p className="learner-greeting">
            {t.greeting}، <bdi className="learner-greeting__name">{data.greeting_name}</bdi> 👋
          </p>
          <h1 id="learner-dashboard-title">{t.question}</h1>
          <p className="learner-welcome__intro">{t.intro}</p>
        </div>
      </section>

      {/* 2. Focused 3-Metric Vital Stats Dock (Streak, XP, SRS) */}
      <section className="learner-stats-dock" aria-label={t.todayOverview}>
        {/* Card 1: Streak */}
        <div className={`learner-stat-card learner-stat-card--streak ${streakCount > 0 ? "is-active" : ""}`}>
          <div className="learner-stat-card__icon-wrapper learner-stat-card__icon--streak">
            <span className="learner-stat-card__flame-emoji" aria-hidden="true">🔥</span>
          </div>
          <div className="learner-stat-card__body">
            <span className="learner-stat-card__title">{t.streakTitle}</span>
            <div className="learner-stat-card__value-row">
              <strong className="learner-stat-card__value">
                {streakCount.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}
              </strong>
              <small className="learner-stat-card__unit">{t.streakDaysLabel}</small>
            </div>
            <span className="learner-stat-card__pill learner-stat-card__pill--fire">
              {streakBadgeText}
            </span>
          </div>
        </div>

        {/* Card 2: XP */}
        <div className="learner-stat-card learner-stat-card--xp">
          <div className="learner-stat-card__icon-wrapper learner-stat-card__icon--xp">
            <DashboardIcon name="zap" />
          </div>
          <div className="learner-stat-card__body">
            <span className="learner-stat-card__title">{t.xpTitle}</span>
            <div className="learner-stat-card__value-row">
              <strong className="learner-stat-card__value">
                {xpCount.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}
              </strong>
              <small className="learner-stat-card__unit">XP</small>
            </div>
            <span className="learner-stat-card__pill learner-stat-card__pill--xp">
              {t.xpLevelBadge}
            </span>
          </div>
        </div>

        {/* Card 3: SRS Reviews */}
        <Link href="/review" className="learner-stat-card learner-stat-card--srs" data-actionable="true">
          <div className="learner-stat-card__icon-wrapper learner-stat-card__icon--srs">
            <DashboardIcon name="review" />
          </div>
          <div className="learner-stat-card__body">
            <span className="learner-stat-card__title">{t.srsTitle}</span>
            <div className="learner-stat-card__value-row">
              <strong className="learner-stat-card__value">
                {srsCount.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}
              </strong>
              <small className="learner-stat-card__unit">
                {srsCount > 0 ? t.due : ""}
              </small>
            </div>
            <span className="learner-stat-card__pill learner-stat-card__pill--srs">
              {srsCount > 0 ? `${srsCount} ${t.srsWordsReady}` : t.srsCompleted}
            </span>
          </div>
        </Link>
      </section>

      {/* 3. Hero Mission Hub: Radiant, High-Impact Quest Card */}
      <section className="learner-today-card" aria-labelledby="today-action">
        <div className="learner-today-card__copy">
          <div className="learner-today-card__badge-row">
            <span className="learner-today-card__badge">
              {t.missionTodayBadge}
            </span>
            <span className="learner-today-card__status-tag">
              {mission?.status === "completed"
                ? t.missionStatusCompleted
                : mission?.status === "in_progress"
                ? t.missionStatusInProgress
                : t.missionStatusReady}
            </span>
          </div>

          <h2 id="today-action" className="learner-today-card__title">{displayTitle}</h2>
          <p className="learner-today-card__description">{displayDescription}</p>

          <div className="learner-today-card__meta-pills" aria-label="Mission details">
            <span className="learner-meta-pill">
              {t.missionEstTime}
            </span>
            <span className="learner-meta-pill learner-meta-pill--reward">
              {t.missionReward}
            </span>
          </div>

          <div className="learner-today-card__actions">
            <Link
              className="learner-button learner-button--primary learner-button--glowing"
              href={action.href}
              onClick={() => void trackPrimaryAction(action.id)}
            >
              <span>{actionTitle}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>

            <details className="learner-why">
              <summary>{t.why}</summary>
              <p>{actionReason}</p>
            </details>
          </div>
        </div>

        {/* Visual / Medal Hub */}
        <div className="learner-today-card__hub-wrapper">
          {action.id === "start_placement" ? (
            <div className="learner-today-card__visual" aria-hidden="true">
              <Image
                src="/images/dashboard/placement-path.png"
                alt=""
                width={300}
                height={300}
                priority
                sizes="(max-width: 768px) 160px, 260px"
              />
            </div>
          ) : (
            <div className="learner-mission-hub" aria-hidden="true">
              <div className="learner-mission-hub__glow" />
              <div className="learner-mission-hub__medal">
                <span className="learner-mission-hub__medal-icon">🏅</span>
                <div className="learner-mission-hub__ring" />
              </div>
              <div className="learner-mission-hub__stats">
                <div className="learner-mission-hub__stat-item">
                  <span className="learner-mission-hub__stat-label">
                    {locale === "fa" ? "پاداش مأموریت" : "Mission Reward"}
                  </span>
                  <strong className="learner-mission-hub__stat-value">+50 XP</strong>
                </div>
                <div className="learner-mission-hub__divider" />
                <div className="learner-mission-hub__stat-item">
                  <span className="learner-mission-hub__stat-label">
                    {locale === "fa" ? "پیشرفت مسیر" : "Path Step"}
                  </span>
                  <strong className="learner-mission-hub__stat-value">
                    {data.path_steps.filter((s) => s.state === "complete").length} / {data.path_steps.length}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Dedicated Grade 12 & Final Exams Showcase (ویژه امتحانات نهایی زبان دوازدهم — تمرین تا ۲۰) */}
      <section className="learner-exam-showcase" aria-labelledby="learner-exam-showcase-title">
        <div className="learner-exam-showcase__content">
          <div className="learner-exam-showcase__badge-row">
            <span className="learner-exam-showcase__badge">
              <span className="learner-exam-showcase__pulse-dot" aria-hidden="true" />
              {t.examShowcaseBadge}
            </span>
            <span className="learner-exam-showcase__tag">
              {locale === "fa" ? "تضمین نمره نهایی" : "Final Score Booster"}
            </span>
          </div>

          <h2 id="learner-exam-showcase-title" className="learner-exam-showcase__title">
            {t.examShowcaseTitle}
          </h2>
          <p className="learner-exam-showcase__desc">
            {t.examShowcaseDesc}
          </p>

          <div className="learner-exam-showcase__chips">
            <span className="learner-exam-chip">✨ {t.examShowcaseStat1}</span>
            <span className="learner-exam-chip">🎙️ {t.examShowcaseStat2}</span>
            <span className="learner-exam-chip">📈 {t.examShowcaseStat3}</span>
          </div>

          <div className="learner-exam-showcase__actions">
            <Link
              href="/high-school/grade-12/tamrin20"
              className="learner-button learner-button--exam"
            >
              <span>{t.examShowcaseAction}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="learner-exam-showcase__visual" aria-hidden="true">
          <div className="learner-exam-showcase__score-card">
            <span className="learner-exam-showcase__score-num">۲۰</span>
            <span className="learner-exam-showcase__score-lbl">هدف نهایی</span>
            <div className="learner-exam-showcase__score-glow" />
          </div>
        </div>
      </section>

      {/* 5. Golden Learning Tools Row (3 Direct Glass Cards - No hidden tabs) */}
      <section className="learner-golden-tools" aria-labelledby="golden-tools-title">
        <header className="learner-section-header">
          <div>
            <h2 id="golden-tools-title" className="learner-section-title">
              {t.goldenToolsTitle}
            </h2>
            <p className="learner-section-subtitle">{t.goldenToolsSubtitle}</p>
          </div>
        </header>

        <div className="learner-golden-tools__grid">
          {/* Tool 1: AI Speaking */}
          <Link href="/practice-ai" className="learner-golden-card learner-golden-card--mic">
            <div className="learner-golden-card__header">
              <span className="learner-golden-card__icon" aria-hidden="true">
                <DashboardIcon name="mic" />
              </span>
              <span className="learner-golden-card__badge">{t.tool1Badge}</span>
            </div>
            <h3 className="learner-golden-card__title">{t.tool1Title}</h3>
            <p className="learner-golden-card__desc">{t.tool1Desc}</p>
            <div className="learner-golden-card__footer">
              <span>{t.tool1Action}</span>
              <span className="learner-golden-card__arrow" aria-hidden="true">
                {locale === "fa" ? "←" : "→"}
              </span>
            </div>
          </Link>

          {/* Tool 2: Leitner Box */}
          <Link href="/review" className="learner-golden-card learner-golden-card--brain">
            <div className="learner-golden-card__header">
              <span className="learner-golden-card__icon" aria-hidden="true">
                <DashboardIcon name="brain" />
              </span>
              <span className="learner-golden-card__badge">{t.tool2Badge}</span>
            </div>
            <h3 className="learner-golden-card__title">{t.tool2Title}</h3>
            <p className="learner-golden-card__desc">{t.tool2Desc}</p>
            <div className="learner-golden-card__footer">
              <span>{t.tool2Action}</span>
              <span className="learner-golden-card__arrow" aria-hidden="true">
                {locale === "fa" ? "←" : "→"}
              </span>
            </div>
          </Link>

          {/* Tool 3: Personal Learning Path */}
          <Link href="/path" className="learner-golden-card learner-golden-card--path">
            <div className="learner-golden-card__header">
              <span className="learner-golden-card__icon" aria-hidden="true">
                <DashboardIcon name="path" />
              </span>
              <span className="learner-golden-card__badge">{t.tool3Badge}</span>
            </div>
            <h3 className="learner-golden-card__title">{t.tool3Title}</h3>
            <p className="learner-golden-card__desc">{t.tool3Desc}</p>
            <div className="learner-golden-card__footer">
              <span>{t.tool3Action}</span>
              <span className="learner-golden-card__arrow" aria-hidden="true">
                {locale === "fa" ? "←" : "→"}
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 6. Parallel 2-Column Section: Skills Mastery Radar & Recent Milestones */}
      <section className="learner-dual-section" aria-label="Progress and Activities">
        {/* Column 1: Skills Mastery */}
        <div className="learner-dual-col">
          <div className="learner-card learner-skills-card">
            <header className="learner-card__header">
              <span className="learner-card__header-icon">
                <DashboardIcon name="skills" />
              </span>
              <div>
                <h2 className="learner-card__header-title">{t.skillsRadarTitle}</h2>
                <p className="learner-card__header-subtitle">{t.skillsRadarDesc}</p>
              </div>
            </header>

            {data.skills.length === 0 ? (
              <div className="learner-skills-empty">
                <span className="learner-skills-empty__emoji" aria-hidden="true">🌱</span>
                <p>{t.noEvidence}</p>
                <Link href="/placement" className="learner-button learner-button--secondary" style={{ marginTop: "1rem" }}>
                  {locale === "fa" ? "آزمون تعیین سطح اولیه" : "Start Placement"}
                </Link>
              </div>
            ) : (
              <ul className="learner-skill-list">
                {data.skills.map((skill, idx) => (
                  <li key={skill.id} className="learner-skill-item">
                    <div className="learner-skill-item__top">
                      <strong className="learner-skill-item__label">
                        {locale === "fa" ? skill.label_fa : skill.label_en}
                      </strong>
                      <span className="learner-skill-item__status">
                        {locale === "fa" ? skill.status_fa : skill.status_en}
                      </span>
                    </div>
                    <div className="learner-skill-item__bar-track" aria-hidden="true">
                      <div
                        className={`learner-skill-item__bar-fill learner-skill-item__bar-fill--${idx % 6}`}
                        style={{ width: `${Math.max(25, 40 + idx * 10)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="learner-skills-card__footer">
              <Link href="/path" className="learner-subtle-link">
                <span>{t.viewFullSkills}</span>
                <span aria-hidden="true">{locale === "fa" ? "←" : "→"}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Column 2: Recent Milestones & Activities */}
        <div className="learner-dual-col">
          <div className="learner-card learner-activities-card">
            <header className="learner-card__header">
              <span className="learner-card__header-icon">
                <DashboardIcon name="trophy" />
              </span>
              <div>
                <h2 className="learner-card__header-title">{t.recentActivitiesTitle}</h2>
                <p className="learner-card__header-subtitle">{t.recentActivitiesDesc}</p>
              </div>
            </header>

            {data.recent_activities && data.recent_activities.length > 0 ? (
              <div className="learner-activities__list">
                {data.recent_activities.slice(0, 4).map((act) => {
                  const title = locale === "fa" ? act.title_fa : act.title_en || act.title_fa;
                  const desc = locale === "fa" ? act.description_fa : act.description_en || act.description_fa;
                  const timeAgo = locale === "fa" ? act.time_ago_fa : act.time_ago_en || act.time_ago_fa;

                  return (
                    <div key={act.id} className="learner-activity-card">
                      <span className="learner-activity-card__symbol" aria-hidden="true">
                        {act.icon || "⚡"}
                      </span>
                      <div className="learner-activity-card__details">
                        <h4 className="learner-activity-card__title">{title}</h4>
                        {desc ? <p className="learner-activity-card__desc">{desc}</p> : null}
                        {timeAgo ? <span className="learner-activity-card__time">{timeAgo}</span> : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="learner-activities__empty">
                <span className="learner-activities__empty-icon" aria-hidden="true">✨</span>
                <p>{t.recentActivitiesEmpty}</p>
              </div>
            )}

            <div className="learner-activities-card__footer">
              <Link href="/achievements" className="learner-subtle-link">
                <span>{t.viewAllAchievements}</span>
                <span aria-hidden="true">{locale === "fa" ? "←" : "→"}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Subtle Info Modal / Trigger (Replaces the dry, ugly big details block) */}
      <footer className="learner-info-footer">
        <button
          type="button"
          className="learner-info-trigger"
          onClick={() => setShowInfoModal((curr) => !curr)}
        >
          <span aria-hidden="true">ℹ️</span>
          <span>{t.accuracy}</span>
        </button>

        {showInfoModal ? (
          <div className="learner-info-modal-card" role="dialog" aria-modal="true">
            <div className="learner-info-modal-card__header">
              <strong>{t.accuracy}</strong>
              <button
                type="button"
                className="learner-info-modal-card__close"
                onClick={() => setShowInfoModal(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <ul>
              {limitations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="learner-info-modal-card__note">{t.accountNote}</p>
          </div>
        ) : null}
      </footer>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, type ReactNode } from "react";

import {
  trackTeacherAction,
  type TeacherPrimaryActionId,
} from "../../lib/teacher-dashboard";
import { useTeacherHome } from "./TeacherShell";

type Locale = "fa" | "en";

type DashboardIconName =
  | "classes"
  | "students"
  | "requests"
  | "grading"
  | "schedule"
  | "question"
  | "wallet"
  | "sparkles"
  | "chart"
  | "book"
  | "exam"
  | "arrow"
  | "check"
  | "alert"
  | "liveStudio"
  | "brain"
  | "planning";

const iconPaths: Record<DashboardIconName, ReactNode> = {
  classes: (
    <>
      <path d="M4 5h16v12H4z" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  students: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 21a6.5 6.5 0 0 1 13 0M17 6.5a3 3 0 0 1 0 5.5M18 15a5 5 0 0 1 3.5 5" />
    </>
  ),
  requests: (
    <>
      <path d="M5 3h11l3 3v15H5z" />
      <path d="M15 3v4h4M8 11h7M8 15h4" />
      <circle cx="17.5" cy="17.5" r="3.5" />
    </>
  ),
  grading: (
    <>
      <path d="m4 18 1-4L15.5 3.5a2.1 2.1 0 0 1 3 3L8 17z" />
      <path d="m13.5 5.5 3 3M4 21h16" />
    </>
  ),
  schedule: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M7 3v4M17 3v4M3 10h18" />
    </>
  ),
  question: (
    <>
      <path d="M5 3h14v18H5z" />
      <path d="M9 8h6M9 12h4M9 16h6" />
    </>
  ),
  wallet: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <circle cx="16" cy="14" r="1.5" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  exam: (
    <>
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="2" />
      <path d="m9 14 2 2 4-4" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
  check: (
    <>
      <polyline points="20 6 9 17 4 12" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </>
  ),
  liveStudio: (
    <>
      <path d="m15.5 8.5 5-3v13l-5-3" />
      <rect x="2" y="6" width="13.5" height="12" rx="2.5" />
      <circle cx="8" cy="12" r="2.5" />
    </>
  ),
  brain: (
    <>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-5.04z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-5.04z" />
      <circle cx="12" cy="12" r="1.5" />
      <path d="m19 4 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" />
    </>
  ),
  planning: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </>
  ),
};

function Icon({ name }: { name: DashboardIconName }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="teacher-bento-icon"
    >
      {iconPaths[name]}
    </svg>
  );
}

function localText(locale: Locale, fa: string, en: string): string {
  return locale === "fa" ? fa : en;
}

function actionLabel(locale: Locale, actionId: TeacherPrimaryActionId): string {
  const values: Record<TeacherPrimaryActionId, [string, string]> = {
    verify_profile: ["ارسال مدارک هویتی", "Start verification"],
    teach_next_session: ["ورود به جلسه تدریس بعدی", "Open next session"],
    answer_request: ["بررسی درخواست تدریس", "Review tutoring request"],
    grade_work: ["ورود به صف تصحیح", "Open grading queue"],
    complete_profile: ["تکمیل پروفایل مدرسی", "Complete profile"],
    prepare_first_class: ["آماده‌سازی فضای کلاس", "Prepare classroom"],
  };
  return localText(locale, ...values[actionId]);
}

export function TeacherDashboard() {
  const { data, locale, online, activeClass, classesList } = useTeacherHome();
  const fa = locale === "fa";

  const action = data.primary_action;
  const isVerified = data.capabilities.teacher_verified;

  // Stats values
  const classesCount = data.classes.count ?? 0;
  const studentsCount = data.students.count ?? 0;
  const requestsCount = data.learn_now_requests.count ?? 0;
  const gradingCount = data.pending_grading.count ?? 0;
  const earningsFormatted =
    data.earnings.available && data.earnings.amount_toman !== null
      ? `${data.earnings.amount_toman.toLocaleString(fa ? "fa-IR" : "en-US")} ${localText(locale, "تومان", "Toman")}`
      : localText(locale, "کیف‌پول من", "My Wallet");

  // Determine Live Room Link
  const liveUrl = activeClass
    ? `/teacher/classes/${activeClass.id}/live`
    : classesList && classesList.length > 0
    ? `/teacher/classes/${classesList[0].id}/live`
    : "/teacher/classes";

  // Dynamic time-of-day greeting
  const greetingTimeText = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return localText(locale, "صبح بخیر", "Good morning");
    if (hour >= 12 && hour < 17) return localText(locale, "عصر بخیر", "Good afternoon");
    return localText(locale, "شب بخیر", "Good evening");
  }, [locale]);

  // Floating KPI Cards Configuration
  const kpiCards = useMemo(() => [
    {
      href: "/teacher/classes",
      labelFa: "کلاس‌های فعال",
      labelEn: "Active Classes",
      count: classesCount.toLocaleString(fa ? "fa-IR" : "en-US"),
      subFa: "کلاس ترمیک",
      subEn: "Cohorts",
      icon: "classes" as const,
      iconClass: "teacher-kpi-card__icon--blue",
    },
    {
      href: "/teacher/students",
      labelFa: "زبان‌آموزان",
      labelEn: "Learners",
      count: studentsCount.toLocaleString(fa ? "fa-IR" : "en-US"),
      subFa: "شاگرد فعال",
      subEn: "Enrolled",
      icon: "students" as const,
      iconClass: "teacher-kpi-card__icon--cyan",
    },
    {
      href: "/teacher/grading",
      labelFa: "در صف تصحیح",
      labelEn: "Pending Grading",
      count: gradingCount.toLocaleString(fa ? "fa-IR" : "en-US"),
      badgeFa: gradingCount > 0 ? "بررسی فوری ⚡" : "به‌روز ✨",
      badgeEn: gradingCount > 0 ? "Action Needed ⚡" : "All Checked ✨",
      badgeClass: gradingCount > 0 ? "teacher-kpi-card__badge--amber" : "teacher-kpi-card__badge--green",
      isUrgent: gradingCount > 0,
      icon: "grading" as const,
      iconClass: "teacher-kpi-card__icon--amber",
    },
    {
      href: "/marketplace/requests",
      labelFa: "درخواست‌های تدریس",
      labelEn: "Tutoring Requests",
      count: requestsCount.toLocaleString(fa ? "fa-IR" : "en-US"),
      subFa: "درخواست جدید",
      subEn: "New Requests",
      icon: "requests" as const,
      iconClass: "teacher-kpi-card__icon--purple",
    },
    {
      href: "/teacher/earnings",
      labelFa: "کیف‌پول و درآمد",
      labelEn: "Wallet & Earnings",
      customValue: earningsFormatted,
      badgeFa: "تسویه ماهانه",
      badgeEn: "Monthly Payout",
      badgeClass: "teacher-kpi-card__badge--green",
      icon: "wallet" as const,
      iconClass: "teacher-kpi-card__icon--emerald",
    },
  ], [classesCount, studentsCount, gradingCount, requestsCount, earningsFormatted, fa]);

  // Tool Clusters
  const assessmentTools = [
    {
      href: "/teacher/classes",
      icon: "classes" as const,
      accent: "#0284c7",
      iconBg: "linear-gradient(135deg, rgba(2, 132, 199, 0.18), rgba(3, 105, 161, 0.28))",
      badgeFa: `${classesCount} کلاس فعال`,
      badgeEn: `${classesCount} Cohorts`,
      titleFa: "کلاس‌ها و دوره‌های آموزشی",
      titleEn: "Classes & Cohorts",
      descFa: "مدیریت تقویم کلاس‌ها، اسامی و مشخصات زبان‌آموزان و ورود مستقیم به وب‌کلاس.",
      descEn: "Manage course schedules, student rosters, and launch virtual classrooms.",
      actionFa: "مدیریت کلاس‌ها",
      actionEn: "Manage Classes",
    },
    {
      href: "/teacher/online-exams",
      icon: "exam" as const,
      accent: "#0d9488",
      iconBg: "linear-gradient(135deg, rgba(13, 148, 136, 0.18), rgba(15, 118, 110, 0.28))",
      badgeFa: "سامانه آزمون",
      badgeEn: "Exam Engine",
      titleFa: "آزمون‌های آنلاین و زمان‌دار",
      titleEn: "Online Timed Exams",
      descFa: "ساخت آزمون‌های زمان‌بندی‌شده تستی و تشریحی با تصحیح خودکار و گزارش تراز.",
      descEn: "Create objective and essay mock exams with auto-grading and analytics.",
      actionFa: "مدیریت آزمون‌ها",
      actionEn: "Manage Exams",
    },
    {
      href: "/teacher/grading",
      icon: "grading" as const,
      accent: "#d97706",
      iconBg: "linear-gradient(135deg, rgba(217, 119, 6, 0.18), rgba(180, 83, 9, 0.28))",
      badgeFa: gradingCount > 0 ? `${gradingCount} برگه منتظر` : "همه تصحیح شد ✨",
      badgeEn: gradingCount > 0 ? `${gradingCount} Pending` : "All Checked ✨",
      titleFa: "صف تصحیح و استودیوی بازخورد",
      titleEn: "Grading & Writing Studio",
      descFa: "بررسی تکالیف ارسالی، نمره‌دهی تفکیکی مهارتی و ثبت فیدبک تحلیلی گرامر و واژگان با قلم دیجیتال.",
      descEn: "Review student writing, score CEFR rubrics, and deliver targeted corrections.",
      actionFa: "ورود به صف تصحیح",
      actionEn: "Open Queue",
    },
    {
      href: "/teacher/gradebook",
      icon: "chart" as const,
      accent: "#ec4899",
      iconBg: "linear-gradient(135deg, rgba(236, 72, 153, 0.18), rgba(190, 24, 93, 0.28))",
      badgeFa: "دفتر نمرات توصیفی",
      badgeEn: "Competency Ledger",
      titleFa: "دفتر نمرات و استودیوی کارنامه",
      titleEn: "Gradebook & Progress Reports",
      descFa: "ثبت نمرات کلاسی، رصد پیشرفت تحصیلی زبان‌آموزان و صدور کارنامه شکیل دوره‌ای A4 منطبق بر شیوه‌نامه.",
      descEn: "Continuous competency matrices, growth tracking, and printable A4 report cards.",
      actionFa: "مشاهده دفتر نمرات",
      actionEn: "Open Gradebook",
    },
  ];

  const aiAndContentTools = [
    {
      href: "/teacher/interventions",
      icon: "brain" as const,
      accent: "#6366f1",
      iconBg: "linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(79, 70, 229, 0.28))",
      badgeFa: "هوش شناختی زنده ✨",
      badgeEn: "Live Cognitive AI",
      titleFa: "مرکز پایش شناختی و تحلیل کلاس",
      titleEn: "Cognitive AI Diagnostics",
      descFa: "مبتنی بر ۶ موتور یکپارچه Edge AI: تفکیک علّی بی‌دقتی از ضعف پیش‌نیازها و تحلیل زوال حافظه DKT.",
      descEn: "Edge AI diagnostics: Causal prerequisite modeling, memory decay radar, and proctoring.",
      actionFa: "پایش شناختی کلاس",
      actionEn: "Open AI Center",
    },
    {
      href: "/teacher/planning",
      icon: "planning" as const,
      accent: "#8b5cf6",
      iconBg: "linear-gradient(135deg, rgba(139, 92, 246, 0.18), rgba(124, 58, 237, 0.28))",
      badgeFa: "دستیار تدریس AI",
      badgeEn: "Lesson Assistant",
      titleFa: "طرح درس و محتواساز هوشمند",
      titleEn: "AI Lesson Planner & Studio",
      descFa: "تولید خودکار طرح درس استاندارد CEFR، کاربرگ‌های تعاملی و تمرین‌های هدفمند با هوش مصنوعی.",
      descEn: "Automated CEFR lesson plan generation, interactive worksheets, and adaptive drills.",
      actionFa: "استودیوی طرح درس",
      actionEn: "Plan Lessons",
    },
    {
      href: "/teacher/question-bank",
      icon: "question" as const,
      accent: "#4338ca",
      iconBg: "linear-gradient(135deg, rgba(67, 56, 202, 0.18), rgba(55, 48, 163, 0.28))",
      badgeFa: "بانک متمرکز",
      badgeEn: "Item Bank",
      titleFa: "بانک سؤالات متمرکز و استاندارد",
      titleEn: "Centralized Question Bank",
      descFa: "مخزن طبقه‌بندی‌شده سوالات استاندارد به تفکیک سطح CEFR جهت تخصیص سریع به عنوان تکلیف کلاسی.",
      descEn: "Browse CEFR-aligned objective and essay items to assign directly to students.",
      actionFa: "مشاهده بانک سوالات",
      actionEn: "Browse Bank",
    },
  ];

  const growthAndResourceTools = [
    {
      href: "/marketplace/requests",
      icon: "schedule" as const,
      accent: "#10b981",
      iconBg: "linear-gradient(135deg, rgba(16, 185, 129, 0.18), rgba(4, 120, 87, 0.28))",
      badgeFa: `${requestsCount} درخواست فعال`,
      badgeEn: `${requestsCount} Active`,
      titleFa: "بازارچه تدریس خصوصی (Learn Now)",
      titleEn: "Tutoring Marketplace",
      descFa: "درخواست‌های جلسات فوری رفع اشکال (Learn Now) و کلاس‌های اختصاصی زبان‌آموزان.",
      descEn: "View and accept 1-on-1 tutoring sessions and instant diagnostic requests.",
      actionFa: "بررسی بازارچه",
      actionEn: "View Requests",
    },
    {
      href: "/teacher/resources",
      icon: "book" as const,
      accent: "#64748b",
      iconBg: "linear-gradient(135deg, rgba(100, 116, 139, 0.18), rgba(71, 85, 105, 0.28))",
      badgeFa: "کتابخانه و اسناد",
      badgeEn: "Official Docs",
      titleFa: "کتابخانه و استانداردهای تدریس",
      titleEn: "Curriculum & Standards",
      descFa: "شیوه‌نامه‌های رسمی سنجش مهارت‌های شش‌گانه، راهنماهای تداخل زبانی و سرفصل‌های مصوب.",
      descEn: "Official 6-skill CEFR assessment rubrics, pedagogical blueprints and curricula.",
      actionFa: "مشاهده منابع",
      actionEn: "Explore Library",
    },
  ];

  return (
    <div className="teacher-dashboard-container" dir={fa ? "rtl" : "ltr"}>
      {!online && (
        <div className="teacher-offline-banner" role="status">
          {localText(
            locale,
            "ارتباط قطع است؛ اطلاعات بارگیری‌شده قبلی نمایش داده می‌شود.",
            "You are offline; showing last cached information."
          )}
        </div>
      )}

      {/* 1. Executive Welcome Banner */}
      <header className="teacher-executive-banner" aria-label={localText(locale, "میزکار مدرس", "Educator Workspace")}>
        <div className="teacher-executive-banner__glow" aria-hidden="true" />

        <div className="teacher-executive-banner__main">
          <div className="teacher-executive-banner__info">
            <div className="teacher-executive-banner__meta-row">
              <span className={`teacher-verified-badge ${isVerified ? "" : "teacher-verified-badge--warning"}`}>
                <span className="teacher-verified-badge__dot" aria-hidden="true" />
                {isVerified
                  ? localText(locale, "مدرس تأییدشده ایندورا ✓", "Verified Educator ✓")
                  : localText(locale, "احراز هویت در انتظار تکمیل", "Verification Pending")}
              </span>
              <span style={{ fontSize: "0.825rem", color: "var(--color-muted)", fontWeight: 700 }}>
                {greetingTimeText}
              </span>
            </div>

            <h1 className="teacher-executive-greeting">
              {localText(locale, `سلام استاد ${data.greeting_name} عزیز، روزتان پربار`, `Welcome back, Professor ${data.greeting_name}`)}
            </h1>

            <p className="teacher-executive-desc">
              {activeClass ? (
                <>
                  {localText(locale, "کلاس فعال جاری: ", "Active Cohort: ")}
                  <strong>{activeClass.title} ({activeClass.level})</strong>
                  {" • "}
                  {localText(locale, "آماده ورود و برگزاری جلسه تعاملی زنده", "Ready for live interactive session")}
                </>
              ) : (
                localText(
                  locale,
                  "میزکار یکپارچه تدریس، رصد پیشرفت شناختی زبان‌آموزان و ابزارهای استودیویی ایندورا",
                  "Integrated educator workspace, student mastery analytics, and live studio tools"
                )
              )}
            </p>
          </div>

          <div className="teacher-executive-banner__actions">
            <Link href={liveUrl} className="teacher-action-btn teacher-action-btn--live">
              <span className="teacher-live-pulse-ring" aria-hidden="true">
                <span className="teacher-live-pulse-dot" />
              </span>
              <span>{localText(locale, "ورود به کلاس زنده ایندورا", "Launch Live Studio")}</span>
              <span aria-hidden="true">{fa ? "←" : "→"}</span>
            </Link>

            <Link href="/teacher/fixed-classes/new" className="teacher-action-btn teacher-action-btn--secondary">
              <span>+ {localText(locale, "تعریف کلاس جدید", "New Cohort")}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Floating Standalone KPI Cards Grid */}
      <section className="teacher-kpis-grid" aria-label={localText(locale, "شاخص‌های کلیدی عملکرد", "Key Performance Indicators")}>
        {kpiCards.map((kpi, index) => (
          <Link
            key={index}
            href={kpi.href}
            className={`teacher-kpi-card ${kpi.isUrgent ? "teacher-kpi-card--urgent" : ""}`}
          >
            <div className="teacher-kpi-card__head">
              <span className="teacher-kpi-card__label">
                {fa ? kpi.labelFa : kpi.labelEn}
              </span>
              <div className={`teacher-kpi-card__icon ${kpi.iconClass}`} aria-hidden="true">
                <Icon name={kpi.icon} />
              </div>
            </div>

            <div className="teacher-kpi-card__value-row">
              <strong className={`teacher-kpi-card__value ${kpi.customValue ? "teacher-kpi-card__value--sm" : ""}`}>
                {kpi.customValue ?? kpi.count}
              </strong>

              {kpi.badgeFa ? (
                <span className={`teacher-kpi-card__badge ${kpi.badgeClass}`}>
                  {fa ? kpi.badgeFa : kpi.badgeEn}
                </span>
              ) : (
                <span className="teacher-kpi-card__sub">
                  {fa ? kpi.subFa : kpi.subEn}
                </span>
              )}
            </div>
          </Link>
        ))}
      </section>

      {/* 3. Slim Priority Action Strip */}
      <section className="teacher-slim-priority-strip" aria-label={localText(locale, "اقدام اولویت‌دار روز", "Daily Priority Focus")}>
        <div className="teacher-slim-priority-strip__left">
          <span className="teacher-slim-priority-strip__tag">
            <Icon name="sparkles" />
            <span>{localText(locale, "اولویت روز", "Focus")}</span>
          </span>

          <div className="teacher-slim-priority-strip__text">
            <strong>{localText(locale, action.title_fa, action.title_en)}:</strong>
            <p>{localText(locale, action.description_fa, action.description_en)}</p>
          </div>
        </div>

        <Link
          href={action.href}
          className="teacher-slim-priority-btn"
          onClick={() => { void trackTeacherAction("primary_cta_click", action.id); }}
        >
          <span>{actionLabel(locale, action.id)}</span>
          <span className="teacher-slim-priority-btn__arrow" aria-hidden="true">
            {fa ? "←" : "→"}
          </span>
        </Link>
      </section>

      {/* Profile Completeness Bar (if < 100%) */}
      {data.profile_completeness_percent < 100 && (
        <div className="teacher-profile-banner" role="status">
          <div className="teacher-profile-banner__info">
            <span>{localText(locale, "تکمیل مدارک و پروفایل مدرسی:", "Educator verification & profile:")}</span>
            <strong>{data.profile_completeness_percent}%</strong>
          </div>
          <div className="teacher-profile-banner__track" aria-hidden="true">
            <div
              className="teacher-profile-banner__fill"
              style={{ width: `${data.profile_completeness_percent}%` }}
            />
          </div>
          <Link href="/teacher/verification" className="teacher-profile-banner__link">
            {localText(locale, "تکمیل مشخصات", "Complete Profile")} &rarr;
          </Link>
        </div>
      )}

      {/* 4. Flagship Live Studio Bento Card */}
      <Link href={liveUrl} className="teacher-flagship-card">
        <div className="teacher-flagship-card__top">
          <div className="teacher-flagship-card__icon-box" aria-hidden="true">
            <Icon name="liveStudio" />
          </div>
          <span className="teacher-flagship-badge">
            <span className="teacher-bento-card__meta-pulse" aria-hidden="true" />
            <span>{localText(locale, "استودیوی تدریس زنده و تعاملی", "Live & Interactive Studio")}</span>
          </span>
        </div>

        <div className="teacher-flagship-card__body">
          <h3>{localText(locale, "استودیوی تدریس زنده ایندورا (Endoora Live Studio)", "Endoora Live Studio")}</h3>
          <p>
            {localText(
              locale,
              "برگزاری کلاس آنلاین تحت وب با تخته هوشمند چندلایه Canvas، پودیوم ویدیویی، اشتراک دسکتاپ، آزمونک آنی و مانیتورینگ حضور و غیاب تل‌متری.",
              "Web-based virtual classroom with interactive canvas whiteboard, video podium, screen share, instant quiz, and real-time attendance telemetry."
            )}
          </p>
        </div>

        <div className="teacher-flagship-card__foot">
          <span>{localText(locale, "ورود مستقیم به کلاس آنلاین", "Launch Live Studio")}</span>
          <span aria-hidden="true">{fa ? "←" : "→"}</span>
        </div>
      </Link>

      {/* 5. Tool Clusters Bento Grid */}
      {/* Cluster 1: Classes & Assessment */}
      <section className="teacher-tools-cluster" aria-label={localText(locale, "کلاس‌ها و سنجش", "Classes & Assessment")}>
        <h2 className="teacher-cluster-title">
          <span>🎓</span>
          <span>{localText(locale, "کلاس‌ها، سنجش و نمرات", "Classes, Assessment & Ledger")}</span>
        </h2>

        <div className="teacher-tool-grid">
          {assessmentTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="teacher-bento-tool-card"
              style={{ "--tool-accent": tool.accent } as React.CSSProperties}
            >
              <div className="teacher-bento-tool-card__top">
                <div
                  className="teacher-bento-tool-card__icon-box"
                  style={{ background: tool.iconBg, color: tool.accent }}
                  aria-hidden="true"
                >
                  <Icon name={tool.icon} />
                </div>
                <span className="teacher-bento-tool-card__badge">
                  {fa ? tool.badgeFa : tool.badgeEn}
                </span>
              </div>

              <div className="teacher-bento-tool-card__body">
                <h3 className="teacher-bento-tool-card__title">
                  {fa ? tool.titleFa : tool.titleEn}
                </h3>
                <p className="teacher-bento-tool-card__desc">
                  {fa ? tool.descFa : tool.descEn}
                </p>
              </div>

              <div className="teacher-bento-tool-card__footer">
                <span>{fa ? tool.actionFa : tool.actionEn}</span>
                <span className="teacher-bento-tool-card__arrow" aria-hidden="true">
                  {fa ? "←" : "→"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Cluster 2: AI & Curriculum Tools */}
      <section className="teacher-tools-cluster" aria-label={localText(locale, "ابزارهای هوش مصنوعی و محتوا", "AI & Curriculum")}>
        <h2 className="teacher-cluster-title">
          <span>🧠</span>
          <span>{localText(locale, "ابزارهای هوش مصنوعی، پایش شناختی و محتوا", "AI Diagnostics, Planning & Content")}</span>
        </h2>

        <div className="teacher-tool-grid">
          {aiAndContentTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="teacher-bento-tool-card"
              style={{ "--tool-accent": tool.accent } as React.CSSProperties}
            >
              <div className="teacher-bento-tool-card__top">
                <div
                  className="teacher-bento-tool-card__icon-box"
                  style={{ background: tool.iconBg, color: tool.accent }}
                  aria-hidden="true"
                >
                  <Icon name={tool.icon} />
                </div>
                <span className="teacher-bento-tool-card__badge">
                  {fa ? tool.badgeFa : tool.badgeEn}
                </span>
              </div>

              <div className="teacher-bento-tool-card__body">
                <h3 className="teacher-bento-tool-card__title">
                  {fa ? tool.titleFa : tool.titleEn}
                </h3>
                <p className="teacher-bento-tool-card__desc">
                  {fa ? tool.descFa : tool.descEn}
                </p>
              </div>

              <div className="teacher-bento-tool-card__footer">
                <span>{fa ? tool.actionFa : tool.actionEn}</span>
                <span className="teacher-bento-tool-card__arrow" aria-hidden="true">
                  {fa ? "←" : "→"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Cluster 3: Growth & Resources */}
      <section className="teacher-tools-cluster" aria-label={localText(locale, "توسعه، بازارچه و منابع", "Growth & Resources")}>
        <h2 className="teacher-cluster-title">
          <span>💼</span>
          <span>{localText(locale, "توسعه شغلی، بازارچه تدریس و منابع", "Career Growth, Marketplace & Library")}</span>
        </h2>

        <div className="teacher-tool-grid">
          {growthAndResourceTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="teacher-bento-tool-card"
              style={{ "--tool-accent": tool.accent } as React.CSSProperties}
            >
              <div className="teacher-bento-tool-card__top">
                <div
                  className="teacher-bento-tool-card__icon-box"
                  style={{ background: tool.iconBg, color: tool.accent }}
                  aria-hidden="true"
                >
                  <Icon name={tool.icon} />
                </div>
                <span className="teacher-bento-tool-card__badge">
                  {fa ? tool.badgeFa : tool.badgeEn}
                </span>
              </div>

              <div className="teacher-bento-tool-card__body">
                <h3 className="teacher-bento-tool-card__title">
                  {fa ? tool.titleFa : tool.titleEn}
                </h3>
                <p className="teacher-bento-tool-card__desc">
                  {fa ? tool.descFa : tool.descEn}
                </p>
              </div>

              <div className="teacher-bento-tool-card__footer">
                <span>{fa ? tool.actionFa : tool.actionEn}</span>
                <span className="teacher-bento-tool-card__arrow" aria-hidden="true">
                  {fa ? "←" : "→"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

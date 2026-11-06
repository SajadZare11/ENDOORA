"use client";

import Link from "next/link";
import { type ReactNode } from "react";

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
  | "liveStudio";

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

  const action = data.primary_action;
  const isVerified = data.capabilities.teacher_verified;

  // Stats values
  const classesCount = data.classes.count ?? 0;
  const studentsCount = data.students.count ?? 0;
  const requestsCount = data.learn_now_requests.count ?? 0;
  const gradingCount = data.pending_grading.count ?? 0;
  const earningsFormatted =
    data.earnings.available && data.earnings.amount_toman !== null
      ? `${data.earnings.amount_toman.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")} ${localText(locale, "تومان", "Toman")}`
      : localText(locale, "کیف‌پول من", "My Wallet");

  // Determine Live Room Link
  const liveUrl = activeClass
    ? `/teacher/classes/${activeClass.id}/live`
    : classesList && classesList.length > 0
    ? `/teacher/classes/${classesList[0].id}/live`
    : "/teacher/classes";

  return (
    <div className="teacher-dashboard-v2">
      {!online ? (
        <div className="teacher-offline-banner" role="status">
          {localText(
            locale,
            "ارتباط قطع است؛ اطلاعات بارگیری‌شده قبلی نمایش داده می‌شود.",
            "You are offline; showing last cached information."
          )}
        </div>
      ) : null}

      {/* 1. Stripe-Style Integrated Fintech Hero Banner */}
      <header className="teacher-fintech-hero">
        <div className="teacher-fintech-hero__glow-orb" aria-hidden="true" />

        {/* Top bar with greeting & quick actions */}
        <div className="teacher-fintech-hero__top">
          <div className="teacher-fintech-hero__info">
            <div className="teacher-fintech-hero__greeting-row">
              <h1>
                {localText(locale, `سلام استاد ${data.greeting_name} عزیز`, `Welcome back, Teacher ${data.greeting_name}`)}
              </h1>
              <span className={`teacher-v2-pill ${isVerified ? "teacher-v2-pill--verified" : "teacher-v2-pill--warning"}`}>
                <span className="teacher-v2-pill__dot" aria-hidden="true" />
                {isVerified
                  ? localText(locale, "مدرس تأییدشده ✓", "Verified Teacher ✓")
                  : localText(locale, "احراز هویت در انتظار", "Verification Pending")}
              </span>
            </div>
            <p className="teacher-fintech-hero__desc">
              {activeClass
                ? localText(
                    locale,
                    `کلاس فعال جاری: ${activeClass.title} (${activeClass.level}) • آماده برگزاری جلسه زنده`,
                    `Active Cohort: ${activeClass.title} (${activeClass.level}) • Ready for live session`
                  )
                : localText(
                    locale,
                    "میز کار یکپارچه تدریس، رصد پیشرفت زبان‌آموزان و ابزارهای استودیویی ایندورا",
                    "Integrated educator workspace, student mastery analytics and live studio tools"
                  )}
            </p>
          </div>

          <div className="teacher-fintech-hero__actions">
            <Link href={liveUrl} className="teacher-fintech-btn teacher-fintech-btn--live">
              <span className="teacher-live-pulse-ring" aria-hidden="true">
                <span className="teacher-live-pulse-dot" />
              </span>
              <span>{localText(locale, "ورود به کلاس زنده ایندورا", "Enter Live Studio")}</span>
            </Link>
            <Link href="/teacher/fixed-classes/new" className="teacher-fintech-btn teacher-fintech-btn--secondary">
              <span>+ {localText(locale, "کلاس جدید", "New Class")}</span>
            </Link>
          </div>
        </div>

        {/* Integrated KPI Metrics Row inside Hero */}
        <div className="teacher-fintech-hero__kpis" aria-label={localText(locale, "شاخص‌های کلیدی", "Key Metrics")}>
          {/* KPI 1: Classes */}
          <Link href="/teacher/classes" className="teacher-fintech-kpi">
            <div className="teacher-fintech-kpi__header">
              <span className="teacher-fintech-kpi__label">{localText(locale, "کلاس‌های فعال", "Active Classes")}</span>
              <div className="teacher-fintech-kpi__icon teacher-fintech-kpi__icon--blue">
                <Icon name="classes" />
              </div>
            </div>
            <div className="teacher-fintech-kpi__value-row">
              <strong className="teacher-fintech-kpi__value">
                {classesCount.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}
              </strong>
              <span className="teacher-fintech-kpi__sub">
                {localText(locale, "کلاس ترمیک", "Cohorts")}
              </span>
            </div>
          </Link>

          {/* KPI 2: Students */}
          <Link href="/teacher/students" className="teacher-fintech-kpi">
            <div className="teacher-fintech-kpi__header">
              <span className="teacher-fintech-kpi__label">{localText(locale, "زبان‌آموزان", "Learners")}</span>
              <div className="teacher-fintech-kpi__icon teacher-fintech-kpi__icon--cyan">
                <Icon name="students" />
              </div>
            </div>
            <div className="teacher-fintech-kpi__value-row">
              <strong className="teacher-fintech-kpi__value">
                {studentsCount.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}
              </strong>
              <span className="teacher-fintech-kpi__sub">
                {localText(locale, "شاگرد فعال", "Enrolled")}
              </span>
            </div>
          </Link>

          {/* KPI 3: Grading Queue */}
          <Link
            href="/teacher/grading"
            className={`teacher-fintech-kpi ${gradingCount > 0 ? "teacher-fintech-kpi--urgent" : ""}`}
          >
            <div className="teacher-fintech-kpi__header">
              <span className="teacher-fintech-kpi__label">{localText(locale, "در صف تصحیح", "Pending Grading")}</span>
              <div className="teacher-fintech-kpi__icon teacher-fintech-kpi__icon--amber">
                <Icon name="grading" />
              </div>
            </div>
            <div className="teacher-fintech-kpi__value-row">
              <strong className="teacher-fintech-kpi__value">
                {gradingCount.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}
              </strong>
              <span
                className={`teacher-fintech-kpi__badge ${
                  gradingCount > 0 ? "teacher-fintech-kpi__badge--amber" : "teacher-fintech-kpi__badge--green"
                }`}
              >
                {gradingCount > 0
                  ? localText(locale, "بررسی فوری ⚡", "Action Needed ⚡")
                  : localText(locale, "به‌روز ✨", "Done ✨")}
              </span>
            </div>
          </Link>

          {/* KPI 4: Requests */}
          <Link href="/marketplace/requests" className="teacher-fintech-kpi">
            <div className="teacher-fintech-kpi__header">
              <span className="teacher-fintech-kpi__label">{localText(locale, "درخواست‌های تدریس", "Tutoring Requests")}</span>
              <div className="teacher-fintech-kpi__icon teacher-fintech-kpi__icon--purple">
                <Icon name="requests" />
              </div>
            </div>
            <div className="teacher-fintech-kpi__value-row">
              <strong className="teacher-fintech-kpi__value">
                {requestsCount.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}
              </strong>
              <span className="teacher-fintech-kpi__sub">
                {localText(locale, "درخواست جدید", "New")}
              </span>
            </div>
          </Link>

          {/* KPI 5: Earnings */}
          <Link href="/teacher/earnings" className="teacher-fintech-kpi">
            <div className="teacher-fintech-kpi__header">
              <span className="teacher-fintech-kpi__label">{localText(locale, "کیف‌پول و درآمد", "Wallet & Earnings")}</span>
              <div className="teacher-fintech-kpi__icon teacher-fintech-kpi__icon--emerald">
                <Icon name="wallet" />
              </div>
            </div>
            <div className="teacher-fintech-kpi__value-row">
              <strong className="teacher-fintech-kpi__value teacher-fintech-kpi__value--sm">
                {earningsFormatted}
              </strong>
              <span className="teacher-fintech-kpi__badge teacher-fintech-kpi__badge--green">
                {localText(locale, "تسویه ماهانه", "Wallet")}
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* 2. Priority Action Strip (Glassmorphism Smart Bar) */}
      <section className="teacher-smart-priority-strip" aria-label={localText(locale, "اقدام اولویت‌دار", "Priority Action")}>
        <div className="teacher-smart-priority-strip__left">
          <div className="teacher-smart-priority-strip__badge">
            <Icon name="sparkles" />
            <span>{localText(locale, "اولویت روز", "Focus")}</span>
          </div>
          <div className="teacher-smart-priority-strip__text">
            <strong>{localText(locale, action.title_fa, action.title_en)}</strong>
            <p>{localText(locale, action.description_fa, action.description_en)}</p>
          </div>
        </div>

        <div className="teacher-smart-priority-strip__right">
          <Link
            href={action.href}
            className="teacher-smart-priority-btn"
            onClick={() => void trackTeacherAction("primary_cta_click", action.id)}
          >
            <span>{actionLabel(locale, action.id)}</span>
            <span className="teacher-smart-priority-btn__arrow" aria-hidden="true">
              {locale === "fa" ? "←" : "→"}
            </span>
          </Link>
        </div>
      </section>

      {/* Profile Completeness Bar (if < 100%) */}
      {data.profile_completeness_percent < 100 ? (
        <div className="teacher-profile-banner">
          <div className="teacher-profile-banner__info">
            <span>{localText(locale, "تکمیل مدارک و مشخصات مدرسی", "Educator profile completion")}</span>
            <strong>{data.profile_completeness_percent}%</strong>
          </div>
          <div className="teacher-profile-banner__track" aria-hidden="true">
            <div
              className="teacher-profile-banner__fill"
              style={{ width: `${data.profile_completeness_percent}%` }}
            />
          </div>
          <Link href="/teacher/verification" className="teacher-profile-banner__link">
            {localText(locale, "تکمیل پروفایل", "Complete Profile")} &rarr;
          </Link>
        </div>
      ) : null}

      {/* 3. Sleek 8-Card Bento Grid */}
      <section className="teacher-bento-grid" aria-label={localText(locale, "ابزارهای تدریس", "Teaching Tools")}>
        {/* Card 1: Flagship Live Studio */}
        <Link href={liveUrl} className="teacher-bento-card teacher-bento-card--flagship">
          <div className="teacher-bento-card__head">
            <div className="teacher-bento-card__icon-box teacher-bento-card__icon-box--live">
              <Icon name="liveStudio" />
            </div>
            <span className="teacher-bento-card__meta teacher-bento-card__meta--live">
              <span className="teacher-bento-card__meta-pulse" aria-hidden="true" />
              {localText(locale, "زنده و تعاملی", "Live & Interactive")}
            </span>
          </div>
          <div className="teacher-bento-card__body">
            <h3>{localText(locale, "استودیوی تدریس زنده ایندورا", "Endoora Live Studio")}</h3>
            <p>
              {localText(
                locale,
                "برگزاری کلاس آنلاین تحت وب با تخته هوشمند Canvas، وب‌کم، اشتراک دسکتاپ، کوئیز آنی و حضور و غیاب تل‌متری.",
                "Web-based virtual classroom with interactive canvas whiteboard, video podium, screen share and instant quiz."
              )}
            </p>
          </div>
          <div className="teacher-bento-card__foot">
            <span className="teacher-bento-card__action teacher-bento-card__action--live">
              {localText(locale, "ورود مستقیم به کلاس آنلاین", "Launch Live Studio")} {locale === "fa" ? "←" : "→"}
            </span>
          </div>
        </Link>

        {/* Card 2: Classes Hub */}
        <Link href="/teacher/classes" className="teacher-bento-card">
          <div className="teacher-bento-card__head">
            <div className="teacher-bento-card__icon-box teacher-bento-card__icon-box--blue">
              <Icon name="classes" />
            </div>
            <span className="teacher-bento-card__meta">
              {localText(locale, `${classesCount} کلاس فعال`, `${classesCount} Cohorts`)}
            </span>
          </div>
          <div className="teacher-bento-card__body">
            <h3>{localText(locale, "کلاس‌ها و دوره‌های آموزشی", "Classes & Cohorts")}</h3>
            <p>
              {localText(
                locale,
                "مدیریت تقویم کلاس‌ها، مشخصات و نوبت زبان‌آموزان و لینک مستقیم به فضای کلاس آنلاین ادوبی کانکت.",
                "Manage schedule, student roster and one-click entry to live virtual classrooms."
              )}
            </p>
          </div>
          <div className="teacher-bento-card__foot">
            <span className="teacher-bento-card__action">
              {localText(locale, "مشاهده و مدیریت کلاس‌ها", "Open Class Hub")} {locale === "fa" ? "←" : "→"}
            </span>
          </div>
        </Link>

        {/* Card 3: Grading Queue */}
        <Link href="/teacher/grading" className="teacher-bento-card">
          <div className="teacher-bento-card__head">
            <div className="teacher-bento-card__icon-box teacher-bento-card__icon-box--amber">
              <Icon name="grading" />
            </div>
            <span
              className={`teacher-bento-card__meta ${
                gradingCount > 0 ? "teacher-bento-card__meta--amber" : ""
              }`}
            >
              {gradingCount > 0
                ? localText(locale, `${gradingCount} برگه منتظر تصحیح`, `${gradingCount} Pending`)
                : localText(locale, "همه تصحیح شد", "All Checked")}
            </span>
          </div>
          <div className="teacher-bento-card__body">
            <h3>{localText(locale, "صف تصحیح و استودیوی بازخورد", "Grading & Writing Studio")}</h3>
            <p>
              {localText(
                locale,
                "بررسی تکالیف ارسالی، نمره‌دهی تفکیکی مهارتی و ثبت فیدبک تحلیلی گرامر و واژگان با قلم دیجیتال.",
                "Review student writing, score CEFR rubrics, and deliver targeted corrections."
              )}
            </p>
          </div>
          <div className="teacher-bento-card__foot">
            <span className="teacher-bento-card__action">
              {localText(locale, "ورود به صف تصحیح", "Open Grading Queue")} {locale === "fa" ? "←" : "→"}
            </span>
          </div>
        </Link>

        {/* Card 4: Online Exams */}
        <Link href="/teacher/online-exams" className="teacher-bento-card">
          <div className="teacher-bento-card__head">
            <div className="teacher-bento-card__icon-box teacher-bento-card__icon-box--teal">
              <Icon name="exam" />
            </div>
            <span className="teacher-bento-card__meta">
              {localText(locale, "سامانه آزمون", "Exam Engine")}
            </span>
          </div>
          <div className="teacher-bento-card__body">
            <h3>{localText(locale, "آزمون‌های آنلاین و زمان‌دار", "Online Exams")}</h3>
            <p>
              {localText(
                locale,
                "ساخت آزمون‌های زمان‌بندی‌شده تستی و تشریحی با تصحیح خودکار و گزارش تحلیلی نمرات و تراز.",
                "Create timed quizzes and mock exams with auto-grading and mastery analytics."
              )}
            </p>
          </div>
          <div className="teacher-bento-card__foot">
            <span className="teacher-bento-card__action">
              {localText(locale, "مدیریت آزمون‌ها", "Manage Exams")} {locale === "fa" ? "←" : "→"}
            </span>
          </div>
        </Link>

        {/* Card 5: Question Bank */}
        <Link href="/teacher/question-bank" className="teacher-bento-card">
          <div className="teacher-bento-card__head">
            <div className="teacher-bento-card__icon-box teacher-bento-card__icon-box--indigo">
              <Icon name="question" />
            </div>
            <span className="teacher-bento-card__meta">
              {localText(locale, "بانک سوالات", "Question Bank")}
            </span>
          </div>
          <div className="teacher-bento-card__body">
            <h3>{localText(locale, "بانک سؤالات متمرکز", "Question Bank")}</h3>
            <p>
              {localText(
                locale,
                "مخزن طبقه‌بندی‌شده سوالات استاندارد به تفکیک سطح CEFR جهت تخصیص سریع به عنوان تکلیف کلاسی.",
                "Browse CEFR-aligned objective and essay items to assign directly to students."
              )}
            </p>
          </div>
          <div className="teacher-bento-card__foot">
            <span className="teacher-bento-card__action">
              {localText(locale, "مشاهده بانک سوالات", "Browse Bank")} {locale === "fa" ? "←" : "→"}
            </span>
          </div>
        </Link>

        {/* Card 6: Gradebook & Analytics */}
        <Link href="/teacher/gradebook" className="teacher-bento-card">
          <div className="teacher-bento-card__head">
            <div className="teacher-bento-card__icon-box teacher-bento-card__icon-box--purple">
              <Icon name="chart" />
            </div>
            <span className="teacher-bento-card__meta">
              {localText(locale, "دفتر نمرات", "Gradebook")}
            </span>
          </div>
          <div className="teacher-bento-card__body">
            <h3>{localText(locale, "دفتر نمرات و استودیوی کارنامه", "Gradebook & Progress Reports")}</h3>
            <p>
              {localText(
                locale,
                "ثبت نمرات کلاسی، رصد پیشرفت تحصیلی زبان‌آموزان و صدور کارنامه شکیل دوره‌ای منطبق بر شیوه‌نامه.",
                "Continuous assessment matrices, competency records and official progress cards."
              )}
            </p>
          </div>
          <div className="teacher-bento-card__foot">
            <span className="teacher-bento-card__action">
              {localText(locale, "مشاهده نمرات و کارنامه‌ها", "Open Gradebook")} {locale === "fa" ? "←" : "→"}
            </span>
          </div>
        </Link>

        {/* Card 7: Marketplace Tutoring */}
        <Link href="/marketplace/requests" className="teacher-bento-card">
          <div className="teacher-bento-card__head">
            <div className="teacher-bento-card__icon-box teacher-bento-card__icon-box--green">
              <Icon name="schedule" />
            </div>
            <span className="teacher-bento-card__meta">
              {localText(locale, `${requestsCount} درخواست فعال`, `${requestsCount} Active`)}
            </span>
          </div>
          <div className="teacher-bento-card__body">
            <h3>{localText(locale, "بازارچه درخواست‌های تدریس", "Tutoring Marketplace")}</h3>
            <p>
              {localText(
                locale,
                "درخواست‌های جلسات فوری رفع اشکال (Learn Now) و کلاس‌های اختصاصی زبان‌آموزان.",
                "View and accept 1-on-1 tutoring sessions and instant diagnostic requests."
              )}
            </p>
          </div>
          <div className="teacher-bento-card__foot">
            <span className="teacher-bento-card__action">
              {localText(locale, "بررسی بازارچه درخواست‌ها", "View Requests")} {locale === "fa" ? "←" : "→"}
            </span>
          </div>
        </Link>

        {/* Card 8: Teaching Resources */}
        <Link href="/teacher/resources" className="teacher-bento-card">
          <div className="teacher-bento-card__head">
            <div className="teacher-bento-card__icon-box teacher-bento-card__icon-box--slate">
              <Icon name="book" />
            </div>
            <span className="teacher-bento-card__meta">
              {localText(locale, "کتابخانه منابع", "Resources")}
            </span>
          </div>
          <div className="teacher-bento-card__body">
            <h3>{localText(locale, "کتابخانه و استانداردهای تدریس", "Curriculum & Standards")}</h3>
            <p>
              {localText(
                locale,
                "شیوه‌نامه‌های رسمی سنجش مهارت‌های شش‌گانه، راهنماهای تداخل زبانی و سرفصل‌های مصوب.",
                "Official 6-skill CEFR assessment rubrics, pedagogical blueprints and curricula."
              )}
            </p>
          </div>
          <div className="teacher-bento-card__foot">
            <span className="teacher-bento-card__action">
              {localText(locale, "مشاهده منابع آموزشی", "Explore Resources")} {locale === "fa" ? "←" : "→"}
            </span>
          </div>
        </Link>
      </section>
    </div>
  );
}

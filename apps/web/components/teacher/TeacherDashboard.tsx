"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

import {
  trackTeacherAction,
  type TeacherPrimaryActionId,
} from "../../lib/teacher-dashboard";
import { useTeacherHome } from "./TeacherShell";
import { QuickCreateModal } from "./QuickCreateModal";

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
  | "alert";

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
  const { data, locale, online, activeClass } = useTeacherHome();
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);

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

      {/* 1. Sleek Minimalist Header */}
      <header className="teacher-v2-header">
        <div className="teacher-v2-header__text">
          <div className="teacher-v2-header__title-row">
            <h1>
              {localText(locale, `سلام استاد ${data.greeting_name}`, `Welcome, Teacher ${data.greeting_name}`)}
            </h1>
            <span className={`teacher-v2-pill ${isVerified ? "teacher-v2-pill--verified" : "teacher-v2-pill--warning"}`}>
              {isVerified
                ? localText(locale, "مدرس تأییدشده ✓", "Verified Teacher ✓")
                : localText(locale, "احراز هویت در حال بررسی", "Verification Pending")}
            </span>
          </div>
          <p className="teacher-v2-header__desc">
            {activeClass
              ? localText(
                  locale,
                  `کلاس فعال جاری: ${activeClass.title} (${activeClass.level})`,
                  `Active Class: ${activeClass.title} (${activeClass.level})`
                )
              : localText(
                  locale,
                  "خلاصه وضعیت آموزشی، کلاس‌های ترم و دسترسی سریع به ابزارهای تدریس",
                  "Academic overview, active cohorts and instant teaching tools"
                )}
          </p>
        </div>

        <div className="teacher-v2-header__actions">
          <button
            type="button"
            className="teacher-btn teacher-btn--ai"
            onClick={() => setQuickCreateOpen(true)}
          >
            <span>⚡ {localText(locale, "ساخت سریع محتوا (AI)", "Quick Create (AI)")}</span>
          </button>
          <Link href="/teacher/fixed-classes/new" className="teacher-btn teacher-btn--primary">
            <span>+ {localText(locale, "ایجاد کلاس جدید", "New Class")}</span>
          </Link>
        </div>
      </header>

      {/* 2. KPI Metrics Strip (Compact, Hairline Borders, Crisp) */}
      <section className="teacher-kpi-strip" aria-label={localText(locale, "شاخص‌های کلیدی", "Key Metrics")}>
        {/* Classes */}
        <Link href="/teacher/classes" className="teacher-kpi-card">
          <div className="teacher-kpi-card__top">
            <span className="teacher-kpi-card__label">{localText(locale, "کلاس‌های فعال", "Active Classes")}</span>
            <Icon name="classes" />
          </div>
          <div className="teacher-kpi-card__bottom">
            <strong className="teacher-kpi-card__val">
              {classesCount.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}
            </strong>
            <span className="teacher-kpi-card__tag teacher-kpi-card__tag--neutral">
              {localText(locale, "دوره و گروه", "Cohorts")}
            </span>
          </div>
        </Link>

        {/* Students */}
        <Link href="/teacher/students" className="teacher-kpi-card">
          <div className="teacher-kpi-card__top">
            <span className="teacher-kpi-card__label">{localText(locale, "زبان‌آموزان", "Learners")}</span>
            <Icon name="students" />
          </div>
          <div className="teacher-kpi-card__bottom">
            <strong className="teacher-kpi-card__val">
              {studentsCount.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}
            </strong>
            <span className="teacher-kpi-card__tag teacher-kpi-card__tag--neutral">
              {localText(locale, "شاگرد فعال", "Enrolled")}
            </span>
          </div>
        </Link>

        {/* Grading Queue (Highlighted if > 0) */}
        <Link
          href="/teacher/grading"
          className={`teacher-kpi-card ${gradingCount > 0 ? "teacher-kpi-card--urgent" : ""}`}
        >
          <div className="teacher-kpi-card__top">
            <span className="teacher-kpi-card__label">{localText(locale, "در صف تصحیح", "Pending Grading")}</span>
            <Icon name="grading" />
          </div>
          <div className="teacher-kpi-card__bottom">
            <strong className="teacher-kpi-card__val">
              {gradingCount.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}
            </strong>
            <span
              className={`teacher-kpi-card__tag ${
                gradingCount > 0 ? "teacher-kpi-card__tag--amber" : "teacher-kpi-card__tag--green"
              }`}
            >
              {gradingCount > 0
                ? localText(locale, "نیازمند بررسی ⚡", "Action Needed ⚡")
                : localText(locale, "بررسی شده ✨", "Up to Date ✨")}
            </span>
          </div>
        </Link>

        {/* Requests */}
        <Link href="/marketplace/requests" className="teacher-kpi-card">
          <div className="teacher-kpi-card__top">
            <span className="teacher-kpi-card__label">{localText(locale, "درخواست‌های جلسه", "Tutoring Requests")}</span>
            <Icon name="requests" />
          </div>
          <div className="teacher-kpi-card__bottom">
            <strong className="teacher-kpi-card__val">
              {requestsCount.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}
            </strong>
            <span className="teacher-kpi-card__tag teacher-kpi-card__tag--purple">
              {localText(locale, "جلسه رفع اشکال", "Requests")}
            </span>
          </div>
        </Link>

        {/* Earnings */}
        <Link href="/teacher/earnings" className="teacher-kpi-card">
          <div className="teacher-kpi-card__top">
            <span className="teacher-kpi-card__label">{localText(locale, "موجودی و درآمد", "Earnings & Balance")}</span>
            <Icon name="wallet" />
          </div>
          <div className="teacher-kpi-card__bottom">
            <strong className="teacher-kpi-card__val teacher-kpi-card__val--sm">
              {earningsFormatted}
            </strong>
            <span className="teacher-kpi-card__tag teacher-kpi-card__tag--green">
              {localText(locale, "تسویه ماهانه", "Wallet")}
            </span>
          </div>
        </Link>
      </section>

      {/* 3. Instant Action Strip (Today's Direct Task) */}
      <section className="teacher-action-strip" aria-label={localText(locale, "اقدام اولویت‌دار", "Priority Action")}>
        <div className="teacher-action-strip__content">
          <div className="teacher-action-strip__badge">
            <Icon name="sparkles" />
            <span>{localText(locale, "اولویت کاری امروز", "Today's Focus")}</span>
          </div>
          <div className="teacher-action-strip__text">
            <strong>{localText(locale, action.title_fa, action.title_en)}</strong>
            <p>{localText(locale, action.description_fa, action.description_en)}</p>
          </div>
        </div>

        <div className="teacher-action-strip__controls">
          <Link
            href={action.href}
            className="teacher-btn teacher-btn--primary teacher-btn--sm"
            onClick={() => void trackTeacherAction("primary_cta_click", action.id)}
          >
            <span>{actionLabel(locale, action.id)}</span>
            <span aria-hidden="true">{locale === "fa" ? "←" : "→"}</span>
          </Link>
        </div>
      </section>

      {/* Profile Completeness Linear Bar (Only if < 100%) */}
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

      {/* 4. Modular Bento Grid (Direct Pro Tools - No Hidden Tabs) */}
      <section className="teacher-bento-grid" aria-label={localText(locale, "ابزارهای تدریس", "Teaching Tools")}>
        {/* Bento 1: Classes & Live Teaching */}
        <Link href="/teacher/classes" className="teacher-bento-card teacher-bento-card--featured">
          <div className="teacher-bento-card__head">
            <div className="teacher-bento-card__icon-box teacher-bento-card__icon-box--blue">
              <Icon name="classes" />
            </div>
            <span className="teacher-bento-card__meta">
              {localText(locale, `${classesCount} کلاس فعال`, `${classesCount} Cohorts`)}
            </span>
          </div>
          <div className="teacher-bento-card__body">
            <h3>{localText(locale, "کلاس‌ها و جلسات تدریس", "Classes & Live Sessions")}</h3>
            <p>
              {localText(
                locale,
                "مدیریت تقویم کلاس‌ها، لیست زبان‌آموزان و لینک مستقیم به فضای کلاس آنلاین ادوبی کانکت.",
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

        {/* Bento 2: Grading Queue */}
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
            <h3>{localText(locale, "صف تصحیح و بازخورد رایتینگ", "Grading & Writing Studio")}</h3>
            <p>
              {localText(
                locale,
                "بررسی تکالیف ارسالی، نمره‌دهی تفکیکی مهارتی و ثبت فیدبک تحلیلی گرامر و واژگان.",
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

        {/* Bento 3: Online Exams Engine */}
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
            <h3>{localText(locale, "آزمون‌های آنلاین", "Online Exams")}</h3>
            <p>
              {localText(
                locale,
                "ساخت آزمون‌های زمان‌بندی‌شده تستی و تشریحی با تصحیح خودکار و گزارش تحلیلی نمرات.",
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

        {/* Bento 4: Question Bank */}
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

        {/* Bento 5: Gradebook & Analytics */}
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
                "ثبت نمرات کلاسی، رصد پیشرفت تحصیلی زبان‌آموزان و صدور کارنامه شکیل دوره‌ای.",
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

        {/* Bento 6: AI Lesson Planner */}
        <Link href="/teacher/planning" className="teacher-bento-card">
          <div className="teacher-bento-card__head">
            <div className="teacher-bento-card__icon-box teacher-bento-card__icon-box--gold">
              <Icon name="sparkles" />
            </div>
            <span className="teacher-bento-card__meta">
              {localText(locale, "دستیار AI", "AI Copilot")}
            </span>
          </div>
          <div className="teacher-bento-card__body">
            <h3>{localText(locale, "طرح درس و استودیوی محتوا", "Lesson Planning & AI Studio")}</h3>
            <p>
              {localText(
                locale,
                "تولید خودکار سناریوهای مکالمه، تمرین‌های واژگان و لکچرهای آموزشی در چند ثانیه با هوش مصنوعی.",
                "Generate communicative lesson plans, worksheets, and conversation prompts in seconds."
              )}
            </p>
          </div>
          <div className="teacher-bento-card__foot">
            <span className="teacher-bento-card__action">
              {localText(locale, "استودیوی تولید محتوا", "Open AI Studio")} {locale === "fa" ? "←" : "→"}
            </span>
          </div>
        </Link>

        {/* Bento 7: Marketplace Tutoring */}
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

        {/* Bento 8: Teaching Resources */}
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

      {/* Quick Create AI Modal */}
      <QuickCreateModal
        isOpen={quickCreateOpen}
        onClose={() => setQuickCreateOpen(false)}
        locale={locale}
      />
    </div>
  );
}

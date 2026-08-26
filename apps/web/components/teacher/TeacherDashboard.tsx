"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { trackTeacherAction, type TeacherCountSummary, type TeacherPrimaryActionId } from "../../lib/teacher-dashboard";
import { useTeacherHome } from "./TeacherShell";

type Locale = "fa" | "en";
type DashboardIconName = "classes" | "students" | "requests" | "grading" | "schedule" | "question" | "class" | "privacy" | "arrow";

const iconPaths: Record<DashboardIconName, ReactNode> = {
  classes: <><path d="M4 5h16v12H4z" /><path d="M8 21h8M12 17v4" /></>,
  students: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 21a6.5 6.5 0 0 1 13 0M17 6.5a3 3 0 0 1 0 5.5M18 15a5 5 0 0 1 3.5 5" /></>,
  requests: <><path d="M5 3h11l3 3v15H5z" /><path d="M15 3v4h4M8 11h7M8 15h4" /><circle cx="17.5" cy="17.5" r="3.5" /></>,
  grading: <><path d="m4 18 1-4L15.5 3.5a2.1 2.1 0 0 1 3 3L8 17z" /><path d="m13.5 5.5 3 3M4 21h16" /></>,
  schedule: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18" /></>,
  question: <><path d="M5 3h14v18H5z" /><path d="M9 8h6M9 12h4M9 16h6" /></>,
  class: <><path d="M4 4h16v12H4z" /><path d="M8 21h8M12 16v5M8 10h8" /></>,
  privacy: <><path d="M12 2 4.5 5v6.5c0 4.8 3.1 8.4 7.5 10.5 4.4-2.1 7.5-5.7 7.5-10.5V5z" /><path d="m9 12 2 2 4-4" /></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
};

function DashboardIcon({ name }: { name: DashboardIconName }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">{iconPaths[name]}</svg>;
}

function localText(locale: Locale, fa: string, en: string): string {
  return locale === "fa" ? fa : en;
}

function OverviewRow({ icon, titleFa, titleEn, summary }: { icon: DashboardIconName; titleFa: string; titleEn: string; summary: TeacherCountSummary }) {
  const { locale } = useTeacherHome();
  const hasCount = summary.available && summary.count !== null;
  return (
    <li className="teacher-overview-row">
      <span className="teacher-overview-row__icon"><DashboardIcon name={icon} /></span>
      <div><strong>{localText(locale, titleFa, titleEn)}</strong><p>{localText(locale, summary.note_fa, summary.note_en)}</p></div>
      <span className="teacher-overview-row__value" aria-label={hasCount ? String(summary.count) : undefined}>{hasCount ? summary.count : "—"}</span>
    </li>
  );
}

function actionLabel(locale: Locale, actionId: TeacherPrimaryActionId): string {
  const values: Record<TeacherPrimaryActionId, [string, string]> = {
    verify_profile: ["شروع تأیید", "Start verification"],
    teach_next_session: ["دیدن جلسه بعدی", "Open next session"],
    answer_request: ["بررسی درخواست", "Review request"],
    grade_work: ["بازکردن صف تصحیح", "Open grading queue"],
    complete_profile: ["تکمیل پروفایل", "Complete profile"],
    prepare_first_class: ["دیدن فضای کلاس", "Open class workspace"],
  };
  return localText(locale, ...values[actionId]);
}

export function TeacherDashboard() {
  const { data, locale, online } = useTeacherHome();
  const action = data.primary_action;
  const limitations = locale === "fa" ? data.limitations_fa : data.limitations_en;
  const isVerified = data.capabilities.teacher_verified;
  const journey = [
    {
      title: localText(locale, "تأیید مدرس", "Teacher verification"),
      description: isVerified ? localText(locale, "انجام شده", "Completed") : localText(locale, "قدم فعلی", "Current step"),
      state: isVerified ? "complete" : "current",
    },
    {
      title: localText(locale, "تکمیل پروفایل حرفه‌ای", "Complete your professional profile"),
      description: data.profile_completeness_percent === 100 ? localText(locale, "اطلاعات لازم کامل است", "Required details are complete") : localText(locale, "اطلاعات عمومی و معرفی حرفه‌ای", "Public details and teaching identity"),
      state: isVerified && data.profile_completeness_percent === 100 ? "complete" : isVerified ? "current" : "locked",
    },
    {
      title: localText(locale, "ساخت اولین کلاس", "Create your first class"),
      description: localText(locale, "پس از تأیید و فعال‌شدن دامنه کلاس", "After verification and the class domain are active"),
      state: "locked",
    },
  ];

  return (
    <div className="teacher-dashboard">
      {!online ? <div className="teacher-offline-banner" role="status">{localText(locale, "اتصال قطع است؛ این خلاصه آخرین اطلاعات بارگیری‌شده را نشان می‌دهد.", "You are offline; this summary shows the last loaded information.")}</div> : null}

      <header className="teacher-welcome">
        <p>{localText(locale, `سلام، ${data.greeting_name}`, `Hello, ${data.greeting_name}`)}</p>
        <h1>{localText(locale, "امروز مهم‌ترین کار من چیست؟", "What is my most important task today?")}</h1>
      </header>

      <section className="teacher-priority-card" aria-labelledby="teacher-priority-title">
        <div className="teacher-priority-card__art" aria-hidden="true">
          {isVerified ? <div className="teacher-priority-card__verified-mark"><DashboardIcon name="privacy" /></div> : <Image src="/images/teacher/teacher-verification.png" alt="" width={300} height={300} priority sizes="(max-width: 768px) 150px, 250px" />}
        </div>
        <div className="teacher-priority-card__copy">
          <span className={`teacher-status-label ${isVerified ? "is-verified" : "is-warning"}`}>
            {isVerified ? localText(locale, "تأیید مدرس فعال است", "Teacher verification is active") : localText(locale, "تأیید مدرس تکمیل نشده", "Teacher verification is incomplete")}
          </span>
          <span className="teacher-primary-label">{localText(locale, "اقدام اصلی امروز", "Today's primary action")}</span>
          <h2 id="teacher-priority-title">{localText(locale, action.title_fa, action.title_en)}</h2>
          <p>{localText(locale, action.description_fa, action.description_en)}</p>
          <Link className="teacher-button teacher-button--primary" href={action.href} onClick={() => void trackTeacherAction("primary_cta_click", action.id)}>
            {actionLabel(locale, action.id)}<span aria-hidden="true"><DashboardIcon name="arrow" /></span>
          </Link>
          <details className="teacher-why"><summary>{localText(locale, "چرا این اقدام؟", "Why this action?")}</summary><p>{localText(locale, action.reason_fa, action.reason_en)}</p></details>
          <div className="teacher-profile-progress">
            <div><span>{localText(locale, "تکمیل پروفایل", "Profile completion")}</span><strong>{data.profile_completeness_percent}%</strong></div>
            <progress max="100" value={data.profile_completeness_percent}>{data.profile_completeness_percent}%</progress>
          </div>
        </div>
      </section>

      <div className="teacher-workspace-grid">
        <section className="teacher-surface teacher-overview" aria-labelledby="teacher-overview-title">
          <header><h2 id="teacher-overview-title">{localText(locale, "نمای کلی فعالیت‌ها", "Activity overview")}</h2><p>{localText(locale, "فقط داده عملیاتی واقعی نمایش داده می‌شود.", "Only real operational data is shown.")}</p></header>
          <ul>
            <OverviewRow icon="classes" titleFa="کلاس‌ها" titleEn="Classes" summary={data.classes} />
            <OverviewRow icon="students" titleFa="زبان‌آموزان" titleEn="Students" summary={data.students} />
            <OverviewRow icon="requests" titleFa="درخواست‌های Learn Now" titleEn="Learn Now requests" summary={data.learn_now_requests} />
            <OverviewRow icon="grading" titleFa="منتظر تصحیح" titleEn="Pending grading" summary={data.pending_grading} />
            <li className="teacher-overview-row">
              <span className="teacher-overview-row__icon"><DashboardIcon name="schedule" /></span>
              <div><strong>{localText(locale, "برنامه امروز", "Today's schedule")}</strong><p>{localText(locale, data.schedule.note_fa, data.schedule.note_en)}</p></div><span className="teacher-overview-row__value">—</span>
            </li>
          </ul>
        </section>

        <section className="teacher-surface teacher-journey" aria-labelledby="teacher-journey-title">
          <header><h2 id="teacher-journey-title">{localText(locale, "مسیر شروع تدریس", "Your teaching start path")}</h2><p>{localText(locale, "هر قابلیت فقط زمانی باز می‌شود که مرحله و داده واقعی آن آماده باشد.", "Each capability opens only when its stage and real data are ready.")}</p></header>
          <ol>{journey.map((step, index) => <li key={step.title} data-state={step.state}><span>{step.state === "complete" ? "✓" : index + 1}</span><div><strong>{step.title}</strong><small>{step.description}</small></div></li>)}</ol>

          <div className="teacher-shortcuts">
            <h3>{localText(locale, "میانبرهای آماده‌سازی", "Preparation shortcuts")}</h3>
            <div>{data.quick_links.map((item) => {
              const title = localText(locale, item.title_fa, item.title_en);
              const description = localText(locale, item.description_fa, item.description_en);
              if (item.status === "locked") return <div className="teacher-shortcut is-locked" key={item.id} aria-disabled="true"><span><DashboardIcon name="class" /></span><div><strong>{title}</strong><p>{description}</p></div><small>{localText(locale, "قفل تا تأیید", "Locked")}</small></div>;
              return <Link className="teacher-shortcut" href={item.href} key={item.id} onClick={() => void trackTeacherAction("quick_link_click", item.id)}><span><DashboardIcon name="question" /></span><div><strong>{title}</strong><p>{description}</p></div><small>{localText(locale, "بازکردن", "Open")}</small></Link>;
            })}</div>
          </div>
        </section>
      </div>

      <aside className="teacher-account-rail">
        <div><span><DashboardIcon name="privacy" /></span><div><strong>{localText(locale, "حریم خصوصی شواهد زبان‌آموز", "Learner evidence stays private")}</strong><p>{localText(locale, data.privacy_notice_fa, data.privacy_notice_en)}</p></div></div>
        <Link href="/account">{localText(locale, "درآمد، صورتحساب و تنظیمات در حساب", "Earnings, billing, and settings live in Account")}</Link>
      </aside>

      <details className="teacher-limitations"><summary>{localText(locale, "این صفحه چگونه با داده‌ها کار می‌کند؟", "How does this page use data?")}</summary><ul>{limitations.map((item) => <li key={item}>{item}</li>)}</ul></details>
    </div>
  );
}

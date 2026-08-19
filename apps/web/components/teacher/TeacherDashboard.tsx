"use client";

import Link from "next/link";

import { trackTeacherAction } from "../../lib/teacher-dashboard";
import { useTeacherHome } from "./TeacherShell";


function localText(locale: "fa" | "en", fa: string, en: string): string {
  return locale === "fa" ? fa : en;
}

function CountCard({
  titleFa,
  titleEn,
  available,
  count,
  noteFa,
  noteEn,
}: {
  titleFa: string;
  titleEn: string;
  available: boolean;
  count: number | null;
  noteFa: string;
  noteEn: string;
}) {
  const { locale } = useTeacherHome();
  return (
    <article className="teacher-card">
      <h2>{localText(locale, titleFa, titleEn)}</h2>
      <p className="teacher-card__value" aria-label={available && count !== null ? String(count) : undefined}>
        {available && count !== null ? count : "—"}
      </p>
      <p className="teacher-muted">{localText(locale, noteFa, noteEn)}</p>
    </article>
  );
}

export function TeacherDashboard() {
  const { data, locale } = useTeacherHome();
  const action = data.primary_action;
  const limitations = locale === "fa" ? data.limitations_fa : data.limitations_en;
  const isVerified = data.capabilities.teacher_verified;

  return (
    <div className="teacher-dashboard">
      <section className="teacher-welcome" aria-labelledby="teacher-dashboard-title">
        <p className="teacher-eyebrow">{localText(locale, "فضای مدرس", "Teacher workspace")}</p>
        <h1 id="teacher-dashboard-title">
          {localText(locale, `سلام ${data.greeting_name}`, `Hello ${data.greeting_name}`)}
        </h1>
        <p className="teacher-muted">
          {localText(
            locale,
            "این صفحه فقط مهم‌ترین اقدام امروز و خلاصه‌های امن عملیاتی را نشان می‌دهد.",
            "This page shows one highest-priority action and privacy-safe operational summaries.",
          )}
        </p>
      </section>

      <section
        className={`teacher-verification-panel ${
          isVerified ? "teacher-verification-panel--verified" : "teacher-verification-panel--warning"
        }`}
        aria-labelledby="teacher-verification-title"
      >
        <div>
          <p className="teacher-pill">
            {isVerified
              ? localText(locale, "تأیید شده", "Verified")
              : localText(locale, "تأیید نشده", "Unverified")}
          </p>
          <h2 id="teacher-verification-title">
            {isVerified
              ? localText(locale, "وضعیت مدرس تأیید شده است", "Teacher verification is active")
              : localText(locale, "برای قابلیت‌های حساس، تأیید مدرس لازم است", "Teacher verification is required for sensitive capabilities")}
          </h2>
          <p>
            {localText(
              locale,
              `تکمیل پروفایل: ${data.profile_completeness_percent}٪`,
              `Profile completeness: ${data.profile_completeness_percent}%`,
            )}
          </p>
          <div className="teacher-capability-list" aria-label={localText(locale, "وضعیت قابلیت‌ها", "Capability status")}>
            <span>{localText(locale, "بازار مدرس", "Marketplace")}: {data.capabilities.marketplace_eligible ? "✓" : "—"}</span>
            <span>{localText(locale, "کلاس پولی", "Paid classes")}: {data.capabilities.paid_class_eligible ? "✓" : "—"}</span>
          </div>
        </div>
        {!isVerified && (
          <Link className="teacher-button teacher-button--secondary" href="/account/profile">
            {localText(locale, "رفتن به پروفایل", "Open profile")}
          </Link>
        )}
      </section>

      <section className="teacher-priority-card" aria-labelledby="teacher-priority-title">
        <div className="teacher-priority-card__copy">
          <p className="teacher-eyebrow">{localText(locale, "اقدام اصلی امروز", "Today's primary action")}</p>
          <h2 id="teacher-priority-title">
            {localText(locale, action.title_fa, action.title_en)}
          </h2>
          <p>{localText(locale, action.description_fa, action.description_en)}</p>
          <details className="teacher-why">
            <summary>{localText(locale, "چرا این اقدام؟", "Why this action?")}</summary>
            <p>{localText(locale, action.reason_fa, action.reason_en)}</p>
          </details>
        </div>
        <Link
          className="teacher-button teacher-button--primary"
          href={action.href}
          onClick={() => void trackTeacherAction("primary_cta_click", action.id)}
        >
          {localText(locale, "ادامه", "Continue")}
        </Link>
      </section>

      <section className="teacher-dashboard-grid" aria-label={localText(locale, "خلاصه تدریس", "Teaching summary")}>
        <CountCard
          titleFa="کلاس‌ها"
          titleEn="Classes"
          available={data.classes.available}
          count={data.classes.count}
          noteFa={data.classes.note_fa}
          noteEn={data.classes.note_en}
        />
        <CountCard
          titleFa="دانش‌آموزان"
          titleEn="Students"
          available={data.students.available}
          count={data.students.count}
          noteFa={data.students.note_fa}
          noteEn={data.students.note_en}
        />
        <CountCard
          titleFa="درخواست‌های Learn Now"
          titleEn="Learn Now requests"
          available={data.learn_now_requests.available}
          count={data.learn_now_requests.count}
          noteFa={data.learn_now_requests.note_fa}
          noteEn={data.learn_now_requests.note_en}
        />
        <CountCard
          titleFa="منتظر تصحیح"
          titleEn="Pending grading"
          available={data.pending_grading.available}
          count={data.pending_grading.count}
          noteFa={data.pending_grading.note_fa}
          noteEn={data.pending_grading.note_en}
        />

        <article className="teacher-card">
          <h2>{localText(locale, "برنامه امروز", "Today's schedule")}</h2>
          <p className="teacher-card__value">—</p>
          <p className="teacher-muted">{localText(locale, data.schedule.note_fa, data.schedule.note_en)}</p>
        </article>

        <article className="teacher-card">
          <h2>{localText(locale, "درآمد", "Earnings")}</h2>
          <p className="teacher-card__value">—</p>
          <p className="teacher-muted">{localText(locale, data.earnings.note_fa, data.earnings.note_en)}</p>
          <Link className="teacher-inline-link" href="/account">
            {localText(locale, "مدیریت مالی در حساب", "Finance lives in Account")}
          </Link>
        </article>
      </section>

      <section className="teacher-card teacher-card--wide teacher-getting-started" aria-labelledby="teacher-start-title">
        <div>
          <p className="teacher-eyebrow">{localText(locale, "شروع کار", "Getting started")}</p>
          <h2 id="teacher-start-title">{localText(locale, "سه قدم اولیه مدرس", "Three first teacher steps")}</h2>
        </div>
        <ol className="teacher-start-list">
          <li>
            <strong>{localText(locale, "۱. تأیید مدرس", "1. Teacher verification")}</strong>
            <span>{isVerified ? localText(locale, "انجام شده", "Completed") : localText(locale, "قدم فعلی", "Current step")}</span>
          </li>
          <li>
            <strong>{localText(locale, "۲. اولین کلاس", "2. First class")}</strong>
            <span>{localText(locale, "پوسته آماده است؛ مدیریت واقعی کلاس در مرحله اختصاصی فعال می‌شود.", "The shell is ready; real class management activates in its dedicated stage.")}</span>
          </li>
          <li>
            <strong>{localText(locale, "۳. اولین تکلیف", "3. First assignment")}</strong>
            <span>{localText(locale, "بعد از وجود کلاس واقعی، ساخت تکلیف در مرحله اختصاصی خود فعال می‌شود.", "After a real class exists, assignment creation activates in its dedicated stage.")}</span>
          </li>
        </ol>
      </section>

      <section className="teacher-card teacher-card--wide" aria-labelledby="teacher-shortcuts-title">
        <div className="teacher-section-heading">
          <div>
            <p className="teacher-eyebrow">{localText(locale, "میانبرهای محتوا", "Content shortcuts")}</p>
            <h2 id="teacher-shortcuts-title">{localText(locale, "ابزارهای آماده‌سازی", "Preparation tools")}</h2>
          </div>
          <p className="teacher-muted">
            {localText(locale, "این مسیرها فعلاً پایه امن هستند و قابلیت‌های کامل در روزهای اختصاصی فعال می‌شوند.", "These routes are safe foundations; full capabilities activate on their dedicated roadmap days.")}
          </p>
        </div>
        <div className="teacher-shortcut-grid">
          {data.quick_links.map((item) => {
            const title = localText(locale, item.title_fa, item.title_en);
            const description = localText(locale, item.description_fa, item.description_en);
            const statusLabel =
              item.status === "locked"
                ? localText(locale, "قفل تا تأیید", "Locked until verification")
                : localText(locale, "پایه آماده", "Foundation ready");

            if (item.status === "locked") {
              return (
                <div className="teacher-shortcut teacher-shortcut--locked" key={item.id} aria-disabled="true">
                  <strong>{title}</strong>
                  <span className="teacher-pill">{statusLabel}</span>
                  <p>{description}</p>
                </div>
              );
            }

            return (
              <Link
                className="teacher-shortcut"
                href={item.href}
                key={item.id}
                onClick={() => void trackTeacherAction("quick_link_click", item.id)}
              >
                <strong>{title}</strong>
                <span className="teacher-pill">{statusLabel}</span>
                <p>{description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="teacher-privacy-note" aria-labelledby="teacher-privacy-title">
        <h2 id="teacher-privacy-title">{localText(locale, "حریم خصوصی داشبورد", "Dashboard privacy")}</h2>
        <p>{localText(locale, data.privacy_notice_fa, data.privacy_notice_en)}</p>
      </section>

      <section className="teacher-card teacher-limitations" aria-labelledby="teacher-limitations-title">
        <h2 id="teacher-limitations-title">{localText(locale, "محدودیت‌های فعلی", "Current limitations")}</h2>
        <ul>
          {limitations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

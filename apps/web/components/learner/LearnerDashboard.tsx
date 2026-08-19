"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { trackPrimaryAction } from "../../lib/learner-dashboard";
import { useLearnerHome } from "./LearnerShell";


const text = {
  fa: {
    today: "امروز",
    welcome: "خوش آمدی",
    why: "چرا این پیشنهاد؟",
    path: "مسیر یادگیری",
    skills: "نمای مهارت‌ها",
    srs: "مرور واژگان",
    assignment: "تکلیف بعدی",
    class: "کلاس بعدی",
    course: "دوره فعال",
    xp: "تداوم و XP",
    notifications: "اعلان‌ها",
    noEvidence: "هنوز شواهد کافی برای نمایش سطح مهارت وجود ندارد.",
    unavailable: "بعد از ثبت داده واقعی، این بخش فعال می‌شود.",
    none: "در حال حاضر مورد فعالی وجود ندارد.",
    accuracy: "دقت داده‌های این صفحه",
  },
  en: {
    today: "Today",
    welcome: "Welcome",
    why: "Why this action?",
    path: "Learning path",
    skills: "Skill snapshot",
    srs: "Vocabulary review",
    assignment: "Next assignment",
    class: "Next class",
    course: "Active course",
    xp: "Streak & XP",
    notifications: "Notifications",
    noEvidence: "There is not enough evidence yet to show a skill estimate.",
    unavailable: "This activates after real evidence exists.",
    none: "There is no active item right now.",
    accuracy: "About the accuracy of this page",
  },
} as const;

function EmptyCard({ title, body }: { title: string; body: string }) {
  return (
    <section className="learner-card">
      <h2>{title}</h2>
      <p className="learner-muted">{body}</p>
    </section>
  );
}

export function LearnerDashboard() {
  const { data, locale } = useLearnerHome();
  const t = text[locale];
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  const action = data.primary_action;
  const actionTitle = locale === "fa" ? action.title_fa : action.title_en;
  const actionDescription = locale === "fa" ? action.description_fa : action.description_en;
  const actionReason = locale === "fa" ? action.reason_fa : action.reason_en;
  const limitations = locale === "fa" ? data.limitations_fa : data.limitations_en;

  return (
    <div className="learner-dashboard">
      {!online && (
        <div className="learner-offline-banner" role="status">
          {locale === "fa"
            ? "الان آفلاین هستی. اطلاعاتی که قبلاً بارگیری شده همچنان قابل مشاهده است."
            : "You are offline. Information already loaded remains visible."}
        </div>
      )}

      <section className="learner-welcome">
        <p className="learner-eyebrow">{t.today}</p>
        <h1>
          {t.welcome}، <bdi>{data.greeting_name}</bdi>
        </h1>
        <p className="learner-muted">
          {locale === "fa"
            ? "یک قدم روشن برای امروز؛ بدون شلوغی و بدون نمره‌سازی."
            : "One clear next step for today, without clutter or invented scores."}
        </p>
      </section>

      <section className="learner-today-card" aria-labelledby="today-action">
        <div className="learner-today-card__copy">
          <span className="learner-pill">{t.today}</span>
          <h2 id="today-action">{actionTitle}</h2>
          <p>{actionDescription}</p>
          <details className="learner-why">
            <summary>{t.why}</summary>
            <p>{actionReason}</p>
          </details>
        </div>
        <Link
          className="learner-button learner-button--primary"
          href={action.href}
          onClick={() => void trackPrimaryAction(action.id)}
        >
          {actionTitle}
        </Link>
      </section>

      <div className="learner-dashboard-grid">
        <section className="learner-card learner-card--wide">
          <h2>{t.path}</h2>
          <p>{locale === "fa" ? data.path_message_fa : data.path_message_en}</p>
          {data.path_progress_percent === null ? (
            <p className="learner-muted">
              {locale === "fa"
                ? "تا قبل از داده واقعی، درصد پیشرفت نمایش داده نمی‌شود."
                : "No progress percentage is shown before real evidence exists."}
            </p>
          ) : (
            <progress max={100} value={data.path_progress_percent}>
              {data.path_progress_percent}%
            </progress>
          )}
        </section>

        <section className="learner-card">
          <h2>{t.skills}</h2>
          <p className="learner-muted">{data.skills.length === 0 ? t.noEvidence : ""}</p>
        </section>

        <EmptyCard title={t.srs} body={data.srs_available ? String(data.srs_due_count) : t.unavailable} />
        <EmptyCard title={t.assignment} body={data.assignment ? "…" : t.none} />
        <EmptyCard title={t.class} body={data.next_class ? "…" : t.none} />
        <EmptyCard title={t.course} body={data.active_course ? "…" : t.none} />
        <EmptyCard
          title={t.xp}
          body={data.xp_available ? `${data.streak_days} / ${data.xp}` : t.unavailable}
        />
        <EmptyCard
          title={t.notifications}
          body={data.notifications_available ? String(data.notification_count) : t.unavailable}
        />
      </div>

      <section className="learner-card learner-limitations">
        <h2>{t.accuracy}</h2>
        <ul>
          {limitations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="learner-muted">
          {locale === "fa"
            ? "Library، Usage، Premium، Billing، Profile، Privacy و Settings داخل Account می‌مانند."
            : "Library, Usage, Premium, Billing, Profile, Privacy and Settings stay inside Account."}
        </p>
      </section>
    </div>
  );
}

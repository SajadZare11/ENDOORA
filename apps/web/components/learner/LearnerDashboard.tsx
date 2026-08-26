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
  | "notice";

const text = {
  fa: {
    greeting: "سلام",
    question: "امروز از کجا شروع کنم؟",
    intro: "یک قدم روشن برای امروز؛ بدون شلوغی و بدون نمره‌سازی.",
    why: "چرا این قدم؟",
    primaryAction: "اقدام اصلی امروز",
    path: "مسیر یادگیری",
    skills: "نمای مهارت‌ها",
    todayOverview: "نمای کلی امروز",
    todayOverviewDescription: "فقط مواردی که واقعاً برای حساب شما وجود دارند نمایش داده می‌شوند.",
    srs: "مرورهای امروز",
    assignment: "تکلیف بعدی",
    class: "کلاس بعدی",
    course: "دوره فعال",
    xp: "تداوم و XP",
    notifications: "اعلان‌ها",
    noEvidence: "بعد از ثبت شواهد واقعی، تصویر مهارت‌های شما اینجا شکل می‌گیرد.",
    unavailable: "هنوز داده واقعی برای این بخش ثبت نشده است.",
    none: "در حال حاضر مورد فعالی وجود ندارد.",
    due: "مرور موعدرسیده",
    evidence: "شواهد واقعی ثبت شده",
    accuracy: "این صفحه چگونه با داده‌های شما کار می‌کند؟",
    accountNote: "کتابخانه، مصرف، اشتراک، صورتحساب، پروفایل و حریم خصوصی داخل حساب می‌مانند.",
    onlineAgain: "اتصال دوباره برقرار شد.",
    offline: "الان آفلاین هستی. اطلاعاتی که قبلاً بارگیری شده همچنان قابل مشاهده است.",
    stepComplete: "تکمیل شده",
    stepCurrent: "قدم فعلی",
    stepLocked: "بعد از قدم قبلی",
    active: "فعال",
  },
  en: {
    greeting: "Hello",
    question: "Where should I start today?",
    intro: "One clear next step for today, without clutter or invented scores.",
    why: "Why this step?",
    primaryAction: "Today's primary action",
    path: "Learning path",
    skills: "Skill snapshot",
    todayOverview: "Today at a glance",
    todayOverviewDescription: "Only items that genuinely exist for your account are shown.",
    srs: "Reviews due today",
    assignment: "Next assignment",
    class: "Next class",
    course: "Active course",
    xp: "Streak & XP",
    notifications: "Notifications",
    noEvidence: "Your skill picture will form here after real learning evidence is recorded.",
    unavailable: "No real data has been recorded for this area yet.",
    none: "There is no active item right now.",
    due: "review(s) due",
    evidence: "Real evidence recorded",
    accuracy: "How does this page use your data?",
    accountNote: "Library, usage, subscription, billing, profile and privacy stay inside Account.",
    onlineAgain: "You are back online.",
    offline: "You are offline. Information already loaded remains visible.",
    stepComplete: "Complete",
    stepCurrent: "Current step",
    stepLocked: "After the previous step",
    active: "Active",
  },
} as const;

function DashboardIcon({ name }: { name: DashboardIconName }) {
  const paths: Record<DashboardIconName, ReactNode> = {
    path: <><circle cx="5" cy="18" r="2" /><circle cx="19" cy="6" r="2" /><path d="M7 18c4 0 3-6 7-6h1c2 0 2-4 2-4" /></>,
    skills: <><circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M19.1 4.9l-2.8 2.8M7.7 16.3l-2.8 2.8" /></>,
    review: <><path d="M4 6h12a4 4 0 0 1 4 4v8" /><path d="m16 14 4 4 4-4M4 6l3-3M4 6l3 3" /></>,
    assignment: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 3.5V2h6v1.5M9 9h6M9 14h6" /></>,
    class: <><path d="M4 19v-8h16v8M8 11V7h8v4" /><circle cx="12" cy="4" r="2" /><path d="M2 19h20" /></>,
    course: <><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v18H7.5A3.5 3.5 0 0 0 4 23.5ZM20 5.5A3.5 3.5 0 0 0 16.5 2H13v18h3.5a3.5 3.5 0 0 1 3.5 3.5Z" /></>,
    growth: <><path d="M4 19V9M10 19V5M16 19v-7M22 19H2" /><path d="m4 7 5-4 6 6 6-5" /></>,
    notice: <><path d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  };

  return (
    <svg className="learner-dashboard-icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function OverviewRow({
  icon,
  title,
  value,
  available,
}: {
  icon: DashboardIconName;
  title: string;
  value: string;
  available: boolean;
}) {
  return (
    <div className="learner-overview-row" data-available={available ? "true" : "false"}>
      <span className="learner-overview-row__icon"><DashboardIcon name={icon} /></span>
      <div>
        <strong>{title}</strong>
        <span>{value}</span>
      </div>
    </div>
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

  const srsValue = data.srs_available
    ? `${data.srs_due_count.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")} ${t.due}`
    : t.unavailable;
  const xpValue = data.xp_available
    ? `${data.streak_days.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")} / ${data.xp.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}`
    : t.unavailable;

  return (
    <div className="learner-dashboard">
      {!online ? (
        <div className="learner-offline-banner" role="status">{t.offline}</div>
      ) : null}

      <section className="learner-welcome" aria-labelledby="learner-dashboard-title">
        <p className="learner-greeting">{t.greeting}، <bdi>{data.greeting_name}</bdi></p>
        <h1 id="learner-dashboard-title">{t.question}</h1>
        <p>{t.intro}</p>
      </section>

      <section className="learner-today-card" aria-labelledby="today-action">
        <div className="learner-today-card__copy">
          <span className="learner-today-card__label">{t.primaryAction}</span>
          <h2 id="today-action">{displayTitle}</h2>
          <p>{displayDescription}</p>
          <Link
            className="learner-button learner-button--primary"
            href={action.href}
            onClick={() => void trackPrimaryAction(action.id)}
          >
            <span>{actionTitle}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
          </Link>
          <details className="learner-why">
            <summary>{t.why}</summary>
            <p>{actionReason}</p>
          </details>
        </div>
        {action.id === "start_placement" ? (
          <div className="learner-today-card__visual" aria-hidden="true">
            <Image
              src="/images/dashboard/placement-path.png"
              alt=""
              width={320}
              height={320}
              priority
              sizes="(max-width: 768px) 160px, 280px"
            />
          </div>
        ) : (
          <div className="learner-today-card__mission" aria-hidden="true">
            <span>E</span>
            <i />
            <i />
            <i />
          </div>
        )}
      </section>

      <div className="learner-core-grid">
        <section className="learner-card learner-path-card" aria-labelledby="learner-path-title">
          <header>
            <span><DashboardIcon name="path" /></span>
            <h2 id="learner-path-title">{t.path}</h2>
          </header>
          <p>{locale === "fa" ? data.path_message_fa : data.path_message_en}</p>
          <ol className="learner-path-steps">
            {data.path_steps.map((step, index) => {
              const stateLabel = step.state === "complete"
                ? t.stepComplete
                : step.state === "current" ? t.stepCurrent : t.stepLocked;
              return (
                <li key={step.id} data-state={step.state}>
                  <span aria-hidden="true">{step.state === "complete" ? "✓" : index + 1}</span>
                  <div>
                    <strong>{locale === "fa" ? step.label_fa : step.label_en}</strong>
                    <small>{stateLabel}</small>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="learner-card learner-skills-card" aria-labelledby="learner-skills-title">
          <header>
            <span><DashboardIcon name="skills" /></span>
            <h2 id="learner-skills-title">{t.skills}</h2>
          </header>
          {data.skills.length === 0 ? (
            <div className="learner-skills-empty">
              <div aria-hidden="true"><i /><i /><i /><i /><span /></div>
              <p>{t.noEvidence}</p>
            </div>
          ) : (
            <ul className="learner-skill-list">
              {data.skills.map((skill) => (
                <li key={skill.id}>
                  <strong>{locale === "fa" ? skill.label_fa : skill.label_en}</strong>
                  <span>{locale === "fa" ? skill.status_fa : skill.status_en}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="learner-overview" aria-labelledby="learner-overview-title">
        <header>
          <div>
            <h2 id="learner-overview-title">{t.todayOverview}</h2>
            <p>{t.todayOverviewDescription}</p>
          </div>
        </header>
        <div className="learner-overview-grid">
          <OverviewRow icon="review" title={t.srs} value={srsValue} available={data.srs_available} />
          <OverviewRow icon="assignment" title={t.assignment} value={data.assignment ? t.active : t.none} available={Boolean(data.assignment)} />
          <OverviewRow icon="class" title={t.class} value={data.next_class ? t.active : t.none} available={Boolean(data.next_class)} />
          <OverviewRow icon="course" title={t.course} value={data.active_course ? t.active : t.none} available={Boolean(data.active_course)} />
          <OverviewRow icon="growth" title={t.xp} value={xpValue} available={data.xp_available} />
          <OverviewRow icon="notice" title={t.notifications} value={data.notifications_available ? String(data.notification_count) : t.none} available={data.notifications_available} />
        </div>
      </section>

      <details className="learner-accuracy">
        <summary>{t.accuracy}</summary>
        <ul>
          {limitations.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <p>{t.accountNote}</p>
      </details>
    </div>
  );
}

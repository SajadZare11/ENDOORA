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
    whyAction: "چرا این پیشنهاد؟",
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
    quickServicesTitle: "مسیر رشد شخصی و یادگیری با مدرس",
    quickServicesDesc: "برنامه آموزشی اختصاصی و ثبت درخواست جلسات رفع اشکال با اساتید",
    quickServicesBadge: "۲ بخش کلیدی",
    quickServicesItems: [
      {
        title: "مسیر رشد شخصی (Learning Path)",
        desc: "برنامه آموزشی منطبق بر نتایج آزمون تعیین سطح شما و نقاط ضعف شناسایی‌شده در همزاد یادگیرنده.",
        href: "/path",
        icon: "🗺️",
        action: "مشاهده مسیر من",
        badge: "شخصی‌سازی‌شده",
      },
      {
        title: "یادگیری سریع با مدرس (Learn Now)",
        desc: "ثبت درخواست جلسه متمرکز رفع اشکال، اسپیکینگ یا رایتینگ و دریافت پیشنهاد از مدرسین تأییدشده.",
        href: "/learn/now",
        icon: "⚡",
        action: "شروع Learn Now",
        badge: "پاسخ سریع",
      },
    ],
    communitySupportTitle: "همراهی، دستاوردها و پشتیبانی",
    communitySupportDesc: "ارتباط با سایر زبان‌آموزان و اساتید، پیگیری دستاوردها و دریافت راهنمایی مستقیم",
    communitySupportBadge: "۴ بخش",
    communityItems: [
      {
        title: "جامعه یادگیری و هم‌افزایی",
        desc: "تبادل تجربیات واقعی با زبان‌آموزان و اساتید، طرح درس‌های معتبر، پرسش و پاسخ‌های زبانی در فضایی امن و منضبط.",
        href: "/community",
        icon: "👥",
        action: "ورود به جامعه ایندورا",
        badge: "هم‌آموزی",
      },
      {
        title: "افتخارات و نشان‌ها",
        desc: "مشاهده نشان‌های به‌دست‌آمده، مأموریت‌های ۷ روزه، کلوپ‌های هم‌آموزی و جدول رده‌بندی امن.",
        href: "/achievements",
        icon: "🏆",
        action: "مشاهده دستاوردها",
        badge: "انگیزش و رشد",
      },
      {
        title: "جستجوی یکپارچه منابع",
        desc: "جستجوی سریع در تمام دوره‌ها، منابع، اساتید، طرح درس‌ها و پرسش‌های متداول با نرمال‌سازی فارسی و انگلیسی.",
        href: "/search",
        icon: "🔍",
        action: "جستجو در پلتفرم",
        badge: "جستجوی سریع",
      },
      {
        title: "مرکز پشتیبانی و سوالات متداول",
        desc: "پاسخ سریع به پرسش‌ها، راهنمای امکانات، ثبت تیکت هوشمند و ارتباط مستقیم با کارشناسان ایندورا.",
        href: "/support",
        icon: "🎧",
        action: "ورود به پشتیبانی",
        badge: "پاسخگویی سریع",
      },
    ],
  },
  en: {
    greeting: "Hello",
    question: "Where should I start today?",
    intro: "One clear next step for today, without clutter or invented scores.",
    why: "Why this step?",
    whyAction: "Why this action?",
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
    quickServicesTitle: "Personal Growth & Rapid Mentoring",
    quickServicesDesc: "Personalized learning curriculum and on-demand live mentoring sessions with certified teachers",
    quickServicesBadge: "2 Core Services",
    quickServicesItems: [
      {
        title: "Personal Learning Path",
        desc: "Curriculum aligned with your placement results and weaknesses identified by Learner Twin.",
        href: "/path",
        icon: "🗺️",
        action: "View My Path",
        badge: "Personalized",
      },
      {
        title: "Learn Now with Mentors",
        desc: "Request focused problem-solving, speaking, or writing sessions and receive offers from certified teachers.",
        href: "/learn/now",
        icon: "⚡",
        action: "Start Learn Now",
        badge: "Fast Response",
      },
    ],
    communitySupportTitle: "Community, Progress & Support",
    communitySupportDesc: "Connect with learners and teachers, track achievements, and get direct assistance",
    communitySupportBadge: "4 sections",
    communityItems: [
      {
        title: "Learning Community & Synergy",
        desc: "Exchange real experiences, verified lesson plans, and language Q&A in a safe, constructive space.",
        href: "/community",
        icon: "👥",
        action: "Join Community",
        badge: "Peer Learning",
      },
      {
        title: "Achievements & Badges",
        desc: "View earned badges, 7-day missions, peer study clubs, and safe leaderboards.",
        href: "/achievements",
        icon: "🏆",
        action: "View Achievements",
        badge: "Growth & Motivation",
      },
      {
        title: "Unified Resource Search",
        desc: "Quick search across all courses, resources, instructors, lesson plans, and FAQs with bilingual normalization.",
        href: "/search",
        icon: "🔍",
        action: "Search Platform",
        badge: "Fast Search",
      },
      {
        title: "Support Center & FAQs",
        desc: "Get fast answers to common questions, platform guides, smart ticket submission, and direct support.",
        href: "/support",
        icon: "🎧",
        action: "Open Support",
        badge: "Fast Support",
      },
    ],
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
          {data.path_progress_percent === null ? null : (
            <div className="learner-path-progress-bar" aria-label="Progress">
              <span style={{ width: `${data.path_progress_percent}%` }} />
            </div>
          )}
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
          <div style={{ marginTop: "var(--space-3)" }}>
            <Link href="/path" className="learner-button learner-button--secondary" style={{ width: "100%", justifyContent: "center" }}>
              <span>{locale === "fa" ? "مشاهده جزئیات مسیر شخصی" : "View Personal Path Details"}</span>
            </Link>
          </div>
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

      <section className="learner-growth-services" aria-labelledby="learner-services-title">
        <header className="learner-community-support__header">
          <div className="learner-community-support__title-row">
            <span className="learner-community-support__icon-badge" aria-hidden="true">
              🚀
            </span>
            <div>
              <h2 id="learner-services-title" className="learner-community-support__title">
                {t.quickServicesTitle}
              </h2>
              <p className="learner-community-support__desc">{t.quickServicesDesc}</p>
            </div>
          </div>
          <span className="learner-community-support__count-badge">
            {t.quickServicesBadge}
          </span>
        </header>

        <div className="learner-growth-services__grid">
          {t.quickServicesItems.map((item, idx) => (
            <Link key={idx} href={item.href} className="learner-community-support__card">
              <div className="learner-community-support__card-top">
                <div className="learner-community-support__card-header">
                  <span className="learner-community-support__card-icon" aria-hidden="true">{item.icon}</span>
                  {item.badge && (
                    <span className="learner-community-support__card-badge">{item.badge}</span>
                  )}
                </div>
                <h3 className="learner-community-support__card-title">{item.title}</h3>
                <p className="learner-community-support__card-desc">{item.desc}</p>
              </div>
              <div className="learner-community-support__card-action">
                <span>{item.action}</span>
                <span aria-hidden="true" className="learner-community-support__arrow">
                  {locale === "fa" ? "←" : "→"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

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

      <section className="learner-community-support" aria-labelledby="learner-community-title">
        <header className="learner-community-support__header">
          <div className="learner-community-support__title-row">
            <span className="learner-community-support__icon-badge" aria-hidden="true">
              👥
            </span>
            <div>
              <h2 id="learner-community-title" className="learner-community-support__title">
                {t.communitySupportTitle}
              </h2>
              <p className="learner-community-support__desc">{t.communitySupportDesc}</p>
            </div>
          </div>
          <span className="learner-community-support__count-badge">
            {t.communitySupportBadge}
          </span>
        </header>

        <div className="learner-community-support__grid">
          {t.communityItems.map((item, idx) => (
            <Link key={idx} href={item.href} className="learner-community-support__card">
              <div className="learner-community-support__card-top">
                <div className="learner-community-support__card-header">
                  <span className="learner-community-support__card-icon" aria-hidden="true">{item.icon}</span>
                  {item.badge && (
                    <span className="learner-community-support__card-badge">{item.badge}</span>
                  )}
                </div>
                <h3 className="learner-community-support__card-title">{item.title}</h3>
                <p className="learner-community-support__card-desc">{item.desc}</p>
              </div>
              <div className="learner-community-support__card-action">
                <span>{item.action}</span>
                <span aria-hidden="true" className="learner-community-support__arrow">
                  {locale === "fa" ? "←" : "→"}
                </span>
              </div>
            </Link>
          ))}
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

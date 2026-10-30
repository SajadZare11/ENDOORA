"use client";

import { EndooraWordmark, Button } from "@endoora/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { endooraApi, persistPreferredLocale } from "../../lib/endoora-api";
import {
  fetchTeacherHome,
  TeacherDashboardApiError,
  type TeacherHome,
  type TeacherLocale,
} from "../../lib/teacher-dashboard";

import { fetchTeacherClasses, fetchTeacherUsageSummary, type ActiveClassInfo } from "../../lib/teacheros-api";
import type { TeacherUsageSummary } from "@endoora/contracts";

export type TeacherContextValue = {
  data: TeacherHome;
  locale: TeacherLocale;
  online: boolean;
  activeClass: ActiveClassInfo | null;
  setActiveClass: (cls: ActiveClassInfo | null) => void;
  classesList: ActiveClassInfo[];
};

type TeacherIconName =
  | "home"
  | "classes"
  | "grading"
  | "onlineExams"
  | "question"
  | "gradebook"
  | "planning"
  | "resources"
  | "marketplace"
  | "account"
  | "logout";

const TeacherContext = createContext<TeacherContextValue | null>(null);

export function useTeacherHome(): TeacherContextValue {
  const value = useContext(TeacherContext);
  if (!value) throw new Error("useTeacherHome must be used inside TeacherShell.");
  return value;
}

export function useTeacherClassContext() {
  const { activeClass, setActiveClass, classesList } = useTeacherHome();
  return { activeClass, setActiveClass, classesList };
}

const labels = {
  fa: {
    sectionWorkspace: "فضای اصلی",
    sectionStudio: "استودیو و سنجش",
    sectionGrowth: "خدمات و مدیریت",
    home: "میزکار مدرس",
    classes: "کلاس‌های من",
    grading: "صف تصحیح و بازخورد",
    onlineExams: "آزمون‌های آنلاین",
    questionBank: "بانک سؤالات",
    gradebook: "دفتر نمرات و کارنامه",
    planning: "طرح درس و محتوا (AI)",
    resources: "کتابخانه منابع",
    marketplace: "بازارچه تدریس",
    account: "تنظیمات و حساب",
    logout: "خروج از حساب",
    loggingOut: "در حال خروج…",
    noActiveClass: "کلاسی انتخاب نشده",
    activeClassLabel: "کلاس فعال:",
    selectClass: "انتخاب کلاس...",
    dailyQuota: "اعتبار امروز: ۲۵ / ۳۰",
    quotaTooltip: "اعتبار روزانه تولید با هوش مصنوعی: ۲۵ از ۳۰ باقی‌مانده",
    switch: "English",
    workspace: "TeacherOS · پنل مدرس",
    verified: "مدرس تأییدشده ✓",
    unverified: "احراز هویت در انتظار تکمیل",
    localeError: "تنظیمات زبان ذخیره نشد. دوباره تلاش کنید.",
    offline: "اتصال قطع است؛ اطلاعات بارگیری‌شده قبلی در دسترس است.",
    navigation: "ناوبری مدرس",
    bottomNavigation: "ناوبری پایین مدرس",
    skip: "پرش به محتوای اصلی",
  },
  en: {
    sectionWorkspace: "Workspace",
    sectionStudio: "Studio & Assessment",
    sectionGrowth: "Management & Growth",
    home: "Dashboard",
    classes: "My Classes",
    grading: "Grading Queue",
    onlineExams: "Online Exams",
    questionBank: "Question Bank",
    gradebook: "Gradebook",
    planning: "Lesson Planner (AI)",
    resources: "Resources Library",
    marketplace: "Tutoring Requests",
    account: "Account Settings",
    logout: "Log out",
    loggingOut: "Logging out…",
    noActiveClass: "No Class Selected",
    activeClassLabel: "Active Class:",
    selectClass: "Select class...",
    dailyQuota: "Daily Quota: 25 / 30",
    quotaTooltip: "Daily AI generation allowance: 25 of 30 remaining",
    switch: "فارسی",
    workspace: "TeacherOS · Educator Hub",
    verified: "Verified Teacher ✓",
    unverified: "Verification Pending",
    localeError: "Your language preference could not be saved. Try again.",
    offline: "You are offline; already-loaded information remains available.",
    navigation: "Teacher navigation",
    bottomNavigation: "Teacher bottom navigation",
    skip: "Skip to main content",
  },
} as const;

const iconPaths: Record<TeacherIconName, ReactNode> = {
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5.5 9.5V21h13V9.5M9 21v-7h6v7" />
    </>
  ),
  classes: (
    <>
      <path d="M4 4h16v12H4z" />
      <path d="M8 21h8M12 16v5M8.5 10.5l2 2 5-5" />
    </>
  ),
  grading: (
    <>
      <path d="m4 18 1-4L15.5 3.5a2.1 2.1 0 0 1 3 3L8 17z" />
      <path d="m13.5 5.5 3 3M4 21h16" />
    </>
  ),
  onlineExams: (
    <>
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="2" />
      <path d="m9 14 2 2 4-4" />
    </>
  ),
  question: (
    <>
      <path d="M5 3h14v18H5z" />
      <path d="M9 8h6M9 12h4M9 16h6" />
    </>
  ),
  gradebook: (
    <>
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </>
  ),
  planning: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="m9 9 2 2 4-4" />
    </>
  ),
  resources: (
    <>
      <path d="M5 4.5A3.5 3.5 0 0 1 8.5 1H12v19H8.5A3.5 3.5 0 0 0 5 23z" />
      <path d="M19 4.5A3.5 3.5 0 0 0 15.5 1H12v19h3.5A3.5 3.5 0 0 1 19 23z" />
    </>
  ),
  marketplace: (
    <>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </>
  ),
  account: (
    <>
      <circle cx="12" cy="7" r="4" />
      <path d="M4 22a8 8 0 0 1 16 0" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </>
  ),
};

function TeacherIcon({ name }: { name: TeacherIconName }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {iconPaths[name]}
    </svg>
  );
}

function Gate({
  kind,
  locale,
  onLocaleChange,
  retry,
}: {
  kind: "loading" | "login" | "denied" | "offline" | "error";
  locale: TeacherLocale;
  onLocaleChange: () => void;
  retry: () => void;
}) {
  const content = {
    fa: {
      loading: ["در حال آماده‌سازی میزکار مدرس…", "بارگیری اطلاعات و اولویت‌های آموزشی روز"],
      login: ["ورود به حساب مدرسی", "فضای تدریس اختصاصی مدرسان پس از ورود فعال است."],
      denied: ["دسترسی اختصاصی حساب مدرس", "نقش کاربری فعلی اجازه دسترسی به پنل مدرس را ندارد."],
      offline: ["ارتباط با اینترنت برقرار نیست", "پس از اتصال دوباره دکمه تلاش مجدد را بزنید."],
      error: ["بارگیری پنل مدرس با خطا مواجه شد", "اتصال به اینترنت را بررسی و مجدداً امتحان کنید."],
      loginAction: "ورود به حساب",
      back: "بازگشت به صفحه اصلی",
      retry: "تلاش دوباره",
      switch: "English",
    },
    en: {
      loading: ["Preparing Educator Workspace…", "Loading today's classes and teaching priorities."],
      login: ["Sign in to continue", "Teacher workspace is available for registered educators."],
      denied: ["Teacher Account Required", "Your current role cannot access the teacher workspace."],
      offline: ["You are offline", "Please check your network connection and retry."],
      error: ["Workspace could not load", "Check network connection and try again."],
      loginAction: "Sign in",
      back: "Back to home",
      retry: "Try again",
      switch: "فارسی",
    },
  }[locale];

  return (
    <main className="teacher-gate" dir={locale === "fa" ? "rtl" : "ltr"} lang={locale} aria-busy={kind === "loading"}>
      <section className="teacher-gate__card" aria-live="polite">
        <div className="teacher-gate__top">
          <Link href="/" aria-label="Endoora" style={{ display: "inline-flex", textDecoration: "none" }}>
            <EndooraWordmark compact />
          </Link>
          <Button type="button" className="teacher-language" onClick={onLocaleChange}>
            {content.switch}
          </Button>
        </div>
        <div className="teacher-gate__mark" aria-hidden="true">
          <TeacherIcon name="classes" />
        </div>
        <h1>{content[kind][0]}</h1>
        <p>{content[kind][1]}</p>
        {kind === "login" ? (
          <Link className="teacher-button teacher-button--primary" href="/auth/login">
            {content.loginAction}
          </Link>
        ) : null}
        {kind === "denied" ? (
          <Link className="teacher-button teacher-button--secondary" href="/">
            {content.back}
          </Link>
        ) : null}
        {kind === "offline" || kind === "error" ? (
          <Button className="teacher-button teacher-button--primary" type="button" onClick={retry}>
            {content.retry}
          </Button>
        ) : null}
      </section>
    </main>
  );
}

function NavItem({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: TeacherIconName;
  active: boolean;
}) {
  return (
    <Link
      className="teacher-nav__item"
      data-active={active ? "true" : "false"}
      href={href}
      aria-current={active ? "page" : undefined}
    >
      <TeacherIcon name={icon} />
      <span>{label}</span>
    </Link>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/teacher") return pathname === "/teacher";
  if (href === "/teacher/account") return pathname.startsWith("/teacher/account") || pathname.startsWith("/account");
  return pathname.startsWith(href);
}

export function TeacherShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [data, setData] = useState<TeacherHome | null>(null);
  const [locale, setLocale] = useState<TeacherLocale>("fa");
  const [status, setStatus] = useState<"loading" | "ready" | "login" | "denied" | "offline" | "error">("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [online, setOnline] = useState(true);
  const [savingLocale, setSavingLocale] = useState(false);
  const [localeError, setLocaleError] = useState(false);

  // Active Class State with localStorage persistence
  const [classesList, setClassesList] = useState<ActiveClassInfo[]>([]);
  const [activeClass, setActiveClassState] = useState<ActiveClassInfo | null>(null);
  const [usage, setUsage] = useState<TeacherUsageSummary | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await endooraApi<null>("/auth/logout/", {
        method: "POST",
        json: {},
      });
    } catch {
      // Proceed with redirect regardless of network status
    } finally {
      window.location.href = "/auth/login";
    }
  }

  const setActiveClass = (cls: ActiveClassInfo | null) => {
    setActiveClassState(cls);
    try {
      if (cls?.id) {
        window.localStorage.setItem("endoora_active_class_id", cls.id);
      } else {
        window.localStorage.removeItem("endoora_active_class_id");
      }
    } catch {
      // In case localStorage is disabled or restricted
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = locale === "fa" ? "rtl" : "ltr";
  }, [locale]);

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;
    async function load() {
      const browserOnline = navigator.onLine;
      setOnline(browserOnline);
      if (!browserOnline) {
        setStatus("offline");
        return;
      }
      setStatus("loading");
      try {
        const result = await fetchTeacherHome(controller.signal);
        if (!mounted) return;
        setData(result);
        setLocale(result.preferred_locale ?? "fa");
        setStatus("ready");

        // Load classes for active switcher and restore from localStorage
        const classes = await fetchTeacherClasses();
        if (mounted) {
          setClassesList(classes);
          if (classes.length > 0) {
            let initialClass: ActiveClassInfo | null = null;
            try {
              const savedId = window.localStorage.getItem("endoora_active_class_id");
              if (savedId) {
                initialClass = classes.find((c) => c.id === savedId) ?? null;
              }
            } catch {
              // ignore storage error
            }
            setActiveClassState(initialClass ?? classes[0]);
          }
        }

        // Load live teacher usage and quota
        fetchTeacherUsageSummary()
          .then((u) => {
            if (mounted) setUsage(u);
          })
          .catch(() => {});
      } catch (error) {
        if (!mounted || controller.signal.aborted) return;
        if (error instanceof TeacherDashboardApiError && error.status === 401) {
          setStatus("login");
          return;
        }
        if (error instanceof TeacherDashboardApiError && error.status === 403) {
          setStatus("denied");
          return;
        }
        setStatus(!navigator.onLine ? "offline" : "error");
      }
    }
    void load();
    const handleOnline = () => {
      setOnline(true);
      setReloadKey((value) => value + 1);
    };
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      mounted = false;
      controller.abort();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [reloadKey]);

  async function changeLocale() {
    if (savingLocale) return;
    const previous = locale;
    const next = previous === "fa" ? "en" : "fa";
    setLocale(next);
    setLocaleError(false);
    setSavingLocale(true);
    try {
      await persistPreferredLocale(next);
      setData((current) => (current ? { ...current, preferred_locale: next } : current));
    } catch {
      setLocale(previous);
      setLocaleError(true);
    } finally {
      setSavingLocale(false);
    }
  }

  if (status !== "ready" || !data) {
    const gateKind =
      status === "loading" || status === "login" || status === "denied" || status === "offline"
        ? status
        : "error";
    return (
      <div className="teacher-shell" dir={locale === "fa" ? "rtl" : "ltr"} lang={locale}>
        <Gate
          kind={gateKind}
          locale={locale}
          onLocaleChange={() => void changeLocale()}
          retry={() => setReloadKey((value) => value + 1)}
        />
      </div>
    );
  }

  const t = labels[locale];

  const navGroups = [
    {
      title: t.sectionWorkspace,
      items: [
        { href: "/teacher", label: t.home, icon: "home" as const },
        { href: "/teacher/classes", label: t.classes, icon: "classes" as const },
        { href: "/teacher/grading", label: t.grading, icon: "grading" as const },
      ],
    },
    {
      title: t.sectionStudio,
      items: [
        { href: "/teacher/online-exams", label: t.onlineExams, icon: "onlineExams" as const },
        { href: "/teacher/question-bank", label: t.questionBank, icon: "question" as const },
        { href: "/teacher/gradebook", label: t.gradebook, icon: "gradebook" as const },
        { href: "/teacher/planning", label: t.planning, icon: "planning" as const },
      ],
    },
    {
      title: t.sectionGrowth,
      items: [
        { href: "/teacher/resources", label: t.resources, icon: "resources" as const },
        { href: "/marketplace/requests", label: t.marketplace, icon: "marketplace" as const },
        { href: "/teacher/account", label: t.account, icon: "account" as const },
      ],
    },
  ];

  const bottomNav = [
    { href: "/teacher", label: t.home, icon: "home" as const },
    { href: "/teacher/classes", label: t.classes, icon: "classes" as const },
    { href: "/teacher/grading", label: t.grading, icon: "grading" as const },
    { href: "/teacher/online-exams", label: t.onlineExams, icon: "onlineExams" as const },
    { href: "/teacher/account", label: t.account, icon: "account" as const },
  ];

  const verified = data.capabilities.teacher_verified;

  return (
    <TeacherContext.Provider value={{ data, locale, online, activeClass, setActiveClass, classesList }}>
      <div className="teacher-shell" dir={locale === "fa" ? "rtl" : "ltr"} lang={locale}>
        <a className="teacher-skip-link" href="#teacher-main">
          {t.skip}
        </a>

        {/* 1. Sleek Minimalist Sidebar (Linear/Notion-Style) */}
        <aside className="teacher-sidebar">
          <div className="teacher-sidebar__brand">
            <Link
              className="teacher-brand-link"
              href="/"
              aria-label="Endoora"
              title={locale === "fa" ? "بازگشت به صفحه اول سایت" : "Back to Website Home"}
            >
              <EndooraWordmark compact />
              <span className="teacher-brand-badge">Teacher</span>
            </Link>
          </div>

          <nav className="teacher-nav" aria-label={t.navigation}>
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="teacher-nav__group">
                <span className="teacher-nav__group-title">{group.title}</span>
                <div className="teacher-nav__group-items">
                  {group.items.map((item) => (
                    <NavItem key={item.href} {...item} active={isActive(pathname, item.href)} />
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="teacher-sidebar__footer">
            <div className={`teacher-sidebar__status ${verified ? "is-verified" : "is-warning"}`}>
              <span className="teacher-status-dot" aria-hidden="true" />
              <p>{verified ? t.verified : t.unverified}</p>
            </div>
            <button
              type="button"
              className="teacher-nav__item teacher-nav__item--logout"
              onClick={() => void handleLogout()}
              disabled={loggingOut}
              aria-label={t.logout}
            >
              <TeacherIcon name="logout" />
              <span>{loggingOut ? t.loggingOut : t.logout}</span>
            </button>
          </div>
        </aside>

        {/* 2. Top Minimal App Header */}
        <header className="teacher-header">
          <div className="teacher-header__start">
            <Link
              className="teacher-mobile-brand"
              href="/"
              aria-label="Endoora"
              title={locale === "fa" ? "بازگشت به صفحه اول سایت" : "Back to Website Home"}
            >
              <EndooraWordmark compact />
            </Link>
            <div className="teacher-header__title">
              <strong>{t.workspace}</strong>
            </div>

            {classesList.length > 0 ? (
              <div className="teacher-class-selector-wrap">
                <span className="teacher-header-divider" aria-hidden="true">/</span>
                <span className="teacher-class-label">{t.activeClassLabel}</span>
                <select
                  value={activeClass?.id ?? ""}
                  onChange={(e) => {
                    const found = classesList.find((c) => c.id === e.target.value);
                    if (found) setActiveClass(found);
                  }}
                  className="teacher-class-select"
                  aria-label={t.activeClassLabel}
                >
                  {classesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.level})
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>

          {/* Quota Pill & Locale Switch */}
          <div className="teacher-header__controls">
            <span
              className="teacher-quota-badge"
              title={
                usage
                  ? locale === "fa"
                    ? `اعتبار هوش مصنوعی امروز: ${usage.remaining_today} از ${usage.daily_limit} باقیمانده`
                    : `Daily AI generation allowance: ${usage.remaining_today} of ${usage.daily_limit} remaining`
                  : t.quotaTooltip
              }
            >
              <span className="teacher-quota-badge__dot" aria-hidden="true" />
              <span>
                {usage
                  ? locale === "fa"
                    ? `اعتبار هوش مصنوعی: ${usage.remaining_today} / ${usage.daily_limit}`
                    : `AI Quota: ${usage.remaining_today} / ${usage.daily_limit}`
                  : t.dailyQuota}
              </span>
            </span>

            <Button
              className="teacher-language"
              type="button"
              onClick={() => void changeLocale()}
              disabled={savingLocale}
              aria-busy={savingLocale}
            >
              {t.switch}
            </Button>
          </div>
        </header>

        {localeError ? (
          <div className="teacher-shell-message teacher-shell-message--error" role="alert">
            {t.localeError}
          </div>
        ) : null}
        {!online ? (
          <div className="teacher-shell-message" role="status">
            {t.offline}
          </div>
        ) : null}

        {/* 3. Main Content Container */}
        <main className="teacher-main" id="teacher-main">
          {children}
        </main>

        {/* 4. Mobile Bottom Navigation */}
        <nav className="teacher-bottom-nav" aria-label={t.bottomNavigation}>
          {bottomNav.map((item) => (
            <NavItem key={item.href} {...item} active={isActive(pathname, item.href)} />
          ))}
        </nav>
      </div>
    </TeacherContext.Provider>
  );
}

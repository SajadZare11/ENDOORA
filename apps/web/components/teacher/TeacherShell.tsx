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

type TeacherIconName = "home" | "classes" | "planning" | "assessment" | "tools" | "resources" | "account" | "marketplace" | "logout";

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
    home: "خانه",
    classes: "کلاس‌های من",
    teach: "تدریس",
    marketplace: "بازارچه درخواست‌ها",
    planning: "طرح درس و تولید",
    assessment: "تحلیل و بازخورد",
    tools: "ابزارهای پیشرفته",
    resources: "کتابخانه منابع",
    account: "حساب",
    logout: "خروج",
    loggingOut: "در حال خروج…",
    noActiveClass: "کلاسی انتخاب نشده",
    activeClassLabel: "کلاس فعال:",
    selectClass: "انتخاب کلاس...",
    dailyQuota: "اعتبار امروز: ۲۵ / ۳۰",
    quotaTooltip: "اعتبار روزانه تولید با هوش مصنوعی: ۲۵ از ۳۰ باقی‌مانده",
    switch: "English",
    workspace: "TeacherOS · دستیار تدریس",
    verified: "مدرس تأییدشده",
    unverified: "تأیید مدرس تکمیل نشده",
    localeError: "زبان حساب ذخیره نشد. دوباره تلاش کن.",
    offline: "اتصال قطع است؛ اطلاعات بارگیری‌شده همچنان در دسترس است.",
    navigation: "ناوبری مدرس",
    bottomNavigation: "ناوبری پایین مدرس",
    skip: "پرش به محتوای اصلی",
  },
  en: {
    home: "Home",
    classes: "My Classes",
    teach: "Teach",
    marketplace: "Marketplace",
    planning: "Planning & Prep",
    assessment: "Assessment & Evidence",
    tools: "Supertools",
    resources: "Resources",
    account: "Account",
    logout: "Log out",
    loggingOut: "Logging out…",
    noActiveClass: "No Class Selected",
    activeClassLabel: "Active Class:",
    selectClass: "Select class...",
    dailyQuota: "Daily Quota: 25 / 30",
    quotaTooltip: "Daily AI generation allowance: 25 of 30 remaining",
    switch: "فارسی",
    workspace: "TeacherOS · Teaching Copilot",
    verified: "Verified teacher",
    unverified: "Teacher verification incomplete",
    localeError: "Your language preference could not be saved. Try again.",
    offline: "You are offline; already-loaded information remains available.",
    navigation: "Teacher navigation",
    bottomNavigation: "Teacher bottom navigation",
    skip: "Skip to main content",
  },
} as const;

const iconPaths: Record<TeacherIconName, ReactNode> = {
  home: <><path d="m3 11 9-8 9 8" /><path d="M5.5 9.5V21h13V9.5M9 21v-7h6v7" /></>,
  classes: <><path d="M4 4h16v12H4z" /><path d="M8 21h8M12 16v5M8.5 10.5l2 2 5-5" /></>,
  planning: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /><path d="m9 9 2 2 4-4" /></>,
  assessment: <><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>,
  tools: <><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></>,
  resources: <><path d="M5 4.5A3.5 3.5 0 0 1 8.5 1H12v19H8.5A3.5 3.5 0 0 0 5 23z" /><path d="M19 4.5A3.5 3.5 0 0 0 15.5 1H12v19h3.5A3.5 3.5 0 0 1 19 23z" /></>,
  account: <><circle cx="12" cy="7" r="4" /><path d="M4 22a8 8 0 0 1 16 0" /></>,
  marketplace: <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
};

function TeacherIcon({ name }: { name: TeacherIconName }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">{iconPaths[name]}</svg>;
}

function Gate({ kind, locale, onLocaleChange, retry }: {
  kind: "loading" | "login" | "denied" | "offline" | "error";
  locale: TeacherLocale;
  onLocaleChange: () => void;
  retry: () => void;
}) {
  const content = {
    fa: {
      loading: ["در حال آماده‌کردن فضای مدرس…", "خلاصه امن و اولویت امروز در حال بارگیری است."],
      login: ["برای ادامه وارد حساب شو", "فضای مدرس فقط بعد از ورود امن نمایش داده می‌شود."],
      denied: ["این بخش برای حساب مدرس است", "نقش فعلی اجازه دسترسی به فضای مدرس را ندارد."],
      offline: ["اتصال اینترنت در دسترس نیست", "بعد از بازگشت اتصال دوباره تلاش کن."],
      error: ["فضای مدرس بارگیری نشد", "اتصال یا سرویس API را بررسی کن و دوباره تلاش کن."],
      loginAction: "ورود امن", back: "بازگشت به صفحه اصلی", retry: "تلاش دوباره", switch: "English",
    },
    en: {
      loading: ["Preparing your teacher workspace…", "Your safe summary and next priority are loading."],
      login: ["Sign in to continue", "The teacher workspace is available only after secure sign-in."],
      denied: ["This area is for teacher accounts", "Your current role cannot access the teacher workspace."],
      offline: ["You are offline", "Try again when your connection returns."],
      error: ["The teacher workspace did not load", "Check the API connection and try again."],
      loginAction: "Secure sign in", back: "Back to home", retry: "Try again", switch: "فارسی",
    },
  }[locale];

  return (
    <main className="teacher-gate" dir={locale === "fa" ? "rtl" : "ltr"} lang={locale} aria-busy={kind === "loading"}>
      <section className="teacher-gate__card" aria-live="polite">
        <div className="teacher-gate__top"><EndooraWordmark compact /><Button type="button" className="teacher-language" onClick={onLocaleChange}>{content.switch}</Button></div>
        <div className="teacher-gate__mark" aria-hidden="true"><TeacherIcon name="classes" /></div>
        <h1>{content[kind][0]}</h1><p>{content[kind][1]}</p>
        {kind === "login" ? <Link className="teacher-button teacher-button--primary" href="/auth/login">{content.loginAction}</Link> : null}
        {kind === "denied" ? <Link className="teacher-button teacher-button--secondary" href="/">{content.back}</Link> : null}
        {kind === "offline" || kind === "error" ? <Button className="teacher-button teacher-button--primary" type="button" onClick={retry}>{content.retry}</Button> : null}
      </section>
    </main>
  );
}

function NavItem({ href, label, icon, active }: { href: string; label: string; icon: TeacherIconName; active: boolean }) {
  return <Link className="teacher-nav__item" data-active={active ? "true" : "false"} href={href} aria-current={active ? "page" : undefined}><TeacherIcon name={icon} /><span>{label}</span></Link>;
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
      if (!browserOnline) { setStatus("offline"); return; }
      setStatus("loading");
      try {
        const result = await fetchTeacherHome(controller.signal);
        if (!mounted) return;
        setData(result); setLocale(result.preferred_locale ?? "fa"); setStatus("ready");

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
          .then((u) => { if (mounted) setUsage(u); })
          .catch(() => {});
      } catch (error) {
        if (!mounted || controller.signal.aborted) return;
        if (error instanceof TeacherDashboardApiError && error.status === 401) { setStatus("login"); return; }
        if (error instanceof TeacherDashboardApiError && error.status === 403) { setStatus("denied"); return; }
        setStatus(!navigator.onLine ? "offline" : "error");
      }
    }
    void load();
    const handleOnline = () => { setOnline(true); setReloadKey((value) => value + 1); };
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline); window.addEventListener("offline", handleOffline);
    return () => { mounted = false; controller.abort(); window.removeEventListener("online", handleOnline); window.removeEventListener("offline", handleOffline); };
  }, [reloadKey]);

  async function changeLocale() {
    if (savingLocale) return;
    const previous = locale; const next = previous === "fa" ? "en" : "fa";
    setLocale(next); setLocaleError(false); setSavingLocale(true);
    try {
      await persistPreferredLocale(next);
      setData((current) => current ? { ...current, preferred_locale: next } : current);
    } catch { setLocale(previous); setLocaleError(true); }
    finally { setSavingLocale(false); }
  }

  if (status !== "ready" || !data) {
    const gateKind = status === "loading" || status === "login" || status === "denied" || status === "offline" ? status : "error";
    return <Gate kind={gateKind} locale={locale} onLocaleChange={() => setLocale((value) => value === "fa" ? "en" : "fa")} retry={() => setReloadKey((value) => value + 1)} />;
  }

  const t = labels[locale];
  const sidebarNav = [
    { href: "/teacher", label: t.home, icon: "home" as const },
    { href: "/teacher/classes", label: t.classes, icon: "classes" as const },
    { href: "/teacher/planning", label: t.planning, icon: "planning" as const },
    { href: "/teacher/assessment", label: t.assessment, icon: "assessment" as const },
    { href: "/teacher/tools", label: t.tools, icon: "tools" as const },
    { href: "/marketplace/requests", label: t.marketplace, icon: "marketplace" as const },
    { href: "/teacher/resources", label: t.resources, icon: "resources" as const },
    { href: "/teacher/account", label: t.account, icon: "account" as const },
  ];
  const bottomNav = [
    { href: "/teacher", label: t.home, icon: "home" as const },
    { href: "/teacher/classes", label: t.classes, icon: "classes" as const },
    { href: "/teacher/planning", label: t.planning, icon: "planning" as const },
    { href: "/teacher/assessment", label: t.assessment, icon: "assessment" as const },
    { href: "/teacher/resources", label: t.resources, icon: "resources" as const },
  ];
  const verified = data.capabilities.teacher_verified;

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

  return (
    <TeacherContext.Provider value={{ data, locale, online, activeClass, setActiveClass, classesList }}>
      <div className="teacher-shell" dir={locale === "fa" ? "rtl" : "ltr"} lang={locale}>
        <a className="teacher-skip-link" href="#teacher-main">{t.skip}</a>
        <aside className="teacher-sidebar">
          <Link className="teacher-brand-link" href="/teacher" aria-label="Endoora teacher home"><EndooraWordmark compact /></Link>
          <nav className="teacher-nav" aria-label={t.navigation}>{sidebarNav.map((item) => <NavItem key={item.href} {...item} active={isActive(pathname, item.href)} />)}</nav>
          <div className="teacher-sidebar__footer">
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
            <div className={`teacher-sidebar__status ${verified ? "is-verified" : "is-warning"}`}><span aria-hidden="true"><TeacherIcon name={verified ? "classes" : "account"} /></span><p>{verified ? t.verified : t.unverified}</p></div>
          </div>
        </aside>
        <header className="teacher-header">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <Link className="teacher-mobile-brand" href="/teacher" aria-label="Endoora teacher home"><EndooraWordmark compact /></Link>
            <strong>{t.workspace}</strong>
          </div>

          {/* Active Class Switcher & Quota Pill */}
          <div className="teacher-header__controls">
            {classesList.length > 0 ? (
              <div className="teacher-class-selector-wrap">
                <span style={{ color: "var(--color-muted)" }}>{t.activeClassLabel}</span>
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
                    ? `اعتبار امروز: ${usage.remaining_today} / ${usage.daily_limit}`
                    : `Daily Quota: ${usage.remaining_today} / ${usage.daily_limit}`
                  : t.dailyQuota}
              </span>
            </span>

            <Button className="teacher-language" type="button" onClick={() => void changeLocale()} disabled={savingLocale} aria-busy={savingLocale}>
              {t.switch}
            </Button>
          </div>
        </header>
        {localeError ? <div className="teacher-shell-message teacher-shell-message--error" role="alert">{t.localeError}</div> : null}
        {!online ? <div className="teacher-shell-message" role="status">{t.offline}</div> : null}
        <main className="teacher-main" id="teacher-main">{children}</main>
        <nav className="teacher-bottom-nav" aria-label={t.bottomNavigation}>{bottomNav.map((item) => <NavItem key={item.href} {...item} active={isActive(pathname, item.href)} />)}</nav>
      </div>
    </TeacherContext.Provider>
  );
}


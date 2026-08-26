"use client";

import { EndooraWordmark } from "@endoora/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { persistPreferredLocale } from "../../lib/endoora-api";
import {
  fetchTeacherHome,
  TeacherDashboardApiError,
  type TeacherHome,
  type TeacherLocale,
} from "../../lib/teacher-dashboard";

type TeacherContextValue = { data: TeacherHome; locale: TeacherLocale; online: boolean };
type TeacherIconName = "home" | "teach" | "market" | "resources" | "account";

const TeacherContext = createContext<TeacherContextValue | null>(null);

export function useTeacherHome(): TeacherContextValue {
  const value = useContext(TeacherContext);
  if (!value) throw new Error("useTeacherHome must be used inside TeacherShell.");
  return value;
}

const labels = {
  fa: {
    home: "خانه", teach: "تدریس", marketplace: "بازار مدرس", resources: "منابع", account: "حساب",
    switch: "English", workspace: "فضای تدریس", verified: "مدرس تأییدشده",
    unverified: "تأیید مدرس تکمیل نشده", localeError: "زبان حساب ذخیره نشد. دوباره تلاش کن.",
    offline: "اتصال قطع است؛ اطلاعات بارگیری‌شده همچنان در دسترس است.", navigation: "ناوبری مدرس",
    bottomNavigation: "ناوبری پایین مدرس", skip: "پرش به محتوای اصلی",
  },
  en: {
    home: "Home", teach: "Teach", marketplace: "Marketplace", resources: "Resources", account: "Account",
    switch: "فارسی", workspace: "Teaching workspace", verified: "Verified teacher",
    unverified: "Teacher verification incomplete", localeError: "Your language preference could not be saved. Try again.",
    offline: "You are offline; already-loaded information remains available.", navigation: "Teacher navigation",
    bottomNavigation: "Teacher bottom navigation", skip: "Skip to main content",
  },
} as const;

const iconPaths: Record<TeacherIconName, ReactNode> = {
  home: <><path d="m3 11 9-8 9 8" /><path d="M5.5 9.5V21h13V9.5M9 21v-7h6v7" /></>,
  teach: <><path d="M4 4h16v12H4z" /><path d="M8 21h8M12 16v5M8.5 10.5l2 2 5-5" /></>,
  market: <><path d="M6 8V6a6 6 0 0 1 12 0v2" /><path d="M4 8h16l-1 13H5z" /><path d="M9 12v1M15 12v1" /></>,
  resources: <><path d="M5 4.5A3.5 3.5 0 0 1 8.5 1H12v19H8.5A3.5 3.5 0 0 0 5 23z" /><path d="M19 4.5A3.5 3.5 0 0 0 15.5 1H12v19h3.5A3.5 3.5 0 0 1 19 23z" /></>,
  account: <><circle cx="12" cy="7" r="4" /><path d="M4 22a8 8 0 0 1 16 0" /></>,
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
        <div className="teacher-gate__top"><EndooraWordmark compact /><button type="button" className="teacher-language" onClick={onLocaleChange}>{content.switch}</button></div>
        <div className="teacher-gate__mark" aria-hidden="true"><TeacherIcon name="teach" /></div>
        <h1>{content[kind][0]}</h1><p>{content[kind][1]}</p>
        {kind === "login" ? <Link className="teacher-button teacher-button--primary" href="/auth/login">{content.loginAction}</Link> : null}
        {kind === "denied" ? <Link className="teacher-button teacher-button--secondary" href="/">{content.back}</Link> : null}
        {kind === "offline" || kind === "error" ? <button className="teacher-button teacher-button--primary" type="button" onClick={retry}>{content.retry}</button> : null}
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
  const nav = [
    { href: "/teacher", label: t.home, icon: "home" as const },
    { href: "/teacher/classes", label: t.teach, icon: "teach" as const },
    { href: "/marketplace/requests", label: t.marketplace, icon: "market" as const },
    { href: "/teacher/resources", label: t.resources, icon: "resources" as const },
    { href: "/teacher/account", label: t.account, icon: "account" as const },
  ];
  const verified = data.capabilities.teacher_verified;

  return (
    <TeacherContext.Provider value={{ data, locale, online }}>
      <div className="teacher-shell" dir={locale === "fa" ? "rtl" : "ltr"} lang={locale}>
        <a className="teacher-skip-link" href="#teacher-main">{t.skip}</a>
        <aside className="teacher-sidebar">
          <Link className="teacher-brand-link" href="/teacher" aria-label="Endoora teacher home"><EndooraWordmark compact /></Link>
          <nav className="teacher-nav" aria-label={t.navigation}>{nav.map((item) => <NavItem key={item.href} {...item} active={isActive(pathname, item.href)} />)}</nav>
          <div className={`teacher-sidebar__status ${verified ? "is-verified" : "is-warning"}`}><span aria-hidden="true"><TeacherIcon name={verified ? "teach" : "account"} /></span><p>{verified ? t.verified : t.unverified}</p></div>
        </aside>
        <header className="teacher-header">
          <Link className="teacher-mobile-brand" href="/teacher" aria-label="Endoora teacher home"><EndooraWordmark compact /></Link>
          <strong>{t.workspace}</strong>
          <div className="teacher-header__actions"><button className="teacher-language" type="button" onClick={() => void changeLocale()} disabled={savingLocale} aria-busy={savingLocale}>{t.switch}</button></div>
        </header>
        {localeError ? <div className="teacher-shell-message teacher-shell-message--error" role="alert">{t.localeError}</div> : null}
        {!online ? <div className="teacher-shell-message" role="status">{t.offline}</div> : null}
        <main className="teacher-main" id="teacher-main">{children}</main>
        <nav className="teacher-bottom-nav" aria-label={t.bottomNavigation}>{nav.map((item) => <NavItem key={item.href} {...item} active={isActive(pathname, item.href)} />)}</nav>
      </div>
    </TeacherContext.Provider>
  );
}

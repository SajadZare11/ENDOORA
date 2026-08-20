"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { EndooraWordmark } from "@endoora/ui";

import {
  fetchTeacherHome,
  TeacherDashboardApiError,
  type TeacherHome,
  type TeacherLocale,
} from "../../lib/teacher-dashboard";


type TeacherContextValue = {
  data: TeacherHome;
  locale: TeacherLocale;
  setLocale: (locale: TeacherLocale) => void;
};

const TeacherContext = createContext<TeacherContextValue | null>(null);

export function useTeacherHome(): TeacherContextValue {
  const value = useContext(TeacherContext);
  if (!value) {
    throw new Error("useTeacherHome must be used inside TeacherShell.");
  }
  return value;
}

const labels = {
  fa: {
    home: "خانه",
    teach: "تدریس",
    marketplace: "بازار مدرس",
    resources: "منابع",
    account: "حساب",
    switch: "English",
    verified: "مدرس تأییدشده",
    unverified: "نیازمند تأیید مدرس",
  },
  en: {
    home: "Home",
    teach: "Teach",
    marketplace: "Marketplace",
    resources: "Resources",
    account: "Account",
    switch: "فارسی",
    verified: "Verified teacher",
    unverified: "Teacher verification required",
  },
} as const;

function Gate({
  kind,
  retry,
}: {
  kind: "loading" | "login" | "denied" | "offline" | "error";
  retry: () => void;
}) {
  const content = {
    loading: ["در حال آماده‌کردن فضای مدرس…", "اطلاعات امن داشبورد در حال بارگیری است."],
    login: ["برای ادامه وارد حساب شو", "فضای مدرس فقط بعد از ورود امن نمایش داده می‌شود."],
    denied: ["این بخش برای حساب مدرس است", "نقش فعلی اجازه دسترسی به فضای مدرس را ندارد."],
    offline: ["اتصال اینترنت در دسترس نیست", "بعد از بازگشت اتصال دوباره تلاش کن."],
    error: ["فضای مدرس بارگیری نشد", "اتصال یا سرویس API را بررسی کن و دوباره تلاش کن."],
  }[kind];

  return (
    <main className="teacher-gate" dir="rtl" lang="fa" aria-busy={kind === "loading"}>
      <section className="teacher-gate__card" aria-live="polite">
        <EndooraWordmark />
        <h1>{content[0]}</h1>
        <p>{content[1]}</p>
        {kind === "login" && (
          <Link className="teacher-button teacher-button--primary" href="/auth/login">
            ورود
          </Link>
        )}
        {kind === "denied" && (
          <Link className="teacher-button teacher-button--secondary" href="/">
            بازگشت به صفحه اصلی
          </Link>
        )}
        {(kind === "offline" || kind === "error") && (
          <button className="teacher-button teacher-button--primary" type="button" onClick={retry}>
            تلاش دوباره
          </button>
        )}
      </section>
    </main>
  );
}

function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      className="teacher-nav__item"
      data-active={active ? "true" : "false"}
      href={href}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/teacher") return pathname === "/teacher";
  if (href === "/teacher/account") {
    return pathname.startsWith("/teacher/account") || pathname.startsWith("/account");
  }
  return pathname.startsWith(href);
}

export function TeacherShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [data, setData] = useState<TeacherHome | null>(null);
  const [locale, setLocale] = useState<TeacherLocale>("fa");
  const [status, setStatus] = useState<
    "loading" | "ready" | "login" | "denied" | "offline" | "error"
  >("loading");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    async function load() {
      if (!navigator.onLine) {
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
    const online = () => setReloadKey((value) => value + 1);
    window.addEventListener("online", online);

    return () => {
      mounted = false;
      controller.abort();
      window.removeEventListener("online", online);
    };
  }, [reloadKey]);

  const value = useMemo(
    () => (data ? { data, locale, setLocale } : null),
    [data, locale],
  );

  if (status !== "ready" || !value) {
    const gateKind =
      status === "loading" ||
      status === "login" ||
      status === "denied" ||
      status === "offline"
        ? status
        : "error";
    return <Gate kind={gateKind} retry={() => setReloadKey((value) => value + 1)} />;
  }

  const t = labels[locale];
  const nav = [
    { href: "/teacher", label: t.home },
    { href: "/teacher/classes", label: t.teach },
    { href: "/marketplace/requests", label: t.marketplace },
    { href: "/teacher/resources", label: t.resources },
    { href: "/teacher/account", label: t.account },
  ];

  return (
    <TeacherContext.Provider value={value}>
      <div className="teacher-shell" dir={locale === "fa" ? "rtl" : "ltr"} lang={locale}>
        <a className="teacher-skip-link" href="#teacher-main">
          {locale === "fa" ? "پرش به محتوای اصلی" : "Skip to main content"}
        </a>

        <header className="teacher-header">
          <Link className="teacher-brand-link" href="/teacher" aria-label="Endoora teacher home">
            <EndooraWordmark compact />
          </Link>
          <div className="teacher-header__actions">
            <span
              className={`teacher-verification-badge ${
                value.data.capabilities.teacher_verified
                  ? "teacher-verification-badge--verified"
                  : "teacher-verification-badge--warning"
              }`}
            >
              {value.data.capabilities.teacher_verified ? t.verified : t.unverified}
            </span>
            <button
              className="teacher-language"
              type="button"
              onClick={() => setLocale(locale === "fa" ? "en" : "fa")}
            >
              {t.switch}
            </button>
          </div>
        </header>

        <aside className="teacher-sidebar">
          <nav className="teacher-nav" aria-label={locale === "fa" ? "ناوبری مدرس" : "Teacher navigation"}>
            {nav.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                active={isActive(pathname, item.href)}
              />
            ))}
          </nav>
        </aside>

        <main className="teacher-main" id="teacher-main">
          {children}
        </main>

        <nav className="teacher-bottom-nav" aria-label={locale === "fa" ? "ناوبری پایین مدرس" : "Teacher bottom navigation"}>
          {nav.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              active={isActive(pathname, item.href)}
            />
          ))}
        </nav>
      </div>
    </TeacherContext.Provider>
  );
}

"use client";

import Link from "next/link";
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
  DashboardApiError,
  fetchLearnerHome,
  type LearnerHome,
  type Locale,
} from "../../lib/learner-dashboard";


type ContextValue = {
  data: LearnerHome;
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LearnerContext = createContext<ContextValue | null>(null);

export function useLearnerHome(): ContextValue {
  const value = useContext(LearnerContext);
  if (!value) throw new Error("useLearnerHome must be used inside LearnerShell.");
  return value;
}

const labels = {
  fa: {
    home: "خانه",
    learn: "یادگیری",
    practice: "تمرین",
    teachers: "معلم‌ها و کلاس‌ها",
    account: "حساب",
    soon: "به‌زودی",
    switch: "English",
  },
  en: {
    home: "Home",
    learn: "Learn",
    practice: "Practice",
    teachers: "Teachers & Classes",
    account: "Account",
    soon: "Soon",
    switch: "فارسی",
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
    loading: ["در حال آماده‌کردن خانه یادگیری…", "کمی صبر کن."],
    login: ["برای ادامه وارد حساب شو", "داشبورد فقط بعد از ورود امن نمایش داده می‌شود."],
    denied: ["این بخش برای حساب زبان‌آموز است", "نقش فعلی اجازه دسترسی به این داشبورد را ندارد."],
    offline: ["اتصال اینترنت در دسترس نیست", "بعد از بازگشت اتصال دوباره تلاش کن."],
    error: ["داشبورد بارگیری نشد", "اتصال یا سرویس API را بررسی کن."],
  }[kind];

  return (
    <main className="learner-gate" dir="rtl" lang="fa" aria-busy={kind === "loading"}>
      <section className="learner-gate__card" aria-live="polite">
        <EndooraWordmark />
        <h1>{content[0]}</h1>
        <p>{content[1]}</p>
        {kind === "login" && (
          <Link className="learner-button learner-button--primary" href="/auth/login">
            ورود
          </Link>
        )}
        {kind === "denied" && (
          <Link className="learner-button learner-button--secondary" href="/">
            بازگشت به صفحه اصلی
          </Link>
        )}
        {(kind === "offline" || kind === "error") && (
          <button className="learner-button learner-button--primary" type="button" onClick={retry}>
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
  active = false,
  disabled = false,
  soon,
}: {
  href: string;
  label: string;
  active?: boolean;
  disabled?: boolean;
  soon: string;
}) {
  if (disabled) {
    return (
      <span className="learner-nav__item learner-nav__item--disabled" aria-disabled="true">
        <span>{label}</span>
        <small>{soon}</small>
      </span>
    );
  }

  return (
    <Link
      className="learner-nav__item"
      data-active={active ? "true" : "false"}
      href={href}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

export function LearnerShell({ children }: { children: ReactNode }) {
  const [data, setData] = useState<LearnerHome | null>(null);
  const [locale, setLocale] = useState<Locale>("fa");
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
        const result = await fetchLearnerHome(controller.signal);
        if (!mounted) return;
        setData(result);
        setLocale(result.preferred_locale ?? "fa");
        setStatus("ready");
      } catch (error) {
        if (!mounted || controller.signal.aborted) return;

        if (error instanceof DashboardApiError && error.status === 401) {
          setStatus("login");
          return;
        }
        if (error instanceof DashboardApiError && error.status === 403) {
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
    return <Gate kind={gateKind} retry={() => setReloadKey((v) => v + 1)} />;
  }

  const t = labels[locale];

  return (
    <LearnerContext.Provider value={value}>
      <div className="learner-shell" dir={locale === "fa" ? "rtl" : "ltr"} lang={locale}>
        <a className="learner-skip-link" href="#learner-main">
          {locale === "fa" ? "پرش به محتوای اصلی" : "Skip to main content"}
        </a>

        <header className="learner-header">
          <Link className="learner-brand-link" href="/dashboard" aria-label="Endoora dashboard">
            <EndooraWordmark compact />
          </Link>
          <div className="learner-header__actions">
            <button
              className="learner-language"
              type="button"
              onClick={() => setLocale(locale === "fa" ? "en" : "fa")}
            >
              {t.switch}
            </button>
            <button
              className="learner-notification"
              type="button"
              disabled={!value.data.notifications_available}
              title={value.data.notifications_available ? undefined : t.soon}
            >
              {locale === "fa" ? "اعلان‌ها" : "Notifications"}
            </button>
          </div>
        </header>

        <aside className="learner-sidebar">
          <nav className="learner-nav" aria-label={locale === "fa" ? "ناوبری زبان‌آموز" : "Learner navigation"}>
            <NavItem href="/dashboard" label={t.home} active soon={t.soon} />
            <NavItem href="/learn" label={t.learn} disabled soon={t.soon} />
            <NavItem href="/practice" label={t.practice} disabled soon={t.soon} />
            <NavItem href="/teachers" label={t.teachers} disabled soon={t.soon} />
            <NavItem href="/account" label={t.account} soon={t.soon} />
          </nav>
        </aside>

        <main className="learner-main" id="learner-main">
          {children}
        </main>

        <nav className="learner-bottom-nav" aria-label={locale === "fa" ? "ناوبری پایین" : "Bottom navigation"}>
          <NavItem href="/dashboard" label={t.home} active soon={t.soon} />
          <NavItem href="/learn" label={t.learn} disabled soon={t.soon} />
          <NavItem href="/practice" label={t.practice} disabled soon={t.soon} />
          <NavItem href="/teachers" label={t.teachers} disabled soon={t.soon} />
          <NavItem href="/account" label={t.account} soon={t.soon} />
        </nav>
      </div>
    </LearnerContext.Provider>
  );
}

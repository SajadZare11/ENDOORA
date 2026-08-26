"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { EndooraWordmark } from "@endoora/ui";

import { persistPreferredLocale } from "../../lib/endoora-api";
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

type IconName = "home" | "learn" | "practice" | "teachers" | "account" | "bell";

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
    switch: "English",
    context: "خانه یادگیری",
    notifications: "اعلان‌ها",
    noNotifications: "اعلان تازه‌ای نداری.",
    close: "بستن اعلان‌ها",
    localeError: "تغییر زبان ذخیره نشد؛ دوباره تلاش کن.",
  },
  en: {
    home: "Home",
    learn: "Learn",
    practice: "Practice",
    teachers: "Teachers & Classes",
    account: "Account",
    switch: "فارسی",
    context: "Learning home",
    notifications: "Notifications",
    noNotifications: "You have no new notifications.",
    close: "Close notifications",
    localeError: "The language change was not saved. Please retry.",
  },
} as const;

const gateCopy = {
  fa: {
    loading: ["در حال آماده‌کردن خانه یادگیری…", "یک قدم روشن برای امروز در حال آماده‌شدن است."],
    login: ["برای ادامه وارد حساب شو", "خانه یادگیری فقط بعد از ورود امن نمایش داده می‌شود."],
    denied: ["این بخش برای حساب زبان‌آموز است", "نقش فعلی اجازه دسترسی به این خانه را ندارد."],
    offline: ["اتصال اینترنت در دسترس نیست", "بعد از بازگشت اتصال دوباره تلاش کن."],
    error: ["خانه یادگیری بارگیری نشد", "سرویس موقتاً پاسخ نداد. اطلاعات حساب شما تغییری نکرده است."],
    loginAction: "ورود امن",
    homeAction: "بازگشت به صفحه اصلی",
    retry: "تلاش دوباره",
    switch: "English",
  },
  en: {
    loading: ["Preparing your learning home…", "Your one clear next step is being prepared."],
    login: ["Sign in to continue", "Your learning home appears only after a secure sign-in."],
    denied: ["This area is for learner accounts", "Your current role cannot access this learning home."],
    offline: ["You are offline", "Retry when your connection returns."],
    error: ["Your learning home did not load", "The service did not respond. Your account data is unchanged."],
    loginAction: "Secure sign in",
    homeAction: "Return home",
    retry: "Try again",
    switch: "فارسی",
  },
} as const;

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10.5V20h13v-9.5M9.5 20v-5h5v5" /></>,
    learn: <><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v18H7.5A3.5 3.5 0 0 0 4 23.5Z" /><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v18h3.5a3.5 3.5 0 0 1 3.5 3.5Z" /></>,
    practice: <><path d="m4 20 4.2-1 10.9-10.9a2.1 2.1 0 0 0-3-3L5.2 16Z" /><path d="m14.8 6.4 2.8 2.8M4 20h5" /></>,
    teachers: <><path d="M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /><path d="M2.5 21a7 7 0 0 1 14 0M17 8.5a3.2 3.2 0 0 1 0 6.2M18 16.5a5.3 5.3 0 0 1 3.5 4.5" /></>,
    account: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    bell: <><path d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
  };

  return (
    <svg className="learner-icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function Gate({
  kind,
  locale,
  retry,
  onLocaleChange,
}: {
  kind: "loading" | "login" | "denied" | "offline" | "error";
  locale: Locale;
  retry: () => void;
  onLocaleChange: () => void;
}) {
  const copy = gateCopy[locale];
  const content = copy[kind];

  return (
    <main
      className="learner-gate"
      dir={locale === "fa" ? "rtl" : "ltr"}
      lang={locale}
      aria-busy={kind === "loading"}
    >
      <section className="learner-gate__card" aria-live="polite">
        <div className="learner-gate__header">
          <EndooraWordmark />
          <button className="learner-language" type="button" onClick={onLocaleChange}>
            {copy.switch}
          </button>
        </div>
        <span className="learner-gate__symbol" aria-hidden="true">E</span>
        <h1>{content[0]}</h1>
        <p>{content[1]}</p>
        {kind === "login" ? (
          <Link className="learner-button learner-button--primary" href="/auth/login">
            {copy.loginAction}
          </Link>
        ) : null}
        {kind === "denied" ? (
          <Link className="learner-button learner-button--secondary" href="/">
            {copy.homeAction}
          </Link>
        ) : null}
        {kind === "offline" || kind === "error" ? (
          <button className="learner-button learner-button--primary" type="button" onClick={retry}>
            {copy.retry}
          </button>
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
  icon: IconName;
  active: boolean;
}) {
  return (
    <Link
      className="learner-nav__item"
      data-active={active ? "true" : "false"}
      href={href}
      aria-current={active ? "page" : undefined}
    >
      <Icon name={icon} />
      <span>{label}</span>
    </Link>
  );
}

export function LearnerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [data, setData] = useState<LearnerHome | null>(null);
  const [locale, setLocale] = useState<Locale>("fa");
  const [localeError, setLocaleError] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [status, setStatus] = useState<
    "loading" | "ready" | "login" | "denied" | "offline" | "error"
  >("loading");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = locale === "fa" ? "rtl" : "ltr";
  }, [locale]);

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
    const offline = () => setStatus("offline");
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);

    return () => {
      mounted = false;
      controller.abort();
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, [reloadKey]);

  async function handleLocaleChange(nextLocale: Locale) {
    const previousLocale = locale;
    setLocale(nextLocale);
    setLocaleError("");
    if (!data) return;

    try {
      await persistPreferredLocale(nextLocale);
      setData((current) => current ? { ...current, preferred_locale: nextLocale } : current);
    } catch {
      setLocale(previousLocale);
      setLocaleError(labels[previousLocale].localeError);
    }
  }

  const value = data ? { data, locale, setLocale: handleLocaleChange } : null;

  if (status !== "ready" || !value) {
    const gateKind = status === "ready" ? "error" : status;
    return (
      <Gate
        kind={gateKind}
        locale={locale}
        retry={() => setReloadKey((current) => current + 1)}
        onLocaleChange={() => setLocale((current) => current === "fa" ? "en" : "fa")}
      />
    );
  }

  const t = labels[locale];
  const navItems = [
    { href: "/dashboard", label: t.home, icon: "home" as const },
    { href: "/learn", label: t.learn, icon: "learn" as const },
    { href: "/practice-ai", label: t.practice, icon: "practice" as const },
    { href: "/teachers", label: t.teachers, icon: "teachers" as const },
    { href: "/account", label: t.account, icon: "account" as const },
  ];

  return (
    <LearnerContext.Provider value={value}>
      <div className="learner-shell" dir={locale === "fa" ? "rtl" : "ltr"} lang={locale}>
        <a className="learner-skip-link" href="#learner-main">
          {locale === "fa" ? "پرش به محتوای اصلی" : "Skip to main content"}
        </a>

        <aside className="learner-sidebar">
          <Link className="learner-brand-link" href="/dashboard" aria-label="Endoora dashboard">
            <EndooraWordmark compact />
          </Link>
          <nav className="learner-nav" aria-label={locale === "fa" ? "ناوبری زبان‌آموز" : "Learner navigation"}>
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                {...item}
                active={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`))}
              />
            ))}
          </nav>
          <p className="learner-sidebar__note">
            {locale === "fa" ? "هر بار فقط یک قدم روشن." : "One clear step at a time."}
          </p>
        </aside>

        <header className="learner-header">
          <Link className="learner-brand-link learner-brand-link--mobile" href="/dashboard" aria-label="Endoora dashboard">
            <EndooraWordmark compact />
          </Link>
          <span className="learner-header__context">{t.context}</span>
          <div className="learner-header__actions">
            <button
              className="learner-language"
              type="button"
              onClick={() => void handleLocaleChange(locale === "fa" ? "en" : "fa")}
            >
              {t.switch}
            </button>
            <button
              className="learner-notification"
              type="button"
              aria-expanded={notificationsOpen}
              aria-controls="learner-notification-panel"
              aria-label={t.notifications}
              onClick={() => setNotificationsOpen((current) => !current)}
            >
              <Icon name="bell" />
              {value.data.notification_count > 0 ? (
                <span className="learner-notification__count">{value.data.notification_count}</span>
              ) : null}
            </button>
          </div>
          {notificationsOpen ? (
            <section className="learner-notification-panel" id="learner-notification-panel" aria-live="polite">
              <div>
                <strong>{t.notifications}</strong>
                <button type="button" onClick={() => setNotificationsOpen(false)} aria-label={t.close}>×</button>
              </div>
              <p>{t.noNotifications}</p>
            </section>
          ) : null}
        </header>

        {localeError ? <p className="learner-locale-error" role="alert">{localeError}</p> : null}

        <main className="learner-main" id="learner-main">
          {children}
        </main>

        <nav className="learner-bottom-nav" aria-label={locale === "fa" ? "ناوبری پایین" : "Bottom navigation"}>
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`))}
            />
          ))}
        </nav>
      </div>
    </LearnerContext.Provider>
  );
}

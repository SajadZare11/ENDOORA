"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { EndooraWordmark, Button } from "@endoora/ui";

import { endooraApi, persistPreferredLocale } from "../../lib/endoora-api";
import {
  DashboardApiError,
  fetchLearnerHome,
  type LearnerHome,
  type Locale,
} from "../../lib/learner-dashboard";
import { PublicHeader } from "../marketing/PublicHeader";

type ContextValue = {
  data: LearnerHome;
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

type IconName = "home" | "learn" | "video" | "practice" | "teachers" | "account" | "bell" | "logout" | "fire" | "zap" | "school";

const LearnerContext = createContext<ContextValue | null>(null);

export function useLearnerHome(): ContextValue {
  const value = useContext(LearnerContext);
  if (!value) throw new Error("useLearnerHome must be used inside LearnerShell.");
  return value;
}

const labels = {
  fa: {
    home: "داشبورد و خانه",
    learn: "یادگیری و دروس",
    videoCourses: "دوره‌های ویدیویی",
    practice: "جعبه لایتنر",
    teachers: "کلاس‌ها و مدرس‌ها",
    account: "حساب کاربری و تنظیمات",
    school: "تمرین تا ۲۰ (نهایی)",
    logout: "خروج از حساب",
    loggingOut: "در حال خروج…",
    switch: "English",
    context: "خانه یادگیری ایندورا",
    notifications: "اعلان‌ها",
    noNotifications: "اعلان تازه‌ای نداری. همه چیز به‌روز است! ✨",
    close: "بستن",
    localeError: "تغییر زبان ذخیره نشد؛ دوباره تلاش کن.",
    learnerBadge: "پنل دانش‌آموز",
    streakUnit: "روز پیاپی",
    levelTier: "سطح یادگیرنده",
  },
  en: {
    home: "Dashboard & Home",
    learn: "Learn & Lessons",
    videoCourses: "Video Courses",
    practice: "Leitner Box",
    teachers: "Classes & Teachers",
    account: "Account & Settings",
    school: "Practice to 20 (Finals)",
    logout: "Log out",
    loggingOut: "Logging out…",
    switch: "فارسی",
    context: "Endoora Learner Home",
    notifications: "Notifications",
    noNotifications: "No new notifications. You're all caught up! ✨",
    close: "Close",
    localeError: "The language change was not saved. Please retry.",
    learnerBadge: "Student Panel",
    streakUnit: "day streak",
    levelTier: "Learner Tier",
  },
} as const;

const gateCopy = {
  fa: {
    loading: ["در حال آماده‌کردن خانه یادگیری…", "مأموریت و برنامه‌های امروز شما در حال بارگیری است."],
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
    loading: ["Preparing your learning home…", "Your mission and steps for today are loading."],
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
    video: <><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></>,
    practice: <><rect x="3" y="4" width="18" height="16" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="10" y1="15" x2="14" y2="15" /></>,
    teachers: <><path d="M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /><path d="M2.5 21a7 7 0 0 1 14 0M17 8.5a3.2 3.2 0 0 1 0 6.2M18 16.5a5.3 5.3 0 0 1 3.5 4.5" /></>,
    account: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    bell: <><path d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
    fire: <><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z" /></>,
    zap: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>,
    school: <><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></>,
  };

  return (
    <svg className="learner-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <Button className="learner-language" type="button" onClick={onLocaleChange}>
            {copy.switch}
          </Button>
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
          <Button className="learner-button learner-button--primary" type="button" onClick={retry}>
            {copy.retry}
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

const STANDALONE_PREFIXES = [
  "/placement",
  "/lessons",
  "/courses",
  "/ielts",
  "/high-school",
  "/en/placement",
  "/en/lessons",
  "/en/courses",
  "/en/ielts",
  "/en/high-school",
];

function isLearnerRouteActive(currentPath: string, targetHref: string) {
  if (targetHref === "/dashboard") {
    if (currentPath.startsWith("/dashboard/classes")) return false;
    return (
      currentPath === "/dashboard" ||
      currentPath === "/today" ||
      currentPath.startsWith("/dashboard/")
    );
  }
  if (targetHref === "/learn/video") {
    return currentPath === "/learn/video" || currentPath.startsWith("/learn/video/");
  }
  if (targetHref === "/learn") {
    if (currentPath.startsWith("/learn/video")) return false;
    return (
      currentPath === "/learn" ||
      currentPath.startsWith("/learn/") ||
      currentPath === "/path" ||
      currentPath.startsWith("/path/") ||
      currentPath === "/high-school" ||
      currentPath.startsWith("/high-school/") ||
      currentPath === "/courses" ||
      currentPath.startsWith("/courses/") ||
      currentPath === "/lessons" ||
      currentPath.startsWith("/lessons/")
    );
  }
  if (targetHref === "/leitner" || targetHref === "/practice-ai") {
    return (
      currentPath === "/leitner" ||
      currentPath.startsWith("/leitner/") ||
      currentPath === "/practice-ai" ||
      currentPath.startsWith("/practice-ai/") ||
      currentPath === "/practice" ||
      currentPath.startsWith("/practice/") ||
      currentPath === "/mistakes" ||
      currentPath.startsWith("/mistakes/")
    );
  }
  if (targetHref === "/dashboard/classes" || targetHref === "/teachers") {
    return (
      currentPath === "/dashboard/classes" ||
      currentPath.startsWith("/dashboard/classes/") ||
      currentPath === "/teachers" ||
      currentPath.startsWith("/teachers/") ||
      currentPath === "/my-teachers" ||
      currentPath.startsWith("/my-teachers/") ||
      currentPath === "/classes" ||
      currentPath.startsWith("/classes/") ||
      currentPath === "/classroom" ||
      currentPath.startsWith("/classroom/") ||
      currentPath === "/bookings" ||
      currentPath.startsWith("/bookings/")
    );
  }
  if (targetHref === "/account") {
    return (
      currentPath === "/account" ||
      currentPath.startsWith("/account/") ||
      currentPath === "/achievements" ||
      currentPath.startsWith("/achievements/") ||
      currentPath === "/badges" ||
      currentPath.startsWith("/badges/") ||
      currentPath === "/grades" ||
      currentPath.startsWith("/grades/") ||
      currentPath === "/progress" ||
      currentPath.startsWith("/progress/")
    );
  }
  return currentPath === targetHref || currentPath.startsWith(`${targetHref}/`);
}

export function LearnerShell({ children }: { children: ReactNode }) {
  const pathnameHook = usePathname();
  const currentPath =
    pathnameHook ||
    (typeof window !== "undefined" ? window.location.pathname : "");
  const pathname = currentPath;
  const isStandaloneRoute = STANDALONE_PREFIXES.some(
    (prefix) => currentPath === prefix || currentPath.startsWith(`${prefix}/`)
  );
  const [data, setData] = useState<LearnerHome | null>(null);
  const [locale, setLocale] = useState<Locale>("fa");
  const [localeError, setLocaleError] = useState("");
  const [status, setStatus] = useState<
    "loading" | "ready" | "login" | "denied" | "offline" | "error"
  >("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = locale === "fa" ? "rtl" : "ltr";
  }, [locale]);

  useEffect(() => {
    const activePath =
      pathnameHook ||
      (typeof window !== "undefined" ? window.location.pathname : "");
    if (
      STANDALONE_PREFIXES.some(
        (prefix) => activePath === prefix || activePath.startsWith(`${prefix}/`)
      )
    ) {
      return;
    }
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
  }, [reloadKey, isStandaloneRoute, pathnameHook]);

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

  if (isStandaloneRoute) {
    return <>{children}</>;
  }

  if (status !== "ready" || !value) {
    const gateKind = status === "ready" ? "error" : status;
    return (
      <div className="learner-shell" dir={locale === "fa" ? "rtl" : "ltr"} lang={locale}>
        <Gate
          kind={gateKind}
          locale={locale}
          retry={() => setReloadKey((current) => current + 1)}
          onLocaleChange={() => setLocale((current) => (current === "fa" ? "en" : "fa"))}
        />
      </div>
    );
  }

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

  const t = labels[locale];
  const userInitials = (value.data.greeting_name || "ی")[0]?.toUpperCase() || "E";
  const studentShortId = value.data.user_id ? `EN-${value.data.user_id.slice(-6).toUpperCase()}` : "EN-10482";
  const currentLevel = Math.max(1, Math.floor((value.data.xp || 0) / 200) + 1);

  const navItems = [
    { href: "/dashboard", label: t.home, icon: "home" as const },
    { href: "/learn", label: t.learn, icon: "learn" as const },
    { href: "/learn/video", label: t.videoCourses, icon: "video" as const },
    { href: "/leitner", label: t.practice, icon: "practice" as const },
    { href: "/dashboard/classes", label: t.teachers, icon: "teachers" as const },
    { href: "/account", label: t.account, icon: "account" as const },
  ];

  return (
    <LearnerContext.Provider value={value}>
      <div className="learner-shell" dir={locale === "fa" ? "rtl" : "ltr"} lang={locale}>
        <a className="learner-skip-link" href="#learner-main">
          {locale === "fa" ? "پرش به محتوای اصلی" : "Skip to main content"}
        </a>

        {/* Global Endoora Header (هدر سراسری و رسمی ایندورا) */}
        <PublicHeader
          locale={locale}
          currentPath={pathname}
          onLocaleChange={(nextLocale) => void handleLocaleChange(nextLocale)}
        />

        {/* Desktop Modern Glassmorphic Right Sidebar (سایدبار سمت راست با مشخصات دانش‌آموز) */}
        <aside className="learner-sidebar" aria-label={locale === "fa" ? "سایدبار مشخصات و ناوبری" : "Student profile and navigation sidebar"}>
          {/* 1. Student Profile Card (کارت شیشه‌ای مشخصات دانش‌آموز) */}
          <div className="learner-profile-card">
            <div className="learner-profile-card__top">
              <div className="learner-profile-card__avatar-box" aria-hidden="true">
                <span className="learner-profile-card__initial">
                  {userInitials}
                </span>
                <span className="learner-profile-card__online-indicator" title={locale === "fa" ? "آنلاین" : "Online"} />
              </div>

              <div className="learner-profile-card__info">
                <strong className="learner-profile-card__name">
                  {value.data.greeting_name || (locale === "fa" ? "زبان‌آموز ایندورا" : "Endoora Learner")}
                </strong>
                <span className="learner-profile-card__id">
                  {locale === "fa" ? "شناسه: " : "ID: "}
                  <bdi>{studentShortId}</bdi>
                </span>
              </div>
            </div>

            <div className="learner-profile-card__chips">
              <span className="learner-profile-chip learner-profile-chip--tier">
                <span className="learner-profile-chip__dot" />
                {locale === "fa" ? `سطح ${currentLevel}` : `Tier ${currentLevel}`}
              </span>
              <span className="learner-profile-chip learner-profile-chip--membership">
                {locale === "fa" ? "عضویت فعال" : "Active Member"}
              </span>
            </div>

            <Link href="/account" className="learner-profile-card__edit-btn">
              <span>{locale === "fa" ? "مشاهده و ویرایش مشخصات" : "View & Edit Profile"}</span>
              <span aria-hidden="true">{locale === "fa" ? "←" : "→"}</span>
            </Link>
          </div>

          <div className="learner-sidebar__divider" aria-hidden="true" />

          {/* 2. Organized Navigation Menu (ناوبری مرتب و شیک) */}
          <nav className="learner-nav" aria-label={locale === "fa" ? "ناوبری زبان‌آموز" : "Learner navigation"}>
            <span className="learner-nav__category-label">
              {locale === "fa" ? "منوی اصلی" : "Main Menu"}
            </span>
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                {...item}
                active={isLearnerRouteActive(pathname, item.href)}
              />
            ))}
          </nav>

          {/* 3. Sidebar Footer */}
          <div className="learner-sidebar__footer">
            <button
              type="button"
              className="learner-nav__item learner-nav__item--logout"
              onClick={() => void handleLogout()}
              disabled={loggingOut}
              aria-label={t.logout}
            >
              <Icon name="logout" />
              <span>{loggingOut ? t.loggingOut : t.logout}</span>
            </button>
            <p className="learner-sidebar__note">
              {locale === "fa" ? "هر روز، یک قدم روشن و مؤثر." : "Every day, one clear step."}
            </p>
          </div>
        </aside>

        {localeError ? <p className="learner-locale-error" role="alert">{localeError}</p> : null}

        {/* Main Content Area */}
        <main className="learner-main" id="learner-main">
          {children}
        </main>

        {/* Mobile Floating Bottom Navigation Dock */}
        <nav className="learner-bottom-nav" aria-label={locale === "fa" ? "ناوبری سریع موبایل" : "Mobile quick navigation"}>
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={isLearnerRouteActive(pathname, item.href)}
            />
          ))}
        </nav>
      </div>
    </LearnerContext.Provider>
  );
}

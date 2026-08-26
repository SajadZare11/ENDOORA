"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, type ReactNode } from "react";

import type { EndooraLocale } from "../../lib/endoora-api";
import styles from "./auth.module.css";

type AuthShellProps = {
  locale: EndooraLocale;
  onLocaleChange: (locale: EndooraLocale) => void;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  variant?: "auth" | "wide";
};

const copy = {
  fa: {
    home: "صفحه اصلی",
    language: "نمایش نسخه انگلیسی",
    sceneTitle: "درِ موفقیت را با انگلیسی باز کنید",
    sceneBody:
      "Endoora تمرین انگلیسی را به مسیری روشن برای تحصیل، کار و ارتباط مطمئن تبدیل می‌کند.",
    securityTitle: "امنیت حساب شما مهم است",
    trust: [
      "گذرواژه به‌صورت هش‌شده نگهداری می‌شود",
      "نشست ورود با کوکی محافظت‌شده مدیریت می‌شود",
      "تلاش‌های ورود و کد یک‌بارمصرف محدود است",
    ],
  },
  en: {
    home: "Home",
    language: "Show Persian version",
    sceneTitle: "Open the door to what’s next",
    sceneBody:
      "Endoora turns English practice into a clear path toward study, work and confident global communication.",
    securityTitle: "Your account security matters",
    trust: [
      "Passwords are stored as one-way hashes",
      "Sign-in sessions use protected cookies",
      "Login and one-time-code attempts are rate limited",
    ],
  },
} as const;

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.5 10.5 12 3l8.5 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-4.5v-6h-5v6H5a1.5 1.5 0 0 1-1.5-1.5z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3Z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.8 20 6v5.7c0 4.6-3.1 8.1-8 9.5-4.9-1.4-8-4.9-8-9.5V6z" />
      <path d="m8.4 12.1 2.3 2.3 4.9-5" />
    </svg>
  );
}

export function AuthShell({
  locale,
  onLocaleChange,
  title,
  description,
  children,
  footer,
  variant = "auth",
}: AuthShellProps) {
  const isPersian = locale === "fa";
  const t = copy[locale];
  const homeHref = isPersian ? "/" : "/en";

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = isPersian ? "rtl" : "ltr";
  }, [isPersian, locale]);

  return (
    <main
      className={styles.page}
      lang={locale}
      dir={isPersian ? "rtl" : "ltr"}
    >
      <div className={`${styles.stage} ${variant === "wide" ? styles.stageWide : ""}`}>
        <header className={styles.header}>
          <Link href={homeHref} className={[styles.brand, "ltr-isolate"].join(" ")} aria-label="Endoora home">
            <span className={styles.brandMark} aria-hidden="true"><span /></span>
            <span>
              <span className={styles.brandName}>Endoora</span>
              <span className={styles.brandMotto}>A new door to your English</span>
            </span>
          </Link>

          <nav className={styles.headerActions} aria-label={t.home}>
            <Link href={homeHref} className={styles.headerControl}>
              <HomeIcon />
              <span>{t.home}</span>
            </Link>
            <button
              type="button"
              className={styles.headerControl}
              onClick={() => onLocaleChange(isPersian ? "en" : "fa")}
              aria-label={t.language}
            >
              <GlobeIcon />
              <span>{isPersian ? "English" : "فارسی"}</span>
            </button>
          </nav>
        </header>

        <section id="auth-content" className={styles.workspace} aria-labelledby="auth-title">
          <div className={styles.heading}>
            <span className={styles.securityIcon} aria-hidden="true"><ShieldIcon /></span>
            <div>
              <h1 id="auth-title" className={styles.title}>{title}</h1>
              <p className={styles.description}>{description}</p>
            </div>
          </div>

          <div className={styles.body}>{children}</div>
          {footer ? <footer className={styles.footer}>{footer}</footer> : null}

          <aside className={styles.securityPanel} aria-label={t.securityTitle}>
            <div className={styles.securityHeading}>
              <ShieldIcon />
              <strong>{t.securityTitle}</strong>
            </div>
            <ul>
              {t.trust.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </aside>
        </section>

        <aside className={styles.scene} aria-labelledby="auth-scene-title">
          <Image
            className={styles.sceneImage}
            src="/images/auth/endoora-door-to-success-v2.png"
            alt=""
            fill
            priority
            sizes="(max-width: 48rem) 100vw, (max-width: 80rem) 38vw, 31rem"
          />
          <div className={styles.sceneCopy}>
            <h2 id="auth-scene-title">{t.sceneTitle}</h2>
            <p>{t.sceneBody}</p>
          </div>
        </aside>
      </div>
    </main>
  );
}

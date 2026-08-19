"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import type { EndooraLocale } from "../../lib/endoora-api";
import styles from "./auth.module.css";

type AuthShellProps = {
  locale: EndooraLocale;
  onLocaleChange: (locale: EndooraLocale) => void;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({
  locale,
  onLocaleChange,
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  const isPersian = locale === "fa";

  return (
    <main
      className={styles.page}
      lang={locale}
      dir={isPersian ? "rtl" : "ltr"}
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <Link
            href="/"
            className={`${styles.brand} ltr-isolate`}
            aria-label="Endoora home"
          >
            <span className={styles.brandName}>Endoora</span>
            <span className={styles.brandMotto}>
              A new door to your English
            </span>
          </Link>

          <button
            type="button"
            className="endoora-button endoora-button--secondary"
            onClick={() =>
              onLocaleChange(isPersian ? "en" : "fa")
            }
          >
            {isPersian ? "English" : "فارسی"}
          </button>
        </header>

        <section
          className={`endoora-card ${styles.card}`}
          aria-labelledby="auth-title"
        >
          <div className="endoora-card__header">
            <div>
              <h1
                id="auth-title"
                className="endoora-card__title"
              >
                {title}
              </h1>

              <p className="endoora-card__description">
                {description}
              </p>
            </div>
          </div>

          <div className={`endoora-card__body ${styles.body}`}>
            {children}
          </div>
        </section>

        {footer ? (
          <footer className={styles.footer}>
            {footer}
          </footer>
        ) : null}
      </div>
    </main>
  );
}

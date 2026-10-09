"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import {
  alternatePath,
  localizedPath,
  type PublicLocale,
} from "../../lib/public-site";
import styles from "./public-shell.module.css";
import { AccountEntryLink } from "./AccountEntryLink";

export const PUBLIC_NAV = [
  { path: "/skills/school", fa: "زبان دبیرستان", en: "High School English" },
  { path: "/teachers", fa: "مدرس‌ها", en: "Teachers" },
  { path: "/classes", fa: "کلاس‌ها", en: "Classes" },
  { path: "/skills", fa: "مهارت‌ها", en: "Skills" },
  { path: "/learn", fa: "یادگیری", en: "Learn" },
  { path: "/ielts", fa: "IELTS", en: "IELTS" },
  { path: "/pricing", fa: "اشتراک", en: "Membership" },
] as const;

export function isCurrentRoute(currentPath: string, path: string) {
  if (path === "/") return currentPath === "/";
  if (path === "/skills") {
    if (currentPath === "/skills/school" || currentPath.startsWith("/skills/school/")) {
      return false;
    }
  }
  return currentPath === path || currentPath.startsWith(`${path}/`);
}

export type PublicHeaderProps = {
  locale: PublicLocale;
  currentPath: string;
  onLocaleChange?: (locale: PublicLocale) => void;
  extraActions?: ReactNode;
};

export function PublicHeader({
  locale,
  currentPath,
  onLocaleChange,
  extraActions,
}: PublicHeaderProps) {
  const isFa = locale === "fa";

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link
          className={styles.brand}
          href={localizedPath(locale, "/")}
          aria-label={isFa ? "صفحه اصلی ایندورا" : "Endoora home"}
        >
          <Image
            className={styles.brandLogo}
            src="/images/endoora-mark.png"
            alt="Endoora"
            width={38}
            height={45}
            priority
          />
          <div className={styles.brandCopy}>
            <span className={styles.brandName} dir="ltr">Endoora</span>
            <span className={styles.motto} dir="ltr">A new door to your English</span>
          </div>
        </Link>

        <nav className={styles.desktopNav} aria-label={isFa ? "ناوبری اصلی" : "Primary navigation"}>
          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.path}
              href={localizedPath(locale, item.path)}
              aria-current={isCurrentRoute(currentPath, item.path) ? "page" : undefined}
            >
              {isFa ? item.fa : item.en}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          {extraActions}
          {onLocaleChange ? (
            <button
              type="button"
              className={styles.language}
              onClick={() => onLocaleChange(isFa ? "en" : "fa")}
              aria-label={isFa ? "Switch to English" : "تغییر به فارسی"}
            >
              {isFa ? "English" : "فارسی"}
            </button>
          ) : (
            <Link
              className={styles.language}
              href={alternatePath(locale, currentPath)}
              hrefLang={isFa ? "en" : "fa-IR"}
            >
              {isFa ? "English" : "فارسی"}
            </Link>
          )}
          <AccountEntryLink className={styles.primaryCta} locale={locale} />
          <details className={styles.mobileMenu}>
            <summary aria-label={isFa ? "باز کردن منوی اصلی" : "Open main menu"}>
              <span aria-hidden="true" className={styles.menuIcon} />
              <span>{isFa ? "منو" : "Menu"}</span>
            </summary>
            <nav aria-label={isFa ? "ناوبری موبایل" : "Mobile navigation"}>
              {PUBLIC_NAV.map((item) => (
                <Link
                  key={item.path}
                  href={localizedPath(locale, item.path)}
                  aria-current={isCurrentRoute(currentPath, item.path) ? "page" : undefined}
                >
                  {isFa ? item.fa : item.en}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

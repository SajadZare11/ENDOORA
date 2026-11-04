"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import {
  localizedPath,
  type PublicLocale,
} from "../../lib/public-site";
import styles from "./public-shell.module.css";
import { AccountActions } from "./AccountEntryLink";

export const PUBLIC_NAV = [
  { path: "/skills/school", fa: "زبان دبیرستان", en: "High School English" },
  { path: "/teachers", fa: "مدرس‌ها", en: "Teachers" },
  { path: "/classes", fa: "کلاس‌ها", en: "Classes" },
  { path: "/skills", fa: "مهارت‌ها", en: "Skills" },
  { path: "/learn", fa: "یادگیری", en: "Learn" },
  { path: "/ielts", fa: "IELTS", en: "IELTS" },
  { path: "/pricing", fa: "اشتراک", en: "Membership" },
] as const;

export type HeaderSectionTheme =
  | "school"
  | "teachers"
  | "classes"
  | "skills"
  | "learn"
  | "ielts"
  | "pricing"
  | "home";

export function getHeaderSectionTheme(currentPath: string): HeaderSectionTheme {
  if (currentPath === "/skills/school" || currentPath.startsWith("/skills/school/")) {
    return "school";
  }
  if (currentPath === "/teachers" || currentPath.startsWith("/teachers/")) {
    return "teachers";
  }
  if (currentPath === "/classes" || currentPath.startsWith("/classes/")) {
    return "classes";
  }
  if (currentPath === "/skills" || currentPath.startsWith("/skills/")) {
    return "skills";
  }
  if (currentPath === "/learn" || currentPath.startsWith("/learn/")) {
    return "learn";
  }
  if (currentPath === "/ielts" || currentPath.startsWith("/ielts/")) {
    return "ielts";
  }
  if (currentPath === "/pricing" || currentPath.startsWith("/pricing/")) {
    return "pricing";
  }
  return "home";
}

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
  const sectionTheme = getHeaderSectionTheme(currentPath);

  return (
    <header className={styles.header} data-section-theme={sectionTheme}>
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
          {PUBLIC_NAV.map((item) => {
            const active = isCurrentRoute(currentPath, item.path);
            return (
              <Link
                key={item.path}
                href={localizedPath(locale, item.path)}
                className={active ? styles.navActiveLink : styles.navLink}
                aria-current={active ? "page" : undefined}
              >
                <span>{isFa ? item.fa : item.en}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          {extraActions}
          <div className={styles.desktopAuthGroup}>
            <AccountActions
              locale={locale}
              primaryClassName={styles.primaryCta}
              secondaryClassName={styles.secondaryCta}
            />
          </div>
          <details className={styles.mobileMenu}>
            <summary aria-label={isFa ? "باز کردن منوی اصلی" : "Open main menu"}>
              <span aria-hidden="true" className={styles.menuIcon} />
              <span>{isFa ? "منو" : "Menu"}</span>
            </summary>
            <nav aria-label={isFa ? "ناوبری موبایل" : "Mobile navigation"}>
              <div className={styles.mobileNavLinks}>
                {PUBLIC_NAV.map((item) => (
                  <Link
                    key={item.path}
                    href={localizedPath(locale, item.path)}
                    className={isCurrentRoute(currentPath, item.path) ? styles.mobileActiveLink : undefined}
                    aria-current={isCurrentRoute(currentPath, item.path) ? "page" : undefined}
                  >
                    {isFa ? item.fa : item.en}
                  </Link>
                ))}
              </div>
              <div className={styles.mobileAuthSection}>
                <AccountActions
                  locale={locale}
                  primaryClassName={styles.mobilePrimaryCta}
                  secondaryClassName={styles.mobileSecondaryCta}
                  mobile
                />
              </div>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";
import { alternatePath, localizedPath, type PublicLocale } from "../../lib/public-site";
import styles from "./public-shell.module.css";
import { DocumentLocaleSync } from "./DocumentLocaleSync";

const nav = [
  { path: "/", fa: "خانه", en: "Home" },
  { path: "/how-it-works", fa: "چطور کار می‌کند", en: "How it works" },
  { path: "/placement", fa: "تعیین سطح", en: "Placement" },
  { path: "/teachers", fa: "مدرس‌ها", en: "Teachers" },
  { path: "/classes", fa: "کلاس‌ها", en: "Classes" },
  { path: "/learn", fa: "دوره‌ها", en: "Courses" },
  { path: "/ielts", fa: "IELTS", en: "IELTS" },
  { path: "/pricing", fa: "قیمت", en: "Pricing" },
  { path: "/help", fa: "راهنما", en: "Help" },
] as const;

export function PublicShell({
  locale,
  currentPath,
  children,
}: {
  locale: PublicLocale;
  currentPath: string;
  children: ReactNode;
}) {
  const isFa = locale === "fa";
  return (
    <div className={styles.site} lang={locale} dir={isFa ? "rtl" : "ltr"}>
      <DocumentLocaleSync locale={locale} />
      <a className={styles.skipLink} href="#main-content">
        {isFa ? "رفتن به محتوای اصلی" : "Skip to main content"}
      </a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link className={styles.brand} href={localizedPath(locale, "/")} aria-label={isFa ? "صفحه اصلی Endoora" : "Endoora home"}>
            <span className={styles.brandName} dir="ltr">Endoora</span>
            <span className={styles.motto} dir="ltr">A new door to your English</span>
          </Link>

          <nav className={styles.desktopNav} aria-label={isFa ? "ناوبری اصلی" : "Primary navigation"}>
            {nav.map((item) => (
              <Link key={item.path} href={localizedPath(locale, item.path)}>
                {isFa ? item.fa : item.en}
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            <Link className={styles.language} href={alternatePath(locale, currentPath)} hrefLang={isFa ? "en" : "fa-IR"}>
              {isFa ? "English" : "فارسی"}
            </Link>
            <Link className={styles.primaryCta} href={localizedPath(locale, "/placement")}>
              {isFa ? "تعیین سطح" : "Placement"}
            </Link>
          </div>
        </div>
        <details className={styles.mobileMenu}>
          <summary>{isFa ? "منو" : "Menu"}</summary>
          <nav aria-label={isFa ? "ناوبری موبایل" : "Mobile navigation"}>
            {nav.map((item) => (
              <Link key={item.path} href={localizedPath(locale, item.path)}>
                {isFa ? item.fa : item.en}
              </Link>
            ))}
          </nav>
        </details>
      </header>

      <main id="main-content" className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <strong className={styles.footerBrand} dir="ltr">Endoora</strong>
            <p className={styles.footerText}>{isFa ? "سیستم یادگیری انگلیسی فارسی‌محور برای زبان‌آموزان ایران." : "A Persian-first English learning system for Iranian learners."}</p>
          </div>
          <div>
            <strong>{isFa ? "یادگیری" : "Learning"}</strong>
            <Link href={localizedPath(locale, "/skills")}>{isFa ? "مهارت‌ها" : "Skills"}</Link>
            <Link href={localizedPath(locale, "/resources")}>{isFa ? "منابع" : "Resources"}</Link>
            <Link href={localizedPath(locale, "/culture")}>{isFa ? "فرهنگ و وبلاگ" : "Culture & blog"}</Link>
          </div>
          <div>
            <strong>{isFa ? "اعتماد" : "Trust"}</strong>
            <Link href={localizedPath(locale, "/legal/privacy")}>{isFa ? "حریم خصوصی (پیش‌نویس)" : "Privacy (draft)"}</Link>
            <Link href={localizedPath(locale, "/legal/accessibility")}>{isFa ? "دسترسی‌پذیری (پیش‌نویس)" : "Accessibility (draft)"}</Link>
            <Link href={localizedPath(locale, "/legal/ai-limitations")}>{isFa ? "محدودیت AI (پیش‌نویس)" : "AI limitations (draft)"}</Link>
          </div>
          <div>
            <strong>{isFa ? "پشتیبانی" : "Support"}</strong>
            <Link href={localizedPath(locale, "/contact")}>{isFa ? "تماس" : "Contact"}</Link>
            <Link href={localizedPath(locale, "/status")}>{isFa ? "وضعیت سرویس" : "Status"}</Link>
            <Link href={localizedPath(locale, "/legal/copyright")}>{isFa ? "کپی‌رایت" : "Copyright"}</Link>
          </div>
        </div>
        <p className={styles.copyright}>© 2026 Endoora · <span dir="ltr">endoora.ir</span></p>
      </footer>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import {
  localizedPath,
  type PublicLocale,
} from "../../lib/public-site";
import styles from "./public-shell.module.css";
import { AnalyticsConsent } from "./AnalyticsConsent";
import { DocumentLocaleSync } from "./DocumentLocaleSync";
import { PublicHeader } from "./PublicHeader";
// PublicHeader mounts: <AccountEntryLink locale={locale} />

export function PublicShell({
  locale,
  currentPath,
  onLocaleChange,
  children,
}: {
  locale: PublicLocale;
  currentPath: string;
  onLocaleChange?: (locale: PublicLocale) => void;
  children: ReactNode;
}) {
  const isFa = locale === "fa";
  return (
    <div className={styles.site} lang={locale} dir={isFa ? "rtl" : "ltr"}>
      <DocumentLocaleSync locale={locale} />
      <AnalyticsConsent locale={locale} />
      <a className={styles.skipLink} href="#main-content">
        {isFa ? "رفتن به محتوای اصلی" : "Skip to main content"}
      </a>
      <PublicHeader
        locale={locale}
        currentPath={currentPath}
        onLocaleChange={onLocaleChange}
      />

      <main id="main-content" className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <div className={styles.footerBrandWrap}>
              <Image
                className={styles.footerLogo}
                src="/images/endoora-mark.png"
                alt="Endoora"
                width={28}
                height={34}
              />
              <strong className={styles.footerBrand} dir="ltr">Endoora</strong>
            </div>
            <p className={styles.footerText}>{isFa ? "یادگیری خودمانی، راحت و هوشمند انگلیسی برای همه." : "A Persian-first English learning system for Iranian learners."}</p>
          </div>
          <div>
            <strong>{isFa ? "یادگیری" : "Learning"}</strong>
            <Link href={localizedPath(locale, "/features")}>{isFa ? "امکانات و قابلیت‌ها" : "Features"}</Link>
            <Link href={localizedPath(locale, "/skills")}>{isFa ? "مهارت‌ها" : "Skills"}</Link>
            <Link href={localizedPath(locale, "/community")}>{isFa ? "جامعه یادگیری" : "Community"}</Link>
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
            <Link href={localizedPath(locale, "/support")}>{isFa ? "مرکز پشتیبانی و تیکت" : "Support Center"}</Link>
            <Link href={localizedPath(locale, "/search")}>{isFa ? "جستجوی یکپارچه" : "Search"}</Link>
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

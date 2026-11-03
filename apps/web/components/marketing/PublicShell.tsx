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
          <div className={styles.footerBrandCol}>
            <div className={styles.footerBrandWrap}>
              <Image
                className={styles.footerLogo}
                src="/images/endoora-mark.png"
                alt="Endoora"
                width={24}
                height={29}
              />
              <strong className={styles.footerBrand} dir="ltr">Endoora</strong>
            </div>
            <p className={styles.footerText}>
              {isFa
                ? "سیستم خودمانی و هوشمند یادگیری زبان انگلیسی."
                : "A smart, friendly and Persian-first English learning platform."}
            </p>
          </div>

          <div className={styles.footerCol}>
            <strong className={styles.colTitle}>{isFa ? "یادگیری" : "Learning"}</strong>
            <Link href={localizedPath(locale, "/features")}>{isFa ? "امکانات و قابلیت‌ها" : "Features"}</Link>
            <Link href={localizedPath(locale, "/skills")}>{isFa ? "مهارت‌ها" : "Skills"}</Link>
            <Link href={localizedPath(locale, "/community")}>{isFa ? "جامعه یادگیری" : "Community"}</Link>
            <Link href={localizedPath(locale, "/culture")}>{isFa ? "فرهنگ و وبلاگ" : "Culture & Blog"}</Link>
          </div>

          <div className={styles.footerCol}>
            <strong className={styles.colTitle}>{isFa ? "قوانین و امنیت" : "Trust & Legal"}</strong>
            <Link href={localizedPath(locale, "/legal/privacy")}>{isFa ? "حریم خصوصی" : "Privacy Policy"}</Link>
            <Link href={localizedPath(locale, "/legal/accessibility")}>{isFa ? "دسترسی‌پذیری" : "Accessibility"}</Link>
            <Link href={localizedPath(locale, "/legal/ai-limitations")}>{isFa ? "شفافیت هوش مصنوعی" : "AI Transparency"}</Link>
          </div>

          <div className={styles.footerCol}>
            <strong className={styles.colTitle}>{isFa ? "پشتیبانی" : "Support"}</strong>
            <Link href={localizedPath(locale, "/support")}>{isFa ? "مرکز پشتیبانی و تیکت" : "Support Center"}</Link>
            <Link href={localizedPath(locale, "/search")}>{isFa ? "جستجوی جامع" : "Search"}</Link>
            <Link href={localizedPath(locale, "/contact")}>{isFa ? "ارتباط با ما" : "Contact Us"}</Link>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.footerMeta}>
            <span className={styles.copyrightText}>© 2026 Endoora · <span dir="ltr">endoora.ir</span></span>
            <span className={styles.metaDivider}>·</span>
            <Link href={localizedPath(locale, "/status")} className={styles.metaLink}>
              {isFa ? "وضعیت سرویس" : "Status"}
            </Link>
            <span className={styles.metaDivider}>·</span>
            <Link href={localizedPath(locale, "/legal/copyright")} className={styles.metaLink}>
              {isFa ? "قوانین کپی‌رایت" : "Copyright"}
            </Link>
          </div>

          <div className={styles.socialGroup}>
            <a
              href="https://t.me/endoora"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="Telegram"
              title="Telegram"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21.5 2L2 11.5l7 3 2.5 7.5 4-4.5 6 4.5 1.5-20z" />
                <path d="M9 14.5l3.5-3" />
              </svg>
            </a>
            <a
              href="https://instagram.com/endoora.ir"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="Instagram"
              title="Instagram"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/company/endoora"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a
              href="mailto:support@endoora.ir"
              className={styles.socialIcon}
              aria-label="Email"
              title="Email: support@endoora.ir"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

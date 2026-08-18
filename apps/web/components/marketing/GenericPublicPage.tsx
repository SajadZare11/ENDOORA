import Link from "next/link";
import { PublicShell } from "./PublicShell";
import {
  LAUNCH_PLAN,
  localizedPath,
  publicPages,
  type PublicLocale,
  type PublicPageKey,
} from "../../lib/public-site";
import styles from "./marketing.module.css";

export function GenericPublicPage({ locale, pageKey }: { locale: PublicLocale; pageKey: PublicPageKey }) {
  const copy = publicPages[pageKey][locale];
  const isFa = locale === "fa";
  const path = `/${pageKey}`;
  const isPricing = pageKey === "pricing";

  return (
    <PublicShell locale={locale} currentPath={path}>
      <section className={styles.pageHero}>
        <span className={styles.kicker}>{copy.eyebrow}</span>
        <h1>{copy.title}</h1>
        <p>{copy.summary}</p>
        <div className={styles.heroActions}>
          <Link className={styles.primaryButton} href={localizedPath(locale, pageKey === "placement" ? "/#waitlist" : "/placement")}>
            {pageKey === "placement" ? (isFa ? "ثبت علاقه‌مندی" : "Join early access") : (isFa ? "تعیین سطح" : "Placement")}
          </Link>
          <Link className={styles.secondaryButton} href={localizedPath(locale, "/how-it-works")}>{isFa ? "چرخه Endoora" : "How Endoora works"}</Link>
        </div>
      </section>

      {isPricing ? (
        <section className={styles.planSection}>
          <div>
            <span className={styles.kicker}>Premium</span>
            <h2>{isFa ? "پیشنهاد فعلی عرضه" : "Current launch offer"}</h2>
            <p>{isFa ? "این مقدار فقط برای نمایش بازاریابی Day 06 در منبع مرکزی نگهداری می‌شود؛ Day 41 آن را به Plan/Price مدیریتی منتقل می‌کند." : "This value is centralized for Day 06 marketing display only; Day 41 moves it to admin-managed Plan/Price data."}</p>
          </div>
          <div className={styles.priceCard}>
            <strong>{isFa ? LAUNCH_PLAN.displayPriceFa : LAUNCH_PLAN.displayPriceEn}</strong>
            <span>{isFa ? "۹۰ روز" : "90 days"}</span>
            <small>{isFa ? "دسترسی Premium + استفاده عادی نامحدود از AI با سیاست مصرف منصفانه" : "Premium access + unlimited normal-use AI under a fair-use policy"}</small>
          </div>
        </section>
      ) : null}

      <section className={styles.detailGrid}>
        {copy.sections.map((section) => (
          <article className={styles.detailCard} key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>
    </PublicShell>
  );
}

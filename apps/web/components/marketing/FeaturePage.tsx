import Link from "next/link";
import { PublicShell } from "./PublicShell";
import { featurePages, localizedPath, type FeatureKey, type PublicLocale } from "../../lib/public-site";
import styles from "./marketing.module.css";

export function FeaturePage({ locale, featureKey }: { locale: PublicLocale; featureKey: FeatureKey }) {
  const copy = featurePages[featureKey][locale];
  const isFa = locale === "fa";
  const path = `/features/${featureKey}`;
  return (
    <PublicShell locale={locale} currentPath={path}>
      <section className={styles.pageHero}>
        <span className={styles.badge}>{copy.eyebrow}</span>
        <h1>{copy.title}</h1>
        <p>{copy.summary}</p>
        <div className={styles.heroActions}>
          <Link className={styles.primaryButton} href={localizedPath(locale, "/#waitlist")}>{isFa ? "خبرم کن" : "Join early access"}</Link>
          <Link className={styles.secondaryButton} href={localizedPath(locale, "/how-it-works")}>{isFa ? "چرخه کامل" : "See the full loop"}</Link>
        </div>
      </section>
      <section className={styles.detailGrid}>
        {copy.sections.map((section) => (
          <article className={styles.detailCard} key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>
      <aside className={styles.limitBox}>
        <strong>{isFa ? "وضعیت قابلیت" : "Feature status"}</strong>
        <p>{isFa ? "این صفحه توضیح محصول Day 06 است. پیاده‌سازی عملی هر قابلیت در روزهای مشخص‌شده roadmap تکمیل و آزمایش می‌شود." : "This is the Day 06 public product description. Functional implementation is completed and tested on the roadmap day that owns the feature."}</p>
      </aside>
    </PublicShell>
  );
}

import { PublicShell } from "./PublicShell";
import { legalPages, type LegalKey, type PublicLocale } from "../../lib/public-site";
import styles from "./marketing.module.css";

export function LegalPage({ locale, legalKey }: { locale: PublicLocale; legalKey: LegalKey }) {
  const copy = legalPages[legalKey][locale];
  const path = `/legal/${legalKey}`;
  return (
    <PublicShell locale={locale} currentPath={path}>
      <section className={styles.pageHero}>
        <span className={styles.draftBadge}>{copy.eyebrow}</span>
        <h1>{copy.title}</h1>
        <p>{copy.summary}</p>
      </section>
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

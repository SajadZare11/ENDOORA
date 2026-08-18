import Link from "next/link";
import { AnalyticsConsent } from "./AnalyticsConsent";
import { PublicShell } from "./PublicShell";
import { WaitlistForm } from "./WaitlistForm";
import {
  featurePages,
  homeCopy,
  LAUNCH_PLAN,
  localizedPath,
  type FeatureKey,
  type PublicLocale,
} from "../../lib/public-site";
import styles from "./marketing.module.css";

const featureOrder: FeatureKey[] = [
  "learner-twin",
  "daily-mission",
  "mistake-genome",
  "writing-mentor",
  "roleplay-voice",
  "teachers-classes",
  "ielts-practice",
  "premium",
];

export function HomePage({ locale }: { locale: PublicLocale }) {
  const copy = homeCopy[locale];
  const isFa = locale === "fa";
  const currentPath = "/";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Endoora",
    url: "https://endoora.ir",
    inLanguage: ["fa-IR", "en"],
    description: isFa
      ? "سیستم یادگیری انگلیسی فارسی‌محور برای زبان‌آموزان ایران."
      : "A Persian-first English learning system for Iranian learners.",
  };

  return (
    <PublicShell locale={locale} currentPath={currentPath}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker} dir="ltr">Endoora · A new door to your English</span>
          <h1>{copy.heroTitle}</h1>
          <p>{copy.heroSummary}</p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryButton} href={localizedPath(locale, "/placement")}>{copy.placementCta}</Link>
            <a className={styles.secondaryButton} href="#waitlist">{copy.startCta}</a>
          </div>
          <div className={styles.heroTrust}>
            <strong>{copy.trustTitle}</strong>
            <span>{copy.trustBody}</span>
          </div>
        </div>
        <div className={styles.heroPanel} aria-label={copy.loopTitle}>
          <span className={styles.panelLabel}>{copy.loopTitle}</span>
          <ol className={styles.loopList}>
            {copy.loopSteps.map((step, index) => (
              <li key={step}><span>{index + 1}</span>{step}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="feature-heading">
        <div className={styles.sectionHeading}>
          <span className={styles.kicker}>{isFa ? "چرخه متصل" : "Connected loop"}</span>
          <h2 id="feature-heading">{copy.featureTitle}</h2>
        </div>
        <div className={styles.featureGrid}>
          {featureOrder.map((key) => {
            const item = featurePages[key][locale];
            return (
              <article key={key} className={styles.featureCard}>
                <span className={styles.badge}>{item.eyebrow}</span>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <Link href={localizedPath(locale, `/features/${key}`)}>{isFa ? "جزئیات قابلیت" : "Feature details"}</Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.planSection} aria-labelledby="plan-heading">
        <div>
          <span className={styles.kicker}>Premium</span>
          <h2 id="plan-heading">{isFa ? "برنامه عرضه ساده و قابل فهم" : "A simple launch plan"}</h2>
          <p>{isFa ? "قیمت در یک منبع مرکزی نگهداری می‌شود و در Day 41 به داده مدیریتی قابل تغییر منتقل خواهد شد." : "Price copy is centralized now and moves to admin-managed plan data on Day 41."}</p>
        </div>
        <div className={styles.priceCard}>
          <strong dir={isFa ? "rtl" : "ltr"}>{isFa ? LAUNCH_PLAN.displayPriceFa : LAUNCH_PLAN.displayPriceEn}</strong>
          <span>{isFa ? `${LAUNCH_PLAN.durationDays} روز Premium` : `${LAUNCH_PLAN.durationDays} days Premium`}</span>
          <small>{isFa ? LAUNCH_PLAN.noteFa : LAUNCH_PLAN.noteEn}</small>
          <Link href={localizedPath(locale, "/pricing")}>{isFa ? "جزئیات قیمت" : "Pricing details"}</Link>
        </div>
      </section>

      <section id="waitlist" className={styles.waitlist} aria-labelledby="waitlist-heading">
        <div>
          <span className={styles.kicker}>{isFa ? "پیش‌راه‌اندازی" : "Prelaunch"}</span>
          <h2 id="waitlist-heading">{copy.waitlistTitle}</h2>
          <p>{copy.waitlistBody}</p>
        </div>
        <WaitlistForm locale={locale} source="home" />
      </section>

      <AnalyticsConsent locale={locale} />
    </PublicShell>
  );
}

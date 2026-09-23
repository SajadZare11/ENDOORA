import Link from "next/link";
import { PublicShell } from "./PublicShell";
import {
  featureKeys,
  featurePages,
  localizedPath,
  type PublicLocale,
} from "../../lib/public-site";
import styles from "./marketing.module.css";

export function FeaturesCatalog({ locale }: { locale: PublicLocale }) {
  const isFa = locale === "fa";
  return (
    <PublicShell locale={locale} currentPath="/features">
      <section className={styles.pageHero}>
        <span className={styles.badge}>
          {isFa ? "معماری و قابلیت‌های Endoora" : "Endoora Architecture & Capabilities"}
        </span>
        <h1>
          {isFa
            ? "امکانات نوآورانه یادگیری متصل"
            : "Connected Learning Capabilities"}
        </h1>
        <p>
          {isFa
            ? "تمامی بخش‌های پلتفرم Endoora بر پایه شواهد آموزشی، مدل شناختی یادگیرنده و اتصال به تمرین روزانه، مدرس و سنجش استاندارد توسعه یافته‌اند."
            : "Every Endoora module is grounded in inspectable learning evidence, learner agency, daily practice, teacher collaboration, and standard-aligned assessment."}
        </p>
        <div className={styles.heroActions}>
          <Link
            className={styles.primaryButton}
            href={localizedPath(locale, "/placement")}
          >
            {isFa ? "شروع تعیین سطح" : "Start placement"}
          </Link>
          <Link
            className={styles.secondaryButton}
            href={localizedPath(locale, "/how-it-works")}
          >
            {isFa ? "چرخه کامل یادگیری" : "See the full loop"}
          </Link>
        </div>
      </section>

      <section className={styles.detailGrid}>
        {featureKeys.map((key) => {
          const page = featurePages[key][locale];
          return (
            <article className={styles.detailCard} key={key}>
              <span className={styles.badge} style={{ marginBlockEnd: "var(--space-3)" }}>
                {page.eyebrow}
              </span>
              <h2>{page.title}</h2>
              <p>{page.summary}</p>
              <div style={{ marginBlockStart: "var(--space-4)" }}>
                <Link
                  className={styles.textLink}
                  href={localizedPath(locale, `/features/${key}`)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--space-1)",
                    color: "var(--color-action)",
                    fontWeight: 700,
                    fontSize: "var(--font-size-sm)",
                    textDecoration: "none",
                  }}
                >
                  {isFa ? "بررسی و جزئیات معماری ➔" : "Explore feature details ➔"}
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <aside className={styles.limitBox}>
        <strong>
          {isFa
            ? "استاندارد کیفیت و شفافیت شواهد آموزشی"
            : "Quality and Evidence Standards"}
        </strong>
        <p>
          {isFa
            ? "در Endoora هیچ نمره، پیش‌بینی یا تشخیصی بدون شواهد کافی ثبت نمی‌شود. زبان‌آموز و مدرس کنترل کامل بر داده‌های آموزشی و مسیر پیشرفت دارند."
            : "In Endoora, no score, prediction, or diagnosis is stored without verifiable evidence. Learners and teachers retain full inspectability and control over learning data."}
        </p>
      </aside>
    </PublicShell>
  );
}

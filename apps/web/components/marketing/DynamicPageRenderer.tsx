"use client";

import React from "react";
import Link from "next/link";
import styles from "./dynamic-page.module.css";
import { CustomDynamicPage, PageBlock } from "../../lib/admin-site-builder-store";

export function DynamicPageRenderer({
  page,
  locale = "fa",
}: {
  page: CustomDynamicPage;
  locale?: "fa" | "en";
}) {
  const isFa = locale === "fa";
  const sortedBlocks = [...page.blocks]
    .filter((b) => b.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <div className={styles.pageWrapper} dir={isFa ? "rtl" : "ltr"}>
      {sortedBlocks.map((b) => (
        <React.Fragment key={b.id}>{renderBlock(b, isFa)}</React.Fragment>
      ))}
    </div>
  );
}

function renderBlock(blockWrapper: PageBlock, isFa: boolean) {
  const { block } = blockWrapper;

  switch (block.type) {
    case "hero": {
      const { data } = block;
      return (
        <section
          className={styles.heroSection}
          style={{
            background:
              data.bgGradient ||
              "linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)",
          }}
        >
          {(data.badgeFa || data.badgeEn) && (
            <span className={styles.heroBadge}>
              {isFa ? data.badgeFa || data.badgeEn : data.badgeEn || data.badgeFa}
            </span>
          )}
          <h1 className={styles.heroHeadline}>
            {isFa ? data.headlineFa : data.headlineEn || data.headlineFa}
          </h1>
          <p className={styles.heroSubheadline}>
            {isFa ? data.subheadlineFa : data.subheadlineEn || data.subheadlineFa}
          </p>
          <div className={styles.heroActions}>
            <Link href={data.primaryCtaUrl} className={styles.btnPrimary}>
              {isFa ? data.primaryCtaTextFa : data.primaryCtaTextEn || data.primaryCtaTextFa}
            </Link>
            {data.secondaryCtaUrl && (
              <Link href={data.secondaryCtaUrl} className={styles.btnSecondary}>
                {isFa
                  ? data.secondaryCtaTextFa || "اطلاعات بیشتر"
                  : data.secondaryCtaTextEn || "Learn More"}
              </Link>
            )}
          </div>
        </section>
      );
    }

    case "features": {
      const { data } = block;
      return (
        <section className={styles.featuresSection}>
          <div className={styles.sectionHeader}>
            <h2>{isFa ? data.headlineFa : data.headlineEn || data.headlineFa}</h2>
            {(data.subheadlineFa || data.subheadlineEn) && (
              <p>{isFa ? data.subheadlineFa : data.subheadlineEn || data.subheadlineFa}</p>
            )}
          </div>
          <div className={styles.featuresGrid}>
            {data.features.map((feat, idx) => (
              <article key={idx} className={styles.featureCard}>
                <div className={styles.featureIconWrap}>{feat.icon}</div>
                {feat.badgeText && <span className={styles.featureBadge}>{feat.badgeText}</span>}
                <h3>{isFa ? feat.titleFa : feat.titleEn || feat.titleFa}</h3>
                <p>{isFa ? feat.descriptionFa : feat.descriptionEn || feat.descriptionFa}</p>
              </article>
            ))}
          </div>
        </section>
      );
    }

    case "video": {
      const { data } = block;
      return (
        <section className={styles.videoSection}>
          <div className={styles.sectionHeader}>
            <h2>{isFa ? data.headlineFa : data.headlineEn || data.headlineFa}</h2>
            {(data.descriptionFa || data.descriptionEn) && (
              <p>{isFa ? data.descriptionFa : data.descriptionEn || data.descriptionFa}</p>
            )}
          </div>
          <video
            controls
            className={styles.videoPlayer}
            src={data.videoUrl}
            poster={data.posterUrl}
          >
            مرورگر شما از تگ ویدیو پشتیبانی نمی‌کند.
          </video>
          {(data.transcriptSampleFa || data.transcriptSampleEn) && (
            <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <strong style={{ fontSize: "0.85rem", color: "#334155" }}>
                {isFa ? "خلاصه پیاده‌سازی و زیرنویس:" : "Transcript Sample:"}
              </strong>
              <p style={{ margin: "0.4rem 0 0", fontSize: "0.82rem", color: "#64748b" }}>
                {isFa ? data.transcriptSampleFa : data.transcriptSampleEn || data.transcriptSampleFa}
              </p>
            </div>
          )}
          {data.downloadUrl && (
            <div style={{ alignSelf: "flex-start" }}>
              <a
                href={data.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.btnPrimary}
                style={{ fontSize: "0.85rem", padding: "0.55rem 1.15rem" }}
              >
                📥 {data.downloadLabel || (isFa ? "دانلود فایل مکمل" : "Download Resource")}
              </a>
            </div>
          )}
        </section>
      );
    }

    case "pricing": {
      const { data } = block;
      return (
        <section className={styles.pricingSection}>
          <div className={styles.sectionHeader} style={{ textAlign: "center" }}>
            <h2>{isFa ? data.headlineFa : data.headlineEn || data.headlineFa}</h2>
            {(data.subheadlineFa || data.subheadlineEn) && (
              <p>{isFa ? data.subheadlineFa : data.subheadlineEn || data.subheadlineFa}</p>
            )}
          </div>
          <div className={styles.pricingGrid}>
            {data.plans.map((plan, idx) => (
              <div
                key={idx}
                className={`${styles.pricingCard} ${plan.isPopular ? styles.popularCard : ""}`}
              >
                {plan.isPopular && (
                  <span className={styles.popularBadge}>
                    {isFa ? "پیشنهاد محبوب" : "Most Popular"}
                  </span>
                )}
                <div>
                  <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.2rem", fontWeight: "800" }}>
                    {isFa ? plan.nameFa : plan.nameEn || plan.nameFa}
                  </h3>
                  <div className={styles.planPriceRow}>
                    <span className={styles.priceNumber}>
                      {plan.priceToman.toLocaleString(isFa ? "fa-IR" : "en-US")}
                    </span>
                    <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                      {isFa ? "تومان" : "Toman"} / {isFa ? plan.periodTextFa : plan.periodTextEn}
                    </span>
                  </div>
                </div>

                <ul className={styles.bulletList}>
                  {(isFa ? plan.featuresFa : plan.featuresEn || plan.featuresFa).map((f, fIdx) => (
                    <li key={fIdx} className={styles.bulletItem}>
                      <span style={{ color: "#16a34a", fontWeight: "bold" }}>✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaUrl}
                  className={styles.btnPrimary}
                  style={{ textAlign: "center", marginTop: "auto" }}
                >
                  {isFa ? plan.ctaTextFa : plan.ctaTextEn || plan.ctaTextFa}
                </Link>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "testimonials": {
      const { data } = block;
      return (
        <section className={styles.featuresSection}>
          <div className={styles.sectionHeader}>
            <h2>{isFa ? data.headlineFa : data.headlineEn || data.headlineFa}</h2>
          </div>
          <div className={styles.testimonialsGrid}>
            {data.testimonials.map((t, idx) => (
              <div key={idx} className={styles.testimonialCard}>
                <p style={{ margin: 0, fontSize: "0.92rem", color: "#334155", fontStyle: "italic", lineHeight: "1.6" }}>
                  “{isFa ? t.quoteFa : t.quoteEn || t.quoteFa}”
                </p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.avatar}>{t.avatar}</div>
                  <div>
                    <strong style={{ fontSize: "0.95rem", color: "#0f172a", display: "block" }}>
                      {isFa ? t.nameFa : t.nameEn || t.nameFa}
                    </strong>
                    <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                      {isFa ? t.roleFa : t.roleEn || t.roleFa}
                    </span>
                  </div>
                  {t.cefrScoreBadge && (
                    <span
                      style={{
                        marginRight: "auto",
                        background: "#dcfce7",
                        color: "#15803d",
                        fontSize: "0.75rem",
                        padding: "0.2rem 0.55rem",
                        borderRadius: "6px",
                        fontWeight: "bold",
                      }}
                    >
                      {t.cefrScoreBadge}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "faq": {
      const { data } = block;
      return (
        <section className={styles.faqSection}>
          <div className={styles.sectionHeader} style={{ textAlign: "center" }}>
            <h2>{isFa ? data.headlineFa : data.headlineEn || data.headlineFa}</h2>
          </div>
          {data.items.map((item, idx) => (
            <div key={idx} className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>
                {isFa ? item.questionFa : item.questionEn || item.questionFa}
              </h3>
              <p className={styles.faqAnswer}>
                {isFa ? item.answerFa : item.answerEn || item.answerFa}
              </p>
            </div>
          ))}
        </section>
      );
    }

    case "custom_html": {
      const { data } = block;
      return (
        <div
          className={data.containerClass || ""}
          dangerouslySetInnerHTML={{ __html: data.rawHtml }}
        />
      );
    }

    default:
      return null;
  }
}

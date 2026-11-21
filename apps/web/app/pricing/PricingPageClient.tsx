"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./pricing.module.css";

import { fetchPublicPricingPlans } from "../../lib/marketplace";

interface PlanOption {
  code: string;
  name: string;
  durationLabel: string;
  durationDays: number;
  priceNumber: number;
  priceFormatted: string;
  monthlyEquivalent: string;
  discountBadge?: string;
  isPopular?: boolean;
  isBestValue?: boolean;
}



interface FeatureRow {
  name: string;
  subDesc?: string;
  freeValue: string;
  freeGranted: boolean;
  goldenValue: string;
  goldenGranted: boolean;
}

interface FeatureCategory {
  categoryName: string;
  rows: FeatureRow[];
}

const COMPARISON_DATA: FeatureCategory[] = [
  {
    categoryName: "بخش زبان دبیرستان و نهایی",
    rows: [
      {
        name: "پایه‌های دهم، یازدهم و دوازدهم",
        subDesc: "گرامر، واژگان، ریدینگ و تحلیل خط به خط کتاب‌های Vision",
        freeValue: "فقط درس‌های اول هر پایه",
        freeGranted: true,
        goldenValue: "دسترسی کامل به تمامی درس‌ها و پایه‌ها",
        goldenGranted: true,
      },
      {
        name: "تمرین تا بیست (امتحانات نهایی)",
        subDesc: "بانک نمونه سوالات تشریحی، شنیداری، واژگان و درک مطلب نهایی دوازدهم",
        freeValue: "فقط درس اول",
        freeGranted: true,
        goldenValue: "دسترسی کامل به تمامی درس‌ها و آزمون‌ها",
        goldenGranted: true,
      },
    ],
  },
  {
    categoryName: "مهارت‌ها، دوره‌ها و آیلتس",
    rows: [
      {
        name: "مهارت‌های استاندارد CEFR",
        subDesc: "تقویت جامع مهارت‌های شنیداری، گفتاری، خواندن و نگارش",
        freeValue: "فقط سطح مقدماتی A1",
        freeGranted: true,
        goldenValue: "تمامی سطوح از A1 تا C2 به طور نامحدود",
        goldenGranted: true,
      },
      {
        name: "دوره‌های جامع ویدیویی",
        subDesc: "مجموعه‌های Speakout، American English File و دوره‌های مکالمه واقعی",
        freeValue: "عدم دسترسی",
        freeGranted: false,
        goldenValue: "دسترسی کامل به تمامی جلسات و زیرنویس‌های همزمان",
        goldenGranted: true,
      },
      {
        name: "بخش تخصصی و شبیه‌ساز آیلتس (IELTS)",
        subDesc: "تمرین‌های آموزشی با شاهد و توضیح فارسی",
        freeValue: "تمرین‌های منتشرشده",
        freeGranted: true,
        goldenValue: "تمرین‌های منتشرشده",
        goldenGranted: true,
      },
    ],
  },
  {
    categoryName: "سیستم‌های هوشمند و مدرسین",
    rows: [
      {
        name: "سیستم یادگیری و جعبه لایتنر هوشمند",
        subDesc: "مرور با فواصل زمانی علمی (Spaced Repetition) و واژگان شخصی‌سازی شده",
        freeValue: "عدم دسترسی",
        freeGranted: false,
        goldenValue: "دسترسی کامل بدون سقف فلش‌کارت و مرور روزانه",
        goldenGranted: true,
      },
      {
        name: "مدرس‌ها و کلاس‌های اختصاصی",
        subDesc: "امکان مشاهده تقویم، کلاس‌های گروهی و رزرو جلسات با اساتید تاییدشده",
        freeValue: "عدم دسترسی",
        freeGranted: false,
        goldenValue: "دسترسی کامل به جامعه اساتید و تخفیف جلسات",
        goldenGranted: true,
      },
      {
        name: "پشتیبانی و همراهی آموزشی",
        subDesc: "پاسخگویی به سوالات آموزشی و راهنمایی فنی پلتفرم",
        freeValue: "پشتیبانی استاندارد تیکتی",
        freeGranted: true,
        goldenValue: "پشتیبانی اختصاصی و اولویت‌دار",
        goldenGranted: true,
      },
    ],
  },
];

export function PricingPageClient() {
  // Default selected plan is 3-month (index 1)
  const [selectedPeriodCode, setSelectedPeriodCode] = useState<string>("golden_3m");

  const [catalog, setCatalog] = useState<{plans: PlanOption[]; open: boolean} | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let mounted = true;
    fetchPublicPricingPlans().then(data => {
      if (!mounted) return;
      const plans = data.plans.map(p => ({
        code: p.code, name: p.name_fa, durationLabel: p.duration_days.toLocaleString("fa-IR")+" روز",
        durationDays: p.duration_days, priceNumber: p.price_toman_number,
        priceFormatted: p.price_toman_number.toLocaleString("fa-IR"),
        monthlyEquivalent: Math.round(p.price_toman_number*30/Math.max(1,p.duration_days)).toLocaleString("fa-IR")+" تومان در ۳۰ روز",
      }));
      setCatalog({plans, open: data.subscription_sales_open});
    }).catch(() => { if (mounted) setFailed(true); });
    return () => { mounted = false; };
  }, []);
  if (!catalog || !catalog.plans.length) return <main dir="rtl" className={styles.hero}><h1>اشتراک‌های ایندورا</h1><p role="status">{failed ? "دریافت قیمت‌ها ممکن نشد. صفحه را دوباره باز کنید." : catalog ? "پلنی برای فروش منتشر نشده است." : "در حال دریافت قیمت‌ها…"}</p></main>;
  const currentGolden = catalog.plans.find(p => p.code === selectedPeriodCode) ?? catalog.plans[0];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero} aria-labelledby="pricing-heading">
        <div className={styles.kicker}>
          <span className={styles.kickerIcon}>✨</span>
          <span>طرح‌های شفاف عضویت ایندورا</span>
        </div>
        <h1 id="pricing-heading" className={styles.title}>
          سرمایه‌گذاری روی یادگیری زبان؛{" "}
          <span className={styles.titleHighlight}>منعطف، قدرتمند و بدون مرز</span>
        </h1>
        <p className={styles.subtitle}>
          از مباحث پایه و زبان دبیرستان به شکل کاملاً رایگان شروع کنید، یا با تهیه اشتراک طلایی
          به کل اقیانوس آموزشی ایندورا دسترسی نامحدود پیدا کنید.
        </p>
      </section>

      {/* Switcher / Segmented Tabs for Golden Plan Durations */}
      <div className={styles.switcherWrap}>
        <span className={styles.switcherLabel}>
          <span>مدت زمان اشتراک طلایی را انتخاب کنید:</span>
        </span>
        <div className={styles.segmentedControl} role="tablist" aria-label="مدت زمان اشتراک طلایی">
          {catalog.plans.map((period) => {
            const isActive = period.code === currentGolden.code;
            return (
              <button
                key={period.code}
                role="tab"
                aria-selected={isActive}
                className={`${styles.segmentBtn} ${isActive ? styles.segmentBtnActive : ""}`}
                onClick={() => setSelectedPeriodCode(period.code)}
              >
                <span>{period.durationLabel}</span>
                {period.discountBadge ? (
                  <span
                    className={`${styles.segmentBadge} ${
                      period.isPopular ? styles.segmentBadgeHot : ""
                    }`}
                  >
                    {period.discountBadge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Pricing Cards: Free vs Golden */}
      <section className={styles.cardsGrid} aria-label="کارت‌های اشتراک">
        {/* 1. Free Plan Card */}
        <article className={`${styles.planCard} ${styles.freeCard}`}>
          <div className={styles.freeCardHeader}>
            <div className={styles.planTypeRow}>
              <h2 className={styles.planName}>پلن رایگان</h2>
              <span className={styles.planDurationBadge}>همیشگی</span>
            </div>
            <p className={styles.planDesc}>
              مناسب شروع یادگیری، ارزیابی سطح زبان و دسترسی به نمونه دروس پایه‌های دبیرستان.
            </p>
            <div className={styles.priceBlock}>
              <span className={styles.priceAmount}>۰</span>
              <span className={styles.priceUnit}>تومان</span>
              <span className={styles.pricePeriod}>/ برای همیشه</span>
            </div>
            <div className={styles.perMonthNote} style={{ color: "#64748b" }}>
              بدون نیاز به ثبت کارت بانکی
            </div>
          </div>

          <ul className={styles.cardFeatures}>
            <li className={styles.featureItem}>
              <svg
                className={styles.featureIconGranted}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>
                دسترسی به <strong>درس اول</strong> پایه‌های دهم، یازدهم و دوازدهم (زبان دبیرستان)
              </span>
            </li>
            <li className={styles.featureItem}>
              <svg
                className={styles.featureIconGranted}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>
                دسترسی به <strong>درس اول</strong> بخش «تمرین تا بیست» (امتحانات نهایی دوازدهم)
              </span>
            </li>
            <li className={styles.featureItem}>
              <svg
                className={styles.featureIconGranted}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>دسترسی به سطح <strong>A1</strong> از مهارت‌های آموزشی پلتفرم</span>
            </li>
            <li className={styles.featureItem}>
              <svg
                className={styles.featureIconDenied}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span className={styles.featureItemDenied}>دسترسی به مدرس‌ها و کلاس‌های اختصاصی</span>
            </li>
            <li className={styles.featureItem}>
              <svg
                className={styles.featureIconDenied}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span className={styles.featureItemDenied}>سیستم یادگیری و جعبه لایتنر هوشمند</span>
            </li>
            <li className={styles.featureItem}>
              <svg
                className={styles.featureIconDenied}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span className={styles.featureItemDenied}>دوره‌های جامع ویدیویی (Speakout و AEF)</span>
            </li>
            <li className={styles.featureItem}>
              <svg
                className={styles.featureIconDenied}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span className={styles.featureItemDenied}>بخش تخصصی و شبیه‌ساز آزمون آیلتس (IELTS)</span>
            </li>
          </ul>

          <Link href="/placement" className={`${styles.ctaBtn} ${styles.freeCta}`}>
            شروع رایگان با آزمون تعیین سطح
          </Link>
        </article>

        {/* 2. Golden Plan Card */}
        <article className={`${styles.planCard} ${styles.goldenCard}`}>
          {currentGolden.isPopular ? (
            <div className={styles.featuredBadge}>
              <span>🔥</span>
              <span>محبوب‌ترین و پیشنهاد ویژه</span>
            </div>
          ) : currentGolden.isBestValue ? (
            <div className={styles.featuredBadge} style={{ background: "linear-gradient(135deg, #059669 0%, #047857 100%)" }}>
              <span>💎</span>
              <span>بیشترین صرفه اقتصادی</span>
            </div>
          ) : null}

          <div className={styles.cardHeader}>
            <div className={styles.planTypeRow}>
              <h2 className={`${styles.planName} ${styles.goldenName}`}>
                <span>👑</span>
                <span>اشتراک طلایی</span>
              </h2>
              <span className={`${styles.planDurationBadge} ${styles.goldenDurationBadge}`}>
                {currentGolden.durationLabel}
              </span>
            </div>
            <p className={styles.planDesc}>
              دسترسی آزاد و نامحدود به تمامی دروس دبیرستان، ویدیوها، آزمون‌ها، مهارت‌ها و ابزارهای
              هوشمند ایندورا.
            </p>
            <div className={styles.priceBlock}>
              <span className={`${styles.priceAmount} ${styles.goldenPriceAmount}`}>
                {currentGolden.priceFormatted}
              </span>
              <span className={styles.priceUnit}>تومان</span>
              <span className={styles.pricePeriod}>/ {currentGolden.durationDays} روز دسترسی کامل</span>
            </div>
            <div className={styles.perMonthNote}>
              <span>✓</span>
              <span>{currentGolden.monthlyEquivalent}</span>
            </div>
          </div>

          <ul className={styles.cardFeatures}>
            <li className={styles.featureItem}>
              <svg
                className={styles.featureIconGranted}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>
                <strong>دسترسی آزاد و نامحدود به همه موارد سایت</strong>
              </span>
            </li>
            <li className={styles.featureItem}>
              <svg
                className={styles.featureIconGranted}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>
                دسترسی کامل به تمام درس‌های پایه‌های <strong>دهم، یازدهم و دوازدهم</strong> دبیرستان
              </span>
            </li>
            <li className={styles.featureItem}>
              <svg
                className={styles.featureIconGranted}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>
                دسترسی کامل به تمامی مباحث، آزمون‌ها و مهارت‌های <strong>تمرین تا بیست</strong>
              </span>
            </li>
            <li className={styles.featureItem}>
              <svg
                className={styles.featureIconGranted}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>دسترسی به بخش <strong>مدرس‌ها و امکان رزرو کلاس‌های اختصاصی</strong></span>
            </li>
            <li className={styles.featureItem}>
              <svg
                className={styles.featureIconGranted}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>دسترسی نامحدود به تمامی سطوح مهارت‌ها (از <strong>A1 تا C2</strong>)</span>
            </li>
            <li className={styles.featureItem}>
              <svg
                className={styles.featureIconGranted}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>دسترسی به بخش <strong>یادگیری، جعبه لایتنر هوشمند و دایره واژگان</strong></span>
            </li>
            <li className={styles.featureItem}>
              <svg
                className={styles.featureIconGranted}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>
                دسترسی کامل به <strong>دوره‌های ویدیویی</strong> (Speakout، American English File و...)
              </span>
            </li>
            <li className={styles.featureItem}>
              <svg
                className={styles.featureIconGranted}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>
                دسترسی کامل به <strong>شبیه‌ساز و آزمون‌های تخصصی آیلتس (IELTS)</strong>
              </span>
            </li>
          </ul>

          {catalog.open ? <Link
            href={`/checkout?order_type=subscription_plan&plan_id=${currentGolden.code}&amount=${currentGolden.priceNumber}`}
            className={`${styles.ctaBtn} ${styles.goldenCta}`}
          >
            تهیه اشتراک طلایی ({currentGolden.priceFormatted} تومان)
          </Link> : <p>فروش اشتراک فعلاً بسته است. <Link href="/ielts">تمرین‌های رایگان آیلتس</Link></p>}
        </article>
      </section>

      {/* Feature Matrix Table */}
      <section className={styles.tableSection} aria-labelledby="matrix-title">
        <div className={styles.tableHeader}>
          <h2 id="matrix-title" className={styles.tableTitle}>
            جدول مقایسه دقیق امکانات و دسترسی‌ها
          </h2>
          <p className={styles.tableSubtitle}>
            ریز جزئیات تفاوت دسترسی پلن رایگان و پلن طلایی در تمامی بخش‌های وب‌سایت
          </p>
        </div>

        <div className={styles.tableScrollWrap}>
          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th scope="col">قابلیت‌ها و بخش‌های پلتفرم</th>
                <th scope="col">پلن رایگان</th>
                <th scope="col" className={styles.goldenTh}>
                  پلن طلایی ({currentGolden.durationLabel})
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_DATA.map((cat) => (
                <React.Fragment key={cat.categoryName}>
                  <tr className={styles.categoryRow}>
                    <td colSpan={3} className={styles.categoryCell}>
                      {cat.categoryName}
                    </td>
                  </tr>
                  {cat.rows.map((row) => (
                    <tr key={row.name}>
                      <td className={styles.featureNameCell}>
                        {row.name}
                        {row.subDesc ? (
                          <span className={styles.featureSubDesc}>{row.subDesc}</span>
                        ) : null}
                      </td>
                      <td className={styles.valueCell}>
                        {row.freeGranted ? (
                          <span className={styles.checkBadge}>
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>{row.freeValue}</span>
                          </span>
                        ) : (
                          <span className={styles.crossBadge}>
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                            <span>{row.freeValue}</span>
                          </span>
                        )}
                      </td>
                      <td className={`${styles.valueCell} ${styles.goldenValueCell}`}>
                        <span className={styles.checkBadge} style={{ color: "#b45309" }}>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>{row.goldenValue}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Assurance / Support Box */}
      <aside className={styles.bottomAssistance} aria-label="راهنمایی و پشتیبانی">
        <div className={styles.assistanceText}>
          <h3 className={styles.assistanceTitle}>نیاز به راهنمایی بیشتر یا مشاوره دارید؟</h3>
          <p className={styles.assistanceDesc}>
            تیم پشتیبانی ایندورا در تمامی مراحل انتخاب پلن، تعیین سطح یا خرید اشتراک در کنار شماست.
            همچنین فعال‌سازی اشتراک طلایی بلافاصله پس از پرداخت به شکل آنی انجام می‌پذیرد.
          </p>
        </div>
        <div className={styles.assistanceAction}>
          <Link href="/support" className={styles.supportLink}>
            <span>ارتباط با پشتیبانی</span>
            <span aria-hidden="true">←</span>
          </Link>
        </div>
      </aside>
    </div>
  );
}

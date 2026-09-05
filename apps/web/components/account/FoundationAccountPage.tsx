"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AuthShell } from "../auth/AuthShell";
import {
  apiErrorMessages,
  endooraApi,
  persistPreferredLocale,
  type EndooraLocale,
} from "../../lib/endoora-api";
import styles from "./foundation-account-page.module.css";

type Section =
  | "library"
  | "usage"
  | "plan"
  | "billing";

type AccountMe = {
  id: string;
  email: string;
  preferred_locale: EndooraLocale;
};

type Props = {
  section: Section;
};

const copy = {
  fa: {
    loading: "در حال بارگذاری حساب…",
    errorTitle: "امکان بارگذاری این بخش وجود نداشت.",
    signIn: "ورود",
    back: "بازگشت به حساب کاربری",
    account: "حساب",
    status: "زیرساخت آماده",

    foundation:
      "این بخش در ساختار واقعی حساب Endoora قرار گرفته است، اما قابلیت‌های کامل آن در روزهای بعدی نقشه راه ساخته می‌شوند.",

    sections: {
      library: {
        title: "کتابخانه",
        description:
          "محتوای ذخیره‌شده، درس‌ها و منابع شخصی زبان‌آموز در این بخش مدیریت خواهند شد.",
      },

      usage: {
        title: "مصرف و استفاده",
        description:
          "مصرف قابلیت‌ها، محدودیت‌ها و اطلاعات استفاده از خدمات Endoora در این بخش نمایش داده خواهند شد.",
      },

      plan: {
        title: "پلن",
        description:
          "پلن حساب، سطح دسترسی و قابلیت‌های مرتبط با اشتراک در این بخش مدیریت خواهند شد.",
      },

      billing: {
        title: "پرداخت و صورتحساب",
        description:
          "پرداخت‌ها، صورتحساب‌ها و سوابق مالی مرتبط با حساب در این بخش قرار خواهند گرفت.",
      },
    },
  },

  en: {
    loading: "Loading account…",
    errorTitle: "This account section could not be loaded.",
    signIn: "Sign in",
    back: "Back to account",
    account: "Account",
    status: "Foundation ready",

    foundation:
      "This area is part of the real Endoora account structure, while its full functionality will be implemented on later roadmap days.",

    sections: {
      library: {
        title: "Library",
        description:
          "Saved learning content, lessons and personal resources will be managed here.",
      },

      usage: {
        title: "Usage",
        description:
          "Feature usage, limits and Endoora service consumption will be displayed here.",
      },

      plan: {
        title: "Plan",
        description:
          "Your account plan, access level and subscription-related capabilities will be managed here.",
      },

      billing: {
        title: "Billing",
        description:
          "Payments, invoices and account-related financial history will be available here.",
      },
    },
  },
} as const;

export function FoundationAccountPage({
  section,
}: Props) {
  const [locale, setLocale] =
    useState<EndooraLocale>("fa");

  const [account, setAccount] =
    useState<AccountMe | null>(null);

  const [loading, setLoading] = useState(true);

  const [errors, setErrors] =
    useState<string[]>([]);

  // Subpage state
  const [libraryFilter, setLibraryFilter] = useState<"all" | "lessons" | "vocabulary" | "shadowing">("all");
  const [activePlanSelection, setActivePlanSelection] = useState<"starter" | "pro" | "immersion">("starter");
  const [billingFeedback, setBillingFeedback] = useState<string | null>(null);

  const t = copy[locale];
  const isFa = locale === "fa";
  const sectionCopy = t.sections[section];

  useEffect(() => {
    let cancelled = false;
    let errorLocale: EndooraLocale = "fa";

    endooraApi<AccountMe>("/auth/me/")
      .then((result) => {
        if (cancelled) {
          return;
        }

        const accountLocale: EndooraLocale =
          result.preferred_locale === "en"
            ? "en"
            : "fa";

        errorLocale = accountLocale;

        setLocale(accountLocale);
        setAccount(result);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setErrors(
            apiErrorMessages(
              error,
              errorLocale,
            ),
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLocaleChange(nextLocale: EndooraLocale) {
    const previousLocale = locale;
    setLocale(nextLocale);

    if (!account || nextLocale === previousLocale) {
      return;
    }

    try {
      await persistPreferredLocale(nextLocale);
      setAccount((current) => current ? {
        ...current,
        preferred_locale: nextLocale,
      } : current);
    } catch (error) {
      setLocale(previousLocale);
      setErrors(apiErrorMessages(error, previousLocale));
    }
  }

  if (loading) {
    return (
      <AuthShell
        locale={locale}
        onLocaleChange={setLocale}
        title={sectionCopy.title}
        description={t.loading}
      >
        <div
          className="endoora-status-message"
          role="status"
        >
          {t.loading}
        </div>
      </AuthShell>
    );
  }

  if (!account) {
    return (
      <AuthShell
        locale={locale}
        onLocaleChange={setLocale}
        title={sectionCopy.title}
        description={t.errorTitle}
        footer={
          <Link href="/auth/login">
            {t.signIn}
          </Link>
        }
      >
        <div
          className="endoora-error-summary"
          role="alert"
        >
          <h3>{t.errorTitle}</h3>

          <ul>
            {errors.map((message, index) => (
              <li key={`${message}-${index}`}>
                {message}
              </li>
            ))}
          </ul>
        </div>
      </AuthShell>
    );
  }

  // Mock library items
  const libraryItems = [
    {
      id: "lib-1",
      type: "vocabulary" as const,
      title: isFa ? "تله‌های تداخل زبان مادری (فارسی به انگلیسی): حروف اضافه و افعال دومفعولی" : "Persian L1 Interference: Prepositions & Phrasal Verbs",
      level: "B1",
      meta: isFa ? "۱۴ فلش‌کارت مرور هوشمند • آخرین تمرین ۲ روز پیش" : "14 smart SRS flashcards • Reviewed 2 days ago",
      progress: "85%",
      link: "/review",
      actionLabel: isFa ? "مرور در لایتنر" : "Review Deck",
    },
    {
      id: "lib-2",
      type: "lessons" as const,
      title: isFa ? "رایتینگ آکادمیک آیلتس: انسجام متن و پاراگراف‌نویسی استاندارد" : "IELTS Academic Writing: Task 2 Cohesion & Paragraph Framing",
      level: "B2",
      meta: isFa ? "۶ درس تعاملی • ۴ درس تکمیل شده" : "6 interactive lessons • 4 completed",
      progress: "67%",
      link: "/writing",
      actionLabel: isFa ? "ادامه رایتینگ" : "Resume Lesson",
    },
    {
      id: "lib-3",
      type: "shadowing" as const,
      title: isFa ? "اصطلاحات رایج مکالمه روزمره: سفر، فرودگاه و احوال‌پرسی رسمی" : "Everyday Idioms: Airport, Dining & Formal Greetings",
      level: "A2-B1",
      meta: isFa ? "۲۴ فایل صوتی تلفظ و بازخوانی شادوینگ" : "24 audio clips with phonetic guides",
      progress: "100%",
      link: "/pronunciation",
      actionLabel: isFa ? "تمرین تلفظ" : "Practice Audio",
    },
    {
      id: "lib-4",
      type: "lessons" as const,
      title: isFa ? "ایمیل‌نگاری کاری به انگلیسی: قالب‌های ارتباطی و رعایت لحن محترمانه" : "Workplace English: Email Templates & Professional Tone",
      level: "B1-B2",
      meta: isFa ? "۸ الگوی آماده با تمرین تصحیح خودکار" : "8 business templates with AI critique",
      progress: "50%",
      link: "/practice-ai",
      actionLabel: isFa ? "مشاهده الگوها" : "Open Templates",
    },
  ];

  const filteredLibrary = libraryItems.filter(
    (item) => libraryFilter === "all" || item.type === libraryFilter
  );

  return (
    <AuthShell
      locale={locale}
      onLocaleChange={handleLocaleChange}
      title={sectionCopy.title}
      description={sectionCopy.description}
      footer={
        <Link
          href="/account"
          className={styles.back}
        >
          {t.back}
        </Link>
      }
    >
      <div className={styles.content}>
        {/* Core account metadata banner */}
        <section className={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-2)" }}>
            <span className={styles.status}>
              {t.status}
            </span>
            <div className={styles.email} dir="ltr">
              {account.email}
            </div>
          </div>

          <p className={styles.description}>
            {t.foundation}
          </p>
        </section>

        {/* SECTION: LIBRARY */}
        {section === "library" && (
          <section className={styles.card}>
            <div className={styles.sectionHeading}>
              <h2 style={{ fontSize: "var(--font-size-section-title)", margin: 0 }}>
                {isFa ? "محتوای ذخیره‌شده و درس‌های نشان‌شده" : "Saved Lessons & Collections"}
              </h2>
              <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>
                {filteredLibrary.length} {isFa ? "مورد فعال" : "items available"}
              </span>
            </div>

            {/* Filter Chips */}
            <div className={styles.filterGroup}>
              <button
                type="button"
                className={`${styles.filterChip} ${libraryFilter === "all" ? styles.filterChipActive : ""}`}
                onClick={() => setLibraryFilter("all")}
              >
                {isFa ? "همه موارد" : "All Resources"}
              </button>
              <button
                type="button"
                className={`${styles.filterChip} ${libraryFilter === "vocabulary" ? styles.filterChipActive : ""}`}
                onClick={() => setLibraryFilter("vocabulary")}
              >
                {isFa ? "دسته‌های واژگان (SRS)" : "Vocabulary Decks"}
              </button>
              <button
                type="button"
                className={`${styles.filterChip} ${libraryFilter === "lessons" ? styles.filterChipActive : ""}`}
                onClick={() => setLibraryFilter("lessons")}
              >
                {isFa ? "درس‌ها و رایتینگ" : "Lessons & Writing"}
              </button>
              <button
                type="button"
                className={`${styles.filterChip} ${libraryFilter === "shadowing" ? styles.filterChipActive : ""}`}
                onClick={() => setLibraryFilter("shadowing")}
              >
                {isFa ? "تمرین‌های شادوینگ و تلفظ" : "Shadowing & Audio"}
              </button>
            </div>

            {/* Shelf Grid */}
            <div className={styles.shelfGrid}>
              {filteredLibrary.map((item) => (
                <div key={item.id} className={styles.shelfItem}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlockEnd: "var(--space-2)" }}>
                      <span className={styles.status} style={{ fontSize: "0.75rem", paddingInline: "var(--space-2)", minBlockSize: "1.5rem" }}>
                        CEFR {item.level}
                      </span>
                      <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-action)" }}>
                        {item.progress}
                      </span>
                    </div>
                    <h3 className={styles.itemTitle}>{item.title}</h3>
                    <p className={styles.itemMeta}>{item.meta}</p>
                  </div>

                  <div className={styles.itemFooter}>
                    <Link
                      href={item.link}
                      className={`${styles.actionButton} ${styles.actionButtonPrimary}`}
                      style={{ inlineSize: "100%", textDecoration: "none" }}
                    >
                      {item.actionLabel}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION: USAGE */}
        {section === "usage" && (
          <section className={styles.card}>
            <div className={styles.sectionHeading}>
              <h2 style={{ fontSize: "var(--font-size-section-title)", margin: 0 }}>
                {isFa ? "گزارش مصرف و سهمیه‌های روزانه" : "Daily Quotas & Usage Analytics"}
              </h2>
              <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>
                {isFa ? "به‌روزرسانی خودکار ساعت ۰۰:۰۰" : "Resets daily at 00:00 IRST"}
              </span>
            </div>

            <div className={styles.usageGrid}>
              <div className={styles.meterCard}>
                <div className={styles.meterHeader}>
                  <span>{isFa ? "مکالمه هوش مصنوعی (نقش‌آفرینی)" : "AI Conversational Practice"}</span>
                  <span>42 / 60 {isFa ? "دقیقه" : "min"}</span>
                </div>
                <div className={styles.meterTrack}>
                  <div className={styles.meterFill} style={{ inlineSize: "70%" }} />
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>
                  {isFa ? "۷۰٪ مصرف شده • ۱۸ دقیقه باقی‌مانده" : "70% used • 18 mins remaining"}
                </span>
              </div>

              <div className={styles.meterCard}>
                <div className={styles.meterHeader}>
                  <span>{isFa ? "مرور هوشمند لایتنر (SRS)" : "SRS Flashcard Reviews"}</span>
                  <span>85 / 100 {isFa ? "کارت" : "cards"}</span>
                </div>
                <div className={styles.meterTrack}>
                  <div className={styles.meterFill} style={{ inlineSize: "85%" }} />
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>
                  {isFa ? "۸۵٪ سهمیه روزانه تکمیل شده" : "85% completed for today"}
                </span>
              </div>

              <div className={styles.meterCard}>
                <div className={styles.meterHeader}>
                  <span>{isFa ? "تحلیل رایتینگ و فیدبک هوشمند" : "AI Writing Diagnostic Feedback"}</span>
                  <span>3 / 5 {isFa ? "متن" : "texts"}</span>
                </div>
                <div className={styles.meterTrack}>
                  <div className={styles.meterFill} style={{ inlineSize: "60%" }} />
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>
                  {isFa ? "۶۰٪ مصرف هفتگی • ۲ بررسی باقی‌مانده" : "60% used • 2 submissions left"}
                </span>
              </div>

              <div className={styles.meterCard}>
                <div className={styles.meterHeader}>
                  <span>{isFa ? "فضای صوتی ابری (تلفظ و ضبط)" : "Voice Audio Storage Cache"}</span>
                  <span>18.4 / 100 MB</span>
                </div>
                <div className={styles.meterTrack}>
                  <div className={styles.meterFill} style={{ inlineSize: "18.4%" }} />
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>
                  {isFa ? "۱۸.۴ مگابایت مصرف از ۱۰۰ مگابایت" : "18.4 MB cached out of 100 MB"}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap", marginBlockStart: "var(--space-3)" }}>
              <Link href="/today" className={`${styles.actionButton} ${styles.actionButtonPrimary}`}>
                {isFa ? "ادامه تمرین امروز" : "Continue Today's Practice"}
              </Link>
              <Link href="/progress" className={`${styles.actionButton} ${styles.actionButtonSecondary}`}>
                {isFa ? "مشاهده نمودار پیشرفت ۶ مهارتی" : "View 6-Skill Progress Report"}
              </Link>
            </div>
          </section>
        )}

        {/* SECTION: PLAN */}
        {section === "plan" && (
          <section className={styles.card}>
            <div className={styles.sectionHeading}>
              <div>
                <h2 style={{ fontSize: "var(--font-size-section-title)", margin: 0 }}>
                  {isFa ? "پلن‌های اشتراک و یادگیری اندورا" : "Endoora Learning Plans"}
                </h2>
                <p className={styles.description} style={{ marginBlockStart: "var(--space-1)" }}>
                  {isFa
                    ? "پلن مناسب با ریتم یادگیری خود را انتخاب کنید. امکان تغییر یا لغو اشتراک در هر زمان وجود دارد."
                    : "Choose the plan that fits your study cadence. Upgrade, downgrade, or cancel anytime."}
                </p>
              </div>
              <span className={styles.status}>
                {isFa ? "پلن فعلی: پایه (رایگان)" : "Current Plan: Starter (Free)"}
              </span>
            </div>

            <div className={styles.planGrid}>
              {/* Starter Plan */}
              <div className={styles.planCard}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.25rem" }}>{isFa ? "پایه (Starter)" : "Starter"}</h3>
                  <p className={styles.itemMeta} style={{ marginBlock: "var(--space-2)" }}>
                    {isFa ? "برای شروع یادگیری مستمر روزانه" : "For consistent daily fundamentals"}
                  </p>
                  <div className={styles.planPrice}>{isFa ? "رایگان" : "Free"}</div>
                </div>

                <ul className={styles.planFeatures}>
                  <li className={styles.planFeatureItem}>✓ {isFa ? "۱۵ دقیقه مکالمه هوش مصنوعی روزانه" : "15 mins daily AI conversation"}</li>
                  <li className={styles.planFeatureItem}>✓ {isFa ? "۳۰ فلش‌کارت جعبه لایتنر در روز" : "30 daily SRS flashcards"}</li>
                  <li className={styles.planFeatureItem}>✓ {isFa ? "تست تعیین سطح اولیه CEFR" : "Initial CEFR Placement Test"}</li>
                  <li className={styles.planFeatureItem}>✓ {isFa ? "ردیابی پیوستگی مطالعه (Streak)" : "Streak & Habit tracking"}</li>
                </ul>

                <button
                  type="button"
                  className={`${styles.actionButton} ${styles.actionButtonSecondary}`}
                  disabled
                >
                  {isFa ? "پلن فعال شما" : "Current Plan"}
                </button>
              </div>

              {/* Pro Plan */}
              <div className={`${styles.planCard} ${styles.planCardRecommended}`}>
                <span className={styles.planBadge}>{isFa ? "پیشنهاد ویژه" : "Recommended"}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.25rem" }}>{isFa ? "هوشمند (Pro)" : "Pro"}</h3>
                  <p className={styles.itemMeta} style={{ marginBlock: "var(--space-2)" }}>
                    {isFa ? "برای تسریع روان‌زبانی و آزمون‌های بین‌المللی" : "For accelerated fluency and test prep"}
                  </p>
                  <div className={styles.planPrice}>
                    ۲۹۰,۰۰۰ <span style={{ fontSize: "0.875rem", fontWeight: 400 }}>{isFa ? "تومان / ماه" : "Tomans / mo"}</span>
                  </div>
                </div>

                <ul className={styles.planFeatures}>
                  <li className={styles.planFeatureItem}>✓ {isFa ? "۶۰ دقیقه مکالمه و نقش‌آفرینی روزانه" : "60 mins daily AI roleplay & voice"}</li>
                  <li className={styles.planFeatureItem}>✓ {isFa ? "مرور نامحدود فلش‌کارت‌های هوشمند" : "Unlimited smart SRS flashcards"}</li>
                  <li className={styles.planFeatureItem}>✓ {isFa ? "تحلیل عمیق تداخل زبان مادری (L1)" : "Deep Persian L1 transfer analysis"}</li>
                  <li className={styles.planFeatureItem}>✓ {isFa ? "تصحیح خودکار رایتینگ و بازخورد CEFR" : "Automated writing grading & feedback"}</li>
                  <li className={styles.planFeatureItem}>✓ {isFa ? "همگام‌سازی دوقلوی زبانی هوشمند" : "Continuous Twin AI calibration"}</li>
                </ul>

                <button
                  type="button"
                  onClick={() => setActivePlanSelection("pro")}
                  className={`${styles.actionButton} ${styles.actionButtonPrimary}`}
                >
                  {activePlanSelection === "pro"
                    ? isFa ? "✓ انتخاب شده (آماده پرداخت)" : "✓ Selected"
                    : isFa ? "ارتقا به پلن پرو" : "Upgrade to Pro"}
                </button>
              </div>

              {/* Immersion Plan */}
              <div className={styles.planCard}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.25rem" }}>{isFa ? "غوطه‌وری (Immersion)" : "Immersion"}</h3>
                  <p className={styles.itemMeta} style={{ marginBlock: "var(--space-2)" }}>
                    {isFa ? "ترکیب هوش مصنوعی با مدرسان تأییدشده" : "AI power combined with human mentorship"}
                  </p>
                  <div className={styles.planPrice}>
                    ۷۸۰,۰۰۰ <span style={{ fontSize: "0.875rem", fontWeight: 400 }}>{isFa ? "تومان / ماه" : "Tomans / mo"}</span>
                  </div>
                </div>

                <ul className={styles.planFeatures}>
                  <li className={styles.planFeatureItem}>✓ {isFa ? "همه امکانات پلن پرو به‌صورت نامحدود" : "All Pro features with unlimited quotas"}</li>
                  <li className={styles.planFeatureItem}>✓ {isFa ? "۱ جلسه ماهانه کالیبراسیون با مدرس تأییدشده" : "1 monthly 1-on-1 certified teacher session"}</li>
                  <li className={styles.planFeatureItem}>✓ {isFa ? "اولویت در رزرو کلاس‌های گروهی ثابت" : "Priority fixed-class booking"}</li>
                  <li className={styles.planFeatureItem}>✓ {isFa ? "دانلود و استفاده آفلاین از فایل‌های صوتی" : "Offline audio lesson downloads"}</li>
                </ul>

                <button
                  type="button"
                  onClick={() => setActivePlanSelection("immersion")}
                  className={`${styles.actionButton} ${styles.actionButtonSecondary}`}
                >
                  {activePlanSelection === "immersion"
                    ? isFa ? "✓ انتخاب شده (آماده پرداخت)" : "✓ Selected"
                    : isFa ? "انتخاب غوطه‌وری" : "Choose Immersion"}
                </button>
              </div>
            </div>

            <div style={{ padding: "var(--space-3)", background: "var(--color-canvas)", borderRadius: "var(--radius-control)", border: "1px solid var(--color-border)", fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>
              {isFa
                ? "💡 پرداخت‌ها از طریق شبکه بانکی شتاب انجام می‌گیرد و تا ۷ روز پس از خرید دارای ضمانت بازگشت وجه هستند."
                : "💡 All transactions are processed via Shetab with a 7-day money-back guarantee."}
            </div>
          </section>
        )}

        {/* SECTION: BILLING */}
        {section === "billing" && (
          <section className={styles.card}>
            <div className={styles.sectionHeading}>
              <div>
                <h2 style={{ fontSize: "var(--font-size-section-title)", margin: 0 }}>
                  {isFa ? "تراکنش‌ها و صورتحساب‌های مالی" : "Billing History & Invoices"}
                </h2>
                <p className={styles.description} style={{ marginBlockStart: "var(--space-1)" }}>
                  {isFa
                    ? "مشاهده وضعیت فاکتورها، تراکنش‌های بانکی و رسیدهای دیجیتال پرداخت."
                    : "Inspect invoices, payment gateways, and download digital receipts."}
                </p>
              </div>

              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <button
                  type="button"
                  onClick={() => setBillingFeedback(isFa ? "درگاه افزایش اعتبار در حال آماده‌سازی است." : "Gateway top-up modal is initializing.")}
                  className={`${styles.actionButton} ${styles.actionButtonPrimary}`}
                >
                  {isFa ? "+ شارژ کیف پول" : "+ Add Funds"}
                </button>
              </div>
            </div>

            {billingFeedback && (
              <div
                style={{
                  padding: "var(--space-3)",
                  background: "var(--color-info-bg)",
                  color: "var(--color-info-text)",
                  borderRadius: "var(--radius-control)",
                  fontSize: "var(--font-size-meta)",
                }}
                role="status"
              >
                {billingFeedback}
              </div>
            )}

            {/* Invoices Table */}
            <div className={styles.billingTableContainer}>
              <table className={styles.billingTable}>
                <thead>
                  <tr>
                    <th>{isFa ? "شماره فاکتور" : "Invoice #"}</th>
                    <th>{isFa ? "شرح خرید" : "Description"}</th>
                    <th>{isFa ? "تاریخ" : "Date"}</th>
                    <th>{isFa ? "مبلغ" : "Amount"}</th>
                    <th>{isFa ? "درگاه" : "Gateway"}</th>
                    <th>{isFa ? "وضعیت" : "Status"}</th>
                    <th>{isFa ? "عملیات" : "Action"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 700 }}>END-2026-841</td>
                    <td>{isFa ? "اشتراک ۱ ماهه پلن پرو" : "1-Month Pro Subscription"}</td>
                    <td>۱۴۰۴/۱۲/۰۱</td>
                    <td>۲۹۰,۰۰۰ {isFa ? "تومان" : "Tomans"}</td>
                    <td>زرین‌پال (ZarinPal)</td>
                    <td>
                      <span className={styles.status} style={{ fontSize: "0.75rem", minBlockSize: "1.5rem", background: "var(--color-success-bg)", color: "var(--color-success-text)" }}>
                        {isFa ? "موفق" : "Paid"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setBillingFeedback(isFa ? "فاکتور END-2026-841 صادر شد." : "Invoice END-2026-841 generated.")}
                        style={{ background: "none", border: "none", color: "var(--color-link)", cursor: "pointer", fontWeight: 700 }}
                      >
                        {isFa ? "رسید" : "Receipt"}
                      </button>
                    </td>
                  </tr>

                  <tr>
                    <td style={{ fontWeight: 700 }}>END-2026-722</td>
                    <td>{isFa ? "آزمون ارزیابی جامع CEFR و کالیبراسیون اولیه" : "Comprehensive CEFR Placement Test"}</td>
                    <td>۱۴۰۴/۱۱/۱۵</td>
                    <td>{isFa ? "رایگان" : "Free"}</td>
                    <td>سیستمی</td>
                    <td>
                      <span className={styles.status} style={{ fontSize: "0.75rem", minBlockSize: "1.5rem", background: "var(--color-success-bg)", color: "var(--color-success-text)" }}>
                        {isFa ? "موفق" : "Completed"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setBillingFeedback(isFa ? "رسید آزمون رایگان نمایش داده شد." : "Free assessment receipt shown.")}
                        style={{ background: "none", border: "none", color: "var(--color-link)", cursor: "pointer", fontWeight: 700 }}
                      >
                        {isFa ? "رسید" : "Receipt"}
                      </button>
                    </td>
                  </tr>

                  <tr>
                    <td style={{ fontWeight: 700 }}>END-2026-509</td>
                    <td>{isFa ? "ثبت‌نام کارگاه مکالمه فشرده B1" : "B1 Conversational Fluency Workshop"}</td>
                    <td>۱۴۰۴/۱۰/۲۸</td>
                    <td>۴۵۰,۰۰۰ {isFa ? "تومان" : "Tomans"}</td>
                    <td>شاپرک (Shetab)</td>
                    <td>
                      <span className={styles.status} style={{ fontSize: "0.75rem", minBlockSize: "1.5rem", background: "var(--color-success-bg)", color: "var(--color-success-text)" }}>
                        {isFa ? "موفق" : "Paid"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setBillingFeedback(isFa ? "رسید کارگاه آموزشی صادر شد." : "Workshop receipt downloaded.")}
                        style={{ background: "none", border: "none", color: "var(--color-link)", cursor: "pointer", fontWeight: 700 }}
                      >
                        {isFa ? "رسید" : "Receipt"}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Existing account info card for compliance */}
        <section className={styles.card}>
          <div className={styles.account}>
            <strong>{t.account}</strong>

            <span
              className={styles.email}
              dir="ltr"
            >
              {account.email}
            </span>
          </div>
        </section>
      </div>
    </AuthShell>
  );
}

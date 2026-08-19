"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AuthShell } from "../../components/auth/AuthShell";
import {
  apiErrorMessages,
  endooraApi,
  type EndooraLocale,
} from "../../lib/endoora-api";
import styles from "./account.module.css";

type AccountRole = "learner" | "teacher";

type AccountSummary = {
  account: {
    id: string;
    email: string;
    phone: string | null;
    phone_verified: boolean;
    role: AccountRole;
    preferred_locale: EndooraLocale;
    capabilities: {
      teacher_verified: boolean;
      marketplace_eligible: boolean;
      paid_class_eligible: boolean;
    };
  };

  profile: Record<string, unknown> | null;

  profile_completeness: number;

  onboarding: {
    stage: string;
    current_step: number;
    is_completed: boolean;
  } | null;

  session: {
    current: boolean;
    session_fingerprint: string | null;
    expires_at: string;
  };

  data_controls: {
    latest_export: Record<string, unknown> | null;
    latest_deletion_request: Record<string, unknown> | null;
  };

  account_sections: {
    library: {
      status: string;
    };
    usage: {
      status: string;
    };
    plan: {
      status: string;
    };
    billing: {
      status: string;
    };
    profile: {
      status: string;
    };
    sessions: {
      status: string;
    };
    data_controls: {
      status: string;
    };
  };
};

const copy = {
  fa: {
    title: "حساب کاربری",
    description:
      "پروفایل، نشست‌ها، حریم خصوصی و بخش‌های اصلی حساب Endoora را از یک جا مدیریت کنید.",

    loading: "در حال بارگذاری حساب…",
    errorTitle: "امکان بارگذاری حساب وجود نداشت.",
    signIn: "ورود به حساب",

    roleLearner: "زبان‌آموز",
    roleTeacher: "مدرس",

    profileComplete: "تکمیل پروفایل",
    onboardingComplete: "شروع حساب تکمیل شده",
    onboardingPending: "شروع حساب هنوز تکمیل نشده",

    teacherCapabilities: "وضعیت دسترسی مدرس",
    verified: "تأیید مدرس",
    marketplace: "دسترسی به بازار مدرس‌ها",
    paidClasses: "کلاس پولی",
    enabled: "فعال",
    disabled: "غیرفعال",

    profile: "پروفایل و تنظیمات",
    profileDescription:
      "اطلاعات حساب، زبان رابط و پروفایل شخصی خود را مدیریت کنید.",

    sessions: "دستگاه‌ها و نشست‌ها",
    sessionsDescription:
      "نشست فعلی، تاریخ انقضا و اطلاعات امنیتی ورود را مشاهده کنید.",

    dataControls: "حریم خصوصی و داده‌ها",
    dataControlsDescription:
      "درخواست خروجی داده‌ها یا حذف حساب را مدیریت کنید.",

    library: "کتابخانه",
    libraryDescription:
      "محتوای ذخیره‌شده و منابع شخصی شما در این بخش قرار می‌گیرد.",

    usage: "مصرف و استفاده",
    usageDescription:
      "جزئیات استفاده از قابلیت‌های Endoora در این بخش نمایش داده خواهد شد.",

    plan: "پلن",
    planDescription:
      "اطلاعات پلن و سطح دسترسی حساب در این بخش مدیریت خواهد شد.",

    billing: "پرداخت و صورتحساب",
    billingDescription:
      "سوابق پرداخت و صورتحساب‌ها در این بخش قرار خواهند گرفت.",

    open: "باز کردن",
    foundation: "زیرساخت آماده — قابلیت کامل در روزهای بعد",

    home: "صفحه اصلی",
  },

  en: {
    title: "Account",
    description:
      "Manage your profile, sessions, privacy controls and key Endoora account areas from one place.",

    loading: "Loading your account…",
    errorTitle: "Your account could not be loaded.",
    signIn: "Sign in",

    roleLearner: "Learner",
    roleTeacher: "Teacher",

    profileComplete: "Profile completeness",
    onboardingComplete: "Account setup complete",
    onboardingPending: "Account setup is not complete",

    teacherCapabilities: "Teacher capability status",
    verified: "Teacher verification",
    marketplace: "Teacher marketplace",
    paidClasses: "Paid classes",
    enabled: "Enabled",
    disabled: "Disabled",

    profile: "Profile & settings",
    profileDescription:
      "Manage your account information, interface language and personal profile.",

    sessions: "Devices & sessions",
    sessionsDescription:
      "View your current session, expiry and sign-in security information.",

    dataControls: "Privacy & data controls",
    dataControlsDescription:
      "Manage data-export and account-deletion requests.",

    library: "Library",
    libraryDescription:
      "Your saved learning content and personal resources will live here.",

    usage: "Usage",
    usageDescription:
      "Your Endoora feature usage will be displayed here.",

    plan: "Plan",
    planDescription:
      "Your account plan and access level will be managed here.",

    billing: "Billing",
    billingDescription:
      "Payment and billing history will be available here.",

    open: "Open",
    foundation: "Foundation ready — full feature arrives later",

    home: "Home",
  },
} as const;

export default function AccountPage() {
  const [locale, setLocale] =
    useState<EndooraLocale>("fa");

  const [summary, setSummary] =
    useState<AccountSummary | null>(null);

  const [loading, setLoading] = useState(true);

  const [errors, setErrors] =
    useState<string[]>([]);

  const t = copy[locale];

  useEffect(() => {
    let cancelled = false;
    let errorLocale: EndooraLocale = "fa";

    endooraApi<AccountSummary>(
      "/profiles/account-summary/",
    )
      .then((result) => {
        if (cancelled) {
          return;
        }

        const accountLocale: EndooraLocale =
          result.account.preferred_locale === "en"
            ? "en"
            : "fa";

        errorLocale = accountLocale;

        setLocale(accountLocale);
        setSummary(result);
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

  if (loading) {
    return (
      <AuthShell
        locale={locale}
        onLocaleChange={setLocale}
        title={t.title}
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

  if (!summary) {
    return (
      <AuthShell
        locale={locale}
        onLocaleChange={setLocale}
        title={t.title}
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

  const isTeacher =
    summary.account.role === "teacher";

  const roleLabel = isTeacher
    ? t.roleTeacher
    : t.roleLearner;

  const completeness = Math.min(
    Math.max(summary.profile_completeness, 0),
    100,
  );

  const liveSections = [
    {
      href: "/account/profile",
      title: t.profile,
      description: t.profileDescription,
    },
    {
      href: "/account/sessions",
      title: t.sessions,
      description: t.sessionsDescription,
    },
    {
      href: "/account/data-controls",
      title: t.dataControls,
      description: t.dataControlsDescription,
    },
  ];

  const foundationSections = [
    {
      href: "/account/library",
      title: t.library,
      description: t.libraryDescription,
    },
    {
      href: "/account/usage",
      title: t.usage,
      description: t.usageDescription,
    },
    {
      href: "/account/plan",
      title: t.plan,
      description: t.planDescription,
    },
    {
      href: "/account/billing",
      title: t.billing,
      description: t.billingDescription,
    },
  ];

  return (
    <AuthShell
      locale={locale}
      onLocaleChange={setLocale}
      title={t.title}
      description={t.description}
      footer={
        <Link href="/">
          {t.home}
        </Link>
      }
    >
      <div className={styles.header}>
        <section
          className={styles.identity}
          aria-label={t.title}
        >
          <strong
            className={styles.email}
            dir="ltr"
          >
            {summary.account.email}
          </strong>

          <div className={styles.meta}>
            <span className={styles.badge}>
              {roleLabel}
            </span>

            <span className={styles.badge}>
              {summary.onboarding?.is_completed
                ? t.onboardingComplete
                : t.onboardingPending}
            </span>
          </div>
        </section>

        <section className={styles.progress}>
          <strong>
            {t.profileComplete}: {completeness}%
          </strong>

          <div
            className={styles.progressTrack}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={completeness}
            aria-label={t.profileComplete}
          >
            <div
              className={styles.progressValue}
              style={{
                inlineSize: `${completeness}%`,
              }}
            />
          </div>
        </section>

        {isTeacher ? (
          <section>
            <h2>{t.teacherCapabilities}</h2>

            <dl className={styles.capabilities}>
              <div className={styles.capability}>
                <dt>{t.verified}</dt>
                <dd>
                  {summary.account.capabilities
                    .teacher_verified
                    ? t.enabled
                    : t.disabled}
                </dd>
              </div>

              <div className={styles.capability}>
                <dt>{t.marketplace}</dt>
                <dd>
                  {summary.account.capabilities
                    .marketplace_eligible
                    ? t.enabled
                    : t.disabled}
                </dd>
              </div>

              <div className={styles.capability}>
                <dt>{t.paidClasses}</dt>
                <dd>
                  {summary.account.capabilities
                    .paid_class_eligible
                    ? t.enabled
                    : t.disabled}
                </dd>
              </div>
            </dl>
          </section>
        ) : null}
      </div>

      <div className={styles.grid}>
        {liveSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className={styles.card}
          >
            <h2 className={styles.cardTitle}>
              {section.title}
            </h2>

            <p className={styles.cardDescription}>
              {section.description}
            </p>

            <span className={styles.cardFooter}>
              {t.open}
            </span>
          </Link>
        ))}

        {foundationSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className={`${styles.card} ${styles.foundation}`}
          >
            <h2 className={styles.cardTitle}>
              {section.title}
            </h2>

            <p className={styles.cardDescription}>
              {section.description}
            </p>

            <span className={styles.cardFooter}>
              {t.foundation}
            </span>
          </Link>
        ))}
      </div>
    </AuthShell>
  );
}

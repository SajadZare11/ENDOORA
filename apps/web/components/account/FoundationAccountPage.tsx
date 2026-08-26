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

  const t = copy[locale];
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
        <section className={styles.card}>
          <span className={styles.status}>
            {t.status}
          </span>

          <p className={styles.description}>
            {t.foundation}
          </p>

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

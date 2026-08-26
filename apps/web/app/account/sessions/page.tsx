"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthShell } from "../../../components/auth/AuthShell";
import {
  apiErrorMessages,
  endooraApi,
  persistPreferredLocale,
  type EndooraLocale,
} from "../../../lib/endoora-api";
import styles from "./sessions.module.css";

type AccountMe = {
  id: string;
  email: string;
  preferred_locale: EndooraLocale;
};

type CurrentSession = {
  current: boolean;
  session_fingerprint: string | null;
  expires_at: string;
};

const copy = {
  fa: {
    title: "دستگاه‌ها و نشست‌ها",
    description:
      "نشست فعلی ورود به حساب Endoora و زمان اعتبار آن را بررسی کنید.",

    loading: "در حال بارگذاری اطلاعات نشست…",
    errorTitle: "امکان بارگذاری نشست وجود نداشت.",
    signIn: "ورود",

    currentSession: "نشست فعلی",
    active: "فعال",
    inactive: "غیرفعال",

    account: "حساب",
    sessionStatus: "وضعیت",
    fingerprint: "شناسه نشست",
    fingerprintUnavailable:
      "برای این نشست شناسه دستگاهی ثبت نشده است.",
    expires: "زمان انقضای نشست",
    signOutCurrent: "خروج امن از این دستگاه",
    signingOut: "در حال خروج…",

    securityTitle: "درباره نشست‌های حساب",
    securityBody:
      "در حال حاضر Endoora اطلاعات نشست فعلی را نمایش می‌دهد. مدیریت چند دستگاه و بستن نشست‌های دیگر به قابلیت مدیریت نشست‌های سمت سرور نیاز دارد و در این صفحه شبیه‌سازی نشده است.",

    privacyTitle: "نکته امنیتی",
    privacyBody:
      "اگر از دستگاه عمومی استفاده می‌کنید، پس از پایان کار از حساب خارج شوید و رمز عبور خود را در مرورگرهای عمومی ذخیره نکنید.",

    back: "بازگشت به حساب کاربری",
  },

  en: {
    title: "Devices & sessions",
    description:
      "Review the current Endoora sign-in session and its validity period.",

    loading: "Loading session information…",
    errorTitle: "Your session information could not be loaded.",
    signIn: "Sign in",

    currentSession: "Current session",
    active: "Active",
    inactive: "Inactive",

    account: "Account",
    sessionStatus: "Status",
    fingerprint: "Session identifier",
    fingerprintUnavailable:
      "No device/session fingerprint is available for this session.",
    expires: "Session expires",
    signOutCurrent: "Securely sign out this device",
    signingOut: "Signing out…",

    securityTitle: "About account sessions",
    securityBody:
      "Endoora currently exposes information about the active session. Multi-device management and remotely closing other sessions require additional server-side session management and are not simulated here.",

    privacyTitle: "Security note",
    privacyBody:
      "When using a shared or public device, sign out when finished and avoid saving your password in the browser.",

    back: "Back to account",
  },
} as const;

function formatDate(
  value: string,
  locale: EndooraLocale,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    locale === "fa" ? "fa-IR" : "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(date);
}

export default function SessionsPage() {
  const router = useRouter();
  const [locale, setLocale] =
    useState<EndooraLocale>("fa");

  const [account, setAccount] =
    useState<AccountMe | null>(null);

  const [session, setSession] =
    useState<CurrentSession | null>(null);

  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  const [errors, setErrors] =
    useState<string[]>([]);

  const t = copy[locale];

  async function signOutCurrentSession() {
    setSigningOut(true);
    setErrors([]);

    try {
      await endooraApi<null>("/auth/logout/", {
        method: "POST",
        json: {},
      });
      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      setErrors(apiErrorMessages(error, locale));
      setSigningOut(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    let errorLocale: EndooraLocale = "fa";

    endooraApi<AccountMe>("/auth/me/")
      .then(async (accountResult) => {
        if (cancelled) {
          return;
        }

        const accountLocale: EndooraLocale =
          accountResult.preferred_locale === "en"
            ? "en"
            : "fa";

        errorLocale = accountLocale;

        setLocale(accountLocale);
        setAccount(accountResult);

        const sessionResult =
          await endooraApi<CurrentSession>(
            "/auth/sessions/current/",
          );

        if (!cancelled) {
          setSession(sessionResult);
        }
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
        title={t.title}
        description={t.loading}
        variant="wide"
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

  if (!account || !session) {
    return (
      <AuthShell
        locale={locale}
        onLocaleChange={setLocale}
        title={t.title}
        description={t.errorTitle}
        variant="wide"
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
      title={t.title}
      description={t.description}
      variant="wide"
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
          <div className={styles.cardHeader}>
            <h2 className={styles.title}>
              {t.currentSession}
            </h2>

            <span className={styles.badge}>
              {session.current
                ? t.active
                : t.inactive}
            </span>
          </div>

          <dl className={styles.details}>
            <div className={styles.row}>
              <dt>{t.account}</dt>

              <dd
                dir="ltr"
                className={styles.ltr}
              >
                {account.email}
              </dd>
            </div>

            <div className={styles.row}>
              <dt>{t.sessionStatus}</dt>

              <dd>
                {session.current
                  ? t.active
                  : t.inactive}
              </dd>
            </div>

            <div className={styles.row}>
              <dt>{t.fingerprint}</dt>

              <dd
                dir="ltr"
                className={styles.ltr}
              >
                {session.session_fingerprint ??
                  t.fingerprintUnavailable}
              </dd>
            </div>

            <div className={styles.row}>
              <dt>{t.expires}</dt>

              <dd>
                {formatDate(
                  session.expires_at,
                  locale,
                )}
              </dd>
            </div>
          </dl>

          <button
            type="button"
            className="endoora-button endoora-button--secondary"
            disabled={signingOut}
            onClick={() => void signOutCurrentSession()}
          >
            {signingOut ? t.signingOut : t.signOutCurrent}
          </button>
        </section>

        {errors.length > 0 ? (
          <div className="endoora-error-summary" role="alert">
            <ul>
              {errors.map((message, index) => (
                <li key={`${message}-${index}`}>{message}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <section className={styles.notice}>
          <strong>{t.securityTitle}</strong>
          <p>{t.securityBody}</p>
        </section>

        <section className={styles.notice}>
          <strong>{t.privacyTitle}</strong>
          <p>{t.privacyBody}</p>
        </section>
      </div>
    </AuthShell>
  );
}

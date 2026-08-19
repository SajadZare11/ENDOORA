"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { AuthShell } from "../../../components/auth/AuthShell";
import styles from "../../../components/auth/auth.module.css";
import {
  apiErrorMessages,
  endooraApi,
  type EndooraLocale,
} from "../../../lib/endoora-api";

type LoginResponse = {
  id: string;
  email: string;
  role: string;
  preferred_locale: EndooraLocale;
};

const copy = {
  fa: {
    title: "ورود به Endoora",
    description:
      "برای ادامه مسیر یادگیری یا تدریس وارد حساب خود شوید.",
    email: "ایمیل",
    password: "رمز عبور",
    submit: "ورود",
    submitting: "در حال ورود…",
    requiredEmail: "ایمیل را وارد کنید.",
    requiredPassword: "رمز عبور را وارد کنید.",
    errorTitle: "ورود انجام نشد",
    successTitle: "با موفقیت وارد شدید.",
    successBody:
      "حساب شما شناسایی شد و جلسه ورود فعال است.",
    forgot: "رمز عبور را فراموش کرده‌اید؟",
    create: "حساب ندارید؟",
    register: "ساخت حساب",
  },

  en: {
    title: "Log in to Endoora",
    description:
      "Sign in to continue learning or teaching.",
    email: "Email",
    password: "Password",
    submit: "Log in",
    submitting: "Signing in…",
    requiredEmail: "Enter your email address.",
    requiredPassword: "Enter your password.",
    errorTitle: "Login failed",
    successTitle: "You are signed in.",
    successBody:
      "Your account was recognised and your session is active.",
    forgot: "Forgot your password?",
    create: "Don't have an account?",
    register: "Create account",
  },
} as const;

export default function LoginPage() {
  const [locale, setLocale] =
    useState<EndooraLocale>("fa");

  const [email, setEmail] =
    useState("");
  const [password, setPassword] =
    useState("");

  const [errors, setErrors] = useState<
    string[]
  >([]);

  const [submitting, setSubmitting] =
    useState(false);
  const [loggedIn, setLoggedIn] =
    useState(false);

  const t = copy[locale];

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const nextErrors: string[] = [];

    if (!email.trim()) {
      nextErrors.push(t.requiredEmail);
    }

    if (!password) {
      nextErrors.push(t.requiredPassword);
    }

    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors([]);
    setSubmitting(true);

    try {
      await endooraApi<LoginResponse>(
        "/auth/login/",
        {
          method: "POST",
          json: {
            email: email.trim(),
            password,
          },
        },
      );

      setLoggedIn(true);
    } catch (error) {
      setErrors(
        apiErrorMessages(error, locale),
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loggedIn) {
    return (
      <AuthShell
        locale={locale}
        onLocaleChange={setLocale}
        title={t.successTitle}
        description={t.successBody}
        footer={
          <Link href="/onboarding">
            {locale === "fa"
              ? "ادامه به حساب کاربری"
              : "Continue to account"}
          </Link>
        }
      >
        <div
          className="endoora-status-message endoora-status-message--success"
          role="status"
        >
          <strong>{t.successTitle}</strong>
          <span>{t.successBody}</span>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      locale={locale}
      onLocaleChange={setLocale}
      title={t.title}
      description={t.description}
      footer={
        <>
          {t.create}{" "}
          <Link href="/auth/register">
            {t.register}
          </Link>
        </>
      }
    >
      <form
        className={styles.form}
        onSubmit={handleSubmit}
        noValidate
      >
        {errors.length > 0 ? (
          <div
            className="endoora-error-summary"
            role="alert"
            aria-labelledby="login-error-title"
          >
            <h3 id="login-error-title">
              {t.errorTitle}
            </h3>

            <ul>
              {errors.map((message, index) => (
                <li key={`${message}-${index}`}>
                  {message}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="endoora-field">
          <label
            className="endoora-field__label"
            htmlFor="login-email"
          >
            {t.email}
          </label>

          <input
            id="login-email"
            type="email"
            name="email"
            autoComplete="email"
            className={`endoora-input ${styles.ltrInput}`}
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
          />
        </div>

        <div className="endoora-field">
          <label
            className="endoora-field__label"
            htmlFor="login-password"
          >
            {t.password}
          </label>

          <input
            id="login-password"
            type="password"
            name="password"
            autoComplete="current-password"
            className={`endoora-input ${styles.ltrInput}`}
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
          />
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            className="endoora-button endoora-button--primary"
            disabled={submitting}
          >
            {submitting
              ? t.submitting
              : t.submit}
          </button>
        </div>

        <div className={styles.secondaryLinks}>
          <Link href="/auth/forgot-password">
            {t.forgot}
          </Link>

          <Link href="/auth/register">
            {t.register}
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}

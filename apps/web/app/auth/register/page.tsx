"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { AuthShell } from "../../../components/auth/AuthShell";
import { PasswordField } from "../../../components/auth/PasswordField";
import styles from "../../../components/auth/auth.module.css";
import {
  apiErrorMessages,
  endooraApi,
  type EndooraLocale,
} from "../../../lib/endoora-api";

type Role = "learner" | "teacher";

type AccountResponse = {
  id: string;
  email: string;
  role: Role;
  preferred_locale: EndooraLocale;
};

type FormErrors = {
  email?: string;
  password?: string;
  consents?: string;
};

const copy = {
  fa: {
    title: "ساخت حساب Endoora",
    description:
      "برای شروع فقط اطلاعات ضروری را وارد کنید. جزئیات بیشتر را بعداً می‌توانید کامل کنید.",
    email: "ایمیل",
    emailHelp: "ایمیلی وارد کنید که به آن دسترسی دارید.",
    password: "رمز عبور",
    passwordHelp:
      "یک رمز عبور قوی و منحصربه‌فرد انتخاب کنید.",
    showPassword: "نمایش رمز عبور",
    hidePassword: "پنهان کردن رمز عبور",
    role: "می‌خواهید چگونه از Endoora استفاده کنید؟",
    learner: "زبان‌آموز",
    learnerDescription:
      "یادگیری، تمرین و دنبال‌کردن مسیر شخصی",
    teacher: "مدرس",
    teacherDescription:
      "تدریس، کلاس‌ها و ابزارهای آموزشی",
    terms: "شرایط استفاده",
    privacy: "سیاست حریم خصوصی",
    consentPrefix: "مطالعه کردم و می‌پذیرم:",
    submit: "ساخت حساب",
    submitting: "در حال ساخت حساب…",
    already: "از قبل حساب دارید؟",
    login: "ورود",
    requiredEmail: "ایمیل را وارد کنید.",
    invalidEmail: "یک ایمیل معتبر وارد کنید.",
    requiredPassword: "رمز عبور را وارد کنید.",
    shortPassword:
      "رمز عبور باید حداقل ۱۰ نویسه داشته باشد.",
    requiredConsents:
      "پذیرش شرایط استفاده و حریم خصوصی برای ساخت حساب لازم است.",
    errorTitle: "لطفاً موارد زیر را بررسی کنید",
    successTitle: "حساب شما ساخته شد.",
    successBody:
      "ورود شما انجام شده است. در مرحله بعد اطلاعات اولیه حساب را تکمیل می‌کنیم.",
  },

  en: {
    title: "Create your Endoora account",
    description:
      "Enter only the information needed to begin. You can complete optional details later.",
    email: "Email",
    emailHelp: "Use an email address you can access.",
    password: "Password",
    passwordHelp:
      "Choose a strong password that you do not reuse elsewhere.",
    showPassword: "Show password",
    hidePassword: "Hide password",
    role: "How will you use Endoora?",
    learner: "Learner",
    learnerDescription:
      "Learn, practise and follow your personal path",
    teacher: "Teacher",
    teacherDescription:
      "Teach, manage classes and use teaching tools",
    terms: "Terms of Use",
    privacy: "Privacy Policy",
    consentPrefix: "I have read and accept the",
    submit: "Create account",
    submitting: "Creating account…",
    already: "Already have an account?",
    login: "Log in",
    requiredEmail: "Enter your email address.",
    invalidEmail: "Enter a valid email address.",
    requiredPassword: "Enter a password.",
    shortPassword:
      "Your password must contain at least 10 characters.",
    requiredConsents:
      "You must accept the Terms and Privacy Policy to create an account.",
    errorTitle: "Check the following",
    successTitle: "Your account has been created.",
    successBody:
      "You are signed in. Next we will complete your initial account information.",
  },
} as const;

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function RegisterPage() {
  const [locale, setLocale] =
    useState<EndooraLocale>("fa");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] =
    useState<Role>("learner");

  const [acceptTerms, setAcceptTerms] =
    useState(false);
  const [acceptPrivacy, setAcceptPrivacy] =
    useState(false);

  const [errors, setErrors] =
    useState<FormErrors>({});
  const [serverErrors, setServerErrors] =
    useState<string[]>([]);

  const [submitting, setSubmitting] =
    useState(false);
  const [created, setCreated] =
    useState(false);

  const t = copy[locale];

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};

    if (!email.trim()) {
      nextErrors.email = t.requiredEmail;
    } else if (!looksLikeEmail(email.trim())) {
      nextErrors.email = t.invalidEmail;
    }

    if (!password) {
      nextErrors.password = t.requiredPassword;
    } else if (password.length < 10) {
      nextErrors.password = t.shortPassword;
    }

    if (!acceptTerms || !acceptPrivacy) {
      nextErrors.consents = t.requiredConsents;
    }

    return nextErrors;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setServerErrors([]);

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      await endooraApi<AccountResponse>(
        "/auth/register/",
        {
          method: "POST",
          json: {
            email: email.trim(),
            password,
            role,
            preferred_locale: locale,
            accept_terms: acceptTerms,
            accept_privacy: acceptPrivacy,
          },
        },
      );

      setCreated(true);
    } catch (error) {
      setServerErrors(
        apiErrorMessages(error, locale),
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (created) {
    return (
      <AuthShell
        locale={locale}
        onLocaleChange={setLocale}
        title={t.successTitle}
        description={t.successBody}
        footer={
          <Link href="/onboarding">
            {locale === "fa"
              ? "ادامه و تکمیل اطلاعات اولیه"
              : "Continue account setup"}
          </Link>
        }
      >
        <div
          className={`endoora-status-message endoora-status-message--success ${styles.success}`}
          role="status"
        >
          <strong>{t.successTitle}</strong>
          <p>{t.successBody}</p>
        </div>
      </AuthShell>
    );
  }

  const allErrors = [
    ...Object.values(errors).filter(
      (value): value is string =>
        typeof value === "string",
    ),
    ...serverErrors,
  ];

  return (
    <AuthShell
      locale={locale}
      onLocaleChange={setLocale}
      title={t.title}
      description={t.description}
      footer={
        <>
          {t.already}{" "}
          <Link href="/auth/login">
            {t.login}
          </Link>
        </>
      }
    >
      <form
        className={styles.form}
        onSubmit={handleSubmit}
        noValidate
      >
        {allErrors.length > 0 ? (
          <div
            className="endoora-error-summary"
            role="alert"
            aria-labelledby="register-error-title"
          >
            <h3 id="register-error-title">
              {t.errorTitle}
            </h3>

            <ul>
              {allErrors.map((message, index) => (
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
            htmlFor="register-email"
          >
            {t.email}
          </label>

          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            className={`endoora-input ${styles.ltrInput} ${
              errors.email
                ? "endoora-input--error"
                : ""
            }`}
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            aria-invalid={
              errors.email ? "true" : "false"
            }
            aria-describedby={
              errors.email
                ? "register-email-error"
                : "register-email-help"
            }
          />

          {errors.email ? (
            <p
              id="register-email-error"
              className="endoora-field__error"
            >
              {errors.email}
            </p>
          ) : (
            <p
              id="register-email-help"
              className="endoora-field__help"
            >
              {t.emailHelp}
            </p>
          )}
        </div>

        <PasswordField
          id="register-password"
          name="password"
          label={t.password}
          showLabel={t.showPassword}
          hideLabel={t.hidePassword}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          help={t.passwordHelp}
        />

        <fieldset className="endoora-fieldset">
          <legend className="endoora-field__label">
            {t.role}
          </legend>

          <div className={styles.roleGrid}>
            <label className={styles.roleChoice}>
              <input
                type="radio"
                name="role"
                value="learner"
                checked={role === "learner"}
                onChange={() =>
                  setRole("learner")
                }
              />

              <span className={styles.roleTitle}>
                {t.learner}
              </span>

              <span
                className={
                  styles.roleDescription
                }
              >
                {t.learnerDescription}
              </span>
            </label>

            <label className={styles.roleChoice}>
              <input
                type="radio"
                name="role"
                value="teacher"
                checked={role === "teacher"}
                onChange={() =>
                  setRole("teacher")
                }
              />

              <span className={styles.roleTitle}>
                {t.teacher}
              </span>

              <span
                className={
                  styles.roleDescription
                }
              >
                {t.teacherDescription}
              </span>
            </label>
          </div>
        </fieldset>

        <fieldset className="endoora-fieldset">
          <label className="endoora-check-row">
            <input
              type="checkbox"
              className="endoora-check"
              checked={acceptTerms}
              onChange={(event) =>
                setAcceptTerms(
                  event.target.checked,
                )
              }
            />

            <span className="endoora-check-row__label">
              {t.consentPrefix}{" "}
              <Link href="/legal/terms">{t.terms}</Link>
            </span>
          </label>

          <label className="endoora-check-row">
            <input
              type="checkbox"
              className="endoora-check"
              checked={acceptPrivacy}
              onChange={(event) =>
                setAcceptPrivacy(
                  event.target.checked,
                )
              }
            />

            <span className="endoora-check-row__label">
              {t.consentPrefix}{" "}
              <Link href="/legal/privacy">{t.privacy}</Link>
            </span>
          </label>

          {errors.consents ? (
            <p className="endoora-field__error">
              {errors.consents}
            </p>
          ) : null}
        </fieldset>

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
      </form>
    </AuthShell>
  );
}

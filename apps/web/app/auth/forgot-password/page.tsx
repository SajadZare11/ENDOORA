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

type Stage = "request" | "confirm" | "success";

type OtpRequestResponse = {
  status: string;
  expires_at: string;
  debug_code?: string;
};

type ResetResponse = {
  reset: boolean;
  message_fa: string;
  message_en: string;
};

const copy = {
  fa: {
    title: "بازیابی رمز عبور",
    description:
      "ایمیل حساب خود را وارد کنید تا کد بازیابی برای شما ایجاد شود.",
    email: "ایمیل",
    emailHelp: "همان ایمیلی را وارد کنید که با آن در Endoora ثبت‌نام کرده‌اید.",
    sendCode: "دریافت کد بازیابی",
    sendingCode: "در حال ایجاد کد…",
    codeSent:
      "اگر حساب فعالی با این ایمیل وجود داشته باشد، کد بازیابی برای آن ایجاد شده است.",
    code: "کد ۶ رقمی",
    codeHelp: "کد بازیابی را وارد کنید.",
    developmentCode: "کد آزمایشی محیط توسعه",
    developmentOnly:
      "این کد فقط در محیط توسعه محلی نمایش داده می‌شود.",
    newPassword: "رمز عبور جدید",
    confirmPassword: "تکرار رمز عبور جدید",
    showPassword: "نمایش رمز عبور",
    hidePassword: "پنهان کردن رمز عبور",
    reset: "تغییر رمز عبور",
    resetting: "در حال تغییر رمز…",
    resend: "دریافت کد جدید",
    back: "بازگشت به ورود",
    errorTitle: "لطفاً موارد زیر را بررسی کنید",
    invalidEmail: "یک ایمیل معتبر وارد کنید.",
    requiredCode: "کد ۶ رقمی را وارد کنید.",
    invalidCode: "کد باید دقیقاً ۶ رقم باشد.",
    passwordLength: "رمز عبور باید حداقل ۱۰ نویسه داشته باشد.",
    passwordMismatch: "دو رمز عبور با یکدیگر یکسان نیستند.",
    successTitle: "رمز عبور تغییر کرد",
    successBody:
      "اکنون می‌توانید با رمز عبور جدید وارد حساب Endoora شوید.",
    login: "ورود با رمز جدید",
  },

  en: {
    title: "Reset your password",
    description:
      "Enter your account email to create a password-reset code.",
    email: "Email",
    emailHelp: "Use the email address registered with your Endoora account.",
    sendCode: "Get reset code",
    sendingCode: "Creating code…",
    codeSent:
      "If an active account matches this email, a reset code has been created for it.",
    code: "6-digit code",
    codeHelp: "Enter your password-reset code.",
    developmentCode: "Local development code",
    developmentOnly:
      "This code is displayed only in the local development environment.",
    newPassword: "New password",
    confirmPassword: "Confirm new password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    reset: "Change password",
    resetting: "Changing password…",
    resend: "Get a new code",
    back: "Back to login",
    errorTitle: "Check the following",
    invalidEmail: "Enter a valid email address.",
    requiredCode: "Enter the 6-digit code.",
    invalidCode: "The code must contain exactly 6 digits.",
    passwordLength: "Your password must contain at least 10 characters.",
    passwordMismatch: "The passwords do not match.",
    successTitle: "Password changed",
    successBody:
      "You can now sign in to Endoora using your new password.",
    login: "Log in with new password",
  },
} as const;

function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function ForgotPasswordPage() {
  const [locale, setLocale] =
    useState<EndooraLocale>("fa");

  const [stage, setStage] =
    useState<Stage>("request");

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [debugCode, setDebugCode] =
    useState<string | null>(null);

  const [errors, setErrors] =
    useState<string[]>([]);

  const [busy, setBusy] = useState(false);

  const t = copy[locale];

  async function requestCode(
    event?: FormEvent<HTMLFormElement>,
  ) {
    event?.preventDefault();

    if (!validEmail(email.trim())) {
      setErrors([t.invalidEmail]);
      return;
    }

    setBusy(true);
    setErrors([]);

    try {
      const response =
        await endooraApi<OtpRequestResponse>(
          "/auth/otp/request/",
          {
            method: "POST",
            json: {
              identifier: email.trim(),
              purpose: "password_reset",
            },
          },
        );

      setDebugCode(response.debug_code ?? null);
      setStage("confirm");
    } catch (error) {
      setErrors(apiErrorMessages(error, locale));
    } finally {
      setBusy(false);
    }
  }

  async function confirmReset(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const nextErrors: string[] = [];

    if (!code.trim()) {
      nextErrors.push(t.requiredCode);
    } else if (!/^\d{6}$/.test(code.trim())) {
      nextErrors.push(t.invalidCode);
    }

    if (newPassword.length < 10) {
      nextErrors.push(t.passwordLength);
    }

    if (newPassword !== confirmPassword) {
      nextErrors.push(t.passwordMismatch);
    }

    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      return;
    }

    setBusy(true);
    setErrors([]);

    try {
      await endooraApi<ResetResponse>(
        "/auth/password-reset/confirm/",
        {
          method: "POST",
          json: {
            identifier: email.trim(),
            code: code.trim(),
            new_password: newPassword,
          },
        },
      );

      setStage("success");
    } catch (error) {
      setErrors(apiErrorMessages(error, locale));
    } finally {
      setBusy(false);
    }
  }

  if (stage === "success") {
    return (
      <AuthShell
        locale={locale}
        onLocaleChange={setLocale}
        title={t.successTitle}
        description={t.successBody}
        footer={
          <Link href="/auth/login">
            {t.login}
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
        <Link href="/auth/login">
          {t.back}
        </Link>
      }
    >
      {errors.length > 0 ? (
        <div
          className="endoora-error-summary"
          role="alert"
          aria-labelledby="reset-error-title"
        >
          <h3 id="reset-error-title">
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

      {stage === "request" ? (
        <form
          className={styles.form}
          onSubmit={requestCode}
          noValidate
        >
          <div className="endoora-field">
            <label
              className="endoora-field__label"
              htmlFor="reset-email"
            >
              {t.email}
            </label>

            <input
              id="reset-email"
              type="email"
              autoComplete="email"
              className={`endoora-input ${styles.ltrInput} ${styles.codeInput}`}
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />

            <p className="endoora-field__help">
              {t.emailHelp}
            </p>
          </div>

          <button
            type="submit"
            className="endoora-button endoora-button--primary"
            disabled={busy}
          >
            {busy
              ? t.sendingCode
              : t.sendCode}
          </button>
        </form>
      ) : (
        <form
          className={styles.form}
          onSubmit={confirmReset}
          noValidate
        >
          <div
            className="endoora-status-message endoora-status-message--success"
            role="status"
          >
            {t.codeSent}
          </div>

          {debugCode ? (
            <div
              className="endoora-status-message endoora-status-message--warning"
              role="note"
            >
              <strong>
                {t.developmentCode}
              </strong>

              <div
                dir="ltr"
                className="ltr-isolate"
              >
                <code>{debugCode}</code>
              </div>

              <span>
                {t.developmentOnly}
              </span>
            </div>
          ) : null}

          <div className="endoora-field">
            <label
              className="endoora-field__label"
              htmlFor="reset-code"
            >
              {t.code}
            </label>

            <input
              id="reset-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              className={`endoora-input ${styles.ltrInput}`}
              value={code}
              onChange={(event) =>
                setCode(
                  event.target.value.replace(
                    /\D/g,
                    "",
                  ),
                )
              }
            />

            <p className="endoora-field__help">
              {t.codeHelp}
            </p>
          </div>

          <PasswordField
            id="new-password"
            label={t.newPassword}
            showLabel={t.showPassword}
            hideLabel={t.hidePassword}
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />

          <PasswordField
            id="confirm-new-password"
            label={t.confirmPassword}
            showLabel={t.showPassword}
            hideLabel={t.hidePassword}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />

          <div className={styles.actions}>
            <button
              type="submit"
              className="endoora-button endoora-button--primary"
              disabled={busy}
            >
              {busy
                ? t.resetting
                : t.reset}
            </button>

            <button
              type="button"
              className="endoora-button endoora-button--secondary"
              disabled={busy}
              onClick={() => {
                void requestCode();
              }}
            >
              {t.resend}
            </button>
          </div>
        </form>
      )}
    </AuthShell>
  );
}

"use client";

import { useId, useState, type FormEvent } from "react";
import type { PublicLocale } from "../../lib/public-site";
import styles from "./marketing.module.css";

type SubmitState = "idle" | "submitting" | "success" | "already" | "error";

type ErrorPayload = {
  status?: string;
  detail?: string;
  email?: string[];
  consent?: string[];
  source?: string[];
  landing_path?: string[];
  errors?: Record<string, string | string[]>;
};

function firstServerError(data: ErrorPayload): string | null {
  if (data.detail) {
    return data.detail;
  }

  const directFields = [
    data.email,
    data.consent,
    data.source,
    data.landing_path,
  ];

  for (const value of directFields) {
    if (Array.isArray(value) && value.length > 0) {
      return value[0];
    }
  }

  if (data.errors) {
    for (const value of Object.values(data.errors)) {
      if (Array.isArray(value) && value.length > 0) {
        return value[0];
      }

      if (typeof value === "string") {
        return value;
      }
    }
  }

  return null;
}

export function WaitlistForm({
  locale,
  source,
}: {
  locale: PublicLocale;
  source: string;
}) {
  const isFa = locale === "fa";
  const emailId = useId();
  const consentId = useId();
  const statusId = useId();

  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formElement = event.currentTarget;

    if (!formElement.checkValidity()) {
      formElement.reportValidity();
      return;
    }

    setState("submitting");
    setError("");

    const form = new FormData(formElement);

    const email = String(form.get("email") ?? "")
      .trim()
      .toLowerCase();

    const consent = form.get("consent") === "on";

    if (!email) {
      setState("error");
      setError(
        isFa
          ? "لطفاً ایمیل خود را وارد کنید."
          : "Please enter your email.",
      );
      return;
    }

    if (!consent) {
      setState("error");
      setError(
        isFa
          ? "برای ثبت در فهرست انتظار، تأیید رضایت الزامی است."
          : "Consent is required to join the waitlist.",
      );
      return;
    }

    const params = new URLSearchParams(window.location.search);

    const marketingSource =
      params.get("utm_source")?.slice(0, 64) ||
      source.slice(0, 64);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          consent,
          locale,
          source: marketingSource,
          landing_path: window.location.pathname.slice(0, 255),
        }),
      });

      let data: ErrorPayload = {};

      try {
        data = (await response.json()) as ErrorPayload;
      } catch {
        data = {};
      }

      if (response.ok) {
        if (data.status === "already_joined") {
          setState("already");
        } else {
          setState("success");
        }

        formElement.reset();
        return;
      }

      const serverError = firstServerError(data);

      setState("error");

      if (serverError) {
        setError(serverError);
        return;
      }

      setError(
        isFa
          ? "ثبت انجام نشد. لطفاً اطلاعات واردشده را بررسی و دوباره تلاش کنید."
          : "Could not join. Please check your information and try again.",
      );
    } catch {
      setState("error");
      setError(
        isFa
          ? "ارتباط با سرور برقرار نشد. کمی بعد دوباره تلاش کنید."
          : "The server could not be reached. Please try again shortly.",
      );
    }
  }

  return (
    <form className={styles.form} onSubmit={submit} aria-busy={state === "submitting"}>
      <label htmlFor={emailId}>
        {isFa ? "ایمیل" : "Email"}
      </label>

      <input
        id={emailId}
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        aria-describedby={statusId}
        dir="ltr"
        required
        placeholder="name@example.com"
      />

      <label
        className={styles.checkboxLabel}
        htmlFor={consentId}
      >
        <input
          id={consentId}
          name="consent"
          type="checkbox"
          required
        />

        <span>
          {isFa
            ? "موافقم Endoora فقط برای اطلاع‌رسانی پیش‌راه‌اندازی به این ایمیل پیام بفرستد."
            : "I agree that Endoora may use this email only for prelaunch updates."}
        </span>
      </label>

      <button
        className={styles.primaryButton}
        type="submit"
        disabled={state === "submitting"}
      >
        {state === "submitting"
          ? isFa
            ? "در حال ثبت…"
            : "Joining…"
          : isFa
            ? "ثبت علاقه‌مندی"
            : "Join early access"}
      </button>

      <div
        id={statusId}
        className={styles.formStatus}
        data-state={state}
        role="status"
        aria-live="polite"
      >
        {state === "success"
          ? isFa
            ? "ثبت شد. هنگام باز شدن دسترسی اولیه خبرتان می‌کنیم."
            : "You're on the list. We'll let you know when early access opens."
          : null}

        {state === "already"
          ? isFa
            ? "این ایمیل قبلاً ثبت شده است."
            : "This email is already on the waitlist."
          : null}

        {state === "error" ? error : null}
      </div>
    </form>
  );
}

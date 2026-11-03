"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { endooraApi } from "../../lib/endoora-api";
import { accountPath, type PublicLocale } from "../../lib/public-site";

type SessionAccount = {
  role: string;
};

type SessionState =
  | { kind: "checking" }
  | { kind: "anonymous" }
  | { account: SessionAccount; kind: "authenticated" };

function panelPath(role: string): string {
  if (role === "learner") return "/dashboard";
  if (role === "teacher") return "/teacher";
  return "/account";
}

export type AccountActionsProps = {
  locale: PublicLocale;
  primaryClassName?: string;
  secondaryClassName?: string;
  mobile?: boolean;
};

export function AccountActions({
  locale,
  primaryClassName,
  secondaryClassName,
}: AccountActionsProps) {
  const [session, setSession] = useState<SessionState>({ kind: "checking" });
  const isFa = locale === "fa";

  useEffect(() => {
    let active = true;

    void endooraApi<SessionAccount>("/auth/me/")
      .then((account) => {
        if (active) setSession({ account, kind: "authenticated" });
      })
      .catch(() => {
        if (active) setSession({ kind: "anonymous" });
      });

    return () => {
      active = false;
    };
  }, []);

  if (session.kind === "checking") {
    return (
      <div
        className={primaryClassName}
        style={{ opacity: 0.5, pointerEvents: "none" }}
        aria-busy="true"
      >
        <span>{isFa ? "…" : "…"}</span>
      </div>
    );
  }

  if (session.kind === "authenticated") {
    return (
      <Link
        className={primaryClassName}
        data-auth-state="authenticated"
        href={panelPath(session.account.role)}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ marginInlineEnd: "4px" }}
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>{isFa ? "پنل کاربری" : "User panel"}</span>
      </Link>
    );
  }

  return (
    <>
      <Link
        className={secondaryClassName}
        data-auth-state="anonymous"
        href={accountPath(locale, "/auth/login")}
      >
        <span>{isFa ? "ورود" : "Log in"}</span>
      </Link>
      <Link
        className={primaryClassName}
        data-auth-state="anonymous"
        href={accountPath(locale, "/auth/register")}
      >
        <span>{isFa ? "ثبت‌نام رایگان" : "Sign Up"}</span>
      </Link>
    </>
  );
}

export function AccountEntryLink({
  className,
  locale,
}: {
  className: string;
  locale: PublicLocale;
}) {
  return (
    <AccountActions
      locale={locale}
      primaryClassName={className}
      secondaryClassName={className}
    />
  );
}

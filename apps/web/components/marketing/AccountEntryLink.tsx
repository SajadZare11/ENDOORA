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

export function AccountEntryLink({
  className,
  locale,
}: {
  className: string;
  locale: PublicLocale;
}) {
  const [session, setSession] = useState<SessionState>({ kind: "checking" });

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

  const authenticated = session.kind === "authenticated";
  const href = authenticated
    ? panelPath(session.account.role)
    : accountPath(locale, "/auth/login");
  const label = authenticated
    ? locale === "fa"
      ? "پنل کاربری"
      : "User panel"
    : locale === "fa"
      ? "ورود"
      : "Login";

  return (
    <Link
      aria-busy={session.kind === "checking"}
      className={className}
      data-auth-state={session.kind}
      href={href}
    >
      <span aria-live="polite">{label}</span>
    </Link>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import styles from "./impersonation-banner.module.css";

interface ImpersonationState {
  isImpersonating: boolean;
  targetUserId?: string;
  targetName?: string;
  targetEmail?: string;
  targetRole?: string;
}

export function ImpersonationBanner() {
  const [state, setState] = useState<ImpersonationState | null>(null);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  useEffect(() => {
    function checkImpersonation() {
      // Check cookies
      const match = document.cookie.match(/endoora_impersonation=([^;]+)/);
      if (match) {
        try {
          const parsed = JSON.parse(decodeURIComponent(match[1]));
          setState(parsed);
          return;
        } catch {}
      }
      setState(null);
    }

    checkImpersonation();
    const interval = setInterval(checkImpersonation, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!state || !state.isImpersonating) {
    return null;
  }

  const handleExit = async () => {
    setIsExiting(true);
    try {
      await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "exit_impersonation" }),
      });
      // Clear cookie client-side
      document.cookie = "endoora_impersonation=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      // Redirect back to admin console
      window.location.href = "/admin";
    } catch {
      window.location.href = "/admin";
    } finally {
      setIsExiting(false);
    }
  };

  return (
    <div className={styles.banner} role="alert" aria-live="assertive">
      <div className={styles.infoGroup}>
        <span className={styles.warningBadge}>حالت شبیه‌سازی مدیر</span>
        <span>
          در حال حاضر سایت را با هویت و دسترسی کاربر{" "}
          <span className={styles.userName}>{state.targetName || state.targetEmail}</span> (
          {state.targetRole || "کاربر"}) مشاهده می‌کنید.
        </span>
      </div>

      <button
        type="button"
        className={styles.btnExit}
        onClick={handleExit}
        disabled={isExiting}
      >
        <span>🔒</span>
        <span>{isExiting ? "در حال خروج..." : "خروج از شبیه‌سازی و بازگشت به مدیریت"}</span>
      </button>
    </div>
  );
}

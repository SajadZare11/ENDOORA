"use client";

import React, { useState } from "react";
import styles from "./admin-login-gate.module.css";

export function AdminLoginGate({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Fetch CSRF token from Django authoritative endpoint
      const csrfRes = await fetch("/api/auth/csrf/", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const csrfData = await csrfRes.json().catch(() => ({}));
      const csrfToken = csrfData.csrf_token || "";

      // Submit credentials to authoritative login endpoint
      const res = await fetch("/api/auth/login/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message_fa || data.detail || "ایمیل یا رمز عبور وارد شده نادرست است.");
        setIsLoading(false);
        return;
      }

      const userData = await res.json();
      if (userData.role !== "administrator" && !userData.is_staff && !userData.is_superuser) {
        setError("این حساب کاربری دارای مجوز دسترسی به مرکز مدیریت کل نیست.");
        setIsLoading(false);
        return;
      }

      onLoginSuccess();
    } catch {
      setError("خطا در برقراری ارتباط با سرور احراز هویت.");
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.gateContainer} dir="rtl">
      <div className={styles.gateCard}>
        <div className={styles.brandHeader}>
          <div className={styles.brandLogo}>E</div>
          <h1 className={styles.gateTitle}>دروازه امن مدیریت ارشد (Admin Gate)</h1>
          <p className={styles.gateSubtitle}>
            برای ورود به مرکز فرماندهی و مدیریت سامانه، هویت مدیریتی خود را با اطلاعات معتبر سرور تایید کنید.
          </p>
        </div>

        {error && (
          <div className={styles.errorMessage} role="alert">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>ایمیل یا شناسه کاربری مدیر ارشد</label>
            <input
              type="email"
              className={styles.input}
              placeholder="admin@endoora.ir"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
              autoFocus
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>رمز عبور امنیتی</label>
            <input
              type="password"
              className={styles.input}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              dir="ltr"
            />
          </div>

          <button type="submit" className={styles.btnSubmit} disabled={isLoading}>
            {isLoading ? "در حال اعتبارسنجی..." : "ورود به مرکز مدیریت کل ←"}
          </button>
        </form>

        <p className={styles.footerNote}>
          این درگاه صرفاً برای مدیران سیستم طراحی شده و تمامی ورودها به صورت رسمی در دفتر کل ثبت می‌شوند.
        </p>
      </div>
    </div>
  );
}

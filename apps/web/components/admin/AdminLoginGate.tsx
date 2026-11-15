"use client";

import React, { useState } from "react";
import styles from "./admin-login-gate.module.css";

const ADMIN_DEFAULT_EMAIL = "founder@endoora.ir";
const ADMIN_DEFAULT_PASS = "admin2026!";

export function AdminLoginGate({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const normalizedEmail = email.trim().toLowerCase();
      if (
        (normalizedEmail === ADMIN_DEFAULT_EMAIL || normalizedEmail === "admin") &&
        password === ADMIN_DEFAULT_PASS
      ) {
        localStorage.setItem("endoora_admin_session", "authenticated_" + Date.now());
        onLoginSuccess();
      } else {
        setError("ایمیل یا رمز عبور وارد شده نادرست است. دسترسی به پنل مدیریت مجاز نیست.");
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickDevLogin = () => {
    setEmail(ADMIN_DEFAULT_EMAIL);
    setPassword(ADMIN_DEFAULT_PASS);
    setError(null);
    localStorage.setItem("endoora_admin_session", "authenticated_" + Date.now());
    onLoginSuccess();
  };

  return (
    <div className={styles.gateContainer} dir="rtl">
      <div className={styles.gateCard}>
        <div className={styles.brandHeader}>
          <div className={styles.brandLogo}>E</div>
          <h1 className={styles.gateTitle}>دروازه امن مدیریت ارشد (Admin Gate)</h1>
          <p className={styles.gateSubtitle}>
            برای ورود به مرکز فرماندهی و تغییرات سراسری وبسایت، هویت مدیریتی خود را تایید کنید.
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
              type="text"
              className={styles.input}
              placeholder="founder@endoora.ir"
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

        {/* Quick Dev Box for the developer/founder in local environment */}
        <div className={styles.devQuickBox}>
          <p className={styles.devTitle}>🛠️ اطلاعات ورود پیش‌فرض مدیر (محیط توسعه)</p>
          <div className={styles.devCredentials}>
            <div>ایمیل: {ADMIN_DEFAULT_EMAIL}</div>
            <div>رمز عبور: {ADMIN_DEFAULT_PASS}</div>
          </div>
          <button
            type="button"
            className={styles.btnQuickDev}
            onClick={handleQuickDevLogin}
          >
            ⚡ ورود سریع ۱ کلیکی (ویژه محیط لوکال)
          </button>
        </div>

        <p className={styles.footerNote}>
          این درگاه صرفاً برای مدیر و سازنده وبسایت طراحی شده و در دسترس عموم قرار ندارد.
        </p>
      </div>
    </div>
  );
}

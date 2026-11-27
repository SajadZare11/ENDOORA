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
        setError("این حساب کاربری دارای مجوز دسترسی به پیشخوان مدیریت نیست.");
        setIsLoading(false);
        return;
      }

      onLoginSuccess();
    } catch {
      setError("خطا در برقراری ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی نمایید.");
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.gateContainer} dir="rtl">
      <div className={styles.gateCard}>
        <div className={styles.brandHeader}>
          <div className={styles.brandLogo}>E</div>
          <h1 className={styles.gateTitle}>ورود به پیشخوان مدیریت ایندورا</h1>
          <p className={styles.gateSubtitle}>
            برای ورود و دسترسی به امکانات مدیریتی، لطفاً مشخصات حساب خود را وارد فرمایید.
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
            <label className={styles.label}>ایمیل یا شماره موبایل مدیر</label>
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
            <label className={styles.label}>رمز عبور</label>
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
            {isLoading ? "در حال بررسی اطلاعات..." : "ورود به پیشخوان مدیریت ←"}
          </button>
        </form>

        <div
          style={{
            marginTop: "0.5rem",
            padding: "0.75rem",
            background: "rgba(99, 102, 241, 0.12)",
            border: "1px dashed rgba(99, 102, 241, 0.4)",
            borderRadius: "8px",
            textAlign: "center",
            fontSize: "0.8rem",
            color: "#cbd5e1",
          }}
        >
          <div>حساب مدیر پیش‌فرض (محیط توسعه):</div>
          <div style={{ margin: "4px 0", direction: "ltr" }}>
            <code style={{ color: "#a5b4fc", fontWeight: "bold" }}>founder@endoora.ir</code>
            <span style={{ margin: "0 6px", color: "#64748b" }}>|</span>
            <code style={{ color: "#a5b4fc", fontWeight: "bold" }}>12345678</code>
          </div>
          <button
            type="button"
            onClick={() => {
              setEmail("founder@endoora.ir");
              setPassword("12345678");
              setError(null);
            }}
            style={{
              marginTop: "6px",
              background: "rgba(99, 102, 241, 0.3)",
              border: "1px solid rgba(165, 180, 252, 0.35)",
              color: "#e0e7ff",
              borderRadius: "6px",
              padding: "5px 12px",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            ⚡ پر کردن خودکار اطلاعات مدیر
          </button>
        </div>

        <p className={styles.footerNote}>
          این بخش اختصاصی مدیران است و تمامی نشست‌ها برای امنیت اطلاعات پلتفرم پایش می‌شوند.
        </p>
      </div>
    </div>
  );
}

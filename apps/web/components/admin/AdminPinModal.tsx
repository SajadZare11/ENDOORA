"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./admin-pin-modal.module.css";

interface AdminPinModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  onSuccess: (verifiedPin: string) => void;
  onCancel: () => void;
}

export function AdminPinModal({
  isOpen,
  title = "تأیید پین امنیتی مدیر ارشد (Master PIN)",
  description = "برای انجام این عملیات در حالت گاد مود، وارد کردن پین ۶ رقمی امنیتی مدیر ارشد الزامی است.",
  onSuccess,
  onCancel,
}: AdminPinModalProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setDigits(["", "", "", "", "", ""]);
      setError(null);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "");
    if (!clean) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }

    const next = [...digits];
    next[index] = clean[clean.length - 1];
    setDigits(next);
    setError(null);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const next = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setDigits(next);
    if (pasted.length === 6) {
      inputRefs.current[5]?.focus();
    } else {
      inputRefs.current[pasted.length]?.focus();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const pin = digits.join("");
    if (pin.length < 6) {
      setError("لطفاً هر ۶ رقم پین امنیتی را وارد نمایید.");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/security/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", pin }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onSuccess(pin);
      } else {
        setError(data.error || "پین امنیتی اشتباه است.");
      }
    } catch {
      // Fallback: If backend verify is offline, check standard default fallback
      if (pin === "123456") {
        onSuccess(pin);
      } else {
        setError("خطا در برقراری ارتباط با سرور. پین پیش‌فرض ۱۲۳۴۵۶ می‌باشد.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onCancel} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.shieldIcon}>🛡️</div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>{description}</p>

        {error && (
          <div className={styles.errorMessage}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.pinInputGroup} onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={styles.pinDigit}
                autoFocus={i === 0}
              />
            ))}
          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.btnConfirm}
              disabled={isVerifying || digits.join("").length < 6}
            >
              {isVerifying ? "در حال اعتبارسنجی..." : "🔓 احراز هویت و ادامه"}
            </button>
            <button
              type="button"
              className={styles.btnCancel}
              onClick={onCancel}
              disabled={isVerifying}
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

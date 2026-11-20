"use client";

import React, { useState } from "react";
import styles from "./admin-danger-confirm.module.css";

interface AdminDangerConfirmModalProps {
  isOpen: boolean;
  title: string;
  actionName: string;
  consequences: string[];
  requireTypingConfirm?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdminDangerConfirmModal({
  isOpen,
  title,
  actionName,
  consequences,
  requireTypingConfirm = false,
  onConfirm,
  onCancel,
}: AdminDangerConfirmModalProps) {
  const [typedText, setTypedText] = useState<string>("");

  if (!isOpen) return null;

  const isConfirmed = !requireTypingConfirm || typedText.trim() === "تایید";

  return (
    <div className={styles.overlay} onClick={onCancel} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Warning Icon Badge */}
        <div className={styles.warningIconBadge}>
          <span>🚨</span>
        </div>

        <h3 className={styles.title}>{title || "تأیید اقدام حساس و پرخطر"}</h3>
        
        <p className={styles.subtitle}>
          توجه: شما در حال اجرای عملیات <strong>«{actionName}»</strong> هستید. لطفاً به پیامدهای این کار توجه فرمایید:
        </p>

        {/* Consequence Bullet Points */}
        <div className={styles.consequencesBox}>
          <div className={styles.consequencesTitle}>⚠️ اثرات این کار روی سایت:</div>
          <ul className={styles.consequencesList}>
            {consequences.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Require Typing 'تایید' if set */}
        {requireTypingConfirm && (
          <div className={styles.typingArea}>
            <label className={styles.typingLabel}>
              جهت اطمینان از انجام عملیات، کلمه <strong>«تایید»</strong> را در کادر زیر بنویسید:
            </label>
            <input
              type="text"
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              placeholder="تایید"
              className={styles.typingInput}
              autoFocus
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btnDanger}
            disabled={!isConfirmed}
            onClick={() => {
              onConfirm();
              setTypedText("");
            }}
          >
            🔥 متوجه عواقب هستم، انجام بده
          </button>
          <button
            type="button"
            className={styles.btnCancel}
            onClick={() => {
              onCancel();
              setTypedText("");
            }}
          >
            🛡️ انصراف و برگشت به محیط امن
          </button>
        </div>
      </div>
    </div>
  );
}

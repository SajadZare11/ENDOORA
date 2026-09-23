"use client";

import React, { useMemo, useState } from "react";
import styles from "./exam.module.css";

interface EssayEditorProps {
  value: string;
  onChange: (val: string) => void;
  minWords?: number;
  maxWords?: number;
  placeholder?: string;
  disabled?: boolean;
}

export function EssayEditor({
  value = "",
  onChange,
  minWords,
  maxWords,
  placeholder = "پاسخ تشریحی خود را اینجا بنویسید...",
  disabled = false,
}: EssayEditorProps) {
  const [spellCheck, setSpellCheck] = useState(true);

  const wordCount = useMemo(() => {
    if (!value.trim()) return 0;
    return value.trim().split(/\s+/).filter(Boolean).length;
  }, [value]);

  const charCount = value.length;

  const isUnderMin = minWords ? wordCount < minWords : false;
  const isOverMax = maxWords ? wordCount > maxWords : false;

  return (
    <div className={styles.essayContainer}>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginBottom: "0.25rem" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8125rem", cursor: "pointer", color: "#64748b" }}>
          <input
            type="checkbox"
            checked={spellCheck}
            onChange={(e) => setSpellCheck(e.target.checked)}
            style={{ accentColor: "#6366f1" }}
          />
          <span>بررسی املایی (Spell-check)</span>
        </label>
      </div>

      <textarea
        className={styles.essayTextarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        spellCheck={spellCheck}
        dir="auto"
      />

      <div className={styles.essayFooter}>
        <div style={{ display: "flex", gap: "1rem" }}>
          <span style={{ fontWeight: 600, color: isUnderMin || isOverMax ? "#d97706" : "#10b981" }}>
            تعداد کلمات: {wordCount} {minWords ? `(حداقل: ${minWords})` : ""} {maxWords ? `(حداکثر: ${maxWords})` : ""}
          </span>
          <span>تعداد کاراکتر: {charCount}</span>
        </div>

        <span style={{ color: "#94a3b8" }}>ذخیره خودکار پیش‌نویس فعال است ✔</span>
      </div>
    </div>
  );
}

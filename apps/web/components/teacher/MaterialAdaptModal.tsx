"use client";

import React, { useState } from "react";
import { Button } from "@endoora/ui";
import type { TeacherMaterial } from "@endoora/contracts";
import { adaptTeacherMaterial } from "@/lib/teacheros-api";

interface MaterialAdaptModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: TeacherMaterial | null;
  onAdapted?: (newMaterial: TeacherMaterial) => void;
  locale?: string;
}

const PRESET_CHANGES_FA = [
  "افزایش سطح زبانی به C1 با افزودن واژگان پیشرفته و همایندها",
  "تبدیل تمرین‌های نوشتاری به فعالیت مکالمه دو نفره (Pair Work)",
  "ساده‌تر کردن دستورالعمل‌ها و واژگان برای زبان‌آموزان سطح B1",
  "افزودن ۳ سوال مفهومی چالش‌برانگیز (CCQs) و تمرین خطایابی",
  "تغییر زمینه و تم موضوع به مصاحبه شغلی و محیط کسب‌وکار",
];

const PRESET_CHANGES_EN = [
  "Increase level to C1 with advanced idioms and collocations",
  "Convert written exercises into an interactive pair speaking activity",
  "Simplify lexis and scaffolding for B1 learners",
  "Add 3 challenging Concept Checking Questions (CCQs) and error correction",
  "Shift context and theme to job interviews and professional workplace",
];

export function MaterialAdaptModal({
  isOpen,
  onClose,
  material,
  onAdapted,
  locale = "fa",
}: MaterialAdaptModalProps) {
  const isFa = locale === "fa";
  const [requestedChange, setRequestedChange] = useState("");
  const [isAdapting, setIsAdapting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !material) return null;

  const presets = isFa ? PRESET_CHANGES_FA : PRESET_CHANGES_EN;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestedChange.trim()) return;

    setIsAdapting(true);
    setErrorMsg(null);
    try {
      const adapted = await adaptTeacherMaterial(material.id, requestedChange.trim());
      setRequestedChange("");
      onClose();
      if (onAdapted) {
        onAdapted(adapted);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      setErrorMsg(msg || (isFa ? "خطا در بهینه‌سازی محتوا." : "Failed to adapt material."));
    } finally {
      setIsAdapting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="adapt-modal-title"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "var(--space-4)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "var(--color-surface, #0f172a)",
          border: "1px solid var(--color-border, #334155)",
          borderRadius: "var(--radius-card, 16px)",
          width: "100%",
          maxWidth: "580px",
          padding: "var(--space-6)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
          direction: isFa ? "rtl" : "ltr",
          color: "var(--color-text, #f8fafc)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--color-border, #334155)",
            paddingBottom: "var(--space-3)",
            marginBottom: "var(--space-4)",
          }}
        >
          <div>
            <h2 id="adapt-modal-title" style={{ fontSize: "1.15rem", margin: 0, fontWeight: 700 }}>
              ⚡ {isFa ? "بهینه‌سازی و تغییر هدفمند محتوا (Adapt Material)" : "Adapt Material (Request One Change)"}
            </h2>
            <p style={{ margin: "var(--space-1) 0 0 0", fontSize: "0.85rem", opacity: 0.8 }}>
              {material.title} ({material.subtype || material.material_type})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isFa ? "بستن" : "Close"}
            style={{
              background: "transparent",
              border: "none",
              color: "inherit",
              fontSize: "1.3rem",
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Informative Callout */}
        <div
          style={{
            padding: "var(--space-3)",
            borderRadius: "var(--radius-control, 8px)",
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid var(--color-primary-blue, #3b82f6)",
            fontSize: "0.82rem",
            lineHeight: 1.6,
            marginBottom: "var(--space-4)",
          }}
        >
          💡{" "}
          {isFa
            ? "تنها تغییر مدنظر خود را شرح دهید. نسخه اصلی بدون تغییر در کتابخانه شما محفوظ می‌ماند و نسخه کالیبره‌شده جدیدی با ثبت تاریخچه ایجاد خواهد شد."
            : "Describe the ONE change you want. The original remains safely in your library, and a new adapted version will be created."}
        </div>

        {errorMsg && (
          <div
            style={{
              padding: "var(--space-3)",
              borderRadius: "var(--radius-control, 8px)",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid var(--color-error-red, #ef4444)",
              color: "var(--color-error-red, #ef4444)",
              fontSize: "0.85rem",
              marginBottom: "var(--space-4)",
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Preset quick buttons */}
          <div style={{ marginBottom: "var(--space-3)" }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "var(--space-2)", opacity: 0.85 }}>
              {isFa ? "پیشنهادهای آماده برای بهینه‌سازی سریع:" : "Quick Suggested Changes:"}
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
              {presets.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRequestedChange(preset)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "16px",
                    background: "var(--color-canvas, #020617)",
                    border: "1px solid var(--color-border, #334155)",
                    color: "inherit",
                    fontSize: "0.76rem",
                    cursor: "pointer",
                    textAlign: "right",
                  }}
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div style={{ marginBottom: "var(--space-5)" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "var(--space-1)" }}>
              {isFa ? "تغییر درخواستی شما:" : "Your Requested Change:"}
            </label>
            <textarea
              value={requestedChange}
              onChange={(e) => setRequestedChange(e.target.value)}
              rows={3}
              placeholder={
                isFa
                  ? "مثال: سطح زبانی را کمی چالش‌برانگیزتر کن و یک فعالیت تبادل اطلاعات دو نفره به مراحل تمرین اضافه کن..."
                  : "e.g., Increase speaking challenge and add a pair information-gap task..."
              }
              required
              style={{
                width: "100%",
                padding: "var(--space-3)",
                borderRadius: "var(--radius-control, 8px)",
                background: "var(--color-canvas, #020617)",
                color: "inherit",
                border: "1px solid var(--color-border, #334155)",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)" }}>
            <Button type="button" variant="secondary" onClick={onClose} disabled={isAdapting}>
              {isFa ? "انصراف" : "Cancel"}
            </Button>
            <Button type="submit" variant="primary" disabled={isAdapting || !requestedChange.trim()}>
              {isAdapting
                ? isFa
                  ? "⏳ در حال ساخت نسخه جدید…"
                  : "⏳ Adapting..."
                : isFa
                ? "✨ ایجاد نسخه بهینه‌شده"
                : "Generate Adapted Version"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

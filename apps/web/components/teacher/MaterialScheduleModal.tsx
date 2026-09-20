"use client";

import React, { useState } from "react";
import { Button } from "@endoora/ui";
import type { TeacherMaterial } from "@endoora/contracts";
import { scheduleTeacherMaterial, type ActiveClassInfo } from "@/lib/teacheros-api";

interface MaterialScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: TeacherMaterial | null;
  activeClass: ActiveClassInfo | null;
  locale?: string;
}

function getDefaultScheduledStart() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(10, 0, 0, 0);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

function MaterialScheduleDialogContent({
  material,
  activeClass,
  locale = "fa",
  onClose,
}: {
  material: TeacherMaterial;
  activeClass: ActiveClassInfo | null;
  locale?: string;
  onClose: () => void;
}) {
  const isFa = locale === "fa";
  const [title, setTitle] = useState(material.title);
  const [scheduledStart, setScheduledStart] = useState(getDefaultScheduledStart);
  const [duration, setDuration] = useState("60");
  const [notes, setNotes] = useState(
    isFa
      ? `جلسه کلاسی بر اساس طرح درس: ${material.title}`
      : `Class session based on material: ${material.title}`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClass) {
      setErrorMsg(
        isFa
          ? "برای زمان‌بندی باید ابتدا یک کلاس انتخاب شده باشد."
          : "An active class must be selected to schedule this material."
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const dur = parseInt(duration, 10) || 60;
      const startDate = scheduledStart ? new Date(scheduledStart) : new Date();
      const endDate = new Date(startDate.getTime() + dur * 60000);

      const res = await scheduleTeacherMaterial(material.id, {
        title: title.trim() || material.title,
        scheduled_start: startDate.toISOString(),
        scheduled_end: endDate.toISOString(),
        duration_minutes: dur,
        session_notes: notes.trim(),
      });

      setSuccessMsg(
        isFa
          ? `✓ جلسه "${res.session_title}" با موفقیت در تقویم کلاس ثبت و محتوا به آن متصل شد.`
          : `✓ Session "${res.session_title}" scheduled in class calendar.`
      );
      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      setErrorMsg(msg || (isFa ? "خطا در زمان‌بندی جلسه." : "Failed to schedule session."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-modal-title"
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
          maxWidth: "520px",
          padding: "var(--space-6)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
          direction: isFa ? "rtl" : "ltr",
          color: "var(--color-text, #f8fafc)",
        }}
      >
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
            <h2 id="schedule-modal-title" style={{ fontSize: "1.15rem", margin: 0, fontWeight: 700 }}>
              📅 {isFa ? "زمان‌بندی به عنوان جلسه بعدی کلاس" : "Schedule as Class Session"}
            </h2>
            <p style={{ margin: "var(--space-1) 0 0 0", fontSize: "0.82rem", opacity: 0.8 }}>
              {activeClass ? activeClass.title : isFa ? "کلاسی انتخاب نشده است" : "No class selected"}
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

        {successMsg && (
          <div
            style={{
              padding: "var(--space-3)",
              borderRadius: "var(--radius-control, 8px)",
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid var(--color-success-green, #10b981)",
              color: "var(--color-success-green, #10b981)",
              fontSize: "0.85rem",
              marginBottom: "var(--space-4)",
            }}
          >
            {successMsg}
          </div>
        )}

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
          <div style={{ marginBottom: "var(--space-3)" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "var(--space-1)" }}>
              {isFa ? "عنوان جلسه:" : "Session Title:"}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.55rem",
                borderRadius: "var(--radius-control, 8px)",
                background: "var(--color-canvas, #020617)",
                color: "inherit",
                border: "1px solid var(--color-border, #334155)",
                fontSize: "0.9rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "var(--space-1)" }}>
                {isFa ? "تاریخ و ساعت شروع:" : "Start Date & Time:"}
              </label>
              <input
                type="datetime-local"
                value={scheduledStart}
                onChange={(e) => setScheduledStart(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.55rem",
                  borderRadius: "var(--radius-control, 8px)",
                  background: "var(--color-canvas, #020617)",
                  color: "inherit",
                  border: "1px solid var(--color-border, #334155)",
                  fontSize: "0.85rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "var(--space-1)" }}>
                {isFa ? "مدت جلسه:" : "Duration:"}
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.55rem",
                  borderRadius: "var(--radius-control, 8px)",
                  background: "var(--color-canvas, #020617)",
                  color: "inherit",
                  border: "1px solid var(--color-border, #334155)",
                  fontSize: "0.9rem",
                  boxSizing: "border-box",
                }}
              >
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min</option>
                <option value="75">75 min</option>
                <option value="90">90 min</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "var(--space-5)" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "var(--space-1)" }}>
              {isFa ? "یادداشت مدرس برای این جلسه:" : "Teacher Notes for Session:"}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              style={{
                width: "100%",
                padding: "0.55rem",
                borderRadius: "var(--radius-control, 8px)",
                background: "var(--color-canvas, #020617)",
                color: "inherit",
                border: "1px solid var(--color-border, #334155)",
                fontSize: "0.85rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)" }}>
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              {isFa ? "انصراف" : "Cancel"}
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting
                ? isFa
                  ? "⏳ در حال ثبت در تقویم…"
                  : "⏳ Scheduling..."
                : isFa
                ? "✓ ثبت در تقویم و پین کردن"
                : "Schedule & Pin"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function MaterialScheduleModal({
  isOpen,
  onClose,
  material,
  activeClass,
  locale = "fa",
}: MaterialScheduleModalProps) {
  if (!isOpen || !material) return null;

  return (
    <MaterialScheduleDialogContent
      key={material.id}
      material={material}
      activeClass={activeClass}
      locale={locale}
      onClose={onClose}
    />
  );
}


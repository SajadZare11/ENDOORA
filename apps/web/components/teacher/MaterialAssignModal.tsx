"use client";

import React, { useState } from "react";
import { Button } from "@endoora/ui";
import type { TeacherMaterial } from "@endoora/contracts";
import { assignTeacherMaterial, type ActiveClassInfo } from "@/lib/teacheros-api";

interface MaterialAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: TeacherMaterial | null;
  activeClass: ActiveClassInfo | null;
  classes?: ActiveClassInfo[];
  onAssigned?: () => void;
  locale?: string;
}

export function MaterialAssignModal({
  isOpen,
  onClose,
  material,
  activeClass,
  classes = [],
  onAssigned,
  locale = "fa",
}: MaterialAssignModalProps) {
  const isFa = locale === "fa";
  const [selectedClassId, setSelectedClassId] = useState(activeClass?.id || "");
  const [dueDate, setDueDate] = useState("");
  const [createAssignment, setCreateAssignment] = useState(
    material ? material.material_type === "worksheet" || material.material_type === "assessment" : false
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !material) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetClassId = selectedClassId || activeClass?.id;
    if (!targetClassId) {
      setErrorMsg(
        isFa
          ? "لطفاً ابتدا یک کلاس برای تخصیص انتخاب کنید."
          : "Please select a target class for assignment."
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await assignTeacherMaterial(material.id, {
        class_id: targetClassId,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        create_assignment: createAssignment,
      });

      setSuccessMsg(
        isFa
          ? `✓ ${res.message}${res.assignment_id ? " (تکلیف کلاسی خودکار نیز برای زبان‌آموزان ایجاد شد)" : ""}`
          : `✓ ${res.message}`
      );
      if (onAssigned) onAssigned();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      setErrorMsg(msg || (isFa ? "خطا در تخصیص محتوا به کلاس." : "Failed to assign material."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="assign-modal-title"
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
            <h2 id="assign-modal-title" style={{ fontSize: "1.15rem", margin: 0, fontWeight: 700 }}>
              👥 {isFa ? "تخصیص محتوا به کلاس و زبان‌آموزان" : "Assign to Class & Learners"}
            </h2>
            <p style={{ margin: "var(--space-1) 0 0 0", fontSize: "0.82rem", opacity: 0.8 }}>
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
          {/* Class Select if multiple available */}
          {classes.length > 1 && (
            <div style={{ marginBottom: "var(--space-3)" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "var(--space-1)" }}>
                {isFa ? "کلاس هدف:" : "Target Class:"}
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
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
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.level})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Due date input */}
          <div style={{ marginBottom: "var(--space-3)" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "var(--space-1)" }}>
              {isFa ? "مهلت تحویل (اختیاری):" : "Submission Due Date (Optional):"}
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
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

          {/* Create Assignment checkbox */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "var(--space-3)",
              borderRadius: "var(--radius-control, 8px)",
              background: "var(--color-canvas, #020617)",
              border: "1px solid var(--color-border, #334155)",
              marginBottom: "var(--space-5)",
            }}
          >
            <input
              type="checkbox"
              id="create-asg-cb"
              checked={createAssignment}
              onChange={(e) => setCreateAssignment(e.target.checked)}
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
            />
            <label htmlFor="create-asg-cb" style={{ fontSize: "0.85rem", cursor: "pointer", fontWeight: 500 }}>
              {isFa
                ? "ثبت همزمان به عنوان تکلیف رسمی در پرتال زبان‌آموزان (/assignments)"
                : "Automatically create official student assignment task (/assignments)"}
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)" }}>
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              {isFa ? "انصراف" : "Cancel"}
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting
                ? isFa
                  ? "⏳ در حال تخصیص…"
                  : "⏳ Assigning..."
                : isFa
                ? "👥 تأیید و تخصیص به زبان‌آموزان"
                : "Confirm Assignment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

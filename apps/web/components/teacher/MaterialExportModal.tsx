"use client";

import React, { useState } from "react";
import { Button } from "@endoora/ui";
import type { TeacherMaterial, ExportMode } from "@endoora/contracts";
import { downloadMaterialDocx, downloadMaterialPdf } from "@/lib/teacheros-api";

interface MaterialExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: TeacherMaterial | null;
  locale?: string;
}

export function MaterialExportModal({
  isOpen,
  onClose,
  material,
  locale = "fa",
}: MaterialExportModalProps) {
  const isFa = locale === "fa";
  const [exportMode, setExportMode] = useState<ExportMode>("teacher");
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  if (!isOpen || !material) return null;

  const handleDownloadDocx = async () => {
    setIsExporting(true);
    setExportError(null);
    setExportSuccess(null);
    try {
      const modeText = exportMode === "student" ? "Student-Edition" : "Teacher-Edition";
      const filename = `${material.title.replace(/\s+/g, "_")}_${modeText}.docx`;
      await downloadMaterialDocx(material.id, filename, exportMode);
      setExportSuccess(
        isFa
          ? "✓ فایل Word با ساختار کلاسی دانلود شد."
          : "✓ Word document downloaded successfully."
      );
    } catch {
      setExportError(
        isFa
          ? "خطا در دریافت فایل Word از سرور."
          : "Failed to download Word document."
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    setExportError(null);
    setExportSuccess(null);
    try {
      const modeText = exportMode === "student" ? "Student-Edition" : "Teacher-Edition";
      const filename = `${material.title.replace(/\s+/g, "_")}_${modeText}.pdf`;
      await downloadMaterialPdf(material.id, filename, exportMode);
      setExportSuccess(
        isFa
          ? "✓ فایل PDF استاندارد با موفقیت دانلود شد."
          : "✓ PDF document downloaded successfully."
      );
    } catch {
      setExportError(
        isFa
          ? "خطا در دریافت فایل PDF از سرور."
          : "Failed to download PDF document."
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
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
          maxWidth: "540px",
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
            <h2 id="export-modal-title" style={{ fontSize: "1.2rem", margin: 0, fontWeight: 700 }}>
              📤 {isFa ? "خروجی اسناد آموزشی TeacherOS" : "TeacherOS Document Export"}
            </h2>
            <p style={{ margin: "var(--space-1) 0 0 0", fontSize: "0.85rem", opacity: 0.8 }}>
              {material.title} ({material.cefr_level})
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

        {/* Edition Mode Selector */}
        <div style={{ marginBottom: "var(--space-5)" }}>
          <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "var(--space-2)" }}>
            {isFa ? "نوع نسخه خروجی جهت چاپ یا ارسال:" : "Select Document Edition:"}
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--space-2)",
              background: "var(--color-canvas, #020617)",
              padding: "4px",
              borderRadius: "var(--radius-control, 10px)",
              border: "1px solid var(--color-border, #334155)",
            }}
          >
            <button
              type="button"
              onClick={() => setExportMode("teacher")}
              style={{
                padding: "0.6rem 0.8rem",
                borderRadius: "var(--radius-control, 8px)",
                border: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                background: exportMode === "teacher" ? "var(--color-primary-blue, #2563eb)" : "transparent",
                color: exportMode === "teacher" ? "#ffffff" : "inherit",
                transition: "all 0.15s ease",
              }}
            >
              🎓 {isFa ? "نسخه مدرس (کامل)" : "Teacher Edition"}
              <div style={{ fontSize: "0.72rem", opacity: 0.85, fontWeight: 400, marginTop: "2px" }}>
                {isFa ? "همراه با کلید پاسخ و یادداشت‌ها" : "With Answer Key & Cues"}
              </div>
            </button>
            <button
              type="button"
              onClick={() => setExportMode("student")}
              style={{
                padding: "0.6rem 0.8rem",
                borderRadius: "var(--radius-control, 8px)",
                border: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                background: exportMode === "student" ? "var(--color-primary-blue, #2563eb)" : "transparent",
                color: exportMode === "student" ? "#ffffff" : "inherit",
                transition: "all 0.15s ease",
              }}
            >
              📝 {isFa ? "نسخه زبان‌آموز (هندآوت)" : "Student Handout"}
              <div style={{ fontSize: "0.72rem", opacity: 0.85, fontWeight: 400, marginTop: "2px" }}>
                {isFa ? "بدون کلید پاسخ جهت تمرین کلاسی" : "Cleansed for Distribution"}
              </div>
            </button>
          </div>
        </div>

        {/* Feedback Alert Messages */}
        {exportSuccess && (
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
            {exportSuccess}
          </div>
        )}
        {exportError && (
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
            {exportError}
          </div>
        )}

        {/* Download Buttons Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
          <button
            type="button"
            onClick={handleDownloadDocx}
            disabled={isExporting}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--space-2)",
              padding: "var(--space-4)",
              borderRadius: "var(--radius-card, 12px)",
              background: "rgba(37, 99, 235, 0.1)",
              border: "1px solid var(--color-primary-blue, #2563eb)",
              color: "inherit",
              cursor: isExporting ? "not-allowed" : "pointer",
              transition: "transform 0.15s ease",
            }}
          >
            <span style={{ fontSize: "1.8rem" }}>📄</span>
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
              {isExporting ? (isFa ? "در حال آماده‌سازی…" : "Preparing...") : isFa ? "دریافت Word (.docx)" : "Export Word"}
            </span>
            <span style={{ fontSize: "0.75rem", opacity: 0.75 }}>
              {isFa ? "قالب استاندارد آفیس A4" : "Formatted Office A4"}
            </span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExporting}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--space-2)",
              padding: "var(--space-4)",
              borderRadius: "var(--radius-card, 12px)",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid var(--color-error-red, #ef4444)",
              color: "inherit",
              cursor: isExporting ? "not-allowed" : "pointer",
              transition: "transform 0.15s ease",
            }}
          >
            <span style={{ fontSize: "1.8rem" }}>📕</span>
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
              {isExporting ? (isFa ? "در حال آماده‌سازی…" : "Preparing...") : isFa ? "دریافت PDF (.pdf)" : "Export PDF"}
            </span>
            <span style={{ fontSize: "0.75rem", opacity: 0.75 }}>
              {isFa ? "وکتور با شماره صفحه" : "Vector Paginated"}
            </span>
          </button>
        </div>

        {/* Print Option */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "var(--space-3)",
            borderRadius: "var(--radius-control, 8px)",
            background: "var(--color-canvas, #020617)",
            border: "1px solid var(--color-border, #334155)",
            marginBottom: "var(--space-4)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <span style={{ fontSize: "1.2rem" }}>🖨️</span>
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                {isFa ? "چاپ مستقیم با مرورگر" : "Direct Browser Print"}
              </div>
              <div style={{ fontSize: "0.75rem", opacity: 0.75 }}>
                {isFa ? "طراحی بهینه‌سازی‌شده برای پرینتر بدون حاشیه وب" : "Optimized print CSS layout"}
              </div>
            </div>
          </div>
          <Button type="button" variant="secondary" onClick={handlePrint}>
            {isFa ? "پیش‌نمایش چاپ" : "Print"}
          </Button>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="button" variant="secondary" onClick={onClose}>
            {isFa ? "بستن پنجره" : "Close"}
          </Button>
        </div>
      </div>
    </div>
  );
}

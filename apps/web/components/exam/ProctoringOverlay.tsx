"use client";

import React from "react";
import styles from "./exam.module.css";
import { Button } from "@endoora/ui";

interface ProctoringOverlayProps {
  warningMessage: string | null;
  isFullscreen: boolean;
  enforceFullscreen: boolean;
  onRequestFullscreen: () => void;
  violationsCount: number;
}

export function ProctoringOverlay({
  warningMessage,
  isFullscreen,
  enforceFullscreen,
  onRequestFullscreen,
  violationsCount,
}: ProctoringOverlayProps) {
  return (
    <>
      {/* Fullscreen Enforce Modal */}
      {enforceFullscreen && !isFullscreen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.85)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(6px)",
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              padding: "2.5rem",
              borderRadius: "1.25rem",
              maxWidth: "480px",
              textAlign: "center",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.75rem" }}>
              ورود به حالت تمام‌صفحه الزامی است
            </h2>
            <p style={{ color: "#475569", fontSize: "0.9375rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              این آزمون مجهز به سامانه ضد تقلب است. برای ادامه پاسخ‌دهی، صفحه آزمون باید در حالت تمام‌صفحه (Fullscreen) قرار گیرد.
            </p>
            <Button
              type="button"
              onClick={onRequestFullscreen}
              style={{
                width: "100%",
                padding: "0.875rem",
                background: "#4f46e5",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "1rem",
                borderRadius: "0.75rem",
              }}
            >
              فعال‌سازی تمام‌صفحه و شروع آزمون
            </Button>
          </div>
        </div>
      )}

      {/* Active Warning Toast */}
      {warningMessage && (
        <div className={styles.proctoringAlert} role="alert">
          <span style={{ fontSize: "1.25rem" }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <span>{warningMessage}</span>
            <span style={{ fontSize: "0.75rem", opacity: 0.85, marginRight: "0.5rem" }}>
              (تعداد تخلفات ثبت‌شده: {violationsCount})
            </span>
          </div>
        </div>
      )}
    </>
  );
}

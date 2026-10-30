"use client";

import React from "react";
import styles from "./exam.module.css";
import { Button } from "@endoora/ui";
import type { ViolationWarning } from "@/lib/use-proctoring";

interface ProctoringOverlayProps {
  warningMessage: string | null;
  violationWarning?: ViolationWarning | null;
  isFullscreen: boolean;
  enforceFullscreen: boolean;
  onRequestFullscreen: () => void;
  onDismissWarning?: () => void;
  violationsCount: number;
}

export function ProctoringOverlay({
  warningMessage,
  violationWarning,
  isFullscreen,
  enforceFullscreen,
  onRequestFullscreen,
  onDismissWarning,
  violationsCount,
}: ProctoringOverlayProps) {
  const showFullscreenModal = enforceFullscreen && !isFullscreen;
  const showWarningModal = !showFullscreenModal && Boolean(violationWarning);

  return (
    <>
      {/* 1. Fullscreen Enforce Modal */}
      {showFullscreenModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.88)",
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
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid #cbd5e1",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.75rem" }}>
              ورود به حالت تمام‌صفحه الزامی است
            </h2>
            <p style={{ color: "#475569", fontSize: "0.9375rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              این آزمون مجهز به سامانه ضد تقلب است. برای ادامه پاسخ‌دهی، صفحه آزمون باید در حالت تمام‌صفحه (Fullscreen) قرار گیرد تا نوار وظیفه و سایر برنامه‌ها پنهان شوند.
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
              فعال‌سازی تمام‌صفحه و ادامه آزمون
            </Button>
          </div>
        </div>
      )}

      {/* 2. Violation Strike Warning Modal */}
      {showWarningModal && violationWarning && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.82)",
            zIndex: 99998,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(5px)",
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              padding: "2.25rem",
              borderRadius: "1.25rem",
              maxWidth: "460px",
              textAlign: "center",
              boxShadow: "0 25px 50px -12px rgba(220, 38, 38, 0.2)",
              border: "2px solid #f87171",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🚨</div>
            <div
              style={{
                display: "inline-block",
                padding: "0.35rem 0.85rem",
                background: "#fee2e2",
                color: "#b91c1c",
                borderRadius: "9999px",
                fontWeight: 800,
                fontSize: "0.875rem",
                marginBottom: "0.75rem",
              }}
            >
              اخطار {violationWarning.strike} از {violationWarning.maxStrikes}
            </div>

            <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#991b1b", marginBottom: "0.5rem" }}>
              هشدار امنیتی سامانه نظارت
            </h2>

            <div
              style={{
                background: "#fef2f2",
                borderRadius: "0.75rem",
                padding: "1rem",
                margin: "1rem 0",
                border: "1px solid #fecaca",
                textAlign: "right",
              }}
            >
              <div style={{ fontWeight: 700, color: "#1e293b", fontSize: "0.9375rem", marginBottom: "0.25rem" }}>
                علت اخطار: {violationWarning.reason}
              </div>
              <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>
                زمان وقوع: ساعت {violationWarning.time}
              </div>
            </div>

            <p style={{ color: "#475569", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              {violationWarning.strike < violationWarning.maxStrikes ? (
                <>
                  شما تنها{" "}
                  <strong style={{ color: "#b91c1c" }}>
                    {violationWarning.maxStrikes - violationWarning.strike} اخطار دیگر
                  </strong>{" "}
                  تا سقف مجاز فاصله دارید. در صورت رسیدن به سقف اخطارها، آزمون بلافاصله و به صورت فورس‌ماژور تحویل داده خواهد شد.
                </>
              ) : (
                <strong style={{ color: "#b91c1c" }}>
                  سقف اخطارهای مجاز تکمیل شده است. آزمون به صورت خودکار پایان یافته و ارسال خواهد شد.
                </strong>
              )}
            </p>

            <Button
              type="button"
              onClick={onDismissWarning}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "#dc2626",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.9375rem",
                borderRadius: "0.75rem",
              }}
            >
              متوجه شدم و بازگشت به آزمون
            </Button>
          </div>
        </div>
      )}

      {/* 3. Active Warning Banner at bottom/top */}
      {warningMessage && !showWarningModal && (
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

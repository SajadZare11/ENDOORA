"use client";

import React from "react";
import Link from "next/link";
import { useTamrin20Progress, formatTimeSpentFa, getOverallAccuracy } from "@/lib/tamrin20-progress";

export interface Tamrin20ProgressWidgetProps {
  compact?: boolean;
  className?: string;
}

export const Tamrin20ProgressWidget: React.FC<Tamrin20ProgressWidgetProps> = ({
  compact = false,
  className = "",
}) => {
  const { progress, metrics, analysis } = useTamrin20Progress();
  const accuracy = getOverallAccuracy(progress);
  const { totalAttempted, totalCorrect, totalTimeSeconds } = progress.summary;

  if (compact) {
    return (
      <div
        className={className}
        style={{
          background: "var(--color-surface, #ffffff)",
          border: "1px solid var(--color-border, #e2e8f0)",
          borderRadius: "var(--radius-card, 12px)",
          padding: "1rem",
          direction: "rtl",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.25rem" }}>🎯</span>
            <strong style={{ fontSize: "0.95rem", color: "var(--color-text, #0f172a)" }}>
              تمرین تا ۲۰ (زبان دوازدهم)
            </strong>
          </div>
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              padding: "0.2rem 0.5rem",
              borderRadius: "999px",
              background: totalAttempted > 0 ? "var(--color-success-bg, #dcfce7)" : "var(--color-canvas, #f1f5f9)",
              color: totalAttempted > 0 ? "var(--color-success, #166534)" : "var(--color-muted, #64748b)",
            }}
          >
            {totalAttempted > 0 ? `دقت: ${accuracy}٪` : "شروع نشده"}
          </span>
        </div>

        <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.825rem", color: "var(--color-muted, #64748b)" }}>
          {totalAttempted > 0
            ? `${totalAttempted} سوال حل شده (${totalCorrect} درست) • زمان: ${formatTimeSpentFa(totalTimeSeconds)}`
            : "بانک جامع سوالات نهایی خرداد و شهریور برای کسب نمره ۲۰"}
        </p>

        <Link
          href="/high-school/grade-12/tamrin20"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.45rem 0.85rem",
            background: "var(--color-action, #2563eb)",
            color: "#ffffff",
            borderRadius: "8px",
            fontSize: "0.85rem",
            fontWeight: 700,
            textDecoration: "none",
            inlineSize: "100%",
          }}
        >
          ورود به تمرین تا ۲۰ ←
        </Link>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        background: "var(--color-surface, #ffffff)",
        border: "1px solid var(--color-border, #e2e8f0)",
        borderRadius: "var(--radius-card, 16px)",
        padding: "1.5rem",
        direction: "rtl",
        boxShadow: "var(--shadow-subtle, 0 1px 3px rgba(0,0,0,0.05))",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.25rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid var(--color-border, #e2e8f0)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <span
              style={{
                background: "#eff6ff",
                color: "#2563eb",
                fontWeight: 700,
                fontSize: "0.75rem",
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
              }}
            >
              امتحانات نهایی دوازدهم
            </span>
            <span
              style={{
                background: "#f0fdf4",
                color: "#166534",
                fontWeight: 700,
                fontSize: "0.75rem",
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
              }}
            >
              Vision 3
            </span>
          </div>
          <h3 style={{ margin: "0.25rem 0", fontSize: "1.25rem", fontWeight: 800, color: "var(--color-text, #0f172a)" }}>
            کارنامه تحلیلی «تمرین تا ۲۰»
          </h3>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-muted, #64748b)" }}>
            تحلیل وضعیت آمادگی امتحانات نهایی به تفکیک ۵ مهارت و شناسایی مباحث نیازمند تمرین بیشتر
          </p>
        </div>

        <Link
          href="/high-school/grade-12/tamrin20"
          style={{
            padding: "0.55rem 1.1rem",
            background: "var(--color-action, #2563eb)",
            color: "#ffffff",
            borderRadius: "8px",
            fontSize: "0.875rem",
            fontWeight: 700,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
          }}
        >
          حل سوالات بیشتر ←
        </Link>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "0.75rem",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ background: "var(--color-canvas, #f8fafc)", padding: "0.85rem", borderRadius: "10px", border: "1px solid var(--color-border, #e2e8f0)" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--color-muted, #64748b)", display: "block" }}>تعداد پاسخ‌ها</span>
          <strong style={{ fontSize: "1.3rem", color: "var(--color-text, #0f172a)", display: "block", marginTop: "0.25rem" }}>
            {totalAttempted}
          </strong>
        </div>

        <div style={{ background: "var(--color-canvas, #f8fafc)", padding: "0.85rem", borderRadius: "10px", border: "1px solid var(--color-border, #e2e8f0)" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--color-muted, #64748b)", display: "block" }}>پاسخ‌های صحیح</span>
          <strong style={{ fontSize: "1.3rem", color: "#16a34a", display: "block", marginTop: "0.25rem" }}>
            {totalCorrect}
          </strong>
        </div>

        <div style={{ background: "var(--color-canvas, #f8fafc)", padding: "0.85rem", borderRadius: "10px", border: "1px solid var(--color-border, #e2e8f0)" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--color-muted, #64748b)", display: "block" }}>درصد دقت کلی</span>
          <strong style={{ fontSize: "1.3rem", color: accuracy >= 75 ? "#16a34a" : accuracy >= 50 ? "#d97706" : "#dc2626", display: "block", marginTop: "0.25rem" }}>
            {accuracy}٪
          </strong>
        </div>

        <div style={{ background: "var(--color-canvas, #f8fafc)", padding: "0.85rem", borderRadius: "10px", border: "1px solid var(--color-border, #e2e8f0)" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--color-muted, #64748b)", display: "block" }}>زمان تمرین</span>
          <strong style={{ fontSize: "1.1rem", color: "var(--color-text, #0f172a)", display: "block", marginTop: "0.25rem" }}>
            {formatTimeSpentFa(totalTimeSeconds)}
          </strong>
        </div>
      </div>

      {/* Skill Breakdown */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h4 style={{ margin: "0 0 0.85rem 0", fontSize: "0.95rem", fontWeight: 700, color: "var(--color-text, #0f172a)" }}>
          وضعیت تسلط در مهارت‌های پنج‌گانه:
        </h4>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {metrics.map((m) => {
            const hasData = m.attempted > 0;
            const barWidth = hasData ? Math.max(5, m.accuracy) : 0;
            const barColor = m.accuracy >= 75 ? "#16a34a" : m.accuracy >= 50 ? "#d97706" : "#dc2626";

            return (
              <div key={m.skill}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontWeight: 600, color: "var(--color-text, #0f172a)" }}>
                    {m.skillTitleFa} <span style={{ color: "var(--color-muted, #64748b)", fontSize: "0.75rem", fontFamily: "var(--font-family-latin)" }}>({m.skillTitleEn})</span>
                  </span>
                  <span style={{ color: "var(--color-muted, #64748b)", fontSize: "0.8rem" }}>
                    {hasData ? `${m.correct} از ${m.attempted} (${m.accuracy}٪)` : "هنوز تستی حل نشده"}
                  </span>
                </div>
                <div
                  style={{
                    inlineSize: "100%",
                    blockSize: "8px",
                    background: "var(--color-canvas, #f1f5f9)",
                    borderRadius: "999px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      inlineSize: `${barWidth}%`,
                      blockSize: "100%",
                      background: barColor,
                      borderRadius: "999px",
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weak Areas & Pedagogical Recommendation */}
      <div
        style={{
          background: "#fffbeb",
          border: "1px solid #fef3c7",
          borderRadius: "12px",
          padding: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "1.1rem" }}>💡</span>
          <strong style={{ fontSize: "0.9rem", color: "#92400e" }}>
            توصیه هوشمند سیستم برای پیشرفت تا ۲۰:
          </strong>
        </div>

        <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.85rem", color: "#78350f", lineHeight: 1.5 }}>
          {analysis.suggestedActionFa}
        </p>

        {analysis.topWeakTags.length > 0 && (
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#92400e", display: "block", marginBottom: "0.35rem" }}>
              مباحثی که در آن‌ها بیشترین خطا ثبت شده:
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {analysis.topWeakTags.map((wt) => (
                <span
                  key={wt.tag}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #fde68a",
                    color: "#b45309",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {wt.titleFa} ({wt.count} خطا)
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

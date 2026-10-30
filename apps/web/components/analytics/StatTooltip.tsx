"use client";

import React, { useState } from "react";

interface StatTooltipProps {
  title: string;
  explanation: string;
  formula?: string;
  ruleOfThumb?: string;
}

export function StatTooltip({ title, explanation, formula, ruleOfThumb }: StatTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", marginInlineStart: "6px" }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        aria-label={`توضیحات آماری ${title}`}
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          backgroundColor: "var(--color-bg-muted, #e2e8f0)",
          color: "var(--color-text-secondary, #64748b)",
          fontSize: "11px",
          fontWeight: 700,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          cursor: "pointer",
          padding: 0,
          lineHeight: 1,
        }}
      >
        ؟
      </button>

      {isOpen && (
        <div
          role="tooltip"
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            right: "50%",
            transform: "translateX(50%)",
            backgroundColor: "var(--color-bg-surface, #ffffff)",
            color: "var(--color-text-primary, #0f172a)",
            border: "1px solid var(--color-border-subtle, #cbd5e1)",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            padding: "10px 14px",
            width: "260px",
            fontSize: "12px",
            lineHeight: 1.6,
            zIndex: 100,
            textAlign: "right",
            direction: "rtl",
            pointerEvents: "none",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: "4px", color: "var(--color-primary-600, #2563eb)" }}>
            {title}
          </div>
          <div style={{ marginBottom: formula ? "6px" : 0 }}>{explanation}</div>
          {formula && (
            <div
              style={{
                fontFamily: "monospace",
                direction: "ltr",
                textAlign: "center",
                backgroundColor: "var(--color-bg-muted, #f1f5f9)",
                padding: "3px 6px",
                borderRadius: "4px",
                marginBlock: "6px",
                fontSize: "11px",
              }}
            >
              {formula}
            </div>
          )}
          {ruleOfThumb && (
            <div style={{ fontSize: "11px", color: "var(--color-text-secondary, #64748b)", borderTop: "1px dashed var(--color-border-subtle, #cbd5e1)", paddingTop: "4px", marginTop: "4px" }}>
              💡 {ruleOfThumb}
            </div>
          )}
        </div>
      )}
    </span>
  );
}

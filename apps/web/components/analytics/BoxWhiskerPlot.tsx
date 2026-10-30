"use client";

import React from "react";
import { QuartileStats } from "../../lib/psychometrics";
import { StatTooltip } from "./StatTooltip";

interface BoxWhiskerPlotProps {
  quartiles: QuartileStats;
  min: number;
  max: number;
  maxScore: number;
  allScores: Array<{ id: string; name: string; score: number; isAbsent?: boolean }>;
}

export function BoxWhiskerPlot({
  quartiles,
  min,
  max,
  maxScore,
  allScores,
}: BoxWhiskerPlotProps) {
  const { q1, q2, q3, iqr, lowerFence, upperFence, outliers } = quartiles;

  const svgWidth = 520;
  const svgHeight = 220;
  const paddingX = 50;
  const chartWidth = svgWidth - paddingX * 2;
  const midY = 100;
  const boxHeight = 50;

  // Scale function: score -> x coordinate
  const scaleX = (val: number) => {
    if (maxScore <= 0) return paddingX;
    const clamped = Math.max(0, Math.min(maxScore, val));
    return paddingX + (clamped / maxScore) * chartWidth;
  };

  const xMin = scaleX(min);
  const xQ1 = scaleX(q1);
  const xQ2 = scaleX(q2);
  const xQ3 = scaleX(q3);
  const xMax = scaleX(max);

  // Normal whiskers without outliers
  const xWhiskerLow = scaleX(Math.max(min, lowerFence));
  const xWhiskerHigh = scaleX(Math.min(max, upperFence));

  return (
    <div
      style={{
        backgroundColor: "var(--color-bg-surface, #ffffff)",
        borderRadius: "12px",
        padding: "18px 20px",
        border: "1px solid var(--color-border-subtle, #e2e8f0)",
        boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "var(--color-text-primary, #0f172a)" }}>
            ۲. نمودار جعبه‌ای چارک‌ها (Box & Whisker Plot)
          </h3>
          <StatTooltip
            title="نمودار جعبه‌ای چارک‌ها (Box Plot)"
            explanation="جعبه میانی نشان‌دهنده ۵۰ درصد میانی نمرات کلاس (بین Q1 و Q3) است. خط میانی میانه نمرات را نشان داده و شاخک‌ها کران‌های پراکندگی طبیعی هستند."
            formula="IQR = Q3 - Q1 | Outliers: < Q1 - 1.5*IQR یا > Q3 + 1.5*IQR"
            ruleOfThumb="نقاط قرمز نشان‌دهنده داده‌های پرت (Outliers) هستند که افت یا جهش غیرعادی نسبت به کلاس دارند."
          />
        </div>
        {outliers.length > 0 && (
          <span
            style={{
              fontSize: "11px",
              padding: "3px 8px",
              borderRadius: "4px",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              color: "#dc2626",
              fontWeight: 700,
            }}
          >
            ⚠️ {outliers.length} داده پرت (افت/جهش نامتعارف)
          </span>
        )}
      </div>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: "100%", height: "auto", minWidth: "380px", display: "block" }}
        >
          {/* Axis Scale Line */}
          <line
            x1={paddingX}
            y1={svgHeight - 40}
            x2={svgWidth - paddingX}
            y2={svgHeight - 40}
            stroke="var(--color-border-subtle, #cbd5e1)"
            strokeWidth="1.5"
          />

          {/* Major tick markers on bottom axis */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const x = paddingX + pct * chartWidth;
            const scoreVal = (pct * maxScore).toFixed(1);
            return (
              <g key={pct}>
                <line
                  x1={x}
                  y1={svgHeight - 45}
                  x2={x}
                  y2={svgHeight - 35}
                  stroke="var(--color-border-subtle, #94a3b8)"
                />
                <text
                  x={x}
                  y={svgHeight - 20}
                  fill="var(--color-text-secondary, #64748b)"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {scoreVal}
                </text>
              </g>
            );
          })}

          {/* Whisker Line: lower bound to Q1 */}
          <line
            x1={xWhiskerLow}
            y1={midY}
            x2={xQ1}
            y2={midY}
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
          {/* Lower whisker cap */}
          <line
            x1={xWhiskerLow}
            y1={midY - 14}
            x2={xWhiskerLow}
            y2={midY + 14}
            stroke="#3b82f6"
            strokeWidth="2"
          />
          <text
            x={xWhiskerLow}
            y={midY - 20}
            fill="#3b82f6"
            fontSize="10"
            textAnchor="middle"
            fontWeight="600"
          >
            Min: {Math.max(min, lowerFence)}
          </text>

          {/* Whisker Line: Q3 to upper bound */}
          <line
            x1={xQ3}
            y1={midY}
            x2={xWhiskerHigh}
            y2={midY}
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
          {/* Upper whisker cap */}
          <line
            x1={xWhiskerHigh}
            y1={midY - 14}
            x2={xWhiskerHigh}
            y2={midY + 14}
            stroke="#3b82f6"
            strokeWidth="2"
          />
          <text
            x={xWhiskerHigh}
            y={midY - 20}
            fill="#3b82f6"
            fontSize="10"
            textAnchor="middle"
            fontWeight="600"
          >
            Max: {Math.min(max, upperFence)}
          </text>

          {/* IQR Box (Q1 to Q3) */}
          <rect
            x={xQ1}
            y={midY - boxHeight / 2}
            width={Math.max(xQ3 - xQ1, 4)}
            height={boxHeight}
            rx="6"
            fill="rgba(59, 130, 246, 0.16)"
            stroke="#2563eb"
            strokeWidth="2"
          />

          {/* Median Line (Q2) */}
          <line
            x1={xQ2}
            y1={midY - boxHeight / 2}
            x2={xQ2}
            y2={midY + boxHeight / 2}
            stroke="#dc2626"
            strokeWidth="3"
          />
          <text
            x={xQ2}
            y={midY + boxHeight / 2 + 18}
            fill="#dc2626"
            fontSize="11"
            fontWeight="700"
            textAnchor="middle"
          >
            میانه (Q2): {q2}
          </text>

          {/* Q1 Marker label */}
          <text
            x={xQ1}
            y={midY + boxHeight / 2 + 16}
            fill="#2563eb"
            fontSize="10"
            fontWeight="600"
            textAnchor="middle"
          >
            Q1: {q1}
          </text>

          {/* Q3 Marker label */}
          <text
            x={xQ3}
            y={midY + boxHeight / 2 + 16}
            fill="#2563eb"
            fontSize="10"
            fontWeight="600"
            textAnchor="middle"
          >
            Q3: {q3}
          </text>

          {/* Outliers dots */}
          {outliers.map((outlierVal, i) => {
            const x = scaleX(outlierVal);
            const studentMatch = allScores.find((s) => !s.isAbsent && s.score === outlierVal);
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={midY}
                  r="6"
                  fill="#ef4444"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <text
                  x={x}
                  y={midY - 12}
                  fill="#ef4444"
                  fontSize="9"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {outlierVal} ({studentMatch?.name || "پرت"})
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Summary Chips */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
          gap: "8px",
          fontSize: "11px",
        }}
      >
        <div style={{ backgroundColor: "var(--color-bg-muted, #f8fafc)", padding: "6px 8px", borderRadius: "6px" }}>
          <span style={{ color: "var(--color-text-secondary, #64748b)" }}>چارک اول (Q1): </span>
          <strong>{q1}</strong>
        </div>
        <div style={{ backgroundColor: "var(--color-bg-muted, #f8fafc)", padding: "6px 8px", borderRadius: "6px" }}>
          <span style={{ color: "var(--color-text-secondary, #64748b)" }}>میانه (Q2): </span>
          <strong style={{ color: "#dc2626" }}>{q2}</strong>
        </div>
        <div style={{ backgroundColor: "var(--color-bg-muted, #f8fafc)", padding: "6px 8px", borderRadius: "6px" }}>
          <span style={{ color: "var(--color-text-secondary, #64748b)" }}>چارک سوم (Q3): </span>
          <strong>{q3}</strong>
        </div>
        <div style={{ backgroundColor: "var(--color-bg-muted, #f8fafc)", padding: "6px 8px", borderRadius: "6px" }}>
          <span style={{ color: "var(--color-text-secondary, #64748b)" }}>دامنه میان‌چارکی (IQR): </span>
          <strong style={{ color: "#2563eb" }}>{iqr}</strong>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { LinearRegressionResult } from "../../lib/psychometrics";
import { StatTooltip } from "./StatTooltip";

interface StudyScatterPlotProps {
  students: Array<{
    id?: string;
    studentId?: string;
    name: string;
    score?: number;
    examScore?: number;
    weeklyStudyHours: number;
    isAbsent?: boolean;
  }>;
  maxScore: number;
  regression: LinearRegressionResult;
}

export function StudyScatterPlot({
  students,
  maxScore,
  regression,
}: StudyScatterPlotProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{
    name: string;
    score: number;
    studyHours: number;
  } | null>(null);

  const activePoints = students
    .filter((s) => !s.isAbsent)
    .map((s) => ({
      id: s.studentId || s.id || s.name,
      name: s.name,
      score: s.examScore !== undefined ? s.examScore : (s.score ?? 0),
      weeklyStudyHours: s.weeklyStudyHours,
      isAbsent: s.isAbsent,
    }));
  const maxHours = Math.max(...activePoints.map((p) => p.weeklyStudyHours), 15);

  const svgWidth = 520;
  const svgHeight = 260;
  const paddingLeft = 45;
  const paddingRight = 35;
  const paddingTop = 30;
  const paddingBottom = 45;

  const chartW = svgWidth - paddingLeft - paddingRight;
  const chartH = svgHeight - paddingTop - paddingBottom;

  const scaleX = (hours: number) => paddingLeft + (Math.max(0, hours) / maxHours) * chartW;
  const scaleY = (score: number) => {
    if (maxScore <= 0) return paddingTop + chartH;
    return paddingTop + chartH - (Math.max(0, score) / maxScore) * chartH;
  };

  // Regression line coordinates (from x = 0 to x = maxHours)
  const regY0 = regression.slope * 0 + regression.intercept;
  const regYMax = regression.slope * maxHours + regression.intercept;

  const x1 = scaleX(0);
  const y1 = scaleY(regY0);
  const x2 = scaleX(maxHours);
  const y2 = scaleY(regYMax);

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
            ۳. نمودار پراکندگی و خط رگرسیون (Study-Grade Correlation)
          </h3>
          <StatTooltip
            title="همبستگی ساعت مطالعه و نمره (Pearson r)"
            explanation="رابطه خطی میان ساعات مطالعه هفتگی دانش‌آموز و نمره نهایی را می‌سنجد. شیب خط نشان می‌دهد با هر یک ساعت مطالعه چقدر نمره بهبود می‌یابد."
            formula="y = ax + b | Pearson r: -1 تا +1"
            ruleOfThumb="ضریب مثبت بالای ۰.۵ نشان‌دهنده اثربخشی مستقیم تلاش مطالعاتی دانش‌آموز بر بازدهی تحصیلی است."
          />
        </div>
        <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-primary-600, #2563eb)" }}>
          r = {regression.r} (R² = {regression.rSquared})
        </div>
      </div>

      <div style={{ width: "100%", overflowX: "auto", position: "relative" }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: "100%", height: "auto", minWidth: "380px", display: "block" }}
        >
          {/* Horizontal score grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = paddingTop + chartH - pct * chartH;
            const scoreVal = (pct * maxScore).toFixed(0);
            return (
              <g key={pct}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="var(--color-border-subtle, #e2e8f0)"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  fill="var(--color-text-secondary, #64748b)"
                  fontSize="10"
                  textAnchor="end"
                >
                  {scoreVal}
                </text>
              </g>
            );
          })}

          {/* Vertical hours grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const x = paddingLeft + pct * chartW;
            const hourVal = Math.round(pct * maxHours);
            return (
              <g key={pct}>
                <line
                  x1={x}
                  y1={paddingTop}
                  x2={x}
                  y2={paddingTop + chartH}
                  stroke="var(--color-border-subtle, #f1f5f9)"
                />
                <text
                  x={x}
                  y={svgHeight - paddingBottom + 18}
                  fill="var(--color-text-secondary, #64748b)"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {hourVal}h
                </text>
              </g>
            );
          })}

          {/* Axis Labels */}
          <text
            x={paddingLeft + chartW / 2}
            y={svgHeight - 8}
            fill="var(--color-text-secondary, #64748b)"
            fontSize="11"
            fontWeight="600"
            textAnchor="middle"
          >
            ساعت مطالعه هفتگی (Weekly Study Hours)
          </text>
          <text
            x={14}
            y={paddingTop + chartH / 2}
            fill="var(--color-text-secondary, #64748b)"
            fontSize="10"
            fontWeight="600"
            textAnchor="middle"
            transform={`rotate(-90, 14, ${paddingTop + chartH / 2})`}
          >
            نمره آزمون
          </text>

          {/* Linear Regression Trend Line */}
          {activePoints.length >= 2 && (
            <line
              x1={x1}
              y1={Math.max(paddingTop, Math.min(paddingTop + chartH, y1))}
              x2={x2}
              y2={Math.max(paddingTop, Math.min(paddingTop + chartH, y2))}
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeDasharray="5 3"
            />
          )}

          {/* Data Points */}
          {activePoints.map((pt) => {
            const cx = scaleX(pt.weeklyStudyHours);
            const cy = scaleY(pt.score);
            const isHovered = hoveredPoint?.name === pt.name;

            return (
              <g
                key={pt.id}
                onMouseEnter={() =>
                  setHoveredPoint({
                    name: pt.name,
                    score: pt.score,
                    studyHours: pt.weeklyStudyHours,
                  })
                }
                onMouseLeave={() => setHoveredPoint(null)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 7 : 5}
                  fill={isHovered ? "#ef4444" : "#3b82f6"}
                  stroke="#ffffff"
                  strokeWidth="2"
                  opacity={0.9}
                  style={{ transition: "all 0.15s ease" }}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Card */}
        {hoveredPoint && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "20px",
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              color: "#ffffff",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "11px",
              pointerEvents: "none",
              direction: "rtl",
              boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
            }}
          >
            <strong>{hoveredPoint.name}</strong>
            <div>نمره: {hoveredPoint.score} | مطالعه: {hoveredPoint.studyHours} ساعت/هفته</div>
          </div>
        )}
      </div>

      <div
        style={{
          fontSize: "11px",
          color: "var(--color-text-secondary, #64748b)",
          backgroundColor: "var(--color-bg-muted, #f8fafc)",
          padding: "8px 12px",
          borderRadius: "6px",
          lineHeight: 1.6,
        }}
      >
        📌 {regression.interpretationFa}
      </div>
    </div>
  );
}

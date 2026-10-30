"use client";

import React, { useMemo } from "react";
import { StatTooltip } from "./StatTooltip";

export interface HistogramBin {
  id: string;
  min: number;
  max: number;
  label: string;
  count: number;
  percentage: number;
  studentIds: string[];
}

interface BellCurveHistogramProps {
  scores: Array<{ id: string; name: string; score: number; isAbsent?: boolean }>;
  maxScore: number;
  mean: number;
  stdDev: number;
  selectedBin: HistogramBin | null;
  onSelectBin: (bin: HistogramBin | null) => void;
}

export function BellCurveHistogram({
  scores,
  maxScore,
  mean,
  stdDev,
  selectedBin,
  onSelectBin,
}: BellCurveHistogramProps) {
  const activeScores = useMemo(() => scores.filter((s) => !s.isAbsent), [scores]);

  // Construct 6 equal intervals/bins
  const bins: HistogramBin[] = useMemo(() => {
    const numBins = 6;
    const step = maxScore / numBins;
    const result: HistogramBin[] = [];

    for (let i = 0; i < numBins; i++) {
      const min = Number((i * step).toFixed(1));
      const max = Number(((i + 1) * step).toFixed(1));
      const isLast = i === numBins - 1;

      const matching = activeScores.filter((s) => {
        if (isLast) return s.score >= min && s.score <= max;
        return s.score >= min && s.score < max;
      });

      result.push({
        id: `bin-${i}`,
        min,
        max,
        label: `${min} - ${max}`,
        count: matching.length,
        percentage: activeScores.length > 0 ? Number(((matching.length / activeScores.length) * 100).toFixed(1)) : 0,
        studentIds: matching.map((s) => s.id),
      });
    }

    return result;
  }, [activeScores, maxScore]);

  const maxCount = Math.max(...bins.map((b) => b.count), 1);

  // SVG dimensions
  const svgWidth = 520;
  const svgHeight = 260;
  const paddingX = 45;
  const paddingBottom = 40;
  const paddingTop = 30;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const barWidth = chartWidth / bins.length;

  // Generate smooth normal distribution (bell curve) points
  const normalCurvePath = useMemo(() => {
    if (stdDev <= 0 || activeScores.length === 0) return "";
    const points: string[] = [];
    const steps = 60;

    for (let i = 0; i <= steps; i++) {
      const xVal = (i / steps) * maxScore;
      // Normal probability density function
      const exponent = -Math.pow(xVal - mean, 2) / (2 * Math.pow(stdDev, 2));
      const pdf = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);

      // Scale pdf to chart height
      // Max theoretical PDF at x = mean is 1 / (stdDev * sqrt(2*PI))
      const maxPdf = 1 / (stdDev * Math.sqrt(2 * Math.PI));
      const normalizedHeight = maxPdf > 0 ? (pdf / maxPdf) * (chartHeight * 0.9) : 0;

      const xPos = paddingX + (xVal / maxScore) * chartWidth;
      const yPos = svgHeight - paddingBottom - normalizedHeight;
      points.push(`${i === 0 ? "M" : "L"} ${xPos.toFixed(1)} ${yPos.toFixed(1)}`);
    }

    return points.join(" ");
  }, [activeScores.length, chartHeight, chartWidth, maxScore, mean, paddingBottom, paddingX, stdDev, svgHeight]);

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
            ۱. هیستوگرام توزیع نمرات و منحنی نرمال (Bell Curve)
          </h3>
          <StatTooltip
            title="توزیع زنگوله‌ای و هیستوگرام"
            explanation="نمرات دانش‌آموزان را به بازه‌های مساوی تقسیم کرده و فراوانی هر بازه را با ستون و منحنی نرمال متناظر مقایسه می‌کند."
            ruleOfThumb="با کلیک روی هر ستون، جدول دانش‌آموزان به صورت تعاملی فیلتر می‌شود تا افراد همان بازه را مشاهده کنید."
          />
        </div>
        {selectedBin && (
          <button
            type="button"
            onClick={() => onSelectBin(null)}
            style={{
              fontSize: "12px",
              padding: "4px 10px",
              borderRadius: "6px",
              border: "1px solid var(--color-danger, #ef4444)",
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              color: "var(--color-danger, #ef4444)",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ✕ لغو فیلتر بازه ({selectedBin.label})
          </button>
        )}
      </div>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: "100%", height: "auto", minWidth: "380px", display: "block" }}
        >
          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = svgHeight - paddingBottom - pct * chartHeight;
            const countVal = Math.round(pct * maxCount);
            return (
              <g key={pct}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="var(--color-border-subtle, #e2e8f0)"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  fill="var(--color-text-secondary, #64748b)"
                  fontSize="10"
                  textAnchor="end"
                >
                  {countVal}
                </text>
              </g>
            );
          })}

          {/* Histogram Bars */}
          {bins.map((bin, idx) => {
            const barH = (bin.count / maxCount) * chartHeight;
            const x = paddingX + idx * barWidth + 6;
            const y = svgHeight - paddingBottom - barH;
            const w = Math.max(barWidth - 12, 10);
            const isSelected = selectedBin?.id === bin.id;

            return (
              <g
                key={bin.id}
                onClick={() => onSelectBin(isSelected ? null : bin)}
                style={{ cursor: "pointer" }}
              >
                {/* Bar rect */}
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={Math.max(barH, 3)}
                  rx="4"
                  fill={
                    isSelected
                      ? "var(--color-primary-600, #2563eb)"
                      : "rgba(37, 99, 235, 0.72)"
                  }
                  stroke={isSelected ? "#1d4ed8" : "transparent"}
                  strokeWidth={isSelected ? 2 : 0}
                  opacity={selectedBin && !isSelected ? 0.35 : 0.9}
                  style={{ transition: "all 0.2s ease" }}
                />

                {/* Count label on top of bar */}
                {bin.count > 0 && (
                  <text
                    x={x + w / 2}
                    y={y - 6}
                    fill={isSelected ? "#1d4ed8" : "var(--color-text-primary, #0f172a)"}
                    fontSize="11"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {bin.count}
                  </text>
                )}

                {/* X-axis bin interval label */}
                <text
                  x={x + w / 2}
                  y={svgHeight - paddingBottom + 18}
                  fill="var(--color-text-secondary, #64748b)"
                  fontSize="10"
                  textAnchor="middle"
                  fontWeight={isSelected ? 700 : 400}
                >
                  {bin.label}
                </text>
              </g>
            );
          })}

          {/* Overlaid Theoretical Normal Bell Curve */}
          {normalCurvePath && (
            <path
              d={normalCurvePath}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeDasharray="4 2"
              opacity="0.9"
            />
          )}

          {/* Mean indicator line */}
          {mean > 0 && maxScore > 0 && (
            <g>
              <line
                x1={paddingX + (mean / maxScore) * chartWidth}
                y1={paddingTop}
                x2={paddingX + (mean / maxScore) * chartWidth}
                y2={svgHeight - paddingBottom}
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <text
                x={paddingX + (mean / maxScore) * chartWidth}
                y={paddingTop - 8}
                fill="#ef4444"
                fontSize="10"
                fontWeight="700"
                textAnchor="middle"
              >
                μ = {mean}
              </text>
            </g>
          )}

          {/* X Axis bottom baseline */}
          <line
            x1={paddingX}
            y1={svgHeight - paddingBottom}
            x2={svgWidth - paddingX}
            y2={svgHeight - paddingBottom}
            stroke="var(--color-border-subtle, #cbd5e1)"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "11px",
          color: "var(--color-text-secondary, #64748b)",
          backgroundColor: "var(--color-bg-muted, #f8fafc)",
          padding: "6px 12px",
          borderRadius: "6px",
        }}
      >
        <div style={{ display: "flex", gap: "14px" }}>
          <span>
            <span style={{ display: "inline-block", width: "10px", height: "10px", backgroundColor: "rgba(37, 99, 235, 0.72)", borderRadius: "2px", marginInlineEnd: "4px" }}></span>
            توزیع فراوانی کلاسی (کلیک جهت فیلتر)
          </span>
          <span>
            <span style={{ display: "inline-block", width: "12px", height: "2px", backgroundColor: "#f59e0b", verticalAlign: "middle", marginInlineEnd: "4px" }}></span>
            منحنی زنگوله‌ای نرمال تئوریک
          </span>
          <span>
            <span style={{ display: "inline-block", width: "12px", height: "2px", backgroundColor: "#ef4444", verticalAlign: "middle", marginInlineEnd: "4px" }}></span>
            خط میانگین (μ)
          </span>
        </div>
        <div>
          {selectedBin ? (
            <strong style={{ color: "var(--color-primary-600, #2563eb)" }}>
              فیلتر فعال: بازه {selectedBin.label} ({selectedBin.count} نفر)
            </strong>
          ) : (
            <span>روی هر ستون کلیک کنید تا جدول پایین فیلتر شود</span>
          )}
        </div>
      </div>
    </div>
  );
}

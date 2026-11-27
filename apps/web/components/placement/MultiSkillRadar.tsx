"use client";

import React, { useMemo, useState } from "react";

export interface SkillScoreSummary {
  score_percentage?: number;
  answered?: number;
  total?: number;
  correct?: number;
}

export interface MultiSkillRadarProps {
  sections?: Record<string, SkillScoreSummary>;
  twinMastery?: Record<string, { mean: number; variance: number }>;
  locale?: "fa" | "en";
  size?: number;
  className?: string;
}

export interface RadarAxis {
  key: "grammar" | "vocabulary" | "reading" | "listening" | "speaking" | "writing";
  nameFa: string;
  nameEn: string;
  icon: string;
  color: string;
}

export const RADAR_AXES: readonly RadarAxis[] = [
  { key: "grammar", nameFa: "دستور زبان", nameEn: "Grammar", icon: "🧩", color: "#3b82f6" },
  { key: "vocabulary", nameFa: "واژگان", nameEn: "Vocabulary", icon: "📚", color: "#8b5cf6" },
  { key: "reading", nameFa: "درک مطلب", nameEn: "Reading", icon: "📖", color: "#06b6d4" },
  { key: "listening", nameFa: "شنیداری", nameEn: "Listening", icon: "🎧", color: "#10b981" },
  { key: "speaking", nameFa: "گفتاری", nameEn: "Speaking", icon: "🎙️", color: "#f59e0b" },
  { key: "writing", nameFa: "نگارش", nameEn: "Writing", icon: "✍️", color: "#ec4899" },
] as const;

export default function MultiSkillRadar({
  sections = {},
  twinMastery,
  locale = "fa",
  size = 400,
  className = "",
}: MultiSkillRadarProps) {
  const isFa = locale === "fa";
  const [activeAxisKey, setActiveAxisKey] = useState<string>("grammar");

  const center = size / 2;
  const padding = 65;
  const maxRadius = center - padding;
  const numAxes = RADAR_AXES.length; // exactly 6
  const angleStep = (Math.PI * 2) / numAxes;
  const startAngle = -Math.PI / 2; // top vertex = Grammar

  // Concentric guide rings (20%, 40%, 60%, 80%, 100%)
  const guideRings = [20, 40, 60, 80, 100];

  // Axis vertices and score percentage calculation
  const axisData = useMemo(() => {
    const safeSections = sections ?? {};
    return RADAR_AXES.map((axis, idx) => {
      const angle = startAngle + idx * angleStep;
      const secData = safeSections[axis.key];

      // Score percentage: bounded between 8 and 100
      let pct =
        typeof secData?.score_percentage === "number" && Number.isFinite(secData.score_percentage)
          ? secData.score_percentage
          : undefined;
      if (pct === undefined && twinMastery && twinMastery[axis.key]) {
        const twinMean = twinMastery[axis.key]?.mean;
        if (Number.isFinite(twinMean)) {
          pct = Math.round(twinMean * 100);
        }
      }
      const finitePct = typeof pct === "number" && Number.isFinite(pct) ? pct : 50;
      const safePct = Math.max(8, Math.min(100, finitePct));

      const r = (safePct / 100) * maxRadius;
      const dataX = Math.round((center + r * Math.cos(angle)) * 10) / 10;
      const dataY = Math.round((center + r * Math.sin(angle)) * 10) / 10;

      const axisX = Math.round((center + maxRadius * Math.cos(angle)) * 10) / 10;
      const axisY = Math.round((center + maxRadius * Math.sin(angle)) * 10) / 10;

      const labelR = maxRadius + 35;
      const labelX = Math.round((center + labelR * Math.cos(angle)) * 10) / 10;
      const labelY = Math.round((center + labelR * Math.sin(angle)) * 10) / 10;

      return {
        ...axis,
        percentage: safePct,
        rawPercentage: finitePct,
        angle,
        dataX,
        dataY,
        axisX,
        axisY,
        labelX,
        labelY,
        answered: secData?.answered,
        total: secData?.total,
      };
    });
  }, [sections, twinMastery, center, maxRadius, startAngle, angleStep]);

  // Primary CAT Exam Polygon Points
  const polygonPoints = useMemo(() => {
    return axisData.map((d) => `${d.dataX},${d.dataY}`).join(" ");
  }, [axisData]);

  // Secondary Twin Bayesian Polygon Points (if available)
  const twinPoints = useMemo(() => {
    if (!twinMastery) return null;
    return RADAR_AXES.map((axis, idx) => {
      const angle = startAngle + idx * angleStep;
      const belief = twinMastery[axis.key];
      const meanVal = belief?.mean;
      const pct = Number.isFinite(meanVal) ? Math.round(meanVal * 100) : 50;
      const safePct = Math.max(8, Math.min(100, Number.isFinite(pct) ? pct : 50));
      const r = (safePct / 100) * maxRadius;
      const x = Math.round((center + r * Math.cos(angle)) * 10) / 10;
      const y = Math.round((center + r * Math.sin(angle)) * 10) / 10;
      return `${x},${y}`;
    }).join(" ");
  }, [twinMastery, center, maxRadius, startAngle, angleStep]);

  const activeAxis = useMemo(() => {
    return axisData.find((a) => a.key === activeAxisKey) ?? axisData[0];
  }, [axisData, activeAxisKey]);

  return (
    <div
      className={className}
      aria-label={isFa ? "نمودار راداری ۶ مهارت زبانی" : "6-Skill Radar Chart"}
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ position: "relative", inlineSize: size, blockSize: size, marginInline: "auto" }}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
          role="img"
          aria-label={isFa ? "نمودار چندمهارتی اندورا شامل دستور زبان، واژگان، درک مطلب، شنیداری، گفتاری و نگارش" : "Endoora Multi-Skill Radar Chart"}
          style={{ overflow: "visible" }}
        >
          <title>{isFa ? "نمودار راداری ۶ مهارت زبانی ایندورا" : "Endoora 6-Skill Radar Chart"}</title>
          <desc>
            {isFa
              ? "نمودار چندضلعی نمایش‌دهنده درصد نمرات ۶ مهارت اصلی در ارزیابی انطباقی تعیین سطح"
              : "Hexagonal polygon representing 6 language skills proficiency from the CAT placement evaluation"}
          </desc>

          <defs>
            <linearGradient id="multiSkillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="twinOverlayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.25" />
            </linearGradient>
            <filter id="radarPolygonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Concentric Guide Polygons */}
          {guideRings.map((ringPct) => {
            const r = (ringPct / 100) * maxRadius;
            const ringPoints = RADAR_AXES.map((_, i) => {
              const ang = startAngle + i * angleStep;
              const x = Math.round((center + r * Math.cos(ang)) * 10) / 10;
              const y = Math.round((center + r * Math.sin(ang)) * 10) / 10;
              return `${x},${y}`;
            }).join(" ");

            return (
              <g key={`ring_${ringPct}`}>
                <polygon
                  points={ringPoints}
                  fill="none"
                  stroke="var(--color-border, #e2e8f0)"
                  strokeWidth="1"
                  strokeDasharray={ringPct === 100 ? "none" : "3,3"}
                  opacity={ringPct === 100 ? 0.9 : 0.6}
                />
                <text
                  x={center + 4}
                  y={center - r + 10}
                  fontSize="9"
                  fill="var(--color-muted, #94a3b8)"
                  fontWeight="600"
                  textAnchor="start"
                >
                  {ringPct}%
                </text>
              </g>
            );
          })}

          {/* Radial Spokes */}
          {axisData.map((d) => (
            <line
              key={`spoke_${d.key}`}
              x1={center}
              y1={center}
              x2={d.axisX}
              y2={d.axisY}
              stroke="var(--color-border, #e2e8f0)"
              strokeWidth="1.2"
              opacity="0.8"
            />
          ))}

          {/* Optional Twin Belief Overlay */}
          {twinPoints && (
            <polygon
              points={twinPoints}
              fill="url(#twinOverlayGrad)"
              stroke="#8b5cf6"
              strokeWidth="1.8"
              strokeDasharray="4,3"
              opacity="0.75"
            />
          )}

          {/* Primary Assessment Polygon */}
          <polygon
            points={polygonPoints}
            fill="url(#multiSkillGrad)"
            stroke="#0284c7"
            strokeWidth="2.5"
            filter="url(#radarPolygonGlow)"
          />

          {/* Apex Nodes */}
          {axisData.map((d) => {
            const isActive = activeAxisKey === d.key;
            return (
              <g
                key={`vertex_${d.key}`}
                onClick={() => setActiveAxisKey(d.key)}
                style={{ cursor: "pointer" }}
                role="button"
                tabIndex={0}
                aria-label={`${d.nameFa}: ${d.percentage}%`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveAxisKey(d.key);
                  }
                }}
              >
                <circle
                  cx={d.dataX}
                  cy={d.dataY}
                  r={isActive ? 8 : 5.5}
                  fill={isActive ? "#0284c7" : "#06b6d4"}
                  stroke="#ffffff"
                  strokeWidth="2"
                  filter="drop-shadow(0 0 4px rgba(2, 132, 199, 0.5))"
                />
                <text
                  x={d.dataX}
                  y={d.dataY - 11}
                  fontSize="11"
                  fontWeight="800"
                  fill="var(--color-text, #0f172a)"
                  textAnchor="middle"
                >
                  {d.percentage}%
                </text>
              </g>
            );
          })}
        </svg>

        {/* HTML Outer Labels */}
        {axisData.map((d) => {
          const isActive = activeAxisKey === d.key;
          const leftPct = (d.labelX / size) * 100;
          const topPct = (d.labelY / size) * 100;

          return (
            <button
              key={`label_${d.key}`}
              type="button"
              onClick={() => setActiveAxisKey(d.key)}
              style={{
                position: "absolute",
                left: `${leftPct}%`,
                top: `${topPct}%`,
                transform: "translate(-50%, -50%)",
                background: isActive
                  ? "color-mix(in srgb, var(--color-action, #0284c7) 14%, var(--color-surface, #ffffff))"
                  : "var(--color-surface, #ffffff)",
                border: isActive
                  ? "1.5px solid var(--color-action, #0284c7)"
                  : "1px solid var(--color-border, #e2e8f0)",
                borderRadius: "9999px",
                padding: "0.2rem 0.55rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                whiteSpace: "nowrap",
                fontSize: "0.78rem",
                fontWeight: isActive ? 800 : 650,
                color: isActive ? "var(--color-action, #0284c7)" : "var(--color-text, #0f172a)",
                transition: "all 0.15s ease",
              }}
            >
              <span>{d.icon}</span>
              <span>{isFa ? d.nameFa : d.nameEn}</span>
              <strong style={{ color: d.color }}>{d.percentage}%</strong>
            </button>
          );
        })}
      </div>

      {/* Selected Skill Quick Detail Strip */}
      <div
        style={{
          inlineSize: "100%",
          maxWidth: size,
          marginBlockStart: "0.75rem",
          padding: "0.75rem 1rem",
          background: "var(--color-surface-hover, rgba(0,0,0,0.02))",
          borderRadius: "8px",
          border: "1px solid var(--color-border, #e2e8f0)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5rem",
          fontSize: "0.88rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.2rem" }}>{activeAxis.icon}</span>
          <strong style={{ color: "var(--color-text, #0f172a)" }}>
            {isFa ? activeAxis.nameFa : activeAxis.nameEn} ({activeAxis.nameEn})
          </strong>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span>
            {isFa ? "دقت ارزیابی‌شده:" : "Demonstrated Score:"}{" "}
            <strong style={{ color: activeAxis.color, fontWeight: 800 }}>
              {activeAxis.percentage}%
            </strong>
          </span>
          {activeAxis.answered !== undefined && (
            <span style={{ color: "var(--color-muted, #64748b)", fontSize: "0.8rem" }}>
              ({activeAxis.answered} / {activeAxis.total} {isFa ? "سوال" : "items"})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

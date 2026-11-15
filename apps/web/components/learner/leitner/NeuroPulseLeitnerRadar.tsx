"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import type { CEFRLevel } from "../../../data/cefr/types.ts";
import {
  computeCefrVocabularyRetention,
  type OverallVocabTelemetry,
} from "../../../lib/dkt-engine/cefr-vocab-retention.ts";
import styles from "./neuro-pulse-leitner.module.css";

export interface NeuroPulseLeitnerRadarProps {
  activeLevel: CEFRLevel;
  onSelectLevel?: (level: CEFRLevel) => void;
  onStartCriticalReview?: (level: CEFRLevel) => void;
  className?: string;
}

const CEFR_ORDER: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const NeuroPulseLeitnerRadar: React.FC<NeuroPulseLeitnerRadarProps> = ({
  activeLevel,
  onSelectLevel,
  onStartCriticalReview,
  className = "",
}) => {
  const [telemetry, setTelemetry] = useState<OverallVocabTelemetry>(() =>
    computeCefrVocabularyRetention()
  );

  const refreshData = useCallback(() => {
    setTelemetry(computeCefrVocabularyRetention());
  }, []);

  useEffect(() => {
    refreshData();
    const handleUpdate = () => {
      refreshData();
    };
    window.addEventListener("endoora:cefr-leitner-updated", handleUpdate);
    return () => window.removeEventListener("endoora:cefr-leitner-updated", handleUpdate);
  }, [refreshData]);

  // Geometry for 6-axis CEFR Spider / Radar Chart
  const radarGeom = useMemo(() => {
    const size = 320;
    const cx = size / 2;
    const cy = size / 2;
    const R = 110;
    const count = CEFR_ORDER.length;

    // Concentric grid webs: 25%, 50%, 75%, 100%
    const gridLevels = [0.25, 0.5, 0.75, 1.0].map((lvl) => {
      const pts: string[] = [];
      for (let k = 0; k < count; k++) {
        const angle = (k * (360 / count) - 90) * (Math.PI / 180);
        const x = cx + R * lvl * Math.cos(angle);
        const y = cy + R * lvl * Math.sin(angle);
        pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
      return { level: lvl, pointsStr: pts.join(" ") };
    });

    // 6 Radial Axes for A1 to C2
    const axes = CEFR_ORDER.map((lvl, k) => {
      const angle = (k * (360 / count) - 90) * (Math.PI / 180);
      const x2 = cx + R * Math.cos(angle);
      const y2 = cy + R * Math.sin(angle);
      const labelX = cx + (R + 24) * Math.cos(angle);
      const labelY = cy + (R + 24) * Math.sin(angle);

      return {
        level: lvl,
        x1: cx,
        y1: cy,
        x2,
        y2,
        labelX,
        labelY,
      };
    });

    // Current polygon points
    const currentPolygonPts: string[] = [];
    // 7-day projected decay polygon points
    const decayPolygonPts: string[] = [];

    CEFR_ORDER.forEach((lvl, k) => {
      const angle = (k * (360 / count) - 90) * (Math.PI / 180);
      const data = telemetry.levels[lvl];
      const curVal = Math.max(0.12, Math.min(1.0, data?.currentRecallProb ?? 0.5));
      const decayVal = Math.max(0.08, Math.min(1.0, data?.projectedDecay7Days ?? 0.38));

      const cxP = cx + R * curVal * Math.cos(angle);
      const cyP = cy + R * curVal * Math.sin(angle);
      currentPolygonPts.push(`${cxP.toFixed(1)},${cyP.toFixed(1)}`);

      const dxP = cx + R * decayVal * Math.cos(angle);
      const dyP = cy + R * decayVal * Math.sin(angle);
      decayPolygonPts.push(`${dxP.toFixed(1)},${dyP.toFixed(1)}`);
    });

    return {
      size,
      cx,
      cy,
      gridLevels,
      axes,
      currentPolygon: currentPolygonPts.join(" "),
      decayPolygon: decayPolygonPts.join(" "),
    };
  }, [telemetry]);

  const activeLevelData = telemetry.levels[activeLevel];
  const vulnerableCount = activeLevelData?.vulnerableCardsCount || 0;

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <span className={styles.badge}>DKT-Forget • CEFR Retention AI</span>
          <div>
            <h3 className={styles.title}>شبیه‌ساز شبکه عصبی ذهن • نبض پایداری لایتنر</h3>
            <p className={styles.subtitle}>
              پایش لحظه‌ای زوال حافظه و نرخ تثبیت واژگان در ۶ سطح استاندارد CEFR با الگوریتم عصب‌شناختی
            </p>
          </div>
        </div>
      </div>

      {/* Top Telemetry Cards */}
      <div className={styles.telemetryGrid}>
        <div className={styles.telemetryCard}>
          <div className={styles.telemetryValue}>{telemetry.overallRetentionIndex}%</div>
          <div className={styles.telemetryLabel}>شاخص پایداری کل واژگان</div>
        </div>

        <div className={styles.telemetryCard}>
          <div className={styles.telemetryValue} style={{ color: "#fbbf24" }}>
            {telemetry.totalCriticalZpdWords}
          </div>
          <div className={styles.telemetryLabel}>واژگان در آستانه فراموشی (ZPD)</div>
        </div>

        <div className={styles.telemetryCard}>
          <div className={styles.telemetryValue} style={{ color: "#34d399" }}>
            {telemetry.totalMasteredWords}
          </div>
          <div className={styles.telemetryLabel}>واژگان تثبیت‌شده (جعبه ۴ و ۵)</div>
        </div>

        <div className={styles.telemetryCard}>
          <div className={styles.telemetryValue} style={{ color: "#38bdf8" }}>
            {(telemetry.averageCognitiveSpeedMs / 1000).toFixed(1)}s
          </div>
          <div className={styles.telemetryLabel}>میانگین چابکی یادآوری ذهنی</div>
        </div>
      </div>

      {/* Main Layout: SVG Radar + Levels Breakdown */}
      <div className={styles.mainLayout}>
        {/* SVG Spider Chart */}
        <div className={styles.chartCard}>
          <svg
            className={styles.chartSvg}
            viewBox={`0 0 ${radarGeom.size} ${radarGeom.size}`}
            width={radarGeom.size}
            height={radarGeom.size}
          >
            {/* Concentric Grid Webs */}
            {radarGeom.gridLevels.map((gl, i) => (
              <polygon
                key={i}
                points={gl.pointsStr}
                fill="none"
                stroke="rgba(51, 65, 85, 0.45)"
                strokeDasharray={i === 1 ? "3 3" : "none"}
                strokeWidth="1"
              />
            ))}

            {/* Radial Axes */}
            {radarGeom.axes.map((ax, i) => (
              <line
                key={i}
                x1={ax.x1}
                y1={ax.y1}
                x2={ax.x2}
                y2={ax.y2}
                stroke={ax.level === activeLevel ? "#0ea5e9" : "rgba(51, 65, 85, 0.6)"}
                strokeWidth={ax.level === activeLevel ? 2 : 1}
              />
            ))}

            {/* 7-Day Projected Memory Decay Polygon (Rose Dashed) */}
            <polygon
              points={radarGeom.decayPolygon}
              fill="rgba(244, 63, 94, 0.08)"
              stroke="#f43f5e"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Current Recall Probability Polygon (Emerald Glow) */}
            <polygon
              points={radarGeom.currentPolygon}
              fill="rgba(16, 185, 129, 0.22)"
              stroke="#10b981"
              strokeWidth="2.5"
            />

            {/* Axis Level Labels */}
            {radarGeom.axes.map((ax, i) => {
              const isSelected = ax.level === activeLevel;
              return (
                <text
                  key={i}
                  x={ax.labelX}
                  y={ax.labelY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="12"
                  fill={isSelected ? "#38bdf8" : "#94a3b8"}
                  fontWeight={isSelected ? "900" : "bold"}
                  style={{ cursor: "pointer" }}
                  onClick={() => onSelectLevel?.(ax.level)}
                >
                  {ax.level}
                </text>
              );
            })}
          </svg>

          {/* Chart Legend */}
          <div className={styles.legendBar}>
            <div>
              <span className={`${styles.legendDot} ${styles.legendEmerald}`} />
              احتمال یادآوری امروز (Current Retention)
            </div>
            <div>
              <span className={`${styles.legendDot} ${styles.legendRoseDashed}`} />
              پیش‌بینی زوال پس از ۷ روز بی‌تمرینی
            </div>
          </div>
        </div>

        {/* Levels Breakdown List (A1 - C2) */}
        <div className={styles.levelsContainer}>
          {CEFR_ORDER.map((lvl) => {
            const data = telemetry.levels[lvl];
            const curPct = Math.round((data?.currentRecallProb ?? 0.5) * 100);
            const decayPct = Math.round((data?.projectedDecay7Days ?? 0.38) * 100);
            const isSelected = lvl === activeLevel;

            return (
              <div
                key={lvl}
                className={`${styles.levelCard} ${isSelected ? styles.levelCardActive : ""}`}
                onClick={() => onSelectLevel?.(lvl)}
              >
                <div className={styles.levelHeader}>
                  <div className={styles.levelTitle}>
                    <span className="font-mono text-sky-400 font-bold">{lvl}</span>
                    <span>{getLevelTitleFa(lvl)}</span>
                    {isSelected && (
                      <span className="text-[10px] bg-sky-950 border border-sky-600/50 text-sky-300 px-1.5 py-0.5 rounded">
                        سطح فعال
                      </span>
                    )}
                  </div>

                  <span
                    className={`${styles.levelPill} ${
                      data?.status === "mastered"
                        ? styles.pillMastered
                        : data?.status === "spaced_retrieval_zpd"
                        ? styles.pillZpd
                        : styles.pillDecaying
                    }`}
                  >
                    {data?.status === "mastered"
                      ? "تثبیت‌شده"
                      : data?.status === "spaced_retrieval_zpd"
                      ? "بازه طلایی ZPD"
                      : "خطر زوال"}
                  </span>
                </div>

                <div className={styles.barTrack}>
                  <div className={styles.barCurrentFill} style={{ width: `${curPct}%` }} />
                  <div
                    className={styles.barDecayMarker}
                    style={{ right: `${decayPct}%` }}
                    title={`پیش‌بینی پس از ۷ روز: ${decayPct}%`}
                  />
                </div>

                <div className={styles.levelMetaText}>
                  <span>احتمال یادآوری: {curPct}%</span>
                  <span>{data?.learnedCount || 0} واژه فعال • {data?.vulnerableCardsCount || 0} در خطر فراموشی</span>
                  <span>۷ روز بعد: {decayPct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Critical ZPD Spaced Retrieval Banner */}
      {vulnerableCount > 0 && (
        <div className={styles.zpdAlertSection}>
          <div>
            <div className={styles.zpdAlertTitle}>
              ⚡ هشدار زوال واژگان: {vulnerableCount} واژه در سطح {activeLevel} در آستانه فراموشی
              قرار دارند!
            </div>
            <div className={styles.zpdAlertDesc}>
              بر اساس مدل عصب‌شناختی، این واژگان وارد بازه طلایی بازیابی (ZPD) شده‌اند. مرور آن‌ها
              هم‌اکنون بیشترین استحکام سیناپسی را در مغز ایجاد می‌کند.
            </div>
          </div>

          {onStartCriticalReview && (
            <button
              onClick={() => onStartCriticalReview(activeLevel)}
              className={styles.criticalReviewBtn}
            >
              <span>⚡</span>
              <span>شروع مرور هوشمند زوال ({vulnerableCount} کارت) ➔</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

function getLevelTitleFa(level: CEFRLevel): string {
  const map: Record<CEFRLevel, string> = {
    A1: "مقدماتی (Beginner)",
    A2: "پیش‌متوسط (Elementary)",
    B1: "متوسط (Intermediate)",
    B2: "فرامشروط (Upper-Intermediate)",
    C1: "پیشرفته (Advanced)",
    C2: "تسلط کامل (Mastery)",
  };
  return map[level] || level;
}

"use client";

import React, { useMemo } from "react";
import { useDktAdaptive } from "../../../lib/dkt-engine/useDktAdaptive";
import type { DktDomainId } from "../../../lib/dkt-engine/types";
import styles from "./diagnostic-memory-radar.module.css";

interface Props {
  onStartAdaptiveGame?: () => void;
  className?: string;
}

const DOMAIN_ORDER: DktDomainId[] = [
  "tenses",
  "modals",
  "conditionals",
  "passive",
  "clauses",
  "discourse",
];

export function DiagnosticMemoryRadar({ onStartAdaptiveGame, className = "" }: Props) {
  const { predictions, resetDkt } = useDktAdaptive();

  const domainList = useMemo(() => {
    if (!predictions) return [];
    return DOMAIN_ORDER.map((id) => predictions.domainMastery[id]).filter(Boolean);
  }, [predictions]);

  // Geometry calculations for 6-axis Spider/Radar chart
  const radarGeom = useMemo(() => {
    const size = 320;
    const cx = size / 2;
    const cy = size / 2;
    const R = 110;
    const count = DOMAIN_ORDER.length;

    // Concentric grid levels: 25%, 50%, 75%, 100%
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

    // 6 Axis lines and label coordinates
    const axes = DOMAIN_ORDER.map((domainKey, k) => {
      const angle = (k * (360 / count) - 90) * (Math.PI / 180);
      const x2 = cx + R * Math.cos(angle);
      const y2 = cy + R * Math.sin(angle);
      const labelX = cx + (R + 24) * Math.cos(angle);
      const labelY = cy + (R + 24) * Math.sin(angle);

      return {
        domainKey,
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
    // 7-Day decay polygon points
    const decayPolygonPts: string[] = [];

    DOMAIN_ORDER.forEach((id, k) => {
      const angle = (k * (360 / count) - 90) * (Math.PI / 180);
      const data = predictions?.domainMastery[id];
      const curVal = Math.max(0.1, Math.min(1.0, data?.currentRecallProb ?? 0.5));
      const decayVal = Math.max(0.1, Math.min(1.0, data?.projectedDecay7Days ?? 0.4));

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
  }, [predictions]);

  if (!predictions) {
    return <div className="p-6 text-center text-slate-400">در حال بارگذاری مدل شناختی DKT...</div>;
  }

  return (
    <div className={`${styles.radarContainer} ${className}`}>
      {/* Header */}
      <div className={styles.radarHeader}>
        <div className={styles.titleArea}>
          <span className={styles.badge}>DKT-Forget • GRU Neural Radar</span>
          <div>
            <h3 className={styles.title}>رادار زوال دانش و پایداری حافظه (Memory Decay Radar)</h3>
            <p className={styles.subtitle}>
              پایش بلادرنگ ۶ حوزه گرامری AEF بر اساس شبکه عصبی بازگشتی و منحنی فراموشی ابینگهاوس
            </p>
          </div>
        </div>

        <button
          onClick={resetDkt}
          className="text-xs text-slate-400 hover:text-rose-400 underline transition-colors"
          title="بازنشانی بردار حالت شناختی به حالت اولیه"
        >
          بازنشانی پروفایل شناختی
        </button>
      </div>

      {/* Top High-level Telemetry */}
      <div className={styles.topMetrics}>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{predictions.overallRetentionIndex}%</div>
          <div className={styles.metricLabel}>شاخص پایداری کل در حافظه</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{predictions.totalInteractions}</div>
          <div className={styles.metricLabel}>کل تعاملات عصبی ثبت‌شده</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricValue} style={{ color: "#fbbf24" }}>
            {predictions.criticalZpdConcepts.length}
          </div>
          <div className={styles.metricLabel}>سازه در آستانه طلایی بازیابی (ZPD)</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricValue} style={{ color: "#fb7185" }}>
            {predictions.decayingConcepts.length}
          </div>
          <div className={styles.metricLabel}>سازه در معرض زوال شدید (&lt; ۴۰٪)</div>
        </div>
      </div>

      {/* Spider Chart + Domain Breakdown */}
      <div className={styles.chartAndDetails}>
        {/* SVG Radar Chart */}
        <div className={styles.chartCard}>
          <svg
            className={styles.chartSvg}
            viewBox={`0 0 ${radarGeom.size} ${radarGeom.size}`}
            width={radarGeom.size}
            height={radarGeom.size}
          >
            {/* Concentric Web Polygons */}
            {radarGeom.gridLevels.map((gl, i) => (
              <polygon
                key={i}
                points={gl.pointsStr}
                fill="none"
                stroke="rgba(51, 65, 85, 0.4)"
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
                stroke="rgba(51, 65, 85, 0.5)"
                strokeWidth="1"
              />
            ))}

            {/* 7-Day Projected Decay Polygon (Red Dashed) */}
            <polygon
              points={radarGeom.decayPolygon}
              fill="rgba(244, 63, 94, 0.08)"
              stroke="#f43f5e"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Current Recall Probability Polygon (Emerald Solid with Glow) */}
            <polygon
              points={radarGeom.currentPolygon}
              fill="rgba(16, 185, 129, 0.2)"
              stroke="#10b981"
              strokeWidth="2.5"
            />

            {/* Axis Domain Labels */}
            {radarGeom.axes.map((ax, i) => {
              const domain = predictions.domainMastery[ax.domainKey];
              return (
                <text
                  key={i}
                  x={ax.labelX}
                  y={ax.labelY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="10"
                  fill="#94a3b8"
                  fontWeight="bold"
                >
                  {domain?.titleFa.split(" ")[0]}
                </text>
              );
            })}
          </svg>

          {/* Chart Legend */}
          <div className={styles.chartLegend}>
            <div>
              <span className={`${styles.legendDot} ${styles.legendCurrent}`} />
              احتمال یادآوری امروز (Current Recall)
            </div>
            <div>
              <span className={`${styles.legendDot} ${styles.legendDecay}`} />
              پیش‌بینی زوال پس از ۷ روز بی‌تمرینی
            </div>
          </div>
        </div>

        {/* Detailed Domain List */}
        <div className={styles.domainList}>
          {domainList.map((d) => {
            const curPct = Math.round(d.currentRecallProb * 100);
            const decayPct = Math.round(d.projectedDecay7Days * 100);

            return (
              <div key={d.domain} className={styles.domainItem}>
                <div className={styles.domainHeader}>
                  <div className={styles.domainTitle}>
                    <span>{d.titleFa}</span>
                    <span className="text-xs text-slate-500 font-normal">({d.titleEn})</span>
                  </div>

                  <span
                    className={`${styles.statusPill} ${
                      d.status === "mastered"
                        ? styles.statusMastered
                        : d.status === "spaced_retrieval_zpd"
                        ? styles.statusZpd
                        : styles.statusDecaying
                    }`}
                  >
                    {d.status === "mastered"
                      ? "تثبیت‌شده"
                      : d.status === "spaced_retrieval_zpd"
                      ? "بازه طلایی ZPD"
                      : "خطر زوال"}
                  </span>
                </div>

                <div className={styles.barTrack}>
                  <div className={styles.barCurrent} style={{ width: `${curPct}%` }} />
                  <div
                    className={styles.barDecayMarker}
                    style={{ right: `${decayPct}%` }}
                    title={`پیش‌بینی پس از ۷ روز: ${decayPct}%`}
                  />
                </div>

                <div className={styles.domainSubtext}>
                  <span>احتمال یادآوری: {curPct}%</span>
                  <span>پیش‌بینی ۷ روز بعد: {decayPct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Critical ZPD Spaced Retrieval Banner */}
      {predictions.criticalZpdConcepts.length > 0 && (
        <div className={styles.zpdAlertCard}>
          <div>
            <div className={styles.zpdAlertTitle}>
              ⚡ هشدار موتور فاصله زمانی: {predictions.criticalZpdConcepts.length} قاعده در آستانه
              فراموشی قرار دارد!
            </div>
            <div className={styles.zpdAlertText}>
              حافظه شما اکنون در «منطقه تقریبی رشد (ZPD)» قرار دارد. بازیابی این سازه‌ها در این لحظه
              بیشترین بازده عصبی را ایجاد می‌کند.
            </div>
          </div>

          {onStartAdaptiveGame && (
            <button onClick={onStartAdaptiveGame} className={styles.actionBtn}>
              شروع چالش انطباقی در شش‌ضلعی ➔
            </button>
          )}
        </div>
      )}
    </div>
  );
}

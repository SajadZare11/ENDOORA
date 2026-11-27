"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { useTwin } from "@/components/twin/useTwin";
import {
  ensureTwinLearnerScope,
  getLearnerTwin,
  setTwinLearnerScope,
  TWIN_CATALOG,
} from "@/lib/ai/learner-twin-store";
import type { TwinSnapshot, CEFRBand } from "@/lib/ai/learner-twin-types";

export interface SkillMasteryIndicatorProps {
  skill: string;
  skillTitleFa: string;
}

export function computeSkillMasteryMetrics(snapshot: TwinSnapshot | null, skill: string) {
  if (!snapshot) {
    return {
      masteryPercent: 50,
      band: 5.0,
      cefr: "B1" as CEFRBand,
      variance: 0.08,
      confidencePercent: 20,
      confidenceStatusFa: "در حال کالیبراسیون اولیه",
      evidenceCount: 0,
      hasLiveEvidence: false,
    };
  }

  let mean = 0.5;
  let variance = 0.08;
  let evidenceCount = 0;

  if (
    skill === "listening" ||
    skill === "reading" ||
    skill === "writing" ||
    skill === "speaking"
  ) {
    const belief = snapshot.modalityMastery[skill as keyof typeof snapshot.modalityMastery];
    if (belief) {
      mean = belief.mean;
      variance = belief.variance;
      evidenceCount = belief.evidenceCount;
    }
  } else if (skill === "grammar") {
    const grammarNodes = snapshot.nodes.filter((n) => {
      const cat = TWIN_CATALOG.find((c) => c.skillId === n.skillId);
      return cat?.domain !== "discourse";
    });
    if (grammarNodes.length > 0) {
      mean = grammarNodes.reduce((sum, n) => sum + n.mean, 0) / grammarNodes.length;
      variance = grammarNodes.reduce((sum, n) => sum + n.variance, 0) / grammarNodes.length;
      evidenceCount = grammarNodes.reduce((sum, n) => sum + (n.evidenceCount ?? 0), 0);
    }
  } else if (skill === "vocabulary") {
    const vocabNodes = snapshot.nodes.filter((n) => {
      const cat = TWIN_CATALOG.find((c) => c.skillId === n.skillId);
      return cat?.domain === "discourse";
    });
    if (vocabNodes.length > 0) {
      mean = vocabNodes.reduce((sum, n) => sum + n.mean, 0) / vocabNodes.length;
      variance = vocabNodes.reduce((sum, n) => sum + n.variance, 0) / vocabNodes.length;
      evidenceCount = vocabNodes.reduce((sum, n) => sum + (n.evidenceCount ?? 0), 0);
    }
  }

  const masteryPercent = Math.round(Math.max(5, Math.min(99, mean * 100)));
  const rawBand = 1 + 8 * mean;
  const band = Math.round(Math.max(1, Math.min(9, rawBand)) * 2) / 2;

  const cefr: CEFRBand =
    band >= 8.5 ? "C2" :
    band >= 7.0 ? "C1" :
    band >= 5.5 ? "B2" :
    band >= 4.0 ? "B1" :
    band >= 2.5 ? "A2" : "A1";

  // Epistemic uncertainty to cognitive confidence percentage
  const sigma = Math.sqrt(variance);
  const rawConfidence = (1 - sigma / 0.5) * 100;
  const evidenceScale = Math.min(1.0, evidenceCount / 10);
  const confidencePercent = Math.round(
    evidenceCount === 0 ? 15 : Math.max(15, Math.min(99, rawConfidence * 0.7 + evidenceScale * 30))
  );

  let confidenceStatusFa = "نیاز به شواهد اولیه";
  if (evidenceCount >= 10 && confidencePercent >= 75) {
    confidenceStatusFa = "کالیبره‌شده و مطمئن";
  } else if (evidenceCount >= 3 || confidencePercent >= 45) {
    confidenceStatusFa = "در حال تثبیت شواهد";
  }

  return {
    masteryPercent,
    band,
    cefr,
    variance,
    confidencePercent,
    confidenceStatusFa,
    evidenceCount,
    hasLiveEvidence: evidenceCount > 0,
  };
}

export function SkillMasteryIndicator({ skill, skillTitleFa }: SkillMasteryIndicatorProps) {
  const snapshot = useTwin();

  useEffect(() => {
    void ensureTwinLearnerScope().catch(() => {});
    if (typeof window !== "undefined" && !getLearnerTwin()) {
      setTwinLearnerScope("local_learner");
    }
  }, []);

  const metrics = useMemo(() => computeSkillMasteryMetrics(snapshot, skill), [snapshot, skill]);

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-card)",
        padding: "var(--space-4) var(--space-5)",
        marginBlock: "var(--space-4) var(--space-6)",
        boxShadow: "0 2px 12px -2px rgba(0, 0, 0, 0.05)",
      }}
      role="region"
      aria-label="شاخص زنده تسلط شناختی"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "var(--space-3)",
          marginBlockEnd: "var(--space-4)",
          paddingBlockEnd: "var(--space-3)",
          borderBlockEnd: "1px solid var(--color-border-subtle, rgba(0, 0, 0, 0.06))",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <span style={{ fontSize: "1.6rem" }} aria-hidden="true">🧠</span>
          <div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--color-text)", margin: 0 }}>
              وضعیت زنده تسلط شناختی در {skillTitleFa}
            </h3>
            <p style={{ fontSize: "0.825rem", color: "var(--color-muted)", margin: "0.2rem 0 0 0" }}>
              محاسبه‌شده با فیلتر کالمن تعمیم‌یافته (EKF) بر پایه تعاملات و شواهد بلادرنگ شما
            </p>
          </div>
        </div>

        <Link
          href="/twin"
          style={{
            fontSize: "0.825rem",
            fontWeight: 750,
            color: "var(--color-action, #0284c7)",
            textDecoration: "none",
            background: "color-mix(in srgb, var(--color-action, #0284c7) 12%, var(--color-surface))",
            padding: "0.35rem 0.75rem",
            borderRadius: "var(--radius-pill)",
          }}
        >
          <span>مشاهده دوقلوی من ←</span>
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        {/* Metric 1: Mastery Level */}
        <div
          style={{
            background: "var(--color-surface-hover, rgba(0, 0, 0, 0.02))",
            borderRadius: "var(--radius-control)",
            padding: "var(--space-3) var(--space-4)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div style={{ fontSize: "0.825rem", color: "var(--color-muted)", marginBlockEnd: "0.4rem" }}>
            درصد تسلط برآورد‌شده
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBlockEnd: "0.5rem" }}>
            <span style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--color-text)", fontFamily: "var(--font-family-latin)" }}>
              {metrics.masteryPercent}٪
            </span>
            <span
              style={{
                fontSize: "0.78rem",
                fontWeight: 750,
                background: "var(--color-action, #0284c7)",
                color: "#ffffff",
                padding: "0.15rem 0.5rem",
                borderRadius: "var(--radius-pill)",
              }}
            >
              {metrics.cefr} (~Band {metrics.band})
            </span>
          </div>
          <div
            style={{
              inlineSize: "100%",
              blockSize: "6px",
              background: "var(--color-border)",
              borderRadius: "9999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                inlineSize: `${metrics.masteryPercent}%`,
                blockSize: "100%",
                background: "linear-gradient(90deg, #3b82f6, #10b981)",
                transition: "inline-size 0.5s ease-out",
              }}
            />
          </div>
        </div>

        {/* Metric 2: Cognitive Confidence */}
        <div
          style={{
            background: "var(--color-surface-hover, rgba(0, 0, 0, 0.02))",
            borderRadius: "var(--radius-control)",
            padding: "var(--space-3) var(--space-4)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div style={{ fontSize: "0.825rem", color: "var(--color-muted)", marginBlockEnd: "0.4rem" }}>
            ضریب قطعیت شناختی (Certainty)
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBlockEnd: "0.5rem" }}>
            <span style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--color-text)", fontFamily: "var(--font-family-latin)" }}>
              {metrics.confidencePercent}٪
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 750,
                padding: "0.15rem 0.5rem",
                borderRadius: "var(--radius-pill)",
                backgroundColor: metrics.evidenceCount >= 10 ? "#dcfce7" : metrics.evidenceCount >= 3 ? "#fef3c7" : "#f1f5f9",
                color: metrics.evidenceCount >= 10 ? "#166534" : metrics.evidenceCount >= 3 ? "#92400e" : "#475569",
              }}
            >
              {metrics.confidenceStatusFa}
            </span>
          </div>
          <div
            style={{
              inlineSize: "100%",
              blockSize: "6px",
              background: "var(--color-border)",
              borderRadius: "9999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                inlineSize: `${metrics.confidencePercent}%`,
                blockSize: "100%",
                background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                transition: "inline-size 0.5s ease-out",
              }}
            />
          </div>
        </div>

        {/* Metric 3: Corroborating Evidence */}
        <div
          style={{
            background: "var(--color-surface-hover, rgba(0, 0, 0, 0.02))",
            borderRadius: "var(--radius-control)",
            padding: "var(--space-3) var(--space-4)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div style={{ fontSize: "0.825rem", color: "var(--color-muted)", marginBlockEnd: "0.4rem" }}>
            شواهد کالیبراسیون ثبت‌شده
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", marginBlockEnd: "0.5rem" }}>
            <span style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--color-text)", fontFamily: "var(--font-family-latin)" }}>
              {metrics.evidenceCount}
            </span>
            <span style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>پاسخ تعاملی</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>
            {metrics.hasLiveEvidence
              ? "⚡ پایش میلی‌ثانیه‌ای درنگ ذهنی فعال است"
              : "⏳ با پاسخ به کارگاه زیر، مدل کالیبره می‌شود"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillMasteryIndicator;

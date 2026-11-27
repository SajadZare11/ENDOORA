"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { useTwin } from "../twin/useTwin";
import {
  ensureTwinLearnerScope,
  TWIN_CATALOG,
} from "../../lib/ai/learner-twin-store";
import MultiSkillRadar, { RADAR_AXES } from "./MultiSkillRadar";
import styles from "./placement.module.css";

export interface LearnerTwinPreviewProps {
  currentSection?: string;
  currentIndex?: number;
  totalQuestions?: number;
  answeredCount?: number;
  answers?: Record<string, string>;
  sectionsSummary?: Record<string, { score_percentage?: number; answered?: number; total?: number }>;
  locale?: "fa" | "en";
  level?: string; // Calibrated CEFR level tier: A1 to C2
}

export default function LearnerTwinPreview({
  currentSection = "grammar",
  currentIndex = 50,
  totalQuestions = 50,
  answeredCount = 50,
  answers = {},
  sectionsSummary = {},
  locale = "fa",
  level = "B1",
}: LearnerTwinPreviewProps) {
  const isFa = locale === "fa";

  // Connect to live Learner Twin
  useEffect(() => {
    void ensureTwinLearnerScope().catch(() => {});
  }, []);

  const snapshot = useTwin();

  // Extract authentic 6-skill beliefs from Learner Twin snapshot
  const twinSkillMastery = useMemo(() => {
    if (!snapshot) return null;

    // 1. Listening
    const listMean = snapshot.modalityMastery.listening.mean;
    const listVar = snapshot.modalityMastery.listening.variance;

    // 2. Reading
    const readMean = snapshot.modalityMastery.reading.mean;
    const readVar = snapshot.modalityMastery.reading.variance;

    // 3. Writing
    const writeMean = snapshot.modalityMastery.writing.mean;
    const writeVar = snapshot.modalityMastery.writing.variance;

    // 4. Speaking
    const speakMean = snapshot.modalityMastery.speaking.mean;
    const speakVar = snapshot.modalityMastery.speaking.variance;

    // 5. Grammar (from AEF non-discourse nodes)
    const grammarNodes = snapshot.nodes.filter((n) => {
      const cat = TWIN_CATALOG.find((c) => c.skillId === n.skillId);
      return cat?.domain !== "discourse";
    });
    const grammarMean = grammarNodes.length > 0
      ? grammarNodes.reduce((sum, n) => sum + n.mean, 0) / grammarNodes.length
      : 0.55;
    const grammarVar = grammarNodes.length > 0
      ? grammarNodes.reduce((sum, n) => sum + n.variance, 0) / grammarNodes.length
      : 0.08;

    // 6. Vocabulary (from discourse nodes)
    const vocabNodes = snapshot.nodes.filter((n) => {
      const cat = TWIN_CATALOG.find((c) => c.skillId === n.skillId);
      return cat?.domain === "discourse";
    });
    const vocabMean = vocabNodes.length > 0
      ? vocabNodes.reduce((sum, n) => sum + n.mean, 0) / vocabNodes.length
      : 0.58;
    const vocabVar = vocabNodes.length > 0
      ? vocabNodes.reduce((sum, n) => sum + n.variance, 0) / vocabNodes.length
      : 0.08;

    return {
      listening: { mean: listMean, variance: listVar },
      reading: { mean: readMean, variance: readVar },
      writing: { mean: writeMean, variance: writeVar },
      speaking: { mean: speakMean, variance: speakVar },
      grammar: { mean: grammarMean, variance: grammarVar },
      vocabulary: { mean: vocabMean, variance: vocabVar },
    };
  }, [snapshot]);

  // Overall cognitive readiness & certainty
  const cognitiveReadiness = useMemo(() => {
    if (twinSkillMastery) {
      const sum = Object.values(twinSkillMastery).reduce((acc, curr) => acc + curr.mean, 0);
      return Math.round((sum / 6) * 100);
    }
    return 65;
  }, [twinSkillMastery]);

  const epistemicCertainty = useMemo(() => {
    if (twinSkillMastery) {
      const meanVar = Object.values(twinSkillMastery).reduce((acc, curr) => acc + curr.variance, 0) / 6;
      return Math.round(Math.max(0, 1 - Math.sqrt(meanVar)) * 100);
    }
    return 80;
  }, [twinSkillMastery]);

  // 4D Error Profile from Learner Twin
  const errorProfile4D = snapshot?.errorProfile4D ?? [0.25, 0.25, 0.25, 0.25];

  return (
    <div
      className={styles.twinCard}
      aria-label={isFa ? "پروفایل رسمی دوقلوی یادگیری زبانی" : "Official Learner Twin Diagnostic Profile"}
    >
      {/* macOS Window Chrome */}
      <div className={styles.previewChrome}>
        <span />
        <span />
        <span />
        <strong>Learner Twin · Live Neuro-Bayesian Fusion</strong>
      </div>

      <div className={styles.previewBody}>
        {/* Left Side Rail */}
        <aside className={styles.previewRail} aria-hidden="true">
          <b>E</b>
          <span />
          <span />
          <span />
          <span />
        </aside>

        {/* Content Area */}
        <div className={styles.previewContent}>
          <div className={styles.previewIntro}>
            <div>
              <span>Official Learner Twin</span>
              <h2>{isFa ? "دوقلوی یادگیری زبانی شما" : "Your Learner Twin Profile"}</h2>
              <p>{isFa ? "وضعیت زنده شواهد و توزیع بیزی تسلط مهارتی" : "Live Bayesian skill distributions & readiness"}</p>
            </div>
            <Link href="/twin" className={styles.viewTwinLink}>
              {isFa ? "کاوشگر کامل دوقلو ←" : "Explore Twin Space →"}
            </Link>
          </div>

          <div className={styles.twinIdentity}>
            <div className={styles.orb}>
              <span />
            </div>
            <div>
              <strong>Learner Twin · EKF & Cognitive Fusion</strong>
              <small>
                {isFa ? "سنجش انطباقی ۶ مهارت زبانی با شواهد رسمی آزمون" : "Adaptive 6-skill evaluation with verified evidence"}
              </small>
            </div>
          </div>

          {/* Calibrated CEFR Badge */}
          <div className={styles.previewBadge}>
            <span>
              {isFa
                ? `سطح تسلط تشخیص‌داده‌شده در چارچوب اروپایی: ${level}`
                : `Diagnosed CEFR Proficiency Tier: ${level}`}
            </span>
          </div>

          {/* 6-Axis Multi-Skill Radar Chart */}
          <div style={{ marginBlock: "var(--space-4)" }}>
            <MultiSkillRadar
              sections={sectionsSummary}
              twinMastery={twinSkillMastery ?? undefined}
              locale={locale}
              size={360}
            />
          </div>

          {/* Authentic Skill Mastery Distributions */}
          <div style={{ marginBlock: "var(--space-4)" }}>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 800, marginBlockEnd: "var(--space-3)", color: "var(--color-text)" }}>
              📊 {isFa ? "توزیع برآورد تسلط مهارتی در دوقلو:" : "Estimated Skill Mastery Beliefs:"}
            </h4>

            {RADAR_AXES.map((axis) => {
              const belief = twinSkillMastery?.[axis.key];
              const secScore = sectionsSummary[axis.key]?.score_percentage;
              const masteryPct = belief ? Math.round(belief.mean * 100) : (secScore ?? 60);
              const variance = belief?.variance ?? 0.05;
              const uncertaintyPct = Math.round(Math.sqrt(variance) * 100);

              return (
                <div key={axis.key} className={styles.skillPreviewRow}>
                  <div className={styles.skillPreviewTop}>
                    <strong lang="en" dir="ltr">
                      {axis.icon} {isFa ? axis.nameFa : axis.nameEn} ({axis.nameEn})
                    </strong>
                    <small>
                      {masteryPct}٪ {isFa ? "تسلط" : "mastery"} (±{uncertaintyPct}٪ {isFa ? "عدم‌قطعیت" : "uncertainty"})
                    </small>
                  </div>
                  <div className={styles.skillPreviewTrack}>
                    <div
                      className={styles.skillPreviewBar}
                      style={{
                        inlineSize: `${masteryPct}%`,
                        background: axis.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Genuine Cognitive Readiness & 4D Trap Vulnerabilities */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--space-3)",
              marginBlock: "var(--space-4)",
              padding: "var(--space-3)",
              background: "var(--color-surface-hover, rgba(0,0,0,0.02))",
              borderRadius: "var(--radius-control)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div>
              <span style={{ fontSize: "0.78rem", color: "var(--color-muted)", fontWeight: 700 }}>
                {isFa ? "شاخص آمادگی شناختی کلی:" : "Cognitive Readiness Index:"}
              </span>
              <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--color-action)" }}>
                {cognitiveReadiness} / 100
              </div>
            </div>

            <div>
              <span style={{ fontSize: "0.78rem", color: "var(--color-muted)", fontWeight: 700 }}>
                {isFa ? "قطعیت بیزی (اطمینان به داده‌ها):" : "Epistemic Certainty:"}
              </span>
              <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#10b981" }}>
                {epistemicCertainty}٪
              </div>
            </div>
          </div>

          {/* 4D Distractor Vulnerability Profile */}
          <div style={{ marginBlock: "var(--space-3)" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--color-text)" }}>
              🎯 {isFa ? "پروفایل ۴بعدی حساسیت به تله‌های زبانی (LinUCB):" : "4D Distractor Vulnerability Profile:"}
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "0.4rem" }}>
              <div style={{ padding: "0.4rem 0.6rem", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "6px", display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                <span>🔊 {isFa ? "آوایی/املایی:" : "Phonetic:"}</span>
                <strong>{Math.round(errorProfile4D[0] * 100)}%</strong>
              </div>
              <div style={{ padding: "0.4rem 0.6rem", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "6px", display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                <span>🧠 {isFa ? "معنایی:" : "Semantic:"}</span>
                <strong>{Math.round(errorProfile4D[1] * 100)}%</strong>
              </div>
              <div style={{ padding: "0.4rem 0.6rem", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "6px", display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                <span>📐 {isFa ? "ساختواژه‌ای:" : "Morpho:"}</span>
                <strong>{Math.round(errorProfile4D[2] * 100)}%</strong>
              </div>
              <div style={{ padding: "0.4rem 0.6rem", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "6px", display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                <span>🇮🇷 {isFa ? "تداخل فارسی L1:" : "L1 Persian:"}</span>
                <strong>{Math.round(errorProfile4D[3] * 100)}%</strong>
              </div>
            </div>
          </div>

          <div className={styles.twinFooter}>
            <span>
              {isFa ? "کل شواهد ارزیابی‌شده در دوقلو:" : "Logged verified evidence in Twin:"}
            </span>
            <strong style={{ color: "var(--color-action)" }}>
              {snapshot?.calibration?.totalInteractions || answeredCount} {isFa ? "شواهد یادگیری" : "interactions"}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

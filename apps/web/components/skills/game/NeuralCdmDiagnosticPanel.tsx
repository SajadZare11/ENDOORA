"use client";

import React, { useState, useEffect } from "react";
import { NeuralCdmEngine } from "@/lib/ai/neural-cdm-engine";
import type { CdmDiagnosticResult, CdmExamDiagnosticSummary } from "@/lib/ai/neural-cdm-types";

export interface NeuralCdmDiagnosticPanelProps {
  isTeacherView?: boolean;
  onSelectRemediationConcept?: (conceptId: string) => void;
  activeDiagnosis?: CdmDiagnosticResult | null;
  compact?: boolean;
  stagePassed?: boolean;
  title?: string;
  onClose?: () => void;
}

export function NeuralCdmDiagnosticPanel({
  isTeacherView = false,
  onSelectRemediationConcept,
  activeDiagnosis,
  compact = false,
  stagePassed = false,
  title,
  onClose,
}: NeuralCdmDiagnosticPanelProps) {
  const [stats, setStats] = useState({
    totalSlips: 0,
    totalDeficits: 0,
    totalEvaluations: 0,
    slipRate: 0,
  });
  const [history, setHistory] = useState<CdmDiagnosticResult[]>([]);
  const [latestExam, setLatestExam] = useState<CdmExamDiagnosticSummary | null>(null);

  useEffect(() => {
    try {
      const engine = NeuralCdmEngine.getInstance();
      setStats(engine.getStats());
      setHistory(engine.getDiagnosticHistory().slice(-5).reverse());
      setLatestExam(engine.getLatestExamDiagnosis());
    } catch {
      // Safe fallback
    }
  }, [activeDiagnosis]);

  // Clean Victory State: learner passed with zero errors
  if (stagePassed && !activeDiagnosis && stats.totalEvaluations === 0) {
    return (
      <div
        style={{
          background: "rgba(16, 185, 129, 0.12)",
          border: "1px solid rgba(16, 185, 129, 0.35)",
          borderRadius: "10px",
          padding: compact ? "12px 14px" : "16px",
          textAlign: "center",
          color: "#34d399",
          fontSize: compact ? "0.82rem" : "0.88rem",
          direction: "rtl",
          lineHeight: 1.6,
        }}
      >
        ✨ <strong>تسلط ساختاری کامل (Clean Mastery):</strong> هیچ نقص پیش‌نیاز یا لغزش شناختی در این مدار ثبت نشد. بردار تسلط ۶۰ بُعدی DKT-Forget پایداری این مفهوم نحوی را تایید می‌کند.
      </div>
    );
  }

  // Empty state when no diagnostic evaluations exist
  if (stats.totalEvaluations === 0 && !latestExam && !activeDiagnosis) {
    return (
      <div
        style={{
          background: "rgba(15, 23, 42, 0.6)",
          border: "1px dashed rgba(100, 116, 139, 0.4)",
          borderRadius: "12px",
          padding: compact ? "12px" : "20px",
          textAlign: "center",
          color: "#94a3b8",
          fontSize: "0.85rem",
          direction: "rtl",
        }}
      >
        <span>🎯 هنوز داده تشخیصی ثبت نشده است. با شرکت در شبیه‌ساز آیلتس یا چالش‌های گرامر هگز، ریشه‌یابی علّی فعال خواهد شد.</span>
      </div>
    );
  }

  const deficitRate = stats.totalEvaluations > 0
    ? Math.round((stats.totalDeficits / stats.totalEvaluations) * 100)
    : 0;
  const slipRatePercent = stats.totalEvaluations > 0
    ? Math.round((stats.totalSlips / stats.totalEvaluations) * 100)
    : 0;

  return (
    <div
      style={{
        background: "linear-gradient(145deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.95))",
        border: "1px solid rgba(59, 130, 246, 0.35)",
        borderRadius: compact ? "10px" : "14px",
        padding: compact ? "12px 14px" : "20px",
        direction: "rtl",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
        color: "#f8fafc",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: compact ? "10px" : "16px",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: compact ? "0.92rem" : "1.05rem",
              fontWeight: 700,
              color: "#60a5fa",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>🧠</span>
            {title
              ? title
              : isTeacherView
              ? "داشبورد تشخیصی استاد: تحلیل علّی ریشه‌ای خطاهای زبان‌آموز (NeuralCDM)"
              : "مرکز تحلیل علّی و ریشه‌یابی خطاها (GAT + NeuralCDM)"}
          </h3>
          {!compact && (
            <p style={{ margin: "4px 0 0", fontSize: "0.78rem", color: "#94a3b8" }}>
              تفکیک علمی لغزش‌های موقت از کاستی‌های ساختاری پایه‌ای (در کمتر از ۱ میلی‌ثانیه بدون بارگذاری مدل اضافه)
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <span
            style={{
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.35)",
              borderRadius: "6px",
              padding: "3px 8px",
              fontSize: "0.72rem",
              color: "#34d399",
              fontWeight: 600,
            }}
          >
            ⚡ لغزش: {slipRatePercent}٪ ({stats.totalSlips})
          </span>
          <span
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              borderRadius: "6px",
              padding: "3px 8px",
              fontSize: "0.72rem",
              color: "#f87171",
              fontWeight: 600,
            }}
          >
            🎯 نقص پیش‌نیاز: {deficitRate}٪ ({stats.totalDeficits})
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                fontSize: "1rem",
                cursor: "pointer",
                padding: "2px 6px",
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Active Diagnosis Hero Card (Highlighted Error from current game/exam session) */}
      {activeDiagnosis && (
        <div
          style={{
            background:
              activeDiagnosis.diagnosis === "PREREQUISITE_DEFICIT"
                ? "rgba(239, 68, 68, 0.14)"
                : "rgba(16, 185, 129, 0.14)",
            border:
              activeDiagnosis.diagnosis === "PREREQUISITE_DEFICIT"
                ? "1px solid rgba(239, 68, 68, 0.4)"
                : "1px solid rgba(16, 185, 129, 0.4)",
            borderRadius: "10px",
            padding: "10px 14px",
            marginBottom: compact ? "10px" : "14px",
            direction: "rtl",
            textAlign: "right",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "6px",
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: "0.85rem",
                color:
                  activeDiagnosis.diagnosis === "PREREQUISITE_DEFICIT"
                    ? "#f87171"
                    : "#34d399",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {activeDiagnosis.diagnosis === "PREREQUISITE_DEFICIT"
                ? "🎯 ریشه‌یابی علّی خطای اخیر"
                : "⚡ تحلیل خطای اخیر: لغزش تصادفی"}
            </span>
            <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
              واکنش: {activeDiagnosis.latencyMs}ms | احتمال لغزش:{" "}
              {Math.round(activeDiagnosis.slipProbability * 100)}٪
            </span>
          </div>

          <p
            style={{
              fontSize: "0.8rem",
              color: "#e2e8f0",
              margin: "0 0 8px",
              lineHeight: 1.6,
            }}
          >
            {activeDiagnosis.remediationFa}
          </p>

          {/* Root Deficit Badge */}
          {activeDiagnosis.rootDeficit && (
            <div style={{ marginBottom: "8px" }}>
              <button
                type="button"
                onClick={() =>
                  onSelectRemediationConcept?.(
                    activeDiagnosis.rootDeficit!.conceptId
                  )
                }
                style={{
                  background: "rgba(251, 191, 36, 0.15)",
                  border: "1px solid rgba(251, 191, 36, 0.35)",
                  borderRadius: "6px",
                  padding: "4px 10px",
                  fontSize: "0.75rem",
                  color: "#fef08a",
                  fontWeight: 600,
                  cursor: onSelectRemediationConcept ? "pointer" : "default",
                  display: "inline-block",
                  textAlign: "right",
                }}
              >
                📌 گلوگاه ریشه‌ای: [{activeDiagnosis.rootDeficit.cefr}]{" "}
                {activeDiagnosis.rootDeficit.titleFa} (
                {activeDiagnosis.rootDeficit.titleEn}) — تسلط:{" "}
                {Math.round(activeDiagnosis.rootDeficit.currentMastery * 100)}٪
              </button>
            </div>
          )}

          {/* Full Persian Causal Chain Breadcrumbs */}
          {activeDiagnosis.causalChain &&
            activeDiagnosis.causalChain.length > 0 && (
              <div
                style={{
                  marginTop: "6px",
                  paddingTop: "6px",
                  borderTop: "1px dashed rgba(255,255,255,0.15)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "#94a3b8",
                    marginBottom: "4px",
                  }}
                >
                  مسیر پیش‌نیازها در گراف دانش نحو (GAT Causal Chain):
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    flexWrap: "wrap",
                  }}
                >
                  {activeDiagnosis.causalChain.map((node, nIdx) => (
                    <React.Fragment key={node.conceptId}>
                      <span
                        style={{
                          background:
                            node.conceptId ===
                            activeDiagnosis.rootDeficit?.conceptId
                              ? "rgba(239, 68, 68, 0.25)"
                              : "rgba(59, 130, 246, 0.18)",
                          border:
                            node.conceptId ===
                            activeDiagnosis.rootDeficit?.conceptId
                              ? "1px solid rgba(239, 68, 68, 0.5)"
                              : "1px solid rgba(59, 130, 246, 0.35)",
                          borderRadius: "4px",
                          padding: "2px 8px",
                          fontSize: "0.72rem",
                          color:
                            node.conceptId ===
                            activeDiagnosis.rootDeficit?.conceptId
                              ? "#fca5a5"
                              : "#bfdbfe",
                        }}
                      >
                        [{node.cefr}] {node.titleFa} (
                        {Math.round(node.mastery * 100)}٪)
                      </span>
                      {nIdx < activeDiagnosis.causalChain.length - 1 && (
                        <span style={{ color: "#64748b", fontSize: "0.75rem" }}>
                          ←
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}

      {/* Latest Exam Diagnostic Card (Hidden in compact mode if activeDiagnosis exists) */}
      {latestExam && (!compact || !activeDiagnosis) && (
        <div
          style={{
            background: "rgba(30, 41, 59, 0.6)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            borderRadius: "10px",
            padding: "12px 16px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "6px",
            }}
          >
            <span
              style={{ fontWeight: 600, fontSize: "0.85rem", color: "#fbbf24" }}
            >
              📋 آخرین آزمون آیلتس ارزیابی‌شده ({latestExam.examId} - مهارت{" "}
              {latestExam.skill})
            </span>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
              {new Date(latestExam.timestamp).toLocaleDateString("fa-IR")}
            </span>
          </div>
          <p
            style={{
              fontSize: "0.82rem",
              color: "#cbd5e1",
              margin: "0 0 8px",
              lineHeight: 1.6,
            }}
          >
            {latestExam.remediationSummaryFa}
          </p>
          {latestExam.topRootDeficits.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {latestExam.topRootDeficits.map((d, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectRemediationConcept?.(d.conceptId)}
                  style={{
                    background: "rgba(251, 191, 36, 0.15)",
                    border: "1px solid rgba(251, 191, 36, 0.3)",
                    borderRadius: "6px",
                    padding: "4px 8px",
                    fontSize: "0.75rem",
                    color: "#fef08a",
                    cursor: onSelectRemediationConcept ? "pointer" : "default",
                  }}
                >
                  [{d.cefr}] {d.titleFa} — ریشه {d.frequency} خطا
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent Diagnostic Incidents (Hidden in compact mode if activeDiagnosis exists) */}
      {history.length > 0 && (!compact || !activeDiagnosis) && (
        <div>
          <h4
            style={{
              margin: "0 0 10px",
              fontSize: "0.88rem",
              fontWeight: 600,
              color: "#cbd5e1",
            }}
          >
            رویدادهای تشخیصی اخیر:
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {history.map((ev, idx) => (
              <div
                key={idx}
                style={{
                  background:
                    ev.diagnosis === "PREREQUISITE_DEFICIT"
                      ? "rgba(239, 68, 68, 0.08)"
                      : "rgba(16, 185, 129, 0.08)",
                  border:
                    ev.diagnosis === "PREREQUISITE_DEFICIT"
                      ? "1px solid rgba(239, 68, 68, 0.25)"
                      : "1px solid rgba(16, 185, 129, 0.25)",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  fontSize: "0.8rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      color:
                        ev.diagnosis === "PREREQUISITE_DEFICIT"
                          ? "#f87171"
                          : "#34d399",
                      marginBottom: "2px",
                    }}
                  >
                    {ev.diagnosis === "PREREQUISITE_DEFICIT"
                      ? "🎯 نقص پیش‌نیاز ریشه‌ای"
                      : "⚡ لغزش تصادفی"}{" "}
                    — سوال {ev.itemId}
                  </div>
                  <div style={{ color: "#e2e8f0", lineHeight: 1.5 }}>
                    {ev.remediationFa}
                  </div>
                  {ev.rootDeficit && (
                    <div
                      style={{
                        color: "#fbbf24",
                        fontSize: "0.74rem",
                        marginTop: "4px",
                      }}
                    >
                      ریشه علّی: [{ev.rootDeficit.cefr}] {ev.rootDeficit.titleFa} (
                      {ev.rootDeficit.titleEn})
                    </div>
                  )}
                  {ev.causalChain && ev.causalChain.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        flexWrap: "wrap",
                        marginTop: "4px",
                      }}
                    >
                      <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                        مسیر علّی:
                      </span>
                      {ev.causalChain.map((node, nIdx) => (
                        <React.Fragment key={node.conceptId}>
                          <span
                            style={{
                              background: "rgba(59, 130, 246, 0.15)",
                              borderRadius: "3px",
                              padding: "1px 6px",
                              fontSize: "0.7rem",
                              color: "#bfdbfe",
                            }}
                          >
                            [{node.cefr}] {node.titleFa}
                          </span>
                          {nIdx < ev.causalChain.length - 1 && (
                            <span style={{ color: "#64748b", fontSize: "0.7rem" }}>
                              ←
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "#94a3b8",
                    textAlign: "left",
                  }}
                >
                  <div>واکنش: {ev.latencyMs}ms</div>
                  <div>
                    احتمال تسلط: {Math.round(ev.masteryProbability * 100)}٪
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { NeuralCdmEngine } from "@/lib/ai/neural-cdm-engine";
import type { CdmDiagnosticResult, CdmExamDiagnosticSummary } from "@/lib/ai/neural-cdm-types";

interface Props {
  isTeacherView?: boolean;
  onSelectRemediationConcept?: (conceptId: string) => void;
}

export function NeuralCdmDiagnosticPanel({
  isTeacherView = false,
  onSelectRemediationConcept,
}: Props) {
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
  }, []);

  if (stats.totalEvaluations === 0 && !latestExam) {
    return (
      <div style={{
        background: "rgba(15, 23, 42, 0.6)",
        border: "1px dashed rgba(100, 116, 139, 0.4)",
        borderRadius: "12px",
        padding: "20px",
        textAlign: "center",
        color: "#94a3b8",
        fontSize: "0.85rem",
        direction: "rtl"
      }}>
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
    <div style={{
      background: "linear-gradient(145deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.9))",
      border: "1px solid rgba(59, 130, 246, 0.3)",
      borderRadius: "14px",
      padding: "20px",
      direction: "rtl",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
      color: "#f8fafc"
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#60a5fa", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>🧠</span>
            {isTeacherView ? "داشبورد تشخیصی استاد: تحلیل علّی ریشه‌ای خطاهای زبان‌آموز (NeuralCDM)" : "مرکز تحلیل علّی و ریشه‌یابی خطاها (GAT + NeuralCDM)"}
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: "0.78rem", color: "#94a3b8" }}>
            تفکیک علمی لغزش‌های موقت از کاستی‌های ساختاری پایه‌ای (در کمتر از ۱ میلی‌ثانیه بدون بارگذاری مدل اضافه)
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <span style={{
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            borderRadius: "8px",
            padding: "4px 10px",
            fontSize: "0.75rem",
            color: "#34d399",
            fontWeight: 600
          }}>
            ⚡ لغزش تصادفی: {slipRatePercent}٪ ({stats.totalSlips})
          </span>
          <span style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.35)",
            borderRadius: "8px",
            padding: "4px 10px",
            fontSize: "0.75rem",
            color: "#f87171",
            fontWeight: 600
          }}>
            🎯 نقص پیش‌نیاز: {deficitRate}٪ ({stats.totalDeficits})
          </span>
        </div>
      </div>

      {/* Latest Exam Diagnostic Card */}
      {latestExam && (
        <div style={{
          background: "rgba(30, 41, 59, 0.6)",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          borderRadius: "10px",
          padding: "12px 16px",
          marginBottom: "16px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "#fbbf24" }}>
              📋 آخرین آزمون آیلتس ارزیابی‌شده ({latestExam.examId} - مهارت {latestExam.skill})
            </span>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
              {new Date(latestExam.timestamp).toLocaleDateString("fa-IR")}
            </span>
          </div>
          <p style={{ fontSize: "0.82rem", color: "#cbd5e1", margin: "0 0 8px", lineHeight: 1.6 }}>
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
                    cursor: onSelectRemediationConcept ? "pointer" : "default"
                  }}
                >
                  [{d.cefr}] {d.titleFa} — ریشه {d.frequency} خطا
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent Diagnostic Incidents */}
      {history.length > 0 && (
        <div>
          <h4 style={{ margin: "0 0 10px", fontSize: "0.88rem", fontWeight: 600, color: "#cbd5e1" }}>
            رویدادهای تشخیصی اخیر:
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {history.map((ev, idx) => (
              <div
                key={idx}
                style={{
                  background: ev.diagnosis === "PREREQUISITE_DEFICIT"
                    ? "rgba(239, 68, 68, 0.08)"
                    : "rgba(16, 185, 129, 0.08)",
                  border: ev.diagnosis === "PREREQUISITE_DEFICIT"
                    ? "1px solid rgba(239, 68, 68, 0.25)"
                    : "1px solid rgba(16, 185, 129, 0.25)",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  fontSize: "0.8rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "8px"
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: ev.diagnosis === "PREREQUISITE_DEFICIT" ? "#f87171" : "#34d399", marginBottom: "2px" }}>
                    {ev.diagnosis === "PREREQUISITE_DEFICIT" ? "🎯 نقص پیش‌نیاز ریشه‌ای" : "⚡ لغزش تصادفی"} — سوال {ev.itemId}
                  </div>
                  <div style={{ color: "#e2e8f0", lineHeight: 1.5 }}>
                    {ev.remediationFa}
                  </div>
                  {ev.rootDeficit && (
                    <div style={{ color: "#fbbf24", fontSize: "0.74rem", marginTop: "4px" }}>
                      ریشه علّی: [{ev.rootDeficit.cefr}] {ev.rootDeficit.titleFa} ({ev.rootDeficit.titleEn})
                    </div>
                  )}
                </div>

                <div style={{ fontSize: "0.72rem", color: "#94a3b8", textAlign: "left" }}>
                  <div>واکنش: {ev.latencyMs}ms</div>
                  <div>احتمال تسلط: {Math.round(ev.masteryProbability * 100)}٪</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

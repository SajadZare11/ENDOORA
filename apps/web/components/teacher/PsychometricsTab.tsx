"use client";

import React, { useState, useMemo } from "react";
import { SidaGradebookState, SidaStudentRecord, EXAM_ITEMS } from "../../lib/teacher-sida-gradebook";
import {
  calculateMean,
  calculateMedian,
  calculateMode,
  calculateDispersion,
  calculateQuartiles,
  calculateDistributionShape,
  calculateStudentStandardizedScores,
  calculateStudyGradeRegression,
  calculateItemAnalysis,
  generateClassNarrative,
  StudentStandardizedScore,
} from "../../lib/psychometrics";
import { BellCurveHistogram, HistogramBin } from "../analytics/BellCurveHistogram";
import { BoxWhiskerPlot } from "../analytics/BoxWhiskerPlot";
import { StudyScatterPlot } from "../analytics/StudyScatterPlot";
import { SubjectRadarChart } from "../analytics/SubjectRadarChart";
import { StatTooltip } from "../analytics/StatTooltip";
import { TriageActionModal } from "./TriageActionModal";

interface PsychometricsTabProps {
  gradebook: SidaGradebookState;
  onFilterBinSelect?: (bin: HistogramBin | null) => void;
  selectedBin?: HistogramBin | null;
}

export function PsychometricsTab({
  gradebook,
  onFilterBinSelect,
  selectedBin: externalSelectedBin,
}: PsychometricsTabProps) {
  const [internalSelectedBin, setInternalSelectedBin] = useState<HistogramBin | null>(null);
  const selectedBin = externalSelectedBin !== undefined ? externalSelectedBin : internalSelectedBin;

  const handleSelectBin = (bin: HistogramBin | null) => {
    setInternalSelectedBin(bin);
    if (onFilterBinSelect) {
      onFilterBinSelect(bin);
    }
  };

  // Triage Modal state
  const [activeTriage, setActiveTriage] = useState<{
    student: SidaStudentRecord;
    stats: StudentStandardizedScore;
    mode: "remediation" | "counselor";
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedNarrative, setCopiedNarrative] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Extract active scores
  const activeStudents = useMemo(() => gradebook.students.filter((s) => !s.isAbsent), [gradebook.students]);
  const rawScores = useMemo(() => activeStudents.map((s) => s.examScore), [activeStudents]);

  // Descriptive Statistics
  const mean = useMemo(() => calculateMean(rawScores), [rawScores]);
  const median = useMemo(() => calculateMedian(rawScores), [rawScores]);
  const modes = useMemo(() => calculateMode(rawScores), [rawScores]);
  const dispersion = useMemo(() => calculateDispersion(rawScores), [rawScores]);
  const quartiles = useMemo(() => calculateQuartiles(rawScores), [rawScores]);
  const shape = useMemo(() => calculateDistributionShape(rawScores), [rawScores]);

  // Standardized individual metrics (Z, T, Taraz, Percentile)
  const standardizedScores = useMemo(
    () =>
      calculateStudentStandardizedScores(
        gradebook.students.map((s) => ({ id: s.studentId, name: s.name, score: s.examScore, isAbsent: s.isAbsent })),
        gradebook.maxScore
      ),
    [gradebook.students, gradebook.maxScore]
  );

  // Linear Regression (Study vs Grade)
  const regression = useMemo(
    () =>
      calculateStudyGradeRegression(
        gradebook.students.map((s) => ({
          studyHours: s.weeklyStudyHours,
          score: s.examScore,
          isAbsent: s.isAbsent,
        }))
      ),
    [gradebook.students]
  );

  // Item Analysis & Cronbach's Alpha
  const itemAnalysisData = useMemo(() => {
    return calculateItemAnalysis(
      EXAM_ITEMS,
      gradebook.students.map((s) => ({
        studentId: s.studentId,
        totalScore: s.examScore,
        scores: s.itemScores || {},
      }))
    );
  }, [gradebook.students]);

  // Automated Educational Narrative
  const classNarrative = useMemo(() => {
    const descriptive = {
      count: activeStudents.length,
      mean,
      median,
      mode: modes,
      variance: dispersion.variance,
      stdDev: dispersion.stdDev,
      cv: dispersion.cv,
      isHomogeneous: dispersion.cv < 18,
      hasGapAlert: dispersion.cv > 30,
      min: Math.min(...rawScores, 0),
      max: Math.max(...rawScores, 0),
      range: Math.max(...rawScores, 0) - Math.min(...rawScores, 0),
    };
    return generateClassNarrative(descriptive, quartiles, shape, regression, gradebook.maxScore);
  }, [activeStudents.length, mean, median, modes, dispersion, rawScores, quartiles, shape, regression, gradebook.maxScore]);

  // Early Warning Triage Students (Z <= -1.0 or in Q1)
  const triageStudents = useMemo(() => {
    return standardizedScores.filter((s) => s.isEarlyWarning);
  }, [standardizedScores]);

  const minScore = rawScores.length > 0 ? Math.min(...rawScores) : 0;
  const maxScoreFound = rawScores.length > 0 ? Math.max(...rawScores) : 0;

  const handleCopyNarrative = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(classNarrative);
      setCopiedNarrative(true);
      setTimeout(() => setCopiedNarrative(false), 2000);
      showToast("متن تحلیل هوشمند در کلیپ‌بورد کپی شد.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", direction: "rtl" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            backgroundColor: "#0f172a",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
            zIndex: 99999,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Triage Action Modal */}
      {activeTriage && (
        <TriageActionModal
          isOpen={true}
          onClose={() => setActiveTriage(null)}
          student={activeTriage.student}
          stats={activeTriage.stats}
          mode={activeTriage.mode}
          onConfirmSuccess={showToast}
        />
      )}

      {/* 1. Descriptive KPI Metric Cards Strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
        }}
      >
        {/* Mean Card */}
        <div
          style={{
            backgroundColor: "var(--color-bg-surface, #ffffff)",
            borderRadius: "10px",
            padding: "14px 16px",
            border: "1px solid var(--color-border-subtle, #e2e8f0)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "var(--color-text-secondary, #64748b)" }}>میانگین کلاس (μ)</span>
            <StatTooltip
              title="میانگین حسابی (Mean)"
              explanation="معدل حسابی نمرات آزمون کلاس."
              formula="μ = Σ X / N"
            />
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, marginTop: "4px", color: "var(--color-primary-600, #2563eb)" }}>
            {mean} <span style={{ fontSize: "12px", fontWeight: 500, color: "#64748b" }}>از {gradebook.maxScore}</span>
          </div>
        </div>

        {/* Median (Q2) Card */}
        <div
          style={{
            backgroundColor: "var(--color-bg-surface, #ffffff)",
            borderRadius: "10px",
            padding: "14px 16px",
            border: "1px solid var(--color-border-subtle, #e2e8f0)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "var(--color-text-secondary, #64748b)" }}>میانه نمرات (Q2)</span>
            <StatTooltip
              title="میانه (Median)"
              explanation="نمره‌ای که جمعیت دانش‌آموزان را دقیقاً به دو نیمه ۵۰ درصدی مساوی تقسیم می‌کند و بر خلاف میانگین، تحت تاثیر داده‌های پرت قرار نمی‌گیرد."
            />
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, marginTop: "4px", color: "#dc2626" }}>
            {median}
          </div>
        </div>

        {/* StdDev (σ) Card */}
        <div
          style={{
            backgroundColor: "var(--color-bg-surface, #ffffff)",
            borderRadius: "10px",
            padding: "14px 16px",
            border: "1px solid var(--color-border-subtle, #e2e8f0)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "var(--color-text-secondary, #64748b)" }}>انحراف معیار (σ)</span>
            <StatTooltip
              title="انحراف معیار و واریانس"
              explanation="شاخص سنجش میزان فاصله و پراکندگی نمرات دانش‌آموزان از میانگین حسابی."
              formula="σ = √( Σ(X - μ)² / (N - 1) )"
            />
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, marginTop: "4px" }}>
            {dispersion.stdDev}{" "}
            <span style={{ fontSize: "11px", color: "#64748b" }}>(وار: {dispersion.variance})</span>
          </div>
        </div>

        {/* Coefficient of Variation (CV) Card */}
        <div
          style={{
            backgroundColor: dispersion.cv > 30 ? "rgba(239, 68, 68, 0.06)" : "var(--color-bg-surface, #ffffff)",
            borderRadius: "10px",
            padding: "14px 16px",
            border: dispersion.cv > 30 ? "1px solid #ef4444" : "1px solid var(--color-border-subtle, #e2e8f0)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: dispersion.cv > 30 ? "#b91c1c" : "var(--color-text-secondary, #64748b)" }}>
              ضریب تغییرات (CV)
            </span>
            <StatTooltip
              title="ضریب تغییرات (CV)"
              explanation="معیار سنجش همگنی یا شکاف کلاسی. اگر کمتر از ۱۸٪ باشد کلاس کاملاً یکدست است و اگر بالای ۳۰٪ باشد نشانگر شکاف آموزشی عمیق است."
              formula="CV = (StdDev / Mean) * 100"
            />
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, marginTop: "4px", color: dispersion.cv > 30 ? "#b91c1c" : "#047857" }}>
            {dispersion.cv}٪
          </div>
          <div style={{ fontSize: "10px", marginTop: "2px", fontWeight: 600, color: dispersion.cv > 30 ? "#b91c1c" : "#047857" }}>
            {dispersion.cv < 18 ? "کلاس بسیار همگن و یکدست" : dispersion.cv > 30 ? "⚠️ هشدار شکاف آموزشی عمیق" : "پراکندگی در حد متعادل"}
          </div>
        </div>

        {/* Skewness Card */}
        <div
          style={{
            backgroundColor: "var(--color-bg-surface, #ffffff)",
            borderRadius: "10px",
            padding: "14px 16px",
            border: "1px solid var(--color-border-subtle, #e2e8f0)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "var(--color-text-secondary, #64748b)" }}>چولگی آزمون (Skew)</span>
            <StatTooltip
              title="چولگی و تقارن آزمون"
              explanation="چولگی منفی (به چپ) بیانگر تراکم نمرات بالا و تسلط بر آزمون است. چولگی مثبت بیانگر سختی زیاد سوالات یا نیاز به تدریس جبرانی است."
            />
          </div>
          <div style={{ fontSize: "20px", fontWeight: 800, marginTop: "4px", color: "#0f172a" }}>
            {shape.skewness}
          </div>
          <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>
            {shape.skewnessLabelFa}
          </div>
        </div>

        {/* Cronbach's Alpha Card */}
        <div
          style={{
            backgroundColor: "var(--color-bg-surface, #ffffff)",
            borderRadius: "10px",
            padding: "14px 16px",
            border: "1px solid var(--color-border-subtle, #e2e8f0)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "var(--color-text-secondary, #64748b)" }}>پایایی آزمون (α)</span>
            <StatTooltip
              title="آلفای کرونباخ (Cronbach's Alpha)"
              explanation="سنجش همسانی درونی سوالات آزمون. مقادیر بالای ۰.۷ پایایی و استاندارد بودن آزمون را تایید می‌کنند."
            />
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, marginTop: "4px", color: "#0284c7" }}>
            {itemAnalysisData.cronbachAlpha}
          </div>
          <div style={{ fontSize: "10px", color: itemAnalysisData.cronbachAlpha >= 0.7 ? "#047857" : "#d97706", marginTop: "2px", fontWeight: 600 }}>
            {itemAnalysisData.cronbachAlpha >= 0.7 ? "پایایی استاندارد و بالا" : "پایایی متوسط آزمونک"}
          </div>
        </div>
      </div>

      {/* 2. Automated Smart Persian Narrative Generator Card */}
      <div
        style={{
          backgroundColor: "rgba(37, 99, 235, 0.04)",
          borderRadius: "12px",
          padding: "18px 22px",
          border: "1px solid rgba(37, 99, 235, 0.2)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>🤖</span>
            <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: "#1e40af" }}>
              گزارش تحلیلی هوشمند عملکرد کلاس (Class Narrative Generator)
            </h4>
          </div>
          <button
            type="button"
            onClick={handleCopyNarrative}
            style={{
              padding: "5px 12px",
              borderRadius: "6px",
              border: "1px solid #93c5fd",
              backgroundColor: "#ffffff",
              color: "#1d4ed8",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {copiedNarrative ? "✓ کپی شد!" : "📋 کپی متن گزارش برای اولیا/شورا"}
          </button>
        </div>
        <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.8, color: "#1e293b", textAlign: "justify" }}>
          {classNarrative}
        </p>
      </div>

      {/* 3. 2x2 Interactive Charts Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))",
          gap: "20px",
        }}
      >
        {/* 1. Bell Curve Histogram */}
        <BellCurveHistogram
          scores={gradebook.students.map((s) => ({
            id: s.studentId,
            name: s.name,
            score: s.examScore,
            isAbsent: s.isAbsent,
          }))}
          maxScore={gradebook.maxScore}
          mean={mean}
          stdDev={dispersion.stdDev}
          selectedBin={selectedBin}
          onSelectBin={handleSelectBin}
        />

        {/* 2. Box & Whisker Plot */}
        <BoxWhiskerPlot
          quartiles={quartiles}
          min={minScore}
          max={maxScoreFound}
          maxScore={gradebook.maxScore}
          allScores={gradebook.students.map((s) => ({
            id: s.studentId,
            name: s.name,
            score: s.examScore,
            isAbsent: s.isAbsent,
          }))}
        />

        {/* 3. Study Hours Scatter Plot */}
        <StudyScatterPlot
          students={gradebook.students}
          maxScore={gradebook.maxScore}
          regression={regression}
        />

        {/* 4. Subject Comparison Radar */}
        <SubjectRadarChart students={gradebook.students} />
      </div>

      {/* 4. Early Warning Triage System (سامانه غربالگری و تریاژ آموزشی) */}
      <div
        style={{
          backgroundColor: "var(--color-bg-surface, #ffffff)",
          borderRadius: "12px",
          padding: "20px",
          border: "1px solid var(--color-border-subtle, #e2e8f0)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "#b91c1c", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>🚨</span> سامانه غربالگری و تریاژ آموزشی (Early Warning Triage)
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--color-text-secondary, #64748b)" }}>
              دانش‌آموزانی که نمره استاندارد Z ≤ -۱.۰ دارند یا در چارک اول (Q1) قرار گرفته‌اند و نیازمند مداخله آموزشی فوری هستند.
            </p>
          </div>
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "12px",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              color: "#b91c1c",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            {triageStudents.length} دانش‌آموز تحت پوشش تریاژ
          </span>
        </div>

        {triageStudents.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "14px" }}>
            {triageStudents.map((stat) => {
              const fullStudent = gradebook.students.find((s) => s.studentId === stat.studentId);
              if (!fullStudent) return null;

              return (
                <div
                  key={stat.studentId}
                  style={{
                    border: "1px solid #fecaca",
                    backgroundColor: "rgba(254, 242, 242, 0.4)",
                    borderRadius: "10px",
                    padding: "14px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <strong style={{ fontSize: "14px", color: "#0f172a" }}>{stat.name}</strong>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>کد ملی: {fullStudent.nationalCode}</div>
                    </div>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        backgroundColor: "#ef4444",
                        color: "#ffffff",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      Z = {stat.zScore}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px", fontSize: "11px" }}>
                    <div style={{ backgroundColor: "#ffffff", padding: "4px 6px", borderRadius: "4px", border: "1px solid #fee2e2" }}>
                      نمره: <strong style={{ color: "#b91c1c" }}>{stat.rawScore}</strong>
                    </div>
                    <div style={{ backgroundColor: "#ffffff", padding: "4px 6px", borderRadius: "4px", border: "1px solid #fee2e2" }}>
                      تراز: <strong>{stat.taraz}</strong>
                    </div>
                    <div style={{ backgroundColor: "#ffffff", padding: "4px 6px", borderRadius: "4px", border: "1px solid #fee2e2" }}>
                      مطالعه: <strong>{fullStudent.weeklyStudyHours}h/w</strong>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveTriage({
                          student: fullStudent,
                          stats: stat,
                          mode: "remediation",
                        })
                      }
                      style={{
                        flex: 1,
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: "#2563eb",
                        color: "#ffffff",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      🎯 صدور تکلیف جبرانی
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveTriage({
                          student: fullStudent,
                          stats: stat,
                          mode: "counselor",
                        })
                      }
                      style={{
                        flex: 1,
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid #d97706",
                        backgroundColor: "rgba(217, 119, 6, 0.08)",
                        color: "#b45309",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      🩺 ارجاع به مشاور
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "20px", color: "#047857", fontSize: "13px" }}>
            ✓ تمام دانش‌آموزان کلاس نمره مطلوب‌تر از حد آستانه ریسک (Z &gt; -۱.۰) کسب کرده‌اند و هیچ هشدار بحرانی فعالی وجود ندارد.
          </div>
        )}
      </div>

      {/* 5. Standardized Scores & Taraz Master Table */}
      <div
        style={{
          backgroundColor: "var(--color-bg-surface, #ffffff)",
          borderRadius: "12px",
          border: "1px solid var(--color-border-subtle, #e2e8f0)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
          overflowX: "auto",
        }}
      >
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700 }}>
              ۵. جدول نمرات استاندارد فردی و شبیه‌سازی تراز کنکوری
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#64748b" }}>
              محاسبه نمرات Z و T استاندارد، تراز شبیه‌سازی شده سازمان سنجش و کانون (مقیاس ۲۵۰۰ تا ۱۰۵۰۰) و رتبه صدکی.
            </p>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #cbd5e1" }}>
              <th style={{ padding: "10px", textAlign: "right" }}>دانش‌آموز</th>
              <th style={{ padding: "10px", textAlign: "center" }}>نمره خام</th>
              <th style={{ padding: "10px", textAlign: "center" }}>درصد</th>
              <th style={{ padding: "10px", textAlign: "center" }}>نمره استاندارد Z</th>
              <th style={{ padding: "10px", textAlign: "center" }}>نمره استاندارد T</th>
              <th style={{ padding: "10px", textAlign: "center", backgroundColor: "rgba(37,99,235,0.06)" }}>
                تراز شبیه‌سازی شده
              </th>
              <th style={{ padding: "10px", textAlign: "center" }}>رتبه صدکی (Percentile)</th>
              <th style={{ padding: "10px", textAlign: "center" }}>وضعیت روان‌سنجی</th>
            </tr>
          </thead>
          <tbody>
            {standardizedScores.map((score) => {
              const fullStudent = gradebook.students.find((s) => s.studentId === score.studentId);
              return (
                <tr key={score.studentId} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "8px 10px", fontWeight: 600 }}>{score.name}</td>
                  <td style={{ padding: "8px 10px", textAlign: "center", fontWeight: 700 }}>{score.rawScore}</td>
                  <td style={{ padding: "8px 10px", textAlign: "center" }}>{score.percentage}٪</td>
                  <td
                    style={{
                      padding: "8px 10px",
                      textAlign: "center",
                      fontFamily: "monospace",
                      fontWeight: 700,
                      color: score.zScore < 0 ? "#b91c1c" : "#15803d",
                    }}
                  >
                    {score.zScore > 0 ? `+${score.zScore}` : score.zScore}
                  </td>
                  <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "monospace" }}>{score.tScore}</td>
                  <td
                    style={{
                      padding: "8px 10px",
                      textAlign: "center",
                      fontFamily: "monospace",
                      fontWeight: 800,
                      color: "var(--color-primary-600, #2563eb)",
                      backgroundColor: "rgba(37,99,235,0.03)",
                    }}
                  >
                    {score.taraz}
                  </td>
                  <td style={{ padding: "8px 10px", textAlign: "center" }}>
                    برتر از <strong>{score.percentileRank}٪</strong> همکلاسی‌ها
                  </td>
                  <td style={{ padding: "8px 10px", textAlign: "center" }}>
                    {score.isOutlier ? (
                      <span style={{ color: "#b91c1c", fontWeight: 700, fontSize: "11px" }}>⚠️ داده پرت توکی</span>
                    ) : score.isEarlyWarning ? (
                      <span style={{ color: "#d97706", fontWeight: 700, fontSize: "11px" }}>نیازمند مداخله</span>
                    ) : (
                      <span style={{ color: "#15803d", fontSize: "11px" }}>وضعیت مطلوب</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 6. Item Analysis & Reliability Table */}
      <div
        style={{
          backgroundColor: "var(--color-bg-surface, #ffffff)",
          borderRadius: "12px",
          border: "1px solid var(--color-border-subtle, #e2e8f0)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
          overflowX: "auto",
        }}
      >
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700 }}>
              ۶. تحلیل سوالات آزمون (Item Analysis & Question Quality)
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#64748b" }}>
              سنجش ضریب دشواری (p-value) و ضریب تمیز (d-index با مقایسه عملکرد ۲۷٪ بالای کلاس در برابر ۲۷٪ پایین).
            </p>
          </div>
          <div style={{ fontSize: "12px", color: "#0284c7", fontWeight: 700 }}>
            آلفای کرونباخ کلی: {itemAnalysisData.cronbachAlpha}
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #cbd5e1" }}>
              <th style={{ padding: "10px", textAlign: "right" }}>عنوان سوال</th>
              <th style={{ padding: "10px", textAlign: "center" }}>بارم سوال</th>
              <th style={{ padding: "10px", textAlign: "center" }}>ضریب دشواری (p-value)</th>
              <th style={{ padding: "10px", textAlign: "center" }}>سطح دشواری</th>
              <th style={{ padding: "10px", textAlign: "center" }}>ضریب تمیز (d-index)</th>
              <th style={{ padding: "10px", textAlign: "center" }}>کیفیت تفکیک‌کنندگی سوال</th>
            </tr>
          </thead>
          <tbody>
            {itemAnalysisData.items.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "10px", fontWeight: 600 }}>{item.title}</td>
                <td style={{ padding: "10px", textAlign: "center" }}>{item.maxPoints} نمره</td>
                <td style={{ padding: "10px", textAlign: "center", fontFamily: "monospace", fontWeight: 700 }}>
                  {item.pValue}
                </td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: 600,
                      backgroundColor:
                        item.difficultyLabelFa === "متوسط و ایده‌آل"
                          ? "rgba(16, 185, 129, 0.1)"
                          : "rgba(245, 158, 11, 0.1)",
                      color:
                        item.difficultyLabelFa === "متوسط و ایده‌آل" ? "#047857" : "#b45309",
                    }}
                  >
                    {item.difficultyLabelFa}
                  </span>
                </td>
                <td style={{ padding: "10px", textAlign: "center", fontFamily: "monospace", fontWeight: 700 }}>
                  {item.dIndex}
                </td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: 600,
                      backgroundColor:
                        item.dIndex >= 0.2 ? "rgba(37, 99, 235, 0.1)" : "rgba(239, 68, 68, 0.1)",
                      color: item.dIndex >= 0.2 ? "#1d4ed8" : "#b91c1c",
                    }}
                  >
                    {item.discriminationLabelFa}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

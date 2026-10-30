"use client";

import React, { useState } from "react";
import {
  SidaGradebookState,
  SidaStudentRecord,
  calculateSidaAnnualScore,
  getPerformanceTier,
  exportSidaGradebookCsv,
  resetSidaGradebook,
} from "../../lib/teacher-sida-gradebook";

interface GradeEntryTabProps {
  gradebook: SidaGradebookState;
  onChange: (updated: SidaGradebookState) => void;
  classTitle: string;
  activeFilterBinLabel?: string | null;
  onClearBinFilter?: () => void;
  filteredStudentIds?: string[] | null;
}

export function GradeEntryTab({
  gradebook,
  onChange,
  classTitle,
  activeFilterBinLabel,
  onClearBinFilter,
  filteredStudentIds,
}: GradeEntryTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [customMaxInput, setCustomMaxInput] = useState("");
  const [showCustomMaxModal, setShowCustomMaxModal] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 2500);
  };

  // Filter students based on search and optional histogram bin filter
  const displayedStudents = gradebook.students.filter((s) => {
    if (filteredStudentIds && filteredStudentIds.length > 0 && !filteredStudentIds.includes(s.studentId)) {
      return false;
    }
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.nationalCode.includes(q);
  });

  // 2. Live Form Average (calculating live average of active, present students)
  const presentStudents = gradebook.students.filter((s) => !s.isAbsent);
  const liveAverageScore =
    presentStudents.length > 0
      ? Number((presentStudents.reduce((acc, s) => acc + s.examScore, 0) / presentStudents.length).toFixed(2))
      : 0;

  const liveAveragePercentage =
    gradebook.maxScore > 0 ? Number(((liveAverageScore / gradebook.maxScore) * 100).toFixed(1)) : 0;

  const liveAverageTier = getPerformanceTier(liveAveragePercentage);

  // 1. Dynamic Max Score Change
  const handleSetMaxScore = (newMax: number) => {
    if (newMax <= 0) return;
    const updated: SidaGradebookState = {
      ...gradebook,
      maxScore: newMax,
      updatedAt: new Date().toISOString(),
    };
    onChange(updated);
    showToast(`سقف نمره به ${newMax} تغییر یافت و درصدها به‌روز شدند.`);
  };

  // 3. Batch Fast-Fill: Full score for all present students
  const handleFillAllFullScore = () => {
    const updatedStudents = gradebook.students.map((s) => ({
      ...s,
      examScore: s.isAbsent ? 0 : gradebook.maxScore,
    }));
    onChange({
      ...gradebook,
      students: updatedStudents,
      updatedAt: new Date().toISOString(),
    });
    showToast(`نمره تمام دانش‌آموزان برابر با سقف نمره (${gradebook.maxScore}) شد.`);
  };

  // 3. Batch Fast-Fill: Clear/Reset all exam scores to zero
  const handleClearAllScores = () => {
    if (typeof window !== "undefined" && !window.confirm("آیا از پاکسازی تمام نمرات این آزمون اطمینان دارید؟")) {
      return;
    }
    const updatedStudents = gradebook.students.map((s) => ({
      ...s,
      examScore: 0,
    }));
    onChange({
      ...gradebook,
      students: updatedStudents,
      updatedAt: new Date().toISOString(),
    });
    showToast("تمام نمرات پاکسازی شدند.");
  };

  // Reset to default rich seed data
  const handleResetToSeeds = () => {
    if (typeof window !== "undefined" && !window.confirm("آیا مایل به بازیابی داده‌های نمونه پیش‌فرض هستید؟")) {
      return;
    }
    const fresh = resetSidaGradebook(gradebook.classId);
    onChange(fresh);
    showToast("داده‌های نمونه اولیه با موفقیت بارگذاری شدند.");
  };

  // 4 & 6. Individual Student Edit (Inline)
  const handleUpdateStudent = (studentId: string, partial: Partial<SidaStudentRecord>) => {
    const updatedStudents = gradebook.students.map((s) => {
      if (s.studentId !== studentId) return s;

      const merged = { ...s, ...partial };
      // Recalculate SIDA Annual score if term grades changed
      if (
        "continuous1" in partial ||
        "final1" in partial ||
        "continuous2" in partial ||
        "final2" in partial
      ) {
        merged.annualScore = calculateSidaAnnualScore(
          merged.continuous1,
          merged.final1,
          merged.continuous2,
          merged.final2,
          gradebook.sidaMultiplier
        );
      }
      return merged;
    });

    onChange({
      ...gradebook,
      students: updatedStudents,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", direction: "rtl" }}>
      {/* Save Notification Toast */}
      {saveToast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            backgroundColor: "#0f172a",
            color: "#ffffff",
            padding: "10px 18px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>✓</span> {saveToast}
        </div>
      )}

      {/* Top Banner: 1. Dynamic Max Score + 2. Live Form Average */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "16px",
        }}
      >
        {/* Dynamic Max Score Selector Card */}
        <div
          style={{
            backgroundColor: "var(--color-bg-surface, #ffffff)",
            borderRadius: "12px",
            padding: "16px 20px",
            border: "1px solid var(--color-border-subtle, #e2e8f0)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-text-primary, #0f172a)" }}>
              ۱. انعطاف در سقف نمره (Max Score):
            </span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 800,
                color: "var(--color-primary-600, #2563eb)",
                backgroundColor: "rgba(37,99,235,0.08)",
                padding: "3px 10px",
                borderRadius: "6px",
              }}
            >
              سقف فعلی: {gradebook.maxScore} نمره
            </span>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "var(--color-text-secondary, #64748b)" }}>کلیدهای سریع:</span>
            {[20, 10, 100].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleSetMaxScore(preset)}
                style={{
                  padding: "5px 14px",
                  borderRadius: "6px",
                  border: gradebook.maxScore === preset ? "2px solid #2563eb" : "1px solid #cbd5e1",
                  backgroundColor: gradebook.maxScore === preset ? "rgba(37, 99, 235, 0.12)" : "transparent",
                  color: gradebook.maxScore === preset ? "#2563eb" : "inherit",
                  fontSize: "12px",
                  fontWeight: gradebook.maxScore === preset ? 800 : 500,
                  cursor: "pointer",
                }}
              >
                {preset === 20 ? "۲۰ (رسمی آموزش‌وپرورش)" : preset === 10 ? "۱۰ (کوییز کلاسی)" : "۱۰۰ (تستی/درصدی)"}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setShowCustomMaxModal(true)}
              style={{
                padding: "5px 12px",
                borderRadius: "6px",
                border: "1px dashed #94a3b8",
                backgroundColor: "transparent",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              سقف دلخواه...
            </button>
          </div>
        </div>

        {/* Live Form Average KPI Card */}
        <div
          style={{
            backgroundColor: "var(--color-bg-surface, #ffffff)",
            borderRadius: "12px",
            padding: "16px 20px",
            border: "1px solid var(--color-border-subtle, #e2e8f0)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-text-secondary, #64748b)" }}>
              ۲. پیش‌نمایش زنده میانگین نمرات (Live Form Average)
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "4px" }}>
              <span style={{ fontSize: "24px", fontWeight: 900, color: liveAverageTier.colorHex }}>
                {liveAverageScore}
              </span>
              <span style={{ fontSize: "13px", color: "var(--color-text-secondary, #64748b)" }}>
                از {gradebook.maxScore} ({liveAveragePercentage}٪)
              </span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: liveAverageTier.colorHex,
                  backgroundColor: `${liveAverageTier.colorHex}18`,
                  padding: "2px 8px",
                  borderRadius: "4px",
                }}
              >
                {liveAverageTier.labelFa}
              </span>
            </div>
          </div>

          <div style={{ textAlign: "left", fontSize: "11px", color: "var(--color-text-secondary, #64748b)" }}>
            <div>حاضرین: {presentStudents.length} نفر</div>
            <div>غایبین: {gradebook.students.length - presentStudents.length} نفر</div>
          </div>
        </div>
      </div>

      {/* Action Toolbar: Batch fast-fills, Export, Search, Filter */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          backgroundColor: "var(--color-bg-surface, #ffffff)",
          padding: "12px 18px",
          borderRadius: "10px",
          border: "1px solid var(--color-border-subtle, #e2e8f0)",
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="جستجوی نام، ایمیل، کد ملی..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "7px 12px",
              borderRadius: "6px",
              border: "1px solid var(--color-border-subtle, #cbd5e1)",
              fontSize: "12px",
              width: "220px",
            }}
          />

          {/* Active Bin Filter Badge */}
          {activeFilterBinLabel && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "rgba(37, 99, 235, 0.1)",
                color: "#1d4ed8",
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              <span>فیلتر نمودار: بازه {activeFilterBinLabel}</span>
              {onClearBinFilter && (
                <button
                  type="button"
                  onClick={onClearBinFilter}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#1d4ed8", fontWeight: 700 }}
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>

        {/* 3. Batch Fast Fill Tools */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={handleFillAllFullScore}
            style={{
              padding: "7px 14px",
              borderRadius: "6px",
              border: "1px solid #10b981",
              backgroundColor: "rgba(16, 185, 129, 0.08)",
              color: "#047857",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ⚡ نمره کامل برای همه
          </button>

          <button
            type="button"
            onClick={handleClearAllScores}
            style={{
              padding: "7px 14px",
              borderRadius: "6px",
              border: "1px solid #ef4444",
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              color: "#b91c1c",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            🧹 پاکسازی همه
          </button>

          <button
            type="button"
            onClick={handleResetToSeeds}
            style={{
              padding: "7px 14px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              backgroundColor: "var(--color-bg-muted, #f1f5f9)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            🔄 دیتای نمونه اولیه
          </button>

          <button
            type="button"
            onClick={() => exportSidaGradebookCsv(gradebook, classTitle)}
            style={{
              padding: "7px 16px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "var(--color-primary-600, #2563eb)",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(37,99,235,0.2)",
            }}
          >
            📊 خروجی اکسل کامل (XLSX/CSV)
          </button>
        </div>
      </div>

      {/* Custom Max Score Modal */}
      {showCustomMaxModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "20px",
              borderRadius: "10px",
              width: "320px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              direction: "rtl",
            }}
          >
            <h4 style={{ margin: "0 0 10px", fontSize: "15px" }}>تنظیم سقف نمره دلخواه</h4>
            <input
              type="number"
              placeholder="مثلاً: ۱۵، ۳۰، ۴۰..."
              value={customMaxInput}
              onChange={(e) => setCustomMaxInput(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                marginBottom: "14px",
                fontSize: "14px",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setShowCustomMaxModal(false)}
                style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "none" }}
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => {
                  const val = parseFloat(customMaxInput);
                  if (val > 0) {
                    handleSetMaxScore(val);
                    setShowCustomMaxModal(false);
                    setCustomMaxInput("");
                  }
                }}
                style={{
                  padding: "6px 16px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  fontWeight: 700,
                }}
              >
                اعمال سقف نمره
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Wide Gradebook Table */}
      <div
        style={{
          backgroundColor: "var(--color-bg-surface, #ffffff)",
          borderRadius: "12px",
          border: "1px solid var(--color-border-subtle, #e2e8f0)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
          overflowX: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "1100px" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--color-bg-muted, #f8fafc)", borderBottom: "1px solid #cbd5e1" }}>
              <th style={{ padding: "12px 10px", textAlign: "right" }}>دانش‌آموز</th>
              <th style={{ padding: "12px 8px", textAlign: "center" }}>حضور / غیبت</th>
              <th style={{ padding: "12px 8px", textAlign: "center", backgroundColor: "rgba(37,99,235,0.06)" }}>
                نمره آزمون (سقف {gradebook.maxScore})
              </th>
              <th style={{ padding: "12px 8px", textAlign: "center" }}>درصد و تسلط</th>
              <th style={{ padding: "12px 8px", textAlign: "center" }}>مطالعه هفتگی</th>
              <th style={{ padding: "12px 8px", textAlign: "center" }}>مستمر اول (ض ۱)</th>
              <th style={{ padding: "12px 8px", textAlign: "center" }}>پایانی اول (ض ۲)</th>
              <th style={{ padding: "12px 8px", textAlign: "center" }}>مستمر دوم (ض ۱)</th>
              <th style={{ padding: "12px 8px", textAlign: "center" }}>پایانی دوم (ض {gradebook.sidaMultiplier})</th>
              <th style={{ padding: "12px 8px", textAlign: "center", backgroundColor: "#f1f5f9" }}>نمره سالانه سیدا</th>
              <th style={{ padding: "12px 8px", textAlign: "center" }}>انضباط</th>
            </tr>
          </thead>
          <tbody>
            {displayedStudents.length > 0 ? (
              displayedStudents.map((student) => {
                const percentage =
                  gradebook.maxScore > 0
                    ? Number(((student.examScore / gradebook.maxScore) * 100).toFixed(1))
                    : 0;
                const tier = getPerformanceTier(percentage);

                return (
                  <tr
                    key={student.studentId}
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                      backgroundColor: student.isAbsent ? "rgba(241, 245, 249, 0.6)" : "transparent",
                    }}
                  >
                    {/* Student Info */}
                    <td style={{ padding: "10px", textAlign: "right" }}>
                      <div style={{ fontWeight: 700, color: "var(--color-text-primary, #0f172a)" }}>
                        {student.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--color-text-secondary, #64748b)" }}>
                        کد ملی: {student.nationalCode}
                      </div>
                    </td>

                    {/* 4. Absenteeism Toggle */}
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => handleUpdateStudent(student.studentId, { isAbsent: !student.isAbsent })}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "14px",
                          border: "none",
                          fontSize: "11px",
                          fontWeight: 700,
                          cursor: "pointer",
                          backgroundColor: student.isAbsent ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
                          color: student.isAbsent ? "#b91c1c" : "#047857",
                        }}
                      >
                        {student.isAbsent ? "غایب ✕" : "حاضر ✓"}
                      </button>
                    </td>

                    {/* 1 & 6. Exam Raw Score (Inline Edit, disabled if absent) */}
                    <td
                      style={{
                        padding: "8px",
                        textAlign: "center",
                        backgroundColor: "rgba(37,99,235,0.03)",
                      }}
                    >
                      <input
                        type="number"
                        step="0.25"
                        min="0"
                        max={gradebook.maxScore}
                        disabled={student.isAbsent}
                        value={student.isAbsent ? "" : student.examScore}
                        placeholder={student.isAbsent ? "غایب" : "۰"}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          handleUpdateStudent(student.studentId, {
                            examScore: isNaN(val) ? 0 : Math.min(gradebook.maxScore, Math.max(0, val)),
                          });
                        }}
                        style={{
                          width: "70px",
                          padding: "5px 8px",
                          textAlign: "center",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "13px",
                          fontWeight: 700,
                          backgroundColor: student.isAbsent ? "#f1f5f9" : "#ffffff",
                          color: student.isAbsent ? "#94a3b8" : "inherit",
                        }}
                      />
                    </td>

                    {/* 5. Real-time percentage & Qualitative Mastery Badge */}
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      {student.isAbsent ? (
                        <span style={{ color: "#94a3b8", fontSize: "11px" }}>بدون نمره</span>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                          <span style={{ fontWeight: 800, fontSize: "12px" }}>{percentage}٪</span>
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 700,
                              color: tier.colorHex,
                              backgroundColor: `${tier.colorHex}18`,
                              padding: "1px 6px",
                              borderRadius: "4px",
                            }}
                          >
                            {tier.labelFa}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Weekly Study Hours */}
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <input
                        type="number"
                        min="0"
                        max="80"
                        value={student.weeklyStudyHours}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          handleUpdateStudent(student.studentId, { weeklyStudyHours: isNaN(val) ? 0 : val });
                        }}
                        style={{
                          width: "55px",
                          padding: "4px 6px",
                          textAlign: "center",
                          borderRadius: "6px",
                          border: "1px solid #e2e8f0",
                          fontSize: "12px",
                        }}
                      />
                      <span style={{ fontSize: "10px", color: "#64748b", marginInlineStart: "3px" }}>ساعت</span>
                    </td>

                    {/* SIDA Continuous 1 */}
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="20"
                        value={student.continuous1}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          handleUpdateStudent(student.studentId, { continuous1: isNaN(val) ? 0 : val });
                        }}
                        style={{ width: "55px", padding: "4px", textAlign: "center", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                      />
                    </td>

                    {/* SIDA Final 1 */}
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="20"
                        value={student.final1}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          handleUpdateStudent(student.studentId, { final1: isNaN(val) ? 0 : val });
                        }}
                        style={{ width: "55px", padding: "4px", textAlign: "center", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                      />
                    </td>

                    {/* SIDA Continuous 2 */}
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="20"
                        value={student.continuous2}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          handleUpdateStudent(student.studentId, { continuous2: isNaN(val) ? 0 : val });
                        }}
                        style={{ width: "55px", padding: "4px", textAlign: "center", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                      />
                    </td>

                    {/* SIDA Final 2 */}
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="20"
                        value={student.final2}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          handleUpdateStudent(student.studentId, { final2: isNaN(val) ? 0 : val });
                        }}
                        style={{ width: "55px", padding: "4px", textAlign: "center", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                      />
                    </td>

                    {/* SIDA Calculated Annual Grade */}
                    <td style={{ padding: "8px", textAlign: "center", backgroundColor: "#f8fafc" }}>
                      <strong
                        style={{
                          fontSize: "13px",
                          color: student.annualScore >= 10 ? "#15803d" : "#b91c1c",
                        }}
                      >
                        {student.annualScore}
                      </strong>
                    </td>

                    {/* Conduct */}
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <select
                        value={student.conduct}
                        onChange={(e) =>
                          handleUpdateStudent(student.studentId, {
                            conduct: e.target.value as SidaStudentRecord["conduct"],
                          })
                        }
                        style={{ padding: "3px 6px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "11px" }}
                      >
                        <option value="عالی">عالی</option>
                        <option value="خیلی خوب">خیلی خوب</option>
                        <option value="خوب">خوب</option>
                        <option value="نیاز به تلاش">نیاز به تلاش</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={11} style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>
                  دانش‌آموزی مطابق فیلتر یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

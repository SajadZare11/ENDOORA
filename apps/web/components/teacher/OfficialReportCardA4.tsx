"use client";

import React, { useState } from "react";
import { SidaStudentRecord, SidaGradebookState } from "../../lib/teacher-sida-gradebook";

interface OfficialReportCardA4Props {
  gradebook: SidaGradebookState;
  classTitle: string;
  teacherName?: string;
  onClose?: () => void;
}

export function OfficialReportCardA4({
  gradebook,
  classTitle,
  teacherName = "دبیر مربوطه",
  onClose,
}: OfficialReportCardA4Props) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>("all");
  const currentDate = new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(new Date());

  const studentsToPrint =
    selectedStudentId === "all"
      ? gradebook.students
      : gradebook.students.filter((s) => s.studentId === selectedStudentId);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div style={{ direction: "rtl", width: "100%", maxWidth: "1000px", margin: "0 auto" }}>
      {/* Controls Bar - Hidden during window.print() */}
      <div
        className="no-print"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "var(--color-bg-surface, #ffffff)",
          padding: "14px 20px",
          borderRadius: "12px",
          border: "1px solid var(--color-border-subtle, #e2e8f0)",
          marginBottom: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontWeight: 700, fontSize: "14px" }}>حالت نمایش چاپ:</span>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid var(--color-border-subtle, #cbd5e1)",
              fontSize: "13px",
              backgroundColor: "var(--color-bg-surface, #ffffff)",
            }}
          >
            <option value="all">شیت نمرات تجمیعی رسمی کل کلاس (لیست سیدا)</option>
            {gradebook.students.map((s) => (
              <option key={s.studentId} value={s.studentId}>
                کارنامه انفرادی: {s.name} ({s.nationalCode})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid var(--color-border-subtle, #cbd5e1)",
                backgroundColor: "transparent",
                fontSize: "13px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              بازگشت به دفتر نمرات
            </button>
          )}
          <button
            type="button"
            onClick={handlePrint}
            style={{
              padding: "8px 22px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "var(--color-primary-600, #2563eb)",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(37,99,235,0.3)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            🖨️ چاپ استاندارد A4 (Print)
          </button>
        </div>
      </div>

      {/* Printable Sheet Area */}
      <div
        className="a4-print-sheet"
        style={{
          backgroundColor: "#ffffff",
          color: "#0f172a",
          padding: "36px 40px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          fontFamily: "IRANSansX, Vazirmatn, Tahoma, sans-serif",
          minHeight: "297mm",
          boxSizing: "border-box",
        }}
      >
        {/* Official Header */}
        <div
          style={{
            borderBottom: "2px solid #0f172a",
            paddingBottom: "16px",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "right", flex: 1 }}>
            <div style={{ fontSize: "12px", color: "#64748b" }}>جمهوری اسلامی ایران</div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>وزارت آموزش و پرورش</div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>سامانه یکپارچه دانش‌آموزی (سیدا)</div>
          </div>

          <div style={{ textAlign: "center", flex: 2 }}>
            <h2 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 800 }}>
              {selectedStudentId === "all" ? "ریز نمرات رسمی و ارزیابی تحصیلی کلاسی" : "کارنامه رسمی تحصیلی انفرادی"}
            </h2>
            <div style={{ fontSize: "13px", color: "#334155", fontWeight: 600 }}>
              کلاس: {classTitle} | سال تحصیلی ۱۴۰۵-۱۴۰۶
            </div>
          </div>

          <div style={{ textAlign: "left", flex: 1, fontSize: "11px", color: "#64748b" }}>
            <div>تاریخ صدور: {currentDate}</div>
            <div>نام دبیر: {teacherName}</div>
            <div>نوبت ارزیابی: سالانه رسمی</div>
          </div>
        </div>

        {/* If single student mode, show Student Identification Card */}
        {selectedStudentId !== "all" && studentsToPrint.length === 1 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "12px",
              backgroundColor: "#f8fafc",
              padding: "12px 16px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              fontSize: "12px",
              marginBottom: "20px",
            }}
          >
            <div>
              نام و نام خانوادگی: <strong>{studentsToPrint[0].name}</strong>
            </div>
            <div>
              کد ملی: <strong>{studentsToPrint[0].nationalCode}</strong>
            </div>
            <div>
              کد دانش‌آموزی: <strong>{studentsToPrint[0].studentId}</strong>
            </div>
            <div>
              نمره انضباط: <strong>{studentsToPrint[0].conduct}</strong>
            </div>
          </div>
        )}

        {/* Official SIDA Grades Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "12px",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f1f5f9", border: "1px solid #94a3b8" }}>
              <th style={{ padding: "10px 8px", border: "1px solid #94a3b8", width: "40px" }}>ردیف</th>
              <th style={{ padding: "10px 8px", border: "1px solid #94a3b8", textAlign: "right" }}>نام و نام خانوادگی</th>
              <th style={{ padding: "10px 8px", border: "1px solid #94a3b8", width: "90px" }}>کد ملی</th>
              <th style={{ padding: "10px 8px", border: "1px solid #94a3b8", width: "85px" }}>مستمر اول (ض ۱)</th>
              <th style={{ padding: "10px 8px", border: "1px solid #94a3b8", width: "85px" }}>پایانی اول (ض ۲)</th>
              <th style={{ padding: "10px 8px", border: "1px solid #94a3b8", width: "85px" }}>مستمر دوم (ض ۱)</th>
              <th style={{ padding: "10px 8px", border: "1px solid #94a3b8", width: "85px" }}>
                پایانی دوم (ض {gradebook.sidaMultiplier})
              </th>
              <th style={{ padding: "10px 8px", border: "1px solid #94a3b8", width: "95px", backgroundColor: "#e2e8f0" }}>
                نمره سالانه
              </th>
              <th style={{ padding: "10px 8px", border: "1px solid #94a3b8", width: "80px" }}>انضباط</th>
              <th style={{ padding: "10px 8px", border: "1px solid #94a3b8", width: "90px" }}>نتیجه نهایی</th>
            </tr>
          </thead>
          <tbody>
            {studentsToPrint.map((s, idx) => {
              const passed = s.annualScore >= 10;
              return (
                <tr key={s.studentId} style={{ borderBottom: "1px solid #cbd5e1" }}>
                  <td style={{ padding: "8px", border: "1px solid #cbd5e1" }}>{idx + 1}</td>
                  <td style={{ padding: "8px", border: "1px solid #cbd5e1", textAlign: "right", fontWeight: 600 }}>
                    {s.name}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #cbd5e1", fontFamily: "monospace" }}>
                    {s.nationalCode}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #cbd5e1" }}>{s.continuous1}</td>
                  <td style={{ padding: "8px", border: "1px solid #cbd5e1" }}>{s.final1}</td>
                  <td style={{ padding: "8px", border: "1px solid #cbd5e1" }}>{s.continuous2}</td>
                  <td style={{ padding: "8px", border: "1px solid #cbd5e1" }}>{s.final2}</td>
                  <td style={{ padding: "8px", border: "1px solid #cbd5e1", fontWeight: 800, backgroundColor: "#f8fafc" }}>
                    {s.annualScore}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #cbd5e1" }}>{s.conduct}</td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #cbd5e1",
                      fontWeight: 700,
                      color: passed ? "#15803d" : "#b91c1c",
                    }}
                  >
                    {passed ? "قبول" : "تجدید"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Official Signatures & Seal Section */}
        <div
          style={{
            marginTop: "60px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            textAlign: "center",
            fontSize: "12px",
            pageBreakInside: "avoid",
          }}
        >
          <div style={{ height: "100px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 600 }}>امضای دبیر مربوطه</span>
            <span style={{ color: "#94a3b8", fontSize: "11px" }}>..................................</span>
          </div>
          <div style={{ height: "100px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 600 }}>مهر و امضای مدیر واحد آموزشی</span>
            <div
              style={{
                width: "70px",
                height: "70px",
                border: "2px dashed #94a3b8",
                borderRadius: "50%",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
                fontSize: "10px",
              }}
            >
              محل مهر
            </div>
          </div>
          <div style={{ height: "100px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 600 }}>رویت و امضای ولی دانش‌آموز</span>
            <span style={{ color: "#94a3b8", fontSize: "11px" }}>..................................</span>
          </div>
        </div>
      </div>
    </div>
  );
}

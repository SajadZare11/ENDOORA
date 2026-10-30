"use client";

import React, { useState } from "react";
import { SidaStudentRecord } from "../../lib/teacher-sida-gradebook";
import { StudentStandardizedScore } from "../../lib/psychometrics";

export interface TriageModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: SidaStudentRecord;
  stats: StudentStandardizedScore;
  mode: "remediation" | "counselor";
  onConfirmSuccess: (message: string) => void;
}

export function TriageActionModal({
  isOpen,
  onClose,
  student,
  stats,
  mode,
  onConfirmSuccess,
}: TriageModalProps) {
  const isRemediation = mode === "remediation";

  const defaultMessage = isRemediation
    ? `با توجه به قرارگیری نمره ${stats.rawScore} (${stats.percentage}٪) در محدوده هشدار زودهنگام (Z-Score: ${stats.zScore})، پکیج تمرینات تطبیقی جبرانی شامل ۳ کوییز تقویتی و مرور واژگان کلیدی برای شما تعریف شد.`
    : `گزارش تریاژ آموزشی دانش‌آموز ${student.name} جهت بررسی تخصصی مشاوره: نمره آزمون ${stats.rawScore} (تراز: ${stats.taraz}، رتبه صدکی: ${stats.percentileRank}٪). ساعت مطالعه هفتگی ${student.weeklyStudyHours} ساعت است که نشان‌دهنده نیاز به بازتنظیم ساعات مطالعه یا برطرف کردن موانع انگیزشی/تمرکزی می‌باشد.`;

  const [message, setMessage] = useState(defaultMessage);
  const [selectedTopic, setSelectedTopic] = useState(
    isRemediation ? "تمرینات تعاملی واژگان و درک مطلب سطح پایه" : "مشاوره انگیزش تحصیلی و برنامه‌ریزی هفتگی"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmSuccess(
        isRemediation
          ? `تکلیف جبرانی تطبیقی با موفقیت برای «${student.name}» صادر و ثبت شد.`
          : `ارجاع آماری پرونده «${student.name}» به مشاور مدرسه با موفقیت ارسال شد.`
      );
      onClose();
    }, 600);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
        direction: "rtl",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--color-bg-surface, #ffffff)",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "560px",
          padding: "24px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid var(--color-border-subtle, #e2e8f0)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "var(--color-text-primary, #0f172a)" }}>
              {isRemediation ? "🎯 صدور تکلیف جبرانی تطبیقی" : "🩺 ارجاع آماری به مشاور مدرسه"}
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--color-text-secondary, #64748b)" }}>
              دانش‌آموز: <strong>{student.name}</strong> ({student.email})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: "var(--color-text-secondary, #64748b)",
            }}
          >
            ✕
          </button>
        </div>

        {/* Quick Diagnostic Card */}
        <div
          style={{
            backgroundColor: "var(--color-bg-muted, #f8fafc)",
            borderRadius: "10px",
            padding: "12px 14px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px",
            fontSize: "12px",
            border: "1px solid var(--color-border-subtle, #e2e8f0)",
          }}
        >
          <div>
            <span style={{ color: "var(--color-text-secondary, #64748b)" }}>نمره کسب‌شده: </span>
            <strong style={{ color: "#ef4444" }}>{stats.rawScore}</strong> ({stats.percentage}٪)
          </div>
          <div>
            <span style={{ color: "var(--color-text-secondary, #64748b)" }}>نمره استاندارد Z: </span>
            <strong style={{ color: "#ef4444" }}>{stats.zScore}</strong>
          </div>
          <div>
            <span style={{ color: "var(--color-text-secondary, #64748b)" }}>ساعت مطالعه: </span>
            <strong>{student.weeklyStudyHours} ساعت/هفته</strong>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>
              {isRemediation ? "انتخاب ماژول جبرانی تطبیقی:" : "محور ارجاع مشاوره‌ای:"}
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--color-border-subtle, #cbd5e1)",
                fontSize: "13px",
                backgroundColor: "var(--color-bg-surface, #ffffff)",
              }}
            >
              {isRemediation ? (
                <>
                  <option value="تمرینات تعاملی واژگان و درک مطلب سطح پایه">
                    تمرینات تعاملی واژگان و درک مطلب سطح پایه (کوتاه‌مدت)
                  </option>
                  <option value="بسته تدریس مجدد گرامر و ساختار جمله همراه با آزمونک">
                    بسته تدریس مجدد گرامر و ساختار جمله همراه با آزمونک
                  </option>
                  <option value="پروژه تقویت مهارت شنیداری و تلفظ کاربردی">
                    پروژه تقویت مهارت شنیداری و تلفظ کاربردی
                  </option>
                </>
              ) : (
                <>
                  <option value="مشاوره انگیزش تحصیلی و برنامه‌ریزی هفتگی">
                    مشاوره انگیزش تحصیلی و برنامه‌ریزی هفتگی
                  </option>
                  <option value="بررسی علل افت تحصیلی ناگهانی و داده‌های پرت">
                    بررسی علل افت تحصیلی ناگهانی و داده‌های پرت
                  </option>
                  <option value="هم‌اندیشی با اولیا جهت رفع اضطراب امتحان">
                    هم‌اندیشی با اولیا جهت رفع اضطراب امتحان
                  </option>
                </>
              )}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>
              متن توضیحات و بازخورد اختصاصی:
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid var(--color-border-subtle, #cbd5e1)",
                fontSize: "12px",
                lineHeight: 1.6,
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
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
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: isRemediation
                  ? "var(--color-primary-600, #2563eb)"
                  : "var(--color-warning-600, #d97706)",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 700,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {isSubmitting ? "در حال ثبت..." : isRemediation ? "ثبت و ارسال تکلیف جبرانی" : "ثبت و ارجاع به مشاور"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

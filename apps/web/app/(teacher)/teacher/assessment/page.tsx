"use client";

import React from "react";
import Link from "next/link";
import { WritingFeedbackStudio } from "@/components/teacher/WritingFeedbackStudio";
import { useTeacherHome } from "@/components/teacher/TeacherShell";

export default function AssessmentFeedbackPage() {
  const { locale } = useTeacherHome();
  const isFa = locale === "fa";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {/* Informational Redirect Banner */}
      <div
        style={{
          background: "rgba(59, 130, 246, 0.08)",
          border: "1px solid rgba(59, 130, 246, 0.25)",
          borderRadius: "var(--radius-card)",
          padding: "12px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          fontSize: "0.88rem",
        }}
      >
        <span style={{ color: "var(--color-endoora-blue)" }}>
          {isFa
            ? "💡 استودیوی تحلیل تکالیف و بازخورد ۳ ستونه اکنون در منوی «کلاس‌های من > تب تحلیل و بازخورد» نیز ادغام شده است."
            : "💡 Writing Diagnostics & 3-Column Feedback Studio is also available inside 'My Classes > Feedback tab'."}
        </span>
        <Link
          href="/teacher/classes?tab=feedback"
          style={{
            color: "var(--color-endoora-blue)",
            fontWeight: 700,
            textDecoration: "underline",
          }}
        >
          {isFa ? "رفتن به کلاس‌های من ←" : "Go to My Classes →"}
        </Link>
      </div>

      <WritingFeedbackStudio />
    </div>
  );
}

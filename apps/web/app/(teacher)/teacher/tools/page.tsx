"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTeacherHome } from "@/components/teacher/TeacherShell";
import { ProgressReportCardStudio } from "@/components/teacher/ProgressReportCardStudio";

export default function TeacherToolsPage() {
  const router = useRouter();
  const { locale, activeClass, classesList } = useTeacherHome();
  const isFa = locale === "fa";

  useEffect(() => {
    router.replace("/teacher/classes?tab=report");
  }, [router]);

  return (
    <div style={{ padding: "var(--space-6)" }} dir={isFa ? "rtl" : "ltr"}>
      <div style={{ marginBlockEnd: "var(--space-4)" }}>
        <p style={{ color: "var(--color-muted)", fontSize: "0.88rem" }}>
          {isFa
            ? "این بخش به قسمت «کلاس‌های من» منتقل گردیده است. در حال هدایت..."
            : "This section has been moved to 'My Classes'. Redirecting..."}
        </p>
        <Link
          href="/teacher/classes?tab=report"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#0284c7",
            fontWeight: 700,
            textDecoration: "underline",
          }}
        >
          {isFa ? "مشاهده کارنامه جامع در بخش کلاس‌های من ←" : "Go to Progress Report in My Classes →"}
        </Link>
      </div>

      <ProgressReportCardStudio
        initialClassId={activeClass?.id}
        classes={classesList as any}
        locale={locale as any}
      />
    </div>
  );
}

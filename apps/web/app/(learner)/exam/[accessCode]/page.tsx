"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import styles from "@/components/exam/exam.module.css";
import { Button } from "@endoora/ui";
import { getExamByAccessCode, startExamSubmission, type StudentExamView } from "@/lib/online-exams";

export default function ExamLobbyPage({ params }: { params: Promise<{ accessCode: string }> }) {
  const resolvedParams = use(params);
  const accessCode = resolvedParams.accessCode;
  const router = useRouter();

  const [exam, setExam] = useState<StudentExamView | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getExamByAccessCode(accessCode);
        setExam(data);
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : "آزمون مورد نظر یافت نشد یا مهلت آن پایان یافته است.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [accessCode]);

  const handleStartExam = async () => {
    if (!exam) return;
    try {
      setStarting(true);
      // Start submission attempt on backend
      const submission = await startExamSubmission(exam.id);

      // Save submissionId in sessionStorage for the runner
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(`exam_sub_${exam.id}`, submission.id);
      }

      // Enter fullscreen if required
      if (exam.anti_cheat_config?.enforce_fullscreen && typeof document !== "undefined") {
        try {
          await document.documentElement.requestFullscreen();
        } catch {
          // Continue if browser rejects
        }
      }

      // Navigate to exam runner
      router.push(`/exam/${accessCode}/take`);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "خطا در شروع آزمون. مجدداً تلاش کنید.");
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.examContainer} style={{ textAlign: "center", padding: "5rem" }}>
        در حال آماده‌سازی و بارگیری آزمون...
      </div>
    );
  }

  if (errorMsg || !exam) {
    return (
      <div className={styles.examContainer}>
        <div style={{ background: "#fef2f2", color: "#b91c1c", padding: "2rem", borderRadius: "1rem", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>⚠️</div>
          <h2 style={{ margin: "0 0 0.5rem 0" }}>عدم دسترسی به آزمون</h2>
          <p>{errorMsg || "آزمون در دسترس نیست."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.examContainer} dir="rtl">
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "1.25rem",
          padding: "2.5rem",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
          maxWidth: "680px",
          margin: "2rem auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span style={{ fontSize: "3rem" }}>📝</span>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", margin: "0.5rem 0 0.25rem 0" }}>
            {exam.title}
          </h1>
          <p style={{ color: "#64748b", margin: 0 }}>
            مدت زمان آزمون: {exam.duration_minutes} دقیقه | تعداد سوالات: {exam.questions?.length || 0}
          </p>
        </div>

        {/* Instructions */}
        {exam.instructions && (
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "0.75rem",
              padding: "1.25rem",
              marginBottom: "1.5rem",
            }}
          >
            <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9375rem", fontWeight: 700, color: "#1e293b" }}>
              دستورالعمل آزمون:
            </h3>
            <p style={{ margin: 0, fontSize: "0.875rem", lineHeight: 1.7, color: "#475569" }}>
              {exam.instructions}
            </p>
          </div>
        )}

        {/* Anti-Cheat Rules Notice */}
        <div
          style={{
            background: "#fffbeb",
            border: "1.5px solid #fde68a",
            borderRadius: "0.75rem",
            padding: "1.25rem",
            marginBottom: "2rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span>🛡️</span>
            <strong style={{ color: "#92400e", fontSize: "0.9375rem" }}>
              قوانین سامانه ضد تقلب و مانیتورینگ آنلاین:
            </strong>
          </div>
          <ul style={{ margin: 0, paddingRight: "1.5rem", fontSize: "0.8125rem", lineHeight: 1.8, color: "#78350f" }}>
            {exam.anti_cheat_config?.enforce_fullscreen && (
              <li>آزمون در حالت تمام‌صفحه (Fullscreen) برگزار می‌شود و خروج از آن تخلف محسوب می‌گردد.</li>
            )}
            {exam.anti_cheat_config?.block_clipboard && (
              <li>کپی و پیست کردن متن در سراسر محیط آزمون غیرفعال است.</li>
            )}
            <li>خروج از پنجره یا تغییر تب مرورگر در سیستم ثبت شده و نمره اصالت شما را کاهش می‌دهد.</li>
            {exam.anti_cheat_config?.auto_submit_on_violation && (
              <li>در صورت تکرار بیش از حد تخلفات، آزمون به‌صورت خودکار ارسال و نهایی خواهد شد.</li>
            )}
          </ul>
        </div>

        {/* Action Button */}
        <Button
          type="button"
          onClick={handleStartExam}
          disabled={starting}
          style={{
            width: "100%",
            padding: "1rem",
            background: "#4f46e5",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: "1.125rem",
            borderRadius: "0.75rem",
          }}
        >
          {starting ? "در حال ورود به آزمون..." : "ورود به آزمون و شروع زمان ⏱️"}
        </Button>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import styles from "../online-exams.module.css";
import { Button } from "@endoora/ui";
import { useTeacherHome } from "@/components/teacher/TeacherShell";
import { IntegrityBadge } from "@/components/exam/IntegrityBadge";
import {
  getTeacherExam,
  listExamSubmissions,
  publishOnlineExam,
  closeOnlineExam,
  removeQuestionFromExam,
  type OnlineExamDetail,
  type ExamSubmissionListItem,
} from "@/lib/online-exams";

export default function TeacherExamDetailPage({ params }: { params: Promise<{ examId: string }> }) {
  const resolvedParams = use(params);
  const examId = resolvedParams.examId;

  const { locale } = useTeacherHome();
  const isFa = locale === "fa";

  const [exam, setExam] = useState<OnlineExamDetail | null>(null);
  const [submissions, setSubmissions] = useState<ExamSubmissionListItem[]>([]);
  const [activeTab, setActiveTab] = useState<"questions" | "submissions" | "settings">("questions");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [examData, subsData] = await Promise.all([
          getTeacherExam(examId),
          listExamSubmissions(examId).catch(() => []),
        ]);
        setExam(examData);
        setSubmissions(subsData);
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : "خطا در دریافت اطلاعات آزمون.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [examId]);

  const handlePublish = async () => {
    try {
      await publishOnlineExam(examId);
      if (exam) setExam({ ...exam, status: "published" });
    } catch {
      alert("خطا در انتشار آزمون");
    }
  };

  const handleClose = async () => {
    try {
      await closeOnlineExam(examId);
      if (exam) setExam({ ...exam, status: "closed" });
    } catch {
      alert("خطا در بستن آزمون");
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (!confirm("آیا از حذف این سوال از آزمون اطمینان دارید؟")) return;
    try {
      await removeQuestionFromExam(examId, qId);
      if (exam) {
        setExam({
          ...exam,
          exam_questions: exam.exam_questions.filter((q) => q.id !== qId),
        });
      }
    } catch {
      alert("خطا در حذف سوال");
    }
  };

  if (loading) {
    return (
      <div className={styles.container} style={{ textAlign: "center", padding: "4rem" }}>
        در حال بارگیری مشخصات آزمون...
      </div>
    );
  }

  if (errorMsg || !exam) {
    return (
      <div className={styles.container}>
        <div style={{ background: "#fef2f2", color: "#b91c1c", padding: "1.5rem", borderRadius: "1rem" }}>
          ⚠️ {errorMsg || "آزمون مورد نظر یافت نشد."}
          <div style={{ marginTop: "1rem" }}>
            <Link href="/teacher/online-exams">
              <Button type="button">بازگشت به فهرست آزمون‌ها</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shareableUrl = typeof window !== "undefined"
    ? `${window.location.origin}/exam/${exam.access_code}`
    : `/exam/${exam.access_code}`;

  return (
    <div className={styles.container} dir={isFa ? "rtl" : "ltr"}>
      {/* Top Breadcrumb */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <Link href="/teacher/online-exams" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.875rem" }}>
          ← بازگشت به آزمون‌ها
        </Link>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link href={`/teacher/online-exams/${examId}/analytics`}>
            <Button type="button" style={{ background: "#6366f1", color: "#ffffff", fontWeight: 600 }}>
              📊 آمار و تحلیلهای کلاس
            </Button>
          </Link>
        </div>
      </div>

      {/* Exam Header */}
      <header className={styles.header}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <h1 className={styles.title} style={{ margin: 0 }}>
              {exam.title}
            </h1>
            <span
              className={`${styles.statusBadge} ${
                exam.status === "published"
                  ? styles.statusPublished
                  : exam.status === "closed"
                    ? styles.statusClosed
                    : styles.statusDraft
              }`}
            >
              {exam.status === "published" ? "منتشر شده" : exam.status === "closed" ? "بسته شده" : "پیش‌نویس"}
            </span>
          </div>
          <p className={styles.subtitle}>
            مدت: {exam.duration_minutes} دقیقه | نمره قبولی: {exam.passing_score}٪ | تعداد سوالات:{" "}
            {exam.exam_questions?.length || 0}
          </p>
        </div>

        <div className={styles.actions}>
          {exam.status === "draft" && (
            <Button
              type="button"
              onClick={handlePublish}
              style={{ background: "#059669", color: "#ffffff", fontWeight: 700 }}
            >
              انتشار عمومی آزمون 🚀
            </Button>
          )}

          {exam.status === "published" && (
            <Button
              type="button"
              onClick={handleClose}
              style={{ background: "#dc2626", color: "#ffffff", fontWeight: 700 }}
            >
              بستن آزمون 🛑
            </Button>
          )}
        </div>
      </header>

      {/* Access Code Pill */}
      {exam.access_code && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#eff6ff",
            border: "1.5px solid #bfdbfe",
            padding: "0.75rem 1.25rem",
            borderRadius: "0.75rem",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <div>
            <span style={{ fontWeight: 700, color: "#1e40af" }}>کد دسترسی زبان‌آموزان: </span>
            <code style={{ fontSize: "1.125rem", fontWeight: 800, color: "#1d4ed8", marginRight: "0.5rem" }}>
              {exam.access_code}
            </code>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>لینک مستقیم:</span>
            <input
              type="text"
              readOnly
              value={shareableUrl}
              style={{
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "0.375rem",
                padding: "0.25rem 0.5rem",
                fontSize: "0.8125rem",
                width: "240px",
              }}
              dir="ltr"
            />
            <Button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(shareableUrl);
                alert("لینک آزمون در کلیپ‌بورد کپی شد.");
              }}
              style={{ padding: "0.25rem 0.65rem", fontSize: "0.8125rem" }}
            >
              کپی لینک
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className={styles.tabNav}>
        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === "questions" ? styles.tabItemActive : ""}`}
          onClick={() => setActiveTab("questions")}
        >
          سوالات آزمون ({exam.exam_questions?.length || 0})
        </button>
        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === "submissions" ? styles.tabItemActive : ""}`}
          onClick={() => setActiveTab("submissions")}
        >
          پاسخ‌نامه‌ها و نتایج ({submissions.length})
        </button>
        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === "settings" ? styles.tabItemActive : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          تنظیمات ضد تقلب و قوانین
        </button>
      </div>

      {/* Tab: Questions */}
      {activeTab === "questions" && (
        <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h3 style={{ margin: 0, fontWeight: 700 }}>آیتم‌های آزمون</h3>
          </div>

          {exam.exam_questions?.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
              هنوز سوالی به این آزمون اضافه نشده است.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {exam.exam_questions.map((q, idx) => (
                <div
                  key={q.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem 1.25rem",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.75rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{ fontWeight: 800, fontSize: "1.125rem", width: "24px", color: "#475569" }}>
                      {idx + 1}.
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9375rem" }}>
                        {q.question_title_fa || q.question_title_en || q.question_slug || "سوال آزمون"}
                      </div>
                      <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>
                        {q.prompt_fa || q.prompt_en || q.custom_instructions}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{ fontSize: "0.8125rem", background: "#e0e7ff", color: "#4338ca", padding: "0.25rem 0.5rem", borderRadius: "0.25rem", fontWeight: 700 }}>
                      {q.question_type || "mcq"}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>
                      {q.points} نمره
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(q.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                      }}
                      title="حذف سوال از آزمون"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Submissions */}
      {activeTab === "submissions" && (
        <div className={styles.tableCard}>
          {submissions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
              هنوز پاسخی برای این آزمون ثبت نشده است.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "1rem 1.25rem", fontSize: "0.8125rem", color: "#475569" }}>زبان‌آموز</th>
                  <th style={{ padding: "1rem", fontSize: "0.8125rem", color: "#475569" }}>وضعیت</th>
                  <th style={{ padding: "1rem", fontSize: "0.8125rem", color: "#475569" }}>نمره کسب‌شده</th>
                  <th style={{ padding: "1rem", fontSize: "0.8125rem", color: "#475569" }}>درصد</th>
                  <th style={{ padding: "1rem", fontSize: "0.8125rem", color: "#475569" }}>نمره اصالت (Anti-Cheat)</th>
                  <th style={{ padding: "1rem", fontSize: "0.8125rem", color: "#475569" }}>زمان ارسال</th>
                  <th style={{ padding: "1rem 1.25rem", fontSize: "0.8125rem", color: "#475569", textAlign: "center" }}>تصحیح و جزئیات</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "1rem 1.25rem", fontWeight: 700 }}>
                      {sub.student.name || sub.student.email}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span className={`${styles.statusBadge} ${sub.status === "in_progress" ? styles.statusDraft : styles.statusPublished}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", fontWeight: 700 }}>
                      {sub.total_score !== null ? sub.total_score : "—"}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      {sub.percentage !== null ? `${sub.percentage}٪` : "—"}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <IntegrityBadge score={sub.integrity_score ? Number(sub.integrity_score) : null} />
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.8125rem", color: "#64748b" }}>
                      {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString("fa-IR") : "در حال آزمون"}
                    </td>
                    <td style={{ padding: "1rem 1.25rem", textAlign: "center" }}>
                      <Link href={`/teacher/online-exams/${examId}/submissions/${sub.id}`}>
                        <Button type="button" style={{ padding: "0.35rem 0.75rem", fontSize: "0.8125rem" }}>
                          بررسی و تصحیح 🔍
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Tab: Settings */}
      {activeTab === "settings" && (
        <div className={styles.tableCard} style={{ padding: "2rem" }}>
          <h3 style={{ margin: "0 0 1.25rem 0", fontWeight: 700 }}>قوانین فعال ضد تقلب</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            <div style={{ padding: "1rem", background: "#f8fafc", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
              <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>تمام‌صفحه (Fullscreen):</div>
              <div style={{ color: exam.anti_cheat_config?.enforce_fullscreen ? "#059669" : "#64748b" }}>
                {exam.anti_cheat_config?.enforce_fullscreen ? "فعال (اجباری)" : "غیرفعال"}
              </div>
            </div>

            <div style={{ padding: "1rem", background: "#f8fafc", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
              <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>انسداد کپی/پیست:</div>
              <div style={{ color: exam.anti_cheat_config?.block_clipboard ? "#059669" : "#64748b" }}>
                {exam.anti_cheat_config?.block_clipboard ? "فعال" : "غیرفعال"}
              </div>
            </div>

            <div style={{ padding: "1rem", background: "#f8fafc", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
              <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>ارسال خودکار در تخلف:</div>
              <div style={{ color: exam.anti_cheat_config?.auto_submit_on_violation ? "#d97706" : "#64748b" }}>
                {exam.anti_cheat_config?.auto_submit_on_violation
                  ? `فعال (پس از ${exam.anti_cheat_config?.violation_threshold || 5} تخلف)`
                  : "غیرفعال"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

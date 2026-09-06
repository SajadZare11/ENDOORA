"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import styles from "../assignments.module.css";
import {
  AssignmentAttempt,
  AssignmentDetail,
  fetchTeacherAssignment,
  fetchAssignmentSubmissions,
  gradeAttempt,
} from "@/lib/teacher-assignments";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AssignmentDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const assignmentId = resolvedParams.id;

  const [assignment, setAssignment] = useState<AssignmentDetail | null>(null);
  const [submissions, setSubmissions] = useState<AssignmentAttempt[]>([]);
  const [activeTab, setActiveTab] = useState<"submissions" | "questions" | "accommodations">("submissions");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Grading modal state
  const [selectedAttempt, setSelectedAttempt] = useState<AssignmentAttempt | null>(null);
  const [gradeScore, setGradeScore] = useState<string>("");
  const [gradeFeedback, setGradeFeedback] = useState<string>("");
  const [submittingGrade, setSubmittingGrade] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [assignData, subsData] = await Promise.all([
          fetchTeacherAssignment(assignmentId),
          fetchAssignmentSubmissions(assignmentId),
        ]);
        if (!cancelled) {
          setAssignment(assignData);
          setSubmissions(subsData);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "خطا در دریافت جزئیات تکلیف.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [assignmentId]);

  const handleOpenGradeModal = (attempt: AssignmentAttempt) => {
    setSelectedAttempt(attempt);
    setGradeScore(attempt.score_awarded !== null ? String(attempt.score_awarded) : "");
    setGradeFeedback(attempt.teacher_feedback || "");
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAttempt) return;

    setSubmittingGrade(true);
    try {
      const updated = await gradeAttempt(selectedAttempt.id, {
        score_awarded: Number(gradeScore),
        teacher_feedback: gradeFeedback,
      });

      setSubmissions((prev) =>
        prev.map((att) => (att.id === updated.id ? updated : att))
      );
      setSelectedAttempt(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "خطا در ثبت نمره و بازخورد.");
    } finally {
      setSubmittingGrade(false);
    }
  };

  if (loading && !assignment) {
    return (
      <div className={styles.container}>
        <div className={styles.contentCard}>
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>در حال بارگذاری جزئیات تکلیف...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !assignment) {
    return (
      <div className={styles.container}>
        <div className={styles.errorBanner} role="alert">
          {error}
        </div>
        <Link href="/teacher/assignments" className={styles.secondaryButton}>
          ← بازگشت به لیست تکالیف
        </Link>
      </div>
    );
  }

  if (!assignment) return null;

  return (
    <div className={styles.container}>
      {/* Header Card */}
      <div className={styles.headerCard}>
        <nav className={styles.breadcrumbs} aria-label="مسیر راهنما">
          <Link href="/teacher" className={styles.breadcrumbLink}>
            خانه مدرس
          </Link>
          <span className={styles.breadcrumbSeparator}>←</span>
          <span className={styles.breadcrumbLink}>تدریس</span>
          <span className={styles.breadcrumbSeparator}>←</span>
          <Link href="/teacher/assignments" className={styles.breadcrumbLink}>
            تکالیف
          </Link>
          <span className={styles.breadcrumbSeparator}>←</span>
          <span className={styles.breadcrumbCurrent}>{assignment.title}</span>
        </nav>

        <div className={styles.headerTop}>
          <div className={styles.titleGroup}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <h1 className={styles.title}>{assignment.title}</h1>
              <span className={styles.cefrBadge}>{assignment.target_cefr}</span>
              <span
                className={`${styles.statusBadge} ${
                  assignment.status === "published"
                    ? styles.badgePublished
                    : assignment.status === "draft"
                    ? styles.badgeDraft
                    : styles.badgeClosed
                }`}
              >
                {assignment.status === "published"
                  ? "منتشر شده"
                  : assignment.status === "draft"
                  ? "پیش‌نویس"
                  : "پایان یافته"}
              </span>
            </div>
            <p className={styles.description}>
              کلاس: {assignment.teacher_class_title} | مدرس: {assignment.teacher_name}
            </p>
          </div>

          <div className={styles.headerActions}>
            <Link href="/teacher/assignments" className={styles.secondaryButton}>
              ← بازگشت به تکالیف
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>مجموع نمره و سوالات</span>
            <span className={styles.metricValue}>
              {Number(assignment.total_points)} نمره ({assignment.questions.length} سوال)
            </span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>پاسخ‌های ثبت شده</span>
            <span className={styles.metricValue}>{submissions.length}</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>مهلت تحویل</span>
            <span className={styles.metricValue} style={{ fontSize: "var(--font-size-body)", fontWeight: 700 }}>
              {assignment.due_date
                ? new Date(assignment.due_date).toLocaleString("fa-IR")
                : "تعیین نشده"}
            </span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>محدودیت زمان</span>
            <span className={styles.metricValue} style={{ fontSize: "var(--font-size-body)", fontWeight: 700 }}>
              {assignment.time_limit_minutes ? `${assignment.time_limit_minutes} دقیقه` : "بدون محدودیت"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area with Tabs */}
      <div className={styles.contentCard}>
        <div className={styles.tabBar} role="tablist">
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "submissions" ? styles.activeTabButton : ""}`}
            onClick={() => setActiveTab("submissions")}
          >
            پاسخ‌ها و تصحیح ({submissions.length})
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "questions" ? styles.activeTabButton : ""}`}
            onClick={() => setActiveTab("questions")}
          >
            سوالات پیوست ({assignment.questions.length})
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "accommodations" ? styles.activeTabButton : ""}`}
            onClick={() => setActiveTab("accommodations")}
          >
            تسهیلات آموزشی فردی ({assignment.accommodations.length})
          </button>
        </div>

        {/* Tab 1: Submissions */}
        {activeTab === "submissions" && (
          <div style={{ marginBlockStart: "var(--space-4)" }}>
            {submissions.length === 0 ? (
              <div className={styles.emptyState}>
                <h3 className={styles.emptyTitle}>هنوز پاسخی ثبت نشده است</h3>
                <p className={styles.emptyText}>
                  به محض این که زبان‌آموزان عضو کلاس در آزمون شرکت کنند، پاسخ‌ها و نمرات خودکار در این جدول نمایش داده خواهد شد.
                </p>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">زبان‌آموز</th>
                      <th scope="col">شماره تلاش</th>
                      <th scope="col">وضعیت</th>
                      <th scope="col">زمان ارسال</th>
                      <th scope="col">نمره کسب شده</th>
                      <th scope="col">درصد نهایی</th>
                      <th scope="col">تاخیر</th>
                      <th scope="col">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((att) => (
                      <tr key={att.id}>
                        <td>
                          <strong>{att.learner_name}</strong>
                          <div style={{ fontSize: "var(--font-size-caption)", color: "var(--color-muted)" }}>
                            {att.learner_email}
                          </div>
                        </td>
                        <td>تلاش #{att.attempt_number}</td>
                        <td>
                          <span
                            className={`${styles.statusBadge} ${
                              att.status === "graded"
                                ? styles.badgePublished
                                : att.status === "submitted"
                                ? styles.badgeDraft
                                : styles.badgeClosed
                            }`}
                          >
                            {att.status === "graded"
                              ? "تصحیح شده"
                              : att.status === "submitted"
                              ? "در انتظار بررسی"
                              : att.status === "in_progress"
                              ? "در حال انجام"
                              : "پایان مهلت"}
                          </span>
                        </td>
                        <td>
                          {att.submitted_at
                            ? new Date(att.submitted_at).toLocaleString("fa-IR", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </td>
                        <td>
                          <strong>{att.score_awarded !== null ? Number(att.score_awarded) : "-"}</strong> / {Number(assignment.total_points)}
                        </td>
                        <td>
                          {att.percentage !== null ? `${Math.round(Number(att.percentage))}%` : "-"}
                        </td>
                        <td>
                          {att.is_late ? (
                            <span style={{ color: "var(--color-feedback-error)", fontWeight: 600 }}>
                              با تاخیر
                            </span>
                          ) : (
                            <span style={{ color: "var(--color-learning-teal)" }}>به‌موقع</span>
                          )}
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleOpenGradeModal(att)}
                            className={styles.secondaryButton}
                            style={{ paddingBlock: "var(--space-1)", paddingInline: "var(--space-3)", fontSize: "var(--font-size-caption)" }}
                          >
                            ثبت بازخورد و نمره
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Questions */}
        {activeTab === "questions" && (
          <div style={{ marginBlockStart: "var(--space-4)" }}>
            <div className={styles.reorderList}>
              {assignment.questions.map((q) => (
                <div key={q.id} className={styles.reorderItem}>
                  <div className={styles.reorderMeta}>
                    <span className={styles.orderNumber}>{q.order}</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: "var(--font-size-body)" }}>
                        {q.prompt_fa || q.prompt_en}
                      </p>
                      <span style={{ fontSize: "var(--font-size-caption)", color: "var(--color-muted)" }}>
                        {q.title_fa || q.title_en} | نوع: {q.question_type} | سطح: {q.cefr_level}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span style={{ fontWeight: 700, color: "var(--color-endoora-blue)" }}>
                      {Number(q.points)} نمره
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Accommodations */}
        {activeTab === "accommodations" && (
          <div style={{ marginBlockStart: "var(--space-4)" }}>
            {assignment.accommodations.length === 0 ? (
              <div className={styles.emptyState}>
                <h3 className={styles.emptyTitle}>هیچ تسهیلات فردی ثبت نشده است</h3>
                <p className={styles.emptyText}>
                  تمام زبان‌آموزان این کلاس مطابق شرایط عمومی آزمون در آن شرکت می‌کنند.
                </p>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">زبان‌آموز</th>
                      <th scope="col">زمان اضافه</th>
                      <th scope="col">تلاش اضافه</th>
                      <th scope="col">ددلاین اختصاصی</th>
                      <th scope="col">یادداشت محرمانه</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignment.accommodations.map((acc) => (
                      <tr key={acc.id}>
                        <td>
                          <strong>{acc.learner_name}</strong>
                          <div style={{ fontSize: "var(--font-size-caption)", color: "var(--color-muted)" }}>
                            {acc.learner_email}
                          </div>
                        </td>
                        <td>+{acc.extra_time_minutes} دقیقه</td>
                        <td>+{acc.extra_attempts} تلاش</td>
                        <td>
                          {acc.extended_due_date
                            ? new Date(acc.extended_due_date).toLocaleString("fa-IR")
                            : "مطابق ددلاین عمومی"}
                        </td>
                        <td>{acc.notes || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grade & Feedback Modal */}
      {selectedAttempt && (
        <div className={styles.modalOverlay} onClick={() => setSelectedAttempt(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                ثبت بازخورد و تنظیم نمره ({selectedAttempt.learner_name})
              </h2>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setSelectedAttempt(null)}
                aria-label="بستن پنجره"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="gradeScoreInput" className={styles.label}>
                  نمره نهایی (از {Number(assignment.total_points)}) *
                </label>
                <input
                  id="gradeScoreInput"
                  type="number"
                  step="0.25"
                  min="0"
                  max={Number(assignment.total_points)}
                  className={styles.input}
                  value={gradeScore}
                  onChange={(e) => setGradeScore(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="gradeFeedbackInput" className={styles.label}>
                  بازخورد کیفی و توصیه‌های آموزشی برای زبان‌آموز
                </label>
                <textarea
                  id="gradeFeedbackInput"
                  className={styles.textarea}
                  placeholder="نکات قوت، اشکالات گرامری و پیشنهادهای بهبود عملکرد..."
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                />
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => setSelectedAttempt(null)}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={submittingGrade || !gradeScore}
                >
                  {submittingGrade ? "در حال ثبت..." : "ثبت نمره و بازخورد ✓"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

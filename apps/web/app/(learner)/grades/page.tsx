"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./grades.module.css";
import { fetchLearnerGradebook, type LearnerGradebookSummary } from "../../../lib/teacher-gradebook";

export default function LearnerMyGradesPage() {
  const [gradebook, setGradebook] = useState<LearnerGradebookSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setErrorMsg(null);
      try {
        const data = await fetchLearnerGradebook();
        setGradebook(data);
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : "Failed to load your grades.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  return (
    <div className={styles.container} dir="rtl">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>کارنامه و نمرات آموزشی من</h1>
          <p className={styles.subtitle}>
            خلاصه نمرات تکالیف، کارنامه‌های کلاسی، بازخوردهای کیفی مدرسین و خودبازتابی‌های ثبت‌شده.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <Link href="/assignments" className="teacher-button teacher-button--secondary">
            لیست تکالیف
          </Link>
          <Link href="/dashboard" className="teacher-button teacher-button--secondary">
            داشبورد زبان‌آموز
          </Link>
        </div>
      </header>

      {errorMsg && (
        <div style={{ padding: "var(--space-3)", background: "var(--color-danger-subtle)", color: "var(--color-danger-dark)", borderRadius: "var(--radius-sm)" }}>
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
          در حال بارگیری کارنامه تحصیلی...
        </div>
      ) : !gradebook ? (
        <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
          اطلاعات نمرات در دسترس نیست.
        </div>
      ) : (
        <>
          {/* Summary KPIs */}
          <div className={styles.summaryCards}>
            <div className={styles.summaryCard}>
              <span className={styles.cardLabel}>میانگین معدل کل (GPA)</span>
              <span className={styles.cardValue}>{gradebook.overall_gpa_percentage}%</span>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.cardLabel}>تکالیف تکمیل و تصحیح شده</span>
              <span className={styles.cardValue} style={{ color: "var(--color-success-600)" }}>
                {gradebook.completed_assignments}
              </span>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.cardLabel}>کل تکالیف ارائه‌شده</span>
              <span className={styles.cardValue} style={{ color: "var(--color-text-primary)" }}>
                {gradebook.total_assignments}
              </span>
            </div>
          </div>

          {/* Class Breakdown Sections */}
          {gradebook.classes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-8)", background: "var(--color-bg-surface)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-md)" }}>
              <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>
                شما هنوز در کلاسی با تکلیف منتشرشده عضو نیستید.
              </p>
            </div>
          ) : (
            gradebook.classes.map((cls) => (
              <section key={cls.class_id} className={styles.classSection}>
                <div className={styles.classHeader}>
                  <div>
                    <h2 className={styles.classTitle}>{cls.class_title}</h2>
                    <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                      مدرس: {cls.teacher_name} ({cls.teacher_email}) | سطح: {cls.class_level} - {cls.class_subject}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
                    <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
                      میانگین کلاس:
                    </span>
                    <strong style={{ fontSize: "var(--font-size-xl)", color: "var(--color-primary-600)" }}>
                      {cls.class_percentage}%
                    </strong>
                  </div>
                </div>

                {/* Assignments Table */}
                <table className={styles.assignmentsTable}>
                  <thead>
                    <tr>
                      <th>عنوان تکلیف</th>
                      <th>وضعیت</th>
                      <th>نمره کسب‌شده</th>
                      <th>درصد</th>
                      <th>بازخورد مدرس</th>
                      <th>عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cls.assignments.map((a) => (
                      <tr key={a.assignment_id}>
                        <td>
                          <strong>{a.title}</strong>
                          <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                            سطح {a.target_cefr} | {a.total_points} نمره
                          </div>
                        </td>
                        <td>
                          {a.status === "graded" ? (
                            <span style={{ padding: "0.125rem 0.5rem", borderRadius: "9999px", fontSize: "0.75rem", background: "var(--color-success-subtle)", color: "var(--color-success-dark)", fontWeight: 700 }}>
                              تصحیح شده
                            </span>
                          ) : a.status === "submitted" ? (
                            <span style={{ padding: "0.125rem 0.5rem", borderRadius: "9999px", fontSize: "0.75rem", background: "var(--color-warning-subtle)", color: "var(--color-warning-dark)", fontWeight: 700 }}>
                              در انتظار تصحیح
                            </span>
                          ) : a.status === "missing" ? (
                            <span style={{ padding: "0.125rem 0.5rem", borderRadius: "9999px", fontSize: "0.75rem", background: "var(--color-danger-subtle)", color: "var(--color-danger-dark)", fontWeight: 700 }}>
                              عدم ثبت / گذشته
                            </span>
                          ) : (
                            <span style={{ padding: "0.125rem 0.5rem", borderRadius: "9999px", fontSize: "0.75rem", background: "var(--color-bg-muted)", color: "var(--color-text-secondary)", fontWeight: 700 }}>
                              شروع نشده
                            </span>
                          )}
                        </td>
                        <td>
                          {a.score_awarded !== null ? (
                            <strong>{a.score_awarded} / {a.total_points}</strong>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>
                          {a.percentage !== null ? `${a.percentage}%` : "-"}
                        </td>
                        <td style={{ maxWidth: "250px", fontSize: "var(--font-size-xs)" }}>
                          {a.teacher_feedback_snippet || (
                            <span style={{ color: "var(--color-text-tertiary)" }}>بدون بازخورد متنی</span>
                          )}
                        </td>
                        <td>
                          <Link
                            href={`/assignments/${a.assignment_id}`}
                            style={{
                              display: "inline-flex",
                              padding: "0.25rem 0.75rem",
                              borderRadius: "var(--radius-sm)",
                              background: "var(--color-bg-muted)",
                              color: "var(--color-text-primary)",
                              textDecoration: "none",
                              fontSize: "var(--font-size-xs)",
                              fontWeight: 600,
                            }}
                          >
                            مشاهده و بازخورد
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            ))
          )}
        </>
      )}
    </div>
  );
}

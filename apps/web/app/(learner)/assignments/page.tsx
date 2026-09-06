"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./learner-assignments.module.css";
import { fetchLearnerAssignments, LearnerAssignmentItem } from "@/lib/teacher-assignments";

export default function LearnerAssignmentsPage() {
  const [assignments, setAssignments] = useState<LearnerAssignmentItem[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchLearnerAssignments();
        if (!cancelled) {
          setAssignments(data);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "خطا در دریافت تکالیف کلاسی.");
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
  }, []);

  const pendingList = assignments.filter((a) => {
    const hasAttemptsLeft = a.attempts_used < a.max_attempts;
    return (a.is_open && hasAttemptsLeft) || a.in_progress_attempt_id !== null;
  });

  const completedList = assignments.filter((a) => {
    const noAttemptsLeft = a.attempts_used >= a.max_attempts;
    return noAttemptsLeft || (!a.is_open && a.attempts_used > 0);
  });

  const displayList = activeTab === "pending" ? pendingList : completedList;

  return (
    <div className={styles.container}>
      {/* Header Card */}
      <div className={styles.headerCard}>
        <h1 className={styles.title}>تکالیف و ارزیابی‌های کلاسی من</h1>
        <p className={styles.description}>
          مشاهده، انجام و پیگیری تکالیف محول شده توسط مدرسین، زمان‌بندی ددلاین‌ها و بررسی کارنامه‌های خودکار.
        </p>

        {/* Tab Bar */}
        <div className={styles.tabBar} role="tablist">
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "pending" ? styles.activeTabButton : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            تکالیف پیش‌رو و فعال ({pendingList.length})
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "completed" ? styles.activeTabButton : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            تکمیل شده و نمرات ({completedList.length})
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={styles.contentCard}>
        {error && (
          <div style={{ color: "var(--color-feedback-error)", marginBlockEnd: "var(--space-4)" }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className={styles.emptyState}>
            <p style={{ color: "var(--color-muted)" }}>در حال بارگذاری تکالیف...</p>
          </div>
        ) : displayList.length === 0 ? (
          <div className={styles.emptyState}>
            <h3 style={{ fontSize: "var(--font-size-h3)", margin: 0 }}>
              {activeTab === "pending"
                ? "تکلیف فعالی در حال حاضر ندارید"
                : "هنوز تکلیفی را تکمیل نکرده‌اید"}
            </h3>
            <p style={{ color: "var(--color-muted)", marginBlockStart: "var(--space-2)" }}>
              {activeTab === "pending"
                ? "هر زمان مدرس شما تمرین یا آزمون جدیدی منتشر کند، در این قسمت نمایش داده خواهد شد."
                : "پس از ارسال پاسخ‌های آزمون، نمرات و بازخوردهای مدرس را در این بخش مشاهده خواهید کرد."}
            </p>
          </div>
        ) : (
          <div className={styles.assignmentsGrid}>
            {displayList.map((item) => {
              const attemptsLeft = item.max_attempts - item.attempts_used;
              const hasInProgress = !!item.in_progress_attempt_id;

              return (
                <div key={item.id} className={styles.assignmentCard}>
                  <div>
                    <div className={styles.cardHeader}>
                      <span className={styles.classBadge}>
                        {item.class_title} ({item.teacher_name})
                      </span>
                      <span
                        style={{
                          fontSize: "var(--font-size-caption)",
                          fontWeight: 700,
                          paddingInline: "var(--space-2)",
                          paddingBlock: "var(--space-0-5)",
                          borderRadius: "var(--radius-button)",
                          background: "var(--color-surface-subtle)",
                          color: "var(--color-endoora-blue)",
                          border: "1px solid var(--color-endoora-blue)",
                        }}
                      >
                        {item.target_cefr}
                      </span>
                    </div>

                    <h2 className={styles.cardTitle}>{item.title}</h2>
                    {item.description && (
                      <p style={{ fontSize: "var(--font-size-body-sm)", color: "var(--color-muted)", margin: 0 }}>
                        {item.description}
                      </p>
                    )}

                    <div className={styles.cardMetaList} style={{ marginBlockStart: "var(--space-3)" }}>
                      <div className={styles.cardMetaItem}>
                        <span>مهلت تحویل:</span>
                        <strong>
                          {item.due_date
                            ? new Date(item.due_date).toLocaleString("fa-IR", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "نامحدود"}
                        </strong>
                      </div>

                      <div className={styles.cardMetaItem}>
                        <span>محدودیت زمان:</span>
                        <span>
                          {item.time_limit_minutes ? `${item.time_limit_minutes} دقیقه` : "بدون تایمر"}
                        </span>
                      </div>

                      <div className={styles.cardMetaItem}>
                        <span>دفعات تلاش:</span>
                        <span>
                          {attemptsLeft > 0 ? `${attemptsLeft} تلاش باقی‌مانده` : "فرصت‌های تلاش تمام شده"}
                        </span>
                      </div>

                      {item.best_score !== null && (
                        <div className={styles.cardMetaItem}>
                          <span>بهترین نمره:</span>
                          <strong style={{ color: "var(--color-learning-teal)" }}>
                            {Number(item.best_score)} از {Number(item.total_points)}
                          </strong>
                        </div>
                      )}

                      <div className={styles.cardMetaItem}>
                        <span>وضعیت:</span>
                        {item.is_open ? (
                          <span className={styles.statusOpen}>مهلت ثبت فعال است</span>
                        ) : (
                          <span className={styles.statusClosed}>مهلت ثبت پایان یافته</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    {hasInProgress ? (
                      <Link href={`/assignments/${item.id}`} className={styles.primaryButton}>
                        ادامه تلاش ناتمام ←
                      </Link>
                    ) : item.is_open && attemptsLeft > 0 ? (
                      <Link href={`/assignments/${item.id}`} className={styles.primaryButton}>
                        شروع آزمون / تکلیف ←
                      </Link>
                    ) : (
                      <Link href={`/assignments/${item.id}`} className={styles.secondaryButton}>
                        مشاهده کارنامه و بازخورد
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

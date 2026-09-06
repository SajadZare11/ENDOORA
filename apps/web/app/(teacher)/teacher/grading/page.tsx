"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./grading.module.css";
import { useTeacherHome } from "../../../../components/teacher/TeacherShell";
import {
  fetchTeacherSubmissionsQueue,
  type SubmissionQueueItem,
} from "../../../../lib/teacher-gradebook";

export default function TeacherGradingQueuePage() {
  const { locale } = useTeacherHome();
  const isFa = locale === "fa";

  const [queue, setQueue] = useState<SubmissionQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setErrorMsg(null);
      try {
        const filterVal =
          statusFilter === "all"
            ? undefined
            : (statusFilter as "submitted" | "graded" | "revision_requested");
        const data = await fetchTeacherSubmissionsQueue({ status: filterVal });
        setQueue(data);
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : "Failed to load submissions queue.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [statusFilter]);

  const filteredQueue = queue.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.learner_name.toLowerCase().includes(q) ||
      item.learner_email.toLowerCase().includes(q) ||
      item.assignment_title.toLowerCase().includes(q) ||
      item.class_title.toLowerCase().includes(q)
    );
  });

  return (
    <div className={styles.container} dir={isFa ? "rtl" : "ltr"}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>
              {isFa ? "صندوق تصحیح تکالیف و ارزیابی" : "Submissions & Grading Queue"}
            </h1>
            <p className={styles.subtitle}>
              {isFa
                ? "مدیریت و تصحیح تکالیف ارسالی زبان‌آموزان، ثبت نمرات، روبریم‌ها و ارسال بازخورد کیفی."
                : "Review and evaluate learner assignment attempts, assign rubric scores, and deliver qualitative feedback."}
            </p>
          </div>
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <Link href="/teacher/gradebook" className={styles.actionButtonSecondary}>
              {isFa ? "مشاهده کارنامه کلاس‌ها" : "View Gradebook"}
            </Link>
            <Link href="/teacher/assignments" className={styles.actionButtonSecondary}>
              {isFa ? "مدیریت تکالیف" : "Assignments Hub"}
            </Link>
          </div>
        </div>
      </header>

      {/* Filters Bar */}
      <div className={styles.filtersBar}>
        <input
          type="text"
          placeholder={isFa ? "جستجوی زبان‌آموز یا تکلیف..." : "Search learner or assignment..."}
          className={styles.filterInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">{isFa ? "همه وضعیت‌ها" : "All Statuses"}</option>
          <option value="pending">{isFa ? "در انتظار تصحیح" : "Pending Grading"}</option>
          <option value="graded">{isFa ? "تصحیح شده" : "Graded"}</option>
          <option value="late">{isFa ? "ارسال با تاخیر" : "Late Submissions"}</option>
          <option value="revision_requested">{isFa ? "درخواست بازنگری" : "Revision Requested"}</option>
        </select>
      </div>

      {errorMsg && (
        <div style={{ padding: "var(--space-3)", background: "var(--color-danger-subtle)", color: "var(--color-danger-dark)", borderRadius: "var(--radius-sm)" }}>
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
          {isFa ? "در حال بارگیری صف تکالیف..." : "Loading submissions queue..."}
        </div>
      ) : filteredQueue.length === 0 ? (
        <div style={{ textAlign: "center", padding: "var(--space-8)", background: "var(--color-bg-surface)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-md)" }}>
          <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>
            {isFa ? "هیچ تلاشی برای تصحیح یافت نشد." : "No submissions found matching criteria."}
          </p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{isFa ? "زبان‌آموز" : "Learner"}</th>
                <th>{isFa ? "تکلیف" : "Assignment"}</th>
                <th>{isFa ? "کلاس" : "Class"}</th>
                <th>{isFa ? "وضعیت" : "Status"}</th>
                <th>{isFa ? "نمره" : "Score"}</th>
                <th>{isFa ? "زمان ارسال" : "Submitted At"}</th>
                <th>{isFa ? "عملیات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueue.map((item) => {
                let badgeClass = styles.badgePending;
                let badgeLabel = isFa ? "در انتظار تصحیح" : "Pending";
                if (item.status === "graded") {
                  badgeClass = styles.badgeGraded;
                  badgeLabel = isFa ? "تصحیح شده" : "Graded";
                } else if (item.status === "revision_requested") {
                  badgeClass = styles.badgeRevision;
                  badgeLabel = isFa ? "بازنگری" : "Revision";
                }

                return (
                  <tr key={item.attempt_id}>
                    <td>
                      <div>
                        <strong>{item.learner_name}</strong>
                        <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                          {item.learner_email}
                        </div>
                      </div>
                    </td>
                    <td>{item.assignment_title}</td>
                    <td>{item.class_title}</td>
                    <td>
                      <div style={{ display: "flex", gap: "var(--space-1)", alignItems: "center" }}>
                        <span className={`${styles.badge} ${badgeClass}`}>{badgeLabel}</span>
                        {item.is_late && (
                          <span className={`${styles.badge} ${styles.badgeLate}`}>
                            {isFa ? "تاخیر" : "Late"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      {item.score_awarded !== null ? (
                        <strong>
                          {item.score_awarded} / {item.total_points} ({item.percentage}%)
                        </strong>
                      ) : (
                        <span style={{ color: "var(--color-text-tertiary)" }}>-</span>
                      )}
                    </td>
                    <td>
                      {item.submitted_at
                        ? new Date(item.submitted_at).toLocaleDateString(isFa ? "fa-IR" : "en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>
                    <td>
                      <Link
                        href={`/teacher/grading/${item.attempt_id}`}
                        className={styles.actionButton}
                      >
                        {isFa ? "تصحیح و بازخورد" : "Grade & Feedback"}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

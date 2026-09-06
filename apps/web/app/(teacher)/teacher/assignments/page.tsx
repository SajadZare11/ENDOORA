"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./assignments.module.css";
import {
  AssignmentListItem,
  AssignmentStatus,
  deleteAssignmentDraft,
  fetchTeacherAssignments,
} from "@/lib/teacher-assignments";

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentListItem[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | AssignmentStatus>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTeacherAssignments();
        if (!cancelled) {
          setAssignments(data);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "خطا در دریافت لیست تکالیف.");
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

  const handleDeleteDraft = async (assignmentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("آیا از حذف این پیش‌نویس اطمینان دارید؟")) return;

    try {
      await deleteAssignmentDraft(assignmentId);
      setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "خطا در حذف پیش‌نویس.");
    }
  };

  const filteredAssignments = assignments.filter((a) => {
    if (activeTab === "all") return true;
    return a.status === activeTab;
  });

  const totalAssignments = assignments.length;
  const draftCount = assignments.filter((a) => a.status === "draft").length;
  const publishedCount = assignments.filter((a) => a.status === "published").length;
  const totalSubmissions = assignments.reduce((acc, curr) => acc + curr.submissions_count, 0);

  const formatStatus = (status: AssignmentStatus) => {
    switch (status) {
      case "draft":
        return { label: "پیش‌نویس", className: styles.badgeDraft };
      case "published":
        return { label: "منتشر شده", className: styles.badgePublished };
      case "closed":
        return { label: "پایان یافته", className: styles.badgeClosed };
      case "archived":
        return { label: "بایگانی شده", className: styles.badgeArchived };
      default:
        return { label: status, className: styles.badgeDraft };
    }
  };

  return (
    <div className={styles.container}>
      {/* Header Card with Breadcrumbs */}
      <div className={styles.headerCard}>
        <nav className={styles.breadcrumbs} aria-label="مسیر راهنما">
          <Link href="/teacher" className={styles.breadcrumbLink}>
            خانه مدرس
          </Link>
          <span className={styles.breadcrumbSeparator}>←</span>
          <span className={styles.breadcrumbLink}>تدریس</span>
          <span className={styles.breadcrumbSeparator}>←</span>
          <span className={styles.breadcrumbCurrent}>تکالیف و آزمون‌ها</span>
        </nav>

        <div className={styles.headerTop}>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>مدیریت تکالیف و آزمون‌ها</h1>
            <p className={styles.description}>
              طراحی، زمان‌بندی و انتشار ارزیابی‌های کلاسی از بانک سوالات، اعمال تسهیلات فردی و تصحیح خودکار.
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link href="/teacher/grading" className={styles.secondaryButton}>
              صف تصحیح تکالیف ✍️
            </Link>
            <Link href="/teacher/gradebook" className={styles.secondaryButton}>
              دفتر نمرات کلاسی 📊
            </Link>
            <Link href="/teacher/assignments/new" className={styles.primaryButton}>
              + ساخت تکلیف جدید
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>کل تکالیف</span>
            <span className={styles.metricValue}>{totalAssignments}</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>فعال و منتشر شده</span>
            <span className={styles.metricValue}>{publishedCount}</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>پیش‌نویس‌ها</span>
            <span className={styles.metricValue}>{draftCount}</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>مجموع پاسخ‌های دریافتی</span>
            <span className={styles.metricValue}>{totalSubmissions}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={styles.contentCard}>
        {/* Tab Filters */}
        <div className={styles.tabBar} role="tablist">
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "all" ? styles.activeTabButton : ""}`}
            onClick={() => setActiveTab("all")}
          >
            همه تکالیف ({totalAssignments})
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "published" ? styles.activeTabButton : ""}`}
            onClick={() => setActiveTab("published")}
          >
            منتشر شده ({publishedCount})
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "draft" ? styles.activeTabButton : ""}`}
            onClick={() => setActiveTab("draft")}
          >
            پیش‌نویس‌ها ({draftCount})
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "closed" ? styles.activeTabButton : ""}`}
            onClick={() => setActiveTab("closed")}
          >
            پایان یافته
          </button>
        </div>

        {error && (
          <div className={styles.errorBanner} role="alert" style={{ marginBlock: "var(--space-4)" }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>در حال بارگذاری تکالیف...</p>
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className={styles.emptyState}>
            <h3 className={styles.emptyTitle}>تکلیفی یافت نشد</h3>
            <p className={styles.emptyText}>
              {activeTab === "all"
                ? "شما هنوز هیچ تکلیفی ایجاد نکرده‌اید. با انتخاب گزینه ساخت تکلیف جدید، اولین ارزیابی کلاسی خود را آماده کنید."
                : "هیچ تکلیفی در این بخش وجود ندارد."}
            </p>
            <Link href="/teacher/assignments/new" className={styles.primaryButton}>
              شروع ساخت اولین تکلیف
            </Link>
          </div>
        ) : (
          <div className={styles.tableWrapper} style={{ marginBlockStart: "var(--space-4)" }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">عنوان تکلیف</th>
                  <th scope="col">کلاس</th>
                  <th scope="col">سطح CEFR</th>
                  <th scope="col">وضعیت</th>
                  <th scope="col">تعداد سوالات</th>
                  <th scope="col">پاسخ‌های ثبت شده</th>
                  <th scope="col">مهلت تحویل</th>
                  <th scope="col">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((a) => {
                  const statusInfo = formatStatus(a.status);
                  return (
                    <tr key={a.id}>
                      <td>
                        <strong>{a.title}</strong>
                      </td>
                      <td>{a.teacher_class_title}</td>
                      <td>
                        <span className={styles.cefrBadge}>{a.target_cefr}</span>
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${statusInfo.className}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td>{a.questions_count} سوال ({Number(a.total_points)} نمره)</td>
                      <td>
                        <strong>{a.submissions_count}</strong> زبان‌آموز
                      </td>
                      <td>
                        {a.due_date
                          ? new Date(a.due_date).toLocaleDateString("fa-IR", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "تعیین نشده"}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "var(--space-2)" }}>
                          <Link
                            href={`/teacher/assignments/${a.id}`}
                            className={styles.secondaryButton}
                            style={{ paddingBlock: "var(--space-1)", paddingInline: "var(--space-3)", fontSize: "var(--font-size-caption)" }}
                          >
                            جزئیات و نمرات
                          </Link>
                          {a.status === "draft" && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteDraft(a.id, e)}
                              className={styles.dangerButton}
                              style={{ paddingBlock: "var(--space-1)", paddingInline: "var(--space-3)", fontSize: "var(--font-size-caption)" }}
                            >
                              حذف
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

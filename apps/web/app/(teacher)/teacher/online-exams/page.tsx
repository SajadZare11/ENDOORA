"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./online-exams.module.css";
import { Button } from "@endoora/ui";
import { useTeacherHome } from "@/components/teacher/TeacherShell";
import {
  listTeacherExams,
  publishOnlineExam,
  closeOnlineExam,
  type OnlineExamListItem,
} from "@/lib/online-exams";

export default function TeacherOnlineExamsPage() {
  const { locale } = useTeacherHome();
  const isFa = locale === "fa";

  const [exams, setExams] = useState<OnlineExamListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await listTeacherExams();
        setExams(data);
      } catch (err) {
        console.error("Failed to load exams:", err);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const handlePublish = async (examId: string) => {
    try {
      setActionLoading(examId);
      await publishOnlineExam(examId);
      setExams((prev) =>
        prev.map((e) => (e.id === examId ? { ...e, status: "published" } : e))
      );
    } catch (err) {
      alert("خطا در انتشار آزمون");
    } finally {
      setActionLoading(null);
    }
  };

  const handleClose = async (examId: string) => {
    try {
      setActionLoading(examId);
      await closeOnlineExam(examId);
      setExams((prev) =>
        prev.map((e) => (e.id === examId ? { ...e, status: "closed" } : e))
      );
    } catch (err) {
      alert("خطا در بستن آزمون");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(search.toLowerCase()) ||
      (exam.access_code && exam.access_code.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "all" || exam.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const publishedCount = exams.filter((e) => e.status === "published").length;
  const totalSubmissions = exams.reduce((acc, e) => acc + (e.submissions_count || 0), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <span className={`${styles.statusBadge} ${styles.statusPublished}`}>منتشر شده</span>;
      case "closed":
        return <span className={`${styles.statusBadge} ${styles.statusClosed}`}>بسته شده</span>;
      case "archived":
        return <span className={`${styles.statusBadge} ${styles.statusArchived}`}>بایگانی</span>;
      default:
        return <span className={`${styles.statusBadge} ${styles.statusDraft}`}>پیش‌نویس</span>;
    }
  };

  return (
    <div className={styles.container} dir={isFa ? "rtl" : "ltr"}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>آزمون‌های آنلاین و سامانه ضد تقلب</h1>
          <p className={styles.subtitle}>
            طراحی، مدیریت، ارزیابی هوشمند و مانیتورینگ امنیتی آزمون‌های زبان انگلیسی
          </p>
        </div>

        <div className={styles.actions}>
          <Link href="/teacher/online-exams/create">
            <Button
              type="button"
              style={{
                background: "var(--color-primary, #4f46e5)",
                color: "#ffffff",
                fontWeight: 700,
                padding: "0.625rem 1.25rem",
              }}
            >
              + ساخت آزمون جدید
            </Button>
          </Link>
        </div>
      </header>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{exams.length}</div>
          <div className={styles.statLabel}>کل آزمون‌های طراحی‌شده</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber} style={{ color: "#059669" }}>
            {publishedCount}
          </div>
          <div className={styles.statLabel}>آزمون‌های فعال و منتشرشده</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber} style={{ color: "#4f46e5" }}>
            {totalSubmissions}
          </div>
          <div className={styles.statLabel}>مجموع شرکت‌کنندگان و پاسخ‌نامه‌ها</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber} style={{ color: "#d97706" }}>
            🛡️ ۹۴٪
          </div>
          <div className={styles.statLabel}>میانگین نمره اصالت (Integrity)</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <span style={{ marginLeft: "0.5rem" }}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="جستجوی عنوان یا کد دسترسی..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: "1.5px solid #cbd5e1",
              background: "#ffffff",
              fontSize: "0.875rem",
            }}
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="draft">پیش‌نویس</option>
            <option value="published">منتشر شده</option>
            <option value="closed">بسته شده</option>
          </select>
        </div>
      </div>

      {/* Exams Table */}
      <div className={styles.tableCard}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
            در حال بارگیری آزمون‌ها...
          </div>
        ) : filteredExams.length === 0 ? (
          <div className={styles.emptyState}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📝</div>
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#0f172a" }}>هنوز آزمونی ساخته نشده است</h3>
            <p style={{ margin: "0 0 1.5rem 0" }}>
              اولین آزمون آنلاین خود را همراه با سرفصل‌های Listening، Speaking، Writing و قوانین ضد تقلب بسازید.
            </p>
            <Link href="/teacher/online-exams/create">
              <Button type="button">ساخت اولین آزمون</Button>
            </Link>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "1rem 1.25rem", fontSize: "0.8125rem", color: "#475569" }}>عنوان آزمون</th>
                <th style={{ padding: "1rem", fontSize: "0.8125rem", color: "#475569" }}>کلاس مرتبط</th>
                <th style={{ padding: "1rem", fontSize: "0.8125rem", color: "#475569" }}>وضعیت</th>
                <th style={{ padding: "1rem", fontSize: "0.8125rem", color: "#475569" }}>مدت زمان</th>
                <th style={{ padding: "1rem", fontSize: "0.8125rem", color: "#475569" }}>سوالات</th>
                <th style={{ padding: "1rem", fontSize: "0.8125rem", color: "#475569" }}>شرکت‌کنندگان</th>
                <th style={{ padding: "1rem", fontSize: "0.8125rem", color: "#475569" }}>کد دسترسی</th>
                <th style={{ padding: "1rem 1.25rem", fontSize: "0.8125rem", color: "#475569", textAlign: "center" }}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.map((exam) => (
                <tr key={exam.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "1rem 1.25rem", fontWeight: 700 }}>
                    <Link
                      href={`/teacher/online-exams/${exam.id}`}
                      style={{ color: "#1e293b", textDecoration: "none" }}
                    >
                      {exam.title}
                    </Link>
                  </td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#64748b" }}>
                    {exam.teacher_class_title || "آزمون آزاد (همگانی)"}
                  </td>
                  <td style={{ padding: "1rem" }}>{getStatusBadge(exam.status)}</td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem" }}>{exam.duration_minutes} دقیقه</td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem" }}>{exam.questions_count} سوال</td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem", fontWeight: 600 }}>
                    {exam.submissions_count} نفر
                  </td>
                  <td style={{ padding: "1rem", fontFamily: "monospace", fontSize: "0.875rem", color: "#4f46e5" }} dir="ltr">
                    {exam.access_code || "—"}
                  </td>
                  <td style={{ padding: "1rem 1.25rem", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "0.35rem", justifyContent: "center" }}>
                      <Link href={`/teacher/online-exams/${exam.id}`}>
                        <Button type="button" style={{ padding: "0.35rem 0.65rem", fontSize: "0.8125rem" }}>
                          مدیریت
                        </Button>
                      </Link>

                      {exam.status === "draft" && (
                        <Button
                          type="button"
                          onClick={() => handlePublish(exam.id)}
                          disabled={actionLoading === exam.id}
                          style={{
                            padding: "0.35rem 0.65rem",
                            fontSize: "0.8125rem",
                            background: "#059669",
                            color: "#ffffff",
                          }}
                        >
                          انتشار
                        </Button>
                      )}

                      {exam.status === "published" && (
                        <Button
                          type="button"
                          onClick={() => handleClose(exam.id)}
                          disabled={actionLoading === exam.id}
                          style={{
                            padding: "0.35rem 0.65rem",
                            fontSize: "0.8125rem",
                            background: "#dc2626",
                            color: "#ffffff",
                          }}
                        >
                          بستن
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "../analytics.module.css";
import { useTeacherHome } from "../../../../../components/teacher/TeacherShell";
import {
  fetchClassAnalyticsReport,
  getClassAnalyticsCsvExportUrl,
  type ClassAnalyticsReport,
} from "../../../../../lib/teacher-analytics";

export default function ClassAnalyticsReportPage() {
  const params = useParams();
  const classId = String(params?.classId || "");
  const { locale } = useTeacherHome();
  const isFa = locale === "fa";

  const [report, setReport] = useState<ClassAnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchLearner, setSearchLearner] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!classId) return;
      setLoading(true);
      setErrorMsg(null);
      try {
        const data = await fetchClassAnalyticsReport(classId);
        setReport(data);
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : "Failed to load class report.");
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, [classId]);

  const filteredLearners = report?.learners_roster.filter((l) => {
    if (!searchLearner) return true;
    const q = searchLearner.toLowerCase();
    return l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q);
  });

  const getScoreColor = (score: number | null) => {
    if (score === null) return "var(--color-text-muted)";
    if (score >= 80) return "var(--color-success)";
    if (score >= 60) return "var(--color-warning)";
    return "var(--color-danger)";
  };

  const getSeverityBadgeClass = (severity: string | null) => {
    if (severity === "high") return styles.badgeHigh;
    if (severity === "medium") return styles.badgeMedium;
    if (severity === "low") return styles.badgeLow;
    return styles.badgeNeutral;
  };

  return (
    <div className={styles.container} dir={isFa ? "rtl" : "ltr"}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
            <Link href="/teacher/analytics" style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)" }}>
              {isFa ? "← بازگشت به نمای کلی" : "← Back to Overview"}
            </Link>
          </div>
          <h1 className={styles.title}>
            {report?.title || (isFa ? "گزارش تحلیلی کلاس" : "Class Analytics Report")}
          </h1>
          <p className={styles.subtitle}>
            {report ? `${report.level} • ${report.subject} • ${report.total_learners} ${isFa ? "زبان‌آموز" : "learners"}` : ""}
          </p>
        </div>

        <div className={styles.actionsArea}>
          {classId && (
            <a
              href={getClassAnalyticsCsvExportUrl(classId)}
              download
              className="teacher-button teacher-button--primary"
            >
              {isFa ? "خروجی اکسل (CSV UTF-8)" : "Export CSV (Excel)"}
            </a>
          )}
          <Link href={`/teacher/gradebook?classId=${classId}`} className="teacher-button teacher-button--secondary">
            {isFa ? "ماتریس نمرات" : "Open Gradebook"}
          </Link>
        </div>
      </header>

      {errorMsg && (
        <div className="teacher-shell-message teacher-shell-message--error" role="alert">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className={styles.emptyState}>
          <p>{isFa ? "در حال محاسبه گزارش تحلیلی..." : "Computing analytics..."}</p>
        </div>
      ) : report ? (
        <>
          {/* Key Metrics Strip */}
          <div className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <span>{isFa ? "میانگین نمره کلاس" : "Class Average"}</span>
              </div>
              <span className={styles.kpiValue} style={{ color: getScoreColor(report.aggregates.average_score) }}>
                {report.aggregates.average_score !== null ? `${report.aggregates.average_score}%` : "—"}
              </span>
              <span className={styles.kpiSubtext}>
                {isFa ? "میانه نمرات:" : "Median:"} {report.aggregates.median_score !== null ? `${report.aggregates.median_score}%` : "—"}
              </span>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <span>{isFa ? "نرخ ارسال تکالیف" : "Submission Rate"}</span>
              </div>
              <span className={styles.kpiValue}>{report.aggregates.submission_rate}%</span>
              <span className={styles.kpiSubtext}>
                {isFa ? "تکالیف تحویل شده نسبت به کل" : "Delivered / Total expected"}
              </span>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <span>{isFa ? "ارسال به‌موقع" : "On-Time Rate"}</span>
              </div>
              <span className={styles.kpiValue}>{report.aggregates.on_time_rate}%</span>
              <span className={styles.kpiSubtext}>
                {isFa ? "بدون احتساب تاخیر" : "Excluding late submissions"}
              </span>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <span>{isFa ? "هشدارهای ریسک فعال" : "Active Risk Alerts"}</span>
              </div>
              <span className={styles.kpiValue}>{report.aggregates.active_alerts_count}</span>
              <span className={styles.kpiSubtext}>
                {isFa ? "نیازمند پایش یا مداخله" : "Learners requiring intervention"}
              </span>
            </div>
          </div>

          {/* Section: Score Distribution & CEFR Skill Mastery */}
          <div className={styles.sectionGrid}>
            {/* Score Distribution Bins */}
            <div className={styles.surfaceCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  {isFa ? "توزیع آماری نمرات کلاس" : "Score Distribution Bins"}
                </h2>
              </div>
              <div className={styles.distributionBars}>
                {report.score_distribution.map((bin) => {
                  const barColorClass =
                    bin.range === "0-59"
                      ? styles.barFillDanger
                      : bin.range === "60-69"
                      ? styles.barFillWarning
                      : styles.barFillSuccess;
                  return (
                    <div key={bin.range} className={styles.distRow}>
                      <span>{bin.label_fa}</span>
                      <div className={styles.barTrack}>
                        <div
                          className={`${styles.barFill} ${barColorClass}`}
                          style={{ inlineSize: `${bin.percentage}%` }}
                        />
                      </div>
                      <span style={{ fontWeight: 600, textAlign: "end" }}>
                        {bin.count} ({bin.percentage}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CEFR Skill Mastery */}
            <div className={styles.surfaceCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  {isFa ? "تسلط به تفکیک مهارت‌های CEFR" : "Skill Mastery Breakdown"}
                </h2>
              </div>
              <div className={styles.skillsGrid}>
                {report.skill_mastery.map((item) => (
                  <div key={item.skill} className={styles.skillCard}>
                    <span className={styles.skillLabel}>{item.label}</span>
                    <span className={styles.skillScore} style={{ color: getScoreColor(item.average_score) }}>
                      {item.average_score}%
                    </span>
                    <span
                      className={
                        item.status === "mastered"
                          ? styles.badgeSuccess
                          : item.status === "proficient"
                          ? styles.badgeNeutral
                          : styles.badgeMedium
                      }
                      style={{ alignSelf: "flex-start" }}
                    >
                      {item.status === "mastered"
                        ? isFa
                          ? "تسلط عالی"
                          : "Mastered"
                        : item.status === "proficient"
                        ? isFa
                          ? "قابل قبول"
                          : "Proficient"
                        : isFa
                        ? "نیاز به تقویت"
                        : "Needs Work"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Longitudinal Performance Trajectory */}
          <div className={styles.surfaceCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                {isFa ? "مسیر پیشرفت و سیر زمانی تکالیف" : "Longitudinal Assignment Trajectory"}
              </h2>
            </div>
            {report.trajectory.length === 0 ? (
              <div className={styles.emptyState}>
                <p>{isFa ? "هنوز تکلیفی در این کلاس منتشر نشده است." : "No published assignments yet."}</p>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{isFa ? "عنوان تکلیف" : "Assignment"}</th>
                      <th>{isFa ? "سطح هدف" : "CEFR"}</th>
                      <th>{isFa ? "موعد تحویل" : "Due Date"}</th>
                      <th>{isFa ? "تحویل‌ها" : "Submissions"}</th>
                      <th>{isFa ? "میانگین نمره" : "Average Score"}</th>
                      <th>{isFa ? "میانه نمره" : "Median Score"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.trajectory.map((item) => (
                      <tr key={item.assignment_id}>
                        <td style={{ fontWeight: 600 }}>{item.title}</td>
                        <td>
                          <span className={styles.tagPill}>{item.target_cefr}</span>
                        </td>
                        <td>{item.due_date ? item.due_date.slice(0, 10) : "—"}</td>
                        <td>
                          {item.submissions_count} / {item.total_learners}
                        </td>
                        <td style={{ fontWeight: 700, color: getScoreColor(item.average_score) }}>
                          {item.average_score !== null ? `${item.average_score}%` : "—"}
                        </td>
                        <td>{item.median_score !== null ? `${item.median_score}%` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section: Learners Roster */}
          <div className={styles.surfaceCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                {isFa ? "فهرست عملکرد زبان‌آموزان کلاس" : "Learner Cohort Roster"}
              </h2>
              <input
                type="text"
                placeholder={isFa ? "جستجوی زبان‌آموز..." : "Search learner..."}
                value={searchLearner}
                onChange={(e) => setSearchLearner(e.target.value)}
                style={{
                  paddingInline: "var(--space-3)",
                  paddingBlock: "var(--space-2)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border-subtle)",
                }}
              />
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{isFa ? "زبان‌آموز" : "Learner"}</th>
                    <th>{isFa ? "میانگین نمرات" : "Average"}</th>
                    <th>{isFa ? "تکالیف تحویل داده" : "Submitted"}</th>
                    <th>{isFa ? "معوق" : "Missing"}</th>
                    <th>{isFa ? "با تاخیر" : "Late"}</th>
                    <th>{isFa ? "نرخ حضور" : "Attendance"}</th>
                    <th>{isFa ? "وضعیت هشدار" : "Alert Status"}</th>
                    <th>{isFa ? "عملیات" : "Action"}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLearners?.map((lr) => (
                    <tr key={lr.learner_id}>
                      <td>
                        <strong>{lr.name}</strong>
                        <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                          {lr.email}
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: getScoreColor(lr.average_score) }}>
                        {lr.average_score !== null ? `${lr.average_score}%` : "—"}
                      </td>
                      <td>{lr.completed_assignments}</td>
                      <td style={{ color: lr.missing_assignments > 0 ? "var(--color-danger)" : "inherit" }}>
                        {lr.missing_assignments}
                      </td>
                      <td>{lr.late_submissions}</td>
                      <td>{lr.attendance_rate}%</td>
                      <td>
                        {lr.active_alerts_count > 0 ? (
                          <span className={getSeverityBadgeClass(lr.highest_alert_severity)}>
                            {lr.active_alerts_count} {isFa ? "هشدار فعال" : "alerts"}
                          </span>
                        ) : (
                          <span className={styles.badgeSuccess}>{isFa ? "عادی" : "Good"}</span>
                        )}
                      </td>
                      <td>
                        <Link
                          href={`/teacher/analytics/learners/${lr.learner_id}?classId=${classId}`}
                          className={styles.btnSm}
                        >
                          {isFa ? "پروفایل تحلیلی" : "View Profile"}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

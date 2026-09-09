"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./analytics.module.css";
import { useTeacherHome } from "../../../../components/teacher/TeacherShell";
import {
  fetchTeacherAnalyticsOverview,
  acknowledgeAtRiskAlert,
  type TeacherAnalyticsOverview,
} from "../../../../lib/teacher-analytics";

export default function TeacherAnalyticsOverviewPage() {
  const { locale } = useTeacherHome();
  const isFa = locale === "fa";

  const [overview, setOverview] = useState<TeacherAnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [actingAlertId, setActingAlertId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setErrorMsg(null);
      try {
        const data = await fetchTeacherAnalyticsOverview();
        setOverview(data);
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : "Failed to load analytics overview.");
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, []);

  const handleAcknowledge = async (alertId: string) => {
    setActingAlertId(alertId);
    try {
      await acknowledgeAtRiskAlert(alertId);
      // Update local state
      setOverview((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          recent_alerts: prev.recent_alerts.map((a) =>
            a.id === alertId ? { ...a, status: "acknowledged", status_display: "مشاهده شده" } : a
          ),
        };
      });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to acknowledge alert.");
    } finally {
      setActingAlertId(null);
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    if (severity === "high") return styles.badgeHigh;
    if (severity === "medium") return styles.badgeMedium;
    return styles.badgeLow;
  };

  const getAlertItemClass = (severity: string) => {
    if (severity === "high") return `${styles.alertItem} ${styles.alertItemHigh}`;
    if (severity === "medium") return `${styles.alertItem} ${styles.alertItemMedium}`;
    return `${styles.alertItem} ${styles.alertItemLow}`;
  };

  return (
    <div className={styles.container} dir={isFa ? "rtl" : "ltr"}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>
            {isFa ? "تحلیل و پایش جامع یادگیری" : "Teacher Analytics & Insights"}
          </h1>
          <p className={styles.subtitle}>
            {isFa
              ? "داشبورد هوشمند پیشرفت کلاس‌ها، سامانه هشدار زودهنگام و مدیریت مداخلات آموزشی."
              : "Cohort progress dashboard, early-warning risk detection, and pedagogical intervention tools."}
          </p>
        </div>
        <div className={styles.actionsArea}>
          <Link href="/teacher/interventions" className="teacher-button teacher-button--primary">
            {isFa ? "مدیریت مداخلات آموزشی" : "Interventions Hub"}
          </Link>
          <Link href="/teacher/gradebook" className="teacher-button teacher-button--secondary">
            {isFa ? "دفتر نمرات (کارنامه)" : "Gradebook"}
          </Link>
          <Link href="/teacher/classes" className="teacher-button teacher-button--secondary">
            {isFa ? "کلاس‌ها" : "Classes"}
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
          <p>{isFa ? "در حال بارگیری شاخص‌های تحلیلی و وضعیت کلاس‌ها..." : "Loading analytics metrics..."}</p>
        </div>
      ) : overview ? (
        <>
          {/* KPI Strip */}
          <div className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <span>{isFa ? "کلاس‌های فعال" : "Active Classes"}</span>
              </div>
              <span className={styles.kpiValue}>{overview.total_classes}</span>
              <span className={styles.kpiSubtext}>
                {overview.total_learners} {isFa ? "زبان‌آموز متصل" : "connected learners"}
              </span>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <span>{isFa ? "میانگین تسلط کلاس‌ها" : "Average Mastery"}</span>
              </div>
              <span className={styles.kpiValue}>{overview.average_mastery_percentage}%</span>
              <span className={styles.kpiSubtext}>
                {isFa ? "مجموع تکالیف تصحیح شده" : "Across graded attempts"}
              </span>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <span>{isFa ? "هشدارهای در معرض خطر" : "At-Risk Alerts"}</span>
                {overview.alerts_summary.high_severity > 0 && (
                  <span className={styles.badgeHigh}>
                    {overview.alerts_summary.high_severity} {isFa ? "بحرانی" : "Critical"}
                  </span>
                )}
              </div>
              <span className={styles.kpiValue}>{overview.alerts_summary.total_active}</span>
              <span className={styles.kpiSubtext}>
                {overview.alerts_summary.medium_severity} {isFa ? "متوسط" : "medium"} /{" "}
                {overview.alerts_summary.low_severity} {isFa ? "کم‌ریسک" : "low"}
              </span>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <span>{isFa ? "اقدامات حمایتی" : "Interventions"}</span>
              </div>
              <span className={styles.kpiValue}>
                {overview.interventions_summary.in_progress + overview.interventions_summary.planned}
              </span>
              <span className={styles.kpiSubtext}>
                {overview.interventions_summary.completed} {isFa ? "مداخله موفق و تکمیل شده" : "completed"}
              </span>
            </div>
          </div>

          {/* Main 2-column Grid */}
          <div className={styles.sectionGrid}>
            {/* Left Col: Classes Performance Cards */}
            <div className={styles.surfaceCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  {isFa ? "عملکرد کلاس‌های جاری" : "Class Cohort Performance"}
                </h2>
                <span className={styles.badgeNeutral}>
                  {overview.class_summaries.length} {isFa ? "کلاس" : "classes"}
                </span>
              </div>

              {overview.class_summaries.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>{isFa ? "هیچ کلاس فعالی ثبت نشده است." : "No active classes found."}</p>
                </div>
              ) : (
                <div className={styles.classList}>
                  {overview.class_summaries.map((cls) => (
                    <Link
                      key={cls.id}
                      href={`/teacher/analytics/${cls.id}`}
                      className={styles.classCard}
                    >
                      <div className={styles.classMeta}>
                        <span className={styles.className}>{cls.title}</span>
                        <div className={styles.classTags}>
                          <span className={styles.tagPill}>{cls.level}</span>
                          <span className={styles.tagPill}>{cls.subject}</span>
                          <span>
                            {cls.learner_count} {isFa ? "زبان‌آموز" : "learners"}
                          </span>
                        </div>
                      </div>

                      <div className={styles.classMetrics}>
                        <div className={styles.classScoreBlock}>
                          <span className={styles.classScoreVal}>
                            {cls.average_score !== null ? `${cls.average_score}%` : "—"}
                          </span>
                          <span className={styles.kpiSubtext}>
                            {isFa ? "میانگین نمره" : "Average Score"}
                          </span>
                        </div>

                        <div className={styles.classScoreBlock}>
                          <span style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>
                            {cls.submission_rate}%
                          </span>
                          <span className={styles.kpiSubtext}>
                            {isFa ? "نرخ تحویل" : "Submission"}
                          </span>
                        </div>

                        {cls.active_alerts_count > 0 && (
                          <span
                            className={
                              cls.high_severity_alerts_count > 0
                                ? styles.badgeHigh
                                : styles.badgeMedium
                            }
                          >
                            {cls.active_alerts_count} {isFa ? "هشدار" : "alerts"}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Right Col: Early Warning Alerts Feed */}
            <div className={styles.surfaceCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  {isFa ? "هشدارهای نیاز به مداخله" : "Early-Warning Alerts"}
                </h2>
                <span className={styles.badgeNeutral}>
                  {overview.recent_alerts.length} {isFa ? "مورد" : "items"}
                </span>
              </div>

              {overview.recent_alerts.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>
                    {isFa
                      ? "خوشبختانه هیچ زبان‌آموزی در وضعیت خطر شناسایی نشده است."
                      : "No learners are currently flagged at-risk."}
                  </p>
                </div>
              ) : (
                <div className={styles.alertsFeed}>
                  {overview.recent_alerts.map((alert) => (
                    <div key={alert.id} className={getAlertItemClass(alert.severity)}>
                      <div className={styles.alertItemTop}>
                        <span className={getSeverityBadgeClass(alert.severity)}>
                          {alert.severity_display}
                        </span>
                        <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
                          {alert.class_title}
                        </span>
                      </div>

                      <p className={styles.alertTitle}>{alert.title}</p>
                      <p className={styles.alertDesc}>
                        <strong>{alert.learner_name}:</strong> {alert.description}
                      </p>

                      <div className={styles.alertActions}>
                        {alert.status === "active" && (
                          <button
                            type="button"
                            className={styles.btnSm}
                            onClick={() => void handleAcknowledge(alert.id)}
                            disabled={actingAlertId === alert.id}
                          >
                            {isFa ? "مشاهده شد" : "Acknowledge"}
                          </button>
                        )}
                        <Link
                          href={`/teacher/interventions?learner_id=${alert.learner_id}&class_id=${alert.teacher_class_id}&alert_id=${alert.id}`}
                          className={`${styles.btnSm} ${styles.btnSmPrimary}`}
                        >
                          {isFa ? "طراحی مداخله" : "Plan Intervention"}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

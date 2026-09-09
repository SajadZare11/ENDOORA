"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import styles from "../../analytics.module.css";
import { useTeacherHome } from "../../../../../../components/teacher/TeacherShell";
import {
  fetchLearnerAnalyticsProfile,
  createTeacherIntervention,
  type LearnerAnalyticsProfile,
} from "../../../../../../lib/teacher-analytics";

export default function LearnerAnalyticsProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const learnerId = String(params?.learnerId || "");
  const classId = searchParams.get("classId") || "";

  const { locale } = useTeacherHome();
  const isFa = locale === "fa";

  const [profile, setProfile] = useState<LearnerAnalyticsProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Intervention Modal State
  const [showModal, setShowModal] = useState(false);
  const [intTitle, setIntTitle] = useState("");
  const [intDesc, setIntDesc] = useState("");
  const [intType, setIntType] = useState("targeted_remedial_assignment");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!learnerId || !classId) {
        setErrorMsg(isFa ? "شناسه کلاس یا زبان‌آموز نامعتبر است." : "Missing classId or learnerId.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setErrorMsg(null);
      try {
        const data = await fetchLearnerAnalyticsProfile(classId, learnerId);
        setProfile(data);
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : "Failed to load learner analytics profile.");
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, [learnerId, classId, isFa]);

  const handleCreateIntervention = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intTitle.trim() || !intDesc.trim()) return;
    setSubmitting(true);
    try {
      await createTeacherIntervention({
        class_id: classId,
        learner_id: learnerId,
        intervention_type: intType,
        title: intTitle,
        description: intDesc,
        score_before: profile?.metrics.average_score,
      });
      setShowModal(false);
      setIntTitle("");
      setIntDesc("");
      // Reload profile
      const updated = await fetchLearnerAnalyticsProfile(classId, learnerId);
      setProfile(updated);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to create intervention.");
    } finally {
      setSubmitting(false);
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return "var(--color-text-muted)";
    if (score >= 80) return "var(--color-success)";
    if (score >= 60) return "var(--color-warning)";
    return "var(--color-danger)";
  };

  return (
    <div className={styles.container} dir={isFa ? "rtl" : "ltr"}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
            <Link
              href={`/teacher/analytics/${classId}`}
              style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)" }}
            >
              {isFa ? "← بازگشت به گزارش کلاس" : "← Back to Class Report"}
            </Link>
          </div>
          <h1 className={styles.title}>
            {profile ? profile.name : (isFa ? "پروفایل تحلیلی زبان‌آموز" : "Learner Analytics Profile")}
          </h1>
          <p className={styles.subtitle}>
            {profile ? `${profile.email} • ${profile.class_title} (${profile.class_level})` : ""}
          </p>
        </div>

        <div className={styles.actionsArea}>
          <button
            type="button"
            className="teacher-button teacher-button--primary"
            onClick={() => setShowModal(true)}
          >
            {isFa ? "ثبت اقدام و مداخله جدید" : "Plan Intervention"}
          </button>
        </div>
      </header>

      {errorMsg && (
        <div className="teacher-shell-message teacher-shell-message--error" role="alert">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className={styles.emptyState}>
          <p>{isFa ? "در حال بارگیری مشخصات تحلیلی زبان‌آموز..." : "Loading learner profile..."}</p>
        </div>
      ) : profile ? (
        <>
          {/* Key Metrics */}
          <div className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <span>{isFa ? "میانگین نمرات" : "Mastery Score"}</span>
              </div>
              <span className={styles.kpiValue} style={{ color: getScoreColor(profile.metrics.average_score) }}>
                {profile.metrics.average_score !== null ? `${profile.metrics.average_score}%` : "—"}
              </span>
              <span className={styles.kpiSubtext}>
                {isFa ? "تکالیف تصحیح شده" : "Across graded attempts"}
              </span>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <span>{isFa ? "تکالیف تحویل داده" : "Completed"}</span>
              </div>
              <span className={styles.kpiValue}>{profile.metrics.completed_assignments}</span>
              <span className={styles.kpiSubtext}>
                {profile.metrics.missing_assignments} {isFa ? "تکلیف معوق" : "missing"}
              </span>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <span>{isFa ? "نرخ حضور در جلسات" : "Attendance Rate"}</span>
              </div>
              <span className={styles.kpiValue}>{profile.metrics.attendance_rate}%</span>
              <span className={styles.kpiSubtext}>
                {isFa ? "جلسات کلاسی تایید شده" : "Confirmed sessions"}
              </span>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <span>{isFa ? "هشدارهای ریسک" : "Active Alerts"}</span>
              </div>
              <span className={styles.kpiValue}>{profile.metrics.active_alerts_count}</span>
              <span className={styles.kpiSubtext}>
                {profile.metrics.total_interventions_count} {isFa ? "مداخله ثبت شده" : "interventions"}
              </span>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className={styles.surfaceCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                {isFa ? "تسلط بر مهارت‌های ۶ گانه CEFR" : "CEFR Skills Breakdown"}
              </h2>
            </div>
            <div className={styles.skillsGrid}>
              {profile.skills_breakdown.map((sk) => (
                <div key={sk.skill} className={styles.skillCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className={styles.skillLabel}>{sk.label}</span>
                    <span className={styles.tagPill}>{sk.level}</span>
                  </div>
                  <span className={styles.skillScore} style={{ color: getScoreColor(sk.score) }}>
                    {sk.score}%
                  </span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{ inlineSize: `${sk.score}%`, backgroundColor: getScoreColor(sk.score) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignment History */}
          <div className={styles.surfaceCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                {isFa ? "سوابق تکالیف در این کلاس" : "Assignment History"}
              </h2>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{isFa ? "تکلیف" : "Assignment"}</th>
                    <th>{isFa ? "وضعیت" : "Status"}</th>
                    <th>{isFa ? "نمره" : "Score"}</th>
                    <th>{isFa ? "درصد" : "Percentage"}</th>
                    <th>{isFa ? "تاخیر" : "Late"}</th>
                    <th>{isFa ? "بازخورد مدرس" : "Feedback"}</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.assignments_history.map((item) => (
                    <tr key={item.assignment_id}>
                      <td style={{ fontWeight: 600 }}>{item.title}</td>
                      <td>
                        <span
                          className={
                            item.status === "graded"
                              ? styles.badgeSuccess
                              : item.status === "submitted"
                              ? styles.badgeNeutral
                              : item.status === "missing"
                              ? styles.badgeHigh
                              : styles.badgeLow
                          }
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        {item.score_awarded !== null ? `${item.score_awarded} / ${item.total_points}` : "—"}
                      </td>
                      <td style={{ fontWeight: 700, color: getScoreColor(item.percentage) }}>
                        {item.percentage !== null ? `${item.percentage}%` : "—"}
                      </td>
                      <td>{item.is_late ? (isFa ? "با تاخیر" : "Late") : (isFa ? "به‌موقع" : "On time")}</td>
                      <td style={{ maxWidth: "250px" }}>
                        {item.teacher_feedback ? (
                          <span style={{ fontSize: "var(--font-size-xs)" }}>
                            {item.teacher_feedback.slice(0, 80)}
                            {item.teacher_feedback.length > 80 ? "..." : ""}
                          </span>
                        ) : (
                          <span style={{ color: "var(--color-text-muted)" }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}

      {/* Create Intervention Modal */}
      {showModal && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3 style={{ margin: 0, fontWeight: 700 }}>
                {isFa ? "طراحی اقدام و مداخله آموزشی" : "Plan Educational Intervention"}
              </h3>
              <button
                type="button"
                className={styles.btnSm}
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => void handleCreateIntervention(e)} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isFa ? "نوع مداخله آموزشی:" : "Intervention Type:"}</label>
                <select
                  className={styles.formSelect}
                  value={intType}
                  onChange={(e) => setIntType(e.target.value)}
                >
                  <option value="targeted_remedial_assignment">{isFa ? "تمرین و تکلیف جبرانی هدفمند" : "Targeted Remedial Assignment"}</option>
                  <option value="extra_time_accommodation">{isFa ? "تسهیلات زمان یا فرصت مجدد" : "Extra Time Accommodation"}</option>
                  <option value="one_on_one_office_hour">{isFa ? "جلسه رفع اشکال و مشاوره اختصاصی" : "1-on-1 Office Hour"}</option>
                  <option value="direct_encouragement_note">{isFa ? "پیام انگیزشی و راهنمای یادگیری" : "Direct Encouragement Note"}</option>
                  <option value="learning_plan_adjustment">{isFa ? "تعدیل برنامه یادگیری" : "Learning Plan Adjustment"}</option>
                  <option value="other">{isFa ? "سایر اقدامات حمایتی" : "Other"}</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isFa ? "عنوان مداخله:" : "Title:"}</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder={isFa ? "مثال: تمرین تقویتی زمان گذشته کامل" : "e.g. Remedial Past Perfect Drills"}
                  value={intTitle}
                  onChange={(e) => setIntTitle(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isFa ? "شرح اقدام و استراتژی آموزشی:" : "Description & Strategy:"}</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder={isFa ? "توضیح هدف و نحوه اجرای برنامه حمایتی..." : "Describe pedagogical rationale and steps..."}
                  value={intDesc}
                  onChange={(e) => setIntDesc(e.target.value)}
                  required
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.btnSm}
                  onClick={() => setShowModal(false)}
                >
                  {isFa ? "انصراف" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className={`${styles.btnSm} ${styles.btnSmPrimary}`}
                  disabled={submitting}
                >
                  {submitting ? (isFa ? "در حال ثبت..." : "Saving...") : (isFa ? "ثبت اقدام" : "Save Intervention")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

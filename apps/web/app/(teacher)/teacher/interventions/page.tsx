"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./interventions.module.css";
import { useTeacherHome } from "../../../../components/teacher/TeacherShell";
import {
  fetchTeacherInterventions,
  updateTeacherIntervention,
  type TeacherIntervention,
} from "../../../../lib/teacher-analytics";

export default function TeacherInterventionsPage() {
  const { locale } = useTeacherHome();
  const isFa = locale === "fa";

  const [interventions, setInterventions] = useState<TeacherIntervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "planned" | "in_progress" | "completed">("all");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Complete Modal State
  const [evaluatingItem, setEvaluatingItem] = useState<TeacherIntervention | null>(null);
  const [scoreAfter, setScoreAfter] = useState("");
  const [outcomeNotes, setOutcomeNotes] = useState("");
  const [autoResolveAlert, setAutoResolveAlert] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setErrorMsg(null);
      try {
        const filterStatus = activeTab === "all" ? undefined : activeTab;
        const data = await fetchTeacherInterventions({ status: filterStatus });
        setInterventions(data);
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : "Failed to load interventions.");
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, [activeTab]);

  const handleStartProgress = async (item: TeacherIntervention) => {
    try {
      const updated = await updateTeacherIntervention(item.id, { status: "in_progress" });
      setInterventions((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update status.");
    }
  };

  const handleCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatingItem) return;
    setSaving(true);
    try {
      const numScore = scoreAfter.trim() ? parseFloat(scoreAfter) : null;
      const updated = await updateTeacherIntervention(evaluatingItem.id, {
        status: "completed",
        score_after: numScore,
        outcome_notes: outcomeNotes,
        auto_resolve_alert: autoResolveAlert,
      });
      setInterventions((prev) => prev.map((i) => (i.id === evaluatingItem.id ? updated : i)));
      setEvaluatingItem(null);
      setScoreAfter("");
      setOutcomeNotes("");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to complete intervention.");
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "completed") return styles.badgeSuccess;
    if (status === "in_progress") return styles.badgeMedium;
    if (status === "planned") return styles.badgeNeutral;
    return styles.badgeLow;
  };

  return (
    <div className={styles.container} dir={isFa ? "rtl" : "ltr"}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>
            {isFa ? "میزکار مداخلات و اقدامات حمایتی" : "Intervention Workspace"}
          </h1>
          <p className={styles.subtitle}>
            {isFa
              ? "طراحی، پیگیری و ارزیابی اقدامات حمایتی آموزشی برای زبان‌آموزان در معرض ریسک."
              : "Design, monitor, and measure academic accommodations and targeted interventions."}
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <Link href="/teacher/analytics" className="teacher-button teacher-button--secondary">
            {isFa ? "تحلیل کلاس‌ها" : "Class Analytics"}
          </Link>
          <Link href="/teacher/gradebook" className="teacher-button teacher-button--secondary">
            {isFa ? "دفتر نمرات" : "Gradebook"}
          </Link>
        </div>
      </header>

      {errorMsg && (
        <div className="teacher-shell-message teacher-shell-message--error" role="alert">
          {errorMsg}
        </div>
      )}

      {/* Tabs Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.tabGroup}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "all" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("all")}
          >
            {isFa ? "همه اقدامات" : "All"}
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "planned" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("planned")}
          >
            {isFa ? "برنامه‌ریزی شده" : "Planned"}
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "in_progress" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("in_progress")}
          >
            {isFa ? "در حال اجرا" : "In Progress"}
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "completed" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            {isFa ? "تکمیل شده" : "Completed"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.emptyState}>
          <p>{isFa ? "در حال بارگیری فهرست اقدامات..." : "Loading interventions..."}</p>
        </div>
      ) : interventions.length === 0 ? (
        <div className={styles.emptyState}>
          <p>
            {isFa
              ? "هیچ مداخله‌ای در این وضعیت یافت نشد. از گزارش هر کلاس می‌توانید اقدام جدید ثبت کنید."
              : "No interventions found in this view. You can plan new interventions from any class report."}
          </p>
        </div>
      ) : (
        <div className={styles.cardsGrid}>
          {interventions.map((item) => {
            const hasDelta = item.score_before !== null && item.score_after !== null;
            const delta = hasDelta ? (item.score_after! - item.score_before!).toFixed(1) : null;
            return (
              <div key={item.id} className={styles.interventionCard}>
                <div className={styles.cardTop}>
                  <span className={styles.cardTypeBadge}>{item.intervention_type_display}</span>
                  <span className={getStatusBadge(item.status)}>{item.status_display}</span>
                </div>

                <h3 className={styles.cardTitle}>{item.title}</h3>

                <div className={styles.learnerMeta}>
                  <strong>{item.learner_name}</strong>
                  <span>•</span>
                  <span>{item.class_title}</span>
                </div>

                <p className={styles.cardDesc}>{item.description}</p>

                {/* Score Delta Tracker */}
                {(item.score_before !== null || item.score_after !== null) && (
                  <div className={styles.scoreDelta}>
                    <div>
                      <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                        {isFa ? "نمره قبل:" : "Before:"}{" "}
                      </span>
                      <span className={styles.scoreVal}>
                        {item.score_before !== null ? `${item.score_before}%` : "—"}
                      </span>
                    </div>
                    <span>→</span>
                    <div>
                      <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                        {isFa ? "نمره بعد:" : "After:"}{" "}
                      </span>
                      <span className={styles.scoreVal}>
                        {item.score_after !== null ? `${item.score_after}%` : "—"}
                      </span>
                    </div>
                    {delta !== null && (
                      <span className={parseFloat(delta) >= 0 ? styles.deltaPos : styles.badgeHigh}>
                        {parseFloat(delta) >= 0 ? `+${delta}%` : `${delta}%`}
                      </span>
                    )}
                  </div>
                )}

                {item.outcome_notes && (
                  <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", fontStyle: "italic", margin: 0 }}>
                    <strong>{isFa ? "نتیجه:" : "Outcome:"}</strong> {item.outcome_notes}
                  </p>
                )}

                <div className={styles.cardFooter}>
                  <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
                    {item.created_at.slice(0, 10)}
                  </span>
                  <div style={{ display: "flex", gap: "var(--space-2)" }}>
                    {item.status === "planned" && (
                      <button
                        type="button"
                        className={styles.btnSm}
                        onClick={() => void handleStartProgress(item)}
                      >
                        {isFa ? "شروع اجرا" : "Start"}
                      </button>
                    )}
                    {item.status === "in_progress" && (
                      <button
                        type="button"
                        className={`${styles.btnSm} ${styles.btnSmPrimary}`}
                        onClick={() => setEvaluatingItem(item)}
                      >
                        {isFa ? "ثبت نتیجه و تکمیل" : "Complete & Evaluate"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Complete & Evaluate Modal */}
      {evaluatingItem && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3 style={{ margin: 0, fontWeight: 700 }}>
                {isFa ? "ارزیابی و تکمیل مداخله آموزشی" : "Evaluate & Complete Intervention"}
              </h3>
              <button
                type="button"
                className={styles.btnSm}
                onClick={() => setEvaluatingItem(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => void handleCompleteSubmit(e)} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <p style={{ fontSize: "var(--font-size-sm)", margin: 0 }}>
                <strong>{evaluatingItem.learner_name}</strong>: {evaluatingItem.title}
              </p>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isFa ? "نمره یا درصد پس از مداخله (%):" : "Score After Intervention (%):"}</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  className={styles.formInput}
                  placeholder="e.g. 75.5"
                  value={scoreAfter}
                  onChange={(e) => setScoreAfter(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isFa ? "ارزیابی کیفی نتیجه مداخله:" : "Outcome Notes:"}</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder={isFa ? "شرح پیشرفت، بهبود تسلط یا توصیه‌های آتی..." : "Describe learner recovery and recommendations..."}
                  value={outcomeNotes}
                  onChange={(e) => setOutcomeNotes(e.target.value)}
                  required
                />
              </div>

              {evaluatingItem.alert_id && (
                <label style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", fontSize: "var(--font-size-sm)", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={autoResolveAlert}
                    onChange={(e) => setAutoResolveAlert(e.target.checked)}
                  />
                  <span>{isFa ? "رفع خودکار هشدار مرتبط در صورت موفقیت" : "Auto-resolve linked at-risk alert"}</span>
                </label>
              )}

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.btnSm}
                  onClick={() => setEvaluatingItem(null)}
                >
                  {isFa ? "انصراف" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className={`${styles.btnSm} ${styles.btnSmPrimary}`}
                  disabled={saving}
                >
                  {saving ? (isFa ? "در حال ثبت..." : "Saving...") : (isFa ? "ثبت و تکمیل مداخله" : "Save & Complete")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

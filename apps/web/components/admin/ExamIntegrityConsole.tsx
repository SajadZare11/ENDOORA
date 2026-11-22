"use client";

import React, { useState, useEffect } from "react";
import styles from "./exam-integrity.module.css";
import {
  type LiveExamSession,
  type AiGradeAuditRecord,
  type QuestionPsychometricsItem,
  type GradeAppealCase,
  type ExamIntegrityStats,
  type AiCriterionScores,
  INITIAL_LIVE_SESSIONS,
  INITIAL_AI_AUDITS,
  INITIAL_PSYCHOMETRICS,
  INITIAL_APPEALS,
} from "@/lib/exam-integrity-content";

export function ExamIntegrityConsole() {
  const [activeTab, setActiveTab] = useState<
    "live-proctoring" | "ai-grade-audit" | "psychometrics" | "grade-appeals"
  >("live-proctoring");

  const [sessions, setSessions] = useState<LiveExamSession[]>(INITIAL_LIVE_SESSIONS);
  const [aiAudits, setAiAudits] = useState<AiGradeAuditRecord[]>(INITIAL_AI_AUDITS);
  const [psychometrics, setPsychometrics] = useState<QuestionPsychometricsItem[]>(INITIAL_PSYCHOMETRICS);
  const [appeals, setAppeals] = useState<GradeAppealCase[]>(INITIAL_APPEALS);
  const [stats, setStats] = useState<ExamIntegrityStats>({
    activeSessionsCount: 4,
    flaggedViolationsToday: 5,
    pendingAiAudits: 2,
    quarantinedQuestions: 1,
    openAppeals: 1,
    platformAvgIntegrityScore: 76,
  });

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Modals state
  const [warningModalSession, setWarningModalSession] = useState<LiveExamSession | null>(null);
  const [warningMessage, setWarningMessage] = useState("");

  const [timeModalSession, setTimeModalSession] = useState<LiveExamSession | null>(null);
  const [compensationMinutes, setCompensationMinutes] = useState(5);

  const [invalidateModalSession, setInvalidateModalSession] = useState<LiveExamSession | null>(null);
  const [invalidationReason, setInvalidationReason] = useState("");

  const [calibratingAudit, setCalibratingAudit] = useState<AiGradeAuditRecord | null>(null);
  const [calibratedScores, setCalibratedScores] = useState<AiCriterionScores>({
    tr: 6.0,
    cc: 6.0,
    lr: 6.0,
    gra: 6.0,
    overallBand: 6.0,
  });
  const [examinerFeedback, setExaminerFeedback] = useState("");

  const [quarantineModalItem, setQuarantineModalItem] = useState<QuestionPsychometricsItem | null>(null);
  const [quarantineReason, setQuarantineReason] = useState("");

  const [adjudicatingAppeal, setAdjudicatingAppeal] = useState<GradeAppealCase | null>(null);
  const [appealDecision, setAppealDecision] = useState<"upgraded" | "rejected">("upgraded");
  const [revisedBand, setRevisedBand] = useState<number>(7.0);
  const [appealNotes, setAppealNotes] = useState("");
  const [refundFee, setRefundFee] = useState(true);

  // Load from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/exams/integrity");
      const json = await res.json();
      if (json.success && json.data) {
        setSessions(json.data.sessions || []);
        setAiAudits(json.data.aiAudits || []);
        setPsychometrics(json.data.psychometrics || []);
        setAppeals(json.data.appeals || []);
        setStats(json.data.stats);
      }
    } catch (err) {
      console.warn("Using local state fallback for Exam Integrity:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  // 1. Live Proctoring Handlers
  const handleSendWarning = async () => {
    if (!warningModalSession || !warningMessage) return;
    try {
      const res = await fetch("/api/admin/exams/integrity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_warning",
          sessionId: warningModalSession.id,
          message: warningMessage,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`اخطار زنده به داوطلب ${warningModalSession.studentName} ارسال شد.`);
        setWarningModalSession(null);
        setWarningMessage("");
        fetchData();
      }
    } catch {
      showToast("خطا در ارسال اخطار.");
    }
  };

  const handleSuspendSession = async (sessionId: string) => {
    try {
      const res = await fetch("/api/admin/exams/integrity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "suspend_session",
          sessionId,
          reason: "مشاهده رفتارهای پرخطر و تخلفات مکرر",
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("آزمون به حالت تعلیق موقت درآمد.");
        fetchData();
      }
    } catch {
      showToast("خطا در تعلیق آزمون.");
    }
  };

  const handleResumeSession = async (sessionId: string) => {
    try {
      const res = await fetch("/api/admin/exams/integrity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "resume_session",
          sessionId,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("آزمون رفع تعلیق شد و مجدداً فعال گردید.");
        fetchData();
      }
    } catch {
      showToast("خطا در رفع تعلیق آزمون.");
    }
  };

  const handlePardonViolation = async (sessionId: string, violationId: string) => {
    try {
      const res = await fetch("/api/admin/exams/integrity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "pardon_violation",
          sessionId,
          violationId,
          reason: "بررسی شواهد و احراز عدم سوءنیت داوطلب",
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("تخلف با موفقیت بخشیده شد و شاخص سلامت بازیابی گردید.");
        fetchData();
      }
    } catch {
      showToast("خطا در بخشش تخلف.");
    }
  };

  const handleGrantTime = async () => {
    if (!timeModalSession) return;
    try {
      const res = await fetch("/api/admin/exams/integrity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "grant_compensation_time",
          sessionId: timeModalSession.id,
          additionalMinutes: compensationMinutes,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`به مدت ${compensationMinutes} دقیقه وقت جبرانی اعطا شد.`);
        setTimeModalSession(null);
        fetchData();
      }
    } catch {
      showToast("خطا در اعطای وقت جبرانی.");
    }
  };

  const handleInvalidateSession = async () => {
    if (!invalidateModalSession || !invalidationReason) return;
    try {
      const res = await fetch("/api/admin/exams/integrity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "invalidate_session",
          sessionId: invalidateModalSession.id,
          reason: invalidationReason,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("آزمون باطل و نمره صفر در پرونده انضباطی ثبت گردید.");
        setInvalidateModalSession(null);
        setInvalidationReason("");
        fetchData();
      }
    } catch {
      showToast("خطا در ابطال آزمون.");
    }
  };

  // 2. AI Grade Handlers
  const handleOpenCalibrate = (audit: AiGradeAuditRecord) => {
    setCalibratingAudit(audit);
    setCalibratedScores(audit.humanScores || { ...audit.aiScores });
    setExaminerFeedback(audit.examinerFeedback || "");
  };

  const handleSaveCalibration = async () => {
    if (!calibratingAudit) return;
    try {
      const res = await fetch("/api/admin/exams/integrity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "calibrate_ai_score",
          auditId: calibratingAudit.id,
          humanScores: calibratedScores,
          examinerFeedback,
          reviewedBy: "سرممیز آزمون‌های بین‌المللی",
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("نمره کالیبره‌شده با موفقیت ثبت و کارنامه به‌روزرسانی شد.");
        setCalibratingAudit(null);
        fetchData();
      }
    } catch {
      showToast("خطا در ذخیره کالیبراسیون.");
    }
  };

  const handleConfirmAiScore = async (auditId: string) => {
    try {
      const res = await fetch("/api/admin/exams/integrity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "confirm_ai_score",
          auditId,
          reviewedBy: "اگزمینر ارشد آزمون‌ها",
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("نمره و تحلیل هوش مصنوعی رسماً تایید و نهایی شد.");
        fetchData();
      }
    } catch {
      showToast("خطا در تایید نمره.");
    }
  };

  // 3. Psychometrics Handlers
  const handleQuarantineItem = async () => {
    if (!quarantineModalItem || !quarantineReason) return;
    try {
      const res = await fetch("/api/admin/exams/integrity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "quarantine_question",
          itemId: quarantineModalItem.id,
          reason: quarantineReason,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("سوال از بانک سوالات فعال خارج و به قرنطینه منتقل شد.");
        setQuarantineModalItem(null);
        setQuarantineReason("");
        fetchData();
      }
    } catch {
      showToast("خطا در قرنطینه سوال.");
    }
  };

  const handleActivateItem = async (itemId: string) => {
    try {
      const res = await fetch("/api/admin/exams/integrity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "activate_question",
          itemId,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("سوال مجدداً به بانک آزمون‌های فعال بازگردانده شد.");
        fetchData();
      }
    } catch {
      showToast("خطا در فعال‌سازی سوال.");
    }
  };

  const handleRegradeQuestion = async (itemId: string) => {
    try {
      const res = await fetch("/api/admin/exams/integrity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "regrade_question",
          itemId,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(
          `تصحیح عطف‌به‌ماسبق اعمال شد؛ نمره سوال به ${json.affectedCandidatesCount} زبان‌آموز متضرر اعطا گردید.`
        );
        fetchData();
      }
    } catch {
      showToast("خطا در تصحیح عطف‌به‌ماسبق.");
    }
  };

  // 4. Grade Appeals Handlers
  const handleOpenAdjudicate = (appeal: GradeAppealCase) => {
    setAdjudicatingAppeal(appeal);
    setAppealDecision("upgraded");
    setRevisedBand(Math.min(9, appeal.originalBand + 0.5));
    setAppealNotes("");
    setRefundFee(true);
  };

  const handleSaveAppeal = async () => {
    if (!adjudicatingAppeal) return;
    try {
      const res = await fetch("/api/admin/exams/integrity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "resolve_appeal",
          appealId: adjudicatingAppeal.id,
          decision: appealDecision,
          revisedBand: appealDecision === "upgraded" ? revisedBand : undefined,
          notes: appealNotes,
          refundIssued: appealDecision === "upgraded" && refundFee,
          adjudicatedBy: "شورای ممیزی و داوری آیلتس",
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(
          appealDecision === "upgraded"
            ? "اعتراض پذیرفته شد، نمره ارتقا یافت و دستور عودت وجه ثبت شد."
            : "اعتراض رد شد و نمره اولیه ابقا گردید."
        );
        setAdjudicatingAppeal(null);
        fetchData();
      }
    } catch {
      showToast("خطا در ثبت داوری اعتراض.");
    }
  };

  const handleResetData = async () => {
    if (!confirm("آیا از بازنشانی داده‌های مرکز ممیزی آزمون‌ها به مقادیر اولیه اطمینان دارید؟")) return;
    try {
      const res = await fetch("/api/admin/exams/integrity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_data" }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("داده‌ها با موفقیت ریست شدند.");
        fetchData();
      }
    } catch {
      showToast("خطا در ریست داده‌ها.");
    }
  };

  return (
    <div className={styles.container} dir="rtl">
      {/* Toast Feedback */}
      {actionFeedback && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "2rem",
            background: "#065f46",
            border: "1px solid #34d399",
            color: "#ecfdf5",
            padding: "0.85rem 1.4rem",
            borderRadius: "10px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            zIndex: 9999,
            fontSize: "0.88rem",
            fontWeight: 600,
          }}
        >
          ✅ {actionFeedback}
        </div>
      )}

      {/* Header Card */}
      <div className={styles.headerCard}>
        <div className={styles.headerInfo}>
          <h2 className={styles.headerTitle}>
            <span>🛡️</span>
            <span>مرکز ممیزی آزمون‌ها، تقلب‌یابی و سلامت سنجش (Exam Integrity Hub)</span>
          </h2>
          <p className={styles.headerDesc}>
            پایش بلادرنگ نشست‌های زنده آزمون، ممیزی و بازبینی نمرات هوش مصنوعی آیلتس، تحلیل روان‌سنجی سلامت سوالات و
            داوری اعتراضات رسمی.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={styles.btn} onClick={fetchData} disabled={loading}>
            <span>🔄</span>
            <span>{loading ? "در حال به‌روزرسانی..." : "به‌روزرسانی داده‌ها"}</span>
          </button>
          <button type="button" className={`${styles.btn} ${styles.btnDanger}`} onClick={handleResetData}>
            <span>⚠️</span>
            <span>ریست دیتای تستی</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <span>📡</span>
            <span>نشست‌های زنده فعال</span>
          </div>
          <div className={styles.statVal}>{stats.activeSessionsCount}</div>
          <div className={styles.statSub}>آزمون‌های آنلاین در حال برگزاری</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <span>🚨</span>
            <span>تخلفات فعال ثبت‌شده</span>
          </div>
          <div className={`${styles.statVal} ${stats.flaggedViolationsToday > 0 ? styles.scoreMedium : ""}`}>
            {stats.flaggedViolationsToday}
          </div>
          <div className={styles.statSub}>خروج از تمام‌صفحه، تب، پیست، DevTools</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <span>🤖</span>
            <span>برگه‌های در صف ممیزی هوش مصنوعی</span>
          </div>
          <div className={styles.statVal}>{stats.pendingAiAudits}</div>
          <div className={styles.statSub}>اطمینان پایین مدل یا ناهماهنگی مهارت‌ها</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <span>☣️</span>
            <span>سوالات نیازمند بازنگری/قرنطینه</span>
          </div>
          <div className={styles.statVal}>{stats.quarantinedQuestions}</div>
          <div className={styles.statSub}>ضریب تمیز منفی یا تله‌های انحرافی</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <span>⚖️</span>
            <span>پرونده‌های باز اعتراض نمره (EOR)</span>
          </div>
          <div className={styles.statVal}>{stats.openAppeals}</div>
          <div className={styles.statSub}>در انتظار داوری اگزمینر ارشد</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            <span>🎯</span>
            <span>شاخص سلامت کل پلتفرم</span>
          </div>
          <div className={`${styles.statVal} ${styles.scoreHigh}`}>
            ٪{stats.platformAvgIntegrityScore}
          </div>
          <div className={styles.statSub}>میانگین رعایت قواعد پروکتورینگ</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className={styles.tabNav}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "live-proctoring" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("live-proctoring")}
        >
          <span>📡</span>
          <span>پایش زنده و مقابله با تقلب</span>
          <span className={`${styles.tabBadge} ${stats.flaggedViolationsToday > 0 ? styles.tabBadgeWarning : ""}`}>
            {stats.activeSessionsCount}
          </span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "ai-grade-audit" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("ai-grade-audit")}
        >
          <span>🤖</span>
          <span>ممیزی نمرات هوش مصنوعی</span>
          <span className={`${styles.tabBadge} ${stats.pendingAiAudits > 0 ? styles.tabBadgeDanger : ""}`}>
            {stats.pendingAiAudits}
          </span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "psychometrics" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("psychometrics")}
        >
          <span>📊</span>
          <span>روان‌سنجی و سلامت سوالات</span>
          <span className={`${styles.tabBadge} ${stats.quarantinedQuestions > 0 ? styles.tabBadgeWarning : ""}`}>
            {psychometrics.length}
          </span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "grade-appeals" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("grade-appeals")}
        >
          <span>⚖️</span>
          <span>داوری اعتراضات نمره (EOR)</span>
          <span className={`${styles.tabBadge} ${stats.openAppeals > 0 ? styles.tabBadgeDanger : ""}`}>
            {stats.openAppeals}
          </span>
        </button>
      </div>

      {/* TAB 1: Live Proctoring & Anti-Cheat */}
      {activeTab === "live-proctoring" && (
        <div>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>
                <span>📡</span>
                <span>رصدخانه بلادرنگ جلسات آزمون آنلاین و هشدارهای تخلف</span>
              </h3>
              <p className={styles.sectionDesc}>
                پایش لحظه‌ای داوطلبان فعال، لاگ رویدادهای سیستمی، اخطار زنده به دانش‌آموز، تعلیق و مدیریت تخلفات.
              </p>
            </div>
          </div>

          <div className={styles.filterBar}>
            <input
              type="text"
              placeholder="جستجو بر اساس نام داوطلب، عنوان آزمون، ایمیل یا IP..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className={styles.filterSelect}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">تمام وضعیت‌ها</option>
              <option value="active">فعال و نرمال</option>
              <option value="flagged">دارای اخطار و مشکوک</option>
              <option value="suspended">معلق‌شده توسط ناظر</option>
              <option value="disqualified">باطل‌شده (مردود انضباطی)</option>
            </select>
          </div>

          <div className={styles.sessionsGrid}>
            {sessions
              .filter((s) => {
                const matchQuery =
                  s.studentName.includes(searchQuery) ||
                  s.examTitle.includes(searchQuery) ||
                  s.ipAddress.includes(searchQuery);
                const matchStatus = filterStatus === "all" || s.status === filterStatus;
                return matchQuery && matchStatus;
              })
              .map((session) => {
                const cardClass =
                  session.status === "suspended"
                    ? styles.sessionCardSuspended
                    : session.status === "flagged"
                    ? styles.sessionCardFlagged
                    : styles.sessionCardActive;

                const scoreClass =
                  session.integrityScore >= 80
                    ? styles.scoreHigh
                    : session.integrityScore >= 60
                    ? styles.scoreMedium
                    : styles.scoreLow;

                return (
                  <div key={session.id} className={`${styles.sessionCard} ${cardClass}`}>
                    <div className={styles.sessionCardHeader}>
                      <div className={styles.studentMeta}>
                        <div className={styles.studentName}>
                          <span>🧑‍🎓</span>
                          <span>{session.studentName}</span>
                          {session.status === "suspended" && (
                            <span className={`${styles.badge} ${styles.badgeDanger}`}>معلق</span>
                          )}
                          {session.status === "flagged" && (
                            <span className={`${styles.badge} ${styles.badgeWarning}`}>مشکوک</span>
                          )}
                          {session.status === "disqualified" && (
                            <span className={`${styles.badge} ${styles.badgeDanger}`}>باطل‌شده</span>
                          )}
                          {session.status === "active" && (
                            <span className={`${styles.badge} ${styles.badgeSuccess}`}>در حال آزمون</span>
                          )}
                        </div>
                        <div className={styles.examTitle}>{session.examTitle}</div>
                      </div>

                      <div className={`${styles.integrityScoreBadge} ${scoreClass}`}>
                        <span>شاخص سلامت:</span>
                        <span>{session.integrityScore}٪</span>
                      </div>
                    </div>

                    <div className={styles.sessionTelemetry}>
                      <div className={styles.telemetryItem}>
                        <span>⏱️ زمان باقیمانده:</span>
                        <span className={styles.telemetryVal}>
                          {Math.floor(session.timeRemainingSeconds / 60)} دقیقه
                        </span>
                      </div>
                      <div className={styles.telemetryItem}>
                        <span>🌐 آدرس IP:</span>
                        <span className={styles.telemetryVal}>{session.ipAddress}</span>
                      </div>
                      <div className={styles.telemetryItem}>
                        <span>💻 دستگاه / مرورگر:</span>
                        <span className={styles.telemetryVal}>{session.userAgent}</span>
                      </div>
                      <div className={styles.telemetryItem}>
                        <span>🚨 تخلفات فعال:</span>
                        <span className={styles.telemetryVal}>
                          {session.violations.filter((v) => !v.isPardoned).length} مورد
                        </span>
                      </div>
                    </div>

                    {session.violations.length > 0 && (
                      <div className={styles.violationsBox}>
                        <div className={styles.violationsTitle}>
                          <span>سیاهه رویدادهای پروکتورینگ:</span>
                          <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                            {session.violations.length} واقعه ثبت‌شده
                          </span>
                        </div>
                        <div className={styles.violationsList}>
                          {session.violations.map((viol) => (
                            <div
                              key={viol.id}
                              className={`${styles.violationRow} ${viol.isPardoned ? styles.violationPardoned : ""}`}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                <span>{viol.isPardoned ? "✅" : "⚠️"}</span>
                                <span>{viol.details}</span>
                              </div>
                              {!viol.isPardoned && session.status !== "disqualified" && (
                                <button
                                  type="button"
                                  className={`${styles.btn} ${styles.btnSm}`}
                                  style={{ background: "#1e293b", padding: "0.15rem 0.4rem" }}
                                  onClick={() => handlePardonViolation(session.id, viol.id)}
                                >
                                  بخشش
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {session.adminNotes && (
                      <div className={styles.adminNotesBadge}>
                        <strong>یادداشت ناظر:</strong> {session.adminNotes}
                      </div>
                    )}

                    <div className={styles.sessionCardActions}>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnWarning} ${styles.btnSm}`}
                        onClick={() => {
                          setWarningModalSession(session);
                          setWarningMessage("لطفاً از صفحه آزمون خارج نشوید؛ در صورت تکرار آزمون معلق خواهد شد.");
                        }}
                      >
                        <span>📢</span>
                        <span>اخطار زنده</span>
                      </button>

                      {session.status === "suspended" ? (
                        <button
                          type="button"
                          className={`${styles.btn} ${styles.btnSuccess} ${styles.btnSm}`}
                          onClick={() => handleResumeSession(session.id)}
                        >
                          <span>▶️</span>
                          <span>رفع تعلیق</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={`${styles.btn} ${styles.btnSm}`}
                          onClick={() => handleSuspendSession(session.id)}
                          disabled={session.status === "disqualified"}
                        >
                          <span>⏸️</span>
                          <span>تعلیق موقت</span>
                        </button>
                      )}

                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnSm}`}
                        onClick={() => {
                          setTimeModalSession(session);
                          setCompensationMinutes(5);
                        }}
                        disabled={session.status === "disqualified"}
                      >
                        <span>⏳</span>
                        <span>وقت جبرانی</span>
                      </button>

                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                        onClick={() => {
                          setInvalidateModalSession(session);
                          setInvalidationReason("نقض مکرر استانداردهای انضباطی آزمون و تقلب سازمان‌یافته");
                        }}
                        disabled={session.status === "disqualified"}
                      >
                        <span>⛔</span>
                        <span>ابطال آزمون (DQ)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 2: AI Grade Audit & Calibration Desk */}
      {activeTab === "ai-grade-audit" && (
        <div>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>
                <span>🤖</span>
                <span>میزکار ممیزی نمرات هوش مصنوعی و کالیبراسیون انسانی (AI Grade Audit)</span>
              </h3>
              <p className={styles.sectionDesc}>
                برگه‌های ارزیابی‌شده توسط LLM با اطمینان پایین یا ناهماهنگی نمرات مهارت‌ها، جهت بازبینی و کالیبراسیون معیارهای ۴گانه آیلتس.
              </p>
            </div>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableResponsive}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>داوطلب و آزمون</th>
                    <th className={styles.th}>مهارت</th>
                    <th className={styles.th}>دلیل تریاژ</th>
                    <th className={styles.th}>ضریب اطمینان مدل</th>
                    <th className={styles.th}>نمرات تفکیکی هوش مصنوعی</th>
                    <th className={styles.th}>وضعیت ممیزی</th>
                    <th className={styles.th}>عملیات اگزمینر</th>
                  </tr>
                </thead>
                <tbody>
                  {aiAudits.map((audit) => (
                    <tr key={audit.id} className={styles.tr}>
                      <td className={styles.td}>
                        <div style={{ fontWeight: 700, color: "#f8fafc" }}>{audit.studentName}</div>
                        <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{audit.examTitle}</div>
                      </td>
                      <td className={styles.td}>
                        <span className={`${styles.badge} ${styles.badgeInfo}`}>
                          {audit.skill === "writing_task1"
                            ? "Writing Task 1"
                            : audit.skill === "writing_task2"
                            ? "Writing Task 2"
                            : "Speaking"}
                        </span>
                      </td>
                      <td className={styles.td}>
                        {audit.triggerReason === "low_confidence" && (
                          <span className={`${styles.badge} ${styles.badgeWarning}`}>اطمینان پایین مدل (&lt;80%)</span>
                        )}
                        {audit.triggerReason === "score_discrepancy" && (
                          <span className={`${styles.badge} ${styles.badgeDanger}`}>ناهماهنگی شدید مهارت‌ها</span>
                        )}
                        {audit.triggerReason === "qa_sampling" && (
                          <span className={`${styles.badge} ${styles.badgeMuted}`}>نمونه‌گیری دوره‌ای QA (۵٪)</span>
                        )}
                      </td>
                      <td className={styles.td}>
                        <span
                          style={{
                            fontWeight: 700,
                            color: audit.aiConfidence >= 80 ? "#34d399" : "#fbbf24",
                          }}
                        >
                          {audit.aiConfidence}٪
                        </span>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.scorePillGroup}>
                          <span className={styles.scorePill}>TR: {audit.aiScores.tr}</span>
                          <span className={styles.scorePill}>CC: {audit.aiScores.cc}</span>
                          <span className={styles.scorePill}>LR: {audit.aiScores.lr}</span>
                          <span className={styles.scorePill}>GRA: {audit.aiScores.gra}</span>
                          <span className={`${styles.scorePill} ${styles.scorePillHighlight}`}>
                            باند: {audit.aiScores.overallBand}
                          </span>
                        </div>
                      </td>
                      <td className={styles.td}>
                        {audit.status === "calibrated" && (
                          <span className={`${styles.badge} ${styles.badgeSuccess}`}>کالیبره‌شده توسط انسان</span>
                        )}
                        {audit.status === "confirmed_original" && (
                          <span className={`${styles.badge} ${styles.badgeInfo}`}>تایید نمره اولیه مدل</span>
                        )}
                        {audit.status === "pending_review" && (
                          <span className={`${styles.badge} ${styles.badgeWarning}`}>در انتظار ممیزی</span>
                        )}
                      </td>
                      <td className={styles.td}>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <button
                            type="button"
                            className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}
                            onClick={() => handleOpenCalibrate(audit)}
                          >
                            <span>✍️</span>
                            <span>کالیبراسیون و بازبینی</span>
                          </button>
                          {audit.status === "pending_review" && (
                            <button
                              type="button"
                              className={`${styles.btn} ${styles.btnSuccess} ${styles.btnSm}`}
                              onClick={() => handleConfirmAiScore(audit.id)}
                            >
                              <span>✓</span>
                              <span>تایید هوش مصنوعی</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Item Psychometrics & Health Studio */}
      {activeTab === "psychometrics" && (
        <div>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>
                <span>📊</span>
                <span>روان‌سنجی، تحلیل آماری و پایش سلامت سوالات آزمون‌ها</span>
              </h3>
              <p className={styles.sectionDesc}>
                محاسبه شاخص‌های استاندارد سنجش (ضریب دشواری p-value، ضریب تمیز r_pb)، ردیابی تله‌های انحرافی و تصحیح عطف‌به‌ماسبق.
              </p>
            </div>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableResponsive}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>سوال و دسته</th>
                    <th className={styles.th}>ضریب دشواری (p-value)</th>
                    <th className={styles.th}>ضریب تمیز (r_pb)</th>
                    <th className={styles.th}>تلاش‌ها / موفقیت</th>
                    <th className={styles.th}>تحلیل گزینه‌های انحرافی (Distractors)</th>
                    <th className={styles.th}>وضعیت سوال</th>
                    <th className={styles.th}>اقدام اصلاحی / جبرانی</th>
                  </tr>
                </thead>
                <tbody>
                  {psychometrics.map((item) => {
                    const isDefective = item.discriminationIndex < 0.2 || item.status === "flagged_defective";
                    const isQuarantined = item.status === "quarantined";
                    const isRegraded = item.status === "regraded_compensated";

                    return (
                      <tr key={item.id} className={styles.tr}>
                        <td className={styles.td} style={{ maxWidth: "240px" }}>
                          <div style={{ fontWeight: 700, color: "#f8fafc" }}>{item.questionTitle}</div>
                          <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                            کد: {item.questionId} | دسته: {item.category}
                          </div>
                          {item.flagReason && (
                            <div
                              style={{
                                fontSize: "0.73rem",
                                color: "#f87171",
                                marginTop: "0.25rem",
                                background: "rgba(239,68,68,0.1)",
                                padding: "0.2rem 0.4rem",
                                borderRadius: "4px",
                              }}
                            >
                              ⚠️ {item.flagReason}
                            </div>
                          )}
                        </td>
                        <td className={styles.td}>
                          <div style={{ fontWeight: 700 }}>
                            {(item.difficultyIndex * 100).toFixed(0)}٪
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                            {item.difficultyIndex < 0.25
                              ? "خیلی دشوار"
                              : item.difficultyIndex > 0.85
                              ? "خیلی آسان"
                              : "استاندارد"}
                          </div>
                        </td>
                        <td className={styles.td}>
                          <span
                            className={`${styles.badge} ${
                              item.discriminationIndex >= 0.35
                                ? styles.badgeSuccess
                                : item.discriminationIndex > 0
                                ? styles.badgeWarning
                                : styles.badgeDanger
                            }`}
                          >
                            {item.discriminationIndex > 0 ? "+" : ""}
                            {item.discriminationIndex.toFixed(2)}
                          </span>
                        </td>
                        <td className={styles.td}>
                          <div>{item.totalAttempts} شرکت‌کننده</div>
                          <div style={{ fontSize: "0.72rem", color: "#34d399" }}>
                            {item.correctAnswers} پاسخ صحیح
                          </div>
                        </td>
                        <td className={styles.td}>
                          <div className={styles.distractorList}>
                            {item.distractorAnalysis.map((d, idx) => (
                              <div key={idx} className={styles.distractorRow}>
                                <span style={{ width: "20px", fontWeight: 700 }}>{d.option}:</span>
                                <div className={styles.distractorBarBg}>
                                  <div
                                    className={`${styles.distractorBarFill} ${
                                      d.isCorrect
                                        ? styles.distractorCorrectFill
                                        : d.isTopPerformerTrap
                                        ? styles.distractorTrapFill
                                        : ""
                                    }`}
                                    style={{ width: `${d.selectionRate * 100}%` }}
                                  />
                                </div>
                                <span style={{ fontSize: "0.7rem", color: "#94a3b8", minWidth: "35px" }}>
                                  {(d.selectionRate * 100).toFixed(0)}٪
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className={styles.td}>
                          {isRegraded && (
                            <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                              تصحیح عطف‌به‌ماسبق‌شده
                            </span>
                          )}
                          {isQuarantined && (
                            <span className={`${styles.badge} ${styles.badgeDanger}`}>در قرنطینه</span>
                          )}
                          {!isQuarantined && !isRegraded && isDefective && (
                            <span className={`${styles.badge} ${styles.badgeWarning}`}>مشکوک به عیب</span>
                          )}
                          {!isQuarantined && !isRegraded && !isDefective && (
                            <span className={`${styles.badge} ${styles.badgeSuccess}`}>سالم و فعال</span>
                          )}
                        </td>
                        <td className={styles.td}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                            {isQuarantined ? (
                              <button
                                type="button"
                                className={`${styles.btn} ${styles.btnSuccess} ${styles.btnSm}`}
                                onClick={() => handleActivateItem(item.id)}
                              >
                                <span>🔓</span>
                                <span>خروج از قرنطینه</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                                onClick={() => {
                                  setQuarantineModalItem(item);
                                  setQuarantineReason(item.flagReason || "ضریب تمیز منفی و خطای گزینه‌های انحرافی");
                                }}
                              >
                                <span>☣️</span>
                                <span>قرنطینه سوال</span>
                              </button>
                            )}

                            {isDefective && !isRegraded && (
                              <button
                                type="button"
                                className={`${styles.btn} ${styles.btnWarning} ${styles.btnSm}`}
                                onClick={() => handleRegradeQuestion(item.id)}
                              >
                                <span>⚖️</span>
                                <span>تصحیح عطف‌به‌ماسبق</span>
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
          </div>
        </div>
      )}

      {/* TAB 4: Grade Appeals / EOR Desk */}
      {activeTab === "grade-appeals" && (
        <div>
          <div className={styles.sectionHeader}>
            <div>
              <h3 className={styles.sectionTitle}>
                <span>⚖️</span>
                <span>میز داوری اعتراضات به نمره آزمون‌های رسمی و ماک (Grade Appeals / EOR)</span>
              </h3>
              <p className={styles.sectionDesc}>
                بررسی دادخواست‌های تجدیدنظر داوطلبان، ممیزی بی‌طرفانه اگزمینر ارشد، تغییر کارنامه و صدور عودت وجه کارمزد اعتراض.
              </p>
            </div>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableResponsive}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>داوطلب و آزمون</th>
                    <th className={styles.th}>مهارت مورد اعتراض</th>
                    <th className={styles.th}>نمره اولیه</th>
                    <th className={styles.th}>شرح اعتراض داوطلب</th>
                    <th className={styles.th}>کارمزد ودیعه</th>
                    <th className={styles.th}>وضعیت پرونده</th>
                    <th className={styles.th}>عملیات داوری</th>
                  </tr>
                </thead>
                <tbody>
                  {appeals.map((appeal) => (
                    <tr key={appeal.id} className={styles.tr}>
                      <td className={styles.td}>
                        <div style={{ fontWeight: 700, color: "#f8fafc" }}>{appeal.studentName}</div>
                        <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{appeal.examTitle}</div>
                      </td>
                      <td className={styles.td}>
                        <span className={`${styles.badge} ${styles.badgeInfo}`}>{appeal.skill}</span>
                      </td>
                      <td className={styles.td}>
                        <span style={{ fontWeight: 700, fontSize: "1rem", color: "#f87171" }}>
                          باند {appeal.originalBand}
                        </span>
                      </td>
                      <td className={styles.td} style={{ maxWidth: "260px" }}>
                        <div style={{ fontSize: "0.78rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                          &quot;{appeal.studentStatement}&quot;
                        </div>
                        {appeal.decisionNotes && (
                          <div
                            style={{
                              fontSize: "0.74rem",
                              color: "#34d399",
                              marginTop: "0.25rem",
                              background: "rgba(16,185,129,0.1)",
                              padding: "0.2rem 0.4rem",
                              borderRadius: "4px",
                            }}
                          >
                            <strong>رای داور:</strong> {appeal.decisionNotes}
                          </div>
                        )}
                      </td>
                      <td className={styles.td}>
                        <div>{appeal.appealFeePaid.toLocaleString("fa-IR")} تومان</div>
                        {appeal.refundIssued && (
                          <div style={{ fontSize: "0.72rem", color: "#34d399" }}>✓ مسترد شد</div>
                        )}
                      </td>
                      <td className={styles.td}>
                        {appeal.status === "upgraded" && (
                          <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                            پذیرفته‌شده (باند {appeal.revisedBand})
                          </span>
                        )}
                        {appeal.status === "rejected" && (
                          <span className={`${styles.badge} ${styles.badgeDanger}`}>رد اعتراض</span>
                        )}
                        {appeal.status === "under_investigation" && (
                          <span className={`${styles.badge} ${styles.badgeWarning}`}>در حال بررسی</span>
                        )}
                      </td>
                      <td className={styles.td}>
                        {appeal.status === "under_investigation" ? (
                          <button
                            type="button"
                            className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}
                            onClick={() => handleOpenAdjudicate(appeal)}
                          >
                            <span>⚖️</span>
                            <span>داوری و صدور رای</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>پرونده مختومه</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Send Live Warning */}
      {warningModalSession && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h4 className={styles.modalTitle}>
                <span>📢</span>
                <span>ارسال اخطار زنده به داوطلب ({warningModalSession.studentName})</span>
              </h4>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setWarningModalSession(null)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>
                این پیام به صورت هشدار صوتی و پیام پاپ‌آپ فوری در صفحه مرورگر داوطلب به نمایش درخواهد آمد.
              </p>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>متن پیام اخطار رسمی:</label>
                <textarea
                  className={styles.formTextarea}
                  value={warningMessage}
                  onChange={(e) => setWarningMessage(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.btn}
                onClick={() => setWarningModalSession(null)}
              >
                انصراف
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnWarning}`}
                onClick={handleSendWarning}
              >
                ارسال فوری اخطار
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Grant Compensation Time */}
      {timeModalSession && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h4 className={styles.modalTitle}>
                <span>⏳</span>
                <span>اعطای وقت جبرانی به داوطلب ({timeModalSession.studentName})</span>
              </h4>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setTimeModalSession(null)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>
                در صورت بروز مشکلات فنی اینترنت یا تاخیر غیرعمدی، زمان تعیین‌شده بلافاصله به تایمر آزمون افزوده می‌شود.
              </p>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>دقایق اضافه:</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  className={styles.formInput}
                  value={compensationMinutes}
                  onChange={(e) => setCompensationMinutes(Number(e.target.value))}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.btn}
                onClick={() => setTimeModalSession(null)}
              >
                انصراف
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSuccess}`}
                onClick={handleGrantTime}
              >
                افزودن زمان به تایمر
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Invalidate Session (DQ) */}
      {invalidateModalSession && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h4 className={styles.modalTitle}>
                <span>⛔</span>
                <span>ابطال قطعی آزمون و رد انضباطی ({invalidateModalSession.studentName})</span>
              </h4>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setInvalidateModalSession(null)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#f87171" }}>
                هشدار: این عملیات آزمون را بلافاصله قطع کرده، نمره صفر را ثبت نموده و داوطلب را از آزمون خارج می‌کند.
              </p>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>علت و مستندات ابطال آزمون:</label>
                <textarea
                  className={styles.formTextarea}
                  value={invalidationReason}
                  onChange={(e) => setInvalidationReason(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.btn}
                onClick={() => setInvalidateModalSession(null)}
              >
                انصراف
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnDanger}`}
                onClick={handleInvalidateSession}
              >
                ابطال قطعی و ثبت نمره صفر
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: AI Score Calibration */}
      {calibratingAudit && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox} style={{ maxWidth: "750px" }}>
            <div className={styles.modalHeader}>
              <h4 className={styles.modalTitle}>
                <span>✍️</span>
                <span>کالیبراسیون تخصصی اگزمینر ({calibratingAudit.studentName})</span>
              </h4>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setCalibratingAudit(null)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              {calibratingAudit.studentSubmissionText && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>متن ارسالی داوطلب:</label>
                  <div
                    style={{
                      background: "#111c30",
                      padding: "0.85rem",
                      borderRadius: "8px",
                      fontSize: "0.84rem",
                      lineHeight: 1.6,
                      color: "#e2e8f0",
                      maxHeight: "150px",
                      overflowY: "auto",
                      direction: "ltr",
                      fontFamily: "monospace",
                    }}
                  >
                    {calibratingAudit.studentSubmissionText}
                  </div>
                </div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>نمرات تفکیکی معیارهای ۴گانه آیلتس:</label>
                <div className={styles.criteriaGrid}>
                  <div>
                    <label style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                      Task Achievement (TR): {calibratedScores.tr}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="9"
                      step="0.5"
                      style={{ width: "100%" }}
                      value={calibratedScores.tr}
                      onChange={(e) => {
                        const tr = Number(e.target.value);
                        const band = Number(
                          ((tr + calibratedScores.cc + calibratedScores.lr + calibratedScores.gra) / 4).toFixed(1)
                        );
                        setCalibratedScores({ ...calibratedScores, tr, overallBand: band });
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                      Coherence & Cohesion (CC): {calibratedScores.cc}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="9"
                      step="0.5"
                      style={{ width: "100%" }}
                      value={calibratedScores.cc}
                      onChange={(e) => {
                        const cc = Number(e.target.value);
                        const band = Number(
                          ((calibratedScores.tr + cc + calibratedScores.lr + calibratedScores.gra) / 4).toFixed(1)
                        );
                        setCalibratedScores({ ...calibratedScores, cc, overallBand: band });
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                      Lexical Resource (LR): {calibratedScores.lr}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="9"
                      step="0.5"
                      style={{ width: "100%" }}
                      value={calibratedScores.lr}
                      onChange={(e) => {
                        const lr = Number(e.target.value);
                        const band = Number(
                          ((calibratedScores.tr + calibratedScores.cc + lr + calibratedScores.gra) / 4).toFixed(1)
                        );
                        setCalibratedScores({ ...calibratedScores, lr, overallBand: band });
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                      Grammar & Accuracy (GRA): {calibratedScores.gra}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="9"
                      step="0.5"
                      style={{ width: "100%" }}
                      value={calibratedScores.gra}
                      onChange={(e) => {
                        const gra = Number(e.target.value);
                        const band = Number(
                          ((calibratedScores.tr + calibratedScores.cc + calibratedScores.lr + gra) / 4).toFixed(1)
                        );
                        setCalibratedScores({ ...calibratedScores, gra, overallBand: band });
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "0.5rem",
                    padding: "0.5rem 0.85rem",
                    background: "#064e3b",
                    borderRadius: "6px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", color: "#a7f3d0" }}>باند نهایی محاسبه‌شده اگزمینر:</span>
                  <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#ffffff" }}>
                    باند {calibratedScores.overallBand}
                  </span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>توضیحات و بازخورد اگزمینر جهت درج در کارنامه:</label>
                <textarea
                  className={styles.formTextarea}
                  value={examinerFeedback}
                  onChange={(e) => setExaminerFeedback(e.target.value)}
                  placeholder="نکات قوت، علت کسر نمره یا خطاهای کلیدی داوطلب..."
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.btn}
                onClick={() => setCalibratingAudit(null)}
              >
                انصراف
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={handleSaveCalibration}
              >
                ثبت و کالیبراسیون نمره نهایی
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Quarantine Item */}
      {quarantineModalItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h4 className={styles.modalTitle}>
                <span>☣️</span>
                <span>قرنطینه و خروج سوال از آزمون‌ها ({quarantineModalItem.questionTitle})</span>
              </h4>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setQuarantineModalItem(null)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#f87171" }}>
                این سوال بلافاصله از بانک سوالات فعال خارج می‌شود و در آزمون‌های آینده به زبان‌آموزان داده نخواهد شد.
              </p>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>دلیل قرنطینه سوال:</label>
                <textarea
                  className={styles.formTextarea}
                  value={quarantineReason}
                  onChange={(e) => setQuarantineReason(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.btn}
                onClick={() => setQuarantineModalItem(null)}
              >
                انصراف
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnDanger}`}
                onClick={handleQuarantineItem}
              >
                تایید انتقال به قرنطینه
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: Adjudicate Appeal */}
      {adjudicatingAppeal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h4 className={styles.modalTitle}>
                <span>⚖️</span>
                <span>داوری پرونده اعتراض به نمره ({adjudicatingAppeal.studentName})</span>
              </h4>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setAdjudicatingAppeal(null)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div style={{ background: "#111c30", padding: "0.75rem", borderRadius: "8px", fontSize: "0.82rem" }}>
                <div><strong>آزمون:</strong> {adjudicatingAppeal.examTitle}</div>
                <div><strong>مهارت:</strong> {adjudicatingAppeal.skill}</div>
                <div><strong>نمره اولیه:</strong> باند {adjudicatingAppeal.originalBand}</div>
                <div><strong>شرح داوطلب:</strong> &quot;{adjudicatingAppeal.studentStatement}&quot;</div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>رای نهایی شورای داوری:</label>
                <select
                  className={styles.formSelect}
                  value={appealDecision}
                  onChange={(e) => setAppealDecision(e.target.value as "upgraded" | "rejected")}
                >
                  <option value="upgraded">تایید اعتراض و ارتقای نمره</option>
                  <option value="rejected">رد اعتراض و ابقای نمره قبلی</option>
                </select>
              </div>

              {appealDecision === "upgraded" && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>نمره جدید پس از بازبینی (باند آیلتس):</label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="9"
                      className={styles.formInput}
                      value={revisedBand}
                      onChange={(e) => setRevisedBand(Number(e.target.value))}
                    />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <input
                      type="checkbox"
                      id="refundFeeCheck"
                      checked={refundFee}
                      onChange={(e) => setRefundFee(e.target.checked)}
                    />
                    <label htmlFor="refundFeeCheck" style={{ fontSize: "0.82rem", color: "#e2e8f0" }}>
                      عودت خودکار کارمزد اعتراض ({adjudicatingAppeal.appealFeePaid.toLocaleString("fa-IR")} تومان) به کیف‌پول داوطلب
                    </label>
                  </div>
                </>
              )}

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>توضیحات رای داوری:</label>
                <textarea
                  className={styles.formTextarea}
                  value={appealNotes}
                  onChange={(e) => setAppealNotes(e.target.value)}
                  placeholder="مستندات اگزمینر ارشد برای تغییر نمره یا رد اعتراض..."
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.btn}
                onClick={() => setAdjudicatingAppeal(null)}
              >
                انصراف
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={handleSaveAppeal}
              >
                ابلاغ رای نهایی و ثبت در کارنامه
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

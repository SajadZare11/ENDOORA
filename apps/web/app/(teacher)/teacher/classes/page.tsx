"use client";

import React, { useState, useEffect, useId } from "react";
import Link from "next/link";
import styles from "./classes.module.css";
import { useTeacherHome } from "../../../../components/teacher/TeacherShell";
import {
  fetchTeacherClasses,
  fetchTeacherClassDetail,
  createTeacherClass,
  inviteLearnerToClass,
  fetchLearnerOverview,
  terminateLearnerLink,
  scheduleClassSession,
  completeClassSession,
  fetchTeachingHoursSummary,
  adjustTeachingHours,
  type TeacherClass,
  type TeacherLearnerLink,
  type ClassSession,
  type TeachingHoursSummary,
  type TeachingHourLedger,
  type LearnerOverview,
} from "../../../../lib/teacher-classes";

type TabKey = "classes" | "sessions" | "hours";

export default function TeacherClassesPage() {
  const { locale } = useTeacherHome();
  const isFa = locale === "fa";

  const [activeTab, setActiveTab] = useState<TabKey>("classes");
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedClassDetail, setSelectedClassDetail] = useState<{
    class: TeacherClass;
    enrollments: TeacherLearnerLink[];
    sessions: ClassSession[];
  } | null>(null);

  const [hoursSummary, setHoursSummary] = useState<TeachingHoursSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals state
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [selectedLearnerOverview, setSelectedLearnerOverview] = useState<LearnerOverview | null>(null);

  // Form states
  const [newClassTitle, setNewClassTitle] = useState("");
  const [newClassSubject, setNewClassSubject] = useState("");
  const [newClassLevel, setNewClassLevel] = useState("B1");
  const [newClassCapacity, setNewClassCapacity] = useState(5);
  const [newClassObjectives, setNewClassObjectives] = useState("");
  const [newClassNotes, setNewClassNotes] = useState("");

  const [inviteEmail, setInviteEmail] = useState("");
  const [generatedInviteCode, setGeneratedInviteCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionStart, setSessionStart] = useState("");
  const [sessionEnd, setSessionEnd] = useState("");
  const [sessionDuration, setSessionDuration] = useState(60);
  const [sessionLearnerId, setSessionLearnerId] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");

  const [selectedLedgerForAdjust, setSelectedLedgerForAdjust] = useState<TeachingHourLedger | null>(null);
  const [adjustNewHours, setAdjustNewHours] = useState("");
  const [adjustReason, setAdjustReason] = useState("");

  const [linkToTerminate, setLinkToTerminate] = useState<TeacherLearnerLink | null>(null);
  const [terminateReason, setTerminateReason] = useState("");

  const [completingSessionId, setCompletingSessionId] = useState<string | null>(null);

  const newClassTitleId = useId();
  const newClassSubjectId = useId();
  const newClassLevelId = useId();
  const newClassCapacityId = useId();
  const newClassObjectivesId = useId();
  const newClassNotesId = useId();
  const inviteEmailId = useId();
  const sessionTitleId = useId();
  const sessionStartId = useId();
  const sessionEndId = useId();
  const sessionDurationId = useId();
  const sessionLearnerIdField = useId();
  const sessionNotesId = useId();
  const adjustHoursId = useId();
  const adjustReasonId = useId();
  const terminateReasonId = useId();

  // Load Classes helper for mutations
  const loadClasses = async () => {
    try {
      setErrorMsg(null);
      const data = await fetchTeacherClasses();
      setClasses(data);
      if (data.length > 0 && !selectedClassId) {
        setSelectedClassId(data[0].id);
      }
    } catch {
      setErrorMsg(isFa ? "خطا در بارگیری کلاس‌ها" : "Failed to load classes.");
    } finally {
      setLoading(false);
    }
  };

  // Load selected class details helper for mutations
  const loadClassDetail = async (id: string) => {
    try {
      const detail = await fetchTeacherClassDetail(id);
      setSelectedClassDetail(detail);
    } catch {
      // fallback
    }
  };

  // Load Hours Summary helper for mutations
  const loadHours = async () => {
    try {
      const data = await fetchTeachingHoursSummary();
      setHoursSummary(data);
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchTeacherClasses(), fetchTeachingHoursSummary()])
      .then(([classesData, hoursData]) => {
        if (!cancelled) {
          setClasses(classesData);
          setHoursSummary(hoursData);
          if (classesData.length > 0) {
            setSelectedClassId(classesData[0].id);
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setErrorMsg(isFa ? "خطا در بارگیری اطلاعات" : "Failed to load information.");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [isFa]);

  useEffect(() => {
    if (!selectedClassId) return;
    let cancelled = false;
    fetchTeacherClassDetail(selectedClassId)
      .then((detail) => {
        if (!cancelled) {
          setSelectedClassDetail(detail);
        }
      })
      .catch(() => {
        // fallback
      });
    return () => {
      cancelled = true;
    };
  }, [selectedClassId]);


  // Handlers
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassTitle || !newClassSubject) return;
    try {
      const objectives = newClassObjectives
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const created = await createTeacherClass({
        title: newClassTitle,
        subject: newClassSubject,
        level: newClassLevel,
        max_capacity: Number(newClassCapacity),
        objectives,
        private_notes: newClassNotes,
      });

      setShowCreateClassModal(false);
      setNewClassTitle("");
      setNewClassSubject("");
      setNewClassObjectives("");
      setNewClassNotes("");
      await loadClasses();
      setSelectedClassId(created.id);
    } catch {
      alert(isFa ? "خطا در ایجاد کلاس" : "Error creating class.");
    }
  };

  const handleInviteLearner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId || !inviteEmail) return;
    try {
      const link = await inviteLearnerToClass(selectedClassId, { learner_email: inviteEmail.trim() });
      setGeneratedInviteCode(link.invite_code);
      await loadClassDetail(selectedClassId);
      await loadClasses();
    } catch {
      alert(isFa ? "کاربر زبان‌آموز یافت نشد یا دعوت ناموفق بود." : "Learner not found or invitation failed.");
    }
  };

  const handleScheduleSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId || !sessionTitle || !sessionStart || !sessionEnd) return;
    try {
      await scheduleClassSession(selectedClassId, {
        title: sessionTitle,
        scheduled_start: new Date(sessionStart).toISOString(),
        scheduled_end: new Date(sessionEnd).toISOString(),
        duration_minutes: Number(sessionDuration),
        learner_id: sessionLearnerId || undefined,
        session_notes: sessionNotes,
      });
      setShowScheduleModal(false);
      setSessionTitle("");
      setSessionStart("");
      setSessionEnd("");
      setSessionNotes("");
      await loadClassDetail(selectedClassId);
      await loadClasses();
    } catch {
      alert(isFa ? "خطا در زمان‌بندی جلسه" : "Failed to schedule session.");
    }
  };

  const handleCompleteSession = async (sessionId: string) => {
    try {
      setCompletingSessionId(sessionId);
      await completeClassSession(sessionId, "Session completed as scheduled.", true);
      if (selectedClassId) {
        await loadClassDetail(selectedClassId);
      }
      await loadHours();
      await loadClasses();
    } catch {
      alert(isFa ? "خطا در ثبت پایان جلسه" : "Failed to complete session.");
    } finally {
      setCompletingSessionId(null);
    }
  };

  const handleOpenLearnerOverview = async (learnerId: string) => {
    try {
      const overview = await fetchLearnerOverview(learnerId, selectedClassId || undefined);
      setSelectedLearnerOverview(overview);
    } catch {
      alert(
        isFa
          ? "امکان دسترسی به اطلاعات این زبان‌آموز وجود ندارد یا رضایت فعال نیست."
          : "Access denied. Relationship is unlinked or pending consent."
      );
    }
  };

  const handleTerminateRelationship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkToTerminate) return;
    try {
      await terminateLearnerLink(linkToTerminate.id, terminateReason);
      setShowTerminateModal(false);
      setLinkToTerminate(null);
      setTerminateReason("");
      if (selectedClassId) {
        await loadClassDetail(selectedClassId);
      }
      await loadClasses();
    } catch {
      alert(isFa ? "خطا در خاتمه ارتباط" : "Failed to terminate link.");
    }
  };

  const handleAdjustHours = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLedgerForAdjust || !adjustNewHours || !adjustReason) return;
    try {
      await adjustTeachingHours(selectedLedgerForAdjust.id, parseFloat(adjustNewHours), adjustReason);
      setShowAdjustModal(false);
      setSelectedLedgerForAdjust(null);
      setAdjustNewHours("");
      setAdjustReason("");
      await loadHours();
    } catch {
      alert(
        isFa
          ? "ثبت تغییر ساعت نیازمند دلیل معتبر (حداقل ۵ کاراکتر) است."
          : "Adjustment requires a valid mandatory reason (min 5 characters)."
      );
    }
  };

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  return (
    <div className={styles.container} dir={isFa ? "rtl" : "ltr"}>
      {/* Header Card */}
      <section className={styles.headerCard}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>
              {isFa ? "کلاس‌ها، زبان‌آموزان و ساعات تدریس" : "Classes, Learners & Teaching Hours"}
            </h1>
            <p className={styles.description}>
              {isFa
                ? "مدیریت کلاس‌های اختصاصی، پیوند امن زبان‌آموزان با رضایت صریح، برنامه‌ریزی جلسات و دفتر ساعات تدریس حسابرسی‌شده."
                : "Manage private classes, secure learner relationships with explicit consent, schedule sessions, and audited teaching-hours ledger."}
            </p>
          </div>
          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
            <Link
              href="/teacher/gradebook"
              className={styles.actionButtonSecondary}
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}
            >
              {isFa ? "دفتر نمرات 📊" : "Gradebook 📊"}
            </Link>
            <Link
              href="/teacher/grading"
              className={styles.actionButtonSecondary}
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}
            >
              {isFa ? "تصحیح تکالیف ✍️" : "Grading Studio ✍️"}
            </Link>
            <Link
              href="/teacher/assignments"
              className={styles.actionButtonSecondary}
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}
            >
              {isFa ? "تکالیف و آزمون‌ها" : "Assignments Hub"}
            </Link>
            <button
              type="button"
              className={styles.actionButton}
              onClick={() => setShowCreateClassModal(true)}
            >
              {isFa ? "+ ایجاد کلاس جدید" : "+ Create New Class"}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabBar} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "classes"}
            data-active={activeTab === "classes"}
            className={styles.tabButton}
            onClick={() => setActiveTab("classes")}
          >
            {isFa ? "کلاس‌ها و زبان‌آموزان" : "Classes & Learners"}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "sessions"}
            data-active={activeTab === "sessions"}
            className={styles.tabButton}
            onClick={() => setActiveTab("sessions")}
          >
            {isFa ? "جلسات آموزشی" : "Sessions & Schedule"}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "hours"}
            data-active={activeTab === "hours"}
            className={styles.tabButton}
            onClick={() => setActiveTab("hours")}
          >
            {isFa ? "دفتر ساعات تدریس و حسابرسی" : "Teaching Hours & Audit"}
          </button>
        </div>
      </section>

      {errorMsg ? (
        <div className={styles.warningNotice} role="alert">
          {errorMsg}
        </div>
      ) : null}

      {/* TAB 1: CLASSES & LEARNERS */}
      {activeTab === "classes" ? (
        <section aria-label={isFa ? "بخش کلاس‌ها" : "Classes Section"}>
          {classes.length === 0 && !loading ? (
            <div className={styles.emptyState}>
              <p>{isFa ? "هنوز کلاسی ایجاد نکرده‌اید." : "No classes created yet."}</p>
              <button
                type="button"
                className={styles.actionButton}
                onClick={() => setShowCreateClassModal(true)}
                style={{ marginBlockStart: "var(--space-3)" }}
              >
                {isFa ? "اولین کلاس خود را ایجاد کنید" : "Create Your First Class"}
              </button>
            </div>
          ) : (
            <div className={styles.classGrid}>
              {classes.map((cls) => (
                <article
                  key={cls.id}
                  className={styles.classCard}
                  data-selected={cls.id === selectedClassId}
                  onClick={() => setSelectedClassId(cls.id)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedClassId(cls.id);
                    }
                  }}
                >
                  <div className={styles.classCardHeader}>
                    <h2 className={styles.classCardTitle}>{cls.title}</h2>
                    <span className={`${styles.badge} ${styles.badgeLevel}`}>{cls.level}</span>
                  </div>
                  <p style={{ margin: 0, color: "var(--color-muted)", fontSize: "var(--font-size-meta)" }}>
                    {cls.subject}
                  </p>
                  <div className={styles.classMeta}>
                    <span>
                      {isFa
                        ? `${cls.enrolled_students_count} از ${cls.max_capacity} زبان‌آموز`
                        : `${cls.enrolled_students_count} / ${cls.max_capacity} Learners`}
                    </span>
                    <span>
                      {isFa ? `${cls.sessions_count} جلسه` : `${cls.sessions_count} Sessions`}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Selected Class Detail & Roster */}
          {selectedClass ? (
            <section className={styles.detailCard}>
              <div className={styles.detailHeader}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "var(--font-size-title)", fontWeight: 700 }}>
                    {selectedClass.title}
                  </h2>
                  <p style={{ margin: "var(--space-1) 0 0 0", color: "var(--color-muted)", fontSize: "var(--font-size-meta)" }}>
                    {selectedClass.description || (isFa ? "بدون توضیحات تکمیلی" : "No additional description.")}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                  <Link
                    href="/teacher/assignments/new"
                    className={styles.actionButtonSecondary}
                    style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}
                  >
                    {isFa ? "+ ساخت تکلیف" : "+ Create Assignment"}
                  </Link>
                  <button
                    type="button"
                    className={styles.actionButtonSecondary}
                    onClick={() => {
                      setGeneratedInviteCode(null);
                      setInviteEmail("");
                      setShowInviteModal(true);
                    }}
                  >
                    {isFa ? "+ دعوت زبان‌آموز جدید" : "+ Invite New Learner"}
                  </button>
                </div>
              </div>

              {selectedClass.objectives && selectedClass.objectives.length > 0 ? (
                <div>
                  <strong style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text)" }}>
                    {isFa ? "اهداف آموزشی:" : "Curricular Objectives:"}
                  </strong>
                  <ul style={{ margin: "var(--space-2) 0 0 0", paddingInlineStart: "var(--space-5)", color: "var(--color-muted)", fontSize: "var(--font-size-meta)" }}>
                    {selectedClass.objectives.map((obj, idx) => (
                      <li key={idx}>{obj}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* Roster Table */}
              <h3 style={{ margin: "var(--space-4) 0 var(--space-2) 0", fontSize: "var(--font-size-body)", fontWeight: 700 }}>
                {isFa ? "فهرست زبان‌آموزان و وضعیت رضایت" : "Learner Roster & Consent Status"}
              </h3>

              {!selectedClassDetail || selectedClassDetail.enrollments.length === 0 ? (
                <p style={{ color: "var(--color-muted)", fontSize: "var(--font-size-meta)", margin: 0 }}>
                  {isFa
                    ? "هنوز هیچ زبان‌آموزی به این کلاس افزوده نشده است. از دکمه «دعوت زبان‌آموز» استفاده کنید."
                    : "No learners added yet. Use the 'Invite Learner' button above."}
                </p>
              ) : (
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <caption className={styles.srOnly}>
                      {isFa ? "جدول زبان‌آموزان کلاس" : "Class Learners Table"}
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">{isFa ? "ایمیل زبان‌آموز" : "Learner Email"}</th>
                        <th scope="col">{isFa ? "وضعیت پیوند" : "Link Status"}</th>
                        <th scope="col">{isFa ? "زمان اعطای رضایت" : "Consent Date"}</th>
                        <th scope="col">{isFa ? "عملیات" : "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedClassDetail.enrollments.map((enr) => (
                        <tr key={enr.id}>
                          <td>{enr.learner_email}</td>
                          <td>
                            {enr.status === "active" ? (
                              <span className={`${styles.badge} ${styles.badgeActive}`}>
                                {isFa ? "فعال و تاییدشده" : "Active & Consented"}
                              </span>
                            ) : enr.status === "pending_consent" ? (
                              <span className={`${styles.badge} ${styles.badgePending}`}>
                                {isFa ? "در انتظار رضایت" : "Pending Consent"}
                              </span>
                            ) : (
                              <span className={`${styles.badge} ${styles.badgeTerminated}`}>
                                {isFa ? "خاتمه یافته" : "Terminated"}
                              </span>
                            )}
                          </td>
                          <td>
                            {enr.consent_given_at
                              ? new Date(enr.consent_given_at).toLocaleDateString(isFa ? "fa-IR" : "en-US")
                              : isFa
                              ? "ثبت نشده"
                              : "Not recorded"}
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: "var(--space-2)" }}>
                              {enr.status === "active" ? (
                                <button
                                  type="button"
                                  className={styles.actionButtonSecondary}
                                  onClick={() => handleOpenLearnerOverview(enr.learner)}
                                >
                                  {isFa ? "پرونده آموزشی" : "Educational Summary"}
                                </button>
                              ) : null}
                              {enr.status !== "terminated" ? (
                                <button
                                  type="button"
                                  className={styles.actionButtonDanger}
                                  onClick={() => {
                                    setLinkToTerminate(enr);
                                    setShowTerminateModal(true);
                                  }}
                                >
                                  {isFa ? "خاتمه ارتباط" : "Terminate"}
                                </button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ) : null}
        </section>
      ) : null}

      {/* TAB 2: SESSIONS & SCHEDULE */}
      {activeTab === "sessions" ? (
        <section aria-label={isFa ? "بخش جلسات" : "Sessions Section"}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlockEnd: "var(--space-4)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--font-size-title)", fontWeight: 700 }}>
              {isFa ? "جلسات کلاسی" : "Class Sessions"}
            </h2>
            <button
              type="button"
              className={styles.actionButton}
              onClick={() => setShowScheduleModal(true)}
              disabled={!selectedClassId}
            >
              {isFa ? "+ برنامه‌ریزی جلسه جدید" : "+ Schedule New Session"}
            </button>
          </div>

          {!selectedClassDetail || selectedClassDetail.sessions.length === 0 ? (
            <div className={styles.emptyState}>
              <p>{isFa ? "جلسه‌ای برای این کلاس ثبت نشده است." : "No sessions scheduled for this class."}</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <caption className={styles.srOnly}>
                  {isFa ? "جدول جلسات آموزشی" : "Educational Sessions Table"}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">{isFa ? "عنوان جلسه" : "Session Title"}</th>
                    <th scope="col">{isFa ? "زبان‌آموز" : "Learner"}</th>
                    <th scope="col">{isFa ? "زمان شروع" : "Start Time"}</th>
                    <th scope="col">{isFa ? "مدت زمان" : "Duration"}</th>
                    <th scope="col">{isFa ? "وضعیت" : "Status"}</th>
                    <th scope="col">{isFa ? "عملیات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedClassDetail.sessions.map((sess) => (
                    <tr key={sess.id}>
                      <td>
                        <strong>{sess.title}</strong>
                        {sess.session_notes ? (
                          <div style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>
                            {sess.session_notes}
                          </div>
                        ) : null}
                      </td>
                      <td>{sess.learner_email || (isFa ? "عمومی / کل کلاس" : "All Cohort")}</td>
                      <td>{new Date(sess.scheduled_start).toLocaleString(isFa ? "fa-IR" : "en-US")}</td>
                      <td>{isFa ? `${sess.duration_minutes} دقیقه` : `${sess.duration_minutes} mins`}</td>
                      <td>
                        {sess.status === "completed" ? (
                          <span className={`${styles.badge} ${styles.badgeActive}`}>
                            {isFa ? "برگزار شده" : "Completed"}
                          </span>
                        ) : sess.status === "scheduled" ? (
                          <span className={`${styles.badge} ${styles.badgePending}`}>
                            {isFa ? "برنامه‌ریزی شده" : "Scheduled"}
                          </span>
                        ) : (
                          <span className={`${styles.badge} ${styles.badgeTerminated}`}>
                            {isFa ? "لغو شده" : "Cancelled"}
                          </span>
                        )}
                      </td>
                      <td>
                        {sess.status === "scheduled" ? (
                          <button
                            type="button"
                            className={styles.actionButtonSecondary}
                            onClick={() => handleCompleteSession(sess.id)}
                            disabled={completingSessionId === sess.id}
                          >
                            {completingSessionId === sess.id
                              ? isFa
                                ? "در حال ثبت…"
                                : "Recording…"
                              : isFa
                              ? "ثبت برگزاری جلسه"
                              : "Complete Session"}
                          </button>
                        ) : sess.status === "completed" ? (
                          <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-success-text)" }}>
                            {isFa ? "ساعت ثبت شد ✓" : "Hours Recorded ✓"}
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : null}

      {/* TAB 3: TEACHING HOURS & AUDIT */}
      {activeTab === "hours" ? (
        <section aria-label={isFa ? "بخش ساعات تدریس" : "Teaching Hours Section"}>
          {/* Summary Stat Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>{isFa ? "مجموع ساعات تدریس" : "Total Teaching Hours"}</span>
              <strong className={styles.statValue}>
                {hoursSummary ? hoursSummary.total_hours.toFixed(2) : "0.00"}
              </strong>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>{isFa ? "ساعات تایید شده" : "Confirmed Hours"}</span>
              <strong className={styles.statValue} style={{ color: "var(--color-success-text)" }}>
                {hoursSummary ? hoursSummary.confirmed_hours.toFixed(2) : "0.00"}
              </strong>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>{isFa ? "در انتظار تایید" : "Pending Hours"}</span>
              <strong className={styles.statValue} style={{ color: "var(--color-warning-text)" }}>
                {hoursSummary ? hoursSummary.pending_hours.toFixed(2) : "0.00"}
              </strong>
            </div>
          </div>

          <div className={styles.privacyNotice} style={{ marginBlockEnd: "var(--space-4)" }}>
            <span>🔒</span>
            <span>
              {isFa
                ? "سیستم حسابرسی سخت‌گیرانه: تمام ساعات تدریس به صورت خودکار از جلسات تاییدشده استخراج می‌شوند. هرگونه اصلاح مستلزم ارائه دلیل مکتوب و ثبت در دفتر کل غیرقابل تغییر است."
                : "Strict Audit System: All teaching hours are automatically calculated from completed sessions. Any adjustment requires an immutable reason and generates an audit log entry."}
            </span>
          </div>

          {/* Ledger Table */}
          {!hoursSummary || hoursSummary.ledgers.length === 0 ? (
            <div className={styles.emptyState}>
              <p>{isFa ? "هنوز ساعت تدریسی ثبت نشده است." : "No teaching hours logged yet."}</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <caption className={styles.srOnly}>
                  {isFa ? "دفتر ساعات تدریس و اصلاحات" : "Teaching Hours and Audit Log Table"}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">{isFa ? "جلسه مرتبط" : "Associated Session"}</th>
                    <th scope="col">{isFa ? "تاریخ برگزاری" : "Date"}</th>
                    <th scope="col">{isFa ? "ساعت ثبت‌شده" : "Recorded Hours"}</th>
                    <th scope="col">{isFa ? "وضعیت" : "Status"}</th>
                    <th scope="col">{isFa ? "تاریخچه حسابرسی" : "Audit History"}</th>
                    <th scope="col">{isFa ? "عملیات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody>
                  {hoursSummary.ledgers.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.session_title}</strong></td>
                      <td>{new Date(item.session_date).toLocaleDateString(isFa ? "fa-IR" : "en-US")}</td>
                      <td>
                        <span style={{ fontWeight: 700, fontSize: "var(--font-size-body)" }}>
                          {isFa ? `${item.hours} ساعت` : `${item.hours} hrs`}
                        </span>
                      </td>
                      <td>
                        {item.status === "confirmed" ? (
                          <span className={`${styles.badge} ${styles.badgeActive}`}>
                            {isFa ? "تایید شده" : "Confirmed"}
                          </span>
                        ) : item.status === "revised" ? (
                          <span className={`${styles.badge} ${styles.badgePending}`}>
                            {isFa ? "اصلاح شده" : "Revised"}
                          </span>
                        ) : (
                          <span className={`${styles.badge} ${styles.badgeTerminated}`}>
                            {item.status_display}
                          </span>
                        )}
                      </td>
                      <td>
                        {item.audit_logs && item.audit_logs.length > 0 ? (
                          <details style={{ fontSize: "var(--font-size-meta)", cursor: "pointer" }}>
                            <summary>{isFa ? `${item.audit_logs.length} رویداد حسابرسی` : `${item.audit_logs.length} Audit Events`}</summary>
                            <ul style={{ margin: "var(--space-2) 0 0 0", paddingInlineStart: "var(--space-4)" }}>
                              {item.audit_logs.map((log) => (
                                <li key={log.id}>
                                  {log.action}: {log.previous_hours ? `${log.previous_hours} → ` : ""}{log.new_hours} hrs
                                  <br />
                                  <span style={{ color: "var(--color-muted)" }}>{log.reason}</span>
                                </li>
                              ))}
                            </ul>
                          </details>
                        ) : (
                          <span style={{ color: "var(--color-muted)", fontSize: "var(--font-size-meta)" }}>
                            {isFa ? "بدون تغییر" : "No adjustments"}
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.actionButtonSecondary}
                          onClick={() => {
                            setSelectedLedgerForAdjust(item);
                            setAdjustNewHours(item.hours);
                            setAdjustReason("");
                            setShowAdjustModal(true);
                          }}
                        >
                          {isFa ? "اصلاح ساعت (با دلیل)" : "Adjust (Audit)"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : null}

      {/* MODAL: CREATE CLASS */}
      {showCreateClassModal ? (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-labelledby={newClassTitleId}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 id={newClassTitleId} className={styles.modalTitle}>
                {isFa ? "ایجاد کلاس جدید" : "Create New Class"}
              </h2>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setShowCreateClassModal(false)}
                aria-label={isFa ? "بستن" : "Close"}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateClass}>
              <div className={styles.formGroup}>
                <label htmlFor={newClassTitleId} className={styles.formLabel}>
                  {isFa ? "عنوان کلاس" : "Class Title"}
                </label>
                <input
                  id={newClassTitleId}
                  className={styles.formInput}
                  type="text"
                  required
                  value={newClassTitle}
                  onChange={(e) => setNewClassTitle(e.target.value)}
                  placeholder={isFa ? "مثلاً: کارگاه مکالمه پیشرفته آیلتس" : "e.g. Advanced IELTS Speaking Cohort"}
                />
              </div>
              <div className={styles.formGroup} style={{ marginBlockStart: "var(--space-3)" }}>
                <label htmlFor={newClassSubjectId} className={styles.formLabel}>
                  {isFa ? "موضوع و مهارت اصلی" : "Subject & Focus"}
                </label>
                <input
                  id={newClassSubjectId}
                  className={styles.formInput}
                  type="text"
                  required
                  value={newClassSubject}
                  onChange={(e) => setNewClassSubject(e.target.value)}
                  placeholder={isFa ? "مثلاً: IELTS Speaking" : "e.g. Business Writing"}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)", marginBlockStart: "var(--space-3)" }}>
                <div className={styles.formGroup}>
                  <label htmlFor={newClassLevelId} className={styles.formLabel}>
                    {isFa ? "سطح زبانی (CEFR)" : "Target CEFR Level"}
                  </label>
                  <select
                    id={newClassLevelId}
                    className={styles.formInput}
                    value={newClassLevel}
                    onChange={(e) => setNewClassLevel(e.target.value)}
                  >
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor={newClassCapacityId} className={styles.formLabel}>
                    {isFa ? "ظرفیت حداکثر" : "Max Capacity"}
                  </label>
                  <input
                    id={newClassCapacityId}
                    className={styles.formInput}
                    type="number"
                    min={1}
                    max={50}
                    value={newClassCapacity}
                    onChange={(e) => setNewClassCapacity(parseInt(e.target.value, 10))}
                  />
                </div>
              </div>
              <div className={styles.formGroup} style={{ marginBlockStart: "var(--space-3)" }}>
                <label htmlFor={newClassObjectivesId} className={styles.formLabel}>
                  {isFa ? "اهداف آموزشی (هر خط یک هدف)" : "Curricular Objectives (one per line)"}
                </label>
                <textarea
                  id={newClassObjectivesId}
                  className={styles.formTextarea}
                  value={newClassObjectives}
                  onChange={(e) => setNewClassObjectives(e.target.value)}
                  placeholder={isFa ? "تقویت روانی کلام\nافزایش دایره واژگان آکادمیک" : "Fluency enhancement\nAcademic vocabulary expansion"}
                />
              </div>
              <div className={styles.formGroup} style={{ marginBlockStart: "var(--space-3)" }}>
                <label htmlFor={newClassNotesId} className={styles.formLabel}>
                  {isFa ? "یادداشت‌های اختصاصی مدرس (محرمانه از زبان‌آموز)" : "Private Teacher Notes (Confidential)"}
                </label>
                <textarea
                  id={newClassNotesId}
                  className={styles.formTextarea}
                  value={newClassNotes}
                  onChange={(e) => setNewClassNotes(e.target.value)}
                />
              </div>
              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.actionButtonSecondary}
                  onClick={() => setShowCreateClassModal(false)}
                >
                  {isFa ? "انصراف" : "Cancel"}
                </button>
                <button type="submit" className={styles.actionButton}>
                  {isFa ? "ذخیره و ایجاد" : "Save & Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* MODAL: INVITE LEARNER */}
      {showInviteModal ? (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-labelledby={inviteEmailId}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 id={inviteEmailId} className={styles.modalTitle}>
                {isFa ? "دعوت زبان‌آموز با رضایت صریح" : "Invite Learner with Explicit Consent"}
              </h2>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setShowInviteModal(false)}
                aria-label={isFa ? "بستن" : "Close"}
              >
                ×
              </button>
            </div>
            {generatedInviteCode ? (
              <div>
                <div className={styles.privacyNotice}>
                  <span>✓</span>
                  <span>
                    {isFa
                      ? "لینک دعوت ایجاد شد. زبان‌آموز پس از تایید صریح در این کلاس عضو می‌شود."
                      : "Invitation generated. Learner will be enrolled once they explicitly accept."}
                  </span>
                </div>
                <div style={{ marginBlock: "var(--space-4)" }}>
                  <label style={{ fontSize: "var(--font-size-meta)", fontWeight: 600 }}>
                    {isFa ? "کد اختصاصی دعوت:" : "Unique Invite Code:"}
                  </label>
                  <div style={{ display: "flex", gap: "var(--space-2)", marginBlockStart: "var(--space-2)" }}>
                    <input
                      className={styles.formInput}
                      readOnly
                      value={generatedInviteCode}
                      style={{ flex: 1, fontFamily: "monospace" }}
                    />
                    <button
                      type="button"
                      className={styles.actionButtonSecondary}
                      onClick={() => {
                        void navigator.clipboard.writeText(generatedInviteCode);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                    >
                      {copiedCode ? (isFa ? "کپی شد!" : "Copied!") : isFa ? "کپی کد" : "Copy"}
                    </button>
                  </div>
                </div>
                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.actionButton}
                    onClick={() => setShowInviteModal(false)}
                  >
                    {isFa ? "اتمام" : "Done"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInviteLearner}>
                <div className={styles.privacyNotice} style={{ marginBlockEnd: "var(--space-3)" }}>
                  <span>🛡️</span>
                  <span>
                    {isFa
                      ? "حفظ حریم خصوصی: مدرسین به فهرست زبان‌آموزان دسترسی جستجوی آزاد ندارند. پیوند فقط با دعوت مستقیم و تایید زبان‌آموز فعال می‌شود."
                      : "Privacy Protection: Teachers cannot browse all learners. Relationships activate only via direct invitation and explicit learner consent."}
                  </span>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor={inviteEmailId} className={styles.formLabel}>
                    {isFa ? "ایمیل حساب کاربری زبان‌آموز در اندورا" : "Learner's Endoora Account Email"}
                  </label>
                  <input
                    id={inviteEmailId}
                    className={styles.formInput}
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="learner@example.com"
                  />
                </div>
                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.actionButtonSecondary}
                    onClick={() => setShowInviteModal(false)}
                  >
                    {isFa ? "انصراف" : "Cancel"}
                  </button>
                  <button type="submit" className={styles.actionButton}>
                    {isFa ? "ارسال دعوت‌نامه" : "Generate Invitation"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}

      {/* DRAWER: LEARNER OVERVIEW (SAFE SUMMARY + ACCESSIBLE SKILL EVIDENCE) */}
      {selectedLearnerOverview ? (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
          <div className={styles.drawerContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {isFa ? "پرونده آموزشی زبان‌آموز" : "Learner Educational Overview"}
              </h2>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setSelectedLearnerOverview(null)}
                aria-label={isFa ? "بستن" : "Close"}
              >
                ×
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>{selectedLearnerOverview.learner_email}</strong>
                <p style={{ margin: "var(--space-1) 0 0 0", fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>
                  {isFa ? `کلاس: ${selectedLearnerOverview.class_title}` : `Class: ${selectedLearnerOverview.class_title}`}
                </p>
              </div>
              <span className={`${styles.badge} ${styles.badgeLevel}`}>
                {isFa
                  ? `سطح برآورد شده: ${selectedLearnerOverview.skill_evidence.cefr_level}`
                  : `Estimated CEFR: ${selectedLearnerOverview.skill_evidence.cefr_level}`}
              </span>
            </div>

            {/* Privacy Shield Banner */}
            <div className={styles.privacyNotice}>
              <span>🔒</span>
              <span>
                {isFa
                  ? "مرز حریم خصوصی اندورا: چت‌های هوش مصنوعی اختصاصی، صدای ضبط‌شده در اتاق تمرین شخصی و تمرین‌های فردی زبان‌آموز کاملاً محرمانه نگه داشته می‌شوند و به مدرس نشان داده نمی‌شوند."
                  : "Endoora Privacy Boundary: Solo AI roleplays, private voice recordings, and individual mistake logs are confidential and withheld from instructors."}
              </span>
            </div>

            {/* Visual Skill Score Bars */}
            <h3 style={{ margin: "var(--space-3) 0 var(--space-2) 0", fontSize: "var(--font-size-body)", fontWeight: 700 }}>
              {isFa ? "شواهد ارزیابی مهارت‌های زبانی" : "Skill Proficiency Evidence"}
            </h3>

            <div className={styles.skillBarContainer} aria-hidden="true">
              {selectedLearnerOverview.skill_evidence.skills.map((sk) => (
                <div key={sk.name} className={styles.skillItem}>
                  <div className={styles.skillItemHeader}>
                    <span>{sk.name}</span>
                    <span>{sk.score} / 100 ({sk.band})</span>
                  </div>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ inlineSize: `${sk.score}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Accessible Table Alternative for Screen Readers & WCAG */}
            <div className={styles.tableContainer} style={{ marginBlockStart: "var(--space-3)" }}>
              <table className={styles.table}>
                <caption>
                  {isFa
                    ? "کارنامه تفصیلی مهارت‌ها (جایگزین متنی دسترس‌پذیر برای نمودار)"
                    : "Detailed Skills Transcript (Accessible Text Alternative for Visual Chart)"}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">{isFa ? "مهارت" : "Skill"}</th>
                    <th scope="col">{isFa ? "نمره" : "Score"}</th>
                    <th scope="col">{isFa ? "سطح CEFR" : "CEFR Band"}</th>
                    <th scope="col">{isFa ? "مبنای سنجش" : "Assessment Benchmark"}</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLearnerOverview.skill_evidence.skills.map((sk) => (
                    <tr key={sk.name}>
                      <th scope="row">{sk.name}</th>
                      <td>{sk.score} / 100</td>
                      <td>{sk.band}</td>
                      <td>{sk.evidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.actionButton}
                onClick={() => setSelectedLearnerOverview(null)}
              >
                {isFa ? "بستن پرونده" : "Close Overview"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* MODAL: SCHEDULE SESSION */}
      {showScheduleModal ? (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-labelledby={sessionTitleId}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 id={sessionTitleId} className={styles.modalTitle}>
                {isFa ? "برنامه‌ریزی جلسه آموزشی" : "Schedule Educational Session"}
              </h2>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setShowScheduleModal(false)}
                aria-label={isFa ? "بستن" : "Close"}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleScheduleSession}>
              <div className={styles.formGroup}>
                <label htmlFor={sessionTitleId} className={styles.formLabel}>
                  {isFa ? "عنوان جلسه" : "Session Title"}
                </label>
                <input
                  id={sessionTitleId}
                  className={styles.formInput}
                  type="text"
                  required
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  placeholder={isFa ? "مثلاً: شبیه‌سازی مصاحبه آیلتس بخش دوم" : "e.g. IELTS Speaking Part 2 Mock"}
                />
              </div>

              {selectedClassDetail && selectedClassDetail.enrollments.length > 0 ? (
                <div className={styles.formGroup} style={{ marginBlockStart: "var(--space-3)" }}>
                  <label htmlFor={sessionLearnerIdField} className={styles.formLabel}>
                    {isFa ? "زبان‌آموز هدف (اختیاری برای جلسات انفرادی)" : "Target Learner (Optional for 1-on-1)"}
                  </label>
                  <select
                    id={sessionLearnerIdField}
                    className={styles.formInput}
                    value={sessionLearnerId}
                    onChange={(e) => setSessionLearnerId(e.target.value)}
                  >
                    <option value="">{isFa ? "جلسه گروهی / تمام کلاس" : "Cohort Session (All)"}</option>
                    {selectedClassDetail.enrollments
                      .filter((e) => e.status === "active")
                      .map((e) => (
                        <option key={e.learner} value={e.learner}>
                          {e.learner_email}
                        </option>
                      ))}
                  </select>
                </div>
              ) : null}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)", marginBlockStart: "var(--space-3)" }}>
                <div className={styles.formGroup}>
                  <label htmlFor={sessionStartId} className={styles.formLabel}>
                    {isFa ? "زمان شروع" : "Start Time"}
                  </label>
                  <input
                    id={sessionStartId}
                    className={styles.formInput}
                    type="datetime-local"
                    required
                    value={sessionStart}
                    onChange={(e) => setSessionStart(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor={sessionEndId} className={styles.formLabel}>
                    {isFa ? "زمان پایان" : "End Time"}
                  </label>
                  <input
                    id={sessionEndId}
                    className={styles.formInput}
                    type="datetime-local"
                    required
                    value={sessionEnd}
                    onChange={(e) => setSessionEnd(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formGroup} style={{ marginBlockStart: "var(--space-3)" }}>
                <label htmlFor={sessionDurationId} className={styles.formLabel}>
                  {isFa ? "مدت زمان به دقیقه (مبنای محاسبه ساعت تدریس)" : "Duration in Minutes (Hours Basis)"}
                </label>
                <input
                  id={sessionDurationId}
                  className={styles.formInput}
                  type="number"
                  min={15}
                  step={15}
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(parseInt(e.target.value, 10))}
                />
              </div>

              <div className={styles.formGroup} style={{ marginBlockStart: "var(--space-3)" }}>
                <label htmlFor={sessionNotesId} className={styles.formLabel}>
                  {isFa ? "یادداشت و دستور کار جلسه" : "Agenda & Session Notes"}
                </label>
                <textarea
                  id={sessionNotesId}
                  className={styles.formTextarea}
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                />
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.actionButtonSecondary}
                  onClick={() => setShowScheduleModal(false)}
                >
                  {isFa ? "انصراف" : "Cancel"}
                </button>
                <button type="submit" className={styles.actionButton}>
                  {isFa ? "ثبت برنامه جلسه" : "Schedule Session"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* MODAL: TERMINATE RELATIONSHIP */}
      {showTerminateModal && linkToTerminate ? (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-labelledby={terminateReasonId}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 id={terminateReasonId} className={styles.modalTitle}>
                {isFa ? "خاتمه ارتباط آموزشی" : "Terminate Educational Relationship"}
              </h2>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setShowTerminateModal(false)}
                aria-label={isFa ? "بستن" : "Close"}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleTerminateRelationship}>
              <div className={styles.warningNotice}>
                <strong>⚠️ {isFa ? "پیامد خاتمه ارتباط:" : "Termination Consequences:"}</strong>
                <p style={{ margin: "var(--space-2) 0 0 0" }}>
                  {isFa
                    ? "دسترسی شما به اطلاعات این زبان‌آموز بلافاصله لغو می‌شود. با این حال، سوابق جلسات برگزارشده و ساعت‌های ثبت‌شده تدریس به منظور شفافیت مالی و قانونی در سامانه حفظ می‌گردند."
                    : "Future data access will be revoked immediately. Historical sessions and logged teaching hours remain securely preserved for compliance."}
                </p>
              </div>

              <div className={styles.formGroup} style={{ marginBlockStart: "var(--space-3)" }}>
                <label htmlFor={terminateReasonId} className={styles.formLabel}>
                  {isFa ? "علت خاتمه ارتباط (ثبت در سوابق سیستم)" : "Termination Reason (Recorded in System)"}
                </label>
                <textarea
                  id={terminateReasonId}
                  className={styles.formTextarea}
                  required
                  value={terminateReason}
                  onChange={(e) => setTerminateReason(e.target.value)}
                  placeholder={isFa ? "مثلاً: اتمام دوره آموزشی یا لغو توافقی" : "e.g. Course completed / Mutual agreement"}
                />
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.actionButtonSecondary}
                  onClick={() => setShowTerminateModal(false)}
                >
                  {isFa ? "انصراف" : "Cancel"}
                </button>
                <button type="submit" className={styles.actionButtonDanger}>
                  {isFa ? "خاتمه قطعی ارتباط" : "Confirm Termination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* MODAL: ADJUST TEACHING HOURS (MANDATORY AUDIT REASON) */}
      {showAdjustModal && selectedLedgerForAdjust ? (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-labelledby={adjustHoursId}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 id={adjustHoursId} className={styles.modalTitle}>
                {isFa ? "اصلاح ساعت تدریس با ثبت در لاگ حسابرسی" : "Audited Hours Adjustment"}
              </h2>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setShowAdjustModal(false)}
                aria-label={isFa ? "بستن" : "Close"}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAdjustHours}>
              <div className={styles.privacyNotice}>
                <span>📝</span>
                <span>
                  {isFa
                    ? "قانون انضباط مالی: تغییر دستی ساعت تدریس بدون ذکر دلیل مستند مجاز نیست و این تراکنش در دفتر کل حسابرسی ثبت غیرقابل تغییر می‌شود."
                    : "Audit Policy: Manual hours adjustments require an explicit rationale. The action will be immutably recorded in the audit trail."}
                </span>
              </div>

              <div style={{ marginBlock: "var(--space-3)" }}>
                <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>
                  {isFa ? "جلسه مرتبط: " : "Associated Session: "}
                </span>
                <strong>{selectedLedgerForAdjust.session_title}</strong>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor={adjustHoursId} className={styles.formLabel}>
                  {isFa ? "ساعت جدید تدریس" : "New Teaching Hours"}
                </label>
                <input
                  id={adjustHoursId}
                  className={styles.formInput}
                  type="number"
                  step="0.25"
                  min="0"
                  required
                  value={adjustNewHours}
                  onChange={(e) => setAdjustNewHours(e.target.value)}
                />
              </div>

              <div className={styles.formGroup} style={{ marginBlockStart: "var(--space-3)" }}>
                <label htmlFor={adjustReasonId} className={styles.formLabel}>
                  {isFa ? "علت و مستندات اصلاح ساعت (اجباری - حداقل ۵ کاراکتر)" : "Mandatory Audit Reason (min 5 chars)"}
                </label>
                <textarea
                  id={adjustReasonId}
                  className={styles.formTextarea}
                  required
                  minLength={5}
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder={isFa ? "مثلاً: تمدید ۱۵ دقیقه‌ای جلسه جهت رفع اشکال گرامر" : "e.g. Session extended by 15 mins for Q&A"}
                />
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.actionButtonSecondary}
                  onClick={() => setShowAdjustModal(false)}
                >
                  {isFa ? "انصراف" : "Cancel"}
                </button>
                <button type="submit" className={styles.actionButton}>
                  {isFa ? "ثبت اصلاحیه و لاگ حسابرسی" : "Record Audited Adjustment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

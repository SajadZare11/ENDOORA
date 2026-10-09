"use client";

import { Button, Input, Table } from "@endoora/ui";

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
import {
  fetchTeacherOpenClassRequests,
  claimTeacherCohort,
  logTeacherSession,
  type OpenRequestsResponse,
} from "../../../../lib/curriculum-classes";
import { WritingFeedbackStudio } from "../../../../components/teacher/WritingFeedbackStudio";
import { ProgressReportCardStudio } from "../../../../components/teacher/ProgressReportCardStudio";
import { AdobeConnectLauncherModal } from "../../../../components/classroom/AdobeConnectLauncherModal";
import { PERSIAN_DAYS } from "../../../../lib/classroom-schedule";

type TabKey = "classes" | "sessions" | "hours" | "feedback" | "requests" | "report";

export default function TeacherClassesPage() {
  const { locale, activeClass } = useTeacherHome();
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
  const [launcherClass, setLauncherClass] = useState<TeacherClass | null>(null);
  const [selectedLearnerForReport, setSelectedLearnerForReport] = useState<string>("");

  // Form states
  const [newClassTitle, setNewClassTitle] = useState("");
  const [newClassSubject, setNewClassSubject] = useState("");
  const [newClassLevel, setNewClassLevel] = useState("B1");
  const [newClassCapacity, setNewClassCapacity] = useState(5);
  const [newClassCoursebook, setNewClassCoursebook] = useState("");
  const [newClassAgeGroup, setNewClassAgeGroup] = useState("adult");
  const [newClassGoal, setNewClassGoal] = useState("general");
  const [newClassDuration, setNewClassDuration] = useState(60);
  const [newClassObjectives, setNewClassObjectives] = useState("");
  const [newClassNotes, setNewClassNotes] = useState("");
  const [newClassDays, setNewClassDays] = useState<string[]>(["شنبه", "دوشنبه"]);
  const [newClassTimeStart, setNewClassTimeStart] = useState("18:00");
  const [newClassTimeEnd, setNewClassTimeEnd] = useState("19:30");
  const [newClassMeetingUrl, setNewClassMeetingUrl] = useState("");

  const [inviteEmail, setInviteEmail] = useState("");
  const [generatedInviteCode, setGeneratedInviteCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [classSearchQuery, setClassSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  // Open Requests & Cohorts
  const [openRequestsData, setOpenRequestsData] = useState<OpenRequestsResponse | null>(null);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimRequestIds, setClaimRequestIds] = useState<string[]>([]);
  const [claimTitle, setClaimTitle] = useState("");
  const [claimMeetingUrl, setClaimMeetingUrl] = useState("");
  const [claimScheduleSummary, setClaimScheduleSummary] = useState("");
  const [claiming, setClaiming] = useState(false);

  // Teaching Session Log Modal
  const [showSessionLogModal, setShowSessionLogModal] = useState(false);
  const [logTargetClassId, setLogTargetClassId] = useState<string>("");
  const [logUnitsCovered, setLogUnitsCovered] = useState("");
  const [logGrammarCovered, setLogGrammarCovered] = useState("");
  const [logVocabList, setLogVocabList] = useState("");
  const [logHomework, setLogHomework] = useState("");
  const [logNotes, setLogNotes] = useState("");
  const [loggingSession, setLoggingSession] = useState(false);

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
  const claimTitleId = useId();
  const claimUrlId = useId();
  const claimScheduleId = useId();
  const logUnitsId = useId();
  const logGrammarId = useId();
  const logVocabId = useId();
  const logHomeworkId = useId();
  const logNotesId = useId();

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
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab") as TabKey;
      if (tab && ["classes", "sessions", "hours", "feedback", "requests", "report"].includes(tab)) {
        setActiveTab(tab);
      }
      const learner = params.get("learner");
      if (learner) {
        setSelectedLearnerForReport(learner);
      }
    }
  }, []);

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

  // Load open class requests helper
  const loadOpenRequests = async () => {
    try {
      setLoadingRequests(true);
      const data = await fetchTeacherOpenClassRequests();
      setOpenRequestsData(data);
    } catch {
      // fallback
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (activeTab === "requests") {
      void loadOpenRequests();
    }
  }, [activeTab]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "feedback") {
        setActiveTab("feedback");
      } else if (tabParam === "sessions" || tabParam === "hours" || tabParam === "requests" || tabParam === "classes") {
        setActiveTab(tabParam);
      }
    }
  }, []);

  const handleOpenClaimModal = (requestIds: string[], defaultTitle: string, defaultSchedule?: string) => {
    setClaimRequestIds(requestIds);
    setClaimTitle(defaultTitle);
    setClaimScheduleSummary(defaultSchedule || "");
    setClaimMeetingUrl("https://www.skyroom.online/ch/endoora/");
    setShowClaimModal(true);
  };

  const handleClaimCohort = async (e: React.FormEvent) => {
    e.preventDefault();
    if (claimRequestIds.length === 0) return;
    try {
      setClaiming(true);
      const res = await claimTeacherCohort({
        request_ids: claimRequestIds,
        title: claimTitle,
        meeting_url: claimMeetingUrl,
        schedule_summary: claimScheduleSummary,
      });
      if (res.success) {
        alert(res.message_fa || (isFa ? "کلاس با موفقیت تشکیل و زبان‌آموزان تخصیص یافتند." : "Cohort formed successfully!"));
        setShowClaimModal(false);
        setClaimRequestIds([]);
        await loadOpenRequests();
        await loadClasses();
      } else {
        alert(res.error || (isFa ? "خطا در تشکیل کلاس" : "Failed to claim cohort"));
      }
    } catch (err: any) {
      alert(err.message || (isFa ? "خطا در تشکیل کلاس" : "Failed to claim cohort"));
    } finally {
      setClaiming(false);
    }
  };

  const handleLogTeachingSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logTargetClassId || !logUnitsCovered) return;
    try {
      setLoggingSession(true);
      const vocabArray = logVocabList
        .split(/[,،\n]/)
        .map((w) => w.trim())
        .filter(Boolean);

      const res = await logTeacherSession({
        cohort_id: logTargetClassId,
        units_covered: logUnitsCovered,
        grammar_covered: logGrammarCovered,
        vocabulary_list: vocabArray,
        homework_description: logHomework,
        teacher_notes: logNotes,
      });

      if (res.success) {
        alert(res.message_fa || (isFa ? "گزارش تدریس و تکالیف با موفقیت ثبت شد و به ماموریت روزانه زبان‌آموزان متصل گردید." : "Session logged and synced with learner missions!"));
        setShowSessionLogModal(false);
        setLogUnitsCovered("");
        setLogGrammarCovered("");
        setLogVocabList("");
        setLogHomework("");
        setLogNotes("");
        if (selectedClassId) {
          await loadClassDetail(selectedClassId);
        }
      } else {
        alert(res.error || (isFa ? "خطا در ثبت گزارش جلسه" : "Failed to log session"));
      }
    } catch (err: any) {
      alert(err.message || (isFa ? "خطا در ثبت گزارش جلسه" : "Failed to log session"));
    } finally {
      setLoggingSession(false);
    }
  };

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
        coursebook: newClassCoursebook,
        age_group: newClassAgeGroup,
        goal: newClassGoal,
        default_duration: Number(newClassDuration),
        schedule_days: newClassDays,
        schedule_time_start: newClassTimeStart,
        schedule_time_end: newClassTimeEnd,
        meeting_url: newClassMeetingUrl,
      });

      setShowCreateClassModal(false);
      setNewClassTitle("");
      setNewClassSubject("");
      setNewClassCoursebook("");
      setNewClassObjectives("");
      setNewClassNotes("");
      setNewClassDays(["شنبه", "دوشنبه"]);
      setNewClassTimeStart("18:00");
      setNewClassTimeEnd("19:30");
      setNewClassMeetingUrl("");
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

  const handleCopyClassCode = (code: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!code) return;
    void navigator.clipboard.writeText(code);
    setToastMessage(isFa ? `کد کلاس ${code} با موفقیت کپی شد!` : `Class code ${code} copied to clipboard!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const filteredClasses = classes.filter((cls) => {
    if (!classSearchQuery.trim()) return true;
    const q = classSearchQuery.trim().toLowerCase();
    const cCode = (cls.code || cls.class_code || "").toLowerCase();
    const cTitle = (cls.title || "").toLowerCase();
    const cSubj = (cls.subject || "").toLowerCase();
    const cLvl = (cls.level || "").toLowerCase();
    return cCode.includes(q) || cTitle.includes(q) || cSubj.includes(q) || cLvl.includes(q);
  });

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  return (
    <div className={styles.container} dir={isFa ? "rtl" : "ltr"}>
      {/* Header Card */}
      <section className={styles.headerCard}>
        <div className={styles.headerTop}>
          <div className={styles.headerIntro}>
            <div className={styles.headerBadge}>
              <span className={styles.headerBadgeDot} aria-hidden="true" />
              <span>{isFa ? "فضای مدیریت کلاس‌ها و تدریس" : "Teaching & Class Workspace"}</span>
            </div>
            <h1 className={styles.title}>
              {isFa ? "کلاس‌ها، زبان‌آموزان و ساعات تدریس" : "Classes, Learners & Teaching Hours"}
            </h1>
            <p className={styles.description}>
              {isFa
                ? "مدیریت کلاس‌های اختصاصی، پیوند امن زبان‌آموزان با رضایت صریح، برنامه‌ریزی جلسات و دفتر ساعات تدریس حسابرسی‌شده."
                : "Manage private classes, secure learner relationships with explicit consent, schedule sessions, and audited teaching-hours ledger."}
            </p>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.actionButtonSecondary}
              onClick={() => {
                setLogTargetClassId(selectedClassId || (classes[0]?.id ?? ""));
                setShowSessionLogModal(true);
              }}
            >
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span>{isFa ? "ثبت گزارش جلسه و تکلیف" : "Log Session & Homework"}</span>
            </button>

            <button
              type="button"
              className={styles.actionButtonPrimary}
              onClick={() => setShowCreateClassModal(true)}
            >
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>{isFa ? "ایجاد کلاس جدید" : "Create New Class"}</span>
            </button>
          </div>
        </div>

        {/* Quick Tools & Shortcuts Bar */}
        <div className={styles.quickToolsStrip}>
          <span className={styles.quickToolsLabel}>
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            {isFa ? "ابزارهای مرتبط:" : "Related Tools:"}
          </span>
          <Link href="/teacher/gradebook" className={styles.quickToolChip}>
            <span aria-hidden="true">📊</span>
            <span>{isFa ? "دفتر نمرات" : "Gradebook"}</span>
          </Link>
          <Link href="/teacher/grading" className={styles.quickToolChip}>
            <span aria-hidden="true">✍️</span>
            <span>{isFa ? "تصحیح تکالیف" : "Grading Studio"}</span>
          </Link>
          <Link href="/teacher/assignments" className={styles.quickToolChip}>
            <span aria-hidden="true">📚</span>
            <span>{isFa ? "تکالیف و آزمون‌ها" : "Assignments Hub"}</span>
          </Link>
          <Link href="/teacher/interventions" className={styles.quickToolChip}>
            <span aria-hidden="true">🎯</span>
            <span>{isFa ? "مداخلات آموزشی" : "Interventions"}</span>
          </Link>
          <Link href="/teacher/analytics" className={styles.quickToolChip}>
            <span aria-hidden="true">📈</span>
            <span>{isFa ? "تحلیل و پایش" : "Analytics"}</span>
          </Link>
        </div>

        {/* Modern Segmented Tab Navigation */}
        <div className={styles.tabBar} role="tablist" aria-label={isFa ? "بخش‌های مدیریت کلاس" : "Class tabs"}>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "classes"}
            data-active={activeTab === "classes"}
            className={styles.tabButton}
            onClick={() => setActiveTab("classes")}
          >
            <span className={styles.tabButtonIcon} aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <span>{isFa ? "کلاس‌ها و زبان‌آموزان" : "Classes & Learners"}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "sessions"}
            data-active={activeTab === "sessions"}
            className={styles.tabButton}
            onClick={() => setActiveTab("sessions")}
          >
            <span className={styles.tabButtonIcon} aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
            <span>{isFa ? "جلسات و زمان‌بندی" : "Sessions & Schedule"}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "hours"}
            data-active={activeTab === "hours"}
            className={styles.tabButton}
            onClick={() => setActiveTab("hours")}
          >
            <span className={styles.tabButtonIcon} aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </span>
            <span>{isFa ? "ساعات تدریس و حسابرسی" : "Teaching Hours & Audit"}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "feedback"}
            data-active={activeTab === "feedback"}
            className={styles.tabButton}
            onClick={() => setActiveTab("feedback")}
          >
            <span className={styles.tabButtonIcon} aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </span>
            <span>{isFa ? "تحلیل و بازخورد تکالیف" : "Writing & Feedback Studio"}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "requests"}
            data-active={activeTab === "requests"}
            className={styles.tabButton}
            onClick={() => setActiveTab("requests")}
          >
            <span className={styles.tabButtonIcon} aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </span>
            <span>{isFa ? "درخواست‌ها و پذیرش" : "Requests & Cohorts"}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "report"}
            data-active={activeTab === "report"}
            className={styles.tabButton}
            onClick={() => setActiveTab("report")}
          >
            <span className={styles.tabButtonIcon} aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
            </span>
            <span>{isFa ? "کارنامه جامع پیشرفت" : "Progress Report Card"}</span>
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
        <section aria-label={isFa ? "بخش کلاس‌ها" : "Classes Section"} className={styles.tabContent}>
          {/* Class Search & 7-digit code filter */}
          <div style={{ display: "flex", gap: "var(--space-3)", marginBlockEnd: "var(--space-4)", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 280px" }}>
              <Input
                type="text"
                placeholder={isFa ? "🔍 جستجوی کلاس با عنوان، موضوع یا کد ۷ رقمی (مثلاً ۴۸۲۹۱۰۳)..." : "🔍 Search classes by title, subject, or 7-digit code (e.g. 4829103)..."}
                value={classSearchQuery}
                onChange={(e) => setClassSearchQuery(e.target.value)}
              />
            </div>
            {classSearchQuery && (
              <Button
                type="button"
                variant="tertiary"
                onClick={() => setClassSearchQuery("")}
                style={{ fontSize: "0.8125rem" }}
              >
                {isFa ? "پاک کردن فیلتر" : "Clear Filter"}
              </Button>
            )}
            <Button
              type="button"
              className={styles.actionButton}
              onClick={() => setShowCreateClassModal(true)}
            >
              {isFa ? "+ ایجاد کلاس جدید" : "+ Create New Class"}
            </Button>
          </div>

          {classes.length === 0 && !loading ? (
            <div className={styles.emptyState}>
              <p>{isFa ? "هنوز کلاسی ایجاد نکرده‌اید." : "No classes created yet."}</p>
              <Button
                type="button"
                className={styles.actionButton}
                onClick={() => setShowCreateClassModal(true)}
                style={{ marginBlockStart: "var(--space-3)" }}
              >
                {isFa ? "اولین کلاس خود را ایجاد کنید" : "Create Your First Class"}
              </Button>
            </div>
          ) : filteredClasses.length === 0 && !loading ? (
            <div className={styles.emptyState}>
              <p>{isFa ? "هیچ کلاسی با این کد یا عنوان یافت نشد." : "No classes match your search query."}</p>
              <Button
                type="button"
                variant="tertiary"
                onClick={() => setClassSearchQuery("")}
                style={{ marginBlockStart: "var(--space-2)" }}
              >
                {isFa ? "مشاهده همه کلاس‌ها" : "View All Classes"}
              </Button>
            </div>
          ) : (
            <div className={styles.classGrid}>
              {filteredClasses.map((cls) => (
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

                  {/* 7-digit numeric class code badge with one-click copy button */}
                  {(cls.code || cls.class_code) && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBlock: "var(--space-2)",
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        padding: "6px 10px",
                        borderRadius: "8px",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "0.8125rem", color: "#166534" }}>🏷️ {isFa ? "کد کلاس:" : "Code:"}</span>
                        <strong style={{ fontSize: "0.9375rem", fontFamily: "monospace", letterSpacing: "1px", color: "#15803d" }}>
                          {cls.code || cls.class_code}
                        </strong>
                      </div>
                      <button
                        type="button"
                        title={isFa ? "کپی کد کلاس" : "Copy Class Code"}
                        style={{
                          padding: "2px 8px",
                          fontSize: "0.75rem",
                          background: "#ffffff",
                          border: "1px solid #86efac",
                          borderRadius: "4px",
                          cursor: "pointer",
                          color: "#166534",
                          fontWeight: 600,
                        }}
                        onClick={(e) => handleCopyClassCode(cls.code || cls.class_code || "", e)}
                      >
                        📋 {isFa ? "کپی" : "Copy"}
                      </button>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", marginBlock: "var(--space-2)", flexWrap: "wrap", fontSize: "0.8125rem", color: "#0369a1", background: "#f0f9ff", padding: "4px 8px", borderRadius: "6px" }}>
                    <span>📅 {(cls.schedule_days && cls.schedule_days.length > 0 ? cls.schedule_days : ["شنبه", "دوشنبه"]).join(" و ")}</span>
                    <span>⏰ {cls.schedule_time_start || "18:00"} الی {cls.schedule_time_end || "19:30"}</span>
                  </div>
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
                  <button
                    type="button"
                    style={{
                      marginBlockStart: "var(--space-2)",
                      width: "100%",
                      padding: "var(--space-2) var(--space-3)",
                      background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "var(--radius-md, 0.375rem)",
                      fontSize: "var(--font-size-meta)",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "var(--space-2)",
                      boxShadow: "0 2px 8px rgba(2, 132, 199, 0.25)",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedClassId(cls.id);
                      setLauncherClass(cls);
                    }}
                  >
                    🎥 {isFa ? "ورود به کلاس (Adobe Connect)" : "Join Adobe Connect"}
                  </button>
                </article>
              ))}
            </div>
          )}

          {/* Selected Class Detail & Roster */}
          {selectedClass ? (
            <section className={styles.detailCard}>
              <div className={styles.detailHeader}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0, fontSize: "var(--font-size-title)", fontWeight: 700 }}>
                      {selectedClass.title}
                    </h2>
                    {(selectedClass.code || selectedClass.class_code) && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          background: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                          padding: "3px 10px",
                          borderRadius: "6px",
                          fontSize: "0.875rem",
                          color: "#166534",
                          fontWeight: 700,
                        }}
                      >
                        <span>🏷️ {isFa ? "کد ۷ رقمی:" : "Code:"}</span>
                        <strong style={{ fontFamily: "monospace", letterSpacing: "1px" }}>
                          {selectedClass.code || selectedClass.class_code}
                        </strong>
                        <button
                          type="button"
                          title={isFa ? "کپی کد کلاس" : "Copy Class Code"}
                          style={{
                            padding: "2px 6px",
                            fontSize: "0.75rem",
                            background: "#ffffff",
                            border: "1px solid #86efac",
                            borderRadius: "4px",
                            cursor: "pointer",
                            color: "#166534",
                            fontWeight: 600,
                          }}
                          onClick={() => handleCopyClassCode(selectedClass.code || selectedClass.class_code || "")}
                        >
                          📋 {isFa ? "کپی" : "Copy"}
                        </button>
                      </span>
                    )}
                  </div>
                  <p style={{ margin: "var(--space-1) 0 0 0", color: "var(--color-muted)", fontSize: "var(--font-size-meta)" }}>
                    {selectedClass.description
                      ? `${selectedClass.description} — ${isFa ? `کد شناسه کلاس: ${selectedClass.code || selectedClass.class_code}` : `Class ID: ${selectedClass.code || selectedClass.class_code}`}`
                      : (isFa ? `کد شناسه کلاس: ${selectedClass.code || selectedClass.class_code}` : `Class ID: ${selectedClass.code || selectedClass.class_code}`)}
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
                  <Button
                    type="button"
                    className={styles.actionButtonSecondary}
                    onClick={() => {
                      setGeneratedInviteCode(null);
                      setInviteEmail("");
                      setShowInviteModal(true);
                    }}
                  >
                    {isFa ? "+ دعوت زبان‌آموز جدید" : "+ Invite New Learner"}
                  </Button>
                </div>
              </div>

              {/* Class Schedule & Adobe Connect Online Classroom Entry */}
              <div
                style={{
                  background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                  border: "1px solid #bae6fd",
                  borderRadius: "var(--radius-lg, 0.75rem)",
                  padding: "var(--space-4)",
                  marginBlock: "var(--space-4)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "var(--space-3)",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBlockEnd: "var(--space-1)" }}>
                    <span style={{ fontSize: "1.25rem" }}>🎙️</span>
                    <strong style={{ fontSize: "var(--font-size-body)", color: "#0369a1" }}>
                      {isFa ? "برنامه برگزاری و کلاس آنلاین Adobe Connect" : "Adobe Connect Schedule & Online Room"}
                    </strong>
                  </div>
                  <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap", fontSize: "var(--font-size-meta)", color: "#0f172a" }}>
                    <span>
                      📅 <strong>{isFa ? "روزهای برگزاری:" : "Days:"}</strong>{" "}
                      {(selectedClass.schedule_days && selectedClass.schedule_days.length > 0
                        ? selectedClass.schedule_days
                        : ["شنبه", "دوشنبه"]
                      ).join(" و ")}
                    </span>
                    <span>
                      ⏰ <strong>{isFa ? "ساعت کلاس:" : "Hours:"}</strong>{" "}
                      {selectedClass.schedule_time_start || "18:00"} الی {selectedClass.schedule_time_end || "19:30"}
                    </span>
                  </div>
                  <div style={{ marginBlockStart: "var(--space-1)", fontSize: "0.8125rem", color: "#0284c7" }}>
                    ⚡ {isFa ? "ورود به کلاس از ۱۵ دقیقه قبل از زمان برگزاری فعال می‌شود." : "Classroom gate opens 15 minutes prior to scheduled start time."}
                  </div>
                  <div style={{ marginBlockStart: "var(--space-2)", fontSize: "0.8125rem", color: "#0369a1" }}>
                    {selectedClass.meeting_url && !selectedClass.meeting_url.includes("live.endoora.com") ? (
                      <span>🔗 <strong>{isFa ? "آدرس سرور Adobe Connect:" : "Room URL:"}</strong> <span style={{ direction: "ltr", display: "inline-block" }}>{selectedClass.meeting_url}</span></span>
                    ) : (
                      <span style={{ color: "#b45309", background: "#fef3c7", padding: "2px 8px", borderRadius: "4px" }}>
                        ⚠️ {isFa ? "لینک سرور ادوبی کانکت هنوز ثبت نشده است (پیش‌فرض تستی)" : "Adobe Connect server URL not configured"}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    type="button"
                    style={{
                      background: "#ffffff",
                      border: "1px solid #7dd3fc",
                      color: "#0369a1",
                      borderRadius: "var(--radius-md, 0.375rem)",
                      padding: "8px 14px",
                      fontSize: "var(--font-size-meta)",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                    onClick={() => setLauncherClass(selectedClass)}
                  >
                    ⚙️ {isFa ? "تنظیم / ویرایش لینک کلاس" : "Configure Room Link"}
                  </button>
                  <Button
                    type="button"
                    variant="primary"
                    style={{
                      background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                      color: "#ffffff",
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                      boxShadow: "0 4px 14px rgba(2, 132, 199, 0.35)",
                    }}
                    onClick={() => setLauncherClass(selectedClass)}
                  >
                    🎥 {isFa ? "ورود به کلاس (Adobe Connect)" : "Join Adobe Connect Room"}
                  </Button>
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
                  <Table className={styles.table}>
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
                                <>
                                  <Button
                                    type="button"
                                    className={styles.actionButtonSecondary}
                                    onClick={() => handleOpenLearnerOverview(enr.learner)}
                                  >
                                    {isFa ? "پرونده آموزشی" : "Educational Summary"}
                                  </Button>
                                  <Button
                                    type="button"
                                    className={styles.actionButtonSecondary}
                                    onClick={() => {
                                      setSelectedLearnerForReport(enr.learner);
                                      setActiveTab("report");
                                    }}
                                  >
                                    {isFa ? "🎓 کارنامه پیشرفت" : "🎓 Report Card"}
                                  </Button>
                                </>
                              ) : null}
                              {enr.status !== "terminated" ? (
                                <Button
                                  type="button"
                                  className={styles.actionButtonDanger}
                                  onClick={() => {
                                    setLinkToTerminate(enr);
                                    setShowTerminateModal(true);
                                  }}
                                >
                                  {isFa ? "خاتمه ارتباط" : "Terminate"}
                                </Button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </section>
          ) : null}
        </section>
      ) : null}

      {/* TAB 2: SESSIONS & SCHEDULE */}
      {activeTab === "sessions" ? (
        <section aria-label={isFa ? "بخش جلسات" : "Sessions Section"} className={styles.tabContent}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlockEnd: "var(--space-4)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--font-size-title)", fontWeight: 700 }}>
              {isFa ? "جلسات کلاسی" : "Class Sessions"}
            </h2>
            <Button
              type="button"
              className={styles.actionButton}
              onClick={() => setShowScheduleModal(true)}
              disabled={!selectedClassId}
            >
              {isFa ? "+ برنامه‌ریزی جلسه جدید" : "+ Schedule New Session"}
            </Button>
          </div>

          {!selectedClassDetail || selectedClassDetail.sessions.length === 0 ? (
            <div className={styles.emptyState}>
              <p>{isFa ? "جلسه‌ای برای این کلاس ثبت نشده است." : "No sessions scheduled for this class."}</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <Table className={styles.table}>
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
                          <Button
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
                          </Button>
                        ) : sess.status === "completed" ? (
                          <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-success-text)" }}>
                            {isFa ? "ساعت ثبت شد ✓" : "Hours Recorded ✓"}
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </section>
      ) : null}

      {/* TAB 3: TEACHING HOURS & AUDIT */}
      {activeTab === "hours" ? (
        <section aria-label={isFa ? "بخش ساعات تدریس" : "Teaching Hours Section"} className={styles.tabContent}>
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
              <Table className={styles.table}>
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
                        <Button
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
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </section>
      ) : null}

      {/* TAB: WRITING DIAGNOSTIC & 3-COLUMN FEEDBACK STUDIO */}
      {activeTab === "feedback" ? (
        <section aria-label={isFa ? "استودیوی تحلیل تکالیف و بازخورد ۳ ستونه" : "Writing Diagnostic & Feedback Studio"} className={styles.tabContent}>
          <WritingFeedbackStudio selectedClassId={selectedClassId || activeClass?.id} />
        </section>
      ) : null}

      {/* TAB 4: OPEN CLASS REQUESTS & COHORT MATCHING */}
      {activeTab === "requests" ? (
        <section aria-label={isFa ? "بخش درخواست‌های کلاس و گروه‌ها" : "Open Requests & Cohorts Section"} className={styles.tabContent}>
          <div className={styles.infoBanner}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <strong>
                {isFa
                  ? "استخر تقاضای زبان‌آموزان و موتور تشکیل خودکار کلاس:"
                  : "Learner Demand Pool & Automated Cohort Engine:"}
              </strong>
              <p style={{ margin: "var(--space-1) 0 0 0", color: "var(--color-muted)", fontSize: "var(--font-size-meta)" }}>
                {isFa
                  ? "در این بخش زبان‌آموزانی که آزمون تعیین سطح ۶ مهارتی را گذرانده، کتاب درسی مناسب سطحشان مشخص شده و درخواست کلاس زنده داده‌اند نمایش داده می‌شوند. الگوریتم هوشمند، زبان‌آموزان همسطح با زمان‌بندی هفتگی مشترک را در قالب گروه‌های ۲ تا ۴ نفره به شما پیشنهاد می‌دهد."
                  : "Learners who completed diagnostic placement, received book recommendations, and requested live classes are pooled here. Smart matching automatically clusters learners with identical CEFR levels and overlapping availability into 2-4 student cohorts."}
              </p>
            </div>
          </div>

          {/* Section A: Smart Cohort Suggestions */}
          <div className={styles.sectionHeading}>
            <span>{isFa ? "پیشنهادهای هوشمند تشکیل گروه (همسطح و هم‌زمان)" : "Smart Cohort Suggestions (Matched Availability)"}</span>
            <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)", fontWeight: "normal" }}>
              {isFa
                ? `${openRequestsData?.cohort_suggestions.length || 0} پیشنهاد فعال`
                : `${openRequestsData?.cohort_suggestions.length || 0} active suggestions`}
            </span>
          </div>

          {loadingRequests ? (
            <div className={styles.emptyState}>
              <p>{isFa ? "در حال دریافت استخر درخواست‌ها..." : "Loading requests pool..."}</p>
            </div>
          ) : !openRequestsData || openRequestsData.cohort_suggestions.length === 0 ? (
            <div className={styles.emptyState} style={{ background: "var(--color-surface)", borderRadius: "var(--radius-card)", border: "1px dashed var(--color-border)" }}>
              <p>{isFa ? "در حال حاضر پیشنهاد گروه چندنفره آماده‌ای وجود ندارد. درخواست‌های فردی زیر را بررسی کرده یا کلاسی با متقاضیان تشکیل دهید." : "No multi-student cohort suggestions available yet. Check the individual pool below."}</p>
            </div>
          ) : (
            <div className={styles.cohortGrid}>
              {openRequestsData.cohort_suggestions.map((sug, idx) => (
                <article key={idx} className={styles.cohortCard}>
                  <div className={styles.cohortHeader}>
                    <h3 className={styles.cohortTitle}>{sug.book_title}</h3>
                    <span className={styles.cohortMatchBadge}>
                      {isFa ? "تطابق هوشمند ۹۵٪" : "95% Match"}
                    </span>
                  </div>

                  <div className={styles.cohortMetaRow}>
                    <span className={`${styles.badge} ${styles.badgeActive}`}>{sug.cefr_level}</span>
                    <span className={styles.badgeGroup}>
                      {isFa ? `${sug.member_ids.length} نفر (ظرفیت تا ${sug.suggested_capacity})` : `${sug.member_ids.length} students (cap ${sug.suggested_capacity})`}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 600, display: "block", marginBlockEnd: "var(--space-1)" }}>
                      {isFa ? "اعضای گروه:" : "Cohort Members:"}
                    </span>
                    <div className={styles.cohortMembersList}>
                      {sug.student_names.map((name, sIdx) => (
                        <span key={sIdx} className={styles.memberPill}>
                          👤 {name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 600, display: "block", marginBlockEnd: "var(--space-1)" }}>
                      {isFa ? "سانس‌های زمانی مشترک:" : "Common Time Windows:"}
                    </span>
                    <div className={styles.cohortMembersList}>
                      {sug.common_slots.map((slot, sIdx) => (
                        <span key={sIdx} className={styles.slotChip}>
                          🕒 {slot}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="primary"
                    className={styles.actionButton}
                    style={{ marginBlockStart: "auto" }}
                    onClick={() =>
                      handleOpenClaimModal(
                        sug.member_ids,
                        `${sug.book_title} - گروه آنلاین`,
                        sug.common_slots.join("، ")
                      )
                    }
                  >
                    {isFa ? "تشکیل کلاس و پذیرش گروه 🤝" : "Form Class & Claim Cohort 🤝"}
                  </Button>
                </article>
              ))}
            </div>
          )}

          {/* Section B: Individual Requests Pool */}
          <div className={styles.sectionHeading} style={{ marginBlockStart: "var(--space-8)" }}>
            <span>{isFa ? "استخر متقاضیان منتظر (درخواست‌های انفرادی و گروهی)" : "All Open Learner Requests"}</span>
            <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)", fontWeight: "normal" }}>
              {isFa
                ? `${openRequestsData?.total_pending || 0} درخواست در صف انتظار`
                : `${openRequestsData?.total_pending || 0} pending in queue`}
            </span>
          </div>

          {!openRequestsData || openRequestsData.requests.length === 0 ? (
            <div className={styles.emptyState} style={{ background: "var(--color-surface)", borderRadius: "var(--radius-card)", border: "1px dashed var(--color-border)" }}>
              <p>{isFa ? "هیچ زبان‌آموز در انتظار کلاسی در سیستم ثبت نشده است." : "No pending learner requests at this time."}</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <Table className={styles.table}>
                <caption className={styles.srOnly}>
                  {isFa ? "جدول استخر متقاضیان کلاس" : "Class Request Pool Table"}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">{isFa ? "زبان‌آموز" : "Learner"}</th>
                    <th scope="col">{isFa ? "سطح زبانی" : "CEFR"}</th>
                    <th scope="col">{isFa ? "فرمت درخواستی" : "Format"}</th>
                    <th scope="col">{isFa ? "کتاب درسی پیشنهادی" : "Coursebook Track"}</th>
                    <th scope="col">{isFa ? "زمان‌های آزاد هفتگی" : "Available Slots"}</th>
                    <th scope="col">{isFa ? "عملیات" : "Action"}</th>
                  </tr>
                </thead>
                <tbody>
                  {openRequestsData.requests.map((req) => (
                    <tr key={req.id}>
                      <td>
                        <strong>{req.student_name}</strong>
                        <div style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>
                          {req.student_email}
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${styles.badgeActive}`}>{req.cefr_level}</span>
                      </td>
                      <td>
                        <span className={req.preferred_format === "solo" ? styles.badgeSolo : styles.badgeGroup}>
                          {req.preferred_format_display}
                        </span>
                      </td>
                      <td>
                        <strong>{req.target_book_title || (isFa ? "عمومی" : "General")}</strong>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", maxInlineSize: "16rem" }}>
                          {req.available_slots && req.available_slots.length > 0 ? (
                            req.available_slots.map((sl, sIdx) => (
                              <span key={sIdx} className={styles.slotChip}>
                                {sl.day} {sl.time_window}
                              </span>
                            ))
                          ) : (
                            <span style={{ color: "var(--color-muted)", fontSize: "var(--font-size-meta)" }}>
                              {isFa ? "انعطاف‌پذیر" : "Flexible"}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <Button
                          type="button"
                          className={styles.actionButtonSecondary}
                          onClick={() =>
                            handleOpenClaimModal(
                              [req.id],
                              req.preferred_format === "solo"
                                ? `${req.target_book_title || "English"} - کلاس خصوصی با ${req.student_name}`
                                : `${req.target_book_title || "English"} - گروه آنلاین`,
                              req.available_slots?.map((s) => `${s.day} ${s.time_window}`).join("، ")
                            )
                          }
                        >
                          {isFa ? "پذیرش و تشکیل کلاس" : "Claim & Form Class"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </section>
      ) : null}

      {/* TAB 6: COMPREHENSIVE PROGRESS REPORT CARD */}
      {activeTab === "report" ? (
        <section aria-label={isFa ? "بخش کارنامه جامع پیشرفت" : "Progress Report Section"} className={styles.tabContent}>
          <ProgressReportCardStudio
            initialClassId={selectedClassId || activeClass?.id || (classes[0]?.id ?? "")}
            initialLearnerId={selectedLearnerForReport}
            classes={classes}
            locale={locale as any}
          />
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
              <Button
                type="button"
                className={styles.closeButton}
                onClick={() => setShowCreateClassModal(false)}
                aria-label={isFa ? "بستن" : "Close"}
              >
                ×
              </Button>
            </div>

            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "8px 12px", marginBlockEnd: "var(--space-3)", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8125rem", color: "#166534" }}>
              <span>✨</span>
              <span>
                {isFa
                  ? "پس از ایجاد کلاس، یک کد ۷ رقمی اختصاصی و یکتا به صورت خودکار برای کلاس صادر می‌شود که می‌توانید آن را با زبان‌آموزان به اشتراک بگذارید."
                  : "Upon creation, a unique 7-digit numeric code will automatically be generated for this class to share with learners."}
              </span>
            </div>

            <form onSubmit={handleCreateClass}>
              <div className={styles.formGroup}>
                <label htmlFor={newClassTitleId} className={styles.formLabel}>
                  {isFa ? "عنوان کلاس" : "Class Title"}
                </label>
                <Input
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
                <Input
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
                  <Input
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
              <div className={styles.formRow} style={{ marginBlockStart: "var(--space-3)" }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    {isFa ? "کتاب و منابع درسی" : "Coursebook / Materials"}
                  </label>
                  <Input
                    className={styles.formInput}
                    type="text"
                    value={newClassCoursebook}
                    onChange={(e) => setNewClassCoursebook(e.target.value)}
                    placeholder={isFa ? "مثال: Touchstone 2" : "e.g. Touchstone 2"}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    {isFa ? "گروه سنی" : "Age Group"}
                  </label>
                  <select
                    className={styles.formInput}
                    value={newClassAgeGroup}
                    onChange={(e) => setNewClassAgeGroup(e.target.value)}
                  >
                    <option value="yl">{isFa ? "کودکان (Young Learners)" : "Young Learners"}</option>
                    <option value="teen">{isFa ? "نوجوانان (Teens)" : "Teens"}</option>
                    <option value="adult">{isFa ? "بزرگسالان (Adults)" : "Adults"}</option>
                    <option value="mixed">{isFa ? "سنین مختلف (Mixed)" : "Mixed"}</option>
                  </select>
                </div>
              </div>
              <div className={styles.formRow} style={{ marginBlockStart: "var(--space-3)" }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    {isFa ? "هدف اصلی دوره" : "Primary Goal"}
                  </label>
                  <select
                    className={styles.formInput}
                    value={newClassGoal}
                    onChange={(e) => setNewClassGoal(e.target.value)}
                  >
                    <option value="general">{isFa ? "انگلیسی عمومی" : "General English"}</option>
                    <option value="speaking">{isFa ? "مکالمه و گفت‌وگو" : "Conversation"}</option>
                    <option value="exam">{isFa ? "آمادگی آزمون (IELTS/TOEFL)" : "Exam Prep"}</option>
                    <option value="business">{isFa ? "انگلیسی تجاری" : "Business English"}</option>
                    <option value="academic">{isFa ? "انگلیسی آکادمیک" : "Academic English"}</option>
                    <option value="travel">{isFa ? "انگلیسی سفر" : "Travel English"}</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    {isFa ? "مدت زمان پیش‌فرض جلسه (دقیقه)" : "Default Duration (mins)"}
                  </label>
                  <Input
                    className={styles.formInput}
                    type="number"
                    min={15}
                    max={180}
                    step={15}
                    value={newClassDuration}
                    onChange={(e) => setNewClassDuration(parseInt(e.target.value, 10))}
                  />
                </div>
              </div>

              {/* Schedule Days Picker */}
              <div className={styles.formGroup} style={{ marginBlockStart: "var(--space-3)" }}>
                <label className={styles.formLabel}>
                  {isFa ? "روزهای برگزاری کلاس" : "Scheduled Days of Week"}
                </label>
                <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", marginBlockStart: "var(--space-1)" }}>
                  {PERSIAN_DAYS.map((day) => {
                    const isSelected = newClassDays.includes(day.fa);
                    return (
                      <button
                        key={day.key}
                        type="button"
                        style={{
                          padding: "6px 12px",
                          borderRadius: "9999px",
                          border: isSelected ? "2px solid #0284c7" : "1px solid #cbd5e1",
                          background: isSelected ? "#e0f2fe" : "#ffffff",
                          color: isSelected ? "#0369a1" : "#334155",
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: "0.875rem",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                        onClick={() => {
                          if (isSelected) {
                            if (newClassDays.length > 1) {
                              setNewClassDays(newClassDays.filter((d) => d !== day.fa));
                            }
                          } else {
                            setNewClassDays([...newClassDays, day.fa]);
                          }
                        }}
                      >
                        {isFa ? day.fa : day.en}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Schedule Start & End Times */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)", marginBlockStart: "var(--space-3)" }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    {isFa ? "ساعت شروع جلسه (HH:MM)" : "Start Time (HH:MM)"}
                  </label>
                  <Input
                    className={styles.formInput}
                    type="time"
                    value={newClassTimeStart}
                    onChange={(e) => setNewClassTimeStart(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    {isFa ? "ساعت پایان جلسه (HH:MM)" : "End Time (HH:MM)"}
                  </label>
                  <Input
                    className={styles.formInput}
                    type="time"
                    value={newClassTimeEnd}
                    onChange={(e) => setNewClassTimeEnd(e.target.value)}
                  />
                </div>
              </div>

              {/* Adobe Connect Meeting URL */}
              <div className={styles.formGroup} style={{ marginBlockStart: "var(--space-3)" }}>
                <label className={styles.formLabel}>
                  {isFa ? "لینک اختصاصی اتاق Adobe Connect (اختیاری)" : "Custom Adobe Connect Room URL (Optional)"}
                </label>
                <Input
                  className={styles.formInput}
                  type="url"
                  value={newClassMeetingUrl}
                  onChange={(e) => setNewClassMeetingUrl(e.target.value)}
                  placeholder={isFa ? "در صورت خالی بودن، لینک استاندارد ایندورا تولید می‌شود" : "Leave empty to use Endoora default room"}
                />
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
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.actionButtonSecondary}
                  onClick={() => setShowCreateClassModal(false)}
                >
                  {isFa ? "انصراف" : "Cancel"}
                </Button>
                <Button type="submit" variant="primary" className={styles.actionButton}>
                  {isFa ? "ذخیره و ایجاد" : "Save & Create"}
                </Button>
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
              <Button
                type="button"
                className={styles.closeButton}
                onClick={() => setShowInviteModal(false)}
                aria-label={isFa ? "بستن" : "Close"}
              >
                ×
              </Button>
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
                    <Input
                      className={styles.formInput}
                      readOnly
                      value={generatedInviteCode}
                      style={{ flex: 1, fontFamily: "monospace" }}
                    />
                    <Button
                      type="button"
                      className={styles.actionButtonSecondary}
                      onClick={() => {
                        void navigator.clipboard.writeText(generatedInviteCode);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                    >
                      {copiedCode ? (isFa ? "کپی شد!" : "Copied!") : isFa ? "کپی کد" : "Copy"}
                    </Button>
                  </div>
                </div>
                <div className={styles.modalFooter}>
                  <Button
                    type="button"
                    variant="primary"
                    className={styles.actionButton}
                    onClick={() => setShowInviteModal(false)}
                  >
                    {isFa ? "اتمام" : "Done"}
                  </Button>
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
                    {isFa ? "ایمیل حساب کاربری زبان‌آموز در ایندورا" : "Learner's Endoora Account Email"}
                  </label>
                  <Input
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
                  <Button
                    type="button"
                    variant="secondary"
                    className={styles.actionButtonSecondary}
                    onClick={() => setShowInviteModal(false)}
                  >
                    {isFa ? "انصراف" : "Cancel"}
                  </Button>
                  <Button type="submit" variant="primary" className={styles.actionButton}>
                    {isFa ? "ارسال دعوت‌نامه" : "Generate Invitation"}
                  </Button>
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
              <Button
                type="button"
                className={styles.closeButton}
                onClick={() => setSelectedLearnerOverview(null)}
                aria-label={isFa ? "بستن" : "Close"}
              >
                ×
              </Button>
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
                  ? "مرز حریم خصوصی ایندورا: چت‌های هوش مصنوعی اختصاصی، صدای ضبط‌شده در اتاق تمرین شخصی و تمرین‌های فردی زبان‌آموز کاملاً محرمانه نگه داشته می‌شوند و به مدرس نشان داده نمی‌شوند."
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
              <Table className={styles.table}>
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
              </Table>
            </div>

            <div className={styles.modalFooter}>
              <Button
                type="button"
                variant="primary"
                className={styles.actionButton}
                onClick={() => setSelectedLearnerOverview(null)}
              >
                {isFa ? "بستن پرونده" : "Close Overview"}
              </Button>
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
              <Button
                type="button"
                className={styles.closeButton}
                onClick={() => setShowScheduleModal(false)}
                aria-label={isFa ? "بستن" : "Close"}
              >
                ×
              </Button>
            </div>
            <form onSubmit={handleScheduleSession}>
              <div className={styles.formGroup}>
                <label htmlFor={sessionTitleId} className={styles.formLabel}>
                  {isFa ? "عنوان جلسه" : "Session Title"}
                </label>
                <Input
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
                  <Input
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
                  <Input
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
                <Input
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
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.actionButtonSecondary}
                  onClick={() => setShowScheduleModal(false)}
                >
                  {isFa ? "انصراف" : "Cancel"}
                </Button>
                <Button type="submit" variant="primary" className={styles.actionButton}>
                  {isFa ? "ثبت برنامه جلسه" : "Schedule Session"}
                </Button>
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
              <Button
                type="button"
                className={styles.closeButton}
                onClick={() => setShowTerminateModal(false)}
                aria-label={isFa ? "بستن" : "Close"}
              >
                ×
              </Button>
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
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.actionButtonSecondary}
                  onClick={() => setShowTerminateModal(false)}
                >
                  {isFa ? "انصراف" : "Cancel"}
                </Button>
                <Button type="submit" variant="destructive" className={styles.actionButtonDanger}>
                  {isFa ? "خاتمه قطعی ارتباط" : "Confirm Termination"}
                </Button>
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
              <Button
                type="button"
                className={styles.closeButton}
                onClick={() => setShowAdjustModal(false)}
                aria-label={isFa ? "بستن" : "Close"}
              >
                ×
              </Button>
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
                <Input
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
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.actionButtonSecondary}
                  onClick={() => setShowAdjustModal(false)}
                >
                  {isFa ? "انصراف" : "Cancel"}
                </Button>
                <Button type="submit" variant="primary" className={styles.actionButton}>
                  {isFa ? "ثبت اصلاحیه و لاگ حسابرسی" : "Record Audited Adjustment"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* MODAL: CLAIM COHORT / FORM LIVE CLASS */}
      {showClaimModal ? (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-labelledby={claimTitleId}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 id={claimTitleId} className={styles.modalTitle}>
                {isFa ? "تشکیل کلاس زنده و پذیرش گروه" : "Form Class & Claim Cohort"}
              </h2>
              <Button
                type="button"
                className={styles.closeButton}
                onClick={() => setShowClaimModal(false)}
                aria-label={isFa ? "بستن" : "Close"}
              >
                ×
              </Button>
            </div>
            <form onSubmit={handleClaimCohort}>
              <div className={styles.infoBanner} style={{ marginBlockEnd: "var(--space-3)" }}>
                <span>👥</span>
                <span>
                  {isFa
                    ? `تعداد زبان‌آموزان انتخاب‌شده برای این کلاس: ${claimRequestIds.length} نفر. با ثبت نهایی، وضعیت درخواست این زبان‌آموزان به «تخصیص‌یافته» تغییر یافته و لینک جلسه به آن‌ها اعلام می‌شود.`
                    : `Claiming ${claimRequestIds.length} student(s). Once claimed, the cohort will be created and meeting links shared with enrolled learners.`}
                </span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor={claimTitleId} className={styles.formLabel}>
                  {isFa ? "عنوان کلاس" : "Cohort Title"}
                </label>
                <Input
                  id={claimTitleId}
                  className={styles.formInput}
                  type="text"
                  required
                  value={claimTitle}
                  onChange={(e) => setClaimTitle(e.target.value)}
                  placeholder={isFa ? "مثلاً: American English File 2 - گروه پنج‌شنبه‌ها" : "e.g. American English File 2 - Weekend Group"}
                />
              </div>

              <div className={styles.formGroup} style={{ marginBlockStart: "var(--space-3)" }}>
                <label htmlFor={claimUrlId} className={styles.formLabel}>
                  {isFa ? "لینک کلاس آنلاین (اسکای‌روم / گوگل میت)" : "Live Meeting URL (Skyroom / Google Meet)"}
                </label>
                <Input
                  id={claimUrlId}
                  className={styles.formInput}
                  type="url"
                  required
                  value={claimMeetingUrl}
                  onChange={(e) => setClaimMeetingUrl(e.target.value)}
                  placeholder="https://www.skyroom.online/ch/endoora/..."
                />
              </div>

              <div className={styles.formGroup} style={{ marginBlockStart: "var(--space-3)" }}>
                <label htmlFor={claimScheduleId} className={styles.formLabel}>
                  {isFa ? "خلاصه زمان‌بندی هفتگی" : "Schedule Summary"}
                </label>
                <Input
                  id={claimScheduleId}
                  className={styles.formInput}
                  type="text"
                  value={claimScheduleSummary}
                  onChange={(e) => setClaimScheduleSummary(e.target.value)}
                  placeholder={isFa ? "مثلاً: پنج‌شنبه‌ها ساعت ۱۸:۰۰ تا ۱۹:۳۰" : "e.g. Thursdays 18:00 - 19:30"}
                />
              </div>

              <div className={styles.modalFooter}>
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.actionButtonSecondary}
                  onClick={() => setShowClaimModal(false)}
                >
                  {isFa ? "انصراف" : "Cancel"}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className={styles.actionButton}
                  disabled={claiming}
                >
                  {claiming
                    ? isFa ? "در حال تشکیل کلاس..." : "Creating Cohort..."
                    : isFa ? "تایید و تشکیل کلاس زنده 🚀" : "Confirm & Form Class 🚀"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* MODAL: POST-SESSION TEACHING & HOMEWORK LOG */}
      {showSessionLogModal ? (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-labelledby={logUnitsId}>
          <div className={styles.modalContent} style={{ maxWidth: "38rem" }}>
            <div className={styles.modalHeader}>
              <h2 id={logUnitsId} className={styles.modalTitle}>
                {isFa ? "ثبت گزارش جلسه، تدریس و تکالیف هوشمند" : "Log Teaching Session & Homework"}
              </h2>
              <Button
                type="button"
                className={styles.closeButton}
                onClick={() => setShowSessionLogModal(false)}
                aria-label={isFa ? "بستن" : "Close"}
              >
                ×
              </Button>
            </div>
            <form onSubmit={handleLogTeachingSession}>
              <div className={styles.infoBanner} style={{ marginBlockEnd: "var(--space-3)" }}>
                <span>🎯</span>
                <span>
                  {isFa
                    ? "اتصال مستقیم به ماموریت روزانه: تکالیف، واژگان و گرامر ثبت‌شده در این فرم مستقیماً به عنوان تسک اولویت‌دار در «گام ۶: ماموریت روزانه انطباقی» و بانک SRS زبان‌آموزان این کلاس قرار می‌گیرد."
                    : "Direct Step 6 Integration: The homework, grammar, and vocabulary entered here automatically inject into the daily missions and SRS queues of all enrolled students."}
                </span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  {isFa ? "انتخاب کلاس / گروه" : "Target Class / Cohort"}
                </label>
                <select
                  className={styles.formInput}
                  value={logTargetClassId}
                  onChange={(e) => setLogTargetClassId(e.target.value)}
                  required
                >
                  <option value="">{isFa ? "-- کلاس را انتخاب کنید --" : "-- Select Class --"}</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.title} ({cls.level})
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup} style={{ marginBlockStart: "var(--space-3)" }}>
                <label htmlFor={logUnitsId} className={styles.formLabel}>
                  {isFa ? "درس‌ها و صفحات تدریس‌شده (اجباری)" : "Units & Pages Covered (Required)"}
                </label>
                <Input
                  id={logUnitsId}
                  className={styles.formInput}
                  type="text"
                  required
                  value={logUnitsCovered}
                  onChange={(e) => setLogUnitsCovered(e.target.value)}
                  placeholder={isFa ? "مثلاً: American English File 2 - Unit 3A & 3B (pp. 24-27)" : "e.g. Unit 3A & 3B (pp. 24-27)"}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)", marginBlockStart: "var(--space-3)" }}>
                <div className={styles.formGroup}>
                  <label htmlFor={logGrammarId} className={styles.formLabel}>
                    {isFa ? "نکات گرامری تدریس‌شده" : "Grammar Focus"}
                  </label>
                  <Input
                    id={logGrammarId}
                    className={styles.formInput}
                    type="text"
                    value={logGrammarCovered}
                    onChange={(e) => setLogGrammarCovered(e.target.value)}
                    placeholder={isFa ? "Past Continuous vs Past Simple" : "e.g. Past Continuous vs Simple"}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor={logVocabId} className={styles.formLabel}>
                    {isFa ? "واژگان جدید (با ویرگول جدا کنید)" : "Target Vocabulary (comma-separated)"}
                  </label>
                  <Input
                    id={logVocabId}
                    className={styles.formInput}
                    type="text"
                    value={logVocabList}
                    onChange={(e) => setLogVocabList(e.target.value)}
                    placeholder={isFa ? "commute, pedestrian, delay, fine" : "commute, pedestrian, delay"}
                  />
                </div>
              </div>

              <div className={styles.formGroup} style={{ marginBlockStart: "var(--space-3)" }}>
                <label htmlFor={logHomeworkId} className={styles.formLabel}>
                  {isFa ? "شرح تکالیف محول‌شده (تمرینات کتاب کار و AI Labs)" : "Homework Description (Workbook & AI Labs)"}
                </label>
                <textarea
                  id={logHomeworkId}
                  className={styles.formTextarea}
                  rows={3}
                  value={logHomework}
                  onChange={(e) => setLogHomework(e.target.value)}
                  placeholder={isFa ? "حل تمرین‌های کتاب کار ص ۲۵؛ نگارش یک داستان کوتاه در AI Writing Mentor درباره یک اتفاق ناگهانی" : "Workbook p.25 exercises 1-4; Write a 100-word story in AI Writing Mentor about an accident."}
                />
              </div>

              <div className={styles.formGroup} style={{ marginBlockStart: "var(--space-3)" }}>
                <label htmlFor={logNotesId} className={styles.formLabel}>
                  {isFa ? "یادداشت‌های تدریس و بازخورد کلاسی" : "Teacher Notes & Observations"}
                </label>
                <textarea
                  id={logNotesId}
                  className={styles.formTextarea}
                  rows={2}
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder={isFa ? "سطح مشارکت عالی بود، روی تلفظ -ed در گذشته تمرکز بیشتری شود." : "Great participation, need more focus on -ed endings pronunciation."}
                />
              </div>

              <div className={styles.modalFooter}>
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.actionButtonSecondary}
                  onClick={() => setShowSessionLogModal(false)}
                >
                  {isFa ? "انصراف" : "Cancel"}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className={styles.actionButton}
                  disabled={loggingSession}
                >
                  {loggingSession
                    ? isFa ? "در حال ثبت..." : "Submitting..."
                    : isFa ? "ثبت گزارش و ارسال به زبان‌آموزان ✓" : "Save Log & Sync with Students ✓"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Adobe Connect Launcher Modal */}
      {launcherClass ? (
        <AdobeConnectLauncherModal
          isOpen={Boolean(launcherClass)}
          onClose={() => setLauncherClass(null)}
          classId={launcherClass.id}
          classTitle={launcherClass.title}
          scheduleDays={launcherClass.schedule_days}
          scheduleTimeStart={launcherClass.schedule_time_start}
          scheduleTimeEnd={launcherClass.schedule_time_end}
          meetingUrl={launcherClass.meeting_url}
          adobeConnectUrl={launcherClass.adobe_connect_url}
          adobeConnectAppUrl={launcherClass.adobe_connect_app_url}
          isTeacher={true}
          locale={locale as any}
          onMeetingUrlUpdated={(newUrl) => {
            setClasses((prev) =>
              prev.map((c) =>
                c.id === launcherClass.id
                  ? { ...c, meeting_url: newUrl, adobe_connect_url: newUrl }
                  : c
              )
            );
            if (selectedClass && selectedClass.id === launcherClass.id) {
              setSelectedClassDetail((prev) =>
                prev
                  ? {
                      ...prev,
                      class: {
                        ...prev.class,
                        meeting_url: newUrl,
                        adobe_connect_url: newUrl,
                      },
                    }
                  : null
              );
            }
          }}
        />
      ) : null}
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#0f172a",
            color: "#ffffff",
            padding: "10px 20px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            zIndex: 9999,
            fontSize: "0.875rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>✅</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

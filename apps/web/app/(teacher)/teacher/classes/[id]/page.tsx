"use client";

import { Button, Input, Table } from "@endoora/ui";
import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import styles from "./class-hub.module.css";
import { useTeacherHome } from "@/components/teacher/TeacherShell";
import {
  fetchClassOutcomes,
  recordClassOutcome,
  fetchNextLessonRecommendation,
  fetchTeacherMaterials,
  fetchSpacedReviews,
} from "@/lib/teacheros-api";
import {
  fetchTeacherClassDetail,
  updateTeacherClass,
  scheduleClassSession,
  updateClassSession,
  deleteClassSession,
  inviteLearnerToClass,
  type TeacherLearnerLink,
  type ClassSession,
} from "@/lib/teacher-classes";

type ClassDetailResponse = Awaited<ReturnType<typeof fetchTeacherClassDetail>>;
import type {
  LessonOutcome,
  NextLessonRecommendation,
  TeacherMaterial,
  SpacedReviewItem,
} from "@endoora/contracts";

type PillarTab = "class_students" | "planning_prep" | "assessment_feedback" | "supertools";
type SessionFilter = "all" | "scheduled" | "completed" | "cancelled";

const CEFR_LEVELS = [
  { value: "A1", label: "A1 · Beginner / مبتدی" },
  { value: "A2", label: "A2 · Elementary / پایه" },
  { value: "B1", label: "B1 · Intermediate / متوسط" },
  { value: "B2", label: "B2 · Upper-Intermediate / فوق متوسط" },
  { value: "C1", label: "C1 · Advanced / پیشرفته" },
  { value: "C2", label: "C2 · Mastery / تسلط کامل" },
];

const AGE_GROUPS = [
  { value: "yl", labelFa: "کودکان (Young Learners)", labelEn: "Young Learners" },
  { value: "teen", labelFa: "نوجوانان (Teens)", labelEn: "Teens" },
  { value: "adult", labelFa: "بزرگسالان (Adults)", labelEn: "Adults" },
  { value: "mixed", labelFa: "سنین مختلف (Mixed)", labelEn: "Mixed Ages" },
];

const CLASS_SIZES = [
  { value: "one", labelFa: "تک‌نفره (خصوصی)", labelEn: "One-to-One" },
  { value: "small", labelFa: "۲ تا ۵ نفر (نیمه‌خصوصی)", labelEn: "2-5 Learners" },
  { value: "medium", labelFa: "۶ تا ۱۲ نفر (گروهی کوچک)", labelEn: "6-12 Learners" },
  { value: "large", labelFa: "۱۳ تا ۲۰ نفر (کلاس عمومی)", labelEn: "13-20 Learners" },
  { value: "xlarge", labelFa: "بیش از ۲۱ نفر", labelEn: "21+ Learners" },
];

const GOALS = [
  { value: "general", labelFa: "انگلیسی عمومی", labelEn: "General English" },
  { value: "speaking", labelFa: "مکالمه و گفت‌وگو", labelEn: "Conversation & Fluency" },
  { value: "exam", labelFa: "آمادگی آزمون (IELTS/TOEFL)", labelEn: "Exam Preparation" },
  { value: "business", labelFa: "انگلیسی تجاری و کاری", labelEn: "Business English" },
  { value: "academic", labelFa: "انگلیسی آکادمیک", labelEn: "Academic English" },
  { value: "travel", labelFa: "انگلیسی سفر", labelEn: "Travel English" },
];

const SKILL_OPTIONS = [
  { id: "spk", labelFa: "مکالمه (Speaking)", labelEn: "Speaking" },
  { id: "lst", labelFa: "شنیداری (Listening)", labelEn: "Listening" },
  { id: "read", labelFa: "خواندن (Reading)", labelEn: "Reading" },
  { id: "write", labelFa: "نوشتاری (Writing)", labelEn: "Writing" },
  { id: "gram", labelFa: "گرامر و ساختار", labelEn: "Grammar" },
  { id: "vocab", labelFa: "واژگان و اصطلاحات", labelEn: "Vocabulary" },
  { id: "pron", labelFa: "تلفظ و لهجه", labelEn: "Pronunciation" },
];

const METHODOLOGIES = [
  { id: "comm", labelFa: "ارتباط‌محور (مکالمه و تعامل)", labelEn: "Communicative" },
  { id: "struct", labelFa: "ساختاریافته و منظم", labelEn: "Structured (PPP)" },
  { id: "task", labelFa: "وظیفه‌محور (Task-Based)", labelEn: "Task-Based (TBL)" },
  { id: "game", labelFa: "بازی و گیمیفیکیشن", labelEn: "Interactive / Games" },
  { id: "exam", labelFa: "تست و آزمون‌محور", labelEn: "Exam-Oriented" },
  { id: "balanced", labelFa: "متعادل و ترکیبی", labelEn: "Balanced Hybrid" },
];

const EQUIPMENT_OPTIONS = [
  { id: "board", labelFa: "تخته و ابزار نوشتن", labelEn: "Whiteboard" },
  { id: "audio", labelFa: "صوت و اسپیکر", labelEn: "Audio / Speakers" },
  { id: "proj", labelFa: "ویدئو پروژکتور / نمایشگر", labelEn: "Display / Projector" },
  { id: "net", labelFa: "اینترنت پرسرعت کلاسی", labelEn: "Classroom Internet" },
];

export default function ClassHubPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const classId = resolvedParams.id;
  const { locale, setActiveClass } = useTeacherHome();
  const isFa = locale === "fa";

  const [activeTab, setActiveTab] = useState<PillarTab>("class_students");
  const [sessionFilter, setSessionFilter] = useState<SessionFilter>("all");
  const [classDetail, setClassDetail] = useState<ClassDetailResponse | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showEditClassModal, setShowEditClassModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [completingSession, setCompletingSession] = useState<ClassSession | null>(null);
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);

  // Edit Class Form state
  const [editTitle, setEditTitle] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editLevel, setEditLevel] = useState("B1");
  const [editCoursebook, setEditCoursebook] = useState("");
  const [editAgeGroup, setEditAgeGroup] = useState("adult");
  const [editClassSizeType, setEditClassSizeType] = useState("small");
  const [editDefaultDuration, setEditDefaultDuration] = useState(60);
  const [editGoal, setEditGoal] = useState("general");
  const [editFocusSkills, setEditFocusSkills] = useState<string[]>([]);
  const [editEquipment, setEditEquipment] = useState<string[]>([]);
  const [editPreferences, setEditPreferences] = useState<string[]>([]);
  const [editTargetExams, setEditTargetExams] = useState("");
  const [editCapacity, setEditCapacity] = useState(10);
  const [editPrivateNotes, setEditPrivateNotes] = useState("");
  const [savingClassProfile, setSavingClassProfile] = useState(false);

  // Schedule Session Form state
  const [newSessionTitle, setNewSessionTitle] = useState("");
  const [newSessionStart, setNewSessionStart] = useState("");
  const [newSessionEnd, setNewSessionEnd] = useState("");
  const [newSessionDuration, setNewSessionDuration] = useState(60);
  const [newSessionLearnerId, setNewSessionLearnerId] = useState("");
  const [newSessionNotes, setNewSessionNotes] = useState("");
  const [schedulingSession, setSchedulingSession] = useState(false);

  // Complete Session Form state
  const [completeNotes, setCompleteNotes] = useState("");
  const [confirmedByLearner, setConfirmedByLearner] = useState(false);
  const [submittingComplete, setSubmittingComplete] = useState(false);

  // Invite Learner Form state
  const [inviteEmail, setInviteEmail] = useState("");
  const [submittingInvite, setSubmittingInvite] = useState(false);
  const [inviteResultLink, setInviteResultLink] = useState<TeacherLearnerLink | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Pillar 1: Outcomes & Check-in
  const [outcomes, setOutcomes] = useState<LessonOutcome[]>([]);
  const [outcomeResult, setOutcomeResult] = useState<"success" | "partial" | "needs_repeat">("success");
  const [outcomeDifficulty, setOutcomeDifficulty] = useState(3);
  const [outcomeCompletion, setOutcomeCompletion] = useState(100);
  const [outcomeNotes, setOutcomeNotes] = useState("");
  const [outcomeReminders, setOutcomeReminders] = useState("");
  const [submittingOutcome, setSubmittingOutcome] = useState(false);

  // Pillar 2: Next Lesson Recommendation & Materials
  const [recommendation, setRecommendation] = useState<NextLessonRecommendation | null>(null);
  const [materials, setMaterials] = useState<TeacherMaterial[]>([]);

  // Pillar 4: Spaced Reviews
  const [spacedReviews, setSpacedReviews] = useState<SpacedReviewItem[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const detail = await fetchTeacherClassDetail(classId);
        if (!mounted) return;
        setClassDetail(detail);

        if (detail?.class) {
          setActiveClass({
            id: detail.class.id,
            title: detail.class.title,
            level: detail.class.level,
            subject: detail.class.subject,
          });

          // Sync Edit Profile initial form values
          setEditTitle(detail.class.title || "");
          setEditSubject(detail.class.subject || "");
          setEditLevel(detail.class.level || "B1");
          setEditCoursebook(detail.class.coursebook || "");
          setEditAgeGroup(detail.class.age_group || "adult");
          setEditClassSizeType(detail.class.class_size_type || "small");
          setEditDefaultDuration(detail.class.default_duration || 60);
          setEditGoal(detail.class.goal || "general");
          setEditFocusSkills(detail.class.focus_skills || []);
          setEditEquipment(detail.class.equipment || []);
          setEditPreferences(detail.class.teaching_preferences || []);
          setEditTargetExams(detail.class.target_exams || "");
          setEditCapacity(detail.class.max_capacity || 10);
          setEditPrivateNotes(detail.class.private_notes || "");
        }

        const [outcomesData, recData, materialsData, srsData] = await Promise.all([
          fetchClassOutcomes(classId).catch(() => []),
          fetchNextLessonRecommendation(classId).catch(() => null),
          fetchTeacherMaterials({ class_id: classId }).catch(() => []),
          fetchSpacedReviews(classId).catch(() => []),
        ]);

        if (mounted) {
          setOutcomes(outcomesData);
          setRecommendation(recData);
          setMaterials(materialsData);
          setSpacedReviews(srsData);
          setLoading(false);
        }
      } catch {
        if (mounted) setLoading(false);
      }
    }
    void load();
    return () => {
      mounted = false;
    };
  }, [classId, refreshKey, setActiveClass]);

  // Save Class Profile
  const handleSaveClassProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingClassProfile(true);
    try {
      await updateTeacherClass(classId, {
        title: editTitle,
        subject: editSubject,
        level: editLevel,
        coursebook: editCoursebook,
        age_group: editAgeGroup,
        class_size_type: editClassSizeType,
        default_duration: editDefaultDuration,
        goal: editGoal,
        focus_skills: editFocusSkills,
        equipment: editEquipment,
        teaching_preferences: editPreferences,
        target_exams: editTargetExams,
        max_capacity: editCapacity,
        private_notes: editPrivateNotes,
      });
      setShowEditClassModal(false);
      setRefreshKey((k) => k + 1);
    } catch {
      alert(isFa ? "خطا در به‌روزرسانی مشخصات کلاس." : "Failed to update class profile.");
    } finally {
      setSavingClassProfile(false);
    }
  };

  // Schedule Session
  const handleScheduleSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setSchedulingSession(true);
    try {
      const startIso = new Date(newSessionStart).toISOString();
      const endIso = newSessionEnd
        ? new Date(newSessionEnd).toISOString()
        : new Date(new Date(newSessionStart).getTime() + newSessionDuration * 60000).toISOString();

      await scheduleClassSession(classId, {
        title: newSessionTitle,
        scheduled_start: startIso,
        scheduled_end: endIso,
        duration_minutes: newSessionDuration,
        learner_id: newSessionLearnerId || null,
        session_notes: newSessionNotes,
      });

      setShowScheduleModal(false);
      setNewSessionTitle("");
      setNewSessionStart("");
      setNewSessionEnd("");
      setNewSessionNotes("");
      setRefreshKey((k) => k + 1);
    } catch {
      alert(isFa ? "خطا در برنامه‌ریزی جلسه جدید." : "Failed to schedule session.");
    } finally {
      setSchedulingSession(false);
    }
  };

  // Toggle Session Status
  const handleToggleStatus = async (session: ClassSession, targetStatus: "scheduled" | "completed" | "cancelled") => {
    if (targetStatus === "completed") {
      setCompletingSession(session);
      setCompleteNotes(session.session_notes || "");
      return;
    }

    try {
      await updateClassSession(classId, session.id, { status: targetStatus });
      setRefreshKey((k) => k + 1);
    } catch {
      alert(isFa ? "خطا در تغییر وضعیت جلسه." : "Failed to change session status.");
    }
  };

  // Confirm Session Completion
  const handleConfirmComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingSession) return;
    setSubmittingComplete(true);
    try {
      await updateClassSession(classId, completingSession.id, {
        status: "completed",
        session_notes: completeNotes,
        confirmed_by_learner: confirmedByLearner,
      });
      setCompletingSession(null);
      setCompleteNotes("");
      setRefreshKey((k) => k + 1);
    } catch {
      alert(isFa ? "خطا در ثبت نهایی جلسه." : "Failed to complete session.");
    } finally {
      setSubmittingComplete(false);
    }
  };

  // Delete Session
  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm(isFa ? "آیا از حذف این جلسه اطمینان دارید؟" : "Are you sure you want to delete this session?")) {
      return;
    }
    try {
      await deleteClassSession(classId, sessionId);
      setRefreshKey((k) => k + 1);
    } catch {
      alert(isFa ? "خطا در حذف جلسه." : "Failed to delete session.");
    }
  };

  // Invite Learner
  const handleInviteLearner = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingInvite(true);
    try {
      const link = await inviteLearnerToClass(classId, { learner_email: inviteEmail });
      setInviteResultLink(link);
      setInviteEmail("");
      setRefreshKey((k) => k + 1);
    } catch {
      alert(isFa ? "خطا در ارسال دعوت‌نامه. بررسی کنید ایمیل زبان‌آموز در سیستم وجود داشته باشد." : "Failed to invite learner.");
    } finally {
      setSubmittingInvite(false);
    }
  };

  const handleCopyInviteCode = (code: string) => {
    void navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Record Outcome
  const handleRecordOutcome = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingOutcome(true);
    try {
      const remindersList = outcomeReminders
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean);

      await recordClassOutcome(classId, {
        result: outcomeResult,
        difficulty_rating: outcomeDifficulty,
        completion_percent: outcomeCompletion,
        notes: outcomeNotes,
        summary: outcomeNotes.slice(0, 100),
        followup_reminders: remindersList,
      });

      setShowOutcomeModal(false);
      setOutcomeNotes("");
      setOutcomeReminders("");
      setRefreshKey((k) => k + 1);
    } catch {
      alert(isFa ? "خطا در ثبت نتیجه جلسه." : "Error recording outcome.");
    } finally {
      setSubmittingOutcome(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--color-muted)" }}>
          {isFa ? "در حال بارگیری داشبورد کلاس..." : "Loading Class Intelligence Hub..."}
        </p>
      </div>
    );
  }

  const cls = classDetail?.class;
  const enrollments = classDetail?.enrollments ?? [];
  const sessions = classDetail?.sessions ?? [];

  // Filtered Sessions
  const filteredSessions = sessions.filter((s) => {
    if (sessionFilter === "all") return true;
    return s.status === sessionFilter;
  });

  const scheduledCount = sessions.filter((s) => s.status === "scheduled").length;
  const completedCount = sessions.filter((s) => s.status === "completed").length;
  const cancelledCount = sessions.filter((s) => s.status === "cancelled").length;

  const ageGroupItem = AGE_GROUPS.find((a) => a.value === cls?.age_group);
  const goalItem = GOALS.find((g) => g.value === cls?.goal);
  const sizeItem = CLASS_SIZES.find((s) => s.value === cls?.class_size_type);

  return (
    <div className={styles.container}>
      {/* Class Hub Header Card */}
      <section className={styles.headerCard}>
        <div className={styles.headerInfo}>
          <div className={styles.metaRow}>
            <h1>{cls?.title ?? (isFa ? "داشبورد هوشمند کلاس" : "Class Intelligence Hub")}</h1>
            <span className={styles.levelBadge}>{cls?.level ?? "B1"}</span>
            {cls?.coursebook && (
              <span className={styles.coursebookBadge}>
                📖 {isFa ? `کتاب: ${cls.coursebook}` : `Book: ${cls.coursebook}`}
              </span>
            )}
            {ageGroupItem && (
              <span className={styles.ageBadge}>
                👥 {isFa ? ageGroupItem.labelFa : ageGroupItem.labelEn}
              </span>
            )}
            {goalItem && (
              <span className={styles.goalBadge}>
                🎯 {isFa ? goalItem.labelFa : goalItem.labelEn}
              </span>
            )}
          </div>

          <div className={styles.metaRow} style={{ marginTop: "var(--space-2)" }}>
            <span className={styles.metaText}>
              {isFa ? `موضوع: ${cls?.subject || "عمومی"}` : `Subject: ${cls?.subject || "General"}`}
            </span>
            <span className={styles.metaText}>•</span>
            <span className={styles.metaText}>
              {isFa ? `${enrollments.length} زبان‌آموز فعال` : `${enrollments.length} Active Students`}
            </span>
            <span className={styles.metaText}>•</span>
            <span className={styles.metaText}>
              {isFa ? `ظرفیت: ${cls?.max_capacity || 10} نفر` : `Capacity: ${cls?.max_capacity || 10}`}
            </span>
            {cls?.target_exams && (
              <>
                <span className={styles.metaText}>•</span>
                <span className={styles.tagBadge}>🎓 {cls.target_exams}</span>
              </>
            )}
          </div>

          {/* Focus Skills Badges */}
          {cls?.focus_skills && cls.focus_skills.length > 0 && (
            <div className={styles.metaRow} style={{ marginTop: "var(--space-2)" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--color-muted)", fontWeight: 600 }}>
                {isFa ? "مهارت‌های تمرکز: " : "Focus Skills: "}
              </span>
              {cls.focus_skills.map((skillId) => {
                const opt = SKILL_OPTIONS.find((s) => s.id === skillId);
                return (
                  <span key={skillId} className={styles.tagBadge}>
                    ✨ {opt ? (isFa ? opt.labelFa : opt.labelEn) : skillId}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", alignItems: "center" }}>
          <Button
            type="button"
            variant="secondary"
            className={styles.btnSecondary}
            onClick={() => setShowEditClassModal(true)}
          >
            <span>✏️ {isFa ? "ویرایش مشخصات کلاس" : "Edit Profile"}</span>
          </Button>

          <Button
            type="button"
            variant="secondary"
            className={styles.btnSecondary}
            onClick={() => setShowInviteModal(true)}
          >
            <span>➕ {isFa ? "دعوت از زبان‌آموز" : "Invite Student"}</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            className={styles.btnPrimary}
            onClick={() => setShowOutcomeModal(true)}
          >
            <span>📝 {isFa ? "ثبت نتیجه جلسه (۳۰ ثانیه)" : "30s Outcome Check-in"}</span>
          </Button>

          <Link href={`/teacher/planning?class_id=${classId}`} className={styles.btnSecondary}>
            <span>⚡ {isFa ? "تولید طرح درس متناسب" : "Plan Next Lesson"}</span>
          </Link>
        </div>
      </section>

      {/* 4-Pillar Navigation Tabs */}
      <nav className={styles.pillarTabs}>
        <Button
          type="button"
          variant={activeTab === "class_students" ? "primary" : "secondary"}
          size="sm"
          className={styles.pillarTab}
          data-active={activeTab === "class_students"}
          onClick={() => setActiveTab("class_students")}
        >
          🏫 {isFa ? "رکن ۱: کلاس و زبان‌آموزان" : "Pillar 1: Class & Students"}
        </Button>
        <Button
          type="button"
          variant={activeTab === "planning_prep" ? "primary" : "secondary"}
          size="sm"
          className={styles.pillarTab}
          data-active={activeTab === "planning_prep"}
          onClick={() => setActiveTab("planning_prep")}
        >
          📚 {isFa ? "رکن ۲: طرح درس و تولید محتوا" : "Pillar 2: Planning & Prep"}
        </Button>
        <Button
          type="button"
          variant={activeTab === "assessment_feedback" ? "primary" : "secondary"}
          size="sm"
          className={styles.pillarTab}
          data-active={activeTab === "assessment_feedback"}
          onClick={() => setActiveTab("assessment_feedback")}
        >
          🔬 {isFa ? "رکن ۳: تحلیل تکالیف و ارزیابی" : "Pillar 3: Assessment & Evidence"}
        </Button>
        <Button
          type="button"
          variant={activeTab === "supertools" ? "primary" : "secondary"}
          size="sm"
          className={styles.pillarTab}
          data-active={activeTab === "supertools"}
          onClick={() => setActiveTab("supertools")}
        >
          🚀 {isFa ? "رکن ۴: ابزارهای پیشرفته معلم" : "Pillar 4: Supertools"}
        </Button>
      </nav>

      {/* PILLAR 1: CLASS & STUDENTS */}
      {activeTab === "class_students" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          {/* Section 1: Pedagogical Profile & Settings Card */}
          <section className={styles.surfaceCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3>⚙️ {isFa ? "مشخصات و ترجیحات آموزشی کلاس (Class Pedagogical Profile)" : "Class Pedagogical Profile"}</h3>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className={styles.btnSecondary}
                onClick={() => setShowEditClassModal(true)}
              >
                ✏️ {isFa ? "ویرایش مشخصات" : "Edit Profile"}
              </Button>
            </div>

            <div className={styles.profileGrid}>
              <div className={styles.profileItem}>
                <span className={styles.profileItemLabel}>{isFa ? "سطح زبانی CEFR" : "CEFR Level"}</span>
                <span className={styles.profileItemValue}>{cls?.level || "B1"}</span>
              </div>

              <div className={styles.profileItem}>
                <span className={styles.profileItemLabel}>{isFa ? "کتاب و منابع آموزشی" : "Coursebook"}</span>
                <span className={styles.profileItemValue}>{cls?.coursebook || (isFa ? "تنظیم نشده" : "Not specified")}</span>
              </div>

              <div className={styles.profileItem}>
                <span className={styles.profileItemLabel}>{isFa ? "گروه سنی" : "Age Group"}</span>
                <span className={styles.profileItemValue}>
                  {ageGroupItem ? (isFa ? ageGroupItem.labelFa : ageGroupItem.labelEn) : (cls?.age_group || "-")}
                </span>
              </div>

              <div className={styles.profileItem}>
                <span className={styles.profileItemLabel}>{isFa ? "نوع و اندازه کلاس" : "Class Size"}</span>
                <span className={styles.profileItemValue}>
                  {sizeItem ? (isFa ? sizeItem.labelFa : sizeItem.labelEn) : (cls?.class_size_type || "-")}
                </span>
              </div>

              <div className={styles.profileItem}>
                <span className={styles.profileItemLabel}>{isFa ? "مدت استاندارد جلسه" : "Default Duration"}</span>
                <span className={styles.profileItemValue}>
                  {cls?.default_duration || 60} {isFa ? "دقیقه" : "minutes"}
                </span>
              </div>

              <div className={styles.profileItem}>
                <span className={styles.profileItemLabel}>{isFa ? "هدف اصلی دوره" : "Primary Goal"}</span>
                <span className={styles.profileItemValue}>
                  {goalItem ? (isFa ? goalItem.labelFa : goalItem.labelEn) : (cls?.goal || "-")}
                </span>
              </div>

              <div className={styles.profileItem}>
                <span className={styles.profileItemLabel}>{isFa ? "آزمون‌های هدف" : "Target Exams"}</span>
                <span className={styles.profileItemValue}>{cls?.target_exams || (isFa ? "عمومی / آزاد" : "None")}</span>
              </div>

              <div className={styles.profileItem}>
                <span className={styles.profileItemLabel}>{isFa ? "ظرفیت حداکثر" : "Max Capacity"}</span>
                <span className={styles.profileItemValue}>
                  {cls?.max_capacity || 10} {isFa ? "نفر" : "learners"}
                </span>
              </div>
            </div>

            {cls?.private_notes && (
              <div style={{ marginTop: "var(--space-2)", padding: "var(--space-3)", background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-control)" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--color-muted)", fontWeight: 600 }}>
                  📝 {isFa ? "یادداشت‌های اختصاصی مدرس: " : "Teacher Private Notes: "}
                </span>
                <p style={{ fontSize: "0.9rem", color: "var(--color-text)", marginTop: "4px" }}>
                  {cls.private_notes}
                </p>
              </div>
            )}
          </section>

          {/* Section 2: Class Calendar & Interactive Session Scheduler */}
          <section className={styles.surfaceCard}>
            <div className={styles.schedulerHeader}>
              <div>
                <h3>📅 {isFa ? "تقویم و زمان‌بندی جلسات کلاس (Session Scheduler)" : "Session Scheduler & Calendar"}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--color-muted)", marginTop: "2px" }}>
                  {isFa
                    ? "برنامه‌ریزی جلسات آینده، ثبت برگزاری و محاسبه خودکار ساعات تدریس در دفترچه تاییدشده."
                    : "Schedule upcoming sessions, toggle completion, and sync verified teaching hours."}
                </p>
              </div>

              <Button
                type="button"
                variant="primary"
                className={styles.btnPrimary}
                onClick={() => setShowScheduleModal(true)}
              >
                ➕ {isFa ? "برنامه‌ریزی جلسه جدید" : "Schedule New Session"}
              </Button>
            </div>

            {/* Filter Chips */}
            <div className={styles.filterChips}>
              <button
                type="button"
                className={styles.filterChip}
                data-active={sessionFilter === "all"}
                onClick={() => setSessionFilter("all")}
              >
                {isFa ? `همه (${sessions.length})` : `All (${sessions.length})`}
              </button>
              <button
                type="button"
                className={styles.filterChip}
                data-active={sessionFilter === "scheduled"}
                onClick={() => setSessionFilter("scheduled")}
              >
                {isFa ? `در انتظار برگزاری (${scheduledCount})` : `Scheduled (${scheduledCount})`}
              </button>
              <button
                type="button"
                className={styles.filterChip}
                data-active={sessionFilter === "completed"}
                onClick={() => setSessionFilter("completed")}
              >
                {isFa ? `تکمیل‌شده و تاییدشده (${completedCount})` : `Completed (${completedCount})`}
              </button>
              <button
                type="button"
                className={styles.filterChip}
                data-active={sessionFilter === "cancelled"}
                onClick={() => setSessionFilter("cancelled")}
              >
                {isFa ? `لغو شده (${cancelledCount})` : `Cancelled (${cancelledCount})`}
              </button>
            </div>

            {/* Sessions Table */}
            {filteredSessions.length === 0 ? (
              <p style={{ textAlign: "center", padding: "var(--space-6)", color: "var(--color-muted)" }}>
                {isFa ? "جلسه‌ای با این فیلتر یافت نشد." : "No sessions found for this filter."}
              </p>
            ) : (
              <div className={styles.tableContainer}>
                <Table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{isFa ? "عنوان جلسه" : "Title"}</th>
                      <th>{isFa ? "زمان شروع" : "Start Time"}</th>
                      <th>{isFa ? "مدت" : "Duration"}</th>
                      <th>{isFa ? "زبان‌آموز" : "Student"}</th>
                      <th>{isFa ? "وضعیت" : "Status"}</th>
                      <th>{isFa ? "یادداشت‌ها" : "Notes"}</th>
                      <th>{isFa ? "اقدامات" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSessions.map((session) => {
                      const startDate = new Date(session.scheduled_start);
                      const formattedDate = startDate.toLocaleDateString(isFa ? "fa-IR" : "en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <tr key={session.id}>
                          <td>
                            <strong>{session.title}</strong>
                          </td>
                          <td style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>{formattedDate}</td>
                          <td>
                            {session.duration_minutes} {isFa ? "دقیقه" : "min"}
                          </td>
                          <td>
                            {session.learner_email ? (
                              <span style={{ color: "var(--color-learning-teal)", fontWeight: 600 }}>
                                {session.learner_email}
                              </span>
                            ) : (
                              <span style={{ color: "var(--color-muted)" }}>
                                {isFa ? "کل کلاس" : "Full Class"}
                              </span>
                            )}
                          </td>
                          <td>
                            {session.status === "scheduled" && (
                              <span className={styles.statusBadgeScheduled}>
                                ⏳ {isFa ? "برنامه‌ریزی شده" : "Scheduled"}
                              </span>
                            )}
                            {session.status === "completed" && (
                              <span className={styles.statusBadgeCompleted}>
                                ✓ {isFa ? "تکمیل و ثبت در دفتر ساعات" : "Completed & Verified"}
                              </span>
                            )}
                            {session.status === "cancelled" && (
                              <span className={styles.statusBadgeCancelled}>
                                ✕ {isFa ? "لغو شده" : "Cancelled"}
                              </span>
                            )}
                          </td>
                          <td style={{ fontSize: "0.85rem", color: "var(--color-muted)", maxWidth: "200px" }}>
                            {session.session_notes || "-"}
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                              {session.status === "scheduled" && (
                                <>
                                  <button
                                    type="button"
                                    className={styles.btnSuccess}
                                    onClick={() => handleToggleStatus(session, "completed")}
                                    title={isFa ? "ثبت اتمام جلسه و محاسبه ساعت تدریس" : "Mark as completed"}
                                  >
                                    ✓ {isFa ? "تکمیل جلسه" : "Complete"}
                                  </button>
                                  <button
                                    type="button"
                                    className={styles.btnDanger}
                                    onClick={() => handleToggleStatus(session, "cancelled")}
                                    title={isFa ? "لغو این جلسه" : "Cancel session"}
                                  >
                                    ✕ {isFa ? "لغو" : "Cancel"}
                                  </button>
                                </>
                              )}

                              {session.status === "cancelled" && (
                                <button
                                  type="button"
                                  className={styles.btnSecondary}
                                  style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                                  onClick={() => handleToggleStatus(session, "scheduled")}
                                  title={isFa ? "بازگشت به حالت برنامه‌ریزی شده" : "Re-open session"}
                                >
                                  🔄 {isFa ? "زمان‌بندی مجدد" : "Reschedule"}
                                </button>
                              )}

                              {session.status !== "completed" && (
                                <button
                                  type="button"
                                  className={styles.btnDanger}
                                  style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                                  onClick={() => handleDeleteSession(session.id)}
                                  title={isFa ? "حذف جلسه" : "Delete session"}
                                >
                                  🗑️
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}
          </section>

          {/* Section 3: Student Roster & 11-Section Dossiers */}
          <section className={styles.surfaceCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3>👤 {isFa ? "فهرست زبان‌آموزان و پرونده ۱۱ بخشی" : "Student Roster & 11-Section Dossiers"}</h3>
                <span style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>
                  {isFa
                    ? "برای ورود به پرونده کامل ۱۱ بخشی، رادار ۷ مهارت CEFR و پروفایل خطاها روی هر زبان‌آموز کلیک کنید."
                    : "Click student to access their 11-section pedagogical dossier, 7-skill CEFR calibration, and error profile."}
                </span>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className={styles.btnSecondary}
                onClick={() => setShowInviteModal(true)}
              >
                ➕ {isFa ? "دعوت از زبان‌آموز جدید" : "Invite Learner"}
              </Button>
            </div>

            {enrollments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "var(--space-6)" }}>
                <p style={{ color: "var(--color-muted)", marginBottom: "var(--space-3)" }}>
                  {isFa ? "هنوز زبان‌آموزی به این کلاس اضافه نشده است." : "No students enrolled in this class yet."}
                </p>
                <Button
                  type="button"
                  variant="primary"
                  className={styles.btnPrimary}
                  onClick={() => setShowInviteModal(true)}
                >
                  ➕ {isFa ? "ارسال اولین دعوت‌نامه" : "Send First Invitation"}
                </Button>
              </div>
            ) : (
              <div className={styles.tableContainer}>
                <Table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{isFa ? "زبان‌آموز" : "Student"}</th>
                      <th>{isFa ? "وضعیت پیوند" : "Link Status"}</th>
                      <th>{isFa ? "پرونده آموزشی ۱۱ بخشی" : "Pedagogical Dossier"}</th>
                      <th>{isFa ? "کد دعوت اختصاصی" : "Invite Code"}</th>
                      <th>{isFa ? "اقدام سریع" : "Action"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map((link: TeacherLearnerLink) => (
                      <tr key={link.id}>
                        <td>
                          <strong>{link.learner_email || "Student"}</strong>
                        </td>
                        <td>
                          <span
                            style={{
                              color:
                                link.status === "active"
                                  ? "var(--color-success-green)"
                                  : "var(--color-warning-orange)",
                            }}
                          >
                            {link.status === "active" ? (isFa ? "فعال و متصل" : "Active") : link.status}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: "0.85rem", color: "var(--color-learning-teal)" }}>
                            ✓ {isFa ? "پرونده ۱۱ بخشی آماده و همگام" : "11-Section Dossier Ready"}
                          </span>
                        </td>
                        <td>
                          <code style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>
                            {link.invite_code || "-"}
                          </code>
                        </td>
                        <td>
                          <Link
                            href={`/teacher/classes/${classId}/students/${link.learner}`}
                            className={styles.btnSecondary}
                            style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                          >
                            {isFa ? "مشاهده پرونده ←" : "Open Dossier →"}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </section>

          {/* Section 4: Past Outcomes Check-in Summary */}
          <section className={styles.surfaceCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3>📝 {isFa ? "سوابق نتایج ثبت‌شده جلسات گذشته" : "Past Lesson Outcomes"}</h3>
                <span style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>
                  {isFa ? `${outcomes.length} نتیجه جلسه ثبت شده` : `${outcomes.length} outcomes recorded`}
                </span>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className={styles.btnSecondary}
                onClick={() => setShowOutcomeModal(true)}
              >
                📝 {isFa ? "ثبت نتیجه جلسه جدید" : "Record Outcome"}
              </Button>
            </div>

            {outcomes.length === 0 ? (
              <p style={{ color: "var(--color-muted)", fontSize: "0.9rem" }}>
                {isFa
                  ? "پس از برگزاری هر جلسه، با چک‌این ۳۰ ثانیه‌ای نتیجه آن را ثبت کنید تا موتور هوش مصنوعی بهترین طرح درس جلسه بعد را پیشنهاد دهد."
                  : "Record 30-second post-lesson check-ins to feed the AI Next-Lesson Recommendation Engine."}
              </p>
            ) : (
              <div className={styles.tableContainer}>
                <Table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{isFa ? "تاریخ" : "Date"}</th>
                      <th>{isFa ? "نتیجه کلی" : "Result"}</th>
                      <th>{isFa ? "سختی (از ۵)" : "Difficulty"}</th>
                      <th>{isFa ? "پوشش سرفصل" : "Completion"}</th>
                      <th>{isFa ? "یادداشت‌ها و مشاهدات" : "Reflections"}</th>
                      <th>{isFa ? "یادآوری‌های جلسه بعد" : "Follow-up"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outcomes.map((o) => (
                      <tr key={o.id}>
                        <td style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                          {new Date(o.created_at).toLocaleDateString(isFa ? "fa-IR" : "en-US")}
                        </td>
                        <td>
                          <span
                            style={{
                              color:
                                o.result === "success"
                                  ? "var(--color-success-green)"
                                  : o.result === "partial"
                                  ? "var(--color-warning-orange)"
                                  : "var(--color-danger-red)",
                              fontWeight: 600,
                            }}
                          >
                            {o.result_display || o.result}
                          </span>
                        </td>
                        <td>{o.difficulty_rating} / 5</td>
                        <td>{o.completion_percent}%</td>
                        <td style={{ fontSize: "0.85rem", color: "var(--color-muted)", maxWidth: "240px" }}>
                          {o.notes}
                        </td>
                        <td style={{ fontSize: "0.85rem", color: "var(--color-learning-teal)" }}>
                          {o.followup_reminders && o.followup_reminders.length > 0
                            ? o.followup_reminders.join(" • ")
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </section>
        </div>
      )}

      {/* PILLAR 2: PLANNING & PREP */}
      {activeTab === "planning_prep" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
          {/* AI Recommendation Banner */}
          {recommendation && (
            <div className={styles.recommendationBanner}>
              <div className={styles.recommendationTitle}>
                <span>🤖</span>
                <span>
                  {isFa
                    ? "پیشنهاد هوشمند جلسه بعد (AI Next-Lesson Recommendation)"
                    : "AI Next-Lesson Recommendation"}
                </span>
                <span
                  style={{
                    background: "rgba(13, 148, 136, 0.2)",
                    padding: "2px 8px",
                    borderRadius: "var(--radius-pill)",
                    fontSize: "0.75rem",
                    marginRight: "auto",
                  }}
                >
                  {recommendation.mode.toUpperCase()}
                </span>
              </div>
              <p style={{ fontWeight: 600, color: "var(--color-text)" }}>{recommendation.recommended_topic}</p>
              <p style={{ fontSize: "0.9rem", color: "var(--color-muted)", lineHeight: 1.6 }}>
                <strong>{isFa ? "منطق پداگوژیک: " : "Pedagogical Rationale: "}</strong>
                {recommendation.pedagogical_rationale}
              </p>
              <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
                <Link
                  href={`/teacher/planning?class_id=${classId}&topic=${encodeURIComponent(
                    recommendation.recommended_topic
                  )}`}
                  className={styles.btnPrimary}
                >
                  ⚡ {isFa ? "تولید طرح درس کامل با هوش مصنوعی" : "Generate Calibrated Lesson Plan"}
                </Link>
              </div>
            </div>
          )}

          {/* 4 Core Generators Launcher Cards */}
          <div className={styles.cardGrid}>
            <div className={styles.surfaceCard}>
              <h3>📚 {isFa ? "طرح درس (Lesson Planner)" : "Lesson Planner"}</h3>
              <p>
                {isFa
                  ? "تولید مرحله‌به‌مرحله مراحل تدریس (Warm-up, Presentation, Practice, Production) متناسب با سطح CEFR."
                  : "Generate step-by-step PPP/ESA stages calibrated to class CEFR level."}
              </p>
              <Link
                href={`/teacher/planning?type=lesson&class_id=${classId}`}
                className={styles.btnPrimary}
                style={{ marginTop: "auto" }}
              >
                {isFa ? "ساخت طرح درس" : "Create Lesson Plan"}
              </Link>
            </div>

            <div className={styles.surfaceCard}>
              <h3>🎲 {isFa ? "فعالیت‌های کلاسی (Activity Generator)" : "Activity Generator"}</h3>
              <p>
                {isFa
                  ? "بازی‌های مکالمه، ایفای نقش (Role Play)، مناظره و تمرین‌های دونفره با کارت‌های دانش‌آموز A و B."
                  : "Speaking games, role plays, debates, and pair-work with Student A & B prompt cards."}
              </p>
              <Link
                href={`/teacher/planning?type=activity&class_id=${classId}`}
                className={styles.btnPrimary}
                style={{ marginTop: "auto" }}
              >
                {isFa ? "ساخت فعالیت" : "Create Activity"}
              </Link>
            </div>

            <div className={styles.surfaceCard}>
              <h3>📝 {isFa ? "کاربرگ تمرین (Worksheet Generator)" : "Worksheet Generator"}</h3>
              <p>
                {isFa
                  ? "کاربرگ‌های گرامر، واژگان، درک مطلب با کلید پاسخ تشریحی ویژه معلم."
                  : "Grammar, vocabulary, and reading worksheets with complete teacher answer keys."}
              </p>
              <Link
                href={`/teacher/planning?type=worksheet&class_id=${classId}`}
                className={styles.btnPrimary}
                style={{ marginTop: "auto" }}
              >
                {isFa ? "ساخت کاربرگ" : "Create Worksheet"}
              </Link>
            </div>

            <div className={styles.surfaceCard}>
              <h3>✅ {isFa ? "آزمون و کوئیز (Assessment Generator)" : "Assessment Generator"}</h3>
              <p>
                {isFa
                  ? "طراحی آزمون‌های تستی، جای‌خالی و ترکیبی با بارم‌بندی استاندارد."
                  : "Design multiple-choice, fill-in-blank, and mixed tests with standard grading rubrics."}
              </p>
              <Link
                href={`/teacher/planning?type=assessment&class_id=${classId}`}
                className={styles.btnPrimary}
                style={{ marginTop: "auto" }}
              >
                {isFa ? "ساخت آزمون" : "Create Quiz"}
              </Link>
            </div>
          </div>

          {/* Class Materials Repository */}
          <section className={styles.surfaceCard}>
            <h3>{isFa ? "محتواهای ایجادشده برای این کلاس" : "Generated Class Materials"}</h3>
            {materials.length === 0 ? (
              <p style={{ color: "var(--color-muted)", fontSize: "0.9rem" }}>
                {isFa
                  ? "هنوز محتوایی برای این کلاس تولید نشده است. با دکمه‌های بالا اولین محتوا را بسازید."
                  : "No materials generated for this class yet. Use the cards above to start creating."}
              </p>
            ) : (
              <div className={styles.tableContainer}>
                <Table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{isFa ? "عنوان محتوا" : "Title"}</th>
                      <th>{isFa ? "نوع" : "Type"}</th>
                      <th>{isFa ? "سطح" : "Level"}</th>
                      <th>{isFa ? "وضعیت" : "Status"}</th>
                      <th>{isFa ? "تاریخ" : "Date"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map((m) => (
                      <tr key={m.id}>
                        <td>
                          <strong>{m.title}</strong>
                        </td>
                        <td>{m.material_type_display || m.material_type}</td>
                        <td>{m.cefr_level}</td>
                        <td>
                          <span
                            style={{
                              color:
                                m.status === "approved"
                                  ? "var(--color-success-green)"
                                  : "var(--color-warning-orange)",
                            }}
                          >
                            {m.status_display || m.status}
                          </span>
                        </td>
                        <td style={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
                          {new Date(m.created_at).toLocaleDateString(isFa ? "fa-IR" : "en-US")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </section>
        </div>
      )}

      {/* PILLAR 3: ASSESSMENT & EVIDENCE */}
      {activeTab === "assessment_feedback" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
          <div className={styles.cardGrid}>
            <div className={styles.surfaceCard}>
              <h3>🔬 {isFa ? "تحلیل شواهد و تکالیف کلاسی" : "Evidence Analysis Studio"}</h3>
              <p>
                {isFa
                  ? "بارگذاری متن یا تصویر دست‌نویس تکالیف، استخراج خطاهای زبانی و ارزیابی بر اساس روبریک‌های CEFR."
                  : "Upload student writing or homework photo, extract language errors, and grade via CEFR rubrics."}
              </p>
              <Link href={`/teacher/assessment?class_id=${classId}`} className={styles.btnPrimary} style={{ marginTop: "auto" }}>
                {isFa ? "ورود به میزکار تحلیل تکالیف" : "Open Evidence Studio"}
              </Link>
            </div>

            <div className={styles.surfaceCard}>
              <h3>✍️ {isFa ? "استودیوی بازخورد رایتینگ (Writing Feedback)" : "Writing Feedback Studio"}</h3>
              <p>
                {isFa
                  ? "تولید کارت بازخورد ۳ ستونه: تصحیحات درون‌متنی، تحسین و نقاط قوت، و گام‌های بعدی تمرین."
                  : "Generate 3-column feedback: inline corrections, strengths praise, and actionable next steps."}
              </p>
              <Link href={`/teacher/assessment?class_id=${classId}&mode=writing`} className={styles.btnPrimary} style={{ marginTop: "auto" }}>
                {isFa ? "تصحیح و ارسال بازخورد" : "Create Writing Feedback"}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* PILLAR 4: SUPERTOOLS */}
      {activeTab === "supertools" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
          <div className={styles.cardGrid}>
            <div className={styles.surfaceCard}>
              <h3>🧩 {isFa ? "موتور تمایزیافته آموزشی (Differentiation)" : "Differentiation Engine"}</h3>
              <p>
                {isFa
                  ? "تولید نسخه پشتیبانی (داربست‌بندی برای یادگیرندگان نیازمند کمک) و نسخه چالشی (یادگیرندگان پیشرفته) از روی هر تمرین."
                  : "Generate Tier 1 (Support Scaffolding) and Tier 3 (Extension Challenge) from any core exercise."}
              </p>
              <Link href={`/teacher/tools?tool=differentiation&class_id=${classId}`} className={styles.btnPrimary} style={{ marginTop: "auto" }}>
                {isFa ? "اجرای تمایزیافته" : "Run Differentiation"}
              </Link>
            </div>

            <div className={styles.surfaceCard}>
              <h3>🔁 {isFa ? "سیستم مرور با فاصله (SRS Queue)" : "Spaced Retrieval Review"}</h3>
              <p>
                {isFa
                  ? "تولید کوئیز مرور ۵ دقیقه‌ای برای شروع جلسه و تخصیص فلش‌کارت‌های فعال به داشبورد دانش‌آموز."
                  : "Generate 5-minute warm-up retrieval drills and push active recall cards to student dashboards."}
              </p>
              <Link href={`/teacher/tools?tool=spaced_review&class_id=${classId}`} className={styles.btnPrimary} style={{ marginTop: "auto" }}>
                {isFa ? `مشاهده صف مرور (${spacedReviews.length} آیتم)` : `View SRS Queue (${spacedReviews.length} items)`}
              </Link>
            </div>

            <div className={styles.surfaceCard}>
              <h3>📊 {isFa ? "گزارش پیشرفت و کارنامه (Progress Reports)" : "Progress Reports"}</h3>
              <p>
                {isFa
                  ? "استخراج کارنامه طولی پیشرفت مهارت‌ها، حضور و غیاب و خروجی رسمی Word و PDF جهت ارائه به اولیا یا آموزشگاه."
                  : "Export longitudinal skill report cards in Word (.docx) and PDF for students and parents."}
              </p>
              <Link href={`/teacher/tools?tool=reports&class_id=${classId}`} className={styles.btnPrimary} style={{ marginTop: "auto" }}>
                {isFa ? "تولید گزارش رسمی" : "Generate Report Card"}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: EDIT CLASS PROFILE */}
      {showEditClassModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} ${styles.modalWide}`}>
            <div className={styles.modalHeader}>
              <h2>✏️ {isFa ? "ویرایش مشخصات و تنظیمات کلاس" : "Edit Class Profile & Settings"}</h2>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setShowEditClassModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveClassProfile}>
              <div className={styles.modalRow}>
                <div className={styles.formGroup}>
                  <label>{isFa ? "عنوان کلاس:" : "Class Title:"}</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>{isFa ? "موضوع یا مهارت اصلی:" : "Subject:"}</label>
                  <input
                    type="text"
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.modalRow}>
                <div className={styles.formGroup}>
                  <label>{isFa ? "سطح زبانی CEFR:" : "CEFR Level:"}</label>
                  <select value={editLevel} onChange={(e) => setEditLevel(e.target.value)}>
                    {CEFR_LEVELS.map((lvl) => (
                      <option key={lvl.value} value={lvl.value}>
                        {lvl.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>{isFa ? "کتاب و منابع درسی:" : "Coursebook / Materials:"}</label>
                  <input
                    type="text"
                    value={editCoursebook}
                    onChange={(e) => setEditCoursebook(e.target.value)}
                    placeholder={isFa ? "مثال: Touchstone 2, Unit 4" : "e.g. Touchstone 2, Unit 4"}
                  />
                </div>
              </div>

              <div className={styles.modalRow}>
                <div className={styles.formGroup}>
                  <label>{isFa ? "گروه سنی:" : "Age Group:"}</label>
                  <select value={editAgeGroup} onChange={(e) => setEditAgeGroup(e.target.value)}>
                    {AGE_GROUPS.map((a) => (
                      <option key={a.value} value={a.value}>
                        {isFa ? a.labelFa : a.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>{isFa ? "اندازه کلاس:" : "Class Size:"}</label>
                  <select value={editClassSizeType} onChange={(e) => setEditClassSizeType(e.target.value)}>
                    {CLASS_SIZES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {isFa ? s.labelFa : s.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.modalRow}>
                <div className={styles.formGroup}>
                  <label>{isFa ? "هدف اصلی دوره:" : "Main Goal:"}</label>
                  <select value={editGoal} onChange={(e) => setEditGoal(e.target.value)}>
                    {GOALS.map((g) => (
                      <option key={g.value} value={g.value}>
                        {isFa ? g.labelFa : g.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>{isFa ? "مدت زمان استاندارد جلسه (دقیقه):" : "Default Duration (mins):"}</label>
                  <input
                    type="number"
                    min={15}
                    max={180}
                    step={15}
                    value={editDefaultDuration}
                    onChange={(e) => setEditDefaultDuration(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className={styles.modalRow}>
                <div className={styles.formGroup}>
                  <label>{isFa ? "آزمون هدف (اختیاری):" : "Target Exams (Optional):"}</label>
                  <input
                    type="text"
                    value={editTargetExams}
                    onChange={(e) => setEditTargetExams(e.target.value)}
                    placeholder={isFa ? "مثال: IELTS 6.5, TOEFL iBT" : "e.g. IELTS 6.5"}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>{isFa ? "حداکثر ظرفیت:" : "Max Capacity:"}</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={editCapacity}
                    onChange={(e) => setEditCapacity(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Focus Skills Selection */}
              <div className={styles.formGroup}>
                <label>{isFa ? "مهارت‌های نیازمند تمرکز و تقویت:" : "Focus Skills:"}</label>
                <div className={styles.checkboxGrid}>
                  {SKILL_OPTIONS.map((skill) => (
                    <label key={skill.id} className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={editFocusSkills.includes(skill.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditFocusSkills([...editFocusSkills, skill.id]);
                          } else {
                            setEditFocusSkills(editFocusSkills.filter((s) => s !== skill.id));
                          }
                        }}
                      />
                      <span>{isFa ? skill.labelFa : skill.labelEn}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Equipment Selection */}
              <div className={styles.formGroup}>
                <label>{isFa ? "امکانات و تجهیزات کلاسی:" : "Classroom Equipment:"}</label>
                <div className={styles.checkboxGrid}>
                  {EQUIPMENT_OPTIONS.map((eq) => (
                    <label key={eq.id} className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={editEquipment.includes(eq.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditEquipment([...editEquipment, eq.id]);
                          } else {
                            setEditEquipment(editEquipment.filter((item) => item !== eq.id));
                          }
                        }}
                      />
                      <span>{isFa ? eq.labelFa : eq.labelEn}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Teaching Methodology Preferences */}
              <div className={styles.formGroup}>
                <label>{isFa ? "رویکردها و اولویت‌های تدریس:" : "Teaching Preferences:"}</label>
                <div className={styles.checkboxGrid}>
                  {METHODOLOGIES.map((m) => (
                    <label key={m.id} className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={editPreferences.includes(m.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditPreferences([...editPreferences, m.id]);
                          } else {
                            setEditPreferences(editPreferences.filter((p) => p !== m.id));
                          }
                        }}
                      />
                      <span>{isFa ? m.labelFa : m.labelEn}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? "یادداشت‌های اختصاصی معلم (محرمانه):" : "Teacher Private Notes:"}</label>
                <textarea
                  rows={2}
                  value={editPrivateNotes}
                  onChange={(e) => setEditPrivateNotes(e.target.value)}
                  placeholder={isFa ? "یادداشت‌ها درباره رفتار، چالش‌ها و نکات خاص کلاس..." : "Private notes about this class..."}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.btnSecondary}
                  onClick={() => setShowEditClassModal(false)}
                >
                  {isFa ? "انصراف" : "Cancel"}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className={styles.btnPrimary}
                  loading={savingClassProfile}
                  disabled={savingClassProfile}
                >
                  {savingClassProfile ? (isFa ? "در حال ذخیره..." : "Saving...") : (isFa ? "💾 ذخیره تغییرات" : "Save Changes")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SCHEDULE NEW SESSION */}
      {showScheduleModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>📅 {isFa ? "برنامه‌ریزی جلسه جدید کلاس" : "Schedule New Session"}</h2>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setShowScheduleModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleSession}>
              <div className={styles.formGroup}>
                <label>{isFa ? "عنوان یا مبحث جلسه:" : "Session Title:"}</label>
                <input
                  type="text"
                  value={newSessionTitle}
                  onChange={(e) => setNewSessionTitle(e.target.value)}
                  placeholder={isFa ? "مثال: جلسه ۱۴: گرامر زمان حال کامل و مکالمه" : "e.g. Session 14: Present Perfect & Fluency"}
                  required
                />
              </div>

              <div className={styles.modalRow}>
                <div className={styles.formGroup}>
                  <label>{isFa ? "زمان شروع:" : "Start Time:"}</label>
                  <input
                    type="datetime-local"
                    value={newSessionStart}
                    onChange={(e) => setNewSessionStart(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>{isFa ? "مدت جلسه (دقیقه):" : "Duration (mins):"}</label>
                  <input
                    type="number"
                    min={15}
                    max={180}
                    step={15}
                    value={newSessionDuration}
                    onChange={(e) => setNewSessionDuration(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? "زبان‌آموز هدف (اختیاری):" : "Specific Learner (Optional):"}</label>
                <select
                  value={newSessionLearnerId}
                  onChange={(e) => setNewSessionLearnerId(e.target.value)}
                >
                  <option value="">{isFa ? "کل کلاس (همه زبان‌آموزان)" : "Full Class (All Students)"}</option>
                  {enrollments.map((link) => (
                    <option key={link.learner} value={link.learner}>
                      {link.learner_email}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? "یادداشت‌ها و اهداف این جلسه:" : "Session Objectives & Notes:"}</label>
                <textarea
                  rows={2}
                  value={newSessionNotes}
                  onChange={(e) => setNewSessionNotes(e.target.value)}
                  placeholder={isFa ? "اهداف تدریس، صفحات کتاب، فعالیت‌های مدنظر..." : "Lesson goals, book pages..."}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.btnSecondary}
                  onClick={() => setShowScheduleModal(false)}
                >
                  {isFa ? "انصراف" : "Cancel"}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className={styles.btnPrimary}
                  loading={schedulingSession}
                  disabled={schedulingSession}
                >
                  {schedulingSession ? (isFa ? "در حال ثبت..." : "Scheduling...") : (isFa ? "➕ زمان‌بندی جلسه" : "Schedule Session")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: COMPLETE SESSION (AUDIT & HOURS LEDGER) */}
      {completingSession && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>✅ {isFa ? "تکمیل و ثبت جلسه تدریس" : "Complete & Confirm Session"}</h2>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setCompletingSession(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmComplete}>
              <p style={{ fontSize: "0.9rem", color: "var(--color-muted)", lineHeight: 1.6, marginBottom: "var(--space-4)" }}>
                {isFa
                  ? `جلسه «${completingSession.title}» (${completingSession.duration_minutes} دقیقه) به عنوان برگزار شده علامت‌گذاری می‌شود و ساعت تدریس آن به‌صورت خودکار در دفترچه ساعات تدریس تاییدشده ثبت می‌گردد.`
                  : `Marking "${completingSession.title}" (${completingSession.duration_minutes} min) as completed will automatically record verified teaching hours in your ledger.`}
              </p>

              <div className={styles.formGroup}>
                <label>{isFa ? "گزارش و مشاهدات تدریس در این جلسه:" : "Session Completion Notes:"}</label>
                <textarea
                  rows={3}
                  value={completeNotes}
                  onChange={(e) => setCompleteNotes(e.target.value)}
                  placeholder={isFa ? "مباحث پوشش‌داده‌شده، بازخورد کلاسی و عملکرد زبان‌آموزان..." : "Topics covered, student engagement..."}
                  required
                />
              </div>

              <div className={styles.formGroup} style={{ flexDirection: "row", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  id="confirmLearnerPresent"
                  checked={confirmedByLearner}
                  onChange={(e) => setConfirmedByLearner(e.target.checked)}
                />
                <label htmlFor="confirmLearnerPresent" style={{ fontSize: "0.85rem", cursor: "pointer" }}>
                  {isFa ? "حضور زبان‌آموز(ان) در این جلسه تایید می‌شود." : "Learner attendance confirmed."}
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.btnSecondary}
                  onClick={() => setCompletingSession(null)}
                >
                  {isFa ? "انصراف" : "Cancel"}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className={styles.btnPrimary}
                  loading={submittingComplete}
                  disabled={submittingComplete}
                >
                  {submittingComplete ? (isFa ? "در حال تایید..." : "Confirming...") : (isFa ? "✓ تایید و ثبت ساعت" : "Confirm Completion")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: INVITE LEARNER */}
      {showInviteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>➕ {isFa ? "دعوت از زبان‌آموز به کلاس" : "Invite Student to Class"}</h2>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteResultLink(null);
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteLearner}>
              <div className={styles.formGroup}>
                <label>{isFa ? "ایمیل زبان‌آموز:" : "Student Email Address:"}</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="student@example.com"
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-3)" }}>
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.btnSecondary}
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteResultLink(null);
                  }}
                >
                  {isFa ? "بستن" : "Close"}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className={styles.btnPrimary}
                  loading={submittingInvite}
                  disabled={submittingInvite}
                >
                  {submittingInvite ? (isFa ? "در حال ارسال..." : "Sending...") : (isFa ? "📨 ارسال دعوت‌نامه" : "Send Invite")}
                </Button>
              </div>
            </form>

            {inviteResultLink && (
              <div style={{ marginTop: "var(--space-4)" }}>
                <p style={{ color: "var(--color-success-green)", fontSize: "0.9rem", fontWeight: 600 }}>
                  ✓ {isFa ? "دعوت‌نامه با موفقیت ایجاد شد! کد دعوت اختصاصی:" : "Invite created successfully! Access code:"}
                </p>
                <div className={styles.inviteCodeBox}>
                  <span>{inviteResultLink.invite_code}</span>
                  <button
                    type="button"
                    className={styles.btnSecondary}
                    style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                    onClick={() => handleCopyInviteCode(inviteResultLink.invite_code)}
                  >
                    {copiedCode ? (isFa ? "✓ کپی شد!" : "✓ Copied!") : (isFa ? "📋 کپی کد" : "📋 Copy")}
                  </button>
                </div>
                <p style={{ fontSize: "0.8rem", color: "var(--color-muted)", marginTop: "var(--space-2)" }}>
                  {isFa
                    ? "زبان‌آموز می‌تواند این کد را در داشبورد خود در بخش «اساتید من» وارد کند تا ارتباط کلاس برقرار شود."
                    : "Learners can enter this code on their 'My Teachers' page to link to this class."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 5: 30-SECOND OUTCOME CHECK-IN */}
      {showOutcomeModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>📝 {isFa ? "ثبت نتیجه جلسه تدریس (۳۰ ثانیه)" : "30-Second Outcome Check-in"}</h2>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setShowOutcomeModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleRecordOutcome}>
              <div className={styles.formGroup}>
                <label>{isFa ? "نتیجه کلی تدریس:" : "Overall Teaching Result:"}</label>
                <select
                  value={outcomeResult}
                  onChange={(e) => setOutcomeResult(e.target.value as "success" | "partial" | "needs_repeat")}
                >
                  <option value="success">{isFa ? "بسیار موفق (اهداف کاملاً محقق شد)" : "Highly Successful"}</option>
                  <option value="partial">{isFa ? "موفق با چالش جزئی (برخی مباحث نیاز به مرور دارند)" : "Partial / Minor Challenges"}</option>
                  <option value="needs_repeat">{isFa ? "نیازمند تکرار و تمرین مجدد (مبحث جا نیفتاد)" : "Needs Repetition"}</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? `درجه سختی ادراک‌شده توسط دانش‌آموزان: (${outcomeDifficulty} از ۵)` : `Perceived Difficulty: (${outcomeDifficulty}/5)`}</label>
                <Input
                  type="range"
                  min="1"
                  max="5"
                  value={outcomeDifficulty}
                  onChange={(e) => setOutcomeDifficulty(Number(e.target.value))}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--color-muted)" }}>
                  <span>{isFa ? "بسیار ساده" : "Very Easy"}</span>
                  <span>{isFa ? "متناسب" : "Just Right"}</span>
                  <span>{isFa ? "بسیار دشوار" : "Very Hard"}</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? `درصد پوشش مباحث برنامه‌ریزی‌شده: (${outcomeCompletion}٪)` : `Syllabus Completion: (${outcomeCompletion}%)`}</label>
                <Input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={outcomeCompletion}
                  onChange={(e) => setOutcomeCompletion(Number(e.target.value))}
                />
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? "یادداشت و مشاهدات معلم (توصیف کوتاه):" : "Teacher Reflections (Short notes):"}</label>
                <textarea
                  rows={3}
                  value={outcomeNotes}
                  onChange={(e) => setOutcomeNotes(e.target.value)}
                  placeholder={isFa ? "مثال: زبان‌آموزان در بخش مکالمه خوب بودند اما در گرامر زمان حال نیاز به تمرین بیشتر دارند..." : "e.g. Students engaged well in speaking but need reinforcement on conditionals..."}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? "موارد پیگیری جلسه آینده (هر خط یک مورد):" : "Reminders for Next Session (one per line):"}</label>
                <textarea
                  rows={2}
                  value={outcomeReminders}
                  onChange={(e) => setOutcomeReminders(e.target.value)}
                  placeholder={isFa ? "کوییز ۵ دقیقه‌ای مرور\nبررسی تمرین صفحه ۴۲" : "5-min warmup retrieval quiz\nCheck homework page 42"}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.btnSecondary}
                  onClick={() => setShowOutcomeModal(false)}
                >
                  {isFa ? "انصراف" : "Cancel"}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className={styles.btnPrimary}
                  loading={submittingOutcome}
                  disabled={submittingOutcome}
                >
                  {submittingOutcome ? (isFa ? "در حال ذخیره..." : "Saving...") : (isFa ? "💾 ذخیره و ثبت در حافظه کلاس" : "Save Outcome")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

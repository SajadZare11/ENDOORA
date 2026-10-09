"use client";

import { Button, Input } from "@endoora/ui";
import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import styles from "./student-dossier.module.css";
import { useTeacherHome } from "@/components/teacher/TeacherShell";
import {
  fetchStudentDossier,
  scoreStudentSkills,
  logStudentError,
  updateStudentErrorStatus,
  recordStudentAssessment,
  fetchStudentAcademicPortfolio,
  recordStudentLessonMastery,
  sendStudent10QuestionHomework,
  type StudentAcademicPortfolio,
  type CurriculumUnit,
  type SubcategoryItem,
} from "@/lib/teacheros-api";
import type { StudentDossier, AssessmentMilestoneItem } from "@endoora/contracts";

type MainSectionTab = "info_traits" | "academic_status" | "operations";
type OperationSubOption = "record_mastery" | "send_homework";

const PRESET_GOALS = [
  "IELTS 7.0+",
  "Study Abroad",
  "Job Promotion",
  "Academic English",
  "Speaking Fluency",
  "Immigration",
  "General English",
  "Travel",
];

const PRESET_ACTIVITIES = [
  "pair work",
  "role play",
  "discussion",
  "games",
  "reading",
  "writing",
  "video",
  "listening",
  "projects",
  "grammar exercises",
];

const PRESET_BEHAVIORS = [
  "participates actively",
  "needs prompting",
  "prefers preparation time",
  "learns well through examples",
  "responds well to visual support",
  "benefits from repetition",
  "benefits from explicit grammar explanation",
];

export default function StudentDossierPage({
  params,
}: {
  params: Promise<{ id: string; studentId: string }>;
}) {
  const resolvedParams = use(params);
  const { id: classId, studentId } = resolvedParams;
  const { locale } = useTeacherHome();
  const isFa = locale === "fa";

  // Main 3 Tabs
  const [activeTab, setActiveTab] = useState<MainSectionTab>("info_traits");
  const [operationOption, setOperationOption] = useState<OperationSubOption>("record_mastery");

  // Core Data
  const [dossier, setDossier] = useState<StudentDossier | null>(null);
  const [portfolio, setPortfolio] = useState<StudentAcademicPortfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Success Feedback
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Operation 1: Record Lesson Mastery State
  const [masteryUnitNumber, setMasteryUnitNumber] = useState<number>(1);
  const [masterySubcategory, setMasterySubcategory] = useState<SubcategoryItem | null>(null);
  const [masteryPercentage, setMasteryPercentage] = useState<number>(75);
  const [masterySessionDate, setMasterySessionDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [masteryNotes, setMasteryNotes] = useState<string>("");
  const [submittingMastery, setSubmittingMastery] = useState(false);

  // Operation 2: Send 10-Question Pack State
  const [homeworkUnitNumber, setHomeworkUnitNumber] = useState<number>(1);
  const [homeworkSubcategory, setHomeworkSubcategory] = useState<SubcategoryItem | null>(null);
  const [homeworkQuestionFormat, setHomeworkQuestionFormat] = useState<
    "mcq" | "descriptive" | "multi_select" | "gap" | "mixed"
  >("mcq");
  const [homeworkDueDays, setHomeworkDueDays] = useState<number>(7);
  const [homeworkInstructions, setHomeworkInstructions] = useState<string>(
    "لطفاً با دقت به تمام ۱۰ سوال پاسخ دهید و پس از بازبینی ثبت نمایید."
  );
  const [submittingHomework, setSubmittingHomework] = useState(false);
  const [createdAssignmentInfo, setCreatedAssignmentInfo] = useState<{
    id: string;
    title: string;
    total_points: number;
  } | null>(null);

  // 1-Tap 7-Skill Score Modal
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [scores, setScores] = useState({
    speaking: 12,
    listening: 14,
    reading: 15,
    writing: 11,
    grammar: 10,
    vocabulary: 13,
    pronunciation: 12,
  });
  const [confidence, setConfidence] = useState(3);
  const [scoreNotes, setScoreNotes] = useState("");
  const [submittingScores, setSubmittingScores] = useState(false);

  // Error Log Modal
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorCategory, setErrorCategory] = useState("grammar");
  const [errorSentence, setErrorSentence] = useState("");
  const [errorCorrection, setErrorCorrection] = useState("");
  const [errorNotes, setErrorNotes] = useState("");
  const [errorFrequency, setErrorFrequency] = useState<"low" | "medium" | "high">("medium");
  const [errorStatus, setErrorStatus] = useState<"improving" | "persistent" | "solved">("improving");
  const [submittingError, setSubmittingError] = useState(false);

  // Assessment Modal
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [assessType, setAssessType] = useState<"formal" | "informal">("informal");
  const [assessSubtype, setAssessSubtype] = useState("mini_quiz");
  const [assessTitle, setAssessTitle] = useState("");
  const [assessScore, setAssessScore] = useState(18);
  const [assessMaxScore, setAssessMaxScore] = useState(20);
  const [assessNotes, setAssessNotes] = useState("");
  const [submittingAssessment, setSubmittingAssessment] = useState(false);

  // Load Dossier & Academic Portfolio concurrently
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const [dossierData, portfolioData] = await Promise.all([
          fetchStudentDossier(classId, studentId).catch(() => null),
          fetchStudentAcademicPortfolio(classId, studentId).catch(() => null),
        ]);
        if (!mounted) return;
        if (dossierData) {
          setDossier(dossierData);
          if (dossierData.cefr_skills) {
            setScores({
              speaking: dossierData.cefr_skills.speaking?.score ?? 12,
              listening: dossierData.cefr_skills.listening?.score ?? 14,
              reading: dossierData.cefr_skills.reading?.score ?? 15,
              writing: dossierData.cefr_skills.writing?.score ?? 11,
              grammar: dossierData.cefr_skills.grammar?.score ?? 10,
              vocabulary: dossierData.cefr_skills.vocabulary?.score ?? 13,
              pronunciation: dossierData.cefr_skills.pronunciation?.score ?? 12,
            });
          }
        }
        if (portfolioData) {
          setPortfolio(portfolioData);
          // Set initial unit and subcategory if available
          const units = portfolioData.curriculum?.units || [];
          if (units.length > 0) {
            setMasteryUnitNumber(units[0].unit_number);
            setHomeworkUnitNumber(units[0].unit_number);
            if (units[0].subcategories?.length > 0) {
              setMasterySubcategory(units[0].subcategories[0]);
              setHomeworkSubcategory(units[0].subcategories[0]);
            }
          }
        }
      } catch (err) {
        console.error("Error loading student data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void loadData();
    return () => {
      mounted = false;
    };
  }, [classId, studentId, refreshKey]);

  // Derived units from portfolio
  const curriculumUnits: CurriculumUnit[] = portfolio?.curriculum?.units || [];
  const selectedMasteryUnit = curriculumUnits.find((u) => u.unit_number === masteryUnitNumber) || curriculumUnits[0];
  const selectedHomeworkUnit = curriculumUnits.find((u) => u.unit_number === homeworkUnitNumber) || curriculumUnits[0];

  // Update selected subcategories when unit changes
  const handleMasteryUnitChange = (unitNum: number) => {
    setMasteryUnitNumber(unitNum);
    const u = curriculumUnits.find((item) => item.unit_number === unitNum);
    if (u && u.subcategories && u.subcategories.length > 0) {
      setMasterySubcategory(u.subcategories[0]);
    } else {
      setMasterySubcategory(null);
    }
  };

  const handleHomeworkUnitChange = (unitNum: number) => {
    setHomeworkUnitNumber(unitNum);
    const u = curriculumUnits.find((item) => item.unit_number === unitNum);
    if (u && u.subcategories && u.subcategories.length > 0) {
      setHomeworkSubcategory(u.subcategories[0]);
    } else {
      setHomeworkSubcategory(null);
    }
  };

  // Submit Operation 1: Record Lesson Mastery
  const handleRecordMasterySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMasteryUnit || !masterySubcategory) {
      alert(isFa ? "لطفاً ابتدا درس و مبحث مورد نظر را انتخاب نمایید." : "Please select unit and subcategory.");
      return;
    }
    setSubmittingMastery(true);
    setSuccessBanner(null);
    try {
      const res = await recordStudentLessonMastery(classId, studentId, {
        unit_number: selectedMasteryUnit.unit_number,
        unit_title: selectedMasteryUnit.title_fa || selectedMasteryUnit.title_en,
        subcategory_id: masterySubcategory.id,
        subcategory_title: masterySubcategory.title_fa || masterySubcategory.title_en,
        subcategory_type: masterySubcategory.type || "general",
        mastery_percentage: masteryPercentage,
        teacher_notes: masteryNotes,
        session_date: masterySessionDate,
      });

      if (res.portfolio) {
        setPortfolio(res.portfolio);
      }
      setSuccessBanner(
        isFa
          ? `✅ میزان یادگیری مبحث «${masterySubcategory.title_fa}» با موفقیت ${masteryPercentage}٪ در پرونده تحصیلی ثبت شد.`
          : `✅ Mastery for '${masterySubcategory.title_en}' recorded at ${masteryPercentage}%.`
      );
      setMasteryNotes("");
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      alert(err.message || (isFa ? "خطا در ثبت میزان یادگیری." : "Failed to record mastery."));
    } finally {
      setSubmittingMastery(false);
    }
  };

  // Submit Operation 2: Send 10-Question Pack
  const handleSendHomeworkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHomeworkUnit || !homeworkSubcategory) {
      alert(isFa ? "لطفاً درس و مبحث تکلیف را انتخاب کنید." : "Please select unit and subcategory for homework.");
      return;
    }
    setSubmittingHomework(true);
    setSuccessBanner(null);
    setCreatedAssignmentInfo(null);
    try {
      const res = await sendStudent10QuestionHomework(classId, studentId, {
        unit_number: selectedHomeworkUnit.unit_number,
        unit_title: selectedHomeworkUnit.title_fa || selectedHomeworkUnit.title_en,
        subcategory_id: homeworkSubcategory.id,
        subcategory_title: homeworkSubcategory.title_fa || homeworkSubcategory.title_en,
        question_format: homeworkQuestionFormat,
        due_days: homeworkDueDays,
        instructions: homeworkInstructions,
      });

      setCreatedAssignmentInfo({
        id: res.assignment.id,
        title: res.assignment.title,
        total_points: res.assignment.total_points,
      });
      setSuccessBanner(
        isFa
          ? `🚀 بسته ۱۰ سوالی «${homeworkSubcategory.title_fa}» مستقیماً به پنل دانش‌آموز ارسال گردید. دانش‌آموز می‌تواند آن را در پنل خود حل کند.`
          : `🚀 10-Question Pack for '${homeworkSubcategory.title_en}' successfully dispatched to student panel.`
      );
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      alert(err.message || (isFa ? "خطا در ارسال تکلیف ۱۰ سوالی." : "Failed to dispatch homework."));
    } finally {
      setSubmittingHomework(false);
    }
  };

  // Skill scoring submit
  const hasLowScore = Object.values(scores).some((s) => s < 10);
  const handleScoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasLowScore && !scoreNotes.trim()) {
      alert(
        isFa
          ? "برای نمرات زیر ۱۰، ثبت یادداشت تشخیصی الزامی است."
          : "For scores below 10, an explanatory diagnostic note is required."
      );
      return;
    }
    setSubmittingScores(true);
    try {
      const updated = await scoreStudentSkills(classId, studentId, scores, confidence, scoreNotes);
      setDossier(updated);
      setShowScoreModal(false);
      setScoreNotes("");
      setSuccessBanner(isFa ? "نمرات ۷ مهارت با موفقیت ثبت شد." : "7 skills scores saved.");
    } catch {
      alert(isFa ? "خطا در ثبت نمرات مهارت‌ها." : "Failed to score skills.");
    } finally {
      setSubmittingScores(false);
    }
  };

  // Language error submit
  const handleErrorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingError(true);
    try {
      await logStudentError(classId, studentId, {
        category: errorCategory,
        sentence: errorSentence,
        correction: errorCorrection,
        notes: errorNotes,
        frequency: errorFrequency,
        status: errorStatus,
      });
      setShowErrorModal(false);
      setErrorSentence("");
      setErrorCorrection("");
      setErrorNotes("");
      setRefreshKey((k) => k + 1);
      setSuccessBanner(isFa ? "خطای زبانی ثبت گردید." : "Language error logged.");
    } catch {
      alert(isFa ? "خطا در ثبت خطای زبانی." : "Failed to log error.");
    } finally {
      setSubmittingError(false);
    }
  };

  // Assessment submit
  const handleAssessmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAssessment(true);
    try {
      const res = await recordStudentAssessment(classId, studentId, {
        type: assessType,
        subtype: assessSubtype,
        title: assessTitle,
        score: assessScore,
        max_score: assessMaxScore,
        notes: assessNotes,
      });
      if (res.dossier) setDossier(res.dossier);
      setShowAssessmentModal(false);
      setAssessTitle("");
      setAssessNotes("");
      setRefreshKey((k) => k + 1);
      setSuccessBanner(isFa ? "نتیجه آزمون با موفقیت ثبت گردید." : "Assessment recorded.");
    } catch {
      alert(isFa ? "خطا در ثبت نتیجه آزمون." : "Failed to record assessment result.");
    } finally {
      setSubmittingAssessment(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--color-muted)" }}>
          {isFa ? "در حال بارگیری پرونده آموزشی و کارنامه جامع دانش‌آموز..." : "Loading Student Dossier & Portfolio..."}
        </p>
      </div>
    );
  }

  type SkillKey = "speaking" | "listening" | "reading" | "writing" | "grammar" | "vocabulary" | "pronunciation";
  const skills = dossier?.cefr_skills;
  const skillsList: Array<{
    key: SkillKey;
    labelFa: string;
    labelEn: string;
    data: NonNullable<typeof skills>[SkillKey];
  }> = skills
    ? [
        { key: "speaking", labelFa: "مکالمه (Speaking)", labelEn: "Speaking", data: skills.speaking },
        { key: "listening", labelFa: "شنیداری (Listening)", labelEn: "Listening", data: skills.listening },
        { key: "reading", labelFa: "خواندن (Reading)", labelEn: "Reading", data: skills.reading },
        { key: "writing", labelFa: "نوشتار (Writing)", labelEn: "Writing", data: skills.writing },
        { key: "grammar", labelFa: "دستور زبان (Grammar)", labelEn: "Grammar", data: skills.grammar },
        { key: "vocabulary", labelFa: "دایره واژگان (Vocabulary)", labelEn: "Vocabulary", data: skills.vocabulary },
        { key: "pronunciation", labelFa: "تلفظ و آواشناسی (Pronunciation)", labelEn: "Pronunciation", data: skills.pronunciation },
      ]
    : [];

  const studentName =
    portfolio?.student_info?.name ||
    dossier?.learner_email?.split("@")[0] ||
    (isFa ? "دانش‌آموز" : "Student");
  const studentEmail = portfolio?.student_info?.email || dossier?.learner_email || "";
  const coursebookTitle =
    portfolio?.learning_portfolio?.coursebook ||
    portfolio?.student_info?.coursebook ||
    "American English File 2";
  const overallMastery = portfolio?.learning_portfolio?.overall_book_mastery ?? 0;
  const pastSessions = portfolio?.academic_status?.past_sessions || [];
  const pastAssignments = portfolio?.academic_status?.past_assignments || [];
  const pastOutcomes = portfolio?.academic_status?.past_outcomes || [];
  const unitsPortfolio = portfolio?.learning_portfolio?.units_portfolio || [];
  const recentMasteries = portfolio?.learning_portfolio?.recent_masteries || [];

  return (
    <div className={styles.container}>
      {/* Back Link to Class */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link
          href={`/teacher/classes/${classId}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            color: "var(--color-muted)",
            fontSize: "0.9rem",
            textDecoration: "none",
          }}
        >
          {isFa ? "← بازگشت به لیست دانش‌آموزان کلاس" : "← Back to Class Roster"}
        </Link>
      </div>

      {/* Top Profile Header Card */}
      <section className={styles.headerCard}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0 }}>
              👤 {studentName}
            </h1>
            <span
              style={{
                background: "rgba(59, 130, 246, 0.15)",
                color: "var(--color-endoora-blue)",
                padding: "3px 12px",
                borderRadius: "var(--radius-pill)",
                fontSize: "0.85rem",
                fontWeight: 700,
              }}
            >
              {studentEmail}
            </span>
            <span
              style={{
                background: "var(--gradient-intelligence)",
                color: "#fff",
                padding: "3px 12px",
                borderRadius: "var(--radius-pill)",
                fontSize: "0.85rem",
                fontWeight: 700,
              }}
            >
              {isFa
                ? `سطح CEFR: ${portfolio?.student_info?.cefr_level || dossier?.cefr_overall || "B1"}`
                : `CEFR Level: ${portfolio?.student_info?.cefr_level || dossier?.cefr_overall || "B1"}`}
            </span>
            <span
              style={{
                background: "rgba(16, 185, 129, 0.15)",
                color: "var(--color-success-green)",
                padding: "3px 12px",
                borderRadius: "var(--radius-pill)",
                fontSize: "0.85rem",
                fontWeight: 700,
              }}
            >
              📖 {coursebookTitle}
            </span>
          </div>
          <p style={{ color: "var(--color-muted)", fontSize: "0.9rem", marginTop: "6px", marginBottom: 0 }}>
            {isFa
              ? `کلاس: ${dossier?.class_title || "کلاس فعلی"} · درصد کلی یادگیری کتاب: ${overallMastery}٪ · جلسات برگزار شده: ${pastSessions.length}`
              : `Class: ${dossier?.class_title || "Current Class"} · Overall Book Mastery: ${overallMastery}% · Completed Sessions: ${pastSessions.length}`}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
          <Button
            type="button"
            variant="primary"
            className="teacher-button teacher-button--primary"
            onClick={() => {
              setActiveTab("operations");
              setOperationOption("record_mastery");
            }}
          >
            ⚡ {isFa ? "ثبت درصد یادگیری امروز" : "Record Lesson Mastery"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="teacher-button teacher-button--secondary"
            onClick={() => {
              setActiveTab("operations");
              setOperationOption("send_homework");
            }}
          >
            📦 {isFa ? "ارسال بسته ۱۰ سوالی" : "Send 10-Question Pack"}
          </Button>
        </div>
      </section>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className={styles.successAlert}>
          <span>{successBanner}</span>
          <button
            type="button"
            onClick={() => setSuccessBanner(null)}
            style={{
              marginInlineStart: "auto",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "inherit",
              fontWeight: "bold",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 3 Main Tabs Requested By User */}
      <nav className={styles.mainTabs}>
        <button
          type="button"
          className={styles.mainTab}
          data-active={activeTab === "info_traits"}
          onClick={() => setActiveTab("info_traits")}
        >
          📋 {isFa ? "بخش ۱: اطلاعات و ویژگی‌ها" : "Part 1: Profile & Traits"}
        </button>
        <button
          type="button"
          className={styles.mainTab}
          data-active={activeTab === "academic_status"}
          onClick={() => setActiveTab("academic_status")}
        >
          📈 {isFa ? "بخش ۲: وضعیت تحصیلی و سوابق" : "Part 2: Academic Status & History"}
        </button>
        <button
          type="button"
          className={styles.mainTab}
          data-active={activeTab === "operations"}
          onClick={() => setActiveTab("operations")}
        >
          ⚡ {isFa ? "بخش ۳: عملیات (یادگیری و تکلیف)" : "Part 3: Operations & Assignment"}
        </button>
      </nav>

      {/* ============================================================== */}
      {/* TAB 1: اطلاعات و ویژگی‌ها (Profile & Traits / Information)        */}
      {/* ============================================================== */}
      {activeTab === "info_traits" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          {/* Quick Metrics */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricVal}>{overallMastery}٪</span>
              <span className={styles.metricLabel}>{isFa ? "میزان تسلط بر کتاب" : "Coursebook Mastery"}</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricVal}>{pastSessions.length}</span>
              <span className={styles.metricLabel}>{isFa ? "جلسات برگزار شده" : "Sessions Completed"}</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricVal}>{pastAssignments.length}</span>
              <span className={styles.metricLabel}>{isFa ? "تکالیف ارسالی" : "Assignments Sent"}</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricVal}>{dossier?.cefr_overall || "B1"}</span>
              <span className={styles.metricLabel}>{isFa ? "سطح کلی زبان" : "Overall CEFR"}</span>
            </div>
          </div>

          <div className={styles.cardGrid}>
            {/* Target Goals Card */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeaderRow}>
                <h2 className={styles.sectionTitle}>🎯 {isFa ? "اهداف یادگیری" : "Target Goals"}</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-muted)", display: "block" }}>
                    {isFa ? "هدف بلندمدت:" : "Long-term Goal:"}
                  </span>
                  <strong style={{ fontSize: "1rem" }}>
                    {dossier?.target_goals?.long_term || (isFa ? "IELTS 7.0+ و تسلط آکادمیک" : "IELTS 7.0+ & Academic Fluency")}
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-muted)", display: "block" }}>
                    {isFa ? "هدف کوتاه‌مدت / این ترم:" : "Short-term Goal:"}
                  </span>
                  <span>
                    {dossier?.target_goals?.short_term ||
                      (isFa ? "تسلط بر جملات پرسشی و زمان‌های گذشته در مکالمه" : "Master question formation & past tenses")}
                  </span>
                </div>
              </div>
            </div>

            {/* Learning Preferences Card */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeaderRow}>
                <h2 className={styles.sectionTitle}>🧠 {isFa ? "ترجیحات و سبک یادگیری" : "Learning Preferences"}</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-muted)", display: "block", marginBottom: "4px" }}>
                    {isFa ? "فعالیت‌های ترجیحی:" : "Preferred Activities:"}
                  </span>
                  <div className={styles.tagList}>
                    {(dossier?.learning_preferences?.preferred_activities || ["pair work", "role play", "games"]).map(
                      (act: string) => (
                        <span key={act} className={styles.interactiveChip}>
                          ⭐ {act}
                        </span>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-muted)", display: "block", marginBottom: "4px" }}>
                    {isFa ? "الگوهای رفتاری در کلاس:" : "Classroom Behaviors:"}
                  </span>
                  <div className={styles.tagList}>
                    {(dossier?.learning_preferences?.learning_behaviors || ["participates actively", "learns well through examples"]).map(
                      (beh: string) => (
                        <span key={beh} className={styles.interactiveChip}>
                          💡 {beh}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Development Areas */}
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>💪 {isFa ? "نقاط قوت و نیازمند تقویت" : "Strengths & Growth Areas"}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-muted)", display: "block", marginBottom: "4px" }}>
                    {isFa ? "نقاط قوت تایید شده:" : "Confirmed Strengths:"}
                  </span>
                  <div className={styles.tagList}>
                    {(dossier?.strengths || ["شنیداری عالی", "اعتمادبه‌نفس در مکالمه", "تلفظ شفاف"]).map((s: string) => (
                      <span key={s} className={styles.tagStrength}>
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-muted)", display: "block", marginBottom: "4px" }}>
                    {isFa ? "زمینه‌های نیازمند تمرکز بیشتر:" : "Focus Areas for Development:"}
                  </span>
                  <div className={styles.tagList}>
                    {(dossier?.areas_for_development || ["دقت ساختارهای گرامری پیچیده", "واژگان تخصصی آکادمیک"]).map((a: string) => (
                      <span key={a} className={styles.tagArea}>
                        ▲ {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 7 CEFR Skills Score Breakdown */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeaderRow}>
                <h2 className={styles.sectionTitle}>📊 {isFa ? "ارزیابی هفت مهارت زبانی (از ۲۰)" : "7 Language Skills (0-20)"}</h2>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="teacher-button teacher-button--secondary"
                  onClick={() => setShowScoreModal(true)}
                >
                  ✏️ {isFa ? "ویرایش نمرات" : "Score"}
                </Button>
              </div>
              <div className={styles.skillsList}>
                {skillsList.map((skill) => {
                  const scoreVal = skill.data?.score ?? 10;
                  const pct = Math.round((scoreVal / 20) * 100);
                  const isHigh = scoreVal >= 12;
                  return (
                    <div key={skill.key} className={styles.skillRow}>
                      <div className={styles.skillHeader}>
                        <span>{isFa ? skill.labelFa : skill.labelEn}</span>
                        <span className={isHigh ? styles.scoreBadgeHigh : styles.scoreBadgeLow}>
                          {scoreVal} / 20 ({pct}٪)
                        </span>
                      </div>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{
                            width: `${pct}%`,
                            background: isHigh ? "var(--color-endoora-blue)" : "var(--color-warning-amber)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: وضعیت تحصیلی (Academic Status & Past History)            */}
      {/* ============================================================== */}
      {activeTab === "academic_status" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          {/* Progress Summary Header */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeaderRow}>
              <div>
                <h2 className={styles.sectionTitle}>
                  📚 {isFa ? `پورتفولیوی یادگیری کتاب ${coursebookTitle}` : `Curriculum Portfolio: ${coursebookTitle}`}
                </h2>
                <p style={{ color: "var(--color-muted)", fontSize: "0.85rem", margin: "4px 0 0 0" }}>
                  {isFa
                    ? "نمای جامع پیشرفت دانش‌آموز در تمام دروس و ساب‌کتگوری‌های کتاب درسی همراه با آخرین نمرات"
                    : "Complete unit-by-unit and subcategory mastery progress across the textbook."}
                </p>
              </div>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--color-endoora-blue)", display: "block" }}>
                  {overallMastery}٪
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>
                  {isFa ? "میانگین تسلط کل" : "Total Mastery"}
                </span>
              </div>
            </div>

            {/* Units & Subcategories Portfolio */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", marginTop: "var(--space-4)" }}>
              {unitsPortfolio.map((u) => (
                <div key={u.unit_number} className={styles.unitCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-2)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                      <span
                        style={{
                          background: "var(--color-endoora-blue)",
                          color: "#fff",
                          padding: "2px 8px",
                          borderRadius: "var(--radius-pill)",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                        }}
                      >
                        درس {u.unit_number}
                      </span>
                      <strong style={{ fontSize: "1rem" }}>{u.unit_title}</strong>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                      <span style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>
                        {isFa ? `${u.evaluated_count} از ${u.total_subcategories} مبحث ارزیابی شده` : `${u.evaluated_count}/${u.total_subcategories} evaluated`}
                      </span>
                      <span
                        style={{
                          padding: "2px 10px",
                          borderRadius: "var(--radius-pill)",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          background: u.average_mastery >= 60 ? "rgba(16, 185, 129, 0.15)" : "rgba(234, 179, 8, 0.15)",
                          color: u.average_mastery >= 60 ? "var(--color-success-green)" : "#eab308",
                        }}
                      >
                        {u.average_mastery}٪
                      </span>
                    </div>
                  </div>

                  {/* Subcategories inside Unit */}
                  <div className={styles.subcatGrid}>
                    {u.subcategories.map((sc) => {
                      const hasScore = sc.mastery_percentage !== null;
                      return (
                        <div
                          key={sc.id}
                          style={{
                            background: "rgba(255, 255, 255, 0.02)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "var(--radius-control)",
                            padding: "var(--space-3)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--space-2)" }}>
                            <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{sc.title}</span>
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: "var(--radius-pill)",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                background: hasScore ? "rgba(59, 130, 246, 0.15)" : "rgba(255, 255, 255, 0.05)",
                                color: hasScore ? "var(--color-endoora-blue)" : "var(--color-muted)",
                              }}
                            >
                              {hasScore ? `${sc.mastery_percentage}٪` : (isFa ? "ثبت نشده" : "Pending")}
                            </span>
                          </div>
                          {sc.last_evaluated && (
                            <span style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>
                              📅 {isFa ? `آخرین ثبت: ${sc.last_evaluated}` : `Last: ${sc.last_evaluated}`}
                            </span>
                          )}
                          {sc.teacher_notes && (
                            <p style={{ fontSize: "0.78rem", color: "var(--color-text)", margin: 0, fontStyle: "italic" }}>
                              ✍️ {sc.teacher_notes}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Classroom Sessions Card */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeaderRow}>
              <h2 className={styles.sectionTitle}>
                📅 {isFa ? "سابقه جلسات کلاسی و حضور" : "Past Classroom Sessions"} ({pastSessions.length})
              </h2>
            </div>
            {pastSessions.length === 0 ? (
              <p style={{ color: "var(--color-muted)", fontSize: "0.9rem" }}>
                {isFa ? "هنوز جلسه‌ای برای این دانش‌آموز ثبت نشده است." : "No sessions recorded yet."}
              </p>
            ) : (
              <div>
                {pastSessions.map((session) => (
                  <div key={session.id} className={styles.historyCard}>
                    <div className={styles.historyHeader}>
                      <strong style={{ fontSize: "1rem" }}>{session.title}</strong>
                      <span
                        style={{
                          background: "rgba(16, 185, 129, 0.15)",
                          color: "var(--color-success-green)",
                          padding: "2px 10px",
                          borderRadius: "var(--radius-pill)",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                        }}
                      >
                        ✓ {session.status === "completed" ? (isFa ? "برگزار شده" : "Completed") : session.status}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "var(--space-4)", fontSize: "0.82rem", color: "var(--color-muted)", flexWrap: "wrap" }}>
                      <span>🕒 {new Date(session.scheduled_start).toLocaleDateString(isFa ? "fa-IR" : "en-US")}</span>
                      <span>⏱️ {session.duration_minutes} {isFa ? "دقیقه" : "mins"}</span>
                      {session.confirmed_by_teacher && <span>👨‍🏫 {isFa ? "تایید مدرس" : "Teacher Confirmed"}</span>}
                      {session.confirmed_by_learner && <span>🎓 {isFa ? "تایید زبان‌آموز" : "Learner Confirmed"}</span>}
                    </div>
                    {session.session_notes && (
                      <p style={{ fontSize: "0.85rem", color: "var(--color-text)", margin: "4px 0 0 0" }}>
                        📝 {session.session_notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Assignments & Homework Card */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeaderRow}>
              <h2 className={styles.sectionTitle}>
                📦 {isFa ? "تکالیف و کارهای ارسالی دانش‌آموز" : "Assigned Homework & Submissions"} ({pastAssignments.length})
              </h2>
            </div>
            {pastAssignments.length === 0 ? (
              <p style={{ color: "var(--color-muted)", fontSize: "0.9rem" }}>
                {isFa ? "هنوز تکلیفی برای این دانش‌آموز ارسال نشده است. می‌توانید از تب عملیات تکلیف ۱۰ سوالی ارسال کنید." : "No assignments assigned yet."}
              </p>
            ) : (
              <div>
                {pastAssignments.map((asg) => {
                  const sub = asg.submission;
                  const isGraded = sub && sub.status === "graded";
                  const scorePct = sub?.percentage ?? null;

                  return (
                    <div key={asg.id} className={styles.historyCard}>
                      <div className={styles.historyHeader}>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                          <strong style={{ fontSize: "1rem" }}>{asg.title}</strong>
                          <span
                            style={{
                              background: "rgba(59, 130, 246, 0.15)",
                              color: "var(--color-endoora-blue)",
                              padding: "2px 8px",
                              borderRadius: "var(--radius-pill)",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                            }}
                          >
                            {asg.questions_count} {isFa ? "سوال" : "Questions"}
                          </span>
                        </div>

                        {/* Submission status badge */}
                        {isGraded ? (
                          <span
                            style={{
                              background: "rgba(16, 185, 129, 0.15)",
                              color: "var(--color-success-green)",
                              padding: "2px 10px",
                              borderRadius: "var(--radius-pill)",
                              fontSize: "0.85rem",
                              fontWeight: 700,
                            }}
                          >
                            ✓ {isFa ? `نمره کسب شده: ${scorePct}٪` : `Score: ${scorePct}%`}
                          </span>
                        ) : sub ? (
                          <span
                            style={{
                              background: "rgba(234, 179, 8, 0.15)",
                              color: "#eab308",
                              padding: "2px 10px",
                              borderRadius: "var(--radius-pill)",
                              fontSize: "0.85rem",
                              fontWeight: 700,
                            }}
                          >
                            ⏳ {isFa ? "در انتظار تصحیح" : "Submitted / In Review"}
                          </span>
                        ) : (
                          <span
                            style={{
                              background: "rgba(255, 255, 255, 0.06)",
                              color: "var(--color-muted)",
                              padding: "2px 10px",
                              borderRadius: "var(--radius-pill)",
                              fontSize: "0.85rem",
                            }}
                          >
                            ⏳ {isFa ? "ارسال شده به پنل دانش‌آموز (هنوز حل نشده)" : "Dispatched to Student"}
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: "var(--space-4)", fontSize: "0.82rem", color: "var(--color-muted)", flexWrap: "wrap" }}>
                        <span>📊 {isFa ? `بارم کل: ${asg.total_points} نمره` : `Total Points: ${asg.total_points}`}</span>
                        {asg.due_date && (
                          <span>📅 {isFa ? `مهلت تحویل: ${new Date(asg.due_date).toLocaleDateString(isFa ? "fa-IR" : "en-US")}` : `Due: ${asg.due_date}`}</span>
                        )}
                        {sub?.submitted_at && (
                          <span>✅ {isFa ? `زمان حل و ارسال: ${new Date(sub.submitted_at).toLocaleDateString(isFa ? "fa-IR" : "en-US")}` : `Submitted at: ${sub.submitted_at}`}</span>
                        )}
                      </div>

                      {asg.description && (
                        <p style={{ fontSize: "0.85rem", color: "var(--color-muted)", margin: "4px 0 0 0" }}>
                          {asg.description}
                        </p>
                      )}

                      {sub?.teacher_feedback && (
                        <p style={{ fontSize: "0.85rem", color: "var(--color-endoora-blue)", margin: "4px 0 0 0" }}>
                          💬 {isFa ? "بازخورد مدرس:" : "Teacher Feedback:"} {sub.teacher_feedback}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: عملیات (Operations & Pedagogical Actions)               */}
      {/* ============================================================== */}
      {activeTab === "operations" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          {/* Operation Sub-Option Selector */}
          <div className={styles.operationSelector}>
            <button
              type="button"
              className={styles.operationOptionBtn}
              data-active={operationOption === "record_mastery"}
              onClick={() => setOperationOption("record_mastery")}
            >
              <div className={styles.opIcon}>📊</div>
              <div className={styles.opInfo}>
                <h3>۱. {isFa ? "میزان یادگیری درس" : "1. Record Lesson Mastery"}</h3>
                <p>
                  {isFa
                    ? "انتخاب درس و ساب‌کتگوری کتاب و ثبت درصد یادگیری تدریس امروز"
                    : "Select textbook unit & subtopic and log today's mastery percentage."}
                </p>
              </div>
            </button>

            <button
              type="button"
              className={styles.operationOptionBtn}
              data-active={operationOption === "send_homework"}
              onClick={() => setOperationOption("send_homework")}
            >
              <div className={styles.opIcon}>📦</div>
              <div className={styles.opInfo}>
                <h3>۲. {isFa ? "ارسال تکلیف از بانک سوالات" : "2. Send Homework (10 Questions)"}</h3>
                <p>
                  {isFa
                    ? "انتخاب درس و ساب‌کتگوری و ارسال بسته ۱۰ سوالی (تستی/تشریحی/جاخالی) به پنل دانش‌آموز"
                    : "Dispatch 10 calibrated questions from Question Bank to student panel."}
                </p>
              </div>
            </button>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* SUB-OPTION 1: میزان یادگیری درس (Record Lesson Mastery)       */}
          {/* ------------------------------------------------------------ */}
          {operationOption === "record_mastery" && (
            <div className={styles.opFormCard}>
              <div style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-3)" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0 }}>
                  📊 {isFa ? "ثبت میزان یادگیری مبحث تدریس شده" : "Record Lesson Topic Mastery"}
                </h2>
                <p style={{ color: "var(--color-muted)", fontSize: "0.85rem", margin: "4px 0 0 0" }}>
                  {isFa
                    ? `کتاب آموزشی: ${coursebookTitle} · سرفصل مورد نظر را انتخاب و درصد یادگیری دانش‌آموز را مشخص کنید.`
                    : `Coursebook: ${coursebookTitle} · Pick unit and subtopic to record mastery.`}
                </p>
              </div>

              <form onSubmit={handleRecordMasterySubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                {/* 1. Unit Selector */}
                <div className={styles.formGroup}>
                  <label>📖 {isFa ? "۱. انتخاب درس / یونیت کتاب:" : "1. Select Coursebook Unit:"}</label>
                  <select
                    value={masteryUnitNumber}
                    onChange={(e) => handleMasteryUnitChange(Number(e.target.value))}
                    style={{ fontSize: "0.95rem", fontWeight: 600 }}
                  >
                    {curriculumUnits.map((u) => (
                      <option key={u.unit_number} value={u.unit_number}>
                        {isFa ? `درس ${u.unit_number}: ${u.title_fa || u.title_en}` : `Unit ${u.unit_number}: ${u.title_en}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Subcategory Selector */}
                <div className={styles.formGroup}>
                  <label>🔍 {isFa ? "۲. انتخاب بخش و ساب‌کتگوری تدریس شده امروز:" : "2. Select Granular Subcategory:"}</label>
                  <div className={styles.subcatGrid}>
                    {selectedMasteryUnit?.subcategories?.map((sc) => {
                      const isSelected = masterySubcategory?.id === sc.id;
                      return (
                        <div
                          key={sc.id}
                          className={styles.subcatItem}
                          data-selected={isSelected}
                          onClick={() => setMasterySubcategory(sc)}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <strong style={{ fontSize: "0.92rem" }}>{sc.title_fa || sc.title_en}</strong>
                            <span
                              style={{
                                fontSize: "0.75rem",
                                padding: "1px 6px",
                                borderRadius: "var(--radius-pill)",
                                background: "rgba(59, 130, 246, 0.15)",
                                color: "var(--color-endoora-blue)",
                              }}
                            >
                              {sc.type}
                            </span>
                          </div>
                          <span style={{ fontSize: "0.78rem", color: "var(--color-muted)" }}>
                            {sc.title_en}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Mastery Percentage Slider & Presets */}
                <div className={styles.formGroup}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label>💯 {isFa ? "۳. درصد میزان یادگیری دانش‌آموز:" : "3. Student Mastery Percentage:"}</label>
                    <span
                      style={{
                        fontSize: "1.4rem",
                        fontWeight: 800,
                        color: masteryPercentage >= 70 ? "var(--color-success-green)" : masteryPercentage >= 50 ? "#eab308" : "var(--color-error-red)",
                      }}
                    >
                      {masteryPercentage}٪
                    </span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={masteryPercentage}
                    onChange={(e) => setMasteryPercentage(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--color-endoora-blue)", cursor: "pointer", height: "8px" }}
                  />

                  {/* Quick Presets */}
                  <div className={styles.presetGroup}>
                    {[25, 40, 50, 60, 75, 85, 90, 100].map((val) => (
                      <button
                        type="button"
                        key={val}
                        className={styles.presetBtn}
                        data-active={masteryPercentage === val}
                        onClick={() => setMasteryPercentage(val)}
                      >
                        {val}٪
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Session Date */}
                <div className={styles.formGroup}>
                  <label>📅 {isFa ? "۴. تاریخ جلسه تدریس:" : "4. Session Date:"}</label>
                  <input
                    type="date"
                    value={masterySessionDate}
                    onChange={(e) => setMasterySessionDate(e.target.value)}
                  />
                </div>

                {/* 5. Teacher Observations Notes */}
                <div className={styles.formGroup}>
                  <label>✍️ {isFa ? "۵. مشاهدات و یادداشت مدرس درباره این مبحث:" : "5. Teacher Observations & Notes:"}</label>
                  <textarea
                    rows={3}
                    value={masteryNotes}
                    onChange={(e) => setMasteryNotes(e.target.value)}
                    placeholder={
                      isFa
                        ? "مثال: تسلط بسیار عالی بر ساختار جملات پرسشی داشت، فقط در wh-questions نیاز به تمرین و مرور جزئی دارد..."
                        : "e.g. Good mastery of question structures, needs minor reinforcement on wh-questions..."
                    }
                  />
                </div>

                {/* Submit Action */}
                <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="teacher-button teacher-button--primary"
                    disabled={submittingMastery || !masterySubcategory}
                  >
                    {submittingMastery
                      ? (isFa ? "در حال ثبت میزان یادگیری..." : "Saving...")
                      : (isFa ? "💾 ثبت میزان یادگیری در پرونده تحصیلی دانش‌آموز" : "Save Lesson Mastery to Portfolio")}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* SUB-OPTION 2: ارسال تکلیف از بانک سوالات (Send 10 Questions)  */}
          {/* ------------------------------------------------------------ */}
          {operationOption === "send_homework" && (
            <div className={styles.opFormCard}>
              <div style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-3)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0 }}>
                    📦 {isFa ? "ارسال تکلیف ۱۰ سوالی از بانک سوالات" : "Dispatch 10-Question Pack from Question Bank"}
                  </h2>
                  <span
                    style={{
                      background: "var(--gradient-intelligence)",
                      color: "#fff",
                      padding: "2px 10px",
                      borderRadius: "var(--radius-pill)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                    }}
                  >
                    {isFa ? "بسته ۱۰ سوالی هوشمند" : "10-Question Calibrated Pack"}
                  </span>
                </div>
                <p style={{ color: "var(--color-muted)", fontSize: "0.85rem", margin: "4px 0 0 0" }}>
                  {isFa
                    ? `کتاب آموزشی: ${coursebookTitle} · درس و مبحث را انتخاب کنید؛ سیستم ۱۰ سوال کالیبره شده با پاسخ‌نامه از بانک سوالات استخراج کرده و به پنل دانش‌آموز می‌فرستد.`
                    : `Coursebook: ${coursebookTitle} · Select unit and subtopic; 10 calibrated questions will be packaged and sent to student.`}
                </p>
              </div>

              {createdAssignmentInfo && (
                <div className={styles.successAlert} style={{ background: "rgba(59, 130, 246, 0.15)", borderColor: "var(--color-endoora-blue)", color: "var(--color-endoora-blue)" }}>
                  <div>
                    <strong>{isFa ? "تکلیف با موفقیت ساخته شد:" : "Assignment Dispatched:"}</strong> {createdAssignmentInfo.title}
                    <div style={{ fontSize: "0.8rem", marginTop: "2px" }}>
                      {isFa ? `بارم کل: ${createdAssignmentInfo.total_points} نمره · تعداد سوالات: ۱۰ سوال استاندارد` : `Points: ${createdAssignmentInfo.total_points} · 10 Questions`}
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSendHomeworkSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                {/* 1. Unit Selector */}
                <div className={styles.formGroup}>
                  <label>📖 {isFa ? "۱. انتخاب درس / یونیت کتاب:" : "1. Select Coursebook Unit:"}</label>
                  <select
                    value={homeworkUnitNumber}
                    onChange={(e) => handleHomeworkUnitChange(Number(e.target.value))}
                    style={{ fontSize: "0.95rem", fontWeight: 600 }}
                  >
                    {curriculumUnits.map((u) => (
                      <option key={u.unit_number} value={u.unit_number}>
                        {isFa ? `درس ${u.unit_number}: ${u.title_fa || u.title_en}` : `Unit ${u.unit_number}: ${u.title_en}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Subcategory Selector */}
                <div className={styles.formGroup}>
                  <label>🔍 {isFa ? "۲. انتخاب مبحث / ساب‌کتگوری سوالات:" : "2. Select Question Topic / Subcategory:"}</label>
                  <div className={styles.subcatGrid}>
                    {selectedHomeworkUnit?.subcategories?.map((sc) => {
                      const isSelected = homeworkSubcategory?.id === sc.id;
                      return (
                        <div
                          key={sc.id}
                          className={styles.subcatItem}
                          data-selected={isSelected}
                          onClick={() => setHomeworkSubcategory(sc)}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <strong style={{ fontSize: "0.92rem" }}>{sc.title_fa || sc.title_en}</strong>
                            <span
                              style={{
                                fontSize: "0.75rem",
                                padding: "1px 6px",
                                borderRadius: "var(--radius-pill)",
                                background: "rgba(59, 130, 246, 0.15)",
                                color: "var(--color-endoora-blue)",
                              }}
                            >
                              {sc.type}
                            </span>
                          </div>
                          <span style={{ fontSize: "0.78rem", color: "var(--color-muted)" }}>
                            {sc.title_en}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Question Count & Format */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--space-4)" }}>
                  {/* Fixed 10 Questions */}
                  <div className={styles.formGroup}>
                    <label>🔢 {isFa ? "۳. تعداد سوالات بسته:" : "3. Question Count:"}</label>
                    <div
                      style={{
                        background: "rgba(59, 130, 246, 0.1)",
                        border: "1px solid var(--color-endoora-blue)",
                        borderRadius: "var(--radius-control)",
                        padding: "10px 14px",
                        fontWeight: 700,
                        color: "var(--color-endoora-blue)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>۱۰ سوال استاندارد از بانک سوالات</span>
                      <span style={{ fontSize: "0.8rem", background: "var(--color-endoora-blue)", color: "#fff", padding: "2px 8px", borderRadius: "var(--radius-pill)" }}>
                        ۱۰/۱۰
                      </span>
                    </div>
                  </div>

                  {/* Question Format */}
                  <div className={styles.formGroup}>
                    <label>🧩 {isFa ? "۴. نوع سوالات انتخابی:" : "4. Question Type / Format:"}</label>
                    <select
                      value={homeworkQuestionFormat}
                      onChange={(e) => setHomeworkQuestionFormat(e.target.value as any)}
                      style={{ fontSize: "0.95rem", fontWeight: 600 }}
                    >
                      <option value="mcq">{isFa ? "تستی و چهارگزینه‌ای (MCQ)" : "Multiple Choice (MCQ)"}</option>
                      <option value="descriptive">{isFa ? "تشریحی و پاسخ کوتاه (Descriptive)" : "Descriptive / Short Answer"}</option>
                      <option value="multi_select">{isFa ? "چند انتخابی و تطبیقی (Multi-Select)" : "Multi-Select"}</option>
                      <option value="gap">{isFa ? "جای خالی و تکمیلی (Fill in the blanks)" : "Gap Fill"}</option>
                      <option value="mixed">{isFa ? "ترکیبی و جامع (تستی + تشریحی + جاخالی)" : "Mixed Comprehensive"}</option>
                    </select>
                  </div>
                </div>

                {/* 5. Due Date (Deadline) */}
                <div className={styles.formGroup}>
                  <label>⏳ {isFa ? "۵. مهلت تحویل تکلیف:" : "5. Due Days / Deadline:"}</label>
                  <div className={styles.presetGroup}>
                    {[
                      { days: 3, label: isFa ? "۳ روزه" : "3 Days" },
                      { days: 7, label: isFa ? "۷ روزه (پیش‌فرض)" : "7 Days (Default)" },
                      { days: 10, label: isFa ? "۱۰ روزه" : "10 Days" },
                      { days: 14, label: isFa ? "۱۴ روزه" : "14 Days" },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.days}
                        className={styles.presetBtn}
                        data-active={homeworkDueDays === item.days}
                        onClick={() => setHomeworkDueDays(item.days)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. Custom Instructions */}
                <div className={styles.formGroup}>
                  <label>📝 {isFa ? "۶. توضیحات و راهنمای حل برای دانش‌آموز:" : "6. Instructions for Learner:"}</label>
                  <textarea
                    rows={3}
                    value={homeworkInstructions}
                    onChange={(e) => setHomeworkInstructions(e.target.value)}
                    placeholder={isFa ? "دستورالعمل اختصاصی به دانش‌آموز..." : "Special instructions for the learner..."}
                  />
                </div>

                {/* Submit Button */}
                <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="teacher-button teacher-button--primary"
                    disabled={submittingHomework || !homeworkSubcategory}
                  >
                    {submittingHomework
                      ? (isFa ? "در حال استخراج از بانک سوالات و ارسال..." : "Dispatching...")
                      : (isFa ? "🚀 ارسال بسته ۱۰ سوالی به پنل دانش‌آموز" : "Dispatch 10-Question Pack to Student")}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODALS: Score Skills, Language Error, Assessment               */}
      {/* ============================================================== */}

      {/* 1. Skill Score Modal */}
      {showScoreModal && (
        <div className={styles.modalOverlay} onClick={() => setShowScoreModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "var(--space-4)" }}>
              📊 {isFa ? "ثبت نمرات ۷ مهارت این جلسه (۰ تا ۲۰)" : "Score 7 Skills (0-20)"}
            </h3>
            <form onSubmit={handleScoreSubmit}>
              {skillsList.map((skill) => (
                <div key={skill.key} className={styles.formGroup}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <label>{isFa ? skill.labelFa : skill.labelEn}</label>
                    <span style={{ fontWeight: 700, color: "var(--color-endoora-blue)" }}>
                      {scores[skill.key]} / 20
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    value={scores[skill.key]}
                    onChange={(e) => setScores({ ...scores, [skill.key]: Number(e.target.value) })}
                    style={{ accentColor: "var(--color-endoora-blue)" }}
                  />
                </div>
              ))}

              <div className={styles.formGroup}>
                <label>🔍 {isFa ? "میزان اطمینان مدرس (۱ تا ۵):" : "Teacher Confidence (1-5):"}</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={confidence}
                  onChange={(e) => setConfidence(Number(e.target.value))}
                />
              </div>

              <div className={styles.formGroup}>
                <label>✍️ {isFa ? "یادداشت تشخیصی مدرس:" : "Diagnostic Notes:"}</label>
                <textarea
                  rows={3}
                  value={scoreNotes}
                  onChange={(e) => setScoreNotes(e.target.value)}
                  placeholder={isFa ? "توضیحات تشخیصی برای نمرات این جلسه..." : "Diagnostic observations..."}
                />
              </div>

              <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
                <Button type="submit" variant="primary" disabled={submittingScores}>
                  {submittingScores ? (isFa ? "در حال ذخیره..." : "Saving...") : (isFa ? "ثبت نمرات" : "Save Scores")}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowScoreModal(false)}>
                  {isFa ? "انصراف" : "Cancel"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Error Log Modal */}
      {showErrorModal && (
        <div className={styles.modalOverlay} onClick={() => setShowErrorModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "var(--space-4)" }}>
              📝 {isFa ? "ثبت خطای زبانی پرتکرار" : "Log Language Error"}
            </h3>
            <form onSubmit={handleErrorSubmit}>
              <div className={styles.formGroup}>
                <label>{isFa ? "دسته‌بندی خطا:" : "Category:"}</label>
                <select value={errorCategory} onChange={(e) => setErrorCategory(e.target.value)}>
                  <option value="grammar">{isFa ? "دستور زبان (Grammar)" : "Grammar"}</option>
                  <option value="vocabulary">{isFa ? "واژگان (Vocabulary)" : "Vocabulary"}</option>
                  <option value="pronunciation">{isFa ? "تلفظ (Pronunciation)" : "Pronunciation"}</option>
                  <option value="l1_interference">{isFa ? "تداخل زبان مادری (L1 Interference)" : "L1 Interference"}</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? "جمله حاوی خطا:" : "Error Sentence:"}</label>
                <input
                  type="text"
                  value={errorSentence}
                  onChange={(e) => setErrorSentence(e.target.value)}
                  placeholder="e.g. He go to school yesterday."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? "فرم صحیح جمله:" : "Correct Form:"}</label>
                <input
                  type="text"
                  value={errorCorrection}
                  onChange={(e) => setErrorCorrection(e.target.value)}
                  placeholder="e.g. He went to school yesterday."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? "تکرار:" : "Frequency:"}</label>
                <select value={errorFrequency} onChange={(e) => setErrorFrequency(e.target.value as any)}>
                  <option value="low">{isFa ? "کم (Low)" : "Low"}</option>
                  <option value="medium">{isFa ? "متوسط (Medium)" : "Medium"}</option>
                  <option value="high">{isFa ? "زیاد (High)" : "High"}</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
                <Button type="submit" variant="primary" disabled={submittingError}>
                  {submittingError ? (isFa ? "در حال ثبت..." : "Logging...") : (isFa ? "ثبت خطا" : "Log Error")}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowErrorModal(false)}>
                  {isFa ? "انصراف" : "Cancel"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Assessment Modal */}
      {showAssessmentModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAssessmentModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "var(--space-4)" }}>
              📊 {isFa ? "ثبت نتیجه آزمون کلاسی" : "Record Assessment Milestone"}
            </h3>
            <form onSubmit={handleAssessmentSubmit}>
              <div className={styles.formGroup}>
                <label>{isFa ? "عنوان آزمون:" : "Assessment Title:"}</label>
                <input
                  type="text"
                  value={assessTitle}
                  onChange={(e) => setAssessTitle(e.target.value)}
                  placeholder="e.g. Unit 1 Progress Test"
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
                <div className={styles.formGroup}>
                  <label>{isFa ? "نمره کسب شده:" : "Score:"}</label>
                  <input
                    type="number"
                    value={assessScore}
                    onChange={(e) => setAssessScore(Number(e.target.value))}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>{isFa ? "از نمره کل:" : "Max Score:"}</label>
                  <input
                    type="number"
                    value={assessMaxScore}
                    onChange={(e) => setAssessMaxScore(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
                <Button type="submit" variant="primary" disabled={submittingAssessment}>
                  {submittingAssessment ? (isFa ? "در حال ثبت..." : "Recording...") : (isFa ? "ثبت آزمون" : "Record")}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowAssessmentModal(false)}>
                  {isFa ? "انصراف" : "Cancel"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

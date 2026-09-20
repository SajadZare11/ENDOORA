"use client";

import { Button, Input, Table } from "@endoora/ui";
import React, { useState, useEffect, use } from "react";
import styles from "./student-dossier.module.css";
import { useTeacherHome } from "@/components/teacher/TeacherShell";
import {
  fetchStudentDossier,
  scoreStudentSkills,
  logStudentError,
  updateStudentErrorStatus,
  recordStudentAssessment,
  updateStudentDossier,
} from "@/lib/teacheros-api";
import type { StudentDossier, AssessmentMilestoneItem } from "@endoora/contracts";

type CategoryTab = "cat1" | "cat2" | "cat3";

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

  const [activeTab, setActiveTab] = useState<CategoryTab>("cat1");
  const [dossier, setDossier] = useState<StudentDossier | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

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

  // Goals Modal
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [longTermGoal, setLongTermGoal] = useState("");
  const [shortTermGoal, setShortTermGoal] = useState("");
  const [submittingGoals, setSubmittingGoals] = useState(false);

  // Preferences Modal
  const [showPrefsModal, setShowPrefsModal] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedBehaviors, setSelectedBehaviors] = useState<string[]>([]);
  const [prefPace, setPrefPace] = useState("Moderate with scaffolding");
  const [prefAnxieties, setPrefAnxieties] = useState("");
  const [submittingPrefs, setSubmittingPrefs] = useState(false);

  // Assessment Modal
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [assessType, setAssessType] = useState<"formal" | "informal">("informal");
  const [assessSubtype, setAssessSubtype] = useState("mini_quiz");
  const [assessTitle, setAssessTitle] = useState("");
  const [assessScore, setAssessScore] = useState(18);
  const [assessMaxScore, setAssessMaxScore] = useState(20);
  const [assessNotes, setAssessNotes] = useState("");
  const [submittingAssessment, setSubmittingAssessment] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await fetchStudentDossier(classId, studentId);
        if (!mounted) return;
        setDossier(data);
        if (data?.cefr_skills) {
          setScores({
            speaking: data.cefr_skills.speaking?.score ?? 12,
            listening: data.cefr_skills.listening?.score ?? 14,
            reading: data.cefr_skills.reading?.score ?? 15,
            writing: data.cefr_skills.writing?.score ?? 11,
            grammar: data.cefr_skills.grammar?.score ?? 10,
            vocabulary: data.cefr_skills.vocabulary?.score ?? 13,
            pronunciation: data.cefr_skills.pronunciation?.score ?? 12,
          });
        }
        if (data?.target_goals) {
          setLongTermGoal(data.target_goals.long_term || "IELTS 7.0+ & Academic English");
          setShortTermGoal(data.target_goals.short_term || "Master present perfect vs past simple");
        }
        if (data?.learning_preferences) {
          setSelectedActivities(data.learning_preferences.preferred_activities || ["pair work", "role play", "games"]);
          setSelectedBehaviors(data.learning_preferences.learning_behaviors || ["participates actively", "learns well through examples"]);
          setPrefPace(data.learning_preferences.pace || "Moderate with scaffolded guidance");
          setPrefAnxieties(data.learning_preferences.anxieties || "Speaking anxiety in front of larger groups");
        }
      } catch {
        // fallback
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void load();
    return () => {
      mounted = false;
    };
  }, [classId, studentId, refreshKey]);

  // Skill scoring submit with mandatory notes validation for scores < 10
  const hasLowScore = Object.values(scores).some((s) => s < 10);
  const handleScoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasLowScore && !scoreNotes.trim()) {
      alert(isFa ? "برای نمرات زیر ۱۰، ثبت یادداشت تشخیصی الزامی است." : "For scores below 10, an explanatory diagnostic note is required.");
      return;
    }
    setSubmittingScores(true);
    try {
      const updated = await scoreStudentSkills(classId, studentId, scores, confidence, scoreNotes);
      setDossier(updated);
      setShowScoreModal(false);
      setScoreNotes("");
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
    } catch {
      alert(isFa ? "خطا در ثبت خطای زبانی." : "Failed to log error.");
    } finally {
      setSubmittingError(false);
    }
  };

  // 1-Click Error Status update
  const handleToggleErrorStatus = async (errorId: string, newStatus: "improving" | "persistent" | "solved") => {
    try {
      const updated = await updateStudentErrorStatus(classId, studentId, errorId, newStatus);
      setDossier(updated);
    } catch {
      alert(isFa ? "خطا در به‌روزرسانی وضعیت خطا." : "Failed to update error status.");
    }
  };

  // Goals submit
  const handleGoalsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingGoals(true);
    try {
      const updated = await updateStudentDossier(classId, studentId, {
        target_goals: {
          ...(dossier?.target_goals || {}),
          long_term: longTermGoal,
          short_term: shortTermGoal,
        },
      });
      setDossier(updated);
      setShowGoalsModal(false);
    } catch {
      alert(isFa ? "خطا در ذخیره اهداف." : "Failed to save goals.");
    } finally {
      setSubmittingGoals(false);
    }
  };

  // Preferences submit
  const handlePrefsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingPrefs(true);
    try {
      const updated = await updateStudentDossier(classId, studentId, {
        learning_preferences: {
          ...(dossier?.learning_preferences || {}),
          preferred_activities: selectedActivities,
          learning_behaviors: selectedBehaviors,
          pace: prefPace,
          anxieties: prefAnxieties,
        },
      });
      setDossier(updated);
      setShowPrefsModal(false);
    } catch {
      alert(isFa ? "خطا در ذخیره ترجیحات یادگیری." : "Failed to save preferences.");
    } finally {
      setSubmittingPrefs(false);
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
        score: Number(assessScore),
        max_score: Number(assessMaxScore),
        notes: assessNotes,
      });
      if (res.dossier) setDossier(res.dossier);
      setShowAssessmentModal(false);
      setAssessTitle("");
      setAssessNotes("");
      setRefreshKey((k) => k + 1);
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
          {isFa ? "در حال بارگیری پرونده آموزشی ۱۱ بخشی..." : "Loading 11-Section Student Dossier..."}
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

  const milestones: AssessmentMilestoneItem[] = dossier?.assessment_milestones || [];

  return (
    <div className={styles.container}>
      {/* Dossier Header */}
      <section className={styles.headerCard}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>
              👤 {dossier?.learner_email ?? (isFa ? "پرونده دانش‌آموز" : "Student Dossier")}
            </h1>
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
              {isFa ? "پرونده پداگوژیک ۱۱ بخشی" : "11-Section Pedagogical Dossier"}
            </span>
            <span
              style={{
                background: "rgba(59, 130, 246, 0.15)",
                color: "var(--color-endoora-blue)",
                padding: "3px 10px",
                borderRadius: "var(--radius-pill)",
                fontSize: "0.85rem",
                fontWeight: 700,
              }}
            >
              {isFa ? `سطح کل CEFR: ${dossier?.cefr_overall || "B1"}` : `Overall CEFR: ${dossier?.cefr_overall || "B1"}`}
            </span>
          </div>
          <p style={{ color: "var(--color-muted)", fontSize: "0.9rem", marginTop: "4px" }}>
            {isFa
              ? `کلاس: ${dossier?.class_title || "کلاس فعلی"} · شاخص تعامل: ${Number(dossier?.engagement_index || 1).toFixed(2)}`
              : `Class: ${dossier?.class_title || "Current Class"} · Engagement Index: ${Number(dossier?.engagement_index || 1).toFixed(2)}`}
          </p>
        </div>

        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
          <Button
            type="button"
            variant="primary"
            className="teacher-button teacher-button--primary"
            onClick={() => setShowScoreModal(true)}
          >
            ➕ {isFa ? "ثبت نمره مهارت‌های این جلسه (از ۲۰)" : "Score Today's Skills (0-20)"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="teacher-button teacher-button--secondary"
            onClick={() => setShowErrorModal(true)}
          >
            📝 {isFa ? "ثبت خطای زبانی جدید" : "Log Language Error"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="teacher-button teacher-button--secondary"
            onClick={() => setShowAssessmentModal(true)}
          >
            📊 {isFa ? "ثبت نتیجه آزمون" : "Record Assessment"}
          </Button>
        </div>
      </section>

      {/* 3 Categories Tabs */}
      <nav className={styles.categoryTabs}>
        <Button
          type="button"
          variant={activeTab === "cat1" ? "primary" : "secondary"}
          size="sm"
          className={styles.categoryTab}
          data-active={activeTab === "cat1"}
          onClick={() => setActiveTab("cat1")}
        >
          📋 {isFa ? "دسته ۱: پروفایل و هویت (بخش‌های ۱ تا ۴)" : "Category 1: Profile & Identity (Sec 1-4)"}
        </Button>
        <Button
          type="button"
          variant={activeTab === "cat2" ? "primary" : "secondary"}
          size="sm"
          className={styles.categoryTab}
          data-active={activeTab === "cat2"}
          onClick={() => setActiveTab("cat2")}
        >
          ⚡ {isFa ? "دسته ۲: وضعیت فعلی و مهارت‌ها (بخش‌های ۵ تا ۷ و ۱۰ب)" : "Category 2: Current State & Skills (Sec 5-7, 10b)"}
        </Button>
        <Button
          type="button"
          variant={activeTab === "cat3" ? "primary" : "secondary"}
          size="sm"
          className={styles.categoryTab}
          data-active={activeTab === "cat3"}
          onClick={() => setActiveTab("cat3")}
        >
          📈 {isFa ? "دسته ۳: سوابق، آزمون‌ها و پیشرفت (بخش‌های ۸ تا ۱۱ و ۱۰الف)" : "Category 3: History & Progress (Sec 8-11, 10a)"}
        </Button>
      </nav>

      {/* CATEGORY 1: PROFILE & IDENTITY */}
      {activeTab === "cat1" && (
        <div className={styles.cardGrid}>
          {/* Section 1: Identity & Background */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeaderRow}>
              <h3 className={styles.sectionTitle}>
                <span>👤</span> {isFa ? "بخش ۱: هویت و سوابق زبان‌آموز" : "Section 1: Student Identity & Background"}
              </h3>
            </div>
            <p><strong>{isFa ? "ایمیل و حساب کاربری:" : "Email / Account:"}</strong> {dossier?.learner_email}</p>
            <p><strong>{isFa ? "زبان مادری:" : "Native Language:"}</strong> {isFa ? "فارسی (Persian)" : "Persian"}</p>
            <p><strong>{isFa ? "کلاس منتسب:" : "Enrolled Class:"}</strong> {dossier?.class_title || "کلاس عمومی"}</p>
            <p><strong>{isFa ? "سطح کلی برآورد شده:" : "Overall CEFR Level:"}</strong> <span className={styles.scoreBadgeHigh}>{dossier?.cefr_overall || "B1"}</span></p>
            <p style={{ fontSize: "0.8rem", color: "var(--color-muted)", marginTop: "var(--space-2)" }}>
              {isFa ? `آخرین به‌روزرسانی پرونده: ${dossier?.updated_at ? new Date(dossier.updated_at).toLocaleDateString("fa-IR") : "امروز"}` : `Last Updated: ${dossier?.updated_at ? new Date(dossier.updated_at).toLocaleDateString("en-US") : "Today"}`}
            </p>
          </div>

          {/* Section 2: 7-Skill CEFR Calibration */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeaderRow}>
              <h3 className={styles.sectionTitle}>
                <span>📊</span> {isFa ? "بخش ۲: رادار و کالیبراسیون ۷ مهارت CEFR" : "Section 2: 7-Skill CEFR Calibration"}
              </h3>
              <Button type="button" variant="secondary" size="sm" onClick={() => setShowScoreModal(true)}>
                ✏️ {isFa ? "ثبت نمره" : "Score"}
              </Button>
            </div>
            <div className={styles.skillsList}>
              {skillsList.map((skill) => {
                const score = skill.data?.score ?? 10;
                const conf = skill.data?.confidence ?? 3;
                const percent = Math.round((score / 20) * 100);
                return (
                  <div key={skill.key} className={styles.skillRow}>
                    <div className={styles.skillHeader}>
                      <span>{isFa ? skill.labelFa : skill.labelEn}</span>
                      <span style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <span className={score >= 10 ? styles.scoreBadgeHigh : styles.scoreBadgeLow}>
                          {score} / 20
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>
                          {"★".repeat(conf)}{"☆".repeat(Math.max(0, 5 - conf))}
                        </span>
                      </span>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{
                          width: `${percent}%`,
                          background: score >= 10 ? "var(--color-learning-teal)" : "var(--color-error-red)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Learning Goals */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeaderRow}>
              <h3 className={styles.sectionTitle}>
                <span>🎯</span> {isFa ? "بخش ۳: اهداف بلندمدت و عطف کوتاه‌مدت" : "Section 3: Short & Long-term Goals"}
              </h3>
              <Button type="button" variant="secondary" size="sm" onClick={() => setShowGoalsModal(true)}>
                ✏️ {isFa ? "ویرایش اهداف" : "Edit Goals"}
              </Button>
            </div>
            <div>
              <strong>{isFa ? "هدف بلندمدت زبان‌آموز:" : "Long-term Goal:"}</strong>
              <p style={{ color: "var(--color-text)", marginTop: "4px", fontWeight: 600 }}>
                {dossier?.target_goals?.long_term || (isFa ? "دستیابی به تسلط مکالمه و آیلتس ۷.۰+" : "IELTS 7.0+ & Academic Fluency")}
              </p>
            </div>
            <div style={{ marginTop: "var(--space-3)" }}>
              <strong>{isFa ? "هدف کوتاه‌مدت جلسه آینده:" : "Next Session Milestone:"}</strong>
              <p style={{ color: "var(--color-muted)", marginTop: "4px" }}>
                {dossier?.target_goals?.short_term || (isFa ? "تسلط بر تمایز Past Simple و Present Perfect" : "Master present perfect vs past simple distinction")}
              </p>
            </div>
            <div style={{ marginTop: "var(--space-3)", display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {PRESET_GOALS.slice(0, 4).map((g) => (
                <span key={g} className={styles.interactiveChip}>🎯 {g}</span>
              ))}
            </div>
          </div>

          {/* Section 4: Learning Preferences & Behaviors */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeaderRow}>
              <h3 className={styles.sectionTitle}>
                <span>🧩</span> {isFa ? "بخش ۴: ترجیحات و رفتارهای یادگیری" : "Section 4: Preferences & Behaviors"}
              </h3>
              <Button type="button" variant="secondary" size="sm" onClick={() => setShowPrefsModal(true)}>
                ✏️ {isFa ? "ویرایش" : "Edit"}
              </Button>
            </div>
            <div>
              <strong>{isFa ? "فعالیت‌های یادگیری مطلوب:" : "Preferred Activities:"}</strong>
              <div className={styles.tagList} style={{ marginTop: "4px" }}>
                {(dossier?.learning_preferences?.preferred_activities || ["pair work", "role play", "games"]).map((act: string) => (
                  <span key={act} className={styles.interactiveChip}>🎲 {act}</span>
                ))}
              </div>
            </div>
            <div style={{ marginTop: "var(--space-3)" }}>
              <strong>{isFa ? "الگوهای رفتار شناختی کلاسی:" : "Classroom Learning Behaviors:"}</strong>
              <div className={styles.tagList} style={{ marginTop: "4px" }}>
                {(dossier?.learning_preferences?.learning_behaviors || ["participates actively", "learns well through examples"]).map((beh: string) => (
                  <span key={beh} className={styles.interactiveChip}>💡 {beh}</span>
                ))}
              </div>
            </div>
            <p style={{ marginTop: "var(--space-2)" }}><strong>{isFa ? "سرعت مطلوب تدریس:" : "Pace:"}</strong> {dossier?.learning_preferences?.pace || (isFa ? "متوسط با داربست آموزشی" : "Moderate with scaffolding")}</p>
            <p><strong>{isFa ? "ملاحظات رفتاری / اضطراب:" : "Anxieties / Notes:"}</strong> {dossier?.learning_preferences?.anxieties || (isFa ? "کمی اضطراب صحبت در جمع" : "Slight group speaking anxiety")}</p>
          </div>
        </div>
      )}

      {/* CATEGORY 2: CURRENT STATE & SKILLS */}
      {activeTab === "cat2" && (
        <div className={styles.cardGrid}>
          {/* Section 5: Strengths */}
          <div className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>
              <span>🌟</span> {isFa ? "بخش ۵: نقاط قوت (میانگین بالای ۱۰ از ۲۰)" : "Section 5: Strengths (>= 10/20)"}
            </h3>
            <div className={styles.tagList}>
              {dossier?.strengths && dossier.strengths.length > 0 ? (
                dossier.strengths.map((str) => (
                  <span key={str} className={styles.tagStrength}>
                    ✓ {str}
                  </span>
                ))
              ) : (
                <p style={{ color: "var(--color-muted)" }}>{isFa ? "هنوز نقطه‌قوت ثبت‌نشده است." : "No strengths recorded."}</p>
              )}
            </div>
          </div>

          {/* Section 6: Areas for Development */}
          <div className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>
              <span>⚠️</span> {isFa ? "بخش ۶: نقاط نیازمند تقویت (زیر ۱۰ از ۲۰ با یادداشت تشخیصی)" : "Section 6: Development Areas (< 10/20 with Notes)"}
            </h3>
            <div className={styles.tagList}>
              {dossier?.areas_for_development && dossier.areas_for_development.length > 0 ? (
                dossier.areas_for_development.map((area) => (
                  <span key={area} className={styles.tagArea}>
                    ! {area}
                  </span>
                ))
              ) : (
                <p style={{ color: "var(--color-muted)" }}>{isFa ? "نقطه ضعف بحرانی ثبت نشده است." : "No critical areas flagged."}</p>
              )}
            </div>
            {dossier?.skill_scores_history && dossier.skill_scores_history.length > 0 && (
              <div style={{ marginTop: "var(--space-2)", fontSize: "0.85rem", color: "var(--color-muted)" }}>
                <strong>{isFa ? "یادداشت تشخیصی آخرین جلسه:" : "Latest Diagnostic Note:"}</strong>{" "}
                {dossier.skill_scores_history[dossier.skill_scores_history.length - 1].notes || (isFa ? "نیازمند تمرین داربست‌بندی ساختار گرامری." : "Requires scaffolded grammar reinforcement.")}
              </div>
            )}
          </div>

          {/* Section 7: Language Error Profile */}
          <div className={styles.sectionCard} style={{ gridColumn: "1 / -1" }}>
            <div className={styles.sectionHeaderRow}>
              <h3 className={styles.sectionTitle}>
                <span>📝</span> {isFa ? "بخش ۷: پروفایل خطاهای زبانی و وضعیت حل آن‌ها" : "Section 7: Language Error Profile & Resolution Status"}
              </h3>
              <Button type="button" variant="primary" size="sm" onClick={() => setShowErrorModal(true)}>
                ➕ {isFa ? "ثبت خطای جدید" : "Log Error"}
              </Button>
            </div>
            {dossier?.error_profile && dossier.error_profile.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-3)" }}>
                {dossier.error_profile.map((err) => {
                  const freq = err.frequency || "medium";
                  const freqClass = freq === "low" ? styles.freqBadgeLow : freq === "high" ? styles.freqBadgeHigh : styles.freqBadgeMedium;
                  const currentStatus = err.status || "improving";
                  return (
                    <div key={err.id} className={styles.errorItem}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem" }}>
                        <span style={{ textTransform: "uppercase", fontWeight: 700, color: "var(--color-endoora-blue)" }}>
                          {err.category}
                        </span>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <span className={`${styles.freqBadge} ${freqClass}`}>
                            {freq}
                          </span>
                          <span style={{ color: "var(--color-muted)" }}>{err.date}</span>
                        </div>
                      </div>

                      <div className={styles.errorSentence}>{err.sentence}</div>
                      <div className={styles.correctionSentence}>{err.correction}</div>
                      {err.notes && <div style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>💡 {err.notes}</div>}

                      {/* 1-Click Status Selector */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "var(--space-2)", paddingTop: "var(--space-1)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>{isFa ? "وضعیت خطا:" : "Status:"}</span>
                        <div className={styles.statusPills}>
                          <button
                            type="button"
                            className={styles.statusPill}
                            data-active={currentStatus === "improving"}
                            data-status="improving"
                            onClick={() => handleToggleErrorStatus(err.id, "improving")}
                          >
                            {isFa ? "در حال بهبود" : "Improving"}
                          </button>
                          <button
                            type="button"
                            className={styles.statusPill}
                            data-active={currentStatus === "persistent"}
                            data-status="persistent"
                            onClick={() => handleToggleErrorStatus(err.id, "persistent")}
                          >
                            {isFa ? "مداوم" : "Persistent"}
                          </button>
                          <button
                            type="button"
                            className={styles.statusPill}
                            data-active={currentStatus === "solved"}
                            data-status="solved"
                            onClick={() => handleToggleErrorStatus(err.id, "solved")}
                          >
                            {isFa ? "حل شده" : "Solved"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: "var(--color-muted)" }}>{isFa ? "خطای زبانی ثبت نشده است. از دکمه ثبت خطا استفاده کنید." : "No errors logged yet."}</p>
            )}
          </div>

          {/* Section 10b: Motivation & Confidence Dynamics */}
          <div className={styles.sectionCard} style={{ gridColumn: "1 / -1" }}>
            <h3 className={styles.sectionTitle}>
              <span>🔥</span> {isFa ? "بخش ۱۰ب: دینامیک انگیزه و اعتمادبه‌نفس" : "Section 10b: Motivation & Confidence Dynamics"}
            </h3>
            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <span className={styles.metricVal}>🔥 بالا</span>
                <span className={styles.metricLabel}>{isFa ? "سطح انگیزه فعلی" : "Current Motivation"}</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricVal}>🎯 آکادمیک</span>
                <span className={styles.metricLabel}>{isFa ? "محرک اصلی یادگیری" : "Primary Driver"}</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricVal}>4.8 / 5</span>
                <span className={styles.metricLabel}>{isFa ? "تعهد به اهداف" : "Goal Commitment"}</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricVal}>★ 4.0</span>
                <span className={styles.metricLabel}>{isFa ? "شاخص اعتمادبه‌نفس" : "Confidence Index"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 3: HISTORY & PROGRESS */}
      {activeTab === "cat3" && (
        <div className={styles.cardGrid}>
          {/* Section 8: Assessment & Quiz Results */}
          <div className={styles.sectionCard} style={{ gridColumn: "1 / -1" }}>
            <div className={styles.sectionHeaderRow}>
              <h3 className={styles.sectionTitle}>
                <span>📊</span> {isFa ? "بخش ۸: نتایج آزمون‌های رسمی و ارزیابی‌های کلاسی" : "Section 8: Formal & Informal Assessment Results"}
              </h3>
              <Button type="button" variant="primary" size="sm" onClick={() => setShowAssessmentModal(true)}>
                ➕ {isFa ? "ثبت نتیجه آزمون" : "Record Result"}
              </Button>
            </div>
            {milestones.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <Table style={{ width: "100%", borderCollapse: "collapse", textAlign: isFa ? "right" : "left", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                      <th style={{ padding: "8px" }}>{isFa ? "عنوان آزمون" : "Assessment Title"}</th>
                      <th style={{ padding: "8px" }}>{isFa ? "نوع" : "Type"}</th>
                      <th style={{ padding: "8px" }}>{isFa ? "زیرنوع" : "Subtype"}</th>
                      <th style={{ padding: "8px" }}>{isFa ? "نمره" : "Score"}</th>
                      <th style={{ padding: "8px" }}>{isFa ? "درصد" : "Percentage"}</th>
                      <th style={{ padding: "8px" }}>{isFa ? "تاریخ" : "Date"}</th>
                      <th style={{ padding: "8px" }}>{isFa ? "یادداشت مدرس" : "Teacher Notes"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {milestones.map((m, idx) => (
                      <tr key={m.id || idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                        <td style={{ padding: "8px", fontWeight: 700 }}>{m.title}</td>
                        <td style={{ padding: "8px" }}>
                          <span className={m.type === "formal" ? styles.scoreBadgeHigh : styles.interactiveChip}>
                            {m.type}
                          </span>
                        </td>
                        <td style={{ padding: "8px" }}>{m.subtype}</td>
                        <td style={{ padding: "8px", fontWeight: 600 }}>{m.score} / {m.max_score}</td>
                        <td style={{ padding: "8px" }}>
                          <span className={styles.scoreBadgeHigh}>
                            {m.percentage ?? Math.round((m.score / m.max_score) * 100)}%
                          </span>
                        </td>
                        <td style={{ padding: "8px", color: "var(--color-muted)" }}>{m.date || "—"}</td>
                        <td style={{ padding: "8px", color: "var(--color-muted)" }}>{m.notes || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <p style={{ color: "var(--color-muted)" }}>{isFa ? "آزمونی ثبت نشده است. با دکمه ثبت نتیجه آزمون، نتایج کوئیزها یا آزمون‌های تعیین سطح را اضافه کنید." : "No assessment results logged yet."}</p>
            )}
          </div>

          {/* Section 9: Longitudinal Skill Progress */}
          <div className={styles.sectionCard} style={{ gridColumn: "1 / -1" }}>
            <h3 className={styles.sectionTitle}>
              <span>📈</span> {isFa ? "بخش ۹: روند طولی ارزیابی ۷ مهارت (سوابق جلسات)" : "Section 9: Longitudinal 7-Skill Growth Progression"}
            </h3>
            {dossier?.skill_scores_history && dossier.skill_scores_history.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <Table style={{ width: "100%", borderCollapse: "collapse", textAlign: isFa ? "right" : "left", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                      <th style={{ padding: "8px" }}>{isFa ? "تاریخ جلسه" : "Date"}</th>
                      <th style={{ padding: "8px" }}>Speaking</th>
                      <th style={{ padding: "8px" }}>Listening</th>
                      <th style={{ padding: "8px" }}>Reading</th>
                      <th style={{ padding: "8px" }}>Writing</th>
                      <th style={{ padding: "8px" }}>Grammar</th>
                      <th style={{ padding: "8px" }}>Vocabulary</th>
                      <th style={{ padding: "8px" }}>Pronunciation</th>
                      <th style={{ padding: "8px" }}>{isFa ? "اعتماد" : "Confidence"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dossier.skill_scores_history.map((hist, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                        <td style={{ padding: "8px", fontWeight: 600 }}>{hist.date}</td>
                        <td style={{ padding: "8px" }}>{hist.scores?.speaking ?? "—"}</td>
                        <td style={{ padding: "8px" }}>{hist.scores?.listening ?? "—"}</td>
                        <td style={{ padding: "8px" }}>{hist.scores?.reading ?? "—"}</td>
                        <td style={{ padding: "8px" }}>{hist.scores?.writing ?? "—"}</td>
                        <td style={{ padding: "8px" }}>{hist.scores?.grammar ?? "—"}</td>
                        <td style={{ padding: "8px" }}>{hist.scores?.vocabulary ?? "—"}</td>
                        <td style={{ padding: "8px" }}>{hist.scores?.pronunciation ?? "—"}</td>
                        <td style={{ padding: "8px", color: "var(--color-muted)" }}>★ {hist.confidence ?? 3}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <p style={{ color: "var(--color-muted)" }}>{isFa ? "سوابقی ثبت نشده است." : "No longitudinal history yet."}</p>
            )}
          </div>

          {/* Section 10a: Classroom Engagement & Attendance Index */}
          <div className={styles.sectionCard} style={{ gridColumn: "1 / -1" }}>
            <h3 className={styles.sectionTitle}>
              <span>⏱️</span> {isFa ? "بخش ۱۰الف: شاخص نظم، حضور و تعامل کلاسی" : "Section 10a: Classroom Engagement & Attendance Index"}
            </h3>
            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <span className={styles.metricVal}>95%</span>
                <span className={styles.metricLabel}>{isFa ? "میزان حضور (Attendance)" : "Attendance Rate"}</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricVal}>100%</span>
                <span className={styles.metricLabel}>{isFa ? "وقت‌شناسی (Punctuality)" : "Punctuality"}</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricVal}>4.6 / 5</span>
                <span className={styles.metricLabel}>{isFa ? "مشارکت کلاسی (Participation)" : "Participation"}</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricVal}>90%</span>
                <span className={styles.metricLabel}>{isFa ? "انجام تکالیف (Homework)" : "Homework Completion"}</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricVal}>4.5 / 5</span>
                <span className={styles.metricLabel}>{isFa ? "آمادگی قبلی (Preparation)" : "Preparation"}</span>
              </div>
            </div>
          </div>

          {/* Section 11: AI Co-Teacher Recommendation */}
          <div className={styles.sectionCard} style={{ gridColumn: "1 / -1", background: "rgba(124, 58, 237, 0.08)", border: "1px solid rgba(124, 58, 237, 0.3)" }}>
            <h3 className={styles.sectionTitle} style={{ color: "var(--color-intelligence-purple)" }}>
              <span>🤖</span> {isFa ? "بخش ۱۱: پیشنهاد هوشمند گام بعدی (AI Co-Teacher Recommendation)" : "Section 11: AI Co-Teacher Recommendation"}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {dossier?.ai_recommendations && dossier.ai_recommendations.length > 0 ? (
                dossier.ai_recommendations.map((rec, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)", padding: "10px 14px", borderRadius: "var(--radius-control)" }}>
                    <span style={{ lineHeight: 1.5 }}>💡 {rec}</span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Button type="button" variant="primary" size="sm" onClick={() => alert(isFa ? "پیشنهاد به طرح درس جلسه بعدی متصل شد." : "Adopted into next lesson plan.")}>
                        ✓ {isFa ? "پذیرش" : "Adopt"}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p>{isFa ? "پیشنهاد هوشمند: تمرین‌های داربست‌بندی شده برای تقویت دقت گرامری." : "Scaffolded practice recommended for grammar accuracy."}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Daily 1-Tap Skill Scoring Modal */}
      {showScoreModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 style={{ marginBottom: "var(--space-4)" }}>
              ➕ {isFa ? "ثبت نمرات هفت مهارت این جلسه (از ۲۰)" : "Score Today's Skills (0-20)"}
            </h2>

            {hasLowScore && (
              <div className={styles.warningAlert}>
                ⚠️ {isFa ? "توجه: برای نمرات زیر ۱۰، ثبت یادداشت تشخیصی الزامی است." : "Attention: For scores below 10, an explanatory diagnostic note is strictly required."}
              </div>
            )}

            <form onSubmit={handleScoreSubmit}>
              {skillsList.map((skill) => {
                const val = scores[skill.key];
                return (
                  <div key={skill.key} className={styles.formGroup}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                      <label style={{ color: val < 10 ? "var(--color-error-red)" : "inherit" }}>
                        {isFa ? skill.labelFa : skill.labelEn}
                      </label>
                      <span style={{ fontWeight: 700, color: val < 10 ? "var(--color-error-red)" : "inherit" }}>
                        {val} / 20 {val < 10 ? "⚠️" : ""}
                      </span>
                    </div>
                    <Input
                      type="range"
                      min="0"
                      max="20"
                      value={val}
                      onChange={(e) =>
                        setScores({ ...scores, [skill.key]: Number(e.target.value) })
                      }
                    />
                  </div>
                );
              })}

              <div className={styles.formGroup}>
                <label>{isFa ? `درجه اعتمادبه‌نفس دانش‌آموز: (${confidence} از ۵)` : `Student Confidence (${confidence}/5):`}</label>
                <Input
                  type="range"
                  min="1"
                  max="5"
                  value={confidence}
                  onChange={(e) => setConfidence(Number(e.target.value))}
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  {isFa ? "یادداشت تشخیصی عملکرد امروز:" : "Diagnostic Performance Notes:"}
                  {hasLowScore && <span style={{ color: "var(--color-error-red)", marginInlineStart: "4px" }}>* (الزامی برای نمرات زیر ۱۰)</span>}
                </label>
                <textarea
                  rows={3}
                  value={scoreNotes}
                  onChange={(e) => setScoreNotes(e.target.value)}
                  placeholder={
                    hasLowScore
                      ? isFa ? "دلیل نمره زیر ۱۰ و برنامه آموزشی پیشنهادی را توضیح دهید..." : "Explain reason for score < 10 and remedial intervention..."
                      : isFa ? "مشاهدات و نکات عملکردی..." : "Observations and notes..."
                  }
                  required={hasLowScore}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)" }}>
                <Button type="button" variant="secondary" className="teacher-button teacher-button--secondary" onClick={() => setShowScoreModal(false)}>
                  {isFa ? "انصراف" : "Cancel"}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="teacher-button teacher-button--primary"
                  loading={submittingScores}
                  disabled={submittingScores || (hasLowScore && !scoreNotes.trim())}
                >
                  {submittingScores ? (isFa ? "در حال ثبت..." : "Saving...") : (isFa ? "💾 ثبت نمرات" : "Save Scores")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Error Modal */}
      {showErrorModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 style={{ marginBottom: "var(--space-4)" }}>
              📝 {isFa ? "ثبت خطای زبانی در پروفایل زبان‌آموز" : "Log Language Error"}
            </h2>
            <form onSubmit={handleErrorSubmit}>
              <div className={styles.formGroup}>
                <label>{isFa ? "دسته‌بندی خطا:" : "Error Category:"}</label>
                <select value={errorCategory} onChange={(e) => setErrorCategory(e.target.value)}>
                  <option value="grammar">{isFa ? "دستور زبان (Grammar)" : "Grammar"}</option>
                  <option value="lexis">{isFa ? "واژگان و اصطلاحات (Lexis)" : "Lexis"}</option>
                  <option value="phonology">{isFa ? "تلفظ و آواشناسی (Phonology)" : "Phonology"}</option>
                  <option value="l1_interference">{isFa ? "تداخل زبان مادری (L1 Interference)" : "L1 Interference"}</option>
                  <option value="spelling">{isFa ? "املایی (Spelling)" : "Spelling"}</option>
                  <option value="other">{isFa ? "سایر (Other)" : "Other"}</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? "جمله یا عبارت اشتباه گفته‌شده:" : "Erroneous Sentence / Utterance:"}</label>
                <Input
                  type="text"
                  value={errorSentence}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setErrorSentence(e.target.value)}
                  placeholder="e.g. He go to school yesterday."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? "تصحیح صحیح جمله:" : "Correct Form:"}</label>
                <Input
                  type="text"
                  value={errorCorrection}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setErrorCorrection(e.target.value)}
                  placeholder="e.g. He went to school yesterday."
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
                <div className={styles.formGroup}>
                  <label>{isFa ? "تکرار خطا (Frequency):" : "Frequency:"}</label>
                  <select value={errorFrequency} onChange={(e) => setErrorFrequency(e.target.value as "low" | "medium" | "high")}>
                    <option value="low">{isFa ? "کم (Low)" : "Low"}</option>
                    <option value="medium">{isFa ? "متوسط (Medium)" : "Medium"}</option>
                    <option value="high">{isFa ? "زیاد (High)" : "High"}</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>{isFa ? "وضعیت خطا (Status):" : "Status:"}</label>
                  <select value={errorStatus} onChange={(e) => setErrorStatus(e.target.value as "improving" | "persistent" | "solved")}>
                    <option value="improving">{isFa ? "در حال بهبود" : "Improving"}</option>
                    <option value="persistent">{isFa ? "مداوم" : "Persistent"}</option>
                    <option value="solved">{isFa ? "حل شده" : "Solved"}</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? "توضیح یا نکته آموزشی:" : "Instructional Note:"}</label>
                <Input
                  type="text"
                  value={errorNotes}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setErrorNotes(e.target.value)}
                  placeholder={isFa ? "نیاز به مرور افعال بی‌قاعده..." : "Needs irregular past verb review..."}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)" }}>
                <Button type="button" variant="secondary" className="teacher-button teacher-button--secondary" onClick={() => setShowErrorModal(false)}>
                  {isFa ? "انصراف" : "Cancel"}
                </Button>
                <Button type="submit" variant="primary" className="teacher-button teacher-button--primary" loading={submittingError} disabled={submittingError}>
                  {submittingError ? (isFa ? "در حال ثبت..." : "Logging...") : (isFa ? "💾 ثبت خطا" : "Log Error")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goals Modal */}
      {showGoalsModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 style={{ marginBottom: "var(--space-4)" }}>
              🎯 {isFa ? "ویرایش اهداف زبان‌آموز" : "Edit Student Learning Goals"}
            </h2>
            <form onSubmit={handleGoalsSubmit}>
              <div className={styles.formGroup}>
                <label>{isFa ? "هدف بلندمدت زبان‌آموز:" : "Long-term Goal:"}</label>
                <Input
                  type="text"
                  value={longTermGoal}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLongTermGoal(e.target.value)}
                  placeholder="e.g. IELTS 7.5+ / Study Abroad"
                  required
                />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
                  {PRESET_GOALS.map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      className={styles.interactiveChip}
                      onClick={() => setLongTermGoal(preset)}
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? "هدف کوتاه‌مدت جلسه آینده:" : "Short-term Goal (Next Session):"}</label>
                <Input
                  type="text"
                  value={shortTermGoal}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShortTermGoal(e.target.value)}
                  placeholder="e.g. Master passive voice in academic writing"
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)" }}>
                <Button type="button" variant="secondary" className="teacher-button teacher-button--secondary" onClick={() => setShowGoalsModal(false)}>
                  {isFa ? "انصراف" : "Cancel"}
                </Button>
                <Button type="submit" variant="primary" className="teacher-button teacher-button--primary" loading={submittingGoals} disabled={submittingGoals}>
                  {submittingGoals ? (isFa ? "در حال ذخیره..." : "Saving...") : (isFa ? "💾 ذخیره اهداف" : "Save Goals")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showPrefsModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 style={{ marginBottom: "var(--space-4)" }}>
              🧩 {isFa ? "ویرایش ترجیحات و رفتارهای یادگیری" : "Edit Learning Preferences & Behaviors"}
            </h2>
            <form onSubmit={handlePrefsSubmit}>
              <div className={styles.formGroup}>
                <label>{isFa ? "فعالیت‌های ترجیحی:" : "Preferred Activities:"}</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                  {PRESET_ACTIVITIES.map((act) => {
                    const isSelected = selectedActivities.includes(act);
                    return (
                      <button
                        type="button"
                        key={act}
                        className={styles.interactiveChip}
                        style={{
                          background: isSelected ? "rgba(59, 130, 246, 0.25)" : undefined,
                          borderColor: isSelected ? "var(--color-endoora-blue)" : undefined,
                        }}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedActivities(selectedActivities.filter((a) => a !== act));
                          } else {
                            setSelectedActivities([...selectedActivities, act]);
                          }
                        }}
                      >
                        {isSelected ? "✓" : "+"} {act}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? "الگوهای رفتار شناختی و کلاسی:" : "Classroom Learning Behaviors:"}</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                  {PRESET_BEHAVIORS.map((beh) => {
                    const isSelected = selectedBehaviors.includes(beh);
                    return (
                      <button
                        type="button"
                        key={beh}
                        className={styles.interactiveChip}
                        style={{
                          background: isSelected ? "rgba(16, 185, 129, 0.25)" : undefined,
                          borderColor: isSelected ? "var(--color-success-green)" : undefined,
                        }}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedBehaviors(selectedBehaviors.filter((b) => b !== beh));
                          } else {
                            setSelectedBehaviors([...selectedBehaviors, beh]);
                          }
                        }}
                      >
                        {isSelected ? "✓" : "+"} {beh}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? "سرعت مطلوب تدریس:" : "Pace:"}</label>
                <Input
                  type="text"
                  value={prefPace}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrefPace(e.target.value)}
                  placeholder="Moderate with scaffolding"
                />
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? "ملاحظات رفتاری یا اضطراب کلاسی:" : "Anxieties / Considerations:"}</label>
                <Input
                  type="text"
                  value={prefAnxieties}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrefAnxieties(e.target.value)}
                  placeholder="Speaking anxiety in front of large groups"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)" }}>
                <Button type="button" variant="secondary" className="teacher-button teacher-button--secondary" onClick={() => setShowPrefsModal(false)}>
                  {isFa ? "انصراف" : "Cancel"}
                </Button>
                <Button type="submit" variant="primary" className="teacher-button teacher-button--primary" loading={submittingPrefs} disabled={submittingPrefs}>
                  {submittingPrefs ? (isFa ? "در حال ذخیره..." : "Saving...") : (isFa ? "💾 ذخیره ترجیحات" : "Save Preferences")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Assessment Modal */}
      {showAssessmentModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 style={{ marginBottom: "var(--space-4)" }}>
              📊 {isFa ? "ثبت نتیجه آزمون رسمی یا کلاسی" : "Record Assessment / Quiz Result"}
            </h2>
            <form onSubmit={handleAssessmentSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
                <div className={styles.formGroup}>
                  <label>{isFa ? "نوع ارزیابی:" : "Assessment Type:"}</label>
                  <select value={assessType} onChange={(e) => setAssessType(e.target.value as "formal" | "informal")}>
                    <option value="formal">{isFa ? "رسمی (Formal)" : "Formal"}</option>
                    <option value="informal">{isFa ? "کلاسی / غیررسمی (Informal)" : "Informal"}</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>{isFa ? "دسته‌بندی فرعی:" : "Subtype:"}</label>
                  <select value={assessSubtype} onChange={(e) => setAssessSubtype(e.target.value)}>
                    <option value="placement">{isFa ? "تعیین سطح (Placement)" : "Placement"}</option>
                    <option value="midterm">{isFa ? "میان‌ترم (Midterm)" : "Midterm"}</option>
                    <option value="final">{isFa ? "پایان‌ترم (Final)" : "Final"}</option>
                    <option value="mini_quiz">{isFa ? "کوئیز کلاسی (Mini-quiz)" : "Mini-quiz"}</option>
                    <option value="speaking">{isFa ? "آزمون شفاهی (Speaking)" : "Speaking"}</option>
                    <option value="writing_sample">{isFa ? "نمونه نگارش (Writing)" : "Writing Sample"}</option>
                    <option value="observation">{isFa ? "مشاهده عملکرد (Observation)" : "Observation"}</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? "عنوان آزمون یا ارزیابی:" : "Assessment Title:"}</label>
                <Input
                  type="text"
                  value={assessTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAssessTitle(e.target.value)}
                  placeholder={isFa ? "مثلاً کوئیز زمان‌های گذشته جلسه ۳" : "e.g. Unit 3 Past Tenses Quiz"}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
                <div className={styles.formGroup}>
                  <label>{isFa ? "نمره کسب‌شده:" : "Score:"}</label>
                  <Input
                    type="number"
                    min="0"
                    max={assessMaxScore}
                    value={assessScore}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAssessScore(Number(e.target.value))}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>{isFa ? "سقف نمره (حداکثر):" : "Max Score:"}</label>
                  <Input
                    type="number"
                    min="1"
                    value={assessMaxScore}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAssessMaxScore(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? "یادداشت تشخیصی و بازخورد مدرس:" : "Teacher Diagnostic Notes:"}</label>
                <Input
                  type="text"
                  value={assessNotes}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAssessNotes(e.target.value)}
                  placeholder={isFa ? "عملکرد عالی در گرامر، نیاز به تقویت لغات تخصصی..." : "Solid grammar mastery, requires academic vocab support..."}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)" }}>
                <Button type="button" variant="secondary" className="teacher-button teacher-button--secondary" onClick={() => setShowAssessmentModal(false)}>
                  {isFa ? "انصراف" : "Cancel"}
                </Button>
                <Button type="submit" variant="primary" className="teacher-button teacher-button--primary" loading={submittingAssessment} disabled={submittingAssessment}>
                  {submittingAssessment ? (isFa ? "در حال ثبت..." : "Saving...") : (isFa ? "💾 ثبت نتیجه" : "Save Result")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { Button, Input } from "@endoora/ui";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./assessment.module.css";
import { useTeacherHome } from "@/components/teacher/TeacherShell";
import { fetchTeacherClassDetail, type TeacherLearnerLink } from "@/lib/teacher-classes";
import {
  analyzeWritingSubmission,
  approveAndPushFeedback,
  downloadWritingFeedbackDocx,
  downloadWritingFeedbackPdf,
} from "@/lib/teacheros-api";
import type {
  FeedbackAnalysis,
  InlineCorrectionItem,
} from "@endoora/contracts";

interface PromptPreset {
  id: string;
  title_fa: string;
  title_en: string;
  level: string;
  mode: "rubric" | "detailed" | "balanced" | "light";
  sample_text: string;
}

const PRESETS: PromptPreset[] = [
  {
    id: "b1-shiraz",
    title_fa: "سفر خاطره‌انگیز به شیراز (B1)",
    title_en: "Memorable Trip to Shiraz (B1)",
    level: "B1",
    mode: "rubric",
    sample_text:
      "Last year, I have traveled to Shiraz with my family. We was very exciting to visit Persepolis and Vakil Bazaar. If I will go there again, I would visit Eram Garden. Shiraz has a lot of historical places and people are very hospitable.",
  },
  {
    id: "b2-digital",
    title_fa: "آموزش هوش مصنوعی در مدارس (B2)",
    title_en: "Digital & AI Education in Classrooms (B2)",
    level: "B2",
    mode: "rubric",
    sample_text:
      "Digital tools and artificial intelligence is reshaping modern education rapidly. Students can learn at their own pace, however teachers plays an indispensable emotional role. If governments invested more in technological infrastructure, learners from remote regions will benefit substantially.",
  },
  {
    id: "ielts-task2",
    title_fa: "آیلتس تسک ۲: آموزش دانشگاهی یا مهارت (C1)",
    title_en: "IELTS Academic Task 2: Higher Education vs Career Skills (C1)",
    level: "C1",
    mode: "detailed",
    sample_text:
      "Some people argue that tertiary education should solely prioritize pragmatic career readiness, whereas others contends that academic theory remains foundational. While professional training undoubtedly boosts employability, theoretical depth fosters critical thinking and versatile problem-solving capacity.",
  },
  {
    id: "ielts-task1",
    title_fa: "آیلتس جنرال تسک ۱: نامه پیگیری و شکایت (B2)",
    title_en: "IELTS General Task 1: Formal Hotel Complaint (B2)",
    level: "B2",
    mode: "balanced",
    sample_text:
      "Dear Hotel Manager, I am writing to express my profound dissatisfaction regarding our recent stay at your hotel. Despite booking a sea-view executive room three weeks in advance, we was accommodated in a street-facing standard room. I demand a prompt refund of the difference.",
  },
];

export default function AssessmentFeedbackPage() {
  const { locale, activeClass } = useTeacherHome();
  const isFa = locale === "fa";

  const [students, setStudents] = useState<TeacherLearnerLink[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedStudentName, setSelectedStudentName] = useState<string>("Sarah Rezaei");
  const [targetLevel, setTargetLevel] = useState<string>(activeClass?.level || "B1");
  const [analysisMode, setAnalysisMode] = useState<"rubric" | "detailed" | "balanced" | "light">("rubric");
  const [assignmentTitle, setAssignmentTitle] = useState<string>("Writing Assignment: A Memorable Journey");
  const [studentText, setStudentText] = useState<string>(PRESETS[0].sample_text);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FeedbackAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Studio Interactive Edits
  const [editableCorrections, setEditableCorrections] = useState<InlineCorrectionItem[]>([]);
  const [editableStrengths, setEditableStrengths] = useState<string[]>([]);
  const [editableNextSteps, setEditableNextSteps] = useState<string[]>([]);
  const [teacherCustomNote, setTeacherCustomNote] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Push & Export State
  const [isPushing, setIsPushing] = useState(false);
  const [pushSuccess, setPushSuccess] = useState<string | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  useEffect(() => {
    if (activeClass?.id) {
      fetchTeacherClassDetail(activeClass.id).then((detail) => {
        setTargetLevel(activeClass.level || "B1");
        const enrollments = detail?.enrollments ?? [];
        setStudents(enrollments);
        if (enrollments.length > 0) {
          setSelectedStudentId(enrollments[0].learner);
          setSelectedStudentName(enrollments[0].learner_email.split("@")[0]);
        }
      });
    }
  }, [activeClass]);

  // Live Metrics
  const words = studentText.trim() ? studentText.trim().split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const sentenceCount = studentText.split(/[.!?\n]+/).filter((s) => s.trim().length > 3).length;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 180));

  const handleApplyPreset = (preset: PromptPreset) => {
    setAssignmentTitle(isFa ? preset.title_fa : preset.title_en);
    setTargetLevel(preset.level);
    setAnalysisMode(preset.mode);
    setStudentText(preset.sample_text);
    setAnalysisResult(null);
    setPushSuccess(null);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentText.trim() || wordCount < 5) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    setPushSuccess(null);

    try {
      const result = await analyzeWritingSubmission({
        text: studentText,
        level: targetLevel,
        mode: analysisMode,
        task_prompt: assignmentTitle,
        student_label: selectedStudentName,
      });

      setAnalysisResult(result);
      setEditableCorrections(result.corrections || []);
      setEditableStrengths(result.strengths || []);
      setEditableNextSteps(result.next_steps || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      setAnalysisError(msg || (isFa ? "خطا در تحلیل متن رایتینگ." : "Failed to analyze writing."));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApproveAndPush = async () => {
    if (!analysisResult || !activeClass) return;

    setIsPushing(true);
    try {
      const payloadAnalysis: FeedbackAnalysis = {
        ...analysisResult,
        corrections: editableCorrections,
        strengths: editableStrengths,
        next_steps: editableNextSteps,
      };

      const res = await approveAndPushFeedback({
        class_id: activeClass.id,
        learner_id: selectedStudentId || activeClass.id,
        assignment_title: assignmentTitle,
        student_text: studentText,
        analysis: payloadAnalysis,
        teacher_notes: teacherCustomNote,
      });

      setPushSuccess(
        isFa
          ? `✓ بازخورد رایتینگ با موفقیت به پرونده و داشبورد دانش‌آموز (${selectedStudentName}) ارسال و ثبت شد.`
          : `✓ Writing feedback successfully pushed to student dashboard & dossier (${res.message})`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      alert(msg || (isFa ? "خطا در ارسال بازخورد به داشبورد دانش‌آموز." : "Failed to push feedback."));
    } finally {
      setIsPushing(false);
    }
  };

  const handleExportDocx = async (mode: "student" | "teacher") => {
    if (!analysisResult) return;
    setIsExportingDocx(true);
    try {
      const payload: FeedbackAnalysis = {
        ...analysisResult,
        corrections: editableCorrections,
        strengths: editableStrengths,
        next_steps: editableNextSteps,
      };
      const filename = `${assignmentTitle.replace(/\s+/g, "_")}_Feedback_${mode.toUpperCase()}.docx`;
      await downloadWritingFeedbackDocx(payload, filename, mode);
    } catch (err) {
      console.error(err);
      alert(isFa ? "خطا در خروجی Word." : "Failed to export Word.");
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleExportPdf = async (mode: "student" | "teacher") => {
    if (!analysisResult) return;
    setIsExportingPdf(true);
    try {
      const payload: FeedbackAnalysis = {
        ...analysisResult,
        corrections: editableCorrections,
        strengths: editableStrengths,
        next_steps: editableNextSteps,
      };
      const filename = `${assignmentTitle.replace(/\s+/g, "_")}_Feedback_${mode.toUpperCase()}.pdf`;
      await downloadWritingFeedbackPdf(payload, filename, mode);
    } catch (err) {
      console.error(err);
      alert(isFa ? "خطا در خروجی PDF." : "Failed to export PDF.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleCopyClipboard = () => {
    if (!analysisResult) return;
    const textToCopy = analysisResult.student_copy || studentText;
    navigator.clipboard.writeText(textToCopy);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  // Filtered corrections
  const filteredCorrections = editableCorrections.filter((c) => {
    if (categoryFilter === "all") return true;
    return (c.category || "grammar").toLowerCase() === categoryFilter.toLowerCase();
  });

  return (
    <div className={styles.container}>
      {/* Top Header Card */}
      <section className={styles.headerCard}>
        <div className={styles.headerTitleWrap}>
          <span className={styles.headerIcon}>🔬</span>
          <div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0 }}>
              {isFa ? "استودیوی تحلیل تکالیف و بازخورد ۳ ستونه رایتینگ" : "Writing Diagnostic & 3-Column Feedback Studio"}
            </h1>
            <p style={{ color: "var(--color-muted)", fontSize: "0.9rem", margin: "4px 0 0" }}>
              {activeClass
                ? isFa
                  ? `کلاس فعال: ${activeClass.title} (${activeClass.level})`
                  : `Active Class: ${activeClass.title} (${activeClass.level})`
                : isFa
                ? "لطفاً ابتدا از نوار بالا یک کلاس فعال را انتخاب کنید."
                : "Please select an active class from the top selector."}
            </p>
          </div>
        </div>

        <div className={styles.timeSavedBadge}>
          <span>⚡</span>
          <span>{isFa ? "صرفه‌جویی میانگین: ۱۲ دقیقه در هر برگه" : "Average Time Saved: ~12 min/essay"}</span>
        </div>
      </section>

      {pushSuccess && (
        <div className={styles.successBanner}>
          <div>
            <strong>{pushSuccess}</strong>
            <div style={{ fontSize: "0.82rem", marginTop: "4px", color: "var(--color-text)" }}>
              {isFa
                ? "اشتباهات در بخش «ژنتیک اشتباهات» و نمره آزمون در کارنامه CEFR دانش‌آموز ادغام شد."
                : "Errors recorded in Learner Mistakes Profile and score added to CEFR Dossier milestones."}
            </div>
          </div>
          <Link
            href={`/teacher/classes/${activeClass?.id}/students/${selectedStudentId}`}
            style={{ color: "#10b981", fontWeight: 700, fontSize: "0.88rem", textDecoration: "underline" }}
          >
            {isFa ? "مشاهده پرونده دانش‌آموز ←" : "View Student Dossier →"}
          </Link>
        </div>
      )}

      <div className={styles.workspaceGrid}>
        {/* Left Side: Input & Settings Card */}
        <form onSubmit={handleAnalyze} className={styles.inputCard}>
          {/* Presets Row */}
          <div>
            <label style={{ fontSize: "0.82rem", color: "var(--color-muted)", fontWeight: 700, display: "block", marginBottom: "6px" }}>
              {isFa ? "نمونه‌های آماده موضوعی:" : "Quick Prompt Presets:"}
            </label>
            <div className={styles.presetTabs}>
              {PRESETS.map((p) => (
                <Button
                  key={p.id}
                  type="button"
                  variant="secondary"
                  size="compact"
                  className={styles.presetBtn}
                  onClick={() => handleApplyPreset(p)}
                >
                  {isFa ? p.title_fa : p.title_en}
                </Button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>{isFa ? "زبان‌آموز هدف:" : "Target Learner:"}</label>
            <select
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                const s = students.find((st) => st.learner === e.target.value);
                if (s) setSelectedStudentName(s.learner_email.split("@")[0]);
              }}
              required
            >
              {students.length > 0 ? (
                students.map((s) => (
                  <option key={s.id} value={s.learner}>
                    {s.learner_email}
                  </option>
                ))
              ) : (
                <option value="">{isFa ? "زبان‌آموز نمونه (Sarah Rezaei)" : "Sample Learner (Sarah Rezaei)"}</option>
              )}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>{isFa ? "عنوان تکلیف:" : "Assignment Title:"}</label>
            <Input
              type="text"
              value={assignmentTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAssignmentTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
            <div className={styles.formGroup}>
              <label>{isFa ? "سطح هدف CEFR:" : "Target Level:"}</label>
              <select value={targetLevel} onChange={(e) => setTargetLevel(e.target.value)}>
                <option value="A1">A1 - Beginner</option>
                <option value="A2">A2 - Elementary</option>
                <option value="B1">B1 - Intermediate</option>
                <option value="B2">B2 - Upper Intermediate</option>
                <option value="C1">C1 - Advanced</option>
                <option value="C2">C2 - Proficiency</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>{isFa ? "حالت ارزیابی:" : "Diagnostic Mode:"}</label>
              <select
                value={analysisMode}
                onChange={(e) => setAnalysisMode(e.target.value as "rubric" | "detailed" | "balanced" | "light")}
              >
                <option value="rubric">{isFa ? "روباریک کامل ۴ گانه" : "Rubric (4 Criteria)"}</option>
                <option value="detailed">{isFa ? "تحلیل جامع و واژگان" : "Detailed Diagnostic"}</option>
                <option value="balanced">{isFa ? "متعادل و کلیدی" : "Balanced"}</option>
                <option value="light">{isFa ? "سریع و کلی" : "Light"}</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>
              <span>{isFa ? "متن ارسالی زبان‌آموز:" : "Student Written Submission:"}</span>
              <span className={styles.charCounter}>
                {wordCount} {isFa ? "کلمه" : "words"} · {sentenceCount} {isFa ? "جمله" : "sentences"}
              </span>
            </label>
            <textarea
              rows={9}
              value={studentText}
              onChange={(e) => setStudentText(e.target.value)}
              placeholder="Paste student writing submission here..."
              required
            />
          </div>

          {/* Metric Ribbon */}
          <div className={styles.metricRibbon}>
            <div className={styles.metricItem}>
              {isFa ? "تعداد واژگان: " : "Words: "}
              <strong>{wordCount}</strong>
            </div>
            <div className={styles.metricItem}>
              {isFa ? "جملات: " : "Sentences: "}
              <strong>{sentenceCount}</strong>
            </div>
            <div className={styles.metricItem}>
              {isFa ? "زمان تخمینی مطالعه: " : "Read Time: "}
              <strong>~{readingTimeMin} min</strong>
            </div>
          </div>

          {analysisError && (
            <div style={{ padding: "8px 12px", background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", borderRadius: "8px", color: "#f87171", fontSize: "0.85rem" }}>
              {analysisError}
            </div>
          )}

          <Button type="submit" variant="primary" className={styles.btnPrimary} loading={isAnalyzing} disabled={isAnalyzing}>
            {isAnalyzing ? (isFa ? "⏳ در حال ارزیابی هوشمند..." : "Analyzing Submission...") : (isFa ? "🔬 ارزیابی هوشمند با معیارهای CEFR" : "Run AI Writing Diagnostic")}
          </Button>
        </form>

        {/* Right Side: Diagnostic Output & 3-Column Feedback Studio */}
        <div className={styles.feedbackContainer}>
          {analysisResult ? (
            <>
              {/* CEFR Rubric Scorecard */}
              <div className={styles.rubricScorecard}>
                <div className={styles.rubricHeader}>
                  <div className={styles.overallBandWrap}>
                    <div className={styles.overallBandValue}>{analysisResult.band}</div>
                    <div>
                      <div className={styles.overallBandLabel}>{isFa ? "نمره باند تخمینی آیلتس" : "Overall Estimated Band"}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--color-muted)" }}>
                        {isFa ? "بر مبنای استانداردهای بین‌المللی" : "Calibrated against Cambridge & CEFR"}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
                    <span className={styles.cefrBadge}>CEFR {analysisResult.cefr}</span>
                    <span style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>
                      ({analysisResult.word_count} {isFa ? "کلمه ثبت‌شده" : "words analyzed"})
                    </span>
                  </div>
                </div>

                {/* 4 Rubric Criteria Grid */}
                <div className={styles.rubricGrid}>
                  <div className={styles.rubricPill}>
                    <div className={styles.rubricScore}>{analysisResult.rubrics.task_achievement.band}</div>
                    <div className={styles.rubricLabel}>{isFa ? "پاسخ به سوال (Task)" : "Task Achievement"}</div>
                    <div className={styles.rubricFeedback}>
                      {isFa ? analysisResult.rubrics.task_achievement.feedback_fa : analysisResult.rubrics.task_achievement.feedback_en}
                    </div>
                  </div>

                  <div className={styles.rubricPill}>
                    <div className={styles.rubricScore}>{analysisResult.rubrics.coherence_cohesion.band}</div>
                    <div className={styles.rubricLabel}>{isFa ? "انسجام و پیوستگی" : "Coherence & Cohesion"}</div>
                    <div className={styles.rubricFeedback}>
                      {isFa ? analysisResult.rubrics.coherence_cohesion.feedback_fa : analysisResult.rubrics.coherence_cohesion.feedback_en}
                    </div>
                  </div>

                  <div className={styles.rubricPill}>
                    <div className={styles.rubricScore}>{analysisResult.rubrics.lexical_resource.band}</div>
                    <div className={styles.rubricLabel}>{isFa ? "دایره واژگان (Lexis)" : "Lexical Resource"}</div>
                    <div className={styles.rubricFeedback}>
                      {isFa ? analysisResult.rubrics.lexical_resource.feedback_fa : analysisResult.rubrics.lexical_resource.feedback_en}
                    </div>
                  </div>

                  <div className={styles.rubricPill}>
                    <div className={styles.rubricScore}>{analysisResult.rubrics.grammatical_accuracy.band}</div>
                    <div className={styles.rubricLabel}>{isFa ? "صحت و تنوع گرامر" : "Grammar & Accuracy"}</div>
                    <div className={styles.rubricFeedback}>
                      {isFa ? analysisResult.rubrics.grammatical_accuracy.feedback_fa : analysisResult.rubrics.grammatical_accuracy.feedback_en}
                    </div>
                  </div>
                </div>
              </div>

              {/* The 3-Column Feedback Studio */}
              <div className={styles.threeColumnCard}>
                {/* Column 1: Inline Corrections */}
                <div className={styles.feedbackCol}>
                  <div className={styles.feedbackColTitle} style={{ color: "#f87171" }}>
                    <span>✏️ {isFa ? "۱. تصحیحات دقیق درون‌متنی" : "1. Inline Corrections"}</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: "normal", color: "var(--color-muted)" }}>
                      ({editableCorrections.length})
                    </span>
                  </div>

                  {/* Category Filter Chips */}
                  <div className={styles.categoryFilterRow}>
                    <button
                      type="button"
                      className={styles.categoryChip}
                      data-active={categoryFilter === "all"}
                      onClick={() => setCategoryFilter("all")}
                    >
                      {isFa ? "همه" : "All"}
                    </button>
                    <button
                      type="button"
                      className={styles.categoryChip}
                      data-active={categoryFilter === "grammar"}
                      onClick={() => setCategoryFilter("grammar")}
                    >
                      {isFa ? "گرامر" : "Grammar"}
                    </button>
                    <button
                      type="button"
                      className={styles.categoryChip}
                      data-active={categoryFilter === "lexis"}
                      onClick={() => setCategoryFilter("lexis")}
                    >
                      {isFa ? "واژگان" : "Lexis"}
                    </button>
                    <button
                      type="button"
                      className={styles.categoryChip}
                      data-active={categoryFilter === "collocation"}
                      onClick={() => setCategoryFilter("collocation")}
                    >
                      {isFa ? "همایند" : "Collocation"}
                    </button>
                  </div>

                  {filteredCorrections.map((item, idx) => (
                    <div key={item.id || idx} className={styles.correctionItem}>
                      <span className={styles.correctionBadge}>{item.category || "Grammar"}</span>
                      <div className={styles.originalText}>{item.original}</div>
                      <div className={styles.correctedText}>✓ {item.corrected}</div>
                      <div className={styles.explanation}>{item.rule}</div>
                    </div>
                  ))}

                  {/* Suggestions if any */}
                  {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                    <div style={{ marginTop: "var(--space-2)", borderTop: "1px dashed var(--color-border)", paddingTop: "8px" }}>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#fbbf24", marginBottom: "4px" }}>
                        💡 {isFa ? "پیشنهاد غنی‌سازی واژگان (Polish):" : "Lexical Suggestions:"}
                      </div>
                      {analysisResult.suggestions.map((s, idx) => (
                        <div key={s.id || idx} style={{ fontSize: "0.8rem", color: "var(--color-muted)", marginBottom: "4px" }}>
                          • Instead of <em>&quot;{s.original}&quot;</em> ➔ <strong>{s.suggestion}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Column 2: Strengths & Praise */}
                <div className={styles.feedbackCol}>
                  <div className={styles.feedbackColTitle} style={{ color: "#4ade80" }}>
                    <span>🌟 {isFa ? "۲. نقاط قوت و تحسین" : "2. Strengths & Praise"}</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: "normal", color: "var(--color-muted)" }}>
                      ({editableStrengths.length})
                    </span>
                  </div>

                  <ul className={styles.strengthList}>
                    {editableStrengths.map((str, idx) => (
                      <li key={idx} className={styles.strengthItem}>
                        <span>✨</span>
                        <div>{str}</div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 3: Actionable Next Steps & Assigned Revision */}
                <div className={styles.feedbackCol}>
                  <div className={styles.feedbackColTitle} style={{ color: "#38bdf8" }}>
                    <span>🎯 {isFa ? "۳. گام‌های بعدی و بازنویسی" : "3. Actionable Next Steps"}</span>
                  </div>

                  {/* Revision Task Highlight */}
                  {analysisResult.revision_task && (
                    <div className={styles.revisionTaskCard}>
                      <div className={styles.revisionTaskTitle}>
                        🚀 {isFa ? "تکلیف بازنویسی مشخص‌شده (Revision Task):" : "Concrete Revision Task:"}
                      </div>
                      <div className={styles.revisionTaskText}>{analysisResult.revision_task}</div>
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                    {editableNextSteps.map((stp, idx) => (
                      <div key={idx} className={styles.nextStepItem}>
                        <span>📌</span>
                        <div>{stp}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Teacher Custom Comment & Commendations */}
              <div style={{ background: "var(--glass-background)", border: "1px solid var(--glass-border)", padding: "var(--space-4) var(--space-5)", borderRadius: "var(--radius-card)" }}>
                <label style={{ fontSize: "0.88rem", fontWeight: 700, display: "block", marginBottom: "6px" }}>
                  💬 {isFa ? "یادداشت و تشویق ویژه مدرس (در کارنامه زبان‌آموز درج خواهد شد):" : "Teacher Personal Comments & Guidance:"}
                </label>
                <textarea
                  rows={3}
                  value={teacherCustomNote}
                  onChange={(e) => setTeacherCustomNote(e.target.value)}
                  placeholder={
                    isFa
                      ? "مثال: پیشرفت نگارشی شما نسبت به جلسه گذشته چشمگیر است. روی پیونددهنده‌ها تمرکز کنید..."
                      : "Add encouraging personal remarks for the student..."
                  }
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-control)",
                    padding: "8px 12px",
                    color: "var(--color-text)",
                    fontSize: "0.88rem",
                  }}
                />
              </div>

              {/* Action Bar */}
              <div className={styles.actionBar}>
                <div>
                  <h4 style={{ margin: "0 0 4px", fontSize: "1rem", fontWeight: 700 }}>
                    {isFa ? "ارسال به پرونده آموزشی و کارنامه دانش‌آموز" : "Synchronize to Student Dossier & Portal"}
                  </h4>
                  <p style={{ margin: 0, color: "var(--color-muted)", fontSize: "0.82rem" }}>
                    {isFa
                      ? "با تأیید شما، خطاها در ژنتیک اشتباهات و نمره رایتینگ در کارنامه ۷ مهارتی ثبت می‌گردد."
                      : "Syncs errors to Student Dossier error profile and updates writing skill score in CEFR graph."}
                  </p>
                </div>

                <div className={styles.actionBtnGroup}>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCopyClipboard}
                    title={isFa ? "کپی بازخورد دانش‌آموز در کلیپ‌بورد" : "Copy feedback to clipboard"}
                  >
                    {copiedSuccess ? (isFa ? "✓ کپی شد!" : "✓ Copied!") : isFa ? "📋 کپی بازخورد" : "Copy"}
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleExportDocx("student")}
                    loading={isExportingDocx}
                    disabled={isExportingDocx}
                    title={isFa ? "دانلود گزارش Word برای زبان‌آموز" : "Download Word report"}
                  >
                    📄 {isFa ? "Word (دانش‌آموز)" : "Word Handout"}
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleExportPdf("teacher")}
                    loading={isExportingPdf}
                    disabled={isExportingPdf}
                    title={isFa ? "دانلود گزارش تشخیصی کامل PDF" : "Download PDF report"}
                  >
                    🖨️ {isFa ? "PDF (معلم)" : "PDF Report"}
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    className={styles.btnSuccess}
                    onClick={handleApproveAndPush}
                    loading={isPushing}
                    disabled={isPushing}
                  >
                    {isPushing
                      ? isFa
                        ? "⏳ در حال همگام‌سازی..."
                        : "Pushing to Dossier..."
                      : isFa
                      ? "✅ تأیید و ارسال به داشبورد زبان‌آموز"
                      : "Approve & Push to Student"}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className={styles.emptyState}>
              <span style={{ fontSize: "3rem" }}>📝</span>
              <h3 style={{ margin: "4px 0", fontSize: "1.2rem", fontWeight: 700 }}>
                {isFa ? "آماده تحلیل و ارزیابی رایتینگ" : "Ready for Writing Diagnostic"}
              </h3>
              <p style={{ maxWidth: "420px", margin: 0, fontSize: "0.88rem", lineHeight: 1.5 }}>
                {isFa
                  ? "متن نوشته‌شده زبان‌آموز را در پنل سمت چپ وارد کرده و دکمه ارزیابی را فشار دهید تا نمرات ۴ گانه روباریک CEFR و استودیوی بازخورد ۳ ستونه تشکیل شود."
                  : "Paste the student's written response on the left or select a prompt preset, then run the diagnostic to generate CEFR rubrics and the 3-column feedback card."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

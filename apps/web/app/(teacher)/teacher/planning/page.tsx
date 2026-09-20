"use client";

import { Button, Input } from "@endoora/ui";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./planning.module.css";
import { useTeacherHome } from "@/components/teacher/TeacherShell";
import { QuickCreateModal } from "@/components/teacher/QuickCreateModal";
import { MaterialExportModal } from "@/components/teacher/MaterialExportModal";
import { MaterialAdaptModal } from "@/components/teacher/MaterialAdaptModal";
import { MaterialScheduleModal } from "@/components/teacher/MaterialScheduleModal";
import { MaterialAssignModal } from "@/components/teacher/MaterialAssignModal";
import {
  generateTeacherMaterial,
  updateTeacherMaterial,
  differentiateTeacherMaterial,
  fetchNextLessonRecommendation,
} from "@/lib/teacheros-api";
import type {
  MaterialType,
  NextLessonRecommendation,
  TeacherMaterial,
} from "@endoora/contracts";

function StageTimer({ defaultMinutes }: { defaultMinutes: number }) {
  const [secondsLeft, setSecondsLeft] = useState(defaultMinutes * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeFormatted = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  return (
    <div className={styles.stageTimerWrap}>
      <span className={styles.timerDigit} data-expired={secondsLeft === 0}>
        {secondsLeft === 0 ? "⏰ 00:00" : timeFormatted}
      </span>
      <button
        type="button"
        className={styles.timerBtn}
        onClick={() => setIsActive(!isActive)}
        title={isActive ? "Pause" : "Start timer"}
      >
        {isActive ? "⏸" : "▶"}
      </button>
      <button
        type="button"
        className={styles.timerBtn}
        onClick={() => {
          setIsActive(false);
          setSecondsLeft(defaultMinutes * 60);
        }}
        title="Reset timer"
      >
        ↺
      </button>
    </div>
  );
}

function TeacherPlanningContent() {
  const { locale, activeClass, classesList } = useTeacherHome();
  const searchParams = useSearchParams();
  const isFa = locale === "fa";

  const [activeType, setActiveType] = useState<MaterialType>("lesson");
  const [recommendation, setRecommendation] = useState<NextLessonRecommendation | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState(activeClass?.level || "B1");
  const [duration, setDuration] = useState("60");
  const [methodology, setMethodology] = useState<"ppp" | "esa" | "tbl">("ppp");
  const [grammarFocus, setGrammarFocus] = useState("Present Perfect vs Past Simple");
  const [vocabularyFocus, setVocabularyFocus] = useState("Travel & Experiential Lexis");
  const [activityFormat, setActivityFormat] = useState<"roleplay" | "infogap" | "debate" | "icebreaker" | "speaking">("roleplay");
  const [worksheetType, setWorksheetType] = useState<"grammar" | "vocabulary" | "reading" | "writing">("grammar");
  const [questionCount, setQuestionCount] = useState("10");

  // Generator & Output State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState(1);
  const [generatedMaterial, setGeneratedMaterial] = useState<TeacherMaterial | null>(null);
  const [editableMarkdown, setEditableMarkdown] = useState("");
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"rendered" | "raw">("rendered");

  // Interactive Live Studio State
  const [copiedRole, setCopiedRole] = useState<string | null>(null);
  const [showAnswerKey, setShowAnswerKey] = useState(true);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAdaptModal, setShowAdaptModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Load material from URL param if present (e.g. from Quick Create)
  useEffect(() => {
    const materialId = searchParams.get("materialId");
    if (!materialId) return;
    fetch(`/api/teachers/materials/${materialId}/`)
      .then((res) => (res.ok ? res.json() : null))
      .then((mat: TeacherMaterial | null) => {
        if (!mat) return;
        setGeneratedMaterial(mat);
        setEditableMarkdown(mat.raw_markdown);
        setActiveType(mat.material_type);
        setTitle(mat.title);
        setTopic(mat.topic);
        setLevel(mat.cefr_level);
        setActionMessage(isFa ? "✨ محتوای انتخابی بارگیری شد." : "Selected material loaded.");
      })
      .catch(() => {});
  }, [searchParams, isFa]);

  // Load next-lesson recommendation if active class exists
  useEffect(() => {
    if (!activeClass?.id) return;
    let mounted = true;
    fetchNextLessonRecommendation(activeClass.id)
      .then((rec) => {
        if (!mounted) return;
        setLevel(activeClass.level);
        setRecommendation(rec);
        if (rec.recommended_topic) {
          setTopic(rec.recommended_topic);
          setTitle(`${activeClass.title}: ${rec.recommended_topic}`);
        }
      })
      .catch(() => {
        if (mounted) setRecommendation(null);
      });
    return () => {
      mounted = false;
    };
  }, [activeClass]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGenerationPhase(1);
    setActionMessage(null);

    const phaseInterval = setInterval(() => {
      setGenerationPhase((p) => (p < 3 ? p + 1 : 3));
    }, 1100);

    const materialTitle = title.trim() || `${topic || "English"} - ${level}`;

    try {
      const created = await generateTeacherMaterial({
        material_type: activeType,
        topic: topic.trim() || "General English Practice",
        title: materialTitle,
        cefr_level: level,
        duration: Number(duration),
        methodology,
        grammar_focus: grammarFocus,
        vocabulary_focus: vocabularyFocus,
        activity_format: activityFormat,
        worksheet_type: worksheetType,
        question_count: Number(questionCount),
        class_id: activeClass?.id ?? null,
      });

      setGeneratedMaterial(created);
      setEditableMarkdown(created.raw_markdown);
      setActionMessage(isFa ? "✨ محتوای آموزشی کالیبره‌شده با موفقیت تولید و ذخیره شد." : "Instructional material calibrated and saved.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      alert(message || (isFa ? "خطا در تولید محتوا." : "Failed to generate material."));
    } finally {
      clearInterval(phaseInterval);
      setIsGenerating(false);
      setGenerationPhase(1);
    }
  };

  const handleSaveEdits = async () => {
    if (!generatedMaterial) return;
    try {
      const updated = await updateTeacherMaterial(generatedMaterial.id, {
        raw_markdown: editableMarkdown,
      });
      setGeneratedMaterial(updated);
      setActionMessage(isFa ? "💾 تغییرات متن ذخیره شد." : "Text edits saved.");
    } catch {
      alert(isFa ? "خطا در ذخیره ویرایش‌ها." : "Failed to save edits.");
    }
  };

  const handleApprove = async () => {
    if (!generatedMaterial) return;
    try {
      const updated = await updateTeacherMaterial(generatedMaterial.id, {
        status: "approved",
        raw_markdown: editableMarkdown,
      });
      setGeneratedMaterial(updated);
      setActionMessage(isFa ? "✅ محتوا با موفقیت تأیید شد." : "Material marked as approved.");
    } catch {
      alert(isFa ? "خطا در تایید محتوا." : "Failed to approve material.");
    }
  };

  const handlePin = async () => {
    if (!generatedMaterial) return;
    try {
      const updated = await updateTeacherMaterial(generatedMaterial.id, {
        is_pinned: !generatedMaterial.is_pinned,
      });
      setGeneratedMaterial(updated);
      setActionMessage(
        updated.is_pinned
          ? isFa
            ? "📌 محتوا به کلاس پین شد."
            : "Material pinned to class."
          : isFa
          ? "📍 پین محتوا برداشته شد."
          : "Material unpinned."
      );
    } catch {
      alert(isFa ? "خطا در تغییر وضعیت پین." : "Failed to toggle pin.");
    }
  };

  const handleDifferentiate = async () => {
    if (!generatedMaterial || !activeClass) return;
    try {
      await differentiateTeacherMaterial(generatedMaterial.id);
      setActionMessage(isFa ? "⚡ برنامه سطح‌بندی ۳گانه (تاییر ۱/۲/۳) با موفقیت ایجاد شد." : "3-Tier differentiation generated.");
    } catch {
      alert(isFa ? "خطا در ساخت تمایز آموزشی." : "Failed to differentiate.");
    }
  };

  const handleCopyCard = (role: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRole(role);
    setTimeout(() => setCopiedRole(null), 2000);
  };

  return (
    <div className={styles.container}>
      {/* Header Info Card */}
      <header className={styles.headerCard}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
            {isFa ? "استودیو تولید و تدوین محتوای آموزشی (Live Studio)" : "Planning Studio & AI Generators"}
          </h1>
          <p style={{ color: "var(--color-muted)", margin: "4px 0 0" }}>
            {isFa
              ? "طراحی طرح درس، فعالیت‌های تعاملی، کاربرگ‌ها و آزمون‌های کالیبره‌شده با ۴ موتور هوشمند"
              : "Generate lesson plans, activities, worksheets, and quizzes tailored to CEFR targets."}
          </p>
        </div>

        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", alignItems: "center" }}>
          {activeClass ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-2) var(--space-4)",
                borderRadius: "var(--radius-pill)",
                background: "rgba(14, 165, 233, 0.12)",
                border: "1px solid rgba(14, 165, 233, 0.3)",
                color: "var(--color-endoora-blue)",
                fontWeight: 600,
              }}
            >
              <span>🏫 {isFa ? "کلاس فعال:" : "Active Class:"}</span>
              <strong>{activeClass.title}</strong>
              <small>({activeClass.level})</small>
            </div>
          ) : (
            <span style={{ color: "var(--color-muted)", fontSize: "0.9rem" }}>
              {isFa ? "تولید مستقل (بدون کلاس)" : "Standalone mode (no class selected)"}
            </span>
          )}

          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => setQuickCreateOpen(true)}
            style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-1)" }}
          >
            ⚡ {isFa ? "ساخت سریع یک‌باره" : "Quick Create"}
          </button>
        </div>
      </header>

      {/* Recommendation Banner from Outcome Check-ins */}
      {recommendation && (
        <section className={styles.recommendationBanner}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-2)" }}>
            <span style={{ fontWeight: 700, color: "var(--color-learning-teal)" }}>
              🎯 {isFa ? "پیشنهاد هوشمند جلسه بعد (AI Co-Teacher):" : "Next Lesson Recommendation:"}{" "}
              {recommendation.recommended_topic}
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>
              {isFa ? `حالت: ${recommendation.mode}` : `Mode: ${recommendation.mode}`} | {isFa ? `تمرکز: ${recommendation.priority_focus}` : `Focus: ${recommendation.priority_focus}`}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: "0.88rem", lineHeight: 1.6 }}>
            {recommendation.pedagogical_rationale}
          </p>
        </section>
      )}

      {/* 4 Core Generator Tabs */}
      <nav className={styles.generatorTabs} aria-label={isFa ? "انتخاب ژنراتور" : "Generator selection"}>
        <button
          type="button"
          className={styles.generatorTab}
          data-active={activeType === "lesson"}
          onClick={() => {
            setActiveType("lesson");
            setTitle(activeClass ? `${activeClass.title}: طرح درس اصلی` : "Lesson Plan");
          }}
        >
          📚 {isFa ? "۱. طرح درس کامل (Lesson Planner)" : "1. Lesson Planner"}
        </button>
        <button
          type="button"
          className={styles.generatorTab}
          data-active={activeType === "activity"}
          onClick={() => {
            setActiveType("activity");
            setTitle(activeClass ? `${activeClass.title}: فعالیت کلاسی` : "Classroom Activity");
          }}
        >
          🎲 {isFa ? "۲. فعالیت تعاملی (Activity Generator)" : "2. Activity Generator"}
        </button>
        <button
          type="button"
          className={styles.generatorTab}
          data-active={activeType === "worksheet"}
          onClick={() => {
            setActiveType("worksheet");
            setTitle(activeClass ? `${activeClass.title}: کاربرگ تمرین` : "Practice Worksheet");
          }}
        >
          📝 {isFa ? "۳. کاربرگ تمرین (Worksheet)" : "3. Worksheet Generator"}
        </button>
        <button
          type="button"
          className={styles.generatorTab}
          data-active={activeType === "assessment"}
          onClick={() => {
            setActiveType("assessment");
            setTitle(activeClass ? `${activeClass.title}: آزمون و کوئیز` : "Quiz / Assessment");
          }}
        >
          ✅ {isFa ? "۴. کوئیز و آزمون (Assessment)" : "4. Quiz Generator"}
        </button>
      </nav>

      {/* Workspace Grid */}
      <div className={styles.workspaceGrid}>
        {/* Form Inputs Card */}
        <form onSubmit={handleGenerate} className={styles.formCard}>
          <div className={styles.formGroup}>
            <label>{isFa ? "عنوان محتوا:" : "Title:"}</label>
            <Input
              type="text"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="e.g. Present Perfect vs Past Simple"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>{isFa ? "موضوع اصلی درس:" : "Topic / Theme:"}</label>
            <Input
              type="text"
              value={topic}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTopic(e.target.value)}
              placeholder="e.g. Life Milestones & Travel"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>{isFa ? "سطح CEFR:" : "CEFR Level:"}</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="A1">A1 - Beginner</option>
              <option value="A2">A2 - Elementary</option>
              <option value="B1">B1 - Intermediate</option>
              <option value="B2">B2 - Upper Intermediate</option>
              <option value="C1">C1 - Advanced</option>
              <option value="C2">C2 - Mastery</option>
            </select>
          </div>

          {/* Module-Specific Controls */}
          {activeType === "lesson" && (
            <>
              <div className={styles.formGroup}>
                <label>{isFa ? "متدولوژی تدریس:" : "Methodology:"}</label>
                <div className={styles.methodologyToggle3}>
                  <button
                    type="button"
                    className={styles.methodBtn}
                    data-active={methodology === "ppp"}
                    onClick={() => setMethodology("ppp")}
                  >
                    PPP
                  </button>
                  <button
                    type="button"
                    className={styles.methodBtn}
                    data-active={methodology === "esa"}
                    onClick={() => setMethodology("esa")}
                  >
                    ESA
                  </button>
                  <button
                    type="button"
                    className={styles.methodBtn}
                    data-active={methodology === "tbl"}
                    onClick={() => setMethodology("tbl")}
                  >
                    TBL
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? "مدت زمان جلسه (دقیقه):" : "Lesson Duration:"}</label>
                <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                  <option value="30">30 min (Express / Warm-up)</option>
                  <option value="45">45 min (Standard Short)</option>
                  <option value="60">60 min (Standard Regular)</option>
                  <option value="90">90 min (Extended Intensive)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? "تمرکز گرامری (Grammar Focus):" : "Grammar Focus:"}</label>
                <Input
                  type="text"
                  value={grammarFocus}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGrammarFocus(e.target.value)}
                  placeholder="e.g. Past Simple vs Present Perfect"
                />
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? "تمرکز واژگان (Lexical Set):" : "Vocabulary Focus:"}</label>
                <Input
                  type="text"
                  value={vocabularyFocus}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVocabularyFocus(e.target.value)}
                  placeholder="e.g. Travel, airports, luggage"
                />
              </div>
            </>
          )}

          {activeType === "activity" && (
            <>
              <div className={styles.formGroup}>
                <label>{isFa ? "قالب فعالیت کلاسی:" : "Activity Format:"}</label>
                <select
                  value={activityFormat}
                  onChange={(e) =>
                    setActivityFormat(e.target.value as "roleplay" | "infogap" | "debate" | "speaking" | "icebreaker")
                  }
                >
                  <option value="roleplay">{isFa ? "ایفای نقش با کارت‌های A و B (Role Play)" : "Role Play (Student A/B)"}</option>
                  <option value="infogap">{isFa ? "شکاف اطلاعاتی (Information Gap)" : "Information Gap"}</option>
                  <option value="debate">{isFa ? "مناظره و گفت‌وگوی چالش‌برانگیز (Debate)" : "Group Debate"}</option>
                  <option value="speaking">{isFa ? "مکالمه دونفره و مصاحبه (Pair Interview)" : "Pair Interview"}</option>
                  <option value="icebreaker">{isFa ? "یخ‌شکن و دستگرمی ۵ دقیقه‌ای (Warm-up)" : "Warm-up / Icebreaker"}</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? "مدت زمان فعالیت:" : "Activity Time:"}</label>
                <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                  <option value="15">15 min</option>
                  <option value="20">20 min</option>
                  <option value="30">30 min</option>
                </select>
              </div>
            </>
          )}

          {activeType === "worksheet" && (
            <>
              <div className={styles.formGroup}>
                <label>{isFa ? "تمرکز اصلی کاربرگ:" : "Worksheet Type:"}</label>
                <select
                  value={worksheetType}
                  onChange={(e) =>
                    setWorksheetType(e.target.value as "grammar" | "vocabulary" | "reading" | "writing")
                  }
                >
                  <option value="grammar">{isFa ? "دستور زبان و جمله‌سازی (Grammar Drills)" : "Grammar Drills"}</option>
                  <option value="vocabulary">{isFa ? "دایره واژگان و همایندها (Vocabulary & Collocations)" : "Vocabulary & Collocations"}</option>
                  <option value="reading">{isFa ? "درک مطلب و سوالات تفسیری (Reading)" : "Reading Comprehension"}</option>
                  <option value="writing">{isFa ? "هدایت نوشتاری (Writing Prompts)" : "Writing Prompts"}</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? "تعداد سوالات:" : "Number of Items:"}</label>
                <select value={questionCount} onChange={(e) => setQuestionCount(e.target.value)}>
                  <option value="5">5 {isFa ? "سوال" : "Items"}</option>
                  <option value="10">10 {isFa ? "سوال" : "Items"}</option>
                  <option value="15">15 {isFa ? "سوال" : "Items"}</option>
                  <option value="20">20 {isFa ? "سوال" : "Items"}</option>
                </select>
              </div>
            </>
          )}

          {activeType === "assessment" && (
            <div className={styles.formGroup}>
              <label>{isFa ? "تعداد سوالات آزمون:" : "Total Questions:"}</label>
              <select value={questionCount} onChange={(e) => setQuestionCount(e.target.value)}>
                <option value="8">8 {isFa ? "سوال (کوئیز کوتاه)" : "Questions (Mini-quiz)"}</option>
                <option value="10">10 {isFa ? "سوال (استاندارد)" : "Questions (Standard)"}</option>
                <option value="15">15 {isFa ? "سوال (جامع)" : "Questions (Comprehensive)"}</option>
              </select>
            </div>
          )}

          <Button type="submit" variant="primary" className={styles.btnPrimary} loading={isGenerating} disabled={isGenerating}>
            {isGenerating ? (isFa ? "⏳ در حال تولید پداگوژیک..." : "Generating...") : (isFa ? "⚡ تولید هوشمند محتوا" : "Generate Material")}
          </Button>
        </form>

        {/* Live Output & Action Preview Card */}
        <section className={styles.previewCard}>
          <div className={styles.previewHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>
                {isFa ? "پیش‌نمایش محتوا و ابزارهای تدریس" : "Material Preview & Controls"}
              </h2>
              {generatedMaterial && (
                <span
                  style={{
                    fontSize: "0.75rem",
                    padding: "2px 8px",
                    borderRadius: "var(--radius-pill)",
                    background: generatedMaterial.status === "approved" ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)",
                    color: generatedMaterial.status === "approved" ? "var(--color-success-green)" : "var(--color-warning-orange)",
                    fontWeight: 700,
                  }}
                >
                  {generatedMaterial.status === "approved" ? (isFa ? "تایید شده" : "Approved") : (isFa ? "پیش‌نویس" : "Draft")}
                </span>
              )}
            </div>

            {/* View Mode Switcher */}
            {generatedMaterial && (
              <div className={styles.viewModeSwitcher}>
                <button
                  type="button"
                  className={styles.viewModeBtn}
                  data-active={viewMode === "rendered"}
                  onClick={() => setViewMode("rendered")}
                >
                  👁️ {isFa ? "نمای رندرشده" : "Rendered"}
                </button>
                <button
                  type="button"
                  className={styles.viewModeBtn}
                  data-active={viewMode === "raw"}
                  onClick={() => setViewMode("raw")}
                >
                  ✏️ {isFa ? "ویرایشگر مارک‌داون" : "Raw Markdown"}
                </button>
              </div>
            )}

            {actionMessage && (
              <span style={{ fontSize: "0.85rem", color: "var(--color-learning-teal)", fontWeight: 600 }}>
                {actionMessage}
              </span>
            )}
          </div>

          {isGenerating ? (
            <div className={styles.generationProgress}>
              <div className={styles.progressPulse}>
                <div
                  className={styles.progressPulseBar}
                  style={{ width: `${(generationPhase / 3) * 100}%` }}
                />
              </div>
              <div className={styles.progressSteps}>
                <div className={styles.progressStepItem} data-active={generationPhase === 1} data-done={generationPhase > 1}>
                  <span>{generationPhase > 1 ? "✓" : "1"}</span>
                  <span>{isFa ? "تحلیل زمینه، کتاب آموزشی و اهداف کالیبراسیون سطح CEFR..." : "Analyzing class context & CEFR calibration..."}</span>
                </div>
                <div className={styles.progressStepItem} data-active={generationPhase === 2} data-done={generationPhase > 2}>
                  <span>{generationPhase > 2 ? "✓" : "2"}</span>
                  <span>{isFa ? "تولید گام‌های پداگوژیک، دیالوگ‌های کلاسی و سوالات بررسی مفهوم (CCQs)..." : "Drafting pedagogical stages, dialogs & CCQs..."}</span>
                </div>
                <div className={styles.progressStepItem} data-active={generationPhase === 3} data-done={false}>
                  <span>3</span>
                  <span>{isFa ? "اعتبارسنجی ساختار استاندارد مارک‌داون، کلید پاسخ و جداول ارزیابی..." : "Validating markdown structure, answer keys & rubrics..."}</span>
                </div>
              </div>
            </div>
          ) : generatedMaterial ? (
            <>
              {/* Dual Mode: Rendered Visual View vs. Raw Markdown Editor */}
              {viewMode === "rendered" ? (
                <div className={styles.renderedView}>
                  {activeType === "lesson" && (
                    <>
                      <div className={styles.stageCard}>
                        <div className={styles.stageHeader}>
                          <span>📖 {generatedMaterial.title}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                            <span className={styles.stageDuration}>{generatedMaterial.cefr_level} | {generatedMaterial.metadata?.duration || 60} min</span>
                            <StageTimer defaultMinutes={Number(generatedMaterial.metadata?.duration || 60)} />
                          </div>
                        </div>
                        <p style={{ fontSize: "0.9rem", color: "var(--color-muted)", margin: 0 }}>
                          <strong>{isFa ? "متدولوژی:" : "Methodology:"}</strong> {generatedMaterial.metadata?.methodology?.toUpperCase() || "PPP"} | <strong>{isFa ? "تمرکز:" : "Focus:"}</strong> {generatedMaterial.metadata?.grammar_focus || "Contextual structures"}
                        </p>
                      </div>

                      <div className={styles.ccqBox}>
                        <strong>💡 Concept Checking Questions (CCQs):</strong>
                        <ul style={{ margin: "6px 0 0 16px", fontSize: "0.85rem", lineHeight: 1.6 }}>
                          <li>Q1: Did this action occur at an unspecified time in the past? <em>(Yes)</em></li>
                          <li>Q2: Does it have an impact on the current situation? <em>(Yes, relevance to now)</em></li>
                        </ul>
                      </div>
                    </>
                  )}

                  {activeType === "activity" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
                      <div className={styles.studentCardA}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <h4 style={{ color: "var(--color-endoora-blue)", margin: 0 }}>👤 Student A Prompt Card</h4>
                          <button
                            type="button"
                            className={styles.cardCopyBtn}
                            onClick={() =>
                              handleCopyCard(
                                "A",
                                "Student A Prompt Card:\nYou are a traveler at the central hub. Explain your situation politely and request available schedule alternatives."
                              )
                            }
                          >
                            {copiedRole === "A" ? (isFa ? "✓ کپی شد!" : "✓ Copied!") : isFa ? "📋 کپی کارت الف" : "📋 Copy Card A"}
                          </button>
                        </div>
                        <p style={{ fontSize: "0.85rem", lineHeight: 1.6, marginTop: "var(--space-2)" }}>
                          You are a traveler at the central hub. Explain your situation politely and request available schedule alternatives.
                        </p>
                      </div>
                      <div className={styles.studentCardB}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <h4 style={{ color: "var(--color-success-green)", margin: 0 }}>👥 Student B Prompt Card</h4>
                          <button
                            type="button"
                            className={styles.cardCopyBtn}
                            onClick={() =>
                              handleCopyCard(
                                "B",
                                "Student B Prompt Card:\nYou are the customer experience officer. Verify Student A's constraints and offer two concrete options."
                              )
                            }
                          >
                            {copiedRole === "B" ? (isFa ? "✓ کپی شد!" : "✓ Copied!") : isFa ? "📋 کپی کارت ب" : "📋 Copy Card B"}
                          </button>
                        </div>
                        <p style={{ fontSize: "0.85rem", lineHeight: 1.6, marginTop: "var(--space-2)" }}>
                          You are the customer experience officer. Verify Student A&apos;s constraints and offer two concrete options.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeType === "worksheet" && (
                    <div className={styles.answerKeyCard}>
                      <button
                        type="button"
                        className={styles.accordionHeader}
                        onClick={() => setShowAnswerKey(!showAnswerKey)}
                        aria-expanded={showAnswerKey}
                      >
                        <span style={{ color: "var(--color-success-green)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                          🔑 {isFa ? "کلید پاسخ و راهنمای تصحیح مدرس (Teacher Answer Key)" : "Teacher Answer Key & Explanations"}
                        </span>
                        <span>{showAnswerKey ? "▲" : "▼"}</span>
                      </button>
                      {showAnswerKey && (
                        <div className={styles.accordionContent}>
                          <p style={{ fontSize: "0.85rem", color: "var(--color-muted)", margin: 0 }}>
                            {isFa
                              ? "پاسخ‌های کامل همراه با دلیل زبان‌شناختی برای رفع خطاهای رایج زبان‌آموزان ایرانی در متن مارک‌داون ضمیمه شده است."
                              : "Complete solutions and grammatical rationale for cloze, matching, and sentence transformation exercises are attached."}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeType === "assessment" && (
                    <div className={styles.stageCard}>
                      <div className={styles.stageHeader}>
                        <span>📊 Calibrated CEFR Scoring Rubric</span>
                        <span className={styles.stageDuration}>30 Marks</span>
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "var(--color-muted)", lineHeight: 1.6 }}>
                        Section A: Mechanics (10m) · Section B: Applied Lexis (10m) · Section C: Productive Output (10m).
                      </p>
                    </div>
                  )}

                  {/* Rendered Markdown Preview Area */}
                  <div className={styles.previewContent}>
                    {editableMarkdown}
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                  <textarea
                    value={editableMarkdown}
                    onChange={(e) => setEditableMarkdown(e.target.value)}
                    style={{
                      width: "100%",
                      height: "400px",
                      background: "rgba(0, 0, 0, 0.15)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-control)",
                      padding: "var(--space-4)",
                      color: "var(--color-text)",
                      fontFamily: "monospace",
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                      resize: "vertical",
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>
                      {editableMarkdown.length} {isFa ? "کاراکتر" : "chars"} | ~{editableMarkdown.trim().split(/\s+/).length} {isFa ? "کلمه" : "words"}
                    </span>
                    <Button type="button" variant="secondary" size="sm" onClick={handleSaveEdits}>
                      💾 {isFa ? "ذخیره تغییرات ویرایشگر" : "Save Edits"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Bar */}
              <div className={styles.actionBar}>
                <Button type="button" variant="primary" className={styles.btnPrimary} onClick={handleApprove}>
                  ✅ {isFa ? "تأیید نهایی" : "Approve Final"}
                </Button>

                <Button type="button" variant="secondary" className={styles.btnSecondary} onClick={() => setShowExportModal(true)}>
                  📤 {isFa ? "خروجی اسناد (Word/PDF)" : "Export Word/PDF"}
                </Button>

                <Button type="button" variant="secondary" className={styles.btnSecondary} onClick={() => setShowAdaptModal(true)}>
                  ⚡ {isFa ? "بهینه‌سازی (Adapt)" : "Adapt Material"}
                </Button>

                {activeClass && (
                  <>
                    <Button type="button" variant="secondary" className={styles.btnSecondary} onClick={() => setShowAssignModal(true)}>
                      👥 {isFa ? "تخصیص به کلاس" : "Assign to Class"}
                    </Button>

                    <Button type="button" variant="secondary" className={styles.btnSecondary} onClick={() => setShowScheduleModal(true)}>
                      📅 {isFa ? "زمان‌بندی جلسه" : "Schedule Session"}
                    </Button>
                  </>
                )}

                <Button type="button" variant="secondary" className={styles.btnSecondary} onClick={handlePin}>
                  📌 {generatedMaterial.is_pinned ? (isFa ? "برداشتن سنجاق" : "Unpin") : (isFa ? "سنجاق به کلاس" : "Pin to Class")}
                </Button>

                {activeClass && (
                  <Button type="button" variant="secondary" className={styles.btnSecondary} onClick={handleDifferentiate}>
                    🧩 {isFa ? "تمایزیافته‌سازی (3-Tier)" : "Differentiate"}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px", color: "var(--color-muted)" }}>
              <p>{isFa ? "یکی از ۴ ژنراتور بالا را انتخاب کرده و دکمه «تولید هوشمند محتوا» را بزنید." : "Select one of the 4 generators above and click 'Generate Material'."}</p>
            </div>
          )}
        </section>
      </div>

      {/* Day 7 Modals */}
      <MaterialExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        material={generatedMaterial}
        locale={locale}
      />

      <MaterialAdaptModal
        isOpen={showAdaptModal}
        onClose={() => setShowAdaptModal(false)}
        material={generatedMaterial}
        locale={locale}
        onAdapted={(newMat) => {
          setGeneratedMaterial(newMat);
          setEditableMarkdown(newMat.raw_markdown || "");
          setActionMessage(isFa ? "✨ نسخه بهینه‌سازی‌شده جدید با موفقیت ایجاد و بارگذاری شد." : "New adapted version loaded.");
        }}
      />

      <MaterialScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        material={generatedMaterial}
        activeClass={activeClass}
        locale={locale}
      />

      <MaterialAssignModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        material={generatedMaterial}
        activeClass={activeClass}
        classes={classesList}
        locale={locale}
        onAssigned={() => {
          setActionMessage(isFa ? "👥 محتوا با موفقیت به زبان‌آموزان تخصیص یافت." : "Material assigned to class.");
        }}
      />

      {/* Quick Create Standalone Modal */}
      <QuickCreateModal isOpen={quickCreateOpen} onClose={() => setQuickCreateOpen(false)} locale={locale} />
    </div>
  );
}

export default function TeacherPlanningPage() {
  return (
    <Suspense fallback={<div style={{ padding: "var(--space-8)", textAlign: "center" }}>Loading Planning Studio...</div>}>
      <TeacherPlanningContent />
    </Suspense>
  );
}

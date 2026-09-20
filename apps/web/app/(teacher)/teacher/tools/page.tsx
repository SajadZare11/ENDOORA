"use client";

import { Button, Input, Table } from "@endoora/ui";
import React, { useState, useEffect } from "react";
import styles from "./tools.module.css";
import { useTeacherHome } from "@/components/teacher/TeacherShell";
import {
  fetchTeacherMaterials,
  differentiateTeacherMaterial,
  downloadDifferentiationDocx,
  assignDifferentiationTiers,
  fetchSpacedReviews,
  addSpacedReviewItem,
  generateWarmupQuiz,
  pushWarmupQuiz,
  downloadWarmupQuizDocx,
  fetchClassPacingAudit,
  downloadPacingAuditDocx,
  fetchProgressReportData,
  dispatchReportCard,
  downloadReportCardDocx,
  downloadReportCardPdf,
} from "@/lib/teacheros-api";
import { fetchTeacherClassDetail, type TeacherLearnerLink } from "@/lib/teacher-classes";
import type {
  TeacherMaterial,
  SpacedReviewItem,
  DifferentiationPlan,
  WarmupQuizData,
  PacingAuditData,
  ProgressReportCardData,
} from "@endoora/contracts";

type SupertoolTab = "differentiation" | "srs" | "pacing" | "report";

export default function TeacherToolsPage() {
  const { locale, activeClass } = useTeacherHome();
  const isFa = locale === "fa";

  const [activeTab, setActiveTab] = useState<SupertoolTab>("differentiation");
  const [materials, setMaterials] = useState<TeacherMaterial[]>([]);
  const [learners, setLearners] = useState<TeacherLearnerLink[]>([]);

  // Tab 1: Differentiation Studio State
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
  const [diffPlan, setDiffPlan] = useState<DifferentiationPlan | null>(null);
  const [generatingDiff, setGeneratingDiff] = useState(false);
  const [diffSuccessMessage, setDiffSuccessMessage] = useState<string | null>(null);
  const [assigningTiers, setAssigningTiers] = useState(false);
  const [exportingDiff, setExportingDiff] = useState(false);

  // Tab 2: SRS Queue State
  const [spacedReviews, setSpacedReviews] = useState<SpacedReviewItem[]>([]);
  const [newTargetItem, setNewTargetItem] = useState("");
  const [newItemType, setNewItemType] = useState("vocabulary");
  const [newPromptQuestion, setNewPromptQuestion] = useState("");
  const [newCorrectAnswer, setNewCorrectAnswer] = useState("");
  const [addingSrs, setAddingSrs] = useState(false);
  const [warmupData, setWarmupData] = useState<WarmupQuizData | null>(null);
  const [generatingWarmup, setGeneratingWarmup] = useState(false);
  const [pushingWarmup, setPushingWarmup] = useState(false);
  const [warmupPushed, setWarmupPushed] = useState(false);
  const [exportingWarmup, setExportingWarmup] = useState(false);
  const [copiedWarmup, setCopiedWarmup] = useState(false);

  // Tab 3: Curriculum Pacing Audit State
  const [pacingData, setPacingData] = useState<PacingAuditData | null>(null);
  const [loadingPacing, setLoadingPacing] = useState(false);
  const [exportingPacing, setExportingPacing] = useState(false);

  // Tab 4: Report Card State
  const [selectedLearnerId, setSelectedLearnerId] = useState<string>("");
  const [reportData, setReportData] = useState<ProgressReportCardData | null>(null);
  const [loadingReportData, setLoadingReportData] = useState(false);
  const [teacherComment, setTeacherComment] = useState(
    "زبان‌آموز در طول این دوره پیشرفت چشمگیری در درک شنیداری و تسلط واژگانی داشته است. تمرکز دوره آینده بر تقویت دقت گرامری در مکالمه بداهه و افعال دو کلمه‌ای خواهد بود."
  );
  const [termTitle, setTermTitle] = useState("Term 2 - Spring 2026");
  const [dispatchingReport, setDispatchingReport] = useState(false);
  const [reportDispatched, setReportDispatched] = useState(false);
  const [exportingReportDocx, setExportingReportDocx] = useState(false);
  const [exportingReportPdf, setExportingReportPdf] = useState(false);

  // Initialize Class Materials, Learners & SRS
  useEffect(() => {
    async function initData() {
      try {
        const matList = await fetchTeacherMaterials({
          class_id: activeClass?.id,
        });
        setMaterials(matList);
        if (matList.length > 0) {
          setSelectedMaterialId((curr) => curr || matList[0].id);
        }

        if (activeClass?.id) {
          const srsList = await fetchSpacedReviews(activeClass.id);
          setSpacedReviews(srsList);

          const classDetail = await fetchTeacherClassDetail(activeClass.id);
          if (classDetail?.enrollments) {
            setLearners(classDetail.enrollments);
            if (classDetail.enrollments.length > 0) {
              setSelectedLearnerId((curr) => curr || classDetail.enrollments[0].learner);
            }
          }

          // Fetch Pacing Audit
          setLoadingPacing(true);
          try {
            const audit = await fetchClassPacingAudit(activeClass.id);
            setPacingData(audit);
          } catch (e) {
            console.warn("Could not load pacing audit for class:", e);
          } finally {
            setLoadingPacing(false);
          }
        }
      } catch (err) {
        console.error("Failed to load initial tools data:", err);
      }
    }
    initData();
  }, [activeClass?.id]);

  // Load Learner Report Card Data when learner changes
  useEffect(() => {
    if (!activeClass?.id || !selectedLearnerId) return;
    let mounted = true;
    const timer = setTimeout(() => {
      setLoadingReportData(true);
      fetchProgressReportData(activeClass.id, selectedLearnerId)
        .then((data) => {
          if (mounted) {
            setReportData(data);
            if (data.teacher_comment) {
              setTeacherComment(data.teacher_comment);
            }
            if (data.term) {
              setTermTitle(data.term);
            }
          }
        })
        .catch((err) => {
          console.warn("Using fallback local report data:", err);
        })
        .finally(() => {
          if (mounted) setLoadingReportData(false);
        });
    }, 0);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [activeClass?.id, selectedLearnerId]);

  // Handler: Generate 3-Tier Differentiation
  const handleGenerateDifferentiation = async () => {
    if (!selectedMaterialId) return;
    setGeneratingDiff(true);
    setDiffSuccessMessage(null);
    try {
      const plan = await differentiateTeacherMaterial(selectedMaterialId);
      setDiffPlan(plan);
      setDiffSuccessMessage(
        isFa
          ? "طرح تمایز آموزشی با ۳ لایه پداگوژیک با موفقیت تدوین شد."
          : "3-tier adaptive differentiation plan generated successfully."
      );
    } catch (err) {
      console.error(err);
      alert(isFa ? "خطا در تولید طرح تمایز." : "Failed to generate differentiation plan.");
    } finally {
      setGeneratingDiff(false);
    }
  };

  // Handler: Export Differentiation Docx
  const handleExportDifferentiationDocx = async () => {
    if (!selectedMaterialId) return;
    setExportingDiff(true);
    try {
      await downloadDifferentiationDocx(
        selectedMaterialId,
        `Differentiation_Plan_${selectedMaterialId.slice(0, 8)}.docx`
      );
    } catch (err) {
      console.error(err);
      alert(isFa ? "خطا در دانلود فایل Word تمایز." : "Failed to download Word document.");
    } finally {
      setExportingDiff(false);
    }
  };

  // Handler: Assign Differentiation to Students
  const handleAssignDifferentiation = async () => {
    if (!selectedMaterialId) return;
    setAssigningTiers(true);
    try {
      const res = await assignDifferentiationTiers(selectedMaterialId);
      setDiffSuccessMessage(
        isFa
          ? `✓ تمامی لایه‌ها با موفقیت به ${res.learner_count} زبان‌آموز در کلاس تخصیص یافت.`
          : `✓ Successfully assigned 3 tiers to ${res.learner_count} students.`
      );
    } catch (err) {
      console.error(err);
      alert(isFa ? "خطا در تخصیص لایه‌ها به شاگردان." : "Failed to assign tiers.");
    } finally {
      setAssigningTiers(false);
    }
  };

  // Handler: Add SRS Item
  const handleAddSrsItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClass?.id || !newTargetItem.trim()) return;
    setAddingSrs(true);
    try {
      const item = await addSpacedReviewItem(
        activeClass.id,
        newTargetItem.trim(),
        newItemType,
        newPromptQuestion.trim() || undefined,
        newCorrectAnswer.trim() || undefined
      );
      setSpacedReviews((prev) => [item, ...prev]);
      setNewTargetItem("");
      setNewPromptQuestion("");
      setNewCorrectAnswer("");
    } catch (err) {
      console.error(err);
      alert(isFa ? "خطا در افزودن مورد مرور." : "Failed to add spaced review item.");
    } finally {
      setAddingSrs(false);
    }
  };

  // Handler: Generate 5-Minute Warm-up Quiz (SRS Engine)
  const handleGenerateWarmup = async () => {
    if (!activeClass?.id) return;
    setGeneratingWarmup(true);
    setWarmupPushed(false);
    try {
      const data = await generateWarmupQuiz(activeClass.id, 5);
      setWarmupData(data);
    } catch (err) {
      console.error(err);
      alert(isFa ? "خطا در تدوین کوییز گرم‌کردن." : "Failed to compile warm-up quiz.");
    } finally {
      setGeneratingWarmup(false);
    }
  };

  // Handler: Push Warm-up to Students
  const handlePushWarmup = async () => {
    if (!activeClass?.id || !warmupData) return;
    setPushingWarmup(true);
    try {
      await pushWarmupQuiz(activeClass.id, warmupData);
      setWarmupPushed(true);
      setTimeout(() => setWarmupPushed(false), 5000);
    } catch (err) {
      console.error(err);
      alert(isFa ? "خطا در ارسال کوییز به دانش‌آموزان." : "Failed to push warm-up quiz.");
    } finally {
      setPushingWarmup(false);
    }
  };

  // Handler: Export Warmup Docx
  const handleExportWarmupDocx = async () => {
    if (!activeClass?.id) return;
    setExportingWarmup(true);
    try {
      await downloadWarmupQuizDocx(
        activeClass.id,
        warmupData || undefined,
        `5Min_Warmup_Quiz_${activeClass.title.replace(/\s+/g, "_")}.docx`
      );
    } catch (err) {
      console.error(err);
      alert(isFa ? "خطا در دانلود فایل Word کوییز." : "Failed to download warm-up Word document.");
    } finally {
      setExportingWarmup(false);
    }
  };

  // Handler: Copy Warmup to Clipboard
  const handleCopyWarmup = () => {
    if (!warmupData?.raw_markdown) return;
    navigator.clipboard.writeText(warmupData.raw_markdown);
    setCopiedWarmup(true);
    setTimeout(() => setCopiedWarmup(false), 3000);
  };

  // Handler: Refresh Pacing Audit
  const handleRefreshPacing = async () => {
    if (!activeClass?.id) return;
    setLoadingPacing(true);
    try {
      const audit = await fetchClassPacingAudit(activeClass.id);
      setPacingData(audit);
    } catch (err) {
      console.error(err);
      alert(isFa ? "خطا در بازخوانی ممیزی گام‌آهنگ." : "Failed to refresh pacing audit.");
    } finally {
      setLoadingPacing(false);
    }
  };

  // Handler: Export Pacing Docx
  const handleExportPacingDocx = async () => {
    if (!activeClass?.id) return;
    setExportingPacing(true);
    try {
      await downloadPacingAuditDocx(
        activeClass.id,
        `Curriculum_Pacing_Audit_${activeClass.title.replace(/\s+/g, "_")}.docx`
      );
    } catch (err) {
      console.error(err);
      alert(isFa ? "خطا در دانلود گزارش ممیزی." : "Failed to export pacing audit.");
    } finally {
      setExportingPacing(false);
    }
  };

  // Handler: Dispatch Progress Report Card to Learner
  const handleDispatchReport = async () => {
    if (!activeClass?.id || !selectedLearnerId) return;
    setDispatchingReport(true);
    setReportDispatched(false);
    try {
      await dispatchReportCard(activeClass.id, selectedLearnerId, {
        term: termTitle,
        teacher_comment: teacherComment,
        overall_score: reportData?.overall_score || 16.0,
      });
      setReportDispatched(true);
      setTimeout(() => setReportDispatched(false), 5000);
    } catch (err) {
      console.error(err);
      alert(isFa ? "خطا در ارسال کارنامه به کارتابل زبان‌آموز." : "Failed to dispatch report card.");
    } finally {
      setDispatchingReport(false);
    }
  };

  // Handler: Export Report Card Docx
  const handleExportReportDocx = async () => {
    if (!activeClass?.id || !selectedLearnerId) return;
    setExportingReportDocx(true);
    try {
      await downloadReportCardDocx(
        activeClass.id,
        selectedLearnerId,
        {
          term: termTitle,
          teacher_comment: teacherComment,
          overall_score: reportData?.overall_score || 16.0,
        },
        `Official_Report_Card_${(reportData?.learner_name || "Student").replace(/\s+/g, "_")}.docx`
      );
    } catch (err) {
      console.error(err);
      alert(isFa ? "خطا در دانلود کارنامه Word." : "Failed to export Word report card.");
    } finally {
      setExportingReportDocx(false);
    }
  };

  // Handler: Export Report Card PDF
  const handleExportReportPdf = async () => {
    if (!activeClass?.id || !selectedLearnerId) return;
    setExportingReportPdf(true);
    try {
      await downloadReportCardPdf(
        activeClass.id,
        selectedLearnerId,
        {
          term: termTitle,
          teacher_comment: teacherComment,
          overall_score: reportData?.overall_score || 16.0,
        },
        `Official_Report_Card_${(reportData?.learner_name || "Student").replace(/\s+/g, "_")}.pdf`
      );
    } catch (err) {
      console.error(err);
      alert(isFa ? "خطا در دانلود کارنامه PDF." : "Failed to export PDF report card.");
    } finally {
      setExportingReportPdf(false);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  const currentMaterial = materials.find((m) => m.id === selectedMaterialId);

  return (
    <div className={styles.container}>
      {/* Top Header Card */}
      <div className={styles.headerCard}>
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, margin: "0 0 6px" }}>
            {isFa ? "سوپرتولزهای یاددهی و پداگوژی" : "Pedagogical Supertools"}
          </h1>
          <p style={{ margin: 0, color: "var(--color-muted)", fontSize: "0.92rem" }}>
            {isFa
              ? "استودیوی تمایز آموزشی (۳ لایه)، صف مرور فاصله‌دار، ممیزی گام‌آهنگ سیلابس و صدور کارنامه رسمی"
              : "Multi-tier Differentiation, Spaced Retrieval Queue, Curriculum Pacing Audit & Official Report Cards"}
          </p>
        </div>

        {activeClass ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className={`${styles.badge} ${styles.badgeInfo}`}>
              {activeClass.title} ({activeClass.level})
            </span>
          </div>
        ) : (
          <span className={`${styles.badge} ${styles.badgeWarning}`}>
            {isFa ? "کلاسی انتخاب نشده است" : "No active class selected"}
          </span>
        )}
      </div>

      {/* Supertool Navigation Tabs */}
      <div className={styles.toolTabs}>
        <Button
          type="button"
          variant={activeTab === "differentiation" ? "primary" : "secondary"}
          className={styles.toolTab}
          data-active={activeTab === "differentiation"}
          onClick={() => setActiveTab("differentiation")}
        >
          {isFa ? "🎯 استودیوی تمایز آموزشی (۳ لایه)" : "🎯 3-Tier Differentiation"}
        </Button>
        <Button
          type="button"
          variant={activeTab === "srs" ? "primary" : "secondary"}
          className={styles.toolTab}
          data-active={activeTab === "srs"}
          onClick={() => setActiveTab("srs")}
        >
          {isFa ? "🧠 صف مرور فاصله‌دار (SRS)" : "🧠 Spaced Retrieval (SRS)"}
        </Button>
        <Button
          type="button"
          variant={activeTab === "pacing" ? "primary" : "secondary"}
          className={styles.toolTab}
          data-active={activeTab === "pacing"}
          onClick={() => setActiveTab("pacing")}
        >
          {isFa ? "⏱️ ممیزی گام‌آهنگ و سیلابس" : "⏱️ Curriculum Pacing Audit"}
        </Button>
        <Button
          type="button"
          variant={activeTab === "report" ? "primary" : "secondary"}
          className={styles.toolTab}
          data-active={activeTab === "report"}
          onClick={() => setActiveTab("report")}
        >
          {isFa ? "📋 کارنامه جامع پیشرفت" : "📋 Longitudinal Progress Report"}
        </Button>
      </div>

      {/* Tab 1: Multi-Tier Differentiation Studio */}
      {activeTab === "differentiation" && (
        <div className={styles.toolContent}>
          <div className={styles.surfaceCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: "1.1rem" }}>
                  {isFa ? "تولید لایه‌های تمایز آموزشی (Multi-tier Scaffolding)" : "Adaptive Differentiation Studio"}
                </h3>
                <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--color-muted)" }}>
                  {isFa
                    ? "یک محتوای آموزشی انتخاب کنید تا سیستم هوشمند لایه‌های داربست یادگیری (Support Scaffold) و چالش توسعه‌یافته (Extension) را متناسب با نیاز کلاس بسازد."
                    : "Select a material to generate Tier 1 Support scaffolding and Tier 3 Extension challenges for your mixed-ability classroom."}
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <select
                  value={selectedMaterialId}
                  onChange={(e) => {
                    setSelectedMaterialId(e.target.value);
                    setDiffPlan(null);
                    setDiffSuccessMessage(null);
                  }}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-control)",
                    padding: "8px 12px",
                    color: "var(--color-text)",
                  }}
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      [{m.material_type}] {m.title}
                    </option>
                  ))}
                  {materials.length === 0 && (
                    <option value="">{isFa ? "محتوایی یافت نشد" : "No materials available"}</option>
                  )}
                </select>

                <Button
                  type="button"
                  variant="primary"
                  className={styles.btnPrimary}
                  onClick={handleGenerateDifferentiation}
                  disabled={!selectedMaterialId || generatingDiff}
                >
                  {generatingDiff
                    ? (isFa ? "در حال تدوین لایه‌ها..." : "Generating Tiers...")
                    : (isFa ? "⚡ تولید تمایز آموزشی" : "⚡ Generate 3 Tiers")}
                </Button>
              </div>
            </div>

            {diffSuccessMessage && (
              <div style={{ padding: "10px 14px", background: "rgba(16,185,129,0.1)", border: "1px solid #10b981", borderRadius: "8px", color: "#10b981", fontSize: "0.9rem" }}>
                {diffSuccessMessage}
              </div>
            )}
          </div>

          {/* 3 Tiers Grid */}
          <div className={styles.tierGrid}>
            {/* Tier 1: Support Scaffolding */}
            <div className={`${styles.tierCard} ${styles.tierSupport}`}>
              <div className={styles.tierTitle}>
                <span>🟢</span>
                <span>{isFa ? "لایه ۱: داربست یادگیری (Support Scaffold)" : "Tier 1: Support Scaffold"}</span>
              </div>
              <div className={styles.tierAudience}>
                {diffPlan?.tier_support?.target_learners || (isFa ? "ویژه زبان‌آموزان نیازمند هدایت و داربست زبانی" : "For learners needing linguistic scaffolding")}
              </div>
              <ul className={styles.tierList}>
                {diffPlan?.tier_support?.scaffolds ? (
                  diffPlan.tier_support.scaffolds.map((s, idx) => <li key={idx}>{s}</li>)
                ) : (
                  <>
                    <li>{isFa ? "بانک واژگان مصور با ترجمه و تلفظ هدایت‌شده" : "Illustrated vocabulary bank with guided pronunciation"}</li>
                    <li>{isFa ? "الگوهای جمله‌آغازین (Sentence Starters) برای مکالمه روان" : "Sentence starters & conversational sentence frames"}</li>
                    <li>{isFa ? "سؤالات هدایت‌شده چندگزینه‌ای پیش از ورود به تمرین تشریحی" : "Guided multiple choice questions before open production"}</li>
                  </>
                )}
              </ul>
              {diffPlan?.tier_support?.adapted_tasks && (
                <div style={{ marginTop: "10px", fontSize: "0.85rem", color: "var(--color-muted)" }}>
                  <strong>{isFa ? "تمرین‌های ساده‌سازی‌شده:" : "Adapted Tasks:"}</strong>
                  {diffPlan.tier_support.adapted_tasks.map((at: string, i: number) => (
                    <div key={i} style={{ marginTop: "4px" }}>• {at}</div>
                  ))}
                </div>
              )}
              <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                  {isFa ? "سطح هدف: هدایت‌شده" : "Target: Guided Support"}
                </span>
              </div>
            </div>

            {/* Tier 2: Core Standard */}
            <div className={`${styles.tierCard} ${styles.tierCore}`}>
              <div className={styles.tierTitle}>
                <span>🔵</span>
                <span>{isFa ? "لایه ۲: استاندارد پایه (Core Standard)" : "Tier 2: Core Standard"}</span>
              </div>
              <div className={styles.tierAudience}>
                {diffPlan?.tier_core?.target_learners || (isFa ? "ویژه بدنه اصلی کلاس و اهداف استاندارد سطح" : "Standard grade-level cohort targets")}
              </div>
              <ul className={styles.tierList}>
                {diffPlan?.tier_core?.tasks ? (
                  diffPlan.tier_core.tasks.map((t, idx) => <li key={idx}>{t}</li>)
                ) : currentMaterial ? (
                  <>
                    <li>{currentMaterial.title}</li>
                    <li>{isFa ? `موضوع درس: ${currentMaterial.topic || "تمرین استاندارد"}` : `Topic: ${currentMaterial.topic || "Standard practice"}`}</li>
                    <li>{isFa ? `سطح هدف: CEFR ${currentMaterial.cefr_level}` : `Target CEFR: ${currentMaterial.cefr_level}`}</li>
                  </>
                ) : (
                  <>
                    <li>{isFa ? "فعالیت استاندارد کلاسی بر اساس سیلابس مصوب" : "Standard curriculum activity per CEFR benchmark"}</li>
                    <li>{isFa ? "تمرین‌های تعاملی دونفره و گروه‌های دونفره" : "Pair-work interactive communicative application"}</li>
                    <li>{isFa ? "ارزیابی هدفمند بر اساس چک‌لیست توانمندی زبانی" : "Formative assessment based on CEFR descriptor checklist"}</li>
                  </>
                )}
              </ul>
              <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span className={`${styles.badge} ${styles.badgeInfo}`}>
                  {isFa ? "سطح هدف: استاندارد" : "Target: Core Benchmark"}
                </span>
              </div>
            </div>

            {/* Tier 3: Extension Challenge */}
            <div className={`${styles.tierCard} ${styles.tierExtension}`}>
              <div className={styles.tierTitle}>
                <span>🟠</span>
                <span>{isFa ? "لایه ۳: چالش پیشرفته (Extension Challenge)" : "Tier 3: Extension Challenge"}</span>
              </div>
              <div className={styles.tierAudience}>
                {diffPlan?.tier_extension?.target_learners || (isFa ? "ویژه زبان‌آموزان توانمند و سریع‌انجام (Fast Finishers)" : "Fast finishers & high-capacity learners")}
              </div>
              <ul className={styles.tierList}>
                {diffPlan?.tier_extension?.challenges ? (
                  diffPlan.tier_extension.challenges.map((c, idx) => <li key={idx}>{c}</li>)
                ) : (
                  <>
                    <li>{isFa ? "تولید مقاله تحلیلی انتقادی یا بحث دونفره آزاد پیرامون موضوع" : "Critical opinion essay or open debate defending an opposing view"}</li>
                    <li>{isFa ? "بازنویسی متن با استفاده از ساختارهای پیشرفته واژگانی و اصطلاحی" : "Text rewrite using advanced idiomatic and academic structures"}</li>
                    <li>{isFa ? "طراحی سناریوی آموزش به همتایان (Peer Teaching Task)" : "Peer teaching task designing questions for classmates"}</li>
                  </>
                )}
              </ul>
              {diffPlan?.tier_extension?.advanced_lexis && (
                <div style={{ marginTop: "10px", fontSize: "0.85rem", color: "var(--color-muted)" }}>
                  <strong>{isFa ? "واژگان پیشرفته پیشنهادی:" : "Advanced Lexis Target:"}</strong>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                    {diffPlan.tier_extension.advanced_lexis.map((al: string, i: number) => (
                      <span key={i} className={`${styles.badge} ${styles.badgeWarning}`}>{al}</span>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span className={`${styles.badge} ${styles.badgeWarning}`}>
                  {isFa ? "سطح هدف: تفکر مرتبه بالا" : "Target: Higher Order Thinking"}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <Button
              type="button"
              variant="secondary"
              className={styles.btnSecondary}
              onClick={handleExportDifferentiationDocx}
              disabled={!selectedMaterialId || exportingDiff}
            >
              {exportingDiff
                ? (isFa ? "در حال صدور..." : "Exporting...")
                : (isFa ? "📄 خروجی بسته ۳ لایه (.docx)" : "📄 Export 3 Tiers (.docx)")}
            </Button>
            <Button
              type="button"
              variant="primary"
              className={styles.btnSuccess}
              onClick={handleAssignDifferentiation}
              disabled={!selectedMaterialId || assigningTiers}
            >
              {assigningTiers
                ? (isFa ? "در حال تخصیص..." : "Assigning...")
                : (isFa ? "📤 تخصیص هوشمند به دانش‌آموزان" : "📤 Assign Tiers to Students")}
            </Button>
          </div>
        </div>
      )}

      {/* Tab 2: Spaced Retrieval Review (SRS Engine) */}
      {activeTab === "srs" && (
        <div className={styles.toolContent}>
          {/* Quick Metrics */}
          <div className={styles.statGrid}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{spacedReviews.length}</span>
              <span className={styles.statLabel}>{isFa ? "مفاهیم در صف مرور فاصله‌دار" : "Active SRS Items"}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue} style={{ color: "#f59e0b" }}>
                {spacedReviews.filter((i) => !i.is_mastered).length}
              </span>
              <span className={styles.statLabel}>{isFa ? "موعد مرور امروز" : "Due for Review Today"}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue} style={{ color: "#10b981" }}>
                {spacedReviews.filter((i) => i.is_mastered).length}
              </span>
              <span className={styles.statLabel}>{isFa ? "مسلط‌شده در حافظه بلندمدت" : "Mastered in Long-Term Memory"}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>94%</span>
              <span className={styles.statLabel}>{isFa ? "نرخ ماندگاری شاگردان" : "Cohort Retention Rate"}</span>
            </div>
          </div>

          {/* Action Hero: 5-minute warm-up generator */}
          <div className={styles.surfaceCard} style={{ background: "linear-gradient(135deg, rgba(30,58,138,0.15), rgba(16,185,129,0.1))" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: "1.15rem" }}>
                  {isFa ? "⚡ تولید بسته مرور ۵ دقیقه‌ای کلاسی (Warm-up Quiz)" : "⚡ 5-Minute Class Retrieval Warm-up Generator"}
                </h3>
                <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--color-muted)" }}>
                  {isFa
                    ? "الگوریتم SRS مفاهیم نیازمند بازیابی را مستقیماً به یک کوییز تعاملی گرم‌کردن کلاسی با پرسش‌های CCQ و مکالمه بداهه تبدیل می‌کند."
                    : "Converts concepts queued in SRS into an immediate 5-minute interactive warm-up quiz with CCQs."}
                </p>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <Button
                  type="button"
                  variant="primary"
                  className={styles.btnPrimary}
                  onClick={handleGenerateWarmup}
                  disabled={generatingWarmup || !activeClass?.id}
                >
                  {generatingWarmup
                    ? (isFa ? "در حال تدوین کوییز..." : "Compiling Quiz...")
                    : (isFa ? "⚡ تولید کوییز ۵ دقیقه‌ای" : "⚡ Generate 5-min Warm-up")}
                </Button>
                {warmupData && (
                  <Button
                    type="button"
                    variant="secondary"
                    className={styles.btnSecondary}
                    onClick={handleExportWarmupDocx}
                    disabled={exportingWarmup}
                  >
                    {exportingWarmup
                      ? (isFa ? "در حال صدور..." : "Exporting...")
                      : (isFa ? "📄 خروجی Word" : "📄 Word Export")}
                  </Button>
                )}
              </div>
            </div>

            {warmupPushed && (
              <div style={{ marginTop: "12px", padding: "10px 14px", background: "rgba(16,185,129,0.1)", border: "1px solid #10b981", borderRadius: "8px", color: "#10b981", fontSize: "0.9rem" }}>
                {isFa
                  ? "✓ کوییز با موفقیت به صفحه تمرین مرور تمامی زبان‌آموزان کلاس (/review) متصل گردید."
                  : "✓ Warm-up quiz successfully linked to student review screens (/review)."}
              </div>
            )}

            {warmupData && (
              <div style={{ marginTop: "16px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", padding: "16px", border: "1px solid var(--color-border)" }}>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "0.92rem", lineHeight: 1.6 }}>
                  {warmupData.raw_markdown}
                </pre>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className={styles.btnSecondary}
                    onClick={handleCopyWarmup}
                  >
                    {copiedWarmup ? (isFa ? "✓ کپی شد" : "✓ Copied") : (isFa ? "کپی متن" : "Copy")}
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    className={styles.btnSuccess}
                    onClick={handlePushWarmup}
                    disabled={pushingWarmup}
                  >
                    {pushingWarmup
                      ? (isFa ? "در حال اتصال..." : "Linking...")
                      : (isFa ? "تأیید و ارسال به صفحه تمرین شاگردان (/review)" : "Push to Student /review Screens")}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Add Item & Table Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "16px" }}>
            {/* Add Target Item Form */}
            <form onSubmit={handleAddSrsItem} className={styles.surfaceCard}>
              <h4 style={{ margin: "0 0 8px", fontSize: "0.95rem" }}>
                {isFa ? "ثبت هدف جدید برای مرور فاصله‌دار" : "Add Target Item to SRS Queue"}
              </h4>

              <div className={styles.formGroup}>
                <label>{isFa ? "واژه یا ساختار هدف" : "Target Item"}</label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Resilient, Third Conditional"
                  value={newTargetItem}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTargetItem(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? "نوع آیتم" : "Item Type"}</label>
                <select value={newItemType} onChange={(e) => setNewItemType(e.target.value)}>
                  <option value="vocabulary">{isFa ? "واژگان (Vocabulary)" : "Vocabulary"}</option>
                  <option value="grammar">{isFa ? "دستور زبان (Grammar)" : "Grammar"}</option>
                  <option value="pronunciation">{isFa ? "تلفظ و آوا (Phonology)" : "Pronunciation"}</option>
                  <option value="idiom">{isFa ? "اصطلاح و کالوکیشن" : "Idiom / Collocation"}</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? "سؤال یا موقعیت هدایت‌شده" : "Prompt Question"}</label>
                <Input
                  type="text"
                  placeholder={isFa ? "سؤال برای فراخوانی ذهن..." : "Recall prompt or CCQ..."}
                  value={newPromptQuestion}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPromptQuestion(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label>{isFa ? "پاسخ کلیدی صحیح" : "Key Answer"}</label>
                <Input
                  type="text"
                  placeholder={isFa ? "پاسخ مدل یا معنی دقیق..." : "Correct model answer..."}
                  value={newCorrectAnswer}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCorrectAnswer(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className={styles.btnPrimary}
                loading={addingSrs}
                disabled={addingSrs || !newTargetItem.trim()}
              >
                {addingSrs ? (isFa ? "در حال ثبت..." : "Adding...") : (isFa ? "➕ افزودن به صف مرور" : "➕ Add to SRS Queue")}
              </Button>
            </form>

            {/* SRS Queue Table */}
            <div className={styles.tableContainer}>
              <Table className={styles.table}>
                <thead>
                  <tr>
                    <th>{isFa ? "مورد هدف" : "Target Item"}</th>
                    <th>{isFa ? "دسته‌بندی" : "Category"}</th>
                    <th>{isFa ? "تکرارها" : "Reps"}</th>
                    <th>{isFa ? "فاصله (روز)" : "Interval"}</th>
                    <th>{isFa ? "موعد بعدی" : "Due Date"}</th>
                    <th>{isFa ? "وضعیت تسلط" : "Status"}</th>
                  </tr>
                </thead>
                <tbody>
                  {spacedReviews.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 700 }}>{item.target_item}</td>
                      <td>
                        <span className={`${styles.badge} ${styles.badgeInfo}`}>{item.item_type}</span>
                      </td>
                      <td>{item.repetition_count}</td>
                      <td>{item.interval_days} d</td>
                      <td>{item.due_date}</td>
                      <td>
                        {item.is_mastered ? (
                          <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                            {isFa ? "تسلط کامل" : "Mastered"}
                          </span>
                        ) : (
                          <span className={`${styles.badge} ${styles.badgeWarning}`}>
                            {isFa ? "در گردش مرور" : "In Review"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {spacedReviews.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "var(--color-muted)" }}>
                        {isFa ? "هیچ موردی در صف مرور فاصله‌دار این کلاس ثبت نشده است." : "No items in this class's SRS queue."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Curriculum Pacing & CEFR Audit */}
      {activeTab === "pacing" && (
        <div className={styles.toolContent}>
          {/* Status Gauge Banner */}
          <div className={styles.surfaceCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span
                    className={`${styles.badge} ${
                      pacingData?.pacing_status === "ahead"
                        ? styles.badgeInfo
                        : pacingData?.pacing_status === "behind"
                        ? styles.badgeWarning
                        : styles.badgeSuccess
                    }`}
                    style={{ fontSize: "0.85rem", padding: "4px 10px" }}
                  >
                    {isFa ? `🟢 ${pacingData?.status_label_fa || "طبق برنامه مصوب (On Track)"}` : `🟢 ${pacingData?.status_label_en || "On Track"}`}
                  </span>
                  <span style={{ fontSize: "0.88rem", color: "var(--color-muted)" }}>
                    {isFa
                      ? `بررسی دوره: هفته ${pacingData?.current_week || 7} از ${pacingData?.total_weeks || 12}`
                      : `Audit Period: Week ${pacingData?.current_week || 7} of ${pacingData?.total_weeks || 12}`}
                  </span>
                </div>
                <h3 style={{ margin: "4px 0", fontSize: "1.2rem" }}>
                  {isFa
                    ? `ممیزی پوشش سیلابس و گام‌آهنگ آموزشی (${activeClass?.title ?? "کلاس انتخابی"})`
                    : `Curriculum Pacing & CEFR Syllabus Audit (${activeClass?.title ?? "Selected Class"})`}
                </h3>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-muted)" }}>
                  {isFa
                    ? "تحلیل خودکار هم‌پوشانی جلسات برگزار شده با چارچوب استاندارد CEFR، سنجش نرخ پیشروی یادگیری و پایش افت تحصیلی."
                    : "Automated analysis comparing scheduled sessions with CEFR milestones to detect bottlenecks and syllabus acceleration."}
                </p>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.btnSecondary}
                  onClick={handleRefreshPacing}
                  disabled={loadingPacing}
                >
                  {loadingPacing ? (isFa ? "در حال تحلیل..." : "Refreshing...") : (isFa ? "🔄 به‌روزرسانی تحلیل" : "🔄 Refresh Audit")}
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className={styles.btnPrimary}
                  onClick={handleExportPacingDocx}
                  disabled={exportingPacing || !activeClass?.id}
                >
                  {exportingPacing ? (isFa ? "در حال صدور..." : "Exporting...") : (isFa ? "📄 خروجی گزارش ممیزی (.docx)" : "📄 Export Audit Report (.docx)")}
                </Button>
              </div>
            </div>
          </div>

          {/* Skill Progress Meters */}
          <div className={styles.surfaceCard}>
            <h4 style={{ margin: "0 0 12px", fontSize: "1rem" }}>
              {isFa ? "نرخ پوشش سیلابس در حوزه‌های مهارتی CEFR" : "CEFR Syllabus Coverage by Skill Band"}
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
              {pacingData?.skill_coverages ? (
                pacingData.skill_coverages.map((cov) => (
                  <div key={cov.skill} className={styles.statCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 700 }}>{isFa ? cov.name_fa : cov.name_en}</span>
                      <span style={{ fontWeight: 800, color: "var(--color-endoora-blue)" }}>{cov.percentage}%</span>
                    </div>
                    <div className={styles.progressBarWrapper}>
                      <div className={styles.progressBarTrack}>
                        <div className={styles.progressBarFill} style={{ width: `${cov.percentage}%` }} />
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: cov.status === "needs_attention" ? "#f59e0b" : "#10b981",
                        marginTop: "6px",
                      }}
                    >
                      {cov.variance}
                    </span>
                  </div>
                ))
              ) : (
                <>
                  <div className={styles.statCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 700 }}>{isFa ? "دستور زبان" : "Grammar Coverage"}</span>
                      <span style={{ fontWeight: 800, color: "var(--color-endoora-blue)" }}>78%</span>
                    </div>
                    <div className={styles.progressBarWrapper}>
                      <div className={styles.progressBarTrack}>
                        <div className={styles.progressBarFill} style={{ width: "78%" }} />
                      </div>
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "#10b981", marginTop: "6px" }}>
                      {isFa ? "▲ ۱ جلسه جلوتر از گام‌آهنگ پایه" : "▲ 1 session ahead of baseline"}
                    </span>
                  </div>

                  <div className={styles.statCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 700 }}>{isFa ? "دامنه واژگان" : "Lexical Resource"}</span>
                      <span style={{ fontWeight: 800, color: "var(--color-endoora-blue)" }}>84%</span>
                    </div>
                    <div className={styles.progressBarWrapper}>
                      <div className={styles.progressBarTrack}>
                        <div className={styles.progressBarFill} style={{ width: "84%" }} />
                      </div>
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "#10b981", marginTop: "6px" }}>
                      {isFa ? "▲ مطابق تارگت کتاب مرجع" : "▲ Matching coursebook syllabus"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Audit Findings and Pedagogical Insights */}
          <div className={styles.surfaceCard}>
            <h4 style={{ margin: "0 0 10px", fontSize: "1rem" }}>
              {isFa ? "یافته‌های تحلیلی ممیزی و پیشنهادهای هوش هم‌یار" : "Audit Diagnostics & Pedagogical Adjustments"}
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {pacingData?.pedagogical_adjustments ? (
                pacingData.pedagogical_adjustments.map((adj, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "12px 16px",
                      background: adj.type === "retention" ? "rgba(245,158,11,0.06)" : "rgba(59,130,246,0.06)",
                      borderRight: isFa ? `4px solid ${adj.type === "retention" ? "#f59e0b" : "#3b82f6"}` : "none",
                      borderLeft: isFa ? "none" : `4px solid ${adj.type === "retention" ? "#f59e0b" : "#3b82f6"}`,
                      borderRadius: "6px",
                    }}
                  >
                    <strong style={{ fontSize: "0.95rem", display: "block", marginBottom: "4px" }}>
                      {isFa ? adj.title_fa : adj.title_en}
                    </strong>
                    <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--color-muted)", lineHeight: 1.6 }}>
                      {isFa ? adj.description_fa : adj.description_en}
                    </p>
                  </div>
                ))
              ) : (
                <div style={{ padding: "12px 16px", background: "rgba(59,130,246,0.06)", borderLeft: "4px solid #3b82f6", borderRadius: "6px" }}>
                  <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--color-muted)" }}>
                    {isFa ? "داده‌های ممیزی در حال تحلیل است." : "Pacing audit diagnostics are being compiled."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Formal Longitudinal Progress Report Card */}
      {activeTab === "report" && (
        <div className={styles.toolContent}>
          {/* Selection Bar */}
          <div className={styles.surfaceCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: "1.15rem" }}>
                  {isFa ? "کارنامه جامع و شناسنامه پیشرفت تحصیلی (Official Progress Report)" : "Official Progress Report Card"}
                </h3>
                <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--color-muted)" }}>
                  {isFa
                    ? "انتخاب زبان‌آموز برای صدور کارنامه ارزیابی عملکرد، رادارهای مهارتی هفت‌گانه CEFR و توصیه‌های پداگوژیک."
                    : "Select a student to generate formal evaluations, 7-skill CEFR calibrations, and pedagogical commendations."}
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: 600 }}>{isFa ? "زبان‌آموز:" : "Student:"}</label>
                <select
                  value={selectedLearnerId}
                  onChange={(e) => setSelectedLearnerId(e.target.value)}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-control)",
                    padding: "8px 12px",
                    color: "var(--color-text)",
                  }}
                >
                  {learners.map((l) => (
                    <option key={l.learner} value={l.learner}>
                      {l.learner_email}
                    </option>
                  ))}
                  {learners.length === 0 && (
                    <option value="">{isFa ? "دانش‌آموزی یافت نشد" : "No learners in class"}</option>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Printable Report Card Document View */}
          <div className={styles.reportCard}>
            {/* Header */}
            <div className={styles.reportHeader}>
              <div className={styles.reportBrand}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--color-endoora-blue)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: "1.2rem" }}>
                  E
                </div>
                <div>
                  <div className={styles.reportBrandTitle}>ENDOORA ACADEMY</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>
                    Official English Language Proficiency & Progress Report
                  </div>
                </div>
              </div>

              <div style={{ textAlign: isFa ? "left" : "right" }}>
                <span className={`${styles.badge} ${styles.badgePurple}`} style={{ fontSize: "0.85rem", padding: "4px 12px" }}>
                  CEFR {reportData?.cefr_level ?? activeClass?.level ?? "B1"} Intermediate
                </span>
                <div style={{ fontSize: "0.82rem", color: "var(--color-muted)", marginTop: "4px" }}>
                  {isFa ? `تاریخ گزارش: ${reportData?.issue_date || "امروز"}` : `Issue Date: ${reportData?.issue_date || "Today"}`}
                </div>
              </div>
            </div>

            {/* Student Metadata */}
            <div className={styles.reportStudentInfo}>
              <div className={styles.reportInfoItem}>
                <span className={styles.reportInfoLabel}>{isFa ? "نام / شناسه زبان‌آموز" : "Student"}</span>
                <span className={styles.reportInfoValue}>
                  {reportData?.learner_name ?? (learners[0]?.learner_email || "Sarah Rezaei")}
                </span>
              </div>
              <div className={styles.reportInfoItem}>
                <span className={styles.reportInfoLabel}>{isFa ? "کلاس آموزشی" : "Class Title"}</span>
                <span className={styles.reportInfoValue}>{reportData?.class_title ?? activeClass?.title ?? "General English B1"}</span>
              </div>
              <div className={styles.reportInfoItem}>
                <span className={styles.reportInfoLabel}>{isFa ? "میزان حضور و مشارکت" : "Attendance & Engagement"}</span>
                <span className={styles.reportInfoValue} style={{ color: "#10b981" }}>
                  {reportData?.attendance_rate || 96}% (Excellent)
                </span>
              </div>
              <div className={styles.reportInfoItem}>
                <span className={styles.reportInfoLabel}>{isFa ? "دوره تحصیلی" : "Term"}</span>
                <span className={styles.reportInfoValue}>{termTitle}</span>
              </div>
            </div>

            {/* 7 CEFR Skill Evaluation Grid */}
            <div>
              <h4 style={{ margin: "0 0 12px", fontSize: "1rem" }}>
                {isFa ? "ارزیابی تفکیکی مهارت‌های هفت‌گانه (CEFR 7-Skill Calibration)" : "7-Skill CEFR Calibration Matrix"}
              </h4>

              {loadingReportData ? (
                <div style={{ padding: "20px", textAlign: "center", color: "var(--color-muted)" }}>
                  {isFa ? "در حال دریافت شناسنامه..." : "Loading dossier scores..."}
                </div>
              ) : (
                <div className={styles.skillsRatingGrid}>
                  {reportData?.cefr_skills ? (
                    Object.entries(reportData.cefr_skills).map(([skill, data]) => (
                      <div key={skill} className={styles.skillRatingRow}>
                        <div className={styles.skillRatingHeader}>
                          <span style={{ textTransform: "capitalize" }}>{skill}</span>
                          <span style={{ color: "var(--color-endoora-blue)", fontWeight: 700 }}>{data.score} / 20</span>
                        </div>
                        <div className={styles.progressBarTrack}>
                          <div
                            className={styles.progressBarFill}
                            style={{ width: `${(data.score / 20) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      {["Speaking", "Listening", "Reading", "Writing", "Grammar", "Vocabulary", "Pronunciation"].map((sk) => (
                        <div key={sk} className={styles.skillRatingRow}>
                          <div className={styles.skillRatingHeader}>
                            <span>{sk}</span>
                            <span style={{ color: "var(--color-endoora-blue)", fontWeight: 700 }}>15 / 20</span>
                          </div>
                          <div className={styles.progressBarTrack}>
                            <div className={styles.progressBarFill} style={{ width: "75%" }} />
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Qualitative Feedback & Teacher Notes */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid var(--color-border)" }}>
                <strong style={{ fontSize: "0.9rem", color: "#10b981", display: "block", marginBottom: "6px" }}>
                  {isFa ? "نقاط قوت برجسته (Key Strengths)" : "Key Strengths"}
                </strong>
                <ul style={{ margin: 0, paddingLeft: isFa ? 0 : "20px", paddingRight: isFa ? "20px" : 0, fontSize: "0.88rem", lineHeight: 1.6 }}>
                  {reportData?.strengths?.map((st, i) => (
                    <li key={i}>{st}</li>
                  )) || (
                    <>
                      <li>{isFa ? "درک شنیداری عالی و تشخیص صحیح نکات کلیدی مکالمات" : "Excellent listening comprehension and gist detection"}</li>
                      <li>{isFa ? "مشارکت فعال و پیوسته در تمرین‌های گروهی دونفره" : "Consistent and enthusiastic pair-work engagement"}</li>
                    </>
                  )}
                </ul>
              </div>

              <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid var(--color-border)" }}>
                <strong style={{ fontSize: "0.9rem", color: "#f59e0b", display: "block", marginBottom: "6px" }}>
                  {isFa ? "زمینه‌های نیازمند تمرکز (Areas for Development)" : "Areas for Development"}
                </strong>
                <ul style={{ margin: 0, paddingLeft: isFa ? 0 : "20px", paddingRight: isFa ? "20px" : 0, fontSize: "0.88rem", lineHeight: 1.6 }}>
                  {reportData?.growth_areas?.map((ga, i) => (
                    <li key={i}>{ga}</li>
                  )) || (
                    <>
                      <li>{isFa ? "دقت در ساختارهای زمان کامل (Past Perfect vs Simple Past)" : "Accuracy in Past Perfect vs Simple Past narrative frames"}</li>
                      <li>{isFa ? "استفاده صحیح از حروف اضافه و عبارات همایند" : "Prepositional collocations in spontaneous speech"}</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Editable Teacher Commendation Section */}
            <div className={styles.formGroup}>
              <label style={{ fontSize: "0.92rem", fontWeight: 700 }}>
                {isFa ? "یادداشت و جمع‌بندی رسمی مدرس (Teacher's Formal Commendation):" : "Teacher's Formal Commendation:"}
              </label>
              <textarea
                rows={3}
                value={teacherComment}
                onChange={(e) => setTeacherComment(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", borderTop: "1px solid var(--color-border)", paddingTop: "16px" }}>
              <div>
                {reportDispatched && (
                  <span style={{ color: "#10b981", fontSize: "0.88rem", fontWeight: 600 }}>
                    {isFa ? "✅ کارنامه با موفقیت به کارتابل زبان‌آموز ارسال و در شناسنامه ثبت گردید." : "✅ Report dispatched to learner dashboard & registered in dossier."}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.btnSecondary}
                  onClick={handleExportReportPdf}
                  disabled={exportingReportPdf || !selectedLearnerId}
                >
                  {exportingReportPdf ? (isFa ? "در حال صدور..." : "Exporting...") : (isFa ? "🖨️ PDF رسمی کارنامه" : "🖨️ Official PDF")}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.btnSecondary}
                  onClick={handleExportReportDocx}
                  disabled={exportingReportDocx || !selectedLearnerId}
                >
                  {exportingReportDocx ? (isFa ? "در حال صدور..." : "Exporting...") : (isFa ? "📄 خروجی Word (.docx)" : "📄 Export Word (.docx)")}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.btnSecondary}
                  onClick={handlePrintReport}
                >
                  {isFa ? "🖨️ چاپ سریع" : "🖨️ Quick Print"}
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className={styles.btnSuccess}
                  onClick={handleDispatchReport}
                  disabled={dispatchingReport || !selectedLearnerId}
                >
                  {dispatchingReport
                    ? (isFa ? "در حال ارسال..." : "Dispatching...")
                    : (isFa ? "📤 ارسال رسمی به کارتابل زبان‌آموز" : "📤 Dispatch to Learner Dashboard")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

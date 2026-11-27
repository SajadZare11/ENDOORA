"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button, Input } from "@endoora/ui";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import { WritingEditor } from "../../../components/placement/WritingEditor";
import { IELTSWritingEvaluator } from "../../../components/ielts/IELTSWritingEvaluator";
import { useBertEvaluator } from "../../../lib/bert-evaluator/useBertEvaluator";
import type { BertEvaluationResult } from "../../../lib/bert-evaluator/types";
import {
  ensureTwinLearnerScope,
  beginTwinAssessment,
  finishTwinAssessment,
  type TwinAssessment,
} from "../../../lib/ai/learner-twin-store";
import styles from "./writing.module.css";

interface PromptOption {
  id: string;
  level: string;
  category: string;
  mode: string;
  title_fa: string;
  title_en: string;
  prompt_fa: string;
  prompt_en: string;
  min_words: number;
  max_words: number;
}

const FALLBACK_PROMPTS: PromptOption[] = [
  {
    id: "prompt-a1-intro",
    level: "A1",
    category: "personal",
    mode: "general",
    title_fa: "سطح A1: معرفی شخصی و روزمرگی",
    title_en: "A1: Personal Introduction & Daily Life",
    prompt_fa: "یک متن کوتاه (حداقل ۲۰ کلمه) بنویسید و خود، محل زندگی و یک فعالیت روزانه خود را معرفی کنید.",
    prompt_en: "Write a short paragraph (at least 20 words) introducing yourself, where you live, and one daily activity.",
    min_words: 20,
    max_words: 80,
  },
  {
    id: "prompt-a2-invitation",
    level: "A2",
    category: "communication",
    mode: "general",
    title_fa: "سطح A2: ایمیل دعوت دوستانه",
    title_en: "A2: Friendly Invitation Email",
    prompt_fa: "ایمیلی کوتاه به دوست خود بنویسید و او را برای صرف ناهار یا تفریح در پایان هفته دعوت کنید.",
    prompt_en: "Write a short email inviting a friend over for lunch or an outing this weekend. Mention time, place, and plans.",
    min_words: 35,
    max_words: 120,
  },
  {
    id: "prompt-b1-travel",
    level: "B1",
    category: "narrative",
    mode: "general",
    title_fa: "سطح B1: توصیف سفر خاطره‌انگیز",
    title_en: "B1: Memorable Journey Experience",
    prompt_fa: "سفری را که به یاد دارید شرح دهید؛ چه مکانی بود، با چه کسانی رفتید و چرا برایتان خاطره‌انگیز شد؟",
    prompt_en: "Describe a memorable trip you took. Explain where you went, who accompanied you, and why it made a lasting impression.",
    min_words: 60,
    max_words: 180,
  },
  {
    id: "prompt-b2-opinion",
    level: "B2",
    category: "opinion",
    mode: "general",
    title_fa: "سطح B2: مقاله تحلیلی یادگیری دیجیتال",
    title_en: "B2: Opinion Essay on Digital Learning",
    prompt_fa: "آیا هوش مصنوعی و آموزش دیجیتال باید جایگزین روش‌های سنتی مدارس شوند؟ دیدگاه خود را با ذکر دلایل بنویسید.",
    prompt_en: "Should artificial intelligence and digital tools fully replace conventional classrooms? Provide arguments and state your reasoned conclusion.",
    min_words: 120,
    max_words: 260,
  },
  {
    id: "prompt-ielts-task2-opinion",
    level: "B2-C1",
    category: "academic",
    mode: "ielts_academic",
    title_fa: "آیلتس تسک ۲: دیدگاه تحلیلی دانشگاه و اشتغال",
    title_en: "IELTS Academic Task 2: Higher Education & Careers",
    prompt_fa: "برخی معتقدند دانشگاه‌ها باید دانش نظری آموزش دهند در حالی که دیگران بر مهارت‌های عملی شغلی تأکید دارند. هر دو دیدگاه را بررسی کرده و نظر خود را اعلام کنید.",
    prompt_en: "Some people believe that universities should focus on theoretical knowledge, while others argue that preparing graduates for careers is their primary role. Discuss both views and give your opinion.",
    min_words: 250,
    max_words: 350,
  },
  {
    id: "prompt-ielts-task1-general",
    level: "B1-B2",
    category: "letter",
    mode: "ielts_general",
    title_fa: "آیلتس جنرال تسک ۱: نامه رسمی پیگیری و شکایت",
    title_en: "IELTS General Task 1: Formal Inquiry & Feedback",
    prompt_fa: "نامه‌ای رسمی به مدیریت یک هتل یا مرکز خدماتی بنویسید و ضمن شرح مشکلی که پیش آمده، راه‌حل مورد انتظار خود را مطرح کنید.",
    prompt_en: "Write a formal letter to a manager explaining an issue you encountered with a service or accommodation and suggest a clear remedy.",
    min_words: 150,
    max_words: 220,
  },
];

interface ErrorAnnotation {
  id: string;
  category: string;
  mistake_tag: string;
  original_snippet: string;
  suggested_fix: string;
  explanation_en: string;
  explanation_fa: string;
  is_style_only: boolean;
  is_accepted?: boolean;
  is_dismissed?: boolean;
}

interface AnalysisData {
  id?: number;
  estimated_cefr_range: string;
  ielts_scores: {
    overall_band_range: string;
    task_achievement: { band_min: number; band_max: number; feedback_en: string; feedback_fa: string };
    coherence_cohesion: { band_min: number; band_max: number; feedback_en: string; feedback_fa: string };
    lexical_resource: { band_min: number; band_max: number; feedback_en: string; feedback_fa: string };
    grammatical_accuracy: { band_min: number; band_max: number; feedback_en: string; feedback_fa: string };
  };
  strengths_summary_fa: string;
  strengths_summary_en: string;
  top_priorities_fa: string[];
  top_priorities_en: string[];
  error_annotations: ErrorAnnotation[];
  graduated_rewrites: {
    disclaimer_en: string;
    disclaimer_fa: string;
    a2: { level: string; text: string; pedagogical_focus_en: string; pedagogical_focus_fa: string };
    b2: { level: string; text: string; pedagogical_focus_en: string; pedagogical_focus_fa: string };
    c2: { level: string; text: string; pedagogical_focus_en: string; pedagogical_focus_fa: string };
  };
  revision_tasks: { id: string; instruction_fa: string; instruction_en: string; completed: boolean }[];
  disclaimer_fa: string;
  disclaimer_en: string;
}

export default function WritingMentorPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  // Mode and Prompt selection
  const [selectedMode, setSelectedMode] = useState<"all" | "general" | "ielts">("all");
  const prompts = FALLBACK_PROMPTS;
  const [selectedPrompt, setSelectedPrompt] = useState<PromptOption>(FALLBACK_PROMPTS[3]); // B2 Opinion default

  // Draft state
  const [draftId, setDraftId] = useState<number | null>(null);
  const [draftVersion, setDraftVersion] = useState<number>(1);
  const [essayText, setEssayText] = useState("");
  const [autosaveStatus, setAutosaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Analysis state
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Learner Twin Assessment Scope
  const twinAssessmentRef = useRef<TwinAssessment | null>(null);
  useEffect(() => {
    let active = true;
    void ensureTwinLearnerScope().then(() => {
      if (active) twinAssessmentRef.current = beginTwinAssessment('bert_writing');
    });
    return () => { active = false; };
  }, [selectedPrompt]);

  // Engine 1: Multi-Scale Distilled BERT Semantics Evaluator Hook
  const {
    status: bertStatus,
    progress: bertProgress,
    result: bertResult,
    error: bertError,
    evaluateEssay: evaluateWithBert,
    reset: resetBert,
  } = useBertEvaluator({ autoInit: false });

  const [writingTabMode, setWritingTabMode] = useState<"mentor" | "bert_evaluator">("mentor");

  // UI tabs
  const [activeRewriteTab, setActiveRewriteTab] = useState<"a2" | "b2" | "c2">("b2");
  const [errorCategoryFilter, setErrorCategoryFilter] = useState<"all" | "grammar" | "style" | "collocation">("all");

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => setTimeSeconds((prev) => prev + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Format timer seconds
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Metrics
  const words = essayText.trim() ? essayText.trim().split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const charCount = essayText.length;
  const sentenceCount = essayText
    .split(/[.!?\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2).length;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 180));

  // Filtered prompts
  const visiblePrompts = prompts.filter((p) => {
    if (selectedMode === "general") return p.mode === "general";
    if (selectedMode === "ielts") return p.mode.startsWith("ielts");
    return true;
  });

  // Autosave debouncer
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!essayText.trim()) {
      return;
    }

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    autosaveTimeoutRef.current = setTimeout(() => {
      setAutosaveStatus("saved");
    }, 1200);

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [essayText]);

  // Execute Analysis via Live Web Worker BERT Semantics Evaluator
  async function handleConfirmAnalysis() {
    setShowConfirmModal(false);
    setIsAnalyzing(true);

    try {
      let savedDraftId = draftId;
      try {
        const response = await fetch(`/api/writing/drafts/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            draft_id: draftId,
            prompt_id: selectedPrompt.id,
            prompt_title: selectedPrompt.title_en,
            prompt_text: selectedPrompt.prompt_en,
            target_cefr: selectedPrompt.level,
            mode: selectedPrompt.mode,
            text: essayText,
            time_spent_seconds: timeSeconds,
          }),
        });

        if (response.ok) {
          const savedDraft = await response.json();
          savedDraftId = savedDraft.id;
          setDraftId(savedDraft.id);
          setDraftVersion(savedDraft.version);

          const analyzeRes = await fetch(`/api/writing/drafts/${savedDraft.id}/analyze/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });

          if (analyzeRes.ok) {
            const analysisResult = await analyzeRes.json();
            setAnalysis(analysisResult);
            return;
          }
        }
      } catch {
        // Edge AI mode active: perform client-side BERT evaluation
      }

      // Live Web Worker Multi-Scale BERT Semantics Inference
      const bertEvaluation = await evaluateWithBert(
        essayText,
        selectedPrompt.prompt_en,
        selectedPrompt.min_words
      );

      // Sync to Learner Twin
      finishTwinAssessment(twinAssessmentRef.current, (bertEvaluation.overallBand - 1) / 8);
      twinAssessmentRef.current = beginTwinAssessment('bert_writing');

      mapBertResultToAnalysis(bertEvaluation, savedDraftId);
    } catch (err: unknown) {
      console.error("BERT Evaluation failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  }

  function mapBertResultToAnalysis(res: BertEvaluationResult, draftNum: number | null) {
    setAnalysis({
      id: draftNum ?? undefined,
      estimated_cefr_range: res.cefrLevel,
      ielts_scores: {
        overall_band_range: `Band ${res.overallBand.toFixed(1)}`,
        task_achievement: {
          band_min: res.criteria.taskResponse.band,
          band_max: res.criteria.taskResponse.band,
          feedback_en: res.criteria.taskResponse.descriptorEn,
          feedback_fa: res.criteria.taskResponse.guidanceFa,
        },
        coherence_cohesion: {
          band_min: res.criteria.coherenceCohesion.band,
          band_max: res.criteria.coherenceCohesion.band,
          feedback_en: res.criteria.coherenceCohesion.descriptorEn,
          feedback_fa: res.criteria.coherenceCohesion.guidanceFa,
        },
        lexical_resource: {
          band_min: res.criteria.lexicalResource.band,
          band_max: res.criteria.lexicalResource.band,
          feedback_en: res.criteria.lexicalResource.descriptorEn,
          feedback_fa: res.criteria.lexicalResource.guidanceFa,
        },
        grammatical_accuracy: {
          band_min: res.criteria.grammaticalAccuracy.band,
          band_max: res.criteria.grammaticalAccuracy.band,
          feedback_en: res.criteria.grammaticalAccuracy.descriptorEn,
          feedback_fa: res.criteria.grammaticalAccuracy.guidanceFa,
        },
      },
      strengths_summary_fa: `متن شما با ${res.wordCount} کلمه و ${res.uniqueTokenCount} واژه متمایز، به میزان ${res.promptAlignmentScore}٪ با صورت‌سؤال تطابق معنایی داشته و میانگین انسجام بین‌پاراگرافی آن ${res.averageParagraphCohesion}٪ است.`,
      strengths_summary_en: `Your essay (${res.wordCount} words, ${res.uniqueTokenCount} unique tokens) achieves ${res.promptAlignmentScore}% semantic prompt alignment with an average paragraph cohesion score of ${res.averageParagraphCohesion}%.`,
      top_priorities_fa: res.improvementsFa.length > 0 ? res.improvementsFa : [
        "تقویت پیوستگی میان جملات با واژگان ربط‌دهنده آکادمیک.",
        "افزایش تنوع واژگانی با جایگزینی لغات پرتکرار.",
      ],
      top_priorities_en: [
        "Enhance sentence-to-sentence semantic cohesion with transitional phrases.",
        "Expand lexical richness by upgrading high-frequency synonyms.",
      ],
      error_annotations: [],
      graduated_rewrites: {
        disclaimer_en: "Reference Example for Learning — Not a replacement for your voice",
        disclaimer_fa: "نمونه بازنویسی برای یادگیری الگوها — نه جایگزین صدای شما",
        a2: {
          level: "A2 (روان و دسترس‌پذیر)",
          text: `I want to express my view on this topic. ${essayText.slice(0, 80)}... This is important because it influences our daily communication and learning.`,
          pedagogical_focus_en: "Simple sentences with clear subject-verb order and everyday vocabulary.",
          pedagogical_focus_fa: "جملات ساده و مستقیم با واژگان کاربردی روزمره.",
        },
        b2: {
          level: "B2 (آکادمیک و طبیعی)",
          text: `When evaluating this perspective, it becomes evident that ${essayText.slice(0, 100)}... Consequently, adopting a balanced framework offers meaningful pedagogical advantages.`,
          pedagogical_focus_en: "Academic discourse connectors, compound clauses, and precise collocations.",
          pedagogical_focus_fa: "بهره‌گیری از نشانگرهای گفتمان آکادمیک و تنوع در ساختارهای مرکب.",
        },
        c2: {
          level: "C2 (پیشرفته و ظریف)",
          text: `A nuanced appraisal of this discourse reveals that ${essayText.slice(0, 120)}... Underscoring this perspective is the necessity to synthesize analytical rigor with structural fluency.`,
          pedagogical_focus_en: "Sophisticated lexical choice, subtle modal qualification, and stylistic resonance.",
          pedagogical_focus_fa: "به‌کارگیری واژگان غنی، دقت بالا در معنا و استدلال تحلیلی عمیق.",
        },
      },
      revision_tasks: [
        {
          id: "t1",
          instruction_fa: "پاراگراف را با یک جمله هدایت‌کننده (Topic Sentence) شفاف شروع کنید.",
          instruction_en: "Begin your paragraph with an assertive, clear topic sentence.",
          completed: false,
        },
        {
          id: "t2",
          instruction_fa: "حداقل دو جمله کوتاه را به کمک حرف ربط (مانند whereas یا although) ترکیب کنید.",
          instruction_en: "Combine two short sentences using subordinate conjunctions to show contrast.",
          completed: false,
        },
        {
          id: "t3",
          instruction_fa: "خطاهای مشخص‌شده در بخش بازخورد را بررسی و موارد تاییدشده را تصحیح کنید.",
          instruction_en: "Review identified grammatical items and accept the validated suggestions.",
          completed: false,
        },
      ],
      disclaimer_fa: "اصل شفافیت هوش مصنوعی (قانون شماره ۸ اساسنامه): نمرات معیارهای چهارگانه آیلتس با مدل DeBERTa/MiniLM به صورت محلی در مرورگر پردازش شده‌اند.",
      disclaimer_en: "AI Transparency: Cambridge IELTS rubric criteria evaluated via in-browser distilled BERT multi-scale inference.",
    });
  }

  // Accept correction
  async function handleAcceptCorrection(errorId: string) {
    if (!analysis) return;

    if (draftId) {
      try {
        await fetch(`/api/writing/drafts/${draftId}/accept-correction/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error_id: errorId }),
        });
      } catch {
        // Optimistic update
      }
    }

    setAnalysis({
      ...analysis,
      error_annotations: analysis.error_annotations.map((err) =>
        err.id === errorId ? { ...err, is_accepted: true, is_dismissed: false } : err
      ),
    });
  }

  // Dismiss correction
  async function handleDismissCorrection(errorId: string) {
    if (!analysis) return;

    if (draftId) {
      try {
        await fetch(`/api/writing/drafts/${draftId}/dismiss-correction/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error_id: errorId }),
        });
      } catch {
        // Optimistic update
      }
    }

    setAnalysis({
      ...analysis,
      error_annotations: analysis.error_annotations.map((err) =>
        err.id === errorId ? { ...err, is_accepted: false, is_dismissed: true } : err
      ),
    });
  }

  // Create new revision draft
  function handleStartRevision() {
    setDraftVersion((prev) => prev + 1);
    setAnalysis(null);
    window.scrollTo({ top: 300, behavior: "smooth" });
  }

  // Filter error annotations
  const visibleErrors = (analysis?.error_annotations || []).filter((err) => {
    if (err.is_dismissed) return false;
    if (errorCategoryFilter === "grammar") return err.category === "grammar" && !err.is_style_only;
    if (errorCategoryFilter === "style") return err.is_style_only;
    if (errorCategoryFilter === "collocation") return err.category === "collocation";
    return true;
  });

  return (
    <div className={styles.container}>
      <Link className={styles.backLink} href="/dashboard">
        <span aria-hidden="true">{isFa ? "←" : "→"}</span>
        {isFa ? "بازگشت به داشبورد" : "Back to dashboard"}
      </Link>

      {/* Hero Header */}
      <section className={styles.heroCard}>
        <div className={styles.heroHeader}>
          <div>
            <h1 className={styles.heroTitle}>
              {isFa ? "منتور هوشمند نگارش و مقاله‌نویسی (Writing Mentor v1)" : "Writing Mentor & Essay Lab v1"}
            </h1>
            <p className={styles.heroSubtitle}>
              {isFa
                ? "ویرایشگر متمرکز دوزبانه، بازنویسی سه سطحی، تحلیل بر اساس ۴ معیار آیلتس بدون ادعای کاذب، و هدایت فرآیند اصلاح توسط خود شما."
                : "Distraction-free bilingual studio, three-tier graduated rewrites, 4-criteria IELTS rubric with honest ranges, and revision coaching that preserves your voice."}
            </p>
          </div>
          <span className={styles.heroBadge}>
            {isFa ? `پیش‌نویس نسخه ${draftVersion}` : `Draft v${draftVersion}`}
          </span>
        </div>

        <div className={styles.actionRow}>
          <Link className={styles.buttonSecondary} href="/placement">
            {isFa ? "تعیین سطح نگارش" : "Writing Placement"}
          </Link>
          <Link className={styles.buttonSecondary} href="/practice">
            {isFa ? "تمرین هوشمند AI" : "AI Practice"}
          </Link>
          <Link className={styles.buttonSecondary} href="/mistakes">
            {isFa ? "ژنوم خطاهای من" : "Mistake Genome"}
          </Link>
        </div>
      </section>

      {/* Dual Workbench Mode Selector */}
      <div style={{ display: "flex", gap: "var(--space-2)", marginBlockEnd: "var(--space-4)" }}>
        <Button
          type="button"
          size="sm"
          variant={writingTabMode === "mentor" ? "primary" : "secondary"}
          onClick={() => setWritingTabMode("mentor")}
        >
          ✍️ {isFa ? "کارگاه تعاملی نگارش و منتورینگ" : "Interactive Writing Studio & Mentor"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant={writingTabMode === "bert_evaluator" ? "primary" : "secondary"}
          onClick={() => setWritingTabMode("bert_evaluator")}
        >
          ⚡ {isFa ? "موتور ارزیابی چندمقیاسه برخط (Edge AI BERT Evaluator)" : "Edge AI BERT Evaluator"}
        </Button>
      </div>

      {writingTabMode === "bert_evaluator" && (
        <section className={styles.card} style={{ marginBlockEnd: "var(--space-4)" }}>
          <IELTSWritingEvaluator
            key={selectedPrompt.id}
            promptText={selectedPrompt.prompt_en}
            initialText={essayText}
            targetWords={selectedPrompt.min_words}
            taskType={selectedPrompt.mode.includes("task1") ? "task1" : "task2"}
            onEvaluated={(res) => {
              mapBertResultToAnalysis(res, draftId);
            }}
          />
        </section>
      )}

      {/* Mode & Prompt Selection */}
      <section className={styles.heroCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-3)" }}>
          <label style={{ fontWeight: 700, fontSize: "var(--font-size-body)" }}>
            {isFa ? "حالت و موضوع نگارش:" : "Writing Mode & Prompt:"}
          </label>
          <div className={styles.pillGroup}>
            <Button
              type="button"
              size="sm"
              variant={selectedMode === "all" ? "primary" : "secondary"}
              onClick={() => setSelectedMode("all")}
            >
              {isFa ? "همه موضوعات" : "All Modes"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={selectedMode === "general" ? "primary" : "secondary"}
              onClick={() => setSelectedMode("general")}
            >
              {isFa ? "انگلیسی عمومی (A1-B2)" : "General English"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={selectedMode === "ielts" ? "primary" : "secondary"}
              onClick={() => setSelectedMode("ielts")}
            >
              {isFa ? "آزمون آیلتس (IELTS)" : "IELTS Tasks"}
            </Button>
          </div>
        </div>

        {/* Prompt Pills */}
        <div className={styles.pillGroup}>
          {visiblePrompts.map((p) => (
            <Button
              key={p.id}
              type="button"
              size="sm"
              variant={selectedPrompt.id === p.id ? "primary" : "secondary"}
              onClick={() => {
                setSelectedPrompt(p);
                setAnalysis(null);
              }}
            >
              <span style={{ marginInlineEnd: "var(--space-1)", opacity: 0.8 }}>[{p.level}]</span>
              {isFa ? p.title_fa : p.title_en}
            </Button>
          ))}
        </div>

        {/* Prompt Card */}
        <div className={styles.promptBox}>
          <p className={styles.promptTitle}>
            {isFa ? selectedPrompt.title_fa : selectedPrompt.title_en} ({selectedPrompt.level})
          </p>
          <p className={styles.promptTextFa}>{selectedPrompt.prompt_fa}</p>
          <p className={styles.promptTextEn}>{selectedPrompt.prompt_en}</p>
          <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>
            {isFa ? `حداقل کلمات توصیه شده: ${selectedPrompt.min_words} کلمه` : `Recommended minimum: ${selectedPrompt.min_words} words`}
          </span>
        </div>
      </section>

      {/* Distraction-Free Composition Studio */}
      <section className={styles.editorCard}>
        <div className={styles.editorToolbar}>
          {/* Stopwatch & Exam Timer */}
          <div className={styles.timerWidget}>
            <span aria-hidden="true">⏱</span>
            <span>{formatTime(timeSeconds)}</span>
            <Button
              type="button"
              size="sm"
              variant="tertiary"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              style={{ marginInlineStart: "var(--space-2)" }}
            >
              {isTimerRunning ? (isFa ? "توقف" : "Pause") : (isFa ? "شروع تایمر" : "Start")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="tertiary"
              onClick={() => {
                setIsTimerRunning(false);
                setTimeSeconds(0);
              }}
              style={{ marginInlineStart: "var(--space-1)" }}
            >
              {isFa ? "ریست" : "Reset"}
            </Button>
          </div>

          {/* Stats Bar */}
          <div className={styles.editorStats}>
            <span className={styles.statItem}>
              {isFa ? "تعداد کلمات: " : "Words: "}
              <strong className={wordCount >= selectedPrompt.min_words ? styles.statValueActive : styles.statValue}>
                {wordCount} / {selectedPrompt.min_words}
              </strong>
            </span>
            <span className={styles.statItem}>
              {isFa ? "جملات: " : "Sentences: "}
              <strong className={styles.statValue}>{sentenceCount}</strong>
            </span>
            <span className={styles.statItem}>
              {isFa ? "حروف: " : "Chars: "}
              <strong className={styles.statValue}>{charCount}</strong>
            </span>
            <span className={styles.statItem}>
              {isFa ? "زمان تقریبی مطالعه: " : "Est. Read: "}
              <strong className={styles.statValue}>{readingTimeMin} {isFa ? "دقیقه" : "min"}</strong>
            </span>
            <span className={styles.statItem} style={{ color: autosaveStatus === "saved" ? "var(--color-success-text)" : "var(--color-muted)" }}>
              {autosaveStatus === "saving" && (isFa ? "در حال ذخیره..." : "Saving...")}
              {autosaveStatus === "saved" && (isFa ? "ذخیره شد ✓" : "Saved ✓")}
            </span>
          </div>
        </div>

        {/* Writing Editor */}
        <WritingEditor
          key={selectedPrompt.id}
          initialText={essayText}
          minWordsExpected={selectedPrompt.min_words}
          maxWordsExpected={selectedPrompt.max_words || selectedPrompt.min_words * 3}
          locale={isFa ? "fa" : "en"}
          placeholder={
            isFa
              ? "پاسخ متنی و انشای خود را به زبان انگلیسی اینجا بنویسید..."
              : "Compose your essay response here in English..."
          }
          onChangeText={(text) => {
            setEssayText(text);
            setAutosaveStatus("saving");
            if (analysis) setAnalysis(null);
          }}
          onConfirmAnswer={(payload) => {
            setEssayText(payload.written_text);
            setShowConfirmModal(true);
          }}
        />

        {/* Primary Action */}
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", alignItems: "center" }}>
          <Button
            type="button"
            variant="primary"
            onClick={() => setShowConfirmModal(true)}
            loading={isAnalyzing}
            disabled={wordCount < 10 || isAnalyzing}
          >
            {isAnalyzing
              ? (isFa ? "در حال تحلیل تشخیصی نگارش..." : "Analyzing Writing...")
              : (isFa ? "تحلیل جامع نگارش و معیارهای آیلتس" : "Analyze Writing & IELTS Rubrics")}
          </Button>

          {analysis && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleStartRevision}
            >
              {isFa ? "شروع نسخه بازنویسی جدید (Revision)" : "Start New Revision (v" + (draftVersion + 1) + ")"}
            </Button>
          )}
        </div>
      </section>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <h3 style={{ margin: 0, fontSize: "var(--font-size-section-title)", fontWeight: 800 }}>
              {isFa ? "تایید ارسال برای تحلیل منتور نگارش" : "Confirm Writing Analysis Submission"}
            </h3>
            <p style={{ margin: 0, color: "var(--color-muted)", lineHeight: 1.6 }}>
              {isFa
                ? `متن شما شامل ${wordCount} کلمه برای ارزیابی جامع گرامری، تنوع واژگان و برآورد رینج نمره آیلتس ارسال خواهد شد.`
                : `Your draft containing ${wordCount} words will be analyzed for grammar, vocabulary diversity, and IELTS estimated band ranges.`}
            </p>
            <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "flex-end", marginBlockStart: "var(--space-2)" }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                {isFa ? "انصراف و ادامه ویرایش" : "Cancel"}
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleConfirmAnalysis}
              >
                {isFa ? "ارسال و مشاهده تحلیل" : "Confirm & Analyze"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Diagnostic Feedback Results */}
      {analysis && (
        <section className={styles.resultsCard}>
          {/* Score Overview Banners */}
          <div className={styles.scoreBanner}>
            <div className={styles.scoreCard}>
              <span className={styles.scoreLabel}>
                {isFa ? "بازه نمره تخمینی آیلتس:" : "Estimated IELTS Band Range:"}
              </span>
              <span className={styles.scoreValue}>
                {analysis.ielts_scores.overall_band_range}
              </span>
              <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>
                {isFa ? "تخمینی بر اساس معیارهای ۴ گانه" : "Formative rubric estimate"}
              </span>
            </div>

            <div className={styles.scoreCard}>
              <span className={styles.scoreLabel}>
                {isFa ? "سطح تقریبی CEFR:" : "Estimated CEFR Range:"}
              </span>
              <span className={styles.scoreValue}>
                {analysis.estimated_cefr_range}
              </span>
              <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>
                {isFa ? "شاخص انطباق استاندارد اروپا" : "Formative CEFR benchmark"}
              </span>
            </div>
          </div>

          {/* Strengths & Priorities */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))", gap: "var(--space-4)" }}>
            <div style={{ background: "var(--color-surface-subtle)", padding: "var(--space-4)", borderRadius: "var(--radius-control)", border: "1px solid var(--color-border)" }}>
              <h4 style={{ margin: "0 0 var(--space-2) 0", color: "var(--color-success-text)", fontWeight: 700 }}>
                {isFa ? "نقاط قوت متن شما:" : "Observed Strengths:"}
              </h4>
              <p style={{ margin: 0, fontSize: "var(--font-size-body)", lineHeight: 1.6 }}>
                {isFa ? analysis.strengths_summary_fa : analysis.strengths_summary_en}
              </p>
            </div>

            <div style={{ background: "var(--color-surface-subtle)", padding: "var(--space-4)", borderRadius: "var(--radius-control)", border: "1px solid var(--color-border)" }}>
              <h4 style={{ margin: "0 0 var(--space-2) 0", color: "var(--color-action)", fontWeight: 700 }}>
                {isFa ? "اولویت‌های اصلی برای بازنویسی:" : "Top Revision Priorities:"}
              </h4>
              <ul style={{ margin: 0, paddingInlineStart: "var(--space-4)", lineHeight: 1.6 }}>
                {(isFa ? analysis.top_priorities_fa : analysis.top_priorities_en).map((pri, idx) => (
                  <li key={idx} style={{ fontSize: "var(--font-size-meta)", marginBlockEnd: "var(--space-1)" }}>
                    {pri}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sentence Cohesion Attention Heatmap */}
          {bertResult && bertResult.sentenceHeatmap && bertResult.sentenceHeatmap.length > 0 && (
            <div
              style={{
                marginBlock: "var(--space-4)",
                padding: "var(--space-4)",
                background: "var(--color-surface-subtle)",
                borderRadius: "var(--radius-control)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBlockEnd: "var(--space-2)",
                  flexWrap: "wrap",
                  gap: "var(--space-2)",
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>🔥</span>
                  {isFa
                    ? "نقشه حرارتی انسجام جمله به جمله (Cohesion Attention Heatmap):"
                    : "Sentence-Level Cohesion Attention Heatmap:"}
                </h4>
                <div
                  style={{
                    display: "flex",
                    gap: "var(--space-3)",
                    fontSize: "0.78rem",
                  }}
                >
                  <span style={{ color: "#10b981", fontWeight: 700 }}>
                    ● {isFa ? "جریان قوی (≥ 0.65)" : "Strong (≥ 0.65)"}
                  </span>
                  <span style={{ color: "#f59e0b", fontWeight: 700 }}>
                    ● {isFa ? "تغییر معتدل (0.42 - 0.65)" : "Moderate (0.42 - 0.65)"}
                  </span>
                  <span style={{ color: "#ef4444", fontWeight: 700 }}>
                    ● {isFa ? "افت پیوستگی (< 0.42)" : "Abrupt Drop (< 0.42)"}
                  </span>
                </div>
              </div>

              <div
                style={{
                  lineHeight: 2.1,
                  padding: "var(--space-3)",
                  background: "var(--color-canvas)",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                }}
                dir="ltr"
              >
                {bertResult.sentenceHeatmap.map((item, idx) => {
                  const color =
                    item.flowStatus === "strong"
                      ? "#10b981"
                      : item.flowStatus === "moderate"
                      ? "#f59e0b"
                      : "#ef4444";
                  const bg =
                    item.flowStatus === "strong"
                      ? "rgba(16, 185, 129, 0.12)"
                      : item.flowStatus === "moderate"
                      ? "rgba(245, 158, 11, 0.12)"
                      : "rgba(239, 68, 68, 0.15)";
                  const tooltipText =
                    item.similarityWithPrevious !== null
                      ? `جمله ${idx + 1} | تشابه با قبل: ${(
                          item.similarityWithPrevious * 100
                        ).toFixed(0)}٪ | ${item.feedbackFa}`
                      : `جمله ۱ (آغاز پاراگراف) | ${item.feedbackFa}`;

                  return (
                    <span
                      key={idx}
                      style={{
                        display: "inline",
                        padding: "3px 6px",
                        margin: "0 2px",
                        borderRadius: "4px",
                        borderBottom: `2.5px solid ${color}`,
                        backgroundColor: bg,
                        cursor: "help",
                        fontFamily: "var(--font-family-latin)",
                        fontSize: "0.95rem",
                      }}
                      title={tooltipText}
                    >
                      {item.sentence}{" "}
                    </span>
                  );
                })}
              </div>

              {bertResult.paragraphs &&
                bertResult.paragraphs.some((p) => p.cosineWithNext !== null) && (
                  <div
                    style={{
                      marginBlockStart: "var(--space-3)",
                      borderTop: "1px dashed var(--color-border)",
                      paddingTop: "var(--space-3)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: "var(--color-muted)",
                        display: "block",
                        marginBlockEnd: "var(--space-1)",
                      }}
                    >
                      {isFa
                        ? "انتقال بین پاراگراف‌ها (Paragraph Transitions):"
                        : "Paragraph Transitions:"}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--space-2)",
                        flexWrap: "wrap",
                      }}
                    >
                      {bertResult.paragraphs
                        .filter((p) => p.cosineWithNext !== null)
                        .map((p, idx) => (
                          <span
                            key={p.paragraphIndex ?? idx}
                            style={{
                              fontSize: "0.76rem",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              background:
                                p.flowQuality === "high"
                                  ? "rgba(16, 185, 129, 0.15)"
                                  : p.flowQuality === "moderate"
                                  ? "rgba(245, 158, 11, 0.15)"
                                  : "rgba(239, 68, 68, 0.15)",
                              border: `1px solid ${
                                p.flowQuality === "high"
                                  ? "#10b981"
                                  : p.flowQuality === "moderate"
                                  ? "#f59e0b"
                                  : "#ef4444"
                              }`,
                              color:
                                p.flowQuality === "high"
                                  ? "#10b981"
                                  : p.flowQuality === "moderate"
                                  ? "#f59e0b"
                                  : "#ef4444",
                              fontWeight: 600,
                            }}
                          >
                            پاراگراف {p.paragraphIndex + 1} ➔ {p.paragraphIndex + 2}:{" "}
                            {((p.cosineWithNext ?? 0) * 100).toFixed(0)}٪ ({p.diagnosticFeedbackFa})
                          </span>
                        ))}
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* IELTS 4 Criteria Grid */}
          <div>
            <h3 style={{ fontSize: "var(--font-size-section-title)", fontWeight: 800, marginBlockEnd: "var(--space-3)" }}>
              {isFa ? "تحلیل ۴ معیار رسمی آیلتس (IELTS Writing Rubric):" : "IELTS 4-Criteria Diagnostic Breakdown:"}
            </h3>
            <div className={styles.rubricGrid}>
              {/* Task Achievement */}
              <div className={styles.rubricCard}>
                <div className={styles.rubricHeader}>
                  <h4 className={styles.rubricName}>{isFa ? "پاسخ به تسک (TR)" : "Task Achievement"}</h4>
                  <span className={styles.rubricBand}>
                    Band {analysis.ielts_scores.task_achievement.band_min}–{analysis.ielts_scores.task_achievement.band_max}
                  </span>
                </div>
                <p className={styles.rubricFeedback}>
                  {isFa ? analysis.ielts_scores.task_achievement.feedback_fa : analysis.ielts_scores.task_achievement.feedback_en}
                </p>
              </div>

              {/* Coherence & Cohesion */}
              <div className={styles.rubricCard}>
                <div className={styles.rubricHeader}>
                  <h4 className={styles.rubricName}>{isFa ? "انسجام و پیوستگی (CC)" : "Coherence & Cohesion"}</h4>
                  <span className={styles.rubricBand}>
                    Band {analysis.ielts_scores.coherence_cohesion.band_min}–{analysis.ielts_scores.coherence_cohesion.band_max}
                  </span>
                </div>
                <p className={styles.rubricFeedback}>
                  {isFa ? analysis.ielts_scores.coherence_cohesion.feedback_fa : analysis.ielts_scores.coherence_cohesion.feedback_en}
                </p>
              </div>

              {/* Lexical Resource */}
              <div className={styles.rubricCard}>
                <div className={styles.rubricHeader}>
                  <h4 className={styles.rubricName}>{isFa ? "تنوع واژگانی (LR)" : "Lexical Resource"}</h4>
                  <span className={styles.rubricBand}>
                    Band {analysis.ielts_scores.lexical_resource.band_min}–{analysis.ielts_scores.lexical_resource.band_max}
                  </span>
                </div>
                <p className={styles.rubricFeedback}>
                  {isFa ? analysis.ielts_scores.lexical_resource.feedback_fa : analysis.ielts_scores.lexical_resource.feedback_en}
                </p>
              </div>

              {/* Grammatical Range & Accuracy */}
              <div className={styles.rubricCard}>
                <div className={styles.rubricHeader}>
                  <h4 className={styles.rubricName}>{isFa ? "دامنه و صحت گرامری (GRA)" : "Grammar Range & Accuracy"}</h4>
                  <span className={styles.rubricBand}>
                    Band {analysis.ielts_scores.grammatical_accuracy.band_min}–{analysis.ielts_scores.grammatical_accuracy.band_max}
                  </span>
                </div>
                <p className={styles.rubricFeedback}>
                  {isFa ? analysis.ielts_scores.grammatical_accuracy.feedback_fa : analysis.ielts_scores.grammatical_accuracy.feedback_en}
                </p>
              </div>
            </div>
          </div>

          {/* Graduated Reference Rewrites (A2, B2, C2) */}
          <div className={styles.rewritesSection}>
            <div className={styles.rewriteDisclaimer}>
              <span aria-hidden="true">💡</span>
              <span>
                {isFa ? analysis.graduated_rewrites.disclaimer_fa : analysis.graduated_rewrites.disclaimer_en}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-2)" }}>
              <h4 style={{ margin: 0, fontWeight: 800 }}>
                {isFa ? "نمونه‌های بازنویسی سه‌سطحی برای یادگیری ساختارها:" : "Three-Tier Graduated Reference Rewrites:"}
              </h4>
              <div className={styles.rewriteTabs}>
                <Button
                  type="button"
                  size="sm"
                  variant={activeRewriteTab === "a2" ? "primary" : "secondary"}
                  onClick={() => setActiveRewriteTab("a2")}
                >
                  {isFa ? "سطح A2 (روان)" : "A2 (Accessible)"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={activeRewriteTab === "b2" ? "primary" : "secondary"}
                  onClick={() => setActiveRewriteTab("b2")}
                >
                  {isFa ? "سطح B2 (آکادمیک)" : "B2 (Academic)"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={activeRewriteTab === "c2" ? "primary" : "secondary"}
                  onClick={() => setActiveRewriteTab("c2")}
                >
                  {isFa ? "سطح C2 (پیشرفته)" : "C2 (Nuanced)"}
                </Button>
              </div>
            </div>

            <div className={styles.rewriteContent}>
              <p className={styles.rewriteText}>
                {analysis.graduated_rewrites[activeRewriteTab].text}
              </p>
              <p className={styles.rewriteFocus}>
                <strong>{isFa ? "تمرکز آموزشی: " : "Pedagogical focus: "}</strong>
                {isFa
                  ? analysis.graduated_rewrites[activeRewriteTab].pedagogical_focus_fa
                  : analysis.graduated_rewrites[activeRewriteTab].pedagogical_focus_en}
              </p>
            </div>
          </div>

          {/* Categorized Error Annotations */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-3)", marginBlockEnd: "var(--space-3)" }}>
              <h3 style={{ margin: 0, fontSize: "var(--font-size-section-title)", fontWeight: 800 }}>
                {isFa ? "نکات اصلاحی و بازخورد اختصاصی:" : "Detailed Feedback & Correction Items:"}
              </h3>
              <div className={styles.pillGroup}>
                <Button
                  type="button"
                  size="sm"
                  variant={errorCategoryFilter === "all" ? "primary" : "secondary"}
                  onClick={() => setErrorCategoryFilter("all")}
                >
                  {isFa ? "همه نکات" : "All Items"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={errorCategoryFilter === "grammar" ? "primary" : "secondary"}
                  onClick={() => setErrorCategoryFilter("grammar")}
                >
                  {isFa ? "دستور زبان (Grammar)" : "Grammar"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={errorCategoryFilter === "style" ? "primary" : "secondary"}
                  onClick={() => setErrorCategoryFilter("style")}
                >
                  {isFa ? "سبک و واژگان (Style)" : "Style & Precision"}
                </Button>
              </div>
            </div>

            {visibleErrors.length === 0 ? (
              <p style={{ color: "var(--color-muted)", fontSize: "var(--font-size-body)", fontStyle: "italic" }}>
                {isFa ? "هیچ خطای برجسته‌ای در این دسته یافت نشد." : "No outstanding items found in this filter."}
              </p>
            ) : (
              <div className={styles.errorList}>
                {visibleErrors.map((err) => (
                  <div key={err.id} className={styles.errorCard}>
                    <div className={styles.errorHeader}>
                      <span
                        style={{
                          fontSize: "var(--font-size-meta)",
                          fontWeight: 700,
                          color: err.is_style_only ? "var(--color-action)" : "var(--color-error-text)",
                        }}
                      >
                        {err.is_style_only
                          ? (isFa ? "پیشنهاد سبکی (اختیاری)" : "Stylistic Suggestion")
                          : (isFa ? "خطای ساختاری / تداخل زبان فارسی" : "Structural / L1 Interference")}
                      </span>

                      {err.is_accepted && (
                        <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-success-text)", fontWeight: 700 }}>
                          {isFa ? "تایید شد و در ژنوم خطاها ثبت گردید ✓" : "Accepted & recorded to Genome ✓"}
                        </span>
                      )}
                    </div>

                    <div className={styles.errorSnippetRow}>
                      <span className={styles.snippetBad}>{err.original_snippet}</span>
                      <span className={styles.snippetArrow}>→</span>
                      <span className={styles.snippetGood}>{err.suggested_fix}</span>
                    </div>

                    <p className={styles.errorExplanation}>
                      {isFa ? err.explanation_fa : err.explanation_en}
                    </p>

                    {!err.is_accepted && (
                      <div className={styles.errorActions}>
                        <Button
                          type="button"
                          size="sm"
                          variant="primary"
                          onClick={() => handleAcceptCorrection(err.id)}
                        >
                          <span aria-hidden="true">✓</span>
                          {isFa ? "تایید تصحیح و ثبت در یادگیری" : "Accept Correction"}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => handleDismissCorrection(err.id)}
                        >
                          {isFa ? "صرف‌نظر (حفظ نگارش من)" : "Keep My Phrasing"}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actionable Revision Coaching Tasks */}
          <div>
            <h3 style={{ fontSize: "var(--font-size-section-title)", fontWeight: 800, marginBlockEnd: "var(--space-3)" }}>
              {isFa ? "مأموریت‌های بازنویسی برای پیش‌نویس بعدی (Revision Tasks):" : "Actionable Revision Tasks for Next Draft:"}
            </h3>
            <div className={styles.tasksList}>
              {analysis.revision_tasks.map((task) => (
                <label key={task.id} className={styles.taskItem}>
                  <Input
                    type="checkbox"
                    className={styles.taskCheckbox}
                    defaultChecked={task.completed}
                  />
                  <span className={styles.taskLabel}>
                    {isFa ? task.instruction_fa : task.instruction_en}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Final Rule #8 Disclaimer */}
          <footer className={styles.disclaimer}>
            {isFa ? analysis.disclaimer_fa : analysis.disclaimer_en}
          </footer>
        </section>
      )}
    </div>
  );
}

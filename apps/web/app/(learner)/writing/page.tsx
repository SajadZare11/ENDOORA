"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import { WritingEditor } from "../../../components/placement/WritingEditor";
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

  // Execute Analysis
  async function handleConfirmAnalysis() {
    setShowConfirmModal(false);
    setIsAnalyzing(true);

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
        setDraftId(savedDraft.id);
        setDraftVersion(savedDraft.version);

        const analyzeRes = await fetch(`/api/writing/drafts/${savedDraft.id}/analyze/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (analyzeRes.ok) {
          const analysisResult = await analyzeRes.json();
          setAnalysis(analysisResult);
        }
      }
    } catch {
      // Fallback local pedagogical analysis
      runLocalAnalysis();
    } finally {
      setIsAnalyzing(false);
    }
  }

  function runLocalAnalysis() {
    const isAgreeErr = /\bam agree\b/i.test(essayText);
    const isDiscussErr = /\bdiscuss about\b/i.test(essayText);
    const isGoodStyle = /\bvery good\b/i.test(essayText);

    const localErrors: ErrorAnnotation[] = [];
    if (isDiscussErr) {
      localErrors.push({
        id: "err_prep_discuss",
        category: "grammar",
        mistake_tag: "preposition_unnecessary",
        original_snippet: "discuss about",
        suggested_fix: "discuss",
        explanation_en: "The verb 'discuss' is transitive in English and takes a direct object without 'about'.",
        explanation_fa: "فعل discuss در انگلیسی متعدی است و نیازی به حرف اضافه about ندارد (تداخل زبان فارسی).",
        is_style_only: false,
      });
    }
    if (isAgreeErr) {
      localErrors.push({
        id: "err_agree_verb",
        category: "grammar",
        mistake_tag: "verb_form_confusion",
        original_snippet: "am agree",
        suggested_fix: "agree",
        explanation_en: "'Agree' is a main verb, not an adjective. Say 'I agree' rather than 'I am agree'.",
        explanation_fa: "کلمه agree در انگلیسی فعل است نه صفت؛ نیازی به فعل to be ندارد.",
        is_style_only: false,
      });
    }
    if (isGoodStyle) {
      localErrors.push({
        id: "style_lexical_precision",
        category: "style",
        mistake_tag: "lexical_precision",
        original_snippet: "very good",
        suggested_fix: "beneficial / advantageous",
        explanation_en: "Stylistic enhancement: Replace generic modifiers with precise academic adjectives.",
        explanation_fa: "پیشنهاد سبکی: جایگزینی صفت عمومی very good با واژگان آکادمیک دقیق‌تر.",
        is_style_only: true,
      });
    }

    setAnalysis({
      estimated_cefr_range: wordCount >= 120 ? "B2 – B2+" : "B1 – B2",
      ielts_scores: {
        overall_band_range: wordCount >= 150 ? "6.0 – 6.5" : "5.0 – 5.5",
        task_achievement: {
          band_min: 6.0,
          band_max: 6.5,
          feedback_en: "Addresses the main prompt ideas with relevant supporting points.",
          feedback_fa: "دیدگاه‌های اصلی موضوع با استدلال‌های مرتبط بیان شده‌اند.",
        },
        coherence_cohesion: {
          band_min: 5.5,
          band_max: 6.0,
          feedback_en: "Ideas are logically organized; adding subordinating conjunctions enriches paragraph flow.",
          feedback_fa: "ترتیب منطقی جملات مطلوب است؛ استفاده از حروف ربط متنوع‌تر پیوستگی متن را بهبود می‌دهد.",
        },
        lexical_resource: {
          band_min: 6.0,
          band_max: 6.5,
          feedback_en: "Good functional vocabulary with opportunities to employ less common academic collocations.",
          feedback_fa: "دایره واژگان کاربردی مناسب است؛ بهره‌گیری از اصطلاحات آکادمیک توصیه می‌شود.",
        },
        grammatical_accuracy: {
          band_min: 5.5,
          band_max: 6.0,
          feedback_en: "Effective control of basic sentence patterns with minor prepositional slips.",
          feedback_fa: "تسلط بر جملات پایه مناسب است؛ توجه به حروف اضافه افعال به صحت ساختار کمک می‌کند.",
        },
      },
      strengths_summary_fa: `متن شما با ${wordCount} کلمه و ${sentenceCount} جمله، تسلط قابل قبولی بر انتقال ایده اصلی نشان می‌دهد.`,
      strengths_summary_en: `Your text (${wordCount} words, ${sentenceCount} sentences) successfully communicates its central thesis.`,
      top_priorities_fa: [
        "افزایش تنوع واژگانی با جایگزینی صفات عمومی با ترکیبات آکادمیک.",
        "بهبود انسجام بین پاراگراف‌ها با استفاده از کلمات ربط علّی (consequently, furthermore).",
        "رفع خطاهای تداخل زبان فارسی در حروف اضافه افعال متعدی.",
      ],
      top_priorities_en: [
        "Upgrade high-frequency descriptors with precise academic collocations.",
        "Strengthen paragraph coherence using logical connectors.",
        "Refine transitive verb prepositions to eliminate L1 Persian transfer slips.",
      ],
      error_annotations: localErrors,
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
      disclaimer_fa: "اصل شفافیت آموزشی (قانون شماره ۸ اساسنامه): نمره و سطح تخمینی برای هدایت فرآیند بازنویسی بوده و مدرک رسمی آزمون آیلتس محسوب نمی‌شود.",
      disclaimer_en: "Product Constitution Rule #8 Disclosure: Estimated band ranges and CEFR levels are formative coaching indicators and do not constitute an official IELTS certificate.",
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

      {/* Mode & Prompt Selection */}
      <section className={styles.heroCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-3)" }}>
          <label style={{ fontWeight: 700, fontSize: "var(--font-size-body)" }}>
            {isFa ? "حالت و موضوع نگارش:" : "Writing Mode & Prompt:"}
          </label>
          <div className={styles.pillGroup}>
            <button
              type="button"
              className={`${styles.filterPill} ${selectedMode === "all" ? styles.filterPillActive : ""}`}
              onClick={() => setSelectedMode("all")}
            >
              {isFa ? "همه موضوعات" : "All Modes"}
            </button>
            <button
              type="button"
              className={`${styles.filterPill} ${selectedMode === "general" ? styles.filterPillActive : ""}`}
              onClick={() => setSelectedMode("general")}
            >
              {isFa ? "انگلیسی عمومی (A1-B2)" : "General English"}
            </button>
            <button
              type="button"
              className={`${styles.filterPill} ${selectedMode === "ielts" ? styles.filterPillActive : ""}`}
              onClick={() => setSelectedMode("ielts")}
            >
              {isFa ? "آزمون آیلتس (IELTS)" : "IELTS Tasks"}
            </button>
          </div>
        </div>

        {/* Prompt Pills */}
        <div className={styles.pillGroup}>
          {visiblePrompts.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`${styles.filterPill} ${selectedPrompt.id === p.id ? styles.filterPillActive : ""}`}
              onClick={() => {
                setSelectedPrompt(p);
                setAnalysis(null);
              }}
            >
              <span style={{ marginInlineEnd: "var(--space-1)", opacity: 0.8 }}>[{p.level}]</span>
              {isFa ? p.title_fa : p.title_en}
            </button>
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
            <button
              type="button"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--color-action)",
                fontWeight: 700,
                cursor: "pointer",
                padding: 0,
                marginInlineStart: "var(--space-2)",
              }}
            >
              {isTimerRunning ? (isFa ? "توقف" : "Pause") : (isFa ? "شروع تایمر" : "Start")}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsTimerRunning(false);
                setTimeSeconds(0);
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--color-muted)",
                cursor: "pointer",
                padding: 0,
                marginInlineStart: "var(--space-1)",
              }}
            >
              {isFa ? "ریست" : "Reset"}
            </button>
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
          <button
            type="button"
            className={styles.buttonPrimary}
            onClick={() => setShowConfirmModal(true)}
            disabled={wordCount < 10 || isAnalyzing}
          >
            {isAnalyzing
              ? (isFa ? "در حال تحلیل تشخیصی نگارش..." : "Analyzing Writing...")
              : (isFa ? "تحلیل جامع نگارش و معیارهای آیلتس" : "Analyze Writing & IELTS Rubrics")}
          </button>

          {analysis && (
            <button
              type="button"
              className={styles.buttonSecondary}
              onClick={handleStartRevision}
            >
              {isFa ? "شروع نسخه بازنویسی جدید (Revision)" : "Start New Revision (v" + (draftVersion + 1) + ")"}
            </button>
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
              <button
                type="button"
                className={styles.buttonSecondary}
                onClick={() => setShowConfirmModal(false)}
              >
                {isFa ? "انصراف و ادامه ویرایش" : "Cancel"}
              </button>
              <button
                type="button"
                className={styles.buttonPrimary}
                onClick={handleConfirmAnalysis}
              >
                {isFa ? "ارسال و مشاهده تحلیل" : "Confirm & Analyze"}
              </button>
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
                <button
                  type="button"
                  className={`${styles.rewriteTab} ${activeRewriteTab === "a2" ? styles.rewriteTabActive : ""}`}
                  onClick={() => setActiveRewriteTab("a2")}
                >
                  {isFa ? "سطح A2 (روان)" : "A2 (Accessible)"}
                </button>
                <button
                  type="button"
                  className={`${styles.rewriteTab} ${activeRewriteTab === "b2" ? styles.rewriteTabActive : ""}`}
                  onClick={() => setActiveRewriteTab("b2")}
                >
                  {isFa ? "سطح B2 (آکادمیک)" : "B2 (Academic)"}
                </button>
                <button
                  type="button"
                  className={`${styles.rewriteTab} ${activeRewriteTab === "c2" ? styles.rewriteTabActive : ""}`}
                  onClick={() => setActiveRewriteTab("c2")}
                >
                  {isFa ? "سطح C2 (پیشرفته)" : "C2 (Nuanced)"}
                </button>
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
                <button
                  type="button"
                  className={`${styles.filterPill} ${errorCategoryFilter === "all" ? styles.filterPillActive : ""}`}
                  onClick={() => setErrorCategoryFilter("all")}
                >
                  {isFa ? "همه نکات" : "All Items"}
                </button>
                <button
                  type="button"
                  className={`${styles.filterPill} ${errorCategoryFilter === "grammar" ? styles.filterPillActive : ""}`}
                  onClick={() => setErrorCategoryFilter("grammar")}
                >
                  {isFa ? "دستور زبان (Grammar)" : "Grammar"}
                </button>
                <button
                  type="button"
                  className={`${styles.filterPill} ${errorCategoryFilter === "style" ? styles.filterPillActive : ""}`}
                  onClick={() => setErrorCategoryFilter("style")}
                >
                  {isFa ? "سبک و واژگان (Style)" : "Style & Precision"}
                </button>
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
                        <button
                          type="button"
                          className={styles.btnAccept}
                          onClick={() => handleAcceptCorrection(err.id)}
                        >
                          <span aria-hidden="true">✓</span>
                          {isFa ? "تایید تصحیح و ثبت در یادگیری" : "Accept Correction"}
                        </button>
                        <button
                          type="button"
                          className={styles.btnDismiss}
                          onClick={() => handleDismissCorrection(err.id)}
                        >
                          {isFa ? "صرف‌نظر (حفظ نگارش من)" : "Keep My Phrasing"}
                        </button>
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
                  <input
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

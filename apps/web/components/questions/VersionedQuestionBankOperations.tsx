"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./operations-questions.module.css";

export type QuestionReviewEvent = {
  id: string;
  decision: string;
  note: string;
  reviewer_email: string | null;
  created_at: string;
};

export type QuestionObjectiveLink = {
  id: string;
  slug: string;
  label_fa: string;
  label_en: string;
  is_primary: boolean;
};

export type ChoiceOption = {
  id: string;
  text?: string;
  label?: string;
};

export type QuestionVersionEditorItem = {
  id: string;
  question_id: string;
  question_slug: string;
  version_number: number;
  question_type: string;
  status: "draft" | "in_review" | "published" | "retired";
  title_fa: string;
  title_en: string;
  display_title?: string;
  display_instructions?: string;
  prompt_fa: string;
  prompt_en: string;
  instructions_fa: string;
  instructions_en: string;
  cefr_level: string;
  difficulty: number;
  learner_payload: {
    options?: ChoiceOption[];
    [key: string]: unknown;
  };
  answer_key: Record<string, unknown>;
  accepted_variants: string[];
  explanation_fa: string;
  explanation_en: string;
  rubric: Record<string, unknown>;
  source_origin: string;
  source_title: string;
  source_url: string;
  license_type: string;
  license_reference: string;
  rights_holder: string;
  author_id: number | null;
  author_email: string | null;
  reviewer_id: number | null;
  reviewer_email: string | null;
  reviewed_at: string | null;
  published_at: string | null;
  retired_at: string | null;
  content_hash: string;
  objectives: QuestionObjectiveLink[];
  media: unknown[];
  reviews?: QuestionReviewEvent[];
};

export type CheckResponse = {
  status: "scored" | "manual_review_required";
  correct: boolean | null;
  explanation: string;
  question_version_id: string;
  rubric?: Record<string, unknown>;
};

type Mode = "governance" | "learner_safe";

function t(locale: "fa" | "en", fa: string, en: string) {
  return locale === "fa" ? fa : en;
}

export function VersionedQuestionBankOperations({
  initialObjectiveSlug = "",
}: {
  initialObjectiveSlug?: string;
}) {
  const [locale, setLocale] = useState<"fa" | "en">("fa");
  const [mode, setMode] = useState<Mode>("governance");
  const isFa = locale === "fa";

  // Data & states
  const [questions, setQuestions] = useState<QuestionVersionEditorItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCefr, setSelectedCefr] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedOrigin, setSelectedOrigin] = useState<string>("all");
  const searchParams = useSearchParams();
  const queryObjective = searchParams?.get("objective") || initialObjectiveSlug;
  const [selectedObjective, setSelectedObjective] = useState<string>(queryObjective);

  useEffect(() => {
    if (queryObjective) {
      setSelectedObjective(queryObjective);
    }
  }, [queryObjective]);

  // Drawer / Inspection
  const [inspectItem, setInspectItem] = useState<QuestionVersionEditorItem | null>(null);

  // Modals for actions
  const [reviewModalItem, setReviewModalItem] = useState<QuestionVersionEditorItem | null>(null);
  const [reviewNote, setReviewNote] = useState<string>("");
  const [retireModalItem, setRetireModalItem] = useState<QuestionVersionEditorItem | null>(null);
  const [retireNote, setRetireNote] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Import / Export modal
  const [importModalOpen, setImportModalOpen] = useState<boolean>(false);
  const [importJsonText, setImportJsonText] = useState<string>("");
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  // Learner simulator responses
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [checkResults, setCheckResults] = useState<Record<string, CheckResponse>>({});
  const [checkingIds, setCheckingIds] = useState<Record<string, boolean>>({});
  const [checkErrors, setCheckErrors] = useState<Record<string, string>>({});

  const [, startTransition] = useTransition();

  // Load questions
  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        per_page: "100",
      });
      if (selectedCefr !== "all") params.set("cefr", selectedCefr);
      if (selectedType !== "all") params.set("type", selectedType);
      if (mode === "governance" && selectedStatus !== "all") params.set("status", selectedStatus);
      if (mode === "governance" && selectedOrigin !== "all") params.set("origin", selectedOrigin);
      if (selectedObjective.trim()) params.set("objective", selectedObjective.trim());
      if (searchQuery.trim()) params.set("q", searchQuery.trim());

      try {
        const endpoint =
          mode === "governance"
            ? `/api/questions/editor/versions/?${params.toString()}`
            : `/api/questions/published/?${params.toString()}`;

        const res = await fetch(endpoint, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });

        if (res.status === 401 || res.status === 403) {
          setError(
            t(
              locale,
              "برای دسترسی به حاکمیت بانک سؤالات باید با نقش ویرایشگر محتوا (Editor) یا مدیر سیستم وارد شوید.",
              "Access denied: Sign in as a Content Editor or Administrator to manage question governance.",
            ),
          );
          setQuestions([]);
          return;
        }

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setTotalCount(data.count ?? 0);
        setQuestions(data.results ?? []);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(
          t(
            locale,
            "ارتباط با پایگاه داده بانک سؤال برقرار نشد. اتصال API را بررسی کرده و مجدداً تلاش نمایید.",
            "Failed to load question bank items. Please check network connection and retry.",
          ),
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => controller.abort();
  }, [locale, mode, selectedCefr, selectedType, selectedStatus, selectedOrigin, selectedObjective, searchQuery, refreshKey]);

  // Handle two-person review actions
  async function handleSubmitForReview() {
    if (!reviewModalItem) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch(
        `/api/questions/editor/versions/${reviewModalItem.id}/submit-review/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ note: reviewNote.trim() }),
        },
      );
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.status?.[0] || errJson.detail || `HTTP ${res.status}`);
      }
      setReviewModalItem(null);
      setReviewNote("");
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : String(err));
    } finally {
      setActionLoading(false);
    }
  }

  async function handlePublish(item: QuestionVersionEditorItem) {
    if (!confirm(
      isFa
        ? `آیا از تأیید و انتشار رسمی نسخه ${item.version_number} سؤال «${item.question_slug}» اطمینان دارید؟ نسخه منتشرشده پس از این غیرقابل تغییر خواهد شد.`
        : `Are you sure you want to publish version ${item.version_number} of "${item.question_slug}"? Once published, it becomes immutable.`
    )) {
      return;
    }
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch(
        `/api/questions/editor/versions/${item.id}/publish/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({}),
        },
      );
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const details = Object.entries(errJson)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(" ") : v}`)
          .join(" | ");
        throw new Error(details || `HTTP ${res.status}`);
      }
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      alert(isFa ? `خطا در انتشار: ${String(err)}` : `Publication failed: ${String(err)}`);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRetire() {
    if (!retireModalItem) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch(
        `/api/questions/editor/versions/${retireModalItem.id}/retire/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ note: retireNote.trim() }),
        },
      );
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || `HTTP ${res.status}`);
      }
      setRetireModalItem(null);
      setRetireNote("");
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : String(err));
    } finally {
      setActionLoading(false);
    }
  }

  // Handle Export
  async function handleExport() {
    try {
      const res = await fetch("/api/questions/editor/export/", {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `endoora_question_bank_export_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      alert(isFa ? "خطا در خروجی فایل JSON" : "Failed to export JSON file");
    }
  }

  // Handle Import
  async function handleImport() {
    setImportError(null);
    setImportSuccess(null);
    try {
      const parsed = JSON.parse(importJsonText);
      const res = await fetch("/api/questions/editor/import/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(parsed),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.document ? data.document.join("\n") : JSON.stringify(data),
        );
      }
      setImportSuccess(
        isFa
          ? `واردسازی با موفقیت انجام شد: ${data.created} مورد ایجاد شد، ${data.skipped} مورد نادیده گرفته شد.`
          : `Import succeeded: ${data.created} created, ${data.skipped} skipped.`,
      );
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      setImportError(err instanceof Error ? err.message : String(err));
    }
  }

  // Handle learner simulator response check
  async function handleCheckAnswer(item: QuestionVersionEditorItem) {
    const userResponse = responses[item.id];
    if (!userResponse || !userResponse.trim()) {
      setCheckErrors((prev) => ({
        ...prev,
        [item.id]: t(locale, "لطفاً ابتدا پاسخی برای ارسال درج نمایید.", "Please enter a response first."),
      }));
      return;
    }

    setCheckingIds((prev) => ({ ...prev, [item.id]: true }));
    setCheckErrors((prev) => ({ ...prev, [item.id]: "" }));

    try {
      const res = await fetch(
        `/api/questions/published/${item.id}/check/?lang=${locale}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ response: userResponse.trim() }),
        },
      );
      if (!res.ok) {
        const errJson = (await res.json().catch(() => ({}))) as { detail?: string };
        throw new Error(errJson.detail || `HTTP ${res.status}`);
      }
      const result = (await res.json()) as CheckResponse;
      setCheckResults((prev) => ({ ...prev, [item.id]: result }));
    } catch (err: unknown) {
      setCheckErrors((prev) => ({
        ...prev,
        [item.id]: String(err instanceof Error ? err.message : err),
      }));
    } finally {
      setCheckingIds((prev) => ({ ...prev, [item.id]: false }));
    }
  }

  // Stats calculation
  const draftCount = questions.filter((q) => q.status === "draft").length;
  const reviewCount = questions.filter((q) => q.status === "in_review").length;
  const publishedCount = questions.filter((q) => q.status === "published").length;
  const retiredCount = questions.filter((q) => q.status === "retired").length;

  return (
    <div className={styles.pageContainer} lang={locale} dir={isFa ? "rtl" : "ltr"}>
      {/* Top Operations Navigation Tabs */}
      <nav className={styles.operationsNav} aria-label={t(locale, "ناوبری بخش عملیات محتوا", "Content Operations Navigation")}>
        <Link href="/operations/taxonomy" className={styles.navTab}>
          {t(locale, "تاکسونومی و سرفصل آموزشی (CONTENT-001)", "Content Taxonomy (CONTENT-001)")}
        </Link>
        <Link href="/operations/questions" className={`${styles.navTab} ${styles.navTabActive}`}>
          {t(locale, "بانک سؤال نسخه‌بندی‌شده (CONTENT-002)", "Versioned Question Bank (CONTENT-002)")}
        </Link>
      </nav>

      {/* Main Header */}
      <header className={styles.headerSection}>
        <div className={styles.headerInfo}>
          <span className={styles.kicker}>
            {t(locale, "حاکمیت محتوای آموزشی و سنجش", "Assessment & Learning Governance")}
          </span>
          <h1 className={styles.headerTitle}>
            {t(locale, "بانک سؤالات نسخه‌بندی‌شده Endoora", "Endoora Versioned Question Bank")}
          </h1>
          <p className={styles.headerDescription}>
            {t(
              locale,
              "مدیریت چرخه حیات و نسخه‌های ماندگار سؤالات (پیش‌نویس، بازبینی، انتشار، بایگانی)، دروازه دو‌نفره نشر، انطباق کپی‌رایت و مرز امنیتی حفاظت از کلید پاسخ‌ها.",
              "Manage immutable question version lifecycles (draft, in-review, published, retired), two-person review gate, licensing compliance, and strict pre-submission answer-key isolation.",
            )}
          </p>
        </div>

        <div className={styles.headerControls}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => setLocale(isFa ? "en" : "fa")}
            aria-label={isFa ? "تغییر زبان به انگلیسی" : "Switch language to Persian"}
          >
            {isFa ? "English" : "فارسی"}
          </button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={handleExport}
            title={t(locale, "دانلود ساختار نسخه‌بندی‌شده به فرمت JSON", "Export versioned bank as JSON")}
          >
            {t(locale, "خروجی JSON", "Export JSON")}
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => setImportModalOpen(true)}
          >
            {t(locale, "واردسازی سؤال (Import)", "Import Questions")}
          </button>
        </div>
      </header>

      {/* Governance Banner */}
      <aside className={styles.governanceNotice} role="region" aria-label={t(locale, "قوانین حاکمیتی", "Governance rules")}>
        <div className={styles.governanceNoticeTitle}>
          {t(locale, "اصول حاکمیتی محتوای سنجش در Endoora (CONTENT-002)", "Endoora Assessment Governance Standards (CONTENT-002)")}
        </div>
        <p className={styles.governanceNoticeText}>
          {t(
            locale,
            "۱. نسخه‌های منتشرشده غیرقابل تغییرند (ویرایش مستقیم غیرمجاز است؛ تصحیحات نیازمند ثبت نسخه جدید هستند). ۲. نشر نیازمند دروازه دو‌نفره (مؤلف + بازبین) و تعیین منبع کپی‌رایت است. ۳. درجه سختی (۱ تا ۵) از سطح CEFR مجزا است. ۴. کلید پاسخ تا قبل از ثبت نهایی داوطلب هرگز در پاسخ‌های سمت کاربر ارسال نمی‌شود.",
            "1. Published versions are strictly immutable. 2. Publication requires a two-person gate (author + reviewer) and documented license metadata. 3. Item difficulty (1–5) is separate from CEFR level. 4. Pre-submission payloads strictly isolate answer keys.",
          )}
        </p>
      </aside>

      {/* Metrics Strip */}
      <section className={styles.statsBar} aria-label={t(locale, "خلاصه آمار نسخه‌ها", "Version statistics summary")}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>{t(locale, "کل نسخه‌ها", "Total Versions")}</span>
          <span className={styles.statValue}>{totalCount}</span>
        </div>
        <div className={`${styles.statCard} ${styles.statCardDraft}`}>
          <span className={styles.statLabel}>{t(locale, "پیش‌نویس‌ها", "Drafts")}</span>
          <span className={styles.statValue}>{draftCount}</span>
        </div>
        <div className={`${styles.statCard} ${styles.statCardReview}`}>
          <span className={styles.statLabel}>{t(locale, "در حال بازبینی", "In Review")}</span>
          <span className={styles.statValue}>{reviewCount}</span>
        </div>
        <div className={`${styles.statCard} ${styles.statCardPublished}`}>
          <span className={styles.statLabel}>{t(locale, "منتشرشده", "Published")}</span>
          <span className={styles.statValue}>{publishedCount}</span>
        </div>
        <div className={`${styles.statCard} ${styles.statCardRetired}`}>
          <span className={styles.statLabel}>{t(locale, "بایگانی / منسوخ", "Retired")}</span>
          <span className={styles.statValue}>{retiredCount}</span>
        </div>
      </section>

      {/* Mode Switcher */}
      <div className={styles.modeToggleContainer}>
        <div>
          <strong>{t(locale, "حالت نمایش عملیات:", "Operations View Mode:")}</strong>{" "}
          <span style={{ fontSize: "0.88rem", color: "var(--color-muted)" }}>
            {mode === "governance"
              ? t(locale, "دسترسی کامل به جزئیات ممیزی، کپی‌رایت، کلید پاسخ‌ها و زنجیره بازبینی", "Full access to audit metadata, licensing, answer keys, and review trail")
              : t(locale, "شبیه‌ساز یادگیرنده بدون افشای کلید پاسخ‌ها قبل از ارسال", "Learner simulation with strict pre-submission answer-key isolation")}
          </span>
        </div>
        <div className={styles.modeSegmentGroup} role="radiogroup" aria-label={t(locale, "انتخاب حالت نمایش", "View mode switcher")}>
          <button
            type="button"
            className={`${styles.modeSegmentBtn} ${mode === "governance" ? styles.modeSegmentBtnActive : ""}`}
            onClick={() => setMode("governance")}
          >
            {t(locale, "حاکمیت و ممیزی (ویرایشگر)", "Governance & Audit")}
          </button>
          <button
            type="button"
            className={`${styles.modeSegmentBtn} ${mode === "learner_safe" ? styles.modeSegmentBtnActive : ""}`}
            onClick={() => setMode("learner_safe")}
          >
            {t(locale, "شبیه‌ساز یادگیرنده (امن)", "Learner-Safe Simulator")}
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <section className={styles.filtersPanel} aria-label={t(locale, "فیلترهای جستجو", "Search & filters")}>
        <div className={styles.filterControlsRow}>
          <input
            type="search"
            className={styles.filterSearchInput}
            placeholder={t(locale, "جستجو بر اساس شناسه، عنوان یا صورت سؤال...", "Search slug, title, or prompt...")}
            value={searchQuery}
            onChange={(e) => startTransition(() => setSearchQuery(e.target.value))}
            aria-label={t(locale, "جستجو در بانک سؤال", "Search question bank")}
          />

          <select
            className={styles.filterSelect}
            value={selectedCefr}
            onChange={(e) => setSelectedCefr(e.target.value)}
            aria-label={t(locale, "فیلتر سطح CEFR", "CEFR Filter")}
          >
            <option value="all">{t(locale, "همه سطوح CEFR", "All CEFR Levels")}</option>
            {["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>

          <select
            className={styles.filterSelect}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            aria-label={t(locale, "فیلتر نوع سؤال", "Question Type Filter")}
          >
            <option value="all">{t(locale, "همه انواع سؤال", "All Question Types")}</option>
            <option value="mcq">{t(locale, "چندگزینه‌ای (MCQ)", "Multiple Choice")}</option>
            <option value="multi_select">{t(locale, "چندانتخابی (Multi-select)", "Multi-select")}</option>
            <option value="short_answer">{t(locale, "پاسخ کوتاه (Short Answer)", "Short Answer")}</option>
            <option value="gap">{t(locale, "جای‌خالی (Gap Fill)", "Gap Fill")}</option>
            <option value="matching">{t(locale, "تطبیق (Matching)", "Matching")}</option>
            <option value="ordering">{t(locale, "مرتب‌سازی (Ordering)", "Ordering")}</option>
            <option value="long_writing">{t(locale, "نوشتار بلند (Long Writing)", "Long Writing")}</option>
            <option value="audio">{t(locale, "پرسش صوتی (Audio Prompt)", "Audio Prompt")}</option>
            <option value="speaking">{t(locale, "پرسش گفتاری (Speaking)", "Speaking Prompt")}</option>
          </select>

          {mode === "governance" && (
            <select
              className={styles.filterSelect}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label={t(locale, "فیلتر وضعیت چرخه نشر", "Status Filter")}
            >
              <option value="all">{t(locale, "همه وضعیت‌ها", "All Statuses")}</option>
              <option value="draft">{t(locale, "پیش‌نویس (Draft)", "Draft")}</option>
              <option value="in_review">{t(locale, "در حال بازبینی (In Review)", "In Review")}</option>
              <option value="published">{t(locale, "منتشرشده (Published)", "Published")}</option>
              <option value="retired">{t(locale, "بایگانی‌شده (Retired)", "Retired")}</option>
            </select>
          )}

          {mode === "governance" && (
            <select
              className={styles.filterSelect}
              value={selectedOrigin}
              onChange={(e) => setSelectedOrigin(e.target.value)}
              aria-label={t(locale, "فیلتر منبع کپی‌رایت", "Origin Filter")}
            >
              <option value="all">{t(locale, "همه منابع حقوقی", "All Origins")}</option>
              <option value="original">{t(locale, "تولید اختصاصی Endoora", "Endoora Original")}</option>
              <option value="licensed">{t(locale, "دارای پروانه مجاز", "Licensed Third-Party")}</option>
              <option value="public_domain">{t(locale, "مالکیت عمومی (Public Domain)", "Public Domain")}</option>
              <option value="ai_assisted">{t(locale, "تولید هوش مصنوعی با بازبینی انسان", "AI-Assisted (Human Reviewed)")}</option>
            </select>
          )}

          {selectedObjective && (
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => setSelectedObjective("")}
              title={t(locale, "پاک کردن فیلتر هدف یادگیری", "Clear objective filter")}
            >
              {t(locale, `هدف: ${selectedObjective} ✕`, `Objective: ${selectedObjective} ✕`)}
            </button>
          )}
        </div>
      </section>

      {/* Loading state */}
      {loading && (
        <div className={styles.stateContainer} role="status">
          <h2>{t(locale, "در حال بازیابی اطلاعات سؤالات...", "Loading questions dataset...")}</h2>
          <p>{t(locale, "لطفاً چند لحظه صبر نمایید.", "Please wait while records are fetched.")}</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className={styles.stateContainer} role="alert">
          <h2>{t(locale, "خطا در بارگذاری اطلاعات", "Data Fetch Error")}</h2>
          <p style={{ color: "var(--color-error-text)" }}>{error}</p>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => setRefreshKey((k) => k + 1)}
          >
            {t(locale, "تلاش مجدد", "Retry")}
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && questions.length === 0 && (
        <div className={styles.stateContainer}>
          <h2>{t(locale, "سؤالی مطابق با فیلترهای انتخابی یافت نشد.", "No questions matched the selected criteria.")}</h2>
          <p>
            {t(
              locale,
              "می‌توانید فیلترها را ریست کنید یا از دکمه «واردسازی سؤال» برای ثبت سؤال جدید استفاده نمایید.",
              "Try resetting filters or click 'Import Questions' to load new items.",
            )}
          </p>
        </div>
      )}

      {/* Question Cards Grid */}
      {!loading && !error && questions.length > 0 && (
        <div className={styles.questionList}>
          {questions.map((item) => {
            const options = item.learner_payload?.options;
            const currentResponse = responses[item.id] ?? "";
            const isChecking = checkingIds[item.id] ?? false;
            const checkResult = checkResults[item.id];
            const checkError = checkErrors[item.id];

            const statusClass =
              item.status === "draft"
                ? styles.badgeStatusDraft
                : item.status === "in_review"
                  ? styles.badgeStatusReview
                  : item.status === "published"
                    ? styles.badgeStatusPublished
                    : styles.badgeStatusRetired;

            return (
              <article key={item.id} className={styles.questionCard}>
                {/* Card Header & Badges */}
                <div className={styles.questionCardHeader}>
                  <div className={styles.badgeRow}>
                    <span className={`${styles.badgeStatus} ${statusClass}`}>
                      {item.status === "draft" && t(locale, "پیش‌نویس", "Draft")}
                      {item.status === "in_review" && t(locale, "در حال بازبینی", "In Review")}
                      {item.status === "published" && t(locale, "منتشرشده", "Published")}
                      {item.status === "retired" && t(locale, "بایگانی / منسوخ", "Retired")}
                    </span>

                    <span className={styles.badgeVersion}>v{item.version_number}</span>
                    <span className={styles.badgeCefr}>{item.cefr_level}</span>
                    <span className={styles.badgeDifficulty}>
                      {t(locale, "سختی", "Diff")} {item.difficulty}/5
                    </span>
                    <span className={styles.badgeType}>{item.question_type}</span>

                    {item.source_origin && (
                      <span className={styles.badgeLicense}>
                        {item.source_origin === "original" && "🛡️ Endoora Original"}
                        {item.source_origin === "licensed" && "📜 Licensed"}
                        {item.source_origin === "public_domain" && "🌐 Public Domain"}
                        {item.source_origin === "ai_assisted" && "🤖 AI+Human"}
                        {item.rights_holder ? ` (${item.rights_holder})` : ""}
                      </span>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className={styles.actionButtonGroup}>
                    {mode === "governance" && (
                      <button
                        type="button"
                        className={styles.btnActionSmall}
                        onClick={() => setInspectItem(item)}
                      >
                        {t(locale, "مشاهده ممیزی و کلید پاسخ", "Audit & Answer Key")}
                      </button>
                    )}

                    {item.status === "draft" && (
                      <button
                        type="button"
                        className={`${styles.btnActionSmall} ${styles.btnActionReview}`}
                        onClick={() => setReviewModalItem(item)}
                      >
                        {t(locale, "ارسال به بازبینی", "Submit for Review")}
                      </button>
                    )}

                    {item.status === "in_review" && (
                      <button
                        type="button"
                        className={`${styles.btnActionSmall} ${styles.btnActionPublish}`}
                        onClick={() => handlePublish(item)}
                        disabled={actionLoading}
                      >
                        {t(locale, "نشر رسمی", "Publish")}
                      </button>
                    )}

                    {item.status === "published" && (
                      <button
                        type="button"
                        className={`${styles.btnActionSmall} ${styles.btnActionRetire}`}
                        onClick={() => setRetireModalItem(item)}
                      >
                        {t(locale, "بایگانی / بازنشستگی", "Retire Version")}
                      </button>
                    )}
                  </div>
                </div>

                {/* Title & Slug */}
                <div className={styles.questionTitleRow}>
                  <h2 className={styles.questionTitle}>
                    {isFa
                      ? item.title_fa || item.display_title || item.title_en || item.question_slug
                      : item.title_en || item.display_title || item.title_fa || item.question_slug}
                  </h2>
                  <div className={styles.questionSlug}>
                    {item.question_slug}
                  </div>
                </div>

                {/* Persian and English Prompts */}
                {item.prompt_fa && isFa && (
                  <p className={styles.promptPersian}>{item.prompt_fa}</p>
                )}

                <div className={styles.promptEnglish} lang="en" dir="ltr">
                  {item.prompt_en}
                </div>

                {/* Objectives */}
                {item.objectives && item.objectives.length > 0 && (
                  <div className={styles.objectivesList}>
                    <span style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>
                      {t(locale, "اهداف یادگیری مرتبط:", "Taxonomy Objectives:")}
                    </span>
                    {item.objectives.map((obj) => (
                      <Link
                        key={obj.id}
                        href={`/operations/taxonomy?q=${obj.slug}`}
                        className={`${styles.objectiveTag} ${obj.is_primary ? styles.objectivePrimary : ""}`}
                        title={t(locale, "مشاهده در تاکسونومی", "View in Taxonomy")}
                      >
                        {isFa ? obj.label_fa : obj.label_en}
                        <code style={{ fontSize: "0.72rem" }}>({obj.slug})</code>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Two-person Gate Bar */}
                {mode === "governance" && (
                  <div className={styles.twoPersonBar}>
                    <span className={styles.personTag}>
                      {t(locale, "مؤلف نسخه:", "Author:")}{" "}
                      <span className={styles.personValue}>{item.author_email || item.author_id || "System"}</span>
                    </span>
                    <span className={styles.personTag}>
                      {t(locale, "بازبین مسئول:", "Reviewer:")}{" "}
                      <span className={styles.personValue}>
                        {item.reviewer_email || item.reviewer_id || t(locale, "در انتظار بازبینی", "Pending")}
                      </span>
                    </span>
                    {item.published_at && (
                      <span className={styles.personTag}>
                        {t(locale, "تاریخ انتشار:", "Published:")}{" "}
                        <span className={styles.personValue}>{new Date(item.published_at).toLocaleDateString()}</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Learner Simulator (Active in Learner Safe Mode or on Demand) */}
                {mode === "learner_safe" && (
                  <div className={styles.simulatorArea}>

                    <div className={styles.simulatorTitle}>
                      {t(locale, "آزمایش پاسخ‌دهی شبیه‌ساز یادگیرنده (بدون افشای کلید پیش از ارسال):", "Learner Simulator Test (Isolated Pre-Submission):")}
                    </div>

                    {Array.isArray(options) && options.length > 0 ? (
                      <div className={styles.optionList} role="radiogroup" aria-label="Choices">
                        {options.map((opt) => (
                          <label key={opt.id} className={styles.optionItem} dir="ltr">
                            <input
                              type="radio"
                              name={`sim-${item.id}`}
                              value={opt.id}
                              checked={currentResponse === opt.id}
                              onChange={(e) =>
                                setResponses((prev) => ({ ...prev, [item.id]: e.target.value }))
                              }
                            />
                            <span>{opt.text || opt.label || opt.id}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <input
                        type="text"
                        className={styles.textInputSimulator}
                        value={currentResponse}
                        onChange={(e) =>
                          setResponses((prev) => ({ ...prev, [item.id]: e.target.value }))
                        }
                        placeholder={t(locale, "پاسخ خود را به انگلیسی وارد کنید...", "Type your English answer...")}
                      />
                    )}

                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <button
                        type="button"
                        className={styles.btnPrimary}
                        disabled={isChecking || !currentResponse}
                        onClick={() => handleCheckAnswer(item)}
                      >
                        {isChecking ? t(locale, "در حال بررسی...", "Checking...") : t(locale, "ارسال و تصحیح پاسخ", "Check Answer")}
                      </button>
                    </div>

                    {checkError && (
                      <div className={styles.feedbackIncorrect} role="alert">
                        {checkError}
                      </div>
                    )}

                    {checkResult && (
                      <div
                        className={
                          checkResult.correct
                            ? styles.feedbackCorrect
                            : checkResult.status === "manual_review_required"
                              ? styles.feedbackManual
                              : styles.feedbackIncorrect
                        }
                      >
                        <p style={{ margin: "0 0 4px 0", fontWeight: 700 }}>
                          {checkResult.correct === true && t(locale, "✓ پاسخ درست است!", "✓ Correct answer!")}
                          {checkResult.correct === false && t(locale, "✗ پاسخ نادرست است.", "✗ Incorrect answer.")}
                          {checkResult.status === "manual_review_required" &&
                            t(locale, "نیازمند ارزیابی کیفی طبق روبریک استاندارد.", "Requires qualitative assessment per rubric.")}
                        </p>
                        {checkResult.explanation && (
                          <p style={{ margin: 0, fontSize: "0.85rem" }}>
                            <strong>{t(locale, "توضیح آموزشی:", "Pedagogical Explanation:")}</strong> {checkResult.explanation}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Governance Drawer: Protected Answer Key & Audit Log */}
      {inspectItem && (
        <div className={styles.drawerOverlay} onClick={() => setInspectItem(null)}>
          <div className={styles.drawerContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitle}>
                {t(locale, "ممیزی حاکمیتی و کلید پاسخ", "Governance Audit & Answer Key")}
              </h2>
              <button
                type="button"
                className={styles.btnCloseDrawer}
                onClick={() => setInspectItem(null)}
              >
                ✕
              </button>
            </div>

            <div>
              <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700 }}>
                {inspectItem.question_slug} (v{inspectItem.version_number})
              </p>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "var(--color-muted)" }}>
                UUID: {inspectItem.id}
              </p>
            </div>

            {/* Immutability Content Hash */}
            <div className={styles.protectedSection}>
              <div className={styles.protectedSectionTitle}>
                {t(locale, "چک‌سام محتوا (SHA-256 Content Hash):", "SHA-256 Immutability Checksum:")}
              </div>
              <pre className={styles.codeBlock}>{inspectItem.content_hash || t(locale, "هنوز محاسبه نشده (در وضعیت پیش‌نویس)", "Unpublished draft")}</pre>
            </div>

            {/* Answer Key */}
            <div className={styles.protectedSection}>
              <div className={styles.protectedSectionTitle}>
                {t(locale, "کلید پاسخ رسمی (Answer Key):", "Official Answer Key (Protected):")}
              </div>
              <pre className={styles.codeBlock}>
                {JSON.stringify(inspectItem.answer_key, null, 2)}
              </pre>
            </div>

            {/* Accepted Variants */}
            {inspectItem.accepted_variants && inspectItem.accepted_variants.length > 0 && (
              <div className={styles.protectedSection}>
                <div className={styles.protectedSectionTitle}>
                  {t(locale, "پاسخ‌های جایگزین پذیرفته‌شده:", "Accepted Variants:")}
                </div>
                <pre className={styles.codeBlock}>
                  {JSON.stringify(inspectItem.accepted_variants, null, 2)}
                </pre>
              </div>
            )}

            {/* Rubric */}
            {inspectItem.rubric && Object.keys(inspectItem.rubric).length > 0 && (
              <div className={styles.protectedSection}>
                <div className={styles.protectedSectionTitle}>
                  {t(locale, "روبریک ارزیابی کیفی:", "Qualitative Evaluation Rubric:")}
                </div>
                <pre className={styles.codeBlock}>
                  {JSON.stringify(inspectItem.rubric, null, 2)}
                </pre>
              </div>
            )}

            {/* Explanations */}
            <div className={styles.protectedSection}>
              <div className={styles.protectedSectionTitle}>
                {t(locale, "توضیح آموزشی (فارسی و انگلیسی):", "Pedagogical Explanations:")}
              </div>
              {inspectItem.explanation_fa && (
                <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem" }}>
                  <strong>فارسی:</strong> {inspectItem.explanation_fa}
                </p>
              )}
              {inspectItem.explanation_en && (
                <p style={{ margin: 0, fontSize: "0.85rem" }} dir="ltr">
                  <strong>English:</strong> {inspectItem.explanation_en}
                </p>
              )}
            </div>

            {/* Review Audit Events Timeline */}
            <div className={styles.protectedSection}>
              <div className={styles.protectedSectionTitle}>
                {t(locale, "تاریخچه رویدادهای بازبینی (Audit Trail):", "Review Event History (Audit Trail):")}
              </div>
              {inspectItem.reviews && inspectItem.reviews.length > 0 ? (
                <div className={styles.auditTimeline}>
                  {inspectItem.reviews.map((rev) => (
                    <div key={rev.id} className={styles.auditItem}>
                      <div className={styles.auditHeader}>
                        <span>{rev.decision}</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>
                          {new Date(rev.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>
                        {t(locale, "توسط:", "By:")} {rev.reviewer_email || "System"}
                      </div>
                      {rev.note && <p className={styles.auditNote}>{rev.note}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-muted)" }}>
                  {t(locale, "هیچ رویداد بازبینی ثبت نشده است.", "No review events recorded.")}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submit for Review Modal */}
      {reviewModalItem && (
        <div className={styles.modalOverlay} onClick={() => setReviewModalItem(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>
              {t(locale, "ارسال سؤال به چرخه بازبینی (Submit for Review)", "Submit Question for Review")}
            </h3>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--color-muted)" }}>
              {reviewModalItem.question_slug} (v{reviewModalItem.version_number})
            </p>

            <textarea
              className={styles.modalTextarea}
              placeholder={t(locale, "یادداشت ویرایشی برای بازبین بنویسید (اختیاری)...", "Write an editorial note for the reviewer (optional)...")}
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
            />

            {actionError && (
              <p style={{ color: "var(--color-error-text)", fontSize: "0.85rem", margin: 0 }}>
                {actionError}
              </p>
            )}

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => setReviewModalItem(null)}
              >
                {t(locale, "انصراف", "Cancel")}
              </button>
              <button
                type="button"
                className={styles.btnPrimary}
                disabled={actionLoading}
                onClick={handleSubmitForReview}
              >
                {actionLoading ? t(locale, "در حال ثبت...", "Submitting...") : t(locale, "تأیید و ارسال به صف بازبینی", "Submit to Review Queue")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Retire Modal */}
      {retireModalItem && (
        <div className={styles.modalOverlay} onClick={() => setRetireModalItem(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>
              {t(locale, "بایگانی / بازنشستگی نسخه سؤال (Retire)", "Retire Question Version")}
            </h3>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--color-muted)" }}>
              {retireModalItem.question_slug} (v{retireModalItem.version_number})
            </p>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--color-warning-text)" }}>
              {t(
                locale,
                "توجه: نسخه‌های بازنشسته حذف نمی‌شوند تا رکوردهای آموزشی داوطلبان حفظ گردد، اما دیگر برای یادگیرندگان نمایش داده نخواهند شد.",
                "Note: Retired versions are not deleted so learner historical attempts remain valid, but they will be hidden from new practice sessions.",
              )}
            </p>

            <textarea
              className={styles.modalTextarea}
              placeholder={t(locale, "دلیل بازنشستگی / شناسه جایگزین را درج کنید...", "Enter reason for retirement / replacement slug...")}
              value={retireNote}
              onChange={(e) => setRetireNote(e.target.value)}
            />

            {actionError && (
              <p style={{ color: "var(--color-error-text)", fontSize: "0.85rem", margin: 0 }}>
                {actionError}
              </p>
            )}

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => setRetireModalItem(null)}
              >
                {t(locale, "انصراف", "Cancel")}
              </button>
              <button
                type="button"
                className={`${styles.btnPrimary} ${styles.btnActionRetire}`}
                disabled={actionLoading}
                onClick={handleRetire}
              >
                {actionLoading ? t(locale, "در حال بایگانی...", "Retiring...") : t(locale, "تأیید بازنشستگی", "Confirm Retirement")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import JSON Modal */}
      {importModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setImportModalOpen(false)}>
          <div className={styles.modalBox} style={{ inlineSize: "min(700px, 100%)" }} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>
              {t(locale, "واردسازی سؤالات از سند استاندارد JSON", "Import Questions from JSON Document")}
            </h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-muted)" }}>
              {t(
                locale,
                "سند باید دارای نسخه ریشه ('version') و آرایه اقلام ('items') مطابق مشخصات روز ۱۳ باشد. سؤالات وارد شده در حالت پیش‌نویس قرار می‌گیرند.",
                "JSON must include a root 'version' string and 'items' array per Day 13 specifications. Imported questions start as draft.",
              )}
            </p>

            <textarea
              className={styles.modalTextarea}
              style={{ minHeight: "220px", fontFamily: "monospace", fontSize: "0.8rem", direction: "ltr" }}
              placeholder='{\n  "version": "endoora-import-v1",\n  "items": [\n    {\n      "slug": "sample-a1-gap",\n      "version_number": 1,\n      "question_type": "gap",\n      "prompt_en": "I ___ a student.",\n      "cefr_level": "A1",\n      "difficulty": 1,\n      "objective_slugs": ["objective-reading-gist-a1"],\n      "source": {\n        "origin": "original",\n        "license_type": "original",\n        "title": "Endoora Grammar Set"\n      }\n    }\n  ]\n}'
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
            />

            {importError && (
              <pre className={styles.feedbackIncorrect} style={{ whiteSpace: "pre-wrap", fontSize: "0.8rem" }}>
                {importError}
              </pre>
            )}

            {importSuccess && (
              <div className={styles.feedbackCorrect}>
                {importSuccess}
              </div>
            )}

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => {
                  setImportModalOpen(false);
                  setImportError(null);
                  setImportSuccess(null);
                }}
              >
                {t(locale, "بستن", "Close")}
              </button>
              <button
                type="button"
                className={styles.btnPrimary}
                disabled={!importJsonText.trim()}
                onClick={handleImport}
              >
                {t(locale, "بررسی و واردسازی", "Validate & Import")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

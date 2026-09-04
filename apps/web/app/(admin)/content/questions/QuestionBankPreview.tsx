"use client";

import { useEffect, useState } from "react";
import styles from "./question-bank.module.css";

type Locale = "fa" | "en";

type ChoiceOption = {
  id: string;
  text?: string;
  label?: string;
};

type QuestionSummary = {
  id: string;
  question_id: string;
  question_slug: string;
  version_number: number;
  question_type: string;
  display_title: string;
  display_instructions: string;
  prompt_fa: string;
  prompt_en: string;
  cefr_level: string;
  difficulty: number;
  learner_payload: {
    options?: ChoiceOption[];
    [key: string]: unknown;
  };
  objectives: Array<{
    id: string;
    slug: string;
    label_fa: string;
    label_en: string;
    is_primary: boolean;
  }>;
};

type ListResponse = {
  count: number;
  results: QuestionSummary[];
};

type CheckResponse = {
  status: "scored" | "manual_review_required";
  correct: boolean | null;
  explanation: string;
  question_version_id: string;
  rubric?: Record<string, unknown>;
};

function t(locale: Locale, fa: string, en: string) {
  return locale === "fa" ? fa : en;
}

export function QuestionBankPreview() {
  const [locale, setLocale] = useState<Locale>("fa");
  const [data, setData] = useState<ListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [cefrFilter, setCefrFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [responses, setResponses] = useState<Record<string, string>>({});
  const [checkResults, setCheckResults] = useState<Record<string, CheckResponse>>({});
  const [checkingIds, setCheckingIds] = useState<Record<string, boolean>>({});
  const [checkErrors, setCheckErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const controller = new AbortController();

    async function fetchQuestions() {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        lang: locale,
        per_page: "50",
      });
      if (cefrFilter !== "all") params.set("cefr", cefrFilter);
      if (typeFilter !== "all") params.set("type", typeFilter);

      try {
        const response = await fetch(
          `/api/questions/published/?${params.toString()}`,
          {
            credentials: "include",
            cache: "no-store",
            signal: controller.signal,
          },
        );

        if (response.status === 401 || response.status === 403) {
          setError(
            t(
              locale,
              "برای دیدن پیش‌نمایش بانک سؤال باید با نقش ویرایشگر محتوا یا مدیر وارد شوید.",
              "Sign in as a content editor or administrator to preview the question bank.",
            ),
          );
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        setData((await response.json()) as ListResponse);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setError(
          t(
            locale,
            "بارگذاری بانک سؤال ناموفق بود. اتصال API را بررسی و دوباره تلاش کنید.",
            "Question bank could not be loaded. Check the API connection and retry.",
          ),
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void fetchQuestions();

    return () => controller.abort();
  }, [locale, cefrFilter, typeFilter]);

  async function handleCheckAnswer(questionId: string) {
    const userResponse = responses[questionId];
    if (!userResponse || !userResponse.trim()) {
      setCheckErrors((prev) => ({
        ...prev,
        [questionId]: t(locale, "لطفاً ابتدا پاسخ را مشخص کنید.", "Please enter a response first."),
      }));
      return;
    }

    setCheckingIds((prev) => ({ ...prev, [questionId]: true }));
    setCheckErrors((prev) => ({ ...prev, [questionId]: "" }));

    try {
      const res = await fetch(
        `/api/questions/published/${questionId}/check/?lang=${locale}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ response: userResponse.trim() }),
        },
      );

      if (!res.ok) {
        const errJson = (await res.json().catch(() => ({}))) as { detail?: string };
        throw new Error(errJson.detail || `HTTP ${res.status}`);
      }

      const result = (await res.json()) as CheckResponse;
      setCheckResults((prev) => ({ ...prev, [questionId]: result }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setCheckErrors((prev) => ({
        ...prev,
        [questionId]: t(
          locale,
          `خطا در بررسی پاسخ: ${msg}`,
          `Error checking answer: ${msg}`,
        ),
      }));
    } finally {
      setCheckingIds((prev) => ({ ...prev, [questionId]: false }));
    }
  }

  const filteredQuestions = (data?.results ?? []).filter((q) => {
    if (!searchQuery.trim()) return true;
    const qTerm = searchQuery.toLowerCase();
    return (
      q.display_title?.toLowerCase().includes(qTerm) ||
      q.question_slug.toLowerCase().includes(qTerm) ||
      q.prompt_en.toLowerCase().includes(qTerm) ||
      q.prompt_fa?.toLowerCase().includes(qTerm)
    );
  });

  return (
    <main className={styles.page} lang={locale} dir={locale === "fa" ? "rtl" : "ltr"}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Endoora Operations</p>
          <h1>{t(locale, "بانک سؤال نسخه‌بندی‌شده", "Versioned question bank")}</h1>
          <p className={styles.muted}>
            {t(
              locale,
              "این پیش‌نمایش فقط داده‌های مجاز قبل از ارسال پاسخ را نشان می‌دهد.",
              "This preview shows only learner-safe fields available before submission.",
            )}
          </p>
        </div>
        <div className={styles.language} aria-label={t(locale, "زبان رابط", "Interface language")}>
          <button type="button" aria-pressed={locale === "fa"} onClick={() => setLocale("fa")}>
            فارسی
          </button>
          <button type="button" aria-pressed={locale === "en"} onClick={() => setLocale("en")}>
            English
          </button>
        </div>
      </header>

      <section className={styles.safety} aria-labelledby="question-safety-title">
        <h2 id="question-safety-title">
          {t(locale, "مرز امنیت پاسخ‌ها", "Answer-key security boundary")}
        </h2>
        <p>
          {t(
            locale,
            "کلید پاسخ، پاسخ‌های پذیرفته‌شده، روبریک و توضیح پاسخ در این درخواست قبل از ارسال نمایش داده نمی‌شوند.",
            "Answer keys, accepted variants, rubrics, and explanations are not included in this pre-submission request.",
          )}
        </p>
      </section>

      <section className={styles.filters} aria-label={t(locale, "فیلترهای بانک سؤال", "Question bank filters")}>
        <div className={styles.filterGroup}>
          <label htmlFor="search-input">{t(locale, "جستجو:", "Search:")}</label>
          <input
            id="search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t(locale, "عنوان، متن سؤال، یا شناسه…", "Title, prompt, or slug…")}
            className={styles.filterInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="cefr-select">{t(locale, "سطح CEFR:", "CEFR Level:")}</label>
          <select
            id="cefr-select"
            value={cefrFilter}
            onChange={(e) => setCefrFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">{t(locale, "همه سطوح", "All Levels")}</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
            <option value="C2">C2</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="type-select">{t(locale, "نوع سؤال:", "Question Type:")}</label>
          <select
            id="type-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">{t(locale, "همه انواع", "All Types")}</option>
            <option value="mcq">{t(locale, "چندگزینه‌ای", "Multiple Choice")}</option>
            <option value="multi_select">{t(locale, "چندانتخابی", "Multi-select")}</option>
            <option value="short_answer">{t(locale, "پاسخ کوتاه", "Short Answer")}</option>
            <option value="gap">{t(locale, "جای‌خالی", "Gap Fill")}</option>
            <option value="matching">{t(locale, "تطبیق", "Matching")}</option>
            <option value="ordering">{t(locale, "مرتب‌سازی", "Ordering")}</option>
            <option value="long_writing">{t(locale, "نوشتار بلند", "Long Writing")}</option>
            <option value="audio">{t(locale, "پرسش صوتی", "Audio Prompt")}</option>
            <option value="speaking">{t(locale, "پرسش گفتاری", "Speaking Prompt")}</option>
          </select>
        </div>
      </section>

      {loading && (
        <section className={styles.state} role="status" aria-live="polite">
          {t(locale, "در حال بارگذاری…", "Loading…")}
        </section>
      )}

      {error && (
        <section className={styles.state} role="alert">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
          >
            {t(locale, "تلاش دوباره", "Retry")}
          </button>
        </section>
      )}

      {!loading && !error && filteredQuestions.length === 0 && (
        <section className={styles.state}>
          <h2>{t(locale, "سؤالی یافت نشد", "No questions found")}</h2>
          <p>
            {t(
              locale,
              "سؤال‌های واردشده عمداً در حالت پیش‌نویس می‌مانند تا بازبینی و مجوز نشر کامل شود.",
              "Imported questions intentionally remain drafts until review and rights checks are complete.",
            )}
          </p>
        </section>
      )}

      {!loading && !error && filteredQuestions.length > 0 && (
        <section className={styles.grid} aria-label={t(locale, "سؤال‌های منتشرشده", "Published questions")}>
          {filteredQuestions.map((question) => {
            const currentResponse = responses[question.id] ?? "";
            const isChecking = checkingIds[question.id] ?? false;
            const checkResult = checkResults[question.id];
            const checkError = checkErrors[question.id];
            const options = question.learner_payload?.options;

            return (
              <article className={styles.card} key={question.id}>
                <div className={styles.meta}>
                  <span>{question.cefr_level}</span>
                  <span>{t(locale, "سختی", "Difficulty")} {question.difficulty}/5</span>
                  <span dir="ltr">{question.question_type}</span>
                  <span dir="ltr">v{question.version_number}</span>
                </div>

                <h2>{question.display_title || question.question_slug}</h2>
                {question.display_instructions && (
                  <p className={styles.instructions}>{question.display_instructions}</p>
                )}

                {question.prompt_fa && locale === "fa" && (
                  <p className={styles.persianPrompt}>{question.prompt_fa}</p>
                )}

                <div className={styles.englishContent} dir="ltr" lang="en">
                  {question.prompt_en}
                </div>

                <div className={styles.interactiveArea}>
                  <h3 className={styles.interactiveTitle}>
                    {t(locale, "آزمایش پاسخ‌دهی (شبیه‌ساز یادگیرنده):", "Answer Test (Learner Simulator):")}
                  </h3>

                  {Array.isArray(options) && options.length > 0 ? (
                    <div className={styles.optionGroup} role="radiogroup" aria-label={question.display_title || "Options"}>
                      {options.map((opt) => (
                        <label key={opt.id} className={styles.optionLabel} dir="ltr">
                          <input
                            type="radio"
                            name={`opt-${question.id}`}
                            value={opt.id}
                            checked={currentResponse === opt.id}
                            onChange={(e) =>
                              setResponses((prev) => ({ ...prev, [question.id]: e.target.value }))
                            }
                          />
                          <span>{opt.text || opt.label || opt.id}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.inputGroup}>
                      <input
                        type="text"
                        dir="ltr"
                        className={styles.textInput}
                        value={currentResponse}
                        onChange={(e) =>
                          setResponses((prev) => ({ ...prev, [question.id]: e.target.value }))
                        }
                        placeholder={t(locale, "پاسخ انگلیسی را تایپ کنید…", "Type your English answer…")}
                      />
                    </div>
                  )}

                  <div className={styles.actionRow}>
                    <button
                      type="button"
                      className={styles.checkButton}
                      disabled={isChecking || !currentResponse}
                      onClick={() => handleCheckAnswer(question.id)}
                    >
                      {isChecking
                        ? t(locale, "در حال بررسی…", "Checking…")
                        : t(locale, "ارسال و بررسی پاسخ", "Check answer")}
                    </button>
                  </div>

                  {checkError && (
                    <div className={styles.resultError} role="alert">
                      {checkError}
                    </div>
                  )}

                  {checkResult && (
                    <div
                      className={
                        checkResult.correct
                          ? styles.resultSuccess
                          : checkResult.status === "manual_review_required"
                            ? styles.resultInfo
                            : styles.resultWarning
                      }
                      role="status"
                    >
                      <p className={styles.resultStatusText}>
                        {checkResult.correct === true && t(locale, "✓ پاسخ درست است!", "✓ Correct answer!")}
                        {checkResult.correct === false && t(locale, "✗ پاسخ نادرست است.", "✗ Incorrect answer.")}
                        {checkResult.status === "manual_review_required" &&
                          t(locale, "این سؤال نیازمند ارزیابی کیفی بر اساس روبریک است.", "Requires manual qualitative review.")}
                      </p>
                      {checkResult.explanation && (
                        <p className={styles.resultExplanation}>
                          <strong>{t(locale, "توضیح آموزشی:", "Explanation:")}</strong> {checkResult.explanation}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <details>
                  <summary>{t(locale, "هدف‌های یادگیری", "Learning objectives")}</summary>
                  <ul>
                    {question.objectives.map((objective) => (
                      <li key={objective.id}>
                        {locale === "fa" ? objective.label_fa : objective.label_en}
                        <code>{objective.slug}</code>
                      </li>
                    ))}
                  </ul>
                </details>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

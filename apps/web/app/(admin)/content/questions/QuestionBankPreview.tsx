"use client";
import { useEffect, useState } from "react";
import styles from "./question-bank.module.css";

type Locale = "fa" | "en";

type QuestionSummary = {
  id: string;
  question_slug: string;
  version_number: number;
  question_type: string;
  display_title: string;
  display_instructions: string;
  prompt_fa: string;
  prompt_en: string;
  cefr_level: string;
  difficulty: number;
  learner_payload: Record<string, unknown>;
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

function t(locale: Locale, fa: string, en: string) {
  return locale === "fa" ? fa : en;
}

export function QuestionBankPreview() {
  const [locale, setLocale] = useState<Locale>("fa");
  const [data, setData] = useState<ListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
  const controller = new AbortController();

  async function fetchQuestions() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/questions/published/?lang=${locale}&per_page=20`,
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
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
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
}, [locale]);

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

      {!loading && !error && data?.count === 0 && (
        <section className={styles.state}>
          <h2>{t(locale, "هنوز سؤال منتشرشده‌ای نیست", "No published questions yet")}</h2>
          <p>
            {t(
              locale,
              "سؤال‌های واردشده عمداً در حالت پیش‌نویس می‌مانند تا بازبینی و مجوز نشر کامل شود.",
              "Imported questions intentionally remain drafts until review and rights checks are complete.",
            )}
          </p>
        </section>
      )}

      {!loading && !error && data && data.results.length > 0 && (
        <section className={styles.grid} aria-label={t(locale, "سؤال‌های منتشرشده", "Published questions")}>
          {data.results.map((question) => (
            <article className={styles.card} key={question.id}>
              <div className={styles.meta}>
                <span>{question.cefr_level}</span>
                <span>{t(locale, "سختی", "Difficulty")} {question.difficulty}/5</span>
                <span dir="ltr">{question.question_type}</span>
                <span dir="ltr">v{question.version_number}</span>
              </div>
              <h2>{question.display_title || question.question_slug}</h2>
              {question.display_instructions && <p>{question.display_instructions}</p>}
              {question.prompt_fa && locale === "fa" && <p>{question.prompt_fa}</p>}
              <div className={styles.englishContent} dir="ltr" lang="en">
                {question.prompt_en}
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
          ))}
        </section>
      )}
    </main>
  );
}

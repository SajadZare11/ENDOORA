"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./lesson-cms.module.css";

interface QuizItem {
  promptFa: string;
  promptEn: string;
  options: string[];
  correctIndex: number;
  explanationFa: string;
}

interface LessonData {
  id: string;
  courseSlug: string;
  courseTitleFa: string;
  titleFa: string;
  titleEn: string;
  durationMinutes: number;
  isFreePreview: boolean;
  contentBodyFa: string;
  contentBodyEn: string;
  videoUrl?: string;
  audioUrl?: string;
  transcriptFa?: string;
  quiz?: QuizItem;
  downloads?: Array<{ title: string; size: string }>;
  author: string;
}

export function LessonPlayer({ lesson }: { lesson: LessonData }) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [completed, setCompleted] = useState(false);

  const isLocked = !lesson.isFreePreview;

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (lesson.quiz && idx === lesson.quiz.correctIndex) {
      setCompleted(true);
    }
  };

  return (
    <div className={styles.container} dir="rtl">
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs} aria-label="مسیر صفحه">
        <Link href="/courses">دوره‌ها</Link>
        <span>/</span>
        <Link href={`/courses/${lesson.courseSlug}`}>{lesson.courseTitleFa}</Link>
        <span>/</span>
        <span>{lesson.titleFa}</span>
      </nav>

      <header className={styles.lessonHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
          {lesson.isFreePreview ? (
            <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-learning-teal)", background: "var(--color-surface-subtle)", padding: "0.2rem 0.6rem", borderRadius: "var(--radius-pill)" }}>
              ✓ جلسه پیش‌نمایش رایگان
            </span>
          ) : (
            <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-achievement-amber)", background: "var(--color-surface-subtle)", padding: "0.2rem 0.6rem", borderRadius: "var(--radius-pill)" }}>
              🔒 اشتراک ویژه
            </span>
          )}
          <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>
            ⏱️ {lesson.durationMinutes} دقیقه
          </span>
        </div>
        <h1 className={styles.lessonTitleFa}>{lesson.titleFa}</h1>
        <div className={styles.lessonTitleEn}>{lesson.titleEn}</div>
      </header>

      {/* Media Player or Paywall Notice */}
      {isLocked ? (
        <section className={styles.paywallCard} aria-label="قفل اشتراک ویژه">
          <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-2)" }}>🔒</div>
          <h2 className={styles.paywallTitle}>این درس ویژه اعضای اشتراک اندورا است</h2>
          <p className={styles.paywallDesc}>
            برای دسترسی نامحدود به تمام جلسات ویدئویی، آزمون‌های سنجشی، جزوات قابل دانلود و تمرین‌های تعاملی، اشتراک ویژه اندورا را فعال کنید.
          </p>
          <div className={styles.paywallPrice}>
            اشتراک ۳ ماهه (۹۰ روزه): ۴۲۰٬۰۰۰ تومان
          </div>
          <Link href="/account/plan" className={styles.paywallCta}>
            ارتقا به اشتراک ویژه و شروع یادگیری ←
          </Link>
        </section>
      ) : (
        <section className={styles.mediaBox} aria-label="پخش‌کننده ویدئو آموزشی">
          <div className={styles.playerPlaceholder}>
            <span style={{ fontSize: "3rem", marginBottom: "var(--space-2)" }}>▶️</span>
            <strong>پخش ویدئوی آموزشی تعاملی</strong>
            <span style={{ fontSize: "var(--font-size-small)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>
              کیفیت تطبیقی با اینترنت ایران (Full HD / 720p)
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-4)" }}>
            <button
              type="button"
              onClick={() => setShowTranscript(!showTranscript)}
              style={{
                padding: "var(--space-2) var(--space-4)",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-control)",
                fontSize: "var(--font-size-small)",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {showTranscript ? "مخفی‌سازی متن و زیرنویس" : "نمایش متن و زیرنویس فارسی"}
            </button>
          </div>

          {showTranscript && (
            <div style={{ marginTop: "var(--space-4)", padding: "var(--space-4)", background: "var(--color-surface)", borderRadius: "var(--radius-control)", textAlign: "start", fontSize: "var(--font-size-small)", lineHeight: "var(--line-height-body)" }}>
              <strong>متن درس: </strong>{lesson.transcriptFa || "متن و رونویسی رسمی این جلسه در حال آماده‌سازی است."}
            </div>
          )}
        </section>
      )}

      {/* Lesson Body Content */}
      <article className={styles.contentReader}>
        <div dangerouslySetInnerHTML={{ __html: lesson.contentBodyFa.replace(/\n/g, "<br/>") }} />
        {lesson.contentBodyEn && (
          <div className={styles.englishBox}>
            <div dangerouslySetInnerHTML={{ __html: lesson.contentBodyEn.replace(/\n/g, "<br/>") }} />
          </div>
        )}
      </article>

      {/* Formative Quiz (Only available when not locked) */}
      {!isLocked && lesson.quiz && (
        <section className={styles.quizCard} aria-label="آزمون سنجش یادگیری">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
            <h2 className={styles.quizTitle}>آزمون سنجش این درس</h2>
            {completed && (
              <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-learning-teal)" }}>
                ✓ تکمیل شد (+۲۵ XP)
              </span>
            )}
          </div>

          <p style={{ fontWeight: 600, marginBottom: "var(--space-3)" }}>{lesson.quiz.promptFa}</p>
          <div style={{ fontSize: "var(--font-size-small)", color: "var(--color-text-muted)", direction: "ltr", textAlign: "right", fontFamily: "var(--font-family-latin)", marginBottom: "var(--space-4)" }}>
            {lesson.quiz.promptEn}
          </div>

          <div className={styles.optionsGrid}>
            {lesson.quiz.options.map((opt, idx) => {
              let optClass = styles.optionBtn;
              if (selectedOption !== null) {
                if (idx === lesson.quiz?.correctIndex) {
                  optClass = `${styles.optionBtn} ${styles.optionCorrect}`;
                } else if (idx === selectedOption) {
                  optClass = `${styles.optionBtn} ${styles.optionIncorrect}`;
                }
              }
              return (
                <button
                  key={idx}
                  type="button"
                  className={optClass}
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedOption !== null}
                >
                  <span style={{ marginInlineEnd: "var(--space-2)" }}>{idx + 1}.</span> {opt}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div className={styles.quizFeedback}>
              <strong>تحلیل پاسخ: </strong>{lesson.quiz.explanationFa}
            </div>
          )}
        </section>
      )}

      {/* Downloadable Resources */}
      {lesson.downloads && lesson.downloads.length > 0 && !isLocked && (
        <section style={{ marginBlockEnd: "var(--space-6)" }}>
          <h3 style={{ fontSize: "var(--font-size-body)", fontWeight: 700, marginBottom: "var(--space-3)" }}>
            فایل‌های ضمیمه و کاربرگ‌ها
          </h3>
          <div className={styles.downloadsList}>
            {lesson.downloads.map((dl, dIdx) => (
              <div key={dIdx} className={styles.downloadItem}>
                <span>📄 {dl.title} ({dl.size})</span>
                <span style={{ color: "var(--color-action)", fontWeight: 600 }}>دانلود فایل ↓</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Navigation Footer */}
      <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-4)", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-card)", marginTop: "var(--space-6)", flexWrap: "wrap", gap: "var(--space-3)" }}>
        <Link href={`/courses/${lesson.courseSlug}`} style={{ color: "var(--color-link)", fontWeight: 700, textDecoration: "none" }}>
          ← بازگشت به سرفصل دوره
        </Link>
        <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>
          مدرس: {lesson.author} | کلیه حقوق برای اندورا محفوظ است.
        </span>
      </footer>
    </div>
  );
}

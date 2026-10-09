"use client";

import Link from "next/link";
import styles from "./placement.module.css";

interface LearnerTwinPreviewProps {
  currentSection?: string;
  currentIndex?: number;
  totalQuestions?: number;
  answeredCount?: number;
  answers?: Record<string, string>;
  locale?: "fa" | "en";
  level?: string; // Calibrated CEFR level tier: A1 to C2
}

const SKILLS_CONFIG = [
  { key: "grammar", labelEn: "Grammar", labelFa: "دستور زبان", icon: "🎯", total: 15 },
  { key: "vocabulary", labelEn: "Vocabulary", labelFa: "واژگان", icon: "📚", total: 15 },
  { key: "reading", labelEn: "Reading", labelFa: "درک مطلب", icon: "📖", total: 5 },
  { key: "listening", labelEn: "Listening", labelFa: "شنیداری", icon: "🎧", total: 5 },
  { key: "speaking", labelEn: "Speaking", labelFa: "گفتاری", icon: "🎙️", total: 5 },
  { key: "writing", labelEn: "Writing", labelFa: "نگارش", icon: "✍️", total: 5 },
];

export default function LearnerTwinPreview({
  currentSection = "grammar",
  currentIndex = 0,
  totalQuestions = 50,
  answeredCount = 0,
  answers = {},
  locale = "fa",
  level = "A1",
}: LearnerTwinPreviewProps) {
  const isFa = locale === "fa";

  // Compute answers per section
  const sectionCounts: Record<string, number> = {};
  SKILLS_CONFIG.forEach((skill) => {
    // Count keys matching the section prefix
    const count = Object.keys(answers).filter((k) => k.startsWith(skill.key)).length;
    sectionCounts[skill.key] = count;
  });

  return (
    <div
      className={styles.twinCard}
      aria-label={isFa ? "پیش‌نمایش وضعیت یادگیری تو در دوقلوی یادگیری" : "Learner Twin live preview"}
    >
      {/* macOS Window Chrome */}
      <div className={styles.previewChrome}>
        <span />
        <span />
        <span />
        <strong>Learner Twin · Live</strong>
      </div>

      <div className={styles.previewBody}>
        {/* Left Side Rail */}
        <aside className={styles.previewRail} aria-hidden="true">
          <b>E</b>
          <span />
          <span />
          <span />
          <span />
        </aside>

        {/* Content Area */}
        <div className={styles.previewContent}>
          <div className={styles.previewIntro}>
            <div>
              <span>Learner Twin</span>
              <h2>{isFa ? "دوقلوی یادگیری تو" : "Your Learner Twin"}</h2>
              <p>{isFa ? "وضعیت زنده سنجش شواهد" : "Live diagnostic evidence status"}</p>
            </div>
            <Link href="/features/learner-twin" target="_blank" rel="noopener noreferrer">
              {isFa ? "جزئیات" : "Details"}
            </Link>
          </div>

          <div className={styles.twinIdentity}>
            <div className={styles.orb}>
              <span />
            </div>
            <div>
              <strong>Learner Twin</strong>
              <small>
                {isFa ? "سنجش انطباقی ۶ مهارت زبانی" : "Adaptive 6-skill evaluation"}
              </small>
            </div>
          </div>

          <div className={styles.previewBadge}>
            <span>
              {isFa
                ? `نشان سطح ارزیابی (A1 تا C2): ${level}`
                : `CEFR level badge (A1 to C2): ${level}`}
            </span>
          </div>

          {/* 6 Core Skills Live Meters */}
          <div>
            {SKILLS_CONFIG.map((skill) => {
              const isCurrent = currentSection === skill.key;
              const answered = sectionCounts[skill.key] || 0;
              const isDone = answered >= skill.total;
              const percent = Math.min(100, Math.round((answered / skill.total) * 100));

              let statusText = isFa ? "منتظر تعیین سطح" : "Awaiting placement";
              if (isDone) {
                statusText = isFa ? `تکمیل شد (${answered}/${skill.total})` : `Complete (${answered}/${skill.total})`;
              } else if (isCurrent) {
                statusText = isFa ? `در حال ارزیابی (${answered}/${skill.total})` : `Evaluating (${answered}/${skill.total})`;
              } else if (answered > 0) {
                statusText = isFa ? `${answered} از ${skill.total} ثبت شد` : `${answered}/${skill.total} logged`;
              }

              return (
                <div
                  key={skill.key}
                  className={`${styles.skillPreviewRow} ${isCurrent ? styles.skillPreviewRowActive : ""}`}
                >
                  <div className={styles.skillPreviewTop}>
                    <strong lang="en" dir="ltr">
                      {skill.icon} {skill.labelEn}
                    </strong>
                    <small>{statusText}</small>
                  </div>
                  <div className={styles.skillPreviewTrack}>
                    <div
                      className={styles.skillPreviewBar}
                      style={{
                        inlineSize: `${isDone ? 100 : percent > 0 ? percent : isCurrent ? 25 : 0}%`,
                        background: isDone
                          ? "var(--color-success, #10b981)"
                          : "var(--color-learning-teal, #06b6d4)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.twinFooter}>
            <span>
              {isFa ? "مجموع شواهد ثبت‌شده:" : "Logged evidence:"}
            </span>
            <strong style={{ color: "var(--color-action)" }}>
              {answeredCount} {isFa ? "از" : "of"} {totalQuestions}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

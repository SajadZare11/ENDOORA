"use client";

import Link from "next/link";
import { useState } from "react";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import { AudioWaveformPlayer } from "../../../components/placement/AudioWaveformPlayer";
import styles from "../learner-subpages.module.css";

interface ListeningQuestion {
  promptFa: string;
  promptEn: string;
  options: string[];
  correctIndex: number;
  transcriptFa: string;
  transcriptEn: string;
}

const SAMPLE_QUESTION: ListeningQuestion = {
  promptFa: "بر اساس اعلان صوتی ایستگاه، دلیل اصلی تاخیر قطار منچستر چیست؟",
  promptEn: "According to the station audio announcement, what is the primary reason for the delay?",
  options: [
    "Severe weather conditions in northern regions",
    "Scheduled track maintenance near Birmingham",
    "Technical mechanical inspection of the engine",
  ],
  correctIndex: 1,
  transcriptFa: "متن اعلان: توجه مسافران محترم! حرکت قطار ساعت ۱۰:۱۵ به مقصد منچستر به دلیل تعمیرات خط آهن در حوالی بیرمنگام با ۲۰ دقیقه تاخیر انجام خواهد شد.",
  transcriptEn: "Announcement Transcript: Attention passengers for the 10:15 service to Manchester Piccadilly. This service is delayed by approximately 20 minutes due to scheduled track maintenance near Birmingham.",
};

const SKILL_PILLARS = [
  {
    titleFa: "درک پیام کلی (Gist)",
    titleEn: "Gist Comprehension",
    descFa: "تشخیص موضوع اصلی مکالمات و اطلاعیه‌های عمومی روزمره.",
    descEn: "Identify the main topic of daily announcements and general dialogues.",
    cefr: "A1 - A2",
  },
  {
    titleFa: "استخراج جزییات دقیق (Details)",
    titleEn: "Detail Extraction",
    descFa: "شنیدن و ثبت دقیق ساعت‌ها، مکان‌ها، اسامی و مشخصات کلیدی.",
    descEn: "Capture specific times, dates, locations, and names accurately.",
    cefr: "A2 - B1",
  },
  {
    titleFa: "استنباط معنایی و لحن (Inference)",
    titleEn: "Inference & Attitude",
    descFa: "درک احساسات گوینده، تردید، قطعیت و پیام‌های ضمنی پنهان.",
    descEn: "Infer speaker feelings, nuances, and underlying intentions.",
    cefr: "B1 - B2",
  },
  {
    titleFa: "شنیداری دانشگاهی و کاری (Academic)",
    titleEn: "Academic & Workplace",
    descFa: "دنبال کردن سخنرانی‌های علمی، ارائه‌های شرکتی و گزارش‌های تخصصی.",
    descEn: "Follow lectures, business presentations, and specialized briefings.",
    cefr: "B2",
  },
];

export default function ListeningPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  function handleCheck() {
    if (selectedOption !== null) {
      setChecked(true);
    }
  }

  return (
    <div className={styles.container}>
      <Link className={styles.backLink} href="/dashboard">
        <span aria-hidden="true">{isFa ? "←" : "→"}</span>
        {isFa ? "بازگشت به داشبورد" : "Back to dashboard"}
      </Link>

      <section className={styles.heroCard}>
        <div className={styles.heroHeader}>
          <div>
            <h1 className={styles.heroTitle}>
              {isFa ? "آزمایشگاه مهارت شنیداری (Listening Lab)" : "Listening Comprehension Lab"}
            </h1>
            <p className={styles.heroSubtitle}>
              {isFa
                ? "بخش شنیداری با پخش صوتی استاندارد در مرورگر، نوار فرکانسی ۳۲ ستونه، کنترل سرعت و سوالات کالیبره‌شده CEFR فعال است."
                : "Active in-browser listening diagnostics with 32-bar visual waveform scrubber, playback speed controls, and CEFR items."}
            </p>
          </div>
          <span className={`${styles.heroBadge} ${styles.heroBadgeSuccess}`}>
            {isFa ? "پخش‌کننده صوتی فعال" : "Audio Scrubber Ready"}
          </span>
        </div>

        <div className={styles.actionRow}>
          <Link className={styles.buttonPrimary} href="/placement">
            {isFa ? "ورود به آزمون تعیین سطح" : "Take Placement Test"}
          </Link>
          <Link className={styles.buttonSecondary} href="/placement/listening-ready">
            {isFa ? "تست تجهیزات صوتی" : "Audio Readiness Check"}
          </Link>
          <Link className={styles.buttonSecondary} href="/placement/report">
            {isFa ? "مشاهده کارنامه مهارتی" : "Inspect Skill Report"}
          </Link>
        </div>
      </section>

      {/* Interactive Player & Quiz Exercise */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>
          <span aria-hidden="true">🎧</span>
          {isFa ? "نمونه پخش صوتی و آزمونک درک شنیداری" : "Interactive Audio Player & Listening Exercise"}
        </h2>
        <p className={styles.cardDescription}>
          {isFa
            ? "فایل صوتی زیر را گوش دهید (حداکثر ۳ بار) و سپس به سوال چهارگزینه‌ای پاسخ دهید."
            : "Listen to the audio announcement below (up to 3 plays) and answer the multiple-choice question."}
        </p>

        <div style={{ marginBlockEnd: "var(--space-6)" }}>
          <AudioWaveformPlayer
            src="/audio/placement/listening-a1-001.wav"
            playLimit={3}
            title_fa="اعلان ایستگاه قطار بین‌شهری (سطح A1-A2)"
            title_en="Intercity Train Station Announcement (CEFR A1-A2)"
            locale={isFa ? "fa" : "en"}
          />
        </div>

        {/* Question Container */}
        <div
          style={{
            padding: "var(--space-5)",
            background: "var(--color-canvas)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-card)",
          }}
        >
          <h3 style={{ fontSize: "var(--font-size-body)", fontWeight: 700, marginBlockEnd: "var(--space-3)" }}>
            {isFa ? SAMPLE_QUESTION.promptFa : SAMPLE_QUESTION.promptEn}
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBlockEnd: "var(--space-4)" }}>
            {SAMPLE_QUESTION.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === SAMPLE_QUESTION.correctIndex;
              let borderColor = "var(--color-border)";
              let background = "var(--color-surface)";

              if (checked) {
                if (isCorrect) {
                  borderColor = "var(--color-success-green)";
                  background = "var(--color-success-bg)";
                } else if (isSelected) {
                  borderColor = "var(--color-error-red)";
                  background = "var(--color-error-bg)";
                }
              } else if (isSelected) {
                borderColor = "var(--color-action)";
                background = "var(--color-info-bg)";
              }

              return (
                <button
                  key={option}
                  type="button"
                  dir="ltr"
                  onClick={() => {
                    if (!checked) setSelectedOption(idx);
                  }}
                  style={{
                    padding: "var(--space-3) var(--space-4)",
                    borderRadius: "var(--radius-control)",
                    border: `1px solid ${borderColor}`,
                    background,
                    textAlign: "left",
                    color: "var(--color-text)",
                    fontWeight: isSelected ? 700 : 500,
                    cursor: checked ? "default" : "pointer",
                    transition: "all var(--motion-fast) ease",
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", flexWrap: "wrap" }}>
            {!checked ? (
              <button
                type="button"
                className={styles.buttonPrimary}
                onClick={handleCheck}
                disabled={selectedOption === null}
              >
                {isFa ? "بررسی پاسخ" : "Check Answer"}
              </button>
            ) : (
              <button
                type="button"
                className={styles.buttonSecondary}
                onClick={() => setShowTranscript(!showTranscript)}
              >
                {showTranscript
                  ? isFa
                    ? "بستن متن صوتی"
                    : "Hide Transcript"
                  : isFa
                  ? "مشاهده متن کامل صوتی (Transcript)"
                  : "Reveal Transcript"}
              </button>
            )}
          </div>

          {checked && (
            <div
              className={`${styles.feedbackBox} ${
                selectedOption === SAMPLE_QUESTION.correctIndex
                  ? styles.feedbackBoxSuccess
                  : styles.feedbackBoxWarning
              }`}
              role="status"
            >
              {selectedOption === SAMPLE_QUESTION.correctIndex
                ? isFa
                  ? "✓ کاملاً درست است! در متن به صراحت به track maintenance near Birmingham اشاره شد."
                  : "✓ Exactly right! The speaker explicitly mentioned track maintenance near Birmingham."
                : isFa
                ? "دقت کنید: گزینه صحیح مورد دوم است. قطار به علت تعمیرات خط آهن در بیرمنگام با تاخیر مواجه شد."
                : "Not quite. The correct option is track maintenance near Birmingham."}
            </div>
          )}

          {showTranscript && (
            <div
              style={{
                marginTop: "var(--space-4)",
                padding: "var(--space-4)",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-control)",
                lineHeight: 1.7,
              }}
            >
              <p style={{ marginBlockEnd: "var(--space-2)" }}>{SAMPLE_QUESTION.transcriptFa}</p>
              <p dir="ltr" style={{ margin: 0, fontStyle: "italic", color: "var(--color-muted)" }}>
                {SAMPLE_QUESTION.transcriptEn}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 4 Pillars Grid */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>
          <span aria-hidden="true">🎯</span>
          {isFa ? "۴ بعد مورد سنجش در مهارت شنیداری" : "4 Evaluated Listening Dimensions"}
        </h2>

        <div className={styles.skillsGrid}>
          {SKILL_PILLARS.map((pillar) => (
            <article className={styles.skillCard} key={pillar.titleEn}>
              <div className={styles.skillCardHeader}>
                <h3 className={styles.skillCardTitle}>{isFa ? pillar.titleFa : pillar.titleEn}</h3>
                <span className={styles.skillLevelBadge}>{pillar.cefr}</span>
              </div>
              <p style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)", lineHeight: 1.6, margin: "var(--space-2) 0 0 0" }}>
                {isFa ? pillar.descFa : pillar.descEn}
              </p>
            </article>
          ))}
        </div>

        <footer className={styles.disclaimer}>
          {isFa
            ? "اصل شفافیت آموزشی (قانون شماره ۸ اساسنامه): فایل‌های صوتی استاندارد با لهجه‌های طبیعی ضبط شده‌اند و شواهد درک شنیداری شما مستقیماً در کارنامه تحلیلی ذخیره می‌شود."
            : "Product Constitution Rule #8 Disclosure: Listening items utilize standard native accents and calibration rules to record verifiable evidence in your learning twin."}
        </footer>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { AudioRecorder } from "../../../components/placement/AudioRecorder";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import styles from "../learner-subpages.module.css";

interface PromptCard {
  id: string;
  level: string;
  topicFa: string;
  topicEn: string;
  hintFa: string;
  hintEn: string;
  expectedMinWords: number;
}

const SPEAKING_PROMPTS: PromptCard[] = [
  {
    id: "sp-1",
    level: "A1 - A2",
    topicFa: "معرفی شخصی و عادات روزمره",
    topicEn: "Personal Introduction & Daily Routine",
    hintFa: "نام، شغل، محل سکونت و برنامه‌های معمول روزانه خود را بیان کنید.",
    hintEn: "State your name, current occupation, location, and key daily routines.",
    expectedMinWords: 15,
  },
  {
    id: "sp-2",
    level: "B1 - B2",
    topicFa: "دیدگاه درباره کار از راه دور",
    topicEn: "Opinion on Remote Work & Collaboration",
    hintFa: "مزایا و چالش‌های کار دورکاری نسبت به محیط اداری را مقایسه کنید.",
    hintEn: "Discuss the pros and cons of remote work compared to traditional office environments.",
    expectedMinWords: 35,
  },
];

export default function VoicePage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  const [activePrompt, setActivePrompt] = useState<PromptCard>(SPEAKING_PROMPTS[0]);
  const [spokenTranscript, setSpokenTranscript] = useState<string>("");

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
              {isFa ? "آزمایشگاه صدا و گفتار (Voice Lab)" : "Voice Lab & Acoustic Diagnostics"}
            </h1>
            <p className={styles.heroSubtitle}>
              {isFa
                ? "بستری پیشرفته برای ضبط صدا، ارزیابی روان‌گویی، آزمایش سطح نوسان صدا و تبدیل زنده گفتار به متن (STT) به زبان انگلیسی."
                : "An interactive sandbox for oral fluency practice, acoustic amplitude inspection, and real-time Speech-to-Text transcription."}
            </p>
          </div>
          <span className={`${styles.heroBadge} ${styles.heroBadgeSuccess}`}>
            {isFa ? "میکروفون و STT فعال" : "Mic & STT Active"}
          </span>
        </div>

        <div className={styles.actionRow}>
          <Link className={styles.buttonPrimary} href="/placement">
            {isFa ? "ورود به آزمون جامع ۶ مهارته" : "Take 6-Skill Placement Test"}
          </Link>
          <Link className={styles.buttonSecondary} href="/placement/report">
            {isFa ? "مشاهده شواهد کارنامه" : "Inspect Skill Report"}
          </Link>
          <Link className={styles.buttonSecondary} href="/pronunciation">
            {isFa ? "آزمایشگاه تلفظ و فونتیک" : "Pronunciation Lab"}
          </Link>
        </div>
      </section>

      {/* Interactive Recording Sandbox */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>
          <span aria-hidden="true">🎙️</span>
          {isFa ? "آزمایش زنده میکروفون و سنجش روان‌گویی" : "Live Microphone & Oral Practice Sandbox"}
        </h2>

        {/* Prompt Selector */}
        <div style={{ marginBlockEnd: "var(--space-4)" }}>
          <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-muted)", display: "block", marginBlockEnd: "var(--space-2)" }}>
            {isFa ? "موضوع پیشنهادی برای صحبت کردن را انتخاب کنید:" : "Select a Speaking Practice Topic:"}
          </span>
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            {SPEAKING_PROMPTS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`${styles.filterPill} ${activePrompt.id === p.id ? styles.filterPillActive : ""}`}
                onClick={() => {
                  setActivePrompt(p);
                  setSpokenTranscript("");
                }}
              >
                <strong>{p.level}:</strong> {isFa ? p.topicFa : p.topicEn}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            padding: "var(--space-4)",
            background: "var(--color-canvas)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-control)",
            marginBlockEnd: "var(--space-4)",
          }}
        >
          <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-endoora-blue)" }}>
            {isFa ? "راهنمای موضوع:" : "Topic Guidelines:"}
          </span>
          <p style={{ margin: "var(--space-1) 0 0 0", color: "var(--color-text)" }}>
            {isFa ? activePrompt.hintFa : activePrompt.hintEn}
          </p>
        </div>

        {/* AudioRecorder Component */}
        <AudioRecorder
          timeLimitSec={90}
          minWordsExpected={activePrompt.expectedMinWords}
          locale={isFa ? "fa" : "en"}
          onConfirmAnswer={(payload) => {
            setSpokenTranscript(payload.spoken_text);
          }}
        />

        {spokenTranscript && (
          <div
            style={{
              marginTop: "var(--space-4)",
              padding: "var(--space-4)",
              background: "var(--color-info-bg)",
              color: "var(--color-info-text)",
              borderRadius: "var(--radius-control)",
              border: "1px solid var(--color-border)",
            }}
          >
            <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, display: "block", marginBlockEnd: "var(--space-1)" }}>
              {isFa ? "آخرین متن ضبط‌شده از گفتار شما:" : "Captured Speech-to-Text Transcript:"}
            </span>
            <p dir="ltr" style={{ fontWeight: 600, margin: 0, fontFamily: "var(--font-family-latin)" }}>
              &ldquo;{spokenTranscript}&rdquo;
            </p>
          </div>
        )}

        <footer className={styles.disclaimer}>
          {isFa
            ? "اصل شفافیت آموزشی (قانون شماره ۸ اساسنامه): تبدیل گفتار به متن به صورت مرورگرمحور و امن انجام می‌شود. شواهد تشخیصی بخش گفتاری در آزمون جامع ۶ مهارته ثبت و در کارنامه تحلیلی شما نمایش داده می‌شود."
            : "Product Constitution Rule #8 Disclosure: Speech recognition operates safely within your browser. Evaluated oral evidence feeds into your comprehensive 6-skill placement report."}
        </footer>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import styles from "../learner-subpages.module.css";

interface PhoneticSample {
  word: string;
  ipa: string;
  categoryFa: string;
  categoryEn: string;
  stressGuide: string;
  noteFa: string;
  noteEn: string;
  exampleSentence: string;
}

const PHONETIC_SAMPLES: PhoneticSample[] = [
  {
    word: "thought",
    ipa: "/θɔːt/",
    categoryFa: "صدای th بی‌صدا (Voiceless Dental)",
    categoryEn: "Voiceless Dental Fricative",
    stressGuide: "تک‌سیلابی با کشیدگی مصوت",
    noteFa: "نوک زبان را بین دندان‌ها قرار دهید و هوا را بدون لرزش تارهای صوتی خارج کنید (نه صدای 'ت' و نه 'س').",
    noteEn: "Place the tongue tip between teeth and release air without vocal cord vibration.",
    exampleSentence: "I thought carefully before answering the examiner.",
  },
  {
    word: "very vs wary",
    ipa: "/ˈver.i/ vs /ˈweər.i/",
    categoryFa: "تمایز صدای /v/ و /w/",
    categoryEn: "Labiodental vs Labiovelar Contrast",
    stressGuide: "استرس روی سیلاب اول",
    noteFa: "در زبان فارسی صدای /w/ وجود ندارد و اغلب با /v/ اشتباه گرفته می‌شود. برای /w/ لب‌ها کاملاً گرد می‌شوند.",
    noteEn: "Persian L1 transfer causes /w/ to be pronounced as /v/. Round the lips tightly for /w/.",
    exampleSentence: "Be very wary of cold winds in the morning.",
  },
  {
    word: "photographer",
    ipa: "/fəˈtɒɡ.rə.fər/",
    categoryFa: "جابجایی استرس سیلاب (Stress Shift)",
    categoryEn: "Syllable Stress Shift",
    stressGuide: "استرس شدید روی سیلاب دوم: pho-TOG-ra-pher",
    noteFa: "در کلمه photograph استرس اول است، اما با اضافه شدن پسوند به photographer استرس به سیلاب دوم می‌رود.",
    noteEn: "Adding suffixes shifts primary lexical stress from the first to the second syllable.",
    exampleSentence: "The wildlife photographer captured an extraordinary moment.",
  },
  {
    word: "comfortable",
    ipa: "/ˈkʌm.fət.ə.bəl/ or /ˈkʌmf.tə.bəl/",
    categoryFa: "حذف صدای مصوت ناخواسته (Elision)",
    categoryEn: "Vowel Elision & Compression",
    stressGuide: "۳ سیلاب تلفظ می‌شود، نه ۴ سیلاب: COMF-ter-ble",
    noteFa: "سیلاب دوم 'or' حذف می‌شود و کلمه به جای ۴ بخش در ۳ بخش ادا می‌شود.",
    noteEn: "The middle vowel is elided in standard speech, producing three syllables instead of four.",
    exampleSentence: "Please make yourself comfortable in the waiting room.",
  },
];

export default function PronunciationPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  const [activeWord, setActiveWord] = useState<string | null>(null);

  function handlePlayPronunciation(text: string) {
    setActiveWord(text);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.split(" vs ")[0]);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      utterance.onend = () => setActiveWord(null);
      utterance.onerror = () => setActiveWord(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setActiveWord(null), 1500);
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
              {isFa ? "آزمایشگاه تلفظ و فونتیک (Pronunciation Lab)" : "Pronunciation & Phonetics Lab"}
            </h1>
            <p className={styles.heroSubtitle}>
              {isFa
                ? "تسلط بر آواهای استاندارد انگلیسی، استرس کلمات، تفاوت‌های لهجه و تکنیک سایه‌زنی (Shadowing) برای ادای روان و طبیعی کلمات."
                : "Master standard English phonetics, stress placement, phoneme contrasts, and shadowing techniques for authentic articulation."}
            </p>
          </div>
          <span className={`${styles.heroBadge} ${styles.heroBadgeSuccess}`}>
            {isFa ? "پخش صوتی آواها فعال" : "Phonetic Playback Ready"}
          </span>
        </div>

        <div className={styles.actionRow}>
          <Link className={styles.buttonPrimary} href="/voice">
            {isFa ? "تمرین ضبط صدا و STT" : "Speech & STT Sandbox"}
          </Link>
          <Link className={styles.buttonSecondary} href="/placement">
            {isFa ? "آزمون تعیین سطح گفتاری" : "Speaking Diagnostic"}
          </Link>
          <Link className={styles.buttonSecondary} href="/today">
            {isFa ? "مأموریت روزانه" : "Daily Mission"}
          </Link>
        </div>
      </section>

      {/* Phonetic Cards */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>
          <span aria-hidden="true">🗣️</span>
          {isFa ? "آواهای چالش‌برانگیز برای زبان‌آموزان ایرانی" : "Key Phonemes & Accent Challenges"}
        </h2>
        <p className={styles.cardDescription}>
          {isFa
            ? "بر روی آیکون بلندگو کلیک کنید تا تلفظ استاندارد را با سرعت کنترل‌شده بشنوید و الگوهای تداخل زبان فارسی را بشناسید."
            : "Click the audio button to hear authentic pronunciations and review common Persian L1 phonological interference points."}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(17rem, 1fr))", gap: "var(--space-4)" }}>
          {PHONETIC_SAMPLES.map((sample) => {
            const isPlaying = activeWord === sample.word;
            return (
              <article
                key={sample.word}
                style={{
                  padding: "var(--space-5)",
                  background: "var(--color-canvas)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-card)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlockEnd: "var(--space-2)" }}>
                    <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-action)" }}>
                      {isFa ? sample.categoryFa : sample.categoryEn}
                    </span>
                    <button
                      type="button"
                      className={styles.buttonSecondary}
                      style={{ padding: "var(--space-1) var(--space-3)", minBlockSize: "2.2rem" }}
                      onClick={() => handlePlayPronunciation(sample.word)}
                      aria-label={`Listen to ${sample.word}`}
                    >
                      <span aria-hidden="true">{isPlaying ? "🔊" : "🔈"}</span>
                      {isPlaying ? (isFa ? "در حال پخش" : "Playing") : (isFa ? "تلفظ" : "Play")}
                    </button>
                  </div>

                  <h3 dir="ltr" style={{ fontSize: "var(--font-size-section-title)", fontWeight: 800, margin: "var(--space-2) 0", color: "var(--color-text)" }}>
                    {sample.word}
                  </h3>

                  <div dir="ltr" style={{ fontSize: "var(--font-size-body)", fontStyle: "italic", color: "var(--color-endoora-blue)", fontWeight: 600, marginBlockEnd: "var(--space-2)" }}>
                    {sample.ipa}
                  </div>

                  <div style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-muted)", marginBlockEnd: "var(--space-2)" }}>
                    {sample.stressGuide}
                  </div>

                  <p style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text)", lineHeight: 1.6, marginBlockEnd: "var(--space-3)" }}>
                    {isFa ? sample.noteFa : sample.noteEn}
                  </p>
                </div>

                <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-3)" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-muted)", display: "block" }}>
                    {isFa ? "مثال کاربردی در جمله:" : "Contextual Example:"}
                  </span>
                  <p dir="ltr" style={{ fontSize: "var(--font-size-meta)", fontWeight: 500, margin: "var(--space-1) 0 0 0", color: "var(--color-text)" }}>
                    &ldquo;{sample.exampleSentence}&rdquo;
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Shadowing Guide */}
        <div
          style={{
            marginTop: "var(--space-6)",
            padding: "var(--space-5)",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-card)",
          }}
        >
          <h3 style={{ fontSize: "var(--font-size-body)", fontWeight: 700, marginBlockEnd: "var(--space-2)" }}>
            {isFa ? "تکنیک سایه‌زنی گفتاری (Shadowing Technique)" : "The Shadowing Technique"}
          </h3>
          <p style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)", lineHeight: 1.7, marginBlockEnd: "var(--space-3)" }}>
            {isFa
              ? "صدای گوینده بومی را پخش کنید و با تاخیر کسری از ثانیه هم‌زمان با او کلمات را تکرار کنید. این تمرین ماهیچه‌های گفتاری شما را با ریتم طبیعی انگلیسی تطبیق می‌دهد."
              : "Listen to native audio and repeat immediately with a fraction-of-a-second delay. This synchronizes speech muscles to natural English intonation and stress patterns."}
          </p>
          <Link className={styles.buttonPrimary} href="/voice">
            {isFa ? "رفتن به آزمایشگاه صدا و ضبط تمرین" : "Practice Shadowing in Voice Lab"}
          </Link>
        </div>

        <footer className={styles.disclaimer}>
          {isFa
            ? "نکته آموزشی: تفاوت لهجه‌های انگلیسی بریتانیایی و آمریکایی کاملاً طبیعی است و تمرکز اصلی Endoora بر روی وضوح کلام و انتقال صحیح پیام است."
            : "Pedagogical Note: Accent variations (British, American, Australian) are fully respected; Endoora focuses on intelligibility, stress accuracy, and clear articulation."}
        </footer>
      </section>
    </div>
  );
}

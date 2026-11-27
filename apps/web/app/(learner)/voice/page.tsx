"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AudioRecorder } from "../../../components/placement/AudioRecorder";
import { VoiceRecorder } from "../../../components/voice-recorder/VoiceRecorder";
import { SpectrogramPronunciationLab } from "../../../components/phonetics/SpectrogramPronunciationLab";
import type { GOPAssessmentPayload } from "../../../workers/gop-cnn-ctc.worker";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import { Button } from "@endoora/ui";
import styles from "../learner-subpages.module.css";

interface PromptCard {
  id: string;
  level: string;
  topicFa: string;
  topicEn: string;
  hintFa: string;
  hintEn: string;
  expectedMinWords: number;
  shadowingSentenceEn?: string;
  shadowingSentenceFa?: string;
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
    shadowingSentenceEn: "My name is Alex, and I work diligently every day in my hometown.",
    shadowingSentenceFa: "نام من الکس است و من هر روز در زادگاهم با جدیت کار می‌کنم.",
  },
  {
    id: "sp-2",
    level: "B1 - B2",
    topicFa: "دیدگاه درباره کار از راه دور",
    topicEn: "Opinion on Remote Work & Collaboration",
    hintFa: "مزایا و چالش‌های کار دورکاری نسبت به محیط اداری را مقایسه کنید.",
    hintEn: "Discuss the pros and cons of remote work compared to traditional office environments.",
    expectedMinWords: 35,
    shadowingSentenceEn: "Remote work provides flexible schedules, but virtual collaboration demands strong focus.",
    shadowingSentenceFa: "کار از راه دور انعطاف‌پذیری زمانی فراهم می‌کند، اما همکاری مجازی نیازمند تمرکز قوی است.",
  },
];

export default function VoicePage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  const [voiceWorkbenchMode, setVoiceWorkbenchMode] = useState<"spectrogram" | "freestyle">("spectrogram");
  const [activePrompt, setActivePrompt] = useState<PromptCard>(SPEAKING_PROMPTS[0]);
  const [activeShadowingSentence, setActiveShadowingSentence] = useState<string>(
    "Be very wary of cold winds in the mountains."
  );
  const [, setGopAssessment] = useState<GOPAssessmentPayload | null>(null);

  const [spokenTranscript, setSpokenTranscript] = useState<string>("");
  const [preferredAccent, setPreferredAccent] = useState<string>("en-US");
  const [preferredSpeed, setPreferredSpeed] = useState<number>(1.0);
  const [retentionDays, setRetentionDays] = useState<number>(7);
  const [prefSaveStatus, setPrefSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const res = await fetch("/api/voice/preferences/");
        if (res.ok) {
          const data = await res.json();
          if (data.preferred_accent) setPreferredAccent(data.preferred_accent);
          if (data.preferred_speed) setPreferredSpeed(data.preferred_speed);
          if (data.retention_days !== undefined) setRetentionDays(data.retention_days);
        }
      } catch {
        // Local defaults
      }
    };
    loadPrefs();
  }, []);

  const handleSavePreferences = async (newAccent: string, newSpeed: number, newRetention: number) => {
    setPreferredAccent(newAccent);
    setPreferredSpeed(newSpeed);
    setRetentionDays(newRetention);
    setPrefSaveStatus(null);

    try {
      const res = await fetch("/api/voice/preferences/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferred_accent: newAccent,
          preferred_speed: newSpeed,
          retention_days: newRetention,
        }),
      });
      if (res.ok) {
        setPrefSaveStatus(isFa ? "تنظیمات صوتی با موفقیت ذخیره شد." : "Voice preferences saved.");
      }
    } catch {
      setPrefSaveStatus(isFa ? "تنظیمات به صورت محلی ذخیره شد." : "Saved locally.");
    }
  };

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
                ? "بستری پیشرفته برای تحلیل ۶۰ FPS طیف‌نگار صوتی، امتیازدهی GOP واج‌ها، کانتور لحن F0، ضبط آزاد صوت و تبدیل زنده گفتار به متن (STT)."
                : "Advanced laboratory for 60 FPS Mel spectrogram, Goodness of Pronunciation (GOP) phoneme scoring, F0 intonation contour, and Speech-to-Text transcription."}
            </p>
          </div>
          <span className={`${styles.heroBadge} ${styles.heroBadgeSuccess}`}>
            {isFa ? "میکروفون و هوش مصنوعی فعال" : "Mic & Neural AI Active"}
          </span>
        </div>

        <div className={styles.actionRow}>
          <Link className={styles.buttonPrimary} href="/roleplay/voice">
            🎙️ {isFa ? "ورود به نقش‌آفرینی صوتی (Voice Roleplay Beta)" : "Enter Voice Roleplay Beta"}
          </Link>
          <Link className={styles.buttonSecondary} href="/placement">
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

      {/* Dual Workbench Mode Selector */}
      <div style={{ display: "flex", gap: "var(--space-2)", marginBlockEnd: "var(--space-4)" }}>
        <Button
          type="button"
          size="sm"
          variant={voiceWorkbenchMode === "spectrogram" ? "primary" : "secondary"}
          onClick={() => setVoiceWorkbenchMode("spectrogram")}
        >
          ⚡ {isFa ? "آزمایشگاه طیف‌نگار صوتی و GOP واج‌ها (Edge AI)" : "Spectrogram Neural GOP Lab"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant={voiceWorkbenchMode === "freestyle" ? "primary" : "secondary"}
          onClick={() => setVoiceWorkbenchMode("freestyle")}
        >
          🎙️ {isFa ? "جعبه‌ابزار آزاد ضبط صوت و ویرایش متن" : "Free Speech & STT Sandbox"}
        </Button>
      </div>

      {voiceWorkbenchMode === "spectrogram" ? (
        <section className={styles.card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBlockEnd: "var(--space-3)",
              flexWrap: "wrap",
              gap: "var(--space-2)",
            }}
          >
            <h2 className={styles.cardTitle} style={{ margin: 0 }}>
              <span aria-hidden="true">📊</span>
              {isFa
                ? "آزمایشگاه طیف‌نگاره صوتی و ارزیابی واج‌شناسی عصبی (Edge AI)"
                : "Spectrogram Neural GOP Pronunciation Lab"}
            </h2>
            <span
              style={{
                fontSize: "0.78rem",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                color: "#10b981",
                borderRadius: "9999px",
                padding: "2px 10px",
                fontWeight: 700,
              }}
            >
              60 FPS Mel Spectrogram • GOP CTC
            </span>
          </div>
          <p
            style={{
              margin: "0 0 var(--space-4) 0",
              color: "var(--color-muted)",
              fontSize: "var(--font-size-body)",
            }}
          >
            {isFa
              ? "تحلیل فوری ۶۰ فریم بر ثانیه طیف فرکانسی ۸۰ کاناله، کانتور لحن و زیروبمی F0، امتیازدهی Goodness of Pronunciation (GOP) و ریشه‌یابی خطاهای واجی فارسی‌زبانان با پشتیبانی شتاب‌دهنده WebGPU و WASM."
              : "60 FPS real-time 80-bin Mel spectrogram, F0 pitch intonation contour, phoneme-level Goodness of Pronunciation (GOP) scoring, and Persian L1 articulatory breakdown."}
          </p>

          {/* Target Sentence Selector & Live Editor */}
          <div
            style={{
              marginBlockEnd: "var(--space-4)",
              padding: "var(--space-3)",
              background: "var(--color-canvas)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-control)",
            }}
          >
            <span
              style={{
                fontSize: "var(--font-size-meta)",
                fontWeight: 700,
                color: "var(--color-muted)",
                display: "block",
                marginBlockEnd: "var(--space-2)",
              }}
            >
              {isFa
                ? "جمله هدف برای تمرین تلفظ و تحلیل آوایی:"
                : "Target Sentence for Phonetic Analysis:"}
            </span>
            <div
              style={{
                display: "flex",
                gap: "var(--space-2)",
                flexWrap: "wrap",
                marginBlockEnd: "var(--space-2)",
              }}
            >
              {SPEAKING_PROMPTS.map(
                (p) =>
                  p.shadowingSentenceEn && (
                    <Button
                      key={p.id}
                      type="button"
                      size="sm"
                      variant={
                        activeShadowingSentence === p.shadowingSentenceEn
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() => {
                        setActivePrompt(p);
                        setActiveShadowingSentence(p.shadowingSentenceEn!);
                      }}
                    >
                      {p.level}: {isFa ? p.topicFa : p.topicEn}
                    </Button>
                  )
              )}
              <Button
                type="button"
                size="sm"
                variant={
                  activeShadowingSentence ===
                  "Be very wary of cold winds in the mountains."
                    ? "primary"
                    : "secondary"
                }
                onClick={() =>
                  setActiveShadowingSentence(
                    "Be very wary of cold winds in the mountains."
                  )
                }
              >
                L1 Trap: /w/ vs /v/
              </Button>
            </div>
            <input
              type="text"
              value={activeShadowingSentence}
              onChange={(e) => setActiveShadowingSentence(e.target.value)}
              placeholder="Type or edit an English sentence to inspect phonemes..."
              dir="ltr"
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                color: "var(--color-text)",
                fontSize: "0.95rem",
                fontFamily: "var(--font-family-latin)",
              }}
            />
          </div>

          <SpectrogramPronunciationLab
            key={activeShadowingSentence}
            sentenceId={activePrompt.id}
            sentenceText={
              activeShadowingSentence ||
              "Be very wary of cold winds in the mountains."
            }
            cefrLevel={activePrompt.level.startsWith("A") ? "A2" : "B2"}
            moduleSource="Phonetics_Lab"
            onAssessmentComplete={(res) => setGopAssessment(res)}
          />
        </section>
      ) : (
        <>
          {/* Audio Privacy & Preferences Management Card */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span aria-hidden="true">⚙️</span>
              {isFa
                ? "تنظیمات حریم خصوصی و پردازش صوت (Acoustic Preferences)"
                : "Acoustic Privacy & Voice Preferences"}
            </h2>
            <p
              style={{
                margin: "0 0 var(--space-4) 0",
                color: "var(--color-muted)",
                fontSize: "var(--font-size-body)",
              }}
            >
              {isFa
                ? "تعیین مدت زمان نگهداری فایل‌های صوتی، لهجه پیش‌فرض آزمون‌های شنیداری و سرعت استاندارد بازپخش."
                : "Configure audio retention window, preferred native accent, and reference playback tempo."}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "var(--space-4)",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "var(--font-size-meta)",
                    fontWeight: 700,
                    marginBlockEnd: "var(--space-1)",
                  }}
                >
                  {isFa ? "لهجه پیش‌فرض:" : "Preferred Accent:"}
                </label>
                <select
                  value={preferredAccent}
                  onChange={(e) =>
                    handleSavePreferences(
                      e.target.value,
                      preferredSpeed,
                      retentionDays
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "var(--space-2)",
                    borderRadius: "var(--radius-control)",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-canvas)",
                    color: "var(--color-text)",
                  }}
                >
                  <option value="en-US">
                    {isFa ? "آمریکایی (General American)" : "General American (en-US)"}
                  </option>
                  <option value="en-GB">
                    {isFa ? "بریتانیایی (Received Pronunciation)" : "British English (en-GB)"}
                  </option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "var(--font-size-meta)",
                    fontWeight: 700,
                    marginBlockEnd: "var(--space-1)",
                  }}
                >
                  {isFa ? "سرعت بازپخش الگو:" : "Reference Playback Speed:"}
                </label>
                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                  {[0.8, 1.0, 1.2].map((spd) => (
                    <Button
                      key={spd}
                      type="button"
                      size="sm"
                      variant={preferredSpeed === spd ? "primary" : "secondary"}
                      onClick={() =>
                        handleSavePreferences(preferredAccent, spd, retentionDays)
                      }
                    >
                      {spd}x
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "var(--font-size-meta)",
                    fontWeight: 700,
                    marginBlockEnd: "var(--space-1)",
                  }}
                >
                  {isFa ? "حفظ سوابق صوتی (روز):" : "Retention Policy (Days):"}
                </label>
                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                  {[0, 7, 30].map((days) => (
                    <Button
                      key={days}
                      type="button"
                      size="sm"
                      variant={retentionDays === days ? "primary" : "secondary"}
                      onClick={() =>
                        handleSavePreferences(preferredAccent, preferredSpeed, days)
                      }
                    >
                      {days === 0
                        ? isFa
                          ? "حذف فوری"
                          : "Immediate"
                        : `${days} ${isFa ? "روز" : "days"}`}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {prefSaveStatus && (
              <div
                style={{
                  marginTop: "var(--space-3)",
                  color: "var(--color-success)",
                  fontWeight: 600,
                  fontSize: "var(--font-size-meta)",
                }}
              >
                ✓ {prefSaveStatus}
              </div>
            )}
          </section>

          {/* VoiceRecorder v1 Audio Sandbox */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span aria-hidden="true">🎙️</span>
              {isFa
                ? "ابزار نوین ضبط صوت و ویرایش متن گفتار (VoiceRecorder v1)"
                : "VoiceRecorder v1 Sandbox (Live Waveform & Edit)"}
            </h2>
            <p
              style={{
                margin: "0 0 var(--space-4) 0",
                color: "var(--color-muted)",
                fontSize: "var(--font-size-body)",
              }}
            >
              {isFa
                ? "نوسان‌سنج ۲۴ باند زنده، پیش‌شنوایی فوری، تبدیل زنده گفتار به متن و امکان ویرایش دستی متن شناسایی‌شده پیش از ارسال."
                : "24-bar live audio visualizer, immediate playback preview, real-time STT, and in-place transcript editor."}
            </p>

            <VoiceRecorder
              locale={isFa ? "fa" : "en"}
              timeLimitSec={90}
              onConfirmTranscript={(text) => {
                setSpokenTranscript(text);
              }}
            />
          </section>

          {/* Interactive Recording Sandbox */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>
              <span aria-hidden="true">📝</span>
              {isFa ? "تمرین سناریوی موضوعی گفتار" : "Topic-Guided Speaking Practice"}
            </h2>

            {/* Prompt Selector */}
            <div style={{ marginBlockEnd: "var(--space-4)" }}>
              <span
                style={{
                  fontSize: "var(--font-size-meta)",
                  fontWeight: 700,
                  color: "var(--color-muted)",
                  display: "block",
                  marginBlockEnd: "var(--space-2)",
                }}
              >
                {isFa
                  ? "موضوع پیشنهادی برای صحبت کردن را انتخاب کنید:"
                  : "Select a Speaking Practice Topic:"}
              </span>
              <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                {SPEAKING_PROMPTS.map((p) => (
                  <Button
                    key={p.id}
                    type="button"
                    size="sm"
                    variant={activePrompt.id === p.id ? "primary" : "secondary"}
                    onClick={() => {
                      setActivePrompt(p);
                      setSpokenTranscript("");
                      if (p.shadowingSentenceEn) {
                        setActiveShadowingSentence(p.shadowingSentenceEn);
                      }
                    }}
                  >
                    <strong>{p.level}:</strong> {isFa ? p.topicFa : p.topicEn}
                  </Button>
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
              <span
                style={{
                  fontSize: "var(--font-size-meta)",
                  fontWeight: 700,
                  color: "var(--color-endoora-blue)",
                }}
              >
                {isFa ? "راهنمای موضوع:" : "Topic Guidelines:"}
              </span>
              <p
                style={{
                  marginBlockStart: "var(--space-1)",
                  color: "var(--color-text)",
                }}
              >
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
                  marginBlockStart: "var(--space-4)",
                  padding: "var(--space-4)",
                  background: "var(--color-info-bg)",
                  color: "var(--color-info-text)",
                  borderRadius: "var(--radius-control)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--font-size-meta)",
                    fontWeight: 700,
                    display: "block",
                    marginBlockEnd: "var(--space-1)",
                  }}
                >
                  {isFa
                    ? "آخرین متن ضبط‌شده از گفتار شما:"
                    : "Captured Speech-to-Text Transcript:"}
                </span>
                <p
                  dir="ltr"
                  style={{
                    fontWeight: 600,
                    margin: 0,
                    fontFamily: "var(--font-family-latin)",
                  }}
                >
                  &ldquo;{spokenTranscript}&rdquo;
                </p>

                <div style={{ marginBlockStart: "var(--space-3)" }}>
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setActiveShadowingSentence(spokenTranscript);
                      setVoiceWorkbenchMode("spectrogram");
                    }}
                  >
                    ⚡{" "}
                    {isFa
                      ? "ارسال این گفتار به طیف‌نگار صوتی جهت تحلیل واج‌شناسی"
                      : "Analyze this speech in Spectrogram Lab"}
                  </Button>
                </div>
              </div>
            )}

            <footer className={styles.disclaimer}>
              {isFa
                ? "اصل شفافیت آموزشی (قانون شماره ۸ اساسنامه): تبدیل گفتار به متن به صورت مرورگرمحور و امن انجام می‌شود. شواهد تشخیصی بخش گفتاری در آزمون جامع ۶ مهارته ثبت و در کارنامه تحلیلی شما نمایش داده می‌شود."
                : "Product Constitution Rule #8 Disclosure: Speech recognition operates safely within your browser. Evaluated oral evidence feeds into your comprehensive 6-skill placement report."}
            </footer>
          </section>
        </>
      )}
    </div>
  );
}

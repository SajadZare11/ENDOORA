"use client";

import Link from "next/link";
import { useState } from "react";
import { AudioRecorder } from "../../../components/placement/AudioRecorder";
import { useLearnerHome } from "../../../components/learner/LearnerShell";

export default function VoicePage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";
  const [testResult, setTestResult] = useState<string>("");

  return (
    <div style={{ maxWidth: "56rem", marginInline: "auto", padding: "var(--space-4)" }}>
      <Link className="learner-back-link" href="/dashboard" style={{ display: "inline-block", marginBlockEnd: "var(--space-4)" }}>
        {isFa ? "بازگشت به خانه یادگیری" : "Back to learning home"}
      </Link>

      <div className="learner-card" style={{ marginBlockEnd: "var(--space-6)" }}>
        <h1 style={{ fontSize: "var(--font-size-title-1)", marginBlockEnd: "var(--space-2)" }}>
          {isFa ? "آزمایشگاه صدا و گفتار (Voice & Speaking Lab)" : "Voice & Speaking Lab"}
        </h1>
        <p className="learner-muted" style={{ marginBlockEnd: "var(--space-6)" }}>
          {isFa
            ? "آزمایشگاه صدای Endoora بستری برای تمرین روان‌گویی، آزمایش ضبط صدا، تبدیل زنده گفتار به متن (STT) و سنجش وضوح کلام به زبان انگلیسی است."
            : "The Voice Lab provides an interactive environment for oral practice, live Speech-to-Text transcription, and articulation diagnostics."}
        </p>

        {/* Live Audio Recorder Sandbox */}
        <div style={{ marginBlockEnd: "var(--space-6)" }}>
          <h2 style={{ fontSize: "var(--font-size-title-3)", fontWeight: 700, marginBlockEnd: "var(--space-3)" }}>
            {isFa ? "آزمایش زنده میکروفون و گفتار (Speech Sandbox)" : "Interactive Microphone & STT Sandbox"}
          </h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", marginBlockEnd: "var(--space-4)" }}>
            {isFa
              ? "می‌توانید صدای خود را ضبط کنید، سطح نوسان صدا را ببینید و پیش‌نمایش تبدیل گفتار به متن را بررسی نمایید."
              : "Record your voice, watch the live volume meter, and review real-time speech-to-text transcriptions."}
          </p>

          <AudioRecorder
            timeLimitSec={60}
            minWordsExpected={10}
            locale={isFa ? "fa" : "en"}
            onConfirmAnswer={(payload) => {
              setTestResult(payload.spoken_text);
            }}
          />

          {testResult && (
            <div
              style={{
                marginTop: "var(--space-4)",
                padding: "var(--space-3)",
                background: "var(--color-surface-hover)",
                borderRadius: "var(--radius-control)",
                border: "1px solid var(--color-border)",
              }}
            >
              <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>
                {isFa ? "آخرین متن دریافت‌شده از گفتار شما:" : "Latest captured spoken transcript:"}
              </span>
              <p dir="ltr" style={{ fontSize: "var(--font-size-body)", color: "var(--color-text)", marginTop: "var(--space-1)" }}>
                &ldquo;{testResult}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Action Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))", gap: "var(--space-4)", marginBlockEnd: "var(--space-6)" }}>
          <div style={{ padding: "var(--space-4)", background: "var(--color-surface-hover)", borderRadius: "var(--radius-card)", border: "1px solid var(--color-border)" }}>
            <h3 style={{ fontSize: "var(--font-size-body)", fontWeight: 700, marginBlockEnd: "var(--space-1)" }}>
              {isFa ? "آزمون ارزیابی جامع ۵ مهارته" : "Full 5-Skill Placement Test"}
            </h3>
            <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", marginBlockEnd: "var(--space-3)" }}>
              {isFa ? "شرکت در آزمون تعیین سطح در بخش‌های گرامر، واژگان، درک مطلب، شنیداری و گفتاری." : "Take the complete 5-section placement test including Speaking."}
            </p>
            <Link className="learner-button learner-button--primary" href="/placement/demo">
              {isFa ? "ورود به آزمون تعیین سطح" : "Start Placement Test"}
            </Link>
          </div>

          <div style={{ padding: "var(--space-4)", background: "var(--color-surface-hover)", borderRadius: "var(--radius-card)", border: "1px solid var(--color-border)" }}>
            <h3 style={{ fontSize: "var(--font-size-body)", fontWeight: 700, marginBlockEnd: "var(--space-1)" }}>
              {isFa ? "کارنامه تحلیلی مهارت‌ها" : "Verified Skill Report"}
            </h3>
            <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", marginBlockEnd: "var(--space-3)" }}>
              {isFa ? "مشاهده شواهد یادگیری و سطح تخمینی اولیه در کارنامه شفاف." : "Review verified learning evidence and provisional CEFR estimate."}
            </p>
            <Link className="learner-button learner-button--secondary" href="/placement/report">
              {isFa ? "مشاهده کارنامه" : "View Report"}
            </Link>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-4)", color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)" }}>
          <small>
            {isFa
              ? "یادآوری: بخش گفتاری اکنون به طور کامل در آزمون تعیین سطح فعال است و شواهد تشخیصی آن در کارنامه یادگیری شما ثبت می‌شود."
              : "Note: The Speaking diagnostic is now fully active in the placement engine, recording authentic evidence in your learning report."}
          </small>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import type { HighSchoolListeningSection } from "@endoora/contracts";
import { playEnglishSpeech } from "@/lib/speech";
import styles from "./highschool-player.module.css";

interface ListeningPronunciationPlayerProps {
  listening: HighSchoolListeningSection;
  onComplete?: () => void;
}

export const ListeningPronunciationPlayer: React.FC<ListeningPronunciationPlayerProps> = ({
  listening,
  onComplete
}) => {
  const [preAnswers, setPreAnswers] = useState<Record<string, number>>({});
  const [showTranscripts, setShowTranscripts] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, "falling" | "rising">>({});

  const handlePreAnswer = (qId: string, optIdx: number) => {
    setPreAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleQuizAnswer = (qId: string, choice: "falling" | "rising") => {
    setQuizAnswers((prev) => {
      const next = { ...prev, [qId]: choice };
      if (Object.keys(next).length >= listening.pronunciation.quiz.length) {
        onComplete?.();
      }
      return next;
    });
  };

  return (
    <div>
      {/* Title & Introduction */}
      <div style={{ marginBottom: "1.25rem" }}>
        <h3 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 900, color: "var(--color-text, #0f172a)" }}>
          {listening.title}
        </h3>
        <span style={{ color: "var(--color-muted, #64748b)", fontSize: "0.92rem", display: "block", marginTop: "0.25rem" }}>
          تقویت هوشمند مهارت شنیداری (Listening Comprehension) و کارگاه تخصصی لحن و آهنگ کلام (Intonation)
        </span>
      </div>

      {/* Part 1: Listening Comprehension */}
      <div className={styles.stepCard}>
        <div className={styles.stepTitle}>
          <span>🎧 بخش اول: مهارت شنیداری و درک مطلب صوتی</span>
        </div>

        <p style={{ margin: "0 0 0.85rem 0", color: "var(--color-muted, #475569)", fontSize: "0.9rem", lineHeight: 1.5 }}>
          ابتدا به سوالات قبل از شنیدن نگاه کنید، سپس فایل‌های صوتی مکالمه را پخش کرده و پاسخ دهید:
        </p>

        {/* Pre-listening questions */}
        <div style={{ marginBottom: "1.25rem" }}>
          {listening.preListeningQuestions.map((q) => {
            const selected = preAnswers[q.id];
            const isAnswered = selected !== undefined;
            const isCorrect = selected === q.correctIndex;

            return (
              <div key={q.id} style={{ background: "var(--color-surface, #ffffff)", padding: "0.85rem 1.15rem", borderRadius: "12px", border: "1px solid var(--color-border, #e2e8f0)", marginBottom: "0.65rem", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--color-text, #1e293b)", marginBottom: "0.5rem", direction: "ltr", textAlign: "left" }}>
                  {q.question}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {q.options.map((opt, oIdx) => {
                    const isThisSelected = selected === oIdx;
                    let bg = "var(--color-surface, #ffffff)";
                    let bColor = "var(--color-border, #cbd5e1)";
                    let badgeBg = "#f1f5f9";
                    let badgeColor = "#475569";

                    if (isAnswered && isThisSelected) {
                      bg = isCorrect ? "#dcfce7" : "#fee2e2";
                      bColor = isCorrect ? "#22c55e" : "#ef4444";
                      badgeBg = isCorrect ? "#22c55e" : "#ef4444";
                      badgeColor = "#ffffff";
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        style={{
                          padding: "0.45rem 0.85rem",
                          borderRadius: "8px",
                          border: `1px solid ${bColor}`,
                          background: bg,
                          fontFamily: "var(--font-family-latin, sans-serif)",
                          fontSize: "0.88rem",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.45rem",
                          transition: "all 0.2s ease"
                        }}
                        onClick={() => handlePreAnswer(q.id, oIdx)}
                      >
                        <span
                          style={{
                            inlineSize: "20px",
                            blockSize: "20px",
                            borderRadius: "50%",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            background: badgeBg,
                            color: badgeColor
                          }}
                        >
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Conversations audio playback controls */}
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.85rem" }}>
          {listening.conversations.map((conv) => (
            <button
              key={conv.id}
              type="button"
              className={styles.audioSpeakerBtn}
              onClick={() => playEnglishSpeech(conv.transcriptEn, 0.88)}
            >
              🔊 پخش {conv.title}
            </button>
          ))}
          <button
            type="button"
            className={styles.tabButton}
            onClick={() => setShowTranscripts((prev) => !prev)}
          >
            {showTranscripts ? "مخفی کردن متن مکالمه‌ها" : "📜 مشاهده متن و ترجمه مکالمه‌ها"}
          </button>
        </div>

        {/* Revealed Transcripts */}
        {showTranscripts && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginTop: "0.75rem" }}>
            {listening.conversations.map((conv) => (
              <div key={conv.id} style={{ background: "var(--color-surface, #ffffff)", padding: "1rem 1.25rem", borderRadius: "14px", border: "1px solid var(--color-border, #e2e8f0)", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
                <strong style={{ fontSize: "0.95rem", color: "#2563eb", display: "block", marginBottom: "0.45rem" }}>
                  {conv.title}
                </strong>
                <pre style={{ margin: "0 0 0.5rem 0", whiteSpace: "pre-wrap", fontFamily: "var(--font-family-latin, sans-serif)", fontSize: "0.9rem", direction: "ltr", textAlign: "left", color: "var(--color-text, #1e293b)", lineHeight: 1.6 }}>
                  {conv.transcriptEn}
                </pre>
                <div style={{ fontSize: "0.85rem", color: "var(--color-muted, #64748b)", borderTop: "1px dashed var(--color-border, #cbd5e1)", paddingTop: "0.45rem", lineHeight: 1.5 }}>
                  {conv.transcriptFa}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Part 2: Pronunciation (Falling & Rising Intonation) */}
      <div className={styles.stepCard}>
        <div className={styles.stepTitle}>
          <span>🗣️ بخش دوم: تلفظ و آهنگ کلام (Pronunciation: Intonation)</span>
        </div>

        <div style={{ padding: "0.85rem 1.15rem", background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", borderRadius: "12px", border: "1px solid #fcd34d", color: "#92400e", fontSize: "0.92rem", marginBottom: "1.25rem", lineHeight: 1.6 }}>
          💡 <strong>قاعده آهنگ کلام: </strong>{listening.pronunciation.ruleExplanationFa}
        </div>

        {/* Examples of Falling and Rising */}
        <div style={{ marginBottom: "1.25rem" }}>
          <strong style={{ fontSize: "0.95rem", color: "var(--color-text, #1e293b)", display: "block", marginBottom: "0.6rem" }}>
            مثال‌های کتاب با تفکیک بصری آهنگ صدا:
          </strong>

          {listening.pronunciation.examples.map((ex, exIdx) => {
            const isFalling = ex.intonation === "falling";

            return (
              <div key={exIdx} className={styles.intonationExample}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--font-family-latin, sans-serif)", fontSize: "1rem", fontWeight: 700, direction: "ltr", color: "var(--color-text, #0f172a)" }}>
                      {ex.sentence}
                    </span>
                    <span className={isFalling ? styles.intonationPitchFalling : styles.intonationPitchRising}>
                      {isFalling ? "↘ (افتان Falling)" : "↗ (خیزان Rising)"}
                    </span>
                  </div>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-muted, #64748b)", marginTop: "0.25rem", display: "block" }}>
                    {ex.patternDescriptionFa}
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.audioSpeakerBtn}
                  onClick={() => playEnglishSpeech(ex.sentence)}
                  title="پخش لحن صدا"
                >
                  🔊
                </button>
              </div>
            );
          })}
        </div>

        {/* Ear-training Quiz */}
        <div style={{ background: "var(--color-surface, #ffffff)", padding: "1rem 1.25rem", borderRadius: "14px", border: "1px solid var(--color-border, #e2e8f0)", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
          <strong style={{ fontSize: "0.95rem", color: "#2563eb", display: "block", marginBottom: "0.6rem" }}>
            آزمون گوش‌نوازی و تشخیص لحن: آهنگ صدای جمله بالا می‌رود یا پایین می‌آید؟
          </strong>

          {listening.pronunciation.quiz.map((item, qIdx) => {
            const selected = quizAnswers[item.id];
            const isAnswered = selected !== undefined;
            const isCorrect = selected === item.correctIntonation;

            return (
              <div key={item.id} style={{ padding: "0.65rem 0", borderBottom: qIdx === listening.pronunciation.quiz.length - 1 ? "none" : "1px dashed var(--color-border, #e2e8f0)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.45rem", gap: "0.5rem" }}>
                  <span style={{ fontFamily: "var(--font-family-latin, sans-serif)", fontSize: "0.95rem", fontWeight: 700, direction: "ltr", color: "var(--color-text, #1e293b)" }}>
                    {qIdx + 1}. {item.sentence}
                  </span>
                  <button
                    type="button"
                    className={styles.audioSpeakerBtn}
                    style={{ fontSize: "0.72rem", padding: "0.2rem 0.45rem" }}
                    onClick={() => playEnglishSpeech(item.sentence)}
                  >
                    🔊 پخش لحن
                  </button>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {(["falling", "rising"] as const).map((type) => {
                    const isThisSelected = selected === type;
                    let bg = "var(--color-surface-subtle, #f8fafc)";
                    let bColor = "var(--color-border, #cbd5e1)";

                    if (isAnswered && isThisSelected) {
                      bg = isCorrect ? "#dcfce7" : "#fee2e2";
                      bColor = isCorrect ? "#22c55e" : "#ef4444";
                    }

                    return (
                      <button
                        key={type}
                        type="button"
                        style={{
                          padding: "0.4rem 0.85rem",
                          borderRadius: "8px",
                          border: `1px solid ${bColor}`,
                          background: bg,
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                        onClick={() => handleQuizAnswer(item.id, type)}
                      >
                        {type === "falling" ? "↘ افتان (Falling)" : "↗ خیزان (Rising)"}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div style={{ marginTop: "0.4rem", fontSize: "0.85rem", color: isCorrect ? "#15803d" : "#b91c1c", fontWeight: 600 }}>
                    💡 {item.explanationFa}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

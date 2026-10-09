"use client";

import React, { useState } from "react";
import type { HighSchoolReadingSection } from "@endoora/contracts";
import { playEnglishSpeech } from "@/lib/speech";
import styles from "./highschool-player.module.css";

interface ReadingViewerProps {
  reading: HighSchoolReadingSection;
  onComplete?: () => void;
}

export const ReadingViewer: React.FC<ReadingViewerProps> = ({
  reading,
  onComplete
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [openAnswer, setOpenAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeParagraphAudio, setActiveParagraphAudio] = useState<number | null>(null);

  const wordCount = reading.passageTextEn.split(/\s+/).filter(Boolean).length;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 120));

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handlePlayParagraph = (index: number) => {
    setActiveParagraphAudio(index);
    playEnglishSpeech(reading.passageParagraphs[index], 0.88);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    onComplete?.();
  };

  // Evaluate Question 5 (open-ended)
  const q5 = reading.questions.find((q) => q.type === "open_ended");
  const studentText = openAnswer.trim().toLowerCase();
  const requiredKws = q5?.requiredKeywordsForEvaluation || [];
  const matchedKeywords = requiredKws.filter((kw) =>
    studentText.includes(kw.toLowerCase())
  );
  const hasGoodKeywords = matchedKeywords.length >= 2;

  return (
    <div>
      {/* Top Header & Reader Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <span style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--color-text, #0f172a)" }}>
            {reading.title}
          </span>
          <span style={{ color: "var(--color-muted, #64748b)", marginInlineStart: "0.75rem", fontSize: "0.95rem" }}>
            ({reading.persianTitle})
          </span>
        </div>
        <button
          type="button"
          className={styles.audioSpeakerBtn}
          onClick={() => playEnglishSpeech(reading.passageTextEn, 0.85)}
        >
          🔊 روخوانی صوتی کل متن ریدینگ
        </button>
      </div>

      {/* Reader Meta Bar */}
      <div className={styles.readerMetaBar}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <span>⏱️ مدت زمان تقریبی مطالعه: {readTimeMin} دقیقه</span>
          <span>•</span>
          <span>📝 تعداد واژگان متن: {wordCount} کلمه</span>
          <span>•</span>
          <span>📑 تعداد پاراگراف‌ها: {reading.passageParagraphs.length}</span>
        </div>
        <span style={{ fontWeight: 700, color: "#2563eb" }}>
          آموزش تعاملی درک مطلب
        </span>
      </div>

      <div className={styles.readingLayout}>
        {/* Left Column: Full Reading Passage with window chrome */}
        <div style={{ border: "1px solid var(--color-border, #e2e8f0)", borderRadius: "18px", overflow: "hidden" }}>
          <div className={styles.windowChrome}>
            <div className={styles.chromeDots}>
              <span className={styles.trafficRed} />
              <span className={styles.trafficYellow} />
              <span className={styles.trafficGreen} />
            </div>
            <div className={styles.chromeTitle}>
              <span>Reading Passage</span>
              <span>•</span>
              <span>{reading.title}</span>
            </div>
          </div>

          <div className={styles.readingPassage} style={{ border: "none", borderRadius: "0 0 18px 18px" }}>
            {reading.passageParagraphs.map((paragraph, pIdx) => {
              const isPlayingThis = activeParagraphAudio === pIdx;
              return (
                <div key={pIdx} style={{ position: "relative", marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, background: "rgba(100, 116, 139, 0.1)", padding: "0.15rem 0.5rem", borderRadius: "999px" }}>
                      پاراگراف {pIdx + 1}
                    </span>
                    <button
                      type="button"
                      className={styles.audioSpeakerBtn}
                      style={{ fontSize: "0.75rem", padding: "0.15rem 0.5rem" }}
                      onClick={() => handlePlayParagraph(pIdx)}
                      title="پخش صوتی این پاراگراف"
                    >
                      {isPlayingThis ? "🔊 در حال پخش..." : "🔊 پخش صوتی"}
                    </button>
                  </div>
                  <p style={{ margin: 0 }}>{paragraph}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 5 Questions */}
        <div>
          <div style={{ padding: "0.85rem 1.15rem", background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", borderRadius: "14px", border: "1px solid var(--color-border, #e2e8f0)", marginBottom: "1rem", fontSize: "0.88rem", color: "var(--color-muted, #475569)", lineHeight: 1.5 }}>
            📋 <strong>سوالات پنج‌گانه استاندارد ریدینگ:</strong> ابتدا متن را با دقت بخوانید، سپس به سوالات ایده کلی، صحیح/غلط، مرجع ضمیر، معنی واژه و پاسخ تشریحی جواب دهید.
          </div>

          {reading.questions.map((q) => {
            const isQ5 = q.type === "open_ended";

            return (
              <div key={q.id} className={styles.questionItem}>
                <div className={styles.questionBadge}>
                  {q.type === "mcq_general" && "سوال ۱: ایده کلی متن (General Idea)"}
                  {q.type === "true_false" && "سوال ۲: صحیح یا غلط (True / False)"}
                  {q.type === "reference" && "سوال ۳: مرجع ضمیر (Pronoun Reference)"}
                  {q.type === "context_meaning" && "سوال ۴: معنی کلمه در متن (Vocabulary in Context)"}
                  {q.type === "open_ended" && "سوال ۵: درک مطلب تشریحی (Short Answer)"}
                </div>

                <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-text, #1e293b)", marginBottom: "0.65rem", direction: "ltr", textAlign: "left", lineHeight: 1.5 }}>
                  {q.prompt}
                </div>

                {/* Multiple choice or True/False */}
                {!isQ5 && q.options && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[q.id] === optIdx;
                      const isCorrect = typeof q.correctAnswer === "number" && q.correctAnswer === optIdx;

                      let optBg = "var(--color-surface, #ffffff)";
                      let optBorder = "1px solid var(--color-border, #cbd5e1)";
                      let badgeBg = "#f1f5f9";
                      let badgeColor = "#475569";

                      if (isSubmitted) {
                        if (isCorrect) {
                          optBg = "#dcfce7";
                          optBorder = "1px solid #22c55e";
                          badgeBg = "#22c55e";
                          badgeColor = "#ffffff";
                        } else if (isSelected && !isCorrect) {
                          optBg = "#fee2e2";
                          optBorder = "1px solid #ef4444";
                          badgeBg = "#ef4444";
                          badgeColor = "#ffffff";
                        }
                      } else if (isSelected) {
                        optBg = "#eff6ff";
                        optBorder = "1px solid #3b82f6";
                        badgeBg = "#2563eb";
                        badgeColor = "#ffffff";
                      }

                      return (
                        <div
                          key={optIdx}
                          style={{
                            padding: "0.55rem 0.85rem",
                            borderRadius: "10px",
                            border: optBorder,
                            background: optBg,
                            cursor: isSubmitted ? "default" : "pointer",
                            fontSize: "0.92rem",
                            direction: "ltr",
                            textAlign: "left",
                            fontFamily: "var(--font-family-latin, sans-serif)",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem",
                            transition: "all 0.2s ease"
                          }}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                        >
                          <span
                            style={{
                              inlineSize: "22px",
                              blockSize: "22px",
                              borderRadius: "50%",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.75rem",
                              fontWeight: 800,
                              background: badgeBg,
                              color: badgeColor,
                              flexShrink: 0
                            }}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span style={{ flex: 1 }}>{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Open-ended Question 5 */}
                {isQ5 && (
                  <div>
                    {requiredKws.length > 0 && (
                      <div style={{ marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--color-muted, #64748b)" }}>
                          کلیدواژه‌های طلایی مورد انتظار سیستم:
                        </span>
                        <div className={styles.keywordTracker}>
                          {requiredKws.map((kw, kwIdx) => {
                            const isFound = studentText.includes(kw.toLowerCase());
                            return (
                              <span
                                key={kwIdx}
                                className={`${styles.keywordChip} ${isFound ? styles.keywordChipActive : ""}`}
                              >
                                {isFound ? `✓ ${kw}` : kw}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <textarea
                      rows={3}
                      placeholder="پاسخ خود را به انگلیسی در این بخش بنویسید (مثلاً: Because people need more places for living...)"
                      value={openAnswer}
                      onChange={(e) => setOpenAnswer(e.target.value)}
                      disabled={isSubmitted}
                      style={{
                        inlineSize: "100%",
                        padding: "0.75rem",
                        borderRadius: "10px",
                        border: "1px solid var(--color-border, #cbd5e1)",
                        fontFamily: "var(--font-family-latin, sans-serif)",
                        direction: "ltr",
                        textAlign: "left",
                        fontSize: "0.92rem",
                        lineHeight: 1.5,
                        background: "var(--color-surface, #ffffff)",
                        color: "var(--color-text, #0f172a)"
                      }}
                    />
                  </div>
                )}

                {/* Feedback upon submission */}
                {isSubmitted && (
                  <div style={{ marginTop: "0.75rem", padding: "0.75rem 1rem", background: "var(--color-surface-subtle, #f8fafc)", borderRadius: "10px", border: "1px solid var(--color-border, #e2e8f0)", fontSize: "0.88rem", lineHeight: 1.5 }}>
                    {isQ5 ? (
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.35rem" }}>
                          <span style={{ fontWeight: 800, color: hasGoodKeywords ? "#16a34a" : "#d97706" }}>
                            {hasGoodKeywords ? "✓ عالی! کلیدواژه‌های مفهومی به درستی در پاسخ شما یافت شد." : "⚠️ نمونه پاسخ استاندارد را با پاسخ خود مقایسه کنید:"}
                          </span>
                        </div>
                        <div style={{ color: "#0f172a", direction: "ltr", textAlign: "left", fontFamily: "var(--font-family-latin, sans-serif)", fontWeight: 700, marginBlock: "0.3rem" }}>
                          نمونه پاسخ: {q.modelAnswerEn}
                        </div>
                        <div style={{ color: "var(--color-muted, #475569)" }}>
                          ترجمه: {q.modelAnswerFa}
                        </div>
                      </div>
                    ) : (
                      <div style={{ color: "var(--color-text, #334155)" }}>
                        💡 <strong>توضیح پاسخ: </strong>{q.explanationFa}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
            {!isSubmitted ? (
              <button
                type="button"
                className={`${styles.navActionBtn} ${styles.navActionBtnPrimary}`}
                onClick={handleSubmit}
              >
                ثبت پاسخ‌ها و دریافت بازخورد تحلیلی (Submit)
              </button>
            ) : (
              <div style={{ color: "#16a34a", fontWeight: 800, fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem" }}>
                <span>✓</span> پاسخ‌های شما ثبت و تحلیل شد.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import type { HighSchoolGrammarSection } from "@endoora/contracts";
import { playEnglishSpeech } from "@/lib/speech";
import styles from "./highschool-player.module.css";

interface InductiveGrammarPlayerProps {
  grammar: HighSchoolGrammarSection;
  onComplete?: () => void;
}

export const InductiveGrammarPlayer: React.FC<InductiveGrammarPlayerProps> = ({
  grammar,
  onComplete
}) => {
  // CCQ Answers
  const [ccqAnswers, setCcqAnswers] = useState<Record<number, number>>({});
  // Transformation Challenge Answers
  const [transAnswers, setTransAnswers] = useState<Record<number, number>>({});
  // Controlled Practice Answers
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, number>>({});
  // Production Text
  const [productionText, setProductionText] = useState("");
  const [isProductionSubmitted, setIsProductionSubmitted] = useState(false);

  const handleCcqChoice = (qIdx: number, optIdx: number) => {
    setCcqAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleTransChoice = (tIdx: number, optIdx: number) => {
    setTransAnswers((prev) => ({ ...prev, [tIdx]: optIdx }));
  };

  const handlePracticeChoice = (qId: string, optIdx: number) => {
    setPracticeAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleProductionSubmit = () => {
    setIsProductionSubmitted(true);
    onComplete?.();
  };

  // Evaluation for production sentence
  const normProduction = productionText.trim().toLowerCase();
  const targetKws = grammar.practices.production.targetKeywords || [];
  const matchedKeywords = targetKws.filter((kw) =>
    normProduction.includes(kw.toLowerCase())
  );
  const isProductionGood = matchedKeywords.length >= 1;

  return (
    <div>
      {/* Title & Methodology Banner */}
      <div style={{ marginBottom: "1.25rem" }}>
        <h3 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 900, color: "var(--color-text, #0f172a)" }}>
          {grammar.persianTopic}
        </h3>
        <div style={{ color: "var(--color-muted, #64748b)", fontSize: "0.92rem", marginTop: "0.25rem" }}>
          رویکرد استقرایی (Inductive Approach): کشف شهودی فرمول گرامر از مثال‌های ملموس به جای حفظ کردن طوطی‌وار
        </div>
      </div>

      {/* Step 1: Discovery */}
      <div className={styles.stepCard}>
        <div className={styles.stepTitle}>
          <span>🔍 گام ۱: کشف ساختار از روی مثال‌ها (Discovery)</span>
        </div>
        <p style={{ margin: "0 0 0.85rem 0", color: "var(--color-muted, #475569)", fontSize: "0.9rem", lineHeight: 1.6 }}>
          به دو جمله زیر نگاه کنید و به عبارت‌های برجسته شده طلایی دقت کنید:
        </p>

        <div className={styles.discoverySentence}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>
              {(() => {
                const text = grammar.discovery.sentenceA.text;
                const hl = grammar.discovery.sentenceA.highlightedPart;
                if (!hl || !text.includes(hl)) return text;
                const parts = text.split(hl);
                return (
                  <>
                    {parts[0]}
                    <span className={styles.highlightedFuture}>{hl}</span>
                    {parts.slice(1).join(hl)}
                  </>
                );
              })()}
            </span>
            <button
              type="button"
              className={styles.audioSpeakerBtn}
              onClick={() => playEnglishSpeech(grammar.discovery.sentenceA.text)}
              title="پخش صوتی جمله"
            >
              🔊
            </button>
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--color-muted, #64748b)", marginTop: "0.35rem", direction: "rtl", textAlign: "right" }}>
            💡 {grammar.discovery.sentenceA.translation}
          </div>
        </div>

        <div className={styles.discoverySentence}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>
              {(() => {
                const text = grammar.discovery.sentenceB.text;
                const hl = grammar.discovery.sentenceB.highlightedPart;
                if (!hl || !text.includes(hl)) return text;
                const parts = text.split(hl);
                return (
                  <>
                    {parts[0]}
                    <span className={styles.highlightedFuture}>{hl}</span>
                    {parts.slice(1).join(hl)}
                  </>
                );
              })()}
            </span>
            <button
              type="button"
              className={styles.audioSpeakerBtn}
              onClick={() => playEnglishSpeech(grammar.discovery.sentenceB.text)}
              title="پخش صوتی جمله"
            >
              🔊
            </button>
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--color-muted, #64748b)", marginTop: "0.35rem", direction: "rtl", textAlign: "right" }}>
            💡 {grammar.discovery.sentenceB.translation}
          </div>
        </div>
      </div>

      {/* Step 2: CCQs */}
      <div className={styles.stepCard}>
        <div className={styles.stepTitle}>
          <span>❓ گام ۲: سوالات مفهومی هدایت‌شده (Concept Checking Questions)</span>
        </div>
        <p style={{ margin: "0 0 0.85rem 0", color: "var(--color-muted, #475569)", fontSize: "0.9rem" }}>
          برای کشف کاربرد واقعی این ساختار، به دو پرسش هوشمند زیر پاسخ دهید:
        </p>

        {grammar.discovery.ccqQuestions.map((ccq, idx) => {
          const selected = ccqAnswers[idx];
          const isCorrect = selected === ccq.correctIndex;

          return (
            <div key={idx} style={{ background: "var(--color-surface, #ffffff)", padding: "0.85rem 1.15rem", borderRadius: "12px", border: "1px solid var(--color-border, #e2e8f0)", marginBottom: "0.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
              <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--color-text, #1e293b)", marginBottom: "0.6rem" }}>
                {idx + 1}. {ccq.question}
              </div>
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                {ccq.options.map((opt, optIdx) => {
                  const isThisSelected = selected === optIdx;
                  let bg = "var(--color-surface, #ffffff)";
                  let border = "1px solid var(--color-border, #cbd5e1)";
                  let color = "var(--color-text, #1e293b)";

                  if (isThisSelected) {
                    if (optIdx === ccq.correctIndex) {
                      bg = "#dcfce7";
                      border = "1px solid #22c55e";
                      color = "#15803d";
                    } else {
                      bg = "#fee2e2";
                      border = "1px solid #ef4444";
                      color = "#b91c1c";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        border,
                        background: bg,
                        color,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontSize: "0.88rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        transition: "all 0.2s ease"
                      }}
                      onClick={() => handleCcqChoice(idx, optIdx)}
                    >
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, opacity: 0.7 }}>
                        {String.fromCharCode(65 + optIdx)})
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
              {selected !== undefined && (
                <div style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: isCorrect ? "#15803d" : "#b91c1c", fontWeight: 600 }}>
                  💡 {ccq.explanationFa}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step 3: Rule Box */}
      <div className={styles.ruleBox}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
          <span style={{ fontSize: "1.2rem" }}>📌</span>
          <span style={{ fontWeight: 800, fontSize: "1.05rem" }}>فرمول طلایی و قاعده دستوری:</span>
        </div>
        <div style={{ fontSize: "1rem", lineHeight: 1.7 }}>
          {grammar.ruleBoxFa}
        </div>
      </div>

      {/* Step 4: Transformations */}
      <div className={styles.stepCard}>
        <div className={styles.stepTitle}>
          <span>🔄 گام ۴: منفی کردن و سوالی‌سازی Wh (Transformations)</span>
        </div>

        {grammar.transformations.map((trans, tIdx) => {
          const selected = transAnswers[tIdx];
          const isCorrect = selected === trans.interactiveChallenge.correctIndex;

          return (
            <div key={tIdx} style={{ background: "var(--color-surface, #ffffff)", padding: "1rem 1.25rem", borderRadius: "14px", border: "1px solid var(--color-border, #e2e8f0)", marginBottom: "0.85rem", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
              <div style={{ fontWeight: 900, fontSize: "1rem", color: "#2563eb", marginBottom: "0.5rem" }}>
                {trans.titleFa}
              </div>
              <ul style={{ margin: "0 0 0.75rem 0", paddingInlineStart: "1.2rem", fontSize: "0.88rem", color: "var(--color-muted, #475569)", lineHeight: 1.6 }}>
                {trans.stepByStepExplanationFa.map((step, sIdx) => (
                  <li key={sIdx} style={{ marginBottom: "0.25rem" }}>{step}</li>
                ))}
              </ul>

              <div style={{ padding: "0.85rem", background: "var(--color-surface-subtle, #f8fafc)", borderRadius: "10px", border: "1px dashed var(--color-border, #cbd5e1)" }}>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--color-text, #1e293b)", marginBottom: "0.4rem" }}>
                  چالش تعاملی: {trans.interactiveChallenge.questionPrompt}
                </div>
                <div style={{ fontSize: "0.92rem", color: "#0284c7", direction: "ltr", textAlign: "left", fontFamily: "var(--font-family-latin, sans-serif)", fontWeight: 700, marginBottom: "0.5rem" }}>
                  {trans.interactiveChallenge.originalSentence}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {trans.interactiveChallenge.options.map((opt, optIdx) => {
                    const isThisSelected = selected === optIdx;
                    let bg = "var(--color-surface, #ffffff)";
                    let border = "1px solid var(--color-border, #cbd5e1)";

                    if (isThisSelected) {
                      if (optIdx === trans.interactiveChallenge.correctIndex) {
                        bg = "#dcfce7";
                        border = "1px solid #22c55e";
                      } else {
                        bg = "#fee2e2";
                        border = "1px solid #ef4444";
                      }
                    }

                    return (
                      <div
                        key={optIdx}
                        style={{
                          padding: "0.55rem 0.85rem",
                          borderRadius: "8px",
                          border,
                          background: bg,
                          direction: "ltr",
                          textAlign: "left",
                          fontFamily: "var(--font-family-latin, sans-serif)",
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem"
                        }}
                        onClick={() => handleTransChoice(tIdx, optIdx)}
                      >
                        <span className={styles.optionLetterBadge}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span style={{ flex: 1 }}>{opt}</span>
                      </div>
                    );
                  })}
                </div>
                {selected !== undefined && (
                  <div style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: isCorrect ? "#15803d" : "#b91c1c", fontWeight: 600 }}>
                    💡 {trans.interactiveChallenge.explanationFa}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Step 5: Practice & Production */}
      <div className={styles.stepCard}>
        <div className={styles.stepTitle}>
          <span>🎯 گام ۵: تمرین‌های تثبیتی و جمله‌سازی تصویری (Practice & Production)</span>
        </div>

        {/* Controlled MCQs */}
        <div style={{ marginBottom: "1.25rem" }}>
          <strong style={{ fontSize: "0.95rem", color: "var(--color-text, #1e293b)", display: "block", marginBottom: "0.4rem" }}>
            تمرین چهارگزینه‌ای تثبیت گرامر:
          </strong>
          {grammar.practices.controlled.map((item, cIdx) => {
            const selected = practiceAnswers[item.id];
            const isCorrect = selected === item.correctIndex;

            return (
              <div key={item.id} style={{ background: "var(--color-surface, #ffffff)", padding: "0.85rem 1rem", borderRadius: "10px", border: "1px solid var(--color-border, #e2e8f0)", marginTop: "0.6rem" }}>
                <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--color-text, #0f172a)", direction: "ltr", textAlign: "left", fontFamily: "var(--font-family-latin, sans-serif)", marginBottom: "0.5rem" }}>
                  {cIdx + 1}. {item.prompt}
                </div>
                <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
                  {item.options.map((opt, oIdx) => {
                    const isThisSelected = selected === oIdx;
                    let bg = "var(--color-surface, #ffffff)";
                    let bColor = "var(--color-border, #cbd5e1)";

                    if (isThisSelected) {
                      bg = oIdx === item.correctIndex ? "#dcfce7" : "#fee2e2";
                      bColor = oIdx === item.correctIndex ? "#22c55e" : "#ef4444";
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        style={{
                          padding: "0.4rem 0.85rem",
                          borderRadius: "8px",
                          border: `1px solid ${bColor}`,
                          background: bg,
                          fontFamily: "var(--font-family-latin, sans-serif)",
                          fontSize: "0.88rem",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem"
                        }}
                        onClick={() => handlePracticeChoice(item.id, oIdx)}
                      >
                        <span style={{ fontSize: "0.75rem", fontWeight: 800, opacity: 0.7 }}>
                          {String.fromCharCode(65 + oIdx)})
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
                {selected !== undefined && (
                  <div style={{ marginTop: "0.4rem", fontSize: "0.85rem", color: isCorrect ? "#15803d" : "#b91c1c", fontWeight: 600 }}>
                    💡 {item.explanationFa}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Production with Visual Prompt */}
        <div style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", padding: "1.25rem", borderRadius: "14px", border: "1px solid #bfdbfe" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "1.6rem" }}>🌱 🌲</span>
            <strong style={{ fontSize: "1rem", color: "#1e40af" }}>تمرین تولیدی (Production):</strong>
          </div>
          <p style={{ margin: "0 0 0.4rem 0", fontSize: "0.88rem", color: "#1e3a8a" }}>
            توصیف تصویر: {grammar.practices.production.imageDescriptionFa}
          </p>
          <p style={{ margin: "0 0 0.6rem 0", fontSize: "0.9rem", fontWeight: 800, color: "#1e40af" }}>
            {grammar.practices.production.promptInstructionFa}
          </p>

          {targetKws.length > 0 && (
            <div style={{ marginBottom: "0.6rem" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1e40af" }}>
                کلیدواژه‌های طلایی هدف:
              </span>
              <div className={styles.keywordTracker}>
                {targetKws.map((kw, kwIdx) => {
                  const isFound = normProduction.includes(kw.toLowerCase());
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
            rows={2}
            placeholder="جمله کامل خود را بنویسید (مثلاً: They are going to plant trees in the park...)"
            value={productionText}
            onChange={(e) => setProductionText(e.target.value)}
            disabled={isProductionSubmitted}
            style={{
              inlineSize: "100%",
              padding: "0.65rem 0.85rem",
              borderRadius: "10px",
              border: "1px solid #93c5fd",
              direction: "ltr",
              textAlign: "left",
              fontFamily: "var(--font-family-latin, sans-serif)",
              fontSize: "0.92rem",
              background: "#ffffff",
              color: "#0f172a"
            }}
          />

          {!isProductionSubmitted ? (
            <div style={{ marginTop: "0.75rem" }}>
              <button
                type="button"
                className={`${styles.navActionBtn} ${styles.navActionBtnPrimary}`}
                onClick={handleProductionSubmit}
              >
                ثبت جمله و دریافت پاسخ مدل
              </button>
            </div>
          ) : (
            <div style={{ marginTop: "0.75rem", padding: "0.85rem 1rem", background: "#ffffff", borderRadius: "10px", border: "1px solid #bbf7d0", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
              <div style={{ fontWeight: 800, color: isProductionGood ? "#16a34a" : "#d97706", fontSize: "0.9rem" }}>
                {isProductionGood ? "✓ عالی! ساختار گرامری به درستی به کار رفت." : "⚠️ پاسخ مدل را با جمله خود مقایسه کنید:"}
              </div>
              <div style={{ direction: "ltr", textAlign: "left", fontFamily: "var(--font-family-latin, sans-serif)", fontWeight: 800, color: "#0f172a", marginTop: "0.3rem" }}>
                نمونه: {grammar.practices.production.modelSentence}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#475569", marginTop: "0.2rem" }}>
                ترجمه: {grammar.practices.production.persianTranslation}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

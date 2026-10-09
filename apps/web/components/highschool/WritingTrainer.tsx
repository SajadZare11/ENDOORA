"use client";

import React, { useState } from "react";
import type { HighSchoolWritingSection } from "@endoora/contracts";
import styles from "./highschool-player.module.css";

interface WritingTrainerProps {
  writing: HighSchoolWritingSection;
  onComplete?: () => void;
}

export const WritingTrainer: React.FC<WritingTrainerProps> = ({
  writing,
  onComplete
}) => {
  const [activeWritingTab, setActiveWritingTab] = useState<"classification" | "singularPlural" | "proper" | "markers">("classification");

  // Answers state
  const [classQuizAnswers, setClassQuizAnswers] = useState<Record<string, number>>({});
  const [speQuizAnswers, setSpeQuizAnswers] = useState<Record<string, number>>({});
  const [properQuizAnswers, setProperQuizAnswers] = useState<Record<string, number>>({});
  const [markerQuizAnswers, setMarkerQuizAnswers] = useState<Record<string, number>>({});

  const handleClassQuiz = (qId: string, optIdx: number) => {
    setClassQuizAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSpeQuiz = (qId: string, optIdx: number) => {
    setSpeQuizAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleProperQuiz = (qId: string, optIdx: number) => {
    setProperQuizAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleMarkerQuiz = (qId: string, optIdx: number) => {
    setMarkerQuizAnswers((prev) => {
      const next = { ...prev, [qId]: optIdx };
      if (Object.keys(next).length >= writing.nounMarkers.quiz.length) {
        onComplete?.();
      }
      return next;
    });
  };

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: "1.25rem" }}>
        <h3 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 900, color: "var(--color-text, #0f172a)" }}>
          آموزش کاربردی مهارت نگارش: {writing.nounClassification.title.split("(")[0].trim()}
        </h3>
        <span style={{ color: "var(--color-muted, #64748b)", fontSize: "0.92rem", display: "block", marginTop: "0.25rem" }}>
          {writing.nounClassification.title} • {writing.singularPlural.title}
        </span>
      </div>

      {/* Sub-tabs with smooth horizontal scrolling */}
      <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.6rem", marginBottom: "1.25rem" }}>
        <button
          type="button"
          className={`${styles.tabButton} ${activeWritingTab === "classification" ? styles.tabButtonActive : ""}`}
          onClick={() => setActiveWritingTab("classification")}
        >
          <span>📦</span> ۱. {writing.nounClassification.title.split("(")[0].trim()}
        </button>
        <button
          type="button"
          className={`${styles.tabButton} ${activeWritingTab === "singularPlural" ? styles.tabButtonActive : ""}`}
          onClick={() => setActiveWritingTab("singularPlural")}
        >
          <span>👥</span> ۲. {writing.singularPlural.title.split("(")[0].trim()}
        </button>
        <button
          type="button"
          className={`${styles.tabButton} ${activeWritingTab === "proper" ? styles.tabButtonActive : ""}`}
          onClick={() => setActiveWritingTab("proper")}
        >
          <span>🏛️</span> ۳. {writing.properNouns.title.split("(")[0].trim()}
        </button>
        <button
          type="button"
          className={`${styles.tabButton} ${activeWritingTab === "markers" ? styles.tabButtonActive : ""}`}
          onClick={() => setActiveWritingTab("markers")}
        >
          <span>🏷️</span> ۴. {writing.nounMarkers.title.split("(")[0].trim()}
        </button>
      </div>

      {/* 1. Noun Classification */}
      {activeWritingTab === "classification" && (
        <div className={styles.stepCard}>
          <div className={styles.stepTitle}>
            <span>📦 ۱. {writing.nounClassification.title}</span>
          </div>
          <p style={{ margin: "0 0 1.25rem 0", color: "var(--color-muted, #475569)", fontSize: "0.92rem", lineHeight: 1.6 }}>
            {writing.nounClassification.explanationFa}
          </p>

          <div className={styles.nounCategoryGrid}>
            {writing.nounClassification.categories.map((cat, idx) => (
              <div key={idx} className={styles.nounCatCard}>
                <div className={styles.nounCatTitle}>{cat.categoryFa}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--color-muted, #94a3b8)", fontWeight: 700, marginBottom: "0.4rem" }}>
                  {cat.categoryEn}
                </div>
                <div className={styles.nounCatExamples}>
                  {cat.examples.join(" • ")}
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "var(--color-surface, #ffffff)", padding: "1rem 1.25rem", borderRadius: "14px", border: "1px solid var(--color-border, #e2e8f0)", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
            <strong style={{ fontSize: "0.95rem", color: "#2563eb", display: "block", marginBottom: "0.6rem" }}>
              تمرین سریع تثبیت انواع اسم:
            </strong>

            {writing.nounClassification.quiz.map((q) => {
              const selected = classQuizAnswers[q.id];
              const isAnswered = selected !== undefined;
              const isCorrect = selected === q.correctIndex;

              return (
                <div key={q.id} style={{ marginBottom: "0.85rem" }}>
                  <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--color-text, #1e293b)", marginBottom: "0.45rem" }}>
                    {q.prompt}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {q.options.map((opt, oIdx) => {
                      const isThisSelected = selected === oIdx;
                      let bg = "var(--color-surface, #ffffff)";
                      let bColor = "var(--color-border, #cbd5e1)";

                      if (isAnswered && isThisSelected) {
                        bg = isCorrect ? "#dcfce7" : "#fee2e2";
                        bColor = isCorrect ? "#22c55e" : "#ef4444";
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
                            fontSize: "0.88rem",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            transition: "all 0.2s ease"
                          }}
                          onClick={() => handleClassQuiz(q.id, oIdx)}
                        >
                          <span style={{ fontSize: "0.75rem", fontWeight: 800, opacity: 0.7 }}>
                            {String.fromCharCode(65 + oIdx)})
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                  {isAnswered && (
                    <div style={{ marginTop: "0.35rem", fontSize: "0.85rem", color: isCorrect ? "#15803d" : "#b91c1c", fontWeight: 600 }}>
                      💡 {q.explanationFa}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Singular & Plural */}
      {activeWritingTab === "singularPlural" && (
        <div className={styles.stepCard}>
          <div className={styles.stepTitle}>
            <span>👥 ۲. {writing.singularPlural.title}</span>
          </div>
          <p style={{ margin: "0 0 1.25rem 0", color: "var(--color-muted, #475569)", fontSize: "0.92rem", lineHeight: 1.6 }}>
            {writing.singularPlural.rulesSummaryFa}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "1.25rem" }}>
            <div style={{ background: "var(--color-surface, #ffffff)", padding: "1rem 1.25rem", borderRadius: "14px", border: "1px solid var(--color-border, #e2e8f0)", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
              <div style={{ fontWeight: 800, color: "#16a34a", marginBottom: "0.5rem", fontSize: "0.95rem" }}>
                ✓ گروه اول / باقاعده (Regular)
              </div>
              <ul style={{ margin: 0, paddingInlineStart: "1.2rem", fontSize: "0.88rem", fontFamily: "var(--font-family-latin, sans-serif)", color: "var(--color-text, #334155)", lineHeight: 1.6 }}>
                {writing.singularPlural.regularPairs.map((p, idx) => (
                  <li key={idx} style={{ marginBottom: "0.3rem" }}>
                    {p.singular} ➔ <strong style={{ color: "#166534" }}>{p.plural}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ background: "var(--color-surface, #ffffff)", padding: "1rem 1.25rem", borderRadius: "14px", border: "1px solid var(--color-border, #e2e8f0)", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
              <div style={{ fontWeight: 800, color: "#d97706", marginBottom: "0.5rem", fontSize: "0.95rem" }}>
                ⚡ گروه دوم / بی‌قاعده یا استثناها (Irregular)
              </div>
              <ul style={{ margin: 0, paddingInlineStart: "1.2rem", fontSize: "0.88rem", fontFamily: "var(--font-family-latin, sans-serif)", color: "var(--color-text, #334155)", lineHeight: 1.6 }}>
                {writing.singularPlural.irregularPairs.map((p, idx) => (
                  <li key={idx} style={{ marginBottom: "0.3rem" }}>
                    {p.singular} ➔ <strong style={{ color: "#b45309" }}>{p.plural}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ background: "var(--color-surface, #ffffff)", padding: "1rem 1.25rem", borderRadius: "14px", border: "1px solid var(--color-border, #e2e8f0)", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
            <strong style={{ fontSize: "0.95rem", color: "#2563eb", display: "block", marginBottom: "0.6rem" }}>
              تمرین کتاب درسی:
            </strong>

            {writing.singularPlural.exercise.map((item, idx) => {
              const selected = speQuizAnswers[item.id];
              const isAnswered = selected !== undefined;
              const isCorrect = selected === item.correctIndex;

              return (
                <div key={item.id} style={{ marginBottom: "0.85rem" }}>
                  <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--color-text, #0f172a)", direction: "ltr", textAlign: "left", fontFamily: "var(--font-family-latin, sans-serif)", marginBottom: "0.45rem" }}>
                    {idx + 1}. {item.prompt}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {item.options.map((opt, oIdx) => {
                      const isThisSelected = selected === oIdx;
                      let bg = "var(--color-surface, #ffffff)";
                      let bColor = "var(--color-border, #cbd5e1)";

                      if (isAnswered && isThisSelected) {
                        bg = isCorrect ? "#dcfce7" : "#fee2e2";
                        bColor = isCorrect ? "#22c55e" : "#ef4444";
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
                            gap: "0.4rem",
                            transition: "all 0.2s ease"
                          }}
                          onClick={() => handleSpeQuiz(item.id, oIdx)}
                        >
                          <span style={{ fontSize: "0.75rem", fontWeight: 800, opacity: 0.7 }}>
                            {String.fromCharCode(65 + oIdx)})
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                  {isAnswered && (
                    <div style={{ marginTop: "0.35rem", fontSize: "0.85rem", color: isCorrect ? "#15803d" : "#b91c1c", fontWeight: 600 }}>
                      💡 {item.explanationFa}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Proper Nouns */}
      {activeWritingTab === "proper" && (
        <div className={styles.stepCard}>
          <div className={styles.stepTitle}>
            <span>🏛️ ۳. {writing.properNouns.title}</span>
          </div>
          <p style={{ margin: "0 0 1.25rem 0", color: "var(--color-muted, #475569)", fontSize: "0.92rem", lineHeight: 1.6 }}>
            {writing.properNouns.explanationFa}
          </p>

          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            {writing.properNouns.examples.map((ex, idx) => (
              <div key={idx} style={{ padding: "0.5rem 0.95rem", background: "var(--color-surface, #ffffff)", borderRadius: "10px", fontSize: "0.88rem", border: "1px solid var(--color-border, #cbd5e1)", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                <span>عام: {ex.common}</span> ➔ <strong style={{ color: "#2563eb" }}>خاص: {ex.proper}</strong>
              </div>
            ))}
          </div>

          <div style={{ background: "var(--color-surface, #ffffff)", padding: "1rem 1.25rem", borderRadius: "14px", border: "1px solid var(--color-border, #e2e8f0)", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
            <strong style={{ fontSize: "0.95rem", color: "#2563eb", display: "block", marginBottom: "0.6rem" }}>
              تمرین تثبیت مهارت نگارش:
            </strong>

            {writing.properNouns.paragraphFillInTheBlank.map((item, idx) => {
              const selected = properQuizAnswers[item.id];
              const isAnswered = selected !== undefined;
              const isCorrect = selected === item.correctIndex;

              return (
                <div key={item.id} style={{ marginBottom: "0.85rem" }}>
                  <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--color-text, #0f172a)", direction: "ltr", textAlign: "left", fontFamily: "var(--font-family-latin, sans-serif)", marginBottom: "0.45rem" }}>
                    {idx + 1}. {item.sentenceWithBlank}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {item.options.map((opt, oIdx) => {
                      const isThisSelected = selected === oIdx;
                      let bg = "var(--color-surface, #ffffff)";
                      let bColor = "var(--color-border, #cbd5e1)";

                      if (isAnswered && isThisSelected) {
                        bg = isCorrect ? "#dcfce7" : "#fee2e2";
                        bColor = isCorrect ? "#22c55e" : "#ef4444";
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
                            gap: "0.4rem",
                            transition: "all 0.2s ease"
                          }}
                          onClick={() => handleProperQuiz(item.id, oIdx)}
                        >
                          <span style={{ fontSize: "0.75rem", fontWeight: 800, opacity: 0.7 }}>
                            {String.fromCharCode(65 + oIdx)})
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                  {isAnswered && (
                    <div style={{ marginTop: "0.35rem", fontSize: "0.85rem", color: isCorrect ? "#15803d" : "#b91c1c", fontWeight: 600 }}>
                      💡 {item.explanationFa}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Noun Markers */}
      {activeWritingTab === "markers" && (
        <div className={styles.stepCard}>
          <div className={styles.stepTitle}>
            <span>🏷️ ۴. {writing.nounMarkers.title}</span>
          </div>
          <p style={{ margin: "0 0 1.25rem 0", color: "var(--color-muted, #475569)", fontSize: "0.92rem", lineHeight: 1.6 }}>
            {writing.nounMarkers.explanationFa}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.85rem", marginBottom: "1.25rem" }}>
            {writing.nounMarkers.markersList.map((m, idx) => (
              <div key={idx} style={{ background: "var(--color-surface, #ffffff)", padding: "0.85rem 1.15rem", borderRadius: "12px", border: "1px solid var(--color-border, #e2e8f0)", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                <strong style={{ fontSize: "0.9rem", color: "#2563eb", display: "block", marginBottom: "0.35rem" }}>
                  {m.typeFa} ({m.type})
                </strong>
                <div style={{ fontSize: "0.85rem", fontFamily: "var(--font-family-latin, sans-serif)", color: "var(--color-text, #1e293b)", marginBottom: "0.45rem", fontWeight: 600 }}>
                  {m.items.join(" • ")}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--color-muted, #64748b)", direction: "ltr", textAlign: "left", fontFamily: "var(--font-family-latin, sans-serif)", borderTop: "1px dashed var(--color-border, #e2e8f0)", paddingTop: "0.4rem" }}>
                  مثال: {m.exampleSentence}
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "var(--color-surface, #ffffff)", padding: "1rem 1.25rem", borderRadius: "14px", border: "1px solid var(--color-border, #e2e8f0)", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
            <strong style={{ fontSize: "0.95rem", color: "#2563eb", display: "block", marginBottom: "0.6rem" }}>
              تمرین تثبیت نگارش ({writing.nounMarkers.title}):
            </strong>

            {writing.nounMarkers.quiz.map((q) => {
              const selected = markerQuizAnswers[q.id];
              const isAnswered = selected !== undefined;
              const isCorrect = selected === q.correctIndex;

              return (
                <div key={q.id} style={{ marginBottom: "0.85rem" }}>
                  <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--color-text, #1e293b)", marginBottom: "0.45rem" }}>
                    {q.prompt}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {q.options.map((opt, oIdx) => {
                      const isThisSelected = selected === oIdx;
                      let bg = "var(--color-surface, #ffffff)";
                      let bColor = "var(--color-border, #cbd5e1)";

                      if (isAnswered && isThisSelected) {
                        bg = isCorrect ? "#dcfce7" : "#fee2e2";
                        bColor = isCorrect ? "#22c55e" : "#ef4444";
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
                            fontSize: "0.88rem",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            transition: "all 0.2s ease"
                          }}
                          onClick={() => handleMarkerQuiz(q.id, oIdx)}
                        >
                          <span style={{ fontSize: "0.75rem", fontWeight: 800, opacity: 0.7 }}>
                            {String.fromCharCode(65 + oIdx)})
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                  {isAnswered && (
                    <div style={{ marginTop: "0.35rem", fontSize: "0.85rem", color: isCorrect ? "#15803d" : "#b91c1c", fontWeight: 600 }}>
                      💡 {q.explanationFa}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

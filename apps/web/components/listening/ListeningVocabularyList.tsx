"use client";

import React from "react";
import type { ListeningVocabularyItem } from "@endoora/contracts";
import { playEnglishSpeech } from "@/lib/speech";

interface ListeningVocabularyListProps {
  items: ListeningVocabularyItem[];
}

export const ListeningVocabularyList: React.FC<ListeningVocabularyListProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "1.5rem", color: "#64748b" }}>
        واژگان کلیدی برای این درس ثبت نشده است.
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
      {items.map((vocab) => (
        <div
          key={vocab.id}
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "1rem",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            {/* Top row: Word + Audio + IPA */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", direction: "ltr" }}>
                <strong style={{ fontSize: "1.05rem", color: "#0f172a" }}>{vocab.wordOrPhrase}</strong>
                {vocab.ipa && (
                  <span style={{ fontSize: "0.8rem", color: "#64748b", fontFamily: "monospace" }}>
                    {vocab.ipa}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => playEnglishSpeech(vocab.wordOrPhrase, 0.85)}
                style={{
                  background: "#eff6ff",
                  color: "#2563eb",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
                title="تلفظ صوتی کلمه"
                aria-label={`تلفظ صوتی ${vocab.wordOrPhrase}`}
              >
                🔊
              </button>
            </div>

            {/* Tag & Meanings */}
            <div style={{ marginBottom: "0.75rem" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  background: "#f1f5f9",
                  color: "#475569",
                  padding: "0.15rem 0.45rem",
                  borderRadius: "4px",
                  display: "inline-block",
                  marginBottom: "0.35rem",
                  direction: "ltr",
                }}
              >
                {vocab.partOfSpeech}
              </span>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1e293b", marginBottom: "0.25rem" }}>
                {vocab.meaningFa}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.5 }}>
                <strong>کاربرد در این مکالمه: </strong>
                {vocab.contextualMeaningFa}
              </div>
            </div>

            {/* Example sentence */}
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "6px",
                padding: "0.6rem 0.75rem",
                fontSize: "0.85rem",
                marginBottom: "0.5rem",
              }}
            >
              <div style={{ direction: "ltr", color: "#0f172a", fontWeight: 500, marginBottom: "0.2rem" }}>
                "{vocab.exampleSentenceEn}"
              </div>
              <div style={{ color: "#64748b", fontSize: "0.8rem" }}>{vocab.exampleSentenceFa}</div>
            </div>
          </div>

          {/* Collocations */}
          {vocab.collocations && vocab.collocations.length > 0 && (
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
              {vocab.collocations.map((col, cIdx) => (
                <span
                  key={cIdx}
                  style={{
                    fontSize: "0.72rem",
                    background: "#ecfdf5",
                    color: "#065f46",
                    padding: "0.15rem 0.4rem",
                    borderRadius: "4px",
                    direction: "ltr",
                  }}
                >
                  🔗 {col}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

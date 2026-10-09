"use client";

import React, { useState } from "react";
import type { TranscriptSentence } from "@endoora/contracts";
import styles from "./listening-components.module.css";

interface ListeningTranscriptViewerProps {
  sentences: TranscriptSentence[];
  activeSentenceIndex: number;
  onSentenceClick: (index: number) => void;
  initiallyRevealed?: boolean;
}

export const ListeningTranscriptViewer: React.FC<ListeningTranscriptViewerProps> = ({
  sentences,
  activeSentenceIndex,
  onSentenceClick,
  initiallyRevealed = false,
}) => {
  const [isRevealed, setIsRevealed] = useState(initiallyRevealed);

  if (!isRevealed) {
    return (
      <div
        className={styles.transcriptContainer}
        style={{ textAlign: "center", padding: "2.5rem 1rem", background: "#f8fafc" }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📜</div>
        <h4 style={{ margin: "0 0 0.5rem 0", color: "#1e293b", fontWeight: 700 }}>
          متن پیاده‌شده مکالمه (Transcript)
        </h4>
        <p style={{ margin: "0 auto 1.25rem auto", maxWidth: "480px", color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6 }}>
          توصیه آموزشی: برای تقویت واقعی قدرت شنیداری مغز، بهتر است ابتدا سوالات و تمرین‌ها را بدون دیدن متن پاسخ دهید.
        </p>
        <button
          type="button"
          onClick={() => setIsRevealed(true)}
          className={styles.secBtn}
          style={{ background: "#2563eb", color: "#ffffff", borderColor: "#2563eb" }}
        >
          مشاهده و بررسی متن کامل مکالمه
        </button>
      </div>
    );
  }

  return (
    <div className={styles.transcriptContainer}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div>
          <h4 style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>متن همگام‌سازی‌شده مکالمه</h4>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
            برای پخش هر جمله، روی آن کلیک کنید.
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsRevealed(false)}
          className={styles.secBtn}
          style={{ fontSize: "0.75rem" }}
        >
          مخفی‌سازی متن
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {sentences.map((stn, idx) => {
          const isActive = idx === activeSentenceIndex;

          return (
            <div
              key={stn.id}
              onClick={() => onSentenceClick(idx)}
              className={`${styles.sentenceRow} ${isActive ? styles.sentenceActive : ""}`}
              style={{ cursor: "pointer" }}
              role="button"
              tabIndex={0}
              aria-label={`پخش جمله شماره ${idx + 1}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onSentenceClick(idx);
                }
              }}
            >
              {/* Speaker badge or index */}
              {stn.speaker ? (
                <span className={styles.speakerBadge}>{stn.speaker}</span>
              ) : (
                <span className={styles.speakerBadge}>#{idx + 1}</span>
              )}

              {/* Text Area */}
              <div className={styles.sentenceTexts}>
                <div className={styles.sentenceEn}>{stn.textEn}</div>
                <div className={styles.sentenceFa}>{stn.textFa}</div>

                {stn.connectedSpeechNotes && stn.connectedSpeechNotes.length > 0 && (
                  <div
                    style={{
                      marginTop: "0.35rem",
                      display: "flex",
                      gap: "0.4rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {stn.connectedSpeechNotes.map((note, nIdx) => (
                      <span
                        key={nIdx}
                        style={{
                          fontSize: "0.72rem",
                          background: "#fef3c7",
                          color: "#92400e",
                          padding: "0.15rem 0.45rem",
                          borderRadius: "4px",
                          fontWeight: 600,
                          direction: "ltr",
                        }}
                      >
                        ⚡ {note}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Play Icon */}
              <div style={{ fontSize: "0.9rem", color: isActive ? "#2563eb" : "#94a3b8" }}>
                {isActive ? "🔊" : "▶"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

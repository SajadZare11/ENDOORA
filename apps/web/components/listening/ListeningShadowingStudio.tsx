"use client";

import React, { useState } from "react";
import type { TranscriptSentence } from "@endoora/contracts";
import { playEnglishSpeech } from "@/lib/speech";
import { useAudioRecorder } from "@/lib/use-audio-recorder";
import styles from "./listening-components.module.css";

interface ListeningShadowingStudioProps {
  sentences: TranscriptSentence[];
  onCompleteSentence?: (index: number) => void;
}

export const ListeningShadowingStudio: React.FC<ListeningShadowingStudioProps> = ({
  sentences,
  onCompleteSentence,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const { isRecording, audioUrl, startRecording, stopRecording } = useAudioRecorder({
    timeLimitSeconds: 15,
  });

  const currentSentence = sentences[currentIndex];

  const handleNext = () => {
    onCompleteSentence?.(currentIndex);
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowTranscript(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowTranscript(false);
    }
  };

  const playSentenceAudio = () => {
    if (!currentSentence) return;
    playEnglishSpeech(currentSentence.textEn, 0.88);
  };

  if (!sentences || sentences.length === 0) {
    return <div>جمله‌ای برای شدوئینگ موجود نیست.</div>;
  }

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "1.5rem",
        boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
      }}
    >
      {/* Header and Step count */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.25rem",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div>
          <h4 style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>
            استودیوی سایه‌خوانی و تقلید لهجه (Shadowing Studio)
          </h4>
          <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
            گوش دهید، ریتم و آهنگ کلام را تکرار کنید و صدای خود را بسنجید.
          </span>
        </div>
        <span
          style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            background: "#eff6ff",
            color: "#2563eb",
            padding: "0.25rem 0.65rem",
            borderRadius: "9999px",
          }}
        >
          جمله {currentIndex + 1} از {sentences.length}
        </span>
      </div>

      {/* Target Sentence Area */}
      <div
        style={{
          background: "#f8fafc",
          border: "2px dashed #cbd5e1",
          borderRadius: "12px",
          padding: "1.5rem",
          textAlign: "center",
          marginBottom: "1.25rem",
          minHeight: "120px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {showTranscript ? (
          <div>
            <div
              style={{
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "#0f172a",
                direction: "ltr",
                marginBottom: "0.5rem",
              }}
            >
              {currentSentence?.textEn}
            </div>
            <div style={{ fontSize: "0.95rem", color: "#64748b", direction: "rtl" }}>
              {currentSentence?.textFa}
            </div>
          </div>
        ) : (
          <div style={{ color: "#64748b" }}>
            <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "0.35rem" }}>🙈</span>
            <span>متن پنهان است تا گوش شما فعالانه بشنود.</span>
          </div>
        )}
      </div>

      {/* Action Buttons Toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.75rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        {/* Play Sentence Audio */}
        <button
          type="button"
          onClick={playSentenceAudio}
          className={styles.secBtn}
          style={{ background: "#2563eb", color: "#ffffff", borderColor: "#2563eb" }}
        >
          <span>🔊</span>
          <span>پخش جمله گوینده</span>
        </button>

        {/* Toggle Transcript */}
        <button
          type="button"
          onClick={() => setShowTranscript(!showTranscript)}
          className={styles.secBtn}
        >
          <span>{showTranscript ? "👁️‍🗨️ مخفی کردن متن" : "👁️ نمایش متن جمله"}</span>
        </button>

        {/* Record / Stop Recording */}
        {isRecording ? (
          <button
            type="button"
            onClick={stopRecording}
            className={styles.secBtn}
            style={{ background: "#dc2626", color: "#ffffff", borderColor: "#dc2626" }}
          >
            <span>⏹</span>
            <span>پایان ضبط</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={startRecording}
            className={styles.secBtn}
            style={{ background: "#16a34a", color: "#ffffff", borderColor: "#16a34a" }}
          >
            <span>🎙️</span>
            <span>ضبط صدای من و تکرار</span>
          </button>
        )}
      </div>

      {/* Recorded Voice Playback */}
      {audioUrl && (
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "0.85rem", color: "#166534", fontWeight: 600 }}>
            صدای ضبط‌شده شما:
          </span>
          <audio src={audioUrl} controls style={{ height: "36px" }} />
        </div>
      )}

      {/* Bottom Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={handlePrev}
          className={styles.secBtn}
        >
          ← جمله قبلی
        </button>

        <button
          type="button"
          onClick={handleNext}
          className={styles.secBtn}
          style={{ background: "#0f172a", color: "#ffffff", borderColor: "#0f172a" }}
        >
          {currentIndex === sentences.length - 1 ? "پایان شدوئینگ ✓" : "جمله بعدی →"}
        </button>
      </div>
    </div>
  );
};

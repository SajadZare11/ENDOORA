"use client";

import React, { useState } from "react";
import { playEnglishSpeech } from "@/lib/speech";
import styles from "./listening-components.module.css";

interface DictationSnippet {
  id: string;
  targetSentenceEn: string;
  targetSentenceFa?: string;
  hintFa?: string;
}

interface ListeningDictationLabProps {
  snippets: DictationSnippet[];
  onFinish?: (accuracyPercent: number) => void;
}

interface DiffWord {
  word: string;
  status: "correct" | "incorrect" | "missing" | "extra";
  expectedWord?: string;
}

function cleanWord(w: string): string {
  return w.toLowerCase().replace(/[.,!?;:'"()]/g, "").trim();
}

function computeDiff(targetStr: string, inputStr: string): { diffs: DiffWord[]; accuracy: number } {
  const targetWords = targetStr.trim().split(/\s+/).filter(Boolean);
  const inputWords = inputStr.trim().split(/\s+/).filter(Boolean);

  const diffs: DiffWord[] = [];
  let correctCount = 0;

  const maxLen = Math.max(targetWords.length, inputWords.length);

  for (let i = 0; i < maxLen; i++) {
    const targetWord = targetWords[i];
    const inputWord = inputWords[i];

    if (targetWord && inputWord) {
      if (cleanWord(targetWord) === cleanWord(inputWord)) {
        diffs.push({ word: inputWord, status: "correct" });
        correctCount++;
      } else {
        diffs.push({
          word: inputWord,
          status: "incorrect",
          expectedWord: targetWord,
        });
      }
    } else if (targetWord && !inputWord) {
      diffs.push({
        word: `[${targetWord}]`,
        status: "missing",
        expectedWord: targetWord,
      });
    } else if (!targetWord && inputWord) {
      diffs.push({
        word: inputWord,
        status: "extra",
      });
    }
  }

  const accuracy = Math.round((correctCount / Math.max(1, targetWords.length)) * 100);
  return { diffs, accuracy };
}

export const ListeningDictationLab: React.FC<ListeningDictationLabProps> = ({
  snippets,
  onFinish,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedInput, setTypedInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [diffResult, setDiffResult] = useState<{ diffs: DiffWord[]; accuracy: number } | null>(null);

  const currentSnippet = snippets[currentIndex];

  const handlePlayAudio = () => {
    if (!currentSnippet) return;
    playEnglishSpeech(currentSnippet.targetSentenceEn, 0.85);
  };

  const handleCheck = () => {
    if (!currentSnippet || !typedInput.trim()) return;
    const res = computeDiff(currentSnippet.targetSentenceEn, typedInput);
    setDiffResult(res);
    setChecked(true);
  };

  const handleNext = () => {
    if (currentIndex < snippets.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTypedInput("");
      setChecked(false);
      setDiffResult(null);
    } else {
      if (onFinish && diffResult) {
        onFinish(diffResult.accuracy);
      }
    }
  };

  if (!snippets || snippets.length === 0) {
    return <div>قطعه صوتی برای دیکته موجود نیست.</div>;
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
      {/* Header */}
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
          <h4 style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>
            آزمایشگاه دیکته و رونویسی صوتی (Dictation Lab)
          </h4>
          <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
            به صوت گوش دهید و آنچه می‌شنوید را دقیقاً تایپ کنید.
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
          بخش {currentIndex + 1} از {snippets.length}
        </span>
      </div>

      {/* Audio Play Trigger */}
      <div style={{ textAlign: "center", marginBlock: "1.25rem" }}>
        <button
          type="button"
          onClick={handlePlayAudio}
          className={styles.secBtn}
          style={{ background: "#2563eb", color: "#ffffff", borderColor: "#2563eb", padding: "0.75rem 1.5rem" }}
        >
          <span>🔊</span>
          <span>پخش فایل صوتی دیکته (Play Snippet)</span>
        </button>
      </div>

      {/* User Input Area */}
      <div style={{ marginBottom: "1.25rem" }}>
        <textarea
          disabled={checked}
          rows={3}
          value={typedInput}
          onChange={(e) => setTypedInput(e.target.value)}
          placeholder="آنچه شنیدید را اینجا تایپ کنید (Type what you hear)..."
          style={{
            width: "100%",
            padding: "0.85rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            fontSize: "1rem",
            direction: "ltr",
            fontFamily: "inherit",
          }}
        />
      </div>

      {/* Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {!checked ? (
          <button
            type="button"
            disabled={!typedInput.trim()}
            onClick={handleCheck}
            className={styles.secBtn}
            style={{ background: "#16a34a", color: "#ffffff", borderColor: "#16a34a" }}
          >
            بررسی و تحلیل خطاها (Check Accuracy)
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className={styles.secBtn}
            style={{ background: "#0f172a", color: "#ffffff", borderColor: "#0f172a" }}
          >
            {currentIndex === snippets.length - 1 ? "پایان تمرین دیکته ✓" : "دیکته بعدی →"}
          </button>
        )}
      </div>

      {/* Diff Feedback Display */}
      {checked && diffResult && (
        <div style={{ marginTop: "1.5rem" }}>
          {/* Accuracy Score Banner */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: diffResult.accuracy >= 80 ? "#dcfce7" : "#fef3c7",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          >
            <strong style={{ color: diffResult.accuracy >= 80 ? "#14532d" : "#92400e" }}>
              نمره دقت دیکته: {diffResult.accuracy}٪
            </strong>
            <span style={{ fontSize: "0.85rem", color: "#475569" }}>
              {diffResult.accuracy >= 80 ? "✨ عالی و بسیار دقیق!" : "نیاز به توجه بیشتر به پسوندها و کلمات کوتاه"}
            </span>
          </div>

          {/* Word by word breakdown */}
          <div className={styles.diffContainer}>
            {diffResult.diffs.map((d, i) => {
              if (d.status === "correct") {
                return (
                  <span key={i} className={styles.wordCorrect}>
                    {d.word}
                  </span>
                );
              }
              if (d.status === "incorrect") {
                return (
                  <span key={i} className={styles.wordIncorrect} title={`کلمه صحیح: ${d.expectedWord}`}>
                    {d.word} (صحیح: {d.expectedWord})
                  </span>
                );
              }
              if (d.status === "missing") {
                return (
                  <span key={i} className={styles.wordMissing} title="این کلمه از قلم افتاده است">
                    جا افتاده: {d.expectedWord}
                  </span>
                );
              }
              return (
                <span key={i} className={styles.wordIncorrect} title="کلمه اضافی">
                  {d.word} (اضافی)
                </span>
              );
            })}
          </div>

          {/* Correct Reference Sentence */}
          <div
            style={{
              marginTop: "1rem",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "0.75rem 1rem",
            }}
          >
            <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "0.25rem" }}>
              متن معیار اصلی (Target Sentence):
            </div>
            <div style={{ direction: "ltr", fontWeight: 700, color: "#0f172a" }}>
              {currentSnippet.targetSentenceEn}
            </div>
            {currentSnippet.targetSentenceFa && (
              <div style={{ color: "#475569", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                {currentSnippet.targetSentenceFa}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

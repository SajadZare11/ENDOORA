"use client";

import { useId, useRef, useState } from "react";
import styles from "./writing-editor.module.css";

type Locale = "fa" | "en";

export interface WritingEditorPayload {
  written_text: string;
  word_count: number;
}

interface WritingEditorProps {
  initialText?: string;
  minWordsExpected?: number;
  maxWordsExpected?: number;
  locale?: Locale;
  placeholder?: string;
  onConfirmAnswer?: (payload: WritingEditorPayload) => void;
  onChangeText?: (text: string) => void;
}

const copy = {
  fa: {
    editorTitle: "ویرایشگر پاسخ متنی و نگارشی",
    bold: "برجسته (Bold)",
    italic: "مورب (Italic)",
    bulletList: "فهرست نقطه‌ای",
    numberList: "فهرست شماره‌دار",
    clear: "پاک کردن",
    words: "کلمه",
    chars: "حرف",
    sentences: "جمله",
    minRequired: "حداقل مورد انتظار:",
    sufficient: "طول متن مناسب است",
    insufficient: "کمتر از حداقل کلمات",
    autosaveNotice: "پاسخ متنی به‌صورت خودکار در سرور ذخیره می‌شود.",
    confirmAnswer: "تایید و ثبت پیش‌نویس نگارش",
    confirmed: "پیش‌نویس نگارش ثبت شد ✓",
    defaultPlaceholder: "پاسخ متنی خود را به زبان انگلیسی در این کادر بنویسید...",
  },
  en: {
    editorTitle: "Writing Response Editor",
    bold: "Bold",
    italic: "Italic",
    bulletList: "Bulleted List",
    numberList: "Numbered List",
    clear: "Clear Text",
    words: "words",
    chars: "characters",
    sentences: "sentences",
    minRequired: "Minimum required:",
    sufficient: "Sufficient length",
    insufficient: "Below minimum words",
    autosaveNotice: "Writing responses are saved automatically with server timestamps.",
    confirmAnswer: "Confirm & save writing draft",
    confirmed: "Draft confirmed ✓",
    defaultPlaceholder: "Write your written response here in English...",
  },
};

export function WritingEditor({
  initialText = "",
  minWordsExpected = 15,
  maxWordsExpected = 150,
  locale = "fa",
  placeholder,
  onConfirmAnswer,
  onChangeText,
}: WritingEditorProps) {
  const [text, setText] = useState(initialText);
  const [prevInitialText, setPrevInitialText] = useState(initialText);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaId = useId();

  if (initialText !== prevInitialText) {
    setPrevInitialText(initialText);
    setText(initialText);
  }

  const t = copy[locale];

  // Tokenize words
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const charCount = text.length;

  // Sentences count
  const rawSentences = text
    .split(/[.!?\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);
  const sentenceCount = rawSentences.length;

  const isSufficient = wordCount >= minWordsExpected;
  const progressPercent = Math.min(100, Math.round((wordCount / Math.max(1, minWordsExpected)) * 100));

  function handleChange(newVal: string) {
    setText(newVal);
    setIsConfirmed(false);
    if (onChangeText) {
      onChangeText(newVal);
    }
  }

  function applyFormat(prefix: string, suffix: string = prefix) {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const currentVal = el.value;
    const selected = currentVal.substring(start, end);

    let replacement = "";
    if (selected) {
      replacement = `${prefix}${selected}${suffix}`;
    } else {
      replacement = `${prefix}${suffix}`;
    }

    const updated = currentVal.substring(0, start) + replacement + currentVal.substring(end);
    handleChange(updated);

    setTimeout(() => {
      el.focus();
      const newCursor = selected ? start + replacement.length : start + prefix.length;
      el.setSelectionRange(newCursor, newCursor);
    }, 10);
  }

  function applyList(ordered: boolean) {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const currentVal = el.value;
    const selected = currentVal.substring(start, end);

    const lines = selected ? selected.split("\n") : [""];
    const formatted = lines
      .map((line, idx) => {
        const marker = ordered ? `${idx + 1}. ` : "- ";
        return line.startsWith(marker) ? line.substring(marker.length) : `${marker}${line}`;
      })
      .join("\n");

    const updated = currentVal.substring(0, start) + formatted + currentVal.substring(end);
    handleChange(updated);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start, start + formatted.length);
    }, 10);
  }

  function handleClear() {
    if (text.length > 0) {
      handleChange("");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
      e.preventDefault();
      applyFormat("**");
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
      e.preventDefault();
      applyFormat("*");
    }
  }

  function handleConfirm() {
    if (onConfirmAnswer) {
      onConfirmAnswer({
        written_text: text.trim(),
        word_count: wordCount,
      });
      setIsConfirmed(true);
    }
  }

  return (
    <section className={styles.container} aria-label={t.editorTitle}>
      {/* Header */}
      <div className={styles.editorHeader}>
        <div className={styles.titleGroup}>
          <svg className={styles.editIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          <h4 className={styles.editorTitle}>{t.editorTitle}</h4>
        </div>

        <div
          className={`${styles.statusBadge} ${isSufficient ? styles.statusSufficient : styles.statusPending}`}
          role="status"
          aria-live="polite"
        >
          {isSufficient ? t.sufficient : t.insufficient}
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className={styles.toolbar} role="toolbar" aria-label={locale === "fa" ? "نوار ابزار ویرایشگر" : "Editor Toolbar"}>
        <button
          type="button"
          className={styles.toolBtn}
          onClick={() => applyFormat("**")}
          title={t.bold}
          aria-label={t.bold}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className={styles.toolBtn}
          onClick={() => applyFormat("*")}
          title={t.italic}
          aria-label={t.italic}
        >
          <em>I</em>
        </button>
        <span className={styles.separator} aria-hidden="true" />
        <button
          type="button"
          className={styles.toolBtn}
          onClick={() => applyList(false)}
          title={t.bulletList}
          aria-label={t.bulletList}
        >
          • لیست
        </button>
        <button
          type="button"
          className={styles.toolBtn}
          onClick={() => applyList(true)}
          title={t.numberList}
          aria-label={t.numberList}
        >
          1. شماره
        </button>
        <span className={styles.separator} aria-hidden="true" />
        <button
          type="button"
          className={styles.toolBtn}
          onClick={handleClear}
          title={t.clear}
          aria-label={t.clear}
        >
          {t.clear}
        </button>
      </div>

      {/* Editor Textarea */}
      <div className={styles.textareaWrapper}>
        <textarea
          ref={textareaRef}
          id={textareaId}
          className={styles.textarea}
          rows={6}
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t.defaultPlaceholder}
          aria-label={t.editorTitle}
        />
      </div>

      {/* Progress towards minWordsExpected */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBarTrack}>
          <div
            className={`${styles.progressBarFill} ${isSufficient ? styles.progressBarFillComplete : ""}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Metrics Row */}
      <div className={styles.metricsRow}>
        <div className={styles.metricsGroup}>
          <div className={styles.metricItem}>
            <span>{t.words}:</span>
            <span className={styles.metricValue}>
              {wordCount} / {minWordsExpected} ({isSufficient ? "✓" : `${minWordsExpected - wordCount} مانده`} | سقف {maxWordsExpected})
            </span>
          </div>
          <div className={styles.metricItem}>
            <span>{t.sentences}:</span>
            <span className={styles.metricValue}>{sentenceCount}</span>
          </div>
          <div className={styles.metricItem}>
            <span>{t.chars}:</span>
            <span className={styles.metricValue}>{charCount}</span>
          </div>
        </div>

        <span className={styles.autosaveNote}>{t.autosaveNotice}</span>
      </div>

      {/* Actions Row */}
      <div className={styles.actionsRow}>
        <button
          type="button"
          className={styles.confirmBtn}
          onClick={handleConfirm}
          disabled={wordCount === 0}
        >
          {isConfirmed ? t.confirmed : t.confirmAnswer}
        </button>
      </div>
    </section>
  );
}

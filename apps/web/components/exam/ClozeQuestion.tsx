"use client";

import React, { useMemo } from "react";
import styles from "./exam.module.css";

interface ClozeQuestionProps {
  passage: string;
  value: Record<string, string> | undefined;
  onChange: (answers: Record<string, string>) => void;
  disabled?: boolean;
}

export function ClozeQuestion({
  passage,
  value = {},
  onChange,
  disabled = false,
}: ClozeQuestionProps) {
  // Parse tokens in passage: e.g. [gap1] or {{1}} or [1]
  const parsedSegments = useMemo(() => {
    const tokenRegex = /\[([\w\d_-]+)\]|\{\{([\w\d_-]+)\}\}/g;
    const segments: Array<{ type: "text" | "blank"; content: string; key?: string }> = [];

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(passage)) !== null) {
      if (match.index > lastIndex) {
        segments.push({
          type: "text",
          content: passage.substring(lastIndex, match.index),
        });
      }
      const blankKey = match[1] || match[2];
      segments.push({
        type: "blank",
        content: match[0],
        key: blankKey,
      });
      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < passage.length) {
      segments.push({
        type: "text",
        content: passage.substring(lastIndex),
      });
    }

    return segments;
  }, [passage]);

  const handleBlankChange = (key: string, val: string) => {
    onChange({
      ...value,
      [key]: val,
    });
  };

  return (
    <div className={styles.clozeText} dir="ltr">
      {parsedSegments.map((seg, idx) => {
        if (seg.type === "text") {
          return <span key={idx}>{seg.content}</span>;
        }

        const blankKey = seg.key || `gap_${idx}`;
        const currentVal = value[blankKey] || "";

        return (
          <input
            key={idx}
            type="text"
            className={styles.clozeInput}
            value={currentVal}
            onChange={(e) => handleBlankChange(blankKey, e.target.value)}
            disabled={disabled}
            placeholder={`(${blankKey})`}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        );
      })}
    </div>
  );
}

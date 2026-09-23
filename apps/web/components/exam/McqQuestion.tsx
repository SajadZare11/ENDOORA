"use client";

import React, { useMemo } from "react";
import styles from "./exam.module.css";

interface McqOption {
  id: string;
  text?: string;
  text_fa?: string;
  text_en?: string;
}

interface McqQuestionProps {
  isMultiSelect?: boolean;
  options: McqOption[];
  shuffleOptions?: boolean;
  value: string | string[] | undefined;
  onChange: (val: string | string[]) => void;
  disabled?: boolean;
}

export function McqQuestion({
  isMultiSelect = false,
  options = [],
  shuffleOptions = false,
  value,
  onChange,
  disabled = false,
}: McqQuestionProps) {
  // Deterministic or randomized options
  const displayOptions = useMemo(() => {
    if (!shuffleOptions) return options;
    return [...options].sort(() => Math.random() - 0.5);
  }, [options, shuffleOptions]);

  const selectedList = useMemo(() => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string" && value) return [value];
    return [];
  }, [value]);

  const handleSelect = (optionId: string) => {
    if (disabled) return;
    if (isMultiSelect) {
      if (selectedList.includes(optionId)) {
        onChange(selectedList.filter((id) => id !== optionId));
      } else {
        onChange([...selectedList, optionId]);
      }
    } else {
      onChange(optionId);
    }
  };

  return (
    <div className={styles.optionsList} role="radiogroup">
      {displayOptions.map((opt) => {
        const isSelected = selectedList.includes(opt.id);
        const labelText = opt.text || opt.text_fa || opt.text_en || opt.id;

        return (
          <div
            key={opt.id}
            className={`${styles.optionItem} ${isSelected ? styles.optionSelected : ""}`}
            onClick={() => handleSelect(opt.id)}
            role={isMultiSelect ? "checkbox" : "radio"}
            aria-checked={isSelected}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                handleSelect(opt.id);
              }
            }}
          >
            <input
              type={isMultiSelect ? "checkbox" : "radio"}
              checked={isSelected}
              onChange={() => handleSelect(opt.id)}
              disabled={disabled}
              className={styles.optionRadio}
              tabIndex={-1}
            />
            <span style={{ fontSize: "1rem", flex: 1 }}>{labelText}</span>
          </div>
        );
      })}
    </div>
  );
}

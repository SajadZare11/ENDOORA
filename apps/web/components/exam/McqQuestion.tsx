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
  value: string | string[] | undefined;
  onChange: (val: string | string[]) => void;
  disabled?: boolean;
}

export function McqQuestion({
  isMultiSelect = false,
  options = [],
  value,
  onChange,
  disabled = false,
}: McqQuestionProps) {
  const groupName = React.useId();
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
    <div className={styles.optionsList} role={isMultiSelect ? "group" : "radiogroup"}>
      {options.map((opt) => {
        const isSelected = selectedList.includes(opt.id);
        const labelText = opt.text || opt.text_fa || opt.text_en || opt.id;

        return (
          <label
            key={opt.id}
            className={`${styles.optionItem} ${isSelected ? styles.optionSelected : ""}`}
          >
            <input
              type={isMultiSelect ? "checkbox" : "radio"}
              name={groupName}
              checked={isSelected}
              onChange={() => handleSelect(opt.id)}
              disabled={disabled}
              className={styles.optionRadio}
            />
            <span style={{ fontSize: "1rem", flex: 1 }}>{labelText}</span>
          </label>
        );
      })}
    </div>
  );
}

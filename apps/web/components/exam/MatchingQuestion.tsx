"use client";

import React from "react";
import styles from "./exam.module.css";

interface MatchingPairItem {
  id: string;
  term: string;
}

interface MatchingDefinitionItem {
  id: string;
  definition: string;
}

interface MatchingQuestionProps {
  terms: MatchingPairItem[];
  definitions: MatchingDefinitionItem[];
  value: Record<string, string> | undefined;
  onChange: (pairs: Record<string, string>) => void;
  disabled?: boolean;
}

export function MatchingQuestion({
  terms = [],
  definitions = [],
  value = {},
  onChange,
  disabled = false,
}: MatchingQuestionProps) {
  const handleSelect = (termId: string, defId: string) => {
    if (disabled) return;
    onChange({
      ...value,
      [termId]: defId,
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {terms.map((t) => {
        const selectedDef = value[t.id] || "";

        return (
          <div
            key={t.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              alignItems: "center",
              padding: "1rem",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "0.75rem",
            }}
          >
            <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>
              {t.term}
            </div>

            <div>
              <select
                value={selectedDef}
                onChange={(e) => handleSelect(t.id, e.target.value)}
                disabled={disabled}
                style={{
                  width: "100%",
                  padding: "0.625rem",
                  borderRadius: "0.5rem",
                  border: "1.5px solid #cbd5e1",
                  background: "#ffffff",
                  fontSize: "0.875rem",
                }}
              >
                <option value="">-- انتخاب تطابق --</option>
                {definitions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.definition}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      })}
    </div>
  );
}

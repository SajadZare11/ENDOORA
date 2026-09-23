"use client";

import React from "react";
import styles from "./exam.module.css";

interface OrderingItem {
  id: string;
  text: string;
}

interface OrderingQuestionProps {
  items: OrderingItem[];
  value: string[] | undefined;
  onChange: (order: string[]) => void;
  disabled?: boolean;
}

export function OrderingQuestion({
  items = [],
  value,
  onChange,
  disabled = false,
}: OrderingQuestionProps) {
  // Ordered items based on current value
  const currentOrder = value && value.length === items.length ? value : items.map((i) => i.id);

  const itemMap = new Map(items.map((i) => [i.id, i.text]));

  const moveItem = (index: number, direction: "up" | "down") => {
    if (disabled) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentOrder.length) return;

    const nextOrder = [...currentOrder];
    const temp = nextOrder[index];
    nextOrder[index] = nextOrder[newIndex];
    nextOrder[newIndex] = temp;

    onChange(nextOrder);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
      {currentOrder.map((itemId, idx) => {
        const text = itemMap.get(itemId) || itemId;

        return (
          <div
            key={itemId}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.875rem 1rem",
              background: "#ffffff",
              border: "1.5px solid #e2e8f0",
              borderRadius: "0.75rem",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "9999px",
                background: "#f1f5f9",
                color: "#475569",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.875rem",
              }}
            >
              {idx + 1}
            </div>

            <div style={{ flex: 1, fontSize: "0.9375rem", lineHeight: 1.5 }}>
              {text}
            </div>

            {!disabled && (
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <button
                  type="button"
                  onClick={() => moveItem(idx, "up")}
                  disabled={idx === 0}
                  style={{
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.75rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "0.25rem",
                    background: idx === 0 ? "#f8fafc" : "#ffffff",
                    cursor: idx === 0 ? "not-allowed" : "pointer",
                  }}
                  aria-label="انتقال به بالا"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(idx, "down")}
                  disabled={idx === currentOrder.length - 1}
                  style={{
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.75rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "0.25rem",
                    background: idx === currentOrder.length - 1 ? "#f8fafc" : "#ffffff",
                    cursor: idx === currentOrder.length - 1 ? "not-allowed" : "pointer",
                  }}
                  aria-label="انتقال به پایین"
                >
                  ▼
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import styles from "./admin-undo-toast.module.css";

interface AdminUndoToastProps {
  message: string;
  isVisible: boolean;
  durationMs?: number;
  onUndo?: () => void;
  onClose: () => void;
}

export function AdminUndoToast({
  message,
  isVisible,
  durationMs = 8000,
  onUndo,
  onClose,
}: AdminUndoToastProps) {
  const [progress, setProgress] = useState<number>(100);

  useEffect(() => {
    if (!isVisible) {
      setProgress(100);
      return;
    }

    const interval = 100;
    const decrement = (interval / durationMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= decrement) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - decrement;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible, durationMs, onClose]);

  if (!isVisible) return null;

  return (
    <div className={styles.toastWrapper} dir="rtl">
      <div className={styles.toast}>
        <div className={styles.leftSide}>
          <span className={styles.successIcon}>✓</span>
          <span className={styles.message}>{message}</span>
        </div>

        <div className={styles.rightSide}>
          {onUndo && (
            <button
              type="button"
              className={styles.undoBtn}
              onClick={() => {
                onUndo();
                onClose();
              }}
            >
              <span>↩️ بازگشت به قبل (Undo)</span>
            </button>
          )}

          <button type="button" className={styles.closeBtn} onClick={onClose} title="بستن">
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

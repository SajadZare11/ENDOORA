"use client";

import React from "react";
import styles from "./exam.module.css";

interface IntegrityBadgeProps {
  score: number | null | undefined;
  showDetails?: boolean;
}

export function IntegrityBadge({ score, showDetails = false }: IntegrityBadgeProps) {
  if (score === null || score === undefined) {
    return (
      <span className={`${styles.integrityBadge} ${styles.integrityYellow}`}>
        نمره اصالت: نامشخص
      </span>
    );
  }

  const numericScore = Number(score);

  let styleClass = styles.integrityGreen;
  let statusText = "عالی (معتبر)";

  if (numericScore < 65) {
    styleClass = styles.integrityRed;
    statusText = "مشکوک (نیازمند بازبینی)";
  } else if (numericScore < 85) {
    styleClass = styles.integrityYellow;
    statusText = "متوسط";
  }

  return (
    <span className={`${styles.integrityBadge} ${styleClass}`}>
      <span>🛡️ نمره اصالت: {numericScore.toFixed(0)}%</span>
      {showDetails && <span>({statusText})</span>}
    </span>
  );
}

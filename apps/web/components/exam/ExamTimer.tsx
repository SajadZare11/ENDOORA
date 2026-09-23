"use client";

import React, { useEffect, useState } from "react";
import styles from "./exam.module.css";

interface ExamTimerProps {
  initialSeconds: number;
  onTimeExpired?: () => void;
  isRunning?: boolean;
}

export function ExamTimer({ initialSeconds, onTimeExpired, isRunning = true }: ExamTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onTimeExpired) onTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, onTimeExpired]);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  const timeString = hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;

  const isWarning = secondsLeft < 300; // Under 5 minutes

  return (
    <div className={`${styles.timerBadge} ${isWarning ? styles.timerWarning : ""}`} dir="ltr">
      <span>⏱️</span>
      <span>{timeString}</span>
    </div>
  );
}

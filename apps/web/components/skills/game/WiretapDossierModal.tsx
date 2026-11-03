"use client";

import React from "react";
import styles from "./wiretap-dossier.module.css";
import type { WiretapStage } from "../../../data/skills/games/wiretap-cipher-types";

interface Props {
  stage: WiretapStage;
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export function WiretapDossierModal({ stage, isOpen, onClose, onStart }: Props) {
  if (!isOpen) return null;

  return (
    <div className={styles.dossierBackdrop} onClick={onClose}>
      <div className={styles.dossierFolder} onClick={(e) => e.stopPropagation()}>
        {/* Top Meta Row */}
        <div className={styles.topRow}>
          <span className={styles.levelBadge}>
            🎧 تمرین شنیداری • سطح {stage.cefr} (مرحله {stage.levelNumber})
          </span>
          <button className={styles.closeIconBtn} onClick={onClose} aria-label="بستن">
            ✕
          </button>
        </div>

        {/* Title */}
        <div className={styles.titleBox}>
          <h2 className={styles.dossierTitle}>{stage.caseTitleFa}</h2>
          <span className={styles.speakerPill}>
            🗣️ گوینده: {stage.speaker.name} ({stage.speaker.roleFa}) • لهجه {stage.speaker.accent}
          </span>
        </div>

        {/* 2-line Friendly Language Coach Note */}
        <div className={styles.coachCard}>
          <div className={styles.coachAvatar}>💡</div>
          <p className={styles.coachText}>
            سلام دوست من! توی این تمرین، با تنظیم موج رادیو به یک فایل صوتی واضح گوش می‌دیم و کلمات
            کلیدی اون رو تشخیص می‌دیم تا مهارت شنیداری‌مون تقویت بشه.
          </p>
        </div>

        {/* Target Frequency Info */}
        <div className={styles.targetFreqBox}>
          <span>📻 فرکانس موج این تمرین:</span>
          <span className={styles.targetFreqValue}>{stage.targetFrequencyMHz.toFixed(1)} MHz</span>
        </div>

        {/* Quick Action Button */}
        <button className={styles.startMissionBtn} onClick={onStart}>
          <span>بزن بریم! 🎧</span>
        </button>
      </div>
    </div>
  );
}

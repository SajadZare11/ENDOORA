"use client";

import React, { useEffect, useCallback } from "react";
import styles from "./stage-briefing.module.css";
import type { SkillKey, CefrLevel } from "../../../data/skills/games/types";
import {
  getSkillStageBriefing,
  SKILL_BRIEFING_METAS,
} from "../../../data/skills/games/skill-stage-briefings";
import { soundSynth } from "../../../lib/skills/game-audio";

export interface SkillStageBriefingModalProps {
  skill: SkillKey;
  cefr: CefrLevel;
  levelNumber: number;
  isOpen: boolean;
  onStart: () => void;
  titleFa?: string;
  titleEn?: string;
}

export function SkillStageBriefingModal({
  skill,
  cefr,
  levelNumber,
  isOpen,
  onStart,
  titleFa: customTitleFa,
  titleEn: customTitleEn,
}: SkillStageBriefingModalProps) {
  const briefing = getSkillStageBriefing(
    skill,
    cefr,
    levelNumber,
    customTitleFa,
    customTitleEn
  );

  const meta = SKILL_BRIEFING_METAS[skill] || {
    icon: "🎮",
    accentColor: "#3b82f6",
    nameFa: skill,
  };

  const handleStart = useCallback(() => {
    try {
      soundSynth.playCorrect();
    } catch {
      // Audio synth failure is non-blocking
    }
    onStart();
  }, [onStart]);

  // Support Keyboard shortcuts: Enter or Space
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an active input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleStart();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleStart]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        // Clicking backdrop closes/starts
        if (e.target === e.currentTarget) {
          handleStart();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="briefing-title"
    >
      <div
        className={styles.modalCard}
        style={{
          borderTopColor: meta.accentColor,
        }}
      >
        <div
          className={styles.topGlowBar}
          style={{
            background: `linear-gradient(90deg, ${meta.accentColor}, #8b5cf6, #3b82f6)`,
          }}
        />

        {/* Top Badges */}
        <div className={styles.headerRow}>
          <div className={styles.badgeGroup}>
            <span
              className={styles.skillBadge}
              style={{
                borderColor: `${meta.accentColor}40`,
                color: meta.accentColor,
              }}
            >
              <span>{meta.icon}</span>
              <span>{meta.nameFa}</span>
            </span>

            <span className={styles.levelBadge}>{briefing.badgeLabel}</span>

            {briefing.themeLabelFa && (
              <span className={styles.themeBadge}>{briefing.themeLabelFa}</span>
            )}
          </div>
        </div>

        {/* Title Box */}
        <div className={styles.titleBox}>
          <h2 id="briefing-title" className={styles.titleFa}>
            {briefing.titleFa}
          </h2>
          <p className={styles.titleEn}>{briefing.titleEn}</p>
        </div>

        {/* 2 Focused Cards: Context & Mission */}
        <div className={styles.contentStack}>
          {/* Card 1: Context */}
          <div className={`${styles.briefCard} ${styles.contextCard}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>💡</span>
              <span>موضوع این مرحله:</span>
            </div>
            <p className={styles.cardText}>{briefing.contextFa}</p>
          </div>

          {/* Card 2: Mission */}
          <div className={`${styles.briefCard} ${styles.missionCard}`}>
            <div className={`${styles.cardHeader} ${styles.missionHeader}`}>
              <span className={styles.cardIcon}>🎯</span>
              <span>مأموریت شما در بازی:</span>
            </div>
            <p className={`${styles.cardText} ${styles.missionText}`}>
              {briefing.missionFa}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actionsRow}>
          <button
            type="button"
            className={styles.startBtn}
            onClick={handleStart}
            autoFocus
          >
            <span>بزن بریم! 🚀</span>
            <span className={styles.keyboardHint}>(Enter / Space)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Reusable sleek button to place in Game top-bars
 * so learners can re-open their stage context anytime.
 */
export function BriefingTriggerButton({
  onClick,
  label = "راهنمای مرحله",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      className={styles.briefingTriggerBtn}
      onClick={onClick}
      title="مشاهده دوباره زمینه و مأموریت مرحله"
    >
      <span>📜</span>
      <span>{label}</span>
    </button>
  );
}

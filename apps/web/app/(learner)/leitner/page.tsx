"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import {
  CEFRLevel,
  CEFRWord,
  CEFRLevelStats,
  CEFRCardState,
} from "../../../data/cefr/types";
import {
  getActiveCefrLevel,
  setActiveCefrLevel,
  getLevelStats,
  getAllLevelsStats,
  getDueCardsForLevel,
  getNextAvailableLesson,
  seedInitialCardsIfEmpty,
} from "../../../lib/cefr-leitner-storage";
import {
  LeitnerLevelSelector,
  LeitnerShelf,
  InductiveLessonArena,
  LeitnerActiveRecallArena,
  CefrVocabTable,
} from "@/components/learner/leitner";
import styles from "../learner-subpages.module.css";

export default function LeitnerPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  // Active level state (A1 to C2)
  const [activeLevel, setActiveLevel] = useState<CEFRLevel>("A1");

  // Mode: "overview" | "lesson" | "review"
  const [mode, setMode] = useState<"overview" | "lesson" | "review">("overview");

  // Lesson & Review session data
  const [sessionWords, setSessionWords] = useState<CEFRWord[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(1);
  const [dueItems, setDueItems] = useState<Array<{ card: CEFRCardState; word: CEFRWord }>>([]);

  // Stats across all levels
  const [allStats, setAllStats] = useState<Record<CEFRLevel, CEFRLevelStats>>({
    A1: { level: "A1", totalWords: 0, learnedCount: 0, dueTodayCount: 0, boxCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, masteredCount: 0, progressPercentage: 0 },
    A2: { level: "A2", totalWords: 0, learnedCount: 0, dueTodayCount: 0, boxCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, masteredCount: 0, progressPercentage: 0 },
    B1: { level: "B1", totalWords: 0, learnedCount: 0, dueTodayCount: 0, boxCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, masteredCount: 0, progressPercentage: 0 },
    B2: { level: "B2", totalWords: 0, learnedCount: 0, dueTodayCount: 0, boxCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, masteredCount: 0, progressPercentage: 0 },
    C1: { level: "C1", totalWords: 0, learnedCount: 0, dueTodayCount: 0, boxCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, masteredCount: 0, progressPercentage: 0 },
    C2: { level: "C2", totalWords: 0, learnedCount: 0, dueTodayCount: 0, boxCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, masteredCount: 0, progressPercentage: 0 },
  });

  // Refresh stats for all levels
  const refreshStats = useCallback(() => {
    try {
      const stats = getAllLevelsStats();
      setAllStats(stats);
    } catch (err) {
      console.error("Failed to load levels stats:", err);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    seedInitialCardsIfEmpty();
    const storedLvl = getActiveCefrLevel();
    setActiveLevel(storedLvl);
    refreshStats();

    const handleUpdate = () => {
      refreshStats();
    };

    window.addEventListener("endoora:cefr-leitner-updated", handleUpdate);
    return () => window.removeEventListener("endoora:cefr-leitner-updated", handleUpdate);
  }, [refreshStats]);

  // Handle Level Selection
  const handleSelectLevel = (lvl: CEFRLevel) => {
    setActiveLevel(lvl);
    setActiveCefrLevel(lvl);
    setMode("overview");
  };

  // Find next available lesson index for active level
  const nextLessonInfo = useMemo(() => {
    return getNextAvailableLesson(activeLevel);
  }, [activeLevel, allStats]);

  // Launch a new 10-word inductive lesson
  const handleStartNewLesson = () => {
    const info = getNextAvailableLesson(activeLevel);
    setSessionWords(info.words);
    setCurrentLessonIndex(info.lessonIndex);
    setMode("lesson");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Launch due cards active recall review
  const handleStartDueReview = () => {
    const items = getDueCardsForLevel(activeLevel);
    if (items.length === 0) return;
    setDueItems(items);
    setMode("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Launch inductive lesson for a specific word clicked in table
  const handleStudySpecificWord = (word: CEFRWord) => {
    setSessionWords([word]);
    setCurrentLessonIndex(word.lessonIndex);
    setMode("lesson");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Return to overview after lesson/review
  const handleSessionComplete = () => {
    setMode("overview");
    refreshStats();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentLevelStats = allStats[activeLevel] || getLevelStats(activeLevel);

  return (
    <div className={styles.container}>
      <Link className={styles.backLink} href="/dashboard">
        <span aria-hidden="true">{isFa ? "←" : "→"}</span>
        {isFa ? "بازگشت به داشبورد" : "Back to dashboard"}
      </Link>

      {/* Active Mode View */}
      {mode === "lesson" && (
        <section aria-label="اتاق تدریس استقرایی واژگان">
          <InductiveLessonArena
            level={activeLevel}
            lessonIndex={currentLessonIndex}
            words={sessionWords}
            onComplete={handleSessionComplete}
            onExit={() => setMode("overview")}
          />
        </section>
      )}

      {mode === "review" && (
        <section aria-label="اتاق مرور کارت‌های سررسید لایتنر">
          <LeitnerActiveRecallArena
            level={activeLevel}
            dueItems={dueItems}
            onComplete={handleSessionComplete}
            onExit={() => setMode("overview")}
          />
        </section>
      )}

      {mode === "overview" && (
        <>
          {/* Level Selector (A1 to C2) */}
          <section aria-label="انتخاب سطح استاندارد واژگان CEFR">
            <LeitnerLevelSelector
              activeLevel={activeLevel}
              onSelectLevel={handleSelectLevel}
              levelsStats={allStats}
            />
          </section>

          {/* 5-Boxes Leitner Shelf for Active Level */}
          <section aria-label={`قفسه ۵ خانه‌ای لایتنر واژگان سطح ${activeLevel}`}>
            <LeitnerShelf
              level={activeLevel}
              stats={currentLevelStats}
              nextLessonIndex={nextLessonInfo.lessonIndex}
              onStartNewLesson={handleStartNewLesson}
              onStartDueReview={handleStartDueReview}
            />
          </section>

          {/* CEFR Vocabulary Bank & Explorer */}
          <section aria-label={`بانک و کاوشگر واژگان سطح ${activeLevel}`}>
            <CefrVocabTable
              level={activeLevel}
              onStudyWord={handleStudySpecificWord}
            />
          </section>
        </>
      )}
    </div>
  );
}

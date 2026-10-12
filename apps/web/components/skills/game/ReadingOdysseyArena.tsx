"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./reading-odyssey.module.css";
import { GameLevel, CefrLevel } from "../../../data/skills/games/types";
import {
  getOdysseyStage,
  getOdysseyStory,
  getRandomOdysseyStory,
} from "../../../data/skills/games/reading-odyssey-curriculum";
import type {
  OdysseyStage,
  OdysseyStory,
  OdysseyEnding,
  OdysseyChoice,
} from "../../../data/skills/games/reading-odyssey-types";
import {
  getDiscoveredEndings,
  recordReadingOdysseyCompletion,
  getStageDiscoveredEndingsCount,
  formatStopwatchTime,
  getLastPlayedStoryIndex,
  setLastPlayedStoryIndex,
} from "../../../lib/skills/game-storage";
import { soundSynth } from "../../../lib/skills/game-audio";
import { SkillStageBriefingModal, BriefingTriggerButton } from "./SkillStageBriefingModal";

interface Props {
  level: GameLevel;
  onClose: () => void;
  onNextLevel?: () => void;
  onOpenLeaderboard?: () => void;
}

export function ReadingOdysseyArena({
  level,
  onClose,
  onNextLevel,
  onOpenLeaderboard,
}: Props) {
  const stage: OdysseyStage | undefined = getOdysseyStage(level.cefr, level.levelNumber);

  // Smart story picker: guarantees a DIFFERENT story than the last played one,
  // prioritizing stories with fewer discovered endings.
  const pickSmartStoryIndex = useCallback((excludeIndex?: number): number => {
    if (!stage || stage.stories.length === 0) return 1;
    const lastPlayed = excludeIndex !== undefined
      ? excludeIndex
      : getLastPlayedStoryIndex(level.cefr, level.levelNumber);

    const storyStats = stage.stories.map((s) => {
      const discovered = getDiscoveredEndings(level.cefr, level.levelNumber, s.storyIndex);
      return { storyIndex: s.storyIndex, count: discovered.length };
    });

    // Exclude last played story so opening or shuffling never gives consecutive duplicates!
    const nonRepeated = storyStats.filter((s) => s.storyIndex !== lastPlayed);
    const pool = nonRepeated.length > 0 ? nonRepeated : storyStats;

    const minCount = Math.min(...pool.map((s) => s.count));
    const candidates = pool.filter((s) => s.count === minCount);
    const chosen = candidates[Math.floor(Math.random() * candidates.length)].storyIndex;
    setLastPlayedStoryIndex(level.cefr, level.levelNumber, chosen);
    return chosen;
  }, [stage, level.cefr, level.levelNumber]);

  // Story selector (automatically shuffled on load to a guaranteed non-consecutive story)
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number>(() => {
    if (!stage || stage.stories.length === 0) return 1;
    const lastPlayed = getLastPlayedStoryIndex(level.cefr, level.levelNumber);
    const storyStats = stage.stories.map((s) => {
      const discovered = getDiscoveredEndings(level.cefr, level.levelNumber, s.storyIndex);
      return { storyIndex: s.storyIndex, count: discovered.length };
    });
    const nonRepeated = storyStats.filter((s) => s.storyIndex !== lastPlayed);
    const pool = nonRepeated.length > 0 ? nonRepeated : storyStats;
    const minCount = Math.min(...pool.map((s) => s.count));
    const candidates = pool.filter((s) => s.count === minCount);
    const chosen = candidates[Math.floor(Math.random() * candidates.length)].storyIndex;
    setLastPlayedStoryIndex(level.cefr, level.levelNumber, chosen);
    return chosen;
  });

  const story: OdysseyStory | undefined =
    stage?.stories.find((s) => s.storyIndex === selectedStoryIndex) || stage?.stories[0];

  // Refresh story whenever level changes
  useEffect(() => {
    const nextIdx = pickSmartStoryIndex();
    setSelectedStoryIndex(nextIdx);
  }, [level.cefr, level.levelNumber, pickSmartStoryIndex]);

  // Gameplay state
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isBriefingOpen, setIsBriefingOpen] = useState<boolean>(true);
  const [hearts, setHearts] = useState<number>(3);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isGatePassed, setIsGatePassed] = useState<boolean>(false);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [gateFeedback, setGateFeedback] = useState<"correct" | "wrong" | null>(null);
  const [evidenceHighlighted, setEvidenceHighlighted] = useState<boolean>(false);

  // Endings & Celebration state
  const [currentEnding, setCurrentEnding] = useState<OdysseyEnding | null>(null);
  const [discoveredEndingIds, setDiscoveredEndingIds] = useState<number[]>([]);
  const [completionResult, setCompletionResult] = useState<{
    finalScore: number;
    heartsRemaining: number;
    speedBonus: number;
    stars: number;
    elapsedSeconds: number;
    isNewEnding: boolean;
    totalEndings: number;
  } | null>(null);

  // Timer Ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load / Refresh Discovered Endings for the story
  const refreshEndings = useCallback(() => {
    if (!story) return;
    const ids = getDiscoveredEndings(level.cefr, level.levelNumber, story.storyIndex);
    setDiscoveredEndingIds(ids);
  }, [level.cefr, level.levelNumber, story]);

  // Reset Game loop for the selected story
  const initStorySession = useCallback((storyItem: OdysseyStory) => {
    setIsGameStarted(false);
    setIsBriefingOpen(true);
    setHearts(3);
    setElapsedSeconds(0);
    setIsGatePassed(false);
    setSelectedOptionIdx(null);
    setGateFeedback(null);
    setEvidenceHighlighted(false);
    setCurrentEnding(null);
    setCompletionResult(null);

    const ids = getDiscoveredEndings(level.cefr, level.levelNumber, storyItem.storyIndex);
    setDiscoveredEndingIds(ids);
  }, [level.cefr, level.levelNumber]);

  // Handle Story Change
  useEffect(() => {
    if (story) {
      initStorySession(story);
    }
  }, [selectedStoryIndex, story, initStorySession]);

  // Stopwatch Timer: Starts when briefing closes, counts UP, stops the exact moment isGatePassed becomes true
  useEffect(() => {
    if (!isGameStarted || isBriefingOpen || isGatePassed || currentEnding) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameStarted, isBriefingOpen, isGatePassed, currentEnding]);

  // Option selection logic
  const handleSelectOption = (idx: number) => {
    if (!story || isGatePassed) return;
    setSelectedOptionIdx(idx);

    if (idx === story.speedGate.correctIndex) {
      // Correct! Stopwatch is immediately stopped by setting isGatePassed to true
      soundSynth.playCorrect();
      setGateFeedback("correct");
      setIsGatePassed(true);
      setEvidenceHighlighted(false);
    } else {
      // Incorrect!
      soundSynth.playWrong();
      setGateFeedback("wrong");
      setEvidenceHighlighted(true);
      setHearts((prev) => Math.max(0, prev - 1));
    }
  };

  // Branch Decision selection logic
  const handleSelectChoice = (choice: OdysseyChoice) => {
    if (!story || !isGatePassed) return;

    const ending = story.endings.find((e) => e.id === choice.targetEndingId) || story.endings[0];
    setCurrentEnding(ending);

    // Calculate score based on elapsed seconds:
    // Faster completion yields higher speed points (from 10 up to 50 bonus points)
    const speedBonus = Math.max(10, Math.min(50, Math.round(55 - (elapsedSeconds * 0.75))));
    const heartsBonus = hearts === 3 ? 50 : hearts === 2 ? 30 : 10;
    const endingRarityBonus = ending.category === "legendary" ? 50 : ending.category === "secret" ? 35 : 20;
    const finalScore = 100 + speedBonus + heartsBonus + endingRarityBonus;

    const stars = hearts === 3 && elapsedSeconds <= 35 ? 3 : hearts >= 2 ? 2 : 1;

    // Record in game-storage (both final score and stopwatch best time)
    const outcome = recordReadingOdysseyCompletion(
      level.cefr,
      level.levelNumber,
      story.storyIndex,
      ending.id,
      {
        finalScore,
        heartsRemaining: hearts,
        speedBonus,
        stars,
        elapsedSeconds,
        baseXp: ending.xpReward,
      }
    );

    soundSynth.playFanfare();

    setCompletionResult({
      finalScore,
      heartsRemaining: hearts,
      speedBonus,
      stars,
      elapsedSeconds,
      isNewEnding: outcome.isNewEnding,
      totalEndings: outcome.totalStoryEndings,
    });

    refreshEndings();
  };

  // Switch to Next / Random Story in the stage (guaranteed different from current)
  const handlePickRandomStory = () => {
    const nextIndex = pickSmartStoryIndex(selectedStoryIndex);
    setSelectedStoryIndex(nextIndex);
  };

  if (!stage || !story) {
    return null;
  }

  // Theme Class
  const themeClass =
    stage.theme === "magic-academy"
      ? styles.themeMagic
      : stage.theme === "secret-lab"
      ? styles.themeLab
      : styles.themeSpace;

  const totalStageEndingsFound = getStageDiscoveredEndingsCount(level.cefr, level.levelNumber);

  return (
    <div className={styles.modalBackdrop}>
      <div className={`${styles.arenaContainer} ${themeClass}`}>
        {/* HEADER & HUD */}
        <div className={styles.arenaHeader}>
          <div className={styles.headerLeft}>
            <span className={`${styles.stageBadge} ${styles.badgeAccent}`}>
              {stage.theme === "magic-academy" && "✨ قصر جادوگری"}
              {stage.theme === "secret-lab" && "🧪 آزمایشگاه شگفت‌انگیز"}
              {stage.theme === "interstellar-command" && "🛸 سفینه فضایی ستاره‌ها"}
              <span>• سطح {stage.cefr} - مرحله {stage.levelNumber}</span>
            </span>

            <div className={styles.stageTitles}>
              <h2>{stage.stageTitleFa}</h2>
              <p>{stage.stageTitleEn}</p>
            </div>
          </div>

          <div className={styles.hudRight}>
            {/* Hearts Display */}
            <div className={styles.heartsContainer} title={`تعداد قلب‌های باقیمانده: ${hearts} تا`}>
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} style={{ opacity: i < hearts ? 1 : 0.25 }}>
                  ❤️
                </span>
              ))}
            </div>

            <BriefingTriggerButton onClick={() => setIsBriefingOpen(true)} />

            {/* Stage Progress Trophy Badge */}
            <div
              className={`${styles.stageBadge} ${styles.badgeAccent}`}
              title="تعداد رازهایی که تا الان در این مرحله پیدا کردی"
            >
              🏆 {totalStageEndingsFound} از ۱۰۰ راز مرحله
            </div>

            <button
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="بستن صفحه بازی"
              title="خروج از بازی"
            >
              ✕
            </button>
          </div>
        </div>

        {/* STAGE CONTEXT BRIEFING MODAL (1-sentence context + 1-sentence mission) */}
        <SkillStageBriefingModal
          skill="reading"
          cefr={level.cefr}
          levelNumber={level.levelNumber}
          isOpen={isBriefingOpen}
          onStart={() => {
            setIsBriefingOpen(false);
            setIsGameStarted(true);
          }}
          titleFa={story?.titleFa || stage?.stageTitleFa}
          titleEn={story?.titleEn || stage?.stageTitleEn}
        />
          <>
            {/* AUTOMATIC STORY OVERVIEW BANNER */}
            <div className={styles.storyBanner}>
              <div className={styles.storyBannerInfo}>
                <div className={styles.storyBannerMeta}>
                  <span className={styles.storyBannerTag}>
                    📖 قصه تصادفی این مرحله
                  </span>
                  <span className={styles.storyBannerEndingsCount}>
                    🏆 {discoveredEndingIds.length} از ۱۰ پایان این قصه رو پیدا کردی!
                  </span>
                </div>
                <h3 className={styles.storyBannerTitle}>
                  {story.titleFa}
                </h3>
                <p className={styles.storyBannerSynopsis}>
                  {story.synopsisFa}
                </p>
              </div>

              <button
                className={styles.storyRollBtn}
                onClick={handlePickRandomStory}
                type="button"
                title="یه قصه دیگه از همین مرحله بازی کن"
              >
                🎲 یه قصه دیگه برام بیار!
              </button>
            </div>

            {/* STORY PASSAGE (READING CARD) */}
            <div className={styles.passageCard}>
              <div className={styles.passageHeaderLtr}>
                <span>
                  <strong>Scene Text</strong> • {story.wordCount} words • CEFR {level.cefr}
                </span>
                <span>⏱️ متن قصه انگلیسی رو با دقت بخون!</span>
              </div>

              <p className={styles.passageText}>
                {evidenceHighlighted && story.speedGate.evidenceSnippet ? (
                  // Highlight the evidence if student made a mistake
                  <span>
                    {story.passage.split(story.speedGate.evidenceSnippet).map((part, i, arr) => (
                      <React.Fragment key={i}>
                        {part}
                        {i < arr.length - 1 && (
                          <mark className={styles.evidenceHighlight}>
                            {story.speedGate.evidenceSnippet}
                          </mark>
                        )}
                      </React.Fragment>
                    ))}
                  </span>
                ) : (
                  story.passage
                )}
              </p>
            </div>

            {/* SPEED GATE (COMPREHENSION QUIZ) */}
            <div className={styles.speedGateContainer}>
              <div className={styles.gateHeader}>
                <div className={styles.gateTitle}>
                  <span>⚡ معمای سرعتی قصه!</span>
                  {isGatePassed ? (
                    <span style={{ color: "#10b981", fontWeight: 800 }}>✔ هورااا! درها باز شدن!</span>
                  ) : (
                    <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                      (جواب درست رو بزن تا درهای قصه باز بشن!)
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      background: isGatePassed ? "rgba(16, 185, 129, 0.15)" : "rgba(59, 130, 246, 0.1)",
                      color: isGatePassed ? "#059669" : "#2563eb",
                      border: `1px solid ${isGatePassed ? "#10b98155" : "#3b82f644"}`,
                      padding: "0.25rem 0.65rem",
                      borderRadius: "0.5rem",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    ⏱️ {isGatePassed ? `زمان ثبت‌شده: ${formatStopwatchTime(elapsedSeconds)}` : `زمان سپری‌شده: ${formatStopwatchTime(elapsedSeconds)}`}
                  </span>
                </div>
              </div>

          <div>
            <p className={styles.gateQuestion}>{story.speedGate.questionEn}</p>
            <p className={styles.gateQuestionFa}>{story.speedGate.questionFa}</p>
          </div>

          <div className={styles.optionsGrid}>
            {story.speedGate.options.map((opt, optIdx) => {
              const isSelected = selectedOptionIdx === optIdx;
              const isCorrectOpt = optIdx === story.speedGate.correctIndex;

              let btnClass = styles.optionBtn;
              if (isSelected && isGatePassed) btnClass += ` ${styles.optionCorrect}`;
              else if (isSelected && gateFeedback === "wrong") btnClass += ` ${styles.optionWrong}`;
              else if (isGatePassed && isCorrectOpt) btnClass += ` ${styles.optionCorrect}`;

              return (
                <button
                  key={optIdx}
                  className={btnClass}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={isGatePassed}
                >
                  <span style={{ opacity: 0.6, fontWeight: 700 }}>
                    {String.fromCharCode(65 + optIdx)}.
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback Banner */}
          {gateFeedback === "wrong" && (
            <div className={`${styles.feedbackBanner} ${styles.feedbackWrong}`}>
              <span>💔 ای وای! یکی از قلب‌هات پرید! به کلمات زرد رنگ قصه نگاه کن و دوباره حدس بزن:</span>
              <span style={{ fontStyle: "italic", direction: "ltr" }}>
                "{story.speedGate.evidenceSnippet}"
              </span>
            </div>
          )}

          {gateFeedback === "correct" && (
            <div className={`${styles.feedbackBanner} ${styles.feedbackCorrect}`}>
              <span>🎉 آفرین به هوشت! درهای قصه باز شدن! حالا یکی از راه‌های زیر رو انتخاب کن:</span>
            </div>
          )}
        </div>

        {/* BRANCHING DECISION CHOICES (UNLOCKED AFTER SPEED GATE) */}
        {isGatePassed && !currentEnding && (
          <div className={styles.branchingSection}>
            <div className={styles.branchHeader}>
              <div className={styles.branchTitle}>
                <span>🚪 درهای جادویی قصه (یکیش رو انتخاب کن!):</span>
              </div>
              <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                ببین با انتخابت ته قصه چی میشه!
              </span>
            </div>

            <div className={styles.choicesGrid}>
              {story.choices.map((choice) => (
                <div
                  key={choice.id}
                  className={styles.choiceCard}
                  onClick={() => handleSelectChoice(choice)}
                >
                  <div className={styles.choiceEn}>➔ {choice.textEn}</div>
                  <div className={styles.choiceFa}>{choice.textFa}</div>
                  <div className={styles.choicePathSummary}>{choice.pathSummaryEn}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ENDING REVEAL & CELEBRATION MODAL */}
        {currentEnding && completionResult && (
          <div className={styles.endingCelebration}>
            <div className={styles.endingBadgeBig}>{currentEnding.badgeIcon}</div>

            <span className={styles.endingCategoryLabel}>
              {currentEnding.badgeLabelFa}
            </span>

            <div>
              <h2 className={styles.endingTitleEn}>{currentEnding.titleEn}</h2>
              <h3 className={styles.endingTitleFa}>{currentEnding.titleFa}</h3>
            </div>

            <div className={styles.endingDescCard}>
              <p className={styles.endingDescEn}>{currentEnding.descriptionEn}</p>
              <p className={styles.endingDescFa}>{currentEnding.descriptionFa}</p>
            </div>

            {/* Score & Stars Pills */}
            <div className={styles.scorePillsRow}>
              <span className={styles.scorePill}>
                ⭐ {completionResult.stars === 3 ? "⭐⭐⭐" : completionResult.stars === 2 ? "⭐⭐" : "⭐"} ستاره درخشان
              </span>
              <span className={styles.scorePill} style={{ background: "rgba(139, 92, 246, 0.2)", color: "#7c3aed" }}>
                ⏱️ زمان مطالعه: {formatStopwatchTime(completionResult.elapsedSeconds)}
              </span>
              <span className={styles.scorePill}>
                ⚡ جایزه سرعت و زرنگی: +{completionResult.speedBonus}
              </span>
              <span className={styles.scorePill}>
                ❤️ قلب‌های سالمت: {completionResult.heartsRemaining} از ۳
              </span>
              <span className={styles.scorePill} style={{ background: "rgba(16, 185, 129, 0.25)" }}>
                🏆 امتیاز این دست: {completionResult.finalScore}
              </span>
              {completionResult.isNewEnding && (
                <span className={styles.scorePill} style={{ background: "rgba(234, 179, 8, 0.3)" }}>
                  🆕 هورا! یه راز جدید باز کردی!
                </span>
              )}
            </div>

            {/* CODEX OF 10 ENDINGS FOR THIS STORY */}
            <div className={styles.codexSection}>
              <div className={styles.codexHeader}>
                <div className={styles.codexTitle}>
                  <span>🏛️ صندوقچه ۱۰ تا پایان این قصه:</span>
                </div>
                <span style={{ fontSize: "0.8rem", fontWeight: 800 }}>
                  🏆 {discoveredEndingIds.length} از ۱۰ تا راز رو پیدا کردی!
                </span>
              </div>

              <div className={styles.codexGrid}>
                {story.endings.map((endItem) => {
                  const isFound = discoveredEndingIds.includes(endItem.id);
                  const isCurrent = currentEnding.id === endItem.id;

                  return (
                    <div
                      key={endItem.id}
                      className={`${styles.codexSlot} ${
                        isFound ? styles.codexUnlocked : styles.codexLocked
                      }`}
                      style={{
                        outline: isCurrent ? "2px solid #fff" : "none",
                      }}
                      title={`${endItem.id}. ${endItem.badgeLabelFa} - ${endItem.titleFa}`}
                    >
                      <span>{isFound ? endItem.badgeIcon : "🔒"}</span>
                      <span className={styles.codexSlotNumber}>{endItem.id}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionsRow}>
              <button
                className={styles.primaryActionBtn}
                onClick={() => {
                  initStorySession(story);
                  setIsGameStarted(true);
                }}
              >
                🔄 می‌خوام یه راه دیگه رو امتحان کنم!
              </button>

              <button
                className={styles.secondaryActionBtn}
                onClick={handlePickRandomStory}
              >
                🎲 یه قصه دیگه از این مرحله برام بیار!
              </button>

              {onOpenLeaderboard && (
                <button
                  className={styles.secondaryActionBtn}
                  onClick={onOpenLeaderboard}
                >
                  📊 جدول قهرمان‌ها
                </button>
              )}

              {onNextLevel && level.levelNumber < 10 && (
                <button
                  className={styles.primaryActionBtn}
                  style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
                  onClick={onNextLevel}
                >
                  ▶️ بریم مرحله بعدی ({level.levelNumber + 1})!
                </button>
              )}
            </div>
          </div>
        )}
      </>
  </div>
</div>
  );
}

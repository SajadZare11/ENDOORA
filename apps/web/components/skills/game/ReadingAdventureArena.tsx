"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import styles from "./reading-adventure.module.css";
import type { CefrLevel } from "../../../data/skills/games/types";
import type {
  AdventureStory,
  AdventureNode,
  AdventureEnding,
  AdventureKeyword,
} from "../../../data/skills/games/reading-adventure-types";
import { recordAdventureCompletion } from "../../../lib/skills/reading-adventure-storage";
import { soundSynth } from "../../../lib/skills/game-audio";

interface Props {
  story: AdventureStory;
  cefr: CefrLevel;
  onClose: () => void;
  onCompleted?: (result: { storyId: string; endingId: string; isLevelPassed: boolean }) => void;
}

export function ReadingAdventureArena({ story, cefr, onClose, onCompleted }: Props) {
  // Navigation / Node state
  const [currentNodeId, setCurrentNodeId] = useState<string>(story.rootNodeId);
  const currentNode: AdventureNode = story.nodes[currentNodeId] || story.nodes[story.rootNodeId];

  // Gameplay state
  const [hearts, setHearts] = useState<number>(5);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // Question & Choice state
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showChoices, setShowChoices] = useState<boolean>(false);

  // Vocabulary & Tooltip state
  const [vocabActive, setVocabActive] = useState<boolean>(false);
  const [activeTooltipWord, setActiveTooltipWord] = useState<string | null>(null);

  // Climax & Ending state
  const [currentEnding, setCurrentEnding] = useState<AdventureEnding | null>(null);
  const [endingResult, setEndingResult] = useState<{
    isNewEnding: boolean;
    totalStoryEndings: number;
    isLevelPassed: boolean;
  } | null>(null);

  // Stopwatch timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isGameOver || currentEnding) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameOver, currentEnding]);

  // Pronunciation speech synthesis
  const playWordAudio = (word: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      utterance.rate = 0.85; // gently measured pace for Iranian learners
      window.speechSynthesis.speak(utterance);
    }
  };

  // Option selection
  const handleSelectOption = (idx: number) => {
    if (selectedOptionIdx !== null || isGameOver) return;
    setSelectedOptionIdx(idx);

    if (idx === currentNode.question.correctIndex) {
      soundSynth.playCorrect();
      setIsAnswerCorrect(true);
      setShowChoices(true);
    } else {
      soundSynth.playWrong();
      setIsAnswerCorrect(false);
      setHearts((prev) => {
        const next = Math.max(0, prev - 1);
        if (next === 0) {
          setIsGameOver(true);
        }
        return next;
      });
      // Allow re-answering on next attempt after wrong answer feedback
      setTimeout(() => {
        setSelectedOptionIdx(null);
        setIsAnswerCorrect(null);
      }, 1200);
    }
  };

  // Choice selection (branching to next step or reaching ending)
  const handleSelectChoice = (choice: { nextNodeId?: string; endingId?: string }) => {
    if (choice.endingId) {
      // Reached 1 of the 32 endings!
      const ending = story.endings[choice.endingId] || Object.values(story.endings)[0];
      const speedBonus = Math.max(10, Math.min(50, Math.round(55 - elapsedSeconds * 0.5)));
      const score = ending.xpReward + hearts * 10 + speedBonus;

      const outcome = recordAdventureCompletion(cefr, story.id, ending.id, elapsedSeconds, score);
      soundSynth.playFanfare();

      setCurrentEnding(ending);
      setEndingResult(outcome);
      if (onCompleted) {
        onCompleted({ storyId: story.id, endingId: ending.id, isLevelPassed: outcome.isLevelPassed });
      }
    } else if (choice.nextNodeId) {
      // Proceed to next step in this branch
      setCurrentNodeId(choice.nextNodeId);
      setSelectedOptionIdx(null);
      setIsAnswerCorrect(null);
      setShowChoices(false);
      setActiveTooltipWord(null);
    }
  };

  // Restart after game over
  const handleRestart = () => {
    setCurrentNodeId(story.rootNodeId);
    setHearts(5);
    setElapsedSeconds(0);
    setIsGameOver(false);
    setSelectedOptionIdx(null);
    setIsAnswerCorrect(null);
    setShowChoices(false);
    setCurrentEnding(null);
    setActiveTooltipWord(null);
  };

  // Format stopwatch
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Map words to keywords for interactive tooltips
  const keywordMap = useMemo(() => {
    const map = new Map<string, AdventureKeyword>();
    for (const kw of currentNode.keywords) {
      map.set(kw.word.toLowerCase(), kw);
    }
    return map;
  }, [currentNode.keywords]);

  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleWordMouseEnter = (clean: string) => {
    if (!vocabActive) return;
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    setActiveTooltipWord(clean);
  };

  const handleWordMouseLeave = () => {
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    tooltipTimeoutRef.current = setTimeout(() => {
      setActiveTooltipWord(null);
    }, 350);
  };

  const handleTooltipMouseEnter = () => {
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
  };

  const handleTooltipMouseLeave = () => {
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    tooltipTimeoutRef.current = setTimeout(() => {
      setActiveTooltipWord(null);
    }, 200);
  };

  // Render passage tokens with vocabulary interaction
  const renderPassageTokens = () => {
    const text = currentNode.passageEn;
    const tokens = text.split(/(\s+|[.,!?:;"'()]+)/);

    return tokens.map((token, i) => {
      const clean = token.toLowerCase().trim();
      const kw = keywordMap.get(clean);

      if (kw) {
        const isTooltipOpen = activeTooltipWord === clean;
        return (
          <span
            key={i}
            className={`${styles.annotatedWord} ${vocabActive ? styles.annotatedActive : ""}`}
            onMouseEnter={() => handleWordMouseEnter(clean)}
            onMouseLeave={handleWordMouseLeave}
            onClick={() => setActiveTooltipWord(isTooltipOpen ? null : clean)}
          >
            {token}
            {isTooltipOpen && (
              <div
                className={styles.wordTooltip}
                onMouseEnter={handleTooltipMouseEnter}
                onMouseLeave={handleTooltipMouseLeave}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className={styles.audioSpeakerBtn}
                  onClick={(e) => playWordAudio(kw.word, e)}
                  title="شنیدن تلفظ کلمه"
                  aria-label="پخش تلفظ انگلیسی"
                >
                  🔊
                </button>
                <span>
                  <strong>{kw.word}</strong> {kw.phonetic ? `[${kw.phonetic}]` : ""}: {kw.meaningFa}
                </span>
              </div>
            )}
          </span>
        );
      }
      return <span key={i}>{token}</span>;
    });
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.arenaCard}>
        {/* HEADER & HUD */}
        <div className={styles.arenaHeader}>
          <div className={styles.headerLeft}>
            <span style={{ fontSize: "1.4rem" }}>{story.genreIcon}</span>
            <div>
              <h3 className={styles.headerTitle}>{story.titleFa}</h3>
              <span style={{ fontSize: "0.8rem", color: "#8b5cf6", fontWeight: 700, direction: "ltr" }}>
                {story.titleEn} • {cefr}
              </span>
            </div>
          </div>

          <div className={styles.hudRight}>
            {/* 5 HEARTS */}
            <div
              className={styles.heartsBar}
              title={`تعداد قلب‌های باقیمانده: ${hearts} از ۵`}
              aria-label={`تعداد قلب‌ها: ${hearts}`}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ opacity: i < hearts ? 1 : 0.25, transition: "opacity 0.2s" }}>
                  ❤️
                </span>
              ))}
            </div>

            {/* Step Counter */}
            <div className={styles.stepPill}>مرحله {currentNode.stepNumber} از ۵</div>

            {/* Stopwatch Timer */}
            <div className={styles.timerPill} title="زمان صرف‌شده">
              ⏱️ {formatTime(elapsedSeconds)}
            </div>

            {/* Close Button */}
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="بستن صفحه بازی"
              title="خروج از بازی"
            >
              ✕
            </button>
          </div>
        </div>

        {/* GAME OVER STATE */}
        {isGameOver ? (
          <div className={styles.endingSection} style={{ borderColor: "#ef4444" }}>
            <span style={{ fontSize: "4rem" }}>💔</span>
            <div className={styles.endingCategoryPill} style={{ background: "#fee2e2", color: "#b91c1c", borderColor: "#ef4444" }}>
              قلب‌ها تمام شد
            </div>
            <h3 className={styles.endingTitleFa} style={{ color: "#b91c1c" }}>
              اشکالی نداره قهرمانِ من!
            </h3>
            <p className={styles.endingClimaxText} style={{ borderColor: "#fca5a5" }}>
              قهرمان‌های بزرگ هم گاهی وقت‌ها زمین می‌خورند تا قوی‌تر بلند بشن! با دقت بیشتر و خوندن آروم متن، مطمئنم این دفعه خیلی راحت تا پایان داستان پیش می‌ری.
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="button" className={styles.returnBtn} onClick={handleRestart}>
                🔄 شروع دوباره از مرحله ۱
              </button>
              <button type="button" className={styles.replayBtn} onClick={onClose}>
                خروج به منوی اصلی
              </button>
            </div>
          </div>
        ) : currentEnding ? (
          /* CLIMAX & ENDING CELEBRATION (1 OF 32 ENDINGS REACHED) */
          <div className={styles.endingSection}>
            <div className={styles.endingBadgeIcon}>{currentEnding.badgeIcon}</div>
            <div className={styles.endingCategoryPill}>
              {currentEnding.badgeNameFa} • {currentEnding.pathCode}
            </div>
            <div>
              <h2 className={styles.endingTitleEn}>{currentEnding.titleEn}</h2>
              <h3 className={styles.endingTitleFa}>{currentEnding.titleFa}</h3>
            </div>

            <div className={styles.endingClimaxText}>
              <p style={{ margin: "0 0 0.5rem", fontWeight: 700, color: "#1e1b4b", direction: "ltr", textAlign: "left" }}>
                {currentEnding.climaxEn}
              </p>
              <p style={{ margin: 0, color: "#64748b", fontWeight: 600 }}>
                {currentEnding.climaxFa}
              </p>
            </div>

            <div className={styles.endingStatsRow}>
              <div className={styles.statPill} style={{ color: "#d97706" }}>
                ⭐ {hearts === 5 ? "⭐⭐⭐ بی‌نقص" : hearts >= 3 ? "⭐⭐ عالی" : "⭐ خوب"}
              </div>
              <div className={styles.statPill} style={{ color: "#8b5cf6" }}>
                ⚡ +{currentEnding.xpReward} XP پاداش
              </div>
              <div className={styles.statPill} style={{ color: "#0284c7" }}>
                ⏱️ زمان: {formatTime(elapsedSeconds)}
              </div>
              <div className={styles.statPill} style={{ color: "#10b981" }}>
                🏆 {endingResult?.totalStoryEndings || 1} از ۳۲ پایان کشف شد!
              </div>
            </div>

            {endingResult?.isLevelPassed && (
              <div
                style={{
                  background: "#d1fae5",
                  color: "#065f46",
                  border: "1.5px solid #10b981",
                  borderRadius: "0.75rem",
                  padding: "0.6rem 1.25rem",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                }}
              >
                🎉 تبریک! با تکمیل این داستان، سطح {cefr} را با موفقیت فتح کردی!
              </div>
            )}

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
              <button type="button" className={styles.returnBtn} onClick={onClose}>
                ✅ بازگشت به فهرست ماجراجویی‌ها
              </button>
              <button type="button" className={styles.replayBtn} onClick={handleRestart}>
                🔄 امتحان یک مسیر و پایان دیگر
              </button>
            </div>
          </div>
        ) : (
          /* REGULAR STEP PLAY CARD */
          <>
            {/* PASSAGE BOX */}
            <div className={styles.passageBox}>
              <div className={styles.passageTopToolbar}>
                <button
                  type="button"
                  className={`${styles.vocabToggleBtn} ${vocabActive ? styles.vocabToggleBtnActive : ""}`}
                  onClick={() => {
                    const next = !vocabActive;
                    setVocabActive(next);
                    if (!next) setActiveTooltipWord(null);
                  }}
                  title="با کلیک روی این دکمه کلمات مهم زیرخط‌دار می‌شوند و با رفتن موس روی آن‌ها معنی و تلفظ صوتی نمایش داده می‌شود."
                >
                  <span>🔑</span>
                  <span>{vocabActive ? "پنهان کردن کلمات کلیدی" : "کلمات کلیدی و مهم"}</span>
                </button>

                <span style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 700 }}>
                  {vocabActive ? "💡 موس را روی کلمات زیرخط‌دار ببر یا لمس کن تا معنی و صدای 🔊 آن را بشنوی!" : "متن رو بخون و به سوال پاسخ بده:"}
                </span>
              </div>

              <div className={styles.passageContent}>{renderPassageTokens()}</div>
            </div>

            {/* GENTLE CLUE BOX (Shown if hearts <= 2) */}
            {hearts <= 2 && (
              <div className={styles.clueBox}>
                <span style={{ fontSize: "1.3rem" }}>💡</span>
                <div>
                  <strong>راهنمایی مهربان: </strong>
                  {currentNode.question.clueFa}
                  <div style={{ marginTop: "0.4rem", fontSize: "0.85rem", fontStyle: "italic", direction: "ltr", textAlign: "left" }}>
                    Clue in text: &ldquo;<span className={styles.hintHighlighted}>{currentNode.question.hintSnippet}</span>&rdquo;
                  </div>
                </div>
              </div>
            )}

            {/* COMPREHENSION QUESTION */}
            <div className={styles.questionSection}>
              <div className={styles.questionTitle}>
                <p className={styles.questionPromptEn}>{currentNode.question.promptEn}</p>
                <p className={styles.questionPromptFa}>{currentNode.question.promptFa}</p>
              </div>

              <div className={styles.optionsGrid}>
                {currentNode.question.options.map((opt, idx) => {
                  const isSelected = selectedOptionIdx === idx;
                  let optClass = styles.optionBtn;
                  if (isSelected && isAnswerCorrect === true) {
                    optClass = `${styles.optionBtn} ${styles.optionCorrect}`;
                  } else if (isSelected && isAnswerCorrect === false) {
                    optClass = `${styles.optionBtn} ${styles.optionWrong}`;
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      className={optClass}
                      disabled={showChoices}
                      onClick={() => handleSelectOption(idx)}
                    >
                      <span>{opt}</span>
                      {isSelected && isAnswerCorrect === true && <span>✅ آفرین!</span>}
                      {isSelected && isAnswerCorrect === false && <span>❌ تلاش مجدد...</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CYOA BRANCH DECISION SECTION (Revealed after correct answer) */}
            {showChoices && (
              <div className={styles.choicesSection}>
                <div className={styles.choicesHeader}>
                  <h3>✨ مسیر ادامه داستانت رو انتخاب کن!</h3>
                  <p>انتخاب تو تعیین می‌کنه که در مرحله بعد چه ماجرایی برات رقم بخوره:</p>
                </div>

                <div className={styles.choicesCardsGrid}>
                  {currentNode.choices.map((choice) => (
                    <div
                      key={choice.id}
                      className={styles.choiceCard}
                      onClick={() => handleSelectChoice(choice)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className={styles.choiceCardHeader}>
                        <span className={styles.choiceLetterBadge}>{choice.id}</span>
                        <h4>{choice.labelFa}</h4>
                      </div>
                      <p style={{ direction: "ltr", textAlign: "left", fontSize: "0.86rem", fontWeight: 700, color: "#6b21a8" }}>
                        {choice.labelEn}
                      </p>
                      <p>{choice.descriptionFa}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

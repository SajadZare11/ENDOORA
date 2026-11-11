"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CEFRLevel,
  CEFRWord,
  CEFRCardState,
  LEITNER_BOX_META,
  CEFR_LEVELS_META,
} from "../../../data/cefr/types";
import { promoteCard, demoteCard } from "../../../lib/cefr-leitner-storage";
import { playEnglishSpeech, stopEnglishSpeech } from "../../../lib/speech";
import styles from "./leitner.module.css";

interface LeitnerActiveRecallArenaProps {
  level: CEFRLevel;
  dueItems: Array<{ card: CEFRCardState; word: CEFRWord }>;
  onComplete: () => void;
  onExit: () => void;
}

export const LeitnerActiveRecallArena: React.FC<LeitnerActiveRecallArenaProps> = ({
  level,
  dueItems,
  onComplete,
  onExit,
}) => {
  const [cards, setCards] = useState<Array<{ card: CEFRCardState; word: CEFRWord }>>(dueItems);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [promotedCount, setPromotedCount] = useState(0);
  const [demotedCount, setDemotedCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [accent, setAccent] = useState<"en-US" | "en-GB">("en-US");

  const currentItem = cards[currentIndex];
  const meta = CEFR_LEVELS_META[level];

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      stopEnglishSpeech();
    };
  }, []);

  const handlePronounce = useCallback(
    (text: string, rate = 0.92) => {
      playEnglishSpeech(text, { accent, rate });
    },
    [accent]
  );

  const handleFlip = useCallback(() => {
    setIsFlipped(true);
    if (currentItem?.word?.word) {
      setTimeout(() => {
        handlePronounce(currentItem.word.word);
      }, 150);
    }
  }, [currentItem, handlePronounce]);

  const handleSuccess = useCallback(() => {
    if (!currentItem) return;
    promoteCard(level, currentItem.word.id);
    setPromotedCount((c) => c + 1);
    advanceCard();
  }, [currentItem, level]);

  const handleFailure = useCallback(() => {
    if (!currentItem) return;
    demoteCard(level, currentItem.word.id);
    setDemotedCount((c) => c + 1);
    advanceCard();
  }, [currentItem, level]);

  const advanceCard = () => {
    setIsFlipped(false);
    stopEnglishSpeech();
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setIsFinished(true);
    }
  };

  // Keyboard controls: Space to flip, 1 or Left arrow for demote, 2 or Right arrow for promote
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished || !currentItem) return;

      if (e.code === "Space" && !isFlipped) {
        e.preventDefault();
        handleFlip();
      } else if (isFlipped) {
        if (e.key === "1" || e.code === "ArrowLeft") {
          e.preventDefault();
          handleFailure();
        } else if (e.key === "2" || e.code === "ArrowRight") {
          e.preventDefault();
          handleSuccess();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped, isFinished, currentItem, handleFlip, handleFailure, handleSuccess]);

  if (isFinished || cards.length === 0) {
    return (
      <div className={styles.arenaContainer}>
        <div className={styles.arenaCardFinished}>
          <div className={styles.finishedIcon}>🏆</div>
          <h2 className={styles.finishedTitle}>مرور لایتنر امروز کامل شد!</h2>
          <p className={styles.finishedSubtitle}>
            شما تمامی کارت‌های سررسید شده سطح {level} را با روش بازیابی فعال (Active Recall) مرور کردید.
          </p>

          <div className={styles.reviewResultsGrid}>
            <div className={styles.resultBoxSuccess}>
              <span className={styles.resultBoxNumber}>+{promotedCount}</span>
              <span className={styles.resultBoxLabel}>کارت ارتقایافته به خانه‌های بالاتر</span>
            </div>

            <div className={styles.resultBoxDemoted}>
              <span className={styles.resultBoxNumber}>{demotedCount}</span>
              <span className={styles.resultBoxLabel}>کارت بازگشته به خانه ۱ برای بازآموزی</span>
            </div>
          </div>

          <div className={styles.arenaFinishedActions}>
            <button
              type="button"
              className={styles.primaryActionButton}
              onClick={onComplete}
            >
              بازگشت به قفسه جعبه لایتنر
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { card, word } = currentItem;
  const boxMeta = LEITNER_BOX_META[card.boxLevel];
  const progressPercent = Math.round(((currentIndex) / cards.length) * 100);

  return (
    <div className={styles.arenaContainer} aria-label="اتاق مرور کارت‌های لایتنر">
      {/* Header */}
      <div className={styles.arenaHeader}>
        <button
          type="button"
          onClick={onExit}
          className={styles.arenaExitButton}
          aria-label="خروج از مرور"
        >
          ✕ خروج از مرور
        </button>

        <div className={styles.arenaProgressInfo}>
          <span className={styles.arenaLessonBadge} style={{ backgroundColor: `${meta.badgeColor}20`, color: meta.badgeColor }}>
            {meta.icon} سطح {level}
          </span>
          <span className={styles.boxBadgeSmall} style={{ backgroundColor: `${boxMeta.color}20`, color: boxMeta.color, borderColor: boxMeta.color }}>
            {boxMeta.icon} {boxMeta.labelFa}
          </span>
          <span className={styles.arenaStepCounter}>
            کارت <strong>{currentIndex + 1}</strong> از {cards.length}
          </span>
        </div>

        <div className={styles.accentSelector}>
          <button
            type="button"
            className={`${styles.accentBtn} ${accent === "en-US" ? styles.accentBtnActive : ""}`}
            onClick={() => setAccent("en-US")}
          >
            🇺🇸 US
          </button>
          <button
            type="button"
            className={`${styles.accentBtn} ${accent === "en-GB" ? styles.accentBtnActive : ""}`}
            onClick={() => setAccent("en-GB")}
          >
            🇬🇧 UK
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={styles.arenaProgressBar}>
        <div
          className={styles.arenaProgressFill}
          style={{ width: `${progressPercent}%`, backgroundColor: boxMeta.color }}
        />
      </div>

      {/* Active Recall Card */}
      <div className={styles.recallCard}>
        {/* Front of Card: Clue / Challenge */}
        {!isFlipped ? (
          <div className={styles.recallFront}>
            <div className={styles.inductiveHeaderSection}>
              <div className={styles.partOfSpeechBadge}>{word.partOfSpeechLabelFa}</div>
              <span className={styles.stepBadge}>بازیابی فعال حافظه (Active Recall)</span>
            </div>

            <div className={styles.recallQuestionBox}>
              <h3 className={styles.recallChallengeTitle}>
                🧠 آیا واژه انگلیسی این مفهوم را به خاطر دارید؟
              </h3>

              <div className={styles.inductiveContextBox}>
                <p className={styles.inductiveContextSentence}>
                  {word.inductiveClues.contextClueEn}
                </p>
                <div className={styles.inductiveSituationHint}>
                  <span className={styles.hintIcon}>🧭</span>
                  <span>{word.inductiveClues.situationHintFa}</span>
                </div>
              </div>

              {(word.inductiveClues.synonyms?.length || 0) > 0 && (
                <div className={styles.synonymsRow}>
                  <span className={styles.synonymLabel}>مترادف‌ها:</span>
                  {word.inductiveClues.synonyms?.map((s, idx) => (
                    <span key={idx} className={styles.synonymPill}>
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className={styles.flipCardButton}
              onClick={handleFlip}
              autoFocus
            >
              🔄 برگرداندن کارت (بررسی درستی پاسخ)
            </button>
            <span className={styles.keyboardHint}>(یا کلید Space را فشار دهید)</span>
          </div>
        ) : (
          /* Back of Card: Reveal & Rating */
          <div className={styles.recallBack}>
            <div className={styles.revealedSection}>
              <div className={styles.revealedWordHero}>
                <div className={styles.revealedWordRow}>
                  <h1 className={styles.targetWordTitle}>{word.word}</h1>
                  <span className={styles.targetWordPhonetic}>{word.phonetic}</span>
                </div>

                <div className={styles.pronunciationControls}>
                  <button
                    type="button"
                    className={styles.audioPlayButton}
                    onClick={() => handlePronounce(word.word)}
                  >
                    🔊 تلفظ صوتی
                  </button>
                </div>
              </div>

              <div className={styles.meaningsCard}>
                <div className={styles.meaningFaBlock}>
                  <span className={styles.meaningFaLabel}>معنی فارسی:</span>
                  <span className={styles.meaningFaText}>{word.meaningFa}</span>
                </div>
                <div className={styles.definitionEnBlock}>
                  <span className={styles.definitionEnLabel}>English Definition:</span>
                  <span className={styles.definitionEnText}>{word.englishDefinition}</span>
                </div>
              </div>

              <div className={styles.practicalExampleCard}>
                <div className={styles.practicalExampleHeader}>
                  <span className={styles.practicalIcon}>💬</span>
                  <h4>مثال کاربردی:</h4>
                  <button
                    type="button"
                    className={styles.exampleAudioButton}
                    onClick={() => handlePronounce(word.practicalExample.sentenceEn)}
                  >
                    🔊 پخش جمله
                  </button>
                </div>
                <p className={styles.practicalSentenceEn}>
                  {word.practicalExample.sentenceEn}
                </p>
                <p className={styles.practicalSentenceFa}>
                  «{word.practicalExample.translationFa}»
                </p>
              </div>

              {/* Leitner Rating Decision */}
              <div className={styles.leitnerDecisionContainer}>
                <h4 className={styles.decisionTitle}>آیا این واژه را به درستی به یاد آوردید؟</h4>
                <div className={styles.decisionButtonsRow}>
                  <button
                    type="button"
                    className={styles.promoteDecisionBtn}
                    onClick={handleSuccess}
                  >
                    🟢 کاملاً بلد بودم (+ ارتقا به خانه بعدی)
                  </button>

                  <button
                    type="button"
                    className={styles.demoteDecisionBtn}
                    onClick={handleFailure}
                  >
                    🔴 فراموش کرده بودم (- بازگشت به خانه ۱)
                  </button>
                </div>
                <span className={styles.keyboardDecisionHint}>
                  (کلید ۱: فراموش کردم | کلید ۲: بلد بودم)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CEFRWord, CEFRLevel, CEFR_LEVELS_META } from "../../../data/cefr/types";
import { addWordToBox1 } from "../../../lib/cefr-leitner-storage";
import { playEnglishSpeech, stopEnglishSpeech } from "../../../lib/speech";
import styles from "./leitner.module.css";

interface InductiveLessonArenaProps {
  level: CEFRLevel;
  lessonIndex: number;
  words: CEFRWord[];
  onComplete: () => void;
  onExit: () => void;
}

export const InductiveLessonArena: React.FC<InductiveLessonArenaProps> = ({
  level,
  lessonIndex,
  words,
  onComplete,
  onExit,
}) => {
  const [queue, setQueue] = useState<CEFRWord[]>(words);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [accent, setAccent] = useState<"en-US" | "en-GB">("en-US");
  const [learnedWords, setLearnedWords] = useState<CEFRWord[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentWord = queue[currentIndex];
  const meta = CEFR_LEVELS_META[level];

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      stopEnglishSpeech();
    };
  }, []);

  // Play audio pronunciation for target word
  const handlePronounceWord = useCallback(
    (rate = 0.92) => {
      if (!currentWord) return;
      setIsPlayingAudio(true);
      playEnglishSpeech(currentWord.word, {
        accent,
        rate,
        onEnd: () => setIsPlayingAudio(false),
      });
    },
    [currentWord, accent]
  );

  // Play audio for example sentence
  const handlePronounceSentence = useCallback(() => {
    if (!currentWord?.practicalExample?.sentenceEn) return;
    setIsPlayingAudio(true);
    playEnglishSpeech(currentWord.practicalExample.sentenceEn, {
      accent,
      rate: 0.9,
      onEnd: () => setIsPlayingAudio(false),
    });
  }, [currentWord, accent]);

  // Reveal step: automatically pronounces the word when opened
  const handleReveal = () => {
    setIsRevealed(true);
    // Auto-pronounce native audio
    setTimeout(() => {
      handlePronounceWord(0.92);
    }, 150);
  };

  // Student marked word as learned -> Add to Box 1
  const handleMasterWord = () => {
    if (!currentWord) return;
    addWordToBox1(currentWord);
    setLearnedWords((prev) => [...prev, currentWord]);
    advanceQueue();
  };

  // Student needs repeat -> Push to end of current session queue
  const handleNeedRepeat = () => {
    if (!currentWord) return;
    setQueue((prev) => [...prev, currentWord]);
    advanceQueue();
  };

  const advanceQueue = () => {
    setIsRevealed(false);
    stopEnglishSpeech();
    if (currentIndex + 1 < queue.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  // Progress percentage in the lesson
  const progressPercent =
    queue.length > 0 ? Math.min(Math.round(((currentIndex) / queue.length) * 100), 100) : 0;

  if (isFinished) {
    return (
      <div className={styles.arenaContainer}>
        <div className={styles.arenaCardFinished}>
          <div className={styles.finishedIcon}>🎉</div>
          <h2 className={styles.finishedTitle}>درس با موفقیت به پایان رسید!</h2>
          <p className={styles.finishedSubtitle}>
            شما <strong>{learnedWords.length}</strong> واژه جدید از درس {lessonIndex} سطح {level} را به روش استقرایی یاد گرفتید و وارد «خانه ۱: تازه‌واردها» در جعبه لایتنر کردید.
          </p>

          <div className={styles.finishedSummaryList}>
            <h4 className={styles.finishedListHeader}>واژگان فراگرفته‌شده در این درس:</h4>
            <div className={styles.finishedWordsGrid}>
              {learnedWords.map((w) => (
                <div key={w.id} className={styles.finishedWordItem}>
                  <div className={styles.finishedWordTerm}>
                    <span className={styles.finishedWordEn}>{w.word}</span>
                    <span className={styles.finishedWordPos}>{w.partOfSpeechLabelFa}</span>
                  </div>
                  <div className={styles.finishedWordFa}>{w.meaningFa}</div>
                  <button
                    type="button"
                    className={styles.finishedAudioBtn}
                    onClick={() => playEnglishSpeech(w.word, { accent: "en-US", rate: 0.9 })}
                    title="شنیدن تلفظ"
                  >
                    🔊
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.arenaFinishedActions}>
            <button
              type="button"
              className={styles.primaryActionButton}
              onClick={onComplete}
            >
              🚀 بازگشت به جعبه لایتنر و تمرین
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className={styles.arenaContainer}>
        <p>واژه‌ای برای نمایش وجود ندارد.</p>
        <button type="button" onClick={onExit} className={styles.secondaryButton}>
          بازگشت
        </button>
      </div>
    );
  }

  return (
    <div className={styles.arenaContainer} aria-label="اتاق تدریس استقرایی واژگان">
      {/* Top Header / Progress */}
      <div className={styles.arenaHeader}>
        <button
          type="button"
          onClick={onExit}
          className={styles.arenaExitButton}
          aria-label="خروج از درس"
        >
          ✕ خروج از درس
        </button>

        <div className={styles.arenaProgressInfo}>
          <span className={styles.arenaLessonBadge} style={{ backgroundColor: `${meta.badgeColor}20`, color: meta.badgeColor }}>
            {meta.icon} سطح {level} • درس {lessonIndex}
          </span>
          <span className={styles.arenaStepCounter}>
            واژه <strong>{currentIndex + 1}</strong> از {queue.length}
          </span>
        </div>

        <div className={styles.accentSelector}>
          <button
            type="button"
            className={`${styles.accentBtn} ${accent === "en-US" ? styles.accentBtnActive : ""}`}
            onClick={() => setAccent("en-US")}
          >
            🇺🇸 آمریکایی
          </button>
          <button
            type="button"
            className={`${styles.accentBtn} ${accent === "en-GB" ? styles.accentBtnActive : ""}`}
            onClick={() => setAccent("en-GB")}
          >
            🇬🇧 بریتانیایی
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={styles.arenaProgressBar}>
        <div
          className={styles.arenaProgressFill}
          style={{ width: `${progressPercent}%`, backgroundColor: meta.badgeColor }}
        />
      </div>

      {/* Main Inductive Teaching Card */}
      <div className={styles.inductiveCard}>
        {/* Step 1: Inductive Context & Clues (Always visible) */}
        <div className={styles.inductiveHeaderSection}>
          <div className={styles.partOfSpeechBadge}>
            {currentWord.partOfSpeechLabelFa}
          </div>
          <span className={styles.stepBadge}>
            {!isRevealed ? "گام ۱: کشف استقرایی مفهوم واژه" : "گام ۲ و ۳: کلمه، تلفظ و مثال کاربردی"}
          </span>
        </div>

        {/* Inductive Challenge / Context */}
        <div className={styles.inductiveContextBox}>
          <h4 className={styles.inductiveContextTitle}>💡 سرنخ موقعیتی در جمله (جای خالی را حدس بزنید):</h4>
          <p className={styles.inductiveContextSentence}>
            {currentWord.inductiveClues.contextClueEn}
          </p>
          <div className={styles.inductiveSituationHint}>
            <span className={styles.hintIcon}>🧭</span>
            <span>{currentWord.inductiveClues.situationHintFa}</span>
          </div>

          {/* Synonyms & Antonyms */}
          {(currentWord.inductiveClues.synonyms?.length || 0) > 0 && (
            <div className={styles.synonymsRow}>
              <span className={styles.synonymLabel}>هم‌معنی‌ها (Synonyms):</span>
              {currentWord.inductiveClues.synonyms?.map((s, idx) => (
                <span key={idx} className={styles.synonymPill}>
                  {s}
                </span>
              ))}
            </div>
          )}
          {(currentWord.inductiveClues.antonyms?.length || 0) > 0 && (
            <div className={styles.antonymsRow}>
              <span className={styles.antonymLabel}>متضادها (Opposites):</span>
              {currentWord.inductiveClues.antonyms?.map((a, idx) => (
                <span key={idx} className={styles.antonymPill}>
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Reveal Button for Step 1 */}
        {!isRevealed && (
          <div className={styles.revealActionContainer}>
            <button
              type="button"
              className={styles.revealButton}
              onClick={handleReveal}
              autoFocus
            >
              🔓 مفهوم را حدس زدم! نمایش کلمه، تلفظ و معنی
            </button>
            <p className={styles.revealHint}>
              (ابتدا سعی کنید معنی را از روی مثال و متضاد/مترادف بالا استنتاج کنید، سپس دکمه را بزنید)
            </p>
          </div>
        )}

        {/* Step 2 & 3: Revealed Content (Target word, Audio Pronunciation, Persian Meaning, Practical Example) */}
        {isRevealed && (
          <div className={styles.revealedSection}>
            {/* Word Display & Pronunciation */}
            <div className={styles.revealedWordHero}>
              <div className={styles.revealedWordRow}>
                <h1 className={styles.targetWordTitle}>{currentWord.word}</h1>
                <span className={styles.targetWordPhonetic}>{currentWord.phonetic}</span>
              </div>

              {/* Pronunciation Controls */}
              <div className={styles.pronunciationControls}>
                <button
                  type="button"
                  className={styles.audioPlayButton}
                  onClick={() => handlePronounceWord(0.92)}
                  title="پخش تلفظ صوتی"
                  disabled={isPlayingAudio}
                >
                  <span className={styles.audioIcon}>🔊</span>
                  <span>تلفظ صوتی</span>
                </button>

                <button
                  type="button"
                  className={styles.audioSlowButton}
                  onClick={() => handlePronounceWord(0.72)}
                  title="تلفظ آهسته"
                  disabled={isPlayingAudio}
                >
                  <span>🐢 تلفظ آهسته</span>
                </button>
              </div>
            </div>

            {/* Meaning & Definition */}
            <div className={styles.meaningsCard}>
              <div className={styles.meaningFaBlock}>
                <span className={styles.meaningFaLabel}>معنی فارسی:</span>
                <span className={styles.meaningFaText}>{currentWord.meaningFa}</span>
              </div>
              <div className={styles.definitionEnBlock}>
                <span className={styles.definitionEnLabel}>English Definition:</span>
                <span className={styles.definitionEnText}>{currentWord.englishDefinition}</span>
              </div>
            </div>

            {/* Step 3: Practical Context / Example Sentence */}
            <div className={styles.practicalExampleCard}>
              <div className={styles.practicalExampleHeader}>
                <span className={styles.practicalIcon}>💬</span>
                <h4>مثال کاربردی روزمره در زندگی واقعی:</h4>
                <button
                  type="button"
                  className={styles.exampleAudioButton}
                  onClick={handlePronounceSentence}
                  title="شنیدن جمله مثال"
                >
                  🔊 پخش جمله
                </button>
              </div>
              <p className={styles.practicalSentenceEn}>
                {currentWord.practicalExample.sentenceEn}
              </p>
              <p className={styles.practicalSentenceFa}>
                «{currentWord.practicalExample.translationFa}»
              </p>
            </div>

            {/* Step 4: Leitner Box Registration */}
            <div className={styles.leitnerRegisterBox}>
              <h4 className={styles.registerTitle}>ارزیابی تسلط و ثبت در جعبه لایتنر:</h4>
              <div className={styles.registerButtonsRow}>
                <button
                  type="button"
                  className={styles.registerSuccessButton}
                  onClick={handleMasterWord}
                >
                  🟢 یاد گرفتم (ورود به خانه ۱: تازه‌واردها)
                </button>

                <button
                  type="button"
                  className={styles.registerRepeatButton}
                  onClick={handleNeedRepeat}
                >
                  🟡 نیاز به تکرار (مرور دوباره در پایان این درس)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

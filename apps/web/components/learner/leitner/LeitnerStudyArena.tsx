"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  getDueCards,
  getLeitnerDeck,
  promoteCard,
  demoteCard,
  LEITNER_BOX_META,
  LeitnerCard,
} from "../../../lib/leitner-storage";
import styles from "./leitner.module.css";

export const LeitnerStudyArena: React.FC = () => {
  const [sessionCards, setSessionCards] = useState<LeitnerCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Session analytics
  const [promotedCount, setPromotedCount] = useState(0);
  const [demotedCount, setDemotedCount] = useState(0);
  const [isPracticeMode, setIsPracticeMode] = useState(false);

  const initDeck = useCallback((forceAll = false) => {
    setIsLoading(true);
    let cards = getDueCards();
    if (cards.length === 0 || forceAll) {
      cards = getLeitnerDeck();
      setIsPracticeMode(true);
    } else {
      setIsPracticeMode(false);
    }
    setSessionCards(cards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsFinished(false);
    setPromotedCount(0);
    setDemotedCount(0);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    initDeck();
  }, [initDeck]);

  const currentCard: LeitnerCard | undefined = sessionCards[currentIndex];

  const handlePronounce = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentCard || typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentCard.correctedText);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handlePromote = useCallback(() => {
    if (!currentCard) return;
    try {
      promoteCard(currentCard.id);
    } catch (err) {
      console.error(err);
    }
    setPromotedCount((c) => c + 1);
    goToNextCard();
  }, [currentCard]);

  const handleDemote = useCallback(() => {
    if (!currentCard) return;
    try {
      demoteCard(currentCard.id);
    } catch (err) {
      console.error(err);
    }
    setDemotedCount((c) => c + 1);
    goToNextCard();
  }, [currentCard]);

  const goToNextCard = () => {
    setIsFlipped(false);
    if (currentIndex + 1 < sessionCards.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setIsFinished(true);
    }
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing when user is typing in an input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        handleFlip();
      } else if (e.key === "1" || e.code === "ArrowLeft") {
        e.preventDefault();
        if (isFlipped) {
          handleDemote();
        } else {
          // If not flipped, flip first or demote
          setIsFlipped(true);
        }
      } else if (e.key === "2" || e.code === "ArrowRight") {
        e.preventDefault();
        if (isFlipped) {
          handlePromote();
        } else {
          setIsFlipped(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped, handlePromote, handleDemote]);

  if (isLoading) {
    return (
      <div className={styles.arenaContainer}>
        <p style={{ textAlign: "center", color: "#64748b", padding: "3rem" }}>
          در حال بارگذاری کارت‌های لایتنر...
        </p>
      </div>
    );
  }

  // Celebration Finished Screen
  if (isFinished || sessionCards.length === 0) {
    const totalDone = promotedCount + demotedCount;
    const successRate = totalDone > 0 ? Math.round((promotedCount / totalDone) * 100) : 100;

    return (
      <div className={styles.arenaContainer}>
        <div className={styles.celebrationCard}>
          <div className={styles.celebrationIcon}>🏆</div>
          <h2 className={styles.celebrationTitle}>مرور این جلسه به پایان رسید!</h2>
          <p className={styles.celebrationSub}>
            تبریک! تمام کارت‌های نوبت امروز را با موفقیت مرور کردی. خطاهای دیروز در حال تبدیل به تسلط
            طبیعی در ذهن تو هستند.
          </p>

          <div className={styles.celebrationStatsGrid}>
            <div className={styles.statBadgeItem}>
              <div className={styles.statBadgeVal} style={{ color: "#10b981" }}>
                {promotedCount}
              </div>
              <div className={styles.statBadgeLabel}>صعود به جعبه بعد</div>
            </div>
            <div className={styles.statBadgeItem}>
              <div className={styles.statBadgeVal} style={{ color: "#ef4444" }}>
                {demotedCount}
              </div>
              <div className={styles.statBadgeLabel}>نیاز به تکرار مجدد</div>
            </div>
            <div className={styles.statBadgeItem}>
              <div className={styles.statBadgeVal} style={{ color: "#2563eb" }}>
                %{successRate}
              </div>
              <div className={styles.statBadgeLabel}>نرخ تسلط جلسه</div>
            </div>
          </div>

          <div className={styles.celebrationActions}>
            <Link href="/mistakes" className={styles.startStudyButton}>
              <span>←</span>
              <span>بازگشت به ژنوم خطاهای یادگیری</span>
            </Link>
            <button
              type="button"
              className={styles.addMistakeButton}
              onClick={() => initDeck(true)}
            >
              <span>🔄</span>
              <span>مرور مجدد کل کارت‌ها (تمرین آزاد)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentBoxMeta = LEITNER_BOX_META[currentCard.boxLevel];
  const progressPercent = ((currentIndex + 1) / sessionCards.length) * 100;

  return (
    <div className={styles.arenaContainer}>
      {/* Top Header & Progress */}
      <div className={styles.arenaTopBar}>
        <Link href="/mistakes" className={styles.arenaBackLink}>
          <span>←</span>
          <span>بازگشت به قفسه لایتنر</span>
        </Link>

        <div className={styles.arenaSessionProgress}>
          <span className={styles.progressCounterText}>
            کارت {currentIndex + 1} از {sessionCards.length}
            {isPracticeMode && " (حالت تمرین آزاد)"}
          </span>
          <div className={styles.arenaMeterTrack}>
            <div
              className={styles.arenaMeterFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3D Flip Card Scene */}
      <div
        className={styles.cardScene}
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        aria-label="کارت فلش‌کارت لایتنر. برای چرخش و دیدن پاسخ کلیک یا اسپیس را بزنید."
        onKeyDown={(e) => {
          if (e.key === "Enter") handleFlip();
        }}
      >
        <div
          className={`${styles.cardInner} ${isFlipped ? styles.cardInnerFlipped : ""}`}
        >
          {/* Front Face: The Mistake & Active Challenge */}
          <div className={`${styles.cardFace} ${styles.cardFront}`}>
            <div>
              <div className={styles.cardHeaderMeta}>
                <span className={styles.badgeCategory}>
                  <span>🏷️</span>
                  <span>{currentCard.categoryLabelFa}</span>
                </span>
                <span
                  className={styles.cardBoxBadge}
                  style={{ backgroundColor: currentBoxMeta.color }}
                >
                  {currentBoxMeta.labelFa}
                </span>
              </div>

              <div className={styles.mistakeDisplayBox}>
                <div className={styles.mistakeLabel}>
                  <span>❌</span>
                  <span>عبارت یا جمله اشتباه:</span>
                </div>
                <div className={styles.mistakeSentence}>{currentCard.originalMistake}</div>
              </div>

              <p className={styles.challengePrompt}>
                🎯 <strong>چالش یادآوری فعال:</strong> پیش از دیدن پاسخ، این جمله را در ذهن خود
                اصلاح کن. علت خطا چیست و عبارت طبیعی انگلیسی چگونه است؟
              </p>
            </div>

            <div className={styles.tapToFlipHint}>
              <span>🔄</span>
              <span>برای مشاهده نگارش صحیح و ریشه‌یابی علمی کلیک کن (یا کلید Space)</span>
            </div>
          </div>

          {/* Back Face: Native Phrasing & Linguistic Root Cause */}
          <div className={`${styles.cardFace} ${styles.cardBack}`}>
            <div>
              <div className={styles.cardHeaderMeta}>
                <span className={styles.badgeCategory}>
                  <span>✅</span>
                  <span>پاسخ صحیح و تحلیل ریشه</span>
                </span>
                <span
                  className={styles.cardBoxBadge}
                  style={{ backgroundColor: currentBoxMeta.color }}
                >
                  {currentBoxMeta.labelFa}
                </span>
              </div>

              <div className={styles.correctDisplayBox}>
                <div className={styles.correctLabelRow}>
                  <div className={styles.correctLabel}>
                    <span>✅</span>
                    <span>ساختار طبیعی و استاندارد:</span>
                  </div>
                  <button
                    type="button"
                    className={styles.audioSpeakerBtn}
                    onClick={handlePronounce}
                    title="پخش تلفظ صوتی با صدای بومی"
                  >
                    <span>🔊</span>
                    <span>تلفظ صوتی</span>
                  </button>
                </div>
                <div className={styles.correctSentence}>{currentCard.correctedText}</div>
              </div>

              <div className={styles.rootCauseCard}>
                <div className={styles.rootCauseTitle}>
                  <span>💡</span>
                  <span>ریشه‌یابی و آسیب‌شناسی زبان فارسی (L1 Transfer):</span>
                </div>
                <p className={styles.rootCauseText}>{currentCard.explanationFa}</p>
                {currentCard.exampleSentenceEn && (
                  <p className={styles.exampleEn}>
                    <strong>مثال کاربردی: </strong>
                    {currentCard.exampleSentenceEn}
                  </p>
                )}
              </div>
            </div>

            <div className={styles.tapToFlipHint}>
              <span>🔄</span>
              <span>کلیک برای بازگشت به روی کارت</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className={styles.controlsRow}>
        <button
          type="button"
          className={styles.btnFail}
          onClick={(e) => {
            e.stopPropagation();
            handleDemote();
          }}
        >
          <span>❌ نیاز به مرور مجدد (سقوط به جعبه ۱)</span>
          <span className={styles.btnShortcutHint}>کلید 1 یا ←</span>
        </button>

        <button
          type="button"
          className={styles.btnPass}
          onClick={(e) => {
            e.stopPropagation();
            handlePromote();
          }}
        >
          <span>✅ بلد بودم و مسلط شدم (صعود به جعبه بعد)</span>
          <span className={styles.btnShortcutHint}>کلید 2 یا →</span>
        </button>
      </div>

      {/* Keyboard Shortcuts Hint Bar */}
      <div className={styles.keyboardHintsBar}>
        <span>راهنمای کیبورد:</span>
        <span>
          <kbd className={styles.kbdKey}>Space</kbd> چرخاندن کارت
        </span>
        <span>
          <kbd className={styles.kbdKey}>1</kbd> یا <kbd className={styles.kbdKey}>←</kbd> یادآوری
          نشد
        </span>
        <span>
          <kbd className={styles.kbdKey}>2</kbd> یا <kbd className={styles.kbdKey}>→</kbd> یادآوری
          شد
        </span>
      </div>
    </div>
  );
};

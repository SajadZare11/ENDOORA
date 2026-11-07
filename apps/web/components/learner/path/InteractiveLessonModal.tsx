"use client";

import React, { useState, useEffect } from "react";
import { PathNode, PathUnit } from "../../../lib/learning-path-storage";
import {
  getInteractiveLessonForNode,
  playEnglishAudio,
  InteractiveLessonContent,
} from "../../../lib/interactive-lesson-engine";
import styles from "./learning-path.module.css";

interface InteractiveLessonModalProps {
  node: PathNode;
  unit: PathUnit;
  onClose: () => void;
  onComplete: (starsCount: number, xpReward: number) => void;
}

type Stage = "concept" | "quiz" | "victory";

export const InteractiveLessonModal: React.FC<InteractiveLessonModalProps> = ({
  node,
  unit,
  onClose,
  onComplete,
}) => {
  const [stage, setStage] = useState<Stage>("concept");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [earnedStars, setEarnedStars] = useState(3);

  const lesson: InteractiveLessonContent = getInteractiveLessonForNode(node, unit);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handlePlayAudio = (text: string) => {
    playEnglishAudio(text);
  };

  const handleEvaluate = () => {
    if (selectedOption === null) return;
    const correct = selectedOption === lesson.correctIndex;
    setIsCorrect(correct);
    setIsEvaluated(true);
    setEarnedStars(correct ? 3 : 2);
  };

  const handleGoToVictory = () => {
    setStage("victory");
  };

  const handleFinishAndSave = () => {
    onComplete(earnedStars, node.xpReward || 30);
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lesson-modal-title"
    >
      <div
        className={styles.interactiveModalCard}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Navigation & Stepper */}
        <div className={styles.runnerHeader}>
          <div className={styles.stepperTrack}>
            <div
              className={`${styles.stepPill} ${stage === "concept" ? styles.stepPillActive : styles.stepPillDone}`}
            >
              <span>۱</span>
              <span>نکته آموزشی</span>
            </div>
            <div className={styles.stepperDivider} />
            <div
              className={`${styles.stepPill} ${
                stage === "quiz"
                  ? styles.stepPillActive
                  : stage === "victory"
                  ? styles.stepPillDone
                  : ""
              }`}
            >
              <span>۲</span>
              <span>تمرین مهارتی</span>
            </div>
            <div className={styles.stepperDivider} />
            <div
              className={`${styles.stepPill} ${stage === "victory" ? styles.stepPillActive : ""}`}
            >
              <span>۳</span>
              <span>فتح و پاداش</span>
            </div>
          </div>

          <button
            type="button"
            className={styles.runnerCloseBtn}
            onClick={onClose}
            aria-label="بستن پنجره تمرین"
          >
            ✕
          </button>
        </div>

        {/* =========================================================================
            STAGE 1: CONCEPT CARD
            ========================================================================= */}
        {stage === "concept" && (
          <div className={styles.runnerStageContent}>
            <div className={styles.runnerNodeBadgeRow}>
              <span className={styles.runnerNodeIcon}>{node.icon}</span>
              <div>
                <span className={styles.runnerUnitTag}>
                  {unit.titleFa} • مرحله {node.order} از ۵
                </span>
                <h2 id="lesson-modal-title" className={styles.runnerTitle}>
                  {node.titleFa}
                </h2>
                <div className={styles.runnerSubEn} dir="ltr">
                  {node.titleEn}
                </div>
              </div>
            </div>

            {/* Core Teaching Card */}
            <div className={styles.conceptExplainBox}>
              <div className={styles.conceptExplainHeader}>
                <span className={styles.conceptSparkle}>💡</span>
                <strong>{lesson.conceptTipTitleFa}</strong>
              </div>
              <p className={styles.conceptExplainText}>{lesson.conceptTipBodyFa}</p>
            </div>

            {/* English Example with Audio */}
            <div className={styles.exampleAudioBox}>
              <div className={styles.exampleAudioTop}>
                <span className={styles.exampleTag}>نمونه کاربردی در مکالمه:</span>
                <button
                  type="button"
                  className={styles.audioPlayBtn}
                  onClick={() => handlePlayAudio(lesson.audioPhraseEn)}
                  title="شنیدن تلفظ طبیعی با صدای استاندارد انگلیسی"
                >
                  <span>🔊</span>
                  <span>پخش صوتی تلفظ</span>
                </button>
              </div>

              <div className={styles.exampleSentenceEn} dir="ltr">
                &ldquo;{lesson.exampleEn}&rdquo;
              </div>
              <div className={styles.exampleSentenceFa}>{lesson.exampleFa}</div>
            </div>

            {/* CTA to practice */}
            <div className={styles.runnerFooter}>
              <button
                type="button"
                className={styles.runnerPrimaryActionBtn}
                onClick={() => setStage("quiz")}
              >
                <span>آماده حل چالش مهارتی هستم</span>
                <span aria-hidden="true">←</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STAGE 2: INTERACTIVE PRACTICE QUIZ
            ========================================================================= */}
        {stage === "quiz" && (
          <div className={styles.runnerStageContent}>
            <div className={styles.quizPromptBox}>
              <span className={styles.quizBadge}>🎯 چالش سنجش تسلط</span>
              <p className={styles.quizPromptFa}>{lesson.quizPromptFa}</p>
            </div>

            {/* English Question Box */}
            <div className={styles.questionCard}>
              <div className={styles.questionCardTop}>
                <span className={styles.questionCardLabel}>سوال:</span>
                {lesson.quizAudioSnippetEn && (
                  <button
                    type="button"
                    className={styles.audioPlayBtnSmall}
                    onClick={() => handlePlayAudio(lesson.quizAudioSnippetEn || lesson.quizQuestionEn)}
                    title="شنیدن صوت سوال"
                  >
                    <span>🔊</span>
                    <span>شنیدن جمله</span>
                  </button>
                )}
              </div>
              <div className={styles.questionTextEn} dir="ltr">
                {lesson.quizQuestionEn}
              </div>
            </div>

            {/* 4 Interactive Options */}
            <div className={styles.optionsGrid} role="radiogroup" aria-label="گزینه‌های پاسخ">
              {lesson.quizOptions.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                let optClass = styles.optionCard;

                if (isEvaluated) {
                  if (idx === lesson.correctIndex) {
                    optClass = `${styles.optionCard} ${styles.optionCardCorrect}`;
                  } else if (isSelected && !isCorrect) {
                    optClass = `${styles.optionCard} ${styles.optionCardWrong}`;
                  }
                } else if (isSelected) {
                  optClass = `${styles.optionCard} ${styles.optionCardSelected}`;
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={isEvaluated}
                    className={optClass}
                    onClick={() => setSelectedOption(idx)}
                  >
                    <span className={styles.optionLetter}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className={styles.optionText} dir="ltr">
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Feedback result */}
            {isEvaluated && (
              <div
                className={`${styles.feedbackCard} ${
                  isCorrect ? styles.feedbackCardSuccess : styles.feedbackCardFailure
                }`}
              >
                <div className={styles.feedbackTitleRow}>
                  <span className={styles.feedbackIcon}>{isCorrect ? "✅" : "💡"}</span>
                  <strong className={styles.feedbackTitle}>
                    {isCorrect ? "کاملاً صحیح و عالی!" : "نکته آموزشی و پاسخ درست:"}
                  </strong>
                </div>
                <p className={styles.feedbackExplanation}>{lesson.explanationFa}</p>
              </div>
            )}

            {/* Action Bar */}
            <div className={styles.runnerFooter}>
              {!isEvaluated ? (
                <button
                  type="button"
                  disabled={selectedOption === null}
                  className={`${styles.runnerPrimaryActionBtn} ${
                    selectedOption === null ? styles.runnerBtnDisabled : ""
                  }`}
                  onClick={handleEvaluate}
                >
                  <span>بررسی پاسخ و تصحیح</span>
                  <span aria-hidden="true">✔</span>
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.runnerPrimaryActionBtn}
                  onClick={handleGoToVictory}
                >
                  <span>مشاهده نتیجه و فتح مرحله</span>
                  <span aria-hidden="true">←</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            STAGE 3: VICTORY & REWARDS
            ========================================================================= */}
        {stage === "victory" && (
          <div className={styles.victoryCard}>
            <div className={styles.victoryCrownGlow}>👑</div>
            <h2 className={styles.victoryTitle}>مرحله با موفقیت فتح شد!</h2>
            <p className={styles.victorySub}>
              شما با تسلط بر مبحث <strong>{node.titleFa}</strong> یک گام دیگر به تسلط در زبان
              انگلیسی نزدیک‌تر شدید.
            </p>

            {/* Stars Row */}
            <div className={styles.victoryStarsRow}>
              {Array.from({ length: 3 }).map((_, i) => (
                <span
                  key={i}
                  className={`${styles.victoryStar} ${
                    i < earnedStars ? styles.victoryStarActive : styles.victoryStarEmpty
                  }`}
                >
                  ⭐
                </span>
              ))}
            </div>

            {/* Rewards Badge Deck */}
            <div className={styles.rewardsDeck}>
              <div className={styles.rewardDeckItem}>
                <span className={styles.rewardIcon}>⚡</span>
                <div>
                  <div className={styles.rewardValue}>+{node.xpReward || 30} XP</div>
                  <div className={styles.rewardLabel}>امتیاز تجربه کسب‌شده</div>
                </div>
              </div>

              <div className={styles.rewardDeckItem}>
                <span className={styles.rewardIcon}>🔓</span>
                <div>
                  <div className={styles.rewardValue}>مرحله بعدی باز شد</div>
                  <div className={styles.rewardLabel}>مسیر مارپیچ CEFR</div>
                </div>
              </div>
            </div>

            {/* Finish Button */}
            <div className={styles.victoryActionRow}>
              <button
                type="button"
                className={styles.victoryFinishBtn}
                onClick={handleFinishAndSave}
              >
                <span>ثبت پیشرفت و بازگشت به نقشه راه</span>
                <span aria-hidden="true">←</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

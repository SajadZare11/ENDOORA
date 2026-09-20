"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, BdiEn } from "@endoora/ui";
import type { LessonData, QuizQuestion } from "@endoora/contracts";
import { useLocale } from "../../lib/locale-context";
import styles from "./lesson-player.module.css";

export interface LessonPlayerProps {
  lesson: LessonData;
  courseSlug?: string;
  courseTitleFa?: string;
}

type TabKey = "vocabulary" | "grammar" | "reading" | "quiz" | "summary";

export function LessonPlayer({ lesson, courseSlug, courseTitleFa }: LessonPlayerProps) {
  const { isFa, t, dir } = useLocale();
  const [activeTab, setActiveTab] = useState<TabKey>("vocabulary");

  // Reading Interactive Token state
  const [selectedToken, setSelectedToken] = useState<{ sentenceId: string; word: string; fa: string } | null>(null);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<
    Record<string, { isAnswered: boolean; selectedOption?: number; typedAnswer?: string; isCorrect: boolean }>
  >({});
  const [blankInputs, setBlankInputs] = useState<Record<string, string>>({});
  const [hintsVisible, setHintsVisible] = useState<Record<string, boolean>>({});

  // Pronunciation via Web Speech API
  const playEnglishAudio = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Quiz handlers
  const handleMultipleChoice = (q: Extract<QuizQuestion, { type: "multiple_choice" }>, optionIndex: number) => {
    if (quizAnswers[q.id]?.isAnswered) return;

    const isCorrect = optionIndex === q.correctIndex;
    setQuizAnswers((prev) => ({
      ...prev,
      [q.id]: {
        isAnswered: true,
        selectedOption: optionIndex,
        isCorrect,
      },
    }));
  };

  const handleFillBlankCheck = (q: Extract<QuizQuestion, { type: "fill_blank" }>) => {
    const rawVal = blankInputs[q.id] || "";
    const cleanVal = rawVal.trim().toLowerCase();
    if (!cleanVal) return;

    const isCorrect = q.acceptedAnswers.some(
      (ans) => ans.trim().toLowerCase() === cleanVal
    );

    setQuizAnswers((prev) => ({
      ...prev,
      [q.id]: {
        isAnswered: true,
        typedAnswer: rawVal,
        isCorrect,
      },
    }));
  };

  const toggleHint = (qId: string) => {
    setHintsVisible((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setBlankInputs({});
    setHintsVisible({});
    setActiveTab("quiz");
  };

  // Calculate score & XP
  const totalQuestions = lesson.quiz.length;
  const answeredCount = Object.keys(quizAnswers).length;
  const correctCount = Object.values(quizAnswers).filter((a) => a.isCorrect).length;
  const earnedXp = correctCount * 25;
  const isQuizFinished = totalQuestions > 0 && answeredCount >= totalQuestions;

  return (
    <div className={styles.container} dir={dir}>
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs} aria-label={isFa ? "مسیر درس" : "Lesson breadcrumbs"}>
        <Link href="/">{t("nav.home")}</Link>
        <span>/</span>
        <Link href="/courses">{t("nav.courses")}</Link>
        {courseSlug && (
          <>
            <span>/</span>
            <Link href={`/courses/${courseSlug}`}>{courseTitleFa || courseSlug}</Link>
          </>
        )}
        <span>/</span>
        <span aria-current="page">{isFa ? lesson.title.fa : lesson.title.en}</span>
      </nav>

      {/* Header Card */}
      <header className={styles.headerCard}>
        <div className={styles.badgeRow}>
          <span className={styles.levelBadge}>CEFR {lesson.level}</span>
          <span className={styles.durationBadge}>
            ⏱️ {lesson.durationMinutes} {isFa ? "دقیقه آموزش متمرکز" : "min focused"}
          </span>
          <span className={styles.xpBadge}>
            ⭐ {earnedXp} / {totalQuestions * 25} XP
          </span>
        </div>

        <h1 className={styles.titleFa}>{lesson.title.fa}</h1>
        <div className={styles.titleEn}>
          <BdiEn>{lesson.title.en}</BdiEn>
        </div>
      </header>

      {/* Section Tabs */}
      <nav className={styles.tabNav} aria-label={isFa ? "بخش‌های درس" : "Lesson sections"}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "vocabulary" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("vocabulary")}
          aria-selected={activeTab === "vocabulary"}
        >
          <span>📖</span>
          <span>{isFa ? "واژگان کلیدی" : "Key Vocabulary"}</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "grammar" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("grammar")}
          aria-selected={activeTab === "grammar"}
        >
          <span>📐</span>
          <span>{isFa ? "قواعد گرامر" : "Grammar Focus"}</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "reading" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("reading")}
          aria-selected={activeTab === "reading"}
        >
          <span>📑</span>
          <span>{isFa ? "متن و کالبدشکافی جمله" : "Reading & Sentences"}</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "quiz" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("quiz")}
          aria-selected={activeTab === "quiz"}
        >
          <span>✏️</span>
          <span>{isFa ? "آزمون سنجش" : "Formative Quiz"}</span>
          {isQuizFinished && <span>✓</span>}
        </button>

        {isQuizFinished && (
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "summary" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("summary")}
            aria-selected={activeTab === "summary"}
          >
            <span>🏆</span>
            <span>{isFa ? "کارنامه و پاداش" : "Summary & XP"}</span>
          </button>
        )}
      </nav>

      {/* TAB 1: VOCABULARY */}
      {activeTab === "vocabulary" && (
        <section className={styles.sectionCard} aria-labelledby="vocab-heading">
          <div className={styles.sectionHeader}>
            <h2 id="vocab-heading" className={styles.sectionTitle}>
              {isFa ? "واژگان کلیدی این جلسه" : "Essential Vocabulary"}
            </h2>
            <p className={styles.sectionSubtitle}>
              {isFa
                ? "واژه‌ها را همراه با تلفظ صوتی، رونویسی IPA و کاربرد در جملات نمونه یاد بگیرید."
                : "Master terms with native audio pronunciation, IPA transcription, and contextual examples."}
            </p>
          </div>

          <div className={styles.vocabGrid}>
            {lesson.vocabulary.map((vocab, idx) => (
              <article key={idx} className={styles.vocabCard}>
                <div className={styles.vocabHeader}>
                  <div>
                    <span className={styles.vocabWord}><BdiEn>{vocab.word}</BdiEn></span>
                    {vocab.ipa && <div className={styles.vocabIpa}><BdiEn>{vocab.ipa}</BdiEn></div>}
                  </div>
                  <button
                    type="button"
                    className={styles.audioBtn}
                    onClick={() => playEnglishAudio(vocab.word)}
                    aria-label={`تلفظ صوتی واژه ${vocab.word}`}
                    title="شنیدن تلفظ انگلیسی"
                  >
                    🔊
                  </button>
                </div>

                <div className={styles.vocabFa}>{vocab.fa}</div>

                <div className={styles.exampleBox}>
                  <div className={styles.exampleEn}>
                    <BdiEn>{vocab.example.en}</BdiEn>
                  </div>
                  <div className={styles.exampleFa}>
                    {vocab.example.fa}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBlockStart: "var(--space-4)" }}>
            <Button variant="primary" onClick={() => setActiveTab("grammar")}>
              {isFa ? "رفتن به بخش گرامر ←" : "Proceed to Grammar →"}
            </Button>
          </div>
        </section>
      )}

      {/* TAB 2: GRAMMAR */}
      {activeTab === "grammar" && (
        <section className={styles.sectionCard} aria-labelledby="grammar-heading">
          <div className={styles.sectionHeader}>
            <h2 id="grammar-heading" className={styles.sectionTitle}>
              {isFa ? lesson.grammar.title.fa : lesson.grammar.title.en}
            </h2>
            <div className={styles.sectionSubtitle}>
              <BdiEn>{lesson.grammar.title.en}</BdiEn>
            </div>
          </div>

          <div className={styles.grammarBox}>
            <div className={styles.grammarExplanation}>
              <strong>{isFa ? "توضیح مفهومی:" : "Concept Overview:"} </strong>
              {lesson.grammar.explanation_fa}
            </div>

            <div>
              <h3 style={{ fontSize: "var(--font-size-body)", fontWeight: 750, marginBlockEnd: "var(--space-3)" }}>
                {isFa ? "قواعد کلیدی و نکات کاربردی:" : "Key Rules & Patterns:"}
              </h3>
              <ul className={styles.rulesList}>
                {lesson.grammar.rules.map((rule, rIdx) => (
                  <li key={rIdx} className={styles.ruleItem}>
                    <span className={styles.ruleNumber}>{rIdx + 1}</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: "var(--font-size-body)", fontWeight: 750, marginBlockEnd: "var(--space-3)" }}>
                {isFa ? "جملات نمونه با تأکید بر ساختار:" : "Target Pattern Examples:"}
              </h3>
              <div className={styles.examplesGrid}>
                {lesson.grammar.examples.map((ex, eIdx) => {
                  let renderedEn: React.ReactNode = ex.en;
                  if (ex.highlight && ex.en.includes(ex.highlight)) {
                    const parts = ex.en.split(ex.highlight);
                    renderedEn = (
                      <>
                        <BdiEn>{parts[0]}</BdiEn>
                        <span className={styles.highlightPill}>
                          <BdiEn>{ex.highlight}</BdiEn>
                        </span>
                        <BdiEn>{parts[1]}</BdiEn>
                      </>
                    );
                  } else {
                    renderedEn = <BdiEn>{ex.en}</BdiEn>;
                  }

                  return (
                    <div key={eIdx} className={styles.grammarExampleCard}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-2)" }}>
                        <div style={{ fontFamily: "var(--font-family-latin)", fontSize: "1.05rem" }}>
                          {renderedEn}
                        </div>
                        <button
                          type="button"
                          className={styles.audioBtn}
                          onClick={() => playEnglishAudio(ex.en)}
                          aria-label="شنیدن تلفظ جمله"
                        >
                          🔊
                        </button>
                      </div>
                      <div style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>
                        {ex.fa}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBlockStart: "var(--space-4)" }}>
            <Button variant="secondary" onClick={() => setActiveTab("vocabulary")}>
              {isFa ? "← بخش قبلی: واژگان" : "← Previous: Vocabulary"}
            </Button>
            <Button variant="primary" onClick={() => setActiveTab("reading")}>
              {isFa ? "رفتن به بخش درک مطلب ←" : "Proceed to Reading →"}
            </Button>
          </div>
        </section>
      )}

      {/* TAB 3: READING & SENTENCE BREAKDOWN */}
      {activeTab === "reading" && (
        <section className={styles.sectionCard} aria-labelledby="reading-heading">
          <div className={styles.sectionHeader}>
            <h2 id="reading-heading" className={styles.sectionTitle}>
              {isFa ? lesson.reading.title.fa : lesson.reading.title.en}
            </h2>
            <div className={styles.sectionSubtitle}>
              <BdiEn>{lesson.reading.title.en}</BdiEn>
            </div>
          </div>

          <p style={{ margin: 0, fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>
            {isFa
              ? "روی کلمات برجسته‌شده در هر جمله ضربه بزنید تا معنی متنی آن واژه را مشاهده کنید."
              : "Click on any highlighted token in each sentence to inspect its contextual Persian meaning."}
          </p>

          <div className={styles.readingList}>
            {lesson.reading.sentences.map((sentence) => {
              // Tokenize words
              const words = sentence.en.split(/\s+/);

              return (
                <article key={sentence.id} className={styles.sentenceCard}>
                  <div className={styles.sentenceEnLine}>
                    <div className={styles.sentenceWords} dir="ltr">
                      {words.map((w, wIdx) => {
                        const cleanWord = w.replace(/^[^\w]+|[^\w]+$/g, "").toLowerCase();
                        const matchedVocab = sentence.vocabulary.find(
                          (v) => v.word.toLowerCase() === cleanWord
                        );

                        if (matchedVocab) {
                          const isSelected =
                            selectedToken?.sentenceId === sentence.id &&
                            selectedToken?.word.toLowerCase() === cleanWord;

                          return (
                            <button
                              key={wIdx}
                              type="button"
                              className={`${styles.tokenBtn} ${isSelected ? styles.tokenActive : ""}`}
                              onClick={() =>
                                setSelectedToken(
                                  isSelected ? null : { sentenceId: sentence.id, word: matchedVocab.word, fa: matchedVocab.fa }
                                )
                              }
                              title={`معنی: ${matchedVocab.fa}`}
                            >
                              <bdi lang="en" dir="ltr" className="font-latin isolate-ltr">{w}</bdi>
                            </button>
                          );
                        }

                        return (
                          <span key={wIdx}>
                            <bdi lang="en" dir="ltr" className="font-latin isolate-ltr">{w}</bdi>
                          </span>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      className={styles.audioBtn}
                      onClick={() => playEnglishAudio(sentence.en)}
                      aria-label="شنیدن جمله کامل"
                    >
                      🔊
                    </button>
                  </div>

                  {selectedToken?.sentenceId === sentence.id && (
                    <div className={styles.tokenPopup}>
                      <strong>واژه: </strong>
                      <BdiEn>{selectedToken.word}</BdiEn>
                      <span> ← </span>
                      <span style={{ color: "var(--color-learning-teal)", fontWeight: 700 }}>
                        {selectedToken.fa}
                      </span>
                    </div>
                  )}

                  <div className={styles.sentenceFaLine}>
                    {sentence.fa}
                  </div>
                </article>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBlockStart: "var(--space-4)" }}>
            <Button variant="secondary" onClick={() => setActiveTab("grammar")}>
              {isFa ? "← بخش قبلی: گرامر" : "← Previous: Grammar"}
            </Button>
            <Button variant="primary" onClick={() => setActiveTab("quiz")}>
              {isFa ? "شروع آزمون سنجش یادگیری ←" : "Start Formative Quiz →"}
            </Button>
          </div>
        </section>
      )}

      {/* TAB 4: INTERACTIVE FORMATIVE QUIZ */}
      {activeTab === "quiz" && (
        <section className={styles.sectionCard} aria-labelledby="quiz-heading">
          <div className={styles.sectionHeader}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 id="quiz-heading" className={styles.sectionTitle}>
                {isFa ? "آزمون سنجش یادگیری" : "Formative Assessment Quiz"}
              </h2>
              <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-action)" }}>
                {answeredCount} / {totalQuestions} {isFa ? "تکمیل شده" : "completed"}
              </span>
            </div>
            <p className={styles.sectionSubtitle}>
              {isFa
                ? "به پرسش‌های چهارگزینه‌ای و جای‌خالی پاسخ دهید تا مهارت شما در این جلسه سنجیده شود."
                : "Test your mastery across multiple-choice and fill-in-the-blank comprehension challenges."}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            {lesson.quiz.map((q, qIndex) => {
              const state = quizAnswers[q.id];

              return (
                <div key={q.id} className={styles.quizCard}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 800, color: "var(--color-muted)" }}>
                      {isFa ? `پرسش شماره ${qIndex + 1}` : `Question ${qIndex + 1}`}
                    </span>
                    {state?.isAnswered && (
                      <span
                        style={{
                          fontSize: "var(--font-size-meta)",
                          fontWeight: 700,
                          color: state.isCorrect ? "var(--color-learning-teal)" : "var(--color-error-red)",
                        }}
                      >
                        {state.isCorrect ? "✓ پاسخ صحیح (+۲۵ XP)" : "✗ پاسخ نادرست"}
                      </span>
                    )}
                  </div>

                  {/* Bilingual Prompt */}
                  <h3 className={styles.quizPromptFa}>{q.prompt.fa}</h3>
                  <div className={styles.quizPromptEn}><BdiEn>{q.prompt.en}</BdiEn></div>

                  {/* Question Type: Multiple Choice */}
                  {q.type === "multiple_choice" && (
                    <div className={styles.optionsGrid} dir="ltr">
                      {q.options.map((opt, optIdx) => {
                        let optStyle = styles.optionButton;
                        if (state?.isAnswered) {
                          if (optIdx === q.correctIndex) {
                            optStyle = `${styles.optionButton} ${styles.optionCorrect}`;
                          } else if (optIdx === state.selectedOption) {
                            optStyle = `${styles.optionButton} ${styles.optionIncorrect}`;
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            className={optStyle}
                            onClick={() => handleMultipleChoice(q, optIdx)}
                            disabled={state?.isAnswered}
                          >
                            <span style={{ fontWeight: 800 }}>{String.fromCharCode(65 + optIdx)}.</span>
                            <span className="font-latin isolate-ltr">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Question Type: Fill Blank */}
                  {q.type === "fill_blank" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                      <div className={styles.fillBlankSentence} dir="ltr">
                        {q.sentenceWithBlank.split("___").map((segment, sIdx, arr) => (
                          <React.Fragment key={sIdx}>
                            <BdiEn>{segment}</BdiEn>
                            {sIdx < arr.length - 1 && (
                              <input
                                type="text"
                                dir="ltr"
                                className={`${styles.blankInput} ${
                                  state?.isAnswered
                                    ? state.isCorrect
                                      ? styles.blankInputCorrect
                                      : styles.blankInputIncorrect
                                    : ""
                                }`}
                                placeholder="type here..."
                                value={blankInputs[q.id] || ""}
                                onChange={(e) =>
                                  setBlankInputs((prev) => ({ ...prev, [q.id]: e.target.value }))
                                }
                                disabled={state?.isAnswered}
                                aria-label="جای خالی را پر کنید"
                              />
                            )}
                          </React.Fragment>
                        ))}
                      </div>

                      <div className={styles.quizFooter}>
                        <div style={{ display: "flex", gap: "var(--space-2)" }}>
                          {q.hintFa && !state?.isAnswered && (
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => toggleHint(q.id)}
                            >
                              💡 {hintsVisible[q.id] ? (isFa ? "مخفی‌سازی راهنما" : "Hide Hint") : (isFa ? "نمایش راهنما" : "Show Hint")}
                            </Button>
                          )}
                        </div>

                        {!state?.isAnswered && (
                          <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            onClick={() => handleFillBlankCheck(q)}
                            disabled={!blankInputs[q.id]?.trim()}
                          >
                            {isFa ? "بررسی پاسخ ✓" : "Check Answer ✓"}
                          </Button>
                        )}
                      </div>

                      {hintsVisible[q.id] && q.hintFa && (
                        <div style={{ background: "var(--color-warning-bg)", color: "var(--color-warning-text)", padding: "var(--space-3)", borderRadius: "var(--radius-control)", fontSize: "var(--font-size-meta)" }}>
                          <strong>راهنما: </strong>{q.hintFa}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Feedback Explanation */}
                  {state?.isAnswered && (
                    <div className={styles.explanationBox}>
                      <div className={styles.explanationFa}>
                        <strong>تحلیل آموزشی: </strong>{q.explanation.fa}
                      </div>
                      {q.explanation.en && (
                        <div className={styles.explanationEn}>
                          <strong>Explanation: </strong><BdiEn>{q.explanation.en}</BdiEn>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBlockStart: "var(--space-6)" }}>
            <Button variant="secondary" onClick={() => setActiveTab("reading")}>
              {isFa ? "← بخش قبلی: درک مطلب" : "← Previous: Reading"}
            </Button>
            {isQuizFinished ? (
              <Button variant="primary" onClick={() => setActiveTab("summary")}>
                {isFa ? "مشاهده کارنامه و دریافت پاداش 🏆" : "View Summary & Claim Rewards 🏆"}
              </Button>
            ) : (
              <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)", alignSelf: "center" }}>
                {isFa ? "لطفاً به تمام سوالات پاسخ دهید" : "Please complete all questions"}
              </span>
            )}
          </div>
        </section>
      )}

      {/* TAB 5: SUMMARY & REWARDS */}
      {activeTab === "summary" && (
        <section className={styles.sectionCard} aria-labelledby="summary-heading">
          <div className={styles.completionBox}>
            <div className={styles.completionEmoji}>🎉</div>
            <h2 id="summary-heading" className={styles.completionTitle}>
              {isFa ? "آفرین! جلسه با موفقیت تکمیل شد" : "Awesome Job! Lesson Completed"}
            </h2>
            <p className={styles.sectionSubtitle}>
              {isFa
                ? "شما تمامی بخش‌های واژگان، گرامر، درک مطلب و آزمون این جلسه را با موفقیت پشت سر گذاشتید."
                : "You have completed all vocabulary, grammar rules, reading exercises, and formative assessments."}
            </p>

            <div className={styles.completionSummary}>
              <div className={styles.summaryStat}>
                <span className={styles.summaryVal}>+{earnedXp}</span>
                <span className={styles.summaryLabel}>{isFa ? "امتیاز XP کسب‌شده" : "XP Points Earned"}</span>
              </div>
              <div className={styles.summaryStat}>
                <span className={styles.summaryVal}>{correctCount} / {totalQuestions}</span>
                <span className={styles.summaryLabel}>{isFa ? "پاسخ‌های صحیح" : "Correct Answers"}</span>
              </div>
              <div className={styles.summaryStat}>
                <span className={styles.summaryVal}>{lesson.vocabulary.length}</span>
                <span className={styles.summaryLabel}>{isFa ? "واژگان جدید یادگرفته‌شده" : "New Words Mastered"}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap", justifyContent: "center", marginBlockStart: "var(--space-4)" }}>
              <Button variant="secondary" onClick={resetQuiz}>
                🔄 {isFa ? "آزمون مجدد درس" : "Retry Quiz"}
              </Button>
              <Link href="/courses">
                <Button variant="primary">
                  📚 {isFa ? "بازگشت به فهرست دوره‌ها" : "Back to Courses"}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

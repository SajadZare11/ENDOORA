"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import type { HighSchoolLessonModule, HighSchoolVocabItem } from "@endoora/contracts";
import { InteractiveVocabCard } from "./InteractiveVocabCard";
import { ConversationAssembler } from "./ConversationAssembler";
import { ReadingViewer } from "./ReadingViewer";
import { InductiveGrammarPlayer } from "./InductiveGrammarPlayer";
import { ListeningPronunciationPlayer } from "./ListeningPronunciationPlayer";
import { WritingTrainer } from "./WritingTrainer";
import styles from "./highschool-player.module.css";

interface HighSchoolLessonPlayerProps {
  lesson: HighSchoolLessonModule;
}

type SectionKey =
  | "getReady"
  | "conversation"
  | "newWords"
  | "reading"
  | "grammar"
  | "listening"
  | "writing";

const SECTIONS_CONFIG: {
  key: SectionKey;
  titleFa: string;
  titleEn: string;
  icon: string;
  index: number;
}[] = [
  { key: "getReady", titleFa: "آمادگی و پیش‌درآمد", titleEn: "Get Ready", icon: "🎯", index: 1 },
  { key: "conversation", titleFa: "مکالمه و گفتگو", titleEn: "Conversation", icon: "💬", index: 2 },
  { key: "newWords", titleFa: "واژگان و اصطلاحات", titleEn: "New Words", icon: "📖", index: 3 },
  { key: "reading", titleFa: "درک مطلب و ریدینگ", titleEn: "Reading", icon: "📑", index: 4 },
  { key: "grammar", titleFa: "گرامر و ساختار زبان", titleEn: "Grammar", icon: "⚡", index: 5 },
  { key: "listening", titleFa: "شنیداری و تلفظ", titleEn: "Listening", icon: "🎧", index: 6 },
  { key: "writing", titleFa: "مهارت نگارش", titleEn: "Writing", icon: "✍️", index: 7 },
];

export const HighSchoolLessonPlayer: React.FC<HighSchoolLessonPlayerProps> = ({
  lesson
}) => {
  const [activeSection, setActiveSection] = useState<SectionKey>("getReady");
  const [completedSections, setCompletedSections] = useState<Record<SectionKey, boolean>>({
    getReady: false,
    conversation: false,
    newWords: false,
    reading: false,
    grammar: false,
    listening: false,
    writing: false
  });
  const [mistakeQueue, setMistakeQueue] = useState<HighSchoolVocabItem[]>([]);
  const [showReviewQueue, setShowReviewQueue] = useState(false);

  // Grade helper
  const gradeFa = lesson.grade === 10 ? "دهم" : lesson.grade === 11 ? "یازدهم" : "دوازدهم";
  const maxLessons = lesson.grade === 10 ? 4 : 3;
  const hasNextLesson = lesson.lessonNumber < maxLessons;
  const nextLessonUrl = `/high-school/grade-${lesson.grade}/lesson-${lesson.lessonNumber + 1}`;

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`hs_progress_${lesson.id}`);
      if (saved) {
        setCompletedSections(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, [lesson.id]);

  // Persist progress to localStorage
  const markSectionComplete = (key: SectionKey) => {
    setCompletedSections((prev) => {
      const next = { ...prev, [key]: true };
      try {
        localStorage.setItem(`hs_progress_${lesson.id}`, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const handleVocabMistake = (item: HighSchoolVocabItem) => {
    setMistakeQueue((prev) => {
      if (prev.some((m) => m.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const completedCount = Object.values(completedSections).filter(Boolean).length;
  const progressPercentage = Math.round((completedCount / SECTIONS_CONFIG.length) * 100);

  const activeIndex = SECTIONS_CONFIG.findIndex((s) => s.key === activeSection);
  const prevSection = activeIndex > 0 ? SECTIONS_CONFIG[activeIndex - 1].key : null;
  const nextSection = activeIndex < SECTIONS_CONFIG.length - 1 ? SECTIONS_CONFIG[activeIndex + 1].key : null;

  return (
    <div className={styles.container}>
      {/* Ambient background glows */}
      <div className={styles.ambientGlowPrimary} aria-hidden="true" />
      <div className={styles.ambientGlowSecondary} aria-hidden="true" />

      {/* Breadcrumbs Navigation */}
      <nav className={styles.breadcrumbs} aria-label="مسیر درس">
        <Link href="/">خانه</Link>
        <span>/</span>
        <Link href="/skills/school">زبان دبیرستان</Link>
        <span>/</span>
        <Link href={`/high-school/grade-${lesson.grade}`}>
          پایه {gradeFa} ({lesson.bookTitle})
        </Link>
        <span>/</span>
        <span aria-current="page">درس {lesson.lessonNumber}: {lesson.title.fa}</span>
      </nav>

      {/* Two-Column Responsive Layout: Right Sidebar (7 Sections) + Left Main Content Area */}
      <div className={styles.lessonLayout}>
        {/* RIGHT COLUMN: The 7 Sections Sidebar ("در کنار سمت راست") */}
        <aside className={styles.sidebarCol} aria-label="فهرست بخش‌های درس">
          <div className={styles.sidebarCard}>
            {/* macOS Window Chrome Header */}
            <div className={styles.windowChrome}>
              <div className={styles.chromeDots}>
                <span className={styles.trafficRed} />
                <span className={styles.trafficYellow} />
                <span className={styles.trafficGreen} />
              </div>
              <div className={styles.chromeTitle}>
                <span>{lesson.bookTitle}</span>
                <span>•</span>
                <span>Lesson {lesson.lessonNumber}</span>
              </div>
            </div>

            <div className={styles.sidebarBody}>
              <div className={styles.sidebarHeaderRow}>
                <h2 className={styles.sidebarTitle}>
                  <span>📑</span>
                  <span>بخش‌های هفت‌گانه درس</span>
                </h2>
                <span className={styles.badgeSuccess}>
                  {progressPercentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className={styles.progressBarContainer}>
                <div
                  className={styles.progressBarFill}
                  style={{ inlineSize: `${progressPercentage}%` }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--color-muted, #64748b)", marginBlock: "0.2rem 0.5rem", fontWeight: 700 }}>
                <span>تکمیل: {completedCount} از ۷ بخش</span>
                <span>سطح: {lesson.cefrLevel}</span>
              </div>

              {mistakeQueue.length > 0 && (
                <button
                  type="button"
                  className={styles.sidebarTabButton}
                  style={{ background: "#fff7ed", borderColor: "#fed7aa", color: "#c2410c", marginBlock: "0.4rem 0" }}
                  onClick={() => setShowReviewQueue((prev) => !prev)}
                >
                  <span className={styles.tabIconBadge} style={{ background: "#ffedd5" }}>🔄</span>
                  <div className={styles.tabTextCol}>
                    <span className={styles.tabTitleFa}>مرور کلمات پرچالش</span>
                    <span className={styles.tabTitleEn}>{mistakeQueue.length} کلمه نیازمند تثبیت</span>
                  </div>
                </button>
              )}

              {/* 7 Vertical Navigation Items */}
              <nav className={styles.sidebarNav} aria-label={`بخش‌های درس ${lesson.lessonNumber} پایه ${gradeFa}`}>
                {SECTIONS_CONFIG.map((sec) => {
                  const isActive = activeSection === sec.key;
                  const isCompleted = completedSections[sec.key];

                  return (
                    <button
                      key={sec.key}
                      type="button"
                      className={`${styles.sidebarTabButton} ${isActive ? styles.sidebarTabButtonActive : ""}`}
                      onClick={() => setActiveSection(sec.key)}
                    >
                      <span className={styles.tabIconBadge}>{sec.icon}</span>
                      <div className={styles.tabTextCol}>
                        <span className={styles.tabTitleFa}>{sec.titleFa}</span>
                        <span className={styles.tabTitleEn}>{sec.titleEn}</span>
                      </div>
                      <span className={`${styles.tabStatusBadge} ${isCompleted ? styles.tabStatusBadgeCompleted : ""}`}>
                        {isCompleted ? "✓" : sec.index}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </aside>

        {/* LEFT COLUMN: Main Content Area */}
        <div className={styles.mainCol}>
          {/* Main Hero Header */}
          <header className={styles.mainHero}>
            <div className={styles.statsRow} style={{ marginBottom: "0.6rem" }}>
              <span className={styles.badge}>
                🎓 پایه {gradeFa} ({lesson.bookTitle})
              </span>
              <span className={styles.badgeSuccess}>
                🌐 سطح بین‌المللی: {lesson.cefrLevel}
              </span>
              <span className={styles.statPill}>
                ⚡ ۷ مهارت استاندارد
              </span>
              <span className={styles.statPill}>
                🎧 مجهز به صوت هوشمند
              </span>
            </div>

            <div>
              <h1 className={styles.lessonTitle}>
                <span>درس {lesson.lessonNumber}:</span>
                <span className={styles.heroBrandWrap}>
                  <span className={styles.heroBrandText}>{lesson.title.fa}</span>
                  <svg
                    className={styles.heroSpark}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
                      fill="url(#sparkGradientHighSchool)"
                    />
                    <defs>
                      <linearGradient id="sparkGradientHighSchool" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#06b6d4" />
                        <stop offset="0.5" stopColor="#38bdf8" />
                        <stop offset="1" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <span className={styles.lessonTitleEn}>({lesson.title.en})</span>
              </h1>
            </div>
          </header>

          {/* Mistake Review Queue Drawer (if toggled) */}
          {showReviewQueue && (
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "16px", padding: "1.25rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <strong style={{ color: "#92400e", fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span>🔄</span> جعبه مرور و تثبیت واژگان دارای خطا:
                </strong>
                <button
                  type="button"
                  className={styles.audioSpeakerBtn}
                  onClick={() => setShowReviewQueue(false)}
                >
                  بستن ×
                </button>
              </div>
              <p style={{ margin: "0 0 1rem 0", fontSize: "0.88rem", color: "#b45309", lineHeight: 1.5 }}>
                کلماتی که در انتخاب اول با خطا مواجه شدید در این بخش ذخیره شده‌اند تا با تمرین مجدد کاملاً ملکه ذهن شوند.
              </p>
              <div className={styles.vocabGrid}>
                {mistakeQueue.map((item) => (
                  <InteractiveVocabCard key={`review-${item.id}`} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Active Section Body */}
          <main className={styles.sectionCard}>
            {/* Section 1: Get Ready */}
            {activeSection === "getReady" && (
              <div>
                <div className={styles.sectionHeader}>
                  <div>
                    <h2 className={styles.sectionTitle}>
                      <span>🎯</span> بخش اول: آمادگی و واژگان پیش‌درآمد (Get Ready)
                    </h2>
                    <div className={styles.sectionSubtitle}>
                      تدریس شهودی، تصویری و تعاملی واژگان و عبارات پیش‌درآمد درس {lesson.lessonNumber} کتاب {lesson.bookTitle}
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`${styles.navActionBtn} ${styles.navActionBtnSecondary}`}
                    onClick={() => markSectionComplete("getReady")}
                  >
                    {completedSections.getReady ? "✓ علامت تکمیل خورده" : "علامت‌گذاری به عنوان تکمیل"}
                  </button>
                </div>

                <div style={{ marginBottom: "1.25rem", padding: "0.85rem 1.15rem", background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", borderRadius: "12px", border: "1px solid #bbf7d0", color: "#166534", fontSize: "0.92rem", lineHeight: 1.6 }}>
                  💡 <strong>راهنما:</strong> به تصویر هر عبارت یا مفهوم نگاه کنید و از بین ۳ گزینه روی کلمه صحیح کلیک کنید. پس از انتخاب درست، معنی، تلفظ صوتی و مثال جمله فعال می‌شود.
                </div>

                <div className={styles.vocabGrid}>
                  {lesson.sections.getReady.map((item) => (
                    <InteractiveVocabCard
                      key={item.id}
                      item={item}
                      onSuccess={() => markSectionComplete("getReady")}
                      onMistake={handleVocabMistake}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Section 2: Conversation */}
            {activeSection === "conversation" && (
              <div>
                <div className={styles.sectionHeader}>
                  <div>
                    <h2 className={styles.sectionTitle}>
                      <span>💬</span> بخش دوم: مکالمه و گفتگو (Conversation)
                    </h2>
                    <div className={styles.sectionSubtitle}>
                      واژگان کلیدی کادر آبی + پازل شنیداری چیدمان خط‌به‌خط مکالمه ({lesson.sections.conversation.title})
                    </div>
                  </div>
                </div>

                <ConversationAssembler
                  conversation={lesson.sections.conversation}
                  onComplete={() => markSectionComplete("conversation")}
                  onMistake={handleVocabMistake}
                />
              </div>
            )}

            {/* Section 3: New Words */}
            {activeSection === "newWords" && (
              <div>
                <div className={styles.sectionHeader}>
                  <div>
                    <h2 className={styles.sectionTitle}>
                      <span>📖</span> بخش سوم: واژگان و اصطلاحات درس (New Words & Expressions)
                    </h2>
                    <div className={styles.sectionSubtitle}>
                      تسلط بر کلمات قرمز، تعاریف و اصطلاحات کلیدی متن درس {lesson.lessonNumber}
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`${styles.navActionBtn} ${styles.navActionBtnSecondary}`}
                    onClick={() => markSectionComplete("newWords")}
                  >
                    {completedSections.newWords ? "✓ علامت تکمیل خورده" : "علامت‌گذاری به عنوان تکمیل"}
                  </button>
                </div>

                <div className={styles.vocabGrid}>
                  {lesson.sections.newWords.map((item) => (
                    <InteractiveVocabCard
                      key={item.id}
                      item={item}
                      onSuccess={() => markSectionComplete("newWords")}
                      onMistake={handleVocabMistake}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Section 4: Reading */}
            {activeSection === "reading" && (
              <div>
                <div className={styles.sectionHeader}>
                  <div>
                    <h2 className={styles.sectionTitle}>
                      <span>📑</span> بخش چهارم: درک مطلب و ریدینگ (Reading)
                    </h2>
                    <div className={styles.sectionSubtitle}>
                      متن اصلی: {lesson.sections.reading.title} ({lesson.sections.reading.persianTitle}) + سوالات پنج‌گانه استاندارد
                    </div>
                  </div>
                </div>

                <ReadingViewer
                  reading={lesson.sections.reading}
                  onComplete={() => markSectionComplete("reading")}
                />
              </div>
            )}

            {/* Section 5: Grammar */}
            {activeSection === "grammar" && (
              <div>
                <div className={styles.sectionHeader}>
                  <div>
                    <h2 className={styles.sectionTitle}>
                      <span>⚡</span> بخش پنجم: گرامر و ساختار زبان (Grammar)
                    </h2>
                    <div className={styles.sectionSubtitle}>
                      آموزش استقرایی ۵ مرحله‌ای: {lesson.sections.grammar.persianTopic} ({lesson.sections.grammar.topic})
                    </div>
                  </div>
                </div>

                <InductiveGrammarPlayer
                  grammar={lesson.sections.grammar}
                  onComplete={() => markSectionComplete("grammar")}
                />
              </div>
            )}

            {/* Section 6: Listening & Pronunciation */}
            {activeSection === "listening" && (
              <div>
                <div className={styles.sectionHeader}>
                  <div>
                    <h2 className={styles.sectionTitle}>
                      <span>🎧</span> بخش ششم: شنیداری و تلفظ (Listening & Pronunciation)
                    </h2>
                    <div className={styles.sectionSubtitle}>
                      {lesson.sections.listening.title} + کارگاه آهنگ کلام و تلفظ ({lesson.sections.listening.pronunciation.title})
                    </div>
                  </div>
                </div>

                <ListeningPronunciationPlayer
                  listening={lesson.sections.listening}
                  onComplete={() => markSectionComplete("listening")}
                />
              </div>
            )}

            {/* Section 7: Writing */}
            {activeSection === "writing" && (
              <div>
                <div className={styles.sectionHeader}>
                  <div>
                    <h2 className={styles.sectionTitle}>
                      <span>✍️</span> بخش هفتم: مهارت نگارش (Writing)
                    </h2>
                    <div className={styles.sectionSubtitle}>
                      آموزش استاندارد نگارش: {lesson.sections.writing.nounClassification?.title || "کارگاه نگارش انگلیسی"}
                    </div>
                  </div>
                </div>

                <WritingTrainer
                  writing={lesson.sections.writing}
                  onComplete={() => markSectionComplete("writing")}
                />
              </div>
            )}

            {/* Bottom Navigation Step Controls */}
            <footer className={styles.navFooter}>
              {prevSection ? (
                <button
                  type="button"
                  className={`${styles.navActionBtn} ${styles.navActionBtnSecondary}`}
                  onClick={() => setActiveSection(prevSection)}
                >
                  ← بخش قبلی ({SECTIONS_CONFIG.find((s) => s.key === prevSection)?.titleFa})
                </button>
              ) : (
                <div />
              )}

              {nextSection ? (
                <button
                  type="button"
                  className={`${styles.navActionBtn} ${styles.navActionBtnPrimary}`}
                  onClick={() => {
                    markSectionComplete(activeSection);
                    setActiveSection(nextSection);
                  }}
                >
                  بخش بعدی ({SECTIONS_CONFIG.find((s) => s.key === nextSection)?.titleFa}) →
                </button>
              ) : (
                <div style={{ color: "#16a34a", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <span>🎉</span> شما به آخرین بخش درس {lesson.lessonNumber} رسیدید!
                </div>
              )}
            </footer>
          </main>

          {/* Completion Modal / Banner when 100% finished */}
          {completedCount === SECTIONS_CONFIG.length && (
            <div className={styles.completionBanner}>
              <div style={{ fontSize: "2.75rem", marginBottom: "0.5rem" }}>🏆</div>
              <h2 style={{ margin: "0 0 0.5rem 0", color: "var(--color-text, #0f172a)", fontSize: "1.45rem", fontWeight: 900 }}>
                تبریک فراوان! شما تمامی ۷ بخش درس {lesson.lessonNumber} پایه {gradeFa} را با موفقیت پشت سر گذاشتید!
              </h2>
              <p style={{ margin: "0 0 1.25rem 0", color: "var(--color-muted, #475569)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                تمام واژگان پیش‌درآمد، پازل مکالمه، درک مطلب ریدینگ، گرامر استقرایی، مهارت شنیداری و تلفظ، و اصول نگارش درس ({lesson.title.fa} - {lesson.title.en}) با تسلط کامل تکمیل شدند.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                {hasNextLesson ? (
                  <Link
                    href={nextLessonUrl}
                    className={`${styles.navActionBtn} ${styles.navActionBtnPrimary}`}
                    style={{ textDecoration: "none" }}
                  >
                    ورود به درس بعدی (درس {lesson.lessonNumber + 1}) ➔
                  </Link>
                ) : lesson.grade === 12 ? (
                  <Link
                    href="/high-school/grade-12/tamrin20"
                    className={`${styles.navActionBtn} ${styles.navActionBtnPrimary}`}
                    style={{ textDecoration: "none" }}
                  >
                    ورود به تمرین تا ۲۰ (بانک سوالات نهایی) ➔
                  </Link>
                ) : (
                  <Link
                    href={`/high-school/grade-${lesson.grade + 1}`}
                    className={`${styles.navActionBtn} ${styles.navActionBtnPrimary}`}
                    style={{ textDecoration: "none" }}
                  >
                    ورود به پایه بعدی (پایه {lesson.grade === 10 ? "یازدهم" : "دوازدهم"}) ➔
                  </Link>
                )}
                <Link
                  href={`/high-school/grade-${lesson.grade}`}
                  className={`${styles.navActionBtn} ${styles.navActionBtnSecondary}`}
                  style={{ textDecoration: "none" }}
                >
                  فهرست دروس پایه {gradeFa}
                </Link>
                <Link
                  href="/skills/school"
                  className={`${styles.navActionBtn} ${styles.navActionBtnSecondary}`}
                  style={{ textDecoration: "none" }}
                >
                  مرکز آموزش زبان دبیرستان
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

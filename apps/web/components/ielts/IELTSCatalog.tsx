"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ALL_IELTS_EXAMS } from "../../data/ielts/index.ts";
import { listAttemptsFromStorage } from "../../lib/ielts-state.ts";
import type {
  IeltsExam,
  IeltsExamCategory,
  IeltsSkill,
  ExamAttempt,
} from "@endoora/contracts";
import styles from "./ielts-catalog.module.css";

export function IELTSCatalog() {
  const [activeTab, setActiveTab] = useState<"catalog" | "results">("catalog");
  const [selectedSkill, setSelectedSkill] = useState<IeltsSkill | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<IeltsExamCategory | "all">("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [recentAttempts, setRecentAttempts] = useState<ExamAttempt[]>([]);
  const [expandedExamIds, setExpandedExamIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load local storage attempts on mount
    const attempts = listAttemptsFromStorage();
    setRecentAttempts(attempts);
  }, []);

  const toggleAccordion = (examId: string) => {
    setExpandedExamIds((prev) => {
      const next = new Set(prev);
      if (next.has(examId)) {
        next.delete(examId);
      } else {
        next.add(examId);
      }
      return next;
    });
  };

  const filteredExams = useMemo(() => {
    return ALL_IELTS_EXAMS.filter((exam) => {
      if (selectedCategory !== "all" && exam.category !== selectedCategory) {
        return false;
      }
      if (selectedSource !== "all" && exam.source.toLowerCase() !== selectedSource.toLowerCase()) {
        return false;
      }
      if (selectedSkill !== "all") {
        const hasSkill = exam.modules.some((m) => m.skill === selectedSkill);
        if (!hasSkill) return false;
      }
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = exam.title.toLowerCase().includes(q);
        const matchesDesc = exam.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) return false;
      }
      return true;
    });
  }, [selectedSkill, selectedCategory, selectedSource, searchQuery]);

  // Compute analytics
  const highestBand = useMemo(() => {
    const scores = recentAttempts
      .map((a) => a.band_score)
      .filter((b): b is number => typeof b === "number");
    return scores.length > 0 ? Math.max(...scores) : null;
  }, [recentAttempts]);

  return (
    <div className={styles.container}>
      {/* Top Navigation Tabs */}
      <nav className={styles.topNavTrack} aria-label="بخش‌های آیلتس ایندورا">
        <button
          type="button"
          className={`${styles.navTabBtn} ${activeTab === "catalog" ? styles.navTabActive : ""}`}
          onClick={() => setActiveTab("catalog")}
        >
          <span>📚</span>
          <span>بانک آزمون‌های ماک کمبریج</span>
          <span className={styles.navTabBadge}>{ALL_IELTS_EXAMS.length}</span>
        </button>

        <button
          type="button"
          className={`${styles.navTabBtn} ${activeTab === "results" ? styles.navTabActive : ""}`}
          onClick={() => setActiveTab("results")}
        >
          <span>📋</span>
          <span>کارنامه‌ها و نتایج من</span>
          {recentAttempts.length > 0 && (
            <span className={styles.navTabBadge}>{recentAttempts.length}</span>
          )}
        </button>

        <Link href="/ielts/clinics" className={styles.navTabBtn}>
          <span>🎯</span>
          <span>کلینیک‌های استراتژی و تله‌زدایی</span>
        </Link>

        <Link href="/ielts/writing" className={styles.navTabBtn}>
          <span>✍️</span>
          <span>شبیه‌ساز رایتینگ</span>
        </Link>

        <Link href="/ielts/speaking" className={styles.navTabBtn}>
          <span>🎙️</span>
          <span>شبیه‌ساز اسپیکینگ</span>
        </Link>
      </nav>

      {/* Hero Section */}
      <header className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroKickerRow}>
            <span className={styles.heroKickerBadge}>
              <span>🏛️</span>
              <span>Official Cambridge Simulation</span>
            </span>
            <span className={styles.heroVersionBadge}>CD-IELTS Standard 2026</span>
          </div>

          <h1 className={styles.heroTitle}>بانک رسمی آزمون‌های شبیه‌ساز کامپیوتری آیلتس</h1>
          <p className={styles.subtitle}>
            محیط شبیه‌ساز واقعی با سوالات استاندارد آزمون‌های کمبریج ۱۷ و ۱۸، فایل‌های صوتی با کیفیت بومی،
            تایمر زمان‌بندی دقیق آزمون و تبدیل نمره خام به باند ۱ تا ۹ بر مبنای جدول رسمی ارزیابی.
          </p>

          <div className={styles.heroStatsRow}>
            <div className={styles.heroStatChip}>
              <span>📚</span>
              <span>بیش از ۲۰ ماک‌تست کامل کمبریج</span>
            </div>
            <div className={styles.heroStatChip}>
              <span>⏱️</span>
              <span>تایمر استاندارد British Council / IDP</span>
            </div>
            <div className={styles.heroStatChip}>
              <span>🎯</span>
              <span>محاسبه آنی نمره Band Score ۱ تا ۹</span>
            </div>
          </div>
        </div>
      </header>

      {/* VIEW MODE 1: CATALOG MODE */}
      {activeTab === "catalog" && (
        <>
          {/* Segmented Filter & Search Control Bar */}
          <section className={styles.filterContainer} aria-label="فیلترهای هوشمند آزمون">
            <div className={styles.searchRow}>
              <div className={styles.searchInputWrapper}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="search"
                  className={styles.searchInput}
                  placeholder="جستجوی نام آزمون (مثلاً: Cambridge 18, Academic Test 1)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className={styles.clearSearchBtn}
                    onClick={() => setSearchQuery("")}
                    aria-label="پاک کردن جستجو"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className={styles.filterControlsRow}>
              {/* Category Segment Group (Academic / General) */}
              <div className={styles.categorySegmentGroup} role="group" aria-label="نوع ماژول">
                <button
                  type="button"
                  className={`${styles.segmentBtn} ${
                    selectedCategory === "all" ? styles.segmentBtnActive : ""
                  }`}
                  onClick={() => setSelectedCategory("all")}
                >
                  همه ماژول‌ها
                </button>
                <button
                  type="button"
                  className={`${styles.segmentBtn} ${
                    selectedCategory === "Academic" ? styles.segmentBtnActive : ""
                  }`}
                  onClick={() => setSelectedCategory("Academic")}
                >
                  آکادمیک (Academic)
                </button>
                <button
                  type="button"
                  className={`${styles.segmentBtn} ${
                    selectedCategory === "General" ? styles.segmentBtnActive : ""
                  }`}
                  onClick={() => setSelectedCategory("General")}
                >
                  جنرال ترینینگ (General)
                </button>
              </div>

              {/* Source & Skill Pills */}
              <div className={styles.pillsScrollGroup}>
                {/* Source Filter */}
                <button
                  type="button"
                  className={`${styles.filterPill} ${
                    selectedSource === "all" ? styles.filterPillActive : ""
                  }`}
                  onClick={() => setSelectedSource("all")}
                >
                  همه کتاب‌ها
                </button>
                <button
                  type="button"
                  className={`${styles.filterPill} ${
                    selectedSource === "cambridge" ? styles.filterPillActive : ""
                  }`}
                  onClick={() => setSelectedSource("cambridge")}
                >
                  <span>📕</span>
                  <span>کمبریج ۱۷ و ۱۸</span>
                </button>
                <button
                  type="button"
                  className={`${styles.filterPill} ${
                    selectedSource === "recent actual" ? styles.filterPillActive : ""
                  }`}
                  onClick={() => setSelectedSource("recent actual")}
                >
                  <span>⚡</span>
                  <span>Recent Actual</span>
                </button>

                {/* Skill Filter */}
                <button
                  type="button"
                  className={`${styles.filterPill} ${
                    selectedSkill === "all" ? styles.filterPillActive : ""
                  }`}
                  onClick={() => setSelectedSkill("all")}
                >
                  همه مهارت‌ها
                </button>
                <button
                  type="button"
                  className={`${styles.filterPill} ${
                    selectedSkill === "listening" ? styles.filterPillActive : ""
                  }`}
                  onClick={() => setSelectedSkill("listening")}
                >
                  🎧 لیسنینگ
                </button>
                <button
                  type="button"
                  className={`${styles.filterPill} ${
                    selectedSkill === "reading" ? styles.filterPillActive : ""
                  }`}
                  onClick={() => setSelectedSkill("reading")}
                >
                  📖 ریدینگ
                </button>
                <button
                  type="button"
                  className={`${styles.filterPill} ${
                    selectedSkill === "writing" ? styles.filterPillActive : ""
                  }`}
                  onClick={() => setSelectedSkill("writing")}
                >
                  ✍️ رایتینگ
                </button>
                <button
                  type="button"
                  className={`${styles.filterPill} ${
                    selectedSkill === "speaking" ? styles.filterPillActive : ""
                  }`}
                  onClick={() => setSelectedSkill("speaking")}
                >
                  🎙️ اسپیکینگ
                </button>
              </div>
            </div>
          </section>

          {/* Minimal Accordion Exam Cards List */}
          <main className={styles.examListContainer} aria-label="فهرست آزمون‌های آیلتس">
            {filteredExams.map((exam) => {
              const isExpanded = expandedExamIds.has(exam.id);
              const lMod = exam.modules.find((m) => m.skill === "listening");
              const rMod = exam.modules.find((m) => m.skill === "reading");
              const wMod = exam.modules.find((m) => m.skill === "writing");
              const sMod = exam.modules.find((m) => m.skill === "speaking");

              return (
                <article key={exam.id} className={styles.examAccordionCard}>
                  {/* Collapsed Header Row */}
                  <div
                    className={styles.cardHeaderRow}
                    onClick={() => toggleAccordion(exam.id)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleAccordion(exam.id);
                      }
                    }}
                  >
                    <div className={styles.cardHeaderLeft}>
                      <span className={styles.cambridgeBadge}>{exam.source.toUpperCase()}</span>
                      <span
                        className={
                          exam.category === "Academic"
                            ? styles.moduleBadgeAcademic
                            : styles.moduleBadgeGeneral
                        }
                      >
                        {exam.category === "Academic" ? "Academic" : "General Training"}
                      </span>
                      <h2 className={styles.cardTitle}>{exam.title}</h2>
                    </div>

                    <div className={styles.cardHeaderRight}>
                      <span className={styles.cardDurationChip}>
                        <span>⏱️</span>
                        <span>{exam.total_duration_minutes} دقیقه</span>
                      </span>

                      <div className={styles.skillsPillGroup}>
                        {lMod && <span className={styles.skillMiniTag} title="Listening">🎧</span>}
                        {rMod && <span className={styles.skillMiniTag} title="Reading">📖</span>}
                        {wMod && <span className={styles.skillMiniTag} title="Writing">✍️</span>}
                        {sMod && <span className={styles.skillMiniTag} title="Speaking">🎙️</span>}
                      </div>

                      <span className={styles.expandChevron}>
                        <span>{isExpanded ? "بستن" : "جزییات و شروع"}</span>
                        <span>{isExpanded ? "▲" : "▼"}</span>
                      </span>
                    </div>
                  </div>

                  {/* Expanded Accordion Drawer */}
                  {isExpanded && (
                    <div className={styles.drawerContent}>
                      <p className={styles.drawerDescription}>{exam.description}</p>

                      {/* 4-Module Specifications Grid */}
                      <div className={styles.moduleBreakdownGrid}>
                        <div className={styles.moduleInfoCard}>
                          <div className={styles.moduleIconSquare}>🎧</div>
                          <div>
                            <h3 className={styles.moduleNameTitle}>شنیداری (Listening)</h3>
                            <p className={styles.moduleSpecText}>
                              {lMod ? "۴۰ سوال • ۴ بخش صوتی • ۳۰ دقیقه" : "در این آزمون موجود نیست"}
                            </p>
                          </div>
                        </div>

                        <div className={styles.moduleInfoCard}>
                          <div className={styles.moduleIconSquare}>📖</div>
                          <div>
                            <h3 className={styles.moduleNameTitle}>درک مطلب (Reading)</h3>
                            <p className={styles.moduleSpecText}>
                              {rMod ? "۴۰ سوال • ۳ متن تحلیلی • ۶۰ دقیقه" : "در این آزمون موجود نیست"}
                            </p>
                          </div>
                        </div>

                        <div className={styles.moduleInfoCard}>
                          <div className={styles.moduleIconSquare}>✍️</div>
                          <div>
                            <h3 className={styles.moduleNameTitle}>نگارش (Writing)</h3>
                            <p className={styles.moduleSpecText}>
                              {wMod ? "تسک ۱ و ۲ • ۶۰ دقیقه • تصحیح هوشمند" : "در این آزمون موجود نیست"}
                            </p>
                          </div>
                        </div>

                        <div className={styles.moduleInfoCard}>
                          <div className={styles.moduleIconSquare}>🎙️</div>
                          <div>
                            <h3 className={styles.moduleNameTitle}>گفتار (Speaking)</h3>
                            <p className={styles.moduleSpecText}>
                              {sMod ? "پارت‌های ۱ تا ۳ • کیوکارد • ۱۴ دقیقه" : "در این آزمون موجود نیست"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions Row */}
                      <div className={styles.drawerActionsRow}>
                        <Link
                          href={`/ielts/exam/${exam.id}`}
                          className={styles.primaryStartExamBtn}
                        >
                          <span>🚀</span>
                          <span>شروع شبیه‌ساز کامل کامپیوتری (Computer-Delivered)</span>
                          <span aria-hidden="true">←</span>
                        </Link>

                        <div className={styles.skillPracticeGroup}>
                          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b" }}>
                            تمرین تک‌مهارتی:
                          </span>
                          {rMod && (
                            <Link
                              href={`/ielts/exam/${exam.id}?skill=reading`}
                              className={styles.skillPracticeBtn}
                            >
                              📖 فقط ریدینگ
                            </Link>
                          )}
                          {lMod && (
                            <Link
                              href={`/ielts/exam/${exam.id}?skill=listening`}
                              className={styles.skillPracticeBtn}
                            >
                              🎧 فقط لیسنینگ
                            </Link>
                          )}
                          {wMod && (
                            <Link
                              href={`/ielts/writing?examId=${exam.id}`}
                              className={styles.skillPracticeBtn}
                            >
                              ✍️ فقط رایتینگ
                            </Link>
                          )}
                          {sMod && (
                            <Link
                              href={`/ielts/speaking?examId=${exam.id}`}
                              className={styles.skillPracticeBtn}
                            >
                              🎙️ فقط اسپیکینگ
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </main>

          {filteredExams.length === 0 && (
            <div className={styles.emptyState}>
              <p>هیچ آزمونی با معیارهای فیلتر انتخاب‌شده یافت نشد.</p>
              <button
                type="button"
                className={styles.filterPill}
                style={{ marginTop: "1rem" }}
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedSource("all");
                  setSelectedSkill("all");
                  setSearchQuery("");
                }}
              >
                پاک کردن تمام فیلترها
              </button>
            </div>
          )}
        </>
      )}

      {/* VIEW MODE 2: MY RESULTS & ANALYTICS MODE */}
      {activeTab === "results" && (
        <section className={styles.resultsTabContainer} aria-label="کارنامه‌های آزمون آزمایشی">
          {recentAttempts.length > 0 ? (
            <>
              {/* Summary Banner */}
              <div className={styles.resultsSummaryBanner}>
                <div className={styles.resultsStatCard}>
                  <div className={styles.resultsStatVal}>{recentAttempts.length}</div>
                  <div className={styles.resultsStatLabel}>آزمون‌های تکمیل‌شده</div>
                </div>

                <div className={styles.resultsStatCard}>
                  <div className={styles.resultsStatVal} style={{ color: "#38bdf8" }}>
                    {highestBand !== null ? `Band ${highestBand}` : "—"}
                  </div>
                  <div className={styles.resultsStatLabel}>بالاترین باند اسکور</div>
                </div>

                <div className={styles.resultsStatCard}>
                  <div className={styles.resultsStatVal} style={{ color: "#facc15" }}>
                    رسمی کمبریج
                  </div>
                  <div className={styles.resultsStatLabel}>معیار تطبیق کارنامه</div>
                </div>
              </div>

              {/* Attempts Grid */}
              <div className={styles.resultsGrid}>
                {recentAttempts.map((att) => (
                  <div key={att.id} className={styles.resultItemCard}>
                    <div>
                      <h3 style={{ fontSize: "1rem", fontWeight: 800, margin: "0 0 0.4rem 0" }}>
                        {att.exam_title}
                      </h3>
                      <div style={{ fontSize: "0.825rem", color: "#64748b" }}>
                        مهارت: <strong>{att.skill.toUpperCase()}</strong> • وضعیت:{" "}
                        <span style={{ color: "#10b981", fontWeight: 700 }}>تکمیل‌شده</span>
                      </div>
                      {att.raw_score !== undefined && (
                        <div style={{ fontSize: "0.85rem", fontWeight: 700, marginTop: "0.35rem", color: "#334155" }}>
                          نمره خام: {att.raw_score} از ۴۰
                        </div>
                      )}
                      <Link
                        href={`/ielts/results/${att.id}`}
                        className={styles.viewAnalysisBtn}
                      >
                        <span>📊 مشاهده کارنامه و تحلیل دقیق</span>
                        <span aria-hidden="true">←</span>
                      </Link>
                    </div>

                    <div>
                      {att.band_score !== undefined ? (
                        <div className={styles.resultBandBadge}>Band {att.band_score}</div>
                      ) : (
                        <span style={{ fontSize: "0.9rem", color: "#94a3b8" }}>—</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 0.5rem 0" }}>
                هنوز کارنامه‌ای ثبت نشده است
              </h3>
              <p style={{ maxWidth: 450, margin: "0 auto 1.5rem auto", color: "#64748b", lineHeight: 1.6 }}>
                با شرکت در اولین آزمون آزمایشی کمبریج، نمره باند، تحلیل نقاط ضعف و کالبدشکافی پاسخ‌های شما
                در این بخش نمایش داده خواهد شد.
              </p>
              <button
                type="button"
                className={styles.primaryStartExamBtn}
                onClick={() => setActiveTab("catalog")}
              >
                <span>ورود به بانک آزمون‌ها و شروع اولین ماک</span>
                <span aria-hidden="true">←</span>
              </button>
            </div>
          )}
        </section>
      )}

      {/* Subtle Footer Disclaimer */}
      <footer className={styles.subtleDisclaimerFooter}>
        <p>
          این سامانه بر اساس ساختار استاندارد بین‌المللی آزمون کامپیوتری آیلتس (کمبریج ۱۷ و ۱۸) طراحی شده و
          محاسبه نمرات ریدینگ و لیسنینگ منطبق بر منحنی رسمی تبدیل نمرات خام آزمون‌های Academic و General Training کمبریج
          انجام می‌شود.
        </p>
      </footer>
    </div>
  );
}

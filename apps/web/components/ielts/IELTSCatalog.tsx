'use client';

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
  const [selectedSkill, setSelectedSkill] = useState<IeltsSkill | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<IeltsExamCategory | "all">("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [recentAttempts, setRecentAttempts] = useState<ExamAttempt[]>([]);

  useEffect(() => {
    // Load local storage attempts on mount
    const attempts = listAttemptsFromStorage();
    setRecentAttempts(attempts);
  }, []);

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

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <header className={styles.header}>
        <span className={styles.kicker}>IELTS Simulation & Mock Exam Library</span>
        <h1 className={styles.title}>بانک رسمی آزمون‌های آزمایشی آیلتس</h1>
        <p className={styles.subtitle}>
          محیط استاندارد شبیه‌ساز کامپیوتری آیلتس (Computer-Delivered IELTS) با تایمر رسمی،
          پخش صوت، تصحیح خودکار هوشمند و تبدیل نمره خام به باند ۱ تا ۹ بر اساس جدول رسمی کمبریج.
        </p>
      </header>

      {/* Legal & Educational Disclaimer */}
      <aside className={styles.disclaimerBanner} role="note">
        <span className={styles.disclaimerBadge}>توجه استاندارد</span>
        <p className={styles.disclaimerText}>
          این آزمون‌ها بر اساس ساختار استاندارد بین‌المللی آیلتس (کمبریج ۱۷ و ۱۸) طراحی شده‌اند.
          نمرات محاسباتی ریدینگ و لیسنینگ منطبق بر منحنی رسمی تبدیل نمرات خام آزمون‌های Academic و General Training ارائه می‌گردند.
        </p>
      </aside>

      {/* Filter and Search Bar */}
      <section className={styles.filterSection} aria-label="فیلترهای آزمون">
        <div className={styles.searchBar}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="جستجوی نام آزمون (مثلاً: Cambridge 18, Academic, General)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Skill Filter */}
        <div className={styles.filterRow}>
          <span className={styles.filterLabel}>مهارت:</span>
          <div className={styles.filterPills}>
            <button
              type="button"
              className={`${styles.pillBtn} ${selectedSkill === "all" ? styles.pillBtnActive : ""}`}
              onClick={() => setSelectedSkill("all")}
            >
              همه مهارت‌ها (All Skills)
            </button>
            <button
              type="button"
              className={`${styles.pillBtn} ${selectedSkill === "listening" ? styles.pillBtnActive : ""}`}
              onClick={() => setSelectedSkill("listening")}
            >
              شنیداری (Listening - 40 Qs)
            </button>
            <button
              type="button"
              className={`${styles.pillBtn} ${selectedSkill === "reading" ? styles.pillBtnActive : ""}`}
              onClick={() => setSelectedSkill("reading")}
            >
              درک مطلب (Reading - 40 Qs)
            </button>
            <button
              type="button"
              className={`${styles.pillBtn} ${selectedSkill === "writing" ? styles.pillBtnActive : ""}`}
              onClick={() => setSelectedSkill("writing")}
            >
              نگارش (Writing - Tasks 1 & 2)
            </button>
            <button
              type="button"
              className={`${styles.pillBtn} ${selectedSkill === "speaking" ? styles.pillBtnActive : ""}`}
              onClick={() => setSelectedSkill("speaking")}
            >
              گفتار (Speaking - Cue Card)
            </button>
          </div>
        </div>

        {/* Module Category Filter */}
        <div className={styles.filterRow}>
          <span className={styles.filterLabel}>نوع ماژول:</span>
          <div className={styles.filterPills}>
            <button
              type="button"
              className={`${styles.pillBtn} ${selectedCategory === "all" ? styles.pillBtnActive : ""}`}
              onClick={() => setSelectedCategory("all")}
            >
              همه (All Modules)
            </button>
            <button
              type="button"
              className={`${styles.pillBtn} ${selectedCategory === "Academic" ? styles.pillBtnActive : ""}`}
              onClick={() => setSelectedCategory("Academic")}
            >
              آکادمیک (Academic)
            </button>
            <button
              type="button"
              className={`${styles.pillBtn} ${selectedCategory === "General" ? styles.pillBtnActive : ""}`}
              onClick={() => setSelectedCategory("General")}
            >
              جنرال ترینینگ (General Training)
            </button>
          </div>
        </div>

        {/* Source Filter */}
        <div className={styles.filterRow}>
          <span className={styles.filterLabel}>منبع آزمون:</span>
          <div className={styles.filterPills}>
            <button
              type="button"
              className={`${styles.pillBtn} ${selectedSource === "all" ? styles.pillBtnActive : ""}`}
              onClick={() => setSelectedSource("all")}
            >
              همه منابع
            </button>
            <button
              type="button"
              className={`${styles.pillBtn} ${selectedSource === "cambridge" ? styles.pillBtnActive : ""}`}
              onClick={() => setSelectedSource("cambridge")}
            >
              کمبریج رسمی (Cambridge 17 / 18)
            </button>
            <button
              type="button"
              className={`${styles.pillBtn} ${selectedSource === "recent actual" ? styles.pillBtnActive : ""}`}
              onClick={() => setSelectedSource("recent actual")}
            >
              سوالات پرتکرار اخیر (Recent Actual)
            </button>
          </div>
        </div>
      </section>

      {/* Exam Grid */}
      <main className={styles.examGrid} aria-label="فهرست آزمون‌های آیلتس">
        {filteredExams.map((exam) => {
          const lMod = exam.modules.find((m) => m.skill === "listening");
          const rMod = exam.modules.find((m) => m.skill === "reading");
          const wMod = exam.modules.find((m) => m.skill === "writing");
          const sMod = exam.modules.find((m) => m.skill === "speaking");

          return (
            <article key={exam.id} className={styles.examCard}>
              <div className={styles.cardTop}>
                <div className={styles.badgesGroup}>
                  <span
                    className={`${styles.badgeCategory} ${
                      exam.category === "General" ? styles.badgeCategoryGeneral : ""
                    }`}
                  >
                    {exam.category === "Academic" ? "Academic" : "General Training"}
                  </span>
                  <span className={styles.badgeSource}>{exam.source}</span>
                </div>
                <span className={styles.cardDuration}>⏱️ {exam.total_duration_minutes} دقیقه</span>
              </div>

              <h2 className={styles.cardTitle}>{exam.title}</h2>
              <p className={styles.cardDesc}>{exam.description}</p>

              <div className={styles.cardMetaRow}>
                <span>پرسش‌های شنیداری: {lMod ? "۴۰ سوال" : "ندارد"}</span>
                <span>پرسش‌های درک مطلب: {rMod ? "۴۰ سوال" : "ندارد"}</span>
              </div>

              <div className={styles.skillPillsRow}>
                {lMod && <span className={styles.skillPill}>🎧 Listening</span>}
                {rMod && <span className={styles.skillPill}>📖 Reading</span>}
                {wMod && <span className={styles.skillPill}>✍️ Writing (Tasks 1 & 2)</span>}
                {sMod && <span className={styles.skillPill}>🎙️ Speaking</span>}
              </div>

              <div className={styles.cardActions}>
                <Link
                  href={`/ielts/exam/${exam.id}`}
                  className={styles.primaryCta}
                >
                  شروع آزمون کامل شبیه‌ساز ➔
                </Link>

                <div className={styles.secondaryActionsGrid}>
                  {rMod && (
                    <Link
                      href={`/ielts/exam/${exam.id}?skill=reading`}
                      className={styles.skillBtn}
                    >
                      تمرین Reading (۴۰ سوال)
                    </Link>
                  )}
                  {lMod && (
                    <Link
                      href={`/ielts/exam/${exam.id}?skill=listening`}
                      className={styles.skillBtn}
                    >
                      تمرین Listening (۴۰ سوال)
                    </Link>
                  )}
                  {wMod && (
                    <Link
                      href={`/ielts/writing?examId=${exam.id}`}
                      className={styles.skillBtn}
                    >
                      تمرین Writing
                    </Link>
                  )}
                  {sMod && (
                    <Link
                      href={`/ielts/speaking?examId=${exam.id}`}
                      className={styles.skillBtn}
                    >
                      تمرین Speaking
                    </Link>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </main>

      {filteredExams.length === 0 && (
        <div className={styles.emptyState}>
          <p>هیچ آزمونی با معیارهای فیلتر انتخاب‌شده یافت نشد.</p>
        </div>
      )}

      {/* Recent Attempts History */}
      {recentAttempts.length > 0 && (
        <section className={styles.historySection} aria-label="آزمون‌های انجام‌شده اخیر">
          <h2 className={styles.historyTitle}>
            <span>📋</span> کارنامه‌ها و آزمون‌های اخیر شما
          </h2>
          <div className={styles.historyGrid}>
            {recentAttempts.slice(0, 6).map((att) => (
              <div key={att.id} className={styles.historyCard}>
                <div>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 4px 0" }}>
                    {att.exam_title}
                  </h3>
                  <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                    مهارت: {att.skill.toUpperCase()} | وضعیت:{" "}
                    {att.status === "submitted" ? "تکمیل‌شده" : "در حال انجام"}
                  </div>
                  {att.raw_score !== undefined && (
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, marginTop: "4px", color: "#374151" }}>
                      نمره خام: {att.raw_score} از ۴۰
                    </div>
                  )}
                </div>

                <div style={{ textAlign: "center" }}>
                  {att.band_score !== undefined ? (
                    <div className={styles.historyBand}>Band {att.band_score}</div>
                  ) : (
                    <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>—</span>
                  )}
                  <Link
                    href={`/ielts/results/${att.id}`}
                    className={styles.historyViewBtn}
                  >
                    مشاهده تحلیل
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

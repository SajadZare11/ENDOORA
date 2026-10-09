"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PublicShell } from "@/components/marketing/PublicShell";
import {
  ALL_LISTENING_LESSONS,
  CEFR_LEVELS_ORDER,
  CEFR_DESCRIPTIONS,
  filterListeningLessons,
} from "@/data/listening";
import type {
  CEFRLevel,
  ListeningTopic,
  ListeningContentType,
  EnglishAccent,
  ListeningProgressRecord,
} from "@endoora/contracts";
import {
  loadListeningProgress,
  getPersonalizedRecommendations,
  LISTENING_PROGRESS_EVENT,
} from "@/lib/listening/progress";
import { ListeningProgressBar } from "@/components/listening/ListeningProgressBar";
import { DifficultyProfileModal } from "@/components/listening/DifficultyProfileModal";
import { SkillGameBanner } from "@/components/skills";
import styles from "./listening.module.css";

export default function ListeningLibraryPage() {
  const [progress, setProgress] = useState<ListeningProgressRecord>(loadListeningProgress());
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | "all">("all");
  const [selectedTopic, setSelectedTopic] = useState<ListeningTopic | "all">("all");
  const [selectedAccent, setSelectedAccent] = useState<EnglishAccent | "all">("all");
  const [selectedContentType, setSelectedContentType] = useState<ListeningContentType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleProgressChange = (e: any) => {
      if (e.detail) {
        setProgress(e.detail);
      } else {
        setProgress(loadListeningProgress());
      }
    };

    window.addEventListener(LISTENING_PROGRESS_EVENT, handleProgressChange);
    return () => {
      window.removeEventListener(LISTENING_PROGRESS_EVENT, handleProgressChange);
    };
  }, []);

  const filteredLessons = filterListeningLessons({
    level: selectedLevel,
    topic: selectedTopic,
    accent: selectedAccent,
    contentType: selectedContentType,
    searchQuery,
  });

  const recommendations = getPersonalizedRecommendations(progress, 2);

  const getCefrBadgeClass = (lvl: CEFRLevel) => {
    switch (lvl) {
      case "A1": return styles.cefrA1;
      case "A2": return styles.cefrA2;
      case "B1": return styles.cefrB1;
      case "B2": return styles.cefrB2;
      case "C1": return styles.cefrC1;
      case "C2": return styles.cefrC2;
      default: return styles.cefrB1;
    }
  };

  return (
    <PublicShell locale="fa" currentPath="/skills/listening">
      <div className={styles.container}>
        {/* Back Link to Skills Hub */}
        <div style={{ marginBottom: "1rem" }}>
          <Link
            href="/skills"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#2563eb",
              textDecoration: "none",
            }}
          >
            <span>←</span>
            <span>بازگشت به هاب مهارت‌های شش‌گانه ایندورا</span>
          </Link>
        </div>

        {/* Hero Section */}
        <section className={styles.heroCard}>
          <div className={styles.heroBadge}>
            <span>🎧 سامانه جامع لیسنینگ بر مبنای استاندارد CEFR</span>
          </div>
          <h1 className={styles.heroTitle}>آموزش گام‌به‌گام مهارت شنیداری (A1 تا C2)</h1>
          <p className={styles.heroSubtitle}>
            تقویت ادراک صوتی زبان انگلیسی بدون ترجمه ذهنی؛ با مدل پداگوژیک ۷ مرحله‌ای، پلیر صوتی پیشرفته با بازگشت ۵ ثانیه و تکرار جمله، استودیوی شدوئینگ، و آزمایشگاه دیکته هوشمند.
          </p>
        </section>

        {/* 10-Level CEFR Interactive Game Arena Banner */}
        <SkillGameBanner skill="listening" skillTitleFa="شنیداری و صوت" />

        {/* Dynamic Progress Dashboard */}
        <ListeningProgressBar
          progress={progress}
          selectedLevel={selectedLevel}
          onLevelSelect={(lvl) => setSelectedLevel(lvl)}
        />

        {/* Personalized Recommendations Spotlight */}
        {recommendations.length > 0 && (
          <div className={styles.spotlightCard}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                <span style={{ fontSize: "1.2rem" }}>🎯</span>
                <strong style={{ fontSize: "1rem", color: "#1e3a8a" }}>
                  پیشنهاد هوشمند اختصاصی برای شما (بر مبنای عملکرد اخیر)
                </strong>
              </div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#334155" }}>
                {recommendations[0]?.reasonFa}
              </p>
            </div>
            {recommendations[0] && (
              <Link
                href={`/skills/listening/${recommendations[0].lessonId}`}
                className={styles.enterBtn}
                style={{ background: "#1e40af" }}
              >
                شروع درس پیشنهادی →
              </Link>
            )}
          </div>
        )}

        {/* Level Quick Selection Description (If specific level selected) */}
        {selectedLevel !== "all" && (
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #bfdbfe",
              borderRadius: "12px",
              padding: "1rem 1.25rem",
              marginBottom: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <div>
              <strong style={{ color: "#1e3a8a", fontSize: "0.95rem" }}>
                سطح {selectedLevel}: {CEFR_DESCRIPTIONS[selectedLevel].titleFa} ({CEFR_DESCRIPTIONS[selectedLevel].titleEn})
              </strong>
              <div style={{ fontSize: "0.85rem", color: "#475569", marginTop: "0.25rem" }}>
                {CEFR_DESCRIPTIONS[selectedLevel].descriptionFa}
              </div>
              <div style={{ fontSize: "0.8rem", color: "#2563eb", marginTop: "0.2rem" }}>
                ⚡ سرعت گفتار هدف: {CEFR_DESCRIPTIONS[selectedLevel].speedWpm} | تمرکز آموزشی: {CEFR_DESCRIPTIONS[selectedLevel].targetFocusFa}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedLevel("all")}
              style={{
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                padding: "0.3rem 0.75rem",
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              نمایش همه سطوح
            </button>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className={styles.filterBar}>
          {/* Row 1: Search & Dropdowns */}
          <div className={styles.filterRow}>
            <input
              type="text"
              placeholder="جستجو در عنوان درس، واژگان یا موضوع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchField}
            />

            {/* Topic Filter */}
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value as any)}
              className={styles.selectDropdown}
              aria-label="فیلتر بر اساس موضوع"
            >
              <option value="all">همه موضوعات (All Topics)</option>
              <option value="Food & Dining">غذا و رستوران (Food & Dining)</option>
              <option value="Daily Life">زندگی روزمره (Daily Life)</option>
              <option value="Travel & Transport">سفر و ترابری (Travel & Transport)</option>
              <option value="Work & Career">کار و استخدام (Work & Career)</option>
              <option value="Technology & AI">فناوری و هوش مصنوعی (Tech & AI)</option>
              <option value="Science & Environment">علوم و محیط زیست (Science)</option>
              <option value="Education & Campus">دانشگاه و آکادمیک (Education)</option>
              <option value="Culture & Society">فرهنگ و جامعه (Culture)</option>
              <option value="Arts & Entertainment">هنر و نقد ادبی (Arts)</option>
              <option value="Health & Wellness">سلامت و درمانگاه (Health)</option>
            </select>

            {/* Accent Filter */}
            <select
              value={selectedAccent}
              onChange={(e) => setSelectedAccent(e.target.value as any)}
              className={styles.selectDropdown}
              aria-label="فیلتر بر اساس لهجه"
            >
              <option value="all">همه لهجه‌ها (All Accents)</option>
              <option value="American">آمریکایی (American)</option>
              <option value="British">بریتانیایی (British)</option>
              <option value="Australian">استرالیایی (Australian)</option>
              <option value="Canadian">کانادایی (Canadian)</option>
              <option value="International">بین‌المللی (International)</option>
            </select>

            {/* Content Type Filter */}
            <select
              value={selectedContentType}
              onChange={(e) => setSelectedContentType(e.target.value as any)}
              className={styles.selectDropdown}
              aria-label="فیلتر نوع محتوا"
            >
              <option value="all">همه انواع محتوا</option>
              <option value="Conversation">مکالمه دونفره (Conversation)</option>
              <option value="Interview">مصاحبه (Interview)</option>
              <option value="Announcement">اعلان عمومی (Announcement)</option>
              <option value="Lecture">سخنرانی دانشگاهی (Lecture)</option>
              <option value="Debate">مناظره (Debate)</option>
              <option value="Podcast">پادکست (Podcast)</option>
              <option value="Short Story">داستان کوتاه (Short Story)</option>
              <option value="News Report">گزارش خبری (News Report)</option>
            </select>
          </div>

          {/* Row 2: CEFR Level Pills */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#475569" }}>
              فیلتر بر اساس سطح CEFR:
            </span>
            <div className={styles.levelPills}>
              <button
                type="button"
                className={`${styles.levelPill} ${selectedLevel === "all" ? styles.levelPillActive : ""}`}
                onClick={() => setSelectedLevel("all")}
              >
                همه ({ALL_LISTENING_LESSONS.length})
              </button>
              {CEFR_LEVELS_ORDER.map((lvl) => {
                const count = ALL_LISTENING_LESSONS.filter((l) => l.level === lvl).length;
                return (
                  <button
                    key={lvl}
                    type="button"
                    className={`${styles.levelPill} ${selectedLevel === lvl ? styles.levelPillActive : ""}`}
                    onClick={() => setSelectedLevel(lvl)}
                  >
                    {lvl} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <span style={{ fontSize: "0.9rem", color: "#64748b" }}>
            نمایش {filteredLessons.length} درس صوتی کالیبره‌شده
          </span>
        </div>

        {/* Lessons Cards Grid */}
        <div className={styles.lessonsGrid}>
          {filteredLessons.map((lesson) => {
            const attempt = progress.lessonAttempts[lesson.id];
            const isCompleted = attempt?.isCompleted;

            return (
              <div key={lesson.id} className={styles.lessonCard}>
                <div>
                  {/* Top tags */}
                  <div className={styles.lessonCardHeader}>
                    <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                      <span className={`${styles.cefrBadge} ${getCefrBadgeClass(lesson.level)}`}>
                        {lesson.level}
                      </span>
                      <span className={styles.topicTag}>{lesson.topic}</span>
                      <span className={styles.topicTag} style={{ direction: "ltr" }}>
                        🗣️ {lesson.accent}
                      </span>
                    </div>

                    {isCompleted && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "#16a34a",
                          background: "#dcfce7",
                          padding: "0.15rem 0.5rem",
                          borderRadius: "4px",
                        }}
                      >
                        ✓ تکمیل شده ({attempt.scorePercent}٪)
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className={styles.lessonTitleEn}>{lesson.titleEn}</h3>
                  <div className={styles.lessonTitleFa}>{lesson.titleFa}</div>
                  <p className={styles.lessonSubtitleFa}>{lesson.subtitleFa}</p>

                  {/* Meta stats */}
                  <div className={styles.metaRow}>
                    <span>⏱️ {Math.round(lesson.durationSeconds / 60)} دقیقه ({lesson.durationSeconds}s)</span>
                    <span>⚡ {lesson.speechRateWpm} WPM</span>
                    <span>👥 {lesson.difficulty.numberOfSpeakers} گوینده</span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className={styles.cardFooter}>
                  <DifficultyProfileModal difficulty={lesson.difficulty} />

                  <Link href={`/skills/listening/${lesson.id}`} className={styles.enterBtn}>
                    <span>ورود به کارگاه</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filteredLessons.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 1rem",
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px dashed #cbd5e1",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔍</div>
            <h4 style={{ margin: "0 0 0.5rem 0", color: "#1e293b" }}>هیچ درسی با این مشخصات یافت نشد</h4>
            <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "0 0 1rem 0" }}>
              فیلترهای انتخابی یا عبارت جستجو را پاک کنید تا همه درس‌ها نمایش داده شوند.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedLevel("all");
                setSelectedTopic("all");
                setSelectedAccent("all");
                setSelectedContentType("all");
                setSearchQuery("");
              }}
              className={styles.secBtn}
            >
              پاک کردن فیلترها
            </button>
          </div>
        )}
      </div>
    </PublicShell>
  );
}

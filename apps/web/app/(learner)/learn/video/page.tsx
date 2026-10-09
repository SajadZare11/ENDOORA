"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { VIDEO_LESSONS, VideoSeries } from "@/lib/video-learning";
import styles from "@/components/video-learning/video-learning.module.css";

export default function VideoCatalogPage() {
  const [selectedSeries, setSelectedSeries] = useState<VideoSeries | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLessons = useMemo(() => {
    return VIDEO_LESSONS.filter((lesson) => {
      // Filter by series
      if (selectedSeries !== "all" && lesson.series !== selectedSeries) {
        return false;
      }
      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitleFa = lesson.titleFa.toLowerCase().includes(query);
        const matchesTitleEn = lesson.titleEn.toLowerCase().includes(query);
        const matchesTopics = lesson.keyTopicsFa.some((t) => t.toLowerCase().includes(query));
        const matchesBook = lesson.bookLevel.toLowerCase().includes(query);
        return matchesTitleFa || matchesTitleEn || matchesTopics || matchesBook;
      }
      return true;
    });
  }, [selectedSeries, searchQuery]);

  return (
    <div className={styles.container}>
      {/* Header & Breadcrumb */}
      <div className={styles.headerSection}>
        <nav className={styles.breadcrumb} aria-label="مسیر صفحه">
          <Link href="/dashboard">داشبورد</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/learn">یادگیری</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>یادگیری با ویدیو</span>
        </nav>

        <h1 className={styles.pageTitle}>
          <span>🎬</span>
          <span>یادگیری با ویدیوهای آموزشی و تعاملی</span>
        </h1>
        <p className={styles.pageSubtitle}>
          ویدیوهای منتخب مجموعه‌های استاندارد <strong>Family & Friends</strong> (کودکان و نوآموزان)
          و <strong>American English File</strong> (بزرگسالان و جوانان)؛ هر ویدیو با سناریوهای
          تعاملی و آزمون جامع ۶ مهارته (شنیداری، واژگان، گرامر، گفتاری، خواندن و نگارش) همراه است.
        </p>
      </div>

      {/* Filter Row: Series tabs & Search */}
      <div className={styles.filterRow}>
        <div className={styles.tabsGroup}>
          <button
            type="button"
            className={`${styles.tabBtn} ${
              selectedSeries === "all" ? styles.tabBtnActive : ""
            }`}
            onClick={() => setSelectedSeries("all")}
          >
            <span>همه ویدیوها</span>
            <span className={styles.badgePill}>{VIDEO_LESSONS.length}</span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${
              selectedSeries === "family_and_friends" ? styles.tabBtnActive : ""
            }`}
            onClick={() => setSelectedSeries("family_and_friends")}
          >
            <span>🧸 Family and Friends (کودکان)</span>
            <span className={styles.badgePill}>
              {VIDEO_LESSONS.filter((l) => l.series === "family_and_friends").length}
            </span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${
              selectedSeries === "american_english_file" ? styles.tabBtnActive : ""
            }`}
            onClick={() => setSelectedSeries("american_english_file")}
          >
            <span>📚 American English File (بزرگسالان)</span>
            <span className={styles.badgePill}>
              {VIDEO_LESSONS.filter((l) => l.series === "american_english_file").length}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className={styles.searchBox}>
          <span>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="جست‌وجوی درس، سطح یا موضوع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Video Grid */}
      {filteredLessons.length > 0 ? (
        <div className={styles.videoGrid}>
          {filteredLessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/learn/video/${lesson.id}`}
              className={styles.videoCard}
            >
              {/* Poster Frame */}
              <div
                className={styles.cardPoster}
                style={{ background: lesson.posterGradient }}
              >
                <div className={styles.posterOverlay} />
                <div className={styles.posterIconWrap}>{lesson.posterIcon}</div>

                <div
                  className={`${styles.seriesBadge} ${
                    lesson.series === "family_and_friends"
                      ? styles.badgeFamily
                      : styles.badgeAef
                  }`}
                >
                  {lesson.seriesTitleFa}
                </div>

                <div className={styles.playBadge}>
                  <span>▶</span>
                  <span>{lesson.duration}</span>
                </div>
              </div>

              {/* Body */}
              <div className={styles.cardBody}>
                <div className={styles.cardMetaRow}>
                  <span className={styles.cefrTag}>سطح {lesson.cefr}</span>
                  <span className={styles.unitTag}>{lesson.bookLevel}</span>
                  <span className={styles.unitTag}>·</span>
                  <span className={styles.unitTag}>{lesson.unit}</span>
                </div>

                <h3 className={styles.cardTitleFa}>{lesson.titleFa}</h3>
                <div className={styles.cardTitleEn}>{lesson.titleEn}</div>

                <p className={styles.cardSummary}>{lesson.summaryFa}</p>

                {/* Topics */}
                <div className={styles.cardTopics}>
                  {lesson.keyTopicsFa.map((topic, i) => (
                    <span key={i} className={styles.topicPill}>
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className={styles.cardFooter}>
                  <div className={styles.skillsIndicator} title="سنجش هر ۶ مهارت زبانی">
                    <span>🎧</span>
                    <span>💡</span>
                    <span>📐</span>
                    <span>🎙️</span>
                    <span>📖</span>
                    <span>✍️</span>
                  </div>

                  <span className={styles.cardCta}>
                    <span>مشاهده و آزمون</span>
                    <span>←</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            padding: "3rem 1.5rem",
            textAlign: "center",
            color: "#64748b",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🔍</div>
          <h3 style={{ margin: "0 0 0.5rem", color: "#0f172a" }}>ویدیویی یافت نشد</h3>
          <p style={{ margin: 0, fontSize: "0.875rem" }}>
            با تغییر عبارت جست‌وجو یا فیلتر دسته‌بندی دوباره امتحان کنید.
          </p>
        </div>
      )}
    </div>
  );
}

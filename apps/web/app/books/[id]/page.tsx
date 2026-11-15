"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DOWNLOAD_ITEMS, type DownloadItem } from "../../../data/downloads";
import { getBookContent, type BookContentData, type BookChapter } from "../../../data/bookContents";
import styles from "./reader.module.css";

type ReadingTheme = "sepia" | "dark" | "light" | "sage";
type FontSize = "sm" | "md" | "lg" | "xl";
type ViewMode = "text" | "pdf";

export default function BookReaderPage() {
  const params = useParams();
  const bookId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  // Find book from DOWNLOAD_ITEMS and get rich reading content
  const bookMeta: DownloadItem | undefined = useMemo(() => {
    return DOWNLOAD_ITEMS.find((item) => item.id === bookId);
  }, [bookId]);

  const bookContent: BookContentData = useMemo(() => {
    return getBookContent(bookId);
  }, [bookId]);

  // Reading Preferences State
  const [theme, setTheme] = useState<ReadingTheme>("sepia");
  const [fontSize, setFontSize] = useState<FontSize>("md");
  const [lineHeight, setLineHeight] = useState<"normal" | "relaxed">("normal");
  const [viewMode, setViewMode] = useState<ViewMode>("text");
  const [activeChapterId, setActiveChapterId] = useState<string>("");
  const [isZenMode, setIsZenMode] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Audio companion state
  const companionAudioUrl = useMemo(() => {
    if (bookContent.audioCompanionUrl) return bookContent.audioCompanionUrl;
    const audioSub = bookMeta?.subFiles?.find((s) => s.format === "audio");
    return audioSub?.downloadUrl || null;
  }, [bookContent, bookMeta]);

  // Load preferences and bookmark position from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("endoora_reader_theme") as ReadingTheme | null;
      if (savedTheme && ["sepia", "dark", "light", "sage"].includes(savedTheme)) {
        setTheme(savedTheme);
      }

      const savedFontSize = localStorage.getItem("endoora_reader_fontsize") as FontSize | null;
      if (savedFontSize && ["sm", "md", "lg", "xl"].includes(savedFontSize)) {
        setFontSize(savedFontSize);
      }

      const savedPos = localStorage.getItem(`endoora_reader_pos_${bookId}`);
      if (savedPos && bookContent.chapters.some((ch) => ch.id === savedPos)) {
        setActiveChapterId(savedPos);
      } else if (bookContent.chapters.length > 0) {
        setActiveChapterId(bookContent.chapters[0].id);
      }
    } catch (_) {
      if (bookContent.chapters.length > 0) {
        setActiveChapterId(bookContent.chapters[0].id);
      }
    }
  }, [bookId, bookContent]);

  // Save active chapter bookmark
  const handleSelectChapter = (chId: string) => {
    setActiveChapterId(chId);
    try {
      localStorage.setItem(`endoora_reader_pos_${bookId}`, chId);
    } catch (_) {}
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleThemeChange = (newTheme: ReadingTheme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem("endoora_reader_theme", newTheme);
    } catch (_) {}
  };

  const handleFontSizeChange = (newSize: FontSize) => {
    setFontSize(newSize);
    try {
      localStorage.setItem("endoora_reader_fontsize", newSize);
    } catch (_) {}
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Active chapter object
  const activeChapter: BookChapter | undefined = useMemo(() => {
    return bookContent.chapters.find((ch) => ch.id === activeChapterId) || bookContent.chapters[0];
  }, [bookContent, activeChapterId]);

  // Navigation: previous / next chapter
  const currentChapterIndex = useMemo(() => {
    return bookContent.chapters.findIndex((ch) => ch.id === activeChapter?.id);
  }, [bookContent, activeChapter]);

  const hasPrev = currentChapterIndex > 0;
  const hasNext = currentChapterIndex >= 0 && currentChapterIndex < bookContent.chapters.length - 1;

  const goToPrevChapter = () => {
    if (hasPrev) {
      handleSelectChapter(bookContent.chapters[currentChapterIndex - 1].id);
    }
  };

  const goToNextChapter = () => {
    if (hasNext) {
      handleSelectChapter(bookContent.chapters[currentChapterIndex + 1].id);
    }
  };

  // Determine root theme class
  const themeClass =
    theme === "dark"
      ? styles.themeDark
      : theme === "light"
      ? styles.themeLight
      : theme === "sage"
      ? styles.themeSage
      : styles.themeSepia;

  // Determine font size class
  const fontSizeClass =
    fontSize === "sm"
      ? styles.fontSizeSm
      : fontSize === "lg"
      ? styles.fontSizeLg
      : fontSize === "xl"
      ? styles.fontSizeXl
      : styles.fontSizeMd;

  // Resolved PDF url for viewer
  const pdfViewUrl = useMemo(() => {
    if (bookContent.pdfUrl) return bookContent.pdfUrl;
    if (bookMeta?.downloadUrl?.endsWith(".pdf")) return bookMeta.downloadUrl;
    const pdfSub = bookMeta?.subFiles?.find((s) => s.format === "pdf");
    return pdfSub?.downloadUrl || bookMeta?.downloadUrl || null;
  }, [bookContent, bookMeta]);

  return (
    <div className={`${styles.readerPageRoot} ${themeClass}`}>
      {/* ---------------------------------------------------------------------
          Zen Mode Floating Exit Button
          --------------------------------------------------------------------- */}
      {isZenMode && (
        <button
          type="button"
          className={styles.zenFloatingExit}
          onClick={() => setIsZenMode(false)}
          title="خروج از حالت تمرکز (Zen Mode)"
        >
          <span>✕ خروج از حالت تمرکز</span>
        </button>
      )}

      {/* ---------------------------------------------------------------------
          Top Navigation & Reading Toolbar
          --------------------------------------------------------------------- */}
      <header className={`${styles.topBar} ${isZenMode ? styles.topBarHidden : ""}`}>
        <div className={styles.topBarRight}>
          <Link href="/books" className={styles.backBtn} title="بازگشت به کتابخانه">
            <span>← بازگشت</span>
          </Link>

          <div className={styles.bookMetaTitleBlock}>
            <h1 className={styles.bookTopTitleFa}>{bookContent.titleFa}</h1>
            <div className={styles.bookTopSubMeta}>
              <span>{bookContent.author}</span>
              <span className={styles.badgeLevel}>{bookContent.level}</span>
            </div>
          </div>
        </div>

        <div className={styles.topBarControls}>
          {/* Mode Switcher: e-Reader vs Original PDF */}
          <div className={styles.modeSwitcher} role="group" aria-label="انتخاب نحوه نمایش">
            <button
              type="button"
              className={`${styles.modeBtn} ${viewMode === "text" ? styles.modeBtnActive : ""}`}
              onClick={() => setViewMode("text")}
            >
              <span>📖 متن روان</span>
            </button>
            <button
              type="button"
              className={`${styles.modeBtn} ${viewMode === "pdf" ? styles.modeBtnActive : ""}`}
              onClick={() => setViewMode("pdf")}
            >
              <span>📄 نسخه اصل PDF</span>
            </button>
          </div>

          {/* Theme Selector */}
          <div className={styles.themeGroup} title="تم رنگی مطالعه">
            <button
              type="button"
              className={`${styles.themeBtn} ${styles.themeBtnSepia} ${
                theme === "sepia" ? styles.themeBtnSelected : ""
              }`}
              onClick={() => handleThemeChange("sepia")}
              title="کاغذ کاهی (Sepia)"
              aria-label="تم کاغذ کاهی"
            />
            <button
              type="button"
              className={`${styles.themeBtn} ${styles.themeBtnSage} ${
                theme === "sage" ? styles.themeBtnSelected : ""
              }`}
              onClick={() => handleThemeChange("sage")}
              title="سبز کتابخانه‌ای (Sage)"
              aria-label="تم سبز کتابخانه‌ای"
            />
            <button
              type="button"
              className={`${styles.themeBtn} ${styles.themeBtnLight} ${
                theme === "light" ? styles.themeBtnSelected : ""
              }`}
              onClick={() => handleThemeChange("light")}
              title="سفید شفاف (Light)"
              aria-label="تم سفید"
            />
            <button
              type="button"
              className={`${styles.themeBtn} ${styles.themeBtnDark} ${
                theme === "dark" ? styles.themeBtnSelected : ""
              }`}
              onClick={() => handleThemeChange("dark")}
              title="حالت شب (Dark)"
              aria-label="تم تیره"
            />
          </div>

          {/* Font Size Adjusters */}
          {viewMode === "text" && (
            <div className={styles.fontControls} title="تنظیم اندازه قلم">
              <button
                type="button"
                className={`${styles.fontBtn} ${fontSize === "sm" ? styles.fontBtnActive : ""}`}
                onClick={() => handleFontSizeChange("sm")}
                title="قلم کوچک"
              >
                A-
              </button>
              <button
                type="button"
                className={`${styles.fontBtn} ${fontSize === "md" ? styles.fontBtnActive : ""}`}
                onClick={() => handleFontSizeChange("md")}
                title="قلم متوسط"
              >
                A
              </button>
              <button
                type="button"
                className={`${styles.fontBtn} ${fontSize === "lg" ? styles.fontBtnActive : ""}`}
                onClick={() => handleFontSizeChange("lg")}
                title="قلم بزرگ"
              >
                A+
              </button>
              <button
                type="button"
                className={`${styles.fontBtn} ${fontSize === "xl" ? styles.fontBtnActive : ""}`}
                onClick={() => handleFontSizeChange("xl")}
                title="قلم خیلی بزرگ"
              >
                A++
              </button>
            </div>
          )}

          {/* Line Spacing Toggle */}
          {viewMode === "text" && (
            <button
              type="button"
              className={styles.iconControlBtn}
              onClick={() => setLineHeight((prev) => (prev === "normal" ? "relaxed" : "normal"))}
              title="فاصله بین سطرها"
            >
              <span>{lineHeight === "relaxed" ? "↕️ فاصله زیاد" : "↕️ فاصله عادی"}</span>
            </button>
          )}

          {/* Zen Mode Button */}
          <button
            type="button"
            className={styles.iconControlBtn}
            onClick={() => setIsZenMode(true)}
            title="حالت تمرکز و خلوت (Zen Mode)"
          >
            <span>🧘 تمرکز</span>
          </button>

          {/* Subfiles Drawer Toggle */}
          {bookMeta?.subFiles && bookMeta.subFiles.length > 0 && (
            <button
              type="button"
              className={styles.iconControlBtn}
              onClick={() => setIsDrawerOpen(true)}
              title="مشاهده و دانلود اجزای کتاب"
            >
              <span>📂 اجزای کتاب ({bookMeta.subFiles.length})</span>
            </button>
          )}
        </div>
      </header>

      {/* ---------------------------------------------------------------------
          Main Reading Canvas / Viewer
          --------------------------------------------------------------------- */}
      <main className={styles.readerMainArea}>
        <div
          className={`${styles.readerContentWrapper} ${
            viewMode === "pdf" ? styles.readerContentWrapperWide : ""
          }`}
        >
          {/* Book Hero Banner (Friendly Overview) */}
          {!isZenMode && (
            <div className={styles.bookHeroBanner}>
              <div className={styles.bookHeroIcon}>
                {bookMeta?.format === "video" ? "🎬" : bookMeta?.format === "audio" ? "🎧" : "📖"}
              </div>
              <div className={styles.bookHeroInfo}>
                <h2 className={styles.bookHeroTitleFa}>{bookContent.titleFa}</h2>
                <div className={styles.bookHeroTitleEn}>{bookContent.titleEn}</div>

                <div className={styles.bookHeroBadges}>
                  <span className={styles.heroBadge}>🏛️ {bookContent.author}</span>
                  <span className={styles.heroBadge}>🏷️ {bookContent.genre}</span>
                  <span className={styles.heroBadge}>🎯 {bookContent.level}</span>
                  {bookMeta?.fileSize && <span className={styles.heroBadge}>💾 {bookMeta.fileSize}</span>}
                </div>

                <p className={styles.bookHeroIntro}>{bookContent.introFa}</p>

                {bookContent.readingTipsFa && bookContent.readingTipsFa.length > 0 && (
                  <div className={styles.readingTipsBox}>
                    <div className={styles.readingTipsTitle}>💡 توصیه‌های مطالعه این اثر:</div>
                    <ul className={styles.readingTipsList}>
                      {bookContent.readingTipsFa.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------
              MODE 1: Rich Text e-Reader
              ----------------------------------------------------------------- */}
          {viewMode === "text" && (
            <>
              {/* Chapter Navigation Tabs */}
              {bookContent.chapters.length > 1 && (
                <nav className={styles.chapterTabsBar} aria-label="فهرست فصول">
                  {bookContent.chapters.map((ch, idx) => (
                    <button
                      key={ch.id}
                      type="button"
                      className={`${styles.chapterTabBtn} ${
                        activeChapter?.id === ch.id ? styles.chapterTabBtnActive : ""
                      }`}
                      onClick={() => handleSelectChapter(ch.id)}
                    >
                      <span>
                        فصل {idx + 1}: {ch.titleFa.replace(/^(فصل|درس|بخش|یونیت)\s+[^:]+:\s*/, "")}
                      </span>
                    </button>
                  ))}
                </nav>
              )}

              {/* Reading Card */}
              {activeChapter ? (
                <article className={styles.readingCanvas}>
                  <div className={styles.chapterHeaderBlock}>
                    <span className={styles.chapterNumberPill}>بخش {activeChapter.number}</span>
                    <h2 className={styles.chapterTitleFa}>{activeChapter.titleFa}</h2>
                    <div className={styles.chapterTitleEn}>{activeChapter.titleEn}</div>
                    {activeChapter.subtitle && (
                      <p className={styles.chapterSubtitle}>{activeChapter.subtitle}</p>
                    )}
                  </div>

                  {/* Body Paragraphs */}
                  <div
                    className={`${styles.readingBody} ${fontSizeClass} ${
                      lineHeight === "relaxed" ? styles.lineHeightRelaxed : styles.lineHeightNormal
                    }`}
                  >
                    {activeChapter.content.map((paragraph, pIdx) => (
                      <p key={pIdx} className={styles.readerParagraph}>
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Persian Notes if available */}
                  {activeChapter.notesFa && (
                    <div className={styles.persianNoteBlock}>
                      <div className={styles.persianNoteTitle}>📝 یادداشت آموزشی:</div>
                      <p className={styles.persianNoteText}>{activeChapter.notesFa}</p>
                    </div>
                  )}

                  {/* Vocabulary Cards */}
                  {activeChapter.vocabulary && activeChapter.vocabulary.length > 0 && (
                    <section className={styles.vocabSection}>
                      <h3 className={styles.vocabSectionTitle}>
                        <span>✨ واژگان و اصطلاحات کلیدی این درس:</span>
                      </h3>
                      <div className={styles.vocabGrid}>
                        {activeChapter.vocabulary.map((vocab, vIdx) => (
                          <div key={vIdx} className={styles.vocabCard}>
                            <div className={styles.vocabHeader}>
                              <span className={styles.vocabTerm}>{vocab.term}</span>
                              {vocab.phonetic && (
                                <span className={styles.vocabPhonetic}>{vocab.phonetic}</span>
                              )}
                            </div>
                            <div className={styles.vocabMeaning}>{vocab.meaningFa}</div>
                            {vocab.example && (
                              <div className={styles.vocabExample}>“{vocab.example}”</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Key Takeaways */}
                  {activeChapter.keyTakeawaysFa && activeChapter.keyTakeawaysFa.length > 0 && (
                    <div className={styles.takeawaysBox}>
                      <div className={styles.takeawaysTitle}>📌 نکات مهم این بخش:</div>
                      <ul className={styles.takeawaysList}>
                        {activeChapter.keyTakeawaysFa.map((point, kIdx) => (
                          <li key={kIdx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Chapter Previous / Next Navigation Footer */}
                  {bookContent.chapters.length > 1 && (
                    <div className={styles.chapterNavFooter}>
                      <button
                        type="button"
                        className={styles.chapterNavBtn}
                        onClick={goToPrevChapter}
                        disabled={!hasPrev}
                      >
                        <span>→ فصل قبلی</span>
                      </button>

                      <span style={{ fontSize: "0.86rem", color: "var(--reader-text-muted)" }}>
                        فصل {currentChapterIndex + 1} از {bookContent.chapters.length}
                      </span>

                      <button
                        type="button"
                        className={styles.chapterNavBtn}
                        onClick={goToNextChapter}
                        disabled={!hasNext}
                      >
                        <span>فصل بعدی ←</span>
                      </button>
                    </div>
                  )}
                </article>
              ) : null}
            </>
          )}

          {/* -----------------------------------------------------------------
              MODE 2: Original PDF Viewer
              ----------------------------------------------------------------- */}
          {viewMode === "pdf" && (
            <div className={styles.pdfViewerContainer}>
              <div className={styles.pdfTopBar}>
                <div className={styles.pdfTitleInfo}>
                  <span>📄 مشاهده مستقیم نسخه اصلی:</span>
                  <span>{bookContent.titleFa}</span>
                </div>

                <div className={styles.pdfActionBtns}>
                  {pdfViewUrl && (
                    <a
                      href={pdfViewUrl}
                      className={styles.pdfActionBtn}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="باز کردن در برگه جدید"
                    >
                      <span>↗️ در برگه جدید</span>
                    </a>
                  )}
                  {pdfViewUrl && (
                    <a
                      href={pdfViewUrl}
                      className={styles.pdfActionBtn}
                      download
                      title="دانلود فایل PDF"
                    >
                      <span>📥 دریافت مستقیم فایل</span>
                    </a>
                  )}
                </div>
              </div>

              {pdfViewUrl && pdfViewUrl.endsWith(".pdf") ? (
                <iframe
                  src={`${pdfViewUrl}#toolbar=1&navpanes=1`}
                  className={styles.pdfFrame}
                  title={`نمایشگر فایل ${bookContent.titleFa}`}
                />
              ) : (
                <div className={styles.pdfFallbackCard}>
                  <div className={styles.pdfFallbackIcon}>📦</div>
                  <h3 className={styles.pdfFallbackTitle}>پکیج چندرسانه‌ای یا آرشیو فشرده</h3>
                  <p className={styles.pdfFallbackText}>
                    این منبع به صورت پکیج کامل شامل چندین کتاب، جزوه و فایل صوتی عرضه شده است. شما
                    می‌توانید از تب «📖 متن روان» خلاصه‌ها و فصول منتخب را مطالعه نموده یا از پنل
                    اجزا، فایل‌های PDF تفکیک‌شده را به راحتی دریافت فرمایید.
                  </p>
                  {pdfViewUrl && (
                    <a href={pdfViewUrl} className={styles.pdfActionBtn} download>
                      <span>📥 دانلود پکیج کامل منبع ({bookMeta?.fileSize || "فایل اصلی"})</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ---------------------------------------------------------------------
          Companion Audio Player Bar (If audio is available)
          --------------------------------------------------------------------- */}
      {companionAudioUrl && (
        <div className={styles.audioPlayerBar} role="region" aria-label="پلیر صوتی کتاب">
          <div className={styles.audioTrackInfo}>
            <div className={styles.audioIcon}>🎧</div>
            <div style={{ minWidth: 0 }}>
              <div className={styles.audioTitle}>پخش صوت همگام این اثر</div>
              <div className={styles.audioSubtitle}>{bookContent.titleFa}</div>
            </div>
          </div>
          <audio controls src={companionAudioUrl} className={styles.audioNativePlayer} preload="none">
            مرورگر شما از پخش‌کننده صوتی پشتیبانی نمی‌کند.
          </audio>
        </div>
      )}

      {/* ---------------------------------------------------------------------
          Subfiles & Downloads Slide-Over Drawer
          --------------------------------------------------------------------- */}
      {isDrawerOpen && bookMeta?.subFiles && (
        <div className={styles.drawerBackdrop} onClick={() => setIsDrawerOpen(false)}>
          <div className={styles.drawerPanel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <div className={styles.drawerTitleBlock}>
                <h3 className={styles.drawerTitle}>📂 اجزای تفکیک‌شده کتاب</h3>
                <span className={styles.drawerSubtitle}>
                  {bookMeta.subFiles.length} بخش مجزا برای مطالعه و دانلود
                </span>
              </div>
              <button
                type="button"
                className={styles.drawerCloseBtn}
                onClick={() => setIsDrawerOpen(false)}
                aria-label="بستن پنل"
              >
                ✕
              </button>
            </div>

            <div className={styles.drawerContentList}>
              {bookMeta.subFiles.map((sub) => (
                <div key={sub.id} className={styles.drawerItemCard}>
                  <div className={styles.drawerItemInfo}>
                    <div className={styles.drawerItemIcon}>
                      {sub.format === "video" ? "🎬" : sub.format === "audio" ? "🎵" : "📄"}
                    </div>
                    <div className={styles.drawerItemText}>
                      <div className={styles.drawerItemTitleFa}>{sub.titleFa}</div>
                      <div className={styles.drawerItemMeta}>
                        <span className={styles.drawerItemSize}>{sub.fileSize}</span>
                        <span>{sub.formatLabel}</span>
                        {sub.badge && (
                          <span style={{ color: "var(--reader-accent)", fontWeight: 700 }}>
                            • {sub.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <a
                    href={sub.downloadUrl}
                    className={styles.drawerDownloadBtn}
                    download
                    onClick={() => showToast(`دریافت ${sub.titleFa} آغاز شد`)}
                  >
                    <span>📥 دانلود</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

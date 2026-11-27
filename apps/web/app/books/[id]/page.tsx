"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DOWNLOAD_ITEMS, type DownloadItem } from "../../../data/downloads";
import {
  getBookContent,
  type BookContentData,
  type BookChapter,
  type BookPage,
} from "../../../data/bookContents";
import styles from "./reader.module.css";

type ReadingTheme = "sepia" | "dark" | "light" | "sage";
type FontSize = "sm" | "md" | "lg" | "xl";
type ViewMode = "text" | "pdf";

export default function BookReaderPage() {
  const params = useParams();
  const bookId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  // 1. Find book metadata from DOWNLOAD_ITEMS
  const bookMeta: DownloadItem | undefined = useMemo(() => {
    return DOWNLOAD_ITEMS.find((item) => item.id === bookId);
  }, [bookId]);

  // 2. Initial synchronous content fallback
  const initialContent: BookContentData = useMemo(() => {
    return getBookContent(bookId);
  }, [bookId]);

  // 3. Dynamic on-demand book content with full page-by-page text
  const [dynamicContent, setDynamicContent] = useState<BookContentData | null>(null);
  const [isLoadingChapters, setIsLoadingChapters] = useState(false);

  // Active bookContent (prefers rich dynamic extracted content)
  const bookContent: BookContentData = useMemo(() => {
    return dynamicContent || initialContent;
  }, [dynamicContent, initialContent]);

  // 4. Reading Preferences State
  const [theme, setTheme] = useState<ReadingTheme>("sepia");
  const [fontSize, setFontSize] = useState<FontSize>("md");
  const [lineHeight, setLineHeight] = useState<"normal" | "relaxed">("normal");
  const [viewMode, setViewMode] = useState<ViewMode>("text");
  const [activeChapterId, setActiveChapterId] = useState<string>("");
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [isZenMode, setIsZenMode] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // 5. Interactive Word Lookup Tooltip State
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordPosition, setWordPosition] = useState<{ x: number; y: number } | null>(null);
  const [isPronouncing, setIsPronouncing] = useState(false);

  // 6. Right Chapter Sidebar & Mobile Drawer State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChapterDrawerOpen, setIsChapterDrawerOpen] = useState(false);
  const [chapterSearch, setChapterSearch] = useState("");
  const sidebarListRef = useRef<HTMLDivElement | null>(null);
  const readingCanvasRef = useRef<HTMLDivElement | null>(null);

  // Jump page input field state
  const [jumpInputValue, setJumpInputValue] = useState("");

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  }, []);

  // Restore sidebar collapsed preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem("endoora_reader_sidebar_collapsed");
      if (saved === "true") setIsSidebarCollapsed(true);
    } catch {}
  }, []);

  const toggleSidebarCollapsed = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("endoora_reader_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  // Helper to pick default chapter: always starts with Chapter 1 (ch-1)
  const getDefaultChapterId = (chapters: BookChapter[]) => {
    if (!chapters || chapters.length === 0) return "";
    const firstChapter = chapters.find((ch) => ch.id === "ch-1") || chapters.find((ch) => ch.id !== "overview");
    return firstChapter ? firstChapter.id : chapters[0].id;
  };

  // Fetch full book chapters on-demand from /book-data/${bookId}.json
  useEffect(() => {
    if (!bookId) return;

    let isMounted = true;
    setIsLoadingChapters(true);

    fetch(`/book-data/${bookId}.json`)
      .then((res) => {
        if (!res.ok) throw new Error("On-demand content not found");
        return res.json();
      })
      .then((data: BookContentData) => {
        if (!isMounted) return;
        if (data && data.chapters && data.chapters.length > 0) {
          setDynamicContent(data);

          // Restore bookmark chapter and page
          try {
            const savedChapter = localStorage.getItem(`endoora_reader_pos_${bookId}`);
            const savedPage = localStorage.getItem(`endoora_reader_page_${bookId}`);
            const pageNum = savedPage ? parseInt(savedPage, 10) : 0;

            if (savedChapter && savedChapter !== "overview" && data.chapters.some((ch) => ch.id === savedChapter)) {
              setActiveChapterId(savedChapter);
              setActivePageIndex(isNaN(pageNum) ? 0 : pageNum);
            } else {
              setActiveChapterId(getDefaultChapterId(data.chapters));
              setActivePageIndex(0);
            }
          } catch {
            setActiveChapterId(getDefaultChapterId(data.chapters));
            setActivePageIndex(0);
          }
        }
      })
      .catch((_) => {
        // Fallback gracefully remains initialContent
      })
      .finally(() => {
        if (isMounted) setIsLoadingChapters(false);
      });

    return () => {
      isMounted = false;
    };
  }, [bookId]);

  // Audio companion state
  const companionAudioUrl = useMemo(() => {
    if (bookContent.audioCompanionUrl) return bookContent.audioCompanionUrl;
    const audioSub = bookMeta?.subFiles?.find((s) => s.format === "audio");
    return audioSub?.downloadUrl || null;
  }, [bookContent, bookMeta]);

  // Load preferences from localStorage
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
    } catch {}
  }, []);

  // Filtered chapters for sidebar search
  const filteredChapters = useMemo(() => {
    if (!chapterSearch.trim()) return bookContent.chapters;
    const q = chapterSearch.trim().toLowerCase();
    return bookContent.chapters.filter((ch) => {
      return (
        ch.titleFa.toLowerCase().includes(q) ||
        ch.titleEn.toLowerCase().includes(q) ||
        (ch.subtitle && ch.subtitle.toLowerCase().includes(q)) ||
        String(ch.number).toLowerCase().includes(q)
      );
    });
  }, [bookContent.chapters, chapterSearch]);

  // Auto-scroll active chapter into view inside the sidebar list
  useEffect(() => {
    if (activeChapterId && sidebarListRef.current) {
      const activeEl = sidebarListRef.current.querySelector<HTMLElement>(
        `[data-chapter-id="${activeChapterId}"]`
      );
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [activeChapterId]);

  // Active chapter object
  const activeChapter: BookChapter | undefined = useMemo(() => {
    return (
      bookContent.chapters.find((ch) => ch.id === activeChapterId) ||
      bookContent.chapters.find((ch) => ch.id === "ch-1") ||
      bookContent.chapters.find((ch) => ch.id !== "overview") ||
      bookContent.chapters[0]
    );
  }, [bookContent, activeChapterId]);

  // Current chapter index
  const currentChapterIndex = useMemo(() => {
    return bookContent.chapters.findIndex((ch) => ch.id === activeChapter?.id);
  }, [bookContent, activeChapter]);

  // Clean Book Meta for Reader Header (Title, Author, Year)
  const headerMeta = useMemo(() => {
    const title = bookContent.titleEn || bookMeta?.titleEn || bookContent.titleFa || "";
    const author = bookContent.author || bookMeta?.authorOrPublisher || "";
    const year = bookContent.publishYear || null;
    return { title, author, year };
  }, [bookContent, bookMeta]);

  // Extract / Chunk pages for active chapter
  const chapterPages: BookPage[] = useMemo(() => {
    if (!activeChapter) return [];
    if (activeChapter.pages && activeChapter.pages.length > 0) {
      return activeChapter.pages;
    }
    // Dynamic on-the-fly chunking fallback for legacy structure (3-4 paragraphs per page)
    const paras = activeChapter.content || [];
    if (paras.length === 0) return [];
    const chunkSize = 3;
    const generated: BookPage[] = [];
    for (let i = 0; i < paras.length; i += chunkSize) {
      const localPageNum = Math.floor(i / chunkSize) + 1;
      generated.push({
        pageNumber: localPageNum,
        bookPageNumber: (activeChapter.startPage || 1) + (localPageNum - 1),
        content: paras.slice(i, i + chunkSize),
      });
    }
    return generated;
  }, [activeChapter]);

  // Clamp activePageIndex to valid range
  const safePageIndex = useMemo(() => {
    if (chapterPages.length === 0) return 0;
    return Math.max(0, Math.min(activePageIndex, chapterPages.length - 1));
  }, [activePageIndex, chapterPages.length]);

  // Active page object
  const currentPage: BookPage | undefined = useMemo(() => {
    return chapterPages[safePageIndex];
  }, [chapterPages, safePageIndex]);

  // Save bookmark helper
  const saveBookmark = useCallback((chId: string, pageIdx: number) => {
    try {
      localStorage.setItem(`endoora_reader_pos_${bookId}`, chId);
      localStorage.setItem(`endoora_reader_page_${bookId}`, String(pageIdx));
    } catch {}
  }, [bookId]);

  // Select chapter and reset/set page
  const handleSelectChapter = useCallback((chId: string, targetPageIdx: number = 0) => {
    setActiveChapterId(chId);
    setActivePageIndex(targetPageIdx);
    saveBookmark(chId, targetPageIdx);
    setSelectedWord(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [saveBookmark]);

  // Overall book reading progress calculation
  const overallProgress = useMemo(() => {
    if (!bookContent.chapters || bookContent.chapters.length === 0) return 0;
    let pagesBefore = 0;
    let totalBookPages = 0;

    for (let i = 0; i < bookContent.chapters.length; i++) {
      const ch = bookContent.chapters[i];
      const pCount = ch.pages?.length || Math.max(1, Math.ceil((ch.content?.length || 1) / 3));
      if (i < currentChapterIndex) {
        pagesBefore += pCount;
      }
      totalBookPages += pCount;
    }

    const currentTotal = pagesBefore + (safePageIndex + 1);
    if (totalBookPages === 0) return 0;
    return Math.min(100, Math.round((currentTotal / totalBookPages) * 100));
  }, [bookContent.chapters, currentChapterIndex, safePageIndex]);

  // Navigation handlers: Next Page / Previous Page
  const hasNextPage = safePageIndex < chapterPages.length - 1;
  const hasPrevPage = safePageIndex > 0;
  const hasNextChapter = currentChapterIndex >= 0 && currentChapterIndex < bookContent.chapters.length - 1;
  const hasPrevChapter = currentChapterIndex > 0;

  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      const nextIdx = safePageIndex + 1;
      setActivePageIndex(nextIdx);
      saveBookmark(activeChapterId, nextIdx);
      setSelectedWord(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (hasNextChapter) {
      const nextChapter = bookContent.chapters[currentChapterIndex + 1];
      handleSelectChapter(nextChapter.id, 0);
      showToast(`ورود به ${nextChapter.titleFa} 🚀`);
    } else {
      showToast("پایان کتاب! به شما تبریک می‌گوییم 🎉");
    }
  }, [hasNextPage, safePageIndex, saveBookmark, activeChapterId, hasNextChapter, bookContent.chapters, currentChapterIndex, handleSelectChapter, showToast]);

  const goToPrevPage = useCallback(() => {
    if (hasPrevPage) {
      const prevIdx = safePageIndex - 1;
      setActivePageIndex(prevIdx);
      saveBookmark(activeChapterId, prevIdx);
      setSelectedWord(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (hasPrevChapter) {
      const prevChapter = bookContent.chapters[currentChapterIndex - 1];
      const prevPagesCount = prevChapter.pages?.length || Math.max(1, Math.ceil((prevChapter.content?.length || 1) / 3));
      handleSelectChapter(prevChapter.id, Math.max(0, prevPagesCount - 1));
      showToast(`بازگشت به ${prevChapter.titleFa}`);
    }
  }, [hasPrevPage, safePageIndex, saveBookmark, activeChapterId, hasPrevChapter, bookContent.chapters, currentChapterIndex, handleSelectChapter, showToast]);

  // Jump directly to specific page
  const handleQuickJump = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(jumpInputValue.trim(), 10);
    if (isNaN(target) || target < 1 || target > chapterPages.length) {
      showToast(`لطفاً شماره صفحه‌ای بین ۱ تا ${chapterPages.length} وارد کنید.`);
      return;
    }
    const newIdx = target - 1;
    setActivePageIndex(newIdx);
    saveBookmark(activeChapterId, newIdx);
    setJumpInputValue("");
    showToast(`پرش به صفحه ${target} از فصل`);
  };

  // Keyboard navigation listener (Arrow keys)
  useEffect(() => {
    if (viewMode !== "text") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToNextPage();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToPrevPage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, goToNextPage, goToPrevPage]);

  // Handle word click for interactive pronunciation / lookup
  const handleWordClick = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanWord = word.replace(/[^a-zA-Z'-]/g, "").trim();
    if (!cleanWord || cleanWord.length < 2) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setSelectedWord(cleanWord);
    setWordPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  // Text-to-speech pronunciation
  const pronounceWord = (word: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      showToast("مرورگر شما از تلفظ صوتی پشتیبانی نمی‌کند.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    setIsPronouncing(true);
    utterance.onend = () => setIsPronouncing(false);
    utterance.onerror = () => setIsPronouncing(false);
    window.speechSynthesis.speak(utterance);
  };

  // Copy word or text to clipboard
  const copyWord = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      showToast(`واژه «${text}» کپی شد 📋`);
    } catch {}
  };

  // Check if active page is Persian / RTL
  const isPageRtl = useMemo(() => {
    if (!currentPage) return false;
    if (activeChapter?.id === "overview") return true;
    const sample = (currentPage.content.slice(0, 3).join(" ") || "");
    const persianChars = (sample.match(/[\u0600-\u06FF]/g) || []).length;
    return persianChars > 12;
  }, [currentPage, activeChapter]);

  // Direct download URL resolution
  const resolvedDownloadUrl = useMemo(() => {
    return bookContent.pdfUrl || bookMeta?.downloadUrl || "";
  }, [bookContent, bookMeta]);

  // Format label
  const fileFormatLabel = useMemo(() => {
    if (bookMeta?.format) return bookMeta.format.toUpperCase();
    if (resolvedDownloadUrl.endsWith(".epub")) return "EPUB";
    if (resolvedDownloadUrl.endsWith(".mobi")) return "MOBI";
    if (resolvedDownloadUrl.endsWith(".zip")) return "ZIP";
    return "PDF";
  }, [bookMeta, resolvedDownloadUrl]);

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

  return (
    <div
      className={`${styles.readerPageRoot} ${themeClass}`}
      onClick={() => setSelectedWord(null)}
    >
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
          Reading Progress Bar (Across the Top)
          --------------------------------------------------------------------- */}
      <div className={styles.readingProgressBarTrack} title={`پیشرفت مطالعه کتاب: ${overallProgress}٪`}>
        <div
          className={styles.readingProgressBarFill}
          style={{ width: `${overallProgress}%` }}
        />
      </div>

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
              <span className={styles.badgeProgress}>{overallProgress}٪ مطالعه‌شده</span>
            </div>
          </div>
        </div>

        <div className={styles.topBarControls}>
          {/* Mode Switcher: e-Reader vs Download Hub */}
          <div className={styles.modeSwitcher} role="group" aria-label="انتخاب بخش">
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
              <span>📥 نسخه اصلی {fileFormatLabel}</span>
            </button>
          </div>

          {/* Theme Selector */}
          <div className={styles.themeGroup} title="تم رنگی مطالعه">
            <button
              type="button"
              className={`${styles.themeBtn} ${styles.themeBtnSepia} ${
                theme === "sepia" ? styles.themeBtnSelected : ""
              }`}
              onClick={() => {
                setTheme("sepia");
                localStorage.setItem("endoora_reader_theme", "sepia");
              }}
              title="کاغذ کاهی (Sepia)"
              aria-label="تم کاغذ کاهی"
            />
            <button
              type="button"
              className={`${styles.themeBtn} ${styles.themeBtnSage} ${
                theme === "sage" ? styles.themeBtnSelected : ""
              }`}
              onClick={() => {
                setTheme("sage");
                localStorage.setItem("endoora_reader_theme", "sage");
              }}
              title="سبز کتابخانه‌ای (Sage)"
              aria-label="تم سبز کتابخانه‌ای"
            />
            <button
              type="button"
              className={`${styles.themeBtn} ${styles.themeBtnLight} ${
                theme === "light" ? styles.themeBtnSelected : ""
              }`}
              onClick={() => {
                setTheme("light");
                localStorage.setItem("endoora_reader_theme", "light");
              }}
              title="سفید شفاف (Light)"
              aria-label="تم سفید"
            />
            <button
              type="button"
              className={`${styles.themeBtn} ${styles.themeBtnDark} ${
                theme === "dark" ? styles.themeBtnSelected : ""
              }`}
              onClick={() => {
                setTheme("dark");
                localStorage.setItem("endoora_reader_theme", "dark");
              }}
              title="حالت شب (Dark)"
              aria-label="تم تیره"
            />
          </div>

          {/* Font Size Adjusters (Text Mode Only) */}
          {viewMode === "text" && (
            <div className={styles.fontControls} title="تنظیم اندازه قلم">
              <button
                type="button"
                className={`${styles.fontBtn} ${fontSize === "sm" ? styles.fontBtnActive : ""}`}
                onClick={() => {
                  setFontSize("sm");
                  localStorage.setItem("endoora_reader_fontsize", "sm");
                }}
                title="قلم کوچک"
              >
                A-
              </button>
              <button
                type="button"
                className={`${styles.fontBtn} ${fontSize === "md" ? styles.fontBtnActive : ""}`}
                onClick={() => {
                  setFontSize("md");
                  localStorage.setItem("endoora_reader_fontsize", "md");
                }}
                title="قلم متوسط"
              >
                A
              </button>
              <button
                type="button"
                className={`${styles.fontBtn} ${fontSize === "lg" ? styles.fontBtnActive : ""}`}
                onClick={() => {
                  setFontSize("lg");
                  localStorage.setItem("endoora_reader_fontsize", "lg");
                }}
                title="قلم بزرگ"
              >
                A+
              </button>
              <button
                type="button"
                className={`${styles.fontBtn} ${fontSize === "xl" ? styles.fontBtnActive : ""}`}
                onClick={() => {
                  setFontSize("xl");
                  localStorage.setItem("endoora_reader_fontsize", "xl");
                }}
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
              <span>{lineHeight === "relaxed" ? "↕️ فاصله باز" : "↕️ فاصله عادی"}</span>
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

          {/* Chapter Sidebar / Drawer Toggle (Text mode only) */}
          {viewMode === "text" && bookContent.chapters.length > 1 && (
            <button
              type="button"
              className={`${styles.iconControlBtn} ${styles.chapterMenuToggleBtn}`}
              onClick={() => {
                if (typeof window !== "undefined" && window.innerWidth < 1024) {
                  setIsChapterDrawerOpen((prev) => !prev);
                } else {
                  toggleSidebarCollapsed();
                }
              }}
              title="نمایش یا پنهان‌سازی فهرست فصول"
            >
              <span>📑 فهرست فصول ({bookContent.chapters.length})</span>
            </button>
          )}

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
          Main Reading Canvas / Download Hub
          --------------------------------------------------------------------- */}
      <main className={styles.readerMainArea}>
        <div
          className={`${styles.readerContentWrapper} ${
            viewMode === "pdf"
              ? styles.readerContentWrapperWide
              : isSidebarCollapsed
              ? styles.readerContentWrapperCollapsed
              : styles.readerContentWrapperWithSidebar
          }`}
        >
          {/* =================================================================
              MODE 1: Paginated e-Reader with Real PDF Pages & Interactive Tools
              ================================================================= */}
          {viewMode === "text" && (
            <div
              className={`${styles.readerLayoutTwoCol} ${
                isSidebarCollapsed ? styles.readerLayoutTwoColCollapsed : ""
              }`}
            >
              {/* 1. Right Sticky Chapters Sidebar (Desktop) */}
              {!isZenMode && bookContent.chapters.length > 1 && (
                <aside
                  className={`${styles.chapterSidebar} ${
                    isSidebarCollapsed ? styles.chapterSidebarCollapsed : ""
                  }`}
                  aria-label="فهرست فصول کتاب"
                >
                  {isSidebarCollapsed ? (
                    <button
                      type="button"
                      className={styles.sidebarExpandRailBtn}
                      onClick={toggleSidebarCollapsed}
                      title="باز کردن فهرست فصول"
                      aria-label="باز کردن فهرست فصول"
                    >
                      <span className={styles.sidebarRailIcon}>📑</span>
                      <span className={styles.sidebarRailVerticalText}>فهرست فصول</span>
                      <span className={styles.sidebarRailCountBadge}>
                        {bookContent.chapters.length}
                      </span>
                    </button>
                  ) : (
                    <div className={styles.chapterSidebarCard}>
                      {/* Sidebar Header */}
                      <div className={styles.sidebarHeader}>
                        <div className={styles.sidebarTitleBlock}>
                          <span className={styles.sidebarHeaderIcon}>📑</span>
                          <span className={styles.sidebarHeaderTitle}>فهرست فصول</span>
                          <span className={styles.sidebarChapterCountBadge}>
                            {bookContent.chapters.length}
                          </span>
                        </div>

                        <button
                          type="button"
                          className={styles.sidebarCollapseBtn}
                          onClick={toggleSidebarCollapsed}
                          title="جمع کردن سایدبار فصول"
                          aria-label="جمع کردن سایدبار"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Sleek Minimal 3-Line Page Controller */}
                      {currentPage && chapterPages.length > 0 && (
                        <div className={styles.sidebarPageController}>
                          {/* Line 1: Page Number & Physical Book Page */}
                          <div className={styles.sidebarPageMetaRow}>
                            <span className={styles.sidebarPageNumberText}>
                              صفحه {currentPage.pageNumber} از {chapterPages.length}
                            </span>
                            {currentPage.bookPageNumber && (
                              <span className={styles.sidebarBookPageBadge}>
                                ص {currentPage.bookPageNumber} کتاب
                              </span>
                            )}
                          </div>

                          {/* Line 2: Thin Elegant Slider */}
                          {chapterPages.length > 1 && (
                            <div className={styles.sidebarSliderWrapper}>
                              <input
                                type="range"
                                min={1}
                                max={chapterPages.length}
                                value={safePageIndex + 1}
                                onChange={(e) => {
                                  const newPageIdx = parseInt(e.target.value, 10) - 1;
                                  setActivePageIndex(newPageIdx);
                                  saveBookmark(activeChapterId, newPageIdx);
                                }}
                                className={styles.sidebarMinimalSlider}
                                title="ورق زدن سریع صفحات این فصل"
                              />
                            </div>
                          )}

                          {/* Line 3: Compact Jump Form */}
                          {chapterPages.length > 1 && (
                            <form onSubmit={handleQuickJump} className={styles.sidebarQuickJumpForm}>
                              <input
                                type="number"
                                min={1}
                                max={chapterPages.length}
                                placeholder="پرش به صفحه..."
                                value={jumpInputValue}
                                onChange={(e) => setJumpInputValue(e.target.value)}
                                className={styles.sidebarJumpInput}
                              />
                              <button type="submit" className={styles.sidebarJumpBtn}>
                                برو
                              </button>
                            </form>
                          )}
                        </div>
                      )}

                      {/* Chapter Search / Filter */}
                      <div className={styles.sidebarSearchWrapper}>
                        <span className={styles.sidebarSearchIcon}>🔍</span>
                        <input
                          type="text"
                          className={styles.sidebarSearchInput}
                          placeholder="جستجوی سریع در فصول..."
                          value={chapterSearch}
                          onChange={(e) => setChapterSearch(e.target.value)}
                        />
                        {chapterSearch && (
                          <button
                            type="button"
                            className={styles.sidebarSearchClearBtn}
                            onClick={() => setChapterSearch("")}
                            title="پاک کردن جستجو"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {/* Loading Chapters State */}
                      {isLoadingChapters && (
                        <div className={styles.sidebarLoadingState}>
                          <span className={styles.loadingChaptersBadge}>
                            در حال بارگذاری فصول کامل...
                          </span>
                        </div>
                      )}

                      {/* Scrollable Chapter Items List */}
                      <div className={styles.sidebarListScrollable} ref={sidebarListRef}>
                        {filteredChapters.map((ch, idx) => {
                          const isActive = activeChapter?.id === ch.id;
                          const isOverview = ch.id === "overview";
                          const chPageCount = ch.pages?.length || 1;

                          return (
                            <button
                              key={ch.id}
                              data-chapter-id={ch.id}
                              type="button"
                              className={`${styles.sidebarChapterItem} ${
                                isActive ? styles.sidebarChapterItemActive : ""
                              }`}
                              onClick={() => handleSelectChapter(ch.id, 0)}
                              title={ch.titleEn || ch.titleFa}
                            >
                              <div className={styles.sidebarItemHeader}>
                                <span
                                  className={`${styles.sidebarChapterBadge} ${
                                    isOverview ? styles.sidebarChapterBadgeOverview : ""
                                  }`}
                                >
                                  {isOverview
                                    ? "📖 راهنما"
                                    : typeof ch.number === "number"
                                    ? `فصل ${ch.number}`
                                    : ch.number || `بخش ${idx}`}
                                </span>
                                <span className={styles.sidebarPageCountBadge}>
                                  {chPageCount} ص
                                </span>
                                {isActive && (
                                  <span className={styles.sidebarActivePill}>
                                    در حال خواندن
                                  </span>
                                )}
                              </div>

                              <div className={styles.sidebarItemTitleFa}>{ch.titleFa}</div>

                              {(ch.titleEn || ch.subtitle) && (
                                <div className={styles.sidebarItemTitleEn} dir="ltr">
                                  {ch.titleEn || ch.subtitle}
                                </div>
                              )}
                            </button>
                          );
                        })}

                        {filteredChapters.length === 0 && (
                          <div className={styles.sidebarEmptyNotice}>
                            <span>نتیجه‌ای برای «{chapterSearch}» یافت نشد.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </aside>
              )}

              {/* 2. Main Reading Column */}
              <div className={styles.readingMainColumn}>
                {/* Mobile Chapter Floating Trigger Bar */}
                {!isZenMode && bookContent.chapters.length > 1 && (
                  <div className={styles.mobileChapterBar}>
                    <button
                      type="button"
                      className={styles.mobileChapterTriggerBtn}
                      onClick={() => setIsChapterDrawerOpen(true)}
                    >
                      <div className={styles.mobileChapterTriggerInfo}>
                        <span className={styles.mobileChapterTriggerIcon}>📑</span>
                        <span className={styles.mobileChapterTriggerTitle}>
                          {activeChapter ? activeChapter.titleFa : "انتخاب فصل"}
                        </span>
                      </div>
                      <span className={styles.mobileChapterTriggerBadge}>
                        فصل {currentChapterIndex + 1} از {bookContent.chapters.length} ▾
                      </span>
                    </button>
                  </div>
                )}

                {/* Book Hero Banner */}
                {!isZenMode && activeChapter?.id === "overview" && (
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
                        {bookContent.totalPages && (
                          <span className={styles.heroBadge}>📑 {bookContent.totalPages} صفحه</span>
                        )}
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

                {/* Paginated Reading Canvas */}
                {activeChapter && currentPage ? (
                  <article className={styles.readingCanvas} ref={readingCanvasRef}>
                    {/* Chapter & Page Meta Header */}
                    <div className={styles.chapterHeaderBlock}>
                      <div className={styles.chapterHeaderTopRow}>
                        <span className={styles.chapterNumberPill}>
                          {activeChapter.id === "overview"
                            ? "راهنمای مطالعه"
                            : typeof activeChapter.number === "number"
                            ? `فصل ${activeChapter.number}`
                            : activeChapter.number}
                        </span>

                        {/* Middle Header: Book Title (Line 1) & Author + Publish Year (Line 2) */}
                        <div className={styles.bookHeaderMetaCenter}>
                          <div className={styles.bookHeaderMetaTitle} title={headerMeta.title}>
                            {headerMeta.title}
                          </div>
                          <div className={styles.bookHeaderMetaSub}>
                            <span className={styles.bookHeaderMetaAuthor}>{headerMeta.author}</span>
                            {headerMeta.year && (
                              <>
                                <span className={styles.bookHeaderMetaDot}>•</span>
                                <span className={styles.bookHeaderMetaYear}>{headerMeta.year}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className={styles.pageTrackerPill}>
                          <span>صفحه {currentPage.pageNumber} از {chapterPages.length}</span>
                          {currentPage.bookPageNumber && (
                            <span className={styles.physicalPageBadge}>
                              (ص {currentPage.bookPageNumber} کتاب)
                            </span>
                          )}
                        </div>
                      </div>

                      <h2 className={styles.chapterTitleFa}>{activeChapter.titleFa}</h2>
                      <div className={styles.chapterTitleEn}>{activeChapter.titleEn}</div>
                      {activeChapter.subtitle && (
                        <p className={styles.chapterSubtitle}>{activeChapter.subtitle}</p>
                      )}
                    </div>

                    {/* Page Paragraphs Body with Interactive Word Lookup */}
                    <div
                      className={`${styles.readingBody} ${isPageRtl ? styles.readingBodyRtl : ""} ${fontSizeClass} ${
                        lineHeight === "relaxed" ? styles.lineHeightRelaxed : styles.lineHeightNormal
                      }`}
                      dir={isPageRtl ? "rtl" : "ltr"}
                    >
                      {currentPage.content.map((paragraph, pIdx) => {
                        const isParaRtl =
                          isPageRtl || (paragraph.match(/[\u0600-\u06FF]/g) || []).length > 8;

                        // Tokenize English paragraphs to allow clickable word definitions
                        if (!isParaRtl) {
                          const words = paragraph.split(" ");
                          return (
                            <p key={pIdx} className={styles.readerParagraph} dir="ltr">
                              {words.map((w, wIdx) => {
                                const clean = w.replace(/[^a-zA-Z'-]/g, "");
                                const isClickable = clean.length > 2;
                                return (
                                  <React.Fragment key={wIdx}>
                                    {isClickable ? (
                                      <span
                                        className={styles.clickableWord}
                                        onClick={(e) => handleWordClick(clean, e)}
                                        title={`کلیک برای تلفظ و معنی «${clean}»`}
                                      >
                                        {w}
                                      </span>
                                    ) : (
                                      w
                                    )}
                                    {" "}
                                  </React.Fragment>
                                );
                              })}
                            </p>
                          );
                        }

                        return (
                          <p
                            key={pIdx}
                            className={`${styles.readerParagraph} ${styles.readerParagraphRtl}`}
                            dir="rtl"
                          >
                            {paragraph}
                          </p>
                        );
                      })}
                    </div>

                    {/* Word Pronunciation / Lookup Mini Popover */}
                    {selectedWord && wordPosition && (
                      <div
                        className={styles.wordPopover}
                        style={{
                          left: `${wordPosition.x}px`,
                          top: `${wordPosition.y}px`,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className={styles.wordPopoverHeader}>
                          <span className={styles.popoverWordText}>{selectedWord}</span>
                          <button
                            type="button"
                            className={styles.popoverCloseBtn}
                            onClick={() => setSelectedWord(null)}
                          >
                            ✕
                          </button>
                        </div>
                        <div className={styles.wordPopoverActions}>
                          <button
                            type="button"
                            className={`${styles.popoverActionBtn} ${
                              isPronouncing ? styles.popoverActionBtnActive : ""
                            }`}
                            onClick={() => pronounceWord(selectedWord)}
                            title="پخش تلفظ انگلیسی"
                          >
                            <span>🔊 تلفظ</span>
                          </button>
                          <button
                            type="button"
                            className={styles.popoverActionBtn}
                            onClick={() => copyWord(selectedWord)}
                            title="کپی واژه"
                          >
                            <span>📋 کپی</span>
                          </button>
                          <a
                            href={`https://translate.google.com/?sl=en&tl=fa&text=${encodeURIComponent(
                              selectedWord
                            )}&op=translate`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.popoverActionBtn}
                            title="ترجمه در گوگل ترنسلیت"
                          >
                            <span>🌐 ترجمه</span>
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Persian Notes if available */}
                    {activeChapter.notesFa && safePageIndex === 0 && (
                      <div className={styles.persianNoteBlock}>
                        <div className={styles.persianNoteTitle}>📝 یادداشت آموزشی:</div>
                        <p className={styles.persianNoteText}>{activeChapter.notesFa}</p>
                      </div>
                    )}

                    {/* Vocabulary Cards (Shown on page 1 of chapter) */}
                    {activeChapter.vocabulary && activeChapter.vocabulary.length > 0 && safePageIndex === 0 && (
                      <section className={styles.vocabSection}>
                        <h3 className={styles.vocabSectionTitle}>
                          <span>✨ واژگان و اصطلاحات کلیدی این بخش:</span>
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
                    {activeChapter.keyTakeawaysFa && activeChapter.keyTakeawaysFa.length > 0 && safePageIndex === chapterPages.length - 1 && (
                      <div className={styles.takeawaysBox}>
                        <div className={styles.takeawaysTitle}>📌 نکات مهم این بخش:</div>
                        <ul className={styles.takeawaysList}>
                          {activeChapter.keyTakeawaysFa.map((point, kIdx) => (
                            <li key={kIdx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* -----------------------------------------------------------------
                        Sticky / Bottom Pagination Controls Bar
                        ----------------------------------------------------------------- */}
                    <div className={styles.pageNavigatorBottom}>
                      {/* Previous Page Button */}
                      <button
                        type="button"
                        className={styles.pageNavBtn}
                        onClick={goToPrevPage}
                        disabled={!hasPrevPage && !hasPrevChapter}
                        title="ورق زدن به صفحه قبل (کلید جهت‌نما راست)"
                      >
                        <span>→ صفحه قبل</span>
                      </button>

                      {/* Clean Minimal Center Indicator */}
                      <div className={styles.bottomPageIndicator}>
                        <span>صفحه {currentPage.pageNumber} از {chapterPages.length}</span>
                        {currentPage.bookPageNumber && (
                          <span className={styles.bottomPageIndicatorSub}>
                            (ص {currentPage.bookPageNumber} کتاب)
                          </span>
                        )}
                      </div>

                      {/* Next Page Button */}
                      <button
                        type="button"
                        className={`${styles.pageNavBtn} ${styles.pageNavBtnPrimary}`}
                        onClick={goToNextPage}
                        title="ورق زدن به صفحه بعد (کلید جهت‌نما چپ)"
                      >
                        <span>
                          {hasNextPage
                            ? "صفحه بعد ←"
                            : hasNextChapter
                            ? "ورود به فصل بعد 🚀"
                            : "پایان اثر ✓"}
                        </span>
                      </button>
                    </div>

                    {/* Keyboard navigation hint */}
                    <div className={styles.keyboardHintText}>
                      <span>💡 راهنما: می‌توانید با کلیدهای جهت‌نمای کیبورد (← و →) سریعاً صفحات را ورق بزنید.</span>
                    </div>
                  </article>
                ) : (
                  <div className={styles.readerEmptyState}>
                    <div className={styles.readerEmptyIcon}>📖</div>
                    <h3>محتوایی برای این بخش بارگذاری نشد</h3>
                    <p>لطفاً فصل دیگری را از فهرست سمت راست انتخاب کنید.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =================================================================
              MODE 2: Dedicated High-Speed Download Hub (نسخه اصلی فایل)
              ================================================================= */}
          {viewMode === "pdf" && (
            <div className={styles.downloadHubContainer}>
              {/* Hero Download Card */}
              <div className={styles.downloadHeroCard}>
                <div className={styles.downloadHeroHeader}>
                  <div className={styles.downloadHeroThumb}>
                    <span className={styles.downloadThumbIcon}>
                      {bookMeta?.format === "video" ? "🎬" : bookMeta?.format === "audio" ? "🎧" : "📄"}
                    </span>
                    <span className={styles.downloadFormatBadge}>{fileFormatLabel}</span>
                  </div>

                  <div className={styles.downloadHeroContent}>
                    <div className={styles.downloadBadgesRow}>
                      <span className={styles.hubBadgeLevel}>
                        {bookMeta?.cefrLevel === "Grade 12" ? "دوازدهم نهایی" : bookMeta?.cefrLevel || "استاندارد"}
                      </span>
                      <span className={styles.hubBadgeCategory}>
                        {bookMeta?.categoryLabelFa || "مرجع آموزشی"}
                      </span>
                      {bookMeta?.isPopular && <span className={styles.hubBadgeHot}>⭐ پرطرفدار</span>}
                      {bookMeta?.isNew && <span className={styles.hubBadgeNew}>✨ نسخه جدید</span>}
                    </div>

                    <h2 className={styles.downloadHeroTitleFa}>{bookContent.titleFa}</h2>
                    <div className={styles.downloadHeroTitleEn}>{bookContent.titleEn}</div>
                    <p className={styles.downloadHeroIntro}>{bookContent.introFa}</p>
                  </div>
                </div>

                {/* Technical Specs Grid */}
                <div className={styles.downloadSpecsGrid}>
                  <div className={styles.downloadSpecItem}>
                    <span className={styles.specLabel}>💾 حجم فایل اصلی:</span>
                    <span className={styles.specValue}>{bookMeta?.fileSize || "نسخه کامل"}</span>
                  </div>
                  <div className={styles.downloadSpecItem}>
                    <span className={styles.specLabel}>📑 فرمت انتشار:</span>
                    <span className={styles.specValue}>{fileFormatLabel} باکیفیت اصلی</span>
                  </div>
                  <div className={styles.downloadSpecItem}>
                    <span className={styles.specLabel}>🏛️ مؤلف / ناشر:</span>
                    <span className={styles.specValue}>{bookContent.author}</span>
                  </div>
                  <div className={styles.downloadSpecItem}>
                    <span className={styles.specLabel}>⚡ سرور دانلود:</span>
                    <span className={styles.specValue}>CDN پرسرعت نیم‌بها اندورا</span>
                  </div>
                  <div className={styles.downloadSpecItem}>
                    <span className={styles.specLabel}>📥 دفعات دریافت:</span>
                    <span className={styles.specValue}>
                      {(bookMeta?.downloadCount || 1240).toLocaleString("fa-IR")} بار
                    </span>
                  </div>
                  <div className={styles.downloadSpecItem}>
                    <span className={styles.specLabel}>🔒 سلامت فایل:</span>
                    <span className={styles.specValue} style={{ color: "var(--reader-accent)" }}>
                      ✓ تاییدشده و بدون تبلیغات
                    </span>
                  </div>
                </div>

                {/* Main Download Call-to-Action Bar */}
                <div className={styles.downloadActionBar}>
                  {resolvedDownloadUrl ? (
                    <a
                      href={resolvedDownloadUrl}
                      className={styles.downloadPrimaryCta}
                      download
                      onClick={() => showToast(`دریافت نسخه اصلی «${bookContent.titleFa}» آغاز شد 📥`)}
                    >
                      <span className={styles.dlBtnIcon}>📥</span>
                      <div className={styles.dlBtnTexts}>
                        <span className={styles.dlBtnTitle}>دانلود مستقیم فایل اصلی ({fileFormatLabel})</span>
                        <span className={styles.dlBtnSubtitle}>
                          حجم: {bookMeta?.fileSize || "کامل"} • بدون محدودیت سرعت
                        </span>
                      </div>
                    </a>
                  ) : (
                    <div className={styles.downloadUnavailableNotice}>
                      <span>فایل مستقیم برای این کتاب در حال آماده‌سازی است.</span>
                    </div>
                  )}

                  <div className={styles.downloadSecondaryButtons}>
                    {resolvedDownloadUrl && (
                      <button
                        type="button"
                        className={styles.downloadSecBtn}
                        onClick={() => {
                          try {
                            const fullUrl = resolvedDownloadUrl.startsWith("http")
                              ? resolvedDownloadUrl
                              : `${window.location.origin}${resolvedDownloadUrl}`;
                            navigator.clipboard.writeText(fullUrl);
                            showToast("لینک دانلود مستقیم به کلیپ‌بورد کپی شد 📋");
                          } catch {}
                        }}
                        title="کپی لینک مستقیم دانلود"
                      >
                        <span>🔗 کپی لینک مستقیم</span>
                      </button>
                    )}

                    {bookMeta?.mirrorUrl && (
                      <a
                        href={bookMeta.mirrorUrl}
                        className={styles.downloadSecBtn}
                        download
                        title="دانلود از سرور کمکی / میرور"
                      >
                        <span>🌐 سرور دانلود کمکی</span>
                      </a>
                    )}

                    <button
                      type="button"
                      className={styles.downloadSecBtn}
                      onClick={() => setViewMode("text")}
                      title="بازگشت به مطالعه آنلاین متن روان"
                    >
                      <span>📖 بازگشت به متن روان</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Subfiles & Package Attachments Section */}
              {bookMeta?.subFiles && bookMeta.subFiles.length > 0 && (
                <section className={styles.attachmentsSection}>
                  <div className={styles.sectionHeadingBlock}>
                    <div className={styles.sectionHeadingIcon}>📂</div>
                    <div>
                      <h3 className={styles.sectionHeadingTitle}>اجزا و فایل‌های تکمیلی این دوره</h3>
                      <p className={styles.sectionHeadingSubtitle}>
                        می‌توانید هر بخش از جمله فایل‌های صوتی، کتاب کار و پاسخ‌نامه‌ها را به طور جداگانه دانلود کنید:
                      </p>
                    </div>
                  </div>

                  <div className={styles.attachmentsGrid}>
                    {bookMeta.subFiles.map((sub) => (
                      <div key={sub.id} className={styles.attachmentCard}>
                        <div className={styles.attachmentCardHeader}>
                          <span className={styles.attachmentIcon}>
                            {sub.format === "video" ? "🎬" : sub.format === "audio" ? "🎵" : "📄"}
                          </span>
                          <span className={styles.attachmentFormatBadge}>{sub.formatLabel}</span>
                          {sub.badge && (
                            <span className={styles.attachmentCustomBadge}>{sub.badge}</span>
                          )}
                        </div>

                        <h4 className={styles.attachmentTitleFa}>{sub.titleFa}</h4>
                        <div className={styles.attachmentTitleEn}>{sub.titleEn}</div>

                        <div className={styles.attachmentMetaRow}>
                          <span>💾 حجم: {sub.fileSize}</span>
                        </div>

                        <a
                          href={sub.downloadUrl}
                          className={styles.attachmentDownloadBtn}
                          download
                          onClick={() => showToast(`دریافت ${sub.titleFa} آغاز شد 📥`)}
                        >
                          <span>📥 دریافت فایل ({sub.formatLabel})</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Device Reading Guide (راهنمای استفاده در کامپیوتر، موبایل و تبلت) */}
              <section className={styles.deviceGuideSection}>
                <h3 className={styles.guideSectionTitle}>📱 راهنمای مطالعه فایل در دستگاه‌های مختلف</h3>
                <div className={styles.guideCardsGrid}>
                  <div className={styles.guideCard}>
                    <div className={styles.guideCardIcon}>💻</div>
                    <h4 className={styles.guideCardTitle}>ویندوز و مک (PC / Mac)</h4>
                    <p className={styles.guideCardDesc}>
                      فایل‌های PDF را می‌توانید در مرورگر کروم، اج، یا نرم‌افزارهای کم‌حجم مانند <strong>SumatraPDF</strong> و <strong>Adobe Acrobat</strong> باز کنید. برای فرمت EPUB، نرم‌افزار رایگان <strong>Calibre</strong> پیشنهاد می‌شود.
                    </p>
                  </div>

                  <div className={styles.guideCard}>
                    <div className={styles.guideCardIcon}>📱</div>
                    <h4 className={styles.guideCardTitle}>اندروید (Android)</h4>
                    <p className={styles.guideCardDesc}>
                      اپلیکیشن‌های <strong>ReadEra</strong> و <strong>Moon+ Reader</strong> از بهترین برنامه‌های رایگان جهت خواندن همزمان فرمت‌های PDF و EPUB با پشتیبانی از حالت شب و یادداشت‌برداری هستند.
                    </p>
                  </div>

                  <div className={styles.guideCard}>
                    <div className={styles.guideCardIcon}>🍏</div>
                    <h4 className={styles.guideCardTitle}>آیفون و آیپد (iOS)</h4>
                    <p className={styles.guideCardDesc}>
                      به راحتی با برنامه پیش‌فرض <strong>Apple Books</strong> یا نرم‌افزار محبوب <strong>Documents by Readdle</strong> فایل‌ها را باز کرده و با هایلایت و یادداشت شخصی مطالعه فرمایید.
                    </p>
                  </div>

                  <div className={styles.guideCard}>
                    <div className={styles.guideCardIcon}>📖</div>
                    <h4 className={styles.guideCardTitle}>کتابخوان‌ها (Kindle)</h4>
                    <p className={styles.guideCardDesc}>
                      برای ارسال به کتابخوان کیندل، می‌توانید فایل را مستقیماً از طریق سرویس <strong>Send to Kindle</strong> یا تبدیل خودکار در Calibre به دستگاه خود بفرستید.
                    </p>
                  </div>
                </div>
              </section>
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
          Subfiles Slide-Over Drawer
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

      {/* ---------------------------------------------------------------------
          Mobile Chapters Slide-Over Drawer
          --------------------------------------------------------------------- */}
      {isChapterDrawerOpen && (
        <div
          className={styles.drawerBackdrop}
          onClick={() => setIsChapterDrawerOpen(false)}
        >
          <div
            className={`${styles.drawerPanel} ${styles.chapterDrawerPanel}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.drawerHeader}>
              <div className={styles.drawerTitleBlock}>
                <h3 className={styles.drawerTitle}>📑 فهرست فصول کتاب</h3>
                <span className={styles.drawerSubtitle}>
                  {bookContent.chapters.length} فصل کامل • انتخاب و مطالعه روان
                </span>
              </div>
              <button
                type="button"
                className={styles.drawerCloseBtn}
                onClick={() => setIsChapterDrawerOpen(false)}
                aria-label="بستن منوی فصول"
              >
                ✕
              </button>
            </div>

            {/* Mobile Drawer Minimal Page Controller */}
            {currentPage && chapterPages.length > 0 && (
              <div className={styles.sidebarPageController}>
                <div className={styles.sidebarPageMetaRow}>
                  <span className={styles.sidebarPageNumberText}>
                    صفحه {currentPage.pageNumber} از {chapterPages.length}
                  </span>
                  {currentPage.bookPageNumber && (
                    <span className={styles.sidebarBookPageBadge}>
                      ص {currentPage.bookPageNumber} کتاب
                    </span>
                  )}
                </div>

                {chapterPages.length > 1 && (
                  <div className={styles.sidebarSliderWrapper}>
                    <input
                      type="range"
                      min={1}
                      max={chapterPages.length}
                      value={safePageIndex + 1}
                      onChange={(e) => {
                        const newPageIdx = parseInt(e.target.value, 10) - 1;
                        setActivePageIndex(newPageIdx);
                        saveBookmark(activeChapterId, newPageIdx);
                      }}
                      className={styles.sidebarMinimalSlider}
                      title="ورق زدن سریع صفحات این فصل"
                    />
                  </div>
                )}

                {chapterPages.length > 1 && (
                  <form onSubmit={handleQuickJump} className={styles.sidebarQuickJumpForm}>
                    <input
                      type="number"
                      min={1}
                      max={chapterPages.length}
                      placeholder="پرش به صفحه..."
                      value={jumpInputValue}
                      onChange={(e) => setJumpInputValue(e.target.value)}
                      className={styles.sidebarJumpInput}
                    />
                    <button type="submit" className={styles.sidebarJumpBtn}>
                      برو
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Chapter Search / Filter inside Mobile Drawer */}
            <div className={styles.drawerSearchWrapper}>
              <span className={styles.sidebarSearchIcon}>🔍</span>
              <input
                type="text"
                className={styles.sidebarSearchInput}
                placeholder="جستجوی سریع فصل..."
                value={chapterSearch}
                onChange={(e) => setChapterSearch(e.target.value)}
              />
              {chapterSearch && (
                <button
                  type="button"
                  className={styles.sidebarSearchClearBtn}
                  onClick={() => setChapterSearch("")}
                  title="پاک کردن جستجو"
                >
                  ✕
                </button>
              )}
            </div>

            <div className={styles.drawerContentList}>
              {filteredChapters.map((ch, idx) => {
                const isActive = activeChapter?.id === ch.id;
                const isOverview = ch.id === "overview";
                return (
                  <button
                    key={ch.id}
                    type="button"
                    className={`${styles.sidebarChapterItem} ${
                      isActive ? styles.sidebarChapterItemActive : ""
                    }`}
                    onClick={() => {
                      handleSelectChapter(ch.id, 0);
                      setIsChapterDrawerOpen(false);
                    }}
                  >
                    <div className={styles.sidebarItemHeader}>
                      <span
                        className={`${styles.sidebarChapterBadge} ${
                          isOverview ? styles.sidebarChapterBadgeOverview : ""
                        }`}
                      >
                        {isOverview
                          ? "📖 راهنما"
                          : typeof ch.number === "number"
                          ? `فصل ${ch.number}`
                          : ch.number || `بخش ${idx}`}
                      </span>
                      {isActive && (
                        <span className={styles.sidebarActivePill}>
                          در حال خواندن
                        </span>
                      )}
                    </div>

                    <div className={styles.sidebarItemTitleFa}>{ch.titleFa}</div>

                    {(ch.titleEn || ch.subtitle) && (
                      <div className={styles.sidebarItemTitleEn} dir="ltr">
                        {ch.titleEn || ch.subtitle}
                      </div>
                    )}
                  </button>
                );
              })}

              {filteredChapters.length === 0 && (
                <div className={styles.sidebarEmptyNotice}>
                  <span>نتیجه‌ای برای «{chapterSearch}» یافت نشد.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------
          Toast Notification Floating Pill
          --------------------------------------------------------------------- */}
      {toastMsg && (
        <div className={styles.floatingToast} role="alert">
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}

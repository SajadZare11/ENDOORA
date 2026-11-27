"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./downloads.module.css";
import {
  DOWNLOAD_CATEGORIES,
  DOWNLOAD_ITEMS,
  type DownloadItem,
  type DownloadCategory,
  type CEFRLevel,
  type FileFormat,
} from "../../data/downloads";

export default function DownloadsPage() {
  if (!DOWNLOAD_ITEMS.length) {
    return (
      <main dir="rtl" className={styles.emptyState}>
        <div className={styles.emptyIcon}>📚</div>
        <h1 className={styles.emptyTitle}>کتابخانه اندورا</h1>
        <p className={styles.emptySubtitle}>در حال حاضر منبعی برای دانلود در دسترس نیست.</p>
        <Link href="/courses" className={styles.actionBtnPrimary}>
          مشاهده دوره‌های آموزشی
        </Link>
      </main>
    );
  }
  return <Catalogue />;
}

function Catalogue() {
  // Navigation & Filter State
  const [selectedCategory, setSelectedCategory] = useState<DownloadCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [searchLimit, setSearchLimit] = useState(36);
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "title">("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Personal Bookshelf States
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);
  const [onlyRead, setOnlyRead] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [readBooks, setReadBooks] = useState<string[]>([]);

  // Layout & UI State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [openCategoryAccordion, setOpenCategoryAccordion] = useState<string | null>("coursebooks");
  const [expandedCardIds, setExpandedCardIds] = useState<Set<string>>(new Set());

  // Modals & Feedback
  const [previewItem, setPreviewItem] = useState<DownloadItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    title: "",
    author: "",
    category: "coursebooks",
    notes: "",
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize Client State from localStorage
  useEffect(() => {
    try {
      const storedBookmarks = localStorage.getItem("endoora_bookmarked_downloads");
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks));
      }
      const storedRead = localStorage.getItem("endoora_read_books");
      if (storedRead) {
        setReadBooks(JSON.parse(storedRead));
      }
      const storedViewMode = localStorage.getItem("endoora_books_view_mode");
      if (storedViewMode === "grid" || storedViewMode === "list") {
        setViewMode(storedViewMode);
      }
    } catch (_) {}
  }, []);

  // Keyboard shortcut listener: Ctrl+K or '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key.toLowerCase() === "k") || (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA")) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3600);
  };

  // Toggle Bookmark (⭐)
  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    let updated: string[];
    if (bookmarks.includes(id)) {
      updated = bookmarks.filter((b) => b !== id);
      showToast("منبع از نشان‌شده‌ها حذف شد ❌");
    } else {
      updated = [...bookmarks, id];
      showToast("منبع به نشان‌شده‌های شما افزوده شد ⭐");
    }
    setBookmarks(updated);
    try {
      localStorage.setItem("endoora_bookmarked_downloads", JSON.stringify(updated));
    } catch (_) {}
  };

  // Toggle Read Status (✅)
  const toggleRead = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    let updated: string[];
    if (readBooks.includes(id)) {
      updated = readBooks.filter((r) => r !== id);
      showToast("کتاب از فهرست خوانده‌شده‌ها خارج شد");
    } else {
      updated = [...readBooks, id];
      showToast("کتاب به فهرست خوانده‌شده‌ها افزوده شد ✅");
    }
    setReadBooks(updated);
    try {
      localStorage.setItem("endoora_read_books", JSON.stringify(updated));
    } catch (_) {}
  };

  const copyDirectLink = (item: DownloadItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const fullUrl = item.downloadUrl.startsWith("http")
        ? item.downloadUrl
        : `${window.location.origin}${item.downloadUrl}`;
      navigator.clipboard.writeText(fullUrl);
      showToast("لینک دانلود مستقیم به کلیپ‌بورد کپی شد 📋");
    } catch (_) {
      showToast("خطا در کپی کردن لینک");
    }
  };

  const handleDownloadTrigger = (title: string) => {
    showToast(`دریافت «${title.slice(0, 32)}...» آغاز شد 📥`);
  };

  const toggleSubFiles = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setExpandedCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const changeViewMode = (mode: "grid" | "list") => {
    setViewMode(mode);
    try {
      localStorage.setItem("endoora_books_view_mode", mode);
    } catch (_) {}
  };

  // Submit Book Request Form
  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestForm.title.trim()) {
      showToast("لطفاً نام یا عنوان کتاب را وارد کنید.");
      return;
    }
    try {
      const prevRequests = JSON.parse(localStorage.getItem("endoora_book_requests") || "[]");
      const newRequest = {
        ...requestForm,
        id: `req-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("endoora_book_requests", JSON.stringify([...prevRequests, newRequest]));
    } catch (_) {}

    showToast(`درخواست کتاب «${requestForm.title}» با موفقیت ثبت شد! 🎉`);
    setRequestForm({ title: "", author: "", category: "coursebooks", notes: "" });
    setIsRequestModalOpen(false);
  };

  // Reset all active filters
  const resetAllFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSelectedLevel("all");
    setSelectedFormat("all");
    setSelectedGenre("all");
    setSelectedTag("all");
    setOnlyBookmarks(false);
    setOnlyRead(false);
    setSortBy("popular");
    setSearchLimit(36);
  };

  // Category items mapping for sidebar counts and contextual tags
  const categoryData = useMemo(() => {
    const map: Record<
      string,
      {
        count: number;
        levels: Set<string>;
        formats: Set<string>;
        genres: Set<string>;
        topTags: string[];
      }
    > = {
      coursebooks: { count: 0, levels: new Set(), formats: new Set(), genres: new Set(), topTags: [] },
      novels: { count: 0, levels: new Set(), formats: new Set(), genres: new Set(), topTags: [] },
      final_exams: { count: 0, levels: new Set(), formats: new Set(), genres: new Set(), topTags: [] },
      skills_grammar: { count: 0, levels: new Set(), formats: new Set(), genres: new Set(), topTags: [] },
      videos: { count: 0, levels: new Set(), formats: new Set(), genres: new Set(), topTags: [] },
    };

    DOWNLOAD_ITEMS.forEach((item) => {
      if (map[item.category]) {
        map[item.category].count += 1;
        if (item.cefrLevel) map[item.category].levels.add(item.cefrLevel);
        if (item.format) map[item.category].formats.add(item.format);
        if (item.genre) map[item.category].genres.add(item.genre);
      }
    });

    return map;
  }, []);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return DOWNLOAD_ITEMS.filter((item) => {
      // Category filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      // CEFR Level filter
      if (selectedLevel !== "all" && item.cefrLevel !== selectedLevel) {
        return false;
      }
      // Format filter
      if (selectedFormat !== "all" && item.format !== selectedFormat) {
        return false;
      }
      // Genre filter
      if (selectedGenre !== "all" && item.genre !== selectedGenre) {
        return false;
      }
      // Tag filter
      if (selectedTag !== "all" && !item.tags.includes(selectedTag)) {
        return false;
      }
      // Bookmarks filter
      if (onlyBookmarks && !bookmarks.includes(item.id)) {
        return false;
      }
      // Read books filter
      if (onlyRead && !readBooks.includes(item.id)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitleFa = item.titleFa.toLowerCase().includes(q);
        const matchesTitleEn = item.titleEn.toLowerCase().includes(q);
        const matchesDesc = item.descriptionFa.toLowerCase().includes(q);
        const matchesPublisher = item.authorOrPublisher.toLowerCase().includes(q);
        const matchesTag = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitleFa && !matchesTitleEn && !matchesDesc && !matchesPublisher && !matchesTag) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "popular") {
        return b.downloadCount - a.downloadCount;
      }
      if (sortBy === "newest") {
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      }
      if (sortBy === "title") {
        return a.titleFa.localeCompare(b.titleFa, "fa");
      }
      return 0;
    });
  }, [
    selectedCategory,
    selectedLevel,
    selectedFormat,
    selectedGenre,
    selectedTag,
    onlyBookmarks,
    onlyRead,
    bookmarks,
    readBooks,
    searchQuery,
    sortBy,
  ]);

  const isAnyFilterActive = useMemo(() => {
    return (
      selectedCategory !== "all" ||
      searchQuery.trim() !== "" ||
      selectedLevel !== "all" ||
      selectedFormat !== "all" ||
      selectedGenre !== "all" ||
      selectedTag !== "all" ||
      onlyBookmarks ||
      onlyRead
    );
  }, [selectedCategory, searchQuery, selectedLevel, selectedFormat, selectedGenre, selectedTag, onlyBookmarks, onlyRead]);

  // Sidebar Component Content (used in both desktop sticky & mobile drawer)
  const renderSidebarContent = (isMini: boolean) => {
    if (isMini) {
      return (
        <div className={styles.sidebarInner}>
          <div className={styles.sidebarHeader}>
            <button
              type="button"
              className={styles.sidebarToggleBtn}
              onClick={() => setSidebarCollapsed(false)}
              title="گسترش سایدبار"
              aria-label="گسترش سایدبار"
            >
              ⇤
            </button>
          </div>

          <div className={styles.sidebarScrollable}>
            {/* Quick Icons */}
            <button
              type="button"
              className={`${styles.miniIconBtn} ${onlyBookmarks ? styles.miniIconBtnActive : ""}`}
              onClick={() => {
                setOnlyBookmarks(!onlyBookmarks);
                setOnlyRead(false);
              }}
              title="نشان‌شده‌های من"
            >
              <span>⭐</span>
              <span className={styles.miniCountBadge}>{bookmarks.length}</span>
            </button>

            <button
              type="button"
              className={`${styles.miniIconBtn} ${onlyRead ? styles.miniIconBtnActive : ""}`}
              onClick={() => {
                setOnlyRead(!onlyRead);
                setOnlyBookmarks(false);
              }}
              title="کتاب‌های خوانده‌شده"
            >
              <span>✅</span>
              <span className={styles.miniCountBadge}>{readBooks.length}</span>
            </button>

            <div style={{ height: "1px", background: "var(--dl-border-subtle)", margin: "8px 0" }} />

            {/* Categories Icons */}
            {DOWNLOAD_CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`${styles.miniIconBtn} ${isActive ? styles.miniIconBtnActive : ""}`}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setOpenCategoryAccordion(cat.id);
                    setSidebarCollapsed(false);
                  }}
                  title={cat.labelFa}
                >
                  <span>{cat.icon}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.sidebarFooter}>
            <button
              type="button"
              className={styles.miniIconBtn}
              onClick={() => setIsRequestModalOpen(true)}
              title="درخواست کتاب جدید"
            >
              <span>✨</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.sidebarCard}>
        {/* Sidebar Header */}
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarHeaderTitle}>
            <span>🏛️</span>
            <span>کتابخانه و فیلترها</span>
          </div>
          <button
            type="button"
            className={styles.sidebarToggleBtn}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title="جمع کردن سایدبار"
            aria-label="جمع کردن سایدبار"
          >
            ⇥
          </button>
        </div>

        {/* Scrollable Body */}
        <div className={styles.sidebarScrollable}>
          {/* 1. Personal Shelf Section */}
          <div className={styles.sidebarSectionGroup}>
            <div className={styles.sidebarSectionHeading}>
              <span>کتابخانه من</span>
            </div>

            <button
              type="button"
              className={`${styles.navItemBtn} ${onlyBookmarks ? styles.navItemBtnActive : ""}`}
              onClick={() => {
                setOnlyBookmarks(!onlyBookmarks);
                setOnlyRead(false);
              }}
            >
              <div className={styles.navItemLeft}>
                <span className={styles.navItemIcon}>⭐</span>
                <span>مورد علاقه‌های من</span>
              </div>
              <span className={styles.navItemBadge}>{bookmarks.length}</span>
            </button>

            <button
              type="button"
              className={`${styles.navItemBtn} ${onlyRead ? styles.navItemBtnActive : ""}`}
              onClick={() => {
                setOnlyRead(!onlyRead);
                setOnlyBookmarks(false);
              }}
            >
              <div className={styles.navItemLeft}>
                <span className={styles.navItemIcon}>✅</span>
                <span>کتاب‌های خوانده‌شده</span>
              </div>
              <span className={styles.navItemBadge}>{readBooks.length}</span>
            </button>
          </div>

          {/* 2. Categorized Collapsible Accordion & Tags */}
          <div className={styles.sidebarSectionGroup}>
            <div className={styles.sidebarSectionHeading}>
              <span>دسته‌بندی موضوعی و تگ‌ها</span>
            </div>

            {DOWNLOAD_CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const isOpen = openCategoryAccordion === cat.id;
              const catMeta = categoryData[cat.id];

              return (
                <div
                  key={cat.id}
                  className={`${styles.accordionCategoryItem} ${isOpen ? styles.accordionCategoryItemOpen : ""}`}
                >
                  <button
                    type="button"
                    className={`${styles.accordionHeaderBtn} ${isSelected ? styles.accordionHeaderBtnActive : ""}`}
                    onClick={() => {
                      if (selectedCategory === cat.id) {
                        setOpenCategoryAccordion(isOpen ? null : cat.id);
                      } else {
                        setSelectedCategory(cat.id);
                        setOpenCategoryAccordion(cat.id);
                        setOnlyBookmarks(false);
                        setOnlyRead(false);
                      }
                    }}
                  >
                    <div className={styles.accordionHeaderLeft}>
                      <span>{cat.icon}</span>
                      <span>{cat.labelFa}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span className={styles.navItemBadge}>{catMeta?.count || 0}</span>
                      <span className={`${styles.accordionChevron} ${isOpen ? styles.accordionChevronRotated : ""}`}>
                        ▼
                      </span>
                    </div>
                  </button>

                  {/* Contextual Chips Inside Accordion */}
                  {isOpen && catMeta && (
                    <div className={styles.accordionDrawerBody}>
                      {/* CEFR Levels */}
                      {catMeta.levels.size > 0 && (
                        <div>
                          <div className={styles.accordionSubGroupTitle}>سطح آموزشی:</div>
                          <div className={styles.chipsFlexWrap}>
                            <button
                              type="button"
                              className={`${styles.filterChip} ${selectedLevel === "all" ? styles.filterChipActive : ""}`}
                              onClick={() => setSelectedLevel("all")}
                            >
                              همه سطوح
                            </button>
                            {Array.from(catMeta.levels).map((lvl) => (
                              <button
                                key={lvl}
                                type="button"
                                className={`${styles.filterChip} ${selectedLevel === lvl ? styles.filterChipActive : ""}`}
                                onClick={() => setSelectedLevel(selectedLevel === lvl ? "all" : lvl)}
                              >
                                {lvl === "Grade 12" ? "دوازدهم نهایی" : lvl}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* File Formats */}
                      {catMeta.formats.size > 0 && (
                        <div>
                          <div className={styles.accordionSubGroupTitle}>فرمت منبع:</div>
                          <div className={styles.chipsFlexWrap}>
                            <button
                              type="button"
                              className={`${styles.filterChip} ${selectedFormat === "all" ? styles.filterChipActive : ""}`}
                              onClick={() => setSelectedFormat("all")}
                            >
                              همه
                            </button>
                            {Array.from(catMeta.formats).map((fmt) => (
                              <button
                                key={fmt}
                                type="button"
                                className={`${styles.filterChip} ${selectedFormat === fmt ? styles.filterChipActive : ""}`}
                                onClick={() => setSelectedFormat(selectedFormat === fmt ? "all" : fmt)}
                              >
                                {fmt === "pdf" ? "کتاب PDF" : fmt === "epub" ? "کتابخوان EPUB" : fmt === "audio" ? "صوتی MP3" : fmt === "video" ? "ویدیو MP4" : "پکیج ZIP"}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Genres / Themes */}
                      {catMeta.genres.size > 0 && (
                        <div>
                          <div className={styles.accordionSubGroupTitle}>ژانر و موضوع:</div>
                          <div className={styles.chipsFlexWrap}>
                            <button
                              type="button"
                              className={`${styles.filterChip} ${selectedGenre === "all" ? styles.filterChipActive : ""}`}
                              onClick={() => setSelectedGenre("all")}
                            >
                              همه ژانرها
                            </button>
                            {Array.from(catMeta.genres).map((g) => (
                              <button
                                key={g}
                                type="button"
                                className={`${styles.filterChip} ${selectedGenre === g ? styles.filterChipActive : ""}`}
                                onClick={() => setSelectedGenre(selectedGenre === g ? "all" : g)}
                              >
                                {g}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Request Book Bottom Button */}
        <div className={styles.sidebarFooter}>
          <button
            type="button"
            className={styles.requestBookBtn}
            onClick={() => setIsRequestModalOpen(true)}
          >
            <span>✨</span>
            <span>درخواست کتاب جدید</span>
          </button>
        </div>
      </div>
    );
  };

  // Render Card in Grid Mode
  const renderGridCard = (item: DownloadItem) => {
    const isBookmarked = bookmarks.includes(item.id);
    const isRead = readBooks.includes(item.id);
    const isExpanded = expandedCardIds.has(item.id);

    const subFiles =
      item.subFiles && item.subFiles.length > 0
        ? item.subFiles
        : [
            {
              id: `${item.id}-main`,
              titleFa: item.titleFa,
              titleEn: item.titleEn,
              format: item.format,
              formatLabel: item.formatLabel,
              fileSize: item.fileSize,
              downloadUrl: item.downloadUrl,
              mirrorUrl: item.mirrorUrl,
              badge: "فایل اصلی",
            },
          ];

    return (
      <article
        key={item.id}
        className={`${styles.bookCard} ${isRead ? styles.bookCardRead : ""}`}
      >
        <div>
          {/* Card Top: Badges & Quick Action Icons */}
          <div className={styles.cardTopRow}>
            <div className={styles.badgePillsGroup}>
              <span className={styles.pillLevel}>
                {item.cefrLevel === "Grade 12" ? "دوازدهم نهایی" : item.cefrLevel}
              </span>
              <span className={styles.pillFormat}>{item.formatLabel}</span>
              {isRead && <span className={styles.pillReadBadge}>✓ خواندم</span>}
              {item.isPopular && <span className={styles.pillHot}>پرطرفدار</span>}
              {item.isNew && <span className={styles.pillNew}>جدید</span>}
            </div>

            <div className={styles.cardQuickActions}>
              {/* Copy link */}
              <button
                type="button"
                className={styles.cardIconBtn}
                onClick={(e) => copyDirectLink(item, e)}
                title="کپی لینک مستقیم"
                aria-label="کپی لینک مستقیم"
              >
                🔗
              </button>

              {/* Bookmark */}
              <button
                type="button"
                className={`${styles.cardIconBtn} ${isBookmarked ? styles.cardIconBtnBookmarkActive : ""}`}
                onClick={(e) => toggleBookmark(item.id, e)}
                title={isBookmarked ? "حذف از نشان‌شده‌ها" : "نشان کردن"}
                aria-label="نشان کردن"
              >
                {isBookmarked ? "★" : "☆"}
              </button>

              {/* Mark as read */}
              <button
                type="button"
                className={`${styles.cardIconBtn} ${isRead ? styles.cardIconBtnReadActive : ""}`}
                onClick={(e) => toggleRead(item.id, e)}
                title={isRead ? "حذف از خوانده‌شده‌ها" : "علامت‌گذاری به عنوان خوانده‌شده"}
                aria-label="خوانده‌شده"
              >
                ✓
              </button>
            </div>
          </div>

          {/* Titles & Publisher */}
          <h3 className={styles.cardTitleFa}>{item.titleFa}</h3>
          <div className={styles.cardTitleEn}>{item.titleEn}</div>
          <p className={styles.cardDesc}>{item.descriptionFa}</p>
        </div>

        <div>
          {/* Metadata Row */}
          <div className={styles.cardMetaRow}>
            <span>💾 حجم: {item.fileSize}</span>
            <span>🏛️ {item.authorOrPublisher}</span>
            <span>📥 {item.downloadCount.toLocaleString("fa-IR")}</span>
          </div>

          {/* Action Row */}
          <div className={styles.cardActionGrid}>
            <Link
              href={`/books/${item.id}`}
              className={styles.actionBtnPrimary}
              title={`مطالعه آنلاین ${item.titleFa}`}
            >
              <span>📖 مطالعه آنلاین</span>
            </Link>

            <a
              href={item.downloadUrl}
              className={styles.actionBtnSecondary}
              onClick={() => handleDownloadTrigger(item.titleFa)}
              title="دانلود فایل اصلی"
              download
            >
              <span>📥 دانلود کامل</span>
            </a>
          </div>

          {/* Subfiles Accordion Trigger (if multiple parts exist) */}
          {subFiles.length > 1 && (
            <button
              type="button"
              className={styles.subFilesToggleBtn}
              onClick={(e) => toggleSubFiles(item.id, e)}
            >
              <span>{isExpanded ? "بستن اجزای پکیج ▲" : `مشاهده اجزای پکیج (${subFiles.length} بخش) ▼`}</span>
            </button>
          )}

          {/* Subfiles Drawer Inside Card */}
          {isExpanded && (
            <div className={styles.subFilesNestedBox}>
              <div className={styles.subFilesNestedTitle}>
                <span>اجزای تفکیک‌شده این دوره:</span>
                <span>{subFiles.length} فایل</span>
              </div>
              {subFiles.map((sub) => (
                <div key={sub.id} className={styles.subFileRow}>
                  <div className={styles.subFileRowText}>
                    <div className={styles.subFileRowTitle}>{sub.titleFa}</div>
                    <div className={styles.subFileRowMeta}>
                      <span>{sub.formatLabel}</span>
                      <span>• {sub.fileSize}</span>
                      {sub.badge && <span style={{ color: "var(--dl-primary-700)", fontWeight: 700 }}>• {sub.badge}</span>}
                    </div>
                  </div>
                  <a
                    href={sub.downloadUrl}
                    className={styles.subFileDlBtn}
                    onClick={() => handleDownloadTrigger(sub.titleFa)}
                    download
                  >
                    دریافت
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </article>
    );
  };

  // Render Card in List Mode
  const renderListRow = (item: DownloadItem) => {
    const isBookmarked = bookmarks.includes(item.id);
    const isRead = readBooks.includes(item.id);

    return (
      <article
        key={item.id}
        className={`${styles.bookListRow} ${isRead ? styles.bookListRowRead : ""}`}
      >
        <div className={styles.listRowMain}>
          <div className={styles.listRowIcon}>
            {item.format === "video" ? "🎬" : item.format === "audio" ? "🎧" : "📖"}
          </div>
          <div className={styles.listRowTitles}>
            <div className={styles.listRowTitleFa}>{item.titleFa}</div>
            <div className={styles.listRowTitleEn}>{item.titleEn}</div>
          </div>
        </div>

        <div className={styles.listRowMeta}>
          <span className={styles.pillLevel}>
            {item.cefrLevel === "Grade 12" ? "دوازدهم نهایی" : item.cefrLevel}
          </span>
          <span className={styles.pillFormat}>{item.formatLabel}</span>
          <span>💾 {item.fileSize}</span>
          <span>📥 {item.downloadCount.toLocaleString("fa-IR")}</span>
        </div>

        <div className={styles.listRowActions}>
          <Link
            href={`/books/${item.id}`}
            className={styles.actionBtnPrimary}
            style={{ padding: "6px 12px", fontSize: "0.8rem" }}
          >
            مطالعه
          </Link>

          <a
            href={item.downloadUrl}
            className={styles.actionBtnSecondary}
            style={{ padding: "6px 12px", fontSize: "0.8rem" }}
            onClick={() => handleDownloadTrigger(item.titleFa)}
            download
          >
            دانلود
          </a>

          <button
            type="button"
            className={`${styles.cardIconBtn} ${isBookmarked ? styles.cardIconBtnBookmarkActive : ""}`}
            onClick={(e) => toggleBookmark(item.id, e)}
            title="نشان کردن"
          >
            {isBookmarked ? "★" : "☆"}
          </button>

          <button
            type="button"
            className={`${styles.cardIconBtn} ${isRead ? styles.cardIconBtnReadActive : ""}`}
            onClick={(e) => toggleRead(item.id, e)}
            title="خوانده‌شده"
          >
            ✓
          </button>
        </div>
      </article>
    );
  };

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toastNotification} role="status">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Compact Editorial Header */}
      <header className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span>🏛️</span>
            <span>کتابخانه آکادمیک و آرشیو بین‌المللی اندورا</span>
          </div>

          <h1 className={styles.heroTitle}>
            مرجع جامع <span className={styles.heroTitleHighlight}>دانلود منابع زبان انگلیسی</span>
          </h1>
          <p className={styles.heroSubtitle}>
            آرشیو بزرگ کتب بین‌المللی، رمان‌های صوتی، آزمون‌های نهایی دوازدهم کشوری و مراجع رسمی گرامر با دسترسی سریع و آزاد
          </p>

          {/* Floating Search Input */}
          <div className={styles.searchBoxWrapper}>
            <input
              ref={searchInputRef}
              type="text"
              className={styles.searchInput}
              placeholder="جستجو در عنوان کتاب، رمان، امتحانات نهایی، گرامر، انتشارات یا سطح..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className={styles.searchIcon}>🔍</span>
            <div className={styles.searchActions}>
              <span className={styles.searchShortcutHint}>Ctrl + K</span>
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearSearchBtn}
                  onClick={() => setSearchQuery("")}
                  title="پاک کردن جستجو"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Two-Column Layout (Sidebar Right, Content Left in RTL) */}
      <div className={styles.layoutContainer}>
        {/* Right: Sticky Sidebar Area (In RTL flex row, 1st child is on right) */}
        <aside
          className={`${styles.sidebarWrapper} ${sidebarCollapsed ? styles.sidebarWrapperCollapsed : ""}`}
        >
          {renderSidebarContent(sidebarCollapsed)}
        </aside>

        {/* Left: Main Content Area */}
        <main className={styles.mainContentArea}>
          {/* Controls & Toolbar Bar */}
          <div className={styles.toolbar}>
            <div className={styles.toolbarSummary}>
              <button
                type="button"
                className={styles.mobileFilterToggleBtn}
                onClick={() => setMobileDrawerOpen(true)}
              >
                <span>☰</span>
                <span>دسته‌ها و کتابخانه من</span>
              </button>

              <span>
                نمایش <strong>{filteredItems.length}</strong> منبع
              </span>

              {/* Active Filter Pills */}
              {isAnyFilterActive && (
                <div className={styles.activeFiltersPills}>
                  {selectedCategory !== "all" && (
                    <span className={styles.activeFilterTag}>
                      {DOWNLOAD_CATEGORIES.find((c) => c.id === selectedCategory)?.labelFa}
                      <button
                        type="button"
                        className={styles.activeFilterRemoveBtn}
                        onClick={() => setSelectedCategory("all")}
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  {selectedLevel !== "all" && (
                    <span className={styles.activeFilterTag}>
                      سطح: {selectedLevel}
                      <button
                        type="button"
                        className={styles.activeFilterRemoveBtn}
                        onClick={() => setSelectedLevel("all")}
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  {selectedFormat !== "all" && (
                    <span className={styles.activeFilterTag}>
                      فرمت: {selectedFormat}
                      <button
                        type="button"
                        className={styles.activeFilterRemoveBtn}
                        onClick={() => setSelectedFormat("all")}
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  {selectedGenre !== "all" && (
                    <span className={styles.activeFilterTag}>
                      ژانر: {selectedGenre}
                      <button
                        type="button"
                        className={styles.activeFilterRemoveBtn}
                        onClick={() => setSelectedGenre("all")}
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  {onlyBookmarks && (
                    <span className={styles.activeFilterTag}>
                      ⭐ فقط نشان‌شده‌ها
                      <button
                        type="button"
                        className={styles.activeFilterRemoveBtn}
                        onClick={() => setOnlyBookmarks(false)}
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  {onlyRead && (
                    <span className={styles.activeFilterTag}>
                      ✅ فقط خوانده‌شده‌ها
                      <button
                        type="button"
                        className={styles.activeFilterRemoveBtn}
                        onClick={() => setOnlyRead(false)}
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  <button type="button" className={styles.resetAllFiltersBtn} onClick={resetAllFilters}>
                    ریست همه
                  </button>
                </div>
              )}
            </div>

            <div className={styles.toolbarRightControls}>
              {/* Sort Dropdown */}
              <div className={styles.sortWrapper}>
                <span>مرتب‌سازی:</span>
                <select
                  className={styles.sortSelect}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "popular" | "newest" | "title")}
                >
                  <option value="popular">پردانلودترین‌ها</option>
                  <option value="newest">جدیدترین منابع</option>
                  <option value="title">بر اساس عنوان (الفبا)</option>
                </select>
              </div>

              {/* View Mode Switcher */}
              <div className={styles.viewModeSwitch}>
                <button
                  type="button"
                  className={`${styles.viewModeBtn} ${viewMode === "grid" ? styles.viewModeBtnActive : ""}`}
                  onClick={() => changeViewMode("grid")}
                  title="نمایش شبکه‌ای"
                >
                  <span>⊞</span>
                </button>
                <button
                  type="button"
                  className={`${styles.viewModeBtn} ${viewMode === "list" ? styles.viewModeBtnActive : ""}`}
                  onClick={() => changeViewMode("list")}
                  title="نمایش لیستی فشرده"
                >
                  <span>☰</span>
                </button>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔍</div>
              <h3 className={styles.emptyTitle}>هیچ منبعی با مشخصات انتخاب‌شده یافت نشد!</h3>
              <p className={styles.emptySubtitle}>عبارت جستجو را تغییر دهید یا فیلترها را ریست کنید.</p>
              <button type="button" className={styles.actionBtnPrimary} onClick={resetAllFilters}>
                🔄 بازنشانی تمام فیلترها
              </button>
            </div>
          )}

          {/* Cards Display (Grid vs List) */}
          {filteredItems.length > 0 && (
            <>
              {viewMode === "grid" ? (
                <div className={styles.cardsGrid}>
                  {filteredItems.slice(0, searchLimit).map(renderGridCard)}
                </div>
              ) : (
                <div className={styles.cardsList}>
                  {filteredItems.slice(0, searchLimit).map(renderListRow)}
                </div>
              )}

              {/* Load More Pagination */}
              {filteredItems.length > searchLimit && (
                <div className={styles.loadMoreContainer}>
                  <button
                    type="button"
                    className={styles.loadMoreBtn}
                    onClick={() => setSearchLimit((prev) => prev + 36)}
                  >
                    <span>نمایش ۳۶ عنوان دیگر</span>
                    <span>
                      ({Math.min(searchLimit, filteredItems.length).toLocaleString("fa-IR")} از{" "}
                      {filteredItems.length.toLocaleString("fa-IR")})
                    </span>
                  </button>
                  <button
                    type="button"
                    className={styles.loadAllBtn}
                    onClick={() => setSearchLimit(filteredItems.length)}
                  >
                    نمایش همه ({filteredItems.length.toLocaleString("fa-IR")} مورد)
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Drawer (Slide-out from Left) */}
      {mobileDrawerOpen && (
        <div className={styles.mobileDrawerOverlay} onClick={() => setMobileDrawerOpen(false)}>
          <div className={styles.mobileDrawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sidebarHeader} style={{ borderRadius: 0 }}>
              <div className={styles.sidebarHeaderTitle}>
                <span>🏛️</span>
                <span>دسته‌ها و کتابخانه من</span>
              </div>
              <button
                type="button"
                className={styles.sidebarToggleBtn}
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="بستن"
              >
                ✕
              </button>
            </div>
            {renderSidebarContent(false)}
          </div>
        </div>
      )}

      {/* Modal: Request New Book */}
      {isRequestModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsRequestModalOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setIsRequestModalOpen(false)}
              aria-label="بستن"
            >
              ✕
            </button>

            <span className={styles.modalHeaderIcon}>✨</span>
            <h3 className={styles.modalTitle}>درخواست افزودن کتاب جدید</h3>
            <p className={styles.modalDesc}>
              اگر کتاب، رمان صوتی یا منبع آموزشی خاصی مد نظرتان است، اطلاعات آن را برای ما ارسال کنید تا تیم محتوا در اسرع وقت آن را با لینک مستقیم به کتابخانه اضافه کند.
            </p>

            <form onSubmit={handleRequestSubmit}>
              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>عنوان کتاب یا منبع (فارسی یا انگلیسی) *</label>
                <input
                  type="text"
                  required
                  className={styles.modalInput}
                  placeholder="مثال: Atomic Habits یا رمان صوتی Jane Eyre"
                  value={requestForm.title}
                  onChange={(e) => setRequestForm({ ...requestForm, title: e.target.value })}
                />
              </div>

              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>نام نویسنده یا انتشارات (اختیاری)</label>
                <input
                  type="text"
                  className={styles.modalInput}
                  placeholder="مثال: Oxford University Press یا James Clear"
                  value={requestForm.author}
                  onChange={(e) => setRequestForm({ ...requestForm, author: e.target.value })}
                />
              </div>

              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>دسته‌بندی پیشنهادی</label>
                <select
                  className={styles.modalSelect}
                  value={requestForm.category}
                  onChange={(e) => setRequestForm({ ...requestForm, category: e.target.value })}
                >
                  <option value="coursebooks">کتب آموزشی بین‌المللی</option>
                  <option value="novels">رمان‌ها و شاهکارهای ادبی</option>
                  <option value="final_exams">امتحانات نهایی دوازدهم</option>
                  <option value="skills_grammar">گرامر و واژگان</option>
                  <option value="videos">دوره‌ها و مستندهای ویدیویی</option>
                </select>
              </div>

              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>توضیحات یا لینک منبع (اختیاری)</label>
                <textarea
                  rows={3}
                  className={styles.modalTextarea}
                  placeholder="لینک مستقیم یا هر توضیحی که به پیدا کردن سریع‌تر این فایل کمک می‌کند..."
                  value={requestForm.notes}
                  onChange={(e) => setRequestForm({ ...requestForm, notes: e.target.value })}
                />
              </div>

              <button type="submit" className={styles.modalSubmitBtn}>
                🚀 ثبت و ارسال درخواست
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Media Preview (Audio / Video) */}
      {previewItem && (
        <div className={styles.modalBackdrop} onClick={() => setPreviewItem(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setPreviewItem(null)}
              aria-label="بستن"
            >
              ✕
            </button>
            <span className={styles.modalHeaderIcon}>
              {previewItem.format === "video" ? "🎬" : "🎧"}
            </span>
            <h3 className={styles.modalTitle}>پیش‌نمایش آنلاین: {previewItem.titleFa}</h3>
            <p className={styles.modalDesc}>
              {previewItem.format === "video"
                ? "مشاهده نمونه ویدیوی آموزشی با کیفیت عالی"
                : "شنیدن فایل صوتی نمونه با اجرای گویندگان نیتیو"}
            </p>

            <div className={styles.mediaPreviewContainer}>
              {previewItem.format === "video" && previewItem.previewUrl ? (
                <video controls autoPlay src={previewItem.previewUrl} />
              ) : previewItem.previewUrl ? (
                <audio controls autoPlay src={previewItem.previewUrl} />
              ) : (
                <p style={{ color: "#fff", padding: "20px" }}>پیش‌نمایش این منبع در حال آماده‌سازی است.</p>
              )}
            </div>

            <a
              href={previewItem.downloadUrl}
              className={styles.modalSubmitBtn}
              style={{ display: "block", textAlign: "center", textDecoration: "none" }}
              onClick={() => {
                handleDownloadTrigger(previewItem.titleFa);
                setPreviewItem(null);
              }}
              download
            >
              📥 دریافت فایل کامل ({previewItem.fileSize})
            </a>
          </div>
        </div>
      )}

      {/* Guide Section at Footer */}
      <section className={styles.guideSection}>
        <div className={styles.guideCard}>
          <div className={styles.guideHeader}>
            <span className={styles.guideHeaderIcon}>💡</span>
            <div>
              <h3 className={styles.guideTitle}>راهنمای جامع دانلود و استفاده از فایل‌ها</h3>
              <p style={{ margin: "3px 0 0", color: "var(--dl-text-muted)", fontSize: "0.84rem" }}>
                نکات مهم جهت بازگشایی آسان فایل‌های فشرده (ZIP)، کتاب‌های الکترونیکی (PDF/EPUB) و فایل‌های صوتی
              </p>
            </div>
          </div>

          <div className={styles.guideGrid}>
            <div className={styles.guideItem}>
              <h4 className={styles.guideItemTitle}>📱 در گوشی‌های اندروید (Android)</h4>
              <p className={styles.guideItemDesc}>
                فایل‌های ZIP را با برنامه رایگان ZArchiver یا Google Files استخراج کنید. برای خواندن PDF و EPUB نرم‌افزارهای Adobe Acrobat و Moon+ Reader پیشنهاد می‌شود.
              </p>
            </div>

            <div className={styles.guideItem}>
              <h4 className={styles.guideItemTitle}>🍏 در گوشی‌های آیفون (iOS)</h4>
              <p className={styles.guideItemDesc}>
                فایل‌های فشرده مستقیماً با لمس در برنامه پیش‌فرض Files باز می‌شوند. کتاب‌های PDF و EPUB به صورت پیش‌فرض در Apple Books قابل مشاهده‌اند.
              </p>
            </div>

            <div className={styles.guideItem}>
              <h4 className={styles.guideItemTitle}>💻 در کامپیوتر (Windows / Mac)</h4>
              <p className={styles.guideItemDesc}>
                با نرم‌افزار 7-Zip یا WinRAR فایل‌ها را اکسترکت کنید. تمامی فایل‌های صوتی با کیفیت استودیویی و کدگذاری استاندارد آماده پخش هستند.
              </p>
            </div>

            <div className={styles.guideItem}>
              <h4 className={styles.guideItemTitle}>⚡ سرعت دانلود و پایداری سرورها</h4>
              <p className={styles.guideItemDesc}>
                سرورهای اندورا از قابلیت Resume و دانلود پرسرعت با IDM پشتیبانی می‌کنند. تمامی منابع ۱۰۰٪ رایگان و بدون محدودیت پهنای باند ارائه می‌شوند.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState, useMemo, useEffect } from "react";
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
  const [selectedCategory, setSelectedCategory] = useState<DownloadCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "title">("popular");
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);

  // Open / Closed state for the collapsible shelves (multi-expand)
  // By default, first shelf (coursebooks) is open
  const [openShelfIds, setOpenShelfIds] = useState<Set<string>>(
    new Set(["shelf-coursebooks"])
  );

  // Expanded accordion card IDs (for subfiles inside cards)
  const [expandedCardIds, setExpandedCardIds] = useState<Set<string>>(new Set());

  // Bookmarks state (saved to localStorage)
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Modals & Floating State
  const [previewItem, setPreviewItem] = useState<DownloadItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSoftGateBanner, setShowSoftGateBanner] = useState(false);

  // Initialize client state
  useEffect(() => {
    try {
      const storedBookmarks = localStorage.getItem("endoora_bookmarked_downloads");
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks));
      }
    } catch (_) {}
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let updated: string[];
    if (bookmarks.includes(id)) {
      updated = bookmarks.filter((b) => b !== id);
      showToast("منبع از نشان‌شده‌های شما حذف شد ❌");
    } else {
      updated = [...bookmarks, id];
      showToast("منبع به نشان‌شده‌های شما افزوده شد ⭐");
    }
    setBookmarks(updated);
    try {
      localStorage.setItem("endoora_bookmarked_downloads", JSON.stringify(updated));
    } catch (_) {}
  };

  const toggleAccordion = (id: string) => {
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

  // Toggle individual collapsible shelf
  const toggleShelf = (shelfId: string) => {
    setOpenShelfIds((prev) => {
      const next = new Set(prev);
      if (next.has(shelfId)) {
        next.delete(shelfId);
      } else {
        next.add(shelfId);
      }
      return next;
    });
  };

  const expandAllShelves = () => {
    setOpenShelfIds(
      new Set([
        "shelf-coursebooks",
        "shelf-final_exams",
        "shelf-novels",
        "shelf-skills_grammar",
        "shelf-videos",
      ])
    );
  };

  const collapseAllShelves = () => {
    setOpenShelfIds(new Set());
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
    setShowSoftGateBanner(true);
  };

  // Quick jump pill click: Auto-expands the shelf if closed & scrolls smoothly
  const scrollToShelf = (shelfId: string) => {
    setSelectedCategory(shelfId as DownloadCategory);
    if (shelfId === "all") {
      window.scrollTo({ top: 340, behavior: "smooth" });
      return;
    }
    const fullShelfId = `shelf-${shelfId}`;
    setOpenShelfIds((prev) => {
      const next = new Set(prev);
      next.add(fullShelfId);
      return next;
    });
    setTimeout(() => {
      const el = document.getElementById(fullShelfId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 60);
  };

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return DOWNLOAD_ITEMS.filter((item) => {
      // Category filter (if not "all")
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
      // Bookmarks filter
      if (onlyBookmarks && !bookmarks.includes(item.id)) {
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
  }, [selectedCategory, selectedLevel, selectedFormat, onlyBookmarks, bookmarks, searchQuery, sortBy]);

  // Is adaptive search/filter active?
  const isSearchOrFilterActive = useMemo(() => {
    return (
      searchQuery.trim() !== "" ||
      selectedLevel !== "all" ||
      selectedFormat !== "all" ||
      onlyBookmarks ||
      selectedCategory !== "all"
    );
  }, [searchQuery, selectedLevel, selectedFormat, onlyBookmarks, selectedCategory]);

  const resetAllFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSelectedLevel("all");
    setSelectedFormat("all");
    setOnlyBookmarks(false);
    setSortBy("popular");
  };

  // Group items by category for the Shelves View
  const itemsByCategory = useMemo(() => {
    const map: Record<string, DownloadItem[]> = {
      coursebooks: [],
      final_exams: [],
      novels: [],
      skills_grammar: [],
      videos: [],
    };
    DOWNLOAD_ITEMS.forEach((item) => {
      if (map[item.category]) {
        map[item.category].push(item);
      }
    });
    return map;
  }, []);

  // Top featured items for showcase
  const featuredItems = useMemo(() => {
    return DOWNLOAD_ITEMS.filter((item) => item.isPopular && item.isNew).slice(0, 3);
  }, []);

  // Render a Single Download Card
  const renderCard = (item: DownloadItem) => {
    const isBookmarked = bookmarks.includes(item.id);
    const isExpanded = expandedCardIds.has(item.id);

    // Subfiles to show: either defined subFiles or synthesized primary subfile
    const subFiles = item.subFiles && item.subFiles.length > 0
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
      <article key={item.id} className={styles.resourceCard}>
        <div>
          {/* Card Top Badges & Bookmark */}
          <div className={styles.cardTop}>
            <div className={styles.badgeCluster}>
              <span className={styles.badgeFormat}>{item.formatLabel}</span>
              <span className={styles.badgeLevel}>
                {item.cefrLevel === "Grade 12" ? "دوازدهم نهایی" : item.cefrLevel}
              </span>
              {item.isPopular && <span className={styles.badgeHot}>🔥 پرطرفدار</span>}
              {item.isNew && (
                <span className={styles.badgeHot} style={{ color: "#0284c7", borderColor: "#bae6fd" }}>
                  ✨ جدید
                </span>
              )}
            </div>

            <div className={styles.cardActionIcons}>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={(e) => copyDirectLink(item, e)}
                title="کپی لینک مستقیم دانلود"
                aria-label="کپی لینک مستقیم"
              >
                🔗
              </button>

              <button
                type="button"
                className={`${styles.iconBtn} ${isBookmarked ? styles.bookmarkActive : ""}`}
                onClick={(e) => toggleBookmark(item.id, e)}
                title={isBookmarked ? "حذف از نشان‌شده‌ها" : "نشان کردن منبع"}
                aria-label="نشان کردن"
              >
                {isBookmarked ? "★" : "☆"}
              </button>
            </div>
          </div>

          {/* Book Spine Crest & Titles */}
          <div className={styles.cardSpineBanner}>
            <div className={styles.cardSpineCrest}>
              {item.format === "video" ? "🎬" : item.format === "audio" ? "🎧" : "📖"}
            </div>
            <div className={styles.cardTitleBlock}>
              <h3 className={styles.cardTitleFa}>{item.titleFa}</h3>
              <div className={styles.cardTitleEn}>{item.titleEn}</div>
            </div>
          </div>

          <p className={styles.cardDesc}>{item.descriptionFa}</p>
        </div>

        <div>
          {/* Metadata Row */}
          <div className={styles.metaInfo}>
            <span>
              💾 حجم کل: <strong>{item.fileSize}</strong>
            </span>
            <span>
              🏛️ ناشر: <strong>{item.authorOrPublisher}</strong>
            </span>
            <span>
              📥 <strong>{item.downloadCount.toLocaleString("fa-IR")}</strong> دریافت
            </span>
          </div>

          {/* Action Row */}
          <div className={styles.actionsRow}>
            <Link
              href={`/books/${item.id}`}
              className={styles.readBookBtn}
              title={`مطالعه آنلاین ${item.titleFa}`}
            >
              <span>📖 مطالعه</span>
            </Link>

            <a
              href={item.downloadUrl}
              className={styles.quickDlBtn}
              onClick={() => handleDownloadTrigger(item.titleFa)}
              title="دانلود سریع پکیج کامل"
              download
            >
              <span>📥 دانلود کامل</span>
            </a>

            {item.previewUrl && (
              <button
                type="button"
                className={styles.previewBtn}
                onClick={() => setPreviewItem(item)}
                title="پیش‌نمایش آنلاین"
                aria-label="پیش‌نمایش آنلاین"
              >
                {item.format === "video" ? "🎬" : "🎧"}
              </button>
            )}
          </div>

          {/* Expandable Accordion Subfiles */}
          {isExpanded && (
            <div className={styles.subFilesAccordion}>
              <div className={styles.subFilesHeader}>
                <span>📂 اجزای تفکیک‌شده این پکیج دانلودی:</span>
                <span>{subFiles.length} بخش مجزا</span>
              </div>

              {subFiles.map((sub) => (
                <div key={sub.id} className={styles.subFileItem}>
                  <div className={styles.subFileInfo}>
                    <span className={styles.subFileIcon}>
                      {sub.format === "video" ? "🎬" : sub.format === "audio" ? "🎵" : "📄"}
                    </span>
                    <div className={styles.subFileText}>
                      <h4 className={styles.subFileTitleFa}>{sub.titleFa}</h4>
                      <div className={styles.subFileMeta}>
                        <span className={styles.subFileSizeBadge}>{sub.fileSize}</span>
                        <span>{sub.formatLabel}</span>
                        {sub.badge && (
                          <span style={{ color: "var(--dl-crimson-600)", fontWeight: 700 }}>
                            • {sub.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.subFileActions}>
                    <a
                      href={sub.downloadUrl}
                      className={styles.subFileDlBtn}
                      onClick={() => handleDownloadTrigger(sub.titleFa)}
                      download
                    >
                      <span>📥 دانلود</span>
                    </a>
                    {sub.mirrorUrl && (
                      <a
                        href={sub.mirrorUrl}
                        className={styles.subFileMirrorBtn}
                        onClick={() => handleDownloadTrigger(sub.titleFa)}
                        title="سرور کمکی"
                        download
                      >
                        <span>⚡ کمکی</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </article>
    );
  };

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toast} role="status">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Soft-Gate Notification Banner */}
      {showSoftGateBanner && (
        <aside className={styles.softGateBanner} role="complementary" aria-label="پیشنهاد عضویت رایگان">
          <div className={styles.softGateContent}>
            <span className={styles.softGateIcon}>✨</span>
            <div>
              <h4 className={styles.softGateTitle}>دریافت فایل آغاز شد!</h4>
              <p className={styles.softGateDesc}>
                برای ذخیره سوابق دانلود، نشان کردن منابع و دریافت نمونه‌سوالات جدید دوازدهم، می‌توانید کاملاً رایگان عضو اندورا شوید.
              </p>
            </div>
          </div>
          <div className={styles.softGateActions}>
            <Link href="/auth/register?redirect=/books" className={styles.softGateRegBtn}>
              🔑 عضویت رایگان
            </Link>
            <button
              type="button"
              className={styles.softGateCloseBtn}
              onClick={() => setShowSoftGateBanner(false)}
              aria-label="بستن اعلان"
            >
              ✕
            </button>
          </div>
        </aside>
      )}

      {/* Media Preview Modal */}
      {previewItem && (
        <div className={styles.modalOverlay} onClick={() => setPreviewItem(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalCloseBtn}
              onClick={() => setPreviewItem(null)}
              aria-label="بستن"
            >
              ✕
            </button>
            <div className={styles.modalIcon}>
              {previewItem.format === "video" ? "🎬" : "🎧"}
            </div>
            <h3 className={styles.modalTitle}>پیش‌نمایش آنلاین: {previewItem.titleFa}</h3>
            <p className={styles.modalDesc}>
              {previewItem.format === "video"
                ? "مشاهده نمونه ویدیوی آموزشی با کیفیت عالی و اجرای اساتید بین‌المللی"
                : "شنیدن فایل صوتی نمونه با تلفظ استودیویی گویندگان نیتیو"}
            </p>

            <div className={styles.modalMediaContainer}>
              {previewItem.format === "video" && previewItem.previewUrl ? (
                <video controls autoPlay src={previewItem.previewUrl} />
              ) : previewItem.previewUrl ? (
                <audio controls autoPlay src={previewItem.previewUrl} />
              ) : (
                <p style={{ color: "var(--dl-text-muted)" }}>پیش‌نمایش در حال آماده‌سازی است.</p>
              )}
            </div>

            <div className={styles.modalActions}>
              <a
                href={previewItem.downloadUrl}
                className={styles.modalPrimaryBtn}
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
        </div>
      )}

      {/* Luxury Academic Hero Header (Pure White Canvas) */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.badgeHeader}>
            <span className={styles.badgeHeaderIcon}>🏛️</span>
            <span>آرشیو فاخر و رسمی آموزش زبان انگلیسی • استاندارد آکادمیک</span>
          </div>

          <h1 className={styles.title}>مرجع جامع دانلود منابع زبان انگلیسی</h1>
          <p className={styles.subtitle}>
            آرشیو بزرگ کتب بین‌المللی، رمان‌ها و داستان‌های صوتی سطح‌بندی‌شده، نمونه‌سوالات رسمی امتحانات نهایی، ویدیوهای مستند BBC و کتاب‌های مرجع گرامر با لینک مستقیم و سرور کمکی.
          </p>

          {/* Stats Row */}
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <span className={styles.statItemIcon}>📚</span>
              <span>بیش از <strong>۲۶ عنوان</strong> منبع شاخص</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statItemIcon}>⚡</span>
              <span>لینک‌های <strong>مستقیم و پرسرعت</strong></span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statItemIcon}>💎</span>
              <span><strong>۱۰۰٪ رایگان</strong> با تفکیک کامل اجزا</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statItemIcon}>🔄</span>
              <span>مجهز به <strong>سرور کمکی (Mirror)</strong></span>
            </div>
          </div>

          {/* Search Box */}
          <div className={styles.searchBoxWrapper}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="جستجو در نام کتاب، رمان صوتی، امتحان نهایی دوازدهم، گرامر، انتشارات یا سطح..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className={styles.searchIcon}>🔍</span>
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
      </section>

      {/* Quick Jump Navigation Track (Responsive Multi-Line Wrap - NO Horizontal Scroll) */}
      <nav className={styles.quickJumpTrack} aria-label="دسته‌بندی‌ها و پرش به قفسه‌ها">
        {DOWNLOAD_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              className={`${styles.quickJumpPill} ${isActive ? styles.quickJumpPillActive : ""}`}
              onClick={() => scrollToShelf(cat.id)}
            >
              <span>{cat.icon}</span>
              <span>{cat.labelFa}</span>
              <span className={styles.quickJumpBadge}>
                {cat.id === "all"
                  ? DOWNLOAD_ITEMS.length
                  : DOWNLOAD_ITEMS.filter((i) => i.category === cat.id).length}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Filter Toolbar */}
      <div className={styles.filterBarContainer}>
        <div className={styles.filterBar}>
          <div className={styles.filterGroup}>
            {/* CEFR Level Filter */}
            <label className={styles.filterLabel}>
              سطح آموزشی:
              <select
                className={styles.filterSelect}
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="all">همه سطوح</option>
                <option value="Starter">مبتدی (Starter)</option>
                <option value="A1">سطح A1</option>
                <option value="A2">سطح A2</option>
                <option value="B1">سطح B1</option>
                <option value="B2">سطح B2</option>
                <option value="C1">سطح C1</option>
                <option value="Grade 12">پایه دوازدهم (نهایی)</option>
                <option value="All Levels">جامع (تمام سطوح)</option>
              </select>
            </label>

            {/* Format Filter */}
            <label className={styles.filterLabel}>
              فرمت فایل:
              <select
                className={styles.filterSelect}
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
              >
                <option value="all">همه فرمت‌ها</option>
                <option value="pdf">کتاب الکترونیکی (PDF)</option>
                <option value="archive">بسته جامع فشرده (ZIP)</option>
                <option value="video">ویدیو و مستند (MP4)</option>
                <option value="audio">فایل صوتی و پادکست (MP3)</option>
              </select>
            </label>

            {/* Sort Filter */}
            <label className={styles.filterLabel}>
              مرتب‌سازی:
              <select
                className={styles.filterSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "popular" | "newest" | "title")}
              >
                <option value="popular">پردانلودترین‌ها</option>
                <option value="newest">جدیدترین منابع</option>
                <option value="title">بر اساس عنوان (الفبا)</option>
              </select>
            </label>

            {/* Bookmark Filter Toggle */}
            <button
              type="button"
              className={`${styles.bookmarkFilterBtn} ${onlyBookmarks ? styles.bookmarkFilterBtnActive : ""}`}
              onClick={() => setOnlyBookmarks(!onlyBookmarks)}
            >
              <span>{onlyBookmarks ? "★" : "☆"}</span>
              <span>نشان‌شده‌های من ({bookmarks.length})</span>
            </button>
          </div>

          <div className={styles.filterTotal}>
            نمایش <strong>{filteredItems.length}</strong> منبع از مجموع {DOWNLOAD_ITEMS.length}
            {isSearchOrFilterActive && (
              <button type="button" className={styles.resetFilterBtn} onClick={resetAllFilters}>
                ریست فیلترها
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className={styles.mainLayout}>
        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3>هیچ منبعی با مشخصات انتخاب‌شده یافت نشد!</h3>
            <p>عبارت جستجو را تغییر دهید یا فیلترهای سطح و فرمت را ریست کنید.</p>
            <button type="button" className={styles.quickDlBtn} onClick={resetAllFilters}>
              🔄 ریست تمام فیلترها و نمایش همه منابع
            </button>
          </div>
        )}

        {/* 1. ADAPTIVE MODE: Unified Filtered Grid when user is actively searching or filtering */}
        {isSearchOrFilterActive && filteredItems.length > 0 && (
          <section className={styles.shelfSection}>
            <div className={styles.shelfControlsBar}>
              <div className={styles.shelfControlsTitle}>
                <span>🎯</span>
                <span>نتایج جستجو و فیلتر منابع</span>
              </div>
              <button type="button" className={styles.resetFilterBtn} onClick={resetAllFilters}>
                مشاهده مجدد قفسه‌های کشویی
              </button>
            </div>

            <div className={styles.cardsGrid}>{filteredItems.map(renderCard)}</div>
          </section>
        )}

        {/* 2. DEFAULT SHELVES VIEW: Collapsible Drawers (کشویی) */}
        {!isSearchOrFilterActive && (
          <>
            {/* Featured Showcase Shelf */}
            {featuredItems.length > 0 && (
              <section className={styles.featuredSection}>
                <div className={styles.featuredHeader}>
                  <span className={styles.featuredBadge}>💎 برگزیده‌های طلایی</span>
                  <h2 className={styles.featuredTitle}>داغ‌ترین و پرطرفدارترین منابع این هفته</h2>
                </div>
                <div className={styles.cardsGrid}>{featuredItems.map(renderCard)}</div>
              </section>
            )}

            {/* Global Drawer Control Bar */}
            <div className={styles.shelfControlsBar}>
              <div className={styles.shelfControlsTitle}>
                <span>🗂️</span>
                <span>قفسه‌های دسته‌بندی منابع (کشویی)</span>
              </div>
              <div className={styles.shelfControlsButtons}>
                <button
                  type="button"
                  className={styles.shelfToggleAllBtn}
                  onClick={expandAllShelves}
                >
                  ▼ باز کردن همه
                </button>
                <button
                  type="button"
                  className={styles.shelfToggleAllBtn}
                  onClick={collapseAllShelves}
                >
                  ▲ بستن همه
                </button>
              </div>
            </div>

            {/* Shelf 1: Coursebooks (Collapsible) */}
            {(() => {
              const isOpen = openShelfIds.has("shelf-coursebooks");
              return (
                <section id="shelf-coursebooks" className={styles.shelfSection}>
                  <button
                    type="button"
                    className={`${styles.shelfHeaderBtn} ${isOpen ? styles.shelfHeaderBtnOpen : ""}`}
                    onClick={() => toggleShelf("shelf-coursebooks")}
                    aria-expanded={isOpen}
                  >
                    <div className={styles.shelfHeaderMain}>
                      <div className={styles.shelfIcon}>📚</div>
                      <div>
                        <h2 className={styles.shelfTitle}>کتب آموزشی بین‌المللی (Coursebooks)</h2>
                        <div className={styles.shelfSubtitle}>
                          دوره‌های تحسین‌شده American English File و Speakout ویرایش سوم با کتاب کار، صوت و ویدیو
                        </div>
                      </div>
                    </div>
                    <div className={styles.shelfHeaderRightSide}>
                      <span className={styles.shelfCountBadge}>
                        {itemsByCategory.coursebooks?.length || 0} دوره کامل
                      </span>
                      <span className={`${styles.shelfChevron} ${isOpen ? styles.shelfChevronOpen : ""}`}>
                        ▼
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className={styles.shelfDrawerBody}>
                      <div className={styles.cardsGrid}>
                        {itemsByCategory.coursebooks?.map(renderCard)}
                      </div>
                    </div>
                  )}
                </section>
              );
            })()}

            {/* Shelf 2: Final Exams (Collapsible) */}
            {(() => {
              const isOpen = openShelfIds.has("shelf-final_exams");
              return (
                <section id="shelf-final_exams" className={styles.shelfSection}>
                  <button
                    type="button"
                    className={`${styles.shelfHeaderBtn} ${isOpen ? styles.shelfHeaderBtnOpen : ""}`}
                    onClick={() => toggleShelf("shelf-final_exams")}
                    aria-expanded={isOpen}
                  >
                    <div className={styles.shelfHeaderMain}>
                      <div className={styles.shelfIcon}>📑</div>
                      <div>
                        <h2 className={styles.shelfTitle}>آرشیو رسمی امتحانات نهایی دوازدهم کشوری</h2>
                        <div className={styles.shelfSubtitle}>
                          دفترچه سوالات اصل خرداد و شهریور کلیه رشته‌ها همراه با کلید رسمی مصححین کشوری و فایل صوتی لیسنینگ
                        </div>
                      </div>
                    </div>
                    <div className={styles.shelfHeaderRightSide}>
                      <span className={styles.shelfCountBadge}>
                        {itemsByCategory.final_exams?.length || 0} دوره امتحان
                      </span>
                      <span className={`${styles.shelfChevron} ${isOpen ? styles.shelfChevronOpen : ""}`}>
                        ▼
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className={styles.shelfDrawerBody}>
                      <div className={styles.cardsGrid}>
                        {itemsByCategory.final_exams?.map(renderCard)}
                      </div>
                    </div>
                  )}
                </section>
              );
            })()}

            {/* Shelf 3: Novels & Graded Readers (Collapsible) */}
            {(() => {
              const isOpen = openShelfIds.has("shelf-novels");
              return (
                <section id="shelf-novels" className={styles.shelfSection}>
                  <button
                    type="button"
                    className={`${styles.shelfHeaderBtn} ${isOpen ? styles.shelfHeaderBtnOpen : ""}`}
                    onClick={() => toggleShelf("shelf-novels")}
                    aria-expanded={isOpen}
                  >
                    <div className={styles.shelfHeaderMain}>
                      <div className={styles.shelfIcon}>📖</div>
                      <div>
                        <h2 className={styles.shelfTitle}>رمان‌ها و داستان‌های صوتی سطح‌بندی‌شده</h2>
                        <div className={styles.shelfSubtitle}>
                          شاهکارهای ادبیات جهان (شرلوک هلمز، گتسبی بزرگ، غرور و تعصب) همراه با کتاب گویای استودیویی
                        </div>
                      </div>
                    </div>
                    <div className={styles.shelfHeaderRightSide}>
                      <span className={styles.shelfCountBadge}>
                        {itemsByCategory.novels?.length || 0} رمان صوتی
                      </span>
                      <span className={`${styles.shelfChevron} ${isOpen ? styles.shelfChevronOpen : ""}`}>
                        ▼
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className={styles.shelfDrawerBody}>
                      <div className={styles.cardsGrid}>
                        {itemsByCategory.novels?.map(renderCard)}
                      </div>
                    </div>
                  )}
                </section>
              );
            })()}

            {/* Shelf 4: Skills & Grammar (Collapsible) */}
            {(() => {
              const isOpen = openShelfIds.has("shelf-skills_grammar");
              return (
                <section id="shelf-skills_grammar" className={styles.shelfSection}>
                  <button
                    type="button"
                    className={`${styles.shelfHeaderBtn} ${isOpen ? styles.shelfHeaderBtnOpen : ""}`}
                    onClick={() => toggleShelf("shelf-skills_grammar")}
                    aria-expanded={isOpen}
                  >
                    <div className={styles.shelfHeaderMain}>
                      <div className={styles.shelfIcon}>💡</div>
                      <div>
                        <h2 className={styles.shelfTitle}>گرامر، واژگان و اصطلاحات روزمره</h2>
                        <div className={styles.shelfSubtitle}>
                          منابع مرجع English Grammar in Use، کتاب ۵۰۴ واژه، اصطلاحات آمریکایی و ۴۰۰۰ واژه ضروری
                        </div>
                      </div>
                    </div>
                    <div className={styles.shelfHeaderRightSide}>
                      <span className={styles.shelfCountBadge}>
                        {itemsByCategory.skills_grammar?.length || 0} کتاب مرجع
                      </span>
                      <span className={`${styles.shelfChevron} ${isOpen ? styles.shelfChevronOpen : ""}`}>
                        ▼
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className={styles.shelfDrawerBody}>
                      <div className={styles.cardsGrid}>
                        {itemsByCategory.skills_grammar?.map(renderCard)}
                      </div>
                    </div>
                  )}
                </section>
              );
            })()}

            {/* Shelf 5: Videos & Masterclasses (Collapsible) */}
            {(() => {
              const isOpen = openShelfIds.has("shelf-videos");
              return (
                <section id="shelf-videos" className={styles.shelfSection}>
                  <button
                    type="button"
                    className={`${styles.shelfHeaderBtn} ${isOpen ? styles.shelfHeaderBtnOpen : ""}`}
                    onClick={() => toggleShelf("shelf-videos")}
                    aria-expanded={isOpen}
                  >
                    <div className={styles.shelfHeaderMain}>
                      <div className={styles.shelfIcon}>🎬</div>
                      <div>
                        <h2 className={styles.shelfTitle}>دوره‌ها و ویدیوهای مستند آموزشی</h2>
                        <div className={styles.shelfSubtitle}>
                          آرشیو مستندهای بی‌بی‌سی (BBC)، سریال داستانی Practical English و مسترکلاس درک مطلب
                        </div>
                      </div>
                    </div>
                    <div className={styles.shelfHeaderRightSide}>
                      <span className={styles.shelfCountBadge}>
                        {itemsByCategory.videos?.length || 0} دوره تصویری
                      </span>
                      <span className={`${styles.shelfChevron} ${isOpen ? styles.shelfChevronOpen : ""}`}>
                        ▼
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className={styles.shelfDrawerBody}>
                      <div className={styles.cardsGrid}>
                        {itemsByCategory.videos?.map(renderCard)}
                      </div>
                    </div>
                  )}
                </section>
              );
            })()}
          </>
        )}
      </main>

      {/* ZIP & PDF Extraction Guide Section at Footer */}
      <section className={styles.guideSection}>
        <div className={styles.guideCard}>
          <div className={styles.guideHeader}>
            <span className={styles.guideHeaderIcon}>💡</span>
            <div>
              <h3 className={styles.guideTitle}>راهنمای دانلود و استفاده از فایل‌ها</h3>
              <p style={{ margin: "2px 0 0", color: "var(--dl-text-muted)", fontSize: "0.85rem" }}>
                نکات مهم برای باز کردن آسان فایل‌های فشرده (ZIP) و کتاب‌های الکترونیکی (PDF)
              </p>
            </div>
          </div>

          <div className={styles.guideGrid}>
            <div className={styles.guideItem}>
              <h4 className={styles.guideItemTitle}>📱 در گوشی‌های اندروید (Android)</h4>
              <p className={styles.guideItemDesc}>
                فایل‌های ZIP را می‌توانید با برنامه رایگان <strong>ZArchiver</strong> یا مدیریت فایل خود گوشی (Files by Google) باز کنید. برای خواندن PDFها برنامه Adobe Acrobat یا Google Drive PDF Viewer توصیه می‌شود.
              </p>
            </div>

            <div className={styles.guideItem}>
              <h4 className={styles.guideItemTitle}>🍏 در گوشی‌های آیفون (iOS)</h4>
              <p className={styles.guideItemDesc}>
                پس از دانلود، فایل ZIP را در برنامه پیش‌فرض <strong>Files</strong> باز کنید؛ با یک لمس روی فایل ZIP، پوشه آن به صورت خودکار اکسترکت می‌شود. کتاب‌های PDF در برنامه Books ذخیره می‌شوند.
              </p>
            </div>

            <div className={styles.guideItem}>
              <h4 className={styles.guideItemTitle}>💻 در کامپیوتر و لپ‌تاپ (Windows / Mac)</h4>
              <p className={styles.guideItemDesc}>
                از نرم‌افزارهای استاندارد <strong>WinRAR</strong> یا <strong>7-Zip</strong> استفاده کنید (کلیک راست روی فایل و انتخاب Extract Here). تمام فایل‌های صوتی با کیفیت 320kbps کدگذاری شده‌اند.
              </p>
            </div>

            <div className={styles.guideItem}>
              <h4 className={styles.guideItemTitle}>⚡ سرعت دانلود و سرور کمکی</h4>
              <p className={styles.guideItemDesc}>
                تمام لینک‌های مستقیم از سرورهای اختصاصی پرسرعت با قابلیت Resume پشتیبانی می‌کنند. در صورت مشاهده افت سرعت، روی دکمه <strong>«سرور کمکی»</strong> کلیک نمایید.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./content-cms.module.css";
import {
  ContentCategory,
  ContentItemEditorRecord,
  ContentType,
  CefrLevel,
  LicenseType,
  fetchEditorContentItems,
  createEditorContentItem,
  updateEditorContentItem,
  transitionEditorContentItem,
  deleteEditorContentItem,
} from "../../lib/content-cms";

export function ContentCMSOperations() {
  const [items, setItems] = useState<ContentItemEditorRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCefr, setSelectedCefr] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Partial<ContentItemEditorRecord> | null>(null);
  const [isTransitionModalOpen, setIsTransitionModalOpen] = useState<boolean>(false);
  const [transitionTarget, setTransitionTarget] = useState<ContentItemEditorRecord | null>(null);
  const [transitionAction, setTransitionAction] = useState<"submit_review" | "publish" | "archive" | "revert_draft">("submit_review");
  const [transitionNote, setTransitionNote] = useState<string>("");

  const loadData = () => {
    setLoading(true);
    fetchEditorContentItems({
      category: selectedCategory,
      status: selectedStatus,
      content_type: selectedType,
      cefr: selectedCefr,
      search: searchQuery,
    })
      .then((data) => {
        setItems(data.results);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "خطا در دریافت فهرست محتوا");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let ignore = false;
    fetchEditorContentItems({
      category: selectedCategory,
      status: selectedStatus,
      content_type: selectedType,
      cefr: selectedCefr,
      search: searchQuery,
    })
      .then((data) => {
        if (!ignore) {
          setItems(data.results);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message || "خطا در دریافت فهرست محتوا");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [selectedCategory, selectedStatus, selectedType, selectedCefr, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleCreateNew = () => {
    setEditingItem({
      slug: "",
      title_fa: "",
      title_en: "",
      summary_fa: "",
      summary_en: "",
      category: "grammar",
      content_type: "article",
      status: "draft",
      cefr_level: "B1",
      age_band: "all",
      school_grade: "none",
      content_body_fa: "",
      content_body_en: "",
      learning_objectives: [],
      prerequisites: [],
      audio_url: "",
      audio_duration_seconds: 0,
      video_url: "",
      video_duration_seconds: 0,
      is_premium: false,
      free_preview_excerpt_fa: "",
      free_preview_excerpt_en: "",
      source_attribution: "Endoora Applied Linguistics Board",
      license_type: "original_editorial",
      author_name: "Endoora Editorial Team",
      tags: [],
    });
    setIsEditModalOpen(true);
  };

  const handleEdit = (item: ContentItemEditorRecord) => {
    setEditingItem({ ...item });
    setIsEditModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      if (!editingItem.title_fa?.trim() || !editingItem.title_en?.trim()) {
        throw new Error("عنوان فارسی و انگلیسی محتوا الزامی است.");
      }
      if (!editingItem.slug?.trim()) {
        throw new Error("شناسه اسلاگ محتوا الزامی است.");
      }
      if (!editingItem.source_attribution?.trim() || !editingItem.author_name?.trim()) {
        throw new Error("ذکر مشخصات منبع حق نشر و نام نویسنده الزامی است.");
      }

      if (editingItem.id) {
        await updateEditorContentItem(editingItem.id, editingItem);
        setSuccessMessage(`محتوای «${editingItem.title_fa}» با موفقیت به‌روزرسانی شد.`);
      } else {
        await createEditorContentItem(editingItem);
        setSuccessMessage(`محتوای جدید «${editingItem.title_fa}» ایجاد شد.`);
      }

      setIsEditModalOpen(false);
      setEditingItem(null);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطا در ذخیره محتوا";
      alert(msg);
    }
  };

  const handleOpenTransition = (item: ContentItemEditorRecord) => {
    setTransitionTarget(item);
    setTransitionAction(item.status === "draft" ? "submit_review" : "publish");
    setTransitionNote("");
    setIsTransitionModalOpen(true);
  };

  const handleExecuteTransition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transitionTarget) return;

    try {
      await transitionEditorContentItem(transitionTarget.id, transitionAction, transitionNote);
      setSuccessMessage(`وضعیت محتوای «${transitionTarget.title_fa}» تغییر یافت.`);
      setIsTransitionModalOpen(false);
      setTransitionTarget(null);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطا در تغییر وضعیت گردش کار";
      alert(msg);
    }
  };

  const handleDelete = async (item: ContentItemEditorRecord) => {
    if (!window.confirm(`آیا از حذف دائم محتوای «${item.title_fa}» اطمینان دارید؟`)) {
      return;
    }

    try {
      await deleteEditorContentItem(item.id);
      setSuccessMessage(`محتوای «${item.title_fa}» حذف شد.`);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطا در حذف محتوا";
      alert(msg);
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `endoora-content-export-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // KPIs
  const totalCount = items.length;
  const publishedCount = items.filter((i) => i.status === "published").length;
  const reviewCount = items.filter((i) => i.status === "in_review").length;
  const draftCount = items.filter((i) => i.status === "draft").length;
  const totalViews = items.reduce((acc, curr) => acc + (curr.view_count || 0), 0);

  return (
    <div className={styles.container} dir="rtl">
      {/* 1. Operational Navigation Ribbon */}
      <nav className={styles.operationsNav} aria-label="ناوبری عملیات آموزشی اندورا">
        <Link href="/operations/taxonomy" className={styles.navTab}>
          درخت مهارت‌ها (TAXONOMY-001)
        </Link>
        <Link href="/operations/questions" className={styles.navTab}>
          بانک سوالات نگارش‌دار (QUESTION-001)
        </Link>
        <Link href="/operations/courses" className={styles.navTab}>
          مدیریت دوره‌ها و سیلابس (CONTENT-003)
        </Link>
        <Link href="/operations/content" className={`${styles.navTab} ${styles.navTabActive}`}>
          محتوا، فرهنگ و وبلاگ (CONTENT-004)
          <span className={styles.navBadge}>{totalCount}</span>
        </Link>
        <Link href="/admin" className={styles.navTab}>
          میز مدیریت عملیات (OPS-001)
        </Link>
        <Link href="/operations/flags" className={styles.navTab}>
          کلیدهای ویژگی (OPS-002)
        </Link>
        <Link href="/operations/audit" className={styles.navTab}>
          ردپای ممیزی (OPS-003)
        </Link>
        <Link href="/operations/security" className={styles.navTab}>
          🛡️ امنیت (SEC-001)
        </Link>
        <Link href="/operations/privacy" className={styles.opsTab}>
          🛡️ حریم خصوصی (Privacy)
        </Link>
        <Link href="/operations/pen-test" className={styles.opsTab}>
          🔍 آزمون نفوذ (Pen-Test)
        </Link>
        <Link href="/operations/disaster-recovery" className={styles.opsTab}>
          💾 بازیابی بحران (OPS-004)
        </Link>
      </nav>

      {/* 2. Header Section */}
      <header className={styles.headerSection}>
        <div className={styles.headerTop}>
          <div className={styles.headerTitleBlock}>
            <h1 className={styles.headerTitle}>سامانه مدیریت محتوا، مهارت‌ها و فرهنگ (CONTENT-004)</h1>
            <p className={styles.headerSubtitle}>
              تدوین، بازبینی و نشر مقالات تحلیلی، دروس صوتی/تصویری، محتوای فرهنگی و راهنماهای کنکور با تضمین حق نشر
            </p>
          </div>
          <div className={styles.headerActions}>
            <button onClick={handleExportJson} className={styles.secondaryBtn}>
              خروجی داده (JSON Export)
            </button>
            <button onClick={handleCreateNew} className={styles.primaryBtn}>
              + نگارش محتوای جدید
            </button>
          </div>
        </div>

        {successMessage && (
          <div className={`${styles.alertBox} ${styles.alertSuccess}`}>
            {successMessage}
            <button
              onClick={() => setSuccessMessage(null)}
              style={{ marginInlineStart: "var(--space-3)", background: "none", border: "none", cursor: "pointer" }}
            >
              ✕
            </button>
          </div>
        )}

        {error && (
          <div className={`${styles.alertBox} ${styles.alertError || ""}`} style={{ color: "var(--color-error-text)", background: "var(--color-error-bg)", padding: "var(--space-3)", borderRadius: "var(--radius-sm)", marginBlockStart: "var(--space-2)" }}>
            {error}
            <button
              onClick={() => setError(null)}
              style={{ marginInlineStart: "var(--space-3)", background: "none", border: "none", cursor: "pointer" }}
            >
              ✕
            </button>
          </div>
        )}
      </header>

      {/* 3. Real-time KPIs */}
      <section className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>کل عناوین محتوا</span>
          <span className={styles.kpiValue}>{totalCount}</span>
          <span className={styles.kpiTrend}>پوشش ۸ حوزه مهارتی</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>منتشر شده در پلتفرم</span>
          <span className={styles.kpiValue} style={{ color: "var(--color-success)" }}>
            {publishedCount}
          </span>
          <span className={styles.kpiTrend}>دسترس‌پذیر برای زبان‌آموزان</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>در صف بازبینی تحریریه</span>
          <span className={styles.kpiValue} style={{ color: "var(--color-warning)" }}>
            {reviewCount}
          </span>
          <span className={styles.kpiTrend}>نیازمند تایید سرپرست علمی</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>پیش‌نویس‌های در حال تکمیل</span>
          <span className={styles.kpiValue}>{draftCount}</span>
          <span className={styles.kpiTrend}>آماده‌سازی نگارش</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>مجموع بازدید و مطالعه</span>
          <span className={styles.kpiValue}>{totalViews.toLocaleString("fa-IR")}</span>
          <span className={styles.kpiTrend}>تعامل زبان‌آموزان با مقالات</span>
        </div>
      </section>

      {/* 4. Controls & Filters Bar */}
      <section className={styles.controlsBar}>
        <div className={styles.filtersGroup}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.filterSelect}
            aria-label="فیلتر حوزه مهارتی"
          >
            <option value="all">همه حوزه‌ها (All Skills)</option>
            <option value="grammar">گرامر (Grammar)</option>
            <option value="listening">لیسنینگ (Listening)</option>
            <option value="reading">ریدینگ (Reading)</option>
            <option value="writing">رایتینگ (Writing)</option>
            <option value="speaking">اسپیکینگ (Speaking)</option>
            <option value="vocabulary">واژگان (Vocabulary)</option>
            <option value="culture">فرهنگ و رویدادها (Culture)</option>
            <option value="school">مدارس و کنکور (School/Konkur)</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={styles.filterSelect}
            aria-label="فیلتر نوع محتوا"
          >
            <option value="all">همه قالب‌های محتوا</option>
            <option value="article">مقاله راهنما (Article)</option>
            <option value="audio_lesson">درس صوتی (Audio)</option>
            <option value="video_lesson">درس تصویری (Video)</option>
            <option value="culture_post">پست فرهنگی (Culture)</option>
            <option value="school_guide">راهنمای کنکور (Konkur)</option>
            <option value="practice_quiz">آزمونک تمرینی (Quiz)</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={styles.filterSelect}
            aria-label="فیلتر وضعیت انتشار"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="draft">پیش‌نویس (Draft)</option>
            <option value="in_review">در حال بازبینی (In Review)</option>
            <option value="published">منتشر شده (Published)</option>
            <option value="archived">بایگانی (Archived)</option>
          </select>

          <select
            value={selectedCefr}
            onChange={(e) => setSelectedCefr(e.target.value)}
            className={styles.filterSelect}
            aria-label="فیلتر سطح CEFR"
          >
            <option value="ALL">همه سطوح CEFR</option>
            <option value="A1">A1 - Breakthrough</option>
            <option value="A2">A2 - Elementary</option>
            <option value="B1">B1 - Intermediate</option>
            <option value="B2">B2 - Upper-Intermediate</option>
            <option value="C1">C1 - Advanced</option>
            <option value="C2">C2 - Proficiency</option>
          </select>
        </div>

        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="جستجوی عنوان، اسلاگ، مؤلف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </form>
      </section>

      {/* 5. Content Cards Grid */}
      {loading ? (
        <div style={{ textAlign: "center", paddingBlock: "var(--space-8)" }}>در حال بارگذاری اطلاعات محتوا...</div>
      ) : items.length === 0 ? (
        <div className={styles.emptyState}>
          <h3 className={styles.emptyTitle}>هیچ محتوایی با فیلترهای انتخابی یافت نشد</h3>
          <p className={styles.emptySubtitle}>می‌توانید فیلترها را ریست کنید یا محتوای آموزشی جدیدی ایجاد نمایید.</p>
          <button onClick={handleCreateNew} className={styles.primaryBtn} style={{ marginBlockStart: "var(--space-3)" }}>
            + ایجاد نخستین محتوا
          </button>
        </div>
      ) : (
        <div className={styles.gridContainer}>
          {items.map((item) => {
            const statusClass =
              item.status === "published"
                ? styles.badgeStatusPublished
                : item.status === "in_review"
                ? styles.badgeStatusReview
                : item.status === "archived"
                ? styles.badgeStatusArchived
                : styles.badgeStatusDraft;

            const statusLabel =
              item.status === "published"
                ? "منتشر شده"
                : item.status === "in_review"
                ? "در حال بازبینی"
                : item.status === "archived"
                ? "بایگانی شده"
                : "پیش‌نویس";

            return (
              <div key={item.id} className={styles.contentCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardBadges}>
                    <span className={`${styles.badge} ${styles.badgeCategory}`}>{item.category}</span>
                    <span className={`${styles.badge} ${styles.badgeType}`}>{item.content_type}</span>
                    <span className={`${styles.badge} ${styles.badgeCefr}`}>{item.cefr_level}</span>
                    {item.is_premium && (
                      <span className={`${styles.badge} ${styles.badgePremium}`}>ویژه اشتراکی</span>
                    )}
                    <span className={`${styles.badge} ${statusClass}`}>{statusLabel}</span>
                  </div>

                  <h3 className={styles.contentTitleFa}>{item.title_fa}</h3>
                  <h4 className={styles.contentTitleEn}>{item.title_en}</h4>
                  <p className={styles.contentExcerpt}>{item.summary_fa || item.summary_en || "بدون خلاصه مختصر"}</p>

                  <div className={styles.cardMetaRow}>
                    <div className={styles.metaItem}>
                      <span>مؤلف / هیئت علمی:</span>
                      <strong>{item.author_name}</strong>
                    </div>
                    <div className={styles.metaItem}>
                      <span>حق نشر (Source):</span>
                      <span>{item.source_attribution}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span>شناسه آدرس (Slug):</span>
                      <code style={{ direction: "ltr" }}>{item.slug}</code>
                    </div>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.cardActions}>
                    <button onClick={() => handleEdit(item)} className={styles.actionBtn}>
                      ویرایش
                    </button>
                    <button onClick={() => handleOpenTransition(item)} className={styles.actionBtn}>
                      گردش کار
                    </button>
                    <button onClick={() => handleDelete(item)} className={styles.deleteBtn}>
                      حذف
                    </button>
                  </div>
                  <span style={{ fontSize: "var(--font-size-micro)", color: "var(--color-text-muted)" }}>
                    بازدید: {item.view_count.toLocaleString("fa-IR")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. Edit / Authoring Modal */}
      {isEditModalOpen && editingItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingItem.id ? `ویرایش محتوا: ${editingItem.title_fa}` : "نگارش و ثبت محتوای آموزشی جدید"}
              </h2>
              <button onClick={() => setIsEditModalOpen(false)} className={styles.closeBtn}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItem}>
              <div className={styles.modalBody}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>عنوان فارسی *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.title_fa || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, title_fa: e.target.value })}
                      className={styles.formInput}
                      placeholder="عنوان رسا به فارسی"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>English Title *</label>
                    <input
                      type="text"
                      required
                      dir="ltr"
                      value={editingItem.title_en || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, title_en: e.target.value })}
                      className={styles.formInput}
                      placeholder="English Title"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>شناسه اسلاگ (Slug) *</label>
                    <input
                      type="text"
                      required
                      dir="ltr"
                      value={editingItem.slug || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value.toLowerCase() })}
                      className={styles.formInput}
                      placeholder="kebab-case-identifier"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>حوزه مهارتی (Category) *</label>
                    <select
                      value={editingItem.category || "grammar"}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as ContentCategory })}
                      className={styles.formSelect}
                    >
                      <option value="grammar">گرامر (Grammar)</option>
                      <option value="listening">لیسنینگ (Listening)</option>
                      <option value="reading">ریدینگ (Reading)</option>
                      <option value="writing">رایتینگ (Writing)</option>
                      <option value="speaking">اسپیکینگ (Speaking)</option>
                      <option value="vocabulary">واژگان (Vocabulary)</option>
                      <option value="culture">فرهنگ و رویدادها (Culture)</option>
                      <option value="school">مدارس و کنکور (School/Konkur)</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>قالب رسانه‌ای (Content Type) *</label>
                    <select
                      value={editingItem.content_type || "article"}
                      onChange={(e) => setEditingItem({ ...editingItem, content_type: e.target.value as ContentType })}
                      className={styles.formSelect}
                    >
                      <option value="article">مقاله / راهنمای غنی (Article)</option>
                      <option value="audio_lesson">درس صوتی و پادکست (Audio Lesson)</option>
                      <option value="video_lesson">درس تصویری (Video Lesson)</option>
                      <option value="culture_post">پست فرهنگی و مناسبتی (Culture Post)</option>
                      <option value="school_guide">راهنمای درسی کنکور (School Guide)</option>
                      <option value="practice_quiz">آزمونک تمرینی (Practice Quiz)</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>سطح استاندارد CEFR *</label>
                    <select
                      value={editingItem.cefr_level || "B1"}
                      onChange={(e) => setEditingItem({ ...editingItem, cefr_level: e.target.value as CefrLevel })}
                      className={styles.formSelect}
                    >
                      <option value="A1">A1 - Breakthrough</option>
                      <option value="A2">A2 - Elementary</option>
                      <option value="B1">B1 - Intermediate</option>
                      <option value="B2">B2 - Upper-Intermediate</option>
                      <option value="C1">C1 - Advanced</option>
                      <option value="C2">C2 - Proficiency</option>
                      <option value="ALL">همه سطوح (All)</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>خلاصه و معرفی فارسی</label>
                  <textarea
                    value={editingItem.summary_fa || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, summary_fa: e.target.value })}
                    className={styles.formTextarea}
                    rows={2}
                    placeholder="توضیح مختصر ۱ الی ۲ جمله‌ای برای کارت‌ها و پیش‌نمایش"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>متن کامل و تفصیلی آموزش (Persian Explanation & Markdown)</label>
                  <textarea
                    value={editingItem.content_body_fa || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, content_body_fa: e.target.value })}
                    className={styles.formTextarea}
                    rows={6}
                    placeholder="توضیحات آموزشی، مثال‌ها، نکات تحلیلی..."
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>English Body & Examples (Markdown)</label>
                  <textarea
                    dir="ltr"
                    value={editingItem.content_body_en || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, content_body_en: e.target.value })}
                    className={styles.formTextarea}
                    rows={4}
                    placeholder="English passages, dialogues, vocabulary examples..."
                  />
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>آدرس فایل صوتی (Audio URL)</label>
                    <input
                      type="url"
                      dir="ltr"
                      value={editingItem.audio_url || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, audio_url: e.target.value })}
                      className={styles.formInput}
                      placeholder="https://media.endoora.ir/audio/..."
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>آدرس فایل ویدیویی (Video URL)</label>
                    <input
                      type="url"
                      dir="ltr"
                      value={editingItem.video_url || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, video_url: e.target.value })}
                      className={styles.formInput}
                      placeholder="https://media.endoora.ir/video/..."
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={editingItem.is_premium || false}
                      onChange={(e) => setEditingItem({ ...editingItem, is_premium: e.target.checked })}
                    />
                    محتوای ویژه اشتراکی (نیازمند عضویت ویژه جهت دسترسی کامل)
                  </label>
                </div>

                {editingItem.is_premium && (
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>بخش پیش‌نمایش رایگان (Free Preview Excerpt) *</label>
                    <textarea
                      value={editingItem.free_preview_excerpt_fa || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, free_preview_excerpt_fa: e.target.value })}
                      className={styles.formTextarea}
                      rows={2}
                      placeholder="این بخش بدون ورود یا اشتراک برای عموم زبان‌آموزان نمایش داده می‌شود."
                    />
                  </div>
                )}

                {/* Mandatory Licensing & Attribution Gate */}
                <div style={{ padding: "var(--space-3)", backgroundColor: "var(--color-surface-subtle)", borderRadius: "var(--radius-card)", border: "1px solid var(--color-border)" }}>
                  <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-small)", fontWeight: 700 }}>
                    الزامات حقوق مالکیت فکری و انتساب منبع (Mandatory Copyright)
                  </h4>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>نام مؤلف / عضو هیئت علمی *</label>
                      <input
                        type="text"
                        required
                        value={editingItem.author_name || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, author_name: e.target.value })}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>ذکر مشخصات منبع (Source Attribution) *</label>
                      <input
                        type="text"
                        required
                        value={editingItem.source_attribution || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, source_attribution: e.target.value })}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>نوع لایسنس انتشار *</label>
                      <select
                        value={editingItem.license_type || "original_editorial"}
                        onChange={(e) => setEditingItem({ ...editingItem, license_type: e.target.value as LicenseType })}
                        className={styles.formSelect}
                      >
                        <option value="original_editorial">تولید اختصاصی هیئت علمی اندورا (Original Editorial)</option>
                        <option value="cc_by_sa">کریتیو کامنز با ذکر منبع (CC BY-SA)</option>
                        <option value="public_domain">مالکیت عمومی (Public Domain)</option>
                        <option value="educational_fair_use">استفاده منصفانه آموزشی (Educational Fair Use)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className={styles.secondaryBtn}>
                  انصراف
                </button>
                <button type="submit" className={styles.primaryBtn}>
                  ذخیره اطلاعات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Transition Workflow Modal */}
      {isTransitionModalOpen && transitionTarget && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer} style={{ maxInlineSize: "560px" }}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>تغییر وضعیت گردش کار تحریریه</h2>
              <button onClick={() => setIsTransitionModalOpen(false)} className={styles.closeBtn}>
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteTransition}>
              <div className={styles.modalBody}>
                <p style={{ margin: 0, fontSize: "var(--font-size-small)" }}>
                  تغییر وضعیت محتوای <strong>«{transitionTarget.title_fa}»</strong> (وضعیت فعلی:{" "}
                  <strong>{transitionTarget.status}</strong>)
                </p>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>اقدام گردش کار *</label>
                  <select
                    value={transitionAction}
                    onChange={(e) => setTransitionAction(e.target.value as "submit_review" | "publish" | "archive" | "revert_draft")}
                    className={styles.formSelect}
                  >
                    <option value="submit_review">ارسال برای بازبینی (Submit for Review)</option>
                    <option value="publish">انتشار نهایی در پلتفرم (Publish)</option>
                    <option value="archive">بایگانی کردن (Archive)</option>
                    <option value="revert_draft">بازگشت به پیش‌نویس (Revert to Draft)</option>
                  </select>
                </div>

                {transitionAction === "publish" && (
                  <div className={`${styles.alertBox} ${styles.alertWarning}`}>
                    توجه: هنگام انتشار، انتساب دقیق منبع، نام مؤلف، و وجود بخش پیش‌نمایش در محتواهای ویژه بررسی خواهد شد.
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>یادداشت تحریریه (اختیاری جهت ثبت ممیزی)</label>
                  <textarea
                    value={transitionNote}
                    onChange={(e) => setTransitionNote(e.target.value)}
                    className={styles.formTextarea}
                    rows={3}
                    placeholder="دلایل تایید یا تغییر وضعیت..."
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setIsTransitionModalOpen(false)} className={styles.secondaryBtn}>
                  انصراف
                </button>
                <button type="submit" className={styles.primaryBtn}>
                  ثبت و اعمال تغییر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

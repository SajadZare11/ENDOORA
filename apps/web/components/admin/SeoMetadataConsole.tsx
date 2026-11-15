"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./seo-metadata.module.css";
import {
  type PageSeoMetadata,
  type UrlRedirectRule,
  type SchemaJsonLdItem,
  type SeoStudioStats,
  type RobotsDirective,
  type RedirectType,
  ROBOTS_LABELS,
  REDIRECT_TYPE_LABELS,
} from "@/lib/seo-metadata-content";

export function SeoMetadataConsole() {
  const [activeTab, setActiveTab] = useState<"meta" | "redirects" | "schemas">("meta");
  const [pages, setPages] = useState<PageSeoMetadata[]>([]);
  const [redirects, setRedirects] = useState<UrlRedirectRule[]>([]);
  const [schemas, setSchemas] = useState<SchemaJsonLdItem[]>([]);
  const [stats, setStats] = useState<SeoStudioStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Active Selected Page
  const [selectedPath, setSelectedPath] = useState("/");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [robotsDirective, setRobotsDirective] = useState<RobotsDirective>("index_follow");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImageUrl, setOgImageUrl] = useState("");

  // New Redirect Form
  const [newSource, setNewSource] = useState("");
  const [newDest, setNewDest] = useState("");
  const [newType, setNewType] = useState<RedirectType>("301_permanent");
  const [newNotes, setNewNotes] = useState("");

  // Active Schema Viewer
  const [selectedSchemaId, setSelectedSchemaId] = useState("");

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/seo");
      const json = await res.json();
      if (json.success) {
        setPages(json.data.pages);
        setRedirects(json.data.redirects);
        setSchemas(json.data.schemas);
        setStats(json.data.stats);

        // Pre-fill active page meta
        const targetPage = json.data.pages.find((p: PageSeoMetadata) => p.pagePath === selectedPath) || json.data.pages[0];
        if (targetPage) {
          setSelectedPath(targetPage.pagePath);
          setMetaTitle(targetPage.metaTitle);
          setMetaDescription(targetPage.metaDescription);
          setCanonicalUrl(targetPage.canonicalUrl);
          setRobotsDirective(targetPage.robotsDirective);
          setOgTitle(targetPage.ogTitle);
          setOgDescription(targetPage.ogDescription);
          setOgImageUrl(targetPage.ogImageUrl);
        }

        if (json.data.schemas.length > 0 && !selectedSchemaId) {
          setSelectedSchemaId(json.data.schemas[0].id);
        }
      } else {
        showToast(json.error || "خطا در واکشی داده‌های سئو", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "خطای ارتباط با سرور", "error");
    } finally {
      setLoading(false);
    }
  }, [selectedPath, selectedSchemaId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSelectPage = (path: string) => {
    setSelectedPath(path);
    const p = pages.find((page) => page.pagePath === path);
    if (p) {
      setMetaTitle(p.metaTitle);
      setMetaDescription(p.metaDescription);
      setCanonicalUrl(p.canonicalUrl);
      setRobotsDirective(p.robotsDirective);
      setOgTitle(p.ogTitle);
      setOgDescription(p.ogDescription);
      setOgImageUrl(p.ogImageUrl);
    }
  };

  const handleSavePageMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metaTitle.trim() || !metaDescription.trim()) {
      showToast("لطفاً عنوان و توضیحات متا را تکمیل فرمایید.", "error");
      return;
    }
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_page_meta",
          pagePath: selectedPath,
          updates: {
            metaTitle,
            metaDescription,
            canonicalUrl,
            robotsDirective,
            ogTitle: ogTitle || metaTitle,
            ogDescription: ogDescription || metaDescription,
            ogImageUrl,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        loadData();
      } else {
        showToast(data.error || "خطا در ذخیره متادیتا", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "خطا در برقراری ارتباط", "error");
    }
  };

  const handleCreateRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource.trim() || !newDest.trim()) {
      showToast("لطفاً آدرس مبدا و مقصد ریدایرکت را وارد نمایید.", "error");
      return;
    }
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_redirect",
          sourcePath: newSource,
          destinationPath: newDest,
          redirectType: newType,
          notes: newNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`قاعده ریدایرکت با موفقیت ایجاد گردید.`, "success");
        setNewSource("");
        setNewDest("");
        setNewNotes("");
        loadData();
      } else {
        showToast(data.error || "خطا در ایجاد ریدایرکت", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "خطای ارتباط با سرور", "error");
    }
  };

  const handleToggleRedirect = async (ruleId: string, currentActive: boolean) => {
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_redirect", ruleId, isActive: !currentActive }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        loadData();
      } else {
        showToast(data.error || "خطا در تغییر وضعیت", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "خطای ارتباط", "error");
    }
  };

  const handleDeleteRedirect = async (ruleId: string) => {
    if (!confirm("آیا از حذف این قاعده ریدایرکت اطمینان دارید؟")) {
      return;
    }
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_redirect", ruleId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        loadData();
      } else {
        showToast(data.error || "خطا در حذف", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "خطای ارتباط", "error");
    }
  };

  const handleCopyJson = (payload: any) => {
    try {
      navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      showToast("کد اسکیما JSON-LD در کلیپ‌بورد کپی شد.", "success");
    } catch (err) {
      showToast("امکان کپی در کلیپ‌بورد فراهم نشد.", "error");
    }
  };

  const handleResetSeed = async () => {
    if (!confirm("آیا مایلید تمام تنظیمات سئو، ریدایرکت‌ها و اسکیماها به حالت اولیه آزمایشی بازنشانی شوند؟")) {
      return;
    }
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_seed" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        loadData();
      } else {
        showToast(data.error || "خطا در بازنشانی", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "خطا در بازنشانی داده‌ها", "error");
    }
  };

  const activeSchema = schemas.find((s) => s.id === selectedSchemaId) || schemas[0];

  return (
    <div className={styles.container}>
      {/* Toast Alert */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            left: "24px",
            zIndex: 9999,
            backgroundColor: toast.type === "success" ? "#10b981" : "#ef4444",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "10px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            fontWeight: 700,
            fontSize: "0.9rem",
            direction: "rtl",
          }}
        >
          {toast.message}
        </div>
      )}

      {/* Header Card */}
      <div className={styles.headerCard}>
        <div className={styles.headerInfo}>
          <h2 className={styles.headerTitle}>
            <span>🌐</span>
            موتور سئو، مدیریت متادیتا، ریدایرکت‌ها و داده‌های ساختاریافته (SEO & Meta Studio)
          </h2>
          <p className={styles.headerDesc}>
            مدیریت تگ‌های عنوان و توضیحات متا، شبیه‌ساز زنده گوگل و سوشال، موتور تغییر مسیرهای ۳۰۱/۳۰۲ و تولید اسکیماهای JSON-LD.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnResetSeed} onClick={handleResetSeed} title="بازنشانی دیتای اولیه">
            <span>🔄</span>
            بازنشانی دیتای اولیه
          </button>
          <button className={styles.btnRefresh} onClick={loadData}>
            <span>⚡</span>
            به‌روزرسانی
          </button>
        </div>
      </div>

      {/* Stats Summary Cards Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399" }}>
            📄
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>صفحات بهینه‌شده سئو</p>
            <p className={styles.statValue}>{stats?.totalPagesConfigured ?? "..."}</p>
            <p className={styles.statSubtext}>دارای متادیتای اختصاصی</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(59, 130, 246, 0.15)", color: "#38bdf8" }}>
            🔀
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>قوانین ریدایرکت فعال</p>
            <p className={styles.statValue}>{stats?.totalActiveRedirects ?? "..."}</p>
            <p className={styles.statSubtext}>سپر محافظتی خطای ۴۰۴</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" }}>
            🎯
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>کلیک‌های هدایت‌شده (Hits)</p>
            <p className={styles.statValue}>{(stats?.totalRedirectHits || 0).toLocaleString("fa-IR")}</p>
            <p className={styles.statSubtext}>ترافیک حفظ‌شده ورودی</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(168, 85, 247, 0.15)", color: "#c084fc" }}>
            💎
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>اسکیماهای فعال در گوگل</p>
            <p className={styles.statValue}>{stats?.totalSchemasGenerated ?? "..."}</p>
            <p className={styles.statSubtext}>ریچ اسنیپت دوره‌ها و FAQ</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(236, 72, 153, 0.15)", color: "#f472b6" }}>
            📏
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>طول بهینه عناوین و توضیحات</p>
            <p className={styles.statValue} style={{ fontSize: "1.1rem" }}>
              {stats?.avgTitleLength || 0} / {stats?.avgDescLength || 0} حرف
            </p>
            <p className={styles.statSubtext}>منطبق با استاندارد SERP</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabsBar}>
        <button
          className={`${styles.tabBtn} ${activeTab === "meta" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("meta")}
        >
          <span>🔍</span>
          استودیوی تگ‌های متا و شبیه‌ساز گوگل
          <span className={styles.tabBadge}>{pages.length} صفحه</span>
        </button>

        <button
          className={`${styles.tabBtn} ${activeTab === "redirects" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("redirects")}
        >
          <span>🔀</span>
          موتور مدیریت ریدایرکت‌های ۳۰۱/۳۰۲
          <span className={styles.tabBadge}>{redirects.length} قاعده</span>
        </button>

        <button
          className={`${styles.tabBtn} ${activeTab === "schemas" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("schemas")}
        >
          <span>🧬</span>
          داده‌های ساختاریافته اسکیما (JSON-LD)
          <span className={styles.tabBadge}>{schemas.length} اسکیما</span>
        </button>
      </div>

      {/* TAB 1: PAGE META & SERP SIMULATOR */}
      {activeTab === "meta" && (
        <div className={styles.deskLayout}>
          {/* Left: Meta Editor Form */}
          <div className={styles.cardPanel}>
            <h3 className={styles.panelTitle}>
              <span>⚙️</span>
              تنظیمات متادیتای صفحه: {pages.find((p) => p.pagePath === selectedPath)?.pageLabel || selectedPath}
            </h3>

            {/* Page Selector */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>انتخاب صفحه جهت بهینه‌سازی:</label>
              <select
                className={styles.selectInput}
                value={selectedPath}
                onChange={(e) => handleSelectPage(e.target.value)}
              >
                {pages.map((p) => (
                  <option key={p.pagePath} value={p.pagePath}>
                    {p.pageLabel} ({p.pagePath})
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleSavePageMeta} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Meta Title with Live Character Counter */}
              <div className={styles.formGroup}>
                <div className={styles.formLabelRow}>
                  <label className={styles.formLabel}>عنوان متا (Meta Title):</label>
                  <span
                    className={`${styles.charCounter} ${
                      metaTitle.length >= 45 && metaTitle.length <= 65 ? styles.charOptimal : styles.charWarning
                    }`}
                  >
                    {metaTitle.length} / ۶۰ کاراکتر {metaTitle.length >= 45 && metaTitle.length <= 65 ? "✓ ایده‌آل" : ""}
                  </span>
                </div>
                <input
                  type="text"
                  className={styles.formInput}
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="عنوان جذاب صفحه در نتایج گوگل..."
                  required
                />
              </div>

              {/* Meta Description with Live Character Counter */}
              <div className={styles.formGroup}>
                <div className={styles.formLabelRow}>
                  <label className={styles.formLabel}>توضیحات متا (Meta Description):</label>
                  <span
                    className={`${styles.charCounter} ${
                      metaDescription.length >= 120 && metaDescription.length <= 165
                        ? styles.charOptimal
                        : styles.charWarning
                    }`}
                  >
                    {metaDescription.length} / ۱۵۵ کاراکتر {metaDescription.length >= 120 && metaDescription.length <= 165 ? "✓ ایده‌آل" : ""}
                  </span>
                </div>
                <textarea
                  className={styles.formTextarea}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="توضیحات خلاصه و جذاب صفحه برای ترغیب کلیک در سرچ گوگل..."
                  required
                />
              </div>

              {/* Canonical URL & Robots Directive */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1rem" }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>آدرس یکتا (Canonical URL):</label>
                  <input
                    type="url"
                    className={styles.formInput}
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    placeholder="https://endoora.com/..."
                    style={{ direction: "ltr", textAlign: "right" }}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>دستورات ربات‌ها (Robots Directive):</label>
                  <select
                    className={styles.selectInput}
                    value={robotsDirective}
                    onChange={(e) => setRobotsDirective(e.target.value as RobotsDirective)}
                  >
                    <option value="index_follow">Index, Follow (نمایه‌سازی کامل)</option>
                    <option value="noindex_follow">NoIndex, Follow (عدم ثبت در گوگل)</option>
                    <option value="noindex_nofollow">NoIndex, NoFollow (مسدودسازی کامل)</option>
                  </select>
                </div>
              </div>

              {/* OpenGraph Image URL */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>تصویر اشتراک‌گذاری اجتماعی (OpenGraph Image URL):</label>
                <input
                  type="url"
                  className={styles.formInput}
                  value={ogImageUrl}
                  onChange={(e) => setOgImageUrl(e.target.value)}
                  placeholder="https://endoora.com/og/...png (1200x630)"
                  style={{ direction: "ltr", textAlign: "right" }}
                />
              </div>

              <button type="submit" className={styles.btnSaveMeta}>
                <span>💾</span>
                ذخیره متادیتای سئوی صفحه
              </button>
            </form>
          </div>

          {/* Right: SERP & Social Preview Mockups */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Google SERP Simulator */}
            <div>
              <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8" }}>
                شبیه‌ساز زنده نمایش در موتور جستجوی گوگل (Google SERP):
              </p>
              <div className={styles.serpSimulatorCard}>
                <div className={styles.serpUrlRow}>
                  <div className={styles.serpFavicon}>E</div>
                  <div>
                    <span className={styles.serpSiteName}>Endoora</span>
                    <span style={{ margin: "0 4px", color: "#5f6368" }}>›</span>
                    <span>{selectedPath === "/" ? "endoora.com" : `endoora.com${selectedPath}`}</span>
                  </div>
                </div>

                <h3 className={styles.serpTitle}>
                  {metaTitle || "عنوان صفحه در این قسمت نمایش داده خواهد شد"}
                </h3>

                <p className={styles.serpSnippet}>
                  {metaDescription || "توضیحات متای صفحه در نتایج جستجوی کاربران گوگل به این صورت نمایش داده می‌شود..."}
                </p>
              </div>
            </div>

            {/* Social Share Mockup (Telegram / WhatsApp / Twitter) */}
            <div>
              <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8" }}>
                پیش‌نمایش کارت اشتراک در پیام‌رسان‌ها (OpenGraph Card):
              </p>
              <div className={styles.socialMockupCard}>
                <div
                  className={styles.socialImagePreview}
                  style={ogImageUrl ? { backgroundImage: `url(${ogImageUrl})` } : {}}
                >
                  {!ogImageUrl && "📷 تصویر اشتراک‌گذاری اجتماعی (1200x630)"}
                </div>
                <div className={styles.socialContent}>
                  <span className={styles.socialDomain}>endoora.com</span>
                  <h4 className={styles.socialTitle}>{ogTitle || metaTitle || "عنوان اشتراک"}</h4>
                  <p className={styles.socialDesc}>
                    {ogDescription || metaDescription || "توضیحات کارت اشتراک در تلگرام و واتساپ..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REDIRECTS ENGINE */}
      {activeTab === "redirects" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Add Redirect Form Bar */}
          <form onSubmit={handleCreateRedirect} className={styles.redirectFormBar}>
            <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#f8fafc" }}>
              افزودن تغییر مسیر جدید (Add New Redirect Rule):
            </h4>
            <div className={styles.redirectInputsRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>مسیر مبدا (Source):</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="مثال: /old-courses/pack"
                  style={{ direction: "ltr", textAlign: "right" }}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>مسیر مقصد (Destination):</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={newDest}
                  onChange={(e) => setNewDest(e.target.value)}
                  placeholder="مثال: /courses/ielts"
                  style={{ direction: "ltr", textAlign: "right" }}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>نوع ریدایرکت:</label>
                <select
                  className={styles.selectInput}
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as RedirectType)}
                >
                  <option value="301_permanent">301 - دائمی (Permanent)</option>
                  <option value="302_temporary">302 - موقت (Temporary)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>یادداشت اختیاری:</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="علت تغییر مسیر..."
                />
              </div>

              <button type="submit" className={styles.btnAddRedirect}>
                <span>➕</span>
                ثبت ریدایرکت
              </button>
            </div>
          </form>

          {/* Redirects Table */}
          <div className={styles.tableCard}>
            <div className={styles.tableCardHeader}>
              <h3 className={styles.tableCardTitle}>
                <span>🔀</span>
                فهرست ریدایرکت‌های فعال و آمار بازدید (Redirect Rules & Hit Analytics)
              </h3>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>مسیر مبدا (Source URL)</th>
                    <th>مسیر مقصد (Destination URL)</th>
                    <th>نوع</th>
                    <th>کلیک‌های هدایت‌شده</th>
                    <th>وضعیت</th>
                    <th>توضیحات</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {redirects.length === 0 ? (
                    <tr>
                      <td colSpan={7} className={styles.emptyState}>
                        {loading ? "در حال دریافت ریدایرکت‌ها..." : "هیچ قاعده ریدایرکتی ثبت نشده است."}
                      </td>
                    </tr>
                  ) : (
                    redirects.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <code style={{ fontSize: "0.85rem", color: "#f87171", direction: "ltr", textAlign: "right" }}>
                            {r.sourcePath}
                          </code>
                        </td>

                        <td>
                          <code style={{ fontSize: "0.85rem", color: "#34d399", direction: "ltr", textAlign: "right" }}>
                            {r.destinationPath}
                          </code>
                        </td>

                        <td>
                          <span
                            className={`${styles.badge} ${
                              r.redirectType === "301_permanent" ? styles.badge301 : styles.badge302
                            }`}
                          >
                            {REDIRECT_TYPE_LABELS[r.redirectType].badge}
                          </span>
                        </td>

                        <td>
                          <span style={{ fontWeight: 800, color: "#38bdf8" }}>
                            {r.hitCount.toLocaleString("fa-IR")} مرتبه
                          </span>
                        </td>

                        <td>
                          <span
                            className={`${styles.badge} ${r.isActive ? styles.badgeActive : styles.badgeInactive}`}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleToggleRedirect(r.id, r.isActive)}
                            title="کلیک برای فعال/غیرفعال‌سازی"
                          >
                            {r.isActive ? "فعال" : "غیرفعال"}
                          </span>
                        </td>

                        <td>
                          <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>{r.notes || "-"}</span>
                        </td>

                        <td>
                          <button
                            className={styles.btnActionDelete}
                            onClick={() => handleDeleteRedirect(r.id)}
                            title="حذف دائمی قاعده"
                          >
                            🗑️ حذف
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STRUCTURED DATA & SCHEMA STUDIO */}
      {activeTab === "schemas" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Schemas List Cards */}
          <div className={styles.schemaListGrid}>
            {schemas.map((s) => (
              <div
                key={s.id}
                className={`${styles.schemaCard} ${selectedSchemaId === s.id ? styles.schemaCardActive : ""}`}
                onClick={() => setSelectedSchemaId(s.id)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "#f8fafc" }}>{s.title}</span>
                  <span className={`${styles.badge} ${styles.badge301}`}>{s.schemaType}</span>
                </div>
                <span style={{ fontSize: "0.775rem", color: "#94a3b8" }}>
                  مسیر صفحه: <code style={{ color: "#38bdf8" }}>{s.pagePath}</code>
                </span>
              </div>
            ))}
          </div>

          {/* Schema Code Viewer */}
          {activeSchema && (
            <div className={styles.cardPanel}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#f8fafc" }}>
                    کد JSON-LD معتبر اسکیما ({activeSchema.schemaType}):
                  </h4>
                  <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "#94a3b8" }}>
                    این کد به صورت خودکار در بخش &lt;head&gt; صفحه {activeSchema.pagePath} تزریق می‌شود.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className={styles.btnActionCopy}
                    onClick={() => handleCopyJson(activeSchema.jsonLdPayload)}
                  >
                    📋 کپی کد JSON-LD
                  </button>
                  <a
                    href="https://search.google.com/test/rich-results"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.btnActionCopy}
                    style={{ textDecoration: "none", color: "#38bdf8" }}
                  >
                    🌐 اعتبارسنجی با Google Rich Results Test ↗
                  </a>
                </div>
              </div>

              <pre className={styles.codeViewer}>
                {JSON.stringify(activeSchema.jsonLdPayload, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

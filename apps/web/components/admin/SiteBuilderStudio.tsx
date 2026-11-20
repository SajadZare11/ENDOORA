"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./site-builder-studio.module.css";
import {
  CustomDynamicPage,
  PageBlock,
  PageBlockType,
  NavigationMenuConfig,
  NavItem,
  FooterColumn,
  SitePopupConfig,
  PopupType,
  GlobalThemeConfig,
  INITIAL_CUSTOM_PAGES,
  INITIAL_NAVIGATION_CONFIG,
  INITIAL_SITE_POPUPS,
  INITIAL_GLOBAL_THEME,
} from "../../lib/admin-site-builder-store";
import { DynamicPageRenderer } from "../marketing/DynamicPageRenderer";

export type SiteBuilderSubTab = "pages" | "menus" | "popups" | "theme";

export function SiteBuilderStudio() {
  const [activeSubTab, setActiveSubTab] = useState<SiteBuilderSubTab>("pages");
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // -------------------------------------------------------------
  // Sub-Tab 1: Custom Pages State
  // -------------------------------------------------------------
  const [pages, setPages] = useState<CustomDynamicPage[]>(INITIAL_CUSTOM_PAGES);
  const [searchPageQuery, setSearchPageQuery] = useState<string>("");
  const [filterPageStatus, setFilterPageStatus] = useState<string>("all");
  const [isPageModalOpen, setIsPageModalOpen] = useState<boolean>(false);
  const [editingPage, setEditingPage] = useState<CustomDynamicPage | null>(null);
  const [previewDrawerPage, setPreviewDrawerPage] = useState<CustomDynamicPage | null>(null);

  // Page Form Data
  const [pageFormData, setPageFormData] = useState<Partial<CustomDynamicPage>>({
    slug: "",
    titleFa: "",
    titleEn: "",
    metaTitleFa: "",
    metaDescriptionFa: "",
    status: "draft",
    blocks: [],
  });

  // Block Modal inside Page Editor
  const [isBlockModalOpen, setIsBlockModalOpen] = useState<boolean>(false);
  const [selectedBlockType, setSelectedBlockType] = useState<PageBlockType>("hero");

  // -------------------------------------------------------------
  // Sub-Tab 2: Navigation & Menus State
  // -------------------------------------------------------------
  const [draftMenu, setDraftMenu] = useState<NavigationMenuConfig>(INITIAL_NAVIGATION_CONFIG);
  const [liveMenu, setLiveMenu] = useState<NavigationMenuConfig>(INITIAL_NAVIGATION_CONFIG);
  const [menuHistory, setMenuHistory] = useState<NavigationMenuConfig[]>([INITIAL_NAVIGATION_CONFIG]);
  const [isNavModalOpen, setIsNavModalOpen] = useState<boolean>(false);
  const [editingNavItem, setEditingNavItem] = useState<NavItem | null>(null);
  const [navFormData, setNavFormData] = useState<Partial<NavItem>>({
    fa: "",
    en: "",
    path: "/",
    badgeTextFa: "",
    badgeColor: "#16a34a",
    order: 1,
  });

  // -------------------------------------------------------------
  // Sub-Tab 3: Popups & Floating Banners State
  // -------------------------------------------------------------
  const [popups, setPopups] = useState<SitePopupConfig[]>(INITIAL_SITE_POPUPS);
  const [isPopupModalOpen, setIsPopupModalOpen] = useState<boolean>(false);
  const [editingPopup, setEditingPopup] = useState<SitePopupConfig | null>(null);
  const [popupFormData, setPopupFormData] = useState<Partial<SitePopupConfig>>({
    titleFa: "",
    titleEn: "",
    type: "center_modal",
    isActive: true,
    messageFa: "",
    messageEn: "",
    couponCode: "",
    ctaTextFa: "مشاهده پیشنهاد",
    ctaUrl: "/pricing",
    triggerType: "time_delay",
    triggerDelaySeconds: 3,
    triggerScrollPercent: 50,
    targetPaths: ["*"],
    frequencyCap: "once_per_session",
  });
  const [simulatedPopup, setSimulatedPopup] = useState<SitePopupConfig | null>(null);

  // -------------------------------------------------------------
  // Sub-Tab 4: Global Theme & Custom Code State
  // -------------------------------------------------------------
  const [themeConfig, setThemeConfig] = useState<GlobalThemeConfig>(INITIAL_GLOBAL_THEME);
  const [isSavingTheme, setIsSavingTheme] = useState<boolean>(false);

  const showToast = (text: string, type: "success" | "error" | "info" = "info") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4500);
  };

  // Fetch initial data
  const fetchData = async () => {
    try {
      // 1. Pages
      const pagesRes = await fetch("/api/admin/site-builder/pages");
      if (pagesRes.ok) {
        const json = await pagesRes.json();
        if (json.success && json.pages) setPages(json.pages);
      }

      // 2. Menus
      const menusRes = await fetch("/api/admin/site-builder/menus");
      if (menusRes.ok) {
        const json = await menusRes.json();
        if (json.success) {
          if (json.draft) setDraftMenu(json.draft);
          if (json.live) setLiveMenu(json.live);
          if (json.history) setMenuHistory(json.history);
        }
      }

      // 3. Popups
      const popupsRes = await fetch("/api/admin/site-builder/popups");
      if (popupsRes.ok) {
        const json = await popupsRes.json();
        if (json.success && json.popups) setPopups(json.popups);
      }

      // 4. Theme
      const themeRes = await fetch("/api/admin/site-builder/theme");
      if (themeRes.ok) {
        const json = await themeRes.json();
        if (json.success && json.theme) setThemeConfig(json.theme);
      }
    } catch {
      // Keep initial memory data
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ----------------- PAGES HANDLERS -----------------
  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageFormData.titleFa || !pageFormData.slug) {
      showToast("عنوان برگه و آدرس یکتا (Slug) الزامی هستند.", "error");
      return;
    }

    try {
      const res = await fetch("/api/admin/site-builder/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          pageData: {
            ...pageFormData,
            id: editingPage ? editingPage.id : undefined,
          },
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          showToast(`برگه '${pageFormData.titleFa}' با موفقیت ذخیره شد.`, "success");
          setIsPageModalOpen(false);
          setEditingPage(null);
          fetchData();
        }
      }
    } catch {
      showToast("خطا در ذخیره برگه", "error");
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm("آیا از حذف این برگه سفارشی اطمینان دارید؟")) return;
    try {
      const res = await fetch("/api/admin/site-builder/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", pageId }),
      });
      if (res.ok) {
        showToast("برگه با موفقیت حذف گردید.", "success");
        fetchData();
      }
    } catch {
      showToast("خطا در حذف برگه", "error");
    }
  };

  // Add block to current page form
  const handleAddBlockToPage = (type: PageBlockType) => {
    const newBlockId = `b-${type}-${Date.now()}`;
    let newBlockPayload: any;

    if (type === "hero") {
      newBlockPayload = {
        type: "hero",
        data: {
          badgeFa: "🌟 پیشنهاد ویژه",
          badgeEn: "Special Offer",
          headlineFa: "عنوان جذاب و گیرا برای لندینگ پیج جدید",
          headlineEn: "Captivating headline for the new landing page",
          subheadlineFa: "توضیحات تکمیلی در مورد مزایای دوره یا رویداد به زبان ساده و کاربردی",
          subheadlineEn: "Supplementary explanation on key learning outcomes",
          primaryCtaTextFa: "ثبت‌نام مستقیم",
          primaryCtaTextEn: "Enroll Now",
          primaryCtaUrl: "/pricing",
          bgGradient: "linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)",
        },
      };
    } else if (type === "features") {
      newBlockPayload = {
        type: "features",
        data: {
          headlineFa: "مزایای رقابتی و امکانات منحصر‌به‌فرد",
          headlineEn: "Core Features & Advantages",
          features: [
            {
              icon: "🚀",
              titleFa: "یادگیری سریع و فشرده",
              titleEn: "Accelerated Learning",
              descriptionFa: "تمرکز بر نکات کلیدی بدون اتلاف وقت.",
              descriptionEn: "Focus on essentials with zero fluff.",
            },
            {
              icon: "🎯",
              titleFa: "سنجش هوشمند هوش مصنوعی",
              titleEn: "AI Realtime Assessment",
              descriptionFa: "بازخورد لحظه‌ای بر روی خطاهای گرامری و تلفظ.",
              descriptionEn: "Immediate diagnostics on grammar and pronunciation.",
            },
          ],
        },
      };
    } else if (type === "pricing") {
      newBlockPayload = {
        type: "pricing",
        data: {
          headlineFa: "پلن‌ها و تعرفه ثبت‌نام",
          headlineEn: "Subscription Plans",
          plans: [
            {
              nameFa: "دوره فشرده طلایی",
              nameEn: "Golden Intensive Pass",
              priceToman: 590000,
              periodTextFa: "دسترسی کامل ۳ ماهه",
              periodTextEn: "3-Month Access",
              featuresFa: ["دسترسی به تمام ویدیوها", "آزمونک‌های نامحدود با AI", "پشتیبانی مدرسین"],
              featuresEn: ["Full video access", "Unlimited AI drills", "Teacher support"],
              ctaTextFa: "انتخاب پلن",
              ctaTextEn: "Choose Plan",
              ctaUrl: "/checkout",
              isPopular: true,
            },
          ],
        },
      };
    } else if (type === "faq") {
      newBlockPayload = {
        type: "faq",
        data: {
          headlineFa: "پرسش‌های متداول",
          headlineEn: "Frequently Asked Questions",
          items: [
            {
              questionFa: "آیا گواهی پایان دوره صادر می‌شود؟",
              questionEn: "Is a certificate issued upon completion?",
              answerFa: "بله، پس از قبولی در ارزیابی نهایی، گواهینامه معتبر دیجیتال صادر می‌گردد.",
              answerEn: "Yes, verified digital credentials are issued upon passing the final exam.",
            },
          ],
        },
      };
    } else {
      newBlockPayload = {
        type: "custom_html",
        data: {
          rawHtml: "<div style='padding: 2rem; background: #eff6ff; border-radius: 12px; text-align: center;'><h3>بلوک محتوای سفارشی HTML</h3><p>کدهای دلخواه یا فرم‌های ثبت‌نام را در این بخش قرار دهید.</p></div>",
        },
      };
    }

    const currentBlocks = pageFormData.blocks || [];
    const newBlock: PageBlock = {
      id: newBlockId,
      order: currentBlocks.length + 1,
      enabled: true,
      block: newBlockPayload,
    };

    setPageFormData({
      ...pageFormData,
      blocks: [...currentBlocks, newBlock],
    });
    setIsBlockModalOpen(false);
    showToast(`بلوک جدید '${type}' به صفحه اضافه شد.`, "info");
  };

  // ----------------- MENUS HANDLERS -----------------
  const handleSaveDraftMenu = async () => {
    try {
      const res = await fetch("/api/admin/site-builder/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_draft", draftConfig: draftMenu }),
      });
      if (res.ok) {
        showToast("پیش‌نویس منوهای هدر و فوتر ذخیره شد.", "info");
      }
    } catch {
      showToast("خطا در ذخیره پیش‌نویس منو", "error");
    }
  };

  const handlePublishMenu = async () => {
    try {
      const res = await fetch("/api/admin/site-builder/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish" }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.live) {
          setLiveMenu(json.live);
          showToast(`منوی زنده سایت (نسخه ${json.live.version}) با موفقیت منتشر گردید.`, "success");
          fetchData();
        }
      }
    } catch {
      showToast("خطا در انتشار عمومی منو", "error");
    }
  };

  const handleRollbackMenu = async (version: number) => {
    if (!confirm(`آیا از بازگشت به نسخه ${version} منو اطمینان دارید؟`)) return;
    try {
      const res = await fetch("/api/admin/site-builder/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rollback", targetVersion: version }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.live) {
          setLiveMenu(json.live);
          setDraftMenu(json.live);
          showToast(`منوی سایت با موفقیت به نسخه ${version} بازگردانده شد.`, "success");
          fetchData();
        }
      }
    } catch {
      showToast("خطا در بازگردانی نسخه منو", "error");
    }
  };

  const handleSaveNavItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!navFormData.fa || !navFormData.path) {
      showToast("عنوان فارسی و پیوند الزامی هستند.", "error");
      return;
    }

    const currentNav = [...(draftMenu.headerNav || [])];
    if (editingNavItem) {
      const idx = currentNav.findIndex((n) => n.id === editingNavItem.id);
      if (idx >= 0) {
        currentNav[idx] = {
          ...editingNavItem,
          ...navFormData,
          fa: navFormData.fa!,
          path: navFormData.path!,
          en: navFormData.en || navFormData.fa!,
        };
      }
    } else {
      const newItem: NavItem = {
        id: `nav-${Date.now()}`,
        path: navFormData.path!,
        fa: navFormData.fa!,
        en: navFormData.en || navFormData.fa!,
        order: currentNav.length + 1,
        badgeTextFa: navFormData.badgeTextFa,
        badgeColor: navFormData.badgeColor,
      };
      currentNav.push(newItem);
    }

    setDraftMenu({ ...draftMenu, headerNav: currentNav });
    setIsNavModalOpen(false);
    setEditingNavItem(null);
    showToast("تغییرات آیتم منو در پیش‌نویس ثبت شد. (جهت اعمال روی سایت، 'انتشار عمومی' را بزنید)", "info");
  };

  // ----------------- POPUPS HANDLERS -----------------
  const handleSavePopup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!popupFormData.titleFa || !popupFormData.messageFa) {
      showToast("عنوان و متن پیام پاپ‌آپ الزامی است.", "error");
      return;
    }

    try {
      const res = await fetch("/api/admin/site-builder/popups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          popupData: {
            ...popupFormData,
            id: editingPopup ? editingPopup.id : undefined,
          },
        }),
      });
      if (res.ok) {
        showToast("تنظیمات پاپ‌آپ با موفقیت ذخیره شد.", "success");
        setIsPopupModalOpen(false);
        setEditingPopup(null);
        fetchData();
      }
    } catch {
      showToast("خطا در ذخیره پاپ‌آپ", "error");
    }
  };

  const handleDeletePopup = async (popupId: string) => {
    if (!confirm("آیا از حذف این پاپ‌آپ اطمینان دارید؟")) return;
    try {
      const res = await fetch("/api/admin/site-builder/popups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", popupId }),
      });
      if (res.ok) {
        showToast("پاپ‌آپ با موفقیت حذف گردید.", "success");
        fetchData();
      }
    } catch {
      showToast("خطا در حذف پاپ‌آپ", "error");
    }
  };

  // ----------------- THEME HANDLERS -----------------
  const handleSaveTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingTheme(true);
    try {
      const res = await fetch("/api/admin/site-builder/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeData: themeConfig }),
      });
      if (res.ok) {
        showToast("تنظیمات تم، رنگ‌ها، فونت و اسکریپت‌های سراسری ذخیره گردید.", "success");
      }
    } catch {
      showToast("خطا در ذخیره تم", "error");
    } finally {
      setIsSavingTheme(false);
    }
  };

  return (
    <div className={styles.container} dir="rtl">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`${styles.toastMessage} ${
            toast.type === "success" ? styles.toastSuccess : toast.type === "error" ? styles.toastError : styles.toastInfo
          }`}
        >
          <span>{toast.type === "success" ? "✅" : toast.type === "error" ? "⚠️" : "ℹ️"}</span>
          <span>{toast.text}</span>
        </div>
      )}

      {/* Main Header & Sub-Tabs Navigation */}
      <div className={styles.headerCard}>
        <div className={styles.topRow}>
          <div className={styles.titleArea}>
            <h2>🎨 استودیو ساخت سایت، صفحات سفارشی و ناوبری (Site Builder & Navigation Studio)</h2>
            <p>
              مرکز فرماندهی طراحی وب‌سایت: ساخت لندینگ‌پیج‌های دلخواه با بلوک‌های بصری، مدیریت منوهای هدر و فوتر با
              قابلیت Rollback، پاپ‌آپ‌های زمان‌بندی‌شده و شخصی‌سازی فونت و رنگ سازمانی
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => {
                fetchData();
                showToast("اطلاعات صفحات، منوها و پاپ‌آپ‌ها به‌روزرسانی شد.", "info");
              }}
            >
              <span>🔄 تازه‌سازی داده‌ها</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs Nav */}
        <div className={styles.subTabsNav}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeSubTab === "pages" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveSubTab("pages")}
          >
            <span>📄</span>
            <span>صفحه‌ساز پویا و صفحات سفارشی</span>
            <span className={styles.tabBadge}>{pages.length} برگه</span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeSubTab === "menus" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveSubTab("menus")}
          >
            <span>🧭</span>
            <span>استودیو منوها و ناوبری زنده</span>
            <span className={styles.tabBadge}>نسخه {liveMenu.version}</span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeSubTab === "popups" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveSubTab("popups")}
          >
            <span>📢</span>
            <span>پاپ‌آپ‌ها و بنرهای شناور</span>
            <span className={styles.tabBadge}>{popups.filter((p) => p.isActive).length} فعال</span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeSubTab === "theme" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveSubTab("theme")}
          >
            <span>🎨</span>
            <span>شخصی‌سازی تم، فونت و کدها</span>
            <span className={styles.tabBadge}>{themeConfig.persianFontFamily}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: PAGES & MODULAR BLOCK BUILDER */}
      {/* ========================================================================= */}
      {activeSubTab === "pages" && (
        <div className={styles.sectionCard}>
          <div className={styles.filterBar}>
            <div className={styles.filterGroup}>
              <input
                type="text"
                placeholder="جستجو در برگه‌ها بر اساس عنوان یا آدرس..."
                className={styles.searchInput}
                value={searchPageQuery}
                onChange={(e) => setSearchPageQuery(e.target.value)}
              />

              <select
                className={styles.selectInput}
                value={filterPageStatus}
                onChange={(e) => setFilterPageStatus(e.target.value)}
              >
                <option value="all">تمام وضعیت‌ها</option>
                <option value="published">منتشر شده (Published)</option>
                <option value="draft">پیش‌نویس (Draft)</option>
              </select>
            </div>

            <div>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => {
                  setEditingPage(null);
                  setPageFormData({
                    slug: "",
                    titleFa: "",
                    titleEn: "",
                    metaTitleFa: "",
                    metaDescriptionFa: "",
                    status: "draft",
                    blocks: [],
                  });
                  setIsPageModalOpen(true);
                }}
              >
                <span>➕ ساخت برگه سفارشی جدید</span>
              </button>
            </div>
          </div>

          {/* Pages Table */}
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>عنوان برگه</th>
                <th>آدرس عمومی (Slug)</th>
                <th>وضعیت</th>
                <th>تعداد بلوک‌ها</th>
                <th>تعداد بازدیدها</th>
                <th>آخرین به‌روزرسانی</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {pages
                .filter(
                  (p) =>
                    (filterPageStatus === "all" || p.status === filterPageStatus) &&
                    (p.titleFa.toLowerCase().includes(searchPageQuery.toLowerCase()) ||
                      p.slug.toLowerCase().includes(searchPageQuery.toLowerCase()))
                )
                .map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.titleFa}</strong>
                      <span style={{ fontSize: "0.78rem", color: "#64748b", display: "block" }}>{p.titleEn}</span>
                    </td>
                    <td>
                      <Link
                        href={`/p/${p.slug}`}
                        target="_blank"
                        style={{ color: "#2563eb", fontFamily: "monospace", textDecoration: "none", fontWeight: "bold" }}
                      >
                        /p/{p.slug} ↗
                      </Link>
                    </td>
                    <td>
                      <span className={p.status === "published" ? styles.badgePublished : styles.badgeDraft}>
                        {p.status === "published" ? "🟢 منتشر شده" : "⚪ پیش‌نویس"}
                      </span>
                    </td>
                    <td>
                      <span style={{ background: "#f1f5f9", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.8rem" }}>
                        🧩 {p.blocks?.length || 0} بلوک
                      </span>
                    </td>
                    <td style={{ fontFamily: "monospace", fontWeight: "bold" }}>
                      {p.viewsCount.toLocaleString("fa-IR")}
                    </td>
                    <td style={{ fontSize: "0.8rem", color: "#64748b" }}>{p.updatedAt}</td>
                    <td>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button
                          type="button"
                          className={styles.btnSecondary}
                          style={{ fontSize: "0.78rem", padding: "0.25rem 0.6rem" }}
                          onClick={() => setPreviewDrawerPage(p)}
                        >
                          👁️ پیش‌نمایش
                        </button>
                        <button
                          type="button"
                          className={styles.btnSecondary}
                          style={{ fontSize: "0.78rem", padding: "0.25rem 0.6rem" }}
                          onClick={() => {
                            setEditingPage(p);
                            setPageFormData(p);
                            setIsPageModalOpen(true);
                          }}
                        >
                          ✏️ ویرایش
                        </button>
                        <button
                          type="button"
                          className={styles.btnDanger}
                          style={{ fontSize: "0.78rem", padding: "0.25rem 0.5rem" }}
                          onClick={() => handleDeletePage(p.id)}
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Live Page Preview Drawer */}
          {previewDrawerPage && (
            <div className={styles.modalBackdrop}>
              <div className={styles.modalWindow} style={{ maxWidth: "1000px", height: "90vh" }}>
                <div className={styles.modalHeader}>
                  <h3>👁️ پیش‌نمایش زنده برگه: {previewDrawerPage.titleFa}</h3>
                  <button
                    type="button"
                    className={styles.btnSecondary}
                    onClick={() => setPreviewDrawerPage(null)}
                  >
                    ✕ بستن پیش‌نمایش
                  </button>
                </div>
                <div style={{ padding: "1.5rem", overflowY: "auto", background: "#f8fafc" }}>
                  <DynamicPageRenderer page={previewDrawerPage} locale="fa" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: NAVIGATION & MENUS STUDIO */}
      {/* ========================================================================= */}
      {activeSubTab === "menus" && (
        <div className={styles.sectionCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem", fontWeight: "800" }}>
                استودیو ناوبری، منوهای هدر و ستون‌های فوتر (Navigation & Menus Studio)
              </h3>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                تغییر زنده آیتم‌های نوار بالای سایت، بج‌های رنگی، زیرمنوها و فوتر با پشتیبانی از بازگشت به نسخه قبل (Rollback)
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button type="button" className={styles.btnSecondary} onClick={handleSaveDraftMenu}>
                💾 ذخیره پیش‌نویس
              </button>
              <button type="button" className={styles.btnPrimary} onClick={handlePublishMenu}>
                🚀 انتشار عمومی منو (Live)
              </button>

              {menuHistory.length > 1 && (
                <select
                  className={styles.selectInput}
                  onChange={(e) => handleRollbackMenu(Number(e.target.value))}
                  defaultValue=""
                >
                  <option value="" disabled>
                    🔄 بازگشت به نسخه قبلی...
                  </option>
                  {menuHistory.map((m) => (
                    <option key={m.version} value={m.version}>
                      نسخه {m.version} ({m.updatedAt})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Header Simulation Box */}
          <div className={styles.headerSimBox}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#0f172a" }}>
                🖥️ شبیه‌ساز زنده نوار ناوبری بالای سایت (Live Header Navbar Preview):
              </span>
              <span style={{ fontSize: "0.75rem", background: "#dbeafe", color: "#1e40af", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: "bold" }}>
                وضعیت: پیش‌نمایش در حال ویرایش
              </span>
            </div>

            <div className={styles.simNavbar}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ fontSize: "1.2rem", fontWeight: "900", color: "#2563eb", fontFamily: "monospace" }}>
                  Endoora
                </span>
                <div className={styles.simNavLinks}>
                  {draftMenu.headerNav?.map((item) => (
                    <div key={item.id} className={styles.simNavLinkItem}>
                      <span>{item.fa}</span>
                      {item.badgeTextFa && (
                        <span
                          style={{
                            background: item.badgeColor || "#16a34a",
                            color: "#ffffff",
                            fontSize: "0.68rem",
                            padding: "0.1rem 0.4rem",
                            borderRadius: "4px",
                            fontWeight: "bold",
                          }}
                        >
                          {item.badgeTextFa}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.78rem", fontWeight: "bold" }}
                >
                  حساب کاربری
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Items Manager Table */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
            <span style={{ fontSize: "0.95rem", fontWeight: "800", color: "#0f172a" }}>
              📋 فهرست لینک‌های هدر ({draftMenu.headerNav?.length || 0} لینک):
            </span>
            <button
              type="button"
              className={styles.btnPrimary}
              style={{ fontSize: "0.8rem" }}
              onClick={() => {
                setEditingNavItem(null);
                setNavFormData({
                  fa: "",
                  en: "",
                  path: "/",
                  badgeTextFa: "",
                  badgeColor: "#16a34a",
                  order: (draftMenu.headerNav?.length || 0) + 1,
                });
                setIsNavModalOpen(true);
              }}
            >
              ➕ افزودن لینک جدید به هدر
            </button>
          </div>

          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>ترتیب</th>
                <th>عنوان منو (فارسی)</th>
                <th>عنوان (انگلیسی)</th>
                <th>مسیر پیوند (URL)</th>
                <th>برچسب ویژه (Badge)</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {draftMenu.headerNav?.map((item, idx) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: "bold" }}>{idx + 1}</td>
                  <td>
                    <strong>{item.fa}</strong>
                  </td>
                  <td style={{ color: "#64748b" }}>{item.en}</td>
                  <td>
                    <code style={{ background: "#f1f5f9", padding: "0.2rem 0.4rem", borderRadius: "4px" }}>
                      {item.path}
                    </code>
                  </td>
                  <td>
                    {item.badgeTextFa ? (
                      <span
                        style={{
                          background: item.badgeColor || "#16a34a",
                          color: "#ffffff",
                          fontSize: "0.72rem",
                          padding: "0.15rem 0.45rem",
                          borderRadius: "4px",
                          fontWeight: "bold",
                        }}
                      >
                        {item.badgeTextFa}
                      </span>
                    ) : (
                      <span style={{ color: "#94a3b8" }}>-</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button
                        type="button"
                        className={styles.btnSecondary}
                        style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem" }}
                        onClick={() => {
                          setEditingNavItem(item);
                          setNavFormData(item);
                          setIsNavModalOpen(true);
                        }}
                      >
                        ویرایش
                      </button>
                      <button
                        type="button"
                        className={styles.btnDanger}
                        style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem" }}
                        onClick={() => {
                          const updated = draftMenu.headerNav.filter((n) => n.id !== item.id);
                          setDraftMenu({ ...draftMenu, headerNav: updated });
                          showToast("آیتم از هدر حذف شد.", "info");
                        }}
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: POPUPS & FLOATING BANNERS */}
      {/* ========================================================================= */}
      {activeSubTab === "popups" && (
        <div className={styles.sectionCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem", fontWeight: "800" }}>
                مدیریت پاپ‌آپ‌ها، بنرها و ابزارک‌های تبلیغاتی هوشمند
              </h3>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                طراحی انواع مدال سنتر، نوار شمارش معکوس تخفیف و توست با قابلیت تریگر خروج، اسکرول و تارگتینگ صفحات
              </p>
            </div>

            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => {
                setEditingPopup(null);
                setPopupFormData({
                  titleFa: "",
                  titleEn: "",
                  type: "center_modal",
                  isActive: true,
                  messageFa: "",
                  messageEn: "",
                  couponCode: "",
                  ctaTextFa: "مشاهده پیشنهاد",
                  ctaUrl: "/pricing",
                  triggerType: "time_delay",
                  triggerDelaySeconds: 3,
                  triggerScrollPercent: 50,
                  targetPaths: ["*"],
                  frequencyCap: "once_per_session",
                });
                setIsPopupModalOpen(true);
              }}
            >
              <span>➕ ایجاد پاپ‌آپ یا بنر شناور جدید</span>
            </button>
          </div>

          {/* Popups Table */}
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>عنوان پاپ‌آپ</th>
                <th>نوع المان</th>
                <th>رفتار ماشه (Trigger)</th>
                <th>صفحات هدف</th>
                <th>تعداد نمایش</th>
                <th>کلیک‌ها (CTR)</th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {popups.map((p) => {
                const ctr = p.impressionsCount > 0 ? ((p.clicksCount / p.impressionsCount) * 100).toFixed(1) : "0.0";
                return (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.titleFa}</strong>
                      {p.couponCode && (
                        <span style={{ fontSize: "0.75rem", color: "#2563eb", display: "block" }}>
                          🎟️ کد: {p.couponCode}
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{ background: "#f1f5f9", padding: "0.2rem 0.55rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold" }}>
                        {p.type === "center_modal"
                          ? "🪟 مدال سنتر"
                          : p.type === "top_countdown_ribbon"
                          ? "⏱️ نوار شمارش معکوس"
                          : "💬 توست اعلان"}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.8rem", color: "#475569" }}>
                      {p.triggerType === "time_delay"
                        ? `⏱️ تاخیر ${p.triggerDelaySeconds} ثانیه‌ای`
                        : p.triggerType === "exit_intent"
                        ? "🚪 هنگام خروج از صفحه"
                        : "📜 اسکرول ۵۰٪ صفحه"}
                    </td>
                    <td>
                      <code style={{ fontSize: "0.78rem" }}>{p.targetPaths.join(", ")}</code>
                    </td>
                    <td style={{ fontFamily: "monospace", fontWeight: "bold" }}>
                      {p.impressionsCount.toLocaleString("fa-IR")}
                    </td>
                    <td>
                      <span style={{ color: "#16a34a", fontWeight: "bold" }}>
                        {p.clicksCount} ({ctr}%)
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={p.isActive ? styles.btnSuccess : styles.btnSecondary}
                        style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem" }}
                        onClick={async () => {
                          const updated = { ...p, isActive: !p.isActive };
                          await fetch("/api/admin/site-builder/popups", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ action: "save", popupData: updated }),
                          });
                          fetchData();
                          showToast(`وضعیت به '${updated.isActive ? "فعال" : "غیرفعال"}' تغییر یافت.`, "info");
                        }}
                      >
                        {p.isActive ? "🟢 فعال" : "⚪ خاموش"}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button
                          type="button"
                          className={styles.btnSecondary}
                          style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem" }}
                          onClick={() => setSimulatedPopup(p)}
                        >
                          👁️ تست
                        </button>
                        <button
                          type="button"
                          className={styles.btnSecondary}
                          style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem" }}
                          onClick={() => {
                            setEditingPopup(p);
                            setPopupFormData(p);
                            setIsPopupModalOpen(true);
                          }}
                        >
                          ویرایش
                        </button>
                        <button
                          type="button"
                          className={styles.btnDanger}
                          style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem" }}
                          onClick={() => handleDeletePopup(p.id)}
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Live Simulator Modal */}
          {simulatedPopup && (
            <div className={styles.modalBackdrop}>
              <div className={styles.modalWindow} style={{ maxWidth: "520px" }}>
                <div className={styles.modalHeader}>
                  <h3>👁️ شبیه‌ساز پاپ‌آپ: {simulatedPopup.titleFa}</h3>
                  <button
                    type="button"
                    className={styles.btnSecondary}
                    onClick={() => setSimulatedPopup(null)}
                  >
                    ✕ بستن
                  </button>
                </div>
                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", textAlign: "center" }}>
                  {simulatedPopup.imageUrl && (
                    <img
                      src={simulatedPopup.imageUrl}
                      alt={simulatedPopup.titleFa}
                      style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px" }}
                    />
                  )}
                  <h4 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "800" }}>{simulatedPopup.titleFa}</h4>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#475569" }}>{simulatedPopup.messageFa}</p>
                  {simulatedPopup.couponCode && (
                    <div style={{ background: "#f1f5f9", padding: "0.75rem", borderRadius: "8px", border: "1px dashed #cbd5e1" }}>
                      کد تخفیف: <strong>{simulatedPopup.couponCode}</strong>
                    </div>
                  )}
                  <button type="button" className={styles.btnPrimary} style={{ alignSelf: "center" }}>
                    {simulatedPopup.ctaTextFa || "کلیک روی دکمه"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: GLOBAL THEME, FONTS & CUSTOM CODE */}
      {/* ========================================================================= */}
      {activeSubTab === "theme" && (
        <form onSubmit={handleSaveTheme} className={styles.sectionCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem", fontWeight: "800" }}>
                شخصی‌سازی تم، رنگ‌های سازمانی و فونت‌های فارسی
              </h3>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                کنترل یکپارچه پالت رنگ، تایپوگرافی، انحنای المان‌ها و تزریق ایمن کدهای CSS و اسکریپت‌های تحلیلی
              </p>
            </div>

            <button type="submit" className={styles.btnPrimary} disabled={isSavingTheme}>
              {isSavingTheme ? "در حال ذخیره‌سازی..." : "💾 ذخیره تنظیمات تم و استایل"}
            </button>
          </div>

          <div className={styles.splitGrid}>
            {/* Left Box: Colors & Typography */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <span style={{ fontSize: "0.95rem", fontWeight: "800", color: "#0f172a" }}>
                🎨 پالت رنگ‌های هویت بصری:
              </span>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className={styles.formField}>
                  <label>رنگ اصلی سازمانی (Primary Brand):</label>
                  <div className={styles.swatchBox}>
                    <input
                      type="color"
                      value={themeConfig.brandPrimaryColor}
                      onChange={(e) => setThemeConfig({ ...themeConfig, brandPrimaryColor: e.target.value })}
                    />
                    <input
                      type="text"
                      className={styles.formInput}
                      style={{ fontFamily: "monospace" }}
                      value={themeConfig.brandPrimaryColor}
                      onChange={(e) => setThemeConfig({ ...themeConfig, brandPrimaryColor: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>رنگ تاکید موفقیت (Accent Color):</label>
                  <div className={styles.swatchBox}>
                    <input
                      type="color"
                      value={themeConfig.brandAccentColor}
                      onChange={(e) => setThemeConfig({ ...themeConfig, brandAccentColor: e.target.value })}
                    />
                    <input
                      type="text"
                      className={styles.formInput}
                      style={{ fontFamily: "monospace" }}
                      value={themeConfig.brandAccentColor}
                      onChange={(e) => setThemeConfig({ ...themeConfig, brandAccentColor: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <span style={{ fontSize: "0.95rem", fontWeight: "800", color: "#0f172a", marginTop: "0.5rem" }}>
                🔤 تایپوگرافی و فونت‌های استاندارد:
              </span>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className={styles.formField}>
                  <label>فونت اصلی زبان فارسی:</label>
                  <select
                    className={styles.selectInput}
                    value={themeConfig.persianFontFamily}
                    onChange={(e) => setThemeConfig({ ...themeConfig, persianFontFamily: e.target.value as any })}
                  >
                    <option value="Vazirmatn">وزیرمتن (Vazirmatn) - پیش‌فرض</option>
                    <option value="Shabnam">شبنم (Shabnam)</option>
                    <option value="Dana">دانا (Dana)</option>
                    <option value="Yekan Bakh">یکان‌بخ (Yekan Bakh)</option>
                    <option value="Sahel">ساحل (Sahel)</option>
                  </select>
                </div>

                <div className={styles.formField}>
                  <label>فونت متون انگلیسی و آیلتس:</label>
                  <select
                    className={styles.selectInput}
                    value={themeConfig.englishFontFamily}
                    onChange={(e) => setThemeConfig({ ...themeConfig, englishFontFamily: e.target.value as any })}
                  >
                    <option value="Inter">اینتر (Inter) - مدرن</option>
                    <option value="Roboto">روبوتو (Roboto)</option>
                    <option value="Poppins">پوپینز (Poppins)</option>
                  </select>
                </div>
              </div>

              <div className={styles.formField}>
                <label>مقیاس گردی المان‌ها (Border Radius):</label>
                <select
                  className={styles.selectInput}
                  value={themeConfig.borderRadiusScale}
                  onChange={(e) => setThemeConfig({ ...themeConfig, borderRadiusScale: e.target.value as any })}
                >
                  <option value="sharp">گوشه‌های تیز (Sharp - 0px)</option>
                  <option value="moderate">متوسط (Moderate - 6px)</option>
                  <option value="rounded">گرد استاندارد (Rounded - 12px)</option>
                  <option value="pill">کپسولی (Pill - 24px)</option>
                </select>
              </div>
            </div>

            {/* Right Box: Custom CSS & Head Scripts */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ background: "#f8fafc", padding: "1.25rem", borderRadius: "10px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.95rem", fontWeight: "800", color: "#0f172a" }}>
                    💅 تزریق کدهای سفارشی استایل (Custom CSS):
                  </span>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontSize: "0.8rem" }}>
                    <input
                      type="checkbox"
                      checked={themeConfig.customCssEnabled}
                      onChange={(e) => setThemeConfig({ ...themeConfig, customCssEnabled: e.target.checked })}
                    />
                    <span>فعال‌سازی در سایت</span>
                  </label>
                </div>
                <textarea
                  className={styles.formTextarea}
                  style={{ fontFamily: "monospace", fontSize: "0.82rem", minHeight: "120px", direction: "ltr" }}
                  value={themeConfig.customCssCode}
                  onChange={(e) => setThemeConfig({ ...themeConfig, customCssCode: e.target.value })}
                />
              </div>

              <div style={{ background: "#f8fafc", padding: "1.25rem", borderRadius: "10px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.95rem", fontWeight: "800", color: "#0f172a" }}>
                    🏷️ اسکریپت‌های تحلیلی و تگ‌های سربرگ (Head Scripts):
                  </span>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontSize: "0.8rem" }}>
                    <input
                      type="checkbox"
                      checked={themeConfig.headScriptsEnabled}
                      onChange={(e) => setThemeConfig({ ...themeConfig, headScriptsEnabled: e.target.checked })}
                    />
                    <span>فعال‌سازی اسکریپت‌ها</span>
                  </label>
                </div>
                <textarea
                  className={styles.formTextarea}
                  style={{ fontFamily: "monospace", fontSize: "0.82rem", minHeight: "120px", direction: "ltr" }}
                  placeholder="<!-- <script src='https://www.googletagmanager.com/...'></script> -->"
                  value={themeConfig.headScriptsCode}
                  onChange={(e) => setThemeConfig({ ...themeConfig, headScriptsCode: e.target.value })}
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT CUSTOM PAGE */}
      {/* ========================================================================= */}
      {isPageModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalWindow} style={{ maxWidth: "780px" }}>
            <div className={styles.modalHeader}>
              <h3>{editingPage ? "✏️ ویرایش برگه سفارشی" : "➕ ساخت برگه سفارشی جدید"}</h3>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => setIsPageModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSavePage}>
              <div className={styles.modalBody}>
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "0.75rem" }}>
                  <div className={styles.formField}>
                    <label>عنوان برگه (فارسی):</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: جشنواره جمعه سیاه ایندورا"
                      className={styles.formInput}
                      value={pageFormData.titleFa || ""}
                      onChange={(e) => setPageFormData({ ...pageFormData, titleFa: e.target.value })}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>آدرس یکتا پیوند (Slug):</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", direction: "ltr" }}>
                      <span style={{ fontSize: "0.82rem", color: "#64748b" }}>/p/</span>
                      <input
                        type="text"
                        required
                        placeholder="black-friday"
                        className={styles.formInput}
                        style={{ flex: 1 }}
                        value={pageFormData.slug || ""}
                        onChange={(e) => setPageFormData({ ...pageFormData, slug: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div className={styles.formField}>
                    <label>عنوان انگلیسی:</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={pageFormData.titleEn || ""}
                      onChange={(e) => setPageFormData({ ...pageFormData, titleEn: e.target.value })}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>وضعیت انتشار:</label>
                    <select
                      className={styles.selectInput}
                      value={pageFormData.status || "draft"}
                      onChange={(e) => setPageFormData({ ...pageFormData, status: e.target.value as any })}
                    >
                      <option value="draft">پیش‌نویس (عدم نمایش عمومی)</option>
                      <option value="published">انتشار زنده (نمایش در /p/[slug])</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>متا دسکریپشن سئو (SEO Description):</label>
                  <textarea
                    className={styles.formTextarea}
                    placeholder="توضیحات کوتاه برای نمایش در نتایج جستجوی گوگل..."
                    value={pageFormData.metaDescriptionFa || ""}
                    onChange={(e) => setPageFormData({ ...pageFormData, metaDescriptionFa: e.target.value })}
                  />
                </div>

                {/* Blocks Composer Area */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.92rem", fontWeight: "800", color: "#0f172a" }}>
                      🧩 بلوک‌های چیدمان این برگه ({pageFormData.blocks?.length || 0} بلوک):
                    </span>
                    <button
                      type="button"
                      className={styles.btnPrimary}
                      style={{ fontSize: "0.78rem" }}
                      onClick={() => setIsBlockModalOpen(true)}
                    >
                      ➕ افزودن بلوک جدید
                    </button>
                  </div>

                  <div className={styles.blockList}>
                    {(!pageFormData.blocks || pageFormData.blocks.length === 0) ? (
                      <div style={{ textAlign: "center", padding: "1.5rem", color: "#94a3b8" }}>
                        هنوز بلوکی به این برگه اضافه نشده است. روی دکمه «افزودن بلوک جدید» کلیک کنید.
                      </div>
                    ) : (
                      pageFormData.blocks.map((b, idx) => (
                        <div key={b.id} className={styles.blockCardItem}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <span style={{ background: "#e2e8f0", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "bold" }}>
                              {idx + 1}
                            </span>
                            <span style={{ background: "#dbeafe", color: "#1e40af", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold" }}>
                              {b.block.type.toUpperCase()}
                            </span>
                            <strong style={{ fontSize: "0.88rem" }}>
                              {(b.block as any).data.headlineFa || (b.block as any).data.titleFa || "بلوک محتوا"}
                            </strong>
                          </div>

                          <div style={{ display: "flex", gap: "0.35rem" }}>
                            <button
                              type="button"
                              className={styles.btnDanger}
                              style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem" }}
                              onClick={() => {
                                const filtered = pageFormData.blocks?.filter((item) => item.id !== b.id);
                                setPageFormData({ ...pageFormData, blocks: filtered });
                              }}
                            >
                              حذف
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={() => setIsPageModalOpen(false)}>
                  انصراف
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  ذخیره برگه سفارشی
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD BLOCK CHOOSER */}
      {/* ========================================================================= */}
      {isBlockModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalWindow} style={{ maxWidth: "520px" }}>
            <div className={styles.modalHeader}>
              <h3>➕ انتخاب نوع بلوک برای افزودن</h3>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => setIsBlockModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formField}>
                <label>نوع بلوک مورد نظر را انتخاب نمایید:</label>
                <select
                  className={styles.selectInput}
                  value={selectedBlockType}
                  onChange={(e) => setSelectedBlockType(e.target.value as any)}
                >
                  <option value="hero">🌟 بنر بالایی و هدر (Hero Banner)</option>
                  <option value="features">🚀 شبکه کارت‌های ویژگی‌ها (Features Grid)</option>
                  <option value="video">🎬 نمایش ویدیو و فایل مکمل (Video Showcase)</option>
                  <option value="pricing">💳 کارت‌های تعرفه و خرید (Pricing Plans)</option>
                  <option value="faq">❓ آکاردئون پرسش‌های متداول (FAQ Accordion)</option>
                  <option value="custom_html">💻 کد سفارشی HTML / ابزارک خام (Custom HTML)</option>
                </select>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.btnSecondary} onClick={() => setIsBlockModalOpen(false)}>
                انصراف
              </button>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => handleAddBlockToPage(selectedBlockType)}
              >
                افزودن این بلوک به برگه
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT NAV LINK */}
      {/* ========================================================================= */}
      {isNavModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalWindow} style={{ maxWidth: "520px" }}>
            <div className={styles.modalHeader}>
              <h3>{editingNavItem ? "✏️ ویرایش لینک هدر" : "➕ افزودن لینک جدید به هدر"}</h3>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => setIsNavModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveNavItem}>
              <div className={styles.modalBody}>
                <div className={styles.formField}>
                  <label>عنوان منو (فارسی):</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: کمپ امتحان نهایی"
                    className={styles.formInput}
                    value={navFormData.fa || ""}
                    onChange={(e) => setNavFormData({ ...navFormData, fa: e.target.value })}
                  />
                </div>

                <div className={styles.formField}>
                  <label>عنوان منو (انگلیسی):</label>
                  <input
                    type="text"
                    placeholder="Exam Cram Camp"
                    className={styles.formInput}
                    value={navFormData.en || ""}
                    onChange={(e) => setNavFormData({ ...navFormData, en: e.target.value })}
                  />
                </div>

                <div className={styles.formField}>
                  <label>مسیر پیوند (URL Path):</label>
                  <input
                    type="text"
                    required
                    placeholder="/p/exam-cram-1403"
                    className={styles.formInput}
                    value={navFormData.path || ""}
                    onChange={(e) => setNavFormData({ ...navFormData, path: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "0.75rem" }}>
                  <div className={styles.formField}>
                    <label>برچسب متنی ویژه (اختیاری):</label>
                    <input
                      type="text"
                      placeholder="مثال: جدید، ۵۰٪"
                      className={styles.formInput}
                      value={navFormData.badgeTextFa || ""}
                      onChange={(e) => setNavFormData({ ...navFormData, badgeTextFa: e.target.value })}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>رنگ برچسب:</label>
                    <input
                      type="color"
                      value={navFormData.badgeColor || "#16a34a"}
                      onChange={(e) => setNavFormData({ ...navFormData, badgeColor: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={() => setIsNavModalOpen(false)}>
                  انصراف
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  ذخیره لینک در هدر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT POPUP */}
      {/* ========================================================================= */}
      {isPopupModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalWindow} style={{ maxWidth: "620px" }}>
            <div className={styles.modalHeader}>
              <h3>{editingPopup ? "✏️ ویرایش پاپ‌آپ تبلیغاتی" : "➕ ایجاد پاپ‌آپ یا بنر شناور جدید"}</h3>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => setIsPopupModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSavePopup}>
              <div className={styles.modalBody}>
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "0.75rem" }}>
                  <div className={styles.formField}>
                    <label>عنوان پاپ‌آپ (داخلی/مدیریتی):</label>
                    <input
                      type="text"
                      required
                      placeholder="کمپین تخفیف یلدا"
                      className={styles.formInput}
                      value={popupFormData.titleFa || ""}
                      onChange={(e) => setPopupFormData({ ...popupFormData, titleFa: e.target.value })}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>نوع المان شناور:</label>
                    <select
                      className={styles.selectInput}
                      value={popupFormData.type || "center_modal"}
                      onChange={(e) => setPopupFormData({ ...popupFormData, type: e.target.value as any })}
                    >
                      <option value="center_modal">🪟 مدال سنتر (Center Modal)</option>
                      <option value="top_countdown_ribbon">⏱️ نوار شمارش معکوس بالا (Top Ribbon)</option>
                      <option value="bottom_toast_ribbon">💬 اعلان گوشه صفحه (Bottom Toast)</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>پیام و متن اصلی پاپ‌آپ:</label>
                  <textarea
                    required
                    className={styles.formTextarea}
                    placeholder="متن پیام جذاب و وسوسه‌انگیز برای ترغیب زبان‌آموز..."
                    value={popupFormData.messageFa || ""}
                    onChange={(e) => setPopupFormData({ ...popupFormData, messageFa: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div className={styles.formField}>
                    <label>کد تخفیف اختصاصی (اختیاری):</label>
                    <input
                      type="text"
                      placeholder="e.g. YALDA50"
                      className={styles.formInput}
                      value={popupFormData.couponCode || ""}
                      onChange={(e) => setPopupFormData({ ...popupFormData, couponCode: e.target.value })}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>لینک دکمه (CTA URL):</label>
                    <input
                      type="text"
                      placeholder="/pricing?coupon=YALDA50"
                      className={styles.formInput}
                      value={popupFormData.ctaUrl || ""}
                      onChange={(e) => setPopupFormData({ ...popupFormData, ctaUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div className={styles.formField}>
                    <label>رفتار ماشه (Trigger):</label>
                    <select
                      className={styles.selectInput}
                      value={popupFormData.triggerType || "time_delay"}
                      onChange={(e) => setPopupFormData({ ...popupFormData, triggerType: e.target.value as any })}
                    >
                      <option value="time_delay">⏱️ تاخیر زمانی (Time Delay)</option>
                      <option value="exit_intent">🚪 خروج کاربر (Exit Intent)</option>
                      <option value="scroll_depth">📜 اسکرول صفحه (Scroll Depth)</option>
                    </select>
                  </div>
                  <div className={styles.formField}>
                    <label>تاخیر زمانی (ثانیه):</label>
                    <input
                      type="number"
                      className={styles.formInput}
                      value={popupFormData.triggerDelaySeconds || 3}
                      onChange={(e) => setPopupFormData({ ...popupFormData, triggerDelaySeconds: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>آدرس تصویر (برای مدال سنتر):</label>
                  <input
                    type="url"
                    placeholder="https://.../banner.jpg"
                    className={styles.formInput}
                    value={popupFormData.imageUrl || ""}
                    onChange={(e) => setPopupFormData({ ...popupFormData, imageUrl: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={() => setIsPopupModalOpen(false)}>
                  انصراف
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  ذخیره پاپ‌آپ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
